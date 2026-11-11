# Independent review — UR-SIM-TRAP-REWORK-V1

Reviewer task: separate read-only Claude Code subagent, requested model sonnet — not independently attested.
Verdict: PASS (no high or medium findings).

1. Scope: external changes are only under SimulationCpp plus the untracked Evidence/UR-SIM-TRAP-REWORK-V1; Game untouched. Studio diff is only Projects/Underreign/Docs/DISCOVERY_DECISIONS.md (plus the dispatch and evidence artifact folders). No wave lines changed in any data map diff (UD-53 holds; only part hints converted).
2. Rules as ordered (from the worker result, diff stat and spot checks): free effects self-trigger; Pressure Plate, Tripwire, chains and link commands deleted; Weight Plate with a heavy flag in data; Count Trigger N 2-6 with quiet reset; control = own cell plus faced cell (acceptable reading, stated as open point); no lever; Turret in the Forge with line rule, 10 shots, cinderling refill, hidden until first fire; bridge tile over lava added; vent panic, snare hold, charge knock-back and stun, hatch drop or pit-stun, reduced damage. New state (PanicUntilTick, CountN, Counted, Ammo) is included in the state hash; save version bumped to 25 and rules-24 saves refused; values are labelled proposals.
3. Scratch copy built with build.bat (MSVC): ur_tests reports Passed 862, Failed 0. All 9 golden replays replay with matching final and check hashes. Removed tests (Machines/*, chain, delay, tripwire cases) all belong to removed rules; the rewritten tests carry new names with assertions for the new rules, not weakened ones. The build.bat change (delete old objects before linking) is harmless and needed. Scratch copy deleted afterwards.
4. Balance table in WORKER_RESULT matches raw/SUMMARY_1000_SEEDS.txt line by line (checked all before/after and experiment rows). The creatures' damage share is now the largest on every map (53.6-73.6 %), traps 8-31 %.
5. Decision rows UD-80..84 and the remark row quote the Human exactly as in the Work Order block; the DK2 cannon statement is recorded as a remark that led to the Turret and bridge, not as a decision.

- Info: Bellows Gallery win rate fell 54 % to 15 % and Crownkiln is 32 %; expected swing, flagged by the worker for balancing.
- Info: the Studio decision section says "awaiting independent review"; update after closure.
- Info: POSIX build and sanitizer were not run (worker states this); I only ran the MSVC build.
- Info: Design/Bible/TRAP_WIRING_CATALOGUE.md still describes chains (outside this order; worker listed it).
- Info: Crownkiln determinism (200 seeds twice) was taken from the worker's raw summary, not re-run.
