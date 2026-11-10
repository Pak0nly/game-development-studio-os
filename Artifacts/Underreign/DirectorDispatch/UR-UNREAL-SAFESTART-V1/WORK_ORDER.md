# Work Order UR-UNREAL-SAFESTART-V1 — Gentle start: frame cap, lower load, readable layer buttons

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Routine.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-UNREAL-SAFESTART-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-UNREAL-SAFESTART-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-UNREAL-SAFESTART-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-UNREAL-SAFESTART-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

Human (2026-11-10): "Ich spielte eine Version bevor du den letzten Link gepostet
hattest. Dabei ist die Grafikkarte sehr stark beansprucht worden. ... Den
startete ich und damit ging der PC aus." The PC (RX 6800 XT) switched off hard
on starting `Game/Play Underreign.bat` (commit 07f2f66), and once before today
during engine comparison renders. The game currently runs uncapped (about
136 fps, Epic settings, hardware ray tracing). A playable prototype must never
load the graphics card like that.

## Tasks

1. **Frame cap and sane defaults** for every game start (not only the bat):
   frame rate capped at 60 (`t.MaxFPS`), VSync on, scalability "High" instead of
   "Epic" as the default; game settings in `Config/DefaultGameUserSettings.ini`
   / `DefaultEngine.ini` or console variables at startup, whichever really
   applies to `-game` runs from the editor binary (prove it in the log).
2. **Gentle mode**: a second start script `Game/Play Underreign (Schonmodus).bat`:
   30 fps cap, VSync, scalability Medium or Low, hardware ray tracing off
   (software Lumen or no Lumen), 1600 × 900 window. Same "how to play" start.
3. **Start load**: find out what the first start compiles or loads (shader
   compile, DDC) and whether that can spike load; if a cheap measure exists
   (e.g. fewer shader compile workers, lower priority, a one-time warm-up the
   Worker runs now under the cap), apply it; otherwise document it.
4. **Layer buttons** on the left show map characters ("@", "(H)"): show plain
   names instead (for example "1 Upper", "2 Middle - Call-stone", "3 Deep -
   Heart").
5. **Proof**: for both scripts, a short offscreen run (at most 60 s each,
   always capped, never uncapped) logging fps, GPU time and the active
   scalability / ray tracing settings; one still of each; layer buttons still.
   Your own runs must never exceed the 60 fps cap and never run Epic uncapped.
6. `Game/README.md` and `Game/SPIELANLEITUNG.md` (German, plain: which script
   to use, "Schonmodus" if the PC struggles), and
   `Evidence/UR-UNREAL-SAFESTART-V1/WORKER_RESULT.md` (external) plus
   `Artifacts/Underreign/Evidence/UR-UNREAL-SAFESTART-V1/WORKER_RESULT.md` (Studio).

## Limits

- External allowed: `Game`, `Evidence/UR-UNREAL-SAFESTART-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-UNREAL-SAFESTART-V1`. `SimulationCpp` and
  everything else read-only; rules and tuning unchanged.
- Do NOT commit or push. Headless/offscreen, one editor process at a time, never
  a window in front of the Human; build parallelism at most 8. No downloads.
