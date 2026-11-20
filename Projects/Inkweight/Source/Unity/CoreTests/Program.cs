// Console test runner and generator for the Inkweight C# core.
//
//   dotnet run --project CoreTests                run all tests
//   dotnet run --project CoreTests -- --generate  rewrite Core/Generated/InkGenerated.cs
//                                                 from Source/Shared (tuning + golden files)
//
// Optional: --shared <dir> (default: found by walking up to Source/Shared),
//           --generated <file> (default: the file inside the Unity project).
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using Inkweight.Core;

namespace Inkweight.CoreTests
{
    public static class Program
    {
        private static int checks;
        private static int failures;
        private static int groupFailures;

        public static int Main(string[] args)
        {
            CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
            string shared = null;
            string generated = null;
            bool generate = false;
            for (int i = 0; i < args.Length; i++)
            {
                if (args[i] == "--generate") generate = true;
                else if (args[i] == "--shared" && i + 1 < args.Length) shared = args[++i];
                else if (args[i] == "--generated" && i + 1 < args.Length) generated = args[++i];
                else { Console.WriteLine("unknown argument " + args[i]); return 2; }
            }
            string unityDir = FindUp("CoreTests" + Path.DirectorySeparatorChar + "CoreTests.csproj");
            if (unityDir == null) { Console.WriteLine("cannot find the Source/Unity folder"); return 2; }
            if (shared == null) shared = Path.Combine(unityDir, "..", "Shared");
            if (generated == null)
                generated = Path.Combine(unityDir, "Inkweight", "Assets", "Inkweight", "Core", "Generated", "InkGenerated.cs");
            shared = Path.GetFullPath(shared);
            generated = Path.GetFullPath(generated);

            string tuningText = File.ReadAllText(Path.Combine(shared, "ink_tuning.json"));
            string statText = File.ReadAllText(Path.Combine(shared, "golden", "stat_vectors.json"));
            string traceText = File.ReadAllText(Path.Combine(shared, "golden", "sim_traces.json"));
            object traces = InkJson.Parse(traceText);
            string wanted = BuildGenerated(tuningText, traces);

            if (generate)
            {
                File.WriteAllText(generated, wanted, new UTF8Encoding(false));
                Console.WriteLine("wrote " + generated + " (" + wanted.Length + " characters)");
                return 0;
            }

            Console.WriteLine("Inkweight core tests");
            Console.WriteLine("shared files: " + shared);
            Console.WriteLine("runtime: " + System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription
                + ", " + System.Runtime.InteropServices.RuntimeInformation.ProcessArchitecture);

            InkTuning tuning = InkTuning.FromJson(tuningText);

            Begin("generated file is up to date");
            string onDisk = File.Exists(generated) ? File.ReadAllText(generated) : "";
            Check(Normalise(onDisk) == Normalise(wanted),
                "Core/Generated/InkGenerated.cs differs from Source/Shared; run: dotnet run --project CoreTests -- --generate");
            InkTuning embedded = InkTuning.FromJson(InkGenerated.TuningJson);
            Check(Normalise(InkGenerated.TuningJson) == Normalise(tuningText), "embedded tuning text differs from ink_tuning.json");
            Check(embedded.Version == tuning.Version, "embedded tuning version");
            End();

            Begin("tuning and golden versions");
            object stat = InkJson.Parse(statText);
            Check(InkJson.Str(InkJson.Get(stat, "tuningVersion")) == tuning.Version, "stat_vectors tuningVersion differs from ink_tuning.json");
            Check(InkJson.Str(InkJson.Get(traces, "tuningVersion")) == tuning.Version, "sim_traces tuningVersion differs from ink_tuning.json");
            Check(tuning.CanvasWidth == 32 && tuning.CanvasHeight == 32, "canvas is 32 x 32");
            End();

            TestSourceRules(Path.GetDirectoryName(Path.GetDirectoryName(generated)));
            TestGenerator();
            TestStatVectors(tuning, stat);
            TestTraces(tuning, tuningText, traces);
            TestRulesV2(tuning);

            Begin("self check as run inside Unity (embedded tuning and hashes)");
            InkSelfCheckResult sc = InkSelfCheck.Run(embedded);
            Check(sc.Ok, sc.Message);
            Console.WriteLine("  " + sc.Message);
            End();

            Console.WriteLine(failures == 0
                ? "RESULT: PASS (" + checks + " checks, 0 failed)"
                : "RESULT: FAIL (" + checks + " checks, " + failures + " failed)");
            return failures == 0 ? 0 : 1;
        }

        // ---------------------------------------------------------------- helpers

        private static string FindUp(string relative)
        {
            string[] starts = { Directory.GetCurrentDirectory(), AppContext.BaseDirectory };
            for (int s = 0; s < starts.Length; s++)
            {
                DirectoryInfo d = new DirectoryInfo(starts[s]);
                while (d != null)
                {
                    if (File.Exists(Path.Combine(d.FullName, relative))) return d.FullName;
                    d = d.Parent;
                }
            }
            return null;
        }

        private static string Normalise(string s) { return s.Replace("\r\n", "\n"); }

        private static string currentGroup;

        private static void Begin(string name) { currentGroup = name; groupFailures = 0; }

        private static void End()
        {
            Console.WriteLine((groupFailures == 0 ? "ok    " : "FAIL  ") + currentGroup);
        }

