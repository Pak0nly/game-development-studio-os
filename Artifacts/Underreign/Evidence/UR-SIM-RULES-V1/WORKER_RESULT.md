# Worker result: UR-SIM-RULES-V1 (fixed breakthrough points, attack goal, in the C++ rules)

Status: Worker result, not independently reviewed, nothing committed or pushed. Date: 2026-11-10.

Studio copy of `C:/GameDev/Underreign/Evidence/UR-SIM-RULES-V1/WORKER_RESULT.md`; the evidence files it names
(`before/`, `after/`, `diagnostics/`, `checks/`) are in that external folder, the code in `C:/GameDev/Underreign/SimulationCpp`.

Gate: `PASS worker receipt 2d02029a29daa4a6d08d0d3c8603daa593e28aaaf741378244b80e2b115b37e4` (verify-worker, run at
the Studio repository root before any change).

Baseline: external repository `C:/GameDev/Underreign`, branch `main`, HEAD `2179b10` at dispatch. During this order
the parallel order UR-UNREAL-03-V1 committed `75b3254` (only `Game/` and its own evidence; `SimulationCpp` untouched).
This order changed only `SimulationCpp/` and `Evidence/UR-SIM-RULES-V1/`; `Simulation/` (C#) and `Game/` were not
touched. The C++ rules are rules version 4 (`SaveWriter::RulesVersion`).

## Result in plain words

1. **Layers connect only at fixed breakthrough points (UD-37, UD-47).** Maps now list these points in a new block.
   Stairs, shafts and Drop Hatches can only be built on a point; Brutes can break through a floor only on a point.
   Side walls can still always be dug, each material taking its own time. When the Heart is walled in, Brutes dig
   sideways only (and cross layers at a point).
2. **The attack goal (UD-48).** When wave 3 has ended, the intruders' camp at the sinkhole opens with three guards.
   The player sends the creatures (one order for the whole realm); beating the guards and holding the camp for 30 s
   wins. Surviving the waves alone no longer wins Cinder Hollow. All camp numbers are proposals.
3. **Balance.** The reasonable bot wins far less often than before: 46 of 200 games (23 %) instead of 138 (69 %).
   Everything is lost in wave 3, not in the attack: every game that survives wave 3 also takes the camp. The cause is
   the Brutes' new tunnelling rule, analysed below. This needs a Director/Human decision (open issue 1).

## Audit of the old rules against UD-37 and UD-47 (UR-SIM-BREAKTHROUGH-CHECK)

| Where layers could be joined (rules 3) | Gap against UD-37/UD-47 | Change |
|---|---|---|
| `BuildStairCommand`, `BuildShaftCommand` (`BuildLinkRules`): any column with non-bedrock cells | yes: anywhere | only on a breakthrough point, else `NotABreakthroughPoint` |
| `LinkJobHandler` (the stair/shaft job digs the far cell vertically) | yes, through the commands | job invalid outside a point |
| Drop Hatch (`TrapSystem::CheckPlacement`): any claimed cell over open floor or a shaft | yes: a hatch opens the floor | only on a point (also the machine planner and `PlaceInstalled`) |
| Brute tunnel field (`TunnelField::StepCost`): break down through any floor, leaving a rough stair | yes (recommendation A of N-4, not adopted) | break down only from a point |
| `IntruderSystem::DigTick` (the downward dig itself) | yes | refused outside a point (defence in depth) |
| `DigCommand` / dig jobs | no: work spots are 4-neighbours on the same layer | none |
| Map stairs `>` and shafts `o` | no: they are the map's own fixed connections | they count as breakthrough points |
| Heat rising through rock (`/16`), Cinder Charge blast above/below via a link | no: physical effects, nobody passes | none (documented) |
| Agents dropping through an open hatch or a shaft; gold falling through a hole | no once hatches and shafts stand on points | none |

## Rule changes

Full description: `SimulationCpp/README.md`, section "Rules changed in UR-SIM-RULES-V1".

- **Map format.** New block `breakthroughs` (lines `L X Y`, the upper cell; map stairs and shafts are points by
  themselves) and new block `camp` (`area L X0 Y0 X1 Y1`, `opens after wave N`, `guards Type C, ...`). Both are
  validated with line numbers; `MapData::ToText` writes them back (round trip tested).
- **Breakthrough rule.** `CellFlags::Breakthrough` (64); `RejectReason::NotABreakthroughPoint` (19); tunnel field and
  `DigTick` restricted; `ISimView::IsBreakthrough`.
- **Attack goal.** `CampSystem` (phase 12, before the outcome); `IntruderGoal::Guard` and `Intruder::Guard/Post`
  (guards never flee, fight nearby creatures and cinderlings, keep to their post); `CreatureGoal::Attack` (more urgent
  than pay, food, sleep, training; less urgent than fights, the Heart alarm, recovering, leaving);
  `AttackCampCommand 1|0` (new command, saved and replayed); `RejectReason::AttackNotOpen` (20); events
  `AttackGoalOpened`, `AttackOrdered`, `CampHold`; `GameWon` D = 1 for a camp win; `ISimView::GetAttackGoal()`
  (`AttackGoalView`), `IntruderView::Guard`. On a map with a camp only the held camp wins; maps without a camp keep the
  old win rule. A camp and `win hoard` on the same map are refused.
- **Proposals (tuning and map values):** `camp.HoldTicks` = 300 (30 s), `camp.GuardRadius` = 4; Cinder Hollow's camp
  `area 0 18 1 20 5` (the sinkhole and the first tunnel cells), `opens after wave 3`, `guards Scout 2, Brute 1`.
  The work breakdown proposed "a marked enemy foothold on a lower layer"; Cinder Hollow's Heart is on the deepest
  layer, so the camp sits where the intruders come from (the top layer), reached through the breakthrough points.
- **Bots.** Reasonable (and varied) and style bots send the creatures once, at their next think after the goal opens.
- **Metrics/report.** New metrics columns (appended): `attack_open_tick`, `attack_order_tick`, `camp_hold_start_tick`,
  `camp_hold_breaks`, `guards_spawned`, `guards_killed`, `won_by_camp`; guards are not counted as wave intruders;
  batch summaries have attack rows; `run` prints an attack line.
- **Data.** `SimulationCpp/Data/Maps` (copies of all maps and tuning files of `../Simulation/Maps`, with breakthrough
  points on every map and the camp on Cinder Hollow and its two test-play variants); `Data/Replays` (new golden
  replays); `Data/ReplaysLegacy` (the rules-3 golden replays, unchanged copies, parity record). The tests read only
  `SimulationCpp/Data` now. Cinder Hollow points: (0, 27, 21) map stair, (1, 21, 17) player's stair, (0, 20, 7) Long
  Fall hatch. Campaign m2: (1, 20, 25); m3: (1, 22, 28), (1, 22, 22); m1 as Cinder Hollow.

## Test changes

Run: `Build/release/ur_tests.exe` → 728 passed, 0 failed, 0 skipped (`checks/tests.txt`); full rebuild without
warnings (`checks/build_rebuild.txt`). 684 tests before; 44 new.

New tests (44): `Tests/BreakthroughTests.cpp` (23: parser block and its 5 errors, map stair as point, stair/shaft/
hatch only on a point, tunnel field step costs, sealed Heart with no point never breaks a floor, sealed Heart with one
point: digs sideways to it, breaks through only there, digs sideways to the Heart, material dig times, view, every
stair/shaft/hatch hint of all six data maps stands on a point, Cinder Hollow's three points) and
`Tests/AttackGoalTests.cpp` (21: camp block read/write and 10 errors, camp needs waves and excludes `win hoard`,
unknown guard type, map without camp still won by the waves and refuses the order, goal opens after the wave with the
guard at its post and no win from defending, order/repeat/bad value/call back, creatures beat the guard and win after
exactly the hold time, an intruder in the camp breaks the hold, guards never flee, Heart destroyed after opening still
loses, reasonable bot on Cinder Hollow seed 1 sends the creatures and wins by the camp).

Existing tests whose code changed (5), each because the old rule was replaced:

| Test | Change | Why |
|---|---|---|
| `HeadlessTests.CinderHollow_NoRouteAtStart_BruteDigsDownToTheHeart_IdleBotLosesSeed1` | renamed `..._BruteDigsSidewaysToTheBreakthroughPoint_IdleBotLosesSeed1`; idle bot loses in wave 2 (was 1); the only Layer-2 stair is on the point (1, 21, 17); Heart damage counted in wave 2 | the floor beside the landing chamber can no longer be broken (UD-37/47). The wave-1 Brute digs sideways toward the point but its pace limit sends it home first; the wave-2 Brute breaks through on the point. Plan F-19.5 ("doing nothing loses") still holds, at 14:39 instead of 9:47 |
| `HeadlessTests.GoldenReplay_ReachesItsFinalHash` (cases) | `golden_reasonable_seed1_won` → `golden_reasonable_seed1_lost`; new case `golden_reasonable_seed8_won` | rules 4 re-recording; under the golden tuning seed 1 now loses in wave 3, seed 8 is the won game and covers the attack |
| `OpeningVariationTests.OptionOff_SendsExactlyTheGoldenReplayCommands` | replay file name and expected final hash (`ca990fe850c6dfc4`) | the same re-recording |
| `BotHintTests.ReasonableBot_ShaftHint_BuildsTheShaft` | the test map declares a breakthrough point on the shaft cell (1, 21, 6) | a shaft needs a point |
| `SaveTests.CommandFactory_RoundTripsEveryCommand` (its `AllCommands` list) | adds `AttackCampCommand 1` | the test covers every known command |

Test infrastructure (not test bodies):
- `MapBuilder` (test map helper) declares every column whose two cells are not bedrock a breakthrough point by
  default (`EveryColumnBreakthrough`), and `Breakthrough(l, x, y)` switches that off for a test that declares its own
  points. Reason: 54 existing tests build stairs, shafts and hatches, or let Brutes break floors, on hand-made maps to
  test those mechanics (jobs, traps, machines, heat, memory, intruders, hardening); with the default they keep
  testing the mechanics unchanged, while the new tests and the data maps test where the points are. Two of them
  (`IntruderTests.Intruder_BruteBreaksDownThroughFloor_LeavingRoughStair`, `..._OthersFollowDiggingBrute_...`) now
  mean "breaks through at a breakthrough point" on that map. Affected without a code change: HardeningTests 4,
  JobTests 5, TrapTests 11, AllMachinesTests 1, DownPaymentTests 6, FloorExitTests 5, LongFallTests 5,
  MachinePlannerTests 3, MemoryTests 1, RoomTests 1, ScenarioTests 1, IntruderTests 4, HeatTests 1,
  StarvingAndBrokeTests 2, TrapEdgeTests 2, TrappedIntruderTests 2.
- `TestMaps::Blueprint` (the tech design example map) gains a `breakthroughs` block with its stair point (1, 8, 1)
  at the end of the text (used by `DeterminismTests.Determinism_SameSeedSameCommands_SameStateHash`).
- `HeadlessTests` and `BotHintTests` look for data in `SimulationCpp/Data` instead of `../Simulation` (two
  `BotHintTests` had silently read the frozen C# maps).
- `expected_tests.txt` is left as the record of the 684 C# names.

## Golden replays (rules 4, `SimulationCpp/Data/Replays`, tuning `golden.tuning.txt` unchanged)

| File | Ends | Final hash | sha256 |
|---|---|---|---|
| `golden_reasonable_seed8_won.save.txt` | Won 12781 (21:18), camp | `28f79f5b9beefd39` | `b2f568206f62f2e1...` |
| `golden_reasonable_seed1_lost.save.txt` | Lost 11706 (19:30), wave 3 | `ca990fe850c6dfc4` | `50cb5c0af5e3bdb1...` |
| `golden_reasonable_seed4_lost.save.txt` | Lost 8678 (14:27), wave 2 | `a78fe9a805879b88` | `587d4b2a7fae1493...` |
| `golden_idle_seed1_lost.save.txt` | Lost 8795 (14:39), wave 2 | `626e9e7124f05d4e` | `b0995bc69ec2baa7...` |

All four replay to their final hash (`checks/golden_replays.txt`, and the test). The three rules-3 replays are kept
unchanged in `Data/ReplaysLegacy` (rules 4 refuses them by design).

## Balance before and after (200 seeds, Cinder Hollow, `prototype.tuning.txt`)

Before = HEAD `2179b10` (rules 3, `../Simulation/Maps`), after = this candidate (`SimulationCpp/Data/Maps`). Files:
`before/`, `after/` (CSV, flow CSV, summary).

| | reasonable before | reasonable after | varied before | varied after |
|---|---|---|---|---|
| Won | 138 (69 %) | 46 (23 %) | 93 (47 %) | 31 (16 %) |
| Lost in wave 2 | 16 | 16 | 13 | 13 |
| Lost in wave 3 | 46 | 138 | 94 | 156 |
| Lost after wave 3 / in the attack | - | 0 | - | 0 |
| Win time, mean (median) | 19:14 (19:13) | 20:50 (21:02) | 19:18 (19:13) | 21:05 (21:05) |
| Goal opened → win, mean (min-max) | - | 1:30 (0:58-2:49) | - | 1:45 (0:52-2:33) |
| Heart damage wave 3, mean | 447 | 682 | 651 | 810 |
| Intruders killed by traps, mean | 2.7 | 1.9 | 2.7 | 1.8 |
| Creatures died, mean | 1.8 | 3.4 | 1.7 | 3.1 |

Waves 1 and 2 play almost as before (the same wave-2 losses; mean Heart damage in waves 1 and 2 within 1 %). All 46 (31) games that
survive wave 3 take the camp; the three guards were beaten every time and no hold ever broke, so the attack goal as
proposed is easy. Wins now end around 21:00, and only 22 of 46 wins end in the old 18:00-21:00 band (P8 check).

**Why wave 3 got harder** (diagnostics, temporary code that is not in the candidate; outputs in `diagnostics/`):
- With only the tunnel field's new line switched off (Brutes may again break any floor; everything else of this
  candidate on), the same 200 seeds give exactly the old 138 / 16 / 46 and all 138 also win the camp
  (`diagnostics/old_tunnelling_reasonable_200.md`). The whole drop therefore comes from the Brutes' tunnelling rule.
- No Brute actually breaks a floor or digs a wall in these games, before or after (seeds 1-40: 0 floor breaks under
  rules 3, 0 floor breaks and 0 sideways digs under rules 4). The effect is on behaviour while
  no walkable route exists: the Long Fall's Drop Hatch at (0, 20, 7) opens for 5 s and cuts the only Layer 1 tunnel.
  Under rules 3 the intruders north of it switched to the tunnel field and the Brutes stopped where they stood to
  start breaking the floor into the creatures' yard below (they never finished before the hatch closed), so the wave
  stayed spread out. Under rules 4 they keep walking toward the hole to dig around it and arrive bunched. Seeds 1-40,
  wave 3: Long Fall drops 155 → 106, trap kills 83 → 46.
- One mitigation tried (not adopted): intruders whose route is cut while any Drop Hatch is open wait where they stand.
  Result 66 / 200 won (33 %) (`diagnostics/wait_at_open_hatch_reasonable_200.md`). Treating an open hatch as passable
  for the tunnel field changed nothing in aggregate (46 / 200).

## Open issues

1. **Balance decision needed.** Win rate 23 % (reasonable) / 16 % (varied) is far below the night's target band
   (plan F-19.5: 50-85 %). Options for a separate order: weaken wave 3, a waiting rule at an open hatch (33 % alone),
   a fourth Cinder Hollow breakthrough point placed so the old pressure returns in a visible place, or bot/trap
   changes. The attack goal itself is easy (guards Scout 2 + Brute 1 always beaten, 1:30 mean); its numbers need the
   planned Human look at M3.
2. **The idle bot now loses in wave 2 (14:39) instead of wave 1 (9:47)** on Cinder Hollow.
3. **Campaign maps have no attack goal.** They keep "survive every wave" (m1, m3) or `win hoard` (m2). UD-48 says a map
   is won by an active goal; the campaign missions are night proposals and need their own goals (not invented here).
4. **Unreal module out of date.** UR-UNREAL-03-V1 synced the library from `2179b10` (rules 3). After this candidate is
   accepted and committed it needs a resync: new files (`CampSystem`, `AttackCampCommand`, `MapCamp`,
   `AttackGoalView`), two new pure virtual `ISimView` methods (implemented by `SimGame`), `CreatureGoal` values from
   `CollectPay` on moved up by one, data from `SimulationCpp/Data` instead of `../Simulation`. Its parity check against
   the headless run must be redone with rules 4.
5. **C# reference diverges on purpose.** `../Simulation/README.md` still describes the rules-3 behaviour (floor
   break-downs, win by waves); it is frozen. `SimulationCpp/README.md` lists the differences.
6. **UD-18 note.** `AttackCampCommand` is a realm-wide order (like a call to arms), not direct control of a creature;
   the Director may want the Human to confirm this reading at the M3 look.
7. The intruders' camp is on the top layer (where they enter), not on "a lower layer" as the work breakdown proposed,
   because Cinder Hollow's Heart is already on the deepest layer.
