# UR-CREATURE-VIDEO-V3: Worker result (one Seedance video with two cameras in one picture, two-view fit)

Worker: separate Claude Code subagent. Gate: `verify-worker` printed
`PASS worker receipt af8258fad2c86788be9bb6e453dbd10308bf5bb2217930322b715dc6f5e9f831`
before any change. Nothing committed or pushed. No Unreal. Blender 5.2.3 in background mode only, all
renders (start picture, training set, previews) with **Cycles on the CPU**. No GPU was used at all (see
section 7). `StyleSample/Creatures/BrandHound` and `C:/GameDev/AnimTools` were only read.

## 1. Start picture and the one Seedance video

- Start picture (`Videos/StartImages/start_split_v3.png`, 1280 x 720): left half pure side view, right half
  pure front view of the fixed V2 hound in its rest (standing) pose. Both cameras orthographic, pitch 0, the
  same scale (3.0 m across one 640 px half, 213.3 px/m), the same ground line (z = 0 at pixel row 600 in
  both halves), plain dark-grey background (sRGB 92) with a slightly lighter floor band (sRGB 108) below the
  ground line, even light. Exact setup: `Videos/StartImages/start_split_v3_camera.json` and
  `Scripts/V3/scene3.py` (projection: side u = 320 + k*y, front u = 320 + k*x, v = 600 - k*z).
- **One generation** (`Videos/v3_walk_split.mp4`, prompt `Videos/Prompts/v3_walk_split.txt`):
  `dreamina-seedance-2-5-260628`, image-to-video (first frame), 720p, **4 s**, 24 fps, 97 frames, no audio.
  **Tokens: 87,300** (a 5 s clip cost 108,900 in V1). Chosen duration: a calm walk stride was about
  1.4 s in V1, so 3 s could not hold two full strides after the start-up; 4 s gave 3.3 strides. Accepted
  on the first submit, no rejected attempts. Network: 1 POST + 18 status GETs to
  `ark.ap-southeast.bytepluses.com` and 1 download from the ModelArk result bucket the API returned
  (`endpoints.log`, ledger `jobs.json`). Key read at run time only; a scan of 128 evidence / script / log
  files found it in 0 files.
- Video quality (my look at contact sheets, `lanes/video_sheet*.jpg`): both cameras stayed locked, the
  split line and ground line did not move, the hound walks in place in both halves, same hound throughout,
  no cuts. The global camera check on frame 0 found offsets below 0.5 px and scale 1.000-1.003, so the
  nominal cameras were used unchanged. Human verdict (relayed): wide-legged in the front view, otherwise
  very good build, muscle play and sequence.

## 2. Two-view finder (CPU)

- 2,007 poses rendered from **both** cameras (4,014 training images) + 150 exam poses (300 images):
  frames of hand-built and video-fitted actions plus random rig changes (now also sideways: feet x, head /
  neck yaw, body yaw and offset), camera jitter, composited on random dark-grey backdrops with noise, blur
  and JPEG. Planned 2,300 poses; stopped at 2,007 for time.
- Same frozen DINOv2 ViT-S/14 plus small decoder as V1, square 336 px crops, one model for both views.
  The backbone features were computed on the CPU in bfloat16 (this torch build has no MKL: fp32 matmul ran
  at about 40 GFLOP/s, bf16 through oneDNN about 2,300 GFLOP/s), the decoder was trained on the CPU
  (16 epochs, 36 min).
- **Exam (300 held-out renders, 640 x 720 half): side view mean 2.59 px (p90 4.8), front view mean 3.88 px
  (p90 7.9); left/right leg swaps: side 15 of 1,650, front 0 of 1,650** (`finder_exam.json`). The front view
  is worse mainly on the hind legs and tail, which hide behind the chest.

## 3. Two-view fit with silhouettes

`Scripts/V3/fit3.py`: per frame least squares on the rig (51 parameters: the V1 side-plane joints plus body
x, leg abduction, neck / head yaw, head roll, spine side bend) with keypoints from both views and a
silhouette term in both views. The rig mesh is skinned in numpy (4,000-vertex subset); rig vertices outside
the video mask are pulled in (distance transform) and every point of the video mask outline must have a rig
vertex near it. Paws never below the floor, priors, smoothness, joint limits. Pass 1 keypoints only, pass 2
keypoints + silhouettes. Scoring rasterises all 52k rig triangles in both views (an exact rig render vs. its
own render alpha scores 0.96, the practical ceiling).

**Silhouette overlap (IoU, 97 frames)** (`fit_walk3_summary.json`):

