# Worker result: UR-COMMANDS-V1 (rally banner and alarm for the creatures, rules 7, and the game)

Copy of the external Worker result C:/GameDev/Underreign/Evidence/UR-COMMANDS-V1/WORKER_RESULT.md (with the batches,
checks, game logs, stills and source diffs); the code lives in the external repository. Relative paths below
(`checks/`, `game/`, `stills/`, `after/`, `experiments/`, `headless/`) are inside that external evidence folder.
Studio changes of this order: `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md` (section "Second own test round —
2026-11-10", UD-54 and UD-55) and `Projects/Underreign/Docs/OPEN_DECISIONS.md` (OD-18 "Pick up and drop creatures").

Status: Worker result, not independently reviewed, nothing committed or pushed. Date: 2026-11-10.

Gate: `PASS worker receipt 9f6b6f8405e2ec875755363968a844172a557564880d93126619d7114bd987fb` (verify-worker, run at the
Studio repository root before any change).

Baseline: external repository `C:/GameDev/Underreign`, branch `main`, HEAD `6427850` (rules 6 committed; the game still
on rules 5). Changed: `SimulationCpp/`, `Game/`, `Evidence/UR-COMMANDS-V1/` (external); Studio
`Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`, `OPEN_DECISIONS.md`, `Artifacts/Underreign/Evidence/UR-COMMANDS-V1/`.
`Simulation/` (C#) untouched. Rules version 6 -> 7. At most 8 compiler processes; every Unreal run offscreen,
frame-capped at 30 fps, one process at a time, no Human-started Unreal process was running.

## The rules in plain words (all numbers are proposals)

**Rally banner** (`PlaceBannerCommand L X Y`, `LiftBannerCommand`; game: key G / button "G Banner", key L / button
"L Lift banner"):
- One banner on claimed floor you can stand on, any layer. Planting it elsewhere moves it; L lifts it. It falls by
  itself if its floor becomes a hole. Refused (in this order): outside the map, rock or a hole, not claimed, already
  there (or lift without a banner), not enough gold. Cost `banner.PlaceCost` = **0** (proposal; works when set > 0).
- While it stands, every creature that can walk there (stairs included) and is not leaving, not retreating to recover
  (below 30 % health until back at 60 %) and not sulking walks to the banner's cell. Already within
  `banner.GatherRadius` = **2** cells of it (same layer), it stays where it is. A creature that cannot reach it keeps its
  normal life.
- Fighting still comes first: an intruder within 6 cells on the way or at the banner is fought, then the creature goes
  back to the banner. The banner wins over the Heart alarm, the alarm and the camp attack order.
- **Needs (plain rule):** rallied creatures do not eat, sleep, collect pay or train; hunger, tiredness and pay owed keep
  growing and the usual mood penalties apply; a sulking creature stops following the banner. When it is lifted, every
  creature decides again at once and sees to its needs.

**Alarm** (no key):
- Up while an active intruder (not a camp guard) stands on claimed ground.
- A creature with nothing to do (goal idle or none: no pay, food, sleep or training due), not leaving / retreating /
  sulking, that can walk to such an intruder within `alarm.Steps` = **20** steps (any layer, stairs count), goes for the
  nearest one (re-planned once a second) until it is within fight range and fights; afterwards it returns to normal
  life. Every creature decides at once when the alarm goes up. `alarm.Steps = 0` switches it off.
- It never pulls a creature away from the banner (Rally is more urgent than the alarm goal).

Brain priority now: Fight, **Rally**, Heart alarm, Recover, Leave, camp Attack, pay, eat, sleep, train, **Defend**
(alarm), idle. Camp guards were excluded from the alarm after a first run showed the bot's camp floor is claimed: the
camp stays an explicit order (UD-48).

## What changed

SimulationCpp (rules 7):
- New `Creatures/RallySystem` (banner + alarm list, hashed), `Commands/PlaceBannerCommand`, `LiftBannerCommand`,
  `View/RallyView.h`; `ISimView::GetRally()`; `CreatureGoal::Rally` (1) and `Defend` (10), values from `Alarm` on moved,
  `Creature::GoalCount` 13; `CreatureBrain` (Needed / StillWanted / Start for both, `AlarmInReach`, `StartDefend`, no
  retry delay for the alarm search); `SimGame` (system, hash, `Rally->Update` before the creature brain, `GetRally`);
  tuning keys `banner.PlaceCost`, `banner.GatherRadius`, `alarm.Steps` (written out as proposals in
  `prototype.tuning.txt` and `golden.tuning.txt`); events `BannerPlaced`, `BannerLifted`, `AlarmChanged`,
  `CreatureAnsweredAlarm`; `SpendReason::Banner`; metrics / CSV columns `banner_placed`, `banner_moved`,
  `banner_lifted`, `alarms_raised`, `alarm_answers` (appended), three batch summary rows, one run summary line;
  `CommandFactory` (two commands); `SaveWriter::RulesVersion` 7.
- Bots: standard bots unchanged (they never plant the banner). Opt-in bot names `reasonable-banner` /
  `reasonable-varied-banner` (`ReasonablePlayerBot::UseBanner`: banner on the Heart from a wave's warning to its end).
- Golden replays re-recorded; rules-6 files moved to `Data/ReplaysLegacy/rules6` (with their tuning snapshot).
- README sections "Rules changed in UR-COMMANDS-V1", `Data/ReplaysLegacy/README.md`.

Game:
- Resynced to rules 7 **from the working tree**: there was no working-tree option, so `sync_sim.py sync --worktree` was
  added (copies the text exactly as git would store it, computes the same blob ids, manifest `source-commit
  WORKTREE-<HEAD>`); `sync_sim.py check` PASS (363 files). **After the Director's commit a plain `python
  Game/Scripts/sync_sim.py sync` must be run** (the library files come out byte-identical; only the manifest header
  changes) and `build.sh` / `test_sim.sh` repeated. `sync_sim.py` also lists the rules-7 replays now.
- Wrapper `FURSimGame`: `EnqueuePlaceBanner`, `EnqueueLiftBanner`, `GetRally()` (`FURSimRally`),
  `FURSimAgent::Goal` / `IsRallied()` / `IsOnAlarm()`; `GetSummonCost()` now returns the rules' current (rising) price;
  round report (F9) "Orders" line with banner and alarm counts.
- Subsystem: `OrderBanner`, `OrderLiftBanner`, `BannerRefusalText`, feed lines (planted / moved / lifted / fell, ALARM
  at most once per 30 s game time). Controller: `EURTool::Banner`, keys G and L, pre-check mirroring the rules, tool
  text, tooltips ("rallied to the banner", "answering the alarm", the banner itself). HUD: buttons "G Banner",
  "L Lift banner", a line "Rally banner on Layer N (x,y): k follow it, m there" / "ALARM: ...", F1 help, start panel
  (item 7), summon texts with the rising price. Play view: lime pole and flag, lime frames on the gather cells, lime
  ball over rallied creatures, orange cone over creatures on alarm, orange frame under intruders on claimed ground.
- Tests: `URSimTests.cpp` (rules-7 goldens incl. the banner replay; CommandPath on seed 4 won; PlayerOrders: rising
  price, cap with a flat price, banner refusals / plant / same cell / move / lift, alarm at tick 4960 of seed 4, banner
  during the alarm), `URLinkPrecheckTests.cpp` (seed 4 replay).
- Capture: new mode `banner` (26 steps), step option `PollTicks`, `capture.sh` mode `banner` and `URGENTLE=1`; the
  `summon` / `summonpoor` expectations follow the rising price.
- `Game/README.md`, `Game/SPIELANLEITUNG.md` (items 8-10, keys G / L, statistics).

## Tests (SimulationCpp): 750 -> 768, all pass (`checks/tests.txt`); full `build.bat` without warnings (`checks/build_full.txt`)

New `Tests/RallyTests.cpp` (18): defaults and keys; refusals in order, plant, cost paid, same cell, move, lift, not
enough gold; banner falls on a hole; creatures walk to the banner over a stair and stay (view counts); fight on the way,
then back; needs wait, lift sends the tired one to bed at once; sulking / leaving / retreating do not follow; moving
re-routes; the Heart alarm does not pull rallied creatures, after the lift it does; unreachable banner keeps normal
life; alarm: idle creature over a stair 12 steps away answers, kills, returns, events; off claimed ground / beyond 20
steps nobody; camp guards raise no alarm; `alarm.Steps = 0` off; sleeping and sulking creatures do not answer, the idle
one does; the alarm does not pull from the banner (after the lift it does); the standard bot never plants, the banner
bot plants at the Heart; a save with banner commands replays to the same hash.

Existing tests changed (each on purpose):

| Test | Change | Why |
|---|---|---|
| `CombatTests.Creature_IgnoresIntrudersOnOtherLayersOrBeyondSix` | `alarm.Steps = 0` in its tuning | the alarm would now send the idle hound to the Scout on the claimed corridor; the test is about the fight radius alone |
| `CombatTests.Creature_BelowThirtyPercent_LeavesTheFight_RecoversInItsBed` | `alarm.Steps = 0` | the healed hound would go back to the Brute on claimed floor before tick 400; the test checks retreat and bed |
| `SaveTests.CommandFactory_RoundTripsEveryCommand` | the two banner commands added to the command list | every known command must be covered |
| `HeadlessTests.GoldenReplay_ReachesItsFinalHash` (cases) | `seed2_lost` -> `golden_banner_seed4_lost`; the other three re-recorded | rules 7; seed 2 is won now, the banner replay covers both new commands |
| `OpeningVariationTests.OptionOff_SendsExactlyTheGoldenReplayCommands` | expected hash `1c3dd54c393ee939` -> `ae5487c9c5e71e30` | the rules-7 re-recording of seed 1 |

Isolation check: with `alarm.Steps = 0` (and no banner) rules 7 give, for 200 of 200 seeds of both standard bots, the
same values as rules 6 in all 118 non-timing CSV columns (`checks/alarm_off_*`), so the only behaviour change for the
bots is the alarm.

## Golden replays (rules 7, `SimulationCpp/Data/Replays`, tuning `golden.tuning.txt`; `checks/golden_replays.txt`)

| File | Ends | Final hash |
|---|---|---|
| `golden_reasonable_seed4_won.save.txt` | Won 12383 (20:38), camp | `3da2ddd3b74eb521` |
| `golden_reasonable_seed1_lost.save.txt` | Lost 11819 (19:41), wave 3 | `ae5487c9c5e71e30` |
| `golden_banner_seed4_lost.save.txt` | reasonable-banner, lost 11565 (19:16), wave 3; 3 plantings, 2 lifts | `08947fc63118c3d1` |
| `golden_idle_seed1_lost.save.txt` | Lost 8795 (14:39), wave 2 | `d5b3cde0979e122a` |

## Balance (200 seeds, Cinder Hollow, `prototype.tuning.txt`; before = `../UR-SIM-SUMMON-COST-V1/after`)

`checks/balance_table.md` (made by `checks/balance_table.py` from the CSV files in `after/` and `experiments/`):

| | reasonable r6 | r7 | varied r6 | r7 | banner bot (exp.) | varied banner bot (exp.) |
|---|---|---|---|---|---|---|
| Won | 52 (26 %) | 82 (41 %) | 39 (20 %) | 70 (35 %) | 29 (14 %) | 36 (18 %) |
| Lost in wave 2 / 3 | 1 / 147 | 0 / 118 | 1 / 160 | 1 / 129 | 6 / 165 | 17 / 147 |
| Time to win, mean | 20:49 | 21:19 | 21:08 | 21:24 | 21:54 | 21:45 |
| Heart damage wave 1 / 2 / 3 | 59 / 160 / 796 | 30 / 123 / 702 | 59 / 166 / 861 | 47 / 123 / 760 | 8 / 150 / 882 | 5 / 268 / 799 |
| Creature damage dealt | 1066 | 1233 | 986 | 1182 | 1154 | 1124 |
| Creatures died / retreats | 2.8 / 6.4 | 4.2 / 9.5 | 3.2 / 6.9 | 4.6 / 9.9 | 3.8 / 7.4 | 4.0 / 8.4 |
| Cinderlings died | 8.9 | 7.0 | 9.0 | 7.0 | 11.3 | 9.7 |
| Pay missed | 1.1 | 1.1 | 1.0 | 1.0 | 7.0 | 6.8 |
| Gold mined | 2996 | 3149 | 2894 | 3072 | 2744 | 2729 |
| Alarms / creatures answering | 0 / 0 | 3.0 / 11.1 | 0 / 0 | 3.0 / 10.1 | 3.0 / 0 | 3.0 / 0 |

Balance note: the alarm alone (the standard bots never plant a banner) raises the win rate by about 15 points (26 ->
41 %, 20 -> 35 %): the alarm goes up once per wave, about 11 creatures answer per game, Heart damage falls in every
wave, fewer cinderlings die and a little more gold is mined; creatures fight more and die or retreat a little more.
Wave 3 (unchanged, UD-53) still decides most games (59 % / 65 % lost there); the P8 band (50-85 %) is still missed.
**Bots and the banner:** parking every creature at the Heart for a whole wave is clearly worse (14 % / 18 %): the
creatures stop meeting intruders at the traps and on the way, wages are missed (about 7 per game, needs wait) and more
cinderlings die. A second variant (banner on the first intruder on claimed ground, lifted when the alarm is over) was
also worse (18 % / 17 %, `experiments/banner_at_first_alarm_*.md`, made with an earlier build of this order whose bot
code was then reverted). So the standard bots do not use the banner; the banner is a tool for the player's own
judgement (move it to where the intruders come).

## Game proof (logs in `game/`, stills in `stills/`)

- Build: `build.sh` succeeded without warnings (UBT, 8 parallel actions).
- `game/test_sim.log`: 6 Automation tests Success: GoldenReplays 4/4 (incl. the banner replay), CommandPath 181
  commands, 20/20 check hashes, LinkPrecheck 34, LinkReach 19, **PlayerOrders 72 checks 0 failed**, SyncManifestGuard
  363 files (`WORKTREE-6427850...`).
- Parity, 4 ticks: `game/capture_playstills_parity.log`: reasonable seed 1 (headless save
  `headless/reasonable_seed1_t2400.save.txt`, recorded with the same working-tree rules) played through the game's
  order path: `UR_PARITY check` PASS at 600, 1200, 1800, 2400, RESULT PASS (hash `34801088a016ec94`).
- Banner and alarm tool test: `game/capture_banner.log`, `UR_TOOL_TEST RESULT PASS (0 of 26 steps failed)`: warp to
  4400 (seed 1), summon button shows the rules' price (125 at 6 cinderlings), G, rock refused before any order, planted
  at layer 3 (19,17), 4 of 4 creatures rallied and marked, they come down the stair, tooltips, same cell refused in
  words, moved to layer 2 (22,3), they follow up the stair, L lifts, nobody rallied, L again "No banner to lift", the
  alarm of wave 1 goes up, an idle creature answers (tooltip, HUD and feed "ALARM"), banner during the alarm: 4
  rallied, 0 on alarm, F1 help, start panel text, statistics line "banner planted 3 (moved 1), lifted 1 ... alarms
  raised 1, creatures answering an alarm 1".
- Summon capture (rising price): `game/capture_summon.log` 10 of 10 PASS (75 -> 100 on the button, three more at 100,
  125, 150, the fifth refused "a cinderling costs 175").
- Playround (open point of UR-UNREAL-SUMMON-V1): the old recording no longer reaches the camp; new recording
  `headless/reasonable_seed19_t11840.save.txt` (prototype tuning, camp open, 568 gold): `game/capture_playround.log`
  32 of 32 steps PASS, the attack takes the camp, Won at tick 12875, play again works. A seed-1 recording (camp open at
  11358, 332 gold) also reached the camp and won, but one chain step ran out of gold (31 of 32,
  `game/capture_playround_seed1_gold_short.log`).
- Gentle bat start check: `game/startcheck_schonmodus.log`: `Play Underreign (Schonmodus).bat -RenderOffscreen ...
  -URCapture=startcheck -URIntro`: RESULT PASS, 30.0 fps average, GPU 1.64 ms, t.MaxFPS 30, Medium, hardware RT off.
- Runs made: 1 test run (nullrhi) per build state, parity 2x, banner 3x (the first two before a visual change and the
  "walk to the banner's own cell" rule change; logs of the final run kept), playround 2x, summon 1x, start check 1x.

Stills (`stills/`): `banner/banner_summon_price.png`, `banner_planted.png`, `banner_gathered.png`,
`banner_hover_rallied.png`, `banner_moved.png`, `alarm_creature.png`, `banner_help.png`, `summon_price_refused.png`;
`startcheck/start_intro.png` (start panel with item 7), `start_running.png`; `playround/round_camp_open.png`,
`round_machine.png`, `round_attack_sent.png`, `round_end_screen.png`; `parity/play_rooms_layer2.png` (tick 2400 of the parity run; the other parity stills were not kept).

## Open points

1. **Sync after the commit:** the game library was synced from the working tree (`WORKTREE-6427850...`). After the
   commit: `python Game/Scripts/sync_sim.py sync`, `bash Game/Scripts/build.sh`, `bash Game/Scripts/test_sim.sh`
   (the HUD title then shows the commit instead of "WORKTREE"). Only the manifest's header lines should change.
2. **Numbers are proposals:** banner cost 0, gather radius 2, alarm 20 steps. The banner costs nothing, so moving it
   is free; the Human may want a cost.
3. **Needs while rallied** wait entirely (no eating, sleeping, pay). A banner left up for long makes creatures hungry,
   tired, unpaid and finally sulking (sulkers stop following). An alternative would be "leave the banner when starving";
   not done (plain rule asked).
4. Creatures walk to the banner's own cell, so several stand on one cell (drawn slightly apart). Spreading them over
   the gather area was not done.
5. The alarm goes up as soon as a wave steps on claimed ground near the entrance (the bots claim the landing), so in
   practice it is up for most of every wave; only creatures within 20 steps answer.
6. The `summonpoor` capture mode was updated for the rising price but not run.
7. In the stills a stale centre notice from the deliberately refused rock click stays on screen for a few seconds
   (capture artefact).

## Post-commit resync (after review PASS; rules part committed as f304732)

- `python Game/Scripts/sync_sim.py sync` from HEAD f304732: 363 files, **0 written**, 363 unchanged, 0 stale removed.
  Against the worktree sync, every `file` line of `Lib/SYNC_MANIFEST.txt` is identical; only the header lines changed
  (comment line, `source-commit f30473295f55d4b6bc73649bcc3df0f6e378f473`, commit date, subject, `synced-at`).
  `sync_sim.py check`: PASS (363 files of commit f30473295f55).
- `bash Game/Scripts/build.sh`: succeeded. `bash Game/Scripts/test_sim.sh` (headless, -nullrhi, one process): 6 of 6
  Automation tests Success (CommandPath, GoldenReplays, LinkPrecheck, LinkReach, PlayerOrders 72 checks 0 failed,
  SyncManifestGuard 363 files of commit f30473295f55). Log: `game/test_sim_post_commit.log`. Nothing committed.