        private static void Check(bool ok, string message)
        {
            checks++;
            if (ok) return;
            failures++;
            groupFailures++;
            if (groupFailures <= 8) Console.WriteLine("  FAILED [" + currentGroup + "] " + message);
            else if (groupFailures == 9) Console.WriteLine("  ... further failures in this group are not listed");
        }

        private static string R(double v) { return v.ToString("R", CultureInfo.InvariantCulture); }

        // Exact comparison (bit pattern apart from the sign of zero, which JSON
        // text cannot carry reliably; the state hash covers the full bits).
        private static void Same(double got, object want, string what)
        {
            double w = InkJson.Num(want);
            Check(got == w, what + ": got " + R(got) + ", expected " + R(w));
        }

        private static void SameBool(bool got, object want, string what)
        {
            Check(want is bool && got == (bool)want, what + ": got " + got + ", expected " + want);
        }

        private static void SameStr(string got, object want, string what)
        {
            Check(got == (want as string), what + ": got '" + got + "', expected '" + want + "'");
        }

        private static int[] Cells(object rows)
        {
            int w, h;
            return InkDrawing.Parse(InkJson.StrArray(rows), out w, out h);
        }

        // ---------------------------------------------------------------- tests

        // The determinism contract as a test: the core sources may use only
        // double arithmetic with Math.Sqrt and Math.Floor, and no engine type.
        private static void TestSourceRules(string coreDir)
        {
            string[] files = Directory.GetFiles(coreDir, "*.cs", SearchOption.AllDirectories);
            Begin("core source rules (" + files.Length + " files: no engine reference, no float, only Math.Sqrt and Math.Floor)");
            System.Text.RegularExpressions.Regex forbidden = new System.Text.RegularExpressions.Regex(
                @"\bfloat\b|\bdecimal\b|\bMathF\b|\bMath\.(?!Sqrt\b|Floor\b)|UnityEngine|UnityEditor|System\.Numerics|FusedMultiplyAdd|\bVector[234]\b");
            Check(files.Length >= 10, "core sources found in " + coreDir);
            for (int f = 0; f < files.Length; f++)
            {
                if (files[f].EndsWith("InkGenerated.cs", StringComparison.Ordinal)) continue;
                string[] lines = File.ReadAllLines(files[f]);
                for (int i = 0; i < lines.Length; i++)
                {
                    string code = lines[i];
                    int c = code.IndexOf("//", StringComparison.Ordinal);
                    if (c >= 0) code = code.Substring(0, c);
                    Check(!forbidden.IsMatch(code), Path.GetFileName(files[f]) + " line " + (i + 1) + ": " + lines[i].Trim());
                }
            }
            End();
        }

        private static void TestGenerator()
        {
            Begin("random generator and hash basics");
            InkRng a = InkRng.Create(1);
            InkRng b = InkRng.Create(1);
            bool same = true;
            bool inRange = true;
            for (int i = 0; i < 1000; i++)
            {
                uint x = a.U32();
                if (x != b.U32()) same = false;
                double f = a.Float(); b.Float();
                if (f < 0 || f >= 1) inRange = false;
                int k = a.Int(7); b.Int(7);
                if (k < 0 || k >= 7) inRange = false;
            }
            Check(same, "same seed gives the same sequence");
            Check(inRange, "Float in [0,1) and Int in [0,n)");
            Check(InkRng.Create(0x9e3779b9u).S != 0, "zero state is avoided");
            // FNV-1a of no data, and of the eight zero bytes of 0.0
            InkHash h = InkHash.Create();
            Check(h.Hex() == "811c9dc5", "empty hash is the FNV offset basis");
            h.Add(0.0);
            uint manual = 0x811c9dc5u;
            unchecked { for (int i = 0; i < 8; i++) manual *= 0x01000193u; }
            Check(h.H == manual, "hash of 0.0");
            End();
        }

