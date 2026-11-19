// Headless balance simulation for the Ring (and a solo smoke run).
//
//   node sim/balance.js [--seeds 40] [--ffa 600] [--neutral] [--quick]
//                       [--set path=value ...] [--out dir] [--label text]
//
// --neutral recolours every archetype black (shape effect without elements).
// --set overrides tuning values for experiments (does not change the file).
// --out writes BALANCE_REPORT.json and BALANCE_REPORT.md into the directory.

import { writeFileSync } from 'node:fs';
import { buildFigure, rngCreate, rngInt } from '../core/index.js';
import { ARCHETYPES, W, H, recolour, archetype } from './archetypes.js';
import { playSingleRound, playSoloRun } from './runner.js';
import { loadTuning, applyOverrides } from '../tools/load_tuning.js';

function parseArgs(argv) {
  const a = { seeds: 40, ffa: 600, neutral: false, set: {}, out: '', label: '', solo: true };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--seeds') a.seeds = Number(argv[++i]);
    else if (k === '--ffa') a.ffa = Number(argv[++i]);
    else if (k === '--neutral') a.neutral = true;
    else if (k === '--quick') { a.seeds = 10; a.ffa = 150; a.solo = false; }
    else if (k === '--nosolo') a.solo = false;
    else if (k === '--out') a.out = argv[++i];
    else if (k === '--label') a.label = argv[++i];
    else if (k === '--set') { const [p, v] = argv[++i].split('='); a.set[p] = Number(v); }
    else throw new Error('unknown argument ' + k);
  }
  return a;
}

function pct(x) { return (100 * x).toFixed(1); }

