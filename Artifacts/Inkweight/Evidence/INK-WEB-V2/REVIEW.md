# INK-WEB-V2 Independent Review

Independent review verdict: PASS

Reviewer: QA Lead (independent Reviewer task; did not build the candidate).
Date: 2026-11-20, 00:54 to about 01:25 UTC, with one container restart at
about 00:59 (the first `verify.cjs` run and my first Ring run were killed and
were rerun in full). Candidate: `HEAD` `6c3e357` ("INK-WEB-V2 Worker result"),
working tree of `Projects/Inkweight/Source/WebPrototype` equal to `HEAD`.
Base: `b615254` ("INK-WEB-V1 Worker result", confirmed with `git log`).
Nothing was fixed by the Reviewer. Nothing was committed or pushed. This file
is the only repository file I created; the rebuild changed no dist file.

PASS means: the three important findings of the first review are fixed, I
found no blocker (no crash, dead end, lost input that stops play or unreadable
main screen), the automated check passes in all six setups, and the page rules
hold. Two new important findings (a misleading confirmation text on the
"Ende" buttons, and the build folder not being under version control) and six
minor findings remain; none of them stops play.

## What I ran (real output)

### 1. Rebuild and reproducibility

```text
$ cd Projects/Inkweight/Source/WebPrototype
$ sha256sum dist/*   (before)
271bf559d3d615202007ab18a1006250aac88fc5ef6eea9f0bc117f177549f5b  dist/inkweight.artifact.html
206ef6154118681b309a555b4716cd7e101da5982356be5e10efcced5a59a444  dist/inkweight.html
$ /opt/node22/bin/node build/build.mjs
BUILD OK modules=20 inkweight.html=182367B inkweight.artifact.html=182240B
$ sha256sum dist/* | diff - before
IDENTICAL
```

### 2. Automated check (rerun in full after the restart)

```text
$ /opt/node22/bin/node build/verify.cjs all --shots /tmp/rv2
PASS phone: drew a figure, Ring match finished after 4 rounds, solo run played 6 fights with 4 different shop purchases, 0 console errors, 0 network requests, no sideways scroll (93 s)
PASS landscape: drew a figure, Ring match finished after 4 rounds, solo run played 6 fights with 4 different shop purchases, 0 console errors, 0 network requests, no sideways scroll (91 s)
PASS desktop: drew a figure, Ring match finished after 3 rounds, solo run played 6 fights with 4 different shop purchases, 0 console errors, 0 network requests, no sideways scroll (86 s)
PASS artifact: drew a figure, Ring match finished after 4 rounds, solo run played 6 fights with 4 different shop purchases, 0 console errors, 0 network requests, no sideways scroll (98 s)
PASS duo: two humans drew in turns, a drawing timed out and got a placeholder, both keyboard zones were held, leaving took two taps, 0 console errors (39 s)
PASS checks: 13 single checks passed (double taps, asking before discarding, ink empty, finger off the canvas, rotation in a stroke, bot twin, stains, equal stakes, both solo loss paths), 0 console errors, 0 network requests (48 s)
VERIFY OK phone landscape desktop artifact duo checks
```

(The interrupted first run had printed PASS for phone, landscape and desktop
before the restart killed the browser.)

### 3. My own checks (own scripts under /tmp/rv2/me, Playwright, `chromium.launch()` without options, device scale 1, touch through CDP touch events, multi-touch for Sprint)

Single fixes, phone 400 x 780 touch (`[P]`); the same script at 780 x 400
(`[L]`) gave identical lines except the rotation sizes:

```text
[P] I-3 double tap Frei zeichnen -> scrDraw picker hidden true hint hidden false
[P] undo label Rückgängig back label Zurück
[P] after square weight 52
[P] I-1 first back tap -> scrDraw label Verwerfen? msg Noch einmal tippen, dann ist die Zeichnung weg.
[P] after 2.7s label Zurück msg Strich = Klinge · Punkt = Panzerkern · blass = tropft ab
[P] after undo weight 0
[P] back after undo of only stroke -> scrStart
[P] empty sheet after Leeren, back -> scrStart Zurück
[P] Verwerfen? double at 250ms -> scrStart
[P] Verwerfen? double at 80ms -> scrStart
[P] fast tools: weight 20 brush label Dick C1 on true elem Neutral
[P] stroke inside block: weight 0
[P] M-3 off canvas stroke added cells 10
[P] M-4 rotate mid-stroke weight 5 {"scr":"scrDraw","sw":780,"iw":780,"sh":400,"ih":400,"scrSh":384,"scrCh":384}
[P] M-2 ink 0 msg Tinte ist alle: radier etwas weg. warn msg warn
[P] M-1/M-10 stats Gewicht220 ... Schärfe1,0 Anteil gerader dünner Linien: 2 % Tempo9 ... ElementNeutral Schwarz ist neutral: kein Element
[P] decimal point in text:
[P] errors [] requests []
```

