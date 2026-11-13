# REVIEW UR-GREYBOX-RESAVE-FIX-V1

## Checks
1. Git status (C:/GameDev/Underreign, `--untracked-files=all`): from this order only `Game/Scripts/setup_kit.py` (M) and `Evidence/UR-GREYBOX-RESAVE-FIX-V1/WORKER_RESULT.md` (new) appear. `M_UR_Greybox.uasset` is clean; no `Content/Environment` file is modified. The QUESTIONS_FOR_HUMAN_NIGHT2-4 changes and Evidence/UR-DECISIONS-R8-V1 belong to another order and were ignored. OK.
2. Diff of `setup_kit.py`: only step 6 changed. It collects the missing flags among `used_with_nanite` and `used_with_instanced_static_meshes`, and sets, recompiles and saves only if the list is non-empty. Otherwise it logs "used with Nanite, unchanged". Both flags are checked and nothing else is touched. OK.
3. Worker proof for case (a): both the committed and the working-tree file were loaded headless from copies outside the repository and both carry both flags. The binary compare shows 52 differing bytes in the package GUID and the save-time/hash region, which is plausible re-save noise. The check of the other setup scripts is documented. The materials-only run logged "unchanged" and the file no longer shows in git status. The side effect (618 Environment files re-saved by design) was restored exactly and the tree shows none modified. Build succeeded and the Sim tests passed, as reported.

## Findings
- INFO: Two read-only flag checks ran UnrealEditor-Cmd at normal priority instead of below-normal (disclosed by the Worker). They were short, headless and caused no harm.
- INFO: The kit materials-only run re-saves 618 tracked Environment files by design. The Worker restored them, but the run leaves the tree dirty each time, so a future order could look at it.

Verdict: PASS
