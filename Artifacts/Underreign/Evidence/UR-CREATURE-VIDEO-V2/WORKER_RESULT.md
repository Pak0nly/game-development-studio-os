# UR-CREATURE-VIDEO-V2: Worker result (better transfer of the Seedance hound videos: walk and bite)

Worker: separate Claude Code subagent. Gate: `verify-worker` printed
`PASS worker receipt 660ab58e815791e341b50c09ae94c67dc1269b083b35a92268f331e5dd55844b`
before any change. Nothing committed or pushed. No Unreal, no network, no Seedance
call, no retraining. Blender 5.2.3 in background mode only (Eevee previews only while
no Unreal process was running; the render script falls back to Workbench otherwise).
External repository HEAD moved from `6a47e6e` to `94041ca` during the run (commit of the
parallel UR-STYLE-SAMPLE-V6 order, not mine). `StyleSample/Creatures/BrandHound` and
`C:/GameDev/AnimTools` were only read.

## 1. What changed in the transfer

The V1 finder, its per-video landmarks and the V1 per-frame fits were reused unchanged.
The changes sit between the fit and the bake (`Scripts/V2/post.py`, `apply_fit_v2.py`):

- **Anatomical stance width (depth from the rig prior).** The side fit has no reliable
  depth, so each paw now stands on a fixed lateral line under its elbow / knee:
  front half width 18.5 cm, hind 20 cm (V2 rig: shoulder joint x 17-20 cm, elbow 20 cm,
  knee 19 cm). Left and right can therefore never cross or splay. Body yaw and roll from
  the fit are reduced to 35 % (they came mostly from depth noise).
- **No dragged paws.** The video's stance timing (which paw is down when) is kept. During
  stance the paw is fully locked in the world and flat. Every swing is rebuilt as a
  smooth arc from the previous foothold to the next with a forced lift (apex 7.5 cm
  front, 6.5 cm hind). The fitted paw flex during swing is kept.
- **Tail.** Side wave travelling down the chain (amplitude growing to the tip, one wave
  per stride), vertical follow-through lagging the body bounce, and each tail bone
  delayed a little more than its parent; the fitted tail is despiked first.
- **Collar calmer.** Caps tightened from 3 / 18 deg to 2 deg (collar) / 12 deg (rings),
  change per frame capped at 3 deg (was 5).
- **Bite split.** Video frames 0-46 (crouch, lunge, snap) + 8-frame crossfade + 92-120
  (recovery) = `Bite` (102 frames at 30 fps). Video frames 44-90 (hold with head shake)
  = separate `Shake` (58 frames) for a tug / shake animation. Both kept in place, all
  four paws pinned flat on anatomical footholds.
- **Lunge.** Root and body offset stay in place; the reach is only neck / head. Measured
  forward reach of the head tip: **8.2 cm** (hand-built V2 bite: 37.5 cm), so the bite
  cannot pass through an enemy model.

New actions in `StyleSample/Creatures/BrandHoundVideo/Source/BrandHoundVideo.blend`
(V1 video actions and hand-built V2 actions untouched): `A_BrandHoundVideo2_Walk` (42
frames loop, side video), `A_BrandHoundVideo2_WalkTQ` (39, three-quarter video),
`A_BrandHoundVideo2_Bite` (103), `A_BrandHoundVideo2_Shake` (59).

## 2. Measured numbers (same Blender measurement for every action, `anim_stats.json`)

Paw slide = horizontal travel of the paw ball per frame while on the ground. Stance width =
distance between left and right paw ball (min / mean / max). Crossing = smallest
left-minus-right distance (negative would mean crossed legs).

| Action | slide mean / p95 / max cm | width front cm | width hind cm | crossing min cm | tail tip side range cm |
|---|---|---|---|---|---|
| **V2 video Walk** | **0.07 / 0.0 / 2.6** | 36.2 / 37.0 / 38.2 | 36.9 / 38.7 / 40.4 | 36.2 | 26.2 |
| V1 video Walk | 1.19 / 6.0 / 12.6 | 30.4 / 43.7 / 55.4 | 48.5 / 54.1 / 60.2 | 30.4 | 5.1 |
| Hand-built V2 Walk | 0.23 / 0.72 / 3.0 | 36.7 | 41.7 | 36.7 | 30.4 |
| V2 video WalkTQ | 0.24 / 0.82 / 8.2 | 35.5 / 36.7 / 38.1 | 36.8 / 38.3 / 39.3 | 35.5 | 20.6 |
| **V2 video Bite** | **0.0 / 0.0 / 0.0** | 36.7 | 38.7 | 36.7 | 34.7 |
| V1 video Bite | 1.13 / 3.8 / 14.9 | 39.7 / 44.8 / 49.1 | 49.8 / 53.9 / 58.0 | 39.7 | 38.7 |
| V2 video Shake | 0.0 / 0.0 / 0.0 | 36.7 | 38.7 | 36.7 | 19.8 |

