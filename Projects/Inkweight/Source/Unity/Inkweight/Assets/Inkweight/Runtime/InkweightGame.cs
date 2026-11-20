// Inkweight prototype: the whole presentation layer in one component.
// Menu, drawing screen, Ring against bots and the solo arena. All rules and
// all numbers come from the engine-free core (Inkweight.Core); this file only
// reads input, calls the core's step functions at the fixed tick rate and
// shows the result. The HUD is immediate-mode GUI on purpose (prototype, to be
// replaced). Player-facing text is German.
using System.Collections.Generic;
using System.Globalization;
using Inkweight.Core;
using UnityEngine;

namespace Inkweight.Runtime
{
    public sealed class InkweightGame : MonoBehaviour
    {
        private enum View { Menu, Draw, RingFight, RingRoundOver, SoloFight, SoloShop, SoloEnd }

        private enum Purpose { RingFigure, SoloHero, SoloWeapon, SoloEnemy, SoloUpgradeHero, SoloUpgradeWeapon }

        // question that is open on the drawing screen before ink is thrown away
        private enum Ask { None, Clear, Preset, Menu, CancelUpgrade }

        private const float VirtualHeight = 720f;
        private const int MaxStepsPerFrame = 6;
        private const float StickRadius = 70f;
        private const int NoPointer = int.MinValue;

        private static readonly string[] ColourNames = { "Radierer", "Schwarz", "Glut", "Flut", "Moos" };
        private static readonly string[] BotStyleNames = { "Stürmer", "Kreisler" };

        private InkTuning tuning;
        private InkSelfCheckResult selfCheck;
        private string fatal;

        private InkInputReader input;
        private InkCanvasEditor editor;
        private InkArenaView arena;
        private Texture2D white;

        private View view = View.Menu;
        private Purpose purpose;
        private float guiScale = 1f;
        private float accumulator;
        private string message = "";
        private int presetIndex = -1;
        private uint seed;
        private InkRng pickRng;

        // touch / mouse steering
        private int stickPointer = NoPointer;
        private Vector2 stickOrigin;
        private Vector2 stickValue;
        private bool pointerDash;

        // ring
        private InkRingMatch match;
        private int seats;
        private int[] ringCells;
        private int[][] botCells;
        private readonly InkInput?[] ringHuman = new InkInput?[4];

        // drawing screen: open question, Ring drawing clock, last valid drawing
        private Ask ask = Ask.None;
        private int beginRevision;
        private float drawClock;
        private bool clockRunning;
        private int seenRevision;
        private int[] lastValidCells;

        // preview of the enemy drawing for the stake display (rebuilt when the drawing changes)
        private InkFigure previewFigure;
        private int previewRevision = -1;

        // short note over the fight ("Rammstoß!", "Zeit abgelaufen")
        private string fightNote = "";
        private int fightNoteTicks;
        private int ramCount;

        // solo
        private InkSoloRun run;
        private int startColour;
        private int[] heroCells, weaponCells, enemyCells;
        private int stakeIndex;

        // short red flash of a body that was hit and yellow flash of a body
        // that rammed, in ticks, by body index
        private readonly List<int> flash = new List<int>();
        private readonly List<int> ram = new List<int>();

        private GUIStyle labelStyle, smallStyle, titleStyle, buttonStyle, centreStyle;

        // ------------------------------------------------------------ lifecycle

        private void Awake()
        {
            input = new InkInputReader();
            try
            {
                tuning = InkTuning.FromJson(InkGenerated.TuningJson);
                selfCheck = InkSelfCheck.Run(tuning);
                if (selfCheck.Ok) Debug.Log("Inkweight: " + selfCheck.Message);
                else Debug.LogError("Inkweight: core self check FAILED: " + selfCheck.Message);
                editor = new InkCanvasEditor(tuning);
                arena = new InkArenaView(transform);
                white = new Texture2D(1, 1, TextureFormat.RGBA32, false);
                white.SetPixel(0, 0, new Color(1f, 1f, 1f, 1f));
                white.Apply(false);
                seed = unchecked((uint)System.DateTime.UtcNow.Ticks);
                pickRng = InkRng.Create(seed);
            }
            catch (System.Exception e)
            {
                fatal = e.ToString();
                Debug.LogError("Inkweight: start failed: " + fatal);
            }
        }

        private void OnApplicationFocus(bool hasFocus)
        {
            if (!hasFocus && input != null) input.Clear();
        }

        private void Update()
        {
            if (fatal != null || tuning == null) return;
            guiScale = Screen.height / VirtualHeight;
            if (guiScale < 0.1f) guiScale = 0.1f;
            input.Poll(guiScale);
            if (input.EscapePressed && view != View.Menu)
            {
                if (ask != Ask.None) ask = Ask.None; // Escape answers the open question with "no"
                else RequestMenu();
                return;
            }
            try
            {
                if (view == View.Draw) UpdateDrawClock();
                else if (view == View.RingFight) UpdateRing();
                else if (view == View.SoloFight) UpdateSolo();
                if (view == View.RingFight || view == View.RingRoundOver) RenderRing();
                else if (view == View.SoloFight || view == View.SoloEnd) RenderSolo();
            }
            catch (System.Exception e)
            {
                fatal = e.ToString();
                Debug.LogError("Inkweight: " + fatal);
            }
        }

        // Leave to the menu; on the drawing screen ask once before ink is lost.
        private void RequestMenu()
        {
            if (view == View.Draw && editor.Stats.Filled > 0) ask = Ask.Menu;
            else GoMenu();
        }

        private void GoMenu()
        {
            ask = Ask.None;
            view = View.Menu;
            match = null;
            run = null;
            message = "";
            arena.SetVisible(false);
            arena.ClearFigures();
        }

        private float TickSeconds() { return (float)(1.0 / tuning.TickRate); }

        // ------------------------------------------------------------ steering

        private InkInput ReadSteering()
        {
            float vw = Screen.width / guiScale;
            bool stickAlive = false;
            pointerDash = false;
            List<InkPointer> ps = input.Pointers;
            for (int i = 0; i < ps.Count; i++)
            {
                InkPointer p = ps[i];
                if (p.Id == stickPointer)
                {
                    stickAlive = true;
                    stickValue = new Vector2((p.Pos.x - stickOrigin.x) / StickRadius, (p.Pos.y - stickOrigin.y) / StickRadius);
                }
                else if (p.Pos.y > 90f && p.Pos.x >= vw * 0.5f)
                {
                    pointerDash = true;
                }
            }
            if (!stickAlive)
            {
                stickPointer = NoPointer;
                stickValue = new Vector2(0f, 0f);
                for (int i = 0; i < ps.Count; i++)
                {
                    InkPointer p = ps[i];
                    if (p.Pos.y > 90f && p.Pos.x < vw * 0.5f)
                    {
                        stickPointer = p.Id;
                        stickOrigin = p.Pos;
                        break;
                    }
                }
            }
            float x = input.Move.x + stickValue.x;
            float y = input.Move.y + stickValue.y;
            // the core clamps a stick longer than 1 itself
            return new InkInput(x, y, input.Dash || pointerDash);
        }

