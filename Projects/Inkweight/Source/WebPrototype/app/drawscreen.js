// The drawing screen: 32 x 32 canvas, smooth 4-connected strokes, ink meter,
// optional time limit and the live stat display. Used by every mode.

import * as core from '../core/index.js';
import { tuning, W, H } from './tuning.js';
import { $, el, onPress, showScreen, onLeave, colours, hash3, reducedMotion, fitCanvas, ELEMENT_NAMES, num, inputBlocked } from './ui.js';
import { sfx } from './audio.js';
import { makeSprite, drawSprite, wobbleFrame, thumbCanvas } from './sprites.js';
import { galleryAll, decode, hintSeen, markHintSeen } from './gallery.js';
import { SCRIBBLE_FIGURES, SCRIBBLE_WEAPONS } from './scribbles.js';

let S = null;          // the running session or null
let raf = 0;
let backArmed = 0;

const canvas = $('drawCanvas');
const preview = $('drawPreview');

// Marks per cell for the board: 0 empty, 1 body, 2 core, 3 blade, 4 drip,
// 5 pocket (enclosed empty cell that touches no ink). Blade cells come from
// the core's own rule (isSharpCell); the pocket cells follow countEnclosed.
const openScratch = new Array(W * H);
function analyse() {
  const s = S;
  s.stats = core.computeStats(s.cells, W, H, tuning, s.kind, s.budget);
  const body = core.extractBody(s.cells, W, H).body;
  // open space: every empty cell reachable from the canvas border (8 directions)
  const open = openScratch;
  const stack = [];
  for (let i = 0; i < W * H; i++) open[i] = false;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (x !== 0 && y !== 0 && x !== W - 1 && y !== H - 1) continue;
      const i = y * W + x;
      if (body[i] === 0) { open[i] = true; stack.push(i); }
    }
  }
  while (stack.length > 0) {
    const k = stack.pop();
    const x = k % W;
    const y = (k - x) / W;
    for (let oy = -1; oy <= 1; oy++) {
      const yy = y + oy;
      if (yy < 0 || yy >= H) continue;
      for (let ox = -1; ox <= 1; ox++) {
        const xx = x + ox;
        if (xx < 0 || xx >= W) continue;
        const j = yy * W + xx;
        if (body[j] === 0 && !open[j]) { open[j] = true; stack.push(j); }
      }
    }
  }
  let blades = 0;
  let pockets = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      let m = 0;
      if (s.cells[i] !== 0) {
        if (body[i] === 0) m = 4;
        else if (core.isSharpCell(body, W, H, x, y)) { m = 3; blades++; }
        else m = core.countNeighbours(body, W, H, x, y) === 8 ? 2 : 1;
      } else if (!open[i] && core.countNeighbours(body, W, H, x, y) === 0) { pockets++; if (s.stats.pocketCells > 0) m = 5; }
      s.mark[i] = m;
    }
  }
  // read by the automated check: what the board marks right now
  if (window.__inkDebug) window.__inkDebug.marks = { blades, pockets, S: s.stats.S, P: s.stats.P, counted: s.stats.pocketCells, rings: s.stats.pocketCells > 0 ? pockets : 0 };
  s.bladeMarks = blades;
  s.pocketMarks = pockets;
  s.spriteDirty = true;
  updatePanel();
  if (s.onStats) s.onStats(s.stats);
}

