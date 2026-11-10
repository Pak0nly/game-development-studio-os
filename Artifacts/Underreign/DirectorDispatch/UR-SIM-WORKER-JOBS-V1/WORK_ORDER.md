# Work Order UR-SIM-WORKER-JOBS-V1 — Cinderlings take nearby work and stay put

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.
Parallel order: UR-UNREAL-STAIRREACH-V1 edits `Game`; never touch `Game` here.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-SIM-WORKER-JOBS-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-SIM-WORKER-JOBS-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-SIM-WORKER-JOBS-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-SIM-WORKER-JOBS-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

Human after the first own test round (2026-11-10, won 18:49, no traps used):
"Auch sollte diese sich mal entscheiden wo sie arbeiten wollen und nicht
elendig lange hin und her rennen. Wenn man Boden übernimmt, kann man auch
einfach die Kachel nehmen die direkt neben einem ist und muss nicht quer durch
den Dungeon laufen nur um am anderen Ende dann eine zu übernehmen."

Director read-only note (verify): `SimulationCpp/Private/Jobs/JobBoard.cpp`
`AssignIdleWorkers` walks jobs in priority/queue order and gives each job the
nearest idle worker (`PickNearest`), so a worker can be sent to a far job while
a job next to it waits; claim jobs are probably handed out in creation order.

## Tasks

1. Diagnose with a headless trace on Cinder Hollow (reasonable bot and an
   idle-heavy dig opening): walking distance per finished job, share of time
   walking vs working, back-and-forth cases. Report the numbers before and after.
2. Change the assignment so cinderlings behave as the Human expects, keeping the
   rules deterministic (integer math, fixed tie-breaks):
   - within the same priority, an idle cinderling takes the nearest open job to
     itself (worker-centred), not the oldest job;
   - claiming spreads outward from where the cinderling stands (next adjacent
     unclaimed tile first); digging continues at the neighbouring marked rock;
   - a cinderling keeps its work area: after a job it prefers the next job
     nearby over a far one of the same priority (no ping-pong between ends);
   - player-marked digs and urgent jobs (gold to the Heart, building stairs,
     installing traps) keep their priority as before unless the trace shows they
     cause the back-and-forth; state any priority change and why.
   Mark new tuning values as proposals.
3. Tests: new tests for nearest-first, outward claiming and no ping-pong;
   existing tests changed only where the old behaviour is intentionally replaced
   (list each and why); new golden replays (move the current ones to
   `Data/ReplaysLegacy` with a note); 200-seed batch of the reasonable bot and
   the varied opening, short balance note (win rate, wave of loss, time to win,
   gold over time) compared with rules 4. Tuning otherwise unchanged; the
   wave-3 strength stays as is.
4. `SimulationCpp/README.md` update, `Evidence/UR-SIM-WORKER-JOBS-V1/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-SIM-WORKER-JOBS-V1/WORKER_RESULT.md`
   (Studio).

## Limits

- External allowed: `SimulationCpp`, `Evidence/UR-SIM-WORKER-JOBS-V1`. Studio
  allowed: `Artifacts/Underreign/Evidence/UR-SIM-WORKER-JOBS-V1`. `Simulation`
  (C#), `Game` and everything else read-only.
- Do NOT commit or push. Compiler parallelism at most 8. No Unreal, no downloads.
