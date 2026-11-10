# Work Order UR-ENGINE-UNITY-V1 — Engine comparison, stage 2: the scene in Unity

Project: Underreign (DEC-041). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.
A parallel order (UR-ENGINE-UNREAL-V1) builds the same scene in Unreal Engine;
never touch its folders.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-ENGINE-UNITY-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-ENGINE-UNITY-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-ENGINE-UNITY-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-ENGINE-UNITY-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

UD-46: the engine (Unity or Unreal) is chosen by the Human after a fair,
side-by-side comparison of the same scene with the same camera. UD-36: Unity
uses URP for now; the comparison should still show Unity at its realistic best
for this scene. UD-35 approves the Unity graphics add-ons and Unity 6.6.

## Input (read-only)

`C:/GameDev/Underreign/EngineComparison/Kit/`: read `SCENE_SPEC.md`,
`SCENE_LAYOUT.json` (Unity values pre-converted), `export/` (FBX and textures),
`preview/` (Blender reference, not the target), and
`Evidence/UR-ENGINE-KIT-V1/WORKER_RESULT.md` (hints: verify `UR_AxisMarker.fbx`
first; URP needs Forward+ and shadows on additional lights).

## Tasks

1. Create two Unity 6000.6.4f1 projects
   (`C:\Program Files\Unity\Hub\Editor\6000.6.4f1-x86_64\Editor\Unity.exe`):
   `EngineComparison/Unity/URP` (Universal Render Pipeline, Forward+) and
   `EngineComparison/Unity/HDRP` (High Definition Render Pipeline). Packages
   only from the Unity registry. Add a `.gitignore` inside
   `EngineComparison/Unity` for Library, Temp, Logs, UserSettings, obj and
   build output. Run Unity in batch mode or minimised; never put a window in
   front of the Human; one Unity instance per project folder at a time.
2. Import the kit identically into both (copy the needed FBX and textures into
   each project's `Assets/Kit`, keeping file names), verify the axis marker,
   then build the scene from `SCENE_LAYOUT.json` by an editor script (no hand
   placement), with all lights, emissive strengths and both cameras.
3. Tune each pipeline honestly to look its best for this scene within
   `SCENE_SPEC.md` (exposure, tonemapping, bloom, ambient occlusion, shadow
   quality, URP: adaptive probe volumes if they help; HDRP: screen-space global
   illumination and volumetric light if they help). The dig moment needs light
   that reaches the fresh tunnel once the wall is removed at t = 4 s; use what
   each pipeline can do in real time and say plainly what it cannot.
4. Captures for each project, in `EngineComparison/Unity/Captures/<URP|HDRP>/`:
   - stills 1920 × 1080 PNG: `cam_overview_before.png`, `cam_overview_after.png`,
     `cam_close_before.png`, `cam_close_after.png` (before = t 3.9 s, after =
     t 4.5 s);
   - clips as PNG sequences at 1280 × 720, 30 fps, 10 s, following the clip spec
     for both cameras: `clip_overview/0000.png …`, `clip_close/0000.png …`.
   Captures are rendered from the game view, not the editor scene view.
5. Performance: a Windows development build of each scene (outside Git, in
   `EngineComparison/Unity/Builds/`, ignored), run for 20 s at 1920 × 1080 with
   the overview camera, minimised if possible; report average and worst frame
   time and the GPU name. If a windowed run is unavoidable, keep it short.
6. Write `EngineComparison/Unity/RESULT.md` and
   `Evidence/UR-ENGINE-UNITY-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-ENGINE-UNITY-V1/WORKER_RESULT.md`
   (Studio): what was built, settings per pipeline, what each can and cannot do
   for the dig moment, performance, package list, open issues.

## Limits

- External allowed: `EngineComparison/Unity`, `Evidence/UR-ENGINE-UNITY-V1`.
  Studio allowed: `Artifacts/Underreign/Evidence/UR-ENGINE-UNITY-V1`.
  `EngineComparison/Kit` and everything else is read-only.
- Do NOT commit (the Director commits both engines together). No push.
- No Asset Store packages, no third-party downloads; Unity registry packages
  only. No changes to Hearthlands folders or any other `C:\GameDev` folder.
- Report honestly; do not hide where Unity falls short.
