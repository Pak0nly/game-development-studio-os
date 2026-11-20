# INK-WEB-V2 Worker Result

Worker report for Work Order INK-WEB-V2 (browser prototype: fixes from the
independent review). Status: built and checked by the Worker, **not
independently reviewed**. The Worker made no commit and no push. The Director's
work-in-progress snapshot commits (`13da15f`, `de8495a`) picked up the Worker's
files while the work was running; at the end the working tree of
`Projects/Inkweight/Source/WebPrototype` equals `HEAD`.

Time: started 2026-11-20 00:24 UTC, finished 00:53 UTC (container clock).

## Gate

```text
PASS worker receipt 1d0e00b926c084c59b0bb51979ae9de4ec24befbdbea224ff6d57375220def43
```

Run before the first change.

## Findings and what was done

All paths are under `Projects/Inkweight/Source/WebPrototype/`.

| Finding | State | What was done | File |
|---|---|---|---|
| I-1 two "Zurück", drawing lost | fixed | Undo is called "Rückgängig". Leaving any drawing screen with unsaved strokes (free draw, hero, weapon, enemy, Ring, shop redraw) asks once: the button reads "Verwerfen?" and the message line says "Noch einmal tippen, dann ist die Zeichnung weg." for 2.5 s. Without strokes it leaves at once. | `app/page.html`, `app/drawscreen.js` |
| I-2 phone held sideways | fixed | New layout for landscape up to 520 px height: canvas left (324 px at 780 x 400), tools, stats, stakes and the main button right, nothing scrolls. Start screen, shop, result panels and the countdown were also tightened for that format. | `app/style.css` |
| I-3 ghost taps | fixed | After every screen change pointer-down, touch-start and click are swallowed for 350 ms (one capture listener on the document), plus the click that belongs to a swallowed touch-down. | `app/ui.js` |
| M-1 decimal point | fixed | One helper `num()` writes the comma: stat panel, gallery, line-up, damage numbers. | `app/ui.js`, `drawscreen.js`, `main.js`, `ringmode.js`, `fight.js` |
| M-2 ink runs out | fixed | At 0 ink the message line says "Tinte ist alle: radier etwas weg." in the warning colour, the meter is already red. | `app/drawscreen.js` |
| M-3 finger leaves the canvas | fixed | Outside the canvas nothing is painted; the stroke goes on, without a joining line, where the finger comes back in. | `app/drawscreen.js` |
| M-4 rotation in a stroke | fixed | A stroke ends when the window size changes (checked on the resize event and on every move, because a move can arrive before the resize event). | `app/drawscreen.js` |
| M-5 damage numbers pile up | fixed | One number per hit figure: hits within 0.45 s add up in that number, which sits above the figure. At most 16 numbers. | `app/fight.js` |
| M-6 win dots | fixed | The dots are rewritten on every HUD refresh, also after the deciding round. | `app/ringmode.js` |
| M-7 identical stakes, leftover ink | fixed in the app, tuning untouched | A higher stake that brings no more enemies is switched off and says why ("wie ×1,5: mehr als 20 Gegner gibt es nicht" or "wie ×1: reicht nicht für einen Gegner mehr"); a selection on such a stake moves down. Leftover ink gets an honest label in the shop: only collected ink counts as the score, spending costs no points, and what stays in the purse is used for nothing else in this version. No new use for the ink was built (that would be a rule change in the read-only core). | `app/solomode.js`, `app/page.html` |
| M-8 start-screen scribbles | fixed | The newest own gallery figures hop on the start screen (up to 4). Built-in scribbles only fill gaps and are named in a caption ("Platzhalter-Kritzeleien. Zeichne selbst, dann hüpfen hier deine Figuren." or "Links deine Figuren, rechts noch Platzhalter."). | `app/main.js`, `app/page.html`, `app/style.css` |
| M-9 verify overwrites evidence | fixed | Screenshots go to `<system temp>/inkweight-shots` unless `--shots DIR` is given. | `build/verify.cjs` |
| M-10 name of black ink | fixed | The ink is "Schwarz" everywhere; a pure black drawing shows Element "Neutral" with the line "Schwarz ist neutral: kein Element"; the solo intro says the same. | `app/drawscreen.js`, `app/page.html` |
| Weakness: shop choices and loss paths never run | fixed | The play-through buys hero redraw, weapon redraw, new colour and healing in turn and fails if one of the first three was never bought. A new scenario `checks` reaches both loss screens. | `build/verify.cjs`, `app/solomode.js` (debug handle) |
| Weakness: bot with the human's drawing | fixed | After the humans have drawn, a bot whose drawing is cell-for-cell the same as a human's gets another one before the line-up. | `app/ringmode.js` |
| Weakness: stains lost on resize | not reproducible | The stain layer is sized by the arena, not by the window, and is only cleared at the start of a fight. A check was added: 400 stained pixels before the rotation, 400 after, 400 after rotating back. No code change was needed. | `build/verify.cjs`, `app/fight.js` (debug counter) |
| Task 6: do not promise more than the rules deliver | done | The rule sentence stays. The sharpness line is now live and says what version 1 does: "Anteil gerader dünner Linien: 21 %" (empty: "wächst mit dem Anteil dünner Linien"). The first hint says "Dünne, gerade Striche werden Klingen". | `app/drawscreen.js`, `app/page.html` |

