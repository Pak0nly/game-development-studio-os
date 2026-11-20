// Archetype drawings for the balance simulation and the golden files.
// Built with integer arithmetic only, so the drawings are identical everywhere.
// Canvas top (y = 0) is the front of a figure.

export const W = 32;
export const H = 32;

export function blank() {
  const c = new Array(W * H);
  for (let i = 0; i < W * H; i++) c[i] = 0;
  return c;
}
export function set(c, x, y, v) { if (x >= 0 && y >= 0 && x < W && y < H) c[y * W + x] = v; }
export function rect(c, x0, y0, x1, y1, v) {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(c, x, y, v);
}
// Disc around the point (cx2 / 2, cy2 / 2) in cell-corner units; a cell is
// inside when its centre is within radius r2 / 2. All integers.
export function disc(c, cx2, cy2, r2, v) {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const dx = 2 * x + 1 - cx2;
    const dy = 2 * y + 1 - cy2;
    if (dx * dx + dy * dy <= r2 * r2) set(c, x, y, v);
  }
}
export function recolour(cells, v) {
  const c = cells.slice();
  for (let i = 0; i < c.length; i++) if (c[i] !== 0) c[i] = v;
  return c;
}

function mk(name, colour, shape, note, draw, optimiser) {
  const c = blank();
  draw(c, colour);
  return { name, shape, note, cells: c, optimiser: optimiser === true };
}

// shape = shape family, used to judge "clearly different shapes".
export const ARCHETYPES = [
  mk('disc', 1, 'solid', 'filled disc, heavy and armoured', (c, v) => disc(c, 32, 32, 16, v)),
  mk('block', 1, 'solid', 'filled 14 x 15 block', (c, v) => rect(c, 9, 9, 22, 23, v)),
  mk('ring', 3, 'hollow', 'hollow ring, big and light', (c, v) => { disc(c, 32, 32, 24, v); disc(c, 32, 32, 19, 0); }),
  mk('cross', 2, 'blades', 'thin cross over the whole canvas', (c, v) => { rect(c, 0, 16, 31, 16, v); rect(c, 16, 0, 16, 31, v); }),
  mk('star', 4, 'core+blades', 'core disc with four long spikes', (c, v) => {
    disc(c, 33, 33, 10, v); rect(c, 16, 3, 16, 29, v); rect(c, 3, 16, 29, 16, v);
  }),
  mk('lance', 2, 'core+blades', 'core at the back, one lance at the front', (c, v) => {
    disc(c, 33, 45, 12, v); rect(c, 16, 2, 16, 20, v);
  }),
  mk('line', 1, 'blades', 'one long line', (c, v) => rect(c, 16, 0, 16, 31, v)),
  mk('comb', 3, 'core+blades', 'bar with teeth pointing forward', (c, v) => {
    rect(c, 4, 18, 27, 20, v);
    for (let x = 4; x <= 26; x += 2) rect(c, x, 9, x, 17, v);
  }),
  mk('shield', 4, 'solid', 'wide plate at the front of a block', (c, v) => { rect(c, 2, 6, 29, 9, v); rect(c, 11, 10, 20, 19, v); }),
  mk('dot', 1, 'small', 'smallest valid blob, fast', (c, v) => disc(c, 33, 33, 4, v)),
  mk('hedgehog', 2, 'core+blades', 'disc with short spikes all round', (c, v) => {
    disc(c, 33, 33, 12, v);
    for (let k = 12; k <= 20; k += 2) { rect(c, k, 7, k, 12, v); rect(c, k, 20, k, 25, v); rect(c, 7, k, 12, k, v); rect(c, 20, k, 25, k, v); }
  }),
  mk('wedge', 3, 'solid', 'filled triangle, point forward', (c, v) => {
    for (let i = 0; i < 20; i++) rect(c, 16 - (i >> 1), 6 + i, 16 + ((i + 1) >> 1), 6 + i, v);
  }),
  mk('frame', 4, 'hollow', 'hollow box with a spike at the front', (c, v) => {
    rect(c, 8, 10, 23, 25, v); rect(c, 10, 12, 21, 23, 0); rect(c, 16, 2, 16, 9, v);
  }),
  mk('needle', 1, 'small', 'short light blade with a grip', (c, v) => { rect(c, 16, 8, 16, 23, v); rect(c, 14, 23, 18, 23, v); }),
  // "Player optimiser" drawings (INK-CORE-V2): what a clever player might draw
  // to break the rules. optimiser = true.
  mk('hoop', 3, 'hollow', 'optimiser: one-cell loop round a big empty middle (all blade, big pocket)', (c, v) => {
    rect(c, 4, 4, 27, 27, v); rect(c, 5, 5, 26, 26, 0);
  }, true),
  mk('spiral', 2, 'blades', 'optimiser: one-cell snake that spends all ink on blade cells (heavy and all sharp)', (c, v) => {
    for (let k = 0; k < 10; k++) {
      rect(c, 6, 6 + 2 * k, 25, 6 + 2 * k, v);
      if (k < 9) set(c, k % 2 === 0 ? 25 : 6, 7 + 2 * k, v);
    }
  }, true),
  mk('grille', 4, 'blades', 'optimiser: nested one-cell loops with one-cell gaps (heavy, sharp, tries to farm enclosed space)', (c, v) => {
    for (let i = 6; i <= 12; i += 2) { rect(c, i, i, 31 - i, 31 - i, v); rect(c, i + 1, i + 1, 30 - i, 30 - i, 0); }
    set(c, 16, 7, v); set(c, 16, 9, v); set(c, 16, 11, v);
  }, true),
  mk('splinter', 1, 'small', 'optimiser: the smallest valid blade, 12 cells (fastest, all sharp)', (c, v) => rect(c, 16, 10, 16, 21, v), true),
  // from the INK-CORE-V2 review (finding I5): thick empty shells
  mk('hoop2', 3, 'hollow', 'optimiser: empty box with walls two cells thick near the canvas border, 216 ink', (c, v) => {
    rect(c, 1, 1, 29, 29, v); rect(c, 3, 3, 27, 27, 0);
  }, true),
  mk('hoop3', 4, 'hollow', 'optimiser: empty box with walls three cells thick, 216 ink', (c, v) => {
    rect(c, 5, 5, 25, 25, v); rect(c, 8, 8, 22, 22, 0);
  }, true),
];

export function archetype(name) {
  for (const a of ARCHETYPES) if (a.name === name) return a;
  throw new Error('no archetype ' + name);
}
