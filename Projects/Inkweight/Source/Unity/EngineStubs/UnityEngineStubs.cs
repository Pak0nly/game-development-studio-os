// HAND-WRITTEN STUBS - NOT UNITY.
//
// Minimal stand-ins for exactly the engine types and members that
// Assets/Inkweight/Runtime uses, so that the Runtime sources can be compiled
// (and smoke-run headless) with the plain .NET SDK where no Unity Editor is
// available. The signatures were written from memory of the Unity scripting
// API. A successful build against these stubs proves C# syntax, the use of the
// Inkweight core API and the game's own control flow. It proves NOTHING about
// real engine behaviour, and a member that is spelled wrong here in the same
// way as in the Runtime code would not be noticed. This folder is outside
// Assets and is never compiled by Unity.
using System;
using System.Collections.Generic;

namespace UnityEngine
{
    public struct Vector2
    {
        public float x, y;
        public Vector2(float x, float y) { this.x = x; this.y = y; }
    }

    public struct Vector3
    {
        public float x, y, z;
        public Vector3(float x, float y, float z) { this.x = x; this.y = y; this.z = z; }
    }

    public struct Quaternion
    {
        public float x, y, z, w;
        public static Quaternion identity { get { Quaternion q = new Quaternion(); q.w = 1f; return q; } }
        public static Quaternion Euler(float x, float y, float z) { Quaternion q = new Quaternion(); q.z = z; q.w = 1f; return q; }
    }

    public struct Matrix4x4
    {
        public static Matrix4x4 TRS(Vector3 pos, Quaternion q, Vector3 s) { return new Matrix4x4(); }
    }

    public struct Color
    {
        public float r, g, b, a;
        public Color(float r, float g, float b, float a) { this.r = r; this.g = g; this.b = b; this.a = a; }
    }

    public struct Color32
    {
        public byte r, g, b, a;
        public Color32(byte r, byte g, byte b, byte a) { this.r = r; this.g = g; this.b = b; this.a = a; }
    }

    public struct Rect
    {
        public float x, y, width, height;
        public Rect(float x, float y, float width, float height) { this.x = x; this.y = y; this.width = width; this.height = height; }
        public bool Contains(Vector2 p) { return p.x >= x && p.x < x + width && p.y >= y && p.y < y + height; }
    }

    public static class Mathf
    {
        public const float Rad2Deg = 57.29578f;
        public static float Sqrt(float f) { return (float)Math.Sqrt(f); }
        public static float Atan2(float y, float x) { return (float)Math.Atan2(y, x); }
        public static float Clamp01(float v) { return v < 0f ? 0f : (v > 1f ? 1f : v); }
    }

    public static class Debug
    {
        public static readonly List<string> Errors = new List<string>(); // stub only
        public static void Log(object message) { }
        public static void LogError(object message) { Errors.Add(message == null ? "" : message.ToString()); }
    }

    public static class Screen
    {
        public static int StubWidth = 1280, StubHeight = 720; // stub only
        public static int width { get { return StubWidth; } }
        public static int height { get { return StubHeight; } }
    }

    public static class Time
    {
        public static float StubDelta = 1f / 60f; // stub only
        public static float unscaledDeltaTime { get { return StubDelta; } }
    }

    public class Object
    {
        public string name;
        public static int StubDestroyed; // stub only
        public static void Destroy(Object obj) { StubDestroyed++; }
        public static void DontDestroyOnLoad(Object target) { }
        public static implicit operator bool(Object o) { return !object.ReferenceEquals(o, null); }
    }

    public class Component : Object
    {
        public GameObject gameObject;
        public Transform transform { get { return gameObject.transform; } }
    }

    public class Behaviour : Component
    {
        public bool enabled = true;
    }

    public class MonoBehaviour : Behaviour { }

    public class Transform : Component
    {
        public Vector3 position, localScale;
        public Quaternion rotation;
        public Transform parent;
        public void SetParent(Transform p, bool worldPositionStays) { parent = p; }
    }

