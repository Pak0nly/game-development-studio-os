# INK-CORE-V3 Independent Review

Independent review verdict: PASS

## Re-review after correction round 1

Candidate: commit `9acd0f7` on `a28a644`, same branch and work copy, reviewed
read-only (work copy `git status --short` clean). The verdict above is the
current one; the first review (FAIL on `a28a644`) is kept below unchanged.

### What I ran (real output)

- Changed paths `a28a644..9acd0f7`: only `Source/Shared`, `core/solo.js`,
  `core/README.md`, `tests`, `tools/gen_golden.js`, `INK_RULES_V2.md` and the
  evidence folder: inside the allowed paths. Core logic change: one line in
  `soloStartBoss` (`enemies[i].bluntBonus = enemies[i].bluntBonus *
  so.bossCrushMult`), new key `solo.bossCrushMult` 0.
- `node --test`: `# tests 71`, `# pass 71`, `# fail 0`.
  `node tools/gen_golden.js --check`: `golden files match`.
- B1, my scripted kiting hero (same script as the first review), five x1
  waves of one heavy design and the boss, 3 seeds per row: **34 of 36 boss
  fights won** (only `line vs block` lost twice), e.g.
  `v3 disc vs block won(270->89,85s) won(270->68,79s) won(270->101,89s)`.
  Version 2 rules gave 35 of 36. Back at version 2 level.
- Wave copies still crush: `disc vs block : w1x1 dmg0 | w1x1.5 dmg12 | w1x2
  dmg37 | w3x1 dmg10 | w3x1.5 dmg38 | w3x2 dmg121 | ...` (identical to the
  first review).
- Golden traces against `960c6ae`: the six duel traces and
  `ring_3_simultaneous_nearest_wins` IDENTICAL; `ring_1v1_comb_comb_deep_passes`
  and `solo_boss_heavy_no_crush` NEW; the four crowd and the six old solo
  traces changed.
- Do the new traces discriminate (regenerated in memory, one value changed)?
  `extraSeparationPasses = 7` and `= 2`: changes
  `ring_1v1_comb_comb_deep_passes` (the only duel trace that changes) plus the
  crowd and two solo traces; `crowdRelaxPasses = 0`: does not change the new
  duel trace (two bodies, as intended); `bossCrushMult = 1` and `= 0.5`:
  changes `solo_boss_heavy_no_crush` and nothing else; `enemyCrushPerInk = 0`:
  four solo traces including the new one. Both new traces discriminate, and
  the coverage table in `CHANGES_V3.md` V7 matches this.
- Won-run fragility, the same 13 single tuning changes as before: all
  required solo endings reached in all 13 (before: the won run was lost in 3).
- Records: `CHANGES_V3.md` V1 now names `InkPhysics.cs` lines 31, 134, 135
  (true, checked in the main checkout read-only); V7 no longer claims the duel
  traces check V2; V3 notes for a port (dead bodies counted, non-settling
  loop, step times) are true; `step_time.txt` gives 23.7 -> 43.6 microseconds
  per four-figure tick (my 33.6 -> 62.0 on another run; same ratio), duels
  9.9 -> 9.6. No stale sentence of the first candidate left (grep for "never
  had them", "did not change measurably", "check V2 with the duel", "Boss and
  escorts crush": only the correction note itself).
- Open points stated plainly: "x1.5 is nearly free again for heavy blunt
  designs in the bot runs (63 of 64 won, a third more score than x1)" in
  `INK_RULES_V2.md` section 8, `RULES_AS_BUILT.md` section 10 and
  `WORKER_RESULT.md`; the kiting remainder (fast hero against one heavy copy,
  0 damage at x2) in the same three places and the "what changed" note of
  `INK_RULES_V2.md`. The Worker's solo numbers (`solo_after_correction_1_summary.txt`:
  heavy x1 / x1.5 / x2 won 61 / 63 / 27 of 64, others unchanged 73 / 31 / 15
  of 96) are consistent with my kiter.
- New tests are real: the boss test checks `bluntBonus` 0 for every boss-fight
  body and that factor 1 restores the crush; the golden test regenerates the
  deep-passes trace with 7 and 2 passes and the heavy boss trace with factor 1
  and requires a difference, and requires the won run to keep half its armour.

### Status of the first review's findings

