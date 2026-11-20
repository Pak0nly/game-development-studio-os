# Inkweight Core: Changes from Version 1 to Version 2 (Work Order INK-CORE-V2)

Exact change list for the two follow-up orders: the C# port
(`Source/Unity`) and the browser app (`WebPrototype/app`). It is written so
that the port can be updated without reading the JavaScript diff. The full
rules as now built are in [`RULES_AS_BUILT.md`](RULES_AS_BUILT.md); when this
list and the code differ, the code and the golden files are what counts.

Everything here is a prototype proposal by the Worker, not a Human decision.

This list describes the **final state after correction round 1** (independent
review of the first version 2 candidate, findings I4 to I6 and m1 to m7). It
is still one list from version 1 to the final state; nothing of the first
candidate has to be known. Where correction round 1 changed something, the
section says "(correction round 1)".

Notation: "old" is core version 1 (tuning `ink-tuning-1`), "new" is version 2
(tuning `ink-tuning-2`). Section numbers `B1` ... are for cross-reference only.

## A. Summary

| # | Area | Change | Why |
|---|---|---|---|
| B1 | `drawing.js` | Sharp cell rule replaced: a body cell is sharp when it is in no filled 2 x 2 square | Diagonal strokes count as blades, corners and slanted sides of solids do not |
| B2 | `drawing.js` | Sharpness formula replaced (count of blade cells, saturating, plus a purity part) | A blade on a solid body must visibly raise the stat |
| B3 | `drawing.js`, `physics.js` | Armour formula with a per-cell part; enclosed space: new stats `enclosed`, `P`, `pocketCells`, `push`; pocket cells add a little armour and push weight; `fig.mass` = `stats.push` | "Filled areas are armour" (review I5); a job for hollow shapes that is not armour |
| B4 | tuning | Values changed without a code change | Balance, solo |
| B5 | `physics.js` | `stepWorld` cuts a tick into sub-steps; the turn happens inside them and the tip speed counts | Review V1 I1, review V2 I4 |
| B6 | `physics.js` | A contact ends a dash; own bounce factor for a ram; new event `ram`; deepest-contact normal; extra separation passes | Review V1 I1, review V2 I4 |
| B7 | `physics.js` | Sharp touch = `max(bluntDamage, sharpness)` plus the armour cut | Review V1 I3; compensation for stronger solids |
| B8 | `ring.js` | `ringStartRound` refuses invalid figures; new `ringCheckFigure`; start distance 0.6 | Review V1 M3, review V2 m2 |
| B9 | `ring.js`, `bots.js` | `match.botStyle[]`; second bot style (circler) | Balance task 5 |
| B10 | `solo.js` | Copies cost a fee; enemy armour by size and wave scale; stake raises enemy damage and speed; drops pay the staked budget; stake index checked | Review V1 M7, review V2 I6 |
| B11 | `solo.js` | Shots and throws ignore enemies already at 0 armour | Review V1 M6 |
| B12 | `hash.js` | Hash layout 2 (more state) | Review V1 M5 |
| B13 | golden files | New stat fields, new traces, `tuningOverrides`, new upgrade strings | Review V1 I2 |
| B14 | decided, unchanged | M1, M2, M8 documented | Review |

Unchanged: `rng.js`; body extraction; core cells; centroid, radius, inertia;
element rule; top speed; the control step except for the turn; the contact
scan; ring
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
  `stats.sharpHalfCells` 5, `stats.sharpPurity` 3 (correction round 1; the
  first candidate had 1.2), `stats.sharpPurityWeightRef` 60. `stats.sharpBase`
  stays 1.
- Range for a stat bar: 1.0 to 4.7. The highest value a valid drawing reaches
  is 4.52 (a 12-cell line); `sharpBase + sharpMax + sharpPurity / (1 + 12 /
  sharpPurityWeightRef)` = 4.7 is a safe upper end. Examples: solid block
  1.00; 10 x 10 block with a 12-cell blade 2.03; hedgehog 2.31; comb 2.47;
  all-blade snake of 209 cells 2.87; cross 3.66; line 4.13; needle 4.38;
  12-cell line 4.52.

