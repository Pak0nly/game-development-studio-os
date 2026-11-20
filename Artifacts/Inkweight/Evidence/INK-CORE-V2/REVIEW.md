# INK-CORE-V2 Independent Review

Independent review verdict: PASS

Reviewer: separate Claude Code subagent, role QA Lead. The Reviewer did not
build the candidate, changed no file except this one, and committed, merged or
pushed nothing. Throwaway scripts lived only under `/tmp/inkrev2/`.

Candidate: commit `e03ae14` on branch `worktree-agent-ac2ef5b778358368c`
(work copy `.claude/worktrees/agent-ac2ef5b778358368c`), diff against the
order commit `31e2327`.

PASS means what the order defines: the version 1 findings are fixed or decided
and documented, the tests are real and pass, the golden files cover the named
branches, the records are exact enough for the ports, the balance verdict is
stated honestly (the target itself is **not met**, and the Worker says so), and
no blocker was found that would make the browser-app and C# port update orders
build on something broken. Three **important** findings below (I4 to I6)
should be settled, I4 before the C# port freezes its vectors, because any fix
changes the golden traces again.

## 1. What was run (real output)

All with `/opt/node22/bin/node` (v22.23.5), in the work copy, no installs, no
network.

| Command | Real output (key lines) |
|---|---|
| `git diff --stat 31e2327 e03ae14` | 47 files; every path under `Projects/Inkweight/Source/Shared`, `WebPrototype/{core,sim,tools,tests}`, `Projects/Inkweight/Docs/INK_RULES_V2.md` or `Artifacts/Inkweight/Evidence/INK-CORE-V2`: inside the allowed paths. `INK_RULES_V1.md` and `WebPrototype/app` untouched. |
| `node --test` (in `Source/WebPrototype`) | `# tests 56` `# pass 56` `# fail 0` `# duration_ms 997.470354` |
| `node tools/gen_golden.js --check` | `golden files match` |
| `node --jitless tools/gen_golden.js --check` | `golden files match` |
| `/tmp/inkrev2/indep.mjs check` (own body extraction, core, 2 x 2 blade rule, 8-way enclosed flood fill, pockets, armour, sharpness, speed, element, validity; written from `INK_RULES_V2.md` / `RULES_AS_BUILT.md`, not from the core) | `items 57 mismatches 0` (filled, drips, N, C, S, enclosed, P, element, valid, armour, sharpness, topSpeed; doubles compared with `===`) |
| Python re-implementation of xorshift32 from `RULES_AS_BUILT.md` 7 | `[3438003404, 976339029, 1163348040]`, `395558742`, `38`, `0.10031384229660034`: equals the written-down values in `tests/properties.test.js:40-44` (M4) |
| `/tmp/inkrev2/p4.mjs` on V2 core | `broadside lines: cases 66 pass-through (crossed while x-overlapping) 0 max cell overlap 0.174`; `dot vs line diag: cases 240 pass-through 0 max overlap 0.051`; `dot vs dot head-on dash: pass-through 0 /40 max overlap 0.022` |
| same probe on the V1 core (`git show 31e2327:...` into `/tmp`) | `pass-through 66` of 66; `pass-through 166` of 240; `40 /40` |
| `/tmp/inkrev2/p6.mjs` (bot rounds, cell overlap sampled every 3 ticks) | e.g. `line vs block rounds 12 rounds with overlap>0.5 12 sampled ticks >0.5 2168 of 10089 max 1.00` (finding I4) |
| same with turning disabled in a `/tmp` copy of the core | `line vs block ... rounds with overlap>0.5 0 ... max 0.02` (proves turning is the cause) |
| `node sim/balance.js --seeds 60 --ffa 1200 --soloseeds 6 --out /tmp/inkrev2/bal` | `elapsed 139.9 s`; `ring identical true`, `solo identical true`, `soloSummary identical true`, `tuning identical true` against the Worker's `BALANCE_REPORT.json`; Markdown identical below the header |
| `/tmp/inkrev2/hoop2.mjs`, `hoopffa.mjs` (an optimiser drawing not in the field) | `thick hoop N 216 P 529 armour 342.8 S 0 valid true`; `style 0 thick hoop duel win 80.6%`, `style 1 ... 80.8%`; 4-figure: `style 0 win 79.7% (25 = even)`, `style 1 win 25.3%` (finding I5) |
| `/tmp/inkrev2/solo.mjs` | `enemy spiral N 209 enemy armour 30.0`; `disc vs spiral x1 won 6/6 hp 82% score 1990 | x1.5 won 6/6 hp 88% score 2526 | x2 won 6/6 hp 80% score 3165` (finding I6) |
| `/tmp/inkrev2/m3.mjs` | `full threw: seat 1 figure: overBudget | unchanged true`; `empty threw: ... tooSmall`; `null threw: ... tooSmall`; `250-cell figure, budget 220 check overBudget`, `after one lost round budget 253 check ""`; stakes `-1, 3, 1.5, '1', NaN, undefined` all `threw bad stake index` |
| `grep Math.` over `core/*.js` | only `Math.floor` (9), `Math.imul` (2), `Math.sqrt` (24) |

