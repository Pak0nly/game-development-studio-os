// Figure templates (collision shape) and the deterministic top-down step.
// Port of core/physics.js.
//
// Determinism contract: only + - * / and Math.Sqrt on doubles, plus
// Math.Floor (exact) and integer arithmetic. No trigonometry, no float, no
// fused multiply-add, no vector types. Loop orders are part of the contract.
//
// World axes are the canvas axes: x to the right, y downward. A figure's front
// is the canvas top, so with front vector (fx, fy) = (0, -1) the figure looks
// exactly as on the canvas. Local cell (lx, ly) maps to the world as
//   wx = x + (-fy) * lx - fx * ly
//   wy = y +   fx  * lx + (-fy) * ly
using System;
using System.Collections.Generic;

namespace Inkweight.Core
{
    // Immutable template of a drawing: stats plus collision cells, listed in
    // ascending cell index (y * W + x).
    public sealed class InkFigure
    {
        public InkStats Stats;
        public int W, H;
        public double Cx, Cy;
        public int Count;
        public double[] Lx, Ly;
        public bool[] Sharp;
        public int[] Colour;
        public int[] Boundary;
        public int[] Grid;
        public double Radius, Mass, AccelK, TurnRate, TurnCos, TurnSin;
    }

    // One moving instance of a figure template.
    public sealed class InkBody
    {
        public InkFigure Fig;
        public int Team;
        public double X, Y, Vx, Vy, Fx, Fy;
        public double Hp, MaxHp;
        public bool Alive;
        public double TopSpeed, DamageMult;
        public double DashTicks, DashCd, DashDx, DashDy;
    }

    public struct InkInput
    {
        public double Mx, My;
        public bool Dash;
        public InkInput(double mx, double my, bool dash) { Mx = mx; My = my; Dash = dash; }
    }

    public struct InkEvent
    {
        public const string Hit = "hit";
        public const string Out = "out";
        public const string Throw = "throw";
        public const string ShotHit = "shotHit";
        public const string EnemyDown = "enemyDown";
        public const string Pickup = "pickup";

        public string Type;
        public int From, To; // hit: bodies; shotHit: To; out: To = seat; enemyDown: To = body index
        public double Damage; // hit, shotHit; pickup: value
        public bool Sharp;
        public string Reason; // out
    }

    public sealed class InkWorld
    {
        public List<InkBody> Bodies;
        public double[] Cd; // Cd[i * n + j] = ticks until body i may damage body j again
        public List<InkEvent> Events = new List<InkEvent>();
        public double WallRadius;

        // scratch result of the cell scan of one pair
        internal double ScanSx, ScanSy, ScanMaxDepth;
        internal int ScanHits;
        internal bool ScanPSharp, ScanQSharp;
    }

    public static class InkPhysics
    {
        public static InkFigure BuildFigure(int[] cells, int W, int H, InkTuning tuning, string kind, double? budget)
        {
            InkStats stats = InkDrawing.ComputeStats(cells, W, H, tuning, kind, budget);
            int[] body = InkDrawing.ExtractBody(cells, W, H).Body;
            List<double> lx = new List<double>();
            List<double> ly = new List<double>();
            List<bool> sharp = new List<bool>();
            List<int> colour = new List<int>();
            List<int> boundary = new List<int>();
            int[] grid = new int[W * H];
            for (int y = 0; y < H; y++)
            {
                for (int x = 0; x < W; x++)
                {
                    int i = y * W + x;
                    int v = body[i];
                    if (v == 0) { grid[i] = -1; continue; }
                    int k = lx.Count;
                    grid[i] = k;
                    lx.Add(x + 0.5 - stats.Cx);
                    ly.Add(y + 0.5 - stats.Cy);
                    colour.Add(v);
                    int nb = InkDrawing.CountNeighbours(body, W, H, x, y);
                    sharp.Add(8 - nb >= tuning.SharpMinEmptyNeighbours);
                    if (nb < 8) boundary.Add(k);
                }
            }
            double dN = stats.N;
            double turnRate = tuning.TurnBase / (1 + stats.Inertia / tuning.TurnInertiaRef);
            double t = turnRate / (2 * tuning.TickRate);
            double accelK = tuning.AccelBase / (1 + dN / tuning.AccelWeightRef) / tuning.TickRate;
            if (accelK > 1) accelK = 1;
            InkFigure f = new InkFigure();
            f.Stats = stats;
            f.W = W; f.H = H;
            f.Cx = stats.Cx; f.Cy = stats.Cy;
            f.Count = lx.Count;
            f.Lx = lx.ToArray(); f.Ly = ly.ToArray();
            f.Sharp = sharp.ToArray(); f.Colour = colour.ToArray();
            f.Boundary = boundary.ToArray(); f.Grid = grid;
            f.Radius = stats.Radius;
            f.Mass = dN;
            f.AccelK = accelK;
            f.TurnRate = turnRate;
            f.TurnCos = (1 - t * t) / (1 + t * t);
            f.TurnSin = (2 * t) / (1 + t * t);
            return f;
        }