"fast tools" = three strokes with a colour tap 0 to 60 ms after each stroke,
then brush, eraser, black, two undos at 60 ms spacing: every tap acted.

Landscape 780 x 400, every screen, then rotated to 400 x 780 and back:

```text
[s3] start      {"sw":780,"iw":780,"scrSh":384,"scrCh":384} #btnGallery bottom 343   (portrait and back: same, no scroll)
[s3] gallery    {"sw":780,"iw":780,"scrSh":498,"scrCh":384}  (list scrolls, normal)
[s3] ringsetup  {"sw":780,"iw":780,"scrSh":401,"scrCh":384} #ringGo bottom 409       (see N-3)
[s3] double tap Los zeichnen: screen scrDraw timer 30 weight 0
[s3] ring draw  {"scrSh":384,"scrCh":384} #drawDone bottom 334; portrait 772; back landscape 334
[s3] ring Ende with strokes: label Verwerfen? msg Noch einmal tippen, dann ist die Zeichnung weg. timer 30 -> 30
[s3] after wait timer 27 label Ende
[s3] two taps on Ende -> screen scrStart                                             (see N-1)
[s3] solo intro {"scrSh":384,"scrCh":384} #soloC3 bottom 253
[s3] hero back first tap: scrDraw Verwerfen?
[s3] enemy Ende first tap: Verwerfen? | Noch einmal tippen, dann ist die Zeichnung weg.
[s3] enemy draw {"scrSh":384,"scrCh":384} #drawDone bottom 362
[s3] solo fight {"sw":780,"iw":780} #dashBtn bottom 382; portrait 762; back landscape 382
[s3] errors [] requests []
```

Line-up, round result, match result, shop, hero redraw, boss intro and solo
result in landscape: looked at the `landscape-05` to `landscape-19`
screenshots of my `verify.cjs` run in /tmp/rv2. All fit the window; the shop
shows four choices in two columns and "Nächsten Gegner zeichnen" fully.

Play-through at normal speed, phone 400 x 780 touch, steering with intent
(touch stick from body positions read by wrapping
`__inkDebug.core.ringStep/soloStep`, read only; Ring: approach the nearest
opponent from the centre side, stay inside 65 % of the ring, Sprint as a
second finger on the button when closer than 6 cells; Solo: approach, back
off inside 8 cells; a capture listener logs every touch-down that lands while
the 350 ms block is on):

```text
Ring (me vs 2 bots, 30 s clock):
overlay: Runde 1 geht an Du | Bot 3: Panzer zerbrochen Bot 2: Panzer zerbrochen 1 : 0 : 0 ... | pips ●○○ ○○○ ○○○
overlay: Runde 2 geht an Du | ... 2 : 0 : 0 | pips ●●○ ○○○ ○○○
overlay: Du gewinnst das Spiel! | ... 3 : 0 : 0 | pips ●●● ○○○ ○○○
total 47 s; taps that hit the block []
scroll problems []
errors [] requests []

Solo (Flut, highest enabled stake every wave):
stakes ["Einsatz ×1 3 Gegner · 117 Beute","Einsatz ×1,5 4 Gegner · 156 Beute","Einsatz ×2 6 Gegner · 234 Beute"]
shop: bought Neue Farbe -> "Glut gehört jetzt dir."; wave 2: bought Größerer Held, redrew it
stakes wave 4 ["Einsatz ×1 7 Gegner · 287 Beute","Einsatz ×1,5 10 Gegner · 410 Beute","Einsatz ×2 14 Gegner · 574 Beute"]
FINAL Aus und vorbei | Dein Panzer ist zerbrochen (Welle 4 von 5). 997 Tinte gesammelt · neuer Bestwert auf diesem Gerät Geschaffte Wellen: 3 von 5
total 117 s; taps that hit the block []
errors [] requests []
```

The solo loss was reached by playing (wave 4, armour), not through the debug
hook.

