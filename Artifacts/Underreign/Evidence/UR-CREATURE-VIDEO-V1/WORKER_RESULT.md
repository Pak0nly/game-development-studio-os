# UR-CREATURE-VIDEO-V1: Worker result (Brand-hound motion from Seedance videos, trial)

Worker: separate Claude Code subagent. Gate: `verify-worker` printed
`PASS worker receipt 74d47ab9e190788966c6240a155177bcd7a405020d85fe4ced97a72ce596d877`
before any change. Nothing committed or pushed. No Unreal started. Blender 5.2.3
in background mode only. `StyleSample/Creatures/BrandHound` was only read (V1 at
`51fc690`, the fixed V2 rig at `683c522` via `git show` / `git lfs smudge` into
the work folder). `C:/GameDev/AnimTools` was only read (venv, DINOv2 code and
weights, the Hearthlands Seedance client as a template).

Coordinator additions applied during the run: (1) no further Seedance generation
without asking first; (2) the motions are baked onto the **fixed V2 rig**
(`683c522`), not onto V1; (3) the collar and rings must not spin or flip.

## 1. Seedance videos (7 of at most 8; 762,300 tokens)

- Start pictures: Eevee renders of the game mesh in rest pose, 1280 x 720, plain
  light grey studio, light floor with dark joint lines every 0.5 m (so camera
  tracking would be visible): side view and three-quarter front view
  (`StyleSample/Creatures/BrandHoundVideo/Videos/StartImages/`). These use the
  **V1** mesh, so the start picture shows the V1 twisted paws (the Human noticed
  it). This did not carry over: see section 3.
- API: BytePlus ModelArk, `dreamina-seedance-2-5-260628`, image-to-video
  (`first_frame`), 720p, 5 s, no audio, no watermark. I used the client already
  tested in the Hearthlands order as the endpoint reference (copied, with its paths
  changed and the cap set to 8). I did not open any web documentation, so network
  traffic stayed on the API. Network: 83 calls to
  `ark.ap-southeast.bytepluses.com` and 7 video downloads from the ModelArk
  result bucket `ark-acg-ap-southeast-1.tos-ap-southeast-1.volces.com`, which the
  API itself returned (`endpoints.log`). The key was read at run time only. A
  scan of all evidence, delivery, log and script files found it in 0 files.

| # | Video | Tokens | Verdict |
|---|---|---|---|
| 1 | v1_walk (side, tracking) | 108,900 | usable: steady side walk, centred |
| 2 | v2_trot | 108,900 | usable: brisk trot / fast walk |
| 3 | v3_gallop | 108,900 | very good gallop, but strong motion blur |
| 4 | v4_bite | 108,900 | usable: crouch, lunge, snap, recover |
| 5 | v5_death | 108,900 | FAIL: sits, then jumps to lying on its back (camera jump) |
| 6 | v6_walk_tq (three-quarter front) | 108,900 | usable, clean lateral walk |
| 7 | v7_death_b (retry with "one continuous shot") | 108,900 | partly usable: continuous, collapse fine for about 1.4 s, then rolls over its back very fast |

The 8th generation was not used. Ledger: `jobs.json`, prompts:
`BrandHoundVideo/Videos/Prompts/`.

## 2. Pose finder for the quadruped (own rig, CPU / light GPU)

- Same idea as Hearthlands: a pose finder (keypoint detector) trained on renders
  of the hound's own rig. It finds 35 landmarks: 13 for head, spine and tail,
  plus 11 per side for scapula, shoulder, elbow, wrist, ball and toe tip of the
  front leg, and hip, knee, hock, ball and toe tip of the hind leg.
- Training data: 3,600 renders plus 300 exam renders (640 x 360, Eevee 8
  samples). Each render takes a random frame of a V1 action (walk, run, bite,
  hit reaction, death, idle) and adds random changes on the control rig (feet,
  body, spine, neck, head, jaw, ears, tail, collar). The camera (side or
  three-quarter, jittered), light, glow and floor offset are also random.
  Rendered in chunks that waited automatically while the parallel Unreal job
  ran.
