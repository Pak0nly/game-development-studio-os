# Work Order UR-UNREAL-BREAKDOWN-V1 — Unreal work breakdown and commit-approval record

Project: Underreign (DEC-041, DEC-043). Director: Claude (orchestration only).
Worker: one separate Claude Code subagent. Execution mode: Discovery.
Class: Routine. Parallel orders today: UR-SIM-CPP-PORT-V1 (`SimulationCpp`) and
UR-UNREAL-SETUP-V1 (`Game`); never touch their paths.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-UNREAL-BREAKDOWN-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-UNREAL-BREAKDOWN-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-UNREAL-BREAKDOWN-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-UNREAL-BREAKDOWN-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (2026-11-10, exact)

- Engine: "Unreal" (DEC-043).
- To the question whether the standing commit approval also covers Unreal jobs
  and whether the broken Unity cache entry may be deleted: "Ja, beides".
- "Wieso in der Cloud? Wir haben gerade 14:20 Uhr und noch viel Zeit vom Tag
  übrig. Da können so viele Worker drauf angesetzt werden wie sinnvoll ist."

## Tasks

1. Write `C:/GameDev/Underreign/Design/Planning/UNREAL_WORK_BREAKDOWN.md`: the
   Unreal version of `UNITY_WORK_BREAKDOWN.md` (read-only input). Same plain
   language summary style. Map every Unity job to an Unreal job (C++ modules,
   Python editor scripts, Enhanced Input, Lumen/Nanite greybox, UMG/Slate HUD,
   Unreal Automation tests, packaging), add the simulation port
   (UR-SIM-CPP-PORT-V1) and the project setup (UR-UNREAL-SETUP-V1) as the first
   two jobs running today, mark which jobs can run in parallel (one Unreal
   editor at a time; C++ builds limited), and add the prototype attack goal from
   UD-48 and the fixed-breakthrough rule from UD-47. Note that
   `UNITY_WORK_BREAKDOWN.md` is superseded (do not edit it).
2. Studio `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`: new row UD-52 in a
   section "Unreal start — 2026-11-10": the standing commit approval of UD-35
   also covers finished and reviewed Unreal jobs; quote "Ja, beides". Studio
   `Projects/Underreign/Docs/OPEN_DECISIONS.md`: OD-16 → DECIDED (UD-52).
3. Write `Evidence/UR-UNREAL-BREAKDOWN-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-UNREAL-BREAKDOWN-V1/WORKER_RESULT.md`
   (Studio).

## Limits

External allowed: `Design/Planning/UNREAL_WORK_BREAKDOWN.md`,
`Evidence/UR-UNREAL-BREAKDOWN-V1`. Studio allowed: the two project files above
and `Artifacts/Underreign/Evidence/UR-UNREAL-BREAKDOWN-V1`. No commit, no engine.
