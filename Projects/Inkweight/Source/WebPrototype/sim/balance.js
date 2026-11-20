// Headless balance simulation for the Ring (and a solo smoke run).
//
//   node sim/balance.js [--seeds 40] [--ffa 600] [--neutral] [--quick]
//                       [--set path=value ...] [--out dir] [--label text]
//                       [--nosolo] [--soloseeds 6]
//
// The Ring part runs three times: all bots rushers (style 0), all bots
// circlers (style 1) and mixed (duels: one of each, alternating; four-figure
// rounds: a random style per seat). The three runs use worker threads.
// --neutral recolours every archetype black (shape effect without elements).
// --set overrides tuning values for experiments (does not change the file).
// --out writes BALANCE_REPORT.json and BALANCE_REPORT.md into the directory.

import { writeFileSync } from 'node:fs';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import { buildFigure, rngCreate, rngInt } from '../core/index.js';
import { ARCHETYPES, W, H, recolour, archetype } from './archetypes.js';
import { playSingleRound, playSoloRun } from './runner.js';
import { loadTuning, applyOverrides } from '../tools/load_tuning.js';

export const STYLE_CONFIGS = ['rusher', 'circler', 'mixed'];
export const LIGHT_MAX_N = 70; // archetypes with at most this many cells count as "light"

function parseArgs(argv) {
  const a = { seeds: 40, ffa: 600, neutral: false, set: {}, out: '', label: '', solo: true, soloSeeds: 6 };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--seeds') a.seeds = Number(argv[++i]);
    else if (k === '--ffa') a.ffa = Number(argv[++i]);
    else if (k === '--neutral') a.neutral = true;
    else if (k === '--quick') { a.seeds = 10; a.ffa = 150; a.solo = false; }
    else if (k === '--nosolo') a.solo = false;
    else if (k === '--soloseeds') a.soloSeeds = Number(argv[++i]);
    else if (k === '--out') a.out = argv[++i];
    else if (k === '--label') a.label = argv[++i];
    else if (k === '--set') { const [p, v] = argv[++i].split('='); a.set[p] = Number(v); }
    else throw new Error('unknown argument ' + k);
  }
  return a;
}

function pct(x) { return (100 * x).toFixed(1); }

