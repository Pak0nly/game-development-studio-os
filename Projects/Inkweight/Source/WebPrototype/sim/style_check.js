// How much does the bot style decide? Every archetype pair plays duels with
// one rusher and one circler (both ways); the script prints how often the
// rusher wins, overall and per drawing the rusher or the circler steers.
//   node sim/style_check.js [seedsPerPair, default 8]
import { buildFigure } from '../core/index.js';
import { ARCHETYPES, W, H } from './archetypes.js';
import { playSingleRound } from './runner.js';
import { loadTuning } from '../tools/load_tuning.js';

const T = loadTuning();
const seeds = Number(process.argv[2] || 8);
const figs = ARCHETYPES.map((a) => buildFigure(a.cells, W, H, T, 'figure'));
const n = figs.length;
let rusherWins = 0;
let games = 0;
const asRusher = ARCHETYPES.map(() => [0, 0]);
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (i === j) continue;
    for (let s = 0; s < seeds; s++) {
      // seat 0 = drawing i as rusher, seat 1 = drawing j as circler
      const r = playSingleRound(T, [figs[i], figs[j]], 31000003 * (i * n + j) + s, s % 2, [0, 1]);
      games++;
      asRusher[i][1]++;
      if (r.winner === 0) { rusherWins++; asRusher[i][0]++; }
    }
  }
}
console.log('rusher wins ' + (100 * rusherWins / games).toFixed(1) + ' % of ' + games + ' rusher-against-circler duels (all drawing pairs, both ways)');
console.log('win rate of each drawing when it is the rusher against a circler of every other drawing:');
console.log(ARCHETYPES.map((a, i) => a.name + ' ' + (100 * asRusher[i][0] / asRusher[i][1]).toFixed(0)).join(', '));
