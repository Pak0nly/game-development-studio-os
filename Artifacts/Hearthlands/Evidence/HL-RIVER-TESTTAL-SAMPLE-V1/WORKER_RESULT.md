# WORKER_RESULT: HL-RIVER-TESTTAL-SAMPLE-V1-R1

Status: **round finished, Human checkpoint.** Discovery mode, one sample. Self-directed iterations used: 3 of 3 (runs 3, 5, 6). Operational recoveries used: 1 of 3 (run 4: compile error CS0136 in `RtBanks.Grid`, a shadowed parameter name; renamed, run 5 passed).

- verify-worker: `PASS worker receipt 52e5c7334d0e416a4ec13669336f6306ec1ff05f7262ea17cf0a608ca7d0be3f`, exit 0.
- Game folder `C:/GameDev/Hearthlands`, branch `main`, start HEAD `a3c4b16`. Local commits (no push): `cc49f5a` (step 1), `b0adee5` (step 2), `fc9b724` (steps 3 and 4). Only `Unity/Assets/_Project/LookTest/RiverTesttal(.meta)` was committed; the unrelated uncommitted changes in the folder were neither committed nor reverted; no other file was changed by the runs.
- Unity launches (all hidden batch-mode editors on `C:\GameDev\Hearthlands\Unity`, method `Hearthlands.LookTest.RiverTesttal.RtBuild.PlayBatch`, all rendered on the AMD RX 6800 XT): runs 1, 2, 3, 5, 6 exit 0; run 4 exit 1 (compile error, nothing rendered). No player build; no process of the Wege folder touched. Logs: `r1/logs/unity-run-*.log` (ignored by the studio `.gitignore`, local only).

## Candidate file list (`git diff --name-only a3c4b16..fc9b724`, sha256, bytes)

- ext:Unity/Assets/_Project/LookTest/RiverTesttal.meta 190e664f4f2e0b2ef6b0209958e76f5c7acca9bf4e4a7f1ba120d588318b9422 172
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Editor.meta 50b8527040098ddc5a2cac1aece7e0288e9b00b0b8263a1084ca379391faf167 172
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Editor/Hearthlands.LookTest.RiverTesttal.Editor.asmdef 7ff4e57ce4064f91609026bbfbe14e3cd0f13920703867bb82d66d561aee2166 670
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Editor/Hearthlands.LookTest.RiverTesttal.Editor.asmdef.meta 525d40d07ce29fe26366ceffadb05de3b2eede0dfabed918f28712f1da17a27a 166
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Editor/RtBuild.cs 537297d3c7d9f6c1c66eadf56f777610aad86c20a5bd6e5d24535f6c7a98e120 5244
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Editor/RtBuild.cs.meta a876c48de71e4f3636d16c73bcea04784e9f66cd0cd19de9729aa45b34d41239 59
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/RiverTesttal_Sample.unity 2e3cb332fece6774bd774ae80c08305366edad6b7e3301f93ebf20b3b6f3dd49 4873
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/RiverTesttal_Sample.unity.meta 929a44804ef35a82e303dfc09ae8fceb0d55b07149d6003585c6cc3a4ccee597 155
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime.meta f69e0f4f07636a4e395a4348241ed77aff9c86ba9ce733e70b0466e08facb89c 172
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/Hearthlands.LookTest.RiverTesttal.asmdef d0fa33afd1bb04a35e51392ea5d1b7a47cd698872a809d549ea1baebb6954880 609
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/Hearthlands.LookTest.RiverTesttal.asmdef.meta 6d64097151f905823a9428c2bb387fed072d08724dd58ae4bf91424047a92348 166
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtBanks.cs 11e5bcd9d7a2f8922e2610fa9e508e1435fc8c226a5abb88bc4b4eefa8f787e2 23962
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtBanks.cs.meta ad60a46fdb5041a0350971a4dd9e585413aba00ff42837f46f01c13589a78c62 59
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtCourse.cs 71408cde4f32fac0f560a1d47961e2ccf82f05e1136aa7b4bb597853cadff713 6444
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtCourse.cs.meta 9572bde6d89f6c6013ef8a9ca130d276215a4d04b6f213e208f81bc53ffaca6e 59
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtFacts.cs 2dd3b08b73e6877571cd39b4a8150cf9effa9df0b89059f43f4a909e4704ac72 9586
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtFacts.cs.meta 558aea94f3b00cfa9a036ae86448f42bec83c56f0b036978bd814a6f928349de 59
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtFish.cs 9fd69cfd07881db0d2ce5b528e0477cfbd971dacbce40e461dde7caa4648d986 5737
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtFish.cs.meta 5184e38b653f8f56455303e6d02ba68710723e9cf559fa33f6482766d1fdca39 59
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtProgram.cs e391f8ec16cc3d8689ad5c8d349825d8dda1b1d1168cea31dc9975959d44f441 4305
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtProgram.cs.meta 7b56fda500f94323720c5e9e4645fb6c90ea2242e79b4f03a5acbd4bb50cac98 59
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtRiver.cs e5cdd83e4af760a9425fd78d03d0418df2cf9cf782c9fbb4a54ea33706496d12 38711
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtRiver.cs.meta 3abe233a33179f3b367693127985a8035270d6d800e6153e51bc9464a13d1349 59
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtSample.cs 3b908bff8d2e49972f4f698727961e75e66fe7b7433304f19fd8dfb645c11433 10569
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtSample.cs.meta ecdbb93d5053726adc2589959ffec6a095f437872cfb45de256293424421bcac 59
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtWater.cs 395a1d7a04df482b7925e8238659952c148fc6abeceb37b140c412106c7d9612 7495
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtWater.cs.meta d0283116ce0b2fd12a4841bfdb68f30861264a34b8bcbaa6d6e76b449a1cee5d 59

