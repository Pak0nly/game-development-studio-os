// Readability table for the one-sentence rule: stats of a few drawings a
// first-time player would make, as a Markdown table.
//   node sim/readability.js
import { buildFigure } from '../core/index.js';
import { W, H, archetype, blank, rect, set } from './archetypes.js';
import { loadTuning } from '../tools/load_tuning.js';

const T = loadTuning();
const mk = (draw) => { const c = blank(); draw(c); return c; };
const rows = [
  ['10 x 10 block', mk((c) => rect(c, 10, 14, 19, 23, 1))],
  ['same + 12-cell straight blade', mk((c) => { rect(c, 10, 14, 19, 23, 1); rect(c, 14, 2, 14, 13, 1); })],
  ['same + 12-cell diagonal blade (staircase)', mk((c) => { rect(c, 10, 14, 19, 23, 1); for (let i = 0; i < 6; i++) { set(c, 20 + i, 13 - i, 1); set(c, 20 + i, 14 - i, 1); } })],
  ['stick figure (hollow head, body, arms, diagonal legs)', mk((c) => {
    rect(c, 13, 2, 19, 8, 1); rect(c, 14, 3, 18, 7, 0);
    rect(c, 16, 9, 16, 20, 1); rect(c, 11, 12, 21, 12, 1);
    for (let i = 0; i < 5; i++) { set(c, 15 - i, 21 + i, 1); set(c, 16 - i, 21 + i, 1); set(c, 17 + i, 21 + i, 1); set(c, 16 + i, 21 + i, 1); }
  })],
  ['13-cell dot', archetype('dot').cells],
  ['filled disc', archetype('disc').cells],
  ['hollow ring', archetype('ring').cells],
  ['2-cell-wide border hoop (216 ink)', archetype('hoop2').cells],
  ['3-cell-wide hoop (216 ink)', archetype('hoop3').cells],
  ['hedgehog', archetype('hedgehog').cells],
  ['line 32', archetype('line').cells],
  ['12-cell line', archetype('splinter').cells],
  ['all-blade snake (209 ink)', archetype('spiral').cells],
];
const disc = buildFigure(archetype('disc').cells, W, H, T, 'figure').stats;
console.log('| Drawing | N | C | S | P (counted) | Armour | Armour / disc | Sharpness | Blade hit on the disc | Push weight | Top speed | Blunt hits to kill |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const [name, cells] of rows) {
  const s = buildFigure(cells, W, H, T, 'figure').stats;
  const blade = s.S > 0 ? ((s.sharpness > T.stats.bluntDamage ? s.sharpness : T.stats.bluntDamage) + T.stats.sharpArmourCut * disc.armour).toFixed(2) : '-';
  console.log('| ' + [name, s.N, s.C, s.S, s.P + ' (' + s.pocketCells + ')', s.armour.toFixed(1), (s.armour / disc.armour).toFixed(2), s.sharpness.toFixed(2), blade, s.push.toFixed(1), s.topSpeed.toFixed(1), Math.ceil(s.armour / T.stats.bluntDamage)].join(' | ') + ' |');
}
console.log('');
console.log('Stat ranges for bars (valid figure drawings of at most ' + T.ink.figureBudget + ' ink): see RULES_AS_BUILT.md section 1.');
