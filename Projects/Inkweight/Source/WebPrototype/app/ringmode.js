// Mode B, the Ring: seats, drawing in turns, rounds, first to three wins,
// catch-up ink and the result screens.

import * as core from '../core/index.js';
import { tuning, W, H } from './tuning.js';
import { $, el, showScreen, passScreen, coarsePointer, num } from './ui.js';
import { sfx } from './audio.js';
import { openDraw } from './drawscreen.js';
import { runFight, fightOverlay, clearHud } from './fight.js';
import { thumbCanvas } from './sprites.js';
import { galleryAll, galleryAdd, decode } from './gallery.js';
import { SCRIBBLE_FIGURES } from './scribbles.js';
import { KEY_ZONES, gamepadCount } from './input.js';
import { pickBotDrawing, pickBotDrawings, sameCells } from './botpick.js';

const SEAT_DEFAULTS = ['human', 'bot', 'bot', 'none'];
let goHome = () => {};

function seatTypes() {
  const types = [];
  for (let i = 0; i < 4; i++) types.push($('seat' + (i + 1) + 'Type').value);
  return types;
}

function refreshSetup() {
  const types = seatTypes();
  const humans = types.filter((t) => t === 'human').length;
  const active = types.filter((t) => t !== 'none').length;
  let h = 0;
  for (let i = 0; i < 4; i++) {
    const keys = $('seat' + (i + 1) + 'Keys');
    if (types[i] === 'human') {
      if (humans === 1) keys.textContent = coarsePointer() ? 'Finger: ziehen lenkt, Knopf sprintet' : 'W A S D oder Pfeiltasten, Sprint: Leertaste';
      else keys.textContent = (h < KEY_ZONES.length ? KEY_ZONES[h].label : '') + (h === 0 ? ' · oder Finger' : '') + ' · Gamepad ' + (h + 1);
      h++;
    } else if (types[i] === 'bot') keys.textContent = 'zeichnet nicht selbst, nimmt eine fertige Figur';
    else keys.textContent = 'Platz bleibt leer';
  }
  let note = '';
  if (active < 2) note = 'Es braucht mindestens 2 Figuren.';
  else if (humans === 0) note = 'Nur Bots: du schaust zu.';
  else if (humans > 1) note = 'Gezeichnet wird reihum auf diesem Gerät. Gespielt wird mit Tastatur' + (gamepadCount() > 0 ? ' oder Gamepad' : '') + '; den Finger hat nur der erste Mensch.';
  $('ringSetupNote').textContent = note;
  $('ringGo').disabled = active < 2;
}

export function initRing(home) {
  goHome = home;
  const list = $('seatList');
  for (let i = 0; i < 4; i++) {
    const id = 'seat' + (i + 1) + 'Type';
    const sel = el('select', { id, 'aria-label': 'Platz ' + (i + 1) }, [
      el('option', { value: 'human', text: 'Mensch' }),
      el('option', { value: 'bot', text: 'Bot' }),
      i >= 2 ? el('option', { value: 'none', text: 'leer' }) : null,
    ]);
    sel.value = SEAT_DEFAULTS[i];
    sel.addEventListener('change', refreshSetup);
    list.append(el('div', { class: 'seat' }, [
      el('span', { class: 'tag', text: String(i + 1) }),
      el('span', { class: 'seat-name' }, [
        document.createTextNode('Platz ' + (i + 1)),
        el('span', { class: 'seat-keys', id: 'seat' + (i + 1) + 'Keys' }),
      ]),
      sel,
    ]));
  }
  $('ringTime').value = String(tuning.ring.drawTimeSeconds);
  if ($('ringTime').value === '') $('ringTime').value = '30';
  $('ringSetupBack').addEventListener('click', () => home());
  $('ringGo').addEventListener('click', () => {
    const seats = seatTypes().filter((t) => t !== 'none').map((t) => ({ human: t === 'human' }));
    if (seats.length < 2) return;
    sfx('click');
    playRing(seats, parseInt($('ringTime').value, 10) || 0);
  });
}

export function openRingSetup() {
  refreshSetup();
  showScreen('scrRingSetup');
}

function randomInt(n) { return Math.floor(Math.random() * n); }

