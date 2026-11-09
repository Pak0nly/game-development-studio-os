# WORKER_RESULT HL-WAYS-STAGE1-DAY-WITHOUT-ROADS-V1-R3

Worker: Claude (Hearthlands Worker). Mode: Discovery. verify-worker: PASS (receipt af9c4f59c9e4ed065adf50e3888fe6184e52577b5815d5675e79121442d26bd3).
Paused once for an announced PC shutdown and resumed after the Human's correction (relayed by the coordinator).

## Commit (game repository C:/GameDev/Hearthlands, branch main, local only, not pushed)

- 42a4be0 on 7a45f6b: core round 3 and runtime round 3 (named "interim" because it was committed at the shutdown safe point; it is the
  round's whole code change, no later code change).

## Items: cause and fix

1. Quarry: radius 28 allowed 14 of 300 start-land places; sweep from the start camera through the player's tool code (ToolsAt): 27 of 1218
   screen points green (691 "no rock in reach"); radius 48 (farthest walk from the start land): 714 green; placed by a click through the tool
   code, finished 35 s later, stones made and carried. Preview shows the walk line instead of the radius ring.
2. Store: WaysBuildingKind.Store / WaysStoreKind.Store for the origin store and built stores; producer surplus and fire surplus (above wants
   + FireSurplusMargin 2) to the nearest store within StoreReach 24 tiles; StoreCapacity 40 per ware; stores are sources for sites, fires and
   workshops; switch storeSurplus. Free game 11 min: store 32 logs / 10 game (round 2 switches: 0).
3. Overlap: core spreads idle waiting spots (spreadPermille 450, deterministic ring search); drawing keeps dwarves 0.42 tiles apart,
   walkers sideways only. Yard clip measurement: hof_ueberlappung.csv per run.
4. Logs: DwarfLook.WareLong, the carried log 1.5x along its long side.
5. Chop: the ways game fed whole ticks (10 per second) into the work motions and felling; now GameClock = ticks + fraction.
6. Slopes: HeightField.Pad.Cut / WaysBase: high side cut down with a 0.45-tile slope, no fill, stone plinth (PlacedArt) on the low side;
   -hlWaysBase natural = round 2.
7. Refused models: WorldView.ExtraFootprints; the ways game draws every building the host refuses with its model (site or finished),
   with plot ground and base; -hlWaysR2Outlines = round 2.
8. Gravel: TroddenGround.GravelAmount mixes the ground's gravel layer (max 0.35, patchy noise and speckle) into worn path cells behind G
   (off by default); voxel pebbles removed.

## Tests, determinism, parity

See the section "Suites" below (filled from logs/dotnet-test-after-full.txt and logs/editmode-after.xml). Determinism: double run,
save/load, replay, invariants and fuzz in the suites; pinned hash after 3000 bench ticks 1385786388383732086 (settings version 3).
Parity rerun: tables/dotnet-bench-report-r3.txt.

## Suites

| Suite | Round 2 (7a45f6b) | Round 3 (42a4be0) |
|---|---|---|
| dotnet CoreBuild | 2205 / 2203 / 2 failed | 2214 / 2212 / 2 failed (logs/dotnet-test-after-full.txt, local log, ignored by git) |
| Unity EditMode | 2516 / 2480 / 0 / 36 | 2527 / 2489 / 0 failed / 38 skipped (logs/editmode-after.xml) |

The 2 dotnet failures are the pre-existing pinned hashes TheDefaultProfilesPlayExactlyAsBeforeTheLevers and TheBoomRunStaysBitIdentical
(unchanged since before round 1). New tests: WaysR3Tests (quarry from every start-land place, quarry next to the Heart Fire built and
delivering, origin store a store and the Heart Fire's surplus there, store off = round 2, producers' wares to the store and a site fed from
it, a built store becomes a store, idle dwarves spread (and round 2 overlaps without), settings version 3 round trip).

Parity rerun (tables/dotnet-bench-report-r3.txt): bench (paths test layout, 6 dwarves per small fire, 32 min) with store off 256 jobs,
15 sites, delivered 156/78/22; with the store rule (within 24 tiles) 345 jobs, 15 sites, last site 732 s (739 s off), delivered
188/116/41, stores hold 41/21/39. Free game (woodcutter, forester, sawmill, hunter, quarry, store): off 98 jobs, store 0; on 138 jobs, store
24 logs / 36 game, the Heart Fire keeps its wants. The bench keeps the round 2 quarry radius 28 so its quarry stays by the rock.

## Build and starters

C:/GameDev/Hearthlands/Unity/Builds/HL-Game-ways-r3/ (build b3) with "Wegesystem Tag ohne Strassen spielen.cmd" and
"Wegesystem Vergleichslauf (Wegetest-Baustellen).cmd". Round 2 switches on the same build: -hlWaysQuarryReach 28, -hlWaysNoStore,
-hlWaysSpread 0, -hlWaysR2Overlap, -hlWaysR2Log, -hlWaysR2Clock, -hlWaysBase natural, -hlWaysR2Outlines.

## Clips and stills

clips/A1_hacken_runde3_30fps.mp4, clips/A2_hacken_runde2_gegen_runde3_30fps.mp4, clips/H1_hof_runde3_1x.mp4,
clips/H2_hof_runde2_gegen_runde3_1x.mp4, clips/K1_kies_aus_gegen_an_1x.mp4; vergleich/steinbruch_*, hang_1..3_runde2_gegen_runde3,
zweite_gebaeude_*, lager_*, stamm_runde2_gegen_runde3, kies_aus_gegen_an_*.

## Launches

Hidden batch editors on the main folder only: builds b1 (compile error, fixed), b2, b3; EditMode suite. Minimised players of
HL-Game-ways-r3: quarry_r3, quarry_r2, play_r3, slopes_r3, slopes_r2, gravel, play_r2; all exit 0, none left running. No Unity in the
Wege or Zwerge folders. HDRP settings and Main.unity restored after every build. Untouched: ProjectSettings.asset, Wiki, Kevin Iglesias,
Source folders. Series builds kept: HL-Game-ways-r2, HL-Game-ways-r3; HL-Game-ways-r1 deleted. The raw capture frame folders (film_*) and logs/ stay local (logs/ is ignored by git; the clips are made from the frames).

## Candidate file list (git diff --name-only 7a45f6b..42a4be0)

- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysR3ProbeTests.cs sha256 f8cd94882dbb2ae4202c5444ec0f752aa87c8af6c283839da8ca998a77b8f8bc size 6679
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysR3ProbeTests.cs.meta sha256 2060c2a2cf2c36acb08b1ff48f3c84290969e2bbc399eea09bb765179ba4f349 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysR3Tests.cs sha256 d9b35944829eca1ed70daffb43368657b610f1fa8a675593e290f5d1e2024fb6 size 10570
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysR3Tests.cs.meta sha256 15c38520e1006915fed23ef3b0d87480bb74477502816d89534024a507664acc size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysTests.cs sha256 74edf82a00d925c47726fc4f93a5f8b9dd6fd3b6725b424ca282182ae2c79585 size 38028
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysBench.cs sha256 138cbe31bc539fe6d3a1d5e2639395bc2adf27ca88b6cdcfe30f3032c6ad212c size 10839
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysEntities.cs sha256 3d13d5a915f741203fd3e9f46583f4766f5273e13920bcdd41ae34a29e86b2e8 size 9096
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysTypes.cs sha256 4a939eca1b935f6f956620eaad1d00e7188c899047defaa9fa1d6518c6c8a669 size 30496
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Board.cs sha256 46b919f23370d57702e1a631a1bac01c8d6615c148b625c1530732265faae842 size 11194
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Build.cs sha256 810fe045d1b466d772055b7ec3f876c5557618b19d262b4703e0f09f070c5c65 size 21182
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Dwarves.cs sha256 11636364c52c16d9b2bd7ba27ab3fff0802f10f8403222f935cde68087d08467 size 30105
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.cs sha256 2d5adcc1c18ecc783eddbbf6cd68d072167b26dd378e8b5c66adc9382e72dfe4 size 26830
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/Editor/WaysBuild.cs sha256 6801d98a2d7f82b531093db73dbb3c13a7aafe389fb9dc28afad91f7c8d133cc size 3588
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/GameLookMap.cs sha256 62ff84becf6e30825b9f0a575058b60ec8d69f6a2eb7eee7d37415a02ca57f22 size 7739
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/TroddenGround.cs sha256 7d37a6d56a90c92dc000bcace8e29924f0376e8c816429974e97000438be713b size 11774
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysCapture.R3.cs sha256 c4b9c1ceb12b650b28af87f92e1af4102e180bad2301c92b074bd8041ab90fb7 size 19740
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysCapture.R3.cs.meta sha256 f1c3d6af5b8388c80beb4df16663dd5b7334b12a8e6cb47d99d13952fd612035 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysCapture.cs sha256 f5c729f5cacb3129f69db6a9448e4fb447f4b0c477871e813fc431ae62a49bcf size 18717
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.Draw.cs sha256 108503a99d7931fd6b426c339c958c38e37289922c0b2ea801a45464ce472f99 size 13840
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.Tools.cs sha256 0dedfa16beec59e4fbf648d160d3769a9fff1b439597d91200ce2b23798be3d9 size 14429
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.cs sha256 91579ec8bd1a19f35770930c5abff77fbd25cc020ddaef59c62e6a3bf022b9d5 size 22423
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGravelLook.cs sha256 0a0f6879bc044c37eb3c4cd39e107f3b33cfb6d359bfb4cd5c3afeddd039fea0 size 3009
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysPanel.cs sha256 68d30250999e7d1d96dcfbfa02c7aaa73a58f2d870e5152a77bb2db02ba7032b size 6141
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/PlacedArt.cs sha256 5cce1a762f77b5459fb312e28563929428952eb8f8dfa3e20d057e89a3c190c5 size 26653
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/UnitView.cs sha256 fc35fb176f5baa95ca8ad7af677ad186e869de79590399bd1052b691a390dbcf size 36017
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/ViewMath.cs sha256 d4d7ccaf36915233a32c20b0e2d2a6a24dfef7945442e067f7e0783422cfc2ec size 16638
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/VoxelTerrain.Soft.cs sha256 fca913b69a429fa6c71bf47d2d438cd41718d7862bad8026eb37b78b37f2682e size 34621
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/VoxelTerrain.cs sha256 edcbda3b3e4edcedec35e8cfbaea2de076304509c432f87d44a8e4b8e1d2bcc2 size 94955
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/WorldView.cs sha256 71786f2f01aa6a6bbbfd4aa7b62b8561200f746576160344dfefa780c026263d size 145264