### B3. Armour, enclosed space and push weight (`core/drawing.js`, new `countEnclosed(body, W, H)`; correction round 1)

- `countEnclosed` is new. It returns `{ enclosed, pockets }` for a body array
  (colour or 0 per cell).
  1. Every non-body cell on the canvas border is "open". Open spreads from an
     open cell to all 8 neighbours that are non-body cells (flood fill; the
     code uses a stack, the result does not depend on the order).
  2. `enclosed` = number of non-body cells that are not open.
  3. `pockets` = number of those enclosed cells with no body cell among their
     8 neighbours (`countNeighbours(...) === 0`).
  Drips are not part of the body, so they count as empty here.
- `computeStats` returns four new fields: `enclosed`, `P` (= pockets),
  `pocketCells` and `push`.
  - `pocketCells = P`, but at most `pocketCapPerCell * (N - S)`.
  - `push = N + pushPerPocket * pocketCells`.
- Armour, old: `armourBase + armourPerCore * C + armourPerCell * N` with
  values 55 / 2 / 0. New (summed left to right):
  `armourBase + armourPerCore * C + armourPerCell * N + armourPerPocket *
  pocketCells` with values 60 / 1 / 0.3 / 0.3.
- `buildFigure` (`core/physics.js`): `fig.mass`, old `stats.N`, new
  `stats.push`. `fig.mass` is what the collision uses everywhere (push apart,
  impulse, hit knockback, weapon knockback in solo, the bots' weight
  comparison). `stats.weight` stays `N`; top speed, acceleration and the
  solo copy cost still use `N`.
- New keys: `stats.armourPerPocket` 0.3, `stats.pocketCapPerCell` 1,
  `stats.pushPerPocket` 0.1.
- Guarantee checked by a test: a hollow shell never has more armour than a
  filled drawing of the same ink (a pocket cell gives 0.3, at most one per
  wall cell; a core cell gives 1.0). Disc 270.4, hollow ring 179.2, 2-wide
  border hoop 189.6, line 69.6, dot 64.9.
- Range for a stat bar: armour 63.6 (12-cell line) to about 290 for 220 ink
  (14 x 15 block 279.0); never above `60 + 1.3 * N`, with full catch-up ink
  (352) about 450. Push weight: `N` to `1.1 * N`.

### B4. Tuning values that changed without a code change

| Key | Old | New |
|---|---|---|
| `version` | `ink-tuning-1` | `ink-tuning-2` |
| `stats.armourBase` | 55 | 60 |
| `stats.armourPerCore` | 2 | 1 |
| `stats.armourPerCell` | 0 | 0.3 |
| `ring.startDistanceFraction` | 0.55 | 0.6 |
| `solo.maxCopies` | 20 | 10 |
| `solo.enemySpeedMult` | 0.45 | 0.55 |
| `solo.enemyDamageMult` | 0.2 | 0.4 |
| `solo.enemyArmourMult` | 0.35 | 0.2 (new meaning, see B10) |
| `solo.upgradeHealPercent` | 50 | 35 |
| `solo.bossArmourMult` | 1.5 | 1.2 |

`stats.bluntDamage` (1.2), speed, element, the other ring values and all
other version 1 physics values are unchanged.

### B5. Sub-steps and turning (`core/physics.js`, `stepWorld`; turning part from correction round 1)

Old order of one tick: 1 control (including the turn of the front), 2
integrate (`pos += v * dt`), 3 hit cooldowns count down and all pairs once,
4 wall.

New order:

1. Control: as before, except that the front is **not** turned here. Instead
   three transient body fields are set for every living body (new fields,
   initial `false, 0, 0`, not hashed, overwritten every tick):
   `turnDx, turnDy` = the unit steering direction `d` (0, 0 when the stick is
   idle) and `turning = (len2 > 0) && (fx !== dx || fy !== dy)`, evaluated
   with the front as it is at that moment. Dash and velocity as before (the
   dash direction still uses `d`, or the front when the stick is idle).
