// Which drawings the Ring bots get. No page access in here, so the choice
// can be measured outside the browser too (build/ring_fairness.cjs).
//
// A pool entry is { cells, source: 'gallery' | 'placeholder', name?, weight }.
// Rules, measured with a scripted first-time player (see the evidence of
// INK-WEB-V4):
// - A single human never meets two heavy bot figures (HEAVY_INK or more).
// - While the player's gallery is small, the bots take placeholders, and a
//   single human gets a fair first line-up: one heavy placeholder that only
//   pushes and light ones that are beatable. The nastier placeholders (the
//   heavy hedgehog, the fast worm, the urchin) wait until the gallery has
//   OWN_MIN figures.
// - From then on the bots prefer the player's own gallery figures.

export const HEAVY_INK = 150;
export const OWN_MIN = 3;
export const OWN_SHARE = 0.7;
const FIRST_HEAVY = ['Klotz', 'Reif'];
const FIRST_LIGHT = ['Ramme', 'Qualle', 'Speer', 'Stachel'];

// Same shape, whatever the colours: a bot must not show up as the human's
// own figure in another ink.
export function sameCells(a, b) {
  if (!a || !b) return false;
  for (let i = 0; i < a.length; i++) if ((a[i] !== 0) !== (b[i] !== 0)) return false;
  return true;
}

// pool: { own: [...], built: [...] }; used: entries already handed out in
// this match (the pick is added); taken: cell arrays no bot may show;
// loneHuman: exactly one human sits in the match; rnd: () => 0..1.
export function pickBotDrawing(pool, used, taken, loneHuman, rnd) {
  const random = rnd || Math.random;
  const isFree = (d) => used.indexOf(d) === -1 && !(taken || []).some((t) => sameCells(t, d.cells));
  const heavyOut = loneHuman && used.some((d) => d.weight >= HEAVY_INK);
  const fits = (d) => isFree(d) && !(heavyOut && d.weight >= HEAVY_INK);
  const ownReady = pool.own.length >= OWN_MIN;
  let from = [];
  if (ownReady && random() < OWN_SHARE) from = pool.own.filter(fits);
  if (from.length === 0) {
    let built = pool.built.filter(fits);
    if (loneHuman && !ownReady) {
      const names = used.length === 0 ? FIRST_HEAVY : FIRST_LIGHT;
      const first = built.filter((d) => names.indexOf(d.name) !== -1);
      if (first.length > 0) built = first;
    }
    from = built;
  }
  if (from.length === 0) from = pool.own.filter(fits);
  if (from.length === 0) from = pool.built.filter((d) => !(taken || []).some((t) => sameCells(t, d.cells)) && !(heavyOut && d.weight >= HEAVY_INK));
  if (from.length === 0) from = pool.built;
  const d = from[Math.floor(random() * from.length)];
  used.push(d);
  return d;
}

// All bot drawings of a match at once, in a shuffled order so that the heavy
// one does not always sit on the same seat.
export function pickBotDrawings(pool, count, loneHuman, rnd) {
  const random = rnd || Math.random;
  const used = [];
  for (let i = 0; i < count; i++) pickBotDrawing(pool, used, null, loneHuman, random);
  const order = used.slice();
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const t = order[i]; order[i] = order[j]; order[j] = t;
  }
  return { order, used };
}
