# Inkweight Core: Changes from Version 2 to Version 3 (Work Order INK-CORE-V3)

Exact change list for the browser app (`WebPrototype/app`) and the C# port
(`Source/Unity`), from the merged version 2 (the state
[`CHANGES_V2.md`](CHANGES_V2.md) describes, tuning `ink-tuning-2`) to version
3 (tuning `ink-tuning-3`). It is written so that the ports can be updated
without reading the JavaScript diff. The full rules as now built are in
[`RULES_AS_BUILT.md`](RULES_AS_BUILT.md); when this list and the code differ,
the code and the golden files are what counts. `CHANGES_V2.md` is unchanged.

Everything here is a prototype proposal by the Worker, not a Human decision.

Notation: "old" is core version 2, "new" is version 3. Section numbers `V1`
... are for cross-reference only.

## A. Summary

| # | Area | Change | Why |
|---|---|---|---|
| V1 | `physics.js`, `buildFigure` | Template fields `turnCos` and `turnSin` removed | Re-review R4: unused since version 2 |
| V2 | tuning | `physics.extraSeparationPasses` 2 -> 8 (no code change) | Re-review R2: meshing teeth |
| V3 | `physics.js`, `stepWorld` | Crowd relaxation after the pair loop of every sub-step when the world has more than two bodies; new function `relaxPair`; new key `physics.crowdRelaxPasses` (4) | Re-review R2: overlap in crowds |
| V4 | `physics.js`, `createBody`, `touchDamage` | New body field `bluntBonus` (0 by default), added to the blunt damage of that body's touches | Re-review R1 (used by solo enemies only) |
| V5 | `solo.js`, `spawnEnemy` | Enemy copies: top speed `(enemySpeedBase + enemySpeedMult * topSpeed) * stakeSpeedMult`; crush `enemyCrushPerInk * N * scale * stake` as `bluntBonus`; new functions `soloEnemySpeed`, `soloEnemyCrush`; new keys `solo.enemySpeedBase` (3), `solo.enemyCrushPerInk` (0.004); `solo.enemySpeedMult` 0.55 -> 0.45 | Re-review R1: heavy blunt enemy designs made the stake free |
| V6 | tuning | `version` is `ink-tuning-3`; `note` rewritten | New tuning version |
| V7 | golden files | Regenerated; no new field, no new trace | V2 to V6 |

Unchanged: `rng.js`, `drawing.js` (every stat and formula), `ring.js`,
`bots.js`, `hash.js` (layout 2, same fields in the same order), the public
functions of version 2 and their arguments, every balance number of the Ring
(armour, sharpness, speed, elements, push, knockback, ring, dash). The third
balance pass tested five levers and adopted none (see
`Artifacts/Inkweight/Evidence/INK-CORE-V3/WORKER_RESULT.md`); none of their
code is in the core.

## B. Changes in detail

### V1. Unused turn fields removed (`core/physics.js`, `buildFigure`)

- Old: the figure template carried `turnCos` and `turnSin` (computed from
  `turnRate / (2 * tickRate)`), which nothing read since the turn moved into
  the sub-steps.
- New: the two fields and the local `t` they were computed from are gone. The
  template is `{ stats, W, H, cx, cy, count, lx, ly, sharp, colour, boundary,
  grid, radius, mass, accelK, turnRate }`. `turnRate` and the per-sub-step
  turn (`CHANGES_V2.md` B5) are unchanged.
- A port that never had these fields has nothing to do.

### V2. More passes for deep contacts (tuning only)

