# Work Order UR-KIT-WALL-CONTINUOUS-V1 — Rock walls as one continuous natural surface (no seam piers), then in the game

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-KIT-WALL-CONTINUOUS-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-KIT-WALL-CONTINUOUS-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-KIT-WALL-CONTINUOUS-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-KIT-WALL-CONTINUOUS-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact, 2026-11-13)

On the result of UR-KIT-WALL-INSET-V1 (relief moved back per piece, 0.44 m seam
piers at every cell edge): "Die Pfeiler alle 2m stören natürlich. Denn so ist es
keine natürliche Wand mehr. Warum wurde nicht einfach die gesamte Wand gekürzt
sondern jeder einzelne Block bis auf die Ecken die jetzt doof aussehen?"

On checking: "Ansehen ist nicht gleichzusetzen mit "eine generative KI damit
trainieren". Es muss visuell geprüft werden. Nicht nur rechnerisch."

On the Director's proposal (whole wall recedes as one continuous surface, relief
runs across the cell edges, corners/ends/pillars rebuilt, Blender proof first,
then rebuild in the game, visual checks by Worker and Reviewer): "So starten."

## Problem

UR-KIT-WALL-INSET-V1 moved the relief of each 2 m face back but kept the seam
profile at the cell edge (squeezed to 0.0–0.05 m) so neighbouring pieces close.
That leaves a flat 0.44 m pier at every cell edge: a visible 2 m rhythm, the wall
no longer looks natural. The worker's attempt to recede the seam too left slits at
corners, because the corner pieces still met the old seam position. Corners now
also look poor (small bulge, tight fillet).

## Goal

A wall that reads as one natural, continuous rock surface along any length and
around corners: **no visible repeat, pier, groove or seam at the 2 m cell edges**;
relief character and depth as night 4 / INSET-V1; still nothing more than 0.05 m
into the open cell; mean clear width of a 1-cell corridor still at least 1.95 m;
pieces still close without gaps (< 0.1 mm) and corners, ends, pillars and inner
corners look like natural rock, not like stitched boxes.

Suggested way (the Worker may choose a better one and say why): the seam profile
lies at the relief's receded depth and is the same function for every piece edge
(for example a shared seam curve that is itself rough and varies with height), the
relief displacement fades smoothly into that shared seam over a wide zone so no
flat strip shows, and the variant noise is continuous enough across a seam that
any neighbour combination of variants A–D reads continuous; corners, ends, pillars
and inner corners are rebuilt to meet exactly this receded seam (no slits), with
natural rounded rock mass at outer corners.

## Tasks

1. **Blender (kit, local Blender 5.2, background).** Change `ArtSource/EnvironmentKit/scripts/`
   as needed (seam, faces, corners, ends, pillars, inner corners, block tops / cap
   strips, damage states, fracture sets, collision), keep budgets, UVs, materials,
   LODs, names and export settings (the block-top Open classes stay unless a better
   solution needs a change; then report it and update the placement reference).
   Rebuild and re-export all FBX, stats, placement.
2. **Proof in Blender, checked by eye.** Renders (sharp, 1280 x 720 or more):
   a long straight wall of 6 cells with mixed variants (old INSET-V1 vs new, same
   camera, from the corridor and from the game camera pitch 70°, FOV 65°); every
   corner type (outer, inner, end, pillar, diagonal) close up; the proof section
   from the game camera; one ~4 s 360° pan (MP4 + GIF). Look at every render
   yourself: seams, piers, grooves, repeats, slits, dark squares, odd corners.
   Iterate until no seam is visible at game distance and close up. Measure
   protrusion, clear width and seam gaps as in INSET-V1 (old vs new table).
3. **In the game.** Re-run `Game/Scripts/setup_kit.sh` with the new FBX
   (repeatable, `UR_KIT RESULT PASS`), adapt the placement in
   `Game/Underreign/Source/Underreign` only if the kit change needs it, build, and
   capture with `capture.sh wallsample` (same views as UR-UNREAL-WALLSAMPLE-V1:
   layer 2 full and low walls, close corridor, 6 s 360° turn) plus a close still
   of a long straight wall and of an outer corner from the game camera. Look at the
   captures yourself (they show the licensed scanned rock: viewing to check is
   fine, never send them to any generative or training service). Function check
   only: build passes, existing automation tests green, golden hashes unchanged,
   frame-capped runs.
4. Update `Design/Art/ENVIRONMENT_KIT_2M.md` and `ArtSource/EnvironmentKit/README.md`
   (seam rule, measured widths) and `Game/README.md` if a step changes.
5. Write `Evidence/UR-KIT-WALL-CONTINUOUS-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-KIT-WALL-CONTINUOUS-V1/WORKER_RESULT.md`
   (Studio, plus the verify-worker line): changed files, the table, what you saw in
   the images, image and film paths, open points. Delete temporary frame folders.

If a seamless result cannot be reached, stop and report with images of the best
attempt and the reason; do not ship piers or another visible 2 m rhythm silently.

## Limits

- External allowed: `ArtSource/EnvironmentKit`, `Design/Art/ENVIRONMENT_KIT_2M.md`,
  `Game/Underreign/Source/Underreign`, `Game/Underreign/Content/Environment`,
  `Game/Scripts`, `Game/Captures`, `Game/README.md`,
  `Evidence/UR-KIT-WALL-CONTINUOUS-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-KIT-WALL-CONTINUOUS-V1`. Work files only under
  `C:/GameDev/Underreign_Assets/AnimWork/UR-KIT-WALL-CONTINUOUS-V1`.
  `SimulationCpp`, `Game/Underreign/Source/UnderreignSim`, `StyleSample` and
  everything else read-only. The scanned textures stay git-ignored in
  `Content/Environment/Scans`. Never touch any Hearthlands folder or other
  `C:/GameDev/*` project.
- Blender in background mode, lowered priority; CPU by default, GPU (Cycles HIP)
  allowed for long renders if clearly faster, saving every frame. Unreal: every
  run frame-capped (30 fps), offscreen or minimised, gentle quality, short, no
  benchmark mode, no path tracing, below-normal priority, limited shader compile
  workers. Never launch through the Windows shell (no `start`, `explorer`,
  `Invoke-Item`, file associations). No window in front of the Human, no video
  playback with sound.
- Own content plus the style sample's licensed scans locally in Unreal only; no
  network, no uploads, no generative AI services.
- Report instead of silently changing the goal.
- Do NOT commit or push.
