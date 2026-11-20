// Mode B "Ring": 2 to 4 figures, shrinking ring, rounds, first to N wins,
// catch-up ink. The match object is plain data plus figure templates.

import { createBody, createWorld, stepWorld } from './physics.js';
import { rngDerive } from './rng.js';

// Start slots as unit vectors from the ring centre (exact values, no trig).
const H3 = Math.sqrt(3) / 2;
const SLOTS = [
  null, null,
  [[-1, 0], [1, 0]],
  [[0, -1], [H3, 0.5], [-H3, 0.5]],
  [[-1, 0], [1, 0], [0, -1], [0, 1]],
];

export function ringCreateMatch(tuning, seatCount, seed) {
  if (seatCount < 2 || seatCount > 4) throw new Error('seatCount must be 2..4');
  const wins = [];
  const lost = [];
  const botRng = [];
  const botStyle = [];
  for (let i = 0; i < seatCount; i++) {
    wins.push(0);
    lost.push(0);
    botStyle.push(0);
    botRng.push(rngDerive(seed, i));
  }
  return {
    mode: 'ring',
    seed, seatCount,
    round: 0,            // rounds started so far
    wins, lost,
    phase: 'draw',       // 'draw' | 'fight' | 'roundOver' | 'matchOver'
    tick: 0,             // ticks since the round started
    ringRadius: tuning.ring.startRadius[seatCount],
    world: null,
    roundWinner: -1,
    matchWinner: -1,
    outTick: [],         // per seat: tick of elimination in this round, -1 while in
    outReason: [],       // per seat: '' | 'ring' | 'armour'
    botRng,
    botWobble: [],       // per seat: current sideways wobble of the bot (-1, 0, 1)
    botStyle,            // per seat: 0 = rusher, 1 = circler (see bots.js); the caller may change it
  };
}

// Check a figure template for a seat before a round. Returns '' when it may
// start, else 'tooSmall' or 'overBudget' (against the seat's catch-up budget).
export function ringCheckFigure(tuning, match, seat, fig) {
  if (!fig || !fig.stats || fig.stats.N < tuning.ink.minBodyCells) return 'tooSmall';
  if (fig.stats.filled > ringInkBudget(tuning, match, seat)) return 'overBudget';
  return '';
}

// Ink budget of a seat for its next drawing (catch-up rule 6).
export function ringInkBudget(tuning, match, seat) {
  let steps = match.lost[seat];
  if (steps > tuning.ring.catchUpMaxSteps) steps = tuning.ring.catchUpMaxSteps;
  return Math.floor(tuning.ink.figureBudget * (100 + tuning.ring.catchUpPercentPerLostRound * steps) / 100);
}

// Ring radius at a tick of the round.
export function ringRadiusAt(tuning, seatCount, tick) {
  const r = tuning.ring;
  const start = r.startRadius[seatCount];
  if (tick <= r.shrinkStartTick) return start;
  if (tick < r.shrinkEndTick) {
    return start + (r.endRadius - start) * (tick - r.shrinkStartTick) / (r.shrinkEndTick - r.shrinkStartTick);
  }
  if (tick <= r.suddenDeathTick) return r.endRadius;
  const rad = r.endRadius - (tick - r.suddenDeathTick) * r.suddenDeathShrinkPerTick;
  return rad > 0 ? rad : 0;
}

// Start the next round with one figure template per seat (see buildFigure).
// Seats rotate through the start slots from round to round.
export function ringStartRound(tuning, match, figures) {
  if (match.phase === 'matchOver') throw new Error('match is over');
  if (figures.length !== match.seatCount) throw new Error('one figure per seat');
  const n = match.seatCount;
  for (let seat = 0; seat < n; seat++) {
    const why = ringCheckFigure(tuning, match, seat, figures[seat]);
    if (why !== '') throw new Error('seat ' + seat + ' figure: ' + why);
  }
  const slots = SLOTS[n];
  const R = tuning.ring.startRadius[n];
  const d = R * tuning.ring.startDistanceFraction;
  const bodies = [];
  match.outTick = [];
  match.outReason = [];
  match.botWobble = [];
  for (let seat = 0; seat < n; seat++) {
    const slot = slots[(seat + match.round) % n];
    // position on the slot direction, front toward the centre
    bodies.push(createBody(figures[seat], slot[0] * d, slot[1] * d, -slot[0], -slot[1], seat, 1, 1, 1));
    match.outTick.push(-1);
    match.outReason.push('');
    match.botWobble.push(0);
  }
  match.world = createWorld(bodies, 0);
  match.tick = 0;
  match.ringRadius = R;
  match.roundWinner = -1;
  match.round++;
  match.phase = 'fight';
}

// One tick of the fight. inputs[seat] = { mx, my, dash }.
export function ringStep(tuning, match, inputs) {
  if (match.phase !== 'fight') return;
  const world = match.world;
  const bodies = world.bodies;
  const n = bodies.length;
  stepWorld(world, inputs, tuning);
  match.tick++;
  const R = ringRadiusAt(tuning, n, match.tick);
  match.ringRadius = R;
  // eliminations, seat order
  let aliveCount = 0;
  let lastAlive = -1;
  let outNow = 0;
  for (let i = 0; i < n; i++) {
    const b = bodies[i];
    if (!b.alive) continue;
    let reason = '';
    if (b.hp <= 0) reason = 'armour';
    else if (b.x * b.x + b.y * b.y > R * R) reason = 'ring';
    if (reason !== '') {
      b.alive = false;
      match.outTick[i] = match.tick;
      match.outReason[i] = reason;
      world.events.push({ type: 'out', seat: i, reason });
      outNow++;
    } else {
      aliveCount++;
      lastAlive = i;
    }
  }
  if (aliveCount > 1) return;
  let winner = lastAlive;
  if (aliveCount === 0) {
    // everyone left went out in the same tick: the one closest to the centre
    // wins, lowest seat on an exact tie
    let best = -1;
    for (let i = 0; i < n; i++) {
      if (match.outTick[i] !== match.tick) continue;
      const b = bodies[i];
      const d2 = b.x * b.x + b.y * b.y;
      if (winner === -1 || d2 < best) { winner = i; best = d2; }
    }
  }
  match.roundWinner = winner;
  match.wins[winner]++;
  for (let i = 0; i < n; i++) if (i !== winner) match.lost[i]++;
  if (match.wins[winner] >= tuning.ring.winsToTakeMatch) {
    match.matchWinner = winner;
    match.phase = 'matchOver';
  } else {
    match.phase = 'roundOver';
  }
}
