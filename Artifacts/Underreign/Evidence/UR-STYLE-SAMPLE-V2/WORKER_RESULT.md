# UR-STYLE-SAMPLE-V2 — Worker result

Copy of the external `Evidence/UR-STYLE-SAMPLE-V2/WORKER_RESULT.md` (C:/GameDev/Underreign); paths below are relative to that repository unless marked Studio.

Work Order: `Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V2/WORK_ORDER.md`
(Studio). Worker: separate Claude Code subagent. Mode: Discovery. Date:
2026-11-11. `verify-worker`: PASS (receipt
`436e256b9db8347dd3659a3cd8b79b43490f00c6af62ef498cc1863676d1ce22`).
External HEAD at start: `5ebdccb`. Nothing committed or pushed.

## What was built

- **New level `/Game/Maps/L_StyleSample_V2`** in the existing project
  `StyleSample/UnderreignStyle` (step 1 level, scripts and captures unchanged
  and still rebuildable). Same corner, same layout, same four cameras, same
  readability aids. Content in `/Game/StyleV2`.
- **Scanned surfaces everywhere**: rock walls, chasm walls, dig corridor,
  floor slabs, rough floor, lava crust, forge bricks, iron, rust, coal, decals.
  Master `M_Scan`: either the scan's own UVs (scan meshes) or world-aligned
  triplanar (own geometry), a second scanned set blended onto up-facing faces
  by height (ash / sand / wet ground on ledges), wetness with **puddles in the
  low parts of each scan's height map** (specular wetness on the slabs), soot,
  wet streaks on walls and heat glow in crevices near the lava.
- **Scan meshes at Nanite density**: the 13 mesh scans are game-resolution
  FBX (9–20k tris). Blender subdivides them and displaces them with each scan's
  own 4K displacement map and the scale / bias from its JSON (cliffs 225k–485k
  tris). All meshes Nanite on.
- **Walls**: the large dolerite cliff scan as the front face (open side turned
  to the room, measured from the area-weighted normals), smaller cliffs and
  boulders in front, own rock masses with the volcanic stone wall scan behind as
  filler. Chasm: two rows of cliffs per side with heat glow. Lip: dolerite slabs.
  Lava banks: volcanic rock clusters.
- **Lava with crust**: own 48 x 8 m plane (212k tris) displaced in Blender with
  the Rippled Lava Rock scan height; molten channels (main flow + cracks between
  plates) written into vertex colour. `M_LavaV2`: scanned crust, moving molten
  glow with a cooling skin, glowing cracks in the crust near the flow.
- **New props (own, Blender script `make_meshes_v2.py`)**: brick forge (about
  450 individual bevelled bricks in bond, arched mouth with voussoirs, hearth
  ledge, glowing coal bed of 120 chunks, iron corner straps and bands, iron
  hood with angle frame and rivets, banded chimney); anvil (base, waist, face
  with a polished top, horn, heel) on a stone block with an iron band; brazier
  (rolled rim, band, ring handles, three curved legs, foot ring, 190-chunk coal
  heap); oval-link chains (hanging, swag, lying); pillar of stacked stone drums
  with brass contract rings, two dim script bands and an iron lantern cage;
  railing posts; four worn floor slab variants (dished tops, chipped edges,
  cracks). The worked floor now continues into the forge bay.
- **Decals from scans**: blood stains and high-velocity spatter (wet gloss where
  thick) plus the step-1 drag marks at the fight spot; leakage and concrete
  leakage as wall streaks; mud stains / splash, wet soil, debris, corner soil,
  road debris and rock-in-ground decals at the wall feet and holes; scorch under
  braziers and the forge.
- **Fire, smoke, embers, sparks, ash: Niagara** (10 systems, see below).
- **Readability aids** kept and tested (stills 04 / 05).

## Fire and smoke: how Niagara was solved

1. Step-1 failure re-checked: setting the material on the component of a
   template system from headless Python does nothing.
