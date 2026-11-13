# Work Order UR-DECISIONS-R8-V1 — Record the answers to the open-questions page of 2026-11-13

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Routine.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R8-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R8-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R8-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R8-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Sources

- `QUESTION_PAGE.html` in this folder: the exact question page the Human
  answered (37 cards in 8 groups; each card has a title, context, the shown
  recommendation and the options). Card numbers below follow the page order.
  Night questions come from `C:/GameDev/Underreign/Design/Planning/QUESTIONS_FOR_HUMAN_NIGHT2.md`,
  `..._NIGHT3.md` and `..._NIGHT4.md` (read-only); find the matching source
  question for every card by its title and content and cite its ID.
- The Human's answers, exact (2026-11-13, pasted into the Director chat), below.

## Human answers (exact, spelling included)

```text
Underreign, alle offenen Fragen (13.11.), Antworten:
1 Die nebenbei neu gespeicherte Grau-Material-Datei: A: Verwerfen und Skript reparieren (Empfehlung)
2 Pakete mit Nahkampf-Animationen kaufen?: A: Raussuchen, ich entscheide dann (Empfehlung)
3 Wie wirken die durchgehenden Felswände?: A: Gut so, Kleinigkeiten später (Empfehlung)
4 Kamera und Durchsicht im Wandmuster: A: Passt so (Empfehlung) | Notiz: Notiz für später: Sehschwächen berücksichtigen.
5 Wann sollen Wände mit Physik zerbröseln?: A: Groß beim Durchbruch, klein beim Graben (Empfehlung) | Notiz: Arbeiter können dabei gerne später kurz erschrecken, zur Seite/nach Hinten springen, einen Laut von sich geben, irgenwie sowas. Aber erst später.
6 Wie sollen Figuren von Ebene zu Ebene kommen?: A: Leiter oder Kettenaufzug (Empfehlung)
7 Soll man auf deinem Boden das Feldraster sehen?: A: Raster zeigen (Empfehlung) | Notiz: Testen
8 Wie nah sollen Kämpfer beieinander stehen?: A: Im Kampf aufeinander zurücken (Empfehlung) | Notiz: Ein "geordnetes " Handgemenge mit zusätzlich umherfliegendem Zeugs.
9 Wie stark sollen Fallen gegen gegnerische Kreaturen sein?: A: Halbe Stärke gegen Kreaturen (Empfehlung)
10 Welches Reich besuchen die Eindringlings-Ereignisse?: A: Reicher, sonst näher, sonst abwechselnd (Empfehlung) | Notiz: Mehr Gold kann aber auch bedeuten, dass gerade einfach nur nichts ausgegeben wurde oder schlecht gewirtschaftet. Nicht unbedingt, dass man der stärkere ist. 
Man könnte über Systemnachrichten arbeiten und Dinge in Scene setzend ankündigen. Nach dem Motto: "Eine Gruppe Abenteuer haben von deinem Reichtum gehört und lechzen danach!", oder "Der Kreuzzug hörte von deinen schändlichen Taten, gebe Acht!"  
Auch kann man mehr als nur Abenteurer von oben schicken. Auch von Unten kommen Gefahren.
11 Kannst du den Boden des Gegners übernehmen?: Anders | Notiz: Hier können wir uns wieder von Dungeon Keeper 2 trennen. Dort war es Antwort C. (Was nicht schlecht und auch weiterhin eine Option ist.) Die Frage wie sähe eine Zerstörung von Räumen aus? Müssen Kreaturen erste die Einrichtung kurz und klein schlagen? Das könnte das Ziel zum gegnerischen Herz zu kommen verlangsamen. Das sollen überwiegend die Fallen tun. 
Antwort B fällt auf jeden Fall raus.
12 Sollen deine verschlossenen Türen gegnerische Kreaturen aufhalten?: A: Ja, aufbrechbar wie bei einem Brute (Empfehlung) | Notiz: Laufende Rammböcke als spezialisiertere Einheit zu haben ist eine gute Sache. Das gibt Purpose. Sowas braucht wenn möglich jede Kreatur. Eine Rolle.
13 Sollen Cinderlings vor gegnerischen Kreaturen fliehen?: A: Ja, dieselbe Flucht (Empfehlung)
14 Stimmen die Kampfaufgaben der Kreaturen?: A: Wie gebaut (Empfehlung) | Notiz: Vergleiche mit Dungeon Keeper 2, welche Spezialisierungen gab es dort und wozu wurden sie eingesetzt. (Wenn überhaupt.) Es spricht nichts dagegen Kreaturen Tiers zu haben und später stärkere Versionen einer Rolle zu bekommen. Dafür halt weniger und potentiell taktischer, vorsichtiger einzusetzen. 
Es braucht aber natürlich auch Kanonenfutter.
15 Wie sollen größere Heere entstehen?: A: Nester heben das Limit, wie gebaut (Empfehlung) | Notiz: Fläche und Sold grenzen die Anzahl natürlich ein. Wenn sich jemand auf sehr viele günstige oder sehr wenige teure Kreaturen konzentrieren möchte soll er das tun. Wenn jemand ausgewogen arbeiten möchte, soll er das tun. Wenn jemand alles riskiert und kurz vor dem Bankrott angreifen will, weil er gerade so viele Kreaturen hat die er sich nicht leisten kann und demnach beim nächsten Zahltag verschwinden oder schlimmeres, soll er das tun.
16 Die Zahlen der Banner-Haltung: A: 8 Felder und 50 % (Empfehlung) | Notiz: Automatischer Rückzug muss getestet werden.
17 Was soll die Schwierigkeitsstufe des Computers bedeuten?: A: Klügeres Spiel, gleiche Wirtschaft (Empfehlung)
18 Die Charaktere des Gegners: vorsichtig und wütend: B: Wütend stärken, damit alle Charaktere gleich stark sind | Notiz: Hinterhältig, Guerrilla Taktiken, Schwachstellen auslotend und ausnutzen. Alles weitere Varianten möglich.
19 Die Wellen-Vorschläge für die Testkarten: A: Vorschläge für alle Testkarten übernehmen (Empfehlung)
20 Welches zweite Volk soll als Rivale zuerst kommen?: A: Die Tiefzwerge (Empfehlung)
21 Wie sieht das gegnerische Reich anders aus als deins?: Anders | Notiz: Wir brauchen neutrale Banner, Verzierungen, Markierungen die den Farbton des Spielers annehmen. Es wird nicht nur bei einem Gegner bleiben. Ich Stelle mir gerade 6-8 Spieler insgesamt vor.
22 Nebel über dem gegnerischen Reich: A: Später (Empfehlung)
23 Wie viel von der Kristallbrut zeigt sich vor ihrer eigenen Veröffentlichung?: A: Nur Andeutungen (Empfehlung)
24 Kann das Erwachen dessen, was unten schläft, dich die Karte kosten?: A: Nein, eine Krise (Empfehlung) | Notiz: Ähnlich überlebbar wie die Überfälle von oben nur etwas grausamer. Wenn man sich doof anstellt bringt einen aber auch beides um.
25 Ist die tiefste Felsschicht, die Stille, je spielbar?: A: Nur im Finale und als eine Einstellung (Empfehlung)
26 Wie viel Diplomatie mit anderen Völkern?: A: Leicht (Empfehlung) | Notiz: "Der Feind meines Feindes ist mein Freund." Zumindest temporäre Bündnisse sind denkbar. Auch Unterwerfung evlt. . Diskussionspunkt.
27 Der Hoftag des Drowned Court: A: Volle Spielmechanik (Empfehlung)
28 Die „Eine Stimme" des Myzelchors: A: Stimmung und Wissen (Empfehlung) | Notiz: Viel Balanceing Aufwand, aber spannend wenn sich jedes Volk etwas anders spielt.
29 Kann man ein Reich je perfekt gegen Angriffe abdichten?: A: Keine perfekte Abdichtung (Empfehlung) | Notiz: Jede Wand kann weggegraben werden, jede Tür zerstört.  Räume werden durch ihre Bodenflächen definiert und sind nicht an intakte Wände gebunden. Übergänge zwischen Ebenen werden Bottlenecks. Spieler werden diese frühzeitig einkesseln, befestigen, verteidigen oder bis aufs äußerste verminen. 
Ich würde ein Taktik testen, den Runtergang als Zentrum eines offenen großen Raumes zu haben und in passendem maximal Abstand alles mit Kanonen vollpflastern um alles und jeden sofort zu zerlegen sobald sie diese Eben betreten. 

Hier müssen wir dringend nachbesser was dieses Feature angeht um genau sowas zu vermeiden. 
Optionen als Diskussionsgedanken:
Feste natürliche Punkte die weiträumig nicht einnehmbar sind. 
Möglichkeiten Teleporter zu bauen die an zufällige Stellen teleportieren. (Herz und Räume müssen hier irgendwie abgeschottet werden können. Hierbei dann eine ganze Ebene zu einem Raum umbauen wird ebenfalls ein Problem werden können. Kostenfaktor.) 
Einfach mehr Zugänge anlegen um Bottlenecks zumindest zu verteilen. 
Den Rand als allgemeinen Zugangspunk ansehen. 
Gerne deine Gedanken und weitere Vorschläge zur Diskussion.
30 Bedrohung von unten in der Aschenbund-Kampagne: Anders | Notiz: Das Thema Kampagne bleibt offen für später.
31 Wem gehört das Herz, das du in der Kampagne zerstörst?: Anders | Notiz: Das Thema Kampagne bleibt offen für später.
35 Einzelne Kreaturen selbst steuern?: A: Später entscheiden (Empfehlung)
36 Wie soll das Spiel verkauft werden?: A: Später (Empfehlung)
37 Der Name „Underreign": A: Später prüfen (Empfehlung)
```

