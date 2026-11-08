# Stufe 1: Prüfung mit bekannter Bewegung – Ergebnis

## Kurz gesagt

- **Der Rückweg auf unser Zwergen-Skelett funktioniert.** Aus zwei sauberen Ansichten (vorn und Seite) kommt die
  Bewegung praktisch exakt zurück: im Mittel 0,0 Grad Fehler bei der erfundenen Bewegung und 0,2 Grad beim Laufen.
  Auch aus den absichtlich verschlechterten Bildern (Unschärfe, Licht- und Farbwechsel, halbe Auflösung, Rauschen,
  doppelte Bilder) bleibt die Abweichung bei rund 1 bis 2 Grad.
- **Die Schwachstelle ist der Gelenkfinder.** Sobald die gefundenen Gelenkpunkte ungenau sind (1,5 Bildpunkte, etwa
  ein halber Voxel), liegt der Fehler bei 3,5 bis 6 Grad im Mittel, also genau an der Grenze von 5 Grad. Kopf, Hände
  und die vorderen Rockbahnen werden dann zu ungenau. Für Stufe 2 heißt das: Der Gelenkfinder muss genauer als
  1,5 Bildpunkte sein, sonst reicht es nicht.
- **Als Qualitätsschranke für unsere eigenen Animationen ist die Prüfung sofort nützlich.** Sie hat in den heute
  angenommenen Bewegungen echte Fehler gefunden (Rockbahnen springen beim Laufen, Knie durch den Rock beim Knien,
  Rock der Zwergin beim Laufen, Schildarm über seine Grenze, kleine Fußrutscher im Kampf, Gehtempo des Spiels).
- **Stufe 2 lohnt sich als begrenzter Versuch**, aber nur mit einem klaren Ziel für die Genauigkeit des Gelenkfinders
  und mit Video in mehr als 24 Bildern pro Sekunde für schnelle Bewegungen (siehe unten).

## Was gebaut wurde

Alles läuft im Hintergrund in Unity (ohne Fenster, ohne Grafikkarte, mit einem eigenen kleinen Zeichenprogramm für die
Bilder). Keine Downloads.

1. **Bekannte Bewegungen auf dem schweren Zwerg:** eine erfundene Bewegung (jedes Körperteil schwingt innerhalb seiner
   Gelenkgrenzen, die Kriegsaxt in der rechten Hand, die Füße in der Luft) und das heute angenommene Laufen
   (Gehtempo Runde 7). Die genauen Drehungen jedes Teils in jedem Bild sind gespeichert.
2. **Zwei feste Kameras** (vorn und Seite in einem Bild, je 360 × 640 Bildpunkte, so groß wie eine Hälfte eines
   1280 × 704 Videos, 24 Bilder pro Sekunde), einmal sauber und einmal verschlechtert wie ein KI-Video.
3. **Gelenkpunkte aus den Bildern:** pro Körperteil das Gelenk und drei Punkte auf seiner Oberfläche, dazu Griff,
   Knauf, Auge und Schneide der Axt, direkt aus dem Bild genommen (keine KI). Bei den verschlechterten Bildern so, wie
   sie im unscharfen Bild erscheinen, auf die halbe Auflösung gerundet, bei doppelten Bildern doppelt. Wahlweise mit
   Zufallsfehler von 1,5 Bildpunkten, bei verdeckten Punkten dreimal so viel. Die doppelten Bilder werden allein aus den
   Bildern wiedergefunden (13 von 13, kein Fehlalarm) und durch ihre Nachbarn ersetzt.
4. **Zurück aufs Skelett:** Vorn und Seite ergeben die 3D-Lage jedes Punkts; dann wird jedes Teil vom Becken nach
   außen so gedreht, dass seine Punkte passen, innerhalb seiner Gelenkgrenzen; die Axt sitzt fest in der Hand und
   hilft, das Handgelenk zu drehen; leichte Glättung über die Zeit; die Füße werden festgehalten, solange sie tragen
   (Ferse beim Abrollen, Zehe beim Abheben, mit unserem eigenen Beinlöser); das Vorwärtskommen kommt vom Becken, so
   passt das Tempo zum Boden.
