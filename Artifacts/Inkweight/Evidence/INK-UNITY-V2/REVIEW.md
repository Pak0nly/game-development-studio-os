# INK-UNITY-V2 Independent Review (QA Lead)

Independent review verdict: PASS

Reviewer: independent Claude subagent, role QA Lead. I did not build this work
and changed nothing except this file. Nothing was committed or pushed.

- Base: commit `02c931b` ("INK-UNITY-V1 independent review PASS after
  correction round 1").
- Candidate: `Projects/Inkweight/Source/Unity` in the working tree. At review
  start (01:37 UTC) it was identical to snapshot commit `80f8e8c`; that folder
  had no uncommitted change.
- Review window: 01:36 to about 01:50 UTC, 2026-11-20.

## 1. What I ran (real output)

The shared files I tested against have the same SHA-256 values as the Worker
reports: `ink_tuning.json` 6e6b6319..., `golden/sim_traces.json` acc29657...,
`golden/stat_vectors.json` a5411b55.... Neither the shared files nor the
JavaScript core had an uncommitted change.

All commands were run from `Projects/Inkweight/Source/Unity`.

| Command | Real final lines | Exit |
|---|---|---|
| `dotnet run --project CoreTests` | `ok    generated file is up to date` ... `self check passed, 111 checkpoints bit-identical` / `RESULT: PASS (16527 checks, 0 failed)` | 0 |
| `dotnet run -c Release --project CoreTests` | `RESULT: PASS (16527 checks, 0 failed)` | 0 |
| `./check_runtime_against_stubs.sh` | four times `Build succeeded.` and `RESULT: PASS (stub smoke test, ...)`; last line `STUB CHECK: PASS (4 variants compiled and smoke-run against stubs, not against Unity)` | 0 |

- Runtime: `.NET 8.0.34, X64`.
- Every one of the 11 ring traces and 6 solo traces ends with
  `ok ... bit for bit`, and the stat vectors end with
  `ok    stat vectors (59 drawings, every field exact)`.
- The generated file is current: the test reports it as up to date.
- Afterwards I deleted `bin` and `obj` of both projects. A `find` confirmed
  that none is left.

### Negative probes

I made a throwaway copy under `/tmp/inkprobe` and ran it with `--shared`
pointing at the real `Source/Shared`. I deleted the copy afterwards.

1. `TouchDamage` took the armour cut from the attacker's `MaxHp` instead of
   the victim's (`InkPhysics.cs` line 400). Result: 8 ring traces and the solo
   traces FAIL.
2. The extra separation loop made one pass too many (`pass <=` instead of
   `pass <`, line 463). Result: ring traces FAIL, for example
   `ring_3_star_wedge_needle checkpoint 5 (round 1 tick 600) hash: got '5c64e078', expected 'a1355c12'`.
3. A drop always paid the enemy's `N` and ignored `run.DropValue`
   (`InkSolo.cs` line 422). Result: all 5 affected solo traces and the
   in-Unity self check FAIL, `RESULT: FAIL (16512 checks, 598 failed)`.

The tests still bite on the new physics, damage and solo code.

### Branch coverage probe

I added counters to the same throwaway copy and ran the whole test suite. The
version 2 branches below were reached the given number of times:

| Branch | Hits |
|---|---|
| deepest-contact normal used | 226 |
| centre fallback | 3 |
| extra separation pass | 3929 |
| dash contact with `rel >= 0` (no impulse, dash still ends) | 67 |
| both bodies dashing | 20 |
| sub-steps above 1 | 61328 |
| sub-steps at the cap of 8 | 357 |
| partial turn step | 210388 |
| sharp touch with sharpness below blunt | 53 |
| shot passes an enemy at 0 armour | 34 |
| drop pays the staked value | 33 |
| drop falls back to the enemy's `N` (boss fight) | 6 |
| stake index 0 / 1 / 2 | 11 / 4 / 8 |
| wave armour scale between the limits | 26 |
| wave armour scale at the lower limit | 1 |

**Reached by nothing**, neither the golden traces nor the port's own tests:

- the throw target search skipping an enemy at 0 armour (B11, first half;
  `InkSolo.cs` line 334);
- the upper clamp of the wave armour scale (`copyArmourScaleMax`);
- the `(1, 0)` normal fallback, which is unchanged since version 1.

All three are one-line branches, ported verbatim from the JavaScript.

**Covered only by the port's own tests** (the "rules version 2" group in
`CoreTests/Program.cs`, not by the golden files):

