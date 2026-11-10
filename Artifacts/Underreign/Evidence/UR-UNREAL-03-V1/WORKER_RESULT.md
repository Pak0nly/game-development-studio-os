# UR-UNREAL-03-V1 — Worker result: the C++ rules in Unreal, connected (jobs UR-UNREAL-03 and 04)

Status: proposal, awaiting independent review. Nothing committed or pushed.
Worker: Claude Code subagent (requested model opus), 2026-11-10.

## Gate

`verify-worker` at the Studio root: `PASS worker receipt 0292fb358d063635288212827434810b3d41de6dc78e55660522c6efeb9b419a`.

External repository at the start and at the end: branch `main`, HEAD `2179b10`
(the C++ port commit). The parallel order UR-SIM-RULES-V1 had uncommitted
changes in `SimulationCpp`; they were not read into the game (see Sync).
`SimulationCpp` and all other protected paths were not edited.

## What was built

| Task | Result | Where |
|---|---|---|
| 1 Module | `Game/Scripts/sync_sim.py` copies `SimulationCpp/Public` and `/Private` (124 `.cpp`, 219 headers) plus the golden replay data (6 files) from the committed blobs of `HEAD` (`git ls-tree` / `git cat-file`, never the working tree) into `Game/Underreign/Source/UnderreignSim/Lib`, and writes `Lib/SYNC_MANIFEST.txt` (commit `2179b10d050fd76e3ef61c17f5d4ed8a918d79a3`; per file: git blob id, SHA-1 of the text without CR, SHA-256, size). `check` verifies Lib against it; `headless` exports the whole `SimulationCpp` of the manifest's commit to `Game/Underreign/Saved/SimHeadless/2179b10d050f` and builds `ur_headless.exe` there. The module compiles the copy unchanged: `bEnableExceptions = true`, `bUseRTTI = false`, `PCHUsage = NoPCHs`, `bUseUnity = false`; no warnings. **No source changes were needed**, and no warning switches either. The wrapper `FURSimGame` (Unreal types only, every call guarded) and `FURSimScript` (save-file command lists) are the only way in; no ursim header is visible outside the module. | `Game/Scripts/sync_sim.py`, `Source/UnderreignSim/` |
| 2 Tests in Unreal | Automation tests `Underreign.Sim.GoldenReplays`, `Underreign.Sim.CommandPath`, `Underreign.Sim.SyncManifestGuard`, run headless by `Game/Scripts/test_sim.sh` (`-nullrhi`): all PASS. Guard negative test: one appended line in `Lib/Private/Core/Core.cpp` makes the guard FAIL (and `sync_sim.py check` FAIL); a new sync restored the identical bytes. | `logs/automation_tests.txt`, `logs/guard_negative_test_one_edited_file.txt` |
| 3 Game clock and commands | `UURSimSubsystem` (tickable world subsystem): loads map and tuning (`-URMap=`, `-URTuning=`, `-URSeed=`), 10 ticks per second of game time, pause, speed 1x / 2x / 4x, at most 8 ticks per frame; read-only `GetSim()` and `GetTickAlpha()`; orders `OrderDig`, `OrderCancelDig`, `OrderBuildRoom`, `OrderText` as simulation commands; event feed `OnTicked` (every tick, with the events) and `GetFeed()` (readable lines, refusals named). Scripted play `-URScript=` with check-hash comparison, `-URStopAtTick=` with `UR_PARITY RESULT`. | `URSimSubsystem.h/.cpp` |
| 4 Greybox follows the rules | `AURGreyboxMap::SyncFromSim` each tick: dug cells, claimed ground, dig marks (cyan stripes), rooms of the rules (not the map's hints), stairs and shafts that exist, unbuilt fixed breakthrough points as white frames, loose gold, trap parts (placed / planned). One signature per layer; only changed layers are rebuilt, instances added in batches. Heat not drawn yet (optional later). | `URGreyboxMap.h/.cpp` |
| 5 Minimal play | Build tools in `AURPlayerController`: 1 dig (again: unmark), 2 rooms (again / Shift: next / previous of the five), left drag rectangle on the focused layer with a per-cell preview (valid cells in the tool colour, others grey), right click cancels a drag, undoes a mark under the cursor or leaves the tool; Esc; Space pause; + / - speed. `AURPlayView`: cinderlings (soot capsule with an ember dot), creatures (warm white, orange band, one shape per type), intruders (blue, one shape per type), interpolated between the previous and current tick position. HUD from the state: clock and speed / PAUSED, gold (+ loose), Heart HP, wave timer, counts, seed, event feed, tool line, library commit. | `URPlayerController`, `URPlayView`, `URHUD` |
| 6 Proof | see below | `Game/Captures/play_*`, `tool_*`, `logs/` |
| 7 Docs | `Game/README.md` updated (module, sync, tests, clock, orders, keys, proof runs, limits) | |

## Parity check (game layer vs headless at the same tick)

1. `python Game/Scripts/sync_sim.py headless` built `ur_headless.exe` from the
   synced commit `2179b10d050f` (exported from git, not the working tree).
2. That runner played the reasonable bot, seed 1, Cinder Hollow,
   `prototype.tuning.txt` (the copies in `Lib/Data`), to tick 2400 (4:00) and
   saved the 33 commands it gave: `headless/reasonable_seed1_t2400.save.txt`,
   final hash `0c201910b8e0a620`, checks at 600 / 1200 / 1800 / 2400.
3. The game (`-game`, offscreen, 4x, fixed 30 fps) played that command list
   through the subsystem's order path and stopped at tick 2400:

| Tick | Game layer | Headless | Result |
|---|---|---|---|
| 600 | `0af76610fe0375e1` | `0af76610fe0375e1` | PASS |
| 1200 | `684d57cf8aced035` | `684d57cf8aced035` | PASS |
| 1800 | `23d73368a30f25b2` | `23d73368a30f25b2` | PASS |
| 2400 | `0c201910b8e0a620` | `0c201910b8e0a620` | **PASS** |

`UR_PARITY RESULT PASS` in both the sequence run and the stills run
(`logs/capture_playseq.txt`, `logs/capture_playstills.txt`), and the same
four checks in the real-time frame-time run (`logs/perf_play4x.txt`).
In addition the headless runner of the synced commit replays the three golden
replays to their final hashes (`logs/headless_golden_replays.txt`), and the
Unreal module reaches the same hashes (`Underreign.Sim.GoldenReplays`; the
seed-1 won replay also through the order path, 19 of 19 check hashes).

## Captures (looked at)

| File | Content |
|---|---|
| `Game/Captures/play_4x/0000..0299.png` (960 x 540, 130 MB), `play_4x.gif` (640 x 360, every second frame, 12 MB) | 10 s of the game at 4x, fixed 30 fps, ticks 1560 to 1958, Layer 2: cinderlings walking the tunnel and digging, Nest (2:40), Pantry (2:49) and Forge (3:10) appearing in the Call-stone cave, dig marks, the first creature at 3:00, feed and HUD updating. Consecutive frames move the cinderlings in small steps (interpolation works). |
| `Game/Captures/play_overview_layer1..3.png`, `play_rooms_layer2.png`, `play_heart_vein_layer3.png`, `play_side_view_y21.png` (1920 x 1080) | the state at tick 2400, paused (HUD "PAUSED", 3 creatures, 6 cinderlings, 4 rooms, gold 238) |
| `Game/Captures/tool_dig_drag.png`, `tool_room_nest.png` | dig rectangle preview being dragged; the Nest built by the room tool (feed: "Nest built: 14 tiles for 140 gold") |

Tool test (`logs/capture_tooltest.txt`): 15 of 15 steps PASS — dig drag marks
3 cells, right click undoes one mark, unmark drag, room tool builds a Nest on
claimed floor, cycling to Pantry, a Pantry on rock is refused and named in the
feed, right click leaves the tool, Space / + / - / 1 / Esc through the game
viewport (Enhanced Input). The setup's key test still passes (14 of 14).

## Frame time

1920 x 1080, Epic, offscreen, editor binary `-game`, uncapped, playing the
script at 4x with the camera on the Layer 2 rooms:

| Run | Frame avg | p99 | worst | GPU avg | Note |
|---|---:|---:|---:|---:|---|
| first run (15:16) | **7.10 ms (141 fps)** | 12.75 ms | 29.8 ms | 5.93 ms | 4 frames over 16.7 ms in 20 s |
| final run (`logs/perf_play4x_summary.txt`) | 10.80 ms | 76.1 ms | 292 ms | 5.95 ms | another Worker's compiler and test processes were running |
| control, clock paused, demo overview, same time (`logs/perf_demo_control_summary.txt`) | 6.61 ms | 48.4 ms | 184 ms | 3.47 ms | the render-thread spikes appear without the rules too |

Simulation step: mean 20–28 us, p99 51–78 us. Greybox rebuild on the game
thread: about 3 per second at 4x, mean 0.85–1.24 ms, max 2 ms in the
real-time run (12 ms and one 64 ms outlier in the offscreen fixed-step runs,
which ran beside other processes). The frame is render-thread bound; the
spikes are mostly machine load (they are in the control too), but a part may
be the render-side cost of rebuilding a layer's instances (see open issues).

## Open issues

- Per-layer instance rebuilds: fine at 1 ms on the game thread; their
  render-thread cost (proxy recreation, Lumen / ray-tracing scene update) is
  not separated from the machine-load spikes. A per-cell update (or Movable
  instance components) is the next optimisation if a quiet-machine run shows
  rebuild spikes.
- The setup modes (`stills`, `sequence`, `demo`, `inputtest`) now show the
  live start state with the clock paused; the committed setup captures were
  not regenerated (the stair hint now shows as a frame until built).
- Not in this order: trap wiring UI, stair / shaft tools, selection and
  tooltips, heat overlay, agents on the faint layer below, a packaged build
  (the map and tuning are read from `Simulation/Maps` by default).
- The mouse path (deprojecting the cursor to a cell) is not covered by the
  headless tool test, which drives the same tool functions directly; the keys
  go through the real Enhanced Input path.
- `Game/Captures/play_4x` adds 130 MB of PNG to Git LFS.

## Files (external, all under allowed paths)

New: `Game/Scripts/sync_sim.py`, `Game/Scripts/test_sim.sh`,
`Game/Underreign/Source/UnderreignSim/Lib/**` (349 files incl. manifest),
`UnderreignSim/Public/URSimGame.h`, `URSimScript.h`,
`UnderreignSim/Private/URSimGame.cpp`, `URSimScript.cpp`, `Tests/URSimTests.cpp`,
`Underreign/Public|Private/URSimSubsystem.*`, `URPlayView.*`, captures
`Game/Captures/play_4x/`, `play_4x.gif`, `play_*.png`, `tool_*.png`,
`Evidence/UR-UNREAL-03-V1/**`.
Changed: `Game/README.md`, `Game/Scripts/capture.sh`, `Game/Scripts/perf.sh`,
`UnderreignSim.Build.cs`, `UnderreignSim/Public/UnderreignSim.h`,
`Underreign.Build.cs`, `URGreyboxMap.*`, `URPlayerController.*`, `URHUD.*`,
`URGameMode.cpp`, `URCaptureDirector.*`.
Ignored output: `Game/Logs`, `Game/PerfRuns`, `Game/Underreign/Saved/SimHeadless`.
