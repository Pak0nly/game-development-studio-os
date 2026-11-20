// Compare tuning candidates for the Ring balance target (INK-CORE-V2).
//   node sim/sweep.js candidates.json [--seeds 8] [--ffa 160] [--rows]
// candidates.json: [{ "label": "name", "set": { "stats.armourBase": 90 } }, ...]
// Every candidate runs the three bot configurations (see balance.js) and
// prints one summary line; --rows adds the per-archetype rates. Up to four
// candidates run at the same time. It never writes the tuning file.

import { readFileSync } from 'node:fs';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import { runRingBalance, combineReports, STYLE_CONFIGS } from './balance.js';
import { loadTuning, applyOverrides } from '../tools/load_tuning.js';

function p(x) { return (100 * x).toFixed(0); }

export function summaryLine(label, rep, rows) {
  const v = rep.verdict;
  const ffa = rep.rows.slice().sort((a, b) => b.ffaWinRate - a.ffaWinRate);
  let s = label + ' | maxDuel ' + v.maxDuelName + ' ' + p(v.maxDuelWinRate) + ' | maxOneStyle ' + v.maxSingleStyleName + ' ' + p(v.maxSingleStyleDuelWinRate)
    + ' | spread ' + (100 * v.duelSpread).toFixed(1) + ' | families>=50 ' + v.viableShapeFamilies.join('+')
    + ' | maxFFA ' + ffa[0].name + ' ' + p(ffa[0].ffaWinRate) + ' | lightFFA ' + (100 * v.lightFfaAverage).toFixed(1)
    + ' | sec ' + rep.perStyle.map((x) => x.avgRoundSeconds).join('/') + ' | sudden ' + rep.perStyle.map((x) => p(x.suddenDeathShare)).join('/');
  if (rows) {
    s += '\n    duel: ' + rep.rows.slice().sort((a, b) => b.duelWinRate - a.duelWinRate).map((r) => r.name + ' ' + p(r.duelWinRate) + '(' + STYLE_CONFIGS.map((c) => p(r.perStyle[c].duel)).join('/') + ')').join(', ');
    s += '\n    ffa:  ' + ffa.map((r) => r.name + ' ' + p(r.ffaWinRate)).join(', ');
  }
  return s;
}

function main() {
  const argv = process.argv;
  const cands = JSON.parse(readFileSync(argv[2], 'utf8'));
  let seeds = 8;
  let ffa = 160;
  let rows = false;
  for (let i = 3; i < argv.length; i++) {
    if (argv[i] === '--seeds') seeds = Number(argv[++i]);
    else if (argv[i] === '--ffa') ffa = Number(argv[++i]);
    else if (argv[i] === '--rows') rows = true;
  }
  const file = fileURLToPath(import.meta.url);
  let next = 0;
  const startOne = () => {
    if (next >= cands.length) return;
    const c = cands[next++];
    const w = new Worker(file, { workerData: { sweep: true, set: c.set, seeds, ffa } });
    w.on('message', (rep) => { console.log(summaryLine(c.label, rep, rows)); startOne(); });
    w.on('error', (e) => { console.log(c.label + ' ERROR ' + e.message); startOne(); });
  };
  for (let k = 0; k < 4; k++) startOne();
}

if (!isMainThread && workerData && workerData.sweep) {
  const tuning = applyOverrides(loadTuning(), workerData.set);
  const reps = STYLE_CONFIGS.map((style) => runRingBalance(tuning, { seeds: workerData.seeds, ffa: workerData.ffa, neutral: false, style }));
  parentPort.postMessage(combineReports(reps));
} else if (isMainThread && process.argv[1] && process.argv[1].endsWith('sweep.js')) {
  main();
}
