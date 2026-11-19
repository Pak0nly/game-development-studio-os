// Inkweight browser prototype: start screen, navigation, gallery, sound switch.

import * as core from '../core/index.js';
import { tuning, W, H } from './tuning.js';
import { $, el, showScreen, currentScreen, colours, reducedMotion, fitCanvas } from './ui.js';
import { setSound, soundIsOn, onSoundChange, sfx } from './audio.js';
import { openDraw } from './drawscreen.js';
import { initRing, openRingSetup } from './ringmode.js';
import { initSolo, openSoloIntro } from './solomode.js';
import { galleryAll, galleryAdd, galleryRemove, galleryClear, decode, storageOk, bestScore } from './gallery.js';
import { SCRIBBLE_FIGURES, SCRIBBLE_WEAPONS } from './scribbles.js';
import { thumbCanvas, figureOf, makeSprite, drawSprite, wobbleFrame } from './sprites.js';

if (!window.__inkDebug) window.__inkDebug = { speed: 1 };
window.__inkDebug.core = core;
window.__inkDebug.tuning = tuning;

// ---- lost taps
// Chromium sometimes sends no click for a tap on a button that follows quick
// strokes on the canvas (seen in the automated phone run: the touch arrives,
// the click does not). If a finger went down and up on the same button and no
// click came, the button is activated here; a late real click is swallowed.
{
  let downBtn = null;
  let nativeBtn = null;
  let nativeAt = 0;
  let healed = null;
  let healedAt = 0;
  const buttonOf = (t) => (t && t.closest ? t.closest('button') : null);
  document.addEventListener('pointerdown', (ev) => { downBtn = ev.pointerType === 'touch' ? buttonOf(ev.target) : null; }, true);
  document.addEventListener('click', (ev) => {
    if (!ev.isTrusted) return;
    const b = buttonOf(ev.target);
    if (b && b === healed && performance.now() - healedAt < 600) { ev.stopImmediatePropagation(); ev.preventDefault(); return; }
    nativeBtn = b;
    nativeAt = performance.now();
  }, true);
  document.addEventListener('pointerup', (ev) => {
    const b = downBtn;
    downBtn = null;
    if (ev.pointerType !== 'touch' || !b) return;
    const r = b.getBoundingClientRect();
    if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) return;
    const t = performance.now();
    setTimeout(() => {
      if (nativeBtn === b && nativeAt >= t) return;
      if (b.disabled || !b.isConnected || b.hidden || b.offsetParent === null) return;
      healed = b;
      healedAt = performance.now();
      b.click();
    }, 90);
  }, true);
}

