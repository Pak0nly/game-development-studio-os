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
import { loadTuning, applyOverrides, SHARED_DIR } from './load_tuning.js';

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
        filled: s.filled, drips: s.drips, N: s.N, C: s.C, S: s.S, enclosed: s.enclosed, P: s.P, pocketCells: s.pocketCells, push: s.push,
        colourCounts: s.colourCounts, element: s.element,
        bigEnough: s.bigEnough, withinBudget: s.withinBudget, valid: s.valid,
        weight: s.weight, armour: s.armour, sharpness: s.sharpness, topSpeed: s.topSpeed,
        cx: s.cx, cy: s.cy, radius: s.radius, inertia: s.inertia,
        boundaryCells: fig.boundary.length, turnRate: fig.turnRate, accelK: fig.accelK, mass: fig.mass,
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

// def: { name, seed, seats: [archetype names], scripts: { seat: segments }, maxRounds, maxTicksPerRound,
//        styles: bot style per seat (optional, default all 0), every: checkpoint spacing (optional) }
function ringTrace(tuning, def, everyDefault) {
  const every = def.every || everyDefault;
  const figs = def.seats.map((n) => buildFigure(archetype(n).cells, W, H, tuning, 'figure'));
  const match = ringCreateMatch(tuning, figs.length, def.seed);
  const styles = def.styles || def.seats.map(() => 0);
  for (let s = 0; s < figs.length; s++) match.botStyle[s] = styles[s];
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
    botStyle: styles,
    covers: def.covers || '',
    scripts: def.scripts, maxRounds: def.maxRounds, maxTicksPerRound: def.maxTicksPerRound,
    checkpointEvery: every,
    rounds,
    final: { phase: match.phase, wins: match.wins, lost: match.lost, matchWinner: match.matchWinner },
    checkpoints,
  };
}

// def: { name, seed, hero, weapon, heroBot, waves: [{ enemy, stake, upgrade }], boss,
//        tuningOverrides (optional): { 'solo.waveMaxTicks': 900 } applied to a copy of the tuning for this trace only,
//        every (optional) }
// upgrade: null | 'heal' | 'colour2..4' | 'heroInk:<archetype>' | 'weaponInk:<archetype>' (the drawing recoloured black).
function soloTrace(baseTuning, def, everyDefault) {
  const every = def.every || everyDefault;
  const tuning = def.tuningOverrides ? applyOverrides(JSON.parse(JSON.stringify(baseTuning)), def.tuningOverrides) : baseTuning;
  const upgradeOf = (u) => {
    if (typeof u === 'string' && u.indexOf(':') !== -1) {
      const parts = u.split(':');
      return { kind: parts[0], cells: recolour(archetype(parts[1]).cells, 1) };
    }
    return u;
  };
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
    waves: def.waves.map((w) => ({ enemy: archetype(w.enemy).cells, stake: w.stake, upgrade: upgradeOf(w.upgrade) })),
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
    tuningOverrides: def.tuningOverrides || {},
    covers: def.covers || '',
    checkpointEvery: every,
    fights: r.results,
    final: { phase: run.phase, endReason: run.endReason, wave: run.wave, score: run.score, wallet: run.wallet, heroHp: run.heroHp, heroMaxHp: run.heroMaxHp, heroBudget: run.heroBudget, weaponBudget: run.weaponBudget, heroN: run.heroFig.stats.N, weaponN: run.weaponFig.stats.N },
    checkpoints,
  };
}

