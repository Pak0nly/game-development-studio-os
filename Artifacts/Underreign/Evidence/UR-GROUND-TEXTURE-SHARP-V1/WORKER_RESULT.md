# Worker result UR-GROUND-TEXTURE-SHARP-V1: sharpness of the scanned rock (levers 1 to 4, Blender test)

Project Underreign (DEC-043), Worker of the Claude-directed order, Production mode, Standard class. Not committed, not pushed.
Gate: `verify-worker` printed `PASS worker receipt 28e41acf819282ec1146f83b743bc80b2091e566e46057e2a4107b7356fa6028` before any
change. The first run against the old manifest stopped with `E_REPOSITORY_HEAD`, before anything was changed. The Director then
regenerated the manifest and receipt.
Blender 5.2.3 only: background mode, below-normal priority, no window, CPU with 20 threads, launched by `run_blender.py`
(subprocess, not the Windows shell). Unreal was not started, `Game/` was not touched, and no network was used.
External repository `C:/GameDev/Underreign` (main, HEAD d732498). Paths are relative to it unless absolute.

## Summary

I tested the five chosen variants (Soil A, Stone A, Basalt A, Gold vein A, Bedrock C) in three states. Each state was rendered
under two lights, from the game camera (pitch 70 deg, horizontal FOV 65 deg, 17 m) and at the 3 m close view. That is 60 tiles:
50 new renders plus the old test's 10 neutral-light renders, which I reused as "vorher, neutral". I looked at every render and
every sheet before this report.

- **The old test was soft because it used no normal maps.** It only had a Bump node from the 2K height map. The scans' own 4K
  normal maps bring back the edges, cracks and fine layering. This is the biggest gain for the least cost.
- **Real displacement** turns cracks and ledges into true geometry with their own shadows, which is clearly visible under side
  light. From the game camera the difference is small, because at 17 m most of the extra sharpness comes from the normal map.
- **The torch light** shows the relief far better than the soft neutral light. The neutral light was half the reason the walls
  looked "ground smooth".
- **The cut cap** is now lighter and tinted to each stratum, but still clearly darker than the floor. In the gold stratum the
  gold veins run across the cap.

## What each lever does (by eye)

| Lever | Visual effect | Settings used |
|---|---|---|
| 1 Normal map | Sharp crack edges, layer lines, small ledges and chips. Bedrock loses its smeared look (an open point of the last test). Stone shows its layering. Basalt was already the sharpest and gains a little. Soil gains the least: humus has hardly any edges. | The scan's own 4K normal map at full strength 1.0 on the walls and 0.6 on the floor (at 0.9 the floor looked like crumpled paper under the torch). All six scans are OpenGL. I checked this by correlating the green channel with the height slope (+0.69 to +0.80, red channel +0.72 to +0.84), so no green flip was needed. By eye, cracks read as cracks. Triplanar with a whiteout/UDN blend: each axis's tangent offset is swizzled onto its own world axes, weighted with the same weights as the colour, added to the surface normal and normalised. No lighting seams are visible at the blend zones. On the floor's rotated patches the offset is turned back with the patch angle. |
| 2 Cavity + AO | Joints and cracks become darker and slightly duller, so the rock reads deeper. Side effect: the whole wall is about 10-15 % darker (most visible on basalt and bedrock). | Base colour x mix(1, AO, 0.6) x mix(1, cavity, 0.6). Roughness + 0.25 x (1 - that product). The maps are the scans' own 4K AO and cavity maps. |
| 3 Torch light | Side light from wall height makes every ledge cast a shadow, and the relief becomes clearly readable. The cut caps lie above the torches, so under this light they get only the ambient and read almost black. | Point lights 180 W, colour (1, 0.56, 0.24) like the game's torches, radius 0.08 m, 2.2 m high, 0.35 m in front of the wall, at least 5.6 m apart (about every 3 cells, 8 torches). Ambient: grey world at 0.3. Small glowing flame dots mark the torch positions. Fireflies are clamped (indirect clamp 10). |
| 4 Displacement | Ledges, cracks and holes become real geometry: harder silhouettes at the wall tops and true self-shadowing. Basalt columns and bedrock become clearly more plastic. Soil turns crumbly. The walls do not swell into the corridors. | Cycles true displacement with adaptive subdivision (Catmull-Clark, 1 px dicing for the game camera, 1.5 px for the close view). Height = the same triplanar/bombed height map. Scale = the scan's real height range (library metadata: 0.038 m soil, 0.091 m stone, 0.093 m basalt, 0.14 m gold, 0.127 m bedrock) x 1.8, with mid level 0.8, so mostly inward. Outward at most 0.2 x range x 1.8 (about 3-5 cm). Faded out within 0.3 m of the floor and the top 0.25 m under the cut cap, along the undisplaced vertex normal. |

## Problems found and fixed on the way (all seen in the renders)

- **Floor:** the first floor was invisible (NaN) because the base-normal attribute was missing there. The floor now uses the
  surface normal directly.
- **Facets:** with "Simple" subdivision the kit's flat-shaded triangles showed as faceted shards after displacement. Catmull-Clark
  removed them.
- **Cap corners:** Catmull-Clark opened star-shaped holes at the cap corners. The block tops are no longer subdivided, and all
  cut-cap edges are fully creased.
- **Roots:** displacement turned the soil's roots (inner-break slot, same mesh) into segmented worms. That slot now keeps the
  undisplaced material.
- **Gold nuggets:** subdivision rounded the gold ore inserts into eggs. Their edges are now fully creased, so they stay faceted.
- **Gold cap veins:** the first gold cap veins were a dense whitish crackle pattern. They are now thinner and more broken up, with
  almost no halo.
