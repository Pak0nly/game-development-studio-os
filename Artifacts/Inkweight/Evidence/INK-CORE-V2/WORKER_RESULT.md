# INK-CORE-V2 Worker Result

**Read the last section first: "Correction round 1" describes the final state. Sections 1 to 9 describe the first candidate (commit `e03ae14`); its balance numbers, armour formula and solo numbers are superseded; its reports are in `before_correction_1/`.**

Worker: separate Claude Code subagent (requested model fable), roles Game
Designer and Gameplay Programmer. Not independently reviewed. Everything that
is new against `INK_RULES_V1.md` is a prototype proposal, not a Human decision.

## 1. Gate, work copy, commit

- verify-worker: `PASS worker receipt baebaf870fd288d4ff87642a8cf0ff223383e202a4e50d312c0eefe1ab7b408e`
  (exit 0). The task tooling refused a `cd` into the main checkout, so the
  command was run with the same script and arguments as absolute paths
  (`--root /home/user/game-development-studio-os`), from the worktree.
- Worktree: `/home/user/game-development-studio-os/.claude/worktrees/agent-ac2ef5b778358368c`,
  branch `worktree-agent-ac2ef5b778358368c`.
- **Deviation to report:** the worktree was created on `53d3f5b` (branch
  `main`), not on the dispatch HEAD `31e2327`, and contained no Inkweight
  files. `53d3f5b` is an ancestor of `31e2327` (13 commits), so the worktree
  branch was fast-forwarded with `git merge --ff-only 31e2327...` before any
  change. Nothing else was merged; the main checkout was only read.
- The container was restarted once during the run; the uncommitted work
  survived and was continued.
- Commit: one local commit "Inkweight: INK-CORE-V2 Worker result" on the
  worktree branch; its hash is in the Worker's final message (a file cannot
  contain the hash of its own commit). Nothing was pushed.
- Changed paths are only: `Projects/Inkweight/Source/Shared`,
  `Projects/Inkweight/Source/WebPrototype/{core,sim,tools,tests}`,
  `Projects/Inkweight/Docs/INK_RULES_V2.md`,
  `Artifacts/Inkweight/Evidence/INK-CORE-V2`.

## 2. Review findings

| Finding | Done | Where |
|---|---|---|
| I1 pass-through while dashing | Fixed. A tick is cut into up to 8 sub-steps so that no body moves more than 0.4 cells between two contact scans; a contact ends the dash of both bodies (the cause of the velocity override) and is a ram with its own bounce factor, so the dash momentum goes into the other body. Tests: the Reviewer's scenario (two 20-cell lines broadside, gaps 6 to 14: never cross, both hit, ram recorded), a dashing dot against a one-cell line at 40 offsets, push transfer between two blocks, sub-step count. | `core/physics.js`, `tests/review_fixes.test.js` |
| I2 golden branches | Added traces: sudden death (round ends at tick 3674), simultaneous knock-out with an exact tie (lowest seat), simultaneous knock-out decided by distance (three seats, seat 2 wins), a naturally occurring simultaneous armour knock-out (circler trace), circler bots, hero death, solo time limit, a won run with boss, hero-ink and weapon-ink upgrades. A test asserts each branch is in the file. Files: 364 kB together (version 1: 202 kB). | `tools/gen_golden.js`, `tests/golden.test.js` |
| I3 sharp below blunt | Fixed: `max(bluntDamage, sharpness)`. Test with the wedge (sharpness 1.17, blunt 1.2). | `core/physics.js` |
| M1 dead figure still acts in its tick | Kept, documented (RULES_AS_BUILT section 3, CHANGES B14). No test. | docs |
| M2 hero death before cleared wave | Kept, documented, test added. | `tests/solo.test.js` |
| M3 Ring accepts invalid figures | Fixed: `ringCheckFigure`, `ringStartRound` throws and changes nothing. Solo already refused invalid drawings; the stake index is now checked too. Tests added. | `core/ring.js`, `core/solo.js` |
| M4 circular generator test | Fixed: written-down values for `rngCreate`, `rngDerive`, `rngInt`, `rngFloat`. | `tests/properties.test.js` |
| M5 hash leaves out state | Fixed: hash layout 2 (cooldowns, dash direction, bot wobble and style, round; solo budgets, colours, upgrade flag, wave, copies, stake, drop value, shot direction and speed). Tests added. | `core/hash.js` |
| M6 shot spent on fallen enemy | Fixed, test added. | `core/solo.js` |
| M7 stake without effect at the cap | Fixed: stake raises enemy damage and speed, drops pay out the whole staked budget. Tests added. | `core/solo.js` |
| M8 hollow wording | Corrected in RULES_AS_BUILT; the new blade and pocket rules make the statement exact. | docs |

