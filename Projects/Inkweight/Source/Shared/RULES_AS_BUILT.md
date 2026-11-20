# Inkweight Rules As Built (core version 2, Work Order INK-CORE-V2)

This records what the engine-free core in `../WebPrototype/core/` really does,
so that a second implementation (C# for Unity) can match it without guessing.
The numbers live in [`ink_tuning.json`](ink_tuning.json) (`ink-tuning-2`); when
this text and the JSON differ, the JSON is what runs. What changed against
version 1 is listed function by function in [`CHANGES_V2.md`](CHANGES_V2.md).

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
- Weight = `N`.
- Armour = `armourBase + armourPerCore * C + armourPerCell * N +
  armourPerPocket * min(P, pocketCapPerCell * (N - S))`.
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
- A one-cell loop encloses space but gets no pocket armour (all its cells are
  blade cells, the cap `N - S` is 0). A loop with walls two or more cells
  thick does. A gap in the wall, also a diagonal one, opens the space.
- Gaps one cell wide between walls are enclosed but are not pocket cells.

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
   - **Turning:** `turnRate = turnBase / (1 + inertia / turnInertiaRef)`,
     `t = turnRate / (2 * tickRate)`, `turnCos = (1 - t^2) / (1 + t^2)`,
     `turnSin = 2t / (1 + t^2)`. With `dot = f . d` and `cross = fx * dy - fy *
     dx`: if `dot >= turnCos` the front becomes exactly `d`; otherwise the
     front is rotated by `(turnCos, +turnSin)` when `cross >= 0`, else by
     `(turnCos, -turnSin)`, and divided by its length. Long and heavy drawings
     turn slower. Collisions never rotate a body.
2. **Hit cooldowns:** all hit cooldowns above 0 count down by 1.
3. **Sub-steps:** `sub = floor(sqrt(maxV2) * dt / maxStepCells) + 1`, at most
   `maxSubSteps`, where `maxV2` is the largest squared speed of a living body
   after control. `h = dt / sub`. `sub` times in a row:
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
       sum (fallback: centre A minus centre B, then `(1, 0)`, when the squared
       length is below 1e-12).
     - Push apart along `n` by the largest depth, shared by inverse weight:
       with `invA = 1 / N_A`, `invB = 1 / N_B`: A moves `+n * depth * invA /
       (invA + invB)`, B the opposite with `invB`.
     - `dashing` = A or B has `dashTicks > 0`.
     - If the relative velocity along `n` is closing (`rel = (vA - vB) . n <
       0`): impulse `-(1 + e) * rel / (invA + invB)` along `n` on A and against
       it on B, each divided by its weight; `e = dashRestitution` when
       `dashing`, else `restitution`.
     - **A contact ends a dash:** if `dashing`, every body of the pair with
       `dashTicks > 0` gets `dashTicks = 0` and an event `ram` is recorded.
       The dash cooldown keeps running.
     - **Damage** (not within one team): if the cooldown A-to-B is 0, B loses
       `(A touches with a sharp cell ? max(bluntDamage, sharpness_A) :
       bluntDamage) * damageMult_A * elementMultiplier(A, B)`, the cooldown
       A-to-B becomes `hitCooldownTicks`, and B gets a knockback of `damage *
       hitKnockbackPerDamage / N_B` away from A. Then the same for B-to-A.
       One contact therefore hurts both sides, each with what it touched with.
4. **Wall** (solo only): a body further than `arenaRadius` from the centre is
   put back on the circle and loses the outward part of its velocity.

Because of the sub-steps two bodies close by at most `2 * maxStepCells` (0.8
cells) between two scans, less than the width of the contact zone of two cells
(2 cells), so a contact is found before two thin figures can pass each other,
up to a speed of `maxSubSteps * maxStepCells` (3.2 cells per tick = 192 cells
per second) per body. The fastest dash of a valid figure is 123 cells per
second.

A figure whose armour reaches 0 during a tick stays in the step until the end
of the tick and still pushes, deals and takes damage (review finding M1,
kept); the mode modules remove it after the step.

## 4. Mode B: Ring

- 2 to 4 seats. Start slots are unit vectors: 2 seats left and right; 3 seats
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
  - armour `enemyArmourBase + enemyArmourMult * (armour - armourBase)`,
  - top speed times `enemySpeedMult * stakeSpeedMult[k]`,
  - damage times `enemyDamageMult * stakeDamageMult[k]`.
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
  `max(N, floor(waveBudgets[w] * stakes[k] / copies))`, so the wave pays out
  its whole staked budget; in the boss fight a drop is worth the enemy's `N`.
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
  copy of each wave design with the enemy armour formula; stake index 0.

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
- State hash: FNV-1a 32 bit over the little-endian bytes of the doubles listed
  in `core/hash.js` (layout 2, also in `CHANGES_V2.md` B12).

## 8. What was not built

- No drawing time limit in the core (a UI matter; `ring.drawTimeSeconds` is
  stored only).
- Collisions do not spin figures; there is no angular momentum.
- Sound, look, squash and hop are outside the core.
- Bots do not draw; in bot matches the same drawing is reused every round.
- Element effects were not changed in version 2 (damage multiplier only).

## 9. Differences from INK_RULES_V1.md

| Rule | INK_RULES_V1 | As built (version 2) | Reason |
|---|---|---|---|
| Sharp cell | at least 5 of 8 neighbours empty | in no filled 2 x 2 square | The old rule made a diagonal sword blunt (a staircase has 4 body neighbours per cell) and made the corners of a block sharp. The new rule reads "ink one cell thick is blade". |
| Armour | `20 + 2 C + 0.25 N` | `170 + 0.7 C + 0.8 * min(P, N - S)` | A thin drawing had a fifteenth (rules 1) or a sixth (core 1) of a solid's armour and lost every four-figure round. Now a filled drawing has about 1.6 times the armour of a thin one. Pocket cells give hollow drawings a job. |
| Sharpness | `3 + 0.12 S` | `1 + 1.2 S^2 / (S^2 + 25) + 1.2 (S / N)^2 / (1 + N / 60)` | Count of blade cells with a ceiling: a short blade on a solid body already raises the stat clearly (12 cells: 1.0 to 2.0), more spikes add little, so "full ink covered in spikes" cannot run away. The second part makes a light drawing that is nothing but blade the sharpest (up to 3.0 to 3.4). |
| Sharp touch | sharpness | `max(blunt, sharpness)` | A sharp cell never does less than a blunt touch (review I3). |
| Blunt damage | 1 | 1.2 | as core version 1 |
| Top speed | `9 / (1 + N / 160)` | `38 / (1 + N / 70)` | as core version 1 |
| Hit cooldown | 0.4 s | 24 ticks (= 0.4 s) | unchanged |
| Element | 30 %, x1.5 / x0.75 | same | unchanged |
| Budgets, minimum size | 220 / 60 / 12 | same; the weapon also needs 12 cells; the Ring refuses invalid figures | not stated for weapons |
| Catch-up | +15 % per lost round | same, capped at 4 steps (+60 %) | as core version 1 |
| Simultaneous knock-out | not stated | closest to the centre wins | needed a rule |
| Ring size and timing | not stated | radius 44 / 50 / 56, shrinks from 5 s to 45 s down to 16, sudden death from 60 s | needed numbers |
| Dash | "short burst, cooldown" | 0.2 s at 3.8 times top speed, 2 s cooldown; a contact ends the dash and is a ram with its own bounce factor 0.3 | Without this a dashing figure passed through thin figures (review I1). |
| Movement step | not stated | a tick is cut into up to 8 parts so that no figure moves more than 0.4 cells between two contact checks | review I1 |
| Hit knockback | not stated | each hit pushes the victim back by `damage * 39 / weight` cells per second | as core version 1 |
| Solo copies | budget / N | budget x stake / (N + 40), at most 10 | With the flat armour every copy carries, a swarm of 20 twelve-cell copies could not be beaten. |
| Solo enemies | copies of the design | armour `30 + 1.2 * (armour - 170)`, 55 % speed, 60 % damage | Thin copies are fragile, filled copies are tough; version 1 copies (35 % armour, 20 % damage) could not hurt a big hero. |
| Solo stake | x1 / x1.5 / x2 budget | also enemy damage x1 / x1.25 / x1.5 and speed x1 / x1.1 / x1.2; drops pay out the whole staked budget | The stake had no effect once copies hit the cap (review M7). |
| Solo heal | not stated | 35 % of full armour | 50 % made every run safe. |
| Solo colours | "an extra colour" upgrade | the run starts with Black plus one colour | as core version 1 |
| Solo time limit | not stated | a fight ends the run after 180 s | as core version 1 |
| Boss | "assembled from the enemy drawings" | union of the five drawings, armour x1.2, plus one copy of each design | needed a rule |

## 10. Open design questions for the Human

1. **Sharpness now has two parts.** "Any blade cuts" (count, with a ceiling)
   and "a light drawing that is all blade cuts deepest". The second part was
   added because without it pure light blades lost their place to heavy
   spiked bodies (measured: line 46 to 50 %, needle 35 %, 12-cell line 23 to
   28 % duel win rate), and its weight term was added because heavy all-blade
   drawings (a 209-cell snake, nested loops) were otherwise the best drawings
   in the field (66 to 72 %). Recommendation: judge by playing whether the
   stat bar is understandable; if not, drop the purity part and accept weak
   light blades.
2. **Armour is much flatter.** A thin figure has 170 armour, a full solid about
   275. This is what made four-figure rounds less one-sided, but the sentence
   "filled areas are armour" is now a 1.6 to 1 effect instead of 6 to 1.
   Recommendation: keep for the next play test and look at whether filling
   still feels worth it.
3. **Pocket armour.** A thick-walled ring now has the highest armour in the
   field (319). Recommendation: keep; hollow shapes pay with low weight per
   size. Watch for a "bubble" drawing becoming the default.
4. **Small drawings stay weak in duels.** A 13-cell dot wins about one duel in
   seven. Recommendation unchanged: accept for the Ring, let small drawings
   shine in solo swarms and later disciplines.
5. **Bot style decides more than shape.** In the simulation a rusher beats a
   circler with most drawings, and heavy solids are strong as rushers and weak
   as circlers. Recommendation: do not tune further on bot numbers before
   humans have played.
6. **Solo swarms of thin copies are fragile but still dangerous** at the
   higher stakes (needle and 12-cell-line swarms win most runs at x1.5 and
   x2). Recommendation: play it; if it frustrates, lower `maxCopies` or
   `stakeDamageMult`.
7. **Thrown weapon** is a circle with the weapon's stats, not its drawn shape
   (unchanged). Recommendation: fine for the prototype.
8. **Elements** only multiply damage. Not changed in version 2.
