# Inkweight Unity Project: How to Open It and What to Expect

Work Orders INK-UNITY-V1 and INK-UNITY-V2 (core version 2, tuning
`ink-tuning-2`, the same rules as the browser prototype). Everything in this
folder was written and tested
**without the Unity Editor** (it is not available in the cloud container). The
rules core is proven against the golden files outside Unity. The Unity
presentation layer has only been compiled and smoke-run against hand-written
stubs of the engine (not against Unity), which says nothing about real engine
behaviour. The
first opening in the Editor is therefore the real test, and this page says what
to look at and what to report back.

## What is here

| Path | Content |
|---|---|
| `Inkweight/` | the Unity project (open this folder in Unity Hub) |
| `Inkweight/Assets/Inkweight/Core/` | C# port of the engine-free game core; assembly `Inkweight.Core`, no engine reference |
| `Inkweight/Assets/Inkweight/Core/Generated/InkGenerated.cs` | generated: the tuning file, example drawings and self-check hashes |
| `Inkweight/Assets/Inkweight/Runtime/` | the Unity presentation layer; assembly `Inkweight.Runtime` |
| `Inkweight/Packages/manifest.json` | two built-in modules: immediate-mode GUI and the old Input Manager |
| `CoreTests/` | .NET console test runner for the core (no Unity needed) |
| `EngineStubs/`, `check_runtime_against_stubs.sh` | compile and smoke check of the Runtime files against engine stubs (not Unity) |

There are no scenes, prefabs, imported assets, `.meta` files, `ProjectSettings`
or `ProjectVersion.txt`. Unity creates all of these on first opening. Commit the
`.meta` files Unity creates.

## Open the project

1. Unity Hub, **Add**, **Add project from disk**, choose the folder
   `Projects/Inkweight/Source/Unity/Inkweight`.
2. Unity Hub reports that the project has no Editor version. Choose the version
   (open decision OD-03; the Studio baseline is Unity 6.3 LTS). Any Unity 6
   version should do; the code avoids version-specific features. Platform:
   Windows, Mac, Linux.
3. Unity imports the scripts and creates `ProjectSettings`, `Library` and the
   `.meta` files. It opens an empty, untitled scene. That is enough.
4. Look at the **Console** window first. It must show no red compile errors.
5. Press **Play**. No scene has to be saved or set up.

If Unity Hub refuses the folder because it has no `ProjectSettings` (not
tested here): create a new empty project with the chosen Unity version, best
with a Built-in Render Pipeline 2D template (a Universal 2D template should
also work but is one more untested variable), copy the folder
`Inkweight/Assets/Inkweight` into its `Assets` folder, check that its
`Packages/manifest.json` contains the two lines of this project's manifest
(`com.unity.modules.imgui`, `com.unity.modules.inputlegacy`; the templates
normally have them), and press Play in any scene. The code needs nothing else
from the project.

If Unity asks about the Input System or "active input handling", every answer
is meant to work (old, new or both, with or without the Input System package);
see "Input" below. This is checked against stubs only.

## What should happen on Play (rules version 2)

- A dark background and a menu: title "Inkweight – Prototyp", three buttons
  under "Ring gegen Bots" (2, 3, 4 figures), three buttons under "Solo-Arena".
- **The self-check line** at the bottom of the menu: **"Kern-Selbsttest
  bestanden (111 Prüfpunkte bitgenau). Regeln: ink-tuning-2"**. The number
  changes when the golden files are regenerated; the rules name must be
  `ink-tuning-2`. The game replays two recorded fights from the golden files
  (`ring_1v1_disc_lance` and `solo_brawl_full_run`) at start and compares the
  state hashes. The Console shows the same as
  `Inkweight: self check passed, 111 checkpoints bit-identical`. A red line
  "Kern-Selbsttest FEHLGESCHLAGEN" means this build computes differently from
  the reference; please report its text.
