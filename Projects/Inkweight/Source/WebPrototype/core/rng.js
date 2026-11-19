// Seeded integer random generator (xorshift32). State is one unsigned 32-bit
// integer held in an object { s }. Port to C# with `uint` arithmetic.

export function rngCreate(seed) {
  let s = (seed ^ 0x9e3779b9) >>> 0;
  if (s === 0) s = 0x1234567;
  const r = { s };
  // warm up so that neighbouring seeds diverge
  rngU32(r); rngU32(r); rngU32(r); rngU32(r);
  return r;
}

// Seed for a sub-stream (for example one per seat).
export function rngDerive(seed, index) {
  return rngCreate(((seed >>> 0) + Math.imul(index + 1, 0x85ebca6b)) >>> 0);
}

export function rngU32(r) {
  let x = r.s;
  x = (x ^ (x << 13)) >>> 0;
  x = (x ^ (x >>> 17)) >>> 0;
  x = (x ^ (x << 5)) >>> 0;
  r.s = x;
  return x;
}

// Integer in [0, n). n must be 1..65536.
export function rngInt(r, n) {
  return (rngU32(r) >>> 8) % n;
}

// Double in [0, 1) with 24 random bits (exact in binary).
export function rngFloat(r) {
  return (rngU32(r) >>> 8) / 16777216;
}
