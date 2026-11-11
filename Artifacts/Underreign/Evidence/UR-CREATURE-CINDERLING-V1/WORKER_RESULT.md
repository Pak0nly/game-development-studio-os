# UR-CREATURE-CINDERLING-V1 — Worker result

Worker: separate Claude Code subagent. Gate: `verify-worker` printed
`PASS worker receipt db7430736a79c1288f2776aba6fdb542ae2edb4680f3959defff6d2c84cff3f5`
before any change. External HEAD 817147a (unchanged). Blender 5.2.3 background
mode only (Cycles CPU bakes, Eevee 8-24 samples for previews), no Unreal, no window
in front of the Human, nothing committed or pushed. Scratch work folder:
`C:/GameDev/Underreign_Assets/AnimWork/UR-CREATURE-CINDERLING-V1/` (absolute paths only).

All tasks 1-6 done, including task 4 (skeleton, idle, walk). The idle uses the
Human's crouch pose that arrived mid-task (`cinderling_idle_pose_v1.webp`) instead of
a standing idle.

## Inputs (read-only)

- `C:/GameDev/Underreign_Assets/Meshy/Meshy_AI_Emberborn_Cinderling_20261111_texture_fbx.zip`
  (SHA-256 d78a334ceb5cda86b9487fb4af0d7a537344471564eeefbab8e8afa534d63d46).
  High-poly: one closed, manifold mesh, 184,505 vertices / 369,026 triangles, 0
  boundary edges, 0 non-manifold edges, 1 connected piece (no holes, no floaters).
  T-pose, Z-up, faces -Y. Textures: base colour 4096, normal 4096, roughness and
  metallic 2048.
- Concept `Kleiner Aschengeist mit Glutherz.png` (1024 x 1536) and the Human's idle
  pose image (1199 x 1312).

## What was done

1. Clean-up: transforms applied, uniformly scaled to **0.50 m** tall (factor 0.283),
   origin on the ground at the centre of the feet; orientation kept (already Z-up,
   facing -Y). No hole or floater repair needed (checked by script, numbers above).
2. Game mesh: collapse decimation to **22,000 triangles** (10,992 vertices). New UVs:
   Smart UV project (55 degrees) and concave island packing — automatic, not
   hand-laid. Bakes from the high-poly (selected-to-active, cage 3 mm): base colour,
   roughness, metallic, tangent normal, AO, all **2048 x 2048**.
   Emissive mask 2048: chest ember (fills the dark diamond in the chest of the Meshy
   model), two pinprick eyes (placed by position; the Meshy texture has faint orange
   eye dots there), plus the orange cracks only in a small zone around the chest
   (the concept shows faint glow only there). All other orange cracks of the Meshy
   texture (arms, legs, back, head) stay in the base colour but do not glow.
3. Stills (Eevee, same light for both meshes): turntable high vs game mesh
   (front, front 3/4, side, back), head and chest close-up high vs game, wireframe.
4. Skeleton: 22 bones (21 deform + root): root, pelvis, spine_01, spine_02, neck,
   head; per side clavicle, upperarm, lowerarm, hand, thigh, calf, foot, ball.
   Control bones (not exported): foot IK targets + knee poles, hand IK targets +
   elbow poles, hand-hang targets. Weights: automatic bone-heat, max 4 influences,
   normalised; 0 unweighted vertices. Animations at 30 fps, procedural keyframes,
   baked to the deform bones for export:
   - **Idle 120 frames (4 s loop): the Human's crouch** — deep squat, feet flat and
     apart with toes turned out, knees wide, forearms resting on the knees (arm IK
     targets follow the knees), long hands hanging loose (tracked downwards), head
     slightly forward; small breathing, one slow head tilt mid-loop. In the preview the
     chest ember pulses like a heartbeat (double beat per second, material only).
   - **Walk 32 frames (1.07 s loop), root motion 0.21 m/s along -Y**: planted feet via
     IK, small step height, pelvis bob and sway, counter-swinging arms.
   Checks: walk stance feet world-fixed — max foot slide 0.0 mm per frame; IK reach
   error max 0.01 mm. FBX re-import: 22 bones, single root `root`, 22,000 tris,
   0.538 x 0.098 x 0.50 m (T-pose); Idle = 121 frames (0-120), Walk = 33 frames (0-32).
5. Concept copied byte-identical to
   `Projects/Underreign/References/ArtDirection/cinderling_concept_v1.png`
   (SHA-256 bd6f023746f368cf03daf62fa6693eea5ea7c94d01f7aa52e782f0ef88fa7ab0); idle
   pose image copied byte-identical to `cinderling_idle_pose_v1.webp`
   (SHA-256 e0929e90668df94f1cd2409e8bc27a351e76540405a6d71fbfd30f8ca5c6fe16);
   one PROVENANCE line each in `PROVENANCE.md`.