- **Drawing screen:** a 32 x 32 paper canvas on the left; tools, ink meter and
  the stat panel on the right. Draw with the left mouse button (right button
  erases), or use "Beispiel laden" for an example.
  - **Blade marks:** ink that is only one cell thick is a blade and is shown
    with a yellow tint (black ink turns olive-gold). A stroke two cells wide,
    and the edge and corners of a filled area, keep the plain ink colour.
  - **Stat panel:** four rows, each with a number, a bar and one German line:
    - "Gewicht" (ink cells of the body; "Schub" appears when hollow space adds
      push weight) – "Mehr Tinte schiebt stärker, ist aber langsamer."
    - "Panzerung" with "Kern" and "Hohlraum" counts – "Gefüllte Flächen
      panzern, Hohlräume ein wenig." Bar from 60 to 300 (longer scale with
      catch-up ink).
    - "Schärfe" with "Klingenfelder" – "Klingen sind Striche, nur ein Feld dick
      (gelb)." Bar from 1.0 to 4.7.
    - "Tempo" – "Weniger Tinte ist schneller." Bar from the speed of a full
      budget (9.2 at 220 ink) to that of the smallest figure (32.4).
    Reference values to compare with the browser prototype: a filled disc of
    208 cells has armour 270.4 and sharpness 1.00; a straight 12-cell line has
    armour 63.6 and sharpness 4.52.
  - **Question before ink is lost:** "Leeren", "Beispiel laden", "Menü", Esc
    and "Abbrechen" (upgrade redraw, only when it was changed) ask once
    ("Ja, verwerfen" / "Nein, weiterzeichnen") when the canvas has ink. Esc
    while the question is open answers no.
