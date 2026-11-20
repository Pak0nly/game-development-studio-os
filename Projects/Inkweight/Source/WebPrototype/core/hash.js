// State hash for bit-exact comparison between implementations.
// FNV-1a (32 bit) over the 8 little-endian IEEE-754 bytes of every value, in
// the order given below. Integers and flags are hashed as doubles too.
// C#: BitConverter.GetBytes(double) on a little-endian machine, uint maths.

const f64 = new Float64Array(1);
const u8 = new Uint8Array(f64.buffer);

export function hashCreate() { return { h: 0x811c9dc5 }; }

export function hashDouble(st, value) {
  f64[0] = value;
  let h = st.h;
  for (let i = 0; i < 8; i++) {
    h = (h ^ u8[i]) >>> 0;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  st.h = h;
}

export function hashHex(st) {
  const s = st.h.toString(16);
  return '00000000'.substring(s.length) + s;
}

function hashBodies(st, bodies) {
  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    hashDouble(st, b.x); hashDouble(st, b.y);
    hashDouble(st, b.vx); hashDouble(st, b.vy);
    hashDouble(st, b.fx); hashDouble(st, b.fy);
    hashDouble(st, b.hp);
    hashDouble(st, b.alive ? 1 : 0);
    hashDouble(st, b.dashTicks); hashDouble(st, b.dashCd);
    hashDouble(st, b.dashDx); hashDouble(st, b.dashDy);
  }
}

function hashCooldowns(st, world) {
  for (let i = 0; i < world.cd.length; i++) hashDouble(st, world.cd[i]);
}

// Ring (layout 2): round, tick, ringRadius, bodies (seat order: x y vx vy fx
// fy hp alive dashTicks dashCd dashDx dashDy), all hit cooldowns (world.cd in
// index order), then per seat: bot generator state, bot wobble, bot style.
export function hashRing(match) {
  const st = hashCreate();
  hashDouble(st, match.round);
  hashDouble(st, match.tick);
  hashDouble(st, match.ringRadius);
  hashBodies(st, match.world.bodies);
  hashCooldowns(st, match.world);
  for (let i = 0; i < match.seatCount; i++) {
    hashDouble(st, match.botRng[i].s);
    hashDouble(st, match.botWobble[i]);
    hashDouble(st, match.botStyle[i]);
  }
  return hashHex(st);
}

// Solo (layout 2): wave, tick, bodies, all hit cooldowns, shots (x y ux uy
// speed life), drops (x y value life), wallet, score, throwCd, generator
// state, then heroBudget, weaponBudget, colours 1..4 (1 or 0), upgradeTaken
// (1 or 0), copies, stake index, dropValue, heroMaxHp.
export function hashSolo(run) {
  const st = hashCreate();
  hashDouble(st, run.wave);
  hashDouble(st, run.tick);
  hashBodies(st, run.world.bodies);
  hashCooldowns(st, run.world);
  for (let i = 0; i < run.shots.length; i++) {
    const sh = run.shots[i];
    hashDouble(st, sh.x); hashDouble(st, sh.y);
    hashDouble(st, sh.ux); hashDouble(st, sh.uy); hashDouble(st, sh.speed);
    hashDouble(st, sh.life);
  }
  for (let i = 0; i < run.drops.length; i++) {
    hashDouble(st, run.drops[i].x); hashDouble(st, run.drops[i].y);
    hashDouble(st, run.drops[i].value); hashDouble(st, run.drops[i].life);
  }
  hashDouble(st, run.wallet); hashDouble(st, run.score); hashDouble(st, run.throwCd);
  hashDouble(st, run.rng.s);
  hashDouble(st, run.heroBudget); hashDouble(st, run.weaponBudget);
  for (let c = 1; c <= 4; c++) hashDouble(st, run.colours[c] ? 1 : 0);
  hashDouble(st, run.upgradeTaken ? 1 : 0);
  hashDouble(st, run.copies); hashDouble(st, run.stakeIndex); hashDouble(st, run.dropValue);
  hashDouble(st, run.heroMaxHp);
  return hashHex(st);
}