        private void NoteEvents(List<InkEvent> events, int bodyCount)
        {
            while (flash.Count < bodyCount) flash.Add(0);
            while (ram.Count < bodyCount) ram.Add(0);
            for (int i = 0; i < flash.Count; i++) if (flash[i] > 0) flash[i]--;
            for (int i = 0; i < ram.Count; i++) if (ram[i] > 0) ram[i]--;
            if (fightNoteTicks > 0) fightNoteTicks--;
            for (int i = 0; i < events.Count; i++)
            {
                InkEvent e = events[i];
                if ((e.Type == InkEvent.Hit || e.Type == InkEvent.ShotHit) && e.To >= 0 && e.To < flash.Count) flash[e.To] = 8;
                else if (e.Type == InkEvent.Ram)
                {
                    // a dash that touched another figure: the dash ends there
                    ramCount++;
                    if (e.From >= 0 && e.From < ram.Count) ram[e.From] = 12;
                    if (e.From == 0) { fightNote = "Rammstoß!"; fightNoteTicks = 45; }
                    else if (e.To == 0) { fightNote = "Gerammt!"; fightNoteTicks = 45; }
                }
            }
        }

        // 0 none, 1 hit, 2 rammed (for InkArenaView.DrawBody)
        private int BodyMark(int i)
        {
            if (i < flash.Count && flash[i] > 0) return 1;
            if (i < ram.Count && ram[i] > 0) return 2;
            return 0;
        }

        private void ResetFight()
        {
            accumulator = 0f;
            flash.Clear();
            ram.Clear();
            stickPointer = NoPointer;
            stickValue = new Vector2(0f, 0f);
        }

        // ------------------------------------------------------------ ring

        private int[] PickBotDrawing()
        {
            int count = InkGenerated.PresetNames.Length;
            for (int tries = 0; tries < 40 && count > 0; tries++)
            {
                int[] cells = PresetCells(pickRng.Int(count));
                if (InkDrawing.ComputeStats(cells, editor.W, editor.H, tuning, InkDrawing.KindFigure, null).Valid) return cells;
            }
            for (int i = 0; i < count; i++)
            {
                int[] cells = PresetCells(i);
                if (InkDrawing.ComputeStats(cells, editor.W, editor.H, tuning, InkDrawing.KindFigure, null).Valid) return cells;
            }
            return null;
        }

        private static int[] PresetCells(int index)
        {
            int w, h;
            return InkDrawing.Parse(InkGenerated.PresetRows[index], out w, out h);
        }

        private void StartRing(int seatCount)
        {
            seats = seatCount;
            seed = pickRng.U32();
            match = InkRing.CreateMatch(tuning, seats, seed);
            botCells = new int[seats][];
            // bot styles are mixed: rushers and circlers alternate from a random start
            int firstStyle = pickRng.Int(2);
            for (int s = 1; s < seats; s++)
            {
                botCells[s] = PickBotDrawing();
                match.BotStyle[s] = (firstStyle + s) % 2;
            }
            fightNote = "";
            fightNoteTicks = 0;
            BeginRingDraw();
        }

        private void BeginRingDraw()
        {
            purpose = Purpose.RingFigure;
            BeginEdit(ringCells, InkRing.InkBudget(tuning, match, 0), InkDrawing.KindFigure, null);
            message = "";
            arena.SetVisible(false);
            view = View.Draw;
            // the drawing clock starts with the first change of the drawing
            drawClock = (float)tuning.DrawTimeSeconds;
            clockRunning = false;
            seenRevision = editor.Revision;
            lastValidCells = editor.Stats.Valid ? editor.CopyCells() : null;
        }

        // Every drawing screen starts here, so that an open question never
        // survives into the next drawing.
        private void BeginEdit(int[] cells, double budget, string kind, bool[] allowed)
        {
            ask = Ask.None;
            editor.Begin(cells, budget, kind, allowed);
            beginRevision = editor.Revision;
        }

        // The Ring drawing clock (ring.drawTimeSeconds; 0 switches it off). It
        // runs in real time from the first change of the drawing. When it
        // runs out the round starts with the drawing as it is; if that is not
        // valid, with the last valid state of it, else with an example.
        private void UpdateDrawClock()
        {
            if (purpose != Purpose.RingFigure || match == null || tuning.DrawTimeSeconds <= 0) return;
            if (editor.Revision != seenRevision)
            {
                seenRevision = editor.Revision;
                clockRunning = true;
                if (editor.Stats.Valid) lastValidCells = editor.CopyCells();
            }
            if (!clockRunning) return;
            drawClock -= Time.unscaledDeltaTime;
            if (drawClock > 0f) return;
            drawClock = 0f;
            clockRunning = false;
            double budget = InkRing.InkBudget(tuning, match, 0);
            string note = "Zeit abgelaufen!";
            if (!editor.Stats.Valid)
            {
                int[] cells = lastValidCells != null ? lastValidCells : PickBotDrawing();
                note = lastValidCells != null
                    ? "Zeit abgelaufen – deine letzte gültige Zeichnung tritt an."
                    : "Zeit abgelaufen – eine Beispielfigur tritt für dich an.";
                BeginEdit(cells, budget, InkDrawing.KindFigure, null);
            }
            ask = Ask.None;
            StartRingRound();
            if (view == View.RingFight) { fightNote = note; fightNoteTicks = 150; }
        }

