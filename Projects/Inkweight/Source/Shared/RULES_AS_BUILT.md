# Inkweight Rules As Built (Work Order INK-CORE-V1)

This records what the engine-free core in `../WebPrototype/core/` really does,
so that a second implementation (C# for Unity) can match it without guessing.
The numbers live in [`ink_tuning.json`](ink_tuning.json); when this text and
the JSON differ, the JSON is what runs.

Status of everything here: **prototype proposal by the Worker**, not a Human
decision. `Projects/Inkweight/Docs/INK_RULES_V1.md` was not edited; section 9
lists every number and formula that differs from it and why.

Units: distances in canvas cells, time in ticks (`physics.tickRate` = 60 per
second). World axes equal canvas axes: x to the right, y downward.

## 1. Drawing, body, stats

- Drawing: 32 x 32 integers, index `y * 32 + x`; 0 empty, 1 Black, 2 Ember,
  3 Tide, 4 Moss. Every filled cell costs 1 ink, drips included.
- Body: largest 4-connected group. Groups are found by scanning cell indices
  upward; a later group replaces the current best only when strictly larger,
  so a tie goes to the group containing the lowest cell index. Other filled
  cells are drips: they cost ink but count for nothing.
- `N` body cells. For every body cell the 8 neighbours are counted (outside
  the canvas = empty). Core cell: 8 body neighbours (`C`). Sharp cell: at
  least `stats.sharpMinEmptyNeighbours` (5) empty neighbours (`S`).
- Valid: `N >= ink.minBodyCells` (12; weapons `ink.weaponMinBodyCells`, also
  12) and `filled <= budget`.
- Weight = `N`.
- Armour = `armourBase + armourPerCore * C + armourPerCell * N`.
- Sharpness = `sharpBase + sharpPerSharpCell * S + sharpPerSharpShare * S / N
  + sharpPerSharpShareSquared * (S / N) * (S / N)`.
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

Facts that follow from the neighbour rule and surprised the Worker:

- A diagonal line of single cells is not connected (all but one cell drip).
- A connected diagonal staircase has no sharp cells except its two ends.
- The four corners of a filled rectangle are sharp cells.
- A line two cells wide is sharp only at its four end cells.

## 2. Collision shape

Every body cell is a circle of radius 0.5 at its cell centre. A figure template
keeps the cells in ascending cell index with local coordinates
`lx = x + 0.5 - cx`, `ly = y + 0.5 - cy`, a lookup grid (cell number or -1) and
the list of boundary cells (all cells that are not core cells).

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
2. **Integrate:** `pos += v * dt`.
3. **Pairs:** all hit cooldowns above 0 count down by 1. Then every pair
   `i < j` in index order:
   - Skip if the centre distance is at least the sum of the two size radii.
   - Scan A's boundary cells against B (sign +1), then B's boundary cells
     against A (sign -1). For a boundary cell `p` of the first body: transform
     its centre into the second body's local frame `q`; `gx = floor(qx + cx)`,
     `gy = floor(qy + cy)`; for `oy` in -1..1 (outer loop) and `ox` in -1..1
     every occupied cell `(gx + ox, gy + oy)` whose centre is closer than 1 is
     a contact: `depth = 1 - distance`; the unit vector from the second body's
     cell to `p`, times `depth`, rotated to the world and times the sign, is
     added to a sum (it points from B toward A). The largest depth is kept. If
     either cell of a contact is sharp, its owner is marked as "touching with a
     sharp cell".
   - No contact: nothing happens. Otherwise the normal `n` is the normalised
     sum (fallback: centre A minus centre B, then `(1, 0)`, when the squared
     length is below 1e-12).
   - Push apart along `n` by the largest depth, shared by inverse weight: with
     `invA = 1 / N_A`, `invB = 1 / N_B`: A moves `+n * depth * invA / (invA +
     invB)`, B the opposite with `invB`.
   - If the relative velocity along `n` is closing (`rel = (vA - vB) . n <
     0`): impulse `-(1 + restitution) * rel / (invA + invB)` along `n` on A and
     against it on B, each divided by its weight.
   - **Damage** (not within one team): if the cooldown A-to-B is 0, B loses
     `(A touches with a sharp cell ? sharpness_A : bluntDamage) * damageMult_A
     * elementMultiplier(A, B)`, the cooldown A-to-B becomes
     `hitCooldownTicks`, and B gets a knockback of `damage *
     hitKnockbackPerDamage / N_B` away from A. Then the same for B-to-A.
     One contact therefore hurts both sides, each with what it touched with.
4. **Wall** (solo only): a body further than `arenaRadius` from the centre is
   put back on the circle and loses the outward part of its velocity.

## 4. Mode B: Ring

- 2 to 4 seats. Start slots are unit vectors: 2 seats left and right; 3 seats
  `(0, -1)`, `(sqrt(3) / 2, 0.5)`, `(-sqrt(3) / 2, 0.5)`; 4 seats left, right,
  top, bottom. Seat `s` takes slot `(s + roundsAlreadyStarted) mod seats`, at
  distance `startRadius * startDistanceFraction`, front toward the centre.
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
  the weapon; enemy drawings may use all colours.
- Wave `w` (0 to 4): copies = `floor(waveBudgets[w] * stakes[stake] / N)`,
  at least 1, at most `maxCopies`. Each copy spawns at a random direction
  (two generator draws, rejection of points outside the unit circle) at
  `arenaRadius - enemySpawnInset`, front toward the centre, with armour times
  `enemyArmourMult`, top speed times `enemySpeedMult` and damage times
  `enemyDamageMult`. Enemies do not damage each other.
- Enemy bot: steer straight at the hero; when closer than `enemyDashRange`
  plus both radii and able to dash, dash with `enemyDashChancePercent` chance
  per tick.
- Tick order: enemy inputs, physics step, throw, shots, enemy deaths, drops,
  end checks.
- Thrown weapon: every `throwIntervalBaseTicks + floor(N_w *
  throwIntervalTicksPerInk)` ticks a shot leaves the hero centre toward the
  nearest enemy centre with speed `throwSpeedBase / (1 + N_w /
  throwSpeedWeightRef)`. A shot is a circle of radius `min(weapon radius,
  projectileRadiusMax)`; it hits the first enemy (index order) with a boundary
  cell centre closer than radius + 0.5. Damage = weapon sharpness times the
  element multiplier of the weapon's element; knockback speed `N_w *
  weaponKnockbackPerInk / N_enemy` along the flight. The shot is spent. Shots
  live `projectileLifeTicks`.
- An enemy at 0 armour leaves a drop worth its `N`. A drop is collected when
  within hero radius + `pickupRange`; it disappears after `dropLifeTicks`.
  Drops still lying when the last enemy falls are collected. Collected ink
  counts into score and wallet.
- The hero at 0 armour ends the run (`armour`). A fight longer than
  `waveMaxTicks` ends the run (`time`).
- Between waves at most one upgrade, cost `upgradeCost[wave just cleared]`
  from the wallet: hero ink (+`upgradeHeroInk` budget, redraw; damage already
  taken stays), weapon ink (+`upgradeWeaponInk`, redraw), heal
  (`upgradeHealPercent` of full armour), one more colour.
- Boss after wave 5: cell-wise union of the five enemy bodies (the earliest
  wave gives the colour of a shared cell), body and stats by the normal rules
  without a budget, armour times `bossArmourMult`, plus `bossEscortCopies`
  copy of each wave design.

## 6. Bots

Ring bot (`botRingInput`), one generator per seat:

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

Solo hero bot (`botHeroInput`, simulation only): style 0 keeps away from the
nearest enemy while circling and otherwise collects drops; style 1 runs into
the nearest enemy. Both stay off the wall.

## 7. Determinism

- Only `+ - * /`, `Math.sqrt`, `Math.floor` and 32-bit integer operations.
  `Math.floor` is used for the grid lookup in the contact scan, the catch-up
  budget, wave copies and the throw interval; it is exact, so traces can still
  match bit for bit. No other math function is used (enforced by a test).
- Generator: xorshift32 (`rng.js`), seeded as `seed XOR 0x9E3779B9` (0 becomes
  0x1234567) and advanced four times. Per-seat streams use `seed + (seat + 1)
  * 0x85EBCA6B` (32-bit wrap). `rngInt(n) = (next >>> 8) mod n`, `rngFloat =
  (next >>> 8) / 2^24`.
- Floating-point sums run in the loop orders given above.
- State hash: FNV-1a 32 bit over the little-endian bytes of the doubles listed
  in `core/hash.js`.

## 8. What was not built

- No drawing time limit in the core (a UI matter; `ring.drawTimeSeconds` is
  stored only).
- Collisions do not spin figures; there is no angular momentum.
- Sound, look, squash and hop are outside the core.
- Bots do not draw; in bot matches the same drawing is reused every round.

## 9. Differences from INK_RULES_V1.md

| Rule | INK_RULES_V1 | As built | Reason |
|---|---|---|---|
| Armour | `20 + 2 C + 0.25 N` | `55 + 2 C + 0 N` | With the starting formula a thin drawing had about a fifteenth of a solid's armour and lost every exchange. A higher base and no per-cell part narrows this to about one to seven. |
| Sharpness | `3 + 0.12 S` | `1 + 5.5 (S / N)^2` (share of sharp cells, squared; the count term is still in the code with factor 0) | Counting sharp cells made "full ink and covered in spikes" the best drawing against everything (92 % wins in the first simulation). The share makes pure blades sharp and heavy spiked bodies only a little sharp. This is a formula change, not only a number. |
| Blunt damage | 1 | 1.2 | Lets solid drawings win long exchanges against light blades about as often as they lose them. |
| Top speed | `9 / (1 + N / 160)` | `38 / (1 + N / 70)` | 9 cells per second is half a body length per second: rounds were grinding matches in the middle. The smaller reference makes light drawings clearly faster (about 3 times a full-ink drawing). |
| Hit cooldown | 0.4 s | 24 ticks (= 0.4 s) | unchanged |
| Element | 30 %, x1.5 / x0.75 | same | unchanged |
| Budgets, minimum size | 220 / 60 / 12 | same; the weapon also needs 12 cells | not stated for weapons |
| Catch-up | +15 % per lost round | same, capped at 4 steps (+60 %) | Without a cap a four-seat match could hand out more ink than fits a readable figure. |
| Simultaneous knock-out | not stated | closest to the centre wins | needed a rule |
| Ring size and timing | not stated | radius 44 / 50 / 56, shrinks from 5 s to 45 s down to 16, sudden death from 60 s | needed numbers |
| Dash | "short burst, cooldown" | 0.2 s at 3.8 times top speed, 2 s cooldown | needed numbers |
| Hit knockback | not stated | each hit pushes the victim back by `damage * 39 / weight` cells per second | Added during tuning; gives blades a way to move heavy figures and makes hits visible. |
| Solo enemies | copies of the design | copies with 35 % armour, 45 % speed, 20 % damage, at most 20 | A swarm of full-strength copies killed the bot hero within seconds. |
| Solo colours | "an extra colour" upgrade | the run starts with Black plus one colour | The upgrade needs something to unlock. |
| Solo time limit | not stated | a fight ends the run after 180 s | Prevents endless kiting. |
| Boss | "assembled from the enemy drawings" | union of the five drawings, armour x1.5, plus one copy of each design | needed a rule |

## 10. Open design questions for the Human

1. **Sharpness by share instead of count.** The built rule reads "the thinner
   the whole drawing, the sharper". The original rule reads "every thin line
   adds damage". Recommendation: keep the share rule for now and judge it by
   playing; it is the only version in which heavy spiked drawings did not beat
   everything in simulation.
2. **Small drawings stay weak in the Ring.** A 13-cell dot wins about 1 % of
   its duels. Recommendation: accept this for the Ring (everyone has the same
   ink, so using it is right) and let small drawings shine in the solo mode
   as swarms and in later disciplines such as a race.
3. **Hollow drawings (ring, frame) are weak**: no core means little armour, no
   thin ends means no blades. Recommendation: leave it; if hollow shapes
   should matter, give size a job (for example a wider pick-up or push zone)
   in a later rule version.
4. **Diagonals.** Diagonal single-cell lines fall apart and staircases are not
   sharp. Recommendation: let the drawing tool always paint a 4-connected
   stroke, and decide after play tests whether staircases should count as
   blades.
5. **Corners of a rectangle count as sharp.** Recommendation: keep; it is
   cheap to explain ("corners poke").
6. **Free-for-all favours heavy solids** (see the balance report).
   Recommendation: test with humans before changing numbers; bots pile into
   the middle, which favours weight.
7. **Solo difficulty** is mostly decided by the enemy design the player draws,
   less by the stake. Recommendation: let the stake also raise enemy damage or
   speed, not only the number of copies.
8. **Thrown weapon** is a circle with the weapon's stats, not its drawn shape.
   Recommendation: fine for the prototype; draw the weapon picture on the
   circle.