export function runRingBalance(tuning, opts) {
  const field = ARCHETYPES.map((a) => {
    const cells = opts.neutral ? recolour(a.cells, 1) : a.cells;
    return { name: a.name, shape: a.shape, fig: buildFigure(cells, W, H, tuning, 'figure') };
  });
  const n = field.length;
  // 1v1 round robin: every pair plays `seeds` single rounds, start sides alternate.
  const wins = field.map(() => field.map(() => 0));
  const games = field.map(() => field.map(() => 0));
  let ringOuts = 0;
  let armourOuts = 0;
  let totalTicks = 0;
  let rounds = 0;
  const outBy = field.map(() => ({ ring: 0, armour: 0 }));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let s = 0; s < opts.seeds; s++) {
        const seed = 1000003 * (i * n + j) + s;
        const r = playSingleRound(tuning, [field[i].fig, field[j].fig], seed, s % 2);
        const w = r.winner === 0 ? i : j;
        const l = r.winner === 0 ? j : i;
        wins[w][l]++;
        games[i][j]++; games[j][i]++;
        const reason = r.outReason[r.winner === 0 ? 1 : 0];
        if (reason === 'ring') { ringOuts++; outBy[l].ring++; } else { armourOuts++; outBy[l].armour++; }
        totalTicks += r.ticks;
        rounds++;
      }
    }
  }
  const duel = field.map((f, i) => {
    let sum = 0;
    let worst = 1;
    let best = 0;
    const versus = {};
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const rate = wins[i][j] / games[i][j];
      versus[field[j].name] = Number(rate.toFixed(3));
      sum += rate;
      if (rate < worst) worst = rate;
      if (rate > best) best = rate;
    }
    return { name: f.name, shape: f.shape, avgWinRate: sum / (n - 1), worst, best, versus, lostByRing: outBy[i].ring, lostByArmour: outBy[i].armour };
  });
  // 4-figure free-for-all: random four different archetypes per game.
  const rng = rngCreate(424242);
  const ffaWins = field.map(() => 0);
  const ffaGames = field.map(() => 0);
  for (let g = 0; g < opts.ffa; g++) {
    const pick = [];
    while (pick.length < 4) {
      const k = rngInt(rng, n);
      if (pick.indexOf(k) === -1) pick.push(k);
    }
    const r = playSingleRound(tuning, pick.map((k) => field[k].fig), 7000000 + g, g % 4);
    for (const k of pick) ffaGames[k]++;
    ffaWins[pick[r.winner]]++;
    totalTicks += r.ticks;
  }
  const rows = field.map((f, i) => {
    const st = f.fig.stats;
    return {
      name: f.name, shape: f.shape,
      N: st.N, C: st.C, S: st.S, armour: st.armour, sharpness: Number(st.sharpness.toFixed(2)),
      topSpeed: Number(st.topSpeed.toFixed(2)), radius: Number(st.radius.toFixed(1)), element: st.element,
      duelWinRate: Number(duel[i].avgWinRate.toFixed(4)),
      duelWorst: Number(duel[i].worst.toFixed(3)), duelBest: Number(duel[i].best.toFixed(3)),
      ffaWinRate: Number((ffaGames[i] > 0 ? ffaWins[i] / ffaGames[i] : 0).toFixed(4)),
      ffaGames: ffaGames[i],
      lostByRing: duel[i].lostByRing, lostByArmour: duel[i].lostByArmour,
      versus: duel[i].versus,
    };
  });
  // stat profiles: split the field at the median of each stat
  const profiles = [];
  for (const key of ['N', 'armour', 'sharpness', 'topSpeed', 'radius']) {
    const sorted = rows.map((r) => r[key]).sort((a, b) => a - b);
    const median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    const hi = rows.filter((r) => r[key] > median);
    const lo = rows.filter((r) => r[key] <= median);
    const avg = (list, k) => list.reduce((s, r) => s + r[k], 0) / (list.length || 1);
    profiles.push({ stat: key, median: Number(median.toFixed(2)), highDuel: Number(avg(hi, 'duelWinRate').toFixed(4)), lowDuel: Number(avg(lo, 'duelWinRate').toFixed(4)), highFfa: Number(avg(hi, 'ffaWinRate').toFixed(4)), lowFfa: Number(avg(lo, 'ffaWinRate').toFixed(4)) });
  }
  const byElement = [0, 2, 3, 4].map((e) => {
    const list = rows.filter((r) => r.element === e);
    return { element: e, count: list.length, duel: Number((list.reduce((s, r) => s + r.duelWinRate, 0) / (list.length || 1)).toFixed(4)) };
  });
  const top = rows.slice().sort((a, b) => b.duelWinRate - a.duelWinRate);
  const maxDuel = top[0].duelWinRate;
  const maxFfa = rows.reduce((m, r) => (r.ffaWinRate > m ? r.ffaWinRate : m), 0);
  const viable = rows.filter((r) => r.duelWinRate >= 0.5);
  const viableShapes = [...new Set(viable.map((r) => r.shape))];
  return {
    seedsPerPair: opts.seeds, ffaGames: opts.ffa, neutral: opts.neutral,
    rounds, avgRoundSeconds: Number((totalTicks / (rounds + opts.ffa) / tuning.physics.tickRate).toFixed(1)),
    ringOutShare: Number((ringOuts / rounds).toFixed(3)), armourOutShare: Number((armourOuts / rounds).toFixed(3)),
    rows, profiles, byElement,
    verdict: {
      maxDuelWinRate: maxDuel, maxDuelName: top[0].name, maxFfaWinRate: maxFfa,
      under60: maxDuel <= 0.6,
      viable: viable.map((r) => r.name), viableShapeFamilies: viableShapes,
      threeDifferentShapes: viableShapes.length >= 3,
    },
  };
}