- Model: DINOv2 ViT-S/14 (weights already in AnimTools) **frozen**. Its features
  were cached once on the RX 6800 XT (inference only, batch 8, a pause after each
  batch, about 3 min). The small decoder was trained on the **CPU** (14 epochs,
  32 min).
- **Accuracy on the 300 held-out exam renders: mean 1.44 px, median 0.93 px,
  p90 2.70 px** in a 640 x 360 image (about 2.9 px at video 720p). Side view 1.42
  px, three-quarter 1.48 px. The far-side legs are worst (shoulder 3.0 px, knee
  2.3 px). Left/right leg swaps: 15 of 3,300 leg points (`finder_exam.json`).
- On the real videos, fit reprojection error (mean px at 640 x 360): walk 1.64,
  trot 2.45, bite 2.71, three-quarter walk 2.54, death 5.96, **gallop 9.23**. In
  the gallop the motion blur and the fully stretched poses are outside the
  training range.
- Paw question: the V1 twist was a roll about the paw bones' own long axis. That
  does not move any joint position (heads and tails are unchanged), and the V2
  deform skeleton is identical to V1 (head/tail/matrix difference 0.0). The
  landmarks therefore stay valid for V2, and the paw places fit (walk / bite
  reprojection 1.6-2.7 px; detection sheets in `lanes/lm_*.jpg`).

## 3. Fit onto the rig (fixed V2 rig from 683c522)

- Per frame, a weak-perspective least-squares fit (numpy forward kinematics of
  the rig, 41 parameters: body offset and orientation, spine, neck, head, jaw,
  ears, tail, every leg bone in the side plane) with priors and frame-to-frame
  smoothness. A camera smoothing pass follows. For bite and death, a soft "lowest
  paw on the floor" term resolves the camera-height versus crouch ambiguity.
- Gaits: the period comes from the landmark tracks (walk 32.9, trot 15.8, gallop
  9.3, three-quarter walk 30.1 video frames). All cycles after the start-up are
  folded onto one phase and averaged, which gives a seamless loop. Paws are
  planted from where they stand still. Root speed comes from the planted paws:
  walk 0.58, trot 1.64, gallop 6.6, three-quarter walk 0.65 m/s.
- How consistent the video's own cycles are (RMS leg angle around the averaged
  cycle): walk 1.3 deg, three-quarter walk 2.2, trot 9.0, **gallop 34.9** (the
  gallop data is unreliable).
- Paw contacts are cleaned: during stance the paw pivot is fixed in the world on
  the floor, and paw and toe rotation blend to the rest orientation, which on
  the V2 rig means **soles down**. Toes are kept above the floor.
- Bite and death are kept in place: the root estimate from a crouching or
  falling dog was not reliable (it gave 0.6-1.4 m of drift).
- Baked through the V2 control rig: IK feet, keyed scapula (V2 took the scapula
  out of the IK chain), spine, neck, head, jaw, ears and tail.
- **Collar and rings**: the V1 pendulum solver, made deliberately calm (collar
  limit 3 deg instead of 7, rings 22/16 deg instead of 60/45, less inertia,
  stronger damping). After that, a smoothing pass caps the collar at 3 deg, the
  rings at 18 deg, and every change at 5 deg per frame (cyclic on the loops).
  Measured on all 6 fitted actions: collar at most 3.0 deg, rings at most 18 deg,
  **largest change per frame 5.3 deg**, so nothing spins or flips.
  Finding for the Human: the hand-built V2 actions in `683c522` still use the old
  settings. Their rings jump **84-120 deg in a single frame** in Walk, Trot, Bite
  and Death (they snap from one limit to the other). That matches "das Halsband
  dreht durch" (`anim_stats.json`, `collar_rings`).
- Result: `StyleSample/Creatures/BrandHoundVideo/Source/BrandHoundVideo.blend`
  (V2 rig and mesh, V2 actions untouched, new actions `A_BrandHoundVideo_Walk`
  (42 frames), `_Trot` (21), `_Gallop` (13), `_Bite` (151), `_Death` (100),
  `_WalkTQ` (39); textures referenced relative to `../../BrandHound/`). No FBX
  export, because this is a trial.

