// Mode A "Solo Arena": hero plus thrown weapon, one enemy design per wave with
// copies paid from the wave budget, stakes, ink drops, upgrades, boss.
// Body 0 of the world is always the hero (team 0); enemies are team 1.

import { buildFigure, createBody, createWorld, stepWorld } from './physics.js';
import { computeStats, extractBody, elementMultiplier } from './drawing.js';
import { rngCreate, rngFloat } from './rng.js';
import { botEnemyInput } from './bots.js';

export const SOLO_WAVES = 5; // the boss is fought as wave index 5

// Check a drawing for the run. kind: 'hero' | 'weapon' | 'enemy'.
// Returns { ok, reason, stats }. reason: '' | 'tooSmall' | 'overBudget' | 'colourLocked'.
export function soloCheckDrawing(tuning, run, cells, W, H, kind) {
  const budget = kind === 'hero' ? run.heroBudget : kind === 'weapon' ? run.weaponBudget : tuning.solo.enemyInkBudget;
  const stats = computeStats(cells, W, H, tuning, kind === 'weapon' ? 'weapon' : 'figure', budget);
  let reason = '';
  if (!stats.bigEnough) reason = 'tooSmall';
  else if (!stats.withinBudget) reason = 'overBudget';
  else if (kind !== 'enemy') {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] !== 0 && !run.colours[cells[i]]) { reason = 'colourLocked'; break; }
    }
  }
  return { ok: reason === '', reason, stats };
}

// startColour: 2, 3 or 4, the one colour the run starts with besides Black
// (0 = Black only).
export function soloCreateRun(tuning, seed, heroCells, weaponCells, W, H, startColour) {
  const run = {
    mode: 'solo',
    seed,
    rng: rngCreate(seed),
    phase: 'prepare',     // 'prepare' | 'fight' | 'cleared' | 'dead' | 'won'
    endReason: '',        // 'armour' | 'time' when phase is 'dead'
    wave: 0,              // index of the wave to start or being fought; 5 = boss
    W, H,
    heroBudget: tuning.ink.figureBudget,
    weaponBudget: tuning.ink.weaponBudget,
    colours: [false, true, startColour === 2, startColour === 3, startColour === 4],
    heroFig: null, weaponFig: null,
    heroHp: 0, heroMaxHp: 0,
    enemyDrawings: [],    // body cells of every wave design, for the boss
    wallet: 0, score: 0,
    upgradeTaken: false,
    world: null,
    shots: [], drops: [],
    events: [],
    tick: 0, throwCd: 0,
    copies: 0, stake: 1,
  };
  let chk = soloCheckDrawing(tuning, run, heroCells, W, H, 'hero');
  if (!chk.ok) throw new Error('hero drawing: ' + chk.reason);
  chk = soloCheckDrawing(tuning, run, weaponCells, W, H, 'weapon');
  if (!chk.ok) throw new Error('weapon drawing: ' + chk.reason);
  run.heroFig = buildFigure(heroCells, W, H, tuning, 'figure', run.heroBudget);
  run.weaponFig = buildFigure(weaponCells, W, H, tuning, 'weapon', run.weaponBudget);
  run.heroHp = run.heroFig.stats.armour;
  run.heroMaxHp = run.heroHp;
  return run;
}

// Number of enemy copies a design gets in a wave.
export function soloCopies(tuning, waveIndex, stakeIndex, N) {
  const so = tuning.solo;
  let copies = Math.floor(so.waveBudgets[waveIndex] * so.stakes[stakeIndex] / N);
  if (copies < 1) copies = 1;
  if (copies > so.maxCopies) copies = so.maxCopies;
  return copies;
}

export function soloThrowIntervalTicks(tuning, weaponN) {
  return tuning.solo.throwIntervalBaseTicks + Math.floor(weaponN * tuning.solo.throwIntervalTicksPerInk);
}

function randomUnit(run) {
  for (;;) {
    const x = rngFloat(run.rng) * 2 - 1;
    const y = rngFloat(run.rng) * 2 - 1;
    const l2 = x * x + y * y;
    if (l2 > 0.01 && l2 <= 1) {
      const l = Math.sqrt(l2);
      return [x / l, y / l];
    }
  }
}

function beginFight(tuning, run, enemyBodies) {
  const hero = createBody(run.heroFig, 0, 0, 0, -1, 0, 1, 1, 1);
  hero.hp = run.heroHp;
  hero.maxHp = run.heroMaxHp;
  const bodies = [hero];
  for (let i = 0; i < enemyBodies.length; i++) bodies.push(enemyBodies[i]);
  run.world = createWorld(bodies, tuning.solo.arenaRadius);
  run.shots = [];
  run.drops = [];
  run.tick = 0;
  run.throwCd = soloThrowIntervalTicks(tuning, run.weaponFig.stats.N);
  run.upgradeTaken = false;
  run.phase = 'fight';
}

function spawnEnemy(tuning, run, fig, armourMult) {
  const so = tuning.solo;
  const u = randomUnit(run);
  const d = so.arenaRadius - so.enemySpawnInset;
  return createBody(fig, u[0] * d, u[1] * d, -u[0], -u[1], 1, armourMult, so.enemySpeedMult, so.enemyDamageMult);
}