| Finding | Status |
|---|---|
| B1 boss and escort crush at x1 | Fixed (`bossCrushMult` 0), measured, test and trace |
| I1 kiting remainder understated | Corrected in the records; open point for the Human and a later order (accepted by the Director) |
| M1 C# `TurnCos`/`TurnSin` | Corrected, lines named |
| M2 duel traces do not check V2 | Corrected, new discriminating duel trace |
| M3 step time | Corrected with measured numbers |
| M4 non-settling relaxation, dead bodies counted | Written down for the port |
| M5 fragile won-run golden | Fixed (dot enemies, margin test); 13 of 13 perturbations hold |
| M6 source of the x1 drop | Written down plainly |

### Remaining findings

- **Minor (open, accepted):** with the boss crush gone, R1 now only prices x2
  in the waves; x1.5 is nearly free for heavy blunt designs (63 of 64 won,
  about a third more score than x1), and a fast kiting hero gets every stake
  free against one heavy copy. Both are recorded honestly; they are for the
  Human and a later order (for example a minimum copy count per stake).
- **Minor:** `CHANGES_V3.md` V3 cites a worst single tick of 10 ms in one run
  for four-figure rounds; still inside a 60 Hz frame, but a port running
  several worlds per frame should keep it in mind.

No blocker. The records are exact enough for the two port updates, the
balance statement is honest, and the game is not worse to play than version 2.

---

# First review (candidate `a28a644`), kept unchanged

Independent review verdict (first review): FAIL

Reviewer: independent Reviewer task (role QA Lead), not the Builder. Date
2026-11-20. Candidate: branch `worktree-agent-a4f119a8ce7fbbb21`, commits
`bd0c905`, `64ae705`, `1b85713`, `a28a644` on `960c6ae`, work copy
`/home/user/game-development-studio-os/.claude/worktrees/agent-a4f119a8ce7fbbb21`.
Reviewed read-only; nothing in the work copy or the main checkout was changed
except this file. Throwaway probes lived under `/tmp/rv3` (one of them a copy of
`core/` with a counter added to `relaxPair`; the candidate itself was never
edited).

Why FAIL, in one paragraph: everything except one point is good and exact
(tests, goldens, determinism, R2, R3, R4, the change list, an honest balance
pass). The one point is R1. The new crush also goes to the **boss and its
escorts at stake x1**, and that alone makes the boss fight with heavy blunt
enemy designs much harder at x1 than in version 2. That is the stake a first-time
player uses and the most obvious enemy drawing a beginner makes (a filled
block). The order asked for the opposite: make the stake cost something
"without making x1 unfair for a first-time player or the boss fight
impossible". The fix is small (no crush for boss and escorts, or a tuning factor
for it, see B1), but it changes a formula that both ports would copy, so it
should be made before the port updates.

## 1. What I ran (real output)

Node `/opt/node22/bin/node` (v22), inside the work copy.

- Scope: `git diff --name-only 960c6ae a28a644` filtered against the order's
  allowed paths -> no path outside (grep exit 1). `CHANGES_V2.md`: no diff.
  Work copy `git status --short`: clean.
- `node --test` in `Projects/Inkweight/Source/WebPrototype`:
  `# tests 70`, `# pass 70`, `# fail 0`, `# duration_ms 4587.2`.
- `node tools/gen_golden.js --check` -> `golden files match`.
- Golden traces, `960c6ae` against `a28a644`, trace by trace (own script):
  `ring_1v1_disc_lance`, `ring_1v1_cross_block`, `ring_1v1_scripted`,
  `ring_1v1_circler_vs_rusher`, `ring_1v1_sudden_death`,
  `ring_2_idle_simultaneous_tie`, `ring_3_simultaneous_nearest_wins` IDENTICAL;
  the four crowd traces and all six solo traces changed; no trace added or
  removed. `stat_vectors.json`: only `tuningVersion` differs. Claim confirmed.
- `Math.` use in `core/*.js`: `Math.floor` 9, `Math.imul` 2, `Math.sqrt` 24,
  nothing else; no added `Math.`, `**`, `%`, `Date` or `random` in the core diff.
- Which golden traces see each new number (regenerated in memory with one
  value changed): `extraSeparationPasses = 2` changes traces 3, 5, 7, 12, 13
  (crowd and solo only, **no duel trace**); `crowdRelaxPasses = 0` changes 3,
  4, 5, 7, 12, 13; `enemyCrushPerInk = 0` changes 12, 14, 15;
  `enemySpeedBase = 0` changes 11 to 16. Every new number is covered by at
  least one trace.
