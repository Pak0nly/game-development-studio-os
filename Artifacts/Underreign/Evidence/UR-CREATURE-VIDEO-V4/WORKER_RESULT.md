# UR-CREATURE-VIDEO-V4: Worker result (walk without the twitch, full bite without the shake)

Worker: separate Claude Code subagent. Gate: `verify-worker` printed
`PASS worker receipt c8cb3fa4ef6ecaeb64c42030e5164b57fa1c2b48b450eb02d9ffffdbf478af72`
before any change. Nothing committed or pushed. No network, no Seedance, no Unreal. Blender 5.2.3 in
background mode only; every render in Cycles on the CPU. No GPU used. The V3 work folder,
`StyleSample/Creatures/BrandHound` and `C:/GameDev/AnimTools` were only read. Work files:
`C:/GameDev/Underreign_Assets/AnimWork/UR-CREATURE-VIDEO-V4/`. Nothing new was created directly under `C:/`.

## 1. Walk: cause of the twitch

Measured on the baked V3 walk (`joint_velocity_v3_cause.json`, script `Scripts/V4/measure_twitch.py`):
the angle change per frame of the upper arm and thigh (after IK, relative to the parent bone), with each
paw's lift-off and touch-down frame marked.

**Cause:** the V3 post step set every planted frame of a paw to "flat" and left the swing frames at the
fitted paw bend. The paw control also carries the IK target at the wrist / hock. So at lift-off the paw
snapped from flat to 50-55 deg (front) or 28 deg (hind) in **one frame**. At touch-down the hind paw
snapped from 25 deg back to flat. The wrist jumped 15.8-17.7 cm in that frame (the normal swing step is
7-9 cm), and the IK threw the upper arm / thigh by 15-24 deg in one frame. The rest of the cycle moves
1-4 deg per frame. A second, smaller cause: the lift curve `sin(pi*s^0.85)` starts with an unlimited
upward speed. No pole flip and no per-frame cap was involved.

**Fix** (`Scripts/V4/contacts4.py`; footholds, stance timing, stance width, body, spine, neck, tail and
the muscle deformation are unchanged from V3):
- The paw bend is one continuous curve: flat while planted, fitted while swinging, smoothed in time.
  At the end of stance this becomes a heel-off: the paw rolls over the toe ball over 2-3 frames, and the
  wrist / hock rise and move forward. At touch-down the paw sets down slightly tilted and rolls flat.
- The roll turns about the toe ball, which stays locked in the world, so there is no slide. The toes
  stay flat on the ground for the whole stance.
- The swing is rebuilt on the toe ball with zero vertical speed at lift-off and at touch-down. The
  forward motion uses an eased curve (a mix of smoothstep and smootherstep). The apex height is the V3
  apex. I chose the curve from a 24-variant sweep (`sweep_list.txt`, `twitch_sweep.json`).

## 2. Walk: joint velocity before / after (`twitch_table_walk.md`, `joint_velocity.json`)

Speed = how far the joint turned in that frame (deg per frame at 30 fps). Jolt = the largest change of
that speed within +-2 frames of the contact (deg per frame squared). The calm part of the cycle has a
jolt of 0.5-1.0.

| Leg | Joint | Event | V3 speed | **V4 speed** | V3 jolt | **V4 jolt** |
|---|---|---|---|---|---|---|
| front left | upper arm | lift-off | 18.8 | **5.8** | 19.6 | **4.6** |
| front right | upper arm | lift-off | 17.3 | **6.4** | 18.1 | **6.4** |
| hind left | thigh | touch-down | 15.2 | **1.2** | 17.9 | **1.2** |
| hind right | thigh | touch-down | 0.4 | **2.8** | 3.6 | **4.3** |
| hind left | thigh | lift-off | 10.7 | **1.1** | 14.5 | **4.8** |
| hind right | thigh | lift-off | 23.8 | **7.0** | 27.6 | **3.6** |
| front left | upper arm | touch-down | 0.7 | 0.9 | 4.4 | 6.4 |
| front right | upper arm | touch-down | 0.9 | 0.9 | 6.8 | 8.9 |