## 3. Coordinator input during the run (browser prototype Worker)

1. **A blade on a solid body must visibly raise sharpness.** Done. The sharp
   stat now counts blade cells with a ceiling (`1 + 1.2 S^2 / (S^2 + 25)`),
   plus a purity part for light all-blade drawings. A 10 x 10 block with a
   12-cell blade goes from 1.00 to 2.03 (blunt is 1.2; the scale ends at 3.4).
   Damage is still applied only when a blade cell is in the contact. Measured
   on the way: pure count without the purity part made light blades weak
   (line 46 to 50 %, needle 35 %, 12-cell line 23 to 28 %) and heavy spiked
   bodies best (comb 67 %); the purity part without a weight term made heavy
   all-blade optimiser drawings best (spiral 68 to 72 %). A "blade cuts by
   closing speed" rule was built, measured (sweeps 4 to 6) and removed again:
   it made rushing light blades much worse and did not tame the heavy ones.
   Blade wear and "blade cells push less" were considered and not built.
2. **Solo too easy with a big hero.** Done, see section 6: the disc hero now
   wins 62 of 108 smoke runs instead of all, heal is 35 %, enemy copies hit
   with 60 % damage and have a new armour formula.
3. **Diagonal strokes.** Done with a new sharp rule: a body cell is a blade
   cell when it is in no filled 2 x 2 square. A one-cell staircase is all
   blade; the slanted side, the flat side and the corners of a solid are not
   (only single-cell tips). This replaces the "5 empty neighbours" rule.

## 4. Tests (real output)

Command, in `Projects/Inkweight/Source/WebPrototype`: `/opt/node22/bin/node --test`

```text
# tests 56
# suites 0
# pass 56
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 1012.987142
```

`node tools/gen_golden.js --check`, also with `--jitless` and `--no-opt`:
`golden files match` three times. Full output with every test name and the
trace summary: `test_output.txt`. Version 1 had 39 tests.

## 5. Ring balance

Method: `node sim/balance.js --seeds 60 --ffa 1200 --soloseeds 6` (140 s).
18 archetypes (14 of version 1 plus the optimiser drawings hoop, spiral,
grille, splinter), three bot configurations (all rushers, all circlers, mixed),
per configuration 9180 duel rounds and 1200 four-figure rounds. Reports:
`BALANCE_REPORT.md`, `BALANCE_REPORT.json`; all drawings black:
`neutral/`; tuning sweeps: `sweeps/sweep_1.txt` to `sweep_10.txt` (6 to 14
seeds per pair, so single values there carry several points of noise; sweeps
1 to 4 used the old sharp rule, sweeps 5 and 6 the blade count without the
purity part, 7 the purity part without its weight term, 8 to 10 the final
formula).

Before (version 1 report, 14 archetypes, rusher bot only) and after:

