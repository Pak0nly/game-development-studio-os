// Tests for the findings of the INK-CORE-V1 review (I1, I3, M1 to M7).
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFigure, createBody, createWorld, stepWorld,
} from '../core/index.js';
import { loadTuning } from '../tools/load_tuning.js';
import { blank, rect, W, H, archetype } from '../sim/archetypes.js';

const T = loadTuning();
const figOf = (draw) => { const c = blank(); draw(c); return buildFigure(c, W, H, T, 'figure'); };
const fig = (name) => buildFigure(archetype(name).cells, W, H, T, 'figure');

// I1, the Reviewer's scenario: two horizontal 20-cell lines, broadside, dash at
// each other. They must touch, never swap sides and end the dash on contact.
test('I1: two 20-cell lines dashing broadside from gaps of 6 to 14 cells never cross', () => {
  const line = figOf((c) => rect(c, 6, 16, 25, 16, 1));
  for (let gap = 6; gap <= 14; gap++) {
    const a = createBody(line, 0, gap / 2 + 0.5, 0, -1, 0);   // below, moving up
    const b = createBody(line, 0, -gap / 2 - 0.5, 0, 1, 1);   // above, moving down
    const w = createWorld([a, b], 0);
    let hits = 0;
    let rams = 0;
    for (let i = 0; i < 240; i++) {
      stepWorld(w, [{ mx: 0, my: -1, dash: true }, { mx: 0, my: 1, dash: true }], T);
      for (const e of w.events) { if (e.type === 'hit') hits++; if (e.type === 'ram') rams++; }
      assert.ok(a.y > b.y, 'gap ' + gap + ' tick ' + i + ': crossed, a.y ' + a.y + ' b.y ' + b.y);
    }
    assert.ok(hits >= 2, 'gap ' + gap + ': both sides were hit');
    assert.ok(rams >= 1, 'gap ' + gap + ': the dash ended in a ram');
  }
});

test('I1: a fast small figure does not pass through a one-cell line, at any offset', () => {
  const dot = fig('dot');
  const line = figOf((c) => rect(c, 16, 0, 16, 31, 1)); // vertical line, 32 cells
  for (let k = 0; k < 40; k++) {
    const startX = -9 - k * 0.137;
    const a = createBody(dot, startX, (k % 7) - 3, 1, 0, 0);
    const b = createBody(line, 0, 0, 0, -1, 1);
    const w = createWorld([a, b], 0);
    let touched = false;
    for (let i = 0; i < 200; i++) {
      stepWorld(w, [{ mx: 1, my: 0, dash: true }, { mx: 0, my: 0, dash: false }], T);
      for (const e of w.events) if (e.type === 'hit') touched = true;
      assert.ok(a.x < b.x, 'offset ' + k + ' tick ' + i + ': the dot is past the line');
    }
    assert.ok(touched, 'offset ' + k + ': contact was detected');
  }
});

test('I1: a dash transfers its push and ends on contact', () => {
  const a = createBody(fig('block'), -9.5, 0, 1, 0, 0);
  const b = createBody(fig('block'), 9.5, 0, -1, 0, 1);
  const w = createWorld([a, b], 0);
  let rammed = false;
  for (let i = 0; i < 120 && !rammed; i++) {
    stepWorld(w, [{ mx: 1, my: 0, dash: i >= 5 }, { mx: 0, my: 0, dash: false }], T);
    for (const e of w.events) if (e.type === 'ram' && e.from === 0) rammed = true;
  }
  assert.ok(rammed, 'the dashing block reached the idle block');
  assert.equal(a.dashTicks, 0, 'contact ended the dash');
  assert.ok(b.vx > 5, 'the idle block was pushed away, vx = ' + b.vx);
  const vxAfter = a.vx;
  stepWorld(w, [{ mx: 0, my: 0, dash: false }, { mx: 0, my: 0, dash: false }], T);
  assert.ok(Math.abs(a.vx) <= Math.abs(vxAfter) + 1e-9, 'the dash velocity is not restored in the next tick');
});

test('sub-steps: a tick is cut so that no body moves more than maxStepCells per part', () => {
  const b = createBody(fig('dot'), 0, 0, 1, 0, 0);
  const w = createWorld([b], 0);
  stepWorld(w, [{ mx: 0, my: 0, dash: false }], T);
  assert.equal(w.subSteps, 1);
  stepWorld(w, [{ mx: 1, my: 0, dash: true }], T);
  const perTick = Math.sqrt(b.vx * b.vx + b.vy * b.vy) / T.physics.tickRate;
  assert.ok(w.subSteps > 1 && w.subSteps <= T.physics.maxSubSteps);
  assert.ok(perTick / w.subSteps <= T.physics.maxStepCells + 1e-12);
});

// I3
test('I3: a sharp touch never does less than a blunt touch', () => {
  // the wedge has two blade cells (its tips), so its sharpness stat is only a
  // little above the base and below blunt damage
  const wedge = fig('wedge');
  assert.ok(wedge.stats.S > 0 && wedge.stats.sharpness < T.stats.bluntDamage, 'the case is only meaningful while the stat is below blunt');
  const a = createBody(wedge, 0, 22, 0, -1, 0);       // tip forward, moving up
  const b = createBody(fig('disc'), 0, -4, 0, -1, 1);
  const w = createWorld([a, b], 0);
  let seen = 0;
  let sharpSeen = 0;
  for (let i = 0; i < 400; i++) {
    stepWorld(w, [{ mx: 0, my: -1, dash: false }, { mx: 0, my: 0, dash: false }], T);
    for (const e of w.events) {
      if (e.type !== 'hit') continue;
      seen++;
      if (e.sharp && e.from === 0) { sharpSeen++; assert.equal(e.damage, T.stats.bluntDamage); }
      assert.ok(e.damage >= T.stats.bluntDamage, 'hit damage ' + e.damage);
    }
  }
  assert.ok(seen > 0);
  assert.ok(sharpSeen > 0, 'the wedge touched with its tip at least once');
});
