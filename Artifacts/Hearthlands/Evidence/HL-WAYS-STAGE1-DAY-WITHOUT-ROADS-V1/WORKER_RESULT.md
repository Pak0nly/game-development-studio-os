# WORKER_RESULT HL-WAYS-STAGE1-DAY-WITHOUT-ROADS-V1

Worker: Claude (Hearthlands Worker). Mode: Discovery. verify-worker: PASS (receipt 634456ca5ff1d7912fedb4744c6bacac4a54cb239da8aa1346cf17dc8d5cc281).

## Commits (game repository `C:/GameDev/Hearthlands`, branch `main`, local only, not pushed)

- `9916812` step 1: the ways model in the core (`Core/Ways`), chosen by data (`logisticsModel ways`), tests.
- `a7e4424` step 2: the runtime bridge (`Runtime/Presentation/Look/Ways*`, `GameApp` hook `-hlWays`, `TesttalLook.TrampleWrap`), the build script `WaysBuild`.

## What the core does now

A second logistics model (`WaysWorld`, one system in the Movement phase, snapshot section `ways`, hashed every tick) installed by
`SessionSetup` when `SessionOptions.Ways` is set (from a data text with `logisticsModel ways`, `WaysData.Parse`); every old data set keeps
the road model untouched. Parts: day clock (held at day), walk grid (map edge, water except ford, rock, cliffs per step, buildings, trees,
the 24 pool tiles, river banks except near the ford), trample grid (2 x 2 sub-cells, 5 / 15 passes, grow-over after 2 min within 10 min,
roads never grow over), integer A* with (f, index) tie-break, string pulling with an exact segment-against-tile check, a per-tick node
budget served in request order (4,000), walkers in 1/4096 tile, fire stores (issue every 4 s), drop spots at the door torch with side choice,
carry board every 5 ticks (fire about to go out, sites, fire wants, producers; nearest free dwarf; one item), dwarves living at fires,
arrival at every fire with room (switch: Heart Fire only; 8 / 6 places), fire watch, workers (woodcutter, forester, hunter, quarry),
building first, placement rules (land, steepness, door tile, reachability, seen land, own land; fire tile own and at most 50 % outside;
quarry beside rock with one free tile, rock within 4), territory growth on a finished fire, path-to-road (70 % visible, own land, free,
switchable). Commands 200 (place, debug finished), 201 (path to road), 202 (debug stock and dwarves). Invariants: one item per dwarf,
ware conservation (every ware in a store, a hand, a site's used material or burned), stores consistent with jobs, no walker on a blocked tile.

## Tests

| Suite | Before (`1c0223d`) | After (`a7e4424`) |
|---|---|---|
| Unity EditMode | 2475 total, 2452 passed, 0 failed, 23 skipped (stage 0's after-run on the same commit) | 2503 total, 2473 passed, 0 failed, 30 skipped (`logs/editmode-after.xml`; step 1: `logs/editmode-step1.xml` 2500/2473/0/27) |
| dotnet CoreBuild | 2177 total, 2175 passed, 2 failed | 2198 total, 2196 passed, 2 failed (`logs/dotnet-test-after-full.txt`) |

The 2 dotnet failures are the pinned hashes `TheDefaultProfilesPlayExactlyAsBeforeTheLevers` and `TheBoomRunStaysBitIdentical`, unchanged
(same expected and actual values as before; both also fail on an untouched `git archive HEAD` copy). Skipped grew by the Explicit bench tests.
The two night-3/night-4 generator coverage tests now exclude the ways commands (200..202), which `WaysFuzzTests` issues on the ways session.

Determinism and invariants: invariants checked every tick over the 32-minute bench (and under random commands, 3 seeds x 4000 ticks): no
violation. Double run identical every 50 ticks; save at 4000, load into a fresh session, continue 3000 ticks: identical hashes and snapshot
bytes; replay of the command log identical; pinned hash after 3000 bench ticks `1967385980837274649` passes in dotnet (net8.0) and in Unity
EditMode (Mono): both runtimes compute the same game. Two player runs of the bench gave identical counters (`captures/paths_2` vs `paths_3`).

## Parity, cost, build, clips

See `STAGE1.md` (tables in German; raw outputs `tables/`). Cost per tick: 32 dwarves 0.08 ms whole tick (ways system 0.01 ms); 206 dwarves
0.17 ms (0.11 ms); no budget hit. Build `C:/GameDev/Hearthlands/Unity/Builds/HL-Game-ways-r1/` with `Wegesystem Tag ohne Strassen spielen.cmd`
and `Wegesystem Vergleichslauf (Wegetest-Baustellen).cmd`. Game series builds kept: `HL-Game-look-r1`, `HL-Game-ways-r1`. Clips:
`clips/W1_pfade_entstehen_tag_wegetest_gegen_wegesystem.mp4` (same camera as the round 12/13 film, frames of `round12/captures/r12_paths_3`,
because the r13 player rerun today rendered 144x1 while minimised; its counters were valid), `clips/W2_pfade_entstehen_wegesystem.mp4`.

## Launches

7 hidden batch editors on the main folder only (EditMode step1, compile c1 (1 error, fixed), compile c2, builds b1 b2 b3, EditMode after);
7 minimised players (6 of HL-Game-ways-r1, 1 of the Wege folder's existing r13 build); all exited 0, none left running (`logs/launches.txt`).
No Unity in the Wege or Zwerge folders. The HDRP settings and Main.unity rewritten by builds were restored (`logs/hdrp-settings-rewritten-by-build.txt`).

## Candidate file list (git diff --name-only 1c0223d..a7e4424)

- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/DeterminismFuzzNight3Tests.cs sha256 b2fbd5e9890892fbb06871d268434c301f7db628db2cae5daf2a75d7498f10ec size 62943
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/DeterminismFuzzNight4Tests.cs sha256 4af69ca3534801b4297febc40afbaa6560883a105412c01d3734e42a7dd9da0b size 27491
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysBenchTests.cs sha256 d5dc485e2c442f211a04a26e7d27b6e971c770b8e1e266832464b726d2760f5f size 5933
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysBenchTests.cs.meta sha256 4670407a5443da37d5f39b99365fd7c08c521f32054ee58286642e47198696ee size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysFuzzTests.cs sha256 07fc663e826b60efc0774ff0f75bc221257cc487a9525b0d0668444713673010 size 3337
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysFuzzTests.cs.meta sha256 3fecf46e541a659e720694d42724b46c3dce6672da7f833aaa1770edd27c158c size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysProbeTests.cs sha256 d06834683aabde63a0c1b527e9b0daf66a452ce3d458b25299290810c6a9a566 size 7869
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysProbeTests.cs.meta sha256 635d9ab79b411644ed75fe600a8821532278c107f415d9022c0164f7aeb3243b size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysTestSupport.cs sha256 a76fb0a65a0d21efe1e97726a60d64532fd44cb35d56f5cc7ce0d6c66586e90e size 2904
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysTestSupport.cs.meta sha256 ed736ef183134b4043e6f6701b5d8af80fc8067f16b495a4b5140d99cba87893 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysTests.cs sha256 fcbddbf3024022de5127ab8b05a0be9519e1c7d01b87fddca233da7c9c599a82 size 20766
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysTests.cs.meta sha256 a26f38a7e61ab20200d1cc75d15977f537d564866f1b93bf75cadb516f77b4c1 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Sim/Commands.cs sha256 139123f18c59e0ab3f9c7929b220169a372983e3f6ebae7633130e0716ddb90f size 9252
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Sim/SessionSetup.cs sha256 a187890a89257460bd0b3ca6566cd040daca4d1e6947867b30f35f08944f21b7 size 11177
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways.meta sha256 98a958ccd7427dca23ada71de14e218ad197f5e89d669096045a0f81e97d1384 size 172
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/TrampleGrid.cs sha256 ba2907f4eb2a95dd5312e96fd523c4c8c8ff7c58a700901eed67fd5d6c09b37a size 8595
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/TrampleGrid.cs.meta sha256 d08c89a56a7a3ef9fb3e9690a8963c87d5704f272adcdb42234a92895c0e332a size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WalkGrid.cs sha256 67dad35dd91627b8e0ac5fbd6aa3ccf6f9027005ed1a25f2f3fdce4c4b4c1f8e size 8742
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WalkGrid.cs.meta sha256 4fc75de9f9f909a4b5a9b7a91e392d8b94d4840ba7276c249d8b78a959341082 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WayFinder.cs sha256 5a960f1638121d5577d528862c361f3fa0f590751e16bc1a8dc2a15e096498eb size 14592
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WayFinder.cs.meta sha256 1213caaee6b6b519df6210bb5c5cf8b1ce39944f47187300f357904a5020b936 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysBench.cs sha256 0742a20da18a9ae9d0e027d17917333f7f7c87d5e3b5de1c3f765259ad8c953b size 10500
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysBench.cs.meta sha256 462754e511a97bb6e5d1772a921f08643753e8c1d1cc32cd650757f9d874bfbf size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysCommands.cs sha256 35adb3b551b6f0753a711836854199909a1fab4cdce0b49d691ac80258a19336 size 5353
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysCommands.cs.meta sha256 5f045f7ef6eaddf4e49d8b930a3dac8459c5ca8881272a275b67b134ad533363 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysEntities.cs sha256 72bed1461f1d8eb2df9ebc0db661feb12a1f54051b457fc1dd7d12bc0dc5a493 size 8869
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysEntities.cs.meta sha256 43b473222ad6a221ca3d7c644c61268ca81322bbbb71070fc6cd3b7d6d6e6140 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysInvariants.cs sha256 7120d22111b1a0a692f32245e72f9354db8a323cd5a424c0cc79d6ac90636670 size 5545
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysInvariants.cs.meta sha256 33e4eba28037c0de3ae65d1b01c8973a32c7ed2a6f5ad192d7f8041f4570cda1 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysTypes.cs sha256 3d238c09bc8b30d5ef9be7859e738313ce9968a2a27cf4b6d1774f3345955b8e size 22096
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysTypes.cs.meta sha256 a370f1ae3851c231fa89443f0b93cf01567f1c6806b4ae57ea53de7a4fceea83 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Board.cs sha256 b2e5ffd436cf4cba442c2624313389db7ff313f2c0a7196c61415a925d04a36f size 8017
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Board.cs.meta sha256 878ada0655fe1e13673d303a9c806bd615554856f33b736c7cac047b31209c30 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Build.cs sha256 751a9dbe6734c8b7591de0e824a59117bb2cd6982c577d9b6cbfc494c7954015 size 15359
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Build.cs.meta sha256 9cbb3160624481a1f3748c9fc2313431b7c3d2b1d5f6b4e1c566afb0822483f5 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Dwarves.cs sha256 0ab120a67cf8d4d2f830151400c4efd492754862990362f8e9dc9b2c81b0d541 size 26394
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Dwarves.cs.meta sha256 83ef34a27420012091112b76d287b503c48d8301ad85bbca3770f587fda7c825 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Snapshot.cs sha256 022e03120fcfbc980f91e937d659c91c8d5a7062251d0562b6cb7430a8335082 size 15218
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Snapshot.cs.meta sha256 83200c0ec7c3c8211b0d8d2260261f2beb94788430c575785a3c2c3f978eddf2 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.cs sha256 a2f86610c4073ad37cef7e3484504a517ccc18c23d63f29950dcb5e85946b7f6 size 24084
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.cs.meta sha256 1bde91ec144fa2af730efa9397aa525714642c253a967ae38ea7741635c3ed1d size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/GameApp.cs sha256 9d6f81f3153cfb563246ceb73fc7f7f1bc9443b2406b5f0761510db8f616cd81 size 53549
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/Editor/WaysBuild.cs sha256 a5e43222796117cc05483b052873e53c62bb4e39c6015bbd2973b750eaef6d0a size 2923
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/Editor/WaysBuild.cs.meta sha256 1b5bf17c9aa16224a6bb01be9ad80303c3bc1bbe1f1ff2f5701181001115a7fa size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/TesttalLook.cs sha256 c2409a23494c97841806dc9f93bd0e7a7f345b9325508a23620d8fdfbc743506 size 30463
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysCapture.cs sha256 f927a5a7ec248dd43a4d95c67c729a8f72f919d87f9decb5441712d790e8722a size 6205
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysCapture.cs.meta sha256 c4518c4589282952be86715365d19a9b02810d54e12da56aee682b28558030c1 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.Draw.cs sha256 8ee54a19f078443698f7b065257db08ca23ec706cde727efa3ca9c792da9bff9 size 9640
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.Draw.cs.meta sha256 c79d92bf5c0b5dbd63373ae73426c62f0aa07b1ba65b7b42a710622e888fef98 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.Tools.cs sha256 ba2ab588a2b1738ead71b89c29dc05ea04de03b0b1d3a81baeece2193286dbea size 11048
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.Tools.cs.meta sha256 50670fa5d32f068293bfb13f25e0f5b78d9acc36d0ceb65fc85af624e224fd6e size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.cs sha256 fcaf2f6fb2053b6cd00eedb6b9f18b2b7467481e1ea185e1b3bd714ee9fbeff9 size 14482
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.cs.meta sha256 6006aa66cb0b4043a089bf41a5adbef6d0b08af608f8edd4d2dba7b8702190fc size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysPanel.cs sha256 c0fe06cf6dc7c604d41912d48f30ec8cfef4c89303c3a2cc5f130882674eabc3 size 5116
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysPanel.cs.meta sha256 8e3421b4f11ec2a680d6aad1f31e12bf4e506deb709236f7fb2aefe02b889da9 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysTrampleLook.cs sha256 11d603d478378e2ae5362e4c4eb76fa14ef1a3f500e8935e4dd5b53e751ccbf3 size 5640
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysTrampleLook.cs.meta sha256 6782aadc9222e21817cbbb2bb6713eee336c8ace5242d2012104ef37fc870a0e size 59
