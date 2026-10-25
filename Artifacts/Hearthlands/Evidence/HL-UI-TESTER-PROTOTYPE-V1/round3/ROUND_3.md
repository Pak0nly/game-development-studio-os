# Runde 3: Tester-Oberfläche mit Spotlight, Zwergen-Steckbrief und Platzvorschlägen

Stand: 25.10.2026. Alle Texte, Farben, Namen und Abstände sind Vorschläge.
Spielprogramm: `C:\GameDev\Hearthlands\Unity\Builds\HL-Player-ui-r3\Hearthlands.exe`.

## Kurz

- **Auswahl:** Ein angeklicktes Gebäude bekommt einen hellgoldenen Rahmen auf dem Boden, das Infofeld denselben Rand.
- **Zwerge anklicken:** Ein kleiner Steckbrief zeigt Name, Statur (kräftig oder schlank), Beruf, was er gerade tut, was er trägt, Arbeitsplatz und Zuhause. Der Arbeitsplatz ist **blau** umrandet (beim Träger sein Weg), der Zwerg selbst hat einen hellen Ring. Das Anklicken klappt auch, wenn er läuft.
- **Tutorial mit Spotlight:** Der Rest des Bildes wird abgedunkelt, das Ziel des Schritts hat einen hellen Rahmen. Jeder Schritt lässt nur seine Handlung zu, dazu das Menü und „Tutorial überspringen“. Ein Klick daneben passiert nicht; unten links steht dann „Erst dieser Schritt: …“. Nicht erlaubte Knöpfe sind grau.
- **Beim Setzen:** Ein heller Rahmen zeigt die Reichweite (genau das Feld, das das Spiel absucht). Bis zu drei grüne Vorschläge zeigen gute Plätze mit Zahl, zum Beispiel „Guter Platz · 80 Bäume“. Das gilt für jedes Gebäude mit Reichweite (Holzfäller: Bäume, Steinbruch: Felsen, Förster: freie Felder, Fischer, Jäger).
- **Baumenü:** Pro Reiter stehen bis zu drei weitere Gebäude grau mit „kommt später“ als Vorgeschmack.
- **„Wegfeuer“ / „waypoint fire“** steht jetzt überall, wo vorher „Glutpfahl“ stand.
- **Ahnentafel nachts:** Die Glutsteine lesen sich jetzt als rote, glühende Steine (2, 6 und 12).

## Was ein Tester jetzt sieht, Schritt für Schritt

Bilder in `round3/session/`, jeweils Deutsch (`de_…`) und Englisch (`en_…`), dazu `first_session_de.gif` und `first_session_en.gif`. Bögen in `round3/sheets/`.

1. **Startbildschirm** (`de_00_start.jpg`): wie bisher; „Spiel starten“ hat jetzt den hellgoldenen Rand statt Glut.
2. **Schritt 1, Schau dich um** (`de_01_step1_look_around.jpg`): Der Text erklärt jetzt auch die Grenze: „Die kleinen Laternen ringsum markieren die Grenze deines Landes; nur darin kannst du bauen.“ Pause (`de_01b_paused.jpg`) ist jetzt eine dunkle Schiefertafel.
3. **Schritt 2, Dein Lager** (`de_02_step2_your_store.jpg`): Alles ist abgedunkelt bis auf die Große Halle (heller Rahmen, Zeiger „Große Halle“). Das Herzfeuer-Schild ist in diesem Schritt ausgeblendet, damit sich die beiden Schilder nicht überdecken. Ein Klick auf die Wiese (`de_02a_step2_forced.jpg`) bewirkt nichts; unten links steht „Erst dieser Schritt: Dein Lager“. Bauen, Weg, Tempo und Hilfe sind grau. Klick auf die Halle: das Infofeld (`de_02b_hall_info_and_embers.jpg`), jetzt mit einer einzigen Herzglut-Zahl (die Glut steht nicht noch einmal im Lager).
4. **Schritt 3, Holz zuerst** (`de_03_step3_wood_first.jpg`): Nur „Bauen“ ist im Spotlight. Im Baumenü (`de_03c_build_menu.jpg`) ist nur die Holzfällerhütte wählbar, der Rest grau; darunter „kommt später“. Beim Setzen:
   - am Wäldchen (`de_03f_trees_in_reach.jpg`): „24 Bäume in Reichweite“, der helle Rahmen der Reichweite und drei grüne Vorschläge;
   - auf der Wiese (`de_03d_no_trees_warning.jpg`): die Warnung „Kein Baum in Reichweite!“ steht jetzt frei neben dem Bauplatz, nicht mehr hinter der Hinweiszeile;
   - außerhalb (`de_03e_outside_territory.jpg`): „Hier nicht: außerhalb deines Landes“, mit dem Satz zu den Grenzlaternen.
   - Der Bauplatz selbst ist kräftiger gefärbt und hat einen weißen Rand mit dunkler Kante.
