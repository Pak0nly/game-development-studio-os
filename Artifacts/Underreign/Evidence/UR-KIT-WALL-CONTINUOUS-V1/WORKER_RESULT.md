# Studio copy of the Worker result (UR-KIT-WALL-CONTINUOUS-V1)

verify-worker (Studio root, before any change): `PASS worker receipt aa26a320579bdb523b9204705948751c3e1f0719bf6494960199d5bba1acb61a`

External evidence: `C:/GameDev/Underreign/Evidence/UR-KIT-WALL-CONTINUOUS-V1/` (images, films, JSON, logs). Text below is the external WORKER_RESULT.md unchanged.

# Worker result UR-KIT-WALL-CONTINUOUS-V1 - rock walls as one continuous natural surface (no seam piers), then in the game

Project Underreign (DEC-043), Worker of the Claude-directed order, Production mode, Standard class. Not committed, not pushed.
Gate: `verify-worker` printed `PASS worker receipt aa26a320579bdb523b9204705948751c3e1f0719bf6494960199d5bba1acb61a` before any change.
Local Blender 5.2.3 (background, below-normal priority, CPU), Unreal 5.8 (headless or offscreen, below-normal priority, 30 fps cap,
gentle quality, started directly without the Windows shell, one editor at a time). External repository `C:/GameDev/Underreign`
(main, base commit 3c8cac0); paths below are relative to it.

## Summary

The 0.44 m pier at every 2 m cell edge is gone. A wall is now one continuous rock surface along any length and around corners:

- **Seams.** Two faces meet on one shared, rough rock column that lies at the relief's own mean depth (about 0.2 m behind the cell
  edge, wandering 0.05-0.33 m behind it with the height). Each face is its **own variant's rock everywhere**, bent toward each end
  onto that column (the bend fades out 0.22-0.6 m from the end, wandering with the height and different per variant and end) and
  flat across it; both neighbours carry the same custom normal on the column, so the light runs on across the seam. Nothing but the
  column is shared, so nothing repeats every 2 m. (First attempt, as suggested in the order: a shared seam band of rock 0.3-0.5 m
  wide on each side. The renders showed its features - a ledge and a crack - again at every seam, a 2 m repeat; replaced.)
- **Outer corners.** Faces that run to the cell vertex at a receded depth always leave the last 0.2-0.3 m of one face standing in
  front of the other (the inset Worker's slits). So a face end that meets an outer corner is now **shortened by 0.42 m** (new kinds
  `WallFaceL`, `WallFaceR`, `WallFaceLR`) and `WallOuter` is a **rounded rock corner** (radius 0.25-0.30 m) between the two
  shortened ends, tangent to both, behind the cell vertex, with a small floor patch in front of its foot. A buttress that covers the
  face ends was tried first: it read as a box edge and made pillars look notched; replaced.
- **Diagonal rock cells.** One new `WallDiag` (two concave fillets back to back, a rock bridge 8 cm thick at the vertex) instead of
  the two `WallInner`.
- **Inner corners.** A wide concave fillet (radius 1.55 m) that passes the vertex and overlaps the face ends: no slit, no pocket.
- **Repeats.** Three equal variants side by side were the most visible 2 m repeat left (the test wall showed C C C). Neighbouring faces
  now never repeat a variant (A/B on even cells along the wall, C/D on odd cells); faces are not mirrored (the game never mirrored).
- **Scree.** `FloorEdge` had a dip at every seam; now one shared height profile at the ends, and `FloorEdgeL/R/LR` run out before
  outer corners (Blender kit only; the game does not place scree yet).

Joints are exact (largest gap 0.00004 mm, all 960 face pieces, outer corners and diagonal joints, every stratum, variant, height
and level of detail), nothing stands more than 0.05 m into an open cell, the mean clear width of a 1-cell corridor is 2.32-2.42 m.
In the game the kit imports (`UR_KIT RESULT PASS`, 600 meshes), the build passes, all 8 automation tests pass, golden hashes are
unchanged, and the captures show continuous walls and rounded corners.

## Old (INSET-V1) against new: widths and depths (all 4 variants and every variant pair, mirrored or not, 0-3 m, `_HI`)