// Start wave run.wave (0..4) with the player's enemy drawing and stake index.
export function soloStartWave(tuning, run, enemyCells, stakeIndex) {
  if (run.phase !== 'prepare' && run.phase !== 'cleared') throw new Error('cannot start a wave now');
  if (run.wave >= SOLO_WAVES) throw new Error('all waves done, start the boss');
  const chk = soloCheckDrawing(tuning, run, enemyCells, run.W, run.H, 'enemy');
  if (!chk.ok) throw new Error('enemy drawing: ' + chk.reason);
  const fig = buildFigure(enemyCells, run.W, run.H, tuning, 'figure', tuning.solo.enemyInkBudget);
  run.enemyDrawings.push(extractBody(enemyCells, run.W, run.H).body);
  run.copies = soloCopies(tuning, run.wave, stakeIndex, fig.stats.N);
  run.stake = tuning.solo.stakes[stakeIndex];
  const enemies = [];
  for (let i = 0; i < run.copies; i++) enemies.push(spawnEnemy(tuning, run, fig, tuning.solo.enemyArmourMult));
  beginFight(tuning, run, enemies);
}

// The boss drawing: cell-wise union of the bodies of all wave designs; where
// several designs have ink the earliest wave gives the colour.
export function soloBossCells(run) {
  const total = run.W * run.H;
  const cells = new Array(total);
  for (let i = 0; i < total; i++) cells[i] = 0;
  for (let w = 0; w < run.enemyDrawings.length; w++) {
    const d = run.enemyDrawings[w];
    for (let i = 0; i < total; i++) if (cells[i] === 0 && d[i] !== 0) cells[i] = d[i];
  }
  return cells;
}

export function soloStartBoss(tuning, run) {
  if (run.phase !== 'cleared' || run.wave !== SOLO_WAVES) throw new Error('boss not due');
  const so = tuning.solo;
  const total = run.W * run.H;
  const bossFig = buildFigure(soloBossCells(run), run.W, run.H, tuning, 'figure', total);
  const enemies = [spawnEnemy(tuning, run, bossFig, so.bossArmourMult)];
  for (let w = 0; w < run.enemyDrawings.length; w++) {
    const fig = buildFigure(run.enemyDrawings[w], run.W, run.H, tuning, 'figure', total);
    for (let c = 0; c < so.bossEscortCopies; c++) enemies.push(spawnEnemy(tuning, run, fig, so.enemyArmourMult));
  }
  run.copies = enemies.length;
  run.stake = 1;
  beginFight(tuning, run, enemies);
}

// Upgrade between waves; one per break. kind: 'heroInk' (payload = new hero
// cells), 'weaponInk' (payload = new weapon cells), 'heal', 'colour'
// (payload = colour 2..4). Returns '' on success or the reason it failed.
export function soloUpgrade(tuning, run, kind, payload) {
  const so = tuning.solo;
  if (run.phase !== 'cleared') return 'notNow';
  if (run.upgradeTaken) return 'alreadyTaken';
  const cost = so.upgradeCost[run.wave - 1];
  if (run.wallet < cost) return 'tooExpensive';
  if (kind === 'heroInk') {
    run.heroBudget += so.upgradeHeroInk;
    const chk = soloCheckDrawing(tuning, run, payload, run.W, run.H, 'hero');
    if (!chk.ok) { run.heroBudget -= so.upgradeHeroInk; return chk.reason; }
    const damageTaken = run.heroMaxHp - run.heroHp;
    run.heroFig = buildFigure(payload, run.W, run.H, tuning, 'figure', run.heroBudget);
    run.heroMaxHp = run.heroFig.stats.armour;
    run.heroHp = run.heroMaxHp - damageTaken;
    if (run.heroHp < 1) run.heroHp = 1;
  } else if (kind === 'weaponInk') {
    run.weaponBudget += so.upgradeWeaponInk;
    const chk = soloCheckDrawing(tuning, run, payload, run.W, run.H, 'weapon');
    if (!chk.ok) { run.weaponBudget -= so.upgradeWeaponInk; return chk.reason; }
    run.weaponFig = buildFigure(payload, run.W, run.H, tuning, 'weapon', run.weaponBudget);
  } else if (kind === 'heal') {
    run.heroHp += run.heroMaxHp * so.upgradeHealPercent / 100;
    if (run.heroHp > run.heroMaxHp) run.heroHp = run.heroMaxHp;
  } else if (kind === 'colour') {
    if (payload < 2 || payload > 4 || run.colours[payload]) return 'badColour';
    run.colours[payload] = true;
  } else {
    return 'unknownUpgrade';
  }
  run.wallet -= cost;
  run.upgradeTaken = true;
  return '';
}

