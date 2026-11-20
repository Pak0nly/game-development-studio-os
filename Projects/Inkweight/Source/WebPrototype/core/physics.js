// Figure templates (collision shape) and the deterministic top-down step.
//
// Determinism contract: the simulation uses only + - * / and Math.sqrt on
// doubles, plus Math.floor (exact) and integer arithmetic. No sin/cos/atan2.
// Loop orders in this file are part of the contract (see RULES_AS_BUILT.md).
//
// World axes are the canvas axes: x to the right, y downward. A figure's front
// is the canvas top, so with front vector (fx, fy) = (0, -1) the figure is
// drawn exactly as on the canvas. Local cell (lx, ly) maps to the world as
//   wx = x + (-fy) * lx - fx * ly
//   wy = y +   fx  * lx + (-fy) * ly

import { computeStats, extractBody, countNeighbours, isSharpCell, elementMultiplier } from './drawing.js';

// Build the immutable template of a drawing: stats plus collision cells.
// Cells are listed in ascending cell index (y * W + x).
export function buildFigure(cells, W, H, tuning, kind, budget) {
  const stats = computeStats(cells, W, H, tuning, kind, budget);
  const body = extractBody(cells, W, H).body;
  const ph = tuning.physics;
  const lx = [];
  const ly = [];
  const sharp = [];
  const colour = [];
  const boundary = [];
  const grid = new Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const v = body[i];
      if (v === 0) { grid[i] = -1; continue; }
      const k = lx.length;
      grid[i] = k;
      lx.push(x + 0.5 - stats.cx);
      ly.push(y + 0.5 - stats.cy);
      colour.push(v);
      const nb = countNeighbours(body, W, H, x, y);
      sharp.push(isSharpCell(body, W, H, x, y));
      if (nb < 8) boundary.push(k);
    }
  }
  const turnRate = ph.turnBase / (1 + stats.inertia / ph.turnInertiaRef); // radians per second (small-angle)
  let accelK = ph.accelBase / (1 + stats.N / ph.accelWeightRef) / ph.tickRate;
  if (accelK > 1) accelK = 1;
  return {
    stats, W, H,
    cx: stats.cx, cy: stats.cy,
    count: lx.length,
    lx, ly, sharp, colour, boundary, grid,
    radius: stats.radius,
    mass: stats.push,
    accelK,
    turnRate,
  };
}

// A body is one moving instance of a figure template.
// armourMult, speedMult and damageMult default to 1 (the solo mode weakens
// enemy copies with them).
export function createBody(fig, x, y, fx, fy, team, armourMult, speedMult, damageMult) {
  const am = armourMult === undefined ? 1 : armourMult;
  const sm = speedMult === undefined ? 1 : speedMult;
  const dm = damageMult === undefined ? 1 : damageMult;
  const hp = fig.stats.armour * am;
  return {
    fig, team,
    x, y, vx: 0, vy: 0, fx, fy,
    hp, maxHp: hp,
    alive: true,
    topSpeed: fig.stats.topSpeed * sm,
    damageMult: dm,
    dashTicks: 0, dashCd: 0, dashDx: 0, dashDy: 0,
    // steering direction of the running tick (set by the control step, used
    // by the sub-steps; not state between ticks, not hashed)
    turning: false, turnDx: 0, turnDy: 0,
  };
}

// world: { bodies, cd, events, wallRadius }
// cd[i * n + j] = ticks until body i may damage body j again.
export function createWorld(bodies, wallRadius) {
  const n = bodies.length;
  const cd = new Array(n * n);
  for (let i = 0; i < n * n; i++) cd[i] = 0;
  return { bodies, cd, events: [], wallRadius: wallRadius === undefined ? 0 : wallRadius, subSteps: 1 };
}

const NO_INPUT = { mx: 0, my: 0, dash: false };

