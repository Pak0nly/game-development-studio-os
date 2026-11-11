# Work Order UR-STYLE-SAMPLE-V4 — Style sample step 4: dark, charred, high contrast

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.
Parallel order: UR-CREATURE-SAMPLE-V2 works in `StyleSample/Creatures`; do not
touch it.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V4/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V4/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V4/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V4/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human verdict on step 3 (2026-11-11, exact)

"Ich finde die Bodenplatten passen weniger die davor. Zu sauber, zuviele und jede gleich. Das Blut darauf kommt gar nicht mehr zur Geltung. Außerdem sehen sie aus wie aufgelegt und nicht verfugt, dadurch fehl am Platze.
Es wurden durchgehend helle Texturen gewählt, keine derer die ich eigentlich hier unten erwarten würde. Schwarz, dunkle, verkohlt, starker Kontrast zu den Licht der Lava."

## Tasks

1. Re-choose from the survey sheets (`StyleSample/Captures/V3/Survey/`) and the
   library (`C:/GameDev/Underreign_Assets/Fab/VaultCache/FabLibrary`, read-only)
   with this rule: **black, dark, charred, sooty** surfaces everywhere
   (floor, walls, boulders, forge stone), so the lava and fire light stand out
   in strong contrast. Grade albedo darker where a scan is too light (keep it
   physically plausible). Give a reason per choice.
2. Floor: not clean, not uniform, not "laid on top": fewer and irregular slabs
   (varied sizes, some cracked, chipped, broken or missing, sunk unevenly),
   set **into** the ground with filled, dirty, sooty mortar joints flush or
   slightly recessed, mixed with packed dirt/ash between; wet where it makes
   sense. Blood must read again: dark, thick pools and smears that soak into
   joints.
3. Lava: flowing streams with crust plates and bright seams (like the target),
   not a regular crack grid; the river core not white.
4. Keep the readability aids; keep light warm only from fire and lava, very
   dark elsewhere; check the units still read.
5. Proof as before: stills of the same cameras, units still, camera move,
   side-by-side step 2 | step 3 | step 4 | target for the game camera and the
   forge close-up, GPU table capped.
6. `StyleSample/README.md`, `Evidence/UR-STYLE-SAMPLE-V4/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V4/WORKER_RESULT.md`.

## Limits

- External allowed: `StyleSample/UnderreignStyle`, `StyleSample/Scripts`,
  `StyleSample/Blender`, `StyleSample/Source`, `StyleSample/Captures`,
  `StyleSample/README.md`, `Evidence/UR-STYLE-SAMPLE-V4`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V4`. Asset library read-only.
- **Power safety (hard)**: every Unreal run capped at 30 fps and verified per
  tick, offscreen, short; never `-benchmark`, no Movie Render Queue, no path
  tracing; never run while another UnrealEditor process runs; never a window in
  front of the Human. Build parallelism at most 8.
- Do NOT commit or push.
