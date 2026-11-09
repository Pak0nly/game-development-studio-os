# Wege-Test, Runde 13

Starten: `C:/GameDev/Hearthlands-Wege/Unity/Builds/HL-PathsTest-r13/Wege-Test Runde 13 spielen.cmd`.

Das ist Runde 12 mit genau einer Änderung: Das Feuerleuchten der bewegten Feuer (Herzfeuer und kleine Feuer) ist wieder
so wie in Runde 11. Du hattest das nicht verlangt, das war in Runde 12 von uns dazugekommen. Es ist jetzt zurückgenommen.

## Was zurückgenommen ist

- Die Flammen sind nachts wieder so hell wie in Runde 11 (sie wirken nachts wieder fast weiß, wie vorher).
- Die dunkle Grundfarbe der Flammen bei Nacht ist weg, der Glühwert (0,28 und vorher 0,15 bis 0,6) und der orange Nachtton
  sind weg, die Flammenfarben des Bausatzes sind wieder da.
- Tagsüber sah das Feuer schon in Runde 12 so aus wie in Runde 11, und tut es weiter.

Alles andere aus Runde 12 bleibt: die kleineren Wegfeuer in Fackelfarbe, das Türlicht, die Option „bewegtes Feuer“, die Pfade,
das Wachsen des Gebiets und die Glühwürmchen.

## Beweis

Filme in `clips/` (oben Runde 11, unten Runde 13, gleiche Kamera): Herzfeuer nah Nacht (F1), Herzfeuer Spielkamera Nacht (F2),
Holzfeuer nah Nacht (F3), Holzfeuer Spielkamera Nacht (F4), Herzfeuer nah Tag (F5), Holzfeuer nah Tag (F6).
Standbilder in `vergleich_bilder/`: `r11_gegen_r13_*` (Runde 11 gegen Runde 13, die Flammen sehen gleich aus) und
`r13_gegen_r12_*` (zum Vergleich mit der alten Runde 12, die Flammen dort rot).
Die Flammen bewegen sich, deshalb ist der Augenblick nicht in jedem Bild gleich, Farbe und Helligkeit sind gleich.
Um die Flammen herum unterscheiden sich die Bilder leicht, weil Runde 13 sonst Runde 12 ist (zum Beispiel Pfade im Gras).

## Mir aufgefallen, nicht geändert

- Das Weiß der Flammen in der Nacht ist genau der Fehler, den Runde 12 beheben wollte. Du hast entschieden, es zurückzusetzen.
  Wenn du es später doch anders willst, sag es.
