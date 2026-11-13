# Work Order UR-UNREAL-WALLSAMPLE-V1 — Wall sample in the game: 2 m cells, rock kit, free camera, see-through

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-UNREAL-WALLSAMPLE-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-UNREAL-WALLSAMPLE-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-UNREAL-WALLSAMPLE-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-UNREAL-WALLSAMPLE-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact, 2026-11-13)

"Wir können die Option, die Wandhöhe auf 1,5m zu reduzieren ins Spiel einbauen.
Wichtig dabei nur, dass der Spiel nicht drüber schauen kann wenn er in 1st Person
geht. Also dort wieder auf Höhe Wände gestellt wird."

"Mit der Option die Kamera frei zu drehen, wird den Spielern die Möglichkeit
gegeben alles sehen zu können. Dazu ein passender see through shader für
Kreaturen und wir können es erstmal so testen."

"Volle Drehung wie in DK2. Ja" — "1,5m hohe Wände sehen doof aus." (so full
height is the default; 1.5 m is only an option) — hound: 1.6 m long.

On the Director's two-order proposal (first the relief behind the cell edge, then
the wall sample in the game): "Die Struktur selbst ist auch gut. Sie ragt nur zu
sehr in den Gang hinein. Gerne go"

## Goal

A first playable look at real rock walls in the game, so the Human can judge
camera, walls and see-through by playing. The rules do not change.

## Background (read first, external repo `C:/GameDev/Underreign`)

- `Design/Planning/UNREAL_2M_AND_KIT_PLAN.md` (whole file): the file-by-file
  switch to 2 m and the planned orders 2M-01, -02, -03 (hound part), -04, -05. This
  order covers a reduced version of those; their shared rules (do not touch the
  rules, always green, safe runs, originality) apply.
- `Design/Art/ENVIRONMENT_KIT_2M.md` and `ArtSource/EnvironmentKit/README.md`
  (kit standard, names, pivots, slots; the new trimmed block-top classes
  `Open0`–`Open4` with yaw per rock cell, reference `build_proof_scene.block_class`
  and the `state` field in `placement/*.json`), `Evidence/UR-KIT-WALL-INSET-V1/WORKER_RESULT.md`
  (latest kit, cap-strip flicker risk at outer corners).