## 2. Version 1 findings

| Finding | Status | Evidence |
|---|---|---|
| I1 pass-through while dashing | **Fixed** for every probed approach | Own probes above: broadside lines at 25 fractional gaps x 3 lateral offsets, a dot at 60 offsets x 4 angles including 45 degrees, two dots head-on, a dot and a needle against a connected diagonal staircase, a 45-degree line against a line, block against line, line against block, three-body piles (20/20/20, 13/20/210 and three needles): no tunnelling, no swapped sides. V1 tunnels in 272 of 346 of the same cases. Contact ends the dash, `dashTicks` never exceeds 12, a dash along the solo wall stays at `r = 60` and ends after its 12 ticks; a dash along the ring edge into a block ends in one `ram` and two `hit` events, no ring-out. Idle piles lose their kinetic energy (start 394.8, end 1e-16; a few tick-to-tick increases of the size of the push-apart, no growth). The sub-step count is bounded by 8 and `RULES_AS_BUILT.md` 3 states the speed limit (192 cells/s) honestly. **But** contacts created by turning are not separated: see I4. |
| I2 golden branches | **Fixed** | `tools/trace_summary.js`: `ring_1v1_sudden_death` ends at tick 3674 (> 3600); `ring_2_idle_simultaneous_tie` both out at 1998, seat 0 wins; `ring_3_simultaneous_nearest_wins` three out at 1889, seat 2 wins; `ring_1v1_circler_vs_rusher` two rounds with both out by armour in the same tick; `solo_hero_death` `dead/armour`; `solo_time_limit` `dead/time` (with override `solo.waveMaxTicks` 600, documented); `solo_win_with_boss` `won`; `solo_upgrades_hero_and_weapon_ink` final `heroBudget 260`, `weaponBudget 75`. `tests/golden.test.js` asserts every branch. Files 364 kB. |
| I3 sharp below blunt | **Fixed** | `core/physics.js` `touchDamage`; test with the wedge (1.17 < 1.2) asserts damage 1.2. |
| M1 dead figure acts in its tick | Decided, documented | `RULES_AS_BUILT.md` 3, `CHANGES_V2.md` B14. No test (stated). |
| M2 hero death before cleared | Decided, documented, tested | `tests/solo.test.js`. |
| M3 invalid figures | **Fixed** | Ring throws before any state change (probe above); catch-up budget respected; solo stake index validated strictly. |
| M4 circular RNG test | **Fixed** | Values reproduced independently in Python. |
| M5 hash gaps | **Fixed** | Layout 2 in `core/hash.js` equals `CHANGES_V2.md` B12 item by item; `botWobble` is initialised to 0 per seat at round start, so no `undefined`/NaN enters the hash. |
| M6 shot on fallen enemy | **Fixed** | Throw and shot skip `hp <= 0`; test. |
| M7 stake without effect | **Fixed in code**, but see I6: for heavy core-less designs the stake is free again. |
| M8 hollow wording | **Fixed** | `RULES_AS_BUILT.md` 1. |

## 3. New rules checked independently

