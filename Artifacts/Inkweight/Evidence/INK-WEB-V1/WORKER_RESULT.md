# INK-WEB-V1 Worker Result

Worker report for Work Order INK-WEB-V1 (playable browser design prototype on
the ink core). Status: built and verified by the Worker, **not independently
reviewed**. Nothing was committed or pushed by the Worker.

## Gate

```text
PASS worker receipt 950fe8610ea2047305cf2d6d2ad8ed02f0e7ddc43eb253b43fda6263dcd8b19a
```

Run before the first mutation (2026-11-19 23:15 UTC). The container was
restarted once near the end; files survived, the build and all checks were run
again afterwards (2026-11-20 00:00 to 00:05 UTC) and the output below is from
that last run.

## What exists

All under `Projects/Inkweight/Source/WebPrototype/`:

| Path | Content |
|---|---|
| `app/page.html`, `app/style.css` | markup and the paper look (every colour is a token on `:root`) |
| `app/main.js` | start screen, navigation, gallery screen, sound switch, lost-tap repair |
| `app/drawscreen.js` | drawing screen with live stats, ink meter, clock, preview, template picker |
| `app/fight.js` | fight view: fixed 60 Hz loop around the core, camera, squash and hop, splashes, stains, shake, touch stick, dash button |
| `app/ringmode.js` | Mode B, the Ring: seats, drawing in turns, rounds, first to 3, catch-up ink, results |
| `app/solomode.js` | Mode A, Solo Arena: hero, weapon, enemy drawing and stake per wave, shop, boss, score |
| `app/sprites.js` | figures rendered from cells with a wobbling outline |
| `app/audio.js` | Web Audio synthesizer sounds, off until "Ton an" is tapped |
| `app/gallery.js` | `localStorage` gallery and best score, every access in try/catch, memory fallback |
| `app/scribbles.js` | 6 placeholder figures and 3 placeholder weapons, hand-written cell data |
| `app/input.js`, `app/ui.js`, `app/tuning.js` | keyboard zones, gamepads, touch state; helpers; inlined tuning |
| `build/build.mjs` | dependency-free bundler and page-rule checks |
| `build/verify.cjs` | Playwright play-through (phone, desktop, artifact fragment, two humans) |
| `dist/inkweight.html` | standalone page, 172663 bytes |
| `dist/inkweight.artifact.html` | Artifact fragment, 172536 bytes |

The core (`core/`), `Shared/` and the tuning file were not edited; the core is
bundled unchanged and the tuning JSON is inlined at build time. To play: open
`dist/inkweight.html` in a browser.

## Commands and real output (last run)

```text
$ cd Projects/Inkweight/Source/WebPrototype
$ node build/build.mjs
BUILD OK modules=20 inkweight.html=172663B inkweight.artifact.html=172536B

$ node build/verify.cjs all
PASS phone: drew a figure, Ring match finished after 3 rounds, solo run played 6 fights, 0 console errors, 0 network requests, no sideways scroll (80 s)
PASS desktop: drew a figure, Ring match finished after 3 rounds, solo run played 6 fights, 0 console errors, 0 network requests, no sideways scroll (73 s)
PASS artifact: drew a figure, Ring match finished after 5 rounds, solo run played 6 fights, 0 console errors, 0 network requests, no sideways scroll (93 s)
PASS duo: two humans drew in turns, a drawing timed out and got a placeholder, both keyboard zones were held, leaving took two taps, 0 console errors (37 s)
VERIFY OK phone desktop artifact duo

$ node --test        (core tests, unchanged core)
# tests 39
# pass 39
# fail 0
```

sha256: `inkweight.html` 3f7f3b85...d9060ed, `inkweight.artifact.html`
69fc4658...6bff5d080.

What the scenarios do:

