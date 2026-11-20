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
        public int[] BotStyles; // per seat 0 rusher, 1 circler; null = all rushers
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
        // null | "heal" | "colour2" | "colour3" | "colour4" | "heroInk:<name>" | "weaponInk:<name>"
        public string[] WaveUpgrades;
        // for the two redraw upgrades: the new drawing of that wave (already
        // recoloured to Black), else null; the array itself may be null
        public int[][] WaveUpgradeCells;
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
            if (sc.BotStyles != null) for (int s = 0; s < n && s < sc.BotStyles.Length; s++) match.BotStyle[s] = sc.BotStyles[s];
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
            return RunSolo(tuning, sc, onCheckpoint, onFightEnd, null);
        }

        // onUpgrade(wave, result): after a planned upgrade was tried; result
        // is "ok" or the refusal reason (not called when none was planned).
        public static InkSoloRun RunSolo(InkTuning tuning, InkSoloScenario sc,
            Action<InkSoloRun> onCheckpoint, Action<InkSoloRun> onFightEnd, Action<int, string> onUpgrade)
        {
            InkSoloRun run = InkSolo.CreateRun(tuning, sc.Seed, sc.HeroCells, sc.WeaponCells, sc.W, sc.H, sc.StartColour);
            for (int w = 0; w < sc.WaveEnemyCells.Length && w < InkSolo.Waves; w++)
            {
                InkSolo.StartWave(tuning, run, sc.WaveEnemyCells[w], sc.WaveStakes[w]);
                PlaySoloFight(tuning, run, sc, onCheckpoint);
                if (onFightEnd != null) onFightEnd(run);
                if (run.Phase != InkSolo.PhaseCleared) return run;
                string up = sc.WaveUpgrades[w];
                string res = null;
                int[] upCells = sc.WaveUpgradeCells != null ? sc.WaveUpgradeCells[w] : null;
                if (up == "heal") res = InkSolo.Upgrade(tuning, run, InkSolo.UpgradeHeal, null, 0);
                else if (up == "colour2") res = InkSolo.Upgrade(tuning, run, InkSolo.UpgradeColour, null, 2);
                else if (up == "colour3") res = InkSolo.Upgrade(tuning, run, InkSolo.UpgradeColour, null, 3);
                else if (up == "colour4") res = InkSolo.Upgrade(tuning, run, InkSolo.UpgradeColour, null, 4);
                else if (up != null && up.StartsWith("heroInk:", StringComparison.Ordinal))
                    res = InkSolo.Upgrade(tuning, run, InkSolo.UpgradeHeroInk, upCells, 0);
                else if (up != null && up.StartsWith("weaponInk:", StringComparison.Ordinal))
                    res = InkSolo.Upgrade(tuning, run, InkSolo.UpgradeWeaponInk, upCells, 0);
                if (res != null && onUpgrade != null) onUpgrade(w, res == "" ? "ok" : res);
            }
            if (sc.Boss && run.Phase == InkSolo.PhaseCleared && run.Wave == InkSolo.Waves)
            {
                InkSolo.StartBoss(tuning, run);
                PlaySoloFight(tuning, run, sc, onCheckpoint);
                if (onFightEnd != null) onFightEnd(run);
            }
            return run;
        }

        // The drawing name of a redraw upgrade string ("heroInk:block" gives
        // "block"), or null for every other upgrade.
        public static string UpgradeDrawingName(string upgrade)
        {
            if (upgrade == null) return null;
            int c = upgrade.IndexOf(':');
            return c < 0 ? null : upgrade.Substring(c + 1);
        }

        public static int[] Recolour(int[] cells, int v)
        {
            int[] c = new int[cells.Length];
            for (int i = 0; i < c.Length; i++) c[i] = cells[i] != 0 ? v : 0;
            return c;
        }
    }
}
