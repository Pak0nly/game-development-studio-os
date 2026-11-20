import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeStats, extractBody, buildFigure, createBody, createWorld, stepWorld, rngCreate, rngInt, rngFloat, rngU32,
  ringCreateMatch, ringStartRound, ringStep, ringBotInputs, ringInkBudget, ringRadiusAt, hashRing, ringCheckFigure, rngDerive,
} from '../core/index.js';
import { loadTuning } from '../tools/load_tuning.js';
import { blank, set, rect, recolour, W, H, archetype } from '../sim/archetypes.js';
import { playRingMatch } from '../sim/runner.js';

const T = loadTuning();
const fig = (name) => buildFigure(archetype(name).cells, W, H, T, 'figure');

function randomDrawing(rng, margin) {
  const c = blank();
  const blobs = 1 + rngInt(rng, 5);
  for (let b = 0; b < blobs; b++) {
    const x0 = margin + rngInt(rng, 20 - margin);
    const y0 = margin + rngInt(rng, 20 - margin);
    const w = 1 + rngInt(rng, 9);
    const h = 1 + rngInt(rng, 9);
    rect(c, x0, y0, Math.min(x0 + w, 31 - margin), Math.min(y0 + h, 31 - margin), 1 + rngInt(rng, 4));
  }
  for (let k = 0; k < 30; k++) set(c, margin + rngInt(rng, 32 - 2 * margin), margin + rngInt(rng, 32 - 2 * margin), rngInt(rng, 5));
  return c;
}

test('generator is reproducible and stays in range', () => {
  const a = rngCreate(7); const b = rngCreate(7); const c = rngCreate(8);
  let same = true; let differs = false;
  for (let i = 0; i < 100; i++) {
    const x = rngU32(a); const y = rngU32(b); const z = rngU32(c);
    if (x !== y) same = false;
    if (x !== z) differs = true;
  }
  assert.ok(same); assert.ok(differs);
  for (let i = 0; i < 1000; i++) { const f = rngFloat(a); assert.ok(f >= 0 && f < 1); const k = rngInt(a, 7); assert.ok(k >= 0 && k < 7); }
  // fixed reference values for the C# port (written down, not recomputed)
  const r = rngCreate(12345);
  assert.deepEqual([rngU32(r), rngU32(r), rngU32(r)], [3438003404, 976339029, 1163348040]);
  const d = rngDerive(7, 2);
  assert.equal(d.s, 395558742);
  assert.equal(rngInt(d, 100), 38);
  assert.equal(rngFloat(d), 0.10031384229660034);
});

test('random drawings: invariants of body and stats', () => {
  const rng = rngCreate(99);
  for (let i = 0; i < 300; i++) {
    const c = randomDrawing(rng, 0);
    const s = computeStats(c, W, H, T, 'figure');
    const b = extractBody(c, W, H);
    assert.equal(s.N, b.N);
    assert.equal(s.filled - s.N, s.drips);
    assert.ok(s.N <= s.filled);
    assert.ok(s.C + s.S <= s.N, 'a cell is never both core and sharp');
    assert.equal(s.colourCounts[0] + s.colourCounts[1] + s.colourCounts[2] + s.colourCounts[3], s.N);
    assert.equal(extractBody(b.body, W, H).N, b.N, 'the body alone is one group');
    assert.equal(extractBody(b.body, W, H).drips, 0);
    if (s.N > 0) { assert.ok(s.radius >= 0.5); assert.ok(s.cx > 0 && s.cx < 32 && s.cy > 0 && s.cy < 32); }
    assert.ok(Number.isFinite(s.armour) && Number.isFinite(s.sharpness) && Number.isFinite(s.topSpeed));
  }
});

test('random drawings: shifting, mirroring and recolouring keep N, C and S', () => {
  const rng = rngCreate(5);
  for (let i = 0; i < 100; i++) {
    const c = randomDrawing(rng, 2);
    const s = computeStats(c, W, H, T, 'figure');
    const shifted = blank(); const mirrored = blank();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const v = c[y * W + x];
      if (v === 0) continue;
      set(shifted, x + 1, y - 1, v);
      set(mirrored, 31 - x, y, v);
    }
    for (const d of [shifted, mirrored, recolour(c, 3)]) {
      const t = computeStats(d, W, H, T, 'figure');
      assert.equal(t.N, s.N); assert.equal(t.C, s.C); assert.equal(t.S, s.S);
    }
    assert.equal(computeStats(shifted, W, H, T, 'figure').element, s.element);
  }
});

test('adding ink never lowers weight, and more weight is never faster', () => {
  const a = blank(); rect(a, 10, 10, 15, 15, 1);
  const b = blank(); rect(b, 10, 10, 16, 15, 1);
  const sa = computeStats(a, W, H, T, 'figure'); const sb = computeStats(b, W, H, T, 'figure');
  assert.ok(sb.weight > sa.weight); assert.ok(sb.topSpeed < sa.topSpeed); assert.ok(sb.armour > sa.armour);
});

