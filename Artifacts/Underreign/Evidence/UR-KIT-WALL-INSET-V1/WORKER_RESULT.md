# Worker result UR-KIT-WALL-INSET-V1 - rock wall kit: relief behind the cell edge (full 2 m corridors)

Studio copy of `C:/GameDev/Underreign/Evidence/UR-KIT-WALL-INSET-V1/WORKER_RESULT.md` (images, film and JSON are in that external evidence folder).

verify-worker (Studio root, before any mutation): `PASS worker receipt 7f8ba9f2ebb4cbd0f992f42d35ea7f3c1bf131fd5f8ba4045afbe13851b17e1c`

Project Underreign (DEC-043), Worker of the Claude-directed order, Production mode, Standard class. Not committed, not pushed.
Local Blender 5.2.3 (background, lowered priority, CPU only; the night-4 kit was built with 5.3 in the cloud).
External repository `C:/GameDev/Underreign` (main, base commit fc71613); paths below are relative to it unless marked.

## Summary

The night-4 relief reached 0.03-0.42 m **into** the open cell (the order's statement; measured with the same tool: mean 0.14-0.19 m,
corridor width 1.61-1.72 m mean, 1.21-1.38 m narrowest). Now the same relief (same noise, same depth and range, moved 0.37 m back)
lies **behind the cell edge**: no point of a face is more than 0.05 m into the open cell (measured 0.034-0.040 m; corner pieces,
ends and pillars 0.034-0.050 m; inner corner 0.035-0.046 m), and the mean clear width of a 1-cell corridor is 2.27-2.37 m (target:
at least 1.95 m), never under 1.92 m. Seams and cut caps close; budgets, UVs, materials, LODs, naming scheme and export settings
are unchanged (wall triangle counts are identical to night 4).

## Width table (old night-4 kit -> new kit; all 4 variants and every variant pair, mirrored or not, 0-3 m height, highest detail level)

| Stratum | Max protrusion into the open cell, old -> new (m) | Mean protrusion old -> new (m, negative = behind the edge) | Mean clear width of a 1-cell corridor, old -> new (m) | Narrowest clear width, old -> new (m) |
|---|---|---|---|---|
| Soil | 0.368 -> 0.034 | +0.162 -> -0.160 | 1.677 -> 2.319 | 1.264 -> 1.932 |
| Stone | 0.397 -> 0.040 | +0.185 -> -0.140 | 1.631 -> 2.279 | 1.206 -> 1.920 |
| Basalt | 0.373 -> 0.034 | +0.164 -> -0.159 | 1.672 -> 2.318 | 1.253 -> 1.932 |
| Gold | 0.397 -> 0.034 | +0.194 -> -0.132 | 1.612 -> 2.265 | 1.207 -> 1.932 |
| Bedrock | 0.311 -> 0.034 | +0.139 -> -0.183 | 1.723 -> 2.367 | 1.377 -> 1.932 |

Max / mean protrusion are for the straight face; positive = into the open cell, negative = behind the cell edge. The narrowest new
width (1.92-1.93 m) is where two seam bumps (up to 0.04 m each) meet. Full-height (4 m) pieces give the same numbers (mean width
2.28-2.38 m over 0-3 m).

Other pieces, maximum extent into the open cell (old -> new, m; outer corner / end / pillar: distance outside the 2 x 2 m rock
cell; inner corner: how far the fillet reaches into both corridors at once; damage states Crack1 / Crack2 / Dug of the face):

| Stratum | WallOuter | WallInner | WallEnd | WallPillar | WallFace incl. ore and roots | Crack1 / Crack2 / Dug (face) |
|---|---|---|---|---|---|---|
| Soil | 0.362 -> 0.050 | 0.549 -> 0.043 | 0.391 -> 0.050 | 0.391 -> 0.050 | 0.368 -> 0.034 | 0.367 -> 0.034 / 0.363 -> 0.034 / 0.327 -> 0.034 |
| Stone | 0.458 -> 0.050 | 0.545 -> 0.042 | 0.458 -> 0.050 | 0.461 -> 0.050 | 0.397 -> 0.040 | 0.407 -> 0.037 / 0.404 -> 0.036 / 0.388 -> 0.034 |
| Basalt | 0.276 -> 0.034 | 0.556 -> 0.044 | 0.408 -> 0.038 | 0.412 -> 0.043 | 0.373 -> 0.034 | 0.399 -> 0.034 / 0.382 -> 0.034 / 0.384 -> 0.034 |
| Gold | 0.447 -> 0.050 | 0.575 -> 0.046 | 0.447 -> 0.050 | 0.447 -> 0.050 | 0.398 -> 0.034 | 0.396 -> 0.036 / 0.412 -> 0.042 / 0.388 -> 0.034 |
| Bedrock | 0.293 -> 0.036 | 0.489 -> 0.035 | 0.311 -> 0.036 | 0.311 -> 0.036 | 0.311 -> 0.034 | - |

