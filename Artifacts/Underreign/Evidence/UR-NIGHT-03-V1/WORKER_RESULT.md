# UR-NIGHT-03-V1 — Night result (branch `night/2026-11-11`, base `main` 27669b8)

**Kurz auf Deutsch (für dich):**
- Jetzt gibt es auf drei neuen Testkarten (Twin Hollows, Deep Split, Forked Commons) ein **zweites Herz**. Ein
  Computer-Gegner des Aschenbunds spielt dort mit genau deinen Regeln und Befehlen. Du gewinnst, wenn sein Herz fällt.
- **Eindringlinge sind nur noch Ereignisse.** Eine Welle geht auf das reichere Reich, bei Gleichstand auf das nähere,
  bei völligem Gleichstand abwechselnd.
- **Kreaturen haben Rollen:** Stürmer, Wächter, Fernkampf, Späher, Schwer, Zieher, Heiler und Hinterhalt.
- **Das Banner hat eine Haltung:** Angriff, Halten oder Rückzug bei Verwundung.
- **Ein zweites und ein drittes Nest** heben das Kreaturenlimit von 8 auf 12 und 16.
- **Der Gegner hat drei Stufen** (leicht, normal, schwer) **und zwei Charaktere** (vorsichtig, wütend). Ein gut
  spielender Bot schlägt ihn auf leicht/normal/schwer in etwa 57 / 54 / 14 % der Spiele (Twin Hollows).
  "Vorsichtig" ist im Moment der stärkste Charakter, "wütend" der schwächste.
- **Wichtigster Vorschlag:** Fallen sollen gegen Kreaturen nur halb so stark wirken. Sonst bleibt bis zu ein Drittel
  der Partien nach 45 Minuten unentschieden; mit dem Vorschlag sind Partien nach 13–22 Minuten entschieden.
- **Wer sich nur verteidigt, verliert** (87 % auf Twin Hollows).
- **Für fünf Wellen-Karten** liegen Vorschläge für die Wellen bereit (alle zwischen 64 und 85 % gewonnen). Cinder
  Hollow und seine Welle 3 bleiben unverändert.
- **76 Bild-Prompts** im Stil des Brand-hounds sind fertig: Kreaturen, Eindringlinge, Tiefzwerge, Myzelchor, Räume,
  Fallen, Böden und Wände.
- **Sieben unabhängige Prüfungen** (Regelcode, Befehle, Dokumente) haben Fehler gefunden; alle wurden behoben.
  Karten ohne Gegner spielen genau wie vorher. Die Regeln sind auf **Version 36** eingefroren.
- **14 Fragen an dich**, jeweils mit Empfehlung: `Design/Planning/QUESTIONS_FOR_HUMAN_NIGHT3.md`.

## Done (Work Order section 3, all eight items)

| Item | Result | Commit |
|---|---|---|
| 1 Rival realm design | `Design/Bible/RIVAL_REALM.md` | 7f547f5 |
| 2 Rival Heart in the rules | rules 26: realms, rival keeper inside the rules, fights between realms, siege, win/lose, waves as events, traps vs creatures, maps Twin Hollows and Deep Split | ddca1e1 |
| 3 Roles and banner stance | rules 27 | 90e9c70 |
| 4 Larger armies | rules 28: cap 8 / 12 / 16 by Nests; bots build extra Nests; bench 0.31-0.34 ms/tick | ce6dc09 |
| 5 Balance pass (proposals only) | `Design/Planning/BALANCE_NIGHT3.md`, `SimulationCpp/Data/Maps/proposals_night3/` | 6c290eb (tables updated to rules 36 in 6b1d11c) |
| 6 Image prompts | `Design/Art/PROMPTS_NIGHT3.md` (76 prompts) | 58d4915 |
| 7 Questions | `Design/Planning/QUESTIONS_FOR_HUMAN_NIGHT3.md` (N3-1 to N3-14) | 511b2e7 (updated later) |
| 8 Unreal list | `Design/Planning/UNREAL_NEXT_FROM_NIGHT3.md` (UN3-01 to UN3-11) | 4a6fc60 (updated later) |

Section 4 (open-ended), see `OPEN_ENDED.md` and `REVIEWS.md`:

