# Work Order UR-CAMERA-STUDY-V1-EXT01 — Camera study extension: full walls, free rotation

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
the same Worker as UR-CAMERA-STUDY-V1 (direct continuation of the same
objective). Execution mode: Discovery. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-CAMERA-STUDY-V1-EXT01/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-CAMERA-STUDY-V1-EXT01/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-CAMERA-STUDY-V1-EXT01/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-CAMERA-STUDY-V1-EXT01/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact, 2026-11-13)

"1,5m hohe Wände sehen doof aus. Gerade wenn man später an 1st Person Ansicht
denkt und über alles drüber schauen könnte."

On the Director's proposal (full 4 m walls; in the overview camera hide only the
camera-facing walls where they cover something; outlines for hidden units;
rotation; a 45° view): "Volle Drehung wie in DK2. Ja"

So: walls stay full height (4 m); the camera turns freely around the view
centre (full 360°, not only 90° steps). Low cut walls are not wanted.

## Tasks (after finishing UR-CAMERA-STUDY-V1 on the CPU, same paths and limits)

1. Add variants with **full 4 m walls**, lit rock tops, from today's camera (A)
   and the steeper one (D, 72°):
   - **E** walls whose faces point toward the camera are hidden or drawn low
     only where they cover the floor of a corridor or room next to them (a
     cutaway that follows the view direction); far walls stay full height;
   - **F** all walls full, hidden units drawn as a clear glowing outline through
     the walls (a stand-in for an in-game outline effect);
   - **G** full walls, view turned 45° so both corridor directions are seen at
     an angle;
   - **E+F** combined.
   Measure visibility as before (corridor floor, human, hound).
2. One pan per E and E+F of about 6 s with a **continuous 360° turn** around the
   view centre (not stepped), MP4 and GIF, so the Human sees how the cutaway
   follows the rotation.
3. Add these to the contact sheet (plain German labels) and to both
   WORKER_RESULT.md files with a recommendation for walls at full height; note
   this order's verify-worker line there too.

Limits unchanged from UR-CAMERA-STUDY-V1 (CPU is fine; do NOT commit or push).
