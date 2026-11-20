import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDrawing, drawingToRows, extractBody, computeStats, elementMultiplier, buildFigure, countEnclosed, isSharpCell } from '../core/index.js';
import { loadTuning } from '../tools/load_tuning.js';
import { blank, set, rect, W, H, ARCHETYPES } from '../sim/archetypes.js';

const T = loadTuning();
const stats = (c, kind, budget) => computeStats(c, W, H, T, kind || 'figure', budget);

test('parse and print round trip', () => {
  const rows = [];
  for (let y = 0; y < 32; y++) rows.push(y === 3 ? '.1234...........................' : '................................');
  const d = parseDrawing(rows);
  assert.equal(d.W, 32);
  assert.equal(d.cells[3 * 32 + 1], 1);
  assert.equal(d.cells[3 * 32 + 4], 4);
  assert.deepEqual(drawingToRows(d.cells, d.W, d.H), rows);
  assert.throws(() => parseDrawing(['.x']));
});

test('body is the largest 4-connected group, the rest drips off', () => {
  const c = blank();
  rect(c, 8, 8, 15, 15, 1);
  set(c, 0, 0, 2); set(c, 17, 8, 2); set(c, 16, 16, 2);
  const b = extractBody(c, W, H);
  assert.equal(b.N, 64);
  assert.equal(b.filled, 67);
  assert.equal(b.drips, 3);
  assert.equal(b.body[0], 0);
  assert.equal(b.body[16 * W + 16], 0, 'diagonal neighbour is not connected');
});

test('tie between groups goes to the group with the lowest cell index', () => {
  const c = blank();
  rect(c, 10, 2, 21, 2, 1);
  rect(c, 0, 20, 11, 20, 2);
  const b = extractBody(c, W, H);
  assert.equal(b.N, 12);
  assert.equal(b.body[2 * W + 10], 1);
  assert.equal(b.body[20 * W + 0], 0);
});

test('minimum body size and ink budget decide validity', () => {
  const a = blank(); rect(a, 3, 4, 13, 4, 1);
  assert.equal(stats(a).valid, false);
  const b = blank(); rect(b, 3, 4, 14, 4, 1);
  assert.equal(stats(b).valid, true);
  const full = blank(); rect(full, 0, 0, 31, 31, 1);
  const s = stats(full);
  assert.equal(s.N, 1024);
  assert.equal(s.withinBudget, false);
  assert.equal(s.valid, false);
  const w = blank(); rect(w, 10, 0, 11, 30, 1);
  assert.equal(stats(w, 'weapon').valid, false);
  assert.equal(stats(w, 'figure').valid, true);
  assert.equal(stats(full, 'figure', 2000).valid, true);
});

test('core and sharp cells of a block and a line', () => {
  const c = blank(); rect(c, 10, 10, 15, 15, 1); // 6 x 6
  const s = stats(c);
  assert.equal(s.N, 36);
  assert.equal(s.C, 16);
  assert.equal(s.S, 0, 'every cell of a block lies in a filled 2 x 2 square, corners included');
  const l = blank(); rect(l, 4, 4, 23, 4, 1);
  const sl = stats(l);
  assert.equal(sl.C, 0);
  assert.equal(sl.S, 20);
});

test('sharp cells (rules 2): ink one cell thick is blade, hand-derived cases', () => {
  // connected diagonal staircase of 24 cells: every cell is sharp
  const st = blank(); for (let i = 0; i < 12; i++) { set(st, 5 + i, 5 + i, 1); set(st, 6 + i, 5 + i, 1); }
  assert.equal(stats(st).N, 24);
  assert.equal(stats(st).S, 24);
  // a line two cells wide has no sharp cell
  const two = blank(); rect(two, 15, 4, 16, 23, 1);
  assert.equal(stats(two).S, 0);
  // thin cross: all 63 cells, the crossing included
  const cr = blank(); rect(cr, 0, 16, 31, 16, 1); rect(cr, 16, 0, 16, 31, 1);
  assert.equal(stats(cr).S, 63);
  // an L of one-cell strokes: all cells, the corner included
  const el = blank(); rect(el, 4, 4, 4, 15, 1); rect(el, 4, 15, 12, 15, 1);
  assert.equal(stats(el).S, stats(el).N);
  // 10 x 10 block with a 12-cell blade on top: exactly the 12 blade cells
  const sw = blank(); rect(sw, 10, 14, 19, 23, 1); rect(sw, 14, 2, 14, 13, 1);
  const ssw = stats(sw);
  assert.equal(ssw.N, 112);
  assert.equal(ssw.S, 12);
  assert.equal(isSharpCell(extractBody(sw, W, H).body, W, H, 14, 13), true, 'the blade cell that touches the block');
  assert.equal(isSharpCell(extractBody(sw, W, H).body, W, H, 14, 14), false, 'the block cell below it');
  const tri = blank(); for (let i = 0; i < 12; i++) rect(tri, 10, 5 + i, 10 + i, 5 + i, 1);
  // solid triangle (rows of 1, 2, 3 ... cells): only the two acute tips, the
  // single top cell and the last cell of the bottom row
  assert.equal(stats(tri).S, 2, 'the slanted side of a solid is not sharp');
  assert.equal(isSharpCell(tri, W, H, 10, 5), true);
  assert.equal(isSharpCell(tri, W, H, 21, 16), true);
  assert.equal(isSharpCell(tri, W, H, 10, 16), false, 'the right-angled corner');
  assert.equal(isSharpCell(tri, W, H, 15, 10), false, 'a cell of the slanted side');
});

