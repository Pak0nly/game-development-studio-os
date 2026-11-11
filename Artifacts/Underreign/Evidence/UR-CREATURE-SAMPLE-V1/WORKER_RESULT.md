<!-- Studio copy of C:/GameDev/Underreign/Evidence/UR-CREATURE-SAMPLE-V1/WORKER_RESULT.md. Studio-side outputs: Projects/Underreign/References/ArtDirection/brand_hound_concept_v1.png (byte-identical, SHA-256 a1eba94d5cd89beaef4ad9076bce796c27a3df0c93975959bd3a2bdf66921c86) and one PROVENANCE.md line. -->
# UR-CREATURE-SAMPLE-V1 — Worker result (Blender part)

Worker: separate Claude Code subagent. Gate: `verify-worker` printed
`PASS worker receipt 7414fa9d477366d541e3d5e71ae46f43841e71604c7ca887983512abdf4296d0`
before any change. No Unreal started, `StyleSample/UnderreignStyle` untouched,
nothing committed or pushed. Blender 5.2.3 background mode only; previews
Eevee 16-24 samples, 800 x 500.

## Inputs (read-only)

- `C:/GameDev/Underreign_Assets/Meshy/Meshy_AI_Emberfang_20261111_texture_fbx.zip`
  (SHA-256 8e437c541838d1a692853dd274b4818e8374d0f83809013af0414ffcdcaf8c15),
  unzipped to a scratch folder outside both repositories. High-poly: one closed,
  manifold mesh, 400,722 vertices / 801,620 triangles, no holes, no floaters;
  base colour 4096, normal 4096, metallic and roughness 2048.
- Concept `Basalthund mit glühendem Brandmal.png` (1536 x 1024).

## What was done

1. Clean-up: Z-up, faces Blender -Y, uniformly scaled to 1.25 m (ear tips),
   origin on the ground between the feet; mesh needed no hole or floater repair.
2. Game mesh: collapse decimation to **52,000 triangles** (25,912 vertices).
   New UVs: segmented by body part (head, neck/collar, chest, hips, tail, three
   segments per leg, each split into two halves; recursive splitting where a piece
   would distort), minimum-stretch unwrap, head and collar at 1.4x texel density,
   about 140 islands, 57 % UV coverage.
3. Bakes from the high-poly (Cycles CPU, selected-to-active): base colour, roughness,
   metallic, tangent normal (includes the Meshy normal-map detail), AO. Emissive mask
   2048 derived from the ember colour of the Meshy texture (seams, brand seal, eyes)
   plus a tail-tip gradient.
4. Skeleton: 41 deform bones — root, pelvis, spine x3, neck x2, head, jaw, ears x2,
   collar, 4 contract-ring bones, tail x7, front legs (scapula, upper arm, forearm,
   paw, toes) and hind legs (thigh, shin, metatarsus, toes) per side. Control rig in
   the .blend: foot controls with IK (front chain includes the scapula), pole targets,
   paw/toe roll controls. Weights: automatic bone-heat, then scripted overrides for
   jaw, collar band and rings; max 4 influences, normalised. Checked at extreme poses
   (jaw 0/15/28 degrees, legs at full reach/fold, spine bend, tail curl, rings 40
   degrees).
5. Animations at 30 fps, procedural keyframing: Idle 120 f (4 s loop: breathing,
   look-around, ear flicks, tail sway), Walk 30 f loop (lateral-sequence walk,
   1.0 m/s root motion), Run 15 f loop (transverse gallop with spine flex, 4.0 m/s
   root motion), Bite 36 f (crouch, lunge with front-paw step, jaw snap, head shake,
   recover), HitReact 24 f, Death 66 f (flinch, hind legs buckle, collapse and roll
   onto the right side so the brand-seal flank faces up, head drop, last tail flick).
   Human addition (collar and chain links): the collar and the four hanging
   contract rings carry their own bones; damped-pendulum secondary motion driven by
   the neck's real motion (gravity plus exaggerated inertia, angle-limited) is baked
   into all six animations, seamless on the loops.
6. Checks: IK reach error (wrist/hock vs. target) over every frame: max 0.0004 m in
   all animations (feet do not slide; stance feet are world-fixed by construction);
   Run initially failed reach (0.10 m) and was corrected (speed 5 -> 4 m/s, fold
   timing); FBX re-import: 41 bones, single root `root`, 52,000 tris, 2.14 x 0.64 x
   1.28 m, Walk = 31 frames.

