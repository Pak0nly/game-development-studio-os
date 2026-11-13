# Work Order UR-CAMERA-STUDY-V1-GPU-CONTINUATION01 — Camera study: render the pan films on the GPU

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
the same Worker as UR-CAMERA-STUDY-V1 (direct continuation of the same
objective). Execution mode: Discovery. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-CAMERA-STUDY-V1-GPU-CONTINUATION01/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-CAMERA-STUDY-V1-GPU-CONTINUATION01/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-CAMERA-STUDY-V1-GPU-CONTINUATION01/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-CAMERA-STUDY-V1-GPU-CONTINUATION01/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statement (exact, 2026-11-13)

After the Director estimated about 1–3 hours for the pan films on the CPU and
about 10–30 minutes on the GPU: "3 Stunden zu brauchen statt 30 Minuten
rechtfertigen die Vorsicht nicht. Das ist zuviel Zeitverlust."

## Change to UR-CAMERA-STUDY-V1

Everything in `Artifacts/Underreign/DirectorDispatch/UR-CAMERA-STUDY-V1/WORK_ORDER.md`
stays binding (tasks, paths, limits) except this one point: **Blender may render
on the GPU** for the remaining renders (the pan films, and stills not yet done).

- Use Cycles with the GPU device (HIP for the AMD card, or OptiX/CUDA if the
  card is NVIDIA); if no GPU device is available in Blender 5.2, use Eevee on the
  GPU instead and say so. Record the device, the time per frame and the total.
- Save every frame as its own file as soon as it is rendered and skip frames
  that already exist, so a sudden PC shutdown loses at most one frame and the
  render can be resumed. Keep the earlier CPU stills.
- Before the films, render one single test frame on the GPU and report its time.
- Still no Unreal, no window in front of the Human, lowered process priority,
  no launch through the Windows shell. Unchanged: do NOT commit or push.