// One fixed tick. inputs[i] = { mx, my, dash } for body i (missing = idle).
// Order: 1 control (index order), 2 hit cooldowns, 3 sub-steps (each one:
// turn and integrate every body, then pairs i < j in index order), 4 wall. Elimination rules
// belong to the mode modules.
export function stepWorld(world, inputs, tuning) {
  const ph = tuning.physics;
  const bodies = world.bodies;
  const n = bodies.length;
  const dt = 1 / ph.tickRate;
  world.events.length = 0;

  // 1. control
  for (let i = 0; i < n; i++) {
    const b = bodies[i];
    if (!b.alive) continue;
    const inp = inputs[i] || NO_INPUT;
    let mx = inp.mx;
    let my = inp.my;
    let len2 = mx * mx + my * my;
    let dx = 0;
    let dy = 0;
    if (len2 > 0) {
      const len = Math.sqrt(len2);
      dx = mx / len;
      dy = my / len;
      if (len2 > 1) { mx = dx; my = dy; }
    }
    // the turn itself happens inside the sub-steps
    b.turning = len2 > 0 && (b.fx !== dx || b.fy !== dy);
    b.turnDx = dx;
    b.turnDy = dy;
    if (b.dashCd > 0) b.dashCd--;
    if (inp.dash && b.dashCd === 0 && b.dashTicks === 0) {
      if (len2 > 0) { b.dashDx = dx; b.dashDy = dy; } else { b.dashDx = b.fx; b.dashDy = b.fy; }
      b.dashTicks = ph.dashTicks;
      b.dashCd = ph.dashCooldownTicks;
    }
    let tvx;
    let tvy;
    let k;
    if (b.dashTicks > 0) {
      b.dashTicks--;
      const sp = b.topSpeed * ph.dashSpeedMult;
      tvx = b.dashDx * sp;
      tvy = b.dashDy * sp;
      k = ph.dashAccel;
    } else {
      tvx = mx * b.topSpeed;
      tvy = my * b.topSpeed;
      k = b.fig.accelK;
    }
    b.vx += (tvx - b.vx) * k;
    b.vy += (tvy - b.vy) * k;
  }

  // 2. hit cooldowns, once per tick
  for (let i = 0; i < n * n; i++) if (world.cd[i] > 0) world.cd[i]--;

  // 3. sub-steps. The tick is cut into equal parts so that no cell of any
  // body moves more than maxStepCells per part: the speed of a body (as it is
  // after control) plus, while it turns, the speed of its outermost cell
  // (size radius times turn rate). Two bodies then close by less than one
  // cell between two contact scans, so thin figures cannot jump over or turn
  // into each other.
  let maxSpeed = 0;
  for (let i = 0; i < n; i++) {
    const b = bodies[i];
    if (!b.alive) continue;
    let sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
    if (b.turning) sp += b.fig.radius * b.fig.turnRate;
    if (sp > maxSpeed) maxSpeed = sp;
  }
  let sub = Math.floor(maxSpeed * dt / ph.maxStepCells) + 1;
  if (sub > ph.maxSubSteps) sub = ph.maxSubSteps;
  const h = dt / sub;
  world.subSteps = sub;
  for (let s = 0; s < sub; s++) {
    for (let i = 0; i < n; i++) {
      const b = bodies[i];
      if (!b.alive) continue;
      if (b.turning) {
        // one part of this tick's turn step: half-angle tangent t / sub
        const t = b.fig.turnRate / (2 * ph.tickRate * sub);
        turnToward(b, b.turnDx, b.turnDy, (1 - t * t) / (1 + t * t), (2 * t) / (1 + t * t));
      }
      b.x += b.vx * h;
      b.y += b.vy * h;
    }
    for (let i = 0; i < n; i++) {
      const a = bodies[i];
      if (!a.alive) continue;
      for (let j = i + 1; j < n; j++) {
        const b = bodies[j];
        if (!b.alive) continue;
        collidePair(world, i, j, a, b, tuning);
      }
    }
    // Crowd relaxation (three or more bodies): pushing one pair apart can
    // press a body into a third one. The pairs are scanned again, positions
    // only, at most crowdRelaxPasses times, until no contact is deep.
    if (n > 2) {
      for (let r = 0; r < ph.crowdRelaxPasses; r++) {
        let pushed = false;
        for (let i = 0; i < n; i++) {
          const a = bodies[i];
          if (!a.alive) continue;
          for (let j = i + 1; j < n; j++) {
            const b = bodies[j];
            if (!b.alive) continue;
            if (relaxPair(a, b, ph)) pushed = true;
          }
        }
        if (!pushed) break;
      }
    }
  }

  // 4. wall (solo arena only)
  if (world.wallRadius > 0) {
    const lim = world.wallRadius;
    for (let i = 0; i < n; i++) {
      const b = bodies[i];
      if (!b.alive) continue;
      const d2 = b.x * b.x + b.y * b.y;
      if (d2 > lim * lim) {
        const d = Math.sqrt(d2);
        const nx = b.x / d;
        const ny = b.y / d;
        b.x = nx * lim;
        b.y = ny * lim;
        const vn = b.vx * nx + b.vy * ny;
        if (vn > 0) { b.vx -= nx * vn; b.vy -= ny * vn; }
      }
    }
  }
}

