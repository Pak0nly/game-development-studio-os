// Mode B "Ring": 2 to 4 figures, shrinking ring, rounds, first to N wins,
// catch-up ink. Port of core/ring.js.
using System;
using System.Collections.Generic;

namespace Inkweight.Core
{
    public sealed class InkRingMatch
    {
        public uint Seed;
        public int SeatCount;
        public int Round;          // rounds started so far
        public int[] Wins, Lost;
        public string Phase;       // InkRing.PhaseDraw | PhaseFight | PhaseRoundOver | PhaseMatchOver
        public int Tick;           // ticks since the round started
        public double RingRadius;
        public InkWorld World;
        public int RoundWinner = -1;
        public int MatchWinner = -1;
        public int[] OutTick;      // per seat: tick of elimination in this round, -1 while in
        public string[] OutReason; // per seat: "" | "ring" | "armour"
        public InkRng[] BotRng;
        public int[] BotWobble;    // per seat: current sideways wobble of the bot (-1, 0, 1)
        public int[] BotStyle;     // per seat: 0 = rusher, 1 = circler; the caller may change it
    }

    public static class InkRing
    {
        public const string PhaseDraw = "draw";
        public const string PhaseFight = "fight";
        public const string PhaseRoundOver = "roundOver";
        public const string PhaseMatchOver = "matchOver";
        public const string ReasonRing = "ring";
        public const string ReasonArmour = "armour";
        public const string CheckOk = "";
        public const string CheckTooSmall = "tooSmall";
        public const string CheckOverBudget = "overBudget";

        // Start slots as unit vectors from the ring centre (no trigonometry).
        private static readonly double H3 = Math.Sqrt(3) / 2;

        private static double[][] Slots(int n)
        {
            if (n == 2) return new double[][] { new double[] { -1, 0 }, new double[] { 1, 0 } };
            if (n == 3) return new double[][] { new double[] { 0, -1 }, new double[] { H3, 0.5 }, new double[] { -H3, 0.5 } };
            return new double[][] { new double[] { -1, 0 }, new double[] { 1, 0 }, new double[] { 0, -1 }, new double[] { 0, 1 } };
        }

        public static InkRingMatch CreateMatch(InkTuning tuning, int seatCount, uint seed)
        {
            if (seatCount < 2 || seatCount > 4) throw new ArgumentException("seatCount must be 2..4");
            InkRingMatch m = new InkRingMatch();
            m.Seed = seed;
            m.SeatCount = seatCount;
            m.Wins = new int[seatCount];
            m.Lost = new int[seatCount];
            m.BotRng = new InkRng[seatCount];
            m.BotStyle = new int[seatCount];
            for (int i = 0; i < seatCount; i++) m.BotRng[i] = InkRng.Derive(seed, i);
            m.Phase = PhaseDraw;
            m.RingRadius = tuning.RingStartRadius[seatCount];
            m.OutTick = new int[0];
            m.OutReason = new string[0];
            m.BotWobble = new int[0];
            return m;
        }

        // Check a figure template for a seat before a round. Returns "" when
        // it may start, else "tooSmall" or "overBudget" (against the seat's
        // catch-up budget).
        public static string CheckFigure(InkTuning tuning, InkRingMatch match, int seat, InkFigure fig)
        {
            if (fig == null || fig.Stats == null || fig.Stats.N < tuning.MinBodyCells) return CheckTooSmall;
            if (fig.Stats.Filled > InkBudget(tuning, match, seat)) return CheckOverBudget;
            return CheckOk;
        }

        // Ink budget of a seat for its next drawing (catch-up rule 6).
        public static double InkBudget(InkTuning tuning, InkRingMatch match, int seat)
        {
            double steps = match.Lost[seat];
            if (steps > tuning.CatchUpMaxSteps) steps = tuning.CatchUpMaxSteps;
            return Math.Floor(tuning.FigureBudget * (100 + tuning.CatchUpPercentPerLostRound * steps) / 100);
        }