// One style configuration. opts: { seeds, ffa, neutral, style }.
// style: 'rusher' | 'circler' | 'mixed' (default 'rusher').
export function runRingBalance(tuning, opts) {
  const style = opts.style || 'rusher';
  const field = ARCHETYPES.map((a) => {
    const cells = opts.neutral ? recolour(a.cells, 1) : a.cells;
    return { name: a.name, shape: a.shape, optimiser: a.optimiser, fig: buildFigure(cells, W, H, tuning, 'figure') };
  });
  const n = field.length;
  // 1v1 round robin: every pair plays `seeds` single rounds, start sides alternate.
  const wins = field.map(() => field.map(() => 0));
  const games = field.map(() => field.map(() => 0));
  let ringOuts = 0;
  let armourOuts = 0;
  let totalTicks = 0;
  let rounds = 0;
  let longRounds = 0; // rounds that reached sudden death
  const outBy = field.map(() => ({ ring: 0, armour: 0 }));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let s = 0; s < opts.seeds; s++) {
        const seed = 1000003 * (i * n + j) + s;
        let styles = [0, 0];
        if (style === 'circler') styles = [1, 1];
        else if (style === 'mixed') styles = (s >> 1) % 2 === 0 ? [0, 1] : [1, 0];
        const r = playSingleRound(tuning, [field[i].fig, field[j].fig], seed, s % 2, styles);
        const w = r.winner === 0 ? i : j;
        const l = r.winner === 0 ? j : i;
        wins[w][l]++;
        games[i][j]++; games[j][i]++;
        const reason = r.outReason[r.winner === 0 ? 1 : 0];
        if (reason === 'ring') { ringOuts++; outBy[l].ring++; } else { armourOuts++; outBy[l].armour++; }
        if (r.ticks > tuning.ring.suddenDeathTick) longRounds++;
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
    return { avgWinRate: sum / (n - 1), worst, best, versus, lostByRing: outBy[i].ring, lostByArmour: outBy[i].armour };
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
    let styles = [0, 0, 0, 0];
    if (style === 'circler') styles = [1, 1, 1, 1];
    else if (style === 'mixed') styles = [rngInt(rng, 2), rngInt(rng, 2), rngInt(rng, 2), rngInt(rng, 2)];
    const r = playSingleRound(tuning, pick.map((k) => field[k].fig), 7000000 + g, g % 4, styles);
    for (const k of pick) ffaGames[k]++;
    ffaWins[pick[r.winner]]++;
    totalTicks += r.ticks;
  }
  const rows = field.map((f, i) => {
    const st = f.fig.stats;
    return {
      name: f.name, shape: f.shape, optimiser: f.optimiser,
      N: st.N, C: st.C, S: st.S, P: st.P, armour: Number(st.armour.toFixed(1)), sharpness: Number(st.sharpness.toFixed(2)),
      topSpeed: Number(st.topSpeed.toFixed(2)), radius: Number(st.radius.toFixed(1)), element: st.element,
      duelWinRate: Number(duel[i].avgWinRate.toFixed(4)),
      duelWorst: Number(duel[i].worst.toFixed(3)), duelBest: Number(duel[i].best.toFixed(3)),
      ffaWinRate: Number((ffaGames[i] > 0 ? ffaWins[i] / ffaGames[i] : 0).toFixed(4)),
      ffaGames: ffaGames[i], ffaWins: ffaWins[i],
      lostByRing: duel[i].lostByRing, lostByArmour: duel[i].lostByArmour,
      versus: duel[i].versus,
    };
  });
  const top = rows.slice().sort((a, b) => b.duelWinRate - a.duelWinRate);
  const maxFfa = rows.reduce((m, r) => (r.ffaWinRate > m ? r.ffaWinRate : m), 0);
  return {
    style, seedsPerPair: opts.seeds, ffaGames: opts.ffa, neutral: !!opts.neutral,
    rounds, avgRoundSeconds: Number((totalTicks / (rounds + opts.ffa) / tuning.physics.tickRate).toFixed(1)),
    ringOutShare: Number((ringOuts / rounds).toFixed(3)), armourOutShare: Number((armourOuts / rounds).toFixed(3)),
    suddenDeathShare: Number((longRounds / rounds).toFixed(3)),
    rows,
    verdict: { maxDuelWinRate: top[0].duelWinRate, maxDuelName: top[0].name, maxFfaWinRate: maxFfa },
  };
}