2. All hit cooldowns above 0 count down by 1 (once per tick, as before).
3. Sub-steps:
   - For every living body (index order): `sp = sqrt(vx * vx + vy * vy)`;
     if `turning`: `sp += fig.radius * fig.turnRate`. `maxSpeed` = largest
     `sp`.
   - `sub = floor(maxSpeed * dt / physics.maxStepCells) + 1`, at most
     `physics.maxSubSteps`. `h = dt / sub` (with `dt = 1 / tickRate`).
   - `world.subSteps = sub` (new world field, initial value 1; not hashed).
   - Repeat `sub` times: first every living body in index order: if
     `turning`, one part of the turn (below); then `x += vx * h`, `y += vy *
     h`. Then all pairs `i < j` in index order (`collidePair`, both alive).
   - One part of the turn: `t = fig.turnRate / (2 * tickRate * sub)`, `c =
     (1 - t * t) / (1 + t * t)`, `s = (2 * t) / (1 + t * t)`. With `dot = f .
     d` and `cross = fx * dy - fy * dx`: if `dot >= c` the front becomes
     exactly `d`; otherwise the front is rotated by `(c, +s)` when `cross >=
     0`, else by `(c, -s)` (`nx = fx * c - fy * sn`, `ny = fx * sn + fy * c`)
     and divided by its length. This is the version 1 turn step with the
     half-angle tangent divided by `sub`; with `sub = 1` it is identical.
     `turning` is not re-evaluated inside the tick; once the front equals `d`
     the remaining parts leave it unchanged.
   The count `sub` is fixed at the start of the tick; velocity changes inside
   the tick do not change it.
4. Wall: unchanged, once per tick after all sub-steps.

`fig.turnCos` and `fig.turnSin` still exist in the figure template but are no
longer used by the step. New keys: `physics.maxStepCells` 0.4,
`physics.maxSubSteps` 8.

### B6. Dash contact (`core/physics.js`, `collidePair`)

Contact normal and push apart (correction round 1):

- The scan is unchanged, but it also keeps the depth-weighted world vector of
  the deepest contact (`deepX, deepY`; the first contact with a strictly
  larger depth wins; a contact with distance 0 has the vector (0, 0)).
- Normal `n`: start with the summed vector (as before). New: if its squared
  length is below `(physics.deepNormalShare * maxDepth)^2` and the deepest
  contact's vector has a squared length above 1e-12, use the deepest contact's
  vector instead. Then the old fallbacks (centre A minus centre B, then
  `(1, 0)`, each when the squared length is below 1e-12) and normalisation.
- Push apart along `n` by `maxDepth`, shared by inverse `fig.mass` (as
  before, now with `mass = stats.push`).
- New, directly after the push and before the velocity part: up to
  `physics.extraSeparationPasses` times: scan the pair again; stop when there
  is no contact or `maxDepth <= physics.deepContactDepth`; otherwise compute
  the normal by the same rule and push apart again by the new `maxDepth` with
  the same mass shares. These passes change positions only. The impulse, the
  damage, the knockback direction and the sharp flags use the normal and the
  flags of the **first** scan.
- New keys: `physics.deepNormalShare` 0.5, `physics.deepContactDepth` 0.25,
  `physics.extraSeparationPasses` 2.

Then, with `rel = (vA - vB) . n` (unchanged, `n` of the first scan):

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
- Note (review m1, kept): `dashTicks` is decremented in the control step
  before the sub-steps, so in the last tick of a dash the body still moves at
  dash speed but `dashTicks` is already 0: a contact in that tick is a normal
  contact (bounce 0.79, no `ram` event). The ram window is 11 of the 12 dash
  ticks. Ports and the app must not "fix" this differently.
- Effect: the control step of the next tick no longer overwrites the velocity
  the contact gave the body (that override was the cause of finding I1), and
  the momentum of the dash goes into the other body through the impulse.
- New key: `physics.dashRestitution` 0.3. `physics.restitution` stays 0.79.

### B7. Sharp damage (`core/physics.js`, `touchDamage`; armour cut from correction round 1)

- Old: `(sharpFlag ? sharpness : bluntDamage) * damageMult * element`.
- New: blunt touch `bluntDamage`; sharp touch `max(bluntDamage, sharpness) +
  stats.sharpArmourCut * victim.maxHp` (sum first), then `* damageMult *
  element` as before. `victim.maxHp` is the body's full armour (for solo
  enemies their enemy armour, for the hero `run.heroMaxHp`). Knockback
  (`damage * hitKnockbackPerDamage / mass_victim`) uses this damage.
