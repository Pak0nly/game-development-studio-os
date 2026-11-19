// Golden file generator.
//   node tools/gen_golden.js          writes Shared/golden/*.json
//   node tools/gen_golden.js --check  exits 1 when the files on disk differ
// The texts are built by pure functions so the tests can compare bytes.

import { readFileSync, writeFileSync } from 'node:fs';
import {
  buildFigure, drawingToRows, ringCreateMatch, ringStartRound, ringStep, ringBotInputs, hashRing, hashSolo,
} from '../core/index.js';
import { W, H, archetype, recolour } from '../sim/archetypes.js';
import { playSoloRun } from '../sim/runner.js';
import { goldenCases } from './golden_cases.js';
import { loadTuning, SHARED_DIR } from './load_tuning.js';

export const STAT_PATH = SHARED_DIR + 'golden/stat_vectors.json';
export const TRACE_PATH = SHARED_DIR + 'golden/sim_traces.json';

function lines(header, items) {
  return header.slice(0, -1) + ',\n"items":[\n' + items.map((x) => JSON.stringify(x)).join(',\n') + '\n]}\n';
}

export function buildStatVectorsText(tuning) {
  const items = goldenCases().map((c) => {
    const fig = buildFigure(c.cells, c.W, c.H, tuning, c.kind, c.budget);
    const s = fig.stats;
    return {
      name: c.name, kind: c.kind, note: c.note,
      budget: s.budget,
      rows: drawingToRows(c.cells, c.W, c.H),
      expect: {
        filled: s.filled, drips: s.drips, N: s.N, C: s.C, S: s.S,
        colourCounts: s.colourCounts, element: s.element,
        bigEnough: s.bigEnough, withinBudget: s.withinBudget, valid: s.valid,
        weight: s.weight, armour: s.armour, sharpness: s.sharpness, topSpeed: s.topSpeed,
        cx: s.cx, cy: s.cy, radius: s.radius, inertia: s.inertia,
        boundaryCells: fig.boundary.length, turnRate: fig.turnRate, accelK: fig.accelK,
      },
    };
  });
  const header = JSON.stringify({
    file: 'Inkweight golden stat vectors',
    tuningVersion: tuning.version,
    note: 'rows: 32 strings of 32 characters, "." empty, 1 Black, 2 Ember, 3 Tide, 4 Moss. element: 0 neutral or the colour number. Doubles must match exactly (compare parsed values, not text).',
  });
  return lines(header, items);
}

function scriptInput(script, tick) {
  let seg = script[0];
  for (let i = 0; i < script.length; i++) if (script[i][0] <= tick) seg = script[i];
  return { mx: seg[1], my: seg[2], dash: seg[3] === 1 };
}

function bodyRow(b) { return [b.x, b.y, b.vx, b.vy, b.fx, b.fy, b.hp, b.alive ? 1 : 0]; }

// def: { name, seed, seats: [archetype names], scripts: { seat: segments }, maxRounds, maxTicksPerRound }
function ringTrace(tuning, def, every) {
  const figs = def.seats.map((n) => buildFigure(archetype(n).cells, W, H, tuning, 'figure'));
  const match = ringCreateMatch(tuning, figs.length, def.seed);
  const checkpoints = [];
  const rounds = [];
  const snap = () => checkpoints.push({ round: match.round, tick: match.tick, hash: hashRing(match), ringRadius: match.ringRadius, bodies: match.world.bodies.map(bodyRow) });
  while (match.phase !== 'matchOver' && match.round < def.maxRounds) {
    ringStartRound(tuning, match, figs);
    snap();
    while (match.phase === 'fight' && match.tick < def.maxTicksPerRound) {
      const human = [];
      for (let s = 0; s < figs.length; s++) human.push(def.scripts[s] ? scriptInput(def.scripts[s], match.tick) : null);
      ringStep(tuning, match, ringBotInputs(tuning, match, human));
      if (match.tick % every === 0 || match.phase !== 'fight') snap();
    }
    rounds.push({ round: match.round, ticks: match.tick, phase: match.phase, winner: match.roundWinner, outTick: match.outTick.slice(), outReason: match.outReason.slice() });
    if (match.phase === 'fight') break; // tick limit reached (scripted traces only)
  }
  return {
    name: def.name, mode: 'ring', seed: def.seed, seats: def.seats,
    control: def.seats.map((_, s) => (def.scripts[s] ? 'script' : 'bot')),
    scripts: def.scripts, maxRounds: def.maxRounds, maxTicksPerRound: def.maxTicksPerRound,
    checkpointEvery: every,
    rounds,
    final: { phase: match.phase, wins: match.wins, lost: match.lost, matchWinner: match.matchWinner },
    checkpoints,
  };
}

