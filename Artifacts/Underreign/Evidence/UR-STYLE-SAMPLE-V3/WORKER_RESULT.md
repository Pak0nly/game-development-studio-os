# UR-STYLE-SAMPLE-V3 — Worker result

Work Order: `Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V3/WORK_ORDER.md` (Studio). Worker:
separate Claude Code subagent. Mode: Discovery. Date: 2026-11-11. `verify-worker`: PASS (receipt
`944052947dc89c69a3c525b1135998931f328de4eb3d8b84aa3ee9ab72e8beb7`). External HEAD at start: `db5c897`.
Nothing committed or pushed.

## 1. Visual survey (done first)

Every item of `C:/GameDev/Underreign_Assets/Fab/VaultCache/FabLibrary` (89 items; the Old Mine pack
split into its 70 pieces, 158 previews in total) got a look preview, rendered in Blender with Cycles on
the CPU (no GPU load): surfaces as a 2 x 2 m tile displaced with the scan's own height at the game
camera's pitch plus a lit sphere, both at the scan's real size; decals on a neutral dark stone tile;
meshes lit from two sides. All previews share one light set (warm fire-coloured back light that shows
wet / specular glints toward the camera, cool fill). Labelled contact sheets per category:

| Sheet | Previews |
|---|---|
| `StyleSample/Captures/V3/Survey/survey_floors.png` | 10 |
| `StyleSample/Captures/V3/Survey/survey_walls_cliffs.png` | 15 surfaces |
| `StyleSample/Captures/V3/Survey/survey_rock_meshes.png` | 10 mesh scans |
| `StyleSample/Captures/V3/Survey/survey_lava_volcanic.png` | 5 |
| `StyleSample/Captures/V3/Survey/survey_wet_water.png` | 7 |
| `StyleSample/Captures/V3/Survey/survey_debris.png` | 3 |
| `StyleSample/Captures/V3/Survey/survey_decals.png` | 35 |
| `StyleSample/Captures/V3/Survey/survey_metal.png` | 3 |
| `StyleSample/Captures/V3/Survey/survey_old_mine.png` | 70 (Old Mine pieces) |

I looked at every sheet next to `style_target_game_camera_v1.png` and `style_target_forge_closeup_v1.png`.
Five mud-stain items (gltf downloads) contain only a roughness map and no colour map in the library:
they cannot be used as they are.

## 2. Chosen scans per role (by look), and what happened to the step-2 choice

| Role | Choice (step 3) | Why it fits the target | Step-2 choice |
|---|---|---|---|
| Floor slabs | **Black Stone Floor** (new) | Dark square slabs with a hammered, rippled surface, closest to the target's slab tops; its tiles are a regular 5 x 5 grid, so one texture tile is mapped onto each 1 m slab with the joints on the slab gaps | Icelandic Cracked Rock dropped: deep, crumpled relief that produced the blotchy, puddled look |
| Ground in the joints / holes | Wet Stone Ground (kept), now very dark and rough | Joints read as dark lines, as in the target | kept |
| Boulder frame | **Granite Rock** (main), **Volcanic Dolerite Rocks**, Tundra rock cluster (low ones) | Rounded, compact, dark, pitted boulders like the ones lining the target room | Icelandic Rock dropped: very pale grey on the sheet, did not match the dark boulders |
| Back wall faces / chasm | Volcanic Dolerite Cliff (large) and Layered Rock Cliff 859d (kept) | Dark, blocky vertical faces; the survey showed nothing darker or closer | kept |
| Angular background rocks (forge) | Sharp Rock, Rock Granite (kept) | Faceted faces like the rocks behind the forge in the close-up target | kept |
| Lava crust | Rippled Lava Rock (kept) | Its flow ripples read as moving lava; the new lava material breaks it into plates | kept, new material |
| Forge blocks | **Burnt Brick Debris** texture (new use) | Its scan atlas holds six whole brick faces with charred edges; each forge block face gets one of them, so every block looks like a real burnt stone block | Charred Bricks dropped: its small brick-and-mortar pattern fought the modelled blocks |
| Iron (hood, anvil, brazier, bands) | Rusty Metal Sheet 54c7 (kept as dark iron), d31c rust used lightly | Dark iron with rust spots, as in the target | kept |
| Brass (contract rings) | Rusty Metal Sheet 54c7 with a warm tint (changed) | | Rusty Metal 0f35 dropped: blue paint flakes visible on the sheet |
| Blood | **High Velocity Blood Spatter a636 and 84ef** as the two pools (new), 3788 / 72fe as spray | Dense pools with spray around them, like the target's two pools | the thin drip stain Blood Stain b28b no longer used for the pools (kept only as one drip at the chasm edge) |
| Broken-slab holes | Debris 3253 (gravel patch) | | Rock In Ground dropped: a pale rock on the sheet |
| Floor mud | removed from the slab floor (only damp soil at the wall feet) | the target floor has none; from above it was blotchy | Mud Stain / Mud Splash removed |
| Coal | Coal Debris (kept), dimmer | | kept |
| Props from the Old Mine pack | hammer and pickaxe by the anvil (new) | the only pieces that fit a forge; carts, rails and helmets look out of place | not used before |
| Heart horns | own step-1 mesh, now a dark obsidian-like stone (Rippled Lava Rock set, glossy) | readable silhouettes against the core | pale glass dropped |

