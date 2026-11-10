# Work Order UR-UNREAL-SETUP-V1 — Unreal project for the prototype, greybox layers and layer camera

Project: Underreign (DEC-041, DEC-043 Unreal Engine 5). Director: Claude
(orchestration only). Worker: one separate Claude Code subagent. Execution
mode: Production. Class: Standard. Parallel orders today: UR-SIM-CPP-PORT-V1
(folder `SimulationCpp`) and UR-UNREAL-BREAKDOWN-V1 (planning document); never
touch their paths.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-UNREAL-SETUP-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-UNREAL-SETUP-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-UNREAL-SETUP-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-UNREAL-SETUP-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

DEC-043: Underreign uses Unreal Engine 5.8 (`C:\Program Files\Epic Games\UE_5.8`),
C++ and Python editor scripting, Blueprints only where unavoidable. The
prototype (UD-21, UD-34, UD-37, UD-47) is greybox, three layers, one layer in
focus. Human (2026-11-10): work locally today with as many Workers as sensible.

## Read first

`Design/Planning/PROTOTYPE_PLAN.md` (controls, layer view, greybox colour code),
`Design/Art/ART_DIRECTION_BRIEF.md` and `Design/Art/greybox/`,
`Simulation/Maps/` (the Cinder Hollow text map format and file),
`Design/Snapshot/DISCOVERY_DECISIONS.md` (UD-37 thick rock between layers, UD-47
fixed breakthrough points), and `EngineComparison/Unreal/RESULT.md` (proven
headless build, render and Python steps on this PC).

## Tasks

1. Create a C++ Unreal 5.8 project `C:/GameDev/Underreign/Game/Underreign`
   (game module `Underreign`; an empty second runtime module `UnderreignSim`
   reserved for the ported simulation, which another Worker writes in
   `SimulationCpp`). Nested `.gitignore` (Binaries, Intermediate, Saved,
   DerivedDataCache, build output) and `.gitattributes` (`.uasset`/`.umap` in
   Git LFS) inside `Game`. Build with UnrealBuildTool from the command line
   (`Build.bat`), limit parallel actions to 8 (another Worker compiles at the
   same time). Lumen and Nanite on, as in the comparison.
2. **Greybox map from data**: a C++ actor that reads the Cinder Hollow text map
   and builds the three layers with instanced meshes (engine basic shapes,
   greybox colour code from the plan), thick rock slabs between layers, the
   fixed breakthrough points with stairs, the Heart, room areas, lava.
3. **Layer view camera** (plan section on controls): oblique top-down; the
   focused layer sharp, layers above cut away, the layer below faintly
   visible; keys to step a layer up/down; pan, rotate in 90° steps, zoom; a
   side view for shafts. Enhanced Input set up in C++ (input assets created by
   Python editor script if needed).
4. **Minimal HUD** in C++ (Slate or UMG via C++): current layer, a clock, gold
   placeholder.
5. **Proof**: headless screenshots (the comparison's offscreen route) of the
   overview on each of the three layers and one side view, 1920 × 1080, into
   `Game/Captures/`; a short PNG sequence (5 s, 30 fps, 1280 × 720) stepping
   down through the layers; frame time of a 20 s `-game` run.
6. `Game/README.md` (build, run, structure) and
   `Evidence/UR-UNREAL-SETUP-V1/WORKER_RESULT.md` (external) plus
   `Artifacts/Underreign/Evidence/UR-UNREAL-SETUP-V1/WORKER_RESULT.md` (Studio).

## Limits

- External allowed: `Game`, `Evidence/UR-UNREAL-SETUP-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-UNREAL-SETUP-V1`. Everything else read-only.
- Do NOT commit or push (the Director commits after review). No downloads, no
  Fab content. Never a window in front of the Human; one Unreal editor process
  at a time.
- No game rules here: the layout comes from the map file only; simulation
  logic arrives later from `SimulationCpp`.
