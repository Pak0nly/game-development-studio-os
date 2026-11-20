# INK-WEB-V4 Independent Review

Independent review verdict: PASS

Reviewer: QA Lead, a separate Reviewer task that did not build this work.
2026-11-20, 04:21 to about 05:00 UTC. Candidate: HEAD `17a60a5` ("INK-WEB-V4
Worker result ..., unreviewed"), with the WebPrototype working tree equal to
HEAD. I fixed, committed and pushed nothing. This file is the only repository
file I created. The rebuild changed no dist file. All scripts, logs and
screenshots are under `/tmp/rv4` and `/tmp/rv4w`.

Why PASS:
- The page runs on core version 3 (`ink-tuning-3`).
- Every number and sentence I checked about the rules is true for version 3
  (table below).
- The automated check passes in all seven setups.
- The page rules and the scope hold.
- There is no crash, dead end or unreadable main screen.

There are four important findings that a first-time player will notice:
- I-1: the first stroke is lost when it starts on the first-run hint.
- I-2: the Ring is still hard for some first drawings.
- I-3: at stake x1, a player who runs into enemies loses at the boss.
- I-4: on a phone, the real enemy armour is cut off the stake line.

None of them is a false statement or a blocker as the order defines these.

## 1. Rebuild and automated check

```text
$ /opt/node22/bin/node build/build.mjs
BUILD OK modules=21 inkweight.html=231632B inkweight.artifact.html=231505B
$ sha256sum -c (hashes taken before the rebuild)
dist/inkweight.artifact.html: OK
dist/inkweight.html: OK
```

The dist files are byte-identical after the rebuild (artifact `accc5372...`,
html `bde18a13...`). The bundle carries `"version":"ink-tuning-3"` once.

```text
$ /opt/node22/bin/node build/verify.cjs all --shots /tmp/rv4
PASS phone: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 155 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (82 s)
PASS landscape: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 135 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (81 s)
PASS desktop: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 106 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (73 s)
PASS artifact: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 98 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (74 s)
PASS duo: two humans drew in turns, a drawing timed out and got a placeholder, both keyboard zones were held, leaving took two taps, 0 console errors (38 s)
PASS checks: 22 single checks passed (double taps, asking before discarding, ink empty, finger off the canvas, rotation in a stroke, bot twin, stains, honest stakes, both solo loss paths; version 2: block with blade, diagonal blade, pocket marks, what Ende asks), 0 console errors, 0 network requests (61 s)
PASS stable: the canvas kept its rectangle before, in and after the first stroke on 15 drawing screens (400 x 780, 400 x 660, 780 x 400), main button always inside the window, shop tap with a second finger works, 0 console errors (57 s)
VERIFY OK phone landscape desktop artifact duo checks stable
```

## 2. Truthfulness for version 3

I computed my own reference values in a Python script (`/tmp/rv4w/calc.py`).
It uses only `INK_RULES_V2.md`, `RULES_AS_BUILT.md`, `CHANGES_V3.md` and
`ink_tuning.json`, not the core. I then drew the same shapes on the page at
400 x 780 (`/tmp/rv4w/truth.cjs`, `fig.cjs`).

- **Heavy block enemy:** 14 x 15 block, N 210, armour 279.
- **Small swarm enemy:** a 12-cell line, N 12, S 12, sharpness 4,52.
- **Hero:** armour 143 in this run, because my first stroke was lost (I-1).
  Hero armour enters the "bis" value through the 0,4 % cut.

### Stake line ("n Gegner · m Beute" and "als Gegner: Treffer · Tempo · Panzer")

| Wave, stake | Heavy block: shown | Heavy block: mine | Line of 12: shown | Line of 12: mine |
|---|---|---|---|---|
| W1 ×1 | 1 Gegner, 120 · Treffer 0,6 · Tempo 7,3 · Panzer 91 | 1, 120 · 0,648 · 7,28 · 90,9 | 2, 120 · bis 2,0 · 17,6 · 23 | 2, 120 · 0,48 / bis 2,04 · 17,6 · 23,0 |
| W1 ×1,5 | 1, 180 · 1,1 · 8,0 · 131 | 1, 180 · 1,054 · 8,01 · 130,9 | 3, 180 · bis 2,5 · 19,4 · 23 | 3, 180 · bis 2,55 · 19,36 · 23,0 |
| W1 ×2 | 1, 240 · 1,7 · 8,7 · 175 | 1, 240 · 1,688 · 8,73 · 174,5 | 4, 240 · bis 3,1 · 21,1 · 23 | 4, 240 · bis 3,06 · 21,12 · 23,0 |
| W3 ×1 | 1, 230 · 0,8 · 7,3 · 167 | 1, 230 · 0,789 · 7,28 · 167,3 | 4, 228 · bis 2,0 · 17,6 · 22 | 4, 228 · bis 2,04 · 17,6 · 22,0 |
| W3 ×1,5 | 1, 345 · 1,5 · 8,0 · 251 | 1, 345 · 1,47 · 8,01 · 250,9 | 6, 342 · bis 2,5 · 19,4 · 22 | 6, 342 · bis 2,55 · 19,36 · 22,0 |
| W3 ×2 | 1, 460 · 2,6 · 8,7 · 335 | 1, 460 · 2,575 · 8,73 · 334,5 | 8, 456 · bis 3,1 · 21,1 · 22 | 8, 456 · bis 3,06 · 21,12 · 22,0 |
| W5 ×1 | 1, 380 · 1,0 · 7,3 · 276 | 1, 380 · 0,99 · 7,28 · 276,3 | 7, 378 · bis 2,0 · 17,6 · 21 | 7, 378 · bis 2,04 · 17,6 · 20,8 |
| W5 ×1,5 | 2, 570 · 1,3 · 8,0 · 207 | 2, 570 · 1,32 · 8,01 · 207,3 | 10, 570 · bis 2,5 · 19,4 · 22 | 10, 570 · bis 2,55 · 19,36 · 21,8 |
| W5 ×2 | 3, 759 · 1,7 · 8,7 · 184 | 3, 759 · 1,74 · 8,73 · 184,2 | 10, 760 · bis 3,1 · 21,1 · 29 | 10, 760 · bis 3,06 · 21,12 · 29,1 |

All values are true. "Treffer" includes the crush. "bis" is the cut: the
sharpness, at least blunt plus crush, plus 0,4 % of the hero's full armour,
times 0,4 and the stake factor. The heavy block has no blade, so its line
correctly shows no "bis".

In my x1 and x2 solo runs, the shown touch, speed and armour matched the
spawned enemy body in all 15 waves I played. For example: "shown touch 2.6,
Tempo 8.7, Panzer 335 = enemy body: blunt touch 2.575, top speed 8.73, armour
335".

### Other screens

| Place | Shown | True? |
|---|---|---|
| Boss panel | "Hier gibt es keinen Einsatz: alle schlagen in Grundstärke zu, und auch schwere Gegner drücken hier nicht mit ihrem Gewicht." | Yes: stake index 0 and `bossCrushMult` 0. In my boss fights every body had crush 0. |
| Solo intro | "... Schwere Gegner drücken mit ihrem Gewicht, bei höherem Einsatz noch stärker. ... dort gibt es keinen Einsatz und niemand drückt." | Yes for the touch. See the note under m-3. |
| First weapon, light blade (thin cross, 27) | Gewicht 27 "schwer stößt Gegner weiter zurück" · Takt 0,52 "Sekunden je Wurf · leicht wirft öfter" · Schärfe 4,2 "27 Klingen · Treffer nimmt 4,2 Panzer" · Flug 41 "Kästchen pro Sekunde · leicht fliegt schneller" · legend "Strich = Klinge · mehr Klingen, mehr Schaden" | Yes: 31 ticks = 0,517 s; 60/(1+27/60) = 41,4; sharpness 4,229. No core dots, no pocket rings, no Panzer or Tempo row. |
| Shop redraw "Waffe neu zeichnen" (75 Tinte), heavy blunt 7 x 7 (49) | Gewicht 49 · Takt 0,70 · Schärfe 1,0 "keine Klinge · Treffer nimmt 1,0 Panzer" · Flug 33 | Yes: 42 ticks = 0,70 s; 60/(1+49/60) = 33,0; sharpness 1,0 with no 1,2 floor. No figure rule shown (screenshot `t-weapon-redraw-blunt.png`). |
| Rules "Solo-Arena" | 40 %; crush 0,004 per cell before the 40 %, times stake and wave factor; stake damage ×1,25/×1,5; speed ×1,1/×1,2; "3 Kästchen pro Sekunde plus 45 %"; no stake and no crush in the final fight; blunt touch 0,48; armour heals only by "Flicken" | Yes. Minor imprecision m-2. |
| Rules "Wurfwaffe" | Sharpness times element, no 1,2 floor, no armour share; 12 cells every 0,40 s at 50, 60 cells every 0,80 s at 30; heavy knocks back further; flies at most 2 s; hits within about 3 cells | Yes. |
| Rest of the rules panel (read in full) | Weight / pocket +0,1 up to 10 %; armour 60 + 0,3 + 1 per core + pockets; blade = no full 2 × 2; blunt 1,2; cut at least 1,2 plus 0,4 %; speed 32 to 9; element 30 %, plurality, tie neutral, ×1,5 / ×0,75 | Yes, unchanged from the INK-WEB-V3 re-review. |
| First-run hint | "Zeichne los, oben ist vorne. Drei Dinge zählen: Dünne Striche sind Klingen, auch schräge. Gefüllte Flächen sind Panzer. Was nicht dranhängt, tropft ab." | Yes. |
| Element lines | Tie 40 red + 40 blue: "Neutral · Gleichstand: kein Element" (not cut at 400 or 780 width; r-1 fixed). 30 % red: "Glut · schlägt Moos, verliert gegen Flut". 30 of 101: "ab 30 % bunter Tinte (jetzt 29 %)". | Yes. |
| Figure stats | Block 100 / 154 / 1,0 / 16, "64 Kern-Punkte". Block with blade 112 / 158 / 2,0 / 15, "12 Klingen". Disc 208 / 270 / 1,0 / 10, "148 Kern-Punkte". Thick shell (14 × 14, two-cell wall) 96 / 108 / 1,0 / 16, "Schub 102,4 · Hohlraum schiebt mit", 64 rings. | All equal my values (shell: 64 pocket cells that touch no ink, 60 + 28,8 + 19,2 = 108). |

**Not checked:** a sharp heavy enemy, where crush and "bis" appear together,
and elements other than neutral in the stake line. Both run through the same
code path as the cases above.

## 3. First-run hint

| Check | Result |
|---|---|
| Shows the first time a drawing screen opens (solo hero, free drawing) | yes; not on the weapon screen afterwards |
| "Alles klar" closes it | yes |
| A stroke that starts above the hint and runs down through it (rows 4 to 26) | closes it, all 23 cells drawn, nothing lost or bent |
| A stroke that **starts on the hint** (horizontal line through row 20 at 400 x 780) | **lost**: 0 cells drawn, hint stays open (I-1) |
| A tap on the hint text | nothing happens |
| After a reload | never returns (`inkweight.seenHint.v2` = 1) |
| Storage blocked (localStorage getter throws) | hint shows, closes, drawing works, 0 errors (acceptable) |
| Area covered | 400 x 780: rows 11 to 29, 48 % of the sheet. 400 x 660: 70 % of the sheet, and the box is wider than the canvas. 780 x 400: 48 %. 1280 x 800: 21 %. |

## 4. Ring at phone size (400 x 780, touch context, speed-up 2)

I wrote my own player (`/tmp/rv4w/ring.cjs`), not the Worker's. It steers
through the `ringPilot` hook every 0,15 s and plays like a careful newcomer:

- It picks the opponent nearest the edge and avoids picking much heavier ones.
- It gets on the target's centre side and sprints only when that pushes the
  target outward.
- It runs back to the centre when it is near the edge or a body is pressing
  it.
- It keeps the same drawing every round and never uses the catch-up ink.

The gallery was empty before every match.

| Drawing (stats) | Match | Bots | Result | How the rounds were lost |
|---|---|---|---|---|
| Block with sword (112 / 158 / 2,0) | 1 | Speer 30 (placeholder), Reif 180 (placeholder) | **won 3:0:0** | no round lost |
| Block with sword | 2 | Klotz 157, Qualle 78 | lost 2:3:0 | twice pushed out by Klotz; the last round armour broken by Klotz |
| Stick figure (61 / 78 / 3,7) | 1 | Klotz 157, Ramme 98 | **won 3:0:0** | no round lost |
| Stick figure | 2 | Speer 30, Reif 180 | lost 0:0:3 | each round armour broken by Reif (180, blunt) in about 10 to 12 s; catch-up ink unused |
| Round blob (142 / 195 / 1,0) | 1 | Ramme 98, Reif 180 | lost 1:0:3 | three times pushed out by Reif |
| Round blob | 2 | Speer 30, Klotz 157 | lost 1:3:0 | three times **armour broken by the 30-ink Speer** while Klotz was out |
| Block with sword, after saving 3 own figures (wedge, bar 144, blob 142) | 1 | both "aus der Galerie" (144, 142) | **won 3:0:1** | once pushed out |

**Empty gallery:** 2 of 6 matches won (block 1/2, stick 1/2, blob 0/2).
**With a 3-figure gallery:** 1 of 1.

Every line-up had exactly one bot of 150 ink or more, or none. Every bot card
carried a badge: "PLATZHALTER" for placeholders (text set in capitals by CSS),
"AUS DER GALERIE" for gallery figures. With three gallery figures both bots
came from the gallery; one match cannot confirm the 70 % share.

Together with the Worker's 7 of 18, a first-time player wins roughly one
match in three. A plain round blob almost never wins (0 of 8 in both
measurements). See I-2.

## 5. Solo runs (400 x 780, speed-up 2)

Hero: block with a sword (112 / 158). Weapon: thin cross. Enemy in every wave:
the 14 x 15 heavy block. "Flicken" whenever armour was missing. Steering: the
core's own hero bot, which is what the Worker's `solo_play.cjs` does (copied
to `/tmp` with only the page path changed). Brawl means it runs into enemies,
like most newcomers will. Kite means it keeps away and lets the weapon work.

| Run | Waves (armour lost of 158) | Boss | Result |
|---|---|---|---|
| x1 brawl | 10 / 13 / 21 / 30 / 41, healed to full each time | entered with 158 of 158; **dead after 64 s** | lost at the boss, 1830 ink |
| x1 kite | 0 / 0 / 0 / 0 / 0, nothing bought | won after 147 s, 14 lost | won, 1620 ink |
| x2 brawl | 46 / 79 / 124, then 65 of 65 in wave 4 (2 copies) | — | lost in wave 4, 1040 ink |

- **Do the numbers match what happens?** Yes, the stake line matched the
  spawned body in every wave (section 2).
- **Is the boss fair?** For a brawler at x1 the five waves are easy and the
  boss is a wall. The Worker won it with 3 of 158 left; I lost it with full
  armour (I-3). A kiter wins almost untouched.
- **Does the shop explain itself?** Yes. It shows the price, what each upgrade
  does ("+40 Tinte, du zeichnest ihn neu (Schaden bleibt)", "heilt 35 % deines
  Panzers"), that armour does not heal by itself, and that the leftover purse
  is not used. "Neue Waffe eingepackt." confirms a redraw.

## 6. Layout

Every layout check showed no overlap between canvas, stake note, stake
buttons, main button, ink meter and stat list, and no sideways scroll.

| Window | Main button bottom | Stake line with drip warning | Stake line with "Tinte ist alle" | Rules panel |
|---|---|---|---|---|
| 400 x 780 | 772 | cut: "… · Tempo 8,7 · …", "Panzer 175" lost (420 of 368 px) | cut by 7 px: "Tinte ist al…" | scrolls (1455 / 780), closes |
| 400 x 660 | 652 | same cut (screenshot `e-400x660-drip.png`) | same | scrolls (1455 / 660), closes |
| 780 x 400 | 364 | cut by 16 px, last number lost | fits | scrolls, closes |
| 1280 x 800 | 624 | fits | fits | scrolls, closes |

**Is the cut part important?**
- With a drip warning, yes: it is the copy's real armour, and it is the only
  place on the screen where that value is shown (I-4).
- With "Tinte ist alle", no: the ink meter shows 0 next to it.

The rules panel's only close button is at the top. After scrolling to the
end, the player has to scroll back up to close it (m-1).

## 7. Page rules, text and hooks

- **`dist/inkweight.artifact.html`:**
  - Starts with `<title>Inkweight</title>`, then the `claude:viewport-fit-sides`
    meta, then `<style>`.
  - 0 doctype, html, head or body tags; 0 http(s) URLs; no `100vh`; no
    `alert`, `confirm` or `prompt` calls.
  - The wrapper has `padding-left: max(16px, env(safe-area-inset-left, 0px))`.
  - This order's CSS adds no literal colour.
- **Debug hooks:** `__inkDebug.ringPilot` and `soloPilot` are `undefined` on
  a fresh page. Nothing in the page code sets them, so a normal player never
  meets them.
- **Errors, network, sideways scroll:** across all my runs (truth, hint and
  layout in 4 windows, storage blocked, 7 Ring matches, 3 solo runs, desktop
  check) I saw 0 console errors, 0 unhandled rejections (listener installed),
  0 network requests and no sideways scroll.
- **German text:** plain and short, decimal commas, no spelling mistakes
  found.

## 8. Scope

- Core, tests, sim, tools, `Source/Shared` and `Docs/INK_RULES_V2.md` are
  unchanged between the merge commit `148176d` and HEAD.
- Since `cf9a4da` (the state before this dispatch), WebPrototype has changed
  only in `app/` (botpick.js new; drawscreen, gallery, main, page.html,
  ringmode, solomode, style.css), `build/` (verify.cjs, ring_fairness.cjs and
  solo_play.cjs new) and `dist/`.
- The range `92b2b0e..HEAD` also contains:
  - the INK-CORE-V3 merge (`148176d`);
  - INK-UNITY-V3 files under `Source/Unity`;
  - Director state files `Projects/Inkweight/Docs/WORK_STATE.md` and
    `CURRENT_HANDOVER.md` (commit `28f26b6`, INK-UNITY-V3 closure);
  - dispatch and evidence artifacts of other orders.
- None of those belongs to this order. This order's evidence is only in
  `Artifacts/Inkweight/Evidence/INK-WEB-V4`.

## Findings

### Blocker

None.

### Important

**I-1 The first-run hint swallows a stroke that starts on it.**

Steps:
1. Fresh storage, 400 x 780.
2. Solo or "Frei zeichnen".
3. Start a stroke in the middle or lower half of the sheet, for example a
   line through row 20.

Result: no cell is drawn and the hint stays open. A tap on the hint text does
nothing either. On a phone the hint covers 48 % of the sheet; at 400 x 660 it
covers 70 % and is wider than the canvas. Only strokes that start in the top
third close it. This is the first thing a newcomer touches. It does not stop
play, because "Alles klar" works, but the first stroke is lost and the hint is
in the way.

Place: `app/style.css` `.hint` (absolute box over the canvas, no
`pointer-events` rule) and `app/drawscreen.js` (`beginStroke` hides the hint
only for strokes that reach the canvas).

Fix, either of:
- `.hint { pointer-events: none }` with `.hint button { pointer-events: auto }`,
  so a stroke on the hint reaches the canvas and `beginStroke` closes it;
- or move the hint to a slim band at the top of the sheet (or below it), with
  `max-width` equal to the canvas.

**I-2 Ring first matches: still about one in three, and a plain blob almost
never wins.**

Measurements:
- Mine: 2 of 6 at phone size with an empty gallery. Blob 0/2, stick 1/2,
  block 1/2.
- The Worker's: 7 of 18. Blob 0 of 6.

How the losses happened:
- The 142-cell blob lost three rounds to the 30-ink "Speer", which cut its
  armour while "Klotz" was out.
- The stick figure was broken three times by "Reif" (180) in about 10 s each.

The pairing rule itself holds: one heavy bot at most, badges shown. This is
playable, so it is not a FAIL, but the order's aim of about one in two is not
met for blunt or very light first drawings.

Fix, in `app/botpick.js`:
- For the first match of a fresh gallery, use only "Klotz" as the heavy
  placeholder, not "Reif" (180 ink, the widest pusher).
- Pair it with "Qualle" or "Ramme", not "Speer".
- Or, for the very first match only, take one heavy and one light bot of
  fewer than 100 ink.

Measure again with the blob.

**I-3 Solo x1: easy waves, then a boss that kills a brawler with full
armour.**

My x1 brawl run lost at most 41 of 158 armour per wave and healed to full,
then died in the boss fight after 64 s. The Worker's identical setup won it
with 3 left. A kiter wins untouched. For a first-time player who runs into
enemies, the most likely way to play, the first run will probably end at the
boss after five easy waves. The boss panel says nothing about how to survive
it.

This is mainly a core balance matter (`bossArmourMult`, escorts; the tuning
is read-only here).

Page-side fix: in the boss panel (`app/solomode.js`, `fightOverlay('Der
Endgegner', ...)`), show the boss armour and the number of escorts, and add
one tip: "Halte Abstand – deine Waffe wirft von selbst."

For the Director: consider a core order to soften the boss for x1 runs.

**I-4 Enemy screen: the real enemy armour is cut on a phone when there is a
drip warning.**

Steps:
1. Solo wave 1 at 400 x 780 or 400 x 660.
2. Draw the heavy block plus one loose cell.
3. Pick ×2.

The line reads "1 Kästchen tropft ab · ×2 · als Gegner: Treffer 1,7 · Tempo
8,7 · …". "Panzer 175" is lost. Above it, the stat rows still show the
drawing's figure values, "Panzer 279" and "Tempo 10", with no word saying so.
So the only visible armour number is the wrong one for this enemy. Nothing is
false, but it misleads the stake decision.

Place: `app/solomode.js` `show()` and the `.stake-note` style.

Fix, either of:
- let the stake note wrap to two lines with a fixed two-line height (so
  nothing moves);
- or show the drip warning in the stat area instead.

Also label the figure rows on the enemy screen, for example "Panzer (als
Figur)", or replace Panzer and Tempo there with the copy's values.

### Minor

- **m-1** The rules panel can only be closed from its top. After scrolling to
  "Wurfwaffe" on a phone (the panel is 1455 px high), the player must scroll
  back up. Fix: make the panel header with "Schließen" sticky, or add a second
  "Schließen" button at the end (`app/page.html`, `#rulesLayer`).
- **m-2** Rules "Solo-Arena": "eine stumpfe Berührung macht dort 0,48
  Schaden" is true for neutral figures only; the element still multiplies
  (×1,5 or ×0,75). Fix: "… 0,48 Schaden (vor dem Element)" in `app/main.js`
  `rulesSolo`.
- **m-3** The solo intro says "bei höherem Einsatz noch stärker". Per touch
  that is true. The crush alone can drop slightly when the higher stake buys
  an extra copy. Example: a 186-cell design in wave 4 has crush 2,22 at ×1,5
  and 1,98 at ×2, while the touch still rises from 1,71 to 1,91. No change
  needed; noted so nobody "fixes" the sentence into a false one.
- **m-4** "Tinte ist alle" is cut to "Tinte ist al…" at 400 px. It is
  harmless, because the meter shows 0.
- **m-5** A thick hollow shell shows "volle Fläche schützt · 0 Kern-Punkte".
  This is true but reads oddly for a shell, and it existed before this order.
  Fix: for 0 core cells, use "keine volle Fläche · Hülle zählt" or similar.

## First impression

What a first-time person will enjoy:
- Drawing feels direct, and the numbers react on every stroke.
- Thin lines really do turn into blades, and the weapon screen now speaks
  "weapon" (Takt, Flug).
- Seeing their own block ram a placeholder out of the ring with a sprint is
  satisfying.
- In solo, the stake line tells them exactly what a hit will cost. Going x2
  with a big block is a real gamble now.

What will annoy them:
- **The very first touch on the sheet.** If they start drawing in the middle,
  nothing happens until they press "Alles klar" or start higher up (I-1).
- **The Ring.** A round blob or a stick figure will often lose its first match
  to a big hoop or a tiny spear without understanding why. Roughly one match
  in three is won (I-2).
- **Solo at x1.** If they run into enemies, the five waves feel easy and the
  boss then ends the run abruptly (I-3).
- **The enemy screen.** On a phone it shows two different armour numbers, or
  hides the right one (I-4).

What the Human should know before playing:
- Press "Alles klar" or start the first line near the top.
- In the Ring, a block with a thin sword or a stick figure has the best
  chance. Losing gives more ink: drawing bigger next round helps.
- In solo, keep away from enemies and let the weapon throw; a hero that runs
  in usually loses to the boss.
- The numbers under the stake buttons are the real ones for that enemy. The
  rows above them describe the drawing as a figure.
