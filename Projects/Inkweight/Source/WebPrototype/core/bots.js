// Simple deterministic bots. A bot reads the state and returns the same input
// record a human seat would produce: { mx, my, dash }.

import { rngInt } from './rng.js';

// Ring bot for one seat. Draws from match.botRng[seat] only. The style comes
// from match.botStyle[seat]: 0 = rusher, 1 = circler.
export function botRingInput(tuning, match, seat) {
  if (match.botStyle[seat] === 1) return botCircler(tuning, match, seat);
  return botRusher(tuning, match, seat);
}

// Scratch steering direction shared by the two styles.
const steer = { x: 0, y: 0, edge: 0 };

// Edge avoidance, shared by both styles. A bot that is lighter than its target
// keeps further away from the edge. When the target blocks the way back to
// the centre the bot goes round it. Reads and writes steer.x / steer.y and
// sets steer.edge (0 = free, 1 = fully steering back).
function edgeSteer(bt, match, me, target, targetDist) {
  const bodies = match.world.bodies;
  const myDist = Math.sqrt(me.x * me.x + me.y * me.y);
  let margin = bt.edgeMargin;
  if (target !== -1) {
    const tm = bodies[target].fig.mass;
    if (tm > me.fig.mass) margin += match.ringRadius * bt.lightRetreatFraction * (1 - me.fig.mass / tm);
  }
  const limit = match.ringRadius - margin;
  let edge = 0;
  if (myDist > limit && myDist > 0) {
    edge = (myDist - limit) / bt.edgeBlend;
    if (edge > 1) edge = 1;
    const cx = -me.x / myDist;
    const cy = -me.y / myDist;
    let ex = cx;
    let ey = cy;
    if (target !== -1 && targetDist > 0) {
      const ux = (bodies[target].x - me.x) / targetDist;
      const uy = (bodies[target].y - me.y) / targetDist;
      if (cx * ux + cy * uy > bt.roundaboutDot) {
        let tx = -cy;
        let ty = cx;
        if (tx * ux + ty * uy > 0) { tx = -tx; ty = -ty; }
        ex += tx * bt.roundaboutStrength;
        ey += ty * bt.roundaboutStrength;
      }
    }
    steer.x = steer.x * (1 - edge) + ex * edge;
    steer.y = steer.y * (1 - edge) + ey * edge;
    const d = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    if (d > 0) { steer.x = steer.x / d; steer.y = steer.y / d; }
  }
  steer.edge = edge;
}

// Unit vector from the bot toward the aim point: the target centre, shifted
// toward the ring centre by insideBias * own radius, so that the push goes
// outward. Falls back to the own front. Writes steer.x / steer.y.
function aimInside(bt, me, t) {
  let ax = t.x;
  let ay = t.y;
  const td = Math.sqrt(t.x * t.x + t.y * t.y);
  if (td > 0) {
    const shift = bt.insideBias * me.fig.radius;
    const use = shift < td ? shift : td;
    ax -= t.x / td * use;
    ay -= t.y / td * use;
  }
  const dx = ax - me.x;
  const dy = ay - me.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d > 0) { steer.x = dx / d; steer.y = dy / d; } else { steer.x = me.fx; steer.y = me.fy; }
}

// Style 0, the rusher.
// 1. Every wobbleTicks the bot picks a sideways wobble of -1, 0 or +1.
// 2. Target: nearest living opponent (centre distance, lowest seat on a tie).
// 3. Aim point: see aimInside; plus the sideways wobble.
// 4. Edge avoidance: see edgeSteer.
// 5. Dash by chance when the target is close and the bot is not near the edge.
function botRusher(tuning, match, seat) {
  const bt = tuning.bots;
  const bodies = match.world.bodies;
  const me = bodies[seat];
  const out = { mx: 0, my: 0, dash: false };
  if (!me.alive) return out;
  const rng = match.botRng[seat];
  if (match.tick % bt.wobbleTicks === 0) match.botWobble[seat] = rngInt(rng, 3) - 1;
  let target = -1;
  let bestD2 = 0;
  for (let i = 0; i < bodies.length; i++) {
    if (i === seat || !bodies[i].alive) continue;
    const dx = bodies[i].x - me.x;
    const dy = bodies[i].y - me.y;
    const d2 = dx * dx + dy * dy;
    if (target === -1 || d2 < bestD2) { target = i; bestD2 = d2; }
  }
  steer.x = 0;
  steer.y = 0;
  let targetDist = 0;
  if (target !== -1) {
    aimInside(bt, me, bodies[target]);
    // sideways wobble (perpendicular to the approach)
    const w = match.botWobble[seat] * bt.wobbleStrength;
    const dx = steer.x;
    const dy = steer.y;
    steer.x = dx - dy * w;
    steer.y = dy + dx * w;
    const d = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    steer.x = steer.x / d;
    steer.y = steer.y / d;
    targetDist = Math.sqrt(bestD2);
  }
  edgeSteer(bt, match, me, target, targetDist);
  out.mx = steer.x;
  out.my = steer.y;
  if (target !== -1 && me.dashCd === 0 && me.dashTicks === 0 && steer.edge < 0.5) {
    const reach = bt.dashRange + me.fig.radius + bodies[target].fig.radius;
    if (targetDist < reach && rngInt(rng, 100) < bt.dashChancePercent) out.dash = true;
  }
  return out;
}

