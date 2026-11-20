# INK-WEB-V5 Independent Review

Independent review verdict: PASS

Reviewer: QA Lead, a separate Reviewer task that did not build this work.
2026-11-20, 05:23 to about 05:50 UTC. Candidate: HEAD `aa46f5e` ("INK-WEB-V5
Worker result ..., unreviewed"), working tree clean before and after. Base for
the change: `fedda16` ("INK-WEB-V4 independent review PASS ..."). I fixed,
committed and pushed nothing. This file is the only repository file I created;
the rebuild changed no dist file. My scripts, logs and screenshots are under
`/tmp/rv5` (automated check) and `/tmp/rv5w` (my own checks).

Why PASS:
- I-1 to I-4 are fixed (I-1, I-4) or clearly improved (I-2, I-3), and I found
  no regression against INK-WEB-V4.
- Every new or changed number and sentence I checked is true for the rules
  and `ink_tuning.json`.
- The automated check passes in all seven setups; the page rules and the scope
  hold; no crash, dead end, lost input that stops play or unreadable screen.

## 1. Rebuild, automated check, scope

```text
$ /opt/node22/bin/node build/build.mjs
BUILD OK modules=21 inkweight.html=235528B inkweight.artifact.html=235401B
$ sha256sum -c /tmp/rv5_hash.txt   (hashes taken before the rebuild)
dist/inkweight.artifact.html: OK
dist/inkweight.html: OK
```

Byte-identical (artifact `16f69feb...`, html `efc8d7cf...`, as the Worker reports).

```text
$ /opt/node22/bin/node build/verify.cjs all --shots /tmp/rv5     (exit 0)
PASS phone: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 97 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (74 s)
PASS landscape: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 105 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (76 s)
PASS desktop: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 103 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (75 s)
PASS artifact: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 94 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (74 s)
PASS duo: two humans drew in turns, a drawing timed out and got a placeholder, both keyboard zones were held, leaving took two taps, 0 console errors (38 s)
PASS checks: 22 single checks passed (double taps, asking before discarding, ink empty, finger off the canvas, rotation in a stroke, bot twin, stains, honest stakes, both solo loss paths; version 2: block with blade, diagonal blade, pocket marks, what Ende asks), 0 console errors, 0 network requests (60 s)
PASS stable: the canvas kept its rectangle before, in and after the first stroke on 15 drawing screens (400 x 780, 400 x 660, 780 x 400), main button always inside the window, the first stroke starts on the open hint, draws and closes it, the stake line of the enemy is never cut and the drip warning has its own line, shop tap with a second finger works, 0 console errors (57 s)
VERIFY OK phone landscape desktop artifact duo checks stable
```

Scope `fedda16..HEAD`: under `Projects/` only WebPrototype `app` (botpick.js,
drawscreen.js, main.js, page.html, ringmode.js, solomode.js, style.css),
`build` (verify.cjs, solo_play.cjs) and `dist` (2 files) changed. `Source/Shared`,
`core`, `tests`, `sim`, `tools` and `Projects/Inkweight/Docs`: no diff. The
rest of the range is this order's dispatch files (`DirectorDispatch/INK-WEB-V5`)
and evidence (`Evidence/INK-WEB-V5`).

## 2. I-1 First-run hint (my script `/tmp/rv5w/hint.cjs`, fresh profile, touch)

The hint is now a dashed band at the top of the sheet, with `pointer-events: none` except on "Alles klar".

| Window | Canvas x y w h | Band (share of sheet height) | Stroke on band | Stroke below band (row 20) | Stroke starting on "Alles klar" | Canvas same before/during/after | Reload | Storage blocked |
|---|---|---|---|---|---|---|---|---|
| 400 x 780 | 24.5 76.2 351 351 | 339 x 65, inside, 19 % | 13 cells drawn, hint closed | 15 cells, closed | 0 cells, hint stays open | yes (all 4 cases) | not shown again | shows again after reload, draws, 0 errors |
| 400 x 660 | 53.5 76.2 293 293 | 281 x 79, inside, 27 % | 13, closed | 15, closed | 0, stays open | yes | not shown | same |
| 780 x 400 | 20 60 324 324 | 312 x 65, inside, 20 % | 13, closed | 15, closed | 0, stays open | yes | not shown | same |
| 1280 x 800 (mouse) | 110 123 630 | 618 x 46 | row 2 line: 21 cells, closed | – | – | – | – | – |

Strokes drew exactly the expected cells. Fixed. A drag that starts on the
button draws nothing and does not close the hint (m-6); the Worker's note says
it closes, which is not what I see with touch.

## 3. I-2 Ring (my own player `/tmp/rv5w/ring.cjs`, 400 x 780, speed-up 4, empty gallery before every match)

My player differs from the Worker's: it targets the opponent nearest the edge,
avoids much heavier ones, attacks from the centre side, sprints only when that
pushes outward, and retreats when near the edge or pressed. It never uses the
catch-up ink. My drawings are my own (block 12 x 10 with a 1-wide sword, stick
figure, blob of radius 6,6).

| Drawing (stats) | Bots | Result | How rounds were lost |
|---|---|---|---|
| Block + sword (132 / 180 / 2,0) | Qualle 78, Klotz 157 | won 3:0:0 | – |
| Block + sword | Ramme 98, Klotz 157 | won 3:0:0 | – |
| Stick figure (67 / 80 / 3,6) | Klotz 157, Ramme 98 | won 3:1:0 | once pushed out |
| Stick figure | Ramme 98, Klotz 157 | won 3:0:0 | – |
| Round blob (140 / 190 / 1,0) | Klotz 157, Qualle 78 | **lost 2:3:0** | three times pushed out (Klotz won all three) |
| Round blob | Klotz 157, Ramme 98 | won 3:2:0 | twice pushed out |

5 of 6 won; every drawing won at least once; 0 console errors. The blob is still
the weakest drawing (loses rounds to Klotz) but now wins. Line-ups: always
"Klotz" plus "Ramme" or "Qualle", all with the "PLATZHALTER" badge; never Reif,
Speer or Stachel; one heavy bot. 1 human + 3 bots (4 fresh starts): always
Klotz + Ramme + Qualle, one heavy. Two humans: the newcomer rule does not
apply (by design, `loneHuman`), and no tip line is shown (code: `humans.length === 1`).
Only bots: no tip.

Tip after a lost round, both cases seen:
- pushed out, rounds 1 to 4: "Du bist aus dem Ring geflogen. Versuch es mit mehr Tinte: schwer schiebt stärker, ist aber träger, die Aufholtinte hilft dabei."
- pushed out, last round: same sentence ending "... ist aber träger." (correct: no next drawing)
- armour broken (forced in `/tmp/rv5w/ring2.cjs`): "Dein Panzer ist zerbrochen. Versuch es mit mehr gefüllter Fläche: die hält mehr aus, die Aufholtinte hilft dabei."
- won round: no tip.

The tip always matched the reason shown in "Du: ...". True: weight pushes and
slows (speed 32 down to 9 with weight); armour = 60 + 0,3 per cell + 1 per core
cell, so filled area holds more; the panel still says "Wer verloren hat,
bekommt 15 % mehr Tinte" (`catchUpPercentPerLostRound` 15). The round ends only
when at most one body is left (`core/ring.js`), so a losing lone human always
has an out reason. Improved, no regression.

## 4. I-3 Boss (Worker's `solo_play.cjs` copied to `/tmp/rv5w`, page path changed only; 400 x 780, x1, speed-up 8)

My own value: the boss is the union of the five wave drawings (the same 14 x 15
block, 210 cells), armour 279 (V4 review, and the enemy screen row "279 als
Figur" here) x `bossArmourMult` 1,2 = 334,8, rounds to 335; escorts 5 designs x
`bossEscortCopies` 1 = 5.

| Run | Waves (armour lost of 158) | Boss panel | Fight bodies | Result |
|---|---|---|---|---|
| runs in (brawl) | 10 / 14 / 21 / 29 / 41, Flicken each time | "Sein Panzer: 335 · Begleiter: 5 · dein Panzer: 158 von 158" | boss hp 335, 5 escorts of 182, crush 0, touch 0,48 | **dead after 66 s** at the boss |
| keeps away (kite) | 0 / 0 / 0 / 0 / 0 | same | same | won after 107 s with 68 of 158 left |

Panel numbers are true. Tip "Halte Abstand. Deine Waffe wirft von selbst, und
dein Panzer heilt im Kampf nicht." is true (throws are automatic in `soloStep`;
armour heals only through "Flicken"). The solo intro ends with "Tipp: Halte
Abstand, deine Waffe wirft von selbst." (400 x 660: no scroll, screenshot
`/tmp/rv5w/solo-intro-660.png`). The boss itself is unchanged (core): a hero
that runs in still loses it. Improved as far as the page can go.