Cards 32, 33 and 34 (campaign) were not answered.

## Rules for recording

- A chosen option ("A: ... (Empfehlung)" or another letter) is a decision. It
  means the shown recommendation or option text as written on the page; quote
  the Human's answer line exactly and state the decision in plain English using
  the page's recommendation or option text (translate faithfully, do not add).
- A "Notiz" is recorded under the same row as the Human's note, quoted exactly,
  marked as a note for later, not as a decision (examples: accessibility for
  weak eyesight, worker startle reaction later, test the grid, auto retreat must
  be tested, enemy-of-my-enemy alliances as a discussion point).
- "Anders" with a note is not a decision, with one exception: card 11
  "Antwort B fällt auf jeden Fall raus" excludes option B (quote option B's text
  from the page). Cards 11 and 21 become new OPEN rows in `OPEN_DECISIONS.md`
  with the note quoted. Card 29: option A is decided; the anti-bottleneck design
  the note asks for ("Hier müssen wir dringend nachbessern ...") becomes one new
  OPEN row that names the Human's discussion options and points at UD-47 (layers
  connect only at fixed breakthrough points), without changing UD-47.
- Cards 30, 31 and the unanswered 32 to 34: one note that the campaign topic
  stays open for later (quote card 30/31's note); keep or add OPEN rows only if
  no existing row covers them.
- Cards 35, 36, 37: existing rows OD-23, OD-05, OD-02 stay OPEN; add the dated
  answer "later" to their notes.
- Cards 1 and 2 are executed by separate orders (UR-GREYBOX-RESAVE-FIX-V1,
  UR-MELEE-PACKS-RESEARCH-V1); record the answer, note the order name.
- Where an answer settles or changes an existing OD row (for example OD-21 combat
  roles and banner stance, OD-22 army size), update that row's status and note,
  citing the new UD numbers. Do not change any other decision's meaning; if an
  answer contradicts an existing UD row, do not resolve it: list the conflict in
  WORKER_RESULT.md.

## Tasks

1. Studio `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`: new section
   "Open-questions page — 2026-11-13" with a source line (like the existing
   sections) and rows from UD-86 onward in the existing table format, one row
   per decided card (cite the night question ID where there is one).
2. Studio `Projects/Underreign/Docs/OPEN_DECISIONS.md`: new OPEN rows from OD-24
   onward as described, and the updates to existing rows.
3. External, game repository: in each of `Design/Planning/QUESTIONS_FOR_HUMAN_NIGHT2.md`,
   `QUESTIONS_FOR_HUMAN_NIGHT3.md` and `QUESTIONS_FOR_HUMAN_NIGHT4.md`, add only a
   one-line "Answered 2026-11-13: see UD-nn" (or "Still open: see OD-nn") under
   each question answered here. Change nothing else in those files.
4. `Artifacts/Underreign/Evidence/UR-DECISIONS-R8-V1/WORKER_RESULT.md` (Studio,
   plus the verify-worker line): card → row mapping table, conflicts found, and
   `Evidence/UR-DECISIONS-R8-V1/WORKER_RESULT.md` (external, a short copy).

## Limits

Studio allowed: the two project files above and
`Artifacts/Underreign/Evidence/UR-DECISIONS-R8-V1`. External allowed: the three
question files named in task 3 and `Evidence/UR-DECISIONS-R8-V1`. Everything
else read-only; `ArtSource/GroundTextureTest` and the greybox material belong to
other orders. No engine runs, no network. Do NOT commit or push.
