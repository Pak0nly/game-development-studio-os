// The drawing screen: 32 x 32 canvas, smooth 4-connected strokes, ink meter,
// optional time limit and the live stat display. Used by every mode.

import * as core from '../core/index.js';
import { tuning, W, H } from './tuning.js';
import { $, el, onPress, showScreen, onLeave, colours, hash3, reducedMotion, fitCanvas, ELEMENT_NAMES } from './ui.js';
import { sfx } from './audio.js';
import { makeSprite, drawSprite, wobbleFrame, thumbCanvas } from './sprites.js';
import { galleryAll, decode, hintSeen, markHintSeen } from './gallery.js';
import { SCRIBBLE_FIGURES, SCRIBBLE_WEAPONS } from './scribbles.js';

let S = null;          // the running session or null
let raf = 0;
let backArmed = 0;

const canvas = $('drawCanvas');
const preview = $('drawPreview');

function analyse() {
  const s = S;
  s.stats = core.computeStats(s.cells, W, H, tuning, s.kind, s.budget);
  const body = core.extractBody(s.cells, W, H).body;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      let m = 0; // 0 empty, 1 body, 2 core, 3 sharp, 4 drip
      if (s.cells[i] !== 0) {
        if (body[i] === 0) m = 4;
        else {
          const nb = core.countNeighbours(body, W, H, x, y);
          m = nb === 8 ? 2 : (8 - nb >= tuning.stats.sharpMinEmptyNeighbours ? 3 : 1);
        }
      }
      s.mark[i] = m;
    }
  }
  s.spriteDirty = true;
  updatePanel();
  if (s.onStats) s.onStats(s.stats);
}

function setVal(id, text) {
  const n = $(id);
  if (n.textContent === text) return;
  n.textContent = text;
  if (!reducedMotion()) { n.classList.remove('pop'); void n.offsetWidth; n.classList.add('pop'); }
}
function setBar(id, share) {
  $(id).style.width = Math.max(0, Math.min(100, share * 100)).toFixed(1) + '%';
}

function updatePanel() {
  const s = S;
  const st = s.stats;
  const left = s.budget - st.filled;
  $('inkNum').textContent = String(left);
  $('inkFill').style.width = Math.max(0, left / s.budget * 100).toFixed(1) + '%';
  $('inkMeter').classList.toggle('empty', left <= 0);
  const has = st.N > 0;
  setVal('stWeight', String(st.N));
  setVal('stArmour', has ? String(Math.round(st.armour)) : '0');
  setVal('stSharp', has ? st.sharpness.toFixed(1) : '0');
  setVal('stSpeed', has ? st.topSpeed.toFixed(0) : '0');
  const tst = tuning.stats;
  setBar('stWeightBar', st.N / s.budget);
  setBar('stArmourBar', has ? st.armour / (tst.armourBase + tst.armourPerCore * s.budget * 0.7) : 0);
  setBar('stSharpBar', has ? (st.sharpness - tst.sharpBase) / (tst.sharpPerSharpShareSquared + tst.sharpPerSharpShare + 0.001) : 0);
  setBar('stSpeedBar', has ? st.topSpeed / tst.speedBase : 0);
  const e = st.element;
  const ev = $('stElement');
  ev.className = 's-val wide' + (e ? ' e' + e : '');
  setVal('stElement', has ? ELEMENT_NAMES[e] : '–');
  let why;
  if (e) {
    const beats = tuning.element.beats[e];
    let loses = 0;
    for (let c = 2; c <= 4; c++) if (tuning.element.beats[c] === e) loses = c;
    why = 'schlägt ' + ELEMENT_NAMES[beats] + ', verliert gegen ' + ELEMENT_NAMES[loses];
  } else {
    const coloured = st.colourCounts[1] + st.colourCounts[2] + st.colourCounts[3];
    const pct = has ? Math.floor(coloured * 100 / st.N) : 0;
    why = 'ab ' + tuning.element.minColouredPercent + ' % einer Farbe (jetzt ' + pct + ' %)';
  }
  $('stElementWhy').textContent = why;

  const msg = $('drawMsg');
  const min = s.kind === 'weapon' ? tuning.ink.weaponMinBodyCells : tuning.ink.minBodyCells;
  let text = 'Strich = Klinge · Punkt = Panzerkern · blass = tropft ab';
  let warn = false;
  if (st.filled === 0) text = s.kind === 'weapon' ? 'Zeichne die Wurfwaffe. Leicht fliegt schnell, dünn schneidet.' : text;
  else if (!st.bigEnough) { text = 'Noch zu klein: mindestens ' + min + ' Kästchen am Stück.'; warn = true; }
  else if (st.drips > 0) { text = st.drips + ' Kästchen hängen nicht dran und tropfen ab.'; warn = true; }
  if (s.lockNote && st.filled === 0) text = s.lockNote;
  msg.textContent = text;
  msg.classList.toggle('warn', warn);
  $('drawDone').disabled = !st.valid;
}

