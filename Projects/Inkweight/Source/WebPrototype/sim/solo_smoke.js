// Solo smoke run alone, for tuning the solo numbers.
//   node sim/solo_smoke.js [--seeds 4] [--set path=value ...] [--rows]
// Prints the summary by stake (and every row with --rows). --set values that
// are arrays are written as path=a/b/c. It never writes the tuning file.
import { runSoloSmoke, soloSummary } from './balance.js';
import { loadTuning, applyOverrides } from '../tools/load_tuning.js';

const set = {};
let seeds = 4;
let rows = false;
for (let i = 2; i < process.argv.length; i++) {
  const k = process.argv[i];
  if (k === '--seeds') seeds = Number(process.argv[++i]);
  else if (k === '--rows') rows = true;
  else if (k === '--set') {
    const [p, v] = process.argv[++i].split('=');
    set[p] = v.indexOf('/') === -1 ? Number(v) : v.split('/').map(Number);
  }
}
const tuning = applyOverrides(loadTuning(), set);
const solo = runSoloSmoke(tuning, seeds);
const sum = soloSummary(solo);
console.log(JSON.stringify(set));
console.log('won ' + (100 * sum.wonShare).toFixed(0) + ' % of ' + sum.runs + ', armour left ' + (100 * sum.avgHpLeft).toFixed(0) + ' %');
for (const k of Object.keys(sum.byStake)) {
  const b = sum.byStake[k];
  console.log('  ' + k + ': won ' + (100 * b.wonShare).toFixed(0) + ' %, waves ' + b.avgWavesCleared + ', armour left ' + (100 * b.avgHpLeft).toFixed(0) + ' %, score ' + b.avgScore);
}
const by = {};
for (const s of solo) {
  for (const key of ['hero ' + s.hero, 'enemy ' + s.enemy]) {
    if (!by[key]) by[key] = { won: 0, runs: 0 };
    by[key].won += s.runsWon; by[key].runs += s.runs;
  }
}
console.log('  ' + Object.keys(by).map((k) => k + ' ' + by[k].won + '/' + by[k].runs).join(', '));
if (rows) for (const s of solo) console.log('  ' + [s.hero, s.heroBot, s.enemy, 'x' + s.stake, 'waves ' + s.avgWavesCleared, 'won ' + s.runsWon + '/' + s.runs, 'timeouts ' + s.timeouts, 'hp ' + (100 * s.avgHpLeft).toFixed(0) + '%', 'score ' + s.avgScore, s.avgRunSeconds + 's'].join(' | '));
