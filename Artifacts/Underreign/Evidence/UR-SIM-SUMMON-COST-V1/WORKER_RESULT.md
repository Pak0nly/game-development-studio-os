# Worker result: UR-SIM-SUMMON-COST-V1 (summoning a cinderling gets dearer with each one you have)

Copy of the external Worker result C:/GameDev/Underreign/Evidence/UR-SIM-SUMMON-COST-V1/WORKER_RESULT.md (with the batches,
checks and source diff); the code lives in the external repository.

Status: Worker result, not independently reviewed, nothing committed or pushed. Date: 2026-11-10.

Gate: `PASS worker receipt e050c5e7f106e823ef7704931f0e739fd765169483dc8dd0d06835860ea2293d` (verify-worker, run at the
Studio repository root before any change).

Baseline: external repository `C:/GameDev/Underreign`, branch `main`, HEAD `23aae72`, rules 5. This order changed only
`SimulationCpp/` and `Evidence/UR-SIM-SUMMON-COST-V1/` (external) and the Studio evidence folder; `Simulation/` (C#)
and `Game/` were not touched. SimulationCpp compiled and passed at every save point; no Unreal, no GPU work, at most
8 compiler processes. Rules version: 5 -> 6 (`SaveWriter::RulesVersion`).

## Result in plain words

1. **The price now depends on how many cinderlings are alive when you order.**
   `price = 75 + 25 x (living - 4)`, never below 75 (all three numbers are proposals, marked so in the tuning files and
   README). With the 4 start workers: 75, 100, 125, 150, 175, 200 for the next six (cap 10 unchanged). The five after
   the start workers cost 625 together instead of 375; all six up to the cap cost 825. A cinderling that dies makes
   the next one cheaper again (the dead do not count, even in the tick they die).
2. **Refusals unchanged:** cap reached (living at the cap) -> `CapReached`; gold below the current price ->
   `NotEnoughGold`, nothing spent.
3. **For the game button (read-only on `ISimView`):** `GetSummonPrice()`, plus `GetLivingWorkerCount()` and
   `GetWorkerCap()`. Enabled if living < cap and `GetGold() >= GetSummonPrice()`. Note for the Game Worker: every
   `ISimView` implementer (only `SimGame` here) must add the three methods; the Unreal copy of the library needs a
   resync of `SummonCinderlingCommand.*`, `Tuning.h`, `TuningParser.cpp`, `WorkerSystem.*`, `SimGame.*`, `ISimView.h`,
   `SaveWriter.h` and the bots (rules 6) before the button can show the price.
4. **Bots** (reasonable, trapper, greedy; `ReasonablePlayerBot::Summon`, `StyleBotBase::Summon`) now check the same
   price with their own living count before spending (`PriceFor`). Their targets and headroom are unchanged. They did
   not need a stop rule: they already buy only with a Hoard standing, within a gold budget and headroom, up to their
   target (6 early, 8 late for the reasonable bot), so they never fill the cap at the start. Reasonable bot opening:
   two summons within the first 22 ticks (75, then 100) as before, the next ones only from about 8:40 on (golden seed 1: tick 5181). Replacing lost
   cinderlings below 4 stays at the base price. Gold spent on cinderlings + links is 998 -> 990 (reasonable); the
   difference is tiny because the bots buy only up to 6-8 cinderlings.

## Changes (files)

External, all under `SimulationCpp` (not committed):
- `Public/UnderreignSim/Data/Tuning.h`, `Private/Data/TuningParser.cpp`: new keys `worker.SummonCostStep` (25),
  `worker.SummonCostFreeCount` (4); `worker.SummonCost` (75) is the base.
- `Public/UnderreignSim/Commands/SummonCinderlingCommand.h`, `Private/Commands/SummonCinderlingCommand.cpp`: static
  `PriceFor(tuning, living)`; the command uses the living count for both the cap and the price.
- `Public/UnderreignSim/Jobs/WorkerSystem.h`, `Private/Jobs/WorkerSystem.cpp`: `LivingCount()`.
- `Public/UnderreignSim/ISimView.h`, `SimGame.h`, `Private/SimGame.cpp`: the three view methods.
- `Private/Bots/ReasonablePlayerBot.cpp`, `Private/Bots/StyleBotBase.cpp`: price-aware `Summon`.
- `Public/UnderreignSim/Save/SaveWriter.h`: rules version 6.
- `Data/Maps/prototype.tuning.txt`, `Data/Replays/golden.tuning.txt`: the three summon keys written out, marked as
  proposals (same values as the code defaults, so no behaviour change from the files themselves).
- `Data/Replays/` re-recorded; rules-5 replays + the unchanged rules-5 tuning snapshot moved to
  `Data/ReplaysLegacy/rules5/`; `Data/ReplaysLegacy/README.md` and `README.md` updated.
- Tests: new `Tests/SummonCostTests.cpp`; changed `AttackGoalTests.cpp`, `BotHintTests.cpp`, `HeadlessTests.cpp`,
  `OpeningVariationTests.cpp`.
- Evidence: `Evidence/UR-SIM-SUMMON-COST-V1/` (`after/` batches, `checks/` with tests, full build, golden replays,
  `source_diff.patch`).

## Tests: 739 -> 750, all pass (`checks/tests.txt`); full `build.bat` without warnings (`checks/build_full.txt`)

New (`SummonCostTests.cpp`, 11): defaults are the proposal values; the price curve 75 75 75 75 75 100 ... 225 and the
625 sum; the curve follows the tuning numbers (and step 0 = flat); the three tuning keys parse; six summons in a row
cost 75, 100, 125, 150, 175, 200 and the view shows the price before each; at the cap the order is refused for the cap
(not gold); not enough gold for the current price (99 < 100 with five living, although the base 75 would have been
enough) is refused and spends nothing, exactly 100 pays; up to the free count the base price holds; dead cinderlings
lower the price (also at the cap: a dead one makes room, paid at the dear price); the reasonable bot's summons are
never refused (seeds 1-6); the reasonable bot does not buy all cinderlings at the start (4-6 alive at 1:00).

Existing tests changed (each because the flat price / the old replays are replaced):

| Test | Change | Why |
|---|---|---|
| `HeadlessTests.GoldenReplay_ReachesItsFinalHash` (cases) | `seed2_won` -> `seed4_won`; `seed4_lost` -> `seed2_lost`; seed1_lost and idle re-recorded | rules 6 re-recording; under the golden tuning seed 4 is the won game, seed 2 is lost in wave 2 (covers that outcome); idle has no summon and keeps its hash |
| `OpeningVariationTests.OptionOff_SendsExactlyTheGoldenReplayCommands` | expected hash `efcb6610e418cc40` -> `1c3dd54c393ee939` | the same re-recording (seed 1) |
| `AttackGoalTests.ReasonableBot_CinderHollowSeed2_...` | renamed back to `..._CinderHollowSeed1_...`, seed 2 -> 1 | with the rising price seed 1 wins again under `prototype.tuning.txt` (seed 2 is now lost); all assertions unchanged |
| `BotHintTests.ReasonableBot_WinHoard_StaysAboveTheGoalPlusMargin_WhileItSpends` | the spending model uses `PriceFor` with the living count; seed 1 -> 4 | seed 1 no longer buys anything after the last wave warning, so the check "still bought something" had nothing to test; seed 4 does buy; the assertions are unchanged |

All other tests, including `JobTests.Summon_CostsGoldAndRespectsCap` (flat map, no start workers, so base price), pass
unchanged.

## Golden replays (rules 6, `Data/Replays`, tuning `golden.tuning.txt`)

| File | Ends | Final hash |
|---|---|---|
| `golden_reasonable_seed4_won.save.txt` | Won 12459 (20:45), camp | `82c4c28ae73b5f67` |
| `golden_reasonable_seed1_lost.save.txt` | Lost 11546 (19:15), wave 3 | `1c3dd54c393ee939` |
| `golden_reasonable_seed2_lost.save.txt` | Lost 8735 (14:33), wave 2 | `f2a8186db6ce5f1f` |
| `golden_idle_seed1_lost.save.txt` | Lost 8795 (14:39), wave 2 | `c7ee7807a2cbf636` (unchanged) |

All four replay to their final hash (`checks/golden_replays.txt` and the test).

## Balance (200 seeds, Cinder Hollow, `prototype.tuning.txt`; before = rules 5 data of UR-SIM-WORKER-JOBS-V1 `after/`)

Files: `after/batch_reasonable.*`, `after/batch_reasonable-varied.*` (CSV, flow CSV, summary).

| | reasonable, rules 5 | rules 6 | varied, rules 5 | rules 6 |
|---|---|---|---|---|
| Won | 45 (23 %) | 52 (26 %) | 44 (22 %) | 39 (20 %) |
| Lost in wave 2 / wave 3 | 2 / 153 | 1 / 147 | 1 / 155 | 1 / 160 |
| Time to win, mean | 21:08 | 20:49 | 21:13 | 21:08 |
| Forge built, mean | 2:34 | 2:45 | 2:36 | 2:41 |
| Gold mined by 5 / 10 / 15 / 20 min | 1000 / 1768 / 2529 / 3161 | 1000 / 1768 / 2487 / 2979 | 783 / 1698 / 2477 / 3076 | 782 / 1694 / 2418 / 2878 |
| Gold spent by 5 / 10 / 15 / 20 min | 1001 / 2149 / 3011 / 3700 | 1026 / 2177 / 3053 / 3638 | 1000 / 2123 / 2982 / 3630 | 1023 / 2129 / 2981 / 3529 |
| Gold mined in total, mean | 3173 | 2996 | 3090 | 2894 |
| Heart damage wave 3, mean | 825 | 796 | 849 | 861 |
| Cinderlings died, mean | 10.8 | 8.9 | 10.3 | 9.0 |

Short balance note: the bots play almost the same (they buy the same cinderlings; only from the fifth one does the
price rise, and the headroom rule delays a purchase by a few seconds), so the win rate stays in the same low band
(23 -> 26 %, 22 -> 20 %; differences of this size are noise at 200 seeds) and wave 3 (unchanged, UD-53) still decides
about three quarters of the games. What the rule does show: from minute 10 on the bots mine 40-200 gold less in total
(fewer cinderlings alive on average, since replacing them is dearer). For a human the rule bites much harder than for
these bots: buying all six at once costs 825 instead of 450; the bots were never the "buy everything at once" player.
The P8 band (50-85 %) is still missed, as before.

## Open points

1. **Numbers are proposals** (75 / 25 / 4). With step 25 and a start of 4, the 10th cinderling costs 200 and a lost
   one at the cap costs the same; the Human may want a smaller step or a lower free count; all three are tuning keys.
2. **Several summons in one bot think** (early and late rule can both fire in one think) price the second one from the
   count before the first; the second can then be refused for gold or paid out of the headroom. The new bot test finds
   no refused summon in seeds 1-6, so this is cosmetic; not changed.
3. **Unreal module** (`Game/Underreign/Source/UnderreignSim`) holds its own copy (rules 5): it needs a resync to
   rules 6 (files above) and the parity run against the headless replays; the button should read `GetSummonPrice()`
   instead of a constant. Not touched here.
4. The "all five cost 625" of the order counts the five after the four start workers; a sixth (to the cap of 10) costs
   200 more (825 in all).