5. **Schritt 4, Ein Weg zur Halle** (`de_04_step4_road.jpg`): Der Text führt die Träger ein: „Waren tragen die Träger: Zwerge, die nur über Wege laufen.“ Die Zeiger „Wegfeuer der Hütte“ und „Wegfeuer der Halle“ sitzen jetzt direkt auf dem Korb des Pfahls. Die Hütte steht im Spotlight; nach dem Klick ist „Verbinden“ im Spotlight (`de_04b_hut_blocked_no_road.jpg`).
6. **Schritt 5, Das erste Holz** (`de_05_step5_first_wood.jpg`): Nur der 4×-Knopf ist im Spotlight. Das Statusschild sitzt jetzt direkt über dem Dach (`de_05b_site_being_built.jpg`). Der Baufortschritt liegt als helle Leiste am Boden vor der Baustelle (`close_site_progress.jpg`), nicht mehr als dunkle Planke hoch darüber.
7. **Schritt 6, Bretter** (`de_06_step6_planks.jpg`, `de_06a_workshop_tab.jpg`, `de_06a2_sawmill_entry.jpg`): Der Reiter „Werkstätten“ leuchtet zuerst, dann das Sägewerk. Der Text sagt: „Du findest es unter ‚Werkstätten‘.“ Danach Sägewerk im Spotlight (`de_06b2_sawmill_spotlight.jpg`) und „Verbinden“ (`de_06c_sawmill_connect.jpg`).
8. **Ende** (`de_07_done.jpg`): „Gut gemacht!“ mit „Erstes Brett gesägt · Bretter im Lager: 10 ✓“ und dem nächsten Ziel „Baue mit deinen Brettern eine Försterhütte am Wäldchen …“. Die Zielzeile oben zeigt danach „Nächstes Ziel: eine Försterhütte am Wäldchen“ (`de_11_free_play_resting.jpg`), bis eine Försterhütte steht.
9. **Hilfe** (`de_08_help.jpg`): neu „Zwerg anklicken …“, die Grenze, und die richtige Tempo-Zeile „Taste 1 = 1-fach, Taste 2 = 2-fach, Taste 3 = 4-fach; Leertaste = Pause“.
10. **Freies Spiel:**
    - `de_12_selection_outline.jpg`: das Sägewerk ausgewählt, hellgoldener Rahmen.
    - `de_13_dwarf_bio.jpg`: ein Träger („Hrolf · Träger, trägt Waren zum nächsten Wegfeuer, trägt Bretter“), sein Weg blau. `de_13b_dwarf_bio_later.jpg`: derselbe Zwerg 1,5 Sekunden später im Laufen erneut angeklickt.
    - `de_13c_dwarf_workplace.jpg`: ein Baumeister an der neuen Försterhütte; die Baustelle ist blau umrandet.
    - `de_14_placement_woodcutter.jpg`, `de_14b_placement_forester.jpg`: Reichweite und Vorschläge (Förster: „Guter Platz · 246 freie Felder“).
    - `de_15_build_teaser_gather.jpg`, `de_15_build_teaser_make.jpg`: graue Gebäude „kommt später“.

## Behoben

**Aus der UI-Runde 2:**
- Kein-Baum-Warnung jetzt sichtbar (der Kasten weicht den Feldern der Oberfläche aus).
- Zeiger in Schritt 4 auf den Wegfeuern, nicht auf den Gebäuden.
- Statusschilder direkt über dem Dach.
- Grenze am Start (Schritt 1) und in der Hilfe erklärt.
- Bauplatz: kräftigere Farbe und Umriss.
- „Große Halle“ und „HERZFEUER“ überlappen nicht mehr (Herzfeuer-Schild in Schritt 2 aus).
- Wörter: Herzglut nur noch einmal mit Zahl; „Nahrung“ zeigt beim Darüberfahren die Sorten („Fisch 10“), Fisch im Lager hat das Nahrungs-Bild; „Träger“ in Schritt 4 eingeführt; überall „du“ (Halle, Wissen); Tempo-Tasten in Hilfe und Tooltip richtig.
- Tutorial-Ende mit Brett-Bestätigung und nächstem Ziel; Schritt 6 zeigt auf den Reiter Werkstätten.
- Glut-Orange nur noch an Feuer: Auswahl, Tutorial-Hervorhebung und Start-Knopf sind hellgold.
- Pause-Schild dunkel; Schilder in der Welt größer (15/17 statt 13/15 Punkte).

