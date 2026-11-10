# WORKER_RESULT HL-WAYS-CORRECTION-R7-V1

Worker: Claude (Hearthlands Worker). Mode: Discovery. verify-worker: PASS (receipt d26a1256a807df540fee2d3f70774f0b25ad230a805c3760fd595cfcbda1ea3b). Base: 6c24be7.

## Commits (game repository C:/GameDev/Hearthlands, branch main, local only, not pushed)

- e99007d step 1: ways core of round 7 (steepness ring rule, hunt at the map's game, one-worker start, dwarf count fixes; settings version 6; pinned bench hash 7694854352402969179; WaysR7Tests; older round tests on WaysTestSupport.Round6).
- 9bb46c3 step 2: runtime and UI of round 7 (levelling as one slope-limited field, own height, no cut beside water; hunter hints from game; TooSteep text; store/free carrier display and dwarf job text; fuel filled in; round 6 switches -hlWaysR6Level/-hlWaysR6Fuel/-hlWaysR6Hunt/-hlWaysR6Steep/-hlWaysR6Start; comparison starter; capture part r7; WaysR7UiTests).
- 5c2ff22 step 3: capture part r7 placement fix.

## Tests

| Suite | Result |
|---|---|
| dotnet CoreBuild full (step 1) | 2245 / 2243 passed / 2 failed: the known pinned-hash tests TheDefaultProfilesPlayExactlyAsBeforeTheLevers, TheBoomRunStaysBitIdentical |
| Unity EditMode full (committed state 5c2ff22) | 2591 / 2548 passed / 0 failed / 43 skipped |
| Unity ways rerun (WaysR7UiTests, WaysR6UiTests, WaysR5UiTests, WaysUiTests, WaysR7Tests, WaysSystemTests incl. pinned hash) | 42 / 42 |

Version step: WaysConfig.Version 5 -> 6 (WaysWorld.StateVersion unchanged 3), pinned bench hash 6121348184433691775 -> 7694854352402969179 (dotnet and Unity).
Probes: logs/r7-probes.txt; tables/r7_bauland_steilheit.csv, tables/r7_tag_ein_arbeiter.csv.

## Build and starters

C:/GameDev/Hearthlands/Unity/Builds/HL-Game-ways-r7/ (build b2 = committed state) with "Wegesystem Tag ohne Strassen spielen.cmd", "Wegesystem Vergleich Runde 6.cmd", "Wegesystem Vergleich Zuteilung Runde 5.cmd", "Wegesystem Vergleichslauf (Wegetest-Baustellen).cmd". Series kept: r6, r7; r5 deleted. HDRP settings and Main.unity restored after each build (logs/hdrp-settings-rewritten-by-build.txt).

## Evidence

stills/ (capture r7_2), vergleich/ (round 6 above, round 7 below, same scenes: capture r7_3_r6look vs r7_2), clips/C1_einebnen_runde6_gegen_runde7_1x.mp4, C2_feuer_holz_runde6_gegen_runde7_1x.mp4, tables/, captures/ (r7_2, r7_3_r6look; the clip frames and the first capture r7_1 of an earlier capture code removed after use). Picture-only debug steps: the four levelling sites, the finished woodcutter and small fire placed by debug; 3 logs laid into the small fire if empty.

## Launches

Hidden batch editors on the main folder only (tests r7-ui-1..3, full; builds b1, b2). Minimised windowed players of HL-Game-ways-r7: r7_1, r7_2, r7_3_r6look; all exited by themselves. dotnet test on CoreBuild. No Unity in the Wege or Zwerge folders. Untouched: ProjectSettings.asset, Wiki, Kevin Iglesias, Source folders.

## Candidate file list (git diff --name-only 6c24be7..5c2ff22)

- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysR3Tests.cs sha256 684d47978f433d1cd88b4b28b2de517e26b264627f45bf0070609d783a12cb23 size 10821
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysR5Tests.cs sha256 91c51a3e8705902fff2316f5d043e922191dbee51c0d5bea35ccdd51b7b09881 size 32086
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysR6Tests.cs sha256 76621c958b5591178208b0abd200fa40a73cfadce849c3874fb16f33f3189dff size 25351
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysR7Tests.cs sha256 2a895f414c28dc543b472ce5242477322d4b052dec95763148bb4ce2d7c41709 size 26031
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysR7Tests.cs.meta sha256 2affc091f521743891add4dd1a230af85fd805642540c5e26cda1c6df33723c9 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysTestSupport.cs sha256 d51687d07ac8023a29cba4c537f9cfd140f5a571cc29fd7a429e92e133b472f8 size 4849
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core.Tests/WaysTests.cs sha256 4778a5f5a52b2ba0f16df8ec0f9a254cba2ff9b42a10119627c788a8d18f4da2 size 40390
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysBench.cs sha256 6ab2b6b07dad13efddb17aaf615292c02b9e628b1829dd615d6c159937ff86c9 size 11546
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysTypes.cs sha256 e9d0a58a2c6f869e734dccce155f64d5a254d1f9045fc919e5d0e9f12e4fd871 size 48235
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.Build.cs sha256 8ea0c1dd72b00403a2dcc6554a7fc208ddadf759353d52922203cda5d7e6431a size 37101
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Core/Ways/WaysWorld.cs sha256 81fc0d129c9b4d60a593c1f967d36c307c41e73dfe5ed7cb45243ee71d41ccf6 size 37027
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime.Tests/Presentation/WaysR6UiTests.cs sha256 1465d43f24ab3fe4cda9b820d813fc519b07bf3f1edaf68e09276b01478c2188 size 13386
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime.Tests/Presentation/WaysR7UiTests.cs sha256 f3f80853b64aeedd65431f25d4def17b5fc98f33c16e241ece79e67214867b97 size 20310
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime.Tests/Presentation/WaysR7UiTests.cs.meta sha256 2b830db84a0a8bfc64ee5d014db890d61e8ba18b5c2422a1a83f9c4cd135af06 size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/Editor/WaysBuild.cs sha256 3d454014b96a93c4f48a644ac2ab5624eefaa3fae9ceb227daca251995f7465d size 7710
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysCapture.R7.cs sha256 840554bee3b0659618443cd1f943bf8ba1d0e07cb8109af7a9f955d887fc52b7 size 19376
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysCapture.R7.cs.meta sha256 3aab5a7ed96e418b3f39baf1c5084ae6d614998417d0a60092d99238b326caec size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysCapture.cs sha256 996a87bc4b4225d4760fa464a1294cc52f150866c8e8d2f578097e266bae7ff1 size 19232
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.R5.cs sha256 74cdf735d8ac20fbc3c95ea8ea550dfeb158d81585890cb8f1a5ee07d1361518 size 18931
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.R6.cs sha256 03d35d1db9911c472dca4369b97bf81c9cef719a20fc5051ea0c6d193b84cc67 size 7585
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.R7.cs sha256 8384c6a30016c27b7074975bf5f848e4cb367009ff8b12a9cef626a905fa527f size 1273
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.R7.cs.meta sha256 6ceebb782f8a381ef12fa04f11a1bbb5045a9455c4fcaefcd75344031a4951fb size 59
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Look/WaysGame.cs sha256 7c791dd797cd6e9ee3778da12b4c30248b9b8d703c1a9b9ee79e2abae8a15326 size 27195
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Ui/GameUi.Ways.cs sha256 21abf35d86fda77b274933c894414c5181d812d4ce003db82299a1915a4e8c86 size 66116
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Ui/UiStrings.Ways.cs sha256 0bcb56858b8e5691aa5882c29768e8e5955e1a83c4fdbb06542a1e28ef9d0360 size 24497
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/Ui/WaysUiFacts.cs sha256 32b0c1f28a5dbc63f666e85a7111134e182c6ef8e0029d5ed795aa890bda7d43 size 37519
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/ViewMath.cs sha256 67639264e21a21c9707302e8dc9b9dde72c66aefb3e49acbb30f14aeb9254b8e size 39361
- ext:C:/GameDev/Hearthlands/Unity/Assets/_Project/Runtime/Presentation/VoxelTerrain.Soft.cs sha256 c554c644af663a3568d2378b698ea69dbaf1f2839d8e5da028744fa9e4150d64 size 36138

