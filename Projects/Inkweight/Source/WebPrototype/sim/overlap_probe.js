// Probe for review finding I4 (and R2 of the re-review): how deep do bodies
// sit inside each other?
//   node sim/overlap_probe.js [--set path=value ...]
// Overlap of two bodies = 1 - smallest distance between two of their cell
// centres (cells are circles of radius 0.5, so 0 = just touching, above 0.5 =
// a cell centre inside another cell). Prints a turning scenario, bot duels,
// the teeth pairs (comb, hedgehog) and random four-figure rounds, all sampled
// at the end of every tick. "run" = longest row of ticks in a row above 0.5.
import {
  rngCreate, rngInt,
  buildFigure, createBody, createWorld, stepWorld, ringCreateMatch, ringStartRound, ringStep, ringBotInputs,
  cellWorldX, cellWorldY,
} from '../core/index.js';
import { W, H, archetype, blank, rect, ARCHETYPES } from './archetypes.js';
import { loadTuning, applyOverrides } from '../tools/load_tuning.js';

export function overlap(a, b) {
  const dx0 = a.x - b.x;
  const dy0 = a.y - b.y;
  const reach = a.fig.radius + b.fig.radius;
  if (dx0 * dx0 + dy0 * dy0 > reach * reach) return 0;
  let m = 0;
  for (let i = 0; i < a.fig.count; i++) {
    const ax = cellWorldX(a, i);
    const ay = cellWorldY(a, i);
    for (let j = 0; j < b.fig.count; j++) {
      const dx = ax - cellWorldX(b, j);
      const dy = ay - cellWorldY(b, j);
      const d2 = dx * dx + dy * dy;
      if (d2 < 1) { const o = 1 - Math.sqrt(d2); if (o > m) m = o; }
    }
  }
  return m;
}

// Teeth pair: `seeds` seeds, both bot styles, every tick while both live.
// Returns { ticks, deep, max, run }.
export function probePair(T, figA, figB, seeds) {
  const r = { ticks: 0, deep: 0, max: 0, run: 0 };
  for (let seed = 1; seed <= seeds; seed++) {
    for (const st of [[0, 0], [1, 1]]) {
      const m = ringCreateMatch(T, 2, seed);
      m.botStyle[0] = st[0]; m.botStyle[1] = st[1];
      ringStartRound(T, m, [figA, figB]);
      let row = 0;
      while (m.phase === 'fight') {
        ringStep(T, m, ringBotInputs(T, m, null));
        const bs = m.world.bodies;
        if (!(bs[0].alive && bs[1].alive)) continue;
        const o = overlap(bs[0], bs[1]);
        r.ticks++;
        if (o > r.max) r.max = o;
        if (o > 0.5) { r.deep++; row++; if (row > r.run) r.run = row; } else row = 0;
      }
    }
  }
  return r;
}

// Random four-figure rounds: four different archetypes and a bot style per
// seat from the generator; the deepest overlap of any living pair, every tick.
export function probeCrowd(T, rounds) {
  const figs = ARCHETYPES.map((a) => buildFigure(a.cells, W, H, T, 'figure'));
  const rng = rngCreate(20261120);
  const r = { ticks: 0, deep: 0, max: 0, run: 0 };
  for (let g = 0; g < rounds; g++) {
    const pick = [];
    while (pick.length < 4) { const k = rngInt(rng, figs.length); if (pick.indexOf(k) === -1) pick.push(k); }
    const m = ringCreateMatch(T, 4, 9000 + g);
    for (let i = 0; i < 4; i++) m.botStyle[i] = rngInt(rng, 2);
    m.round = g % 4;
    ringStartRound(T, m, pick.map((k) => figs[k]));
    let row = 0;
    while (m.phase === 'fight') {
      ringStep(T, m, ringBotInputs(T, m, null));
      const bs = m.world.bodies;
      let o = 0;
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
        if (!bs[i].alive || !bs[j].alive) continue;
        const x = overlap(bs[i], bs[j]);
        if (x > o) o = x;
      }
      r.ticks++;
      if (o > r.max) r.max = o;
      if (o > 0.5) { r.deep++; row++; if (row > r.run) r.run = row; } else row = 0;
    }
  }
  return r;
}