### 4. Scope

```text
$ git diff --stat b615254 HEAD -- Projects/Inkweight/Source/WebPrototype/core Projects/Inkweight/Source/Shared
(empty)
$ git diff --stat b615254 HEAD -- Projects/Inkweight/Source/WebPrototype
app/drawscreen.js, fight.js, main.js, page.html, ringmode.js, solomode.js, style.css, ui.js; dist/inkweight.artifact.html, dist/inkweight.html
```

Other paths changed since `b615254` (Director dispatch files, INK-WEB-V1
closure files, INK-CORE-V2 review, `Projects/Inkweight/Docs` state files)
belong to the Director or other orders. This order's own files are only in
`WebPrototype/app`, `dist` and `Evidence/INK-WEB-V2`. `build/` does not show in
git at all, see N-2. `.claude/worktrees/` was not looked at.

### 5. Page rules for `dist/inkweight.artifact.html`

| Rule | Result |
|---|---|
| Starts `<title>Inkweight</title>`, viewport-fit meta, `<style>` | holds (first three lines) |
| No doctype/html/head/body tags | holds (0 matches) |
| No network (no http(s) URL, fetch, XHR, WebSocket, beacon, @import) | holds (0 matches; 0 requests in every run) |
| `#app` side padding `max(16px, env(safe-area-inset-*, 0px))` | holds |
| No sideways scroll | holds on every screen, portrait and landscape, and after rotations |
| `height: 100%` on html/body, no `100vh` | holds |
| Colours only as tokens in `:root` | holds (all 14 literal colours are inside `:root`) |
| No alert/confirm/prompt; `el.hidden` instead of `style.display` | holds (0 matches each) |
| Stable ids, visible focus, sound only after a tap | unchanged from INK-WEB-V1, still holds |

### 6. German text

Plain and short; decimal comma everywhere I saw a fraction (stat panel,
line-up, gallery, stakes "×1,5", damage numbers in the fight screenshots); no
`\d.\d` in any visible text I sampled; no `toFixed` reaches player text
without `num()`. One grammar error, see N-4.

## Old findings

| Finding | State | Evidence |
|---|---|---|
| I-1 two "Zurück", drawing lost | fixed | Undo is "Rückgängig"; first "Zurück" with strokes asks "Verwerfen?" on free draw, hero, weapon, enemy and Ring; second tap at 80 ms and 250 ms works; empty sheet leaves at once. Wording on "Ende" screens is misleading, N-1. |
| I-2 drawing screen sideways | fixed | 780 x 400: canvas left, main button bottom at 334 (free/Ring) and 362 (enemy), no scroll; fight, start, solo intro, shop, overlays fit. Ring setup still scrolls 17 px, N-3. |
| I-3 ghost taps | fixed | Double tap "Frei zeichnen": only the drawing screen; double tap "Los, zeichnen!": clock 30, nothing painted. In two full play-throughs no intended tap landed in the block. |
| M-1 decimal point | fixed | "1,0", "6,5", "×1,5", damage "5,9" |
| M-2 ink runs out | fixed | "Tinte ist alle: radier etwas weg." in warning colour |
| M-3 finger leaves canvas | fixed | stroke down and out of the canvas, along the outside, back in: 10 cells, no edge line |
| M-4 rotation mid-stroke | fixed | stroke ends at the rotation (5 cells), no line across |
| M-5 damage numbers pile up | fixed | one summed number per figure (screenshots) |
| M-6 win dots | fixed | ●●● shown with score 3 : 0 : 0 |
| M-7 identical stakes, leftover ink | fixed in the app (tuning untouched) | equal stakes switched off with reason; honest purse sentence in the shop |
| M-8 start-screen scribbles | fixed | caption "Platzhalter-Kritzeleien ..." or own figures |
| M-9 verify writes into evidence | fixed | default `os.tmpdir()/inkweight-shots` (`verify.cjs` line 32) |
| M-10 name of black ink | fixed | "Schwarz ist neutral: kein Element"; solo intro says the same |
| W-1 shop choices and loss paths unchecked | fixed | `checks` scenario reaches both losses (through the debug hook); play-through buys four kinds; my own play reached a loss in wave 4 |
| W-2 bot uses the human's drawing | partly fixed | exact copies are replaced; an earlier drawing of mine in another colour still shows up as "Bot 2, aus der Galerie" (N-5) |
| W-3 stains lost on resize | not reproducible (as the Worker says) | stain layer not tied to the window; a check was added |

