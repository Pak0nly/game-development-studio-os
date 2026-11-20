# INK-CORE-V2 Worker Result

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
