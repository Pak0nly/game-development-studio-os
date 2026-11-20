// Mode A, the Solo Arena: hero and thrown weapon, one enemy drawing and a
// stake per wave, ink drops, one upgrade between waves, five waves and a boss.

import * as core from '../core/index.js';
import { tuning, W, H } from './tuning.js';
import { $, el, onPress, showScreen, colours, coarsePointer, ELEMENT_NAMES, reducedMotion, num } from './ui.js';
import { sfx } from './audio.js';
import { openDraw } from './drawscreen.js';
import { runFight, fightOverlay, clearHud } from './fight.js';
import { thumbCanvas, spriteFor, drawSprite, wobbleFrame } from './sprites.js';
import { galleryAdd, bestScore, saveBestScore } from './gallery.js';

let goHome = () => {};
const so = tuning.solo;

export function initSolo(home) {
  goHome = home;
  $('soloIntroBack').addEventListener('click', () => home());
  for (let c = 2; c <= 4; c++) $('soloC' + c).addEventListener('click', () => { sfx('click'); playSolo(c); });
}

export function openSoloIntro() {
  const best = bestScore();
  $('soloBest').textContent = best > 0 ? 'Dein bester Lauf auf diesem Gerät: ' + best + ' Tinte.' : '';
  showScreen('scrSoloIntro');
}

function stakeLabel(i) {
  const v = so.stakes[i];
  return '×' + String(v).replace('.', ',');
}

// One touch of a wave copy of this drawing against the hero, as the core
// computes it (physics.js touchDamage, solo.js spawnEnemy): blunt and, for a
// touch with a blade, sharp. stats: the stats of the enemy drawing.
function soloTouch(run, stats, scale, stakeIndex) {
  const ts = tuning.stats;
  const crush = core.soloEnemyCrush(tuning, { stats }, scale, stakeIndex);
  const factor = so.enemyDamageMult * so.stakeDamageMult[stakeIndex]
    * core.elementMultiplier(tuning, stats.element, run.heroFig.stats.element);
  const blunt = ts.bluntDamage + crush;
  const sharp = stats.S > 0 ? (stats.sharpness > blunt ? stats.sharpness : blunt) + ts.sharpArmourCut * run.heroMaxHp : blunt;
  return { crush, blunt: blunt * factor, sharp: sharp * factor };
}

