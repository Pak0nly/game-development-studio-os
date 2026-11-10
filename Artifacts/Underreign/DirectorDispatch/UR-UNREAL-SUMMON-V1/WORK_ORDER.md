# Work Order UR-UNREAL-SUMMON-V1 — Summon cinderlings in the game; resync to the new job rules

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Routine.
Runs after UR-SIM-WORKER-JOBS-V1 is committed; build on that state.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-UNREAL-SUMMON-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-UNREAL-SUMMON-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-UNREAL-SUMMON-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-UNREAL-SUMMON-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

Human after the first own round (2026-11-10): "Was ich vermisse, ist es mehr
Cinderlings herbei zu holen. Mit konstant 4 geht das Ganze recht schleppend
voran." The rules already have `SummonCinderlingCommand` (75 gold, cap 10,
`SimulationCpp/Data` tuning), used by the bots, but the game offers no way to
issue it. UR-SIM-WORKER-JOBS-V1 changed how cinderlings pick jobs; the game must
run those rules.

## Tasks

1. **Resync** the rules module with `Game/Scripts/sync_sim.py` from the
   committed HEAD after UR-SIM-WORKER-JOBS-V1 (rules 5, commit 951f937); adapt
   the wrapper if needed; Automation tests (new golden replays: seed 2 won
   replaces seed 8, so the command-path test must use the new won replay), the
   game-layer parity check against the headless runner of the same commit at
   four ticks, and check that the STAIRREACH "no cinderling can reach" logic
   still matches the new job matching (`Evidence/UR-SIM-WORKER-JOBS-V1/WORKER_RESULT.md`).
2. **Summon cinderling**: a clearly visible tool-bar button and a key (pick a
   free, easy key; document it), showing cost and count ("Cinderling +1 (75
   gold) 4/10"); the rules' refusal (no gold, cap reached) shown in plain words;
   the new cinderling appears at the Heart. Mention it in the start "how to play"
   panel and the F1 help.
3. **HUD**: the cinderling count with cap in the top panel; tooltip on a
   cinderling shows what it is doing (job kind) if the state exposes it cheaply.
4. **Proof**: tool test steps for summon (accepted, no gold, cap reached);
   existing Automation tests, tool tests, stairfix, stairreach, playround and
   parity PASS; stills of the button and the help panel; a short note comparing
   cinderling walking in a scripted opening before/after the job rules (use the
   rules Worker's trace numbers, do not re-derive them). Every own run
   frame-capped (60 fps or lower), short, offscreen, one editor process at a time.
5. `Game/README.md`, `Game/SPIELANLEITUNG.md` (German, plain), and
   `Evidence/UR-UNREAL-SUMMON-V1/WORKER_RESULT.md` (external) plus
   `Artifacts/Underreign/Evidence/UR-UNREAL-SUMMON-V1/WORKER_RESULT.md` (Studio).

## Limits

- External allowed: `Game`, `Evidence/UR-UNREAL-SUMMON-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-UNREAL-SUMMON-V1`. `SimulationCpp` and
  everything else read-only; rules and tuning unchanged.
- Do NOT commit or push. Headless/offscreen, never a window in front of the
  Human; build parallelism at most 8. No downloads.
