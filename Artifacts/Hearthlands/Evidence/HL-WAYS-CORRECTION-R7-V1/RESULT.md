# Wegesystem Runde 7: deine Korrekturen aus dem Spieltest von Runde 6

Starten: `C:\GameDev\Hearthlands\Unity\Builds\HL-Game-ways-r7\Wegesystem Tag ohne Strassen spielen.cmd` (erst der Startbildschirm,
dann „Spiel starten“). Zum Vergleich: `Wegesystem Vergleich Runde 6.cmd` spielt dieselbe Runde mit den Regeln und dem Bild von Runde 6
(Einebnen wie Runde 6, Holz als Haufen vor dem Feuer, Jäger am Waldrand, keine Steilheitsregel, Gebäude voll besetzt).

Die Vergleichsbilder in `vergleich/` zeigen oben Runde 6 und unten Runde 7: dieselbe Szene, dieselbe Kamera, derselbe Spielstand (zweimal
gespielt, nur die Schalter von Runde 6 verschieden).

## Was sich geändert hat

1. **Einebnen ohne Sprünge (wie Siedler 2):**
   - Ursache des Blocks zwischen Förster und Holzfäller: Runde 6 hat jeden Punkt des Bodens nur dem *nächsten* Gebäude zugeordnet. Stehen zwei
     Gebäude mit verschiedener Höhe nah beieinander, wechselt diese Zuordnung an einer Feldkante, und dort springt der Boden um den
     Höhenunterschied: eine gerade Kante, ein Block.
   - Jetzt: Jede Baustelle bleibt auf ihrer eigenen Höhe (wie bei Siedler 2). Das Land um *alle* Baustellen zusammen wird als eine einzige
     glatte Fläche angepasst: um jedes Gebäude höchstens 0,18 Höhe pro Feld zusätzlich (ein Höhenschritt ist 0,5), bei größerem Unterschied
     also ein breiterer Übergang; Wasser, Furten und Fels bleiben, wie sie sind; neben dem Wasser wird nie abgetragen. Dadurch kann es keine
     Kante mehr geben, nur noch sanfte Hänge.
   - Gemessen auf demselben Dorf (der größte Höhensprung, den das Einebnen zwischen zwei Punkten 0,05 Felder auseinander hinzufügt):
     Runde 6: 0,457, Runde 7: 0,017. In einem Test mit 22 Baustellen dicht an dicht: Runde 6 0,363, Runde 7 0,036.
   - Das Sägewerk am Ufer (Erdfleck und gerade Graskante in Runde 6): Runde 6 hat es auf die Höhe des Rings gebracht, die tiefer lag als das
     Ufer; der Boden neben dem Wasser wurde abgesenkt, dort wächst kein Gras mehr, und das Gras endet an einer Feldkante. Jetzt steht das
     Sägewerk auf seiner eigenen Höhe (9,50 statt 9,92 nach Runde 6), und neben dem Wasser wird nichts abgesenkt.
   - **Steilheitsregel:** Ein Gebäude darf nur stehen, wo der Boden rings herum (1 und 2 Felder um das Gebäude) höchstens so viele
     Höhenschritte über oder unter dem Gebäude liegt: kleine Gebäude (1×1) 1 und 1, große (2×2 und mehr) 0 und 1. Sonst sagt die Vorschau
     „Zu steil hier“, und die Vorschläge zeigen nur Plätze, die passen. Bild `stills/r7_01d_zu_steil_hier.jpg`.
   - Wie viel Bauland bleibt (Startland, Tabelle `tables/r7_bauland_steilheit.csv`): kleine Gebäude 349 von 373 Plätzen (93 %), große 221 von
     301 (73 %).
   - Bilder: `vergleich/boden_foerster_holzfaeller_*`, `boden_saegewerk_ufer_*`, `boden_foerster_eben_*`, `dorf_spielkamera_*` (Runde 6 gegen
     Runde 7), `vergleich/*_vorher_nachher.jpg`, Clip `clips/C1_einebnen_runde6_gegen_runde7_1x.mp4`.
   - Ehrlich: An den Plätzen, die ich nachgestellt habe (Förster und Holzfäller mit dem größten Höhenunterschied auf deinem Startland,
     1,1 Höhe), sieht man den Block von Runde 6 aus der Spielkamera kaum; die Zahlen zeigen ihn. Deinen genauen Spielstand hatte ich nicht.
2. **Jäger: gute Jagdgründe.** Beim Setzen des Jägers zählen die Vorschläge jetzt das Wild in Reichweite (die Wildplätze der Karte, bis 12
   Felder vom Ablageplatz), nicht mehr die Bäume; der nähere Wildplatz zuerst. Der Jäger jagt auch wirklich dort (er wartet am nächsten
   begehbaren Feld beim Wild). Ohne Wild in Reichweite sagt die Vorschau „Kein Wild in Reichweite: der Jäger jagt dann nur am Waldrand“.
   Holzfäller zählen Bäume, Förster freie Felder, Steinbruch den Weg zum Fels, Jäger Wild. Bild `stills/r7_02a_jaeger_gute_jagdgruende.jpg`,
   Vergleich `vergleich/jaeger_gute_plaetze_runde6_gegen_runde7.jpg`.
