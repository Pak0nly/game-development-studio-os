# HL-WAYS-CORRECTION-R7-V1 Fortschritt

Stand: fertig, angehalten am Prüfpunkt für dich. Nichts gepusht.

- verify-worker: PASS (Quittung d26a1256a807df540fee2d3f70774f0b25ad230a805c3760fd595cfcbda1ea3b), Ausgangsstand Spiel 6c24be7.
- Gelesen: Runde-6-Nachweise, Commits 8f2d09b und 6c24be7, Einebnung (HeightField.TreadPad, Sample), HD-600 bis HD-645.

## Befunde aus dem Lesen

- Sprung zwischen zwei Gebäuden: die Einebnung von Runde 6 ordnet jedes Feld genau einem Gebäude zu (dem nächsten); wo zwei Gebäude mit
  verschiedener Höhe nah beieinander stehen, wechselt die Zuordnung an einer Feldkante, und der Boden springt dort um den Höhenunterschied
  (gerade Kante, ein Block).
- Erdfleck und gerade Graskante am Sägewerk am Ufer: die Höhe von Runde 6 (der mittlere Wert des Rings) lag dort unter dem Ufer; der Boden
  wurde neben dem Wasser abgesenkt, und das Gras wächst nur auf Feldern ohne Wasser daneben nicht mehr, wenn der Boden unter Wasserhöhe liegt.
  Diese Felder enden an einer Feldkante: die gerade Graskante.
- Jäger: seine Hinweise zählten Bäume (wie der Holzfäller); Wild (die Wildplätze der Karte) kam nicht vor.
- "Zwerge 18/14": in der Aufnahme von Runde 6 kamen 8 Zwerge per Debug-Schritt dazu (für die Bilder der Arbeitsplätze), ohne auf freie Plätze
  zu achten: 8 + 8 + 2 Neue = 18 bei 14 Plätzen (Halle 8, kleines Feuer 6).

## Schritte

1. Spielkern: Steilheitsregel, Jagdgründe mit Wild, Start mit einem Arbeiter, Zwergzahl, Version und Tests.
2. Bild und Oberfläche: Einebnung ohne Sprung, Hinweise, Lagerträger-Anzeige, Brennstoff eingefüllt, Aufnahmen, Build.

## Erledigt

- Schritt 1 Spielkern: Commit e99007d. Schritt 2 Bild und Oberfläche: Commit 9bb46c3. Schritt 3 Aufnahmeweg: Commit 5c2ff22.
- dotnet voll 2243/2245 (die 2 bekannten), Unity voll 2548 bestanden, 0 Fehler, 43 übersprungen. Build HL-Game-ways-r7 (b2), r5 gelöscht.
- Aufnahmen r7_2 (Runde 7) und r7_3_r6look (Schalter von Runde 6), Vergleichsbilder, zwei Clips. RESULT.md, WORKER_RESULT.md.
