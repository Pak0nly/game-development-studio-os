# Wegesystem, Stufe 1, Runde 2: der Tag ohne Straßen

## Starten

- Spielen: `C:/GameDev/Hearthlands/Unity/Builds/HL-Game-ways-r2/Wegesystem Tag ohne Strassen spielen.cmd`
- Vergleichslauf mit den Feuern, Hütten und Baustellen des Wegetests: `Wegesystem Vergleichslauf (Wegetest-Baustellen).cmd` (gleicher Ordner)

Testtal, immer Tag. Rechts das Feld: Tempo (Leertaste, 1 bis 4), Bauen, Pfad zur Straße, Bericht, neu der Knopf
„Muster: Kiesel auf ausgetretenen Pfaden (G)“.

## Was sich in Runde 2 geändert hat

### Ufer (deine Antwort „a“)

Gesperrt sind nur noch das Becken unter dem Wasserfall und die Ufer direkt darunter (bis zwei Reihen unter dem Becken).
Alle anderen Ufer sind wieder begehbar und bebaubar, wie früher. Bilder: `vergleich/ways_vorschau_brunnen_ufer_offen.jpg`
(Brunnen am Ufer erlaubt) und `vergleich/ways_vorschau_brunnen_ufer_unter_dem_fall.jpg` („Ufer und Becken sind gesperrt“).

### Steinbruch (deine Antwort „anders“)

Der Steinbruch steht, wo du ihn baust; die üblichen Bauregeln gelten weiter. Die Regel „neben dem Fels“ gibt es nicht mehr.
Sein Steinhauer geht zu Fuß zum nächsten Fels, **höchstens 28 Felder weit**.

Warum 28:
- 28 ist der Arbeitsradius des Jägers in den Spieldaten, des Arbeiters, der am weitesten geht. Holzfäller und Förster haben 8,
  der Steinbruch selbst hatte in den Daten 6.
- Gezählt wird der Fußweg, nicht die Luftlinie. Der einzige Fels im Testtal liegt jenseits des Bachs. Vom Startgebiet aus ist
  der kürzeste Fußweg von einem erlaubten Steinbruch zum Fels 24,4 Felder (über die Furt). Mit 12 oder 20 hättest du am Anfang
  nirgends einen Steinbruch setzen können, genau wie in deinem Test („nur rot“). Mit 28 gibt es vom Start aus 14 Plätze.
- Bei 1x dauert ein Gang hin und zurück höchstens etwa 85 Sekunden über Wiese, auf einem ausgetretenen Pfad etwa 68.
  Ein weiter Steinbruch bringt also deutlich weniger Steine als einer am Fels. Das ist der Preis der Wahl.

Die Vorschau zeigt den Ring (Luftlinie 28), das Feld am Fels, zu dem der Steinhauer geht, und unten im Feld:
„Erlaubt. Der Steinhauer geht 24 Felder zu Fuß zum Fels (höchstens 28)“ oder
„Kein Fels in Reichweite: der Steinhauer geht von der Türfackel höchstens 28 Felder zu Fuß ...“.
Bilder: `vergleich/ways_vorschau_steinbruch_nah.jpg`, `..._weit.jpg`, `..._kein_fels.jpg`.
Im Spiel geprüft: ein Steinbruch vom Startgebiet aus (34,40) wurde gebaut und brachte Steine (`vergleich/steinbruch_vom_startgebiet_nach_10min.jpg`).

### Baukosten (deine Antwort „ja“)

Ich habe die Baukosten aus den Spieldaten genommen. Das Wegesystem kennt noch keine Bretter und keine Glut. Darum zählt ein Brett
als ein Stamm, und die Glut des Holzfeuers fällt weg. **Kein erstes Gebäude hat in den Spieldaten Steine.** Darum musste ich
nichts gegen die Daten auf Holz umstellen.

