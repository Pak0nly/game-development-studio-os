// The fight view shared by the Ring and the Solo Arena: fixed-timestep loop
// around the core, camera, figure rendering with squash and hop, ink
// splashes, mild screen shake, HUD refresh, touch stick and dash button.

import { tuning } from './tuning.js';
import { $, el, showScreen, onLeave, colours, hash3, reducedMotion, fitCanvas } from './ui.js';
import { sfx } from './audio.js';
import { spriteFor, drawSprite, wobbleFrame } from './sprites.js';
import { touch, STICK_RADIUS, humanInput, setInputActive, endTick } from './input.js';

const canvas = $('fightCanvas');
const stage = $('fightStage');
const TICK = tuning.physics.tickRate;

let F = null; // running fight
let raf = 0;
let stains = null; // offscreen canvas with ink that stays on the paper

// Debug hook used by the automated runs: window.__inkDebug.speed = 8 plays
// eight ticks per normal tick. Players never see it.
function speed() {
  const d = window.__inkDebug;
  return d && d.speed > 0 ? d.speed : 1;
}

// World to screen: screen = (cam.cx + x * cam.s, cam.cy + y * cam.s).
// The Ring always shows the whole ring. The Solo Arena zooms in on small
// screens (at least cfg.minCellPx CSS pixels per cell) and follows the hero.
const STAIN_PX = 5; // stain layer resolution, pixels per cell
function camera() {
  const f = F;
  const w = canvas.width;
  const h = canvas.height;
  const R = f.cfg.viewRadius;
  let s = Math.min(w, h) / (2 * R);
  const min = (f.cfg.minCellPx || 0) * f.dpr;
  let fx = 0;
  let fy = 0;
  if (s < min) {
    s = min;
    const b = f.cfg.follow ? f.cfg.follow() : null;
    if (b) {
      if (!f.camInit) { f.camInit = true; f.camX = b.x; f.camY = b.y; }
      // only as far as needed: the view never looks past the arena edge
      const mx = Math.max(0, R - w / (2 * s));
      const my = Math.max(0, R - h / (2 * s));
      fx = Math.max(-mx, Math.min(mx, f.camX));
      fy = Math.max(-my, Math.min(my, f.camY));
    }
  }
  return { w, h, cx: w / 2 - fx * s, cy: h / 2 - fy * s, s };
}

function layout() {
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  F.dpr = fitCanvas(canvas, w, h);
  const size = Math.ceil(F.cfg.viewRadius * 2 * STAIN_PX);
  if (!stains || stains.width !== size) {
    stains = document.createElement('canvas');
    stains.width = size;
    stains.height = size;
  }
}
if (typeof ResizeObserver === 'function') new ResizeObserver(() => { if (F) layout(); }).observe(stage);

// ---- touch stick and dash button
canvas.addEventListener('pointerdown', (ev) => {
  if (!F || touch.on) return;
  ev.preventDefault();
  try { canvas.setPointerCapture(ev.pointerId); } catch (e) { /* optional */ }
  touch.on = true; touch.id = ev.pointerId;
  touch.ox = touch.x = ev.clientX; touch.oy = touch.y = ev.clientY;
  touch.mx = 0; touch.my = 0;
});
canvas.addEventListener('pointermove', (ev) => {
  if (!touch.on || ev.pointerId !== touch.id) return;
  ev.preventDefault();
  touch.x = ev.clientX; touch.y = ev.clientY;
  let dx = (touch.x - touch.ox) / STICK_RADIUS;
  let dy = (touch.y - touch.oy) / STICK_RADIUS;
  const l = Math.sqrt(dx * dx + dy * dy);
  if (l > 1) {
    dx /= l; dy /= l;
    // the anchor follows the finger so a long drag can be reversed quickly
    touch.ox = touch.x - dx * STICK_RADIUS;
    touch.oy = touch.y - dy * STICK_RADIUS;
  }
  if (l < 0.12) { dx = 0; dy = 0; }
  touch.mx = dx; touch.my = dy;
});
function stickEnd(ev) {
  if (ev.pointerId !== touch.id) return;
  touch.on = false; touch.mx = 0; touch.my = 0;
}
canvas.addEventListener('pointerup', stickEnd);
canvas.addEventListener('pointercancel', stickEnd);
canvas.addEventListener('contextmenu', (ev) => ev.preventDefault());

