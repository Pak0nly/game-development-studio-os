# Stufe 2: Vom KI-Video zum Zwergen-Skelett – Ergebnis

Stand 2026-11-09 (Nachfolger R2). Alles lief auf diesem PC: Videos mit Wan 2.2 in ComfyUI (nur auf 127.0.0.1), der
Gelenkfinder auf der Grafikkarte, Unity nur im Hintergrund. Keine neuen Downloads, keine Daten nach außen.

## Kurz gesagt

- **Der Gelenkfinder ist voll trainiert, aber im Mittel noch etwa dreimal zu ungenau.** Auf zufälligen Posen liegt er im
  Mittel 2,8 Bildpunkte daneben (Ziel: etwa 1). Bei Gehbewegungen, wie wir sie brauchen, trifft er das Ziel aber schon
  fast: rund 1,0 bis 1,1 Bildpunkte.
- **Drei neue Videos auf dem Laufband.** Alle drei halten die Figur, ihre Größe und den Blickwinkel jeder Ansicht über
  die ganzen 5 Sekunden – der erste Versuch hatte sich noch gedreht. Aber **keines erfüllt alle Regeln**: In 2a geht er
  vorn seitwärts, in 2b geht er rückwärts, in 2c sieht man von vorn nur wenig vom Gehen. Die Füße verschmieren in allen.
- **Für den Rückweg aufs Skelett wurde die Seitenansicht von 2a genommen** – die einzige Ansicht, in der er vorwärts geht.
  Die Spur der Füße zur Seite kommt aus der Vorderansicht von 2c (jedes Bein in seiner eigenen Bahn), Schrittlänge und
  Takt aus der Seitenansicht. Das Ergebnis läuft auf dem Voxel-Zwerg und ist neben dem heutigen Gehen zu sehen.
- **Urteil: die Schwelle der Studie ist noch nicht erreicht.** Die Prüfung mit bekannter Bewegung ist knapp nicht
  bestanden, und das Video-Gehen hat deutliche Fußrutscher und zuckende Hände. Siehe unten, was als Nächstes helfen würde.

## Die Videos (alle in `clips/`)

| Video | Was es zeigt | Urteil nach den Regeln |
|---|---|---|
| `video_versuch2a_zwei_ansichten.mp4` | zwei Ansichten mit breitem Trennbalken | Seite: geht vorwärts, bleibt im Profil. Vorn: Schritte zur Seite, Füße kreuzen sich. Beide Ansichten zeigen nicht dasselbe Gehen. |
| `video_versuch2b_seite.mp4` | nur Seite, volle Breite | Bleibt im Profil, klarer gleichmäßiger Schritt – aber **rückwärts** (der Schwungfuß wandert zur Ferse hin, der Standfuß rutscht nach vorn). |
| `video_versuch2c_vorn.mp4` | nur vorn, volle Breite | Bleibt frontal, ruhig, Hände heil. Nach dem Urteil des Menschen geht er, man sieht es von vorn nur wenig (die Füße heben sich im Bild nur 5 bis 6 Bildpunkte). |
| `video_versuch1_wan_gehen.mp4` (erster Versuch) | zwei Ansichten | Dreht sich in beiden Ansichten; nicht besser. |

Jedes Video: 121 Bilder, 5 Sekunden bei 24 Bildern pro Sekunde, kein doppeltes Bild, kein Sprung; Rechenzeit je etwa
23 Minuten plus 4 Minuten Entschlüsseln.

Gemessene Regeln (Zahlen in `r2/*_judge.json` und `r2/*_walkdir.json`):

| Regel | 2a vorn | 2a Seite | 2b Seite | 2c vorn | Versuch 1 |
|---|---|---|---|---|---|
| gleiche Figur, gleiche Größe (Höhe schwankt) | 2 % | 5 % | 3 % | 3 % | 5 % |
| fester Blickwinkel (Bilder mit gedrehter Figur) | 0 | 0 | 0 | 0 | 78 vorn, 19 Seite |
| Beine nicht vertauscht (vorn) | ja | – | – | ja | nein (16 Bilder) |
| Hände heil (mit dem Auge) | meist, im Schwung verschmiert | meist | ja | ja | „Krabbenscheren“ |
| keine doppelten Bilder | ja | ja | ja | ja | ja |
| geht in Blickrichtung (nicht rückwärts) | – | **ja** | **nein** | – | nein |
| kein Wandern zur Seite oder zur Kamera | **nein** (Schritte zur Seite) | ja (7 Bildpunkte in 5 s) | ja (19 Bildpunkte) | ja (3 Bildpunkte) | 17 bis 33 Bildpunkte |

