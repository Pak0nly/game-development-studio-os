# UR-UNREAL-WALLSAMPLE-V1 Worker result (Studio copy)

verify-worker: `PASS worker receipt 6726861daf6bb78644253b57f8e344254a6f2482d9834c0fd1ab1368d30b4b73`

External evidence: `C:/GameDev/Underreign/Evidence/UR-UNREAL-WALLSAMPLE-V1/` (WORKER_RESULT.md, logs/). Captures: `C:/GameDev/Underreign/Game/Captures/wallsample/`. Nothing committed or pushed.

---

# UR-UNREAL-WALLSAMPLE-V1 Worker result (wall sample in the game: 2 m cells, rock kit, free camera, see-through)

Gate: `verify-worker` printed `PASS worker receipt 6726861daf6bb78644253b57f8e344254a6f2482d9834c0fd1ab1368d30b4b73` before any change.
Nothing committed or pushed. No network, no AI services. Every Unreal run: headless (`-nullrhi`) or offscreen
(`-RenderOffscreen`), started directly (CreateProcess, no shell, no window) at below-normal priority, one editor process at a
time (checked before each start), captures fixed 1/30 s step capped at 30 fps with gentle quality (`URGENTLE=1`, sg 2), the
start check with the gentle bat's own arguments (30 fps, medium, no ray tracing, 75 %). No benchmark mode, no path tracing,
no sound. Shader compile workers limited by the project setting (75 % of cores kept free).

All tasks 1-9 were delivered (scope fitted).

## What was built (per task)

1. **2 m greybox switch (2M-01):** `AURGreyboxMap` defaults cell 200, wall 400, slab 175, floor 25, cut ratio 0.75 (+ new
   `LowWallHeight` 150); `LayerPitch()`, `CutHeight()`, `RefCm()`; overrides `-URCellCm= -URWallCm= -URCutRatio= -URSlabCm=
   -URFloorCm= -URLowWallCm=`; stair, frame bars, lava drop, gold pile, trap bars, Call-stone follow the cell. Geometry line:
   `UR_MAP geometry: cell 200, wall 400, cut 300, slab 175, floor 25, pitch 600 cm; floor tops 1200 / 600 / 0 cm; rock environment kit, walls full (rock tops at 400 cm), 4799 kit pieces, 0 missing kit meshes`.
   Stair `20 steps over 600 cm (30.0 cm per step)`. Greybox at 2 m (`-URKit=0`): 52 components, 13,319 instances (13,303 + 16
   because the two stairs now have 20 instead of 16 steps, plus their faint copies). 1 m override (`-URCellCm=100 -URWallCm=300
   -URSlabCm=190 -URFloorCm=10 -URKit=0`, old camera `-URPitch=-58 -URFOV=45 -URCamCells=32`): 52 components, **13,303
   instances**, 16 steps, floor tops 1000 / 500 / 0; the still `grey_1m_override_play_view_layer2.png` frames exactly like the
   old `Game/Captures/play_view_layer2.png` (not pixel-identical: the HUD and the drawn room hints changed since then).
   Hound scale 0.55 -> **0.75** (`-URHoundScale=` kept); agent spread 0.18 cell, hover pick radius 0.6 cell. The level stores no
   geometry override (the log prints the new values).
2. **Kit import:** `Game/Scripts/setup_kit.py` + `setup_kit.sh` (headless, repeatable: deletes and rebuilds
   `/Game/Environment/Kit` and `/Game/Environment/Scans`, about 11 min; `UR_KIT_MATERIALS_ONLY=1` rebuilds only materials in
   about 1 min). Axis test PASS (arrows 100 cm, X +X, Y -> -Y, Z +Z). 440 `_HI` meshes (WallFace, WallOuter, WallInner,
   WallEnd, WallPillar, BlockTop + Open1/2c/2o/3/4; Full and Low; Soil, Stone, Basalt, Gold, Bedrock; 4 variants), Nanite on,
   no collision, no lightmap UVs; checks: faces 200 cm wide and facing +Y (y -42..4 cm), heights (Full z -15..400, Low
   -15..150), block tops 200 x 200: `UR_KIT RESULT PASS`. Material `M_UR_KitRock` (world-aligned triplanar, used with Nanite and
   ISM): the style sample's dark charred scanned rock (Volcanic Stone Wall, the MI_V4_RockWall set) imported straight from the
   read-only library at 2048 px, never streamed, into `/Game/Environment/Scans` (git-ignored by the new
   `Game/Underreign/.gitignore`); grading to charred albedo, low saturation, contrast 1.2-1.45, soot from vertex colour R, the cut
   cap darker with the knife line from vertex alpha; instances per stratum and slot (rock, cap, break, ore). Stand-in textures
   of the kit as fallback without the library. Kit content 54 MB (uncommitted), scans 75 MB (ignored).
