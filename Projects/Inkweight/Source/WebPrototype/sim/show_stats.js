// Print the stat line of every archetype with the current tuning file.
//   node sim/show_stats.js
import { buildFigure } from '../core/index.js';
import { ARCHETYPES, W, H } from './archetypes.js';
import { loadTuning } from '../tools/load_tuning.js';

const T = loadTuning();
for (const a of ARCHETYPES) {
  const s = buildFigure(a.cells, W, H, T, 'figure').stats;
  console.log([a.name.padEnd(9), 'N', s.N, 'C', s.C, 'S', s.S, 'P', s.P, 'enclosed', s.enclosed, 'armour', s.armour.toFixed(0), 'sharp', s.sharpness.toFixed(2), 'speed', s.topSpeed.toFixed(1), 'radius', s.radius.toFixed(1)].join(' '));
}