Wie „vorwärts“ gemessen wird: In der Fußzone zwischen den Bildern wird die Bewegung verfolgt. Der Schwungfuß ist dort das
Schnellste; er muss in Blickrichtung wandern, der Standfuß muss mit dem Laufband nach hinten rutschen. In 2a (Seite):
Schwungfuß +2,1 Bildpunkte pro Bild nach vorn, Standfuß 2,4 nach hinten – richtig. In 2b genau umgekehrt (−2,3 und +2,6):
rückwärts, wie der Mensch gesehen hat. Ich hatte 2b zuerst als bestes gelobt und das übersehen.

## Gelenkfinder

| | sichtbare Punkte (Mittel / Median) | verdeckte Punkte |
|---|---|---|
| zurückgehaltene Zufallsposen, 10 Durchgänge (Vorgänger) | 4,39 / 2,95 | 8,76 |
| **zurückgehaltene Zufallsposen, 30 Durchgänge (jetzt)** | **2,82 / 1,68** | **6,74** |
| erfundene Bewegung (sauber / verschlechtert) | 4,16 / 4,07 | 9,1 |
| Laufen Runde 7 (sauber / verschlechtert) | 1,14 / 1,09 | 1,8 |
| ruhiges Gehen des Spiels (sauber / verschlechtert) | 1,03 / 0,98 | 1,6 |

Der Fehler fiel bis zum Schluss langsam weiter. **Eine Änderung versucht: feinere Auflösung** (der Finder sieht das Bild
1,5-mal so fein). Sie lernt schneller (nach 10 Durchgängen 3,56 statt 4,32), kam aber in der verfügbaren Zeit
(15 Durchgänge, eine Stunde) nur auf 2,99 und auf den Gehbewegungen auf 1,1 bis 1,2 – also nicht besser als der
normale Finder. Verwendet wurde deshalb der normale Finder. Was den Fehler weiter senken würde: die feine Auflösung mit
30 Durchgängen (etwa 2 Stunden), mehr Posen, die echten Gehbewegungen näherkommen, und ein zweiter, gezoomter Blick auf
Hände und Füße.

## Die Prüfung mit bekannter Bewegung (Finder statt Bildpunkte aus dem Bild)

Grenze: mittlerer Fehler je Körperteil unter 5 Grad (ohne Rockbahnen, die setzt unsere eigene Rockregel).

| Bewegung | mittlerer Fehler | schlechtestes Teil | Teile über 5 Grad | Fußrutschen | bestanden? |
|---|---|---|---|---|---|
| ruhiges Gehen des Spiels, sauber | 2,3 Grad | 5,2 (rechter Unterschenkel) | 1 | 1,3 Voxel | knapp nein |
| ruhiges Gehen des Spiels, verschlechtert | 2,3 Grad | 5,2 (rechter Unterschenkel) | 1 | 1,3 Voxel | knapp nein |
| Laufen Runde 7, sauber / verschlechtert | 3,3 / 3,4 Grad | 10,0 (rechter Unterschenkel) | 4 | 0 | nein |
| erfundene Bewegung | 14,2 Grad | 47 (rechte Hand) | 16 | 0 | nein |

Abstand der Füße zur Seite (der neue Prüfpunkt): Beim ruhigen Gehen bleibt er wie im Original bei 27 bis 28 Voxeln; die
Füße laufen nicht auf einer Linie zusammen. Beim Laufen ebenso (Original 27,6, Ergebnis 27,5 bis 28,5).

## Das Video-Gehen auf dem Zwerg

`clips/vergleich_heute_gegen_video2a_seite.mp4`: oben das heutige Gehen des Spiels, unten das Gehen aus Video 2a, je
vorn, Seite und Spielkamera.

