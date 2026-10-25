# Runde 1: Oberfläche für den Freunde-Test (HL-UI-TESTER-PROTOTYPE-V1)

Stand: 24.10.2026. Alles hier ist ein Vorschlag, nichts ist beschlossen. Das Spiel selbst wurde nicht verändert.

## Kurz

- Ich habe das aktuelle Spiel so durchgespielt, wie es ein Freund zum ersten Mal sieht, und jeden Bildschirm festgehalten (12 Bilder mit Befund).
- Das größte Problem ist nicht das Aussehen, sondern dass der Tester **allein gelassen** wird: kein Ziel in Worten, Entwicklerzahlen auf dem Schirm, über 40 Gebäude mit internen Namen, nur Englisch. Und: der Holzfäller lässt sich mitten auf die Wiese setzen, wo kein Baum steht; er arbeitet dann nie, und das Spiel sagt es nicht verständlich.
- Drei Stilrichtungen liegen als Bilder im echten Spielbild vor, je Deutsch und Englisch, bei Tag und bei Nacht, dazu eine Textprobe über drei Auflösungen und drei Interface-Größen.
- Meine Technik-Empfehlung: **UI Toolkit** (in Unity schon vorhanden), die beiden Sprachen über eine **eigene kleine Texttabelle**; Unitys Übersetzungspaket erst später (es bräuchte eine Installation).
- Das Musterprogramm zum Selbst-Umschalten: `C:\GameDev\Hearthlands\Unity\Builds\HL-UiLook-r1\HLUiLook.exe`.

## 1. Was ein Tester heute erlebt (Audit)

Jedes Bild steht neben seinem Befund in `round1/audit/` (eine Bildleiste pro Zustand). Die Befunde als Text: `round1/audit_findings.txt`.

| Zustand | Bild | Was ein Freund mit etwas Genre-Erfahrung nicht versteht oder nicht kann |
|---|---|---|
| Startbildschirm | `audit/a01_menu_strip.jpg` | nur Englisch, keine Sprachwahl, keine Einstellungen, "blockout build" und "Testtal" sagen nichts |
| Spielstart | `audit/a02_start_strip.jpg` | Entwicklerwerte oben (Tick, hash, pending, "Goal first_playable 1/3"); über 40 Gebäude mit internen Namen, Liste läuft aus dem Bild, zwei Namen abgeschnitten; Vorrat mit internen Namen und vielen Nullen; Herzglut und Zwerge fehlen dort; Hilfe als Textblock |
| Erste Minute | `audit/a03_first_minute_strip.jpg` | nichts sagt, was man zuerst tun soll |
| Holzfäller wählen | `audit/a04_build_tool_strip.jpg` | Auswahl kaum markiert; Bauplatz ein grüner Würfel; ob Bäume in Reichweite sind, zeigt das Spiel nicht; Technik im Mauszeiger-Schild |
| Bauen verweigert | `audit/a05_refused_strip.jpg` | Grund klein, auf Englisch, mit Zahl davor; die orange Grenze ist nicht erklärt |
| Baustelle | `audit/a06_site_placed_strip.jpg` | keine Rückmeldung, kein Hinweis auf den nächsten Schritt (Weg) |
| Weg ziehen | `audit/a07_road_drawing_strip.jpg` | der Weg-Vorschlag ist gut; wie man beginnt und beendet, steht nur im Hilfetext |
| Weg fertig | `audit/a08_road_built_strip.jpg` | kein Lob, man sieht nicht, ob die Hütte angeschlossen ist |
| Hütte angeklickt | `audit/a09_select_site_strip.jpg` | sie arbeitet nicht ("idle (waiting for input or a node)"): kein Baum in Reichweite; Infofeld voller Technik |
| Halle angeklickt | `audit/a10_select_hall_strip.jpg` | das Herzglut-Thema steht versteckt in Zeile 11 eines Textblocks voller Fachwörter; Text läuft unten heraus |
| Pause | `audit/a11_pause_strip.jpg` | Pause gut erreichbar; "Step" unerklärt; das Bild zeigt nicht deutlich "pausiert" |
| Zwei Minuten später, 8-fach | `audit/a12_fast_later_strip.jpg` | der Holzfäller arbeitet immer noch nicht, die Stämme sinken; der Tester merkt nicht, dass etwas falsch läuft; kein Ziel, kein Ende |

