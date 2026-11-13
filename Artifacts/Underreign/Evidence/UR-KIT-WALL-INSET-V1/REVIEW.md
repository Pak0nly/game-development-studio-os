# Independent review UR-KIT-WALL-INSET-V1 (QA Lead)

Verdict: **PASS**. Candidate identity (recomputed from working-tree bytes, 309 files, every file hash and size matches the list):
`09bac3ebc5df76664a127f8d9e0dc2713addbe194d9f31e4f555e58c440a41d5`.

## Checks

1. Scope - OK. `git status -uall` of C:/GameDev/Underreign shows only paths under ArtSource/EnvironmentKit, Design/Art/ENVIRONMENT_KIT_2M.md and Evidence/UR-KIT-WALL-INSET-V1; the set equals the ext: part of the candidate list exactly. Studio part: only Artifacts/Underreign/Evidence/UR-KIT-WALL-INSET-V1/WORKER_RESULT.md. Game, SimulationCpp, StyleSample untouched. The work folder under Underreign_Assets/AnimWork/UR-KIT-WALL-INSET-V1 holds no frame folder (only old/, old_previews/, stills/ with still PNGs, logs, scripts, json); the temporary frame folder is gone.
2. Goal numbers - OK. measure_new.json: max protrusion 0.034-0.040 m per stratum (limit 0.05); corner pieces/ends/pillars 0.034-0.050 m (the 0.050 is exactly at the limit, not above); mean 1-cell corridor width 2.265-2.367 m (>= 1.95); narrowest 1.92-1.93 m. measure_old.json gives the night-4 baseline (mean 1.61-1.72 m, matches the order's statement). seamcheck.json: largest seam gap 2e-6 mm over 240 face pieces (limit 0.1 mm). coverage_new_{Cut,Low,Full}.json: 806,400 rays each, holes 0, cap_gaps 0 of 583,161 rock points. Measuring script (inset_study/measure.py) imports the real kit builder `ur_kit`, builds the actual face geometry (`face_patch`, `piece_geo` vertices), and derives protrusion and width from vertex positions over all variant pairs, mirrored or not - not a constant. Limitation: it measures built geometry, not re-imported FBX; acceptable because the FBX are exported from that same geometry.
3. Images (viewed): proof_section_old_vs_new_G15 and _CL15 show the relief now behind the cell edge, corridors visibly wider, no holes or gaps; seamrow_old_vs_new_Stone shows the same rock texture/relief character, set back, with visible vertical piers at the 2 m seams; proof_section_new_corner_closeup shows closed corners and caps, no see-through. A thin dark line at the wall foot in the close-up is shadow along the plinth, not a hole (ray coverage 0 holes).
4. verify-worker line - OK. Studio WORKER_RESULT.md contains `PASS worker receipt 7f8ba9f2ebb4cbd0f992f42d35ea7f3c1bf131fd5f8ba4045afbe13851b17e1c`.
5. Deviations - honestly reported in the Worker result (findings 1-7); none violates the order. Block-top classes Open0-Open4, moved FloorEdge scree, 0.44 m seam piers, 1 mm sunk cap strips are all needed to reach the goal and stay inside the allowed paths (FloorEdge is within ArtSource/EnvironmentKit). The fracture and proof_pan previews were not refreshed (no ffmpeg); the order requires only the new 360 pan (delivered as MP4 + GIF), so this is a minor gap, not a fault.

## Blocking faults
None.

## Information for the Human (look changes, not faults)
- Every cell edge now shows a calm pier about 0.44 m wide between the receded reliefs: a visible 2 m rhythm along walls. If disliked, the seam itself must recede, which needs a different closure at outer corners/ends.
- Mean width is 2.27-2.37 m, above 2.0 m, because the relief keeps its depth and sits behind the edge.
- Outer corners lost their bulge; inner corners have a much smaller fillet.
- Unreal placement must now pick a trimmed block-top class and yaw per rock cell (standard changed; unreal/setup_kit_proposal.py untested). Cap strips of two faces overlap in the outer-corner square; possible flicker in Unreal.
- FloorEdge scree was moved behind the edge (not named in the order, but necessary for floor-level width).
- fracture_* and proof_pan previews are stale; FBX bytes all differ (Blender 5.2 vs 5.3 and timestamps), geometry as reported.
- The pan (MP4/GIF) was not played by the reviewer (no video playback); the Worker reports frames checked.
