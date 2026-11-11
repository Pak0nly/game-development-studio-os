# Work Order UR-STYLE-SAMPLE-V6 — Style sample step 6: light, reflections, VFX (time-boxed)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.
Parallel order: UR-CREATURE-VIDEO-V1 works in `StyleSample/Creatures/BrandHoundVideo`
(Blender, light GPU); do not touch it; check for other heavy GPU work before
every Unreal run.

**Time box (hard):** the Human's PC switches off in about 1.5 hours (around
22:00 local, 2026-11-11). Deliver a finished, captured result within 60–70
minutes; prefer fewer, solid improvements over many half-done ones. Write the
result files before the time is up even if not everything is done.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V6/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V6/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V6/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V6/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (2026-11-11, exact)

- On step 5: "Besser als vorher, aber wie du sagst, es geht noch besser. Wenn wir dann noch mit mehr Lichteinstellungen, besseren Reflexionen, detaillierteren Modellen und VFX (Funken, Volumetrische Staub und Aschewirbel, Dunst etc.) arbeiten sollten wir eine Umgebung schaffen in der wir mindestens Entwickeln können."
- "Die letzte Iteration der Stilprobe hat keine Stunde gedauert und wir haben noch 1,5h. Sollte jetzt noch klappen."

## Tasks (on top of step 5, new level `L_StyleSample_V6`; keep step 5's scans, layout and neutral grade)

1. **Light**: more deliberate lighting — light shafts through haze from braziers
   and lava, warm bounce from below at the chasm, rim light on edges, a few
   small practical lights; keep dark areas dark.
2. **Reflections**: wet stone and metal visibly reflect fire and lava (Lumen
   reflections tuned, roughness of wet areas, hardware ray-traced reflections
   if affordable); state the cost.
3. **VFX (Niagara)**: denser sparks from forge and braziers, volumetric dust
   and ash swirls in the air, haze over the lava, visible heat shimmer, thicker
   smoke that still reads from above.
4. Detailed props from Meshy are a later step (needs the Human); here only
   small material/detail improvements on existing props if time allows.
5. Proof: the same stills, a 4K game-camera still, a 1080p MP4 camera move,
   side-by-side step 5 | step 6 | target, GPU table capped.
6. `StyleSample/README.md`, `Evidence/UR-STYLE-SAMPLE-V6/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V6/WORKER_RESULT.md`.

## Limits

- External allowed: `StyleSample/UnderreignStyle`, `StyleSample/Scripts`,
  `StyleSample/Blender`, `StyleSample/Source`, `StyleSample/Captures`,
  `StyleSample/Logs`, `StyleSample/README.md`, `Evidence/UR-STYLE-SAMPLE-V6`.
  Studio allowed: `Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V6`.
- **Power safety (hard)**: every Unreal run capped (30 fps at 1080p, 10 fps for
  4K) and verified per tick, offscreen, short; never `-benchmark`, no Movie
  Render Queue, no path tracing; never run while another UnrealEditor or heavy
  GPU process runs; never a window in front of the Human.
- Do NOT commit or push.