## What was done

Changed code (`ArtSource/EnvironmentKit/scripts/`):

- `ur_kit.py`: new `face_d()` (relief of a face = the night-4 relief moved back by 0.37 m with the same soft limits, so shape and
  depth are unchanged; hard cap 0.05 m); the shared seam profile `E0` squeezed to 0.0-0.05 m (a quarter of its night-4 range) so a
  seam never lies behind the cell edge and corner, end and pillar pieces close exactly like before; the wall foot is a 0.4 m plinth
  that meets the cell edge at the floor (no gap; the base flare is gone); cut-cap strips follow the ragged top edge of the relief and
  run back to 0.42 m behind the cell edge (the knife line follows the outline); outer corners: the night-4 bulge (up to 0.29 m) is a
  small relief within 0.05 m; inner corners: smaller fillet radius (0.04-0.08 m, was 0.2-0.7 m); ore nuggets and soil roots limited
  to the same 0.05 m; new **trimmed block-top classes** (`block_top(..., mask)`, `BLOCK_MASKS`): the block top of a rock cell is
  trimmed by 0.42 m on every open side, because the face caps now carry that strip (otherwise the plain 2 x 2 m block top would
  cover the recess like a lid and hide the whole relief from the game camera - the first version did exactly that); the strips
  sink 1 mm toward their back line so that coplanar strips of two faces at an outer corner cross in a diagonal (the second version
  showed dark squares there from self-shadowing of coplanar surfaces).
- `build_walls.py`: collision boxes adapted (WallFace y -0.06..0.60, ends/pillars 2.12 m), trimmed block tops
  (`SM_UR_BlockTop_<Stratum>_<Variant>_<Height>_<Open1|Open2c|Open2o|Open3|Open4>_<Level>`, FBX
  `fbx/<Stratum>/SM_UR_BlockTop_<Stratum>_<Height>_<Class>.fbx`, all strata, heights and LODs, UCX boxes, same triangle budgets).
- `build_fracture.py`: front surface of the fracture source volume and nugget/crumb placement use `face_d`.
- `build_floors.py`: `FloorEdge` (the scree strip along the wall foot) lay 0.6 m **into** the open cell and would have narrowed
  every corridor at floor level by up to 1.2 m; it now lies behind the cell edge (WallFace frame y 0..0.6, rises from the floor at the
  edge to the receded wall foot, stones at y 0.17-0.36). Same triangle counts.
- `build_proof_scene.py`, `export_placement.py`: block-top class and yaw per rock cell by its open sides (`block_class`); the
  placement JSON carries `state` = the class. `render_previews.py`: sheets and seam rows use the trimmed block tops.
- New `scripts/inset_study/` (measure, seam check, ray coverage check, stills and pan from the game camera, launcher, MP4/GIF
  assembly). The camera-study scripts are unchanged.
- `Design/Art/ENVIRONMENT_KIT_2M.md` (protrusion rule, measured widths, block-top classes in 1.2 and 2, seams 3.1, collision 9,
  FloorEdge 11) and `ArtSource/EnvironmentKit/README.md` (what changed, rebuild with local Blender 5.2, known limits) updated.

Rebuilt and re-exported with Blender 5.2: all five `blend/UR_Kit_Walls_<Stratum>.blend`, all wall FBX (including the new block-top
class files), `blend/UR_Kit_Fracture.blend` + `fbx/Fracture/*`, `blend/UR_Kit_Floors.blend` + `fbx/Floors/*`, `stats/*.json` and
`stats/SUMMARY.md` (all pieces within budget), `placement/*`, and the previews `previews/walls_*.png`, `previews/floors_sheet.png`,
`previews/proof/proof_{game_cam,game_close,low_angle,low_cut,recommended_look,layer_below_faint,layer1_over_cave_faint}.png`.
Blender 5.2 against 5.3: the unchanged night-4 code reproduced the night-4 triangle counts and corridor widths on 5.2 (mean width
1.61-1.72 m as in the standard), so no difference was found and none had to be worked around.

## Seam and closure checks (`scripts/inset_study/seamcheck.py`, `coverage.py`; JSON in the evidence folder)

- Face seam columns (x = +-1) against the shared profile, 240 face pieces (5 strata x 4 variants x Full/Cut/Low x HI/LOD0/LOD1/LOD2):
  largest gap 2e-6 mm (limit 0.1 mm). Outer-corner end columns against the same profile: 2e-6 mm. Pieces of any level of detail,
  stratum and height meet (the seam no longer depends on the piece height).
- Inner corner (overlap design): its end stands up to 0.18 m in front of the neighbouring face surface at 0.1-0.2 m from the vertex,
  because the face has already receded there (the seam pier; an overlap, not a gap).
