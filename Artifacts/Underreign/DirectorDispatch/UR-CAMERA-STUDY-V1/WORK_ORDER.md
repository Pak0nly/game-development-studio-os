# Work Order UR-CAMERA-STUDY-V1 — Camera study for 2 m cells (Blender, CPU)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-CAMERA-STUDY-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-CAMERA-STUDY-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-CAMERA-STUDY-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-CAMERA-STUDY-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact, 2026-11-13)

On night-4 question 1 (cut height): "Anders | Notiz: Kamera Steuerung in DK2
researchen. Quergang zeigt keinen Unterschied bei 3 oder 1,5m. Dies liegt an
falscher Kamerastellung."

On the Director's proposal (render the same map section with several cameras
and rock-top looks, with a 90° turn per variant; choose from the pictures, then
change the game camera): "Ja"

## Parent decision and evidence threshold

Parent decision (the Human's): the game camera and wall presentation for 2 m
cells (camera distance, field of view, pitch, rotation; walls cut or full
height; rock-top look). Evidence: comparable renders of the same section that
make the difference visible, especially for a corridor running left to right.
This study changes nothing in the game.

## Background (external repo `C:/GameDev/Underreign`, main at 6042582)

- `Evidence/UR-NIGHT-04-V1/NIGHT_RESULT.md`, `Design/Art/ENVIRONMENT_KIT_2M.md`,
  `ArtSource/EnvironmentKit/README.md` (rebuild order),
  `ArtSource/EnvironmentKit/scripts/build_proof_scene.py` (the proof section of
  Cinder Hollow layer 2, cameras, lights) and `previews/proof/*`.
- The game camera today: `Game/Underreign/Source/Underreign/Public/URLayerCameraPawn.h`
  (pitch -58°, field of view 45°, default distance 32 m, min 9 m, max 90 m,
  90° yaw steps). The night renders used 55° and 35° field of view.
- Genre convention (Director, from play knowledge; no exact numbers known): a
  perspective camera close to the ground with a wide field of view, so corridors
  under the screen centre are seen from above and walls show toward the edges;
  walls at full height; rock tops lit and textured so the map reads as a
  landscape of rock blocks; frequent 90° turns. Use this as a general camera
  idea only; never copy the look of any existing game.

## Tasks

1. Use local Blender 5.2 (background mode, CPU, Cycles with few samples plus
   denoise) and the kit scripts unchanged (import or call them; put your own
   study script in `ArtSource/EnvironmentKit/scripts/camera_study/`). Build the
   same proof section as the night (with the 1.8 m human and the hound, now
   1.6 m long per the Human).
2. Render the same view centre (the T-junction with the left-right corridor) for:
   - **A** today's game camera (pitch 58°, FOV 45°, 32 m), walls cut 3 m and 1.5 m;
   - **B** close and wide (FOV about 65°, pitch about 60°, distance chosen so
     about 10–12 cells fit across the screen), walls cut 3 m and 1.5 m;
   - **C** like B with full 4 m walls, no cut;
   - **D** one more variant of your choice if it clearly helps (for example
     B steeper at 70°, or B with a lower FOV); say why.
   Each in two rock-top looks: today's dark cut cap, and a lit, textured rock
   top (the rock surface itself, slightly lighter than the walls, no glow). Same
   lights and exposure for all; the scene must not be so dark that walls
   disappear (state the light setup).
3. For A, B and C (lit tops): a short pan of about 4 s that includes one smooth
   90° turn around the view centre, as MP4 and GIF (sharp, about 1280 x 720,
   30 fps).
4. One contact sheet comparing all stills (labelled in plain German: camera,
   cut height, rock top), and a measurement per variant: how much of the floor
   of the left-right corridor is visible (percent of its area, from a mask
   render), and whether the human and the hound in it are visible.
5. Write `Evidence/UR-CAMERA-STUDY-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-CAMERA-STUDY-V1/WORKER_RESULT.md` (Studio,
   plus the verify-worker line): settings per variant, the visibility table,
   paths, a plain recommendation, and the Unreal values the recommended camera
   would need (pitch, FOV, distances, zoom limits). Delete your temporary frame
   folders.

## Limits

- External allowed: `ArtSource/EnvironmentKit/scripts/camera_study`,
  `ArtSource/EnvironmentKit/previews/camera_study`, `Evidence/UR-CAMERA-STUDY-V1`.
  Studio allowed: `Artifacts/Underreign/Evidence/UR-CAMERA-STUDY-V1`. Work files
  only under `C:/GameDev/Underreign_Assets/AnimWork/UR-CAMERA-STUDY-V1`. All other
  kit files, `Game`, `SimulationCpp`, `StyleSample` are read-only. Never touch
  any Hearthlands folder or other `C:/GameDev/*` project.
- CPU only, Blender in background mode, lowered priority via the process API;
  never launch anything through the Windows shell (no `start`, `explorer`,
  `Invoke-Item`, file associations). No Unreal. No window in front of the
  Human, no video playback with sound.
- Own content only; no network, no downloads, no AI services.
- Report instead of silently changing the goal if something cannot be solved.
- Do NOT commit or push.
