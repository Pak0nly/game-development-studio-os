// Headless smoke test of the Unity presentation layer against the stubs in
// UnityEngineStubs.cs. It calls the component's Awake / Update / OnGUI by
// reflection (the engine would call them), clicks through the menus by button
// text, paints on the canvas with fake mouse events and plays a Ring match and
// a solo run with an idle or key-steered player.
//
// What this proves: the game's own control flow runs without exceptions and
// reaches its end screens. What it does not prove: anything about rendering,
// real input, real GUI layout or any other engine behaviour.
using System;
using System.Collections.Generic;
using System.Reflection;
using Inkweight.Runtime;
using UnityEngine;

namespace Inkweight.RuntimeStubCheck
{
    public static class SmokeProgram
    {
        private static InkweightGame game;
        private static MethodInfo update, onGui;
        private static int failures;
        private static int frames;

        public static int Main()
        {
            Console.WriteLine("Inkweight runtime smoke test against engine stubs (NOT Unity)");
#if INKWEIGHT_INPUT_SYSTEM && ENABLE_INPUT_SYSTEM && ENABLE_LEGACY_INPUT_MANAGER
            Console.WriteLine("input variant: both backends");
#elif INKWEIGHT_INPUT_SYSTEM && ENABLE_INPUT_SYSTEM
            Console.WriteLine("input variant: Input System package");
#elif ENABLE_LEGACY_INPUT_MANAGER
            Console.WriteLine("input variant: old Input Manager");
#else
            Console.WriteLine("input variant: no backend (GUI events only)");
#endif
            try
            {
                Run();
            }
            catch (Exception e)
            {
                Exception inner = e is TargetInvocationException && e.InnerException != null ? e.InnerException : e;
                Fail("exception: " + inner);
            }
            Console.WriteLine(failures == 0
                ? "RESULT: PASS (stub smoke test, " + frames + " frames)"
                : "RESULT: FAIL (" + failures + " problems)");
            return failures == 0 ? 0 : 1;
        }

        private static void Fail(string text)
        {
            failures++;
            Console.WriteLine("  FAILED " + text);
        }

        private static void Expect(bool ok, string text)
        {
            if (!ok) Fail(text + "  [buttons: " + string.Join(" | ", GUI.StubButtons).Replace("\n", " ") + "]");
        }

        private static void Gui(Event e)
        {
            GUI.StubLabels.Clear();
            GUI.StubButtons.Clear();
            Event.current = e;
            onGui.Invoke(game, null);
            foreach (string l in GUI.StubLabels)
                if (l.Contains("konnte nicht starten")) throw new InvalidOperationException("game reported a fatal error: " + l);
        }

        private static Event Ev(EventType type)
        {
            Event e = new Event();
            e.type = type;
            return e;
        }

        private static void Frame()
        {
            frames++;
            update.Invoke(game, null);
            Gui(Ev(EventType.Repaint));
        }

        private static bool HasButton(string part)
        {
            foreach (string b in GUI.StubButtons) if (b.Contains(part) && !b.StartsWith("(disabled)")) return true;
            return false;
        }

        private static bool HasLabel(string part)
        {
            foreach (string l in GUI.StubLabels) if (l.Contains(part)) return true;
            return false;
        }

        private static void Click(string part)
        {
            GUI.StubClick = part;
            Gui(Ev(EventType.MouseUp));
            if (GUI.StubClick != null)
            {
                GUI.StubClick = null;
                Expect(false, "button '" + part + "' not found or disabled");
            }
            Frame();
        }

        private static void Key(KeyCode k, bool down)
        {
            Event e = Ev(down ? EventType.KeyDown : EventType.KeyUp);
            e.keyCode = k;
            Gui(e);
        }

        private static void Mouse(EventType type, float x, float y)
        {
            Event e = Ev(type);
            e.button = 0;
            e.mousePosition = new Vector2(x, y);
            Gui(e);
        }

        private static object Field(object o, string name)
        {
            return o.GetType().GetField(name, BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public).GetValue(o);
        }

