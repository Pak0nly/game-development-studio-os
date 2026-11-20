# Inkweight Core API Note

Engine-free game core in plain JavaScript (ES modules, no dependencies). It
runs unchanged in Node 22 and in a browser. The core never reads files, clocks
or `Math.random`; it receives the parsed tuning object
(`../../Shared/ink_tuning.json`) as an argument. The exact algorithms are in
[`../../Shared/RULES_AS_BUILT.md`](../../Shared/RULES_AS_BUILT.md).

Everything beyond `INK_RULES_V1.md` is a prototype proposal. This note
describes core version 3 (Work Order INK-CORE-V3, tuning `ink-tuning-3`). What
changed against version 1, function by function, is in
[`../../Shared/CHANGES_V2.md`](../../Shared/CHANGES_V2.md), what changed from
version 2 to version 3 in
[`../../Shared/CHANGES_V3.md`](../../Shared/CHANGES_V3.md); the rules in plain
words are in `Projects/Inkweight/Docs/INK_RULES_V2.md`.

## Modules

| File | Content |
|---|---|
| `index.js` | re-exports everything below |
| `rng.js` | seeded xorshift32 generator: `rngCreate(seed)`, `rngDerive(seed, index)`, `rngU32(r)`, `rngInt(r, n)`, `rngFloat(r)` |
| `drawing.js` | `parseDrawing(rows)`, `drawingToRows(cells, W, H)`, `emptyDrawing(W, H)`, `extractBody(cells, W, H)`, `countNeighbours(...)`, `isSharpCell(body, W, H, x, y)`, `countEnclosed(body, W, H)`, `computeStats(cells, W, H, tuning, kind, budget)`, `elementMultiplier(tuning, attacker, defender)` |
| `physics.js` | `buildFigure(cells, W, H, tuning, kind, budget)`, `createBody(fig, x, y, fx, fy, team, armourMult, speedMult, damageMult)`, `createWorld(bodies, wallRadius)`, `stepWorld(world, inputs, tuning)`, `cellWorldX(body, k)`, `cellWorldY(body, k)` |
| `ring.js` | `ringCreateMatch(tuning, seatCount, seed)`, `ringInkBudget(tuning, match, seat)`, `ringRadiusAt(tuning, seatCount, tick)`, `ringCheckFigure(tuning, match, seat, fig)`, `ringStartRound(tuning, match, figures)`, `ringStep(tuning, match, inputs)` |
| `solo.js` | `soloCreateRun(...)`, `soloCheckDrawing(...)`, `soloCopies(...)`, `soloDropValue(tuning, waveIndex, stakeIndex, N)`, `soloThrowIntervalTicks(...)`, `soloStartWave(...)`, `soloBossCells(run)`, `soloStartBoss(...)`, `soloUpgrade(...)`, `soloStep(tuning, run, input)`, `SOLO_WAVES` |
| `bots.js` | `botRingInput(tuning, match, seat)`, `ringBotInputs(tuning, match, humanInputs)`, `botEnemyInput(tuning, run, index)`, `botHeroInput(tuning, run, style)` |
| `hash.js` | `hashRing(match)`, `hashSolo(run)`, `hashCreate()`, `hashDouble(st, v)`, `hashHex(st)` |

Outside the core: `../tools/load_tuning.js` (Node file reading),
`../tools/gen_golden.js` (golden files), `../sim/` (archetypes, runners,
balance simulation), `../tests/` (`node --test`).

## Data

**Drawing:** flat array `cells` of `W * H` integers (32 x 32), index
`y * W + x`. 0 empty, 1 Black, 2 Ember, 3 Tide, 4 Moss. Row 0 is the front.

**Stats** (`computeStats`): `{ kind, budget, filled, drips, N, C, S, enclosed,
P, pocketCells, push, colourCounts: [black, ember, tide, moss], element (0 neutral or 2/3/4),
bigEnough, withinBudget, valid, weight, armour, sharpness, topSpeed, cx, cy,
radius, inertia }`. Use it for the live stat display while drawing. `S` counts
the blade cells (ink one cell thick), `P` the pocket cells (enclosed space),
`enclosed` all enclosed empty cells, `pocketCells` the pocket cells that
count, `push` the push weight (the mass of collisions). Real ranges of valid
figure drawings up to 220 ink, for stat bars: armour 63.6 to about 290,
sharpness 1.0 to 4.52 (bar end 4.7), weight 12 to 220, push weight `N` to
`1.1 * N`, top speed 9.2 to 32.4.

**Figure template** (`buildFigure`, immutable, shared by all bodies of one
drawing): `{ stats, W, H, cx, cy, count, lx[], ly[], sharp[], colour[],
boundary[], grid[], radius, mass, accelK, turnRate }`
(`mass` is `stats.push`; version 3 removed the unused `turnCos`/`turnSin`).
`lx/ly` are cell centres relative to the centroid, in ascending cell index.
`grid[y * W + x]` is the cell number or -1. `boundary` lists the cells that are
not core cells.

