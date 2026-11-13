# WORKER_RESULT UR-GREYBOX-RESAVE-FIX-V1

verify-worker: PASS worker receipt ca2325049c2ceb42a25fb8215bdade8490a0baec100ef3b6c7c304afdc0b7a38

## Finding: case (a), re-save noise
- Committed file (LFS object 8321585d...) and working tree file (7a26d140...) were loaded headless (-unattended -nullrhi) from
  temporary copies outside the repository, each in an empty content-only project. Both report
  used_with_nanite=True and used_with_instanced_static_meshes=True.
- Binary compare: same size (7317 bytes); the 52 differing bytes sit in the package GUID (bytes 25-44) and in the
  save-time/hash region near the end. No flag difference.

## Change
- Game/Scripts/setup_kit.py step 6: reads both flags first; sets, recompiles and saves only if one is missing,
  otherwise logs "M_UR_Greybox: used with Nanite, unchanged".
- setup_assets.py owns and builds the greybox files; setup_torch.py and setup_hound.py only load and save assets they
  create themselves. No other foreign-file re-save found, no change needed there.
- Working tree change discarded: git checkout -- Game/Underreign/Content/Greybox/M_UR_Greybox.uasset.

## Proof
- setup_kit.sh with UR_KIT_MATERIALS_ONLY=1: log "UR_KIT M_UR_Greybox: used with Nanite, unchanged"; git status no longer lists
  the file.
- Side effect: that run re-saved 618 tracked kit mesh/material files under Content/Environment (it rebuilds them by design).
  All 618 were restored exactly with git checkout (only those paths).
- build.sh: Succeeded (exit 0). test_sim.sh: all Underreign.Sim tests PASS, exit code 0.

## Git status (external repo)
- Before: M Game/Underreign/Content/Greybox/M_UR_Greybox.uasset
- After: M Game/Scripts/setup_kit.py only (plus Design/Planning/QUESTIONS_FOR_HUMAN_NIGHT2-4.md and Evidence/UR-DECISIONS-R8-V1,
  which appeared during the run from other sessions, not touched by this order).

## Notes
- The two read-only flag checks ran UnrealEditor-Cmd directly from bash at normal priority (short, headless, no window).
