// Simple deterministic bots. Port of core/bots.js. A bot reads the state and
// returns the same input record a human seat would produce.
using System;
using System.Collections.Generic;

namespace Inkweight.Core
{
    public static class InkBots
    {
        // Ring bot for one seat. Draws from match.BotRng[seat] only.
        public static InkInput RingInput(InkTuning bt, InkRingMatch match, int seat)
        {
            List<InkBody> bodies = match.World.Bodies;
            InkBody me = bodies[seat];
            InkInput o = new InkInput();
            if (!me.Alive) return o;
            InkRng rng = match.BotRng[seat];
            if (match.Tick % bt.WobbleTicks == 0) match.BotWobble[seat] = rng.Int(3) - 1;
            int target = -1;
            double bestD2 = 0;
            for (int i = 0; i < bodies.Count; i++)
            {
                if (i == seat || !bodies[i].Alive) continue;
                double dx = bodies[i].X - me.X;
                double dy = bodies[i].Y - me.Y;
                double d2 = dx * dx + dy * dy;
                if (target == -1 || d2 < bestD2) { target = i; bestD2 = d2; }
            }
            double myDist = Math.Sqrt(me.X * me.X + me.Y * me.Y);
            double dirX = 0;
            double dirY = 0;
            double targetDist = 0;
            if (target != -1)
            {
                InkBody t = bodies[target];
                double ax = t.X;
                double ay = t.Y;
                double td = Math.Sqrt(t.X * t.X + t.Y * t.Y);
                if (td > 0)
                {
                    double shift = bt.InsideBias * me.Fig.Radius;
                    double use = shift < td ? shift : td;
                    double sx = t.X / td * use;
                    double sy = t.Y / td * use;
                    ax -= sx;
                    ay -= sy;
                }
                double dx = ax - me.X;
                double dy = ay - me.Y;
                double d = Math.Sqrt(dx * dx + dy * dy);
                if (d > 0) { dx = dx / d; dy = dy / d; } else { dx = me.Fx; dy = me.Fy; }
                // sideways wobble (perpendicular to the approach)
                double w = match.BotWobble[seat] * bt.WobbleStrength;
                dirX = dx - dy * w;
                dirY = dy + dx * w;
                d = Math.Sqrt(dirX * dirX + dirY * dirY);
                dirX = dirX / d;
                dirY = dirY / d;
                targetDist = Math.Sqrt(bestD2);
            }
            // edge avoidance
            double margin = bt.EdgeMargin;
            if (target != -1)
            {
                double tm = bodies[target].Fig.Mass;
                if (tm > me.Fig.Mass)
                {
                    double extra = match.RingRadius * bt.LightRetreatFraction * (1 - me.Fig.Mass / tm);
                    margin += extra;
                }
            }
            double limit = match.RingRadius - margin;
            double edge = 0;
            if (myDist > limit && myDist > 0)
            {
                edge = (myDist - limit) / bt.EdgeBlend;
                if (edge > 1) edge = 1;
                double cx = -me.X / myDist;
                double cy = -me.Y / myDist;
                double ex = cx;
                double ey = cy;
                if (target != -1 && targetDist > 0)
                {
                    double ux = (bodies[target].X - me.X) / targetDist;
                    double uy = (bodies[target].Y - me.Y) / targetDist;
                    if (cx * ux + cy * uy > bt.RoundaboutDot)
                    {
                        double tx = -cy;
                        double ty = cx;
                        if (tx * ux + ty * uy > 0) { tx = -tx; ty = -ty; }
                        double rx = tx * bt.RoundaboutStrength;
                        double ry = ty * bt.RoundaboutStrength;
                        ex += rx;
                        ey += ry;
                    }
                }
                dirX = dirX * (1 - edge) + ex * edge;
                dirY = dirY * (1 - edge) + ey * edge;
                double d = Math.Sqrt(dirX * dirX + dirY * dirY);
                if (d > 0) { dirX = dirX / d; dirY = dirY / d; }
            }
            o.Mx = dirX;
            o.My = dirY;
            if (target != -1 && me.DashCd == 0 && me.DashTicks == 0 && edge < 0.5)
            {
                double reach = bt.DashRange + me.Fig.Radius + bodies[target].Fig.Radius;
                if (targetDist < reach && rng.Int(100) < bt.DashChancePercent) o.Dash = true;
            }
            return o;
        }