## What was built

`LookTest/RiverTesttal/` boots the game itself on Testtal (map files read only) and switches between "Spiel" (the game's own water and falls) and "Probestueck" (the sample river) on the same world and camera:

- `RtWater` + `RtRiver.BuildWater`: one smooth-outline HDRP river surface per water body (0 T-junctions; the game's surfaces have 123 / 323 / 105), the game's own water settings (`WaterView.ApplyDemoRiver`), a current map from the course (`RtCourse`) with blue = 1, bent down at the lips; it ends under the bank ledge and on the lip line.
- Flow: the game's middle reach has no current at all (no source on a map edge, HDRP falls back to east = sideways) and its lower reach flows upstream on 33 of 39 tiles (source = the mouth). The sample flows downstream everywhere (HDRP current arrows `r1/after/vergleich_stroemung_pfeile.jpg`, moving `r1/after/vergleich_flow_*.mp4`). HDRP fact: the current map's blue channel scales the flow ANGLE, so the accepted sample's blue < 1 also bent its flow towards east.
- Main fall (`RtRiver.MainFall`): the port's face rebuilt with the same seed and lines (private `FootLevel`, `TopLevel`, `FrontTy` by reflection), wet recess and curtain half width 0.95 (about 1.9 tiles; port 4.2), rock cheeks, the brook narrowing towards the lip, own narrow backdrop, crests and pool foam; the port's face, fringe, falling water and backdrop are hidden in the sample.
- Small fall (`RtRiver.SmallFall`, drop x 23-26, row 50 -> 51): a strata step across the river with a notch, three curtain strands split by two lip stones, backdrop, crests, mist, spray, pool foam and stones.
- Banks (`RtBanks`): the port's ledge banks along the WHOLE river on a smooth water line (blurred signed distance), beaches by noise and at the ford, grass fringe, gravel, bank stones, reeds, edge plants, and 12 stumps, logs and boulders from the voxel nature catalogue (not on used tiles). The port's own ledge banks and the game's river gravel are hidden in the sample.
- Fish (`RtFish`): 22 fish from the accepted `animal_fish_move` / `animal_fish_idle` models, holding in the current facing upstream, darting, every third one jumps once per 9 to 16 s.
- Drift flecks over the whole water show the flow at the game camera.

## Numbers (run 6, `r1/after/rt_log.txt`)

- Sample river: 1.70 million voxel triangles in total (main fall face 260k, its fringe 247k, ledge banks 149k, bank fringe 382k, pebbles 146k, stones/reeds/plants 460k, small fall 35k), water 34.7k triangles, 58 particle systems, built in 6.8 s on boot.
- Frame times (editor batch mode, 1920x1080 render texture, vsync off; not a player measurement): game camera at distance 30: game 6.85 ms, sample 6.04 ms; at the fall: 6.06 / 5.99 ms. No measurable cost; no merge or LOD step was needed. The fringe and plant pieces are the biggest triangle share and the first place for a LOD if a player measurement shows cost.

## How to move it into the Wege test

- Files: copy `LookTest/RiverTesttal/Runtime/{RtCourse,RtWater,RtRiver,RtBanks,RtFish}.cs` (and the asmdef reference to `Hearthlands.LookTest.RiverCliff` for its particle helper `RcWater`, or copy `RcWater`'s `Flecks`, `Crests`, `FallCurved`, `MistAt`, `SprayAt` into the game). `RtSample`, `RtFacts`, `RtProgram`, `RtBuild` are capture tooling only.
- Entry point: `new RtRiver(host)` then `Build()` once after `PlaytestGame.Boot()` (needs `ArtGround` with `Terrain`, `Water`, `RiverCliff`, `River`, the course from `ArtGround.Terrain.Data`), then `SetActive(true)`; per frame `ApplySun()` and `Tick(time, camera)`. In the game the cleaner way is to replace instead of hide: `WaterView.Surface` gets the course current (blue = 1) and the smooth field, `RiverCliffArt.FallHalfWidth` becomes 0.95 with the cheek cap, `BuildFallsAndRapids` gets the small-fall builder, `RiverArt` gets the banks.
- From the game world it needs: the map's water tiles and levels, the drop edges (and which is the declared waterfall), the art ground's `SurfaceHeight`, the port's design ground, `VoxelNatureCatalog`, `UnitArtCatalog` (fish), the smoke material and the sun (`GameLook.ApplySunTo`), and `TileUsed` so no stump stands on a road or building.

## What still looks wrong (looked at every picture)

- Main fall: the rock cheeks next to the narrow curtain read as tall square grass blocks from above (`vergleich_hauptwasserfall.jpg`, fall_top); the slot looks cut, not grown.
- Small fall: on the east bank a large mossy stone reads as a flat green slab; the game's brown cut strip still shows beside and below the step on the west side; the curtain is still quite straight within each strand.
- Banks: in places a dark gap (shadowed water or low ground) remains between the ledge and the meadow behind it; some ledge stretches end in a square block where a beach begins; on the plateau the hanging grass reads like a hedge.
- A hard black shadow of the game's jumping fishing-spot fish appears on the sample water (on the game water it does not show); the sample fish read a little pale and large at close range.
- The water's ripples are subtle; at the game camera the flow is mostly read from the drifting flecks, not from the water itself.
- Frame times are editor batch-mode numbers, not a player measurement.

Proposal which water: **the sample water** (same HDRP look settings as the game, but no cracks and the right flow). The Human decides.

## Round 2 (HL-RIVER-TESTTAL-SAMPLE-V1-R2)

Status: **round finished, Human checkpoint.** Discovery mode, one sample. Self-directed iterations used: 3 of 3 (runs 1, 2, 3). Operational recoveries used: 0 of 3.

- verify-worker: `PASS worker receipt f1f9a4acc3d7225b6d95ae1b39877dc1863c4c67918515e34a1a55a302757d7a`, exit 0.
- Game folder `C:/GameDev/Hearthlands`, branch `main`, start HEAD `fc9b724`. Local commit (no push): `4618d90`. Only `Unity/Assets/_Project/LookTest/RiverTesttal` was committed; the unrelated uncommitted changes were neither committed nor reverted; `ProjectSettings.asset` hash unchanged by the runs.
- Unity launches: 3 hidden batch-mode editors on `C:\GameDev\Hearthlands\Unity` (`RtBuild.PlayBatch`, `-rtOnly sample_` plus `game_perf` in runs 1 and 3), all rendered on the RX 6800 XT, all exit 0. No player build. No process of the Wege folder touched. Logs `r2/logs/unity-run-1..3.log` (local only).
- The water (`RtCourse`, `RtWater`) is unchanged; the Wege test's copy from `fc9b724` stays valid.

### Candidate file list (`git diff --name-only fc9b724..4618d90`, sha256, bytes)

- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtBanks.cs 556a2bf5029c46346932f37aa9fe729ad5e630429d1e124e37b64aa3353587c6 26352
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtFish.cs 5776d830444853e85f48cde06dfb0d4b2b859971a0e9797562b7e8f113ede424 6297
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtProgram.cs 144111c7b17a7549236ea54436f3b63e68580978aabe3a203f6b29aa3ca08130 5252
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtRiver.cs 2b1608288bfa9ca50f4ff4dd6a351abac0ae3ce2f08d094b7f8703929b17be7a 53532
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtRocks.cs 0ec1cd337218f348774cf98a9727bad91a291f1655409e21c328fdb0d3c2c013 12113
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtRocks.cs.meta c510351220dfd63ba5e3a63506344a5d94fb3826fbc999e0e663b4626f991a9c 59

### What was built

- Main fall top (`RtRiver.Cheeks`, new `RtRocks.RtOutcrop`): round 1's raised turf blocks are gone (the face's top beside the curtain ends at the water). Grown rock cheeks from a height field: each stratum (3-5 voxels) reads the field at its own wandering offset, so the terraces break and step; chipped edges, mossy tops, grass towards the meadow, wet stone at the water. Highest at the lip (about 0.45 above the brook), sinking into the bank over about 4.5 tiles upstream and into the meadow outward. No hanging blade tufts.
- Pool (`RtRiver.PoolLining`): both sides from the cliff to where the ledge banks begin, 22 voxel boulders of different sizes (taller at the cliff, overlapping, no gap to walk through in the picture), lower stones behind, small stones in the water, reeds, and per side a catalogue boulder, log and stump. The earth strips are covered; gravel is allowed in the pool zone.
- Small fall: the step's rock has no dark turf top any more and keeps its mossy rock behind the lip (round 1's flat green slab gone), its side stones stand clear of the ground with little moss; `RtRocks.RtSkin` raises the lower ground around the step to a slope of at most 0.35 per tile from the higher ground (grass voxels), and the banks' gap at the small fall is smaller.
- Banks (`RtBanks`): earth fill behind the ledge until the ground reaches the meadow; the ledge sinks into a beach stratum by stratum over a longer way; hanging blade tufts halved (plateau a quarter).
- Fish: the game's jumping fishing-spot fish draw with a material copy without shadow pass while the sample shows (in-memory swap of the catalogue entry's material, swapped back when the sample hides; nothing saved). Sample fish darker (material copy), scale 0.72 (was 0.9), a little deeper.