    public sealed class GameObject : Object
    {
        public static readonly List<GameObject> StubAll = new List<GameObject>(); // stub only
        private readonly Transform tr;
        private readonly List<Component> components = new List<Component>();
        public bool activeSelf = true;

        public GameObject(string name)
        {
            this.name = name;
            tr = new Transform();
            tr.gameObject = this;
            StubAll.Add(this);
        }

        public Transform transform { get { return tr; } }
        public void SetActive(bool value) { activeSelf = value; }

        public T AddComponent<T>() where T : Component, new()
        {
            T c = new T();
            c.gameObject = this;
            components.Add(c);
            return c;
        }
    }

    public enum CameraClearFlags { Skybox = 1, SolidColor = 2, Depth = 3, Nothing = 4 }

    public sealed class Camera : Behaviour
    {
        public bool orthographic;
        public float orthographicSize = 5f;
        public CameraClearFlags clearFlags;
        public Color backgroundColor;
        public float depth;
    }

    public enum TextureFormat { RGBA32 = 4 }
    public enum FilterMode { Point = 0, Bilinear = 1, Trilinear = 2 }
    public enum TextureWrapMode { Repeat = 0, Clamp = 1 }

    public class Texture : Object
    {
        public FilterMode filterMode;
        public TextureWrapMode wrapMode;
    }

    public sealed class Texture2D : Texture
    {
        public readonly int StubWidth, StubHeight; // stub only
        public Color32[] StubPixels;               // stub only
        public Texture2D(int width, int height, TextureFormat format, bool mipChain)
        {
            if (width <= 0 || height <= 0) throw new ArgumentException("texture size");
            StubWidth = width; StubHeight = height;
        }
        public void SetPixels32(Color32[] colors)
        {
            if (colors.Length != StubWidth * StubHeight) throw new ArgumentException("SetPixels32: wrong array size");
            StubPixels = (Color32[])colors.Clone();
        }
        public void SetPixel(int x, int y, Color color) { }
        public void Apply(bool updateMipmaps) { }
    }

    public sealed class Sprite : Object
    {
        public static Sprite Create(Texture2D texture, Rect rect, Vector2 pivot, float pixelsPerUnit)
        {
            if (texture == null) throw new ArgumentNullException("texture");
            return new Sprite();
        }
    }

    public class Renderer : Component
    {
        public bool enabled = true;
        public int sortingOrder;
    }

    public sealed class SpriteRenderer : Renderer
    {
        public Sprite sprite;
        public Color color;
    }

    [AttributeUsage(AttributeTargets.Method)]
    public sealed class RuntimeInitializeOnLoadMethodAttribute : Attribute
    {
        public RuntimeInitializeOnLoadMethodAttribute(RuntimeInitializeLoadType loadType) { }
    }

    public enum RuntimeInitializeLoadType { AfterSceneLoad = 0, BeforeSceneLoad = 1, AfterAssembliesLoaded = 2, BeforeSplashScreen = 3, SubsystemRegistration = 4 }

    // ---- immediate-mode GUI

    public enum EventType { MouseDown = 0, MouseUp = 1, MouseMove = 2, MouseDrag = 3, KeyDown = 4, KeyUp = 5, ScrollWheel = 6, Repaint = 7, Layout = 8, Used = 12 }

    public enum KeyCode
    {
        None = 0, Escape = 27, Space = 32, A = 97, D = 100, S = 115, W = 119,
        UpArrow = 273, DownArrow = 274, RightArrow = 275, LeftArrow = 276, LeftShift = 304, JoystickButton0 = 330,
    }

    public sealed class Event
    {
        public static Event current;
        public EventType type;
        public int button;
        public Vector2 mousePosition;
        public KeyCode keyCode;
        public void Use() { type = EventType.Used; }
    }

    public enum FontStyle { Normal = 0, Bold = 1, Italic = 2, BoldAndItalic = 3 }
    public enum TextAnchor { UpperLeft = 0, UpperCenter = 1, UpperRight = 2, MiddleLeft = 3, MiddleCenter = 4 }

    public sealed class GUIStyleState
    {
        public Color textColor;
    }