5. **Ergebnis als Spur, die der Zwerg abspielen kann:** eine Zeile pro Bild mit der Drehung jedes Teils. Die Spur wird
   geschrieben, wieder gelesen und abgespielt (Abweichung 0,000 Grad). In das Animationssystem kommt sie entweder als
   Tabelle wie die heutige Lauftabelle des Spiels, oder verkürzt auf Schlüsselposen, zwischen denen weich übergeblendet
   wird: Bei der ruhigen erfundenen Bewegung reichen 60 von 120 Bildern (1 Grad Toleranz), beim schnellen Laufen
   braucht es jedes Bild.

## Die Prüfung: Ergebnisse

Grenzwerte (Vorschlag der Studie): mittlerer Winkelfehler je Teil unter 5 Grad, Fußrutschen unter 0,5 Voxel, kein Rock
im Knie. „Teile über 5 Grad“ zählt die Körperteile, deren mittlerer Fehler 5 Grad erreicht.

| Bewegung / Eingabe | mittlerer Fehler | schlechtestes Teil | Teile über 5 Grad | Fußrutschen | bestanden? |
|---|---|---|---|---|---|
| Erfunden, sauber | 0,0 Grad | 0,1 (linke Hand) | 0 | 0 | ja |
| Erfunden, verschlechtert | 0,8 Grad | 1,3 (linke Hand) | 0 | 0 | ja |
| Erfunden, sauber mit Pixelrauschen | 3,3 Grad | 5,3 (Kopf) | 1 | 0 | knapp nein |
| Erfunden, verschlechtert mit Pixelrauschen | 3,5 Grad | 5,5 (Kopf) | 2 | 0 | knapp nein |
| Laufen, sauber, ohne Glättung | 0,2 Grad | 0,8 (Rockbahn) | 0 | 0 | ja |
| Laufen, sauber, mit Glättung | 2,2 Grad | 8,9 (Rockbahn links vorn) | 2 | 0 | nein (siehe unten) |
| Laufen, verschlechtert, ohne Glättung | 1,8 Grad | 6,4 (Rockbahn links vorn) | 1 | 0 | knapp nein |
| Laufen, sauber mit Pixelrauschen | 4,6 Grad | 9,3 (Rockbahn links vorn) | 10 | 0 | nein |
| Laufen, verschlechtert mit Pixelrauschen | 5,0 Grad | 10,4 (Rockbahn links vorn) | 12 | 0 | nein |

Weitere Maße (alle Zahlen in `exam_tables.md`):

- **Gelenklage:** im Mittel 0,0 Voxel (sauber) bis 1,3 Voxel (Laufen, verschlechtert mit Rauschen).
- **Hand und Axtgriff:** Der Griff sitzt durch die feste Bindung immer in der Hand. Gegen die echte Axt liegt er im
  Mittel 0,8 Voxel daneben (schlimmster Fall mit Rauschen), die Axtrichtung 1,3 Grad. Ohne Bindung hätte der gefundene
  Griff bis zu 4,7 Voxel neben der Hand gelegen: Die Bindung ist nötig.
- **Rock durchs Knie:** Das Ergebnis hat kaum mehr Stellen als das Original (Laufen: 1 Bild im Original, 2 bis 4 im
  Ergebnis).
- **Tempo gegen den Boden:** Abweichung 0,0 Prozent; die Füße rutschen im Ergebnis nicht (0,0 Voxel mit Glättung,
  0,3 bis 0,4 Voxel ohne).

**Warum das Laufen schwerer ist:** Der Laufzyklus dauert nur etwa 12 Bilder bei 24 Bildern pro Sekunde. Jede Glättung
über die Zeit verschmiert dann schnelle Bewegungen, und ohne Glättung bleibt das Rauschen. Dazu kommt ein Fehler, den
die Prüfung im Original selbst gefunden hat: Die seitlich vorderen Rockbahnen springen im angenommenen Laufen von einem
Bild zum nächsten zwischen etwa 45 und 7 Grad hin und her. So ein Springen kann kein Rückweg nachbilden, und es sollte
auch nicht im Original sein.