| Archetype | V1 duel % | V1 FFA % | V2 duel % all | V2 rusher | V2 circler | V2 mixed | V2 FFA % all | V2 FFA rusher |
|---|---|---|---|---|---|---|---|---|
| shield | 50.6 | 36.9 | 61.4 | 55.1 | 75.3 | 53.8 | 39.3 | 46.6 |
| needle | 44.2 | 4.7 | 61.3 | 77.9 | 51.8 | 54.3 | 19.1 | 11.0 |
| line | 67.7 | 4.4 | 60.0 | 62.8 | 53.6 | 63.4 | 9.4 | 2.5 |
| comb | 53.7 | 24.0 | 55.3 | 49.9 | 65.3 | 50.7 | 31.4 | 30.1 |
| spiral * | - | - | 54.7 | 57.1 | 57.2 | 49.8 | 28.3 | 30.5 |
| splinter * | - | - | 54.7 | 79.0 | 36.9 | 48.1 | 25.3 | 28.9 |
| grille * | - | - | 54.3 | 56.3 | 58.9 | 47.6 | 24.0 | 27.8 |
| ring | 30.6 | 9.9 | 52.8 | 51.7 | 56.5 | 50.4 | 36.1 | 46.0 |
| hoop * | - | - | 52.3 | 22.3 | 83.5 | 51.1 | 24.4 | 21.2 |
| block | 60.3 | 54.5 | 50.8 | 71.6 | 29.6 | 51.2 | 39.1 | 52.7 |
| hedgehog | 64.0 | 60.1 | 50.6 | 70.2 | 28.8 | 52.6 | 36.6 | 45.6 |
| cross | 49.6 | 4.2 | 49.7 | 21.6 | 74.7 | 52.8 | 13.4 | 3.1 |
| lance | 59.5 | 25.8 | 47.0 | 50.5 | 36.8 | 53.6 | 15.5 | 4.4 |
| star | 56.8 | 15.2 | 46.9 | 27.1 | 61.6 | 52.0 | 16.8 | 6.6 |
| wedge | 71.3 | 65.5 | 46.7 | 56.7 | 29.9 | 53.5 | 27.3 | 29.6 |
| disc | 64.6 | 53.2 | 44.6 | 59.4 | 22.6 | 51.8 | 31.9 | 43.1 |
| frame | 26.3 | 0.0 | 41.4 | 26.8 | 46.5 | 50.9 | 23.2 | 14.4 |
| dot | 0.8 | 0.9 | 15.7 | 4.2 | 30.7 | 12.3 | 10.7 | 9.5 |

The two columns "V1" and "V2 rusher" are the like-for-like pair (same bot),
but the field is larger now, so even they are not strictly comparable.

Intermediate step, measured with only 6 seeds per pair (`sweeps/sweep_1.txt`,
row A0: version 1 numbers plus the I1 and I3 fixes, old sharp rule): highest
pooled duel rate line 75 %, block 93 % as rusher, highest four-figure rate
block 65 %, light shapes 4.8 % on average.

Honest verdict:

- **No archetype above 60 %: NOT MET.** Pooled over the three configurations
  the highest is shield with 61.4 %, but that number is flattered: in the
  mixed configuration the bot style decides, not the drawing (a rusher beats a
  circler in 91.7 % of 2448 duels, `style_check.txt`), so the mixed column is
  near 50 % for everything. Mean of rusher-only and circler-only: shield
  65.2 %. Inside one bot style single drawings reach 79.0 % (splinter,
  rusher) and 83.5 % (hoop, circler). Under the rusher bot alone the highest
  rate did not improve against version 1 (71.3 % then, 77.9 % needle and
  71.6 % block now among the old 14); the winners changed from heavy solids
  to light pure blades.
- **Three clearly different shapes can win: MET** (solid, hollow, blades,
  core+blades and small all have an archetype at or above 50 % pooled).
- **Light shapes in four-figure rounds: improved, not solved.** Highest
  four-figure win rate 65.5 % to 39.3 % pooled (52.7 % with rushers only).
  Light drawings pooled: needle 19.1 %, splinter 25.3 %, cross 13.4 %, dot
  10.7 %, line 9.4 % (version 1: all under 5 %). With rushers only the line
  (2.5 %) and the cross (3.1 %) are still nearly hopeless.
- Hollow shapes have a job: ring 30.6 % to 52.8 %, frame 26.3 % to 41.4 %.
- The dot is still weak in duels (15.7 %).
- The optimiser drawings do not break the pooled field (52 to 55 %), but the
  12-cell line wins 79 % of duels as a rusher and the one-cell loop 83.5 % as
  a circler.
- Without elements (`neutral/`, 20 seeds): highest pooled 63.8 % (shield),
  same-style mean 68.4 %.

Which changes are principled and which are tuned against the field:

