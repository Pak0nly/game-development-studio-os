# UR-UNREAL-PLAYABLE-V1 — Worker result

Work Order: `Artifacts/Underreign/DirectorDispatch/UR-UNREAL-PLAYABLE-V1/WORK_ORDER.md`
(Studio repository). Worker: Claude Code subagent. Date: 2026-11-10.
External repository `C:/GameDev/Underreign`, branch `main`, HEAD `69a1bea`
(unchanged; nothing committed or pushed).

## Gate

`verify-worker` at the Studio repository root, before any change:

```text
PASS worker receipt bc49d18e7e32710a79237a748d7a22868e23e2bc74adb36f56438686bd449199
```

## What was built

| # | Task | Result | Where |
|---|---|---|---|
| 1 | Resync to rules 4 | `sync_sim.py` now takes its data from `SimulationCpp/Data` (four golden replays of rules 4, `golden.tuning.txt`, Cinder Hollow map, `prototype.tuning.txt`); synced from committed `69a1bea` (356 files, `check PASS`). The game's default map and tuning are now these synced copies (rules and data of one commit). | `Game/Scripts/sync_sim.py`, `Lib/` |
| 1 | Wrapper | New `ISimView` methods wired: `IsBreakthrough`, `GetAttackGoal` (copied once per tick into `FURSimAttackGoal`); also trap chains, intruders (camp guard flag), more trap-part and room fields, orders for every new tool, prices, readable names; `URSimCellFlag::Breakthrough = 64`. The enum shift of rules 4 (`CreatureGoal::Attack = 4` inserted; `RejectReason` 19 / 20 and three event types appended) needs no mapping in the wrapper: it only passes event types and reasons through by name, and creature goals are not exposed. | `UnderreignSim/Public/URSimGame.h`, `Private/URSimGame.cpp` |
| 1 | Automation tests | 5 tests, all PASS: four golden replays (idle seed 1 lost, reasonable seed 1 lost, seed 4 lost, seed 8 won) to their final hash, tick and outcome; command path (seed-8 won replay, 184 commands through the order path, 21 of 21 check hashes); sync guard; **new `Underreign.Sim.PlayerOrders`** (32 checks). | `UnderreignSim/Private/Tests/URSimTests.cpp`, `logs/automation_tests.txt` |
| 2 | Stair / shaft tool (3) | Click a cyan breakthrough ring (from either layer it joins); 3 again: shaft. All unbuilt breakthrough points of the focused layer are drawn as cyan rings, larger and with a light column while the tool is on; elsewhere the click is refused with a message, no order is sent. | `URPlayerController`, `URPlayView` |
| 2 | Trap tool (4) | The six parts (4 again / Shift + 4 cycles, T turns), on claimed floor; preview with the Tripwire's 3 cells / the Flame Vent's 3-cell jet and a facing arrow; Drop Hatch only on a breakthrough ring with an open cell below; the rules' refusals in plain words ("build a Forge first"). | same |
| 2 | Chain tool (5) | Click a trigger, then each effect (click a chained effect again: unchain; Ctrl + click: never chains); the trigger stays picked across R / F (cross-layer chains); C cycles the delay (0 / 1 / 2 s) of the chain under the cursor or of the next chain; right click lets go of the trigger. Chains drawn as yellow lines, cross-layer ends as up / down arrows; the machine under the cursor (or of the picked trigger) highlighted; M shows all machines. | same |
| 2 | Remove tool (X) | Click a trap part, a stair or shaft, or a room tile (drag: room area); half the price back. | same |
| 2 | Attack order | Enter or the red ATTACK button (top right, pulsing once the camp is open); again: CALL BACK with the hold timer and guards left; J jumps to the camp. Camp area drawn (red floor and border on Layer 1), red markers over the camp guards; goal line in the HUD. | `URPlayerController`, `URHUD`, `URPlayView` |
| 2 | End screen | VICTORY / DEFEAT, the reason, time, Heart, waves, creatures, intruders, traps, gold; "Play again" (Enter) starts a fresh game; "Quit". | `URHUD`, `URSimSubsystem` (stats) |
| 2 | Readability | Tooltip at the cursor for everything (agents with name, kind, activity, health, mood or "camp guard"; trap parts with kind, state, chains, facing; Heart, Call-stone, entrance, camp, breakthrough points, stairs, rooms, rock, claimed ground, gold, heat; the tool's reason when it cannot act); clickable tool bar with every tool and toggle; the latest message in the middle of the screen; F1 key help; heat overlay H (warm thin yellow, hot orange, searing red). | `URHUD`, `URPlayerController` |
| 2 | Debug keys | The engine's development debug keys F1-F5 (F1 switched to wireframe), Page Up / Down, Shift and ; are switched off in `Config/DefaultInput.ini`. | `Config/DefaultInput.ini` |
| 3 | Start script | `Game/Play Underreign.bat`: `UnrealEditor.exe <uproject> /Game/Maps/L_CinderHollow -game -windowed -resx=1920 -resy=1080 -ForceRes -URSpeed=1`; a normal game opens paused with the "how to play" panel; any key or a click starts the clock (the key does nothing else). `-ForceRes` was needed: without it the offscreen check got an 888 x 500 viewport; the desktop here is 5120 x 1440, so 1920 x 1080 fits. | `Game/Play Underreign.bat` |
| 4 | Proof | see below | `logs/` |
| 5 | Docs | `Game/README.md` updated; German quick guide `Game/SPIELANLEITUNG.md`. | |

## Parity (game layer vs headless runner of the same commit)

`python Game/Scripts/sync_sim.py headless` built `ur_headless.exe` from
`69a1beade74d` (exported from git). It played the reasonable bot, seed 1,
Cinder Hollow with `prototype.tuning.txt` (the synced copies) to tick 2400
(`headless/reasonable_seed1_t2400.save.txt`). The game played those 33
commands through its order path (`capture.sh playstills`, 4x):

| Tick | Game layer | Headless | Result |
|---|---|---|---|
| 600 | `a9adb099edc7cd4e` | `a9adb099edc7cd4e` | PASS |
| 1200 | `5d37324f1145747e` | `5d37324f1145747e` | PASS |
| 1800 | `4d7971daa1a907c5` | `4d7971daa1a907c5` | PASS |
| 2400 | `349b329d3b51b5a7` | `349b329d3b51b5a7` | **PASS** |

`UR_PARITY RESULT PASS` (`logs/parity_playstills.txt`); the same four checks
passed in the frame-time run. In addition, the scripted round's warp played
the headless save `reasonable_seed1_t11988.save.txt` (171 commands) through
the order path and matched all 19 stored check hashes (600 to 11400).

## Tool tests (offscreen, headless, `UR_TOOL_TEST` lines)

- `capture.sh tooltest` (new game, 4x): **29 of 29 PASS** — dig, unmark, room
  tool, Nest, refusal; tooltip names the Heart; 3 selects the stair tool; ring
  and tooltip; click away from a ring refused locally; stair at 1 21 17 from
  Layer 3 accepted (30 gold); 3 again = shaft; shaft at 0 20 7 accepted; 4
  selects the trap tool; a part without a Forge refused by the rules
  (NoForge) with the plain message; Enter before the camp opens explains;
  H on / off; F1 opens the help without wireframe; Esc closes it; Space, + / -,
  1, Esc. (`logs/capture_tooltest.txt`)
- `capture.sh playround` (warped to tick 11988 = 19:58, camp just opened, then
  the player takes over): **32 of 32 PASS**, plus "play again starts the map
  anew" PASS — 4 / Pressure Plate placed; 4 4 Flame Vent, T faces east, placed;
  4 Cinder Charge, F, placed one layer down; R, 5, trigger picked; chain to the
  vent; F, chain across layers to the charge; machine highlighted; C delay
  1 s; unchain; chain again; right click lets go; M all machines; X removes the
  charge (50 gold back); tooltip names the vent; J to the camp; tooltip names a
  camp guard; Enter sends the creatures; Enter calls them back; the ATTACK
  button sends them again. At 4x the creatures beat the 3 guards and held the
  camp: **Won at tick 12755 (21:15)**, end reason "camp taken"; the end screen;
  Play again: new game at tick 0, 500 gold. (`logs/capture_playround.txt`)
- Keys were sent through the game viewport (the Enhanced Input path), one key
  per step; clicks through the controller's click functions (the same
  functions the left mouse button calls).