test('front vector stays a unit vector and turns toward the steering direction', () => {
  const b = createBody(fig('lance'), 0, 0, 0, -1, 0);
  const w = createWorld([b], 0);
  for (let i = 0; i < 400; i++) {
    stepWorld(w, [{ mx: 1, my: 0.3, dash: i % 50 === 0 }], T);
    assert.ok(Math.abs(b.fx * b.fx + b.fy * b.fy - 1) < 1e-12);
  }
  const l = Math.sqrt(1 + 0.09);
  assert.ok(Math.abs(b.fx - 1 / l) < 1e-12 && Math.abs(b.fy - 0.3 / l) < 1e-12);
  assert.ok(b.x > 0, 'moved to the right');
});

test('top speed is reached but not exceeded without a dash; dash is faster and has a cooldown', () => {
  const b = createBody(fig('disc'), 0, 0, 0, -1, 0);
  const w = createWorld([b], 0);
  for (let i = 0; i < 600; i++) stepWorld(w, [{ mx: 0, my: -1, dash: false }], T);
  const v = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
  assert.ok(v <= b.topSpeed + 1e-9 && v > b.topSpeed * 0.98);
  stepWorld(w, [{ mx: 0, my: -1, dash: true }], T);
  assert.ok(Math.sqrt(b.vx * b.vx + b.vy * b.vy) > b.topSpeed * 1.2);
  assert.equal(b.dashCd, T.physics.dashCooldownTicks);
  const cd = b.dashCd;
  stepWorld(w, [{ mx: 0, my: -1, dash: true }], T);
  assert.equal(b.dashCd, cd - 1, 'no second dash during the cooldown');
});

test('weight pushes: the heavier figure drives the lighter one back', () => {
  const heavy = createBody(fig('disc'), -12, 0, 1, 0, 0);
  const light = createBody(fig('dot'), 12, 0, -1, 0, 1);
  const w = createWorld([heavy, light], 0);
  for (let i = 0; i < 600 && light.hp > 0; i++) stepWorld(w, [{ mx: 1, my: 0, dash: false }, { mx: -1, my: 0, dash: false }], T);
  assert.ok(light.x > 12, 'light figure ends right of its start, x = ' + light.x);
});

test('contact damage: sharp or blunt, element multiplier, cooldown per direction', () => {
  const a = createBody(fig('line'), 0, 14, 0, -1, 0);    // black line, front up
  const b = createBody(fig('block'), 0, -14, 0, 1, 1);
  const w = createWorld([a, b], 0);
  const lastHit = {};
  let hits = 0;
  for (let i = 0; i < 900; i++) {
    stepWorld(w, [{ mx: 0, my: -1, dash: false }, { mx: 0, my: 1, dash: false }], T);
    for (const e of w.events) {
      if (e.type !== 'hit') continue;
      hits++;
      const key = e.from + '>' + e.to;
      if (lastHit[key] !== undefined) assert.ok(i - lastHit[key] >= T.physics.hitCooldownTicks, 'cooldown respected');
      lastHit[key] = i;
      if (e.sharp) assert.equal(e.damage, Math.max(T.stats.bluntDamage, w.bodies[e.from].fig.stats.sharpness));
      else assert.equal(e.damage, T.stats.bluntDamage);
    }
  }
  assert.ok(hits > 4, 'the two figures hit each other');
  assert.ok(a.hp < a.maxHp && b.hp < b.maxHp);
});

test('figures of one team do not damage each other', () => {
  const a = createBody(fig('line'), 0, 10, 0, -1, 1);
  const b = createBody(fig('block'), 0, -10, 0, 1, 1);
  const w = createWorld([a, b], 0);
  for (let i = 0; i < 300; i++) stepWorld(w, [{ mx: 0, my: -1, dash: false }, { mx: 0, my: 1, dash: false }], T);
  assert.equal(a.hp, a.maxHp); assert.equal(b.hp, b.maxHp);
});

test('ring radius never grows and reaches zero', () => {
  for (let n = 2; n <= 4; n++) {
    let prev = ringRadiusAt(T, n, 0);
    assert.equal(prev, T.ring.startRadius[n]);
    for (let t = 1; t < 6000; t++) { const r = ringRadiusAt(T, n, t); assert.ok(r <= prev); prev = r; }
    assert.equal(prev, 0);
  }
});

test('ring-out and armour loss eliminate; last one standing wins the round', () => {
  const m = ringCreateMatch(T, 2, 1);
  ringStartRound(T, m, [fig('disc'), fig('block')]);
  m.world.bodies[1].x = 1000;
  ringStep(T, m, [null, null]);
  assert.equal(m.phase, 'roundOver'); assert.equal(m.roundWinner, 0);
  assert.equal(m.outReason[1], 'ring'); assert.deepEqual(m.wins, [1, 0]); assert.deepEqual(m.lost, [0, 1]);
  ringStartRound(T, m, [fig('disc'), fig('block')]);
  m.world.bodies[0].hp = 0;
  ringStep(T, m, [null, null]);
  assert.equal(m.roundWinner, 1); assert.equal(m.outReason[0], 'armour');
});

