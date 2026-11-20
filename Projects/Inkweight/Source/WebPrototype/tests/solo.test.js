import test from 'node:test';
import assert from 'node:assert/strict';
import {
  soloCreateRun, soloStartWave, soloStartBoss, soloStep, soloUpgrade, soloCopies, soloBossCells, soloCheckDrawing,
  soloThrowIntervalTicks, soloDropValue, botHeroInput, hashSolo, extractBody, SOLO_WAVES,
} from '../core/index.js';
import { loadTuning } from '../tools/load_tuning.js';
import { blank, rect, recolour, W, H, archetype } from '../sim/archetypes.js';
import { playSoloRun, playSoloFight } from '../sim/runner.js';
import { buildFigure, soloEnemyArmour, soloWaveArmourScale } from '../core/index.js';

const T = loadTuning();
const black = (name) => recolour(archetype(name).cells, 1);
const newRun = (seed) => soloCreateRun(T, seed, black('disc'), black('needle'), W, H, 0);

test('copies are paid from the wave budget times the stake', () => {
  const so = T.solo;
  for (let w = 0; w < SOLO_WAVES; w++) for (let s = 0; s < 3; s++) for (const N of [12, 20, 63, 210]) {
    let expect = Math.floor(so.waveBudgets[w] * so.stakes[s] / (N + so.copyInkOverhead));
    if (expect < 1) expect = 1;
    if (expect > so.maxCopies) expect = so.maxCopies;
    assert.equal(soloCopies(T, w, s, N), expect);
  }
  assert.equal(soloCopies(T, 0, 0, 100000), 1, 'at least one copy');
  assert.ok(soloCopies(T, 2, 2, 13) >= soloCopies(T, 2, 0, 13));
});

test('heavier weapons are thrown less often', () => {
  assert.ok(soloThrowIntervalTicks(T, 60) > soloThrowIntervalTicks(T, 12));
});

test('invalid hero, weapon and enemy drawings are refused', () => {
  const tiny = blank(); rect(tiny, 0, 0, 3, 0, 1);
  assert.throws(() => soloCreateRun(T, 1, tiny, black('needle'), W, H, 0));
  assert.throws(() => soloCreateRun(T, 1, black('disc'), black('disc'), W, H, 0), /weapon/);
  assert.throws(() => soloCreateRun(T, 1, archetype('cross').cells, black('needle'), W, H, 0), /colourLocked/);
  const run = soloCreateRun(T, 1, archetype('cross').cells, black('needle'), W, H, 2);
  assert.equal(run.phase, 'prepare');
  assert.equal(soloCheckDrawing(T, run, tiny, W, H, 'enemy').reason, 'tooSmall');
  assert.equal(soloCheckDrawing(T, run, archetype('comb').cells, W, H, 'enemy').ok, true, 'enemies may use any colour');
  assert.throws(() => soloStartWave(T, run, tiny, 0));
});

test('a wave spawns the paid copies inside the arena and the fight ends', () => {
  const run = newRun(3);
  soloStartWave(T, run, archetype('dot').cells, 1);
  assert.equal(run.world.bodies.length, 1 + run.copies);
  assert.equal(run.copies, soloCopies(T, 0, 1, 13));
  playSoloFight(T, run, 0, (r) => {
    for (const b of r.world.bodies) if (b.alive) assert.ok(b.x * b.x + b.y * b.y <= T.solo.arenaRadius * T.solo.arenaRadius * 1.000001);
  });
  assert.ok(run.phase === 'cleared' || run.phase === 'dead');
  assert.ok(run.tick <= T.solo.waveMaxTicks);
  if (run.phase === 'cleared') { assert.equal(run.wave, 1); assert.equal(run.score, run.copies * soloDropValue(T, 0, 1, 13), 'all ink of the wave is collected by the end'); }
});

