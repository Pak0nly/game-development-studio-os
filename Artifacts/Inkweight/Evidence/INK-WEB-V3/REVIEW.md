# INK-WEB-V3 Independent Review

Independent review verdict: FAIL

Reviewer: QA Lead (independent Reviewer task; did not build the candidate).
Date: 2026-11-20, about 02:00 to 03:20 UTC (over the 50-minute target).
Candidate: HEAD `4a0f3e6` ("INK-WEB-V3 Worker result"), working tree of
`WebPrototype` equal to HEAD. Base: `d667b7a` ("INK-WEB-V2 independent review
PASS"). Nothing was fixed, committed or pushed by the Reviewer. This file is the
only repository file I created; the rebuild changed no dist file.

Why FAIL: every number on the drawing screen matched my own computation, the
page runs on core version 2, N-1 is fixed, there is no blocker and the automated
check passes. But two statements about the rules shown to the player are false
(F-1 element line, F-2 armour line of the rules panel). The order's rule is
that a false statement about the rules is a FAIL. Both are one-line text fixes
in `app/drawscreen.js` and `app/main.js`; after them and a rebuild I expect PASS.

## What I ran (real output)

```text
$ cd Projects/Inkweight/Source/WebPrototype && node build/build.mjs
BUILD OK modules=20 inkweight.html=213836B inkweight.artifact.html=213709B
sha256 before = after: 5600f2df...107b (artifact), ddb06eef...c52a (html)  -> IDENTICAL
$ node build/verify.cjs all --shots /tmp/rv3
...
PASS checks: 18 single checks passed (double taps, asking before discarding, ink empty, finger off the canvas, rotation in a stroke, bot twin, stains, honest stakes, both solo loss paths; version 2: block with blade, diagonal blade, pocket marks, what Ende asks), 0 console errors, 0 network requests (59 s)
VERIFY OK phone landscape desktop artifact duo checks
```

(I captured only the tail of this run; VERIFY OK requires all six setups to
PASS. 78 screenshots in /tmp/rv3.)

Core version in the bundle: `"version":"ink-tuning-2"` present;
`ink-tuning-1` occurs only inside the tuning note text; `isSharpCell` 7 and
`countEnclosed` 4 occurrences; `sharpMinEmptyNeighbours` 0.

Own scripts (under /tmp/rv3me, Playwright `chromium.launch()` without options):
`mystats.cjs` computes the stats from INK_RULES_V2.md and ink_tuning.json only
(body, core, 2 x 2 blade rule, pockets, push, armour, sharpness, speed, element);
`truth.cjs` draws each drawing cell by cell on the free drawing screen and reads
the panel; `play.cjs` plays Ring and Solo with CDP touch (stick finger plus a
second finger on Sprint), steering from body positions read through a
read-only wrapper of `ringStep`/`soloStep`; `old.cjs` repeats the old findings
and tap checks at 400 x 780, 780 x 400, 1280 x 800 and 400 x 660.

## Truthfulness table (400 x 780; my values from the rules, shown values from the page)

| Drawing | My values (N / armour / sharp / speed / element; S, C, P, push) | Shown | Match |
|---|---|---|---|
| 10 x 10 block | 100 / 154 / 1,0 / 16 / Neutral; S 0, C 64 | 100 / 154 / 1,0 / 16 / Neutral; blade marks 0; "Kern-Kästchen (Punkt): 64"; "keine Klinge: ..." | yes |
| block + 12-cell straight blade | 112 / 158 (157,6) / 2,0 (2,034) / 15; S 12 | 112 / 158 / 2,0 / 15; blade marks 12; "12 Klingen · Schnitt nimmt auch 0,4 % Panzer" | yes |
| block + 12-cell diagonal blade | 112 / 158 / 2,0 / 15; S 12 | same as straight; blade marks 12 | yes |
| stick figure (thin hollow head) | 57 / 77 / 3,7 / 21; S 57, P 1, counted 0 | 57 / 77 / 3,7 / 21; marks 57 blades, 1 pocket; "Hohlraum zählt erst mit dicker Wand (2 Kästchen)" | yes |
| 13-cell dot | 13 / 65 (64,9) / 1,7 / 32; S 4, C 1 | 13 / 65 / 1,7 / 32; "4 Klingen ..." | yes |
| filled disc | 208 / 270 / 1,0 / 10; C 148 | 208 / 270 / 1,0 / 10 | yes |
| thin-walled ring (1-cell frame) | 52 / 76 / 3,8 / 22; S 52, P 100, counted 0 | 52 / 76 / 3,8 / 22; 100 pocket rings drawn; "Hohlraum zählt erst mit dicker Wand" | yes (see m-5) |
| thick shell (2-cell frame) | 112 / 124 (123,6) / 1,0 / 15; P 100, push 122 | 112 / 124 / 1,0 / 15; "Schub 122,0: der Hohlraum schiebt mit (+10,0)" | yes |
| 30 % red | 100 / 154 / ... / Glut | Glut, "schlägt Moos, verliert gegen Flut" | yes |
| 29 % red | Neutral, 29 % | Neutral, "ab 30 % einer Farbe (jetzt 29 %)" | number yes, wording no (F-1) |
| 20 red + 20 blue (tie) | Neutral, 40 % coloured | Neutral, "ab 30 % einer Farbe (jetzt 40 %)" | **no (F-1)** |
| 20 red + 10 blue | Glut (red alone 20 %) | Glut | yes, contradicts the neutral wording (F-1) |
| over-budget scribble (252 cells wanted) | first 220 cells: 220 / 278 / 1,0 / 9 | 220 / 278 / 1,0 / 9; ink 0; "Tinte ist alle: radier etwas weg." | yes |
| block + 5 loose cells | 100 / 154; drips 5 | 100 / 154; "5 Kästchen hängen nicht dran und tropfen ab." | yes |

All four bars matched my values with the stated bar ends (armour 60 + 1,1 x budget,
sharpness 1 to 4,7, speed to 32,4). No explanation line cut on the phone; at
780 x 400 "keine Klinge: 1 Kästchen dünne Striche schneid..." and "Hohlraum
zählt erst mit dicker Wand ..." end in an ellipsis (m-2).

Solo stakes, compared with my own copies/drop/armour-scale formula (CHANGES_V2
B10) for an enemy of 12 cells in waves 1 to 5 at x1, x1,5, x2: every "n Gegner ·
m Beute" matched (for example wave 4: 5 / 300, 8 / 448, 10 / 600), and the note
"halten 15 % mehr aus (übrige Tinte)" matched my scale 1,15; at x2 "schlagen
50 % härter zu, sind 20 % schneller" matches stakeDamageMult/stakeSpeedMult.
Boss line "Hier gibt es keinen Einsatz: alle schlagen in Grundstärke zu" is true
(stake index 0). Line-up "Gewicht 112 · Panzer 158 · Schärfe 2,0" true.

Rules panel: weight, sharpness, speed (12 -> 32, 220 -> 9), element circle
(Glut > Moos > Flut > Glut), multipliers x1,5 / x0,75 and the fight lines are
true; the armour line is not (F-2); "Schaden wie die Schärfe (stumpf: 1,2)" is
imprecise (m-6).

## Old findings

| Finding | State | Evidence |
|---|---|---|
| N-1 "Ende" asks "Verwerfen?" | fixed | Ring drawing screen, first tap with and without a stroke at 400 x 780, 780 x 400, 1280 x 800, 400 x 660: "Spiel beenden?" / "Noch einmal tippen, dann endet das ganze Spiel."; label back to "Ende" after 2,8 s. Solo enemy: "Lauf beenden?" (verify checks line). Free draw still asks "Verwerfen?" (verify checks-01). |
| N-3 Ring setup sideways | fixed | 780 x 400: "Los, zeichnen!" bottom 327 of 400 |
| N-4 "geht an Du" | fixed | my Ring match: "Runde 1 geht an dich" |
| N-5 bot shows my shape in another colour | fixed in code (shape compare in `sameCells`), automated "bot twin" check passes; not reproduced by hand |
| N-6 two numbers called "Tinte" | fixed | HUD "Welle 1 von 5 · Gegner 1 · Beutel 0 ..." |
| N-7 tap block drops a stroke / swallows a click | fixed in code (held stroke starts after the block; swallow cleared on pointerup); double tap on "Los, zeichnen!" gives an empty sheet and normal drawing after; I did not reproduce the held-stroke case by hand |
| N-8 stroke ends on any resize | fixed in code (width and orientation only); not testable in emulation |
| N-2 build folder | fixed | `git check-ignore` on build/zz_new.txt and build/sub/x.js exit 1; build.mjs and verify.cjs tracked |

## New findings

### Blocker

None. No crash, dead end or unreadable main screen in about 10 full or partial
runs; 0 console errors, 0 page errors, 0 network requests, no sideways scroll.

### Important

**F-1. Element line states a wrong rule and contradicts itself on a tie.**
Steps: free draw, 10 x 10 block, paint two rows red and two rows blue (40 %
coloured, tie): element "Neutral", line "ab 30 % einer Farbe (jetzt 40 %)".
And: 2 rows red + 1 row blue = 20 % red, 10 % blue: element "Glut", although
no colour reaches 30 %. The rule (INK_RULES_V2 section 4, and the page's own
rules panel) is 30 % coloured ink in total, then the strict plurality; a tie
is neutral. Place: `app/drawscreen.js`, `updatePanel`, the `else` branch that
builds `why`. Fix: `pct >= minColouredPercent` -> "Gleichstand der Farben:
kein Element"; otherwise "ab 30 % bunter Tinte (jetzt N %)".

**F-2. Rules panel armour formula leaves out the pocket armour.** "So viel
hältst du aus: 60 als Grundwert, jedes Kästchen +0,3, jedes ringsum
eingeschlossene Kern-Kästchen noch +1." A thick shell of 112 cells and 0 core
cells gives 93,6 by this line, the page shows 124 (60 + 33,6 + 30 pocket
armour). Place: `app/main.js`, `rulesArmour`. Fix: append ", und eine dicke,
geschlossene Hülle +0,3 je Hohlraum-Kästchen (höchstens so viele, wie die
Wand dicke Kästchen hat)" or shorter "... +0,3 je Kringel in einer dicken Hülle".

**F-3. The drawing canvas changes size after the first stroke.** Measured
canvas boxes before and after drawing: hero screen 346 -> 360 px (moves 7 px
left), solo enemy screen 312 -> 291 px; at 400 x 660: 226 -> 243 and 192 -> 172.
The first stroke's stats fill the explanation lines and the stake note, the
panel changes height and the board re-fits while the finger is still down, so
the rest of the first stroke lands on other cells (my scripted dot got a
stray drip). Place: `app/style.css` / `layout()` in `drawscreen.js`. Fix: give
`.s-why`, `#drawMsg` and `.stake-note` a fixed one-line height (ellipsis) from
the start, and fill the empty-state lines with text of the same length.

### Minor

- **m-1** 400 x 660, solo enemy screen with stakes: "In den Kampf" bottom 668
  of 660 (8 px scroll) and the canvas only 172 px (5,4 px per cell). Usable but
  tight. Fix: in short portrait hide the four explanation lines or put the
  stake note into the stake buttons.
- **m-2** Sideways the sharpness/weight explanation ends in "..." for "keine
  Klinge ..." and "Hohlraum zählt erst ...". Fix: shorter landscape texts
  ("keine Klinge", "Wand zu dünn für Hohlraum").
- **m-3** Grammar: "1 Kästchen hängen nicht dran und tropfen ab." (`drawscreen.js`
  line 148). Fix: singular for 1 ("hängt ... tropft ab"). "keine Klinge: 1
  Kästchen dünne Striche schneiden" reads oddly; "keine Klinge: nur Striche,
  1 Kästchen dünn, schneiden".
- **m-4** Solo intro says a higher stake brings "mehr Gegner"; for a big enemy
  all stakes give 1 copy (verify line "×1,5 1 Gegner"). Fix: "mehr oder
  zähere Gegner".
- **m-5** Pocket rings are drawn also where they count for nothing (thin
  frame: 100 rings, push +0). The weight line explains it, but the legend
  "Kringel = Hohlraum" invites the wrong idea. Fix: draw only counted pockets,
  or draw uncounted ones fainter.
- **m-6** Rules panel: "Ein Schnitt macht so viel Schaden wie die Schärfe
  (stumpf: 1,2)". Fix: "wie die Schärfe, mindestens 1,2".
- **m-7** (emulation only, not proven on a device) When the shop opened while
  my stick finger was still down, a tap with a new finger on "Flicken" did
  nothing (5 of 5 waves); after lifting the stick finger every tap bought.
  Worth one check on a real phone.

## Play-through (phone 400 x 780, touch, intent steering)

- Ring vs two bots (one of each style), my block with a straight sword:
  3 : 0, rounds about 18 to 25 s of wall time, match 79 s. Both bots (78 and
  84 ink placeholders) flew out of the ring every round; my heavy block was
  never in danger. "Rums!", line-up styles and "geht an dich" work.
- Solo x1, Flut, hero block + sword, weapon a 60-ink lump, enemy a small dot,
  no purchase: hero armour 157 -> 144 -> 122 -> 94 -> 58 -> 7 at the boss, lost
  at the boss ("Geschaffte Wellen: 5 von 5"). Same with "Flicken" in every
  pause: won including the boss ("Geschafft!", 1266 ink, 159 s).
- Solo x2 every wave: 157 -> 113 -> 47 -> broken in wave 3. x1,5 at 400 x 660:
  broken in wave 4. Stakes are clearly dangerous now.
- Sideways and desktop: drawing screen and a fight start; Sprint button
  bottom 382 of 400; no scroll; 4 Sprint taps, no error.
- Tap repair: rules panel double tap opens once; closing it and tapping the same
  spot 40 ms later hits nothing beneath; double tap on "Los, zeichnen!" opens
  the drawing screen once with an empty sheet; three strokes each followed by
  a colour tap, then brush, eraser, black in quick succession: every tap acted
  (weight 45, brush "Dick", black on).

## Page rules (dist/inkweight.artifact.html)

Starts with `<title>Inkweight</title>`, the viewport-fit meta and `<style>`;
0 doctype/html/head/body tags; 0 http(s) URLs, fetch, XHR, WebSocket,
sendBeacon, @import; 0 alert/confirm/prompt/style.display/100vh; side padding
`max(16px, env(safe-area-inset-left/right, 0px))`; 0 network requests and no
sideways scroll in every run. Decimal comma everywhere I looked.

## Scope

`git diff d667b7a HEAD` for this order's paths: app (10 files), build/verify.cjs,
dist (2), WebPrototype/.gitignore, Evidence/INK-WEB-V3. `git diff 7231a04 HEAD --
core Source/Shared`: empty. Core changes since d667b7a belong to INK-CORE-V2
commits before 7231a04. `.claude/worktrees/` not looked at.

## First impression

The page looks and plays well: drawing is direct, numbers react at once and
are right, a sword on a block visibly doubles the sharpness, rams feel
physical, and nothing crashed. What would spoil the first five minutes:

1. The canvas jumps a little after the first stroke (F-3). The first thing a
   person does is draw one line; it should stay where the finger is.
2. The Ring against the default bots is too easy: a filled block with one
   sword wins 3 : 0 by shoving both light placeholders out. Give the bots
   heavier or mixed figures for the first match so the first win has to be
   earned.
3. Solo at x1 without healing ends at the boss with almost no armour, and
   nothing tells the player that the "Flicken" in the shop is what decides
   the run. One line in the shop ("Dein Panzer heilt nicht von selbst") would
   make x1 feel fair.

## Notes written during the review

Notes written as I go (container restarts).

- 02:03 UTC rebuild: BUILD OK modules=20 inkweight.html=213836B inkweight.artifact.html=213709B; dist sha256 identical before/after (5600f2df... artifact, ddb06eef... html).
- 02:10 verify all --shots /tmp/rv3: last lines 'PASS checks: 18 single checks passed ... (59 s)' and 'VERIFY OK phone landscape desktop artifact duo checks' (full PASS lines to be re-captured)
- 02:25 truthfulness at 400x780 (mouse): all 13 drawings match my own numbers (table below); colour tie and 'einer Farbe' wording suspicious
- 02:40 element line wrong: 20 red + 10 blue + 70 black shows Glut although no colour reaches 30 %; neutral with tie shows 'ab 30 % einer Farbe (jetzt 40 %)'. Landscape: stSharpWhy 'keine Klinge...' and stWeightWhy 'Hohlraum zählt erst...' cut with '...'.
- 02:42 Ring phone touch play: 3:0 win, rounds ~18-25 s wall, bots flew out each round, 0 errors, 0 requests.
- 02:52 solo x1 phone touch (no purchase landed: my taps hit the 350 ms block): waves 1-5 cleared, entered boss with 7 armour, lost at boss; stakes buttons/loot match my numbers in all 5 waves. Canvas resizes after the first stroke: hero 346->360 px, enemy 312->291 px. Drip message grammar '1 Kästchen hängen ... tropfen'.
