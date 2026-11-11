# Night result — UR-NIGHT-02-V1 (Underreign night shift 2)

## Kurzfassung für dich (Deutsch)

- Diese Nacht hat Kreaturen, Eindringlinge, Taktik und Karten konkret und spielbar gemacht. Die Regeln gingen von Version 7 auf 22. Alles liegt auf dem Zweig `night/2026-11-10`, nur in den erlaubten Ordnern, ohne Merge.
- **Vier neue Kreaturen** des Aschenbunds: Kiln-ox (macht den Boden heiß), Lien-hook (zieht Eindringlinge im geraden Gang heran), Wax-surgeon (heilt), Footnote (lauert hinter einer Falle).
- **Fünf neue Eindringlinge**, nur auf den neuen Karten: Sapper, Pavisier, Crossbowman, Lamplighter, Ferreter mit Frettchen. Cinder Hollows Wellen sind unverändert (UD-53, jetzt auch per Test geschützt).
- **Cinderlings fliehen sicher** und sterben fast nie (6,9 → 0,03 pro Spiel auf Cinder Hollow). Neu seit Regel 19: Während einer Welle arbeiten sie nicht mehr direkt am Eingang der Eindringlinge (auf Crownkiln halbiert das die Toten).
- **Lava** ist eine neue Kartenzelle. Es gibt **vier neue Testkarten**: Ashthread Drift, Bellows Gallery, Crownkiln und Inkdrip Shelf (kurzer Ausgang, Mission M7). Dazu kommen Varianten zum Ausprobieren.
- Wichtigste Erkenntnis: **Die Karte entscheidet über die Taktik.** Die neuen Kreaturen kosten den Bot auf Ashthread Drift 28 Punkte, auf Cinder Hollow 5 Punkte; auf Inkdrip Shelf helfen sie. Das Sammelbanner hilft nur auf Crownkiln (88 % statt 67 %, zusammen mit „erst Gold“ sogar 97 %). „Erst Gold, Fallen spät“ gewinnt Ashthread Drift zu 75 %, Cinder Hollow aber nur zu 17 %.
- **Balancing-Hebel:** Brutes, die nur Fallen auf ihrem Weg zerschlagen, bringen Cinder Hollow von 42 % auf 95 % (Ashthread Drift aber 46 % → 39 %). Und oft entscheidet ein einziger Brute pro Welle eine Karte (Ashthread Drift 46 % → 98 %, Bellows Gallery 36 % → 66 %, Mission M2 65 % → 99 %); feinere Hebel wie etwas weniger Brute-Leben sind gemessen.
- Zwölf unabhängige Code-Reviews (eines davon für MSVC) und acht Zahlen-Prüfungen der Dokumente liefen über die Nacht. Jeder echte Fehler wurde behoben oder als bekannte Grenze notiert, auch meine eigenen (Abschnitt 4 unten).
- Tests: 768 → 891, alle grün mit clang 18 und gcc 13; Spielstände sind zwischen beiden Compilern identisch, und ein Lauf mit Speicher- und Fehlerprüfern (Sanitizer) fand nichts. MSVC lief in der Cloud nicht; das prüfen die acht Golden Replays auf deinem PC.
- Deine Entscheidungen (22 Fragen zu heute Nacht, dazu 13 Richtungs- und Kampagnenfragen) stehen in `Design/Planning/QUESTIONS_FOR_HUMAN_NIGHT2.md`, deine nächsten Testrunden in `PLAYTEST_SHEET_NIGHT2.md`. Für den Unreal-Worker gibt es `UNREAL_NEXT_FROM_NIGHT2.md`, für spätere Regelarbeit `NEXT_RULES_STEPS_NIGHT2.md`.

## 1. Result in one paragraph

Night shift 2 ran from 498a303 (rules 7) to rules 22 on `night/2026-11-10` (202 commits including the one that adds this file, no merges, only the four
allowed folders). All nine backlog items of the Work Order are done (section 2) and the open-ended list was worked on
until the end of the night (section 3). Every rules step moved the previous golden replays to
`SimulationCpp/Data/ReplaysLegacy/rules<N>` and recorded new ones; every commit compiles and passes its tests.
Tests: 768 at the start, 891 at the end, all passing with clang 18 and g++ 13 (MSVC was not available in the cloud).
Every number is a proposal or a bot measurement; nothing here is a Human decision.

## 2. Backlog items (Work Order section 3)

