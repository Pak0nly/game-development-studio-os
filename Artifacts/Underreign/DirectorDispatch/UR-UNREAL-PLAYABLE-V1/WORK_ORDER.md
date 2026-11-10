# Work Order UR-UNREAL-PLAYABLE-V1 — First version the Human can play (rules 4, traps, stairs, attack)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-UNREAL-PLAYABLE-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-UNREAL-PLAYABLE-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-UNREAL-PLAYABLE-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-UNREAL-PLAYABLE-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

The rules are now version 4 (commit 69a1bea: fixed breakthrough points, attack
goal; UD-37, UD-47, UD-48). The bot wins only about 23 %. Asked whether to
weaken wave 3, the Human answered (2026-11-10): "Erst selbst spielen". So the
Human needs a version to play today, with the unchanged rules-4 tuning.

## Tasks

1. **Resync** the rules module to the committed HEAD with `Game/Scripts/sync_sim.py`
   (rules 4; data now from `SimulationCpp/Data`), adapt the wrapper to the new
   `ISimView` methods and enum shift, rerun the Automation tests (four new
   golden replays) and the game-layer parity check against the headless runner
   of the same commit at four ticks.
2. **What the player needs for a real test round on Cinder Hollow** (plan
   `Design/Planning/PROTOTYPE_PLAN.md`, controls section; keep it simple and
   mouse-friendly; C++ only):
   - stair/shaft tool, usable only at fixed breakthrough points (show them);
   - trap tool: place the six prototype trap parts on claimed ground, and a
     simple wiring mode (click a trigger, then the effects to chain; also across
     layers through the layer keys), "show machine" highlight, remove;
   - the attack order: a clearly visible button/key once the camp opens, plus
     call back; camp area and guards drawn; win/lose screen with "play again";
   - Heart, Call-stone, creatures, intruders and trap parts readable as
     placeholders with name labels on hover; a tooltip or small help panel with
     all keys; heat shown simply where it matters (optional overlay key H).
3. **Easy start for the Human**: `Game/Play Underreign.bat` (double-click,
   windowed 1920 × 1080, opens Cinder Hollow from the start, speed 1×, paused
   with a short in-game "how to play" panel until a key is pressed). A packaged
   build is optional; the bat may start the editor binary with `-game`.
4. **Proof**: headless tool tests for every new tool, parity PASS, a short
   offscreen PNG sequence of a scripted round placing and wiring a trap and
   sending the attack, stills, frame time.
5. `Game/README.md` update and a one-page German quick guide
   `Game/SPIELANLEITUNG.md` (plain player language, keys and goal);
   `Evidence/UR-UNREAL-PLAYABLE-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-UNREAL-PLAYABLE-V1/WORKER_RESULT.md` (Studio).

## Limits

- External allowed: `Game`, `Evidence/UR-UNREAL-PLAYABLE-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-UNREAL-PLAYABLE-V1`. `SimulationCpp` and
  everything else read-only (rules and tuning stay unchanged).
- Do NOT commit or push. Your own runs headless/offscreen, one editor process at
  a time, never a window in front of the Human; build parallelism at most 8.
  No downloads.