function setWhy(id, text) { const n = $(id); if (n.textContent !== text) n.textContent = text; }

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
  setVal('stSharp', has ? num(st.sharpness, 1) : '0');
  setVal('stSpeed', has ? num(st.topSpeed, 0) : '0');
  const tst = tuning.stats;
  const minCells = s.kind === 'weapon' ? tuning.ink.weaponMinBodyCells : tuning.ink.minBodyCells;
  // Every line below says what rules version 2 really do with this drawing.
  // Weight: ink cells; the push weight adds a tenth of the counting pocket cells.
  // All lines are short enough for one row (they never change the layout).
  let wWhy = 'viel Tinte schiebt, ist aber träge';
  if (has) {
    if (st.pocketCells > 0) wWhy = 'Schub ' + num(st.push, 1) + ' · Hohlraum schiebt mit';
    else if (st.P > 0) wWhy = 'Hohlraum zählt erst mit dicker Wand';
    else if (st.enclosed > 0) wWhy = 'Hohlraum zu klein (erst ab 3 × 3)';
    else wWhy = 'träge · dicke Hülle schiebt härter';
  }
  setWhy('stWeightWhy', wWhy);
  setWhy('stArmourWhy', has ? 'volle Fläche schützt · ' + st.C + (st.C === 1 ? ' Kern-Punkt' : ' Kern-Punkte') : 'volle Flächen halten mehr aus');
  const cut = num(tst.sharpArmourCut * 100, 1);
  setWhy('stSharpWhy', !has ? 'dünne Striche sind Klingen, auch schräge'
    : (st.S > 0 ? st.S + (st.S === 1 ? ' Klinge' : ' Klingen') + ' · Schnitt: auch ' + cut + ' % Panzer' : 'keine Klinge · dünner Strich schneidet'));
  setWhy('stSpeedWhy', 'Kästchen pro Sekunde · leicht ist flink');
  // bar ends are the real ranges of valid drawings with this much ink
  setBar('stWeightBar', st.N / s.budget);
  setBar('stArmourBar', has ? st.armour / (tst.armourBase + 1.1 * s.budget) : 0);
  setBar('stSharpBar', has ? (st.sharpness - tst.sharpBase) / (tst.sharpMax + tst.sharpPurity / (1 + minCells / tst.sharpPurityWeightRef)) : 0);
  setBar('stSpeedBar', has ? st.topSpeed / (tst.speedBase / (1 + minCells / tst.speedWeightRef)) : 0);
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
    // The rule: at least minColouredPercent of the body is coloured ink (all
    // colours together), then the most common colour; a tie is no element.
    const coloured = st.colourCounts[1] + st.colourCounts[2] + st.colourCounts[3];
    const min = tuning.element.minColouredPercent;
    const pct = has ? Math.floor(coloured * 100 / st.N) : 0;
    if (coloured === 0) why = 'Schwarz ist neutral: kein Element';
    else if (coloured * 100 < min * st.N) why = 'ab ' + min + ' % bunter Tinte (jetzt ' + pct + ' %)';
    else why = 'Gleichstand: kein Element';
  }
  $('stElementWhy').textContent = why;

  const msg = $('drawMsg');
  const min = s.kind === 'weapon' ? tuning.ink.weaponMinBodyCells : tuning.ink.minBodyCells;
  const legend = 'Strich = Klinge · Punkt = Kern · Kringel = Hohlraum';
  let text = legend;
  let warn = false;
  let soft = ''; // short form of a warning that does not stop the player
  if (st.filled === 0) text = s.kind === 'weapon' ? 'Wurfwaffe: leicht fliegt schnell, dünn schneidet.' : text;
  else if (!st.bigEnough) { text = 'Noch zu klein: mindestens ' + min + ' Kästchen am Stück.'; warn = true; }
  else if (st.drips > 0) { text = st.drips === 1 ? '1 Kästchen hängt nicht dran und tropft ab.' : st.drips + ' Kästchen hängen nicht dran und tropfen ab.'; warn = true; soft = st.drips === 1 ? '1 Kästchen tropft ab' : st.drips + ' Kästchen tropfen ab'; }
  else if (left <= 0) { text = 'Tinte ist alle: radier etwas weg.'; warn = true; soft = 'Tinte ist alle'; }
  if (s.lockNote && st.filled === 0) text = s.lockNote;
  if (s.askingBack) { soft = ''; text = s.backConfirm ? s.endMsg : 'Noch einmal tippen, dann ist die Zeichnung weg.'; warn = true; }
  // Where a mode has its own line below (the solo stake note), messages go
  // there and this line stays away for good, so nothing changes height.
  if (s.onStats && s.onStats.setMsg) s.onStats.setMsg(text === legend ? '' : text, warn, soft);
  else msg.textContent = text;
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

// The cell under the pointer, or null while the pointer is off the canvas.
function cellAt(ev) {
  const r = canvas.getBoundingClientRect();
  const x = Math.floor((ev.clientX - r.left) / r.width * W);
  const y = Math.floor((ev.clientY - r.top) / r.height * H);
  if (x < 0 || y < 0 || x >= W || y >= H) return null;
  return [x, y];
}

// The window size a stroke was started in (a rotated phone changes it).
// Only the width and the orientation count: browser bars that slide in or out
// change the height alone and must not cut a stroke.
function canvasPlace() { return [window.innerWidth, window.innerWidth > window.innerHeight ? 1 : 0]; }

function strokeTo(ev) {
  const s = S;
  // the phone was rotated under the finger: the stroke ends here instead of
  // being joined to wherever the finger now points (the move can arrive
  // before the resize event does)
  const p = canvasPlace();
  if (p[0] !== s.place[0] || p[1] !== s.place[1]) { endStroke(null); return; }
  const c = cellAt(ev);
  // a finger that slides off the canvas stops painting; the stroke goes on
  // (without a joining line) where the finger comes back in
  if (!c) { s.outside = true; return; }
  if (s.outside) { s.outside = false; s.lastX = c[0]; s.lastY = c[1]; }
  const changed = paintLine(s.lastX, s.lastY, c[0], c[1]);
  s.lastX = c[0];
  s.lastY = c[1];
  if (changed) {
    s.strokeChanged = true;
    s.dirty = true;
    sfx(s.tool === 0 ? 'erase' : 'pen');
    analyse();
  }
  if (s.denied && !s.deniedShown) {
    s.deniedShown = true;
    sfx('deny');
    const m = $('inkMeter');
    if (!reducedMotion()) { m.classList.remove('pop'); void m.offsetWidth; m.classList.add('pop'); }
    updatePanel();
  }
}