// Style 1, the circler: hit and run.
// 1. Wobble draw as in style 0 (same generator use); the sign of the wobble is
//    the circling side (negative = one way, otherwise the other).
// 2. Target: the living opponent with the fewest other living figures within
//    circlerCrowdRange of it (so it stays out of a pile-up); nearest on a
//    tie, lowest seat on an exact tie.
// 3. While the dash is not nearly ready (dashCd above circlerAttackLeadTicks)
//    it circles the target at a gap of circlerStandoff cells.
// 4. Otherwise it runs at the aim point of style 0 and dashes as soon as the
//    dash is ready, the gap is below circlerDashGap and its front points at
//    the target (dot product at least circlerAlignDot). No chance roll.
// 5. Edge avoidance as in style 0; no dash while deep in edge avoidance.
function botCircler(tuning, match, seat) {
  const bt = tuning.bots;
  const bodies = match.world.bodies;
  const me = bodies[seat];
  const out = { mx: 0, my: 0, dash: false };
  if (!me.alive) return out;
  const rng = match.botRng[seat];
  if (match.tick % bt.wobbleTicks === 0) match.botWobble[seat] = rngInt(rng, 3) - 1;
  let target = -1;
  let bestCrowd = 0;
  let bestD2 = 0;
  const cr2 = bt.circlerCrowdRange * bt.circlerCrowdRange;
  for (let i = 0; i < bodies.length; i++) {
    if (i === seat || !bodies[i].alive) continue;
    let crowd = 0;
    for (let k = 0; k < bodies.length; k++) {
      if (k === seat || k === i || !bodies[k].alive) continue;
      const cx = bodies[k].x - bodies[i].x;
      const cy = bodies[k].y - bodies[i].y;
      if (cx * cx + cy * cy < cr2) crowd++;
    }
    const dx = bodies[i].x - me.x;
    const dy = bodies[i].y - me.y;
    const d2 = dx * dx + dy * dy;
    if (target === -1 || crowd < bestCrowd || (crowd === bestCrowd && d2 < bestD2)) { target = i; bestCrowd = crowd; bestD2 = d2; }
  }
  steer.x = 0;
  steer.y = 0;
  let targetDist = 0;
  let gap = 0;
  let ux = 0;
  let uy = 0;
  let attacking = false;
  if (target !== -1) {
    const t = bodies[target];
    targetDist = Math.sqrt(bestD2);
    if (targetDist > 0) { ux = (t.x - me.x) / targetDist; uy = (t.y - me.y) / targetDist; } else { ux = me.fx; uy = me.fy; }
    gap = targetDist - me.fig.radius - t.fig.radius;
    if (me.dashCd > bt.circlerAttackLeadTicks) {
      const side = match.botWobble[seat] < 0 ? -1 : 1;
      let radial = (gap - bt.circlerStandoff) / bt.circlerBlend;
      if (radial > 1) radial = 1;
      if (radial < -1) radial = -1;
      steer.x = -uy * side + ux * radial;
      steer.y = ux * side + uy * radial;
      const d = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
      steer.x = steer.x / d;
      steer.y = steer.y / d;
    } else {
      aimInside(bt, me, t);
      attacking = true;
    }
  }
  edgeSteer(bt, match, me, target, targetDist);
  out.mx = steer.x;
  out.my = steer.y;
  if (attacking && me.dashCd === 0 && me.dashTicks === 0 && steer.edge < 0.5
    && gap < bt.circlerDashGap && me.fx * ux + me.fy * uy >= bt.circlerAlignDot) out.dash = true;
  return out;
}