const dashBtn = $('dashBtn');
dashBtn.addEventListener('pointerdown', (ev) => { ev.preventDefault(); touch.dash = true; touch.latch = 10; });
const dashUp = () => { touch.dash = false; };
dashBtn.addEventListener('pointerup', dashUp);
dashBtn.addEventListener('pointercancel', dashUp);
dashBtn.addEventListener('pointerleave', dashUp);
dashBtn.addEventListener('contextmenu', (ev) => ev.preventDefault());

let quitArmed = 0;
$('fightQuit').addEventListener('click', () => {
  if (!F) { if (quitHandler) quitHandler(); return; }
  if (performance.now() - quitArmed > 2500) {
    quitArmed = performance.now();
    $('fightQuit').textContent = 'Sicher?';
    setTimeout(() => { $('fightQuit').textContent = 'Ende'; }, 2500);
    return;
  }
  stop('quit');
});
let quitHandler = null;

// ---- effects
function dominantColour(fig, salt) {
  if (fig.count === 0) return 1;
  return fig.colour[Math.floor(hash3(salt, fig.count, 7) * fig.count)];
}

function splash(x, y, colour, count, power, dirX, dirY) {
  const f = F;
  for (let i = 0; i < count; i++) {
    const a = Math.random() * 6.2832;
    const sp = (0.3 + Math.random()) * power;
    f.parts.push({
      x, y,
      vx: Math.cos(a) * sp + (dirX || 0) * power * 0.8,
      vy: Math.sin(a) * sp + (dirY || 0) * power * 0.8,
      r: 0.25 + Math.random() * 0.45, life: 0.35 + Math.random() * 0.35, age: 0, colour,
    });
  }
  if (f.parts.length > 260) f.parts.splice(0, f.parts.length - 260);
}

function stain(x, y, colour, size) {
  if (!stains) return;
  const R = F.cfg.viewRadius;
  const cam = { cx: R * STAIN_PX, cy: R * STAIN_PX, s: STAIN_PX };
  const g = stains.getContext('2d');
  g.fillStyle = colours().cell[colour];
  g.globalAlpha = 0.16;
  const n = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    const ox = (Math.random() - 0.5) * size * 2.4;
    const oy = (Math.random() - 0.5) * size * 2.4;
    g.beginPath();
    g.arc(cam.cx + (x + ox) * cam.s, cam.cy + (y + oy) * cam.s, (0.3 + Math.random() * 0.7) * size * cam.s, 0, 6.2832);
    g.fill();
  }
  g.globalAlpha = 1;
}

function floatText(x, y, text, big, colour) {
  if (!big) {
    // small numbers do not pile up on one spot
    for (const o of F.floats) if (o.age < 0.3 && Math.abs(o.x - x) < 4 && Math.abs(o.y - y) < 4) return;
  }
  F.floats.push({ x, y, text, big, colour: colour || 0, age: 0 });
  if (F.floats.length > 24) F.floats.shift();
}

function shake(amount) {
  if (reducedMotion()) return;
  F.shake = Math.min(5, F.shake + amount);
}

function fmtDamage(d) { return d >= 10 ? d.toFixed(0) : d.toFixed(1); }

