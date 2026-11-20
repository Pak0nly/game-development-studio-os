# Inkweight Core: Changes from Version 1 to Version 2 (Work Order INK-CORE-V2)

Exact change list for the two follow-up orders: the C# port
(`Source/Unity`) and the browser app (`WebPrototype/app`). It is written so
that the port can be updated without reading the JavaScript diff. The full
rules as now built are in [`RULES_AS_BUILT.md`](RULES_AS_BUILT.md); when this
list and the code differ, the code and the golden files are what counts.

Everything here is a prototype proposal by the Worker, not a Human decision.

Notation: "old" is core version 1 (tuning `ink-tuning-1`), "new" is version 2
(tuning `ink-tuning-2`). Section numbers `B1` ... are for cross-reference only.

## A. Summary

| # | Area | Change | Why |
|---|---|---|---|
| B1 | `drawing.js` | Sharp cell rule replaced: a body cell is sharp when it is in no filled 2 x 2 square | Diagonal strokes count as blades, corners and slanted sides of solids do not (coordinator input 3) |
| B2 | `drawing.js` | Sharpness formula replaced (count of blade cells, saturating, plus a purity part) | A blade on a solid body must visibly raise the stat (coordinator input 1) |
| B3 | `drawing.js` | Enclosed space: new stats `enclosed`, `P`; pocket cells add armour | A job for hollow shapes |
| B4 | tuning | Armour flatter: base 170, 0.7 per core cell | Balance: light shapes in four-figure rounds |
| B5 | `physics.js` | `stepWorld` cuts a tick into sub-steps | Review finding I1 |
| B6 | `physics.js` | A contact ends a dash; own bounce factor for a ram; new event `ram` | Review finding I1 |
| B7 | `physics.js` | Sharp touch = `max(bluntDamage, sharpness)` | Review finding I3 |
| B8 | `ring.js` | `ringStartRound` refuses invalid figures; new `ringCheckFigure` | Review finding M3 |
| B9 | `ring.js`, `bots.js` | `match.botStyle[]`; second bot style (circler) | Balance task 5 |
| B10 | `solo.js` | Copies cost a fee; enemy armour formula; stake raises enemy damage and speed; drops pay the staked budget; stake index checked | Review finding M7, task 6, coordinator input 2 |
| B11 | `solo.js` | Shots and throws ignore enemies already at 0 armour | Review finding M6 |
| B12 | `hash.js` | Hash layout 2 (more state) | Review finding M5 |
| B13 | golden files | New stat fields, new traces, `tuningOverrides`, new upgrade strings | Review finding I2 |
| B14 | decided, unchanged | M1, M2, M8 documented | Review |

Unchanged: `rng.js`; body extraction; core cells; centroid, radius, inertia;
element rule; top speed; control and turning; contact scan and normal; ring
radius curve, start slots, elimination order and the simultaneous knock-out
rule; catch-up budget; the solo throw, shot flight, drop pick-up, upgrade
logic, boss drawing; the rusher bot's behaviour; the solo enemy bot and both
hero bots.

## B. Changes in detail

### B1. Sharp cells (`core/drawing.js`, new `isSharpCell(body, W, H, x, y)`)

- Old: a body cell was sharp when at least `stats.sharpMinEmptyNeighbours` (5)
  of its 8 neighbours were empty.
- New: a body cell `(x, y)` is sharp when none of the (up to four) 2 x 2
  squares that contain it is completely filled with body cells. The squares
  have their top-left corner at `(x - 1, y - 1)`, `(x, y - 1)`, `(x - 1, y)`
  and `(x, y)`; a square that reaches outside the canvas is never filled.
  Loop order in the code: `oy` from -1 to 0 (outer), `ox` from -1 to 0; the
  result does not depend on the order.
- Used in two places, which must agree: `computeStats` (count `S`) and
  `buildFigure` in `physics.js` (the per-cell flag `fig.sharp[k]`).