function botPool() {
  const own = [];
  for (const it of galleryAll()) {
    if (it.kind !== 'figure') continue;
    const cells = decode(it.data);
    const st = core.computeStats(cells, W, H, tuning, 'figure', tuning.ink.figureBudget);
    if (st.valid && !own.some((o) => sameCells(o.cells, cells))) own.push({ cells, source: 'gallery', weight: st.N });
  }
  const built = SCRIBBLE_FIGURES.map((s) => ({ cells: s.cells, source: 'placeholder', name: s.name,
    weight: core.computeStats(s.cells, W, H, tuning, 'figure', tuning.ink.figureBudget).N }));
  return { own, built };
}

function statLine(st) {
  return 'Gewicht ' + st.N + ' · Panzer ' + Math.round(st.armour) + ' · Schärfe ' + num(st.sharpness, 1);
}

async function playRing(seats, drawTime) {
  const n = seats.length;
  const humans = [];
  const humanIndex = [];
  for (let s = 0; s < n; s++) { humanIndex.push(seats[s].human ? humans.length : -1); if (seats[s].human) humans.push(s); }
  const name = (s) => (seats[s].human ? (humans.length === 1 ? 'Du' : 'Spieler ' + (s + 1)) : 'Bot ' + (s + 1));
  const match = core.ringCreateMatch(tuning, n, (Date.now() ^ (randomInt(1 << 30))) >>> 0);
  const drawings = new Array(n).fill(null);
  const source = new Array(n).fill('own');
  const pool = botPool();
  // Bot figures: see botpick.js (a single human never meets two heavy ones;
  // a fair placeholder line-up while the gallery is small).
  const loneHuman = humans.length === 1;
  const picked = pickBotDrawings(pool, n - humans.length, loneHuman);
  const used = picked.used;
  {
    let k = 0;
    for (let s = 0; s < n; s++) {
      if (seats[s].human) continue;
      const d = picked.order[k++];
      drawings[s] = d.cells;
      source[s] = d.source;
    }
  }
  window.__inkDebug.ringBotPicks = drawings.filter((d) => d).map((d) => d.join(''));
  // two bot styles, mixed: one storms straight in, the next one circles first
  const STYLE_NAMES = ['stürmt drauflos', 'kreist und stößt zu'];
  {
    let k = randomInt(2);
    for (let s = 0; s < n; s++) if (!seats[s].human) match.botStyle[s] = (k++) % 2;
  }
  window.__inkDebug.ringBotStyles = match.botStyle.slice();
  const touchPlay = coarsePointer();

  while (match.phase !== 'matchOver') {
    // drawing, one human after the other
    for (const s of humans) {
      const budget = core.ringInkBudget(tuning, match, s);
      const bonus = budget - tuning.ink.figureBudget;
      if (humans.length > 1) {
        const r = await passScreen(name(s) + ' zeichnet', 'Gib das Gerät weiter. Alle anderen schauen weg.', 'Ich bin ' + name(s));
        if (r === 'back') { goHome(); return; }
      }
      const res = await openDraw({
        title: (humans.length === 1 ? 'Zeichne deine Figur' : name(s) + ': zeichne deine Figur'),
        sub: 'Runde ' + (match.round + 1) + ' · ' + budget + ' Tinte' + (bonus > 0 ? ' (Aufholtinte +' + bonus + ')' : '')
          + (drawTime > 0 ? ' · Uhr startet beim ersten Strich' : ''),
        kind: 'figure', budget, timeLimit: drawTime, initial: source[s] === 'own' ? drawings[s] : null,
        backLabel: 'Ende', backConfirm: true, endAsk: 'Spiel beenden?', endMsg: 'Noch einmal tippen, dann endet das ganze Spiel.', doneLabel: 'Fertig, in den Ring',
      });
      if (!res) { goHome(); return; }
      if (res.cells) {
        drawings[s] = res.cells;
        source[s] = 'own';
        galleryAdd(res.cells, 'figure');
      } else {
        const d = pool.built[randomInt(pool.built.length)];
        drawings[s] = d.cells;
        source[s] = 'placeholder';
        const r = await passScreen('Zeit um!', name(s) + ' hatte noch keine fertige Figur (mindestens ' + tuning.ink.minBodyCells
          + ' Kästchen am Stück). Diese Runde springt der Platzhalter „' + d.name + '“ ein.', 'Na gut');
        if (r === 'back') { goHome(); return; }
      }
    }

    // a bot never shows up with the very drawing a human has just made
    const humanDrawings = humans.map((s) => drawings[s]);
    for (let s = 0; s < n; s++) {
      if (seats[s].human || !humanDrawings.some((h) => sameCells(h, drawings[s]))) continue;
      // the replaced figure no longer counts as handed out
      const gone = used.findIndex((u) => u.cells === drawings[s]);
      if (gone !== -1) used.splice(gone, 1);
      const d = pickBotDrawing(pool, used, humanDrawings, loneHuman);
      drawings[s] = d.cells;
      source[s] = d.source;
    }
    window.__inkDebug.ringDrawings = drawings.map((cells, s) => ({ human: seats[s].human, data: cells.join('') }));

    const build = (s) => core.buildFigure(drawings[s], W, H, tuning, 'figure', core.ringInkBudget(tuning, match, s));
    const figures = drawings.map((cells, s) => build(s));
    // The core refuses a figure that is too small or over the seat's ink
    // (ringCheckFigure). That cannot happen through the drawing screen; if it
    // ever does, a placeholder steps in instead of a crash.
    for (let s = 0; s < n; s++) {
      if (core.ringCheckFigure(tuning, match, s, figures[s]) === '') continue;
      const d = pool.built[randomInt(pool.built.length)];
      drawings[s] = d.cells;
      source[s] = 'placeholder';
      figures[s] = build(s);
    }
    const cards = figures.map((fig, s) => el('div', { class: 'card' }, [
      thumbCanvas(drawings[s], 64),
      el('span', { class: 'card-name' }, [el('span', { class: 'tag' + (seats[s].human ? ' human' : ''), text: String(s + 1) }), document.createTextNode(' ' + name(s))]),
      source[s] === 'placeholder' ? el('span', { class: 'badge', text: 'Platzhalter' }) : (seats[s].human ? null : el('span', { class: 'badge', text: 'aus der Galerie' })),
      el('span', { text: statLine(fig.stats) }),
      seats[s].human ? null : el('span', { class: 'fine', text: STYLE_NAMES[match.botStyle[s]] }),
    ]));
    clearHud();
    const go = await fightOverlay('Runde ' + (match.round + 1), [
      el('div', { class: 'lineup' }, cards),
      el('p', { class: 'fine', text: 'Schubs die anderen aus dem Ring oder schneide ihren Panzer weg. Ein Sprint, der trifft, rammt. Der Ring wird kleiner.' }),
    ], 'In den Ring!', 'Zum Menü');
    if (go !== 'primary') { goHome(); return; }

    core.ringStartRound(tuning, match, figures);
    const hud = makeHud(match, seats, name);
    const result = await runFight({
      mode: 'ring',
      viewRadius: tuning.ring.startRadius[n] + 3,
      startRadius: tuning.ring.startRadius[n],
      ringRadius: () => match.ringRadius,
      sudden: () => match.tick > tuning.ring.suddenDeathTick,
      world: () => match.world,
      events: () => match.world.events,
      humans: humans.length,
      step: (humanFn) => {
        const inputs = [];
        // measurement only (build/ring_fairness.cjs): a scripted player may steer the human seats
        const pilot = window.__inkDebug.ringPilot;
        for (let s = 0; s < n; s++) inputs.push(seats[s].human ? (pilot ? pilot(match, s) : humanFn(humanIndex[s])) : null);
        core.ringStep(tuning, match, core.ringBotInputs(tuning, match, inputs));
      },
      isOver: () => match.phase !== 'fight',
      bodyInfo: (i) => ({ tag: String(i + 1), human: seats[i].human, bar: true }),
      hud,
      dashBody: () => (humans.length > 0 ? match.world.bodies[humans[0]] : null),
      controlHint: humans.length === 0 ? 'Zuschauen' : (touchPlay ? 'Ziehen lenkt · Knopf sprintet' : (humans.length === 1 ? 'W A S D oder Pfeile · Leertaste sprintet' : 'Jeder in seiner Tastenzone')),
    });
    if (result === 'quit') { goHome(); return; }

    // why did who lose?
    const w = match.roundWinner;
    const over = match.phase === 'matchOver';
    const order = [];
    for (let s = 0; s < n; s++) if (s !== w) order.push(s);
    order.sort((a, b) => match.outTick[a] - match.outTick[b]);
    const lines = order.map((s) => el('p', {}, [
      el('b', { text: name(s) + ': ' }),
      document.createTextNode(match.outReason[s] === 'armour' ? 'Panzer zerbrochen' : 'aus dem Ring geflogen'),
    ]));
    if (match.outReason[w] !== '') lines.push(el('p', { class: 'fine', text: 'Alle gleichzeitig raus: wer näher an der Mitte war, gewinnt.' }));
    const score = el('p', { class: 'score-big', text: match.wins.join(' : ') });
    const names = el('p', { class: 'fine', text: seats.map((x, s) => name(s)).join(' : ') + ' · wer zuerst ' + tuning.ring.winsToTakeMatch + ' hat, gewinnt' });
    const humanWon = seats[w].human;
    sfx(humanWon || humans.length === 0 ? 'win' : 'lose');
    if (!over) {
      const pct = tuning.ring.catchUpPercentPerLostRound;
      const r = await fightOverlay('Runde ' + match.round + ' geht an ' + (name(w) === 'Du' ? 'dich' : name(w)), [
        ...lines, score, names,
        el('p', { class: 'fine', text: 'Wer verloren hat, bekommt ' + pct + ' % mehr Tinte für die nächste Zeichnung.' }),
      ], humans.length > 0 ? 'Nächste Runde zeichnen' : 'Nächste Runde', 'Zum Menü');
      if (r !== 'primary') { goHome(); return; }
    } else {
      const r = await fightOverlay(name(w) + (name(w) === 'Du' ? ' gewinnst das Spiel!' : ' gewinnt das Spiel!'), [
        el('div', { class: 'lineup' }, [el('div', { class: 'card' }, [thumbCanvas(drawings[w], 64), el('span', { class: 'card-name', text: name(w) })])]),
        ...lines, score, names,
      ], 'Nochmal', 'Zum Menü');
      if (r === 'primary') { playRing(seats, drawTime); return; }
      goHome();
      return;
    }
  }
}

