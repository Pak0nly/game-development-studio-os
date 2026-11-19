// Headless drivers that replay a recorded scenario exactly as the JavaScript
// reference does (tools/gen_golden.js and sim/runner.js). Used by the .NET
// golden tests and by the in-engine self check.
using System;
using System.Collections.Generic;

namespace Inkweight.Core
{
    public sealed class InkRingScenario
    {
        public uint Seed;
        public InkFigure[] Figures;
        // Scripts[seat] = segments { fromTick, mx, my, dash } or null for a bot seat
        public double[][][] Scripts;
        public int MaxRounds;
        public int MaxTicksPerRound;
        public int CheckpointEvery;
    }

    public sealed class InkSoloScenario
    {
        public uint Seed;
        public int[] HeroCells, WeaponCells;
        public int W, H;
        public int StartColour;
        public int Style; // 0 kite, 1 brawl
        public int[][] WaveEnemyCells;
        public int[] WaveStakes;
        public string[] WaveUpgrades; // null | "heal" | "colour2" | "colour3" | "colour4"
        public bool Boss;
        public int CheckpointEvery;
    }

    public static class InkReplay
    {
        private static InkInput ScriptInput(double[][] script, int tick)
        {
            double[] seg = script[0];
            for (int i = 0; i < script.Length; i++) if (script[i][0] <= tick) seg = script[i];
            return new InkInput(seg[1], seg[2], seg[3] == 1);
        }

        // onCheckpoint: at round start, after every step whose tick is a
        // multiple of CheckpointEvery, and after the last step of a round.
        // onRoundEnd: after each round (also when the tick limit ended it).
        public static InkRingMatch RunRing(InkTuning tuning, InkRingScenario sc,
            Action<InkRingMatch> onCheckpoint, Action<InkRingMatch> onRoundEnd)
        {
            int n = sc.Figures.Length;
            InkRingMatch match = InkRing.CreateMatch(tuning, n, sc.Seed);
            InkInput?[] human = new InkInput?[n];
            while (match.Phase != InkRing.PhaseMatchOver && match.Round < sc.MaxRounds)
            {
                InkRing.StartRound(tuning, match, sc.Figures);
                if (onCheckpoint != null) onCheckpoint(match);
                while (match.Phase == InkRing.PhaseFight && match.Tick < sc.MaxTicksPerRound)
                {
                    for (int s = 0; s < n; s++)
                    {
                        if (sc.Scripts != null && s < sc.Scripts.Length && sc.Scripts[s] != null)
                            human[s] = ScriptInput(sc.Scripts[s], match.Tick);
                        else
                            human[s] = null;
                    }
                    InkRing.Step(tuning, match, InkBots.RingBotInputs(tuning, match, human));
                    if (onCheckpoint != null && (match.Tick % sc.CheckpointEvery == 0 || match.Phase != InkRing.PhaseFight))
                        onCheckpoint(match);
                }
                if (onRoundEnd != null) onRoundEnd(match);
                if (match.Phase == InkRing.PhaseFight) break; // tick limit reached (scripted traces only)
            }
            return match;
        }

        private static void PlaySoloFight(InkTuning tuning, InkSoloRun run, InkSoloScenario sc, Action<InkSoloRun> onCheckpoint)
        {
            while (run.Phase == InkSolo.PhaseFight)
            {
                InkSolo.Step(tuning, run, InkBots.HeroInput(tuning, run, sc.Style));
                if (onCheckpoint != null && (run.Tick % sc.CheckpointEvery == 0 || run.Phase != InkSolo.PhaseFight))
                    onCheckpoint(run);
            }
        }

        // onCheckpoint: after every step whose tick is a multiple of
        // CheckpointEvery and after the last step of a fight.
        // onFightEnd: after each fight, before the planned upgrade is tried.
        public static InkSoloRun RunSolo(InkTuning tuning, InkSoloScenario sc,
            Action<InkSoloRun> onCheckpoint, Action<InkSoloRun> onFightEnd)
        {
            InkSoloRun run = InkSolo.CreateRun(tuning, sc.Seed, sc.HeroCells, sc.WeaponCells, sc.W, sc.H, sc.StartColour);
            for (int w = 0; w < sc.WaveEnemyCells.Length && w < InkSolo.Waves; w++)
            {
                InkSolo.StartWave(tuning, run, sc.WaveEnemyCells[w], sc.WaveStakes[w]);
                PlaySoloFight(tuning, run, sc, onCheckpoint);
                if (onFightEnd != null) onFightEnd(run);
                if (run.Phase != InkSolo.PhaseCleared) return run;
                string up = sc.WaveUpgrades[w];
                if (up == "heal") InkSolo.Upgrade(tuning, run, InkSolo.UpgradeHeal, null, 0);
                else if (up == "colour2") InkSolo.Upgrade(tuning, run, InkSolo.UpgradeColour, null, 2);
                else if (up == "colour3") InkSolo.Upgrade(tuning, run, InkSolo.UpgradeColour, null, 3);
                else if (up == "colour4") InkSolo.Upgrade(tuning, run, InkSolo.UpgradeColour, null, 4);
            }
            if (sc.Boss && run.Phase == InkSolo.PhaseCleared && run.Wave == InkSolo.Waves)
            {
                InkSolo.StartBoss(tuning, run);
                PlaySoloFight(tuning, run, sc, onCheckpoint);
                if (onFightEnd != null) onFightEnd(run);
            }
            return run;
        }

        public static int[] Recolour(int[] cells, int v)
        {
            int[] c = new int[cells.Length];
            for (int i = 0; i < c.Length; i++) c[i] = cells[i] != 0 ? v : 0;
            return c;
        }
    }
}
