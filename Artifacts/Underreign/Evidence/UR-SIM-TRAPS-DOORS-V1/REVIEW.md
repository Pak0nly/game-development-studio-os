# Independent review — UR-SIM-TRAPS-DOORS-V1

Reviewer task: separate read-only Claude Code subagent, requested model sonnet — not independently attested.
Verdict: PASS (no high or medium findings).

1. Scope: tracked changes are only under SimulationCpp (plus untracked Evidence/UR-SIM-TRAPS-DOORS-V1, new replay/door files); no Game/StyleSample change in the diff. Studio diff touches only DISCOVERY_DECISIONS.md and OPEN_DECISIONS.md (plus the evidence folder). Cinder Hollow map file untouched; only test/crownkiln.map.txt changed in Maps; Cinder Hollow waves unchanged (UD-53). Tuning files lose only worker.EntranceKeepOut.
2. Hidden traps: reviewed IntruderBrain (route-only bash for non-Disarmers, Sapper = Disarmer with 300 % door damage), TrapSpotting/TrapMemory (SeenIds, hashed in KnownMachine), Crownkiln waves (Ferreter replaced by Scout in waves 2/3, only Sapper as breaker in wave 3; none in wave 1). Matches the Work Order and WORKER_RESULT.
3. Doors: wood/iron kinds with Forge, corridor-cell check, lock command, Grid::Barred derived from hashed part state (Hp, Locked in TrapPart::AddToHash), own units pass, half refund, keep-out code/key removed. Proposals marked in rules text.
4. Scratch copy built with build.bat (no errors): ur_tests Passed 906, Failed 0. All 9 golden replays pass `ur_headless replay` with stored check hashes and final hashes equal to those in WORKER_RESULT. Determinism: two 20-seed Crownkiln door-bot batches give identical final_hash for 20 of 20. Changed tests are listed with reasons (hidden vent now marked revealed, Brute -> Sapper where side bashing was the subject, rewritten Rules24 variants); Rules19Tests removed with the keep-out; new Rules24Tests (18). No silent assertion weakening found at the level inspected; BotHint seed range 1-10 -> 1-40 is documented.
5. Balance: all table numbers in WORKER_RESULT section 3 (won, trap share, parts broken, door-bot rows, experiments) match raw/SUMMARY_1000_SEEDS.txt. A 100-seed Cinder Hollow batch in the scratch build gave 96 % won, consistent with 96.4 %.
6. UD-79 quotes the Human statement character for character (including "könnrn" and "Spiel"); OD-19/OD-20 set to DECIDED with rules version 24.

- Info: the Ferreter remains in the rules but on no map; documented.
- Info: batch CSVs differ between runs only in wall-time columns (tick us, real time); final hashes are identical.
- Info: not re-run here: the 1000-seed batches, the POSIX build and sanitizers (worker states MSVC only).
- Info: Design/Bible/INTRUDERS.md is outdated (documented as open point 6).
