# INK-UNITY-V3 Independent Review (QA Lead)

Independent review verdict: FAIL

Reviewer: separate Claude Code subagent, role QA Lead, not the builder.
Window: 2026-11-20, 03:33 to 03:45 UTC. Nothing was committed or pushed; this
file is the only repository file I created or changed.

Candidate: `Projects/Inkweight/Source/Unity` as in commit `8efe9c5` (the
working tree of that folder is clean against it), compared with `8acdb29`
("INK-UNITY-V2 independent review PASS"). Eight files changed (618+, 79-).

Short reason for FAIL: the C# core is proven against the version 3 golden
files, the Unity layer has no compile or first-Play error I can identify, and
the eight old findings are fixed. But one rule sentence that this order added
is false on the weapon drawing screen (F-1): a thrown weapon does not do "at
least 1.2" and does not do "blunt damage 1.2" without a blade; it does exactly
its sharpness (1.00 without a blade). The Work Order's success condition "no
rule statement shown to the player is false" is therefore not met. The fix is
small (one text branch plus the README sentence).

## 1. What I ran (real output)

All from `Projects/Inkweight/Source/Unity`, foreground, `.NET 8.0.34, X64`.
`bin`/`obj` of both projects deleted afterwards.

| Command | Real final lines | Exit |
|---|---|---|
| `dotnet run --project CoreTests` | `  self check passed, 115 checkpoints bit-identical` / `ok    self check as run inside Unity (embedded tuning and hashes)` / `RESULT: PASS (16722 checks, 0 failed)`; 30 `ok` lines, no `FAIL` | 0 |
| `dotnet run -c Release --project CoreTests` | `ok    self check as run inside Unity (embedded tuning and hashes)` / `RESULT: PASS (16722 checks, 0 failed)` | 0 |
| `./check_runtime_against_stubs.sh` | Legacy, InputSystem, Both, None: each `Build succeeded.` and `RESULT: PASS (stub smoke test, N frames)` (2058, 2289, 2562, 2639 frames); last line `STUB CHECK: PASS (4 variants compiled and smoke-run against stubs, not against Unity)` | 0 |

The first lines of the core run include `ok    generated file is up to date`,
`ok    tuning and golden versions`, `ok    core source rules (12 files: no
engine reference, no float, only Math.Sqrt and Math.Floor)`, `ok    stat
vectors (59 drawings, every field exact)`. SHA-256 starts of the files tested
against: `ink_tuning.json` cb402e80, `golden/sim_traces.json` 7839010c,
`golden/stat_vectors.json` 566c7249 (same as the Worker reports).

### Negative probes (throwaway copies under /tmp, Debug, deleted afterwards)

| Probe | Mutation in the new code | Caught? |
|---|---|---|
| P1 crowd condition | `if (n > 2)` replaced by "more than two **living** bodies" | Yes, but only by the Worker's own test: `FAIL  rules version 3: crowd relaxation runs only with more than two bodies, dead bodies counted, positions only`, `RESULT: FAIL (16723 checks, 1 failed)`. All 19 golden traces still pass. |
| P2 `RelaxPair` arithmetic order | b's x push `NormalX * d * invB / invSum` -> `NormalX * (d * invB / invSum)` | Yes, by the golden traces: ring_3_star_wedge_needle, ring_4_disc_star_comb_dot, ring_4_one_scripted_seat, ring_4_circlers, solo_brawl_full_run and the in-Unity self check fail; `RESULT: FAIL (16606 checks, 1428 failed)` |
| P3 boss crush factor | `* so.BossCrushMult` -> `* 1` | Yes: solo_boss_heavy_no_crush, the own V3 test and the sensitivity test; `RESULT: FAIL (16722 checks, 229 failed)` |
| P4 crush arithmetic order | `perInk * N * scale * stake` -> `perInk * N * stake * scale` | Yes, but only by the own V3 test: `RESULT: FAIL (16722 checks, 1 failed)`. No golden solo trace tells the two orders apart. |

The tests catch all four. P1 and P4 show that two version 3 details (dead
bodies counted; multiplication order of the crush) rest on the Worker's own
tests only, not on the golden files (minor m-3).

## 2. Port fidelity (side by side with `WebPrototype/core`)