        private void StartRingRound()
        {
            int[] mine = editor.CopyCells();
            InkFigure[] figures = new InkFigure[seats];
            figures[0] = InkPhysics.BuildFigure(mine, editor.W, editor.H, tuning, InkDrawing.KindFigure, InkRing.InkBudget(tuning, match, 0));
            // the core refuses a round with an invalid figure; ask it first
            string why = InkRing.CheckFigure(tuning, match, 0, figures[0]);
            if (why != InkRing.CheckOk) { message = ReasonText(why); return; }
            for (int s = 1; s < seats; s++)
            {
                double budget = InkRing.InkBudget(tuning, match, s);
                int[] cells = botCells[s] != null ? botCells[s] : mine;
                figures[s] = InkPhysics.BuildFigure(cells, editor.W, editor.H, tuning, InkDrawing.KindFigure, budget);
                if (InkRing.CheckFigure(tuning, match, s, figures[s]) != InkRing.CheckOk)
                {
                    // a bot drawing that does not pass is replaced by the player's own (which passed)
                    botCells[s] = null;
                    figures[s] = InkPhysics.BuildFigure(mine, editor.W, editor.H, tuning, InkDrawing.KindFigure, budget);
                }
            }
            try
            {
                InkRing.StartRound(tuning, match, figures);
            }
            catch (System.Exception e)
            {
                message = "Die Runde kann nicht starten: " + e.Message;
                return;
            }
            ringCells = mine;
            arena.ClearFigures();
            ResetFight();
            arena.Frame(tuning.RingStartRadius[seats]);
            arena.SetVisible(true);
            view = View.RingFight;
        }

        private void UpdateRing()
        {
            InkInput human = ReadSteering();
            float tick = TickSeconds();
            accumulator += Time.unscaledDeltaTime;
            int steps = 0;
            while (accumulator >= tick && steps < MaxStepsPerFrame && match.Phase == InkRing.PhaseFight)
            {
                for (int s = 0; s < ringHuman.Length; s++) ringHuman[s] = null;
                ringHuman[0] = human;
                InkRing.Step(tuning, match, InkBots.RingBotInputs(tuning, match, ringHuman));
                NoteEvents(match.World.Events, match.World.Bodies.Count);
                accumulator -= tick;
                steps++;
            }
            if (steps == MaxStepsPerFrame) accumulator = 0f; // too slow: drop the backlog instead of spiralling
            if (match.Phase != InkRing.PhaseFight) view = View.RingRoundOver;
        }

        private void RenderRing()
        {
            if (match == null || match.World == null) return;
            arena.Frame(tuning.RingStartRadius[seats]);
            arena.BeginFrame(match.RingRadius);
            List<InkBody> bodies = match.World.Bodies;
            for (int i = 0; i < bodies.Count; i++)
                arena.DrawBody(bodies[i], i == 0, BodyMark(i), i);
            arena.EndFrame();
        }

        // ------------------------------------------------------------ solo

        private bool[] SoloColours()
        {
            if (run != null) return run.Colours;
            return new bool[] { false, true, startColour == 2, startColour == 3, startColour == 4 };
        }

        private void StartSolo(int colour)
        {
            startColour = colour;
            run = null;
            seed = pickRng.U32();
            purpose = Purpose.SoloHero;
            BeginEdit(heroCells, tuning.FigureBudget, InkDrawing.KindFigure, SoloColours());
            message = "";
            fightNote = "";
            fightNoteTicks = 0;
            arena.SetVisible(false);
            view = View.Draw;
        }

        private void BeginEnemyDraw()
        {
            purpose = Purpose.SoloEnemy;
            stakeIndex = 0;
            BeginEdit(enemyCells, tuning.EnemyInkBudget, InkDrawing.KindFigure, null);
            arena.SetVisible(false);
            view = View.Draw;
        }

        private void BeginSoloFight()
        {
            ResetFight();
            arena.Frame(tuning.ArenaRadius);
            arena.SetVisible(true);
            view = View.SoloFight;
        }

        private void FinishSoloDrawing()
        {
            message = "";
            if (purpose == Purpose.SoloHero)
            {
                heroCells = editor.CopyCells();
                purpose = Purpose.SoloWeapon;
                BeginEdit(weaponCells, tuning.WeaponBudget, InkDrawing.KindWeapon, SoloColours());
            }
            else if (purpose == Purpose.SoloWeapon)
            {
                weaponCells = editor.CopyCells();
                try
                {
                    run = InkSolo.CreateRun(tuning, seed, heroCells, weaponCells, editor.W, editor.H, startColour);
                }
                catch (System.Exception e)
                {
                    run = null;
                    message = "Zeichnung ungültig: " + e.Message;
                    return;
                }
                BeginEnemyDraw();
            }
            else if (purpose == Purpose.SoloEnemy)
            {
                enemyCells = editor.CopyCells();
                arena.ClearFigures();
                try
                {
                    InkSolo.StartWave(tuning, run, enemyCells, stakeIndex);
                }
                catch (System.Exception e)
                {
                    message = "Zeichnung ungültig: " + e.Message;
                    return;
                }
                BeginSoloFight();
            }
            else if (purpose == Purpose.SoloUpgradeHero || purpose == Purpose.SoloUpgradeWeapon)
            {
                bool hero = purpose == Purpose.SoloUpgradeHero;
                int[] cells = editor.CopyCells();
                string result = InkSolo.Upgrade(tuning, run, hero ? InkSolo.UpgradeHeroInk : InkSolo.UpgradeWeaponInk, cells, 0);
                if (result == "")
                {
                    if (hero) heroCells = cells; else weaponCells = cells;
                    message = "Upgrade gekauft.";
                }
                else message = ReasonText(result);
                view = View.SoloShop;
            }
        }

        private void UpdateSolo()
        {
            InkInput human = ReadSteering();
            float tick = TickSeconds();
            accumulator += Time.unscaledDeltaTime;
            int steps = 0;
            while (accumulator >= tick && steps < MaxStepsPerFrame && run.Phase == InkSolo.PhaseFight)
            {
                InkSolo.Step(tuning, run, human);
                NoteEvents(run.Events, run.World.Bodies.Count);
                accumulator -= tick;
                steps++;
            }
            if (steps == MaxStepsPerFrame) accumulator = 0f;
            if (run.Phase == InkSolo.PhaseCleared) { message = ""; arena.SetVisible(false); view = View.SoloShop; }
            else if (run.Phase != InkSolo.PhaseFight) view = View.SoloEnd;
        }

        private void RenderSolo()
        {
            if (run == null || run.World == null) return;
            arena.Frame(tuning.ArenaRadius);
            arena.BeginFrame(tuning.ArenaRadius);
            for (int i = 0; i < run.Drops.Count; i++) arena.DrawDrop(run.Drops[i]);
            List<InkBody> bodies = run.World.Bodies;
            for (int i = bodies.Count - 1; i >= 0; i--)
                arena.DrawBody(bodies[i], i == 0, BodyMark(i), i == 0 ? 10 : 0);
            for (int i = 0; i < run.Shots.Count; i++) arena.DrawShot(run.Shots[i], run.WeaponFig);
            arena.EndFrame();
        }

        // ------------------------------------------------------------ text helpers

