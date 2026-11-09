# HL-WAYS-STAGE1-DAY-WITHOUT-ROADS-V1-R3 progress

Status: resumed after the Human's correction (no immediate stop); work continues. Nothing pushed.

Resumed: slope stills reviewed (vergleich/hang_*), gravel captured (vergleich/kies_*, clips/K1), quarry comparisons (vergleich/steinbruch_*), clips H1/A1 of round 3; running: play_r2 (before), Unity EditMode (logs/editmode-after.xml), full dotnet suite (logs/dotnet-test-after-full.txt).

- verify-worker: PASS (receipt af9c4f59c9e4ed065adf50e3888fe6184e52577b5815d5675e79121442d26bd3).
- Game repo C:/GameDev/Hearthlands, branch main: interim commit 42a4be0 (on 7a45f6b), 29 files, allowed paths only
  (Core, Core.Tests, Runtime). No uncommitted change of mine remains in the game repo (ProjectSettings.asset and Wiki are
  the Human's, untouched). HDRP settings and Main.unity restored after every build (logs/hdrp-settings-rewritten-by-build.txt).
- Tests: dotnet ways tests 37/37 green (new pinned hash 1385786388383732086, settings version 3). Unity EditMode and the
  full dotnet suite NOT yet run on this commit.
- Build: Unity/Builds/HL-Game-ways-r3 (b3) compiles and runs, but it is an intermediate build (b3 contains the
  latest code). Starters written. Not yet declared final.

## Done (cause and fix, evidence in captures/)
1. Quarry: cause = radius 28 allowed only 14 of 300 quarry places of the start land (4 %, a strip at the ford); the menu
   sweep from the Human's start camera: radius 28 -> 27 green of 1218 screen points, 691 "no rock in reach"; radius 48 ->
   714 green. Fix: quarryReach 48 (farthest walk from the start land). Placed through the real tool code (ToolsAt), built
   35 s after the click, stones made (captures/quarry_r3, quarry_r2 = before).
2. Store: origin store and built stores are stores; producer and fire surplus (fire keeps want + 2) go to the nearest
   store within 24 tiles; stores are sources for sites, fires, workshops. Free game 11 min: store 32 logs, 10 game.
3. Overlap: core spreads idle waiting spots (0.45 tile); drawing keeps dwarves 0.42 apart (walkers sideways). Fix for
   walkers in line added in b3, not yet re-measured.
4. Logs 1.5x along their long side (DwarfLook.WareLong). Close-up needs a crop (screen position now logged).
5. Chop: cause = the ways game drove the work motions with whole ticks (10 per second); fix = ticks + fraction (GameClock).
6. Slopes: cut base (high side cut down, 0.45-tile slope, stone plinth on the low side, no fill). Three cases captured:
   captures/slopes_r3 vs slopes_r2 (spreads 0.16, 0.26, 0.42). Stills not yet reviewed.
7. Refused buildings (second woodcutter beside the first) drawn with their models via WorldView.ExtraFootprints
   (captures/play_r3/zweite_gebaeude.jpg shows both woodcutters and foresters).
8. Gravel: G now mixes the ground's gravel layer (max 0.35, patchy) into worn path cells; voxel pebbles removed. Not yet
   captured.

## Left (resume steps)
1. Read this file; verify game HEAD 42a4be0; no Unity on the main folder.
2. Review slopes_r3/slopes_r2 stills; run captures with the b3 build:
   - play_r3 again (separation fix), play_r2 with `-hlWaysR2Outlines -hlWaysNoStore -hlWaysSpread 0 -hlWaysR2Overlap -hlWaysR2Log -hlWaysR2Clock -hlWaysBase natural`;
   - gravel part (`-hlWaysBench -hlWaysPart gravel`).
   Scripts: logs/run-player.ps1, logs/run-build.ps1, logs/run-tests.ps1, logs/make_media.py.
3. Unity EditMode full suite (run-tests.ps1 -Name after) and the full dotnet suite; parity rerun (WaysR3ProbeTests,
   bench report); determinism tests are in the suite.
4. Make clips (chop 30 fps before/after cropped, yard 1x, store) and side-by-side stills into clips/ and vergleich/.
5. Final build if code changes; delete older series builds (keep ways-r2 and ways-r3); STAGE1_R3.md (German),
   WORKER_RESULT.md with the candidate list (git diff --name-only 7a45f6b..HEAD, ext: sha256 size); commit evidence.

## Launches so far
3 hidden batch builds on the main folder (b1 compile error fixed, b2, b3 exit 0); 5 minimised players
(quarry_r3, quarry_r2, play_r3, slopes_r3, slopes_r2), all exit 0, none left running. Details in logs/launches.txt.