- `physics.extraSeparationPasses`: 2 -> 8. The loop of `CHANGES_V2.md` B6
  ("a contact that is still deep after the push is scanned and pushed again,
  positions only") is unchanged; it now runs at most 8 times and still stops
  at the first scan with no hit or a largest depth of at most
  `deepContactDepth` (0.25).
- A port that reads the value from the tuning file has nothing to do; a port
  with the number 2 written into the code must change it.

### V3. Crowd relaxation (`core/physics.js`, `stepWorld`, new `relaxPair(a, b, ph)`)

- New tuning key `physics.crowdRelaxPasses` = 4 (whole number, 0 switches it
  off).
- Where: inside every sub-step, directly after the pair loop (`collidePair`
  for every pair `i < j`), before the next sub-step starts.
- Condition: only when `n > 2`, where `n` is the number of bodies in the
  world (`world.bodies.length`, dead bodies included). A world with two
  bodies never runs it, so duels are bit-identical with and without it.
- Loop:

  ```text
  repeat at most crowdRelaxPasses times:
    pushed = false
    for i = 0 .. n-1 (skip dead), for j = i+1 .. n-1 (skip dead):
      if relaxPair(body i, body j): pushed = true
    if not pushed: stop
  ```

- `relaxPair(a, b, ph)`, in this order:
  1. `rx = a.x - b.x`, `ry = a.y - b.y`, `reach = a.fig.radius +
     b.fig.radius`; if `rx * rx + ry * ry >= reach * reach` return false.
  2. Scan the pair exactly as `collidePair` does (`scanPair(a, b)`: a's
     boundary against b with sign +1, then b's boundary against a with sign
     -1).
  3. If there is no hit, or the largest depth is `<= deepContactDepth`,
     return false.
  4. Contact normal exactly as in `collidePair` (`contactNormal`: summed
     contact vectors, deepest contact when the sum is shorter than
     `deepNormalShare` times the largest depth, then centre a minus centre b,
     then `(1, 0)`).
  5. `invA = 1 / a.fig.mass`, `invB = 1 / b.fig.mass`, `invSum = invA +
     invB`, `d` = largest depth. `a.x += n.x * d * invA / invSum`, `a.y +=
     n.y * d * invA / invSum`, `b.x -= n.x * d * invB / invSum`, `b.y -= n.y *
     d * invB / invSum`. Return true.
- It changes positions only: no velocity, no damage, no cooldown, no dash
  end, no event, and it does not look at teams (enemy copies of one team are
  pushed apart too).
- Nothing else in `stepWorld` moved: control, hit cooldowns, the number of
  sub-steps, the turn, the integration, `collidePair` and the wall are as in
  version 2.

### V4. Blunt bonus of a body (`core/physics.js`)

- `createBody` adds the field `bluntBonus: 0` to every body. It is set once
  when a body is made and never changes during a fight; it is not part of the
  state hash.
- `touchDamage(tuning, body, sharp, victim)`:
  - Old: `blunt = stats.bluntDamage`.
  - New: `blunt = stats.bluntDamage + body.bluntBonus`. The rest is unchanged:
    a touch without a sharp cell returns `blunt`; a touch with a sharp cell
    returns `(sharpness > blunt ? sharpness : blunt) + sharpArmourCut *
    victim.maxHp`. So a sharp touch still never does less than a blunt one.
- In the Ring every body has `bluntBonus` 0, so nothing changes there.

### V5. Solo enemy copies: speed and crush (`core/solo.js`)

- New tuning keys in `solo`: `enemySpeedBase` = 3 (cells per second),
  `enemyCrushPerInk` = 0.004. Changed value: `enemySpeedMult` 0.55 -> 0.45.
- New exported function `soloEnemySpeed(tuning, fig, stakeIndex)` =
  `(enemySpeedBase + enemySpeedMult * fig.stats.topSpeed) *
  stakeSpeedMult[stakeIndex]` (in this order of operations).
- New exported function `soloEnemyCrush(tuning, fig, scale, stakeIndex)` =
  `enemyCrushPerInk * fig.stats.N * scale * stakes[stakeIndex]` (multiplied
  from left to right).
- `spawnEnemy(tuning, run, fig, isBoss, stakeIndex, scale)`:
  - Old: `createBody(fig, x, y, fx, fy, 1, 1, enemySpeedMult *
    stakeSpeedMult[stakeIndex], enemyDamageMult *
    stakeDamageMult[stakeIndex])`.
  - New: `createBody(fig, x, y, fx, fy, 1, 1, 1, enemyDamageMult *
    stakeDamageMult[stakeIndex])`, then `body.topSpeed = soloEnemySpeed(tuning,
    fig, stakeIndex)`, then `body.bluntBonus = soloEnemyCrush(tuning, fig,
    scale, stakeIndex)`, then the armour as before (`body.hp`, `body.maxHp`).
  - The two generator draws for the spawn direction happen before, as in
    version 2; no draw was added or removed.
- `scale` is the wave scale of version 2 (`soloWaveArmourScale`, limited to
  `copyArmourScaleMin .. copyArmourScaleMax`); `soloStartBoss` passes scale 1
  and stake index 0 for the boss and for every escort, so in the boss fight
  speed = `enemySpeedBase + enemySpeedMult * topSpeed` and crush =
  `enemyCrushPerInk * N` (the boss crushes with the `N` of the union drawing).
- Effect: a blunt touch of an enemy copy costs the hero `(bluntDamage +
  crush) * enemyDamageMult * stakeDamageMult[k]`. Examples for the 210-cell
  block: wave 3 at x1 (scale 0.92) 0.79 per touch, at x2 (scale 1.84) 2.58;
  version 2 had 0.48 and 0.72. A 13-cell dot gains at most 0.13.
- Enemy top speeds at x1, old -> new: 13-cell dot 17.6 -> 17.4, 20-cell
  needle 16.3 -> 16.3, 210-cell block 5.2 -> 7.3 (8.7 at x2). Heavy drawings
  stay the slowest enemies.
- Everything else in `solo.js` is unchanged: copies, wave scale, enemy
  armour, drops, throw, shots, upgrades, boss drawing, end checks.

### V6. Tuning file

- `version`: `ink-tuning-2` -> `ink-tuning-3`; `note` rewritten.
- New keys: `physics.crowdRelaxPasses` 4, `solo.enemySpeedBase` 3,
  `solo.enemyCrushPerInk` 0.004.
- Changed values: `physics.extraSeparationPasses` 2 -> 8,
  `solo.enemySpeedMult` 0.55 -> 0.45.
- No key removed, no other value changed.

### V7. Golden files and tools

- `Shared/golden/stat_vectors.json`: only `tuningVersion` changed; every
  expected value is as in version 2 (the template fields `turnCos` and
  `turnSin` were never in it).
- `Shared/golden/sim_traces.json`: regenerated with the same 17 traces.
  Changed (10): the four Ring traces with three or four seats and contact
  (`ring_3_star_wedge_needle`, `ring_4_disc_star_comb_dot`,
  `ring_4_one_scripted_seat`, `ring_4_circlers`) and all six solo traces.
  Byte-identical to version 2 (7): the six duel traces and
  `ring_3_simultaneous_nearest_wins` (nobody touches). A port can therefore
  check V2 with the duel traces first, then V3 with the crowd traces, then V4
  and V5 with the solo traces. Replace the whole file (the header carries the
  new `tuningVersion`).
- Tests: 70 (version 2: 65). New: simultaneous knock-out by armour (R3), comb
  against comb, a four-figure crowd, the crowd relaxation (positions only,
  duels untouched), the solo crush and speed (R1).
- Simulation tools (not part of a port): `sim/overlap_probe.js` also measures
  teeth pairs and random four-figure rounds; `sim/balance.js` has the heavy
  blunt enemy designs (block, disc, ring, 2-wide hoop) in the solo smoke
  field and reports them as a group; `sim/solo_smoke.js` can run a part of
  the field; new `sim/lever_run.js` (one bot style of the Ring balance run
  for one tuning candidate).

## C. What the browser app has to change

- [ ] Rebuild with the new core and the new `ink_tuning.json`
      (`ink-tuning-3`); nothing in the public functions changed, so no call
      has to change.
- [ ] If the app shows what a stake does (the stake buttons read
      `stakeSpeedMult` and `stakeDamageMult`): the speed factor is still
      right. Add one line for the new part, for example "heavy enemies hit
      harder at higher stakes": the blunt touch of a copy is now
      `(bluntDamage + soloEnemyCrush(...)) * enemyDamageMult *
      stakeDamageMult[k]`.
- [ ] If the app shows an enemy speed anywhere, use `soloEnemySpeed(tuning,
      fig, stakeIndex)` instead of `topSpeed * enemySpeedMult *
      stakeSpeedMult[k]`.
- [ ] Nothing to draw for the crowd relaxation; figures in a pile simply sit
      inside each other less often.
- [ ] If the app reads `fig.turnCos` or `fig.turnSin` (it did not at the
      version 2 merge), stop.

## D. What the C# port has to change

- [ ] `InkPhysics` step: add the crowd relaxation of V3 after the pair loop
      of every sub-step, with the `n > 2` condition on the number of bodies
      in the world, the same loop order and the same early stop; add
      `RelaxPair` with the six lines of V3 in that order.
- [ ] Body: add `BluntBonus` (double, 0 by default); `TouchDamage` adds it to
      the blunt damage before the comparison with the sharpness (V4).
- [ ] Solo: add `SoloEnemySpeed` and `SoloEnemyCrush` with the operation
      order of V5; in the enemy spawn pass speed factor 1 to the body
      constructor and then set the top speed and the blunt bonus; boss and
      escorts with scale 1 and stake index 0.
- [ ] Tuning: read the new keys `physics.crowdRelaxPasses`,
      `solo.enemySpeedBase`, `solo.enemyCrushPerInk`; regenerate the embedded
      tuning text (`InkGenerated.cs`) from `ink-tuning-3`.
- [ ] If the template has `TurnCos` / `TurnSin`, remove them (V1).
- [ ] The state hash is unchanged (layout 2). Replace both golden files and
      run the core tests: the stat vectors must pass without a code change;
      the traces need V2 to V5.