**Aus der Assets-Runde 3:**
- Zeiger und Schilder auf dem Pfahl-Korb.
- Grenze bei Tag: Laternen etwas höher und eine feine warme Linie zwischen ihnen; abgetrennte Gebietsteile türkis und breiter (Vorschlag).
- Zwerge im Hof verteilt: drei Reihen im Hof, zwei Spalten an der offenen Ostseite, ein Bogen vor dem Tor (`sheet7`).
- Baufortschritt am Boden der Baustelle.
- Wegfeuer an einer Tür stehen voll groß auf einer kleinen Steinstufe; freie Wegfeuer sind etwas kleiner (82 %).
- **Tafel nachts:** Das Feuerlicht sitzt tiefer und vor der Grube, die Glutsteine glühen nachts tiefrot und schwächer. Gemessen (Abschalt-Bilder `session/diag_tablet_night_without_*.jpg`) blendeten außerdem die kleinen Lampen vor jedem Stein und ein weißes Werkstattlicht in der Halle die Tafel; beide sind an der Halle aus, das Hallenfeuer brennt nachts mit gut 260 statt 525 Lumen. Vergleich vorher/nachher: `sheet6_tafel_nacht.jpg`.

**Nicht behoben / offen:**
- Der Rahmen um die Reichweite ist ein Quadrat, weil das Spiel ein Quadrat absucht (keinen Kreis).
- Die grauen Gebäude „kommt später“ kommen aus der Freischalt-Liste des Spiels; manche (zum Beispiel „Wehr“) sind noch keine Stufe-1-Gebäude.
- „Development Build“ unten rechts bleibt (Bauweg des Spiels).
- Die Oberfläche bleibt Stil C; neue Grafik gab es nur im Rahmen des Erreichbaren (Rahmen, graue Knöpfe).
- Bei 1280x720 deckt der vollste Bildschirm (Baumenü, Infofeld, Tutorial mit Tipp gleichzeitig) 53 % ab; in Ruhe 19,5 %.

## Zahlen

- **Tests:** Unity EditMode 2033 gesamt, 2010 bestanden, 23 übersprungen, 0 fehlgeschlagen (vorher 2024; 9 neu). Spielkern 1918 von 1918. AssetGen 277 von 277.
- **Neue Tests:** Klick-Sperre des Tutorials durch das echte Eingabesystem, Erlaubnis-Tabelle je Schritt, Zwerg anklicken (auch beim Laufen), Steckbrief aus dem echten Spiel (Ruhender, Baumeister, Holzfäller, Träger), Platzvorschläge vom Spiel geprüft und nach Bäumen sortiert, Reichweitenrahmen gleich dem Suchfeld, „Wegfeuer“ in allen Texten, Tempo-Tasten, verteilte Hof-Plätze.
- **Textprobe** (`round3/fit/`): 18 Fälle, 0 Funde.
- **Bedeckung in Ruhe** (1920x1080, `session/coverage.txt`): mit Tutorial-Karte 11,1 %, freies Spiel 6,5 %, Zwerg-Steckbrief 10,8 %.

## Fragen an dich

1. **Spotlight und Sperre:** Passt die Stärke der Abdunkelung? Soll die Hilfe während des Tutorials offen bleiben (jetzt gesperrt)?
2. **Zwergennamen:** Die kleine Namensliste (zum Beispiel Hrolf, Brokk, Hilda, Sigrun) ist ein Vorschlag. Passt sie?
3. **Arbeitsplatz-Farbe Blau** und Auswahl in Hellgold: so lassen?
4. **Grenze bei Tag:** höhere Laternen und feine Linie, reicht das? Türkis für abgetrennte Teile?
5. **Nächstes Ziel Försterhütte** nach dem Tutorial: passt das?
6. **Tafel nachts:** Lesen sich die 2, 6 und 12 Steine jetzt gut genug (`sheet6`)?
