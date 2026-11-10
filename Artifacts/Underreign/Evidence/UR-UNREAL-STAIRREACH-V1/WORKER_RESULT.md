# WORKER_RESULT UR-UNREAL-STAIRREACH-V1

Worker verify-worker: PASS (receipt 623b3bf8788156d10ad90c67dbba971b494acb64e81a43d999f20033c8ecefa0). Game repository base: HEAD 4a7ca3a
(UR-UNREAL-STAIRFIX-V1). Nothing committed. Rules (`SimulationCpp`, `Lib`) and tuning unchanged; `Underreign.Sim.SyncManifestGuard` PASS.

## Method (task 1)

`FURSimGame::IsLinkReachable(upperLayer, x, y)` and `FURSimGame::GetUnreachableJobs()` (wrapper, read-only). They use the rules' own test of
`JobBoard::PickNearest`: the walker region (`Connectivity::RegionOf`, stairs and shafts included) of any living cinderling must contain a work
cell of the job. Work cells come from the job handler itself (`IJobHandler::GetWorkSpots`; before an order exists, the same cells as
`LinkJobHandler`: the open upper and/or lower end). `GetUnreachableJobs` is refreshed after every tick for jobs that are Open or Blocked
(not being worked on): dig marks, stairs, shafts, trap installs. Reading only: the union-find compresses its paths, which changes no rules state or hash.

Limits: it is topology only. It ignores busy workers, intruders scaring workers off, the last-route rule, a path that exists but is long, and
later map changes (the answer is as of the last tick). A dig mark with no open neighbour (inside rock) is not listed: it waits for the cells
around it, not for a path.

Cause confirmed: at game start all four cinderlings sit in the Heart pocket (layer 3); ring 0 20 7 (layer 1) has the open tunnel cell above
and the open Call-stone cave cell below, but neither is connected to the pocket.

## What changed (all under Game/)

- `Underreign/Source/UnderreignSim/Public/URSimGame.h`, `Private/URSimGame.cpp`: `EURWaitKind`, `FURSimUnreachableJob`, `IsLinkReachable`,
  `GetUnreachableJobs`, `RefreshUnreachable` (called from `RefreshCopies`).
- `Underreign/Source/UnderreignSim/Private/Tests/URLinkReachTests.cpp` (new): `Underreign.Sim.LinkReach`.
- `Underreign/Source/Underreign/Private/URPlayerController.cpp`, `Public/URPlayerController.h`:
  - Task 2: stair tool tooltip "(no cinderling can reach it yet - dig a path to it first)" on a ready ring nobody can reach; the preview
    colour is violet; clicking still orders; centre message "Stair ordered, but no cinderling can reach it yet: dig a path to it first. It waits
    until then."; tool bar "stair ordered (30 gold), but it waits: no cinderling can reach it yet" once the rules accepted it.
  - Task 3: tooltip over a waiting ordered ring / dig mark / trap install: "stair waiting: nobody can reach it" etc.
  - Task 4 (tool-bar attribution): `PendingToolMessages` is a list instead of one slot. A pre-check refusal (`Message`) and every order without
    a success text (mark undone, rectangle cancelled, attack / call back, trigger picked, new chain delay) call `SetPlainToolMessage`, which drops the
    pending results so they cannot overwrite it. Two orders in one frame: all results answered in one tick are joined ("a; refused: b").
    Paused: "order sent: waits until the game runs" (updated every frame while pending).
- `Underreign/Source/Underreign/Private/URPlayView.cpp`, `Public/URPlayView.h`: violet ring (thicker) with a pause mark for a stair / shaft ring
  that is ready but unreachable, or ordered and waiting; violet frames on unreachable dig marks and trap installs of the focused layer;
  `GetWaitLabels()`.
- `Underreign/Source/Underreign/Private/URHUD.cpp`, `Public/URHUD.h`: `DrawHUD` draws the label "waiting: nobody can reach it" over waiting
  stair / shaft rings and trap installs (canvas text, focused layer).
- `Underreign/Source/Underreign/Private/URSimSubsystem.cpp`, `Public/URSimSubsystem.h`: `UpdateWaitingFeed` (one event line per stair, shaft or trap install
  that starts waiting: "Stair at the ring on layer 1 (20,7) waits: no cinderling can reach it. Dig a path to it first."; dig marks: one summing
  line when the first cut-off mark appears), `ShowNotice` (centre message without a feed line). Lines are logged as `UR_WAIT`.
- `Underreign/Source/Underreign/Private/URCaptureDirector.cpp`, `Public/URCaptureDirector.h`, `Scripts/capture.sh`: new mode `stairreach` (13 steps);
  stairfix expectations adjusted (ready ring 0 20 7 now says it cannot be reached; two clicks in one frame now show both results).
- `SPIELANLEITUNG.md` (stair line: violet ring), `README.md` (method, limits, proof commands).

