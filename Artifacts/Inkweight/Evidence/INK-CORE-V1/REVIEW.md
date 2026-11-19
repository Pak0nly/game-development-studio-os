# INK-CORE-V1 Independent Review

Independent review verdict: PASS

Reviewer: separate Claude Code subagent, role QA Lead. The Reviewer did not
build the candidate and changed no file except this one. Nothing was committed
or pushed. Throwaway scripts lived only under `/tmp/inkrev/`.

PASS means: the success conditions of the Work Order are met as the Worker
states them, the tests are real, and no blocker was found that would make the
browser UI order or the C# port order build on something broken. The balance
target of `INK_RULES_V1.md` section 8 is **not met**, and the Worker says so
plainly; that is allowed by the review terms. Several important findings below
should be settled before the C# port freezes its vectors.

## 1. What was run (real output)

All commands with `/opt/node22/bin/node` (v22.23.5), from
`Projects/Inkweight/Source/WebPrototype`, no installs, no network.

| Command | Real output (key lines) |
|---|---|
| `node --test` | `# tests 39` `# pass 39` `# fail 0` `# duration_ms 554.241922` |
| `node tools/gen_golden.js --check` (3 times) | `golden files match` (exit 0) |
| `node --jitless tools/gen_golden.js --check` | `golden files match` (interpreter only, no JIT: same bytes) |
| `node --no-opt tools/gen_golden.js --check` | `golden files match` |
| `/tmp/inkrev/indep.mjs` (own flood fill and neighbour count, written from `INK_RULES_V1.md` and `RULES_AS_BUILT.md`, not from the core) against all items of `stat_vectors.json` | `items 43 mismatches 0` (N, C, S, filled, drips, element, valid, armour, sharpness, top speed) |
| `node sim/balance.js --seeds 60 --ffa 1200 --nosolo --out /tmp/inkrev/bal` (38.7 s) | `ring section identical: true` against the Worker's `BALANCE_REPORT.json`; `Highest average duel win rate: wedge with 71.3 % (target: none above 60 %): NOT MET.` |
| `/tmp/inkrev/exp.mjs` and `/tmp/inkrev/solo.mjs` (scenario probes, see section 4) | quoted in the findings |
| `git log`, `git show --name-only 5352369 67b8073`, `git status` | no committed file outside `Projects/Inkweight/Source/` and `Artifacts/Inkweight/Evidence/INK-CORE-V1/` |

A further quick balance experiment with changed tuning values (for the
suggestions in section 6) was refused by this session's permission system and
was not run; the suggestions are therefore untested.

## 2. Rules fidelity

Hand or independent recomputation, all matching the golden file and the core:

| Case | Independent result |
|---|---|
| `drips`: 8 x 8 block plus 5 loose cells | N 64, filled 69, drips 5, C 36, S 4, armour 127 |
| `tie_two_groups`: two groups of 12 | body = the group with the lowest cell index (black, row 2); 12 drips |
| `tie_same_row`: two vertical lines of 12 starting in row 3 | left (Moss) group wins, element 4 |
| `bigger_later` | later, strictly larger group becomes the body |
| `corner_block`: 6 x 6 at (0,0) | C 16, S 4 (outside counts as empty) |
| `border_line_top`: 32 cells along row 0 | C 0, S 32, sharpness 6.5 |
| `border_frame`: one-cell frame round the canvas | N 124, C 0, S 124, sharpness 6.5, Tide |
| `full_canvas` | N 1024, C 900, S 4, invalid (over budget) |
| `element_exact_30` (6 of 20 red) | Ember; `element_below_30` (5 of 20) neutral |
| `element_tie` (10 red, 10 blue) | neutral; `element_plurality` (5/4/3 + 4 black) Ember |
| `staircase` | S 4 (only the two ends), C 0 |
| `over_budget_by_drips` | N 210, filled 221, invalid |