- My implementation (2 x 2 blade rule, `min(P, pocketCapPerCell * (N - S))`,
  saturating plus purity sharpness, 8-way enclosed fill from the border, pocket
  = enclosed with 0 body neighbours) matches all 57 golden stat vectors bit for
  bit, including `blade_on_block`, `diagonal_sword_on_block`, `solid_triangle`,
  `thin_l`, `thick_frame`, `thick_frame_open`, `thin_loop`,
  `loop_diagonal_gap`, `pocket_cap`, `drips_do_not_enclose`.
- `INK_RULES_V2.md` 3 and `RULES_AS_BUILT.md` 1 give the same formulas
  (`INK_RULES_V2` drops the factor `pocketCapPerCell`, which is 1). Every
  number in `INK_RULES_V2.md` (170, 0.7, 0.8, 1.2, 25 = 5^2, 1.2, 60, 38, 70,
  1.2 blunt, 24-tick cooldown, 39, dash 12 ticks x 3.8 / 120, 0.3, 0.79, 0.4
  cells, ring 44/50/56, 300/2700/3600 ticks, end radius 16, +15 % x 4, wave
  budgets, fee 40, max 10 copies, 30 + 1.2, 0.55, 0.6, stake 1.25/1.5 and
  1.1/1.2, upgrade costs and amounts, heal 35 %, 180 s, boss 1.2, one escort)
  is the number in `ink_tuning.json`. The worked examples (block 1.00, block +
  12-cell blade 2.03, hedgehog 2.24, comb 2.31, cross 2.78, line 2.95, 12-cell
  line 3.02, snake 2.47) are correct.
- Two statements are inexact (minor m3, m4 below).

## 4. Determinism and portability

- Only `+ - * /`, `Math.sqrt`, `Math.floor`, `Math.imul` (enforced by a test,
  rechecked by grep). `countEnclosed` uses an explicit stack whose order does
  not affect the result; `(k - x) / W` is exact.
- The sub-step count `floor(sqrt(maxV2) * dt / maxStepCells) + 1`, clamped to
  `maxSubSteps`, is a floating loop bound, but it uses only correctly rounded
  IEEE operations in a written-down order (`CHANGES_V2.md` B5, D8), with `dt =
  1 / 60` and `0.4` parsed as doubles; a C# port that writes the same
  expression reproduces it exactly. `maxV2` is taken once, after control and
  before the first sub-step, in index order; changes inside the tick do not
  change `sub` (documented).
- Golden files regenerate byte-identically with JIT and `--jitless`; the full
  balance run reproduces the Worker's JSON exactly although it runs in worker
  threads.
- Hash layout 2 is documented exactly in B12 (order and every field, including
  `match.round`, all `n * n` cooldowns, wobble and style per seat; solo shot
  direction and speed, budgets, colour flags, upgrade flag, copies, stake
  index, drop value, max armour).
