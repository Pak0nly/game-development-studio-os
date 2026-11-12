# Work Order UR-MESHY-ID-V1 — Identify the Human's new Meshy models (preview renders and mapping list)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-MESHY-ID-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-MESHY-ID-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-MESHY-ID-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-MESHY-ID-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact, 2026-11-12)

"Großen Schwall an weiteren Mehsy Generierungen in den Ordner gepackt. Leiter etwas komisch von Meshy benannt, daher nicht immer direkt zuordbar."

On the Director's proposal (render a preview of every model, place it next to its
source image, write a reliable mapping list, files unchanged, nothing renamed):
"Ja, Go"

## Inputs (read-only)

- All `*_20261112_texture_fbx.zip` files in `C:/GameDev/Underreign_Assets/Meshy/`
  (36 zips: 33 new ones plus the already known Brute, Priestess/Healer, Scout).
  Each holds one FBX and its PNG maps. These are the Human's own content.
- The Meshy-prep job list `C:/GameDev/Underreign_Assets/Prompts/MESHY_PREP_BATCH.jsonl`
  (`id`, `title`, `output_file`) and the prep images in
  `C:/GameDev/Underreign_Assets/Concepts/Meshy_Prep/`.
- Mycelid models (Spore-matron) may also come from
  `C:/GameDev/Underreign_Assets/Concepts/Myzelchor_Runde1/`.

## Tasks

1. Extract each zip into the work folder (one subfolder per zip; the zips stay
   unchanged), import the FBX in Blender 5.2 in background mode, and render on the
   CPU (Cycles on the CPU with few samples; no GPU device) one preview per model: front
   three-quarter view, textured, plain light-grey background, whole model in frame,
   about 768 px. Also record triangle count, object size in metres as imported,
   texture resolution and zip size.
2. Match every model to its prep job (or Mycelid concept) by looking at the preview
   next to the prep image. Mark each match as sure, likely, or unclear, with one
   plain reason. Note which prep jobs still have no model.
3. Write into `C:/GameDev/Underreign_Assets/Meshy/_Overview/`:
   - `MESHY_ZUORDNUNG.md` (German, plain words, readable titles first, no bare
     job codes): table with Meshy file name, our part (title), certainty, size,
     triangles, notes (for example strand fur, very large file, missing parts,
     weapon still in the hand, back frame missing, design deviation from the
     source image). Then the list of prep jobs still without a model.
   - contact sheets (JPG, about 6 pairs per sheet): Meshy preview left, prep image
     right, each labelled with the readable title and the Meshy name;
   - the single previews in `_Overview/previews/`.
4. Write `Artifacts/Underreign/Evidence/UR-MESHY-ID-V1/WORKER_RESULT.md` (Studio)
   with the verify-worker line, the mapping table, the counts, the created file
   paths with SHA-256, and any problems. Delete your temporary extraction folders
   when done (keep `_Overview`).

## Limits

- Write only to `C:/GameDev/Underreign_Assets/Meshy/_Overview/`, the work folder
  `C:/GameDev/Underreign_Assets/AnimWork/UR-MESHY-ID-V1/`, and Studio
  `Artifacts/Underreign/Evidence/UR-MESHY-ID-V1`. Do not change, move, rename or
  delete any existing file. Do not touch `C:/GameDev/Underreign`, any Hearthlands
  folder or other `C:/GameDev/*` project.
- CPU only: Blender in background mode, CPU rendering, lowered process priority set
  through the process API; never launch anything through the Windows shell (no
  `start`, `explorer`, `Invoke-Item` or file associations). No Unreal. No window in
  front of the Human. Process the zips one or two at a time to keep disk use low.
- No network, no uploads, no AI services.
- Report instead of silently changing the goal if something cannot be solved.
- Do NOT commit or push.
