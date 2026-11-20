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
    for (const key of ['filled', 'drips', 'N', 'C', 'S', 'enclosed', 'P', 'pocketCells', 'push', 'element', 'valid', 'weight', 'armour', 'sharpness', 'topSpeed', 'cx', 'cy', 'radius', 'inertia']) {
      assert.equal(s[key], v.expect[key], v.name + ' ' + key);
    }
    assert.deepEqual(s.colourCounts, v.expect.colourCounts);
  }
});

test('golden traces cover ring duels, three and four figures and solo, and are small', () => {
  const text = readFileSync(TRACE_PATH, 'utf8');
  const file = JSON.parse(text);
  assert.ok(file.items.length >= 19);
  const modes = file.items.map((t) => t.mode + ':' + (t.seats ? t.seats.length : 0));
  for (const need of ['ring:2', 'ring:3', 'ring:4', 'solo:0']) assert.ok(modes.includes(need), 'missing ' + need);
  for (const t of file.items) { assert.ok(t.checkpoints.length >= 2); for (const c of t.checkpoints) assert.match(c.hash, /^[0-9a-f]{8}$/); }
  assert.ok(text.length < 1500000, 'trace file size ' + text.length);
});

// I2: the branches the review found missing
test('golden traces reach sudden death, simultaneous knock-outs, every solo ending and both ink upgrades', () => {
  const file = JSON.parse(readFileSync(TRACE_PATH, 'utf8'));
  const ring = file.items.filter((t) => t.mode === 'ring');
  const solo = file.items.filter((t) => t.mode === 'solo');
  assert.ok(ring.some((t) => t.rounds.some((r) => r.ticks > T.ring.suddenDeathTick)), 'a round that ends in sudden death');
  assert.ok(ring.some((t) => t.checkpoints.some((c) => c.tick > T.ring.shrinkEndTick && c.tick <= T.ring.suddenDeathTick && c.ringRadius === T.ring.endRadius)), 'a checkpoint at the constant end radius');
  const allOut = (r) => r.outTick.every((x) => x === r.ticks);
  assert.ok(ring.some((t) => t.rounds.some((r) => allOut(r) && r.winner === 0)), 'simultaneous knock-out, exact tie, lowest seat');
  assert.ok(ring.some((t) => t.rounds.some((r) => allOut(r) && r.winner !== 0)), 'simultaneous knock-out decided by distance');
  assert.ok(ring.some((t) => t.botStyle.includes(1)), 'a circler bot');
  assert.ok(solo.some((t) => t.final.phase === 'dead' && t.final.endReason === 'armour'), 'hero death');
  assert.ok(solo.some((t) => t.final.phase === 'dead' && t.final.endReason === 'time'), 'solo time limit');
  assert.ok(solo.some((t) => t.final.phase === 'won'), 'a won run');
  assert.ok(solo.some((t) => t.final.heroBudget === T.ink.figureBudget + T.solo.upgradeHeroInk && t.fights.some((x) => x.upgrade === 'ok')), 'hero-ink upgrade');
  assert.ok(solo.some((t) => t.final.weaponBudget === T.ink.weaponBudget + T.solo.upgradeWeaponInk), 'weapon-ink upgrade');
});

// INK-CORE-V3 review, suggestion 2: a port that forgets the 8 separation
// passes must fail on a duel trace of its own
test('the deep-passes duel trace changes with one separation pass less; the heavy boss trace sees the boss crush factor', () => {
  const pick = (text) => JSON.parse(text).items.filter((t) => t.name === 'ring_1v1_comb_comb_deep_passes')[0];
  const now = pick(readFileSync(TRACE_PATH, 'utf8'));
  assert.ok(now, 'trace exists');
  const last = (t) => t.checkpoints[t.checkpoints.length - 1].hash + '@' + t.rounds[0].ticks;
  for (const passes of [7, 2]) {
    const T2 = JSON.parse(JSON.stringify(T));
    T2.physics.extraSeparationPasses = passes;
    assert.notEqual(last(pick(buildSimTracesText(T2))), last(now), 'passes ' + passes);
  }
  // the boss fight of a heavy blunt design is in a trace and sees the boss crush factor
  const T3 = JSON.parse(JSON.stringify(T));
  T3.solo.bossCrushMult = 1;
  const boss = (text) => JSON.parse(text).items.filter((t) => t.name === 'solo_boss_heavy_no_crush')[0];
  const bossNow = boss(readFileSync(TRACE_PATH, 'utf8'));
  assert.equal(bossNow.fights.length, 6, 'reaches the boss fight');
  assert.notEqual(JSON.stringify(boss(buildSimTracesText(T3)).final), JSON.stringify(bossNow.final));
  // the won solo run keeps a margin: at least half the armour left
  const won = JSON.parse(readFileSync(TRACE_PATH, 'utf8')).items.filter((t) => t.name === 'solo_win_with_boss')[0];
  assert.equal(won.final.phase, 'won');
  assert.ok(won.final.heroHp > 0.5 * won.final.heroMaxHp, 'armour left ' + won.final.heroHp);
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
