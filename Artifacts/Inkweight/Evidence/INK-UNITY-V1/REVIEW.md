# INK-UNITY-V1 Independent Review

Independent review verdict: PASS

## Re-review after correction round 1

The same independent Reviewer (QA Lead) did this re-review on 2026-11-19,
about 23:50 UTC, by inspection and runs only. I changed no candidate file.
Candidate: commit `c05a89c` ("INK-UNITY-V1 correction round 1"). The working
tree has no further changes under `Projects/Inkweight/Source/Unity`. Compared
with `7ae33cd`, the diff touches only `Runtime/InkInputReader.cs`,
`Runtime/InkArenaView.cs`, `EngineStubs/UnityEngineStubs.cs` and `README.md`,
plus the evidence files `WORKER_RESULT.md`, `core_tests_output_round1.txt` and
`stub_check_output_round1.txt`. The core, `CoreTests` and the generated file
are unchanged.

### Reruns (real output)

```text
dotnet run --project CoreTests
ok    solo trace solo_brawl_full_run (51 checkpoints, bit for bit)
  self check passed, 111 checkpoints bit-identical
ok    self check as run inside Unity (embedded tuning and hashes)
RESULT: PASS (10694 checks, 0 failed)

./check_runtime_against_stubs.sh
== input variant: Legacy       0 Warning(s)  RESULT: PASS (stub smoke test, 1475 frames)
== input variant: InputSystem  0 Warning(s)  RESULT: PASS (stub smoke test, 1475 frames)
== input variant: Both         0 Warning(s)  RESULT: PASS (stub smoke test, 1542 frames)
== input variant: None         0 Warning(s)  RESULT: PASS (stub smoke test, 1575 frames)
STUB CHECK: PASS (4 variants compiled and smoke-run against stubs, not against Unity)
exit 0
```

I deleted `bin`/`obj` afterwards.

### Corrections checked

- **B1 closed.** In `InkInputReader.cs` lines 100-117, the legacy block now
  uses `UnityEngine.Input`, `UnityEngine.Touch` and
  `UnityEngine.TouchPhase.Ended/.Canceled`, fully qualified. Inside
  `namespace Inkweight.Runtime`, the name `UnityEngine` resolves to the global
  namespace, because no `Inkweight.UnityEngine` exists. The helper was renamed
  from `Key` to `Held`, which avoids any confusion with
  `UnityEngine.InputSystem.Key`. A member named `Key` would not have clashed
  anyway, so this is defensive.
- **Remaining unqualified names in the file that imports both namespaces:**
  `Vector2`, `Screen`, `KeyCode`, `Event`, `EventType`, `HashSet`, `List`,
  `InkPointer`, `Keyboard`, `Gamepad`, `Touchscreen`. To my knowledge none of
  the `UnityEngine` ones has a twin directly in `UnityEngine.InputSystem`
  (input events live in `UnityEngine.InputSystem.LowLevel`, which is not
  imported). The other Runtime files do not import `UnityEngine.InputSystem`.
  I see no remaining certain clash. A clash with a public package type unknown
  to me cannot be ruled out without the Editor, and the README now says so.
- **I1 closed.** The stubs now declare `UnityEngine.InputSystem.TouchPhase`
  and other package names, plus `UnityEngine.Gyroscope`. The header comment
  says the list is incomplete. The Worker's scratch proof (old line 113 plus
  the new stubs gives CS0104 in the Both variant) matches my own reproduction
  from the first review.
- **M3: the six-argument `Sprite.Create(texture, rect, pivot, pixelsPerUnit,
  0, SpriteMeshType.FullRect)` call is correct.**
  - Lines 65-66 and 132 make this call. The Scripting API documents this
    overload (search snippets of the 2018.4/2019.x pages show
    `Create(Texture2D, Rect, Vector2, float, uint, SpriteMeshType)`; the
    Unity 6 pages list the longer form with `Vector4 border, bool
    generateFallbackPhysicsShape`).
  - Whether Unity 6 declares the shorter forms as separate overloads or as
    optional parameters, the six-argument call binds either way.
  - The literal `0` converts to `uint` implicitly as a constant.
  - `SpriteMeshType.FullRect` is in `UnityEngine`. The stub values
    (FullRect = 0, Tight = 1) match.
  - Status: confirmed by documentation snippets for the signature;
    page-level confirmation for 6000.3 was not possible, because
    docs.unity3d.com and docs.unity.com are blocked in this session.