function handleEvents(events) {
  const f = F;
  const bodies = f.cfg.world().bodies;
  for (let e = 0; e < events.length; e++) {
    const ev = events[e];
    if (ev.type === 'hit') {
      const a = bodies[ev.from];
      const b = bodies[ev.to];
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      dx /= d; dy /= d;
      const reach = Math.min(b.fig.radius * 0.8, d * 0.5);
      const px = b.x + dx * reach;
      const py = b.y + dy * reach;
      const colour = dominantColour(b.fig, f.tick + e);
      splash(px, py, colour, Math.min(14, 3 + Math.round(ev.damage * 2.2)), ev.sharp ? 16 : 9, -dx, -dy);
      if (ev.damage >= 1.5 || Math.random() < 0.3) stain(px, py, colour, 0.6 + Math.min(1.6, ev.damage * 0.25));
      if (ev.damage >= 0.6) floatText(px, py - 1, fmtDamage(ev.damage), ev.sharp, colour);
      f.vis[ev.to].squash = Math.min(0.3, 0.1 + ev.damage * 0.04);
      shake(ev.sharp ? Math.min(3, ev.damage * 0.5) : 0.5);
      sfx(ev.sharp ? 'sharp' : 'hit', ev.sharp ? ev.damage / 3 : 1);
    } else if (ev.type === 'out') {
      const b = bodies[ev.seat];
      f.vis[ev.seat].deadAt = f.time;
      f.vis[ev.seat].reason = ev.reason;
      splash(b.x, b.y, dominantColour(b.fig, 1), 22, 20, 0, 0);
      stain(b.x, b.y, dominantColour(b.fig, 2), 2.4);
      shake(4);
      sfx('out');
    } else if (ev.type === 'shotHit') {
      const b = bodies[ev.to];
      const colour = dominantColour(b.fig, f.tick + e);
      splash(b.x, b.y, colour, 5, 10, 0, 0);
      floatText(b.x, b.y - 1, fmtDamage(ev.damage), true, colour);
      f.vis[ev.to].squash = 0.2;
      sfx('shot');
    } else if (ev.type === 'enemyDown') {
      const b = bodies[ev.index];
      f.vis[ev.index].deadAt = f.time;
      splash(b.x, b.y, dominantColour(b.fig, 3), 14, 15, 0, 0);
      stain(b.x, b.y, dominantColour(b.fig, 4), 1.8);
      shake(1.5);
      sfx('down');
    } else if (ev.type === 'pickup') {
      const h = bodies[0];
      floatText(h.x, h.y - h.fig.radius - 1, '+' + ev.value, false, 0);
      sfx('pickup');
    } else if (ev.type === 'throw') {
      sfx('throw');
    }
    if (f.cfg.onEvent) f.cfg.onEvent(ev);
  }
}