        public static InkBody CreateBody(InkFigure fig, double x, double y, double fx, double fy, int team,
            double armourMult, double speedMult, double damageMult)
        {
            double hp = fig.Stats.Armour * armourMult;
            InkBody b = new InkBody();
            b.Fig = fig; b.Team = team;
            b.X = x; b.Y = y; b.Vx = 0; b.Vy = 0; b.Fx = fx; b.Fy = fy;
            b.Hp = hp; b.MaxHp = hp;
            b.Alive = true;
            b.TopSpeed = fig.Stats.TopSpeed * speedMult;
            b.DamageMult = damageMult;
            return b;
        }

        public static InkWorld CreateWorld(List<InkBody> bodies, double wallRadius)
        {
            InkWorld w = new InkWorld();
            w.Bodies = bodies;
            w.Cd = new double[bodies.Count * bodies.Count];
            w.WallRadius = wallRadius;
            return w;
        }

        // One fixed tick. inputs[i] is the input of body i (missing = idle).
        // Order: 1 control (index order), 2 integrate, 3 pairs (i < j, index
        // order), 4 wall. Elimination rules belong to the mode classes.
        public static void StepWorld(InkWorld world, InkInput[] inputs, InkTuning tuning)
        {
            List<InkBody> bodies = world.Bodies;
            int n = bodies.Count;
            double dt = 1 / tuning.TickRate;
            world.Events.Clear();

            // 1. control
            for (int i = 0; i < n; i++)
            {
                InkBody b = bodies[i];
                if (!b.Alive) continue;
                InkInput inp = (inputs != null && i < inputs.Length) ? inputs[i] : new InkInput();
                double mx = inp.Mx;
                double my = inp.My;
                double len2 = mx * mx + my * my;
                double dx = 0;
                double dy = 0;
                if (len2 > 0)
                {
                    double len = Math.Sqrt(len2);
                    dx = mx / len;
                    dy = my / len;
                    if (len2 > 1) { mx = dx; my = dy; }
                    TurnToward(b, dx, dy);
                }
                if (b.DashCd > 0) b.DashCd--;
                if (inp.Dash && b.DashCd == 0 && b.DashTicks == 0)
                {
                    if (len2 > 0) { b.DashDx = dx; b.DashDy = dy; } else { b.DashDx = b.Fx; b.DashDy = b.Fy; }
                    b.DashTicks = tuning.DashTicks;
                    b.DashCd = tuning.DashCooldownTicks;
                }
                double tvx;
                double tvy;
                double k;
                if (b.DashTicks > 0)
                {
                    b.DashTicks--;
                    double sp = b.TopSpeed * tuning.DashSpeedMult;
                    tvx = b.DashDx * sp;
                    tvy = b.DashDy * sp;
                    k = tuning.DashAccel;
                }
                else
                {
                    tvx = mx * b.TopSpeed;
                    tvy = my * b.TopSpeed;
                    k = b.Fig.AccelK;
                }
                double ax = (tvx - b.Vx) * k;
                double ay = (tvy - b.Vy) * k;
                b.Vx += ax;
                b.Vy += ay;
            }

            // 2. integrate
            for (int i = 0; i < n; i++)
            {
                InkBody b = bodies[i];
                if (!b.Alive) continue;
                double sx = b.Vx * dt;
                double sy = b.Vy * dt;
                b.X += sx;
                b.Y += sy;
            }

            // 3. pairs
            double[] cd = world.Cd;
            for (int i = 0; i < n * n; i++) if (cd[i] > 0) cd[i]--;
            for (int i = 0; i < n; i++)
            {
                InkBody a = bodies[i];
                if (!a.Alive) continue;
                for (int j = i + 1; j < n; j++)
                {
                    InkBody b = bodies[j];
                    if (!b.Alive) continue;
                    CollidePair(world, i, j, a, b, tuning);
                }
            }

            // 4. wall (solo arena only)
            if (world.WallRadius > 0)
            {
                double lim = world.WallRadius;
                for (int i = 0; i < n; i++)
                {
                    InkBody b = bodies[i];
                    if (!b.Alive) continue;
                    double d2 = b.X * b.X + b.Y * b.Y;
                    if (d2 > lim * lim)
                    {
                        double d = Math.Sqrt(d2);
                        double nx = b.X / d;
                        double ny = b.Y / d;
                        b.X = nx * lim;
                        b.Y = ny * lim;
                        double vn = b.Vx * nx + b.Vy * ny;
                        if (vn > 0)
                        {
                            double px = nx * vn;
                            double py = ny * vn;
                            b.Vx -= px;
                            b.Vy -= py;
                        }
                    }
                }
            }
        }

