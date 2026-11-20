// Scripted solo run in the built page (Work Order INK-WEB-V4, task 5). Not
// part of the page.
//
//   node build/solo_play.cjs <stake index 0..2> <hero style: brawl | kite> <shots folder> [speed-up, default 4]
//
// Hero: a 10 x 10 block with a sword. Weapon: a thin cross. Enemy in every
// wave: a heavy 14 x 15 block (210 ink). The hero is steered through the
// measurement hook window.__inkDebug.soloPilot by the core's own hero bot
// (brawl: runs into the nearest enemy and sprints; kite: keeps away and lets
// the weapon work). In every pause it buys "Flicken" when armour is missing.
// It compares what the page says with what the core does: the touch shown
// under the stake buttons against the enemy bodies of the fight, the weapon
// rows against the real throw hits, and the boss fight against "nobody
// crushes there".
const path = require('path');
const { chromium } = require('playwright');
const PAGE = 'file://' + path.resolve(__dirname, '../dist/inkweight.html');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const stake = parseInt(process.argv[2], 10) || 0;
  const style = process.argv[3] === 'kite' ? 0 : 1;
  const shots = process.argv[4];
  const speed = parseFloat(process.argv[5]) || 4;
  if (!shots) throw new Error('shots folder (outside the repository) is required');
  const tag = 'solo-x' + ['1', '1.5', '2'][stake] + '-' + (style ? 'brawl' : 'kite');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 400, height: 780 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  const log = (t) => console.log('[' + tag + '] ' + t);
  const shot = (name) => page.screenshot({ path: path.join(shots, tag + '-' + name + '.png') });
  const ready = () => page.waitForFunction(() => !window.__inkDebug.inputBlocked());
  const txt = (id) => page.evaluate((i) => document.getElementById(i).textContent, id);
  const rect = async (x0, y0, w, h) => {
    const box = await page.locator('#drawCanvas').boundingBox();
    const c = box.width / 32;
    for (let y = y0; y < y0 + h; y++) {
      await page.mouse.move(box.x + (x0 + 0.5) * c, box.y + (y + 0.5) * c);
      await page.mouse.down();
      if (w > 1) await page.mouse.move(box.x + (x0 + w - 0.5) * c, box.y + (y + 0.5) * c, { steps: w * 2 });
      await page.mouse.up();
    }
  };
  await page.goto(PAGE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('#btnSolo');
  await ready();
  await page.click('#btnSolo');
  await ready();
  await page.click('#soloC3');
  await page.waitForSelector('#scrDraw:not([hidden])');
  await ready();
  await sleep(200);
  await shot('00-first-hint');
  log('first-run hint: ' + (await page.locator('#drawHint').innerText()).replace(/\s+/g, ' '));
  await page.click('#drawHintOk');
  await rect(11, 14, 10, 10);
  await rect(16, 2, 1, 12);
  log('hero: Gewicht ' + (await txt('stWeight')) + ' Panzer ' + (await txt('stArmour')) + ' Schärfe ' + (await txt('stSharp')) + ' Tempo ' + (await txt('stSpeed')));
  await page.click('#drawDone');
  await page.waitForFunction(() => /Wurfwaffe/.test(document.getElementById('drawTitle').textContent));
  await ready();
  log('hint on the second drawing screen visible: ' + (await page.locator('#drawHint').isVisible()));
  await rect(16, 8, 1, 15);
  await rect(10, 15, 13, 1);
  const weaponSharp = await txt('stSharp');
  log('weapon rows: Gewicht ' + (await txt('stWeight')) + ' "' + (await txt('stWeightWhy')) + '" | ' + (await txt('stArmourName')) + ' ' + (await txt('stArmour')) + ' "' + (await txt('stArmourWhy')) + '" | Schärfe '
    + weaponSharp + ' "' + (await txt('stSharpWhy')) + '" | ' + (await txt('stSpeedName')) + ' ' + (await txt('stSpeed')) + ' "' + (await txt('stSpeedWhy')) + '" | ' + (await txt('drawMsg')));
  await shot('01-weapon');
  await page.click('#drawDone');
  await page.evaluate(({ style, speed }) => {
    const d = window.__inkDebug;
    d.speed = speed;
    d.soloPilot = (run) => d.core.botHeroInput(d.tuning, run, style);
    d.shotHits = [];
    d.onFightEvent = (ev) => { if (ev.type === 'shotHit') d.shotHits.push(ev.damage); };
  }, { style, speed });
  let outcome = '';
  for (let wave = 1; wave <= 6 && !outcome; wave++) {
    const boss = wave === 6;
    let noteText = '';
    if (!boss) {
      await page.waitForFunction((w) => new RegExp('Welle ' + w).test(document.getElementById('drawTitle').textContent) && !document.getElementById('scrDraw').hidden, wave);
      await ready();
      if (wave === 1) await rect(9, 9, 14, 15);
      await page.click('#stake' + stake);
      noteText = await txt('stakeNote');
      log('wave ' + wave + ' enemy Gewicht ' + (await txt('stWeight')) + ', stake buttons: ' + (await page.evaluate(() => [0, 1, 2].map((i) => document.getElementById('stake' + i).innerText.replace(/\s+/g, ' ')).join(' | '))) + ' || ' + noteText);
      if (wave === 1 || wave === 3) await shot('02-enemy-wave' + wave);
      await page.click('#drawDone');
    } else {
      await page.waitForFunction(() => !document.getElementById('fightOverlay').hidden && /Endgegner/.test(document.getElementById('ovTitle').textContent));
      log('boss panel: ' + (await page.locator('#ovBody').innerText()).replace(/\s+/g, ' '));
      await shot('04-boss-panel');
      await sleep(550);
      await page.click('#ovPrimary');
    }
    await page.waitForFunction(() => window.__inkDebug.run.phase === 'fight');
    const start = await page.evaluate(() => {
      const d = window.__inkDebug;
      const t = d.tuning;
      const b = d.run.world.bodies;
      return { hero: b[0].hp, enemies: b.slice(1).map((e) => ({ N: e.fig.stats.N, hp: Math.round(e.hp), speed: +e.topSpeed.toFixed(2), crush: +e.bluntBonus.toFixed(3),
        blunt: +((t.stats.bluntDamage + e.bluntBonus) * e.damageMult * d.core.elementMultiplier(t, e.fig.stats.element, b[0].fig.stats.element)).toFixed(3) })) };
    });
    log((boss ? 'boss fight' : 'wave ' + wave) + ' starts: hero armour ' + start.hero.toFixed(0) + ', enemies ' + JSON.stringify(start.enemies));
    if (!boss) {
      const shown = parseFloat(((noteText.match(/Treffer (?:bis )?(\d+,\d)/) || [0, 'NaN'])[1]).replace(',', '.'));
      const real = start.enemies[0].blunt;
      if (!(Math.abs(shown - real) <= 0.051)) throw new Error('the page shows a touch of ' + shown + ', the enemy body does ' + real);
      const shownSpeed = parseFloat(((noteText.match(/Tempo (\d+,\d)/) || [0, 'NaN'])[1]).replace(',', '.'));
      const shownArmour = parseInt((noteText.match(/Panzer (\d+)/) || [0, 'NaN'])[1], 10);
      if (!(Math.abs(shownSpeed - start.enemies[0].speed) <= 0.051) || !(Math.abs(shownArmour - start.enemies[0].hp) <= 1)) throw new Error('shown enemy speed or armour differs from the body: ' + noteText);
      log('  shown touch ' + shown + ', Tempo ' + shownSpeed + ', Panzer ' + shownArmour + ' = enemy body: blunt touch ' + real + ', top speed ' + start.enemies[0].speed + ', armour ' + start.enemies[0].hp);
    } else if (start.enemies.some((e) => e.crush !== 0)) throw new Error('a body of the boss fight crushes');
    if (wave === 1 || boss) { await sleep(2500); await shot((boss ? '05-boss' : '03-wave1') + '-fight'); }
    const t0 = Date.now();
    await page.waitForFunction(() => window.__inkDebug.run.phase !== 'fight', null, { timeout: 400000 });
    const end = await page.evaluate(() => { const r = window.__inkDebug.run; return { phase: r.phase, hp: r.heroHp, max: r.heroMaxHp, ticks: r.tick, wallet: r.wallet, score: r.score, reason: r.endReason }; });
    log((boss ? 'boss fight' : 'wave ' + wave) + ' ends: ' + end.phase + ' after ' + (end.ticks / 60).toFixed(0) + ' s of fight (' + Math.round((Date.now() - t0) / 1000) + ' s real), hero armour '
      + Math.max(0, end.hp).toFixed(0) + ' of ' + end.max.toFixed(0) + ' (lost ' + (start.hero - Math.max(0, end.hp)).toFixed(0) + '), Beutel ' + end.wallet);
    if (end.phase === 'dead' || end.phase === 'won') {
      await page.waitForFunction(() => !document.getElementById('fightOverlay').hidden);
      outcome = (await txt('ovTitle')) + ' | ' + (await page.locator('#ovBody').innerText()).replace(/\s+/g, ' ');
      await shot('06-end');
      break;
    }
    await page.waitForSelector('#scrShop:not([hidden])');
    await ready();
    if (wave === 1) await shot('03-shop');
    if (!(await page.locator('#shopHeal').isDisabled())) { await page.click('#shopHeal'); log('  shop: ' + (await txt('shopMsg')) + ' ' + (await txt('shopInfo')).split('.')[0]); }
    else log('  shop: nothing bought (' + (await txt('shopInfo')).split('.')[0] + ')');
    await ready();
    await page.click('#shopNext');
  }
  const hits = await page.evaluate(() => window.__inkDebug.shotHits);
  const distinct = Array.from(new Set(hits.map((h) => h.toFixed(3))));
  log('weapon hits: ' + hits.length + ', damage values ' + distinct.join(' / ') + ' (weapon screen showed Schärfe ' + weaponSharp + ')');
  log('RESULT ' + outcome + ' | ' + errors.length + ' console errors');
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})().catch((e) => { console.error('SOLO PLAY FAILED', e); process.exit(1); });