The element tie loop (`core/drawing.js:162-169`) was checked by hand for the
orders [0,5,5], [5,3,5], [5,5,3] and [3,3,5]; all give the rule's result.
`beats = [0,0,4,2,3]` encodes Ember > Moss > Tide > Ember as in section 4 of
the rules. The rotation mapping and its inverse (`core/physics.js:217-221`,
`247-248`) are consistent, and the sharp-flag attribution through the `sign`
argument (`core/physics.js:238-239`) gives the right owner in both scan
directions.

Every formula and number that differs from `INK_RULES_V1.md` is listed in
`RULES_AS_BUILT.md` section 9 (armour, sharpness formula, blunt damage, top
speed, catch-up cap, added ring, dash, knockback, solo and boss numbers). I
found no silent difference in the stat rules. One consequence of the new
sharpness formula is not stated (finding I3).

## 3. Determinism

- Same seed and inputs give identical hashes: tests
  `bot matches end ... same seed gives the same hashes` and
  `a full bot run is deterministic`; the golden files regenerate byte for byte
  across 5 separate processes, including `--jitless`.
- The core uses only `Math.sqrt`, `Math.floor`, `Math.imul` (enforced by a
  source scan test). No `Math.random`, `Date`, trigonometry, `for...in`,
  `Object.keys` or `sort` in `core/`. `Object.keys` and `sort` occur only in
  `sim/` and `tools/` (reports and tuning overrides), not in the simulation.
- All loops run over arrays in index order; event order is deterministic.

Threats to a bit-exact C# port (for the INK-UNITY order):

1. **Fused multiply-add under IL2CPP.** Unity builds for mobile and WebGL go
   through C++ (IL2CPP). Clang may contract `a * b + c` into one FMA
   instruction (default contraction on ARM64), which changes the last bit. The
   Worker's note "avoid fused multiply-add" is not something C# source alone
   can guarantee. The port needs a stated compiler setting or a test on the
   real target; otherwise traces will only match with a tolerance. (important)
2. **Negative zero.** The start fronts are `(1, -0)` and `(-1, -0)`
   (`core/ring.js:80`, `-slot[1]`). The hash reads raw bytes, so a port that
   writes `0 - x` instead of `-x` gets a different hash at tick 0. JSON prints
   `-0` as `0`, so the checkpoint rows cannot show this. (minor)
3. **Seed conversion.** `rngCreate` (`core/rng.js:5`) applies JS `ToInt32` to
   the seed; the C# port must take seeds as 32-bit integers. Seeds outside
   0..2^32-1 would differ. All seeds in use are small. (minor)
4. **Number text.** Golden doubles are JS shortest round-trip text. The file
   note correctly says to compare parsed values; older Mono parsers were not
   always correctly rounded, so parse with .NET's current `double.Parse` or
   compare the hash. (minor)
5. Integer overflow is not an issue (ticks, cooldowns and counts are small;
   hash and generator use explicit 32-bit wrap). No array sort or object-key
   order enters the simulation.

## 4. Findings

No blocker found.

### Important

**I1. Light figures pass through each other during a dash, even when the
contact is detected.** `core/physics.js:126-138` sets the velocity to the full
dash velocity every dash tick (`dashAccel = 1`), which overrides the collision
impulse of the previous tick, and `core/physics.js:283-287` pushes apart by at
most one cell depth per tick. Scenario (`/tmp/inkrev/exp.mjs`): two horizontal
20-cell lines, broadside, dashing at each other from gaps of 6 to 14 cells:
`tunnel gap 8 hits 2 crossed true`, `tunnel gap 6 hits 0 crossed true`; in all
five cases they ended on the opposite sides. The Worker lists "a dot can pass
through a one-cell line" as a known weakness; the real scope is wider: any two
thin, light figures meeting broadside in a dash. It is deterministic, so the
port will reproduce it, but it is visible in play and any fix changes the
golden vectors. Decide before the C# port freezes its vectors (for example:
sub-step the integration when a body moves more than 0.5 cells per tick, or
blend dash velocity with `dashAccel < 1` and keep the impulse).

