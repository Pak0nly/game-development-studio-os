# INK-WEB-V1 Independent Review

Independent review verdict: PASS

Reviewer: QA Lead (independent Reviewer task, did not build the candidate).
Date: 2026-11-20, 00:07 to about 00:30 UTC. Candidate: working tree on top of
`b615254` (`Projects/Inkweight/Source/WebPrototype/app`, `build`, `dist`).
Nothing was fixed by the Reviewer. Nothing was committed or pushed.

PASS means here: the Work Order's success conditions are met, a person can draw,
play the Ring and play a solo run on a phone and a PC without instructions,
the page rules hold, and I found no blocker (no crash, no dead end, no lost
input that stops play, no unreadable main screen). There are three important
findings that should be fixed before the Human plays tomorrow morning if there
is time; none of them stops play.

## What I ran (real output)

### 1. Rebuild and reproducibility

```text
$ cd Projects/Inkweight/Source/WebPrototype
$ sha256sum dist/*   (before)
69fc465863c45d8355601c439b5a1c9f5832451fcfaebeea660f47c6bff5d080  dist/inkweight.artifact.html
3f7f3b8536c9675b89aab4214846ac61c801849d792dfea8268e1dd8cd9060ed  dist/inkweight.html
$ node build/build.mjs
BUILD OK modules=20 inkweight.html=172663B inkweight.artifact.html=172536B
$ sha256sum dist/* | diff - before
IDENTICAL
```

The build is reproducible; the committed dist files are current and were not
changed by the rebuild.

### 2. Worker's verification script

```text
$ node build/verify.cjs all --shots /tmp/rv/shots
PASS phone: drew a figure, Ring match finished after 4 rounds, solo run played 6 fights, 0 console errors, 0 network requests, no sideways scroll (87 s)
PASS desktop: drew a figure, Ring match finished after 3 rounds, solo run played 6 fights, 0 console errors, 0 network requests, no sideways scroll (78 s)
PASS artifact: drew a figure, Ring match finished after 5 rounds, solo run played 6 fights, 0 console errors, 0 network requests, no sideways scroll (89 s)
PASS duo: two humans drew in turns, a drawing timed out and got a placeholder, both keyboard zones were held, leaving took two taps, 0 console errors (36 s)
VERIFY OK phone desktop artifact duo
```

Process note (my own deviation, corrected): my first run of `verify.cjs all`
without `--shots` started writing screenshots into the evidence folder and
overwrote `phone-01-start.png`, `phone-03-draw.png`, `phone-06-ring-draw.png`
and `phone-07-ring-lineup.png`. I stopped it, restored those four files from
the commit `b615254` with `git checkout --`, and reran with `--shots
/tmp/rv/shots`. `git status` afterwards shows no change in the evidence folder
except this file. The script's default of writing into the evidence folder is
recorded as a minor finding below.

### 3. My own play-throughs (own scripts under /tmp/rv, Playwright, chromium.launch() without options, device scale 1)

Phone = 400 x 780, touch (CDP touch events, real multi-touch for the Sprint
button). Desktop = 1280 x 800, mouse and keyboard. Fights at normal speed,
except later solo waves (x6 after 3 to 25 s at normal speed). For steering
with intent my harness read the body positions by wrapping
`__inkDebug.core.ringStep/soloStep` (read only; it changes no game value).
Ring steering: stay inside 65 % of the ring, approach the nearest opponent
from the centre side, dash when closer than 6 cells. Solo: approach, back off
when closer than 8 cells.

Drawing, phone, free mode (live stat line: weight | armour | sharpness | speed | element | element line | ink left | message):

```text
blob (thick):   196 | 343 | 1.0 | 10 | Neutral | ... | 24  | Strich = Klinge ... | done=true
stick figure:    63 |  55 | 4.3 | 20 | Neutral | ... | 157 | ...                | done=true
undo x2:         40 |  55 | 4.5 | 24 | ...
blob + sword:   188 | 295 | 1.1 | 10 | Neutral | ... | 32
tiny dot:         1 |  55 | 6.5 | 37 | Neutral | ... | 219 | Noch zu klein: mindestens 12 Kästchen am Stück. | done=false
diagonal line:   49 |  55 | 1.0 | 22 | ...
over budget:    220 | 347 | 1.0 |  9 | ... | 0   (ink stops, meter turns red)
red blob:       182 | 319 | 1.0 | 11 | Glut | schlägt Moos, verliert gegen Flut | 38
eraser cut:     116 | 181 | 1.0 | 14 | Flut | ... | 65 Kästchen hängen nicht dran und tropfen ab.
scroll {"sw":400,"iw":400,"sh":780,"ih":780}
saved -> scrGallery, own drawing listed with stats, 6 + 3 placeholders marked "Platzhalter"
errors [] requests []
```