        private static void TestStatVectors(InkTuning tuning, object stat)
        {
            List<object> items = InkJson.Arr(InkJson.Get(stat, "items"));
            Begin("stat vectors (" + items.Count + " drawings, every field exact)");
            for (int i = 0; i < items.Count; i++)
            {
                object it = items[i];
                string name = InkJson.Str(InkJson.Get(it, "name"));
                string kind = InkJson.Str(InkJson.Get(it, "kind"));
                string[] rows = InkJson.StrArray(InkJson.Get(it, "rows"));
                int W, H;
                int[] cells = InkDrawing.Parse(rows, out W, out H);
                Check(W == 32 && H == 32, name + ": size");
                string[] back = InkDrawing.ToRows(cells, W, H);
                bool rowsSame = back.Length == rows.Length;
                for (int y = 0; rowsSame && y < rows.Length; y++) if (back[y] != rows[y]) rowsSame = false;
                Check(rowsSame, name + ": rows round trip");
                double budget = InkJson.Num(InkJson.Get(it, "budget"));
                InkFigure fig = InkPhysics.BuildFigure(cells, W, H, tuning, kind, budget);
                InkStats s = fig.Stats;
                object e = InkJson.Get(it, "expect");
                Same(s.Budget, InkJson.Get(it, "budget"), name + ".budget");
                Same(s.Filled, InkJson.Get(e, "filled"), name + ".filled");
                Same(s.Drips, InkJson.Get(e, "drips"), name + ".drips");
                Same(s.N, InkJson.Get(e, "N"), name + ".N");
                Same(s.C, InkJson.Get(e, "C"), name + ".C");
                Same(s.S, InkJson.Get(e, "S"), name + ".S");
                Same(s.Enclosed, InkJson.Get(e, "enclosed"), name + ".enclosed");
                Same(s.P, InkJson.Get(e, "P"), name + ".P");
                Same(s.PocketCells, InkJson.Get(e, "pocketCells"), name + ".pocketCells");
                Same(s.Push, InkJson.Get(e, "push"), name + ".push");
                Same(fig.Mass, InkJson.Get(e, "mass"), name + ".mass");
                int sharpFlags = 0;
                for (int k = 0; k < fig.Count; k++) if (fig.Sharp[k]) sharpFlags++;
                Check(sharpFlags == s.S, name + ": sharp flags of the figure agree with S");
                double[] cc = InkJson.NumArray(InkJson.Get(e, "colourCounts"));
                Check(cc.Length == 4 && cc[0] == s.ColourCounts[0] && cc[1] == s.ColourCounts[1]
                    && cc[2] == s.ColourCounts[2] && cc[3] == s.ColourCounts[3], name + ".colourCounts");
                Same(s.Element, InkJson.Get(e, "element"), name + ".element");
                SameBool(s.BigEnough, InkJson.Get(e, "bigEnough"), name + ".bigEnough");
                SameBool(s.WithinBudget, InkJson.Get(e, "withinBudget"), name + ".withinBudget");
                SameBool(s.Valid, InkJson.Get(e, "valid"), name + ".valid");
                Same(s.Weight, InkJson.Get(e, "weight"), name + ".weight");
                Same(s.Armour, InkJson.Get(e, "armour"), name + ".armour");
                Same(s.Sharpness, InkJson.Get(e, "sharpness"), name + ".sharpness");
                Same(s.TopSpeed, InkJson.Get(e, "topSpeed"), name + ".topSpeed");
                Same(s.Cx, InkJson.Get(e, "cx"), name + ".cx");
                Same(s.Cy, InkJson.Get(e, "cy"), name + ".cy");
                Same(s.Radius, InkJson.Get(e, "radius"), name + ".radius");
                Same(s.Inertia, InkJson.Get(e, "inertia"), name + ".inertia");
                Same(fig.Boundary.Length, InkJson.Get(e, "boundaryCells"), name + ".boundaryCells");
                Same(fig.TurnRate, InkJson.Get(e, "turnRate"), name + ".turnRate");
                Same(fig.AccelK, InkJson.Get(e, "accelK"), name + ".accelK");
                // the default budget must give the same result when it is the default
                double def = kind == InkDrawing.KindWeapon ? tuning.WeaponBudget : tuning.FigureBudget;
                if (budget == def)
                {
                    InkStats d = InkDrawing.ComputeStats(cells, W, H, tuning, kind, null);
                    Check(d.Budget == budget && d.Valid == s.Valid, name + ": default budget");
                }
            }
            End();
        }

        private static void TestTraces(InkTuning tuning, string tuningText, object traces)
        {
            object drawings = InkJson.Get(traces, "drawings");
            List<object> items = InkJson.Arr(InkJson.Get(traces, "items"));
            for (int i = 0; i < items.Count; i++)
            {
                object it = items[i];
                string mode = InkJson.Str(InkJson.Get(it, "mode"));
                if (mode == "ring") TestRingTrace(tuning, drawings, it);
                else if (mode == "solo") TestSoloTrace(tuning, tuningText, drawings, it);
                else { Begin("trace " + i); Check(false, "unknown mode " + mode); End(); }
            }
        }

        private static InkRingScenario RingScenario(InkTuning tuning, object drawings, object it)
        {
            string[] seats = InkJson.StrArray(InkJson.Get(it, "seats"));
            InkRingScenario sc = new InkRingScenario();
            sc.Seed = (uint)InkJson.Num(InkJson.Get(it, "seed"));
            sc.Figures = new InkFigure[seats.Length];
            for (int s = 0; s < seats.Length; s++)
                sc.Figures[s] = InkPhysics.BuildFigure(Cells(InkJson.Get(drawings, seats[s])), 32, 32, tuning, InkDrawing.KindFigure, null);
            Dictionary<string, object> scripts = InkJson.Obj(InkJson.Get(it, "scripts"));
            sc.Scripts = new double[seats.Length][][];
            foreach (KeyValuePair<string, object> kv in scripts)
            {
                int seat = int.Parse(kv.Key, CultureInfo.InvariantCulture);
                List<object> segs = InkJson.Arr(kv.Value);
                sc.Scripts[seat] = new double[segs.Count][];
                for (int k = 0; k < segs.Count; k++) sc.Scripts[seat][k] = InkJson.NumArray(segs[k]);
            }
            sc.MaxRounds = (int)InkJson.Num(InkJson.Get(it, "maxRounds"));
            sc.MaxTicksPerRound = (int)InkJson.Num(InkJson.Get(it, "maxTicksPerRound"));
            sc.CheckpointEvery = (int)InkJson.Num(InkJson.Get(it, "checkpointEvery"));
            double[] styles = InkJson.NumArray(InkJson.Get(it, "botStyle"));
            sc.BotStyles = new int[styles.Length];
            for (int s = 0; s < styles.Length; s++) sc.BotStyles[s] = (int)styles[s];
            return sc;
        }