// One tick of a wave. input = { mx, my, dash } for the hero.
export function soloStep(tuning, run, input) {
  if (run.phase !== 'fight') return;
  const so = tuning.solo;
  const world = run.world;
  const bodies = world.bodies;
  const n = bodies.length;
  const hero = bodies[0];
  const inputs = [input];
  for (let i = 1; i < n; i++) inputs.push(botEnemyInput(tuning, run, i));
  stepWorld(world, inputs, tuning);
  run.tick++;
  run.events = world.events;
  const wst = run.weaponFig.stats;

  // throw at the nearest enemy
  run.throwCd--;
  if (run.throwCd <= 0) {
    let near = -1;
    let nearD2 = 0;
    for (let i = 1; i < n; i++) {
      if (!bodies[i].alive) continue;
      const dx = bodies[i].x - hero.x;
      const dy = bodies[i].y - hero.y;
      const d2 = dx * dx + dy * dy;
      if (near === -1 || d2 < nearD2) { near = i; nearD2 = d2; }
    }
    if (near !== -1 && nearD2 > 0) {
      const d = Math.sqrt(nearD2);
      const sp = so.throwSpeedBase / (1 + wst.N / so.throwSpeedWeightRef);
      const ux = (bodies[near].x - hero.x) / d;
      const uy = (bodies[near].y - hero.y) / d;
      run.shots.push({ x: hero.x, y: hero.y, ux, uy, speed: sp, life: so.projectileLifeTicks });
      run.throwCd = soloThrowIntervalTicks(tuning, wst.N);
      run.events.push({ type: 'throw' });
    }
  }

  // shots
  const dt = 1 / tuning.physics.tickRate;
  let pr = run.weaponFig.radius;
  if (pr > so.projectileRadiusMax) pr = so.projectileRadiusMax;
  const keptShots = [];
  for (let s = 0; s < run.shots.length; s++) {
    const shot = run.shots[s];
    shot.x += shot.ux * shot.speed * dt;
    shot.y += shot.uy * shot.speed * dt;
    shot.life--;
    let hit = -1;
    for (let i = 1; i < n && hit === -1; i++) {
      const e = bodies[i];
      if (!e.alive) continue;
      const dx = shot.x - e.x;
      const dy = shot.y - e.y;
      const reach = e.fig.radius + pr;
      if (dx * dx + dy * dy >= reach * reach) continue;
      const ef = e.fig;
      const c = -e.fy;
      const sn = e.fx;
      const rr = (pr + 0.5) * (pr + 0.5);
      for (let bi = 0; bi < ef.boundary.length; bi++) {
        const k = ef.boundary[bi];
        const wx = e.x + c * ef.lx[k] - sn * ef.ly[k] - shot.x;
        const wy = e.y + sn * ef.lx[k] + c * ef.ly[k] - shot.y;
        if (wx * wx + wy * wy < rr) { hit = i; break; }
      }
    }
    if (hit !== -1) {
      const e = bodies[hit];
      const dmg = wst.sharpness * elementMultiplier(tuning, wst.element, e.fig.stats.element);
      e.hp -= dmg;
      const kb = wst.N * so.weaponKnockbackPerInk / e.fig.mass;
      e.vx += shot.ux * kb;
      e.vy += shot.uy * kb;
      run.events.push({ type: 'shotHit', to: hit, damage: dmg });
    } else if (shot.life > 0) {
      keptShots.push(shot);
    }
  }
  run.shots = keptShots;

  // enemy deaths leave ink
  let enemiesAlive = 0;
  for (let i = 1; i < n; i++) {
    const e = bodies[i];
    if (!e.alive) continue;
    if (e.hp <= 0) {
      e.alive = false;
      run.drops.push({ x: e.x, y: e.y, value: e.fig.stats.N, life: so.dropLifeTicks });
      run.events.push({ type: 'enemyDown', index: i });
    } else {
      enemiesAlive++;
    }
  }

  // drops: pick up, then age
  const keptDrops = [];
  const pick = hero.fig.radius + so.pickupRange;
  for (let d = 0; d < run.drops.length; d++) {
    const drop = run.drops[d];
    const dx = drop.x - hero.x;
    const dy = drop.y - hero.y;
    if (dx * dx + dy * dy <= pick * pick) {
      run.wallet += drop.value;
      run.score += drop.value;
      run.events.push({ type: 'pickup', value: drop.value });
      continue;
    }
    drop.life--;
    if (drop.life > 0) keptDrops.push(drop);
  }
  run.drops = keptDrops;

  run.heroHp = hero.hp;
  if (hero.hp <= 0) {
    hero.alive = false;
    run.phase = 'dead';
    run.endReason = 'armour';
    return;
  }
  if (enemiesAlive === 0) {
    // ink still lying around is collected when the wave ends
    for (let d = 0; d < run.drops.length; d++) {
      run.wallet += run.drops[d].value;
      run.score += run.drops[d].value;
    }
    run.drops = [];
    run.shots = [];
    if (run.wave === SOLO_WAVES) {
      run.phase = 'won';
    } else {
      run.wave++;
      run.phase = 'cleared';
    }
    return;
  }
  if (run.tick >= so.waveMaxTicks) {
    run.phase = 'dead';
    run.endReason = 'time';
  }
}
