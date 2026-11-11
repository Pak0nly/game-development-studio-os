# UR-CREATURE-SAMPLE-V2 — Worker result (Studio copy)

Copy of the external evidence `C:/GameDev/Underreign/Evidence/UR-CREATURE-SAMPLE-V2/WORKER_RESULT.md` (external repository `C:/GameDev/Underreign`, base HEAD `51fc690`, changes uncommitted). Machine-readable checks there: `anim_checks.json`, `gait_plan.json`.


Worker: separate Claude Code subagent. Gate: `verify-worker` printed
`PASS worker receipt d37f0110beefaa4a181d7c8ce9bbac08c8934f4dd14f50fdf80ea31d3e66fc74`
before any change. Base: external repository `C:/GameDev/Underreign` at
`51fc690`. Blender 5.2.3 in background mode only, Pillow for sheets and moving
previews. No Unreal started; only `StyleSample/Creatures` and
`Evidence/UR-CREATURE-SAMPLE-V2` changed (plus the Studio evidence copy).
Nothing committed or pushed.

## 1. Paws (cause and fix)

Cause: in V1 `rig.py` the deform bones got their roll aligned
(`align_roll`) before the control bones were created; the controls
`CTL_rot_*` (paw / metatarsus) and `CTL_toe_*` kept roll 0. The paw, metatarsus
and toe bones follow these controls through world-space Copy Rotation, which
copies the full orientation including roll. Measured in the V1 `.blend`: the
driven bones were twisted 141-180 degrees about their long axis in the rest
pose and therefore in every frame (fl paw 170, fr paw 180, hl meta 171, hr meta
170, toes 142-180 degrees). That is the "sole up" the Human saw; the carpus
skin wrapped like a candy wrapper (Still 04, top row).

Fix (`Scripts/v2_rigfix.py`): every control bone gets exactly the head, tail and
roll of the bone it drives; deviation in rest pose is now 0.000 degrees for all
eight paw / toe bones. The front scapula left the IK chain (chain 2) and is
keyed explicitly; pole angles re-solved to 1 degree. Check (`v2_check.py`):
during every stance frame of every animation the toe up-axis stays at its rest
angle (no change while the heel rolls, i.e. digits stay flat on the ground).
Proof: `Previews/Stills/04_paws_v1_vs_v2.png`, `05_paws_gallop.png`, moving
close-ups `Previews/BrandHound_Walk_closeup_frontpaws/hindpaws`,
`BrandHound_Run_closeup_frontpaws/hindpaws` (.webp / .gif).

## 2. Mouth (`Scripts/v2_mouth.py`, `v2_textures.py`)

- Lips cut open along the head/jaw weight border (157 edges, one clean path
  from mouth corner to mouth corner, edge split), lip edges relaxed so the cut
  follows the lip line instead of the decimated zig-zag.
- 993 fused inner-lip faces and 593 faces lying between palate and floor were
  removed (ray tests), so nothing flaps inside the open mouth.
- Inner mouth: a closed sock from the lip loop to a throat point behind the
  mouth corners (7 rings: gum ridge, palate arched upward, flat floor),
  weighted head -> jaw from the lips and blending to the head at the throat;
  tongue (elongated body on the floor, jaw-weighted, head blend at its root);
  28 teeth (incisors, canines, premolars; upper on the head, lower on the jaw).
- Jaw weights rebuilt: lower-lip side fully on the jaw, upper on the head,
  throat skin fades out early so it does not swing with the mandible.
- Texture: dark mouth in a free square of the existing atlas (one material
  stays): gums dark red to black throat, darker tongue with midline groove,
  dull ivory teeth; ORM wet roughness, flat normal, no emission.
- Bite opens to 47 degrees without stretching the lips (V1 maximum 26 degrees
  with strands). Mesh: 52,095 triangles, 26,197 vertices.
Proof: `Previews/Stills/06_mouth_v1_vs_v2.png`,
`Previews/BrandHound_Bite_closeup_mouth(_side).webp`.

## 3. Anatomy-based gaits (`Scripts/v2_anim.py`)

Reference knowledge used (from published canine locomotion work, no footage
uploaded or used): Hildebrand's gait diagrams (lateral-sequence walk,
symmetrical vs. asymmetrical gaits), Muybridge's dog sequences ("Animals in
Motion"), Maes et al. 2008 (J. Exp. Biol., temporal coordination of steady dog
gaits), Fischer & Lilje "Dogs in Motion" (2011, scapula as the main proximal
forelimb segment, limb kinematics, gallop spine motion), Gillette & Angle 2008
(canine locomotion analysis). Values below are the plan derived from those
ranges and written into `Evidence/UR-CREATURE-SAMPLE-V2/gait_plan.json`.

