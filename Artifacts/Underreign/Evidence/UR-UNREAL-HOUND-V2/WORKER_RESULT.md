# UR-UNREAL-HOUND-V2: Worker result (Brand-hound: repaired run for travel, short smooth bites, in the game)

Worker: separate Claude Code subagent. Gate: `verify-worker` printed
`PASS worker receipt 373713539bc49447743efb6248a1af59bf4e8986429ee0cc0a8fa65f65b0849c` before any change.
Nothing committed or pushed. No network.

How it ran:
- Blender 5.2 ran in background mode only. All previews were rendered in Cycles on the CPU (24 samples, 2 × 11 threads) at below-normal priority.
- Unreal ran headless (`-nullrhi`: import, tests) or offscreen (`-RenderOffscreen`: captures, gentle start). Every run was capped at 30 fps with a fixed 1/30 s step and ran at below-normal priority. The captures used gentle quality (sg 2), the start check used the gentle-mode settings. There was no benchmark mode, no path tracing, no window and no sound.
- Before every Unreal start, a check made sure no other UnrealEditor process was running. It waited several times while the parallel StyleSample Worker was running.
- Nothing was started through the Windows shell, with one exception. My first low-priority wrapper (`cmd //c start "h2" ...`) caused the "h2 not found" dialog on the Human's screen. I reported this to the Director at once and replaced the wrapper with direct process start plus a priority change.

Paths:
- Only read, never changed: `SimulationCpp`, `Game/Underreign/Source/UnderreignSim`, `StyleSample`, `Design`, the V4 work folder and `C:/GameDev/AnimTools`. The AnimTools venv's Python was used for cv2 and PyAV, and nothing was installed into it.
- Work files are in `C:/GameDev/Underreign_Assets/AnimWork/UR-UNREAL-HOUND-V2/`. Nothing was created directly under `C:/`.

## 1. Run: the old V2 run repaired (task 1)

**Base:** the V2 gait engine (`StyleSample/Creatures/BrandHound/Scripts/v2_anim.py`, read only, functions loaded unchanged). It is a rotary gallop: 13 frames (0.433 s), 5.5 m/s, phases LH 0 / RH 0.12 / RF 0.42 / LF 0.54, duty factor front 0.24 / hind 0.26. The trunk, spine flexion, neck, head, jaw, ears and tail are all unchanged. Gait type, timing and speed are kept. The repair script is `Game/Art/Creatures/BrandHound/Scripts_H2/run2.py`.

**Measured cause of the jolts in the old run:**
- While a paw is "planted", V2 locks the paw pivot under the toe tip. In the last 38 % of stance it then rolls the paw up to 55° (front) or 48° (hind) about that pivot.
- So the toe ball slides 2.7–5.6 cm while planted, and the wrist / hock (the IK target) is thrown forward.
- The front leg also over-stretches before touch-down: extension 1.02 of the leg length, IK error 1.2 cm. The upper arm reverses within one frame (33 → 6 → 28 °/frame) and the forearm does the same (56 → 5 → 43).

**Repair (the V4 rules and contact method):**
- **Footholds** sit on the V3/V4 anatomical lines. The toe-ball width is 36.7 / 38.8 cm (front / hind), the old run had 29.7 / 34.8. Front footholds are 5 cm further back, so the leg no longer over-stretches.
- **Planted paw:** it rolls over the toe ball, which stays locked in the world (slide 0.00 cm). The toes stay flat on the floor.
- **Paw angle:** one continuous curve (the V2 heel roll plus the V2 fold table), smoothed in time with a cyclic Gaussian of 1.2 frames.
- **Swing:** rebuilt on the toe ball between the locked footholds. The horizontal path is smoothstep. The lift is a bump with zero vertical speed at both ends, keeping the V2 apex height.
- **Toes:** opened just enough wherever the V2 toe curl would put the toe tip into the floor (lowest toe tip now 0.5–0.8 cm).
- **Shoulder blade glide** follows the ball path, smoothed.
- **Collar and rings:** the damped V4 pendulum plus calm_rings with a closed loop seam. Collar max 2°, rings max 12°, at most 0.2° per frame. The old run had rings at 60° with 7.5° per frame.
- **Choice of variant:** I tried about 25 variants and picked one by the numbers below and a frame-by-frame look (`Scripts_H2/run2.py`, settings in `build_all.sh`).

