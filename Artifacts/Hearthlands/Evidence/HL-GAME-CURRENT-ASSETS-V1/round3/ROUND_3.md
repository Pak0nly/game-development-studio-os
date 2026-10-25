# Runde 3: das Hallen-Probestück im Spiel, Zwerge wieder in voller Größe

Stand: 25.10.2026. Alles aus dem Auftrag ist eingebaut, getestet und angesehen. Spielprogramm: `C:\GameDev\Hearthlands\Unity\Builds\HL-Player-assets-r3\Hearthlands.exe`.

**Neu zum Selbst-Ansehen:** Mit **F7** wechselst du im Spiel zwischen Tag, Abend und Nacht. Das ist nur eine Ansicht zum Beurteilen der Glut und der Lichter; das Spiel selbst hat noch keinen Tageslauf.

## 1. Zwerge wieder in voller Größe

- Die Zwerge sind wieder **100 %** groß (in Runde 2 waren es 78 %). Sie sind jetzt deutlich größer als die Hüttentüren, wie gewünscht.
- Die Füße stehen weiter fest: Der Schritt folgt der gelaufenen Strecke in der vollen Größe. Der Gang wird jetzt etwa **3,0-mal** (schwerer Zwerg) und **2,1-mal** (Zwergin) so schnell abgespielt wie gebaut.
- Die Werkzeuge stecken auch bei voller Größe nirgends im Körper oder im Boden (die Prüfung rechnet in der Größe der Figur, sie gilt also für jede Größe).
- Bogen `sheets/sheet7_zwerge_100.jpg`: an jeder Hütte ein Zwerg und eine Zwergin auf der Türschwelle, einer daneben, und an der Halle.

## 2. Die Große Halle

- Die alte Halle ist ersetzt durch die Halle aus dem Probestück: **L-Form** mit dem Säulengang links, **drei Giebel** hinten, alle Dächer fallen vom Hof weg, rechts der vorbereitete Anschluss für den Anbau, **eine Tür links der Tafel** (so gelassen, wie du gesagt hast).
- Sie steht genau auf dem 3x3-Platz der Halle. Der Hof öffnet sich nach Süden, der Glutpfahl der Halle steht vor dem Tor. Keine Spielregel musste sich ändern.
- Die Halle gilt für alle Ausbaustufen (Holz, Stein, Eisen, Rune). Eigene Stufen-Bilder gibt es noch nicht (Vorschlag).
- Im Hof wächst kein Gras mehr durch die Steinplatten (der Boden unter der Halle bleibt frei von Grasbüscheln).
- Die alte Halle kommt mit dem bisherigen Schalter für die alten Gebäude zurück.
- Der U-Anbau bleibt nur im Probestück.
- Bogen `sheet1_halle_tag_abend_nacht.jpg` (alte Halle aus Runde 2 und die neue bei Tag, Abend, Nacht) und `sheet2_halle_nah.jpg`.

## 3. Das Herzfeuer: die Ahnentafel mit Glutsteinen

- Die Tafel steht in der Mitte der Hofwand, mit Feuernische, Feuergrube, den zwölf Fassungen in Rautenform und den Ahnenköpfen.
- **Die Glutsteine folgen der Herzglut:** Je voller das Herzglut-Lager, desto mehr Steine sind gesetzt (ein Stein je Zwölftel; sobald überhaupt Glut da ist, leuchtet der erste). Das ist nur Anzeige, an den Regeln ändert sich nichts.
- Im Testtal fasst das Lager nur 3 Herzglut. Darum springt die Tafel dort in Schritten von 4 Steinen: 1 Glut = 4 Steine, 2 = 8, 3 = alle 12. In den GIFs siehst du deshalb am Tag 8 und in der Nacht 12 Steine; die Herzglut ist inzwischen gestiegen.
- Das Feuerlicht des Spiels sitzt jetzt an der Feuergrube der Tafel. Nachts brennt es mit einem Drittel der Tageshelligkeit (wie im Probestück). Die Fackeln und Fenster brennen am Abend halb und nachts ganz. Vor jedem gesetzten Stein glimmt nachts ein ganz kleines Licht, wie im Probestück.
- **Die Herzfeuer-Markierung der Tester-Oberfläche** (die Flamme mit „HERZFEUER“ über der Halle) **bleibt** und funktioniert. Die Tafel liest sich bei Tag gut, aber aus der normalen Spielkamera ist sie klein; deshalb habe ich die Markierung nicht ersetzt. Ihr Lichtschein über der Halle wird nachts fast ganz abgeschaltet, sonst würde er den Hof überstrahlen.