        private static void TestRingTrace(InkTuning tuning, object drawings, object it)
        {
            string name = InkJson.Str(InkJson.Get(it, "name"));
            List<object> cps = InkJson.Arr(InkJson.Get(it, "checkpoints"));
            List<object> rounds = InkJson.Arr(InkJson.Get(it, "rounds"));
            Begin("ring trace " + name + " (" + cps.Count + " checkpoints, bit for bit)");
            InkRingScenario sc = RingScenario(tuning, drawings, it);
            Check(sc.BotStyles.Length == sc.Figures.Length, name + ": one bot style per seat");
            string[] control = InkJson.StrArray(InkJson.Get(it, "control"));
            for (int s = 0; s < control.Length; s++)
                Check((control[s] == "script") == (sc.Scripts[s] != null), name + ": control of seat " + s);
            int cpIndex = 0;
            int roundIndex = 0;
            int totalTicks = 0;
            InkRingMatch match = InkReplay.RunRing(tuning, sc,
                delegate (InkRingMatch m)
                {
                    string at = name + " checkpoint " + cpIndex;
                    if (cpIndex >= cps.Count) { Check(false, at + ": more checkpoints than recorded"); cpIndex++; return; }
                    object cp = cps[cpIndex];
                    Same(m.Round, InkJson.Get(cp, "round"), at + " round");
                    Same(m.Tick, InkJson.Get(cp, "tick"), at + " tick");
                    SameStr(InkHash.Ring(m), InkJson.Get(cp, "hash"), at + " (round " + m.Round + " tick " + m.Tick + ") hash");
                    Same(m.RingRadius, InkJson.Get(cp, "ringRadius"), at + " ringRadius");
                    List<object> bodies = InkJson.Arr(InkJson.Get(cp, "bodies"));
                    Check(bodies.Count == m.World.Bodies.Count, at + " body count");
                    for (int b = 0; b < bodies.Count && b < m.World.Bodies.Count; b++)
                    {
                        double[] w = InkJson.NumArray(bodies[b]);
                        InkBody body = m.World.Bodies[b];
                        double[] g = { body.X, body.Y, body.Vx, body.Vy, body.Fx, body.Fy, body.Hp, body.Alive ? 1 : 0 };
                        for (int k = 0; k < 8; k++)
                            Check(g[k] == w[k], at + " body " + b + " value " + k + ": got " + R(g[k]) + ", expected " + R(w[k]));
                    }
                    cpIndex++;
                },
                delegate (InkRingMatch m)
                {
                    string at = name + " round " + (roundIndex + 1);
                    totalTicks += m.Tick;
                    if (roundIndex >= rounds.Count) { Check(false, at + ": more rounds than recorded"); roundIndex++; return; }
                    object r = rounds[roundIndex];
                    Same(m.Round, InkJson.Get(r, "round"), at + " round");
                    Same(m.Tick, InkJson.Get(r, "ticks"), at + " ticks");
                    SameStr(m.Phase, InkJson.Get(r, "phase"), at + " phase");
                    Same(m.RoundWinner, InkJson.Get(r, "winner"), at + " winner");
                    double[] ot = InkJson.NumArray(InkJson.Get(r, "outTick"));
                    string[] or = InkJson.StrArray(InkJson.Get(r, "outReason"));
                    for (int s = 0; s < m.SeatCount; s++)
                    {
                        Check(ot[s] == m.OutTick[s], at + " outTick seat " + s);
                        Check(or[s] == m.OutReason[s], at + " outReason seat " + s);
                    }
                    roundIndex++;
                });
            Check(cpIndex == cps.Count, name + ": " + cpIndex + " checkpoints, expected " + cps.Count);
            Check(roundIndex == rounds.Count, name + ": " + roundIndex + " rounds, expected " + rounds.Count);
            object fin = InkJson.Get(it, "final");
            SameStr(match.Phase, InkJson.Get(fin, "phase"), name + " final phase");
            Same(match.MatchWinner, InkJson.Get(fin, "matchWinner"), name + " final matchWinner");
            double[] wins = InkJson.NumArray(InkJson.Get(fin, "wins"));
            double[] lost = InkJson.NumArray(InkJson.Get(fin, "lost"));
            for (int s = 0; s < match.SeatCount; s++)
            {
                Check(wins[s] == match.Wins[s], name + " final wins seat " + s);
                Check(lost[s] == match.Lost[s], name + " final lost seat " + s);
            }
            Console.WriteLine("  " + roundIndex + " rounds, " + totalTicks + " ticks");
            End();
        }