### Numbers (run 3, `r2/after/rt_log.txt`)

- Sample river 2.36 million voxel triangles (round 1: 1.70 million): cheeks 34k, pool lining 94k, step blend about 31k, small fall rock 30k, ledge banks 208k (149k), bank fringe 813k (382k; the fill behind the ledges carries turf, so the fringe grew most), pebbles 168k.
- Frame times (editor batch mode, 1920x1080 render texture, not a player measurement): game camera distance 30: game 6.42 ms, sample 6.17 ms; at the fall: game 5.97 ms, sample 5.95 ms. No measurable cost. If a player measurement shows cost, the bank fringe is the first place for a LOD.

### How to move it into the Wege test (updated)

- The water is unchanged: the Wege copy from `fc9b724` (`RtCourse`, `RtWater`) stays as it is.
- For the look of round 2 copy in addition `RtRocks.cs` (new) and the round 2 versions of `RtRiver.cs` (`Cheeks`, `PoolLining`, `StepSkin`, `PrepareJumpFish`/`SwapJumpFish`, the small fall changes), `RtBanks.cs` and `RtFish.cs`. Same entry point as round 1 (`new RtRiver(host)`, `Build()` after `PlaytestGame.Boot()`, `SetActive(true)`, per frame `ApplySun()` and `Tick`). `PoolLining` needs `RtBanks.Build` first (it uses its water line and its `VoxelForest`).
- In the game the cleaner way: the cheeks replace `RiverCliffArt`'s cap rather than sit on a lowered face; the jumping fish's shadow is better switched off in `WorldView.DrawNodeAnimals` (the `Units.Model` call's `shadows` argument) than by a material swap; the pool's "no access" must also be set in the map's walkability (this sample only shows it).

### What still looks wrong (looked at every picture and clip)

- Small fall: at both ends of the step, right beside the curtain, a small brown earth patch remains (the upper bed beside the lip); below the step on the west a brown bank strip of the game remains; the new grass slope beside the step reads as a lighter, finely stepped patch that does not quite match the game's meadow in tone and texture.
- Main fall top: the rock cheeks are fairly smooth and light from above; further out the cliff's own stepped grass terraces (the port's face top) are unchanged and still angular.
- Pool: close up the lining reads as a heap of round boulders; on the east side the chain is rather even.
- Plateau: the grass along the bank edge still reads a little like a hedge close up (the voxel fringe, not the blade tufts).
- The game's circling fishing-spot fish swim partly under the new bank ledge at one spot (bank close-up clip).
- Walkability in the game is not changed; the closed pool is only visual.
- Frame times are editor batch-mode numbers.