**I2. Golden traces miss several branches the C# port must match.**
`tools/gen_golden.js:122-143`. Checked from `sim_traces.json`: the longest
round is 2095 ticks, so the constant end radius (2700-3600) and sudden death
(after 3600) are never reached; no round ends with a simultaneous knock-out;
no solo trace ends with hero death or with the time limit; no trace uses the
`heroInk` or `weaponInk` upgrade (only `heal` and `colour`). No unit test covers
simultaneous knock-out either (my probe confirmed the rule works: both out by
ring, the one nearer the centre won); the ring radius curve is covered by a
unit test but not by a trace. Add one scripted trace per missing branch before the port
starts, or the port order must add them itself.

**I3. A sharp touch by a heavy figure does less damage than a blunt touch.**
`core/drawing.js:186-187` gives sharpness `1 + 5.5 (S/N)^2`, and
`core/physics.js:301` uses sharpness instead of `bluntDamage` (1.2) whenever a
sharp cell is in the contact. For every figure with `S/N` below about 0.19 the
sharp value is below 1.2: block 1.002, wedge 1.001, disc about 1.0, corner of a
6 x 6 block 1.068. So a solid that touches with a corner or a point deals about
17 % less than when it touches with its flat side. This contradicts the plain
reading "thin lines are blades" and is not mentioned in `RULES_AS_BUILT.md`.
It affects balance numbers, so it should be either declared or changed (for
example `damage = max(bluntDamage, sharpness)`) together with I1.

### Minor

- **M1. A figure that is killed in a tick still deals and takes damage in later
  pairs of the same tick.** `core/physics.js:151-159` checks `alive` only;
  `alive` is cleared afterwards in `core/ring.js:107-118`. In a 4-figure round
  seat 0 killed by seat 1 in pair (0,1) still hits seat 2 in pair (0,2) the
  same tick. Deterministic; document it in `RULES_AS_BUILT.md` so the port and
  UI do not "fix" it differently.
- **M2. Solo: hero death wins over clearing.** `core/solo.js:304-311` checks
  hero armour before `enemiesAlive === 0`. Probe: hero and the last enemy both
  at 0.1 armour, touching: `phase dead armour enemy alive false`. The run is
  lost although the wave was also cleared. Reasonable, but unstated.
- **M3. The Ring core does not validate figures.** `core/ring.js:66-91`
  accepts any template; probe: a full-canvas figure (`valid false`) starts a
  round (`ring accepted invalid figure: fight`). An empty drawing gives mass 0
  and would produce `Infinity`/`NaN` on contact. The UI must call
  `computeStats(...).valid` with `ringInkBudget`; the API note should say this
  explicitly.
- **M4. The "fixed reference values for the C# port" test is circular.**
  `tests/properties.test.js:38-42` computes `REF_RNG` with the same code it
  then checks. It proves nothing and gives the port no numbers. Write the
  three expected integers into the test.
- **M5. The state hash leaves out state that drives later ticks.**
  `core/hash.js:26-35`, `40-48`, `51-65`: hit cooldowns (`world.cd`), dash
  direction (`dashDx`, `dashDy`), bot wobble, and in solo `heroBudget`,
  `weaponBudget`, `colours`, `upgradeTaken`. A port error there shows up only
  ticks later, which makes divergence harder to locate.
- **M6. A shot can be spent on an enemy already at 0 armour in that tick.**
  `core/solo.js:240-242` checks `alive` only; deaths are processed after the
  shots (`core/solo.js:273-284`). Small loss of a shot; deterministic.
- **M7. Stake has no effect once copies hit the cap.** `core/solo.js:65-71`
  with `maxCopies 20`: a 13-cell dot already gets 18 copies in wave 0 at x2
  and 20 from wave 1 at x1.5, so higher stakes add neither danger nor score
  for small designs. Design note for the solo tuning.
- **M8. Hollow wording.** `RULES_AS_BUILT.md` 10.3 says hollow shapes have
  "no thin ends, so no blades". True for the two field archetypes (ring S 0,
  frame S 11), but a one-cell-wide hollow frame is all sharp cells
  (`border_frame`: S 124, sharpness 6.5). Worth one sentence.