// ---- drawing
function wobblyCircle(g, cam, r, t, salt) {
  const still = reducedMotion();
  const fr = still ? 0 : Math.floor(t * 6);
  const n = 72;
  g.beginPath();
  for (let i = 0; i <= n; i++) {
    const k = i % n;
    const a = k / n * 6.2832;
    const rr = r + (hash3(k, fr, salt) - 0.5) * 0.5;
    const x = cam.cx + Math.cos(a) * rr * cam.s;
    const y = cam.cy + Math.sin(a) * rr * cam.s;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.closePath();
}

function render(t) {
  const f = F;
  const cfg = f.cfg;
  const col = colours();
  const g = canvas.getContext('2d');
  const cam = camera();
  const world = cfg.world();
  const bodies = world.bodies;
  const still = reducedMotion();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, cam.w, cam.h);
  if (f.shake > 0.05 && !still) {
    g.translate((Math.random() - 0.5) * f.shake * f.dpr, (Math.random() - 0.5) * f.shake * f.dpr);
  }

  // the sheet
  const R = cfg.ringRadius();
  if (cfg.mode === 'ring') {
    // where the ring started, as a faint pencil line
    g.strokeStyle = col.inkFaint;
    g.globalAlpha = 0.5;
    g.lineWidth = Math.max(1, cam.s * 0.15);
    g.setLineDash([cam.s * 1.2, cam.s * 1.2]);
    g.beginPath();
    g.arc(cam.cx, cam.cy, cfg.startRadius * cam.s, 0, 6.2832);
    g.stroke();
    g.setLineDash([]);
    g.globalAlpha = 1;
  }
  wobblyCircle(g, cam, R, t, 11);
  g.fillStyle = col.paperLight;
  g.fill();
  const danger = cfg.mode === 'ring' && cfg.sudden && cfg.sudden();
  g.strokeStyle = danger ? col.ember : col.ink;
  g.lineWidth = Math.max(2, cam.s * (cfg.mode === 'ring' ? 0.45 : 0.7));
  g.lineJoin = 'round';
  g.stroke();
  // squared paper inside the sheet
  g.save();
  g.beginPath();
  g.arc(cam.cx, cam.cy, Math.max(0, R - 0.3) * cam.s, 0, 6.2832);
  g.clip();
  g.strokeStyle = col.rule;
  g.globalAlpha = 0.3;
  g.lineWidth = 1;
  g.beginPath();
  const step = 8 * cam.s;
  for (let x = cam.cx % step; x < cam.w; x += step) { g.moveTo(x, 0); g.lineTo(x, cam.h); }
  for (let y = cam.cy % step; y < cam.h; y += step) { g.moveTo(0, y); g.lineTo(cam.w, y); }
  g.stroke();
  g.globalAlpha = 1;
  if (stains) { const sr = cfg.viewRadius * cam.s; g.drawImage(stains, cam.cx - sr, cam.cy - sr, sr * 2, sr * 2); }
  g.restore();

  if (cfg.extraDraw) cfg.extraDraw(g, cam, t, 'under');

  // shadows
  g.fillStyle = col.ink;
  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    const v = f.vis[i];
    if (!b.alive) continue;
    const sr = Math.sqrt(b.fig.count) * 0.5 + 0.8;
    g.globalAlpha = 0.1;
    g.beginPath();
    g.ellipse(cam.cx + (b.x + 0.4 + v.lift * 0.6) * cam.s, cam.cy + (b.y + 0.7 + v.lift * 1.3) * cam.s,
      sr * cam.s, sr * 0.9 * cam.s, 0, 0, 6.2832);
    g.fill();
  }
  g.globalAlpha = 1;

  // figures
  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    const v = f.vis[i];
    let alpha = 1;
    let grow = 1;
    if (!b.alive) {
      if (v.deadAt < 0) continue;
      const age = (f.time - v.deadAt) / 0.5;
      if (age >= 1) continue;
      alpha = 1 - age;
      grow = v.reason === 'ring' ? 1 - age * 0.7 : 1 + age * 0.25;
    }
    const sprite = spriteFor(b.fig);
    const fr = wobbleFrame(t, i * 0.37);
    const sq = still ? 0 : v.squash * Math.cos(v.squashPhase) + v.hopSquash;
    const sx = (1 + sq) * (1 + v.lift * 0.05) * grow;
    const sy = (1 - sq) * (1 + v.lift * 0.05) * grow;
    const px = cam.cx + b.x * cam.s;
    const py = cam.cy + (b.y - v.lift * 0.5) * cam.s;
    if (b.alive && b.dashTicks > 0 && !still) {
      g.globalAlpha = 0.22;
      drawSprite(g, sprite, fr, px - b.vx * 0.05 * cam.s, py - b.vy * 0.05 * cam.s, b.fx, b.fy, cam.s, sx, sy);
      g.globalAlpha = 0.4;
      drawSprite(g, sprite, fr, px - b.vx * 0.025 * cam.s, py - b.vy * 0.025 * cam.s, b.fx, b.fy, cam.s, sx, sy);
    }
    g.globalAlpha = alpha;
    drawSprite(g, sprite, fr, px, py, b.fx, b.fy, cam.s, sx, sy);
    g.globalAlpha = 1;
  }

  // armour bar with the seat tag at its left end, just below the figure
  const fontPx = Math.round(11 * f.dpr);
  g.font = '700 ' + fontPx + 'px ' + f.font;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    if (!b.alive) continue;
    const info = cfg.bodyInfo ? cfg.bodyInfo(i) : null;
    const px = cam.cx + b.x * cam.s;
    const showBar = info ? info.bar : b.hp < b.maxHp;
    const below = Math.min(b.fig.radius, Math.sqrt(b.fig.count) * 0.75 + 2);
    const by = cam.cy + (b.y + below + 0.8) * cam.s;
    const bw = Math.max(26 * f.dpr, Math.min(b.fig.radius * 1.6, 9) * cam.s);
    const bh = 4 * f.dpr;
    if (showBar) {
      g.fillStyle = col.paperLight;
      g.fillRect(px - bw / 2, by, bw, bh);
      g.fillStyle = b.hp / b.maxHp < 0.3 ? col.ember : col.ink;
      g.fillRect(px - bw / 2, by, bw * Math.max(0, b.hp / b.maxHp), bh);
      g.strokeStyle = col.ink;
      g.lineWidth = Math.max(1, f.dpr);
      g.strokeRect(px - bw / 2, by, bw, bh);
    }
    if (info && info.tag) {
      const tr = 8 * f.dpr;
      const tx = px - bw / 2 - tr - 2 * f.dpr;
      const ty = by + bh / 2;
      g.beginPath();
      g.arc(tx, ty, tr, 0, 6.2832);
      g.fillStyle = info.human ? col.ink : col.paperLight;
      g.fill();
      g.strokeStyle = col.ink;
      g.lineWidth = 1.5 * f.dpr;
      g.stroke();
      g.fillStyle = info.human ? col.onInk : col.ink;
      g.fillText(info.tag, tx, ty + f.dpr);
    }
  }

  if (cfg.extraDraw) cfg.extraDraw(g, cam, t, 'over');

  // splashes
  for (let i = 0; i < f.parts.length; i++) {
    const p = f.parts[i];
    g.globalAlpha = Math.max(0, 1 - p.age / p.life);
    g.fillStyle = col.cell[p.colour];
    g.beginPath();
    g.arc(cam.cx + p.x * cam.s, cam.cy + p.y * cam.s, p.r * cam.s, 0, 6.2832);
    g.fill();
  }
  // damage numbers
  for (let i = 0; i < f.floats.length; i++) {
    const fl = f.floats[i];
    const k = fl.age / 0.8;
    const size = Math.round((fl.big ? 17 : 12) * f.dpr);
    g.font = '700 ' + size + 'px ' + f.font;
    g.globalAlpha = Math.max(0, 1 - k * k);
    const x = cam.cx + fl.x * cam.s;
    const y = cam.cy + (fl.y - k * 3) * cam.s;
    g.lineWidth = 3 * f.dpr;
    g.strokeStyle = col.paperLight;
    g.strokeText(fl.text, x, y);
    g.fillStyle = fl.colour ? col.cell[fl.colour] : col.ink;
    g.fillText(fl.text, x, y);
  }
  g.globalAlpha = 1;

  // small arrows at the edge for enemies outside the view
  if (cfg.follow) {
    g.fillStyle = col.ink;
    const pad = 10 * f.dpr;
    for (let i = 1; i < bodies.length; i++) {
      const b = bodies[i];
      if (!b.alive) continue;
      const x = cam.cx + b.x * cam.s;
      const y = cam.cy + b.y * cam.s;
      if (x >= 0 && x <= cam.w && y >= 0 && y <= cam.h) continue;
      const ex = Math.max(pad, Math.min(cam.w - pad, x));
      const ey = Math.max(pad, Math.min(cam.h - pad, y));
      const a = Math.atan2(y - ey, x - ex);
      g.globalAlpha = 0.7;
      g.beginPath();
      g.moveTo(ex + Math.cos(a) * pad * 0.8, ey + Math.sin(a) * pad * 0.8);
      g.lineTo(ex + Math.cos(a + 2.5) * pad * 0.8, ey + Math.sin(a + 2.5) * pad * 0.8);
      g.lineTo(ex + Math.cos(a - 2.5) * pad * 0.8, ey + Math.sin(a - 2.5) * pad * 0.8);
      g.closePath();
      g.fill();
    }
    g.globalAlpha = 1;
  }

  // touch stick
  if (touch.on) {
    const r = canvas.getBoundingClientRect();
    const k = canvas.width / r.width;
    const ox = (touch.ox - r.left) * k;
    const oy = (touch.oy - r.top) * k;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.strokeStyle = col.ink;
    g.globalAlpha = 0.35;
    g.lineWidth = 2 * f.dpr;
    g.beginPath();
    g.arc(ox, oy, STICK_RADIUS * k, 0, 6.2832);
    g.stroke();
    g.fillStyle = col.ink;
    g.beginPath();
    g.arc(ox + touch.mx * STICK_RADIUS * k, oy + touch.my * STICK_RADIUS * k, 16 * k, 0, 6.2832);
    g.fill();
    g.globalAlpha = 1;
  }
}

