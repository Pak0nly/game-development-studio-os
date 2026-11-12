# Work Order UR-UNREAL-HOUND-V2 — Hound: repaired run for travel, short smooth bites, in the game

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-UNREAL-HOUND-V2/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-UNREAL-HOUND-V2/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-UNREAL-HOUND-V2/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-UNREAL-HOUND-V2/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact, 2026-11-12)

On the problems found in UR-UNREAL-HOUND-V1 (walk plays ~6.5x too fast in the
game; bite 3.47 s against hits every 1 s; size):

"1: Wie können die alte Laufanimation nutzen, wir haben ja jetzt bessere Grundlagen was Geometrie und Knochenposition angeht. Evtl. reicht das schon aus um die Alte Animation zu fixen. Dazu auch auf Zucken etc. prüfen.
2: Kurze Bisse können wir testen. Sie müssen flüssig aussehen und nicht abgehackt.
3: Jede Kreatur braucht zu Testzwecken einen Skalierungsregler in den Optionen. Aber das erst, wenn mehr Grafik im Spiel ist um das auch in vernünftige Relation setzen zu können."

Point 3 is NOT part of this order (later).

## Background (read first)

- `Evidence/UR-UNREAL-HOUND-V1/WORKER_RESULT.md` (external; how the hound is in
  the game, play rates, the distance-driven walk, the bite trigger, scale 0.55).
- `Evidence/UR-CREATURE-VIDEO-V4/WORKER_RESULT.md` (the twitch cause and fix:
  paw rolls over the toe ball over 2-3 frames at lift-off/touch-down, one
  continuous paw-bend curve, toe ball locked in the world while planted;
  joint-velocity measurement method) and the V3/V2 results for the rig rules
  (anatomical stance width, collar limits, paw orientation).
- The old run: `StyleSample/Creatures/BrandHound/Animations/A_BrandHound_Run.fbx`
  and its action in `StyleSample/Creatures/BrandHound/Source/BrandHound.blend`
  (hand-built V2 gait engine, 5.5 m/s, 13-frame loop); V4 work files in
  `C:/GameDev/Underreign_Assets/AnimWork/UR-CREATURE-VIDEO-V4/` (scripts, blend).

## Tasks

1. **Run (repair the old one, no new video).** Take the V2 run as the base and
   apply the V4 rig rules and contact method: correct stance width and paw
   orientation, paw roll over the toe ball at lift-off and touch-down, toe
   ball locked while planted (no slide), smooth IK/FK and contact
   transitions, collar/ring motion within limits. Measure per-frame angular
   change of upper arm, forearm, thigh and shin around every contact before
   and after (same method as V4) and remove every twitch, jolt or pop
   (target: no single-frame spike clearly above the rest of the cycle).
   Keep the gait type, timing and speed of a canine run. Report the numbers.
2. **Short bite.** From the V4 bite, make a short bite of about 1.0 s
   (matching the rules' hit interval; read the exact interval from the rules
   data, do not change it): a fast forward snap of the head and neck with a
   small body push, jaw open/close, and return, starting and ending in a pose
   that blends cleanly from and back to the run/idle/walk. It must look
   fluid, not choppy: eased in and out, no hard stops, no pops at the loop
   point when bites repeat; it may be more energetic than the long bite
   (the Human wants it more dangerous later). Keep the full V4 bite unchanged.
3. **Proof outside the game (Blender, CPU).** Sharp moving previews (MP4 and
   GIF; side view and game-camera angle) of the repaired run next to the old
   run, a close-up of one front and one hind leg over a few strides, three
   short bites in a row, and the joint-velocity tables. Look at the moving
   result yourself at full frame rate around contacts and bite loop points.
4. **In the game** (Brand-hound only; rules, numbers and maps unchanged; do not
   touch `SimulationCpp` or `Game/Underreign/Source/UnderreignSim`):
   - travel uses the repaired run, its play rate matched to the on-screen
     ground speed by distance (as the walk now); walk only when the hound
     moves slowly (choose a sensible blend by speed; report the threshold and
     the resulting play rates at 1x/2x/4x; aim for about 0.8–1.25 of the
     authored speed for the run);
   - fight: the first attack plays the full V4 bite, each following hit a
     short bite synced to the rules' hit, smooth blends between them; when the
     fight ends, blend back to idle or run;
   - scale stays 0.55 (the `-URHoundScale=` option stays).
   - Import repeatable through the existing `Game/Scripts/setup_hound.*`.
5. **Proof in the game (function check only).** Build passes, existing
   Automation tests green, one gentle-mode start; a short, sharp game-camera
   MP4 and GIF of hounds running and doing repeated short bites, and a
   close-up of a running hound (no slide). Frame-capped, offscreen.
6. Write `Evidence/UR-UNREAL-HOUND-V2/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-UNREAL-HOUND-V2/WORKER_RESULT.md`
   (Studio, plus the verify-worker line) with every changed file, the
   numbers, and the paths of all videos. Save the build and capture logs in
   the external evidence folder. Delete your own temporary capture frame
   folders when done (keep the final videos and stills).

## Limits

- External allowed: `Game/Art/Creatures/BrandHound`,
  `Game/Underreign/Content/Creatures`, `Game/Underreign/Source/Underreign`,
  `Game/Underreign/Config`, `Game/Scripts`, `Game/Captures`, `Game/README.md`,
  `Game/SPIELANLEITUNG.md`, `Evidence/UR-UNREAL-HOUND-V2`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-UNREAL-HOUND-V2`. Work files only under
  `C:/GameDev/Underreign_Assets/AnimWork/UR-UNREAL-HOUND-V2` (absolute paths;
  nothing directly under `C:/`). `StyleSample`, earlier AnimWork folders and
  `C:/GameDev/AnimTools` are read-only. Never touch any Hearthlands folder or
  other `C:/GameDev/*` project.
- GPU: the Human's PC switches off under full GPU load. Every Unreal run is
  frame-capped (30 fps for captures), offscreen or minimised, short, no
  benchmark mode, no path tracing, below-normal priority, limited shader
  compile workers. Blender in background mode, CPU renders. No window in
  front of the Human, no video playback with sound.
- No network, no Seedance, no Meshy, no uploads. No third-party assets.
- Report instead of silently changing the goal if something cannot be solved.
- Do NOT commit or push.
