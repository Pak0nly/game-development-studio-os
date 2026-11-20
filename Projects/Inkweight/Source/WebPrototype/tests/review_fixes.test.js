// Tests for the findings of the INK-CORE-V1 review (I1, I3, M1 to M7).
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFigure, createBody, createWorld, stepWorld, ringCreateMatch, ringStartRound, ringStep, ringBotInputs,
} from '../core/index.js';
import { overlap, probePair, probeCrowd } from '../sim/overlap_probe.js';
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
      // sharp touch = max(blunt, sharpness) plus the armour cut
      if (e.sharp && e.from === 0) { sharpSeen++; assert.equal(e.damage, T.stats.bluntDamage + T.stats.sharpArmourCut * b.maxHp); }
      assert.ok(e.damage >= T.stats.bluntDamage, 'hit damage ' + e.damage);
    }
  }
  assert.ok(seen > 0);
  assert.ok(sharpSeen > 0, 'the wedge touched with its tip at least once');
});

// m5: I1 again with fractional gaps and sideways offsets
test('I1: lines dashing broadside with fractional gaps and sideways offsets never cross', () => {
  const line = figOf((c) => rect(c, 6, 16, 25, 16, 1));
  for (const side of [0, 3.3, 7.5]) {
    for (let gap = 5.13; gap < 15; gap += 0.37) {
      const a = createBody(line, side, gap / 2 + 0.5, 0, -1, 0);
      const b = createBody(line, 0, -gap / 2 - 0.5, 0, 1, 1);
      const w = createWorld([a, b], 0);
      for (let i = 0; i < 90; i++) {
        stepWorld(w, [{ mx: 0, my: -1, dash: true }, { mx: 0, my: 1, dash: true }], T);
        // With a sideways offset the bumpy cell rows may slide the lines apart
        // sideways; passing is only a fault while they still overlap in x.
        if (Math.abs(a.x - b.x) < 20) assert.ok(a.y > b.y, 'side ' + side + ' gap ' + gap + ' tick ' + i + ': crossed');
        assert.ok(overlap(a, b) <= 0.5, 'side ' + side + ' gap ' + gap + ' tick ' + i + ': overlap ' + overlap(a, b));
      }
    }
  }
});

// I4 (review of version 2): turning must not push figures into each other
test('I4: turning scenarios never leave two cell centres of different bodies closer than 0.5', () => {
  const vline = figOf((c) => rect(c, 16, 0, 16, 31, 1));
  const cases = [
    // [figure A, x, y, front, stick of A, figure B, x, y]
    [vline, 15, 0, [0, -1], [-1, 0], fig('block'), 0, 0],      // the Reviewer's scenario
    [vline, 0, 16, [1, 0], [0, -1], fig('disc'), 0, 0],
    [fig('cross'), 24.5, 3, [0, -1], [-1, 0.2], fig('block'), 0, 0],
    [fig('lance'), 0, 24, [1, 0], [0, -1], fig('shield'), 0, 0],
    [fig('needle'), 12, 5, [0, 1], [-1, -0.4], fig('wedge'), 0, 0],
    [vline, 9, 0, [0, -1], [-1, 0], vline, -9, 0],
  ];
  for (let k = 0; k < cases.length; k++) {
    const c = cases[k];
    for (const dash of [false, true]) {
      const a = createBody(c[0], c[1], c[2], c[3][0], c[3][1], 0);
      const b = createBody(c[5], c[6], c[7], 0, -1, 1);
      const w = createWorld([a, b], 0);
      let touched = false;
      for (let i = 0; i < 400; i++) {
        // B turns too in the last case (two lines turning into each other)
        const inB = k === 5 ? { mx: 1, my: 0, dash: false } : { mx: 0, my: 0, dash: false };
        stepWorld(w, [{ mx: c[4][0], my: c[4][1], dash: dash && i % 130 === 0 }, inB], T);
        const o = overlap(a, b);
        if (o > 0) touched = true;
        assert.ok(o <= 0.5, 'case ' + k + ' dash ' + dash + ' tick ' + i + ': overlap ' + o);
        assert.ok(w.subSteps >= 1 && w.subSteps <= T.physics.maxSubSteps);
      }
      assert.ok(touched, 'case ' + k + ': the figures met');
      for (let i = 0; i < 120; i++) stepWorld(w, [], T);
      assert.ok(overlap(a, b) < 0.05, 'case ' + k + ': at rest the figures do not sit inside each other, overlap ' + overlap(a, b));
    }
  }
});