        // Rotate the front vector toward the unit direction (dx, dy) by at most
        // one turn step, then renormalise.
        private static void TurnToward(InkBody b, double dx, double dy)
        {
            InkFigure fig = b.Fig;
            double dot = b.Fx * dx + b.Fy * dy;
            if (dot >= fig.TurnCos) { b.Fx = dx; b.Fy = dy; return; }
            double cross = b.Fx * dy - b.Fy * dx;
            double cs = fig.TurnCos;
            double sn = cross >= 0 ? fig.TurnSin : -fig.TurnSin;
            double nx = b.Fx * cs - b.Fy * sn;
            double ny = b.Fx * sn + b.Fy * cs;
            double len = Math.Sqrt(nx * nx + ny * ny);
            b.Fx = nx / len;
            b.Fy = ny / len;
        }

        // Every boundary cell of p (a circle of radius 0.5) is tested against
        // the cells of q in the 3 x 3 block around it in q's grid. Adds
        // depth-weighted normals pointing from q toward p (world space).
        private static void ScanCells(InkWorld scan, InkBody p, InkBody q, double sign)
        {
            InkFigure pf = p.Fig;
            InkFigure qf = q.Fig;
            double pc = -p.Fy; // cos of p
            double ps = p.Fx;  // sin of p
            double qc = -q.Fy;
            double qs = q.Fx;
            int[] bl = pf.Boundary;
            int W = qf.W;
            int H = qf.H;
            for (int bi = 0; bi < bl.Length; bi++)
            {
                int k = bl[bi];
                double lx = pf.Lx[k];
                double ly = pf.Ly[k];
                double wx = p.X + pc * lx - ps * ly - q.X;
                double wy = p.Y + ps * lx + pc * ly - q.Y;
                // into q's local frame (inverse rotation)
                double qx = qc * wx + qs * wy;
                double qy = qc * wy - qs * wx;
                double gxd = Math.Floor(qx + qf.Cx);
                double gyd = Math.Floor(qy + qf.Cy);
                if (gxd < -1 || gyd < -1 || gxd > W || gyd > H) continue;
                int gx = (int)gxd;
                int gy = (int)gyd;
                for (int oy = -1; oy <= 1; oy++)
                {
                    int yy = gy + oy;
                    if (yy < 0 || yy >= H) continue;
                    for (int ox = -1; ox <= 1; ox++)
                    {
                        int xx = gx + ox;
                        if (xx < 0 || xx >= W) continue;
                        int m = qf.Grid[yy * W + xx];
                        if (m < 0) continue;
                        double ex = qx - qf.Lx[m];
                        double ey = qy - qf.Ly[m];
                        double d2 = ex * ex + ey * ey;
                        if (d2 >= 1) continue;
                        scan.ScanHits++;
                        if (pf.Sharp[k]) { if (sign > 0) scan.ScanPSharp = true; else scan.ScanQSharp = true; }
                        if (qf.Sharp[m]) { if (sign > 0) scan.ScanQSharp = true; else scan.ScanPSharp = true; }
                        double depth = 1;
                        if (d2 > 0)
                        {
                            double d = Math.Sqrt(d2);
                            depth = 1 - d;
                            // normal q -> p in q-local, weighted by depth, rotated to the world
                            double nx = ex / d * depth;
                            double ny = ey / d * depth;
                            double ax = sign * (qc * nx - qs * ny);
                            double ay = sign * (qs * nx + qc * ny);
                            scan.ScanSx += ax;
                            scan.ScanSy += ay;
                        }
                        if (depth > scan.ScanMaxDepth) scan.ScanMaxDepth = depth;
                    }
                }
            }
        }

