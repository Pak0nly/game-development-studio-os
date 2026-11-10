# Work Order UR-UNREAL-STAIRFIX-V1 — Stair/shaft refusals and order feedback

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Routine.
Runs after UR-UNREAL-SAFESTART-V1 is committed; build on that state.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-UNREAL-STAIRFIX-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-UNREAL-STAIRFIX-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-UNREAL-STAIRFIX-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-UNREAL-STAIRFIX-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

Human (2026-11-10, first test): "Der Fehler war, dass ich keine Treppe oder
Schacht an die dafür angegebene Stelle setzen konnte obwohl genügen Gold
vorhanden war."

Director read-only finding (verify it, do not trust it blindly): the game's
pre-check `AURPlayerController::CellValidForTool` (Stair case) checks only the
ring, an existing link and bedrock. The rules (`SimulationCpp/Private/Commands/
BuildLinkRules.cpp`) also refuse when neither end is open floor (both cells
still rock), a stair onto a hole, a room or trap part on the cell, a shaft on
Heart/Call-stone/entrance cells, an already queued job, and the last-route rule
during a wave. The controller then still shows "stair ordered" although the
rules refused it, so the player sees no reason.

## Tasks

1. Reproduce headless on Cinder Hollow: a stair and a shaft order on each
   breakthrough ring at game start with enough gold; record what the rules
   answer and what the player sees.
2. Make the tool's pre-check match every refusal rule of `BuildLinkRules`, with
   a plain reason in the tooltip and the centre message (for undug rock: "dig to
   this ring first: one side must be open floor"). Draw rings that cannot take
   a stair right now differently from ready ones.
3. General order feedback for every tool: when the rules refuse an order
   (`CommandRejected` event for the player's sequence), show the refusal reason
   in plain words in the centre message instead of a success text; success text
   only after the order was accepted.
4. Proof: headless tool test covering every refusal reason of the stair/shaft
   tool plus one accepted stair and one accepted shaft that get built; existing
   tool tests and parity still PASS; stills of a ready ring, a not-ready ring
   with tooltip, and a refusal message. Every own run frame-capped (60 fps or
   lower), short, offscreen, one editor process at a time.
5. `Game/SPIELANLEITUNG.md` line about stairs (dig to the ring first), and
   `Evidence/UR-UNREAL-STAIRFIX-V1/WORKER_RESULT.md` (external) plus
   `Artifacts/Underreign/Evidence/UR-UNREAL-STAIRFIX-V1/WORKER_RESULT.md` (Studio).

## Limits

- External allowed: `Game`, `Evidence/UR-UNREAL-STAIRFIX-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-UNREAL-STAIRFIX-V1`. `SimulationCpp` and
  everything else read-only; rules and tuning unchanged.
- Do NOT commit or push. Headless/offscreen, never a window in front of the
  Human; build parallelism at most 8. No downloads.
