# INK-CORE-V3 Worker Result

Work Order: `Artifacts/Inkweight/DirectorDispatch/INK-CORE-V3/WORK_ORDER.md`.
Worker: one separate Claude Code subagent in its own Git worktree. Everything
new here is a prototype proposal, not a Human decision.

## 1. Gate, work copy, time

- `verify-worker` against the main checkout (`--root
  /home/user/game-development-studio-os`, absolute paths), real output:
  `PASS worker receipt 7abbcf15f659ef3fd3d3c640fb9fac8436a3a22bb2a37cbd7302ca7fb2aae218`
- Worktree: `/home/user/game-development-studio-os/.claude/worktrees/agent-a4f119a8ce7fbbb21`,
  branch `worktree-agent-a4f119a8ce7fbbb21`. It was at `53d3f5b`; fast-forwarded
  to the dispatch HEAD `960c6ae472ffedd2b30d2059cf67113655e3d3ef` before any
  change (`git merge --ff-only`).
- Commits on the branch (local only, nothing pushed or merged):
  `bd0c905` R2, R3, R4; `64ae705` R1; `1b85713` balance pass 3 and tuning
  version; then the final commit "Inkweight: INK-CORE-V3 Worker result" (this
  file, records, final reports).
- The main checkout was only read (the gate command, `python3 -B`). All
  changes are inside the allowed paths.
- Time: start 01:30 UTC, end about 02:25 UTC (`date -u`).

## 2. Findings of the re-review

### R1 (important): heavy blunt enemy designs made the stake free. Fixed for the bot measurement; one part remains.

Cause found: a blunt enemy touch cost the hero `1.2 * 0.4 * stake factor` =
0.48 to 0.72 armour whatever the copy weighed. In the Ring weight pushes; in
the walled arena it did nothing. A test with speed alone (enemies as fast as
8.8 to 10.6 cells per second, no other change) left 92 of 96 runs won and
raised the scores, so speed was not the missing danger; damage was.

Built (proposal, `core/solo.js`, `core/physics.js`):

- **Crush**: the blunt touch of an enemy copy gains `enemyCrushPerInk (0.004)
  * N * scale * stake`, where `scale` is the wave scale version 2 already
  uses for armour (staked ink per copy against the cost of a copy, 0.5 to 2).
  A stake that buys no further copy of a heavy drawing therefore makes its
  copies hit harder. The body carries it as the new field `bluntBonus`; a
  sharp touch still never does less than a blunt one. Ring bodies have 0.
- **Speed**: enemy top speed is `(enemySpeedBase 3 + enemySpeedMult 0.45 *
  topSpeed) * stakeSpeedMult` instead of `0.55 * topSpeed * stakeSpeedMult`.
  Light enemies keep their speed (dot 17.6 -> 17.4), a 210-cell block goes
  from 5.2 to 7.3 (8.7 at x2). Heavy drawings stay the slowest enemies.
- The heavy blunt designs block, disc, hollow ring and 2-wide hoop are now in
  the solo smoke field (10 enemy designs instead of 7) and the report has a
  group table for them.

Before and after, same field and method (4 heroes: disc kite, hedgehog brawl,
star kite, line kite; 4 seeds; same design and stake in all five waves; heal
after each wave; boss). "Before" = version 2 solo rules on the version 3
physics (`solo_before.txt`, `solo_before_summary.txt`); "after" = final state
(`BALANCE_REPORT.md`).

