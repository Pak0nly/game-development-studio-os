// Print one line per golden trace: rounds or fights and the final state.
//   node tools/trace_summary.js
import { readFileSync } from 'node:fs';
import { TRACE_PATH } from './gen_golden.js';

const f = JSON.parse(readFileSync(TRACE_PATH, 'utf8'));
for (const t of f.items) {
  if (t.mode === 'ring') {
    console.log(t.name + ' | checkpoints ' + t.checkpoints.length + ' | rounds [ticks, winner, outTick, outReason] '
      + JSON.stringify(t.rounds.map((r) => [r.ticks, r.winner, r.outTick.join('/'), r.outReason.join('/')])) + ' | wins ' + JSON.stringify(t.final.wins));
  } else {
    console.log(t.name + ' | checkpoints ' + t.checkpoints.length + ' | fights [phase, endReason, ticks, copies, upgrade] '
      + JSON.stringify(t.fights.map((x) => [x.phase, x.endReason, x.ticks, x.copies, x.upgrade])) + ' | final ' + JSON.stringify(t.final));
  }
}