**Vergleich mit dem Konzept und den Entscheidungen.** Das Konzept will am Anfang nur ein Ziel, ein paar Vorräte und die Tempoknöpfe; heute steht alles gleichzeitig da. Es will Zustand zuerst in der Welt und Zahlen nur auf Wunsch; heute sind es fast nur Zahlen. Es will Tempo 1-, 2- und 4-fach im Spiel; heute gibt es auch 8-fach. Die Entscheidung zum Aussehen (ein kleines HUD, das warme Herzfeuer in der Mitte) ist heute nicht erfüllt: das HUD bedeckt etwa ein Drittel des Bildes und das Herzfeuer ist nicht als solches zu erkennen.

## 2. Was ein Tester braucht (Liste)

**Muss für den Test mit Freunden** (ohne das scheitert der Test oder misst nur Verwirrung):

1. **Startbildschirm mit Sprachwahl Deutsch/Englisch.** Die Freunde sind Deutsche; die Wahl muss vor dem ersten Text kommen.
2. **Ein Ziel in Worten mit einem kleinen Tutorial** (Abschnitt 3). Ohne Ziel weiß der Tester nach dem Start nicht, was er tun soll (Bild a03).
3. **Ein kleines Baumenü** mit nur den Gebäuden des Tutorials, mit deutschen und englischen Namen, Kosten als Symbole. Die 40er-Liste erschlägt (Bild a02).
4. **Ein Gebäude-Infofeld in Sätzen**: was es tut, ob es arbeitet, und wenn nicht, **warum** in einem Satz ("Kein Baum in Reichweite"). Sonst bleibt der Fehler aus Bild a09 unbemerkt.
5. **Ein Hinweis beim Bauen, ob der Platz taugt** (z. B. "3 Bäume in Reichweite" am Bauplatz des Holzfällers). Das ist der häufigste erwartbare Fehler.
6. **Eine Vorratsleiste** mit Stämmen, Brettern, Steinen, Nahrung, Herzglut und Zwergen, mit Symbol und Namen. Die Herzglut ist das Thema des Spiels und muss sichtbar sein.
7. **Pause und Tempo** (1-, 2-, 4-fach) gut sichtbar, mit deutlichem "Pausiert".
8. **Eine kurze Steuerungshilfe** (Kamera, Abbrechen, Weg bauen), einmal am Anfang und jederzeit über einen Knopf.
9. **Kleine Einstellungen**: Interface-Größe (90/100/125 %), Fenster oder Vollbild und Auflösung. Lautstärke entfällt, solange das Spiel keinen Ton hat.
10. **Neu starten und Beenden** aus dem Spiel heraus (heute nur "Menu").
11. **Alle Entwicklerwerte weg** (Tick, hash, pending, Debug-Schalter, Koordinaten), höchstens hinter einer Entwicklertaste.

**Schön zu haben:**

- Gebäude zeigen ihren Zustand im Bild (Rauch, Stoppschild) statt nur in Zahlen.
- Ein "Verbinden"-Knopf im Infofeld der neuen Hütte (baut den kürzesten Weg).
- Kurze Meldungen ("Der erste Stamm ist in der Halle") statt einer Zeile mit Tickzahl.
- Ein Fragebogen-Knopf oder ein Hinweis, wo der Tester Rückmeldung gibt.
- Die Kamera beim Start etwas schräger, damit man das Herzfeuer sieht.

**Später:** Minikarte, Kategorien im Baumenü, Sagenbuch, Militär, Gelübde, Tastenbelegung ändern, Farbsehmodi im Menü, Speichern und Laden, Spielstände, Ton.

## 3. Das kleine erste Tutorial (Deutsch und Englisch)

Quelle: Mission 1 (Schritte 1 bis 6) und die Freischalt-Reihenfolge, gekürzt. Ein Ziel nach dem anderen; jeder Schritt gilt als erledigt, sobald der Spieler das Genannte tut. Die Kamera bewegt sich nie von selbst.

