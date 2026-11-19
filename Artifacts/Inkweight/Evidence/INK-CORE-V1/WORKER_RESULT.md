# INK-CORE-V1 Worker Result

Worker start 2026-11-19 22:46 UTC, result written 23:14 UTC (container clock).
Nothing was committed or pushed by the Worker. Only `Projects/Inkweight/Source`
and `Artifacts/Inkweight/Evidence/INK-CORE-V1` were changed.

Note: while the Worker was running, a commit `5352369` ("INK-CORE-V1 work in
progress snapshot (unreviewed, Worker still running)") appeared on the branch.
It was not made by the Worker and holds an early state of four files
(`ink_tuning.json`, `core/drawing.js`, `core/rng.js`, `package.json`). The
working tree is newer than that commit.

## Gate

```text
PASS worker receipt cfa711e2533818ab402f1f83c36c36eb21bc58b16cb40fd1f03daa96a5d241f5
```

Run before the first change, exit code 0.

## What exists

Under `Projects/Inkweight/Source/`:

- `Shared/ink_tuning.json`: all numbers; the core reads nothing else.
- `Shared/RULES_AS_BUILT.md`: exact algorithms, differences from
  `INK_RULES_V1.md` with reasons, eight open design questions with
  recommendations.
- `Shared/golden/stat_vectors.json`: 43 drawings with every derived value
  (68 kB). 9 of them are invalid on purpose.
- `Shared/golden/sim_traces.json`: 8 traces (134 kB): three Ring duels (two
  bot matches, one fully scripted round), one 3-figure match, one 4-figure
  match, one 4-figure trace with one scripted seat, two solo runs (one of them
  all five waves plus the boss).
- `WebPrototype/core/`: `rng.js`, `drawing.js`, `physics.js`, `ring.js`,
  `solo.js`, `bots.js`, `hash.js`, `index.js`, `README.md` (API note).
- `WebPrototype/sim/`: `archetypes.js` (14 archetype drawings), `runner.js`,
  `balance.js`, `tune_search.js`.
- `WebPrototype/tools/`: `load_tuning.js`, `golden_cases.js`, `gen_golden.js`.
- `WebPrototype/tests/`: `drawing.test.js`, `properties.test.js`,
  `solo.test.js`, `golden.test.js`.
- `WebPrototype/package.json`: only marks the folder as ES modules; no
  packages.

Under `Artifacts/Inkweight/Evidence/INK-CORE-V1/`: this file,
`BALANCE_REPORT.md` and `.json` (final numbers), `neutral/` (same run with all
drawings black), `baseline_rules_v1/` (the starting numbers of the rules
document, for comparison), `test_output.txt`, `balance_run.log`.

## Tests

Command (Node v22.23.5, no packages):

```text
cd Projects/Inkweight/Source/WebPrototype && /opt/node22/bin/node --test
```

Final lines of the real output (full output in `test_output.txt`):

```text
1..39
# tests 39
# suites 0
# pass 39
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 480.180731
```

`node tools/gen_golden.js --check` printed `golden files match`. Two of the 39
tests rebuild both golden files in memory and compare them byte for byte with
the files on disk. One test scans the core sources and fails on any math
function other than `Math.sqrt`, `Math.floor` and `Math.imul`.

## Determinism

Fixed 60 ticks per second, own xorshift32 generator, rotation as a unit front
vector. The simulation uses `+ - * /` and `Math.sqrt`, plus `Math.floor` in
four places (grid lookup in the contact scan, catch-up budget, wave copies,
throw interval). `Math.floor` is exact, so the traces are meant to match bit
for bit; each checkpoint carries a 32-bit hash over the raw bytes of the state.
Not proven: no second implementation exists yet, so "a C# port matches" is
untested.

## Balance verdict (Ring)

5460 bot duel rounds (60 seeds per pair, 14 archetypes) and 1200 four-figure
rounds with the final numbers:

| Archetype | Duel win % | FFA win % (25 = even) |
|---|---|---|
| wedge (solid triangle) | 71.3 | 65.5 |
| line (one long line) | 67.7 | 4.4 |
| disc | 64.6 | 53.2 |
| hedgehog (disc with spikes) | 64.0 | 60.1 |
| block | 60.3 | 54.5 |
| lance | 59.5 | 25.8 |
| star | 56.8 | 15.2 |
| comb | 53.7 | 24.0 |
| shield | 50.6 | 36.9 |
| cross | 49.6 | 4.2 |
| needle | 44.2 | 4.7 |
| ring (hollow) | 30.6 | 9.9 |
| frame (hollow) | 26.3 | 0.0 |
| dot (13 cells) | 0.8 | 0.9 |

- **Target "no archetype above 60 %": NOT MET.** Five archetypes are above
  60 %, the highest at 71.3 %. With the starting numbers of the rules document
  the highest was 92.3 % (comb and hedgehog), so the spread shrank but the
  target was not reached.
- **Target "at least three clearly different shapes can win": MET under
  bots.** Solids, pure blades and core-with-blades drawings are all at or
  above 50 %. The pairings form a real circle: disc beats line 92 %, line
  beats hedgehog 97 %, hedgehog beats disc 67 %.
- Three drawings are simply weak (tiny dot, two hollow shapes). As long as
  they lose nearly everything, the others cannot all stay under 60 %.
- Free-for-all is not balanced: heavy solids win 53 to 66 % of four-figure
  rounds, light blades under 5 %.
- Elements matter little in this field (all-black run: highest 72.3 %, same
  order).
- Rounds last 19 s on average; 54 % end by ring-out, 46 % by armour.
- Optimal-shape risk, plainly: the "full ink, covered in spikes" drawing no
  longer beats everything, but a full-ink solid with a point (wedge) is the
  safest pick, and in four-player rounds heavy solids are clearly best. The
  risk is reduced, not removed, and only human play can settle it.

What bots can and cannot tell is written at the end of `BALANCE_REPORT.md`.
Short version: they rank drawings under one simple play style (run at the
nearest opponent, push outward, back off at the edge). They cannot dodge,
bait, aim or redraw, so many pairings are near 0 or 100 %.

## Solo smoke run

Bot hero through five waves and the boss, 3 heroes x 5 enemy designs x 3
stakes, 4 seeds each (180 runs, table in `BALANCE_REPORT.md`):

- 154 of 180 runs were won including the boss, most with 75 to 100 % armour
  left: too easy for the bot against dots, blocks, combs and crosses.
- Swarms of needles (light and sharp) are the hard case: the disc hero that
  keeps its distance wins at x1 and x1.5 and half the runs at x2; the hedgehog
  that runs into them and the star never finish (on average 1 to 4 waves cleared).
- The stake changes the score a lot and the danger little, except with needle
  swarms. Difficulty is decided by which enemy the player draws.
- No run hit the 180 s time limit.

## Numbers changed from the rules document

Full table with reasons in `RULES_AS_BUILT.md` section 9. The important ones:

- Armour `20 + 2 C + 0.25 N` became `55 + 2 C` (thin drawings were hopeless).
- Sharpness `3 + 0.12 S` became `1 + 5.5 (S / N)^2`: the share of sharp cells,
  squared, instead of their count. **This is a formula change, not only a
  number.** Counting sharp cells made heavy spiked drawings win 92 %.
- Blunt damage 1 became 1.2.
- Top speed `9 / (1 + N / 160)` became `38 / (1 + N / 70)` (the original was
  half a body length per second).
- Added: catch-up cap of 4 steps, hit knockback, ring sizes and timing, dash
  numbers, a rule for simultaneous knock-out, solo enemy weakening (35 %
  armour, 45 % speed, 20 % damage), solo start colour, solo time limit, boss
  rule. All are marked as proposals.

How the numbers were found: two random searches (200 and 240 samples) over 13
to 14 numbers with a short simulation each, then hand-picked variants checked
with 30 seeds per pair. `sim/tune_search.js` repeats the search.

## Known weaknesses

- The balance was tuned against one hand-made field of 14 drawings and one
  bot; it may not hold for other drawings or for humans.
- The solo mode is only smoke-tested and is too easy in most cases; its
  numbers had one tuning pass.
- Collisions do not spin figures. Turning is steered only.
- Fast small figures can pass through a one-cell line during a dash (a dot
  moves up to 2 cells per tick at dash speed; cells are 1 wide).
- One contact triggers the cooldown for a direction even if it was a blunt
  touch; a sharp cell touching a moment later does nothing until the cooldown
  ends.
- The thrown weapon is a circle with the weapon's stats, not its drawn shape.
- Bit-exact agreement with C# is designed for but untested. The C# port must
  use `double`, keep the loop orders and avoid fused multiply-add.
- The golden traces depend on the tuning file: after any tuning change run
  `node tools/gen_golden.js` again.
- The core was only run in Node 22; it has no Node imports, but it was not
  loaded in a browser.

## Not done

- No browser check and no C# check (other Work Orders).
- No bot that draws or uses catch-up ink; bot matches reuse one drawing.
- No drawing time limit in the core (`ring.drawTimeSeconds` is stored for the
  UI only).
- `INK_RULES_V1.md` still shows the starting formulas; it was outside the
  allowed paths and needs a correction by a later Work Order.