### Das Blenden der Glutsteine in Bewegung (deine Hauptfrage)

- GIFs: `after/05_hall_tablet_day.gif` und `05_hall_tablet_night.gif` (Halle und Tafel, die Kamera schwenkt langsam um den Hof; 8,1 und 8,5 MB), `after/06_tablet_day.gif` und `06_tablet_night.gif` (Tafel nah, ebenfalls mit Schwenk; je 4,9 MB). Die Fackeln flackern, die Zwerge laufen.
- **Mein Eindruck:**
  - **Bei Tag** lesen sich die Steine klar: orange Glut in dunklen Fassungen.
  - **Bei Nacht** blendet es wirklich. Das Feuer in der Grube beleuchtet die helle Steintafel so stark, dass die ganze Tafel hellrosa wird. Die Steine sind noch zu erkennen, aber nur als etwas hellere Punkte auf hellem Grund, nicht mehr als glühende Steine.
  - Das Beispielbild hat es also nicht übertrieben.
- Vergleich mit 2, 6 und 12 Steinen bei Tag und Nacht: `sheet3_tafel_glutsteine.jpg` (nur für die Aufnahme fest eingestellt).
- **Was ich als Nächstes vorschlagen würde:** Das Feuerlicht tiefer und vor die Grube setzen, sodass es mehr den Hof als die Tafel trifft, oder die Steine nachts in einem tieferen Rot glühen lassen. Das ist nicht eingebaut; du entscheidest.

## 4. Baustellen in Holz und Stein

- Baustellen sehen jetzt aus wie im Probestück: **Holz** für Gebäude ohne Stein in den Baukosten, **Stein** für Gebäude mit Stein in den Baukosten (Vorschlag; das trifft auf die meisten Gebäude des Spiels zu, darunter das Lager, nicht aber Holzfäller, Förster und andere Holzhütten).
- Stufe 1 in der ersten Hälfte der Bauarbeit (abgesteckt, Material da, der hohe Baustellenpfahl mit Tuch in der Spielerfarbe), Stufe 2 in der zweiten Hälfte (Wände wachsen, Gerüst).
- Es gibt sie für Gebäude mit 1, 2 und 3 Feldern. Der Fortschrittsbalken bleibt.
- Bogen `sheet5_baustellen.jpg`: zwei echte Baustellen im Spiel (Holzfäller in Holz, Lager in Stein) und eine Tafel mit allen Arten.

## 5. Wegknoten: Glutkorb auf dem Pfahl statt Fahne

- An jedem Wegknoten (auch vor jeder Tür) steht jetzt der **Glutkorb auf dem Pfahl** auf einer kleinen Steinplatte mit Ecken in der Spielerfarbe. Er leuchtet bei Tag schwach und nachts als warmer Punkt.
- Anklicken, Auswählen, die Tutorial-Zeiger, die Statusschilder und der Knopf „Verbinden“ funktionieren wie vorher. Das Tutorial läuft auf Deutsch und Englisch durch alle 6 Schritte.
- Wenn an einem Knoten zu viele Waren liegen, erscheint wie bisher ein rotes Leuchten (jetzt als Band unter dem Korb).
- **Wortvorschlag für „Fahne“: „Glutpfahl“ (englisch „ember post“).** Alle Texte der Oberfläche sind umgestellt, zum Beispiel „Glutpfahl der Hütte“, „Glutpfahl der Halle“, „Klicke auf einen Glutpfahl als Start“, „Gebäude, Glutpfahl, Weg, Träger“. Das ist ein Vorschlag; das Wort lässt sich leicht wieder ändern.
- Bogen `sheet4_wegknoten.jpg`; die erste Sitzung mit Oberfläche in `session/` (zum Beispiel `de_04_step4_road.jpg`).

