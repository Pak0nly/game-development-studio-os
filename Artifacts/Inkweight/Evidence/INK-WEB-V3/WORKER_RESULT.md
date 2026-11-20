# INK-WEB-V3 Worker Result

Worker: Claude Code subagent (separate Worker task). Start 2026-11-20 01:24 UTC,
end about 02:05 UTC. Nothing was committed or pushed by the Worker (the
Director's snapshot commits picked up work in progress). Core, shared files
and tuning were not touched; the core did not change during the order
(last core commit `9e2cf59`, 01:21).

## verify-worker

```text
PASS worker receipt 0dd7aad61a3fc8ff82d60c5477c45a9bd2c93cb8d347205a514bd4e3fd20fc35
```

## What changed

| File | Change |
|---|---|
| `app/drawscreen.js` | Blade marks from `core.isSharpCell`; core cells; pocket cells (same flood fill as `countEnclosed`) as a faint ring on the empty paper; stat bars with the real version 2 ranges; a true explanation per stat row (see below); the version 1 sharpness wording is gone; N-1 (the "Ende" screens ask "Spiel beenden?" / "Lauf beenden?"); N-7 (a held stroke that began in the tap block starts painting when the block ends); N-8 (a stroke ends on a width or orientation change only) |
| `app/page.html` | Rules layer; "Regeln" button on the start screen and in the Element row of the drawing screen; ids for the explanation lines; hint and solo intro text for version 2 |
| `app/main.js` | Rules panel text built from the tuning numbers; tap repair fixed (two bugs found through the new panel: a quick tap on a second button made the first one fire twice; a late click after a repaired tap could hit what lies under a closed layer) |
| `app/ui.js` | N-7: the swallowed touch-down no longer eats the next real click (cleared after a drag, 120 ms after a tap) |
| `app/fight.js` | `ram` event: ink ring, "Rums!", splash, squash, mild shake, own sound; debug hook that counts fight events for the check |
| `app/audio.js` | sound `ram` |
| `app/ringmode.js` | `ringCheckFigure` before `ringStartRound` (a placeholder steps in instead of a crash); bot styles mixed (`match.botStyle`), shown in the line-up as "stürmt drauflos" / "kreist und stößt zu"; N-4 ("geht an dich"); N-5 (bots are compared with the humans' drawings by shape, not colour) |
| `app/solomode.js` | Stakes with `soloCopies` and `soloDropValue`; one line says what the picked stake does (harder hits, speed, tougher or weaker copies from `soloWaveArmourScale`); no stake is switched off any more (in version 2 every stake differs); HUD shows the stake and "Beutel" (N-6); "Lauf beenden?" |
| `app/style.css` | Phone upright: explanation under each stat row; landscape: seats in two columns (N-3), wider line-up cards; rules panel styles |
| `build/verify.cjs` | New checks, see below |
| `.gitignore` (WebPrototype) | `!build/` and `!build/**`; `git check-ignore build/zz_probe.txt` exits 1 (not ignored) |
| `dist/*` | rebuilt |

Stat explanations now shown (all computed from the live stats):

- Gewicht: "schiebt, ist träge · dicke Hülle schiebt härter"; with counting
  pocket cells "Schub 190,0: der Hohlraum schiebt mit (+10,0)"; with a thin
  wall "Hohlraum zählt erst mit dicker Wand (2 Kästchen)"; with a hole that is
  too small "Hohlraum zu klein: zählt erst ab 3 × 3 Kästchen".
- Panzer: "volle Fläche schützt · Kern-Kästchen (Punkt): 111".
- Schärfe: "19 Klingen · Schnitt nimmt auch 0,4 % Panzer" or "keine Klinge:
  1 Kästchen dünne Striche schneiden".
- Tempo: "Kästchen pro Sekunde · wenig Tinte ist flink".

## Commands and real output (final build)

```text
$ cd Projects/Inkweight/Source/WebPrototype
$ /opt/node22/bin/node build/build.mjs
BUILD OK modules=20 inkweight.html=213836B inkweight.artifact.html=213709B
$ sha256sum dist/*
5600f2df914d9611cfbc6f5b2ec2495b3f75d07cfe2ba5e8bcb9cccbf437107b  dist/inkweight.artifact.html
ddb06eefe4ec9b327a999c496c60c55a549d5e36cbd26b1f826f4ebc2277c52a  dist/inkweight.html
$ /opt/node22/bin/node build/verify.cjs all --shots <scratch folder outside the repository>
PASS phone: drew a figure, Ring match finished after 4 rounds, solo run played 4 fights with 3 different shop purchases, 122 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (80 s)
PASS landscape: drew a figure, Ring match finished after 3 rounds, solo run played 5 fights with 4 different shop purchases, 84 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (73 s)
PASS desktop: drew a figure, Ring match finished after 5 rounds, solo run played 5 fights with 4 different shop purchases, 131 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (87 s)
PASS artifact: drew a figure, Ring match finished after 6 rounds, solo run played 5 fights with 4 different shop purchases, 120 rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (91 s)
PASS duo: two humans drew in turns, a drawing timed out and got a placeholder, both keyboard zones were held, leaving took two taps, 0 console errors (38 s)
PASS checks: 18 single checks passed (double taps, asking before discarding, ink empty, finger off the canvas, rotation in a stroke, bot twin, stains, honest stakes, both solo loss paths; version 2: block with blade, diagonal blade, pocket marks, what Ende asks), 0 console errors, 0 network requests (56 s)
VERIFY OK phone landscape desktop artifact duo checks
```

New check lines of that run:

```text
[checks] block alone: sharpness 1, blade marks 0, armour 217 ("keine Klinge: 1 Kästchen dünne Striche schneiden"); with a blade of 11 cells: sharpness 2, blade marks 11 ("11 Klingen · Schnitt nimmt auch 0,4 % Panzer")
[checks] diagonal stroke: weight 37, blade marks 37, core S 37, sharpness 4,0
[checks] light blade slashes found on the diagonal: 19 of 19 probed cells
[checks] thick closed shell: weight 180, pocket marks 100, core P 100, line "Schub 190,0: der Hohlraum schiebt mit (+10,0)"
[checks] Ring "Ende" first tap: Spiel beenden? | Noch einmal tippen, dann endet das ganze Spiel.
[checks] solo enemy "Ende" first tap: Lauf beenden? | Noch einmal tippen, dann endet der ganze Lauf.
[checks] stakes for a big enemy in wave 1: Einsatz ×11 Gegner · 120 Beute -> ×1: Die Gegner halten 50 % weniger aus. | Einsatz ×1,51 Gegner · 180 Beute -> ×1,5: Die Gegner schlagen 25 % härter zu, sind 10 % schneller, halten 31 % weniger aus. | Einsatz ×21 Gegner · 240 Beute -> ×2: ... 50 % härter zu, sind 20 % schneller, halten 8 % weniger aus.
[landscape] ring setup: main button bottom 327 of 400        (N-3; was 409)
[landscape] line-up: main button bottom 371 of 400, bot styles shown: stürmt drauflos | kreist und stößt zu (core botStyle 001)
```

(The stake line above is from the first `checks` run of the session; the same
check passed in the final run.) Each play-through also fails if the sharpness
line is not the version 2 one, if blade marks differ from the core's `S`, if
the rules panel lacks the rule sentence, the four stats, the element circle or
the "Testwerte" line, if "Los, zeichnen!" or "In den Ring!" is below the
window, if the two bot styles are not both in the line-up, or if a whole run
had no blade hit.

N-7 was checked with an own script outside the repository (not part of
`verify.cjs`):

```text
A touch: block was on at touch-down: true; stroke of 17 cells over 0.8 s painted weight 13
B mouse: block was on at mouse-down: true; next click (Regeln, 1203 ms page time) opened the panel: true
```

N-8 cannot be tested here (browser bars do not exist in emulation); the
rotation check still passes (8 cells, no line across).

## Own play at normal speed (phone 400 x 780, touch, steering from body positions read through a read-only wrapper)

Ring, me against two placeholder bots (one of each style), my figure: block
with one long and two slanted blades (weight 150, armour 182, sharpness 2,2):

```text
[ring] round 1: "Runde 1 geht an dich" after 15.1 s of fight, out reasons [,ring,armour], armour left 62/182 147/216 0/73, my sprints 7, events {"hitsBy":31,"sharpBy":28,"dmgBy":76,"hitsOn":31,"sharpOn":24,"dmgOn":120,"ramsBy":7,"ramsOn":5}
[ring] round 2: "Runde 2 geht an dich" after 17.9 s of fight, ... armour left 45/182 163/216 -2/73
[ring] round 3: "Du gewinnst das Spiel!" after 17.9 s of fight, ... armour left 44/182 160/216 -2/73
[ring] total wall time 67 s, console errors: []
```

Solo, stake ×1 in every wave, same enemy drawing each wave (weight 47), hero
weight 108 / armour 140, thin cross as weapon. "intent" keeps a middle
distance and collects ink; "naive" wanders, changes direction every second and
never sprints:

```text
intent: fights 7.3 / 9.4 / 13.5 / 14.5 / 17.1 s, boss 22.3 s; hero armour 140 -> 136 -> 125 -> 112 -> 77 (Flicken) -> 79 (Flicken) -> boss ends at 19 of 140; "Geschafft!", 1482 ink, 111 s wall time
naive:  fights 6.8 / 9.3 / 11.9 / 13.6 / 16.6 s, boss 26.4 s; hero armour ... boss ends at 48 of 140; "Geschafft!", 1482 ink, 112 s wall time
```

How it feels (my judgement, from these three runs and the automated ones):

- Ring: a round is decided in 15 to 18 s, a match in about a minute. That is
  quick but not too quick: there is time for two or three sprints, and the ring
  has only just begun to shrink. With three figures I lost about three
  quarters of my armour per round although I won: armour goes fast when two
  bladed figures touch constantly (about 2 hits per second, almost all sharp).
  Both ways to lose happen (the heavy bot flew out, the light one broke).
  The blade on a block now clearly matters, and a ram is visible and audible.
- Solo at ×1: fair, rather easy. Even the wandering player who never sprints
  won the run, with two "Flicken". Waves are short (7 to 17 s); the boss fight
  is the only tense part (19 and 48 armour left). The whole run is under two
  minutes of fighting, which is short for five waves.
- Solo at ×1,5 (the automated blind player from wave 2 on): lost in wave 4 or
  5 in every scenario of the final run. So the stake is a real risk now.

## What I saw in the fresh screenshots

- `phone-04-draw.png`, `desktop-03-draw.png`, `landscape-04-draw.png`: blade
  slashes on the straight and on the slanted stroke, core dots only inside the
  block, drips pale with drops; every stat row has its explanation, fully
  readable on the phone and the desktop; sideways the lines fit in one row.
- `checks-10-block-with-blade.png`, `checks-11-diagonal-blade.png`,
  `checks-12-shell-pockets.png`: sharpness 2,0 with the blade, an all-blade
  diagonal, pocket rings inside a thick shell with "Schub 190,0 ...".
- `phone-02-rules.png`: the rules panel fits one phone screen.
- `phone-08-ring-lineup.png`: bot styles under the placeholder cards.
- `phone-09-ring-fight.png`: "Rums!" at a ram; `play-ring-fight.png`: my own
  match.
- `phone-15-solo-enemy-draw.png`, `landscape-15-solo-enemy-draw.png`,
  `checks-07-stakes-honest.png`: stakes with enemies and loot, one line for
  the picked stake.
- `checks-13-ring-ende-asks.png`: "Spiel beenden?" with the red line.
- `landscape-06-ring-setup.png`, `phone-01-start.png`.

## Core observations (nothing edited)

- No core bug found. `ringCheckFigure` never refused a figure in any run.
- Stake ×1 can make enemies much tougher than the drawing says: one copy of a
  47-ink enemy gets 38 to 95 % more armour in waves 1 and 2 because the unused
  wave ink goes into `soloWaveArmourScale`. The page says so ("halten 62 %
  mehr aus (übrige Tinte)"), but for a first-time player it is a surprising
  line under the lowest stake.
- Pocket cells need a wall two cells thick and a hole of at least 3 × 3; the
  gain is at most 10 % push weight. A normal hand-drawn outline (one cell
  thick) gets nothing. "A closed shell pushes harder" is true only for thick
  shells; the page says "dicke Hülle".
- Solo at ×1 is short and easy (see above); the numbers may be on the soft
  side for wave budgets or enemy damage at ×1.

## Known weaknesses, not done

- The explanation lines cost height on an upright phone: at 400 x 780 the
  canvas is 360 px on free drawing and about 315 px on the solo enemy screen;
  on a shorter phone window (about 660 px) the enemy screen will be tight and
  may need a little scrolling. Not measured at that size.
- Sideways the sharpness line had to be shortened to fit ("19 Klingen ·
  Schnitt nimmt auch 0,4 % Panzer"); longer lines there end in "...".
- The rules clock keeps running while the rules panel is open on a Ring
  drawing screen (the clock starts with the first stroke, so reading before
  drawing costs nothing).
- N-7 and N-8 have no assertion in `verify.cjs` (N-7 checked by hand script,
  N-8 not testable in emulation).
- N-5: a bot can still use one of my older gallery drawings (that is the
  designed bot pool); it is only kept from showing the shape I just drew.
- The play judgement rests on one Ring match and two solo runs steered by a
  script, not on a person's hands. Sound was not listened to (no audio here);
  the `ram` sound is untested by ear.
- N-2 is solved for future files by the `.gitignore`; the two build scripts
  were already tracked.
