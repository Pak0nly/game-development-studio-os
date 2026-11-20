// Automated play-through of the built prototype with the pre-installed
// Playwright. Nothing is installed or downloaded.
//
//   node build/verify.cjs [phone|landscape|desktop|artifact|duo|checks|stable|all] [--shots DIR]
//
// Screenshots go to a folder in the system temp directory unless --shots DIR
// names another place (so a re-run never overwrites evidence by accident).
//
// phone:    400 x 780, touch input through real touch events
// landscape: the same phone held sideways, 780 x 400
// checks:   phone; the single fixes of INK-WEB-V2 (double taps, asking before
//           a drawing is thrown away, ink running out, finger off the canvas,
//           rotation in a stroke, bot drawings, stains, both solo loss paths)
//           and of INK-WEB-V3 (rules version 2: a blade on a block raises the
//           sharpness, a diagonal stroke is a blade, pocket marks, what the
//           "Ende" buttons ask, the rules panel, honest stakes, a ram)
// desktop:  1280 x 800, mouse and keyboard
// artifact: the fragment file wrapped in a bare host page, 400 x 780,
//           with prefers-reduced-motion: reduce
// duo:      1280 x 800, two humans on one keyboard, hand-over and time-out
// Each run draws a figure, plays a Ring match against bots to its end and
// plays the Solo Arena (at least one wave, then as far as it gets). It fails
// on any console error, page error, network request or sideways page scroll.

const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const args = process.argv.slice(2);
const which = args[0] && !args[0].startsWith('--') ? args[0] : 'all';
const shotArg = args.indexOf('--shots');
const SHOTS = shotArg !== -1 ? path.resolve(args[shotArg + 1]) : path.join(os.tmpdir(), 'inkweight-shots');

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
// taps are ignored for a moment after a screen change: a player's finger is
// never that fast on purpose, so the script waits like a person would
function ready(page) { return page.waitForFunction(() => !window.__inkDebug.inputBlocked()); }

