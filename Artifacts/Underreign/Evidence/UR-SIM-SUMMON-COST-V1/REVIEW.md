# Independent review — UR-SIM-SUMMON-COST-V1

Reviewer task: separate read-only Claude Code subagent, requested model sonnet — not independently attested.
Verdict: PASS (no high or medium findings).

1. Scope. In `C:/GameDev/Underreign` (HEAD 76296ce) the changed or new paths are only under `SimulationCpp/` plus the untracked `Evidence/UR-SIM-SUMMON-COST-V1/`. `git diff HEAD -- Game Simulation` is empty, so Game and Simulation (C#) are untouched. The Studio side has only `Artifacts/Underreign/Evidence/UR-SIM-SUMMON-COST-V1/WORKER_RESULT.md` (plus this file). The map `Data/Maps/cinder_hollow.map.txt` is unchanged, so wave 3 is unchanged (UD-53). Pass.
2. Price rule and determinism. `SummonCinderlingCommand::PriceFor` = base + step × max(0, living − free count), with defaults 75 / 25 / 4. `Apply` counts living via the new `WorkerSystem::LivingCount()`, which skips `Dead` workers, at apply time. Refusal order is InvalidTarget (no Heart), then CapReached (living ≥ cap), then NotEnoughGold. The two new keys `worker.SummonCostStep` and `worker.SummonCostFreeCount` are parsed and written in `prototype.tuning.txt` and `golden.tuning.txt` with a comment marking them as PROPOSALS (also in the README). `ISimView` gets `GetSummonPrice`, `GetLivingWorkerCount` and `GetWorkerCap`, all read-only. All arithmetic is integer, and there is no new state, so nothing new enters the state hash. `RulesVersion` goes 5 → 6. Pass.
3. Build and run. I built a copy of SimulationCpp outside the repository with `build.bat` (MP8) and the build succeeded. `ur_tests.exe` gives Passed 750, Failed 0. I replayed the four golden replays and the final hashes match: idle_seed1_lost `c7ee7807a2cbf636`, reasonable_seed1_lost `1c3dd54c393ee939`, reasonable_seed2_lost `f2a8186db6ce5f1f`, reasonable_seed4_won `82c4c28ae73b5f67`. I also re-ran both 200-seed batches: reasonable 52 won, 1 lost in wave 2, 147 lost in wave 3; varied 39 / 1 / 160. Both match the worker's tables, and both CSVs were byte-identical to `after/`. The scratch copy was deleted afterwards. Pass.
4. Changed existing tests.
   - `HeadlessTests` golden cases: the replay file set was swapped (seed2_won to seed4_won, seed4_lost to seed2_lost) because the outcomes under rules 6 differ; every replay is still hash-checked, and the swap is documented in comments.
   - `OpeningVariationTests`: only the expected hash changed, to the re-recorded seed-1 hash `1c3dd54c393ee939`.
   - `AttackGoalTests`: the seed went 2 → 1 and the test name was restored; no assertion changed.
   - `BotHintTests`: the spending model now uses `PriceFor` with the living count, and seed 1 → 4; no assertion changed.
   - Seed swaps are disclosed with reasons. No assertion was weakened, and no regression is hidden. Pass.
5. Balance numbers in WORKER_RESULT.md and the README match the batch outputs for win and loss counts. The wave 3 map is untouched. Pass.
6. README: the new rules-6 section, the golden table, the legacy `rules5/` folder, the test count (750) and the tuning notes match the code and evidence. Pass.

Low/Info:
- Info: WORKER_RESULT.md names baseline HEAD 23aae72, while the repository HEAD is now 76296ce (a parallel Game-only commit landed). It has no effect on this order.
- Info: some existing comments in `HeadlessTests.cpp` still mention old seeds ("seed 8"). This is cosmetic, historical commentary.
- Info: bots that fire several summons in one think price the second one from the count before the first. The worker disclosed this, and the new bot test finds no refused summons in seeds 1-6.
- Info: the Unreal Game copy is still on rules 5 and needs a resync (the three new `ISimView` methods and so on). The worker flagged this as out of scope, which is correct.