test('upgrades: cost, one per break, heal, colour, redraw with more ink', () => {
  const run = newRun(4);
  assert.equal(soloUpgrade(T, run, 'heal', null), 'notNow');
  run.phase = 'cleared'; run.wave = 1; run.wallet = 0;
  assert.equal(soloUpgrade(T, run, 'heal', null), 'tooExpensive');
  run.wallet = 1000; run.heroHp = 1;
  assert.equal(soloUpgrade(T, run, 'heal', null), '');
  assert.equal(run.wallet, 1000 - T.solo.upgradeCost[0]);
  assert.equal(run.heroHp, 1 + run.heroMaxHp * T.solo.upgradeHealPercent / 100);
  assert.equal(soloUpgrade(T, run, 'colour', 2), 'alreadyTaken');
  run.upgradeTaken = false;
  assert.equal(soloUpgrade(T, run, 'colour', 1), 'badColour');
  assert.equal(soloUpgrade(T, run, 'colour', 3), '');
  assert.equal(run.colours[3], true);
  run.upgradeTaken = false;
  const big = blank(); rect(big, 4, 4, 23, 16, 1); // 260 cells
  assert.equal(soloUpgrade(T, run, 'heroInk', big), T.solo.upgradeHeroInk >= 40 ? '' : 'overBudget');
  run.upgradeTaken = false;
  const huge = blank(); rect(huge, 0, 0, 31, 31, 1);
  const budget = run.heroBudget;
  assert.equal(soloUpgrade(T, run, 'heroInk', huge), 'overBudget');
  assert.equal(run.heroBudget, budget, 'a refused redraw changes nothing');
});

test('boss drawing is the union of the wave designs; earliest wave gives the colour', () => {
  const run = newRun(5);
  const names = ['dot', 'cross', 'ring', 'star', 'block'];
  for (const n of names) run.enemyDrawings.push(extractBody(archetype(n).cells, W, H).body);
  const boss = soloBossCells(run);
  for (let i = 0; i < W * H; i++) {
    let first = 0;
    for (const n of names) { const v = archetype(n).cells[i]; if (v !== 0) { first = v; break; } }
    assert.equal(boss[i], first);
  }
});

test('a full bot run is deterministic and reaches a final state', () => {
  const plan = { style: 1, boss: true, waves: ['dot', 'needle', 'frame', 'line', 'cross'].map((n) => ({ enemy: archetype(n).cells, stake: 0, upgrade: 'heal' })) };
  const go = () => {
    const hashes = [];
    const r = playSoloRun(T, 77, black('hedgehog'), black('dot'), W, H, 0, plan, (run) => { if (run.tick % 300 === 0) hashes.push(hashSolo(run)); }, null);
    return { r, hashes };
  };
  const a = go(); const b = go();
  assert.deepEqual(a.hashes, b.hashes);
  assert.ok(['won', 'dead'].includes(a.r.run.phase), 'phase ' + a.r.run.phase);
  assert.ok(Number.isFinite(a.r.run.heroHp));
  assert.ok(a.r.run.score >= a.r.run.wallet);
});

test('hero bot returns a steering vector of length at most 1', () => {
  const run = newRun(6);
  soloStartWave(T, run, archetype('needle').cells, 2);
  for (let i = 0; i < 200 && run.phase === 'fight'; i++) {
    const inp = botHeroInput(T, run, i % 2);
    assert.ok(inp.mx * inp.mx + inp.my * inp.my <= 1 + 1e-12);
    soloStep(T, run, inp);
  }
});

test('boss can only be started after wave five', () => {
  const run = newRun(8);
  assert.throws(() => soloStartBoss(T, run));
});

