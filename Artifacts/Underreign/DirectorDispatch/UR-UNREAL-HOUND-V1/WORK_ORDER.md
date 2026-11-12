# Work Order UR-UNREAL-HOUND-V1 — The Brand-hound in the game: accepted walk and development bite

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-UNREAL-HOUND-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-UNREAL-HOUND-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-UNREAL-HOUND-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-UNREAL-HOUND-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact)

Verdict on UR-CREATURE-VIDEO-V4 (2026-11-12): "Gehen ist jetzt gut. Würde ich so im finalen Spiel sehen. Angriff kann auch für die Entwicklung ins Spiel rein, später nochmal angepasst werden um es energischer, gefährlicher zu gestalten. Jetzt wirkt es etwas "lustlos. Vom Ablauf her aber flüßig und nachvollziehbar."

Request (2026-11-12): "den Hund mit dem abgenommenen Gang und dem Entwicklungs-Biss ins Unreal-Spiel bringen". Approval of this order: "Go".

## Background (read first, external repository `C:/GameDev/Underreign`)

- `Game/README.md` (build, asset setup, frame caps), `Game/Scripts/*`.
- `StyleSample/Creatures/BrandHound/IMPORT_NOTE.md` (mesh, skeleton, textures,
  material recipe, import settings, forward axis).
- `Evidence/UR-CREATURE-VIDEO-V4/WORKER_RESULT.md` (the accepted walk and the
  bite; where they live).
- Source of the accepted motion: the V4 actions in
  `C:/GameDev/Underreign_Assets/AnimWork/UR-CREATURE-VIDEO-V4/out/BrandHoundVideo.blend`
  (cross-check against `StyleSample/Creatures/BrandHoundVideo/Source/BrandHoundVideo.blend`
  and the V4 previews; use exactly the walk and bite the Human judged).
  Mesh, textures and idle: `StyleSample/Creatures/BrandHound/` (V2 mesh, same skeleton).
- How creatures are drawn today: `Game/Underreign/Source/Underreign/Private/URPlayView.cpp`
  (creature `TypeIndex` 0 = Brand-hound, a low long box).

## Tasks

1. **Export** (Blender 5.2 in background mode only) the V4 walk and V4 bite as
   skeleton-only FBX at 30 fps against the unchanged skeleton, into
   `Game/Art/Creatures/BrandHound/` (source folder in the game tree, not Unreal
   content; record the export script there). Do not change the motion.
2. **Import** into the game's Unreal project with Python editor scripting
   (headless, no editor window): skeletal mesh, skeleton, textures, material
   (recipe from the import note; emissive start value from the note), and the
   animations Walk (V4), Bite (V4), Idle (existing V2 idle). Content under
   `Game/Underreign/Content/Creatures/BrandHound/`. Make the import repeatable
   (extend `Game/Scripts/setup_assets.py`/`.sh` or add a sibling script).
3. **Use it in the game** for creature type Brand-hound only (all other
   creatures, cinderlings and intruders stay greybox):
   - a skeletal mesh per drawn Brand-hound instead of the box, facing its
     movement direction (smooth turn), standing on the floor;
   - moving: the V4 walk; play rate matched to the hound's on-screen ground
     speed so the paws do not slide (also at game speed 2x / 4x; when paused the
     animation pauses). If the needed rate leaves roughly 0.7–1.4 of the
     authored speed, keep walk anyway, report the numbers, and do not
     substitute trot or run (not accepted by the Human);
   - attacking (when the rules report a Brand-hound attack/hit): the V4 bite,
     once per attack, facing the target, then back to idle or walk with a short
     blend;
   - standing: the V2 idle;
   - keep selection, tooltips, health bars, outlines and all game-layer
     markers working for the hound;
   - scale: keep the hound's own proportions; choose a starting scale that
     reads well in the game camera and fits the cell grid, report it with a
     still next to a cinderling and an Oath-warden placeholder. Size is a look
     question for the Human: do not decide it beyond this starting value.
   - performance: several hounds at once (at least 8) must stay smooth; no
     Nanite on the skinned mesh; report frame time.
4. **Rules unchanged.** Do not touch `SimulationCpp` or
   `Game/Underreign/Source/UnderreignSim`. No rule, number or map changes.
5. **Proof (function check only; small visual change):** build passes; the
   existing Automation tests stay green (run them, do not extend them); one
   gentle-mode start. Capture from the game camera a short, sharp MP4 and GIF
   (frame-capped, offscreen) where hounds walk, stand and bite intruders;
   one close-up of a walking hound to show the paws do not slide; one still
   for the scale. Look at the moving result yourself at full frame rate.
6. Write `Evidence/UR-UNREAL-HOUND-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-UNREAL-HOUND-V1/WORKER_RESULT.md`
   (Studio, same content plus the verify-worker line), listing every changed
   file, the play rates, the scale, the frame times and where the videos are.
   Update `Game/README.md` and `Game/SPIELANLEITUNG.md` (German, one plain
   line: the Brand-hound now has its real model).

## Limits

- External allowed: `Game/Art/Creatures/BrandHound`,
  `Game/Underreign/Content/Creatures`, `Game/Underreign/Source/Underreign`,
  `Game/Underreign/Config`, `Game/Scripts`, `Game/Captures`, `Game/README.md`,
  `Game/SPIELANLEITUNG.md`, `Evidence/UR-UNREAL-HOUND-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-UNREAL-HOUND-V1`. Work files only under
  `C:/GameDev/Underreign_Assets/AnimWork/UR-UNREAL-HOUND-V1` (absolute paths;
  nothing directly under `C:/`). `StyleSample`, the V4 work folder and
  `C:/GameDev/AnimTools` are read-only. Never touch any Hearthlands folder or
  other `C:/GameDev/*` project.
- GPU: the Human's PC switches off under full GPU load. Every Unreal run is
  frame-capped (30 fps for captures), offscreen or minimised, short, no
  benchmark mode, no path tracing, below-normal priority, limited shader
  compile workers (see `Game/Scripts/common.sh`). Blender renders on the CPU.
  No window in front of the Human, no video playback with sound.
- No network, no Seedance, no Meshy, no uploads. Do not use third-party assets.
- Report instead of silently changing the goal if something cannot be solved.
- Do NOT commit or push.