function beginStroke(ev) {
  const s = S;
  if (!$('drawHint').hidden) { $('drawHint').hidden = true; markHintSeen(); }
  if (s.timeLimit > 0 && s.timerStart === 0) s.timerStart = performance.now();
  try { canvas.setPointerCapture(ev.pointerId); } catch (e) { /* optional */ }
  s.drawing = true;
  s.pointerId = ev.pointerId;
  s.strokeChanged = false;
  s.denied = false;
  s.deniedShown = false;
  s.outside = false;
  s.place = canvasPlace();
  pushUndo();
  const c = cellAt(ev);
  if (!c) { s.outside = true; return; }
  s.lastX = c[0];
  s.lastY = c[1];
  strokeTo(ev);
}
canvas.addEventListener('pointerdown', (ev) => {
  if (!S || S.closed) return;
  if (ev.pointerType === 'mouse' && ev.button !== 0) return;
  ev.preventDefault();
  S.endedId = -1;
  beginStroke(ev);
});
canvas.addEventListener('pointermove', (ev) => {
  if (!S || S.closed) return;
  if (!S.drawing) {
    // A finger that came down in the short tap block after a screen change
    // and is still held: it starts painting from here once the block is over.
    const held = ev.pointerType === 'touch' ? true : (ev.buttons & 1) === 1;
    if (!held || inputBlocked() || S.endedId === ev.pointerId) return;
    ev.preventDefault();
    beginStroke(ev);
    return;
  }
  if (ev.pointerId !== S.pointerId) return;
  ev.preventDefault();
  const list = typeof ev.getCoalescedEvents === 'function' ? ev.getCoalescedEvents() : null;
  if (list && list.length > 1) for (const e of list) strokeTo(e);
  else strokeTo(ev);
});
function endStroke(ev) {
  if (!S || !S.drawing || (ev && ev.pointerId !== S.pointerId)) return;
  S.drawing = false;
  // a stroke that was ended by a rotation does not start again under the same finger
  S.endedId = ev ? -1 : S.pointerId;
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
  S.dirty = true;
  S.cells = cells;
  let n = 0;
  for (let i = 0; i < cells.length; i++) if (cells[i] !== 0) n++;
  S.filled = n;
  analyse();
}
onPress($('toolUndo'), () => {
  if (!S || S.undo.length === 0) return;
  const cells = S.undo.pop();
  S.dirty = S.undo.length > 0;
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
    const card = el('button', { class: 'card', type: 'button', id: 'pick' + grid.childElementCount }, [
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
  const s = S;
  // "Ende" screens (Ring drawing, solo enemy): the second tap ends the whole
  // game or run, and the button says exactly that. Elsewhere only the
  // drawing is lost, and only unsaved strokes are asked about.
  const ask = s.backConfirm || s.dirty;
  if (ask && performance.now() - backArmed > 2500) {
    backArmed = performance.now();
    s.askingBack = true;
    $('drawBack').textContent = s.backConfirm ? s.endAsk : 'Verwerfen?';
    updatePanel();
    setTimeout(() => {
      if (S !== s) return;
      s.askingBack = false;
      $('drawBack').textContent = s.backLabel;
      updatePanel();
    }, 2500);
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
// When the window changes (a phone is rotated) the canvas moves under the
// finger: the running stroke ends there instead of jumping across the sheet.
window.addEventListener('resize', () => {
  if (!S) return;
  const p = canvasPlace();
  if (S.drawing && (p[0] !== S.place[0] || p[1] !== S.place[1])) endStroke(null);
  layout();
});

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
      if (m === 0 || m === 5) continue;
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
      } else if (m === 5) {
        // pocket: a faint ring of ink on the empty paper
        g.globalAlpha = 0.28;
        g.strokeStyle = col.ink;
        g.lineWidth = Math.max(1, c * 0.1);
        g.beginPath();
        g.arc((x + 0.5) * c, (y + 0.5) * c, c * 0.2, 0, 6.2832);
        g.stroke();
        g.strokeStyle = col.paperLight;
        g.lineWidth = Math.max(1, c * 0.16);
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
//   backConfirm (the back button ends a game: endAsk, endMsg), canPick, lockNote, extra(container) -> onStats callback }
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
      outside: false, dirty: false, askingBack: false, place: [0, 0], endedId: -1, bladeMarks: 0, pocketMarks: 0,
      endAsk: opts.endAsk || 'Spiel beenden?', endMsg: opts.endMsg || 'Noch einmal tippen, dann endet das Spiel.',
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
    $('drawMsg').classList.toggle('quiet', !!(S.onStats && S.onStats.setMsg));
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