- Tuning key `stats.sharpMinEmptyNeighbours` is **removed**.
- Consequences (all covered by tests and golden vectors): every cell of a
  one-cell-wide line, of a connected diagonal staircase, of a thin cross
  (crossing included) and of an L of thin strokes is sharp; a line two cells
  wide has no sharp cell; the four corners of a filled rectangle are no longer
  sharp; of a solid triangle only single-cell tips are sharp. `C + S <= N`
  still holds.

### B2. Sharpness (`core/drawing.js`, `computeStats`)

- Old: `sharpBase + sharpPerSharpCell * S + sharpPerSharpShare * S / N +
  sharpPerSharpShareSquared * (S / N) * (S / N)`.
- New, in exactly this order of operations (for `N > 0`; for `N = 0` the
  sharpness is `sharpBase`):

  ```text
  sharpness = sharpBase + ( sharpMax * (S * S) / (S * S + sharpHalfCells * sharpHalfCells)
                            + sharpPurity * (S / N) * (S / N) / (1 + N / sharpPurityWeightRef) )
  ```

  The two parts are added to each other first and then to `sharpBase`.
- Removed keys: `stats.sharpPerSharpCell`, `stats.sharpPerSharpShare`,
  `stats.sharpPerSharpShareSquared`. New keys: `stats.sharpMax` 1.2,
  `stats.sharpHalfCells` 5, `stats.sharpPurity` 1.2,
  `stats.sharpPurityWeightRef` 60. `stats.sharpBase` stays 1.
- Range for a stat bar: `sharpBase` (1.0) to `sharpBase + sharpMax +
  sharpPurity` (3.4). Examples: solid block 1.00; 10 x 10 block with a 12-cell
  blade 2.03; hedgehog 2.24; comb 2.31; cross 2.78; line 2.95; 12-cell line
  3.02.

### B3. Enclosed space (`core/drawing.js`, new `countEnclosed(body, W, H)`)

- New. Returns `{ enclosed, pockets }` for a body array (colour or 0 per cell).
  1. Every non-body cell on the canvas border is "open". Open spreads from an
     open cell to all 8 neighbours that are non-body cells (flood fill; the
     code uses a stack, the result does not depend on the order).
  2. `enclosed` = number of non-body cells that are not open.
  3. `pockets` = number of those enclosed cells with no body cell among their
     8 neighbours (`countNeighbours(...) === 0`).
  Drips are not part of the body, so they count as empty here.
- `computeStats` returns two new fields: `enclosed` and `P` (= pockets).
- Armour, old: `armourBase + armourPerCore * C + armourPerCell * N`.
  New: `armourBase + armourPerCore * C + armourPerCell * N + armourPerPocket *
  pocketArmourCells` (summed left to right), where `pocketArmourCells = P`,
  but at most `pocketCapPerCell * (N - S)`.
- New keys: `stats.armourPerPocket` 0.8, `stats.pocketCapPerCell` 1.

### B4. Tuning values that changed without a code change

| Key | Old | New |
|---|---|---|
| `version` | `ink-tuning-1` | `ink-tuning-2` |
| `stats.armourBase` | 55 | 170 |
| `stats.armourPerCore` | 2 | 0.7 |
| `solo.maxCopies` | 20 | 10 |
| `solo.enemySpeedMult` | 0.45 | 0.55 |
| `solo.enemyDamageMult` | 0.2 | 0.6 |
| `solo.upgradeHealPercent` | 50 | 35 |
| `solo.bossArmourMult` | 1.5 | 1.2 |

`stats.bluntDamage` (1.2), speed, element, ring and all other physics values
are unchanged. `solo.enemyArmourMult` changed its meaning, see B10.

### B5. Sub-steps (`core/physics.js`, `stepWorld`)

Old order of one tick: 1 control, 2 integrate (`pos += v * dt`), 3 hit
cooldowns count down and all pairs once, 4 wall.

New order:

