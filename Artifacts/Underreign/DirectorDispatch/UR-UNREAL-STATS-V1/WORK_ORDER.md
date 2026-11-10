# Work Order UR-UNREAL-STATS-V1 — Copyable round statistics for the Human

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Routine.
Parallel order: UR-SIM-SUMMON-COST-V1 edits `SimulationCpp`; never touch it here.
No resync of the rules in this order.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-UNREAL-STATS-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-UNREAL-STATS-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-UNREAL-STATS-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-UNREAL-STATS-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

Human (2026-11-10): "Wenn es irgendwelche Statistiken gibt die hilfreich währen
zu haben nachdem ich eine Runde gespielt habe, bau es so, dass sie kopierbar
sind und ich pack sie einfach hier rein. Später natürlich mit automatischer
Übertragung und Auswertung." Also observed: some cinderlings died because they
fled too slowly; intruders walked past the creatures to the Heart.

## Tasks

1. A compact plain-text round report (English, one block, Markdown-friendly,
   at most about 60 lines) built from the rules' existing metrics
   (`RunMetrics`, `MetricsFormat`) plus cheap game-layer facts: rules commit,
   map, seed, result and time, speed used; per wave (arrival time, intruders,
   killed/escaped, Heart damage, which creatures fought); gold mined, spent by
   kind, gold over time (a few samples); cinderlings summoned, died (cause and
   where, how far from safety), idle/walking share if available; creatures
   arrived, lost, time spent fighting vs idle; rooms built and when; traps
   placed, chained, fired, damage; key milestones (first room, Forge, first
   trap, camp open, attack sent). Pick what exists cheaply; list what you left
   out.
2. "Copy statistics" button on the end screen and a key (also usable during
   play, e.g. F9) that puts the block on the clipboard, shows "copied", and
   also writes it to `Saved/Stats/<date-time>.md` (path shown).
3. Function check only (Human: "Wenn keine major changes sind braucht es nur
   eine Funktionsprüfung, dass es läuft."): build, one short frame-capped
   offscreen run that ends a game and produces the block and the file, paste
   the produced block into the result. One still of the end screen.
4. `Game/SPIELANLEITUNG.md` line (German: how to copy the statistics and paste
   them into the chat), `Evidence/UR-UNREAL-STATS-V1/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-UNREAL-STATS-V1/WORKER_RESULT.md`
   (Studio).

## Limits

- External allowed: `Game`, `Evidence/UR-UNREAL-STATS-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-UNREAL-STATS-V1`. `SimulationCpp` and the
  synced library read-only; rules and tuning unchanged.
- Do NOT commit or push. Headless/offscreen, frame-capped, one editor process at
  a time, never a window in front of the Human; build parallelism at most 8.
