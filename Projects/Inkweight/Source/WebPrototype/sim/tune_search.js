// Random search over tuning numbers for the Ring balance target.
//   node sim/tune_search.js [samples] [seed] [--around]
// Prints the best candidates as JSON lines (lowest loss last). It never writes
// the tuning file; a human or Worker copies chosen numbers by hand.
// --around samples near the current tuning file instead of the wide ranges.

import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import { rngCreate, rngFloat } from '../core/index.js';
import { runRingBalance } from './balance.js';
import { loadTuning, applyOverrides } from '../tools/load_tuning.js';

const RANGES = {
  'stats.armourBase': [80, 220],
  'stats.armourPerCore': [0.4, 1.6],
  'stats.armourPerPocket': [0, 1.2],
  'stats.sharpMax': [0.6, 2.5],
  'stats.sharpHalfCells': [3, 14],
  'stats.sharpPurity': [0, 3],
  'stats.sharpPurityWeightRef': [30, 120],
  'stats.bluntDamage': [0.8, 2],
  'stats.speedBase': [25, 50],
  'stats.speedWeightRef': [40, 160],
  'physics.restitution': [0.2, 0.9],
  'physics.dashRestitution': [0, 0.9],
  'physics.dashSpeedMult': [2, 4],
  'physics.hitKnockbackPerDamage': [0, 80],
  'physics.accelWeightRef': [160, 1000],
  'bots.lightRetreatFraction': [0, 0.8],
};

export function loss(rep) {
  const rates = rep.rows.map((r) => r.duelWinRate);
  const mean = 0.5;
  let v = 0;
  let low = 0;
  for (const r of rates) { v += (r - mean) * (r - mean); if (r < 0.25) low++; }
  const sd = Math.sqrt(v / rates.length);
  const over = rep.verdict.maxDuelWinRate > 0.6 ? rep.verdict.maxDuelWinRate - 0.6 : 0;
  const ffaOver = rep.verdict.maxFfaWinRate > 0.45 ? rep.verdict.maxFfaWinRate - 0.45 : 0;
  return over * 2 + sd * 2 + 0.3 * low / rates.length + ffaOver;
}

function get(t, key) { const p = key.split('.'); return t[p[0]][p[1]]; }

if (isMainThread) {
  const samples = Number(process.argv[2] || 80);
  const seed = Number(process.argv[3] || 1);
  const around = process.argv.includes('--around');
  const rng = rngCreate(seed);
  const base = loadTuning();
  const jobs = [];
  for (let i = 0; i < samples; i++) {
    const o = {};
    for (const k of Object.keys(RANGES)) {
      const [lo, hi] = RANGES[k];
      let x;
      if (around) {
        x = get(base, k) + (rngFloat(rng) * 2 - 1) * (hi - lo) * 0.12;
        if (x < lo) x = lo;
        if (x > hi) x = hi;
      } else {
        x = lo + rngFloat(rng) * (hi - lo);
      }
      o[k] = Number(x.toPrecision(2));
    }
    jobs.push(o);
  }
  if (around) jobs[0] = {};
  const results = [];
  let next = 0;
  let running = 0;
  const file = fileURLToPath(import.meta.url);
  const pump = () => {
    while (running < 4 && next < jobs.length) {
      const o = jobs[next++];
      running++;
      const w = new Worker(file, { workerData: o });
      w.on('message', (m) => {
        results.push(m);
        running--;
        if (results.length === jobs.length) {
          results.sort((a, b) => b.loss - a.loss);
          for (const r of results.slice(-8)) console.log(JSON.stringify(r));
        } else pump();
      });
    }
  };
  pump();
} else {
  const tuning = applyOverrides(loadTuning(), workerData);
  const rep = runRingBalance(tuning, { seeds: 6, ffa: 100, neutral: false });
  parentPort.postMessage({
    loss: Number(loss(rep).toFixed(4)), max: rep.verdict.maxDuelWinRate, maxName: rep.verdict.maxDuelName,
    maxFfa: rep.verdict.maxFfaWinRate, ringOut: rep.ringOutShare, secs: rep.avgRoundSeconds,
    rates: rep.rows.map((r) => r.name + ':' + Math.round(r.duelWinRate * 100)).join(' '), set: workerData,
  });
}
