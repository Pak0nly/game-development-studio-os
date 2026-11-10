# WORKER_RESULT UR-UNREAL-SUMMON-V1

Worker verify-worker: PASS (receipt 3b9e94b3646509249a2d79857bd876dcaed65d6b0ad488aa7e4f91fd301dab33). Base: game repository HEAD 951f937 (rules 5).
Nothing committed or pushed. `SimulationCpp` and tuning unchanged. Not independently reviewed.

## What changed (all under Game/)

1. Resync to rules 5 (commit 951f937): `python Game/Scripts/sync_sim.py sync` (356 files, seed 8 replay out, seed 2 won in; `sync_sim.py` now lists
   `golden_reasonable_seed2_won`). Wrapper adaptation: `UnderreignSim.Build.cs` sets `CppCompileWarningSettings.ShadowVariableWarningLevel = Off`
   for this module (JobBoard.cpp has a local `cand` that shadows a member; Unreal makes that an error; the Lib copy is not edited).
   Tests: seed 8 replaced by seed 2 (`URSimTests.cpp`, `URLinkPrecheckTests.cpp`). PlayerOrders: the camp opens at tick 1145x and the bot
   orders the attack at 11461, so the attack checks play to 11460; the replay spends gold on the way, so the trap and chain checks use a second
   game at tick 10800 (gold ~319).
2. Summon: key **B** (free; documented) and a green tool-bar button "B  Cinderling +1 (75 gold)  4/10" (grey when it would be refused; reads price,
   cap and count from the rules' tuning). `FURSimGame::EnqueueSummon/GetWorkerCap/GetSummonCost`, `UURSimSubsystem::OrderSummon`,
   `AURPlayerController::PressSummon`. The rules decide; accepted: tool bar "(cinderling summoned (75 gold))" even with no tool lit (8 s), feed
   "A new cinderling.", the cinderling spawns at the Heart. Refused: centre message + feed "No new cinderling: not enough gold (a cinderling costs 75)."
   / "... you already have the most cinderlings allowed (10)."
3. HUD: top panel "Cinderlings 4 / 10"; cinderling tooltip "working, job: digging" (job kind from the job board per agent; haul, re-arm, repair,
   install part, dig, stair, shaft, claim). Start "how to play" panel (new line 6) and F1 help (B line) mention it; README and SPIELANLEITUNG.md updated.
4. Capture modes `summon` (10 steps) and `summonpoor` (4 steps, map `summon_poor.map.txt` = Cinder Hollow with start gold 200).

## Results (logs in this folder)

- `test_sim.log` (exit 0, all 6 Automation tests Success): GoldenReplays 4/4 PASS (new seed 2 won: tick 12619, hash 64c3ad176b8c4c00), CommandPath
  177 commands, 21 of 21 check hashes, LinkPrecheck 34 checks, LinkReach 19 checks (the STAIRREACH "nobody can reach" logic still matches the new
  job matching: the rules still test "a work spot in the cinderling's region"; ring 0 20 7 unreachable, then reachable and built), PlayerOrders
  45 checks 0 failed (12 new: price/cap/start, six summons accepted, 10 cinderlings 50 gold, CapReached, newest cinderling at the Heart,
  NotEnoughGold at tick 8800 of seed 2 with 21 gold), SyncManifestGuard 356 files of 951f93741e60.
- Parity vs the headless runner of the same commit (built from the manifest commit): reasonable seed 1, 2400 ticks, `capture_playstills_parity.log`:
  `UR_PARITY check` PASS at ticks 600, 1200, 1800, 2400 (hash 93d5bd03f8c4204a), RESULT PASS.
- `capture_summon.log`: `UR_TOOL_TEST RESULT PASS (0 of 10 steps failed)`: button text and counts at the start, B accepted (5 cinderlings, 425 gold),
  feed line, new one at the Heart, five more through the button's call (10/10), refusal at the cap in words (centre, feed), dig order, tooltip
  "Cinderling (your worker) - working, job: digging", F1 help lists B. `capture_summonpoor.log`: 4 of 4 PASS: 200 gold, two summons, third refused
  "not enough gold (a cinderling costs 75)".
- `startcheck_schonmodus.log`: `Play Underreign (Schonmodus).bat -RenderOffscreen -nosplash -unattended -URCapture=startcheck -URIntro`: RESULT PASS
  (0 failed), 30.0 fps average, t.MaxFPS 30; stills show the green button.
- All runs frame-capped (UR_SAFESTART t.MaxFPS 60, Schonmodus 30), offscreen, one editor process at a time.

## Skipped under the Director's narrowing note (no scope widening)

stairfix, stairreach, existing tooltest, playround reruns, the extra scripted-opening before/after walking note, extra stills. Note: the old
playround recording (reasonable seed 1, tick 11988) no longer works under rules 5: that game is lost at tick 11709 (golden seed 1 is a lost replay),
so the round has no camp to attack; one playround attempt with seed 2 at tick 11460 failed 12 of 32 steps for lack of gold (29 gold). I stopped there; a new
playround recording is a follow-up. Earlier in this task, tooltest 29/29, stairfix 13/13 and stairreach 18/18 were run once
after the resync and the summon code (before the narrowing note) and passed; their logs were not kept.
Before/after walking numbers for the record (from the rules Worker, `Evidence/UR-SIM-WORKER-JOBS-V1/WORKER_RESULT.md`, dig-heavy opening, first 7:30):
8.0 -> 2.6 cells walked per job, walking share of busy time 50 % -> 28 %, 207 -> 358 jobs finished.

## Stills (`stills/`)

`start_running.png` (Schonmodus, button 4/10), `start_intro.png` (start panel with line 6), `summon_button_start.png`, `summon_accepted.png`,
`summon_cap.png`, `summon_nogold.png`, `summon_job_tooltip.png`, `summon_help.png`.

## Open points

- The playround proof needs a new recording (see above). The summon tool test does not click the Slate button (it calls the same `PressSummon`).
- In `summon_nogold.png` a stray "Basalt" tooltip from the scripted cursor shows at the top left (capture artefact).
- Button colour and wording are proposals. Key B is mapped in code only (no config).
