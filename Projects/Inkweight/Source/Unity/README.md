# Inkweight Unity Project: How to Open It and What to Expect

Work Order INK-UNITY-V1. Everything in this folder was written and tested
**without the Unity Editor** (it is not available in the cloud container). The
rules core is proven against the golden files outside Unity. The Unity
presentation layer has only been compiled and smoke-run against hand-written
stand-ins for the engine, which says nothing about real engine behaviour. The
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
| `EngineStubs/`, `check_runtime_against_stubs.sh` | compile and smoke check of the Runtime files against engine stand-ins (not Unity) |

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

If Unity asks about the Input System or "active input handling", either answer
works; see "Input" below.

## What should happen on Play

- A dark background and a menu: title "Inkweight – Prototyp", three buttons
  under "Ring gegen Bots" (2, 3, 4 figures), three buttons under "Solo-Arena".
- At the bottom of the menu: **"Kern-Selbsttest bestanden (111 Prüfpunkte
  bitgenau)"** (the number changes when the golden files are regenerated). The game replays two recorded fights from the golden files at
  start and compares the state hashes. The Console shows the same as
  `Inkweight: self check passed, 111 checkpoints bit-identical`.
- **Ring:** a drawing screen with a 32 x 32 paper canvas on the left and tools,
  ink meter and live stats on the right. Draw with the left mouse button (right
  button erases), or use "Beispiel laden" for an example. "In den Ring!" starts
  the round: a paper-coloured round floor that shrinks, your figure with a
  yellow marker, the bots' figures, armour bars. Steering: WASD or arrow keys,
  dash with Space. After the round you draw again; lost rounds give more ink.
  First to 3 wins.
- **Solo:** draw the hero, then the thrown weapon, then the enemy of the wave
  and its stake; fight; between waves a small shop (heal, more ink, new
  colour); after wave 5 the boss built from your enemy drawings.
- Esc or the "Menü" button leads back to the menu at any time.

## Checklist for the first look

1. Console: no compile errors, and the self-check line is there.
2. Menu text is readable and the German umlauts are correct.
3. Drawing: the cell under the mouse pointer is the one that gets painted (not
   mirrored or shifted), strokes have no gaps, the ink meter and stats change
   while drawing, the pale colour marks cells that drip off.
4. Fight: the figure looks like the drawing with the canvas top as its front,
   it turns toward the steering direction, "up" on the keyboard moves it up on
   the screen, and it is not mirrored.
5. The floor disc is where the ring really is: a figure is out when its centre
   leaves the paper.
6. The fight runs at an even speed (60 simulation ticks per second regardless
   of the frame rate).
7. Solo: thrown weapons fly at the nearest enemy, dark ink drops can be picked
   up, the wallet counts up.
8. Optional: gamepad stick and A button; touch on a device (left half steers,
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

The package manifest does not add the Input System package: the prototype does
not need it, and adding it triggers a restart dialogue.

## Core tests without Unity

Needs the .NET 8 SDK (`dotnet`), nothing else; no package is downloaded.

```text
cd Projects/Inkweight/Source/Unity
dotnet run --project CoreTests                  # golden vectors and traces, bit for bit
dotnet run --project CoreTests -- --generate    # after a tuning or golden change
./check_runtime_against_stubs.sh                # Runtime files against engine stand-ins
```

`CoreTests` compiles the very same source files that Unity compiles (no copy),
with the C# language version limited to 9. It checks every field of the 43
stat vectors exactly and every checkpoint of the 8 simulation traces (state
hash, positions, velocities, armour) bit for bit, plus the determinism rules of
the source text itself (no `float`, only `Math.Sqrt` and `Math.Floor`, no
engine type).

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

Why a reader and a generated text instead of generated number constants: one
code path for tests and game, a re-tuning never needs a hand edit, and the
tuning could later be loaded from a file at run time (for example for a tuning
screen) without touching the core.

## Known limits of the prototype layer

- The HUD is immediate-mode GUI and is meant to be replaced.
- Only seat 0 is human; the other Ring seats are bots with example drawings.
- No drawing time limit, no sound, no paper look or wobble yet.
- Touch steering and gamepad are written but untested.
- Bit-identical results are proven on .NET 8 (x64) only. Unity's Mono and
  especially IL2CPP builds for ARM devices (phones, consoles) compile the same
  code with other compilers, which are allowed to merge a multiplication and an
  addition into one fused operation. The self check in the menu shows whether a
  given build is affected.
