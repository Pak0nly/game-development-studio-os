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
  }
}

// Ring: tick, ringRadius, bodies (seat order: x y vx vy fx fy hp alive
// dashTicks dashCd), then the bot generator state of every seat.
export function hashRing(match) {
  const st = hashCreate();
  hashDouble(st, match.tick);
  hashDouble(st, match.ringRadius);
  hashBodies(st, match.world.bodies);
  for (let i = 0; i < match.botRng.length; i++) hashDouble(st, match.botRng[i].s);
  return hashHex(st);
}

// Solo: tick, bodies, shots (x y life), drops (x y value life), wallet,
// score, throwCd, generator state.
export function hashSolo(run) {
  const st = hashCreate();
  hashDouble(st, run.tick);
  hashBodies(st, run.world.bodies);
  for (let i = 0; i < run.shots.length; i++) {
    hashDouble(st, run.shots[i].x); hashDouble(st, run.shots[i].y); hashDouble(st, run.shots[i].life);
  }
  for (let i = 0; i < run.drops.length; i++) {
    hashDouble(st, run.drops[i].x); hashDouble(st, run.drops[i].y);
    hashDouble(st, run.drops[i].value); hashDouble(st, run.drops[i].life);
  }
  hashDouble(st, run.wallet); hashDouble(st, run.score); hashDouble(st, run.throwCd);
  hashDouble(st, run.rng.s);
  return hashHex(st);
}
