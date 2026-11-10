# UR-UNREAL-SETUP-V1 — Worker result

Unreal project for the prototype: greybox layers from the map file, layer
camera, HUD, headless captures. Project Underreign (DEC-041, DEC-043).
Worker: separate Claude Code subagent. Date: 2026-11-10. Engine: Unreal
Engine 5.8.3 (launcher build), Visual Studio 2022. Hardware: AMD Radeon RX
6800 XT, Ryzen 9 7900X3D.

## Gate

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker ... (Studio root)
PASS worker receipt e6e2bb9d47a29773c14877e87bae3833cb7f1e73a60425a4f4d7d8367f27b7bf
```

Run once before any change (exit 0). Changes only in
`C:/GameDev/Underreign/Game`, `C:/GameDev/Underreign/Evidence/UR-UNREAL-SETUP-V1`
and (Studio) `Artifacts/Underreign/Evidence/UR-UNREAL-SETUP-V1`. Nothing
committed or pushed. `SimulationCpp`, the planning document, `Simulation`,
`EngineComparison` and `Design` were only read. No downloads, no Fab content.
Every Unreal run was headless (`UnrealEditor-Cmd.exe`, commandlet or
`-game -RenderOffscreen -unattended`), one editor process at a time; no
window was opened. UnrealBuildTool ran with `-MaxParallelActions=8`.

Outside the allowed paths Unreal itself wrote engine-managed files: the shared
derived-data cache (`%LOCALAPPDATA%\UnrealEngine\Common\Zen`), CSV profiles
(`%LOCALAPPDATA%\UnrealEngine\5.8\Saved\Profiling\CSV`, copied into the
ignored `Game/PerfRuns`) and the UBT trace (`%LOCALAPPDATA%\UnrealBuildTool`).
Three diagnostic capture runs wrote into the session scratchpad only.

## What was built

| Task | Result |
|---|---|
| 1 C++ project | `Game/Underreign/Underreign.uproject`, game module `Underreign`, empty runtime module `UnderreignSim` (Core only) reserved for the port. `Game/.gitignore` (Binaries, Intermediate, Saved, DerivedDataCache, Build, Packaged, PerfRuns, Logs), `Game/.gitattributes` (`.uasset` / `.umap` to Git LFS). Renderer settings as in the comparison: Lumen GI and reflections on hardware ray tracing, Virtual Shadow Maps, Nanite, TSR. Built with `Build.bat` (`Scripts/build.sh`). |
| 2 Greybox from data | `AURGreyboxMap` reads `Simulation/Maps/cinder_hollow.map.txt` (own small reader `URMapData`, grids + `hints` room/grow/stair lines) and builds 13,303 instances in 52 instanced components of engine basic shapes: rock per layer (soil, stone, basalt, bedrock edge), gold veins, open and claimed floor, 1.9 m rock between the layers (UD-37), the old natural stair and the stair hint as fixed breakthrough points with spiral stairs (UD-47), the Heart, the Call-stone, the sinkhole, the room areas of the hints block. Colours: plan section 6. |
| 3 Layer camera | `AURLayerCameraPawn`: oblique top-down (pitch -58, FOV 45); focused layer sharp, layers above hidden, the layer below as a faint copy seen through 70 % opaque floors; R / F (also Page Up / Down, Shift + wheel) with a 0.25 s slide; W A S D / arrows / middle drag / screen edge pan; Q / E 90 degree turns; wheel zoom; Tab side view at the cursor, Shift + Tab turns the slice; Home, Backspace. Enhanced Input made in C++ at runtime (actions, mapping context and modifiers; no input assets). |
| 4 HUD | Slate in C++ (`AURHUD` + `SURHudWidget`): map name, current layer with name, clock (game time), gold placeholder (the map's start gold, labelled placeholder), view mode, a three-band layer strip with the entry, `@` and `(H)` marks, a key line. |
| 5 Proof | Stills 1920 x 1080 and a 150-frame 1280 x 720 sequence at a fixed 30 fps, written by `AURCaptureDirector` in an offscreen `-game` run (screenshots include the Slate HUD). Frame-time run 20 s. Key test through the game viewport. |
| 6 Docs | `Game/README.md` (build, run, keys, proof runs, structure, limits), this file, the Studio copy. |

Python editor script (`Game/Scripts/setup_assets.py`, headless commandlet)
made the two greybox materials (`Color`, `Glow`, `Opacity` parameters,
used with instanced static meshes), a uniform ambient cubemap from a generated
HDR, and the level `/Game/Maps/L_CinderHollow` with one map actor.

## Commands (Git Bash, from `C:/GameDev/Underreign`)

```bash
bash Game/Scripts/build.sh                 # Build.bat UnderreignEditor Win64 Development -MaxParallelActions=8
bash Game/Scripts/setup_assets.sh          # materials, cubemap, level (fresh checkout only)
bash Game/Scripts/capture.sh stills        # Game/Captures/*.png, 1920 x 1080
bash Game/Scripts/capture.sh sequence      # Game/Captures/layer_step_720/0000..0149.png
bash Game/Scripts/capture.sh inputtest     # UR_INPUT_TEST lines in Game/Logs/capture_inputtest.log
python Game/Scripts/check_captures.py Game/Captures
bash Game/Scripts/perf.sh 8000 perf_main && python Game/Scripts/perf_stats.py Game/PerfRuns/perf_main.csv 10 20
```

Playing it with a window: `UnrealEditor.exe Game/Underreign/Underreign.uproject
/Game/Maps/L_CinderHollow -game -windowed` or Play in the editor (not done
here: no window in front of the Human).

## Captures (`C:/GameDev/Underreign/Game/Captures`)

| File | Content |
|---|---|
| `overview_layer1.png` | whole map, Layer 1 Upper in focus: sinkhole, winding tunnel, two gold veins, old stair top |
| `overview_layer2.png` | Layer 2 Middle: Call-stone cave with the room areas (Nest lavender, Forge rust, Pantry green, Drill Hall teal), Call-stone, landing chamber with the stair, three veins, the white frame of the breakthrough point above the Heart pocket |
| `overview_layer3.png` | Layer 3 Deep: Heart in its claimed pocket with the Hoard area and the stair up, the rich vein |
| `side_view_y21.png` | side view y = 21 looking north: the three layers with the rock bands between them, old stair through the rock, landing chamber, Heart pocket, deep vein |
| `side_view_x20.png` | extra: side view x = 20 looking west: tunnel and sinkhole, Call-stone cave, Heart |
| `start_view_layer3.png`, `play_view_layer2.png` | extra: default play zoom |
| `faint_below_layer1.png` | extra: the Call-stone of Layer 2 seen faintly through the Layer 1 tunnel floor |
| `layer_step_720/0000..0149.png` | 5 s, 30 fps fixed step, 1280 x 720: Layer 1, one layer down at 1.0 s (frame 30), again at 3.0 s (frame 90) |
| `layer_step_720.gif` | the same sequence at 640 x 360 for quick viewing |

All captures were looked at. `check_captures.py`: all four required stills
1920 x 1080, 150 sequence frames 1280 x 720, none with a mostly black centre
(`capture_check.txt`).

## Frame time (`perf_main_summary.txt`)

20 s window (10 s .. 30 s after start), `-game` run of the editor binary
(Development, uncooked), offscreen, 1920 x 1080, screen percentage 100, Epic
scalability, VSync off, uncapped, the overview with the focus layer changing
every 5 s:

| Stat | Average | Worst | 99th percentile |
|---|---:|---:|---:|
| Frame | **4.60 ms (217.6 fps)** | 20.95 ms | 8.15 ms |
| Game thread | 0.93 ms | 1.71 ms | 1.30 ms |
| Render thread | 4.59 ms | 20.83 ms | 8.13 ms |
| GPU | 3.61 ms | 4.06 ms | 3.73 ms |

Largest GPU passes: TSR 1.06 ms, deferred lighting 0.75 ms. The worst frames
are render-thread spikes (10–21 ms, 17 frames over 10 ms); the other Worker's
`dotnet` processes were running at the same time.

## Key test (`input_test.txt`)

14 key presses injected through the game viewport (the full Enhanced Input
path): R, Page Up, R at the top, F, Page Down, E, Q, D held, W held, wheel,
Tab on, Tab off, R, Home. **All PASS.**

## Decisions taken inside the order (for the Director to check)

1. **Room areas from the hints block.** The map grid has no rooms; the
   order asks for room areas, so the `room` / `grow` lines of the `hints`
   block are drawn as painted plates on open floor. They are the bot's
   planned rooms, not the start state of a game.
2. **The stair hint is a fixed breakthrough point.** `stair 1 21 17` gets the
   same spiral stair through the rock; its upper cell is still stone, so
   Layer 2 shows a white frame on that rock top.
3. **Faint layer values.** Plan: "about 25 %"; art brief: floor opacity 0.80,
   70 % desaturation, 40 % brightness, 50 % fog. With those values nothing
   below was visible, so: floor opacity 0.70, brightness 60 %, fog 35 %, and
   the faint copy is lit by its own colour (the focused layer's rock shadowed
   it). All values are properties and command-line overrides.
4. **Layer change technique.** Each layer has a focused and a faint copy;
   a change only toggles visibility and requests a camera cut. Without the
   cut, the renderer's occlusion culling (from the previous frame, where the
   old layer covered the new one) dropped the newly shown pieces for one
   frame, and Lumen kept a ghost of the hidden layer for about 2 s.
5. **Exposure and glow.** Manual exposure (-0.3 EV), sun 2.4 lux, sky 0.55;
   the Heart's glow was lowered so it reads ember orange instead of
   tonemapped yellow.

## Operational notes

- One sequence run (13:52 UTC) drew the scene into the bottom-right quarter
  of the frame. It did not repeat in five later runs. Added: the capture
  director waits until the viewport has the requested size, and
  `check_captures.py` flags any image with a mostly black centre.
- Build errors fixed during the work: a local variable shadowing
  `AActor::Owner` (C4458), a missing `ApplicationCore` dependency for the key
  test.

## Open issues

- **No lava.** Neither the map format nor Cinder Hollow has a lava cell, so
  nothing is drawn; lava needs a format decision (new legend character) first.
- Knife-line caps on cut wall tops (art brief 8.2) are not drawn.
- Side-view cut faces of gold veins show the dark outline colour, not ochre.
- Edge markers and layer-strip symbols for intruders, heat and alerts
  (F-02.4) wait for the simulation; the HUD's gold is a placeholder.
- The map file is read from `Simulation/Maps` at run time; a packaged build
  must stage it (not set up). The game target (`Underreign`) was not built,
  only the editor target.
- `.uasset` / `.umap` go to Git LFS through `Game/.gitattributes`; the PNG
  and GIF captures and the generated HDR through the root `.gitattributes`.
  The sequence is 150 PNGs (about 115 MB). The Director commits.