async function runScenario(browser, name) {
  const phone = name !== 'desktop';
  const log = [];
  const note = (s) => { log.push(s); console.log('[' + name + '] ' + s); };
  const context = await browser.newContext({
    viewport: name === 'landscape' ? { width: 780, height: 400 } : (phone ? { width: 400, height: 780 } : { width: 1280, height: 800 }),
    deviceScaleFactor: 2,
    hasTouch: phone,
    isMobile: phone,
    reducedMotion: name === 'artifact' ? 'reduce' : 'no-preference',
  });
  const page = await context.newPage();
  const errors = [];
  runScenario.errors = errors;
  runScenario.page = page;
  const requests = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('request', (r) => { if (!r.url().startsWith('file:')) requests.push(r.url()); });

  let file = path.join(DIST, 'inkweight.html');
  if (name === 'artifact') {
    // The fragment has no html/head/body of its own; a host supplies them.
    const frag = fs.readFileSync(path.join(DIST, 'inkweight.artifact.html'), 'utf8');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'inkweight-host-'));
    file = path.join(dir, 'host.html');
    fs.writeFileSync(file, '<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + frag + '</body></html>');
  }
  await page.goto('file://' + file);
  await page.waitForSelector('#btnRing');
  let rounds = 0;
  let matchTitle = '';
  const cdp = phone ? await context.newCDPSession(page) : null;

  let shotNo = 0;
  const shot = async (label) => {
    if (name === 'artifact') return;
    shotNo++;
    const f = path.join(SHOTS, name + '-' + String(shotNo).padStart(2, '0') + '-' + label + '.png');
    await page.screenshot({ path: f });
    note('screenshot ' + path.basename(f));
  };
  const press = async (sel) => {
    await page.waitForSelector(sel, { state: 'visible' });
    await ready(page);
    if (phone) await page.tap(sel); else await page.click(sel);
  };
  // the main button of a drawing screen must be on screen without scrolling
  const drawFits = async (where) => {
    const r = await page.evaluate(() => {
      const b = document.getElementById('drawDone').getBoundingClientRect();
      const s = document.getElementById('scrDraw');
      const side = document.querySelector('.draw-side');
      const c = document.getElementById('drawCanvas').getBoundingClientRect();
      return { bottom: Math.round(b.bottom), top: Math.round(b.top), ih: window.innerHeight, sh: s.scrollHeight, ch: s.clientHeight,
        sideSh: side.scrollHeight, sideCh: side.clientHeight, canvas: Math.round(c.width) };
    });
    note('drawing screen fit at ' + where + ': ' + JSON.stringify(r));
    if (r.bottom > r.ih || r.top < 0 || r.sh > r.ch || r.sideSh > r.sideCh + 1) throw new Error('main button not reachable without scrolling at ' + where);
    if (r.canvas < 240) throw new Error('canvas too small at ' + where + ': ' + r.canvas);
  };
  const noSideScroll = async (where) => {
    const r = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth, bw: document.body.scrollWidth, iw: window.innerWidth,
      sh: document.documentElement.scrollHeight, ih: window.innerHeight,
    }));
    if (r.sw > r.iw || r.bw > r.iw) throw new Error('sideways scroll at ' + where + ': ' + JSON.stringify(r));
    if (r.sh > r.ih) throw new Error('page (not screen) scrolls vertically at ' + where + ': ' + JSON.stringify(r));
  };
  // pointer path through client coordinates
  const drag = async (pts, steps) => {
    const n = steps || 6;
    if (phone) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: pts[0][0], y: pts[0][1] }] });
      for (let i = 1; i < pts.length; i++) {
        for (let k = 1; k <= n; k++) {
          const x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k / n;
          const y = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k / n;
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
        }
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } else {
      await page.mouse.move(pts[0][0], pts[0][1]);
      await page.mouse.down();
      for (let i = 1; i < pts.length; i++) await page.mouse.move(pts[i][0], pts[i][1], { steps: n });
      await page.mouse.up();
    }
  };
  // draw through canvas cells
  const strokeCells = async (cells) => {
    await ready(page);
    const box = await page.locator('#drawCanvas').boundingBox();
    const c = box.width / 32;
    await drag(cells.map(([x, y]) => [box.x + (x + 0.5) * c, box.y + (y + 0.5) * c]));
    await sleep(150); // a finger needs at least this long to reach a button
  };
  const statNumbers = () => page.evaluate(() => ({
    weight: document.getElementById('stWeight').textContent,
    armour: document.getElementById('stArmour').textContent,
    sharp: document.getElementById('stSharp').textContent,
    speed: document.getElementById('stSpeed').textContent,
    element: document.getElementById('stElement').textContent,
    ink: document.getElementById('inkNum').textContent,
    msg: document.getElementById('drawMsg').textContent,
    done: !document.getElementById('drawDone').disabled,
  }));
  const dismissHint = async () => {
    if (await page.locator('#drawHint').isVisible()) await press('#drawHintOk');
  };
  // a body with a blade on top and a coloured belly
  const drawFigure = async (colourTool) => {
    await dismissHint();
    await press('#toolBrush'); // thick
    await strokeCells([[11, 15], [20, 15], [20, 18], [11, 18], [11, 21], [20, 21]]);
    if (colourTool) {
      await press(colourTool);
      await strokeCells([[11, 21], [20, 21], [20, 23], [11, 23], [11, 25], [20, 25]]);
      await press('#toolC1');
    }
    await press('#toolBrush'); // thin
    await strokeCells([[15, 14], [15, 4]]);
    await strokeCells([[16, 14], [22, 8]]);
    await strokeCells([[3, 29], [5, 29]]); // a loose bit: drips off
  };

  // ---------- start
  await sleep(400);
  await noSideScroll('start');
  await shot('start');
  const doodleNote = await page.evaluate(() => { const n = document.getElementById('startDoodleNote'); return n.hidden ? '' : n.textContent; });
  note('start figures note: ' + doodleNote);
  if (!/Platzhalter/.test(doodleNote)) throw new Error('placeholder figures on the start screen are not marked');
  await press('#sndStart'); // sound on by a tap, then off again
  await press('#sndStart');
  // the rules panel from the start screen
  await press('#btnRules');
  await page.waitForSelector('#rulesLayer:not([hidden])');
  await sleep(200);
  await noSideScroll('rules');
  const rulesText = (await page.locator('#rulesLayer').innerText()).replace(/\s+/g, ' ');
  for (const w of ['Menge ist Gewicht', 'Gewicht', 'Panzer', 'Schärfe', 'Tempo', 'Glut schlägt Moos schlägt Flut schlägt Glut', 'Testwerte']) {
    if (rulesText.indexOf(w) === -1) throw new Error('rules panel lacks: ' + w);
  }
  if (/\d\.\d/.test(rulesText)) throw new Error('decimal point in the rules panel');
  await shot('rules');
  await press('#rulesClose');
  await page.waitForSelector('#rulesLayer', { state: 'hidden', timeout: 3000 });
  // count ram events of all fights of this run (read only)
  await page.evaluate(() => {
    const d = window.__inkDebug;
    d.rams = 0; d.sharpHits = 0; d.hits = 0;
    d.onFightEvent = (ev) => { if (ev.type === 'ram') d.rams++; else if (ev.type === 'hit') { d.hits++; if (ev.sharp) d.sharpHits++; } };
  });

  // ---------- free drawing
  await press('#btnFree');
  await sleep(250);
  if (phone) await shot('draw-first-hint');
  const before = await statNumbers();
  await drawFigure('#toolC2');
  const mid = await statNumbers();
  note('stats after drawing: ' + JSON.stringify(mid));
  if (!mid.done) throw new Error('drawing is not valid');
  if (mid.weight === before.weight || mid.sharp === before.sharp) throw new Error('live stats did not change');
  const whys = await page.evaluate(() => ['stWeightWhy', 'stArmourWhy', 'stSharpWhy', 'stSpeedWhy', 'stElementWhy'].map((id) => document.getElementById(id).textContent));
  note('stat explanations: ' + whys.join(' | '));
  if (!/^\d+ Klingen · Schnitt: auch 0,4 % Panzer$/.test(whys[2]) || /Anteil gerader/.test(whys[2])) throw new Error('sharpness explanation is not the version 2 one: ' + whys[2]);
  if (!/Kern-Punkte?$/.test(whys[1]) || !/Hülle|Hohlraum/.test(whys[0])) throw new Error('weight or armour explanation is wrong');
  const marksNow = await page.evaluate(() => window.__inkDebug.marks);
  if (marksNow.blades !== marksNow.S || marksNow.blades < 10) throw new Error('blade marks do not follow the core: ' + JSON.stringify(marksNow));
  // the rules panel opens over the drawing and keeps it
  await press('#drawRules');
  await page.waitForSelector('#rulesLayer:not([hidden])');
  await press('#rulesClose');
  await page.waitForSelector('#rulesLayer', { state: 'hidden', timeout: 3000 });
  await sleep(700); // a person looks at the drawing again before the next tap
  if (await page.locator('#rulesLayer').isVisible()) throw new Error('rules panel came back');
  if ((await statNumbers()).weight !== mid.weight) throw new Error('rules panel changed the drawing');
  if (mid.element !== 'Glut') throw new Error('element did not follow the colour: ' + mid.element);
  if (/\./.test(mid.sharp) || !/,/.test(mid.sharp)) throw new Error('no decimal comma: ' + mid.sharp);
  await sleep(300);
  await noSideScroll('draw');
  await drawFits('free drawing');
  await shot('draw');
  // eraser, undo, clear and undo again must keep things consistent
  await press('#toolErase');
  await strokeCells([[15, 6], [15, 4]]);
  const erased = await statNumbers();
  await press('#toolUndo');
  const undone = await statNumbers();
  if (erased.weight === mid.weight || undone.weight !== mid.weight) throw new Error('eraser or undo is wrong: ' + mid.weight + ' ' + erased.weight + ' ' + undone.weight);
  await press('#toolClear');
  const cleared = await statNumbers();
  if (cleared.weight !== '0') throw new Error('clear did not clear');
  await press('#toolUndo');
  if ((await statNumbers()).weight !== mid.weight) throw new Error('undo after clear is wrong');
  await press('#toolC1');
  await press('#drawDone');
  await page.waitForSelector('#scrGallery:not([hidden])');
  await sleep(200);
  await noSideScroll('gallery');
  await shot('gallery');
  const stored = await page.evaluate(() => { try { return JSON.parse(localStorage.getItem('inkweight.gallery.v1')).length; } catch (e) { return -1; } });
  note('gallery items in localStorage: ' + stored);
  await press('#galBack');

  // ---------- the Ring
  if (!process.env.INK_SKIP_RING) {
  await press('#btnRing');
  await sleep(200);
  await noSideScroll('ring setup');
  {
    // the main button is on screen without scrolling (N-3: it was 9 px below a sideways phone)
    const r = await page.evaluate(() => ({ bottom: Math.round(document.getElementById('ringGo').getBoundingClientRect().bottom), ih: window.innerHeight }));
    note('ring setup: main button bottom ' + r.bottom + ' of ' + r.ih);
    if (r.bottom > r.ih) throw new Error('"Los, zeichnen!" is below the window');
  }
  await shot('ring-setup');
  await press('#ringGo');
  await page.waitForSelector('#scrDraw:not([hidden])');
  await drawFigure('#toolC3');
  await sleep(1200); // let the clock run a little
  const timerText = await page.locator('#drawTimer').textContent();
  note('draw timer shows ' + timerText);
  if (!(parseInt(timerText, 10) < 30)) throw new Error('timer did not start');
  await drawFits('ring drawing');
  await shot('ring-draw');
  await press('#drawDone');
  
  for (;;) {
    await page.waitForSelector('#fightOverlay:not([hidden])');
    if (rounds === 0) {
      await sleep(200); await noSideScroll('line-up');
      const r = await page.evaluate(() => ({ bottom: Math.round(document.getElementById('ovPrimary').getBoundingClientRect().bottom), ih: window.innerHeight,
        styles: Array.from(document.querySelectorAll('#ovBody .card .fine')).map((n) => n.textContent).join(' | '), core: (window.__inkDebug.ringBotStyles || []).join('') }));
      note('line-up: main button bottom ' + r.bottom + ' of ' + r.ih + ', bot styles shown: ' + r.styles + ' (core botStyle ' + r.core + ')');
      if (r.bottom > r.ih) throw new Error('"In den Ring!" is below the window');
      if (!/stürmt/.test(r.styles) || !/kreist/.test(r.styles)) throw new Error('the two bot styles are not mixed: ' + r.styles);
      await shot('ring-lineup');
    }
    await sleep(600);
    await press('#ovPrimary');
    // fight: steer in a slow circle, dash now and then
    await sleep(2300);
    const stage = await page.locator('#fightStage').boundingBox();
    const cx = stage.x + stage.width / 2;
    const cy = stage.y + stage.height / 2;
    const off = Math.min(100, stage.height * 0.25);
    if (rounds === 0) {
      if (phone) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx, y: cy + off }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx + 30, y: cy + off - 20 }] });
        await sleep(700);
        await page.evaluate(() => document.getElementById('dashBtn').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
        await sleep(150);
        await shot('ring-fight');
        await page.evaluate(() => document.getElementById('dashBtn').dispatchEvent(new PointerEvent('pointerup', { bubbles: true })));
        await sleep(1500);
        await shot('ring-fight-later');
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      } else {
        await page.keyboard.down('KeyD');
        await sleep(600);
        await page.keyboard.press('Space');
        await sleep(200);
        await shot('ring-fight');
        await page.keyboard.up('KeyD');
        await page.keyboard.down('ArrowLeft');
        await sleep(1500);
        await shot('ring-fight-later');
        await page.keyboard.up('ArrowLeft');
      }
      await noSideScroll('fight');
    }
    await page.evaluate(() => { window.__inkDebug.speed = 8; });
    const keysList = ['KeyW', 'KeyD', 'KeyS', 'KeyA'];
    let k = 0;
    while (!(await page.locator('#fightOverlay').isVisible())) {
      if (!phone) {
        await page.keyboard.down(keysList[k % 4]);
        await sleep(250);
        await page.keyboard.up(keysList[k % 4]);
        if (k % 3 === 0) await page.keyboard.press('Space');
      } else {
        const a = k * 1.3;
        await drag([[cx, cy + off], [cx + Math.cos(a) * 40, cy + off + Math.sin(a) * 40]], 2);
        await sleep(200);
      }
      k++;
      if (k > 400) throw new Error('ring round did not end');
    }
    await page.evaluate(() => { window.__inkDebug.speed = 1; });
    rounds++;
    const title = await page.locator('#ovTitle').textContent();
    const body = await page.locator('#ovBody').innerText();
    note('round ' + rounds + ': ' + title + ' | ' + body.replace(/\s+/g, ' ').slice(0, 160));
    if (/geht an Du\b/.test(title)) throw new Error('grammar: ' + title);
    if (rounds === 1) { await sleep(300); await shot('ring-round-result'); }
    if (/gewinn(s)?t das Spiel/.test(title)) {
      matchTitle = title;
      // the win dots in the HUD must show the final score
      const pips = await page.evaluate(() => ({
        dots: Array.from(document.querySelectorAll('#fightHud .pips')).map((p) => (p.textContent.match(/●/g) || []).length).join(' : '),
        score: document.querySelector('#ovBody .score-big').textContent,
      }));
      note('win dots ' + pips.dots + ' against score ' + pips.score);
      if (pips.dots !== pips.score) throw new Error('win dots do not show the final score');
      await sleep(300); await shot('ring-match-result'); break;
    }
    await sleep(600);
    await press('#ovPrimary'); // next round: the drawing screen with the previous figure
    await page.waitForSelector('#scrDraw:not([hidden])');
    const sub = await page.locator('#drawSub').textContent();
    note('next drawing: ' + sub);
    await press('#drawDone');
    if (rounds > 8) throw new Error('match did not end');
  }
  note('ring match over after ' + rounds + ' rounds: ' + matchTitle);
  await sleep(600);
  await press('#ovSecondary');
  await page.waitForSelector('#scrStart:not([hidden])');
  }

  // ---------- Solo Arena
  await press('#btnSolo');
  await sleep(200);
  await noSideScroll('solo intro');
  await shot('solo-intro');
  await press('#soloC4');
  await page.waitForSelector('#scrDraw:not([hidden])');
  await drawFigure('#toolC4');
  await press('#drawDone');
  await sleep(200);
  // weapon: a thin cross
  await strokeCells([[16, 8], [16, 22]]);
  await strokeCells([[10, 15], [22, 15]]);
  await drawFits('weapon drawing');
  const wst = await statNumbers();
  note('weapon stats: ' + JSON.stringify(wst));
  await shot('solo-weapon');
  await press('#drawDone');
  let waves = 0;
  let soloEnd = '';
  const bought = new Set();
  for (;;) {
    const where = await page.evaluate(() => ['scrDraw', 'scrFight', 'scrShop'].find((id) => !document.getElementById(id).hidden) || '');
    if (where === 'scrDraw') {
      // enemy: small, so several copies come
      await sleep(200);
      await press('#toolBrush');
      await strokeCells([[14, 14], [17, 14], [17, 16], [14, 16]]);
      await press('#toolBrush');
      await strokeCells([[15, 13], [15, 9]]);
      const stakes = await page.evaluate(() => [0, 1, 2].map((i) => { const b = document.getElementById('stake' + i); return { off: b.disabled, text: b.textContent }; }));
      const live = stakes.filter((s) => !s.off).map((s) => s.text.replace(/^Einsatz ×[\d,]+/, ''));
      if (new Set(live).size !== live.length) throw new Error('two stakes that can be picked look the same: ' + JSON.stringify(stakes));
      const pickStake = waves === 0 ? 0 : 1;
      await press('#stake' + pickStake);
      note('wave ' + (waves + 1) + ' stakes: ' + stakes.map((s) => (s.off ? '[aus] ' : '') + s.text).join(' | ') + ' || picked ' + pickStake + ': ' + (await page.locator('#stakeNote').textContent()));
      if (waves === 0) { await sleep(300); await noSideScroll('enemy draw'); await drawFits('enemy drawing'); await shot('solo-enemy-draw'); }
      await press('#drawDone');
    } else if (where === 'scrFight') {
      if (await page.locator('#fightOverlay').isVisible()) {
        const title = await page.locator('#ovTitle').textContent();
        if (title === 'Der Endgegner') { await sleep(300); await shot('solo-boss-intro'); await sleep(400); await press('#ovPrimary'); continue; }
        soloEnd = title + ' | ' + (await page.locator('#ovBody').innerText()).replace(/\s+/g, ' ');
        await sleep(300);
        await shot('solo-result');
        break;
      }
      await sleep(2300);
      const stage = await page.locator('#fightStage').boundingBox();
      const cx = stage.x + stage.width / 2;
      const cy = stage.y + stage.height / 2;
      const off = Math.min(150, stage.height * 0.3);
      if (waves === 0) {
        if (!phone) { await page.keyboard.down('KeyA'); await sleep(2500); await page.keyboard.up('KeyA'); }
        else { await drag([[cx, cy + off], [cx - 40, cy + off], [cx - 40, cy + off + 1]], 30); await sleep(1500); }
        await shot('solo-fight');
        await noSideScroll('solo fight');
      }
      await page.evaluate(() => { window.__inkDebug.speed = 8; });
      const keysList = ['KeyW', 'KeyD', 'KeyS', 'KeyA'];
      let k = 0;
      for (;;) {
        const st = await page.evaluate(() => ({
          fight: !document.getElementById('scrFight').hidden,
          overlay: !document.getElementById('fightOverlay').hidden,
        }));
        if (!st.fight || st.overlay) break;
        if (!phone) {
          await page.keyboard.down(keysList[k % 4]);
          await sleep(300);
          await page.keyboard.up(keysList[k % 4]);
        } else {
          const a = k * 1.57;
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx, y: cy + off }] });
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx + Math.cos(a) * 45, y: cy + off + Math.sin(a) * 45 }] });
          await sleep(300);
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        }
        k++;
        if (k > 300) throw new Error('solo fight did not end');
      }
      await page.evaluate(() => { window.__inkDebug.speed = 1; });
      waves++;
      note('solo fight ' + waves + ' ended');
    } else if (where === 'scrShop') {
      const info = await page.locator('#shopInfo').textContent();
      note('shop: ' + info);
      if (waves === 1) { await sleep(200); await noSideScroll('shop'); await shot('solo-shop'); }
      // one upgrade per pause: hero redraw, weapon redraw, new colour, then healing
      const plan = ['#shopHero', '#shopWeapon', '#shopColour', '#shopHeal', '#shopHeal'][waves - 1] || '#shopHeal';
      for (const id of [plan, '#shopHeal', '#shopColour', '#shopHero']) {
        if (!(await page.locator(id).isEnabled())) continue;
        await press(id);
        if (id === '#shopColour') await press('#shopColours button');
        if (id === '#shopHero' || id === '#shopWeapon') {
          await page.waitForSelector('#scrDraw:not([hidden])');
          const sub = await page.locator('#drawSub').textContent();
          await strokeCells(id === '#shopHero' ? [[12, 27], [19, 27]] : [[17, 8], [19, 8]]);
          if (waves === 1) { await sleep(200); await shot('solo-hero-redraw'); }
          note('redraw (' + sub + '): ' + JSON.stringify(await statNumbers()));
          await press('#drawDone');
          await page.waitForSelector('#scrShop:not([hidden])');
        }
        // a tap right after the list was scrolled into view can take a moment to act
        await page.waitForFunction(() => document.getElementById('shopMsg').textContent !== '', null, { timeout: 3000 }).catch(() => {});
        const msg = await page.locator('#shopMsg').textContent();
        note('bought ' + id + ': ' + msg);
        const want = { '#shopHero': 'Dein Held ist gewachsen.', '#shopWeapon': 'Neue Waffe eingepackt.', '#shopHeal': 'Geflickt.' }[id];
        if (want ? msg !== want : !/gehört jetzt dir/.test(msg)) throw new Error('purchase ' + id + ' failed: ' + msg);
        bought.add(id);
        break;
      }
      await press('#shopNext');
    } else {
      await sleep(100);
    }
    if (waves > 7) throw new Error('solo run did not end');
  }
  note('solo run ended after ' + waves + ' fights: ' + soloEnd);
  const evCount = await page.evaluate(() => ({ rams: window.__inkDebug.rams, hits: window.__inkDebug.hits, sharpHits: window.__inkDebug.sharpHits }));
  note('fight events seen in this run: ' + JSON.stringify(evCount));
  if (!(evCount.hits > 0 && evCount.sharpHits > 0)) throw new Error('no blade hit in a whole run');
  if (waves < 1) throw new Error('no solo wave was played');
  note('shop purchases made: ' + Array.from(bought).join(' '));
  for (const id of ['#shopHero', '#shopWeapon', '#shopColour']) if (!bought.has(id)) throw new Error('shop choice never bought: ' + id);
  await sleep(600);
  await press('#ovSecondary');
  await page.waitForSelector('#scrStart:not([hidden])');
  await noSideScroll('start again');
  await sleep(300);
  const noteNow = await page.evaluate(() => { const n = document.getElementById('startDoodleNote'); return n.hidden ? '' : n.textContent; });
  note('start figures note with a filled gallery: "' + noteNow + '"');
  if (noteNow !== '') throw new Error('start screen still names placeholders although four own figures exist');
  await shot('start-own-figures');

  await context.close();
  if (requests.length) throw new Error('network requests: ' + requests.join(', '));
  if (errors.length) throw new Error('console problems: ' + errors.join(' | '));
  return { rounds, waves, soloEnd, bought: Array.from(bought).length, rams: evCount.rams };
}