Not touched: `core/`, `Shared/`, the tuning file, `.claude/worktrees/`.

## Commands and real output (last run)

```text
$ cd Projects/Inkweight/Source/WebPrototype
$ /opt/node22/bin/node build/build.mjs
BUILD OK modules=20 inkweight.html=182367B inkweight.artifact.html=182240B
$ sha256sum dist/*
271bf559d3d615202007ab18a1006250aac88fc5ef6eea9f0bc117f177549f5b  dist/inkweight.artifact.html
206ef6154118681b309a555b4716cd7e101da5982356be5e10efcced5a59a444  dist/inkweight.html

$ /opt/node22/bin/node build/verify.cjs all --shots <scratch folder>
PASS phone: drew a figure, Ring match finished after 3 rounds, solo run played 6 fights with 4 different shop purchases, 0 console errors, 0 network requests, no sideways scroll (84 s)
PASS landscape: drew a figure, Ring match finished after 3 rounds, solo run played 6 fights with 4 different shop purchases, 0 console errors, 0 network requests, no sideways scroll (86 s)
PASS desktop: drew a figure, Ring match finished after 4 rounds, solo run played 6 fights with 4 different shop purchases, 0 console errors, 0 network requests, no sideways scroll (95 s)
PASS artifact: drew a figure, Ring match finished after 5 rounds, solo run played 6 fights with 4 different shop purchases, 0 console errors, 0 network requests, no sideways scroll (102 s)
PASS duo: two humans drew in turns, a drawing timed out and got a placeholder, both keyboard zones were held, leaving took two taps, 0 console errors (38 s)
PASS checks: 13 single checks passed (double taps, asking before discarding, ink empty, finger off the canvas, rotation in a stroke, bot twin, stains, equal stakes, both solo loss paths), 0 console errors, 0 network requests (44 s)
VERIFY OK phone landscape desktop artifact duo checks
```

The build still stops on a broken page rule (head order, no
doctype/html/head/body, no external source, no fetch, no `100vh`, no
alert/confirm/prompt, no literal colour outside `:root`); it passed. The
fragment starts with `<title>Inkweight</title>`, the viewport meta, `<style>`.

Lines from the same run that carry the single proofs:

```text
[landscape] drawing screen fit at free drawing: {"bottom":334,"top":296,"ih":400,"sh":384,"ch":384,"sideSh":340,"sideCh":340,"canvas":324}
[landscape] drawing screen fit at enemy drawing: {"bottom":356,"top":318,"ih":400,"sh":384,"ch":384,"sideSh":340,"sideCh":340,"canvas":324}
[landscape] win dots 0 : 0 : 3 against score 0 : 0 : 3
[checks] ok: double tap on "Frei zeichnen" (three quick taps) opens only the drawing screen
[checks] ok: sharpness shows a decimal comma: 4,9 · line: "Anteil gerader dünner Linien: 84 %"
[checks] ok: black drawing: Element "Neutral", line "Schwarz ist neutral: kein Element"
[checks] ok: "Zurück" with strokes asks first ("Verwerfen?") and keeps the drawing; without strokes it leaves at once
[checks] ok: a finger outside the canvas paints nothing (10 cells instead of a line down the edge)
[checks] ok: rotation in a stroke ends the stroke (7 cells, no line across the sheet)
[checks] ok: ink at 0 says "Tinte ist alle: radier etwas weg." in the warning colour
[checks] ok: double tap on "Los, zeichnen!": clock still at 30, nothing painted
[checks] bots that first took the gallery copy of my drawing: 1; I drew it again: 1; bots with it in the line-up: 0
[checks] stained pixels before the rotation 400, after 400, rotated back 400
[checks] ok: stakes that bring the same enemies are switched off and say so
[checks] loss by armour (hero armour set to 0 through the debug hook): Aus und vorbei | Dein Panzer ist zerbrochen (Welle 1 von 5). 0 Tinte gesammelt · Bestwert: 0 Geschaffte Wellen: 0 von 5
[checks] loss by time (fight clock set to 4 s before the limit through the debug hook): Aus und vorbei | Die Zeit ist um: ein Kampf darf höchstens 3 Minuten dauern. 0 Tinte gesammelt · Bestwert: 0 Geschaffte Wellen: 0 von 5
```

