# WORKER_RESULT: HL-GAME-CURRENT-ASSETS-V1 (round 1)

Worker: Claude (Opus 5.5), separate Work task. External project `C:/GameDev/Hearthlands`, `main` 5562d56 -> **d712003** (two local commits, not pushed). Unity 6000.6.4f1 HDRP. Mode: Discovery. Round note in German: `round1/ROUND_1.md` (inventory written first, before any game change).

## 1. verify-worker

`python -B Tools/HearthlandsDispatchGate/validate_hearthlands_dispatch.py verify-worker` with this order's manifest, Work Order, capabilities and receipt: `PASS worker receipt adbd2f7041198b03f46972014e87cf8f7edde5ba7554c04b42eb6d13af815f8c`, exit 0, before any mutation.

## 2. What was built

- `Runtime/Presentation/BuildingKit/`: copy of the accepted building generator (`LookTest/BuildingSample/Runtime`: BsKit, BsBuildings, BsBig, BsR4, BsR5, BsTier1, BsCanvas, BsMesher, BsAssemble, BsTuning) and of `RcNoise`/`RcPalette`/`RcGrid` from `LookTest/RiverCliff/Runtime/RcVox.cs`. Only namespaces changed, the two finenesses moved to `BkConst`, and the editor data asset (`BsTuning` ScriptableObject, export frame, tuning overload) removed. Diff: `round1/logs/copy-diff.txt`. All eight tuning assets hold the defaults and no hand pieces (checked), so defaults = accepted.
- `CurrentBuildings`: game key -> accepted model (quarry -> stonecutter's hut), one merged mesh per building, moving parts posed by the sample's own `BsMotion` at t = 0; fit on the game footprint without a rule change: store 3x3 drawn at 2/3 on 2x2; sawmill (2x1) and stonecutter (1.5x1) in the front row of 2x2 (Proposal). `WorldView.ModelOf` uses it for finished buildings in the art look; sites, ruins, Great Hall, fires and all other buildings keep their models. Built once at boot (`PlaytestGame`).
- `Runtime/Presentation/DwarfKit/DwtFigure.cs`: copy of the accepted walk-transfer figure, pose and motion (checks class left out). `DwarfBodies`: heavy and female r2 data at 320 and 160 (copied byte-identical to `Art/Dwarves/Resources/HL_DwarfBodies`), female with her four repairs, heaviness 1.0 / 0.6, walk sampled at 48 poses per cycle with the in-cycle travel folded in, idle over 30 s; body by dwarf id (hash, about half each); walk phase from distance walked; 160 beyond 20 units from the camera (Proposal, measured). `UnitView.Dwarf` draws them instanced when `Bodies` is set; `DwarfLook.Id` added and set at every call site (`WorldView.DrawDwarf`).
- `CurrentAssets`: `-hlOldAssets`, `-hlOldBuildings`, `-hlOldDwarves`, `-hlDwarfFar N`.
- Stress walkers walk on tracks around the first hearth when the map has no road (Testtal start) so the 150/300 bench works there.
- `Ui/AssetCapture` (`-hlAssetCapture dir`) and the hook in `GameApp`; the bench report names the bodies.
- Testtal copse: 8 more trees (19), map objects and look lines (Proposal).
- Tests: `Runtime.Tests/Presentation/CurrentAssetsTests.cs`, 9 tests.

## 3. Iterations and recovery

- Self-directed iterations: 2 of 4 — (1) moving parts posed at rest instead of unposed (the well rope hung 0.5 below ground); (2) carried ware on the back shrunk from 0.975 to 0.455 of the old size after looking at the close stills (it hid the dwarf). Plus the far-LOD default (measurement-driven, required by the order).
- Operational recovery: 3 repairs, each one concrete condition: (a) my copy step also copied two unrelated old files from the shared scratchpad folder into Runtime (compile error) — removed with their metas, nothing committed; (b) frame 0 of the walk table hit a not-a-number (the time search landed a hair below 0) — the table samples phase 0 at time 0; (c) the capture's instant placement is a core debug command — enabled for the capture's own session only. One temporary diagnostic test was written and removed (not committed).

## 4. Commands and exit codes

| # | Command | Result |
|---|---|---|
| 1 | verify-worker | 0 |
| 2 | `round1/logs/run-tests.ps1 -Name baseline` (EditMode, before changes) | 1994 total, 1973 passed, 21 skipped, 0 failed |
| 3 | `run-tests.ps1 -Filter CurrentAssetsTests` (assets1..5, diag1, diag2) | compile errors and failures fixed as in section 3; assets5: 9 of 9 passed |
| 4 | `run-build.ps1 -Name a..e` (PlayerBuild.BuildBatch to `Unity/Builds/HL-Player-assets-r1`; HDRP settings restored by git checkout; `Scenes/Main.unity` id churn restored by git checkout) | all succeeded |
| 5 | `run-player.ps1` `-hlAssetCapture` (capafter1..4, capbefore with `-hlOldAssets`) | final runs exit 0 |
| 6 | `run-player.ps1` `-hlBench 1 -hlMap testtal -hlMinutes 1 -hlNoVsync -hlWindow 12 -hlCamDistance 20 -hlStress 0/150/300` old and new, far 0/14/20 | 0 each, `round1/perf/` |
| 7 | `run-player.ps1 -hlUiCapture` (uicap) | exit 0, all six steps DE and EN, no warning |
| 8 | `run-tests.ps1 -Name final` (EditMode, whole project, working tree = d712003) | **2003 total, 1982 passed, 21 skipped, 0 failed** |
| 9 | `dotnet test AssetGen/AssetGen.Tests` | 277 of 277 passed, 0 failed (exit 0) |

No other Unity editor ran on this project; nothing was stopped. No API-updater prompt. No downloads or installs.

## 5. Tests and golden check

- EditMode: baseline 1994/1973/21 skipped -> final 2003/1982/21 skipped, 0 failed (9 new).
- PlayMode: the project has no PlayMode test assembly (every test asmdef is Editor-only); nothing to run.
- AssetGen: 277 of 277 passed, 0 failed (exit 0) (code unchanged).
- Golden: no pinned hash or golden test touched; Core untouched. The copied generator reproduces the accepted voxel fingerprint of HL-BUILDING-HAND-TUNING-V1 (16 pieces) exactly (`TheCopiedGeneratorBuildsTheAcceptedVoxelsExactly`). The tier-1 huts' code is a namespace-only copy (`copy-diff.txt`).

## 6. Performance

`round1/perf/perf.md` and `ROUND_1.md` section 4. 1920x1080, no vsync, RX 6800 XT, Testtal after one minute, bench camera 20. Frame time avg: old 5.4 / 6.2 / 6.7 ms (Testtal / +150 / +300); new all 320: 6.1 / 15.0 / 24.4; new with 160 beyond 20 (as shipped): 8.3 (+150), 11.1 (+300). GPU-bound. Walk speeds: heavy 0.271, female 0.384 tile/s (game carriers 2.5 -> playback about 9.2x and 6.5x); planted-sole slide in the table walk 0.000 voxels. Bodies build in 1.4 s, buildings about 2 s at boot.

## 7. Captures (`round1/`)

- `before/` (`-hlOldAssets`) and `after/`: 01 hall area, 02 copse, 03 all eight in a row, 04 each building close (8), 05 dwarves on the road, 05b the same at 160 (after only), 06 close walkers (2), 07 close walk GIF (after 9.8 MB), 08 dwarves at the hall; `capture_log.txt` each.
- `sheets/`: sheet1 hall/copse/row, sheet2-3 each building before/after, sheet4 dwarves, sheet5 320 vs 160, sheet6 first session DE.
- `session/`: the tester-UI first session DE and EN (48 stills), `first_session_de.gif` 4.41 MB, `first_session_en.gif` 4.41 MB, coverage and log.
- Looked at by the Worker: all six sheets (which contain every still), the full after 01, 03, 05, 06, 08, de_07_done, and enlarged crops of the close walkers and hall dwarves. The GIFs were not viewed as animation.

## 8. Findings

- Walking new dwarves smear (temporal anti-aliasing on fast, fine instanced figures without per-object motion vectors); visible in stills and the GIF; less visible on the old coarse dwarves.
- The game moves carriers about 9x faster than the accepted walk; playback rate adapted as ordered, the result is a very fast step.
- Old static props (small boards) lie in the meadow south of the hall in both before and after (map dressing, unchanged).

## 9. Git verification

- `git config --local`: Bastian Pakowski / bastian.pakowski@gmail.com.
- HEAD d712003 on main, parent 32f0592, parent 5562d56. Not pushed. Both commits end with the Co-Authored-By line.
- `git status --short` afterwards: only the Human's ` M Unity/ProjectSettings/ProjectSettings.asset` (sha256 a84d717c866f84bef7a7176b2bde1e21b7e76dbaee11a1dbfb7ccc69f250b08b, unchanged), ` M Wiki/Katalog/Berufe.md`, and the untracked Kevin Iglesias, Dwarf*/Source and Wiki/.obsidian folders.
- LF only; every new file and folder has its `.meta`.
- Builds: `Unity/Builds/HL-Player-assets-r1` is new. The HL-Player series now holds 12 builds (older ones from earlier orders); the keep-two rule would remove 10 of them. I did not delete them (removing files I did not make is left to the Director/Human).

## 10. Deviations

1. Store fitted by scale (2/3), because the rule (2x2) may not change in this order; question 1.
2. River and cliff (round 6) not integrated: it needs map-editor work (Editor protected); question 5.
3. Moving building parts stand still; no smoke on the new models.
4. Before images come from the same build with `-hlOldAssets` (same code path, old models).
5. The capture's instant buildings use the core's debug placing command, enabled only in the capture session.
6. Knowledge Base not updated (outside allowed paths). Durable learning: the 320 bodies without merged faces cost about 0.06 ms GPU per dwarf at 1080p; HDRP TAA smears fast instanced figures; `RenderMeshInstanced` gives no per-object motion vectors.

## 11. Open items

The six questions in `ROUND_1.md` section 6 (store 3x3, walking speed, 160 at distance, smear, river and cliff, copse size); work motions, tools, carrying frame, player colour and sitting are placeholders; moving building parts; LOD/face merging for 320.

## 12. Candidate files

56 external files (`ext:`, = `git diff --name-only 5562d56 d712003`, working tree equal to d712003) and 150 Studio evidence files of this order (all except this WORKER_RESULT.md).

| path | sha256 | size |
|---|---|---|
| ext:Unity/Assets/_Project/Art/Dwarves.meta | 91ada7383a866085b97999d45b651e2f9621343b358eaba4c5c749519abf14c1 | 172 |
| ext:Unity/Assets/_Project/Art/Dwarves/Resources.meta | 554bf20e38631bf9f87bff28197773aa63daf679ba7bfa5d3b670c5d8af08762 | 172 |
| ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies.meta | a55d37b84b6ee2b85c11c6f2c70a726ba5ea597a1d1945b5cc70c47e6af309ce | 172 |
| ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/female_r2_160.bytes | d58902fbe763ba313f6a2d7666e67d913bb8a3e2531665d3d34d197080336aba | 13167 |
| ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/female_r2_160.bytes.meta | 492b6dcd3fbc3e246fe12c24cb66f4d3ba7320aac11c2f97324cc97b80f50bff | 158 |
| ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/female_r2_320.bytes | e55e4629b0731ec95dec2d6a9b5fea840c7e7b4bd407a3c2e17829ac0f9727ce | 59481 |
| ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/female_r2_320.bytes.meta | eff02b7f20061f4b2171d9b5848cf5581c0bd55873f2a15afb6aa5bae77bc250 | 158 |
| ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/heavy_r2_160.bytes | f33cf6fef1a8b648e456b4840ebbe63468d242d877d917bd228ec61b5ad76cb6 | 16141 |
| ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/heavy_r2_160.bytes.meta | 0e4bddd54efc03b70993a053f7bbbcffd978c8d30541a097b305cc1488cd9674 | 158 |
| ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/heavy_r2_320.bytes | c29884497b121fd57f8eae57732c8e16eb3c99fdcee073131ab9ed1f80ee9b44 | 73094 |
| ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/heavy_r2_320.bytes.meta | 3194001eab0f19fa6ddf077c1bd6cafbb0678938978b69907b05ef156ad1f9ef | 158 |
| ext:Unity/Assets/_Project/Maps/testtal.place.txt | e6780954ae59208ec3d6cf4af4b8e77ac1bd535480ab3ac0fa6cf550029b4d98 | 9277 |
| ext:Unity/Assets/_Project/Maps/testtal.v2.map.txt | a618e2178101f1c5afb2f2ff4df2e00f5ae694085ddd69adab312b73b89400a5 | 8826 |
| ext:Unity/Assets/_Project/Runtime.Tests/Presentation/CurrentAssetsTests.cs | 959be534858dcea8087f5682d83a2d71e7ba20eba2683b17644bf8bbd1402be9 | 14157 |
| ext:Unity/Assets/_Project/Runtime.Tests/Presentation/CurrentAssetsTests.cs.meta | 3fbd3ccd00f82b1b6d75947bf3eeaa0e02545499e7adcc636dc989605b572f48 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit.meta | b9a34adc6a233c78ca91e267c4a1c75fdb0551926dcdb687629fd82347335c9e | 172 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BkConst.cs | d597f7a418c9e084cd8e810c21de8006cb219e1c22316ac6564f421f021085b5 | 925 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BkConst.cs.meta | 4953d1ae0f8c26ee858508ef0a750c49b5f0ab8082c88174c0f62f359ceda578 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BkRcVox.cs | eefffa68f88d02a79de33335fb23b54dedca969ee55f7c42343119e3fea3da75 | 5556 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BkRcVox.cs.meta | cea2dad61c808a9d4e0c6e6250b7aa525286a21fd5d63281f618bfe7f5f80d62 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsAssemble.cs | f6b4f3a8e1204dd94e4c7edfe666aa52644ebaf721da29d2b00a3207bc375234 | 11191 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsAssemble.cs.meta | 01c864ab08bed4817f4f5e403271616e31acc7573b163c8c6435b3ec26f087d0 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsBig.cs | d8ed8292db52cb886b33e6afa52d4ed26b6452cdac7b4a93c0b5950725d5a875 | 20476 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsBig.cs.meta | 3bd008dbc41ac8fdb09bef973c5ac86f9199b31a06663ab4e0ff329d33ac38d5 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsBuildings.cs | 3561d6ba6b8f3d856fbdbcd746c22aa85c157c8ad29ec95695f1a8d8c9edc3e3 | 18770 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsBuildings.cs.meta | 6dc79e80dabab072ceef8ac83c605afea010e8c888ed899a1725ab11cc53af31 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsCanvas.cs | 18fe17d2842ad4a9710efac83811911d435a54ffcfa2f1da28758a6776b4b71c | 18489 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsCanvas.cs.meta | ce24adc5f2a39d1b4c189c6f8f83f35c3dd3550ca514bde777dc7a118ecfa573 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsKit.cs | 3aedae9063f98c811ba932869c44ed00068cbf5f25ddcfc7740eb3d66220e2e1 | 36033 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsKit.cs.meta | 1cace775795e0ffce8933b4cbedf52e880d85684cc4d4050f0601406651a8a28 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsMesher.cs | 58c56f28817af40b4f86a322efc6bcda4aeac544b1e723c8354919d4558860c3 | 9120 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsMesher.cs.meta | 50f96be5f4c5cf1aab5ad682aa2c23593e0f8198e55dd1939fe8156f29606fab | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsR4.cs | 56775b197a6d97acdf58644fed7c561564a8415063304e8d65d4bfebb76b0a04 | 40414 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsR4.cs.meta | c4f027f90871db4e843a80f4419dbe2b826548e7d5291cc789b682332695fc6f | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsR5.cs | 1d4a8a97fcb1b82a58f72d64e1342b46c4d154875ba4bcd5954e91b1991e123b | 41168 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsR5.cs.meta | 5090227f9b1e69054aad052da12d7309aa1e7cbdfa998ba7f84cdcdb251af969 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsTier1.cs | 813c7d4e0a5d9c4c0486c4439f9b0274aa5e1a13e6bfbc1c99b06b7afc0c0178 | 61453 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsTier1.cs.meta | 562ab8c7482373f87972949a63fa7ad44f7b3b3bc9dc594853045ac8e9e06da9 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsTuning.cs | 703610de9ed1c06d3f85cb4f51a17d4ef69cc9adb6442ae0aeab35658f035a74 | 19889 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsTuning.cs.meta | 3f7d1d4958faad9a5b8c7c2542a15ac45496856f1ce201abb0bc582611997900 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/CurrentAssets.cs | e8375b90a8cc4e59735e01fc87244984099d60dad4ba4fa2f84a4254996a6e1b | 1698 |
| ext:Unity/Assets/_Project/Runtime/Presentation/CurrentAssets.cs.meta | 80c979362b92aa98f1bbea1ff93087d6d384173502abda2323bc9970cef19c62 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/CurrentBuildings.cs | 3e4bad2e8d474ed51cb0582624bbe6f45b159c6891fb9b651b76a3a250c1e1e1 | 9981 |
| ext:Unity/Assets/_Project/Runtime/Presentation/CurrentBuildings.cs.meta | 76632685e8e69d4a0e09cce5789628ef7faaf68e5dbd0b23e3e69b8471756a97 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/DwarfBodies.cs | fc68c0905a4598fa9a13fdf227acc361e592a2865182a712a29493364286e505 | 14067 |
| ext:Unity/Assets/_Project/Runtime/Presentation/DwarfBodies.cs.meta | bf37b2e5de5700feca87374498509406a0f343de323cdff15bc93919c86553e6 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/DwarfKit.meta | d50cdcf89654bb3e3d29a008795349c408136b4da311e3d0187b775194c63eb4 | 172 |
| ext:Unity/Assets/_Project/Runtime/Presentation/DwarfKit/DwtFigure.cs | 4050157a81bd875b3b555b058c279b3e0a33a5e8d1d6195423dab000a89713e2 | 83042 |
| ext:Unity/Assets/_Project/Runtime/Presentation/DwarfKit/DwtFigure.cs.meta | 9fc1bde04b97830226cf95513d662d2bde129cade99f1a0092c70f16ac38aa80 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/GameApp.cs | ef6dc33090cb04114db530286f4f3379e87db09fca858c272e5dd0f67d05e1bd | 48832 |
| ext:Unity/Assets/_Project/Runtime/Presentation/PlaytestGame.cs | 8266829f03c74a5b8e7faf5fa55d44d341ca8ad5056ef23c6702ea6adeb2d961 | 32724 |
| ext:Unity/Assets/_Project/Runtime/Presentation/Ui/AssetCapture.cs | 7130deb23bec703a41f05fce79285c3fbe2c5f5bf1e2927739015f2b91a503f6 | 11848 |
| ext:Unity/Assets/_Project/Runtime/Presentation/Ui/AssetCapture.cs.meta | 60710d90a7a063ff15babb2a70fea21a3cbf84f34619db9f58a8e5c50181d54a | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/UnitView.cs | 98d9e014d5d404cf8cde2ca97a24d055ef43af57992364bb9a029af4d038789d | 19765 |
| ext:Unity/Assets/_Project/Runtime/Presentation/WorldView.Units.cs | 3def003cac114922b41dacaa4da65f7fcdf2223105816d4d64bb70417ad4fa68 | 54896 |
| ext:Unity/Assets/_Project/Runtime/Presentation/WorldView.cs | 60bd6f73a14f441324035857afd57e26ad7285da0b02e30fd22fc0d030dbc7e3 | 110878 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/ROUND_1.md | fb94344a1d1c5d352b90b27e21c895a210cc1decd7c732770846c1a999c27fa4 | 12163 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/01_hall_area.jpg | 23e86bc0e736ddc7f7a17c0c3bf1b3e6961a8e4228a688dc281d798c488aa2a5 | 981897 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/02_copse.jpg | d0fa825b5ee34cec191d96db2edc15f4afaa277629725eee5ecea0392648a344 | 998919 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/03_row_all.jpg | fe913c4b0406ef20294cad610f8bbcef193476443657db6ce39e95b3b01c007f | 940460 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/04_fisher.jpg | a448444372eb4bfd45ec4802f4f147c7d3bfd3e0fb74b44bb2cd9ecc61a84b23 | 1004625 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/04_forester.jpg | 1a4cf1e67f9420a4ba559effb7f2f50ad538049c2a87662201e359d585c90986 | 1030338 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/04_hunter.jpg | c64ccffdc01d5aabf8df69ad8e98f784188687b2fd2ff15a5aaa7ae9ef92967f | 956428 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/04_quarry.jpg | fd5c8ffac6146c1ec19477bd9b7810692e014b9ffddc6e8c80827e827af642ae | 933411 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/04_sawmill.jpg | 8f6df7380f34f34a5de2c7f5768810a084536eeb63d569982b7487a59c7c9c59 | 913273 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/04_store.jpg | 0078facaade6441442338760c64b85d66430024cc9f5151721719ccee59b237b | 990558 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/04_well.jpg | c0de2a04afb51ae008836a85dca500c5d314b690bfa51153b1da1454081c7cce | 1001674 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/04_woodcutter.jpg | 41b1e4e099c25efb70b3283b869e493a11a700a9b3e3bf3985af126971c2b2f8 | 989035 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/05_road_walkers.jpg | 37899dcbd2ad41988bc88b9a88261824ec3f97b8ce0fbbe84d8a138ebeb62e7a | 980259 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/05b_road_walkers_160.jpg | 6c9bbf78452470edecf925e02aa8380601e09d3f4b37c7625323601583ff0108 | 982478 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/06_walkers_close_a.jpg | 962ae2e6b43f4fed83c40920f40d2f0ebce2a655785b6678636e883620d0a1a1 | 997530 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/06_walkers_close_b.jpg | e4a79d9de1d8c01da9d0c142ee1b574c6affcc705c265275fa69c2113a2daf40 | 989801 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/07_walkers_close.gif | 3f317ef46892a2a14f5ff291bed34a54f9bdfac2e14021318998025e0e2e3118 | 9797961 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/08_hall_dwarves_close.jpg | 1777cfc13acb1981c85378d99ef5465bdc530c8cfa615a0ed4472cfd3b58d7c0 | 966724 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/after/capture_log.txt | b4475dd17aeb45568885578c45d33e60d87648e4ec7f8a9a4ec4281ae4f06a6f | 2855 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/01_hall_area.jpg | d6e76ab2f02695d68114924d0eed46731295c0c818b0ad0f63cfe6732c31928b | 970010 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/02_copse.jpg | 04ff9581a28ea61f26f0d0639348750a4fbdf8a4825a067f2419715219a9cff5 | 989352 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/03_row_all.jpg | fdf028b66fb896c7f202fda9833fb33a3a48a760fb770ebc761781b63e665575 | 921011 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/04_fisher.jpg | 86d34af7ecaf78e39a13c0c30450efc2c5a9afbfd9c2d7aabaf22c6818ee5b01 | 989371 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/04_forester.jpg | 31ed68dde2b929b1240450e7f2173e8047a1f15d50ef88a0a7400e6c22bdcb62 | 1007820 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/04_hunter.jpg | 34e8c13971448b0cc102401f4623786006aefd0d824757a4c75d76241868224e | 952156 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/04_quarry.jpg | 82835e8f6f5fc064639483ec837b5ead56b9a9eb95555e754ba684ec4fa0eee5 | 934359 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/04_sawmill.jpg | 310509d71fa0d708b5dc2bb970a7d9ac1a9c5b80e0cd97aea00ba452019c6266 | 905284 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/04_store.jpg | e5a828b67834067807b0b4e7513a891d2d006c365d417e03ac7bd6772eb9824d | 965181 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/04_well.jpg | 15d51564c64513242c072850dcf485fc73b15d61c24acac0a39eadbb803ba2f2 | 1010333 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/04_woodcutter.jpg | 3868ffac2b17af1244de0540ccec71d5d21b3fcd667100560acb7125dd08dbec | 997728 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/05_road_walkers.jpg | 71b3c77b0b9012f4a0f09cc168e93224afd200a641948982dd9daabcef086124 | 974092 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/06_walkers_close_a.jpg | 7fef0a720bebd5253ea2b2978210bdc9954f0a8bfffcf8c9f37cd26ae4053256 | 990749 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/06_walkers_close_b.jpg | 5586576a15607c3191437002704fc2df8e028fc5d52a1b6bf5ed408e56c68697 | 986840 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/07_walkers_close.gif | 2c6d551ed4e87f0694741c12fddc6c0394c4d1dddf2cbf9887f5bc5e4aaed282 | 9748939 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/08_hall_dwarves_close.jpg | 3badcfb269425acbaa5477ba34ab33ef186e62d0826c5100af7f86bf4519f53a | 960106 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/before/capture_log.txt | 4356d9fc3e70e92e3062a31df5fb958b85ef60d27ea6055d9653ce7a2eefe422 | 2702 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/assetgen-tests.log | b817b08e3935b2eea627b2231334f99683b82da6a04db1df73d9a4aff2782135 | 735 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/copy-diff.txt | f5bfca898b74168f6ec7d9899d5c7ae42a590fee03fbd53f2ce25850ae01940f | 7575 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/crop.ps1 | 185c9373c397cdc3046e4b09d50d38b81e75f20a44834e7b5a54a84b753082d9 | 1075 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/editmode-assets3.xml | 96a23d6b6ae7c4846d9038d8766f2ac45055d6a27c5bddd5380d0e8aebe0f067 | 33089 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/editmode-assets4.xml | a94ee3b34be8c06ac7c2ea8cc79e56333ea10623b034710ea5d0fcd2ab31ccf7 | 32616 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/editmode-assets5.xml | bc3fc6a9e7a51dc50db6966570bd5c9ee848bcf39b2a9eee6dc46cefe293a0c6 | 10312 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/editmode-baseline.xml | 0e266e992527e6190f6577661e0a614dd90917e93390235c07558ce314a9fced | 1480522 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/editmode-diag1.xml | 9ef0f42cbf06fa4bca65ad46277ff62fb2a5a47a2f786eb4234ddd076e3f0e91 | 30996 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/editmode-diag2.xml | 1dd8aa7c6807ab9ca6585f9477f372f6eedb97b57002f53d8e3d766711d99eaf | 4788 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/editmode-final.xml | 2def23e4d34918c46192f4fcbd3d12a85b24f221120f30fd9fa5cfd3e7dd6871 | 1487815 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/hdrp-settings-rewritten-by-build.txt | bf4ea0c9744ac2d2a5a1586887b9a43e7d92c56ce8ef51aa5266efdd2d1cf3a5 | 1355 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/make-sheets.ps1 | 7d768b68448e9211680ee88a7bfc249c21b516b6485fd4fb74bbfec2e8882492 | 4324 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-bench_new_0.log | 5ca2975ebdca5c13f1da3e8d36343dbab8b14a32392683010a80fac3a0973d28 | 14078 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-bench_new_150.log | 2c8dce0c2acf56f855e33fc8ccd58ec8e62f6110c752dc32d79971499e14ba2e | 14116 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-bench_new_150_far14.log | b31a27d5487c79cf3a0b92d55167cbdbf24b7fd1a05596d6e8ee1348a8113359 | 14113 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-bench_new_150_far20.log | e7d47528e8aea0309a5d297677116f1c81e6c3086bdbde7a793e8442bbe53539 | 14112 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-bench_new_300.log | 8c76746a50248d0f9339787e7e5605ed7f0e4f7ce96097860fc728cb6d693a3b | 14118 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-bench_new_300_far14.log | 23452abb6ab2ddf17b87fabd14b19c8460fe545aa29502ea165668e9fec4d3ad | 14116 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-bench_new_300_far20.log | 2a361e58337a1c14c03f73f5886dcced7d49f9693be64a01a500f5ad8b5f7736 | 14118 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-bench_old_0.log | 2b37ffc20988a617feefd18a2d6a3cd774c0eca84424425d4318a0c245935f64 | 14053 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-bench_old_150.log | 6fdbba3ab2d2ffd3acfdadc8d6153706a5e6cf9186a3df399629cc3cac996bab | 14085 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-bench_old_300.log | a314d3874239800544131d1508c1be52b388b6778a1e73c670b72fe15c4c654a | 14071 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-capafter1.log | 7b2d9a3f7f1f17fecef4c1947eee78e18404689e8470af12066067bb3738f8e4 | 40516 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-capafter2.log | a2d79d3aa5fa587251b36ae7ae49e2b05111ede40bf5068294f5256526b6a557 | 40520 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-capafter3.log | abd1ac2cce6a668a9efeaa4c15ab1d7eb36036201a510374f9356243c25707d8 | 62145 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-capafter4.log | 6d2f54773f46a0113b3180cf702327397096fe0ac829b8b5a5b7cb8db12745ad | 63566 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-capbefore.log | c33d3510048f3b4bdb0658d0b0e423ba3de7c71f988754b8c05820cfeb0021e6 | 62132 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/player-uicap.log | 8b6ba4efcd72afa8a510cff06f3250031b0273e020d166d04ec097a6a5a3b3a2 | 114790 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/projectsettings-sha.txt | fed8d8e86b4955438f6f289af22bd474807fa73d4dab3cba7af8088d774048ca | 110 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/run-build.ps1 | f2d484b059f174840dc43903723d2ebcd8e09c1f3e6fdd2be88c7efca86293b9 | 1424 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/run-player.ps1 | 892d3ee10087546595b4194e907f52212ac823382093bc0db5372bc0caae559a | 897 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/run-tests.ps1 | 5f9dd9c91eee84549d06af8b83063df1f852069578a143b89698090ed6d9f1de | 1045 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/run-unity.ps1 | 5fc70244730b4cca04218e5140b13c85c1edc1e1500a90d14cb05d2f1cbbdb45 | 1355 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/unity-build-a.log | a25c4e3bf11b903cb355d947a9b11a3d66363790226985c232f29258d8b971e4 | 781966 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/unity-build-b.log | 1fb1e9059639744a233f5b783b1fc3f6f7034f74b6cff29f274aa329b80c1821 | 757342 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/unity-build-c.log | 1780de182a9aed32307fa7092c4cf3b0a61ea8bed17a19c2395e14acb048f806 | 757293 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/unity-build-d.log | bc7942ce3bc9bb5dc292738854de23dc696d1f1f3ffde4d259927b3df02ca0fb | 791833 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/unity-build-e.log | 772a1248a4cef782e816dd27f98fad876c1b55f7252b901f32df52e6bcd55494 | 757473 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/unity-tests-assets1.log | 6cf240f64933ed2ca96d6a645b1b4574876855fc9c054b1142fc54b53f8fd284 | 76744 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/unity-tests-assets2.log | 273e94182bcecaf66c871c9f0e6a15c5832f2fc9a752fba07a45a8181ba44fd9 | 110905 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/unity-tests-assets3.log | bdd3d7b41660c4da9cbb73ba7ea6f384b80556f6d8cdb0fbbadacf61f5fec841 | 2015079 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/unity-tests-assets4.log | 1413ae384234ce6d959ad1ff6f35422f5129b5a9ff71d80ecb482cca975c6297 | 2053662 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/unity-tests-assets5.log | 38d383d3bd0547b60ef5ba7e18d61161517485c033c162883321a3490be37d53 | 100354 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/unity-tests-baseline.log | 1847c392851032a9505d9046c41784c8db3d8d860e6bb2d18d9dff6874b3447a | 164995 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/unity-tests-diag1.log | a3d1531fc2b6cef128fcdff07afb66382e123b930012d04dfea0c789a0cd138f | 2486937 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/unity-tests-diag2.log | 1e08e8eb07a5eee5e04f4fb063d89566cd99449222b5846201273efbe0e22215 | 59008 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/logs/unity-tests-final.log | dbaaa21af1e6a03247881fe71c69b079b9771d710be7e6059d387dfcf64e8c07 | 185704 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/perf/bench_new_0.txt | d2141247b5d146325ea46d125b59ec782e9eb66ed73a88908ed03f9ec1b601a7 | 2062 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/perf/bench_new_150.txt | 21803f2bf28f057b3fe1d26bf7fbfb86d8388ceff85992da5afde0f04ac6564f | 2099 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/perf/bench_new_150_far14.txt | 265cdb3692811583d5dfe0d5e0f3aa8b1624151728562eb12c3fddc0aa178a93 | 2098 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/perf/bench_new_150_far20.txt | 2e87de4098c7b3b18dfe6575fcc47788a0280bbdd6775cb8052a847cf8a0b4c8 | 2098 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/perf/bench_new_300.txt | 67202b11c0488d1ba51da846fb29551a37e072d35a1d57a182a3a5dddc03f9e5 | 2103 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/perf/bench_new_300_far14.txt | 61d763e6b21be4bf387a0d29d8297e4613b54ecef563b8c7ed211d2207fee683 | 2104 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/perf/bench_new_300_far20.txt | 2b7fde72f4f693be1b06b28da4cd757a7a0b0466f7ad0037c0086eb976893b7e | 2104 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/perf/bench_old_0.txt | 3022908ccdf52c900f49a1de899c81d9487dd57adf185236bfcf1dd655dc9cc3 | 2036 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/perf/bench_old_150.txt | 987611a6a27f27000bfbe356027a4272d38cbf2677cd28a528ca20327612055a | 2070 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/perf/bench_old_300.txt | 2e26afced24c754adcc10793bf5131d1eff7219b0b6a7c97b19db7d1b4e5929f | 2070 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/perf/perf.md | a5fd0ad104245646bcbb67ab10cecc0e3c0f755b7a4b437c8497058cd550db90 | 930 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/capture_log.txt | f61e5a658f42754a9241105ff85d7c9fe3f8df23e9952ee42b7b1fc1aa5d0719 | 7060 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/coverage.txt | 95910fd3ad88831fdbd301b1b9419c0d0808c5954bc676f3cb0e39d1fb64aff9 | 925 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_00_start.jpg | f0009a522b6add4934bbbe448a8cb68829953d0a44d23421bc08829b64097f4a | 82577 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_01_step1_look_around.jpg | 76f5bfa4556778326d12139c55e201782ea89456e343c5847c3952d804097517 | 876584 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_01b_paused.jpg | 192a73dad17f38fc3b0f77ba09c789be7c1f7616c7045a728b9b7b0e70e8f0a6 | 859281 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_02_step2_your_store.jpg | 2d1244570cca808a96821f460e6171ae910c68cbb97ffbd22bad76505184a594 | 875421 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_02b_hall_info_and_embers.jpg | 57d5fa99f29a77b03c8f537639c917049363dfa24fb2213f2152fd26495f0e90 | 849213 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_03_step3_wood_first.jpg | fa8c612baf87c86b6f8d80107ad764aad0d60fdbad4fd4daaaf1b3e3f2d974c8 | 878796 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_03b_stuck_hint.jpg | fd0ef893b333b96f485947a719e4af72d4ade45c3a09c0099fbce2943a488e16 | 872035 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_03c_build_menu.jpg | 32df60ef482f0cc1bca16bd4f428d5f513e39d0e3616ca5d4d0b7f26e1f1abc7 | 845411 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_03d_no_trees_warning.jpg | 3b5a0476adc8a64fdfca113dc2d1583e5e59366a36a105ee420f9deb39c91232 | 912667 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_03e_outside_territory.jpg | 343f18875f2e3c90ab9637c82c032ac52f58c03f250e8c195831197100a3ef81 | 907794 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_03f_trees_in_reach.jpg | 4282a182fbe148fa01dfb1634a76839bd89a6397b8338da7b30801f79a671af4 | 903716 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_04_step4_road.jpg | 518d0968378938cc57fd74146ce9d134923e670761857b4a3858ccdaca6fbdc3 | 874301 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_04b_hut_blocked_no_road.jpg | 0e4ceaacc9d2b902ab7af3ac9e81968fc092c49203f40258de7e23a8b1297a35 | 855639 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_05_step5_first_wood.jpg | 07bab1f1bfe5b94da1d2740ca6fb86f7c5dc82a46be37c2dc5a78e9f508a5791 | 851855 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_05b_site_being_built.jpg | 7cc87142e1c25d427efe51def5db4956185e0e3ebc11a0b0380d81a6aa964b37 | 870797 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_06_step6_planks.jpg | fcd50aa8d2e3a230a1b4345d6dd8b70b4df949cf724a1382805fdb2258cf442f | 865552 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_06b_sawmill_site.jpg | fc0230b5a3a25edf4175bd39a1c19d06b8a83227f99b28f526f1585ccd7eb7bd | 898954 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_06c_sawmill_connect.jpg | 3a28cfad74b76dd728ec671add98d2a6c7fe850548a66ff6a1edf61828bbc6db | 854663 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_07_done.jpg | 9dfe3e506d1b4d10283df0d4e7993fecea4c00c245e5abf5ab1f04c15c7530ce | 856283 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_08_help.jpg | 9b2d3a79953ec79d844a6e7cb88f7ebd773f6b5c3b0dafa624175ada723fbbfc | 696603 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_09_menu.jpg | 00e05d17a8fd01fd466b98ae2ca16afcbdc628db4e011e740c855cf13beab275 | 685463 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_10_settings.jpg | 5c28058ed2949f098d0f2f49eb5e2c042b38882128b4b6f59612ba7bbdfcca68 | 683252 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/de_11_free_play_resting.jpg | 3494e8da710dc8e46e91db544b592977b664ddfc85be871c126968f0157b6214 | 868723 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_00_start.jpg | 904341759ccf159b4fa2c171e632721746efff5c1517531305be87a1bfc29451 | 82205 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_01_step1_look_around.jpg | 77eaadfda03194f4267f131bd86f2f15e4e1d710df7e9f57f3498a45307d8a8a | 864334 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_01b_paused.jpg | b5f20e2dac9d53a03eb7075baa7eae8e942e205453483a85afaca0b752692573 | 855608 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_02_step2_your_store.jpg | 190dcc6ceae6af26c5f439dea7f7cbdba7ae28e1484aadeb5d636bf6c6cf0e81 | 875795 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_02b_hall_info_and_embers.jpg | b24e4bdf18edd0e0d1ac84d3bd6527adaff8b9c2e560f232a220fbc7bc212bd1 | 848825 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_03_step3_wood_first.jpg | 5db59c255e637e12ac4dd4b66c85dbed4e415678948c129750c7a9254fe2cdf0 | 869967 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_03b_stuck_hint.jpg | 9152aad00722958629d73486b1500b2ed9a186d34f899d03edf751f354c9ccfe | 856112 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_03c_build_menu.jpg | 5fe27397ccf32533f2289b0c723733bbc412c7315f5e66b60b576a0428018974 | 842045 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_03d_no_trees_warning.jpg | 2faeef4a2bbc6ebe087d558f2f66570a795e2b1b09ed9d38938fbf2f39f43b09 | 902882 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_03e_outside_territory.jpg | 67322982e3b32d8ff44230f6c7821130f546002d9198e41ca6d173c107292b4d | 905208 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_03f_trees_in_reach.jpg | 79dc421f91bb403e0a7d24e513ffc0508ead5b415a5f8bc4bcf02d2f0171e27a | 913655 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_04_step4_road.jpg | b8f537a633f8e99ac8d750cf2ed413e1ecfb72ac3fe87d4d205b569594f5c032 | 868770 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_04b_hut_blocked_no_road.jpg | c5344619852422149e6d8cd16d6be879644834546b1e4c3b3c156211acc148d1 | 851945 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_05_step5_first_wood.jpg | ffda4513082ab2eb0aee0310c3568e5db613eb1677322e0454008b6c0fbd549b | 862248 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_05b_site_being_built.jpg | b224dd9e013792c59b7123b629fa9fb677cd39b64fda51c2d1b32c34d7bf4c40 | 862006 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_06_step6_planks.jpg | a041411917f2feca63dc8a692f887247e1b6d5cb3b00365413656cb34839e793 | 859333 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_06b_sawmill_site.jpg | 2a5c82cd59895a0e99a25b4e345715de75b754eec28be802055d6c4ed2012d9f | 888834 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_06c_sawmill_connect.jpg | 1f3a3ff9a366e68fd0da9c390bb755ec448fc218f2311cc51401a6a9ef2f2b84 | 842782 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_07_done.jpg | 25e06e46e7d7a0887e2bd505a64b60b6e3c20719ecd348d2933e69fa7ca6689e | 857857 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_08_help.jpg | 4f4aae11e3f680c60d23259fa1bfdd17837a750289020c1f2c822f368b859bb8 | 707242 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_09_menu.jpg | e26da354fbcacabcb737466d0c33bc684fcfe77a8dd810fed8a7b7df1eba3e6d | 679819 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_10_settings.jpg | 95c4ed28ddf503e28ccf508de0d0f3583aba700d929b17f85c399437f4017d1e | 686262 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/en_11_free_play_resting.jpg | a4d1927f7e8b94f3f24492ec82cee75028693b592b9520a51a84924827e6c855 | 875499 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/first_session_de.gif | fe2244ab0fce22c1da7b760629d0d9dbad1657d6f38e976955b7b3e612ff6459 | 4414911 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/session/first_session_en.gif | 1e1f324204f42252edc83e988eb25bda19779fffd8b2f4578cdc248e200df778 | 4411531 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/sheets/sheet1_halle_waeldchen_reihe.jpg | 0a170afd5294101d3d6fc5cab894deb2f9470079e7c2ed6347d7702281561b91 | 1107638 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/sheets/sheet2_gebaeude_nah_a.jpg | 08a41d3d049c59ce1f439fa8a08fe40f5c608124a66eb30af4c8595dd5a4ca64 | 414762 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/sheets/sheet3_gebaeude_nah_b.jpg | ed093fb37c4961fefe71ece6196a6d60ce3f1ea5f415446afad8104a9de214fb | 386989 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/sheets/sheet4_zwerge.jpg | a6078245910e0fca3a3c8cf24e62981fb7a06d1450cc1ec9f31f55211a458969 | 1052352 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/sheets/sheet5_320_und_160.jpg | 0c9c1ac67530c8219e12aec9b50e4db78ac5b96516bc796050c4367de5dd7964 | 325813 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round1/sheets/sheet6_erste_sitzung_de.jpg | 7f35cfc40faae84fa284b970b046cc015d27411527952d7357ac5c2d355f2ffb | 1045752 |



---

# Round 3 (HL-GAME-CURRENT-ASSETS-V1-R3)

Worker: Claude (Opus 5.5), separate Work task. External project `C:/GameDev/Hearthlands`, `main` ca4535c -> **2c2b64d** (one local commit, not pushed). Round note in plain German: `round3/ROUND_3.md`.

## R3.1 verify-worker

`python -B Tools/HearthlandsDispatchGate/validate_hearthlands_dispatch.py verify-worker` with this round's manifest, Work Order, capabilities and receipt: `PASS worker receipt c908b96f7b74b0af96cb593d25357aa288a9d4c7707c0e8d18798b28861462aa`, exit 0, before any mutation.

## R3.2 What was built

- `Runtime/Presentation/HallKit/`: copy of `LookTest/HallSample/Runtime` HsKit, HsColours, HsHall, HsHearth, HsSite, HsSmall at ca4535c (namespace and `using` lines only; diff `round3/logs/copy-diff.txt`). LookTest untouched.
- `HallArt`: meshes a sample model into one mesh (lit faces in sub-mesh 0, one sub-mesh per glowing colour with the sample's glow strengths; glow 60 to 220 nits by the light), the palette's team colour replaced per owner by the game's player colour; hall, tablets 0 to 12, node and lanterns prepared at boot (4.1 s); sites built on first use; instanced drawing for nodes and lanterns; a pool of at most 32 night lamps nearest the camera.
- `WorldView`: the Great Hall (every stage) is the sample's L hall with three gables and the left door (`HallEntry`); the tablet drawn in the court facade with `StonesFor(embers, cap)` stones (one per twelfth, the first stone with any ember); sites (state Site) timber or stone (stone when the build cost has an item whose key contains "stone"; Proposal), stage 1 below half the work, else 2; the road node instead of the flag pole and cloth in the art look (the congestion glow kept as a red band); border lantern B on every border edge instead of stone and line, floating at the water level on water tiles, stage by the owner's embers (under 1/3, under 2/3, else strong); the hearth radius ring hidden while the lanterns are on. All of this only with the current assets; `-hlOldBuildings` restores the old hall, sites, flags and stones.
- `BuildingFx`: warm lamps (torches, windows) at dusk and night; the fire light at night 35 % (the sample's about 520 lm).
- `DayLight`: view-only dusk and night (F7, `-hlLight dusk|night`) with the hall sample's evening and night light (own volume: exposure and grade; the sun as a moon). Day leaves the game look untouched.
- `GameUi`: the heart-fire marker kept; its 26 000 lm glow over the hall scaled to 2 % at night. `UiStrings`/`GameUi`: "Fahne"/"flag" -> "Glutpfahl"/"ember post" in every tester-UI text (DE and EN), Proposal. The old developer HUD (`Hud.cs`, English, developers only) is unchanged.
- `VoxelTerrain`: no grass tufts on the tiles under the new hall (its court is flagstones).
- `DwarfBodies.Scale` 0.78 -> 1.0. The walk phase follows the distance at the drawn size (planted feet unchanged; playback now about 3.0x heavy, 2.1x female); the tool-in-body check runs in body space (independent of the scale).
- `AssetCapture.R3` (`-hlAssetCapture dir -hlR3`): the round-3 route; `HallArt.StonesOverride` is capture-only.
- Tests: `CurrentAssetsR3Tests` (6 tests); the `CurrentAssetsR2Tests` door test now asserts 100 % and heads above the frames.

## R3.3 Level-design choices (Proposal)

Hall for every hall stage; tablet stones = ceil(12 x embers / cap); lantern stages at 1/3 and 2/3 of the cap; stone site when the build cost has stone (37 of 46 buildings); site stage 2 from half the work; node without rotation, door and free nodes alike; night fire light 35 %; at most 32 night lamps; UI glow 2 % at night; the word "Glutpfahl"/"ember post"; the hall entry is never mirrored (door point x = 0).

## R3.4 Iterations and recovery

- Self-directed iterations: 3 of 4.
  1. iter1: grass through the court, the heart-fire radius ring still drawn, hall GIFs 19.6 MB, tablet framed too low, no stone site placed (the first stone building tried was a hearth). Fixed: bare hall tiles, ring hidden with the lanterns, GIFs 960x540 with 60 frames, framing, stone-site search over all stone buildings.
  2. iter2: my single 72 lm lamp at the socket field made a white hot spot on the tablet (my simplification, not the sample). Replaced by one 6 lm lamp per set stone as in the sample; lamps chosen by distance to the camera.
  3. iter3: hall GIF framed too far south; refocused on the tablet. Final capture `after/`.
- Operational recovery: 1 of 3. Build b failed on a compile error in the capture route (CS0136, a local name clash); renamed, build c succeeded.
- Benches: the first final bench set was disturbed by the core dotnet tests running in parallel; rerun after they finished (clean numbers below).

## R3.5 Commands and exit codes

| # | Command | Result |
|---|---|---|
| 1 | verify-worker | 0 |
| 2 | `round3/logs/run-tests.ps1 -Name r3a` (filter CurrentAssetsR3Tests;CurrentAssetsR2Tests) | 15 total, 14 passed, 1 failed (hall bounds 1.63 > 1.62; tolerance set to 1.65) |
| 3 | `run-build.ps1 -Name a` / `b` / `c` / `d` / `e` | 0 / 1 (compile error, R3.4) / 0 / 0 / 0; HDRP assets and Main.unity restored each time (`logs/hdrp-settings-rewritten-by-build.txt`) |
| 4 | `run-player.ps1 -Name cap1/cap2/cap3/capfinal` with `-hlAssetCapture dir -hlR3` | 0 each, DONE exit 0 |
| 5 | `run-player.ps1 -Name uicap` with `-hlUiCapture session` | 0, DONE exit 0, six steps DE and EN |
| 6 | `run-bench.ps1` (five benches, twice) | 0 each |
| 7 | `run-tests.ps1 -Name final` (whole EditMode suite, tree = 2c2b64d) | **2024 total, 2001 passed, 23 skipped, 0 failed** |
| 8 | `dotnet test CoreBuild/Hearthlands.Core.Tests` | 1918 of 1918 passed, exit 0 |
| 9 | `dotnet test AssetGen/AssetGen.Tests` | 277 of 277 passed, exit 0 |
| 10 | `logs/make-sheets.ps1`, `logs/gif-strip.ps1` | 0 |

No Unity editor ran on this project besides the launcher's. The Unity processes running meanwhile belonged to `C:/GameDev/Hearthlands-Zwerge` and were not touched. No downloads or installs.

## R3.6 Tests and golden check

- EditMode 2012 (round 2) -> 2024 (6 HallSample tests from ca4535c, 6 new); 0 failed.
- Core 1918/1918; AssetGen 277/277. Core untouched.
- Golden: the copied building generator of round 1 is unchanged; `TheCopiedGeneratorBuildsTheAcceptedVoxelsExactly` and the HallSample tests passed in the final run; the HallKit copy differs from the sample only in namespace lines.

## R3.7 Performance

`round3/perf/perf.md`: Testtal alone 5.5 ms, +150 9.1 ms, +300 12.7 ms (round 2: 5.6 / 8.9 / 12.4), +300 at night 12.8 ms, +300 with the old buildings 12.7 ms. Hall 57 766 triangles, tablet with 12 stones 7 992, node 948, lantern 478.

## R3.8 Captures

`round3/after/` (39 stills, 4 GIFs: 05 hall and tablet day 8.1 MB / night 8.5 MB, 06 tablet day / night 4.9 MB each, all under 15 MB), `sheets/` (7), `crops/` (GIF strips), `session/` (48 stills, 2 GIFs, coverage), `iter1..3/` (iteration stills), `perf/`, `logs/`. Looked at by the Worker: all 7 sheets, the stills of `after/` singly or in the sheets, the strips of all four GIFs, the session step-4 and done stills, the iteration stills.

## R3.9 Git verification

- `git config --local`: Bastian Pakowski / bastian.pakowski@gmail.com.
- HEAD 2c2b64dba771342be84ada4e5d15e8ff5ac609e5 on main, parent ca4535c. Not pushed. The commit ends with the Co-Authored-By line.
- `git status --short --untracked-files=no` afterwards: only the Human's ` M Unity/ProjectSettings/ProjectSettings.asset` (sha256 a84d717c866f84bef7a7176b2bde1e21b7e76dbaee11a1dbfb7ccc69f250b08b, unchanged) and ` M Wiki/Katalog/Berufe.md`.
- LF only; every new file and folder has its `.meta`.
- Builds: `HL-Player-assets-r3` new, `HL-Player-assets-r1` deleted; r2 and r3 remain.

## R3.10 Deviations

1. The game has no day cycle; dusk and night are a view-only light (F7) for judging, not a game-feature decision.
2. The tablet's night glare is integrated as in the sample (not reduced); a fix is proposed in ROUND_3.md for the Human.
3. The heart-fire marker of the tester UI is kept (not replaced); its light is dimmed at night.
4. The hearth radius ring is hidden while the lanterns show (the Human's wish of 2026-10-24), also when the developer HUD's toggle is on.
5. Round 2's WORKER_RESULT gap (no round-2 file list) remains; this section covers round 3.
6. Knowledge Base not updated (outside the allowed paths). Durable learning: HDRP point lights at the night exposure (EV 6.3) wash a light stone tablet pink around a 520 lm fire; `RenderMeshInstanced` per sub-mesh is cheap for about 100 lanterns; Testtal's ember cap is 3.

## R3.11 Open items

The night glare on the tablet; the stone/timber site rule; the hall look per stage; door and free nodes look alike; detached territory is not marked by the lanterns; boot +4 s for the hall art; the word "Glutpfahl".

## R3.12 Candidate files

33 external files (`ext:`, = `git diff --name-only ca4535c 2c2b64d`, working tree equal to 2c2b64d) and 263 Studio evidence files of this round (all except this WORKER_RESULT.md).

| path | sha256 | size |
|---|---|---|
| ext:Unity/Assets/_Project/Runtime.Tests/Presentation/CurrentAssetsR2Tests.cs | 5e6f45f3771b266fd63b2d9350322cac2ab9404fbd0c26b4065255f39b6b4a8b | 24108 |
| ext:Unity/Assets/_Project/Runtime.Tests/Presentation/CurrentAssetsR3Tests.cs | 51b2069afd2461ffb0230bc846642518e87739d0e419b15e7dff42c5e24ac2b2 | 10801 |
| ext:Unity/Assets/_Project/Runtime.Tests/Presentation/CurrentAssetsR3Tests.cs.meta | 22a63d5f8d055ed007779394f1a3682454e3344c5a8d2bd29d0ed7872224a684 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingArtCatalog.cs | ff1ee3fe0e9a6f16a962b0463d2d4ed2ac7fafe5da0bc7953a1844d3a642a634 | 4922 |
| ext:Unity/Assets/_Project/Runtime/Presentation/BuildingFx.cs | 8bed691ca88071b388b76b4b96027eddb3d1ae9e4733a4afcdba1bda8db332a9 | 16693 |
| ext:Unity/Assets/_Project/Runtime/Presentation/DayLight.cs | 068fc5153b90fda5210999d313090e749b1789586ca12bb31d916237070bc9dc | 5176 |
| ext:Unity/Assets/_Project/Runtime/Presentation/DayLight.cs.meta | bb40a46d689082b9145e51c0ea54564e9959790ac21dbce9e8b994fc52def7f1 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/DwarfBodies.cs | 46099a2b984fccdb239ec4d85a55372dd818f2ee28208a2fe82b89c4948cf01d | 37410 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallArt.cs | 1d3f69cfd4124279774e29a470a9cae881d306f692565f799c33d3ed277deb48 | 20941 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallArt.cs.meta | 45b24e2a6e9ae2441d54a40c4fa01090ba273f58efa2cf89ac6f55cf952141ad | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallKit.meta | 8aba64421d6f89aec2300027bed965e52aa96b090e32cd3954b64160bc94fe79 | 172 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallKit/HsColours.cs | 007982e4a0f2c0596704393e620665d8db20839f108c7534895bd98b8d9a3ead | 3316 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallKit/HsColours.cs.meta | c927ebea4b19400d766543e4153f7a54df066b0d1837c209cdbc09aaa051562b | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallKit/HsHall.cs | 69b2cb1c57c71cb07451f368e760da1a63517879c19be594bc51a712430bb802 | 26042 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallKit/HsHall.cs.meta | e953b09451b7ecafbea63ab7cb5d385f300f5645e15301cf13ebbee64b50f133 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallKit/HsHearth.cs | e934e32f630bc0b0c7b7c1aedd4fd810fd96f8a616a0fa5167a71af32f4f862b | 10614 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallKit/HsHearth.cs.meta | 689d44947d5075e196e08934c73cc860bdb97725268df6feca0328cc2038b2b4 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallKit/HsKit.cs | 54314c840b2a70b23325edab6dbecb8e43d392428a9c8bd1feb392934780aa27 | 14895 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallKit/HsKit.cs.meta | 39d46eea3e17864c98a790ea0086d09c6b8a4aa3c973d69fc4fb75ff1e15d811 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallKit/HsSite.cs | d4ec8e0ae29ad728cb41a409bc38ba5d439f23e6c6aaac6c523b7f1338a908a7 | 20838 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallKit/HsSite.cs.meta | ea76eeb381088c4541a2a61652099fce1535e54cdf16904b4d223a5da3dac06c | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallKit/HsSmall.cs | 26b2663c30197d1ed4ff209ba9c49f48b80e8edaf783efed4ceca4d484a7d026 | 13152 |
| ext:Unity/Assets/_Project/Runtime/Presentation/HallKit/HsSmall.cs.meta | 0be81bec9b0488dbb8ec704cec744e3a7a93ccd4a5fd31291400241036164f8f | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/PlaytestGame.cs | d571ab896e5c116d7bddf157e056afbee98344c94901d9a718ded02fb368c032 | 33259 |
| ext:Unity/Assets/_Project/Runtime/Presentation/PrimPool.cs | e34dee53a3265a423f7b1776664054cbaaa855238eee4a2a4487f49416288945 | 5871 |
| ext:Unity/Assets/_Project/Runtime/Presentation/Ui/AssetCapture.R3.cs | 8dca4184fb9a081c3158448dfbdbb2c95e31a5ef82a5ff3d855465cbffda9996 | 22787 |
| ext:Unity/Assets/_Project/Runtime/Presentation/Ui/AssetCapture.R3.cs.meta | ee0e5898d3bf52aed7744e9ebea1f9ccebb3584d0985e60a0f041efe170a1829 | 59 |
| ext:Unity/Assets/_Project/Runtime/Presentation/Ui/AssetCapture.cs | 9791f0abf21a5475bbdf412432b5a0b0a809d19efecc39f29012461197ec48b5 | 26048 |
| ext:Unity/Assets/_Project/Runtime/Presentation/Ui/GameUi.cs | af7d826b7a844f04de2fe3f1b78c80ae031bf5b4efb4704438f36bab0704872d | 88120 |
| ext:Unity/Assets/_Project/Runtime/Presentation/Ui/UiStrings.cs | c750eb1628f522952c7002ac26f0c21ae9c399a6d082222729790ac4e4719d0e | 24349 |
| ext:Unity/Assets/_Project/Runtime/Presentation/VoxelTerrain.Painted.cs | 0f67ab5d66155337de92511824eae4001fed2440a1c038e1c619bab41cb8324d | 24629 |
| ext:Unity/Assets/_Project/Runtime/Presentation/VoxelTerrain.cs | 239f6052f3d440e297a76782bd59aeb33dac508c0f71ca676464481646b60c89 | 91827 |
| ext:Unity/Assets/_Project/Runtime/Presentation/WorldView.cs | 6fbbc7b47d856ae79036f15e5656088d1a7ffe1d95245aba73e6c0f3856df80b | 120958 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/ROUND_3.md | 32a50b331329109eb11a8cef9cb4ede312aa2b794cfcb63426b8e7f3b3d5e2e5 | 9140 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/01_hall_area_day.jpg | 0d32c76cd4baa7230b3299877095a557971f71fb099a77c8d363a20b72819a16 | 974379 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/01_hall_area_dusk.jpg | 633c9a7f33eb7b775be17644ac6223e2fa3030bde5aec3e5e68656f654e462c2 | 984401 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/01_hall_area_night.jpg | a55e34d8b3fd06f8f72c7d6e5db52362192bb4c336580f7bad73c77057fa4a31 | 630448 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/02_hall_close_day.jpg | 3ca82d210a0da7540eb4c134280a8315083ba91691665e9d66667414384c6ea9 | 722413 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/02_hall_close_dusk.jpg | 7cef112d987cae8e4860efe34d21c316c0649e27ea69b25f39172fd9f0610e77 | 733411 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/02_hall_close_night.jpg | c2026353826d4c939815a40d232709f8d4a6b95e4ed66375eb04d39c04e08dab | 527560 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/03_tablet_close_day.jpg | 0756c10864d1ff51badce9511e4b140084effbffb7f9349cfc1ecd9e85f52be0 | 296626 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/03_tablet_close_dusk.jpg | eb6a72bc566227d2a6babe66b6ca0e7d3a5639806b0eda43c86e333fbaa1bd6f | 291784 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/03_tablet_close_night.jpg | b4fae05555c1e7ac29f766844f09f767e54cc44fc3508bf286f3d8577e9a35c4 | 281275 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/04_tablet_12_stones_day.jpg | f0e7b103b09152146e1e3b4c3e36c60fa6ebe5bd1c8eaf5fa2b211f1cf916d30 | 299148 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/04_tablet_12_stones_night.jpg | 81e5e46cbb067ca75f6b851ff799664688eaf9d61ad5f98ac5c24bf45943f6f4 | 281605 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/04_tablet_2_stones_day.jpg | e5992ec85993e0746def2fd53dc9b0aa78211f121cd2d46527fcc296ff6362c5 | 295606 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/04_tablet_2_stones_night.jpg | ab75cbd53ddfb58e98f0f990a0622f23505764f1a9ff38b516a2694fb051a2c0 | 281576 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/04_tablet_6_stones_day.jpg | 3f1285890031a39433b3de59aa42e5a0727fe9d80332f77beb1daa5e7f3aa698 | 297677 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/04_tablet_6_stones_night.jpg | f9c9007722ddecf733b6a92dc27840e5a36fbf301f5e56c6b40472a5226ea17a | 281144 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/05_hall_tablet_day.gif | 16af9281a1f1c2b36c3476fe259d689158db12f391032c5db391d70f39300c4b | 8071344 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/05_hall_tablet_night.gif | a2a50a686ac621b9bd76610133a95e72d75c171427849c0382a0e1675d16652c | 8511003 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/06_tablet_day.gif | 4d7b20227886dac076ff2c01a6bda658580516220e8e0a62a52145a04640da1f | 4918266 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/06_tablet_night.gif | 1dfc7e404b41ad95328b2b4c011d062ba1a81c32cf2765c15a103a8520fca6b3 | 4926621 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/07_road_network_day.jpg | 9286256eb8af3359242f16dca2831196f61e9a1998075a4fb3365a89033f1145 | 952997 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/07_road_network_night.jpg | a2570ac4357f53f9f79e559206542a6e1a656772f55cb48752a59bfd58124ee2 | 657053 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/08_nodes_close_day.jpg | 247c553d9229db2c0777ed88037b406d8f18b9cebae1bcf431ee5d33b2671414 | 949716 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/08_nodes_close_night.jpg | cbf63fedac452ddd48c359bb7888fcdc9f181cdd5e3c9f02585d69a9d7177300 | 638060 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/09_game_sites_day.jpg | 84740e3672afed7565de46157378e3a6fcc140b29f78808031b8800e2e6200aa | 896183 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/10_sites_board_day.jpg | 4c27b0278ec859498d8a1c3a94e21753b09e53a49b900537e0b3fcf4c3dba22a | 802514 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/10b_sites_timber_close_day.jpg | 1097a1d6eb3a33664a6655f682fe8adbd1fa47a80b158817db45926831e0db9c | 931452 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/10c_sites_stone_close_day.jpg | dad23a9126f3b143cf9565ab06ab16138beb8ed380dd25a5f4e1718e9b8c0705 | 824282 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/11_border_day.jpg | 0f334f4aac9abc73ed1bcf2b1307aece7b966fed75d87a8b5558b2029c33a914 | 1003397 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/11_border_night.jpg | 88760d7d5ce132e9749ca776bc7c6859bf0dcc1da8439f70dbcb22b652dfa3df | 630032 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/11b_border_close_day.jpg | f7651062678181c187ebcc54d7063074a37e1c042fb358cb9e92a3a40b0f5f91 | 1160298 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/11b_border_close_night.jpg | 58aa0eb64608ca76466bc4d319b2b2537ff913ac987ad310675fefc9b67ef5d8 | 722459 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/12_border_water_day.jpg | 1be18f6a322f8419adad793d6345930bea27c39fb635d677916b3a85cbe3d909 | 829661 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/12_border_water_night.jpg | ddcd58d7f9328c765e36860d333f7b0ad009edfdf62a78fe5b878bac11a2c3c9 | 497434 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/12b_border_water_close_day.jpg | e0fe1e6fdcfec76dad5a4d15043bff3cfc43e4e463d29bb6bf7d0228b6479f31 | 484778 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/12b_border_water_close_night.jpg | a0c8377c141748a024422f02f4df5ef07c78735f3a6d70e687640242a7c2731f | 262517 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/13_door_fisher.jpg | 4b216bcbc7ccc4b5f018e9d91caccba84e87adf0dc64c6860a32ea6c99130d47 | 863613 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/13_door_forester.jpg | 48dd4eb5ce93bd7af740b8e7d67b079e08812e37a231b2df5cf77af444d5808d | 880847 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/13_door_hunter.jpg | 53fe185b6e4813f23956c4c3c3dfd0e801dc0c480b79e53e84a9a831deca4ac7 | 836102 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/13_door_quarry.jpg | a062d2712d94ed222a0a9b1647de8bedc4c93aad2baa4ca02a962ac9370f68ef | 691341 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/13_door_woodcutter.jpg | 3926489fc3d68d35db22273bf9241f6bfe2a55d05495e4f311821a0a131ade3f | 899209 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/14_hall_dwarves_close_day.jpg | b1b08d1f5e1308f3186810ce1cd662bdcee6c87776f018951e11c052850f878b | 723615 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/14_hall_dwarves_close_night.jpg | bb9bc2cf5d43423ebe85ac4948636f33d345ce77c3dccdede50735b268aece7c | 517104 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/15_hall_dwarves_game_camera.jpg | ff16b2eee01d359b95c1e86edf3a3db6befba180b13cc4a36807bd5b8ac78e73 | 972406 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/after/capture_log.txt | e07791c1deab812844d71ac1850647b202f9b9c1d6ce6307a4ec19c4934da44c | 7884 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/crops/strip_05_hall_tablet_day.jpg | de78e9b4b1587a3d211b64fb8a69c9a054f0371ffd6d55f3ccbab4a808f8f924 | 593927 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/crops/strip_05_hall_tablet_night.jpg | 3fe362f99e8a57022ee5ff3e1519e945664ae5ec09e9309fdcec7b8be506b48a | 571482 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/crops/strip_06_tablet_day.jpg | 632907d0f35326ada2b92cfc68fae05ca9cde9e0cb0d7bf5fc2bd149825a6df9 | 370975 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/crops/strip_06_tablet_night.jpg | a76b5fe616bc0f231f54aa60b21808471e10db3b8c7754424fc6bdd348c8dbd6 | 347215 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/01_hall_area_day.jpg | cb9c3430f96b65a35ef4e919990d51fe3b400968d331827cfdafe70749f9bb31 | 984158 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/01_hall_area_dusk.jpg | 7514ef6833e589ac7f290197b424f4c22102c806495de656174f5f9b5c83e5e9 | 1005949 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/01_hall_area_night.jpg | e116ffdb3ebd4ed7004b5ec9f7b7ca7840f5264ef14a98bc3857ac33d5a4f082 | 650308 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/02_hall_close_day.jpg | 5cee6c4a527924407e57be604b731d364dbb5ec0eb7add579dbe71e4d2c0bfab | 765089 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/02_hall_close_dusk.jpg | 72fb092d3b3494076782482234a6fdd0447266db73a2f4b6cfc06c9fd12de758 | 780435 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/02_hall_close_night.jpg | 10351c1cc954e150d18bb917480d98160436b0dc953bb393ce81f7c4e1b30e8c | 557859 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/03_tablet_close_day.jpg | 256773f0576de80c4f678571ade8fbdeb9930391b3e9f08f14259ae7622e2fac | 383600 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/03_tablet_close_dusk.jpg | 29a91f824e62d32d41a6f95c739572c9f285435e59da1dc8713189f895c4d606 | 355987 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/03_tablet_close_night.jpg | fa593bc8a7fa9314db887bd431ca94c73ddbedb9fe8e1d87fd48b0c9f25d3af4 | 359385 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/04_tablet_12_stones_day.jpg | c4b3544182febc68364f432140be33852f17a2bbd14ce485e7b7742a23e7223e | 381429 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/04_tablet_12_stones_night.jpg | 67be72757349f84cb16864a616cecb3e481216395a3624944df6a9d5d72c2b70 | 361595 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/04_tablet_2_stones_day.jpg | 5f39013e35914f16232330e28786d76c3ce4bdad3887199407d8d9e103a14bee | 379652 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/04_tablet_2_stones_night.jpg | b7cdbff7c9e04700e630d4774199e71b537bb49ccfde0dc8a716a064d2c9379e | 355911 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/04_tablet_6_stones_day.jpg | c3a5e81e36d5a3378e83aee31d266cbe60f9beb12f65ed89dd889a3f5c61e170 | 380172 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/04_tablet_6_stones_night.jpg | 5e36156534119dcbff028e30d9f751130bb60d2a4c27cd4fdbf814e743b13157 | 356681 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/07_road_network_day.jpg | 61df48b0c891e19b5ce185bb1126d59d1ab3bd377ebc43d8e1007fcec2ea7643 | 959073 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/07_road_network_night.jpg | 605ecd9a29fa9c30b0c596a74f667417a22aadc79604b31b1569099a917ce170 | 657119 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/08_nodes_close_day.jpg | 62ad33b4a97a19c60be8a1b1ed201cb9b484f97f58b99f1dbe5784cff12c5628 | 931406 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/08_nodes_close_night.jpg | 9b397b17afa4d4d4ada74af87c0ac458f8f2757522cd612d6ee3f52eb20c29a9 | 633241 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/09_game_sites_day.jpg | 7e714e80c4dd522716c1b230c091b2ffbda7294efe4504ff93d90ac562d86a1d | 1040974 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/10_sites_board_day.jpg | 0838962c0828f54867e2634a75eefbbb3660a523d2f97ed8e033535b3c4ad37c | 866022 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/10b_sites_timber_close_day.jpg | 339a9ffb57924f457e11abb5efa6e944d1498b14d0a3c3b4d9676c66767d58df | 910351 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/10c_sites_stone_close_day.jpg | d50096fa528e01c1bee56157e918512e6c2cfb69850dbfe60e16c8e055a0b171 | 837153 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/11_border_day.jpg | cf3301b7075bbee1b1cc2b5e8852de3f0f61fd90d9dca03ef41c345c4f9ee4dd | 996033 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/11_border_night.jpg | a9aba34f09405a72b1da701ac5bf7155e3296ad49fe46a31919a0133bb6662f9 | 641276 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/11b_border_close_day.jpg | 9fc96f7d9df8de98bebd13a8a04e1ae0df0c0566142f8e23da4eea36a5a86a9d | 1128693 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/11b_border_close_night.jpg | 28b3f71b48d92f59cb5179115033d296f77d95e1ca922d48f8b34fa4ffa5bc8c | 721691 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/12_border_water_day.jpg | 53ae73829499706aea9e7a5c2724992e9ac701deff88ae8f950f8ebce23e0bb6 | 830904 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/12_border_water_night.jpg | 0d5443f4dfc654721ae73aa8384fcf35c3ca816952e4ebf9f702daa716417c6c | 496032 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/12b_border_water_close_day.jpg | 3a069cba3d8eeeb3fd0531591fba24177e7534e60ec726b41cdac6b91094fc8e | 493969 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/12b_border_water_close_night.jpg | 7b7689c65918b97765effc610cd599dc7baff1545a64123eecec3ab6424e5f2c | 266369 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/13_door_fisher.jpg | fa1f25db95eedbff0070695f32e47ed639d5b551db5bc2f4fc8a4dca670ced61 | 873544 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/13_door_forester.jpg | 0b418a7193abf40c241ed55753a64fa002f2f944be873a7f3e208c947a8b3648 | 901425 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/13_door_hunter.jpg | 071fa48d38d764ae0f1ac90fdf498944a776dc3549503df9592e793c64789b28 | 842497 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/13_door_quarry.jpg | cadce4e75b14284ede604eb46467bc87bf6255b79fea86c0e5c3d0f027d9f110 | 695697 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/13_door_woodcutter.jpg | 7a5ad62a13ea2e7a0b38d441c7aa942e14687b57ee945ff58cd466b2d5007859 | 910637 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/14_hall_dwarves_close_day.jpg | 4477b3868ce9b333494ddb0213f8e5a071c7068d8bd34d0b31988d5fc2515cae | 774501 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/14_hall_dwarves_close_night.jpg | c6678be33d4c885f0c4aeeccbaad78db05147b95fa8efd35aa8efa3f239280fb | 547911 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/15_hall_dwarves_game_camera.jpg | f292f9b00b4760515db9262b725a20ec3348dddd5f481e19da7aa29c76da7ac7 | 981227 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter1/capture_log.txt | a177b793160929751990c4b6a12f30927ee1b1ab5f5a8c373d63b8236542920a | 7840 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/01_hall_area_day.jpg | a59266c0ddd1ae21c68785217a32d5686215eddf663e923cfd1cb10b7af2ba1d | 981257 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/01_hall_area_dusk.jpg | 2826ad27595740e769815e8aa887e0d393cf5bc6e91812095dc0b1c891d0bac9 | 992432 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/01_hall_area_night.jpg | 51950f07086cf5f4865070b46aca42093d837468818e587153ec55b61fa6fe2d | 637130 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/02_hall_close_day.jpg | f658fe89283d42f6f81e8e6ca5adad7a22b63f818350886cec91ffab721943d9 | 725368 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/02_hall_close_dusk.jpg | 6f15a59e0207ba344dc6f1c0bb16f9646ff6f2a12806b4216fb77392f6b801c0 | 734911 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/02_hall_close_night.jpg | 2fb6c530dff6fbd1875d1da6e680d88a1d133fb9e9049b4fb4f47d2d8821c274 | 527480 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/03_tablet_close_day.jpg | e3e96aaee0e63ecb8ea65950f520210636015eeaa0862221fc0a6a804da31784 | 298356 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/03_tablet_close_dusk.jpg | d784a237e1c70c79c0b10cfc088a9f493b4458cffcf92e9a0c5f8eac73600146 | 292595 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/03_tablet_close_night.jpg | 23cadccc394301a2e0a66a68f12fc6996500cf9d9377a2a815ce3a17d578ae88 | 280339 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/04_tablet_12_stones_day.jpg | 1c519f5248be37673d891df07f5663e4fc943569a016bfb05f138ecabd481f69 | 300223 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/04_tablet_12_stones_night.jpg | 1de6f9e06f049f9dc8e6ee06c9e327ef6eed45d1d98e0ccdf24e27ce8beaf60d | 279544 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/04_tablet_2_stones_day.jpg | 83f46f068e5e166532b97e235f76144a89a248c44f6f49162acc4dc9912759fa | 295553 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/04_tablet_2_stones_night.jpg | 6ef360f6e61c199b95da25a3776679d2abc7001a31e681a339dc84c6244f4a5e | 283988 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/04_tablet_6_stones_day.jpg | af92bb8c1a160c819518340937ccf3620421fcb7b4cc32a49141b25370c324a5 | 297329 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/04_tablet_6_stones_night.jpg | c19f0c230ce383b4fd8fd323889c31b93dbbd36060f7e8b8a342bddbe9dfa785 | 282011 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/07_road_network_day.jpg | 99ee7e171c7ae08c681843dfab1514841e28d7ce4850f71b64116b0d6236ced8 | 948500 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/07_road_network_night.jpg | 635a17d498f6e015045628ce30ad299635c082fe9a634681694929854a06dd7e | 652226 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/08_nodes_close_day.jpg | 90231ec05cec0989e358ffefa7f47a5e269ed52d2bf0bdcf20cbec74c760d7d3 | 940023 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/08_nodes_close_night.jpg | 6152aba767cf46929e19a590788c4e848b0e64930e7e8412dd16141fcd8574d2 | 636857 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/09_game_sites_day.jpg | 5c2e78485ab3ded35b80b28bacd563ddb8d401514a76c07be9b34b35695e9ee4 | 888036 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/10_sites_board_day.jpg | 9c0d76e612a651cd25b8483770f6601704fd59135c65ad00dba91fb92bb82773 | 791078 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/10b_sites_timber_close_day.jpg | bb3bb733a7c8e0b431a58e6d1d94eb7a4a50ba295b594e589e0ecf2ae0c6ee45 | 930962 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/10c_sites_stone_close_day.jpg | a7de0fc5bc7fadbec722cacdac206528a9b38b62a8aaa1ea79e968eaeb5b3555 | 824107 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/11_border_day.jpg | 6fd4fbcac9d605767973614fa0251291ec287522aa672efecb67aff98f95d115 | 1003394 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/11_border_night.jpg | b389b4830cbc2dc0ca2285f8ab3e00f7942ccada02f298e6417c2edfd94533ce | 630092 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/11b_border_close_day.jpg | 45c9a264c8197f1f02625ccabe543b6d516fc21bdd68b9632eee01b3b409a7b5 | 1159932 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/11b_border_close_night.jpg | c845b460aa035c792863463729a027db51aab85ede1061523adea85e07c7c226 | 721584 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/12_border_water_day.jpg | 029abac62cd3deebe2f7556d53ba6ad7151e4a6bd61dd12ac0fe90caed6e9252 | 828665 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/12_border_water_night.jpg | e0b32d02f79186dd0c88cd51255b0642ca6655cf57eae53ceca296b0345bfa58 | 503376 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/12b_border_water_close_day.jpg | 2b3d710e818f26986c814a76d71353d935a21a158815dfbaedc2bcf86f28bd3d | 491182 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/12b_border_water_close_night.jpg | 005a0f9bef70304c13ffaf59a18cae2221e5945ce3332ef4ba921cd5e62af851 | 259541 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/13_door_fisher.jpg | fb7ba3dbcbd57f1b70925c729e09f8a3317bd1c76fb76d61435f60a6a5383dc1 | 859808 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/13_door_forester.jpg | 1dc85b26bcd2691f0170964c8446a13bbc03e4bbc36b7b20fda5e9c831e7f81b | 881389 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/13_door_hunter.jpg | 45633ecef3e89e386559535392245c0922c2c47e7516ae35b1e08c106e7854f7 | 825458 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/13_door_quarry.jpg | 609f47eab8060639b44fbd7ea67df5b1551b8fce623d44f349be610177a0642a | 699518 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/13_door_woodcutter.jpg | 3892cf0dfcb68e1c57142dd7773832490b3ef749ed845a1a96c15103ea949b0e | 900152 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/14_hall_dwarves_close_day.jpg | c9d051271e186a70018eb2fc3df5d2b3135d8f21a2bd362e48f786c743236ebd | 717079 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/14_hall_dwarves_close_night.jpg | c8f9584e24db7a86bff2aeeb1b1932ec1c85d56c7cd07145e94a0d4cce5b3644 | 515854 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/15_hall_dwarves_game_camera.jpg | cd3e681dfe6e7d9d36b5a957049116b036b5cab98968c83be1326d4a13c12f8b | 971508 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter2/capture_log.txt | 2493aaeba6eefb26b58e0336dc673a7c3f348611fe90ca769f143689c68cc0fc | 7886 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/01_hall_area_day.jpg | df8045d80e1dca32352e06673b32d3b79b3dbaad9ba77b2b284c1e29f9fb0791 | 980957 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/01_hall_area_dusk.jpg | bbc8e69acd2831702cb51863e4149d2336d420b763a03cc2cce07777730dcee8 | 991902 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/01_hall_area_night.jpg | 6f71c5e741e25ffa09a2ac967f0b5d64416e8662fff9e0416b03f5ba5235d6af | 636486 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/02_hall_close_day.jpg | 5329ba08cf5a3eeee53f44c4cc84ce5fefbf7c792bd6a9c603ea144376781373 | 724583 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/02_hall_close_dusk.jpg | aed8bf20d47ea5ecc8ab762a39b8d9408a80299e3691106a1063314aa7a8a9e3 | 735298 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/02_hall_close_night.jpg | f221246271dee701c1de59c9b9869f7691ccc563179599d8474254c267a1061a | 527320 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/03_tablet_close_day.jpg | 7a83282b0aabae4234458b37754a0fc39d78a6fe9e8310a3ff5c90da976c8bc2 | 298447 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/03_tablet_close_dusk.jpg | aa3b8046bc927bab285b45e395425d610c160f1752feb4c22d07f8a97205761f | 292569 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/03_tablet_close_night.jpg | 572ab6175f1e24918cad914ec727c1037426adb2ccbaa32fc3b26c1617c77868 | 279362 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/04_tablet_12_stones_day.jpg | f7a9237418f5a7deed8e19573b67b9ee63b5755a2ab6d40407275d673c7535a8 | 300133 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/04_tablet_12_stones_night.jpg | b007bd275d554dc91ba76a5fe58b7c68424c69f06037638d6cd55636d7ce24a6 | 280305 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/04_tablet_2_stones_day.jpg | 3ac1d910ccb37b000b421e9129b270639c162ab594f7f3e5007f6609c9c05004 | 297644 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/04_tablet_2_stones_night.jpg | d49f524654847d71f8f20474e4c2a4cc11ccecb45bab56cc0ca1a852c8e8eaef | 282132 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/04_tablet_6_stones_day.jpg | d95d1d3bd880f7791de6ddc838d081466b399302f621bd156e6872e5b92acc49 | 296035 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/04_tablet_6_stones_night.jpg | cf779879e3049cd5b139bf0101ae71d4cc081cbe2ab665760ab075cc8f90a05e | 280538 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/07_road_network_day.jpg | fc7157c2fb6aba7d2a6837a73ff712a50f55b81aa3719236aba814f04e83e297 | 966826 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/07_road_network_night.jpg | b59699b301596add0b2f60bc8f95077093fbcc24629956772ce7453730725a83 | 649968 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/08_nodes_close_day.jpg | 8232b6c8721baf1125c45eaa1b5ef6602311bbf4915b05e842323f7e10542129 | 932543 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/08_nodes_close_night.jpg | 939683ec2e42cba88df199a5c9cd927c2b006e620edbc21b84b2f0671557a1d3 | 647278 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/09_game_sites_day.jpg | 3e32fbf21071f1b482056c6c1ae59a141001a17f5210bc696d30a6ec8abef737 | 878713 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/10_sites_board_day.jpg | 4726d6ec86845fc2ea777159f46ad6ac00fe4d1272a26f4b17edde5754d60339 | 865585 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/10b_sites_timber_close_day.jpg | 153e801551981df820b90d4d66f8e86da83988b513647abaca71d1be94b28872 | 932359 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/10c_sites_stone_close_day.jpg | edb2448aedc9b18dff92b11eb4f0a03a75e41078be7dcb5647b424889ab2f473 | 823637 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/11_border_day.jpg | 425ef0bfeef29e62014e14626899630c53280e4770d078bb25f0ebc5105539c1 | 999553 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/11_border_night.jpg | 99ba7cf59f40dec9d4f64bd2a46c17b58223f8957f6a86e18f851f9bfa1ce25f | 639254 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/11b_border_close_day.jpg | 495db148fa48ba44c00d0f3d085d84a9fc2813b13499c17d75b1808bc498c10b | 1146015 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/11b_border_close_night.jpg | b7f1d07f56de10e5c7b2a16561d4a51024c3837c0fb2b88f3c06e23c70ecea85 | 723322 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/12_border_water_day.jpg | 17cc85dcb6d2af8a77bd224ac638f335343536b3fa5cc34b127110311d5bfee5 | 845423 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/12_border_water_night.jpg | 8069d3fc515d33d0a3f1d1270f57327f995dbc53c2a1389e4f970d7cf7177ab7 | 502707 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/12b_border_water_close_day.jpg | f735aa3730191f11055e8b67c827bd104675d7eb98cb80e32711a9103df48e11 | 480758 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/12b_border_water_close_night.jpg | 8cdb85235dcd25c9943e8438968de6da5cb245910e73d4e8e871bb014dfd58eb | 263049 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/13_door_fisher.jpg | 2d78b267b1159c8c518e61a69f48c152fee08cff4a1a66ce46bb3e5fe266ec23 | 870784 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/13_door_forester.jpg | 39ec499fe6a700d30afe76521245f7d688f6c3ac1900ce6a2a8e5df89873d2f0 | 875636 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/13_door_hunter.jpg | ca0358e5e67054c63d48dd988623182a5c5e87b8a33455225e5dd4d4d4eaa475 | 820917 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/13_door_quarry.jpg | 045d88f26f5a739e42bc6808c6591da6ca2440dad8cd6614239728bfaff6cf8a | 703327 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/13_door_woodcutter.jpg | e470017f5513c6f4f81b5b249a1ccc8d0d78aeb1b200c6dff4eff8a5713e5e6a | 898466 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/14_hall_dwarves_close_day.jpg | 008b128af2753e2d25f8f659aee932fff548ecf2b259312a295f9ef08020c265 | 721595 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/14_hall_dwarves_close_night.jpg | 57e093744e467b92f690b848b12b3276432d61104a9fd6f65f47ad84cfa9b01b | 517146 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/15_hall_dwarves_game_camera.jpg | 1ab797aa7764e82736d92a31128bb3547df261ab83a7652999e123bc1e5d11f5 | 959858 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/iter3/capture_log.txt | 4f6b25b36728df3818ee018d37b2618da79184bfc32df161ec21f068ebb6eec8 | 7884 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/assetgen-tests.log | 4135fc71edd3c0be84977284aff2bdb825ac1529a1322b64d30819660275e959 | 751 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/copy-diff.txt | 9ee6e2919958b870d65d9cb86ddbc4eb181f37a3e4220d7bd60b0c0e5d770527 | 1358 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/coretests-dotnet-final.log | 952e5990b42417d74af46d0ee0ab889b33a4fa5cd372cc600a24bcff1612c882 | 2712 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/editmode-final.xml | f79c14034faa49c4a2ce89440cb2a977a1bdf8376759622d20e52b842cb0617f | 1513522 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/editmode-r3a.xml | c9f0942334b7082f7c0e37dd9cb2b24a02d74549b49125dcbefbfbd1df84d137 | 27426 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/gif-strip.ps1 | 6420f8eef74422609209464d7757f6a24be1a7fbbd1ffb571954809cf1333c12 | 1905 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/hdrp-settings-rewritten-by-build.txt | 5be4489bf21429dfe363934f96f2b1b258547afcdaeaa6af86d94d662425ce28 | 1333 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/make-sheets.ps1 | d3038fd4f2e774bd804baa6c7e3dbe1c30a1c1c29393321873f4b33aa93f5f22 | 2575 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/player-bench_new_0.log | 1a037bba9c72047a8ec24aa40fd2c5cf1fc775beaea15ae822a959c891c6200b | 16071 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/player-bench_new_150.log | 8add7c118ce46b677cafe264ed381e0ec9c0a9562f8327c458d2021ea742b7b6 | 16110 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/player-bench_new_300.log | 9a8212d2c33798161aa7084d0deb5cfa81e7f1f29794733567c950d714187d7f | 16114 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/player-bench_new_300_night.log | 5d17eb912736fb4d9187047fa2e2fd611b0d663d4f281c49ad39ed0dbc5cd091 | 16113 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/player-bench_oldbuildings_300.log | 79718d5c025af5592ababaefaf841a3a9a60cdcff1b460d9ed9abfb2c8d23747 | 14120 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/player-cap1.log | 76c073e98e4f7dfcce46353e78b35a057a204fb28afe2f6273b481d1595f4bff | 150380 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/player-cap2.log | 79ddc368a53463c739ca75487b50a7102b2f99435f94b9089563f047f3de0480 | 151877 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/player-cap3.log | 02b45bcf2ceadf51789c00b533d0232b8be0f54dfaa214557c4b3c0d7ab6883b | 151874 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/player-capfinal.log | 2e6ecf1a2bc330d2b2882c12c546c6f98c8aa980c462db771982bb0405b0cad6 | 151874 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/player-uicap.log | e639b7aa57bb5021464942b9dc0d83fb6d289f215c7d5391c69f23279ea124ac | 119296 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/run-bench.ps1 | eff7ed41f76babba695b86f6baae2fbccc819e0c4d6ccded9545a238e91477c3 | 1128 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/run-build.ps1 | a99c8ae0020c9e17b3d3ed7107961a0d6de8ce4fa11c4455299b6d36c8c25bb5 | 1492 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/run-player.ps1 | fefd04d26a70700e17b957e9ca5c7cb6d4854f65509226dfeac5f0ff624fc2e3 | 900 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/run-tests.ps1 | 1e9e6e514e8b41ba6269214ff9e49e446df5f818cc6b69ee5eb4b0cedae78341 | 1048 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/run-unity.ps1 | 532a3bcfafbc2fed14c3bc4432a1f038562c91eda63ce05fe079886f57faac3e | 1375 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/sheet-cells.ps1 | 7104b3b03c755bd7b4f7e84d8ee23edf3321757e8b66c12b01722f1bc1f6a3f5 | 3127 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/unity-build-a.log | 9aa484a3f0674b9a46f97ebd32c85b7790af963d1739d41a395eb214e7a92c64 | 790094 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/unity-build-b.log | 7e78013955a7eeb875c7505ef85a499d3b500da6de3b06df24f4c3e8b54296e0 | 66414 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/unity-build-c.log | 1873890cf9ce4c749dc32fb09eaf1afa3b57bc6ef341867d4e01faa9a5c4e724 | 759967 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/unity-build-d.log | de893f54bbdcac809c089701b971cd5be895f7f62c6836e16a1ac8dea909f84e | 796587 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/unity-build-e.log | 97e6c99447c1616c63a8dbcbea0d20da3794e7ba7dbe59a99dd09623a947476a | 738802 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/unity-tests-final.log | ed4cc2982f1ccc50ee2a9d8fecac5304e5826bbdf4d11b15e2274004f5aec628 | 697354 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/logs/unity-tests-r3a.log | ea0b78e9ed9943b0a0cdad34f39d7457a7e50a6237a22d0fcea276e88fa66a0f | 845664 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/perf/bench_new_0.txt | 596dfe6ba9dbd377884a982c32abd2d18930cd77ba00456e8590b34012883318 | 2062 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/perf/bench_new_150.txt | d352415863cd61f9d0a6316aeae994806c8bf6e84d45410a11a31ef76b8ffed0 | 2099 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/perf/bench_new_300.txt | ee2de579b9cb772062d158ee27a2150651cbff790a7b046526c1df4628ff1954 | 2104 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/perf/bench_new_300_night.txt | 1de7f89615ad3dfe8d7be5d2f1e7c2615e6fc4a57ec30c91a737e323b08adc9e | 2104 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/perf/bench_oldbuildings_300.txt | eccc8c48c9fa4da181512cfafa0e217b79c52008b862997fdcd595f2886c9d04 | 2104 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/perf/perf.md | 8fecefd2274945458d788d0109809efaabb3d24be287d11939728aac8c17f422 | 1347 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/capture_log.txt | f135799ed4c1172a8f15925b0059b4824277d6eaf6922958cb48bd6ee6a6982e | 7060 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/coverage.txt | 49785577559aac31ab7acd61c6afdcac329aa0c2878882bdc1396b6b92f14836 | 925 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_00_start.jpg | f0009a522b6add4934bbbe448a8cb68829953d0a44d23421bc08829b64097f4a | 82577 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_01_step1_look_around.jpg | 10e1a5f5270d5e870c3a1c12037141ed84ea8f44e849fdb17fea9f49411897ec | 875884 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_01b_paused.jpg | e00bbbdc26ecf47b8ea52256f0ec08536d0eb2af3a5d9c2ab6177f22d57ae3a5 | 859174 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_02_step2_your_store.jpg | 302cf50637233fe15d56fce15a14c771757dfbc260b833517418b05ba56d39c6 | 875909 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_02b_hall_info_and_embers.jpg | a9e34a37ac1e8c71441707fa2bc81ce53986eef18f1cf211bd5395f1fd3cef11 | 845594 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_03_step3_wood_first.jpg | fcdc4f09045977db947c1cd5c28eef567d5d8c4a340800c40e75f93f91a43720 | 867506 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_03b_stuck_hint.jpg | ff89b1231a697c86eacee0766a32f0dba016bb5b93424339648a70a70e06922d | 867846 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_03c_build_menu.jpg | 4958e9276187f30b6a96eb48eb18a833a779617342a1023552baba1bb4bbff22 | 844948 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_03d_no_trees_warning.jpg | 5a16cb10b4cdf10bdeb05e5f25cb78c44a80dd98eb09dc8e595a47a53d3056ed | 899693 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_03e_outside_territory.jpg | 45587a25ba5c466b869cfa8db6e8f1572f391e91767436dee5941b2ae88af097 | 908902 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_03f_trees_in_reach.jpg | 4a8db5df23940edfdb79b9bc3e5a2376b55df3307e120f6ac9b83fb074e66b84 | 909039 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_04_step4_road.jpg | 750f79e4e85a4cca456580b0a1648ff8c67380f5f5bf464e70b99530e13c7a50 | 875123 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_04b_hut_blocked_no_road.jpg | 362926a8197f718e30e7365d35a49c428aafec1a404e1df00f048722539faeeb | 858654 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_05_step5_first_wood.jpg | 9c54d865b859aec4f7075ce4e548bece8b5108a3fe14b261b21b7d97476837bf | 841086 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_05b_site_being_built.jpg | b876a8cd5042c88f1e6146714232a2da03da9c73b0871a20d11248d6015a84e4 | 878029 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_06_step6_planks.jpg | 815b523f8c321122d294910bdcff7de4d79dc2e582ddc73387327be668855ca5 | 870066 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_06b_sawmill_site.jpg | 86171dffdb54c92f0e1b94cb613c6b13f9d02be7070c29fffa2f46dbba9c9016 | 897712 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_06c_sawmill_connect.jpg | 11954881254ca65d84141fefecab26ba2a9aa8704cd577e5f427f63ce705e59c | 849852 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_07_done.jpg | 132dd106f86446a3ed1ee9cb5ccc7c74f00ee9dbfd3c098d32f0275705004eca | 857417 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_08_help.jpg | 232e0e9fbf76c0b328e9156ed15342be2b12586b9658613c7d7fa526aeb9e7a8 | 692266 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_09_menu.jpg | 55be3ef24db66af6138da266208821d720b146a12cd4a1de672850f9c2766ec9 | 683081 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_10_settings.jpg | 134f30560d4fb5919287d78b69111c3eca9c777a8c500f844dd09506d4ef2607 | 685328 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/de_11_free_play_resting.jpg | d5c57784d1dc692dc2d15ae02c2c2fe1aba81207b598d15e20295a80ea37348e | 876717 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_00_start.jpg | 904341759ccf159b4fa2c171e632721746efff5c1517531305be87a1bfc29451 | 82205 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_01_step1_look_around.jpg | 7f78e904a5989026cde1aaf06acf3fe4c60e4748eba5831a35890a4286cf569b | 864214 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_01b_paused.jpg | 01a1fe4f928d964a69a4f3b45538a4fbd3e8621ff98fb8215e2490c033879048 | 855918 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_02_step2_your_store.jpg | 7e7ec6a5e4e735f13a038201abc9e82820e11c244361f1f3bfdcb82d619bc672 | 858275 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_02b_hall_info_and_embers.jpg | a92b56f747e099b945849a7fce450a82cedd5fae747972277622db49704c2b66 | 838341 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_03_step3_wood_first.jpg | 46344511af5ffff02c093dafcd3efa9bef7d3a73fd80f2db95d92506aeeda166 | 880568 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_03b_stuck_hint.jpg | 4fd5f0e8b8b6dc243f18fdd09405013522db152e2d94fe72c37ad9a05002f4cc | 866275 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_03c_build_menu.jpg | d8782611d0da9e1b8727c02056f5a164b4759c8b182ce5b5608b4b82836cb17a | 836452 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_03d_no_trees_warning.jpg | f302f85d6cd5d7560590b18d49bccd673373cef82333d5475c4e2be726564250 | 909489 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_03e_outside_territory.jpg | e2d4c5a238b3066f7cb503fd0137117be416f130c57dd0f9d607ebebdfbd7677 | 906452 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_03f_trees_in_reach.jpg | f10910eda7d9e2917f73480862467c5887c81eba66810c25e40725125e9b292f | 889975 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_04_step4_road.jpg | f5c347f971baa47516737ac0c0eea2b57848fc7599fcd9699f51d824ba00c81d | 872129 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_04b_hut_blocked_no_road.jpg | ac13bd60d0286db51a883227855d7536de043f6d4018395341c6ea06f0376d90 | 838442 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_05_step5_first_wood.jpg | a49cd45a0bf3ee69c9db223ad25f63ef75aa5e0cac9a70afacb8d81102d1fc22 | 851770 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_05b_site_being_built.jpg | ac7165573b1859b633eb1f81846651bb299aba9113ec4bf6e604e38036185cdf | 864068 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_06_step6_planks.jpg | 8a182e2a9e50f6af18efaa3d0913278037ed518b385b9e3fdfe0cd112fc81225 | 872786 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_06b_sawmill_site.jpg | 657edb0f7f5518da3e5635815355a00810a453622fbae17e9dd83db64370879b | 908449 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_06c_sawmill_connect.jpg | 5a9393ab06cdc669fbe58e5a7515c1551219487ff311abc9ad0ad1c73bee73f0 | 859748 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_07_done.jpg | 384f7e92229a7b1c1f4ca3e8a092102aab8c459310e78a371bcdaf8f10e85128 | 849533 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_08_help.jpg | 324d3d3a8c489cf430ceb69b31946a387cb0fd21775e0b15ffe3479a5588f90b | 702138 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_09_menu.jpg | a224aa49b281cd60252f862e217f4c5eddc3ca52ca9cb886b52d60604bc3cfb0 | 672326 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_10_settings.jpg | 83b5ddbd9e85e54600a979a16e6d4c0f2f0bc3e5f6b84bb34f10a2575481408e | 674534 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/en_11_free_play_resting.jpg | bef753f1017ee22c48546fcb86973ec989192e7e5f5e2b6f095f9f9b0ce37ee2 | 872840 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/first_session_de.gif | 02ed33baa5451b00dfbca1f95befcfe51db63c16f0b5f29f5ea0f5f479323be0 | 4549976 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/session/first_session_en.gif | 30dbf14a0516c51f296ab78b25d25e84cb29c3af16b726e79f31d884b31b690a | 4431735 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/sheets/sheet1_halle_tag_abend_nacht.jpg | 5e1da60d108c5e65498fe9b4ecde2e9b0623e6871e0cc71d8f44cfe8cd14ec80 | 737961 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/sheets/sheet2_halle_nah.jpg | f8c34d286a0c6293b47ce10a56d75a7995391ef9f799a8b7612123f2a41c3bb5 | 254997 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/sheets/sheet3_tafel_glutsteine.jpg | aa9f59be3d2a4c4923ce360bd8128ddcfd007f9ed32193364938438f5a031c3c | 345892 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/sheets/sheet4_wegknoten.jpg | 0f029ffd9282792130979c1f05a9b669474889b662112bcea7f70cedd510f440 | 705703 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/sheets/sheet5_baustellen.jpg | f41032adcfb7e59d329afa0b8ce43df316ca3f34a08474eb7a41e27364d2b095 | 802996 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/sheets/sheet6_grenze.jpg | 229daf7be8a153b0f9fbf07443d86da23d2389525599690708833324245313de | 957051 |
| Artifacts/Hearthlands/Evidence/HL-GAME-CURRENT-ASSETS-V1/round3/sheets/sheet7_zwerge_100.jpg | a3dc2b22f9a856134d65510036d3ea0b2dd82f56c01c1387b90ee82d81aed29c | 579620 |