| | heute | aus Video 2a (Seite) | aus Video 2c (vorn) |
|---|---|---|---|
| Tempo | 0,27 Kacheln/s | 0,25 Kacheln/s | nicht ablesbar (0) |
| Fußrutschen (max / Mittel) | 0 / 0 | 7,0 / 2,9 Voxel | 2,1 / 1,1 Voxel |
| Füße zur Seite (min / Mittel / max) | 27,6 / 27,6 / 27,6 | 30,9 / 36,1 / 44,9 | 36,0 / 37,5 / 38,8 |
| Rock durchs Bein (Bilder) | 3 | 9 | 24 |
| schnellste Drehung | 447 Grad/s | 3714 Grad/s (rechte Hand) | 1868 Grad/s (rechte Hand) |

Wie die fehlende Tiefe gefüllt wurde (eigene Regeln):
- **Nur Seitenansicht (2a):** Die Seite zeigt vorn/hinten und oben/unten. Für „links/rechts“ nimmt jeder Punkt seine Lage
  im ruhigen Stand; die Unterschenkel und Füße kommen auf die Bahn, die die Vorderansicht von 2c zeigt (links 15, rechts
  21 Voxel neben dem Becken). Das trägt für ruhiges Gehen gut, weil man dabei kaum seitlich schwingt; Gewichtsverlagerung
  und seitliches Pendeln fehlen ganz, und Arme, die vor den Körper gehen, bleiben falsch.
- **Nur Vorderansicht (2c, zum Vergleich):** Vorn/hinten fehlt. Jedes Bein und jeder Arm behält seine Knochenlängen; was im
  Bild an Länge fehlt, liegt in der Tiefe. Das Bein mit dem höheren Fuß geht nach vorn, der Arm schwingt gegen sein Bein.
  Das ergibt kleine Schritte auf der Stelle, aber kein Vorwärtskommen – die Schrittlänge sieht man nur von der Seite.
- 2c wurde nicht mit einer Seitenansicht zu zwei Ansichten verbunden: Die Videos sind getrennt entstanden, ihre Schritte
  fallen nicht auf dieselben Augenblicke.

## Urteil

Gegen die Schwelle der Studie (Prüfung bestanden; die Figur bleibt in beiden Ansichten 5 Sekunden gleich; der Mensch
findet es im Vergleich klar besser):

- Prüfung: **knapp nicht bestanden** (ruhiges Gehen: ein Teil bei 5,2 Grad, Fußrutschen 1,3 statt unter 0,5 Voxel).
- Figur bleibt gleich: **ja, in allen drei neuen Videos** (Fortschritt gegenüber Versuch 1). Aber kein Video zeigt in
  beiden Ansichten dasselbe Vorwärtsgehen.
- Vergleich: Das Video-Gehen hat echte, schwere Schritte, aber Fußrutscher und zuckende Hände; es ist nach meiner
  Einschätzung **noch nicht besser** als das heutige Gehen. Das Urteil darüber hat der Mensch.

## Vorgeschlagener nächster Schritt (nicht begonnen)

1. **Nur Seitenansicht, mit fester Richtung:** Prompt nennt die Richtung ausdrücklich („geht nach links, in Blickrichtung,
   vorwärts“), das Startbild zeigt ihn mitten im Schritt mit dem vorderen Fuß in Blickrichtung (statt im Stand), und der
   Gegenprompt verbietet „rückwärts gehen, moonwalk“. Drei Samen, Auswahl mit der Richtungsregel. Für die Bahnen der Füße
   reicht eine eigene Vorderansicht (wie 2c).
2. **Gelenkfinder:** feine Auflösung mit 30 Durchgängen (etwa 2 Stunden) und mehr Posen nahe am Gehen.
3. **Fußrutscher:** Die Füße beim Rückweg härter festhalten, solange sie tragen (Schwelle aus der Seitenansicht).

## Daten

- Videos und Vergleiche: `clips/`. Startbilder, Übersichten, Messwerte, Tabellen: `r2/` (`stage2_tables.md` mit allen
  Teilen einzeln).
- Code und Spuren im Zwergenordner, Commit `2649e1d` auf `zwerge` (nicht hochgeladen).