## 5. I-4 Enemy screen (my script `/tmp/rv5w/enemy.cjs`, touch, hero block + sword 158)

Line 1 (`#stakeLine`) in all three windows, never cut (`scrollWidth <= clientWidth`):

| Design, stake | Shown | Mine (V4 reference calc, hero 158) |
|---|---|---|
| Heavy block 14 x 15, x1 | Treffer 0,6 · Tempo 7,3 · Panzer 91 | 0,648 · 7,28 · 90,9 |
| Heavy block, x1,5 | 1,1 · 8,0 · 131 | 1,054 · 8,01 · 130,9 |
| Heavy block, x2 | 1,7 · 8,7 · 175 | 1,688 · 8,73 · 174,5 |
| Line of 12, x1 | bis 2,1 · 17,6 · 23 | 2,04 + 0,4 x 0,004 x 15 more hero armour = 2,06 · 17,6 · 23,0 |
| Line of 12, x1,5 | bis 2,6 · 19,4 · 23 | 2,58 · 19,36 · 23,0 |
| Line of 12, x2 | bis 3,1 · 21,1 · 23 | 3,10 · 21,12 · 23,0 |

Line 2: "Die Zeilen oben zeigen die Zeichnung als Figur." without a warning;
"1 Kästchen tropft ab" (ember) with a drip, line 1 unchanged; "Tinte ist alle"
at 220 cells, line 1 unchanged (m-4 fixed on this screen). Rows read "Panzer
279 als Figur · volle Fläche schützt · 156 Kern-Punkte" and "Tempo 10 als
Figur · ...". Line of 12 shows "kein Kern-Punkt · jedes Kästchen zählt etwas"
(m-5; true, 0,3 per cell).