## Round 3 (HL-RIVER-TESTTAL-SAMPLE-V1-R3)

Status: **round finished, Human checkpoint.** Discovery mode, one sample. Self-directed iterations used: 3 of 3 (runs 1, 2, 3). Operational recoveries used: 0 of 3.

- verify-worker: `PASS worker receipt 1349c4b317b734246bad60ebbe7bb4c2514a29e2926a5306a508078272227645`, exit 0.
- Game folder `C:/GameDev/Hearthlands`, branch `main`, start HEAD `4618d90`. Local commits (no push): `e11f5d8` (step 1), `d7ea9d0` (steps 2 and 3; run 3 rendered exactly this state). Only `Unity/Assets/_Project/LookTest/RiverTesttal` was committed; the unrelated uncommitted changes were neither committed nor reverted; `ProjectSettings.asset` hash unchanged by the runs.
- Unity launches: 3 hidden batch-mode editors on `C:\GameDev\Hearthlands\Unity` (`RtBuild.PlayBatch`, `-rtOnly` with the new `r3` block, plus `perf` in runs 1 and 3), all rendered on the RX 6800 XT, all exit 0. No player build. No process of the Wege folder touched. Logs `r3/logs/unity-run-1..3.log` (local only).
- `RtCourse`, `RtWater`, the main fall, the pool and the banks away from the small fall are unchanged.