- Carried over from the V1 review and still open for the port order (not this
  order's scope): fused multiply-add under IL2CPP, `-0` in start fronts, seed
  conversion. `CHANGES_V2.md` D8 repeats "no fused multiply-add", which C#
  source alone cannot guarantee.

## 5. `CHANGES_V2.md` against the real diff

Checked function by function against `git diff 31e2327 e03ae14 -- core`:
`isSharpCell`, `countEnclosed`, `computeStats` (fields `enclosed`, `P`),
`buildFigure` sharp flags, `createWorld.subSteps`, `stepWorld` order,
`collidePair` (`dashing`, `dashRestitution`, dash end, `ram` events and their
order before `hit`), `touchDamage`, `ringCheckFigure`, the new
`ringStartRound` error text, `botStyle`, the circler (all six steps match
`core/bots.js:136-196`), `soloCopies`, `soloEnemyArmour`, `spawnEnemy`,
`soloDropValue`, `soloStartWave` (`bad stake index`, `stakeIndex`,
`dropValue`), `soloStartBoss`, shot and throw skips, hash layout 2, every
added, removed and changed tuning key, and the golden format (`botStyle`,
`covers`, `tuningOverrides`, `fights[].upgrade`, `heroInk:`/`weaponInk:`,
new `final` fields, per-item `checkpointEvery`, new `expect` fields). I found
nothing missing that a port needs to match the golden files. Gaps of wording
are listed as m1 to m4.

## 6. Readability of the one-sentence rule

Stats computed with my own implementation and confirmed by the core (all
agree). "Blunt hits to kill" = armour / 1.2.

| Drawing | N | C | S | P (used) | Armour | Sharpness | Top speed | Blunt hits to kill |
|---|---|---|---|---|---|---|---|---|
| 10 x 10 block | 100 | 64 | 0 | 0 | 214.8 | 1.00 | 15.6 | 180 |
| same + 12-cell straight blade | 112 | 64 | 12 | 0 | 214.8 | 2.03 | 14.6 | 180 |
| same + 12-cell diagonal blade (staircase) | 112 | 64 | 12 | 0 | 214.8 | 2.03 | 14.6 | 180 |
| stick figure (hollow head, body, arms, diagonal legs) | 53 | 0 | 53 | 1 (0) | 170.0 | 2.83 | 21.6 | 142 |
| 13-cell dot (archetype) | 13 | 1 | 4 | 0 | 170.7 | 1.56 | 32.0 | 143 |
| filled disc (archetype) | 208 | 148 | 0 | 0 | 273.6 | 1.00 | 9.6 | 229 |
| hollow ring (archetype) | 172 | 16 | 0 | 208 (172) | **318.8** | 1.00 | 11.0 | 266 |
| 2-cell-wide square hoop near the border (216 ink) | 216 | 0 | 0 | 529 (216) | **342.8** | 1.00 | 9.4 | 286 |
| spiky hedgehog, own drawing (spikes to the canvas edge, 180 cells) | 180 | 68 | 68 | 0 | 217.6 | 2.24 | 10.6 | 182 |
| hedgehog (archetype, 197 cells) | 197 | 77 | 80 | 0 | 223.9 | 2.24 | 10.0 | 187 |
| line 32 | 32 | 0 | 32 | 0 | 170.0 | 2.95 | 26.1 | 142 |
| 12-cell line (splinter) | 12 | 0 | 12 | 0 | 170.0 | 3.02 | 32.4 | 142 |

- **Amount is weight: holds** exactly (`N`), and speed falls with it.
- **Thin lines are blades: holds**, better than V1. A diagonal blade now counts
  exactly like a straight one (2.03 both); a blade on a solid visibly raises
  the stat; pure lines are the sharpest. Two blurs: a small round blob gets
  blade cells from its single-cell tips (dot 1.56), and the purity part makes
  the *same* blade cut less when more body is attached (a 32-cell line alone
  2.95; a 12-cell line on a block 2.03), which a stat bar cannot explain.
- **Filled areas are armour: no longer holds as written.** Filled against thin
  is only 1.6 to 1 (273.6 / 170), a 13-cell dot has 62 % of a 208-cell disc's
  armour, and the most armoured valid drawings are **hollow**: the archetype
  ring (318.8) and a 2-cell-wide border hoop (342.8, 1.25 x the filled disc).
  In practice "closed shells are armour, filling adds a little". The Worker's
  added half sentence ("a closed shell holds a little armour inside") understates
  this: the shell holds more than filling gives.
- **Colour is the element: holds**, unchanged.

## 7. Balance claims

- Every number in `WORKER_RESULT.md` 5 matches `BALANCE_REPORT.md`/`.json`,
  and my full re-run is identical.
- The verdict is honest: "No archetype above 60 %: NOT MET", the flattering
  effect of the mixed configuration is stated, the 79.0 % (splinter, rusher)
  and 83.5 % (hoop, circler) single-style maxima are stated, and "under the
  rusher bot alone the highest rate did not improve" (71.3 % then; 77.9 %
  needle, 79.0 % splinter now) is stated plainly.
