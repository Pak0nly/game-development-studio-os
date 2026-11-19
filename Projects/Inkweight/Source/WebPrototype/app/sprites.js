// Figures are rendered from their cells: ink blocks with an outline whose
// corner points jitter from frame to frame (the "wobbling outline").
// A sprite holds a few pre-rendered wobble frames of one figure template.

import * as core from '../core/index.js';
import { tuning, W, H } from './tuning.js';
import { colours, hash3, reducedMotion } from './ui.js';

export const SPRITE_FRAMES = 3;
const MARGIN = 2; // cells of empty border around the grid
const cache = new WeakMap();

function drawFrame(fig, p, frame) {
  const col = colours();
  const size = (fig.W + MARGIN * 2) * p;
  const cv = document.createElement('canvas');
  cv.width = size;
  cv.height = size;
  const g = cv.getContext('2d');
  const grid = fig.grid;
  const FW = fig.W;
  const FH = fig.H;
  const has = (x, y) => x >= 0 && y >= 0 && x < FW && y < FH && grid[y * FW + x] !== -1;
  // corner jitter: every grid corner moves a little, differently per frame
  const jx = (x, y) => (x + MARGIN) * p + (hash3(x, y, frame * 7 + 1) - 0.5) * p * 0.34;
  const jy = (x, y) => (y + MARGIN) * p + (hash3(x, y, frame * 7 + 4) - 0.5) * p * 0.34;
  // ink fill
  for (let y = 0; y < FH; y++) {
    for (let x = 0; x < FW; x++) {
      const k = grid[y * FW + x];
      if (k === -1) continue;
      g.fillStyle = col.cell[fig.colour[k]];
      g.beginPath();
      g.moveTo(jx(x, y), jy(x, y));
      g.lineTo(jx(x + 1, y), jy(x + 1, y));
      g.lineTo(jx(x + 1, y + 1), jy(x + 1, y + 1));
      g.lineTo(jx(x, y + 1), jy(x, y + 1));
      g.closePath();
      g.fill();
      // close hairline gaps between neighbours
      g.fillRect((x + MARGIN) * p + p * 0.2, (y + MARGIN) * p + p * 0.2, p * 0.6, p * 0.6);
    }
  }
  // outline along every edge that borders empty space
  g.strokeStyle = col.ink;
  g.lineWidth = Math.max(1, p * 0.26);
  g.lineCap = 'round';
  g.beginPath();
  for (let y = 0; y < FH; y++) {
    for (let x = 0; x < FW; x++) {
      if (grid[y * FW + x] === -1) continue;
      if (!has(x, y - 1)) { g.moveTo(jx(x, y), jy(x, y)); g.lineTo(jx(x + 1, y), jy(x + 1, y)); }
      if (!has(x, y + 1)) { g.moveTo(jx(x, y + 1), jy(x, y + 1)); g.lineTo(jx(x + 1, y + 1), jy(x + 1, y + 1)); }
      if (!has(x - 1, y)) { g.moveTo(jx(x, y), jy(x, y)); g.lineTo(jx(x, y + 1), jy(x, y + 1)); }
      if (!has(x + 1, y)) { g.moveTo(jx(x + 1, y), jy(x + 1, y)); g.lineTo(jx(x + 1, y + 1), jy(x + 1, y + 1)); }
    }
  }
  g.stroke();
  // sharp cells get a small light glint so blades can be read in a fight
  g.strokeStyle = col.paperLight;
  g.globalAlpha = 0.75;
  g.lineWidth = Math.max(1, p * 0.14);
  g.beginPath();
  for (let k = 0; k < fig.count; k++) {
    if (!fig.sharp[k]) continue;
    const x = (fig.lx[k] + fig.cx + MARGIN) * p;
    const y = (fig.ly[k] + fig.cy + MARGIN) * p;
    g.moveTo(x - p * 0.2, y + p * 0.2);
    g.lineTo(x + p * 0.2, y - p * 0.2);
  }
  g.stroke();
  g.globalAlpha = 1;
  return cv;
}

// fig: a figure template from core.buildFigure.
export function spriteFor(fig) {
  let s = cache.get(fig);
  if (s) return s;
  s = makeSprite(fig, 8);
  cache.set(fig, s);
  return s;
}

export function makeSprite(fig, p) {
  const frames = [];
  for (let f = 0; f < SPRITE_FRAMES; f++) frames.push(drawFrame(fig, p, f));
  return { frames, p, ox: (fig.cx + MARGIN) * p, oy: (fig.cy + MARGIN) * p };
}

export function wobbleFrame(timeSec, phase) {
  if (reducedMotion()) return 0;
  return Math.floor(timeSec * 7 + (phase || 0)) % SPRITE_FRAMES;
}

// Draw a sprite centred on its centroid. (fx, fy) is the unit front vector;
// scale is device pixels per cell; sx/sy squash along the figure's own axes.
export function drawSprite(g, sprite, frame, x, y, fx, fy, scale, sx, sy) {
  const k = scale / sprite.p;
  g.save();
  g.translate(x, y);
  g.transform(-fy, fx, -fx, -fy, 0, 0);
  g.scale(k * (sx || 1), k * (sy || 1));
  g.drawImage(sprite.frames[frame], -sprite.ox, -sprite.oy);
  g.restore();
}

export function figureOf(cells) {
  return core.buildFigure(cells, W, H, tuning, 'figure', W * H);
}

// A still thumbnail canvas of a drawing, zoomed to the drawn body.
export function thumbCanvas(cells, cssSize) {
  const fig = figureOf(cells);
  const cv = document.createElement('canvas');
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  cv.width = Math.round(cssSize * dpr);
  cv.height = Math.round(cssSize * dpr);
  cv.style.width = cssSize + 'px';
  cv.style.height = cssSize + 'px';
  if (fig.count === 0) return cv;
  const g = cv.getContext('2d');
  const scale = Math.min(cv.width / (fig.radius * 2 + 2), cv.width / 14);
  drawSprite(g, makeSprite(fig, Math.max(4, Math.ceil(scale))), 0, cv.width / 2, cv.height / 2, 0, -1, scale, 1, 1);
  return cv;
}
