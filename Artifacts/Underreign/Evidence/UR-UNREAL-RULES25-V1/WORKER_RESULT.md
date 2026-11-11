# WORKER_RESULT UR-UNREAL-RULES25-V1

Worker verify-worker: PASS (receipt 0489c1f48ca841798750e48fa75113c1d3f2f67be1db5a33fc88152b54524cbc). Game repository HEAD 46653a6 (rules 25) plus uncommitted work.
Nothing committed or pushed. `SimulationCpp` untouched (synced from the committed HEAD only, no `--worktree`). Not independently reviewed.
Changed: `Game/` (sources, scripts, README, SPIELANLEITUNG), this folder; Studio: `Projects/Underreign/References/ArtDirection` (2 images, PROVENANCE), `Projects/Underreign/Docs/OPEN_DECISIONS.md` (OD-23), the Studio copy of this file.

## Kurzfassung (Deutsch)

- Das Spiel läuft jetzt auf Regelstand 25: Fallen lösen von selbst aus, Ketten, Druckplatte und Stolperdraht sind weg.
- Neu im Baumenü (Taste 4, mit Knöpfen und Preisen): Gewichtsplatte, Zählauslöser (Zahl 2–6 mit C oder Knöpfen), Geschützturm, Holz- und Eisentür. Taste 5 legt Brücken über Lava.
- Türen zeigen alle Zustände (geplant, zu, offen, eingeschlagen) mit Lebensbalken. Ein Klick ohne Werkzeug schließt sie auf oder zu.
- Sichtbar sind jetzt auch: versteckte und entdeckte Fallen (blaues Auge, Aufblitzen), der Turm (Zielen, Schuss, Munitionsbalken, „needs refill“), Grube und echte Falltür, Panik, Betäubung, Festhalten, Wegstoßen und das „schwer“-Zeichen.
- Tests: Alle 7 Automationstests sind grün, dazu Parität an vier Ticks. Die drei Werkzeugtests bestehen 50 von 50 Schritten, und alle 8 Karten starten im Schonmodus sauber.
- Wichtiger Fund: Die Aufnahme-Läufe mit festem Zeitschritt liefen bisher **ohne Bildratenbremse**. Das ist jetzt behoben (höchstens 30 Bilder/s).

## What changed