- `CheckFigure` and its three results;
- both thrown errors, with the state unchanged afterwards;
- the stake helpers and the enemy damage, speed and armour multipliers of a
  spawned copy;
- the unknown-key refusal of a tuning override.

## 2. Port fidelity (side by side with `WebPrototype/core`)

I read these JavaScript and C# parts against each other:

- the control step (`turning`, `turnDx` and `turnDy`);
- the cooldowns, which count down once per tick;
- the sub-step count (`floor(maxSpeed * dt / maxStepCells) + 1`, capped) and
  `h = dt / sub`;
- the turn inside the sub-steps (`t = turnRate / (2 * tickRate * sub)`; the
  C# `tt = t * t` is the same product);
- the integration, and the pairs `i < j` scanned in every sub-step;
- `ScanCells` and the deepest-contact vector (strictly greater depth wins; a
  contact at distance 0 gives the vector (0, 0));
- `ContactNormal` (the `deepNormalShare` rule, then the two old fallbacks);
- the first push and the extra passes (positions only; the normal, the flags
  and the impulse come from the first scan);
- the dash restitution, the dash end and the `ram` events (order: a, then b,
  then the hits; also inside one team);
- `TouchDamage`: `max(blunt, sharpness)` plus `sharpArmourCut * victim.MaxHp`;
- B1 `IsSharpCell`, B2 sharpness, B3 `CountEnclosed`, `PocketCells` (a
  `double`, so a fractional cap would also be exact), `Push` and the armour
  sum left to right; `Mass = Stats.Push`;
- B8 `CheckFigure` and the `StartRound` refusal before any state change;
- B9 rusher and circler: target choice, crowd count, radial clamp, `side`
  taken from the sign of the wobble, the attack branch without wobble, the
  dash condition with no draw from the generator;
- B10 `Copies`, `WaveArmourScale`, `EnemyArmour`, `DropValue`, the spawn
  multipliers and their order, and the boss with stake 0, `DropValue` 0 and
  scale 1;
- B11 both skips;
- B12 both hash layouts, field by field;
- the replay driver: `BotStyles`, `heroInk:` and `weaponInk:` redraws (cells
  recoloured to Black), the `onUpgrade` result, the per-item
  `checkpointEvery`, and tuning overrides.

I found no divergence.

C# pitfalls checked:

- Everything is `double`.
- The `int` casts come after `Math.Floor`, or happen on values that are
  non-negative and whole. `(int)subD` is taken after the floor and the cap.
- `%` is used only on non-negative values: `Tick % WobbleTicks` and
  `k % W`.
- No unsigned arithmetic is new.
- No list is changed while it is iterated: events are appended to
  `world.Events`, not to the list being read.
- No struct copy is lost: `InkHash` is passed by `ref`, as before.
- Culture: the new number formats (`F2`, `Mult`) use `InvariantCulture`.

The generator refuses to proceed if the ring and solo self-check traces have
different `checkpointEvery` values. The single `InkGenerated.CheckpointEvery`
cannot go silently wrong.

## 3. The four gaps the Worker reported in `CHANGES_V2.md`

All four are real and harmless:

1. `fights[].upgrade` needs the driver to report the upgrade result. Section
   D7 does not say so; B13 and `sim/runner.js` show it. This is a
   documentation omission only. The C# driver now reports the result, and the
   traces compare it.
2. The `mass` field of the stat vectors is named in B13 but not in D. This is
   an omission only, and the tests compare `mass`.
3. Overrides are applied to the parsed JSON before the typed read. This is
   equivalent for every override the golden file holds
   (`solo.waveMaxTicks`). An unknown key is refused, and the port's own test
   proves the refusal.
4. A fractional stake index cannot occur with an `int`. This is a harmless
   difference of language, not of rules.

## 4. Unity layer (`InkweightGame.cs`, `InkCanvasEditor.cs`, `InkArenaView.cs`)

**Engine members.** I extracted every engine identifier from the added lines:
`Color`, `Color32`, `GUI.Box`, `GUI.Button`, `GUI.DrawTexture`, `GUI.Label`,
`Rect`, `Time.unscaledDeltaTime`. All of them were already used in the
reviewed version 1 (`GUI.Box` appears twice at `02c931b`).
`EngineStubs/UnityEngineStubs.cs` is unchanged. The Worker's claim "none new"
holds.

**Name clashes.** The new identifiers are the nested enum `Ask` and these
private members: `ask`, `ram`, `F2`, `Mult`, `StatRow`, `PreviewFigure`,
`AskText`, `AskGui`, `FightNote`, `BodyMark`, `BeginEdit`, `UpdateDrawClock`,
`RequestMenu`, `BotStyleNames`, `BladeMark`, `BladeTint`, `Revision`. None of
them is a type name in `UnityEngine` or `UnityEngine.InputSystem`. Nested and
member names would shadow such a type in any case. `InkweightGame.cs` does
not import `UnityEngine.InputSystem`.

**Compile and first Play.** I can identify no certain compile error and no
certain first-Play failure:

- The `Color32` constructor takes byte constants.
- The `Color32` fields `r`, `g`, `b` are lower case, as in Unity.
- The sibling-scope `copies` variables are legal C#.
- IMGUI with `GUI.*` (not `GUILayout`) allows the controls to change between
  events, so the early `return` for the question box is safe.

**Drawing clock.**

- **Start:** the clock starts at the first `Revision` change after
  `BeginRingDraw`. A kept drawing does not start it until it is touched.
- **Expiry with a valid drawing:** the round starts.
- **Expiry with an invalid drawing:** if there is a last valid state, that
  state starts; otherwise an example figure starts (`PickBotDrawing`, valid
  at 220, which is never more than the seat's budget). The note in the fight
  names which.
- **Expiry with an empty drawing:** the same as an invalid one.
- **Discard question:** answering yes to "Leeren" is itself a change, so the
  clock runs and the cleared drawing's last valid state is used. That matches
  the message.
- The clock and `CheckFigure` use the same budget,
  `InkRing.InkBudget(match, 0)`.
- **Pause:** the game has no pause. The clock keeps running while a question
  box is open (see m1).

**Discard question.**

- It is asked by "Leeren", "Beispiel laden", "Menü" and Esc on the drawing
  screen when there is ink. "Abbrechen" of an upgrade redraw asks only when
  the drawing changed.
- Esc closes an open question.
- `BeginEdit` clears any open question at the start of every drawing screen,
  and `GoMenu` clears it too.

**Figure check before a round.** `StartRingRound` checks the player's figure
and each bot figure with `CheckFigure`. A failing bot figure is replaced by
the player's figure. `StartRound` sits inside a `try`/`catch`, so a refusal
cannot crash the game.

**Stat panel and bar ends.** I checked them against the tuning:

- Armour: 60 to 300, scaled by budget / 220 above 220.
- Sharpness: `sharpBase + sharpMax + sharpPurity / (1 + 12 / 60)` = 4.7. No
  drawing of 1 to 12 cells exceeds about 4.53, weapons included.
- Speed: from 9.17 (220 ink) to 32.44 (12 cells).
- Weight: `N / budget`.

The constant 300 for armour matches C2. The README and the Worker result name
it as a constant.

The four German lines are true for rules version 2:

- "Mehr Tinte schiebt stärker, ist aber langsamer": mass is `push`, speed
  comes from `N`.
- "Gefüllte Flächen panzern, Hohlräume ein wenig": core cells give 1.0, any
  cell 0.3, a pocket cell 0.3.
- "Klingen sind Striche, nur ein Feld dick (gelb)": this is the 2 x 2 rule,
  and the tint uses `IsSharpCell` on the extracted body, the same input as
  `ComputeStats`.
- "Weniger Tinte ist schneller".

The menu line "Striche von einem Feld Breite sind Klingen" is also correct.

**Stake line.** The numbers come straight from the core:

- enemy count from `Copies`;
- armour from `EnemyArmour` × `WaveArmourScale`, using a preview figure built
  with the same kind and with `EnemyInkBudget`;
- `StakeDamageMult` and `StakeSpeedMult`;
- `DropValue`.

The README example is correct for the tuning: stakes 1, 1.5, 2 give damage
x1, x1.25, x1.5 and speed x1, x1.1, x1.2.

**Ram feedback.**

- "Rammstoß!" appears when `From == 0`, "Gerammt!" when `To == 0`.
- The rammer gets the yellow tint for 12 ticks. A red hit flash takes
  priority over it.
- Enemy-to-enemy rams in solo give the flash only.

This matches the core events.

## 5. README

A newcomer can follow it:

- how to open the project, with the fallback;
- what Play shows, including the exact self-check line, which matches the
  code string and `ink-tuning-2`;
- the stat panel with its reference values;
- the clock, the question, the bot styles, the ram feedback and the stake
  line;
- a 12-item checklist;
- what to report.

The "verified here / not verifiable here" table in `WORKER_RESULT.md` section
4 is honest:

- The stub smoke test is named as flow-only.
- Real time, focus loss, layout, tint readability and the real engine are
  named as unverifiable.
- The unreachable refused-figure message is stated openly.
- The leftover R1 is resolved in the README: the six-argument
  `Sprite.Create` and `SpriteMeshType.FullRect` are listed.

## 6. Scope

In the Worker snapshot `80f8e8c`, this order's paths are
`Projects/Inkweight/Source/Unity` and `Artifacts/Inkweight/Evidence/INK-UNITY-V2`.
The same snapshot commit also contains changes in `WebPrototype/app`, `build`
and `dist`. These belong to INK-WEB-V3, which the Director snapshotted at the
same time; nothing in them refers to the Unity work. The shared files and the
JavaScript core have no uncommitted change. I found no out-of-scope mutation
attributable to this order.

## 7. Findings

### Blocker

None.

### Important

None.

### Minor

- **m1, the clock keeps running behind the question box**
  (`InkweightGame.cs` `UpdateDrawClock`, about lines 318-347). When the
  30 seconds run out while "Zurück zum Menü?" or "Leeren?" is open, the
  question is dropped and the round starts. The player's pending choice
  ("Menü") is overridden. The Worker names this in its weaknesses; the README
  does not.
  - Fix: either return from `UpdateDrawClock` while `ask != Ask.None`, which
    holds the clock at its current value, or add one sentence in the README
    "What should happen on Play" Ring bullet.
- **m2, focus loss can expire the clock at once.** `Time.unscaledDeltaTime`
  is not capped by `maximumDeltaTime`, so the first frame after a stall can
  remove several seconds. This is named as unverifiable.
  - Fix (optional): subtract `Mathf.Min(Time.unscaledDeltaTime, 0.25f)`, or
    clamp in code with an existing member.
- **m3, coverage gaps.** Nothing reaches the throw-target skip of an enemy at
  0 armour (B11, `InkSolo.cs` line 334) or the `copyArmourScaleMax` clamp.
  This is the golden set's gap more than the port's; the code is verbatim.
  - Fix: one own test in `TestRulesV2`: a stake and design where
    `WaveArmourScale` returns 2, and one tick with an enemy at `Hp <= 0`
    nearest to the hero. Alternatively, ask the core order for a golden case.
- **m4, the "Menü" button still reacts while a question is open.**
  `OnGUI` draws it after `DrawGui` returns early, so clicking it replaces the
  open question with the menu question. This is harmless. The comment on
  `AskGui` ("Nothing else on the drawing screen reacts") is slightly too
  strong.
  - Fix: skip that button while `ask != Ask.None`, or soften the comment.
- **m5, the README says the "Stürmer" runs at you.** The README section "What
  should happen on Play" describes the "Stürmer" as "runs at you". The rusher
  targets the nearest living figure, which is not necessarily the player in a
  3- or 4-seat ring.
  - Fix: "runs at the nearest figure".
- **m6, a refusal message can go stale.** After a `CheckFigure` refusal,
  `message` stays on the drawing screen until the next `BeginRingDraw`, even
  when the drawing becomes valid. The path is practically unreachable,
  because the start button is disabled for invalid drawings.
  - Fix: clear `message` when `editor.Revision` changes.
- **m7, the Ring title may wrap.** The Ring title with the clock suffix is
  about 76 characters at font size 26 in a 40-unit-high label. It may wrap
  or be cut at 4:3 or in a narrow window.
  - Fix: show the clock on its own line, or add it to checklist item 4.
- **m8, a fight note can carry over.** A leftover `fightNote` (for example
  "Gerammt!" with ticks left) can show for a moment at the start of the next
  round.
  - Fix: reset `fightNoteTicks` in `ResetFight`.

### Still true, honestly stated

- Nothing was compiled against the real engine. The stubs were written from
  memory.
- Bit-exactness is proven on .NET 8 x64 only. The in-game self check shows it
  per build (Mono, IL2CPP, ARM).
- If INK-CORE-V3 changes the tuning, a rule or the golden files, the README
  steps "after any later re-tuning or core correction" must be run again.
  These results hold for the shared hashes listed in section 1.

## 8. Basis of PASS

- The C# core is proven bit for bit against the version 2 golden files, in
  Debug and in Release. Three negative probes show that the comparison
  catches errors in the new damage, separation and drop code.
- I can identify no error in the Unity layer that would stop compilation or
  first Play, or show the player something false: the stat lines, bar ends,
  stake line, bot style names and ram notes match the core.
- Every unverified part is named in the README and in the Worker result. The
  minor items above are corrections of comfort and wording, not conditions of
  this verdict.