function pushUndo() {
  S.undo.push(S.cells.slice());
  if (S.undo.length > 40) S.undo.shift();
}

function paintCell(x, y) {
  const s = S;
  const r = s.brush === 3 ? 1 : 0;
  let changed = false;
  for (let oy = -r; oy <= r; oy++) {
    for (let ox = -r; ox <= r; ox++) {
      const xx = x + ox;
      const yy = y + oy;
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      const i = yy * W + xx;
      const old = s.cells[i];
      if (old === s.tool) continue;
      if (s.tool !== 0 && old === 0) {
        if (s.filled >= s.budget) { s.denied = true; continue; }
        s.filled++;
      } else if (s.tool === 0) {
        s.filled--;
      }
      s.cells[i] = s.tool;
      changed = true;
    }
  }
  return changed;
}

// Walk the grid from the last cell to the new one, one axis step at a time,
// so every stroke is 4-connected (diagonal single cells would drip off).
function paintLine(x0, y0, x1, y1) {
  let changed = paintCell(x0, y0);
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x1 > x0 ? 1 : -1;
  const sy = y1 > y0 ? 1 : -1;
  let ix = 0;
  let iy = 0;
  let x = x0;
  let y = y0;
  while (ix < dx || iy < dy) {
    if (iy >= dy || (ix < dx && (0.5 + ix) * dy < (0.5 + iy) * dx)) { x += sx; ix++; } else { y += sy; iy++; }
    if (paintCell(x, y)) changed = true;
  }
  return changed;
}

function cellAt(ev) {
  const r = canvas.getBoundingClientRect();
  let x = Math.floor((ev.clientX - r.left) / r.width * W);
  let y = Math.floor((ev.clientY - r.top) / r.height * H);
  if (x < 0) x = 0; else if (x >= W) x = W - 1;
  if (y < 0) y = 0; else if (y >= H) y = H - 1;
  return [x, y];
}

function strokeTo(ev) {
  const s = S;
  const c = cellAt(ev);
  const changed = paintLine(s.lastX, s.lastY, c[0], c[1]);
  s.lastX = c[0];
  s.lastY = c[1];
  if (changed) {
    s.strokeChanged = true;
    sfx(s.tool === 0 ? 'erase' : 'pen');
    analyse();
  }
  if (s.denied && !s.deniedShown) {
    s.deniedShown = true;
    sfx('deny');
    const m = $('inkMeter');
    m.classList.remove('pop'); void m.offsetWidth; m.classList.add('pop');
  }
}

canvas.addEventListener('pointerdown', (ev) => {
  if (!S || S.closed) return;
  if (ev.pointerType === 'mouse' && ev.button !== 0) return;
  ev.preventDefault();
  const s = S;
  if (!$('drawHint').hidden) { $('drawHint').hidden = true; markHintSeen(); }
  if (s.timeLimit > 0 && s.timerStart === 0) s.timerStart = performance.now();
  try { canvas.setPointerCapture(ev.pointerId); } catch (e) { /* optional */ }
  s.drawing = true;
  s.pointerId = ev.pointerId;
  s.strokeChanged = false;
  s.denied = false;
  s.deniedShown = false;
  pushUndo();
  const c = cellAt(ev);
  s.lastX = c[0];
  s.lastY = c[1];
  strokeTo(ev);
});
canvas.addEventListener('pointermove', (ev) => {
  if (!S || !S.drawing || ev.pointerId !== S.pointerId) return;
  ev.preventDefault();
  const list = typeof ev.getCoalescedEvents === 'function' ? ev.getCoalescedEvents() : null;
  if (list && list.length > 1) for (const e of list) strokeTo(e);
  else strokeTo(ev);
});
function endStroke(ev) {
  if (!S || !S.drawing || ev.pointerId !== S.pointerId) return;
  S.drawing = false;
  if (!S.strokeChanged) S.undo.pop();
}
canvas.addEventListener('pointerup', endStroke);
canvas.addEventListener('pointercancel', endStroke);
canvas.addEventListener('contextmenu', (ev) => ev.preventDefault());