**Joint velocity before / after.** The method is that of V4: degrees per frame at 30 fps, after IK. Jolt is the largest change of speed within ±2 frames of the contact. The full table and per-frame curves are in `joint_velocity_table.md`, the data in `data/joint_velocity_h2.json`.

| Leg / joint | old jolt at lift-off / touch-down | **new** | old median / max of cycle | **new** |
|---|---|---|---|---|
| front left upper arm | 14.0 / 39.2 | **17.2 / 22.0** | 8.5 / 39.2 | **10.6 / 22.0** |
| front left forearm | 29.2 / 60.6 | **27.0 / 28.3** | 15.8 / 60.6 | **13.0 / 28.3** |
| front right upper arm | 25.0 / 41.2 | **22.3 / 27.4** | 9.3 / 41.2 | **11.1 / 27.4** |
| front right forearm | 33.5 / 64.9 | **29.9 / 31.4** | 18.9 / 64.9 | **15.1 / 31.4** |
| hind left thigh | 27.9 / 19.3 | **18.5 / 12.1** | 14.1 / 27.9 | **8.5 / 20.4** |
| hind left shin | 33.3 / 28.2 | **23.8 / 24.6** | 13.9 / 33.3 | **13.2 / 24.6** |
| hind right thigh | 26.2 / 18.7 | **12.8 / 11.7** | 8.4 / 26.2 | **5.3 / 14.6** |
| hind right shin | 23.9 / 22.3 | **22.6 / 23.0** | 13.9 / 23.9 | **15.4 / 23.0** |

Other numbers, old → new:

| Measure | Old run | Repaired run |
|---|---|---|
| Paw slide while planted (max) | 5.55 cm | 0.00 cm |
| IK error (max) | 1.24 cm | 0.00 cm |
| Leg extension (max) | 1.02 | 0.93 |

**Honest reading:**
- The single-frame spikes are gone. The cycle maximum of every front joint drops from 39–65 to 22–31, and every jolt now builds and decays over two to three frames.
- In a 13-frame gallop the contacts are the most violent part of the cycle by nature. The largest jolts therefore still sit at the contacts, at about 2–2.5 × the median, not at the 4–5 × of the old run.
- One value rose: the front left upper arm at lift-off went from 14.0 to 17.2. It is a spread turn, not a spike.
- My frame-by-frame look at full rate around the contacts (`look/run_legf_contacts.jpg`, `look/run_legh_contacts.jpg`, old row above new row):
  - The old front leg stretches straight and the paw skids at frames 8–10. The repaired paw lands, stays and rolls over the toes.
  - The old hind paw flips sole-up at lift-off (frames 4–5). The repaired one rolls and lifts.
- I cannot watch video; the feel at playback speed is the Human's verdict.

## 2. Short bite (task 2)

- **Hit interval from the rules data:** Brand-hound `AttackEveryTicks = 10` (`SimulationCpp/Private/Data/PrototypeContent.cpp`) at 10 ticks per second gives 1.0 s. Unchanged.
- **Length:** 30 frames = 1.000 s, as a seamless loop. The script is `Scripts_H2/shortbite.py`.
- **Source poses:** taken from the V4 bite (start pose frame 0, wind-up frame 30, snap frame 45). Every bone moves along smooth time curves with zero speed at the loop point.
- **Motion:**
  - wind-up over frames 0–8;
  - head and neck snap forward and down over frames 8–12 (neck offset ×1.4), with a body push of 9 cm while all paws stay planted;
  - jaw opens to 40° and **shuts at frame 12.8 (0.427 s), the bite**;
  - an eased return to the start pose by frame 28.
