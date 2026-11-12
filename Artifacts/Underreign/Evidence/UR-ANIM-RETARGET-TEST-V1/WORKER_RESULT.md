# UR-ANIM-RETARGET-TEST-V1 — Worker result (Studio copy)

verify-worker: `PASS worker receipt bb5ec617b7bb2df637dc1127f7cdb8b36186cde1a665ad99163e036efc2b0535` (run from the Studio root before any change).

External evidence: `C:/GameDev/Underreign/Evidence/UR-ANIM-RETARGET-TEST-V1/WORKER_RESULT.md` (identical body below). Nothing committed or pushed.


Free Unreal mannequin animations on the Human's Meshy Brute (test, Discovery). Scoped evidence for one body type;
it decides no purchase.

## Summary

The Brute was reduced, rigged with the exact UE5 mannequin bone names and hierarchy, imported into the separate
StyleSample project and driven by Unreal's IK Retargeter. Idle, walk, jog, three unarmed attacks and two deaths
play on it with no per-animation hand correction. Proportions, foot contact and the shield on the back hold up at
the game camera. The limits come from the free content itself, not from the method: the "deaths" are 1.1 s
crumple-starts that end crouched, meant to hand over to ragdoll, and the attacks are unarmed boxing / martial-arts
moves.

## Numbers

| Item | Value |
|---|---|
| Triangles | 2,096,710 (Meshy) -> 48,000 (collapse decimation; one mesh incl. shield) |
| Textures | BaseColor and Normal 4096 -> 2048; Metallic, Roughness 2048 (unchanged) |
| Size / scale | 1.90 m tall (mannequin about 1.80 m); feet on Z = 0; faces +Y in Unreal like the mannequin |
| Skeleton | 87 bones, mannequin names and parents (root, pelvis, spine_01-05, neck_01-02, head, clavicles, upper / lower arms with twist bones, hands, 5 fingers incl. metacarpals, thighs / calves with twist bones, feet, balls, all ik_* bones). The mannequin's 74 corrective helper bones are left out. |
| Skin weights | procedural, max 4 influences; shield (5,713 of 23,800 vertices) rigid on spine_05; tabard front / back flaps pelvis -> 50 % thighs |

## Rig and retarget method (reusable)

1. `StyleSample/Scripts/animtest/brute_prep.py` (Blender -b): import Meshy FBX, join, decimate to a target
   count, feet on the floor, centred, 2K material. Fully generic.
2. Landmarks: `StyleSample/Characters/BruteRetarget/brute_fit.json` — 13 joint points (left side only, mirrored)
   read off gridded front / side check renders (`brute_views.py`), plus the shield box and cloth boxes. This is
   the only manual, character-specific step (about 15-30 min per humanoid).
3. `brute_rig.py` (Blender -b): builds the mannequin skeleton on the landmarks (spine and twist bones interpolated
   as on the mannequin, fingers = mannequin hand turned onto the forearm direction), procedural skin weights
   (distance to bone segments normalised by per-bone thickness, left / right separation, Laplacian smoothing),
   rigid shield and cloth rules from the fit file, export in centimetres without bone scale. Check:
   `pose_check.py` (stress-pose render).
4. `ue_setup.py` (Unreal commandlet, -nullrhi): textures, material, skeletal mesh; IK rigs for mannequin and Brute
   from Unreal's own template detection (`apply_auto_generated_retarget_definition` + `apply_auto_fbik`, both
   matched the "UE5 mannequin" template because the names are identical); IK Retargeter with the default op stack
   (Pelvis Motion, FK Chains, Run IK Rig, Root Motion, Remap Curves), chains mapped by exact name, target chains
   auto-aligned to the mannequin's retarget pose; batch retarget to `/Game/Characters/Brute/Anims/*_Brute`.
5. `level_animtest.py`, `ue_capture.py` + `capture_animtest.sh`, `encode.py`: test map with a 50 cm / 10 cm grid
   floor, frame-exact capture (pose set per frame at t = k/30 s), MP4 + GIF. `measure_feet.py`: foot metrics.

Reuse for Scout / Healer: steps 1, 3, 4, 5 run unchanged (new file names); only a new fit file is needed. Expected
effort for the next humanoid: about 1-2 hours incl. checks (this run additionally cost the one-time API and
scale debugging, which does not repeat). Same skeleton names => every mannequin-compatible animation (free or
bought) retargets to all our humanoids in one batch call.

## What had to be fixed

Pipeline (once, not per animation):
- Blender FBX export put scale 100 on the root bone; every retargeted animation keys root scale 1 and shrank the
  mesh to 1 % (invisible in the first capture). Fixed in `brute_rig.py`: scene unit 0.01, objects x100, scale
  applied, export without scale.
- The Brute's A-pose arms are about 20 degrees higher than the mannequin's: solved by the retargeter's automatic
  chain alignment (no hand work).
- Skeletal-mesh FBX export from a commandlet asserts in UE 5.8; the mannequin reference pose is read through the
  AnimPose API instead.

Per animation: nothing was hand-corrected. Measured against the mannequin originals (`foot_metrics.json`, ball bone
drift while planted, 120 Hz):
- Walk: Brute 2-8 cm drift per step, mannequin 1-5 cm. Jog: Brute 3-10 cm, mannequin 2-7 cm. Slightly more
  sliding, not visible as skating at the game camera; visible on the grid in the side view.
- Feet: no sinking; balls 0.1-1.7 cm above floor (mannequin -0.7-0.4) — the bigger boots, negligible.
- Arms / shield: no arm-through-body or arm-through-shield found in the reviewed frames (contact sheets of every clip,
  zoomed sheets of walk, attacks and deaths); the shield stays on the back in all clips.