// ---- sound switch (several buttons, one state)
const sndButtons = Array.from(document.querySelectorAll('.snd'));
function paintSound(on) {
  for (const b of sndButtons) {
    b.textContent = on ? 'Ton aus' : 'Ton an';
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
}
onSoundChange(paintSound);
for (const b of sndButtons) b.addEventListener('click', () => setSound(!soundIsOn()));
paintSound(false);

// ---- start screen
let doodle = null;
function home() {
  const best = bestScore();
  $('startBest').hidden = best <= 0;
  $('startBest').textContent = 'Bester Solo-Lauf: ' + best + ' Tinte.';
  showScreen('scrStart');
  startDoodle();
}

function startDoodle() {
  const cv = $('startDoodle');
  if (!doodle) {
    doodle = [0, 4, 1, 5].map((k, i) => {
      const fig = figureOf(SCRIBBLE_FIGURES[k].cells);
      return { fig, sprite: makeSprite(fig, 6), phase: i * 1.3, rate: 3 + 20 / (10 + fig.stats.N / 6) };
    });
  }
  const draw = (now) => {
    if (currentScreen() !== 'scrStart') return;
    const t = now / 1000;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    if (w > 0) {
      const dpr = fitCanvas(cv, w, h);
      const g = cv.getContext('2d');
      g.clearRect(0, 0, cv.width, cv.height);
      const col = colours();
      const still = reducedMotion();
      doodle.forEach((d, i) => {
        const x = cv.width * (0.14 + i * 0.24);
        const hop = still ? 0 : Math.abs(Math.sin(t * d.rate + d.phase));
        const land = still ? 0 : Math.max(0, 1 - hop * 4);
        const scale = Math.min(cv.height / 34, cv.width / 110);
        g.globalAlpha = 0.15;
        g.fillStyle = col.ink;
        g.beginPath();
        g.ellipse(x, cv.height * 0.93, d.fig.radius * scale * (0.9 - hop * 0.2), 3 * dpr, 0, 0, 6.2832);
        g.fill();
        g.globalAlpha = 1;
        drawSprite(g, d.sprite, wobbleFrame(t, i * 0.4), x, cv.height * 0.6 - hop * cv.height * 0.14, 0, -1, scale, 1 + land * 0.12, 1 - land * 0.12);
      });
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}

$('btnRing').addEventListener('click', () => { sfx('click'); openRingSetup(); });
$('btnSolo').addEventListener('click', () => { sfx('click'); openSoloIntro(); });
$('btnGallery').addEventListener('click', () => { sfx('click'); openGallery(); });
$('btnFree').addEventListener('click', async () => {
  sfx('click');
  const res = await openDraw({
    title: 'Frei zeichnen', sub: tuning.ink.figureBudget + ' Tinte · schau zu, wie sich die Werte ändern',
    kind: 'figure', canPick: true, doneLabel: 'In die Galerie legen',
  });
  if (res) { galleryAdd(res.cells, 'figure'); openGallery(); } else home();
});

// ---- gallery
function statText(cells, kind) {
  const st = core.computeStats(cells, W, H, tuning, kind, W * H);
  return 'Gewicht ' + st.N + ' · Panzer ' + Math.round(st.armour) + ' · Schärfe ' + st.sharpness.toFixed(1);
}

function openGallery() {
  const grid = $('galGrid');
  grid.textContent = '';
  const list = galleryAll();
  if (list.length === 0) grid.append(el('p', { class: 'empty-note', text: 'Noch leer. Alles, was du zeichnest, landet hier.' }));
  list.forEach((it, i) => {
    const cells = decode(it.data);
    const del = el('button', { class: 'btn small', type: 'button', id: 'galDel' + i, text: 'Löschen' });
    let armed = 0;
    del.addEventListener('click', () => {
      if (performance.now() - armed > 2500) { armed = performance.now(); del.textContent = 'Sicher?'; setTimeout(() => { del.textContent = 'Löschen'; }, 2500); return; }
      galleryRemove(it.id);
      openGallery();
    });
    grid.append(el('div', { class: 'card' }, [
      thumbCanvas(cells, 80),
      el('span', { class: 'card-name', text: it.kind === 'weapon' ? 'Wurfwaffe' : 'Figur' }),
      el('span', { text: statText(cells, it.kind) }),
      del,
    ]));
  });
  const built = $('galBuiltin');
  built.textContent = '';
  for (const s of SCRIBBLE_FIGURES.concat(SCRIBBLE_WEAPONS)) {
    built.append(el('div', { class: 'card' }, [
      thumbCanvas(s.cells, 80),
      el('span', { class: 'card-name', text: s.name }),
      el('span', { class: 'badge', text: 'Platzhalter' }),
    ]));
  }
  const ok = storageOk();
  $('galNote').hidden = ok;
  $('galNote').textContent = ok ? '' : 'Dieser Browser erlaubt hier kein Speichern. Die Galerie hält nur, bis du die Seite schließt.';
  showScreen('scrGallery');
}
$('galBack').addEventListener('click', home);
{
  const b = $('galClear');
  let armed = 0;
  b.addEventListener('click', () => {
    if (performance.now() - armed > 2500) { armed = performance.now(); b.textContent = 'Wirklich alle?'; setTimeout(() => { b.textContent = 'Alle löschen'; }, 2500); return; }
    galleryClear();
    b.textContent = 'Alle löschen';
    openGallery();
  });
}

initRing(home);
initSolo(home);
home();