- **Reach and legs:** head-tip reach 12.8 cm. Paw slide 0, IK error 0.001 cm.
- **Smoothness:**
  - At the loop point the jolt is ≤ 0.6 on every upper-body bone, so repeats join without a pop (`look/biteshort_loop_and_snap.jpg`).
  - The head decelerates over 3 frames after the snap (15.4 → 5.8 → 2.4 → 0.9 °/frame).
  - The jaw shuts over 2 frames, at 19–20 °/frame.
- **Full V4 bite:** unchanged. The export checks it key for key against the StyleSample file (15,750 keys, same digest).

## 3. Proof outside the game (task 3)

Moving previews are in `Evidence/UR-UNREAL-HOUND-V2/blender/`: MP4 (H.264, 30 fps) and GIF, rendered in Cycles CPU at 800 × 500. The ground checker period is chosen so that a run loop's travel is exactly five periods, so nothing jumps at the loop seam.

| File | Content |
|---|---|
| `BrandHound_Run_old_vs_repaired_side.mp4` / `.gif` | old run next to the repaired run, side view |
| `BrandHound_Run_old_vs_repaired_game.mp4` / `.gif` | the same from the game-camera angle |
| `BrandHound_Run_repaired_side.mp4` / `.gif` | repaired run alone, side view |
| `BrandHound_Run_repaired_game.mp4` / `.gif` | repaired run alone, game-camera angle |
| `BrandHound_Run_legs_old_vs_repaired_30fps.mp4` | 2 × 2 grid: old / repaired, left front leg and left hind leg, 4 strides |
| `BrandHound_Run_legs_old_vs_repaired_10fps.mp4` / `.gif` | the same grid slowed to 10 fps |
| `BrandHound_BiteShort_x3_side.mp4` / `.gif` | three short bites in a row, side view |
| `BrandHound_BiteShort_x3_game.mp4` / `.gif` | three short bites in a row, game-camera angle |

Tables are in `joint_velocity_table.md`. My full-rate frame strips are in `look/`.

## 4. In the game (task 4)

The Brand-hound only. Rules, numbers and maps are unchanged, and `SimulationCpp` and `UnderreignSim` were not touched. All parity checks of the capture pass (19 of 19, ticks 600–11400).

**Import** (`Game/Scripts/setup_hound.py` / `.sh`, repeatable) adds two animations:
- `A_BrandHound_Run`: 0.433 s loop, root travel 238.33 cm per loop.
- `A_BrandHound_BiteShort`: 1.000 s loop.
- Both come from `Game/Art/Creatures/BrandHound/A_BrandHound_{Run,BiteShort}_H2.fbx`, written by `export_h2_anims.py`.

**`URHoundAnim.h`:** the animation instance now has five layers: idle, walk, full bite, run, short bite.

**`URPlayView` (DrawHound):**
- **Travel:** the run's loop phase advances by the distance moved ÷ the run's stride at the hound's scale (238.33 cm × 0.55 = 131 cm), so the paws cannot slide.
- **Gait by speed:** the smoothed ground speed rises at once and falls over 0.15 s. Below 82 cm per game second the hound walks, above 143 cm it runs, with a smooth blend between (150 / 260 cm/s at scale 1). From standing it goes straight into the gait its speed calls for; while moving the gaits cross-fade over 0.25 s.
- **First attack of an engagement:** plays the full V4 bite, as before.
- **Short bites:** they follow on the hound's hit clock. The game layer cannot see the rules' attack timer, so:
  - the clock is set by the hound's first seen hit (the target's HP drops by at least 5);
  - after that it runs every 10 ticks, on the drawn time;
  - the short bite's bite (clip time 0.427 s) falls on each hit;
  - the clip follows the clock by playing at most 60 % faster or slower, never by a jump.
- **Resumed fights:** a fight resumed within 2.5 s (a step to the next cell, the next intruder) goes on with short bites and keeps the clock.
- **End of the fight:** short bites blend out over 0.25 s (0.15 s when the hound moves) to idle or run.
- **Hit interval in code:** `HoundAttackEveryTicks = 10` is a constant in `URPlayView.cpp`, citing the rules data, because `FURSimTypeInfo` has no attack interval.
- **Scale:** stays 0.55, and `-URHoundScale=` still works.

