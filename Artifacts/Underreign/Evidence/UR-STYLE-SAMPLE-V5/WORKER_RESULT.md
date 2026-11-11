# UR-STYLE-SAMPLE-V5 — Worker result

Work Order: `Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V5/WORK_ORDER.md` (Studio). Worker: separate
Claude Code subagent. Mode: Discovery. Date: 2026-11-11. `verify-worker`: PASS (receipt
`4380dc0b8beddd1e1f415872ef7c3f4a3bd26fd3b8f0f16b9694e7a33f24c5a9`). External HEAD at start: `d19406d`.
Nothing committed or pushed. `StyleSample/Creatures` (parallel order) not touched. Includes the Human's
addition relayed by the Director: "neutralerer Ton ist besser".

## 1. Causes (evidence per cause)

Method: A/B stills of the step-4 level (`L_StyleSample_V4`) in one offscreen run, switching one setting per
shot (`Captures/V5/Diag/d01..d10`), `ListTextures` before the shots, CVar values logged before every shot
(`StyleSample/Logs/v5_diag.log`). Edge energy = mean of a Pillow edge filter over the floor (higher = sharper).

| # | Suspected cause | Finding | Evidence | Real cause? |
|---|---|---|---|---|
| 1 | Texture streaming not finished / under-requested | **Main cause.** After 300 frames (10 s) the 4096 px floor layout map was resident at **128 px** (15 cm per texel: blurred, blocky joints and wear masks), floor scans at 128 px, wall scan 512 px, forge bricks 64 px; 155 MB of 580 MB in memory. 600 frames changed nothing (edge energy 5.59 -> 5.74). The floor and the world-aligned scan materials sample in world space (custom HLSL), so the streamer derives their size from mesh UVs (the floor's UV spans 20 m) and never asks for more. Forcing full loads: all at full size, 551 MB, edge energy 5.59 -> 6.72 | `streaming_evidence.txt`, crops d01 vs d03 | yes |
| 2 | Chromatic aberration (`scene_fringe_intensity` 0.25) + film grain 0.15 | fringe offsets R/B on every edge (stronger toward the border); removing it (grain 0.06) edge energy 6.50 -> 8.95 floor, 3.75 -> 5.32 corner | d04 vs d05 | yes |
| 3 | Export path | step-4 move = 1280 x 720 WebP quality 82 + 640 px GIF with 200 colours: visibly pixelated; side-by-sides 2 x 2 scaled down | `Scripts/make_anim.py` | yes (move) |
| 4 | Anisotropic filtering | 8x; 16x: no measurable change at the game pitch (8.95 -> 8.68, within flicker noise); kept at 16x for the low camera-move angles, cost 0.04 ms | d05 vs d06, perf | minor |
| 5 | Screen percentage / TSR | `r.ScreenPercentage` 100, TSR, history already 200 % at Epic; no dynamic resolution | CVar log | no |
| 6 | Mip bias | engine view mip bias -0.3; -1 sharpens further (+22 % edge energy) but risks shimmer in motion, not applied | d08 | no (option) |
| 7 | Motion blur / DOF on the game camera | motion blur off (project default), game camera is a plain camera without DOF; forge close-up cine camera f/2.8 softened the near floor -> f/4 | ini, level script | close-up only |
| 8 | JPEG source of the prepared scans | the library sources are JPEG themselves; our re-encode is 39.6-40.7 dB (BC), 36.9 dB (normal) PSNR against them, below the in-engine BC1 / BC5 loss | PSNR check | no |
| 9 | Texel density of floor scans and layout map | scans 2048 px per 1 m tile (0.5 mm per texel), layout 4.8 mm per texel; game camera 14 mm per pixel at 1080p, so density is ample once streamed | arithmetic | no |
| 10 | HighResShot vs viewport grab | same sharpness (6.72 / 6.50) | d03 vs d04 | no |

## 2. Fixes (look direction kept: same scans, layout, material colours, light positions)

- `UnderreignStyle/Config/DefaultEngine.ini` `[SystemSettings]`: `r.Streaming.FullyLoadUsedTextures=1`,
  `r.MaxAnisotropy=16` (applies to every map of the sample). Verified in the step-5 capture: layout map
  4096 px, scans 2048/4096 px, 551 MB resident.
- New level `/Game/Maps/L_StyleSample_V5` (`Scripts/v5/level_v5.py` runs `level_v4.py` with exact substitutions):
  fringe 0.25 -> 0, grain 0.15 -> 0.06, forge close-up f/2.8 -> f/4.
- Neutral grade (Human addition), tuned in two A/B runs (`Captures/V5/Grade/g0-g4`; g1/g2 with a lower white
  balance turned blue and the fire white, rejected; g3 taken): ambient fill 0.45 cool blue -> 1.1 neutral warm grey,
  wet-stone sheen light 90 -> 340 cd and white (whiter highlights on wet slabs), white balance 6100 -> 6300 K,
  saturation only in shadows 0.68 / midtones 0.85. Warm light stays fire and lava only. Floor mean RGB (game
  camera, same crop): step 4 72/21/13 (saturation 202), step 5 83/46/36 (135), target 91/57/40 (145).
- Move export: `Scripts/v5/make_video_v5.py`, 1920 x 1080 H.264 MP4, CRF 12, 30 fps; stills lossless PNG.

## 3. Proof (`StyleSample/Captures/V5/`)

| File | Content |
|---|---|
| `Stills/01_game_camera.png` ... `05_game_camera_units_aids.png` | the five step-4 stills, 1920 x 1080 |
| `Stills/01_game_camera_4k.png` | game camera at 3840 x 2160 (separate offscreen run, capped at 10 fps) |
| `crops_100pct.png` | 100 % crops step 4 / step 5: floor near, floor far, floor mid with joints, chasm rock, forge blocks, floor at the forge |
| `crop_4k_vs_1080.png` | same floor region, 1080p (pixels doubled) vs 4K |
| `sidebyside_game_camera.png`, `sidebyside_forge_closeup.png` | step 4 / step 5 / target |
| `06_camera_move_6s_1080p.mp4` | camera move, 180 frames, 1920 x 1080, 30 fps |
| `Diag/`, `Grade/` | the A/B stills behind sections 1 and 2 |

## 4. GPU table (game camera, 1920 x 1080 unless noted, TSR 100 %, capped)

CSV profiler, 300 frames, first 90 dropped; AMD Radeon RX 6800 XT; same method as steps 1-4. Data:
`perf_stats.txt`, `v5_perf_*.csv`.

| Run | GPU avg | GPU p99 | Notes |
|---|---:|---:|---|
| Step 5, Epic (sg 3) | **17.2 ms** | 17.5 | all fixes; Lights 5.8, Lumen reflections 2.8, volumetric fog 1.7 |
| Step 5, High (sg 2) | **10.3 ms** | 10.6 | step 4: 10.5 |
| Step 4 map today, Epic, with the new ini | 17.0 ms | 17.6 | step 4 measured 16.7 before the ini |
| Step 5 Epic, aniso 8x | 17.1 ms | 17.5 | -> 16x costs 0.04 ms |
| Step 5 Epic, full texture load off at frame 2 | 16.8 ms | 16.9 | -> full load costs about 0.4 ms GPU and +396 MB texture memory (155 -> 551 MB); approximate, the ini had already started loading |
| Step 5 Epic, 3840 x 2160, capped 10 fps | 67.7 ms | 70.6 | 4K at Epic is about 15 fps on this card; Lights 24.0, Lumen reflections 19.4 |

Cost per fix: texture full load ~0.4 ms + 396 MB; 16x aniso 0.04 ms; fringe/grain off: none measurable;
neutral grade (brighter fill and sheen) about +0.2 ms (Lumen reflections 2.6 -> 2.8). Total vs step 4: +0.5 ms
at Epic. Render thread avg was 12 ms in all of today's runs (step 4: 8.3) including the step-4 map: a CPU
training job of another task ran in parallel (no GPU use), so the render-thread change is not from step 5.

## 5. Power safety

- Before every Unreal run: no other UnrealEditor (`common.sh`) and total GPU engine load of other processes
  below 25 % (Windows counters, logged 1-8 %). A CPU-only training process (`finder_hound.py`) was running;
  it did not use the GPU.
- Offscreen `-RenderOffscreen`, `t.MaxFPS 30` (4K runs `t.MaxFPS 10`), VSync off, no `-benchmark`, no Movie
  Render Queue, no path tracing, no window. Per-tick check: every 1080p run max 30 frames in any 1 s; 4K still
  max 10, 4K perf 10.0 fps from log stamps; perf runs 30.0-30.1 fps. Headless builds `-nullrhi`, shader
  workers 8, MP4 encoding 8 threads.

## 6. Honest weak points

- The full-load fix is a sample-wide project setting. A real game needs a streaming-correct setup for
  world-space materials (proper material texture-coordinate scales, NeverStream / a budget for the few
  world-mapped sets, or virtual textures); `FullyLoadUsedTextures` does not scale to a large level.
- The 30 % Icelandic Cracked Rock slabs still look crumpled / foil-like close up and in the 4K still; sharper
  textures make it more visible.
- The packed-ash patches (missing slabs) now read light grey in the middle of the room where the white sheen
  light hits the damp ash; the target has no such patch.
- Fire: the brazier flames read paler yellow-white than in step 4 (midtone desaturation also touches the flame
  sprites); the lava is unchanged and stays orange.
- Forge close-up: floor and blocks near the fire stay orange (lit by the fire, by design); the background
  rock is now visible grey-black but less warm-lit than in the target.
- At 1080p the game camera has 14 mm per pixel: fine stone grain cannot show; the 4K still shows it.
- Mip bias -1 would add more crispness but was not taken (shimmer risk in motion untested).
- GIF of the move is no longer produced (it was the pixelated one); the MP4 needs a video player.

## 7. Files

New: `StyleSample/Scripts/v5/*` (capture_v5.py/.sh, level_v5.py, build_v5.sh, probe_textures.py,
make_video_v5.py, make_sheets_v5.py, capture_job.json), `StyleSample/Scripts/jobs/v5_*.json`,
`StyleSample/UnderreignStyle/Content/Maps/L_StyleSample_V5.umap`, `StyleSample/Captures/V5/**`,
`Evidence/UR-STYLE-SAMPLE-V5/*` (this file, perf_stats.txt, v5_perf_*.csv, streaming_evidence.txt).
Modified: `StyleSample/README.md` (step-5 section), `StyleSample/UnderreignStyle/Config/DefaultEngine.ini`
(`[SystemSettings]`). No step-2..4 asset changed (git status). Studio:
`Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V5/WORKER_RESULT.md`.

## Viewing note

Scan textures and renders containing third-party scans were viewed locally in this Claude Code session only
(UD-85, DEC-025). Nothing was sent to any outside service or used for training.
