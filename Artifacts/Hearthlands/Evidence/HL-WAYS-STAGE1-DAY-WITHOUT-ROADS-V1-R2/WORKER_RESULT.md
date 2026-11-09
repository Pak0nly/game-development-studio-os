# WORKER_RESULT HL-WAYS-STAGE1-DAY-WITHOUT-ROADS-V1-R2

Worker: Claude (Hearthlands Worker). Mode: Discovery. verify-worker: PASS (receipt 2079b7257fed3742112bd9e76cbaeefb21609316c9ff765fd20182497c5c0e67).
Scope additions from the coordinator during the run (relayed, not Human chat): the Human's play test of HL-Game-ways-r1 (ramps, Heart Fire
dwarves, sawmill, quarry), Q-1 "a" (idle dwarves wait where they are), Q-3 "ja" (first buildings of wood, game data costs), the gravel caution
(HD-168, HD-378). Q-2 (waypoint fire repositioning) not built, as instructed.

## Commits (game repository C:/GameDev/Hearthlands, branch main, local only, not pushed)

- fa489bd step 1: ways core round 2 (bank zone, quarry walk radius 28, Heart Fire court, idle wait, game data costs in wood first, sites served
  below the fires' wants, no building on a door torch tile, settings version 2), tests, Explicit probes.
- 7a45f6b step 2: runtime round 2 (no earth ramps on slopes, grass on hidden door flags, outlines for refused finished models, quarry preview with
  ring, face and walk, pebble sample switch, capture parts, starter text).

## Quarry radius

28 tiles on foot (walk over the walk grid from the door torch to the nearest walkable tile beside rock; the hut's own footprint counts as blocked
in the check). Why: the game data's hunter workRadius (28, the farthest-walking worker; woodcutter and forester 8, data quarry 6). On Testtal the
only rock lies across the brook; from the start's own land the shortest walk from an allowed quarry is 24.4 tiles, so 12 to 24 would leave the
player without a quarry at the start (the Human's "nur rot"); 28 gives 14 places at the start. At 1x a round trip takes at most about 85 s on grass.
Proven in the build: a quarry placed from the start land (34,40) was built and delivered stones (captures/sites_neu, ways_log.txt).

## Tests

| Suite | Before (a7e4424) | After (7a45f6b) |
|---|---|---|
| Unity EditMode | 2503 / 2473 passed / 0 failed / 30 skipped (round 1) | 2516 / 2480 / 0 / 36 (logs/editmode-after.xml) |
| dotnet CoreBuild | 2198 / 2196 / 2 failed (round 1) | 2205 / 2203 / 2 failed (logs/dotnet-test-after-full.txt) |

The 2 dotnet failures are the pinned hashes TheDefaultProfilesPlayExactlyAsBeforeTheLevers and TheBoomRunStaysBitIdentical, same expected and
actual values as before round 1 (pre-existing). New tests: R2_Banks_..., R2_Quarry_StandsAnywhere_..., R2_Quarry_TheWorkerWalksToTheFace...,
R2_Sawmill_GetsABuilder_... (fails with the round 1 supply rule, checked), R2_HeartFire_IdleDwarvesGatherInTheCourtyard (incl. no building on a
door torch tile), R2_IdleDwarves_WaitWhereTheyAre_..., R2_BuildingCosts_TheGameDataInWoodFirst. An intermediate EditMode run before the play-test
fixes: logs/editmode-intermediate.xml (2507 / 2476 / 0 / 31).

Determinism: double run, save/load at 4000 and continue, replay, invariants every tick and the fuzz tests pass; pinned hash after 3000 bench
ticks 3533064620650892610 passes in dotnet (net8.0) and Unity EditMode (Mono). Settings version 2: round 1 snapshots refuse to load (by design).

## Parity rerun, idle effect, costs

STAGE1_R2.md (German), raw: tables/dotnet-bench-report-r2.txt (bench 6 and 4 dwarves, idle effect, start quarry walks, game data costs,
walk map), tables/wegesystem_pfade_film_r2.csv (player run 29.1 min: 147 / 75 / 22, all sites).

## Build and starters

C:/GameDev/Hearthlands/Unity/Builds/HL-Game-ways-r2/ (build b5) with "Wegesystem Tag ohne Strassen spielen.cmd" and "Wegesystem Vergleichslauf
(Wegetest-Baustellen).cmd". Game series builds kept: HL-Game-ways-r1, HL-Game-ways-r2; HL-Game-look-r1 deleted. Switches: G pebble sample,
-hlWaysGravel, -hlWaysPads (round 1 ground under buildings).

## Clips and stills

clips/K1_kiesel_aus_gegen_an_tag_1x.mp4, clips/W2_pfade_entstehen_wegesystem_runde2.mp4, clips/W3_pfade_runde1_gegen_runde2.mp4;
vergleich/kiesel_*_aus_gegen_an.jpg, vergleich/orte_*_runde1_gegen_runde2.jpg, vergleich/herzfeuer_hof_runde1_gegen_runde2.jpg,
vergleich/ways_vorschau_*.jpg, vergleich/steinbruch_vom_startgebiet_nach_10min.jpg.

## Launches

7 hidden batch editors on the main folder only (EditMode intermediate, builds b1 to b5, EditMode after), all exit 0. 13 minimised players of
HL-Game-ways-r2 (sites x5 incl. the round 1 comparison, views x2, gravel x2, final sites, views, gravel, paths), all printed exit 0; 3 exit lines
are in logs/launches.txt, the other exit lines were cut by an output filter of my command, no player left running. No Unity in the Wege or Zwerge
folders. HDRP settings and Main.unity rewritten by each build restored (logs/hdrp-settings-rewritten-by-build.txt). Untouched: ProjectSettings.asset,
Wiki, Kevin Iglesias, Source folders.

## Candidate file list (git diff --name-only a7e4424..7a45f6b)

- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysR2ProbeTests.cs sha256 7457062bcbf8753bbb51626c58d517544999057dea0c333fc9782b2ceb8fcbdc size 14383
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysR2ProbeTests.cs.meta sha256 b006b2c333c4e264c8315367b5fc379d8aad69f353d7cf7df7cc891f5480fe4d size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysTests.cs sha256 372d261dddebed701f0a2b0375a248261ebab58bdb7082e00b72e849ad867db2 size 37549
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WalkGrid.cs sha256 f391f97b7079279022024a31bb4d1c623638949471d54c3b8f4801e12514875e size 9188
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysTypes.cs sha256 c7491a5987613e1389b23b3d2a963ced4c156680401a657a24947657126b0ab9 size 27053
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Board.cs sha256 d355ad9947a591d32f300dc1e0a0ffa45eafb6d4830bef20dc4d1ef18b93d267 size 8729
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Build.cs sha256 944af575dc63f42fb59efca258e65a5815463cac812f17d62cb89abba23b05b9 size 21076
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Dwarves.cs sha256 2f013c5c4b437dc1310f4f24fbed2fce3b9f207f80c8bb61506c5f1831b64288 size 26935
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.cs sha256 90b3d23e113fc4ef44d88b6f98563a424a3014e747fa35d2318095b8d9bf3453 size 26166
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/Editor/WaysBuild.cs sha256 d53a290817fdce8c4ee49e1f82166914f632db1d34d7ef6f75942691d8d832df size 3190
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/GameLookMap.cs sha256 f36d1f54893260bb61a25fc222edb81711e0ad612adf85345e8897130a4eb37f size 7175
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysCapture.cs sha256 33f4482590baa8268cd80b355b23b0daea9b09f8be877e722ca392ac0c57f08c size 18519
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.Tools.cs sha256 6d17fa1fbbf1a13567644a57290632f579da6b91537c84295649ed01cccb4a87 size 12623
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.cs sha256 cf0013584a9cff8984b53763f3807d8453a9d14e707851092220f9a44be0bcee size 15819
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGravelLook.cs sha256 9136f925b371a62d60816d17ff4b8f36557ce9d57c0093b3dbaca0f5cd9a4c7f size 9093
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGravelLook.cs.meta sha256 d428040ff1c9ff139f30cc67adb515595eeed18071bbcccd04b108213cc571cc size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysPanel.cs sha256 dbfa06509d7fe9df3194a56ea82301a73f8177ad81fcd80a7fb4389882a58ba1 size 5651
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/ViewMath.cs sha256 5f5e05e0a943be30157eca9e3189c22211ae85e4295172f0a7b5978ac4d1795f size 14606
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/VoxelTerrain.Soft.cs sha256 1fcee1564baa99eacf3983df21d9b827ea1ee0422e5ae0a47d117b9a18013ec5 size 33697
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/WorldView.cs sha256 4547deae2f38192800b91f138e3b854b10e566db2226541e6bb382a9e77e2b15 size 143806
