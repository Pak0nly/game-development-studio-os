// Small DOM helpers shared by all screens.

export const $ = (id) => document.getElementById(id);

export function el(tag, props, children) {
  const n = document.createElement(tag);
  if (props) {
    for (const k of Object.keys(props)) {
      if (k === 'class') n.className = props[k];
      else if (k === 'text') n.textContent = props[k];
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), props[k]);
      else n.setAttribute(k, props[k]);
    }
  }
  if (children) for (const c of children) if (c) n.append(c);
  return n;
}

const SCREENS = ['scrStart', 'scrRingSetup', 'scrPass', 'scrDraw', 'scrFight', 'scrSoloIntro', 'scrShop', 'scrGallery'];
let current = 'scrStart';
const leaveHooks = {};

export function onLeave(id, fn) { leaveHooks[id] = fn; }
export function currentScreen() { return current; }
// After every screen change taps are ignored for a short moment, so the
// second tap of a quick double tap never acts on the screen that just opened
// (it used to open the template picker or start the drawing clock).
const TAP_BLOCK_MS = 350;
let blockUntil = 0;
export function inputBlocked() { return performance.now() < blockUntil; }
{
  let swallowClickUntil = 0; // the click that belongs to a swallowed touch-down
  const guard = (ev) => {
    const now = performance.now();
    if (now >= blockUntil && !(ev.type === 'click' && now < swallowClickUntil)) return;
    if (ev.type === 'pointerdown') swallowClickUntil = now + 700;
    else if (ev.type === 'click') swallowClickUntil = 0;
    ev.stopImmediatePropagation();
    if (ev.type === 'click') ev.preventDefault();
  };
  for (const type of ['pointerdown', 'mousedown', 'touchstart', 'click']) document.addEventListener(type, guard, true);
}

// German number text: decimal comma.
export function num(value, digits) { return value.toFixed(digits || 0).replace('.', ','); }

export function showScreen(id) {
  if (current !== id) blockUntil = performance.now() + TAP_BLOCK_MS;
  if (current !== id && leaveHooks[current]) leaveHooks[current]();
  for (const s of SCREENS) $(s).hidden = s !== id;
  current = id;
  $(id).scrollTop = 0;
}

const motionQuery = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
export function reducedMotion() { return !!(motionQuery && motionQuery.matches); }

// Colour tokens are defined once in the stylesheet; canvases read them here.
let tokens = null;
export function colours() {
  if (tokens) return tokens;
  const cs = getComputedStyle(document.documentElement);
  const g = (n) => cs.getPropertyValue(n).trim();
  tokens = {
    paper: g('--paper'), paperLight: g('--paper-light'), paperDeep: g('--paper-deep'),
    speck: g('--paper-speck'), rule: g('--rule-line'),
    ink: g('--ink'), inkSoft: g('--ink-soft'), inkFaint: g('--ink-faint'),
    ember: g('--ember'), tide: g('--tide'), moss: g('--moss'), onInk: g('--on-ink'),
  };
  tokens.cell = [null, tokens.ink, tokens.ember, tokens.tide, tokens.moss];
  return tokens;
}

// Index 0 is "no element"; index 1 is the black ink, called Schwarz everywhere.
export const ELEMENT_NAMES = ['Neutral', 'Schwarz', 'Glut', 'Flut', 'Moos'];

// A button that needs a second tap within a short time ("Sicher?").
export function twoTap(button, action, askText) {
  let armed = false;
  let timer = 0;
  let label = '';
  button.addEventListener('click', () => {
    if (armed) {
      clearTimeout(timer);
      armed = false;
      button.textContent = label;
      action();
      return;
    }
    armed = true;
    label = button.textContent;
    button.textContent = askText || 'Sicher?';
    timer = setTimeout(() => { armed = false; button.textContent = label; }, 2500);
  });
}

// Small deterministic hash for jitter (visual only, not the core generator).
export function hash3(a, b, c) {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(c | 0, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

export function fitCanvas(canvas, cssW, cssH) {
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(cssW * dpr));
  const h = Math.max(1, Math.round(cssH * dpr));
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  return dpr;
}

// A plain notice screen with one main button ("hand the device over", ...).
// Resolves with 'go' or 'back'.
export function passScreen(title, text, goLabel, extraNodes, backLabel) {
  return new Promise((resolve) => {
    $('passTitle').textContent = title;
    $('passText').textContent = text || '';
    const extra = $('passExtra');
    extra.textContent = '';
    if (extraNodes) for (const n of extraNodes) if (n) extra.append(n);
    const go = $('passGo');
    const back = $('passBack');
    go.textContent = goLabel || 'Weiter';
    back.textContent = backLabel || 'Zum Menü';
    showScreen('scrPass');
    go.onclick = () => { go.onclick = null; back.onclick = null; resolve('go'); };
    back.onclick = () => { go.onclick = null; back.onclick = null; resolve('back'); };
  });
}

export function coarsePointer() {
  try { return matchMedia('(pointer: coarse)').matches; } catch (e) { return false; }
}

// Tool buttons react on touch-down already (snappier, and a tap that follows
// a stroke within a few milliseconds is not lost); keyboard still uses click.
export function onPress(button, fn) {
  let pressedAt = -1000;
  button.addEventListener('pointerdown', (ev) => {
    if (button.disabled || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
    pressedAt = performance.now();
    fn(ev);
  });
  button.addEventListener('click', (ev) => {
    if (performance.now() - pressedAt < 700) return;
    fn(ev);
  });
}
