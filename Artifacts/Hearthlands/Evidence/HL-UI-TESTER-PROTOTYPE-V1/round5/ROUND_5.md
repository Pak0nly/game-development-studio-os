# Runde 5: Fluss-Kiesel, Laternen in Spielerfarbe, Glutsteine, die Flecken

Stand: 25.10.2026. Spielprogramm: `C:\GameDev\Hearthlands\Unity\Builds\HL-Player-ui-r5\Hearthlands.exe`. Vorschläge, wo nicht anders gesagt.

## Kurz

- **Fluss:** Vom angenommenen Fluss-Probestück sind jetzt die **Kiesel und Ufersteine** in Testtal:
  - Kiesel aus Würfeln in drei Größen, unter Wasser in nassen Tönen;
  - ein fleckiges Kiesband an der Wasserkante;
  - einige Ufersteine.

  **Nicht übernommen** sind die Felsleisten-Ufer, die neue Wasserfall-Form, die Klippen und das Wasser selbst. Warum, steht unten.
- **Grenzlaternen** tragen eine Kappe und einen kleinen Wimpel in der Spielerfarbe. Bei Tag lesen sie sich so als Grenzzeichen und nicht als Stumpf oder Stein. Auf einem abgetrennten Gebietsteil sind Kappe und Wimpel türkis; das ist jetzt im Bild bewiesen.
- **Glutsteine:**
  - Jeder gesetzte Stein hat eine eigene tiefrote Glutfläche, nachts stark, bei Tag sichtbar.
  - Das Feuer brennt nachts orange statt weiß.
  - Alle Lichter bleiben an.
- **Hellbraune Flecken in der Wiese:** Es waren die alten, flachen Schmetterlinge. Ich habe die Gruppen der Szene nacheinander abgeschaltet und dabei die Ursache gefunden. Mit den aktuellen Grafiken sind sie jetzt weg; einen neuen Schmetterling gibt es noch nicht.
- **Stümpfe:** Im Spiel sind es schon die Voxel-Stümpfe aus dem Baum-Katalog, samt gefälltem Stamm (`sheet5`). Die weichen alten Stümpfe werden nur ohne Voxel-Katalog gezeichnet.
- **Tutorial:**
  - Der Rahmen in Schritt 6 ist nicht mehr zu groß.
  - Das Schild des Sägewerks liegt nicht mehr quer über dem Rahmen.
  - Die Kartenschrift ist größer: Text 20 statt 18, Titel 27 statt 25.

## Fluss und Klippe: was übernommen ist und was nicht

- **Was angenommen ist:** Das Probestück (Runde 6) hast du „vorerst“ angenommen. Feinschliff sollte später kommen.
- **Was jetzt im Spiel ist:**
  - die Kiesel (der Kies-Erzeuger des Probestücks, unverändert kopiert);
  - die Ufersteine (das Stein-Modell des Probestücks);
  - beides an Testtals eigenem Fluss: im Flussbett, an der Wasserkante und vereinzelt im Gras;
  - 11 756 Kiesel und 16 Ufersteine, gebaut in 1,7 Sekunden beim Start (`sheet2_fluss.jpg`).
- **Was nicht im Spiel ist:**
  - die Felsleisten-Ufer mit Grasnarbe und Saum;
  - der gebogene Wasserfall-Vorhang mit nasser Rückwand;
  - die Leistenklippe;
  - die glatten Wasserränder;
  - die lange flache Furt.

  Diese Teile baut das Probestück aus einem fest eingebauten Flusslauf mit eigener Form, nicht aus einer Karte. Für Testtal müssten sie neu an den Lauf der Karte (Felder, Höhen, Wasserkörper, Furt, Wasserfall) angepasst werden. Das ist eine eigene, größere Arbeit; in dieser Runde war sie nicht zu schaffen. Den Karteneditor habe ich nicht angefasst.
- **Tutorial:** Das Tutorial läuft wie vorher: Wäldchen, Halle, Holzfäller-Plätze, Wege und Teich mit schwimmenden Laternen sind unverändert.

## Was ein Tester sieht

Die erste Sitzung auf Deutsch und Englisch ist in `session/` (`first_session_de.gif`, `first_session_en.gif`). Sie läuft wie in Runde 4, mit größerer Kartenschrift, Laternen mit Wimpel und Kieseln am Fluss.

## Zahlen

- **Tests:**
  - Unity EditMode 2043 gesamt, 2020 bestanden, 23 übersprungen, 0 fehlgeschlagen. Vorher waren es 2037; 4 Tests kamen mit der Regel-Änderung, 2 sind neu.
  - Spielkern 1922/1922 (vorher 1918, plus die 4 der Regel-Änderung); AssetGen 277/277.
- **Textprobe:** 18 Fälle, 0 Funde. Erst gab es einen Fund: Der englische Tipp wurde mit der größeren Schrift abgeschnitten; behoben.
  - Ruhende Oberfläche bei 1280x720: 20,6 %, knapp über der Grenze von 20 %, wegen der größeren Tutorial-Karte.
- **Leistung:** Nicht sauber messbar.
  - Während der Messung lief ein Programm des anderen Workers (Zwerge-Ordner, HL-AnimGallery) auf der Grafikkarte; das durfte ich nicht beenden.
  - Selbst die alte Runde 4 brauchte dabei 47 bis 52 ms statt der früher gemessenen 5,5 ms.
  - Gemessen: Runde 5 mit 0 Zwergen 43,7 ms, mit 300 Zwergen 87,5 ms; Runde 4 mit 0 Zwergen 52,0 ms, mit 300 Zwergen 47,1 ms.
  - Ob die Kiesel (400 000 Dreiecke) bei 300 Zwergen Zeit kosten, kann ich so nicht sagen. Die Messung sollte wiederholt werden, wenn der Rechner frei ist.

## Belege

- `sheets/`:
  - `sheet1_ueberblick` (vorher/nachher, Tag/Nacht);
  - `sheet2_fluss`;
  - `sheet3_grenze` (mit abgetrenntem Teil);
  - `sheet4_tafel`;
  - `sheet5_flecken_stuempfe`;
  - `sheet6_tutorial`.
- `session/`: alle Einzelbilder, Nahaufnahmen (`close_*`) und die Fehlersuche zu den Flecken (`diag_spots_*`).
- `fit/`, `perf/`, `logs/`.
- „Vorher bei Nacht“ fehlt; vorher gibt es nur das Tagbild aus Runde 4.
- Die Sitzungsbilder stammen aus dem Build vor der letzten kleinen Korrektur. Diese betraf nur die Breite des Tipps; die Textprobe lief danach mit dem neuen Build.

## Fragen an dich

1. Fluss: Soll der volle Fluss aus dem Probestück (Felsleisten, Wasserfall, Klippe, Furt) als eigener Auftrag an Testtals Lauf angepasst werden?
2. Gefallen dir Kappe und Wimpel an den Laternen? Ist Türkis für abgetrennte Teile gut?
3. Glutsteine: Ist die tiefrote Glut so richtig, nachts und bei Tag (`sheet4`)?
4. Schmetterlinge: Sollen neue im aktuellen Stil kommen, oder bleiben sie vorerst weg?
