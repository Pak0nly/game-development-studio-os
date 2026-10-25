# Runde 4: Kamera im Tutorial, Herzfeuer leuchtet wieder, Grenze ohne Linie

Stand: 25.10.2026. Alles Vorschlag, wo nicht anders gesagt. Spielprogramm: `C:\GameDev\Hearthlands\Unity\Builds\HL-Player-ui-r4\Hearthlands.exe`.

## Was ein Tester jetzt sieht

Bilder in `round4/session/` (DE `de_…`, EN `en_…`, dazu `first_session_de.gif` und `first_session_en.gif`), Bögen in `round4/sheets/`.

1. **Schritt 1:** Die Kamera ist frei, man schaut sich um.
2. **Ab Schritt 2 ist die Kamera fest.** Bei jedem neuen Schritt fährt sie in gut einer Sekunde zum passenden Ort:
   - Schritt 2: die Halle;
   - Schritt 3: Halle und Wäldchen;
   - Schritt 4: Hütte und Halle mit ihren Wegfeuern;
   - Schritt 5: die Baustelle;
   - Schritt 6: zuerst der Platz für das Sägewerk, nach dem Setzen das Sägewerk selbst.

   Mit der Taste W bewegt sich in Schritt 3 nichts; das ist im Protokoll gemessen (Bewegung 0,00).
3. **Alte Hinweise gehen zu**, sobald ein Schritt fertig ist: Baumenü, Werkzeug, Infofeld, Fehlmeldung. Das Infofeld der Halle aus Schritt 2 bleibt 4 Sekunden zum Lesen offen und schließt dann von selbst.
4. **Abdunkelung 60 %.** Ein Klick daneben zeigt jetzt „Erst dieser Schritt: …“ in Orange direkt auf der Tutorial-Karte, nicht mehr klein unten links.
5. **Schritt 4:** Der helle Rahmen schließt jetzt das Wegfeuer und seine Beschriftung mit ein. Die Beschriftungen liegen über der Abdunkelung und werden nicht mehr abgeschnitten.
6. **Hilfe** geht immer, auch im Tutorial. Sie öffnet sich oben, die Tutorial-Karte bleibt darunter sichtbar.
7. **Ende des Tutorials:**
   - Über dem Sägewerk steht „+1 Brett“.
   - Die Karte sagt zuerst „+1 Brett, es ist auf dem Weg ins Lager“. Sobald das Brett ankommt, steht dort „Bretter im Lager jetzt 11 (vorher 10) ✓“.
   - Das Tempo springt auf 1×.
   - Ein Tipp sagt, dass man Zwerge anklicken kann.
8. **Kein-Baum-Fall:** Der Bauplatz (Geist) ist jetzt im Bild, neben ihm die Warnung.
9. **Der Geist** ist kein flacher grüner Klotz mehr: eine flache Platte, vier Eckpfosten und ein Rand. Der Boden bleibt sichtbar.
10. **Platzvorschläge** halten zwei Felder Abstand zur Grenze. Sie liegen also nicht mehr auf den Laternen.
11. **Kein Haken-Kreis** mehr über arbeitenden Gebäuden. Dass ein Gebäude arbeitet, steht im Infofeld.
12. **Träger im Steckbrief:** „Arbeitsplatz: Weg zwischen Sägewerk und Große Halle“, nicht mehr „ein Weg zwischen zwei Wegfeuern“.

## Herzfeuer und Tafel (dein Punkt 4)

- Alle Abschaltungen aus Runde 3 sind zurückgenommen:
  - die kleinen Lampen vor den Steinen sind wieder an;
  - das Werkstattlicht in der Halle ist wieder an;
  - das Hallenfeuer brennt nachts wieder voll (wie die anderen Feuer);
  - das Glühen der Herzfeuer-Markierung ist wieder wie vor Runde 3.
- Die Glutsteine leuchten jetzt aus sich selbst:
  - nachts 4-mal so stark wie im Probestück, in tiefem Rot;
  - bei Tag 1,6-mal so stark;
  - ihre Oberfläche wird nachts dunkel, damit das Licht ringsum sie nicht weiß wäscht.
- Ergebnis (`sheet3_herzfeuer_tafel.jpg`): Bei 2, 6 und 12 Steinen liest man nachts rote Steine. Die Tafel selbst bleibt hell beleuchtet, weil alles leuchtet; sie wirkt rosa wie in Runde 3. Ganz leuchtend-glühend wie bei Tag sind die Steine nachts noch nicht. Wenn dir das nicht reicht, wäre der nächste Schritt eine kleine eigene Glutfläche hinter jedem Stein.

## Grenze (dein Punkt 5)

