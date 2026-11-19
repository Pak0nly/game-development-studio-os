// Drawing grid, body extraction and stats (INK_RULES_V1 sections 1 to 4).
// A drawing is a flat array of W*H integers, index = y * W + x.
// 0 empty, 1 Black, 2 Ember (red), 3 Tide (blue), 4 Moss (green).

export const ELEMENT_NEUTRAL = 0;
export const COLOUR_BLACK = 1;
export const COLOUR_EMBER = 2;
export const COLOUR_TIDE = 3;
export const COLOUR_MOSS = 4;

// rows: array of H strings of W characters, '.' empty, '1'..'4' colours.
export function parseDrawing(rows) {
  const H = rows.length;
  const W = rows[0].length;
  const cells = new Array(W * H);
  for (let y = 0; y < H; y++) {
    const row = rows[y];
    if (row.length !== W) throw new Error('row ' + y + ' has wrong length');
    for (let x = 0; x < W; x++) {
      const ch = row.charCodeAt(x);
      let v = 0;
      if (ch >= 49 && ch <= 52) v = ch - 48;
      else if (ch !== 46) throw new Error('bad character in row ' + y);
      cells[y * W + x] = v;
    }
  }
  return { cells, W, H };
}

export function drawingToRows(cells, W, H) {
  const rows = [];
  for (let y = 0; y < H; y++) {
    let s = '';
    for (let x = 0; x < W; x++) {
      const v = cells[y * W + x];
      s += v === 0 ? '.' : String(v);
    }
    rows.push(s);
  }
  return rows;
}

export function emptyDrawing(W, H) {
  const cells = new Array(W * H);
  for (let i = 0; i < W * H; i++) cells[i] = 0;
  return { cells, W, H };
}

// Largest 4-connected group. Groups are found by scanning cell indices upward,
// so the first group found contains the lowest cell index; a later group only
// replaces it when it is strictly larger (rule 2.1 tie-break).
// Returns { body, N, filled, drips }: body is a W*H array with the colour of
// body cells and 0 elsewhere.
export function extractBody(cells, W, H) {
  const total = W * H;
  const label = new Array(total);
  for (let i = 0; i < total; i++) label[i] = -1;
  const stack = new Array(total);
  let filled = 0;
  let bestLabel = -1;
  let bestSize = 0;
  let nextLabel = 0;
  for (let i = 0; i < total; i++) {
    if (cells[i] === 0) continue;
    filled++;
    if (label[i] !== -1) continue;
    let sp = 0;
    let size = 0;
    stack[sp++] = i;
    label[i] = nextLabel;
    while (sp > 0) {
      const k = stack[--sp];
      size++;
      const x = k % W;
      const y = (k - x) / W;
      if (x > 0 && cells[k - 1] !== 0 && label[k - 1] === -1) { label[k - 1] = nextLabel; stack[sp++] = k - 1; }
      if (x < W - 1 && cells[k + 1] !== 0 && label[k + 1] === -1) { label[k + 1] = nextLabel; stack[sp++] = k + 1; }
      if (y > 0 && cells[k - W] !== 0 && label[k - W] === -1) { label[k - W] = nextLabel; stack[sp++] = k - W; }
      if (y < H - 1 && cells[k + W] !== 0 && label[k + W] === -1) { label[k + W] = nextLabel; stack[sp++] = k + W; }
    }
    if (size > bestSize) { bestSize = size; bestLabel = nextLabel; }
    nextLabel++;
  }
  const body = new Array(total);
  for (let i = 0; i < total; i++) body[i] = (bestLabel !== -1 && label[i] === bestLabel) ? cells[i] : 0;
  return { body, N: bestSize, filled, drips: filled - bestSize };
}

// Number of the 8 neighbours of (x, y) that are body cells. Outside = empty.
export function countNeighbours(body, W, H, x, y) {
  let n = 0;
  for (let oy = -1; oy <= 1; oy++) {
    const yy = y + oy;
    if (yy < 0 || yy >= H) continue;
    for (let ox = -1; ox <= 1; ox++) {
      if (ox === 0 && oy === 0) continue;
      const xx = x + ox;
      if (xx < 0 || xx >= W) continue;
      if (body[yy * W + xx] !== 0) n++;
    }
  }
  return n;
}

// Damage multiplier of an attacker element against a defender element.
export function elementMultiplier(tuning, attacker, defender) {
  const e = tuning.element;
  if (attacker < 2 || defender < 2) return 1;
  if (e.beats[attacker] === defender) return e.strongMult;
  if (e.beats[defender] === attacker) return e.weakMult;
  return 1;
}

// All derived values of a drawing. kind is 'figure' or 'weapon' (only the
// default budget and minimum size differ). budget may override the default.
export function computeStats(cells, W, H, tuning, kind, budget) {
  const st = tuning.stats;
  const isWeapon = kind === 'weapon';
  const inkBudget = budget !== undefined && budget !== null ? budget
    : (isWeapon ? tuning.ink.weaponBudget : tuning.ink.figureBudget);
  const minCells = isWeapon ? tuning.ink.weaponMinBodyCells : tuning.ink.minBodyCells;
  const ex = extractBody(cells, W, H);
  const body = ex.body;
  const N = ex.N;
  let C = 0;
  let S = 0;
  let sumX = 0;
  let sumY = 0;
  const colourCounts = [0, 0, 0, 0, 0];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const v = body[y * W + x];
      if (v === 0) continue;
      colourCounts[v]++;
      sumX += x;
      sumY += y;
      const nb = countNeighbours(body, W, H, x, y);
      if (nb === 8) C++;
      if (8 - nb >= st.sharpMinEmptyNeighbours) S++;
    }
  }
  // centroid of cell centres
  const cx = N > 0 ? sumX / N + 0.5 : 0;
  const cy = N > 0 ? sumY / N + 0.5 : 0;
  let maxD2 = 0;
  let inertia = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (body[y * W + x] === 0) continue;
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const d2 = dx * dx + dy * dy;
      inertia += d2;
      if (d2 > maxD2) maxD2 = d2;
    }
  }
  const radius = N > 0 ? Math.sqrt(maxD2) + 0.5 : 0;
  // element
  const coloured = colourCounts[2] + colourCounts[3] + colourCounts[4];
  let element = ELEMENT_NEUTRAL;
  if (N > 0 && coloured * 100 >= tuning.element.minColouredPercent * N) {
    let best = 0;
    let bestCount = 0;
    let tie = false;
    for (let c = 2; c <= 4; c++) {
      if (colourCounts[c] > bestCount) { bestCount = colourCounts[c]; best = c; tie = false; }
      else if (colourCounts[c] === bestCount) tie = true;
    }
    if (!tie && bestCount > 0) element = best;
  }
  const withinBudget = ex.filled <= inkBudget;
  const bigEnough = N >= minCells;
  return {
    kind: isWeapon ? 'weapon' : 'figure',
    budget: inkBudget,
    filled: ex.filled,
    drips: ex.drips,
    N, C, S,
    colourCounts: [colourCounts[1], colourCounts[2], colourCounts[3], colourCounts[4]],
    element,
    bigEnough,
    withinBudget,
    valid: bigEnough && withinBudget,
    weight: N,
    armour: st.armourBase + st.armourPerCore * C + st.armourPerCell * N,
    sharpness: st.sharpBase + st.sharpPerSharpCell * S
      + (N > 0 ? st.sharpPerSharpShare * S / N + st.sharpPerSharpShareSquared * (S / N) * (S / N) : 0),
    topSpeed: st.speedBase / (1 + N / st.speedWeightRef),
    cx, cy, radius, inertia,
  };
}