// M7, task 6 and review finding I6: the stake matters for danger and reward and is never free
test('stake: a wave pays its staked budget and never more; enemies get faster, hit harder and carry the unspent ink as armour', () => {
  const so = T.solo;
  for (let w = 0; w < SOLO_WAVES; w++) for (let s = 0; s < 3; s++) for (const N of [12, 13, 20, 63, 120, 210]) {
    const copies = soloCopies(T, w, s, N);
    const v = soloDropValue(T, w, s, N);
    const staked = so.waveBudgets[w] * so.stakes[s];
    assert.equal(v, Math.floor(staked / copies));
    assert.ok(copies * v <= staked, 'never more than the staked budget');
    assert.ok(copies * v > staked - copies, 'rounded down per drop only');
    const scale = soloWaveArmourScale(T, w, s, N);
    let expect = staked / (copies * (N + so.copyInkOverhead));
    if (expect < so.copyArmourScaleMin) expect = so.copyArmourScaleMin;
    if (expect > so.copyArmourScaleMax) expect = so.copyArmourScaleMax;
    assert.equal(scale, expect);
  }
  // a 13-cell design is at the copy cap in the last wave at the two higher stakes: reward and armour still grow
  assert.equal(soloCopies(T, 4, 1, 13), so.maxCopies);
  assert.equal(soloCopies(T, 4, 2, 13), so.maxCopies);
  assert.ok(soloDropValue(T, 4, 2, 13) > soloDropValue(T, 4, 1, 13));
  assert.ok(soloWaveArmourScale(T, 4, 2, 13) > soloWaveArmourScale(T, 4, 1, 13));
  const speeds = []; const dmg = [];
  for (let s = 0; s < 3; s++) {
    const run = newRun(9);
    soloStartWave(T, run, archetype('dot').cells, s);
    const e = run.world.bodies[1];
    speeds.push(e.topSpeed); dmg.push(e.damageMult);
    assert.equal(e.topSpeed, e.fig.stats.topSpeed * (so.enemySpeedMult * so.stakeSpeedMult[s]));
    assert.equal(e.damageMult, so.enemyDamageMult * so.stakeDamageMult[s]);
    assert.equal(e.hp, so.enemyArmourMult * e.fig.stats.armour * soloWaveArmourScale(T, 0, s, 13));
    assert.equal(e.maxHp, e.hp);
    assert.equal(run.stakeIndex, s);
    assert.equal(run.dropValue, soloDropValue(T, 0, s, 13));
  }
  assert.ok(speeds[2] > speeds[1] && speeds[1] > speeds[0]);
  assert.ok(dmg[2] > dmg[1] && dmg[1] > dmg[0]);
  const run = newRun(10);
  assert.throws(() => soloStartWave(T, run, archetype('dot').cells, 3), /stake/);
  assert.throws(() => soloStartWave(T, run, archetype('dot').cells, -1), /stake/);
  assert.throws(() => soloStartWave(T, run, archetype('dot').cells, 0.5), /stake/);
});

// I6: the Reviewer's free-money enemy, a heavy drawing without core cells
test('I6: a heavy drawing without core cells is neither fragile nor overpaid as an enemy', () => {
  const so = T.solo;
  const spiral = buildFigure(archetype('spiral').cells, W, H, T, 'figure');
  const splinter = buildFigure(archetype('splinter').cells, W, H, T, 'figure');
  assert.equal(spiral.stats.C, 0);
  assert.ok(soloEnemyArmour(T, spiral, 1) > 1.5 * soloEnemyArmour(T, splinter, 1), 'enemy armour grows with size');
  for (let s = 0; s < 3; s++) {
    assert.equal(soloCopies(T, 0, s, spiral.stats.N), 1);
    assert.equal(soloDropValue(T, 0, s, spiral.stats.N), so.waveBudgets[0] * so.stakes[s], 'one copy pays the staked budget, not its own ink');
    assert.ok(soloDropValue(T, 0, s, spiral.stats.N) <= so.waveBudgets[0] * so.stakes[s]);
  }
  // the stake is not free: with one copy at every stake the copy gets tougher, faster and hits harder
  const hp = [];
  for (let s = 0; s < 3; s++) {
    const run = newRun(15);
    soloStartWave(T, run, archetype('spiral').cells, s);
    assert.equal(run.copies, 1);
    hp.push(run.world.bodies[1].hp);
  }
  assert.ok(hp[2] > hp[1] && hp[1] >= hp[0], 'armour by stake ' + hp);
  assert.ok(hp[2] > hp[0]);
});

