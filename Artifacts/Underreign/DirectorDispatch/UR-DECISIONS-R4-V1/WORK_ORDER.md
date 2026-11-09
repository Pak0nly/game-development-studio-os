# Work Order UR-DECISIONS-R4-V1 — Record catalogue round 4 (dwarves, Crystal Brood)

Project: Underreign (DEC-041). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Routine.

## Before any mutation

Run, from the repository root:

```text
python Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R4-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R4-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R4-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R4-V1/DISPATCH_RECEIPT.json
```

Stop and report if it fails.

## Human authority

Human answers to catalogue round 4, 2026-11-09 (exact copy; "ja" = the
recommendation as written):

- R4-1 "Welche Rolle spielen die Zwerge?" Recommendation: "A: Ein fünftes
  spielbares Volk zur Veröffentlichung, die Tiefzwerge. In Kampagne und freiem
  Spiel graben sie sich auch als Gegner von der Seite herein." Answer: "A:
  Spielbares Volk, auch als Gegner (Empfehlung)".
  Card context (the proposal the Human accepted): "die Tiefzwerge. Seit
  Jahrhunderten unter der Erde, blass, mit großen lichtempfindlichen Augen,
  Bärte mit Steinperlen und Erzringen geflochten, Rüstungen aus Fels, der an
  ihnen festwächst. Sie graben am schnellsten und bauen die stärksten Böden,
  Decken und Mauern. Damit sind sie das Volk für dein Ziel, das Reich nach oben
  und unten einbruchssicher zu machen." Section intro: they must be quite
  different from the Hearthlands dwarves, who live on the surface; these never
  left the depths.
- R4-2 "Bleibt die Kristallbrut ein Volk für später?" Recommendation: "Ja, die
  Kristallbrut bleibt für später." Answer: "Ja, Empfehlung".

## Tasks

1. `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`: new section "Concept
   round 4 — 2026-11-09" with UD-32 (Deep Dwarves are a fifth playable people
   at release and also dig in from the side as rivals in campaign and free
   play; resolves the role part of UD-31) and UD-33 (Crystal Brood stays a
   later people). Quote question, recommendation and answer as above.
2. `Projects/Underreign/Docs/GAME_CONCEPT.md` section 2: replace the
   "Dwarves — role open (UD-31)" note with a full "Deep Dwarves" entry in the
   same format as the other peoples (Play, Traps, Vertical strength, Look,
   Workers, Architecture, Palette). Play: fastest diggers, strongest floors,
   ceilings and walls; the people for breach-proofing (UD-11). Traps: proposal
   in the spirit of stone and weight (for example collapsing vaults, sealing
   walls, crushing blocks), marked as proposal. Look as in the card context;
   must stay clearly different from Hearthlands' surface dwarves, no shared
   look or assets. Update the section intro to "Five peoples at release, the
   Crystal Brood later". Keep every other people unchanged.
3. `Projects/Underreign/Docs/OPEN_DECISIONS.md`: OD-10 -> DECIDED (UD-32).
4. `Projects/Underreign/README.md`: concept line and risks reflect five
   peoples; next step: prototype planning Work Order.
5. Create `Projects/Underreign/Docs/PRODUCTION_PROFILE.md` (minimal, English):
   first line after the title `project_id: Underreign` at column 0, then
   project name, Director model (Claude), dispatch gate
   (`Tools/UnderreignDispatchGate`), engine (Unity 6000.6.4f1), platform (PC,
   Steam first), operational state files, and a note that role profile and
   capability index follow with the prototype planning order (OD-07 stays
   open for those parts).
6. Write `Artifacts/Underreign/Evidence/UR-DECISIONS-R4-V1/WORKER_RESULT.md`:
   files changed, verify-worker result, anything left open.

## Limits

- Allowed mutations only (see manifest): the five project files above and the
  evidence folder. Do not edit `WORK_STATE.md`, `CURRENT_HANDOVER.md`, any
  shared `Docs/` file, `Tools/`, or anything outside the repository.
- No commit, no Unity, no downloads.
- If something cannot be done, report it; do not change the goal.

## Human checkpoint

The Director reports the recorded round to the Human; the next step is a
prototype planning Work Order.