// Two humans on one PC: hand-over screens, drawing in turns, a drawing that
// runs out of time, both keyboard zones, leaving a match.
async function runDuo(browser) {
  const name = 'duo';
  const note = (s) => console.log('[' + name + '] ' + s);
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  const errors = [];
  runScenario.errors = errors;
  runScenario.page = page;
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto('file://' + path.join(DIST, 'inkweight.html'));
  const click = async (sel) => { await page.waitForSelector(sel, { state: 'visible' }); await ready(page); await page.click(sel); };
  await click('#btnRing');
  await page.selectOption('#seat2Type', 'human');
  await page.selectOption('#seat3Type', 'none');
  note('setup note: ' + (await page.locator('#ringSetupNote').textContent()));
  await page.screenshot({ path: path.join(SHOTS, 'duo-01-setup.png') });
  await click('#ringGo');
  await page.waitForSelector('#scrPass:not([hidden])');
  note('hand-over: ' + (await page.locator('#passTitle').textContent()));
  await page.screenshot({ path: path.join(SHOTS, 'duo-02-handover.png') });
  await click('#passGo');
  await click('#drawHintOk');
  const box = await page.locator('#drawCanvas').boundingBox();
  const c = box.width / 32;
  const line = async (x0, y0, x1, y1) => {
    await ready(page);
    await page.mouse.move(box.x + (x0 + 0.5) * c, box.y + (y0 + 0.5) * c);
    await page.mouse.down();
    await page.mouse.move(box.x + (x1 + 0.5) * c, box.y + (y1 + 0.5) * c, { steps: 8 });
    await page.mouse.up();
  };
  await line(16, 4, 16, 26);
  await line(10, 20, 22, 20);
  await click('#drawDone');
  await page.waitForSelector('#scrPass:not([hidden])');
  await click('#passGo');
  // player 2 draws too little and lets the clock run out
  await line(15, 15, 18, 15);
  note('player 2 waits for the clock (30 s) with: ' + (await page.locator('#drawMsg').textContent()));
  await page.waitForSelector('#scrPass:not([hidden])', { timeout: 40000 });
  note('time-out notice: ' + (await page.locator('#passTitle').textContent()) + ' ' + (await page.locator('#passText').textContent()));
  await page.screenshot({ path: path.join(SHOTS, 'duo-03-timeout.png') });
  await click('#passGo');
  await page.waitForSelector('#fightOverlay:not([hidden])');
  await sleep(600);
  await click('#ovPrimary');
  await sleep(2400);
  const pos = () => page.evaluate(() => 0);
  await pos();
  await page.keyboard.down('KeyD');       // player 1 zone
  await page.keyboard.down('ArrowLeft');  // player 2 zone
  await sleep(900);
  await page.keyboard.press('KeyF');
  await page.keyboard.press('Enter');
  await sleep(500);
  await page.screenshot({ path: path.join(SHOTS, 'duo-04-fight.png') });
  note('hud: ' + (await page.locator('#fightHud').innerText()).replace(/\s+/g, ' '));
  await page.keyboard.up('KeyD');
  await page.keyboard.up('ArrowLeft');
  // leaving needs two taps
  await click('#fightQuit');
  if (!(await page.locator('#scrFight').isVisible())) throw new Error('one tap on Ende left the fight');
  await click('#fightQuit');
  await page.waitForSelector('#scrStart:not([hidden])');
  await context.close();
  if (errors.length) throw new Error('console problems: ' + errors.join(' | '));
  return { rounds: 0, waves: 0 };
}