// Solo smoke: bot hero through the five waves against one enemy design per run.
export function runSoloSmoke(tuning, seeds) {
  const heroes = [['disc', 0], ['hedgehog', 1], ['star', 0]];
  const enemies = ['dot', 'needle', 'block', 'comb', 'cross'];
  const weapon = recolour(archetype('needle').cells, 1);
  const out = [];
  for (const [heroName, style] of heroes) {
    for (const enemyName of enemies) {
      for (let stake = 0; stake < 3; stake++) {
        let cleared = 0;
        let won = 0;
        let hpLeft = 0;
        let score = 0;
        let seconds = 0;
        let timeouts = 0;
        for (let s = 0; s < seeds; s++) {
          const enemy = archetype(enemyName).cells;
          const plan = { style, boss: true, waves: [0, 1, 2, 3, 4].map(() => ({ enemy, stake, upgrade: 'heal' })) };
          const hero = recolour(archetype(heroName).cells, 1);
          const r = playSoloRun(tuning, 5000 + s, hero, weapon, W, H, 0, plan, null, null);
          cleared += r.run.wave > 5 ? 5 : (r.run.phase === 'won' ? 5 : r.run.wave);
          if (r.run.phase === 'won') won++;
          if (r.run.endReason === 'time') timeouts++;
          hpLeft += r.run.heroHp > 0 ? r.run.heroHp / r.run.heroMaxHp : 0;
          score += r.run.score;
          for (const x of r.results) seconds += x.ticks / tuning.physics.tickRate;
        }
        out.push({ hero: heroName, heroBot: style === 1 ? 'brawl' : 'kite', enemy: enemyName, stake: tuning.solo.stakes[stake], avgWavesCleared: Number((cleared / seeds).toFixed(2)), runsWon: won, runs: seeds, timeouts, avgHpLeft: Number((hpLeft / seeds).toFixed(2)), avgScore: Math.round(score / seeds), avgRunSeconds: Math.round(seconds / seeds) });
      }
    }
  }
  return out;
}