- rules 29: balance findings;
- rules 30: the keeper's attack decision by difficulty and a third rival map, Forked Commons;
- rules 31: doors against creatures, opt-in;
- rules 32: tempers and cinderlings fleeing creatures, opt-in;
- rules 33: the keeper's "still fighting" count;
- rules 34 to 36: fixes from the reviews.

The branch has 36 commits on top of 27669b8, all pushed. Nothing was changed in `main`, `Game`, `StyleSample`,
`Simulation`, `Design/Snapshot`, `Night` or `EngineComparison`.

## Rules version and tests

- `SaveWriter::RulesVersion` = **36**. It is frozen for the morning review. Every rules step from 26 to 36 is
  described in `SimulationCpp/README.md`.
- Tests: 862 → **920**, all passing with clang++ and g++. The new test files are `Tests/Rules26Tests.cpp` to
  `Rules36Tests.cpp`. Changed existing tests:
  - `SaveTests.CommandFactory_RoundTripsEveryCommand`: two new commands.
  - `OpeningVariationTests.OptionOff_...`: the hash from rules 27 (roles).
  - `HeadlessTests` golden cases: renamed or added where an outcome changed.
- Golden replays: 12 in `Data/Replays`, listed in the README rules-36 section. Old sets are in
  `Data/ReplaysLegacy/rules25` to `rules35`. The nine single-realm replays keep their rules-25 hashes through every
  version except rules 27, which changed fights on purpose (roles).
- Checks:
  - 7 reviews: 1 of the documents, 5 of the rules code, 1 of the commands.
  - 4 determinism sweeps: 690 rival games played twice and replayed; all equal.
  - 2 sanitizer runs (ASan and UBSan): clean.
  - A soak of 32 400 games: no errors.
  - New files compile cleanly with `-Wall -Wextra -Wshadow -Wconversion`.
- No MSVC build was run in the container. The code avoids MSVC-hostile constructs, and the new `.cpp` base names are
  unique for `build.bat`'s flat object folder. **Please run the local MSVC build.**

## Balance tables (rules 36, 1000 seeds, details in `BALANCE_NIGHT3.md`)

Rival maps. The player is played by the `keeper` bot (normal). Each cell gives won / lost to the rival.

| Map | easy | normal | hard |
|---|---|---|---|
| Twin Hollows, prototype tuning | 38 / 19 % (42 % undecided) | 37 / 36 % (24 % undecided) | 14 / 83 % |
| Twin Hollows, trap 50 % proposal | 57 / 36 % | 54 / 43 % | 14 / 85 % |
| Deep Split, trap 50 % | 73 / 15 % | 50 / 48 % | 11 / 86 % |
| Forked Commons, trap 50 % | 53 / 34 % | 65 / 29 % | 38 / 59 % |
| Defending only (reasonable bot), prototype tuning | Twin Hollows 2 / 87 %, Deep Split 3 / 19 % (78 % undecided), Forked Commons 1 / 85 % | | |

Wave maps, reasonable bot. Each pair is now → with the wave proposal:

| Map | Won now → with proposal |
|---|---|
| Cinder Hollow | 97.8 % (no proposal, UD-53) |
| Bellows Gallery | 20.0 → 65.5 % |
| Crownkiln | 29.1 → 74.0 % |
| Inkdrip Shelf | 99.6 → 85.3 % |
| Inkdrip Shelf Lava South | 94.8 → 63.8 % |
| CH New Intruders | 97.3 → 72.4 % |
| Ashthread Drift | 74.3 % (no proposal) |

## Open points

- The Human's choices: N3-1 to N3-14.
  - Trap strength against creatures.
  - The event target.
  - Whether enemy ground can be taken.
  - Doors against creatures, and the flight from creatures (both are switches, off by default).
  - What the difficulty levels mean.
  - The roles.
  - The rule for army size.
  - The stance numbers.
  - The wave proposals.
  - The second people as rival.
  - The rival's colour.
  - Fog of war.
  - The tempers.
- Known design points:
  - Intruders aimed at one realm never strike the other realm's creatures.
  - The furious temper is weak because it has no ranged or healing creatures.
  - On Forked Commons, easy is not easier than normal.
  - The bots fit few doors, so the doors option shows little in bot games.
- For the morning: a local MSVC build (`build.bat`) and `ur_tests.exe`. Then the Unreal steps UN3-01 onward, after
  the review.
