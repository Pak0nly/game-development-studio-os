# Work Order UR-CREATURE-CINDERLING-V1 — Cinderling benchmark model (Blender, time-boxed)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.

**Time box (hard):** the PC switches off around 22:00 local (2026-11-11).
Write both result files by about 21:50 whatever is done; do the steps in order.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-CREATURE-CINDERLING-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-CREATURE-CINDERLING-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-CREATURE-CINDERLING-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-CREATURE-CINDERLING-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statement (2026-11-11, exact)

"C:\GameDev\Underreign_Assets\Meshy — Cinderling Bild und Meshy Model hinterlegt."
(Concept `Kleiner Aschengeist mit Glutherz.png`, model
`Meshy_AI_Emberborn_Cinderling_20261111_texture_fbx.zip`; the Human's own
Underreign content, DEC-042.) Bible look: knee-high, upright two-legged figure
of packed soot, glowing ember in the chest like a heartbeat, no face, two
pinprick coal eyes, never round.

## Tasks (in this order)

1. Clean the Meshy mesh (holes, floaters, scale to about 0.5 m, orientation,
   origin at the feet).
2. Game mesh about 15–25k triangles with clean UVs; bake colour, normal,
   roughness/metallic/AO from the high-poly; emissive mask for the chest ember
   and the eyes (and thin cracks only if they glow in the concept).
3. Turntable stills high vs game mesh, head and chest close-up.
4. If time remains: a simple humanoid skeleton with weights, and an idle loop;
   then a walk loop — only what can be checked properly before 21:50.
5. Copy the concept image byte-identical to
   `Projects/Underreign/References/ArtDirection/cinderling_concept_v1.png` and
   add a PROVENANCE line.
6. `Evidence/UR-CREATURE-CINDERLING-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-CREATURE-CINDERLING-V1/WORKER_RESULT.md`.

## Limits

- External allowed: `StyleSample/Creatures/Cinderling`,
  `Evidence/UR-CREATURE-CINDERLING-V1`. Studio allowed:
  `Projects/Underreign/References/ArtDirection`,
  `Artifacts/Underreign/Evidence/UR-CREATURE-CINDERLING-V1`. Inputs read-only;
  unzip to a scratch folder under `C:/GameDev/Underreign_Assets/AnimWork/`
  (absolute paths only, never relative paths that land in `C:/`).
- Blender in the background, GPU light, no Unreal, no window in front of the
  Human. Do NOT commit or push.
