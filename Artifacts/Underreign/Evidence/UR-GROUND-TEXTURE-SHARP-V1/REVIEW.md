# Independent review UR-GROUND-TEXTURE-SHARP-V1

Reviewer: separate Claude Code subagent (did not build). Blender and Unreal were not started. Date 2026-11-13.
Inputs: `Artifacts/Underreign/DirectorDispatch/UR-GROUND-TEXTURE-SHARP-V1/WORK_ORDER.md`, the Studio
`WORKER_RESULT.md`, the external repository `C:/GameDev/Underreign` and the eight sheets plus the 50 renders under
`C:/GameDev/Underreign_Assets/AnimWork/UR-GROUND-TEXTURE-SHARP-V1/`.

## Checks

1. **Scope (external repository).** `git status --porcelain --untracked-files=all` lists only the four new scripts
   `ArtSource/GroundTextureTest/scripts/sharp_prep.py`, `sharp_run_all.py`, `sharp_scene.py`, `sharp_sheets.py` and
   `Evidence/UR-GROUND-TEXTURE-SHARP-V1/WORKER_RESULT.md`. The existing scripts (`scene.py`, `sets.py`, ...) are unmodified.
   No image, texture or .blend file from this order is in the repository, tracked or ignored; the only ignored binary is
   the older `EngineComparison/Kit/blend/kit_source.blend`, which is not from this order. Licensed 4K copies, renders and
   sheets lie only under the AnimWork folder outside Git. Nothing committed. Result: OK.
2. **Scripts.** All four listed scripts exist (4.2 KB, 0.6 KB, 25.6 KB, 4.5 KB). Result: OK.
3. **Visual (all 8 sheets viewed: Erde, Stein, Basalt, Goldader, Urgestein, overview torch game, overview torch close, cut cap).**
   - Layout matches the order: columns vorher | 1+2 | 1+2+4, rows neutral/torch x game camera/3 m close; every label is German.
   - Sharpness: at 3 m, 1+2 clearly sharpens crack edges, layer lines and chips on Stein, Basalt, Goldader and Urgestein
     (Urgestein loses its smeared look); 1+2+4 adds real ledges, holes and self-shadowing, strongest under torch light.
     Erde gains little from 1+2 and turns crumbly with 1+2+4, exactly as the Worker states.
   - No visible lighting seams at triplanar blends, no stretching on displaced slopes, no shimmer/fireflies, no faceting.
     Walls do not swell into the corridors: the game-camera wall outlines of 1+2+4 match vorher and 1+2.
   - Game camera: differences between 1+2 and 1+2+4 are small, matching the Worker's claim; walls are not too busy.
   - Torch light reads the relief far better than neutral light, as claimed.
   - Cut cap: new caps are tinted per stratum and lighter than the old violet slate; the gold cap shows clearly readable
     gold veins. Measured median luminance in the 1+2 neutral game renders (cap / floor): Erde 55/67, Stein 54/78,
     Basalt 54/61, Gold 52/58, Urgestein 52/61, so every cap is darker than its floor.
4. **Worker claims vs images.** The lever descriptions, the problem fixes (no facets, no egg-shaped nuggets, no cap-corner
   holes, thin gold cap veins) and the open points match what the sheets show. No contradiction found.

## Findings

- INFO: For Basalt, Goldader and Urgestein the cap is only about 10-15 % darker than the floor (Stein and Erde 18-30 %).
  It still separates through tint and the rim line, but "clearly darker" is modest there; the Human should judge it.
- INFO: Under the torch test light the caps read almost black (torches below the cut). The Worker reports this openly;
  in-game lighting must keep caps readable.
- INFO: 1+2 also darkens the walls overall by about 10-15 % (AO/cavity), visible on Basalt and Urgestein; the Worker
  reports it and recommends an albedo gain.
- INFO: The kit gold nuggets still stand out as separate yellow lumps (outside this order, reported by the Worker).
- INFO: The Erde wall gains least; the order's goal is met for the other four strata.

Verdict: PASS
