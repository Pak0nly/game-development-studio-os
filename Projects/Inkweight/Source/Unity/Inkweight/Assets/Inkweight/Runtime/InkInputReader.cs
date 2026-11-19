// Input for the prototype.
//
// Baseline (always compiled, works with every input setting): mouse and
// keyboard are taken from the immediate-mode GUI events that Unity delivers to
// OnGUI. On top of that, gamepad and multi-touch are read from whichever input
// backend the project has:
//   - ENABLE_LEGACY_INPUT_MANAGER (set by Unity when the old Input Manager is
//     active): UnityEngine.Input.
//   - ENABLE_INPUT_SYSTEM (set by Unity when the Input System backend is
//     active) together with INKWEIGHT_INPUT_SYSTEM (set by the version define
//     in Inkweight.Runtime.asmdef only when the package is installed):
//     UnityEngine.InputSystem.
// With neither, the game is still playable with mouse and keyboard.
using System.Collections.Generic;
using UnityEngine;
#if INKWEIGHT_INPUT_SYSTEM && ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

namespace Inkweight.Runtime
{
    public struct InkPointer
    {
        public int Id;
        public Vector2 Pos; // GUI space: x right, y down, in virtual GUI units
    }

    public sealed class InkInputReader
    {
        // Pressed pointers of this frame (touches, or the left mouse button).
        public readonly List<InkPointer> Pointers = new List<InkPointer>();
        // Steering from keyboard and gamepad in core axes (x right, y down).
        public Vector2 Move;
        public bool Dash;
        public bool EscapePressed; // true for one Poll after the key went down

        private readonly HashSet<KeyCode> keys = new HashSet<KeyCode>();
        private bool mouseDown;
        private Vector2 mousePos;
        private bool escapeQueued;
#if ENABLE_LEGACY_INPUT_MANAGER
        private bool legacyAxesBroken;
#endif

        // Call first thing in OnGUI, before any control can use the event.
        public void OnGuiEvent(Event e)
        {
            if (e == null) return;
            EventType t = e.type;
            if (t == EventType.MouseDown && e.button == 0) { mouseDown = true; mousePos = e.mousePosition; }
            else if (t == EventType.MouseDrag && e.button == 0) { mousePos = e.mousePosition; }
            else if (t == EventType.MouseUp && e.button == 0) { mouseDown = false; mousePos = e.mousePosition; }
            else if (t == EventType.KeyDown && e.keyCode != KeyCode.None)
            {
                if (e.keyCode == KeyCode.Escape && !keys.Contains(KeyCode.Escape)) escapeQueued = true;
                keys.Add(e.keyCode);
            }
            else if (t == EventType.KeyUp && e.keyCode != KeyCode.None) { keys.Remove(e.keyCode); }
        }

        // Keys and buttons can stay "down" when the window loses focus.
        public void Clear()
        {
            keys.Clear();
            mouseDown = false;
            escapeQueued = false;
            Pointers.Clear();
            Move = new Vector2(0f, 0f);
            Dash = false;
        }

        private bool Held(KeyCode k) { return keys.Contains(k); }

        // Call once per Update. guiScale = screen pixels per virtual GUI unit.
        public void Poll(float guiScale)
        {
            EscapePressed = escapeQueued;
            escapeQueued = false;
            Pointers.Clear();

            float x = 0f;
            float y = 0f;
            bool dash = false;
            if (Held(KeyCode.A) || Held(KeyCode.LeftArrow)) x -= 1f;
            if (Held(KeyCode.D) || Held(KeyCode.RightArrow)) x += 1f;
            if (Held(KeyCode.W) || Held(KeyCode.UpArrow)) y -= 1f;
            if (Held(KeyCode.S) || Held(KeyCode.DownArrow)) y += 1f;
            if (Held(KeyCode.Space) || Held(KeyCode.LeftShift)) dash = true;

            float h = Screen.height;
            if (guiScale <= 0f) guiScale = 1f;

#if ENABLE_LEGACY_INPUT_MANAGER
            if (!legacyAxesBroken)
            {
                try
                {
                    // The default Input Manager axes cover the arrow keys, WASD
                    // and the first stick of every joystick.
                    float ax = UnityEngine.Input.GetAxisRaw("Horizontal");
                    float ay = UnityEngine.Input.GetAxisRaw("Vertical");
                    if (ax * ax + ay * ay > 0.04f) { x += ax; y -= ay; }
                }
                catch (System.Exception)
                {
                    legacyAxesBroken = true; // the project renamed or removed the default axes
                }
            }
            if (UnityEngine.Input.GetKey(KeyCode.Space) || UnityEngine.Input.GetKey(KeyCode.LeftShift)
                || UnityEngine.Input.GetKey(KeyCode.JoystickButton0)) dash = true;
            // Fully qualified on purpose: the Input System package has its own
            // UnityEngine.InputSystem.TouchPhase, so the short name is ambiguous
            // (CS0104) when both backends are active and the package is installed.
            for (int i = 0; i < UnityEngine.Input.touchCount; i++)
            {
                UnityEngine.Touch t = UnityEngine.Input.GetTouch(i);
                if (t.phase == UnityEngine.TouchPhase.Ended || t.phase == UnityEngine.TouchPhase.Canceled) continue;
                InkPointer p;
                p.Id = t.fingerId;
                p.Pos = new Vector2(t.position.x / guiScale, (h - t.position.y) / guiScale);
                Pointers.Add(p);
            }
#endif

#if INKWEIGHT_INPUT_SYSTEM && ENABLE_INPUT_SYSTEM
            var kb = Keyboard.current;
            if (kb != null)
            {
                if (kb.aKey.isPressed || kb.leftArrowKey.isPressed) x -= 1f;
                if (kb.dKey.isPressed || kb.rightArrowKey.isPressed) x += 1f;
                if (kb.wKey.isPressed || kb.upArrowKey.isPressed) y -= 1f;
                if (kb.sKey.isPressed || kb.downArrowKey.isPressed) y += 1f;
                if (kb.spaceKey.isPressed || kb.leftShiftKey.isPressed) dash = true;
            }
            var pad = Gamepad.current;
            if (pad != null)
            {
                Vector2 stick = pad.leftStick.ReadValue();
                if (stick.x * stick.x + stick.y * stick.y > 0.04f) { x += stick.x; y -= stick.y; }
                Vector2 dpad = pad.dpad.ReadValue();
                x += dpad.x;
                y -= dpad.y;
                if (pad.buttonSouth.isPressed || pad.rightShoulder.isPressed) dash = true;
            }
            var screen = Touchscreen.current;
            if (screen != null && Pointers.Count == 0)
            {
                var touches = screen.touches;
                for (int i = 0; i < touches.Count; i++)
                {
                    var t = touches[i];
                    if (!t.press.isPressed) continue;
                    Vector2 pos = t.position.ReadValue();
                    InkPointer p;
                    p.Id = t.touchId.ReadValue();
                    p.Pos = new Vector2(pos.x / guiScale, (h - pos.y) / guiScale);
                    Pointers.Add(p);
                }
            }
#endif

            if (Pointers.Count == 0 && mouseDown)
            {
                InkPointer p;
                p.Id = -1;
                p.Pos = mousePos;
                Pointers.Add(p);
            }

            // keyboard and stick can add up; keep each axis inside -1..1
            if (x > 1f) x = 1f;
            if (x < -1f) x = -1f;
            if (y > 1f) y = 1f;
            if (y < -1f) y = -1f;
            Move = new Vector2(x, y);
            Dash = dash;
        }
    }
}