        // Inputs for every seat; seats with a value in humanInputs keep it,
        // null entries (or a null array) are played by the bot.
        public static InkInput[] RingBotInputs(InkTuning tuning, InkRingMatch match, InkInput?[] humanInputs)
        {
            InkInput[] inputs = new InkInput[match.SeatCount];
            for (int seat = 0; seat < match.SeatCount; seat++)
            {
                InkInput? h = (humanInputs != null && seat < humanInputs.Length) ? humanInputs[seat] : null;
                inputs[seat] = h.HasValue ? h.Value : RingInput(tuning, match, seat);
            }
            return inputs;
        }

        // Solo enemy: run at the hero, dash by chance when close.
        public static InkInput EnemyInput(InkTuning so, InkSoloRun run, int index)
        {
            List<InkBody> bodies = run.World.Bodies;
            InkBody me = bodies[index];
            InkBody hero = bodies[0];
            InkInput o = new InkInput();
            if (!me.Alive || !hero.Alive) return o;
            double dx = hero.X - me.X;
            double dy = hero.Y - me.Y;
            double d = Math.Sqrt(dx * dx + dy * dy);
            if (d > 0) { o.Mx = dx / d; o.My = dy / d; }
            if (me.DashCd == 0 && me.DashTicks == 0 && d < so.EnemyDashRange + me.Fig.Radius + hero.Fig.Radius)
            {
                if (run.Rng.Int(100) < so.EnemyDashChancePercent) o.Dash = true;
            }
            return o;
        }

        // Solo hero bot (for simulation and attract mode). style 0 = kite,
        // style 1 = brawl. Uses no random numbers.
        public static InkInput HeroInput(InkTuning so, InkSoloRun run, int style)
        {
            List<InkBody> bodies = run.World.Bodies;
            InkBody me = bodies[0];
            InkInput o = new InkInput();
            if (!me.Alive) return o;
            int near = -1;
            double nearD2 = 0;
            for (int i = 1; i < bodies.Count; i++)
            {
                if (!bodies[i].Alive) continue;
                double dx = bodies[i].X - me.X;
                double dy = bodies[i].Y - me.Y;
                double d2 = dx * dx + dy * dy;
                if (near == -1 || d2 < nearD2) { near = i; nearD2 = d2; }
            }
            double dirX = 0;
            double dirY = 0;
            bool fleeing = false;
            if (near != -1)
            {
                InkBody e = bodies[near];
                double d = Math.Sqrt(nearD2);
                double gap = d - me.Fig.Radius - e.Fig.Radius;
                double ux = 0;
                double uy = 0;
                if (d > 0) { ux = (e.X - me.X) / d; uy = (e.Y - me.Y) / d; }
                if (style == 1)
                {
                    dirX = ux; dirY = uy;
                    if (gap < so.EnemyDashRange) o.Dash = true;
                }
                else if (gap < so.BotFleeDistance)
                {
                    // away from the enemy, with a sideways part so the hero circles
                    dirX = -ux - uy * 0.6;
                    dirY = -uy + ux * 0.6;
                    fleeing = true;
                    if (gap < 2) o.Dash = true;
                }
            }
            if ((!fleeing && style != 1) || near == -1)
            {
                // go for the nearest ink drop
                int best = -1;
                double bestD2 = 0;
                for (int i = 0; i < run.Drops.Count; i++)
                {
                    double dx = run.Drops[i].X - me.X;
                    double dy = run.Drops[i].Y - me.Y;
                    double d2 = dx * dx + dy * dy;
                    if (best == -1 || d2 < bestD2) { best = i; bestD2 = d2; }
                }
                if (best != -1 && bestD2 > 0)
                {
                    double d = Math.Sqrt(bestD2);
                    dirX = (run.Drops[best].X - me.X) / d;
                    dirY = (run.Drops[best].Y - me.Y) / d;
                }
            }
            // stay off the wall
            double myDist = Math.Sqrt(me.X * me.X + me.Y * me.Y);
            double limit = so.ArenaRadius - so.BotWallMargin;
            if (myDist > limit)
            {
                double w = (myDist - limit) / so.BotWallMargin;
                if (w > 1) w = 1;
                dirX = dirX * (1 - w) - me.X / myDist * w;
                dirY = dirY * (1 - w) - me.Y / myDist * w;
            }
            double l = Math.Sqrt(dirX * dirX + dirY * dirY);
            if (l > 0) { o.Mx = dirX / l; o.My = dirY / l; }
            return o;
        }
    }
}
