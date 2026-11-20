// Synthesizer sounds made by code (Web Audio). Nothing is loaded or recorded.
// Sound starts only after the player taps a "Ton an" button.

let ctx = null;
let master = null;
let noise = null;
let on = false;
const last = {};
const listeners = [];

export function soundIsOn() { return on; }
export function onSoundChange(fn) { listeners.push(fn); }

export function setSound(want) {
  if (want && !ctx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.5;
        master.connect(ctx.destination);
        const len = Math.floor(ctx.sampleRate * 0.5);
        noise = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = noise.getChannelData(0);
        let s = 12345;
        for (let i = 0; i < len; i++) { s = (Math.imul(s, 1103515245) + 12345) | 0; d[i] = ((s >>> 8) & 0xffff) / 32768 - 1; }
      }
    } catch (e) { ctx = null; }
  }
  on = !!(want && ctx);
  if (ctx) {
    try { if (on) ctx.resume(); } catch (e) { /* optional */ }
    if (master) master.gain.value = on ? 0.5 : 0;
  }
  for (const fn of listeners) fn(on);
  if (on) sfx('click');
  return on;
}

function tone(type, f0, f1, dur, vol, delay) {
  const t = ctx.currentTime + (delay || 0);
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master);
  o.start(t); o.stop(t + dur + 0.02);
}

function hiss(f0, f1, q, dur, vol, delay) {
  const t = ctx.currentTime + (delay || 0);
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f); f.connect(g); g.connect(master);
  src.start(t); src.stop(t + dur + 0.02);
}

const GAP = { ram: 0.08, pen: 0.035, erase: 0.05, hit: 0.05, sharp: 0.05, pickup: 0.04, shot: 0.05, throw: 0.08 };

export function sfx(name, amount) {
  if (!on || !ctx) return;
  try {
    const now = ctx.currentTime;
    const gap = GAP[name] || 0;
    if (gap && last[name] && now - last[name] < gap) return;
    last[name] = now;
    const a = amount === undefined ? 1 : Math.max(0.3, Math.min(1.6, amount));
    switch (name) {
      case 'pen': hiss(2600 + 900 * ((now * 37) % 1), 1900, 1.2, 0.045, 0.12); break;
      case 'erase': hiss(900, 600, 0.8, 0.06, 0.1); break;
      case 'click': tone('triangle', 620, 420, 0.06, 0.2); break;
      case 'deny': tone('square', 160, 120, 0.12, 0.12); break;
      case 'hit': tone('sine', 190 * a, 60, 0.14, 0.45); hiss(500, 200, 0.7, 0.08, 0.15); break;
      case 'sharp': tone('sawtooth', 1100, 320, 0.09, 0.16 * a); hiss(5200, 3000, 2, 0.07, 0.2); break;
      case 'dash': hiss(350, 2400, 1.1, 0.2, 0.25); break;
      case 'ram': tone('sine', 120, 45, 0.22, 0.5); tone('square', 90, 50, 0.1, 0.12); hiss(260, 120, 0.6, 0.14, 0.3); break;
      case 'out': tone('sine', 420, 70, 0.5, 0.4); hiss(900, 200, 0.6, 0.35, 0.2, 0.05); break;
      case 'down': tone('triangle', 300, 110, 0.16, 0.3); hiss(1500, 500, 0.8, 0.12, 0.18); break;
      case 'throw': hiss(3000, 1200, 1.5, 0.06, 0.08); break;
      case 'shot': tone('square', 700, 380, 0.05, 0.1); break;
      case 'pickup': tone('sine', 880, 1320, 0.08, 0.2); break;
      case 'tick': tone('square', 1000, 1000, 0.03, 0.1); break;
      case 'count': tone('triangle', 440, 440, 0.12, 0.3); break;
      case 'go': tone('triangle', 880, 880, 0.25, 0.35); break;
      case 'win': [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f, f, 0.18, 0.3, i * 0.11)); break;
      case 'lose': [392, 330, 262].forEach((f, i) => tone('triangle', f, f * 0.97, 0.22, 0.28, i * 0.15)); break;
      case 'buy': tone('triangle', 660, 990, 0.12, 0.3); tone('triangle', 990, 1320, 0.14, 0.25, 0.1); break;
      default: break;
    }
  } catch (e) { /* sound is optional */ }
}
