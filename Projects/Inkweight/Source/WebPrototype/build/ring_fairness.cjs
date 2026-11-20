// Ring fairness measurement (Work Order INK-WEB-V4, task 4). Not part of the
// page. Plays whole Ring matches in the built page through the real screens
// (setup, drawing, line-up, fight, result) with a scripted first-time player:
//
//   node build/ring_fairness.cjs [matches per drawing, default 4] [--own]
//
// The scripted player draws one of three plausible first drawings (a block
// with a sword, a stick figure, a round blob), draws the same figure again
// every round (it never uses the catch-up ink), and steers through the
// measurement hook window.__inkDebug.ringPilot: it decides every 0,2 s,
// runs at the nearest opponent from the centre side, sprints when close and
// turns back near the edge. Fights run at speed-up 8. Each drawing starts
// with an empty gallery (first-time player); with --own the gallery of the
// earlier matches is kept, so the bots start to use the player's own figures.
const path = require('path');
const { chromium } = require('playwright');
const PAGE = 'file://' + path.resolve(__dirname, '../dist/inkweight.html');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function sheet() { return new Array(32 * 32).fill(0); }
function set(c, x, y) { if (x >= 0 && x < 32 && y >= 0 && y < 32) c[y * 32 + x] = 1; }
const DRAWINGS = {
  'block with a sword': () => { const c = sheet(); for (let y = 14; y < 24; y++) for (let x = 11; x < 21; x++) set(c, x, y); for (let y = 2; y < 14; y++) set(c, 16, y); return c; },
  'stick figure': () => {
    const c = sheet();
    for (let i = 0; i < 5; i++) { set(c, 14 + i, 4); set(c, 14 + i, 8); set(c, 14, 4 + i); set(c, 18, 4 + i); }
    for (let y = 9; y < 20; y++) set(c, 16, y);
    for (let x = 10; x < 23; x++) set(c, x, 12);
    // legs as stairs, so that they hang on (cells that only touch at a corner drip off)
    for (let i = 1; i < 8; i++) { set(c, 16 - i, 19 + i); set(c, 17 - i, 19 + i); set(c, 16 + i, 19 + i); set(c, 15 + i, 19 + i); }
    return c;
  },
  'round blob': () => { const c = sheet(); for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) if ((x - 15.5) ** 2 + (y - 15.5) ** 2 <= 6.2 * 6.2) set(c, x, y); return c; },
};

// runs in the page
function installPilot() {
  let cur = { mx: 0, my: 0, dash: false };
  let next = 0;
  window.__inkDebug.ringPilot = (match, seat) => {
    const bodies = match.world.bodies;
    const me = bodies[seat];
    if (!me || !me.alive) return { mx: 0, my: 0, dash: false };
    if (match.tick < 12) next = Math.min(next, match.tick); // a new round started
    if (match.tick < next) { cur.dash = false; return cur; }
    next = match.tick + 12;
    let best = -1;
    let bd = 1e9;
    for (let i = 0; i < bodies.length; i++) {
      if (i === seat || !bodies[i].alive) continue;
      const d = Math.hypot(bodies[i].x - me.x, bodies[i].y - me.y);
      if (d < bd) { bd = d; best = i; }
    }
    if (best === -1) { cur = { mx: 0, my: 0, dash: false }; return cur; }
    const t = bodies[best];
    const tl = Math.hypot(t.x, t.y) || 1;
    const shift = Math.min(tl, me.fig.radius * 0.6);
    let mx = t.x - t.x / tl * shift - me.x;
    let my = t.y - t.y / tl * shift - me.y;
    const l = Math.hypot(mx, my) || 1;
    mx /= l; my /= l;
    const myDist = Math.hypot(me.x, me.y);
    let dash = false;
    if (myDist > match.ringRadius - 6 && myDist > 0) { mx = -me.x / myDist; my = -me.y / myDist; }
    else if (bd - me.fig.radius - t.fig.radius < 7 && me.dashCd === 0 && me.dashTicks === 0) dash = true;
    cur = { mx, my, dash };
    return cur;
  };
}