1. Control: unchanged.
2. All hit cooldowns above 0 count down by 1 (once per tick, as before).
3. Sub-steps:
   - `maxV2` = largest `vx * vx + vy * vy` over all living bodies (index
     order), after control.
   - `sub = floor(sqrt(maxV2) * dt / physics.maxStepCells) + 1`, at most
     `physics.maxSubSteps`. `h = dt / sub` (with `dt = 1 / tickRate`).
   - `world.subSteps = sub` (new world field, initial value 1; not hashed).
   - Repeat `sub` times: first every living body in index order `x += vx * h`,
     `y += vy * h`; then all pairs `i < j` in index order (`collidePair`, both
     alive), exactly as the single pair pass before.
   The count `sub` is fixed at the start of the tick; velocity changes inside
   the tick do not change it.
4. Wall: unchanged, once per tick after all sub-steps.

New keys: `physics.maxStepCells` 0.4, `physics.maxSubSteps` 8. With `sub = 1`
the tick is the old tick except for the position of the cooldown countdown,
which was already before the pairs.

### B6. Dash contact (`core/physics.js`, `collidePair`)

After the push apart (unchanged) and with `rel = (vA - vB) . n` (unchanged):

- New: `dashing = a.dashTicks > 0 || b.dashTicks > 0`, read before anything
  below changes it.
- Impulse, old: `-(1 + restitution) * rel / invSum` when `rel < 0`.
  New: the same with `physics.dashRestitution` in place of
  `physics.restitution` when `dashing` is true.
- New, after the impulse block and whether or not `rel < 0`: if `dashing`,
  then if `a.dashTicks > 0`: `a.dashTicks = 0` and the event `{ type: 'ram',
  from: i, to: j }` is pushed; then the same for `b` with `{ type: 'ram',
  from: j, to: i }`. This happens for every contact, also inside one team,
  and before the damage part (events order: `ram` of a, `ram` of b, then the
  `hit` events).
- `dashCd` is not touched: the cooldown keeps running from the dash start.
- Effect: the control step of the next tick no longer overwrites the velocity
  the contact gave the body (that override was the cause of finding I1), and
  the momentum of the dash goes into the other body through the impulse.
- New key: `physics.dashRestitution` 0.3. `physics.restitution` stays 0.79.

### B7. Sharp damage (`core/physics.js`, `touchDamage`)

- Old: `(sharpFlag ? sharpness : bluntDamage) * damageMult * element`.
- New: `(sharpFlag ? max(bluntDamage, sharpness) : bluntDamage) * damageMult *
  element`. Knockback (`damage * hitKnockbackPerDamage / N_victim`) unchanged.

### B8. Ring validation (`core/ring.js`)

- New `ringCheckFigure(tuning, match, seat, fig)`: returns `'tooSmall'` when
  `fig`, `fig.stats` is missing or `fig.stats.N < ink.minBodyCells`;
  else `'overBudget'` when `fig.stats.filled > ringInkBudget(tuning, match,
  seat)`; else `''`.
- `ringStartRound`: after the existing two checks it calls `ringCheckFigure`
  for every seat in seat order and throws `Error('seat ' + seat + ' figure: '
  + reason)` on the first failure, before any state changes (the match stays
  as it was).
- App note: a figure kept from an earlier match and drawn with catch-up ink
  fails this check in a new match (budget back to 220). Check with
  `ringCheckFigure` before calling `ringStartRound`.

### B9. Bot styles (`core/ring.js`, `core/bots.js`)

- New match field `botStyle`: array with one number per seat, created as all
  0 by `ringCreateMatch`; the caller may set entries to 1 at any time. It is
  not reset between rounds.
- `botRingInput(tuning, match, seat)`: unchanged signature. It now returns
  the circler's input when `match.botStyle[seat] === 1`, else the rusher's.
  The rusher is the version 1 bot; its code was split into helper functions
  (`aimInside`, `edgeSteer`) without changing a formula or the order of
  generator draws.