- **Ring:** the title shows the drawing clock: "30 s ab dem ersten Strich",
  then "noch N s" from the first change of the drawing. When it reaches 0 the
  round starts by itself with the drawing as it is; if that is not valid, with
  its last valid state, and if there is none, with an example figure (a note
  over the ring says which). "In den Ring!" starts earlier. Before the round
  the core checks every figure (size and the seat's ink budget); a refused
  figure shows its reason on the drawing screen instead of starting. In the
  fight: a paper-coloured round floor that shrinks, your figure with a yellow
  marker, the bots' figures, armour bars. Each bot is named with its style,
  "Stürmer" (runs at you) or "Kreisler" (circles, then dashes); the styles
  alternate between the bot seats. Steering: WASD or arrow keys, dash with
  Space. **Ram:** a dash that touches another figure ends there; the rammer
  flashes yellow and "Rammstoß!" (you rammed) or "Gerammt!" (you were rammed)
  appears for a moment. A figure that takes a hit flashes red. After the round
  you draw again; lost rounds give more ink. First to 3 wins.
- **Solo:** draw the hero, then the thrown weapon, then the enemy of the wave
  and its stake. Under the three stake buttons one line says what the chosen
  stake does: number of enemies, armour of each, "Schaden x…" and "Tempo x…"
  (stake x1.5 gives x1.25 and x1.1, stake x2 gives x1.5 and x1.2) and "Beute"
  (ink per fallen enemy). Fight; between waves a small shop (heal 35 %, more
  ink, new colour); after wave 5 the boss built from your enemy drawings.
- Esc or the "Menü" button leads back to the menu (during a fight without a
  question).

## Checklist for the first look

1. Console: no compile errors, and the self-check line is there.
2. Menu text is readable and the German umlauts are correct; the self-check
   line names `ink-tuning-2`.
3. Drawing: the cell under the mouse pointer is the one that gets painted (not
   mirrored or shifted), strokes have no gaps, the ink meter and stats change
   while drawing, the pale colour marks cells that drip off, thin strokes
   carry the yellow blade tint and the tint is readable on all four colours.
4. The stat panel fits the right column (no cut-off or overlapping text, also
   with the stake buttons on the enemy screen and in a narrow window).
5. The question box appears over the canvas, and nothing is painted while it
   is open.
6. Ring clock: counts down in real seconds and starts the round at 0.
7. Fight: the figure looks like the drawing with the canvas top as its front,
   it turns toward the steering direction, "up" on the keyboard moves it up on
   the screen, and it is not mirrored.
8. The floor disc is where the ring really is: a figure is out when its centre
   leaves the paper.
9. The fight runs at an even speed (60 simulation ticks per second regardless
   of the frame rate). Thin figures do not pass through each other.
10. A dash into a figure stops at the contact and shows the yellow flash.
11. Solo: thrown weapons fly at the nearest enemy, dark ink drops can be
    picked up, the wallet counts up by the "Beute" value.
12. Optional: gamepad stick and A button; touch on a device (left half steers,
    right half dashes).

## If it does not compile or does not start

Please report:

- the Unity version;
- the **complete red Console text** of the first errors (select the line, copy
  the lower pane including file name and line number), or a screenshot;
- if the game shows "Inkweight konnte nicht starten", the text on screen;
- if the menu shows "Kern-Selbsttest FEHLGESCHLAGEN", the text behind it. This
  means the arithmetic of that build differs from the reference, which must be
  known before any online or replay feature is built on the core;
- for visual problems, a screenshot and which checklist item it is.

Known places where the first opening may complain (all untested here):

- `Packages/manifest.json` names the built-in module
  `com.unity.modules.inputlegacy`. If the chosen Unity version no longer ships
  it, the Package Manager says so in the Console; report it.
- `Inkweight.Runtime.asmdef` names the assembly `Unity.InputSystem`, which only
  exists when the Input System package is installed. Unity is expected to
  ignore the missing optional reference (this is the usual pattern for optional
  packages). If it does not, report the message.

## Input: why it is read this way

Unity projects can use the old Input Manager, the Input System package, or
both, and code written for one does not compile or throws with the other. The
Human has not chosen yet, so `InkInputReader.cs` does this:

- **Mouse and keyboard always come from immediate-mode GUI events**
  (`Event.current` in `OnGUI`). These are delivered with every input setting,
  so the game is playable in all cases.
- **Gamepad and multi-touch** are added by conditional compilation:
  `ENABLE_LEGACY_INPUT_MANAGER` (Unity sets it when the old manager is active)
  uses `UnityEngine.Input`; `ENABLE_INPUT_SYSTEM` (Unity sets it when the new
  backend is active) together with `INKWEIGHT_INPUT_SYSTEM` (set by a version
  define in the assembly definition only when the package is installed) uses
  `UnityEngine.InputSystem`.

Type names that exist in both `UnityEngine` and `UnityEngine.InputSystem` (for
example `TouchPhase`) are written fully qualified in that file; the short name
is a compile error (CS0104) when both backends are active.

The package manifest does not add the Input System package: the prototype does
not need it, and adding it triggers a restart dialogue.

## Core tests without Unity

Needs the .NET 8 SDK (`dotnet`), nothing else; no package is downloaded.

```text
cd Projects/Inkweight/Source/Unity
dotnet run --project CoreTests                  # golden vectors and traces, bit for bit
dotnet run --project CoreTests -- --generate    # after a tuning or golden change
./check_runtime_against_stubs.sh                # Runtime files against engine stubs (not Unity)
```

What `check_runtime_against_stubs.sh` can and cannot find: it compiles the
Runtime files against `EngineStubs/UnityEngineStubs.cs` in four input variants
and runs a headless smoke test, so it finds C# errors, wrong use of the core
and errors in the game's own flow. It cannot find a wrong engine member name
(the stubs were written from memory), wrong engine behaviour, or a name clash
with a real engine or package type that the stubs do not list. The first
review found exactly such a clash (`TouchPhase`); the stubs now list the
clashing names known to us, but not the full namespaces.

`CoreTests` compiles the very same source files that Unity compiles (no copy),
with the C# language version limited to 9. It checks every field of the 59
stat vectors exactly and every checkpoint of the 17 simulation traces (state
hash layout 2, positions, velocities, armour; bot styles, tuning overrides,
redraw upgrades and the per-trace checkpoint interval are taken from the trace
file) bit for bit, the version 2 rules the golden files cannot show (figure
check, the two thrown errors, stake helpers), plus the determinism rules of
the source text itself (no `float`, only `Math.Sqrt` and `Math.Floor`, no
engine type). Run it in both configurations:
`dotnet run --project CoreTests` and `dotnet run -c Release --project CoreTests`.

### After the tuning numbers or golden files change

The C# core holds no number of its own. It reads the tuning through its own
small JSON reader (`InkJson.cs`, `InkTuning.cs`), and the tests read
`Source/Shared/ink_tuning.json` and `Source/Shared/golden/*.json` directly.
Unity cannot read files outside its project folder in a build, so a script
embeds the tuning text, the example drawings and the self-check hashes in
`Core/Generated/InkGenerated.cs`. After every change of the shared files:

```text
dotnet run --project CoreTests -- --generate
dotnet run --project CoreTests
```

The test "generated file is up to date" fails until the first command has been
run, so a stale Unity project cannot go unnoticed.

Steps after any later re-tuning or core correction, in this order:

1. The JavaScript side first: change `Source/Shared/ink_tuning.json` (and the
   JavaScript core if a rule changes) and regenerate the golden files there
   (`WebPrototype/tools/gen_golden.js`).
2. If a rule changed (not only a number): port the same change into
   `Assets/Inkweight/Core`, same order of operations. If a tuning key was
   added or removed, add or remove it in `InkTuning.cs` (a missing key makes
   the reader throw "JSON: missing key ...", it never falls back to a default).
3. `dotnet run --project CoreTests -- --generate` (embeds the new tuning text,
   example drawings and self-check hashes).
4. `dotnet run --project CoreTests` and `dotnet run -c Release --project
   CoreTests`: both must end with `RESULT: PASS`.
5. `./check_runtime_against_stubs.sh` must end with `STUB CHECK: PASS`.
6. In Unity: let it recompile, press Play, read the self-check line in the
   menu (new tuning name, "bestanden"). Delete `CoreTests/bin`, `CoreTests/obj`,
   `EngineStubs/bin` and `EngineStubs/obj` afterwards if they should not stay.

A number-only re-tuning needs steps 1 and 3 to 6 and no C# edit. The stat bar
ends on the drawing screen are computed from the tuning except the armour bar
end (300 at 220 ink, taken from `CHANGES_V2.md` C2), which is a constant in
`InkweightGame.ArmourFraction`.

Why a reader and a generated text instead of generated number constants: one
code path for tests and game, a re-tuning never needs a hand edit, and the
tuning could later be loaded from a file at run time (for example for a tuning
screen) without touching the core.

## Engine members the Runtime files use

The list below was collected by reading the Runtime sources (the stubs in
`EngineStubs/UnityEngineStubs.cs` declare these members and a few neighbours).
No engine member was added for rules version 2:

- `MonoBehaviour` (`Awake`, `Update`, `OnGUI`, `OnApplicationFocus`),
  `GameObject` (constructor with name, `AddComponent<T>`, `SetActive`,
  `transform`), `Object.Destroy`, `Object.DontDestroyOnLoad`, `Transform`
  (`SetParent(Transform, bool)`, `position`, `rotation`, `localScale`),
  `RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType)`.
- `Camera` (`orthographic`, `orthographicSize`, `clearFlags`,
  `backgroundColor`, `depth`), `CameraClearFlags.SolidColor`.
- `Texture2D(int, int, TextureFormat, bool)`, `TextureFormat.RGBA32`,
  `SetPixels32`, `SetPixel`, `Apply(bool)`, `filterMode`, `wrapMode`,
  `FilterMode.Point` / `Bilinear`, `TextureWrapMode.Clamp`.
- **`Sprite.Create(Texture2D, Rect, Vector2, float, uint, SpriteMeshType)`**
  (the six-argument overload: texture, rectangle, pivot, pixels per unit,
  extrude 0, mesh type) with **`SpriteMeshType.FullRect`**; `SpriteRenderer`
  (`sprite`, `color`, `sortingOrder`, `enabled`).
- `GUI.Label(Rect, string, GUIStyle)`, `GUI.Button(Rect, string, GUIStyle)`,
  `GUI.Box(Rect, string)`, `GUI.DrawTexture(Rect, Texture)`, `GUI.color`,
  `GUI.enabled`, `GUI.matrix`, `GUI.skin.label` / `.button`, `GUIStyle`
  (copy constructor, `fontSize`, `wordWrap`, `fontStyle`, `alignment`,
  `normal.textColor`), `FontStyle.Bold`, `TextAnchor.MiddleCenter`,
  `Matrix4x4.TRS`, `Event.current` (`type`, `button`, `mousePosition`,
  `keyCode`, `Use()`), `EventType`, `KeyCode`.
- `Screen.width` / `height`, `Time.unscaledDeltaTime`, `Debug.Log` /
  `LogError`, `Mathf.Sqrt` / `Atan2` / `Clamp01` / `Rad2Deg`, `Vector2`,
  `Vector3`, `Quaternion.identity` / `Euler`, `Color`, `Color32`, `Rect`
  (`Contains`).
- Conditional input: `UnityEngine.Input` (`touchCount`, `GetTouch`, `GetKey`,
  `GetAxisRaw`), `UnityEngine.TouchPhase`; `UnityEngine.InputSystem`
  (`Keyboard.current`, `Gamepad.current`, `Touchscreen.current` and their
  controls) as written in
  `InkInputReader.cs`.

## Known limits of the prototype layer

- The HUD is immediate-mode GUI and is meant to be replaced.
- Only seat 0 is human; the other Ring seats are bots with example drawings.
- The Ring drawing clock is real time from the first stroke; there is no
  setting to switch it off other than `ring.drawTimeSeconds` 0 in the tuning.
- Blade marks are shown on the drawing screen only, not on the figures in the
  fight. Damage numbers are not shown.
- The question before discarding is asked on the drawing screen only; leaving
  a running fight with Esc or "Menü" does not ask.
- No sound, no paper look or wobble yet.
- Touch steering and gamepad are written but untested.
- Bit-identical results are proven on .NET 8 (x64) only. Unity's Mono and
  especially IL2CPP builds for ARM devices (phones, consoles) compile the same
  code with other compilers, which are allowed to merge a multiplication and an
  addition into one fused operation. The self check in the menu shows whether a
  given build is affected.