    public sealed class GUIStyle
    {
        public int fontSize;
        public bool wordWrap;
        public FontStyle fontStyle;
        public TextAnchor alignment;
        public GUIStyleState normal = new GUIStyleState();
        public GUIStyle() { }
        public GUIStyle(GUIStyle other)
        {
            fontSize = other.fontSize; wordWrap = other.wordWrap; fontStyle = other.fontStyle; alignment = other.alignment;
            normal.textColor = other.normal.textColor;
        }
    }

    public sealed class GUISkin
    {
        public GUIStyle label = new GUIStyle();
        public GUIStyle button = new GUIStyle();
    }

    public static class GUI
    {
        public static Color color;
        public static bool enabled = true;
        public static Matrix4x4 matrix;
        public static GUISkin skin = new GUISkin();

        // stub only: what the last OnGUI pass showed, and a scripted click
        public static readonly List<string> StubLabels = new List<string>();
        public static readonly List<string> StubButtons = new List<string>();
        public static string StubClick;

        public static void Label(Rect position, string text, GUIStyle style) { StubLabels.Add(text); }
        public static void Box(Rect position, string text) { }
        public static void DrawTexture(Rect position, Texture image)
        {
            if (image == null) throw new ArgumentNullException("image");
        }
        public static bool Button(Rect position, string text, GUIStyle style)
        {
            StubButtons.Add((enabled ? "" : "(disabled) ") + text);
            if (enabled && StubClick != null && text.Contains(StubClick)) { StubClick = null; return true; }
            return false;
        }
    }

    // ---- old Input Manager (module com.unity.modules.inputlegacy)

    public enum TouchPhase { Began = 0, Moved = 1, Stationary = 2, Ended = 3, Canceled = 4 }

    public struct Touch
    {
        public int fingerId;
        public Vector2 position;
        public TouchPhase phase;
    }

    public static class Input
    {
        public static int touchCount { get { return 0; } }
        public static Touch GetTouch(int index) { return new Touch(); }
        public static bool GetKey(KeyCode key) { return false; }
        public static float GetAxisRaw(string axisName) { return 0f; }
    }
}

// ---- Input System package (com.unity.inputsystem), only the members used

namespace UnityEngine.InputSystem.Utilities
{
    public struct ReadOnlyArray<T>
    {
        private readonly T[] items;
        public ReadOnlyArray(T[] items) { this.items = items; }
        public int Count { get { return items == null ? 0 : items.Length; } }
        public T this[int index] { get { return items[index]; } }
    }
}

namespace UnityEngine.InputSystem.Controls
{
    public class ButtonControl { public bool isPressed { get { return false; } } }
    public class KeyControl : ButtonControl { }
    public class Vector2Control { public UnityEngine.Vector2 ReadValue() { return new UnityEngine.Vector2(); } }
    public class StickControl : Vector2Control { }
    public class DpadControl : Vector2Control { }
    public class IntegerControl { public int ReadValue() { return 0; } }
    public class TouchPressControl : ButtonControl { }
    public class TouchControl
    {
        public TouchPressControl press = new TouchPressControl();
        public Vector2Control position = new Vector2Control();
        public IntegerControl touchId = new IntegerControl();
    }
}

namespace UnityEngine.InputSystem
{
    using UnityEngine.InputSystem.Controls;
    using UnityEngine.InputSystem.Utilities;

    public class Keyboard
    {
        public static Keyboard current { get { return null; } }
        public KeyControl aKey, dKey, wKey, sKey, leftArrowKey, rightArrowKey, upArrowKey, downArrowKey, spaceKey, leftShiftKey;
    }

    public class Gamepad
    {
        public static Gamepad current { get { return null; } }
        public StickControl leftStick;
        public DpadControl dpad;
        public ButtonControl buttonSouth, rightShoulder;
    }

    public class Touchscreen
    {
        public static Touchscreen current { get { return null; } }
        public ReadOnlyArray<TouchControl> touches { get { return new ReadOnlyArray<TouchControl>(null); } }
    }
}