function line(label, r) {
  return label.padEnd(22) + ' ticks ' + r.ticks + ', above 0.5: ' + r.deep + ' (' + (100 * r.deep / r.ticks).toFixed(3) + ' %), max ' + r.max.toFixed(2) + ', run ' + r.run;
}

function main() {
  const set = {};
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--set') { const [p, v] = process.argv[++i].split('='); set[p] = Number(v); }
  }
  const T = applyOverrides(loadTuning(), set);
  if (Object.keys(set).length > 0) console.log('overrides ' + JSON.stringify(set));
  const arch = (n) => buildFigure(archetype(n).cells, W, H, T, 'figure');
  const c = blank(); rect(c, 16, 0, 16, 31, 1);
  const vline = buildFigure(c, W, H, T, 'figure');
  {
    const a = createBody(vline, 15, 0, 0, -1, 0);
    const b = createBody(arch('block'), 0, 0, 0, -1, 1);
    const w = createWorld([a, b], 0);
    let deep = 0;
    let max = 0;
    for (let t = 0; t < 400; t++) {
      stepWorld(w, [{ mx: -1, my: 0, dash: false }, { mx: 0, my: 0, dash: false }], T);
      const o = overlap(a, b);
      if (o > 0.5) deep++;
      if (o > max) max = o;
    }
    for (let t = 0; t < 120; t++) stepWorld(w, [], T);
    console.log('line turns into block, 400 ticks: ticks with overlap > 0.5: ' + deep + ', max ' + max.toFixed(3) + ', after 2 s idle ' + overlap(a, b).toFixed(3));
  }
  const pairs = [['line', 'block'], ['needle', 'disc'], ['lance', 'shield'], ['cross', 'block'], ['star', 'wedge'], ['splinter', 'disc'], ['spiral', 'block'], ['comb', 'hedgehog']];
  for (const [x, y] of pairs) {
    let rounds = 0;
    let bad = 0;
    let deepTicks = 0;
    let ticks = 0;
    let max = 0;
    for (let seed = 1; seed <= 6; seed++) {
      for (const st of [[0, 0], [1, 1]]) {
        const m = ringCreateMatch(T, 2, seed);
        m.botStyle[0] = st[0]; m.botStyle[1] = st[1];
        ringStartRound(T, m, [arch(x), arch(y)]);
        let deep = 0;
        while (m.phase === 'fight') {
          ringStep(T, m, ringBotInputs(T, m, null));
          const bs = m.world.bodies;
          if (bs[0].alive && bs[1].alive) { const o = overlap(bs[0], bs[1]); ticks++; if (o > max) max = o; if (o > 0.5) deep++; }
        }
        rounds++; deepTicks += deep; if (deep > 0) bad++;
      }
    }
    console.log((x + ' vs ' + y).padEnd(22) + ' rounds ' + rounds + ', rounds with overlap > 0.5: ' + bad + ', ticks > 0.5: ' + deepTicks + ' of ' + ticks + ', max ' + max.toFixed(2));
  }
  console.log('teeth pairs (6 seeds, both styles, every tick):');
  for (const [x, y] of [['comb', 'comb'], ['hedgehog', 'hedgehog'], ['comb', 'hedgehog'], ['comb', 'grille'], ['grille', 'spiral'], ['comb', 'star']]) {
    console.log(line(x + ' vs ' + y, probePair(T, arch(x), arch(y), 6)));
  }
  console.log(line('30 four-figure rounds', probeCrowd(T, 30)));
}

if (process.argv[1] && process.argv[1].endsWith('overlap_probe.js')) main();