| Stratum | Max into the open cell (m) | Mean depth (m, negative = behind the edge) | Seam band minus rest (m, + = pier) | Mean clear width, 1-cell corridor (m) | Narrowest (m) | Wall area narrower than 1.95 m |
|---|---|---|---|---|---|---|
| Soil | 0.034 -> 0.030 | -0.160 -> -0.184 | +0.114 -> +0.006 | 2.319 -> 2.368 | 1.932 -> 1.940 | 6.3 % -> 1.6 % |
| Stone | 0.040 -> 0.050 | -0.140 -> -0.168 | +0.108 -> -0.008 | 2.279 -> 2.337 | 1.920 -> 1.900 | 6.6 % -> 1.7 % |
| Basalt | 0.034 -> 0.030 | -0.159 -> -0.190 | +0.109 -> -0.016 | 2.318 -> 2.381 | 1.932 -> 1.940 | 6.6 % -> 1.6 % |
| Gold | 0.034 -> 0.050 | -0.132 -> -0.161 | +0.095 -> -0.022 | 2.265 -> 2.322 | 1.932 -> 1.900 | 6.6 % -> 1.7 % |
| Bedrock | 0.034 -> 0.030 | -0.183 -> -0.209 | +0.144 -> +0.035 | 2.367 -> 2.417 | 1.932 -> 1.940 | 6.3 % -> 1.6 % |

"Seam band minus rest": mean depth of the 0.44 m band round each seam against the rest of the face (the inset pier stood 0.10-0.14 m
forward; now within -0.02..+0.035 m, i.e. no band). The maximum 0.050 m is the hard cap (`CAP_D`); the narrowest 1.90 m is where two
such points meet.

Corner pieces, how far they reach into the open cells (m; outer corner / end / pillar: outside the rock cell; inner corner and
diagonal joint: into both corridors at once):

| Stratum | WallOuter | WallInner | WallDiag (new) | WallEnd | WallPillar | face kinds incl. ore and roots | Crack1 / Crack2 / Dug |
|---|---|---|---|---|---|---|---|
| Soil | 0.050 -> 0.030 | 0.043 -> 0.004 | 0.040 | 0.050 -> 0.030 | 0.050 -> 0.030 | 0.034 -> 0.030 | 0.034 -> 0.030 (all three) |
| Stone | 0.050 -> 0.030 | 0.042 -> 0.008 | 0.040 | 0.050 -> 0.050 | 0.050 -> 0.050 | 0.040 -> 0.050 | 0.037 / 0.036 / 0.034 -> 0.050 |
| Basalt | 0.034 -> 0.030 | 0.044 -> 0.000 | 0.040 | 0.038 -> 0.050 | 0.043 -> 0.050 | 0.034 -> 0.050 | 0.034 -> 0.030 / 0.043 / 0.030 |
| Gold | 0.050 -> 0.030 | 0.046 -> 0.007 | 0.040 | 0.050 -> 0.050 | 0.050 -> 0.050 | 0.034 -> 0.050 | 0.036 / 0.042 / 0.034 -> 0.050 |
| Bedrock | 0.036 -> 0.030 | 0.035 -> 0.002 | 0.040 | 0.036 -> 0.030 | 0.036 -> 0.030 | 0.034 -> 0.030 | - |

`WallOuter` 0.030 is the plinth at the floor only (above 0.4 m the rounded corner stays 0.2-0.3 m behind the vertex).

## Closure checks (`scripts/continuous_study/checks.py`)

- Joint gaps: face ends against the shared columns 0.00004 mm, outer-corner ends 0.000007 mm, diagonal-joint ends 0.00004 mm
  (960 face pieces: 4 face kinds x 5 strata x 4 variants x 3 heights x 4 LODs; corners the same). Inner fillet ends lie 0.10 m
  behind the deepest face relief.
- Ray test (single-sided, as in the game): test layout and the real map section, Cut / Low / Full. Horizontal rays from every open
  cell (9 points x 5 heights x 72 directions; 233,280 per height on the test layout, 395,280 on the real section) must hit the
  front of rock; vertical rays on a 5 cm grid (268,800 / 804,800 per height) must hit something facing up.
  Result: **no ray escapes and no hole in caps or floors at Cut and Low**; left: 1-2 horizontal rays per height that touch the
  curved outer-corner rock almost tangentially from behind (Cut: 1 of 233,280 test, 2 of 395,280 real; Low and Full 0), and at
  Full height 1 (test) and 3 (real section) vertical rays of 268,800 / 804,800 that hit the underside of a noise fold on one inner
  fillet variant (D) right at a cell vertex. Earlier rounds found and fixed: inverted inner-fillet winding and cap, a cap fan that
  doubled back at the diagonal joint and at noisy fillet ends, scree ends open at outer corners, steep facets on the corner arcs.
