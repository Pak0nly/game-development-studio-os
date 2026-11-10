# Work Order UR-NIGHT-PREP-02-V1 — Refresh the design snapshot and place the night order

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Routine.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-NIGHT-PREP-02-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-NIGHT-PREP-02-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-NIGHT-PREP-02-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-NIGHT-PREP-02-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

Human (2026-11-10): night shift approved ("Vorschlag passt und 9 Uhr wäre
richtig."). The cloud night reads only `C:/GameDev/Underreign`; its design
snapshot dates from night 1.

## Tasks

1. In `C:/GameDev/Underreign/Design/Snapshot/`: replace the byte copies of
   Studio `Projects/Underreign/README.md`, `Docs/GAME_CONCEPT.md`,
   `Docs/DISCOVERY_DECISIONS.md`, `Docs/OPEN_DECISIONS.md`,
   `Docs/PRODUCTION_PROFILE.md` with the current Studio files (byte copies);
   update `SNAPSHOT.md` with the Studio commit hash (`git rev-parse HEAD`) and
   date. Leave `ArtDirection/` as is unless the Studio files differ.
2. Copy Studio `Artifacts/Underreign/DirectorDispatch/UR-NIGHT-02-V1/WORK_ORDER.md`
   byte-identical to `C:/GameDev/Underreign/Night/UR-NIGHT-02-V1/WORK_ORDER.md`.
3. Short result: `Evidence/UR-NIGHT-PREP-02-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-NIGHT-PREP-02-V1/WORKER_RESULT.md` (Studio)
   with the file hashes.

## Limits

External allowed: `Design/Snapshot`, `Night/UR-NIGHT-02-V1`,
`Evidence/UR-NIGHT-PREP-02-V1`. Studio allowed:
`Artifacts/Underreign/Evidence/UR-NIGHT-PREP-02-V1`. Read-only elsewhere. No
commit, no engine.