- New key: `stats.sharpArmourCut` 0.004. Thrown weapons in solo do not use
  the armour cut.

### B8. Ring validation (`core/ring.js`)

- New `ringCheckFigure(tuning, match, seat, fig)`: returns `'tooSmall'` when
  `fig`, `fig.stats` is missing or `fig.stats.N < ink.minBodyCells`;
  else `'overBudget'` when `fig.stats.filled > ringInkBudget(tuning, match,
  seat)`; else `''`.
- `ringStartRound`: after the existing two checks it calls `ringCheckFigure`
  for every seat in seat order and throws `Error('seat ' + seat + ' figure: '
  + reason)` on the first failure, before any state changes (the match stays
  as it was).
- `ring.startDistanceFraction` is 0.6 (was 0.55; review m2), so that four
  canvas-wide figures do not overlap at the start of a four-seat round.
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
- Port note (review m7): `steer` in `bots.js` is one module-level scratch
  record `{ x, y, edge }` used by both styles inside a single call. Every call
  sets `x` and `y` before reading them and `edgeSteer` always sets `edge`;
  nothing is carried from one call to the next. A port may use locals.
- New keys: `bots.circlerCrowdRange` 18, `circlerStandoff` 6, `circlerBlend`
  4, `circlerAttackLeadTicks` 30, `circlerDashGap` 9, `circlerAlignDot` 0.9.

### B10. Solo stake, copies and enemy strength (`core/solo.js`; armour and drops from correction round 1)

- `soloCopies(tuning, waveIndex, stakeIndex, N)`, old: `floor(waveBudget *
  stake / N)`. New: `floor(waveBudget * stake / (N + solo.copyInkOverhead))`;
  then at least 1 and at most `maxCopies` as before. New key
  `solo.copyInkOverhead` 40.
- New `soloWaveArmourScale(tuning, waveIndex, stakeIndex, N)` = `waveBudget *
  stake / (copies * (N + copyInkOverhead))` with `copies = soloCopies(...)`,
  limited to `solo.copyArmourScaleMin` (0.5) .. `solo.copyArmourScaleMax` (2).
- New `soloEnemyArmour(tuning, fig, scale)` = `(solo.enemyArmourPerInk *
  fig.stats.N + solo.enemyArmourMult * fig.stats.armour) * scale`.
  Old enemy armour: `fig.stats.armour * enemyArmourMult` (0.35).
  New key `solo.enemyArmourPerInk` 0.6; `solo.enemyArmourMult` is now 0.2.
- Enemy spawn (`spawnEnemy`, internal): the two generator draws and the
  position are unchanged. The body is created with armour multiplier 1, speed
  multiplier `enemySpeedMult * stakeSpeedMult[stakeIndex]` and damage
  multiplier `enemyDamageMult * stakeDamageMult[stakeIndex]` (multiplied in
  this order before being passed to `createBody`). Then `hp = maxHp =
  soloEnemyArmour(tuning, fig, scale)`: for wave copies `scale =
  soloWaveArmourScale(tuning, run.wave, stakeIndex, N)` (computed once per
  wave, before the first spawn), for boss escorts `scale = 1`; and `hp =
  maxHp = fig.stats.armour * bossArmourMult` for the boss. The boss fight
  uses stake index 0 for the boss and the escorts.
- New keys `solo.stakeDamageMult` [1, 1.25, 1.5] and `solo.stakeSpeedMult`
  [1, 1.1, 1.2].
- New `soloDropValue(tuning, waveIndex, stakeIndex, N)` = `floor(waveBudget *
  stake / copies)` with `copies = soloCopies(...)`. There is no lower limit:
  a wave never pays more than its staked budget (review I6).
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