- Circler (style 1), per tick for a living seat:
  1. If `match.tick % bots.wobbleTicks === 0`: `botWobble[seat] = rngInt(rng,
     3) - 1` (same draw as the rusher).
  2. Target: loop over seats `i` in index order (not itself, alive). `crowd` =
     number of other living bodies `k` (not itself, not `i`) with squared
     centre distance to `i` strictly below `circlerCrowdRange^2`. `d2` = own
     squared distance to `i`. `i` replaces the current choice when there is
     none yet, or `crowd` is lower, or `crowd` is equal and `d2` strictly
     lower.
  3. `targetDist = sqrt(d2)`; `u` = unit vector to the target (the own front
     when `targetDist` is 0); `gap = targetDist - ownRadius - targetRadius`.
  4. If `me.dashCd > circlerAttackLeadTicks`: circle. `side = -1` when the
     wobble is negative, else `+1`. `radial = (gap - circlerStandoff) /
     circlerBlend`, limited to -1 .. 1. Steering = `(-uy * side + ux * radial,
     ux * side + uy * radial)`, divided by its length.
     Otherwise: attack. Steering = the rusher's aim (`aimInside`: unit vector
     to the target centre moved toward the ring centre by `insideBias * own
     radius`, at most to the centre; own front if that vector has length 0),
     without wobble.
  5. Edge avoidance exactly as the rusher (`edgeSteer`), with the same
     `targetDist`.
  6. Dash when attacking, `dashCd === 0`, `dashTicks === 0`, edge value below
     0.5, `gap < circlerDashGap` and `fx * ux + fy * uy >= circlerAlignDot`.
     No generator draw for the dash.
- New keys: `bots.circlerCrowdRange` 18, `circlerStandoff` 6, `circlerBlend`
  4, `circlerAttackLeadTicks` 30, `circlerDashGap` 9, `circlerAlignDot` 0.9.

### B10. Solo stake, copies and enemy strength (`core/solo.js`)

- `soloCopies(tuning, waveIndex, stakeIndex, N)`, old: `floor(waveBudget *
  stake / N)`. New: `floor(waveBudget * stake / (N + solo.copyInkOverhead))`;
  then at least 1 and at most `maxCopies` as before. New key
  `solo.copyInkOverhead` 40.
- New `soloEnemyArmour(tuning, fig)` = `solo.enemyArmourBase +
  solo.enemyArmourMult * (fig.stats.armour - stats.armourBase)`.
  Old enemy armour: `fig.stats.armour * enemyArmourMult` (0.35).
  New key `solo.enemyArmourBase` 30; `solo.enemyArmourMult` is now 1.2 and
  multiplies only the armour above the flat base.
- Enemy spawn (`spawnEnemy`, internal): the two generator draws and the
  position are unchanged. The body is created with armour multiplier 1, speed
  multiplier `enemySpeedMult * stakeSpeedMult[stakeIndex]` and damage
  multiplier `enemyDamageMult * stakeDamageMult[stakeIndex]` (multiplied in
  this order before being passed to `createBody`). Then `hp = maxHp =
  soloEnemyArmour(...)` for wave copies and boss escorts, and `hp = maxHp =
  fig.stats.armour * bossArmourMult` for the boss. The boss fight uses stake
  index 0 for the boss and the escorts.
- New keys `solo.stakeDamageMult` [1, 1.25, 1.5] and `solo.stakeSpeedMult`
  [1, 1.1, 1.2].
- New `soloDropValue(tuning, waveIndex, stakeIndex, N)` = `max(N,
  floor(waveBudget * stake / copies))` with `copies = soloCopies(...)`.
- `soloStartWave`: new check after the two phase checks and before the
  drawing check: throws `Error('bad stake index')` unless `stakeIndex` is a
  whole number from 0 to `stakes.length - 1`. It sets the new run fields
  `run.stakeIndex = stakeIndex` and `run.dropValue = soloDropValue(tuning,
  run.wave, stakeIndex, N)` (before the enemies are spawned, after
  `run.stake`).