// def: { name, seed, hero, weapon, heroBot, waves: [{ enemy, stake, upgrade }], boss }
function soloTrace(tuning, def, every) {
  const checkpoints = [];
  let fight = 0;
  const snap = (run) => {
    const h = run.world.bodies[0];
    let alive = 0;
    for (let i = 1; i < run.world.bodies.length; i++) if (run.world.bodies[i].alive) alive++;
    checkpoints.push({ fight, tick: run.tick, hash: hashSolo(run), hero: [h.x, h.y, h.vx, h.vy, h.fx, h.fy, h.hp], enemiesAlive: alive, shots: run.shots.length, drops: run.drops.length, wallet: run.wallet, score: run.score });
  };
  const plan = {
    style: def.heroBot === 'brawl' ? 1 : 0, boss: def.boss,
    waves: def.waves.map((w) => ({ enemy: archetype(w.enemy).cells, stake: w.stake, upgrade: w.upgrade })),
  };
  const hero = recolour(archetype(def.hero).cells, 1);
  const weapon = recolour(archetype(def.weapon).cells, 1);
  const r = playSoloRun(tuning, def.seed, hero, weapon, W, H, 0, plan,
    (run) => { if (run.tick % every === 0 || run.phase !== 'fight') snap(run); },
    () => { fight++; });
  const run = r.run;
  return {
    name: def.name, mode: 'solo', seed: def.seed,
    hero: def.hero, weapon: def.weapon, heroAndWeaponRecolouredBlack: true, startColour: 0,
    heroBot: def.heroBot, waves: def.waves, boss: def.boss,
    checkpointEvery: every,
    fights: r.results,
    final: { phase: run.phase, endReason: run.endReason, wave: run.wave, score: run.score, wallet: run.wallet, heroHp: run.heroHp },
    checkpoints,
  };
}

export function buildSimTracesText(tuning) {
  const every = 120;
  const names = ['disc', 'block', 'ring', 'cross', 'star', 'lance', 'line', 'comb', 'shield', 'dot', 'hedgehog', 'wedge', 'frame', 'needle'];
  const drawings = {};
  for (const n of names) drawings[n] = drawingToRows(archetype(n).cells, W, H);
  const items = [
    ringTrace(tuning, { name: 'ring_1v1_disc_lance', seed: 11, seats: ['disc', 'lance'], scripts: {}, maxRounds: 9, maxTicksPerRound: 100000 }, every),
    ringTrace(tuning, { name: 'ring_1v1_cross_block', seed: 12, seats: ['cross', 'block'], scripts: {}, maxRounds: 9, maxTicksPerRound: 100000 }, every),
    ringTrace(tuning, {
      name: 'ring_1v1_scripted', seed: 13, seats: ['hedgehog', 'wedge'], maxRounds: 1, maxTicksPerRound: 1500,
      scripts: {
        0: [[0, 1, 0, 0], [50, 1, 0.5, 1], [200, 0.3, -1, 0], [420, -1, -0.25, 1], [700, 0, 0, 0], [800, 0.5, 0.5, 1]],
        1: [[0, -1, 0, 0], [80, -0.6, -0.8, 0], [90, -1, 0, 1], [300, 0, 1, 0], [520, 2, 2, 1], [900, -1, 0.1, 0]],
      },
    }, every),
    ringTrace(tuning, { name: 'ring_3_star_wedge_needle', seed: 14, seats: ['star', 'wedge', 'needle'], scripts: {}, maxRounds: 12, maxTicksPerRound: 100000 }, every),
    ringTrace(tuning, { name: 'ring_4_disc_star_comb_dot', seed: 15, seats: ['disc', 'star', 'comb', 'dot'], scripts: {}, maxRounds: 12, maxTicksPerRound: 100000 }, every),
    ringTrace(tuning, {
      name: 'ring_4_one_scripted_seat', seed: 16, seats: ['frame', 'ring', 'shield', 'line'], maxRounds: 2, maxTicksPerRound: 100000,
      scripts: { 0: [[0, 0, 1, 0], [120, 1, 0, 1], [240, 0, -1, 0], [360, -1, 0, 1], [480, 0.7, 0.7, 0]] },
    }, every),
    soloTrace(tuning, { name: 'solo_kite_two_waves', seed: 21, hero: 'disc', weapon: 'needle', heroBot: 'kite', boss: false, waves: [{ enemy: 'dot', stake: 2, upgrade: 'heal' }, { enemy: 'needle', stake: 0, upgrade: null }] }, every),
    soloTrace(tuning, {
      name: 'solo_brawl_full_run', seed: 22, hero: 'hedgehog', weapon: 'dot', heroBot: 'brawl', boss: true,
      waves: [{ enemy: 'dot', stake: 0, upgrade: 'colour2' }, { enemy: 'line', stake: 1, upgrade: 'heal' }, { enemy: 'frame', stake: 0, upgrade: 'heal' }, { enemy: 'cross', stake: 2, upgrade: 'heal' }, { enemy: 'star', stake: 0, upgrade: 'heal' }],
    }, every),
  ];
  const header = JSON.stringify({
    file: 'Inkweight golden simulation traces',
    tuningVersion: tuning.version,
    note: 'Ring: seats name drawings; control bot = botRingInput, script = segments [fromTick, mx, my, dash] by round tick (the last segment with fromTick <= tick applies). bodies rows: [x, y, vx, vy, fx, fy, hp, alive]. Solo: bot hero, hero and weapon recoloured black. hash: see core/hash.js. Checkpoints are taken after the step that reaches the tick, plus one at round start (tick 0) and one at the end of every round or fight.',
    drawings,
  });
  return lines(header, items);
}

function main() {
  const tuning = loadTuning();
  const stat = buildStatVectorsText(tuning);
  const trace = buildSimTracesText(tuning);
  if (process.argv.includes('--check')) {
    const ok = readFileSync(STAT_PATH, 'utf8') === stat && readFileSync(TRACE_PATH, 'utf8') === trace;
    console.log(ok ? 'golden files match' : 'golden files DIFFER');
    process.exit(ok ? 0 : 1);
  }
  writeFileSync(STAT_PATH, stat);
  writeFileSync(TRACE_PATH, trace);
  console.log('wrote ' + STAT_PATH + ' (' + stat.length + ' bytes)');
  console.log('wrote ' + TRACE_PATH + ' (' + trace.length + ' bytes)');
}

if (process.argv[1] && process.argv[1].endsWith('gen_golden.js')) main();
