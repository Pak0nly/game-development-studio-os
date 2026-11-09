# HL-WAYS-STAGE1-DAY-WITHOUT-ROADS-V1 progress

Status: done, stopped at the Human checkpoint. Nothing pushed.

- verify-worker: PASS (receipt 634456ca5ff1d7912fedb4744c6bacac4a54cb239da8aa1346cf17dc8d5cc281).
- Baseline `1c0223d`: dotnet 2177 / 2175 / 2 failed (pinned hashes, pre-existing); EditMode 2475 / 2452 / 0 / 23 (stage 0's after-run, same commit).
- Step 1 `9916812`: core ways model and tests. EditMode 2500 / 2473 / 0 / 27.
- Step 2 `a7e4424`: runtime bridge, build script. Build `HL-Game-ways-r1` (3 builds b1..b3; b2 fixed paths not drawn at speed and the frozen
  felling clock; b3 drew narrow tracks and finished buildings whose site had no host model). EditMode after 2503 / 2473 / 0 / 30;
  dotnet after 2198 / 2196 / 2 failed (same pinned hashes, same values).
- Evidence: `STAGE1.md`, `WORKER_RESULT.md`, `clips/`, `vergleich/`, `tables/`, `captures/`, `logs/`.

Open for later stages (not part of this order): night (stage 2), save/load in the menu and scenario (stage 3), a native ways presentation
without the held road session as the picture's host.
