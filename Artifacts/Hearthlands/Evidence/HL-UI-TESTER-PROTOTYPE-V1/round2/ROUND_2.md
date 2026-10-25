# Runde 2: Die Tester-Oberfläche im Spiel

Stand: 24.10.2026. Alle Texte, Farben, Abstände und das Tutorial sind Vorschläge.

## Kurz

- Die neue Oberfläche ist jetzt im echten Spiel: Startbildschirm, obere Leiste, Baumenü, Infofeld, Zeichen über Gebäuden, Tutorial mit 6 Schritten, Hilfe, Einstellungen und Spielmenü. Alles gibt es auf Deutsch und auf Englisch.
- Stil C mit Glut: dunkle Schiefertafeln mit gemeißelter Kante. Für Titel nehme ich Cinzel, für Text Alegreya Sans. Orange glüht nur, was mit Feuer zu tun hat: der Herzglut-Balken, der Rand der Auswahl, der Knopf, den man drücken soll, und Feuer-Hinweise.
- Neben der Großen Halle steht jetzt ein kleines Wäldchen. Dort findet der Holzfäller im Tutorial Bäume.
- Ein Klick auf die Oberfläche kommt nie in der Spielwelt an. Das ist zuerst gebaut und mit Tests geprüft.
- Das Spielprogramm liegt hier: `C:\GameDev\Hearthlands\Unity\Builds\HL-Player-ui-r2\Hearthlands.exe`.

## Was ein Tester jetzt sieht, Schritt für Schritt

Die Bilder liegen in `round2/session/`. Jedes gibt es auf Deutsch (`de_…`) und auf Englisch (`en_…`). Dazu gibt es einen Film pro Sprache (`first_session_de.gif`, `first_session_en.gif`).

1. **Startbildschirm** (`de_00_start.jpg`): Der Name mit zwei Flammen, darunter die Sprachwahl Deutsch oder English. Dann „Spiel starten“ (glüht), „Einstellungen“ und „Beenden“. Kein Entwicklertext.
2. **Spielbeginn** (`de_01_step1_look_around.jpg`): Oben steht eine schmale Leiste mit Menü, Stämmen, Brettern, Steinen, Nahrung, dem Herzglut-Balken („1/3“), den Zwergen („6/20“), Pause, 1×, 2×, 4× und Hilfe. Jeder Vorrat hat ein eigenes, eingeritztes Bild. Darunter steht die Zielzeile „Ziel: Schritt 1 von 6 · Schau dich um“. Über der Halle schwebt ein glühendes Herzfeuer-Zeichen mit Namen und aufsteigender Glut. Unten links liegen „Bauen“ und „Weg“, unten in der Mitte die Tutorial-Karte.
3. **Pause** (`de_01b_paused.jpg`): Ein großes Schild „PAUSIERT · Leertaste: weiter“.
4. **Schritt 1, Schau dich um**: Eine einzige Kamerabewegung oder ein Zoom reicht. Danach kommt sofort Schritt 2 (`de_02_step2_your_store.jpg`). Ein Pfeil zeigt auf die Große Halle.
5. **Schritt 2, Dein Lager**: Die Halle wird angeklickt. Rechts geht das Infofeld in Sätzen auf (`de_02b_hall_info_and_embers.jpg`): was die Halle ist, „Herzglut: 1 von 3. Sie hält deine Feuer am Leben.“, wie viele Zwerge es gibt und wie viele davon ohne Arbeit sind, und was im Lager liegt. Fährt man mit der Maus über die Herzglut oben, erklärt eine Zeile, was sie ist.
6. **Schritt 3, Holz zuerst** (`de_03_step3_wood_first.jpg`): Ein Pfeil zeigt auf die Bäume, der Knopf „Bauen“ glüht. Wer 90 Sekunden nicht weiterkommt, bekommt einen Tipp (`de_03b_stuck_hint.jpg`; im Film nach 1 Sekunde gezeigt). Das Baumenü (`de_03c_build_menu.jpg`) hat Reiter wie Sammeln, Werkstätten, Nahrung und Lager. Es zeigt nur, was man jetzt bauen kann, mit deutschen Namen und Kosten als Bild und Zahl. Die Holzfällerhütte glüht. Beim Setzen sagt der Bauplatz:
   - auf der Wiese ohne Bäume: „Kein Baum in Reichweite! Der Holzfäller hätte hier nichts zu tun.“ (`de_03d_no_trees_warning.jpg`; Bauen bleibt erlaubt);
   - außerhalb des Landes: „Hier nicht: außerhalb deines Landes“, dazu ein Satz zur Grenzlinie (`de_03e_outside_territory.jpg`);
   - am Wäldchen: „16 Bäume in Reichweite“ (`de_03f_trees_in_reach.jpg`).
