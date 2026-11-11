# Work Order UR-CREATURE-SAMPLE-V2 — Brand-hound correction: paws, mouth, anatomical gait, death, bite

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.
Parallel order: UR-STYLE-SAMPLE-V4 works in the Unreal project and scene
folders of `StyleSample`; stay inside `StyleSample/Creatures`, no Unreal.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-CREATURE-SAMPLE-V2/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-CREATURE-SAMPLE-V2/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-CREATURE-SAMPLE-V2/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-CREATURE-SAMPLE-V2/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human verdict on V1 (2026-11-11, exact)

"Nahansicht ist top, ja. Leider sind die Füße total verdreht. Es sieht aus als hätte man die Pfoten um 180° gedreht, so, dass die Unterseite nach oben zeigt.
Das Maul kann ruhig ausgebaut und mit einfacher dunkler Textur gefüllt werden.
Die Idle Animation finde ich ok. (ist aber auch die einfachste.)
Gehen und Laufen ist nicht gut. Was nicht nur an den umgedrehten Füßen liegt. Hier fehlen vernünftige Anatomy-kentnisse.
Sterben ebenfalls schlecht.
Zubeißen ist ok-ish, die Beine können dabei ruhig von ihrer Position abweiche, aktuell sieht es so aus als seien insbesondere die Hinterpfoten am Boden festgeklebt."

## Tasks

1. **Paws**: find why the paws turn sole-up (toe/metacarpal bone roll, IK
   pole, weights or rest orientation) and fix it in the rig so paws stay
   anatomically correct in every frame; prove with paw close-ups.
2. **Mouth**: build a mouth cavity (inner mouth, gums, tongue, dark simple
   texture), keep teeth, so the jaw can open fully (bite about 45–60°) without
   stretching.
3. **Anatomy-based gait**: rebuild walk and run from real canine locomotion:
   walk as a four-beat lateral-sequence gait, trot as a diagonal two-beat (add
   a trot loop), run as a rotary gallop with suspension phases; correct
   digitigrade leg mechanics (carpus/hock flexion, paw roll and fold on lift,
   placement under the body), scapula glide, spine flexion and extension in
   the gallop, head and neck counter-motion, tail balance, weight shift and
   pelvis tilt. Write down the reference timing used (phase offsets, duty
   factors) and check each animation side-by-side against a reference
   footfall diagram you derive (no third-party footage uploaded anywhere).
4. **Death**: a believable collapse (stagger, legs give way front or hind
   first, body weight drops, head last), no ground penetration.
5. **Bite**: lunge with weight transfer; hind paws push off and re-plant, front
   legs step; not glued to the ground.
6. Keep idle (polish small things only), collar and ring swing in all
   animations; fix the emissive mask (eyes, mouth and whole tail no longer
   glowing, only seams, seal and tail tip).
7. Proof: sharp moving previews (side, front three-quarter, game camera) for
   walk, trot, run, bite, death, idle; a footfall/phase chart per gait next to
   the reference; paw and mouth close-ups. Look at every preview before
   reporting and fix what is clearly wrong.
8. Export as in V1 (update `IMPORT_NOTE.md`), `Evidence/UR-CREATURE-SAMPLE-V2/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-CREATURE-SAMPLE-V2/WORKER_RESULT.md`,
   with honest limits of scripted animation.

## Limits

- External allowed: `StyleSample/Creatures`, `Evidence/UR-CREATURE-SAMPLE-V2`.
  Studio allowed: `Artifacts/Underreign/Evidence/UR-CREATURE-SAMPLE-V2`. No
  Unreal. Blender in the background, no window in front of the Human.
- Do NOT commit or push.
