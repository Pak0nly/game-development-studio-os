# Underreign Discovery Decisions

Design decisions made by the Human Developer in the concept question catalogue
(Discovery mode). Claude proposes and recommends; the Human decides. "ja" means
the recommendation exactly as written in the catalogue; the recommendation text
is quoted. These are project-scoped design directions, not Studio standards.
Nothing here authorises implementation.

Source: Human answers to the concept catalogue "Ein Reich in der Tiefe"
(artifact https://claude.ai/artifact/TfyGXsaWnvENLpK3cY5dxq), pasted in the
Underreign concept chat on 2026-11-09.

## Concept round 1 — 2026-11-09

| ID | Topic | Catalogue answer | Decision |
|---|---|---|---|
| UD-01 | Working title | C: Underreign | Working title "Underreign". Final title after a store and trademark check (OD-02). |
| UD-02 | Project setup | ja: "Ja, so anlegen wie Hearthlands und MobileArc." | Project folder, confirmed decision entry (DEC-041), own operational state files. |
| UD-03 | Platform | A: "Zuerst PC über Steam" | PC (Windows, Steam) first; other platforms decided later. |
| UD-04 | Engine | A: "Unity wie Hearthlands" | Unity, same version as Hearthlands (6000.6.4f1). |
| UD-05 | Tone | A: "Düster mit frechem Humor" | Dark fantasy with dry, mischievous humour. ("No parody" is a concept proposal, not part of the answer.) |
| UD-06 | Threats from below | ja: "Ja, von oben und von unten. Im Prototyp nur von oben." | Threats from above and below; prototype from above only. |
| UD-07 | Peoples | ja: "Ja, diese vier zur Veröffentlichung, die Kristallbrut später." Note: needs visual descriptions of the peoples; only the Mycelid Choir was easy to picture. | Ashen Pact, Mycelid Choir, Drowned Court, Gearbound Kin at release; Crystal Brood later. Visual descriptions added to `GAME_CONCEPT.md` section 2 (proposal, awaiting Human reaction). |
| UD-08 | Prototype people | C: "Aschenbund (am nächsten am Genre)" | The prototype uses the Ashen Pact (recommendation was the Gearbound Kin). |
| UD-09 | Peoples as rivals | ja: "Ja, später in Kampagne und freiem Spiel. Im Prototyp nur Abenteurer." | Rival peoples later in campaign and free play; prototype has expeditions only. |
| UD-10 | Layers per map | A: "Drei bis fünf" | Three to five layers per map. |
| UD-11 | Layer view | A: "Eine Ebene scharf, Rest durchscheinend". Note: "Man fokussiert sich überwiegend auf eine Ebene. Wichtig ist: Man muss später in der Lage sein sein Reich von Unten wie von Oben einbruchssicher zu gestalten." | One layer sharp, above cut away, below faintly visible, side view for shafts. Play focuses mostly on one layer. Requirement: the player must later be able to make the realm breach-proof from below as well as from above. |
| UD-12 | Gravity rules | ja: "Ja, alle vier im fertigen Spiel. Im Prototyp nur das Wasser." | Water, gas, heat and collapse in the full game; water only in the prototype (see OD-08); prototype part superseded by UD-24 (heat rises). |
| UD-13 | (reserved) | — | — |
| UD-14 | Trap wiring | ja: "Ja, als Kern. Dazu fertige Fallen zum einfach Hinstellen." | Trigger/Link/Effect wiring is a core feature; ready-made traps as well. |
| UD-15 | Intruders learn | ja: "Ja. Bekannte Fallen wirken schwächer, man muss umbauen." | Survivors report traps; known traps become weaker. |
| UD-16 | Lures and decoys | ja: "Ja, im fertigen Spiel. Im Prototyp noch nicht." | In the full game, not in the prototype. |
| UD-17 | (reserved) | — | — |
| UD-18 | Controlling a creature | ja: "Nein, vorerst nicht. Später neu überlegen, dann in eigener Form." | No direct creature control for now; reconsider later in an own form. |
| UD-19 | Look | A: "Stilisiertes 3D" | Stylised 3D with clear colours, slightly oblique top-down; one sample first. |
| UD-20 | Release modes | A: "Kampagnen und freies Spiel" | One campaign per people plus free play against the computer; multiplayer later. |
| UD-21 | Prototype scope | ja: "Ja, so wie beschrieben." | One people, three layers, five rooms, four creatures, six trap parts, water flows down, three intruder types in three waves, about 20 minutes. |
| UD-22 | Placeholder art | ja: "Ja, Platzhalter." | Prototype in greybox placeholders. |
| UD-23 | Concept approval | ja: "Ja, freigegeben mit deinen Antworten oben." | Concept v1 approved with the answers above. Building starts only after a prototype plan and a decided dispatch gate (OD-01). |

## Concept round 2 — 2026-11-09

| ID | Topic | Catalogue answer | Decision |
|---|---|---|---|
| UD-24 | Prototype gravity rule | R2-2 "Welche Schwerkraft-Regel testet der Prototyp?" Recommendation: "A: Hitze steigt, statt Wasser. So zeigt der Aschenbund, was ihn ausmacht, und es bleibt bei einer Regel." Human: "Hitze ist ok." | The prototype tests one gravity rule: heat rises instead of water. Supersedes the prototype part of UD-12 (water only in the prototype); the full game keeps all four rules. Resolves OD-08. |
| UD-25 | Dispatch gate and Hearthlands separation | R2-3 "Wie werden die Bauaufträge für Underreign geprüft?" Recommendation: "A: Eine eigene Kopie für Underreign, wie es Hearthlands damals gemacht hat. Hearthlands bleibt unberührt." Human: "Nichts soll mit Hearthlands überlappen oder verbunden werden. Wenn eine Kopie hilfreich ist, soll kopiert werden." | Underreign gets its own dispatch gate, `Tools/UnderreignDispatchGate`, as an independent copy. Nothing in Underreign overlaps with or is connected to Hearthlands; where useful, things are copied, not shared. Resolves OD-01. |
| UD-26 | Unity project location | R2-4 "Wo liegt das Unity-Projekt?" Recommendation: "A: Wie bei Hearthlands, eigener Ordner C:\GameDev\Underreign mit eigener Versionsverwaltung." Human: "Eigener Ordner erstellen." | The Unity project lives in `C:\GameDev\Underreign` with its own local Git repository and Git LFS; no remote. Resolves OD-03. |
| UD-27 | Commit the setup | R2-5 commit question. Human: "Einchecken." | The setup (gate, project folder, decisions) is committed by the Director after review. |

## Concept round 3 — 2026-11-09

| ID | Topic | Catalogue answer | Decision |
|---|---|---|---|
| UD-28 | Ashen Pact horns | R3-1 "Bekommt der Aschenbund Hörner?" Recommendation: "A: Ja, Hörner aus schwarzem Glas mit Glut darin, ein Ring pro Vertrag. Die Glutkrone fällt weg." Human chose "A: Glashörner mit Vertragsringen (Empfehlung)". | The Ashen Pact wears horns of black glass with glowing embers inside, one ring per contract. The ember crown is dropped. |
| UD-29 | Gearbound Kin | R3-2 "Was wird aus der Zahnradsippe, damit sie keine Zwerge mehr sind?" (play style stays: mechanics, lifts, trapdoors, best trap wiring). Recommendation was A (clockwork people). Human chose "B: Kleine Kobolde mit großen Ohren, die alles zusammenbasteln", note: "Zwerge brauchen wir aber dennoch. Ohne Zwerge kann ich kein Spiel entwickeln." | The Gearbound Kin become small kobold tinkerers with big ears, not dwarves; the play style is unchanged. The dwarf note is recorded as UD-31. |
| UD-30 | Drowned Court | R3-3 "Was wird aus dem Ertrunkenen Hof, damit er kein Meervolk mit Beinen ist?" (play style stays: water stored high and released, floods, currents). Recommendation: "A: Ein Tiefseevolk aus der ewigen Dunkelheit: fast durchsichtige Haut, durch die man leuchtende Adern sieht, Leuchtköder an der Stirn wie bei Anglerfischen, zu viele Augen, lange dünne Glieder. Unheimlich, aber mit Hofzeremoniell." Human chose A. | The Drowned Court becomes an eerie deep-sea people with court ceremony; the play style is unchanged. |
| UD-31 | Dwarves required | Human note on R3-2: "Zwerge brauchen wir aber dennoch. Ohne Zwerge kann ich kein Spiel entwickeln." Earlier remark: "Also Dämonen (die doch eigentlich ihre Hörner brauchen), Meerfolk mit Beinen und Zwerge." | Requirement: dwarves must be in the game. Their role is not decided; it is asked in round 4 (OD-10). |

## Concept round 4 — 2026-11-09

| ID | Topic | Catalogue answer | Decision |
|---|---|---|---|
| UD-32 | Role of the dwarves | R4-1 "Welche Rolle spielen die Zwerge?" Recommendation: "A: Ein fünftes spielbares Volk zur Veröffentlichung, die Tiefzwerge. In Kampagne und freiem Spiel graben sie sich auch als Gegner von der Seite herein." Human: "A: Spielbares Volk, auch als Gegner (Empfehlung)". | The Deep Dwarves are a fifth playable people at release and also dig in from the side as rivals in campaign and free play. Resolves the role part of UD-31 and OD-10. They live in the depths and must stay clearly different from the surface dwarves of Hearthlands; no shared look, model or asset. |
| UD-33 | Crystal Brood | R4-2 "Bleibt die Kristallbrut ein Volk für später?" Recommendation: "Ja, die Kristallbrut bleibt für später." Human: "Ja, Empfehlung". | The Crystal Brood stays a later people; five peoples at release. Refines UD-07. |
