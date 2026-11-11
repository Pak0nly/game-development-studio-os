# UR-STYLE-SAMPLE-V4 — Worker result

Studio copy of the external `C:/GameDev/Underreign/Evidence/UR-STYLE-SAMPLE-V4/WORKER_RESULT.md` (identical content below).

Work Order: `Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V4/WORK_ORDER.md` (Studio). Worker: separate
Claude Code subagent. Mode: Discovery. Date: 2026-11-11. `verify-worker`: PASS (receipt
`23be0c9d4ec2a40555f5554d396b4cff5482ee21f7ff6ae0f46742993ee4780f`). External HEAD at start: `51fc690`.
Nothing committed or pushed. `StyleSample/Creatures` (parallel order) not touched.

## 1. Re-choice by the rule "black, dark, charred, sooty" (survey sheets + measured albedo)

I looked again at the survey sheets (`Captures/V3/Survey/`) and at the step-2 and step-3 stills and
side-by-sides, and measured the mean linear albedo of every prepared scan (Pillow, local). Rule: every
surface dark; where a scan is lighter, grade it down to a physically plausible charred / dark basalt albedo
(about 0.02-0.035 linear) instead of picking a pale scan.

| Role | Step 4 choice | Reason | Step 3 |
|---|---|---|---|
| Floor slabs (70 %) | **Volcanic Stone Wall** (2cea), graded to ~0.019 | darkest even-grained basalt in the survey (0.036 before grading); no built-in tile grid, so own irregular slab shapes can be cut from it | Black Stone Floor (0.095, light; its 5 x 5 tile grid forced the uniform 1 m slabs) dropped |
| Floor slabs (30 %) | **Icelandic Cracked Rock** (5689), graded to ~0.023, low normal strength | the step-2 floor scan the Human preferred; cracked, dark blue-grey; used on some pieces only so the floor is not uniform | not used |
| Mortar in the joints | **Icelandic Lava Sand** (0acd) | black volcanic ash (0.014): sooty, dirty fill | Wet Stone Ground |
| Packed ash / dirt where slabs are missing | Lava Sand + **Coal Debris** (6d4f) grit | black ash with coal chunks (0.016) | gravel decal (Debris 3253, pale) dropped |
| Boulder frame | **Tundra Icelandic Rock Cluster Volcanic** (b609) + **Volcanic Dolerite Rocks** (cf62, desaturated, sooty) | the cluster is the darkest scan of the library (0.012, looks charred); the dolerite rocks lose their orange rust when desaturated | Granite Rock (mauve) dropped |
| Small rocks by the north wall, corridor | Tundra cluster, Dolerite Rocks | dark | Sharp Rock / Rock Granite (0.11 / 0.10, pale grey) dropped |
| Rubble | Small Stones Pack (376e, charred chunks), Burnt Brick Debris, Dolerite Rocks | dark, burnt | Small Rock / Rock Granite (pale) dropped |
| Wall faces / chasm | Volcanic Dolerite Cliffs (kept), graded 0.5x (75f3 -> ~0.032), desaturated, soot | already the darkest wall meshes; step 3 had lifted them | lighter, wet |
| Rock masses behind | Volcanic Stone Wall, Layered Rock Cliff 859d (0.012, very dark), Mine Rock Wall graded 0.42x | dark | step-2 instances |
| Forge blocks | Burnt Brick Debris faces kept (real block faces), graded 0.28x, heavy soot, low saturation | charred blocks instead of fresh red brick | lighter, red |
| Pillars / posts / anvil block | Volcanic Stone Wall basalt | dark | Volcanic Stone Wall lighter |
| Blood | own thick pool shape + High Velocity Blood Spatter a636 / 84ef as the spray around it, Blood Stain b28b as a smear | the scanned spatters have soft, airy alpha (read as a red haze from the game camera); the pool needs a crisp edge and a flat glossy surface | spatters alone |

## 2. What changed (`/Game/Maps/L_StyleSample_V4`)