Covered job kinds (task 3): stair, shaft (ring mark, label, tooltip, event line), trap install (frame, label, tooltip, event line), dig marks
(violet frame, tooltip, one summing event line). Not covered: haul, claim, re-arm, repair (no player order of their own; not cheap to attribute).
A pre-order hint for the trap tool is not covered.

## Results (logs in this folder)

- `test_sim.log` (all Automation tests, exit 0): GoldenReplays 4 of 4 PASS, CommandPath 21 of 21 check hashes PASS, PlayerOrders 32 checks PASS,
  LinkPrecheck `RESULT PASS (34 checks, 0 failed)`, SyncManifestGuard 356 files PASS, new `LinkReach` `RESULT PASS (19 checks, 0 failed)`:
  start: ring 0 20 7 accepted by the pre-check but unreachable, ring 1 21 17 reachable; both ordered: 0 20 7 listed as a waiting stair, 1 21 17 not;
  dig mark 0 19 7 beside the cut-off tunnel listed, dig mark 0 30 12 in rock not; stair 1 21 17 built (tick 84), 0 20 7 still listed and unbuilt;
  path dug (layer 2, x 21, y 10 to 16): ring 0 20 7 reachable after 383 ticks (38 s), leaves the list, built 42 ticks (4 s) later.
- `capture_stairreach.log`: `UR_TOOL_TEST RESULT PASS (0 of 13 steps failed)`: tooltip before ordering, centre message and tool bar after the click,
  ring marked and listed exactly once (also 20 s later, still unbuilt), reachable ring without words, order then pre-check refusal in one frame
  (refusal stays), paused order text, replaced after the clock runs, mark undone drops a stale pending order.
- `capture_stairfix.log` (existing mode, map with ring 0 5 5): 13 of 13 PASS. `capture_tooltest.log` (existing tool test): 29 of 29 PASS.
- `capture_playround.log`: parity with the headless reasonable seed-1 recording warped to tick 11988: every `UR_PARITY check` PASS (ticks 600 to
  11400), 0 FAIL, 32 of 32 steps PASS, round plays on to the end screen and "play again".
- Every run: `UR_SAFESTART ... t.MaxFPS 60, r.VSync 1`, offscreen, one editor process at a time, seconds to about 1.5 minutes each.

## Stills (`stills/`, 1920 x 1080)

`reach_ring_before_ordering.png` (violet preview and ring, tooltip "no cinderling can reach it yet - dig a path to it first"),
`reach_ring_ordered_message.png` (centre message and tool bar right after the order), `reach_ring_waiting.png` (violet ring with pause mark,
label "waiting: nobody can reach it", event line, tooltip "already ordered"), `reach_ring_reachable.png` (ring 1 21 17, layer 2: cyan, no words).

## Open points

- The Human's own play session (UnrealEditor with Live Coding, started 19:01) blocked every UBT build until it ended (about 25 minutes of waiting;
  UBT refuses while Live Coding is active); it was not touched. All runs happened after it ended.
- Wording and the violet colour are proposals for the Human's judgement.
- The exact state of the Human's failed attempt is still not known; this order covers the unreachable-ring case found in UR-UNREAL-STAIRFIX-V1.
- An untracked `SimulationCpp/Headless/JobTrace.h` in the game repository is not from this task.

## Correction round 1

Review FAIL (M1) and the Director finding fixed. Files: `URSimSubsystem.cpp/.h`, `URPlayerController.cpp/.h`, `URCaptureDirector.cpp`. Rules, `Lib`, `SimulationCpp` untouched.

1. M1 (flapping lines): `UpdateWaitingFeed` now keeps the last tick each stair / shaft / trap install was seen (`WaitingSeen`) and the last tick any cut-off dig mark was seen. An item or the dig-mark summary is listed again only if it was absent for more than 10 s of game time (100 ticks), so a flapping wait is one wait. Proof: playround log now has 4 `UR_WAIT` lines (before: 11, 7 of them within one game minute), each at least 10 s apart by construction; new stairreach steps (dig mark, unmark, mark again within 10 s: still exactly one summing line and one stair line).
2. Low (refusal reasons): `SetPlainToolMessage` no longer drops pending orders; it marks them silent: their success text stays hidden, a refusal reason still shows. New step: trap order without a Forge followed by a plain message in the same frame ends on "refused: build a Forge first".
3. Low (bar text): tool bar now reads "click a cyan or violet breakthrough ring".
4. Director finding: the tooltip of an ordered ring nobody can reach now reads "already ordered, but it waits: no cinderling can reach it yet - dig a path to it first" (still `reach_ring_waiting.png`, regenerated and viewed).

Reruns (logs replaced in this folder): `test_sim.log` all Automation tests Success (LinkReach 19 checks, LinkPrecheck 34, GoldenReplays, CommandPath, PlayerOrders, SyncManifestGuard); stairreach 18 of 18 steps PASS; stairfix 13 of 13; tooltest 29 of 29; playround 32 of 32, 19 `UR_PARITY check` PASS, 0 FAIL. All runs t.MaxFPS 60, offscreen, one editor process at a time. Nothing committed.
