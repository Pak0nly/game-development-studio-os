# INK-WEB-V4 Worker Result

Worker: Claude Code subagent (separate Worker task). Start 2026-11-20 03:23 UTC,
end about 04:22 UTC. Nothing committed or pushed by the Worker. Core, shared
files and tuning not touched. All changes are inside `WebPrototype/app`,
`WebPrototype/build`, `WebPrototype/dist` and this folder.

## verify-worker

```text
PASS worker receipt e262e0af5e09235a97cd5b7245f563247c4ae61905a5e714412664abf1d9276a
```

## What changed

| File | Change |
|---|---|
| `app/solomode.js` | Stake line under the stake buttons now shows the real values of the drawn enemy as a wave copy at the picked stake: what one touch takes off the hero (blunt touch with crush, "bis" the cut value if the drawing has blades, element included), its speed (`soloEnemySpeed`) and its armour (`soloEnemyArmour`), for example `×2 · als Gegner: Treffer 2,6 · Tempo 8,7 · Panzer 335`. Before: `×2: Gegner mit +50 % Schaden, +20 % Tempo, +84 % Panzer` (false for a heavy enemy in version 3). A drip warning goes in front of the line. Boss panel: "... alle schlagen in Grundstärke zu, und auch schwere Gegner drücken hier nicht mit ihrem Gewicht." Measurement hook `__inkDebug.soloPilot`. |
| `app/main.js` | Rules panel: new paragraphs "Solo-Arena" (enemy hits count 40 %, crush per ink cell times stake times wave factor, stake factors, enemy speed 3 + 45 %, no stake and no crush in the boss fight, blunt touch there 0,48) and "Wurfwaffe"; all numbers read from the tuning file. |
| `app/page.html` | First-run hint with the three things; solo intro sentence about heavy enemies and the boss; ids for the two stat names; the two rules paragraphs. |
| `app/drawscreen.js` | r-1: tie line is "Gleichstand: kein Element". Weapon screens (Director's extra check): own rows, legend and marks, see below. |
| `app/botpick.js` (new), `app/ringmode.js` | Ring bot choice, see below. Measurement hook `__inkDebug.ringPilot`. |
| `app/gallery.js`, `app/style.css` | Hint key `inkweight.seenHint.v2` (the new hint shows once, also for someone who saw the old one); hint list style. |
| `build/verify.cjs` | New or changed checks: first-run hint (three items, fits the sheet, closes, stays away after a reload), first Ring line-up (never two heavy bots, one heavy and one light placeholder), stake line against the core (touch, speed, armour; a heavy enemy must gain more than the plain stake factor), weapon screen, rules panel words, tie line, bot twin check with a three-figure gallery. |
| `build/ring_fairness.cjs` (new), `build/solo_play.cjs` (new) | Measurement scripts (not part of the page). |
| `dist/*` | rebuilt on `ink-tuning-3`. |

### Weapon screens (first weapon and "Waffe neu zeichnen"), before and now

Before, the weapon screen showed the figure rows: "Panzer" with the figure
armour value and "volle Fläche schützt · n Kern-Punkte", "Tempo" with the
figure top speed and "leicht ist flink", "n Klingen · Schnitt: auch 0,4 %
Panzer", "träge · dicke Hülle schiebt härter", the legend "Strich = Klinge ·
Punkt = Kern · Kringel = Hohlraum", core dots and pocket rings on the sheet.
None of that holds for a thrown weapon.

Now (same screen code for both weapon screens, `kind: 'weapon'`):

```text
Gewicht 27  "schwer stößt Gegner weiter zurück"
Takt 0,52   "Sekunden je Wurf · leicht wirft öfter"        (soloThrowIntervalTicks / 60)
Schärfe 4,2 "27 Klingen · Treffer nimmt 4,2 Panzer"        (no lower limit, no armour share)
Flug 41     "Kästchen pro Sekunde · leicht fliegt schneller" (throwSpeedBase / (1 + N / throwSpeedWeightRef))
legend      "Strich = Klinge · mehr Klingen, mehr Schaden"
```

No core dots and no pocket rings on a weapon sheet. The rules panel has a
"Wurfwaffe" paragraph (hit = exactly the sharpness times element, without the
minimum 1,2 and without the armour share; interval and flight for 12 and 60
cells; knock-back; flies at most 2 seconds; hits within about 3 cells of its
centre). `solo_play.cjs` compared the real throw hits: 240 hits, every one
4.229 damage, the screen showed Schärfe 4,2. Not looked at with a screenshot:
the weapon redraw screen in the shop (same code path; the automated run buys
it and passes).

### Ring bot choice (`app/botpick.js`)

- A single human never meets two bot figures of 150 ink or more.
- While the gallery has fewer than 3 figures the bots take placeholders only;
  a single human gets one heavy pusher ("Klotz" 157 or "Reif" 180) and light
  ones from "Ramme" 98, "Qualle" 78, "Speer" 30, "Stachel" 84. "Igel" (157,
  sharp) and "Wurm" wait until the gallery has 3 figures.
- From 3 gallery figures on: 70 % own gallery figure, else any placeholder;
  the heavy limit stays. Seats are shuffled. Placeholders keep their badge.

## Commands and real output (final build)

```text
$ cd Projects/Inkweight/Source/WebPrototype
$ /opt/node22/bin/node build/build.mjs
BUILD OK modules=21 inkweight.html=231632B inkweight.artifact.html=231505B
$ sha256sum dist/*
accc5372d4af5702d1291e2212e32762c75c7ff71970151e3833071dba0a62f4  dist/inkweight.artifact.html
bde18a13dff830b9fcfa7fd9f077d542bcc91675836993b719f946e2ba606e54  dist/inkweight.html
$ /opt/node22/bin/node build/verify.cjs all --shots <scratch folder outside the repository>
PASS phone: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 85 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (75 s)
PASS landscape: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 83 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (74 s)
PASS desktop: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 120 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (75 s)
PASS artifact: drew a figure, Ring match finished after 3 rounds, solo run played 4 fights with 3 different shop purchases, 108 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (78 s)
PASS duo: two humans drew in turns, a drawing timed out and got a placeholder, both keyboard zones were held, leaving took two taps, 0 console errors (38 s)
PASS checks: 22 single checks passed (double taps, asking before discarding, ink empty, finger off the canvas, rotation in a stroke, bot twin, stains, honest stakes, both solo loss paths; version 2: block with blade, diagonal blade, pocket marks, what Ende asks), 0 console errors, 0 network requests (60 s)
PASS stable: the canvas kept its rectangle before, in and after the first stroke on 15 drawing screens (400 x 780, 400 x 660, 780 x 400), main button always inside the window, shop tap with a second finger works, 0 console errors (58 s)
VERIFY OK phone landscape desktop artifact duo checks stable
```

Full log: `verify_all.txt`. `dist/inkweight.artifact.html` starts with
`<title>Inkweight</title>`, has 0 doctype/html/head/body tags, 0 http(s) URLs,
and carries `"version":"ink-tuning-3"`.

## Ring fairness

Scripted player (`build/ring_fairness.cjs`): draws the same figure every round
(never uses the catch-up ink), decides every 0,2 s, runs at the nearest
opponent from the centre side, sprints when close, turns back near the edge.
Whole matches through the real screens at fight speed-up 8, empty gallery
before every match, one human against two bots.

| Drawing | Run 1 (4 matches) | Run 2 (2 matches) | Together |
|---|---|---|---|
| block with a sword (112 / 158 / 2,0) | 2 of 4 | 0 of 2 | 2 of 6 |
| stick figure (66 / 80 / 3,6) | 3 of 4 | 2 of 2 | 5 of 6 |
| round blob (120 / 172 / 1,0) | 0 of 4 | 0 of 2 | 0 of 6 |
| all | 5 of 12 (42 %) | 2 of 6 (33 %) | 7 of 18 (39 %) |

Logs: `ring_fairness_run1.txt`, `ring_fairness_run2_final_build.txt`. Both
runs were made before the last two builds; the bot choice code did not change
after run 1 (later changes: weapon screen, stake line). No line-up had two
heavy bots.

The same choice code and the same scripted player on the core alone in Node
(scratch script, not in the repository), 60 matches per drawing: block 50 of
60, stick figure 31 of 60, blob 19 of 60, together 100 of 180 (56 %). The page
runs are lower than this; with 18 matches I cannot tell whether that is
chance. Honest reading: somewhere between two in five and one in two for this
scripted player; a pure blunt blob of middle weight loses most first matches,
a figure with blades does well. Before the change the same block lost 0 : 3
against two heavy placeholders (review r-2).

## Solo at x1 and x2 with a heavy block enemy

`build/solo_play.cjs`, phone size 400 x 780, speed-up 4, hero block with a
sword (112 / 158), weapon thin cross, enemy a 14 x 15 block (210 ink) in every
wave, "Flicken" in every pause. The hero is steered by the core's own hero bot
(a script, not a hand): "brawl" runs into the nearest enemy. Logs:
`solo_x1_brawl.txt`, `solo_x2_brawl.txt`, `solo_x2_kite.txt`.

- x1, brawl: won including the boss. Lost armour per wave 10 / 15 / 21 / 29 /
  41 of 158 (touch shown 0,6 / 0,7 / 0,8 / 0,9 / 1,0), waves last 7 to 18 s.
  Boss fight (boss plus 5 escorts, all crush 0, blunt touch 0.48): won after
  63 s with 3 of 158 armour left (6 of 158 in the first run). The waves at x1
  are easy with this enemy; the boss is the real test and was won only just.
- x2, brawl: lost in wave 4. Lost armour 46 / 79 / 124 of 158 in waves 1 to 3
  (touch shown 1,7 / 2,1 / 2,6; enemy armour 175 / 247 / 335), then two
  copies in wave 4 broke the hero from 65. The stake clearly costs something
  now for a hero that goes in.
- x2, kite (keeps away, lets the weapon work; run on an earlier build of this
  order): won everything, lost 0 armour in waves 1 to 4, 2 in wave 5, 73 in
  the boss fight, 3239 ink. This is the open point `CHANGES_V3.md` names: a
  hero faster than a single heavy copy takes the high stake almost free. Not a
  page matter; reported, not changed.
- In every wave of the two brawl runs the shown touch, speed and armour
  equalled the enemy body of the fight (for example "shown touch 2.6, Tempo
  8.7, Panzer 335 = enemy body: blunt touch 2.575, top speed 8.73, armour
  335"). In the boss fight every body had `bluntBonus` 0.

Does it feel fair? By these scripted runs: x1 fair to easy in the waves, the
boss tight; x2 with a heavy block is a real risk for a brawler and free for a
kiter. I did not play by hand, so "feel" is a reading of these numbers.

## Fresh screenshots looked at (final or last-but-one build)

- `phone-03-draw-first-hint.png`: hint with the three lines and "Alles klar"
  over the lower half of the empty sheet (193 of 351 px high); it goes away
  with the button or the first stroke.
- `landscape-14-solo-weapon.png`, `solo-x2-brawl-01-weapon.png`: weapon rows
  Gewicht / Takt / Schärfe / Flug, no line cut, blade marks only.
- `solo-x2-brawl-02-enemy-wave3.png`: "×2 · Gegner: Treffer 2,6 · Tempo +20 %
  · Panzer +84 %" (the build before the stake line got real speed and armour).
- `stable-400x660-solo-enemy.png` (final build): "3 Kästchen tropfen ab · ×1 ·
  als Gegner: Treffer bis 1,0 · Tempo…", cut at the end on this narrow screen.
- `phone-02-rules.png` (looked at, not copied): the top of the rules panel;
  the new paragraphs are below the fold and were read as text by the check,
  not seen in a screenshot.
- `phone-08-ring-lineup.png`, `checks-07-stakes-honest.png`,
  `solo-x1-brawl-04-boss-panel.png`: copied, not looked at one by one.

## Known weaknesses, not done

- The Ring numbers are on the hard side of the target in the page runs (39 %
  of 18) and uneven between drawings (blob 0 of 6). No second tuning round.
- No measurement with gallery figures as bots (`--own` exists, not run) and
  none with three bots.
- The stake line is one line: with a drip warning its end is cut on a phone;
  with "Tinte ist alle" at the end that part can be cut.
- The stat rows on the enemy screen still describe the drawing as a figure
  (Panzer 279, Tempo 10 for the block); the copy's own values are in the stake
  line ("als Gegner"). The rows carry no word that says so.
- "Treffer" in the stake line is the blunt touch (or "bis" the cut); the word
  is explained only in the rules panel.
- The first-run hint covers the lower half of the sheet until it is closed.
- The last two changes (real speed and armour in the stake line, drip warning
  first) were checked by the full automated run; the solo play logs for x1 and
  x2 brawl are from the build before the drip change, the kite log and both
  fairness runs from earlier builds of this order.
- The two measurement hooks (`ringPilot`, `soloPilot`) are in the page code;
  they do nothing unless a script sets them.
- Not proven on a real device. The rules panel is longer again and scrolls.