        private static InkSoloScenario SoloScenario(object drawings, object it)
        {
            InkSoloScenario sc = new InkSoloScenario();
            sc.Seed = (uint)InkJson.Num(InkJson.Get(it, "seed"));
            sc.W = 32; sc.H = 32;
            sc.HeroCells = InkReplay.Recolour(Cells(InkJson.Get(drawings, InkJson.Str(InkJson.Get(it, "hero")))), 1);
            sc.WeaponCells = InkReplay.Recolour(Cells(InkJson.Get(drawings, InkJson.Str(InkJson.Get(it, "weapon")))), 1);
            sc.StartColour = (int)InkJson.Num(InkJson.Get(it, "startColour"));
            sc.Style = InkJson.Str(InkJson.Get(it, "heroBot")) == "brawl" ? 1 : 0;
            List<object> waves = InkJson.Arr(InkJson.Get(it, "waves"));
            sc.WaveEnemyCells = new int[waves.Count][];
            sc.WaveStakes = new int[waves.Count];
            sc.WaveUpgrades = new string[waves.Count];
            sc.WaveUpgradeCells = new int[waves.Count][];
            for (int w = 0; w < waves.Count; w++)
            {
                sc.WaveEnemyCells[w] = Cells(InkJson.Get(drawings, InkJson.Str(InkJson.Get(waves[w], "enemy"))));
                sc.WaveStakes[w] = (int)InkJson.Num(InkJson.Get(waves[w], "stake"));
                sc.WaveUpgrades[w] = InkJson.Get(waves[w], "upgrade") as string;
                string dn = InkReplay.UpgradeDrawingName(sc.WaveUpgrades[w]);
                if (dn != null) sc.WaveUpgradeCells[w] = InkReplay.Recolour(Cells(InkJson.Get(drawings, dn)), 1);
            }
            sc.Boss = (bool)InkJson.Get(it, "boss");
            sc.CheckpointEvery = (int)InkJson.Num(InkJson.Get(it, "checkpointEvery"));
            return sc;
        }

        private static void TestSoloTrace(InkTuning baseTuning, string tuningText, object drawings, object it)
        {
            string name = InkJson.Str(InkJson.Get(it, "name"));
            // a trace with tuningOverrides runs with those values replaced
            InkTuning tuning = baseTuning;
            Dictionary<string, object> ov = InkJson.Obj(InkJson.Get(it, "tuningOverrides"));
            if (ov.Count > 0)
            {
                Dictionary<string, double> overrides = new Dictionary<string, double>();
                foreach (KeyValuePair<string, object> kv in ov) overrides[kv.Key] = InkJson.Num(kv.Value);
                tuning = InkTuning.FromJson(tuningText, overrides);
            }
            List<object> cps = InkJson.Arr(InkJson.Get(it, "checkpoints"));
            List<object> fights = InkJson.Arr(InkJson.Get(it, "fights"));
            Begin("solo trace " + name + " (" + cps.Count + " checkpoints, bit for bit)");
            SameBool(true, InkJson.Get(it, "heroAndWeaponRecolouredBlack"), name + ": recolour flag");
            InkSoloScenario sc = SoloScenario(drawings, it);
            int cpIndex = 0;
            int fight = 0;
            int totalTicks = 0;
            string[] upgradeGot = new string[fights.Count + 8];
            for (int i = 0; i < upgradeGot.Length; i++) upgradeGot[i] = "";
            InkSoloRun run = InkReplay.RunSolo(tuning, sc,
                delegate (InkSoloRun r)
                {
                    string at = name + " checkpoint " + cpIndex;
                    if (cpIndex >= cps.Count) { Check(false, at + ": more checkpoints than recorded"); cpIndex++; return; }
                    object cp = cps[cpIndex];
                    Same(fight, InkJson.Get(cp, "fight"), at + " fight");
                    Same(r.Tick, InkJson.Get(cp, "tick"), at + " tick");
                    SameStr(InkHash.Solo(r), InkJson.Get(cp, "hash"), at + " (fight " + fight + " tick " + r.Tick + ") hash");
                    InkBody h = r.World.Bodies[0];
                    double[] w = InkJson.NumArray(InkJson.Get(cp, "hero"));
                    double[] g = { h.X, h.Y, h.Vx, h.Vy, h.Fx, h.Fy, h.Hp };
                    for (int k = 0; k < 7; k++)
                        Check(g[k] == w[k], at + " hero value " + k + ": got " + R(g[k]) + ", expected " + R(w[k]));
                    int alive = 0;
                    for (int b = 1; b < r.World.Bodies.Count; b++) if (r.World.Bodies[b].Alive) alive++;
                    Same(alive, InkJson.Get(cp, "enemiesAlive"), at + " enemiesAlive");
                    Same(r.Shots.Count, InkJson.Get(cp, "shots"), at + " shots");
                    Same(r.Drops.Count, InkJson.Get(cp, "drops"), at + " drops");
                    Same(r.Wallet, InkJson.Get(cp, "wallet"), at + " wallet");
                    Same(r.Score, InkJson.Get(cp, "score"), at + " score");
                    cpIndex++;
                },
                delegate (InkSoloRun r)
                {
                    string at = name + " fight " + fight;
                    totalTicks += r.Tick;
                    if (fight < fights.Count)
                    {
                        object f = fights[fight];
                        Same(fight, InkJson.Get(f, "wave"), at + " wave");
                        SameStr(r.Phase, InkJson.Get(f, "phase"), at + " phase");
                        SameStr(r.EndReason, InkJson.Get(f, "endReason"), at + " endReason");
                        Same(r.Tick, InkJson.Get(f, "ticks"), at + " ticks");
                        Same(r.Copies, InkJson.Get(f, "copies"), at + " copies");
                        Same(r.HeroHp, InkJson.Get(f, "heroHp"), at + " heroHp");
                        Same(r.HeroMaxHp, InkJson.Get(f, "heroMaxHp"), at + " heroMaxHp");
                        Same(r.Score, InkJson.Get(f, "score"), at + " score");
                        Same(r.Wallet, InkJson.Get(f, "wallet"), at + " wallet");
                    }
                    else Check(false, at + ": more fights than recorded");
                    fight++;
                },
                delegate (int wave, string result)
                {
                    if (wave < upgradeGot.Length) upgradeGot[wave] = result;
                });
            for (int f = 0; f < fights.Count; f++)
                SameStr(upgradeGot[f], InkJson.Get(fights[f], "upgrade"), name + " fight " + f + " upgrade");
            Check(cpIndex == cps.Count, name + ": " + cpIndex + " checkpoints, expected " + cps.Count);
            Check(fight == fights.Count, name + ": " + fight + " fights, expected " + fights.Count);
            object fin = InkJson.Get(it, "final");
            SameStr(run.Phase, InkJson.Get(fin, "phase"), name + " final phase");
            SameStr(run.EndReason, InkJson.Get(fin, "endReason"), name + " final endReason");
            Same(run.Wave, InkJson.Get(fin, "wave"), name + " final wave");
            Same(run.Score, InkJson.Get(fin, "score"), name + " final score");
            Same(run.Wallet, InkJson.Get(fin, "wallet"), name + " final wallet");
            Same(run.HeroHp, InkJson.Get(fin, "heroHp"), name + " final heroHp");
            Same(run.HeroMaxHp, InkJson.Get(fin, "heroMaxHp"), name + " final heroMaxHp");
            Same(run.HeroBudget, InkJson.Get(fin, "heroBudget"), name + " final heroBudget");
            Same(run.WeaponBudget, InkJson.Get(fin, "weaponBudget"), name + " final weaponBudget");
            Same(run.HeroFig.Stats.N, InkJson.Get(fin, "heroN"), name + " final heroN");
            Same(run.WeaponFig.Stats.N, InkJson.Get(fin, "weaponN"), name + " final weaponN");
            Console.WriteLine("  " + fight + " fights, " + totalTicks + " ticks");
            End();
        }

