// Replays two recorded scenarios from the golden files (embedded by the
// generator in Generated/InkGenerated.cs) and compares the 32-bit state hashes.
// The Unity layer runs this once at start: it is the only way to see whether
// the scripting backend of a given build (Mono, IL2CPP, a console or mobile
// compiler) keeps the bit-exact arithmetic the core relies on.
using System;
using System.Collections.Generic;

namespace Inkweight.Core
{
    public sealed class InkSelfCheckResult
    {
        public bool Ok;
        public int Compared;
        public string Message; // English, for logs
    }

    public static class InkSelfCheck
    {
        public static int[] PresetCells(string name)
        {
            for (int i = 0; i < InkGenerated.PresetNames.Length; i++)
            {
                if (InkGenerated.PresetNames[i] == name)
                {
                    int w, h;
                    return InkDrawing.Parse(InkGenerated.PresetRows[i], out w, out h);
                }
            }
            throw new ArgumentException("unknown preset " + name);
        }

        public static InkSelfCheckResult Run(InkTuning tuning)
        {
            InkSelfCheckResult res = new InkSelfCheckResult();
            res.Ok = true;
            res.Message = "";
            try
            {
                int W = tuning.CanvasWidth;
                int H = tuning.CanvasHeight;

                // ring
                List<string> got = new List<string>();
                InkRingScenario rs = new InkRingScenario();
                rs.Seed = InkGenerated.RingCheckSeed;
                rs.Figures = new InkFigure[InkGenerated.RingCheckSeats.Length];
                for (int i = 0; i < rs.Figures.Length; i++)
                    rs.Figures[i] = InkPhysics.BuildFigure(PresetCells(InkGenerated.RingCheckSeats[i]), W, H, tuning, InkDrawing.KindFigure, null);
                rs.Scripts = null;
                rs.MaxRounds = InkGenerated.RingCheckMaxRounds;
                rs.MaxTicksPerRound = InkGenerated.RingCheckMaxTicksPerRound;
                rs.CheckpointEvery = InkGenerated.CheckpointEvery;
                InkReplay.RunRing(tuning, rs, delegate (InkRingMatch m) { got.Add(m.Round + ":" + m.Tick + ":" + InkHash.Ring(m)); }, null);
                Compare(res, "ring " + InkGenerated.RingCheckName, got, InkGenerated.RingCheckHashes);

                // solo
                List<string> gotSolo = new List<string>();
                int fight = 0;
                InkSoloScenario ss = new InkSoloScenario();
                ss.Seed = InkGenerated.SoloCheckSeed;
                ss.W = W; ss.H = H;
                ss.HeroCells = InkReplay.Recolour(PresetCells(InkGenerated.SoloCheckHero), 1);
                ss.WeaponCells = InkReplay.Recolour(PresetCells(InkGenerated.SoloCheckWeapon), 1);
                ss.StartColour = 0;
                ss.Style = InkGenerated.SoloCheckStyle;
                ss.WaveEnemyCells = new int[InkGenerated.SoloCheckEnemies.Length][];
                for (int i = 0; i < ss.WaveEnemyCells.Length; i++) ss.WaveEnemyCells[i] = PresetCells(InkGenerated.SoloCheckEnemies[i]);
                ss.WaveStakes = InkGenerated.SoloCheckStakes;
                ss.WaveUpgrades = InkGenerated.SoloCheckUpgrades;
                ss.Boss = InkGenerated.SoloCheckBoss;
                ss.CheckpointEvery = InkGenerated.CheckpointEvery;
                InkReplay.RunSolo(tuning, ss,
                    delegate (InkSoloRun r) { gotSolo.Add(fight + ":" + r.Tick + ":" + InkHash.Solo(r)); },
                    delegate (InkSoloRun r) { fight++; });
                Compare(res, "solo " + InkGenerated.SoloCheckName, gotSolo, InkGenerated.SoloCheckHashes);
            }
            catch (Exception e)
            {
                res.Ok = false;
                res.Message += "exception: " + e.Message + "; ";
            }
            if (res.Ok) res.Message = "self check passed, " + res.Compared + " checkpoints bit-identical";
            return res;
        }

        private static void Compare(InkSelfCheckResult res, string name, List<string> got, string[] want)
        {
            if (got.Count != want.Length)
            {
                res.Ok = false;
                res.Message += name + ": " + got.Count + " checkpoints, expected " + want.Length + "; ";
            }
            int n = got.Count < want.Length ? got.Count : want.Length;
            for (int i = 0; i < n; i++)
            {
                res.Compared++;
                if (got[i] != want[i])
                {
                    res.Ok = false;
                    res.Message += name + ": first difference at checkpoint " + i + " (got " + got[i] + ", expected " + want[i] + "); ";
                    return;
                }
            }
        }
    }
}