| Gebäude | Spieldaten | Wegesystem jetzt (Stämme / Steine) | Runde 1 (Wegetest) |
|---|---|---|---|
| Kleines Holzfeuer | 4 Stämme, 1 Glut | 4 / 0 | 6 / 4 |
| Holzfäller | kostenlos | 0 / 0 | 3 / 1 |
| Förster | 2 Bretter | 2 / 0 | 3 / 1 |
| Jäger | 2 Bretter | 2 / 0 | 3 / 1 |
| Steinbruch | 3 Bretter | 3 / 0 | 4 / 1 |
| Sägewerk | 4 Stämme | 4 / 0 | 4 / 3 |
| Lager | 4 Bretter, 2 Steine | 4 / 2 | 5 / 2 |
| Brunnen | 1 Brett, 2 Steine | 1 / 2 | 1 / 4 |
| Wachhaus | 3 Bretter, 2 Steine | 3 / 2 | 4 / 6 |
| Mühle | 3 Bretter, 2 Steine | 3 / 2 | 5 / 4 |
| Räucherhaus | 2 Bretter, 2 Steine | 2 / 2 | 4 / 3 |
| Brauerei | 3 Bretter, 2 Steine | 3 / 2 | 5 / 5 |

Der Fischer steht in den Spieldaten (2 Bretter), im Wegesystem gibt es ihn noch nicht.
Das Sägewerk hat in den Spieldaten keine Steine; ich habe die Daten genommen, nicht „Steine ab dem Sägewerk“ (siehe Fragen).
Ein kostenloser Holzfäller wird von einem Zwerg mit einem Arbeitsschritt (5 Sekunden) aufgestellt.

### Freie Zwerge warten, wo sie sind (deine Antwort „a“)

Ein Zwerg ohne Aufgabe bleibt stehen, wo seine letzte Aufgabe endete, und nimmt von dort die nächste. Er läuft nicht mehr zum Feuer
zurück. Die Feuerwache bleibt am Feuer. Beim Start stehen die Zwerge an ihrem Feuer (am Herzfeuer im Hof). Für die Nacht (Stufe 2)
ist schon eingebaut, dass sie dann zu ihrem Feuer gehen.

Wirkung in 32 Minuten (Prüfläufe auf dem Rechner, `tables/dotnet-bench-report-r2.txt`):

| Lauf | Leerwege (Felder) | Aufträge | Warten auf einen Träger | Tragen je Auftrag | Lieferung gesamt | letzte Baustelle fertig |
|---|---|---|---|---|---|---|
| Vergleichslauf, warten wo sie sind | 0 | 256 | 0,0 s | 54,9 s | 54,9 s | 724 s |
| Vergleichslauf, zurück zum Feuer (Runde 1) | 2.023 | 261 | 0,1 s | 54,0 s | 54,1 s | 775 s |
| Freies Spiel, warten wo sie sind | 0 | 94 | 0,3 s | 23,2 s | 23,6 s | 86 s |
| Freies Spiel, zurück zum Feuer (Runde 1) | 122 | 94 | 0,3 s | 23,9 s | 24,2 s | 84 s |

Die Zwerge laufen keine Leerwege mehr (im Vergleichslauf rund 2.000 Felder weniger). Die Lieferzeiten bleiben fast gleich, weil
fast immer ein freier Zwerg da ist; die Baustellen des Vergleichslaufs sind knapp 1 Minute früher fertig.

### Dein Spieltest von Runde 1

- **Erdrampen und „Noppenfolie“:** Gebäude am Hang bekommen keine angehobene, ebene Fläche mehr; der Boden bleibt, wie die Karte
  ihn formt, das hohe Gras bleibt darauf, das Gebäude steht an seiner tiefsten Ecke (wie im Wegetest). Auf ebenem Boden bleibt
  die Fläche (sie hebt nichts an, und der gepflasterte Hof der Halle bleibt sichtbar). Außerdem war das Feld vor jeder Tür ohne
  hohes Gras (dort steht im alten Spiel unsichtbar die Türfahne); dort wächst jetzt Gras.
  Bilder gleiche Kamera: `vergleich/orte_*_runde1_gegen_runde2.jpg`. Von oben ist der Unterschied am Förster klein; die
  Höhenflächen im Protokoll: Runde 1 hob den Förster auf 11,09 an, Runde 2 legt keine Fläche mehr unter ihn.