test('I4: the tip speed of a turning figure counts for the number of sub-steps', () => {
  const vline = figOf((c) => rect(c, 16, 0, 16, 31, 1));
  const b = createBody(vline, 0, 0, 0, -1, 0);
  const w = createWorld([b], 0);
  stepWorld(w, [{ mx: 0, my: -1, dash: false }], T);   // straight ahead: no turn
  const straight = w.subSteps;
  stepWorld(w, [{ mx: 1, my: 0, dash: false }], T);    // quarter turn begins
  const tip = vline.radius * vline.turnRate / T.physics.tickRate;
  assert.ok(tip > T.physics.maxStepCells, 'the tip of the line moves ' + tip + ' cells per tick');
  assert.ok(w.subSteps > straight);
  assert.ok(w.subSteps >= Math.floor(tip / T.physics.maxStepCells) + 1 || w.subSteps === T.physics.maxSubSteps);
  assert.ok(Math.abs(b.fx * b.fx + b.fy * b.fy - 1) < 1e-12);
});

test('I4: bot rounds keep cell centres of different bodies at least 0.5 apart at the end of every tick', () => {
  const pairs = [['line', 'block'], ['needle', 'disc'], ['lance', 'shield'], ['cross', 'block'], ['star', 'wedge'], ['splinter', 'disc'], ['spiral', 'block'], ['hoop2', 'hedgehog']];
  for (const [x, y] of pairs) {
    for (const st of [[0, 0], [1, 1]]) {
      const m = ringCreateMatch(T, 2, 3);
      m.botStyle[0] = st[0]; m.botStyle[1] = st[1];
      ringStartRound(T, m, [fig(x), fig(y)]);
      while (m.phase === 'fight') {
        ringStep(T, m, ringBotInputs(T, m, null));
        const bs = m.world.bodies;
        if (bs[0].alive && bs[1].alive) {
          const o = overlap(bs[0], bs[1]);
          assert.ok(o <= 0.5, x + ' vs ' + y + ' styles ' + st + ' tick ' + m.tick + ': overlap ' + o);
        }
      }
    }
  }
});

// Known limit, stated in RULES_AS_BUILT section 3: two figures with one-cell
// teeth and one-cell gaps can mesh; deep overlaps stay rare and are bounded.
test('I4: meshing teeth (comb against hedgehog) overlap deeper than 0.5 in under 1 percent of ticks', () => {
  let deep = 0;
  let ticks = 0;
  for (const st of [[0, 0], [1, 1]]) {
    for (let seed = 1; seed <= 2; seed++) {
      const m = ringCreateMatch(T, 2, seed);
      m.botStyle[0] = st[0]; m.botStyle[1] = st[1];
      ringStartRound(T, m, [fig('comb'), fig('hedgehog')]);
      while (m.phase === 'fight') {
        ringStep(T, m, ringBotInputs(T, m, null));
        const bs = m.world.bodies;
        if (bs[0].alive && bs[1].alive) { ticks++; if (overlap(bs[0], bs[1]) > 0.5) deep++; }
      }
    }
  }
  assert.ok(deep * 100 < ticks, deep + ' of ' + ticks + ' ticks');
});