- `soloStartBoss`: sets `run.stakeIndex = 0` and `run.dropValue = 0`.
- Drop of a fallen enemy, old: value `N` of the enemy. New: `run.dropValue`
  when it is above 0, else the enemy's `N` (boss fight).
- New run fields: `stakeIndex` (initial 0), `dropValue` (initial 0).

### B11. Shots and fallen enemies (`core/solo.js`, `soloStep`)

- Throw target search: an enemy with `hp <= 0` is skipped like a dead one.
- Shot hit test: an enemy with `hp <= 0` is skipped like a dead one, so the
  shot flies on.
- Tick order and everything else in `soloStep` are unchanged.

### B12. State hash layout 2 (`core/hash.js`)

Every value is hashed as a double as before (`hashDouble`), in this order.

Body block (per body, index order): `x, y, vx, vy, fx, fy, hp, alive (1/0),
dashTicks, dashCd, dashDx, dashDy`. New: the last two.

`hashRing(match)`:

1. `match.round` (new)
2. `match.tick`
3. `match.ringRadius`
4. body block of all bodies
5. all `world.cd` entries in array order, `n * n` values (new)
6. per seat `i` in order: `botRng[i].s`, `botWobble[i]`, `botStyle[i]` (old:
   only the generator states, after the bodies)

`hashSolo(run)`:

1. `run.wave` (new)
2. `run.tick`
3. body block of all bodies
4. all `world.cd` entries (new)
5. per shot: `x, y, ux, uy, speed, life` (old: `x, y, life`)
6. per drop: `x, y, value, life`
7. `wallet, score, throwCd`
8. `rng.s`
9. new: `heroBudget, weaponBudget`, `colours[1] .. colours[4]` as 1/0,
   `upgradeTaken` as 1/0, `copies`, `stakeIndex`, `dropValue`, `heroMaxHp`

### B13. Golden files and tools

- `stat_vectors.json`: `expect` has the new fields `enclosed` and `P`; four
  more archetypes (`arch_hoop`, `arch_spiral`, `arch_grille`,
  `arch_splinter`). All armour and sharpness values and most `S` values
  changed.
- `sim_traces.json`:
  - Ring items have `botStyle` (set `match.botStyle` from it right after
    `ringCreateMatch`) and `covers` (text only).
  - Solo items have `tuningOverrides` (object `path: value`; apply to a copy
    of the tuning for this item only; empty except in `solo_time_limit`,
    which uses `{"solo.waveMaxTicks": 600}`), `covers`, and `fights[].upgrade`
    (`'ok'`, `''` when none was tried, or the refusal reason).
  - `waves[].upgrade` may be `heroInk:<drawing>` or `weaponInk:<drawing>`:
    call `soloUpgrade(tuning, run, 'heroInk' | 'weaponInk', cells)` with that
    header drawing recoloured to Black (every non-empty cell becomes 1).
  - `final` of solo items also has `heroMaxHp, heroBudget, weaponBudget,
    heroN, weaponN`.
  - `checkpointEvery` can differ per item (120, 300 or 600).
  - New items: `ring_1v1_circler_vs_rusher`, `ring_4_circlers`,
    `ring_1v1_sudden_death`, `ring_2_idle_simultaneous_tie`,
    `ring_3_simultaneous_nearest_wins`, `solo_win_with_boss`,
    `solo_upgrades_hero_and_weapon_ink`, `solo_hero_death`,
    `solo_time_limit`. Header `drawings` has the four new archetypes.
- `sim/runner.js`: `playSingleRound(..., styles)` and `playRingMatch(...,
  styles)` take an optional bot style array; `playSoloRun` accepts an upgrade
  object `{ kind, cells }` and reports `upgrade` per fight.