- Die Linie ist entfernt; nur die Laternen markieren die Grenze. Sie sind etwas größer (1,25 × 1,55).
- Laternen auf abgetrennten Gebietsteilen brennen türkis.
- **Nicht bewiesen:** Im Testtal ließ sich kein abgetrennter Teil erzeugen. Ich habe drei Holzfeuer in einer Kette gesetzt und die ersten beiden abgerissen; das Spiel meldete trotzdem 0 abgetrennte Felder. Das Bild `close_detached_*` fehlt deshalb. Dafür bräuchte es eine Karte oder einen Spielstand mit einem abgetrennten Teil.

## Boden und Sägewerk (Punkte 1 und 2)

- Mit den aktuellen Gebäuden gibt es keinen Steinsockel mit Treppe mehr. Jedes Gebäude steht auf einer ebenen, weich auslaufenden Fläche, also auch das Sägewerk. Das Protokoll zählt 0 Sockel.
- Fertige Gebäude stehen auf Wiesenfarbe statt Erde. Nur Baustellen zeigen noch Erde. Gras wächst trotzdem nicht durch Böden.
- Siehe `sheet5_boden_saegewerk.jpg`. Geprüft an Halle, Lager, Sägewerk, Holzfäller und Försterhütte.

## Level-Bestandsaufnahme (Punkt 3)

Gezählt im Spiel (Protokoll `session/capture_log.txt`, Überblick `close_overview_game_camera.jpg`):

| Teil | Stand | Ersatz |
|---|---|---|
| Bäume (20 frei gesetzte, alle Waldbäume) | Voxel-Katalog, aktuell | – |
| Felsen (17) | Voxel-Felsen, aktuell | – |
| Baumstümpfe | weicher Stumpf (P2) | gefällter Baum aus dem Voxel-Katalog vorhanden; nicht umgestellt |
| Heu, Karren, Zäune (Kartenbeiwerk) | ausgeblendet (`ShowDressing` aus) | keiner nötig |
| Büsche der Karte | ausgeblendet | – |
| Ersatzklötze für Gebäude | 0 | – |
| Hellbraune kleine Flecken in der Wiese | Quelle unklar | Frage an dich |
| Sockel mit Treppe | entfernt (siehe oben) | – |
| Wild- und Fischplätze | als Tiere dargestellt | – |

Mehr habe ich nicht ersetzt. Ich fand keine weiteren alten Teile, für die es einen freigegebenen Ersatz gibt.

## Zwergennamen (Vorschlag, bitte freigeben)

Nicht nordisch. Kurz, in Deutsch und Englisch leicht lesbar, mit harten, steinigen Lauten wie in den Lore-Namen (Hadda, Brosk, Grenna, Vessal, Harnek). Männer enden meist auf -ek, -ok, -an oder -o, Frauen auf -a, -in oder -et.

- **Männer (20):** Tarrek, Hammik, Korven, Drast, Belmek, Gorran, Tobbek, Marrok, Pelleck, Ossik, Bodrek, Feddo, Rakkan, Emmok, Durrik, Halbek, Teshek, Kolm, Varrek, Grubbo
- **Frauen (20):** Bessa, Mirra, Telka, Ondra, Karrin, Hettra, Brinna, Selka, Olda, Tamsa, Reska, Nella, Ferra, Ganna, Dessa, Kodda, Lirra, Marra, Embet, Sorrin

Sie stehen schon im Spiel; der Steckbrief zeigt zum Beispiel „Drast“. Ein Test prüft, dass keine nordischen Silben vorkommen.

## Zahlen

- **Tests:**
  - Unity EditMode 2037 gesamt, 2014 bestanden, 23 übersprungen, 0 fehlgeschlagen. Vorher waren es 2033; 4 Tests sind neu (Namen, Wegname, Vorschläge weg vom Rand, Leuchten an).
  - Spielkern 1918/1918; AssetGen 277/277.
- **Textprobe:** 18 Fälle, 0 Funde. Der vollste Bildschirm bei 1280x720 liegt jetzt bei 32 % (vorher 53 %), weil das Baumenü beim Schrittwechsel zugeht.

## Fragen an dich

1. Reicht die Lesbarkeit der Glutsteine nachts bei voller Beleuchtung (`sheet3`)?
2. Passen die 40 Namen? Welche sollen raus?
3. Woher kommen die hellbraunen Flecken in der Wiese? Weg damit?
4. Willst du für den Türkis-Beweis einen Spielstand mit abgetrenntem Gebiet, oder reicht der Test später auf einer anderen Karte?
5. Ist die Kamerafahrt (gut 1 Sekunde) angenehm, oder lieber schneller?