## Outputs (`C:/GameDev/Underreign/StyleSample/Creatures/Cinderling/`)

| File | Content | SHA-256 |
|---|---|---|
| `SK_Cinderling.fbx` | skeletal mesh + skeleton | 373c04dc09c20d3d6cc36c72eb9a1f8cbcae50cc51274ddaf93eb2508a5b9148 |
| `Animations/A_Cinderling_Idle.fbx` | 0-120, crouch idle | e4173957890d687649f6a7f1f8422d2267dafa255db82b1c0357e3ca469c2952 |
| `Animations/A_Cinderling_Walk.fbx` | 0-32, root motion | 84a3166ce27857be41bf2a95f4777e45862e803bbaaf3a64d6ff2e1e32a9a0b4 |
| `Textures/T_Cinderling_BaseColor.png` | 2048 sRGB | c68b777b863c4a9de113fea86b85abcfe27cdc8b31b26e49ced72227d01ee756 |
| `Textures/T_Cinderling_Normal.png` | 2048, DirectX | b95dffd60f8c7e1623847b5dbe92b127faa68f26691a5baaf7f2529ea0c99fbc |
| `Textures/T_Cinderling_ORM.png` | 2048, R AO / G rough / B metal | 6700931e2e68ab48a5cffb7d4c5ef559d1823823f6a5e05d99731416a0509c44 |
| `Textures/T_Cinderling_Emissive.png` | 2048 mask | f3bf0fa6a54fc87b968657278e8de011ed0f91ed7285c15513221c77aeefabd2 |
| `Source/Cinderling.blend` | game mesh, rig, controls, actions | 10deee1d5b3e73756dce297b3e9ddef4704264709df40f702e4a6bff65436a00 |
| `Source/Cinderling_High.blend` | cleaned, scaled high-poly | 2e3f999c2f3b2ee88745eb60d426bbbe12655946407828462106090aab19fdbe |
| `Previews/Stills/01_turntable_high_vs_game.png` | top high, bottom game | 4f9601370dfd94d7d79496d54f88db0f558b9b9dc2755683b4829c5d5fd88dab |
| `Previews/Stills/02_head_chest_closeup.png` | left high, right game | 8e96468a63619212032c1d13821a071ce763b61184ccacff62d800eedfc590c3 |
| `Previews/Stills/03_wireframe.png` | game mesh wireframe | 1fdce621611c99c462f659ab2433445857dcd433239bfd018ed73795a18b75c1 |
| `Previews/Cinderling_Idle_side.gif` / `_front34.gif` | 360 x 360, 30 fps | 86bc6cc6... / f0d65f0a... |
| `Previews/Cinderling_Walk_side.gif` / `_front34.gif` | 2 cycles, camera follows | 3dc681bd... / a37a88ef... |
| `Scripts/` | prep, bake, texproc, stills, slices, rig_anim, preview, verify_fbx, probe_view | |

## Honest weak points

- The head is the Meshy egg shape (smooth and round); the bible says "never round".
  Changing the silhouette needs a sculpt pass — not done.
- UVs are automatic (Smart UV), seams are many and irregular; fine for baked
  textures, not for hand painting. Decimation is not a retopology; edge flow is
  irregular (see wireframe), deformation at shoulders and hips acceptable, not
  production-grade.
- The Meshy texture has glowing-orange cracks over the whole body; only the chest
  zone glows now, the rest reads as dull orange lines in the base colour. If the
  Human wants a darker, more soot-like body, the base colour needs a de-saturation of
  those cracks.
- Idle: elbows sit a little higher than in the reference image (arm length vs shoulder
  height of this model); forearms rest on the knees but there is no contact
  correction, slight intersection possible. Heartbeat pulse exists only in the preview
  material (a material parameter, not in the FBX) — Unreal needs a material curve or
  a material-parameter track.
- Walk is procedural (no animator pass): readable and foot-locked but somewhat
  mechanical; arm swing simple.
- The GIF previews use a 128-colour palette, so the chest glow looks paler than in
  the PNG stills.
- The .blend files reference their textures by absolute path in the AnimWork scratch
  folder (not packed).
- Size 0.50 m ("knee-high") is my interpretation; adjust in Unreal if needed.

## Not done / next

Nothing from the Work Order is left open. Possible next steps (not authorised here):
head silhouette sculpt, Unreal import, ember-pulse material curve, further
animations (run, attack, hit, death).
