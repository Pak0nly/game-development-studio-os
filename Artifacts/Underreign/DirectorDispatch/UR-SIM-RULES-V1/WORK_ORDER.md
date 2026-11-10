# Work Order UR-SIM-RULES-V1 — Rule updates in the C++ simulation (fixed breakthrough points, attack goal)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.
Parallel order: UR-UNREAL-03-V1 builds the Unreal module from `SimulationCpp`
(read-only for it); keep `SimulationCpp` compiling at every save point and
never touch `Game`.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-SIM-RULES-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-SIM-RULES-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-SIM-RULES-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-SIM-RULES-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

From now on the C++ simulation in `SimulationCpp` is the rules' source of
truth; the C# `Simulation` folder is frozen as the reference (do not edit it).
The Human decided (Studio `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`):
UD-37 side walls breakable with different hit points/armour, ceilings and
floors between layers not breakable, thick rock between layers; UD-47 layers
connect only at fixed breakthrough points for all peoples; UD-48 destroying the
enemy Heart wins, the prototype gets a small attack goal after the third wave.
The night's simulation still lets Brutes dig down through floors (recommendation
A of N-4, explicitly not adopted).

## Tasks

1. **UR-SIM-BREAKTHROUGH-CHECK**: audit the rules against UD-37 and UD-47;
   then change them: no digging, building or intruder tunnelling through floors
   or ceilings except at the map's fixed breakthrough points; side walls stay
   breakable with material hit points; when the Heart is walled in, Brutes dig
   sideways only. Fixed breakthrough points are declared in the map format (a
   new marker; document it in `SimulationCpp/README.md` and update
   `cinder_hollow.map.txt` copies under `SimulationCpp/Data`, not the frozen C#
   map).
2. **UR-SIM-ATTACK-GOAL**: implement the prototype attack goal per
   `Design/Planning/UNREAL_WORK_BREAKDOWN.md` section 4 (after the third wave
   the player sends creatures to the intruders' camp; reaching and holding it
   wins). Use a clear, plain rule; mark tuning values as proposals.
3. **Tests and balance**: new tests for both rules; existing tests updated only
   where the old rule was intentionally replaced (list each changed test and
   why); new golden replays recorded with the new rules (keep the old ones under
   `Data/ReplaysLegacy` for the parity record); 200-seed batch of the reasonable
   bot and of a varied opening, with a short balance note (win rate, wave of
   loss, time to win) compared with before.
4. `SimulationCpp/README.md` update, `Evidence/UR-SIM-RULES-V1/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-SIM-RULES-V1/WORKER_RESULT.md`
   (Studio).

## Limits

- External allowed: `SimulationCpp`, `Evidence/UR-SIM-RULES-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-SIM-RULES-V1`. `Simulation` (C#) and `Game`
  read-only.
- Do NOT commit or push. Compiler parallelism at most 8. No Unreal, no downloads.
