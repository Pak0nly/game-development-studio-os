// Inkweight browser prototype: start screen, navigation, gallery, sound switch.

import * as core from '../core/index.js';
import { tuning, W, H } from './tuning.js';
import { $, el, showScreen, currentScreen, colours, reducedMotion, fitCanvas, inputBlocked, num } from './ui.js';
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
window.__inkDebug.inputBlocked = inputBlocked;

// ---- lost taps
// Chromium sometimes sends no click for a tap on a button that follows quick
// strokes on the canvas (seen in the automated phone run: the touch arrives,
// the click does not). If a finger went down and up on the same button and no
// click came, the button is activated here; a late real click is swallowed.
{
  let downBtn = null;
  const nativeAt = new WeakMap(); // button -> time of its last real click
  // Taps that were activated here. Their real click can still arrive late
  // (also after the next tap was handled), so every one is remembered for a
  // moment: by its button and by its spot, because a tap that closed a layer
  // would otherwise click whatever lies under the same spot.
  const healed = [];
  const buttonOf = (t) => (t && t.closest ? t.closest('button') : null);
  document.addEventListener('pointerdown', (ev) => { downBtn = ev.pointerType === 'touch' ? buttonOf(ev.target) : null; }, true);
  document.addEventListener('click', (ev) => {
    if (!ev.isTrusted) return;
    const b = buttonOf(ev.target);
    const now = performance.now();
    while (healed.length > 0 && now - healed[0].at > 700) healed.shift();
    for (let i = 0; i < healed.length; i++) {
      const h = healed[i];
      if (b === h.btn || (Math.abs(ev.clientX - h.x) < 14 && Math.abs(ev.clientY - h.y) < 14)) {
        healed.splice(i, 1);
        ev.stopImmediatePropagation();
        ev.preventDefault();
        return;
      }
    }
    if (b) nativeAt.set(b, now);
  }, true);
  document.addEventListener('pointerup', (ev) => {
    const b = downBtn;
    downBtn = null;
    if (ev.pointerType !== 'touch' || !b) return;
    const r = b.getBoundingClientRect();
    if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) return;
    const t = performance.now();
    const ux = ev.clientX;
    const uy = ev.clientY;
    setTimeout(() => {
      if ((nativeAt.get(b) || 0) >= t) return;
      if (b.disabled || !b.isConnected || b.hidden || b.offsetParent === null) return;
      healed.push({ btn: b, at: performance.now(), x: ux, y: uy });
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
let doodleRun = 0;
function home() {
  const best = bestScore();
  $('startBest').hidden = best <= 0;
  $('startBest').textContent = 'Bester Solo-Lauf: ' + best + ' Tinte.';
  showScreen('scrStart');
  startDoodle();
}

function startDoodle() {
  const cv = $('startDoodle');
  // The player's newest gallery figures hop here; built-in scribbles only
  // fill the gaps and are then named as placeholders.
  const own = [];
  for (const it of galleryAll()) {
    if (own.length >= 4) break;
    if (it.kind !== 'figure') continue;
    const cells = decode(it.data);
    if (core.computeStats(cells, W, H, tuning, 'figure', W * H).valid) own.push(cells);
  }
  const key = own.map((c) => c.join('')).join('|');
  if (!doodle || doodle.key !== key) {
    const fill = [0, 4, 1, 5].map((k) => SCRIBBLE_FIGURES[k].cells);
    const list = own.concat(fill.slice(0, 4 - own.length));
    doodle = list.map((cells, i) => {
      const fig = figureOf(cells);
      return { fig, sprite: makeSprite(fig, 6), phase: i * 1.3, rate: 3 + 20 / (10 + fig.stats.N / 6) };
    });
    doodle.key = key;
  }
  const noteEl = $('startDoodleNote');
  noteEl.hidden = own.length >= 4;
  noteEl.textContent = own.length === 0 ? 'Platzhalter-Kritzeleien. Zeichne selbst, dann hüpfen hier deine Figuren.'
    : 'Links deine Figuren, rechts noch Platzhalter.';
  doodleRun++;
  const myRun = doodleRun;
  const draw = (now) => {
    if (currentScreen() !== 'scrStart' || myRun !== doodleRun) return;
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
        const scale = Math.min(cv.height / 34, cv.width / 110, cv.height * 0.42 / (d.fig.radius + 1));
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

// ---- rules panel (start screen and drawing screen)
{
  const ts = tuning.stats;
  const te = tuning.element;
  const pctText = (v) => num(v * 100, 1).replace(',0', '');
  const topSpeed = (n) => num(ts.speedBase / (1 + n / ts.speedWeightRef), 0);
  $('rulesWeight').textContent = 'Jedes Kästchen Tinte wiegt 1. Schwer schiebt hart, ist aber träge. Eine geschlossene Hülle mit dicker Wand schiebt bis zu '
    + pctText(ts.pushPerPocket) + ' % härter, als sie wiegt: je Hohlraum-Kästchen (Kringel) +' + num(ts.pushPerPocket, 1) + '. Ein Kringel ist ein eingeschlossenes leeres Kästchen, das keine Tinte berührt.';
  $('rulesArmour').textContent = 'So viel hältst du aus: ' + ts.armourBase + ' als Grundwert, jedes Kästchen +' + num(ts.armourPerCell, 1)
    + ', jedes ringsum eingeschlossene Kern-Kästchen noch +' + ts.armourPerCore + '. Eine geschlossene Hülle mit dicker Wand bekommt +' + num(ts.armourPerPocket, 1)
    + ' je Hohlraum-Kästchen (Kringel), höchstens so viele, wie sie Kästchen hat, die keine Klinge sind.';
  $('rulesSharp').textContent = 'Ein Kästchen ist Klinge, wenn es in keinem vollen 2 × 2-Block liegt, also auch schräge Striche. Mehr Klingen und ein höherer Klingen-Anteil heben die Schärfe. '
    + 'Eine stumpfe Berührung macht ' + num(ts.bluntDamage, 1) + ' Schaden. Ein Schnitt macht so viel wie die Schärfe, mindestens aber ' + num(ts.bluntDamage, 1) + ', und nimmt dazu ' + pctText(ts.sharpArmourCut) + ' % vom vollen Panzer des Getroffenen.';
  $('rulesSpeed').textContent = 'Nur die Tintenmenge zählt: ' + tuning.ink.minBodyCells + ' Kästchen laufen ' + topSpeed(tuning.ink.minBodyCells)
    + ' Kästchen pro Sekunde, ' + tuning.ink.figureBudget + ' nur noch ' + topSpeed(tuning.ink.figureBudget) + '.';
  const circle = $('rulesCircle');
  const ELEMENT = ['', '', 'Glut', 'Flut', 'Moos'];
  let c = 2;
  for (let i = 0; i < 4; i++) {
    circle.append(el('b', { class: 'e' + c, text: ELEMENT[c] }));
    if (i < 3) circle.append(document.createTextNode(' schlägt '));
    c = te.beats[c];
  }
  $('rulesElement').textContent = 'Ein Element hat eine Figur ab ' + te.minColouredPercent + ' % bunter Tinte; es zählt die häufigste Farbe (Gleichstand: kein Element). Treffer gegen das unterlegene Element: Schaden ×'
    + num(te.strongMult, 1) + ', gegen das überlegene: ×' + num(te.weakMult, 2) + '. Schwarz ist neutral.';
  $('rulesFight').textContent = 'Jede Berührung kostet beide etwas Panzer. Scharf ist ein Treffer nur, wenn eine Klinge selbst den Gegner berührt. Ein Sprint, der eine Figur trifft, gibt ihr seinen Schwung mit (Rums!). '
    + 'Im Ring verliert, wer hinausfliegt oder keinen Panzer mehr hat.';
  const layer = $('rulesLayer');
  const open = () => { sfx('click'); layer.hidden = false; layer.scrollTop = 0; $('rulesClose').focus({ preventScroll: true }); };
  $('btnRules').addEventListener('click', open);
  $('drawRules').addEventListener('click', open);
  $('rulesClose').addEventListener('click', () => { sfx('click'); layer.hidden = true; });
}

// ---- gallery
function statText(cells, kind) {
  const st = core.computeStats(cells, W, H, tuning, kind, W * H);
  return 'Gewicht ' + st.N + ' · Panzer ' + Math.round(st.armour) + ' · Schärfe ' + num(st.sharpness, 1);
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
