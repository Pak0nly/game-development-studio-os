# Wegesystem Stufe 1, Runde 3: was sich nach deinem Anspielen geändert hat

Starten: `C:\GameDev\Hearthlands\Unity\Builds\HL-Game-ways-r3\Wegesystem Tag ohne Strassen spielen.cmd`
(der Vergleichslauf mit den Baustellen des Wegetests liegt daneben).

## Deine Punkte

1. **Steinbruch kann nicht gebaut werden.** Ursache: Der Steinhauer durfte höchstens 28 Felder zu Fuß zum Fels gehen.
   Der einzige Fels liegt jenseits des Bachs am Wasserfall, der Weg führt über die Furt. Vom Startgebiet aus waren
   damit nur 14 von 300 möglichen Plätzen erlaubt, ein schmaler Streifen an der Furt. Mit deiner Startkamera und dem
   Baumenü abgetastet: 27 von 1218 Bildpunkten grün, 691 rot mit "kein Fels in Reichweite".
   Jetzt: höchstens 48 Felder (der weiteste Weg aus dem Startgebiet). Damit ist jeder Platz im Startgebiet erlaubt,
   714 Bildpunkte grün. Über das Baumenü neben dem Herzfeuer gesetzt: 35 Sekunden nach dem Klick fertig, der
   Steinhauer bringt Steine. Ein Hin- und Rückweg dauert bis zu etwa 2,5 Minuten. Statt des Rings zeigt die Vorschau
   jetzt den Laufweg zum Fels.
   Bilder: `vergleich/steinbruch_menue_runde2_gegen_runde3.jpg`, `vergleich/steinbruch_naechster_gruener_platz_runde2_gegen_runde3.jpg`, `vergleich/steinbruch_runde3_gebaut.jpg`.
2. **Waren kommen nicht ins Lager.** Jetzt bringen freie Zwerge den Überschuss ins nächste Lager, wenn es höchstens 24 Felder entfernt ist:
   - alles, was Holzfäller, Jäger und Steinbruch liefern und gerade niemand braucht;
   - von einem Feuer alles über seinen Bedarf plus 2 (das Herzfeuer behält 8 Stämme, die übrigen 4 vom Start gehen ins Lager).
   Ein Lager fasst 40 je Ware. Baustellen, Feuer und Werkstätten holen aus dem nächsten Vorrat, auch aus dem Lager. Im Feld rechts steht, was im Lager liegt.
   Nach 11 Minuten freiem Spiel: 32 Stämme und 10 Wild im Lager. Bild: `vergleich/lager_runde3_11min.jpg`.
3. **Zwerge in- und übereinander.** Ein wartender Zwerg tritt einen halben Schritt zur Seite, wenn schon einer dort steht.
   Gehende Zwerge weichen beim Vorbeigehen seitlich aus.
4. **Stämme 50 % länger:** der getragene Stamm ist eineinhalbmal so lang.
5. **Holzfäller ruckelt.** Ursache: Seine Bewegung lief nur in den 10 Spieltakten je Sekunde.
   Jetzt läuft sie mit der Bildrate, ebenso Bauen, Steinhauen und der fallende Baum. Clip: `clips/A1_hacken_runde3_30fps.mp4`.
6. **Gebäude stehen im Hang.** Jetzt wird auf der hohen Seite der Boden unter dem Gebäude etwas abgetragen, mit kurzer Böschung.
   Auf der niedrigen Seite steht es auf einem Steinsockel, und es wird keine Erde aufgeschüttet (also keine Rampen wie in Runde 1).
   Drei Hänge, Runde 2 gegen Runde 3: `vergleich/hang_1_...`, `hang_2_...`, `hang_3_runde2_gegen_runde3.jpg` (Neigung klein, mittel, stark).
7. **Zweiter Holzfäller und Förster nur als Umriss.** Ursache: Das alte Spiel lehnt ein Gebäude so dicht am Nachbarn ab.
   Jetzt zeichnet das Wegesystem jedes Gebäude selbst mit seinem Modell, egal wie viele. Bild: `vergleich/zweite_gebaeude_runde3.jpg`.
8. **Kiesel als Bodentextur.** G mischt jetzt ein wenig von der Kies-Bodentextur in die Mitte ausgetretener Pfade, fleckig und unregelmäßig.
   Die braunen Klötze sind weg. Beim Start ist es aus. Bilder: `vergleich/kies_aus_gegen_an_*.jpg`.
9. Fortschrittsbalken: kommen im nächsten Auftrag mit der Spieloberfläche.

## Prüfungen

Spielkern-Tests (dotnet): 2214, davon 2212 bestanden. Die 2 Fehler sind dieselben alten wie vor Runde 1. Unity-Tests: 2527, keiner fehlgeschlagen.
Neue Tests für Steinbruch, Lager und Ausweichen. Wiederholbarkeit (Doppellauf, Speichern und Laden) ist geprüft.
Vergleichslauf mit den Baustellen des Wegetests: mit Lager 345 statt 256 Tragegänge in 32 Minuten, gleich viele Baustellen fertig.

## Fragen an dich

- Steinbruch: Passen 48 Felder Laufweg (bis etwa 2,5 Minuten hin und zurück), oder soll lieber Fels näher an das Startgebiet?
- Lager: Passen die Grenzen? Das Feuer behält 2 über seinen Bedarf, das Lager fasst 40 je Ware und nimmt nur aus höchstens 24 Feldern Entfernung.
- Waren, die an Türfackeln und im Lager liegen, sind im Spiel nicht zu sehen (die Stapel des Wegetests sind noch nicht übernommen). Sollen dort Stapel liegen?
- Gebäude, die das Wegesystem selbst zeichnet, haben noch keinen Rauch und kein Feuerlicht.
- Sockel am Hang: Passt ein Steinsockel auch unter Holzhütten, oder lieber Holz?
- Kies: Ist die Menge richtig, oder soll es mehr oder weniger sein?