export function buildSimTracesText(tuning) {
  const every = 120;
  const names = ['disc', 'block', 'ring', 'cross', 'star', 'lance', 'line', 'comb', 'shield', 'dot', 'hedgehog', 'wedge', 'frame', 'needle', 'hoop', 'spiral', 'grille', 'splinter', 'hoop2', 'hoop3'];
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
    ringTrace(tuning, { name: 'ring_1v1_circler_vs_rusher', seed: 17, seats: ['line', 'hedgehog'], styles: [1, 0], scripts: {}, maxRounds: 3, maxTicksPerRound: 100000, covers: 'bot style 1 (circler) against style 0' }, every),
    ringTrace(tuning, { name: 'ring_4_circlers', seed: 18, seats: ['hoop', 'spiral', 'splinter', 'ring'], styles: [1, 1, 1, 0], scripts: {}, maxRounds: 2, maxTicksPerRound: 100000, covers: 'circler target choice with four seats, optimiser drawings' }, every),
    ringTrace(tuning, {
      name: 'ring_1v1_sudden_death', seed: 19, seats: ['dot', 'splinter'], maxRounds: 1, maxTicksPerRound: 100000, every: 300,
      covers: 'constant end radius and sudden death: both seats walk toward the centre, stop apart from each other and wait; the ring closes after tick ' + tuning.ring.suddenDeathTick,
      scripts: { 0: [[0, 1, 0, 0], [32, 0, 0, 0]], 1: [[0, -1, 0, 0], [22, 0, 0, 0]] },
    }, every),
    ringTrace(tuning, {
      name: 'ring_2_idle_simultaneous_tie', seed: 20, seats: ['disc', 'block'], maxRounds: 2, maxTicksPerRound: 100000, every: 600,
      covers: 'simultaneous knock-out with an exact distance tie: nobody moves, both leave the shrinking ring in the same tick, the lowest seat wins',
      scripts: { 0: [[0, 0, 0, 0]], 1: [[0, 0, 0, 0]] },
    }, every),
    ringTrace(tuning, {
      name: 'ring_3_simultaneous_nearest_wins', seed: 23, seats: ['wedge', 'comb', 'lance'], maxRounds: 1, maxTicksPerRound: 100000, every: 600,
      covers: 'simultaneous knock-out decided by the distance to the centre: seats 0 and 1 never move, seat 2 creeps a few thousandths of a cell toward the centre and stops; all three leave the shrinking ring in the same tick and seat 2, the nearest, wins; see rounds[0].outTick and winner',
      scripts: { 0: [[0, 0, 0, 0]], 1: [[0, 0, 0, 0]], 2: [[0, 0.00173, -0.001, 0], [6, 0, 0, 0]] },
    }, every),
    soloTrace(tuning, { name: 'solo_kite_two_waves', seed: 21, hero: 'disc', weapon: 'needle', heroBot: 'kite', boss: false, waves: [{ enemy: 'dot', stake: 2, upgrade: 'heal' }, { enemy: 'needle', stake: 0, upgrade: null }] }, every),
    soloTrace(tuning, {
      name: 'solo_brawl_full_run', seed: 22, hero: 'hedgehog', weapon: 'dot', heroBot: 'brawl', boss: true,
      waves: [{ enemy: 'dot', stake: 0, upgrade: 'colour2' }, { enemy: 'line', stake: 1, upgrade: 'heal' }, { enemy: 'frame', stake: 0, upgrade: 'heal' }, { enemy: 'cross', stake: 2, upgrade: 'heal' }, { enemy: 'star', stake: 0, upgrade: 'heal' }],
    }, every),
    soloTrace(tuning, {
      name: 'solo_win_with_boss', seed: 27, hero: 'line', weapon: 'needle', heroBot: 'kite', boss: true,
      covers: 'a run that is won: five waves, heal after each, boss and escorts defeated (final.phase won)',
      waves: [0, 1, 2, 3, 4].map(() => ({ enemy: 'comb', stake: 0, upgrade: 'heal' })),
    }, every),
    soloTrace(tuning, {
      name: 'solo_upgrades_hero_and_weapon_ink', seed: 24, hero: 'star', weapon: 'needle', heroBot: 'kite', boss: false,
      covers: 'heroInk upgrade (redraw as block, damage taken stays) after wave 1 and weaponInk upgrade (redraw as line) after wave 2; see fights[].upgrade and final',
      waves: [{ enemy: 'dot', stake: 1, upgrade: 'heroInk:block' }, { enemy: 'frame', stake: 1, upgrade: 'weaponInk:line' }, { enemy: 'cross', stake: 0, upgrade: null }],
    }, every),
    soloTrace(tuning, {
      name: 'solo_hero_death', seed: 25, hero: 'splinter', weapon: 'splinter', heroBot: 'brawl', boss: false,
      covers: 'hero death (final.phase dead, endReason armour)',
      waves: [{ enemy: 'spiral', stake: 2, upgrade: null }, { enemy: 'hedgehog', stake: 2, upgrade: null }, { enemy: 'needle', stake: 2, upgrade: null }, { enemy: 'needle', stake: 2, upgrade: null }, { enemy: 'needle', stake: 2, upgrade: null }],
    }, every),
    soloTrace(tuning, {
      name: 'solo_time_limit', seed: 26, hero: 'line', weapon: 'splinter', heroBot: 'kite', boss: false,
      covers: 'solo time limit (final.phase dead, endReason time); this trace alone runs with the listed tuningOverrides',
      tuningOverrides: { 'solo.waveMaxTicks': 600 },
      waves: [{ enemy: 'block', stake: 2, upgrade: null }],
    }, every),
  ];
  const header = JSON.stringify({
    file: 'Inkweight golden simulation traces',
    tuningVersion: tuning.version,
    note: 'Ring: seats name drawings; control bot = botRingInput, script = segments [fromTick, mx, my, dash] by round tick (the last segment with fromTick <= tick applies). bodies rows: [x, y, vx, vy, fx, fy, hp, alive]. Solo: bot hero, hero and weapon recoloured black. hash: see core/hash.js (layout 2). botStyle: bot style per seat. A trace with tuningOverrides runs with those tuning values replaced (path = value) and all others from the tuning file. Solo upgrade strings heroInk:<name> and weaponInk:<name> redraw with that drawing recoloured black; fights[].upgrade is ok, empty or the refusal reason. Checkpoints are taken after the step that reaches the tick, plus one at round start (tick 0) and one at the end of every round or fight.',
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