        // Version 2 rules that the golden files cannot show: the thrown errors
        // and the helper functions the Unity layer displays.
        private static void TestRulesV2(InkTuning tuning)
        {
            Begin("rules version 2: figure check, thrown errors, stake helpers, tuning overrides");
            int W = tuning.CanvasWidth, H = tuning.CanvasHeight;
            int[] big = InkSelfCheck.PresetCells("block");
            int[] tiny = new int[W * H];
            for (int i = 0; i < 5; i++) tiny[10 * W + 10 + i] = 1;
            int[] full = new int[W * H];
            for (int y = 8; y < 24; y++) for (int x = 8; x < 24; x++) full[y * W + x] = 1; // 256 cells
            InkFigure fBig = InkPhysics.BuildFigure(big, W, H, tuning, InkDrawing.KindFigure, null);
            InkFigure fTiny = InkPhysics.BuildFigure(tiny, W, H, tuning, InkDrawing.KindFigure, null);
            InkFigure fFull = InkPhysics.BuildFigure(full, W, H, tuning, InkDrawing.KindFigure, null);
            InkRingMatch m = InkRing.CreateMatch(tuning, 2, 5);
            Check(InkRing.CheckFigure(tuning, m, 0, fBig) == "", "valid figure passes the check");
            Check(InkRing.CheckFigure(tuning, m, 0, null) == "tooSmall", "missing figure is tooSmall");
            Check(InkRing.CheckFigure(tuning, m, 0, fTiny) == "tooSmall", "five cells are tooSmall");
            Check(InkRing.CheckFigure(tuning, m, 0, fFull) == "overBudget", "256 cells are overBudget at 220");
            string msg = "";
            try { InkRing.StartRound(tuning, m, new InkFigure[] { fBig, fFull }); } catch (InvalidOperationException e) { msg = e.Message; }
            Check(msg == "seat 1 figure: overBudget", "StartRound refuses an invalid figure: '" + msg + "'");
            Check(m.Round == 0 && m.Phase == InkRing.PhaseDraw && m.World == null, "the match is unchanged after the refusal");
            m.Lost[1] = 2; // 220 * 1.30 = 286
            Check(InkRing.CheckFigure(tuning, m, 1, fFull) == "", "256 cells pass with catch-up ink");
            Check(m.BotStyle.Length == 2 && m.BotStyle[0] == 0 && m.BotStyle[1] == 0, "bot styles start as 0");

            InkSoloRun run = InkSolo.CreateRun(tuning, 3, InkReplay.Recolour(big, 1),
                InkReplay.Recolour(InkSelfCheck.PresetCells("needle"), 1), W, H, 0);
            msg = "";
            try { InkSolo.StartWave(tuning, run, big, 3); } catch (ArgumentException e) { msg = e.Message; }
            Check(msg == "bad stake index", "StartWave refuses stake index 3: '" + msg + "'");
            msg = "";
            try { InkSolo.StartWave(tuning, run, big, -1); } catch (ArgumentException e) { msg = e.Message; }
            Check(msg == "bad stake index", "StartWave refuses stake index -1");
            Check(run.Phase == InkSolo.PhasePrepare && run.EnemyDrawings.Count == 0, "the run is unchanged after the refusal");
            int n = fBig.Stats.N;
            for (int st = 0; st < tuning.Stakes.Length; st++)
            {
                int copies = InkSolo.Copies(tuning, 0, st, n);
                double drop = InkSolo.DropValue(tuning, 0, st, n);
                Check(copies >= 1 && copies <= tuning.MaxCopies, "copies in range at stake " + st);
                Check(drop * copies <= tuning.WaveBudgets[0] * tuning.Stakes[st], "a wave never pays more than its staked budget (stake " + st + ")");
                double scale = InkSolo.WaveArmourScale(tuning, 0, st, n);
                Check(scale >= tuning.CopyArmourScaleMin && scale <= tuning.CopyArmourScaleMax, "armour scale in range at stake " + st);
            }
            InkSolo.StartWave(tuning, run, big, 2);
            Check(run.StakeIndex == 2 && run.DropValue == InkSolo.DropValue(tuning, 0, 2, n), "run fields stakeIndex and dropValue");
            InkBody en = run.World.Bodies[1];
            Check(en.MaxHp == InkSolo.EnemyArmour(tuning, fBig, InkSolo.WaveArmourScale(tuning, 0, 2, n)) && en.Hp == en.MaxHp, "enemy armour comes from EnemyArmour");
            Check(en.DamageMult == tuning.EnemyDamageMult * tuning.StakeDamageMult[2], "stake raises enemy damage");
            Check(en.TopSpeed == fBig.Stats.TopSpeed * (tuning.EnemySpeedMult * tuning.StakeSpeedMult[2]), "stake raises enemy speed");

            Dictionary<string, double> ov = new Dictionary<string, double>();
            ov["solo.waveMaxTicks"] = 600;
            InkTuning t2 = InkTuning.FromJson(InkGenerated.TuningJson, ov);
            Check(t2.WaveMaxTicks == 600 && tuning.WaveMaxTicks != 600, "tuning override replaces one value in a copy");
            msg = "";
            ov["solo.noSuchKey"] = 1;
            try { InkTuning.FromJson(InkGenerated.TuningJson, ov); } catch (FormatException e) { msg = e.Message; }
            Check(msg != "", "an override of an unknown key is refused");
            End();
        }

