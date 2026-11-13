# Independent review UR-RVT-BLEND-TEST-V1

Reviewer: separate Claude Code subagent (did not build the order). Date: 2026-11-13. Read-only review; Unreal and Blender
were not started. Sources: `Artifacts/Underreign/DirectorDispatch/UR-RVT-BLEND-TEST-V1/WORK_ORDER.md`, Studio and external
`WORKER_RESULT.md` (identical body), `C:/GameDev/Underreign/Evidence/UR-RVT-BLEND-TEST-V1/logs/`, `git status` / `git diff`
in `C:/GameDev/Underreign`, every image in `Game/Captures/rvt_blend/sheets/` and a sample of `before/`, `after/`,
`rubble_noblend/`.

## Checks

1. **Scope - PASS.** `git status --porcelain --untracked-files=all` (excluding `ArtSource/GroundTextureTest`, other order):
   modified only `Game/README.md`, `Game/Underreign/Config/DefaultEngine.ini`, `Source/Underreign/{Public,Private}/
   URGreyboxMap.*`, `URCaptureDirector.*`; untracked only `ArtSource/Rubble/**`, `Evidence/UR-RVT-BLEND-TEST-V1/**`,
   `Game/Captures/rvt_blend/**`, `Game/Scripts/setup_blend.{py,sh}`, `Game/Underreign/Content/Environment/Blend/**`
   (2 RVTs, 2 materials, 1 MI, 5 rubble meshes; no texture assets). No change in `SimulationCpp`, `UnderreignSim`,
   `ArtSource/EnvironmentKit`, `StyleSample`, `Design`, `Content/Environment/Kit` (incl. Materials), `Content/Greybox`;
   `setup_kit.py` untouched (the blend material is a duplicate made by `setup_blend.py`). No scanned texture tracked or new.
   Logs are git-ignored by the existing `[Ll]ogs/` rule (present on disk).
2. **Code diff - PASS.** `-URRVTBlend=` and `-URRubble=` parsed with default 0 (`bRVTBlend`/`bRubbleOn` false);
   `SetupBlend` loads rubble only when on and returns before RVT creation when blend is off; `GetKitComp` swaps to the
   blend twin only under `IsRVTBlendOn()`; `UpdateBlendView` returns early when off; writers only added when on. Logs
   confirm the off state: `UR_BLEND build: floor blend off (0 writer plates), rubble off (0 pieces ...)`. The only always-on
   change is `r.VirtualTextures=True` in `DefaultEngine.ini`. Simulation access is read-only (`SyncFromSim(const FURSimGame&)`
   gains only writer clearing on layer rebuild; placement uses `KitHash`, no RNG); `UnderreignSim` unchanged.
3. **Visual - PASS with notes.** Corridor sheet: before a near-black seam where floor meets rock, after the lowest band of
   rock takes a dark red floor tint - real but subtle, as claimed. Game camera sheet (`l2_game_camera_before_after`):
   difference barely visible (a slight red tint along some wall feet), as claimed. No smears, stretching or RVT blur seen
   in any view. Rubble corner sheets: without blend the scree heap is a hard-edged rock disc on the floor; with blend the
   mound takes the floor colour and the stones read as rock. The mound outline stays clearly visible (corner 1 a reddish
   disc, corner 2 a hard wedge edge) - disclosed by the Worker as open point 3. Blender sheet shows five plausible own
   pieces (stone, clump, scree heap, slab). Torches are on in the captures.
4. **Numbers - PASS.** Logged: before (VT on, blend off) GPU 6.48 ms, texture memory 1021.3 MB; after GPU 6.58 ms,
   1145.3 MB, VT pools DXT1/DXT5 62.3 MB + G16 58.6 MB, 79 tiles allocated (~7.9 MB) in the colour pool; rubble without
   blend GPU 6.52 ms. 150 frames, 30 fps cap, quality 2, VSync, offscreen. `test_sim.log`: 8 x `Result={Success}`, exit 0;
   all nine golden hashes in the result appear in the log; sync guard 0 changed. `UR_BLEND RESULT PASS`,
   `UR_WALL RESULT PASS (0 failed)` in all three captures.
5. **Method deviation - PASS.** Invisible 1 cm writer plates instead of the floors writing to the RVT are disclosed in the
   result and README with the reason (translucent per-cell floors that end at the cell edge while the wall relief lies
   5-33 cm behind it; RVT would be empty under the wall foot). Unused object-bounds falloff also disclosed (open point 5).

## Findings

- INFO: `kit_close_wall_foot.png` (before and after) frames the top of a rock mass; no floor-wall junction is visible and
  the two images are practically identical. The wall-foot claim is supported by the corridor sheets, not by this still.
  Reframe if the test is repeated.
- INFO: Rubble-without-blend GPU in the result table is 6.51 ms; the archived log shows 6.52 ms. The "VT off" baseline
  (6.47/6.46 ms) and the multiple runs per configuration are not in the archived logs (only one log per configuration).
  Differences are within the stated +-0.1 ms noise; no effect on the conclusion.
- INFO: `ArtSource/Rubble/blend/rubble.blend1` (Blender backup) is untracked inside the order's path; drop it or ignore it
  before any commit.
- INFO: The scree mound outline remains a visible hard edge with blend on; the claim "heap sits in the ground" holds only
  partly. Disclosed (open point 3); relevant only if rubble is adopted.
- INFO: Visual gain at the game camera is marginal with the flat greybox floor; the Worker's recommendation (keep the
  technique, test again with real ground textures) matches what the images show.

Verdict: PASS
