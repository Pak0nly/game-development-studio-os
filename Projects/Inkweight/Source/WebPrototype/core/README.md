# Inkweight Core API Note

Engine-free game core in plain JavaScript (ES modules, no dependencies). It
runs unchanged in Node 22 and in a browser. The core never reads files, clocks
or `Math.random`; it receives the parsed tuning object
(`../../Shared/ink_tuning.json`) as an argument. The exact algorithms are in
[`../../Shared/RULES_AS_BUILT.md`](../../Shared/RULES_AS_BUILT.md).

Everything beyond `INK_RULES_V1.md` is a prototype proposal.

## Modules

| File | Content |
|---|---|
| `index.js` | re-exports everything below |
| `rng.js` | seeded xorshift32 generator: `rngCreate(seed)`, `rngDerive(seed, index)`, `rngU32(r)`, `rngInt(r, n)`, `rngFloat(r)` |
| `drawing.js` | `parseDrawing(rows)`, `drawingToRows(cells, W, H)`, `emptyDrawing(W, H)`, `extractBody(cells, W, H)`, `countNeighbours(...)`, `computeStats(cells, W, H, tuning, kind, budget)`, `elementMultiplier(tuning, attacker, defender)` |
| `physics.js` | `buildFigure(cells, W, H, tuning, kind, budget)`, `createBody(fig, x, y, fx, fy, team, armourMult, speedMult, damageMult)`, `createWorld(bodies, wallRadius)`, `stepWorld(world, inputs, tuning)`, `cellWorldX(body, k)`, `cellWorldY(body, k)` |
| `ring.js` | `ringCreateMatch(tuning, seatCount, seed)`, `ringInkBudget(tuning, match, seat)`, `ringRadiusAt(tuning, seatCount, tick)`, `ringStartRound(tuning, match, figures)`, `ringStep(tuning, match, inputs)` |
| `solo.js` | `soloCreateRun(...)`, `soloCheckDrawing(...)`, `soloCopies(...)`, `soloThrowIntervalTicks(...)`, `soloStartWave(...)`, `soloBossCells(run)`, `soloStartBoss(...)`, `soloUpgrade(...)`, `soloStep(tuning, run, input)`, `SOLO_WAVES` |
| `bots.js` | `botRingInput(tuning, match, seat)`, `ringBotInputs(tuning, match, humanInputs)`, `botEnemyInput(tuning, run, index)`, `botHeroInput(tuning, run, style)` |
| `hash.js` | `hashRing(match)`, `hashSolo(run)`, `hashCreate()`, `hashDouble(st, v)`, `hashHex(st)` |

Outside the core: `../tools/load_tuning.js` (Node file reading),
`../tools/gen_golden.js` (golden files), `../sim/` (archetypes, runners,
balance simulation), `../tests/` (`node --test`).

## Data

**Drawing:** flat array `cells` of `W * H` integers (32 x 32), index
`y * W + x`. 0 empty, 1 Black, 2 Ember, 3 Tide, 4 Moss. Row 0 is the front.

**Stats** (`computeStats`): `{ kind, budget, filled, drips, N, C, S,
colourCounts: [black, ember, tide, moss], element (0 neutral or 2/3/4),
bigEnough, withinBudget, valid, weight, armour, sharpness, topSpeed, cx, cy,
radius, inertia }`. Use it for the live stat display while drawing.

**Figure template** (`buildFigure`, immutable, shared by all bodies of one
drawing): `{ stats, W, H, cx, cy, count, lx[], ly[], sharp[], colour[],
boundary[], grid[], radius, mass, accelK, turnRate, turnCos, turnSin }`.
`lx/ly` are cell centres relative to the centroid, in ascending cell index.
`grid[y * W + x]` is the cell number or -1. `boundary` lists the cells that are
not core cells.

**Body** (`createBody`): `{ fig, team, x, y, vx, vy, fx, fy, hp, maxHp, alive,
topSpeed, damageMult, dashTicks, dashCd, dashDx, dashDy }`. `(fx, fy)` is the unit front
vector; a body with front `(0, -1)` looks exactly like its canvas. To draw a
cell use `cellWorldX/Y`, or rotate the whole sprite by the front vector.

