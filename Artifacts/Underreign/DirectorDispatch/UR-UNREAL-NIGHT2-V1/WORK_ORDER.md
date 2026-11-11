# Work Order UR-UNREAL-NIGHT2-V1 — Bring night 2 into the Unreal game

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.
Parallel order: UR-SIM-ROUND7-V1 edits `SimulationCpp`; never touch it here.
Sync only from the committed HEAD (d8a890a, rules 22).

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-UNREAL-NIGHT2-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-UNREAL-NIGHT2-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-UNREAL-NIGHT2-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-UNREAL-NIGHT2-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

Human (2026-11-11), next test version: "A: Kreaturen, Flucht, Lava, vier
Karten, neue Eindringlinge (Empfehlung)"; first test map: "Zufall."; banner
hint: "C: Kein Hinweis, der Spieler findet es selbst heraus".

## Tasks

Follow `Design/Planning/UNREAL_NEXT_FROM_NIGHT2.md` (the night's job list)
with these decisions:

1. Resync to rules 22 (committed HEAD), wrapper for the new view data,
   Automation tests (new golden replays), parity at four ticks.
2. Placeholders, labels and tooltips (plain words: what it is, what it does)
   for the four new creatures (Footnote with a faint marker on its waiting
   spot), the five new intruders and the ferrets, lava cells (glowing, heat
   shown by the heat overlay), safe-flight state of cinderlings readable.
3. Map choice on the start panel: the four new test maps, Cinder Hollow and its
   variants, plus "Random map" as the default first entry (Human: "Zufall").
   The stats report names the map.
4. No banner hint text (A6 C).
5. Proof (function check per the Human, but rules were synced, so keep the
   Automation tests and parity): one short frame-capped start of each new map
   (gentle bat) showing it loads and runs; stills of each map's start, a new
   creature and a new intruder tooltip.
6. `Game/README.md`, `Game/SPIELANLEITUNG.md` (German: map choice, new
   creatures and intruders in one line each), `Evidence/UR-UNREAL-NIGHT2-V1/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-UNREAL-NIGHT2-V1/WORKER_RESULT.md`.

## Limits

- External allowed: `Game`, `Evidence/UR-UNREAL-NIGHT2-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-UNREAL-NIGHT2-V1`. `SimulationCpp` read-only.
- Do NOT commit or push. Every Unreal run frame-capped (60 fps or lower),
  short, offscreen, one editor process at a time, never a window in front of
  the Human; if the Human has the game open, wait. Build parallelism at most 8.