## Start script check

`Play Underreign.bat -RenderOffscreen -nosplash -unattended -NoSound
-URCapture=startcheck -URIntro` (run through PowerShell, no window: window
handle 0): **UR_START_CHECK RESULT PASS** — Cinder Hollow loaded with the
rules of `69a1beade74d`; windowed, 1920 x 1080 requested and the viewport is
1920 x 1080; start panel open, paused, 1x, tick 0; camera on the Heart
(Layer 3); the 1 key closed the panel and started the clock without picking
the dig tool; the game ran. (`logs/start_script_check.txt`; command line
logged there.)

## Frame time

`perf.sh 5000 perf_playable_4x playperf` (1920 x 1080, Epic, no VSync,
rules running at 4x, the recorded orders), seconds 10-30:
**136.5 fps, frame 7.32 ms average, p99 12.61 ms**; game thread 1.64 ms
(p99 2.54), GPU 5.93 ms; simulation step 25.5 µs mean, 54.3 µs p99.
(`logs/perf_playable_4x_summary.txt`; UR-UNREAL-03-V1 measured 10.80 ms /
p99 76.06 ms in its run.)

## Captures (looked at)

All in `Game/Captures` (1920 x 1080 unless noted):
`start_intro.png` (start panel), `start_running.png`, `tool_hover_heart.png`,
`tool_stair_rings.png` (ring with light column and tooltip),
`tool_heat_overlay.png`, `help_panel.png`, `round_trap_preview.png`,
`round_vent_preview.png` (jet cells and facing arrow),
`round_chain_trigger.png`, `round_chain_cross_layer.png`, `round_machine.png`,
`round_all_machines.png`, `round_hover_vent.png`, `round_camp_open.png`,
`round_hover_guard.png`, `round_attack_sent.png` (CALL BACK button with hold
timer), `round_end_screen.png` (VICTORY), and the sequence
`round_seq/0000..0335.png` (960 x 540, one frame per 0.1 s at 1x, the attack
part at 4x) with `round_seq.gif` (640 x 360, 13 MB). The rules-4 runs also
refreshed `play_*.png`, `tool_dig_drag.png` and `tool_room_nest.png`.

