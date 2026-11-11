# UR-STYLE-SAMPLE-V6 — Worker result (Studio copy, summary)

Full result: external repository `C:/GameDev/Underreign`, `Evidence/UR-STYLE-SAMPLE-V6/WORKER_RESULT.md`
(with `perf_stats.txt` and `v6_perf_*.csv`). Worker: separate Claude Code subagent; mode Discovery, time-boxed;
2026-11-11, 20:33-20:55. `verify-worker`: PASS (receipt
`26628717b6a7f2e7f371560cc6ab8a7ff8cb6b41cc11531b8f21b6fc5d1bbd2b`). External HEAD at start `569edc4`; nothing
committed or pushed; `StyleSample/Creatures/BrandHoundVideo` not touched.

## Changes (new level `/Game/Maps/L_StyleSample_V6`; step 5's scans, layout and neutral grade kept)

- **Light**: fire / lava lights scatter much more in the volumetric fog (glowing haze around fires, shafts in
  the forge mouth), fog extinction 0.25 -> 0.45; 5 warm bounce spots from below in the chasm; 2 grazing rim spots
  from across the chasm + 1 behind the Heart; 6 small practical lights; a low room haze that only shows in fire
  light. No added fill.
- **Reflections**: wetter, smoother damp floor (`MI_V6_Floor`, WetRough 0.24 -> 0.12), smoother iron and brass
  (`MI_V6_Iron`, `MI_V6_Brass`), Lumen reflection quality 2.0 and max roughness to trace 0.6. Hardware ray
  traced Lumen reflections (hit lighting) were already the project setting; unchanged.
- **VFX** (Niagara, same route as step 2): forge sparks 22 -> 75 per s, new brazier sparks, dust swirls over the
  room, ash updraft and haze over the lava, thicker brazier and forge smoke, a second heat-shimmer sheet over the
  lava (sheets over fires dropped: dark edge-on bars in the close-up).
- Three AI-own rounds (round 1 milky fires and washed-out chasm -> reduced; round 3 dropped the fire shimmer
  sheets, added smoother metals).

## Proof (`C:/GameDev/Underreign/StyleSample/Captures/V6/`)

Stills `Stills/01..05_*.png` (1920 x 1080), 4K still `Stills/01_game_camera_4k.png`, side-by-sides
`sidebyside_game_camera.png` and `sidebyside_forge_closeup.png` (step 5 | step 6 | target),
`sidebyside_chasm_heart.png` (step 5 | step 6), move `06_camera_move_6s_1080p.mp4` (1080p, 30 fps, 6 s).

## GPU (game camera, RX 6800 XT, CSV profiler, capped)

| Run | GPU avg | GPU p99 | Step 5 avg |
|---|---:|---:|---:|
| 1080p Epic | 18.8 ms | 19.3 | 17.2 |
| 1080p High | 10.8 ms | 10.9 | 10.3 |
| 4K Epic (capped 10 fps) | 72.8 ms | 73.4 | 67.7 |

+1.6 ms at Epic, almost all reflections (Lumen reflections 2.8 -> 4.65 ms); lights and volumetric fog
unchanged; translucency 0.10 -> 0.21 ms; Niagara simulation 0.01 ms.

## Power safety

All runs offscreen, `t.MaxFPS 30` (4K `t.MaxFPS 10`), per-tick verified (stills / move max 30 frames in any
1 s, 4K still max 10, perf measured windows frame time >= 32.1 ms / 99.7 ms); no `-benchmark`, Movie Render
Queue, path tracing or window; other GPU load 1-12 % before each run, no other UnrealEditor.

## Weak points

Shafts are mostly glow halos from the game camera (distinct only in the forge mouth); dust / ash barely
visible at 1080p from the game camera and dark dots up close; shimmer only over the lava; chasm slightly hazier
and redder than step 5; floor sheen and flame colour still weaker than the target; no props replaced (Meshy
step later). Details in the external result.