test('enemy copies: armour follows the drawing, the boss keeps full armour', () => {
  const thin = buildFigure(archetype('splinter').cells, W, H, T, 'figure');
  const solid = buildFigure(archetype('block').cells, W, H, T, 'figure');
  assert.equal(soloEnemyArmour(T, thin, 1), T.solo.enemyArmourMult * thin.stats.armour);
  assert.ok(soloEnemyArmour(T, solid, 1) > 3 * soloEnemyArmour(T, thin, 1));
  const run = newRun(14);
  for (const n of ['dot', 'cross', 'ring', 'star', 'block']) run.enemyDrawings.push(extractBody(archetype(n).cells, W, H).body);
  run.phase = 'cleared'; run.wave = SOLO_WAVES;
  soloStartBoss(T, run);
  const boss = run.world.bodies[1];
  assert.equal(boss.hp, boss.fig.stats.armour * T.solo.bossArmourMult);
  assert.equal(run.world.bodies.length, 2 + 5 * T.solo.bossEscortCopies);
  assert.equal(run.world.bodies[2].hp, soloEnemyArmour(T, run.world.bodies[2].fig, 1));
  assert.equal(run.dropValue, 0);
});

// M2 (kept and documented): hero death is checked before the cleared wave
test('M2: when the hero and the last enemy fall in the same tick the run is lost', () => {
  const run = newRun(11);
  soloStartWave(T, run, archetype('block').cells, 0);
  assert.equal(run.copies, 1);
  const hero = run.world.bodies[0]; const enemy = run.world.bodies[1];
  enemy.x = 12; enemy.y = 0; hero.hp = 0.01; enemy.hp = 0.01;
  soloStep(T, run, { mx: 0, my: 0, dash: false });
  assert.equal(enemy.alive, false);
  assert.equal(run.phase, 'dead');
  assert.equal(run.endReason, 'armour');
});

// M6
test('M6: a shot is not spent on an enemy that is already at 0 armour', () => {
  const run = newRun(12);
  soloStartWave(T, run, archetype('block').cells, 2);
  assert.ok(run.copies >= 1);
  const enemy = run.world.bodies[1];
  enemy.hp = 0;
  run.throwCd = 1000;
  run.shots.push({ x: enemy.x, y: enemy.y, ux: 1, uy: 0, speed: 0, life: 50 });
  soloStep(T, run, { mx: 0, my: 0, dash: false });
  assert.ok(!run.events.some((e) => e.type === 'shotHit'), 'no hit on the fallen enemy');
  assert.ok(run.events.some((e) => e.type === 'enemyDown'));
  if (run.phase === 'fight') assert.equal(run.shots.length, 1, 'the shot flies on');
});

// M5
test('M5: the solo hash sees budgets, colours, the upgrade flag, the wave and the cooldowns', () => {
  const start = () => { const r = newRun(13); soloStartWave(T, r, archetype('needle').cells, 1); return r; };
  const base = hashSolo(start());
  const changes = [
    (r) => { r.heroBudget += 40; }, (r) => { r.weaponBudget += 15; }, (r) => { r.colours[3] = true; },
    (r) => { r.upgradeTaken = true; }, (r) => { r.wave = 2; }, (r) => { r.world.cd[1] = 5; },
    (r) => { r.world.bodies[1].dashDx = 1; }, (r) => { r.dropValue += 1; }, (r) => { r.stakeIndex = 2; },
  ];
  for (let i = 0; i < changes.length; i++) { const r = start(); changes[i](r); assert.notEqual(hashSolo(r), base, 'change ' + i); }
  assert.equal(hashSolo(start()), base);
});