// R2 (INK-CORE-V3): the meshing bound for teeth against teeth and for crowds.
// Deep contacts are pushed again up to extraSeparationPasses times and, with
// three or more bodies, the pairs are relaxed up to crowdRelaxPasses times.
test('R2: comb against comb overlaps deeper than 0.5 in under 0.5 percent of ticks, never for half a second', () => {
  const r = probePair(T, fig('comb'), fig('comb'), 2);
  assert.ok(r.ticks > 3000);
  assert.ok(r.deep * 200 < r.ticks, r.deep + ' of ' + r.ticks + ' ticks');
  assert.ok(r.run < 30, 'longest row ' + r.run);
});

test('R2: random four-figure rounds overlap deeper than 0.5 in under 0.5 percent of ticks', () => {
  const r = probeCrowd(T, 8);
  assert.ok(r.ticks > 8000);
  assert.ok(r.deep * 200 < r.ticks, r.deep + ' of ' + r.ticks + ' ticks');
});

test('R2: the crowd relaxation moves positions only and leaves duels alone', () => {
  // three blocks of one team (no hits) pressed into each other at rest: they come apart, nobody gains speed
  const bs = [createBody(fig('block'), -6, 0, 0, -1, 0), createBody(fig('block'), 0, 0, 0, -1, 0), createBody(fig('block'), 6, 0, 0, -1, 0)];
  const w = createWorld(bs, 0);
  for (let t = 0; t < 30; t++) stepWorld(w, [], T);
  for (let i = 0; i < 3; i++) { assert.equal(bs[i].vx, 0); assert.equal(bs[i].vy, 0); }
  assert.ok(overlap(bs[0], bs[1]) <= 0.5 && overlap(bs[1], bs[2]) <= 0.5);
  // a duel is bit-identical with and without the relaxation
  const T0 = loadTuning(); T0.physics.crowdRelaxPasses = 0;
  const run = (tun) => {
    const m = ringCreateMatch(tun, 2, 5);
    ringStartRound(tun, m, [buildFigure(archetype('comb').cells, W, H, tun, 'figure'), buildFigure(archetype('hedgehog').cells, W, H, tun, 'figure')]);
    while (m.phase === 'fight') ringStep(tun, m, ringBotInputs(tun, m, null));
    return [m.tick, m.roundWinner, m.world.bodies[0].x, m.world.bodies[1].hp];
  };
  assert.deepEqual(run(T), run(T0));
});

// m2
test('m2: four widest figures do not overlap at the start of a four-seat round', () => {
  const frame = figOf((c) => { rect(c, 0, 0, 31, 31, 3); rect(c, 1, 1, 30, 30, 0); });
  const m = ringCreateMatch(T, 4, 1);
  ringStartRound(T, m, [frame, frame, frame, frame]);
  const bs = m.world.bodies;
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) assert.equal(overlap(bs[i], bs[j]), 0, 'seats ' + i + ' and ' + j);
});

// M1 (kept): a figure at 0 armour still acts until the end of its tick
test('M1: a figure whose armour reaches 0 in a tick still hits in a later pair of the same tick', () => {
  const blk = figOf((c) => rect(c, 10, 10, 19, 19, 1));
  const mid = createBody(blk, 0, 0, 0, -1, 0);
  const left = createBody(blk, -9.5, 0, 0, -1, 1);
  const right = createBody(blk, 9.5, 0, 0, -1, 2);
  mid.hp = 0.01;
  const w = createWorld([left, mid, right], 0);   // pair (0,1) is handled before pair (1,2)
  stepWorld(w, [], T);
  const hits = w.events.filter((e) => e.type === 'hit').map((e) => e.from + '>' + e.to);
  assert.ok(hits.includes('0>1'), 'the left block hits the middle one');
  assert.ok(mid.hp <= 0);
  assert.ok(hits.indexOf('1>2') > hits.indexOf('0>1'), 'the middle block, already at 0, still hits the right one: ' + hits);
  assert.equal(mid.alive, true, 'stepWorld does not remove it; the mode module does after the step');
});