        // ---------------------------------------------------------------- generator

        private static string Lit(string s)
        {
            return "\"" + s.Replace("\\", "\\\\").Replace("\"", "\\\"") + "\"";
        }

        private static string LitArray(IList<string> a)
        {
            StringBuilder sb = new StringBuilder("new string[] { ");
            for (int i = 0; i < a.Count; i++) sb.Append(i > 0 ? ", " : "").Append(a[i] == null ? "null" : Lit(a[i]));
            return sb.Append(" }").ToString();
        }

        // Text of Core/Generated/InkGenerated.cs: the tuning file verbatim, the
        // archetype drawings of the trace file as presets, and the checkpoint
        // hashes of one bot-only ring trace and one solo trace for the in-engine
        // self check.
        private static string BuildGenerated(string tuningText, object traces)
        {
            string nl = "\n";
            StringBuilder sb = new StringBuilder();
            sb.Append("// GENERATED FILE - do not edit by hand." + nl);
            sb.Append("// Source: Source/Shared/ink_tuning.json and Source/Shared/golden/sim_traces.json." + nl);
            sb.Append("// Regenerate after every tuning or golden change:" + nl);
            sb.Append("//   dotnet run --project Projects/Inkweight/Source/Unity/CoreTests -- --generate" + nl);
            sb.Append("// The core tests fail while this file is out of date." + nl);
            sb.Append("namespace Inkweight.Core" + nl + "{" + nl);
            sb.Append("    public static class InkGenerated" + nl + "    {" + nl);
            sb.Append("        public const string TuningJson = @\"" + Normalise(tuningText).Replace("\"", "\"\"") + "\";" + nl + nl);

            Dictionary<string, object> drawings = InkJson.Obj(InkJson.Get(traces, "drawings"));
            List<string> names = new List<string>();
            foreach (KeyValuePair<string, object> kv in drawings) names.Add(kv.Key);
            sb.Append("        // archetype drawings recorded in the golden trace file (bot and example drawings)" + nl);
            sb.Append("        public static readonly string[] PresetNames = " + LitArray(names) + ";" + nl + nl);
            sb.Append("        public static readonly string[][] PresetRows = new string[][]" + nl + "        {" + nl);
            for (int i = 0; i < names.Count; i++)
            {
                string[] rows = InkJson.StrArray(drawings[names[i]]);
                sb.Append("            // " + names[i] + nl);
                sb.Append("            new string[]" + nl + "            {" + nl);
                for (int y = 0; y < rows.Length; y++) sb.Append("                " + Lit(rows[y]) + "," + nl);
                sb.Append("            }," + nl);
            }
            sb.Append("        };" + nl + nl);

            List<object> items = InkJson.Arr(InkJson.Get(traces, "items"));
            object ring = null;
            object solo = null;
            for (int i = 0; i < items.Count; i++)
            {
                object it = items[i];
                string mode = InkJson.Str(InkJson.Get(it, "mode"));
                if (mode == "ring" && ring == null && InkJson.Obj(InkJson.Get(it, "scripts")).Count == 0) ring = it;
                if (mode == "solo" && InkJson.Obj(InkJson.Get(it, "tuningOverrides")).Count == 0
                    && (solo == null || (!(bool)InkJson.Get(solo, "boss") && (bool)InkJson.Get(it, "boss")))) solo = it;
            }
            if (ring == null || solo == null) throw new InvalidOperationException("the trace file needs a bot-only ring trace and a solo trace");

            int every = (int)InkJson.Num(InkJson.Get(ring, "checkpointEvery"));
            if (every != (int)InkJson.Num(InkJson.Get(solo, "checkpointEvery"))) throw new InvalidOperationException("checkpointEvery differs");
            sb.Append("        // self check: recorded state hashes (see InkSelfCheck.cs)" + nl);
            sb.Append("        public const int CheckpointEvery = " + every + ";" + nl + nl);

            List<string> hashes = new List<string>();
            foreach (object cp in InkJson.Arr(InkJson.Get(ring, "checkpoints")))
                hashes.Add(I(InkJson.Get(cp, "round")) + ":" + I(InkJson.Get(cp, "tick")) + ":" + InkJson.Str(InkJson.Get(cp, "hash")));
            sb.Append("        public const string RingCheckName = " + Lit(InkJson.Str(InkJson.Get(ring, "name"))) + ";" + nl);
            sb.Append("        public const uint RingCheckSeed = " + I(InkJson.Get(ring, "seed")) + "u;" + nl);
            sb.Append("        public const int RingCheckMaxRounds = " + I(InkJson.Get(ring, "maxRounds")) + ";" + nl);
            sb.Append("        public const int RingCheckMaxTicksPerRound = " + I(InkJson.Get(ring, "maxTicksPerRound")) + ";" + nl);
            sb.Append("        public static readonly string[] RingCheckSeats = " + LitArray(InkJson.StrArray(InkJson.Get(ring, "seats"))) + ";" + nl);
            StringBuilder styles = new StringBuilder("new int[] { ");
            List<object> styleList = InkJson.Arr(InkJson.Get(ring, "botStyle"));
            for (int s = 0; s < styleList.Count; s++) styles.Append(s > 0 ? ", " : "").Append(I(styleList[s]));
            styles.Append(" }");
            sb.Append("        public static readonly int[] RingCheckBotStyles = " + styles + ";" + nl);
            sb.Append("        // round:tick:hash" + nl);
            sb.Append("        public static readonly string[] RingCheckHashes = " + LitArray(hashes) + ";" + nl + nl);

            hashes = new List<string>();
            foreach (object cp in InkJson.Arr(InkJson.Get(solo, "checkpoints")))
                hashes.Add(I(InkJson.Get(cp, "fight")) + ":" + I(InkJson.Get(cp, "tick")) + ":" + InkJson.Str(InkJson.Get(cp, "hash")));
            List<string> enemies = new List<string>();
            List<string> upgrades = new List<string>();
            StringBuilder stakes = new StringBuilder("new int[] { ");
            List<object> waves = InkJson.Arr(InkJson.Get(solo, "waves"));
            for (int w = 0; w < waves.Count; w++)
            {
                enemies.Add(InkJson.Str(InkJson.Get(waves[w], "enemy")));
                upgrades.Add(InkJson.Get(waves[w], "upgrade") as string);
                stakes.Append(w > 0 ? ", " : "").Append(I(InkJson.Get(waves[w], "stake")));
            }
            stakes.Append(" }");
            if (I(InkJson.Get(solo, "startColour")) != "0") throw new InvalidOperationException("solo self check expects startColour 0");
            sb.Append("        public const string SoloCheckName = " + Lit(InkJson.Str(InkJson.Get(solo, "name"))) + ";" + nl);
            sb.Append("        public const uint SoloCheckSeed = " + I(InkJson.Get(solo, "seed")) + "u;" + nl);
            sb.Append("        public const string SoloCheckHero = " + Lit(InkJson.Str(InkJson.Get(solo, "hero"))) + ";" + nl);
            sb.Append("        public const string SoloCheckWeapon = " + Lit(InkJson.Str(InkJson.Get(solo, "weapon"))) + ";" + nl);
            sb.Append("        public const int SoloCheckStyle = " + (InkJson.Str(InkJson.Get(solo, "heroBot")) == "brawl" ? "1" : "0") + ";" + nl);
            sb.Append("        public const bool SoloCheckBoss = " + ((bool)InkJson.Get(solo, "boss") ? "true" : "false") + ";" + nl);
            sb.Append("        public static readonly string[] SoloCheckEnemies = " + LitArray(enemies) + ";" + nl);
            sb.Append("        public static readonly int[] SoloCheckStakes = " + stakes + ";" + nl);
            sb.Append("        public static readonly string[] SoloCheckUpgrades = " + LitArray(upgrades) + ";" + nl);
            sb.Append("        // fight:tick:hash" + nl);
            sb.Append("        public static readonly string[] SoloCheckHashes = " + LitArray(hashes) + ";" + nl);
            sb.Append("    }" + nl + "}" + nl);
            return sb.ToString();
        }

        private static string I(object number)
        {
            return ((long)InkJson.Num(number)).ToString(CultureInfo.InvariantCulture);
        }
    }
}
