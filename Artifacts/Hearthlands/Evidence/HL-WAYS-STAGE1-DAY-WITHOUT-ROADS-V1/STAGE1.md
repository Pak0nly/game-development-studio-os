# Wegesystem, Stufe 1: der Tag ohne Straßen im echten Spielkern

## Starten

- Spielen: `C:/GameDev/Hearthlands/Unity/Builds/HL-Game-ways-r1/Wegesystem Tag ohne Strassen spielen.cmd`
- Vergleichslauf mit den Feuern, Hütten und Baustellen des Wegetests: `Wegesystem Vergleichslauf (Wegetest-Baustellen).cmd` (gleicher Ordner)

Testtal, immer Tag. Rechts ist das Feld: Tempo (Leertaste, 1 bis 4), Bauen, Pfad zur Straße, ein kurzer Bericht.

## Was du jetzt tun kannst

- Du beginnst mit dem Herzfeuer, 8 Zwergen und 12 Stämmen, 8 Steinen, 4 Wild. Es gibt keine Straßen und keine Fahnen.
- Du setzt Gebäude und kleine Feuer aus dem Feld. Die Vorschau zeigt den Platz grün oder rot und sagt dir unten im Feld, warum
  ein Platz nicht geht (zum Beispiel: „Zu weit draußen: 56 % seines Bereichs lägen außerhalb deines Gebiets (höchstens 50 %)“,
  „Dieses Land hast du noch nicht gesehen“, „Ufer und Becken sind gesperrt“). Beim Feuer siehst du seinen Bereich als Ring.
- Mit R wählst du die Seite der Türfackel (Süd, Südost, Ost, West, Südwest). Dort liegen alle Waren des Gebäudes.
- Die Zwerge wohnen an ihren Feuern. Sie holen das Baumaterial zu Fuß über die Wiese, immer nur einen Gegenstand.
  Bauen geht vor Lager. Wo oft gegangen wird, entsteht ein Trampelpfad. Er macht schneller und wächst wieder zu.
- Ist ein neues Feuer fertig, wächst dein Gebiet. Neue Zwerge kommen an jedes Feuer mit freiem Platz (Herzfeuer 8, kleines Feuer 6),
  einer pro Minute.
- „Pfad zur Straße ausbauen“: Anfang und Ziel anklicken. Das geht, wenn mindestens 70 % des Weges schon ein sichtbarer Pfad sind. Kostenlos.

Alle Regeln laufen jetzt im echten Spielkern: genau wiederholbar und speicherbar. Zwei Läufe mit gleichen Eingaben sind Bit für Bit gleich,
auch zwischen dem Spiel und den Prüfläufen auf dem Rechner.

## Der Vergleich mit dem Wegetest (am Tag)

Gleiche Kamera wie im Film „Pfade entstehen“ aus Runde 12/13. Film `clips/W1_pfade_entstehen_tag_wegetest_gegen_wegesystem.mp4`
(oben der Wegetest, unten das Wegesystem), Bilder in `vergleich/`.

| Nach etwa 30 Minuten bei 1x, am Tag, 6 Zwerge je kleinem Feuer | Wegetest (Runde 13, heute nachgemessen, 30,0 min) | Wegesystem im Spielkern (29,1 min) |
|---|---|---|
| Stämme / Steine / Wild getragen | 131 / 99 / 22 | 147 / 80 / 22 |
| Baustellen fertig (von 8) | 8 | 8 |

| Baustelle fertig nach (Sekunden bei 1x) | Wegetest Runde 12, 6 Zwerge (mit Nacht ab etwa 6,5 min) | Wegesystem, 6 Zwerge | Wegetest Runde 12, 4 Zwerge | Wegesystem, 4 Zwerge |
|---|---|---|---|---|
| Neues Feuer an der Furt | 139 | 230 | 150 | 237 |
| Sägewerk | 250 | 319 | 325 | 345 |
| Lager am Holzfeuer | 344 | 452 | 423 | 547 |
| Brunnen | 476 | 579 | 729 | 614 |
| Wachhaus | 647 | 739 | 921 | 876 |
| Mühle | 903 | 852 | 1100 | 939 |
| Räucherhaus | 1015 | 951 | 1222 | 1093 |
| Brauerei | 1173 | 1100 | 1417 | 1202 |
| Stämme / Steine / Wild nach 32 min | 86 / 105 / 13 (mit Nacht) | 162 / 85 / 22 | 77 / 94 / 0 (mit Nacht) | 146 / 82 / 22 |
| bis 6,5 min (dort begann im Wegetest die Nacht) | 29 / 18 / 2, 3 Baustellen | 33 / 10 / 6, 2 Baustellen | 28 / 12 / 0, 2 Baustellen | 25 / 7 / 2, 2 Baustellen |
| Umweg der Träger (Weglänge zur Luftlinie) | 8 % | 44 % | 9 % | 37 % |