- **Floor** (task 2): one set-in surface instead of 270 separate 1 m slabs. Own layout: 183 pieces in
  courses of 1.0-2.0 m with slab lengths 0.9-2.5 m (fewer, larger, all different), some slabs merged across
  courses, 11 missing (packed ash and dirt with a few charred stones in the gap), about 20 % broken into two
  or three pieces that sank differently, chipped edges and corners, hairline cracks; every piece at its own
  depth (0 to -5.5 cm) and tilt, none stands proud. The joints are filled: the fill follows the neighbouring
  slab tops 3-14 mm lower (flush to slightly recessed), sooty black mortar; where slabs are far apart it
  becomes loose ash and coal grit. Joints, sunk slabs and holes are damp, puddles in the lowest dirt; slabs
  have a light damp sheen. One 4096 px height field drives both the mesh and the layout texture, so the
  shading joints sit exactly on the mesh joints. Soot decals spread from the forge over the floor and around
  the anvil.
- **Blood** (task 2): dark, thick, glossy pools with crisp lobed edges and a raised rim, spray around them, a
  smear toward the chasm edge; the blood soaks into the filled joints next to the pools. The pools were moved
  ~1 m closer to a brazier so the fire light catches them (in the dark far half they disappeared).
- **Lava** (task 3): braided, meandering streams (step 3: one nearly straight river) and two pools; the crust
  is drawn as plates stretched along the flow, warped and partly fused so the seam network is irregular and
  opens up mainly near the streams; small plates drift in the orange melt of the streams, streaks in the melt
  move faster than the crust; the core stays orange (white limited), river emission lowered.
- **Light** (task 4): cool fill 1.8 -> 0.45, cool specular sheen 420 -> 90 cd, chasm cool rim 90 -> 45 cd;
  braziers 70 cd / 13 m -> 55 cd / 10 m (darker between the fires), forge light 170 -> 125 cd, lava lights
  150 -> 115 cd. Warm light comes from fire and lava only; the rest is very dark. Readability aids unchanged
  (outline, rings, unit key light on its own channel); units still read (still 05).

## 3. Proof (`StyleSample/Captures/V4/`)

| File | Content |
|---|---|
| `Stills/01_game_camera.png` | game camera (pitch -58, FOV 45, 32 m), 1920 x 1080 |
| `Stills/02_close_forge.png` | forge close-up (exposure bias 0.7 instead of 1.0) |
| `Stills/03_close_chasm_heart.png` | chasm and Heart |
| `Stills/04_game_camera_units_plain.png` | units, no aids |
| `Stills/05_game_camera_units_aids.png` | units with outline, rings, unit key light |
| `06_camera_move_6s.webp` (+ `_640.gif`) | 180 frames, 1280 x 720, 30 fps, game camera down to the forge |
| `sidebyside_game_camera.png` | step 2 / step 3 / step 4 / target (2 x 2), game camera |
| `sidebyside_forge_closeup.png` | step 2 / step 3 / step 4 / target (2 x 2), forge close-up |
| `floor_layout_preview.png` | the own slab layout (mask, per-piece colour, embossed height) |

## 4. GPU table (game camera, 1920 x 1080, screen percentage 100, TSR, capped at 30 fps)

Offscreen `-game` run, CSV profiler, 300 frames, first 90 dropped, 210 measured; AMD Radeon RX 6800 XT;
same method as steps 1-3. Data: `Evidence/UR-STYLE-SAMPLE-V4/perf_stats.txt`, `perf_q2.csv`, `perf_q3.csv`.

| Setting | GPU avg | GPU p99 | GPU max | Render thread avg | Game thread avg | Largest GPU passes (avg ms) | Step 3 GPU avg |
|---|---:|---:|---:|---:|---:|---|---:|
| High (sg 2) | **10.5 ms** | 12.3 ms | 14.8 ms | 8.5 ms | 2.5 ms | lights 4.2, deferred lighting 0.6, Nanite base pass 0.6, shadow depths 0.6, TSR 0.5, Lumen reflections 0.5 | 11.2 ms |
| Epic (sg 3) | **16.7 ms** | 16.9 ms | 17.1 ms | 8.3 ms | 2.8 ms | lights 5.9, Lumen reflections 2.7, volumetric fog 1.8, deferred lighting 1.0, shadow projection 0.9, TSR 0.8 | 19.6 ms |

