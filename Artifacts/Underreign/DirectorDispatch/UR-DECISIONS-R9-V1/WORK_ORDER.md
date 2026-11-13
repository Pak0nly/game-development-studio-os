# Work Order UR-DECISIONS-R9-V1 — Record the Human's follow-up statements of 2026-11-13

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Routine.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R9-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R9-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R9-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R9-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact, 2026-11-13, Director chat)

The Director had written that the texture images contain licensed scans and
therefore stay only on the Human's computer. The Human:

S1: "Das hatten wir doch vorhin erst geklärt. Visuelle Prüfung ist mandatory,
prüfen via daten reicht nicht aus. Es muss passen und gut aussehen. Asset in einem
Spiel eingesetzt und Prüfung des fits ist nicht gleichgesetzt mit \"ein
alleinstehendes third party asset zum Trainieren einer KI verwenden.\""

S2: "Die dunkle Schnittkappe dient auch zur Identifikation von Goldvorkommen. Sie
kann ruhig etwas heller sein."

S3 (on card 29, after the Director's thoughts: no-build zone around layer
transitions, several transitions per layer some found by digging, attacker sapper
unit, threats from the map edge, teleporters later): "Frage 29: Gefahren die von
Stellen kommen die nicht von Spielern nutzbar sind ist eine gute Idee. Würde dann
auch direkten Einfluss auf Topologie der Karte haben und evtl. neue Wege eröffnen die
genutzt, geschützt oder blockiert werden müssen. Alte Ruinen die ausgehoben und
wiederentdeckt werden wenn man sie \"öffnet\" ist auch gut. Allgemein sollten von
Natur aus freie Flächen erst sichtbar werden, wenn man Zugang zu ihnen hat. Also
sich dort hin durchgegraben. Vorher ist es die gleiche Schnittkantentextur wie
überall sonst auch. Selbst durchgraben könnte so eine große und kostspielige
Aufgabe werden und will gut überlegt sein. Es muss sich lohnen zuerst einen anderen
Weg zu suchen."

S4: "Zu Frage 21: Es wird große Karten geben müssen. DK 2 als Beispiel heranziehen."

S5: "Zu Frage 14: Gerne." (go for UR-ROLES-TIERS-OVERVIEW-V1)

S6: "Gerne einen kurzen Test mit den Punkten 1-4 zu den Wandtexturen." (go for
UR-GROUND-TEXTURE-SHARP-V1)

## Tasks

1. `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`: new section "Follow-ups —
   2026-11-13 (evening)" with a source line and rows from UD-114, quoting exactly:
   - S1: renders and captures containing licensed third-party assets are checked
     visually and shown to the Human (chat, question pages) to judge fit; this is
     in-game use and review, not training; clarifies UD-85, DEC-025 unchanged
     (no training, no generative services).
   - S2: the cut cap on untouched rock may be somewhat lighter; it also marks
     gold deposits, so gold must stay readable in it.
   - S3, the clear statement only: naturally open spaces (caves, ruins) are
     hidden until the player has access, i.e. has dug through to them; until
     then they show the same cut-edge texture as all rock. Record "old ruins
     discovered when opened" and "dangers from places no player can use" as the
     Human's approved direction ("gute Idee", "auch gut"), not yet rules.
   - S5 and S6: the go for the two named orders.
2. `Projects/Underreign/Docs/OPEN_DECISIONS.md`: OD-26 (anti-bottleneck) gets S3
   quoted with the Director's proposals summarised in one sentence and the note
   that digging through yourself should be big and costly so that finding another
   way first pays off; status stays OPEN. OD-25 gets S4 quoted (large maps, the
   genre reference as size example; overview order UR-ROLES-TIERS-OVERVIEW-V1).
3. `Artifacts/Underreign/Evidence/UR-DECISIONS-R9-V1/WORKER_RESULT.md` (Studio,
   plus the verify-worker line) and a short copy at
   `Evidence/UR-DECISIONS-R9-V1/WORKER_RESULT.md` (external). List any conflict
   with existing rows (for example whether any earlier row said scan images stay
   local) without resolving it.

## Limits

Studio allowed: the two project files above and
`Artifacts/Underreign/Evidence/UR-DECISIONS-R9-V1`. External allowed:
`Evidence/UR-DECISIONS-R9-V1`. Everything else read-only. No engine runs, no
network. Do NOT commit or push.
