# Independent review — UR-UNREAL-STATS-V1

Reviewer task: separate read-only Claude Code subagent, requested model sonnet — not independently attested.
Verdict: PASS (no high or medium findings).

1. Scope: changes are in Game/ only (wrapper, subsystem, HUD, controller, capture director, capture.sh, docs); Evidence/UR-UNREAL-STATS-V1/ is the evidence folder. SimulationCpp/ changes in the tree belong to the parallel UR-SIM-SUMMON-COST-V1 order. `sync_sim.py check` PASS (356 files of commit 951f93741e60, 0 problems), so the synced library is unchanged.
2. Collector hook: AfterStep is a single call after each Step in URSimGame.cpp; golden final hash efcb6610e418cc40 matches and all 19 check hashes matched; step time mean 29.4 us, p99 96.1 us (nothing heavy).
3. Log: `UR_STATS_CHECK clipboard PASS (4056 chars), file PASS, RESULT PASS`; run used t.MaxFPS 60 with VSync on.
4. Sample block: plausible and readable (waves table, gold, cinderlings, creatures, rooms, traps); the end-screen still was listed and produced.
5. Stats file goes to Game/Underreign/Saved/Stats/, covered by Game/.gitignore (`Underreign/Saved/`, confirmed with git check-ignore).

- Info: the test run overwrote the PC clipboard (disclosed by the Worker).
- Info: Slate button click itself not tested, only the F9 path (same handler; disclosed).
- Info: I did not open the still image pixels; existence and Worker description only.