**Was die Prüfung noch nicht abdeckt:** Die Gelenkpunkte kommen in Stufe 1 aus unserem eigenen Bild, nicht von einer
KI. Ob ein KI-Video die Figur in beiden Ansichten über 5 Sekunden gleich hält, kann erst Stufe 2 zeigen.

## Vorgeschlagene feste Grenzwerte

| Maß | Grenze |
|---|---|
| mittlerer Winkelfehler je Teil (gegen das Original) | unter 5 Grad |
| Gelenklage | im Mittel unter 1 Voxel |
| Fußrutschen, solange der Fuß trägt | unter 0,5 Voxel |
| Rock: Bilder mit 5 oder mehr Beinvoxeln außerhalb des Rocks | keines |
| Knie oder Oberschenkel vor der vorderen Rockbahn (über das Maß in Ruhe hinaus) | höchstens 0,5 Voxel |
| Hand zum Werkzeuggriff | im Mittel unter 1 Voxel, Werkzeugrichtung unter 3 Grad |
| Tempo gegen den Boden | höchstens 2 Prozent Abweichung |
| Gelenkgrenzen (Arme, Kopf, Bart, Rock) | höchstens 3 Grad darüber |
| Sprünge | kein Teil springt in einem Bild (1/48 Sekunde) um mehr als 30 Grad |

Die Beine (Oberschenkel, Unterschenkel, Stiefel) werden bei den Gelenkgrenzen getrennt gezählt: Unser eigener
Beinlöser hält die eingetragenen Grenzen nicht ein (der Unterschenkel bekommt eine Verdrehung). Das ist bei allen
Gehbewegungen so und sollte erst geklärt werden, bevor die Grenze für die Beine zählt.

## Was die Prüfung in den heutigen Bewegungen findet

Direkt auf die Code-Bewegungen angewendet, ohne Video (48 Posen pro Sekunde). Bilder mit den Fundstellen (Beinvoxel
außerhalb des Rocks rot) in `clips/pruefung/`. Axt und Schild sind auf diesen Bildern nicht gezeichnet.

**Schwerer Zwerg**
- **Laufen (angenommen, Runde 7):** Füße rutschen nicht, Tempo passt. Aber die seitlich vorderen Rockbahnen springen:
  bis zu 54 Grad von einem Bild zum nächsten (sie drehen sich 2600 Grad pro Sekunde). Einmal stehen 5 Beinvoxel
  aus dem Rock, das Knie steht bis 1,9 Voxel vor der vorderen Rockbahn.
- **Gehen des Spiels (Runde 1f):** Das Knie steht bis 4,4 Voxel vor der vorderen Rockbahn (der bekannte Fehler „Rock
  durchs Knie“). Das Gehen selbst kommt mit 0,27 Kacheln pro Sekunde voran, das Spiel bewegt die Zwerge aber mit
  0,82: Im Spiel rutschen die Füße also um das Dreifache. Das passt zum Hinweis „wobbelt zu viel, insbesondere bei
  erhöhter Geschwindigkeit“.
- **Stehen:** in Ordnung (das Knie steht 2,2 Voxel vor der Rockbahn).
- **Kampf:** Der Schildarm (linker Oberarm) liegt in fast allen Kampfbewegungen 22 bis 32 Grad außerhalb seiner
  eingetragenen Grenze (er geht weiter vor die Brust, als die Grenze erlaubt; entweder ist die Grenze zu eng oder die
  Haltung zu stark). Kleine Fußrutscher: Anbrüllen 1,9 Voxel, Treffer abbekommen 1,5, die beiden Schläge 0,6 und 0,7.
  Beim Abwehren steht das Knie 2,9 Voxel vor der Rockbahn.
