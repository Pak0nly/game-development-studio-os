# UR-STYLE-SAMPLE-V1 — Worker result (Studio copy)

Work Order: `Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V1/WORK_ORDER.md`.
`verify-worker`: PASS (receipt `fcec043aa2d4939427504e2bd19ff267d85c3bcbd1a596efb5fedafdeafc21d7`).
Full result: `C:/GameDev/Underreign/Evidence/UR-STYLE-SAMPLE-V1/WORKER_RESULT.md`.
Nothing committed or pushed. One operational recovery (API network error;
resumed in the same state, no Unreal process left running).

## Summary

- Separate UE 5.8 project `C:/GameDev/Underreign/StyleSample/UnderreignStyle`
  (Python editor scripting, no C++), own `.gitignore` / `.gitattributes`,
  rebuilt headless from scripts (`StyleSample/Scripts/build_all.sh import`).
- Scene `L_StyleSample`: an Ashen Pact corner with two layers (upper floor and
  a lava chasm 4.6 m down), rough Nanite rock with baked displacement, claimed
  worked-stone floor with ember-lit seams, fresh-rock corridor, forge corner,
  braziers, torches, ring pillars with brass contract rings and glowing
  invented script, chain railing, fight spot with blood and drag marks, the
  Heart glowing down the chasm, embers / ash / smoke / sparks / drips,
  volumetric fog, heat haze, film-style post.
- Unreal features used: Lumen GI + reflections (HW ray tracing), Nanite,
  virtual shadow maps, layered HLSL master material (soot, wet, ash, heat
  glow), decals, volumetric + local fog, emissive lava lighting, local
  exposure, grading, grain, vignette, chromatic aberration, DOF, custom-depth
  outline. Not used: Substrate (layered legacy shading instead), Nanite
  runtime tessellation (displacement baked in Blender), Niagara in the
  captures (template renderer material cannot be overridden from headless
  Python; own GPU particle fields used instead).
- Readability: without aids the intruder loses its cold colours under the
  orange light and the trap disappears; with a stencil outline, ground rings
  and a units-only key light (lighting channel) all three read immediately.

## Proof

| File | Content |
|---|---|
| `C:/GameDev/Underreign/StyleSample/Captures/Stills/01_game_camera.png` | game camera, 1920 x 1080 |
| `.../Stills/02_close_forge.png` | close view, forge |
| `.../Stills/03_close_chasm_heart.png` | close view, chasm and Heart |
| `.../Stills/04_game_camera_units_plain.png` | units, no aids |
| `.../Stills/05_game_camera_units_aids.png` | units with outline, rings, key light |
| `C:/GameDev/Underreign/StyleSample/Captures/06_camera_move_6s.webp` | 6 s camera move, 1280 x 720, 30 fps (also `_640.gif`) |
| `C:/GameDev/Underreign/Evidence/UR-STYLE-SAMPLE-V1/contact_sheet.png` | all stills on one sheet |

## GPU (game camera, 1920 x 1080, TSR 100 %, capped 30 fps, RX 6800 XT, 210 frames)

| Setting | GPU avg | GPU p99 | GPU max |
|---|---:|---:|---:|
| High | 10.6 ms | 10.6 ms | 11.5 ms |
| Epic | 17.2 ms | 17.3 ms | 17.8 ms |

Largest cost: 17 shadowed local point lights (5.5 / 7.7 ms). Frame cap
verified from log stamps. Note for all future runs: `-benchmark` overrides
`t.MaxFPS`; the early tuning runs used it (30–53 fps, each under 30 s) and
were discarded.

## Honest weak points

Rock reads slightly soft and clay-like (procedural textures, triplanar
blending, vertical streaks on chasm walls); lava crust is a visibly tiling
pattern; brazier coals clip to white in the close view; flames are
camera-facing cards; props are block-outs; smoke had to stay very thin;
heat haze is barely visible from above; fog is very sensitive.

## Later steps (proposals, not decisions)

- Megascans with the Human's account: dark basalt cliff set, cooled lava
  crust, worn stone floor tiles, cave floor with gravel, quarried rock, rubble
  and ash / grime / dried blood decals, forged iron and brass.
- Creature sample (Meshy + Blender): Meshy high mesh, Blender retopology
  (15–40k tris), UVs and bakes, crust / ember-seam / glass-horn / brass
  materials, skeleton and skinning, idle / walk / attack / hit / death
  animations, then a test in this scene at the game camera with the
  readability aids.