function advanceVisuals(dt) {
  const f = F;
  const fb = f.cfg.follow ? f.cfg.follow() : null;
  if (fb && f.camInit) {
    const k = reducedMotion() ? 1 : 1 - Math.pow(0.002, dt);
    f.camX += (fb.x - f.camX) * k;
    f.camY += (fb.y - f.camY) * k;
  }
  const bodies = f.cfg.world().bodies;
  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    const v = f.vis[i];
    const sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
    const m = Math.min(1, sp / 6);
    v.hop += dt * (5 + sp * 0.35);
    const s = Math.abs(Math.sin(v.hop));
    v.lift = s * m * 0.9;
    v.hopSquash = (0.5 - s) * 0.09 * m;
    if (v.squash > 0.002) { v.squash *= Math.pow(0.004, dt); v.squashPhase += dt * 34; } else v.squash = 0;
  }
  for (let i = f.parts.length - 1; i >= 0; i--) {
    const p = f.parts[i];
    p.age += dt;
    if (p.age >= p.life) { f.parts.splice(i, 1); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.vx *= Math.pow(0.02, dt); p.vy *= Math.pow(0.02, dt);
  }
  for (let i = f.floats.length - 1; i >= 0; i--) {
    f.floats[i].age += dt;
    if (f.floats[i].age >= 0.8) f.floats.splice(i, 1);
  }
  f.shake *= Math.pow(0.001, dt);
}

