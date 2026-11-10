# Worker result: UR-SIM-WORKER-JOBS-V1 (cinderlings take nearby work and stay put)

Status: Worker result, not independently reviewed, nothing committed or pushed. Date: 2026-11-10.

Studio copy of `C:/GameDev/Underreign/Evidence/UR-SIM-WORKER-JOBS-V1/WORKER_RESULT.md`; the evidence files it names
(`before/`, `after/`, `analysis/`, `checks/`) are in that external folder, the code in `C:/GameDev/Underreign/SimulationCpp`.

Gate: `PASS worker receipt 14766c3d08c6ec181418d2966bcdf2bc50b08458dc74a192f3bd7b8e65c0657b` (verify-worker, run at
the Studio repository root before any change).

Baseline: external repository `C:/GameDev/Underreign`, branch `main`, HEAD `4a7ca3a` at dispatch. During this order
the parallel work committed `2e32dd6` (UR-UNREAL-STAIRREACH-V1) and `18854c3` (UR-DECISIONS-R7-V1); neither touched
`SimulationCpp` (`git diff --name-only 4a7ca3a HEAD -- SimulationCpp` is empty). This order changed only
`SimulationCpp/` and `Evidence/UR-SIM-WORKER-JOBS-V1/`; `Simulation/` (C#) and `Game/` were not touched. The C++
rules are now rules version 5 (`SaveWriter::RulesVersion`). SimulationCpp compiled and all tests passed at every save
point; no Unreal, no GPU work, at most 8 compiler processes.

## Result in plain words

1. **Diagnosis confirmed.** Within one priority the old rule took the jobs oldest first and gave each the nearest idle
   cinderling. One idle cinderling therefore always took the oldest job, wherever it was. Claim jobs are made one at a
   time as neighbours of each newly claimed tile, so two areas to claim were served in turns: one tile here, one tile
   at the other end of the dungeon. The trace shows it plainly (reasonable bot, seed 1, cinderling 2 between 5:52 and
   7:28: it claims single tiles at (1, 27, 20), (2, 11, 22), (0, 27, 20) and (2, 8, 23), walking 35-41 cells for each;
   cells as layer index, x, y).
2. **Change.** Now each idle cinderling takes the open job nearest to itself (same priority order as before). After
   claiming a tile it takes the next tile beside it; after digging a rock it digs on at the neighbouring marked rock;
   if two jobs are equally near, the one nearer its last job wins (it keeps its work area). Integer math, fixed
   tie-breaks, deterministic. No priority changed.
3. **Effect.** In a dig-heavy opening (the Human's kind of play: many digs marked at once, no traps) the cinderlings
   walk 2.6 instead of 8.0 cells per job, spend 28 % instead of 50 % of their busy time walking and finish 358 instead
   of 207 jobs in the first 7:30. With the reasonable bot, claims cost 7.9 instead of 11.4 cells of walking, and
   claim-to-claim back-and-forth is gone (9.5 cases per play before, 0 after). What back-and-forth is left is almost
   all the gold carry (dig at a vein, carry to the Hoard, walk back): the gold has to get there.
4. **Balance.** Win rate about the same for the reasonable bot (46 → 45 of 200), better for the varied opening
   (31 → 44); wave 2 is almost never lost any more (16 → 2 and 13 → 1); wave 3 (unchanged, UD-53) still decides most
   games. The economy runs about half a minute to a minute and a half earlier.

## 1. Diagnosis (headless trace)

Tool: the new `ur_headless jobtrace` command (headless only, never changes the game; `SimulationCpp/README.md`,
section "Job trace"). Both builds use the same trace code: "before" is HEAD `4a7ca3a`'s rules (the five job files
taken from Git into a scratch copy) plus the trace command; "after" is this candidate. Cinder Hollow,
`Data/Maps/prototype.tuning.txt`. Openings:

- **Reasonable bot**, seeds 1-20, whole games (`before|after/jobtrace_reasonable_seeds1-20.*`); also
  **reasonable-varied**, seeds 1-20 (`jobtrace_varied_seeds1-20.*`).
- **Dig-heavy opening** (`--opening digs`, seed 1, first 4500 ticks = until wave 1): at tick 1 the stair, every dig
  area of the map's hints and the first two veins are marked (about 150 rock cells for 4 cinderlings), then nothing
  else: no rooms, no traps, no summons (`jobtrace_digopening_seed1.*`). It stands for the Human's own round: many
  digs at once, no traps. The opening is deterministic (no intruders before wave 1), so one seed suffices.

Measures: cells walked per finished job (by kind); cinderling time idle / walking / working / fleeing; walking share
of busy time (walk / (walk + work)); cells walked for jobs given back; "far job taken while a same-priority job 5+
cells nearer waited" (at the moment of assignment); claim/dig jobs with a walk of 10+ cells; hops of 10+ cells between
two finished jobs of one cinderling; A-B-A back-and-forth (two hops of 10+ cells in a row where the third place is
back within half the first hop of the first). Distances: Manhattan + 4 per layer.

### Numbers before / after

| Measure | Dig-heavy opening, before | after | Reasonable, before | after | Varied, before | after |
|---|---|---|---|---|---|---|
| Jobs finished (per play) | 207 | 358 | 578.8 | 601.9 | 579.3 | 586.4 |
| Cells walked per finished job | 7.98 | 2.58 | 13.97 | 12.85 | 14.29 | 12.83 |
| - per claim | 12.12 | 2.17 | 11.36 | 7.92 | 11.47 | 7.83 |
| - per dig | 5.03 | 3.33 | 12.06 | 13.31 | 12.72 | 13.15 |
| - per gold carry | 9.00 | 9.00 | 18.93 | 19.90 | 19.07 | 19.34 |
| Walking share of busy time | 50.1 % | 28.0 % | 76.0 % | 74.4 % | 76.1 % | 74.5 % |
| Time idle / walking / working / fleeing | 4.6 / 47.8 / 47.6 / 0 % | 11.7 / 24.8 / 63.5 / 0 % | 14.5 / 60.3 / 19.1 / 6.1 % | 16.8 / 57.3 / 19.7 / 6.1 % | 15.4 / 60.1 / 18.9 / 5.5 % | 14.9 / 58.3 / 19.9 / 6.9 % |
| Far job taken while a nearer one waited | 48 | 0 | 82.8 | 13.1 | 70.7 | 15.9 |
| Claim/dig walks of 10+ cells | 48 | 19 | 181.3 | 153.8 | 176.4 | 143.7 |
| Hops of 10+ cells between jobs | 46 | 18 | 285.0 | 261.5 | 280.1 | 250.5 |
| A-B-A back-and-forth | 10 | 1 | 118.0 | 107.9 | 116.9 | 103.6 |
| - claim, claim, claim | | | 9.5 | 0 | | |
| - with a gold carry in it | | | 101.6 (86 %) | 98.0 (91 %) | 100.3 (86 %) | 98.1 (95 %) |
| Cells walked for jobs given back | 0 | 20 | 1163 | 1141 | 1085 | 1247 |

Per-play values for the 20-seed runs. Kinds of the A-B-A cases: `analysis/aba_*_before|after.txt` (script
`analysis/aba_by_kind.py`, reads the `_jobs.csv`).

Reading the numbers:

- **The Human's case is the dig-heavy opening.** Before, digs (priority 4) were taken oldest first: a cinderling at
  the far end of the deep corridor was sent to an old mark at the other end (single walks of 31, 40 and 64 cells), and
  when the digging was done the claims were again served oldest first (12 cells per claim, walks of 30+ cells for one
  tile). After: 2-3 cells per job, and nearly two thirds of the cinderlings' time is work. The idle share rises
  (4.6 → 11.7 %) only because the work runs out: from 6:36 the cinderlings finish one after another (last jobs at
  6:36, 6:52, 7:11), and at the end one claims the single-file Layer 1 tunnel alone (claiming needs a claimed
  neighbour, so only one can work there).
- **Reasonable bot:** claims are a third cheaper and the claim ping-pong between the vein area (Layer 3) and the old
  stair's landing chamber (Layer 2) is gone. Total walking falls less, because most walking in a bot game is the
  gold carry (19-20 cells per carry), placing trap parts from the Forge (44-50 cells) and running from intruders
  (19,800 cells per 20 plays given back while fleeing, unchanged). Digs walk slightly more (12.1 → 13.3): the
  cinderling that dug the vein cell carries the gold to the Hoard and then walks back to the next vein cell.
- **Remaining back-and-forth** in bot games: 91 % of the A-B-A cases contain a gold carry (dig at the vein, carry to
  the Hoard, back to dig or claim at the vein). That is the economy loop, not a wrong choice of job.
- **Priorities checked (task 2, last item):** the trace shows no back-and-forth caused by a priority. Player-marked
  digs (4) before claims (5) cause no ping-pong now that digs are nearest-first (the dig-heavy opening has 1 A-B-A
  case in 7:30); gold to storage (3) causes the carry loop, but lowering it would only leave gold lying and not
  shorten the walk to the Hoard; stairs (4), placing trap parts (2) and repair/re-arm (1) appear in 6 % of the cases
  (mostly carrying a part from the Forge on Layer 2 to a trap on Layer 1, which is the job itself), and cases of claims
  and digs alone (the priority-4-before-5 order) are 3.7 % (reasonable) and 1.3 % (varied). **No priority was
  changed.**

## 2. The change (rules version 5)

Full description: `SimulationCpp/README.md`, section "Rules changed in UR-SIM-WORKER-JOBS-V1".

- `JobBoard::AssignIdleWorkers` (phase 4): priority by priority (0 first, unchanged) the open jobs are checked in id
  order exactly as before (invalid: cancelled; near an intruder: wait; cannot start: blocked; no work spot: blocked
  as unreachable when somebody is idle). The remaining candidates of that priority are then matched with the idle
  cinderlings worker-centred (`MatchPriority`): the nearest (cinderling, job) pair with a work spot in the
  cinderling's region goes first, then the next nearest, until nobody idle or no candidate is left. Order of a pair:
  estimate `Manhattan * 10 + |dLayer| * 40` from the cinderling to the job (unchanged formula), then the estimate from
  the job to the cinderling's work area, then the lower job id, then the lower cinderling id. A* is run for the chosen
  pair; no path: the job is blocked (unreachable) and the cinderlings that had it as their best look again.
  Candidates nobody idle took: priority 0-1 may pre-empt a worker on a priority 4-5 job (in id order, the nearest such
  worker: unchanged rule); otherwise, if somebody is still idle, nobody idle can reach the job and it is blocked as
  unreachable (unchanged rule). The per-tick assignment limit `job.MaxAssignmentsPerTick` is kept.
- `Worker::LastJobCell` (new, in the state hash): the target cell of the last job the cinderling finished, set in
  `WorkerSystem::Act`. It is the work area of the tie-break.
- `SaveWriter::RulesVersion` 4 → 5 (saves of rules 4 are refused).
- **Tuning:** no new tuning key and no tuning value changed. The work-area tie-break has no number; there is nothing
  to mark as a proposal beyond the rule itself (which is a proposal as a whole, like the rest of rules 5).
- **Diagnostics:** `Headless/JobTrace.cpp|.h` (`jobtrace` command; listed in the runner's usage text).

Cost: the job-assignment phase is not slower (bench 5 x 128 x 128, 20 cinderlings: phase 4 mean 0.035 ms before and
after, max 1.95 → 0.19 ms). The bench's mean tick rises 0.10 → 0.29 ms because the bench game itself plays differently:
19 of 20 cinderlings are alive at the end instead of 4, so far more digging changes the map and the creatures' field
cache is rebuilt more often (phase 3 "field cache" 0.007 → 0.199 ms; `checks/bench.txt`).

## 3. Tests

Run: `Build/release/ur_tests.exe` → 739 passed, 0 failed, 0 skipped (`checks/tests.txt`); full rebuild without
warnings (`checks/build_rebuild.txt`); `build.bat` also builds. 728 tests before; 11 new.

New tests (`Tests/WorkerJobTests.cpp`, 11). Seven of them fail under the old rule (checked by building this file
against the old job code in a scratch copy, with the three uses of the new field taken out):

| Test | Checks | Old rule |
|---|---|---|
| `NearestFirst_IdleCinderlingTakesTheNearestJob_NotTheOldest` | one idle cinderling, an older far job and a newer near one: it takes the near one | fails (took the oldest) |
| `NearestFirst_TwoCinderlings_EachTakesTheJobBesideItself` | two cinderlings, two jobs: each takes the one beside it | passes (guard) |
| `NearestFirst_EquallyNearJobs_TheOneNearerTheWorkAreaGoesFirst` | equal distance: without a work area the lower id, with one the job on its side | fails |
| `NearestFirst_FinishedJob_BecomesTheWorkArea` | `LastJobCell` is set when a job is finished | (new field) |
| `NearestFirst_PriorityStillComesFirst` | a priority-1 job across the pocket beats the rock beside the cinderling | passes (guard: priorities unchanged) |
| `Claiming_SpreadsOutwardFromTheCinderling_RowByRow` | two rows to claim: the row beside the cinderling tile by tile, then the other | fails: (6,3) (6,7) (7,3) (7,7) ... |
| `Claiming_EachNextTileTouchesTheLastOne_WhileOneIsLeftThere` | each claim touches the previous one, except one change of row | fails: 7 jumps |
| `Digging_ContinuesAtTheNeighbouringMarkedRock` | rock marked alternately in two rows: it digs its own row to the end first | fails: alternates |
| `NoPingPong_OneCinderlingCrossesBetweenTheRowsOnce` | claiming both rows costs exactly 16 cells of walking | fails: 68 cells |
| `NoPingPong_TwoCinderlingsKeepTheirOwnRows` | two cinderlings each claim only their own row | passes (guard) |
| `Assignment_IsDeterministic_SameCommandsSameHash` | three cinderlings, a dig area, 1500 ticks: same hash twice, work done | passes (guard) |

Existing tests changed (6 test bodies, plus the golden-replay data), each because the old assignment is replaced:

| Test | Change | Why |
|---|---|---|
| `HeadlessTests.GoldenReplay_ReachesItsFinalHash` (cases) | `golden_reasonable_seed8_won` → `golden_reasonable_seed2_won`; the other three re-recorded | rules 5 re-recording; under the golden tuning seed 8 is now lost in wave 3, seed 2 is won and covers the attack goal |
| `OpeningVariationTests.OptionOff_SendsExactlyTheGoldenReplayCommands` | expected final hash `ca990fe850c6dfc4` → `efcb6610e418cc40` | the same re-recording (seed 1) |
| `AttackGoalTests.ReasonableBot_CinderHollowSeed1_...` | renamed `..._CinderHollowSeed2_...`, seed 1 → 2 | seed 1 is now lost in wave 3 with `prototype.tuning.txt`; seed 2 is the first seed the bot wins, so it carries the check of the attack flow (all its assertions unchanged) |
| `SaveTests.Determinism_ShortMultiWaveGame_SameSeedSameHash` | seed 9 → 1 | the determinism checks passed; the scenario check "the first machine dealt damage" failed: the cinderlings now finish the dig row (2..6, 2) under the trapped corridor before the first Scout arrives, and with seed 9 the intruders walk round the plate. Seed 1 keeps what the game is meant to cover (all assertions unchanged) |
| `StyleBotTests.Trapper_BuildsMoreMachinesBeforeWave1_ThanTheReasonableBot` (3 cases) | the comparison counts installed trap parts instead of ordered machines (new helper `InstalledParts`) | the reasonable bot now also orders both of its wave-1 machines in time (2 = the trapper's 2); the trapper's lead is in parts actually installed at wave 1 (4 vs 2 in all three seeds). The trapper's own minimum (2 machines) is unchanged |

No other test needed a change: all job, haul, claim, priority, pre-emption and blocking tests of the C# port
(`JobTests` and others) pass unchanged.

## 4. Golden replays (rules 5, `SimulationCpp/Data/Replays`, tuning `golden.tuning.txt` unchanged)

| File | Ends | Final hash | sha256 |
|---|---|---|---|
| `golden_reasonable_seed2_won.save.txt` | Won 12619 (21:01), camp | `64c3ad176b8c4c00` | `f3a353dde3433616...` |
| `golden_reasonable_seed1_lost.save.txt` | Lost 11665 (19:26), wave 3 | `efcb6610e418cc40` | `9378f696109cd0e7...` |
| `golden_reasonable_seed4_lost.save.txt` | Lost 11545 (19:14), wave 3 | `efa90375b5d01aa0` | `6191331d393df581...` |
| `golden_idle_seed1_lost.save.txt` | Lost 8795 (14:39), wave 2 | `c7ee7807a2cbf636` | `1d507148c3364a65...` |

All four replay to their final hash (`checks/golden_replays.txt`, and the test). The four rules-4 replays and their
tuning snapshot were moved unchanged to `Data/ReplaysLegacy/rules4/`, with a note `Data/ReplaysLegacy/README.md`; the
rules-3 replays stay at the top of `Data/ReplaysLegacy`.

## 5. Balance (200 seeds, Cinder Hollow, `prototype.tuning.txt`, compared with rules 4)

Files: `before/batch_*`, `after/batch_*` (CSV, flow CSV, summary). Tuning and the waves unchanged (wave 3 as decided).

| | reasonable, rules 4 | rules 5 | varied, rules 4 | rules 5 |
|---|---|---|---|---|
| Won | 46 (23 %) | 45 (23 %) | 31 (16 %) | 44 (22 %) |
| Lost in wave 2 | 16 | 2 | 13 | 1 |
| Lost in wave 3 | 138 | 153 | 156 | 155 |
| Time to win, mean (median) | 20:50 (21:02) | 21:08 (20:56) | 21:05 (21:05) | 21:13 (21:14) |
| Goal opened → win, mean | 1:30 | 1:50 | 1:45 | 1:52 |
| Forge built, mean | 3:10 | 2:34 | 3:06 | 2:36 |
| First trap part installed, mean | 5:53 | 4:20 | 5:31 | 3:53 |
| Gold mined by 5 / 10 / 15 / 20 min (mean) | 750 / 1801 / 2482 / 3054 | 1000 / 1768 / 2529 / 3161 | 748 / 1750 / 2412 / 2982 | 783 / 1698 / 2477 / 3077 |
| Gold spent by 5 / 10 / 15 / 20 min (mean) | 805 / 1608 / 2838 / 3495 | 1001 / 2149 / 3011 / 3700 | 898 / 1822 / 2882 / 3491 | 1000 / 2123 / 2982 / 3631 |
| Gold mined in total / at the end, mean | 3064 / 306 | 3173 / 218 | 2997 / 237 | 3090 / 190 |
| Heart damage wave 1 / 2 / 3, mean | 49 / 329 / 682 | 59 / 156 / 825 | 61 / 240 / 810 | 54 / 168 / 849 |
| Intruders killed by traps, mean | 1.9 | 1.1 | 1.8 | 2.4 |
| Creatures died, mean | 3.4 | 3.0 | 3.1 | 3.1 |

Short balance note: the faster cinderlings move the economy forward (Forge 36 s, first trap 1:33 earlier for the
reasonable bot; 1,000 instead of 750 gold mined in the first five minutes), so the second wave meets a finished
defence and is almost never lost. The win rate is unchanged for the fixed opening and up 6 points for the varied one;
wave 3 still decides about three quarters of the games (P8 band 50-85 % still missed, as with rules 4). Wins end
about 20 s later on average. Gold mined by minute 10 is about the same (storage and the bot's vein pace limit it),
and more is spent earlier. The bot's own play is unchanged, so its trap kill counts move with timing, not with design.

## Open issues

1. **Remaining walking is the gold carry.** In bot games 91-95 % of the remaining back-and-forth is dig → carry to the
   Hoard → back to the vein (19-20 cells per carry; the deep vein is 8 cells west of the Heart pocket, the Layer 2
   veins one layer up). Options for a separate order if the Human still sees too much running: carry more per trip
   or pick up neighbouring piles, a Hoard near the vein (player choice), or let the bot place one. Not changed here.
2. **Win rate still below the target band** (23 % / 22 %, P8 50-85 %); wave 3 unchanged as decided (UD-53).
3. **Unreal module out of date.** `Game/Underreign/Source/UnderreignSim` holds its own copy of the library (rules 4).
   After this candidate is accepted and committed it needs a resync of `JobBoard.cpp|.h`, `Worker.cpp|.h`,
   `WorkerSystem.cpp`, `SaveWriter.h` (rules 5); the parity check against the headless run must be redone, and any
   Game code that reasons about which cinderling takes a job (the parallel order UR-UNREAL-STAIRREACH-V1 shows "no
   cinderling can reach") should be checked against the new matching. Not touched here (Game was read-only).
4. **Bench workload changed** (mean tick 0.10 → 0.29 ms on the big generated map) because more cinderlings survive and
   dig there; job assignment itself is not slower. If the bench is used as a performance gate, its baseline needs
   re-recording.
5. **Distance is the straight estimate**, not the walking distance (as before): on a map where a job just across a
   wall is a long walk round, the cinderling may still choose it. Cinder Hollow's layers meet only at the
   breakthrough points, so the layer weight (4 cells per layer) can make a job on the next layer look nearer than it
   is; the trace shows no case worth a change. Walking distance would need a search per idle cinderling.
6. The dig-heavy opening is this order's own definition of "an idle-heavy dig opening" (stair, every dig hint and the
   first two veins marked at tick 1, nothing else); the Director may want a different script for later comparisons.

## Files

External repository (not committed):
- Changed: `SimulationCpp/Private/Jobs/JobBoard.cpp`, `Public/UnderreignSim/Jobs/JobBoard.h`,
  `Private/Jobs/Worker.cpp`, `Public/UnderreignSim/Jobs/Worker.h`, `Private/Jobs/WorkerSystem.cpp`,
  `Public/UnderreignSim/Save/SaveWriter.h`, `Headless/Program.cpp`, `README.md`, tests `AttackGoalTests.cpp`,
  `HeadlessTests.cpp`, `OpeningVariationTests.cpp`, `SaveTests.cpp`, `StyleBotTests.cpp`, the three re-recorded
  replays in `Data/Replays`.
- New: `Headless/JobTrace.cpp|.h`, `Tests/WorkerJobTests.cpp`, `Data/Replays/golden_reasonable_seed2_won.save.txt`,
  `Data/ReplaysLegacy/README.md`, `Data/ReplaysLegacy/rules4/` (moved rules-4 replays and tuning copy).
- Removed from `Data/Replays`: `golden_reasonable_seed8_won.save.txt` (moved to `Data/ReplaysLegacy/rules4/`).
- Evidence: `Evidence/UR-SIM-WORKER-JOBS-V1/` (`before/`, `after/`, `analysis/`, `checks/` with tests, rebuild log,
  golden replays, bench, `source_diff.patch`).