7. **Schritt 4, Ein Weg zur Halle** (`de_04_step4_road.jpg`): Pfeile zeigen auf „Fahne der Hütte“ und „Fahne der Halle“. Über der Baustelle steht ein oranges Achteck: „Blockiert: kein Weg“. Ein Klick auf die Hütte (`de_04b_hut_blocked_no_road.jpg`) erklärt im Infofeld, warum, und der Knopf „Verbinden“ glüht. Er baut den Weg selbst.
8. **Schritt 5, Das erste Holz** (`de_05_step5_first_wood.jpg`, `de_05b_site_being_built.jpg`): Der 4×-Knopf glüht. Die Baustelle zeigt ihr Zeichen, dann fällt der Holzfäller den ersten Baum. Über der fertigen Hütte erscheint ein grünes Häkchen „arbeitet“.
9. **Schritt 6, Bretter** (`de_06_step6_planks.jpg` bis `de_06c_sawmill_connect.jpg`): Eine kleine Liste hakt sich selbst ab: Sägewerk gesetzt, mit dem Lager verbunden, erstes Brett gesägt.
10. **Ende** (`de_07_done.jpg`): Die Karte sagt „Gut gemacht!“ mit dem Knopf „Weiterspielen“. Danach zeigt die Zielzeile „Freies Spiel“ (`de_11_free_play_resting.jpg`).
11. **Hilfe, Menü, Einstellungen** (`de_08_help.jpg`, `de_09_menu.jpg`, `de_10_settings.jpg`):
    - Die Hilfe zeigt die Steuerung, erklärt die Herzglut und bietet „Tutorial neu starten“.
    - Das Menü hat Weiterspielen, Neu starten, Einstellungen, Zum Startbildschirm und Spiel beenden. Solange es offen ist, ist das Spiel pausiert.
    - Die Einstellungen bieten die Interface-Größe 90, 100 oder 125 % (wirkt sofort) und Fenster oder Vollbild.

Die alte Entwickler-Anzeige mit Tick, Hash und Debug-Schaltern erscheint nur noch mit der Taste F12.

## Die Zahlen

- **Tests:**
  - Unity-Tests: 1994, davon 1973 bestanden, 21 übersprungen (wie vorher), 0 fehlgeschlagen. Vorher waren es 1981 und 1960; 13 Tests sind neu.
  - Die 13 neuen Tests prüfen den Klick auf die Oberfläche, die Größe zur Laufzeit, die Texttabelle, die ehrlichen Zeichen, das Wäldchen und alle 6 Tutorial-Schritte. Die Schritte werden dazu im echten Testtal durchgespielt.
  - AssetGen: 277 von 277 bestanden.
- **Textprobe mit den echten Schriften** (`round2/fit/`): 2 Sprachen × 3 Auflösungen × 3 Größen, also 18 Fälle.
  - Ergebnis: 0 Funde. Nichts ist abgeschnitten, gequetscht oder außerhalb des Bildes, und keine Leiste läuft über.
  - Die kleinste Schrift misst 13,3 px bei 1280x720 und 14 px bei 1920x1080 mit 100 %.
  - Die Probe ist ein automatischer Lauf des Spielprogramms. Findet sie etwas, endet das Programm mit einem Fehlercode.
  - Bis zum dritten Lauf hat sie echte Fehler gefunden, die jetzt behoben sind. Bei 1280x720 lief die obere Leiste über; dort stehen jetzt nur Bild und Zahl, der Name erscheint beim Darüberfahren.
- **Wie viel vom Bild die Oberfläche bedeckt** (`round2/session/coverage.txt`; die Grenze ist 20 % in Ruhe):

  | Bildschirm | 1920x1080 |
  |---|---|
  | in Ruhe, mit Tutorial-Karte | 10,4 % |
  | in Ruhe, freies Spiel | 6,5 % |
  | Infofeld offen | 16 % |
  | Baumenü offen | 16,6 % |

  Bei 1280x720 sind es in Ruhe 18 %. Wenn dort alles gleichzeitig offen ist (Baumenü, Infofeld, Tutorial mit Tipp), sind es 45 %.

## Was noch fehlt oder auffällt

- **Nacht:** Das Spiel hat noch keine Nacht. Deshalb gibt es keine abgedunkelten Felder und keine Nachtbilder.
- **Glut-Licht:** Das warme Licht an der Halle sieht man bei Tag kaum. Sichtbar sind vor allem das glühende Herzfeuer-Zeichen und die Funken.
- **Bäume:** Das Wäldchen ist klein (11 Bäume; die Hütte erreicht 16). Bei 4-fach fällt der Holzfäller es bis zum Ende des Tutorials zum Teil ab. Danach zeigt die Hütte ehrlich „Keine Bäume“.
- **Zeichen über großen Gebäuden:** Über dem Sägewerk sitzt das Zeichen etwas neben der Mitte.
- **Unten rechts** steht „Development Build“. Das kommt vom bestehenden Bauweg des Spiels und gehört nicht zur neuen Oberfläche.
- **Ohne neue Spielregel:** Das Tutorial nutzt nur, was es im Spiel schon gibt, nichts aus dem geschützten Kern.

## Fragen an dich

1. **Wäldchen:** Reicht es so klein? Oder soll es größer sein? Oder soll ein siebter Schritt „Försterhütte“ zeigen, wie Bäume nachwachsen?
2. **Baumenü:** Es zeigt alles, was das Spiel zum Bauen freigibt, verteilt auf 5 Reiter (Sammeln, Werkstätten, Nahrung, Lager, Feuer). Soll es für die Tester auf die Tutorial-Gebäude gekürzt werden? Das bräuchte eine kleine Freischalt-Regel im Spielkern, und den darf ich in diesem Auftrag nicht ändern.
3. **Kleine Bildschirme:** Bei 1280x720 stehen in der oberen Leiste nur Bild und Zahl, die Namen erscheinen beim Darüberfahren. Ist das in Ordnung?
4. **Das Wort im Ziel-Kasten:** „Ziel: Schritt 3 von 6 · Holz zuerst“. Passt das, oder lieber nur der Titel des Schritts?
5. **Ist die Runde so freigegeben?** Dann wären die nächsten Schritte der Test mit Freunden und danach ein Fragebogen.