- **Sync to rules 25**: `sync_sim.py` lists the nine golden replays of rules 25. 362 library files come from 46653a6 (30 stale files removed: chains, the machine catalogue). `check` PASS.
- **Wrapper `URSimGame`**:
  - `EURSimTrapKind` now has 9 kinds (Weight Plate, Count Trigger, the four effects, Wood door, Iron door, Turret).
  - `FURSimTrapPart` gained all the rules-24/25 view fields (seen, known-seen, lock, Hp/MaxHp, bars, controlled by, CountN/Counted, Ammo/MaxAmmo, pit).
  - `FURSimIntruder` gained its action and flee reason. `FURSimTypeInfo` gained heavy, basher, breaker and door damage.
  - New orders: `EnqueueSetDoorLock`, `EnqueueSetTriggerCount`, `EnqueueBuildBridge`, `EnqueueRemoveBridge`. The chain orders and chain prices are removed.
  - New reads: `GetTrapInfo`, `CheckTrapPlacement` (the rules' own read-only `TrapSystem::CheckPlacement`, then Forge and gold), `CheckBridge` (mirrors `BridgeRules`), `IsBridge`, `HatchWouldDrop`, `GetPartArea`, `ControlTargets`.
  - The round report (F9) now covers the Turret, control effects, doors and bridges.
- **Game**:
  - Build menu with part buttons and prices. The preview shows the area, the facing, and control lines to the targets. Refusal reasons are the rules' reasons in plain words.
  - Key 5 is now the bridge tool. X also removes bridges.
  - Clicking a part with no tool selects it: a panel shows its plain-words text with the rules' numbers, its area and its control line. Doors get a lock/unlock button; a Count Trigger gets N- and N+ buttons (and C / Shift+C).
  - New visuals:
    - Door model per state, a hit-point bar, and flashes on hit, break, repair and lock.
    - Turret aim and shot line, ammo bar, and a "needs refill" mark with label.
    - Pit look, the "seen" eye with a reveal flash, and "count / N" labels.
    - Panic, stun, hold and knock-back marks over intruders, and the heavy mark.
    - Bridge planks over the lava.
    - Short control lines (own cell: a small ring).
  - The feed has lines for doors, reveals, Turret empty/refill, bridges and control. Tooltips use the new numbers.
  - The keep-out text is removed. F1 help, the start panel, the end screen and `SPIELANLEITUNG.md` are updated.
  - The map list lost "gold batches".
- **Capture director**: new modes `rules25`, `rules25watch` and `bridge`. `playround` is rewritten for rules 25 but was not run. A **real-time frame cap** now applies to fixed-step capture runs.
- **Headless save** `headless/doors_seed4.save.txt`: the door bot, seed 4, golden tuning. Both iron doors break and are repaired, and the Turret is emptied and refilled.

## Results

- Build: `build.sh` exits 0 with no warnings (8 parallel actions at most).
- `test_sim.sh`: 7 tests pass, 171 `UR_SIM_TEST ... PASS` lines, 0 FAIL (`logs/test_sim.log`).
  - GoldenReplays: 9 files, every hash matches its file.
  - PlayerOrders: 103 checks. They cover:
    - Weight Plate control and the link.
    - Count Trigger N 3→5, with refusals 7, 1, NothingToDo and wrong part.
    - Turret numbers.
    - Wood door: NotACorridor; lock, unlock and NothingToDo; removal.
    - Bridge on Ashthread Drift: build, refusals, removal.
    - The build menu's pre-check agrees with the rules on every placement.
- **Parity** (`capture.sh playstills`, gentle, 30 fps, `-URStopAtTick` plus the save's own check hash), all `UR_PARITY RESULT PASS`:

  | Map | Tick | Hash | Check hashes |
  |---|---|---|---|
  | Crownkiln | 6000 | `692d24e1192edf89` | 10/10 |
  | New Intruders | 7200 | `0229d50c6ab4dd05` | 12/12 |
  | Ashthread Drift | 9000 | `8d060290f2fff885` | 15/15 |
  | Cinder Hollow | 12000 | `8ded021659ed2f1a` | 20/20 |

  Logs: `logs/parity_*.log`.
- **Tool tests** (`UR_TOOL_TEST`, 1280×720, gentle, 30 fps cap):
  - `rules25`: 21/21. Build menu, Count Trigger preview and control, N via C, Shift+C and the panel, NotACorridor reason, Weight Plate, Turret, wood door planned → unlocked → fitted → locked, Turret range, F1.
  - `rules25watch`: 19/19. Control mark, Turret shot, empty, refilled by a cinderling; door hit, broken by a Brute, repaired.
  - `bridge`: 10/10. Preview, laid, tooltip, removed (half back), laid again.
- **Start check, one per map, gentle bat** (8 maps): all `RESULT PASS`, 30.0 fps, GPU 1.4–1.6 ms (`startcheck/<map>/`).

## Stills

- `stills/rules25/`: `build_menu`, `build_count_trigger_preview`, `build_door_refused`, `count_trigger_line`, `door_planned`, `door_unlocked`, `door_locked`, `turret_range`, `help_panel`.
- `stills/watch/`: `control_feedback`, `turret_firing`, `turret_needs_refill`, `turret_refilled`, `door_hit`, `door_broken`, `door_repaired`.
- `stills/bridge/`: `bridge_preview`, `bridge_built`, `bridge_wide`.
- `stills/parity_*/`: overviews at the parity tick.
- `startcheck/<map>/`: `start_intro`, `start_running`.

## Open points

- **Frame-cap finding:** with `FApp::SetUseFixedTimeStep` the engine ignores `t.MaxFPS`. The fixed-step capture modes of earlier orders therefore ran uncapped. My first `rules25` run rendered about 225 fps for a short time before I stopped it. `AURCaptureDirector` now sleeps to `-URMaxFPS` (default 30) every frame; every run after the fix showed about 29–30 fps.
- `playround` was rewritten (Weight Plate controlling a vent instead of chains) and compiles, but was not run: its old saves are rules 5–22 and are refused now.
- Greybox looks are placeholders (UD-22). Doors are drawn taller than the cut walls so they show over corridors. Look decisions stay with the Human.
- No still was made specifically of a hidden part being revealed. Seen eyes appear in the watch and rules25 stills, and the flash is coded and not separately proven.
- Not done: wave-warning types (UN2-12) and the other open items of UR-UNREAL-NIGHT2-V1. Balancing (UD-38) is unchanged.
