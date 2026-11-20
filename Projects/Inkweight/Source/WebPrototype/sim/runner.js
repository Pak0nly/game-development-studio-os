// Headless runners shared by the balance simulation, the golden generator and
// the tests. Everything here only calls the public core API.

import {
  ringCreateMatch, ringStartRound, ringStep, ringBotInputs,
  soloCreateRun, soloStartWave, soloStartBoss, soloStep, soloUpgrade, botHeroInput, SOLO_WAVES,
} from '../core/index.js';

// Play one bot-only round to its end. onTick(match) is called after each tick.
export function playRingRound(tuning, match, figures, onTick) {
  ringStartRound(tuning, match, figures);
  while (match.phase === 'fight') {
    ringStep(tuning, match, ringBotInputs(tuning, match, null));
    if (onTick) onTick(match);
  }
  return match.roundWinner;
}

// Play one single bot round between the given figures. slotShift rotates the
// start slots. styles (optional) gives the bot style per seat (0 rusher,
// 1 circler). Returns { winner, ticks, outReason }.
export function playSingleRound(tuning, figures, seed, slotShift, styles) {
  const match = ringCreateMatch(tuning, figures.length, seed);
  match.round = slotShift;
  if (styles) for (let i = 0; i < figures.length; i++) match.botStyle[i] = styles[i];
  playRingRound(tuning, match, figures, null);
  return { winner: match.roundWinner, ticks: match.tick, outReason: match.outReason.slice() };
}

// Play a whole bot match (same figures every round). Returns the match.
export function playRingMatch(tuning, figures, seed, onTick, onRoundEnd, styles) {
  const match = ringCreateMatch(tuning, figures.length, seed);
  if (styles) for (let i = 0; i < figures.length; i++) match.botStyle[i] = styles[i];
  while (match.phase !== 'matchOver') {
    playRingRound(tuning, match, figures, onTick);
    if (onRoundEnd) onRoundEnd(match);
  }
  return match;
}

// Play the current solo fight with the hero bot until it ends.
export function playSoloFight(tuning, run, style, onTick) {
  while (run.phase === 'fight') {
    soloStep(tuning, run, botHeroInput(tuning, run, style));
    if (onTick) onTick(run);
  }
}

// Bot-driven solo run. plan = { style, waves: [{ enemy: cells, stake, upgrade }], boss }
// upgrade: null | 'heal' | 'colour2' | 'colour3' | 'colour4' (tried after the wave),
// or { kind: 'heroInk' | 'weaponInk', cells } for a redraw with more ink.
// Every result row carries `upgrade`: '' when none was tried, else 'ok' or the
// reason soloUpgrade returned. Returns per-wave results; stops at death.
export function playSoloRun(tuning, seed, heroCells, weaponCells, W, H, startColour, plan, onTick, onFightEnd) {
  const run = soloCreateRun(tuning, seed, heroCells, weaponCells, W, H, startColour);
  const results = [];
  const note = () => {
    results.push({ wave: results.length, phase: run.phase, endReason: run.endReason, ticks: run.tick, copies: run.copies, heroHp: run.heroHp, heroMaxHp: run.heroMaxHp, score: run.score, wallet: run.wallet, upgrade: '' });
    if (onFightEnd) onFightEnd(run);
  };
  for (let w = 0; w < plan.waves.length && w < SOLO_WAVES; w++) {
    const pw = plan.waves[w];
    soloStartWave(tuning, run, pw.enemy, pw.stake);
    playSoloFight(tuning, run, plan.style, onTick);
    note();
    if (run.phase !== 'cleared') return { run, results };
    let up = null;
    if (pw.upgrade === 'heal') up = soloUpgrade(tuning, run, 'heal', null);
    else if (pw.upgrade === 'colour2') up = soloUpgrade(tuning, run, 'colour', 2);
    else if (pw.upgrade === 'colour3') up = soloUpgrade(tuning, run, 'colour', 3);
    else if (pw.upgrade === 'colour4') up = soloUpgrade(tuning, run, 'colour', 4);
    else if (pw.upgrade && pw.upgrade.kind) up = soloUpgrade(tuning, run, pw.upgrade.kind, pw.upgrade.cells);
    if (up !== null) results[results.length - 1].upgrade = up === '' ? 'ok' : up;
  }
  if (plan.boss && run.phase === 'cleared' && run.wave === SOLO_WAVES) {
    soloStartBoss(tuning, run);
    playSoloFight(tuning, run, plan.style, onTick);
    note();
  }
  return { run, results };
}
