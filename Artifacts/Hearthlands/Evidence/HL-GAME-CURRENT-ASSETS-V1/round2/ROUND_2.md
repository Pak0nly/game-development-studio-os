# Runde 2: langsamere Zwerge, keine Schlieren, Spielerfarbe, Werkzeug, richtige Größe

Stand: 24.10.2026, abends (vor dem Abschalten des Rechners). Alle Punkte der Runde sind gebaut, getestet und angesehen. Offen ist nur die ausführliche Belegliste (siehe „Wo es weitergeht“).

## 1. Gehtempo (Spielregel, von dir freigegeben)

- **Was sich geändert hat:** In den Spieldaten (den Daten, mit denen das Testtal und alle Partien im Spiel laufen) gehen die Zwerge jetzt **0,82 Felder pro Sekunde** statt 2,5. Das ist ein Drittel (genau 21/256 Feld je Spieltakt statt 64/256). Auf ausgetretenem Weg und Pflaster bleiben die Aufschläge wie bisher (×1,2 und ×1,4).
- **Kleinste Änderung:** Geändert ist nur dieser eine Wert, und nur in den Spieldaten. Die älteren Datensätze, die nur in Tests vorkommen, gehen weiter mit 2,5; deshalb bleiben deren viele festgeschriebene Prüfsummen unverändert. (Ein erster Versuch, den Wert im Grunddatensatz zu ändern, hätte 82 Tests verschoben; das habe ich zurückgenommen.)
- **Geänderte Testerwartungen (alle wegen des langsameren Gehens):** sechs festgeschriebene Prüfsummen von Partien in den Spieldaten (Spieltest-Start, Zuschauer-Partie, Datensatz-Prüfsumme, zwei große Lasttests, KI-Vergleich mit Befehlszahlen 56/46 statt 53/50) und drei Zeitgrenzen, in denen etwas fertig sein muss: Kampagne 2 Brot 4000 → 8000 Takte, Kampagne 4 Lampen 3000 → 20000 und Barren 20000 → 45000, Jäger-Test 4000 → 8000 Takte.
- **Tutorial im Testtal** (Spielzeit ab dem Setzen der Holzfällerhütte, Spieleraktionen sofort): erstes Holz **46 s → 56 s**, erstes Brett **124 s → 198 s** (bei 4-fach ein Viertel davon, also etwa 50 s). Das Tutorial läuft in allen 6 Schritten durch, auch mit der Tester-Oberfläche im Spielprogramm.
- **Abspieltempo des Gangs:** Der Schritt folgt weiter der wirklich gelaufenen Strecke, die Füße stehen also fest. Der Gang wird jetzt etwa **3,9-mal** (schwerer Zwerg) und **2,7-mal** (Zwergin) so schnell abgespielt wie gebaut (Runde 1: 9- und 6½-mal). Dass es nicht 3-mal ist, liegt an der kleineren Größe (Punkt 5): kleinere Zwerge machen kleinere Schritte.

## 2. Schlieren beim Gehen

- **Ursache:** Die Kantenglättung des Spiels setzt jedes Bild aus mehreren Bildern hintereinander zusammen. Dafür muss sie wissen, wohin sich jeder Bildpunkt bewegt hat. Die neuen Zwerge (ihre einzelnen Körperteile) meldeten aber nur die Bewegung der Kamera, nicht ihre eigene. So wurde jedes bewegte Teil mit dem Bild vermischt, wo es eben noch war: Schlieren, Sprenkel, rote Säume.
- **Lösung:** Jedes Körperteil, jedes Werkzeug und jede getragene Ware meldet jetzt seine eigene Bewegung (seine Lage im Bild davor). Die Kantenglättung bleibt an, nichts an den Projekteinstellungen oder den globalen Grafik-Einstellungen wurde geändert.
- **Ergebnis:** Bogen `sheets/sheet2_schlieren.jpg` (oben Runde 1, Mitte Runde 2 ohne, unten mit) und `sheet3_schlieren_nah.jpg` (vergrößert). Mit der Lösung sind die Zwerge beim Gehen scharf, Werkzeuge erkennbar. Zum Vergleich startet das Spiel mit `-hlNoDwarfMotionVectors` ohne die Lösung.

## 3. Spielerfarbe

Umhang und Schal (das Teil „Umhang oder Schal“ der sauberen Körper) tragen die Farbe des Besitzers; Falten und Kanten bleiben, der Rest der Farben ist unverändert. Bogen `sheet4_spielerfarben.jpg`: Spieler 1 orange, Spieler 2 blau (die Farben, die das Spiel den Spielern gibt), stehend und gehend.

## 4. Werkzeug in der Hand

