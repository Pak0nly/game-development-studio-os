# WORKER_RESULT: HL-PATHS-LOGISTICS-TEST-V1 (round 1)

Worker: Claude (Opus 5.5), separate Worker task `worker-paths1-323eaf08`. Mode: Discovery.

External test folder `C:/GameDev/Hearthlands-Wege`, branch `wege`: a3c4b16 -> **e683959**. One local commit, not pushed. `C:/GameDev/Hearthlands` and `C:/GameDev/Hearthlands-Zwerge` were only read; their `Library` and `Art/*/Generated` folders were copied into the Wege folder's ignored paths as a warm start.

The German note for the Human is `round1/ROUND_1.md`. Status: complete, stopped at the Human checkpoint. The Studio evidence is not committed: the order asks only for commits on `wege`.

## 1. verify-worker
`PASS worker receipt 308c9db8ca86fe518aaa8e15e05a5a8065919c78099040d6d03781e7d8b3c01c`, exit 0, run from the Studio root before any mutation.

## 2. Architecture (Proposal)
- The test starts only with `-hlPathsTest`. `GameApp.PathsTestStart` is a static hook; the PathsTest assembly registers it.
- The test boots Testtal through the game's own `GameApp.StartGame`, so the current look is complete. It places its fires and huts with the core's placing command (`PlaceBuildingCommand` with the debug flag, as the captures do), then holds the core still (speed 0, `FrameOverride`).
- Its own simulation `PathsSim` moves dwarves, wares, grass, paths and night. Roads are real core roads, so the game draws their ground and waypoint fires.
- It is not deterministic and is not saved: it is a look-and-feel test, not game rules.
- Runtime hooks are all default-off and inert without the test:
  - `WorldView`: `HideCoreUnits`, `ClockOverride`, `TreeHidden`, `FlagHidden`
  - `DayLight.Hour`: a running time of day built from the three accepted lights
  - `UnitView`: `LastBack`, `LastHand`, `LastScale`
  - `LushGrass`: `ExternalWear`, `SetWear`
  - `GameApp`: `PathsTestStart`

## 3. Results by concept part

**1. Fires as home and store**
- Three fires at the start: the Heart Fire (the Great Hall), the wood fire at 49,40 and the stone fire at 46,31.
- Every dwarf lives at one fire and stands in a ring there. Each fire has a store with per-ware shelves (24 for the Heart Fire, 20 for a small fire), shown as voxel ware heaps.
- Huts take their worker from their nearest fire. Production goes first to the own fire's store.
- New dwarves are lured to each fire with room every 60 s (NS-1: the times as before, per fire). If the slider drops, the newest free dwarf leaves.
- **Edge rule:** a new fire may have at most 50 % of its reach (5 tiles) outside the land. This is enforced in the tool, which shows a green or red ring, and in the start site "Neues Feuer" (34 % outside).
- New fires cost 6 logs and 4 stones (Proposal).
- Not done: fires are not drawn bigger.

**2. Fog, day and night**
- The day is 16 game minutes. The light moves smoothly through the game's accepted day, the hall sample's dusk and its night; the lamps and the night glow follow.
- Fog is HDRP volumetric fog, switched on for this camera only, plus a grid of 121 local fog volumes (6×6 tiles each). By day it is a thin ground mist. At night each cell's density follows the darkness of its cell, so the fog stays thin near fires, waypoint fires and lanterns. All fog values are Proposals.

**3. Desire paths**
- Tall grass and plants (new shader `Hearthlands/Paths/TallGrass`):
  - the game's meadow tufts drawn taller (0.15–0.30), plus flowers, rushes, tall bank grass and ferns from the plant atlas;
  - density in drifts, none in yards, on water or on roads.
- A step counts as one pass per walk on each cell of a fine grid (8 cells per tile, brush radius 0.15 tile), with the brush's best weight.
- How the grass and path look:
  - freshly bent grass lies flat in the walking direction and shows the light, dry tone at once, standing up again in 40 s;
  - from about 30 % of the visible passes the game's painted path layer fades in, and the short grass wears;
  - at 20 passes there is a visible narrow path, at 60 a firm one;
  - after 2 game minutes without use, a path grows over within 10 minutes.
- Walking speed rises from tall grass (0.52–0.66 tiles/s) to firm path (0.82) and road (1.0). The ford is 0.42, and slopes slow the walk.
- Planning is A* plus a cost-checked straightening; dwarves drift up to 0.42 tiles sideways onto a trodden line.
- Felling opens the way (trees block their tile). Rain and mud, and thorns, are not done; they are listed as later.