| Trampelpfad bei 1x (sichtbar / ausgetreten auf dem ganzen Weg) | Wegetest Runde 12 (5 / 15 Gänge) | Wegesystem, 6 Zwerge | Wegesystem, 4 Zwerge |
|---|---|---|---|
| Steinfeuer zum Steinbruch | 4 min / 18 bis 19 min | 8 min / 15,5 min | 17 min / 25,5 min |
| Holzfeuer zum Holzfäller Nord | 3 min / 38 bis 46 min | 3,5 min / 12,5 min | 5 min / 20 min |
| Holzfeuer zum Holzfäller Süd | 4 bis 4,5 min / 12 bis 13 min | 3,5 min / 4 min | 5 min / 15,5 min |
| Holzfeuer zum Förster | 12 bis 13 min / 14 bis 15 min | 11 min / 11,5 min | 11,5 min / nie |
| Herzfeuer zum Jäger | 5 min / nie | 3 min / 9,5 min | 2 min / 11 min |
| Herzfeuer zum Holzfeuer | nie / nie | 4,5 min / 9,5 min | 5 min / 8,5 min |

Die zweite und dritte Tabelle kommen aus den Prüfläufen auf dem Rechner (gleiche Regeln, anderer Startwert für den Förster als im Spiel).

Was die Unterschiede erklärt (nicht weggestellt):
- Das Wegesystem läuft hier ohne Nacht. Der Wegetest hatte ab etwa 6,5 Minuten Nacht mit Begleitern. Darum ist der Vergleich nur bis
  6,5 Minuten und im Tageslauf (Tabelle 1) wirklich gleich gestellt.
- Den Steinbruch des Wegetests gibt es so nicht: Der Wegetest hatte am Wasserfall eigene Felsen hingestellt, die die Karte nicht hat.
  Im Spielkern muss ein Steinbruch neben dem echten Fels stehen. Der nächste erlaubte Platz liegt auf der Hochfläche (36,15),
  weit vom Steinfeuer. Darum gibt es weniger Steine, längere Steinwege und mehr Umweg.
- Der Holzfäller Nord steht 2 Felder versetzt (51,34): An der Stelle des Tests kommen die Zwerge im dichten Wald nicht zur Tür.
- Der Jäger sucht sich seinen Jagdgrund selbst am Waldrand; im Test war er von Hand gesetzt.
- Das neue Feuer an der Furt braucht länger, weil die Wege um Becken und Ufer jetzt gesperrt sind (Stufe-L-3-Entscheidung).
- Der Umweg wird anders gemessen als im Test: Im Test wurden die Wege zusätzlich zweimal geglättet. Hier ist er die gerade gezogene Kachelroute.

## Rechenzeit

| Zwerge | ganzer Takt (mit Prüfsumme) | Wegesystem allein | Wegsuchen je Takt | Felder je Suche |
|---|---|---|---|---|
| 32 | 0,08 ms | 0,01 ms | 0,08 | 143 |
| 206 | 0,17 ms | 0,11 ms | 0,62 | 1034 |

10 Takte je Sekunde: bei 200 Zwergen also unter 2 ms Rechenzeit je Spielsekunde. Das Tagesbudget von 4.000 Feldern je Takt wurde nie erreicht.
Ein Spielstand ist etwa 270 KB groß.

## Was noch fehlt

- Die Nacht (Stufe 2): Licht, Begleiter, Nachtwege. Die Türfackeln haben schon ihr eigenes Licht, es leuchtet aber erst nachts.
- Speichern und Laden im Menü (Stufe 3). Im Spielkern geht es schon (geprüft: speichern, laden, weiterspielen gibt genau dasselbe).
- Bretter, Fisch und das Sägewerk als Werkstatt (es steht, arbeitet aber noch nicht). Ziele, Szenario, Testfeld.
- Das Bild läuft noch über das alte Spiel als „Bühne“: Testtal, Gebäudemodelle und Grenze kommen aus der alten Spielrunde, die angehalten ist.
  Die Regeln kommen nur aus dem neuen Spielkern. Das wird in einer späteren Stufe direkt verbunden.

## Fragen an dich

1. Die Trampelpfade sehen etwas blasser und verstreuter aus als im Wegetest (Bild `vergleich/pfade_nach_30_minuten_wegetest_gegen_wegesystem.jpg`).
   Sollen sie so bleiben, oder sollen sie wie im Wegetest kräftiger werden?
2. Ufer gesperrt (L-3): Ich habe alle Felder direkt neben dem Fluss für Laufen und Bauen gesperrt, außer an der Furt. Ist das so gemeint,
   oder nur die Ufer mit Steinen und Stämmen?
3. Der Steinbruch steht im Spielkern neben dem echten Fels der Karte (Hochfläche im Westen). Soll die Karte am Wasserfall einen echten Fels
   bekommen, wie ihn der Wegetest hatte?
4. Gebäude ohne Baustellenmodell: Wachhaus, Mühle, Räucherhaus und Brauerei zeigen während des Baus nur ihren Umriss am Boden,
   fertig stehen sie dann da. Reicht das bis zur Szenario-Stufe?
5. Die Holzfäller fällen den ganzen Wald östlich vom Holzfeuer; der Förster pflanzt höchstens 16 Bäume nach. Passt das?