        private static void CollidePair(InkWorld world, int i, int j, InkBody a, InkBody b, InkTuning tuning)
        {
            double rx = a.X - b.X;
            double ry = a.Y - b.Y;
            double reach = a.Fig.Radius + b.Fig.Radius;
            if (rx * rx + ry * ry >= reach * reach) return;
            world.ScanSx = 0; world.ScanSy = 0; world.ScanMaxDepth = 0; world.ScanHits = 0;
            world.ScanPSharp = false; world.ScanQSharp = false;
            ScanCells(world, a, b, 1);   // a's boundary against b's cells
            ScanCells(world, b, a, -1);  // b's boundary against a's cells; flags are swapped back by sign
            if (world.ScanHits == 0) return;
            bool aSharp = world.ScanPSharp;
            bool bSharp = world.ScanQSharp;

            // contact normal: pushes a away from b
            double nx = world.ScanSx;
            double ny = world.ScanSy;
            double l2 = nx * nx + ny * ny;
            if (l2 < 1e-12) { nx = rx; ny = ry; l2 = nx * nx + ny * ny; }
            if (l2 < 1e-12) { nx = 1; ny = 0; l2 = 1; }
            double l = Math.Sqrt(l2);
            nx = nx / l;
            ny = ny / l;

            double invA = 1 / a.Fig.Mass;
            double invB = 1 / b.Fig.Mass;
            double invSum = invA + invB;
            double depth = world.ScanMaxDepth;
            double pax = nx * depth * invA / invSum;
            double pay = ny * depth * invA / invSum;
            double pbx = nx * depth * invB / invSum;
            double pby = ny * depth * invB / invSum;
            a.X += pax;
            a.Y += pay;
            b.X -= pbx;
            b.Y -= pby;
            double rel = (a.Vx - b.Vx) * nx + (a.Vy - b.Vy) * ny;
            if (rel < 0)
            {
                double imp = -(1 + tuning.Restitution) * rel / invSum;
                double iax = nx * imp * invA;
                double iay = ny * imp * invA;
                double ibx = nx * imp * invB;
                double iby = ny * imp * invB;
                a.Vx += iax;
                a.Vy += iay;
                b.Vx -= ibx;
                b.Vy -= iby;
            }

            // damage, once per direction per cooldown; never inside one team
            if (a.Team == b.Team) return;
            int n = world.Bodies.Count;
            if (world.Cd[i * n + j] == 0)
            {
                double dmg = (aSharp ? a.Fig.Stats.Sharpness : tuning.BluntDamage)
                    * a.DamageMult * InkDrawing.ElementMultiplier(tuning, a.Fig.Stats.Element, b.Fig.Stats.Element);
                b.Hp -= dmg;
                world.Cd[i * n + j] = tuning.HitCooldownTicks;
                double kb = dmg * tuning.HitKnockbackPerDamage * invB;
                double kx = nx * kb;
                double ky = ny * kb;
                b.Vx -= kx;
                b.Vy -= ky;
                InkEvent e = new InkEvent();
                e.Type = InkEvent.Hit; e.From = i; e.To = j; e.Damage = dmg; e.Sharp = aSharp;
                world.Events.Add(e);
            }
            if (world.Cd[j * n + i] == 0)
            {
                double dmg = (bSharp ? b.Fig.Stats.Sharpness : tuning.BluntDamage)
                    * b.DamageMult * InkDrawing.ElementMultiplier(tuning, b.Fig.Stats.Element, a.Fig.Stats.Element);
                a.Hp -= dmg;
                world.Cd[j * n + i] = tuning.HitCooldownTicks;
                double kb = dmg * tuning.HitKnockbackPerDamage * invA;
                double kx = nx * kb;
                double ky = ny * kb;
                a.Vx += kx;
                a.Vy += ky;
                InkEvent e = new InkEvent();
                e.Type = InkEvent.Hit; e.From = j; e.To = i; e.Damage = dmg; e.Sharp = bSharp;
                world.Events.Add(e);
            }
        }

        // World position of local cell k of body b (for drawing and tests).
        public static InkVec2 CellWorld(InkBody b, int k)
        {
            return new InkVec2(
                b.X + (-b.Fy) * b.Fig.Lx[k] - b.Fx * b.Fig.Ly[k],
                b.Y + b.Fx * b.Fig.Lx[k] + (-b.Fy) * b.Fig.Ly[k]);
        }
    }
}