| View | keypoints only: mean / worst | keypoints + silhouette: mean / worst (frame) |
|---|---|---|
| Side | 0.885 / 0.849 | **0.920 / 0.897** (f83) |
| Front | 0.890 / 0.851 | **0.907 / 0.888** (f57) |

Keypoint error after the fit: side 3.1 px mean (p90 5.5), front 4.8 px (p90 9.8).

## 4. Walk (loop) and the stance width

- Gait (`lanes/gait_walk3.txt`): period 23.8 video frames (1.0 s per stride, 30-frame loop at 30 fps),
  3.3 cycles folded, cycle-to-cycle spread of the leg angles 1.5 deg RMS (V1 side walk 1.3), treadmill speed
  0.69 m/s, lateral-sequence walk, stance 70-73 % per paw.
- Post (`Scripts/V3/post3.py`), V2 rules kept: video timing for stance, paws locked while down, forced lift
  arcs, joint limits, calm collar. New: the loop seam of collar / rings is closed first (the seam mismatch is
  spread over the cycle) and the per-frame cap runs cyclically; yaw and roll of the body are kept
  (measured in the front view), lateral body sway from the front view kept.
- **Stance width, following the Human verdict during the run:** the video hound stands wide-legged, so the
  footholds stay on the V2 anatomical lines (paw under elbow / knee, half width front 18.5 cm, hind 20 cm);
  only the measured step-to-step deviation (max 4 cm) is added. Measured in the video (two-view fit, leg
  lines): **front 43.9 cm, hind 58.8 cm**. Final fit: **front 36.7-37.5 cm (mean 36.9), hind 38.1-39.4 cm
  (mean 38.7)**. The front-view sheet (`Previews/BrandHoundVideo3_Walk_front_lower_half.png`) shows parallel
  legs, no crossing, like V2.

## 5. Bite re-transfer (from the V1 bite video, no new video)

`Scripts/V3/bite3.py`: the V1 per-frame fit of `v4_bite` cut like V2 (frames 0-46, 8-frame crossfade,
92-120). On top, a forward body offset: wind-up back of at most 4 cm during the crouch (the hind paws come
under the body in the video), the lunge between the video's lunge frames 30-37, hold through the snap, calm
return over 16 frames. Lunge size solved for 25 cm head-tip reach: body forward **16.7 cm**, front paws step
forward 18.4 cm with a lifted arc and step back on the return, hind paws pinned. Lateral footholds on the
anatomical lines; yaw / roll damped to 35 % (this fit is side-only).

## 6. Numbers (same Blender measurement as V2, `anim_stats.json`)

| Action | slide mean / p95 / max cm | width front cm (min/mean/max) | width hind cm | crossing min cm | head reach cm | rings max step deg |
|---|---|---|---|---|---|---|
| **V3 Walk** | **0.09 / 0.0 / 3.4** | 36.7 / 36.9 / 37.5 | 38.1 / 38.7 / 39.4 | 36.7 | 1.4 | **3.0** |
| V2 video Walk | 0.07 / 0.0 / 2.6 | 36.2 / 37.0 / 38.2 | 36.9 / 38.7 / 40.4 | 36.2 | 0.1 | 5.4 |
| Hand-built V2 Walk | 0.23 / 0.72 / 3.0 | 36.7 | 41.7 | 36.7 | 0.9 | 100.6 |
| **V3 Bite** | **0.0 / 0.0 / 0.02** | 36.7 | 38.7 | 36.7 | **24.9** | 3.0 |
| V2 video Bite | 0.0 / 0.0 / 0.0 | 36.7 | 38.7 | 36.7 | 8.2 | 3.0 |
| Hand-built V2 Bite | 0.04 / 0.09 / 1.6 | 45.5 | 56.5 | 45.5 | 37.5 | 119.5 |

V3 Walk: min toe height 0.2 cm, IK reach error 0.005 cm, tail tip side range 15.2 cm (V2 26.2). V3 Bite: min
toe height 2.0 cm (a 2 cm toe dip in the first bake was fixed by keeping the paws flat).

## 7. GPU

None. All rendering in Cycles on the CPU, finder and fit on the CPU. The Human's later GPU permission came
when the finder training was already 11 of 16 epochs in; per the rule not to restart a nearly finished CPU
run it stayed on the CPU. The venv's torch is a ROCm build that reports a GPU device; it was not used, so
there are no GPU load peaks to report.

## 8. Proof (in `StyleSample/Creatures/BrandHoundVideo/`)