- Budgets: all pieces within the standard's budgets (`stats/SUMMARY.md`; new kinds: faces as `WallFace`, `WallDiag` <= 6,000 /
  600 / 240 / 120, measured 1,878-4,678 / 172-412 / 80-164 / 54-110).

## What I saw in the images (all looked at)

- **Long 6-cell wall** (front, oblique along it, game camera; all five strata): the inset kit shows the calm vertical piers every
  2 m (and peaks / notches in the cut outline at every seam from the game camera); the new kit shows one rock face, no vertical line,
  groove or band at the seams (seam ticks drawn on copies of the renders to check where to look), the cut outline is ragged and
  continuous. With the old variant rule three equal variants in a row repeated visibly; with the new rule that is gone.
  Close-up at a seam (2.5 m): no line; the zone 0.1 m around a seam is slightly calmer sideways in smooth rock (Soil), not visible
  at the game camera. Basalt: columns near seams are bent a little (wavy), see open points.
- **Corners** (eye height and game camera): outer corner = rounded worn rock corner (old: sharp box edge); inner corner = filled
  rounded hollow (old: vertical slits); wall end and pillar = rounded block (old: box with slits); diagonal joint = two rock cells
  joined by a narrow rock bridge. The first buttress version (rock forward at the vertex) looked boxy and the pillar notched: replaced.
- **Proof section** (Cinder Hollow layer 2, game camera pitch 70, FOV 65; G15, G3, CL15, OB3, CO15 old vs new): old shows seam
  piers and slits along "main" and "link", new shows continuous walls and rounded mouths.
- **360 degree pan** (4 s, proof section, new kit): frames 0, 30, 45, 60, 90, 105 checked: no seams, no slits, no dark squares.
- **Game** (scanned rock): Layer 2 full and low walls, overview, close corridor, long wall and outer corner close (full and low),
  turn frames 0, 30, 60, 90, 120, 150: walls continuous, outlines without 2 m rhythm, rounded corners. The first capture run showed
  a white band at one rock cell in the low-wall long-wall still: the new Low meshes were still being built (first use after the import;
  the log waits on them); a second run with the derived data ready shows rock there (`game/firstrun_low_mesh_not_ready_vs_rerun.png`,
  left = rerun, right = first run). The reported captures are the second run.
- Thin straight lines on some caps of ends/pillars at the game camera (Blender `corner_end_gamecam`): the 2 mm step between the
  corner cap and the block top; also faint in the inset kit.

## Tests

- `setup_kit.sh`: `UR_KIT RESULT PASS`, 600 meshes (Soil, Stone, Basalt, Gold, Bedrock x Full, Low x 10 kinds/classes x 4), axis
  test PASS, scans imported (about 20 min while Blender rendered).
- `build.sh`: exit 0 (`URGreyboxMap.cpp`, `URCaptureDirector.cpp` recompiled).
- `test_sim.sh Underreign`: 8 of 8 Success (WallRules, CommandPath, GoldenReplays, LinkPrecheck, LinkReach, PlayerOrders 103
  checks, SyncManifestGuard, TypeInfo). Golden hashes unchanged: reasonable_seed1_won 1e90d79f1f144be0, reasonable_seed12_lost
  c93dd97e0daee4d5, banner_seed4_won 89acda19d5372052, idle_seed1_lost cd052f1d3209fb89, doors_seed1_won 1d60929da14c21e4,
  newintruders_seed1_won 9a34e0e7c76a16ee, crownkiln_seed1_lost eafd44ab1599bde1, ashthread_seed1_won f6b2c1561b91778b,
  inkdrip_seed3_won 98ec80e889ebfd11.
- `capture.sh wallsample` (URGENTLE=1, -URMaxFPS=30, VSync, quality 2, offscreen): `UR_WALL RESULT PASS (0 failed)`, parity PASS at
  tick 10800, 0 missing kit meshes, frame times (game running, 1920 x 1080): GPU 4.92 ms, game thread 2.31 ms, render thread
  4.98 ms (WALLSAMPLE: 4.93 / 2.37 / 5.29). During the turn the game thread mean is 200 ms because every frame is written to disk.

## Changed files