| # | Deutsch | English | Erledigt, wenn |
|---|---|---|---|
| 1 | **Schau dich um.** Das ist das Herzfeuer in der Großen Halle. Bewege die Ansicht mit WASD und zoome mit dem Mausrad. | **Look around.** This is the Heart Fire in the Great Hall. Move the view with WASD and zoom with the mouse wheel. | die Ansicht wurde bewegt und gezoomt |
| 2 | **Dein Lager.** Klicke auf die Große Halle. Hier liegt alles, was ihr mitgebracht habt, auch die Herzglut. | **Your store.** Click the Great Hall. Everything you brought is kept here, the embers too. | die Halle ist angeklickt |
| 3 | **Holz zuerst.** Öffne "Bauen" und setze eine Holzfällerhütte an den Waldrand. Der Bauplatz zeigt dir, wie viele Bäume er erreicht. | **Wood first.** Open "Build" and place a woodcutter's hut at the edge of the forest. The building spot shows how many trees it reaches. | die Baustelle steht |
| 4 | **Ein Weg zur Halle.** Ziehe einen Weg von der Fahne der Hütte zur Fahne der Großen Halle. Erst dann tragen die Zwerge. | **A road to the hall.** Draw a road from the hut's flag to the Great Hall's flag. Only then will the dwarves carry. | die Fahnen sind verbunden |
| 5 | **Das erste Holz.** Ein Träger bringt die Stämme über den Weg. Wenn du willst, drehe das Tempo hoch. | **The first wood.** A carrier passes the logs along the road. Speed the game up if you like. | der erste Stamm ist in der Halle |
| 6 | **Noch ein Holzfäller.** Setze eine zweite Hütte neben die erste. Zwei Hütten können sich eine Fahne teilen. | **Another woodcutter.** Place a second hut next to the first. Two huts can share one flag. | die zweite Baustelle steht |
| 7 | **Bretter.** Baue ein Sägewerk und verbinde es mit einem Weg. Es macht aus Stämmen Bretter. | **Planks.** Build a sawmill and connect it with a road. It turns logs into planks. | das erste Brett ist im Lager |
| Ende | **Gut gemacht!** Du weißt jetzt, wie es zusammenhängt: Gebäude, Fahne, Weg, Träger. Spiel frei weiter. | **Well done!** Now you know how it fits together: building, flag, road, carrier. Play on freely. | - |

Hinweise dazu: nach 90 Sekunden ohne Fortschritt eine zusätzliche Zeile (z. B. bei Schritt 3: "Bäume stehen am Rand des Tals."). Der Schritt-Text steht unten in der Mitte (wie im Muster), das Ziel in einer Zeile oben. Schritt 1 nennt kein "Drehen", weil die Kamera sich nicht dreht.

## 4. Technik-Empfehlung

| | UI Toolkit | uGUI (Canvas) | Heutiges IMGUI (`OnGUI`) |
|---|---|---|---|
| Vorhanden | ja (Modul in Unity) | ja (Paket `com.unity.ugui`) | ja |
| In diesem Muster bewiesen | **ja**: alle drei Richtungen, beide Sprachen, drei Auflösungen, drei Größen, im fertigen Programm mit HDRP | nein | (das heutige HUD) |
| Rahmen, Holz, Eisen | 9-Slice-Rahmen direkt im Stil, im Muster aus Code erzeugt | 9-Slice-Bilder, ebenfalls gut | kaum gestaltbar |
| Skalierung | ein Wert für das ganze Interface; nach Höhe, mit Untergrenze (Konzept 8.2) | Canvas Scaler, ebenso gut | Schriftgröße von Hand je Element |
| Text und Umlaute | Unitys Textsystem; ä, ö, ü, ß im Muster richtig; Textmessung zur Prüfung vorhanden | TextMeshPro (braucht ein Import der Grundressourcen) | eingebaute Schrift, keine Prüfung |
| Klicks auf die Welt | das Spiel muss fragen, ob der Zeiger über der Oberfläche ist (heute fragt es das IMGUI-HUD) | dasselbe über das EventSystem | heute gelöst |
| Risiko | neues System für das Spiel; die Klickfrage muss sauber gebaut werden | älterer Weg, mehr Einzelteile (Canvas, EventSystem, TMP) | sieht immer nach Entwickler aus, Textanpassung schwer |

**Empfehlung: UI Toolkit** für die Testfassung, das heutige IMGUI bleibt nur für Entwicklerfelder hinter einer Taste. Gründe: im Muster bewiesen (mit HDRP, ohne Probleme beim Bauen), ein einziger Skalierungswert für die Interface-Größe, Textmessung für die Textprobe eingebaut, und das Konzept nennt es schon als Kandidaten.

**Risiken:** (1) Das Spiel muss vor jedem Klick in die Welt fragen, ob der Zeiger auf einem Feld liegt, sonst baut ein Klick auf einen Knopf auch in der Welt. (2) Eine geänderte Skalierung wurde in meinem ersten Lauf nicht sofort übernommen; ich lege dafür das Feld neu an, das ist einfach, aber zu wissen. (3) Ohne Unitys Standard-Thema muss jeder Stil selbst gesetzt werden (im Muster so gemacht). (4) Die eingebaute Schrift hat keinen echten Fettschnitt; fette Titel sehen kaum fetter aus.

