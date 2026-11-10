# WORKER_RESULT UR-UNREAL-STATS-V1

Worker verify-worker: PASS (receipt 928ea2e924d9f718ae23ce5508ac8d07db52dd59b8c73d80f5a157ba9cb67890). Game repository HEAD 23aae72 plus uncommitted work.
Nothing committed or pushed. `SimulationCpp`, the synced library, rules and tuning untouched; no resync. Not independently reviewed. Function check only (Human's instruction).

## What changed (all under Game/)

- `URSimGame` (wrapper): attaches the rules' `MetricsCollector` in `Create`, feeds `AfterStep` after every `Step`; adds game-layer tracking (cinderling deaths with killer, last activity and distance to the Heart; per-tick activity shares; creatures that fought per wave and in the camp attack; intruder types per wave; rooms built with time; trap parts by kind; chains; summoned cinderlings; gold once a minute) and `BuildStatsReport(FURStatsContext)` (RunMetrics + MetricsFormat::KindName). Works at any time (running game gives a partial report; `Finish` is called and the damage listener re-attached).
- `UURSimSubsystem`: `BuildStatsReport`, `CopyStats` (clipboard + `Saved/Stats/<date-time>.md`, UTF-8, notice "Statistics copied", message with the path), ticks per speed, real and paused seconds.
- Key **F9** (`AURPlayerController::PressStats`, any time), green end-screen button "Copy statistics (F9)", end screen text shows the hint, then "copied ... saved to <path>"; F1 help lists F9.
- Capture mode `stats` (`capture.sh stats`, 1280 x 720, quality 2, VSync on, 60 fps cap): plays a warped golden replay to its end, presses F9, compares clipboard and file with the report, one still.
- `Game/SPIELANLEITUNG.md` (German section "Statistik kopieren"), `Game/README.md`.

## Results

- Build: `bash Game/Scripts/build.sh` succeeded (17 actions, 8 parallel max).
- One run: `capture.sh stats "-URScript=...golden_reasonable_seed1_lost.save.txt -URTuning=...golden.tuning.txt -URWarpToTick=11000 -URSpeed=4"`, offscreen, 60 fps cap, one editor process, no Human game open. 18 check hashes matched at the warp; game ended Lost at tick 11665 with the golden final hash efcb6610e418cc40 (so the collector does not change the rules' state). `UR_STATS_CHECK clipboard PASS (4056 chars), file PASS, RESULT PASS`. Log: `capture_stats.log`; report file: `stats_sample_golden_seed1_lost.md`; still: `stills/stats_end_screen.png` (end screen with the green button and the "copied, saved to" line).
- Side effect: the test run overwrote the clipboard of the PC with the sample report.
- Not run (function check only): tests, other capture modes. Not checked: a click on the Slate button itself (the capture presses the F9 key, which calls the same `PressStats`).

## Left out of the report (listed in its last line)

Per-creature kills, why intruders passed the creatures (routes), cinderling job mix, heat map, camera use, per-layer room counts. "Time share" is of agent-ticks (cinderlings: idle/walking/working/carrying; creatures: fighting/idle/eating-sleeping/other). "Distance from safety" is cells (and layers) to the nearest Heart tile. Creatures that fought per wave counts creatures seen with the fighting activity while that wave was live.

## Observations from the sample (scripted bot round, seed 1, lost) that match the Human's remarks

14 of 16 cinderlings died near the Heart column (21,17), nearly all "fleeing", killed by Brutes/Healers 1 to 2 cells from the Heart; wave 3 did 1000 Heart damage; creatures spent only 2 percent of their time fighting and 35 percent idle. (Observation only, no rules change.)

## Produced statistics block (sample)

```text
# Underreign round report
Result: LOST, Heart destroyed at 19:26 (tick 11665)
Rules: commit 951f93741e60 | Map: Cinder Hollow | Seed: 1 | Played: 2026-11-10 21:07:07
Speed used (game time): 1x 0%, 2x 0%, 4x 100% | real time 0:17, paused 0:01
Heart: 0 / 1000 now, lowest 0, damage taken 1300 | orders applied 182, refused 0

## Waves
| Wave | Arrives | Intruders | Killed | Escaped | Heart dmg | Ended | Creatures that fought |
|---|---|---|---|---|---|---|---|
| 1 | 7:30 | 3 (2x Scout, 1x Brute) | 1 | 2 | 100 | 8:55 | 3x Brand-hound, 1x Soot-moth |
| 2 | 12:30 | 5 (2x Scout, 2x Brute, 1x Healer) | 5 | 0 | 200 | 13:57 | 3x Brand-hound, 1x Soot-moth |
| 3 | 17:30 | 8 (2x Scout, 3x Brute, 3x Healer) | 4 | 0 | 1000 | - | 3x Brand-hound, 1x Soot-moth |
Intruders total: 16 spawned, 10 killed (7 by creatures, 2 by traps, 1 by heat), 2 escaped, 0 lost on the way

## Gold
Mined 3300 | spent 3913 | wages 370 | stolen 0 | on hand at the end 140
Spent on: rooms 805, trap parts 860, chains 40, cinderlings 1200, stairs 30, shafts 0, upkeep 380, training 228, pay 370
Gold on hand over time: 1:00 272, 2:00 159, 3:00 176, 4:00 248, 5:00 560, 6:00 622, 7:00 689, 8:00 632, 9:00 308, 10:00 210, 11:00 273, 12:00 365, 13:00 489, 14:00 254, 15:00 227, 16:00 324, 17:00 491, 18:00 794, 19:00 230, now 140
Mined per minute: 25, 75, 300, 325, 275, 50, 375, 175, 25, 125, 250, 125, 225, 75, 225, 50, 250, 325, 25

## Cinderlings
Now 6 / 10 | summoned 16 | died 14 | activity share: idle 15%, walking 41%, working 20%, carrying 18%
- died 8:37 at layer 2 (21,17): killed by Brute, was walking, 2 cells and 1 layers from the Heart
- died 8:41 at layer 3 (21,17): killed by Brute, was fleeing, 2 cells and 0 layers from the Heart
- died 13:42 at layer 3 (21,18): killed by Brute, was fleeing, 1 cells and 0 layers from the Heart
- died 13:43 at layer 3 (21,17): killed by Brute, was fleeing, 2 cells and 0 layers from the Heart
- died 18:36 at layer 2 (21,17): killed by Healer, was fleeing, 2 cells and 1 layers from the Heart
- died 18:38 at layer 2 (21,17): killed by Healer, was fleeing, 2 cells and 1 layers from the Heart
- died 18:46 at layer 2 (21,17): killed by Brute, was fleeing, 2 cells and 1 layers from the Heart
- died 18:47 at layer 2 (21,17): killed by Brute, was fleeing, 2 cells and 1 layers from the Heart
- died 18:49 at layer 3 (21,17): killed by Brute, was fleeing, 2 cells and 0 layers from the Heart
- died 18:49 at layer 3 (21,17): killed by Brute, was fleeing, 2 cells and 0 layers from the Heart
- died 18:51 at layer 3 (21,17): killed by Brute, was fleeing, 2 cells and 0 layers from the Heart
- died 18:51 at layer 2 (21,17): killed by Healer, was fleeing, 2 cells and 1 layers from the Heart
- ... and 2 more deaths

## Creatures
Arrived 6 (3x Brand-hound, 3x Soot-moth) | left 0 | died 6 | kept 0 (most at once 4) | retreats to recover 4
Time share: fighting 2%, idle 35%, eating or sleeping 17%, other 46% | pay collected 21, missed 0 (0 during waves)
Mood: 0 unhappy episodes, 0 resolved, 0 rooms too hot

## Rooms built
0:00 Hoard (+12 tiles, 60 gold); 1:44 Nest (+9 tiles, 90 gold); 1:45 Pantry (+9 tiles, 135 gold); 2:30 Forge (+9 tiles, 225 gold); 2:49 Nest (+7 tiles, 70 gold); 3:00 Pantry (+3 tiles, 45 gold); 6:00 Drill Hall (+9 tiles, 180 gold)

## Traps
Parts ordered 11, placed 11, chains made 8 | broken 13, re-armed 1, repaired 9, spotted by intruders 6, machines known 1
- PressurePlate: placed 4, triggered 14
- Tripwire: placed 1, triggered 3
- FlameVent: placed 2, fired 8, damage 379, kills 1
- CinderCharge: placed 2, fired 3, damage 510, kills 1
- ChainSnare: placed 1, fired 2, damage 0, kills 0
- DropHatch: placed 1, fired 5, damage 50, kills 0
Damage to intruders: traps 939, creatures 912, heat 326

## Milestones (game time)
First room 0:00 | Nest 1:44 | Forge 2:30 | first trap placed 4:20 | Call-stone awake 1:21 | first creature 2:00 | camp open - | attack sent -
Left out: per-creature kills, intruder routes (why they passed the creatures), cinderling job mix, heat map, camera use, per-layer room counts.
```