// Rotate the front vector toward the unit direction (dx, dy) by at most the
// angle with cosine turnCos and sine turnSin, then renormalise.
function turnToward(b, dx, dy, turnCos, turnSin) {
  const dot = b.fx * dx + b.fy * dy;
  if (dot >= turnCos) { b.fx = dx; b.fy = dy; return; }
  const cross = b.fx * dy - b.fy * dx;
  const cs = turnCos;
  const sn = cross >= 0 ? turnSin : -turnSin;
  const nx = b.fx * cs - b.fy * sn;
  const ny = b.fx * sn + b.fy * cs;
  const len = Math.sqrt(nx * nx + ny * ny);
  b.fx = nx / len;
  b.fy = ny / len;
}

// Scratch result of scanCells.
const scan = { sx: 0, sy: 0, maxDepth: 0, deepX: 0, deepY: 0, hits: 0, pSharp: false, qSharp: false };

// Every boundary cell of p (a circle of radius 0.5) is tested against the
// cells of q in the 3 x 3 block around it in q's grid. Adds depth-weighted
// normals pointing from q toward p (world space) to scan.sx / scan.sy.
function scanCells(p, q, sign) {
  const pf = p.fig;
  const qf = q.fig;
  const pc = -p.fy; // cos of p
  const ps = p.fx;  // sin of p
  const qc = -q.fy;
  const qs = q.fx;
  const bl = pf.boundary;
  const W = qf.W;
  const H = qf.H;
  for (let bi = 0; bi < bl.length; bi++) {
    const k = bl[bi];
    const lx = pf.lx[k];
    const ly = pf.ly[k];
    const wx = p.x + pc * lx - ps * ly - q.x;
    const wy = p.y + ps * lx + pc * ly - q.y;
    // into q's local frame (inverse rotation)
    const qx = qc * wx + qs * wy;
    const qy = qc * wy - qs * wx;
    const gx = Math.floor(qx + qf.cx);
    const gy = Math.floor(qy + qf.cy);
    if (gx < -1 || gy < -1 || gx > W || gy > H) continue;
    for (let oy = -1; oy <= 1; oy++) {
      const yy = gy + oy;
      if (yy < 0 || yy >= H) continue;
      for (let ox = -1; ox <= 1; ox++) {
        const xx = gx + ox;
        if (xx < 0 || xx >= W) continue;
        const m = qf.grid[yy * W + xx];
        if (m < 0) continue;
        const ex = qx - qf.lx[m];
        const ey = qy - qf.ly[m];
        const d2 = ex * ex + ey * ey;
        if (d2 >= 1) continue;
        scan.hits++;
        if (pf.sharp[k]) { if (sign > 0) scan.pSharp = true; else scan.qSharp = true; }
        if (qf.sharp[m]) { if (sign > 0) scan.qSharp = true; else scan.pSharp = true; }
        let depth = 1;
        let wnx = 0;
        let wny = 0;
        if (d2 > 0) {
          const d = Math.sqrt(d2);
          depth = 1 - d;
          // normal q -> p in q-local, weighted by depth, rotated to the world
          const nx = ex / d * depth;
          const ny = ey / d * depth;
          wnx = sign * (qc * nx - qs * ny);
          wny = sign * (qs * nx + qc * ny);
          scan.sx += wnx;
          scan.sy += wny;
        }
        // the deepest contact keeps its own (depth-weighted) normal
        if (depth > scan.maxDepth) { scan.maxDepth = depth; scan.deepX = wnx; scan.deepY = wny; }
      }
    }
  }
}