2. Diagnosis: in 5.8 the lightweight (stateless) templates keep each module
   (InitializeParticle, ShapeLocation, AddVelocity, CurlNoise, ScaleColor,
   ScaleSpriteSize, SubUV, ...) as a UObject. Python does not expose those
   classes (`get_editor_property` fails), but the renderer properties class is
   exposed, and the editor console command `set <object path> <Property>
   <value>` imports property text on one object with PreEditChange /
   PostEditChange; `obj dump` reads it back. Verified: values persist after
   save (`Logs/v2_fx.log` dumps).
3. `Scripts/v2/fx_v2.py` duplicates `FountainLightweight` ten times and sets
   spawn rate, fixed bounds, shape, velocity, gravity / buoyancy, drag, curl
   noise, size and size-over-life curves, rotation, velocity alignment and
   sort mode, and the renderer material.
4. First render: sprites appeared but stayed invisible with my materials.
   Cause: `ParticleRelativeTime` read 0 for the stateless emitter, so the age
   fade was 0. Fix: the `ScaleColor` module is set to a linear alpha ramp
   1 -> 0, and the sprite materials take the age from the particle colour
   alpha.
5. Second failure: `ParticleColor.a` does not compile (the default output is
   RGB); the alpha output is wired separately.
6. Textures: engine-shipped flipbooks (`T_Fire_SubUV` 6 x 6 from the
   NetworkPredictionExtras plugin, `T_SmokeSubUV_8X8` from GuidedTutorials),
   copied once into `/Game/Style/FX/EngineFX` with the plugins enabled only for
   that commandlet. Fire: additive, frames blended by age, density mapped to a
   red -> orange -> yellow temperature ramp. Smoke: lit translucent (volumetric
   per-vertex), grows 0.6 -> 2.6 over 4–6.5 s, warm emissive near the fire.
   Embers / sparks: velocity-aligned, stretched by speed, flicker.
- Systems: brazier fire, forge fire (box source in the mouth), small lantern
  fire, brazier / forge embers, forge sparks (cone, gravity), lava embers
  (15 x 4.5 m), brazier smoke, dark forge-chimney smoke, lava steam / smoke,
  falling ash over the whole corner.
- Cost: Niagara stateless GPU simulation 0.01 ms, translucency 0.11 ms at the
  game camera.

## Proof (all in `StyleSample/Captures/V2/`)

| File | Content |
|---|---|
| `Stills/01_game_camera.png` | 1920 x 1080, game camera (pitch -58, FOV 45, 32 m) |
| `Stills/02_close_forge.png` | forge close-up |
| `Stills/03_close_chasm_heart.png` | chasm and Heart |
| `Stills/04_game_camera_units_plain.png` | game camera with the three units, no aids |
| `Stills/05_game_camera_units_aids.png` | the same with outline, rings and unit key light |
| `06_camera_move_6s.webp` | 180 frames, 1280 x 720, 30 fps, game camera down to the forge (also `_640.gif`) |
| `sidebyside_game_camera.png` | step 1 / step 2 / target, game camera |
| `sidebyside_forge_closeup.png` | step 1 / step 2 / target, forge close-up |

Contact sheet: `Evidence/UR-STYLE-SAMPLE-V2/contact_sheet.png`.

## GPU table (game camera, 1920 x 1080, screen percentage 100, TSR, capped at 30 fps)

Offscreen `-game` run of the editor binary, CSV profiler, 300 frames, first 90
dropped, 210 measured. AMD Radeon RX 6800 XT. Same method as step 1.

| Setting | GPU avg | GPU p99 | GPU max | Render thread avg | Game thread avg | Largest GPU passes (avg ms) | Step 1 GPU avg |
|---|---:|---:|---:|---:|---:|---|---:|
| High (sg 2) | **11.9 ms** | 12.0 ms | 12.0 ms | 6.5 ms | 2.3 ms | lights 5.9, shadow depths 0.7, Nanite base pass 0.6, deferred lighting 0.5, Lumen reflections 0.5, shadow projection 0.5, TSR 0.5 | 10.6 ms |
| Epic (sg 3) | **19.3 ms** | 19.5 ms | 20.1 ms | 6.8 ms | 2.4 ms | lights 7.9, Lumen reflections 3.0, volumetric fog 1.7, deferred lighting 1.0, shadow projection 0.9, TSR 0.8 | 17.2 ms |

