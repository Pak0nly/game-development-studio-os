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