- Hand poses: fists and open hands read correctly; the Meshy hand has merged fingers, so finger detail is
  approximate.

What remains (not fixed, would need work if this goes to the game):
- Tabard is skinned, not simulated: the front flap splits with the thighs, the back flap is stiff; legs show at the
  flap edges in wide steps.
- Pauldrons / sleeve plates stretch when the arms go above the head (Attack02); visible in close-ups only.
- With the heavy shield, the fast spin of Attack03 (an acrobatic jump / spin kick ending on the ground) and the
  lunges look unfitting for this character — a content problem, not a retarget problem.
- Deaths end crouched (template design for ragdoll hand-over); a death that lies on the ground needs ragdoll /
  physics or purchased deaths.
- Root motion is copied unscaled (fits here because leg length is almost equal); for a much shorter or taller
  humanoid the Root Motion op's scale should be set.

## Proof (all from the separate StyleSample project, 30 fps cap verified: max 30 frames in any second)

`C:/GameDev/Underreign/StyleSample/Captures/animtest/` — MP4 (1280x720, 30 fps) and GIF (640 px, 25 fps) each:
`Brute_Idle_game|side`, `Brute_Walk_game|side`, `Brute_Jog_game|side`, `Brute_Attack01_game|side`,
`Brute_Attack02_game|side`, `Brute_Attack03_game|side`, `Brute_DeathFront_game|side`, `Brute_DeathBack_game|side`,
`Brute_Compare_DeathFront_front`, `Brute_Compare_DeathBack_front`, `Brute_Compare_Attack01_front` (Brute next to
the mannequin playing the original).
Game view: 55 degrees down, front-left three-quarter, 5.6 m, FOV 45. Side view: 6.2 m, FOV 32. Camera follows the
root over the world grid. Stills in `Captures/animtest/Stills/`: `Brute_vs_Mannequin_front.png` (proportions),
`Brute_Idle_game.png`, `Brute_Walk_side_f06.png`, `Brute_Attack01_side_f13.png`,
`Brute_vs_Mannequin_DeathFront_end.png`, `Blender_skeleton_fit.png`, `Blender_weight_stress_pose.png`.

DEC-025: the captures contain Epic content (mannequin motion; the mannequin mesh in the compare clips and the
proportions still). Use locally only; never send them to an AI service.

## Fab library animation inventory

`C:/GameDev/Underreign_Assets/Fab/VaultCache/FabLibrary`: 89 items + `listings_v1.db`. 70 texture sets (surfaces,
blood / mud decals), 14 FBX mesh scans (rocks, cliffs, Old Mine props; 103 FBX files, none skinned: no deformer /
skin data), 5 glTF decals. **No animation, no skeleton, no character.**

Free animation content already installed with UE 5.8 (Templates): Unarmed idle, walk / jog in 8 directions, jump /
fall / land / dash / wall jump, Attack 01-03 + charged attack (+ combo / charged montages in Variant_Combat);
deaths front 1-3 / back / left / right (short, ragdoll start); Pistol and Rifle sets (idle, aim offsets, walk /
jog 8 directions, fire, reload, equip, jump) and Rifle hit reacts (front light / medium / heavy, back).

## Recommendation (plain)

The free library is enough for the base moves of our humanoids: idle, walking and running in all directions work
on the Brute without hand correction, and the method repeats for Scout and Healer with only a new landmark file.
Retargeting a bought library onto all humanoids is therefore cheap; the cost is in the animation content.

Missing for our combat (not in the free set): one-hand weapon + shield attacks, block and shield bash; two-hand
weapon (axe / hammer / greatsword) attacks; hit reactions without a gun pose, stagger, knockdown and get-up; full
deaths that end on the ground (or a ragdoll setup); bow draw / shoot (Scout); casting / healing gestures (Healer);
idle variants with a weapon. A medieval melee pack that is mannequin-compatible would fill most of this; deaths can
alternatively come from ragdoll.

## Files

External (C:/GameDev/Underreign), all new / untracked, nothing committed:
- `StyleSample/Scripts/animtest/` — (capture_job.json is the run-time copy of the last job) brute_prep.py, brute_rig.py, brute_views.py, pose_check.py, islands.py,
  inspect_fbx.py, export_mannequin.py, probe_retarget.py, diag_pose.py, ue_setup.py, level_animtest.py,
  ue_capture.py, capture_animtest.sh, run_ue.sh, run_bl.py, encode.py, measure_feet.py, jobs/test.json,
  jobs/full.json, jobs/compare.json
- `StyleSample/Characters/BruteRetarget/` — brute_fit.json, SK_Brute.fbx, Textures/T_Brute_{BaseColor,Normal,Metallic,Roughness}.png
- `StyleSample/UnderreignStyle/Content/Characters/Brute/` — SK_Brute, SK_Brute_Skeleton, M_Brute, 4 textures,
  Retarget/IKR_Manny, IKR_Brute, RTG_MannyToBrute, Anims/8 x *_Brute
- `StyleSample/UnderreignStyle/Content/Characters/Mannequins/` — copy of the engine template mannequin content
  (126 MB, Epic), needed as retarget source
- `StyleSample/UnderreignStyle/Content/Maps/AnimTest/` — L_AnimTest.umap, M_AnimFloor
- `StyleSample/Captures/animtest/` — 38 MP4 / GIF, Stills/ 7 PNG
- `Evidence/UR-ANIM-RETARGET-TEST-V1/` — this file, foot_metrics.json, anim_metrics.json
Work files: `C:/GameDev/Underreign_Assets/AnimWork/UR-ANIM-RETARGET-TEST-V1/` (src copy of the zip, blend, ref,
views). Temporary frame folders deleted. Logs in `StyleSample/Logs/at_*.log` (git-ignored). `Game/` untouched.