External (uncommitted): `ArtSource/EnvironmentKit/scripts/{ur_kit,build_walls,build_floors,build_proof_scene,export_placement,render_previews,summarize_stats}.py`,
`scripts/inset_study/inset_study.py` (camera pitch from `UR_STUDY_PITCH`, default unchanged 72), new `scripts/continuous_study/`
(`proof.py`, `proof_map.py`, `checks.py`), `ArtSource/EnvironmentKit/{README.md,blend/*,fbx/*,stats/*,placement/*,previews/*}`
(rebuilt; new FBX `SM_UR_WallFace{L,R,LR}_*`, `SM_UR_WallDiag_*`, `Floors/SM_UR_FloorEdge{L,R,LR}_*`), `Design/Art/ENVIRONMENT_KIT_2M.md`
(revision note, summary, 1, 1.1, 1.2, 2, 3.1, 4, 9, 11), `Game/Scripts/setup_kit.py` (new kinds, widths of shortened faces),
`Game/Underreign/Source/Underreign/Private/URGreyboxMap.cpp` (face kind by the open neighbour along the wall, variant rule,
diagonal joint), `URCaptureDirector.cpp` (wallsample: close stills of the long wall and the outer corner, full and low),
`Game/README.md`, `Game/Underreign/Content/Environment/Kit/**` (re-imported, ignored scans unchanged), `Game/Captures/wallcontinuous/`,
`Evidence/UR-KIT-WALL-CONTINUOUS-V1/`.
**Outside the allowed paths:** `Game/Underreign/Content/Greybox/M_UR_Greybox.uasset` was re-saved by `setup_kit.sh` (its step 6
always sets "used with Nanite" and saves; content unchanged). Restoring it with `git checkout` was refused by the session's
permission check, so it is left modified: please discard it before a commit.
Work files: `C:/GameDev/Underreign_Assets/AnimWork/UR-KIT-WALL-CONTINUOUS-V1` (old kit copy, probes, logs; frame folders deleted).

## Images and films (this folder)

- `blender/long_wall_6cells_{front,oblique,gamecam}_old_vs_new_{Soil,Stone,Basalt,Gold,Bedrock}.png`, `blender/corridor_eye_old_vs_new_Stone.png`
- `blender/corner_{outer,inner,end,pillar,diag,diag2}_eye_old_vs_new.png`, `blender/corner_{outer,inner,end,pillar,diag}_gamecam_old_vs_new.png`
- `blender/testlayout_{game_low,game_full,game_close}_old_vs_new.png`, `blender/proof_section_{G15,G3,CL15,OB3,CO15}_old_vs_new.png`
- `blender/pan360_new_proof_section.{mp4,gif}` (1280 x 720, 120 frames, 4 s, no sound) and `blender/pan360_frames_0_30_45_60_90_105.png`
- `game/kit_close_long_wall_{full,low}.png`, `game/kit_close_outer_corner_{full,low}.png`, `game/kit_l2_{full,low,overview,full_after}.png`,
  `game/kit_close_corridor.png`, `game/UR_WallContinuous_Turn360_6s.{mp4,gif}` (1920 x 1080, 6 s, no sound), `game/UR_WallContinuous_Turn360_frames_0_30_60_90_120_150.jpg`
  (the game images show the licensed scanned rock: local only, never sent anywhere; whether they may be committed is the Director's call)
- `measure_old_inset.json`, `checks_new_testlayout.json` (measure, joints, closure), `closure_new_real_section.json`, `logs/`

## Open points

1. **Basalt near seams:** the bend onto the shared column (which wanders with the height) makes basalt columns slightly wavy within
   about 0.4 m of a seam. A straighter column only for basalt would need per-stratum columns, which do not close where two strata meet.
2. **Very close range:** within 0.1 m of a seam the rock is flat sideways (needed for the matching normal); in smooth Soil a slightly
   calmer vertical line can be noticed at arm's length; not at the game camera.
3. **Residual ray hits:** 1-2 near-tangential back-face touches on outer-corner rock and 1-3 vertical rays at Full height on one inner
   fillet variant at the vertex (of 0.2-0.8 million rays); not seen in any render or capture.
4. **New placement rule** (needed by the kit change): face kind by the open neighbour along the wall, `WallDiag` for diagonal rock,
   no mirroring, the even/odd variant rule. Done in Blender (`build_proof_scene`, `export_placement`) and in Unreal (`AddKitLayer`).
5. `_HI` and the LOD chain close exactly within each set; an `_HI` piece next to an `_LOD*` piece would not (the game spawns one set).
6. The game scene is still dark with full walls (unchanged lighting); the long-wall close still frames the junction of "main" and
   "link" rather than a long stretch (the dug state at tick 10700); the Blender test layout shows the long wall better.
7. `M_UR_Greybox.uasset` re-saved by `setup_kit.sh` (see Changed files).
8. Faint 2 mm step lines between corner caps and block tops at the cut.
