# INK-UNITY-V2 Worker Result

Worker for Work Order INK-UNITY-V2 (C# core port and Unity layer to core
version 2). Work time 01:24 to 01:36 UTC on 2026-11-20. Nothing was committed
or pushed by the Worker (the Director's snapshot commits picked up work in
progress).

## 1. Gate

`verify-worker` was run before the first change and printed:

```text
PASS worker receipt 90786ed30f73b3a56df124202e28c540894a733e4649b776de99d8da6eb8c0b9
```

## 2. What changed (all inside `Projects/Inkweight/Source/Unity`)

Core (`Inkweight/Assets/Inkweight/Core`):

| File | Change |
|---|---|
| `InkTuning.cs` | four removed keys gone; all new keys of `CHANGES_V2.md` D1 read; new `FromJson(text, overrides)` for traces with `tuningOverrides` (replaces existing number keys in the parsed file, throws on an unknown path) |
| `InkDrawing.cs` | `IsSharpCell` (2 x 2 rule), `CountEnclosed`, new stats `Enclosed`, `P`, `PocketCells`, `Push`; armour and sharpness formulas of B2/B3 in the JavaScript order of operations |
| `InkPhysics.cs` | sharp flags from `IsSharpCell`; `Mass = Stats.Push`; body fields `Turning`, `TurnDx`, `TurnDy`; world field `SubSteps`; `StepWorld` with cooldowns once per tick, sub-steps and the turn inside them; deepest-contact normal, extra separation passes, dash restitution, dash end and `InkEvent.Ram`; `TouchDamage` with the armour cut |
| `InkRing.cs` | `BotStyle[]`, `CheckFigure` (`""`, `"tooSmall"`, `"overBudget"`), `StartRound` throws `InvalidOperationException("seat N figure: reason")` before any state change |
| `InkBots.cs` | rusher split into `AimInside` / `EdgeSteer` helpers (locals instead of the shared scratch record), new circler (style 1), `RingInput` chooses by `BotStyle` |
| `InkSolo.cs` | `Copies` with the copy fee, `WaveArmourScale`, `EnemyArmour`, `DropValue`, stake damage and speed multipliers, run fields `StakeIndex` and `DropValue`, `StartWave` throws `ArgumentException("bad stake index")`, shots and throws skip enemies at 0 armour, drops pay `DropValue` |
| `InkHash.cs` | layout 2 for ring and solo |
| `InkReplay.cs` | `InkRingScenario.BotStyles`; redraw upgrades `heroInk:<name>` / `weaponInk:<name>` through `WaveUpgradeCells`; `RunSolo` overload that reports the upgrade result per wave |
| `InkSelfCheck.cs` | passes bot styles and redraw-upgrade cells |
| `Generated/InkGenerated.cs` | regenerated (`--generate`): tuning `ink-tuning-2`, 20 example drawings, `RingCheckBotStyles`, new hashes |

Tests (`CoreTests/Program.cs`): new stat fields (`enclosed`, `P`,
`pocketCells`, `push`, `mass`) and "sharp flags of the figure equal S";
`botStyle` per ring trace; `tuningOverrides` per solo trace; redraw upgrades;
`fights[].upgrade`; new `final` fields; new group "rules version 2" (figure
check, both thrown errors with unchanged state, stake helpers, enemy armour /
damage / speed of a spawned copy, tuning overrides). The generator skips solo
traces with tuning overrides when it picks the self-check trace.

Unity layer (`Inkweight/Assets/Inkweight/Runtime`):

| File | Change |
|---|---|
| `InkweightGame.cs` | stat panel with four rows (number, bar with the real range, one German line each); stake line (enemies, armour of each from `InkSolo.EnemyArmour`, damage and speed multiplier, drop value); `InkRing.CheckFigure` before `StartRound` plus a `try/catch` around it; bot styles alternate from a random start and are named in the HUD ("Stürmer", "Kreisler"); `ram` event: yellow flash of the rammer and "Rammstoß!" / "Gerammt!"; 30 second Ring drawing clock (`ring.drawTimeSeconds`, starts with the first change, at 0 the round starts with the current, the last valid or an example drawing); one question before a drawing is discarded ("Leeren", "Beispiel laden", "Menü", Esc, "Abbrechen" of a changed redraw) |
| `InkCanvasEditor.cs` | blade cells (`InkDrawing.IsSharpCell` on the body) drawn with a yellow tint; `Revision` counter |
| `InkArenaView.cs` | `DrawBody` takes a mark (none, hit, rammed) instead of a flag |

Checks and documents: `EngineStubs/SmokeProgram.cs` (new steps for all of the
above), `README.md` (Play expectations for rules version 2, self-check line,
checklist, steps after a re-tuning, engine member list).
`EngineStubs/UnityEngineStubs.cs` is unchanged: no new engine member is used.

## 3. Test commands and their real final output

Run from `Projects/Inkweight/Source/Unity`, last run 01:34 UTC, full output in
this folder.

| Command | Last line | Exit code | Output file |
|---|---|---|---|
| `dotnet run --project CoreTests -- --generate` | `wrote .../Core/Generated/InkGenerated.cs (42811 characters)` | 0 | (not kept) |
| `dotnet run --project CoreTests` | `RESULT: PASS (16527 checks, 0 failed)` | 0 | `coretests_debug.txt` |
| `dotnet run -c Release --project CoreTests` | `RESULT: PASS (16527 checks, 0 failed)` | 0 | `coretests_release.txt` |
| `./check_runtime_against_stubs.sh` | `STUB CHECK: PASS (4 variants compiled and smoke-run against stubs, not against Unity)` | 0 | `stub_check_output.txt` |

