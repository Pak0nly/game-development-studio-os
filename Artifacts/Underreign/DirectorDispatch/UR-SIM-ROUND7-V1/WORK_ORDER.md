# Work Order UR-SIM-ROUND7-V1 — Clear rule decisions of round 7 and the decision record

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.
Parallel order: UR-UNREAL-NIGHT2-V1 edits `Game`; never touch `Game` here.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-SIM-ROUND7-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-SIM-ROUND7-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-SIM-ROUND7-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-SIM-ROUND7-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human answers (2026-11-11, exact, round 7 catalogue of night 2)

Source questions: `C:/GameDev/Underreign/Design/Planning/QUESTIONS_FOR_HUMAN_NIGHT2.md`
(Part A; ids A1–A22 map to N2-A1–N2-A22 there).

```text
A1 ...: A: So lassen, nach Testrunden entscheiden (Empfehlung) | Notiz: Es kommt auch drauf an, wie Kämpfe grundlegend gestaltet werden. In Dungeon Keeper 2 ließ man einfach alle Kreaturen auf einen Punkt fallen und es gab ne große Schlägerei. Wenig Taktik, kaum spezialisierte Einheiten. Etwas mehr Taktische Varianz ist wünschenswert, ist nur die Frage wie diese umgesetzt werden kann.
A9: A (Empfehlung). A11: A (Empfehlung). A12: A (Empfehlung). A13: A (Empfehlung). A10: A (Empfehlung). A15: A: Auch Düsenhitze halbieren (Empfehlung). A16: A (Empfehlung). A20: A (Empfehlung). A4: A (Empfehlung). A7: A (Empfehlung). A18: A (Empfehlung). A14: A: Ja, gleiche freie Linie (Empfehlung).
A19: Anders | Notiz: Spielergedanken: Warum Fallen bauen, wenn "alles" darauf ausgelegt ist diese zu umgehen / unschädlich zu machen oder frühzeitig auszulösen? Auch wenn mir die Idee, das jemand mit Frettchen "kämpft" sehr gefällt.
A5: Anders | Notiz: Zufall.
A6: C: Kein Hinweis, der Spieler findet es selbst heraus | Notiz: Driften wir gerade etwas zu sehr ins Tower defense genre ab?
A2: C: Sichere Flucht, aber sie fliehen etwas später, sodass etwas Risiko bleibt
A3: Anders | Notiz: Als ich das erste Mal gesehen habe wie alle meine Fallen nacheinander zerstört wurden, dachte ich mir: "Warum überhaupt Fallen aufstellen, wenn sie eh nicht auslösen oder kaputt gemacht werden?"
A21: (keine Wahl) | Notiz: Crossbowman können ruhig Jagd auf Arbeiter machen. Wenn das Spiel alles vor allem Schützt und eine automatische Lösung für jedes Problem oder Hindernis bietet lohnt es sich nicht es zu spielen. Dann ist es nur zum zuschauen gebaut und nicht als Skillcheck.
A22: Anders | Notiz: Wir brauchen Türen.
A17: C: Portionen sofort zum Standard machen
A8: Anders | Notiz: Wie viele gab es in Dungeon Keeper 2? Wieviel Varianz und Armeestärke?
```

Follow-up questions in chat, answers: traps "Versteckt (Empfehlung)" (traps hidden until they fire once or a scout spots them; Brutes bash only revealed parts directly on their route; trap breakers like Sapper/Ferreter rare and only on later maps); doors "Abschließbar (Empfehlung)" (wooden/iron doors from the Forge, a locked door stops intruders until broken, own creatures and cinderlings pass, the automatic entrance keep-out goes away); combat "Rollen (Empfehlung),Haltung am Banner (Empfehlung),Größere Armeen"; approach "Erst Spielversion (Empfehlung)" (today the playable version and the clear decisions; traps, doors and combat in tonight's night shift).

## Tasks

1. **Rules (SimulationCpp), only these clear decisions**; deterministic,
   proposals marked, tests, new golden replays, 200-seed note:
   - A2 C: safe flight stays, but cinderlings flee a little later so some risk
     remains (pick a plain rule, e.g. smaller flee radius or a short reaction
     delay; measure deaths per game, target clearly above 0.03 but far below 6.9).
   - A21: remove the special Crossbowman flee rule; only the normal flee radius
     applies (Crossbowmen may hunt workers).
   - A17 C: the gold "batches" variant becomes the default (the tuning tried in
     the night); report the Ashthread Drift drop the night saw and its cause if
     cheap to find, but do not block on it.
   - A15 A: heat inside a Flame Vent's column counts as a vent hit for the
     Pavisier's shield.
   - A14 A: the Ember-witch needs the same clear straight line as the
     Crossbowman.
   Do NOT change traps visibility, bashing, doors, entrance keep-out, creature
   cap or combat roles (tonight's night shift does those).
2. **Decision record**: Studio `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`
   new section "Night 2 catalogue — 2026-11-11" with one row per answered
   question (quote exactly), and rows for the follow-up decisions (traps hidden,
   lockable doors replacing the keep-out, combat by roles + banner stance +
   larger armies, order of work). Notes that are questions or remarks (A1, A3,
   A6, A8, A19) are recorded as remarks, not decisions; A5 "Zufall" = the first
   test map is chosen at random. `OPEN_DECISIONS.md`: open rows for the night
   items (hidden traps, doors, combat roles/stance, army size) marked
   "decided in principle, rules pending".
3. `SimulationCpp/README.md`, `Evidence/UR-SIM-ROUND7-V1/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-SIM-ROUND7-V1/WORKER_RESULT.md`.

## Limits

- External allowed: `SimulationCpp`, `Evidence/UR-SIM-ROUND7-V1`. Studio allowed:
  `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`,
  `Projects/Underreign/Docs/OPEN_DECISIONS.md`,
  `Artifacts/Underreign/Evidence/UR-SIM-ROUND7-V1`. Everything else read-only.
- Do NOT commit or push. Compiler parallelism at most 8. No Unreal.