function setBanner(text, sub) {
  const b = $('fightBanner');
  if (!text) { b.hidden = true; return; }
  b.hidden = false;
  b.textContent = text;
  if (sub) b.append(el('small', { text: sub }));
}

function frame(now) {
  if (!F) return;
  raf = requestAnimationFrame(frame);
  const f = F;
  const cfg = f.cfg;
  let dt = (now - f.last) / 1000;
  f.last = now;
  if (dt > 0.1) dt = 0.1;
  if (dt < 0) dt = 0;
  const sp = speed();
  f.time += dt;
  const t = now / 1000;

  if (f.phase === 'count') {
    f.count -= dt * sp / 0.55;
    const n = Math.ceil(f.count);
    if (n !== f.countShown) {
      f.countShown = n;
      if (n > 0) { setBanner(String(n), f.controlHint); sfx('count'); }
      else { setBanner('Los!'); sfx('go'); f.phase = 'run'; f.bannerUntil = f.time + 0.5; }
    }
  } else if (f.phase === 'run') {
    if (f.bannerUntil && f.time > f.bannerUntil) { setBanner(''); f.bannerUntil = 0; }
    f.acc += dt * TICK * sp;
    let steps = 0;
    const max = 6 * sp;
    while (f.acc >= 1 && steps < max && !cfg.isOver()) {
      f.acc -= 1;
      steps++;
      cfg.step((h) => humanInput(h, cfg.humans));
      endTick();
      f.tick++;
      const bodies = cfg.world().bodies;
      for (let i = 0; i < bodies.length; i++) {
        if (bodies[i].alive && bodies[i].dashTicks === tuning.physics.dashTicks - 1) sfx('dash');
      }
      handleEvents(cfg.events());
    }
    if (f.acc > 4) f.acc = 0;
    if (cfg.isOver()) { f.phase = 'end'; f.endAt = f.time + 0.9 / sp; }
    const hb = cfg.dashBody ? cfg.dashBody() : null;
    dashBtn.classList.toggle('cool', !!(hb && hb.dashCd > 0));
  } else if (f.phase === 'end') {
    if (f.time >= f.endAt) { render(t); stop('over'); return; }
  }
  advanceVisuals(dt);
  if (++f.hudCount % 6 === 0 && cfg.hud) cfg.hud($('fightHud'));
  render(t);
}

