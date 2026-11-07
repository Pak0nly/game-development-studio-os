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

## Round 2 (HL-RIVER-TESTTAL-SAMPLE-V1-R2, 2026-11-07)

- verify-worker: `PASS worker receipt f1f9a4acc3d7225b6d95ae1b39877dc1863c4c67918515e34a1a55a302757d7a`, exit 0.
- Game folder HEAD at R2 start: `fc9b724` (as expected); status in `r2/logs/game-status-r2-start.txt` (only the known unrelated changes). No Unity process was running.
- Evidence of this round lies in `r2/`. Launcher: `r2/logs/run-unity.ps1` (same as R1: one hidden batch-mode editor on `C:\GameDev\Hearthlands\Unity` only).
- The sample water (`RtCourse`, `RtWater`) is kept as the Human accepted it; this round does not change it.

### Step 1 (done, run 1; committed with step 2)

- Main fall top: the raised turf blocks beside the curtain are gone (the face's top beside the fall now ends at the water). New `RtRocks.cs` `RtOutcrop`: grown rock cheeks from a height field, every stratum reads it at its own wandering offset (broken, stepped terraces, chipped edges), highest at the lip, sinking into the bank upstream and into the meadow outward, mossy tops with a grass edge towards the meadow. No hanging blade tufts on them.
- Pool: `RtRiver.PoolLining`: broken chains of boulders of different sizes on both sides from the cliff to where the ledge banks begin (overlapping, taller at the cliff), lower stones behind, small stones in the water, reeds, and per side a catalogue boulder, log and stump. Gravel is allowed in the pool zone again.
- Small fall: `RtSkin` grass skin raises the lower ground around the step (never steeper than 0.35 per tile from the higher ground) so the game's cut strip becomes a grassy slope; the bank stones beside the step stand clear of the ground (no flat mossy slab).
- Banks: earth fill behind the ledge until the ground reaches the meadow (no dark trench), a longer ledge-to-beach transition where each stratum ends at its own place, fewer hanging blade tufts (plateau a quarter of round 1).
- Fish: the game's jumping fishing-spot fish draw without shadow pass while the sample shows (material swapped in memory, swapped back when the sample hides); the sample's own fish are darker, smaller (0.72) and a little deeper.
- Capture program: moving clips at round 1's still views (fall_game, fall_top, fall_close, small_fall_game, small_fall_close, bank_close, lower_close) and two night clips.

### Runs and iterations (all hidden batch-mode editors on `C:\GameDev\Hearthlands\Unity`, rendered on the RX 6800 XT, exit 0)

- Run 1 (iteration 1 of 3): compiled first time. Cheeks read as rock (no grass blocks), pool lined, brown strips covered; but the cheeks ended over bare earth upstream, the small fall's skin looked darker than the meadow, the step's east top still a flat green slab.
- Run 2 (iteration 2 of 3): cheeks reach on into the bank (brown covered), darker mossier tops, finer strata wander; skin lighter and only where it rises clearly; small-fall gap in the banks smaller. The step's top beyond the water followed the ground but its dark turf now formed slabs on both sides.
- Run 3 (iteration 3 of 3): the step has no turf top any more (mossy rock instead), its rock kept behind the lip, shorter (hw + 2.0); pool stones a little mossier. Green slabs gone. Final pictures from this run.
- Operational recoveries used: 0 of 3. No player build. No process of another folder touched (no other Unity process was running during the runs).

### Step 2 (done, game commit `4618d90`)

- One local commit holds the final candidate (run 3's edits were written before the commit; run 3 then rendered exactly that state, `git status` of the sample folder clean after it).
- Evidence: `r2/after/` (MP4 H.264 round 1 vs round 2, 0.8-4.6 MB each; JPG sheets; `rt_log.txt`), `r2/logs/` (launcher, run logs, start state, candidate list).
- `ProjectSettings.asset` hash unchanged by the runs (same as at start); no file outside the sample folder changed.

## Present state (R2 finished)

- Round finished and stopped at the Human checkpoint. Self-directed iterations 3 of 3 used; operational recoveries 0 of 3.
- Game folder: commit `4618d90` on `main` (on top of `fc9b724`), not pushed; only the sample folder committed.
- Next (Human): judge main fall top, pool, small fall and banks from `r2/after/`; `SAMPLE.md` lists what still looks wrong.
## Round 3 (HL-RIVER-TESTTAL-SAMPLE-V1-R3, 2026-11-07)

- verify-worker: `PASS worker receipt 1349c4b317b734246bad60ebbe7bb4c2514a29e2926a5306a508078272227645`, exit 0.
- Game folder HEAD at R3 start: `4618d90` (as expected); status in `r3/logs/game-status-r3-start.txt` (only the known unrelated changes). No Unity process was running on the folder.
- Evidence of this round lies in `r3/`. Launcher: `r3/logs/run-unity.ps1` (same as R2: one hidden batch-mode editor on `C:\GameDev\Hearthlands\Unity` only).
- Scope: only the small fall (ground around the step, falling water). `RtCourse`/`RtWater`, the main fall, the pool and the banks elsewhere stay as they are.

### Cause found (reading, before the first run)

- Testtal's ground is the P2 ground: one Unity Terrain (`PaintedGround`, 8 samples per tile, eight painted layers, smooth normals) with the game's lush grass blades on top (`LushGrass`, fed from the painted heights and meadow weights).
- Round 2's `RtSkin` was a separate voxel body (20 voxels per tile) laid over that terrain: its slope is a stair of 0.05 steps (the fine stripes), its colours come from the river palette and it carries no grass blades (the lighter panels). It covered the cut instead of changing it.
- The brown patches at both ends of the step and the brown strip below on the west are the terrain's own painted earth: the upper river's bed tiles beside the step (dry beyond the sample's lip line) and the game's bank paint where the sample's ledge banks leave a gap at the fall.
- Plan: drop `RtSkin`; while the sample shows, reshape and repaint the game's own terrain grid around the step through `PaintedGround`'s public height and weight API (saved and restored when switching back to "Spiel"), and refill the game's grass blades there. Then the slope is the game's meadow itself (same texture, shading and grass).

### Step 1 (done, game commit `e11f5d8`): run 1 (iteration 1 of 3)

- New `RtGround.cs` (`RtStepGround`): reshapes and repaints the game's terrain grid around the step while the sample shows (saved and written back for "Spiel"), refills the game's grass blades of the 12 touched chunks. `RtSkin` removed from `RtRocks.cs`. Falling water: denser strands with particle noise that grows towards the foot, spills over the two lip stones, white water piling against them, a boil, mist, spray and foam rafts at the foot. Bank stones and reeds in the ledge banks' gap at the step. Capture block `r3` (round 2's small-fall cameras plus a top and a low view).
- Run 1: hidden batch editor, rendered on the RX 6800 XT, exit 0. 1592 grid points raised (max 0.51), 2727 texels repainted. Frame times: game camera game 6.29 ms, sample 6.10 ms; at the fall 5.98 / 5.98 ms.
- Look: the striped lighter panels are gone (the slope is the game's meadow with its grass); the west cut is a meadow slope. Still wrong: a thin brown strip on the lip line right of the curtain, a flat grey patch (rock paint) left of the curtain, brown bed at the far lower west, foam flecks too large (white petals), the strands smeared into one white sheet.

### Step 2 (run 2, iteration 2 of 3; game commit `d7ea9d0` together with the run 3 edit)

- Edits: rock paint only on the steepest new slope and at most 55 % (run 1's grey slab), the bare-ground test downstream of the lip line against the lower water, bed repaint reaches further downstream, smaller foam flecks and rafts, weaker strand noise.
- Run 2: exit 0. Grey slab gone, west end of the step reads as meadow and stones. Still: the brown strip on the lip line right of the curtain (the game's lower bed beside the curtain, where the sample's lower water is clipped to the curtain width: bare at any height).
- Run 3 edit: that clipped zone counts as bare ground (raised and repainted).
- Run 3 (iteration 3 of 3, renders exactly `d7ea9d0`): exit 0. The lower west bed is repainted; the thin brown strip right of the curtain on the lip line is still there (so it is not the bare lower bed; most likely the step rock's own end or the upper bed's edge; not solved within the three iterations). Frame times: game camera game 6.35 ms, sample 6.19 ms; at the fall 6.03 / 5.98 ms.

### Step 3 (done): evidence

- `r3/after/`: MP4 (H.264), round 2 left and round 3 right with the same cameras: `r2_r3_kleiner_fall_spielkamera.mp4`, `r2_r3_kleiner_fall_nah.mp4`, `r2_r3_kleiner_fall_wasser.mp4`, `r2_r3_nacht_kleiner_fall.mp4` (2.3-4.5 MB); `r3_kleiner_fall_flach_nah.mp4` (new low close view, round 3 only); sheets `vergleich_kleiner_wasserfall.jpg`, `r3_kleiner_fall_oben_und_flach.jpg`; `rt_log.txt`.
- Launches: 3 hidden batch-mode editors on `C:\GameDev\Hearthlands\Unity`, all rendered on the RX 6800 XT, all exit 0. No player build. No process of the Wege folder touched. `ProjectSettings.asset` hash unchanged. Operational recoveries 0 of 3.

## Present state (R3 finished)

- Round finished and stopped at the Human checkpoint. Self-directed iterations 3 of 3 used; operational recoveries 0 of 3.
- Game folder: commits `e11f5d8`, `d7ea9d0` on `main` (on top of `4618d90`), not pushed; only the sample folder committed.
- Next (Human): judge the small fall from `r3/after/`; `SAMPLE.md` lists what still looks wrong.
