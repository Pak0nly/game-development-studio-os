// One bot style of the Ring balance run for one tuning candidate, written to
// a file as soon as it is done (INK-CORE-V3: levers are measured one by one
// and per bot style; short pieces survive a container restart).
//   node sim/lever_run.js --style rusher|circler|mixed --label name --out file.json
//                          [--seeds 20] [--ffa 300] [--set path=value ...]
// (The file name must not end in test.js: node --test would run it.)
// --set values that are arrays are written as path=a/b/c. The output holds the
// verdict of the style, the light-shape average in four-figure rounds and the
// duel and four-figure rate of every archetype. It never writes the tuning file.
import { writeFileSync } from 'node:fs';
import { runRingBalance, LIGHT_MAX_N } from './balance.js';
import { loadTuning, applyOverrides } from '../tools/load_tuning.js';

const a = { style: 'rusher', label: '', out: '', seeds: 20, ffa: 300, set: {} };
for (let i = 2; i < process.argv.length; i++) {
  const k = process.argv[i];
  if (k === '--style') a.style = process.argv[++i];
  else if (k === '--label') a.label = process.argv[++i];
  else if (k === '--out') a.out = process.argv[++i];
  else if (k === '--seeds') a.seeds = Number(process.argv[++i]);
  else if (k === '--ffa') a.ffa = Number(process.argv[++i]);
  else if (k === '--set') {
    const [p, v] = process.argv[++i].split('=');
    a.set[p] = v.indexOf('/') === -1 ? Number(v) : v.split('/').map(Number);
  } else throw new Error('unknown argument ' + k);
}
const t0 = Date.now();
const tuning = applyOverrides(loadTuning(), a.set);
const rep = runRingBalance(tuning, { seeds: a.seeds, ffa: a.ffa, neutral: false, style: a.style });
const rows = rep.rows.map((r) => ({ name: r.name, shape: r.shape, N: r.N, duel: r.duelWinRate, ffa: r.ffaWinRate, ffaGames: r.ffaGames }));
const light = rows.filter((r) => r.N <= LIGHT_MAX_N);
const families = {};
for (const r of rows) {
  if (!families[r.shape]) families[r.shape] = { duel: 0, ffa: 0, count: 0 };
  families[r.shape].duel += r.duel; families[r.shape].ffa += r.ffa; families[r.shape].count++;
}
for (const k of Object.keys(families)) {
  families[k].duel = Number((families[k].duel / families[k].count).toFixed(4));
  families[k].ffa = Number((families[k].ffa / families[k].count).toFixed(4));
}
const top = rows.slice().sort((x, y) => y.duel - x.duel);
const out = {
  label: a.label, style: a.style, seedsPerPair: a.seeds, ffaGames: a.ffa, set: a.set,
  maxDuel: top[0].duel, maxDuelName: top[0].name, secondDuel: top[1].duel, secondDuelName: top[1].name,
  minDuel: top[top.length - 1].duel, minDuelName: top[top.length - 1].name,
  maxFfa: rep.verdict.maxFfaWinRate,
  lightFfa: Number((light.reduce((s, r) => s + r.ffa, 0) / light.length).toFixed(4)),
  avgRoundSeconds: rep.avgRoundSeconds, ringOutShare: rep.ringOutShare, suddenDeathShare: rep.suddenDeathShare,
  families, rows, seconds: Math.round((Date.now() - t0) / 1000),
};
if (a.out) writeFileSync(a.out, JSON.stringify(out, null, 1) + '\n');
console.log(a.label + ' ' + a.style + ' | max ' + top[0].name + ' ' + (100 * top[0].duel).toFixed(1) + ' | 2nd ' + top[1].name + ' ' + (100 * top[1].duel).toFixed(1)
  + ' | min ' + out.minDuelName + ' ' + (100 * out.minDuel).toFixed(1) + ' | lightFFA ' + (100 * out.lightFfa).toFixed(1) + ' | maxFFA ' + (100 * out.maxFfa).toFixed(1)
  + ' | sec ' + out.avgRoundSeconds + ' | ' + out.seconds + ' s');