        private static string F(double v) { return v.ToString("0.0", CultureInfo.InvariantCulture); }

        private static string F2(double v) { return v.ToString("0.00", CultureInfo.InvariantCulture); }

        private static string Mult(double v) { return "x" + v.ToString("0.##", CultureInfo.InvariantCulture); }

        private static string I(double v) { return v.ToString("0", CultureInfo.InvariantCulture); }

        private string ElementName(int element)
        {
            if (element < 2 || element > 4) return "Neutral";
            int beaten = (int)tuning.Beats[element];
            string text = ColourNames[element];
            if (beaten >= 2 && beaten <= 4) text += " (schlägt " + ColourNames[beaten] + ")";
            return text;
        }

        private static string ReasonText(string reason)
        {
            if (reason == "tooSmall") return "Zu klein.";
            if (reason == "overBudget") return "Zu viel Tinte.";
            if (reason == "colourLocked") return "Diese Farbe ist noch nicht freigeschaltet.";
            if (reason == "tooExpensive") return "Nicht genug Tinte im Beutel.";
            if (reason == "alreadyTaken") return "In dieser Pause wurde schon ein Upgrade gekauft.";
            if (reason == "badColour") return "Diese Farbe gibt es schon.";
            if (reason == "notNow") return "Jetzt nicht möglich.";
            if (reason == "bad stake index") return "Diesen Einsatz gibt es nicht.";
            return reason;
        }

        private string SeatName(int seat) { return seat == 0 ? "Du" : "Bot " + seat; }

        private string BotStyleName(int seat)
        {
            if (match == null || seat <= 0 || seat >= match.BotStyle.Length) return "";
            int style = match.BotStyle[seat];
            return style >= 0 && style < BotStyleNames.Length ? BotStyleNames[style] : "";
        }

        private void FightNote(float vw)
        {
            if (fightNoteTicks > 0 && fightNote != "") GUI.Label(new Rect(vw * 0.5f - 300f, 84f, 600f, 40f), fightNote, centreStyle);
        }

        // ------------------------------------------------------------ GUI

        private void EnsureStyles()
        {
            if (labelStyle != null) return;
            labelStyle = new GUIStyle(GUI.skin.label);
            labelStyle.fontSize = 18;
            labelStyle.wordWrap = true;
            labelStyle.normal.textColor = new Color(0.95f, 0.95f, 0.92f, 1f);
            smallStyle = new GUIStyle(labelStyle);
            smallStyle.fontSize = 14;
            titleStyle = new GUIStyle(labelStyle);
            titleStyle.fontSize = 32;
            titleStyle.fontStyle = FontStyle.Bold;
            centreStyle = new GUIStyle(labelStyle);
            centreStyle.fontSize = 26;
            centreStyle.alignment = TextAnchor.MiddleCenter;
            buttonStyle = new GUIStyle(GUI.skin.button);
            buttonStyle.fontSize = 18;
            buttonStyle.wordWrap = true;
        }

        private void Bar(Rect r, float fraction, Color colour)
        {
            if (fraction < 0f) fraction = 0f;
            if (fraction > 1f) fraction = 1f;
            Color old = GUI.color;
            GUI.color = new Color(0f, 0f, 0f, 0.55f);
            GUI.DrawTexture(r, white);
            GUI.color = colour;
            GUI.DrawTexture(new Rect(r.x + 1f, r.y + 1f, (r.width - 2f) * fraction, r.height - 2f), white);
            GUI.color = old;
        }

        private void OnGUI()
        {
            EnsureStyles();
            Matrix4x4 oldMatrix = GUI.matrix;
            float s = Screen.height / VirtualHeight;
            if (s < 0.1f) s = 0.1f;
            // The whole GUI is laid out for a screen 720 units high and scaled.
            GUI.matrix = Matrix4x4.TRS(new Vector3(0f, 0f, 0f), Quaternion.identity, new Vector3(s, s, 1f));
            // Read the event only now: Event.mousePosition is reported in the
            // coordinate system of the current GUI matrix (virtual units).
            if (input != null) input.OnGuiEvent(Event.current);
            float vw = Screen.width / s;
            float vh = VirtualHeight;
            try
            {
                if (fatal != null)
                {
                    GUI.Label(new Rect(20f, 20f, vw - 40f, vh - 40f),
                        "Inkweight konnte nicht starten. Bitte diesen Text melden:\n\n" + fatal, labelStyle);
                }
                else if (tuning != null)
                {
                    if (view == View.Menu) MenuGui(vw, vh);
                    else if (view == View.Draw) DrawGui(vw, vh);
                    else if (view == View.RingFight || view == View.RingRoundOver) RingGui(vw, vh);
                    else if (view == View.SoloFight || view == View.SoloEnd) SoloGui(vw, vh);
                    else if (view == View.SoloShop) ShopGui(vw, vh);
                    if (view != View.Menu && GUI.Button(new Rect(vw - 130f, 10f, 120f, 40f), "Menü", buttonStyle)) RequestMenu();
                }
            }
            catch (System.Exception e)
            {
                fatal = e.ToString();
                Debug.LogError("Inkweight: " + fatal);
            }
            GUI.enabled = true;
            GUI.matrix = oldMatrix;
        }