- `sim/archetypes.js`: four "player optimiser" drawings, flag `optimiser`.
- `sim/balance.js`: three bot configurations in worker threads, combined
  report; `sim/sweep.js`, `sim/solo_smoke.js`, `sim/show_stats.js`,
  `tools/trace_summary.js` are new helpers.

### B14. Review findings decided without a behaviour change

- **M1** (kept): a figure whose armour reaches 0 during a tick stays in the
  physics step until the end of that tick, in every sub-step: it still
  pushes, deals and takes damage. `alive` is cleared only by the mode module
  after the step. Ports and UI must not remove it earlier.
- **M2** (kept): in `soloStep` the hero's armour is checked before the cleared
  wave. If the hero and the last enemy fall in the same tick the run ends as
  `dead` / `armour`. Covered by a test.
- **M4**: the generator test now contains written-down values:
  `rngCreate(12345)` gives 3438003404, 976339029, 1163348040 from `rngU32`;
  `rngDerive(7, 2)` has state 395558742, then `rngInt(r, 100)` = 38 and
  `rngFloat(r)` = 0.10031384229660034.
- **M8**: the wording about hollow shapes is corrected in
  `RULES_AS_BUILT.md`; with the new sharp rule a one-cell frame is all blade
  and gets no pocket armour, a thick-walled frame gets pocket armour.

## C. What the browser app has to change

1. Load the new tuning file; do not read the removed keys
   (`stats.sharpMinEmptyNeighbours`, `stats.sharpPerSharpCell`,
   `stats.sharpPerSharpShare`, `stats.sharpPerSharpShareSquared`).
2. Stat display: sharpness range is now 1.0 to 3.4 (`sharpBase` to `sharpBase
   + sharpMax + sharpPurity`); armour range roughly 170 to 330 (`armourBase`
   upward); `stats.S` counts blade cells, `stats.P` pocket cells. If sharp
   cells are highlighted while drawing, use `isSharpCell` on the body.
3. Ring: handle the `ringStartRound` error or call `ringCheckFigure` first
   (B8). Optional: `match.botStyle[seat] = 1` for a circler bot.
4. Events: new type `ram` (`from`, `to`); unknown types were already ignored.
5. Solo: the number of copies and the reward per drop changed; show them with
   `soloCopies` and `soloDropValue`. The stake now also raises enemy damage
   and speed (`stakeDamageMult`, `stakeSpeedMult`). Enemy armour shown in the
   UI must come from the bodies (`maxHp`), not from `stats.armour *
   enemyArmourMult`. `soloStartWave` throws on a stake index outside 0..2.
6. No function was removed or renamed; all version 1 calls keep their
   signature.

## D. What the C# port has to change

1. `InkTuning`: removed keys (four, see C1); new keys `stats.armourPerPocket`,
   `stats.pocketCapPerCell`, `stats.sharpMax`, `stats.sharpHalfCells`,
   `stats.sharpPurity`, `stats.sharpPurityWeightRef`,
   `physics.dashRestitution`, `physics.maxStepCells`, `physics.maxSubSteps`,
   `bots.circler*` (six), `solo.stakeDamageMult[]`, `solo.stakeSpeedMult[]`,
   `solo.copyInkOverhead`, `solo.enemyArmourBase`.
2. `InkDrawing`: B1, B2, B3 (new stat fields `enclosed`, `P`).
3. `InkPhysics`: B1 (sharp flags in the figure), B5, B6, B7; world field
   `subSteps`; event `ram`.
4. `InkRing`: B8, `botStyle`. `InkBots`: B9.
5. `InkSolo`: B10, B11; run fields `stakeIndex`, `dropValue`.
6. `InkHash`: B12.
7. Replay and self-check: B13 (`botStyle`, `tuningOverrides`, the two upgrade
   strings, per-item `checkpointEvery`, new `expect` fields).
8. Floating point: the expressions of B2, B3, B5 and B10 must keep the order
   written here (`Math.Sqrt` and `Math.Floor` on doubles; no fused
   multiply-add).