### Candidate file list (`git diff --name-only 4618d90..d7ea9d0`, sha256, bytes)

- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtGround.cs 20b554ed92498117148c052198e693cd9b619ee0aa30f8fe6af79c42e2e91749 16040
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtGround.cs.meta cd57d97a3b35709241d4d95570ad281d556f7d43e80de8e6625b58ea09d0dd2c 59
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtProgram.cs 8ed3c2ec179cf469c2b2cf36b4987e2f998bc00a7d4ccb82d8a41961ce9103c2 6781
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtRiver.cs 68e931d3010f9bbb7a1e0cfb0dcb189db7352ac994d72cc0242c14465b2dc2a0 67252
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtRocks.cs 3fb5f2054675a38062f98b7c5d4da28dc48994a86bcdc8a3b90f34667ea38d42 7810

### Cause of the striped panels

Testtal's ground is the P2 ground: one Unity Terrain (`PaintedGround`, 8 samples per tile, eight painted layers, smooth normals) with the game's grass blades (`LushGrass`) on top. Round 2's `RtSkin` was a separate voxel body over it: a stair of 0.05 steps (the fine stripes), river-palette colours and no grass blades (the lighter panels). It covered the cut instead of changing it.

### What was built

- Ground (`RtGround.cs`, `RtStepGround`; `RtRiver.StepGround`): while the sample shows, the game's own terrain grid around the step is reshaped and repainted through `PaintedGround`'s public height and weight API: raised to a slope of at most 0.3 per tile from the higher ground on land across the valley at the step and on the bare bed beside and below the curtain (never under the sample's water); bare earth, mud and path paint near the step becomes the meadow mix of the clean meadow around it (meadow 0.61, lush 0.21, flowers 0.18), rock paint only on the steepest new slope; the game's grass blades of the 12 touched chunks are rebuilt (private `VoxelTerrain.PaintedLushTexels` by reflection). Saved and written back when the sample hides. 1626 grid points raised (max 0.52), 2763 texels repainted. `RtSkin` is removed.
- Falling water (`RtRiver.SmallFall`, `RicherStrands`): denser strands (2.0, was 1.6) with particle noise that grows from the lip to the foot (strands curve and break up), the outer strands lean outward, white water piles against the two lip stones and thin streams spill over their shoulders; at the foot a boil of white water, a mist over the whole width, spray, foam rafts, and more pool foam.
- Banks in the gap (`RtRiver.GapBanks`): 39 stones (half in the water, lower ones behind, small ones in front) and 15 reed clumps along the real water line on the new ground, about a tile up and down from the step.

### Numbers (run 3, `r3/after/rt_log.txt`)

- Sample river 2.35 million voxel triangles (gap banks 60k; round 2's skin 31k removed), 80 particle systems (round 2: 58), built in 8.1 s.
- Frame times (editor batch mode, 1920x1080 render texture, not a player measurement): game camera distance 30: game 6.35 ms, sample 6.19 ms; at the main fall: game 6.03 ms, sample 5.98 ms. No measurable cost.

### How to move it into the Wege test (updated)

- The water is unchanged: the Wege copy from `fc9b724` (`RtCourse`, `RtWater`) stays as it is.
- For the round 3 look copy in addition `RtGround.cs` (new) and the round 3 `RtRiver.cs` (`StepGround`, `RicherStrands`, `GapBanks`, the small fall changes) and `RtRocks.cs` (now without `RtSkin`). Same entry point as before (`new RtRiver(host)`, `Build()` after `PlaytestGame.Boot()`, `SetActive(true)`, per frame `ApplySun()` and `Tick`). `StepGround` must run after `BuildWater` and before the falls and banks (they stand on the new ground); `SetActive` writes the ground in and out.
- Needs the P2 ground (`VoxelTerrain.Painted`); on another ground style `RtStepGround` does nothing and logs it. It refreshes the grass through the private `PaintedLushTexels` by reflection.
- In the game the cleaner way: the step's ground change belongs in the map (the sculpted heights and paint of the designer's ground file) rather than a runtime edit; then walkability and unit heights follow too. The richer fall belongs in `BuildFallsAndRapids`.

### What still looks wrong (looked at every picture and clip)

- Right (east) end of the step: a thin brown strip remains on the lip line between the curtain and the big rock. Run 3 showed it is not the bare lower bed; its source (most likely the step rock's end or the upper bed's edge) was not found within the three iterations.
- At the foot the white water is now a bright, fairly even band across the whole width; close up the strands partly merge into one white sheet, only the two lip stones split it.
- Foam flecks on the pool still read as small white ovals close up.
- West of the step, low in the close view, a short dark bank wall of the game remains below the new slope.
- Further east along the lower river the bank fringe still stands as a green wall (unchanged, outside this round's scope).
- The ground change is shown at runtime only; the map's walkability and unit heights are not changed.
- Frame times are editor batch-mode numbers.


## Round 4 (HL-RIVER-TESTTAL-SAMPLE-V1-R4)

Status: **round finished, Human checkpoint.** Discovery mode, one sample. Self-directed iterations used: 3 of 3 (runs 1, 2, 3). Operational recoveries used: 0 of 3.

- verify-worker: `PASS worker receipt 48b5fa7f07ae390916abb3761b5b12b6463922187156b0e8239fce7858e3f04f`, exit 0.
- Game folder `C:/GameDev/Hearthlands`, branch `main`, start HEAD `d7ea9d0`. Local commit (no push): `be3db5d` (steps 1-2; run 3 rendered exactly this state). Only `Unity/Assets/_Project/LookTest/RiverTesttal` was committed; the unrelated uncommitted changes were neither committed nor reverted; `ProjectSettings.asset` hash unchanged (`A84D717C...0B08B`); the scene file was not rewritten.
- Unity launches: 3 hidden batch-mode editors on `C:\GameDev\Hearthlands\Unity` (`RtBuild.PlayBatch -rtOnly sample_r4[,perf]`), all rendered on the RX 6800 XT, all exit 0. No player build. No process of the Wege folder touched. Logs `r4/logs/unity-run-1..3.log` (local only).
- Ground (`RtGround`), strands, gap banks, water, main fall and pool unchanged.

### Candidate file list (`git diff --name-only d7ea9d0..be3db5d`, sha256, bytes)

- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtBanks.cs 7d9076e8d223bb31416f77ba7aa81c70a69bade3188dfde71ba8e4a5b055cd98 27360
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtProgram.cs 67bbab23230185eb220b3239712b1d276f7440884b9d15365a9091f31ff4be9b 8539
- ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtRiver.cs 24305bafefbd176a90ca419c19da288df9cb699842101ff063406d6ab2c75a6b 83509

### Faces found and what covers them (run 3, `r4/after/rt_log.txt`; tile coordinates x east, y south; lip middle 25.0,51.0, curtain half width 2.0)

Ground faces (1/16-tile scan of the shown ground for slopes steeper than 1.4 whose top stands above the water of its side; the step under the curtain excluded):

| Face | Centre (tile) | Length | Ground height | Covered by |
|---|---|---|---|---|
| West, grass-streaked wall left of the curtain | 22.06, 51.06 | 2.04 | 8.76-9.66 | 17 stones |
| East, earth wall behind the curtain's right end | 28.48, 51.06 | 3.12 | 8.77-9.55 | 26 stones |
| West low, the game's short dark bank wall | 22.69, 51.71 | 0.89 | 8.70-8.97 | 11 stones |
| West lower, second small bank wall | 21.96, 52.46 | 0.85 | 8.69-8.99 | 9 stones |

One further patch (3 points) was too small to count. Ledge bank cut ends (the ledge banks stop at the tiles of their gap at the step; run 2 found them in the side view as a brown earth wall; only borders where a ledge voxel really stands above the ground in front count):

| End | Border | Ledge top / ground in front | Covered by |
|---|---|---|---|
| Upper, west | y 49.00, x 24.03-24.97, facing downstream | 9.50 / 9.31 | 9 stones |
| Upper, east | y 49.00, x 25.03-25.09 | 9.50 / 9.31 | 5 stones |
| East | x 28.00, y 51.16-51.59, facing west | 9.45 / 9.07 | 5 stones |
| Lower, east | y 53.00, x 25.84-26.09, facing upstream (two tiles) | 8.95-9.05 / 8.82-8.92 | 8 stones |

Lip line beside the curtain (the thin brown strip, east; west for symmetry): u 2.20-2.72 on each side, 6 stones east, 5 west.
Total 101 stones (big boulders at each face's foot reaching 0.06-0.18 above its top, lower stones in front, small stones on top behind, moss 0.55-0.75) and 19 reed clumps; 241k triangles.

### What was built

- `RtRiver.CoverFaces` (called at the end of `SmallFall`): the ground scan, the ledge-end scan, the lip-end rows and one shared `Station` placer; all rocks in one object `Small fall face cover (R4)`. `ShowFaceCover(bool)` hides it (used only by the captures).
- `RtBanks.InGap` and `RtBanks.LedgeTop` (the highest ledge voxel that really stands; the column span alone reached above the water across the river in run 2 and put rocks there).
- `RtProgram` block `r4`: round 3's small-fall cameras (game, close, top, low, night) plus a west and an east side view; every view first with the cover hidden (round 3's look, "r3look_") and then shown, same camera, same run.

### Numbers (run 3)

- Sample river 2.59 million voxel triangles (cover 241k), 80 particle systems, built in 8.9 s.
- Frame times (editor batch mode, 1920x1080 render texture): game camera distance 30: game 6.32 ms, sample 6.20 ms; at the main fall: game 6.03 ms, sample 5.98 ms. No measurable cost.

### Pictures (`r4/after/`, MP4 H.264, round 3 left, round 4 right, 2.4-4.2 MB each)

`r3_r4_kleiner_fall_spielkamera.mp4`, `r3_r4_kleiner_fall_nah.mp4`, `r3_r4_kleiner_fall_flach.mp4`, `r3_r4_kleiner_fall_von_oben.mp4`, `r3_r4_kleiner_fall_westseite.mp4`, `r3_r4_kleiner_fall_ostseite.mp4`, `r3_r4_kleiner_fall_nacht.mp4`; sheets `vergleich_r3_r4_kleiner_fall_1.jpg`, `vergleich_r3_r4_kleiner_fall_2.jpg`; `rt_log.txt`.

### How to move it into the Wege test (updated)

- As round 3, plus the round 4 `RtRiver.cs` (`CoverFaces`, `ShowFaceCover`) and `RtBanks.cs` (`InGap`, `LedgeTop`). `CoverFaces` runs inside `SmallFall`, so after `StepGround` (it scans the reshaped ground) and before `_banks.Build` (it only reads the ledge's voxel function). `RtProgram.cs` is capture-only.
- In the game the cleaner way: the cover stones belong in the map's dressing of the step, placed once by a designer or tool against the final ground, not scanned at runtime.

### What still looks wrong (looked at every sheet and the clips)

- West of the curtain the cover is a dense, tall heap of boulders; it hides every face but reads more like a scree pile than a natural bank.
- Above the step a short row of stones stands partly in the upper water in front of the ledge's cut end.
- Lower right in the pool a flat, wide stone mound covers the lower ledge end; close up it looks large.
- Unchanged from round 3: the even white foam band at the foot, foam flecks as small ovals close up, the green grass wall further downstream.
- Runtime only; walkability and unit heights are not changed. Frame times are editor batch-mode numbers.