test('a blade on a solid body raises the sharpness stat clearly', () => {
  const body = blank(); rect(body, 10, 14, 19, 23, 1);
  const sword = blank(); rect(sword, 10, 14, 19, 23, 1); rect(sword, 14, 2, 14, 13, 1);
  const a = stats(body).sharpness; const b = stats(sword).sharpness;
  assert.equal(a, T.stats.sharpBase);
  assert.ok(b - a >= 0.8, 'sharpness ' + a + ' -> ' + b);
  assert.ok(b > T.stats.bluntDamage);
});

test('enclosed space and pocket cells, hand-derived', () => {
  // box outline two cells thick, 16 x 16 outside: hole 12 x 12 = 144, pockets 10 x 10 = 100
  const fr = blank(); rect(fr, 8, 10, 23, 25, 1); rect(fr, 10, 12, 21, 23, 0);
  let e = countEnclosed(extractBody(fr, W, H).body, W, H);
  assert.deepEqual(e, { enclosed: 144, pockets: 100 });
  const sf = stats(fr);
  assert.equal(sf.S, 0); assert.equal(sf.N, 112); assert.equal(sf.P, 100);
  assert.equal(sf.armour, T.stats.armourBase + T.stats.armourPerCore * sf.C + T.stats.armourPerCell * sf.N + T.stats.armourPerPocket * Math.min(100, T.stats.pocketCapPerCell * 112));
  // one-cell loop: the space is enclosed, but a wall of blade cells holds no armour
  const lp = blank(); rect(lp, 4, 4, 27, 27, 1); rect(lp, 5, 5, 26, 26, 0);
  const sl = stats(lp);
  assert.equal(sl.enclosed, 22 * 22); assert.equal(sl.P, 20 * 20); assert.equal(sl.S, sl.N);
  assert.equal(sl.pocketCells, 0);
  assert.equal(sl.armour, T.stats.armourBase + T.stats.armourPerCell * sl.N);
  assert.equal(sl.push, sl.N, 'no pocket cells counted, so it pushes with its ink only');
  assert.equal(sf.pocketCells, Math.min(100, T.stats.pocketCapPerCell * 112));
  assert.equal(sf.push, sf.N + T.stats.pushPerPocket * sf.pocketCells);
  assert.equal(buildFigure(fr, W, H, T, 'figure').mass, sf.push);
  // a gap in the wall opens the space, also a diagonal gap
  const open = fr.slice(); set(open, 8, 15, 0); set(open, 9, 15, 0);
  assert.equal(stats(open).enclosed, 0);
  const diag = blank(); rect(diag, 10, 10, 14, 10, 1); rect(diag, 10, 14, 14, 14, 1); rect(diag, 10, 10, 10, 14, 1); rect(diag, 14, 11, 14, 14, 1);
  // the wall cell (14, 10) is there, so remove it: (13, 10) and (14, 11) touch only diagonally
  set(diag, 14, 10, 0);
  assert.equal(countEnclosed(diag, W, H).enclosed, 0, 'empty space leaks through a diagonal gap');
  // frame round the whole canvas
  const bf = blank(); rect(bf, 0, 0, 31, 31, 3); rect(bf, 1, 1, 30, 30, 0);
  assert.deepEqual(countEnclosed(bf, W, H), { enclosed: 900, pockets: 784 });
  // a solid has none
  const so = blank(); rect(so, 5, 5, 20, 20, 1);
  assert.deepEqual(countEnclosed(so, W, H), { enclosed: 0, pockets: 0 });
});

test('cells at the canvas border count outside as empty', () => {
  const c = blank(); rect(c, 0, 0, 5, 5, 1);
  const s = stats(c);
  assert.equal(s.C, 16);
  assert.equal(s.S, 0);
  const top = blank(); rect(top, 0, 0, 31, 0, 1);
  assert.equal(stats(top).S, 32, 'a line along the border is sharp');
  const f = blank(); rect(f, 0, 0, 31, 31, 1);
  assert.equal(stats(f).C, 30 * 30);
});