- **M5 closed.** `InkArenaView.cs` lines 221-224 now carry the comment on the
  camera-at-origin assumption.
- **I2, I3, M6 closed.**
  - `README.md` now has the Hub fallback: a new empty project, copy
    `Assets/Inkweight`, check the two manifest lines.
  - The input sentence now says it is "checked against stubs only".
  - A new paragraph says what the stub check can and cannot find, including
    name clashes with types it does not list.
  - Section 4 of `WORKER_RESULT.md` was corrected in the same sense.

### Remaining findings

- **Minor R1:** `WORKER_RESULT.md` section 5 (engine API list) still names
  `Sprite.Create(Texture2D, Rect, Vector2, float)` and does not list
  `SpriteMeshType.FullRect`. It should name the six-argument overload. This is
  a documentation precision issue and changes no verdict.
- **Minor, unchanged:** M1 (possible yellow Console warning for the absent
  `Unity.InputSystem` reference), M2 (mouse position under scaled
  `GUI.matrix`) and M4 (minimal module set). All three are honestly named as
  unverified.
- Still true, and honestly stated:
  - Nothing was compiled against the real engine.
  - Bit-exactness is proven on .NET 8 x64 only. The in-game self check shows
    it per build.

### Basis of PASS

- The C# core port is proven bit for bit against the golden files. The first
  review's negative probes showed the comparison reacts to a one-ulp golden
  change and to rounding-order changes alone. The core is unchanged since.
- I can identify no certain compile error or first-Play failure in the Unity
  layer, in any of the four input configurations.
- Every unverified part is named in the README and in the Worker result.

The first review follows below as history.

---

# History: first review (before correction round 1)

First review verdict (superseded): FAIL

Reviewer: separate Claude Code subagent, role QA Lead. I did not build this
work. Review time 2026-11-19, about 23:15 to 23:45 UTC. Candidate: working tree
on top of commit `7ae33cd` ("INK-UNITY-V1 Worker result ..."), files under
`Projects/Inkweight/Source/Unity/`. I changed no candidate file. All probes ran
on a throwaway copy under `/tmp/rev`. The `bin`/`obj` folders created by my runs
were deleted afterwards, and `git status --short --ignored
Projects/Inkweight/Source/Unity` is empty.

Short reason for FAIL: the C# core port is proven bit for bit against the
golden files, and I found no error that would stop compilation or the first
Play **in the configuration as shipped**. But `InkInputReader.cs` will
certainly fail to compile (CS0104) in a configuration that the Worker result
and the README say is supported: Active Input Handling "Both" with the Input
System package installed. The fix is one line (see B1). Once B1 is applied,
nothing else I found blocks a PASS.

## 1. What I ran (real output)

`cd Projects/Inkweight/Source/Unity && dotnet run --project CoreTests`
(.NET 8.0.34, x64), last lines:

```text
ok    solo trace solo_kite_two_waves (19 checkpoints, bit for bit)
  6 fights, 5683 ticks
ok    solo trace solo_brawl_full_run (51 checkpoints, bit for bit)
  self check passed, 111 checkpoints bit-identical
ok    self check as run inside Unity (embedded tuning and hashes)
RESULT: PASS (10694 checks, 0 failed)
exit 0
```

All 14 groups printed `ok` (generated file, versions, source rules, generator
and hash, 43 stat vectors, 6 ring traces, 2 solo traces, embedded self-check).

`./check_runtime_against_stubs.sh`, result lines:

```text
== input variant: Legacy       ... Build succeeded. ... RESULT: PASS (stub smoke test, 1541 frames)
== input variant: InputSystem  ... Build succeeded. ... RESULT: PASS (stub smoke test, 1419 frames)
== input variant: Both         ... Build succeeded. ... RESULT: PASS (stub smoke test, 1487 frames)
== input variant: None         ... Build succeeded. ... RESULT: PASS (stub smoke test, 1528 frames)
STUB CHECK: PASS (4 variants compiled and smoke-run against stubs, not against Unity)
exit 0
```

Each variant reported `0 Warning(s)`. These match the Worker's evidence (the
frame counts differ because the game seeds from the clock).

### Are the tests vacuous? No.

From reading `CoreTests/Program.cs`:

- Doubles are compared with `==` against the JSON values (`Same`, line 140;
  body values line 341; hero values line 428). No tolerance anywhere.
- Every checkpoint compares the 32-bit state hash (`InkHash.Ring` /
  `InkHash.Solo`), which covers the full IEEE bits including the sign of zero,
  plus the listed numbers.
- The number of checkpoints, rounds and fights is checked (lines 364-365,
  458-459), and a surplus is reported, so a run that ends early or produces
  nothing fails.
- The stat-vector test checks every expected field, including `cx`, `cy`,
  `inertia`, `turnRate`, `accelK` and the boundary cell count.
- The C# drivers (`InkReplay`) generate the inputs. If they differed from
  `gen_golden.js`, the hashes would differ, so they are checked too.

Negative probes (on the `/tmp/rev` copy only):

1. Golden file: one body velocity in `ring_1v1_disc_lance` checkpoint 30
   changed by one unit in the last place (1.462512116945695 to
   1.4625121169456952). Result: `RESULT: FAIL (10694 checks, 1 failed)`.
2. Core source: changed only the rounding order of the restitution impulse in
   `InkPhysics.cs` line 391 (`-(1 + r) * rel / invSum` to
   `-(1 + r) * (rel / invSum)`). Result: all 8 traces and the self check
   `FAIL`, `RESULT: FAIL (10734 checks, 5440 failed)`; the stat vectors
   stayed `ok`, which is correct because they do not use that code.

The comparison is truly bit for bit and is sensitive to rounding alone.

## 2. Port fidelity (core)

I read `physics.js` against `InkPhysics.cs`, `ring.js` against `InkRing.cs`,
`rng.js`/`hash.js` against `InkRng.cs`/`InkHash.cs`, and the copy and
throw-interval parts of `solo.js` against `InkSolo.cs`. I also searched all
the core files for `%`, casts, list removal and `foreach`.

- Generator: the xorshift shifts on `uint` with `unchecked` are the same as JS
  `>>> 0`. `Derive`: JS `(seed>>>0) + Math.imul(index+1, k) >>> 0` is equal to
  C# `seed + (uint)(index+1) * k` mod 2^32. `Int` uses `uint %` on a
  non-negative value, which matches. `Float` divides by 16777216.0 as a double.
- Hash: FNV-1a over `DoubleToInt64Bits` bytes from the lowest byte up, so it
  is little-endian on any machine. `-0` keeps its sign. This matches.
- Physics: the loop orders (control, integrate, pairs i<j, wall) and the
  operation order are kept. Some sums are split into temporaries (`ax`, `pax`,
  `iax`, ...); these are rounding-neutral because each is one operation
  followed by `+=`. `Math.Floor` is kept as a double before the range check and
  only then cast to `int`, so there is no truncation-versus-floor problem for
  negatives. The missing-input case uses `new InkInput()` (zero, no dash),
  which is the same as JS `NO_INPUT`.
- Ring: `RadiusAt` mixes int `tick` and double tuning values in the same
  left-to-right order as JS. Slots are the same. Elimination order and the
  same-tick tie-break are the same.
- Solo: `Copies` uses `Math.Floor` on a double, then clamps, then casts; with
  `N = 0` it gives the same result as JS (Infinity, then the clamp). `Tick %
  WobbleTicks` (int % double) is a double `fmod`, the same as JS for
  non-negative operands.
- Culture: `InkJson` parses numbers with `CultureInfo.InvariantCulture`. The
  runtime HUD formats with `InvariantCulture`. The CoreTests project sets
  `InvariantGlobalization`, but that does not hide anything because the core
  passes the culture explicitly.
- I found no C# 10+ feature and no API outside .NET Standard 2.1. This is by
  reading only; the core was not compiled against the netstandard2.1 reference
  pack.

I found no fidelity defect. The golden traces exercise these paths bit for bit
anyway.

## 3. Findings

### Blocker

**B1. `InkInputReader.cs` line 113: `TouchPhase` is ambiguous when both input
backends are active and the Input System package is installed.**
The file has `using UnityEngine;` and, under `INKWEIGHT_INPUT_SYSTEM &&
ENABLE_INPUT_SYSTEM`, `using UnityEngine.InputSystem;`. The Input System
package defines its own enum `UnityEngine.InputSystem.TouchPhase` (package API
docs list it in namespace `UnityEngine.InputSystem`; the Unity forums report
exactly this collision). In the "Both" configuration,
`ENABLE_LEGACY_INPUT_MANAGER` is also defined, so line 113 compiles and fails
with CS0104. I reproduced it on the `/tmp` copy by adding that one real enum to
the stubs:

```text
Inkweight/Assets/Inkweight/Runtime/InkInputReader.cs(113,32): error CS0104: 'TouchPhase' is an ambiguous reference between 'UnityEngine.InputSystem.TouchPhase' and 'UnityEngine.TouchPhase'
Inkweight/Assets/Inkweight/Runtime/InkInputReader.cs(113,63): error CS0104: ...
```

(The Legacy and InputSystem variants still built; the error is Both-only.)

Impact: it does **not** occur with the manifest as shipped (no Input System
package, so `INKWEIGHT_INPUT_SYSTEM` is not defined). It occurs as soon as the
Human installs the Input System package and keeps or chooses "Both", which the
README calls fine ("either answer works"). The Worker result also reports the
Both variant as compiled. That claim is true only against the stubs.

Exact fix (verified on the copy: the Both variant then builds):

```csharp
if (t.phase == UnityEngine.TouchPhase.Ended || t.phase == UnityEngine.TouchPhase.Canceled) continue;
```

Optionally, also write `UnityEngine.Touch t = Input.GetTouch(i);` on line 112
to protect against future collisions. Then add
`public enum TouchPhase { None, Began, Moved, Ended, Canceled, Stationary }` to
the `UnityEngine.InputSystem` namespace in `EngineStubs/UnityEngineStubs.cs`,
so that the stub check catches this class of error (see S1).

### Important

**I1. The stubs cannot detect name collisions between namespaces (cause of
B1).** `UnityEngineStubs.cs` defines in `UnityEngine.InputSystem` only the
types that the Runtime uses. Real `UnityEngine.InputSystem` also contains
`TouchPhase`, `Pointer`, `Mouse`, `InputDevice`, `Key` and more. An ambiguity
error therefore cannot appear against the stubs. Fix: add the colliding public
type names of the real namespace to the stubs (at least `TouchPhase`), and say
in the README that the stub check does not model namespace contents.

**I2. README "Open the project", steps 1-3: there is no fallback if Unity Hub
does not accept a folder without `ProjectSettings`/`ProjectVersion.txt`.** I
believe Hub accepts it and asks for a version, but I could not confirm this
here. Fix: add one sentence. "If Hub refuses the folder, create a new empty
Unity 6.3 project (Universal 2D or Built-in 2D template) and copy
`Assets/Inkweight` into its `Assets` folder; then press Play in any scene." The
code needs nothing else from the project, so this fallback is safe.

**I3. README "Input" section and the "If Unity asks about ... active input
handling, either answer works" line.** Until B1 is fixed, this is wrong for
"Both" with the package installed. After B1 the line is fine.

### Minor

**M1. `Inkweight.Runtime.asmdef`: reference to `Unity.InputSystem`, which does
not exist when the package is absent.** Official packages use the same pattern
(for example the ML-Agents Input extension: a `Unity.InputSystem` reference
plus a `versionDefines` entry on `com.unity.inputsystem`). Name references are
"soft", so I expect no compile error. A yellow Console warning about the
missing assembly is possible. This is unconfirmed. No change needed; the
README already names it.

**M2. `InkweightGame.OnGUI`: the mouse position under a scaled `GUI.matrix`.**
The code sets the matrix first and then reads `Event.current.mousePosition`,
expecting virtual units. Unity's issue tracker says the mouse position is
reported in GUI space. The known problem with a scaled `GUI.matrix` (wrong
hover bounds) affects GUILayout, which this code never uses (I searched: no
`GUILayout`). This is plausible but unconfirmed, and it is already checklist
item 3.

**M3. `InkArenaView.cs` line 63: `Sprite.Create(tex, rect, pivot, ppu)` uses
the default `SpriteMeshType.Tight`.** For the 256 x 256 soft disc, Unity builds
a tight outline mesh from alpha at run time. That is slower and may trim the
soft edge. Proposal: use the long overload with `0, SpriteMeshType.FullRect`
for the disc and the figure sprites. This is cosmetic and costs a little.