3. **Placement from neighbour masks (`-URKit`, default on):** `AURGreyboxMap::AddKitLayer` after `build_proof_scene.py` on all
   three layers (faces per rock/open edge, outer corners, inner corners incl. the diagonal case, block-top class and yaw per
   rock cell, strata per rock cell, out of bounds = rock, lava = a glowing pool between walls); Unreal yaw = - Blender yaw.
   4,799 pieces at tick 0, 4,825 at tick 10700, 0 missing meshes. Digging rebuilds the changed layer (14 layer rebuilds while
   the replay ran, mean 2.1 ms, max 9.3 ms on the game thread; greybox 0.5 ms). Floors, rooms, Heart etc. stay greybox; the
   side view stays greybox. Faint layer below uses the kit pieces with the faint colour.
4. **Camera:** free continuous yaw (Q/E held 120 deg/s, Shift x2; Alt + middle mouse drag; plain middle drag still pans);
   pitch -70, horizontal FOV 65 (Unreal FOV is horizontal, as the study), default 8.5 cells (1700 cm), zoom 3-22.5 cells (600-4500
   cm), side 120 cells; overview frames the whole map (12,582 cm for Cinder Hollow, own far limit). Side view snaps to the
   nearest quadrant and returns to the free yaw. `-URPitch= -URFOV= -URCamCells=`. Keys noted in SPIELANLEITUNG (German) and
   README; F1 help updated.
5. **See-through:** unit bodies write custom depth + stencil (1 own cinderlings/creatures/hound, 2 intruders;
   `r.CustomDepth=3`); post-process `M_UR_SeeThrough` draws hidden parts as a 35 % fill plus a bright outline in the side's
   colour (orange / blue); visible units unchanged; `-URSeeThrough=0` off.
6. **Wall-height option:** key V, HUD button "V Low walls", `-URWallLow=1`; per-view rule `UseLowWalls(option, EURViewKind)`
   (Overview only; Side, Close, FirstPerson always full). Automation test `Underreign.Game.WallRules` (rule per view kind + the
   16-mask block-class table) PASS; in-game `UR_WALL_TEST` 5/5 PASS (FirstPerson and Close forced full with the option on).
   Full rebuild on toggle 3.3-4.6 ms (first toggle 405 ms incl. loading the Low meshes).
7. **Proof:** see numbers below.
8. README (2 m geometry, kit, option, camera and see-through section, proof run, known limits) and SPIELANLEITUNG (German)
   updated; both bats unchanged in arguments (kit is the default, frame caps kept), one comment line each; no new starter.
9. This file, logs in `logs/`, temporary frame folders deleted.

## Numbers

- Build: `build.sh` exit 0, 0 warnings (`logs/build.log`).
- Automation (`test_sim.sh Underreign`, exit 0): WallRules, CommandPath, GoldenReplays, LinkPrecheck, LinkReach, PlayerOrders
  (103 checks), SyncManifestGuard, TypeInfo all Success (`logs/test_all.log`). Golden hashes unchanged: reasonable_seed1_won
  1e90d79f1f144be0, reasonable_seed12_lost c93dd97e0daee4d5, banner_seed4_won 89acda19d5372052, idle_seed1_lost
  cd052f1d3209fb89, doors_seed1_won 1d60929da14c21e4, newintruders_seed1_won 9a34e0e7c76a16ee, crownkiln_seed1_lost
  eafd44ab1599bde1, ashthread_seed1_won f6b2c1561b91778b, inkdrip_seed3_won 98ec80e889ebfd11.
- `sync_sim.py check`: PASS (362 files of commit 46653a60141f, 0 problems). Parity checks of the warped replay PASS up to tick 10800.
- Input test: `UR_INPUT_TEST RESULT PASS (0 of 14 keys failed)` (turn checks adapted: E held turns right, Q held turns back).
- Tool test: 28 of 29; the failing step "a trap part without a Forge is refused" fails **identically at HEAD without my
  changes** (`logs/capture_tooltest_baseline_HEAD.log`; since rules 25 the build menu's pre-check refuses locally, so the check
  for a rules answer NoForge does not hold). Not changed by this order.
