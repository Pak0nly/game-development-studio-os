# INK-WEB-V5 Worker result

Worker: separate Claude Code subagent. 2026-11-20, 04:57 to about 05:23 UTC.
Nothing committed or pushed by the Worker. Mutations only in
`Projects/Inkweight/Source/WebPrototype/app`, `build`, `dist` and this folder.
Core, `Source/Shared`, tests, sim, tools and docs untouched.

Note for the Director: while I worked, commit `c2b128e` ("INK-WEB-V5 dispatch;
work in progress snapshot (Worker running)") appeared. It was not made by me
and holds an early, unfinished state of my app edits. The final state is the
working tree (see `git status` at the end).

## verify-worker

```text
PASS worker receipt 5be72445dbe3467ff950a78ec06435de7bb73037b6c9e47f3548b925aad5a375
```

## What was done

| Finding | Change | Files |
|---|---|---|
| I-1 hint swallows a stroke | The hint is a slim band on the top edge of the sheet (19 % of the sheet height at 400 x 780, 27 % at 400 x 660, 20 % at 780 x 400; before 48 % / 70 %), never wider than the sheet (placed from the canvas in `layout()`). It lets every touch through to the canvas (`pointer-events: none`, only "Alles klar" takes a tap), so a stroke that starts on it draws and closes it. Same three sentences as before; "Drei Dinge zählen:" dropped. | `app/style.css`, `app/page.html`, `app/drawscreen.js` |
| I-2 Ring first matches | While the gallery has fewer than 3 own figures, a single human meets "Klotz" (157 ink, no blade) plus "Ramme" (98) or "Qualle" (78). "Reif" (180), "Speer" and "Stachel" no longer meet a newcomer. After a lost round a single human reads one line: "Du bist aus dem Ring geflogen. Versuch es mit mehr Tinte: schwer schiebt stärker, ist aber träger, die Aufholtinte hilft dabei." or "Dein Panzer ist zerbrochen. Versuch es mit mehr gefüllter Fläche: die hält mehr aus, die Aufholtinte hilft dabei." (after the last round without the catch-up part). | `app/botpick.js`, `app/ringmode.js` |
| I-3 boss without warning | Boss panel: "Sein Panzer: N · Begleiter: n · dein Panzer: a von b" (computed as the core does: armour of the merged drawing times `bossArmourMult`, `bossEscortCopies` per wave design) and "Tipp: Halte Abstand. Deine Waffe wirft von selbst, und dein Panzer heilt im Kampf nicht." Solo intro ends with "Tipp: Halte Abstand, deine Waffe wirft von selbst." No core or tuning change. | `app/solomode.js`, `app/page.html` |
| I-4 enemy armour cut off | The stake note has two fixed lines from the start. Line 1 is always the stake line ("×2 · als Gegner: Treffer … · Tempo … · Panzer …"); line 2 carries the drip or ink warning (ember colour) or, without a warning, "Die Zeilen oben zeigen die Zeichnung als Figur." The Panzer and Tempo rows on the enemy screen start with "als Figur · ". A question ("Lauf beenden?" message) still takes the whole note. The canvas on the enemy screen is about 13 px smaller than before (287 px at 400 x 780) but never changes while drawing or when the stake changes. | `app/solomode.js`, `app/drawscreen.js`, `app/style.css` |
| m-1 | Second "Schließen" at the end of the rules panel. | `app/page.html`, `app/main.js`, `app/style.css` |
| m-2 | "… 0,48 Schaden (vor dem Element)." | `app/main.js` |
| m-4 | On the enemy screen "Tinte ist alle" now has line 2 for itself. Other drawing screens unchanged (not looked at again). | with I-4 |
| m-5 | A figure with 0 core cells shows "kein Kern-Punkt · jedes Kästchen zählt etwas" (armour gives 0,3 per cell, `armourPerCell`). | `app/drawscreen.js` |
| m-3 | Nothing to do (as the review says). | – |

Check scripts: `build/verify.cjs` (rules: "(vor dem Element)" and closing with
the second button; Ring: a lost round must carry the fitting tip, a won one
none; `stable`: the first stroke starts on the open hint, must draw, close it
and leave the canvas alone, hint inside the sheet and at most 30 % of its
height; enemy screen: line 1 uncut at ×1 and ×2 with "Panzer n" at its end,
drip warning on line 2, rows labelled, canvas unchanged when the stake
changes; a boss panel check). `build/solo_play.cjs` reads the stake line from
`#stakeLine` and compares the boss panel facts with the bodies of the fight.

Truth of the new sentences against `INK_RULES_V2.md` / `ink_tuning.json`:
weight pushes and makes slower; armour = 60 + 0,3 per cell + 1 per core cell
(+ pockets); the loser of a round gets 15 % more ink
(`catchUpPercentPerLostRound`); armour heals only through "Flicken" in the
pause; the weapon is thrown automatically; boss armour and escorts equalled
the fight bodies in 8 of 8 scripted runs (335 and 5 with the test enemy).

## Commands and real output (final build)

```text
$ cd Projects/Inkweight/Source/WebPrototype
$ /opt/node22/bin/node build/build.mjs
BUILD OK modules=21 inkweight.html=235528B inkweight.artifact.html=235401B
$ sha256sum dist/*
16f69feb3409be3c0505c915151c2dfe944d18b581f3b88ec362fc88c38081ef  dist/inkweight.artifact.html
efc8d7cf23c11387a71d4c3a067e4a9a81062115f6ca17e326cd9dc69cb92269  dist/inkweight.html
$ /opt/node22/bin/node build/verify.cjs all --shots <scratch folder outside the repository>
PASS phone: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 103 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (76 s)
PASS landscape: drew a figure, Ring match finished after 3 rounds, solo run played 4 fights with 3 different shop purchases, 82 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (69 s)
PASS desktop: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 119 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (77 s)
PASS artifact: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 110 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (78 s)
PASS duo: two humans drew in turns, a drawing timed out and got a placeholder, both keyboard zones were held, leaving took two taps, 0 console errors (38 s)
PASS checks: 22 single checks passed (double taps, asking before discarding, ink empty, finger off the canvas, rotation in a stroke, bot twin, stains, honest stakes, both solo loss paths; version 2: block with blade, diagonal blade, pocket marks, what Ende asks), 0 console errors, 0 network requests (60 s)
PASS stable: the canvas kept its rectangle before, in and after the first stroke on 15 drawing screens (400 x 780, 400 x 660, 780 x 400), main button always inside the window, the first stroke starts on the open hint, draws and closes it, the stake line of the enemy is never cut and the drip warning has its own line, shop tap with a second finger works, 0 console errors (56 s)
VERIFY OK phone landscape desktop artifact duo checks stable
```

The dist files were hashed before this run; a rebuild after all runs gave the
same two hashes (`sha256sum -c`: both OK). So the check, the fairness run and
the solo runs below all ran on the final build. Full log: `verify_all.txt`.

From the log (`stable`):

```text
[stable] 400x780 first-run hint: 19 % of the sheet height, inside the sheet, touches go through to the canvas
[stable] 400x780 stake line at x2, uncut: ×2 · als Gegner: Treffer bis 1,9 · Tempo 12,6 · Panzer 148 || 3 Kästchen tropfen ab
[stable] 400x660 first-run hint: 27 % of the sheet height, inside the sheet, touches go through to the canvas
[stable] 400x660 stake line at x2, uncut: ×2 · als Gegner: Treffer bis 1,9 · Tempo 12,6 · Panzer 148 || 3 Kästchen tropfen ab
[stable] 780x400 first-run hint: 20 % of the sheet height, inside the sheet, touches go through to the canvas
[stable] 780x400 stake line at x2, uncut: ×2 · als Gegner: Treffer bis 1,9 · Tempo 12,6 · Panzer 148 || 3 Kästchen tropfen ab
```

Canvas rectangle on the free drawing screen with the hint open, in the first
stroke (which starts on the hint), and after it: identical in all three
windows (for example 400 x 780: `24.5 76.2 351 351` each time).

Page rules, `dist/inkweight.artifact.html`: starts with
`<title>Inkweight</title>`, then the `claude:viewport-fit-sides` meta, then
`<style>`; 0 doctype/html/head/body tags, 0 http(s) URLs, no `100vh`, no
alert/confirm/prompt, `"version":"ink-tuning-3"` once, wrapper padding
`max(16px, env(safe-area-inset-left, 0px))`. No new literal colour.

## Ring fairness (final build)

```text
$ /opt/node22/bin/node build/ring_fairness.cjs 6
RING FAIRNESS: human won 13 of 18 matches (72 %), 0 console errors, empty gallery before every match
```

Scripted player of INK-WEB-V4 (same figure every round, never uses the
catch-up ink), whole matches through the real screens, one human against two
bots, empty gallery before every match. Log: `ring_fairness.txt`.

| Drawing | Won | Lost against |
|---|---|---|
| block with a sword (112 / 158 / 2,0) | 5 of 6 | Klotz (1 : 0 : 3) |
| stick figure (66 / 80 / 3,6) | 6 of 6 | – |
| round blob (120 / 172 / 1,0) | 2 of 6 | Klotz four times, each 0 : 3 |
| all | 13 of 18 (72 %) | |

Before: 7 of 18 (39 %), blob 0 of 6. Every line-up was Klotz plus Ramme or
Qualle. Honest reading: this is above the aim of one in two for this scripted
player, and the blob is still the weak drawing (it loses to Klotz, the only
heavier figure). The same player on the core alone in Node (scratch script,
40 matches per drawing and line-up, not in the repository): Klotz+Ramme 98 of
120, Klotz+Qualle 89 of 120 (blob 29 and 22 of 40); the old pairs Klotz+Speer
49 of 120 (blob 3 of 40) and Reif+Speer 60 of 120. The reviewer's more
careful hand-like player scored lower than this script on the old build, so a
real newcomer will likely land below 72 %. Not measured: gallery with own
figures (`--own`), three bots.

## Boss at ×1 (final build)

`build/solo_play.cjs 0 brawl|kite`, 400 x 780, hero block with a sword
(112 / 158), weapon thin cross, enemy the 14 x 15 block (210 ink) in every
wave, "Flicken" in every pause, hero steered by the core's own hero bot. Boss
fight every time: boss armour 335, 5 escorts with 182 each, blunt touch 0,48,
crush 0; the panel said "Sein Panzer: 335 · Begleiter: 5 · dein Panzer: 158
von 158" and the script confirmed it against the fight bodies.

| Hero | Runs | Boss result |
|---|---|---|
| runs in (brawl) | 4 | 1 won with 18 of 158 left (69 s); 3 dead after 55, 59 and 65 s, all entered with 158 of 158 |
| keeps away (kite) | 3 (+1 at 400 x 660) | 4 of 4 won; armour lost 98, 3, 0 (104 to 153 s); the 400 x 660 run also won |

Waves 1 to 5 at ×1: brawl loses 10 / 14 / 21 / 29 / 41 of 158, kite 0. So the
boss is unchanged: a wall for a hero that runs in (about one win in four by
these runs), safe for one that keeps away. The page now says so before the
fight; whether the tip is enough is for the Human to judge. A softer boss is a
core/tuning matter. Logs: `solo_x1_brawl_1..4.txt`, `solo_x1_kite_1..3.txt`,
`solo_x1_kite_400x660.txt`.

## Fresh screenshots looked at (final build)

- `stable-400x780-hint.png`, `stable-400x660-hint.png`,
  `stable-780x400-hint.png`: dashed band at the top of the empty sheet, bold
  first sentence, three sentences, "Alles klar" at the right; at 400 x 660 it
  takes four text lines; the sheet below is free. (Looked at on the
  last-but-one build for 400 x 780; the two others on the final CSS.)
- `stable-400x780-solo-enemy-x2.png`, `stable-400x660-solo-enemy-x2.png`:
  line 1 "×2 · als Gegner: Treffer bis 1,9 · Tempo 12,6 · Panzer 148" in
  full, line 2 "3 Kästchen tropfen ab" in ember; rows "Panzer 131 als Figur ·
  volle Fläche schützt · 44 Kern-Pun…" and "Tempo 17 als Figur · Kästchen pro
  Sekunde · leicht ist fl…" (the ends are cut at 400 x 660, the label is at
  the start). At 400 x 660 the "Regeln" button sits close above the stake
  buttons (it did before as well).