| Change | JavaScript | C# | Same? |
|---|---|---|---|
| Crowd relaxation condition | `if (n > 2)` with `n = bodies.length` (dead included) | `if (n > 2)`, `n = bodies.Count` | yes |
| Pass count, early stop | `for r < ph.crowdRelaxPasses`, `if (!pushed) break` | same, `tuning.CrowdRelaxPasses` | yes |
| Position in the sub-step | after the `i < j` pair loop, inside each sub-step | same | yes |
| Pair order, dead skipped | `i` ascending, `j = i + 1..`, both `alive` | same | yes |
| `relaxPair` | reach test `>=`, `scanPair`, `hits === 0 or maxDepth <= deepContactDepth` -> false, `contactNormal`, `normal * d * inv / invSum`, a `+=`, b `-=` | same order; push values put in locals first, which does not change the rounding | yes |
| `touchDamage` | `blunt = bluntDamage + bluntBonus`; sharp: `max(sh, blunt) + sharpArmourCut * maxHp` | same | yes |
| Enemy speed | `(enemySpeedBase + enemySpeedMult * topSpeed) * stakeSpeedMult[k]` | `share` computed first, then `(base + share) * mult` | yes (same operations) |
| Crush | `enemyCrushPerInk * N * scale * stakes[k]` left to right | same | yes |
| Spawn | speed factor 1, then `topSpeed`, `bluntBonus` set | same | yes |
| Boss crush | every spawned body `bluntBonus * bossCrushMult` before `run.copies` | same | yes |
| Separation passes | `ph.extraSeparationPasses` | `tuning.ExtraSeparationPasses` (already read) | yes |
| Turn fields | none | `TurnCos`, `TurnSin`, local `t` removed; no other user (grep) | yes |
| Tuning keys | `crowdRelaxPasses`, `enemySpeedBase`, `enemyCrushPerInk`, `bossCrushMult` | read with the throwing `N()` reader | yes |

C# pitfalls checked: all core arithmetic is `double`; no `float` (source rule
test passes); `ScanHits` is an integer compare as in JS; no integer division in
the new core code; `BluntBonus` defaults to 0 in `CreateBody` and is not hashed
(the JavaScript does not hash it either).

## 3. The eight minor findings of INK-UNITY-V2

| Finding | Fixed? | New problem from the fix? |
|---|---|---|
| m1 clock behind a question | Yes: `UpdateDrawClock` returns while `ask != Ask.None`; the clock line adds "(angehalten)" | No. The revision check still runs first, so a change made before the question still starts the clock. A question cannot outlive the drawing screen (`ask` is only set in the Draw view; `BeginEdit`, `GoMenu`, Escape and both answers reset it), so a held clock cannot get stuck. |
| m2 focus loss | Yes: at most 0.25 s per frame, negative steps ignored | Below 4 frames per second the clock runs slower than real time; harmless. |
| m3 coverage gaps | Yes: own tests for the `(1, 0)` normal, the armour scale upper limit (reachable only with `maxCopies` 3) and the throw skipping an enemy at 0 armour | No. |
| m4 "Menü" during a question | Yes: not drawn while `ask != Ask.None` | No stuck state: the question is always drawn when `ask` is set, because `ask` is only ever set in the Draw view. |
| m5 README "runs at you" | Yes: "runs at the nearest figure" | No. |
| m6 stale refusal | Yes: `message` is cleared when `editor.Revision` changes; `BeginEdit` syncs `messageRevision` | No: messages set after a `BeginEdit` (timeout refusal, "Zeichnung ungültig") survive until the drawing changes, as intended; shop messages are in another view. Not reached by a test (honestly named). |
| m7 title may wrap | Yes: clock on its own line (`y` 48, height 20) between title (8 to 48) and canvas (70) | Cosmetic only: the clock line is left-aligned under a centred title. |
| m8 leftover fight note | Yes: `ResetFight` clears it | No: the "Zeit abgelaufen" note is set after `StartRingRound` calls `ResetFight`, so it is still shown. |

## 4. Truthfulness of the shown rule texts (`InkweightGame.cs`)

Computed by hand from `ink_tuning.json` and checked against the code paths.

**Element line** (`NeutralReason`, line 736; the core rule in
`InkDrawing.cs` 280-293; `ColourCounts` is black, ember, tide, moss, so
indices 1 to 3 are the colours):

- N = 13, 3 coloured: 300 < 390, neutral, shown "Neutral – ab 30 % bunter
  Tinte (jetzt 23 %)". True. 4 coloured: 400 >= 390, element; the floored
  percentage can never show 30 while below the limit. True.
- N = 100, 20 ember + 20 tide: coloured 40 %, tie -> "Neutral – Gleichstand
  der Farben". True (it is the only neutral case above the limit).
- N = 100, 12 ember, 10 tide, 10 moss: 32 %, ember alone 12 % -> "Glut
  (schlägt Moos)". True; ember 5, tide 5, moss 7 -> Moos, correct.
- Wording: "bunter Tinte" while the percentage is of body cells (drips do not
  count): minor m-1.

**Block enemy in wave 3** (15 x 14 = 210 cells, C = 156, design armour 279,
top speed 9.5; budget 230; the line at 986-988):

