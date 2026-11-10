# Work Order UR-SIM-CPP-PORT-V1 — Port the engine-free simulation from C# to C++

Project: Underreign (DEC-041, DEC-043 Unreal Engine 5). Director: Claude
(orchestration only). Worker: one separate Claude Code subagent (it may use its
own helper subagents for separate files). Execution mode: Production.
Class: Standard. Parallel orders today: UR-UNREAL-SETUP-V1 (folder `Game`) and
UR-UNREAL-BREAKDOWN-V1 (planning document); never touch their paths.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-SIM-CPP-PORT-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-SIM-CPP-PORT-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-SIM-CPP-PORT-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-SIM-CPP-PORT-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

DEC-043: the engine is Unreal; the simulation is ported from C# to C++ with its
tests so it can run inside an Unreal module. Human (2026-11-10): work locally
today with as many Workers as sensible.

## Input (read-only)

`C:/GameDev/Underreign/Simulation/` (C# library, tests, headless runner, maps,
replays, README), `Design/Planning/PROTOTYPE_TECH_DESIGN.md`,
`Evidence/UR-NIGHT-01-V1/SIM_REPORT.md`.

## Target

`C:/GameDev/Underreign/SimulationCpp/`:

1. **Library** `UnderreignSim` in standard C++20, engine-free (no Unreal
   headers, no third-party code, no downloads): same behaviour as the C#
   simulation, same data files (maps, tuning, replays read from
   `Simulation/Maps`, `Simulation/Replays` or copies under `SimulationCpp/Data`).
   Deterministic: integer arithmetic as in C#, the same seeded random generator
   bit for bit, the same tick order. Public headers under `Public/`, sources
   under `Private/`, so the folder can later be wrapped as an Unreal module
   unchanged (no exceptions across the API, no RTTI requirement, no `std::thread`
   inside the simulation).
2. **Tests**: port the 684 NUnit tests to a small self-written test runner (one
   header, no downloads). Every C# test gets a C++ counterpart with the same
   name; list any that cannot be ported and why.
3. **Parity proof**: the three golden replays must reach the same final state
   hashes as recorded (`golden_*.save.txt`), and a 200-seed batch of the
   reasonable scripted player on Cinder Hollow must give exactly the same
   outcome, end tick and lost wave per seed as the C# runner (run the C# headless
   batch with `dotnet` for comparison).
4. **Headless runner** `ur_headless.exe` with the same `run`, `batch`,
   `replay`, `bench` commands.
5. **Build**: MSVC from Visual Studio 2022 Community (toolset 14.44, already
   installed; no CMake is installed — use MSBuild project files or a build
   script calling `cl.exe` via `vcvars64.bat`). Limit parallel compilation to 8
   processes (another Worker builds Unreal at the same time).
6. `SimulationCpp/README.md` (build, test, run, parity results) and
   `Evidence/UR-SIM-CPP-PORT-V1/WORKER_RESULT.md` (external) plus
   `Artifacts/Underreign/Evidence/UR-SIM-CPP-PORT-V1/WORKER_RESULT.md` (Studio):
   test counts, parity table, bench timings versus C#, open issues.

## Limits

- External allowed: `SimulationCpp`, `Evidence/UR-SIM-CPP-PORT-V1`. Studio
  allowed: `Artifacts/Underreign/Evidence/UR-SIM-CPP-PORT-V1`. Everything else
  read-only (the C# `Simulation` folder must stay unchanged; build its outputs
  only into a temp folder, never into `Simulation/`).
- Do NOT commit or push (the Director commits after review). No Unreal, no
  windows in front of the Human, no downloads.
- If full parity cannot be reached, report exactly where it diverges; never
  change the C# rules or the expected hashes to make it pass.
