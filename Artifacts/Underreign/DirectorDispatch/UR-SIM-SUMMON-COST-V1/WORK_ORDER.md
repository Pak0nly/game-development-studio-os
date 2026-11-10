# Work Order UR-SIM-SUMMON-COST-V1 — Summoning a cinderling gets dearer with each one you have

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Routine.
Parallel order: UR-UNREAL-STATS-V1 edits `Game`; never touch `Game` here.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-SIM-SUMMON-COST-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-SIM-SUMMON-COST-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-SIM-SUMMON-COST-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-SIM-SUMMON-COST-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

Human after the second own round (2026-11-10): "Habe direkt am Anfang alle 5
übrigen Cinderlings gekauft. Es sollte mit jedem Kauf bzw. jedem beim Kauf
existierenden Cinderling teurer werden welche zu kaufen, damit man sich das
besser überlegt."

## Tasks

1. Rules 6: the summon price depends on the number of living cinderlings at the
   moment of the order: `price = SummonCinderlingCost + SummonCostStep ×
   (living − SummonCostFreeCount)`, never below the base. Proposal values
   (mark as proposals in the tuning files and README): base 75, step 25, free
   count 4 — so with 4 living it costs 75, then 100, 125, 150, 175, 200 (all
   five cost 625 instead of 375). Cap stays 10. Expose the current price
   read-only on `ISimView` (for the game's button) and keep the refusal reasons.
2. Bots: keep them sensible with the new price (they must not spend the
   opening gold blindly); report what changed.
3. Tests: new tests for the price curve, refusal at not enough gold for the
   current price, dead cinderlings lowering the price; existing tests changed
   only where the flat price was intentionally replaced (list each); new golden
   replays (move rules-5 ones to `Data/ReplaysLegacy/rules5`); 200-seed batch of
   the reasonable bot and the varied opening with a short balance note against
   rules 5. Wave 3 unchanged (UD-53).
4. `SimulationCpp/README.md`, `Evidence/UR-SIM-SUMMON-COST-V1/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-SIM-SUMMON-COST-V1/WORKER_RESULT.md`
   (Studio).

## Limits

- External allowed: `SimulationCpp`, `Evidence/UR-SIM-SUMMON-COST-V1`. Studio
  allowed: `Artifacts/Underreign/Evidence/UR-SIM-SUMMON-COST-V1`. `Simulation`
  (C#), `Game` and everything else read-only.
- Do NOT commit or push. Compiler parallelism at most 8. No Unreal, no downloads.