// The single fixes of INK-WEB-V2, each with its own assertion (phone, touch).
async function runChecks(browser) {
  const name = 'checks';
  const done = [];
  const note = (s) => console.log('[' + name + '] ' + s);
  const ok = (s) => { done.push(s); note('ok: ' + s); };
  const context = await browser.newContext({ viewport: { width: 400, height: 780 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  runScenario.errors = errors;
  runScenario.page = page;
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('request', (r) => { if (!r.url().startsWith('file:')) requests.push(r.url()); });
  const url = 'file://' + path.join(DIST, 'inkweight.html');
  await page.goto(url);
  await page.waitForSelector('#btnRing');
  const cdp = await context.newCDPSession(page);
  const shot = async (label) => { await page.screenshot({ path: path.join(SHOTS, 'checks-' + label + '.png') }); note('screenshot checks-' + label + '.png'); };
  const press = async (sel) => { await page.waitForSelector(sel, { state: 'visible' }); await ready(page); await page.tap(sel); };
  const visible = (id) => page.evaluate((i) => !document.getElementById(i).hidden, id);
  const text = (id) => page.evaluate((i) => document.getElementById(i).textContent, id);
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y]) => ({ x, y })) });
  const cellPoint = async (x, y) => {
    const box = await page.locator('#drawCanvas').boundingBox();
    return [box.x + (x + 0.5) * box.width / 32, box.y + (y + 0.5) * box.width / 32];
  };
  const stroke = async (cells, steps) => {
    await ready(page);
    const n = steps || 6;
    const pts = [];
    for (const c of cells) pts.push(await cellPoint(c[0], c[1]));
    await touch('touchStart', [pts[0]]);
    for (let i = 1; i < pts.length; i++) {
      for (let k = 1; k <= n; k++) await touch('touchMove', [[pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k / n, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k / n]]);
    }
    await touch('touchEnd', []);
    await sleep(150);
  };
  // two taps on the same spot, 120 ms apart, like a nervous finger
  const doubleTap = async (sel) => {
    await page.waitForSelector(sel, { state: 'visible' });
    await ready(page);
    const b = await page.locator(sel).boundingBox();
    const x = b.x + b.width / 2;
    const y = b.y + b.height / 2;
    await page.touchscreen.tap(x, y);
    await sleep(120);
    await page.touchscreen.tap(x, y);
    await sleep(120);
    await page.touchscreen.tap(x, y);
  };
  const leaveDrawing = async () => {
    await press('#drawBack');
    // like a person: the second tap comes after the button has asked
    await page.waitForFunction(() => document.getElementById('scrDraw').hidden || document.getElementById('drawBack').textContent === 'Verwerfen?');
    await sleep(250);
    if (await visible('scrDraw')) await press('#drawBack');
  };

  // ---- important 3: double tap on "Frei zeichnen" must not open the picker
  const freeBox = await page.locator('#btnFree').boundingBox();
  await doubleTap('#btnFree');
  await sleep(500);
  if (!(await visible('scrDraw'))) throw new Error('free drawing did not open');
  if (await visible('pickLayer')) throw new Error('double tap opened the template picker');
  if (!(await page.locator('#drawHint').isVisible())) throw new Error('double tap closed the first hint');
  ok('double tap on "Frei zeichnen" (three quick taps) opens only the drawing screen');
  note('second tap landed at ' + Math.round(freeBox.x + freeBox.width / 2) + ',' + Math.round(freeBox.y + freeBox.height / 2));

  // ---- important 1: undo is called "Rückgängig", leaving asks once
  if ((await text('toolUndo')) !== 'Rückgängig') throw new Error('undo label: ' + (await text('toolUndo')));
  await press('#drawBack'); // nothing drawn: leaves at once
  await page.waitForSelector('#scrStart:not([hidden])');
  await press('#btnFree');
  await press('#drawHintOk');
  if ((await text('stElementWhy')) !== 'wächst' && !/ab \d+ %|Schwarz ist neutral/.test(await text('stElementWhy'))) throw new Error('element line');
  await stroke([[16, 6], [16, 24]]);
  await stroke([[10, 14], [22, 14]]);
  const sharp = await text('stSharp');
  if (!/^\d+,\d$/.test(sharp)) throw new Error('sharpness is not written with a comma: ' + sharp);
  ok('sharpness shows a decimal comma: ' + sharp + ' · line: "' + (await text('stSharpWhy')) + '"');

  // ---- rules version 2: a blade on a block raises the sharpness
  {
    const sharpNum = async () => parseFloat((await text('stSharp')).replace(',', '.'));
    const marks = () => page.evaluate(() => window.__inkDebug.marks);
    await press('#toolClear');
    await press('#toolBrush'); // thick
    for (const row of [14, 17, 20, 23]) await stroke([[11, row], [21, row]], 8);
    await press('#toolBrush'); // thin
    const blockSharp = await sharpNum();
    const blockMarks = await marks();
    const blockArmour = parseInt(await text('stArmour'), 10);
    const blockWhy = await text('stSharpWhy');
    await stroke([[16, 12], [16, 2]]);
    const bladeSharp = await sharpNum();
    const bladeMarks = await marks();
    note('block alone: sharpness ' + blockSharp + ', blade marks ' + blockMarks.blades + ', armour ' + blockArmour + ' ("' + blockWhy + '"); with a blade of 11 cells: sharpness ' + bladeSharp + ', blade marks ' + bladeMarks.blades + ' ("' + (await text('stSharpWhy')) + '")');
    if (blockSharp !== 1 || blockMarks.blades !== 0) throw new Error('a solid block must have sharpness 1,0 and no blade mark');
    if (!(bladeSharp >= blockSharp + 0.5)) throw new Error('a blade on a block does not raise the sharpness: ' + blockSharp + ' -> ' + bladeSharp);
    if (bladeMarks.blades !== 11 || bladeMarks.S !== 11) throw new Error('blade marks: ' + JSON.stringify(bladeMarks));
    await shot('10-block-with-blade');
    ok('a block with a blade shows a higher sharpness than the block alone (' + String(blockSharp).replace('.', ',') + ' -> ' + String(bladeSharp).replace('.', ',') + '), 11 blade marks');

    // a diagonal stroke is a blade
    await press('#toolClear');
    await stroke([[6, 26], [24, 8]], 24);
    const dm = await marks();
    const w = parseInt(await text('stWeight'), 10);
    note('diagonal stroke: weight ' + w + ', blade marks ' + dm.blades + ', core S ' + dm.S + ', sharpness ' + (await text('stSharp')));
    if (w < 30 || dm.blades !== w || dm.S !== w) throw new Error('a diagonal stroke is not all blade: ' + JSON.stringify(dm) + ' of ' + w);
    // the marks are really painted: light slashes inside the ink of the stroke
    const light = await page.evaluate(() => {
      const cv = document.getElementById('drawCanvas');
      const g = cv.getContext('2d');
      const c = cv.width / 32;
      // the cells with x + y = 32 lie on the stroke: probe their centres
      const img = g.getImageData(0, 0, cv.width, cv.height).data; // one readback
      let n = 0;
      for (let k = 6; k <= 24; k++) {
        const o = (Math.floor((32 - k + 0.5) * c) * cv.width + Math.floor((k + 0.5) * c)) * 4;
        if (img[o] > 200 && img[o + 1] > 200) n++;
      }
      return n;
    });
    note('light blade slashes found on the diagonal: ' + light + ' of 19 probed cells');
    if (light < 12) throw new Error('blade marks are not painted on a diagonal stroke');
    await shot('11-diagonal-blade');
    ok('a diagonal stroke is a blade: ' + dm.blades + ' of ' + w + ' cells carry the blade mark');

    // a thick closed shell: pocket marks and push weight above the weight
    await press('#toolClear');
    await press('#toolBrush'); // thick: walls three cells wide
    await stroke([[8, 8], [23, 8], [23, 23], [8, 23], [8, 8]], 10);
    await press('#toolBrush');
    const pm = await marks();
    const why = await text('stWeightWhy');
    note('thick closed shell: weight ' + (await text('stWeight')) + ', pocket marks ' + pm.pockets + ', core P ' + pm.P + ', line "' + why + '"');
    if (pm.pockets < 20 || pm.pockets !== pm.P) throw new Error('pocket marks do not follow the core: ' + JSON.stringify(pm));
    if (!/^Schub \d+,\d · Hohlraum schiebt mit$/.test(why) || pm.rings !== pm.pockets) throw new Error('push weight line or rings: ' + why + ' ' + JSON.stringify(pm));
    await shot('12-shell-pockets');
    ok('a thick closed shell shows pocket marks and its push weight: "' + why + '"');
    // m-5: a frame one cell thin holds nothing, so no pocket ring is drawn
    await press('#toolClear');
    await stroke([[8, 8], [23, 8], [23, 23], [8, 23], [8, 9]], 10);
    const thin = await marks();
    note('thin closed frame: pocket cells ' + thin.pockets + ', counted ' + thin.counted + ', rings drawn ' + thin.rings + ', line "' + (await text('stWeightWhy')) + '"');
    if (thin.pockets < 50 || thin.counted !== 0 || thin.rings !== 0 || (await text('stWeightWhy')) !== 'Hohlraum zählt erst mit dicker Wand') throw new Error('thin frame: ' + JSON.stringify(thin));
    ok('a thin frame shows no pocket rings and says why');

    // F-1: the element line tells the real rule in every case
    await press('#toolClear');
    await stroke([[5, 10], [18, 10]]);                 // 14 black
    await press('#toolC2'); await stroke([[5, 11], [7, 11]]);   // 3 red: 17 %
    const low = (await text('stElement')) + ' | ' + (await text('stElementWhy'));
    await stroke([[8, 11], [10, 11]]);                 // 6 red of 20: 30 %
    const one = (await text('stElement')) + ' | ' + (await text('stElementWhy'));
    await press('#toolC3'); await stroke([[12, 11], [17, 11]]); // 6 red, 6 blue of 26: tie
    const tie = (await text('stElement')) + ' | ' + (await text('stElementWhy'));
    await stroke([[12, 12], [13, 12]]);                // blue 8, red 6 of 28: Flut, although no colour alone has 30 %
    const plur = (await text('stElement')) + ' | ' + (await text('stElementWhy'));
    await press('#toolC1');
    note('element lines: [' + low + '] [' + one + '] [' + tie + '] [' + plur + ']');
    if (low !== 'Neutral | ab 30 % bunter Tinte (jetzt 17 %)') throw new Error('element below the threshold: ' + low);
    if (one !== 'Glut | schlägt Moos, verliert gegen Flut') throw new Error('element at 30 %: ' + one);
    if (tie !== 'Neutral | Gleichstand der Farben: kein Element') throw new Error('element tie: ' + tie);
    if (plur !== 'Flut | schlägt Glut, verliert gegen Moos') throw new Error('element plurality: ' + plur);
    ok('element line: below 30 % coloured ink, at 30 %, a tie and a plurality each say the truth');
    // m-3: one loose cell, singular
    await press('#toolClear');
    await stroke([[5, 10], [18, 10]]);
    await stroke([[25, 25], [25, 25]]);
    if ((await text('drawMsg')) !== '1 Kästchen hängt nicht dran und tropft ab.') throw new Error('singular drip line: ' + (await text('drawMsg')));
    ok('one loose cell: "1 Kästchen hängt nicht dran und tropft ab."');
    await press('#toolClear');
    await stroke([[16, 6], [16, 24]]);
    await stroke([[10, 14], [22, 14]]);
  }
  if ((await text('stElementWhy')) !== 'Schwarz ist neutral: kein Element') throw new Error('black ink line: ' + (await text('stElementWhy')));
  ok('black drawing: Element "' + (await text('stElement')) + '", line "' + (await text('stElementWhy')) + '"');
  await press('#drawBack');
  await sleep(200);
  if (!(await visible('scrDraw'))) throw new Error('one tap on Zurück threw the drawing away');
  if ((await text('drawBack')) !== 'Verwerfen?') throw new Error('back button does not ask: ' + (await text('drawBack')));
  note('message while asking: ' + (await text('drawMsg')));
  await shot('01-back-asks');
  await sleep(2700);
  if ((await text('drawBack')) !== 'Zurück' || (await text('stWeight')) === '0') throw new Error('asking did not time out cleanly');
  ok('"Zurück" with strokes asks first ("Verwerfen?") and keeps the drawing; without strokes it leaves at once');

  // ---- minor 3: a finger that leaves the canvas stops painting
  await press('#toolClear');
  {
    const a = await cellPoint(27, 10);
    const box = await page.locator('#drawCanvas').boundingBox();
    const outX = Math.min(398, box.x + box.width + 12);
    await touch('touchStart', [a]);
    for (let k = 1; k <= 6; k++) await touch('touchMove', [[a[0] + (outX - a[0]) * k / 6, a[1]]]);
    const y1 = (await cellPoint(27, 26))[1];
    for (let k = 1; k <= 8; k++) await touch('touchMove', [[outX, a[1] + (y1 - a[1]) * k / 8]]);
    const back = await cellPoint(27, 26);
    for (let k = 1; k <= 4; k++) await touch('touchMove', [[outX + (back[0] - outX) * k / 4, y1]]);
    await touch('touchEnd', []);
    await sleep(150);
    const w = parseInt(await text('stWeight'), 10);
    const filled = 220 - parseInt(await text('inkNum'), 10);
    note('finger left the canvas at the right edge and came back 16 rows lower: ' + filled + ' cells painted');
    if (filled > 12) throw new Error('painting went on along the edge: ' + filled + ' cells (weight ' + w + ')');
    ok('a finger outside the canvas paints nothing (' + filled + ' cells instead of a line down the edge)');
    await shot('02-finger-left-canvas');
  }

  // ---- minor 4: rotating the phone in a stroke leaves no long line
  await press('#toolClear');
  {
    const a = await cellPoint(4, 5);
    const b = await cellPoint(11, 5);
    await touch('touchStart', [a]);
    for (let k = 1; k <= 5; k++) await touch('touchMove', [[a[0] + (b[0] - a[0]) * k / 5, a[1]]]);
    await page.setViewportSize({ width: 780, height: 400 });
    await sleep(400);
    const far = await cellPoint(26, 27);
    await touch('touchMove', [far]);
    await touch('touchMove', [[far[0] + 3, far[1] + 3]]);
    await touch('touchEnd', []);
    await sleep(200);
    const filled = 220 - parseInt(await text('inkNum'), 10);
    note('stroke of 8 cells, phone rotated, finger moved on: ' + filled + ' cells painted');
    // the last sample before the rotation may arrive after it and is then dropped: 7 or 8 cells
    if (filled < 6 || filled > 8) throw new Error('rotation in a stroke painted ' + filled + ' cells, expected 7 or 8');
    await shot('03-rotated-mid-stroke');
    await page.setViewportSize({ width: 400, height: 780 });
    await sleep(400);
    ok('rotation in a stroke ends the stroke (' + filled + ' cells, no line across the sheet)');
  }

  // ---- minor 2: a clear word when the ink runs out
  await press('#toolClear');
  await press('#toolBrush');
  for (let row = 3; row <= 27; row += 3) await stroke([[3, row], [28, row]], 10);
  const inkLeft = await text('inkNum');
  const inkMsg = await text('drawMsg');
  note('ink left ' + inkLeft + ', message: ' + inkMsg);
  if (inkLeft !== '0' || inkMsg !== 'Tinte ist alle: radier etwas weg.') throw new Error('no word about empty ink');
  if (!(await page.evaluate(() => document.getElementById('drawMsg').classList.contains('warn') && document.getElementById('inkMeter').classList.contains('empty')))) throw new Error('empty ink is not marked');
  await shot('04-ink-empty');
  ok('ink at 0 says "Tinte ist alle: radier etwas weg." in the warning colour');
  await leaveDrawing();
  await page.waitForSelector('#scrStart:not([hidden])');

  // ---- important 3: double tap on "Los, zeichnen!" must not start the clock
  await press('#btnRing');
  await doubleTap('#ringGo');
  await sleep(1500);
  if (!(await visible('scrDraw'))) throw new Error('ring drawing did not open');
  const clock = await text('drawTimer');
  const w0 = await text('stWeight');
  if (clock !== '30' || w0 !== '0') throw new Error('double tap started the clock or painted: clock ' + clock + ', weight ' + w0);
  ok('double tap on "Los, zeichnen!": clock still at 30, nothing painted');

  // ---- N-1: "Ende" on the Ring drawing screen says that the game ends
  await stroke([[5, 5], [9, 5]]);
  await press('#drawBack');
  await sleep(200);
  const endAsk = (await text('drawBack')) + ' | ' + (await text('drawMsg'));
  note('Ring "Ende" first tap: ' + endAsk);
  if (endAsk !== 'Spiel beenden? | Noch einmal tippen, dann endet das ganze Spiel.' || !(await visible('scrDraw'))) throw new Error('Ring Ende asks wrongly: ' + endAsk);
  await shot('13-ring-ende-asks');
  await sleep(2700);
  if ((await text('drawBack')) !== 'Ende') throw new Error('Ende did not reset');
  await press('#toolClear');
  ok('"Ende" while drawing for the Ring asks "Spiel beenden?" and says that the whole game ends');

  // ---- weakness: a bot never has the very drawing the human just made
  const ringFigure = async () => {
    await press('#toolBrush');
    await stroke([[11, 15], [20, 15], [20, 18], [11, 18]]);
    await press('#toolBrush');
    await stroke([[15, 13], [15, 5]]);
  };
  await ringFigure();
  await press('#drawDone');
  await page.waitForSelector('#fightOverlay:not([hidden])');
  const mine = await page.evaluate(() => window.__inkDebug.ringDrawings.find((d) => d.human).data);
  // a gallery that holds exactly this drawing, and bots that always take a gallery drawing first
  await page.evaluate((data) => localStorage.setItem('inkweight.gallery.v1', JSON.stringify([{ id: 'check', kind: 'figure', data }])), mine);
  await page.reload();
  await page.waitForSelector('#btnRing');
  await page.evaluate(() => { window.__realRandom = Math.random; Math.random = () => 0.99; });
  await press('#btnRing');
  await press('#ringGo');
  await page.waitForSelector('#scrDraw:not([hidden])');
  const firstPick = await page.evaluate((data) => window.__inkDebug.ringBotPicks.filter((d) => d === data).length, mine);
  await ringFigure();
  await press('#drawDone');
  await page.waitForSelector('#fightOverlay:not([hidden])');
  const after = await page.evaluate((data) => ({
    human: window.__inkDebug.ringDrawings.filter((d) => d.human && d.data === data).length,
    bots: window.__inkDebug.ringDrawings.filter((d) => !d.human && d.data === data).length,
  }), mine);
  await page.evaluate(() => { Math.random = window.__realRandom; });
  note('bots that first took the gallery copy of my drawing: ' + firstPick + '; I drew it again: ' + after.human + '; bots with it in the line-up: ' + after.bots);
  if (firstPick < 1 || after.human !== 1) throw new Error('the bot test did not set up the identical case');
  if (after.bots !== 0) throw new Error('a bot has the same drawing as the human');
  await shot('05-lineup-no-twin');
  ok('a bot that had picked a drawing identical to mine got another one before the line-up');

  // ---- weakness: ink stains survive a resize in a fight
  await sleep(500);
  await press('#ovPrimary');
  await sleep(2200);
  await page.evaluate(() => { window.__inkDebug.speed = 8; });
  let stainsBefore = 0;
  for (let i = 0; i < 40 && stainsBefore === 0; i++) { await sleep(250); stainsBefore = await page.evaluate(() => window.__inkDebug.stainInk()); }
  await page.evaluate(() => { window.__inkDebug.speed = 0.02; });
  await sleep(100);
  stainsBefore = await page.evaluate(() => window.__inkDebug.stainInk());
  await page.setViewportSize({ width: 780, height: 400 });
  await sleep(500);
  const stainsAfter = await page.evaluate(() => window.__inkDebug.stainInk());
  await shot('06-fight-sideways-stains');
  await page.setViewportSize({ width: 400, height: 780 });
  await sleep(400);
  const stainsBack = await page.evaluate(() => window.__inkDebug.stainInk());
  await page.evaluate(() => { window.__inkDebug.speed = 1; });
  note('stained pixels before the rotation ' + stainsBefore + ', after ' + stainsAfter + ', rotated back ' + stainsBack);
  const fightOver = await visible('fightOverlay');
  if (stainsBefore === 0) throw new Error('no stain appeared, nothing tested');
  if (!fightOver && (stainsAfter < stainsBefore || stainsBack < stainsAfter)) throw new Error('stains were lost by the resize');
  ok('ink stains survive turning the phone in a fight (' + stainsBefore + ' -> ' + stainsAfter + ' -> ' + stainsBack + ' stained pixels)');
  await page.reload();
  await page.waitForSelector('#btnRing');

  // ---- minor 7 and weakness: stakes, and both ways to lose a solo run
  const startSolo = async (bigEnemy) => {
    await press('#btnSolo');
    await press('#soloC2');
    await page.waitForSelector('#scrDraw:not([hidden])');
    await ringFigure();
    await press('#drawDone');
    await sleep(200);
    await stroke([[16, 8], [16, 22]]);
    await stroke([[10, 15], [22, 15]]);
    await press('#drawDone');
    await sleep(200);
    if (bigEnemy) {
      await press('#toolBrush');
      for (let row = 6; row <= 24; row += 3) await stroke([[8, row], [24, row]], 8);
    } else {
      await press('#toolBrush');
      await stroke([[14, 14], [17, 14], [17, 16], [14, 16]]);
    }
  };
  await startSolo(true);
  const readStakes = async () => {
    const out = [];
    for (let i = 0; i < 3; i++) {
      await press('#stake' + i);
      out.push(await page.evaluate((k) => { const b = document.getElementById('stake' + k); return (b.disabled ? '[aus] ' : '') + b.textContent + ' -> ' + document.getElementById('stakeNote').textContent; }, i));
    }
    await press('#stake0');
    return out;
  };
  const stakes = await readStakes();
  note('stakes for a big enemy in wave 1: ' + stakes.join(' | '));
  // a big enemy comes alone at every stake; the stakes still differ honestly
  if (stakes.some((t) => /^\[aus\]/.test(t))) throw new Error('a stake is switched off');
  if (!/Grundstärke|−\d+ % Panzer/.test(stakes[0]) || /Schaden/.test(stakes[0])) throw new Error('stake x1 text: ' + stakes[0]);
  if (!/\+25 % Schaden, \+10 % Tempo/.test(stakes[1]) || !/\+50 % Schaden, \+20 % Tempo/.test(stakes[2])) throw new Error('higher stakes do not say what they do');
  const loot = stakes.map((t) => parseInt((t.match(/(\d+) Beute/) || [0, '0'])[1], 10));
  if (!(loot[0] < loot[1] && loot[1] < loot[2])) throw new Error('loot does not grow with the stake: ' + loot.join(' '));
  // what the page promises is what the core does
  const promise = await page.evaluate(() => {
    const d = window.__inkDebug;
    return d.tuning.solo.stakeDamageMult.join(' ') + ' / ' + d.tuning.solo.stakeSpeedMult.join(' ');
  });
  if (promise !== '1 1.25 1.5 / 1 1.1 1.2') throw new Error('tuning changed, adapt the check: ' + promise);
  await shot('07-stakes-honest');
  ok('every stake says what it does (more loot, harder hits, more speed, tougher or weaker copies)');
  // N-1: "Ende" on the solo enemy screen says that the run ends
  await press('#drawBack');
  await sleep(200);
  const runAsk = (await text('drawBack')) + ' | ' + (await text('stakeNote'));
  note('solo enemy "Ende" first tap: ' + runAsk);
  if (runAsk !== 'Lauf beenden? | Noch einmal tippen, dann endet der ganze Lauf.' || !(await visible('scrDraw'))) throw new Error('solo Ende asks wrongly: ' + runAsk);
  await shot('14-solo-ende-asks');
  await sleep(2700);
  if (!/^×1: Gegner/.test(await text('stakeNote'))) throw new Error('stake note did not come back: ' + (await text('stakeNote')));
  ok('"Ende" on the solo enemy screen asks "Lauf beenden?" and says that the whole run ends');
  await press('#drawDone');
  await page.waitForSelector('#scrFight:not([hidden])');
  await sleep(2400);
  await page.evaluate(() => { window.__inkDebug.run.world.bodies[0].hp = 0; });
  await page.waitForSelector('#fightOverlay:not([hidden])');
  const lossA = (await text('ovTitle')) + ' | ' + (await page.locator('#ovBody').innerText()).replace(/\s+/g, ' ');
  const hudSolo = (await page.locator('#fightHud').innerText()).replace(/\s+/g, ' ');
  if (!/Beutel \d+/.test(hudSolo) || /Tinte \d+/.test(hudSolo)) throw new Error('solo HUD still calls the purse Tinte: ' + hudSolo);
  note('loss by armour (hero armour set to 0 through the debug hook): ' + lossA);
  if (!/^Aus und vorbei \| Dein Panzer ist zerbrochen \(Welle 1 von 5\)/.test(lossA) || !/Geschaffte Wellen: 0 von 5/.test(lossA)) throw new Error('armour loss screen is wrong');
  await sleep(300);
  await shot('08-solo-lost-armour');
  ok('solo loss by armour shows its result screen');
  await sleep(300);
  await press('#ovPrimary'); // "Nochmal"
  await page.waitForSelector('#scrSoloIntro:not([hidden])');
  await press('#soloIntroBack');
  await startSolo(false);
  await press('#drawDone');
  await page.waitForSelector('#scrFight:not([hidden])');
  await sleep(2400);
  await page.evaluate(() => { const d = window.__inkDebug; d.run.tick = d.tuning.solo.waveMaxTicks - 240; });
  await sleep(700);
  const hudLate = (await page.locator('#fightHud').innerText()).replace(/\s+/g, ' ');
  note('HUD shortly before the time limit: ' + hudLate);
  await page.waitForSelector('#fightOverlay:not([hidden])', { timeout: 20000 });
  const lossT = (await text('ovTitle')) + ' | ' + (await page.locator('#ovBody').innerText()).replace(/\s+/g, ' ');
  note('loss by time (fight clock set to 4 s before the limit through the debug hook): ' + lossT);
  if (!/^Aus und vorbei \| Die Zeit ist um/.test(lossT)) throw new Error('time loss screen is wrong');
  if (!/noch \d+ s/.test(hudLate)) throw new Error('HUD does not count the last seconds');
  await sleep(300);
  await shot('09-solo-lost-time');
  ok('solo loss by time shows its result screen');
  await sleep(300);
  await press('#ovSecondary');
  await page.waitForSelector('#scrStart:not([hidden])');

  await context.close();
  if (requests.length) throw new Error('network requests: ' + requests.join(', '));
  if (errors.length) throw new Error('console problems: ' + errors.join(' | '));
  return done.length;
}