Data: `Evidence/UR-STYLE-SAMPLE-V2/perf_stats.txt` (CSVs in the ignored
`StyleSample/PerfRuns/v2/`). Epic is +2.1 ms over step 1, mostly Lumen
reflections on the wet floor (1.9 -> 3.0 ms). Still under 60 fps budget on this
GPU; High leaves room. The biggest cost remains the ~20 shadowed point lights.
The perf runs were taken before the last floor-material tweak (scalar values
only: normal strength, wetness level), which does not change the shader cost.

## Power safety

- Every run waited for no other UnrealEditor process (`common.sh`), offscreen,
  `t.MaxFPS 30`, VSync off, no `-benchmark`, no Movie Render Queue, no path
  tracing, under 30 s of rendering per run.
- New: `capture.py` records a timestamp on every engine tick and logs
  `UR_CAP pacing`. Final runs: stills avg 28.0 fps, max 30 frames in any 1 s;
  camera move avg 13.5 fps (a screenshot every frame), max 30 in any 1 s. Perf
  runs (they end through the CSV profiler): 30.1 fps from log stamps.
  (A log-stamp estimate of an early move run read 34 fps for one segment; that
  method is unreliable for sparse log lines, which is why the per-tick check
  was added. The per-tick check never showed more than 30.)
- Shader compiling limited to 8 workers (`[DevOptions.Shaders]` in
  `DefaultEngine.ini`). The game uses no fixed-step capture mode here.
- The `fx_v2.py` commandlet crashes in Python shutdown after saving
  (`exit=3`, after `UR_FX2_DONE`); assets are saved and load correctly. Not
  investigated further.

## Readability (with the new look)

- Plain (04): the own creature reads by its glowing horns and chest ember; the
  intruder reads by its lantern; the trap plate nearly disappears on the wet
  slabs, as in step 1.
- With aids (05): all three read at once. The blue hostile ring and the
  white-gold trap ring survive the warm grading; the wet specular floor does not
  hide the rings. Same four aids still needed.

## Scans used (Megascans, local use only)

Texture sets (13 surfaces): Volcanic_Stone_Wall (rock walls, stone props),
Layered_Rock_Cliff-859dbbe6 (chasm rock masses), Mine_Rock_Wall (dig corridor),
Icelandic_Cracked_Rock (floor slabs, 4K), Wet_Stone_Ground (ground layer,
joints), Icelandic_Lava_Sand (rough floor base, ash layer on ledges),
Rippled_Lava_Rock (lava crust and its displacement, 4K), Charred_Bricks
(forge), Rusty_Metal_Sheet-54c7decd (dark iron), Rusty_Metal_Sheet-d31ced0d
(rusty iron: braziers, hood), Rusty_Metal (brass base), Coal_Debris (coal).

Decal sets (15): Blood_Stain-b28be71e, Blood_Stain-e1f22061,
High_Velocity_Blood_Spatter-3788a8c9 / -72fec0c1 / -a63636c8,
Leakage-906d1f6c, Leakage-69235d75, Concrete_Leakage, Mud_Stain-0c20290d,
Mud_Stain-63593db4, Mud_Splash-0a461105, Wet_Soil-552bd65f, Debris-32534506,
Corner_Soil_Debris-49856632, Rock_In_Ground, Road_Debris-09396419.

Mesh scans (13, with their texture sets): Volcanic_Dolerite_Cliff
-2c9f6b5a / -452eb173 / -75f33c57 (4K), Volcanic_Dolerite_Rock,
Volcanic_Dolerite_Rocks, Tundra_Icelandic_Rock_Cluster_Volcanic_Large_03,
Icelandic_Rock, Sharp_Rock, Granite_Rock, Rock_Granite, Small_Rock,
Small_Stones_Pack, Burnt_Brick_Debris.