| Stake | Copies | Scale | Armour shown | Tempo shown | Crush | Blunt touch shown | Loot per enemy |
|---|---|---|---|---|---|---|---|
| x1 | 1 (floor 0.92 -> at least 1) | 0.92 | 167.3 | 7.3 | 0.7728 | (1.2 + 0.7728) * 0.4 * 1 = 0.79 | 230 |
| x1.5 | 1 | 1.38 | 250.9 | 8.0 | 1.7388 | 2.9388 * 0.4 * 1.25 = 1.47 | 345 |
| x2 | 1 | 1.84 | 334.5 | 8.7 | 3.0912 | 4.2912 * 0.4 * 1.5 = 2.57 | 460 |

The line uses exactly the core's formulas (`EnemySpeed`, `EnemyCrush`,
`enemyDamageMult`, `stakeDamageMult`, the body's `DamageMult`); it agrees with
`INK_RULES_V2.md` section 7 (0.8 and 2.6, "7.3 to 8.7 cells per second").
Singular "1 Gegner mit ..." is correct. "(ohne Element)" is correct (the
element factor is applied on top). A 13-cell dot: 4 copies at x1, 0.50; 8
at x2, 0.79, as the README says.

**Stake heading** "Einsatz: mehr oder zähere Gegner, härtere Treffer, mehr
Beute": true (copies or scale rise; stake damage factor and crush rise; the
staked budget is paid out in total, even when the loot per enemy falls).

**Boss button** "(kein Einsatz)": true; boss and escorts spawn at stake index 0
with `bossCrushMult` 0.

**Sharpness explanation** (lines 946-951): true on the figure screens (Ring,
hero, enemy, hero redraw): a blade touch is `max(sharpness, blunt) + cut`, a
non-blade touch is blunt 1.2. **False on the weapon screens** (thrown weapon
and weapon redraw): see F-1.

Checked and true: the menu sentence, "Noch zu klein: der Körper braucht
mindestens 12 zusammenhängende Felder." (12 for both kinds), the drip text in
singular and plural, "Gefüllte Flächen panzern, Hohlräume in dicker Hülle ein
wenig.", element names and what they beat (`beats` 4, 2, 3: Glut beats Moos,
Flut beats Glut, Moos beats Flut), "Heilen (+35 % Panzerung)", "+40" / "+15"
ink, the upgrade price by break (60 after wave 1), the catch-up line, the out
reasons, the end texts, the self-check line.

**Layout** (virtual height 720; panel width `pw = vw - px - 20`: about 610 at
16:9, about 372 at 4:3; `smallStyle` 14, `labelStyle` 18, word wrap on). The
vertical stack of the enemy screen ends at about 626, above the start button at
640, so it fits by height. Lines at risk by width, in order:

1. Stake detail line (about 110 characters at 14): 2 lines at 16:9 fit the
   40-unit rect; at 4:3 about 3 lines, the third cut.
2. Element line with the reason (about 52 characters at 18 in a 24-unit
   rect): fits at 16:9, wraps and is cut at 4:3.
3. "Keine Klinge (Striche, 1 Feld dick): stumpfer Schaden 1.2." (about 58
   characters at 14 in a 20-unit rect): fits at 16:9, cut at 4:3.
4. Stake heading (61 characters at 14 in a 22-unit rect): fits at 16:9, may
   wrap at 4:3.
5. Ink line with "Tinte leer!" and the drip text (older): may wrap at 4:3.

README checklist item 4 names items 1 to 4. At the default 16:9 Game view all
should fit; a narrow or 4:3 Game view is where the Human will see cut text.

## 5. Engine members, compile, first Play

- `EngineStubs/UnityEngineStubs.cs` unchanged against `8acdb29`. The new code
  uses only members already used and reviewed (`Time.unscaledDeltaTime`,
  `GUI.Label(Rect, string, GUIStyle)`, `GUI.Button`, `const float`). I agree:
  no engine member newly used.
- No certain compile error: C# 9, no new type names that could clash, the
  stub build compiles with warnings as errors in all four variants.
- No first-Play failure found: the new strings are built from stats that exist
  for every drawing (`N > 0` guarded; `PreviewFigure` as before), and the clock
  and message changes cannot leave a view without a way out.
- Stubs still honest: the README and the result keep saying "against stubs,
  not against Unity".

## 6. README

- "What should happen on Play (rules version 3)" is accurate for the
  figure screens, the clock, the question, the self-check line, the stake
  line and the version 3 numbers (block 0.79 / 2.57, dot 0.50 / 0.79, crush
  0.02 / 0.07, top-speed bar end 9.2 / 32.4 all recomputed). It repeats F-1
  ("a cut never does less", "stumpfer Schaden 1.2") without excluding the
  weapon screen.