// Damage of one touch before multipliers: blunt, or with a sharp cell in the
// contact the sharpness (never less than blunt) plus the armour cut: a blade
// takes the share sharpArmourCut of the victim's full armour with every hit.
function touchDamage(tuning, body, sharp, victim) {
  const blunt = tuning.stats.bluntDamage;
  if (!sharp) return blunt;
  const sh = body.fig.stats.sharpness;
  return (sh > blunt ? sh : blunt) + tuning.stats.sharpArmourCut * victim.maxHp;
}

// Scratch result of contactNormal.
const normal = { x: 0, y: 0 };

// Scan the pair (a's boundary against b, then b's against a) into `scan`.
function scanPair(a, b) {
  scan.sx = 0; scan.sy = 0; scan.maxDepth = 0; scan.deepX = 0; scan.deepY = 0; scan.hits = 0;
  scan.pSharp = false; scan.qSharp = false;
  scanCells(a, b, 1);   // a's boundary against b's cells; pSharp = a, qSharp = b
  scanCells(b, a, -1);  // b's boundary against a's cells; flags are swapped back by sign
}

// Unit contact normal of the last scan; it pushes a away from b. Normally the
// summed contact vectors; when contacts on opposite sides cancel (the sum is
// shorter than deepNormalShare times the deepest depth) the deepest
// contact's own normal; then centre a minus centre b; then (1, 0).
function contactNormal(ph, a, b) {
  let nx = scan.sx;
  let ny = scan.sy;
  let l2 = nx * nx + ny * ny;
  const lim = ph.deepNormalShare * scan.maxDepth;
  if (l2 < lim * lim) {
    const dl2 = scan.deepX * scan.deepX + scan.deepY * scan.deepY;
    if (dl2 > 1e-12) { nx = scan.deepX; ny = scan.deepY; l2 = dl2; }
  }
  if (l2 < 1e-12) { nx = a.x - b.x; ny = a.y - b.y; l2 = nx * nx + ny * ny; }
  if (l2 < 1e-12) { nx = 1; ny = 0; l2 = 1; }
  const l = Math.sqrt(l2);
  normal.x = nx / l;
  normal.y = ny / l;
}

// Position-only push of a pair whose contact is deeper than
// deepContactDepth, by weight shares. Returns true when it pushed.
function relaxPair(a, b, ph) {
  const rx = a.x - b.x;
  const ry = a.y - b.y;
  const reach = a.fig.radius + b.fig.radius;
  if (rx * rx + ry * ry >= reach * reach) return false;
  scanPair(a, b);
  if (scan.hits === 0 || scan.maxDepth <= ph.deepContactDepth) return false;
  contactNormal(ph, a, b);
  const invA = 1 / a.fig.mass;
  const invB = 1 / b.fig.mass;
  const invSum = invA + invB;
  const d = scan.maxDepth;
  a.x += normal.x * d * invA / invSum;
  a.y += normal.y * d * invA / invSum;
  b.x -= normal.x * d * invB / invSum;
  b.y -= normal.y * d * invB / invSum;
  return true;
}