**4. From path to road**
- Tool: click the start and end of a path. The route takes the cheapest way over the own land through path tiles, and at least 70 % must be visible path.
- The road is split at existing flags and built as core road(s), so it only goes inside the own territory.
- Waypoint fires come with the road (the game's `RoadWaypoints`, 6 tiles), or "Zwerge setzen sie": a free dwarf walks to each spot, works 5 s and sets it. The final run built 3 fires with the road and 3 set by dwarves.
- Road cells never grow over and are the fastest ground.

**5. Two kinds of carrying**
- **Network:**
  - each missing ware is its own job;
  - the job goes to the nearest free dwarf of the nearest fire, who carries one ware on his back;
  - fire watch: one per fire;
  - only what is needed and fits is fetched;
  - stores issue at most one ware per 4 s;
  - network carriers keep to the own land.
- **Troop:**
  - the origin store is the "Trägerhaus";
  - routine: "Wenn 12 Stämme am Holzfeuer liegen, bringe sie zum Steinfeuer", with the amount adjustable, on/off, escort by day, and player waypoints;
  - one dwarf per two wares, with a back frame (new voxel model) and two wares;
  - it gathers by borrowing free dwarves, then walks as a closed column, may leave roads and land, loads, unloads and returns;
  - at night it always takes 2 escorts with torches.
- The priority switch decides who claims free dwarves first.
- Proposal: a routine keeps its amount at the source so it can accumulate.

**6. Night with torch bearers**
- A dwarf about to step into the dark (darkness = (1 − daylight) × (1 − land light) above the threshold, 55 %) waits at the edge for a bearer.
- The bearer is a free dwarf of his own fire. He walks beside him only on the dark stretches and is released where light takes over.
- One bearer may serve up to 4 dwarves while they are within 2.2 tiles of each other. Stationary outdoor work (felling, quarrying) also needs light.
- Waypoint fires and lanterns are light sources, so built light reduces the need.
- Proposals:
  - home walks need no light;
  - whoever waits 25 s and carries nothing gives the task back.
- The switch "Nur im Licht tragen": over 2 night minutes in the final run, torch bearers delivered 9 wares, "only in light" delivered 0.

**7. Map population**
- The wood fire has two woodcutters, a forester and a hunter (the Human's example); the stone fire has the quarry at the cliff.
- Sites are the edge fire, then a programme of sawmill, store, well, guardhouse, mill, smokehouse and brewery, at most two open.
- The Heart Fire's hall works use a stone every 75 s, so stones keep flowing.

**Comparison runs** (32 game minutes each, `round1/vergleich/`)

| Run | Delivered logs/stones/game | Sites done | Troop runs | Avg wait for a carrier | Fire without wood |
|---|---|---|---|---|---|
| small fire 4 (default) | 67/60/0 | 0 | 0 | 35 s | 1888 s |
| small fire 6 | 127/134/18 | 6 | 4 | 5 s | 614 s |
| small fire 8 | 160/147/22 | 7 | 6 | 3 s | 163 s |
| 4, only in light | 83/59/0 | 1 | 2 | 99 s | 1716 s |
| 4, troop first | 87/85/0 | 2 | 3 | 23 s | 681 s |

- With 4, the Human's concern holds: the hunter stays unstaffed, nobody carries at the wood fire, there are no bearers there at night, and the network jams.
- Felt right (Proposal): **6 per small fire, 8 at the Heart Fire.**

**Panel (German, right edge, IMGUI with the game's Alegreya Sans and Cinzel fonts)**
- speed (pause, 1×, 2×, 4×), time of day, night jump and morning
- dwarves per fire and fire watch, with the free count per fire
- path thresholds (visible, firm, grow-over) and the heat view
- road tool and the waypoint fire choice
- night rule, darkness threshold and fog on/off
- priority
- the routine
- the new fire tool
- name tags on/off

Messages and tool hints sit at the bottom left; nothing is in the middle of the view.

## 4. Asset inventory (game main a3c4b16 and the accepted samples)

**Used:**
- **Ground and water (Testtal):**
  - P2 painted ground and the edge skirt
  - short meadow grass (`LushGrass`) and the bank plants (`GrassField`)
  - HDRP Water System river with foam
  - the river sample's cliff, fall and bank section (`RiverCliffArt`), gravel and bank stones (`RiverArt`)
  - the deposit sample (`DepositSample`)
  - the P2 cliffs
- **Trees, rocks and buildings:**
  - voxel trees and rocks (`VoxelForest`) with the game's felling sequence, saplings and stumps
  - the outskirts forest
  - accepted tier-1 buildings: woodcutter, forester, hunter, quarry, store, sawmill, well and others
  - the hearth model
  - the Great Hall sample with its tablet
  - building sites (`HallArt.SiteEntry`)
  - smoke and workshop lights
- **Dwarves:** the new bodies (heavy and female), the accepted walk/run, idles and water idle, the work motions (two-axe felling, mining, mallet), and the tools.
- **Waypoint fire, lanterns and wares:**
  - the waypoint fire (`HsWayArt`) and the border lanterns with night glow
  - the hall kit's voxel wares for the heaps
  - the unit catalogue's carried wares
- **Light and the rest:**
  - `GameLook` art light and post
  - `DayLight` dusk and night, extended to a running hour
  - HallArt lamps
  - ambient life
  - the UI fonts

**Left out, and why:**
- The tutorial level map and its stand-ins: the river cliff and deposit samples exist only on Testtal.
- The tester UI HUD (`GameUi`) and the old road tool: the test has its own panel and tools.
- The classic look and the legacy P2 or old voxel trees.
- `DwarfCarriers` look test: status "Stopped, learning material" (A-1, 2026-10-28), not accepted.
- Wolves and troops: no combat in this test.

**New (in the voxel style, Proposals):**
- the tall grass shader and patches
- the torch
- the back frame
- a game (deer) ware
- the heat view
- the tool rings

## 5. Commands and runs (exit codes)
**Unity editor** (batch, hidden; Wege only; one at a time):

| Run | Exit / result |
|---|---|
| import-0 (Library warm-start) | 0 |
| compile-1 (missing using, fixed) | 1 |
| compile-2 | 0 |
| builds a–k (`run-build.ps1`) | all 0 |
| EditMode full | 2385 total, 2361 passed, 23 skipped, 1 failed (my own new test) |
| PathsTest fixture again | 4/4, after fixing the test key and a real counting bug the test found |

- The HDRP settings and `Main.unity` the builds rewrite were restored after every build (`logs/hdrp-settings-rewritten-by-build.txt`).
- The counting bug: a pass counted with the brush's first touch (weight 0.55) instead of its best. Every picture and comparison was then made again with build k; the earlier sets were deleted.

**dotnet core suite:** 2177 total, 2175 passed, 2 failed.
- `TheDefaultProfilesPlayExactlyAsBeforeTheLevers` and `TheBoomRunStaysBitIdentical` fail on computer-player golden hashes.
- Core and `Runtime/Session` are unchanged in this branch, so these come from game main a3c4b16 (the settler rule the tutorial round already reported). Not mine.

**Players** (minimised, windowed, 1600×900, `run-player.ps1`; each closed itself, exit 0; all rendered):

| Purpose | Runs |
|---|---|
| tries | try1, try2 |
| development checks | dev1, dev2, night1 |
| full capture (stopped by me after a bad road attempt) | full1 |
| full capture, rerun after the counting fix | full2, final, final2 |
| fires route | fires, fires2 |
| comparisons | bench ×5, twice |

The final evidence is from build k: `captures/final` and `vergleich/`.

**Tutorial:** unchanged in this branch; its tests pass in the full EditMode run. Not played through.

## 6. Captures
- **GIFs** in `round1/gifs/`, each under 15 MB, 34–50 frames, 720–860 px:
  - `b_erste_schritte_gebogenes_gras`
  - `c_trampelpfad_entsteht`
  - `d_pfad_wird_strasse`
  - `d2_zwerge_setzen_wegfeuer`
  - `e_tragnetz_zwei_feuer`
  - `f_tragtrupp`
  - `g_abend_bis_nacht`
  - `g2_fackeltraeger_nah`
  - `h_weit_tag`
  - `h_weit_nacht`
- The full-resolution film frames are in `captures/final/film_*`.
- **Stills** in `captures/final/` (`00`–`66`): day, paths, heat view, roads, network, troop, dusk, night, wide views, and night "only in light".
- Logs: `capture_log.txt`, `paths_log.txt`, `paths_stats.csv`.
- Iteration captures are in `captures/try*`, `dev*`, `night1`.
- The films B–F hold the hour at 10:30 (capture tooling) so the time-lapses stay in daylight.

## 7. Git verification
- `wege` HEAD `e683959e5cd548339f8a76eecfdca63488d23ab1`. Parent a3c4b16. Working tree clean. 65 files, all in allowed paths:
  - `Runtime/Presentation` (7 modified)
  - `Art/Shaders` (2 new and their metas)
  - `PathsTest` with `PathsTest.meta`
- Candidate list with `ext:` prefix, sha256 and size: `round1/logs/candidate-files.sha256.txt`.
- Ignored and uncommitted: `Unity/Builds/HL-PathsTest-r1`, the Library, `Art/*/Generated`.

## 8. Deviations and open items
- The core is held still; the test does not run game rules.
- Volumetric fog shows soft horizontal banding in the far wide view.
- In the game camera the tall grass reads only as a shaggier meadow.
- Path and road are both earth; the road is wider and has waypoint fires.
- The torch is held upright and has no motion of its own. The forester plants with the mallet motion.
- With the defaults (4/8, network first) the troop waited about 30 minutes for free dwarves in the film run.
- Roads cannot cross roads or a felled core tree's tile.
- Fires are not drawn bigger.
- Rain, mud and thorns are not built.
- The Studio evidence is uncommitted.

## 9. Later ideas (from the Human's message, not built)
- breaks at home and helping other fires
- a glowing item for training soldiers
- the carried Heart Fire ember (clay pot) as a light source

# Round 2: HL-PATHS-LOGISTICS-TEST-V1-R2

Worker: Claude (Opus 5.5), separate Worker task `worker-paths2-323eaf08`. Mode: Discovery. German note for the Human: `round2/ROUND_2.md`.

`wege`: e683959 -> **0a9f8ba** (one local commit, 19 files, all in `Unity/Assets/_Project/PathsTest` and `Runtime/Presentation/UnitView.cs`). Not pushed. Working tree clean. The Studio evidence is not committed.

## R2.1 verify-worker
`PASS worker receipt b2cfa115e4623b35afbb79585a74fb859ee4dcac919ab46393b8267e54c0c864`, exit 0, run from the Studio root before any mutation.

## R2.2 Changes by content point (Proposals unless fixed by the order)
1. **Paths merge and widen.**
   - Route search: a trodden tile costs up to 35 % less than its walking time (`PathsSettings.PathAttract`), and the smoothing uses the same cost.
   - The sideways drift onto a seen path goes up to 0.6 tiles.
   - Recent traffic per cell (`PathsTrample.Rate`, e-fold 120 s) widens the brush from 0.15 to 0.35 tiles radius between 3 and 10 passes per two minutes (`PathWiden`).
   - Cost (32 min, 6/8): carrier detour over the straight line 9.2 % against 7.1 % with round 1's paths (`-hlPathsAttract 0 -hlPathsWiden 0`). Deliveries 82/101/8 against 78/83/9. Tiles with a path at least 4 fine cells wide: 72 against 38.
2. **Fog.**
   - One `LocalVolumetricFog` over the map plus a 16-tile margin, with an Alpha8 `Texture3D` mask (192 x 38 x 192), rebuilt in six slices (about 15 ms in total, worst frame about 4 ms; captures rebuild it whole each frame).
   - Night: mean free path 0.32, layer about 2.1 deep, dark albedo, probe dimmer 0.35.
   - Light clears it with a noisy, moving edge; over water the clearing is half.
   - Day: drifting fbm banks, mean free path 3.0.
   - Fog quality set by hand: 192 slices, 12.5 % resolution, uniformity 0.85, denoising Both. No horizontal bands seen in the wide views.
   - Uncapped frame rate: wide view 86.6 -> 78.0 (day) and 86.6 -> 74.9 (night); close view 90.9 -> 84.3 and 87.6 -> 81.0.
3. **Torches.**
   - Own pool of up to 12 HDRP point lights (2600 lm, range 7, flicker) that clear the fog by 2.6 tiles.
   - `DwarfLook.TorchArm` (default off): a fixed right-arm hold (upper arm 50 degrees forward and 14 out, forearm 35 degrees up), set in `UnitView.TorchHold`.
4. **Defaults:** SmallDwarves 6, HeartDwarves 8.
5. **Troop.**
   - Its own house: a new `store` building (the accepted store model; no carriers' building exists) at 44,40 by the wood fire. Its store wants the routine's amount, and the network fills it.
   - The troop forms only when the wares are stored and enough dwarves are free (after 45 s with at least half its carriers). It gathers, loads, marches, unloads and dissolves at the target. Nobody is held while waiting.
6. **Building first.**
   - Jobs are sorted: sites 0, fire needs and troop house 1, producer-to-fire 3. A fire with fewer than 2 logs comes first (-1).
   - Builders are staffed first, also while material is on its way.
   - Producers stack up to 5 and pause. Sites fetch from the huts directly. Producer-to-fire jobs run only when no site misses anything.
   - The forester keeps the yards (troop house, hut doors, sites) free.
7. **Diagonal jitter.**
   - Double Chaikin smoothing and 4 % straightening slack.
   - The body faces along the line, turning at most 200 degrees per second.
   - The drift is decided twice a second and damped as an offset vector.
   - Over all walks (32 min, 6/8): 17.6 degrees of turning and 0.15 left-right flips per tile, against 88.5 degrees and 1.89 with round 1's walking (`-hlPathsR1Walk`).
8. **Lantern reflections: not achieved.** HDRP SSR at night costs about 1 fps but shows nothing from the steep game camera. It is a panel switch, default off. What it would take: a planar reflection probe over the river (expensive) or an additive glint strip under each lantern.
9. **Comparisons** (32 game minutes, `round2/vergleich/`):

| Run | Logs/stones/game | Sites done (of 8) | Troop runs | Avg wait | Fire without wood |
|---|---|---|---|---|---|
| R1 small 4 | 67/60/0 | 0 | 0 | 35 s | 1888 s |
| R1 small 6 | 127/134/18 | 6 | 4 | 5 s | 614 s |
| R2 small 6 (default) | 82/101/8 | 8 | 0 | 2.5 s | 766 s |
| R2 small 4 | 72/79/0 | 8 | 0 | 11.4 s | 1873 s |
| R2 6, building not first | 162/164/19 | 7 | 0 | 6.9 s | 143 s |
| R2 6, paths as R1 | 78/83/9 | 8 | 0 | 2.6 s | 1099 s |
| R2 6, walking as R1 | 90/95/8 | 8 | 0 | 2.1 s | 487 s |

- Site times from order to finish:

  | Run | Sawmill | Store |
  |---|---|---|
  | R1 small 6 | 856 s | 678 s |
  | R2 small 6 | 258 s | 292 s |
  | R2 small 4 | 287 s | 476 s |
  | Day-held film run | 256 s | 202 s |

- Deliveries count every hop. R2 skips the hop through the fire store, so the numbers are lower although more was built. Trees felled: R1 81, R2 84.
- The troop made no run in any comparison: under building first and fire needs the house fills late. In the day-held film run it filled at about 27 min, then ran once in 50 s with no waiting. This is reported as open.
- Iteration: the build f comparison showed fires starving (4450 s) and a traffic-counter test failure. The low-fuel exception, the troop house at priority 1 and full-pass counting followed. All final evidence is from build g.

## R2.3 Commands (exit codes)
- Unity (batch, hidden, Wege only, one at a time):
  - compile-1: 0.
  - Builds a to g: all 0. HDRP settings and `Main.unity` were restored after each build (`round2/logs/hdrp-settings-rewritten-by-build.txt`).
  - EditMode first run: 2387 tests, 1 failed (my new test, which exposed a real counting bug, now fixed). PathsTest fixture: 6/6.
  - EditMode final: 2387 total, 2364 passed, 0 failed, 23 skipped.
- The dotnet core suite was not rerun: Core is unchanged since round 1.
- Players (minimised, windowed, 1600 x 900, `run-player.ps1`; each closed itself, exit 0; all rendered):
  - look1, look2, paths, build, build2, build3, night
  - final runs with build g: final-paths, final-build, final-night, final-fps
  - five benches, run twice (the build f set is in `round2/captures/iterations/build_f`)
- The round 1 player was never touched. No Unity build was running in the other folders.

## R2.4 Captures
- `round2/gifs/` (16 GIFs, each under 14.5 MB; some keep every second or third frame to fit):
  - a_pfade_verschmelzen_zeitraffer
  - c_bau_saegewerk
  - d_bau_lager
  - e_tragtrupp_bildet_sich_und_loest_sich_auf
  - f_schraeger_weg_nah
  - g_nebel_tag_nah
  - g_nebel_tag_weit
  - h_abend_bis_nacht
  - h_nacht_weit
  - i_fackeltraeger_spielkamera
  - i_fackeltraeger_nah
  - j_fluss_nachts_spiegelung_versucht
  - vergleich_pfade, vergleich_abend_bis_nacht, vergleich_nacht_weit and vergleich_tag_weit, each `_runde1_runde2`
- `round2/vergleich_bilder/` (11 round 1 / round 2 pairs at the same camera).
- Stills and full frames: `round2/captures/final_*`.
- Media script: `round2/logs/make_r2_media.py`.

## R2.5 Candidate files
Both rounds' commits (a3c4b16..0a9f8ba), 67 files with the `ext:` prefix, sha256 and size: `round2/logs/candidate-files.sha256.txt`. All are in allowed paths. Builds `HL-PathsTest-r1` and `HL-PathsTest-r2` are ignored and uncommitted (the two newest of the series).

## R2.6 Open items
- The troop rarely runs (see above).
- Day fog banks look beige in the warm sun.
- Dusk fog is weak at 18:00.
- Night fog is dark blue rather than grey.
- The ford stays a dark patch.
- The fog edge lags while fast-forwarding.
- No water reflections.
- Torch light is white-yellow; the torch model is still a placeholder.
- The "Lager am Holzfeuer" site now stands by the hall (the troop house took its place).
- Fewer firm paths in the wide view than in round 1.
- Everything open from round 1 stays open.

## R2.7 Later idea (not built)
Upgradable fires (wood to stone and so on), so more dwarves can live at one fire without a new one.

# Round 3: HL-PATHS-LOGISTICS-TEST-V1-R3 and -R3B

Workers: `worker-HL-PATHS-LOGISTICS-TEST-V1-R3` (points 1-2, step 2 of point 3; paused for the PC shutdown) and `worker-HL-PATHS-LOGISTICS-TEST-V1-R3B` (Claude Opus 5.5; part A the night shift's fog in the test, part B points 3-7). Mode: Discovery. German note for the Human: `round3/ROUND_3.md`. Step log: `round3/PROGRESS.md`.

`wege`: 0a9f8ba -> 5ef96f6 -> 38c25e7 (R3) -> fast-forward to the night's 3c35489 (`origin/night/2026-11-06`, no merge commit) -> df2420f, 78c8b7e, 8c3506d, e77c3be, 18685d5, 873e7c4, a866817, **f1f795c** (R3B). Not pushed. The Studio evidence is not committed.

## R3.1 verify-worker
- R3: `PASS worker receipt 7315fa7c3b02446a0d73e7b2135738c21280aaade41b04bed5f6ca1941b56e60`, exit 0.
- R3B: `PASS worker receipt b0772e0a6aaff70a8d86d4e86360037c35fe281aefef2febac1b6dc9dbf57547`, exit 0, before any mutation.

## R3.2 Part A: the night shift's fog system in the test
- Fast-forward `wege` 38c25e7 -> 3c35489; `Tools/FogPrototype` and `Evidence/HL-NIGHT-2026-11-06-FOG-V1` not edited afterwards.
- Compile: `Hearthlands.FogSystem`, `.Example`, `.Tests` and the uncompiled R3 step 2 compiled with 0 errors on the first import (`round3/logs/unity-compile-r3b-1.log`). Compute shaders and the composite: 0 errors in the editor (`unity-compile-r3b-2.log`) and in the dx12 player build (one warning, `FogNoise.compute(42)` integer modulus).
- EditMode `Hearthlands.FogSystem.Tests`: 70/70 passed (`round3/logs/fog-editmode-results.xml`).
- Fixes (file, cause):
  1. `FogSystem/Runtime/FogSystem.cs`: in a player the fog found no compute shaders (AssetDatabase in the editor, else `Resources/HLFog`) and ran the CPU simulation without rendering (smoke run 1). Added the static `FogSystem.ShaderProvider`; the test hands the shaders over from `PathsTest/Resources/HL_PathsFogShaders.asset` (`PathsFogShaders`, made by `PathsBuild.EnsureFogShaders`).
  2. `FogSystem/Runtime/FogGpuTiming.cs` (new) and samplers in `FogSystem.cs` / `FogRenderPass.cs`: GPU timing (`HL Fog sim`, `HL Fog render`) for the Profiler numbers; no fault.
  - No HDRP glue fault was found: right way up, depth and terrain correct, exposure consistent (the glow unit was calibrated, below).
- Smoke: the night's `FogSystemExample` in the player (`-hlPathsTest -hlFogExample dir`, `PathsFogSmoke.cs`): renders on D3D12 (RX 6800 XT); `round3/captures_r3b/smoke/`, `clips/A0_nebel_beispielszene_nacht.mp4`.
- Wiring (`PathsTest/PathsFogBridge.cs`, from the night's `PathsFogBridge.cs.txt`): new fog on by default, `PathsFog` off (its haze and local fog disabled; `-hlPathsOldFog` brings it back); map bake with the drawn ground, water (fords too), water levels from the terrain, canopy of standing trees; every fixed light by kind (`PathsGame.LightKinds`: fire, Heart Fire, hut door, waypoint fire, border lantern, the test's fires outside the land) rebuilt when `Sim.Lights` changes; one torch handle per dwarf faded by the registry, removed only when the dwarf leaves; time of day, sun and moon from `DayLight` and the game's sun light; target camera = game camera. Default palette, no soft bands; Mondsilber, soft bands (4), weather (dense night, clear night, rain fog with the prototype clips' values) and the tier are panel switches; F9 = the fog's own panel.
- Look tuning (3 iterations, the cap), all in `PathsFogBridge.cs`:
  1. `LocalLightLux` 600 -> 1400 (the prototype's light unit at night: moon 420 lux / LightScale 0.30) and border lanterns `clearRadius` 0.8 -> 0.3 (the game rings its land with ~60 lanterns).
  2. `NightLift` 0.25 -> 0.4.
  3. Border lanterns `warmth` 0.5 -> 0.25 (0.35 after point 6).
  - Capture corrections: the fog jumps 120 s ahead (`SkipTime`) before each comparison picture; `PathsCapture.Scale` encoded films to sRGB twice (films of all rounds too bright), now linear.
- Same camera as the reference clips (focus (40,43) distance 34 pitch 45; (32,34) distance 100; (8,50) distance 40; torch loop (30,51) distance 22 with the prototype's loop and the torch out from 3 to 10.5 s; 20 frames per second, three times the time as the prototype): `round3/clips/A1..A6_*_spiel_oben_vorlage_unten.mp4`, stills `round3/vergleich_bilder/A_*.jpg`.
- GPU per tier (Profiler samplers, development player, 1600x900, D3D12 RX 6800 XT, night, reference camera; frame GPU with fog off 5.43 ms):

  | Tier | Fog sim + render (own samplers) | Frame GPU difference to fog off |
  |---|---|---|
  | Low | 0.25 + 0 ms (HDRP volumetrics not in the samplers) | 0.61 ms |
  | Medium | 0.09 + 0.43 = 0.52 ms | 0.45 ms |
  | High (default) | 0.13 + 1.24 = 1.38 ms | 1.28 ms |
  | Ultra | 0.20 + 1.50 = 1.70 ms | 1.53 ms |

  Fog CPU update about 0.2 ms. Not measured at 1440p or on a mid-range card.
- Build: `C:/GameDev/Hearthlands-Wege/Unity/Builds/HL-PathsTest-r3/` with `Wege-Test Runde 3 spielen.cmd`; `HL-PathsTest-r1` deleted; `HL-PathsTest-r2` kept.

## R3.3 Part B: round 3 points
1. Paths back to round 1 (R3 `5ef96f6`): PathAttract, PathWiden, Rate and the wider drift removed; drift 0.42 as round 1; round 2's diagonal smoothing kept.
2. Carrying troop off (R3 `5ef96f6`): code kept, `-hlPathsTroop` brings it back; the panel hides it.
3. Fires outside the land (R3 `38c25e7`, finished in R3B): reach flood fill from the fires' doors (fords walked, no water), refusal hints (water, far bank without ford, cliff/trees/water between, occupied, steep, too close); the ring and the hint come from `FireRefusal` (green / red with the reason); panel text. Testtal has no unreachable far-bank spot (the ford connects the far bank): the pictures show a river tile and the nearest unreachable spot (54,27, enclosed by trees) refused, and an outside fire at (40,59) built in about 100 game seconds (ordered 1760 s, done 1858 s).
4. Escort (`PathsSim.LightFor/EscortReady/RestLit/AheadOnPath/Refuge`, `WalkStep`, `BearStep`): the dwarf waits at a lit place until his bearer stands at the lead point ahead on his own path (0.9 tiles; it settles at 0.5), moves only while the bearer is ahead, the bearer is let go only when the rest of the way is lit, a dwarf caught alone in the dark walks to the nearest lit place within 10 tiles first. Measured in the close films: bearer ahead in 85 of 85 frames (b_3) and 96 of 96 (b_5), sideways offset 0.00, about 0.5 tiles ahead.
5. Torch: the round 2 cause was `BearStep` setting `Torch = false` the moment the served dwarf was released (also on a brief lit spot or a give-up), so the bearer walked home dark. Now the torch stays on while the bearer stands in the dark (out only in light); light 1300 lm (was 2600), range 10 (was 7), colour (1, 0.5, 0.18), 0.35 above the flame.
6. Glow: HallArt lamps x3 lumen x2 reach, border lanterns x12 lumen x2.8 reach and at least 480 lumen (Runtime hooks `HallArt.LanternLumenScale/LanternRangeScale/LanternMinLumen`, default 1/1/0), building lamps x3 x2.5, fires at night x1.8 x1.6, the test's lit ground: lantern 2.6 (was 1.5), hut 2.4 (was 1.6). In the fog the lantern and hut-door glow stay at the presets (0.85 made one bright band around the land).
7. Comparison (32 game minutes): 

  | Run (32 min) | Logs/stones/game | Sites (of 8) | Bearer calls | Light wait total | at lit places | in the dark alone | Gave up |
  |---|---|---|---|---|---|---|---|
  | R2 small 6 | 82/101/8 | 8 | 192 | 4876 s | - | - | 61 |
  | R3 small 6 | 93/93/11 | 8 | 115 | 6417 s | 4859 s | 1556 s | 0 |
  | R2 small 4 | 72/79/0 | 8 | 129 | 4483 s | - | - | - |
  | R3 small 4 | 78/80/0 | 8 | 60 | 6407 s | 4935 s | 1470 s | 0 |

  R3 small 6: escort waits 340, refuges 29, bearers released only with the rest of the way lit 155; site times sawmill 258 s, store 633 s, brewery 277 s.
  A refuge walk also while a bearer was on the way (`873e7c4`) released that bearer and raised the waits alone in the dark to 3531 s; reverted in `a866817`
  (`round3/vergleich/verworfen_zuflucht_mit_traeger`).

## R3.4 Commands (exit codes)
- verify-worker exit 0; fast-forward exit 0; editor compile exit 0 (`unity-compile-r3b-1.log`); FogSystem EditMode 70/70 (`fog-editmode-results.xml`); fog shader check exit 0 (`unity-compile-r3b-2.log`).
- Player builds `unity-build-r3b-1..13.log`, all "Build result: Succeeded", Unity exit 0; the HDRP settings assets and `Main.unity` the build rewrites restored each time (`hdrp-settings-rewritten-by-build.txt`).
- Players (all exit 0, `[HL-PATHS-CAP] DONE exit 0`, `logs/player-*.log`): smoke (twice), r3fog quick q1-q4, full1-2, final, final2, final3, r3b 1-5, bench 6/8 and 4/8 (three times, the last counts), night old and new fog. Rendering players: all (D3D12, minimised, windowed, closed by themselves).
- Full EditMode suite at `18685d5`: 2456 tests, 2433 passed, 0 failed, 23 skipped (`editmode-final.xml`); PathsTest + FogSystem at `873e7c4`: 75/75 (`editmode-paths-fog-final.xml`).
- Only the Wege folder's Unity was used, never two at once; no other process touched.

## R3.5 Captures
- Clips (MP4 H.264, yuv420p, faststart, each under 6 MB): `round3/clips/` A0-A7 (fog; A7 = old Unity fog over the new at night with torches, the Human's request via the Director), B1-B5 (part B).
- Stills: `round3/vergleich_bilder/` (A_* fog against the reference, B_* part B).
- Raw frames and logs: `round3/captures_r3b/` (`fog_final3`, `b_5`, `nacht_alt`, `nacht_neu`, `smoke`, earlier iterations `fog_q1..q4`, `fog_full1..2`, `fog_final..2`, `b_1..4`, film frames of superseded runs removed), benches `round3/vergleich/`.
- Media script: `round3/logs/make_r3b_media.py`.

## R3.6 Candidate files
All Worker commits of round 3 (5ef96f6, 38c25e7, df2420f, 78c8b7e, 8c3506d, e77c3be, 18685d5, 873e7c4, a866817, f1f795c; not the night's commits), 36 files with the `ext:` prefix, sha256 and size at the last commit: `round3/logs/candidate-files.sha256.txt`. All in allowed paths.

## R3.7 Open items
- Night fog in the village thinner than the reference; fog wispier (smoke-like) than the reference's soft banks; map-edge wall more transparent (crowns poke out).
- The border-lantern row lights the brook mist as one pale band (the reference has few lanterns).
- Border lanterns still cast only small pools even at x12 / at least 480 lumen; huts, fires and torches read clearly.
- The torch flame model still looks pale pink-white close up (the light is orange now).
- The torch-out clip shows less refill than the reference because the loop runs over little fog in the game.
- A blue untextured box west of the Great Hall (a building without art, probably the storehouse) predates this round; untouched.
- Testtal has no unreachable far-bank spot (the ford connects), so the "across the river" refusal cannot be pictured there.
- About a quarter of the light waiting is still alone in the dark (dwarves the night overtakes on the way).
- Fog cost measured only on the RX 6800 XT at 1600x900.
- Water, waterfalls and fish untouched (the parallel river sample's scope).

# Round 4: HL-PATHS-LOGISTICS-TEST-V1-R4

Worker `worker-HL-PATHS-LOGISTICS-TEST-V1-R4` (Claude Opus 5.5). Mode: Discovery. German note for the Human: `round4/ROUND_4.md`. Step log: `round4/PROGRESS.md`.
`wege`: f1f795c -> 55d63c7, 34d429b, 0f45db7, e1bfcd7, **5004a55**. Not pushed. The Studio evidence is not committed.

## R4.1 verify-worker
`PASS worker receipt 7cd54bbe2105625e43c79cd219fb8fa3013c81190aba07c4a8f173a6d922b5a1`, exit 0, before any mutation.

## R4.2 Part A: the river sample's water
- `PathsTest/PathsWater.cs`: `PathsRiverCourse` (copy of fc9b724 `RtCourse`), `PathsWater` (copy of `RtWater.SurfaceField` and the water part of `RtRiver`: bodies by water level, drops, inside field, lip dip, current from the course with blue 1, `WaterView.ApplyDemoRiver` on soft ground). Not copied: the sample's banks (`RtBanks.Edge`), narrowed main channel, small fall, fish. No LookTest reference.
- The game's water surfaces are hidden; its falls, rapids curtain, banks and bank foam stay; the 15 bank foam systems drift along the course (12 drifted sideways or upstream before). Panel switch and `-hlPathsGameWater` for the old water.
- Correction (e1bfcd7): the sample narrowed the lower water to the drop's width 1.6 tiles downstream (for its own small fall); with the game's rapids that left a square of bare bank; now only behind the lip.
- Measured (route `r4water`, `captures/water_3/paths_log.txt`): seams (T-junction vertices) game 551 -> sample 0; current at the 199 water tiles: game downstream 45, sideways 7, upstream 33, none (fixed east) 114 -> sample downstream 199; fog bake: 0 water tiles whose terrain level differs from their surface.
- Clips A1-A5 (same camera, game water above, sample water below; A2-A5 with the fog off because the day mist hides the water), stills `vergleich_bilder/A_stroemungspfeile_*` (HDRP current arrows).

## R4.3 Part B: the fog inside the land
- FogSystem: `FogLight.shield` (GPU `Heat.z`); `FogShieldHeat` (HLSL) / `FogSimulationCpu.ShieldHeat` (twin): clearing held to the full radius with a steep rim (smoothstep 1.12 r .. 0.8 r), a slight flicker of the radius (ShieldFlicker 0.06, ShieldFlickerSpeed 0.9) and dents that wander slowly along the rim (ShieldProbeDepth 0.35, ShieldProbeSpeed 0.05 rad/s); shields heat at full strength whatever their glow. Outside the map: static C G = `FogMapInput.OutsideAt`, applied in the march and the fallback only (never simulated, so it never drifts into the map): density at least OutsideDensity 5, thickness OutsideThickness 2.0.
- Bridge: every fixed light is a shield: fire 3.8, Heart Fire 5.2, waypoint 2.6, hut 2.0, lantern 1.4; lantern glow in the fog 0.45; fog margin 24 tiles (was 16). `-hlPathsNoShield` (with `-hlFogOutsideDensity=0`) gives round 3's clearings for comparison. Torches unchanged.
- Look iterations, 2 of 3 used: (1) margin 16 -> 24, outside thickness 1.6 -> 2.0; (2) full shield heat (glow 0.6 capped the lanterns' heat at 0.6), lantern shield 1.1 -> 1.4, lantern glow 0.6 -> 0.45.
- GPU per tier (route r3fog, 1600x900, D3D12 RX 6800 XT, night; own samplers / frame difference to fog off): Low 0.28 / 0.57, Medium 0.55 / 0.42, High 1.43 / 1.26, Ultra 1.75 / 1.52 ms (R3 build in the same session: High 1.38 / 1.26).
- Clips: B1-B4 before = R3 build (`HL-PathsTest-r3`, routes r3fog and r3night); B5-B9 before = R4 build with `-hlPathsNoShield -hlFogOutsideDensity=0` (route r4fog; these cameras do not exist in the R3 build).

## R4.4 Part C: nobody alone in the dark
- `PathsSim.Shelter`: the nearest light source within 24 tiles (anywhere if none), lantern +4 tiles, -1.5 tiles per dwarf already waiting there (max 3), a lit walkable spot around the light on three rings at the dwarf's own angle. `WalkStep.GoShelter`: whenever a waiting dwarf is alone in the dark (at most every 3 s), also while his bearer is on the way; the shelter walk keeps the bearer (`Dwarf.Sheltering`). Workers caught at outdoor work shelter and walk back. Escort fix: in-place work goes on with the bearer within 1.2 tiles (round 3 waited for a lead point that does not exist without a path).
- Iterations, 2 of 3 used: one refuge per walk left 1126 s alone in the dark after a first refuge; retry 6 s left 166 s; retry 3 s.
- Bench 32 game minutes (`captures/bench_r4_final_klein6`, `_klein4`, build 5004a55):

  | Run | Logs/stones/game | Sites | Wait alone in the dark | Wait at lit places | Gave up | Shelters (to others) |
  |---|---|---|---|---|---|---|
  | R3 small 6 | 93/93/11 | 8 | 1556 s | 4859 s | 0 | - |
  | R4 small 6 | 83/91/9 | 8 | 6 s | 7942 s | 0 | 43 (14) |
  | R3 small 4 | 78/80/0 | 8 | 1470 s | 4935 s | 0 | - |
  | R4 small 4 | 75/59/0 | 7 (brewery 50 %) | 4 s | 8483 s | 0 | 32 (9) |

  Walking alone in the dark on shelter walks: 134 s (6/8), 89 s (4/8). Bearer calls 71 / 22, releases with the rest lit 120 / 31.
- Finding (not changed, for comparability): `PathsSim.Update` resets `LightWaitEpisode` every frame for every dwarf not carrying a torch in light (the `else` binds to the torch check), so `GiveUp` never fires; "gave up 0" in rounds 3 and 4 comes from that.
- Clip C1 (route r4gather, `captures/gather_2`): three dwarves waiting at the hunter's hut light at 00:36.

## R4.5 Commands
- Editor compiles `logs/unity-compile-1.log`, `-2.log` exit 0. EditMode PathsTest + FogSystem 79/79 at 34d429b and at 5004a55 (`logs/editmode-paths-fog-final.xml`).
- Builds r4-1 .. r4-7 all Succeeded (`logs/unity-build-r4-*.log`); HDRP assets and Main.unity restored after each (`logs/hdrp-settings-rewritten-by-build.txt`). Final build `Unity/Builds/HL-PathsTest-r4` = 5004a55, starter `Wege-Test Runde 4 spielen.cmd`; `HL-PathsTest-r2` deleted, r3 kept.
- Players (all rendering, D3D12, minimised, windowed, exit 0, closed by themselves): r4water 1-3, r4fog 1-3 and no-shield 1-2, r3fog on the R3 build and twice on the R4 build, r3night on both, r4gather 1-2, benches (diag6, diag6b, 6/8 and 4/8 twice). Logs `logs/player-*.log`, chains `logs/chain-*.out.txt`.
- Only the Wege folder's Unity was used, one at a time; no other process touched.

## R4.6 Captures
- Clips `round4/clips/` A1-A5, B1-B9, C1 (MP4 H.264, yuv420p, faststart, 1.8-9.2 MB). Stills `round4/vergleich_bilder/`. Raw `round4/captures/`. Media scripts `logs/make_r4_media.py`, `logs/make_r4_clips.py`.
- Fog and water clips come from build r4-4 (e1bfcd7); the later commit changed only the dwarves' shelter rule and logging, not the fog or the water.

## R4.7 Still wrong (looked at every picture)
- Deliveries lower (dwarves wait longer at the light): 4/8 stones 59 vs 80, brewery not finished.
- A lantern gap fills in about 5-10 s at the brook (dense river mist), faster than "patient"; relit lanterns light that mist as a short pale patch.
- The dry plateau inside the land carries little fog, so creeping in is hard to see there.
- A thin strip beyond the 24-tile fog domain shows bare ground in the far top-left corner of the map-edge camera.
- The game's falls, rapids curtain (white strip on a red-brown band) and banks are unchanged; the new water is calm, the flow shows mainly in arrows and bank foam; at night the water by the ford fire is very dark.
- C1: the dwarves are small at the game camera's closest zoom.

## R4.8 Candidate files
All Worker commits of round 4 (55d63c7, 34d429b, 0f45db7, e1bfcd7, 5004a55), `git diff --name-only f1f795c..5004a55`, 25 files, all in allowed paths (`round4/logs/candidate-files.sha256.txt`, `ext:` path, sha256, size):

```
ext:Unity/Assets/_Project/FogSystem/Runtime/FogFallbackVolume.cs e5daa0714f86f5c9404f31240333fc5c066007af11c85bdccfb7a36be1157030 10920
ext:Unity/Assets/_Project/FogSystem/Runtime/FogLights.cs cfb8bed6972181583c575ccbc32366d2779012b1ec651bb25554cbe4944a2f95 18013
ext:Unity/Assets/_Project/FogSystem/Runtime/FogMapInput.cs cff8bf6ea86b8af6d4a1d4d1a9342a07a8eae1991167179a58acd9ae45670fab 29888
ext:Unity/Assets/_Project/FogSystem/Runtime/FogRenderPass.cs 58db7e8a94780edd85cf1861e547bf4c85a6e79982330fcdaf53da64752ecae5 28790
ext:Unity/Assets/_Project/FogSystem/Runtime/FogSettings.cs 4e22b4d3b356cae25c4a5903e620cb1b4f3c21702ac1bf0ebcbbc93b867ad8fb 16001
ext:Unity/Assets/_Project/FogSystem/Runtime/FogSimulation.cs 79d388df87ad424631cd08a435b411c6a34fb6a290b685bb048f34d79423b693 21038
ext:Unity/Assets/_Project/FogSystem/Runtime/FogSimulationCpu.cs df403a3f0adad68bae8d43ed717b756fa41cf9a2766d0959f5b99fae8e4fc000 24276
ext:Unity/Assets/_Project/FogSystem/Shaders/FogCommon.hlsl ac42862ac820a6ba0b239dce256451b5f63846dd3c8cd12ac57157e993195b5d 13846
ext:Unity/Assets/_Project/FogSystem/Shaders/FogFallback.compute 336bf4037ea157641aa2493253b443aeec83c36782b69cb26b4011031fb35cb5 2601
ext:Unity/Assets/_Project/FogSystem/Shaders/FogMarch.compute f0179804bcdc791c2abcce8e3fd3fd0fb024934f4328040d22041f8a89b6c101 16541
ext:Unity/Assets/_Project/FogSystem/Shaders/FogSim.compute ddba773b9d25f59f9502d836a0cd977b77b44439606e5988b508a7f42cca4ae0 14326
ext:Unity/Assets/_Project/FogSystem/Tests/Editor/FogShieldTests.cs bbbc79f2d4990c4f103af5e879ef9c4656152024c9d898b893c9f0c922255b7d 3945
ext:Unity/Assets/_Project/FogSystem/Tests/Editor/FogShieldTests.cs.meta 7cb80ca23513cbae8d674b7113556535931ab61fdd864add68d289fdc28ae826 59
ext:Unity/Assets/_Project/PathsTest/Editor/PathsBuild.cs 5a22427954ee8d4cea51e0b32adb67c0a95725bdc240e7da9ac1c038c77eb840 7260
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R3B.cs 0eeec86e74001a1691e00f081326ce490d15de2f7b3f219a3a98b6da2549a936 15403
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R4.cs 97c7eb74ed4b2a843bba116088d75ef197b53cafe703da4c5f40696ee6564c95 11751
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R4.cs.meta edce8b1385e05ac3a0c0ffece4415771d19dcf2c24e86f0cf1957d3a89482453 59
ext:Unity/Assets/_Project/PathsTest/PathsCapture.cs 7b890ea7c1a0d33627e398bf7d0534e6695051db7d1de6252080ef8b0351a7c6 17418
ext:Unity/Assets/_Project/PathsTest/PathsDwarf.cs d8d12a30b31a62fc5c1c544f823033e29e113042f97ec8ae7dc64acdcd9cc1b5 20676
ext:Unity/Assets/_Project/PathsTest/PathsFogBridge.cs cfa746e12e7f98a28f0c704767ad389c1c9493df09588f8cde8ac21c22319a88 15882
ext:Unity/Assets/_Project/PathsTest/PathsGame.cs 4159ccf4c0535436cae82ac5d8cb1155d34190ca018e9b0b9797ffe6b4b03c6f 39531
ext:Unity/Assets/_Project/PathsTest/PathsPanel.cs 22d66929f1092790c201997fb581d039892da141612ba24cb2e0e58475372446 19446
ext:Unity/Assets/_Project/PathsTest/PathsSim.cs 1a6e762fdd011f6416787e09c23f024eeb21f62ce26f59322398903a34c2422f 51194
ext:Unity/Assets/_Project/PathsTest/PathsWater.cs cbeb2e7bfe3bd563fa046b780fe4c5220116f562672d5d72b2cd5a74a1d5732b 32170
ext:Unity/Assets/_Project/PathsTest/PathsWater.cs.meta 181ef1e86bba74415685eedbc15e6116bf938e428f515947bfdbd8e1f2b6604d 59
```

# Round 5: HL-PATHS-LOGISTICS-TEST-V1-R5

Worker `worker-HL-PATHS-LOGISTICS-TEST-V1-R5` (Claude Opus 5.5). Mode: Discovery. German note for the Human: `round5/ROUND_5.md`. Step log: `round5/PROGRESS.md`.
`wege`: 5004a55 -> 8ec1897, 3aaeb61, 12a446e, ebcc429, **a1a070d**. Not pushed. The Studio evidence is not committed.

## R5.1 verify-worker
`PASS worker receipt b377eb231159b10667638fbb3d776762bbec5008f022418fb145655494b33818`, exit 0, before any mutation.

## R5.2 What was built
- Outside the own land (part 1): `FogKnowledge` carries an outland layer (0 inside, 0.6 first ring, 1 beyond) and a pile band (peak 2.2 tiles outside), RGBA32 texture; the climate targets blend to OutlandDensity 2.6 / OutlandThickness 2.4 by OutlandAmount = lerp(OutlandDay 0.1, 1, clamp01(night + 0.5 dusk)) and add PileDensity 1.4 / PileThickness 0.9 in the band (GPU `Targets`, CPU twin). The bridge builds the layers from the territory (chamfer distance, rebuilt on `TerritoryGrid.Version`). Day: WaterDay 0.35 (the river's share of fog by day), HeightScaleDay 0.8, DayFloor 0.2; BaseNight 1.1. Defaults of every new FogSettings field are neutral (0 / 1).
- Beyond the map (part 2): `P2Outskirts.KeepShare` (the test sets 0.1: 375 of 3803 belt trees stay). `FogMapInput.OutsideGround` (the outskirts terrain is the fog's ground beyond the map) and `SeaRing` 8 (the domain's outer ring blends to one level, `SeaGround`); the march continues beyond the domain through that uniform sea up to SeaDistance 1500 (`MarchSea`, at most 1.5 units of height per step); flow and edge light fade over the ring (`SeaStill`). Low tier (fallback volume) has no sea.
- Calmer fog (part 3): `FogSystem.TimeScale` = game speed (paused 0), up to 4 substeps per frame; light fades tick in fog time. Bridge `Calm` 0.4 on wind, gusts, river drift, drainage, vorticity, shield dents; FlowCycle 15. `DenseCalm` 0.85 (dense detail keeps a quarter of its broad octave), dense-hit refinement in the march (a long step landing in dense fog is re-walked in up to 6 sub-steps of 0.5), TemporalBlend 0.93.
- Lanterns (part 4): `FogLights.ShieldFadeOut` / FogSettings.ShieldFadeOut 40: a shield keeps its heat and shrinks its clearing over 40 fog seconds after its light goes out; relit at once. Together with the outland/pile layers the lantern line is the visible border.
- Panel (part 5): scale = min(height/1080, width/1920), width at most a third of the screen, body only scrolls vertically, rows wrap (`Choices`), buttons wrap their text with a max width; the window shrinks to the display at start (not in captures). Fit logged by route `r5panel`.
- Give-up fix (part 6): `PathsSim.Update` resets `LightWaitEpisode` only when the dwarf no longer waits.
- Look iterations: 3 of 3 used (DenseCalm/WaterDay/BaseNight; refinement, short sea steps, TemporalBlend, dry-land camera; flow fade over the sea ring, refinement cap). One part 5 correction (wide buttons).

## R5.3 Measurements
- Fog column (readback) at night: outside the land (8,40) 2.60, Heart Fire 0.34, brook (30,51) 0.61; at dusk outside 1.58; by day outside 0.32, brook 0.08.
- Lantern gap at the dry-land lanterns (40.5, 58.9), three lanterns out 2..50 s: after 0.23 until 25 s, 0.42 at 40 s, 0.76 at 50 s, back to 0.24 four seconds after relighting; before (round 4 fog) rises from 3 s (0.41 at 20 s).
- Motion (mean grey-level change per frame, `logs/clips-and-motion.txt`, before / after): land lanterns 1x 1.60 / 1.22, 4x 1.66 / 1.57, paused 1.55 / 1.10; map edge night 1x 1.31 / 0.50, dusk 1x 2.65 / 1.13; brook lanterns night 1.72 / 1.57.
- GPU own samplers (1600x900, D3D12 RX 6800 XT, night), Heart Fire camera / north edge camera 130, pitch 35: Low 0.25 / 0.25, Medium 0.64 / 1.70, High 1.58 / 3.68, Ultra 1.94 / 4.45 ms. Round 4's fog on this build: High 2.39 / 3.02 (the new march's refinement applies to it too; round 4 itself measured 1.43 at the Heart Fire).
- Panel (build r5-5): inside the frame at 1920x1080 (360x1064 px), 1600x900 (300x884), 1280x720 (240x704); body 323/263/203 px, widest row 327/267/207 (the 4 px left margin included: fits), scrolls (body 1516/1397/1246 px in views 1028/850/673).
- Bench 32 game minutes (`captures/bench_r5_klein6`, `_klein4`):

  | Run | Logs/stones/game | Sites | Alone in the dark | At lit places | Gave up |
  |---|---|---|---|---|---|
  | R3 6 | 93/93/11 | 8 | 1556 s | 4859 s | 0 |
  | R4 6 | 83/91/9 | 8 | 6 s | 7942 s | 0 |
  | R5 6 | 86/98/10 | 8 | 13 s | 4911 s | 70 |
  | R3 4 | 78/80/0 | 8 | 1470 s | 4935 s | 0 |
  | R4 4 | 75/59/0 | 7 | 4 s | 8483 s | 0 |
  | R5 4 | 74/65/0 | 8 | 4 s | 6492 s | 63 |

  Why round 4 delivered less: the shelter walks held waiting dwarves at a light until a bearer came, and give-up never fired, so lit waits rose to 7942 / 8483 s. With the fix they hand their task back after 25 s and are free again: lit waits fall, stones and game rise, the brewery finishes with 4 dwarves; logs stay a little under round 3.

## R5.4 Commands
- Editor compile `round5/logs/unity-compile-1.log` exit 0; EditMode PathsTest + FogSystem 87/87 at 8ec1897 and at a1a070d (`logs/editmode-paths-fog-final.xml`).
- Builds r5-1 .. r5-5 Succeeded (`logs/unity-build-r5-*.log`); HDRP assets and Main.unity restored after each (`logs/hdrp-settings-rewritten-by-build.txt`). Final build `Unity/Builds/HL-PathsTest-r5` = a1a070d, starter `Wege-Test Runde 5 spielen.cmd`. `HL-PathsTest-r3` deleted (r4, r5 kept).
- Players (all rendering, D3D12, minimised, windowed, exit 0, closed by themselves): look_1 (r3fog quick), fog_1, fog_2, fog_3, fog_r4 (r5fog), bench_r5_klein6/4, panel_1920/1600/1280 (build r5-4), panel2_1920/1600/1280 (r5-5). Only the Wege folder's Unity, one at a time; no other process touched.

## R5.5 Captures
- Clips `round5/clips/` (MP4 H.264, yuv420p, faststart, 1.3-6.9 MB): N1-N4, W1-W4, R1-R5, L1; round 4 fog above (`captures/fog_r4`: r5fog with `-hlPathsR4Fog -hlPathsOuterForest 1` on the round 5 build), round 5 below (`captures/fog_3`, build r5-4 = ebcc429; the last commit changed the panel only). L1 re-encoded at CRF 29 (20.8 MB at CRF 23).
- Stills `round5/vergleich_bilder/` (pairs, edge views night and day, panel at three sizes). Scripts `logs/make_r5_clips.py`, `make_r5_media.py`, `measure_motion.py`. Film frames of superseded runs (look_1, fog_1, fog_2) removed.

## R5.6 Still wrong (looked at every picture)
- A straight seam where the simulated domain meets the sea, clearest at the south edge at the far zoom, and a slightly streaked texture beyond it.
- At dusk the dense outland fog still shows bright and dark marbled ridges under the low sun (calmer than round 4, not smooth).
- By day the sea beyond the map is bright white: a white frame round the clear map.
- The creep into a lantern gap is clear in the numbers but subtle in the film.
- Low tier has no sea; the edge camera costs 3.7 ms on High (over the 3 ms target, inside 4-6).

## R5.7 Candidate files
All Worker commits of round 5 (8ec1897, 3aaeb61, 12a446e, ebcc429, a1a070d), `git diff --name-only 5004a55..a1a070d`, 24 files, all in allowed paths (`round5/logs/candidate-files.sha256.txt`, `ext:` path, sha256, size):

```
ext:Unity/Assets/_Project/FogSystem/Runtime/FogFallbackVolume.cs a759c812660b7f665831c99378cb67ad9a667ab80f75b25f050cf82207c7ff73 10929
ext:Unity/Assets/_Project/FogSystem/Runtime/FogKnowledge.cs 9dbdf819419402d971d27979a3f302210ccd217b30d979ad28d1e649c151eb9b 7427
ext:Unity/Assets/_Project/FogSystem/Runtime/FogLights.cs 8b0ecd703fa1ac5efd510e9451e8e9ef0ee9e0f69d02471999869833b5b44e6f 19957
ext:Unity/Assets/_Project/FogSystem/Runtime/FogMapInput.cs 1e4729ff04cccd6bcf11ed89bbb2d974e61e1b6689c1c06bbc6ae20adca6e8f9 33130
ext:Unity/Assets/_Project/FogSystem/Runtime/FogRenderPass.cs a5349aa4dc3d76d3832c192265762ea625933067bdb9349dad4df15fa057bebf 29743
ext:Unity/Assets/_Project/FogSystem/Runtime/FogSettings.cs 67871af831b2100aef8454afcd14d45e9c60bdaa7f42027936d03dc24d6b3e9f 18942
ext:Unity/Assets/_Project/FogSystem/Runtime/FogSimulation.cs 511708a4b2cb66ee16c15bae54bc69cf64a21c568e1a0cdf6d819c5451f950e3 21510
ext:Unity/Assets/_Project/FogSystem/Runtime/FogSimulationCpu.cs b94352ab50575a2a58e79292bd6cf514957fe93f804dceba8d46727da7565e8d 25714
ext:Unity/Assets/_Project/FogSystem/Runtime/FogSystem.cs f0f3f0f891f241fcfed05219044e80865f405df1dd7e6384b7e2d9fb59293db8 16766
ext:Unity/Assets/_Project/FogSystem/Shaders/FogCommon.hlsl 858d92bcd2f854a3be655c29622495a26aaae4faa5e4864c494cf13172f6db8d 14277
ext:Unity/Assets/_Project/FogSystem/Shaders/FogFallback.compute 875bb545d019d2f36d397beffe786dd7847bf4b149ba4ce8e2a1c6e74b843d95 2617
ext:Unity/Assets/_Project/FogSystem/Shaders/FogMarch.compute 3e4df085744c3098a33ae446222bedc25e5efd27bff77c11bce66ba977a351ea 21245
ext:Unity/Assets/_Project/FogSystem/Shaders/FogSim.compute bc16657090c788e6313745c98660f7acee97151903c6f1b36c14a3688e3d2e67 15254
ext:Unity/Assets/_Project/FogSystem/Tests/Editor/FogRound5Tests.cs ef6b8b18abe3974b19b204cd02d3d2a2a17f30c76bdb4231e0a5ef4b4461a45f 8447
ext:Unity/Assets/_Project/FogSystem/Tests/Editor/FogRound5Tests.cs.meta cc913065ec35bc40747751bb2f39b510ea74c182f93edddfeba6c635090395ee 59
ext:Unity/Assets/_Project/PathsTest/Editor/PathsBuild.cs 0fe6344f8234c2360cb61ce15bd834be5510d0074ff958dc3faf8d8019d4a1d1 7285
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R5.cs f15901962eec4025a3672f5ae52c84fd615d0179afb35e527e47ad70b8ea40b9 13695
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R5.cs.meta 715c30dd0986c3e677d02dcc17f5c27b5571d1b39ee4d3f3bfd089e17ce6ae93 59
ext:Unity/Assets/_Project/PathsTest/PathsCapture.cs ae20b9fe6a1e58db8ce41f515a73ed1725ea7544d2e42196450aba417fd634ae 17665
ext:Unity/Assets/_Project/PathsTest/PathsFogBridge.cs 5acebc0306fbe2e41e5481be3e0af54d406997ea4c1084d576f7c96ec436e992 23388
ext:Unity/Assets/_Project/PathsTest/PathsGame.cs 52d1601eb41a50b62bb2f3e14b31cf9e5ce4f89083492a755c11bcf872500714 41173
ext:Unity/Assets/_Project/PathsTest/PathsPanel.cs 9d138eb8c8016a73b921e0c2c60caa265b5b5893348f383d6f52769cf5f4255b 22047
ext:Unity/Assets/_Project/PathsTest/PathsSim.cs 9b0e14fdcde625acdc74ea1b066d72faf63b1bf8287c2517744e00083f514ebd 51413
ext:Unity/Assets/_Project/Runtime/Presentation/P2/P2Outskirts.cs 546c0a7e23055248e75abdc745fd2d8e03340d735bc08e3dbbbf12917b05a881 12426
```

# Round 6: HL-PATHS-LOGISTICS-TEST-V1-R6

Worker `worker-HL-PATHS-LOGISTICS-TEST-V1-R6` (Claude Opus 5.5). Mode: Discovery. German note for the Human: `round6/ROUND_6.md`. Step log: `round6/PROGRESS.md`.
`wege`: a1a070d -> f57de84, cc19d9e, a0bfdeb, **3c2f19e**. Not pushed. The Studio evidence is not committed.

## R6.1 verify-worker
`PASS worker receipt b1a4a84b28b0b96b3c7b399ccfebacf06222fa465f594fcd026afd41b0e81c26`, exit 0, before any mutation.

## R6.2 What was built (by content point)
1. Fuller, calmer fog, no glitter. Cause found by a diagnosis route (`-hlPathsDiag`, the Human's view at sunrise with each part switched on alone, `captures/r6_1/r6d_*`): round 5's in-place self-shadow (`TauLight`) measured the light's way from a flat lid at 0.8 of the layer with the slant down to 0.15, so under a low sun the optical depth rose by about 17 per unit of height: above the lid lit, below dark, and the ragged noise top crossed it in fine silver streaks that the march jitter made grainy. Grain (paused film, mean change per frame): round 5 0.885, soft self-shadow alone 0.503, shape/LOD/phase alone 0.90-0.93. Fixes: `FogSettings.LightSoft` 1 (lid at 1.05, slant at least 0.4, 0.7 of the optical depth), `NoiseLod` 4 (the noise fades to its mean where a march pixel is wider than its features: texture minification glitter at a far zoom), fuller shape (DetailScale 16, BroadBanks 0.85, Erosion 0.12, FlowStretch 0, DetailWarp 0.25, vertical 0.6), PhaseForward 0.5, EdgeLight 0.35; the wall beyond the map blends over 7 units with a ragged edge centred inside the map's edge (`FogMapInput.OutsideRamp`) and keeps 0.45 of its density by day (`FogSettings.OutsideDay`). Temporal reprojection checked: the remaining grain 0.5 is the march's jitter floor, no change needed.
2. Fog speed: factor 0.5 of round 5's motion (bridge `Calm` 0.2 instead of 0.4: wind, gusts, river drift, drainage, vorticity, shield flicker and probe speeds halved, flow cycle doubled to 30 s); the fog's time still runs with the game speed (2x/4x scale, paused still).
3. No fog over fires: the burn left about a sixth of the climate at full heat (Heart Fire column 0.34), which the detail turned into wisps lit by the fire; `FogSettings.HeatClear` 1 clears the fog in the picture where a shield's heat runs from 0.25 to 0.8 and more (march, dense-hit test and self-shadow).
4. Walking backwards: found with a measure in `PathsSim` (moving faster than 0.2 tiles/s while facing more than 100 degrees off the step), counted for this round's facing and for round 5's (`Dwarf.YawR5`, kept beside it): bearers (`BearStep`: facing the escorted way while overshooting their place or coming from the far side) and every reversal of a walk (turning at 200-240 deg/s). Fix: a turn of more than 90 degrees at 900 deg/s (`Dwarf.TurnAboutRate`); a bearer faces his step when it goes more than 75 degrees off the way. Films replay the same recorded walk drawn with both facings.
5. Outer-forest trees: `VoxelForest.KeepFillerOffMap` (the test sets it): no filler piece on the map's tiles (the filler band's 545 trees and every other filler form), scenic/placed trees outside the play area get their full form, no far filler swap on the map; 375 outskirts trees stay outside.
6. Worn ring: `PathsTrample.Worn` (picture only, `Look()`; walking and planning untouched): firmness up to 0.75 round each foundation (rounded corners, wobble, noise gaps, fuller at the door side), repainted every 3 s by `PathsGround` (the game's ground repaint wiped it).
7. Quarry: `PathsGame.QuarryRefusal` (never on stone, at least one free tile to it, stone at most 4 tiles away, own land, level, reachable, a free face tile, the core's check); stone = the core's rock and cliffs and the placed rock models with the filler band's clearance radii; tool `PathsTool.Quarry` with a green/red foundation outline and the reason in the message line (panel "Steinbruch setzen"); the test's quarry is placed by the rule (46,25; round 5's at 46,23 stood in the deposit) where the stonemason's face is nearest to the door; the stone pile lies by the face and a lamp lights it (with the pile at the door the bench's quarry made 56 instead of 94 stones).
8. Round 5's open faults: seam to the fog sea and the straight map-edge line improved (wide ragged blend); dusk marbling fixed (same cause as point 1); white frame by day fixed (wall 0.45 by day); map-edge cost fixed (High 3.67 -> 2.20 ms); fog sea on Low still open.
- `-hlPathsR5` brings round 5 back on the same build (fog values, facing, filler trees, no ring, round 5's quarry); its GPU cost equals round 5's measured values (High 1.57 / 3.67 ms): a faithful "before".
- Look iterations: 3 (outside ramp and day share, NoiseLod 4, ring strength and repaint; the wall's blend inside the edge and quarry placement with a face lamp; the quarry's pile at the face). Operational recovery: none needed.

## R6.3 Measurements
- Motion (mean grey-level change between frames 40 apart = 2 s; `logs/clips-and-measures.txt`), round 5 / round 6: the Human's view at sunrise 17.2 / 4.0, at night 5.6 / 0.9, map edge at dusk 15.4 / 2.8, land lanterns at night 1x 6.8 / 2.8 (paused floor 2.0 / 1.7).
- Fog over fires (mean change against the fog-free frame inside 0.6 of the clearing, 400 frames at three times the fog's time): Heart Fire mean/p95/max 3.18/5.58/7.76 -> 2.41/2.72/2.85; waypoint fire 5.94/7.87/8.57 -> 5.39/5.87/6.93.
- Backwards (route r6, about 15 game minutes of evening and night): 151.6 s with round 5's facing, 0.6 s with round 6's; bench 32 min: 6/8 355.0 -> 0.3 s, 4/8 339.2 -> 0.3 s.
- Trees on the map: round 5 548 filler pieces (band 545), round 6 0; outside 375.
- GPU own samplers (1600x900, D3D12, night), round 5 -> round 6, Heart Fire / north edge 130 pitch 35 / the Human's view 40 pitch 65: Low 0.25->0.24 / 0.26->0.24 / 0.26->0.25; Medium 0.63->0.46 / 1.67->1.06 / 1.01->0.62; High 1.57->0.77 / 3.67->2.20 / 2.22->1.06; Ultra 1.94->0.95 / 4.44->2.68 / 2.71->1.30 ms.
- Bench 32 game minutes (`captures/bench_r6d_klein6`, `_klein4`, build r6-8 = 3c2f19e):

  | Run | Logs/stones/game | Sites | Alone in the dark | At lit places | Gave up |
  |---|---|---|---|---|---|
  | R5 6 | 86/98/10 | 8 | 13 s | 4911 s | 70 |
  | R6 6 | 85/104/17 | 8 | 13 s | 5954 s | 76 |
  | R5 4 | 74/65/0 | 8 | 4 s | 6492 s | 63 |
  | R6 4 | 78/78/0 | 8 | 16 s | 5491 s | 68 |

  Superseded benches kept for the trace: `bench_r6_*` (quarry pile at the door: stones 57/49), `bench_r6b_*` (with the face lamp: 54/50), `bench_r6c_*` (placement by face distance: 55/52).

## R6.4 Commands
- Editor compiles `round6/logs/unity-compile-1..3.log` exit 0; EditMode PathsTest + FogSystem 87/87 (`logs/editmode-paths-fog-final.xml`, at 3c2f19e).
- Builds r6-1 .. r6-8 Succeeded (`logs/unity-build-r6-*.log`); HDRP assets and Main.unity restored after each (`logs/hdrp-settings-rewritten-by-build.txt`). Final build `Unity/Builds/HL-PathsTest-r6` (r6-8 = 3c2f19e), starter `Wege-Test Runde 6 spielen.cmd`. `HL-PathsTest-r4` deleted (r5, r6 kept).
- Players (all rendering, D3D12, minimised, windowed, exit 0, closed by themselves; chains `logs/chain-1..6`, ring runs by `run-player.ps1`): r6_1 (with the diagnosis), r6_r5 (before, superseded), ring_1..3 (route r6ring), r6_2, r6_r5b (before), bench_r6_klein6/4, bench_r6b_klein6/4, r6_3, bench_r6c_klein6/4, bench_r6d_klein6/4, r6_4 (after). Only the Wege folder's Unity, one at a time; no process of others touched.

## R6.5 Captures
- Clips `round6/clips/` (MP4 H.264, yuv420p, faststart, 0.5-8.4 MB): N1-N3, V1-V3, F1-F2 (round 5 above = `captures/r6_r5b`, round 6 below = `captures/r6_4`), Z1-Z3 (backwards; both halves from r6_4, the same recorded walk with round 5's and round 6's facing, 10 frames per second = real time).
- Stills `round6/vergleich_bilder/` (pairs: the Human's view at 4 times x 4 zooms, map edges, whole map and borders, worn ring, quarry; the quarry previews). Scripts `logs/make_r6_clips.py`, `make_r6_media.py`, `analyze_r6.py`. Film frames of superseded runs removed; the diagnosis frames (r6_1 r6d_*) kept.

## R6.6 Still wrong (looked at every picture)
- By day a faint straight line at the west map edge through the thin fog: the map's ground meets the outskirts' terrain there (a step and its shading), shown once the filler trees were gone; the wall now covers most of it.
- At night the outer fog is very even and dark: calm, but somewhat monotonous.
- At the far zoom the distant sea still shows faint round cells.
- By the waypoint fire fog still passes close to the clearing's edge (not over the fire).
- The backwards films Z2/Z3 are short (0.4 s stretches) and dark; Z1 (a bearer, 4.4 s) shows it clearly.
- The worn ring is subtle by design; behind large buildings (the hall) it is hardly visible.
- Low tier: still no fog sea.

## R6.7 Candidate files
All Worker commits of round 6 (f57de84, cc19d9e, a0bfdeb, 3c2f19e), `git diff --name-only a1a070d..3c2f19e`, 24 files, all in allowed paths (`round6/logs/candidate-files.sha256.txt`, `ext:` path, sha256, size):

```
ext:Unity/Assets/_Project/FogSystem/Runtime/FogMapInput.cs 31118d652aeda5a1514ed60f2e9aa4c1f736297b6f6550fb74948424aa305db3 33952
ext:Unity/Assets/_Project/FogSystem/Runtime/FogRenderPass.cs 3a298a4528d1ceffd1048db96f22c04f71225f26629990c726ab605ee4463fe6 30505
ext:Unity/Assets/_Project/FogSystem/Runtime/FogSettings.cs 4f228d6af730f71a2128a879ccd569def01c854262d14fb09029a0992aca28a8 20437
ext:Unity/Assets/_Project/FogSystem/Shaders/FogCommon.hlsl 6cbc99a1b1adba328eea0d9f0a6d963550b1178f33cbd3d9591c34acc859a021 14694
ext:Unity/Assets/_Project/FogSystem/Shaders/FogMarch.compute 95d6d4a9cba2947d53c2a9bc090e5bd70ef6dce292189d530788d105a67290c4 23041
ext:Unity/Assets/_Project/PathsTest/Editor/PathsBuild.cs a19e52c5a00a745a90d8634e4edf0f28ac7e7e427f1592e6f02637240f3fc2a4 7392
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R6.cs 1b11d8a5562dc45e8f5fa5a08be25bcce3ef3407037843d4d36386c051e174f4 25193
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R6.cs.meta 2b4a6aaf96e0b74d7325f8cc739526de6a6fe5ba498281bfc32f298062ecc468 59
ext:Unity/Assets/_Project/PathsTest/PathsCapture.cs 536ae1ca3239b0c55f31657c3f0c4ddb6d5d42a22e072d2dfd304f248dcc45a9 18526
ext:Unity/Assets/_Project/PathsTest/PathsDwarf.cs 9255810516ebe3b417a030893348e9f40928aab824f7ba3dc05ac3557eada07f 23251
ext:Unity/Assets/_Project/PathsTest/PathsFogBridge.cs 355dc1b0e4c572f78313aec9624ba0ccb8c187204eeee02bca6fffcc79e3cf52 27020
ext:Unity/Assets/_Project/PathsTest/PathsGame.Draw.cs 3808ff1fd3c3bf6c2c9c93dcbb60418e0b47605b0aec8b79037036c6613439f7 24174
ext:Unity/Assets/_Project/PathsTest/PathsGame.R6.cs 794e0768d8cff9988b75c94b5cce896a815dc43c60a337bdff9e264621809fa7 18561
ext:Unity/Assets/_Project/PathsTest/PathsGame.R6.cs.meta 889d3e1485df81da79c57174ff62d2f1504aa36a8f0eb5e64b7e94a96e11cbcc 59
ext:Unity/Assets/_Project/PathsTest/PathsGame.Tools.cs e270aa13fdb5e869e62b5b61f94894fd05fbf3b4d36e6636c727364bb1ddf5e6 21097
ext:Unity/Assets/_Project/PathsTest/PathsGame.cs 641e63cb0de8fe1df39224dbb1f5e4ff75bdff03dcef1e99da81d4d186c369e9 42949
ext:Unity/Assets/_Project/PathsTest/PathsGround.cs f6dac9a1984ab02736e5c96513db26d8369a0a50f2a39e0e0fcd7e8f02699538 9083
ext:Unity/Assets/_Project/PathsTest/PathsPanel.cs 7624ecdac701f5132ae1d0dd063cc73e792e8ae08db37262b8e6ca863ac00c94 22536
ext:Unity/Assets/_Project/PathsTest/PathsSim.cs d85b3db4267e371867ebe27e05fe825268aa15db194861e93dc20da3433b3149 54373
ext:Unity/Assets/_Project/PathsTest/PathsTrample.cs c93b0f3d1684db80a6ddb3b852565be2c731a42a61044b4d46c56a7c856591c7 10189
ext:Unity/Assets/_Project/Runtime/Presentation/PlacedArt.cs 91da79c4fb6f0a99105e937a4c1cb53c8afb7bd6661ac6b6d81096d5632fab84 26563
ext:Unity/Assets/_Project/Runtime/Presentation/ScenicWoods.cs 45ba1d4cd9a9359a01cfe3489c3b833a6705be2b5d6babdba8fd5b2ae181d070 15367
ext:Unity/Assets/_Project/Runtime/Presentation/Voxel/FillerBand.cs 0522ff4ec2590b13bbbf487ea8416d6f0b9dc0ac678e75c0f4d45d8e82a6fba2 9155
ext:Unity/Assets/_Project/Runtime/Presentation/Voxel/VoxelForest.cs 55d9b90efb050d968e908179d6ff747277fdedc9fcf974897d2fc767a762b232 20411
```

# Round 7: HL-PATHS-LOGISTICS-TEST-V1-R7

Worker (Claude Opus 5.5). Mode: Discovery. German note for the Human: `round7/ROUND_7.md`. Step log: `round7/PROGRESS.md`.
`wege`: 3c2f19e -> 54176d1 (`git merge main`), b8c25ba, **5638e38**. Not pushed. The Studio evidence is not committed.

## R7.1 verify-worker
`PASS worker receipt ed278efd4a42bd9debf047b24b23e619c76e6cf6bb18e13be4faf839a3f64642`, exit 0, before any mutation.

## R7.2 What was built (by content point)
1. River sample: `git merge main` (54176d1; `git diff --name-only HEAD~1 HEAD` = the 31 files of `LookTest/RiverTesttal` only). `IRtHost` (RtSample and the test's `PathsRiver` host `RtRiver`); `RtRiver.OwnWater = false` in the test and `WaterClip` (banks' water line, the main fall's narrowed brook, the lower water under a lip only across the drop over 1.6 tiles) applied to `PathsWater` (`PathsWater.Clip`): one water, 3 surfaces, 34 618 triangles, 0 T-junctions, current downstream on all 199 tiles. Built in `PathsGame.Boot` after the test's buildings (`ExtraUsed`: no stump/log/boulder on the test's fires, huts, work spots, sites, planned sites) and before the ground pictures, the water and the fog's bake; `Map.RefreshHeights` after the small fall's ground (36 tiles changed). Same counts as the sample's round 4: 2.59 M voxel triangles, 80 particle systems, 101 cover stones, 22 pool stones, 22 fish; built in 8.3 s. Capture tooling (RtSample, RtFacts, RtProgram, RtBuild, the scene) unused by the test.
2. No access: `PathsRiver.Close` closes land tiles next to the pool (8 neighbours, lip to lip + 4.6) and under lining pieces (24 tiles, `PathsMap.SetRiverBlocked`, part of `Walkable`), then a reach search from the Heart Fire's door: 0 tiles beside the pool reachable, nearest reachable tile 3 tiles from the lip; reach 2974 -> 2952 tiles; 0 doors/work spots/sites/roads on closed tiles, 0 lost from reach (`CheckRiver`). The banks' stumps, logs and boulders keep sites off their tiles (`PathsMap.Dressed`, `AddSite`). Quarry: stonemason 3.1 tiles from the nearest pool stone, 30.3 from the small fall's cover stones; stone fire 10.1 / 25.7; the sample's bank boulder at (44.5, 23.1) (on the quarry's stone face) and the pool's east end boulder (44.5, 22.2) left out as used tiles.
3. Arms: Zwerge `DwarfClean/Data` heavy/female 160/320 copied into `Art/Dwarves/Resources/HL_DwarfBodies`; the old bodies kept in `HL_DwarfBodies/Geruest`. The work motions (`work_v1`) already used the re-voxelised arms (`WorkSource` = Zwerge 320). `DwtModel.PinPivots` / `DwsFigure.ShoulderPin` keep the joints measured on the old bodies (heavy elbows measured on the slim arms, as HL-DWARF-ARM-REVOX-V1-R2); `DwarfBodies.Adopt` takes the old bodies' walk tables, idle, water idle and tool-hold turns. `PathsBuild.BodyCheck` (`round7/logs/bodycheck-5.txt`): every frame of walk (3 tables), idle, water idle and the six holds of both bodies at 320 and 160: largest turn 0.0000 degrees; joints unchanged but the heavy elbows (5.3/5.9 voxels at 320, 2.7/3.8 at 160). Without the pin (`bodycheck-3.txt`): joints up to 5.9 voxels, female skirt turns up to 36 degrees, holds up to 42 degrees. Bodies built in 4.2 s. `-hlPathsR6` draws the old bodies.
4. Fog, night, cost: the fog bakes the reshaped ground (the map's heights) and the terrain's water levels; falls, mist and spray filmed by day, at dusk and at night in the fog. Cost below; no detail reduction needed.
- `-hlPathsR6`: round 6 on the same build (no river sample, old arms) for the comparison.

## R7.3 Measurements
- Night, 1600x900, D3D12 RX 6800 XT, fog own samplers (R6 mode same camera): main fall Low 0.24 / Medium 0.47 / High 0.76 / Ultra 0.94 ms (R6 0.24/0.48/0.77/0.96); small fall 0.24/0.47/0.92/1.15 (0.24/0.49/0.94/1.19); north edge 130 pitch 35 0.24/1.05/2.20/2.67 (0.24/1.06/2.19/2.66). Frame GPU / CPU at High: main fall 5.91 / 6.25 ms, small fall 6.15 / 6.47, north edge 6.48 / 6.91 (R6 6.02/6.36, 6.12/6.43, 6.15/6.56).
- River parts on/off (same run, High): GPU +0.24 / +0.33 / +0.53 ms, CPU +0.25 / +0.32 / +0.56 ms (main fall / small fall / north edge).
- Bench 32 game minutes (`captures/bench_r7_klein6`, `_klein4`, build r7-1 = b8c25ba):

  | Run | Logs/stones/game | Sites | Alone in the dark | At lit places | Gave up | Backwards |
  |---|---|---|---|---|---|---|
  | R6 6 | 85/104/17 | 8 | 13 s | 5954 s | 76 | 0.3 s |
  | R7 6 | 86/108/10 | 8 | 11 s | 6064 s | 72 | 1.4 s |
  | R6 4 | 78/78/0 | 8 | 16 s | 5491 s | 68 | 0.3 s |
  | R7 4 | 76/69/0 | 8 | 9 s | 5889 s | 81 | 0.8 s |

## R7.4 Commands
- verify-worker exit 0. Editor batch: bodycheck-1, -2 exit 1 (compile error CS0103 `DwtModel`: missing using; run 2 repeated it, the scripted edit had not applied), bodycheck-3, -4, -5 exit 0; EditMode PathsTest + FogSystem 87/87 (`logs/editmode-paths-fog-final.xml`).
- Builds r7-1 .. r7-4 Succeeded (`logs/unity-build-r7-*.log`); HDRP assets and Main.unity restored after each (`logs/hdrp-settings-rewritten-by-build.txt`). Final `Unity/Builds/HL-PathsTest-r7` (r7-4 = 5638e38), starter `Wege-Test Runde 7 spielen.cmd`. `HL-PathsTest-r5` deleted (r6, r7 kept).
- Players (all rendering, D3D12, minimised, windowed, exit 0, closed by themselves; chains `logs/chain-1..5`): r7_1, r7_r6, bench_r7_klein6, bench_r7_klein4, r7_z, r7_r6_z, r7_z2, r7_r6_z2, r7_z3, r7_r6_z3. Only the Wege folder's Unity, one at a time; no process of others touched. Main and Zwerge folders only read.
- Operational repairs 2 of 3 (the compile error above). Look iterations 2 (the dwarf films' camera).

## R7.5 Captures
- Clips `round7/clips/` (MP4 H.264, yuv420p, faststart, 0.8-13.6 MB): H1-H3 main fall and pool (day near, night, night near), K1-K3 small fall, U1-U2 bank (round 6 above = `captures/r7_r6`, round 7 below = `captures/r7_1`); Z1-Z5 felling, quarrying, carrying, walking, idle at the fire (`r7_r6_z3` above, `r7_z3` below, the same dwarf).
- Stills `round7/vergleich_bilder/` (r7f_* day/dusk/night per camera, night without fog; r7z_becken_von_oben, r7z_becken_gesperrte_felder). Scripts `logs/make_r7_clips.py`, `make_r7_media.py`.

## R7.6 Still wrong (looked at every picture)
- Border lanterns stand in the water and on the lip at both falls (also in round 6; more visible with the new river).
- Day-fog wisps over the river, one lying like a sheet on the bank (also in round 6).
- From the sample: the dense stone heap left of the small fall, the even foam band at its foot, the ledge bank reading as a brown step close up.
- The bank camera at night shows almost only fog.
- Only the pool is closed for walking; the banks' stumps, logs and boulders keep buildings off but dwarves still walk through them.
- In the carrying and walking films the two runs drift apart after a few seconds (the closed pool changes some walks), so the bodies are not in the same place.
- 4/8 bench: stones 69 vs 78 in round 6 (not investigated).

## R7.7 Candidate files
All Worker commits of round 7 (54176d1 merge, b8c25ba, 5638e38), `git diff --name-only 3c2f19e..5638e38`, 60 files, all in allowed paths (`round7/logs/candidate-files.sha256.txt`, `ext:` path, sha256 of the committed blob, size):

```
ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/Geruest.meta 20de4c77bd985b2920b5f5aebd2ac7db7fa7d762801acc03d2c82b0eff063ec9 172
ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/Geruest/female_r2_160.bytes d58902fbe763ba313f6a2d7666e67d913bb8a3e2531665d3d34d197080336aba 13167
ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/Geruest/female_r2_160.bytes.meta 604f79ea458abc6193c98e0a7a214b48b5bc88c536703a740c01bc218e9800c0 158
ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/Geruest/female_r2_320.bytes e55e4629b0731ec95dec2d6a9b5fea840c7e7b4bd407a3c2e17829ac0f9727ce 59481
ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/Geruest/female_r2_320.bytes.meta 8beac99070f9960660ada0a9793fe0700e5f7dcc65e17a1a05f5c8073d2d1b99 158
ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/Geruest/heavy_r2_160.bytes f33cf6fef1a8b648e456b4840ebbe63468d242d877d917bd228ec61b5ad76cb6 16141
ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/Geruest/heavy_r2_160.bytes.meta aa287aa76929a9de452d7e298441906fe494ea851e911ddbb1acd649d5d2d525 158
ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/Geruest/heavy_r2_320.bytes c29884497b121fd57f8eae57732c8e16eb3c99fdcee073131ab9ed1f80ee9b44 73094
ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/Geruest/heavy_r2_320.bytes.meta 756ef40747f99091bd8a86eca517229ce2a26e055befb59f12d7781eec673f25 158
ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/female_r2_160.bytes a07acf3943176165036f3e05c28c855b61271ff97209e3c5ec7bae36e844970d 14696
ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/female_r2_320.bytes 7cacbca98c14ce005475c4015013d89e8efb1437a949d764fa15848f70df2c7c 67482
ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/heavy_r2_160.bytes 061d1d9741bcb7f666300a8db21b7562092fec58895e77461cbaae8afc3a4132 17603
ext:Unity/Assets/_Project/Art/Dwarves/Resources/HL_DwarfBodies/heavy_r2_320.bytes 992c942c0ab30639ad4d54260252b04219a65ba2c12925968bea1a8146a2d6f8 79737
ext:Unity/Assets/_Project/LookTest/RiverTesttal.meta 190e664f4f2e0b2ef6b0209958e76f5c7acca9bf4e4a7f1ba120d588318b9422 172
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Editor.meta 50b8527040098ddc5a2cac1aece7e0288e9b00b0b8263a1084ca379391faf167 172
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Editor/Hearthlands.LookTest.RiverTesttal.Editor.asmdef 7ff4e57ce4064f91609026bbfbe14e3cd0f13920703867bb82d66d561aee2166 670
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Editor/Hearthlands.LookTest.RiverTesttal.Editor.asmdef.meta 525d40d07ce29fe26366ceffadb05de3b2eede0dfabed918f28712f1da17a27a 166
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Editor/RtBuild.cs 537297d3c7d9f6c1c66eadf56f777610aad86c20a5bd6e5d24535f6c7a98e120 5244
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Editor/RtBuild.cs.meta a876c48de71e4f3636d16c73bcea04784e9f66cd0cd19de9729aa45b34d41239 59
ext:Unity/Assets/_Project/LookTest/RiverTesttal/RiverTesttal_Sample.unity 2e3cb332fece6774bd774ae80c08305366edad6b7e3301f93ebf20b3b6f3dd49 4873
ext:Unity/Assets/_Project/LookTest/RiverTesttal/RiverTesttal_Sample.unity.meta 929a44804ef35a82e303dfc09ae8fceb0d55b07149d6003585c6cc3a4ccee597 155
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime.meta f69e0f4f07636a4e395a4348241ed77aff9c86ba9ce733e70b0466e08facb89c 172
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/Hearthlands.LookTest.RiverTesttal.asmdef d0fa33afd1bb04a35e51392ea5d1b7a47cd698872a809d549ea1baebb6954880 609
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/Hearthlands.LookTest.RiverTesttal.asmdef.meta 6d64097151f905823a9428c2bb387fed072d08724dd58ae4bf91424047a92348 166
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtBanks.cs 2decc86408eacb8dbbbb34c7c33d8abc5bd37c17096b8ecde819992963b2948d 27616
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtBanks.cs.meta ad60a46fdb5041a0350971a4dd9e585413aba00ff42837f46f01c13589a78c62 59
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtCourse.cs 71408cde4f32fac0f560a1d47961e2ccf82f05e1136aa7b4bb597853cadff713 6444
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtCourse.cs.meta 9572bde6d89f6c6013ef8a9ca130d276215a4d04b6f213e208f81bc53ffaca6e 59
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtFacts.cs 2dd3b08b73e6877571cd39b4a8150cf9effa9df0b89059f43f4a909e4704ac72 9586
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtFacts.cs.meta 558aea94f3b00cfa9a036ae86448f42bec83c56f0b036978bd814a6f928349de 59
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtFish.cs 5776d830444853e85f48cde06dfb0d4b2b859971a0e9797562b7e8f113ede424 6297
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtFish.cs.meta 5184e38b653f8f56455303e6d02ba68710723e9cf559fa33f6482766d1fdca39 59
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtGround.cs 20b554ed92498117148c052198e693cd9b619ee0aa30f8fe6af79c42e2e91749 16040
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtGround.cs.meta cd57d97a3b35709241d4d95570ad281d556f7d43e80de8e6625b58ea09d0dd2c 59
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtProgram.cs 67bbab23230185eb220b3239712b1d276f7440884b9d15365a9091f31ff4be9b 8539
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtProgram.cs.meta 7b56fda500f94323720c5e9e4645fb6c90ea2242e79b4f03a5acbd4bb50cac98 59
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtRiver.cs 9c5cfe680b708b1b245f9a4827a01829be290fb3b147cbedb7cae96bed4f5112 87462
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtRiver.cs.meta 3abe233a33179f3b367693127985a8035270d6d800e6153e51bc9464a13d1349 59
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtRocks.cs 3fb5f2054675a38062f98b7c5d4da28dc48994a86bcdc8a3b90f34667ea38d42 7810
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtRocks.cs.meta c510351220dfd63ba5e3a63506344a5d94fb3826fbc999e0e663b4626f991a9c 59
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtSample.cs a610388ce4f81c3e1639c33337e340570097959ffdca435599e9f8090349d499 10578
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtSample.cs.meta ecdbb93d5053726adc2589959ffec6a095f437872cfb45de256293424421bcac 59
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtWater.cs 395a1d7a04df482b7925e8238659952c148fc6abeceb37b140c412106c7d9612 7495
ext:Unity/Assets/_Project/LookTest/RiverTesttal/Runtime/RtWater.cs.meta d0283116ce0b2fd12a4841bfdb68f30861264a34b8bcbaa6d6e76b449a1cee5d 59
ext:Unity/Assets/_Project/PathsTest/Editor/PathsBuild.cs 393549825026b7ea80987973f110ce34e9fb6c7cd670bfd610deccf0870a6d2d 13443
ext:Unity/Assets/_Project/PathsTest/Hearthlands.PathsTest.asmdef 85c449ada57943e8b8b0b93e162d55b2525899bff54f54ff59ce021634cec11d 703
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R7.cs 30e9962f70d7cbc69e7197de2fb3af0f8ca84f35f2b4bc01e84def2ac4eb5332 10682
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R7.cs.meta 554498c1001f6afc3568dfea1c9aeef766489ae299da4bb4e3cbfba783a8d39a 59
ext:Unity/Assets/_Project/PathsTest/PathsCapture.cs e798e8ef11b43f181059b2482b4e42ff072d369a77720f84120ec0392b34fde8 18549
ext:Unity/Assets/_Project/PathsTest/PathsGame.Draw.cs 41ca2098caee188d7bb7973e8e4e6c4eeec7d8c38f4e8c9be96030250eecadaf 24849
ext:Unity/Assets/_Project/PathsTest/PathsGame.R7.cs 265661041772f86cd9c045513ca71d76f412d4dc367592d6527f786014dff897 6791
ext:Unity/Assets/_Project/PathsTest/PathsGame.R7.cs.meta 2d7f9da5242222347c34d3297741a682ef76e25a8d81489a1608700a9dde3a4d 59
ext:Unity/Assets/_Project/PathsTest/PathsGame.cs 37dc642a23f0f2fc407bb0c5052c95eb5eb7b0441984ed04f8307eae3079f222 44305
ext:Unity/Assets/_Project/PathsTest/PathsMap.cs 0dbc882fafdc3bbe98a35ce768d6894e9783fc5e08bba48f04476d0d23f54654 8278
ext:Unity/Assets/_Project/PathsTest/PathsRiver.cs 04da6d3fa318ed3fb18d2a7bff941d3f95f38731d1565c0f760e19cffc302fe4 10364
ext:Unity/Assets/_Project/PathsTest/PathsRiver.cs.meta 1deb88a0510985a8fe86c96643fe9d38235011b2d5efc98d4adf16426cf3bb60 59
ext:Unity/Assets/_Project/PathsTest/PathsWater.cs 02c032c5703285974d9081605416eacc6f868b2821b0e80f119e15f629624288 32689
ext:Unity/Assets/_Project/Runtime/Presentation/DwarfBodies.cs 804fd905f8130a11f2c5c57f833b81f7500ab4038c680700539ac619d499a267 57817
ext:Unity/Assets/_Project/Runtime/Presentation/DwarfKit/DwsFigure.cs c5429d9cbab53f5db696e57b394370212df7a3f1a4a5119d7f38f35bd4dc4441 9528
ext:Unity/Assets/_Project/Runtime/Presentation/DwarfKit/DwtFigure.cs 894e78c2ee07edc7a22dd11b61ed9c590b0af12cdb03035920b55a63a0012591 85712
```
# Round 8: HL-PATHS-LOGISTICS-TEST-V1-R8

Worker (Claude Opus 5.5). Mode: Discovery. German note for the Human: `round8/ROUND_8.md`. Step log: `round8/PROGRESS.md`.
`wege`: 5638e38 -> **64cc533**. Not pushed. The Studio evidence is not committed.

## R8.1 verify-worker
`PASS worker receipt 8af6344d2610db9d81271960c23a7a4fc6fba15a2ce137b571bfe6764ae2a9e5`, exit 0, before any mutation.

## R8.2 What was built (by content point)
1. Foil: cause = finished foundations keep the game's neutral meadow paint with no short grass (no grass through a floor) and the test's tall grass skipped building tiles and cleared a round patch at each door; the models are smaller than their foundations (quarry 2: model 1.59 x 0.94, store 2: 1.34 x 1.74). Now (`PathsGame.R8.cs`): model rectangles from the mesh bounds (mirrored as drawn); the open part of a foundation grows the short grass (texels written by the test, rewritten after a ground rebuild) and the tall grass (`TallGrass.GrassOnPlot`); worn earth only under the model; door apron (oval, fading), a worn way from the model's front to the door, the quarry's face and pile with the way between, the fires' doors; round 6's ring kept; tall grass thins with the worn field (`TallGrass.YardAt`).
2. Lanterns: cause = `WorldView` sets a lantern on its tile's water level where the core map has water, also where the river sample's banks now stand above the clipped test water. Hook `WorldView.LanternGround` (test sets it): drawn water (`PathsWater.CoverLevel`) where it covers the point, else max(game ground, `RtBanks.LedgeTop`). Positions unchanged. Moved: layout 1 (63 lanterns) 6, layout 2 (71, after the new fire) 3; list in ROUND_8.md and `captures/r8_final/lanterns_r8_layout*.csv`. The Human's lantern 44.50,22.13: 9.352 -> 9.550 (ledge bank).
3. Quarry: stone pile on the tile beside the foundation nearest to the stonemason's place, leaning to the wall (45.72, 24.50; 1.23 tiles from the face); the stonemason cuts 2 stones and carries both on the frame (`PathsSim.StonesPerTrip`).
4. Darkness map: `PathsSim` light grid (half tiles) adds lights up (1 - prod(1 - b)), border lanterns only by max among themselves; overlay mesh over ground/drawn water, banded colours with key (`PathsDarkKey`), torches live; panel switch "Dunkelheitskarte" and key L; flame marks (small fire 1.05 tiles, Heart Fire at its porch).
5. Night: `LitPlace` (lit >= 0.6, brightness pull 8 tiles per unit, free 0.8 from others' places, out of flames, reachable, 24 tiles first); `ShouldSeek` (weak light or crowded), side step for escorted groups, builders leave dark sites without material; torch rule (`TorchRule`: lit when a bearer/home/shelter walker stands or steps into the dark, out after 3 s standing or 6 s walking in light); measures of both rounds (`MeasureNight`, `PathsGame.NightNote`).
- `-hlPathsR7`: round 7 on the same build. Route `r8` (`PathsCapture.R8.cs`), `-hlPathsR8Part ground|lantern|quarry|night`.
- Look iterations: ground 3 (smaller/softer yards; no door-to-face strip; grass on open foundations), night 3 (flame distances and gather claim; builders home and step aside; torch hold and side step), map 1 (bands, lanterns not adding up), quarry 1 (two stones per trip), lanterns 0. A fourth tweak was written and reverted unbuilt (cap). Operational repairs 1 of 3 (compile-1 CS0103 missing using).

## R8.3 Measurements (bench 32 game minutes, build r8-4 = 64cc533; `round8/logs/bench-table.txt`)

| Run | Logs/stones/game | Sites | Alone dark | Lit wait | Gave up | Back | Stand dark no torch | Walk dark no torch | Torch sw. per night dwarf-h | Flicker | Night work s / made / built | Weak-light wait |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R7 6 | 77/110/8 | 8 | 157 s | 5910 s | 57 | 1.4 s | 311 s | 547 s | 0.36 | 39 | 529 / 46 / 10 | 3528 s |
| R8 6 | 82/101/8 | 8 | 9 s | 7044 s | 67 | 1.9 s | 23 s | 7 s | 0.45 | 16 | 452 / 43 / 13 | 2094 s |
| R7 4 | 76/71/0 | 8 | 15 s | 6512 s | 79 | 0.6 s | 222 s | 101 s | 0.13 | 2 | 269 / 23 / 9 | 3148 s |
| R8 4 | 79/90/0 | 8 | 17 s | 3966 s | 58 | 0.5 s | 13 s | 3 s | 0.43 | 13 | 410 / 32 / 16 | 514 s |

Night deliveries (logs/stones/game): R7 6 9/47/5, R8 6 15/33/5, R7 4 13/14/0, R8 4 18/30/0. Crowded waits: R7 6 1354 s, R8 6 1295 s, R7 4 1164 s, R8 4 421 s. Earlier benches kept for the trace: `bench_r8a_*` (r8-2), `bench_r8b_*` (r8-3; stones 80 with one stone per trip in r8a).

## R8.4 Commands
- Editor compiles `unity-compile-1` exit 1 (CS0103), `-2`, `-3` exit 0. Builds r8-1 .. r8-4 Succeeded (`logs/unity-build-r8-*.log`, `build-r8-*.out.txt`); HDRP assets and Main.unity restored after each (`logs/hdrp-settings-rewritten-by-build.txt`). Final `Unity/Builds/HL-PathsTest-r8` (r8-4 = 64cc533), starter `Wege-Test Runde 8 spielen.cmd`. `HL-PathsTest-r6` deleted (r7, r8 kept).
- EditMode PathsTest + FogSystem 87/87 (`logs/editmode-paths-fog-final.xml`).
- Players (all rendering, D3D12, minimised, windowed, exit 0, closed by themselves; chains `logs/chain-1..5`): r8_1, r8_r7, r8_2, bench_r8a_klein6/4 and _r7_ (4), bench_r8b_klein6/4, r8_3, r8_4 (ground part), bench_r8c_klein6/4, r8_final, r8_r7_final, bench_r8c_r7_klein6/4. 20 player launches, 7 editor launches (3 compile, 4 build) + 1 EditMode, one at a time, only the Wege folder's Unity; the Human's round 7 player (pid 35224) not touched.

## R8.5 Captures
- Clips `round8/clips/` (MP4 H.264, 1.0-10.0 MB; round 7 above = `captures/r8_r7_final`, round 8 below = `captures/r8_final`): B1-B8 ground, L1-L4 lanterns, S1 stonemason and pile, N1-N2 darkness map, N3-N5 night at the fires, N6 torch. Stills `round8/vergleich_bilder/` (30). Scripts `logs/make_r8_clips.py`, `make_r8_media.py`, `bench_table.py`. Superseded film frames removed.

## R8.6 Still wrong (looked at every picture)
- Door aprons read as round, even brown patches; large at the quarry and in front of the hall (the court is now all earth).
- Escorted groups still stand on one point while pausing (crowded about as round 7 with 6 per fire).
- 6 per fire: 101 stones vs 110 in the R7 run of this build.
- More torch switches than round 7 (more torch carriers); short flicker with 4 per fire 13 vs 2.
- The stone pile is small and pale from above.
- The small fall's lanterns float in the water (positions kept as decided).

## R8.7 Candidate files
Worker commit 64cc533, `git diff --name-only 5638e38..64cc533`, 16 files, all in allowed paths (`round8/logs/candidate-files.sha256.txt`, sha256 of the committed blob, size):

```
ext:Unity/Assets/_Project/PathsTest/Editor/PathsBuild.cs ea1915d44f19c193f55e9a64bb3eda1c13b620cd5ff534820ed479f0002ebe72 13505
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R8.cs 84846c9b5cb8f245db532ccb7f030bd6d02bb378920f0a0ec6329d85a593e592 13510
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R8.cs.meta d1c20cfd406c638f82844567db11e2040ee30715b59fb72e0a199a69a8193fd1 59
ext:Unity/Assets/_Project/PathsTest/PathsCapture.cs 83fc82617c72b70ed96cdcd8ac3b3107129720e609dcdf2dc2ad5c62ed93a5b0 19001
ext:Unity/Assets/_Project/PathsTest/PathsDwarf.cs 14bae0f5ec5fbca157af4561b47ea49562c175075bf6cfb2fe0835401f3f8f08 26053
ext:Unity/Assets/_Project/PathsTest/PathsGame.R6.cs 0a0c69423e969f2f343a6ac69430f55af78342a8166cc4adbaa2e34f0be07b6f 19402
ext:Unity/Assets/_Project/PathsTest/PathsGame.R7.cs 54a11291b8f6f56f2c54167b9768b10e474208fa98b3718e1d743e247c87731f 6833
ext:Unity/Assets/_Project/PathsTest/PathsGame.R8.cs 000cb0c19d3965acd2ef25e972f76da621275af66a07a356682be6f39d8930fb 36781
ext:Unity/Assets/_Project/PathsTest/PathsGame.R8.cs.meta b20b1af2334d9315b4f706ae857c1876a57a1680896604244c50c8b732eb30e9 59
ext:Unity/Assets/_Project/PathsTest/PathsGame.cs fe6a4164de6f1f6890c7fb308bfb986491b1223ef0666bb19499e3575dd3d02d 44907
ext:Unity/Assets/_Project/PathsTest/PathsPanel.cs 2c9b4b9d27062ec5a78f27600d51deb300f8558951f06b36a86fa94bc53d0cb0 22679
ext:Unity/Assets/_Project/PathsTest/PathsSettings.cs 6c95ddf72b3e3d5ef88874cc48298bcab131c59b95eec2d3e34567f4763183c9 4130
ext:Unity/Assets/_Project/PathsTest/PathsSim.cs af0bb48557fa1743c1209d9791b1a06dcf23440ffcee6e3b0f270f96f57d2f1c 72281
ext:Unity/Assets/_Project/PathsTest/PathsWater.cs 5b1c5611d726d32c345224833c6543d26805c4c6cca7af5474f44821bf2b543e 33628
ext:Unity/Assets/_Project/PathsTest/TallGrass.cs bb679fc1ccb4b751885aa307090cf50f33f52bd48b6c9ef459994563019160d4 15950
ext:Unity/Assets/_Project/Runtime/Presentation/WorldView.cs 6e96ae8f51e9543e367a6eb6c038952faad634209f239185d1673a2226b30ceb 141039
```

# Round 9: HL-PATHS-LOGISTICS-TEST-V1-R9

Worker (Claude Opus 5.5). Mode: Discovery. German note for the Human: `round9/ROUND_9.md`. Step log: `round9/PROGRESS.md`.
`wege`: 64cc533 -> **02aa775**. Not pushed. The Studio evidence is not committed.

## R9.1 verify-worker
`PASS worker receipt ea9672a81c9ba2a36d31a970d0ec53918f7df43d6835c0ad6c71ffa1bb779ed6`, exit 0, before any mutation.

## R9.2 What was built (by content point)
1. One item per dwarf: stonemason one stone per trip to the pile on the tile beside his wall facing the stone (lean 0.12), 0.5 s look after the drop, waits at the pile when full; troop one ware each, no frame (`PathsTroop.OnePerDwarf`). Measured most items carried at once: R9 1, R8 2. Round 6 cause: the pile at the door on the far side from the face (a walk round the house per stone); round 8's one-stone loss came from the 4 s rest after each drop.
2. Light list from the drawn lights (`PathsGame.RebuildLightsR9`): each building's fire lights, warm lamps and BuildingFx work-spot glow from its model (mirrored as drawn), test fires at their hearth, waypoint fires, lanterns, the test's stake torches. Night audit (`AuditLights`): 57 drawn point lights, all on the map; unlit listed entries are only border lanterns beyond HallArt's 32-nearest lamp cap. Round 8 mode audit: 15 drawn lights not on its map (hall fire light, 4 hall lamps, 4 tablet lamps, work glows of the hall, both stores, sawmill, well, guardhouse).
3. Falloff `PathsSim.Falloff` (1 - x^2)^2; brightest light in full, second by 35 % (look iteration 1 after the hall's lamps made a wide brightest court); fires reach 4.2 (Heart 5.6) at the drawn flame.
4. Seat ring (hearth keep 0.7 / Heart 1.0, ring 0.75): 3 logs per small fire, 4 at the Heart Fire, 2 seats each (`LayoutSeats`); home dwarves and the watch sit at night (sit clip), waiting dwarves take a free seat first; key renamed "Sitzring".
5. Night ways: `PathsFinder.NightRoute` with dark cost 1 + 2 x darkness; day and night way of one trip on the map (white / green). Example Herzfeuer-Holzfeuer: 14.1 tiles (61 % dark) by day, 21.5 tiles (27 % dark) at night.
6. Stake torch (model + 1800 lm HDRP light, map reach 3.2) at every open site and at the stonemason's face.
7. N3 cause: the Heart Fire's light sat at Fire.Center in the open court (2.4 tiles south of the drawn flame), light 1.00 at the four dark dwarves; fixed by the drawn flame and seats in front of the hall. N6 cause: torch out after 3 s in light while still serving; now a bearer keeps it while serving and a walker while the rest of his way is dark. Staged escort, same points both rounds: R8 torch out 11.3 s (2 switches), R9 0.
8. Aprons 0.28 + 0.1/side x 0.34, firmness 0.6, ragged edge with a second noise; R6 ring 0.55; tall grass clearing only round the seat ring; escorted groups take a half-ring slot behind the bearer (`GroupSlot`); rough grey stone mound (1.35x) on a rubble bed.
- `-hlPathsR8` = round 8 on the same build; route `r9` (`-hlPathsTrip`, `-hlPathsEscort` for identical situations), `-hlPathsR9Part`.
- Iterations: map 1, ground 1, night 1, quarry 1. Operational repairs 3 of 3 (compile CS0102, compile CS0103, capture audit index error in round 8 mode).

## R9.3 Measurements (bench 32 game minutes; `round9/logs/bench-table.txt`; R8 = round 8 mode of build r9-2, R9 = build r9-3, same R9 code as the final)

| Run | Logs/stones/game | Sites | Alone dark | Lit wait | Gave up | Back | Stand dark no torch | Walk dark no torch | Torch sw. per night dwarf-h | Flicker | Night work s / made / built | Weak wait | Crowded | Sit at fires | Night/day way | Longer | Max carried |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R8 6 | 80/110/9 | 8 | 22 s | 5055 s | 64 | 2.0 s | 14 s | 2 s | 0.455 | 18 | 488/44/14 | 654 s | 434 s | 0 | x1.000 | 0/432 | 2 |
| R9 6 | 84/108/10 | 8 | 20 s | 2941 s | 45 | 2.1 s | 19 s | 0 s | 0.484 | 17 | 544/52/14 | 206 s | 66 s | 9412 s | x1.031 | 64/448 | 1 |
| R8 4 | 83/90/0 | 8 | 17 s | 4173 s | 62 | 1.5 s | 10 s | 2 s | 0.510 | 9 | 419/35/13 | 302 s | 432 s | 0 | x1.000 | 0/367 | 2 |
| R9 4 | 74/91/0 | 8 | 14 s | 2857 s | 54 | 1.7 s | 10 s | 0 s | 0.428 | 5 | 354/29/15 | 121 s | 121 s | 6613 s | x1.076 | 116/322 | 1 |

Stones in round 7 mode on this build: 109 (6) / 71 (4). Earlier R9 benches kept for the trace: `bench_r9a_*` (r9-1), `bench_r9b_*` (r9-2; R9 107/76 before the quarry iteration).

## R9.4 Commands
- Editor compiles `unity-compile-1` exit 1 (CS0102), `-2` exit 1 (CS0103), `-3` exit 0. Builds r9-1 .. r9-4 Succeeded; HDRP assets and Main.unity restored after each (`logs/hdrp-settings-rewritten-by-build.txt`). Final `Unity/Builds/HL-PathsTest-r9` (r9-4 = 02aa775), starter `Wege-Test Runde 9 spielen.cmd`. `HL-PathsTest-r7` deleted after the Human's r7 player (pid 35224, not touched) had closed; r8 and r9 kept.
- EditMode PathsTest + FogSystem 88/88 (`logs/editmode-paths-fog-final.xml`).
- Players (all rendering, minimised, windowed, closed by themselves; chains `logs/chain-1..4`): bench_r9a_klein6, r9_1, bench_r9b_klein6/4, bench_r9b_r8_klein6/4, bench_r9c_klein6/4, bench_r9c_r7_klein6/4, r9_2, r9_r8_2 (exit 2: audit index error, repaired), r9_r8_final, r9_final. 14 player launches, 8 editor launches (3 compile, 4 build, 1 EditMode), one at a time, only the Wege folder's Unity.

## R9.5 Captures
Clips `round9/clips/` (MP4 H.264, 1.0-12.5 MB; round 8 above = `captures/r9_r8_final`, round 9 below = `captures/r9_final`): B1-B6 door aprons by day, S1 stonemason with carrier, N1-N2 darkness map, W1 day and night way (round 9 only), N3-N5 fires at night with seats, BS1 site at night (different sites in the two runs), N6 staged escort. Stills `round9/vergleich_bilder/` (16). Light lists `captures/r9_final/lights_r9_list*.csv`, audits `light_audit_*.csv`. Scripts `logs/make_r9_clips.py`, `make_r9_media.py`, `bench_table.py`, `candidate_list.py`.

## R9.6 Still wrong (looked at every picture)
- Torch switches not fewer: 0.48 vs 0.46 per night dwarf-hour with 6 per fire (fewer with 4: 0.43 vs 0.51); smaller fires mean more dark stretches and more night work.
- The stone pile lies on the tile beside the 2x2 foundation, about a tile from the small model: from above it reads as lying in the yard.
- The quarry's yard is still large (carrier traffic).
- On the map the hall's porch (flame plus four lamps) is one bright patch; it no longer reaches into the court.
- Sitting logs read small from far; at the Heart Fire few dwarves sit in the film because many work at night.
- Standing in the dark without a torch 19 s vs 14 s (6 per fire).
- BS1 shows different sites above and below.

## R9.7 Candidate files
Worker commit 02aa775, `git diff --name-only 64cc533..02aa775`, 19 files, all in `Unity/Assets/_Project/PathsTest` (`round9/logs/candidate-files.sha256.txt`, sha256 of the committed blob, size):

```
ext:Unity/Assets/_Project/PathsTest/Editor/PathsBuild.cs 4878056edde28d9fc8b400dcf5c2a30ff0c7018a8c762e9775c9cdf64c500f7b 13487
ext:Unity/Assets/_Project/PathsTest/PathsArt.cs 299ae3be726db74b37a4c2c86267ceec2e82844f4a9de0de8f341a368ad46b88 9034
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R9.cs 97a09e455c7f671302ed721f418b0c4764e32e0025d37f3f2c1259ba7722735a 18769
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R9.cs.meta 555c3c570b2c30a4ef2ebcadc8ff28cc892783247badcf48bce25bd756627fcd 59
ext:Unity/Assets/_Project/PathsTest/PathsCapture.cs 626d3bdfb1024bc25ccaf9451290fd86b4f15239d6b9f897b7c1dac67ebc1d79 19601
ext:Unity/Assets/_Project/PathsTest/PathsDwarf.cs 9218e91a530e046fc01d7773610a6aa84e91c926e8bc1033848ecddee09317ba 28541
ext:Unity/Assets/_Project/PathsTest/PathsFinder.cs f7641ab6ed62f1a3fd3090d55fce55d5c425b4fb14cb0491106593b12076b211 12041
ext:Unity/Assets/_Project/PathsTest/PathsFogBridge.cs 9d132b9bc8e0797a6f0db0cc559c1e066dfad5531d6b6f434cc582cd87f0cf14 27320
ext:Unity/Assets/_Project/PathsTest/PathsGame.Draw.cs 8448f672a02f21d95135b03650509c9084dbab58577bd3969699d0f673410690 25254
ext:Unity/Assets/_Project/PathsTest/PathsGame.R6.cs 816c1ed2d79dc217e03bdbdb2dd1bc6eebc79ad75562b7d62dc85a2cd918262e 19725
ext:Unity/Assets/_Project/PathsTest/PathsGame.R8.cs 4e64a0273530d328f9d5b257bcbbb5f521977bd3e567bc132917c17cac7e4579 39847
ext:Unity/Assets/_Project/PathsTest/PathsGame.R9.cs 675df426b26e28af11355abbd1da0ae5fdce7e26ec5cb181a6dd68be1340c94b 33282
ext:Unity/Assets/_Project/PathsTest/PathsGame.R9.cs.meta d28319d87875a69a481599569f3749962a3267294a237a31821e05bc32f66476 59
ext:Unity/Assets/_Project/PathsTest/PathsGame.Tools.cs 97ab95128eee85cbebc3f551e11377f33d669365b3cdbfd46925f27ad3e01153 21162
ext:Unity/Assets/_Project/PathsTest/PathsGame.cs 4ff6319e0fea75e57aa22cc060af67542b1bddcc4f323457f5cff4afafc7c6ae 45726
ext:Unity/Assets/_Project/PathsTest/PathsSim.cs 8576d08b8927f48fde0fd3dec2df82ccc0d2c8ac4a6598b64111a5df498fca8f 86573
ext:Unity/Assets/_Project/PathsTest/PathsTroop.cs 8afa543eb049ac57cf5618e5454cc1cf9b33f7c5cae9a000dac73dec3c183a78 13874
ext:Unity/Assets/_Project/PathsTest/PathsWorld.cs 887baacabdd4572c658650cbf83e35948482f1e18e0ac83ca4ea929125a7dcb9 8035
ext:Unity/Assets/_Project/PathsTest/Tests/PathsRulesTests.cs bea09de616b89911b4ca7ba6cb64475203e26d1f427beaa6b166d056ab10a732 4506
```
# Round 10: HL-PATHS-LOGISTICS-TEST-V1-R10

Worker (Claude Opus 5.5). Mode: Discovery. German note for the Human: `round10/ROUND_10.md`. Step log: `round10/PROGRESS.md`.
`wege`: 02aa775 -> **01ce275**. Not pushed. The Studio evidence is not committed (as in round 9).
Two Director amendments of 2026-11-08 (the Human's exact words in `round10/PROGRESS.md` and `ROUND_10.md`): 7 door torches back; 7a door torch to the side, 7b HD-259 side choice.

## R10.1 verify-worker
`PASS worker receipt c9fb68c6db7713f0cda3187c25042c21a66ac7a75e3b7b085ace8cc119b439d6`, exit 0, before any mutation.

## R10.2 What was built (by content point)
1. Logs only at the small fires (3 each at the wood, stone and ford fire), none at the Heart Fire; no seats, no sitting (no sit animation built); `Sim.LogSpots` keep waiting dwarves off the logs.
2. Stones at the door: the quarry's drop spot = its door torch spot (the old door-flag tile); the round 9 pile and gravel bed gone; `BsAssemble.NoLooseGoods` removes the stonecutter's block pallet (the two pale blocks), the woodcutter's open log stack, the sawmill's waiting logs and board rack. Every hut and fire store: goods only at the drop spot. Stones in 32 min: R10 105 (6) / 98 (4) against round 9 mode 109 / 86 (round 9's own report 108 / 91).
3. Darkness map from the picture: each fixed light's height, lumen at night and range as drawn (`LightPhys`), ground light lumen/4pi x cos/d^2 x the HDRP range window, plus the moon term; `MapOf` = 1 - exp(-((E + moon)/e0)^1.53), fitted to the night picture with the torch lights off (`round10/logs/calibrate_map.py`, `fit_moon.py`: tone curve brightness ~ light^1.6, best moon 30; clearly lit from 2.5x, dark below 1.6x the moonlit meadow's brightness). Human's view (final, `captures/r10_final2`): map lit 21 / picture lit 26, both 20; picture dark 145, map dark there 142; 96 % agree; at darkness 0.5 and 1: 98 %; settlement view 93 %. Round 9's map in the same view: 45 lit, 40 of them dark in the picture; 79 %. Home dwarves wait at night at a free clearly lit place within 7 tiles of their fire (`LitPlaceNear`): at the hall 6 of 6 standing dwarves lit by the picture (round 9 mode: 4 sitting, 2 of them dark in the picture, 2 weak).
4. Sources: `BuildingFx.WorkshopGlowOff` puts out the sourceless work-spot glow of every building (the store's pool; the hall, both stores, the hearths, huts, sawmill, well, guardhouse); the carrier house's map-only light removed; the door torches (point 7) are the visible source at every door; kept: fires, the hall's 4 front lamps and 4 tablet lamps, stake torches, waypoint fires, lanterns. Audit: 34 drawn point lights, all 34 on the map (66 listed lanterns not burning: the game burns only the 32 hall-art lamps nearest the camera).
5. Darkness slider (panel "Dunkelheit der Nacht", 0 = today .. 1 = 3 % moon and ambient: `DayLight.MoonScale`, HDRP `IndirectLightingController` multipliers) and clouds switch (off by default; Perlin cover every ~30 game s, moon to 15 %, ambient to 60 %); the map's moon term follows both at once. Measured: the meadow at slider 0.5 is 0.51 of today's (light units), at 1 it is 0.
6. Fixed lights vs torches: the map overlay shows the fixed lights only, a torch only as a ring; new measures for both rounds (`R10 light split`): standing and waiting at night by fixed light / only a torch / weak / nothing, by the round's own map and by the night picture.
7. Door torches: the game's waypoint fire model on each door-flag tile with its own steady 700 lm light (range 4.5), on the light list and the map (13 buildings); drop and pick-up spot for all wares. 7a: the post 0.36 tiles beside the drop spot (south side: west, like the old flag pole in HL-GAME-CURRENT-ASSETS-V1 `03_row_all.jpg`; east/west sides: towards the camera), the wares on the far side, the way to the house free; workers walk to `Workplace.House`, go in to rest (`Dwarf.Inside`, not drawn) and come out. 7b HD-259 test: `WaySide` S/SE/E/W/SW, key R or the panel button while placing a quarry or a fire; preview ring and torch on the chosen side; the site and the finished building keep the side (drop spot, door torch, house door); the core flag stays at (x, y+1), hidden; inside the test only.
- `-hlPathsR9` = round 9 on the same build; route `r10` (`-hlPathsR10Part day|quarry|night|side`; side only in its own run).
- Iterations: map 3 (calibration; torch stripes -> rings; the map follows the slider at once), door torch 2 (in front -> beside), capture camera 1. Operational repairs 1 of 3 (compile-2 CS0119 enum/method name clash).

## R10.3 Measurements (bench 32 game minutes; `round10/logs/bench-table.txt`; build r10-5, same sim code as the final r10-6)

| Run | Logs/stones/game | Sites | Alone dark | Lit wait | Gave up | Back | Stand dark no torch | Walk dark no torch | Torch sw. per night dwarf-h | Flicker | Night work s / made / built | Weak wait | Crowded | Sit at fires | Night/day way | Longer | Max carried |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R9 6 | 78/109/10 | 8 | 22 s | 2982 s | 46 | 1.8 s | 17 s | 0 s | 0.452 | 14 | 499/47/16 | 233 s | 118 s | 9575 s | x1.021 | 40/436 | 1 |
| R10 6 | 87/105/11 | 8 | 19 s | 1949 s | 34 | 0.8 s | 18 s | 0 s | 0.367 | 18 | 744/69/17 | 240 s | 30 s | 0 | x1.005 | 14/487 | 1 |
| R9 4 | 76/86/0 | 8 | 18 s | 2883 s | 55 | 2.0 s | 18 s | 0 s | 0.410 | 7 | 374/32/18 | 154 s | 150 s | 6277 s | x1.068 | 101/331 | 1 |
| R10 4 | 80/98/0 | 8 | 10 s | 2170 s | 35 | 1.1 s | 13 s | 0 s | 0.332 | 23 | 633/52/21 | 113 s | 35 s | 0 | x1.007 | 8/310 | 1 |

Night standing and waiting judged by the night picture (dwarf-seconds; lit / only a torch / weak / dark):

| Run | Standing | Waiting for light | Standing "fixed lit" by the round's own map |
|---|---|---|---|
| R9 6 | 5803 / 1235 / 3482 / 5057 | 389 / 347 / 717 / 1532 | 14996 |
| R10 6 | 11608 / 2738 / 717 / 81 | 1725 / 46 / 171 / 24 | 11608 |
| R9 4 | 4737 / 1079 / 1647 / 4009 | 533 / 229 / 574 / 1549 | 10611 |
| R10 4 | 10864 / 280 / 63 / 56 | 2064 / 31 / 62 / 20 | 10864 |

How round 9's numbers were affected: its "lit wait" and "weak wait" used only its fixed-light map (no torches), but that map called the court before the hall and the seat rings lit where the picture is dark: by the picture only 389 of its 2765 s waiting "in fixed light" (6 per fire) were really lit. Its "stand dark no torch" and "alone dark" counted a torch within 1.8 tiles as light: by the picture 1235 s (6) / 1079 s (4) of standing were lit only by a moving torch.
Quarry: the stonemason's trips 101 (6) / 92 (4), walking 844 / 771 s (round 9 mode 104 / 85, 1107 / 1235 s).

## R10.4 Commands
- verify-worker exit 0. Editor (hidden, -batchmode -nographics): compile-1 exit 0, compile-2 exit 1 (CS0119, repaired), compile-3 exit 0; builds r10-1 .. r10-6 Succeeded (HDRP assets and Main.unity restored after each, `logs/hdrp-settings-rewritten-by-build.txt`); EditMode PathsTest + FogSystem 88/88 (`logs/editmode-paths-fog-final.xml`). 10 editor launches.
- Players (all rendering, minimised, windowed; chains `logs/chain-1..6`): r10_1; r10_2, r10_r9_2; r10_3, r10_r9_3, bench_r10_klein6 (stopped by me, my own pids 16304 / 24128, to add the picture measure); r10_final, r10_r9_final, bench_r10_klein6/4, bench_r10_r9_klein6/4 (build r10-4, superseded by amendment 7a); r10_side, r10_final2, r10_r9_final2, bench_r10b_klein6/4, bench_r10b_r9_klein6/4 (r10-5); r10_side2 (r10-6). 20 player launches. No other process touched; nothing took focus.
- Final build `C:/GameDev/Hearthlands-Wege/Unity/Builds/HL-PathsTest-r10` (r10-6 = 01ce275), starter `Wege-Test Runde 10 spielen.cmd`. `HL-PathsTest-r8` deleted (not in use); r9 and r10 kept.

## R10.5 Captures
Clips `round10/clips/` (MP4 H.264, 1.9-13.9 MB; round 9 above = `captures/r10_r9_final2`, round 10 below = `captures/r10_final2`): H1 hall and store at night (the Human's view), H2 the same with the map, D1 darkness slider, D2 clouds, S1 stonemason and carrier at the door torch, Q1 quarry by day, T1/T2 doors with torches by day/night, F1 wood fire with its logs; round 10 only (`captures/r10_side2`): E1 a worker into his house and out (cropped), R1 placing a quarry with east, then one with south. Stills `round10/vergleich_bilder/` (with the map checks `*_check.jpg`; A1/A2 door torch before (`r10_final`) and after (`r10_final2`), same camera).

## R10.6 Still wrong (looked at every picture)
- The torch rings on the map are wide pale bands (the overlay texture is blurred); they read as rings, but are still prominent.
- The map misses some lit edges of the pools (Human's view: picture lit 26, map 21); in the settlement view 30 lit half tiles are missing, 33 are too many.
- Clouds dim the whole land at once; no cloud shadow moves.
- E1 is cropped from a far camera (the close camera did not come closer): grainy; the worker simply vanishes at his door (no door motion).
- The game burns only the 32 lamps nearest the camera: border lanterns on the map often do not burn in the picture.
- HD-259 only in the test: the core still puts its flag south (hidden); the preview shows only the side's tile ring and torch.
- Fast torch flicker with 4 per fire 23 (round 9 mode 7).
- Benches and the final picture runs ran on build r10-5; the final build r10-6 differs only in the house film's camera (capture code).

## R10.7 Candidate files
Worker commit 01ce275, `git diff --name-only 02aa775..01ce275`, 24 files (`round10/logs/candidate-files.sha256.txt`, sha256 of the committed blob, size):

```
ext:Unity/Assets/_Project/PathsTest/Editor/PathsBuild.cs dd3b3e4369043139c48dde921cccc887ce1816f0299bb7529466999f6f1b91a0 13511
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R10.cs 6fc1bcb763818ed7dcbdcdfe3c68b0e0aeb3571be6515116ac5366aae3511a40 20037
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R10.cs.meta d6d9c64ce9c912c5de3fa26db46990638c7ad23c0e2bfec02ed85a5a9f13bccf 59
ext:Unity/Assets/_Project/PathsTest/PathsCapture.cs 49a946eb842a1d846fee0c4a2cf394d37d0bda53426fe17ac95b2655123c62d5 20170
ext:Unity/Assets/_Project/PathsTest/PathsDwarf.cs db5632906484107289e7eb3579811da7850854bacb19e4e923e4830dc4dbeb4d 28878
ext:Unity/Assets/_Project/PathsTest/PathsGame.Draw.cs d63fff581df650ae9db85028b0ad7baab34c7a10c52d19c96c46de3b0c2eac77 26012
ext:Unity/Assets/_Project/PathsTest/PathsGame.R10.cs 737c75887fa8bba01660f41918e194190fe0ecf91704f4b3b8a246d5cd1a304f 13186
ext:Unity/Assets/_Project/PathsTest/PathsGame.R10.cs.meta fde9affe8829cc94f4418463c8df1a6ba63c3bfe615e018eda452584cb7395e4 59
ext:Unity/Assets/_Project/PathsTest/PathsGame.R10Side.cs b16b894262f342ffdbd1353873bafa831cc52a92c3ddb8378b72db9bd60b9a2c 9614
ext:Unity/Assets/_Project/PathsTest/PathsGame.R10Side.cs.meta e02414944643bebcf2afc5f1e2eda7ed0962c86aaba9ff90cd9b90080b3ac6b5 59
ext:Unity/Assets/_Project/PathsTest/PathsGame.R6.cs b9c283b5ec9be75d282429e250907c5c5564cf5de247a916cca33b72da8567df 20347
ext:Unity/Assets/_Project/PathsTest/PathsGame.R8.cs 6fa25489d9ddc6f98a197d45c741a5ca55df6070485f4e36c88214b0ee81dd8b 40594
ext:Unity/Assets/_Project/PathsTest/PathsGame.R9.cs e122e44c1f97fb9a0258e98701034aaaa0cc8c48c44f02b8150087aea1ae5c1e 35915
ext:Unity/Assets/_Project/PathsTest/PathsGame.Tools.cs a4f09657ac2a7be16f0710abb6552b97bf30453a0e2551992150d516b6845e9b 21604
ext:Unity/Assets/_Project/PathsTest/PathsGame.cs c0cd59343f6eb62bcec5a7493f4ddf54a5ea84ada544a5401c5707ac08ffc649 46600
ext:Unity/Assets/_Project/PathsTest/PathsPanel.cs d9eb0ef120cc5be17c0cc3f034cbd7cd5bd77a96e5bec9906d4e4127fb5671cb 23374
ext:Unity/Assets/_Project/PathsTest/PathsSettings.cs 2a194f6c00f821e6d6637b784a6f27f0c9c8d51f806d52b1d73ecc349d51b1a7 4516
ext:Unity/Assets/_Project/PathsTest/PathsSim.cs 5fd7e59e7ea62b4f2f2d3d49649365c7c8dc2cd3b2c0fad1a8085b4fbc220ac9 98685
ext:Unity/Assets/_Project/PathsTest/PathsWorld.cs dd294d5aaf9cc601102f23363856de8854d740e570488f5ee0d83f49c6883202 8228
ext:Unity/Assets/_Project/Runtime/Presentation/BuildingFx.cs 88fb9d4be04998b06cb959f02cc9befa82c4a5ee1598912630b678055ac75f24 18122
ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsAssemble.cs 2bff4696c927c6bcdf1ddcccda821eb8591ba6a15a5532bab2ae734194979ce3 11811
ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsR5.cs 7aba27a279149dc90053aed4350e630b8b5c13975d41039e7a064e366a1f6162 41363
ext:Unity/Assets/_Project/Runtime/Presentation/BuildingKit/BsTier1.cs ac9323fb85fdde4f4347775cdcd3aaff9da4defd183e87890df532075e770ba4 61597
ext:Unity/Assets/_Project/Runtime/Presentation/DayLight.cs 4b3efac2301829caa2a69ac10885bd1bc46019caf19121b06b198394bb5b13fe 10832
```

# Round 11: HL-PATHS-LOGISTICS-TEST-V1-R11

Worker (Claude Opus 5.5). Mode: Discovery. German note for the Human: `round11/ROUND_11.md`. Step log: `round11/PROGRESS.md`.
`wege`: 01ce275 -> **9a8a6b3**. Not pushed. The Studio evidence is not committed (as in rounds 9 and 10).

## R11.1 verify-worker
`PASS worker receipt 2b814c9460772e856de6b5f783a0a2bbb0a243305f41e9cf791dd45a3d5d8964`, exit 0, before any mutation.

## R11.2 What was built (by content point; all Proposals; round 10 on the same build with `-hlPathsR10`)
1. Darkness: default 0.70 (the normal night); the panel keeps the slider with buttons "70 % normale Nacht" and "85 % Höchstwert unter Wolken". Clouds on by default: a tileable cloud field (256², periodic value noise, about a quarter of the sky) as a Repeat cookie on the moon (`Light.cookie`, `cookieSize2D` 40 units), moved with the wind (the light's position, 0.3 tiles per game s). Under a full cloud the moon is cut to 0.40 so the place reads at the slider + 15 points (85 % at 70 %); the ambient term stays. The darkness map takes the same field per half tile (`PathsSim.CloudShade`, refreshed every 0.5 game s). Land in shadow 21-33 % in the cloud film (round 10: the whole land at once). The slider now darkens only the night half of the light (`DayLight.DarkNightOnly`, test only; round 10 dimmed the dusk sun half way).
2. Night fog: today flat (BaseNight 1.10 from 19:30 to 05:00, no peak). New `FogSettings.TimeDensity` (x Strength in the march and the fallback) = `PathsGame.NightFogScale(hour)`: 1 to 20:00, smooth to 1.2 at 0:00, held to 2:00, back to 1 at 5:00. Logged per frame in the fog film (`captures/r11_4/nebel_kurve.csv`); chart `round11/vergleich_bilder/nebelkurve_nacht.png`.
3. `NightRule.OwnTorch` (panel: "Jeder Zwerg eigene Fackel"; `-hlPathsNightRule own`): in `LightFor` no bearer, the dwarf lights his own torch where he leaves the light or works in the dark; the torch rule puts it out with the same holds. New measures (both rules): own torches lit, most torches at once, torch dwarf-seconds, dwarf-seconds at a dark place at night (walking).
4. Shadows from outside the view: `VoxelForest.ShadowSweep` (the sun's or moon's horizontal way per unit height, capped at 6; set by the test each frame): a piece or a 16-tile cell outside the frustum whose shadow reaches into it lists its shadow shapes only; `WorldView`'s tree cull lets such trees through. HDRP's own shadow culling needed no change (the forest is drawn with whole-map bounds). Up to 98 pieces drawn for their shadow only at 17:36.
5. The stonemason's stake torch removed (`RebuildLightsR9`, R11); he works by the night rule (with his torch in the film).
6. Lanterns: the lamp sits at 0.035 in the stone foot (accepted sample, kept); the tall tufts (to about 0.4) had straight-up normals, so the low lamp lit nothing of them. The tufts' meshes now carry their card's facing; the grass shader blends to it near fixed lights at night (`_HLTallMask` g = nearness from the map's ground light, `_HLLampNight` up to 0.65); unchanged by day and far from lamps. The map's lantern term uses the lamp's true height and, on grass, candela x 0.45 / d² (`LanternGrassReceive`).
7. Wooden waypoint fire: the accepted sample has only style A (stone foot, wooden post), no wooden version. Default per the order's fallback: style A everywhere. A wooden sample (style A's post, bands, cloth, basket and fire on two crossed squared timbers with four struts, same lamp height) behind the panel switch "Probestück: Holz-Wegfeuer an einfachen Gebäuden" (`-hlPathsWoodSample`). Stone tier: Great Hall, both stores (stone walls), the stone fire, the quarry (stonecutter's hut); wood: wood fire, ford fire, both woodcutters, forester, hunter, sawmill, well.
8. Moving fire (`PathsFire`): flame tongues of glowing kit voxels rebuilt each frame (height breathing and quick flicker, tips swaying in a draught, torn-off tips rising), sparks cooling yellow -> orange -> red; the fire light multiplied by the tongues' mean height (`BuildingFx.FireLightHook`; the test fires' own light too). Standing flames removed: the tablet without flames and sparks (`HsHearth.StaticFlames`, its own cache key), the catalogue hearth with its 198 glowing faces above the floor cut (`WorldView.ModelSwap`). Voxels: Heart Fire 1/80 (the kit's fine), hearth 1/40. At night the moving fire uses its own copies of the glow at 0.3 of the kit's.
- Also: a free dwarf at home at night without a clearly lit place within 7 tiles takes one within 14, else the nearest place that is not dark (the first benches at 70 %: about 1850 dwarf-s standing in the dark at their fires; final 30 / 8 s).
- Iterations: fire 3 (cut, colours and width, night glow), lanterns 2, clouds 1, darkness/dusk 1, close camera 2 (capture only), night home 1. Operational repairs 1 of 3 (build r11-3: CS1002, my edit put a comment inside a statement).

## R11.3 Measurements (bench 32 game minutes; `round11/logs/bench-table.txt`; build r11-4 = 9a8a6b3)
| Run | Logs/stones/game | Sites | Alone dark | Lit wait | Gave up | Back | Stand dark no torch | Walk dark no torch | Torch sw. per night dwarf-h | Flicker | Night work s / made / built | Weak wait | Crowded | Night ways longer | Max carried |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R10 6 | 89/105/13 | 8 | 7 s | 1921 s | 27 | 1.9 s | 4 s | 0 s | 0.342 | 13 | 754/71/18 | 139 s | 16 s | 21/462 | 1 |
| R11 escort 6 | 90/106/12 | 8 | 19 s | 1986 s | 31 | 1.3 s | 30 s | 0 s | 0.420 | 10 | 765/72/17 | 87 s | 0 s | 46/433 | 1 |
| R11 own 6 | 140/102/17 | 8 | 0 s | 0 s | 0 | 1.1 s | 30 s | 0 s | 0.713 | 66 | 1220/127/26 | 0 s | 0 s | 76/510 | 1 |
| R10 4 | 79/96/0 | 8 | 9 s | 2470 s | 41 | 1.1 s | 11 s | 0 s | 0.382 | 17 | 620/51/21 | 110 s | 41 s | 14/330 | 1 |
| R11 escort 4 | 77/70/0 | 8 | 4 s | 1878 s | 52 | 0.7 s | 5 s | 0 s | 0.396 | 3 | 366/25/22 | 52 s | 1 s | 12/221 | 1 |
| R11 own 4 | 132/98/0 | 8 | 0 s | 0 s | 0 | 1.6 s | 8 s | 0 s | 0.651 | 60 | 1170/108/28 | 0 s | 0 s | 39/451 | 1 |

Escort / own light (R11, 6 then 4 per fire): torches at once at most 16 / 24, 11 / 17; torch dwarf-s 8034 / 10621, 4569 / 9780; at a dark place at night 7143 / 7588 s (walking 6023 / 6230), 4374 / 7053 s (3396 / 5781); bearer calls 107 / 0, 50 / 0; own torches lit 0 / 202, 0 / 143. Round 10 mode ran at its own default darkness (0) without clouds. Stones: R10 105 / 96, escort 106 / 70, own 102 / 98.
Cost at night at the game camera (CostSample, 4 s each, `captures/r11_4`): frame GPU 6.69 ms (round 10 mode 6.58), fog sim 0.19 + render 0.41 ms (target 3 ms); moving fire off 6.56, cloud shadows off 6.59.

## R11.4 Commands
- verify-worker exit 0. Editor (hidden, -batchmode -nographics): compile-1, compile-2 exit 0; builds r11-1, r11-2 Succeeded, r11-3 failed (CS1002, repaired), r11-3b, r11-4 Succeeded (HDRP assets and Main.unity restored after each, `logs/hdrp-settings-rewritten-by-build.txt`); EditMode PathsTest + FogSystem 88/88 (`logs/editmode-paths-fog-final.xml`). 8 editor launches.
- Players (all rendering, minimised, windowed; chains `logs/chain-1..5`): r11_1; r11_2, r11_r10_2, r11_own_2; r11_3, r11_r10_3, r11_own_3 and six benches bench_* (build r11-3b, superseded); r11_4, r11_r10_4, r11_own_4 and six benches bench5_* (build r11-4, final). 22 player launches. The Human's open test player (pid 23760, r10) was not touched; nothing took focus.
- Final build `C:/GameDev/Hearthlands-Wege/Unity/Builds/HL-PathsTest-r11` (r11-4 = 9a8a6b3), starter `Wege-Test Runde 11 spielen.cmd`. `HL-PathsTest-r9` deleted; r10 and r11 kept.

## R11.5 Captures
Clips `round11/clips/` (MP4 H.264, 0.3-12.5 MB; round 10 above = `captures/r11_r10_4`, round 11 below = `captures/r11_4`): N1 fog dusk to morning (sped up), W1 cloud shadows, W2 with the map, B1 sunset camera pan, Q1 quarry at night, L1 lanterns in tall grass, F1-F8 Heart Fire and wood fire close and at the game camera, day and night; E1 escort (r11_4) above, own torch (`captures/r11_own_4`) below; H1 the wooden sample close (round 11 only). Stills `round11/vergleich_bilder/` (fog curve, darkness 70/85, lanterns with the map, doors stone/wood, hut close stone/wood, quarry, sunset). Look sheets `round11/sheets/`.

## R11.6 Still wrong (looked at every picture)
- At night the moving flames read nearly white (the fire's own light on their pale base colour); by day orange and red. Fire iterations used up (3); next step: a dark base colour for the flame voxels at night.
- The moving Heart Fire is on average lower than the old standing flames.
- Cloud shadows 70 -> 85 % are subtle; visible mainly at the edges of lights and in motion.
- The fog film's two halves differ also in darkness (round 10 mode at 0 %), not only in fog; the density change shows mainly at the border and the river.
- Close lanterns merge into one lit grass band.
- Escort at 4 per fire: 70 stones (round 10 mode 96) and night work halved at the darker night.
- The wooden waypoint fire is an unaccepted sample (switch only).
- Torch rings on the map still wide and pale (as round 10). Shadow popping judged from the pan film and the shadow-only count, not by a frame-by-frame scan.

## R11.7 Candidate files
Worker commit 9a8a6b3, `git diff --name-only 01ce275..9a8a6b3`, 28 files (`round11/logs/candidate-files.sha256.txt`, sha256 of the committed blob, size):

```
ext:Unity/Assets/_Project/Art/Shaders/HLPathsTallGrass.hlsl b9d27d4d1e2ed851f52836c516fb3522cc8752ac2ecf2368f817b06e09f88bd5 5736
ext:Unity/Assets/_Project/FogSystem/Runtime/FogFallbackVolume.cs 945380743c55f6cf492f59e4bcb81cdbdac37b6680ac8023939ec86e2ac554e5 10945
ext:Unity/Assets/_Project/FogSystem/Runtime/FogRenderPass.cs 07e24ff44a804ee807208b5f970ed80b208bfb5e29051132ec69bc69c2361ccf 30521
ext:Unity/Assets/_Project/FogSystem/Runtime/FogSettings.cs ef5f0af832031262a57e6f947c10b1cc25f2a0c9fea8c4797749114893297332 20818
ext:Unity/Assets/_Project/PathsTest/Editor/PathsBuild.cs 9c588b3a19c0e25eefbc5e7488f4b379fbed1c43dc75ce1c6e40974fcaf93bb2 13624
ext:Unity/Assets/_Project/PathsTest/PathsArt.cs 1f59eb6d5aa97a3253897b796340503c09a0f63b7d04fdad440c36d168387900 16971
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R11.cs 5d92a2019f5a12267fbcb94b373638292d2c9b4af589739c394c83e71c00d5d0 20023
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R11.cs.meta bca4ad840bb053b8f65a7185cf415f661a045ca91cca16a09dd4dbf2d1ffb25c 59
ext:Unity/Assets/_Project/PathsTest/PathsCapture.cs 54233e633b63cd7db6834962e66856c39d1d5f446607d684ea14f73ee0068fdf 20311
ext:Unity/Assets/_Project/PathsTest/PathsFire.cs 79885d20fc4cd1a46e52e9fd029169e1b19df142a54627d9170ddfa0041be38d 11108
ext:Unity/Assets/_Project/PathsTest/PathsFire.cs.meta ab780c7efc872e2c128c22627dbf8db8b266e11b4fb09cb263b35d6000f98d7d 59
ext:Unity/Assets/_Project/PathsTest/PathsFogBridge.cs 5aec29e84a1597949dc1429c1ed0e19704d6d20eef474e0ce25e53c87ae11658 27588
ext:Unity/Assets/_Project/PathsTest/PathsGame.Draw.cs 298f7420e1d1248af92b7d1f0d0800300d39bc6eef2ba4bc674036c00110b5a5 26213
ext:Unity/Assets/_Project/PathsTest/PathsGame.R10.cs bbc052679bd345cae18927fb419741ac729cdfb2438b3a4a4ad8a56ad8e91220 13433
ext:Unity/Assets/_Project/PathsTest/PathsGame.R11.cs 1bf14122646fefd4335deeea061cc37ec3665b1a67d5cd839f2426af6b55808e 27540
ext:Unity/Assets/_Project/PathsTest/PathsGame.R11.cs.meta 53ae222a44f40b8ad9fad1ad1691829bc45bf0fcbb4cfb7fdce44dae1b942500 59
ext:Unity/Assets/_Project/PathsTest/PathsGame.R9.cs ac1aea1ffc20bdb1b71750155a5748095b0c0a47bce03992dd0f901e33f809fd 36143
ext:Unity/Assets/_Project/PathsTest/PathsGame.cs f0dcd1efd9a5b460eb3714c2b24c308aa841bbdb89aa1635d1d878edea3cd9da 46838
ext:Unity/Assets/_Project/PathsTest/PathsPanel.cs 614d848a8e4e615bfffec0a602906f33abda8bdf72e99ce9f44d19b8b06095cd 25676
ext:Unity/Assets/_Project/PathsTest/PathsSettings.cs 8775c5261025500f0dd91f5169ff983227f27892cd39a83a7fab153e287b9b92 4781
ext:Unity/Assets/_Project/PathsTest/PathsSim.cs be0f1cf628aa1da5014e6d5da873e9d5bdd8f2b5d0773925c2379e87ba37a7ef 104006
ext:Unity/Assets/_Project/PathsTest/TallGrass.cs 930466941b334605725361db1d10504cffdddd54d67ceff62796b1f521ada348 17128
ext:Unity/Assets/_Project/Runtime/Presentation/BuildingFx.cs 90b69d481346c6be9824faad7ed4e200c25d4f5155b12ec4fb62a5c1e38c5bd7 18601
ext:Unity/Assets/_Project/Runtime/Presentation/DayLight.cs 77a8fb6f3db5b6572cba97c2045969490eb7675a70de6bbb5fdc241680872168 11316
ext:Unity/Assets/_Project/Runtime/Presentation/HallArt.cs 9db899b0c89ef9d631923f0925e8b8c381d3b23ea4ff613c7b98385676384741 31417
ext:Unity/Assets/_Project/Runtime/Presentation/HallKit/HsHearth.cs 3b3a657fd0313b19c71b13007175bd8996bfe0d87e303da72360884655e76425 11380
ext:Unity/Assets/_Project/Runtime/Presentation/Voxel/VoxelForest.cs 26575ec621834a9651bcc03eb0062fb75247905fd353ac616f0ef0ce683606ca 24382
ext:Unity/Assets/_Project/Runtime/Presentation/WorldView.cs a7ed74fd5d47c757db2099312189dbadeb82e5d81abe066de07a16309df41c80 142113
```

# Round 12: HL-PATHS-LOGISTICS-TEST-V1-R12

Worker (Claude Opus 5.5). Mode: Discovery. German note for the Human: `round12/ROUND_12.md`. Step log: `round12/PROGRESS.md`.
`wege`: 9a8a6b3 -> **99ea6aa**. Not pushed. The Studio evidence is not committed (as in rounds 9 to 11).
Every duration at the standard speed 1x (1 game s = 1 real s; a day 16 real min). The Human's clarification (measure faster, judge at 1x) is recorded in PROGRESS.

## R12.1 verify-worker
`PASS worker receipt 001330f4846e8173022b61df32533950584ec4fe20ed3f7991b0c26b033f2ab2`, exit 0, before any mutation.

## R12.2 What was built (by content point; all Proposals; round 11 on the same build with `-hlPathsR11`)
1. Desire paths: path timer (`-hlPathsPathTimes`: the first game second each fine cell reached each pass mark; `logs/path_times.py`, `logs/path_summary.py`), `-hlPathsPasses v,f`. 96-minute benches at 20/60, 10/30, 4/12, 5/15 (twice). New default **5 visible / 15 worn** (`PathsGame.PassesVisibleR12/PassesFirmR12`): busy routes visible after 3-4.5 real min (20/60: 23-31 min; 10/30: 5-9 min), worn after 12-20 min on the main routes (some 38-46 min); the hunter's way visible after about 5 min, never worn; the rarest way stays grass. 4/12 also wore the hunter's way (rejected).
2. Torch on the darkness map: each burning torch's ground light computed like the fixed lights (candela x cosine / d², the drawn torch light's 1300 lm, range 10, its measured height 0.75-0.80 over the ground), added to the fixed lights' and passed through the same picture-fitted curve (`TorchGroundLight`, `MapWithTorch`; key "Fackel: leuchtet wie jede Lampe"). Check against the picture (`DumpTorchCheck`, `logs/torch_check.py`, `vergleich_bilder/fackel_licht_bild_gegen_karte.png`): picture luma 125/80/38/23 at 0.25/0.75/1.25/1.75 tiles, map 0.98/0.73/0.37/0.21, the same fall-off. Round 11: dot, gap, ring at 2.6 tiles (seen).
3. Waypoint fires: `HsWayArt.BuildFireBasket` (shared by the stone and the wooden one; `small=false` keeps the accepted sample's values): basket 0.065 high (0.09), 0.03/0.056 wide (0.036/0.08), coals Ember/EmberRed/CoalGlow (no EmberHot middle), mound top 0.016, 6 embers (12), lamp at basket + 0.22 (look iteration 1: a lamp 4 cm over the rim burnt the basket white at night). `HallArt.SmallNode` (road nodes), `HallArt.NodeLampColour` = the torch colour; the door torch light in the torch colour.
4. Graphics options: cost at night, 2 views x 4 quality levels x 2 repeats, on a quiet GPU (`logs/cost-table.txt`, GPU load `logs/gpu-load-r12_cost_5.csv`; the first cost run was disturbed by the other Worker's ComfyUI, frame GPU 45-78 ms, discarded): frame GPU 5.4-7.6 ms; moving fire off: no measurable GPU saving (-1.4 .. +0.7 ms, sign varies), CPU about 0.35 ms per frame (own timer); lamp grass off: GPU nothing, CPU at most 0.1 ms. "bewegtes Feuer" is a player option in the panel's "Grafik" (candidate for the options menu); the lamp grass stays a test switch (saves nothing). Fires at night: dark base colour (0.08) on the moving fire's own materials, the hottest voxels in ember yellow; glow and tint over 3 iterations (0.6: salmon pink 254/188/168; 0.15 + tint: dark red; final 0.28, tint 1/0.8/0.36: coral red-orange 242/160/141, no white). Lantern grass: side light 0.45 (0.65); an amber lamp was tried and rejected (grass olive, hue 39 deg against 23).
5. Territory: `TerritoryRefusalR12` in `FireRefusal`: area = the game's full radius of a small fire's hearth (9.76 tiles), at most 50 % outside (round 1's rule), the fire and its door on own land (else the game cannot hold it and the territory cannot grow); reasons in the preview, the ring at the real area, the hint with the growth share. On finishing (`AfterFinishR12`): own tiles 936 -> 1036, hearth radius 10.0, lanterns laid anew 71 -> 75 (`LanternsChangedR12`: lights, darkness map and lamp grass follow at once; the fog shield follows the territory version, seen in T1). Construction at 1x 4.6 real min. Round 11 mode: the far spot accepted, nothing grows.
6. Fireflies: `LifeView.FireflyClusters/FireflyAt/PlaceFireflies` hooks; each night (noon to noon) each cluster takes a new place at a forest edge (32 places) or a river bank (28) on or within 3 tiles of the own land, at least 8 tiles from fires and 6 from last night's (measured 8-32), drifting 3-7 tiles through the night. Round 11: two fixed places.
- Iterations: fire 3 (cap reached), waypoint 1, lanterns 1, territory capture 1, fireflies 2 (spots built before the trees existed; spots in the unexplored fog). Operational repairs 1 of 3 (compile-1 CS0102: method `FireBasket` clashed with the constant; renamed). One player crash not from this code: r12_flies_2, d3d12 device removed (887a0006) while the other Worker's GPU job ran; repeated as r12_flies_3 without change.

## R12.3 Measurements (bench 32 game min = 32 real min at 1x; `round12/logs/bench-table.txt`; build r12-3, same sim code as the final r12-5)
| Run | Logs/stones/game | Sites | Alone dark | Lit wait | Gave up | Back | Stand dark no torch | Walk dark no torch | Torch sw. per night dwarf-h | Flicker | Night work s / made / built | Weak wait | Crowded | Night ways longer | Max carried | Path cells vis+firm |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R11 6 | 83/102/11 | 8 | 9 s | 1914 s | 31 | 1.4 s | 9 s | 0 s | 0.36 | 6 | 648/59/17 | 78 s | 5 s | 32/365 | 1 | 722 |
| R12 6 | 86/105/13 | 8 | 11 s | 2363 s | 50 | 1.7 s | 16 s | 0 s | 0.406 | 16 | 664/63/19 | 69 s | 2 s | 46/374 | 1 | 3059 |
| R11 4 | 73/71/0 | 8 | 6 s | 2085 s | 40 | 0.7 s | 7 s | 0 s | 0.323 | 4 | 381/26/25 | 74 s | 2 s | 5/200 | 1 | 536 |
| R12 4 | 77/94/0 | 8 | 7 s | 2143 s | 40 | 1.1 s | 10 s | 0 s | 0.437 | 7 | 491/41/18 | 58 s | 9 s | 22/296 | 1 | 2040 |

Path benches (96 real min at 1x): `round12/captures/pathbench_*`, the table in ROUND_12.md.

## R12.4 Commands
- verify-worker exit 0. Editor (hidden, -batchmode -nographics): compile-1 failed (CS0102, repaired), compile-2 exit 0; builds r12-1 .. r12-5 Succeeded (HDRP assets and Main.unity restored after each, `logs/hdrp-settings-rewritten-by-build.txt`); EditMode PathsTest + FogSystem 88/88 (`logs/editmode-paths-fog-final.xml`). 8 editor launches.
- Players (all rendering, minimised, windowed; chains `logs/chain-1..4`, `logs/run-cost-quiet.ps1`): chain 1 (10), chain 2 (10, one GPU device-removed crash), chain 3 (10), chain 4 (3), cost 5 (1, after 600 s of quiet GPU), smoke r12-5 (1). 35 player launches. No player of the Human was open; nothing took focus; the Zwerge Unity and the AnimTools processes were not touched.
- Final build `C:/GameDev/Hearthlands-Wege/Unity/Builds/HL-PathsTest-r12` (r12-5 = 99ea6aa), starter `Wege-Test Runde 12 spielen.cmd`. `HL-PathsTest-r10` deleted; r11 and r12 kept.

## R12.5 Captures
Clips `round12/clips/` (MP4 H.264, 0.5-10.9 MB; round 11 above = `-hlPathsR11` on the round 12 build, round 12 below): P1 paths forming (30 real min), K1/K2 torch with and without the map, W1-W6 waypoint fires (wood/stone close, day/night, doors), F1-F6 fires, L1 lanterns in the grass, T1 construction and the border, T2 the night after, G1 fireflies over one night. Capture dirs: paths r11_paths_2/r12_paths_3, torch r11_torch_4/r12_torch_4, look r11_look_2/r12_look_4, territory r11_terr_2/r12_terr_3, flies r11_flies_3/r12_flies_3. Stills `round12/vergleich_bilder/`; look sheets `round12/sheets/`.

## R12.6 Still wrong (looked at every picture)
- Fires at night coral red-orange, not warm yellow-orange; the Heart Fire looks duller at night than by day. Fire iterations used up (3).
- The waypoint fires' coals read pale orange-pink at night (the kit's night glow of the same ember colours the torches use); the door light in torch colour tints the ground strongly orange-pink.
- Lantern grass: only a small change from round 11.
- Fireflies are faint (12 points per cluster), hardly seen from the overview; the night 3 overview did not frame the clusters.
- The wholly-outside preview's red ring lies under the unexplored land's fog (the reason text is shown).
- With 5/15 busy areas sometimes show two or three parallel tracks.
- The torch films' halves show different dwarves (the runs diverge).
- Waiting at light and giving up vary between benches (R12 6: 2363 s / 50 against R11 6: 1914 s / 31; at 4 per fire equal).

## R12.7 Candidate files
Worker commit 99ea6aa, `git diff --name-only 9a8a6b3..99ea6aa`, 20 files (`round12/logs/candidate-files.sha256.txt`, sha256 of the committed blob, size):

```
ext:Unity/Assets/_Project/PathsTest/Editor/PathsBuild.cs 4da404411db2cde4b2bc455fdf24475b9057f44cfc44e5b532f9f29c52ef86e9 13626
ext:Unity/Assets/_Project/PathsTest/PathsArt.cs 4b7331135bc0641250aee6dbec10ba5bb9d3ad93dc64b90575a7e29b9313e7d7 15059
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R12.cs 88d02aa7e7de39dfaec2453bbd48d84b0a617025afe3da134951f444fd14e4bb 23822
ext:Unity/Assets/_Project/PathsTest/PathsCapture.R12.cs.meta f2396be6473aa1c3b7521797ea1b74a4a5bd18ea38b1566c21496707fe6a398a 59
ext:Unity/Assets/_Project/PathsTest/PathsCapture.cs e55961609f4b85dfd74763a5ca6d8a0485c9e94c836f5d8f1bedf97e3b93c73a 20465
ext:Unity/Assets/_Project/PathsTest/PathsFire.cs 2e0aece5d3ff6c77fe0827c575b9bc14635b34e0fbef6df8bb0f89075aefcc4c 12893
ext:Unity/Assets/_Project/PathsTest/PathsGame.Draw.cs 37cba4f68881366fb6518e1f343b84dafc00b565171443da18b9672d8cd1f064 26336
ext:Unity/Assets/_Project/PathsTest/PathsGame.R10.cs 5b8d04517b2bf54cbafe0a54e82d37b6210699315c5d91bcae706453553318ea 13555
ext:Unity/Assets/_Project/PathsTest/PathsGame.R11.cs 44e9bc8ecc152345cd92ee8b827f47385b71d6f9faf79b030674ab64a94d5575 28062
ext:Unity/Assets/_Project/PathsTest/PathsGame.R12.cs ee5fdd16ebb68398373accdfa7ae906288abb3d828acf138bf2ab380cc53e611 30993
ext:Unity/Assets/_Project/PathsTest/PathsGame.R12.cs.meta ad1fa23bb8f21ae03143835b7c41378ccb87609b1ed1b71cc144c3eaa35320e1 59
ext:Unity/Assets/_Project/PathsTest/PathsGame.R8.cs 37b9e48966d37760f59f3636c8b5962054daf5e8839af89a87ba85a81a8ab903 41629
ext:Unity/Assets/_Project/PathsTest/PathsGame.R9.cs 109266949496dec5a312d0c11fdd74ab78d46f66dcf2185d0025a5c824a072db 37092
ext:Unity/Assets/_Project/PathsTest/PathsGame.Tools.cs 6c6f8a3d572387f86d218922198d86b0187cd0026b9d2817a1adcd6943bc5bb7 21785
ext:Unity/Assets/_Project/PathsTest/PathsGame.cs 98a0556025073461769bbdd3752b65e2f646c2b87de0f3666e47247eb79b90d1 47244
ext:Unity/Assets/_Project/PathsTest/PathsPanel.cs bec0c9d359e9a765526da76fbbe74ac60b99c64c29dd33faedfd1881b6f6d304 26537
ext:Unity/Assets/_Project/Runtime/Presentation/HallArt.cs 743e91e5782009818b3a927bc69a9a36c51ef553472ea14311df0bdf404347b2 32087
ext:Unity/Assets/_Project/Runtime/Presentation/HallKit/HsWayArt.cs abf92de09fea411b7eb28f5dda3418802393d10cadf13f668710d29167d3f956 19582
ext:Unity/Assets/_Project/Runtime/Presentation/LifeView.cs 917428ba831a54b153e41df90aa102063b3f7b184e10f45ffcf7c6a06af8bd86 15585
ext:Unity/Assets/_Project/Runtime/Presentation/WorldView.cs eb399b41ed784377e8e6e9b755379ffeda28bb140ce4d496261db4181e5c4e24 142230
```

# Round 13

Work Order HL-PATHS-LOGISTICS-TEST-V1-R13. Worker commit c1a1f95 on `wege` (start 99ea6aa), not pushed. Build `Unity/Builds/HL-PathsTest-r13`, starter `Wege-Test Runde 13 spielen.cmd`. Evidence `round13/`.

## R13.1 What was reverted
- `PathsFire.cs` restored to its round 11 version (9a8a6b3): removed `DarkNight`, `NightBase` 0.08 (dark night base colour), `NightGlowDark` 0.28 (round 12 iterations 0.6 / 0.15 / 0.28), `NightTint` 1/0.8/0.36, and the night flame colour choices (EmberHot / Ember for FlameCore / Flame); night glow 0.3 of the kit's again.
- `PathsGame.R12.cs`: the line `Flames.DarkNight = true` and the log words "flames dark-based at night" removed.
- `PathsBuild.cs`: starter text and name now Runde 13 (needed for the starter only).

## R13.2 Proof
Same cameras (route r12 part look): round 13 (`r13_look_1`) against round 11 mode on the same build (`-hlPathsR11`, `r11_look_1`). Clips F1 to F6 in `round13/clips`, stills `round13/vergleich_bilder`, pixel numbers `round13/logs/pixel-compare.txt`. Flames match in colour and brightness (animation phase differs); surroundings differ slightly because round 13 keeps the other round 12 changes.
Launches: 1 editor build (hidden, no graphics), 2 players (minimised, windowed, both rendered).

## R13.3 Candidate files
`git diff --name-only 99ea6aa..c1a1f95`, 3 files (`round13/logs/candidate-files.sha256.txt`):

```
ext:Unity/Assets/_Project/PathsTest/Editor/PathsBuild.cs 939006126085fbb592ddc7faacfe55381f02cf51793e50e3729ed19a6a308ac1 13430
ext:Unity/Assets/_Project/PathsTest/PathsFire.cs 79885d20fc4cd1a46e52e9fd029169e1b19df142a54627d9170ddfa0041be38d 11108
ext:Unity/Assets/_Project/PathsTest/PathsGame.R12.cs fab9a10f1aab8246d3a5db67e7d47b7dc7ec265a7603e3a335a67cfa91deb750 30908
```
