# INK-UNITY-V3 Worker Result

Worker: separate Claude Code subagent. Window: 2026-11-20, 03:23 to 03:33 UTC.
Nothing was committed or pushed by the Worker. (The Director made a
work-in-progress snapshot commit `0c170b4` at 03:29 UTC that contains the
Worker's state at that time; `SmokeProgram.cs`, `README.md`, `stub_check.txt`
and this file changed after it.)

## 1. verify-worker

Run before any change:

```text
PASS worker receipt 54fc709217479941e763bb0ad04b0a5ba20740ee8fb5969b07c77db47b870cf2
```

## 2. Result in short

- The C# core is on core version 3. `dotnet run --project CoreTests` passes
  in Debug and in Release: `RESULT: PASS (16722 checks, 0 failed)`, all 19
  golden traces and the 59 stat vectors bit for bit. The traces passed on the
  first run after the port; no correction round was needed.
- The Unity layer compiles against the stubs in all four input variants and
  the smoke test passes in each.
- The seven Unity-layer findings and the test finding of the INK-UNITY-V2
  review are fixed.
- Seven shown rule statements were corrected or completed (section 7).
- Not verified: anything in the real Unity Editor (section 5).

## 3. What changed (all inside `Projects/Inkweight/Source/Unity`)

| File | Change |
|---|---|
| `Inkweight/Assets/Inkweight/Core/InkPhysics.cs` | V1: `TurnCos`, `TurnSin` and the local `t` removed. V3: crowd relaxation after the pair loop of every sub-step when the world has more than two bodies (dead ones counted), new `RelaxPair`. V4: body field `BluntBonus`, added in `TouchDamage` before the comparison with the sharpness. |
| `Inkweight/Assets/Inkweight/Core/InkSolo.cs` | V5: new `EnemySpeed` and `EnemyCrush`; `SpawnEnemy` passes speed factor 1, then sets `TopSpeed` and `BluntBonus`; `StartBoss` multiplies the blunt bonus of every spawned body by `BossCrushMult`. |
| `Inkweight/Assets/Inkweight/Core/InkTuning.cs` | New keys `CrowdRelaxPasses`, `EnemySpeedBase`, `EnemyCrushPerInk`, `BossCrushMult`. `ExtraSeparationPasses` was already read from the tuning (V2 needed no code change). |
| `Inkweight/Assets/Inkweight/Core/Generated/InkGenerated.cs` | Regenerated from `ink-tuning-3` and the new golden files (self check: `ring_1v1_disc_lance` and `solo_brawl_full_run`, 115 checkpoints). |
| `CoreTests/Program.cs` | Old speed test adapted; new `TestRulesV3` with four groups (section 4). |
| `Inkweight/Assets/Inkweight/Runtime/InkweightGame.cs` | Review findings m1, m2, m4, m6, m7, m8 and the text corrections of section 7. |
| `EngineStubs/SmokeProgram.cs` | Smoke test follows the new clock behaviour and texts; new checks for the capped time step, the held clock, the hidden "Menü" button, the element line (three cases), the singular drip text and the stake line. The printed solo outcome no longer says "time over" for a destroyed hero. |
| `README.md` | Rules version 3: what to expect on Play, self-check line, new texts, m5 wording, test description. |

Shared files, golden files and the JavaScript core are unchanged (checked with
`git diff --quiet`). SHA-256 starts of the files tested against:
`ink_tuning.json` cb402e80..., `golden/sim_traces.json` 7839010c...,
`golden/stat_vectors.json` 566c7249....

`bin` and `obj` of both projects were deleted at the end.

## 4. Test commands and real output

All from `Projects/Inkweight/Source/Unity`. Runtime: `.NET 8.0.34, X64`.

| Command | Real final lines | Exit | File |
|---|---|---|---|
| `dotnet run --project CoreTests -- --generate` | `wrote .../Core/Generated/InkGenerated.cs (43039 characters)` | 0 | – |
| `dotnet run --project CoreTests` | `self check passed, 115 checkpoints bit-identical` / `ok    self check as run inside Unity (embedded tuning and hashes)` / `RESULT: PASS (16722 checks, 0 failed)` | 0 | `core_tests_debug.txt` |
| `dotnet run -c Release --project CoreTests` | `RESULT: PASS (16722 checks, 0 failed)` | 0 | `core_tests_release.txt` |
| `./check_runtime_against_stubs.sh` | four times `Build succeeded.` with `0 Warning(s)` and `RESULT: PASS (stub smoke test, ... frames)`; last line `STUB CHECK: PASS (4 variants compiled and smoke-run against stubs, not against Unity)` | 0 | `stub_check.txt` |