- **The pooled 61.4 % is misleading as a headline** and should not be quoted
  alone: it is the mean of three columns of which one ("mixed", where a rusher
  beats a circler in 91.7 % of duels whatever is drawn) is near 50 % by
  construction. The per-style columns flip rankings (hoop 22.3 / 83.5, cross
  21.6 / 74.7, block 71.6 / 29.6), so most of the spread is bot style, not
  drawing. The Worker says this; `INK_RULES_V2.md` 8 still leads its table with
  the pooled number.
- The field misses the obvious optimiser for the new pocket rule (I5), which
  beats every reported archetype under both styles.
- `BALANCE_REPORT.md` calls "light shapes not hopeless" MET against a yardstick
  the Worker defined; `WORKER_RESULT.md` and `INK_RULES_V2.md` say "partly".
  Labelled, so not dishonest, but the report line should say "partly" too.

## 8. Findings

No blocker found.

### Important

**I4. Turning drives figures into each other, and the summed contact normal
then does not separate them** (pre-existing in V1, not caused by the
sub-steps, but it breaks the order's wording "a detected contact always
separates the figures"). `core/physics.js:116` turns the front in the control
step, outside the sub-steps and without any contact check; the tip of a long
figure moves `radius * turn step` per tick (a 32-cell line: about 1.45 cells
per tick) while `sub` is computed only from linear speed
(`core/physics.js:156`). When a blade has turned into a solid, the contact
vectors from cells on both sides of it cancel in the sum and the push along
`n` by the largest depth (`core/physics.js:282-313`) does not resolve the
overlap. Scenario (`/tmp/inkrev2/p5.mjs`): a vertical 32-cell line at (15, 0),
front (0, -1), a block (210 cells) at (0, 0); the line steers (-1, 0) for 400
ticks: overlap above 0.5 cell in 280 of 400 ticks, 372 direction flips of its
y position larger than 0.2 cells (jitter), and after 2 s idle the line's tip is
still about 5 cells inside the block (closest cell centres 0.44 apart). In
ordinary bot rounds (`/tmp/inkrev2/p6.mjs`, 12 rounds per pair) every round of
line/block, needle/disc, lance/shield, cross/block, star/wedge,
splinter/disc, comb/hedgehog has cell centres closer than 0.5 for 2 to 20 % of
the sampled fight ticks, up to coincident centres; with turning disabled in a
throwaway copy the same pairs stay below 0.1 (one pair 0.69). V1 shows the same
pattern (worse). Visible in the browser app as blades sitting inside solids;
any fix changes the golden traces. Fix proposal: apply the turn in the
sub-steps (`turn / sub` per part) and include the tip speed
`radius * turnRate` in the sub-step count; or reject a turn step that creates a
contact deeper than `maxStepCells`; and when the summed normal is much shorter
than the deepest contact vector, push along the deepest contact's own normal.
Add a property test: no pair closer than 0.5 between cell centres at the end
of any tick of a set of bot rounds. Decide before the C# port freezes its
vectors.

**I5. Pocket armour makes an empty 2-cell-wide border hoop the strongest
drawing.** `core/drawing.js:241-242, 259`: pockets count up to `N - S`, so a
thick shell gets up to 0.8 armour per wall cell for empty space, more than a
core cell gives (0.7). Scenario (`/tmp/inkrev2/hoop2.mjs`): `rect(1,1,29,29)`
minus `rect(3,3,27,27)`, 216 ink, valid: armour 342.8 (filled disc 273.6),
radius 20.3. It wins **80.6 %** of duels as a rusher and **80.8 %** as a circler
against all 18 archetypes (20 rounds per pairing per style) and 79.7 % of
four-figure rounds with rushers (25 % even). No reported archetype is above
60 % under both styles; this one is above 80 % under both. Fix proposal: cap
pocket armour much lower (for example at `C` or at half the wall cells, or
0.3 per pocket), so a shell never out-armours a filled drawing of the same
ink, and add this hoop (and a 3-wide variant) to the optimiser field before
the next balance pass. It also contradicts "filled areas are armour" (point 6).

**I6. Solo: a heavy drawing without core cells is a free-money enemy and makes
the stake free.** `core/solo.js:110-112` gives enemy armour `30 + 1.2 *
(armour - 170)`, so any all-blade or core-less design has 30 armour whatever its
size, and `core/solo.js:133` pays every drop at least its `N`. Scenario
(`/tmp/inkrev2/solo.mjs`, same smoke method, 6 seeds): enemy = the `spiral`
(209 cells, enemy armour 30, 1 slow copy, each drop worth 209 to 253 ink):
disc, line and hedgehog heroes win **6/6 at every stake**, the kiting heroes
with 80 to 91 % armour left, scores 1990 (x1) to 3165 (x2), above every enemy
in the Worker's field. The same holds for `grille`; the Worker's own table
already shows comb enemies beaten 72/72 with 60 to 75 % armour left at x2.
At waves 0 and 1 such a design also pays more than the staked budget (209 or
211 against 120 x1), so "the drops of a wave together pay out the whole staked
budget" is not exact. Fix proposal: base enemy armour on size as well (for
example `30 + 0.4 * N + 1.2 * (armour - 170)`), and pay `floor(staked budget /
copies)` without the `max(N, ...)` floor; add a heavy core-less enemy to the
solo smoke field.