## 3. What changed in the scene (`/Game/Maps/L_StyleSample_V3`)

- **Floor**: slabs fill the room up to the boulder frame (step 2: a patch in the middle). New slab
  meshes without the step-2 crack lines, chipped edges, slight dish. Joints dark; wet, glossy slab tops
  (low roughness from the scan's own roughness) with glints from the fires; no puddle mask, so no blotches.
- **Lava**: new material `M_LavaV3`: dark crust plates with bright seams between them (two scales), each
  plate showing its own part of the lava scan, the crust drifting slowly downstream (3.5 cm/s); a narrow
  molten river; less light spill onto the floor. The flat black rock clusters in the lava are gone.
- **Light**: cooler, more neutral fill from above; a broad, mostly specular cool light over the far half
  of the room for wet highlights from the game camera; warm light only from fire, lanterns, forge and
  lava; higher contrast in the grading.
- **Walls**: a boulder frame along the left and bottom edges of the game view and the far wall, lighter
  and slightly wet scan instances so they catch light.
- **Forge**: stone blocks with scanned burnt-brick faces, a radial arch of voussoirs (no stair steps),
  iron bands with rivet rows, riveted corner straps, a hood of overlapping plates with seam straps,
  angle irons and rivets; a small warm light on the hood. **Anvil**: proper London-pattern shape.
  **Braziers**: ornament band of interlaced strands, rivets, ring handles; bigger flames, dimmer coal.
- **Heart view**: dimmer core with visible veins, dark horns, Heart light orange instead of red, a cool
  rim light in the chasm, lower heat glow on the chasm walls.

## 4. Proof (all in `StyleSample/Captures/V3/`)

| File | Content |
|---|---|
| `Stills/01_game_camera.png` | game camera (pitch -58, FOV 45, 32 m), 1920 x 1080 |
| `Stills/02_close_forge.png` | forge close-up |
| `Stills/03_close_chasm_heart.png` | chasm and Heart |
| `Stills/04_game_camera_units_plain.png` | units, no aids |
| `Stills/05_game_camera_units_aids.png` | units with outline, rings, unit key light |
| `06_camera_move_6s.webp` (+ `_640.gif`) | 180 frames, 1280 x 720, 30 fps, game camera down to the forge |
| `sidebyside_game_camera.png` | step 2 / step 3 / target, game camera |
| `sidebyside_forge_closeup.png` | step 2 / step 3 / target, forge close-up |
| `Survey/survey_*.png` | the nine survey contact sheets |

## 5. GPU table (game camera, 1920 x 1080, screen percentage 100, TSR, capped at 30 fps)

Offscreen `-game` run, CSV profiler, 300 frames, first 90 dropped, 210 measured; AMD Radeon RX 6800 XT;
same method as steps 1 and 2. Data: `Evidence/UR-STYLE-SAMPLE-V3/perf_stats.txt`.

| Setting | GPU avg | GPU p99 | GPU max | Render thread avg | Game thread avg | Largest GPU passes (avg ms) | Step 2 GPU avg |
|---|---:|---:|---:|---:|---:|---|---:|
| High (sg 2) | **11.2 ms** | 11.7 ms | 12.0 ms | 7.8 ms | 3.0 ms | lights 4.6, Lumen reflections 0.9, shadow depths 0.7, Nanite base pass 0.7, shadow projection 0.5, deferred lighting 0.5, TSR 0.5 | 11.9 ms |
| Epic (sg 3) | **19.6 ms** | 19.9 ms | 21.7 ms | 7.8 ms | 2.9 ms | lights 6.7, Lumen reflections 5.3, volumetric fog 1.5, shadow projection 1.0, TSR 0.8, Nanite base pass 0.8 | 19.3 ms |

Epic is +0.3 ms over step 2: Lumen reflections on the now wetter, glossier floor cost more (3.0 -> 5.3 ms),
the lights less (7.9 -> 6.7 ms, lava lights smaller). High is 0.7 ms cheaper than step 2.

## 6. Power safety

- Every Unreal run: waited for no other UnrealEditor process (`common.sh`), offscreen `-RenderOffscreen`,
  `t.MaxFPS 30`, VSync off, no `-benchmark`, no Movie Render Queue, no path tracing, under 1 minute of
  rendering per run, no window. Per-tick check (final runs): stills avg 27.6 fps, max 30 frames in any
  1 s; camera move avg 12.1 fps, max 30 in any 1 s; perf runs 30.0 fps from log stamps. No tuning run
  showed more than 30 in any 1 s.
- Survey and prop previews: Blender, Cycles on the CPU only, small images.
- Headless builds use `-nullrhi` commandlets; shader compiling limited to 8 workers (unchanged config).

## 7. Honest weak points

- **Floor colour**: the slab tops are still lighter and more mauve-brown than the target's dark grey-brown;
  the scan's own colour has low contrast (its detail lives in the relief), so from the game camera the
  hammered pattern shows mainly as glints near the fires, less than in the target. Wet sheen is good near
  fires, weaker in the far half.
- **Blood** reads as a red stain, not as thick dark pools: the scanned spatter has soft opacity; the
  pools are visible but flatter than in the target.
- **Brazier flames** read clearly from the side (close-up, move); from the game camera they look like a
  bright blob over the coal, not the tall flames of the target (2D flipbook sprites seen from above).
- **Lava**: plates and seams now match the target's idea; the network is regular in size, and the plates
  look fairly uniform orange in the Heart view; the river core is still bright white-yellow.
- **Boulder frame** is visible along two edges of the game view; the boulders are darker and less lit
  than the target's.
- **Hood** of the forge is still dark in the close-up; rivets read only near the fire. Back rocks in the
  close-up stay dark grey where the target has warm, lit rock.
- **Heart core** still has clipped bright patches; the Heart itself is the step-1 mesh.
- Units are still the step-1 placeholders; no heat haze change.
- Edits outside V3 files: `StyleSample/.gitignore` (two ignored source folders), `StyleSample/README.md`
  (step 3 section). Step-1 and step-2 levels, scripts and assets are untouched.

## 8. Files

New: `StyleSample/Scripts/v3/*` (survey_prep, survey_sheets, prep_v3, import_v3, materials_v3, level_v3,
build_v3.sh, make_sheet_v3), `StyleSample/Blender/survey_render_v3.py`, `make_meshes_v3.py`,
`preview_props_v3.py`, `StyleSample/Scripts/jobs/v3_*.json`, `StyleSample/Source/MeshesV3/*.fbx` (own),
`StyleSample/UnderreignStyle/Content/StyleV3/**` (51 MB), `.../Content/Maps/L_StyleSample_V3.umap`,
`StyleSample/Captures/V3/**`, `Evidence/UR-STYLE-SAMPLE-V3/*`. Modified: `StyleSample/.gitignore`,
`StyleSample/README.md`. Git-ignored and rebuilt by script: `Source/SurveyV3`, `Source/ScansV3`.
Studio: `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md` (UD-85),
`Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V3/WORKER_RESULT.md`.

## Viewing note

All survey sheets and renders with third-party content were viewed locally in this Claude Code session
for choosing and review (UD-85). Nothing was sent to any outside service or used for training.