- **Zwerge am Herzfeuer:** Der Hof der Halle ist begehbar; die Zwerge des Herzfeuers stehen im Hof um das Feuer, in zwei Reihen
  (`vergleich/herzfeuer_hof_runde1_gegen_runde2.jpg`). Im Hof kann nichts gebaut werden.
- **Sägewerk ohne Erbauer:** Zwei Ursachen. (1) Jedes Feuer hielt seinen eigenen Vorrat (Herzfeuer 6 Stämme, 6 Steine) für sich
  zurück. Nach Holzfäller und Förster blieb genau dieser Vorrat übrig, das Sägewerk bekam nichts, also kam auch kein Erbauer.
  Jetzt gibt ein Feuer für Baustellen auch unter seinem Vorrat ab, nur die letzten 2 Stämme behält es als Brennholz.
  (2) Eine Baustelle konnte auf das Feld vor der Tür eines anderen Gebäudes gesetzt werden, auch vor die Halle; dann kam keine
  Ware mehr aus der Halle. Das geht jetzt nicht mehr („Hier steht schon etwas“). Beides hat einen Test.
- **Steinbruch nicht setzbar:** siehe oben; vom Startgebiet aus geht es jetzt, mit Grund in der Vorschau, wenn nicht.
- Ein fertiges Gebäude, für das das alte Spiel kein Modell hinstellt (zum Beispiel der Steinbruch des Vergleichslaufs am
  Wasserfall), wurde in Runde 1 gar nicht gezeichnet. Jetzt zeigt es seinen Umriss, wie die Baustellen ohne Modell.

### Kiesel auf den Pfaden (dein Vorschlag, ein Muster)

Hinter einem Schalter (Taste G und Knopf im Feld, **beim Start aus**): auf ausgetretenen Trampelpfaden liegen ein paar lose
Kiesel, als Zeichen, dass die Zwerge ihre Wege schon selbst ein wenig ausbauen. Ohne Wirkung auf die Regeln; sonst ändert sich am
Pfadbild nichts.

So unterscheidet sich das Muster von der Kies-Textur, die du zweimal abgelehnt hast („zu geometrisch, zu ordentlich und symmetrisch“,
und am Fels im Spiel): Es ist **keine Textur und nichts Gekacheltes**. Es sind einzelne Voxel-Kiesel der Flusskiesel, die du
angenommen hast, in drei Größen, jeder an einem zufälligen Punkt, mit eigener Form, Drehung und Farbe. Sie liegen nur in der Mitte
eines ausgetretenen Pfades, dünn und fleckig: ganze Stücke bleiben leer, es gibt kein Band und keine Reihe. Nach 25 Minuten liegen
im ganzen Tal etwa 430 Kiesel.

Bilder gleiche Kamera, Tag, aus gegen an: `vergleich/kiesel_*_aus_gegen_an.jpg`. Kurzer Film bei 1x (12 Sekunden, jedes Bild
zweimal im selben Augenblick gerendert, oben aus, unten an): `clips/K1_kiesel_aus_gegen_an_tag_1x.mp4`.

## Der Vergleich mit dem Wegetest (Neuauflage)

Spieler-Lauf mit der Kamera des Films „Pfade entstehen“ (29,1 Minuten bei 1x, `tables/wegesystem_pfade_film_r2.csv`):
147 Stämme, 75 Steine, 22 Wild getragen, alle Baustellen fertig (Runde 1: 147 / 80 / 22). Film: `clips/W2_pfade_entstehen_wegesystem_runde2.mp4`,
Runde 1 gegen Runde 2: `clips/W3_pfade_runde1_gegen_runde2.mp4`.