- **phone** (400 x 780, device scale 2, real touch events through the
  browser's touch input): start screen, sound on and off, free drawing with
  thick and thin strokes and a colour, checks that the live stats and the
  element change, eraser / undo / clear, gallery with `localStorage`, a whole
  Ring match against two bots (clock running, catch-up ink on the next
  drawing), then a whole solo run: hero, weapon, five enemy drawings with a
  stake, five shops with a purchase, the boss, the result screen.
- **desktop** (1280 x 800, mouse and keyboard): the same.
- **artifact**: the fragment file wrapped in a bare host page at 400 x 780
  with `prefers-reduced-motion: reduce`: the same.
- **duo** (desktop): two humans, hand-over screen, the second drawing runs out
  of time and gets a placeholder, both keyboard zones held in the fight,
  leaving needs two taps.

Every scenario fails on any console error or warning, page error, non-file
network request, sideways scroll, or a page taller than the window. Fights are
sped up eight times through a debug hook (`window.__inkDebug.speed`); the first
seconds of each first fight run at normal speed for the screenshots. The
steering in the runs is a blind circle, so "the human lost the Ring" in the
logs says nothing about balance.

The build stops if the fragment breaks a page rule it can check by text: head
order, no `doctype/html/head/body`, no external `src`/`url()`/`@import`, no
`fetch`/`XMLHttpRequest`, no `100vh`, no `alert/confirm/prompt`, no literal
colour outside `:root`.

## Screenshots (39, device scale factor 2, in this folder)

`phone-01` to `phone-18`, `desktop-01` to `desktop-17`, `duo-01` to `duo-04`.
I looked at these and fixed what I saw:

- `phone-01-start`: title, four hopping placeholder figures, the rule
  sentence, three mode buttons, gallery, the "stays on this device" line.
  Readable, nothing cut off.
- `phone-02-draw-first-hint`, `phone-03-draw`, `desktop-02-draw`: canvas fills
  the width on the phone; tools, ink meter, five stat rows with their one-line
  explanation and the main button fit on one 400 x 780 screen without
  scrolling. Sharp cells show a light slash, core cells a light dot, loose
  cells are pale with a falling drop, the preview figure hops top right.
  Fixed after looking: explanation text was cut off on desktop, the legend
  line wrapped on the phone.
- `phone-07-ring-lineup`: three cards with figure, seat number, stats; bot
  figures carry a "Platzhalter" or "aus der Galerie" badge.
- `phone-08/09-ring-fight`, `desktop-07/08`, `duo-04`: ring, figures rotated
  toward their steering, armour bar with seat number under each figure, HUD
  with wins and armour, touch stick and Sprint button on the phone. Fixed
  after looking: seat tags floated far from long figures, shadows were big
  grey blobs, the sound button wrapped to two lines.
- `phone-10/11` ring results: who won, why each loser lost (ring-out or
  armour), the score, the catch-up sentence.
- `phone-14-solo-enemy-draw`: three stake buttons that show copies and loot
  live. Fixed: the labels wrapped badly.
- `phone-15-solo-fight`: fixed after looking: the whole arena at 400 px made
  every figure tiny, so on small screens the solo view now zooms in and
  follows the hero, with small arrows at the edge for enemies outside the
  view. Desktop shows the whole arena (`desktop-14`).
- `phone-16-solo-shop`, `phone-17-solo-boss-intro`, `phone-18-solo-result`:
  readable; the result shows score and best score.
- `phone-04-gallery`: own drawings with stats and a delete button,
  placeholders marked.

Not judged by screenshots: animation feel, sound, real finger precision.

## Problems with the core and what I did

The core loaded and ran in Chromium unchanged; no core bug stopped the work.
Things I had to design around or that will colour the Human's impression:

1. **Diagonal strokes are never blades.** The drawing tool paints 4-connected
   strokes (as RULES_AS_BUILT section 10.4 recommends, otherwise diagonal
   cells drip off). A staircase has no sharp cells except its ends, so a
   diagonal line drawn by a player shows no blade marks and adds no
   sharpness. Visible in `desktop-02-draw`. Not worked around; it is a rule.
2. **Sharpness barely moves for a normal figure.** With the share-squared
   formula a body with one long blade stays at 1.0 to 1.3 (see the logged
   stats: weight 178, sharpness 1.0). Only almost pure line drawings get
   sharp (the cross weapon: 4.7). The stat bar and the sentence "thin lines
   are blades" therefore look broken to a first-time player. Shown as built.
3. **Bots in a round call `botRingInput` for eliminated seats too**
   (`ringBotInputs`); harmless, mentioned only because I pass `null` for bots
   exactly as the README says.
4. **No drawing time limit, no bot drawings, no hand-over in the core**: built
   in the app. A human who runs out of time without a valid figure gets a
   placeholder for that round.
5. **Solo is very easy with a big hero**: in all automated runs a heavy hero
   steered blindly won the whole run; in the one run I logged in full its
   armour never fell below 228 of 273, with a heal after every wave (enemy
   damage x0.2). Tuning, not changed.
6. Thrown weapons are drawn with the weapon picture but collide as a circle,
   as built in the core.

## Known weaknesses

- **Never run on a real phone or in the real Artifact frame.** Phone checks
  are Chromium with touch emulation; iOS Safari and the hosting frame's own
  rules are untested. The fragment was only tested inside a bare host page.
- **Lost taps:** in the emulated phone run Chromium sometimes sent no click
  for a tap on a button right after quick strokes (touch events arrived, the
  click did not). Tool buttons now react on touch-down, and a small repair in
  `main.js` activates a button when a finger went down and up on it and no
  click followed within 90 ms. Whether real phones show the original problem
  is unknown.
- Gamepads are implemented (left stick or d-pad, buttons for dash) but were
  never tested: no gamepad in the test browser.
- Sound was only checked for "no errors"; nobody has heard it.
- Two or more humans on a phone: only the first human has touch steering (the
  order asks for one human against bots on a phone); the setup screen says so.
- Seats 3 and 4 with four humans on one keyboard may hit keyboard ghosting.
- Fonts: system stacks only; the hand-written look falls back to the normal
  system font on Android and Linux.
- Ink stains are lost when the window is resized during a fight.
- There is no unbundled dev page: `app/` is only run through the build.
- The debug hook `window.__inkDebug` (speed, core, tuning) ships in the page.
- A bot may pick a gallery drawing identical to the one the human just drew.
- The automated runs never let a human win or lose a solo run by armour or
  time; those result texts exist but were not seen on screen.

## Not done

- No independent review, no real-device test, no gamepad test.
- In the shop only the heal purchase was exercised by the automated runs. The
  hero redraw, weapon redraw and new-colour upgrades exist but were never run.
- 39 screenshots instead of "about 8".