- Principled: sub-steps and dash contact (a correctness fix); `max(blunt,
  sharp)`; the 2 x 2 blade rule (readable, fixes diagonals); blade count with
  a ceiling (readability request); pocket armour for closed thick shells (a
  job for hollow shapes) with the cap `N - S` (a wall of blade cells holds
  nothing); flatter armour (the lever that moved four-figure rounds); stake
  effects in solo.
- Tuned against this field, say so plainly: the purity part of sharpness and
  especially its weight term `1 / (1 + N / 60)`, which exists because the
  optimiser drawings spiral and grille were the best drawings without it;
  the values 170 / 0.7 / 0.8 / 1.2 / 1.2; `dashRestitution` 0.3; all solo
  numbers.
- Tried and not kept: knockback by the root of the weight (sweeps 1 to 3, 6
  and 7, no clear gain), blade damage by closing speed (sweeps 4 to 6), pocket
  cap per body cell (made the one-cell loop win 80 to 85 % of four-figure
  rounds, sweep 1), share-squared sharpness at lower strength (sweeps 2 and
  3; rejected because of the readability request).
- Element effects were not changed and not studied beyond the per-element
  averages in the report.

## 6. Solo arena

Smoke run, 4 bot heroes x 6 enemy designs x 3 stakes x 6 seeds = 432 runs
(version 1: 180 runs, 86 % won, mostly with more than 75 % armour left):

| Stake | Runs won % | Avg waves cleared | Avg armour left % | Avg score |
|---|---|---|---|---|
| x1 | 80.6 | 5 | 42.6 | 1484 |
| x1.5 | 62.5 | 4.47 | 27.2 | 1791 |
| x2 | 36.1 | 3.8 | 20.0 | 1807 |

Overall 59.7 % won, 29.9 % armour left. Needle swarms: beaten at x1 by the
disc, hedgehog and line heroes (6 of 6 each; star 1 of 6), 2 of 48 runs won
at x1.5 and x2. Swarms of the 12-cell line: 10 of 24 at x1, 4 of 48 above.
Weaknesses: the score barely rises from x1.5 to x2 because fewer waves are
cleared; block enemies make long fights (230 to 340 s per run); comb enemies
are always beaten (72 of 72); the brawling hedgehog loses to block enemies
(2 of 18). The mix is believable but uneven, and it was tuned in four short
rounds.

## 7. API and state changes the ports must follow

Exact list: `Projects/Inkweight/Source/Shared/CHANGES_V2.md`. In short:

- No function removed or renamed. New: `isSharpCell`, `countEnclosed`,
  `ringCheckFigure`, `soloDropValue`, `soloEnemyArmour`.
- Stats: new fields `enclosed`, `P`; new sharp rule; new sharpness and armour
  formulas.
- Tuning: version `ink-tuning-2`; removed `stats.sharpMinEmptyNeighbours`,
  `sharpPerSharpCell`, `sharpPerSharpShare`, `sharpPerSharpShareSquared`;
  new `stats.armourPerPocket`, `pocketCapPerCell`, `sharpMax`,
  `sharpHalfCells`, `sharpPurity`, `sharpPurityWeightRef`,
  `physics.dashRestitution`, `maxStepCells`, `maxSubSteps`, six
  `bots.circler*`, `solo.stakeDamageMult`, `stakeSpeedMult`,
  `copyInkOverhead`, `enemyArmourBase`; `solo.enemyArmourMult` changed its
  meaning.
- `stepWorld`: sub-steps; a contact ends a dash; event `ram`; world field
  `subSteps`.
- Match: `botStyle[]`. Run: `stakeIndex`, `dropValue`.
- `ringStartRound` and `soloStartWave` can throw in new cases.
- Hash layout 2. Golden files: new fields, `botStyle`, `tuningOverrides`,
  `heroInk:` / `weaponInk:` upgrade strings, per-item `checkpointEvery`.

## 8. Records written

`Source/Shared/RULES_AS_BUILT.md` (rewritten for version 2),
`Source/Shared/CHANGES_V2.md`, `WebPrototype/core/README.md`,
`Docs/INK_RULES_V2.md`. `INK_RULES_V1.md` untouched.

## 9. Known weaknesses and not done