**Sprachen:** Unitys Übersetzungspaket (Localization 1.5.13) ist **nicht installiert**; es liegt nur als Datei beim Unity-Editor bereit und bräuchte zusätzlich Addressables und Newtonsoft Json. Eine Installation braucht deine Zustimmung. Für zwei Sprachen und etwa 100 Texte empfehle ich stattdessen **eine eigene kleine Texttabelle** (eine Textdatei mit Schlüssel, Deutsch, Englisch), so wie im Muster. Das Paket lohnt sich erst bei mehr Sprachen oder Übersetzern von außen.

**Schrift:** Im Projekt liegt **keine eigene Schrift**. Das Muster nutzt Unitys eingebaute Schrift (eine Arial-ähnliche). Sie ist gut lesbar, aber nicht zwergisch. Kandidaten zum Freigeben (alle kostenlos, Lizenz SIL Open Font License, alle mit ä, ö, ü, ß), nicht installiert:
- für Titel: **Cinzel** (in Stein gemeißelte Großbuchstaben, passt zu Schiefer), **Alegreya SC** (kräftig, alt), **IM Fell English SC** (alter Buchdruck, passt zu Holz und Leder);
- für Fließtext: **Alegreya Sans** oder **Fira Sans** (sehr gut lesbar, auch klein);
- eher nicht: verzierte Schriften wie MedievalSharp oder Uncial Antiqua (schwer lesbar, widerspricht "einfach und verständlich").

## 5. Die Stilrichtungen

Alle drei zeigen denselben Inhalt: oben die Leiste mit Vorräten und Tempo, darunter das Ziel, links das offene Baumenü, rechts das Infofeld einer Holzfällerhütte, unten in der Mitte ein Tutorial-Hinweis. Kamera und Licht des echten Spiels (Testtal). Die "Nacht" ist nur für die Probe gedreht (das Spiel hat noch keinen Tag-Nacht-Wechsel): dunkles, kaltes Licht.

### A: Eisen und Glut
Dunkle Eisenplatten mit Nieten, innen ein glühender Glutrand; der gewählte Knopf glüht orange.
Bilder: `styles/A_iron_de_day_1920x1080.jpg`, `styles/A_iron_en_day_1920x1080.jpg`, `styles/A_iron_de_night_1920x1080.jpg`, `styles/A_iron_en_night_1920x1080.jpg`.
- Stärken: am nächsten am Herzfeuer-Thema; sehr gute Lesbarkeit bei Tag und Nacht; die Glut verbindet Oberfläche und Spielbild.
- Risiken: viel Orange; Warnungen (auch orange) heben sich weniger ab; wirkt etwas schwer.

### B: Holz, Leder und Messing
Rahmen aus Holz mit Maserung, Felder aus Leder mit Naht, Messingecken; der gewählte Knopf ist Messing.
Bilder: `styles/B_wood_de_day_1920x1080.jpg`, `styles/B_wood_en_day_1920x1080.jpg`, `styles/B_wood_de_night_1920x1080.jpg`, `styles/B_wood_en_night_1920x1080.jpg`.
- Stärken: warm und gemütlich, passt zu den Holzhäusern; Warnungen in Orange heben sich gut ab.
- Risiken: die Naht und die Maserung sind bei kleiner Größe unruhig; braun auf grüner Wiese hat weniger Kontrast als dunkles Eisen.

### C: Schiefer und Runen
Blaugraue Schiefertafeln mit eingeritzter Doppellinie und glühenden Runenzeichen in den Ecken; Titel in Großbuchstaben; der gewählte Knopf ist heller, frisch gehauener Stein; Feuer nur in den Glut-Balken.
Bilder: `styles/C_slate_de_day_1920x1080.jpg`, `styles/C_slate_en_day_1920x1080.jpg`, `styles/C_slate_de_night_1920x1080.jpg`, `styles/C_slate_en_night_1920x1080.jpg`.
- Stärken: ruhig, kühl, klar; das Feuer fällt dadurch am stärksten auf (Glut-Balken, Runen); passt zu "Stein und Runen" der Zwerge.
- Risiken: kühl statt warm; Großbuchstaben machen deutsche Titel lang ("HOLZFÄLLERHÜTTE"); ein Runen-Look braucht später eine passende Schrift.

## 6. Textprobe (passt der Text?)

Jede Richtung und Sprache bei 1280x720, 1920x1080 und 2560x1440, jeweils mit Interface-Größe 90, 100 und 125 %: `fit/<Richtung>_<Sprache>_fit_sheet.jpg` (Übersicht) und `fit/fit_report.txt` (jede Stelle). Die engste Lage (1280x720 bei 125 %) zusätzlich in voller Größe: `fit/*_1280x720_125.jpg`.