// Combine the per-style reports: duel rate = mean of the styles, FFA = pooled.
export function combineReports(reps) {
  const base = reps[0];
  const n = base.rows.length;
  const rows = base.rows.map((r, i) => {
    let duel = 0;
    let fw = 0;
    let fg = 0;
    const versus = {};
    const per = {};
    for (const rep of reps) {
      const x = rep.rows[i];
      duel += x.duelWinRate;
      fw += x.ffaWins;
      fg += x.ffaGames;
      per[rep.style] = { duel: x.duelWinRate, ffa: x.ffaWinRate };
      for (const k of Object.keys(x.versus)) versus[k] = (versus[k] || 0) + x.versus[k] / reps.length;
    }
    let worst = 1;
    let best = 0;
    for (const k of Object.keys(versus)) { versus[k] = Number(versus[k].toFixed(3)); if (versus[k] < worst) worst = versus[k]; if (versus[k] > best) best = versus[k]; }
    return {
      name: r.name, shape: r.shape, optimiser: r.optimiser, N: r.N, C: r.C, S: r.S, P: r.P, armour: r.armour, sharpness: r.sharpness,
      topSpeed: r.topSpeed, radius: r.radius, element: r.element,
      duelWinRate: Number((duel / reps.length).toFixed(4)), duelWorst: worst, duelBest: best,
      ffaWinRate: Number((fg > 0 ? fw / fg : 0).toFixed(4)), ffaGames: fg,
      perStyle: per, versus,
    };
  });
  const profiles = [];
  for (const key of ['N', 'armour', 'sharpness', 'topSpeed', 'radius']) {
    const sorted = rows.map((r) => r[key]).sort((a, b) => a - b);
    const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[(n - 1) / 2];
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
  const viable = rows.filter((r) => r.duelWinRate >= 0.5);
  const viableShapes = [...new Set(viable.map((r) => r.shape))];
  const light = rows.filter((r) => r.N <= LIGHT_MAX_N);
  const lightFfa = light.reduce((s, r) => s + r.ffaWinRate, 0) / (light.length || 1);
  const lightOk = light.filter((r) => r.ffaWinRate >= 0.125);
  let maxStyleDuel = 0;
  let maxStyleName = '';
  for (const rep of reps) if (rep.verdict.maxDuelWinRate > maxStyleDuel) { maxStyleDuel = rep.verdict.maxDuelWinRate; maxStyleName = rep.verdict.maxDuelName + ' (' + rep.style + ')'; }
  const maxFfa = rows.reduce((m, r) => (r.ffaWinRate > m ? r.ffaWinRate : m), 0);
  const maxFfaName = rows.reduce((m, r) => (r.ffaWinRate >= maxFfa ? r.name : m), '');
  // mean of the two same-style configurations (mixed duels mostly measure the bot style, see style_check.js)
  let maxPure = 0;
  let maxPureName = '';
  for (const r of rows) {
    if (!r.perStyle.rusher || !r.perStyle.circler) continue;
    r.duelSameStyle = Number(((r.perStyle.rusher.duel + r.perStyle.circler.duel) / 2).toFixed(4));
    if (r.duelSameStyle > maxPure) { maxPure = r.duelSameStyle; maxPureName = r.name; }
  }
  let sd = 0;
  for (const r of rows) sd += (r.duelWinRate - 0.5) * (r.duelWinRate - 0.5);
  sd = Math.sqrt(sd / n);
  return {
    styles: reps.map((r) => r.style), seedsPerPair: base.seedsPerPair, ffaGames: base.ffaGames, neutral: base.neutral,
    perStyle: reps.map((r) => ({ style: r.style, rounds: r.rounds, avgRoundSeconds: r.avgRoundSeconds, ringOutShare: r.ringOutShare, armourOutShare: r.armourOutShare, suddenDeathShare: r.suddenDeathShare, maxDuelWinRate: r.verdict.maxDuelWinRate, maxDuelName: r.verdict.maxDuelName, maxFfaWinRate: r.verdict.maxFfaWinRate })),
    rows, profiles, byElement,
    verdict: {
      maxDuelWinRate: top[0].duelWinRate, maxDuelName: top[0].name,
      maxSingleStyleDuelWinRate: maxStyleDuel, maxSingleStyleName: maxStyleName,
      maxSameStyleMean: maxPure, maxSameStyleMeanName: maxPureName,
      duelSpread: Number(sd.toFixed(4)),
      under60: top[0].duelWinRate <= 0.6,
      under60EveryStyle: maxStyleDuel <= 0.6,
      viable: viable.map((r) => r.name), viableShapeFamilies: viableShapes,
      threeDifferentShapes: viableShapes.length >= 3,
      maxFfaWinRate: maxFfa, maxFfaName,
      lightNames: light.map((r) => r.name), lightFfaAverage: Number(lightFfa.toFixed(4)),
      lightAtHalfEven: lightOk.map((r) => r.name),
      lightNotHopeless: lightFfa >= 0.125 && lightOk.length >= 2,
    },
  };
}

// Run the three style configurations in worker threads and combine them.
export function runRingBalanceAll(overrides, opts) {
  const file = fileURLToPath(import.meta.url);
  return Promise.all(STYLE_CONFIGS.map((style) => new Promise((resolve, reject) => {
    const w = new Worker(file, { workerData: { overrides, opts: { seeds: opts.seeds, ffa: opts.ffa, neutral: opts.neutral, style } } });
    w.on('message', resolve);
    w.on('error', reject);
  }))).then(combineReports);
}

// Solo smoke: bot hero through the five waves against one enemy design per run.
export function runSoloSmoke(tuning, seeds) {
  const heroes = [['disc', 0], ['hedgehog', 1], ['star', 0], ['line', 0]];
  const enemies = ['dot', 'needle', 'block', 'comb', 'cross', 'splinter', 'spiral'];
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
          cleared += r.run.phase === 'won' ? 5 : (r.run.wave > 5 ? 5 : r.run.wave);
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

export function soloSummary(solo) {
  const byStake = {};
  let won = 0;
  let runs = 0;
  let hp = 0;
  for (const s of solo) {
    const k = 'x' + s.stake;
    if (!byStake[k]) byStake[k] = { won: 0, runs: 0, hp: 0, rows: 0, score: 0, waves: 0 };
    byStake[k].won += s.runsWon; byStake[k].runs += s.runs; byStake[k].hp += s.avgHpLeft; byStake[k].rows++; byStake[k].score += s.avgScore; byStake[k].waves += s.avgWavesCleared;
    won += s.runsWon; runs += s.runs; hp += s.avgHpLeft;
  }
  const out = { wonShare: Number((won / runs).toFixed(3)), runs, avgHpLeft: Number((hp / solo.length).toFixed(3)), byStake: {} };
  for (const k of Object.keys(byStake)) {
    const b = byStake[k];
    out.byStake[k] = { wonShare: Number((b.won / b.runs).toFixed(3)), avgHpLeft: Number((b.hp / b.rows).toFixed(3)), avgScore: Math.round(b.score / b.rows), avgWavesCleared: Number((b.waves / b.rows).toFixed(2)) };
  }
  return out;
}

export function reportMarkdown(rep, solo, tuning, label) {
  const L = [];
  const el = { 0: 'neutral', 2: 'Ember', 3: 'Tide', 4: 'Moss' };
  L.push('# Inkweight Ring balance report' + (label ? ' (' + label + ')' : ''));
  L.push('');
  L.push('Generated by `node sim/balance.js`. Bot-driven single rounds in three bot configurations (' + rep.styles.join(', ') + '); per configuration ' + rep.seedsPerPair + ' seeds per 1v1 pair (' + rep.perStyle[0].rounds + ' duel rounds) and ' + rep.ffaGames + ' four-figure free-for-all rounds' + (rep.neutral ? ', all drawings recoloured black (no elements)' : '') + '. "All" is the mean of the three duel rates and the pooled free-for-all rate. Archetypes marked * are the "player optimiser" drawings added in INK-CORE-V2.');
  L.push('');
  L.push('| Bot configuration | Avg round s | Ended by ring-out % | by armour % | Duel rounds reaching sudden death % | Highest duel win % | Highest FFA win % |');
  L.push('|---|---|---|---|---|---|---|');
  for (const p of rep.perStyle) L.push('| ' + [p.style, p.avgRoundSeconds, pct(p.ringOutShare), pct(p.armourOutShare), pct(p.suddenDeathShare), p.maxDuelName + ' ' + pct(p.maxDuelWinRate), pct(p.maxFfaWinRate)].join(' | ') + ' |');
  L.push('');
  L.push('## Archetypes');
  L.push('');
  L.push('| Archetype | Shape family | N | Armour | Sharp | Speed | Radius | Element | Duel win % all | rusher | circler | mixed | worst / best pairing % | FFA win % all (25 = even) | rusher | circler | mixed |');
  L.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of rep.rows.slice().sort((a, b) => b.duelWinRate - a.duelWinRate)) {
    const ps = rep.styles.map((s) => r.perStyle[s]);
    L.push('| ' + [r.name + (r.optimiser ? ' *' : ''), r.shape, r.N, r.armour, r.sharpness, r.topSpeed, r.radius, el[r.element], pct(r.duelWinRate)].concat(ps.map((p) => pct(p.duel)), [pct(r.duelWorst) + ' / ' + pct(r.duelBest), pct(r.ffaWinRate)], ps.map((p) => pct(p.ffa))).join(' | ') + ' |');
  }
  L.push('');
  L.push('## Stat profiles (field split at the median, all configurations)');
  L.push('');
  L.push('| Stat | Median | Duel win % high half | Duel win % low half | FFA win % high | FFA win % low |');
  L.push('|---|---|---|---|---|---|');
  for (const p of rep.profiles) L.push('| ' + [p.stat, p.median, pct(p.highDuel), pct(p.lowDuel), pct(p.highFfa), pct(p.lowFfa)].join(' | ') + ' |');
  L.push('');
  L.push('| Element | Archetypes | Average duel win % |');
  L.push('|---|---|---|');
  for (const e of rep.byElement) L.push('| ' + el[e.element] + ' | ' + e.count + ' | ' + pct(e.duel) + ' |');
  L.push('');
  L.push('## Pairings (row wins against column, percent of duel rounds, all configurations)');
  L.push('');
  const names = rep.rows.map((r) => r.name);
  L.push('| | ' + names.join(' | ') + ' |');
  L.push('|---|' + names.map(() => '---').join('|') + '|');
  for (const r of rep.rows) L.push('| ' + r.name + ' | ' + names.map((n) => (n === r.name ? '-' : Math.round(100 * r.versus[n]))).join(' | ') + ' |');
  L.push('');
  L.push('## Verdict against the balance target');
  L.push('');
  const v = rep.verdict;
  L.push('- Highest average duel win rate over all configurations: ' + v.maxDuelName + ' with ' + pct(v.maxDuelWinRate) + ' % (target: none above 60 %): ' + (v.under60 ? 'MET' : 'NOT MET') + '.');
  L.push('- Highest duel win rate inside one single bot configuration: ' + v.maxSingleStyleName + ' with ' + pct(v.maxSingleStyleDuelWinRate) + ' %: ' + (v.under60EveryStyle ? 'also under 60 %' : 'above 60 %, so the target is not met for every play style') + '.');
  L.push('- Stricter reading, mean of the rusher-only and circler-only duel rates (the mixed duels are left out because there the bot style decides, not the drawing): ' + v.maxSameStyleMeanName + ' with ' + pct(v.maxSameStyleMean) + ' %: ' + (v.maxSameStyleMean <= 0.6 ? 'under 60 %' : 'above 60 %') + '.');
  L.push('- Spread of the duel win rates round 50 % (root mean square): ' + pct(v.duelSpread) + ' points.');
  L.push('- Archetypes at or above 50 %: ' + v.viable.join(', ') + '; shape families among them: ' + v.viableShapeFamilies.join(', ') + ' (target: at least three clearly different shapes): ' + (v.threeDifferentShapes ? 'MET' : 'NOT MET') + '.');
  L.push('- Highest free-for-all win rate: ' + v.maxFfaName + ' with ' + pct(v.maxFfaWinRate) + ' % (even would be 25 %).');
  L.push('- Light shapes (at most ' + LIGHT_MAX_N + ' cells: ' + v.lightNames.join(', ') + ') in four-figure rounds: average ' + pct(v.lightFfaAverage) + ' %; at or above 12.5 % (half of even): ' + (v.lightAtHalfEven.length ? v.lightAtHalfEven.join(', ') : 'none') + '. Worker\'s own yardstick (average at least 12.5 % and at least two light shapes at 12.5 %): ' + (v.lightNotHopeless ? 'reached, which is only "partly" against the order\'s wording "not hopeless"; see the rusher column' : 'not reached') + '.');
  L.push('');
  if (solo) {
    const sum = soloSummary(solo);
    L.push('## Solo smoke run');
    L.push('');
    L.push('Bot hero, weapon = black needle, the same enemy design and stake in all five waves, heal bought after each wave when affordable, then the boss. ' + solo[0].runs + ' seeds per row.');
    L.push('');
    L.push('Runs won (boss included): ' + pct(sum.wonShare) + ' % of ' + sum.runs + '; average armour left ' + pct(sum.avgHpLeft) + ' %.');
    L.push('');
    L.push('| Stake | Runs won % | Avg waves cleared | Avg armour left % | Avg score |');
    L.push('|---|---|---|---|---|');
    for (const k of Object.keys(sum.byStake)) L.push('| ' + [k, pct(sum.byStake[k].wonShare), sum.byStake[k].avgWavesCleared, pct(sum.byStake[k].avgHpLeft), sum.byStake[k].avgScore].join(' | ') + ' |');
    L.push('');
    L.push('| Hero | Hero bot | Enemy design | Stake | Avg waves cleared (of 5) | Runs won incl. boss | Timeouts | Avg armour left | Avg score | Avg run seconds |');
    L.push('|---|---|---|---|---|---|---|---|---|---|');
    for (const s of solo) L.push('| ' + [s.hero, s.heroBot, s.enemy, 'x' + s.stake, s.avgWavesCleared, s.runsWon + ' / ' + s.runs, s.timeouts, pct(s.avgHpLeft) + ' %', s.avgScore, s.avgRunSeconds].join(' | ') + ' |');
    L.push('');
  }
  L.push('## What this simulation can and cannot tell');
  L.push('');
  L.push('- It can tell which drawings win under two simple play styles: the rusher runs at the nearest opponent and dashes by chance; the circler picks an opponent outside the crowd, circles it and rams when its dash is ready and its front points at the target. A drawing that is strong under both is strong for a structural reason; one that is strong under only one is partly a bot artefact.');
  L.push('- The mixed configuration says little about drawings: when a rusher meets a circler the rusher wins about nine duels in ten whatever is drawn (`node sim/style_check.js`: 91.7 % of 2448 duels with the final tuning). Its duel column is therefore close to 50 % for every drawing and pulls the "all" average toward 50 %. Read the rusher and circler columns for the effect of the drawing.');
  L.push('- It cannot tell how the game feels, and it cannot find tricks. Bots never dodge, bait, wait or gang up on purpose; they do not redraw between rounds and do not use catch-up ink. Two styles are still only two styles.');
  L.push('- Many pairings are close to 0 or 100 percent because both bots repeat the same behaviour; the seeds only change start sides, wobble and dash timing. Read the averages as a ranking, not as odds between humans.');
  L.push('- The archetype field is hand-made. Four "player optimiser" drawings were added to look for rule-breaking designs, but the numbers were still chosen while looking at this field.');
  L.push('');
  return L.join('\n') + '\n';
}

async function main() {
  const args = parseArgs(process.argv);
  const tuning = applyOverrides(loadTuning(), args.set);
  const t0 = Date.now();
  const rep = await runRingBalanceAll(args.set, args);
  const solo = args.solo ? runSoloSmoke(tuning, args.soloSeeds) : null;
  rep.overrides = args.set;
  const md = reportMarkdown(rep, solo, tuning, args.label);
  if (args.out) {
    writeFileSync(args.out + '/BALANCE_REPORT.json', JSON.stringify({ ring: rep, solo, soloSummary: solo ? soloSummary(solo) : null, tuning }, null, 1) + '\n');
    writeFileSync(args.out + '/BALANCE_REPORT.md', md);
  }
  process.stdout.write(md);
  process.stderr.write('elapsed ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s\n');
}

if (!isMainThread && workerData && workerData.opts) {
  parentPort.postMessage(runRingBalance(applyOverrides(loadTuning(), workerData.overrides), workerData.opts));
} else if (process.argv[1] && process.argv[1].endsWith('balance.js')) {
  main();
}