The core test output has 30 `ok` groups and no `FAIL`: 12 ring traces and 7
solo traces `bit for bit`, among them
`ok    ring trace ring_1v1_comb_comb_deep_passes (23 checkpoints, bit for bit)`
and
`ok    solo trace solo_boss_heavy_no_crush (55 checkpoints, bit for bit)`.

Order of checking: all 19 traces passed in the first run after the complete
port, so the recommended order (identical traces, deep-passes duel, crowd
traces, solo traces) was not needed to find a fault. Each step is instead
proven separately by the new test group "the golden traces see the new
numbers in this port".

New own tests (`TestRulesV3`, 69 checks):

1. **Version 3 rules.** Tuning keys and values; blunt bonus 0 for a new body
   and for every Ring body; wave copies carry `EnemyCrush`, `EnemySpeed` and
   the damage factor at all three stakes; the block example of the change
   list (0.79 at x1, 2.57 at x2); no body of the boss fight crushes; with
   `bossCrushMult` 1 the boss and escorts crush with `enemyCrushPerInk * N`.
2. **Crowd relaxation.** Three overlapping bodies of one team: no event, no
   speed, no damage, and the positions differ from the run with
   `crowdRelaxPasses` 0. Two bodies: identical with 4 and 0. A dead third
   body switches the relaxation on for the two living ones.
3. **The three branches the last review found unreached.**
   - `(1, 0)` normal: two equal bodies on the same spot are pushed apart
     exactly along x (with `extraSeparationPasses` 0).
   - Upper limit of the wave armour scale: reached with `solo.maxCopies` 3.
     With the stock tuning it cannot be reached at all; the test proves this
     by trying every wave, stake and size from 12 to 220.
   - Throw target: the nearest enemy at 0 armour is skipped and the next one
     is aimed at; control run with armour left; all enemies at 0 armour gives
     no throw.
4. **Sensitivity in this port.** `ring_1v1_comb_comb_deep_passes` changes
   with 7, 4 and 2 separation passes and not with `crowdRelaxPasses` 0;
   `ring_1v1_disc_lance` does not change with `crowdRelaxPasses` 0;
   `ring_4_circlers` changes with `crowdRelaxPasses` 0; and
   `solo_boss_heavy_no_crush` changes with `bossCrushMult` 1,
   `enemyCrushPerInk` 0 and `enemySpeedBase` 0.

## 5. Verified here / not verifiable here

| Part | Verified here | Not verifiable here |
|---|---|---|
| C# core, version 3 | Bit for bit against all golden files, Debug and Release, .NET 8 x64 | Mono, IL2CPP, ARM (the in-game self check shows it per build) |
| Embedded tuning and hashes | "generated file is up to date" passes; self check passes with the embedded data | The self check inside Unity |
| Runtime compile | Against hand-written stubs, four input variants, 0 warnings | Against the real engine; wrong member names or name clashes the stubs do not list |
| Clock: held during a question, capped step, own line | Smoke test (stub time) | Real time, real focus loss |
| "Menü" hidden during a question | Smoke test | – |
| Stale refusal message cleared (m6) | Code only; the path is practically unreachable, no test reaches it | Behaviour on screen |
| Fight note reset (m8) | Code only | Behaviour on screen |
| Element line, drip singular, stake line | Smoke test compares the shown text with values computed from the core | Whether the longer lines fit the panel |
| Layout of all changed lines | Nothing | Everything: text width, wrapping and clipping, especially at 4:3 or in a narrow window |

## 6. Engine members newly used

None. The time-step cap is plain C# on the already used
`Time.unscaledDeltaTime`; the new texts use the already used
`GUI.Label(Rect, string, GUIStyle)`. `EngineStubs/UnityEngineStubs.cs` is
unchanged.

## 7. Rule statements checked and corrected

Checked against `INK_RULES_V2.md`, `ink_tuning.json` and the core: every
German sentence and number in `InkweightGame.cs` (the other Runtime files show
no rule text).

Corrected or completed:

1. **Stake detail line.** Old: "N Gegner mit je X Panzerung, Schaden x1.25,
   Tempo x1.1. Beute: ...". "Schaden x..." is no longer the whole truth in
   version 3: a heavy copy also crushes (block, wave 3: 0.79 at x1, 2.57 at
   x2, a factor of 3.3 and not 1.5). New: "N Gegner mit je X Panzerung, Tempo
   T, stumpfer Treffer D (ohne Element). Beute je Gegner: B Tinte.", with T
   from `InkSolo.EnemySpeed` and D = `(bluntDamage + EnemyCrush) *
   enemyDamageMult * stakeDamageMult`.
2. **Stake heading.** Old: "Einsatz (mehr Tinte, mehr Gefahr, mehr Beute):".
   New: "Einsatz: mehr oder zähere Gegner, härtere Treffer, mehr Beute" (a
   big drawing gets 1 copy at every stake, so "more enemies" alone would be
   false).