The upper arm curve (`pitch_final.json`) in V3 jumps -145 -> -162 deg in the lift-off frame. In V4 it goes
-150.9, -157.0, -162.7, -165.3, then forward: a smooth turn instead of a jump. The thigh at hind
touch-down jumps -30 -> -17.5 deg in V3; in V4 the curve is smooth.
**Open point (honest):** at **front touch-down** the jolt is slightly higher than V3 (6.4 / 8.9 vs 4.4 /
6.8). This is not a one-frame jump. The forward swing of the upper arm brakes over 3 frames and reverses
into the stance push. The paw now arrives a little faster, because the whole swing has to happen inside
the swing frames (V3 got a head start from the jump at lift-off). The peak swing speed of the front upper
arm is 11-16 deg per frame (V3 15-19 including the jump).

Other walk numbers (`anim_stats.json`):

| | slide mean / max cm | width front cm | width hind cm | min toe cm | collar max step deg |
|---|---|---|---|---|---|
| **V4 Walk** | **0.06 / 1.3** | 36.7-36.8 (mean 36.7) | 38.7-38.8 | 0.6 | 0.2 (rings 3.0) |
| V3 Walk | 0.09 / 3.4 | 36.7-37.5 (mean 36.9) | 38.1-39.4 | 0.2 | 0.2 (rings 3.0) |

Same 30-frame loop, same pace (1.0 s per stride, 0.69 m/s), same footfall order and stance share
(`Footfall/BrandHoundVideo4_Footfall_Walk.png`). The front view (`BrandHoundVideo4_Walk_front_lower_half.png`)
shows parallel legs, like V3. The paw bend at its peak in swing is a little smaller after the smoothing:
front 49-53 deg vs 63-66 in V3.

## 3. Bite: full video motion, only the shake cut out (`Scripts/V4/bite4.py`)

Source: the V1 per-frame side fit of `v4_bite.mp4` (no new video). Cut as before: video frames 0-46
(crouch, snap, landing), an 8-frame crossfade, then 92-120 (step back, stand). Only the head shake
(44-90) is removed. The result is 105 frames at 30 fps (3.5 s).
- **Body travel** (new): a wind-up back of 6 cm during the crouch, the snap forward, a hold, then the step
  back to the start place. The snap size is solved for the head reach: **forward travel 19.7 cm, head-tip
  reach 27.9 cm** (Blender measurement; target range 20-35, V3 24.9).
- **All four paws step** (new): front paws lift and land 19.7 cm further forward with the snap, and the
  hind paws follow 3-4 video frames later. On the step back, each paw makes one step back to its start
  foothold, in the video's order (front right, hind right, hind left, front left). Lift height: front 7.0
  cm, hind 5.9-6.0 cm (step back 75 % of that). Every step uses locked footholds and the same smooth
  contact transitions as the walk. Paw slide mean 0.01 cm, max 0.99 cm (one swing frame near the floor),
  IK error 0.005 cm, lowest toe 1.96 cm. V3: hind paws never left the ground.
- **Less front drop:** the video crouch lowers the body 27 cm and pitches it 15 deg nose-down. V4 keeps 55 %
  of that. The lowest withers / chest point (spine_03) is **19.2 cm below the start** (V3: 29.5 cm).
  Neck and head motion (the bite itself) are unchanged.
- During the leap the fit's shoulder blades swung +-8 deg in 3 video frames. In the shorter V4 snap this
  made the upper arm flail by 40 deg, so the shoulder-blade curves are smoothed (sigma 2.5 video frames).
  The landing rise of the body is softened slightly (sigma 1.5).
- **Clean end:** every pose value blends into the start pose over the last 10 video frames, and the
  paws stand on their start footholds. The last rendered frame equals the first (mean pixel difference
  0.04 of 255).
- Joint jolt around the bite contacts: at most 5.6 (upper arm) and 5.3 (thigh). V3 bite: 15.9-17.8 at
  front touch-down.

## 4. My own look at the motion

I looked at full-rate frame strips around the contacts, not only at sheets (`look/`):
- `walk_side_fl_lift.jpg` (frames 14-20, V4 top, V3 bottom): V3 snaps the front paw from flat to
  bent and lifted between frames 15 and 16. In V4 the paw rolls over the toes over frames 15-16 and then
  lifts.