| Gait | Stride | Speed | Touch-down phase (fraction of stride) | Duty factor |
|---|---|---|---|---|
| Walk, four-beat lateral sequence | 1.00 s | 0.90 m/s | LH 0.00, LF 0.25, RH 0.50, RF 0.75 | fore 0.66, hind 0.64 |
| Trot, diagonal two-beat | 0.60 s | 2.0 m/s | LH 0.00 + RF 0.03; RH 0.50 + LF 0.53 (hind lands slightly first) | fore 0.46, hind 0.42 |
| Run, rotary gallop | 13 frames (0.433 s) | 5.5 m/s | LH 0.00, RH 0.12, RF 0.42, LF 0.54 (rotary: hind lead right, fore lead left) | fore 0.24, hind 0.26 |

Mechanics keyed per phase:
- Legs: stance paw fixed; heel roll in the last 38 % of stance (pivot on the
  pads, digits counter-rotate and stay flat); swing tables per gait and limb
  for horizontal progress, paw height, paw pitch and digit angle: front carpus
  folds the paw back under the forearm (walk 78, trot 112, gallop 125 degrees
  peak), straightens and reaches before touch-down, digits slightly extended at
  contact; hind hock flexes, the paw hangs and is brought forward low, then
  placed under the hip. Placement narrows with speed (fore / hind half-width
  0.185 / 0.215 m walk, 0.165 / 0.19 trot, 0.15 / 0.18 gallop).
- Scapula glide: scapula rotation follows the limb angle (protraction /
  retraction, 0.38 of the leg angle) and lifts 1.2 cm in mid-stance.
- Trunk: walk as inverted pendulum (withers / croup highest at mid-stance of
  the fore / hind limbs), trot as spring-mass (lowest in mid-stance, highest in
  the short suspension), gallop with spine flexion +-13 degrees (flexed in the
  gathered suspension before the hind touch-down, extended around the fore
  touch-down), pitch from the croup / withers height difference; pelvis roll
  and yaw (swing-side hip drops and advances), chest roll / yaw from the
  forelimbs, lateral body shift toward the supporting paws, lateral spine bend.
- Head and neck: two nods per walk stride when a fore paw takes weight, neck
  counter-rotates the trunk pitch (head steadier than the withers), gallop neck
  reaches forward in extension; tail as counterbalance (lags the pelvis, swings
  with stride frequency, rises in gallop flexion).
- Collar and rings: V1 pendulum solver re-baked on every animation.

Footfall check: `Previews/Footfall/BrandHound_Footfall_<Walk|Trot|Run>.png`
show the reference bars from the plan above and the contacts measured in the
baked animation (paw pivot on the ground, per frame). Walk and trot match the
plan within one frame; the gallop shows the gathered suspension (frames 11-12,
no paw on the ground); the short extended suspension (0.04 stride) and the trot
suspension (0.02-0.04 stride) are shorter than one 30 fps frame and therefore
not sampled.

## 4. Death, 5. Bite, 6. Idle / emissive

- Death (72 frames, 2.4 s): hit flinch, stagger with a catching step of the
  right fore and the left hind stepping under, front legs give way first
  (carpus folds, chest drops), then the hind legs fold and the body rolls onto
  its right side, head and neck reach the ground last with a small bounce, tail
  twitch, settle. Lowest mesh point over all frames -2.0 cm (hanging right ring
  and right shoulder in the lying pose); the paws stay on or above the ground.
- Bite (39 frames, 1.3 s): crouch back, hind heels lift and push off, body
  lunges 0.35 m forward, front legs step 0.30 / 0.25 m, both hind paws hop
  forward 0.21 / 0.17 m and re-plant, jaw opens to 47 degrees and snaps shut,
  head shake, then every paw steps back to the start pose (in place, ends on
  the idle pose).
- Idle kept (breathing, look-around, ear flicks, tail sway); jaw now pants a
  little (3-6 degrees) since the mouth is real. HitReact re-baked with the
  fixed paws (unchanged timing).
- Emissive mask rebuilt per UV triangle: eyes, lips / mouth and the whole tail
  body no longer glow; seams and the brand seal unchanged; the tail glows only
  on its last 9 cm (gradient). Coverage > 0.2: 1.44 % -> 1.21 % of the mask.
  Proof `Previews/Stills/07_emissive_v1_vs_v2.png`.

## 7. Checks (`Evidence/UR-CREATURE-SAMPLE-V2/anim_checks.json`)

| Action | Frames | max IK reach error | lowest mesh point |
|---|---|---|---|
| Idle | 120 | 0.0 cm | 0.0 cm |
| Walk | 30 | 0.6 cm | -0.9 cm |
| Trot | 18 | 0.9 cm | -0.6 cm |
| Run | 13 | 1.2 cm | -0.5 cm |
| Bite | 39 | 0.0 cm | -1.5 cm (hind push-off) |
| HitReact | 24 | 0.0 cm | 0.0 cm |
| Death | 72 | 3.8 cm (lying pose, limp legs) | -2.0 cm |

FBX re-import: 41 bones, single root `root`, 52,095 triangles, 1 material,
1 UV set, bounding box 0.80 x 2.14 x 1.25 m; actions Idle 0-120, Walk 0-30,
Trot 0-18, Run 0-13, Bite 0-39, HitReact 0-24, Death 0-72.