### Minor

- **m1. Last dash tick is not a ram.** `core/physics.js:128` decrements
  `dashTicks` in the control step before the sub-steps, so a contact in the
  12th dash tick sees `dashTicks == 0` (`core/physics.js:315`): normal bounce
  0.79, no `ram`, the dash is not ended (it has ended anyway). The ram window is
  11 ticks. Derivable from `RULES_AS_BUILT.md` 3 but worth one sentence in
  `CHANGES_V2.md` B6 so the port and the app do not "fix" it.
- **m2. Four seats can start overlapping.** `core/ring.js:87`: with 4 seats the
  adjacent start positions are 43.6 cells apart; four valid one-cell border
  frames (N 124, radius 22.4) start with cell overlap 0.72
  (`/tmp/inkrev2/p7.mjs`). Pre-existing; deep starting overlaps pass through
  each other (observed with two overlapping discs). Fix: start distance from the
  largest figure radius, or document.
- **m3. Stat range in `CHANGES_V2.md:347`** says armour "roughly 170 to 330";
  the hoop of I5 reaches 342.8 and the bound is about 346 (`170 + 0.8 * 220`
  plus core cells). A stat bar built on 330 overflows. State the real upper
  bound (or fix I5).
- **m4. Drop wording** in `RULES_AS_BUILT.md:209-210`, `:311` and
  `INK_RULES_V2.md:137`: "pays out its whole staked budget" should read "at
  least the staked budget; more when the design is heavier than the staked
  budget allows" (see I6).
- **m5. No test for M1**, and the I1 tests use integer gaps without a lateral
  offset and no turning case; my probes cover the gap, but a turning test would
  have found I4.
- **m6. `INK_RULES_V2.md` 8** leads with the pooled 61.4 %; lead with the
  per-style numbers (65.2 % mean of the two styles, 79 / 83.5 % single style).
- **m7. Port note:** `core/bots.js:14` (`const steer`) is module-level mutable
  state shared by both bot styles within one call; deterministic, but a port
  that keeps it per seat or per thread must reset `steer.edge` the same way.

## 9. Suggestions (Reviewer proposals, not tested beyond the probes above)

1. **Fix I4 first** (turn inside the sub-steps with the tip speed in the count,
   plus a deepest-contact fallback for the normal) and add the overlap property
   test, before the C# port freezes vectors; it is a physics correctness fix,
   not tuning.
2. **Make "filled areas are armour" true again or change the sentence by Human
   decision.** Either cap pocket armour so a shell never beats a filled drawing
   of the same ink (I5) and steepen the core part a little, or adopt "filled
   and closed shapes are armour" explicitly. In solo, tie enemy armour and drop
   value to size so a heavy core-less design is neither fragile nor overpaid
   (I6). Add the border hoop, a 3-wide hoop and a heavy snake enemy to the
   optimiser fields.
3. **Measure per style, not pooled.** Report rusher and circler separately as
   the primary result, drop "mixed" from the headline until the circler is
   competitive (it loses 91.7 %), and only then tune the remaining numbers;
   otherwise the next pass tunes against the bot, not the drawings.