| Item | Result | Where |
|---|---|---|
| 1 Ashen Pact creature roster | 10 creatures, 4 built tonight | `Design/Bible/CREATURES_ASHEN_PACT.md` |
| 2 Intruder roster | 10 types, 5 built tonight (+ the ferret) | `Design/Bible/INTRUDERS.md` |
| 3 First new creatures | rules 8: Kiln-ox, Lien-hook, Wax-surgeon (the Footnote followed in rules 12) | `Evidence/UR-NIGHT-02-V1/ITEM3_NEW_CREATURES.md` |
| 4 First new intruders | rules 9: Sapper, Pavisier, Crossbowman (Lamplighter rules 13, Ferreter rules 15) | `ITEM4_NEW_INTRUDERS.md` |
| 5 Maps | rules 11: lava; Ashthread Drift, Bellows Gallery, Crownkiln (Inkdrip Shelf later) | `item5_maps/MAPS_NOTE.md`, `OPEN_INKDRIP_SHELF.md` |
| 6 Gold carrying | measured, no rule change; a "batches" variant tuning to try | `ITEM6_GOLD_CARRYING.md` |
| 7 Cinderlings fleeing | rules 10: safe flight (deaths 6.9 -> 0.03 per play); rules 19-22: keep away from a live entrance | `ITEM7_CINDERLINGS_FLEEING.md`, `RULES19_ENTRANCE_KEEP_OUT.md` |
| 8 Question catalogue | 22 decisions (Part A), the 8 full-game questions (Part B), 5 campaign questions (Part C) | `Design/Planning/QUESTIONS_FOR_HUMAN_NIGHT2.md` |
| 9 Unreal follow-up list | 16 jobs for the local Worker, updated to rules 22 | `Design/Planning/UNREAL_NEXT_FROM_NIGHT2.md` |

## 3. Open-ended work (Work Order section 4)

- More creatures and intruders: the Footnote, the Lamplighter, the Ferreter (rules 12-15).
- More maps and variants: Inkdrip Shelf (campaign M7) with a golden replay; variants Cinder Hollow Ambush, Cinder Hollow
  Lava, Cinder Hollow New Intruders, Inkdrip Shelf Lava South (a counter-example), M1 with a camp (for question N2-C3).
- Bot strategies: opt-in banner bots (`reasonable-stairbanner`, `reasonable-rallybanner` with a map hint `rally L X Y`);
  eleven banner spots measured; economy first (the greedy bot) against defence first; `greedy-stairbanner` (both
  together: Crownkiln 97 %, among the worst plans elsewhere).
- Deeper bot tests: 1000-seed tables of six maps under the final rules (`RULES21_TABLES.md`), soak tests (26,400 + 2 x
  9,600 plays, no error), cross-compiler determinism checks (3,000 of 3,000 plays equal), a sanitizer run (890 tests
  and 600 plays without a report), fuzz tests under the sanitizers (4,500 broken map, save and tuning files and
  20,087 random player commands, no crash; random-command games survive save and load), liveness of every new ability (now also a test).
- Campaign outline (`Design/Bible/CAMPAIGN_OUTLINE.md`), tactics note (`TACTICS_FROM_NIGHT2.md`), playtest sheet,
  next rules steps (`NEXT_RULES_STEPS_NIGHT2.md`), a proposal for the next night (`NEXT_NIGHT_PROPOSAL_NIGHT3.md`), a
  guide for the morning review (`MORNING_REVIEW_GUIDE.md`).
- Review passes: twelve read-only code reviews (one for MSVC portability), eight claims audits of the documents and
  two editorial reviews of the question catalogue; every real finding was fixed
  (rules 12-17, 20-22) or listed as a known limit.

## 4. What went wrong tonight (and what was done)

- The Ferreter released no ferrets for two rules versions (16-17) and no test noticed; found by the documentation pass,
  fixed in rules 18; a liveness test with the built numbers now guards every new ability.
- Several documents claimed a measurement that never existed (a "tuned Lien-hook"); removed by the claims audits.
- The M1 camp was first written into the mission file although question N2-C3 is still open; moved to a variant.
- Commit fde75b9 carried a subagent's unfinished map draft by mistake; the finished map followed in 5c336ac.
- Rules 19 (found and built late) needed three more steps (20-22) after reviews; the tables were re-measured each time.

## 5. Open points for the morning

- MSVC: build with `SimulationCpp/build.bat` and run the eight golden replays on the PC.
- Game resync (job UN2-01): `Game/Scripts/sync_sim.py`'s `DATA_FILES` still names replays that no longer exist; the
  eight current replays and their hashes are listed in UN2-01.
- Known limits, not fixed: a Crossbowman's lane across a walking route still costs a cinderling now and then (F1; 0.23
  deaths per play on Crownkiln), the Footnote's "Heart side" estimate (F4), the minor keep-out limits in
  `RULES19_ENTRANCE_KEEP_OUT.md`, the Inkdrip Sapper (killed at the stair foot before it reaches a trap).
- Balance is deliberately not done: the bot shows which maps the new creatures, the banner and economy-first change.

## 6. Final checks (run at 07:30 UTC, before this file was added)

- Branch `night/2026-11-10` at cde33a6, in sync with `origin`; 201 commits since 498a303, no merge commits.
- Changed paths: only `SimulationCpp/`, `Design/Planning/`, `Design/Bible/`, `Evidence/UR-NIGHT-02-V1/`; no symlinks.
- Build and tests: clang 18 and g++ 13, 891 tests pass with both; the eight golden replays match.
- Rules version 22 (`SimulationCpp/Public/UnderreignSim/Save/SaveWriter.h`).
