import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseDrawing, buildFigure } from '../core/index.js';
import { loadTuning } from '../tools/load_tuning.js';
import { buildStatVectorsText, buildSimTracesText, STAT_PATH, TRACE_PATH } from '../tools/gen_golden.js';

const T = loadTuning();

test('regenerating the golden stat vectors gives byte-identical output', () => {
  assert.ok(readFileSync(STAT_PATH, 'utf8') === buildStatVectorsText(T), 'stat_vectors.json differs; run node tools/gen_golden.js');
});

test('regenerating the golden simulation traces gives byte-identical output', () => {
  assert.ok(readFileSync(TRACE_PATH, 'utf8') === buildSimTracesText(T), 'sim_traces.json differs; run node tools/gen_golden.js');
});

test('golden stat vectors can be read back from their text rows', () => {
  const file = JSON.parse(readFileSync(STAT_PATH, 'utf8'));
  assert.ok(file.items.length >= 30);
  for (const v of file.items) {
    assert.equal(v.rows.length, 32);
    const d = parseDrawing(v.rows);
    const s = buildFigure(d.cells, d.W, d.H, T, v.kind, v.budget).stats;
    for (const key of ['filled', 'drips', 'N', 'C', 'S', 'element', 'valid', 'weight', 'armour', 'sharpness', 'topSpeed', 'cx', 'cy', 'radius', 'inertia']) {
      assert.equal(s[key], v.expect[key], v.name + ' ' + key);
    }
    assert.deepEqual(s.colourCounts, v.expect.colourCounts);
  }
});

test('golden traces cover ring duels, three and four figures and solo, and are small', () => {
  const text = readFileSync(TRACE_PATH, 'utf8');
  const file = JSON.parse(text);
  assert.ok(file.items.length >= 6);
  const modes = file.items.map((t) => t.mode + ':' + (t.seats ? t.seats.length : 0));
  for (const need of ['ring:2', 'ring:3', 'ring:4', 'solo:0']) assert.ok(modes.includes(need), 'missing ' + need);
  for (const t of file.items) { assert.ok(t.checkpoints.length >= 2); for (const c of t.checkpoints) assert.match(c.hash, /^[0-9a-f]{8}$/); }
  assert.ok(text.length < 1500000, 'trace file size ' + text.length);
});

test('the core uses only the allowed math functions and no ambient randomness or time', () => {
  const dir = fileURLToPath(new URL('../core/', import.meta.url));
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.js')) continue;
    const src = readFileSync(dir + f, 'utf8');
    const used = src.match(/Math\.[A-Za-z0-9_]+/g) || [];
    for (const u of used) assert.ok(['Math.sqrt', 'Math.floor', 'Math.imul'].includes(u), f + ' uses ' + u);
    assert.ok(!/Date\.|performance\.|process\.|require\(|node:/.test(src), f + ' must stay engine-free');
  }
});