- The balance target is not met (section 5).
- Both bot styles are simple; the circler loses to the rusher nine times in
  ten, so "mixed" is a weak third view.
- The armour stat is now much flatter (170 to about 320); "filled areas are
  armour" is a 1.6 to 1 effect. This is an open design question
  (RULES_AS_BUILT section 10).
- Sharpness has two parts; the second (purity by weight) is harder to explain
  on a stat bar.
- M1 has no test. Element effects unchanged. No new rule gives the dot a job.
- `sim/tune_search.js` got new parameter ranges but was only syntax-checked,
  not run; it still uses rusher bots only.
- The golden `solo_time_limit` trace needs one tuning override
  (`solo.waveMaxTicks` 600); the port's replay must support `tuningOverrides`.
- The C# port and the browser app were not touched and do not match this
  core until their update orders run. The app's unknown-event handling was
  read (`app/fight.js` ignores unknown event types); nothing else of the app
  was checked against version 2.
- Bit-exactness was checked only inside Node (JIT, `--jitless`, `--no-opt`).
- Capability Knowledge Base: not applicable (no tool, package or asset
  choice), as stated in the order.

## 10. Correction round 1 (after the independent review of the first candidate)

Review: `Artifacts/Inkweight/Evidence/INK-CORE-V2/REVIEW.md` in the main
checkout (verdict PASS with important findings I4 to I6 and minor m1 to m7).
The container was restarted once more during this round; work continued from
the files on disk, with two local work-in-progress commits before the final
one (`7c807d9`, `8f9ba9f`). Nothing was pushed.

### 10.1 What changed

| Finding | Done |
|---|---|
| I4 turning pushes figures into each other | Fixed in `core/physics.js`. The turn of the front now happens inside the sub-steps (one part of the turn per sub-step), and the speed of the outermost cell (`radius * turnRate`) counts for the number of sub-steps while a body turns. When the summed contact vectors cancel (shorter than half the deepest depth) the push goes along the deepest contact; a contact still deeper than 0.25 after the push is scanned and pushed again, positions only, at most twice. Reviewer's scenario (line turns into a block, 400 ticks): ticks with overlap above 0.5: 0 (before: 280), largest overlap 0.012, after 2 s idle 0.000 (before: tip 5 cells inside). Bot rounds: 0 ticks above 0.5 for seven of the Reviewer's eight pairs. **Not fully solved:** comb against hedgehog (one-cell teeth meshing with one-cell gaps) still has 52 of 21305 ticks above 0.5, largest 0.79 (before: 2 to 20 % of ticks, up to 1.0). Stated in RULES_AS_BUILT section 3; a test bounds it at 1 %. |
| I5 and the rule sentence | Armour is `60 + 1 C + 0.3 N + 0.3 * min(P, N - S)`. Disc 270.4, line 69.6 (3.9 to 1), dot 64.9 (0.24 of the disc). The 2-cell-wide border hoop has 189.6 (was 342.8), the hollow ring 179.2; a test asserts that every hollow archetype and the hoop have less armour than a filled drawing of the same ink. Hollow shapes keep a small other job: counted pocket cells add 10 % of a cell each to the push weight (`stats.push`, the collision mass). Compensation for stronger solids: a blade hit also takes 0.4 % of the victim's full armour (`stats.sharpArmourCut`); the purity part of sharpness went from 1.2 to 3. Both hoops (`hoop2`, `hoop3`) are in the optimiser field. |
| I6 solo free-money enemy | Enemy armour is `(0.6 N + 0.2 armour) * scale`; the scale (0.5 to 2) is the staked budget divided by what the copies cost, so ink that buys no further copy makes the copies tougher. Drop value is `floor(staked budget / copies)` without the `max(N, ...)` floor: a wave never pays more than its staked budget. The snake enemy is in the smoke field: 7 of 48 runs won (the review won 18 of 18 with 80 to 91 % armour left). Enemy damage 40 %. |
| m1 last dash tick is no ram | Kept; one paragraph in CHANGES_V2 B6 and RULES_AS_BUILT section 3. |
| m2 four seats can start overlapping | `ring.startDistanceFraction` 0.55 to 0.6; test with four canvas-wide frames (overlap 0 at the start). |
| m3 stat ranges | Real ranges in CHANGES_V2 (B2, B3, C2), RULES_AS_BUILT section 1 and the core README: armour 63.6 to about 290 for 220 ink (never above `60 + 1.3 N`, about 450 with full catch-up ink), sharpness 1.0 to 4.52 (bar end 4.7), push weight `N` to `1.1 N`, top speed 9.2 to 32.4. |
| m4 drop wording | Obsolete through I6: the wave pays the staked budget and never more; texts corrected. |
| m5 tests | Added: M1 test; I1 with fractional gaps and sideways offsets; six turning scenarios with and without dash (overlap never above 0.5, at rest below 0.05); tip speed in the sub-step count; bot rounds for eight pairs under both bot styles (no overlap above 0.5 at the end of any tick); the meshing-teeth bound. |
| m6 INK_RULES_V2 section 8 | Rewritten; leads with the per-bot-style numbers, says "not met" first. |
| m7 bot scratch state | Port note in CHANGES_V2 B9 and RULES_AS_BUILT section 7. |

