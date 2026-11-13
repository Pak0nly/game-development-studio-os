# Work Order UR-GREYBOX-RESAVE-FIX-V1 — Stop the kit setup from re-saving the greybox material, discard the stray change

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Routine.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-GREYBOX-RESAVE-FIX-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-GREYBOX-RESAVE-FIX-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-GREYBOX-RESAVE-FIX-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-GREYBOX-RESAVE-FIX-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statement (exact, 2026-11-13, question page answer)

"1 Die nebenbei neu gespeicherte Grau-Material-Datei: A: Verwerfen und Skript reparieren (Empfehlung)"

The recommendation shown was: "A: Verwerfen. Der nächste passende Auftrag ändert
das Skript so, dass es die Datei nicht mehr anfasst." The question said that nothing
was changed on purpose in the file.

## Background

`Game/Underreign/Content/Greybox/M_UR_Greybox.uasset` shows as modified in the
game repository working tree after kit runs. `Game/Scripts/setup_kit.py` step 6
sets `used_with_nanite` and `used_with_instanced_static_meshes` on that material,
recompiles and saves it on every run. The file was last committed in 3c8cac0
(UR-UNREAL-WALLSAMPLE-V1).

## Tasks

1. **Find out what the change is.** Compare the committed file with the working
   tree file (for example load both in a headless editor run, or read the flags
   via Python in a commandlet on a temporary copy outside the repository). Decide:
   - (a) the committed file already carries both flags and the working tree change
     is only re-save noise, or
   - (b) the committed file lacks a flag that the game needs (the faint layer below
     draws kit pieces with this material).
2. **If (a):** change `setup_kit.py` step 6 so it only sets, recompiles and saves
   when a flag is actually missing (and logs "unchanged" otherwise). Check the
   other setup scripts (`setup_assets.py`, `setup_torch.py`, `setup_hound.py`) for
   the same pattern on files they do not own and fix it the same way. Then discard
   the working tree change with `git checkout -- Game/Underreign/Content/Greybox/M_UR_Greybox.uasset`,
   run `Game/Scripts/setup_kit.sh` once with `UR_KIT_MATERIALS_ONLY=1`
   (headless, no window) and prove that `git status` no longer shows the file.
3. **If (b):** do NOT discard. Stop and report to the Director what is missing
   and why; the Human was told nothing was changed on purpose, so this goes back
   to the Human.
4. Function check only: build passes (`Game/Scripts/build.sh`), the existing
   automation tests stay green. No captures needed.
5. Write `Evidence/UR-GREYBOX-RESAVE-FIX-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-GREYBOX-RESAVE-FIX-V1/WORKER_RESULT.md`
   (Studio, plus the verify-worker line): finding (a) or (b) with proof, changed
   files, git status before and after.

## Limits

- External allowed: `Game/Scripts`, `Game/Underreign/Content/Greybox/M_UR_Greybox.uasset`
  (discard only, case a), `Evidence/UR-GREYBOX-RESAVE-FIX-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-GREYBOX-RESAVE-FIX-V1`.
- Read-only: everything else, in particular `Game/Underreign/Source`,
  `SimulationCpp`, `ArtSource`, `Design`, `StyleSample`. `ArtSource/GroundTextureTest`
  is another order's uncommitted output: never touch, stage or delete it. If a
  run changes any other tracked file, restore exactly that file and report it.
- Unreal: headless commandlets only (`-unattended -nullrhi`), below-normal
  priority, limited shader compile workers. Never launch through the Windows
  shell. No window in front of the Human.
- No network, no uploads. Report instead of silently changing the goal.
- Do NOT commit or push.