- Gentle start (gentle bat arguments + offscreen startcheck): `RESULT PASS (0 failed)`, 30.0 fps, GPU 2.19 ms.
- Frame times, Layer 2 default view, game running 1x, 1920x1080, sg 2, 30 fps capped (150 frames):
  **kit GPU 4.93 ms, game thread 2.37 ms, render thread 5.29 ms; greybox GPU 4.45 ms, game 2.28 ms, render 5.31 ms**
  (greybox GPU varied 3.6-4.5 ms between runs). During the 360 turn (kit): GPU 5.34 ms.

## Captures (all looked at)

`C:/GameDev/Underreign/Game/Captures/wallsample/`: `kit_l2_full.png`, `kit_l2_low.png`, `grey_l2_full.png`, `grey_l2_low.png`
(same camera), `UR_WallSample_Sheet_kit_grey_full_low.png` (2x2, German labels), `kit_l2_overview.png`, `grey_l2_overview.png`,
`kit_close_corridor.png` (cinderling, 1.6 m hound, Oath-warden, 1.8 m figure, full walls, pitch -45 for this still),
`grey_close_corridor.png`, `kit_l2_full_after.png` / `grey_l2_full_after.png` (same view after the run), `gentle_start_running.png`,
`grey_1m_override_play_view_layer2.png`, film `UR_WallSample_Turn360_6s.mp4` (1920x1080, 30 fps, 6 s, no audio) and `.gif`
(720 px, 12 fps, 10.8 MB), `UR_WallSample_Turn360_frames_0_30_60_90_120_150.jpg`.

## Honest findings / open points

- **Dark scene:** with full 4 m walls and the dim existing light the corridors are dark; east-west corridors are mostly hidden
  at pitch 70 (as the camera study predicted); the units in them show as outlines. Low walls (option) show the corridors well.
- **Low walls:** small knife-line loops where cap strips cross at outer corners (visible in `kit_l2_low.png`), and stair-stepped
  shadow edges on the floor at gentle quality. Flicker was not measured frame by frame (the film is full height; six film
  frames inspected, no gaps seen).
- The faint layer below shows the kit block tops through the translucent floor as a per-cell pattern.
- See-through: also outlines units hidden inside the Heart block; the tonemapper turns the orange toward yellow-orange.
  The first version broke the whole image at 75 % screen percentage and in some greybox views; fixed (lookups at buffer UVs,
  blendable before depth of field), re-verified at 100 % and 75 %.
- Not done (outside the reduced scope): kit floors, cut-height caps, damage, fracture, mirrored faces (4 variants only),
  WallEnd/WallPillar imported but placement uses faces + corners like the reference; other proof modes keep 1 m camera literals.
- `GetKitPieces` in the PERF line also counts incremental rebuilds (cosmetic).
- The capture stills and film show the licensed scanned rock (DEC-025): local only; whether they may be committed is the
  Director's call. I viewed them locally as the order required.
- First capture attempts lacked `-URTuning=golden.tuning.txt` (parity FAIL, an argument error, not code); all reported runs use it.

## Changed files (external repo, uncommitted)

`Game/Underreign/Source/Underreign/Private/{URGreyboxMap,URLayerCameraPawn,URPlayView,URPlayerController,URHUD,URCaptureDirector}.cpp`,
`Private/URWallRulesTest.cpp` (new), `Public/{URGreyboxMap,URLayerCameraPawn,URPlayView,URPlayerController,URCaptureDirector}.h`,
`Game/Underreign/Config/DefaultEngine.ini` (r.CustomDepth=3), `Game/Underreign/Content/Greybox/M_UR_Greybox.uasset` (used with
Nanite), `Game/Underreign/Content/Environment/Kit/**` (new, 54 MB), `Game/Underreign/Content/Environment/Scans/**` (ignored),
`Game/Underreign/.gitignore` (new), `Game/Scripts/setup_kit.py`, `setup_kit.sh` (new), `Game/Scripts/capture.sh`,
`Game/README.md`, `Game/SPIELANLEITUNG.md`, both `Play Underreign*.bat` (comment line), `Game/Captures/wallsample/**` (new),
`Evidence/UR-UNREAL-WALLSAMPLE-V1/**`.
Work tools: `C:/GameDev/Underreign_Assets/AnimWork/UR-UNREAL-WALLSAMPLE-V1/tools/` (launcher, capture wrapper, encoder).