**Body** (`createBody`): `{ fig, team, x, y, vx, vy, fx, fy, hp, maxHp, alive,
topSpeed, damageMult, bluntBonus, dashTicks, dashCd, dashDx, dashDy, turning,
turnDx, turnDy }` (the last three are scratch values of the running tick;
`bluntBonus` is added to the blunt damage of the body's touches, 0 except
for solo enemy copies). `(fx, fy)` is the unit front
vector; a body with front `(0, -1)` looks exactly like its canvas. To draw a
cell use `cellWorldX/Y`, or rotate the whole sprite by the front vector.

**World:** `{ bodies, cd, events, wallRadius, subSteps }`. `subSteps` is the
number of parts the last tick was cut into (1 to `physics.maxSubSteps`).
`events` holds what happened in the last tick: `{ type: 'hit', from, to,
damage, sharp }`, `{ type: 'ram', from, to }` (a dash of `from` ended by
touching `to`), in Ring also
`{ type: 'out', seat, reason }`, in Solo also `throw`, `shotHit`, `enemyDown`,
`pickup`. Read them right after the step; they are cleared by the next step.

**Input:** `{ mx, my, dash }` per seat and tick. `(mx, my)` is the stick
(length above 1 is clamped), world axes: x right, y down. `dash` is a boolean.

## Driving a Ring match

```js
import * as core from './core/index.js';
const tuning = await (await fetch('../Shared/ink_tuning.json')).json();

const match = core.ringCreateMatch(tuning, seatCount, seed);       // phase 'draw'
// optional: match.botStyle[seat] = 1 makes that seat's bot a circler (0 = rusher, the default)
// drawing phase: budget per seat = core.ringInkBudget(tuning, match, seat)
//   stats = core.computeStats(cells, 32, 32, tuning, 'figure', budget); need stats.valid
//   core.ringCheckFigure(tuning, match, seat, figure) returns '' | 'tooSmall' | 'overBudget';
//   ringStartRound throws for a figure that fails it (also for a figure kept from an
//   earlier match that was drawn with catch-up ink the seat no longer has)
const figures = drawings.map((cells, seat) =>
  core.buildFigure(cells, 32, 32, tuning, 'figure', core.ringInkBudget(tuning, match, seat)));
core.ringStartRound(tuning, match, figures);                        // phase 'fight'
// fixed timestep: call exactly tuning.physics.tickRate times per second
const inputs = core.ringBotInputs(tuning, match, humanInputs);      // humanInputs[seat] = input or null for a bot
core.ringStep(tuning, match, inputs);
// match.phase becomes 'roundOver' (draw again, start the next round) or 'matchOver'
```

Match fields: `seatCount, round, wins[], lost[], phase, tick, ringRadius,
world, roundWinner, matchWinner, outTick[], outReason[], botRng[],
botWobble[], botStyle[]`. Body `i` of
`match.world.bodies` belongs to seat `i`.

## Driving a Solo run

```js
const run = core.soloCreateRun(tuning, seed, heroCells, weaponCells, 32, 32, startColour); // throws if invalid
core.soloStartWave(tuning, run, enemyCells, stakeIndex);   // stakeIndex 0, 1, 2 -> tuning.solo.stakes; throws on any other value
// preview for the stake buttons: core.soloCopies(tuning, run.wave, stakeIndex, N) copies, each drop worth
//   core.soloDropValue(tuning, run.wave, stakeIndex, N) ink; enemy damage x tuning.solo.stakeDamageMult[stakeIndex],
//   enemy speed core.soloEnemySpeed(tuning, fig, stakeIndex) cells per second, enemy armour
//   core.soloEnemyArmour(tuning, fig, scale) with scale = core.soloWaveArmourScale(tuning, run.wave, stakeIndex, N),
//   extra blunt damage by weight core.soloEnemyCrush(tuning, fig, scale, stakeIndex)
core.soloStep(tuning, run, heroInput);                      // every tick while run.phase === 'fight'
// 'cleared': optional core.soloUpgrade(tuning, run, kind, payload), then the next wave;
//            when run.wave === core.SOLO_WAVES call core.soloStartBoss(tuning, run)
// 'dead' (run.endReason 'armour' or 'time') or 'won' end the run
```

Run fields: `phase, endReason, wave, heroBudget, weaponBudget, colours[5],
heroFig, weaponFig, heroHp, heroMaxHp, wallet, score, world, shots[]
({ x, y, ux, uy, speed, life }), drops[] ({ x, y, value, life }), events, tick,
copies, stake, stakeIndex, dropValue, upgradeTaken`. Body 0 is the hero. Check drawings before use with
`soloCheckDrawing(tuning, run, cells, 32, 32, 'hero' | 'weapon' | 'enemy')`.