## How to start

Double-click `C:\GameDev\Underreign\Game\Play Underreign.bat`. A 1920 x 1080
window opens (first start up to about a minute), paused with the "how to
play" panel; any key or a click starts. German guide:
`Game/SPIELANLEITUNG.md`. F1 shows all keys in the game.

## Known rough edges

- Greybox only: trap parts are simple shapes; highlighted machines cover the
  parts with yellow boxes; chain lines are straight; the cross-layer arrow can
  hide inside a stair.
- The camp is reached only through the map's stairs; the bot's game shows the
  camp opening at about 20:00 of play (seed 1), so a full test round to the
  attack takes about 20 minutes at 1x (4x is available with +).
- The interface text in the game is English (the quick guide is German).
- No click-to-select state panel, no Alt tooltip, no building in the side
  view, no edge markers yet.
- The start script needs the editor build (`Game/Scripts/build.sh`); there is
  no packaged build.
- The tool tests drive clicks through the controller functions, not through a
  real mouse; real mouse use on the Slate buttons was not exercised offscreen.
- Tuning and rules unchanged (rules 4 as committed in `69a1bea`).

## Changed files (external, not committed)

`Game/Scripts/sync_sim.py`, `Game/Scripts/capture.sh`,
`Game/Underreign/Source/UnderreignSim/Lib/**` (sync), `UnderreignSim/Public/URSimGame.h`,
`UnderreignSim/Private/URSimGame.cpp`, `UnderreignSim/Private/Tests/URSimTests.cpp`,
`Underreign/Public|Private/URSimSubsystem`, `URPlayerController`, `URPlayView`,
`URHUD`, `URCaptureDirector`, `URGreyboxMap.h` (default map path),
`Game/Underreign/Config/DefaultInput.ini`, `Game/Play Underreign.bat`,
`Game/SPIELANLEITUNG.md`, `Game/README.md`, `Game/Captures/**`,
`Evidence/UR-UNREAL-PLAYABLE-V1/**`. Protected paths (`Design`, `Simulation`,
`SimulationCpp`, `Night`, `EngineComparison`, `README.md`, `.gitignore`,
`.gitattributes`): no changes.
