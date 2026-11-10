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

## Night shift 1 questions — 2026-11-10

| ID | Topic | Catalogue answer | Decision |
|---|---|---|---|
| UD-34 | Prototype plan approval | N-1 "Ist der Plan für den Prototyp so freigegeben?" Recommendation: "Ja, freigegeben." Human: "Ja, Empfehlung". | The prototype plan is approved. |
| UD-35 | Standing Unity-start approvals | N-2 "Darf ich für den Unity-Start einmalig alles Nötige einrichten?" (three Unity add-ons: graphics, mouse and keyboard input, automatic tests; install Unity 6.6 if missing; after every night fetch its reviewed results onto the PC; after every finished and reviewed Unity job commit in the Unity folder, without asking each time). Recommendation: "Ja, als dauerhafte Erlaubnis für Underreign." Human: "Ja, Empfehlung". | Standing permission for Underreign: set up everything needed for the Unity start (the three add-ons, Unity 6.6 if missing), fetch each night's reviewed results onto the PC, and commit in the Unity folder after every finished and reviewed Unity job without asking each time. |
| UD-36 | Render pipeline | N-3 "Welches Grafiksystem in Unity?" Human: "C: Leicht jetzt, nach der ersten Bildprobe neu prüfen" | Light pipeline (URP) now; re-check after the first look sample. Resolves OD-04 for now. The Human's note ("Bevor wir starten zur Diskussion: Was wäre, wenn wir Unreal Engine nutzen würden? Grafisch würde da viel mehr drin sein.") is a discussion topic, not a decision; see OD-11. |
| UD-37 | Layer rules and walling in the Heart | N-4 "Was passiert, wenn der Spieler sein Herz komplett einmauert?" Recommendation A: Brutes dig through the softest wall or down through the floor; the last stair to the Heart cannot be removed during a wave. Human: "A: Abenteurer graben sich durch (Empfehlung)" with note: "Seitenwände sind wie bei Dungeon Keeper immer einreißbar, haben nur unterschiedlich viel HP/Rüstung. Decke und Boden sind es jedoch nicht. Erklärung für Spieler: Ebenen sind nicht direkt aneinander liegend, es ist jeweils eine gewisse Dicke zwischen ihnen. Evtl sind sie nur via vorgegebenen Positionen verbindbar? Steht zur Diskussion." | Side walls can always be broken down and differ only in hit points and armour. Ceilings and floors between layers cannot be broken. Layers are separated by a thickness of rock. Intruders dig through the softest side wall; the rest of recommendation A is accepted. The "dig down through the floor" part of recommendation A is superseded by the note and is NOT adopted. Whether layers connect only at predefined positions is open (OD-12). |
| UD-38 | Luck and creature order | N-5 "Glück: Soll so viel davon abhängen, welche Kreaturen zuerst kommen?" Human: "Anders" with note: "Balanceing später. Es ist ja noch nichtmal klar wie viele Kreaturen es geben wird, was diese können und welche taktischen Möglichkeiten zur Verfügung stehen werden." | Balancing of the creature mix and arrival-order luck is postponed until creatures, their abilities and the tactical options are clearer. |
| UD-39 | Creature survival | N-6 "Wie viele Kreaturen sollen ein Spiel überleben?" Recommendation: "A: Die Regeln so lassen, Kreaturen dürfen sterben. Das Ziel für den Prototyp auf etwa die Hälfte senken und in deinen Testrunden beurteilen." Human: "A: So lassen, in den Testrunden beurteilen (Empfehlung)" with note: "Ich verstehe nicht ganz 'Spiel überleben'. Es werden keine Kreaturen in ein nächstes Spiel/Runde übertragen?" | Rules unchanged, creatures may die; the prototype survival target is lowered to about half and judged in the Human's test plays. The Human's question is recorded as a note: the wording "survive a game" was unclear to the Human, who asked whether no creatures carry over to a next game or round. It needs a plain answer in the next catalogue round. |
| UD-40 | Heat variant | N-7 "Wie wichtig soll steigende Hitze im Prototyp sein?" Human: "A: Hitzekamine testen (Empfehlung)" | The "heat chimneys" variant is played next to the default map. |
| UD-41 | Prototype difficulty | N-8 "Wie schwer soll der Prototyp sein?" Human: "A: So lassen (Empfehlung)" | Prototype difficulty stays as planned. |
| UD-42 | Role of traps | N-9 "Wie viel der Verteidigung sollen Fallen tragen?" Human: "B: Kreaturen bleiben die Hauptsache" with note: "Nur Verteidigen gewinnt nicht." | Creatures stay the main defence; traps support them. The remark "Nur Verteidigen gewinnt nicht." is recorded as a remark, a direction for later (OD-13), not a decision. |
| UD-43 | Name of what sleeps below | N-10 "„Der Schläfer“ für die Gefahr von unten?" Recommendation: no proper name on screen; "what sleeps below" and each people's own word for it. Human: "A: Kein Eigenname (Empfehlung)" | No proper name on screen for the danger from below; use "what sleeps below" and each people's own word for it. |
| UD-44 | Oath-warden | N-11 "Die Kreatur „Oathkeeper“ heißt jetzt „Oath-warden“ (Eidwächter). Einverstanden?" Recommendation: "Ja, Oath-warden behalten." Human: "Ja, Empfehlung". | The creature name Oath-warden (Eidwächter) is kept. |
| UD-45 | Sporelings | N-12 "Die Arbeiter des Myzelchors hießen „Sporelings“. Umbenennen?" Human: "Anders" with note: "Sporelings als Kreaturen/Einheiten Name ist passendste. Eine Knospe wird nicht mit Pilzen assoziiert." | "Sporelings" stays as the name of the Mycelid Choir's creatures/units; the rename is rejected. Risk noted: the name may also be used outside the game; check it with the title and name check (OD-02). |

Not answered: N-13 (full-game direction questions) stays open as OD-14.