Core tests: 59 stat vectors with every field exact; 11 ring traces and 6 solo
traces, every checkpoint bit for bit (hash layout 2, positions, velocities,
armour); self check `self check passed, 111 checkpoints bit-identical`.
Runtime: .NET 8.0.34, X64. The port passed on its first run against the golden
files; there was no failed candidate.

Shared files the tests ran against (unchanged by this Worker, SHA-256):

```text
6e6b63193c06abcb354a5da30f8b97cccd77099d76ca14bfdb695389489f2cf0  ink_tuning.json
acc29657f0bebea594104ce472809859c441a2d2e513639867bf43538d64fb7c  golden/sim_traces.json
a5411b551f37021c3de036b4d5074f923e45876d1f0eec89c8365bac69742c47  golden/stat_vectors.json
```

`bin` and `obj` of both .NET projects were deleted at the end.

## 4. Verified here / not verifiable here

| Part | Verified here | Not verifiable here |
|---|---|---|
| C# core rules version 2 | Bit for bit against all golden vectors and traces, Debug and Release, .NET 8 x64 | Unity Mono, IL2CPP, ARM (the in-game self check shows it per build) |
| Thrown errors, figure check, stake helpers | Own tests in `CoreTests` (not in the golden files) | - |
| Circler bot | Two golden traces (`ring_1v1_circler_vs_rusher`, `ring_4_circlers`) | - |
| Tuning overrides | Trace `solo_time_limit` and an own test | - |
| Runtime files compile | Against the hand-written stubs, four input variants, C# 9 | Against the real engine: member names, overloads, behaviour |
| Game flow (question, clock, figure-check path of a valid figure, stake line, bot style names, ram counter) | Headless smoke run against the stubs: the labels and buttons appear and the flow reaches its end screens | Layout, readability, real GUI event order, real time |
| Drawing clock | Counts stub time, starts the round at 0 in all three cases (valid, last valid, example) | Real seconds in Unity (`Time.unscaledDeltaTime`), behaviour after the window loses focus |
| Blade marks | The painted stroke has the tint colour in the stub texture, a dripped-off block does not | How the tint looks on the four ink colours |
| Stat panel | Text content for one drawing (23-cell stroke: armour 66.9, 23 blade cells) | Whether the rows fit the column at every window size |
| Refused figure message on the drawing screen | Not reached by the smoke run (the start button is disabled for an invalid drawing, so the core check never refuses there) | - |
| Ram flash and note | The game counted 165 to 212 ram events per smoke run | The look of the flash |

## 5. Engine members newly used

None. Every engine member in the changed Runtime files was already used in
version 1 (`GUI.Label`, `GUI.Button`, `GUI.Box`, `GUI.DrawTexture`,
`GUI.enabled`, `Time.unscaledDeltaTime`, `SpriteRenderer.color`, `Color`,
`Color32`, `Rect`, `Event`). The stubs file did not change.

Leftover R1 of the first review: the engine member list of INK-UNITY-V1's
result named a four-argument `Sprite.Create`. That file is outside this
order's allowed paths and was not edited. The correct entry is now in
`Projects/Inkweight/Source/Unity/README.md`, section "Engine members the
Runtime files use": `Sprite.Create(Texture2D, Rect, Vector2, float, uint,
SpriteMeshType)` (six arguments, extrude 0) with `SpriteMeshType.FullRect`,
used twice in `InkArenaView.cs`.

## 6. Gaps found in `CHANGES_V2.md`

No contradiction between the list and the JavaScript was found; the port
written from both passed on its first run. Small omissions, none of which
changed a result:

1. Section D (C# checklist) item 7 does not say that `fights[].upgrade` can
   only be compared when the replay driver records the upgrade result; B13
   and `sim/runner.js` show it. The C# driver now reports it.
2. Section D does not mention the `mass` field of the stat vectors (B13 does).
3. `tuningOverrides` is described as "apply to a copy of the tuning"; the C#
   tuning is a typed object, so the override is applied to the parsed JSON
   before reading. Only number keys that exist can be replaced.
4. The stake index check in JavaScript also refuses fractions; in C# the index
   is an `int`, so only the range is checked.

## 7. Known weaknesses

- Nothing was compiled or run in Unity. The first opening in the Editor is
  still the real test of the presentation layer.
- The stat panel is taller than before (four rows of 58 units). On the enemy
  screen the column is used up to the start button; in a narrow window the
  longer lines may be cut off. Computed by hand, not seen.
- The armour bar end (300 at 220 ink) is a constant from `CHANGES_V2.md` C2,
  not derived from the tuning; the other three bar ends are derived.
- The blade tint is one fixed yellow mix for all ink colours; on Moss and
  Ember it may be weak.
- Blade marks are on the drawing screen only, not on figures in the fight.
- When the clock runs out while the question box is open, the round starts
  and the question is dropped.
- The smoke test uses a time-based seed (as in version 1), so its fights
  differ from run to run; its PASS is about flow, not about fixed outcomes.
- An INK-CORE-V3 order was dispatched while this work ran. The shared files
  had not changed at the last test run. If that order changes the tuning, the
  golden files or a rule, the steps in the README ("Steps after any later
  re-tuning or core correction") must be run again; a rule change needs the
  same change in the C# core.

## 8. Not done

- R1 was not corrected in the INK-UNITY-V1 result file itself (outside the
  allowed paths); see section 5.
- No capability Knowledge Base entry (Inkweight has no capability index, OD-09).
- `Docs/WORK_STATE.md` and `Docs/CURRENT_HANDOVER.md` were not touched (the
  Director maintains them).