(async () => {
  const per = parseInt(process.argv[2], 10) || 4;
  const keepGallery = process.argv.includes('--own');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  let total = 0;
  let won = 0;
  for (const name of Object.keys(DRAWINGS)) {
    const cells = DRAWINGS[name]();
    await page.goto(PAGE);
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('inkweight.seenHint.v2', '1'); });
    let wonHere = 0;
    for (let m = 0; m < per; m++) {
      await page.goto(PAGE);
      await page.waitForSelector('#btnRing');
      if (!keepGallery) await page.evaluate(() => localStorage.removeItem('inkweight.gallery.v1'));
      await page.reload();
      await page.waitForSelector('#btnRing');
      await page.evaluate(installPilot);
      await page.evaluate(() => { window.__inkDebug.speed = 8; });
      await page.waitForFunction(() => !window.__inkDebug.inputBlocked());
      await page.click('#btnRing');
      await page.selectOption('#ringTime', '0');
      await page.waitForFunction(() => !window.__inkDebug.inputBlocked());
      await page.click('#ringGo');
      let lineup = '';
      let stats = '';
      let rounds = 0;
      let result = '';
      for (;;) {
        await page.waitForSelector('#scrDraw:not([hidden])');
        await page.waitForFunction(() => !window.__inkDebug.inputBlocked());
        // draw the figure cell by cell with the mouse (thin brush is the default)
        const box = await page.locator('#drawCanvas').boundingBox();
        const cell = box.width / 32;
        for (let y = 0; y < 32; y++) {
          let x = 0;
          while (x < 32) {
            if (!cells[y * 32 + x]) { x++; continue; }
            let x1 = x;
            while (x1 + 1 < 32 && cells[y * 32 + x1 + 1]) x1++;
            await page.mouse.move(box.x + (x + 0.5) * cell, box.y + (y + 0.5) * cell);
            await page.mouse.down();
            if (x1 > x) await page.mouse.move(box.x + (x1 + 0.5) * cell, box.y + (y + 0.5) * cell, { steps: Math.max(2, (x1 - x) * 2) });
            await page.mouse.up();
            x = x1 + 1;
          }
        }
        const weight = await page.locator('#stWeight').textContent();
        const want = await page.evaluate((c) => { const d = window.__inkDebug; return d.core.computeStats(c, 32, 32, d.tuning, 'figure', 220).N; }, cells);
        if (parseInt(weight, 10) !== want || want !== cells.filter((v) => v).length) throw new Error('drawing went wrong: weight ' + weight + ', wanted ' + want);
        await page.click('#drawDone');
        await page.waitForSelector('#fightOverlay:not([hidden])');
        await page.waitForFunction(() => !window.__inkDebug.inputBlocked());
        if (rounds === 0) {
          const cards = await page.evaluate(() => Array.from(document.querySelectorAll('#ovBody .card')).map((c) => c.innerText.replace(/\s+/g, ' ')));
          stats = cards[0];
          lineup = cards.slice(1).join(' || ');
          const heavy = cards.slice(1).filter((c) => parseInt((c.match(/Gewicht (\d+)/) || [0, '0'])[1], 10) >= 150).length;
          if (heavy > 1) throw new Error('two heavy bots against a single human: ' + lineup);
        }
        await sleep(550); // the panel ignores taps in its first 450 ms
        await page.click('#ovPrimary');
        await page.waitForFunction(() => !document.getElementById('fightOverlay').hidden && !document.getElementById('scrFight').hidden
          && /geht an|gewinn/.test(document.getElementById('ovTitle').textContent), null, { timeout: 120000 });
        rounds++;
        const title = await page.locator('#ovTitle').textContent();
        const score = await page.locator('#ovBody .score-big').textContent();
        if (/gewinn/.test(title)) { result = title + ' ' + score; break; }
        await page.waitForFunction(() => !window.__inkDebug.inputBlocked());
        await sleep(550); // the panel ignores taps in its first 450 ms
        await page.click('#ovPrimary');
      }
      const humanWon = /^Du gewinnst/.test(result);
      total++;
      if (humanWon) { won++; wonHere++; }
      console.log('[' + name + '] match ' + (m + 1) + ': ' + (humanWon ? 'WON ' : 'lost') + ' ' + result + ' after ' + rounds + ' rounds | me: ' + stats + ' | bots: ' + lineup);
    }
    console.log('[' + name + '] human won ' + wonHere + ' of ' + per + ' matches');
  }
  console.log('RING FAIRNESS: human won ' + won + ' of ' + total + ' matches (' + Math.round(100 * won / total) + ' %), ' + errors.length + ' console errors' + (keepGallery ? ', gallery kept' : ', empty gallery before every match'));
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})().catch((e) => { console.error('RING FAIRNESS FAILED', e); process.exit(1); });
