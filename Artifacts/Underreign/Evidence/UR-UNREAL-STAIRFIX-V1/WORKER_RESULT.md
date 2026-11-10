# WORKER_RESULT UR-UNREAL-STAIRFIX-V1

Worker verify-worker: PASS (receipt 1925ee2a...). Game repository base: HEAD 1ec2cb7 (UR-UNREAL-SAFESTART-V1). Nothing committed.

## Reproduced cause

Run: `Underreign.Sim.LinkPrecheck` (log: `test_sim.log`, lines `UR_SIM_TEST linkcheck`).

- The old pre-check (`CellValidForTool`, Stair case) tested only: breakthrough ring, an existing link, bedrock. `BuildLinkRules`
  also refuses: both ends rock, a stair onto a hole, a room on either cell, a trap part on the upper cell, an already queued job,
  a shaft on Heart / Call-stone / entrance, and a shaft that would cut the last route during a wave. In all of these the old
  controller set "stair ordered" at once and the rules refused one tick later (`InvalidTarget` = "not possible there", or
  `AlreadyExists` = "already there"); the success text stayed on the tool bar next to the refusal.
- Cinder Hollow at game start: both free rings (0 20 7 and 1 21 17) are accepted by the rules for stair and shaft (gold 500).
  Both ends rock does not occur on the map's own rings at start; it occurs only on a ring nobody dug to (test map with the extra
  ring 0 5 5).
- Also found (not a rules refusal): at game start the four cinderlings sit sealed in the Heart pocket (layer 3). A stair or shaft
  ordered at ring 0 20 7 is accepted and paid, but is never built (300 s simulated: job open, no worker moves, no JobBlocked
  event). Ring 1 21 17 is built in 8 s. Not changed (rules read-only); see open points.
- Rules answers recorded (pre-check / rules): NotBreakthrough / NotABreakthroughPoint, Bedrock / InvalidTarget, BothRock /
  InvalidTarget, StairOnHole / InvalidTarget, AlreadyBuilt / AlreadyExists, Room / InvalidTarget, TrapPart / InvalidTarget,
  JobQueued / AlreadyExists, SpecialCell / InvalidTarget, LastRoute / LastStairRoute, gold: NotEnoughGold.
- The exact state of the Human's failed attempt is not known; a room or a queued job on the ring, or the sealed ring 0 20 7, fit
  "could not place although enough gold".

## What changed (all under Game/)

- `Underreign/Source/UnderreignSim/Public/URSimGame.h`, `Private/URSimGame.cpp`: `enum EURLinkBlock` and `FURSimGame::CheckLink(upper layer, x, y, shaft)`:
  mirrors `BuildLinkRules::Apply` check by check in the same order, read-only (uses the library's grid, job board and `LastRouteRule`). Price not included.
- `Private/URPlayerController.cpp`, `Public/URPlayerController.h`: Stair case of `CellValidForTool` uses `CheckLink` with a plain reason per rule
  (undug rock: "dig to this ring first: one side must be open floor") plus a gold check ("not enough gold (N needed, you have M)").
  The reason appears in the tooltip and, on a click, in the centre message; no order is sent.
  General order feedback for every tool: `SetOrderMessage` / `ResolveOrderMessage`: the success text of an order ("stair ordered", "dig 3 x 1",
  "chain laid", ...) is shown only after the rules accepted the order (tool bar shows "order sent ..." meanwhile); a refusal shows
  "refused: <reason>" on the tool bar, and the existing centre message "<Order> refused: <reason>." from the `CommandRejected` event stays.
- `Private/URPlayView.cpp`, `Public/URPlayView.h`: rings the rules would refuse now are drawn amber and thin without the light column
  (stair tool: the current mode, stair or shaft; otherwise: neither stair nor shaft possible); ready rings stay cyan.
- `Private/URCaptureDirector.cpp`, `Public/URCaptureDirector.h`, `Scripts/capture.sh`: new mode `stairfix` (13 steps); `capture.sh` takes `URCAPDIR` for the output folder.
- `Underreign/Source/UnderreignSim/Private/Tests/URLinkPrecheckTests.cpp` (new): `Underreign.Sim.LinkPrecheck`.
- `SPIELANLEITUNG.md` (stairs line: dig to the ring first, amber ring, reason in tooltip), `README.md` (proof run).
- Rules (`SimulationCpp`, `Lib`) and tuning unchanged; `Underreign.Sim.SyncManifestGuard` PASS.

## Results (logs in this folder)

- `test_sim.log` (all Automation tests, exit 0): GoldenReplays 4 of 4 PASS, CommandPath 21 of 21 check hashes PASS, PlayerOrders 32 checks PASS,
  SyncManifestGuard 356 files PASS, LinkPrecheck `RESULT PASS (34 checks, 0 failed)`:
  every refusal reason above (pre-check and the rules' real answer for the same order agree); start rings accepted (stair and shaft);
  a stair onto a hole refused while a shaft above a hole is accepted; Nest on the pocket floor refuses the ring above; queued job;
  Call-stone and entrance shaft; gold 5 below price; one stair and one shaft at ring 1 21 17 are accepted and BUILT (83 ticks, 8 s each);
  in the played seed-8 game (every open cell an extra ring) a Room, a TrapPart, a LastRoute (tick 3900, shaft) and a JobQueued refusal were
  found by the pre-check and the real order was refused with the matching rules reason.
- `capture_stairfix.log`: `UR_TOOL_TEST RESULT PASS (0 of 13 steps failed)` (rock ring: tooltip and click give "dig to this ring first", no order sent;
  two clicks in one frame: second refused `AlreadyExists`, centre message and tool bar show the refusal, no "ordered"; pocket ring: "stair ordered" only after
  acceptance; trap without Forge: refused `NoForge`, no success text).
- `capture_tooltest.log`: existing tool test `UR_TOOL_TEST RESULT PASS (0 of 29 steps failed)`.
- `capture_playround.log`: parity with the headless recording of the reasonable seed-1 bot, warped to tick 11988: all `UR_PARITY check` lines PASS
  (ticks 600 to 11400 and the warp end), the round plays to VICTORY at tick 12755, `play again starts the map anew PASS`; 32 of 32 steps PASS.
- Every run: `UR_SAFESTART ... t.MaxFPS 60, r.VSync 1`, offscreen, one editor process at a time, each run took seconds to about 1.5 minutes.

## Stills (`stills/`, 1920 x 1080)

`stair_ring_ready.png` (cyan ready ring, light column, tooltip without reason), `stair_ring_not_ready.png` (amber thin ring over rock, tooltip "dig to this
ring first"), `stair_refusal_message.png` (centre message and tool bar), `order_refused_by_rules.png` (rules refusal "Stair refused: already there.", tool bar
"refused", no success text), `stair_ring_ordered.png` (ring amber while the order waits, tooltip "already ordered"), `order_refused_trap.png` ("Pressure Plate refused:
build a Forge first.", tool bar "refused: build a Forge first"). Map for them: `stairfix_rockring.map.txt` (Cinder Hollow plus breakthrough point 0 5 5).

## Open points

- Ring 0 20 7 at game start: accepted and paid, never built (workers sealed in the Heart pocket, no JobBlocked event). The tool cannot tell, the
  rules and tooltip do not either. If the Human tried this ring first, this may be his experience. Needs a Human/Director decision (a hint in the tooltip such as
  "a cinderling must be able to walk to one end", or a rules-side unreachable signal); not changed here.
- The centre message fades after about 3 s real time (existing behaviour).
- The stairfix map is Cinder Hollow with one added breakthrough point, for the proof only.
