// Probe for review finding I4: how deep do bodies sit inside each other?
//   node sim/overlap_probe.js
// Overlap of two bodies = 1 - smallest distance between two of their cell
// centres (cells are circles of radius 0.5, so 0 = just touching, above 0.5 =
// a cell centre inside another cell). Prints a turning scenario and bot
// rounds, sampled at the end of every tick.
import {
  buildFigure, createBody, createWorld, stepWorld, ringCreateMatch, ringStartRound, ringStep, ringBotInputs,
  cellWorldX, cellWorldY,
} from '../core/index.js';
import { W, H, archetype, blank, rect } from './archetypes.js';
import { loadTuning } from '../tools/load_tuning.js';

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

function main() {
  const T = loadTuning();
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
}

if (process.argv[1] && process.argv[1].endsWith('overlap_probe.js')) main();