async function playSolo(startColour) {
  const allowed = [false, true, startColour === 2, startColour === 3, startColour === 4];
  const lock = 'Du hast Schwarz und ' + ELEMENT_NAMES[startColour] + '. Weitere Farben gibt es später als Upgrade.';
  const hero = await openDraw({
    title: 'Zeichne deinen Helden', sub: tuning.ink.figureBudget + ' Tinte · oben ist vorne',
    kind: 'figure', budget: tuning.ink.figureBudget, allowed, canPick: true, lockNote: lock, doneLabel: 'Weiter zur Waffe',
  });
  if (!hero) { openSoloIntro(); return; }
  const weapon = await openDraw({
    title: 'Zeichne die Wurfwaffe', sub: tuning.ink.weaponBudget + ' Tinte · dein Held wirft sie von selbst',
    kind: 'weapon', budget: tuning.ink.weaponBudget, allowed, canPick: true, doneLabel: 'Weiter zum ersten Gegner',
  });
  if (!weapon) { openSoloIntro(); return; }
  let heroCells = hero.cells;
  let weaponCells = weapon.cells;
  galleryAdd(heroCells, 'figure');
  galleryAdd(weaponCells, 'weapon');
  const run = core.soloCreateRun(tuning, (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0, heroCells, weaponCells, W, H, startColour);
  let lastEnemy = null;
  window.__inkDebug.run = run; // automated check only: forces the two loss paths

  for (;;) {
    let fightName;
    let fightStake = '';
    if (run.wave < core.SOLO_WAVES) {
      const waveNo = run.wave + 1;
      let stake = 0;
      const res = await openDraw({
        title: 'Welle ' + waveNo + ' von ' + core.SOLO_WAVES + ': dein Gegner',
        sub: 'Klein = Schwarm, groß = Brocken.',
        kind: 'figure', budget: so.enemyInkBudget, canPick: true, initial: lastEnemy,
        rowNote: 'als Figur', backLabel: 'Ende', backConfirm: true, endAsk: 'Lauf beenden?', endMsg: 'Noch einmal tippen, dann endet der ganze Lauf.', doneLabel: 'In den Kampf',
        extra: (box) => {
          const buttons = [];
          const wrap = el('div', { class: 'stakes', role: 'group', 'aria-label': 'Einsatz' });
          for (let i = 0; i < so.stakes.length; i++) {
            const b = el('button', { class: 'tool', type: 'button', id: 'stake' + i });
            onPress(b, () => { stake = i; sfx('click'); paint(null); });
            buttons.push(b);
            wrap.append(b);
          }
          box.append(wrap);
          // two fixed lines: the copy's real values, then a warning or a note
          const lineA = el('span', { id: 'stakeLine' });
          const lineB = el('span', { id: 'stakeSoft' });
          const noteEl = el('p', { class: 'fine stake-note', id: 'stakeNote' }, [lineA, lineB]);
          box.append(noteEl);
          let lastN = 0;
          let lastStats = null;
          function paint(stats) {
            if (stats) { lastN = stats.N; lastStats = stats; }
            // What a stake really does in rules version 3: more ink for the
            // wave (more copies, or tougher ones where no further copy fits),
            // harder hits (heavy copies crush harder with the stake), more
            // speed, and each drop pays its share.
            for (let i = 0; i < buttons.length; i++) {
              const copies = lastN > 0 ? core.soloCopies(tuning, run.wave, i, lastN) : 0;
              const loot = lastN > 0 ? copies * core.soloDropValue(tuning, run.wave, i, lastN) : 0;
              buttons[i].textContent = 'Einsatz ' + stakeLabel(i);
              // always two short lines, so the buttons never change height
              buttons[i].append(el('small', { text: copies > 0 ? copies + ' Gegner' : 'erst' }), el('span', { class: 'gap', text: ' · ' }), el('small', { text: copies > 0 ? loot + ' Beute' : 'zeichnen' }));
              buttons[i].classList.toggle('on', i === stake);
              buttons[i].setAttribute('aria-pressed', i === stake ? 'true' : 'false');
            }
            let text = 'Höherer Einsatz: mehr Beute, härtere Gegner.';
            if (lastN > 0 && lastStats) {
              const scale = core.soloWaveArmourScale(tuning, run.wave, stake, lastN);
              const parts = [];
              // What one touch of this very drawing takes off the hero at this
              // stake (rules version 3): blunt damage plus the crush of a heavy
              // copy, times the enemy and stake factors and the element. A
              // touch with a blade is a cut and never does less.
              const hit = soloTouch(run, lastStats, scale, stake);
              parts.push(hit.sharp > hit.blunt + 0.049 ? 'Treffer bis ' + num(hit.sharp, 1) : 'Treffer ' + num(hit.blunt, 1));
              // The rows above describe the drawing as a figure. As an enemy
              // copy it has its own speed and armour (solo.js): both are shown
              // as the real values of this wave and stake.
              parts.push('Tempo ' + num(core.soloEnemySpeed(tuning, { stats: lastStats }, stake), 1));
              parts.push('Panzer ' + Math.round(core.soloEnemyArmour(tuning, { stats: lastStats }, scale)));
              text = stakeLabel(stake) + ' · als Gegner: ' + parts.join(' · ');
              window.__inkDebug.stakeHit = { stake, blunt: hit.blunt, sharp: hit.sharp, crush: hit.crush, scale };
            }
            stakeText = text;
            show();
          }
          // Two lines of fixed height. The first always carries the stake
          // line with the copy's real touch, speed and armour, so no warning
          // can push those out. The second carries a warning that stops
          // nothing (drips, ink used up) or says what the rows above are. A
          // warning that needs an answer ("Lauf beenden?") takes both lines.
          let stakeText = '';
          let warnText = '';
          let softText = '';
          function show() {
            const hard = warnText !== '' && softText === '';
            lineA.textContent = hard ? warnText : stakeText;
            lineA.style.whiteSpace = hard ? 'normal' : '';
            lineB.textContent = hard ? '' : (softText || (lastN > 0 ? 'Die Zeilen oben zeigen die Zeichnung als Figur.' : ''));
            lineB.classList.toggle('soft', !hard && softText !== '');
            noteEl.classList.toggle('warn', hard);
          }
          paint.setMsg = (text, warn, soft) => { warnText = warn ? text : ''; softText = soft || ''; show(); };
          paint(null);
          return paint;
        },
      });
      if (!res) { goHome(); return; }
      lastEnemy = res.cells;
      galleryAdd(res.cells, 'figure');
      core.soloStartWave(tuning, run, res.cells, stake);
      fightName = 'Welle ' + waveNo + ' von ' + core.SOLO_WAVES;
      fightStake = stake > 0 ? ' · Einsatz ' + stakeLabel(stake) : '';
    } else {
      clearHud();
      // What is coming, from the core (solo.js soloStartBoss): the boss keeps
      // the armour of the merged drawing times bossArmourMult, and every wave
      // design sends bossEscortCopies copies along.
      const bossStats = core.buildFigure(core.soloBossCells(run), W, H, tuning, 'figure', W * H).stats;
      const bossArmour = Math.round(bossStats.armour * so.bossArmourMult);
      const escorts = run.enemyDrawings.length * so.bossEscortCopies;
      const r = await fightOverlay('Der Endgegner', [
        el('div', { class: 'lineup' }, [el('div', { class: 'card' }, [thumbCanvas(core.soloBossCells(run), 64), el('span', { class: 'card-name', text: 'Alle in einem' })])]),
        el('p', { text: 'Er besteht aus allen Gegnern, die du gezeichnet hast, und bringt je einen davon mit.' }),
        el('p', { id: 'bossFacts', text: 'Sein Panzer: ' + bossArmour + ' · Begleiter: ' + escorts + ' · dein Panzer: ' + Math.ceil(run.heroHp) + ' von ' + Math.round(run.heroMaxHp) }),
        el('p', { id: 'bossTip', text: 'Tipp: Halte Abstand. Deine Waffe wirft von selbst, und dein Panzer heilt im Kampf nicht.' }),
        el('p', { class: 'fine', text: 'Hier gibt es keinen Einsatz: alle schlagen in Grundstärke zu, und auch schwere Gegner drücken hier nicht mit ihrem Gewicht.' }),
      ], 'In den Kampf', 'Zum Menü');
      if (r !== 'primary') { goHome(); return; }
      core.soloStartBoss(tuning, run);
      fightName = 'Endgegner';
    }

    const result = await runFight(soloFightConfig(run, fightName, fightStake));
    if (result === 'quit') { goHome(); return; }

    if (run.phase === 'dead' || run.phase === 'won') {
      const won = run.phase === 'won';
      sfx(won ? 'win' : 'lose');
      const isBest = saveBestScore(run.score);
      const why = won ? 'Der Endgegner ist nur noch ein Fleck.'
        : (run.endReason === 'time' ? 'Die Zeit ist um: ein Kampf darf höchstens ' + Math.round(so.waveMaxTicks / tuning.physics.tickRate / 60) + ' Minuten dauern.'
          : 'Dein Panzer ist zerbrochen (' + fightName + ').');
      const r = await fightOverlay(won ? 'Geschafft!' : 'Aus und vorbei', [
        el('p', { text: why }),
        el('p', { class: 'score-big', text: String(run.score) }),
        el('p', { class: 'fine', text: 'Tinte gesammelt' + (isBest ? ' · neuer Bestwert auf diesem Gerät' : ' · Bestwert: ' + bestScore()) }),
        el('p', { class: 'fine', text: 'Geschaffte Wellen: ' + Math.min(run.wave, core.SOLO_WAVES) + ' von ' + core.SOLO_WAVES + (won ? ' und der Endgegner' : '') }),
      ], 'Nochmal', 'Zum Menü');
      if (r === 'primary') openSoloIntro(); else goHome();
      return;
    }

    // cleared: the shop
    const next = await shop(run, () => heroCells, (c) => { heroCells = c; }, () => weaponCells, (c) => { weaponCells = c; });
    if (next === 'quit') { goHome(); return; }
  }
}

function soloFightConfig(run, fightName, fightStake) {
  const col = colours();
  const T = tuning.physics.tickRate;
  let built = false;
  let bar = null;
  let line = null;
  const weaponSprite = spriteFor(run.weaponFig);
  return {
    mode: 'solo',
    viewRadius: so.arenaRadius + 2,
    startRadius: so.arenaRadius,
    ringRadius: () => so.arenaRadius,
    world: () => run.world,
    events: () => run.events,
    humans: 1,
    // measurement only (build/solo_play.cjs): a scripted player may steer the hero
    step: (humanFn) => core.soloStep(tuning, run, window.__inkDebug.soloPilot ? window.__inkDebug.soloPilot(run) : humanFn(0)),
    isOver: () => run.phase !== 'fight',
    bodyInfo: (i) => (i === 0 ? { tag: '', human: true, bar: true } : null),
    dashBody: () => run.world.bodies[0],
    follow: () => run.world.bodies[0],
    minCellPx: 5,
    controlHint: coarsePointer() ? 'Ziehen lenkt · Knopf sprintet · geworfen wird von selbst' : 'W A S D oder Pfeile · Leertaste sprintet · geworfen wird von selbst',
    extraDraw: (g, cam, t, layer) => {
      if (layer === 'under') {
        g.fillStyle = col.ink;
        for (const d of run.drops) {
          const blink = d.life < 120 && !reducedMotion() ? (Math.floor(t * 8) % 2 === 0 ? 0.35 : 0.9) : 0.9;
          g.globalAlpha = blink;
          const r = (0.7 + Math.min(1.2, d.value / 120)) * cam.s;
          const x = cam.cx + d.x * cam.s;
          const y = cam.cy + d.y * cam.s;
          g.beginPath();
          g.arc(x, y, r, 0, 6.2832);
          g.arc(x + r * 0.9, y + r * 0.5, r * 0.45, 0, 6.2832);
          g.arc(x - r * 0.7, y + r * 0.8, r * 0.3, 0, 6.2832);
          g.fill();
        }
        g.globalAlpha = 1;
      } else {
        const fr = wobbleFrame(t, 0);
        for (const s of run.shots) {
          drawSprite(g, weaponSprite, fr, cam.cx + s.x * cam.s, cam.cy + s.y * cam.s, s.ux, s.uy, cam.s, 1, 1);
        }
      }
    },
    hud: (root) => {
      if (!built || root.firstChild === null) {
        built = true;
        root.textContent = '';
        bar = el('i');
        root.append(el('div', { class: 'chip' }, [
          el('span', { class: 'chip-body' }, [el('span', { class: 'chip-name', text: 'Dein Panzer' }), el('span', { class: 'hpbar' }, [bar])]),
        ]));
        line = el('div', { class: 'hud-line' });
        root.append(line);
      }
      const hero = run.world.bodies[0];
      bar.style.width = Math.max(0, hero.hp / hero.maxHp * 100).toFixed(0) + '%';
      let alive = 0;
      for (let i = 1; i < run.world.bodies.length; i++) if (run.world.bodies[i].alive) alive++;
      const left = Math.ceil((so.waveMaxTicks - run.tick) / T);
      const text = fightName + fightStake + ' · Gegner ' + alive + ' · Beutel ' + run.wallet + (left <= 30 ? ' · noch ' + left + ' s' : '');
      if (line.textContent !== text) line.textContent = text;
    },
  };
}

function shop(run, getHero, setHero, getWeapon, setWeapon) {
  return new Promise((resolve) => {
    const cost = so.upgradeCost[run.wave - 1];
    const list = $('shopList');
    const colourBox = $('shopColours');
    const msg = $('shopMsg');
    let leaving = false;

    function fail(reason) {
      const text = {
        tooExpensive: 'Dafür reicht die Tinte nicht.', alreadyTaken: 'Pro Pause gibt es nur ein Upgrade.',
        tooSmall: 'Die Zeichnung war zu klein.', overBudget: 'Zu viel Tinte in der Zeichnung.', colourLocked: 'Die Farbe hast du noch nicht.',
      }[reason] || 'Das ging nicht.';
      msg.textContent = text;
      msg.classList.add('warn');
      sfx('deny');
    }
    function bought(text) { msg.textContent = text; msg.classList.remove('warn'); sfx('buy'); }

    function render() {
      $('shopTitle').textContent = 'Welle ' + run.wave + ' geschafft';
      $('shopInfo').textContent = 'Tinte im Beutel: ' + run.wallet + ' · Panzer: ' + Math.ceil(run.heroHp) + ' von ' + Math.round(run.heroMaxHp)
        + '. Dein Panzer heilt nicht von selbst: nur „Flicken“ bringt ihn zurück. Du darfst ein Upgrade kaufen, es kostet ' + cost + ' Tinte.';
      // honest label: spent or not, only collected ink counts as the score
      $('shopPurse').textContent = 'Als Punkte zählt alle Tinte, die du gesammelt hast (bisher ' + run.score
        + '). Ausgeben kostet keine Punkte. Was im Beutel übrig bleibt, wird in dieser Version für nichts weiter gebraucht.';
      const can = !run.upgradeTaken && run.wallet >= cost;
      list.textContent = '';
      colourBox.hidden = true;
      colourBox.textContent = '';
      const locked = [2, 3, 4].filter((c) => !run.colours[c]);
      const mk = (id, title, sub, enabled, fn) => {
        const b = el('button', { class: 'btn', type: 'button', id }, [document.createTextNode(title), el('small', { text: sub })]);
        b.disabled = !enabled;
        b.addEventListener('click', fn);
        list.append(b);
      };
      mk('shopHero', 'Größerer Held', '+' + so.upgradeHeroInk + ' Tinte, du zeichnest ihn neu (Schaden bleibt)', can, async () => {
        leaving = true;
        const res = await openDraw({
          title: 'Held neu zeichnen', sub: (run.heroBudget + so.upgradeHeroInk) + ' Tinte',
          kind: 'figure', budget: run.heroBudget + so.upgradeHeroInk, allowed: run.colours.slice(), initial: getHero(), canPick: true, doneLabel: 'Kaufen',
        });
        leaving = false;
        showScreen('scrShop');
        if (res) {
          const r = core.soloUpgrade(tuning, run, 'heroInk', res.cells);
          if (r === '') { setHero(res.cells); bought('Dein Held ist gewachsen.'); } else fail(r);
        }
        render();
      });
      mk('shopWeapon', 'Größere Wurfwaffe', '+' + so.upgradeWeaponInk + ' Tinte, du zeichnest sie neu', can, async () => {
        leaving = true;
        const res = await openDraw({
          title: 'Waffe neu zeichnen', sub: (run.weaponBudget + so.upgradeWeaponInk) + ' Tinte',
          kind: 'weapon', budget: run.weaponBudget + so.upgradeWeaponInk, allowed: run.colours.slice(), initial: getWeapon(), canPick: true, doneLabel: 'Kaufen',
        });
        leaving = false;
        showScreen('scrShop');
        if (res) {
          const r = core.soloUpgrade(tuning, run, 'weaponInk', res.cells);
          if (r === '') { setWeapon(res.cells); bought('Neue Waffe eingepackt.'); } else fail(r);
        }
        render();
      });
      mk('shopHeal', 'Flicken', 'heilt ' + so.upgradeHealPercent + ' % deines Panzers', can && run.heroHp < run.heroMaxHp, () => {
        const r = core.soloUpgrade(tuning, run, 'heal', null);
        if (r === '') bought('Geflickt.'); else fail(r);
        render();
      });
      mk('shopColour', 'Neue Farbe', locked.length ? 'für Held und Waffe beim nächsten Neuzeichnen' : 'du hast schon alle', can && locked.length > 0, () => {
        colourBox.hidden = false;
        colourBox.textContent = '';
        for (const c of locked) {
          const b = el('button', { class: 'btn c' + c, type: 'button', id: 'shopCol' + c, text: ELEMENT_NAMES[c] });
          b.addEventListener('click', () => {
            const r = core.soloUpgrade(tuning, run, 'colour', c);
            if (r === '') bought(ELEMENT_NAMES[c] + ' gehört jetzt dir.'); else fail(r);
            render();
          });
          colourBox.append(b);
        }
      });
      if (run.upgradeTaken) for (const b of list.querySelectorAll('button')) b.disabled = true;
      $('shopNext').textContent = run.wave >= core.SOLO_WAVES ? 'Zum Endgegner' : 'Nächsten Gegner zeichnen';
    }

    msg.textContent = '';
    msg.classList.remove('warn');
    render();
    showScreen('scrShop');
    $('shopNext').onclick = () => { if (leaving) return; $('shopNext').onclick = null; $('shopQuit').onclick = null; sfx('click'); resolve('next'); };
    let armed = 0;
    $('shopQuit').textContent = 'Ende';
    $('shopQuit').onclick = () => {
      if (performance.now() - armed > 2500) {
        armed = performance.now();
        $('shopQuit').textContent = 'Sicher?';
        setTimeout(() => { $('shopQuit').textContent = 'Ende'; }, 2500);
        return;
      }
      $('shopNext').onclick = null; $('shopQuit').onclick = null;
      resolve('quit');
    };
  });
}