export function reportMarkdown(rep, solo, tuning, label) {
  const L = [];
  L.push('# Inkweight Ring balance report' + (label ? ' (' + label + ')' : ''));
  L.push('');
  L.push('Generated by `node sim/balance.js`. Bot-driven single rounds; ' + rep.seedsPerPair + ' seeds per 1v1 pair (' + rep.rounds + ' duel rounds), ' + rep.ffaGames + ' four-figure free-for-all rounds' + (rep.neutral ? ', all drawings recoloured black (no elements)' : '') + '.');
  L.push('');
  L.push('Average round length ' + rep.avgRoundSeconds + ' s. Duel rounds ended by ring-out: ' + pct(rep.ringOutShare) + ' %, by armour: ' + pct(rep.armourOutShare) + ' %.');
  L.push('');
  L.push('## Archetypes');
  L.push('');
  L.push('| Archetype | Shape family | N | Armour | Sharp | Speed | Radius | Element | Duel win % | worst / best pairing % | FFA win % (25 = even) |');
  L.push('|---|---|---|---|---|---|---|---|---|---|---|');
  const el = { 0: 'neutral', 2: 'Ember', 3: 'Tide', 4: 'Moss' };
  for (const r of rep.rows.slice().sort((a, b) => b.duelWinRate - a.duelWinRate)) {
    L.push('| ' + [r.name, r.shape, r.N, r.armour, r.sharpness, r.topSpeed, r.radius, el[r.element], pct(r.duelWinRate), pct(r.duelWorst) + ' / ' + pct(r.duelBest), pct(r.ffaWinRate)].join(' | ') + ' |');
  }
  L.push('');
  L.push('## Stat profiles (field split at the median)');
  L.push('');
  L.push('| Stat | Median | Duel win % high half | Duel win % low half | FFA win % high | FFA win % low |');
  L.push('|---|---|---|---|---|---|');
  for (const p of rep.profiles) L.push('| ' + [p.stat, p.median, pct(p.highDuel), pct(p.lowDuel), pct(p.highFfa), pct(p.lowFfa)].join(' | ') + ' |');
  L.push('');
  L.push('| Element | Archetypes | Average duel win % |');
  L.push('|---|---|---|');
  for (const e of rep.byElement) L.push('| ' + el[e.element] + ' | ' + e.count + ' | ' + pct(e.duel) + ' |');
  L.push('');
  L.push('## Pairings (row wins against column, percent of duel rounds)');
  L.push('');
  const names = rep.rows.map((r) => r.name);
  L.push('| | ' + names.join(' | ') + ' |');
  L.push('|---|' + names.map(() => '---').join('|') + '|');
  for (const r of rep.rows) L.push('| ' + r.name + ' | ' + names.map((n) => (n === r.name ? '-' : Math.round(100 * r.versus[n]))).join(' | ') + ' |');
  L.push('');
  L.push('## Verdict against INK_RULES_V1 section 8');
  L.push('');
  const v = rep.verdict;
  L.push('- Highest average duel win rate: ' + v.maxDuelName + ' with ' + pct(v.maxDuelWinRate) + ' % (target: none above 60 %): ' + (v.under60 ? 'MET' : 'NOT MET') + '.');
  L.push('- Archetypes at or above 50 %: ' + v.viable.join(', ') + '; shape families among them: ' + v.viableShapeFamilies.join(', ') + ' (target: at least three clearly different shapes): ' + (v.threeDifferentShapes ? 'MET' : 'NOT MET') + '.');
  L.push('- Highest free-for-all win rate: ' + pct(v.maxFfaWinRate) + ' % (even would be 25 %).');
  L.push('');
  if (solo) {
    L.push('## Solo smoke run');
    L.push('');
    L.push('Bot hero, weapon = black needle, the same enemy design and stake in all five waves, heal bought after each wave when affordable, then the boss.');
    L.push('');
    L.push('| Hero | Hero bot | Enemy design | Stake | Avg waves cleared (of 5) | Runs won incl. boss | Timeouts | Avg armour left | Avg score | Avg run seconds |');
    L.push('|---|---|---|---|---|---|---|---|---|---|');
    for (const s of solo) L.push('| ' + [s.hero, s.heroBot, s.enemy, 'x' + s.stake, s.avgWavesCleared, s.runsWon + ' / ' + s.runs, s.timeouts, pct(s.avgHpLeft) + ' %', s.avgScore, s.avgRunSeconds].join(' | ') + ' |');
    L.push('');
  }
  L.push('## What this simulation can and cannot tell');
  L.push('');
  L.push('- It can tell which drawings win when everybody plays the same simple way: run at the nearest opponent, try to push outward, back off near the edge, dash by chance. It shows whether the numbers make one stat profile win every exchange.');
  L.push('- It cannot tell how the game feels, and it cannot find tricks. Bots never dodge, bait, wait, gang up on purpose or aim a blade; they do not redraw between rounds and do not use catch-up ink. A human with a fast light drawing will play very differently from this bot.');
  L.push('- Many pairings are close to 0 or 100 percent because both bots repeat the same behaviour; the seeds only change start sides, wobble and dash timing. Read the averages as a ranking under one play style, not as odds between humans.');
  L.push('- The archetype field is hand-made. The numbers were tuned against exactly this field, so a drawing outside it may break the balance.');
  L.push('');
  return L.join('\n') + '\n';
}

function main() {
  const args = parseArgs(process.argv);
  const tuning = applyOverrides(loadTuning(), args.set);
  const t0 = Date.now();
  const rep = runRingBalance(tuning, args);
  const solo = args.solo ? runSoloSmoke(tuning, 4) : null;
  rep.overrides = args.set;
  const md = reportMarkdown(rep, solo, tuning, args.label);
  if (args.out) {
    writeFileSync(args.out + '/BALANCE_REPORT.json', JSON.stringify({ ring: rep, solo, tuning }, null, 1) + '\n');
    writeFileSync(args.out + '/BALANCE_REPORT.md', md);
  }
  process.stdout.write(md);
  process.stderr.write('elapsed ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s\n');
}

if (process.argv[1] && process.argv[1].endsWith('balance.js')) main();
