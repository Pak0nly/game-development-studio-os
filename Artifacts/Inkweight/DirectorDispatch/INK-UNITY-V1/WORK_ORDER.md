# Work Order INK-UNITY-V1 — Unity project with a C# port of the ink core

Project: Inkweight (DEC-044). Director: Claude (orchestration only). Worker: one
separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python3 -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py verify-worker --root . --manifest Artifacts/Inkweight/DirectorDispatch/INK-UNITY-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Inkweight/DirectorDispatch/INK-UNITY-V1/WORK_ORDER.md --capabilities Artifacts/Inkweight/DirectorDispatch/INK-UNITY-V1/CAPABILITIES.json --receipt Artifacts/Inkweight/DirectorDispatch/INK-UNITY-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human authority (exact, 2026-11-19)

"Ja. Du hast bis 9 Uhr Zeit daran zu arbeiten. Gerne mit Unity3D als
Zielplattform um es auch mobile und Webtauglich zu bekommen wenn nötig.
Hauptziel bleibt Steam. [...] Ziel ist ein spielbarer Prototyp, oder zumindest
die Vorbereitung dessen."

## Read first

`Projects/Inkweight/Docs/GAME_CONCEPT.md`, `INK_RULES_V1.md`, `OPEN_DECISIONS.md`
(OD-03), `Projects/Inkweight/Source/Shared/RULES_AS_BUILT.md`,
`Projects/Inkweight/Source/WebPrototype/core/README.md`, the JavaScript core and
the golden files under `Projects/Inkweight/Source/Shared/golden/`.

## Situation you must respect

The Unity Editor is not available in this cloud container and must not be
installed (it needs the Human's licence and its own approval). Nothing that
needs the Editor can be verified tonight. The order is therefore built so that
as much as possible is verified without it, and the rest is small, simple and
honestly marked as unverified.

## Tasks

1. **C# core port** in `Projects/Inkweight/Source/Unity/Inkweight/Assets/Inkweight/Core/`:
   a faithful port of the JavaScript core (drawing, body, stats, collision,
   step, Ring, solo arena, bots, seeded generator) as plain C# with **no
   reference to UnityEngine or UnityEditor** (own small vector struct, `double`
   math, only `+ - * /` and `Math.Sqrt` in the simulation). Language level and
   APIs that Unity 6 accepts (C# 9, .NET Standard 2.1; no newer language or
   library features). The tuning JSON is read through a tiny own reader or a
   generated C# constants file created by a script from
   `Source/Shared/ink_tuning.json`; say which and why. An assembly definition
   file for the core with no engine references.
2. **Core tests without Unity** in `Projects/Inkweight/Source/Unity/CoreTests/`:
   a .NET test project that compiles the very same core source files and checks
   them against `stat_vectors.json` (exact) and `sim_traces.json` (bit for bit
   if the JavaScript core kept to the allowed operations, otherwise with the
   stated tolerance). Use the .NET SDK if present; if it is missing you may
   install it only inside this disposable cloud container (ID-06), for example
   `apt-get update && apt-get install -y dotnet-sdk-8.0`; nothing else is
   installed. If the test framework cannot be restored from the package
   registry, write a plain console test runner instead. If .NET cannot be
   installed at all, still write the code and tests carefully and say so. The
   root `.gitignore` ignores `*.csproj`: add a `.gitignore` inside
   `Projects/Inkweight/Source/Unity` that re-includes the test project file.
3. **Unity presentation layer** in `.../Assets/Inkweight/Runtime/` (needs the
   Editor, so keep it small, conventional and defensive): one bootstrap that
   builds everything at runtime from code (camera, canvas texture, sprites
   generated from drawing cells, HUD), so that opening the project and pressing
   Play in any scene works without prefabs, scene wiring or imported assets;
   drawing with mouse and touch on the 32 x 32 canvas with the ink meter and
   live stats; the Ring against bots and the solo arena, both driven by the
   core's step function; keyboard, gamepad and touch steering. Prefer the most
   stable, long-lived engine features (for example immediate-mode GUI for the
   prototype HUD, `Texture2D` pixel writes for the canvas). Read input in a way
   that compiles whether the project uses the old input manager or the Input
   System package; explain the choice. German player-facing text.
4. **Project files**: `Packages/manifest.json` with only what is needed; do not
   write a `ProjectVersion.txt` (the Human picks the Unity version, OD-03; the
   Studio baseline is Unity 6.3 LTS). No `.meta` files unless you can explain
   why they are safe to hand-write (Unity creates them on first import).
5. **Static check of the Unity layer**: since it cannot be compiled against the
   engine here, add a small script that compiles the Runtime files against
   hand-written minimal stubs of exactly the engine types and members they use
   (kept outside `Assets`, for example in `Source/Unity/EngineStubs/`), so
   syntax and core-API usage are at least compiler-checked. State clearly that
   stubs prove nothing about real engine behaviour, and list every engine API
   used with the Unity documentation name so the Human or a later order can
   check it.
6. **Open-in-Unity guide** `Projects/Inkweight/Source/Unity/README.md`: how to
   open the project (Unity Hub, choose the version), what should happen on Play,
   a short checklist of what to look at first, and what to report back if it
   does not compile (the Console text).
7. **Evidence** `Artifacts/Inkweight/Evidence/INK-UNITY-V1/`: `WORKER_RESULT.md`
   (verify-worker line, what was built, test commands and real output, a table
   "verified here / not verifiable here", the engine API list, anything not done).

## Allowed mutations

Only explicitly listed mutations are authorised; everything else is out of
scope: `Projects/Inkweight/Source/Unity`,
`Artifacts/Inkweight/Evidence/INK-UNITY-V1`.

## Task-specific controls

- Capability Knowledge Base query: Inkweight has no capability index or native
  capability atlas yet (OD-09). Strongest existing options considered: Unity
  built-in features only (2D textures and sprites, immediate-mode GUI, built-in
  input); no Asset Store product and no new dependency. Selected: built-in
  features plus the engine-free core, because the same core is already verified
  in JavaScript and can be verified in C# without the Editor. Rejected: Unity
  2D physics for the fights (it would behave differently from the verified core
  and cannot be tested tonight); it stays an option for later disciplines.
  Decision-critical unknown: real behaviour in the Editor; refresh action: the
  Human opens the project. Expected technical debt: the prototype HUD is
  immediate-mode GUI and will be replaced.
- Planned setup: .NET SDK check or install inside the container. Candidate-
  attempt start condition: core tests run. Candidate-attempt allowance: one
  candidate. Operational-recovery allowance: Core default. Formal
  stage-correction allowance: 2 rounds. Task-owned namespaces: the allowed paths.
- The JavaScript core, the shared files and the golden files are read-only. If
  a golden value looks wrong, report it exactly; do not change it.
- No Unity Editor, no Asset Store, no other downloads or installs.
- You may use subagents in parallel for independent files.
- Time: check `date -u`; aim to return within about 120 minutes and at the
  latest after 150 minutes, with an honest list of what is unfinished. Order of
  priority: core port with passing vector tests, then the presentation layer.
- Do NOT commit or push.

## Success

The C# core passes the golden vectors and traces with real output shown; the
Unity layer compiles against the stubs; the guide lets the Human open the
project and know what to expect; every unverified part is named.

## Stop

Stop and report on verify-worker failure, any need outside the allowed paths,
or a protected change.