Desktop gave identical stat lines, `scroll {"sw":1280,"iw":1280,"sh":800,"ih":800}`, no errors.

Ring, phone, me vs 2 bots, 30 s clock:

```text
lineup: Du 140/215/1.0 · Bot 2 PLATZHALTER 84/125/1.3 · Bot 3 PLATZHALTER 43/55/6.5
round 1 lasted 17956 ms  Runde 1 geht an Bot 3 · Bot 2: Panzer zerbrochen · Du: Panzer zerbrochen
round 2 lasted 15163 ms  Runde 2 geht an Bot 3 · Du: aus dem Ring geflogen
round 3 lasted 33354 ms  Runde 3 geht an Bot 2
round 4 lasted 18189 ms  Bot 3 gewinnt das Spiel! 0 : 1 : 3
catch-up shown: Runde 2 · 253 Tinte (Aufholtinte +33), Runde 4 · 319 Tinte (+99)
errors [] requests []
```

Ring, desktop (WASD + Space): `Du gewinnst das Spiel! 3 : 0 : 1`, rounds 18 to 22 s, no errors.

Solo, phone, start colour Flut, heavy hero, cross weapon:

```text
wave 1 stake x1,5 -> shop: bought "Größerer Held" (redraw 260 Tinte, "Kaufen") -> "Dein Held ist gewachsen."
wave 2 stake x1   -> shop: bought "Neue Farbe" -> Glut -> "Glut gehört jetzt dir."
wave 3            -> shop: bought "Größere Wurfwaffe", redraw offered Glut and Flut, not Moos -> "Neue Waffe eingepackt."
waves 4, 5, boss  -> "Geschafft! ... 1357 Tinte gesammelt · neuer Bestwert auf diesem Gerät"
errors [] requests []
```

Solo, phone, trying to lose: tiny hero (14 cells), biggest enemy (220 cells),
stake x2 every wave, steering toward enemies. The hero survived all five waves
and lost only to the boss: `Aus und vorbei · Dein Panzer ist zerbrochen
(Endgegner). · 2640 · Geschaffte Wellen: 5 von 5`. Loss screen reached and
readable; no errors.

### 4. Robustness

```text
A localStorage throws on access: gallery shows "Dieser Browser erlaubt hier kein Speichern. Die Galerie hält nur, bis du die Seite schließt."; play continues; errors []
B double tap on "Frei zeichnen": second tap lands on "Vorlage" and opens the template picker
B rotate to 780x400 mid-stroke: stroke continues, scroll {"sw":780,"iw":780,"sh":400,"ih":400}
B landscape draw screen: scrDraw scrollHeight 517 > 400, "Fertig" at y 481..525 (below the fold, reachable only by scrolling the screen)
B back from free drawing with a 50-cell drawing: straight to scrStart, drawing gone, no confirmation
B double tap "Los, zeichnen!": second tap paints one cell and starts the 30 s clock
B double tap "Fertig"/"In den Ring!": guarded, no skipped panel
B rotate during a fight and back: no error, no sideways scroll
B "Ende" in a fight: first tap "Sicher?", second tap -> scrStart, Sprint button hidden
B leave solo midway, then start a new Ring: works, HUD fresh
B errors [] requests []
C reduced motion, desktop: Tab focus on #btnRing outline=solid 3px rgb(44,110,209); Enter opens the Ring setup; errors []
D fragment in <iframe sandbox="allow-scripts"> (no same origin, so no storage; alert/confirm/prompt replaced by no-ops):
  drawing works (weight 35), galNote shown, scroll {"sw":400,"iw":400}, errors [], requests []
Sound: "Ton an" -> "Ton aus", strokes and a fight with sound on, switched off in the fight: errors []
```

### 5. Scope

```text
$ git diff --stat f26e212 -- Projects/Inkweight/Source/WebPrototype/core Projects/Inkweight/Source/Shared
(empty)
```

`f26e212` closed INK-CORE-V1. Core and shared files are unchanged. All other
paths changed since then belong to other orders (INK-UNITY-V1, INK-CORE-V2,
state files committed by the Director); this order's files are only in
`WebPrototype/app`, `build`, `dist` and `Evidence/INK-WEB-V1`. The
`.claude/worktrees/` folder was not looked at.