- **Anführer sinkt auf den Schild:** Beim Knien gehen beide Knie deutlich durch den Rock (bis 46 Voxel außerhalb, in
  80 Bildern), und der hintere Fuß rutscht über den Boden (bis 41 Voxel). Ob das Rutschen beim Hinknien gewollt ist,
  sollte jemand im bewegten Bild ansehen.

**Zwergin**
- **Laufen (angenommen, Runde 7):** In 77 von 192 Bildern stehen 5 oder mehr Beinvoxel aus dem Rock (bis 27). Ihr
  linker Unterarm liegt in jedem Bild bis 8 Grad außerhalb seiner Grenze. Füße und Tempo in Ordnung.
- **Stehen:** in Ordnung (nur einzelne Voxel am Saum).
- **Kampf:** Rock durchs Bein beim Abwehren (31 Bilder), Erschöpft (80 Bilder), Anbrüllen (11). Kleine Fußrutscher
  beim Anbrüllen (1,6) und Treffer (1,8). Anführer sinkt: wie beim schweren Zwerg, Knie durch Rock und Schürze
  (bis 12,4 Voxel vor der Schürze), hinterer Fuß rutscht 36 Voxel.

„Wankt heim“ ist nicht geprüft: Dort dreht sich die ganze Figur, und das Testprogramm bewegt sie außerhalb der Pose.

## Lohnt sich Stufe 2?

Ja, als begrenzter Versuch, wenn diese Bedingungen gelten:

1. **Ziel für den Gelenkfinder:** genauer als etwa 1 Bildpunkt bei dieser Bildgröße (2,7 Bildpunkte pro Voxel). Mit
   1,5 Bildpunkten Fehler reicht es knapp nicht. Das sollte das Erste sein, was in Stufe 2 gemessen wird, bevor
   Stunden in Videos gehen.
2. **Video schneller als 24 Bilder pro Sekunde** für schnelle Bewegungen wie das Laufen, oder als Testbewegung zuerst
   etwas Ruhigeres (gemütliches Gehen, Arbeit), wo der Rückweg schon jetzt sehr gut ist.
3. **Den Rock und die Schürze nicht aus dem Video nehmen**, sondern mit unserer eigenen Rockregel setzen (das Video kennt
   die Rockbahnen nicht, und sie sind die ungenauesten Teile).

Unabhängig davon lohnt sich die Prüfung sofort als feste Schranke: Sie zeigt schon jetzt Fehler in den angenommenen
Bewegungen, die man beheben kann, ohne irgendetwas herunterzuladen (Rockbahnen beim Laufen, Gehtempo des Spiels,
Rock beim Knien, Rock der Zwergin, Schildarm).

## Aufräumen (vom Menschen erlaubt)

Gelöscht: 2836 Dateien, 1 030 683 566 Bytes (etwa 983 MB): die Einzelbilder `f*.png` in den Unterordnern von
`work/proof1`, `proof2`, `proof3` und die Ordner `work/clips1`, `clips2`, `clips3` des Pinsel-Workers. Behalten:
`proof_table.tsv`, `proof_log.txt`, `view_full.png`, die Ausschnitte, `work/views`, `window_test.png`. Liste aller
gelöschten Dateien: `logs/housekeeping_deleted_files.tsv`.

## Clips

- `clips/erfunden_echt_gegen_rueckweg_schlecht_rauschen.gif`, `clips/erfunden_echt_gegen_rueckweg_sauber.gif`: oben
  das Original, unten der Rückweg, gleiche Kameras (vorn, Seite, Spielkamera).
- `clips/gehen_echt_gegen_rueckweg_schlecht_rauschen.gif`, `clips/gehen_echt_gegen_rueckweg_sauber.gif`: dasselbe für
  das Laufen.
- `clips/erfunden_eingabe_sauber_und_verschlechtert.gif`, `clips/gehen_eingabe_sauber_und_verschlechtert.gif`: die
  Eingabebilder, sauber neben verschlechtert.
- `clips/pruefung/`: die Fundstellen in den heutigen Bewegungen.
