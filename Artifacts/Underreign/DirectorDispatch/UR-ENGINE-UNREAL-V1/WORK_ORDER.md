# Work Order UR-ENGINE-UNREAL-V1 — Engine comparison, stage 2: the scene in Unreal Engine

Project: Underreign (DEC-041). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.
A parallel order (UR-ENGINE-UNITY-V1) builds the same scene in Unity; never
touch its folders.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-ENGINE-UNREAL-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-ENGINE-UNREAL-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-ENGINE-UNREAL-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-ENGINE-UNREAL-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

UD-46: the engine (Unity or Unreal) is chosen by the Human after a fair,
side-by-side comparison of the same scene with the same camera. Unreal Engine
5.8 is already installed at `C:\Program Files\Epic Games\UE_5.8`. The Human
accepts Unreal's 5 % royalty above USD 1 million.

## Input (read-only)

`C:/GameDev/Underreign/EngineComparison/Kit/`: read `SCENE_SPEC.md`,
`SCENE_LAYOUT.json` (Unreal values pre-converted), `export/` (FBX and
textures; packed ORM maps exist; normal maps need "Flip Green Channel"),
`preview/` (Blender reference, not the target), and
`Evidence/UR-ENGINE-KIT-V1/WORKER_RESULT.md` (verify `UR_AxisMarker.fbx` first).

## Tasks

1. Create a blank Unreal 5.8 project without C++ (Blueprint/Python only) at
   `EngineComparison/Unreal/UnderreignCompare` (use the engine's blank
   template). Enable the Python Editor Script plugin and Movie Render Queue.
   Add a `.gitignore` inside `EngineComparison/Unreal` for Binaries,
   Intermediate, Saved, DerivedDataCache and build output. Run the editor
   headless (`UnrealEditor-Cmd.exe`, `-RenderOffscreen`, `-unattended`) where
   possible; never put a window in front of the Human.
2. Import the kit by Python (Interchange or FBX import) into `/Game/Kit`,
   verify the axis marker, then build the level from `SCENE_LAYOUT.json` by
   script (no hand placement), with all lights, emissive strengths and both
   cameras. Use the same textures; build materials that match the kit's PBR
   maps.
3. Tune honestly for its best look within `SCENE_SPEC.md`: Lumen global
   illumination and reflections, exposure (fixed, not auto, to match the spec),
   bloom, shadows, emissive contribution of the lava to Lumen. The dig moment:
   the wall is removed at t = 4 s (Sequencer), and the light floods the fresh
   tunnel; note how fast Lumen adapts.
4. Captures with Movie Render Queue (or high-resolution screenshots) in
   `EngineComparison/Unreal/Captures/Lumen/`:
   - stills 1920 × 1080 PNG: `cam_overview_before.png`, `cam_overview_after.png`,
     `cam_close_before.png`, `cam_close_after.png` (before = t 3.9 s, after =
     t 4.5 s);
   - clips as PNG sequences at 1280 × 720, 30 fps, 10 s, following the clip spec
     for both cameras: `clip_overview/0000.png …`, `clip_close/0000.png …`.
   Render the real-time result (no path tracer); anti-aliasing samples as a
   game would use them.
5. Performance: a packaged Windows development build or `-game` standalone run
   (outside Git, ignored) for 20 s at 1920 × 1080 with the overview camera,
   minimised or offscreen if possible; report average and worst frame time
   (`stat unit`) and the GPU name. If a windowed run is unavoidable, keep it
   short.
6. Write `EngineComparison/Unreal/RESULT.md` and
   `Evidence/UR-ENGINE-UNREAL-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-ENGINE-UNREAL-V1/WORKER_RESULT.md`
   (Studio): what was built, settings, how the dig moment looks, performance,
   project size on disk, open issues.

## Limits

- External allowed: `EngineComparison/Unreal`, `Evidence/UR-ENGINE-UNREAL-V1`.
  Studio allowed: `Artifacts/Underreign/Evidence/UR-ENGINE-UNREAL-V1`.
  `EngineComparison/Kit` and everything else is read-only.
- Do NOT commit (the Director commits both engines together). No push.
- No Fab or Marketplace assets, no downloads; engine content only plus the kit.
  No changes to Hearthlands folders or any other `C:\GameDev` folder.
- Report honestly; do not hide where Unreal falls short.