### 6. Page rules for `inkweight.artifact.html` (checked against the file)

| Rule | Result |
|---|---|
| Starts `<title>Inkweight</title>`, then `<meta name="claude:viewport-fit-sides" content="cover">`, then `<style>` | holds (first three lines) |
| No doctype/html/head/body tags | holds (0 matches) |
| No network: no external src/url/@import, no fetch/XHR/WebSocket/beacon, no http(s) URLs, system fonts | holds (0 matches; 0 requests in all runs, also in the sandboxed frame) |
| Outer wrapper `#app` with `padding-left/right: max(16px, env(safe-area-inset-*, 0px))`, `padding-block` | holds |
| No sideways scroll at 400 px | holds on every screen I visited (sw 400 = iw 400) |
| `height: 100%` on html and body, no `100vh` | holds |
| Colours as tokens on `:root`, explicit body background and colour, no literal colours in component rules | holds (only `white-space` matches; canvases read tokens) |
| No alert/confirm/prompt; confirmations in the page | holds (two-tap "Sicher?" pattern) |
| Visibility through `el.hidden` | holds (`[hidden]{display:none!important}`, no `style.display =`) |
| Stable ids on form controls | holds (`ringTime`, `seat1Type` to `seat4Type`; buttons have ids) |
| Visible keyboard focus | holds (`:focus-visible` 3px outline) |
| Sound only after a tap, no download/print/camera/mic, fullscreen optional | holds (AudioContext only created in `setSound`) |

### 7. Language and honesty