        private static void Run()
        {
            Screen.StubWidth = 1280;
            Screen.StubHeight = 720;
            GameObject go = new GameObject("Inkweight");
            game = go.AddComponent<InkweightGame>();
            BindingFlags bf = BindingFlags.Instance | BindingFlags.NonPublic;
            typeof(InkweightGame).GetMethod("Awake", bf).Invoke(game, null);
            update = typeof(InkweightGame).GetMethod("Update", bf);
            onGui = typeof(InkweightGame).GetMethod("OnGUI", bf);

            // ---- menu
            Frame();
            Expect(HasLabel("Kern-Selbsttest bestanden"), "menu shows the passed self check");
            Expect(Debug.Errors.Count == 0, "no error was logged at start: " + string.Join("; ", Debug.Errors));
            Expect(HasButton("2 Figuren") && HasButton("Glut"), "menu buttons");

            // ---- ring, 2 seats: paint a figure by hand
            Click("2 Figuren");
            Expect(!HasButton("In den Ring!"), "an empty canvas cannot start");
            // canvas rectangle of DrawGui at 1280 x 720: x 20, y 70, size 610
            float cell = 610f / 32f;
            Mouse(EventType.MouseDown, 20f + 16.5f * cell, 70f + 6.5f * cell);
            Mouse(EventType.MouseDrag, 20f + 16.5f * cell, 70f + 22.5f * cell);
            Mouse(EventType.MouseDrag, 20f + 10.5f * cell, 70f + 22.5f * cell);
            Mouse(EventType.MouseUp, 20f + 10.5f * cell, 70f + 22.5f * cell);
            Frame();
            Expect(HasLabel("Tinte: 23 von 220"), "the stroke filled 23 cells (17 down, 6 to the left)");
            InkCanvasEditor editor = (InkCanvasEditor)Field(game, "editor");
            Expect(editor.Cells[6 * 32 + 16] == 1 && editor.Cells[22 * 32 + 10] == 1 && editor.Cells[5 * 32 + 16] == 0, "painted cells are where the mouse was");
            // canvas row 6 must be texture row 31 - 6 (texture rows count from the bottom)
            Color32 top = editor.Texture.StubPixels[(31 - 6) * 32 + 16];
            Color32 below = editor.Texture.StubPixels[6 * 32 + 16];
            Expect(top.r == 28 && below.r != 28, "canvas texture is written top row last (not mirrored)");
            Expect(HasButton("In den Ring!"), "a valid drawing can start");
            int rounds = 0;
            bool matchDone = false;
            Time.StubDelta = 0.1f; // 6 ticks per frame
            for (int guard = 0; guard < 12 && !matchDone; guard++)
            {
                Click("In den Ring!");
                rounds++;
                Key(KeyCode.D, true);
                bool over = false;
                for (int f = 0; f < 4000 && !over; f++)
                {
                    if (f == 20) { Key(KeyCode.D, false); Key(KeyCode.W, true); Key(KeyCode.Space, true); }
                    if (f == 60) { Key(KeyCode.W, false); Key(KeyCode.Space, false); }
                    Frame();
                    over = HasButton("Nächste Runde zeichnen") || HasButton("Zurück zum Menü");
                }
                Expect(over, "ring round " + rounds + " ended");
                if (!over) return;
                if (HasButton("Zurück zum Menü")) { matchDone = true; Click("Zurück zum Menü"); }
                else Click("Nächste Runde zeichnen");
            }
            Expect(matchDone, "ring match ended");
            Expect(HasButton("2 Figuren"), "back in the menu after the match");
            Console.WriteLine("  ring 2 seats: match finished after " + rounds + " rounds");

            // ---- ring, 4 seats with an example drawing, left with Escape
            Click("4 Figuren");
            Click("Beispiel laden");
            Expect(HasButton("In den Ring!"), "example drawing is valid");
            Click("In den Ring!");
            for (int f = 0; f < 50; f++) Frame();
            Key(KeyCode.Escape, true);
            Frame();
            Key(KeyCode.Escape, false);
            Expect(HasButton("4 Figuren"), "Escape leads back to the menu");

            // ---- solo
            Click("Glut");
            LoadExampleUntil("Fertig");
            Click("Fertig");
            Expect(HasLabel("Wurfwaffe"), "weapon drawing screen");
            LoadExampleUntil("Fertig");
            Click("Fertig");
            Expect(HasLabel("Welle 1 von"), "enemy drawing screen");
            int fights = 0;
            bool ended = false;
            bool triedInk = false;
            for (int guard = 0; guard < 10 && !ended; guard++)
            {
                if (HasButton("Welle starten") || HasButton("Beispiel laden"))
                {
                    LoadExampleUntil("Welle starten");
                    if (guard == 0) Click("x2");
                    Click("Welle starten");
                }
                fights++;
                bool stop = false;
                for (int f = 0; f < 3000 && !stop; f++)
                {
                    if (f % 40 == 0) Key(KeyCode.A, (f / 40) % 2 == 0);
                    Frame();
                    stop = HasButton("Nächste Welle zeichnen") || HasButton("Zum Boss") || HasButton("Zurück zum Menü");
                }
                Key(KeyCode.A, false);
                Expect(stop, "solo fight " + fights + " ended");
                if (!stop) return;
                if (HasButton("Zurück zum Menü"))
                {
                    ended = true;
                    string outcome = HasLabel("Gewonnen") ? "won" : HasLabel("Zeit") ? "time over" : "hero destroyed";
                    Console.WriteLine("  solo: run ended after " + fights + " fights (" + outcome + ")");
                    Click("Zurück zum Menü");
                    break;
                }
                // shop
                if (!triedInk && HasButton("Mehr Tinte für den Helden"))
                {
                    triedInk = true;
                    Click("Mehr Tinte für den Helden");
                    Expect(HasButton("Abbrechen") && HasButton("Fertig"), "upgrade drawing screen");
                    Click("Fertig");
                    Expect(HasLabel("Upgrade gekauft."), "hero ink upgrade bought");
                }
                else if (HasButton("Heilen"))
                {
                    Click("Heilen");
                    Expect(HasLabel("Upgrade gekauft."), "heal bought");
                }
                if (HasButton("Zum Boss")) Click("Zum Boss");
                else Click("Nächste Welle zeichnen");
            }
            Expect(ended, "solo run reached an end screen");
            Expect(HasButton("Glut"), "back in the menu after the solo run");
            Expect(Debug.Errors.Count == 0, "no error was logged: " + string.Join("; ", Debug.Errors));
        }

        private static void LoadExampleUntil(string button)
        {
            for (int i = 0; i < 20; i++)
            {
                Click("Beispiel laden");
                if (HasButton(button)) return;
            }
            Expect(false, "no example drawing made '" + button + "' available");
        }
    }
}