### Tests

The tests are real, not only restatements. Hand-derived checks: 6 x 6 block
C 16 / S 4, the canvas border, a 4 x 4 centroid and radius, both tie-breaks,
element threshold, plurality and ties, all six element pairings, hit cooldown
per direction, no team damage, dash cooldown, ring-out and armour elimination,
weight pushing, front vector staying a unit vector, solo copies, refused
drawings, upgrade costs, boss union colours. Property checks over 300 and 100
random drawings (body invariants, shift and mirror invariance). Weak or
circular: the RNG reference (M4), `stat formulas follow the tuning file` and
the catch-up test restate the code's formula, and the golden byte test is a
regression check, not a rules check. My independent re-implementation of the
stat rules agreeing on all 43 vectors is the stronger evidence for fidelity.

## 5. Balance claims

- The numbers in `WORKER_RESULT.md` match `BALANCE_REPORT.md` and
  `BALANCE_REPORT.json` (tuning in the JSON equals `ink_tuning.json`). Wedge
  duel average recomputed from the pairing row: 927 / 13 = 71.3 %.
- My full re-run (60 seeds, 1200 FFA, 38.7 s) gave a Ring section identical to
  the Worker's JSON.
- `neutral/` (all black) highest 72.3 %, `baseline_rules_v1/` highest 92.3 %
  (comb): both as stated. The baseline used only 20 seeds and also contains
  the Worker's first physics numbers (its header says so), so "starting
  numbers of the rules document" is slightly generous; not misleading.
- The verdict is honest: "Target no archetype above 60 %: NOT MET", five
  archetypes above 60 %, FFA plainly called unbalanced (heavy solids 53-66 %,
  light blades under 5 %), and a clear section on what bots can and cannot
  tell. "Three clearly different shapes can win: MET" is supported (solid,
  core+blades and blades families all at or above 50 %), with the fair caveat
  that it holds under one bot style.

## 6. Suggestions (not tested, Reviewer proposals only)

1. **Make blades and dashes push, not only cut.** In FFA the outcome is mostly
   decided by mass in a crowd. Let sharp hits knock back by the attacker's
   speed or sharpness rather than only `damage * 39 / weight`, or make the
   ring-out push of a collision depend on the impact speed (momentum of a fast
   light dash) instead of only inverse weight. Fix I1 at the same time, since
   dash contacts are where light blades should matter.
2. **Flatten armour from core cells and fix the sharp/blunt inversion.** Solids
   have 320-370 armour against 55 for blades (about 6 to 1). Try a lower
   `armourPerCore` (for example 1) with a higher `armourBase`, and use
   `max(bluntDamage, sharpness)` (I3) so that points on solids still count but
   solids gain nothing from flat contact.
3. **Give hollow shapes a job.** Count enclosed empty cells (holes) as part of
   size or armour (for example half a core cell each), or let a hollow figure
   catch and hold a smaller figure inside it (push resistance from the
   enclosed area). Today ring and frame sit at 26-31 % in duels and 0-10 % in
   FFA because they get neither core armour nor blade damage.

For four-figure rounds specifically, also test a bot that does not always
target the nearest opponent; the pile-up in the middle that favours weight is
partly a bot artefact, as the Worker says.

## 7. Scope

- `git show --name-only 5352369 67b8073`: every file is under
  `Projects/Inkweight/Source/` or `Artifacts/Inkweight/Evidence/INK-CORE-V1/`.
  The commits were made by the Director as snapshots, as expected.
- `git status`: untracked `Artifacts/Inkweight/DirectorDispatch/INK-UNITY-V1/*`
  and `INK-WEB-V1/*` dispatch files and `Projects/Inkweight/Source/Unity/`,
  `WebPrototype/build/` belong to the other running orders; not reviewed, not
  touched.
- `Projects/Inkweight/Docs` unchanged since `da0d872`.
- `balance_run.log` is ignored by `.gitignore`, so it is listed in the result
  but not in the commit. Harmless.