**M4. `Packages/manifest.json` has only `imgui` and `inputlegacy`.** Every
other built-in module (audio, physics, ui, ...) is disabled. That is fine for
this code (SpriteRenderer, Camera, Texture2D and Sprite are in the core
module). The first Play may log an audio-listener or a missing-component note
from the default scene's Main Camera. This is unconfirmed and harmless.

**M5. `InkArenaView.WorldToGui` assumes the camera is centred at the origin.**
That is true now, because both arenas are centred at (0, 0) in the core. A
future camera move would break the HUD bars. Add a comment.

**M6. Evidence wording: in WORKER_RESULT.md section 3 / 4, "Both ... Build
succeeded" should say "against stubs".** The table does say that engine names
are unverified, so this is a precision issue, not dishonesty.

## 4. Unity layer: orientation and maths I checked by derivation

- Canvas texture: canvas row 0 is written to texture row H-1
  (`InkCanvasEditor.cs` line 154). `GUI.DrawTexture` shows the top texture
  row at the top, so the canvas appears upright. The mouse-to-cell mapping
  (`DrawGui`, lines 601-602) uses GUI y downward, so it matches row 0 at the
  top. The image is not mirrored.
- Figure sprite: the same row flip (line 123). The pivot is
  `(Cx/W, 1 - Cy/H)`, and that matches the core's local cell centre
  `x + 0.5 - Cx`.
- Rotation: the core maps local to world with c = -fy, s = fx in y-down axes.
  Drawn at (x, -y), this is a rotation of -θ in Unity's y-up frame, where
  θ = atan2(fx, -fy). The code uses `Atan2(-fx, -fy)`, which equals -θ, about
  +z (counter-clockwise as seen from the camera at z = -10). This is correct:
  no mirroring, and the front is the canvas top.
- `WorldToGui` (lines 218-226) is consistent with the y flip for a camera at
  the origin.
- Fixed tick: an accumulator on `Time.unscaledDeltaTime`, at most 6 steps,
  and the backlog is dropped. This is fine.

## 5. Engine API items (status)

Web access: `docs.unity3d.com`, `docs.unity.com` and `issuetracker.unity.com`
were **not reachable** from this container (DNS blocked by the session network
policy). Only web-search snippets were available. So "confirmed" below means
confirmed by search-result snippets of the official docs, or a well-known
stable API checked from knowledge. Every other item is marked unconfirmed. To
confirm by page, `docs.unity3d.com` would have to be allowed in the session's
network settings.