| Enemy designs | Stake | Runs won before | after | Reached the boss before | after | Avg score before | after |
|---|---|---|---|---|---|---|---|
| heavy blunt (block, disc, ring, hoop2) | x1 | 64 / 64 | 34 / 64 | 64 / 64 | 64 / 64 | 1944 | 1777 |
| heavy blunt | x1.5 | 64 / 64 | 30 / 64 | 64 / 64 | 64 / 64 | 2420 | 2293 |
| heavy blunt | x2 | 64 / 64 | 13 / 64 | 64 / 64 | 37 / 64 | 2930 | 2195 |
| all others (dot, needle, comb, cross, splinter, spiral) | x1 | 66 / 96 | 73 / 96 | 96 / 96 | 95 / 96 | 1438 | 1443 |
| all others | x1.5 | 31 / 96 | 31 / 96 | not counted | 64 / 96 | 1613 | 1633 |
| all others | x2 | 13 / 96 | 15 / 96 | not counted | 24 / 96 | 1483 | 1432 |

Reading: the score of a heavy blunt design no longer rises from x1.5 to x2,
27 of 64 runs at x2 end before the boss, and the other designs are where they
were. What remains:

- **x1.5 is still cheap during the waves** for these designs (64 of 64 runs
  reach the boss, score +29 % over x1 for 34 -> 30 runs won).
- **The boss fight with five heavy designs is now hard at every stake** (34
  of 64 won at x1, before 64 of 64): six heavy bodies crush. This is the
  larger part of the drop at x1 and x1.5.
- **A human who kites perfectly was not measured.** The enemies are still
  slower than a heavy hero (block 7.3 to 8.7 against 9.6). The bot hero gets
  touched because it goes for drops.
- Candidates tried on 2 seeds before the choice (scratch runs, not kept as
  files): speed 5 + 0.4 with crush 0.012 flat (heavy 5 / 3 / 1 of 32 won, far
  too hard), crush 0.012 flat alone (7 / 4 / 7), crush 0.006 flat (18 / 16 /
  14, stake still free in the waves), crush 0.008 * scale (10 / 8 / 7), crush
  0.005 * scale * stake (21 / 16 / 11), and the adopted speed 3 + 0.45 with
  crush 0.004 * scale * stake (17 / 14 / 4 on 2 seeds, 34 / 30 / 13 on 4).

Tests: `R1: the stake of a heavy blunt enemy design buys speed and crush, and
its touch hurts by weight`; the stake test and the boss test check the new
speed and crush expressions.

### R2 (minor): meshing teeth and crowds. Reduced and bounded, not removed.

Reproduced first with the extended probe (every tick, 6 seeds, both styles):
comb against comb 1.18 % of ticks deeper than 0.5 (Reviewer: 1.14 %), 30
random four-figure rounds 0.48 % (Reviewer: 0.35 %, other rounds).

Built: `physics.extraSeparationPasses` 2 -> 8 (number only), and a **crowd
relaxation** for worlds with more than two bodies: after the pair loop of a
sub-step the pairs are gone through again, positions only, at most
`physics.crowdRelaxPasses` (4) times, until no contact is deeper than
`deepContactDepth`. Duels never run it (a test checks a duel is bit-identical
with and without). No velocity is added.

| Probe (`overlap_probe_before.txt` -> `overlap_probe.txt`) | Ticks above 0.5, before | after | Largest overlap before | after | Longest row of ticks before | after |
|---|---|---|---|---|---|---|
| comb against comb | 1.182 % | 0.097 % | 0.97 | 0.84 | 58 | 4 |
| hedgehog against hedgehog | 0.038 % | 0.000 % | 0.91 | 0.45 | 5 | 0 |
| comb against hedgehog | 0.244 % | 0.023 % | 0.79 | 0.54 | 8 | 1 |
| comb against star | 0.022 % | 0.039 % | 0.66 | 0.65 | 2 | 1 |
| comb against grille, grille against spiral | 0 | 0 | 0.12, 0.05 | 0.12, 0.05 | 0 | 0 |
| 30 random four-figure rounds | 0.483 % | 0.073 % | 0.99 | 0.96 | 25 | 17 |

Steps measured on the way: 4 passes alone gave comb against comb 0.24 % but
crowds 0.51 %; 8 passes alone 0.10 % and crowds 0.71 %; relaxation 2 / 4
rounds with 2 passes gave crowds 0.17 % / 0.04 % (60 rounds). Run time of the
probe did not change measurably.