        private void MenuGui(float vw, float vh)
        {
            float x = 60f;
            GUI.Label(new Rect(x, 40f, vw - 2f * x, 50f), "Inkweight – Prototyp", titleStyle);
            GUI.Label(new Rect(x, 95f, vw - 2f * x, 60f),
                "Menge ist Gewicht, gefüllte Flächen sind Panzerung, Striche von einem Feld Breite sind Klingen, Farbe ist das Element.", labelStyle);

            GUI.Label(new Rect(x, 170f, 500f, 30f), "Ring gegen Bots", labelStyle);
            if (GUI.Button(new Rect(x, 205f, 160f, 60f), "2 Figuren", buttonStyle)) StartRing(2);
            if (GUI.Button(new Rect(x + 175f, 205f, 160f, 60f), "3 Figuren", buttonStyle)) StartRing(3);
            if (GUI.Button(new Rect(x + 350f, 205f, 160f, 60f), "4 Figuren", buttonStyle)) StartRing(4);

            GUI.Label(new Rect(x, 295f, 700f, 30f), "Solo-Arena – wähle deine Startfarbe neben Schwarz", labelStyle);
            if (GUI.Button(new Rect(x, 330f, 160f, 60f), "Glut (Rot)", buttonStyle)) StartSolo(InkDrawing.ColourEmber);
            if (GUI.Button(new Rect(x + 175f, 330f, 160f, 60f), "Flut (Blau)", buttonStyle)) StartSolo(InkDrawing.ColourTide);
            if (GUI.Button(new Rect(x + 350f, 330f, 160f, 60f), "Moos (Grün)", buttonStyle)) StartSolo(InkDrawing.ColourMoss);

            GUI.Label(new Rect(x, 430f, vw - 2f * x, 90f),
                "Steuerung: WASD oder Pfeiltasten oder Stick, Sprint mit Leertaste oder A-Taste. "
                + "Touch: linke Bildschirmhälfte steuert, rechte Hälfte sprintet. Zeichnen: linke Maustaste oder Finger, rechte Maustaste radiert. Esc: Menü.",
                smallStyle);

            if (selfCheck != null)
            {
                Color old = GUI.color;
                if (!selfCheck.Ok) GUI.color = new Color(1f, 0.4f, 0.4f, 1f);
                GUI.Label(new Rect(x, vh - 110f, vw - 2f * x, 90f),
                    selfCheck.Ok
                        ? "Kern-Selbsttest bestanden (" + selfCheck.Compared + " Prüfpunkte bitgenau). Regeln: " + tuning.Version
                        : "Kern-Selbsttest FEHLGESCHLAGEN – die Simulation weicht auf diesem Gerät von der Referenz ab. Bitte melden: " + selfCheck.Message,
                    smallStyle);
                GUI.color = old;
            }
        }

        private string PurposeTitle()
        {
            if (purpose == Purpose.RingFigure)
            {
                string clock = "";
                if (tuning.DrawTimeSeconds > 0)
                {
                    // whole seconds, rounded up
                    int left = (int)drawClock;
                    if (left < drawClock) left++;
                    clock = clockRunning ? "  –  noch " + left + " s" : "  –  " + left + " s ab dem ersten Strich";
                }
                return "Runde " + (match.Round + 1) + ": Zeichne deine Figur (oben ist vorne)" + clock;
            }
            if (purpose == Purpose.SoloHero) return "Zeichne deinen Helden (oben ist vorne)";
            if (purpose == Purpose.SoloWeapon) return "Zeichne deine Wurfwaffe";
            if (purpose == Purpose.SoloEnemy) return run.Wave < InkSolo.Waves ? "Welle " + (run.Wave + 1) + " von " + InkSolo.Waves + ": Zeichne den Gegner" : "Zeichne den Gegner";
            if (purpose == Purpose.SoloUpgradeHero) return "Mehr Tinte: Zeichne deinen Helden neu";
            return "Mehr Tinte: Zeichne deine Waffe neu";
        }

        private bool DrawingValid(out string why)
        {
            InkStats st = editor.Stats;
            why = "";
            if (!st.BigEnough)
            {
                double min = editor.Kind == InkDrawing.KindWeapon ? tuning.WeaponMinBodyCells : tuning.MinBodyCells;
                why = "Noch zu klein: der Körper braucht mindestens " + I(min) + " zusammenhängende Felder.";
                return false;
            }
            if (!st.WithinBudget) { why = "Zu viel Tinte."; return false; }
            return true;
        }

        private void LoadNextPreset()
        {
            int count = InkGenerated.PresetNames.Length;
            for (int tries = 0; tries < count; tries++)
            {
                presetIndex = (presetIndex + 1) % count;
                int[] cells = PresetCells(presetIndex);
                int filled = 0;
                for (int i = 0; i < cells.Length; i++)
                {
                    if (cells[i] != 0 && !editor.Allowed[cells[i]]) cells[i] = 1;
                    if (cells[i] != 0) filled++;
                }
                if (filled > editor.Budget) continue;
                int started = beginRevision;
                BeginEdit(cells, editor.Budget, editor.Kind, editor.Allowed);
                beginRevision = started; // an example counts as a change of this drawing
                return;
            }
        }

        // Stat bar ends for the drawing screen (rules version 2, CHANGES_V2.md
        // C2), all taken from the tuning: armour from armourBase to 300 at 220
        // ink (more with catch-up ink), sharpness from sharpBase to the value
        // of a pure line of the minimum size (4.7), speed between a drawing of
        // the full budget and one of the minimum size.
        private float ArmourFraction(InkStats st)
        {
            double scale = editor.Budget > tuning.FigureBudget ? editor.Budget / tuning.FigureBudget : 1;
            double end = 300 * scale;
            return st.N > 0 && end > tuning.ArmourBase ? (float)((st.Armour - tuning.ArmourBase) / (end - tuning.ArmourBase)) : 0f;
        }

        private float SharpFraction(InkStats st)
        {
            double span = tuning.SharpMax + tuning.SharpPurity / (1 + tuning.MinBodyCells / tuning.SharpPurityWeightRef);
            return st.N > 0 && span > 0 ? (float)((st.Sharpness - tuning.SharpBase) / span) : 0f;
        }

        private float SpeedFraction(InkStats st)
        {
            double lo = tuning.SpeedBase / (1 + editor.Budget / tuning.SpeedWeightRef);
            double hi = tuning.SpeedBase / (1 + tuning.MinBodyCells / tuning.SpeedWeightRef);
            return st.N > 0 && hi > lo ? (float)((st.TopSpeed - lo) / (hi - lo)) : 0f;
        }

        // One stat: value text, bar and the one-line explanation. Returns the next y.
        private float StatRow(float px, float y, float pw, string text, float fraction, Color colour, string explain)
        {
            GUI.Label(new Rect(px, y, pw, 24f), text, labelStyle);
            Bar(new Rect(px, y + 25f, pw, 10f), fraction, colour);
            GUI.Label(new Rect(px, y + 36f, pw, 20f), explain, smallStyle);
            return y + 58f;
        }

        private InkFigure PreviewFigure()
        {
            if (previewFigure == null || previewRevision != editor.Revision)
            {
                previewFigure = InkPhysics.BuildFigure(editor.Cells, editor.W, editor.H, tuning, editor.Kind, editor.Budget);
                previewRevision = editor.Revision;
            }
            return previewFigure;
        }

        private string AskText()
        {
            if (ask == Ask.Clear) return "Die ganze Zeichnung löschen?";
            if (ask == Ask.Preset) return "Die Zeichnung durch ein Beispiel ersetzen?";
            if (ask == Ask.CancelUpgrade) return "Abbrechen? Die neue Zeichnung geht verloren.";
            return "Zurück zum Menü? Die Zeichnung geht verloren.";
        }