Every preview was looked at (contact sheets of all frames per camera, single
frames at full size) before this report; corrected on the way: chest roll
cancelling the body roll in Death (body twisted), head bending upward in the
lying pose, front-paw buckle and shoulder sinking into the ground, too steep
bite head, gallop spine flexion too weak, walk carpus fold too high, gallop
reach (withers lowered 2 cm).

## Outputs (`StyleSample/Creatures/BrandHound/`)

| File | SHA-256 |
|---|---|
| `SK_BrandHound.fbx` | 63a66ac03c535d6e4eed540e1a1f3a47e33027b878945782c62df8828392521a |
| `Animations/A_BrandHound_Idle.fbx` | c0212882ea72daad416dc56686952a3d972dcb2953eb6577f9c89d90154f4d4e |
| `Animations/A_BrandHound_Walk.fbx` | d9c2c769f1b03df91a5b193d32bb0e890c984fb6960e31d16b7ce03415c64ddb |
| `Animations/A_BrandHound_Trot.fbx` | 9fedb1aea3d4ed7114891addb37dc629b0724f5a36c2cc25acef3322ee7107ac |
| `Animations/A_BrandHound_Run.fbx` | bba17d4f42b9853499e7d0a4e71bfe0d55b4f4497eaa533b76f01ad0464e9d84 |
| `Animations/A_BrandHound_Bite.fbx` | 543283b42a1137f5aaf74ee7e890196dd9329ff1c5809bdedec5fede0723f68d |
| `Animations/A_BrandHound_HitReact.fbx` | bb7d2270d8b28d79dbdf110fc8f40ef9ae42e8381f17992f40ce50d736005b07 |
| `Animations/A_BrandHound_Death.fbx` | 5bbfb9c1ad45eacdc2920d91d7fea7806c2a3b1613f4e78f4678cc74bed2b6cf |
| `Textures/T_BrandHound_BaseColor.png` | e00384620d4653836f5be651589b9cd2abdf1ed0bde31db8698ef4c9bfebbcf0 |
| `Textures/T_BrandHound_Normal.png` | 260d3fbf8f3c92fbec861e631d4bfbde3ea396b79b13eaa13dae327cee8b16ef |
| `Textures/T_BrandHound_ORM.png` | 2d0cd650218aeec0133a61f814803df9e3acbf3fcc358c72523b16ee9b3a60d3 |
| `Textures/T_BrandHound_Emissive.png` | fff2a476ffdc6a2d0d695a4d602f494d725bb167695b95c17af7fd6eb1db2502 |
| `Source/BrandHound.blend` | 1dd3ff1bddb00439a64b7e6d400c46a18030d4f7e50efb09c0e980141bc8f871 |
| `Source/T_BrandHound_Normal_OpenGL.png` | b50ed5f62c47915dc928996136fba9814ab160c2b02e5c9477117fd708cd69f5 |
| `IMPORT_NOTE.md` | updated for V2 (Trot, root-motion speeds, mouth atlas, limits) |
| `Scripts/v2_*.py` | 10 new scripts (rig fix, mouth, textures, material, anim, export, check, preview, footfall, mkanim) |

Previews (`Previews/`, WebP 800 x 500 exact 30 fps, GIF 480 x 300; loops
repeated to about 3 s, one-shots hold 0.5 s):
`BrandHound_<Idle|Walk|Trot|Run|Bite|HitReact|Death>_<side|front|game>`,
`BrandHound_Walk_closeup_<frontpaws|hindpaws>`,
`BrandHound_Run_closeup_<frontpaws|hindpaws>`,
`BrandHound_Bite_closeup_<mouth|mouth_side>`; `Footfall/`; `Stills/04-07`.
"front" = front three-quarter; "game" = game camera angle (pitch -58 degrees,
HFOV 45) at 5.4 m instead of 32 m.

## Honest limits

- Scripted animation: phase tables and procedural trunk motion based on gait
  data, not motion capture and not hand-polished by an animator. Timing and
  contacts are right by construction; finer qualities (muscle jiggle, skin
  slide over the scapula, toe spread under load, irregular breathing) are
  missing, and the gallop at 13 frames per stride is inherently choppy at
  30 fps.
- The Meshy body is a decimated sculpt in a mid-stride rest pose with
  asymmetric legs; strongly folded carpi and hocks pinch the mesh slightly
  (normal skinning, no corrective shapes).
- The mouth is retrofitted: at full gape the throat skin stretches and the
  cut lip edge is visible at very close range; the jaw hinge of the V1
  skeleton sits slightly high, so a wide gape looks long. Fine at game
  distance and in the close-up previews, not film quality.
- Small ground contacts: paws up to about 1 cm into the ground in the gaits,
  1.5 cm in the bite push-off, 2 cm (ring, shoulder) in the lying death pose.
- Stills 01-03 are still the V1 images (02 shows the old closed mouth).
- Readability of the lying death pose from the steep game camera depends on
  the side facing the camera; from above it reads as "on its side", not as
  a clearly collapsed heap.