Wording corrected in `RULES_AS_BUILT.md` section 3 ("figures with one-cell
teeth against each other, and any figures in a crowd, can still mesh for a
moment", with the numbers above). Tests: comb against comb under 0.5 % and no
row of 30 ticks; eight four-figure rounds under 0.5 %; relaxation positions
only. The old comb-against-hedgehog test stays.

### R3 (minor): done

`tests/properties.test.js`, `R3: simultaneous knock-out by armour`: three
seats at 0 armour in one tick (winner = nearest to the centre, three `armour`
reasons, three `out` events, wins and losses), an exact distance tie (lowest
seat), and armour and ring in the same tick.

### R4 (minor): done

`turnCos` and `turnSin` removed from the figure template. Checked before: no
use in the core, tests, tools, simulation, the browser app or the C# port at
the dispatch HEAD (the C# template never had them); golden files do not
contain them.

## 3. Balance pass 3: five levers measured, none adopted, no Ring number changed

Method: each lever alone, behind a tuning key that was a no-op by default;
`sim/lever_run.js` per bot style, 20 seeds per pair (3800 duels) and 1200
four-figure rounds per style; same seeds as the baseline. Files:
`levers/*.json`, summary with every archetype in `levers/SUMMARY.txt`. The
lever code is **not** in the core; it is kept as
`levers/lever_code_not_adopted.diff` (applies on commit `64ae705`).

Baseline (version 3 physics, 20 seeds): highest duel rate rusher grille
77.1 %, circler hoop 76.3 %; light shapes in four-figure rounds 0.9 %
(rusher) and 3.3 % (circler).

| Lever | Plain sentence | Highest duel %, rusher | circler | Light shapes FFA %, rusher / circler | Other effect | Decision |
|---|---|---|---|---|---|---|
| L1 size cost, `accelK / (1 + inertia / 10000)` | Wide, heavy drawings are slow to get going | hedgehog 87.1 (+10.0) | hedgehog 78.7 (+2.4) | 0.8 / 3.6 | hoop falls to 20.8 % as a circler | **not adopted**: raises the top under both styles |
| L1 gentler, `inertia / 40000` | the same | hedgehog 87.1 (+10.0) | shield 78.2 (+1.9) | 0.9 / 2.9 | | **not adopted** |
| L2 flank x2 (30 ticks) | A blade hit on a figure that is already fighting a third one counts double | grille 77.1 (0) | hoop 76.3 (0) | 2.1 / 4.4 | highest FFA rate 60.3 -> 61.5 rusher, 49.4 -> 45.9 circler | **not adopted**: cannot lower the duel top (duels untouched by design), light shapes gain about 1 point |
| L2 flank x3 | the same | grille 77.1 (0) | hoop 76.3 (0) | 3.2 / 5.0 | | **not adopted** |
| L3 elements 2 / 0.5 | The right colour matters more | grille 77.1 (0) | spiral 74.2 (-2.1) | 1.9 / 3.5 | highest FFA rate 60.3 -> 54.6 rusher | **not adopted**: lowers the top under one style only; the effect follows the colours the field happens to have |
| L4 light dash, cooldown 40 ticks at no ink up to 120 at 220 ink | Light figures get their dash back sooner | grille 76.6 (-0.5) | hoop 92.1 (+15.8) | 1.3 / 1.5 | dot 0 % as a circler | **not adopted**: the one-cell hoop dominates as a circler |
| L5 edge by size, out at `R - 0.25 * size radius` (bots keep the same extra margin) | Big drawings are out sooner | hoop2 80.0 (+2.9) | hoop 82.1 (+5.8) | 1.6 / 2.5 | | **not adopted**: raises the top under both styles |

Why nothing passed, as far as the numbers show: the leaders are different
drawings under the two styles (nested loops, 2-wide hoop, hedgehog as
rushers; one-cell hoop, shield, snake as circlers). A cost on one property
(size, weight, slowness) hands the top to the compact heavy blade drawing
(hedgehog) or to the fast sharp hoop. Scatter of one rate at 20 seeds is
about 2 points, so the -0.5 of L4 as a rusher is nothing and the -2.1 of L3
as a circler is at the edge.

Not done: no lever was run in the mixed configuration or with more seeds,
and no combination of levers was tried (the order asked for one by one).

## 4. Before and after, Ring, per bot style

Final run: `node sim/balance.js --seeds 30 --ffa 800 --soloseeds 4 --label
"INK-CORE-V3 final" --out Artifacts/Inkweight/Evidence/INK-CORE-V3` (334 s),
the same sizes as the version 2 report. Full tables: `BALANCE_REPORT.md`,
`BALANCE_REPORT.json`, `before_after_ring.md` (every archetype).

| Bot configuration | Highest duel win %, version 2 | version 3 | Highest FFA win %, version 2 | version 3 | Avg round s | Ring-out share % |
|---|---|---|---|---|---|---|
| rusher | grille 76.8 | grille 76.8 | 63.4 | 62.8 | 21.9 -> 21.9 | 26.6 -> 26.7 |
| circler | hoop 76.1 | hoop 76.1 | 55.1 | 49.7 | 35.5 -> 35.5 | 63.8 -> 64.0 |
| mixed | spiral 67.2 | spiral 66.3 | 45.7 | 47.6 | 17.4 -> 17.4 | 65.5 -> 65.7 |

| Shape family | Archetypes | Duel % rusher, V2 | V3 | Duel % circler, V2 | V3 | FFA % pooled, V2 | V3 |
|---|---|---|---|---|---|---|---|
| solid | 4 | 33.6 | 33.6 | 44.2 | 44.2 | 35.6 | 34.3 |
| hollow | 5 | 52.0 | 52.0 | 57.1 | 56.9 | 29.2 | 30.2 |
| blades | 4 | 61.4 | 61.4 | 56.2 | 56.5 | 20.8 | 20.9 |
| core+blades | 4 | 61.7 | 61.7 | 51.0 | 51.1 | 30.4 | 30.3 |
| small | 3 | 37.8 | 37.8 | 36.4 | 36.3 | 1.5 | 1.3 |

| Verdict line | Version 2 | Version 3 |
|---|---|---|
| Highest duel rate in one bot configuration | grille (rusher) 76.8 % | grille (rusher) 76.8 % |
| Highest mean of rusher-only and circler-only | hoop2 73.6 % | hoop2 73.6 % |
| Highest pooled duel rate | spiral 68.1 % | spiral 68.1 % |
| Highest pooled four-figure rate | hedgehog 48.6 % | hedgehog 49.2 % |
| Light shapes, four-figure average | 2.4 % | 2.6 % |
| 2-wide border hoop, duel rusher / circler | 76.1 / 71.0 % | 76.1 / 71.0 % |

**The balance target is still not met** (no archetype above 60 %: no; three
different shapes that can win: yes; light shapes not hopeless: no). Rusher
duels are identical to version 2 for every archetype; circler duels differ by
at most 0.9 points (more separation passes); four-figure rates move by up to about
9 points for single archetypes in single styles (crowd relaxation and the
scatter of 800 rounds), the pooled family rates by at most 1.3.

Solo, all ten enemy designs, by stake x1 / x1.5 / x2: 66.9 % / 38.1 % /
17.5 % of 160 runs won, average score 1576 / 1897 / 1737 (version 2 with
seven designs: 79.5 % / 40.2 % / 27.7 %, 1497 / 1718 / 1685; the field is
different, see the group table in section 2).

Bot styles (`style_check.txt`): a rusher beats a circler in 78.9 % of 3040
duels (version 2: 79.3 % of 1520).

## 5. Readability table (unchanged)

`node sim/readability.js` gives byte-identical output to the version 2 file
(`readability.md`, `diff` against `INK-CORE-V2/readability.md` is empty): no
stat formula and no stat number changed.

| Drawing | N | C | S | P (counted) | Armour | Armour / disc | Sharpness | Blade hit on the disc | Push weight | Top speed | Blunt hits to kill |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 10 x 10 block | 100 | 64 | 0 | 0 (0) | 154.0 | 0.57 | 1.00 | - | 100.0 | 15.6 | 129 |
| same + 12-cell straight blade | 112 | 64 | 12 | 0 (0) | 157.6 | 0.58 | 2.03 | 3.12 | 112.0 | 14.6 | 132 |
| same + 12-cell diagonal blade (staircase) | 112 | 64 | 12 | 0 (0) | 157.6 | 0.58 | 2.03 | 3.12 | 112.0 | 14.6 | 132 |
| stick figure (hollow head, body, arms, diagonal legs) | 65 | 0 | 65 | 9 (0) | 79.5 | 0.29 | 3.63 | 4.71 | 65.0 | 19.7 | 67 |
| 13-cell dot | 13 | 1 | 4 | 0 (0) | 64.9 | 0.24 | 1.70 | 2.78 | 13.0 | 32.0 | 55 |
| filled disc | 208 | 148 | 0 | 0 (0) | 270.4 | 1.00 | 1.00 | - | 208.0 | 9.6 | 226 |
| hollow ring | 172 | 16 | 0 | 208 (172) | 179.2 | 0.66 | 1.00 | - | 189.2 | 11.0 | 150 |
| 2-cell-wide border hoop (216 ink) | 216 | 0 | 0 | 529 (216) | 189.6 | 0.70 | 1.00 | - | 237.6 | 9.3 | 158 |
| 3-cell-wide hoop (216 ink) | 216 | 72 | 0 | 169 (169) | 247.5 | 0.92 | 1.00 | - | 232.9 | 9.3 | 207 |
| hedgehog | 197 | 77 | 80 | 0 (0) | 196.1 | 0.73 | 2.31 | 3.39 | 197.0 | 10.0 | 164 |
| line 32 | 32 | 0 | 32 | 0 (0) | 69.6 | 0.26 | 4.13 | 5.21 | 32.0 | 26.1 | 58 |
| 12-cell line | 12 | 0 | 12 | 0 (0) | 63.6 | 0.24 | 4.52 | 5.60 | 12.0 | 32.4 | 53 |
| all-blade snake (209 ink) | 209 | 0 | 209 | 0 (0) | 122.7 | 0.45 | 2.87 | 3.95 | 209.0 | 9.5 | 103 |

The four halves of the sentence hold as in version 2. One addition to say
out loud in solo only: the weight of an enemy copy now also hits (crush),
which fits "amount is weight" but is not a hero stat.

## 6. Tests and golden files (real output)

`cd Projects/Inkweight/Source/WebPrototype && node --test` (Node 22,
`/opt/node22/bin/node`), full output in `test_output.txt`, last lines:

```text
1..70
# tests 70
# suites 0
# pass 70
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 4872.122855
```

65 tests of version 2 plus 5 new: R3 (1), R2 (3), R1 (1).

`node tools/gen_golden.js --check` -> `golden files match`;
`node --jitless tools/gen_golden.js --check` -> `golden files match` (after
regeneration; the regeneration test in the suite compares the bytes too).
Golden changes against version 2: `stat_vectors.json` only the header's
`tuningVersion`; `sim_traces.json` 10 of 17 traces (four Ring traces with
three or four seats, six solo traces), the six duel traces and
`ring_3_simultaneous_nearest_wins` are byte-identical.

`Math.` functions in `core/*.js`: only `Math.sqrt`, `Math.floor`,
`Math.imul` (the suite enforces it).

Two things that went wrong on the way and were corrected:

- After R2 and before R1 the test "golden traces reach ... every solo
  ending" failed once (a solo trace no longer reached a required ending with
  the new crowd physics and the old solo rules). With the R1 rules all
  required branches are reached again and the test passes; the trace list
  was not changed. The coverage depends on trajectories and can break again
  with a later change.
- The first final test run reported 71 tests and 89 s because the new
  simulation script was named `lever_test.js` and `node --test` ran it as a
  test file. Renamed to `sim/lever_run.js`; the lever result files were made
  with the same code under the old name.

## 7. What the ports must follow

Exact list: `Projects/Inkweight/Source/Shared/CHANGES_V3.md` (V1 to V7, with
an app checklist and a C# checklist). In short:

1. `physics.extraSeparationPasses` 8 (number), tuning `ink-tuning-3`.
2. Crowd relaxation after the pair loop of every sub-step when the world has
   more than two bodies (`relaxPair`, `physics.crowdRelaxPasses` 4).
3. Body field `bluntBonus` (0), added to the blunt damage in `touchDamage`.
4. Solo `spawnEnemy`: speed `(enemySpeedBase + enemySpeedMult * topSpeed) *
   stakeSpeedMult`, crush `enemyCrushPerInk * N * scale * stake` as
   `bluntBonus`; new `soloEnemySpeed`, `soloEnemyCrush`; `enemySpeedMult`
   0.45, `enemySpeedBase` 3, `enemyCrushPerInk` 0.004.
5. Template fields `turnCos` / `turnSin` gone (the C# port never had them).
6. Hash layout unchanged; public functions of version 2 unchanged; replace
   both golden files. Duel traces are unchanged, so a port can check the
   steps in order: duel traces, then crowd traces, then solo traces.

The app needs no call changed; if it explains the stake it should add that
heavy enemies hit harder at higher stakes.

## 8. Records changed

`Source/Shared/CHANGES_V3.md` (new), `RULES_AS_BUILT.md` (title, sections 3,
5, 7, 8, 9, 10), `core/README.md`, `Docs/INK_RULES_V2.md` (note "what changed
since the first version 2", section 7 crush, section 8 version 3 measurement
and lever table), `ink_tuning.json`. `CHANGES_V2.md` and `INK_RULES_V1.md` are
unchanged.

## 9. Known weaknesses and not done

- Balance target unmet; pass 3 changed nothing in the Ring. The 2-wide border
  hoop is as strong as before (76.1 / 71.0 %); light shapes win 2.6 % of
  four-figure rounds.
- R1: x1.5 still cheap during the waves for heavy blunt designs; the boss
  fight with heavy designs is hard at every stake; perfect human kiting not
  measured; solo numbers rest on 4 seeds per row and one bot hero per
  drawing.
- R2: overlaps reduced about tenfold, not removed; largest overlap seen is
  still near 1 cell for single ticks in crowds.
- The golden coverage test depends on trajectories (see section 6).
- `BALANCE_REPORT.md`: the sentence with the rusher-against-circler rate was
  corrected by hand after the style check was re-run (78.9 % of 3040); the
  generator has the same new sentence.
- Not run: the browser app, the C# port, a colourless (`--neutral`) balance
  run, levers in the mixed configuration.
- Evidence files: `BALANCE_REPORT.md/.json`, `before_after_ring.md`,
  `levers/` (18 result files including the baseline and a run with the version 2 physics numbers, `SUMMARY.txt`, the lever code diff),
  `overlap_probe.txt`, `overlap_probe_before.txt`, `solo_before.txt`,
  `solo_before_summary.txt`, `solo_after_summary.txt` (the 4-seed run in
  parallel pieces before the final report; same numbers), `readability.md`,
  `style_check.txt`, `test_output.txt`.