function selectTool(tool) {
  if (!S) return;
  S.tool = tool;
  for (let c = 1; c <= 4; c++) $('toolC' + c).classList.toggle('on', tool === c);
  $('toolErase').classList.toggle('on', tool === 0);
  sfx('click');
}
for (let c = 1; c <= 4; c++) onPress($('toolC' + c), () => selectTool(c));
onPress($('toolErase'), () => selectTool(0));
onPress($('toolBrush'), () => {
  if (!S) return;
  S.brush = S.brush === 1 ? 3 : 1;
  $('toolBrush').textContent = S.brush === 1 ? 'Dünn' : 'Dick';
  $('toolBrush').setAttribute('aria-pressed', S.brush === 3 ? 'true' : 'false');
  $('toolBrush').setAttribute('aria-label', 'Strichbreite: ' + (S.brush === 1 ? 'dünn' : 'dick'));
  sfx('click');
});

function replaceCells(cells) {
  pushUndo();
  S.cells = cells;
  let n = 0;
  for (let i = 0; i < cells.length; i++) if (cells[i] !== 0) n++;
  S.filled = n;
  analyse();
}
onPress($('toolUndo'), () => {
  if (!S || S.undo.length === 0) return;
  const cells = S.undo.pop();
  S.cells = cells;
  let n = 0;
  for (let i = 0; i < cells.length; i++) if (cells[i] !== 0) n++;
  S.filled = n;
  sfx('click');
  analyse();
});
onPress($('toolClear'), () => {
  if (!S || S.filled === 0) return;
  replaceCells(core.emptyDrawing(W, H).cells);
  sfx('erase');
});

$('toolPick').addEventListener('click', () => {
  if (!S) return;
  const grid = $('pickGrid');
  grid.textContent = '';
  const add = (cells, name, placeholder) => {
    const use = cells.map((v) => (v !== 0 && !S.allowed[v] ? 1 : v));
    const st = core.computeStats(use, W, H, tuning, S.kind, S.budget);
    if (!st.valid) return;
    const card = el('button', { class: 'card', type: 'button' }, [
      thumbCanvas(use, 80),
      el('span', { class: 'card-name', text: name }),
      placeholder ? el('span', { class: 'badge', text: 'Platzhalter' }) : null,
    ]);
    card.addEventListener('click', () => { replaceCells(use.slice()); $('pickLayer').hidden = true; sfx('click'); });
    grid.append(card);
  };
  let n = 0;
  for (const it of galleryAll()) {
    if ((it.kind === 'weapon') !== (S.kind === 'weapon')) continue;
    add(decode(it.data), 'Zeichnung ' + (++n), false);
  }
  for (const sc of (S.kind === 'weapon' ? SCRIBBLE_WEAPONS : SCRIBBLE_FIGURES)) add(sc.cells, sc.name, true);
  if (!grid.firstChild) grid.append(el('p', { class: 'empty-note', text: 'Nichts Passendes da.' }));
  $('pickLayer').hidden = false;
});
$('pickClose').addEventListener('click', () => { $('pickLayer').hidden = true; });
$('drawHintOk').addEventListener('click', () => { $('drawHint').hidden = true; markHintSeen(); });

$('drawBack').addEventListener('click', () => {
  if (!S) return;
  if (S.backConfirm && S.filled > 0 && performance.now() - backArmed > 2500) {
    backArmed = performance.now();
    $('drawBack').textContent = 'Sicher?';
    setTimeout(() => { if (S) $('drawBack').textContent = S.backLabel; }, 2500);
    return;
  }
  finish(null);
});
$('drawDone').addEventListener('click', () => {
  if (!S || !S.stats.valid) return;
  sfx('click');
  finish({ cells: S.cells.slice(), stats: S.stats, timedOut: false });
});

function finish(result) {
  const s = S;
  if (!s || s.closed) return;
  s.closed = true;
  S = null;
  cancelAnimationFrame(raf);
  $('pickLayer').hidden = true;
  $('drawExtra').textContent = '';
  s.resolve(result);
}