- Checklist: useful; item 4 names the long lines; item 6 covers the held clock.
- What to report back: complete and clear.
- The Worker's table "verified here / not verifiable here" is honest: layout
  is "nothing verified", m6 and m8 are "code only", the stub compile is not a
  Unity compile, Mono/IL2CPP/ARM are named. It misses only that the weapon
  screen texts were not checked against the throw rule (the smoke test checks
  the sharpness sentence on the hero screen only, `SmokeProgram.cs` 171).

## 7. Scope

Since `cf9a4da` (before the INK-UNITY-V3 and INK-WEB-V4 dispatch), outside
`Projects/Inkweight/Source/Unity`, `Artifacts/Inkweight/Evidence/INK-UNITY-V3`
and the other Worker's `WebPrototype/app`, `dist`, `build`, only the
Director's dispatch files of both orders changed. Shared files, golden files
and the JavaScript core are unchanged. Scope respected.

## 8. Findings

### Blocker

- **F-1, false damage sentence on the weapon drawing screens.**
  `Inkweight/Assets/Inkweight/Runtime/InkweightGame.cs` lines 946-951 show,
  for every drawing kind, "Klingen (gelb) schneiden mit der Schärfe,
  mindestens 1.2." or "Keine Klinge (Striche, 1 Feld dick): stumpfer Schaden
  1.2.". A thrown weapon's hit is `weapon sharpness * element factor`
  (`InkSolo.cs` line 420, `solo.js` line 331, `RULES_AS_BUILT.md` "Thrown
  weapon"); there is no blunt floor. A weapon without a blade hits for 1.00,
  not 1.2, and a weapon with one blade cell (sharpness about
  `1 + 1.2 * 1 / 26` = 1.05) hits for 1.05, below the promised "mindestens
  1.2". Shown on
  "Zeichne deine Wurfwaffe" and "Mehr Tinte: Zeichne deine Waffe neu".
  - Fix: branch on `editor.Kind == InkDrawing.KindWeapon`, for example
    `"Wurftreffer: Schaden = Schärfe " + F2(st.Sharpness) + " (mal Element)."`
    for a weapon with a blade cell and
    `"Keine Klinge (Striche, 1 Feld dick): Wurfschaden " + F2(st.Sharpness) + "."`
    without one; keep the current two sentences for figures. In
    `README.md` ("Schärfe" bullet) add "(figures; a thrown weapon hits with
    exactly its sharpness)". Add one smoke check on the weapon screen.

### Important

- **I-1, the weapon screen shows figure rows a weapon does not use**
  (older than this order, same place). "Panzerung: ... – Gefüllte Flächen
  panzern, ..." suggests the weapon has armour (it has none in the game), and
  "Tempo: 9.2 – Weniger Tinte ist schneller." shows the figure top speed,
  while the throw speed is `60 / (1 + N_w / 60)` and the throw interval
  `18 + floor(0.5 * N_w)` ticks. The sentence "less ink is faster" is true for
  the throw, the number is not the throw's.
  - Fix (same correction round, recommended): on the weapon screen hide the
    armour row or replace it with "Wurf alle X s, Flug Y Felder/s" computed
    from the tuning, and show the throw speed as "Tempo".

### Minor

- **m-1, element reason says "Tinte" but counts body cells**
  (`InkweightGame.cs` line 742). Drips cost ink but do not count. Fix:
  "ab 30 % bunter Felder im Körper (jetzt N %)" or "... bunter Körperfelder".
- **m-2, long lines at 4:3 or in a narrow window** (section 4, layout list).
  Fix: give the element and sharpness rects two lines of height, or shorten
  ("Tempo T, Treffer D" and the loot on a second line); a later option is
  `GUIStyle.CalcHeight`, which would be a newly used engine member.
- **m-3, two version 3 details rest on own tests only.** Dead bodies counted
  in the crowd condition and the crush multiplication order are not visible in
  any golden trace (probes P1, P4). Fix: ask the next core order for one
  golden case with a dead third body touching two living ones and a crush
  value where the order matters; until then keep the two own tests.
- **m-4, wording in `WORKER_RESULT.md`**: "Six shown rule statements were
  corrected" while section 7 lists seven. No action needed beyond the next
  edit.

## 9. Basis of the verdict

- Core proven against the version 3 golden files: yes (Debug and Release, bit
  for bit, embedded self check; four probes caught).
- No identifiable compile or first-Play error in the Unity layer: yes, within
  the limits of the stubs.
- Nothing false shown to the player: **no** (F-1).
- Every unverified part honestly named: yes, except that the weapon-screen
  texts were not covered (section 6).

FAIL. After F-1 is fixed (and I-1 preferably in the same round), a re-review
needs only the weapon-screen texts, the README sentence, the smoke test and a
rerun of `./check_runtime_against_stubs.sh`; the core needs no change.
