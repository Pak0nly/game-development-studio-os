# Independent review UR-UNREAL-HOUND-V1 (QA Lead)

Verdict: PASS

Reviewed from code, logs and stills only; neither Unreal nor Blender was started.

## Checks
1. Scope: all 38 candidate files match the recorded hashes (identity b534647a...). `git status` in C:/GameDev/Underreign shows only the order's paths changed or added: Game/README, SPIELANLEITUNG, capture.sh, the URPlayView, URCaptureDirector and URLayerCameraPawn sources, the new URHoundAnim, Content/Creatures, Game/Art, Captures/hound and Evidence. SimulationCpp and UnderreignSim are untouched, and there is no rule, number or map change.
2. Code: only creature type 0 (Brand-hound) takes the new path, and all other types stay greybox. The walk phase advances by the distance moved divided by the stride, so there is no slide; paused means DtGame 0, so there is no phase change and no turn. The bite starts once per fight with an intruder in reach, is cut when the hound moves, and blends back to idle. Missing assets give a warning log and the hound stays a box (null checks in LoadHound and DrawHound). Hounds not drawn are hidden and removed after 600 frames. The stand-ins and lineup are proof-only (command-line flag, or LineupLayer set by the capture director) and do not affect normal play.
3. Evidence: automation 7/7 Success, gentle start RESULT PASS. The build OK and the hound capture PASS are stated in the report. The logs folder has no separate log for the build or for the PASS capture run (only the stand-ins run, whose "bites 0" FAIL is explained in the report); this is informational only. The GameZoom still shows a real textured hound with ember seams standing on the floor beside a cinderling.
4. Open problems (walk play rate 6.5x / 13x / 25x, bite 3.47 s against 1 s hits, small and hard to read, corridor walls) are reported honestly and match the code and the order's anticipation. They are Human look decisions, not defects of the order.

## Informational
- The hound-capture PASS and the build output are not saved as log files in Evidence/logs.