Epic is 2.9 ms cheaper than step 3: Lumen reflections 5.3 -> 2.7 ms (rougher, darker floor; dimmer sheen
light), lights 6.7 -> 5.9 ms. The single 1.9 M-triangle Nanite floor costs no more than the 270 slab meshes.

## 5. Power safety

- Every Unreal run waited for no other UnrealEditor process (`common.sh`), offscreen `-RenderOffscreen`,
  `t.MaxFPS 30`, VSync off, no `-benchmark`, no Movie Render Queue, no path tracing, about 10-45 s of rendering
  per run, no window. Per-tick check: final stills avg 27.8 fps, max 30 frames in any 1 s; camera move avg
  12.9 fps, max 30 in any 1 s; perf runs 29.9 / 30.1 fps from log stamps; all tuning runs max 30 in any 1 s.
- Floor / lava generation in Blender on the CPU only; headless builds `-nullrhi`; shader workers limited to 8.

## 6. Honest weak points

- **Overall colour**: the whole game view is now dark and strongly red-orange (lava and fire light, Lumen
  bounce); the target's darkness is more neutral grey-brown with white wet highlights. The floor reads dark
  and set-in, but the image is more monochrome red than the target.
- **Forge close-up**: the floor and the forge's block faces near the fire still read light orange because the
  brazier and forge lights are 1-2 m away; the background rock is now nearly black, where the target shows
  warm, lit rock. The hood stays dark.
- **Blood**: reads as red pools near the brazier from the game camera; up close the pools are still a little
  flat / painted, and the soaked joints are subtle.
- **Lava**: much less grid-like and with streams, but the crust is still lit fairly red overall and the plate
  seams remain a network rather than the target's long flowing veins; the streams are thinner than in the
  target.
- **Floor details**: the 30 % Cracked Rock pieces look crumpled ("foil-like") close up; slab edges catch a thin
  light rim in the camera move; the few glowing joints read as small light specks from the game camera.
- Braziers' flames from above, Heart core, step-1 units: unchanged from step 3.
- **Process slip (repaired)**: my first build call ran the copied step-3 build script before I had replaced it;
  it re-saved the step-3 assets and FBX sources. I restored exactly those tracked files with `git checkout`
  (no other path touched); the step-3 level and content are unchanged against `51fc690`.
- Size: new tracked-to-be files are about 41 MB of FBX sources (floor 37 MB), 6 MB layout PNG, 41 MB of
  `/Game/StyleV4` content, 54 MB of captures (all LFS by the root attributes).

## 7. Files

New: `StyleSample/Blender/make_floor_v4.py`, `StyleSample/Scripts/v4/*` (raw_to_png, import_v4,
materials_v4, level_v4, build_v4.sh, make_sheet_v4), `StyleSample/Scripts/jobs/v4_{stills,move,perf}.json`,
`StyleSample/Source/MeshesV4/*.fbx`, `StyleSample/Source/TexturesV4/{T_V4_FloorLayout.png, floor_layout.json}`,
`StyleSample/UnderreignStyle/Content/StyleV4/**`, `.../Content/Maps/L_StyleSample_V4.umap`,
`StyleSample/Captures/V4/**`, `Evidence/UR-STYLE-SAMPLE-V4/*`. Modified: `StyleSample/README.md` (step-4
section, title). Studio: `Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V4/WORKER_RESULT.md`.

## Viewing note

Survey sheets, scan textures and renders containing third-party scans were viewed locally in this Claude
Code session only (UD-85, DEC-025). Nothing was sent to any outside service or used for training.
