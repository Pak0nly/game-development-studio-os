# Independent review UR-KIT-WALL-CONTINUOUS-V1 (QA Lead)

Verdict: **PASS** (open points below are minor / already listed by the Worker).

## 1. Scope
`git status --porcelain` in C:/GameDev/Underreign: every changed/new path lies under ArtSource/EnvironmentKit, Design/Art/ENVIRONMENT_KIT_2M.md, Game/Underreign/Source/Underreign (only URGreyboxMap.cpp, URCaptureDirector.cpp), Game/Underreign/Content/Environment (Kit/**), Game/Scripts, Game/Captures/wallcontinuous, Game/README.md, Evidence/UR-KIT-WALL-CONTINUOUS-V1. Only exception: Game/Underreign/Content/Greybox/M_UR_Greybox.uasset (known, excluded by the Director; noted, not a fail). No change in SimulationCpp, Source/UnderreignSim or StyleSample. Studio copy of WORKER_RESULT.md contains `PASS worker receipt aa26a320...acb61a`.

## 2. Visual check (all opened and looked at)
- long_wall_6cells_front Stone: old shows dark vertical piers/grooves every ~2 m (clearly visible). New: one continuous rock face, no vertical line, groove or band; no repeat rhythm visible.
- long_wall_6cells_gamecam Stone: old has notches/peaks and a vertical split in the outline at seams. New: ragged but continuous cut outline, no seam lines, no 2 m rhythm.
- corridor_eye Stone: old has flat piers and straight vertical edges. New: irregular rock on both sides, no regular pier or groove; plausible natural rock.
- corner_outer_eye: old sharp box edge with a dark slit; new a rounded rock corner, no slit, floor foot patch OK.
- corner_inner_eye: old has a thin vertical slit line; new a filled rounded hollow, no slit.
- corner_pillar_eye: old has a hard box edge; new a rounded block, no slits (steps on the right side are rock/relief).
- corner_diag_eye: old has an edge line and a hard corner; new one rounded mass, no slit; faint darker band down the middle is a shading fold, not a gap.
- proof_section_G15 (game camera): old shows notched cut edges at seams; new continuous edges; no slits, holes or white bands.
- pan360 frames 0/30/45/60/90/105: no slits, holes, white bands or dark squares; cut outlines continuous.
- game/kit_l2_full: scanned rock cap, uniformly dark, no visible seam, hole or band (floor shows through at the open corridor only).
- game/kit_l2_low: low walls with a continuous jagged outline; no 2 m rhythm; thin dark vertical lines on the red floor tiles are floor tile edges/shadow, not wall seams.
- game/kit_close_outer_corner_low: rounded/jagged outlines, no slits at the corner, no white band.
- game/kit_close_long_wall_low: wall outlines continuous; no piers; the dark vertical strip over the floor is a floor/shadow edge. (Worker's earlier white band was a first-run mesh-not-ready artefact; rerun is clean, as stated.)
- game/kit_close_corridor: continuous rock faces both sides, no pier rhythm, no slits.
Game images are very dark (unchanged lighting, open point 6); nothing seam-like seen. No FAIL-level seam, pier, 2 m rhythm or slit at game distance.

## 3. Numbers
measure_old_inset.json vs checks_new_testlayout.json reproduce the table (Cut): max protrusion Soil 0.034->0.030, Stone 0.040->0.050, Gold 0.034->0.050 (cap 0.05, within limit); mean 1-cell corridor 2.27-2.42 m (>= 1.95 m); seam band minus rest +0.095..0.144 -> -0.022..+0.035 (pier gone); seam gaps worst 4.07e-05 mm (< 0.1 mm) over 960 face pieces. closure_new_real_section.json: no escaping or hole rays at Cut/Low; 2 tangential back-face and 3 vertical holes at Full (as disclosed, open point 3).

## 4. Code diff
URGreyboxMap.cpp: face kind by open neighbour along the wall, no variant repeat rule, WallDiag for diagonal rock (presentation only, no rules/sim data). URCaptureDirector.cpp: extra wallsample stills. setup_kit.py / Blender scripts: new kinds and widths. No SimulationCpp/UnderreignSim change; test_sim.log: golden hashes all match expected (e.g. 1e90d79f1f144be0), 8/8 automation tests Success, UR_KIT RESULT PASS, UR_WALL RESULT PASS.

## 5. Scans
Content/Environment/Scans (and StyleSample ScansV2/V3) are git-ignored (`!!`); no scan texture file appears in the status list.

## Minor/open (not failing)
Basalt seam waviness, calm line at arm's length in Soil, residual ray hits, Full-wall scene dark, faint 2 mm cap steps, M_UR_Greybox.uasset re-save.