- Overlap probe (own run of `probePair` / `probeCrowd`): comb against comb,
  6 seeds `0.097% of 20580, max 0.84, run 4`; hedgehog against comb
  `0.038% of 21127, max 0.55, run 6`; 40 four-figure rounds
  `0.068% of 67575, max 0.98, run 17`. Matches the Worker's numbers.
- Crowd relaxation side effects (40 four-figure rounds, 74364 ticks,
  instrumented copy of the core): `relaxCalls 7786`, largest single push
  `0.931`, relaxation loop still pushing in its last pass in `538` of `261926`
  sub-steps, largest net relaxation move of one body in one tick `3.53`
  cells, body-ticks where the pushes sum to more than 2 cells but net to less
  than a quarter of that `314` (ping-pong inside the tick).
- Same-state comparison, relaxation on against off for one tick from the
  identical state, 20 rounds, 38346 ticks: `outsCausedVsNoRelaxSameState: 0`,
  `outsPrevented: 0`; speeds untouched (positions only, as specified).
- Visible jumps (position change per tick not explained by velocity, 30
  rounds): version 3 `over1: 780, over2: 11`; version 3 without relaxation
  `over1: 785, over2: 98`; version 2 numbers `over1: 957, over2: 155`. The
  relaxation does not add visible pops; it removes most large ones.
- Cost: four-figure rounds `v3 us/tick 62.0 / 62.8` against
  `v2 numbers us/tick 33.6 / 32.5`, worst tick `3.99 ms` against `2.36 ms`.
- Solo numbers per heavy design (own script, `soloCopies`,
  `soloWaveArmourScale`, `soloEnemyCrush`, `soloEnemySpeed`): block, disc,
  hoop2 buy 1 copy in waves 1 to 3 at every stake; blunt touch of a block,
  wave 3: `x1 0.79`, `x1.5 1.47`, `x2 2.57`; speed `7.3 / 8.0 / 8.7`; largest
  touch of any wave copy `2.6`; full-canvas boss (N 1024) `2.12`. Heroes:
  disc armour 270 speed 9.6, star 139 / 14.5, line 70 / 26.1, dot 65 / 32.0.
  No touch comes near a one-touch kill (hit cooldown 24 ticks per pair).
- Scripted kiting hero (own 15-line bot: run tangentially and away from the
  nearest enemy, keep off the wall; automatic throws), single waves, 3 seeds,
  damage taken:
  - `disc vs block : w1x1 dmg0 | w1x1.5 dmg12 | w1x2 dmg37 | w3x1 dmg10 | w3x1.5 dmg38 | w3x2 dmg121 | w5x1 dmg23 | w5x1.5 dmg361 | w5x2 dcd dmg787`
  - `line vs block : w1x1 dmg0 | w1x1.5 dmg0 | w1x2 dmg0 | w3x1 dmg0 | w3x1.5 dmg0 | w3x2 dmg0 | w5x1 dmg0 | w5x1.5 ccd dmg149 | w5x2 ddd dmg209`
  - `line vs hoop2 : ... w3x2 ccc hits2 dmg5 ...`
- Same kiter, five waves of one heavy design at x1 (heal after each), then the
  boss, 3 seeds per row; "v2" = version 2 solo rules on version 3 physics:
  - v3: `disc vs block dead dead dead`, `disc vs disc dead dead dead`,
    `star vs block dead dead dead`, `star vs hoop2 dead dead dead`,
    `line vs hoop2 dead dead dead`, `line vs ring dead dead dead`; in total
    **13 of 36 boss fights won**.
  - v2 rules: 35 of 36 won (only `line vs block` lost once).
  - v3 with `bluntBonus = 0` for boss and escorts only (speed kept):
    **34 of 36 won** (`nocrush disc vs block won(270->89) won(270->68) won(270->101)`).
- Fragility of the golden coverage test, 13 single small tuning changes:
  the "won run" ending (`solo_win_with_boss`) is lost with
  `crowdRelaxPasses=0`, `extraSeparationPasses=4` and `enemyDamageMult=0.45`;
  every other required ending survived all 13.
- Lever files: `maxDuel`, `lightFfa`, `maxFfa` of all 18 files under `levers/`
  match the lever tables in `WORKER_RESULT.md` and `INK_RULES_V2.md`.
- C# port and app in the main checkout (read-only grep):
  `Source/Unity/.../Core/InkPhysics.cs:31` declares `TurnCos, TurnSin`,
  lines 134 and 135 assign them, nothing reads them; the app sources do not
  use them (only the built `dist/*.html` bundles contain the old core).