Skalierung wie im Konzept: (Bildhöhe / 1080) x Interface-Größe, nie unter 0,95. Bei 1280x720 greift daher immer die Untergrenze: die drei Größen sehen dort gleich aus.

**Ergebnis:** In allen 54 Fällen (3 Richtungen x 2 Sprachen x 3 Auflösungen x 3 Größen) ist kein Text abgeschnitten oder gequetscht, nichts liegt außerhalb des Bildes, kein Feld überdeckt ein anderes. Dazu die 12 großen Bilder bei 1920x1080 (Tag und Nacht): ebenfalls ohne Fund.

| Auflösung | 90 % | 100 % | 125 % |
|---|---|---|---|
| 1280x720 | 14,3 px | 14,3 px | 14,3 px |
| 1920x1080 | 14,3 px | 15,0 px | 18,8 px |
| 2560x1440 | 18,0 px | 20,0 px | 25,0 px |

(kleinste Schrift auf dem Schirm in echten Pixeln; Fließtext ist im Muster 15 bis 18 px groß, Titel 21 bis 22 px.) Die Vorgabe "etwa 14 px Fließtext bei 1080p" und die Konzept-Grenze von 13 px werden überall eingehalten.

**Was die Probe gefunden hat (im ersten Lauf, dann behoben):**
- Ohne die Untergrenze des Konzepts passte die obere Leiste bei 1280x720 mit 125 % nicht: alle Vorräte und Tempoknöpfe wurden zusammengedrückt (17 bis 19 Stellen je Sprache). Mit der Untergrenze bleibt das Interface bei 1280x720 in allen drei Größen gleich groß und passt.
- "Ziel:" wurde neben dem langen deutschen Ziel zusammengedrückt (jetzt fest).

**Was auffällt, obwohl alles passt:**
- Bei 1280x720 bedeckt das Muster fast die Hälfte des Bildes. Das Konzept will höchstens 20 % in Ruhe (30 % mit offenem Infofeld). Für die Testfassung heißt das: Baumenü und Infofeld nur offen, wenn sie gebraucht werden, und bei kleinen Fenstern eine kompakte Form.
- Das Ziel bricht bei 1280x720 in beiden Sprachen in zwei Zeilen um; das ist lesbar, aber ein Hinweis, Ziele kurz zu halten.
- Deutsch ist etwas länger als Englisch (z. B. "Rechte Maustaste: abbrechen" 200 px gegen "Right mouse button: cancel" 182 px), aber nirgends kritisch.
- Kontrast: bei Tag und bei Nacht in allen drei Richtungen gut lesbar, weil die Felder fast deckend sind. Grenzfall: die orange Warnschrift in Richtung A liegt nah an der Glutfarbe des Rahmens.

## 7. Fragen an dich

1. **Welche Richtung** (A Eisen und Glut, B Holz/Leder/Messing, C Schiefer und Runen) soll gebaut werden, oder eine Mischung (z. B. Schiefer-Felder mit Glut-Rand)?
2. **Schrift:** Darf ich eine der genannten freien Schriften (OFL) ins Projekt legen? Mein Vorschlag: Alegreya Sans für Text und Cinzel oder Alegreya SC für Titel.
3. **Technik:** Einverstanden mit UI Toolkit und einer eigenen Texttabelle für Deutsch/Englisch (ohne Installation)?
4. **Tempo:** Im Spiel nur 1-, 2- und 4-fach (wie im Konzept), oder soll 8-fach für die Tester bleiben?
5. **Tutorial:** Passen die 7 Schritte, oder soll es noch kürzer sein (z. B. ohne Schritt 6)?
6. **Holzfäller ohne Bäume:** Soll das Spiel den Bau eines Holzfällers ohne Bäume in Reichweite verbieten, oder nur deutlich warnen? (Für die Tester wichtig, das ist eine Spielregel, keine reine Oberflächenfrage.)
7. **Testkarte:** Das Testtal hat Bäume fast nur am Rand. Soll für den Freunde-Test Wald näher an die Halle?

## 8. Das Musterprogramm

`C:\GameDev\Hearthlands\Unity\Builds\HL-UiLook-r1\HLUiLook.exe` starten (es lädt das Testtal und legt das Muster darüber):
- F1, F2, F3: Richtung A, B, C
- F4: Deutsch / Englisch
- F5: Interface-Größe 90 / 100 / 125 %
- F6: Auflösung 1280x720 / 1920x1080 / 2560x1440 (Fenster)
- F7: Tag / Nacht
- F8: Muster aus und an
- F9: das alte HUD zum Vergleich (dann ist das Spiel wieder normal bedienbar)
- WASD, Mausrad: Kamera