3. **Singular grammar.** "1 Gegner mit je ..." is now "1 Gegner mit ...";
   "1 Felder tropfen ab und zählen nicht" is now "1 Feld tropft ab und zählt
   nicht".
4. **Armour line.** Old: "Gefüllte Flächen panzern, Hohlräume ein wenig."
   (false for a loop drawn with a one-cell line, which holds nothing). New:
   "Gefüllte Flächen panzern, Hohlräume in dicker Hülle ein wenig." The
   number behind "Hohlraum" was and is the count of pocket cells that count.
5. **Sharpness line.** The panel shows sharpness values below the blunt
   damage (1.00 without a blade) without saying that a cut never does less.
   New, with a blade cell: "Klingen (gelb) schneiden mit der Schärfe,
   mindestens 1.2."; without one: "Keine Klinge (Striche, 1 Feld dick):
   stumpfer Schaden 1.2." (1.2 is read from the tuning).
6. **Element line.** The Unity prototype stated no element rule, so it had
   not the browser's false one; it only showed "Neutral". Completed with the
   true reason: "ab 30 % bunter Tinte (jetzt N %)" (N rounded down) while
   less than 30 % of the body is coloured, "Gleichstand der Farben" on a tie.
   The same comparison as the core is used (`coloured * 100 >=
   minColouredPercent * N`).
7. **Boss button.** "Zum Boss – er besteht aus deinen Gegnern (kein
   Einsatz)". That the boss and its escorts do not crush is said in the
   README only; the game has no German word for the crush.

Checked and left as they are (true): the menu sentence, "Mehr Tinte schiebt
stärker, ist aber langsamer.", "Weniger Tinte ist schneller.", "Noch zu
klein: ... mindestens 12 zusammenhängende Felder.", "Glut (schlägt Moos)" /
"Flut (schlägt Glut)" / "Moos (schlägt Flut)" (from `element.beats`),
"Heilen (+35 % Panzerung)", the upgrade prices and ink amounts, the catch-up
budget line, the out reasons and the end texts.

README: the "Stürmer" now "runs at the nearest figure" (m5).

## 8. The review findings of INK-UNITY-V2

| Finding | Fix |
|---|---|
| m1 clock runs behind a question | `UpdateDrawClock` returns while a question is open; the clock line shows "(angehalten)" |
| m2 focus loss expires the clock | One frame takes at most 0.25 s off the clock |
| m3 coverage gaps | Own tests, section 4 item 3 |
| m4 "Menü" reacts during a question | The button is not drawn while a question is open; comment corrected |
| m5 README "runs at you" | "runs at the nearest figure" |
| m6 stale refusal message | The message is cleared when the drawing changes |
| m7 title may wrap | The clock is its own line under the title |
| m8 leftover fight note | `ResetFight` clears the note |

## 9. Gaps found in `CHANGES_V3.md`

The list and the JavaScript agree in every rule I ported; no case where the
JavaScript had to win. Small points:

1. V5 example: the blunt touch of the 210-cell block in wave 3 at x2 is
   given as 2.58; the exact value is 2.57472, which rounds to 2.57.
2. Section D says `RelaxPair` has "the six lines of V3"; section B lists five
   numbered steps. Wording only.
3. Not a version 3 change, found while testing: with the stock tuning
   `copyArmourScaleMax` (2) can never be reached, because the smallest valid
   drawing has 12 cells. The limit only acts after a re-tuning.

## 10. Known weaknesses and not done

- Nothing was compiled or run in the Unity Editor. Text width, wrapping and
  clipping of the longer lines are unknown; the README checklist item 4 names
  the lines to look at.
- No negative probe with a deliberately broken source copy was made this
  time. The sensitivity group replaces it for the new tuning numbers only,
  not for mistakes in the `RelaxPair` arithmetic itself (those are covered by
  the four crowd traces and two solo traces passing bit for bit).