Layout: main button bottom 772/780, 652/660, 372/400; stake note never overlaps
the button; canvas constant across stakes, drip and ink-out (287 / 229 / 324
px); no sideways scroll; 0 errors. "Regeln" touches the selected x2 button by
2 px at 780 x 400 and sits 1 px above it at 400 x 660; V4 had the same (253,9
vs 251,9 at 780 x 400), so not a regression (m-8). Fixed.

## 6. Regressions and the rest

- Whole flow at phone size, sideways and desktop: the `phone`, `landscape`,
  `desktop` and `artifact` scenarios played start, free drawing, gallery, a
  full Ring match, a solo run with four different shop purchases (including
  the hero redraw), rules panel; screenshots looked at (`phone-04`, `phone-12`
  and others). Desktop start and drawing also by my own script: band 618 x 46
  on a 630 px sheet, mouse stroke on the band draws and closes it.
- Rules panel at 400 x 660: opens, scrolls, closes with the top "Schließen" and
  with the new one at the end. "Im Endkampf ... 0,48 Schaden (vor dem
  Element)." True (`bluntDamage` x `enemyDamageMult`, element multiplies after).
- Errors, network, sideways scroll: 0 console errors, 0 unhandled page errors,
  0 non-file requests and no sideways scroll in all my runs and in the check.
