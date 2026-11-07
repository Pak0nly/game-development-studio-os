# PROGRESS: HL-RIVER-TESTTAL-SAMPLE-V1

Status: **stopped by the Director (PC shutdown) during setup and reading. No candidate attempt has started.**

- verify-worker: `PASS worker receipt 59ca9a24f0da146f37eb47989249e47168bb390a0f83ecbbd6a67f97ce092c4c`, exit 0.
- Game folder `C:/GameDev/Hearthlands`: **nothing written, nothing committed.** HEAD at start is in `logs/game-head-before.txt` (a3c4b16) and status in `logs/game-status-before.txt`.
- No Unity editor or player was started. Nothing needs closing.
- Self-directed iterations used: 0 of 3. Operational recoveries used: 0 of 3.

## Findings from reading (not yet proven by a capture)

1. **Sideways flow, likely cause** (`Runtime/Presentation/WaterView.cs`, `Surface`). The current map's source is "the highest water tile on the map edge" of each body. On Testtal:
   - Body 1 (the brook on the plateau) touches the north edge, so it is probably right.
   - The main river body from the pool down to the small second fall (rows about 18 to 45) touches no map edge. So it has no source, every texel gets B = 0, and the flow is zero. HDRP (`WaterCurrentUtilities.hlsl`, `EvaluateAngle`: angle times influence times B) then falls back to `largeOrientationValue` = 0, which is a fixed world direction, i.e. sideways.
   - The lowest body touches only the south edge, at its mouth. So its "source" is the mouth and it probably flows upstream.
   - Proof still to do: log each game surface's decoded current map, and capture with `ws.debugMode = WaterDebugMode.Current` (HDRP draws arrows), plus a moving GIF.
2. **"Many small moving planes with gaps", likely cause.** The game's water mesh mixes whole-tile cells (vertices only at tile corners) with quarter cells in the shore margin and eighth cells on rapids tiles. That gives T-junctions, and the water's vertex displacement opens them into cracks that flicker as the ripples move. The sample's `RcWater.SurfaceField` has no T-junctions (every 1/8 cell is cut from the same field). Proof to do: count the T-junction vertices per surface, then a close GIF.
3. **Port facts** (`RiverKit/RiverCliffArt.cs`): `FallHalfWidth = 2.1` is a constant (fall about 4.2 wide). The dark strips come from the "Fall backdrop" mesh, and the falling water sits under the child "Falling water" of "River cliff (sample)". `Design`, `FinalHeight`, `LineTy`, `UpperLevel` and `LowerLevel` are public. `FootLevel`, `TopLevel` and `FrontTy` are private and can be reached by reflection, to rebuild the same strata face exactly.
4. The small fall is the step between the main river body and the lowest body at about row 45 (x about 20 to 27). It is not declared in `[waterfalls]`, so `BuildFallsAndRapids` draws it as the P2 "Rapids" particle curtain.
5. Fish: `UnitArtCatalog.Load()`, `ModelIndex("animal_fish_move")` / `"animal_fish_idle"`, each with a Mesh and a Material. Stumps and logs come from `VoxelForest.AddStatic("cat_oak_stump_1" ...)`; the logs are `cat_*_log_*` and the boulders `rock_boulder_*`.
6. `PlaytestGame` has public `TesttalMapText`, `TesttalPlaceText` and `TesttalPaint`. So the sample can feed it a filtered placement (old smooth `rock bankstone` lines removed along the new banks) without touching the map files.

## Plan for a successor (nothing of it is built yet)

Folder `Unity/Assets/_Project/LookTest/RiverTesttal/` (allowed paths only):

- `Runtime/Hearthlands.LookTest.RiverTesttal.asmdef`, with references to Core, Runtime and HDRP. Copy what is needed rather than reference LookTest.RiverCliff.
- `RtSample.cs` is the driver. It adds a `PlaytestGame` (StartMap TesttalFree, Look Art, AutoStart false, ShowDevHud false, the map, place and paint TextAssets) and calls `Boot()`. It has two modes: "Spiel" is the game unchanged; "Probestück" is the filtered placement plus `RtRiver`. `FrameOverride` calls `g.Frame` and then overrides the camera for close views. Night comes from `DayLight.Current`. Captures render the rig camera into a 1920x1080 RT; the GIFs use `Runtime.Presentation.Ui.GifWriter`.
- `RtCourse.cs` builds the course from the map's water tiles. It takes the row centres, smooths them, measures arc length and half-width, and projects points onto the course. The flow is the downstream tangent.
- `RtWater.cs` copies `RcWater.SurfaceField`/`Finish`. Each body gets one surface. The field is `min(level+0.03-ground, 1.3-dist to own tiles, signed distance to lower bodies' tiles; +0.4 under higher bodies)`, and the current map comes from `RtCourse`.
- `RtRiver.cs` builds the sample look:
  - It hides the game's `ArtGround.Water` and the port's "Falling water", "Fall backdrop" and pool foam.
  - Main fall: cheek strata, a copy of the port's `MakeFace` built with the same seed and the reflected Foot, Top and FrontTy. Only `Wet` (|u| < 0.99) and `TopCap` change, rising to the bank in the cheeks. Columns are limited to |u| 0.8 to 2.9. Then a fringe, a curtain 1.8 wide (one strand), and its own backdrop.
  - Small fall: an `RcStrata` step with a notch, `FallCurved`, a backdrop, crests, flecks and lip stones.
  - Ledge banks outside the port's stretch (`1 - RiverCliffArt.StretchK(ty)`), soft at fords, with gravel on the beaches, reeds, edge plants, stones, stumps and logs.
  - Ambient fish.
