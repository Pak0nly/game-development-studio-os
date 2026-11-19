import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDrawing, drawingToRows, extractBody, computeStats, elementMultiplier, buildFigure } from '../core/index.js';
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
  assert.equal(s.S, 4, 'only the four corners have 5 empty neighbours');
  const l = blank(); rect(l, 4, 4, 23, 4, 1);
  const sl = stats(l);
  assert.equal(sl.C, 0);
  assert.equal(sl.S, 20);
});

test('cells at the canvas border count outside as empty', () => {
  const c = blank(); rect(c, 0, 0, 5, 5, 1);
  const s = stats(c);
  assert.equal(s.C, 16);
  assert.equal(s.S, 4);
  const f = blank(); rect(f, 0, 0, 31, 31, 1);
  assert.equal(stats(f).C, 30 * 30);
});

test('stat formulas follow the tuning file', () => {
  for (const a of ARCHETYPES) {
    const s = stats(a.cells);
    const st = T.stats;
    assert.equal(s.weight, s.N);
    assert.equal(s.armour, st.armourBase + st.armourPerCore * s.C + st.armourPerCell * s.N);
    assert.equal(s.sharpness, st.sharpBase + st.sharpPerSharpCell * s.S + st.sharpPerSharpShare * s.S / s.N + st.sharpPerSharpShareSquared * (s.S / s.N) * (s.S / s.N));
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
