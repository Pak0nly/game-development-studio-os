# Work Order UR-UNREAL-RULES25-V1 — Game on the newest rules: doors, hidden traps, new triggers, turret, bridge

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.
Runs after UR-SIM-TRAP-REWORK-V1 is committed (rules 25). Sync only from the
committed HEAD.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-UNREAL-RULES25-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-UNREAL-RULES25-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-UNREAL-RULES25-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-UNREAL-RULES25-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

The Human (2026-11-11): "Mit den alten regeln brauche ich nicht zu testen,
wenn schon klar ist, dass diese geändert wurden und das Spiel maßgeblich
beeinflussen." Rules 23–25 (later flee, gold batches, hidden traps, lockable
doors, self-triggering traps, Weight Plate, Count Trigger, Turret, bridge,
control effects) must reach the game before the next test round.

## Tasks

1. Resync to rules 25 (committed HEAD), wrapper for every new command and view
   field, Automation tests (new golden replays), parity at four ticks.
2. Follow the "What the Unreal game must show" lists in
   `Evidence/UR-SIM-TRAPS-DOORS-V1/WORKER_RESULT.md` and
   `Evidence/UR-SIM-TRAP-REWORK-V1/WORKER_RESULT.md`:
   - build menu: remove plate, tripwire and all chain tools; add Wood door,
     Iron door, Weight Plate, Count Trigger, Turret, Bridge (on lava), each with
     preview, refusal reasons and price; facing preview and a short line from a
     special trigger to the effects it controls; Count Trigger N (2–6) control
     and current count;
   - doors: model with planned / locked / unlocked / broken states, hit-point
     bar, lock toggle (click), feedback for hits, break, repair, lock change;
   - hidden traps: a "seen by intruders" marker and a short flash when revealed;
   - Turret: aim and shot, ammo bar, "needs refill"; hatch vs pit look;
     feedback for panic, knock-back, stun, hold; "heavy" marker on Brute and
     Pavisier; the effect's trigger area shown when placing or selecting;
   - tooltips with the new numbers in plain words; remove all entrance
     keep-out texts; F1 help, start panel, `SPIELANLEITUNG.md` (German).
3. Proof (rules changed, so keep Automation tests and parity): a tool test
   covering door build/lock/break/repair, Weight Plate, Count Trigger (set N),
   Turret refill and a bridge; one gentle-bat start check per map; stills of
   the build menu, a door in each state, a Count Trigger with its line, a
   Turret firing, a bridge.
4. Studio records (no other Studio change): copy the Human's two target images
   byte-identical from
   `C:/Users/jarid/.claude/uploads/cc340d82-47d3-46c9-8b8c-d61ca88c10be/c931bb69-image.png` and
   `.../5cb05e42-image.png` to
   `Projects/Underreign/References/ArtDirection/style_target_game_camera_v1.png` and
   `style_target_forge_closeup_v1.png`, and add one line each to
   `Projects/Underreign/References/ArtDirection/PROVENANCE.md` (the Human's own
   ChatGPT edit of the style sample, prompt quoted: "Wie würde die Unreal
   Engine dies darstellen. Ziel ist Grafikqualität und Realismus."; target
   look, own content per DEC-042). `Projects/Underreign/Docs/OPEN_DECISIONS.md`:
   one OPEN row "Direct control of single units / soul takeover" quoting
   "Nahansicht kann nötig sein, wenn wir die Option einbauen Einheiten selbst
   zu steuern. Entscheidung ist aber noch offen." and "Evtl. Über eine
   Seelenübernahmefunktion die zeitlich begrenzt ist und die Kreatur dabei
   opfert. Also ein eher weise eingesetztes Mittel."
5. `Game/README.md`, `Evidence/UR-UNREAL-RULES25-V1/WORKER_RESULT.md` (external)
   and `Artifacts/Underreign/Evidence/UR-UNREAL-RULES25-V1/WORKER_RESULT.md`.

## Limits

- External allowed: `Game`, `Evidence/UR-UNREAL-RULES25-V1`. Studio allowed:
  `Projects/Underreign/References/ArtDirection`,
  `Projects/Underreign/Docs/OPEN_DECISIONS.md`,
  `Artifacts/Underreign/Evidence/UR-UNREAL-RULES25-V1`. `SimulationCpp` read-only.
- Do NOT commit or push. Every Unreal run frame-capped (60 fps or lower; never
  `-benchmark` or perf.sh), short, offscreen, one editor process at a time,
  never a window in front of the Human; if the Human has the game open, wait.
  Build parallelism at most 8.