- Cut caps on the real map (Cinder Hollow layer 2 section with the bot's first digs, LOD0): 806,400 vertical rays per height
  (5 cm grid), heights Cut 3 m, Low 1.5 m, Full 4 m: **0 rays hit nothing** (the open stair cell has no floor by design and is
  excluded); of 583,161 rock-cell points at least 0.36 m behind every open edge, **0 miss the cut plane**. Cap strips and block tops
  meet at a 1 mm step by design.

## Images and film (evidence folder `Evidence/UR-KIT-WALL-INSET-V1/`, external repository)

Old and new side by side, game camera pitch 72 deg, FOV 65 deg, 17 m (plus a close and an oblique view), proof section Cinder Hollow
layer 2, human 1.8 m and Brand-hound 1.6 m in the corridors, Cycles CPU 64 samples:

- `proof_section_old_vs_new_G15.png` game camera, walls cut at 1.5 m, lit tops (the recommended look); `..._G3.png` cut at 3 m, dark
  caps (today's look); `..._CL15.png` close (8.5 m); `..._OB3.png` oblique (pitch 40 deg). Single images:
  `proof_section_old_*.png`, `proof_section_new_*.png`, `proof_section_new_corner_closeup.png`.
- `seamrow_old_vs_new_{Soil,Stone,Basalt,Gold,Bedrock}.png` the seam rows (six faces in a row, outer and inner corner).
- `pan360_new_proof_section.mp4` (1280 x 720, 120 frames at 30 fps = 4.0 s, one full 360 deg turn with ease, new kit, 1.5 m walls, game
  camera, no sound) and `pan360_new_proof_section.gif` (640 px, 7 MB).
- `measure_old.json`, `measure_new.json`, `seamcheck.json`, `coverage_new_{Cut,Low,Full}.json`.
  The Worker looked at the old and new stills, the seam rows, the corner close-ups and frames 0, 30, 45, 60, 90, 105 of the film.

## Findings, changes of the look and open points

1. **Look.** Same rock, but seen from the game camera the walls are now ragged *inside* the rock cell instead of in the corridor;
   the corridors are visibly wider and the scree strip no longer piles into them. Every cell edge now shows a calm pier 0.44 m wide
   between the receded relief of two faces (a 2 m rhythm along a wall, visible in the seam rows and the oblique still); the outer
   corners have no bulge any more; the inner fillet is small. If the Human dislikes the rhythm, the seam would have to recede as
   well, which makes outer corners and ends need a different closure (tried: leaves slits at the corners).
2. **Mean width 2.27-2.37 m is above 2.0 m on purpose**: "behind the cell edge, nothing more than 0.05 m in front" with the same
   relief depth cannot give exactly 2.0 m on average. Exactly 2.0 m would need the relief to protrude again.
3. **New placement rule.** The trimmed block-top classes change standard 1.2 (the Unreal placement code needs the class and yaw per
   rock cell; `build_proof_scene.block_class` and the `state` field of the placement JSON are the reference). The plain `BlockTop`
   still exists (class `Open0`) for cells without open sides. `unreal/setup_kit_proposal.py` was not touched or tested.
4. `FloorEdge` (floor kit file) was changed although it is not named in the order: it is placed with every face and was the largest
   remaining thing in the corridor at floor level (0.6 m deep piles).
5. Not refreshed (no ffmpeg on this machine, the scripts need it): `previews/fracture_*.{mp4,gif,png}` (rigid-body previews) and
   `previews/proof/proof_pan.*`; the break pieces themselves (blend, FBX, stats) are rebuilt. `proof_greybox_1m*.png` are 1 m boxes
   and unaffected. `placement/*` regenerated (same counts of faces and corners; block tops carry the class).
6. FBX are tracked as LFS pointers; all rebuilt FBX differ in bytes (timestamps, Blender 5.2 against 5.3), including the floor
   files whose geometry is unchanged except FloorEdge. Props were not rebuilt (they do not depend on the walls). Bedrock has no
   damage states (as before).
7. Cap strips of two faces of one rock cell overlap in the corner square (0.42 m x 0.42 m, crossing diagonally at 1 mm); if Unreal
   shows flicker there, trim the strip ends in the placement or build the corner square into `WallOuter`.

## Files

Changed (external): `ArtSource/EnvironmentKit/scripts/{ur_kit,build_walls,build_fracture,build_floors,build_proof_scene,export_placement,render_previews}.py`,
new `ArtSource/EnvironmentKit/scripts/inset_study/*`, `ArtSource/EnvironmentKit/{README.md,blend/*,fbx/*,stats/*,placement/*,previews/*}`,
`Design/Art/ENVIRONMENT_KIT_2M.md`, `Evidence/UR-KIT-WALL-INSET-V1/*`. Work files (frames deleted): `C:/GameDev/Underreign_Assets/AnimWork/UR-KIT-WALL-INSET-V1`.
No other path touched; no commit, no push.
