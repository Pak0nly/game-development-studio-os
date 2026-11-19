# Inkweight Discovery Decisions

Design decisions made by the Human Developer in the Inkweight concept chat
(Discovery mode). Claude proposes and recommends; the Human decides. Answers
are quoted exactly. These are project-scoped directions, not Studio standards.
Entries marked "Director reading" are the Director's interpretation of a Human
statement and stay open for correction by the Human.

## Concept chat — 2026-11-19

| ID | Topic | Human statement | Decision |
|---|---|---|---|
| ID-01 | Core idea | "Was wäre, wenn wir ein "schnelles" unkompliziertes Game entwickeln, in welchem die Nutzer selbst die Grafiken erstellen müssen." | A fast, uncomplicated game in which the players create the graphics themselves; background: the criticism of generative image, video and audio AI with unknown training sources. |
| ID-02 | Ink as the core mechanic | On the proposal "Tinte ist die Währung" (stats derived from measurable properties of the drawing): "Tinte ist schön. Und kann viel her machen, auch wenn nur krakelig gezeichnet." | The ink mechanic is the core of the game. |
| ID-03 | Both modes | "Das als Party Game kann ein Hidden Gem werden. Warum nicht beide Ideen ausarbeiten ?" | Both the solo arena and the party mode are worked out, as one game with two modes on a shared core (as proposed by the Director in the same chat). |
| ID-04 | Project setup, engine, platform, prototype goal | Asked "Soll ich das als neues Projekt anlegen, so wie Underreign, mit diesen beiden Konzepten als Startdokumenten?": "Ja. Du hast bis 9 Uhr Zeit daran zu arbeiten. Gerne mit Unity3D als Zielplattform um es auch mobile und Webtauglich zu bekommen wenn nötig. Hauptziel bleibt Steam. Nutze die Zeit bis 9 Uhr voll aus und suche dir selbst passende Aufgaben. Ziel ist ein spielbarer Prototyp, oder zumindest die Vorbereitung dessen. Wenn nötig oder für visuelle Unterstützung, installiere die Blender." | New project set up like Underreign (DEC-044). Unity is the target engine; Steam is the main goal; mobile and web stay possible. Goal of the first night: a playable prototype, or at least its preparation. The Director chooses fitting tasks himself until 09:00 on 2026-11-20. Blender may be installed if needed. |
| ID-05 | Dispatch gate (Director reading of ID-04 "so wie Underreign") | See ID-04. | Own independent gate copy `Tools/InkweightDispatchGate`, built the way Underreign's was (copy and rename, no shared code or state). |
| ID-06 | Tooling in the cloud container (Director reading of ID-04) | See ID-04. | For this night's cloud work, Node.js (present) and the .NET SDK may be used; the .NET SDK may be installed only inside the disposable cloud container, never on the Human's machine (same wording as Underreign's night orders). The Unity Editor is not installed in the cloud: it needs the Human's licence and its own approval (DEC-014). |
| ID-07 | Working title (Director proposal, not a Human decision) | None yet. | "Inkweight" is used as a working title and folder name only (OD-02). |
