# UR-CAMERA-STUDY-V1 Worker result (Camera study for 2 m cells)

Status: both orders complete (all renders on the CPU): UR-CAMERA-STUDY-V1 and its extension UR-CAMERA-STUDY-V1-EXT01 (section at the end). Nothing was committed or pushed; nothing in the game was changed.

## Verify-worker lines
- UR-CAMERA-STUDY-V1: `PASS worker receipt 90e3758b145298e6cb0d20a04f95e11b7ca3f1fad3f177f8843a3ef24a538d5c`
- UR-CAMERA-STUDY-V1-GPU-CONTINUATION01: `PASS worker receipt dbd5bb1cd9cd885c3a13f8b764d88607e89aa8e75e85556c1b0af68af2ef1d04`. Used only for one GPU test frame (Cycles HIP on the AMD Radeon RX 6800 XT works in Blender 5.2; scene build plus one 1280x720 frame at 32 samples took 8.4 s in total; the integrated GPU and the CPU were disabled). The Director then withdrew the order; all films were rendered on the CPU.
- UR-CAMERA-STUDY-V1-EXT01: first attempt `E_REPOSITORY_HEAD: HEAD mismatch: ab9aa9035cd9a51f8134ea8632a6c4ed1c10537f` (the Director had committed after issuing it); re-issued, then `PASS worker receipt 316098c42fb4dc132d427a7e0c947a3bd236509ae3113bcf30608ffe975bc12b`. Slip: before the first gate run I had already written the draft scripts camera_study_ext.py and run_ext.py and run a mask-only smoke test (output deleted); after the PASS the drafts were reused unchanged for the EXT01 renders.

