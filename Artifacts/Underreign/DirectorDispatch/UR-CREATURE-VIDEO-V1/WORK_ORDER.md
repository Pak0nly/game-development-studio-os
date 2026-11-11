# Work Order UR-CREATURE-VIDEO-V1 — Brand-hound motion from Seedance videos (trial)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.
Parallel orders: UR-CREATURE-SAMPLE-V2 edits `StyleSample/Creatures/BrandHound`
(hand-built motion) and UR-STYLE-SAMPLE-V4 runs Unreal in `StyleSample`; touch
neither, no Unreal.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (2026-11-11, exact)

- "Für die Animationen könnten wir erneut den Ansatz testen, welchen wir auch schon bei Heathlands versucht haben. Hier haben wir passendere Modelle und es könnte besser klappen."
- Asked paid video service vs local generation (local runs the GPU at full load, which switches the PC off): "Wir haben noch Budget bei Seedance. das würde ich testen wollen."

Background (Studio `Projects/Hearthlands/Docs/CURRENT_HANDOVER.md`, read only):
the Human owns a BytePlus Seedance 2.5 resource pack (about 3.9 M tokens left on
2026-11-09, roughly 0.70 USD per video, valid until about 2027-02-07; the
Director read the BytePlus terms: no training on customer data; the
Playground differs and is not used). The API key is in
`C:/GameDev/AnimTools/secrets/byteplus_key.txt`. The Hearthlands pipeline was
image-to-video, then a keypoint finder trained on renders of the character's
own rig, then fitting onto the rig. The Brand-hound concept and Meshy model are
the Human's own Underreign content (DEC-042) and may be sent to Seedance.

## Tasks

1. **Videos (at most 8 generations)**: start picture = a clean render of the
   Brand-hound game mesh (or the concept image) in a neutral pose on a plain
   background; prompts for a side view with a camera that tracks the dog so it
   stays centred and fully visible: walk, trot, gallop, bite lunge, death
   collapse (and one three-quarter front walk as a second lane if budget
   allows). Read the API documentation for the image-to-video endpoint
   available to the account; log tokens per job.
2. **Pose extraction for a quadruped**: train or adapt a keypoint finder on
   renders of the hound's own rig (as in the Hearthlands approach; read its
   scripts under `C:/GameDev/AnimTools/scripts` for reference, read-only), or
   use a suitable animal pose model if available without new downloads beyond
   what is already in `C:/GameDev/AnimTools`; report accuracy in pixels.
3. **Fit onto the rig** (a copy of `StyleSample/Creatures/BrandHound/Source/BrandHound.blend`
   at HEAD 51fc690): solve per frame, clean foot contacts, loop the gaits, keep
   collar and ring swing.
4. **Proof**: the raw videos, sharp moving previews of the fitted motions
   (side and game camera), a side-by-side video vs the V1 motion, footfall
   charts, measured foot slide; honest verdict whether it beats hand-built.
5. `Evidence/UR-CREATURE-VIDEO-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-CREATURE-VIDEO-V1/WORKER_RESULT.md`, with
   tokens used.

## Limits

- External allowed: `StyleSample/Creatures/BrandHoundVideo`,
  `Evidence/UR-CREATURE-VIDEO-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-CREATURE-VIDEO-V1`. Work files outside the
  repositories only under `C:/GameDev/Underreign_Assets/AnimWork/`.
  `C:/GameDev/AnimTools` read-only (use its venv and tools, write nothing
  there); never touch any Hearthlands project folder.
- The API key is read at run time only; never print, log, copy or commit it.
  Network only to the BytePlus Seedance API; no other downloads.
- **GPU safety (hard)**: the PC switches off under full GPU load. Prefer CPU
  for training and solving, or keep GPU work small (low batch, short runs);
  never run alongside another heavy GPU job (check for UnrealEditor / ComfyUI
  processes first). Blender in the background, no window in front of the Human.
- Do NOT commit or push.