| Item | Status |
|---|---|
| `UnityEngine.InputSystem.TouchPhase` exists (collides with `UnityEngine.TouchPhase`) | confirmed by documentation snippets (package API, namespace `UnityEngine.InputSystem`); **causes B1** |
| `UnityEngine.TouchPhase` (`Ended`, `Canceled`), in InputLegacyModule | confirmed by documentation snippet (6000.x script reference) |
| asmdef `versionDefines` fields `name`/`expression`/`define`, package name as `name` | confirmed by documentation snippet (Assembly Definition file format, 6.3 LTS) |
| asmdef reference to a missing `Unity.InputSystem` is tolerated | unconfirmed (consistent with official ML-Agents pattern; see M1) |
| `noEngineReferences` in asmdef | unconfirmed (from knowledge: valid field) |
| `RuntimeInitializeOnLoadMethod(AfterSceneLoad / SubsystemRegistration)` on a private static method of a static class | unconfirmed (from knowledge: correct usage) |
| `GameObject(string)`, `AddComponent<T>()`, `SetActive`, `Object.DontDestroyOnLoad`, `Object.Destroy`, `Transform.SetParent(Transform,bool)`, `position`/`rotation`/`localScale` | unconfirmed (from knowledge: correct) |
| `Camera.orthographic`, `.orthographicSize`, `.clearFlags`, `.backgroundColor`, `.depth`, `CameraClearFlags.SolidColor` | unconfirmed (from knowledge: correct) |
| `Texture2D(int,int,TextureFormat,bool)`, `SetPixels32(Color32[])`, `SetPixel`, `Apply(bool)`, `filterMode`, `wrapMode`, `TextureFormat.RGBA32` | unconfirmed (from knowledge: correct) |
| `Sprite.Create(Texture2D, Rect, Vector2, float)` | unconfirmed (from knowledge: overload exists; mesh type default Tight, M3) |
| `SpriteRenderer.sprite`, `.color`, `Renderer.enabled`, `.sortingOrder`; runtime-added SpriteRenderer gets the default sprite material | unconfirmed (from knowledge: correct) |
| `GUI.Label/Button(Rect,string,GUIStyle)`, `GUI.Box(Rect,string)`, `GUI.DrawTexture(Rect,Texture)`, `GUI.color/enabled/matrix/skin`, `GUIStyle(GUIStyle)`, `fontSize`, `wordWrap`, `fontStyle`, `alignment`, `normal.textColor` | unconfirmed (from knowledge: correct) |
| `Event.current`, `.type`, `.button`, `.mousePosition`, `.keyCode`, `.Use()`; `EventType` members; `KeyCode` members | unconfirmed (from knowledge: correct) |
| `Event.mousePosition` under scaled `GUI.matrix` is in virtual units | unconfirmed (issue-tracker snippet says GUI space; see M2) |
| `Input.GetAxisRaw`, `GetKey`, `touchCount`, `GetTouch`; `Touch.fingerId/position/phase` | unconfirmed (from knowledge: correct; `GetAxisRaw` throws on a missing axis, which is caught) |
| `Keyboard.current.*Key.isPressed`, `Gamepad.current.leftStick/dpad.ReadValue()`, `buttonSouth/rightShoulder.isPressed`, `Touchscreen.current.touches` (`ReadOnlyArray`, `Count`, indexer), `TouchControl.press/position/touchId` | unconfirmed (from knowledge: correct names and types) |
| `ENABLE_LEGACY_INPUT_MANAGER`, `ENABLE_INPUT_SYSTEM` compile symbols | unconfirmed (from knowledge: correct) |
| `Matrix4x4.TRS`, `Quaternion.Euler/identity`, `Mathf.Sqrt/Atan2(y,x)/Clamp01/Rad2Deg`, `Screen.width/height`, `Time.unscaledDeltaTime`, `Debug.Log/LogError` | unconfirmed (from knowledge: correct; `Atan2` argument order used correctly) |
| `com.unity.modules.imgui`, `com.unity.modules.inputlegacy` module names in Unity 6.3 | unconfirmed (from knowledge: both exist as built-in modules) |

I identified no wrong member name or signature. The only wrong item is the
type collision in B1.

## 6. Stub honesty

The stubs mirror the real signatures I know for every member used (static
versus instance, parameter order, `Renderer.enabled` not inherited from
`Behaviour`, `KeyCode` values). Concrete suspects where a repeated error would
pass:

- The namespace contents of `UnityEngine.InputSystem` (missing `TouchPhase`):
  this **did** hide a real error (B1, I1).
- `Sprite.Create` and `Texture2D` constructor overloads: correct, but stub
  default parameters are not modelled.
- `Event.mousePosition` behaviour under `GUI.matrix`: not modelled at all.
- `GameObject.AddComponent<T>()` has an extra `new()` constraint in the stub.
  It is harmless (the stub is stricter than Unity).

## 7. Open-in-Unity guide and the verified/not-verifiable table

A newcomer can follow the guide. It covers Hub, the version choice, the
expected menu, the self-check line, the checklist and what to report. Gaps:
the Hub fallback (I2) and the wrong "either answer works" line (I3, B1). The
"verified here / not verifiable here" table is honest and complete for what it
lists. It correctly marks engine names, the bootstrap, GUI scaling, devices,
the manifest and the asmdef as unverified. It should add that the stub check
cannot detect namespace collisions (I1).

## 8. Scope

`git status` shows changes only in the untracked or modified files of other
orders (`Artifacts/Inkweight/Evidence/INK-WEB-V1/*.png`). There are none in
the INK-UNITY-V1 paths except this review file. Commit `7ae33cd` contains the
candidate. The candidate files are all inside `Projects/Inkweight/Source/Unity`
and `Artifacts/Inkweight/Evidence/INK-UNITY-V1`. I did not touch
`WebPrototype/app`, `dist` or `build`.

## 9. What turns this into PASS

Apply B1 (fully qualify `UnityEngine.TouchPhase` on line 113 of
`InkInputReader.cs`). Add `UnityEngine.InputSystem.TouchPhase` to the stubs
(I1). Correct the README line and add the Hub fallback (I2, I3). Then rerun
`./check_runtime_against_stubs.sh`. I verified on a copy that the Both variant
builds after this fix. M1 to M6 are optional.