Je Beruf ein festes Werkzeug in der rechten Hand, beim Gehen und Stehen (noch keine Arbeitsbewegung). Bogen `sheet5_werkzeuge.jpg` (von vorn, von der Seite, von hinten):
- Holzfäller: die angenommene Axt aus dem Meshy-Probestück (als Daten kopiert, ein Test prüft sie Würfel für Würfel), auf der Schulter;
- Steinbrecher, Steinmetz, Bergmann: Spitzhacke auf der Schulter;
- Förster, Bauer: Spaten auf der Schulter;
- Bauarbeiter, Säger, Schnitzer, Schmiede: Hammer seitlich, Kopf nach vorn oben;
- Jäger: Speer aufrecht an der Seite; Fischer: Kescher aufrecht;
- Träger: nichts, die Ware bleibt auf dem Rücken.

Haltung: fest eingestellter, geprüfter Griff (der rechte Arm hält, der Rest des Körpers geht und steht wie angenommen). Ein Test prüft für beide Körper, nah und fern, in jedem Bild von Gehen und Stehen: **kein Werkzeugwürfel im Körper, keiner im Boden**. Die Zuordnung Beruf → Werkzeug und die Griffe sind Vorschläge.
Auffällig: Die Axt ist bei der Spielkamera klein und schwer zu sehen; der Spaten ragt auf der Schulter hoch über den Kopf.

## 5. Größe gegen die Türen

- Gemessen: Die angenommenen Körper sind 0,44 (Zwerg) und 0,43 Felder (Zwergin) groß. Die Türen der Stufe-1-Hütten sind von der Schwelle bis zur Oberkante des Rahmens 0,31 bis 0,33 Felder hoch. Die Zwerge waren also etwa 1,4-mal so groß wie eine Tür.
- Jetzt werden nur die Zwerge kleiner gezeichnet: **78 %** (die Gebäude bleiben). Auf der Schwelle stehend reicht der Kopf 0,01 bis 0,03 Felder (Zwerg) und 0,00 bis 0,02 Felder (Zwergin) über den Türrahmen, bei allen fünf Hütten mit Tür.
- Bogen `sheet6_tueren.jpg`: an jeder Hütte links ein Zwerg, rechts eine Zwergin auf der Schwelle neben der Tür, daneben einer auf dem Boden. Spielkamera mit der flachsten Neigung, die du einstellen kannst (35 Grad). Beim Förster verdeckt das Bäumchen die beiden etwas.

## 6. Leistung

Spielprogramm, 1920x1080, ohne Bildsynchronisation, Testtal nach einer Spielminute, Kamera 20 Felder (wie Runde 1). Rohdaten `perf/`.

| Zwerge | Runde 1 | Runde 2 | Runde 2 ohne Schlieren-Lösung |
|---|---|---|---|
| Testtal allein (9) | 6,1 ms | 5,6 ms | – |
| + 150 | 8,3 ms | 8,9 ms | – |
| + 300 | 11,1 ms | 12,4 ms | 10,7 ms |

Die eigenen Bewegungsdaten kosten bei 300 Zwergen etwa 1,7 ms; alles bleibt deutlich unter 16,7 ms (60 Bilder pro Sekunde). Die Körper werden beim Start in 2,2 s gebaut (Runde 1: 1,4 s).

## 7. Tests

- Unity EditMode: **2012 Tests, 1989 bestanden, 23 übersprungen, 0 fehlgeschlagen** (Runde 1: 2003; neu: 9 Tests dieser Runde).
- Spielkern ohne Unity (dotnet): **1918 von 1918 bestanden** (`logs/coretests-dotnet-final.log`); AssetGen: **277 von 277 bestanden** (`logs/assetgen-tests.log`).

## 8. Spielprogramm und Aufräumen

- `C:\GameDev\Hearthlands\Unity\Builds\HL-Player-assets-r2\Hearthlands.exe`.
- Alte Spielprogramme der Reihe gelöscht; es bleiben `HL-Player-assets-r1` und `HL-Player-assets-r2`.

## 9. Belege

- `after/`: alle Bilder und GIFs dieser Runde (Gehen 1-fach `12_walk_1x.gif`, 4-fach `12_walk_4x.gif`, Werkzeuge gehend `14e_tools_walking.gif`); `before_mv/`: dasselbe ohne Schlieren-Lösung; Runde 1 als „vorher“ in `../round1/`.
- `sheets/`: sechs Bögen; `crops/`: Vergrößerungen und Bildstreifen aus den GIFs.
- `session/`: Tester-Oberfläche, erste Sitzung auf Deutsch und Englisch, mit dem fertigen Spielprogramm.
- `perf/`, `logs/`.

## 10. Wo es weitergeht

- `WORKER_RESULT.md` mit Prüfsummen aller Dateien ist noch nicht für Runde 2 ergänzt.
- Das GIF der gehenden Werkzeugträger ist aus der Spielkamera schwer zu lesen (die Zwerge gehen hintereinander); die Standbilder zeigen die Werkzeuge besser.
- Fragen an dich: Reicht die Größe (78 %)? Sind Axt und Spaten so in Ordnung? Soll das Gehtempo bleiben, wenn der Gang noch etwa 3- bis 4-mal schneller abgespielt wird als gebaut?