## Determinism

- Fixed timestep, `tuning.physics.tickRate` ticks per second. All durations in
  the tuning file are whole ticks.
- Only `+ - * /`, `Math.sqrt`, `Math.floor` (exact) and 32-bit integer
  arithmetic (`Math.imul`, shifts) are used. No trigonometry: rotation is the
  unit front vector. A test enforces this list.
- All randomness comes from `rng.js`. Ring bots use one generator per seat
  (`match.botRng[seat]`); the solo run uses `run.rng` for spawn positions and
  enemy dashes.
- Loop orders are part of the contract (cells by ascending index, bodies by
  index, pairs `i < j`). Do not reorder floating-point sums in a port.
- A C# port must not use `float`, `Math.FusedMultiplyAdd` or vector types for
  these sums; plain `double` expressions in the same order give the same bits.

## Golden files (`../../Shared/golden/`)

Regenerate with `node tools/gen_golden.js`; `node tools/gen_golden.js --check`
compares. Both files are one JSON object with a header and `items`, one item
per line. Compare parsed numbers, not text (number formatting differs between
languages).

- `stat_vectors.json`: `items[i] = { name, kind, note, budget, rows, expect }`.
  Parse `rows`, call the port's `buildFigure(cells, 32, 32, tuning, kind,
  budget)` and compare every field of `expect` exactly.
- `sim_traces.json`: header field `drawings` maps archetype names to rows.
  - Ring item: `seed`, `seats` (drawing names), `control` (`bot` or `script`
    per seat), `botStyle` (per seat, set on `match.botStyle` right after
    `ringCreateMatch`), `covers` (what the trace is for), `scripts[seat] = [[fromTick, mx, my, dash], ...]` (the last
    segment with `fromTick <= match.tick` applies, evaluated before the step),
    `maxRounds`, `maxTicksPerRound`, `rounds`, `final`, `checkpoints`. The same
    figures (default budget) are used in every round. A checkpoint is
    `{ round, tick, hash, ringRadius, bodies: [[x, y, vx, vy, fx, fy, hp,
    alive]] }`, taken at round start, after every step whose tick is a multiple
    of `checkpointEvery`, and after the last step of a round.
  - Solo item: `seed`, `hero`, `weapon` (both recoloured black), `heroBot`
    (`kite` = style 0, `brawl` = style 1), `waves: [{ enemy, stake, upgrade }]`
    (`upgrade` is tried after the wave: `heal`, `colour2/3/4`,
    `heroInk:<drawing>` or `weaponInk:<drawing>` (redraw with that drawing
    recoloured black) or null), `boss`, `tuningOverrides` (tuning paths
    replaced for this trace only; empty for all traces but `solo_time_limit`),
    `fights` (each with `upgrade`: `ok`, empty or the refusal reason),
    `final`, `checkpoints` (`{ fight, tick, hash, hero,
    enemiesAlive, shots, drops, wallet, score }`). The reference driver is
    `playSoloRun` in `../sim/runner.js`.
  - `hash` is the 32-bit FNV-1a value of `hash.js` over the IEEE-754 bytes of
    the listed state values (layout 2, see the comments in `hash.js` and
    `CHANGES_V2.md`; unchanged in version 3); equal hashes mean bit-identical
    state.
  - Branch coverage of the traces: sudden death (`ring_1v1_sudden_death`),
    simultaneous knock-out with an exact tie and by distance
    (`ring_2_idle_simultaneous_tie`, `ring_3_simultaneous_nearest_wins`),
    circler bots, hero death, the solo time limit, and the hero-ink and
    weapon-ink upgrades.

## Commands

```text
cd Projects/Inkweight/Source/WebPrototype
node --test                       # all tests
node tools/gen_golden.js          # rewrite the golden files after a tuning change
node sim/balance.js --out DIR     # balance report (Markdown and JSON), three bot configurations
node sim/sweep.js FILE.json       # compare tuning candidates (see the file header)
node sim/solo_smoke.js            # solo smoke run alone (--heavy: only the heavy blunt enemy designs)
node sim/lever_run.js --style rusher --label NAME --out FILE.json   # one bot style for one tuning candidate
node sim/show_stats.js            # stat line of every archetype
node sim/readability.js           # stat table of beginner drawings (Markdown)
node sim/overlap_probe.js         # how deep bodies sit inside each other (duels, teeth pairs, four-figure crowds)
node sim/style_check.js           # how often a rusher bot beats a circler bot
node sim/tune_search.js 200 1     # random search over tuning numbers (rusher bots only)
```