**World:** `{ bodies, cd, events, wallRadius }`. `events` holds what happened
in the last tick: `{ type: 'hit', from, to, damage, sharp }`, in Ring also
`{ type: 'out', seat, reason }`, in Solo also `throw`, `shotHit`, `enemyDown`,
`pickup`. Read them right after the step; they are cleared by the next step.

**Input:** `{ mx, my, dash }` per seat and tick. `(mx, my)` is the stick
(length above 1 is clamped), world axes: x right, y down. `dash` is a boolean.

## Driving a Ring match

```js
import * as core from './core/index.js';
const tuning = await (await fetch('../Shared/ink_tuning.json')).json();

const match = core.ringCreateMatch(tuning, seatCount, seed);       // phase 'draw'
// drawing phase: budget per seat = core.ringInkBudget(tuning, match, seat)
//   stats = core.computeStats(cells, 32, 32, tuning, 'figure', budget); need stats.valid
const figures = drawings.map((cells, seat) =>
  core.buildFigure(cells, 32, 32, tuning, 'figure', core.ringInkBudget(tuning, match, seat)));
core.ringStartRound(tuning, match, figures);                        // phase 'fight'
// fixed timestep: call exactly tuning.physics.tickRate times per second
const inputs = core.ringBotInputs(tuning, match, humanInputs);      // humanInputs[seat] = input or null for a bot
core.ringStep(tuning, match, inputs);
// match.phase becomes 'roundOver' (draw again, start the next round) or 'matchOver'
```

Match fields: `seatCount, round, wins[], lost[], phase, tick, ringRadius,
world, roundWinner, matchWinner, outTick[], outReason[]`. Body `i` of
`match.world.bodies` belongs to seat `i`.

## Driving a Solo run

```js
const run = core.soloCreateRun(tuning, seed, heroCells, weaponCells, 32, 32, startColour); // throws if invalid
core.soloStartWave(tuning, run, enemyCells, stakeIndex);   // stakeIndex 0, 1, 2 -> tuning.solo.stakes
core.soloStep(tuning, run, heroInput);                      // every tick while run.phase === 'fight'
// 'cleared': optional core.soloUpgrade(tuning, run, kind, payload), then the next wave;
//            when run.wave === core.SOLO_WAVES call core.soloStartBoss(tuning, run)
// 'dead' (run.endReason 'armour' or 'time') or 'won' end the run
```

Run fields: `phase, endReason, wave, heroBudget, weaponBudget, colours[5],
heroFig, weaponFig, heroHp, heroMaxHp, wallet, score, world, shots[]
({ x, y, ux, uy, speed, life }), drops[] ({ x, y, value, life }), events, tick,
copies, stake`. Body 0 is the hero. Check drawings before use with
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
    per seat), `scripts[seat] = [[fromTick, mx, my, dash], ...]` (the last
    segment with `fromTick <= match.tick` applies, evaluated before the step),
    `maxRounds`, `maxTicksPerRound`, `rounds`, `final`, `checkpoints`. The same
    figures (default budget) are used in every round. A checkpoint is
    `{ round, tick, hash, ringRadius, bodies: [[x, y, vx, vy, fx, fy, hp,
    alive]] }`, taken at round start, after every step whose tick is a multiple
    of `checkpointEvery`, and after the last step of a round.
  - Solo item: `seed`, `hero`, `weapon` (both recoloured black), `heroBot`
    (`kite` = style 0, `brawl` = style 1), `waves: [{ enemy, stake, upgrade }]`
    (`upgrade` is tried after the wave: `heal`, `colour2/3/4` or null),
    `boss`, `fights`, `final`, `checkpoints` (`{ fight, tick, hash, hero,
    enemiesAlive, shots, drops, wallet, score }`). The reference driver is
    `playSoloRun` in `../sim/runner.js`.
  - `hash` is the 32-bit FNV-1a value of `hash.js` over the IEEE-754 bytes of
    the listed state values; equal hashes mean bit-identical state.

## Commands

```text
cd Projects/Inkweight/Source/WebPrototype
node --test                       # all tests
node tools/gen_golden.js          # rewrite the golden files after a tuning change
node sim/balance.js --out DIR     # balance report (Markdown and JSON)
node sim/tune_search.js 200 1     # random search over tuning numbers
```