test('stat formulas follow the tuning file', () => {
  for (const a of ARCHETYPES) {
    const s = stats(a.cells);
    const st = T.stats;
    assert.equal(s.weight, s.N);
    let pockets = s.P;
    if (pockets > st.pocketCapPerCell * (s.N - s.S)) pockets = st.pocketCapPerCell * (s.N - s.S);
    assert.equal(s.armour, st.armourBase + st.armourPerCore * s.C + st.armourPerCell * s.N + st.armourPerPocket * pockets);
    assert.equal(s.sharpness, st.sharpBase + (st.sharpMax * (s.S * s.S) / (s.S * s.S + st.sharpHalfCells * st.sharpHalfCells) + st.sharpPurity * (s.S / s.N) * (s.S / s.N) / (1 + s.N / st.sharpPurityWeightRef)));
    assert.ok(s.sharpness <= st.sharpBase + st.sharpMax + st.sharpPurity, 'sharpness is bounded');
    assert.equal(s.topSpeed, st.speedBase / (1 + s.N / st.speedWeightRef));
    assert.ok(s.valid, a.name + ' must be a valid figure');
  }
});

test('centroid and radius', () => {
  const c = blank(); rect(c, 10, 10, 13, 13, 1);
  const s = stats(c);
  assert.equal(s.cx, 12);
  assert.equal(s.cy, 12);
  assert.equal(s.radius, Math.sqrt(1.5 * 1.5 * 2) + 0.5);
});

test('element: 30 percent threshold, plurality and ties', () => {
  const mk = (red, blue, green, black) => {
    const c = blank(); let x = 0;
    for (const [n, v] of [[red, 2], [blue, 3], [green, 4], [black, 1]]) for (let i = 0; i < n; i++) set(c, x++, 4, v);
    return stats(c).element;
  };
  assert.equal(mk(6, 0, 0, 14), 2);
  assert.equal(mk(5, 0, 0, 15), 0);
  assert.equal(mk(10, 10, 0, 0), 0);
  assert.equal(mk(5, 4, 3, 4), 2);
  assert.equal(mk(0, 0, 12, 0), 4);
  assert.equal(mk(0, 0, 0, 20), 0);
});

test('element multipliers: Ember beats Moss beats Tide beats Ember', () => {
  const e = T.element;
  assert.equal(elementMultiplier(T, 2, 4), e.strongMult);
  assert.equal(elementMultiplier(T, 4, 3), e.strongMult);
  assert.equal(elementMultiplier(T, 3, 2), e.strongMult);
  assert.equal(elementMultiplier(T, 4, 2), e.weakMult);
  assert.equal(elementMultiplier(T, 3, 4), e.weakMult);
  assert.equal(elementMultiplier(T, 2, 3), e.weakMult);
  for (const x of [0, 2, 3, 4]) { assert.equal(elementMultiplier(T, 0, x), 1); assert.equal(elementMultiplier(T, x, 0), 1); assert.equal(elementMultiplier(T, x, x), 1); }
});

test('figure template lists body cells in index order with local coordinates', () => {
  const c = blank(); rect(c, 10, 10, 13, 13, 1); set(c, 0, 0, 1);
  const f = buildFigure(c, W, H, T, 'figure');
  assert.equal(f.count, 16);
  assert.equal(f.lx[0], -1.5);
  assert.equal(f.ly[0], -1.5);
  assert.equal(f.grid[10 * W + 10], 0);
  assert.equal(f.grid[0], -1);
  assert.equal(f.boundary.length, 12);
  assert.equal(f.mass, 16);
});

// Review finding I5: "filled areas are armour" must be visibly true
test('filled areas are armour: solids out-armour lines, dots and every hollow shell of the same ink', () => {
  const a = (name) => stats(ARCHETYPES.find((x) => x.name === name).cells);
  const disc = a('disc'); const line = a('line'); const dot = a('dot');
  assert.ok(disc.armour >= 2.5 * line.armour, 'disc ' + disc.armour + ' against line ' + line.armour);
  assert.ok(dot.armour < 0.5 * disc.armour, 'dot ' + dot.armour + ' against disc ' + disc.armour);
  for (const hollow of ['ring', 'frame', 'hoop', 'hoop2', 'hoop3']) {
    const h = a(hollow);
    const side = Math.floor(Math.sqrt(h.N));
    const solid = blank(); rect(solid, 0, 0, side - 1, side - 1, 1); // a filled square of at most the same ink
    const s = stats(solid);
    assert.ok(s.N <= h.N);
    assert.ok(h.armour < s.armour, hollow + ' ' + h.armour + ' against a filled square of ' + s.N + ' cells with ' + s.armour);
  }
  // the hardest case: all ink in a thick shell with the largest pocket
  const shell = blank(); rect(shell, 1, 1, 29, 29, 1); rect(shell, 3, 3, 27, 27, 0);
  assert.ok(stats(shell).armour < a('disc').armour);
});