function makeHud(match, seats, name) {
  let built = false;
  const bars = [];
  const chips = [];
  const pipEls = [];
  let line = null;
  const r = tuning.ring;
  const T = tuning.physics.tickRate;
  return (root) => {
    if (!built || root.firstChild === null) {
      built = true;
      root.textContent = '';
      for (let s = 0; s < seats.length; s++) {
        const bar = el('i');
        const pipEl = el('span', { class: 'pips' });
        const chip = el('div', { class: 'chip' }, [
          el('span', { class: 'tag' + (seats[s].human ? ' human' : ''), text: String(s + 1) }),
          el('span', { class: 'chip-body' }, [
            el('span', { class: 'chip-name' }, [document.createTextNode(name(s) + ' '), pipEl]),
            el('span', { class: 'hpbar' }, [bar]),
          ]),
        ]);
        bars.push(bar); chips.push(chip); pipEls.push(pipEl);
        root.append(chip);
      }
      line = el('div', { class: 'hud-line' });
      root.append(line);
    }
    const bodies = match.world.bodies;
    for (let s = 0; s < seats.length; s++) {
      const b = bodies[s];
      bars[s].style.width = Math.max(0, b.hp / b.maxHp * 100).toFixed(0) + '%';
      chips[s].classList.toggle('out', !b.alive);
      // win dots follow the score, also after the deciding round
      const pips = '●'.repeat(match.wins[s]) + '○'.repeat(Math.max(0, r.winsToTakeMatch - match.wins[s]));
      if (pipEls[s].textContent !== pips) pipEls[s].textContent = pips;
    }
    let text;
    if (match.tick < r.shrinkStartTick) text = 'Ring schrumpft in ' + Math.ceil((r.shrinkStartTick - match.tick) / T) + ' s';
    else if (match.tick < r.shrinkEndTick) text = 'Der Ring schrumpft';
    else if (match.tick <= r.suddenDeathTick) text = 'Enger Ring · Schluss in ' + Math.ceil((r.suddenDeathTick - match.tick) / T) + ' s';
    else text = 'Der Ring verschwindet!';
    if (line.textContent !== text) line.textContent = text;
  };
}