| Baustelle fertig nach (Sekunden bei 1x) | Wegetest Runde 12, 6 Zwerge | Wegesystem Runde 1, 6 Zwerge | Wegesystem Runde 2, 6 Zwerge | Wegesystem Runde 2, 4 Zwerge |
|---|---|---|---|---|
| Neues Feuer an der Furt | 139 | 230 | 72 | 100 |
| Sägewerk | 250 | 319 | 127 | 135 |
| Lager am Holzfeuer | 344 | 452 | 252 | 399 |
| Brunnen | 476 | 579 | 345 | 427 |
| Wachhaus | 647 | 739 | 485 | 663 |
| Mühle | 903 | 852 | 523 | 658 |
| Räucherhaus | 1015 | 951 | 600 | 873 |
| Brauerei | 1173 | 1100 | 724 | 812 |
| Stämme / Steine / Wild nach 32 min | 86 / 105 / 13 (mit Nacht) | 162 / 85 / 22 | 156 / 78 / 22 | 158 / 79 / 22 |
| bis 6,5 min | 29 / 18 / 2, 3 Baustellen | 33 / 10 / 6, 2 Baustellen | 36 / 10 / 7, 4 Baustellen | 32 / 6 / 3, 2 Baustellen |
| Umweg der Träger (Weglänge zur Luftlinie) | 8 % | 44 % | 57 % | 50 % |

Was die Unterschiede erklärt:
- Alles wird viel schneller fertig, vor allem wegen der Baukosten aus den Spieldaten (weniger Stämme, die ersten Gebäude ohne Steine)
  und weil die Feuer Baustellen jetzt auch unter ihrem Vorrat beliefern.
- Der Steinbruch des Vergleichslaufs steht jetzt bei 39,16 über dem Wasserfall, nah am Fels, aber auf der anderen Bachseite als
  das Steinfeuer. Jeder Stein geht über die Furt; darum mehr Umweg und etwas weniger Steine als in Runde 1.
- Das Wegesystem läuft ohne Nacht; der Wegetest hatte ab 6,5 Minuten Nacht.

## Prüfungen

Genau wiederholbar: doppelter Lauf, Speichern und Laden, Wiederholung der Befehle, alle Invarianten jeden Takt; die feste Prüfsumme
nach 3000 Takten ist auf dem Rechner (dotnet) und in Unity gleich. Zahlen in `WORKER_RESULT.md`.

## Was noch fehlt

- Die Nacht (Stufe 2), Speichern und Laden im Menü (Stufe 3), Bretter, Fisch und das Sägewerk als Werkstatt, Ziele, Szenario.
- Das Wegfeuer an der Tür wird nicht versetzt (kommt in einem späteren Auftrag).
- Das Bild läuft weiter über das alte Spiel als „Bühne“.

## Fragen an dich

1. Kiesel: Gefällt dir das Muster als Andeutung? Mehr, weniger, hellere Steine, oder lieber anders?
2. Sägewerk: Die Spieldaten geben ihm nur 4 Stämme. Deine Antwort sagt „Steine erst für das Steinfeuer und höhere Gebäude
   (Sägewerk und alles danach)“. Soll das Sägewerk Steine kosten (wie viele), oder bleibt es bei den Daten?
3. Bretter: Solange es im Wegesystem keine Bretter gibt, zähle ich ein Brett als einen Stamm. Passt das bis zum Szenario?
4. Steinbruch-Reichweite 28 Felder Fußweg: passt das, oder soll die Karte den Fels näher legen, damit ein kleinerer Radius reicht?
5. Das Herzfeuer verbrennt alle 75 Sekunden einen Stein. Ohne Steinbruch sind die 8 Startsteine nach etwa 10 Minuten weg;
   dann kann auch ein Gebäude mit Steinkosten nicht mehr fertig werden. Soll das so bleiben?
6. Weil freie Zwerge jetzt stehen bleiben, wo sie sind, kann öfter „Ein Zwerg steht im Weg“ beim Bauen kommen. Stört dich das beim Spielen?