function collidePair(world, i, j, a, b, tuning) {
  const ph = tuning.physics;
  const rx = a.x - b.x;
  const ry = a.y - b.y;
  const reach = a.fig.radius + b.fig.radius;
  if (rx * rx + ry * ry >= reach * reach) return;
  scanPair(a, b);
  if (scan.hits === 0) return;
  const aSharp = scan.pSharp;
  const bSharp = scan.qSharp;
  contactNormal(ph, a, b);
  const nx = normal.x;
  const ny = normal.y;

  const invA = 1 / a.fig.mass;
  const invB = 1 / b.fig.mass;
  const invSum = invA + invB;
  const depth = scan.maxDepth;
  a.x += nx * depth * invA / invSum;
  a.y += ny * depth * invA / invSum;
  b.x -= nx * depth * invB / invSum;
  b.y -= ny * depth * invB / invSum;
  // A contact that is still deep after the push (interlocked teeth, a body
  // squeezed by a third one) is scanned and pushed again, positions only, at
  // most extraSeparationPasses times. Velocity, damage and the sharp flags
  // come from the first scan.
  for (let pass = 0; pass < ph.extraSeparationPasses; pass++) {
    scanPair(a, b);
    if (scan.hits === 0 || scan.maxDepth <= ph.deepContactDepth) break;
    contactNormal(ph, a, b);
    const d2 = scan.maxDepth;
    a.x += normal.x * d2 * invA / invSum;
    a.y += normal.y * d2 * invA / invSum;
    b.x -= normal.x * d2 * invB / invSum;
    b.y -= normal.y * d2 * invB / invSum;
  }
  const rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
  const dashing = a.dashTicks > 0 || b.dashTicks > 0;
  if (rel < 0) {
    // a contact that involves a dashing body is a ram: its own bounce factor
    const imp = -(1 + (dashing ? ph.dashRestitution : ph.restitution)) * rel / invSum;
    a.vx += nx * imp * invA;
    a.vy += ny * imp * invA;
    b.vx -= nx * imp * invB;
    b.vy -= ny * imp * invB;
  }
  // a contact ends the dash of both bodies, so the control step of the next
  // tick does not overwrite the velocity the contact has just given them
  if (dashing) {
    if (a.dashTicks > 0) { a.dashTicks = 0; world.events.push({ type: 'ram', from: i, to: j }); }
    if (b.dashTicks > 0) { b.dashTicks = 0; world.events.push({ type: 'ram', from: j, to: i }); }
  }

  // damage, once per direction per cooldown; never inside one team
  if (a.team === b.team) return;
  const n = world.bodies.length;
  if (world.cd[i * n + j] === 0) {
    const dmg = touchDamage(tuning, a, aSharp, b)
      * a.damageMult * elementMultiplier(tuning, a.fig.stats.element, b.fig.stats.element);
    b.hp -= dmg;
    world.cd[i * n + j] = ph.hitCooldownTicks;
    const kb = dmg * ph.hitKnockbackPerDamage * invB;
    b.vx -= nx * kb;
    b.vy -= ny * kb;
    world.events.push({ type: 'hit', from: i, to: j, damage: dmg, sharp: aSharp });
  }
  if (world.cd[j * n + i] === 0) {
    const dmg = touchDamage(tuning, b, bSharp, a)
      * b.damageMult * elementMultiplier(tuning, b.fig.stats.element, a.fig.stats.element);
    a.hp -= dmg;
    world.cd[j * n + i] = ph.hitCooldownTicks;
    const kb = dmg * ph.hitKnockbackPerDamage * invA;
    a.vx += nx * kb;
    a.vy += ny * kb;
    world.events.push({ type: 'hit', from: j, to: i, damage: dmg, sharp: bSharp });
  }
}

// World position of local cell k of body b (for drawing and tests).
export function cellWorldX(b, k) { return b.x + (-b.fy) * b.fig.lx[k] - b.fx * b.fig.ly[k]; }
export function cellWorldY(b, k) { return b.y + b.fx * b.fig.lx[k] + (-b.fy) * b.fig.ly[k]; }