test('catch-up ink: +15 percent per lost round up to the cap', () => {
  const m = ringCreateMatch(T, 2, 1);
  const base = T.ink.figureBudget; const p = T.ring.catchUpPercentPerLostRound;
  assert.equal(ringInkBudget(T, m, 0), base);
  m.lost[0] = 1; assert.equal(ringInkBudget(T, m, 0), Math.floor(base * (100 + p) / 100));
  m.lost[0] = 2; assert.equal(ringInkBudget(T, m, 0), Math.floor(base * (100 + 2 * p) / 100));
  m.lost[0] = 99; assert.equal(ringInkBudget(T, m, 0), Math.floor(base * (100 + T.ring.catchUpMaxSteps * p) / 100));
});

test('bot matches end, first to the win target takes the match, same seed gives the same hashes', () => {
  for (const [names, seed] of [[['disc', 'lance'], 3], [['star', 'wedge', 'needle'], 4], [['disc', 'star', 'comb', 'dot'], 5]]) {
    const run = () => {
      const hashes = [];
      const m = playRingMatch(T, names.map(fig), seed, (mm) => { if (mm.tick % 200 === 0) hashes.push(hashRing(mm)); }, null);
      return { m, hashes };
    };
    const a = run(); const b = run();
    assert.equal(a.m.phase, 'matchOver');
    assert.equal(a.m.wins[a.m.matchWinner], T.ring.winsToTakeMatch);
    assert.equal(a.m.wins.reduce((x, y) => x + y, 0), a.m.round);
    assert.deepEqual(a.hashes, b.hashes);
    for (const body of a.m.world.bodies) assert.ok(Number.isFinite(body.x) && Number.isFinite(body.y) && Number.isFinite(body.hp));
  }
});

test('human input replaces the bot for a seat; idle seats stay where they are', () => {
  const m = ringCreateMatch(T, 2, 9);
  ringStartRound(T, m, [fig('disc'), fig('block')]);
  const x1 = m.world.bodies[1].x;
  const idle = { mx: 0, my: 0, dash: false };
  for (let i = 0; i < 30; i++) ringStep(T, m, ringBotInputs(T, m, [idle, idle]));
  assert.equal(m.world.bodies[1].x, x1);
});

// M3
test('M3: the Ring refuses figures that are too small or over the seat budget', () => {
  const m = ringCreateMatch(T, 2, 1);
  const empty = buildFigure(blank(), W, H, T, 'figure');
  const full = blank(); rect(full, 0, 0, 31, 31, 1);
  const fullFig = buildFigure(full, W, H, T, 'figure');
  assert.equal(ringCheckFigure(T, m, 0, empty), 'tooSmall');
  assert.equal(ringCheckFigure(T, m, 0, fullFig), 'overBudget');
  assert.equal(ringCheckFigure(T, m, 0, fig('disc')), '');
  assert.throws(() => ringStartRound(T, m, [empty, fig('disc')]), /seat 0 figure: tooSmall/);
  assert.throws(() => ringStartRound(T, m, [fig('disc'), fullFig]), /seat 1 figure: overBudget/);
  assert.equal(m.phase, 'draw', 'a refused start changes nothing');
  assert.equal(m.round, 0);
  // drips count against the budget; catch-up ink widens it
  const big = blank(); rect(big, 4, 10, 26, 20, 1); // 253 cells
  const bigFig = buildFigure(big, W, H, T, 'figure', 253);
  assert.equal(ringCheckFigure(T, m, 1, bigFig), 'overBudget');
  m.lost[1] = 1;
  assert.equal(ringInkBudget(T, m, 1), 253);
  assert.equal(ringCheckFigure(T, m, 1, bigFig), '');
});

// M5
test('M5: the ring hash sees cooldowns, dash direction, bot wobble, bot style and the round', () => {
  const start = () => { const m = ringCreateMatch(T, 2, 5); ringStartRound(T, m, [fig('disc'), fig('lance')]); return m; };
  const base = hashRing(start());
  const changes = [
    (m) => { m.world.cd[1] = 3; },
    (m) => { m.world.bodies[0].dashDx = 1; },
    (m) => { m.world.bodies[1].dashDy = -1; },
    (m) => { m.botWobble[1] = 1; },
    (m) => { m.botStyle[0] = 1; },
    (m) => { m.round = 2; },
  ];
  for (let i = 0; i < changes.length; i++) { const m = start(); changes[i](m); assert.notEqual(hashRing(m), base, 'change ' + i); }
  assert.equal(hashRing(start()), base);
});

test('both bot styles steer with a vector of length at most 1 and finish rounds', () => {
  for (const styles of [[1, 1], [0, 1], [1, 0, 1, 0]]) {
    const names = styles.length === 2 ? ['line', 'block'] : ['hoop', 'disc', 'needle', 'star'];
    const m = playRingMatch(T, names.map(fig), 31, (mm) => {
      const inp = ringBotInputs(T, { ...mm, botRng: mm.botRng.map((r) => ({ s: r.s })), botWobble: mm.botWobble.slice() }, null);
      for (const x of inp) assert.ok(x.mx * x.mx + x.my * x.my <= 1 + 1e-9);
    }, null, styles);
    assert.equal(m.phase, 'matchOver');
  }
});