- **Gold cap brightness:** the gold cap was hardly darker than the gold floor. Its gain is now 1.1 instead of 1.4.
- **Projection on displaced slopes:** the triplanar weights use the undisplaced normal (point attribute `UR_N0`, written before
  subdivision), so the projection does not jump on displaced slopes. No stretching is visible.
- **Torch strength:** the torch was first too hot (350 W, 0.06 ambient). It is now 180 W with 0.3 ambient.

## Cut cap (lever 6)

The kit cap's own slate texture and knife-line ring are kept. Its violet-grey colour is replaced by its brightness x 1.4 (gold
1.1) x the stratum tint. The tint is the variant wall's mean colour normalised to grey, to the power 1.3. Result:

- Soil and gold are warm brown.
- Stone is warm grey.
- Basalt is neutral grey.
- Bedrock is grey-brown.

All caps are lighter than the old slate and still clearly darker than the floor. In the gold stratum the gold veins (the same
procedural veins as on the walls, width x 1.3) run visibly across the cap, so a gold deposit can be read from above. Under torch
light the caps are almost black, because the torches sit below the cut. Judge the cap under the neutral light.

## Displacement cost (relevant for Unreal later)

Measured in the test section (14 x 12 cells, 2 m): 257 wall objects with 452k to 473k kit triangles today. The wall material area
is 654 to 759 m² per stratum. Render time per image rose by about 20-30 % (game camera 38-46 s to 47-54 s; close view 49-64 s to
60-78 s, 48 samples, CPU).

These are estimates, not measurements. Cycles dices adaptively and does not report a count. They use a visible wall face per wall
cell of about 2 m x 3 m, with relief about 8 m², and triangles about 2 x area / edge²:

| Edge length | Triangles per wall cell | Whole test section (about 700 m²) |
|---|---|---|
| 4 cm | about 10k | about 0.9 M |
| 2 cm | about 40k | about 3.5 M |
| 1 cm | about 170k | about 14 M |
| render, game camera (1 px ≈ 1.4 cm) | about 80k near the target | |

The scans' height maps are smooth: their features are about 2-5 cm and the fine detail is in the normal map. So about 2 cm edges
(about 40k triangles per wall cell, about 10x today's kit faces) would capture what displacement adds. In Unreal that only makes
sense with Nanite (Nanite tessellation/displacement, or baked high-density Nanite kit pieces). With classic meshes it is too
expensive.

## Images (all looked at; outside Git)

Root: `C:/GameDev/Underreign_Assets/AnimWork/UR-GROUND-TEXTURE-SHARP-V1/`

**Sheets** (`sheets/`, tiles 1600 x 900, German labels):

- `sheet_Soil.jpg`, `sheet_Stone.jpg`, `sheet_Basalt.jpg`, `sheet_Gold.jpg`, `sheet_Bedrock.jpg`: columns vorher | 1+2 | 1+2+4.
  The rows are neutral light at the game camera, torch light at the game camera, neutral light close up and torch light close up.
- `sheet_overview_torch.jpg` and `sheet_overview_torch_close.jpg`: all five strata in 1+2+4 under torch light, plus "Stein A
  vorher" for comparison.
- `sheet_cap.jpg`: cut cap old vs new for all five strata (game camera crop, neutral light).

**Single renders:** `renders/<Stratum>_<vorher|n12|n124>_<neutral|torch>_<game|close>.png` (1600 x 900). "vorher, neutral" is
the old test's `UR-GROUND-TEXTURE-TEST-V1/renders/<Stratum>_<Variant>_<shot>.png`.

**Textures:** byte copies of the library's 4K maps under `tex/` (licensed, outside Git).

## Recommendation for the in-game order

1. **Lever 1, always:** the scan's own 4K normal map at full strength on the walls (about 0.6 on the floor), with a correct
   per-axis triplanar normal blend. It brings most of the sharpness at no geometry cost. Unreal expects DirectX normals, so flip
   green on import (the scans are OpenGL).
2. **Lever 2, yes, moderately:** AO and cavity at about 0.5-0.6. Raise the albedo gain by about 10 % to make up for the darkening.
3. **Lever 3, decisive for the impression:** judge and tune walls under the game's real torch light, not under a soft overall
   light. Low ambient, side light from the wall torches. Make sure the caps keep enough ambient or top light to stay readable.
4. **Lever 4, only with Nanite and as a later step:** the gain is clearly visible up close and small from the game camera.
   Recommendation: first 1+2+3 in-game. Test displacement separately as a Nanite tessellation proof (about 2 cm, scale about 1.5-2
   x the scan's height range, mostly inward, faded out at the floor and under the cap).
5. **Cut cap:** take the new lighter, stratum-tinted cap with gold veins in the gold stratum (brightness x 1.4, gold x 1.1).

## Open points

- Under the torch test light the caps read almost black. The game's real light needs to keep them readable.
- The gold ore inserts (kit) stand out from the wall as separate nuggets, as in the old test. That is not from this order.
- The soil wall gains the least: humus has hardly any edges.

## Files

**Written:**

- `ArtSource/GroundTextureTest/scripts/sharp_prep.py` (4K copies and the normal-convention check)
- `sharp_scene.py` (the scene: loads the old `scene.py` read-only without running it)
- `sharp_sheets.py`
- `sharp_run_all.py` (batch runner)
- this file

**Outside Git:** renders, sheets and 4K texture copies under the AnimWork folder above. No frame folders were made. The test
renders (`*_t*.png`) were deleted. No licensed texture is in the repository. Nothing was committed or pushed.
