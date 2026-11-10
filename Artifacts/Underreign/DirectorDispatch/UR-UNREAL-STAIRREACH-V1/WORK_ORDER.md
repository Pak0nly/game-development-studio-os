# Work Order UR-UNREAL-STAIRREACH-V1 — Tell the player when no cinderling can reach a ring

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Routine.
Runs after UR-UNREAL-STAIRFIX-V1 is committed; build on that state.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-UNREAL-STAIRREACH-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-UNREAL-STAIRREACH-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-UNREAL-STAIRREACH-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-UNREAL-STAIRREACH-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

Human (2026-11-10, first test): "Der Fehler war, dass ich keine Treppe oder
Schacht an die dafür angegebene Stelle setzen konnte obwohl genügen Gold
vorhanden war." UR-UNREAL-STAIRFIX-V1 found the likely cause
(`Evidence/UR-UNREAL-STAIRFIX-V1/WORKER_RESULT.md`): at game start the ring on
layer 1 (0 20 7) is accepted and paid, but never built, because the four
cinderlings in the Heart pocket cannot walk to either end; no event tells the
player. Rules stay unchanged; this is player information in the game layer.

## Tasks

1. In the game layer (read-only on the simulation state), work out whether a
   cinderling can currently walk to the work cell of a stair/shaft order (same
   walkability and links the rules use; document the method and its limits).
2. Before ordering: the ring's tooltip and colour say "no cinderling can reach
   it yet - dig a path to it first" when unreachable; ordering stays possible
   (the order will wait), but the centre message says so plainly.
3. After ordering: a waiting stair/shaft order whose work cell is unreachable is
   marked on the ring ("waiting: nobody can reach it") and listed once in the
   event panel; the mark disappears when it becomes reachable or is built. Same
   treatment for other job orders where cheap (dig marks, trap installs); state
   which ones you covered.
4. Tool-bar message attribution (low notes of the UR-UNREAL-STAIRFIX-V1
   review, `Artifacts/Underreign/Evidence/UR-UNREAL-STAIRFIX-V1/REVIEW.md`): a
   pre-check refusal must not be overwritten by an earlier pending order's
   result; orders without `SetOrderMessage` (mark undone, attack) clear a stale
   pending order; two orders in one frame each get their result; "order sent"
   while paused reads plainly ("waits until the game runs").
5. Proof: headless test on Cinder Hollow (ring 0 20 7 at start unreachable and
   marked, then reachable after a dug path and built; ring 1 21 17 reachable);
   existing Automation tests, tool tests, stairfix test and parity still PASS;
   stills of an unreachable ring before and after ordering. Every own run
   frame-capped (60 fps or lower), short, offscreen, one editor process at a time.
6. `Game/SPIELANLEITUNG.md` stair line, and
   `Evidence/UR-UNREAL-STAIRREACH-V1/WORKER_RESULT.md` (external) plus
   `Artifacts/Underreign/Evidence/UR-UNREAL-STAIRREACH-V1/WORKER_RESULT.md` (Studio).

## Limits

- External allowed: `Game`, `Evidence/UR-UNREAL-STAIRREACH-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-UNREAL-STAIRREACH-V1`. `SimulationCpp` and
  everything else read-only; rules and tuning unchanged.
- Do NOT commit or push. Headless/offscreen, never a window in front of the
  Human; build parallelism at most 8. No downloads.