        // The open question. Nothing else on the drawing screen reacts while it is shown.
        private void AskGui(float vw, float vh)
        {
            GUI.Box(new Rect(vw * 0.5f - 280f, vh * 0.5f - 110f, 560f, 220f), "");
            GUI.Label(new Rect(vw * 0.5f - 260f, vh * 0.5f - 100f, 520f, 110f), AskText(), centreStyle);
            if (GUI.Button(new Rect(vw * 0.5f - 250f, vh * 0.5f + 30f, 240f, 60f), "Ja, verwerfen", buttonStyle))
            {
                Ask what = ask;
                ask = Ask.None;
                if (what == Ask.Clear) editor.ClearAll();
                else if (what == Ask.Preset) LoadNextPreset();
                else if (what == Ask.CancelUpgrade) { message = ""; view = View.SoloShop; }
                else GoMenu();
                return;
            }
            if (GUI.Button(new Rect(vw * 0.5f + 10f, vh * 0.5f + 30f, 240f, 60f), "Nein, weiterzeichnen", buttonStyle)) ask = Ask.None;
        }

        private void DrawGui(float vw, float vh)
        {
            GUI.Label(new Rect(20f, 12f, vw - 180f, 40f), PurposeTitle(), centreStyle);

            float size = vh - 110f;
            if (size > vw * 0.55f) size = vw * 0.55f;
            Rect canvas = new Rect(20f, 70f, size, size);

            if (ask != Ask.None)
            {
                // only the canvas and the question: no painting, no other button
                editor.EndStroke();
                GUI.DrawTexture(canvas, editor.Texture);
                AskGui(vw, vh);
                return;
            }

            // painting
            Event e = Event.current;
            if (e.type == EventType.MouseDown || e.type == EventType.MouseDrag)
            {
                if (canvas.Contains(e.mousePosition) && (e.button == 0 || e.button == 1))
                {
                    int cx = (int)((e.mousePosition.x - canvas.x) / canvas.width * editor.W);
                    int cy = (int)((e.mousePosition.y - canvas.y) / canvas.height * editor.H);
                    if (e.type == EventType.MouseDown) editor.EndStroke();
                    editor.StrokeTo(cx, cy, e.button == 1 ? 0 : editor.Tool);
                    e.Use();
                }
                else editor.EndStroke();
            }
            else if (e.type == EventType.MouseUp) editor.EndStroke();

            GUI.DrawTexture(canvas, editor.Texture);

            float px = canvas.x + canvas.width + 20f;
            float pw = vw - px - 20f;
            if (pw < 200f) pw = 200f;
            float y = 70f;

            // tools
            float bw = (pw - 4f * 6f) / 5f;
            for (int c = 1; c <= 5; c++)
            {
                int tool = c == 5 ? 0 : c;
                bool allowed = tool == 0 || editor.Allowed[tool];
                GUI.enabled = allowed;
                Color old = GUI.color;
                if (tool != 0 && allowed)
                {
                    Color32 ink = InkCanvasEditor.Ink[tool];
                    GUI.color = new Color(0.45f + ink.r / 255f * 0.55f, 0.45f + ink.g / 255f * 0.55f, 0.45f + ink.b / 255f * 0.55f, 1f);
                }
                string text = (editor.Tool == tool ? "[" + ColourNames[tool] + "]" : ColourNames[tool]);
                if (GUI.Button(new Rect(px + (c - 1) * (bw + 6f), y, bw, 46f), text, buttonStyle)) editor.Tool = tool;
                GUI.color = old;
                GUI.enabled = true;
            }
            y += 52f;
            InkStats st = editor.Stats;
            // "Leeren" and "Beispiel laden" throw the drawing away: ask once when there is ink
            if (GUI.Button(new Rect(px, y, pw * 0.5f - 3f, 38f), "Leeren", buttonStyle))
            {
                if (st.Filled > 0) { ask = Ask.Clear; return; }
                editor.ClearAll();
            }
            if (GUI.Button(new Rect(px + pw * 0.5f + 3f, y, pw * 0.5f - 3f, 38f), "Beispiel laden", buttonStyle))
            {
                if (st.Filled > 0) { ask = Ask.Preset; return; }
                LoadNextPreset();
            }
            y += 44f;

            // ink meter and stats
            st = editor.Stats;
            float frac = editor.Budget > 0 ? (float)(st.Filled / editor.Budget) : 0f;
            Bar(new Rect(px, y, pw, 18f), frac, editor.InkEmptyFlash ? new Color(1f, 0.3f, 0.3f, 1f) : new Color(0.25f, 0.3f, 0.5f, 1f));
            y += 20f;
            GUI.Label(new Rect(px, y, pw, 24f), "Tinte: " + st.Filled + " von " + I(editor.Budget)
                + (editor.InkEmptyFlash ? "  –  Tinte leer!" : "")
                + (st.Drips > 0 ? "   (" + st.Drips + " Felder tropfen ab und zählen nicht)" : ""), smallStyle);
            y += 24f;
            Color barColour = new Color(0.85f, 0.75f, 0.35f, 1f);
            y = StatRow(px, y, pw,
                "Gewicht: " + st.N + (st.Push > st.N ? "  (Schub " + F(st.Push) + ")" : ""),
                editor.Budget > 0 ? (float)(st.N / editor.Budget) : 0f, barColour,
                "Mehr Tinte schiebt stärker, ist aber langsamer.");
            y = StatRow(px, y, pw,
                "Panzerung: " + F(st.Armour) + "  (Kern " + st.C + ", Hohlraum " + I(st.PocketCells) + ")",
                ArmourFraction(st), barColour,
                "Gefüllte Flächen panzern, Hohlräume ein wenig.");
            y = StatRow(px, y, pw,
                "Schärfe: " + F2(st.Sharpness) + "  (Klingenfelder " + st.S + ")",
                SharpFraction(st), barColour,
                "Klingen sind Striche, nur ein Feld dick (gelb).");
            y = StatRow(px, y, pw,
                "Tempo: " + F(st.TopSpeed),
                SpeedFraction(st), barColour,
                "Weniger Tinte ist schneller.");
            GUI.Label(new Rect(px, y, pw, 24f), "Element: " + ElementName(st.Element), labelStyle);
            y += 28f;

            if (purpose == Purpose.SoloEnemy && run != null && run.Wave < InkSolo.Waves)
            {
                GUI.Label(new Rect(px, y, pw, 22f), "Einsatz (mehr Tinte, mehr Gefahr, mehr Beute):", smallStyle);
                y += 22f;
                float sw = (pw - 2f * 6f) / 3f;
                for (int k = 0; k < tuning.Stakes.Length && k < 3; k++)
                {
                    int copies = st.N > 0 ? InkSolo.Copies(tuning, run.Wave, k, st.N) : 0;
                    string text = Mult(tuning.Stakes[k]) + "\n" + copies + " Gegner";
                    if (stakeIndex == k) text = "[" + text + "]";
                    if (GUI.Button(new Rect(px + k * (sw + 6f), y, sw, 50f), text, buttonStyle)) stakeIndex = k;
                }
                y += 54f;
                // what the chosen stake does, all numbers from the core
                if (st.N > 0 && stakeIndex >= 0 && stakeIndex < tuning.Stakes.Length)
                {
                    int copies = InkSolo.Copies(tuning, run.Wave, stakeIndex, st.N);
                    double scale = InkSolo.WaveArmourScale(tuning, run.Wave, stakeIndex, st.N);
                    double enemyArmour = InkSolo.EnemyArmour(tuning, PreviewFigure(), scale);
                    double drop = InkSolo.DropValue(tuning, run.Wave, stakeIndex, st.N);
                    GUI.Label(new Rect(px, y, pw, 40f),
                        copies + " Gegner mit je " + F(enemyArmour) + " Panzerung, Schaden " + Mult(tuning.StakeDamageMult[stakeIndex])
                        + ", Tempo " + Mult(tuning.StakeSpeedMult[stakeIndex]) + ". Beute: " + I(drop) + " Tinte je Gegner.", smallStyle);
                }
                y += 40f;
            }

            string why;
            bool valid = DrawingValid(out why);
            if (message != "") why = message;
            GUI.Label(new Rect(px, y, pw, 40f), why, smallStyle);
            if (purpose == Purpose.SoloUpgradeHero || purpose == Purpose.SoloUpgradeWeapon)
            {
                if (GUI.Button(new Rect(px, vh - 126f, pw, 40f), "Abbrechen (kein Upgrade)", buttonStyle))
                {
                    // the redraw is thrown away: ask once when it was changed
                    if (editor.Revision != beginRevision) { ask = Ask.CancelUpgrade; return; }
                    message = "";
                    view = View.SoloShop;
                    return;
                }
            }
            GUI.enabled = valid;
            string go = purpose == Purpose.RingFigure ? "In den Ring!" : purpose == Purpose.SoloEnemy ? "Welle starten" : "Fertig";
            if (GUI.Button(new Rect(px, vh - 80f, pw, 60f), go, buttonStyle))
            {
                GUI.enabled = true;
                if (purpose == Purpose.RingFigure) StartRingRound();
                else FinishSoloDrawing();
            }
            GUI.enabled = true;
        }