## 4. Proof

- Raw videos: `BrandHoundVideo/Videos/v1_walk.mp4` ... `v7_death_b.mp4`.
- Moving previews, side and game camera (MP4 H.264, 800 x 500, 30 fps, about 3 s,
  plus GIF 360 px): `BrandHoundVideo/Previews/BrandHoundVideo_<Walk|Trot|Gallop|Bite|Death|WalkTQ>_<side|game>.mp4`.
- Paw check (front camera, lower half): `Previews/BrandHoundVideo_paws_front_lower_half.png`.
  Soles are down and planted paws are flat. Some frames show legs crossing under
  the body, because the fit has no sideways leg freedom.
- Side by side (Seedance source | video fit on V2 | V2 hand-built | V1
  hand-built): `BrandHoundVideo/SideBySide/BrandHoundVideo_<Walk|Trot|Gallop|Bite|Death>_vs_handbuilt.mp4`.
- Footfall charts (measured paw contacts, the same metric for video and
  hand-built): `BrandHoundVideo/Footfall/BrandHoundVideo_Footfall_<Walk|Trot|Gallop>.png`.
- Foot slide. This is the horizontal travel of the paw ball per frame while it
  is on the ground (ball within 1.5 cm of its rest height), the same Blender
  measurement on every action:

| Action | mean cm | p95 cm | max cm | Hand-built V2 (mean / p95 / max) |
|---|---|---|---|---|
| Video Walk | 1.19 | 6.0 | 12.6 | Walk 0.23 / 0.72 / 3.0 |
| Video WalkTQ | 0.48 | 2.5 | 10.3 | |
| Video Trot | 1.98 | 9.5 | 12.1 | Trot 0.53 / 1.75 / 3.0 |
| Video Gallop | 5.65 | 8.1 | 9.8 | Run 0.77 / 1.46 / 4.2 |
| Video Bite | 1.13 | 3.8 | 14.9 | Bite 0.04 / 0.09 / 1.6 |
| Video Death | 1.44 | 7.1 | 15.7 | Death 0.05 / 0.43 / 0.9 |

## 5. Honest verdict: it does not beat hand-built V2

- **Bite**: the best video result. Natural crouch, lunge, snap and recovery with
  the head and body acting together, more alive than the hand-built bite.
  Remaining issue: paw slide at the edges of steps.
- **Walk**: real dog timing and body / head motion from the video. The
  three-quarter lane gives a clean lateral-sequence footfall similar to V2. In
  the side lane, the left hind barely lifts (that leg's fit is weak) and paws
  slide more than in V2 (1.2 vs 0.23 cm mean). In front view the legs sometimes
  cross.
- **Trot**: usable timing, but noisy cycles (9 deg) and visible slide.
- **Gallop**: fails. The video is excellent, but blur and extreme stretch poses
  defeat the finder (9 px, cycles 35 deg apart). The averaged loop is smeared.
  V2 hand-built is clearly better.
- **Death**: only the first collapse (about 1.4 s) carries over. The video dog
  rolls over its back, which a side-only fit cannot represent, and the lying
  pose is contorted. V2 hand-built is clearly better.
- Overall: the pipeline works end to end on the fixed rig. The source videos are
  much better than what reached the rig. The losses are side-only 3D, blur, far
  legs and leg width. Most useful as a hybrid: take timing, body, head and tail
  motion from the video (bite, walk), and keep hand-built leg placement and the
  gallop / death.

## 6. Open points and housekeeping

- A stray folder `C:/inputs` (two start PNGs from an early path bug of mine) is
  left on the Human's disk: the removal was blocked by a safety check and needs
  a manual delete.
- Work files: `C:/GameDev/Underreign_Assets/AnimWork/UR-CREATURE-VIDEO-V1/`
  (training renders and features about 5 GB, finder model
  `models/hound_finder_v1.pt`, fits `lanes/`).
- Evidence here: `jobs.json`, `endpoints.log`, `finder_exam.json`,
  `finder_train.log`, `anim_stats.json`, `lanes/` (gait summaries, fit log,
  detection sheets, video contact sheets).
