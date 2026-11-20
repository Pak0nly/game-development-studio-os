# Inkweight Rules As Built (core version 3, Work Order INK-CORE-V3)

This records what the engine-free core in `../WebPrototype/core/` really does,
so that a second implementation (C# for Unity) can match it without guessing.
The numbers live in [`ink_tuning.json`](ink_tuning.json) (`ink-tuning-3`); when
this text and the JSON differ, the JSON is what runs. What changed against
version 1 is listed function by function in [`CHANGES_V2.md`](CHANGES_V2.md),
what changed from version 2 to version 3 in [`CHANGES_V3.md`](CHANGES_V3.md)
(deep-contact passes, crowd relaxation, the blunt bonus of a body, solo enemy
speed and crush; no Ring balance number changed).

Status of everything here: **prototype proposal by the Worker**, not a Human
decision. `Projects/Inkweight/Docs/INK_RULES_V1.md` was not edited; the rules
in plain words are in `Projects/Inkweight/Docs/INK_RULES_V2.md`. Section 9
lists every number and formula that differs from `INK_RULES_V1.md` and why.

Units: distances in canvas cells, time in ticks (`physics.tickRate` = 60 per
second). World axes equal canvas axes: x to the right, y downward.

## 1. Drawing, body, stats

- Drawing: 32 x 32 integers, index `y * 32 + x`; 0 empty, 1 Black, 2 Ember,
  3 Tide, 4 Moss. Every filled cell costs 1 ink, drips included.
- Body: largest 4-connected group. Groups are found by scanning cell indices
  upward; a later group replaces the current best only when strictly larger,
  so a tie goes to the group containing the lowest cell index. Other filled
  cells are drips: they cost ink but count for nothing (also not as walls of
  enclosed space).
- `N` body cells. For every body cell the 8 neighbours are counted (outside
  the canvas = empty). **Core cell:** 8 body neighbours (`C`).
- **Sharp cell** (`S`, "blade cell"): a body cell that lies in no completely
  filled 2 x 2 square of body cells. In words: the ink is only one cell thick
  there. A square that reaches outside the canvas is never filled.
- **Enclosed space:** non-body cells on the canvas border are open; open
  spreads through non-body cells in 8 directions. `enclosed` = non-body cells
  that are not open. **Pocket cell** (`P`): an enclosed cell with no body cell
  among its 8 neighbours.
- Valid: `N >= ink.minBodyCells` (12; weapons `ink.weaponMinBodyCells`, also
  12) and `filled <= budget`.
- Weight = `N`. Push weight = `N + pushPerPocket * pocketCells`, where
  `pocketCells = min(P, pocketCapPerCell * (N - S))`. The push weight is the
  mass of every collision; speed and acceleration use `N`.
- Armour = `armourBase + armourPerCore * C + armourPerCell * N +
  armourPerPocket * pocketCells` (60 + 1 per core cell + 0.3 per cell + 0.3
  per counted pocket cell).
- Sharpness = `sharpBase + (sharpMax * S^2 / (S^2 + sharpHalfCells^2) +
  sharpPurity * (S / N)^2 / (1 + N / sharpPurityWeightRef))`.
- Top speed = `speedBase / (1 + N / speedWeightRef)` cells per second.
- Centre: `cx = (sum of x) / N + 0.5`, `cy` likewise (centroid of cell
  centres). Size radius = `sqrt(max squared distance of a cell centre from the
  centre) + 0.5`. Inertia = sum of the squared distances of all cell centres.
- Element: coloured cells = Ember + Tide + Moss cells of the body. If
  `coloured * 100 >= element.minColouredPercent * N` the element is the colour
  with the strictly highest count among the three; a tie for the highest count
  or too little colour gives neutral (0). Multiplier of attacker A against
  defender D: `strongMult` if `beats[A] == D`, `weakMult` if `beats[D] == A`,
  else 1; neutral always 1. `beats = [0, 0, 4, 2, 3]` (Ember beats Moss, Tide
  beats Ember, Moss beats Tide).

Facts that follow from these rules:

- A diagonal line of single cells is not connected (all but one cell drip).
- A connected diagonal staircase (the stroke the drawing tool paints) is all
  blade cells, like a straight one-cell line.
- A line two cells wide has no blade cell. The corners of a filled rectangle
  and the slanted side of a filled triangle are not blade cells; a single-cell
  tip is.
- Where a one-cell blade meets a solid body, the blade cells are sharp up to
  the body and the body cells are not.
- A one-cell loop encloses space but its pockets do not count (all its cells
  are blade cells, the cap `N - S` is 0). A loop with walls two or more cells
  thick counts them. A gap in the wall, also a diagonal one, opens the space.
- Gaps one cell wide between walls are enclosed but are not pocket cells.
- A hollow shell never has more armour than a filled drawing of the same ink:
  a wall cell earns at most 0.3 through a pocket cell, a core cell earns 1.
  Examples: filled disc (208 cells) 270.4, block 279.0, 3-wide hoop (216)
  247.5, 2-wide border hoop (216) 189.6, hollow ring (172) 179.2, all-blade
  snake (209) 122.7, 32-cell line 69.6, 13-cell dot 64.9.
- Stat ranges of valid figure drawings up to 220 ink (for stat bars): armour
  63.6 to about 290 (never above `60 + 1.3 * N`; about 450 with full catch-up
  ink of 352); sharpness 1.0 to 4.52 (safe upper end 4.7); push weight `N` to
  `1.1 * N`; top speed 9.2 to 32.4.

## 2. Collision shape

Every body cell is a circle of radius 0.5 at its cell centre. A figure template
keeps the cells in ascending cell index with local coordinates
`lx = x + 0.5 - cx`, `ly = y + 0.5 - cy`, the sharp flag of every cell, a
lookup grid (cell number or -1) and the list of boundary cells (all cells that
are not core cells).

A body has a position `(x, y)` and a unit front vector `(fx, fy)`; the canvas
top is the front. With `c = -fy`, `s = fx` a local point maps to the world as
`(x + c * lx - s * ly, y + s * lx + c * ly)`. Rotation is never an angle.

## 3. One physics tick (`stepWorld`)

`dt = 1 / tickRate`. Bodies are handled in index order; dead bodies are
skipped everywhere.

1. **Control** per body with input `(mx, my, dash)`:
   - `len2 = mx^2 + my^2`. If `len2 > 0`: `d = (mx, my) / sqrt(len2)`; if
     `len2 > 1` the stick is replaced by `d`; then turn toward `d` (below).
   - `dashCd` counts down by 1 if above 0. If `dash` and `dashCd == 0` and
     `dashTicks == 0`: dash direction = `d`, or the front vector when the stick
     is idle; `dashTicks = physics.dashTicks`, `dashCd =
     physics.dashCooldownTicks`.
   - If `dashTicks > 0`: `dashTicks -= 1`, target velocity = dash direction *
     `topSpeed * dashSpeedMult`, blend `k = dashAccel`. Otherwise target =
     stick * `topSpeed`, `k = accelK = min(1, accelBase / (1 + N /
     accelWeightRef) / tickRate)`.
   - `v += (target - v) * k`.
   - The steering direction `d` is stored for the sub-steps (`turnDx`,
     `turnDy`) together with `turning` = the stick is not idle and the front
     differs from `d`. The front is not turned in the control step.
2. **Hit cooldowns:** all hit cooldowns above 0 count down by 1.
3. **Sub-steps:** `sub = floor(maxSpeed * dt / maxStepCells) + 1`, at most
   `maxSubSteps`, where `maxSpeed` is the largest value over the living
   bodies of: speed after control, plus `radius * turnRate` (the speed of the
   outermost cell) while the body is `turning`. `h = dt / sub`. `sub` times
   in a row:
   - **Turn:** `turnRate = turnBase / (1 + inertia / turnInertiaRef)`,
     `t = turnRate / (2 * tickRate * sub)`, `c = (1 - t^2) / (1 + t^2)`,
     `s = 2t / (1 + t^2)`. With `dot = f . d` and `cross = fx * dy - fy * dx`:
     if `dot >= c` the front becomes exactly `d`; otherwise the front is
     rotated by `(c, +s)` when `cross >= 0`, else by `(c, -s)`, and divided by
     its length. Long and heavy drawings turn slower. Collisions never rotate
     a body.
   - **Integrate:** `pos += v * h` for every living body.
   - **Pairs:** every pair `i < j` in index order:
     - Skip if the centre distance is at least the sum of the two size radii.
     - Scan A's boundary cells against B (sign +1), then B's boundary cells
       against A (sign -1). For a boundary cell `p` of the first body:
       transform its centre into the second body's local frame `q`; `gx =
       floor(qx + cx)`, `gy = floor(qy + cy)`; for `oy` in -1..1 (outer loop)
       and `ox` in -1..1 every occupied cell `(gx + ox, gy + oy)` whose centre
       is closer than 1 is a contact: `depth = 1 - distance`; the unit vector
       from the second body's cell to `p`, times `depth`, rotated to the world
       and times the sign, is added to a sum (it points from B toward A). The
       largest depth is kept. If either cell of a contact is sharp, its owner
       is marked as "touching with a sharp cell".
     - No contact: nothing happens. Otherwise the normal `n` is the normalised
       sum. When the sum is shorter than `deepNormalShare` times the largest
       depth (contacts on both sides of a blade cancel), the vector of the
       deepest contact alone is used. Fallbacks: centre A minus centre B, then
       `(1, 0)`, when the squared length is below 1e-12.
     - Push apart along `n` by the largest depth, shared by inverse push
       weight: with `invA = 1 / mass_A`, `invB = 1 / mass_B`: A moves `+n *
       depth * invA / (invA + invB)`, B the opposite with `invB`.
     - If the contact is still deeper than `deepContactDepth` after the push,
       the pair is scanned and pushed again, positions only, at most
       `extraSeparationPasses` (8) times.
     - `dashing` = A or B has `dashTicks > 0`.
     - If the relative velocity along `n` is closing (`rel = (vA - vB) . n <
       0`): impulse `-(1 + e) * rel / (invA + invB)` along `n` on A and against
       it on B, each divided by its weight; `e = dashRestitution` when
       `dashing`, else `restitution`.
     - **A contact ends a dash:** if `dashing`, every body of the pair with
       `dashTicks > 0` gets `dashTicks = 0` and an event `ram` is recorded.
       The dash cooldown keeps running.
     - **Damage** (not within one team): with `blunt_A = bluntDamage +
       bluntBonus_A` (the bonus is 0 for every body except solo enemy copies,
       section 5): if the cooldown A-to-B is 0, B loses
       `(A touches with a sharp cell ? max(blunt_A, sharpness_A) +
       sharpArmourCut * fullArmour_B : blunt_A) * damageMult_A *
       elementMultiplier(A, B)` (a blade also takes 0.4 % of the victim's
       full armour with every hit), the cooldown
       A-to-B becomes `hitCooldownTicks`, and B gets a knockback of `damage *
       hitKnockbackPerDamage / mass_B` away from A. Then the same for B-to-A.
       One contact therefore hurts both sides, each with what it touched with.
   - **Crowd relaxation** (only when the world has more than two bodies,
     dead ones counted): pushing one pair apart can press a body into a third
     one. After the pair loop the pairs `i < j` (living bodies, index order)
     are gone through again, at most `crowdRelaxPasses` (4) times: a pair
     within reach whose scan has a contact deeper than `deepContactDepth` is
     pushed apart along its contact normal by the largest depth, shared by
     inverse push weight, exactly like the first push of a pair. Positions
     only: no velocity, damage, cooldown, dash end or event, and teams do not
     matter. The loop stops after a round in which no pair was pushed.
     It does not always settle within its four rounds (the Reviewer counted
     the fourth round still pushing in 538 of 261926 sub-steps), and within
     one tick a squeezed body can be pushed back and forth; no speed is added
     and the solo wall is applied afterwards. Because dead bodies count, a
     three-seat round whose last two figures are alive still relaxes, unlike
     a duel. Cost: about twice the step time in four-figure rounds (23.7 ->
     43.6 microseconds per tick in Node), duels unchanged.
4. **Wall** (solo only): a body further than `arenaRadius` from the centre is
   put back on the circle and loses the outward part of its velocity.

Because of the sub-steps no cell of a body moves more than `maxStepCells`
(0.4 cells) between two scans, by moving or by turning, up to `maxSubSteps *
maxStepCells` (3.2 cells per tick = 192 cells per second) for speed plus tip
speed. The fastest dash of a valid figure is 123 cells per second. Measured
on bot rounds (`node sim/overlap_probe.js`, sampled at the end of every
tick): the cell centres of two bodies stay at least 0.5 apart for the tested
ordinary pairs. Known limit: figures with one-cell teeth and one-cell gaps
(comb, hedgehog, star) against each other, and any figures in a crowd, can
still mesh for a moment. Measured with 8 extra passes and 4 relaxation
rounds: comb against comb 0.10 % of the ticks deeper than 0.5 (largest
overlap 0.84, at most 4 ticks in a row), comb against hedgehog 0.02 %, comb
against star 0.04 %, hedgehog against hedgehog none, 30 random four-figure
rounds 0.07 % (largest 0.96, at most 17 ticks in a row). With the version 2
numbers (2 passes, no relaxation) the same probe gives 1.18 % (0.97, 58
ticks), 0.24 %, 0.02 %, 0.04 % and 0.48 % (0.99, 25 ticks). The overlaps
are rare, short, deterministic and add no speed; they are reduced, not
removed.

The last tick of a dash is not a ram: `dashTicks` is counted down in the
control step, so a contact in the twelfth dash tick is a normal contact
(review finding m1, kept).

A figure whose armour reaches 0 during a tick stays in the step until the end
of the tick and still pushes, deals and takes damage (review finding M1,
kept); the mode modules remove it after the step.

## 4. Mode B: Ring

- 2 to 4 seats (start distance `startRadius * startDistanceFraction`, 0.6, so
  that four canvas-wide figures do not overlap at the start). Start slots are
  unit vectors: 2 seats left and right; 3 seats
  `(0, -1)`, `(sqrt(3) / 2, 0.5)`, `(-sqrt(3) / 2, 0.5)`; 4 seats left, right,
  top, bottom. Seat `s` takes slot `(s + roundsAlreadyStarted) mod seats`, at
  distance `startRadius * startDistanceFraction`, front toward the centre.
- A round only starts when every figure passes `ringCheckFigure`: at least
  `ink.minBodyCells` body cells and `filled` not above the seat's budget.
  Otherwise `ringStartRound` throws and changes nothing.
- Ring radius by round tick: `startRadius[seats]` until `shrinkStartTick`,
  linear down to `endRadius` at `shrinkEndTick`, constant until
  `suddenDeathTick`, then minus `suddenDeathShrinkPerTick` per tick down to 0.
- Each tick: physics step, tick + 1, new radius, then in seat order a living
  figure is out when its armour is at or below 0 (reason `armour`, checked
  first) or its centre is outside the ring (`x^2 + y^2 > R^2`, reason `ring`).
- When at most one figure is left the round ends. If nobody is left, the
  winner is the figure eliminated in that tick that is closest to the centre
  (lowest seat on an exact tie). Winner + 1 win; every other seat + 1 lost
  round. `winsToTakeMatch` (3) wins end the match.
- Catch-up: budget = `floor(figureBudget * (100 + 15 * min(lostRounds,
  catchUpMaxSteps)) / 100)`.

## 5. Mode A: Solo Arena

- Round arena with a wall (`arenaRadius`). The hero starts in the centre with
  its armour carried over between waves.
- The run starts with Black plus at most one chosen colour for the hero and
  the weapon; enemy drawings may use all colours. Hero, weapon and enemy
  drawings are checked (`soloCheckDrawing`); invalid ones are refused.
- Wave `w` (0 to 4) with stake index `k` (0, 1, 2; anything else is refused):
  copies = `floor(waveBudgets[w] * stakes[k] / (N + copyInkOverhead))`, at
  least 1, at most `maxCopies`. Each copy spawns at a random direction (two
  generator draws, rejection of points outside the unit circle) at
  `arenaRadius - enemySpawnInset`, front toward the centre, with
  - armour `(enemyArmourPerInk * N + enemyArmourMult * armour) * scale`,
    where `scale = waveBudgets[w] * stakes[k] / (copies * (N +
    copyInkOverhead))`, limited to `copyArmourScaleMin .. copyArmourScaleMax`
    (0.5 to 2): ink that buys no further copy makes the copies tougher, a
    budget that does not pay for one copy makes it weaker,
  - top speed `(enemySpeedBase + enemySpeedMult * topSpeed) *
    stakeSpeedMult[k]` (`soloEnemySpeed`): a flat 3 cells per second plus
    45 % of the drawing's speed, so heavy drawings stay the slowest enemies
    but do not crawl,
  - damage times `enemyDamageMult * stakeDamageMult[k]`,
  - **crush** (`soloEnemyCrush`, the body's `bluntBonus`): `enemyCrushPerInk
    * N * scale * stakes[k]` is added to the blunt damage of the copy's
    touches before the two damage factors. In the walled arena weight cannot
    push anybody out, so it hits harder instead, and a stake that buys no
    further copy of a heavy drawing makes its copies hit harder. A blunt
    touch of a copy costs `(bluntDamage + crush) * enemyDamageMult *
    stakeDamageMult[k]`; a sharp touch `max(bluntDamage + crush, sharpness) +
    sharpArmourCut * fullArmour_hero`, times the same factors.
  Enemies do not damage each other.
- Enemy bot: steer straight at the hero; when closer than `enemyDashRange`
  plus both radii and able to dash, dash with `enemyDashChancePercent` chance
  per tick.
- Tick order: enemy inputs, physics step, throw, shots, enemy deaths, drops,
  end checks.
- Thrown weapon: every `throwIntervalBaseTicks + floor(N_w *
  throwIntervalTicksPerInk)` ticks a shot leaves the hero centre toward the
  nearest enemy centre (enemies already at 0 armour are no target) with speed
  `throwSpeedBase / (1 + N_w / throwSpeedWeightRef)`. A shot is a circle of
  radius `min(weapon radius, projectileRadiusMax)`; it hits the first enemy
  (index order, armour above 0) with a boundary cell centre closer than
  radius + 0.5. Damage = weapon sharpness times the element multiplier of the
  weapon's element; knockback speed `N_w * weaponKnockbackPerInk / N_enemy`
  along the flight. The shot is spent. Shots live `projectileLifeTicks`.
- An enemy at 0 armour leaves a drop. In a wave every drop is worth
  `floor(waveBudgets[w] * stakes[k] / copies)`: a wave pays its staked
  budget (rounded down per drop) and never more. In the boss fight a drop is
  worth the enemy's `N`.
  A drop is collected when within hero radius + `pickupRange`; it disappears
  after `dropLifeTicks`. Drops still lying when the last enemy falls are
  collected. Collected ink counts into score and wallet.
- The hero at 0 armour ends the run (`armour`); this is checked before the
  cleared wave, so a hero that falls in the same tick as the last enemy has
  lost (review finding M2, kept). A fight longer than `waveMaxTicks` ends the
  run (`time`).
- Between waves at most one upgrade, cost `upgradeCost[wave just cleared]`
  from the wallet: hero ink (+`upgradeHeroInk` budget, redraw; damage already
  taken stays), weapon ink (+`upgradeWeaponInk`, redraw), heal
  (`upgradeHealPercent` of full armour), one more colour.
- Boss after wave 5: cell-wise union of the five enemy bodies (the earliest
  wave gives the colour of a shared cell), body and stats by the normal rules
  without a budget, armour `armour * bossArmourMult`, plus `bossEscortCopies`
  copy of each wave design with the enemy armour formula (scale 1); stake
  index 0. The speed of the boss and the escorts uses stake index 0. **No
  crush in the boss fight:** after spawning, the `bluntBonus` of the boss and
  of every escort is multiplied by `bossCrushMult` (0). The crush is what a
  stake buys in a wave; the boss fight has no stake, and with crush six heavy
  bodies made it much harder at x1 than in version 2 for a reason that had
  nothing to do with the stake (review of version 3, B1).

## 6. Bots

Ring bots (`botRingInput`), one generator per seat, style from
`match.botStyle[seat]`.

Style 0, the rusher:

1. Every `wobbleTicks` ticks it draws a sideways wobble of -1, 0 or +1.
2. Target = nearest living opponent by centre distance (lowest seat on a tie).
3. Aim point = target centre moved toward the ring centre by `insideBias *
   own radius` (at most to the centre), so the push goes outward.
4. Steering = unit vector to the aim point plus `wobble * wobbleStrength`
   times its perpendicular, normalised.
5. Edge margin = `edgeMargin`, plus `ringRadius * lightRetreatFraction * (1 -
   ownWeight / targetWeight)` when the target is heavier. Beyond `ringRadius -
   margin` the steering blends toward the centre over `edgeBlend` cells; if
   the target lies in that direction (dot above `roundaboutDot`) a sideways
   part away from the target is added.
6. Dash: when able, not deep in edge avoidance, and the target is closer than
   `dashRange` plus both radii, with `dashChancePercent` chance per tick.

Style 1, the circler (hit and run):

1. The same wobble draw; its sign is the circling side.
2. Target = the living opponent with the fewest other living figures within
   `circlerCrowdRange` of it; nearest on a tie; lowest seat on an exact tie.
3. While its dash cooldown is above `circlerAttackLeadTicks` it circles the
   target at a gap of `circlerStandoff` cells (tangent plus a radial
   correction of `(gap - standoff) / circlerBlend`, limited to -1 .. 1).
4. Otherwise it runs at the aim point of the rusher (no wobble) and dashes as
   soon as the dash is ready, the gap is below `circlerDashGap` and its front
   points at the target (dot product at least `circlerAlignDot`).
5. Edge avoidance as the rusher.

Solo hero bot (`botHeroInput`, simulation only): style 0 keeps away from the
nearest enemy while circling and otherwise collects drops; style 1 runs into
the nearest enemy. Both stay off the wall.

## 7. Determinism

- Only `+ - * /`, `Math.sqrt`, `Math.floor` and 32-bit integer operations.
  `Math.floor` is used for the grid lookup in the contact scan, the number of
  sub-steps, the catch-up budget, wave copies, drop values and the throw
  interval; it is exact, so traces can still match bit for bit. No other math
  function is used (enforced by a test).
- Generator: xorshift32 (`rng.js`), seeded as `seed XOR 0x9E3779B9` (0 becomes
  0x1234567) and advanced four times. Per-seat streams use `seed + (seat + 1)
  * 0x85EBCA6B` (32-bit wrap). `rngInt(n) = (next >>> 8) mod n`, `rngFloat =
  (next >>> 8) / 2^24`. Reference values are written into
  `tests/properties.test.js`.
- Floating-point sums run in the loop orders given above.
- The bots use one module-level scratch record for the steering direction;
  it is fully rewritten in every call and carries nothing between calls.
- State hash: FNV-1a 32 bit over the little-endian bytes of the doubles listed
  in `core/hash.js` (layout 2, also in `CHANGES_V2.md` B12; unchanged in
  version 3: `bluntBonus` is fixed when a body is made and is not hashed).

## 8. What was not built

- No drawing time limit in the core (a UI matter; `ring.drawTimeSeconds` is
  stored only).
- Collisions do not spin figures; there is no angular momentum.
- Sound, look, squash and hop are outside the core.
- Bots do not draw; in bot matches the same drawing is reused every round.
- Element effects were not changed in version 2 or 3 (damage multiplier
  only). Version 3 measured stronger multipliers (2 and 0.5) and did not
  adopt them (`Artifacts/Inkweight/Evidence/INK-CORE-V3/WORKER_RESULT.md`).

## 9. Differences from INK_RULES_V1.md

| Rule | INK_RULES_V1 | As built (version 3) | Reason |
|---|---|---|---|
| Sharp cell | at least 5 of 8 neighbours empty | in no filled 2 x 2 square | The old rule made a diagonal sword blunt (a staircase has 4 body neighbours per cell) and made the corners of a block sharp. The new rule reads "ink one cell thick is blade". |
| Armour | `20 + 2 C + 0.25 N` | `60 + 1 C + 0.3 N + 0.3 * min(P, N - S)` | Same shape as the first rule with other numbers: a filled disc has 3.9 times the armour of a line and 4.2 times that of a dot. Pocket cells give a thick closed shell a little armour, always less than filling gives. |
| Push weight | weight | `N + 0.1 * min(P, N - S)` | A job for hollow shapes that is not armour: a thick closed shell is up to 10 % harder to push. |
| Sharpness | `3 + 0.12 S` | `1 + 1.2 S^2 / (S^2 + 25) + 3 (S / N)^2 / (1 + N / 60)` | Count of blade cells with a ceiling: a short blade on a solid body already raises the stat clearly (12 cells: 1.0 to 2.0), more spikes add little. The second part makes a light drawing that is nothing but blade the sharpest (line 4.1, 12-cell line 4.5). |
| Sharp touch | sharpness | `max(blunt, sharpness) + 0.4 % of the victim's full armour` | A sharp cell never does less than a blunt touch (review I3). The armour cut is the counterweight to the steep armour: without it thick empty shells won 85 to 93 % of duels as rushers and light blades fell to 25 to 33 %. |
| Blunt damage | 1 | 1.2 | as core version 1 |
| Top speed | `9 / (1 + N / 160)` | `38 / (1 + N / 70)` | as core version 1 |
| Hit cooldown | 0.4 s | 24 ticks (= 0.4 s) | unchanged |
| Element | 30 %, x1.5 / x0.75 | same | unchanged |
| Budgets, minimum size | 220 / 60 / 12 | same; the weapon also needs 12 cells; the Ring refuses invalid figures | not stated for weapons |
| Catch-up | +15 % per lost round | same, capped at 4 steps (+60 %) | as core version 1 |
| Simultaneous knock-out | not stated | closest to the centre wins | needed a rule |
| Ring size and timing | not stated | radius 44 / 50 / 56, shrinks from 5 s to 45 s down to 16, sudden death from 60 s | needed numbers |
| Dash | "short burst, cooldown" | 0.2 s at 3.8 times top speed, 2 s cooldown; a contact ends the dash and is a ram with its own bounce factor 0.3 | Without this a dashing figure passed through thin figures (review I1). |
| Movement step | not stated | a tick is cut into up to 8 parts so that no cell moves more than 0.4 cells between two contact checks, by moving or by turning; the turn happens inside the parts | review V1 I1, review V2 I4 |
| Hit knockback | not stated | each hit pushes the victim back by `damage * 39 / weight` cells per second | as core version 1 |
| Solo copies | budget / N | budget x stake / (N + 40), at most 10 | Swarm control. |
| Solo enemies | copies of the design | armour `(0.6 N + 0.2 armour) x scale`, speed `3 + 45 %` of the design's, 40 % damage, blunt touches plus the crush `0.004 x N x scale x stake` | Armour follows size, so a big drawing without core cells is not fragile (review V2 I6); the scale spends the ink that buys no further copy. Version 3: heavy blunt designs (block, disc, ring, hoop) were harmless and made the stake free (re-review R1); their weight now hits, and harder with the stake. |
| Solo stake | x1 / x1.5 / x2 budget | also enemy damage x1 / x1.25 / x1.5 and speed x1 / x1.1 / x1.2; a wave pays its staked budget and never more | The stake had no effect once copies hit the cap (review V1 M7); a heavy design paid its own ink whatever the budget (review V2 I6). |
| Solo heal | not stated | 35 % of full armour | 50 % made every run safe. |
| Solo colours | "an extra colour" upgrade | the run starts with Black plus one colour | as core version 1 |
| Solo time limit | not stated | a fight ends the run after 180 s | as core version 1 |
| Boss | "assembled from the enemy drawings" | union of the five drawings, armour x1.2, plus one copy of each design | needed a rule |

## 10. Open design questions for the Human

1. **"Filled areas are armour" against four-figure rounds.** Correction round
   1 made the sentence visibly true again (disc 270, line 70, dot 65). The
   price was measured: light drawings win almost no four-figure round again
   (2.4 % on average, even is 25 %), and the dot wins 3 % of its duels. The
   flat armour of the first candidate had lifted them to 15.6 %. Both cannot
   be had with the present rules; this needs a Human decision or a new idea
   (for example a separate, weight-independent way to survive).
2. **Solids are now weak in duels** (disc 37 %, block 42 % pooled, 28 to 33 %
   as rushers) although they have the most armour: blades take 0.4 % of the
   full armour per hit on top of their sharpness, and solids deal only blunt
   damage. Lowering the armour cut brings the thick empty shells back to the
   top (measured 85 to 93 % as rushers without it). Recommendation: play it
   before changing numbers; a solid with one blade (lance, hedgehog) is the
   strong all-round drawing at the moment.
3. **Heavy all-blade drawings lead the field** (snake 68 %, nested loops
   66 %, hedgehog 65 % pooled). The purity part of sharpness has a weight
   term against exactly these drawings; it is not enough at the new armour
   scale.
4. **Sharpness has two parts**, and the armour cut is a third thing a blade
   does. Recommendation: judge by playing whether the stat bar is
   understandable.
5. **Bot style decides more than shape.** A rusher beats a circler in 79 % of
   duels whatever is drawn. Recommendation: do not tune further on bot
   numbers before humans have played.
6. **Solo:** swarms of thin copies are beatable at x1 and deadly above; the
   heavy snake enemy is now one of the hardest enemies (7 of 48 runs won).
   The boss fight still pays the ink of the boss and its escorts, so heavy
   enemy designs pay more there; they also make the boss fight harder.
7. **Thrown weapon** is a circle with the weapon's stats, not its drawn shape
   (unchanged). Recommendation: fine for the prototype.
8. **Elements** only multiply damage. Not changed in version 2 or 3.
9. **Balance pass 3 (version 3) changed no Ring number.** Five levers were
   measured one by one under rusher bots and under circler bots (slower
   acceleration for wide heavy drawings, a blade bonus on a figure that is
   already fighting a third one, stronger elements, a shorter dash cooldown
   for light figures, a ring edge that comes sooner for big drawings). None
   lowered the highest duel win rate under both styles; three raised it. The
   field's leaders differ by bot style (nested loops, border hoop, hedgehog
   as rushers; one-cell hoop, shield, snake as circlers), so a cost on one
   property hands the top to another drawing. The two open problems stay
   open: one drawing wins about 77 % of its duels under either style, and
   light drawings win almost no four-figure round. Recommendation: let
   humans play before another balance pass.
10. **Solo stake and heavy blunt enemy designs (version 3, known open
    point).** The crush makes x2 a real risk for block, disc, ring and hoop
    designs when the hero is slow or goes for the drops (bot runs: 27 of 64
    end before the boss, 27 of 64 won). Two things are **not** solved:
    - **x1.5 is nearly free again for these designs in the bot runs** (63 of
      64 runs won, score 2677 against 2006 at x1) now that the boss fight has
      no crush.
    - **A fast hero that kites a single heavy copy still gets the higher
      stake nearly free during the waves.** The Reviewer's simple kiter (run
      away in a circle, no skill needed) with a 32-cell line hero (26 cells
      per second) against a block took 0 damage at x1, x1.5 and x2 in waves 1
      and 3, and collects twice the ink at x2; the only cost is a longer
      fight. A heavy copy moves at 7.3 to 8.7 cells per second, so this works
      for every hero faster than about 9, which is almost all of them. Only a
      slow hero pays (disc hero, wave 3: 10 / 38 / 121 armour lost).
    No rule was changed for this. A later order can test a minimum copy
    count per stake for heavy designs (the extra ink split into more, weaker
    copies), measured with a scripted kiter as well as the drop-chasing
    bots.