- Moving previews (MP4 H.264 800 x 500 + GIF 360 px, Cycles CPU):
  `Previews/BrandHoundVideo3_Walk_side|game.mp4/.gif`, `Previews/BrandHoundVideo3_Bite_side|game.mp4/.gif`.
- Side by side (Seedance source | V3 fit | V2 fit):
  `SideBySide/BrandHoundVideo3_Walk_vs_V2fit_side.mp4` (side half of the split video),
  `SideBySide/BrandHoundVideo3_Walk_vs_V2fit_front.mp4` (front half, front camera),
  `SideBySide/BrandHoundVideo3_Bite_vs_V2fit_side.mp4` (V1 bite video). The V2 panels reuse the V2 Eevee
  frames for side / bite, so their lighting differs slightly.
- Front view: `Previews/BrandHoundVideo3_Walk_front_lower_half.png` (V3 vs V2 fit vs hand-built, 8 frames).
- Footfall: `Footfall/BrandHoundVideo3_Footfall_Walk.png`.
- New actions in `Source/BrandHoundVideo.blend`: `A_BrandHoundVideo3_Walk` (30 frames loop),
  `A_BrandHoundVideo3_Bite` (104 frames); older actions untouched.
- Scripts: `Scripts/V3/`. Evidence here: `jobs.json`, `endpoints.log`, `finder_exam.json`,
  `finder_train.log`, `fit_walk3_summary.json`, `anim_stats.json`, `lanes/` (landmark sheet with mask
  outlines, video sheets, label check, gait / post logs, preview sheets).

## 9. Honest verdict versus V2

- **The measurement is clearly better; the walk result is only a little different.** The front view
  measures stance width, left/right order, sway, yaw and roll, which V2 had to guess; the silhouette term
  raised the overlap from 0.885 to 0.920 (side) and 0.890 to 0.907 (front). But after the rig rules
  (locked paws, anatomical width at the Human's request) the baked walk looks much like V2: same slide
  level, same width, parallel legs. Visible gains: real body sway and roll, a clean collar loop (3.0 deg
  max step instead of 5.4). Losses: the stride is faster (1.0 s, from this video), and the tail swings less
  (15 vs 26 cm). I judged this from frame sheets only; I did not watch the clips moving, so the feel
  of the motion still needs the Human's look.
- **Bite: clearly better than V2 on the stated problem.** The body now goes forward with a 25 cm head reach
  (V2 8 cm, hand-built 37.5 cm). The front paws step out and back, and the hind paws stay planted. But
  the lunge itself is rule-made (the size is solved for, the timing comes from the video's lunge frames).
  It is not newly measured, because the bite source is still the old side-only video.

## 10. Lessons for the next round

1. The split two-camera picture works with Seedance: locked cameras, synchronous halves, and the same
   hound in both. One clip gives true 3D, and the cameras can be reused unchanged from the start picture.
2. 4 s was enough for 3.3 calm strides at 87,300 tokens. For loops, **shorter clips are feasible**: 4 s
   (or 3 s for faster gaits such as the trot) is enough, because only one clean cycle is folded.
   **Several motions per clip** (for example walk, then stop, then bite) look possible because the fit
   handles any frame range, but every transition costs strides. I would try that only for short one-shots,
   cut by frame range like the bite.
3. The video's proportions are not the rig's: the generated hound is wide-legged. Take timing, sway and
   order from the video, and take placement from rig rules (now confirmed by the Human).
4. This CPU torch build needs bfloat16 for the backbone (about 60x faster than fp32 here). Training renders
   with Cycles CPU at 640 x 720 take about 1.7 s each; plan 1-1.5 h for a 2,000-pose two-view set, or
   reuse this set.
5. A split-picture bite video (front and side) would let the lunge, the head shake (yaw) and the death
   roll be measured instead of rule-made.

## 11. Housekeeping

- **Stray folder on C:/:** `C:/inputs` now holds 4 files from my first start-picture render, caused by a
  relative path in Blender: `raw_front.png`, `raw_side.png`, `start_split.png`, `start_split_mask.png`. The
  move / removal was blocked by a safety check and needs a manual delete (the V1 stray `C:/inputs` and V2
  `C:/frames` were reported earlier). After that, every path was absolute.
- Work files: `C:/GameDev/Underreign_Assets/AnimWork/UR-CREATURE-VIDEO-V3/` (training renders about 0.7 GB,
  cached features about 4.6 GB, model `models/hound_finder_v3.pt`, fits `lanes/`, frames, `out/`).