All player text is German, short and plain; I found no spelling mistakes. The
start screen states the rule in one sentence ("Menge ist Gewicht, gefüllte
Flächen sind Panzer, dünne Linien sind Klingen, Farbe ist das Element.") and
"Deine Zeichnungen bleiben auf diesem Gerät. Nichts wird hochgeladen." The
first-run hint is two sentences. Placeholders carry a "Platzhalter" badge in
the line-up, gallery and template picker. No image or audio files, nothing
fetched. `window.__inkDebug` is only reachable from the developer console; no
URL parameter, key or gesture sets it.

## Findings

### Blocker

None.

### Important

**I-1. "Zurück" means two different things on the drawing screen, and the
top one throws the drawing away without asking.**
Steps: start screen, "Frei zeichnen", draw anything, tap "Zurück" top left.
The drawing is gone and you are on the start screen. The undo button right
under the canvas is also labelled "Zurück". The same happens for hero and
weapon in the Solo Arena (back to the colour choice, hero lost). A first-time
player who wants to undo one stroke has two equal buttons with the same word
and a 50 % chance to lose the drawing.
Place: `app/page.html` (`#drawBack`, `#toolUndo`); `app/main.js` free draw
and `app/solomode.js` hero/weapon `openDraw` calls pass no `backConfirm`.
Fix: label undo "Rückgängig" (or an arrow symbol with aria-label), and pass
`backConfirm: true` for free draw, hero and weapon (the two-tap "Sicher?"
already exists in `drawscreen.js`).

**I-2. The drawing screen does not fit a phone held sideways.**
Steps: phone 780 x 400 (landscape), open any drawing screen. The canvas
shrinks to about 170 px, the stats and the main button ("Fertig"/"In den
Kampf") are below the fold (button at y 481..525 of 400) and can be reached
only by scrolling the screen. The fight in landscape is fine.
Place: `app/style.css`, the side-by-side layout only starts at
`@media (min-width: 820px)`.
Fix: also use the row layout for `(orientation: landscape) and (max-height:
520px)`, with a narrower side panel and the stat explanations hidden; or show
a short "Bitte hochkant halten" note in landscape on coarse pointers.

**I-3. Ghost taps from a quick double tap.**
Steps: double tap "Frei zeichnen": the template picker opens over the first
hint. Double tap "Los, zeichnen!": the second tap paints one cell and starts
the 30 s drawing clock before the player has started. Phones send such double
taps often when the first response feels slow.
Place: the second tap lands on whatever the new screen has at that point
(`#toolPick` row, `#drawCanvas`).
Fix: in `showScreen` (`app/ui.js`) ignore pointer input on the new screen for
about 300 ms (for example a `blockUntil` timestamp checked in the canvas
`pointerdown` and in `onPress`/the click capture in `main.js`).

### Minor

- **M-1. Numbers use a decimal point** ("Schärfe 1.0", floating damage
  "1.0") instead of the German comma. `drawscreen.js` `updatePanel`,
  `main.js` `statText`, `ringmode.js` `statLine`, `fight.js` `fmtDamage`.
  Fix: `.replace('.', ',')` or `toLocaleString('de-DE')`.
- **M-2. No word when the ink runs out.** Over-budget strokes just stop, the
  meter turns red, the message line keeps the legend. `drawscreen.js`
  `updatePanel`. Fix: when `left <= 0` show "Tinte ist alle: radier etwas
  weg." as a warning.
- **M-3. A finger that slides off the canvas keeps painting along the edge**
  (`cellAt` clamps to the border). Fix: stop painting (but keep the stroke)
  while the pointer is outside the canvas rectangle.
- **M-4. Rotating mid-stroke joins the old and the new canvas position with a
  long line.** Fix: end the current stroke in `layout()`.
- **M-5. Floating damage numbers pile up** into unreadable stacks in big
  solo fights (boss screenshot). Fix: merge numbers per body within ~0.3 s or
  show only numbers of at least 1.
- **M-6. The HUD win pips are not refreshed after the deciding round** (score
  3, pips show 2). `ringmode.js` `makeHud` builds pips once. Fix: rebuild
  pips when the fight stops.
- **M-7. Stake choices can look identical** at the copy cap (wave 5: "×1,5"
  and "×2" both "20 Gegner · 460 Beute"), and the ink purse grows to several
  hundred with nothing to spend it on (one upgrade per pause). Design /
  tuning, report to the core order.
- **M-8. Start screen doodles are the placeholder scribbles without a mark.**
  Decorative only; a tiny "Platzhalter" caption would keep the honesty rule
  everywhere.
- **M-9. `build/verify.cjs` writes screenshots into the evidence folder by
  default**, so any re-run by a reviewer overwrites the Worker's evidence.
  Fix: default to a temp folder and require `--shots` for evidence.
- **M-10. Pure-black drawings show "Element: Neutral" while the stat list
  colour scheme uses "Schwarz"** as a colour name elsewhere ("Du hast Schwarz
  und Flut"). Fine, but a line such as "Schwarz ist neutral" would avoid the
  question.

### How the known core weaknesses feel while playing (not counted)

- Sharpness: every figure a person naturally draws (a body with a sword)
  shows 1.0 or 1.1, while a lone dot shows 6.5 and a stick figure 4.3. The
  rule sentence "thin lines are blades" looks broken on the first try.
- On the phone my heavy figure with a sword lost the Ring 0 : 3 mostly to the
  "Wurm" placeholder (43 cells, sharpness 6.5) by armour; on desktop the same
  figure won 3 : 1. Losing three times to a squiggle is the kind of moment a
  first-time player reads as "unfair", not as "interesting".
- Diagonal lines become staircases without blade marks.
- Solo is too easy: a 14-cell hero against 220-cell enemies at stake x2
  cleared all five waves and lost only to the boss; the loss scored 2640,
  twice the 1357 of my winning run.
- Ring rounds of 15 to 33 s feel right; the figures are small on a phone
  (about 30 to 40 px), but readable.

## First impression

Yes, a person understands what to do within a minute. The start screen is
clean and friendly, says the rule in one sentence and says the drawings stay
on the device. The drawing screen is the strongest part: strokes are smooth,
the numbers move with every stroke, the little preview hops, and drips fall
off visibly. The Ring explains itself through the line-up, the countdown with
the control hint and a result that says why someone lost. The solo run flows
from hero to weapon to enemy to shop without a dead end. I saw no console
error, no network request and no sideways scroll in any run.

What would spoil the first five minutes is mostly small friction around the
drawing, plus the core's sharpness rule. The three changes that would help
most:

1. Rename the undo button and ask before "Zurück" throws a drawing away
   (I-1). Losing the first drawing by tapping the wrong "Zurück" is the most
   likely bad moment.
2. Make sharpness visible for the figures people actually draw (the core
   order INK-CORE-V2), and until then soften the claim on screen, for example
   "dünne Linien schneiden: je mehr Linie, desto schärfer".
3. Swallow ghost taps after a screen change and give the drawing screen a
   landscape layout (I-2, I-3), so the phone never starts a clock or opens a
   picker by itself and works however it is held.

Screenshots of my runs are in `/tmp/rv/me/` (outside the repository).