- `boss-panel-400x780.png`, `boss-panel-400x660.png`: facts line, tip, the
  old fine print, both buttons on screen.
- `phone-12-ring-lost-round-tip.png` (400 x 780): the tip under the two
  "aus dem Ring geflogen" lines, above the score.
- `phone-15-solo-intro.png` (400 x 780): the tip ends the first paragraph;
  at 400 x 660 the intro does not scroll (measured, screenshot not copied).
- `rules-end-400x660.png`: "(vor dem Element)" and the second "Schließen".

## Known weaknesses, not done

- Ring: 72 % for the scripted player is easier than "one in two"; the blob
  wins 2 of 6. One measurement run of 18 matches only.
- The Ring tip and the solo intro were not looked at in a 400 x 660
  screenshot (the tip only at 400 x 780 and as text in all scenarios).
- The tip after a lost round speaks only to a single human (no line for two
  or more humans).
- No scenario of `verify.cjs` reaches the boss, so the boss panel check I
  added there did not run; the same comparison ran in `solo_play.cjs` (8
  runs).
- The hint still lies on the top fifth to quarter of the sheet until the
  first stroke or tap; it blocks nothing. A stroke that starts exactly on the
  "Alles klar" button closes the hint and draws nothing.
- At ×1 a run-in hero still loses the boss about three times in four.
- "Tinte ist alle" on drawing screens other than the enemy screen (m-4) was
  not re-checked.
- Not played by hand; no real phone.
