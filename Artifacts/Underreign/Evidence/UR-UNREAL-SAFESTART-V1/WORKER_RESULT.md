# WORKER_RESULT UR-UNREAL-SAFESTART-V1

Gate: `verify-worker` printed PASS (receipt c73cbda4...) before any change. Nothing committed or pushed.

## What changed (external repository C:/GameDev/Underreign, all under Game/ and this Evidence folder)

| File | Change |
|---|---|
| `Game/Underreign/Source/Underreign/Private/URGameMode.cpp` | `ApplySafeStart()` in `InitGame`: `t.MaxFPS` 60 (clamped 10..60), `r.VSync 1`, all `sg.*` to High (never Epic); options `-URQuality=high/medium/low`, `-URMaxFPS=`, `-URResScale=`, `-URNoRT` (sets the two Lumen HWRT variables to 0 by code). Logs one `UR_SAFESTART` line. Applies to every start, not only the bat. |
| `Game/Underreign/Config/DefaultGameUserSettings.ini` (new) | `bUseVSync=True`, `FrameRateLimit=60`, all scalability groups 2 (High). |
| `Game/Underreign/Config/DefaultEngine.ini` | `[DevOptions.Shaders] PercentageUnusedShaderCompilingThreads=75`. |
| `Game/Play Underreign.bat` | `-URQuality=high -URMaxFPS=60`, `start /belownormal`. |
| `Game/Play Underreign (Schonmodus).bat` (new) | 30 fps, VSync, Medium, 75 % render scale, `-URNoRT -norayTracing`, 1600 x 900, same start panel, below-normal priority. |
| `URHUD.cpp` | Layer buttons: "1 Upper - Entrance", "2 Middle - Call-stone", "3 Deep - Heart" (button width 150 to 270 so nothing is clipped). |
| `URCaptureDirector.cpp/.h`, `Underreign.Build.cs` | Start check now logs `UR_START_CHECK PERF` (fps, GPU ms over 230 frames) and `SETTINGS` (cvars, scalability levels, ray tracing state, viewport, command line); the two size checks compare against the requested size (works for 1600 x 900). Modules RHI, RenderCore added. |
| `Game/README.md`, `Game/SPIELANLEITUNG.md` (German), `Game/Scripts/perf.sh` | Docs; perf.sh got a warning (it stays uncapped Epic on purpose, not for the Human's PC). |

## Proof (offscreen via the bats, `-URCapture=startcheck -URIntro`, one process at a time; logs `logs/default.log`, `logs/gentle.log`)

| | Play Underreign.bat | Schonmodus bat |
|---|---|---|
| UR_SAFESTART | quality high (sg 2), 100 %, t.MaxFPS 60, VSync 1, HWRT as project | quality medium (sg 1), 75 %, t.MaxFPS 30, VSync 1, HWRT off |
| fps (230 frames, 3.83 s / 7.67 s) | 60.0 | 30.0 |
| GPU ms average | 3.54 | 1.60 |
| sg.* | all 2, res 100 | all 1, res 75 |
| r.RayTracing / IsRayTracingEnabled | 1 / 1 | 1 / 0 (DXR off by `-norayTracing`) |
| r.Lumen.HardwareRayTracing | 1 | 0 |
| viewport | 1920 x 1080 | 1600 x 900 |
| UR_START_CHECK RESULT | PASS (0 failed) | PASS (0 failed) |

Before (UR-UNREAL-PLAYABLE-V1): about 136 fps, Epic, uncapped, 5.9 ms GPU. The GPU number in offscreen runs is the RHI frame cycle count and
is only indicative; the cap is what protects the card. Note the 4.2 ms cheaper GPU is partly the cap: the card idles between frames.
Both caps were reached exactly; no run exceeded 60 fps; no Epic or uncapped run was made.

Stills (looked at): `stills_default/start_intro.png`, `start_running.png` (1920 x 1080); `stills_gentle/start_intro.png`, `start_running.png` (1600 x 900).
Layer buttons are visible on the left of all four.

## Start load (task 3)

Cache was warm in all runs (shader jobs remaining 0, no shader compile in the log; DDC local + zen). A cold first start compiles shaders
on many cores (24 logical cores here; engine default keeps 50 % free). Measures applied: 75 % of cores kept free, below-normal priority for
the editor binary (the shader workers were already below normal). A cold-cache run was not forced (it would produce exactly the spike under
study); the effect of the 75 % setting on a cold start is therefore untested. The warm-up of the High and the Medium/no-RT permutations
is covered by the runs above (no new compile jobs appeared).

## Notes / open points

- A saved `Saved/Config/.../GameUserSettings.ini` can override the ini defaults; the code applies the values after load, so it wins.
- Hardware ray tracing stays on in the normal bat (project look, High); only the Schonmodus drops it. Say if the normal bat should also drop it.
- The Human's real window (focused, actual VSync on a monitor) was not run by design; offscreen the cap is by `t.MaxFPS`.
- Mouse use on the layer buttons was not tested (text only changed).