Also: `BALANCE_REPORT.md` now says "partly" instead of "MET" for the light
shapes yardstick, and its text about the mixed configuration quotes the new
style check.

A finding of my own while writing the sideways-offset test: two parallel
one-cell lines that meet with a sideways offset of a fraction of a cell slide
apart sideways (the rows of cell circles act like a washboard) and can then
pass each other without ever overlapping. That is contact physics, not
tunnelling; the test checks crossing only while the lines still overlap
sideways.

### 10.2 Tests and checks (real output)

`/opt/node22/bin/node --test` in `Projects/Inkweight/Source/WebPrototype`:

```text
# tests 65
# pass 65
# fail 0
# duration_ms 2259.655687
```

`node tools/gen_golden.js --check`, also `--jitless` and `--no-opt`: `golden
files match` three times. Golden files 308 kB together. Full output:
`test_output.txt`. `node sim/overlap_probe.js` (`overlap_probe.txt`):

```text
line turns into block, 400 ticks: ticks with overlap > 0.5: 0, max 0.012, after 2 s idle 0.000
line vs block          rounds 12, rounds with overlap > 0.5: 0, ticks > 0.5: 0 of 22964, max 0.06
needle vs disc         rounds 12, rounds with overlap > 0.5: 0, ticks > 0.5: 0 of 24758, max 0.24
lance vs shield        rounds 12, rounds with overlap > 0.5: 0, ticks > 0.5: 0 of 23791, max 0.22
cross vs block         rounds 12, rounds with overlap > 0.5: 0, ticks > 0.5: 0 of 23610, max 0.07
star vs wedge          rounds 12, rounds with overlap > 0.5: 0, ticks > 0.5: 0 of 24912, max 0.25
splinter vs disc       rounds 12, rounds with overlap > 0.5: 0, ticks > 0.5: 0 of 27889, max 0.24
spiral vs block        rounds 12, rounds with overlap > 0.5: 0, ticks > 0.5: 0 of 27507, max 0.04
comb vs hedgehog       rounds 12, rounds with overlap > 0.5: 8, ticks > 0.5: 52 of 21305, max 0.79
```

Golden coverage lost in this round: the first candidate had a naturally
occurring simultaneous knock-out by armour in the circler trace; with the new
numbers that trace no longer contains one, and the assertion for it was
removed. Simultaneous knock-outs by the ring (exact tie and by distance),
sudden death (round ends at tick 3630), hero death, time limit, a won run and
both ink upgrades are still in the file and asserted.

### 10.3 Readability table (`node sim/readability.js`, `readability.md`)

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

"Blade hit on the disc" = sharpness plus 0.4 % of the disc's armour.

### 10.4 Balance after correction round 1