## New findings

### Blocker

None.

### Important

**N-1. "Verwerfen?" on the "Ende" buttons understates what the second tap
does.** Steps: Ring with a bot, draw one stroke, tap "Ende": it says
"Verwerfen?" and "Noch einmal tippen, dann ist die Zeichnung weg." A second
tap ends the whole match for everybody (back to the start screen). Same in
the Solo Arena on the enemy screen: the second tap ends the whole run, also
in wave 4 with all progress. Before this order the button said "Sicher?".
Place: `app/drawscreen.js`, `drawBack` click handler (label chosen by
`s.dirty` before `s.backConfirm`) and the `askingBack` message in
`updatePanel`. Fix: when the screen was opened with `backConfirm` (the "Ende"
screens), ask "Spiel beenden?" (Ring) / "Lauf beenden?" (Solo) and say
"Noch einmal tippen, dann endet das Spiel." Use "Verwerfen?" only on screens
where only the drawing is lost (free draw, hero, weapon, shop redraw).

**N-2. The build folder is not under version control.** `build/build.mjs` and
`build/verify.cjs` are ignored by `.gitignore` line 30 (`[Bb]uild/`, a Unity
rule); `git ls-files` lists nothing in `WebPrototype/build`. The M-9 fix, the
new `checks` scenario and the build script itself exist only on this disk,
and no commit records them (the Worker's table claims changes to `verify.cjs`
that git cannot show). This was already so in INK-WEB-V1. Fix (needs a
Director-scoped change, `.gitignore` is outside this order's paths): add
`!Projects/Inkweight/Source/WebPrototype/build/` after line 30, or rename the
folder (for example `tools/`), and commit both files.

### Minor

**N-3. Ring setup sideways: "Los, zeichnen!" is 9 px below the window** (bottom
409 of 400; the screen scrolls 17 px). Reachable by scrolling, the only
screen where the main button needs it. Place: `app/style.css` landscape
block. Fix: tighten the seat rows (`.seat` padding, hide the seat hints in
landscape) or put the time select beside the button.

**N-4. "Runde 1 geht an Du".** Should be "geht an dich". Place:
`app/ringmode.js`, round result title `'Runde ' + match.round + ' geht an ' +
name(w)`. Fix: `name(w) === 'Du' ? 'dich' : name(w)`.

**N-5. A bot can still show the player's own shape in another colour.** In
the landscape line-up Bot 2 ("aus der Galerie") had my earlier free drawing,
same shape, red instead of blue. Place: `app/ringmode.js` `sameCells`. Fix:
compare shapes (`cell !== 0`), not colours, against the humans' current and
earlier gallery drawings, or prefer drawings the human did not make.

**N-6. Two different numbers called "Tinte" in the solo result.** HUD "Tinte
1338" (purse) beside "1938 Tinte gesammelt" (score) in the win screen. Place:
`app/solomode.js` HUD text. Fix: HUD "Beutel 1338" or show the collected
amount.

**N-7. The tap block drops a whole stroke and can swallow one later click.**
A stroke started within 350 ms of the drawing screen opening paints nothing
for its whole length (`stroke inside block: weight 0`), with no feedback. A
touch-down swallowed in the block that turns into a drag never gets its
click, so `swallowClickUntil` stays armed for 700 ms and the next real click
is swallowed; on touch the lost-tap repair in `main.js` re-clicks it 90 ms
later, with a mouse it is lost. Not seen in normal play. Place: `app/ui.js`
guard. Fix: clear `swallowClickUntil` on `pointerup`/`pointercancel`, and on
the drawing canvas let a stroke that is still held start painting once the
block ends.

**N-8. Strokes end on any window size change.** `strokeTo` compares
`innerWidth/innerHeight` with the start; on a real phone browser bars that
show or hide also change `innerHeight` and would cut a stroke. Not testable
here (emulation only). Fix: compare only width, or end the stroke on
`orientationchange` / a change of the canvas position by more than a cell.

## Notes

- The sharpness line is honest ("Anteil gerader dünner Linien: 8 %") and so
  openly shows the core weakness on the first drawing; that belongs to
  INK-CORE-V2.
- Solo felt about right at normal speed: my steered hero lost in wave 4 at the
  highest stake each wave.
- My screenshots are in /tmp/rv2/me and /tmp/rv2 (outside the repository).