function stop(result) {
  const f = F;
  if (!f) return;
  F = null;
  cancelAnimationFrame(raf);
  setInputActive(false);
  setBanner('');
  dashBtn.hidden = true;
  if (f.cfg.hud) f.cfg.hud($('fightHud'));
  f.resolve(result);
}

onLeave('scrFight', () => { if (F) stop('quit'); $('fightOverlay').hidden = true; quitHandler = null; });

// cfg: { mode: 'ring' | 'solo', viewRadius, startRadius, ringRadius(), sudden(),
//   world(), events(), step(humanFn), isOver(), humans, bodyInfo(i), hud(el),
//   extraDraw(g, cam, t, layer), onEvent(ev), dashBody(), controlHint }
// Resolves with 'over' or 'quit'.
export function runFight(cfg) {
  if (F) stop('quit');
  return new Promise((resolve) => {
    showScreen('scrFight');
    $('fightOverlay').hidden = true;
    const n = cfg.world().bodies.length;
    const vis = [];
    for (let i = 0; i < n; i++) vis.push({ hop: i * 1.7, lift: 0, hopSquash: 0, squash: 0, squashPhase: 0, deadAt: -1, reason: '' });
    F = {
      cfg, resolve, vis, parts: [], floats: [], shake: 0,
      phase: 'count', count: 3, countShown: 4, bannerUntil: 0,
      camInit: false, camX: 0, camY: 0,
      acc: 0, tick: 0, time: 0, last: performance.now(), endAt: 0, hudCount: 0, dpr: 1,
      controlHint: cfg.controlHint || '',
      font: getComputedStyle(document.body).fontFamily,
    };
    dashBtn.hidden = false;
    layout();
    if (stains) stains.getContext('2d').clearRect(0, 0, stains.width, stains.height);
    setInputActive(true);
    if (cfg.hud) cfg.hud($('fightHud'));
    raf = requestAnimationFrame(frame);
  });
}

// A panel over the field: line-up before a fight, results after it.
// Resolves with 'primary', 'secondary' or 'quit'.
export function fightOverlay(title, bodyNodes, primaryText, secondaryText) {
  return new Promise((resolve) => {
    showScreen('scrFight');
    dashBtn.hidden = true;
    $('ovTitle').textContent = title;
    const body = $('ovBody');
    body.textContent = '';
    for (const n of bodyNodes) if (n) body.append(n);
    const p = $('ovPrimary');
    const s = $('ovSecondary');
    p.textContent = primaryText;
    s.textContent = secondaryText || '';
    s.hidden = !secondaryText;
    $('fightOverlay').hidden = false;
    $('fightOverlay').scrollTop = 0;
    const done = (r) => {
      p.onclick = null; s.onclick = null; quitHandler = null;
      $('fightOverlay').hidden = true;
      sfx('click');
      resolve(r);
    };
    // a key or finger still held from the fight must not skip the panel
    const shownAt = performance.now();
    p.onclick = () => { if (performance.now() - shownAt > 450) done('primary'); };
    s.onclick = () => { if (performance.now() - shownAt > 450) done('secondary'); };
    quitHandler = () => done('quit');
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  });
}

export function clearHud() { $('fightHud').textContent = ''; }