// Inputs for every seat; seats listed in humanInputs keep their given input.
// humanInputs: array with an input record or null (= bot) per seat.
export function ringBotInputs(tuning, match, humanInputs) {
  const inputs = [];
  for (let seat = 0; seat < match.seatCount; seat++) {
    const h = humanInputs ? humanInputs[seat] : null;
    inputs.push(h ? h : botRingInput(tuning, match, seat));
  }
  return inputs;
}

// Solo enemy: run at the hero, dash by chance when close.
export function botEnemyInput(tuning, run, index) {
  const so = tuning.solo;
  const bodies = run.world.bodies;
  const me = bodies[index];
  const hero = bodies[0];
  const out = { mx: 0, my: 0, dash: false };
  if (!me.alive || !hero.alive) return out;
  const dx = hero.x - me.x;
  const dy = hero.y - me.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d > 0) { out.mx = dx / d; out.my = dy / d; }
  if (me.dashCd === 0 && me.dashTicks === 0 && d < so.enemyDashRange + me.fig.radius + hero.fig.radius) {
    if (rngInt(run.rng, 100) < so.enemyDashChancePercent) out.dash = true;
  }
  return out;
}

// Solo hero bot (for simulation and attract mode). style 0 = kite (keep away
// and let the thrown weapon work), style 1 = brawl (run into the nearest enemy).
// Uses no random numbers.
export function botHeroInput(tuning, run, style) {
  const so = tuning.solo;
  const bodies = run.world.bodies;
  const me = bodies[0];
  const out = { mx: 0, my: 0, dash: false };
  if (!me.alive) return out;
  let near = -1;
  let nearD2 = 0;
  for (let i = 1; i < bodies.length; i++) {
    if (!bodies[i].alive) continue;
    const dx = bodies[i].x - me.x;
    const dy = bodies[i].y - me.y;
    const d2 = dx * dx + dy * dy;
    if (near === -1 || d2 < nearD2) { near = i; nearD2 = d2; }
  }
  let dirX = 0;
  let dirY = 0;
  let fleeing = false;
  if (near !== -1) {
    const e = bodies[near];
    const d = Math.sqrt(nearD2);
    const gap = d - me.fig.radius - e.fig.radius;
    let ux = 0;
    let uy = 0;
    if (d > 0) { ux = (e.x - me.x) / d; uy = (e.y - me.y) / d; }
    if (style === 1) {
      dirX = ux; dirY = uy;
      if (gap < so.enemyDashRange) out.dash = true;
    } else if (gap < so.botFleeDistance) {
      // away from the enemy, with a sideways part so the hero circles
      dirX = -ux - uy * 0.6;
      dirY = -uy + ux * 0.6;
      fleeing = true;
      if (gap < 2) out.dash = true;
    }
  }
  if (!fleeing && style !== 1 || near === -1) {
    // go for the nearest ink drop
    let best = -1;
    let bestD2 = 0;
    for (let i = 0; i < run.drops.length; i++) {
      const dx = run.drops[i].x - me.x;
      const dy = run.drops[i].y - me.y;
      const d2 = dx * dx + dy * dy;
      if (best === -1 || d2 < bestD2) { best = i; bestD2 = d2; }
    }
    if (best !== -1 && bestD2 > 0) {
      const d = Math.sqrt(bestD2);
      dirX = (run.drops[best].x - me.x) / d;
      dirY = (run.drops[best].y - me.y) / d;
    }
  }
  // stay off the wall
  const myDist = Math.sqrt(me.x * me.x + me.y * me.y);
  const limit = so.arenaRadius - so.botWallMargin;
  if (myDist > limit) {
    let w = (myDist - limit) / so.botWallMargin;
    if (w > 1) w = 1;
    dirX = dirX * (1 - w) - me.x / myDist * w;
    dirY = dirY * (1 - w) - me.y / myDist * w;
  }
  const l = Math.sqrt(dirX * dirX + dirY * dirY);
  if (l > 0) { out.mx = dirX / l; out.my = dirY / l; }
  return out;
}