What the setups are: `phone` 400 x 780 touch, `landscape` 780 x 400 touch (the
whole play-through, including fights), `desktop` 1280 x 800 mouse and
keyboard, `artifact` the fragment in a bare host page at 400 x 780 with
reduced motion, `duo` two humans on one keyboard, `checks` the single fixes.
Every drawing screen in every setup is checked for: main button inside the
window, the screen and the side panel not scrolling, canvas at least 240 px.

How the two solo losses were reached: not by playing. The check sets the
hero's armour to 0, and in a second run the fight clock to 4 s before the
limit, through `window.__inkDebug.run`; the core then ends the run and the
app shows its real result screen. The reviewer had found that a loss before
the boss cannot be played reliably.

The scripts wait until the 350 ms tap block is over before each tap, as a
person would; the double-tap checks do not wait.

## Screenshots (12, device scale factor 2, in this folder) and what I saw

- `landscape-01-start`: four figures, the placeholder caption, title, rule
  sentence, the four menu buttons in two columns, the device line. All on one
  screen.
- `landscape-03-draw`, `landscape-14-solo-enemy-draw`: canvas left, tools,
  ink meter, five stat rows, message, three stakes and "In den Kampf" right,
  nothing cut off.
- `landscape-08-ring-fight`: whole ring visible, HUD with three chips in one
  row, Sprint button bottom right, damage numbers "6,4" and "2,4".
- `landscape-15-solo-fight`: one damage number per figure ("5,9", "1,0",
  "1,2"), readable.
- `phone-03-draw`: "Rückgängig" fits in the row beside "Leeren", "Vorlage"
  and the ink meter; sharpness reads "1,0" with the line "Anteil gerader
  dünner Linien: 8 %" for a body with a sword.
- `phone-16-solo-shop`: the purse sentence under the shop line, four choices.
- `phone-20-start-own-figures`: four own figures hop, no caption.
- `checks-01-back-asks`: button "Verwerfen?", red message line, drawing kept.
- `checks-04-ink-empty`: red meter at 0 and the red sentence.
- `checks-07-stakes-equal`: ×1,5 and ×2 greyed out with their reason.
- `checks-08-solo-lost-armour`: "Aus und vorbei", the reason, score, waves.

I also looked at the hint screen in landscape, the rotated-stroke shot and the
loss-by-time shot (not copied here). Nothing looked broken. One thing fixed
after looking: a first version ended strokes whenever the canvas changed size,
which cut a stroke on the enemy screen when the stake labels re-wrapped; it now
follows the window size only.

Not judged by screenshots: animation feel, sound, real finger precision.

## Known weaknesses

- Still never run on a real phone or in the real Artifact frame; landscape is
  Chromium with touch emulation at 780 x 400 only (other sizes not tried).
- The tap block is 350 ms. A person who taps a second, intended button faster
  than that after a screen change is ignored once.
- In the emulated phone a tap right after strokes sometimes sends no click;
  the repair from the first order acts 90 ms later. A second tap on the same
  button inside that window counts as one tap. Seen only in automation.
- Bots are checked against the humans' drawings of the current round only. A
  bot may still use a figure the human drew earlier (that is how the gallery
  is meant to work).
- On the phone in portrait the titles of the enemy and free drawing screens
  wrap to two lines; stake buttons that are switched off carry three lines of
  small text.
- The sharpness line is honest but shows the core's weakness openly: a body
  with a sword reads 8 % and sharpness 1,0 (`phone-03-draw`).
- The debug hook grew (`run`, `ringDrawings`, `ringBotPicks`, `stainInk`,
  `inputBlocked`); it is only reachable from the developer console.
- The double-tap, off-canvas and rotation checks were not run against the old
  build to prove they fail there; the old behaviour is taken from the review.

## Not done

- No new use for leftover ink (only the label); stake numbers unchanged.
- Core tests were not re-run: `core/` was not touched by this order.
- No independent review, no real-device test, no gamepad test.