- `Evidence/UR-CAMERA-STUDY-V1/WORKER_RESULT.md` (camera recommendation: pitch
  about 70–72°, FOV about 65°, default about 17 m, zoom about 6–45 m; check whether
  Unreal's FOV is horizontal and convert; outlines for hidden units worked).
- `ArtSource/EnvironmentKit/unreal/setup_kit_proposal.py` (untested import
  proposal), `Game/Scripts/setup_hound.*` (import pattern), `StyleSample/README.md`
  step 4 and `StyleSample/Scripts/v2|v4/*` (the dark charred scanned rock,
  world-aligned material `M_Scan`).

## Tasks

1. **2 m greybox switch** (plan order 2M-01): geometry from single constants,
   cell 200, wall 400, slab 175, floor 25; the plan's acceptance numbers; the 1 m
   override reproduces today. Hound scale 0.55 -> 0.75 (1.6 m long, keep
   `-URHoundScale=`); unit spread and picking relative to the cell (2M-03 steps 1
   and 3 only; capture-director literals only as far as the proof runs below need).
2. **Kit import** (2M-04 reduced): one repeatable headless script
   `Game/Scripts/setup_kit.*` that imports the wall pieces needed for the sample
   (WallFace, WallOuter, WallInner, WallEnd, WallPillar, BlockTop incl. the Open
   classes; Full 4 m and Low 1.5 m heights; at least Stone and Soil, the rest if
   cheap), checks scale and pivots with the axis test file, Nanite on for opaque
   walls, no collision. Material: the style sample's dark charred scanned rock as
   a world-aligned material on the rock faces and tops (soot, contrast as in style
   sample step 4), the kit's stand-in textures only as a fallback. The scanned
   textures are licensed third-party content (DEC-025): local Unreal use only,
   rebuilt by script from the read-only library, git-ignored like in the style
   sample, never committed, never sent to any service.
3. **Wall placement from neighbour masks** (2M-05 reduced) behind a switch
   `-URKit` (default on for this sample build, `-URKit=0` gives the greybox), at
   least on Cinder Hollow layer 2 and better on all layers; `build_proof_scene.py`
   is the reference implementation (rotation tables, block-top class and yaw).
   Strata per rock cell where the kit has them, else Stone. Digging a cell rebuilds
   the right pieces. Floors may stay greybox.
4. **Camera:** free continuous rotation around the view centre, full 360°
   (replaces the 90° steps; keep Q/E as hold-to-turn and add a mouse drag, for
   example middle mouse; note the binding in `Game/SPIELANLEITUNG.md`); pitch and
   FOV defaults from the camera study, distances in cells for 2 m, overview still
   frames the whole map. Picking, markers and the HUD stay correct at any yaw.
5. **See-through for creatures:** units (own and enemy) hidden behind walls from
   the camera are drawn as a clear outline or silhouette in their side's colour
   (for example custom depth/stencil plus a post-process material); visible units
   look unchanged. It must read at default zoom.
6. **Wall-height option:** an options/setting entry (and a key, plus
   `-URWallLow=1`) switching the overview walls between full 4 m (default) and
   low 1.5 m (the kit's `Low` pieces). Build it as a per-view setting so that any
   close or first-person view always uses full height regardless of the option
   (there is no first-person view yet: add the rule in code and the README, and
   one test that forces full height in such a view mode).
7. **Proof (function check, not a deep test suite):** build passes, `sync_sim.py
   check` and `test_sim.sh` green, golden hashes unchanged, existing input/tool
   test passes, one gentle-mode start. Sharp captures from the game, frame-capped
   30 fps, offscreen: stills of Cinder Hollow layer 2 at default zoom (full and low
   walls; greybox vs kit, same camera); a ~6 s MP4 + GIF of a continuous 360° turn
   with creatures moving in corridors, showing the see-through; a close still of a
   corridor with the human-size placeholder and the 1.6 m hound. Frame times
   (game/GPU) at 30 fps capped, kit vs greybox. Look at the captures yourself
   (gaps, flicker at outer-corner caps, dark scenes) and report honestly.
8. Update `Game/README.md` (2 m geometry, kit switch, camera, see-through, wall
   option) and `Game/SPIELANLEITUNG.md` (controls, in German). The two existing
   starters `Game/Play Underreign.bat` and `Game/Play Underreign (Schonmodus).bat`
   must start the new sample (kit on, frame cap kept); add no new starter.
9. Write `Evidence/UR-UNREAL-WALLSAMPLE-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-UNREAL-WALLSAMPLE-V1/WORKER_RESULT.md`
   (Studio, plus the verify-worker line): changed files, numbers, capture paths,
   open points. Save build and capture logs in the external evidence folder.
   Delete your temporary frame folders.

If the whole scope does not fit, deliver in this order and report what is left:
1, 4, 5, 2, 3, 6. Never skip the proof for what you deliver.

## Limits

- External allowed: `Game/Underreign/Source/Underreign`, `Game/Underreign/Content`,
  `Game/Underreign/Config`, `Game/Scripts`, `Game/Captures`,
  `Game/README.md`, `Game/SPIELANLEITUNG.md`, `Game/Play Underreign.bat`,
  `Game/Play Underreign (Schonmodus).bat`, `Game/Underreign/.gitignore`, `.gitignore`,
  `Evidence/UR-UNREAL-WALLSAMPLE-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-UNREAL-WALLSAMPLE-V1`. Work files only under
  `C:/GameDev/Underreign_Assets/AnimWork/UR-UNREAL-WALLSAMPLE-V1`.
  `SimulationCpp`, `Game/Underreign/Source/UnderreignSim`, `ArtSource`,
  `StyleSample`, `Design` are read-only. Never touch any Hearthlands folder or
  other `C:/GameDev/*` project.
- GPU: the Human's PC switches off under full GPU load. Every Unreal run is
  frame-capped (30 fps), offscreen or minimised, short, gentle quality, no
  benchmark mode, no path tracing, below-normal priority, limited shader compile
  workers. No window in front of the Human, no video playback with sound. Never
  launch anything through the Windows shell (no `start`, `explorer`,
  `Invoke-Item`, file associations).
- No network, no AI services, no uploads. Own content plus the style sample's
  licensed scans locally in Unreal only. No copying of any other game's look,
  names or layouts.
- Report instead of silently changing the goal if something cannot be solved.
- Do NOT commit or push.