3. **Wer trägt:** Das Lagerhaus zeigt „Lagerträger: 0 von 4“ und darunter getrennt: „Dazu tragen freie Zwerge der Feuer, gerade 2 unterwegs.
   Sie gehören zu keinem Lagerhaus.“ Im Infofeld eines Zwergs steht „Freier Träger vom Feuer: Große Halle“ oder „Lagerträger von: Lagerhaus“
   (Runde 6 zeigte einen Lagerträger als „untätig“). Bilder `stills/r7_03a_*`, `r7_03b_freier_traeger_info.jpg`.
4. **Start mit einem Arbeiter:** Ein fertiges Gebäude startet mit einem Arbeiter (ein Lagerhaus mit einem Lagerträger), du erhöhst selbst.
   Das Lagerhaus der Karte startet ohne Träger. Bild `stills/r7_04_holzfaeller_ein_arbeiter.jpg`.
5. **Holz eingefüllt:** Das Holz eines Feuers oder Wegfeuers liegt nicht mehr als Haufen davor; die Träger füllen es ein, das Infofeld zeigt
   „Holz eingefüllt: 3 von 3“. Andere Waren liegen weiter an ihrem Ablageplatz. Bilder `vergleich/feuer_holz_*`, `feuer_info_*`, Clip
   `clips/C2_feuer_holz_runde6_gegen_runde7_1x.mp4`.
6. **Zwerge 18/14:** Zahl und Plätze waren richtig. Die 18 kamen von meinem Aufnahme-Schritt in Runde 6, der für die Bilder 8 Zwerge per
   Debug an die volle Halle gesetzt hat. Jetzt setzt dieser Schritt nur noch in freie Plätze, und wird ein Feuer gelöscht, ziehen seine Zwerge
   zum nächsten Feuer mit Platz. Bild `stills/r7_06_zwerge_oben_nicht_ueber_plaetze.jpg` (8 von 8).

## Gemessen: der Tag (10 Minuten bei 1x) mit einem Arbeiter beim Start

Gleiche Aufträge zu gleichen Zeiten wie in Runde 6 (Tabelle `tables/r7_tag_ein_arbeiter.csv`).

| Regel | Lieferungen | neue Zwerge | Baustellen fertig / offen | Stämme | Wild |
|---|---|---|---|---|---|
| Runde 7 (ein Arbeiter beim Start) | 66 | 4 | 9 / 0 | 21 | 10 |
| Runde 6 (voll besetzt) | 24 | 0 | 6 / 2 | 9 | 6 |

Mit einem Arbeiter je Gebäude bleiben genug Zwerge zum Tragen: fast dreimal so viele Lieferungen, alle Baustellen fertig, 4 neue Zwerge.

## Was noch fehlt / Befunde

- Mit 8 Zwergen kam kein Lagerträger, als ich das Lagerhaus auf 1 stellte, und der zweite Holzfäller blieb ohne Arbeiter: es gab keinen freien
  Zwerg (Feuerwache, ein freier Träger je Feuer, die Arbeiter). Das Infofeld zeigt dann „1 Platz frei: wartet auf einen freien Zwerg“.
- Auf Testtal gibt es nur zwei Wildplätze (Westhügel und östlicher Waldrand). Die guten Jagdgründe liegen darum alle am östlichen Wald, nah bei
  den Holzfäller-Plätzen; die Schilder sagen aber „1 Wildplatz“ statt Bäume.
- Ein Jäger ohne Wild in Reichweite jagt weiter am Waldrand (wie bisher).

## Prüfungen

- Spielkern (dotnet): 2245, 2243 bestanden, nur die zwei bekannten alten Fehler.
- Unity, Wege-Tests: 42 von 42. Volle Unity-Suite: siehe WORKER_RESULT.md.
- Neue Version der Einstellungen 6, neuer festgehaltener Prüfwert 7694854352402969179 (dotnet und Unity gleich).

## Fragen an dich (Vorschläge)

1. Steilheitsregel: kleine Gebäude 1/1, große 0/1 Höhenschritte im ersten/zweiten Ring (93 % bzw. 73 % des Startlands bleiben). Passt das, oder
   lieber großzügiger (große 1/1: 95 %)?
2. Einebnen: höchstens 0,18 zusätzliche Höhe pro Feld (ein Schritt verläuft über etwa 3 Felder). Passt das im Bild?
3. Jäger: bis 12 Felder zum Wild. Soll ein Jäger ohne Wild in Reichweite weniger oder gar nichts fangen?
4. Sollen mehr Wildplätze auf die Karte (bisher zwei)?
5. Der freie Träger je Feuer und die Feuerwache binden bei 8 Zwergen zwei Zwerge; neue Plätze bleiben dann leer. So lassen?