function layout() {
  const board = $('drawBoard');
  const size = Math.max(120, Math.floor(Math.min(board.clientWidth, board.clientHeight)) - 8);
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  fitCanvas(canvas, size, size);
  fitCanvas(preview, preview.clientWidth || 52, preview.clientHeight || 52);
}
if (typeof ResizeObserver === 'function') new ResizeObserver(() => { if (S) layout(); }).observe($('drawBoard'));
window.addEventListener('resize', () => { if (S) layout(); });

function drawBoard(t) {
  const s = S;
  const col = colours();
  const g = canvas.getContext('2d');
  const size = canvas.width;
  const c = size / W;
  g.fillStyle = col.paperLight;
  g.fillRect(0, 0, size, size);
  // squared paper
  g.strokeStyle = col.rule;
  g.lineWidth = 1;
  g.globalAlpha = 0.4;
  g.beginPath();
  for (let i = 1; i < W; i++) {
    const p = Math.round(i * c) + 0.5;
    g.moveTo(p, 0); g.lineTo(p, size);
    g.moveTo(0, p); g.lineTo(size, p);
  }
  g.stroke();
  // front marker
  g.globalAlpha = 0.55;
  g.fillStyle = col.inkFaint;
  g.beginPath();
  g.moveTo(size / 2, c * 0.25);
  g.lineTo(size / 2 - c * 0.9, c * 1.25);
  g.lineTo(size / 2 + c * 0.9, c * 1.25);
  g.closePath();
  g.fill();
  g.font = '600 ' + Math.round(c * 0.95) + 'px ' + getComputedStyle(document.body).fontFamily;
  g.textBaseline = 'top';
  g.textAlign = 'left';
  g.fillText('vorne', size / 2 + c * 1.3, c * 0.3);
  g.globalAlpha = 1;

  const still = reducedMotion();
  // ink
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const m = s.mark[i];
      if (m === 0) continue;
      g.fillStyle = col.cell[s.cells[i]];
      if (m === 4) {
        // a drip: pale, with a drop falling off
        g.globalAlpha = 0.3;
        g.fillRect(x * c, y * c, c, c);
        const ph = still ? 0.35 : (t * 0.9 + hash3(x, y, 3)) % 1;
        g.globalAlpha = 0.75 * (1 - ph);
        g.beginPath();
        g.ellipse((x + 0.5) * c, (y + 0.8 + ph * 2.4) * c, c * 0.22, c * (0.28 + ph * 0.2), 0, 0, 6.2832);
        g.fill();
        g.globalAlpha = 1;
        continue;
      }
      g.fillRect(x * c - 0.5, y * c - 0.5, c + 1, c + 1);
    }
  }
  // subtle marks: core cells get a light dot, sharp cells a light slash
  g.fillStyle = col.paperLight;
  g.strokeStyle = col.paperLight;
  g.lineWidth = Math.max(1, c * 0.16);
  g.lineCap = 'round';
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const m = s.mark[y * W + x];
      if (m === 2) {
        g.globalAlpha = 0.3;
        g.beginPath();
        g.arc((x + 0.5) * c, (y + 0.5) * c, c * 0.14, 0, 6.2832);
        g.fill();
      } else if (m === 3) {
        g.globalAlpha = 0.85;
        g.beginPath();
        g.moveTo((x + 0.28) * c, (y + 0.72) * c);
        g.lineTo((x + 0.72) * c, (y + 0.28) * c);
        g.stroke();
      }
    }
  }
  g.globalAlpha = 1;
}

function drawPreview(t) {
  const s = S;
  const g = preview.getContext('2d');
  const size = preview.width;
  g.clearRect(0, 0, size, size);
  if (s.spriteDirty && t - s.spriteTime > 0.12) {
    s.spriteDirty = false;
    s.spriteTime = t;
    if (s.stats.N > 0) {
      s.fig = core.buildFigure(s.cells, W, H, tuning, s.kind, s.budget);
      s.sprite = makeSprite(s.fig, 5);
    } else { s.fig = null; s.sprite = null; }
  }
  if (!s.sprite) return;
  const col = colours();
  const scale = Math.min(size / (s.fig.radius * 2 + 3), size / 12);
  const still = reducedMotion();
  // lighter figures hop faster
  const rate = 2.5 + s.stats.topSpeed / 6;
  const hop = still ? 0 : Math.abs(Math.sin(t * rate));
  const land = still ? 0 : Math.max(0, 1 - hop * 4);
  const cy = size * 0.56 - hop * size * 0.1;
  g.globalAlpha = 0.18;
  g.fillStyle = col.ink;
  g.beginPath();
  g.ellipse(size / 2, size * 0.9, size * (0.26 - hop * 0.06), size * 0.045, 0, 0, 6.2832);
  g.fill();
  g.globalAlpha = 1;
  drawSprite(g, s.sprite, wobbleFrame(t, 0), size / 2, cy, 0, -1, scale, 1 + land * 0.12, 1 - land * 0.12);
}