- Footfall: in the V1 side walk the hind left paw **never left the ground** (dragged). In
  V2 every paw lifts once per stride in a lateral-sequence walk (hind left, front left,
  hind right, front right), stance fraction 56-66 %.
- Collar / rings: collar at most 2.0 deg, rings at most 12 deg, largest change per frame
  1.6-3.0 deg on Bite / Shake; on the walk loops the seam frame gives 5.4 deg (Walk) and
  7.9 deg (WalkTQ) on one ring.
- WalkTQ: the toe tip dips 4.7 cm under the floor in a swing frame and IK reach misses by
  3.5 cm; the side Walk has neither (min toe 0.5 cm, reach 0.0 cm). Use the side Walk.

## 3. Proof (in `StyleSample/Creatures/BrandHoundVideo/`)

- Previews, side and game camera (MP4 + GIF):
  `Previews/BrandHoundVideo2_<Walk|WalkTQ|Bite|Shake>_<side|game>.mp4`.
- Front view, lower half, 8 walk frames, V2 fit vs V1 fit vs hand-built V2:
  `Previews/BrandHoundVideo2_Walk_front_lower_half.png` (V1 splayed and uneven, V2 parallel
  like the hand-built walk; the crop is tight and cuts the legs high).
- Side by side (Seedance source | V2 video fit | V1 video fit | V2 hand-built):
  `SideBySide/BrandHoundVideo2_Walk_vs_V1fit_handbuilt.mp4`,
  `SideBySide/BrandHoundVideo2_Bite_vs_V1fit_handbuilt.mp4` (the bite panel is the cut
  version, so it runs ahead of the full source clip after the snap).
- Footfall: `Footfall/BrandHoundVideo2_Footfall_Walk.png` (V2 Walk, V1 Walk, hand-built
  Walk, V2 WalkTQ).
- Scripts: `Scripts/V2/`. Lane info and logs: `Evidence/UR-CREATURE-VIDEO-V2/lanes/`.

## 4. My own look at the previews

- Walk (side): paws visibly lift and fold in swing, planted paws stay put, legs parallel,
  tail swings clearly, collar calm. Timing and head / body motion are still from the video.
- Bite: crouch, snap and recovery read well; the dog stays on the spot. During the snap the
  tail kicks up for about 10 frames (this is in the video too: the tail rises in the leap).
  Because the paws are pinned, the airborne lunge of the video becomes a planted lunge.
- Shake: reads as a strong tug / hold with small head jerks. The real shake in the video is
  mostly a sideways (yaw) head shake that a side-only fit barely sees, so the shake itself
  is weak. It needs either the three-quarter view or a hand-added head yaw.
- Not checked: the game camera previews only at contact-sheet size.

## 5. Death: not done

Walk and bite took the time box. I looked at the death video: the dog collapses (0-1.4 s),
rolls over its back with the legs up (1.6-2.0 s), then lies on its side. A side-only fit
cannot represent the roll, and the left/right swap when lying needs a body-roll parameter
plus temporal side tracking in the fit itself, not only a post step. Not started.

## 6. Lessons for the next round

1. The video is reliable for **timing** (which paw is down when), body / head motion and
   tail rhythm; it is unreliable for **depth** (stance width, left/right when overlapping).
   Taking timing from the video and placement from rig rules beat the free fit clearly
   (slide 1.19 -> 0.07 cm mean, width spread 25 cm -> 2 cm, hind left now lifts).
2. Stance detection from the fit was good enough to drive rebuilt swings; the forced lift
   removed dragging without inventing a new footfall.
3. A front or top-down video (or the three-quarter view fused into the fit) is what is
   missing for yaw motions (head shake) and for the death roll.
4. Cutting one-shots in fit space (crossfade between fit frames) is cheap and clean.
5. The loop seam of the ring smoothing still allows one 5-8 deg step; smooth the seam
   cyclically before the per-frame cap.

## 7. Housekeeping

- Stray folder `C:/frames` (three folders of 8 front-view test PNGs from a relative-path
  mistake of mine) is on the Human's disk; removal was blocked by a safety check and needs
  a manual delete. The V1 stray `C:/inputs` is also still there.
- Work files: `C:/GameDev/Underreign_Assets/AnimWork/UR-CREATURE-VIDEO-V2/`.