        private void FightHints(float vw, float vh, InkBody me)
        {
            // dash cooldown and the touch areas
            if (me != null && tuning.DashCooldownTicks > 0)
            {
                float ready = 1f - (float)(me.DashCd / tuning.DashCooldownTicks);
                Bar(new Rect(vw - 190f, vh - 40f, 170f, 18f), ready, ready >= 1f ? new Color(0.3f, 0.8f, 0.4f, 1f) : new Color(0.6f, 0.6f, 0.6f, 1f));
                GUI.Label(new Rect(vw - 190f, vh - 66f, 170f, 24f), "Sprint", smallStyle);
            }
            if (stickPointer != NoPointer)
            {
                Color old = GUI.color;
                GUI.color = new Color(1f, 1f, 1f, 0.35f);
                GUI.DrawTexture(new Rect(stickOrigin.x - 6f, stickOrigin.y - 6f, 12f, 12f), white);
                float kx = stickValue.x;
                float ky = stickValue.y;
                float len = Mathf.Sqrt(kx * kx + ky * ky);
                if (len > 1f) { kx /= len; ky /= len; }
                GUI.DrawTexture(new Rect(stickOrigin.x + kx * StickRadius - 12f, stickOrigin.y + ky * StickRadius - 12f, 24f, 24f), white);
                GUI.color = old;
            }
        }

        private void RingGui(float vw, float vh)
        {
            if (match == null || match.World == null) return;
            List<InkBody> bodies = match.World.Bodies;
            GUI.Label(new Rect(20f, 10f, 400f, 28f),
                "Runde " + match.Round + "   Zeit " + I(match.Tick / tuning.TickRate) + " s   Ring " + F(match.RingRadius), labelStyle);
            for (int i = 0; i < bodies.Count; i++)
            {
                InkBody b = bodies[i];
                float y = 44f + i * 30f;
                string styleName = BotStyleName(i);
                GUI.Label(new Rect(20f, y, 150f, 26f),
                    SeatName(i) + (styleName != "" ? " " + styleName : "") + "  (" + match.Wins[i] + ")", smallStyle);
                float frac = b.MaxHp > 0 ? (float)(b.Hp / b.MaxHp) : 0f;
                Bar(new Rect(170f, y + 4f, 160f, 16f), b.Alive ? frac : 0f, i == 0 ? new Color(1f, 0.8f, 0.2f, 1f) : new Color(0.8f, 0.35f, 0.3f, 1f));
                if (!b.Alive)
                    GUI.Label(new Rect(340f, y, 200f, 26f), match.OutReason[i] == InkRing.ReasonRing ? "aus dem Ring" : "Panzerung zerstört", smallStyle);
                else
                {
                    Vector2 g = arena.WorldToGui(b.X, b.Y - b.Fig.Radius - 2.0, guiScale);
                    Bar(new Rect(g.x - 24f, g.y - 8f, 48f, 6f), frac, i == 0 ? new Color(1f, 0.8f, 0.2f, 1f) : new Color(0.8f, 0.35f, 0.3f, 1f));
                }
            }
            if (view == View.RingFight)
            {
                FightNote(vw);
                FightHints(vw, vh, bodies[0]);
                return;
            }
            // round or match over
            bool matchOver = match.Phase == InkRing.PhaseMatchOver;
            string text = matchOver
                ? (match.MatchWinner == 0 ? "Du gewinnst das Match!" : SeatName(match.MatchWinner) + " gewinnt das Match.")
                : (match.RoundWinner == 0 ? "Runde gewonnen!" : "Runde an " + SeatName(match.RoundWinner) + ".");
            if (!matchOver && match.Lost[0] > 0)
                text += "\nDein Tintenbudget für die nächste Runde: " + I(InkRing.InkBudget(tuning, match, 0));
            GUI.Box(new Rect(vw * 0.5f - 280f, vh * 0.5f - 110f, 560f, 220f), "");
            GUI.Label(new Rect(vw * 0.5f - 260f, vh * 0.5f - 100f, 520f, 110f), text, centreStyle);
            if (matchOver)
            {
                if (GUI.Button(new Rect(vw * 0.5f - 130f, vh * 0.5f + 30f, 260f, 60f), "Zurück zum Menü", buttonStyle)) GoMenu();
            }
            else if (GUI.Button(new Rect(vw * 0.5f - 130f, vh * 0.5f + 30f, 260f, 60f), "Nächste Runde zeichnen", buttonStyle))
            {
                BeginRingDraw();
            }
        }