// Correction round 1 of INK-WEB-V3: the drawing canvas keeps its rectangle
// from before the first stroke, through it and after it on every drawing
// screen (400 x 780, 400 x 660 and sideways); the solo enemy screen fits a
// short phone; a shop tap works while the steering finger is still down.
async function runStable(browser) {
  const name = 'stable';
  const note = (s) => console.log('[' + name + '] ' + s);
  let screens = 0;
  for (const size of [{ width: 400, height: 780 }, { width: 400, height: 660 }, { width: 780, height: 400 }]) {
    const tag = size.width + 'x' + size.height;
    const context = await browser.newContext({ viewport: size, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    const errors = [];
    runScenario.errors = errors;
    runScenario.page = page;
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    await page.goto('file://' + path.join(DIST, 'inkweight.html'));
    await page.waitForSelector('#btnRing');
    const cdp = await context.newCDPSession(page);
    const press = async (sel) => { await page.waitForSelector(sel, { state: 'visible' }); await ready(page); await page.tap(sel); };
    const rect = () => page.evaluate(() => { const r = document.getElementById('drawCanvas').getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map((v) => Math.round(v * 10) / 10).join(' '); });
    const pt = async (x, y) => { const b = await page.locator('#drawCanvas').boundingBox(); return { x: b.x + (x + 0.5) * b.width / 32, y: b.y + (y + 0.5) * b.width / 32 }; };
    const line = async (x0, y0, x1, y1, during) => {
      await ready(page);
      const a = await pt(x0, y0); const b = await pt(x1, y1);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [a] });
      for (let k = 1; k <= 8; k++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: a.x + (b.x - a.x) * k / 8, y: a.y + (b.y - a.y) * k / 8 }] });
      const r = during ? await rect() : '';
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await sleep(150);
      return r;
    };
    // one drawing screen: rectangle before, in the first stroke, after it, and after a full figure
    const stable = async (label, withColour) => {
      await page.waitForSelector('#scrDraw:not([hidden])');
      await ready(page);
      await sleep(250);
      const before = await rect();
      const during = await line(16, 4, 16, 16, true);
      const after = await rect();
      await press('#toolBrush');
      await line(11, 16, 21, 16); await line(11, 19, 21, 19);
      await press('#toolBrush');
      if (withColour) { await press(withColour); await line(11, 21, 21, 21); await press('#toolC1'); }
      await line(3, 29, 5, 29); // a loose bit: the warning line appears
      const full = await rect();
      const fit = await page.evaluate(() => { const b = document.getElementById('drawDone').getBoundingClientRect(); const s = document.getElementById('scrDraw'); return { bottom: Math.round(b.bottom), ih: window.innerHeight, scroll: s.scrollHeight - s.clientHeight }; });
      note(tag + ' ' + label + ': canvas ' + before + ' | in the first stroke ' + during + ' | after it ' + after + ' | full figure ' + full + ' | main button bottom ' + fit.bottom + ' of ' + fit.ih + ', scroll ' + fit.scroll);
      if (before !== during || before !== after || before !== full) throw new Error('the canvas moved on ' + label + ' at ' + tag);
      if (fit.bottom > fit.ih || fit.scroll > 0) throw new Error('main button outside the window on ' + label + ' at ' + tag);
      const side = Number(before.split(' ')[2]);
      if (side < 190) throw new Error('canvas only ' + side + ' px on ' + label + ' at ' + tag);
      screens++;
      if (label === 'solo enemy' || label === 'free drawing') await page.screenshot({ path: path.join(SHOTS, 'stable-' + tag + '-' + label.replace(/ /g, '-') + '.png') });
    };
    await press('#btnFree');
    await press('#drawHintOk');
    await stable('free drawing', '#toolC2');
    await press('#drawDone');
    await press('#galBack');
    await press('#btnRing'); await press('#ringGo');
    await stable('ring drawing', '#toolC3');
    await press('#drawBack'); await sleep(300); await press('#drawBack');
    await page.waitForSelector('#scrStart:not([hidden])');
    await press('#btnSolo'); await press('#soloC2');
    await stable('solo hero', '#toolC2');
    await press('#drawDone');
    await sleep(300);
    await stable('solo weapon', null);
    await press('#toolClear');
    await line(16, 8, 16, 22); await line(10, 15, 22, 15);
    await press('#drawDone');
    await sleep(300);
    await stable('solo enemy', null);
    const noteText = await page.locator('#stakeNote').textContent();
    if (!/^×1: Gegner .* · 3 Kästchen tropfen ab$/.test(noteText)) throw new Error('stake line with the drip warning on the enemy screen: ' + noteText);
    if (size.height === 780) {
      // m-7: the steering finger is still down when the shop opens; another finger buys
      await press('#toolClear');
      await press('#toolBrush'); await line(14, 14, 18, 14); await line(14, 17, 18, 17); await press('#toolBrush');
      await press('#drawDone');
      await page.waitForSelector('#scrFight:not([hidden])');
      await sleep(2600);
      const st = await page.locator('#fightStage').boundingBox();
      const stick = { x: st.x + st.width * 0.4, y: st.y + st.height * 0.7, id: 0 };
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [stick] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: stick.x + 30, y: stick.y, id: 0 }] });
      await sleep(400);
      await page.evaluate(() => { const r = window.__inkDebug.run; r.world.bodies[0].hp = r.world.bodies[0].maxHp * 0.5; for (let i = 1; i < r.world.bodies.length; i++) r.world.bodies[i].hp = 0; });
      await page.waitForSelector('#scrShop:not([hidden])', { timeout: 20000 });
      await ready(page);
      await sleep(300);
      const info = await page.locator('#shopInfo').textContent();
      if (!/Dein Panzer heilt nicht von selbst/.test(info)) throw new Error('the shop does not say that armour does not heal: ' + info);
      const hb = await page.locator('#shopHeal').boundingBox();
      const tap = { x: hb.x + hb.width / 2, y: hb.y + hb.height / 2, id: 1 };
      const held = { x: stick.x + 30, y: stick.y, id: 0 };
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [held, tap] });
      await sleep(60);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [tap] });
      await sleep(500);
      const msg = await page.locator('#shopMsg').textContent();
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      note('shop with the steering finger still down, second finger on "Flicken": "' + msg + '" | ' + info);
      if (msg !== 'Geflickt.') throw new Error('a tap with a second finger did not buy while the steering finger was down');
      await page.screenshot({ path: path.join(SHOTS, 'stable-shop.png') });
    }
    await context.close();
    if (errors.length) throw new Error('console problems: ' + errors.join(' | '));
  }
  return screens;
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const list = which === 'all' ? ['phone', 'landscape', 'desktop', 'artifact', 'duo', 'checks', 'stable'] : [which];
  const browser = await chromium.launch();
  let failed = 0;
  for (const name of list) {
    const t0 = Date.now();
    try {
      if (name === 'duo') {
        await runDuo(browser);
        console.log('PASS duo: two humans drew in turns, a drawing timed out and got a placeholder, both keyboard zones were held, leaving took two taps, 0 console errors (' + Math.round((Date.now() - t0) / 1000) + ' s)');
        continue;
      }
      if (name === 'stable') {
        const n = await runStable(browser);
        console.log('PASS stable: the canvas kept its rectangle before, in and after the first stroke on ' + n + ' drawing screens (400 x 780, 400 x 660, 780 x 400), main button always inside the window, shop tap with a second finger works, 0 console errors (' + Math.round((Date.now() - t0) / 1000) + ' s)');
        continue;
      }
      if (name === 'checks') {
        const n = await runChecks(browser);
        console.log('PASS checks: ' + n + ' single checks passed (double taps, asking before discarding, ink empty, finger off the canvas, rotation in a stroke, bot twin, stains, honest stakes, both solo loss paths; version 2: block with blade, diagonal blade, pocket marks, what Ende asks), 0 console errors, 0 network requests (' + Math.round((Date.now() - t0) / 1000) + ' s)');
        continue;
      }
      const r = await runScenario(browser, name);
      console.log('PASS ' + name + ': drew a figure, Ring match finished after ' + r.rounds + ' rounds, solo run played ' + r.waves
        + ' fights with ' + r.bought + ' different shop purchases, ' + r.rams + ' rams, rules panel read, 0 console errors, 0 network requests, no sideways scroll (' + Math.round((Date.now() - t0) / 1000) + ' s)');
    } catch (e) {
      failed++;
      try { await runScenario.page.screenshot({ path: path.join(os.tmpdir(), 'inkweight-fail-' + name + '.png') }); console.log('failure screenshot: ' + path.join(os.tmpdir(), 'inkweight-fail-' + name + '.png')); } catch (e2) { /* page gone */ }
      if (runScenario.errors && runScenario.errors.length) console.log('console problems: ' + runScenario.errors.join(' | '));
      console.log('FAIL ' + name + ': ' + (e && e.stack ? e.stack.split('\n').slice(0, 4).join(' / ') : e));
    }
  }
  await browser.close();
  console.log(failed === 0 ? 'VERIFY OK ' + list.join(' ') : 'VERIFY FAILED ' + failed + ' of ' + list.length);
  process.exit(failed === 0 ? 0 : 1);
})();