**`URCaptureDirector` (hound mode):**
- new options `-URHoundFightDist=`, `-URHoundFightOnly` and `-URHoundFightDir=`;
- new log lines `UR_HOUND GAIT`, `UR_HOUND short bites`, `UR_HOUND hit clock` and `UR_HOUND bite frame`.

**Play rates** (repaired run; authored 550 cm/s at scale 1 = 302.5 cm/s at 0.55; the rules move the hound at 250 cm/s):

| Game speed | Run play rate per game second | per real second (measured mean) |
|---|---|---|
| 1x | **0.83** | 0.83 (close-up phase mean 0.94 incl. a few walk frames; wave phase mean 1.01, see below) |
| 2x | **0.82** | 1.63 (max 1.65) |
| 4x | **0.79** | 3.16 (max 3.31) |

- At game speed the run plays at 0.83 of its authored speed, inside the asked 0.8–1.25. V1's walk played at 6.6 / 13 / 25×.
- Real-time rates at 2x / 4x are the fast-forward itself.
- Gait frames in the 1x wave: run 1,285, walk 9, blending 98.
- The 1x maximum of 13.1 is one walk-weighted blend frame, with the double distance of a two-tick frame as in V1.

## 5. Proof in the game (task 5)

- **Build:** `Game/Scripts/build.sh` exit 0, no warnings (`logs/build.txt`).
- **Automation tests** (`test_sim.sh`, unchanged): 7 of 7 Success (CommandPath, GoldenReplays, LinkPrecheck, LinkReach, PlayerOrders 103 checks, SyncManifestGuard, TypeInfo), exit code 0 (`logs/automation_tests.txt`).
- **Gentle-mode start** (the gentle .bat's exact arguments plus `-RenderOffscreen -URCapture=startcheck -URIntro`; the executable was called directly because the .bat uses `start`): RESULT PASS (0 failed), 30.0 fps, GPU 1.70 ms. The run and short bite load (`logs/gentle_start_check.txt`).
- **Hound capture** (golden reasonable seed 1, `Lib/Data`, warp 10700, 1280 × 720, `-URMaxFPS=30`, fixed step):
  - `UR_HOUND RESULT PASS (0 failed)`;
  - bites started 2, short-bite runs 2;
  - **hit check: 7 of 7 predicted hit ticks showed the target's HP drop (100 %)**;
  - a longer 2,400-frame fight run: 10 of 11 (91 %); the miss was a hit tick on which the target had changed (`logs/capture_hound_hitcheck_2400frames.log`);
  - running close-up 240 frames PASS;
  - pause: 0.0000 cm movement, PASS;
  - GPU 3.0–3.7 ms;
  - logs `logs/capture_hound_full.log` and `logs/capture_hound_biteclose.log`.

**Videos in the game** (`Game/Captures/hound_v2/`, 30 fps):

| File | Content |
|---|---|
| `UR_Hound2_Game_1x.mp4` | 29 s, game camera following hounds through wave 3: running, full bite, then short bites on the hits |
| `UR_Hound2_Game_1x_Bites.gif` | 6 s excerpt with the short bites |
| `UR_Hound2_Bites_Closeup_1x.mp4` / `.gif` | closer camera on the biting hound |
| `UR_Hound2_Run_Closeup_1x.mp4` / `.gif` | close-up of a running hound, camera locked on the hound, the floor moves under it |
| `UR_Hound2_Run_Closeup_1x_slow10fps.mp4` | the same close-up slowed (paw contacts) |
| `UR_Hound2_Game_4x.mp4` | 5 s at 4x |
| `UR_Hound2_Scale.png`, `UR_Hound2_Scale_Game_Zoom.png` | scale line-up |

**My own look:**
- `look/ingame_runclose_40_57.jpg` shows 18 consecutive close-up frames. They show a clean gallop: legs gathered and extended in order, no visible paw slide.
- `look/ingame_shortbites_846_875.jpg` shows 30 consecutive bite close-up frames. The clip time at each hit tick is 0.427 s, the bite, per the log.
- In that fight the rules put the blue intruder shape on the hound's cell, so it covers much of the hound and the bite reads only partly (open problem 1).

## 6. Open problems (reported, not solved by changing the goal)

1. **Readability of bites in the game:** the rules place the intruder on or next to the hound's cell, and its blue placeholder shape covers the hound. At the game's zoom the 1.2 m dark hound is small. This is unchanged from V1.
2. **Hit sync relies on seen HP drops.** The game layer has no access to the hound's attack timer, and the interval is a copied constant (`HoundAttackEveryTicks`). Exposing the timer would need a change in the protected UnderreignSim / rules code, which was not done. Until a hound's first hit is seen, its first short bites run on a clock started at the fight start.
3. **Fights in this replay are short and broken by steps.** The full V4 bite (3.47 s) was cut twice by a step before it ended. With the 2.5 s engagement rule the hound then goes on with short bites.
4. **The gallop's contact jolts are about 2–2.5 × the cycle median.** This is the nature of a 13-frame gallop with three planted frames. Front left upper arm at lift-off: 14.0 → 17.2. Whether it reads as fluid at speed is the Human's verdict.
5. **Short-bite head reach is 12.8 cm** (the V4 bite's snap pose lowers the head). If it should look more dangerous, `NECK_GAIN`, `PUSH` and the snap curve in `shortbite.py` are the levers.
6. **Scale slider per creature:** not part of this order (Human: later).

## 7. Changed and added files (external repository `C:/GameDev/Underreign`)

**Modified:**
- `Game/README.md`, `Game/SPIELANLEITUNG.md`
- `Game/Scripts/setup_hound.py`, `Game/Scripts/setup_hound.sh`
- `Game/Underreign/Source/Underreign/Private/URPlayView.cpp`, `.../Private/URCaptureDirector.cpp`
- `.../Public/URPlayView.h`, `.../Public/URHoundAnim.h`
- `Game/Underreign/Content/Creatures/BrandHound/{SK_BrandHound, SK_BrandHound_Skeleton, M_BrandHound, A_BrandHound_Walk, A_BrandHound_Bite, A_BrandHound_Idle}.uasset` and `Textures/T_BrandHound_{BaseColor, Normal, ORM, Emissive}.uasset`. These were re-imported by the repeatable import; their content is unchanged.

**Added:**
- `Game/Art/Creatures/BrandHound/{export_h2_anims.py, export_h2_anims.json, A_BrandHound_Run_H2.fbx, A_BrandHound_BiteShort_H2.fbx}`
- `Game/Art/Creatures/BrandHound/Scripts_H2/{common_h2.py, run2.py, shortbite.py, measure2.py, preview_h2.py, compose_h2.py, compose_game.py, table_h2.py, build_all.sh, render_all.sh, lowrun.sh}`
- `Game/Underreign/Content/Creatures/BrandHound/{A_BrandHound_Run, A_BrandHound_BiteShort}.uasset`
- `Game/Captures/hound_v2/` (5 MP4, 3 GIF, 2 PNG)
- `Evidence/UR-UNREAL-HOUND-V2/` (this file, `joint_velocity_table.md`, `blender/` with 8 MP4 and 7 GIF, `data/`, `look/`, `logs/`)

The untracked `StyleSample/Characters`, `StyleSample/Scripts/animtest` and `StyleSample/UnderreignStyle/Content/{Characters,Maps/AnimTest}` folders are the parallel StyleSample Worker's, not mine.

**Housekeeping:**
- My temporary frame folders were deleted: about 1.9 GB of Blender renders and in-game captures in the AnimWork folder.
- Kept in the AnimWork folder: the work blends `out/BrandHound_H2.blend` and `out/sweep/`, the scripts, logs and look strips.
