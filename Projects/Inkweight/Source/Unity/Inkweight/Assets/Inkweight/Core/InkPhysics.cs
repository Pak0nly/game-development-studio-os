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
        public double Radius, Mass, AccelK, TurnRate;
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
        // added to the blunt damage of this body's touches before the
        // multipliers (0 everywhere except solo enemy copies; set once when
        // the body is made, not hashed)
        public double BluntBonus;
        public double DashTicks, DashCd, DashDx, DashDy;
        // steering direction of the running tick (set by the control step,
        // used by the sub-steps; not state between ticks, not hashed)
        public bool Turning;
        public double TurnDx, TurnDy;
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
        public const string Ram = "ram";
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
        public int SubSteps = 1; // sub-steps of the last tick (not hashed)

        // scratch result of the cell scan of one pair
        internal double ScanSx, ScanSy, ScanMaxDepth, ScanDeepX, ScanDeepY, NormalX, NormalY;
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
                    sharp.Add(InkDrawing.IsSharpCell(body, W, H, x, y));
                    if (nb < 8) boundary.Add(k);
                }
            }
            double dN = stats.N;
            double turnRate = tuning.TurnBase / (1 + stats.Inertia / tuning.TurnInertiaRef);
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
            f.Mass = stats.Push;
            f.AccelK = accelK;
            f.TurnRate = turnRate;
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
            b.BluntBonus = 0;
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
        // Order: 1 control (index order), 2 hit cooldowns, 3 sub-steps (each
        // one: turn and integrate every body, then pairs i < j in index
        // order, then the crowd relaxation when the world has more than two
        // bodies), 4 wall. Elimination rules belong to the mode classes.
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
                }
                // the turn itself happens inside the sub-steps
                b.Turning = len2 > 0 && (b.Fx != dx || b.Fy != dy);
                b.TurnDx = dx;
                b.TurnDy = dy;
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

            // 2. hit cooldowns, once per tick
            double[] cd = world.Cd;
            for (int i = 0; i < n * n; i++) if (cd[i] > 0) cd[i]--;

            // 3. sub-steps
            double maxSpeed = 0;
            for (int i = 0; i < n; i++)
            {
                InkBody b = bodies[i];
                if (!b.Alive) continue;
                double sp = Math.Sqrt(b.Vx * b.Vx + b.Vy * b.Vy);
                if (b.Turning)
                {
                    double tip = b.Fig.Radius * b.Fig.TurnRate;
                    sp += tip;
                }
                if (sp > maxSpeed) maxSpeed = sp;
            }
            double subD = Math.Floor(maxSpeed * dt / tuning.MaxStepCells) + 1;
            if (subD > tuning.MaxSubSteps) subD = tuning.MaxSubSteps;
            double h = dt / subD;
            int sub = (int)subD;
            world.SubSteps = sub;
            for (int s = 0; s < sub; s++)
            {
                for (int i = 0; i < n; i++)
                {
                    InkBody b = bodies[i];
                    if (!b.Alive) continue;
                    if (b.Turning)
                    {
                        // one part of this tick's turn step: half-angle tangent t / sub
                        double t = b.Fig.TurnRate / (2 * tuning.TickRate * subD);
                        double tt = t * t;
                        TurnToward(b, b.TurnDx, b.TurnDy, (1 - tt) / (1 + tt), (2 * t) / (1 + tt));
                    }
                    double sx = b.Vx * h;
                    double sy = b.Vy * h;
                    b.X += sx;
                    b.Y += sy;
                }
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
                // Crowd relaxation (three or more bodies, dead ones counted):
                // the pairs are scanned again, positions only, at most
                // crowdRelaxPasses times, until no contact is deep.
                if (n > 2)
                {
                    for (int r = 0; r < tuning.CrowdRelaxPasses; r++)
                    {
                        bool pushed = false;
                        for (int i = 0; i < n; i++)
                        {
                            InkBody a = bodies[i];
                            if (!a.Alive) continue;
                            for (int j = i + 1; j < n; j++)
                            {
                                InkBody b = bodies[j];
                                if (!b.Alive) continue;
                                if (RelaxPair(world, a, b, tuning)) pushed = true;
                            }
                        }
                        if (!pushed) break;
                    }
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
        // the angle with cosine turnCos and sine turnSin, then renormalise.
        private static void TurnToward(InkBody b, double dx, double dy, double turnCos, double turnSin)
        {
            double dot = b.Fx * dx + b.Fy * dy;
            if (dot >= turnCos) { b.Fx = dx; b.Fy = dy; return; }
            double cross = b.Fx * dy - b.Fy * dx;
            double cs = turnCos;
            double sn = cross >= 0 ? turnSin : -turnSin;
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
                        double wnx = 0;
                        double wny = 0;
                        if (d2 > 0)
                        {
                            double d = Math.Sqrt(d2);
                            depth = 1 - d;
                            // normal q -> p in q-local, weighted by depth, rotated to the world
                            double nx = ex / d * depth;
                            double ny = ey / d * depth;
                            wnx = sign * (qc * nx - qs * ny);
                            wny = sign * (qs * nx + qc * ny);
                            scan.ScanSx += wnx;
                            scan.ScanSy += wny;
                        }
                        // the deepest contact keeps its own (depth-weighted) normal
                        if (depth > scan.ScanMaxDepth) { scan.ScanMaxDepth = depth; scan.ScanDeepX = wnx; scan.ScanDeepY = wny; }
                    }
                }
            }
        }

        // Damage of one touch before multipliers: blunt, or with a sharp cell
        // in the contact the sharpness (never less than blunt) plus the
        // armour cut (share sharpArmourCut of the victim's full armour).
        private static double TouchDamage(InkTuning tuning, InkBody body, bool sharp, InkBody victim)
        {
            double blunt = tuning.BluntDamage + body.BluntBonus;
            if (!sharp) return blunt;
            double sh = body.Fig.Stats.Sharpness;
            double cut = tuning.SharpArmourCut * victim.MaxHp;
            return (sh > blunt ? sh : blunt) + cut;
        }

        // Scan the pair (a's boundary against b, then b's against a).
        private static void ScanPair(InkWorld world, InkBody a, InkBody b)
        {
            world.ScanSx = 0; world.ScanSy = 0; world.ScanMaxDepth = 0; world.ScanDeepX = 0; world.ScanDeepY = 0;
            world.ScanHits = 0; world.ScanPSharp = false; world.ScanQSharp = false;
            ScanCells(world, a, b, 1);   // a's boundary against b's cells
            ScanCells(world, b, a, -1);  // b's boundary against a's cells; flags are swapped back by sign
        }

        // Unit contact normal of the last scan; it pushes a away from b.
        // Summed contact vectors; when they cancel, the deepest contact's own
        // normal; then centre a minus centre b; then (1, 0).
        private static void ContactNormal(InkWorld world, InkTuning tuning, InkBody a, InkBody b)
        {
            double nx = world.ScanSx;
            double ny = world.ScanSy;
            double l2 = nx * nx + ny * ny;
            double lim = tuning.DeepNormalShare * world.ScanMaxDepth;
            if (l2 < lim * lim)
            {
                double dl2 = world.ScanDeepX * world.ScanDeepX + world.ScanDeepY * world.ScanDeepY;
                if (dl2 > 1e-12) { nx = world.ScanDeepX; ny = world.ScanDeepY; l2 = dl2; }
            }
            if (l2 < 1e-12) { nx = a.X - b.X; ny = a.Y - b.Y; l2 = nx * nx + ny * ny; }
            if (l2 < 1e-12) { nx = 1; ny = 0; l2 = 1; }
            double l = Math.Sqrt(l2);
            world.NormalX = nx / l;
            world.NormalY = ny / l;
        }

        // Position-only push of a pair whose contact is deeper than
        // deepContactDepth, by weight shares. Returns true when it pushed.
        private static bool RelaxPair(InkWorld world, InkBody a, InkBody b, InkTuning tuning)
        {
            double rx = a.X - b.X;
            double ry = a.Y - b.Y;
            double reach = a.Fig.Radius + b.Fig.Radius;
            if (rx * rx + ry * ry >= reach * reach) return false;
            ScanPair(world, a, b);
            if (world.ScanHits == 0 || world.ScanMaxDepth <= tuning.DeepContactDepth) return false;
            ContactNormal(world, tuning, a, b);
            double invA = 1 / a.Fig.Mass;
            double invB = 1 / b.Fig.Mass;
            double invSum = invA + invB;
            double d = world.ScanMaxDepth;
            double pax = world.NormalX * d * invA / invSum;
            double pay = world.NormalY * d * invA / invSum;
            double pbx = world.NormalX * d * invB / invSum;
            double pby = world.NormalY * d * invB / invSum;
            a.X += pax;
            a.Y += pay;
            b.X -= pbx;
            b.Y -= pby;
            return true;
        }

        private static void CollidePair(InkWorld world, int i, int j, InkBody a, InkBody b, InkTuning tuning)
        {
            double rx = a.X - b.X;
            double ry = a.Y - b.Y;
            double reach = a.Fig.Radius + b.Fig.Radius;
            if (rx * rx + ry * ry >= reach * reach) return;
            ScanPair(world, a, b);
            if (world.ScanHits == 0) return;
            bool aSharp = world.ScanPSharp;
            bool bSharp = world.ScanQSharp;
            ContactNormal(world, tuning, a, b);
            double nx = world.NormalX;
            double ny = world.NormalY;

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
            // A contact that is still deep after the push is scanned and
            // pushed again, positions only. Velocity, damage and the sharp
            // flags come from the first scan.
            for (int pass = 0; pass < tuning.ExtraSeparationPasses; pass++)
            {
                ScanPair(world, a, b);
                if (world.ScanHits == 0 || world.ScanMaxDepth <= tuning.DeepContactDepth) break;
                ContactNormal(world, tuning, a, b);
                double dd = world.ScanMaxDepth;
                double qax = world.NormalX * dd * invA / invSum;
                double qay = world.NormalY * dd * invA / invSum;
                double qbx = world.NormalX * dd * invB / invSum;
                double qby = world.NormalY * dd * invB / invSum;
                a.X += qax;
                a.Y += qay;
                b.X -= qbx;
                b.Y -= qby;
            }
            double rel = (a.Vx - b.Vx) * nx + (a.Vy - b.Vy) * ny;
            bool dashing = a.DashTicks > 0 || b.DashTicks > 0;
            if (rel < 0)
            {
                // a contact that involves a dashing body is a ram: its own bounce factor
                double imp = -(1 + (dashing ? tuning.DashRestitution : tuning.Restitution)) * rel / invSum;
                double iax = nx * imp * invA;
                double iay = ny * imp * invA;
                double ibx = nx * imp * invB;
                double iby = ny * imp * invB;
                a.Vx += iax;
                a.Vy += iay;
                b.Vx -= ibx;
                b.Vy -= iby;
            }
            // a contact ends the dash of both bodies
            if (dashing)
            {
                if (a.DashTicks > 0)
                {
                    a.DashTicks = 0;
                    InkEvent e = new InkEvent();
                    e.Type = InkEvent.Ram; e.From = i; e.To = j;
                    world.Events.Add(e);
                }
                if (b.DashTicks > 0)
                {
                    b.DashTicks = 0;
                    InkEvent e = new InkEvent();
                    e.Type = InkEvent.Ram; e.From = j; e.To = i;
                    world.Events.Add(e);
                }
            }

            // damage, once per direction per cooldown; never inside one team
            if (a.Team == b.Team) return;
            int n = world.Bodies.Count;
            if (world.Cd[i * n + j] == 0)
            {
                double dmg = TouchDamage(tuning, a, aSharp, b)
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
                double dmg = TouchDamage(tuning, b, bSharp, a)
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