- `walk_legh_touch_v4_v3.jpg` (hind leg, frames 15-21): V3 throws the near hind leg back between 17 and
  18 at touch-down. In V4 the leg settles over 16-18.
- `bite_snap.jpg` (frames 37-52): front paws lift around 40, land around 45; hind paws lift around 42-49
  and plant forward. `bite_hind_back.jpg` (72-87): both hind paws visibly lift and step back.
- Not judged: the overall feel at playback speed. I can only check the contacts frame by frame; the
  Human's look at the moving clips decides.

## 5. Proof (in `StyleSample/Creatures/BrandHoundVideo/`)

- Moving previews (MP4 800x500 + GIF): `Previews/BrandHoundVideo4_Walk_side|game.mp4/.gif`,
  `Previews/BrandHoundVideo4_Bite_side|game.mp4/.gif`.
- Side by side, Seedance source | V4 | V3 (same renderer and lighting):
  `SideBySide/BrandHoundVideo4_Walk_vs_V3_side.mp4` (side half of the split video),
  `SideBySide/BrandHoundVideo4_Bite_vs_V3_side.mp4` (V1 bite video; the source runs longer because the
  shake is cut from V4 / V3).
- Close-ups of one front leg and one hind leg (side): `Close/BrandHoundVideo4_Walk_legs_V3_vs_V4_30fps.mp4`
  (2x2 grid V3 | V4, 4 loops), `_10fps.mp4` (slow), `.gif`; `Close/BrandHoundVideo4_Bite_legs_30fps.mp4`,
  `_15fps.mp4`, `.gif`.
- Front view: `Previews/BrandHoundVideo4_Walk_front_lower_half.png`. Footfall:
  `Footfall/BrandHoundVideo4_Footfall_Walk.png`.
- New actions in `Source/BrandHoundVideo.blend`: `A_BrandHoundVideo4_Walk` (30-frame loop),
  `A_BrandHoundVideo4_Bite` (104 frames, 105 keys). Older actions untouched.
- Scripts: `Scripts/V4/`. Evidence here: `anim_stats.json`, `joint_velocity.json` (V3 / V4 walk and
  bite), `joint_velocity_v3_cause.json`, `twitch_table_walk.md`, `pitch_final.json` (joint angle curves),
  `paw_paths.json`, sweep files, `post_bite4.txt`, `contacts_walk4.txt`, `bite_video_sheet.jpg`, `look/`.

## 6. Honest verdict versus V3

- **Walk:** the measured cause of the twitch is removed. The one-frame jumps of the upper arm at lift-off
  and of the thigh at touch-down are gone (jolt 18-28 -> 1-6), with the same shape, pace, stance width and
  footfall, and less paw slide. Remaining: front touch-down brakes a little harder than V3 (a smooth 3-frame
  turn, not a jump), and the paw bends a little less in mid swing. If the Human still sees a flick at front
  touch-down, the next lever is a later-starting, longer forward reach of the paw in the swing.
- **Bite:** this is closer to what the Human described: crouch, snap forward with all four paws stepping,
  land, step back to the start pose, no shake, clean end. The front drops about a third less, and the reach
  of 27.9 cm is inside the 20-35 cm range. The snap timing and paw order come from the video. The step
  sizes, the reduced drop and the body travel are rule-made, because the bite source is still the side-only
  video. The crouch is still clearly low (that is the video's motion). If it should be flatter, `DROP` is
  one number.

## 7. Housekeeping

- No GPU, no driver or power changes. No new stray folders under `C:/` (the older `C:/inputs` from V3 is
  still there and needs a manual delete).
- Not committed, not pushed. Changed / new in the external repository: `Source/BrandHoundVideo.blend`,
  `Previews/BrandHoundVideo4_*`, `SideBySide/BrandHoundVideo4_*`, `Close/`, `Footfall/BrandHoundVideo4_*`,
  `Scripts/V4/`, `Evidence/UR-CREATURE-VIDEO-V4/`.
