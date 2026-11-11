# Work Order UR-STYLE-SAMPLE-V5 — Style sample step 5: sharpness and texture resolution

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.
Parallel order: UR-CREATURE-VIDEO-V1 works in `StyleSample/Creatures/BrandHoundVideo`
(Blender, Seedance); do not touch it. Check for other heavy GPU jobs before any
Unreal run.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V5/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V5/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V5/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V5/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human verdict on step 4 (2026-11-11, exact)

"Die Stilprobe macht Fortschritte. Jetzt sieht es allerdings alles etwas pixelig und verschwommen aus. Also wären die Bilder schlecht aufgelöst bzw. der Boden auch aus der Entfernung nicht gut aufgelöst."

## Tasks

1. Diagnose why step 4 looks pixelated and blurry, with evidence per cause
   (compare crops): texel density of the new single floor surface and its
   layout/height texture, texture streaming not finished in short offscreen
   runs (pool size, forced full mips, warm-up time), TSR or screen percentage
   below 100 %, mip bias, anisotropic filtering, JPEG source compression of the
   prepared scans, motion blur or depth of field on the game camera, the
   capture/export path (scaling, WebP/GIF compression).
2. Fix every real cause without changing the look direction of step 4 (same
   scans, layout, colours, lighting): e.g. world-aligned tiling of the scans
   on the floor at proper density with the layout map only as a mask, higher
   texture resolution where it matters, streaming warm-up or forced mips for
   captures, screen percentage 100 % with good TSR settings, anisotropic
   filtering, lossless still export.
3. Proof: the same stills as step 4 at 1920×1080 plus a 4K still of the game
   camera, and 100 % crops (floor near and far, walls, forge) step 4 vs step 5
   side by side; camera move; GPU table capped (state the cost of each fix).
4. `StyleSample/README.md`, `Evidence/UR-STYLE-SAMPLE-V5/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V5/WORKER_RESULT.md`.

## Limits

- External allowed: `StyleSample/UnderreignStyle`, `StyleSample/Scripts`,
  `StyleSample/Blender`, `StyleSample/Source`, `StyleSample/Captures`,
  `StyleSample/README.md`, `Evidence/UR-STYLE-SAMPLE-V5`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V5`. Asset library read-only.
- **Power safety (hard)**: every Unreal run capped at 30 fps and verified per
  tick (also for the 4K still), offscreen, short; never `-benchmark`, no Movie
  Render Queue, no path tracing; never run while another UnrealEditor or heavy
  GPU process runs; never a window in front of the Human. Build parallelism at
  most 8.
- Do NOT commit or push.