        // Ring radius at a tick of the round.
        public static double RadiusAt(InkTuning tuning, int seatCount, int tick)
        {
            double start = tuning.RingStartRadius[seatCount];
            if (tick <= tuning.ShrinkStartTick) return start;
            if (tick < tuning.ShrinkEndTick)
            {
                return start + (tuning.RingEndRadius - start) * (tick - tuning.ShrinkStartTick)
                    / (tuning.ShrinkEndTick - tuning.ShrinkStartTick);
            }
            if (tick <= tuning.SuddenDeathTick) return tuning.RingEndRadius;
            double rad = tuning.RingEndRadius - (tick - tuning.SuddenDeathTick) * tuning.SuddenDeathShrinkPerTick;
            return rad > 0 ? rad : 0;
        }

        // Start the next round with one figure template per seat. Seats rotate
        // through the start slots from round to round.
        public static void StartRound(InkTuning tuning, InkRingMatch match, InkFigure[] figures)
        {
            if (match.Phase == PhaseMatchOver) throw new InvalidOperationException("match is over");
            if (figures.Length != match.SeatCount) throw new ArgumentException("one figure per seat");
            int n = match.SeatCount;
            for (int seat = 0; seat < n; seat++)
            {
                string why = CheckFigure(tuning, match, seat, figures[seat]);
                if (why != CheckOk) throw new InvalidOperationException("seat " + seat + " figure: " + why);
            }
            double[][] slots = Slots(n);
            double R = tuning.RingStartRadius[n];
            double d = R * tuning.StartDistanceFraction;
            List<InkBody> bodies = new List<InkBody>();
            match.OutTick = new int[n];
            match.OutReason = new string[n];
            match.BotWobble = new int[n];
            for (int seat = 0; seat < n; seat++)
            {
                double[] slot = slots[(seat + match.Round) % n];
                // position on the slot direction, front toward the centre
                bodies.Add(InkPhysics.CreateBody(figures[seat], slot[0] * d, slot[1] * d, -slot[0], -slot[1], seat, 1, 1, 1));
                match.OutTick[seat] = -1;
                match.OutReason[seat] = "";
                match.BotWobble[seat] = 0;
            }
            match.World = InkPhysics.CreateWorld(bodies, 0);
            match.Tick = 0;
            match.RingRadius = R;
            match.RoundWinner = -1;
            match.Round++;
            match.Phase = PhaseFight;
        }

        // One tick of the fight. inputs[seat] is that seat's input.
        public static void Step(InkTuning tuning, InkRingMatch match, InkInput[] inputs)
        {
            if (match.Phase != PhaseFight) return;
            InkWorld world = match.World;
            List<InkBody> bodies = world.Bodies;
            int n = bodies.Count;
            InkPhysics.StepWorld(world, inputs, tuning);
            match.Tick++;
            double R = RadiusAt(tuning, n, match.Tick);
            match.RingRadius = R;
            // eliminations, seat order
            int aliveCount = 0;
            int lastAlive = -1;
            for (int i = 0; i < n; i++)
            {
                InkBody b = bodies[i];
                if (!b.Alive) continue;
                string reason = "";
                if (b.Hp <= 0) reason = ReasonArmour;
                else if (b.X * b.X + b.Y * b.Y > R * R) reason = ReasonRing;
                if (reason != "")
                {
                    b.Alive = false;
                    match.OutTick[i] = match.Tick;
                    match.OutReason[i] = reason;
                    InkEvent e = new InkEvent();
                    e.Type = InkEvent.Out; e.To = i; e.Reason = reason;
                    world.Events.Add(e);
                }
                else
                {
                    aliveCount++;
                    lastAlive = i;
                }
            }
            if (aliveCount > 1) return;
            int winner = lastAlive;
            if (aliveCount == 0)
            {
                // everyone left went out in the same tick: the one closest to
                // the centre wins, lowest seat on an exact tie
                double best = -1;
                for (int i = 0; i < n; i++)
                {
                    if (match.OutTick[i] != match.Tick) continue;
                    InkBody b = bodies[i];
                    double d2 = b.X * b.X + b.Y * b.Y;
                    if (winner == -1 || d2 < best) { winner = i; best = d2; }
                }
            }
            match.RoundWinner = winner;
            match.Wins[winner]++;
            for (int i = 0; i < n; i++) if (i != winner) match.Lost[i]++;
            if (match.Wins[winner] >= tuning.WinsToTakeMatch)
            {
                match.MatchWinner = winner;
                match.Phase = PhaseMatchOver;
            }
            else
            {
                match.Phase = PhaseRoundOver;
            }
        }
    }
}