- `stat_vectors.json`: `expect` has the new fields `enclosed`, `P`,
  `pocketCells`, `push` and `mass` (= `fig.mass`); six more archetypes
  (`arch_hoop`, `arch_spiral`, `arch_grille`, `arch_splinter`, `arch_hoop2`,
  `arch_hoop3`) and ten rules-2 cases at the end of the list. All armour and
  sharpness values and most `S` values changed.
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
    `solo_time_limit`. Header `drawings` has the six new archetypes.
- `sim/runner.js`: `playSingleRound(..., styles)` and `playRingMatch(...,
  styles)` take an optional bot style array; `playSoloRun` accepts an upgrade
  object `{ kind, cells }` and reports `upgrade` per fight.
- `sim/archetypes.js`: six "player optimiser" drawings, flag `optimiser`.
- `sim/overlap_probe.js` (cell overlap of bodies, used by the I4 tests),
  `sim/readability.js` (stat table of beginner drawings), `sim/style_check.js`.
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
2. Stat display, real ranges for valid figure drawings of at most 220 ink:
   armour 63.6 to about 290 (bar end 300; with full catch-up ink up to about
   450, never above `60 + 1.3 * N`); sharpness 1.0 to 4.52 (bar end 4.7);
   weight `N` 12 to 220; push weight `stats.push` = `N` to `1.1 * N`; top
   speed 9.2 to 32.4 cells per second. `stats.S` counts blade cells,
   `stats.P` pocket cells, `stats.pocketCells` the pocket cells that count.
   A blade hit also takes 0.4 % of the target's full armour (`sharpArmourCut`);
   if the app shows a damage number, take it from the `hit` event. If sharp
   cells are highlighted while drawing, use `isSharpCell` on the body.
3. Ring: handle the `ringStartRound` error or call `ringCheckFigure` first
   (B8). Optional: `match.botStyle[seat] = 1` for a circler bot.
4. Events: new type `ram` (`from`, `to`); unknown types were already ignored.
5. Solo: the number of copies and the reward per drop changed; show them with
   `soloCopies` and `soloDropValue`. The stake now also raises enemy damage
   and speed (`stakeDamageMult`, `stakeSpeedMult`) and, where ink is left
   over, enemy armour (`soloWaveArmourScale`). Enemy armour shown in the UI
   must come from the bodies (`maxHp`), not from `stats.armour *
   enemyArmourMult`. `soloStartWave` throws on a stake index outside 0..2.
6. No function was removed or renamed; all version 1 calls keep their
   signature.

## D. What the C# port has to change

1. `InkTuning`: removed keys (four, see C1); new keys `stats.armourPerPocket`,
   `stats.pocketCapPerCell`, `stats.pushPerPocket`, `stats.sharpMax`,
   `stats.sharpHalfCells`, `stats.sharpPurity`, `stats.sharpPurityWeightRef`,
   `stats.sharpArmourCut`, `physics.dashRestitution`, `physics.maxStepCells`,
   `physics.maxSubSteps`, `physics.deepNormalShare`,
   `physics.deepContactDepth`, `physics.extraSeparationPasses`,
   `bots.circler*` (six), `solo.stakeDamageMult[]`, `solo.stakeSpeedMult[]`,
   `solo.copyInkOverhead`, `solo.enemyArmourPerInk`,
   `solo.copyArmourScaleMin`, `solo.copyArmourScaleMax`.
2. `InkDrawing`: B1, B2, B3 (new stat fields `enclosed`, `P`, `pocketCells`,
   `push`).
3. `InkPhysics`: B1 (sharp flags in the figure), B3 (`mass = push`), B5
   (sub-steps with the turn inside, body fields `turning, turnDx, turnDy`),
   B6 (deepest-contact normal, extra separation passes, dash end, `ram`), B7;
   world field `subSteps`.
4. `InkRing`: B8, `botStyle`. `InkBots`: B9.
5. `InkSolo`: B10, B11; run fields `stakeIndex`, `dropValue`.
6. `InkHash`: B12.
7. Replay and self-check: B13 (`botStyle`, `tuningOverrides`, the two upgrade
   strings, per-item `checkpointEvery`, new `expect` fields).
8. Floating point: the expressions of B2, B3, B5, B6, B7 and B10 must keep the order
   written here (`Math.Sqrt` and `Math.Floor` on doubles; no fused
   multiply-add).
