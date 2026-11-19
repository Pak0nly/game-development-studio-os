import test from 'node:test';
import assert from 'node:assert/strict';
import {
  soloCreateRun, soloStartWave, soloStartBoss, soloStep, soloUpgrade, soloCopies, soloBossCells, soloCheckDrawing,
  soloThrowIntervalTicks, botHeroInput, hashSolo, extractBody, SOLO_WAVES,
} from '../core/index.js';
import { loadTuning } from '../tools/load_tuning.js';
import { blank, rect, recolour, W, H, archetype } from '../sim/archetypes.js';
import { playSoloRun, playSoloFight } from '../sim/runner.js';

const T = loadTuning();
const black = (name) => recolour(archetype(name).cells, 1);
const newRun = (seed) => soloCreateRun(T, seed, black('disc'), black('needle'), W, H, 0);

test('copies are paid from the wave budget times the stake', () => {
  const so = T.solo;
  for (let w = 0; w < SOLO_WAVES; w++) for (let s = 0; s < 3; s++) for (const N of [12, 20, 63, 210]) {
    let expect = Math.floor(so.waveBudgets[w] * so.stakes[s] / N);
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
  if (run.phase === 'cleared') { assert.equal(run.wave, 1); assert.equal(run.score, run.copies * 13, 'all ink of the wave is collected by the end'); }
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