## Setup
Blender 5.2.3, Cycles CPU (16 threads, below-normal priority), 64 samples + OpenImageDenoise for stills, 32 samples for the films. Kit scripts used unchanged (helpers of ArtSource/EnvironmentKit/scripts/build_proof_scene.py); own scripts in `ArtSource/EnvironmentKit/scripts/camera_study/`. The kit (written for bpy 5.3) ran on 5.2 without change.
Section: the night proof section (Cinder Hollow layer 2 with the hint corridors). View centre: T-junction of the north-south corridor "main" and the west-east corridor "link" (cell 21,13 = world 43 / -27). Human 1.8 m, hound 1.6 m long (kit stand-in scaled by 1.333). Besides the night pair in "main", a second pair stands in the left-right corridor "link" (human at x 49 facing east, hound at x 53); the visibility measurement uses that pair.
Lights and exposure, identical for all variants (the kit's): dim blue world, one blue-white sun fill (2.2), four braziers (750 W), six warm wall torches at 2.2 m (350 W), exposure +0.55, AgX. The torches stay at 2.2 m also for the 1.5 m walls, so they light those caps (that is why the 1.5 m renders look brighter near the walls). Walls stay readable in all renders; the rock tops at 3 m and 4 m are dark.
Lit rock top: the wall faces' rock texture on the flat cap or block top, colour x1.3 lighter, no emission. Dark top = the kit's dark cut cap. For C, "dark" is a flat dark cap at 4 m; C "lit" is the kit's full-height bumpy rock top.

## Variants (camera: horizontal FOV, pitch down, distance target to camera; yaw 0 = looking north)
| Id | FOV | Pitch | Distance | Cells across at the centre |
|---|---|---|---|---|
| A today | 45 | 58 | 32 m | about 13 |
| B close and wide | 65 | 60 | 17 m | about 11 |
| C = B with 4 m walls | 65 | 60 | 17 m | about 11 |
| D = B steeper (chosen because the measurements show pitch is the lever, not FOV) | 65 | 72 | 17 m | about 11 |

## Visibility of the left-right corridor (mask render, Workbench, 960x540)
Floor visible = visible floor pixels / floor pixels of the same frame with all walls removed. Human and hound likewise (the pair in that corridor). Whole corridor inside the frame: A 100 %, B/C/D 97 %. The top look (dark or lit) does not change geometry, so both give the same numbers.

| Variant | Wall | Floor visible | Human | Hound |
|---|---|---|---|---|
| A | 3 m cut | 0 % | 7 % | 0 % |
| A | 1.5 m cut | 26 % | 89 % | 88 % |
| B | 3 m cut | 0 % | 12 % | 0 % |
| B | 1.5 m cut | 31 % | 92 % | 89 % |
| C | 4 m full | 0 % | 0 % | 0 % |
| D | 3 m cut | 20 % | 86 % | 42 % |
| D | 1.5 m cut | 70 % | 100 % | 100 % |

Sweep over pitch 50-80 x FOV 45/65/80 x wall 1.5/3/4 m (`previews/camera_study/sweep.json`), floor visible: 4 m wall 0 % up to 72 deg and about 47-50 % at 80 deg; 3 m wall 0 % up to 58, about 20 % at 72, 66-75 % at 80; 1.5 m wall 25 % at 58, 46 % at 65, 70 % at 72, 88-94 % at 80. FOV changes almost nothing at the screen centre (it shows more wall toward the screen edges and pushes the corridor partly out of frame at 80 deg).

## Findings (plain)
- The Human is right: with today's camera the left-right corridor is hidden by its own near wall at 3 m (0 %), and at 1.5 m only about a quarter shows. The near wall hides a floor strip of height / tan(pitch): 3 m / tan 58 = 1.9 m of the 2 m corridor. FOV and distance cannot fix that; only a steeper pitch or lower walls can.
- Full 4 m walls hide such a corridor completely at any pitch up to about 72 deg. Corridors running up-down on the screen are always visible (see the stills), so the problem is specific to the corridors across the view, and it moves with every 90 degree turn.
- A lit rock top reads as a landscape of rock blocks instead of a dark void; it changes no visibility.

## Films (30 fps, 4 s, smooth 90 deg turn around the view centre with ease in and out, lit tops, 1280x720, CPU about 6 s per frame)
`previews/camera_study/pan_A_heute_3m.mp4|gif` (A, 3 m), `pan_B_nah_weit_1.5m.mp4|gif` (B, 1.5 m), `pan_C_volle_wand_4m.mp4|gif` (C, 4 m). GIFs are 1024 px wide, 96 colours, 30 fps (41-54 MB each, too large to send; use the MP4s). Frames 0, 40, 80 and 119 of each film were inspected.

## Recommendation (scope of this order; note the Human has since rejected low cut walls, which EXT01 addresses)
Steeper camera: pitch about 70-72 deg, horizontal FOV about 60-65, default distance about 17 m (about 11 cells across), with near-side walls lowered. Within the tested variants, D with 1.5 m walls shows 70 % of the corridor and both units; D with 3 m still hides 80 % of the corridor and over half of the hound. With full 4 m walls no tested camera (up to 72 deg) shows the corridor, so full walls need a cutaway that follows the view direction or an outline for hidden units; that is what EXT01 is meant to test (not done).
Unreal values for D (to be verified in the editor): camera pitch -72 (today -58), horizontal FOV 65 (today 45), default arm length 1700 cm (today 3200 cm), zoom limits about 600 to 4500 cm (today 900 to 9000), yaw free or in 90 deg steps. Check that Unreal's FOV axis is horizontal for 16:9 (the Blender study used horizontal).

## Paths
- Scripts: `C:/GameDev/Underreign/ArtSource/EnvironmentKit/scripts/camera_study/` (camera_study.py, run_study.py, make_sheet.py, assemble_mp4.py, make_gif.py; unused drafts camera_study_ext.py, run_ext.py)
- Previews: `C:/GameDev/Underreign/ArtSource/EnvironmentKit/previews/camera_study/` (still_<camera>_<cut>_<top>.png x14, contact_sheet.png with German labels, visibility.json, sweep.json, 3 films as MP4 and GIF)
- Temporary frame folders and test files under `C:/GameDev/Underreign_Assets/AnimWork/UR-CAMERA-STUDY-V1` were deleted.

## Problems
No ffmpeg binary on the machine: MP4s were made with Blender's own encoder (Blender 5.x needs `image_settings.media_type='VIDEO'`), GIFs with Pillow. Pan A was interrupted once (CPU stop order) and resumed from its finished frames. `still_A_3_lit.png` was overwritten by the GPU test frame once and re-rendered on the CPU afterwards.

---
# EXT01 extension: full 4 m walls, free 360 degree rotation (Human: low cut walls rejected)

## What was built (script: `scripts/camera_study/camera_study_ext.py`, kit unchanged)
All variants: 4 m walls, lit rock tops, same lights and exposure as before, cameras A (today) and D (72 deg).
- E0 = plain full walls (comparison).
- E = cutaway that follows the view direction. For every rock cell, the open cells in its 5x5 neighbourhood are checked: if an open cell lies on the far side of the rock as seen from the camera (angle smoothly blended over 0 to -0.45 of the cosine), the whole rock block (faces, corners, top) is scaled in height from 4 m down to 1.5 m. Rock at the sides of a corridor and on the far side stays 4 m. The change is smooth in the viewing angle (no popping), so it follows a continuous rotation. Note: the lowered strip is up to 2 cells deep because a full-height second row would still hide the floor next to the first.
- F = all walls full; a unit that is at least 15 % hidden gets a glowing outline around its whole silhouette, drawn only over the parts that are not visible (blue-white for humans, orange for the hound), plus a faint fill and glow. This is a compositing stand-in for an in-game outline effect (a Workbench mask pass of unit silhouettes with and without walls, combined with the Cycles frame).
- G = full walls, view yawed 45 deg. E+F = both. Also E+F at 45 deg.

## Visibility of the left-right corridor (same measurement as above; 45 deg views: the corridor runs diagonally, only 71 % (D) or 96 % (A) of it is in frame, and the hound in "link" is out of frame in D at 45 deg, shown as 0 %)
| Variant | Camera | Floor | Human | Hound | Note |
|---|---|---|---|---|---|
| E0 plain 4 m | A | 0 % | 0 % | 0 % | |
| E0 plain 4 m | D | 1 % | 11 % | 1 % | |
| E cutaway | A | 22 % | 85 % | 83 % | |
| E cutaway | D | 65 % | 100 % | 100 % | |
| F outline only | A | 0 % | 0 % | 0 % | both units outlined |
| F outline only | D | 1 % | 11 % | 1 % | both units outlined |
| G 45 deg only | A | 0 % | 0 % | 0 % | |
| G 45 deg only | D | 27 % | 36 % | out of frame | |
| E+F | A | 22 % | 85 % | 83 % | outline only where hidden |
| E+F | D | 65 % | 100 % | 100 % | |
| E+F at 45 deg | A | 46 % | 100 % | 96 % | |
| E+F at 45 deg | D | 85 % | 100 % | out of frame | |
(Numbers are direct visibility; the outline in F and E+F shows hidden units on top of that, so every unit in frame is always located.)

## Films (6 s, 30 fps = 180 frames, 1280x720, camera A, continuous constant-speed 360 deg turn around the view centre, lit tops, CPU about 8 s per frame)
`previews/camera_study/pan360_E_schnitt_folgt.mp4|gif` and `pan360_EF_schnitt_und_umriss.mp4|gif` (GIFs 1024 px, 96 colours, about 56 MB each; use the MP4s). Frames 0, 45, 90, 135 of both were inspected: near-side rock goes low where it would cover a corridor or room and rises again on the far side as the view turns; in E+F the outline appears only while a unit is covered (e.g. frame 0, hound and human in the corridor "link" before the cutaway reaches them; later frames show them directly).
Contact sheet: `previews/camera_study/contact_sheet_ext.png` (German labels). Stills: `still_A_*` / `still_D_*` with suffixes 4_plain, E, F, G, EF, EF45. Data: `visibility_ext.json`.

## Findings and recommendation for walls at full height
- Full walls alone hide a corridor across the view completely (0 %), also from 72 deg (1 %), and also at 45 deg from today's camera (0 %).
- The view-following cutaway (E) fixes that without a permanent low wall: 22 % of the corridor from today's camera and 65 % from the steeper one, with the far walls still full; with the 45 deg view it rises further (46 % A, 85 % D). It reads as the rock "opening" toward the camera, and it works for every rotation angle.
- The outline (F) alone does not show the floor, but never loses a unit; combined with E it covers the remaining cases (a unit behind a far full wall).
- Recommendation: full 4 m walls everywhere (first person later sees over nothing, but the overview does), overview camera like D (pitch about 70-72, horizontal FOV about 60-65, 17 m, zoom about 6 to 45 m) with free 360 deg rotation and the cutaway E (near-side rock drawn at 1.5 m, smoothly blended by view angle, 2 cells deep), plus outlines F for hidden units. Open points for the Human: how deep and how low the cutaway should be (here 2 cells and 1.5 m), and whether the cutaway should only apply to overview zoom levels (suggestion: fade it out when the camera comes close).
- Caveat: the E blend is a height scale of the block, so the texture is squashed on lowered rock; an Unreal version would lower the real meshes or use a vertex shader with the same angle rule.
