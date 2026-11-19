// Drawings for the golden stat vectors: the archetypes plus edge cases.
import { ARCHETYPES, W, H, blank, set, rect } from '../sim/archetypes.js';

function mk(name, kind, note, draw, budget) {
  const c = blank();
  draw(c);
  const o = { name, kind, note, cells: c };
  if (budget !== undefined) o.budget = budget;
  return o;
}

export function goldenCases() {
  const list = [];
  for (const a of ARCHETYPES) list.push({ name: 'arch_' + a.name, kind: 'figure', note: a.note, cells: a.cells });
  list.push(mk('empty', 'figure', 'no ink at all', () => {}));
  list.push(mk('single_cell', 'figure', 'one cell', (c) => set(c, 5, 5, 1)));
  list.push(mk('line_11', 'figure', 'one cell too small', (c) => rect(c, 3, 4, 13, 4, 1)));
  list.push(mk('line_12', 'figure', 'smallest valid body', (c) => rect(c, 3, 4, 14, 4, 1)));
  list.push(mk('tie_two_groups', 'figure', 'two groups of 12: the one with the lowest cell index (black) is the body', (c) => { rect(c, 10, 2, 21, 2, 1); rect(c, 0, 20, 11, 20, 2); }));
  list.push(mk('tie_same_row', 'figure', 'two groups of 12 starting in the same row: the left one wins', (c) => { rect(c, 20, 3, 20, 14, 3); rect(c, 4, 3, 4, 14, 4); }));
  list.push(mk('bigger_later', 'figure', 'a small group first, the bigger later group is the body', (c) => { rect(c, 0, 0, 4, 0, 2); rect(c, 10, 10, 14, 13, 1); }));
  list.push(mk('drips', 'figure', 'block with loose dots that drip off', (c) => { rect(c, 8, 8, 15, 15, 1); set(c, 0, 0, 2); set(c, 31, 31, 3); set(c, 20, 20, 4); set(c, 17, 8, 2); set(c, 16, 16, 2); }));
  list.push(mk('diagonal_only', 'figure', 'diagonal cells are not connected: body of one cell', (c) => { for (let i = 0; i < 20; i++) set(c, 5 + i, 5 + i, 1); }));
  list.push(mk('staircase', 'figure', 'connected diagonal staircase: no sharp cells except the ends', (c) => { for (let i = 0; i < 12; i++) { set(c, 5 + i, 5 + i, 1); set(c, 6 + i, 5 + i, 1); } }));
  list.push(mk('checkerboard', 'figure', 'checkerboard: every cell is its own group', (c) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if ((x + y) % 2 === 0) set(c, x, y, 1); }));
  list.push(mk('element_exact_30', 'figure', '6 of 20 cells red: exactly 30 percent, Ember', (c) => { rect(c, 4, 4, 23, 4, 1); rect(c, 4, 4, 9, 4, 2); }));
  list.push(mk('element_below_30', 'figure', '5 of 20 cells red: neutral', (c) => { rect(c, 4, 4, 23, 4, 1); rect(c, 4, 4, 8, 4, 2); }));
  list.push(mk('element_tie', 'figure', '10 red and 10 blue: neutral', (c) => { rect(c, 4, 4, 13, 4, 2); rect(c, 14, 4, 23, 4, 3); }));
  list.push(mk('element_plurality', 'figure', '5 red, 4 blue, 3 green, 4 black: Ember', (c) => { rect(c, 4, 4, 8, 4, 2); rect(c, 9, 4, 12, 4, 3); rect(c, 13, 4, 15, 4, 4); rect(c, 16, 4, 19, 4, 1); }));
  list.push(mk('element_moss_full', 'figure', 'all green block: Moss', (c) => rect(c, 10, 10, 15, 15, 4)));
  list.push(mk('element_drips_ignored', 'figure', 'black body, red drips do not count: neutral', (c) => { rect(c, 4, 4, 23, 4, 1); rect(c, 4, 10, 14, 10, 2); }));
  list.push(mk('full_canvas', 'figure', 'everything filled: over budget', (c) => rect(c, 0, 0, 31, 31, 1)));
  list.push(mk('corner_block', 'figure', 'block in the canvas corner: outside counts as empty', (c) => rect(c, 0, 0, 5, 5, 1)));
  list.push(mk('border_line_top', 'figure', 'line along the top border', (c) => rect(c, 0, 0, 31, 0, 1)));
  list.push(mk('border_frame', 'figure', 'one-cell frame around the whole canvas', (c) => { rect(c, 0, 0, 31, 31, 3); rect(c, 1, 1, 30, 30, 0); }));
  list.push(mk('over_budget_by_drips', 'figure', 'body of 210 plus 11 drips: 221 ink, invalid', (c) => { rect(c, 9, 9, 22, 23, 1); for (let i = 0; i < 11; i++) set(c, 2 * i, 0, 1); }));
  list.push(mk('exactly_220', 'figure', '20 x 11 block: exactly the budget', (c) => rect(c, 6, 10, 25, 20, 2)));
  list.push(mk('two_wide_line', 'figure', 'line two cells wide: only the ends are sharp', (c) => rect(c, 15, 4, 16, 23, 1)));
  list.push(mk('catch_up_budget', 'figure', '23 x 11 block against a catch-up budget of 253', (c) => rect(c, 4, 10, 26, 20, 1), 253));
  list.push(mk('weapon_needle', 'weapon', 'thrown weapon, 20 cells', (c) => { rect(c, 16, 8, 16, 23, 1); rect(c, 14, 23, 18, 23, 1); }));
  list.push(mk('weapon_too_small', 'weapon', 'weapon with 11 cells', (c) => rect(c, 3, 4, 13, 4, 2)));
  list.push(mk('weapon_exactly_60', 'weapon', '6 x 10 weapon: exactly the weapon budget', (c) => rect(c, 10, 10, 15, 19, 3)));
  list.push(mk('weapon_over_budget', 'weapon', '2 x 31 weapon: 62 ink', (c) => rect(c, 10, 0, 11, 30, 1)));
  return list.map((o) => ({ ...o, W, H }));
}
