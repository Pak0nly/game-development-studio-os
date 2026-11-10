# Work Order UR-UNREAL-03-V1 — Bring the C++ rules into Unreal and connect them (jobs 03 and 04)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.
Parallel order: UR-SIM-RULES-V1 changes rules inside `SimulationCpp`; never
edit `SimulationCpp` here.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-UNREAL-03-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-UNREAL-03-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-UNREAL-03-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-UNREAL-03-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

`Design/Planning/UNREAL_WORK_BREAKDOWN.md` jobs UR-UNREAL-03 (rules as an
Unreal module) and UR-UNREAL-04 (connect the rules: game clock, commands,
event feed). The C++ port (UR-SIM-CPP-PORT-V1, independent review pending or
passed) has full parity with the C# rules. Human (2026-11-10): work locally
today with as many Workers as sensible.

## Tasks

1. **Module**: the other Worker changes `SimulationCpp` in parallel, so do not
   compile from it directly. Write `Game/Scripts/sync_sim.py`, which copies the
   library (`SimulationCpp/Public`, `/Private`) from the **committed** state of
   the external repository (`git show`/`git archive` of `HEAD`, not the working
   tree) into `Game/Underreign/Source/UnderreignSim/Lib/` and writes a manifest
   with the source commit and file hashes. Compile it there with
   `bEnableExceptions = true` (the library throws internally; see
   `SimulationCpp/README.md`), no Unreal types inside the library. If Unreal's
   compiler settings force source changes, keep them out of the copied files
   (wrapper headers or build flags) and report them.
2. **Tests in Unreal**: an Automation test that runs the three golden replays
   (copied as data with the library) through the module and checks the final
   state hashes; plus a guard test proving the copied files match the sync
   manifest.
3. **Game clock and commands** (`Game` module): a subsystem that loads
   `cinder_hollow.map.txt` and `prototype.tuning.txt`, runs 10 ticks per second
   with pause and speed 1×/2×/4×, exposes the state read-only, accepts player
   orders as simulation commands, and publishes the event feed.
4. **Greybox follows the rules**: `AURGreyboxMap` updates from the simulation
   state each tick (dug cells, claimed ground, rooms, trap parts, heat optional
   later), instead of only the static file read.
5. **Minimal play**: mouse tools for marking digs and placing the five rooms
   on claimed ground (left click, right click cancels), simple placeholder
   shapes for cinderlings, creatures and intruders moving smoothly between
   ticks, HUD fed from the state (clock, gold, wave timer, Heart health). Trap
   wiring UI is a later job.
6. **Proof**: an Automation or `-game` run where a scripted command list (the
   reasonable bot's first minutes, taken from the simulation's bot) plays
   through the game layer and reaches the same state hash at a chosen tick as
   the headless C++ runner built from the same synced commit; headless stills and a 10 s PNG sequence of the game
   running at 4×; frame time.
7. `Game/README.md` update, `Evidence/UR-UNREAL-03-V1/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-UNREAL-03-V1/WORKER_RESULT.md`
   (Studio).

## Limits

- External allowed: `Game`, `Evidence/UR-UNREAL-03-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-UNREAL-03-V1`. `SimulationCpp` and
  everything else read-only.
- Do NOT commit or push. Unreal headless/offscreen, one editor process at a
  time, never a window in front of the Human; build parallelism at most 8. No
  downloads or Fab content.