- m6 and m8 are fixed in code but no test reaches them.
- The stake line shows the blunt touch only. A blade touch of a copy (never
  less, plus 0.4 % of the hero's full armour) and the element factor are not
  shown as numbers.
- The crush has no German name in the game and is not explained on screen
  beyond the "stumpfer Treffer" number.
- The capability Knowledge Base was not updated (Inkweight has no capability
  index yet, OD-09); no durable tool learning arose.

## Correction round 1 (2026-11-20, 03:40 to 03:47 UTC)

After the independent review (`REVIEW.md`, FAIL because of F-1). Same order,
same allowed paths; nothing committed or pushed by the Worker. Sections 4 and
7 above describe the first candidate; where they quote a sentence that this
round changed, the sentence below is the current one.

### What changed

| File | Change |
|---|---|
| `Inkweight/Assets/Inkweight/Runtime/InkweightGame.cs` | F-1 and I-1: the stat rows branch on `editor.Kind == InkDrawing.KindWeapon` (weapon rows: weight, throw interval, sharpness with the throw sentence, flight speed; no armour, no push weight, no figure speed). m-1: element reason counts body cells. m-2: lines shortened; the element reason is a small-type label beside "Element: Neutral" with room for two lines (row height 28 to 38). |
| `Inkweight/Assets/Inkweight/Core/InkSolo.cs` | New public helper `ThrowSpeed(tuning, weaponN)`; `Step` uses it for the shot speed (same operations; the golden traces still pass bit for bit). The weapon screen reads the flight speed from it instead of repeating the formula. |
| `EngineStubs/SmokeProgram.cs` | New `WeaponScreenChecks` on the weapon drawing screen; changed texts followed. |
| `README.md` | Weapon stat panel described; "Figures only; a thrown weapon hits with exactly its sharpness"; new sentences; layout remark. |

### The German sentences now shown

Weapon screens ("Zeichne deine Wurfwaffe", "Mehr Tinte: Zeichne deine Waffe neu"):

- "Gewicht: N" – "Mehr Tinte stößt stärker zurück, wirft aber seltener."
- "Wurf: alle 0.40 s" – "Weniger Tinte wirft öfter."
- "Schärfe: 1.06  (Klingenfelder 1)" – with a blade cell "Wurftreffer:
  Schaden = Schärfe 1.06 (mal Element).", without one "Keine Klinge (1 Feld
  dick): Wurfschaden 1.00."
- "Flug: 50.0 Felder je Sekunde" – "Weniger Tinte fliegt schneller."

Checked against the core: hit = sharpness times element factor
(`InkSolo.Step`), interval `ThrowIntervalTicks / tickRate`, flight
`ThrowSpeed`, knockback `N * weaponKnockbackPerInk / enemy push weight`.

Figure screens (shortened, same meaning):

- "Füllung panzert, Hohlraum in dicker Hülle ein wenig."
- "Klingen (gelb): Schaden = Schärfe, mindestens 1.2." / "Keine Klinge (1
  Feld dick): stumpfer Schaden 1.2."

All screens:

- "Element: Neutral" with "unter 30 % bunte Körperfelder (jetzt N %)" or
  "Gleichstand der Farben".
- "(1 Feld tropft ab)" / "(N Felder tropfen ab)".

Enemy screen:

- "Einsatz: mehr oder zähere Gegner, mehr Beute"
- "2 Gegner, je 23.5 Panzerung, Tempo 17.4, stumpfer Treffer 0.50 (ohne
  Element), Beute je 60." / "1 Gegner, 167.3 Panzerung, Tempo 7.3, stumpfer
  Treffer 0.79 (ohne Element), Beute 230."

Other non-figure drawing screens: there are none besides the two weapon
screens. The enemy screen is a figure; its stat rows describe the drawing
itself (the boss uses that armour), the copies of the wave are described by
the stake text. The README now says so.

### Real output (all exit 0)

| Command | Final lines |
|---|---|
| `dotnet run --project CoreTests` | `self check passed, 115 checkpoints bit-identical` / `RESULT: PASS (16729 checks, 0 failed)` |
| `dotnet run -c Release --project CoreTests` | `RESULT: PASS (16729 checks, 0 failed)` |
| `./check_runtime_against_stubs.sh` | four times `0 Warning(s)` and `RESULT: PASS (stub smoke test, N frames)` (2398, 2575, 2497, 2489); `STUB CHECK: PASS (4 variants compiled and smoke-run against stubs, not against Unity)` |

The check count rose from 16722 to 16729 because the source-rule test checks
the seven added lines of `InkSolo.cs`. `bin` and `obj` deleted afterwards.
Engine members newly used: none.

### Findings

| Finding | State |
|---|---|
| F-1 false sentence on the weapon screens | Fixed; smoke check: a 12-cell weapon without a blade shows "Wurfschaden 1.00", a weapon with one blade cell (sharpness below 1.2) shows "Schaden = Schärfe S", and no label on that screen contains "mindestens" or "stumpfer Schaden". |
| I-1 figure rows on the weapon screen | Fixed; smoke check: no "Panzerung", "Tempo" or "Schub" label there; interval and flight speed compared with the core (0.40 s, 50.0 at 12 cells). |
| m-1 element reason wording | Fixed. |
| m-2 long lines | Shortened to at most about 53 characters per small-type line and at most two lines for the stake text and the element reason. Estimated from character counts for a 372-unit panel (4:3); not measured, no engine available. The ink line with "Tinte leer!" and the drip text was shortened too. |
| m-3 golden coverage (dead third body, crush order) | Not for this order: noted for the next core order; the two own tests stay. |
| m-4 result wording | "Seven" in section 2. |

### Still not verified

Everything in the real Unity Editor, as before; the fit of the shortened
lines is an estimate.