## 6. Grenzlaternen

- An jeder Kante der Grenze steht jetzt die **niedrige Grenzlaterne** auf Grenzsteinhöhe. Grenzsteine und die dünne Grenzlinie sind weg.
- Wo die Grenze durchs Wasser läuft (im Testtal am Teich im Nordwesten), **schwimmen** die Laternen und wiegen sich leicht.
- **Helligkeit nach Herzglut in 3 Stufen:** weniger als ein Drittel voll = schwach, bis zwei Drittel = mittel, darüber = stark. Nur Anzeige.
- Der Kreis um das Herzfeuer wird nicht mehr dauernd gezeigt; die Laternen zeigen die Grenze.
- Nachts brennen die nächsten 32 Lichter von Tafelsteinen, Wegknoten und Laternen als echte Lichter, alle anderen glühen nur.
- Bogen `sheet6_grenze.jpg`.

## 7. Leistung

Spielprogramm, 1920x1080, ohne Bildsynchronisation, Testtal nach einer Spielminute, Kamera 20 Felder (wie in Runde 2):

| Zwerge | Runde 2 (78 %) | Runde 3 (100 %) |
|---|---|---|
| Testtal allein (9) | 5,6 ms | 5,5 ms |
| + 150 | 8,9 ms | 9,1 ms |
| + 300 | 12,4 ms | 12,7 ms |
| + 300 in der Nacht | – | 12,8 ms |
| + 300 mit den alten Gebäuden | – | 12,7 ms |

Alles bleibt deutlich unter 16,7 ms (60 Bilder pro Sekunde). Beim Start braucht das Bauen von Halle, Tafeln, Knoten und Laternen etwa 4 Sekunden. Einzelheiten: `perf/perf.md`.

## 8. Tests

- Unity EditMode: **2024 Tests, 2001 bestanden, 23 übersprungen, 0 fehlgeschlagen** (Runde 2: 2012; dazu 6 Tests des Hallen-Probestücks und 6 neue dieser Runde). Der Größentest an den Türen prüft jetzt 100 %.
- Spielkern ohne Unity: **1918 von 1918 bestanden**; AssetGen: **277 von 277 bestanden**.

## 9. Spielprogramm und Aufräumen

- Neu: `HL-Player-assets-r3`. Gelöscht: `HL-Player-assets-r1`. Es bleiben r2 und r3.

## 10. Was mir aufgefallen ist und was offen bleibt

- Nachts blenden die Glutsteine (siehe oben); Vorschlag dort.
- Die Steinzahl springt im Testtal in 4er-Schritten, weil das Herzglut-Lager nur 3 fasst.
- Holz oder Stein für die Baustelle richtet sich nach den Baukosten; dadurch sind die meisten Baustellen aus Stein. Ob das so passt, entscheidest du.
- Die Halle sieht in allen Ausbaustufen gleich aus.
- Wegknoten an Türen und freie Wegknoten sehen gleich aus (wie im Probestück).
- Abgetrennte Teile des Gebiets hatten bisher türkise Grenzsteinkappen; die Laternen unterscheiden das nicht.
- Fragen an dich: Passt „Glutpfahl“? Soll ich das Blenden der Tafel nachts verringern (Licht tiefer, Steine dunkler rot)? Passt die Regel Holz oder Stein für die Baustellen?

## Belege

- `after/`: alle Bilder und die vier GIFs dieser Runde, `capture_log.txt`.
- `sheets/`: sieben Bögen. `crops/`: Bildstreifen aus den GIFs.
- `session/`: erste Sitzung mit Oberfläche auf Deutsch und Englisch, mit `first_session_de.gif` und `first_session_en.gif`.
- `iter1/` bis `iter3/`: Zwischenstände (ohne GIFs).
- `perf/` und `logs/`.