- German text added or changed by this order: correct and plain. Small style
  point under m-7.
- Page rules, `dist/inkweight.artifact.html`: starts with `<title>Inkweight</title>`,
  then the `claude:viewport-fit-sides` meta, then `<style>`; 0 doctype/html/head/body
  tags; 0 http(s) URLs; no `100vh`; no alert/confirm/prompt;
  `"version":"ink-tuning-3"` once; wrapper `padding-left: max(16px,
  env(safe-area-inset-left, 0px))`; this order's CSS adds no literal colour.

## State of the findings

| Finding | State |
|---|---|
| I-1 hint swallows a stroke | Fixed (band 19 to 27 % of the sheet, touches pass through, canvas unchanged). |
| I-2 Ring first matches | Clearly improved: my player 5 of 6 (Worker 13 of 18); no drawing without a win; blob still weakest. |
| I-3 boss without warning | Improved: true panel numbers and a true tip; the boss is still a wall for a hero that runs in (core matter). |
| I-4 enemy armour cut | Fixed: line 1 always whole, rows labelled "als Figur". |
| m-1 second Schließen | Fixed. |
| m-2 "(vor dem Element)" | Fixed. |
| m-3 | No change needed, none made. |
| m-4 "Tinte ist alle" cut | Fixed on the enemy screen (other drawing screens not rechecked by me either). |
| m-5 shell "0 Kern-Punkte" | Fixed. |

## New findings

### Blocker

None.

### Important

None.

### Minor

- **m-6 A drag that starts on "Alles klar" is lost.** Steps: fresh profile, any
  window, "Frei zeichnen", put the finger on "Alles klar" and drag into the
  sheet. Result: nothing drawn, hint stays open (a plain tap closes it). The
  button is 79 x 36 px, so this is rare. The Worker's result says the hint
  closes in that case; with touch it does not. Place: `app/drawscreen.js`
  (`drawHintOk` click listener). Fix: also close the hint on `pointerdown` on
  the button, or make the button smaller and put it at the band's end.
- **m-7 Ring tip repeats the line above it.** "Du: aus dem Ring geflogen" is
  followed by "Du bist aus dem Ring geflogen. Versuch es ...". Place:
  `app/ringmode.js` (`ringTip`). Fix: start the tip with "Tipp:" and drop the
  first sentence, e.g. "Tipp: mehr Tinte schiebt stärker, ist aber träger; die
  Aufholtinte hilft dabei."
- **m-8 "Regeln" touches the stake buttons** (2 px at 780 x 400 when x2 is
  selected, 1 px gap at 400 x 660). Same in V4. Place: `app/style.css`
  `.rules-btn` / `.stats li.el-row`. Fix: a 4 px bottom margin on the element row.
- **m-9 Enemy canvas at 400 x 660 is smaller**: 229 px (7,2 px per cell),
  V4 245 px, because the stake note now has two lines. It stays constant.
  Fix if wanted: the line-2 note "Die Zeilen oben zeigen ..." could move into
  the row labels, giving one line back on short screens.

Not tested: a real phone; the Ring with a gallery of own figures; a sharp heavy
enemy with an element in the stake line.

## What the Human should know before playing

1. The first line can start anywhere on the sheet now; the hint band closes itself.
2. In the Ring the first opponents are "Klotz", "Ramme" and "Qualle"; a round blob is still the hardest start, a block with a thin sword or a stick figure wins most.
3. In solo, keep away from enemies and let the weapon throw: a hero that runs in still usually loses to the boss.
4. On the enemy screen the first line under the stake buttons is the real enemy; the rows above say "als Figur".
5. A drag that starts on the "Alles klar" button does nothing; just tap it or draw elsewhere.