        private void SoloGui(float vw, float vh)
        {
            if (run == null || run.World == null) return;
            List<InkBody> bodies = run.World.Bodies;
            InkBody hero = bodies[0];
            int alive = 0;
            for (int i = 1; i < bodies.Count; i++) if (bodies[i].Alive) alive++;
            string wave = run.Wave >= InkSolo.Waves ? "Boss" : "Welle " + (run.Wave + 1) + " von " + InkSolo.Waves;
            GUI.Label(new Rect(20f, 10f, 700f, 28f),
                wave + (run.Wave < InkSolo.Waves ? " (Einsatz " + Mult(run.Stake) + ")" : "")
                + "   Gegner: " + alive + "   Beutel: " + I(run.Wallet) + "   Punkte: " + I(run.Score)
                + "   Zeit " + I(run.Tick / tuning.TickRate) + " s", labelStyle);
            GUI.Label(new Rect(20f, 44f, 150f, 26f), "Panzerung", smallStyle);
            Bar(new Rect(120f, 48f, 240f, 16f), hero.MaxHp > 0 ? (float)(hero.Hp / hero.MaxHp) : 0f, new Color(1f, 0.8f, 0.2f, 1f));
            for (int i = 1; i < bodies.Count; i++)
            {
                InkBody b = bodies[i];
                if (!b.Alive || b.MaxHp <= 0 || b.Hp >= b.MaxHp) continue;
                Vector2 g = arena.WorldToGui(b.X, b.Y - b.Fig.Radius - 1.5, guiScale);
                Bar(new Rect(g.x - 18f, g.y - 6f, 36f, 5f), (float)(b.Hp / b.MaxHp), new Color(0.8f, 0.35f, 0.3f, 1f));
            }
            if (view == View.SoloFight)
            {
                FightNote(vw);
                FightHints(vw, vh, hero);
                return;
            }
            string text;
            if (run.Phase == InkSolo.PhaseWon) text = "Gewonnen! Der Boss ist besiegt.";
            else if (run.EndReason == "time") text = "Die Zeit ist abgelaufen.";
            else text = "Deine Panzerung ist zerstört.";
            text += "\nPunkte: " + I(run.Score);
            GUI.Box(new Rect(vw * 0.5f - 280f, vh * 0.5f - 110f, 560f, 220f), "");
            GUI.Label(new Rect(vw * 0.5f - 260f, vh * 0.5f - 100f, 520f, 110f), text, centreStyle);
            if (GUI.Button(new Rect(vw * 0.5f - 130f, vh * 0.5f + 30f, 260f, 60f), "Zurück zum Menü", buttonStyle)) GoMenu();
        }

        private void ShopGui(float vw, float vh)
        {
            if (run == null) return;
            float x = 60f;
            float w = vw - 2f * x;
            if (w > 760f) w = 760f;
            bool bossNext = run.Wave == InkSolo.Waves;
            int costIndex = run.Wave - 1;
            double cost = costIndex >= 0 && costIndex < tuning.UpgradeCost.Length ? tuning.UpgradeCost[costIndex] : 0;
            GUI.Label(new Rect(x, 30f, w, 44f), "Welle geschafft!", titleStyle);
            GUI.Label(new Rect(x, 84f, w, 60f),
                "Tinte im Beutel: " + I(run.Wallet) + "   Punkte: " + I(run.Score)
                + "   Panzerung: " + F(run.HeroHp) + " von " + F(run.HeroMaxHp)
                + "\nEin Upgrade pro Pause, Preis: " + I(cost) + " Tinte.", labelStyle);
            bool canBuy = !run.UpgradeTaken && run.Wallet >= cost;
            float y = 160f;
            GUI.enabled = canBuy;
            if (GUI.Button(new Rect(x, y, w, 50f), "Heilen (+" + I(tuning.UpgradeHealPercent) + " % Panzerung)", buttonStyle))
                message = Bought(InkSolo.Upgrade(tuning, run, InkSolo.UpgradeHeal, null, 0));
            y += 58f;
            if (GUI.Button(new Rect(x, y, w, 50f), "Mehr Tinte für den Helden (+" + I(tuning.UpgradeHeroInk) + ") – neu zeichnen", buttonStyle))
            {
                purpose = Purpose.SoloUpgradeHero;
                BeginEdit(heroCells, run.HeroBudget + tuning.UpgradeHeroInk, InkDrawing.KindFigure, run.Colours);
                message = "";
                view = View.Draw;
            }
            y += 58f;
            if (GUI.Button(new Rect(x, y, w, 50f), "Mehr Tinte für die Waffe (+" + I(tuning.UpgradeWeaponInk) + ") – neu zeichnen", buttonStyle))
            {
                purpose = Purpose.SoloUpgradeWeapon;
                BeginEdit(weaponCells, run.WeaponBudget + tuning.UpgradeWeaponInk, InkDrawing.KindWeapon, run.Colours);
                message = "";
                view = View.Draw;
            }
            y += 58f;
            float cw = (w - 12f) / 3f;
            for (int c = 2; c <= 4; c++)
            {
                GUI.enabled = canBuy && !run.Colours[c];
                if (GUI.Button(new Rect(x + (c - 2) * (cw + 6f), y, cw, 50f), "Neue Farbe: " + ColourNames[c], buttonStyle))
                    message = Bought(InkSolo.Upgrade(tuning, run, InkSolo.UpgradeColour, null, c));
            }
            GUI.enabled = true;
            y += 62f;
            GUI.Label(new Rect(x, y, w, 30f), message, smallStyle);
            if (GUI.Button(new Rect(x, vh - 100f, w, 64f), bossNext ? "Zum Boss – er besteht aus deinen Gegnern" : "Nächste Welle zeichnen", buttonStyle))
            {
                message = "";
                if (bossNext)
                {
                    arena.ClearFigures();
                    InkSolo.StartBoss(tuning, run);
                    BeginSoloFight();
                }
                else BeginEnemyDraw();
            }
        }

        private static string Bought(string result)
        {
            return result == "" ? "Upgrade gekauft." : ReasonText(result);
        }
    }
}