## Outputs (`StyleSample/Creatures/BrandHound/`)

| File | Content | SHA-256 |
|---|---|---|
| `SK_BrandHound.fbx` | skeletal mesh + skeleton | d3ccc439c81391c3cb8f358fb9e90826979856c651d0d1be353c324af5ddbd16 |
| `Animations/A_BrandHound_Idle.fbx` | 0-120 | 428562820ecd3cb562e288b0de6d04d0a6bdcc339ba5aa7c13b803d2c090fbc4 |
| `Animations/A_BrandHound_Walk.fbx` | 0-30 | ff5d23828736a78a2b51669fcfefb3a24691d328a1247d4d3463c98eac056aa9 |
| `Animations/A_BrandHound_Run.fbx` | 0-15 | 4d45aa358fb1d3ee9bf8a4300b684b3add970857a1be91418efbe3333f4c0891 |
| `Animations/A_BrandHound_Bite.fbx` | 0-36 | 82b1f3d4eaa52f253f7eeae39bd3e08c9a8d6bb922b35f4c7f5a75b49a5b4e6f |
| `Animations/A_BrandHound_HitReact.fbx` | 0-24 | 314ee756d72562dcafd1fd6e347a2c77062a34d0f37b9aa28cfc06acc7db4db9 |
| `Animations/A_BrandHound_Death.fbx` | 0-66 | fdf30c686610ef4468ea7bc2507048a378719ace922c9ff6795df28f8ec4254d |
| `Textures/T_BrandHound_BaseColor.png` | 4096 x 4096 sRGB | 1260d40b078675fccec438b2fccdc7be4e728e94de56defd7dc9ba1bfe86b961 |
| `Textures/T_BrandHound_Normal.png` | 4096 x 4096, DirectX | a8f3ed2baea33883365b8159828081885a7beecd88839446ded8698cd0ef5c58 |
| `Textures/T_BrandHound_ORM.png` | 4096 x 4096, R AO / G rough / B metal | a42bfa271b5d37bfce5888bdcc09293d24628dade7503738e1889c3327327815 |
| `Textures/T_BrandHound_Emissive.png` | 2048 x 2048 mask | b1f06f5637c47397abaecfec940537cfd3fb46b83008a841ec5176ab8d6d3583 |
| `Source/BrandHound.blend` | rig, controls, actions | 8ec915fc108a90ce8bd5c89fe6c53ba917a72dbfc80b738b97cd3cb765e4e769 |
| `IMPORT_NOTE.md` | import note for the later Unreal order | |
| `Scripts/` | all build and proof scripts | |

Proof (`Previews/`): `BrandHound_<Idle|Walk|Run|Bite|HitReact|Death>_<side|game>.webp`
(800 x 500, exact 30 fps) and `.gif` (480 x 300); loops repeated to about 3 s,
one-shots hold 0.5 s at the end. "game" = the game camera angle (pitch -58 degrees,
horizontal FOV 45), at 5.4 m instead of 32 m so the hound is readable.
`Previews/Stills/01_turntable_high_vs_game.png`, `02_head_collar_closeup.png`,
`03_wireframe_sheet.png`.

## Honest weak points

- Mouth: the Meshy mesh has no mouth cavity; opening the jaw stretches lips and
  teeth into strands (visible in Bite at close range). Fine at game distance, not at
  close-up; a real fix needs a modelled mouth interior and teeth.
- UVs are automatic-segmented, not hand-laid; seams are jagged and about 140
  islands; good enough for baked textures, not for hand painting.
- Emissive comes from the Meshy colour: the seams read as orange cracks, but the eyes
  and some mouth pixels also glow, and the tail glow covers the orange tail end of the
  texture rather than only the tip. No tail smoke (Niagara later).
- Motion is procedural, not keyframed by an animator: the gallop is credible but
  somewhat mechanical; Bite is subtle from the side; in Death the lower legs
  intersect the ground slightly and the final pose is not ground-traced.
- Collar and rings are rudimentary pendulums: the rings are fused to the chest in the
  Meshy mesh, so a few chest vertices next to the rings move with them (small local
  stretching when a ring swings far).
- Decimation is not a manual retopology: edge flow is irregular (see wireframe);
  deformation at shoulders and hips is acceptable but not production-grade.
- Size choice (1.25 m to the ear tips, about 1.0 m at the withers) is my assumption;
  adjust in Unreal if units need another scale.