## 2. Findings

### Blocker

**B1. Boss and escorts crush at stake x1: the boss fight with heavy blunt
designs is now much harder at x1 than in version 2.**
`core/solo.js:208` and `:211` (`soloStartBoss` calls `spawnEnemy` with scale 1,
stake index 0) together with `core/solo.js:157` (`body.bluntBonus =
soloEnemyCrush(...)` for every spawned enemy). Scenario: a first-time player
draws a filled block as the enemy for all five waves and plays x1. The waves
stay easy (Worker: 64 of 64 reach the boss), then the boss (the block itself,
210 cells, crush 0.84) and five block escorts (crush 0.84 each, speed 7.3
instead of 5.2) hit for 0.82 per touch instead of 0.48. Worker bots: heavy
blunt designs at x1 won 64 of 64 before, 34 of 64 now (block 4 of 16, disc 7
of 16); the Worker's own text calls the boss "the larger part of the drop at
x1 and x1.5". My kiter: 35 of 36 boss fights won with version 2 rules, 13 of
36 with version 3; switching off only the boss and escort crush gives 34 of 36.
So the drop at x1 has nothing to do with the stake (the boss always runs at
stake index 0); it is a new difficulty that lands on the beginner path,
against the order's explicit condition, and heavy designs are now the hardest
group at x1 (34 of 64 against 73 of 96 for all others). Both port updates
would copy it.
Fix proposal: give boss and escorts no crush (`bluntBonus = 0` when
`soloStartBoss` spawns), or add a tuning factor `solo.bossCrushMult` (proposal
0) used only there; keep the new speed or measure it with the fix. Then
re-run the heavy group of the solo smoke field (`node sim/solo_smoke.js
--heavy`) and regenerate the goldens; update `CHANGES_V3.md` V5, section D,
`RULES_AS_BUILT.md` section 5 and `INK_RULES_V2.md` section 7 ("Boss and
escorts crush with their own ink").

### Important

**I1. R1 is still free for a light, kiting hero; the bound in the records
understates it.** `WORKER_RESULT.md` section 2 ("A human who kites perfectly was
not measured. The enemies are still slower than a heavy hero") and
`INK_RULES_V2.md` section 8. Scenario: hero = 32-cell line (speed 26), enemy
= block, waves 1 to 4: one copy at every stake, enemy speed 7.3 to 8.7. My
simple kiter takes 0 damage at x1, x1.5 and x2 in waves 1 and 3 and still
collects 2x the ink at x2; the only cost is a longer fight (19 s -> 37 s). It
needs no perfect play, only "run away in a circle", and it works for every hero
faster than about 9 cells per second, which is almost all of them. For slow
heroes the stake now costs (disc hero, wave 3: 10 / 38 / 121 armour) and that
is a real improvement over version 2. For a prototype the remainder "x1.5 is
still cheap during the waves" is acceptable **after B1 is fixed**, if the
records say plainly that a fast hero against one heavy copy still takes the
stake for free. Fix proposal: correct the sentence in `WORKER_RESULT.md`,
`INK_RULES_V2.md` section 8 and `RULES_AS_BUILT.md` (known limits); a later
order can test a minimum copy count per stake for heavy designs (the extra ink
split into more, weaker copies), which cuts off a kiter.

### Minor

**M1. "The C# template never had them" is false.** `WORKER_RESULT.md` R4 and
section 7, `CHANGES_V3.md:47` and `:216`. At the dispatch HEAD `960c6ae`,
`InkPhysics.cs:31` declares `TurnCos, TurnSin` and `:134-135` assign them
(nothing reads them). The removal is still free of risk, and the C# checklist's
conditional line covers it. Fix: say "the C# template has them, unread;
remove lines 31 (two names), 134, 135".

**M2. "A port can check V2 with the duel traces first" is wrong.**
`CHANGES_V3.md:168-170`. No duel trace changes with `extraSeparationPasses`
2 against 8 (only traces 3, 5, 7, 12, 13 do), so the duel traces cannot catch
a port that forgot V2. Fix: "the duel traces must stay identical; V2 and V3
are checked together by the crowd traces, V4 and V5 by the solo traces".

**M3. The extra passes cost about twice the step time in crowds.**
`WORKER_RESULT.md` R2 says "Run time of the probe did not change measurably";
measured 33 -> 62 microseconds per four-figure tick, worst tick 2.4 -> 4.0 ms.
Harmless for 60 Hz in the browser and in C#, but the sentence should give the
number.

**M4. The relaxation does not always settle inside one sub-step.** In 538 of
261926 sub-steps the fourth pass still pushed; within one tick a body can be
pushed back and forth (sum up to 21 cells, net 0.75 in the worst tick). No
energy is added, nobody was pushed out of the ring by it (0 of 38346 ticks from
the same state), visible jumps went down, so this is a note for the records
(`RULES_AS_BUILT.md` section 3), not a defect. The specification itself is
exact enough for a C# port: condition `world.bodies.length > 2` with dead
bodies counted, pairs `i < j` in index order skipping dead bodies, early stop
after a pass with no push, the push formula in written order
(`CHANGES_V3.md` V3). Note for the port: because dead bodies count, a three-seat
round whose last two figures are alive still relaxes, unlike a duel.

**M5. The golden coverage test hangs on one trajectory.**
`tests/golden.test.js:44` needs a won solo run from `solo_win_with_boss`; it
broke in 3 of 13 small single tuning changes I tried (all other required
endings held). It fails loudly, so it is safe, but every later solo or crowd
change will hit it. Fix proposal in the suggestions.

**M6. Records do not say where the x1 drop comes from.** `INK_RULES_V2.md`
section 8 lists 34 / 30 / 13 won for heavy designs without saying that the x1
and x1.5 drop is the boss fight; with B1 fixed this sentence changes anyway.

## 3. The questions of the order, answered

1. Tests: 70 pass, goldens match. The five new tests are real: the R3 test
   sets three seats to 0 armour and checks winner, reasons, out ticks, wins,
   losses and events, plus the exact tie and armour-and-ring in one tick; the
   R2 tests run 3000+ and 8000+ ticks with fixed thresholds; the relaxation
   test checks zero velocity and bit-identical duels (true by construction,
   `n > 2`); the R1 test checks the formulas, that the touch grows by more than
   1.5x per stake step with one copy, and the real damage of one blunt touch
   with a bonus. Fragility: see M5.
2. R1: the stake now costs for slow heroes against block, disc, ring and hoop;
   no one-touch crush value exists (largest wave touch 2.6, boss 2.1 at most);
   no new free-money design found; but the boss and escort crush makes x1
   worse than version 2 (B1), and a fast kiting hero still gets the stake free
   (I1). "x1.5 still cheap in the waves" is acceptable for a prototype once B1
   is fixed and I1 is written down honestly.
3. R2: reduced about tenfold and bounded by tests; no energy, no ring-outs
   caused, no move through the solo wall (the wall clamp runs after the
   relaxation), fewer visible jumps; specification exact for C# (M4); cost
   about 2x step time in crowds (M3).
4. R3 test good. R4: nothing reads `turnCos` / `turnSin` in the core, tests,
   tools, app sources or the C# port; the C# port does declare them (M1).
5. Determinism and portability unchanged; the seven non-crowd Ring traces are
   byte-identical to version 2.
6. `CHANGES_V3.md` matches the real diff for every changed line of the core
   and the tuning (V1 to V7, order of operations, where the loop sits, which
   bodies count, boss arguments). Corrections: M1, M2, and B1 when fixed.
7. Balance: true. The tuning diff touches only `physics.extraSeparationPasses`,
   the new `physics.crowdRelaxPasses` and the solo keys; no Ring balance number
   changed; stat vectors unchanged; readability unchanged. The lever table is
   backed by the 18 files under `levers/`; every "not adopted" follows the
   order's rule (L3 lowers only the circler top, L4 lowers the rusher top by
   0.5 but raises the circler top by 15.8, L2 cannot touch duels, L1 and L5
   raise it). `INK_RULES_V2.md` agrees with the tuning file and says clearly
   that the target is still not met.

## 4. Suggestions (at most three)

1. Fix B1 in a short correction round (boss and escorts without crush, or
   `solo.bossCrushMult`), re-measure only the heavy group and the boss, then
   hand the ports one change list.
2. Make the "won run" golden case robust by margin (a stronger hero or a weaker
   enemy design in `solo_win_with_boss`) so that it does not sit near the edge,
   and add one trace or unit test that a port missing V2 (8 passes) would fail
   on its own.
3. Before the next balance pass, test one solo rule against kiting a single
   heavy copy (for example a minimum copy count per stake), measured with a
   scripted kiter as well as the drop-chasing bots.
