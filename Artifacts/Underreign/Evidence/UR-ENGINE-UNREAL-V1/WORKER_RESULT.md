# UR-ENGINE-UNREAL-V1 — Worker result

## Gate

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker ... (Studio root)
PASS worker receipt f9ba95fd96b5858dc79dec904942919e2a9f9fb1e67b975aa38fdfbc50b87419
```

Run once before any change (exit 0). Not re-run after the operational
recovery notice, as instructed by the Director. Changes only in
`C:/GameDev/Underreign/EngineComparison/Unreal`,
`C:/GameDev/Underreign/Evidence/UR-ENGINE-UNREAL-V1` and
`Artifacts/Underreign/Evidence/UR-ENGINE-UNREAL-V1` (Studio). Nothing
committed or pushed. `EngineComparison/Kit` and `EngineComparison/Unity`
untouched. No Fab/Marketplace assets, no downloads.

Outside the allowed paths, Unreal itself wrote engine-managed caches and
profiles (`%LOCALAPPDATA%\UnrealEngine\Common\Zen` derived-data cache,
`%LOCALAPPDATA%\UnrealEngine\5.8\Saved\Profiling\CSV\*.csv`), and a one-off
Blender radiometry test ran in the session scratchpad (temporary files only).

## Operational recovery

The Director reported an unexpected PC shutdown around 12:00. No interruption
was visible in this Worker session (the last renders had finished at 12:07).
Recovery check done anyway: the project opened and rendered cleanly headless,
all 600 clip frames decode fully at 1280 x 720 (none truncated), and the close
clip was re-rendered because it predated the frame-timing fix. Afterwards all
captures were re-rendered once more with opaque RGB output and an explicit
screen percentage of 100 (identical measurements before and after).

Operational repairs during the build (no candidate change): Git Bash path
conversion of `/Game/...` arguments (fixed with `MSYS_NO_PATHCONV=1`), actor
spawning in the commandlet (class spawn instead of object spawn), the
Sequencer visibility channel stores "visible" not "hidden" (first render had
the dig inverted), Movie Render Queue's default "frame center" timing showed
the dig one frame late (now "frame open"), PNG alpha (now off).

## Evidence in this folder

- `dig_adaptation_overview.txt`: mean linear brightness of the tunnel area per
  frame 110..175 of `clip_overview` (box 860,345-1110,425 at 1280 x 720).
- `perf_main_summary.txt`: 20 s performance window from the CSV profile.

---


Engine comparison, stage 2 (UD-46), Unreal side. Worker: separate Claude Code
subagent. Mode: Discovery. Date: 2026-11-10. Engine: Unreal Engine 5.8.3
(launcher build, `C:\Program Files\Epic Games\UE_5.8`). Hardware: AMD Radeon
RX 6800 XT, AMD Ryzen 9 7900X3D, 31 GB RAM, Windows 11.

## Result in short

- A blank Blueprint/Python-only project (no C++) at
  `EngineComparison/Unreal/UnderreignCompare`, built entirely by script from
  `SCENE_LAYOUT.json`: 25 kit meshes and 80 textures imported, 180 instances,
  12 layout lights plus the ambient, both cameras, the dig event and the light
  flicker in Sequencer.
- Rendering: fully dynamic, Lumen global illumination and Lumen reflections on
  hardware ray tracing, Virtual Shadow Maps, Nanite meshes, TSR anti-aliasing,
  Epic scalability, fixed manual exposure.
- Captures with Movie Render Queue, real-time renderer (no path tracer), one
  sample per frame: four 1920 x 1080 stills and two 10 s clips (1280 x 720,
  30 fps, 300 frames each) in `Captures/Lumen/`.
- Performance (20 s, 1920 x 1080 native, overview camera, Epic, no VSync,
  offscreen `-game` run): **10.6 ms average frame time (94 fps), worst frame
  12.8 ms; GPU 9.5 ms average, 10.6 ms worst** on the RX 6800 XT.
- Every editor and game run was headless (`UnrealEditor-Cmd.exe`, commandlet or
  `-game -RenderOffscreen -unattended`); no window was opened.

## Files

| Path | Content |
|---|---|
| `UnderreignCompare/UnderreignCompare.uproject` | project, plugins Python Editor Script, Editor Scripting Utilities, Movie Render Queue |
| `UnderreignCompare/Config/*.ini` | renderer settings (below), maps, packaging |
| `UnderreignCompare/Content/Kit/{Meshes,Textures,Materials}` | imported kit, 2 parent materials (+1 two-sided variant), 20 material instances, MPC, ambient cubemap |
| `UnderreignCompare/Content/Maps/L_UnderreignCompare` | the scene (used for the captures) |
| `UnderreignCompare/Content/Maps/L_UnderreignCompare_Perf` | the same scene plus an auto-playing, looping overview sequence (performance run) |
| `UnderreignCompare/Content/Cinematics/` | `SEQ_Overview`, `SEQ_Close`, four Movie Render Queue configs |
| `Scripts/` | `import_kit.py`, `build_scene.py`, `build_perf_level.py`, `ur_common.py`, `look_settings.json`, runners `run_build.sh`, `render.sh`, `perf_run.sh`, analysis `analyse_frames.py`, `perf_stats.py`, `generated/T_UR_AmbientUniform.hdr` |
| `Captures/Lumen/` | `cam_overview_before.png`, `cam_overview_after.png`, `cam_close_before.png`, `cam_close_after.png`, `clip_overview/0000..0299.png`, `clip_close/0000..0299.png` |
| `.gitignore`, `.gitattributes` | ignore Binaries/Intermediate/Saved/DerivedDataCache/Build/Packaged/PerfRuns/Logs; `.uasset`/`.umap` to Git LFS (the root `.gitattributes` only covers Unity) |

Rebuild from scratch: `bash Scripts/run_build.sh import`, then
`bash Scripts/render.sh <SEQ> <MRQ config> <x> <y> <log>` per capture and
`bash Scripts/perf_run.sh 4500 perf_main` (Git Bash; the scripts set
`MSYS_NO_PATHCONV=1` so `/Game/...` paths reach Unreal unchanged).

## Import and axis check

- FBX through the classic FBX importer (Interchange FBX switched off for the
  import so the spec's options map 1:1): Convert Scene on, Force Front X Axis
  off, Convert Scene Unit on, uniform scale 1, Import Normals and Tangents,
  no materials or textures from the FBX.
- `UR_AxisMarker` bounds in Unreal: X -8..100 cm, Y -60..8 cm, Z -8..30 cm,
  i.e. long arm along +X (east), medium arm along -Y_UE (= neutral +Y, north),
  short arm up. **The layout mapping `(100x, -100y, 100z)`, `yaw_ue = -yaw`
  holds; no import change needed.** The marker is placed at its layout
  position and hidden in game (not in any capture).
- Triangle counts match the kit manifest for all 25 pieces (336,571 drawn).
- Camera framing matches the Blender reference exactly (checked side by side
  at the clip start and end).
- Textures: BaseColor and Emissive sRGB; Normal linear, normal-map
  compression, **Flip Green Channel on**; `_UE_ORM` linear, Masks compression
  (R occlusion, G roughness, B metallic). Engine-default mipmaps and streaming.
- Meshes: Nanite on (explicit imported tangents, full-detail fallback for ray
  tracing); the removable wall is Movable, everything else Static.

## Materials

One parent material `M_UR_Kit` (opaque, Default Lit, back-face culling on):
BaseColor, Normal, ORM and Emissive texture parameters, emissive =
texture x `EmissiveStrength`. `M_UR_Lava` is the same plus the UV scroll
(V offset -0.04 x LavaTime, so the pattern flows towards neutral -Y; Unreal's
V axis is flipped against Blender's). LavaTime is a material parameter
collection value keyed by Sequencer (= sequence seconds), so the scroll is
frame-exact in the clips and loops with the performance sequence. One
material instance per texture set, emissive strength from the layout times
the global emissive factor. No extra maps, decals, parallax, subsurface,
particles or transparency.

## Lights, exposure and the tunable values (SCENE_SPEC section 8)

| Item | Value |
|---|---|
| Point and spot lights | layout candela x 4 pi (see decision 1) x global factor 1.0, inverse-square falloff, layout attenuation and source radius, sRGB colour, shadows on, Movable |
| Spot `L_Lava_Spill_East` | half angles outer 45, inner 18, layout direction |
| Directional fill | 2732 lux x 1.0, source angle 8 deg (Blender sun angle), soft VSM shadow |
| Ambient | sky light from a uniform cubemap with the layout colour (0.03, 0.028, 0.034), intensity 683 (Blender radiance to nits), Lumen-occluded |
| Global light factor | 1.0 |
| Global emissive factor | 683 (same Blender-to-nits conversion as the ambient and the fill) |
| Exposure | manual, physical camera exposure off, exposure compensation -9.0 EV (no eye adaptation, no local exposure: contrast scales 1.0) |
| Tonemapper | Unreal default filmic (ACES-like) |
| Bloom | standard (Gaussian) bloom, intensity 0.45, threshold 1.0 |
| Off | fog, volumetrics, depth of field (camera focus disabled), motion blur, vignette, film grain, chromatic aberration, lens flares, colour grading LUT, auto exposure |
| Global illumination | Lumen, hardware ray tracing; final gather quality 2, scene lighting quality 2, scene detail 2, max trace distance 60 m, lighting update speed 2 (scene and final gather) |
| Reflections | Lumen, hit lighting for reflections, reflection quality 2 |
| Shadows | Virtual Shadow Maps (Nanite) |
| Anti-aliasing | TSR, native resolution (screen percentage 100) |
| Scalability | Epic (3) for captures and the performance run |

Flicker: every flickering light's intensity is keyed per frame (30 fps) in
both sequences: torches and brazier with a smooth 1D value noise (integer hash
lattice, smoothstep blend, seed per light, `Scripts/ur_common.py`), lava
lights and the spill spot with a sine pulse at 0.35 Hz with the layout phase.
The Blender kit did not animate flicker, so there is no reference function;
the Unity side will use its own noise with the same amplitude and frequency.

Cameras: Cine Camera actors, filmback 36 x 20.25 mm, 32 / 35 mm focal length,
keyed every frame from the smoothstep-interpolated layout position and
look-at. Movie Render Queue samples frame N at exactly t = N / 30 s
("frame open" shutter timing; the default "frame center" showed the dig one
frame late).

## Decisions taken inside the order (for the Director to check)

1. **Local light strength x 4 pi.** The layout's candela values use the glTF
   exporter convention `I = P x 683 / (4 pi)^2`, the fill uses
   `E = S x 683`. A headless Cycles measurement (Blender 5.2, white
   Lambertian plane) shows that Blender itself uses `I = P / (4 pi)` W/sr for
   point lights and `S / pi` radiance for the sun, so the layout values make
   every point and spot light **12.6 x weaker relative to the fill** than in
   the Blender reference. With the literal values the dig moment barely showed
   (the tunnel stayed almost as dark as before) and the torches and brazier
   lit nothing. I multiplied all point and spot lights by 4 pi; the ratios
   among them (`relative_to_brazier`) are unchanged, and the fill has no
   `relative_to_brazier` value. The Unity build should use the same balance
   for a fair comparison.
2. **Rock material two-sided.** `UR_Rock_Fill` contains faces with flipped
   normals: with back-face culling the overview showed black rectangular holes
   in the rock ledges between the layers (Blender's Eevee preview hides them
   because it renders back faces). The `T_RockRaw` material (rock fill and
   tunnel) is two-sided in Unreal; all other materials keep back-face culling.
   This is a kit defect; Unity will show the same holes unless it does the same.
3. **Flame lights are not blocked by their own flame meshes.** In the Blender
   reference the torch and brazier lights sit inside opaque flame meshes and
   are mostly shadowed by them, so the torches barely light the wall there. In
   Unreal the lights escape their flame meshes and light the wall and floor
   around them, which is what the art intent describes ("all warm light comes
   from the Pact's own fire"). It makes the Unreal door area warmer than the
   reference.
4. **Visibility for the dig.** The wall is hidden in game by a Sequencer
   visibility track at frame 120 (t = 4.0 s); hidden, it casts no shadow and
   leaves the Lumen scene.

## How the dig moment looks

- Overview: until frame 119 the spill spot only lights the inner face of the
  dig wall (an orange glow on the east wall). At frame 120 the wall is gone and
  the tunnel floor and walls are lit orange in the same frame; the measured
  mean brightness of the tunnel area doubles in one frame (0.0047 -> 0.0086
  linear). Afterwards it rises another 9 % over about 1.3 s (90 % of that rise
  at 0.8 s, 98 % at 1.3 s after the dig), which is Lumen's bounce light
  settling together with the slow lava pulse. There is no visible lag, black
  frame or smear; the change reads as instant. Data:
  `Evidence/UR-ENGINE-UNREAL-V1/dig_adaptation_overview.txt`.
- Close camera: it does not see the tunnel or the dig wall, so before and after
  look the same (only the flicker and the dolly change).
- Compared with the Blender reference, the tunnel glow after the dig is a
  little darker and redder (the saturated lava colour through Unreal's filmic
  tonemapper), the lava surface reads more yellow, and the chamber walls near
  the lava, the door and the torches are warmer because Lumen bounces the
  emissive lava, joints and script panels and the torch lights onto them.

## Performance

`-game` standalone run of the editor binary (Development, uncooked content),
offscreen, 1920 x 1080 at screen percentage 100, Epic scalability, VSync off,
frame rate uncapped, looping overview sequence (two dig events in the
window), CSV profiler (the data `stat unit` shows). Window: 20.0 s after a
10 s start-up (shader/PSO warm-up excluded). GPU: AMD Radeon RX 6800 XT, not
shared (the Unity worker was paused; no Unity process running).

| Stat | Average | Worst | 99th percentile |
|---|---:|---:|---:|
| Frame | 10.60 ms (94 fps) | 12.76 ms | 11.45 ms |
| Game thread | 1.28 ms | 2.06 ms | 1.78 ms |
| Render thread | 10.59 ms | 12.79 ms | 11.45 ms |
| RHI thread | 1.62 ms | 2.36 ms | 2.05 ms |
| GPU | 9.53 ms | 10.63 ms | 9.66 ms |

Largest GPU passes (average): local lights 2.3 ms, deferred lighting 1.9 ms,
TSR 1.3 ms, Lumen reflections 1.2 ms, shadow depths 0.9 ms. The editor binary
is render-thread bound at the same level as the GPU; a cooked packaged build
would lower the CPU side. An earlier run without the explicit screen
percentage (engine default TSR upscaling) gave 7.4 ms frame / 6.4 ms GPU.
No packaged build was made (the order allows the `-game` run).

## Disk size

| Item | Size |
|---|---:|
| Project folder total (incl. Saved) | 378 MB |
| `Content` (what Git would hold, LFS) | 102 MB, 138 assets |
| `Saved` (ignored; Movie Render Queue work frames, logs) | 276 MB |
| `Captures/Lumen` | 821 MB (clips 407 + 402 MB, stills 12 MB) |
| Unreal shared cache outside the project (`%LOCALAPPDATA%\UnrealEngine\Common\Zen`) | 1.7 GB, engine-managed |

## Strengths (honest)

- Lumen makes the emissive lava, the glowing joints and the script panels
  light their surroundings without baking, and the torch and lava light bounce
  warmly onto walls and the figure. Everything is dynamic, so the dig moment
  needs no extra work: the light floods the tunnel in the same frame.
- Hardware-ray-traced Lumen reflections give the brass, the horns and the wax
  believable glints; VSM shadows from all 11 shadowed local lights are sharp
  near contact and soft with distance.
- Fast and repeatable pipeline: the full scene builds from the layout in about
  20 s headless; a 300-frame clip renders in about 20 s.
- At native 1080p the scene runs at about 94 fps on the RX 6800 XT with every
  light shadowed.

## Shortfalls (honest)

- The look depends on two kit corrections (decisions 1 and 2) that are not in
  the layout file; without them the Unreal capture is clearly worse (holes in
  the rock, weak local lights, invisible dig).
- Unreal's default filmic tonemapper shifts the saturated lava towards yellow
  and darkens deep reds; the lava reads less "orange-pink crust" than in the
  Blender reference. A different tonemapper or grading would change that but
  the spec forbids a grading LUT.
- The rock top surfaces stay flat grey-black and the 4 m rock tiling is
  visible at the overview distance (a kit limit, same in every engine).
- The close camera does not show the dig at all, so the "after" close still
  differs from "before" only by flicker and camera movement.
- Performance is from the editor binary in `-game` mode, not a cooked
  packaged build; it is render-thread bound and slightly pessimistic.
- Unreal writes caches and profiling files outside the project folder:
  the shared derived-data cache (1.7 GB in `%LOCALAPPDATA%\UnrealEngine\Common\Zen`)
  and the CSV profiles in `%LOCALAPPDATA%\UnrealEngine\5.8\Saved\Profiling`
  (copied into the ignored `PerfRuns/`). These are engine-managed, not part of
  the repository.
- First start of the project compiled shaders (about a minute with 12 workers
  on this PC); later runs start in about 10 s.

## Open issues

- Director: decide whether the Unity build applies the same two kit
  corrections (4 pi local-light balance, two-sided rock) so the comparison
  stays fair, or whether the kit should be fixed at its source instead.
- `.uasset` / `.umap` are routed to Git LFS by `EngineComparison/Unreal/.gitattributes`;
  the Director commits.