- `Editor/RtBuild.cs` copies `RiverCliffBuild` (scene, PlayBatch `-rtCapture dir`, PlayerBatch into `Unity/Builds/HL-RiverTesttal-*`).
- Run hidden in batchmode with the launcher pattern from `../HL-WAYPOINT-LANTERN-VOXEL-SAMPLE-V1/round3/logs/run-unity.ps1`. That launcher refuses to start when an editor already runs on the folder. Commit after each working step.

## Successor R1 (HL-RIVER-TESTTAL-SAMPLE-V1-R1, 2026-11-07)

- verify-worker: `PASS worker receipt 52e5c7334d0e416a4ec13669336f6306ec1ff05f7262ea17cf0a608ca7d0be3f`, exit 0.
- Game folder HEAD at R1 start: `a3c4b16` (as expected); status in `r1/logs/game-status-r1-start.txt` (only the known unrelated changes).
- Evidence of this round lies in `r1/`. Launcher: `r1/logs/run-unity.ps1` (hidden batch-mode editor on `C:\GameDev\Hearthlands\Unity` only; refuses when an editor already runs there).
- Decision: the sample references the accepted river sample's assembly (`Hearthlands.LookTest.RiverCliff`: `RcWater`, `RcLedge`, `RcGravel`, `RcFringe`, `RcStrata`, `RcVox`) and the game's `RiverKit` instead of copying them ("call or copy"); the waypoint lantern sample does the same.

### Step 1 (done, game commit `cc49f5a`): the driver and the "before" captures

- `LookTest/RiverTesttal/`: `Runtime/` (asmdef, `RtSample.cs` boots the game itself on Testtal and drives its frame with own camera poses, `RtCourse.cs` course from the map's water tiles, `RtFacts.cs` water facts, `RtProgram.cs` capture program), `Editor/` (asmdef, `RtBuild.cs`: `RtBuild.PlayBatch -rtCapture dir [-rtOnly a,b]`), the scene.
- Run 1 (`r1/logs/unity-run-1.log`): hidden batch editor, rendered on the RX 6800 XT, boot 24 s, exit 0. Before pictures and clips in `r1/before/` (MP4, H.264).
- Proven by capture (`r1/before/game_current_*.jpg`, HDRP current debug arrows): the middle reach (pool to the small fall) flows EAST (sideways, the fixed fallback direction), the lower reach flows NORTH (upstream). Finding 1 confirmed. The game has 3 water surfaces (by level).
- The small fall is the drop at tiles x 23-26, row 50 -> 51 (not row 45): the game draws it as the rapids particle strip on a brown cut wall with stepped brown blocks (`r1/before/game_small_fall_close.jpg`).
- Fix found for the facts: the bodies must be read from the art terrain's data (`ArtGround.Terrain.Data`), not the session's terrain (that gave 54 bodies). Fixed for step 2.
- HDRP fact (read in `WaterCurrentUtilities.hlsl`): the current map's blue channel multiplies the flow ANGLE, not the speed. The accepted sample wrote a blue below 1 (speed 0.55-1), which turns the flow partly towards east; the R1 sample writes blue = 1.

### Step 2 (done, game commit `b0adee5`): the sample's water and a first small fall

- Run 2: corrected facts: the game's middle reach (108 tiles) has NO current at all (no source on a map edge), the lower reach (39 tiles) flows upstream on 33 tiles; the game meshes have 123 / 323 / 105 T-junction vertices (cracks when the water moves). The sample's three surfaces have 0.
- Sample current proven with the HDRP current arrows (all along the course, downstream). Water look settings are the game's own (`ApplyDemoRiver`); only geometry and current differ.
- Small fall first version: still read as a straight strip; water spread sideways over the game's low cut strip.

### Step 3 (run 3 done, committed with step 4): narrow main fall, small fall in strands

- Main fall: the port's face rebuilt with the same seed (foot, top, front read from the port by reflection), wet recess and curtain half width 0.95 (port 2.1), rock cheeks, own narrow backdrop, crests, pool foam; the port's face, fringe, falling water and backdrop hidden in the sample. First look: narrow and closed, but the cheeks stood as tall square grass blocks -> lowered to low rock shoulders just above the water.
- Small fall: three strands split by two lip stones; first try had wide green step tops -> step now flush with the meadow, shallower.

### Step 4 (done, game commit `fc9b724`, together with step 3)

- Run 4: compile error (operational recovery 1 of 3, parameter renamed). Run 5: banks, fish, frame times. Run 6 (iteration 3 of 3): ledge earth filled down to the ground, water ends under the ledge, no banks on the cliff top at the main fall, upper water ends on the small fall's lip line, small step's top under the meadow.
- Evidence: `r1/after/` (side-by-side MP4 clips and JPG sheets, `rt_log.txt`), `SAMPLE.md` (German), `WORKER_RESULT.md` (candidate list, numbers, how to move it, what still looks wrong).

## Present state (R1 finished)

- Round finished and stopped at the Human checkpoint. Self-directed iterations 3 of 3 used; operational recoveries 1 of 3.
- Game folder: commits `cc49f5a`, `b0adee5`, `fc9b724` on `main`, not pushed; only the sample folder committed.
- Next (Human): decide which water; judge main fall, small fall, banks and fish from `r1/after/`. A successor would start from `WORKER_RESULT.md` "What still looks wrong".