function frame(now) {
  if (!S) return;
  raf = requestAnimationFrame(frame);
  const t = now / 1000;
  const s = S;
  if (s.timeLimit > 0) {
    const left = s.timerStart === 0 ? s.timeLimit : Math.max(0, s.timeLimit - (now - s.timerStart) / 1000);
    const shown = Math.ceil(left);
    if (shown !== s.timerShown) {
      s.timerShown = shown;
      $('drawTimer').textContent = String(shown);
      $('drawTimer').classList.toggle('low', shown <= 5);
      if (shown <= 5 && shown > 0 && s.timerStart !== 0) sfx('tick');
    }
    if (left <= 0) {
      sfx('go');
      finish(s.stats.valid ? { cells: s.cells.slice(), stats: s.stats, timedOut: true } : { cells: null, stats: s.stats, timedOut: true });
      return;
    }
  }
  drawBoard(t);
  drawPreview(t);
}

onLeave('scrDraw', () => { if (S) finish(null); });

// opts: { title, sub, kind: 'figure' | 'weapon', budget, allowed: [5 booleans],
//   timeLimit (seconds, 0 = none), initial (cells), doneLabel, backLabel,
//   backConfirm, canPick, lockNote, extra(container) -> onStats callback }
// Resolves with { cells, stats, timedOut } or null when the player went back.
// On time-out with an invalid drawing cells is null.
export function openDraw(opts) {
  if (S) finish(null);
  return new Promise((resolve) => {
    const kind = opts.kind === 'weapon' ? 'weapon' : 'figure';
    const budget = opts.budget || (kind === 'weapon' ? tuning.ink.weaponBudget : tuning.ink.figureBudget);
    const allowed = opts.allowed || [false, true, true, true, true];
    let cells = opts.initial ? opts.initial.slice() : core.emptyDrawing(W, H).cells;
    let filled = 0;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] !== 0 && !allowed[cells[i]]) cells[i] = 1;
      if (cells[i] !== 0) filled++;
    }
    if (filled > budget) { cells = core.emptyDrawing(W, H).cells; filled = 0; }
    S = {
      resolve, kind, budget, allowed, cells, filled,
      mark: new Array(W * H).fill(0),
      undo: [], tool: 1, brush: 1,
      stats: null, onStats: null,
      drawing: false, pointerId: -1, lastX: 0, lastY: 0, strokeChanged: false, denied: false, deniedShown: false,
      timeLimit: opts.timeLimit || 0, timerStart: 0, timerShown: -1,
      sprite: null, fig: null, spriteDirty: true, spriteTime: -1,
      backConfirm: !!opts.backConfirm, backLabel: opts.backLabel || 'Zurück',
      lockNote: opts.lockNote || '', closed: false,
    };
    $('drawTitle').textContent = opts.title || 'Zeichne';
    $('drawSub').textContent = opts.sub || '';
    $('drawDone').textContent = opts.doneLabel || 'Fertig';
    $('drawBack').textContent = S.backLabel;
    backArmed = 0;
    $('drawTimer').hidden = S.timeLimit <= 0;
    $('toolPick').hidden = !opts.canPick;
    for (let c = 2; c <= 4; c++) {
      $('toolC' + c).disabled = !allowed[c];
      $('toolC' + c).hidden = !allowed[c];
    }
    $('toolBrush').textContent = 'Dünn';
    $('toolBrush').setAttribute('aria-pressed', 'false');
    $('drawHint').hidden = hintSeen();
    $('pickLayer').hidden = true;
    const extra = $('drawExtra');
    extra.textContent = '';
    showScreen('scrDraw');
    if (opts.extra) S.onStats = opts.extra(extra) || null;
    selectToolQuiet(1);
    layout();
    analyse();
    raf = requestAnimationFrame(frame);
  });
}

function selectToolQuiet(tool) {
  S.tool = tool;
  for (let c = 1; c <= 4; c++) $('toolC' + c).classList.toggle('on', tool === c);
  $('toolErase').classList.toggle('on', tool === 0);
}