Not used: the Old Mine pack, the remaining layered / gouged cliffs, cobblestone,
flagstone, mossy / grass / roots / swamp sets, sulphur rock, paper grime and the
other mud / spatter variants. Black_Stone_Floor and one Gouged_Rock_Cliff set
were imported for a test and removed again (not used by the scene).

Resolution: 4K for the slab stone, lava rock and the large cliff; 2K for the
rest (decals 2K). Sources are kept as JPEG (quality 95, no chroma subsampling)
because Unreal stores JPEG sources compressed; PNG sources were 2.5x larger.
Footprint: `/Game/StyleV2` 450 MB (scan textures about 355 MB, scan meshes
79 MB), Git-LFS through the project attributes. The prepared sources
(`Source/ScansV2`) are git-ignored and rebuilt by script from the read-only
library; the library was never written.

## Honest weak points

- **Still darker and more orange than the target.** The target has a brighter,
  more neutral ambient and strong highlights on wet stone everywhere; here the
  wet look shows mainly near light sources. The walls frame the room less
  strongly than the target's big boulders: from the game camera they read as
  dark masses.
- **Slab tops**: the cracked-rock scan on 1 m slabs reads well in the close-up
  and the move, but at oblique angles the triplanar normal and puddles give a
  slightly "crumpled" sheen; joints are uniform (no mortar, no dirt in joints).
- **Lava**: crust and channels read, but from the game camera it is still
  brighter and more uniform than the target; the crust does not move (only the
  glow and skin move); the molten share is high.
- **Chasm / Heart close-up**: still a red monochrome wash; the Heart is the
  step-1 asset (white-hot core, plain glass horns), not reworked.
- **Smoke** is visible in the close views, faint from the game camera. No heat
  haze improvement over step 1.
- **Fire** looks real in the forge close-up; it is a 2D flipbook, so up close
  it is flat when the camera moves around it; the core can clip to white.
- **Props**: the forge hood and chimney are plain panels; anvil and block are
  simple; brazier has no ornament band (target has one). Pillar script bands
  and lanterns are plain.
- **Units** are still the step-1 placeholders.
- The forge mouth glow plate (step-1 glow material) is flat bright orange.
- Edits outside V2 files: step-1 masters `M_Surface`, `M_Glow`, `M_Glass` got
  `used_with_nanite` saved (needed so `-game` does not fall back to the default
  material); `capture.sh` takes `MAP`; `capture.py` logs per-tick pacing.

## Viewing note (for the Director / Human)

To judge the look I viewed my own renders (which contain the Megascans) inside
this Claude Code session; I did not view raw scan textures or thumbnails and
selected sets by name, metadata and simple image statistics. Nothing was sent
to any other service. If renders of third-party assets must not be shown to
Claude at all, that needs a Human decision for future orders.

## Files

`StyleSample/README.md` (step 2 section), `StyleSample/Scripts/v2/*`,
`StyleSample/Blender/make_scans_v2.py`, `StyleSample/Blender/make_meshes_v2.py`,
`StyleSample/Source/MeshesV2/*.fbx` (own), `StyleSample/Scripts/jobs/v2_*.json`,
`StyleSample/UnderreignStyle/Content/StyleV2/**`,
`StyleSample/UnderreignStyle/Content/Style/FX/EngineFX/*`,
`StyleSample/UnderreignStyle/Content/Maps/L_StyleSample_V2.umap`,
`StyleSample/Captures/V2/**`, `Evidence/UR-STYLE-SAMPLE-V2/*`; modified:
`StyleSample/.gitignore`, `Scripts/capture.sh`, `Scripts/capture.py`,
`UnderreignStyle/Config/DefaultEngine.ini`, the three step-1 masters above.