`node sim/balance.js --seeds 30 --ffa 800 --soloseeds 4` (185.7 s; fewer
seeds than the first candidate's run because of the container restarts), 20
archetypes, 5700 duel rounds and 800 four-figure rounds per bot
configuration. Tuning sweeps of this round: `sweeps/correction1_sweep_1.txt`
to `_4.txt` (6 to 8 seeds, noisy). The all-black `neutral` run was not
repeated.

| Archetype | Armour | Sharp | Duel % rusher | Duel % circler | Duel % mixed | Duel % pooled | FFA % rusher | FFA % circler | FFA % pooled |
|---|---|---|---|---|---|---|---|---|---|
| spiral * | 122.7 | 2.87 | 65.4 | 71.8 | 67.2 | 68.1 | 34.8 | 38.5 | 35.1 |
| grille * | 123.3 | 2.86 | 76.8 | 67.4 | 55.1 | 66.4 | 44.6 | 41.5 | 40.6 |
| hedgehog | 196.1 | 2.31 | 75.3 | 55.1 | 64.9 | 65.1 | 63.4 | 38.4 | 48.6 |
| hoop2 * | 189.6 | 1 | 76.1 | 71.0 | 45.1 | 64.1 | 53.9 | 34.4 | 40.5 |
| comb | 136 | 2.47 | 67.2 | 57.5 | 61.8 | 62.2 | 35.1 | 26.1 | 32.1 |
| hoop * | 87.6 | 3.38 | 44.0 | 76.1 | 54.2 | 58.1 | 15.7 | 18.7 | 18.4 |
| shield | 255.6 | 1 | 30.3 | 73.7 | 61.6 | 55.2 | 33.3 | 55.1 | 44.7 |
| hoop3 * | 247.5 | 1 | 54.2 | 60.4 | 42.6 | 52.4 | 47.1 | 41.2 | 41.5 |
| splinter * | 63.6 | 4.52 | 54.0 | 54.2 | 47.4 | 51.9 | 2.5 | 1.2 | 2.7 |
| cross | 78.9 | 3.66 | 48.9 | 53.9 | 51.6 | 51.5 | 2.8 | 6.3 | 5.2 |
| needle | 66 | 4.38 | 59.3 | 47.0 | 47.7 | 51.3 | 0.0 | 2.7 | 1.5 |
| star | 138.9 | 2.28 | 44.6 | 58.3 | 50.9 | 51.2 | 12.8 | 28.7 | 20.1 |
| lance | 167.1 | 2.13 | 59.7 | 33.2 | 57.9 | 50.2 | 13.7 | 26.8 | 20.7 |
| ring | 179.2 | 1 | 50.3 | 45.3 | 45.8 | 47.1 | 29.2 | 32.5 | 32.3 |
| wedge | 259 | 1.17 | 43.5 | 38.8 | 56.8 | 46.4 | 34.4 | 26.6 | 32.4 |
| line | 69.6 | 4.13 | 54.6 | 31.8 | 42.6 | 43.0 | 0.6 | 0.6 | 2.2 |
| block | 279 | 1 | 32.8 | 35.4 | 56.1 | 41.5 | 34.9 | 28.9 | 32.6 |
| disc | 270.4 | 1 | 27.5 | 28.9 | 55.4 | 37.3 | 31.0 | 29.0 | 32.6 |
| frame | 126 | 1.87 | 35.3 | 32.5 | 34.2 | 34.0 | 5.5 | 20.6 | 13.2 |
| dot | 64.9 | 1.7 | 0.0 | 7.9 | 1.1 | 3.0 | 0.0 | 0.6 | 0.2 |

Style check (`style_check.txt`, 4 seeds): a rusher beats a circler in 79.3 %
of 1520 duels (first candidate: 91.7 %).

Honest verdict:

- **The balance target is not met, and the duel balance is worse than the
  first candidate's.** Highest duel win rate: rusher bots 76.8 % (grille),
  circler bots 76.1 % (hoop), mean of the two 73.6 % (hoop2), pooled 68.1 %
  (spiral). First candidate: 79.0 / 83.5 / 65.2 / 61.4. Version 1 (rusher
  only, 14 archetypes): 71.3 %.
- **Light shapes in four-figure rounds are hopeless again:** 2.4 % on average
  (needle 1.5, line 2.2, cross 5.2, 12-cell line 2.7, dot 0.2; even is 25 %).
  The first candidate had 15.6 % with flat armour. Restoring "filled areas
  are armour" took this away; I found no principled counterweight in the
  time (the armour cut and the higher purity help light blades in duels, not
  in a crowd).
- **Filled solids without a blade are weak in duels** (disc 27.5 % and block
  32.8 % as rushers) although they have the most armour, because of the
  armour cut. Without the armour cut (`correction1_sweep_4.txt`) the thick empty shells won 85
  to 93 % as rushers and light blades fell to 25 to 33 %; with it the shells
  are at 76 % and the solids low. The value 0.004 is a compromise, not a
  solution.
- The Reviewer's 2-cell-wide hoop: armour 189.6 instead of 342.8, duel 76.1 %
  rusher / 71.0 % circler (review: 80.6 / 80.8), four-figure 53.9 % with
  rushers (review: 79.7 %). Better, still too strong; its strength now comes
  from its size (radius 20.3) and weight, not from armour.
- Three different shape families at or above 50 % pooled: yes (blades,
  core+blades, hollow, solid through the shield, small through needle and
  12-cell line).
- The dot wins 3 % of its duels.

Solo smoke run, 336 runs (4 heroes x 7 enemy designs x 3 stakes x 4 seeds):

| Stake | Runs won % | Avg waves cleared | Avg armour left % | Avg score |
|---|---|---|---|---|
| x1 | 79.5 | 5 | 37.0 | 1497 |
| x1.5 | 40.2 | 4.51 | 21.3 | 1718 |
| x2 | 27.7 | 3.68 | 10.5 | 1685 |

Overall 49.1 % won, 22.9 % armour left. Runs won per enemy design: dot 38 of
48, block 47 of 48, comb 27 of 48, cross 17 of 48, 12-cell line 16 of 48,
needle 13 of 48, snake 7 of 48. Per hero: disc 47 of 84, line 45, hedgehog
39, star 34. Weak points: the score does not rise from x1.5 to x2 (fewer
waves cleared); block enemies are nearly always beaten; the snake enemy went
from free money to the hardest design (only the disc hero beats it); the boss
fight still pays the ink of the boss and its escorts, so heavy enemy designs
pay more there. Solo was tuned in three short rounds with 2 seeds each.

### 10.5 What the ports must follow now

`CHANGES_V2.md` is still one list from version 1 to the final state; parts
that changed in this round are marked "(correction round 1)". Against the
first candidate the differences are:

- Armour formula values 60 / 1 / 0.3 / 0.3; new stats `pocketCells`, `push`;
  `fig.mass = stats.push`; new key `stats.pushPerPocket`.
- `stats.sharpPurity` 3; new key `stats.sharpArmourCut` and the armour cut in
  `touchDamage`.
- `stepWorld`: turn inside the sub-steps, tip speed in the sub-step count,
  body scratch fields `turning`, `turnDx`, `turnDy`.
- `collidePair`: deepest-contact normal, extra separation passes; new keys
  `physics.deepNormalShare`, `deepContactDepth`, `extraSeparationPasses`.
- `ring.startDistanceFraction` 0.6.
- Solo: `soloWaveArmourScale` (new), `soloEnemyArmour(tuning, fig, scale)`
  (new formula and third argument), `soloDropValue` without the floor; keys
  `solo.enemyArmourPerInk`, `copyArmourScaleMin`, `copyArmourScaleMax` new,
  `solo.enemyArmourBase` removed, `enemyArmourMult` 0.2, `enemyDamageMult`
  0.4.
- Golden files regenerated; `expect` has `pocketCells`, `push`, `mass`; two
  more archetypes.
- Hash layout unchanged (layout 2).

### 10.6 Known weaknesses and not done in this round

- Balance target not met (10.4).
- Meshing one-cell teeth can still overlap deeper than 0.5 for single ticks.
- No golden trace with a simultaneous knock-out by armour any more.
- The full balance run used 30 seeds per pair and 800 four-figure rounds; the
  neutral run was not repeated; `sim/tune_search.js` still not run.
- The stick figure and the other rows of the readability table are my own
  drawings, not the Reviewer's exact ones (my stick figure has 65 cells, the
  Reviewer's 53).
- The C# port and the browser app still do not match this core.
