# Work Order UR-KIT-WALL-INSET-V1 — Rock wall kit: keep the relief behind the cell edge (full 2 m corridors)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-KIT-WALL-INSET-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-KIT-WALL-INSET-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-KIT-WALL-INSET-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-KIT-WALL-INSET-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact, 2026-11-13)

"Allgemein sehe ich, dass die Gänge trotz der 2m breite, recht schmal sind.
Kann es sein, dass die Musterung und Details der Wände oben drauf gesetzt wurde
anstatt in dieser 2m Grenze zu bleiben?"

"Die Struktur selbst ist auch gut. Sie ragt nur zu sehr in den Gang hinein.
Gerne go"

## Problem and goal

The night-4 kit (`Design/Art/ENVIRONMENT_KIT_2M.md` line 41) pushes the rock
relief 0.03–0.42 m INTO the open cell and never behind the cell edge, so a 1-cell
corridor is only 1.61–1.72 m clear on average (1.15 m at worst). Goal: **the same
rock structure and look**, but the relief lies behind the cell edge, inside the
rock cell, so open cells keep their full 2 m. Target: no point of a wall face more
than 0.05 m into the open cell; measured average clear width of a 1-cell corridor
at least 1.95 m; the relief depth and character unchanged (it just moves back).

## Tasks

1. In `ArtSource/EnvironmentKit/scripts/` change only what is needed (the seam
   profile, face offset and the related pieces: corners, ends, pillars, block tops,
   cut caps, damage states, fracture sets, collision) so the relief sits behind the
   cell edge. Seams between pieces and corners must still close (< 0.1 mm), no
   gaps or holes at the cell edge, cut caps still close. Keep budgets, UVs,
   materials, LODs, naming and export settings.
2. Rebuild everything with local Blender 5.2 in background mode (the kit was made
   with 5.3 in the cloud; work around differences without changing the look and
   report them). Re-export all FBX, update the stats.
3. Proof: measure protrusion and clear width per stratum (old vs new table);
   side-by-side stills old vs new of the seam rows and of the night's proof
   section from the game camera (pitch about 72°, FOV about 65°, about 17 m) with
   the 1.8 m human and the hound at 1.6 m in a corridor; one pan of about 4 s with
   a full 360° turn of the new proof section (MP4 and GIF).
4. Update `Design/Art/ENVIRONMENT_KIT_2M.md` (protrusion rule, measured widths)
   and `ArtSource/EnvironmentKit/README.md` if the rebuild steps change.
5. Write `Evidence/UR-KIT-WALL-INSET-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-KIT-WALL-INSET-V1/WORKER_RESULT.md` (Studio,
   plus the verify-worker line): changed files, the width table, paths of the
   images and the film. Delete temporary frame folders.

## Limits

- External allowed: `ArtSource/EnvironmentKit`, `Design/Art/ENVIRONMENT_KIT_2M.md`,
  `Evidence/UR-KIT-WALL-INSET-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-KIT-WALL-INSET-V1`. Work files only under
  `C:/GameDev/Underreign_Assets/AnimWork/UR-KIT-WALL-INSET-V1`. `Game`,
  `SimulationCpp`, `StyleSample` and everything else read-only. Never touch any
  Hearthlands folder or other `C:/GameDev/*` project.
- Blender in background mode with lowered priority through the process API; the
  CPU is the default; the GPU (Cycles HIP) may be used for long renders if clearly
  faster, saving every frame as its own file. Never launch anything through the
  Windows shell (no `start`, `explorer`, `Invoke-Item`, file associations). No
  Unreal. No window in front of the Human, no video playback with sound.
- Own content only; no network, no downloads, no AI services.
- Report instead of silently changing the goal if something cannot be solved.
- Do NOT commit or push.
