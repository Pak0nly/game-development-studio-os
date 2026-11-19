// Steering: keyboard zones, gamepads where the browser offers them, and touch
// (drag anywhere on the field to steer, a button to dash).

export const KEY_ZONES = [
  { up: 'KeyW', left: 'KeyA', down: 'KeyS', right: 'KeyD', dash: ['Space', 'KeyF'], label: 'W A S D, Sprint: Leertaste' },
  { up: 'ArrowUp', left: 'ArrowLeft', down: 'ArrowDown', right: 'ArrowRight', dash: ['Enter', 'ShiftRight'], label: 'Pfeiltasten, Sprint: Enter' },
  { up: 'KeyI', left: 'KeyJ', down: 'KeyK', right: 'KeyL', dash: ['KeyO', 'KeyU'], label: 'I J K L, Sprint: O' },
  { up: 'Numpad8', left: 'Numpad4', down: 'Numpad5', right: 'Numpad6', dash: ['Numpad0', 'NumpadAdd'], label: 'Ziffernblock 8 4 5 6, Sprint: 0' },
];

const keys = new Set();
let active = false; // only swallow game keys while a fight is running
const GAME_KEYS = new Set();
for (const z of KEY_ZONES) { GAME_KEYS.add(z.up); GAME_KEYS.add(z.left); GAME_KEYS.add(z.down); GAME_KEYS.add(z.right); for (const d of z.dash) GAME_KEYS.add(d); }

window.addEventListener('keydown', (ev) => {
  keys.add(ev.code);
  if (active && GAME_KEYS.has(ev.code)) {
    const t = ev.target;
    const onButton = t && t.tagName === 'BUTTON' && (ev.code === 'Enter' || ev.code === 'Space');
    if (!onButton) ev.preventDefault();
  }
});
window.addEventListener('keyup', (ev) => { keys.delete(ev.code); });
window.addEventListener('blur', () => { keys.clear(); });

export function setInputActive(v) { active = v; if (!v) { touch.on = false; touch.dash = false; touch.latch = 0; } }

// Touch / mouse drag state, written by the fight view.
export const touch = { on: false, id: -1, ox: 0, oy: 0, x: 0, y: 0, mx: 0, my: 0, dash: false, latch: 0 };
export const STICK_RADIUS = 46; // CSS pixels for full speed

function zoneInput(z, out) {
  if (keys.has(z.left)) out.mx -= 1;
  if (keys.has(z.right)) out.mx += 1;
  if (keys.has(z.up)) out.my -= 1;
  if (keys.has(z.down)) out.my += 1;
  for (const d of z.dash) if (keys.has(d)) out.dash = true;
}

function padInput(index, out) {
  let pads = null;
  try { pads = navigator.getGamepads ? navigator.getGamepads() : null; } catch (e) { pads = null; }
  if (!pads) return;
  let n = 0;
  for (let i = 0; i < pads.length; i++) {
    const p = pads[i];
    if (!p || !p.connected) continue;
    if (n++ !== index) continue;
    const ax = p.axes[0] || 0;
    const ay = p.axes[1] || 0;
    if (ax * ax + ay * ay > 0.06) { out.mx += ax; out.my += ay; }
    const b = p.buttons;
    if (b[14] && b[14].pressed) out.mx -= 1;
    if (b[15] && b[15].pressed) out.mx += 1;
    if (b[12] && b[12].pressed) out.my -= 1;
    if (b[13] && b[13].pressed) out.my += 1;
    for (const k of [0, 1, 2, 5, 7]) if (b[k] && b[k].pressed) out.dash = true;
    return;
  }
}

export function gamepadCount() {
  try {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let n = 0;
    for (let i = 0; i < pads.length; i++) if (pads[i] && pads[i].connected) n++;
    return n;
  } catch (e) { return 0; }
}

// Input of the h-th human (0-based) out of `humans` humans in this fight.
// A single human may use WASD or the arrow keys; touch belongs to human 0.
export function humanInput(h, humans) {
  const out = { mx: 0, my: 0, dash: false };
  if (humans <= 1) { zoneInput(KEY_ZONES[0], out); zoneInput(KEY_ZONES[1], out); }
  else if (h < KEY_ZONES.length) zoneInput(KEY_ZONES[h], out);
  padInput(h, out);
  if (h === 0) {
    if (touch.on) { out.mx += touch.mx; out.my += touch.my; }
    if (touch.dash || touch.latch > 0) out.dash = true;
  }
  return out;
}

export function endTick() { if (touch.latch > 0) touch.latch--; }
