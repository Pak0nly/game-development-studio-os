# UR-UNREAL-HOUND-V1: Worker result (the Brand-hound in the game: accepted walk, development bite)

Worker: separate Claude Code subagent. Gate: `verify-worker` printed
`PASS worker receipt b506770504efa65149caffdab86232695f288044d950f1ec16f7d9ec1f699f28`
before any change (run from the Studio root). Nothing committed or pushed. No network. Blender 5.2 in background mode only (no render).
Every Unreal run was headless (`-nullrhi`) or offscreen (`-RenderOffscreen`), frame-capped at 30 fps, at below-normal process
priority (started through `cmd start /belownormal`, children inherit it), gentle quality settings (sg level 2 or the gentle bat's
level 1), no benchmark mode, no path tracing, no window in front of the Human, no sound. `SimulationCpp`,
`Game/Underreign/Source/UnderreignSim`, `StyleSample`, the V4 work folder and `C:/GameDev/AnimTools` were only read. Work files:
`C:/GameDev/Underreign_Assets/AnimWork/UR-UNREAL-HOUND-V1/`. Nothing created directly under `C:/`.

## 1. Export (task 1)

`Game/Art/Creatures/BrandHound/export_v4_anims.py` (Blender 5.2, `-b --factory-startup`) exports `A_BrandHoundVideo4_Walk` (frames
0-30, loop) and `A_BrandHoundVideo4_Bite` (frames 0-104) of the V4 work file as skeleton-only FBX at 30 fps with the V2 export settings
(every frame baked, no simplification): `A_BrandHound_Walk_V4.fbx`, `A_BrandHound_Bite_V4.fbx`. Before exporting it checks:
- both actions are key for key identical to `StyleSample/Creatures/BrandHoundVideo/Source/BrandHoundVideo.blend` (4,650 and 15,750 keys,
  SHA-256 of all keys in `export_v4_anims.json`);
- the armature rest pose equals the V2 file `StyleSample/Creatures/BrandHound/Source/BrandHound.blend` (same skeleton as `SK_BrandHound.fbx`).
The motion is unchanged.

## 2. Import (task 2)

`Game/Scripts/setup_hound.py` + `setup_hound.sh` (headless commandlet, repeatable: deletes and re-imports `/Game/Creatures/BrandHound`):
`SK_BrandHound` (V2 mesh, 52,095 triangles, no Nanite, no physics asset), `SK_BrandHound_Skeleton`, textures (BaseColor sRGB, Normal
DirectX not flipped, ORM masks, Emissive linear grayscale), `M_BrandHound` (import note recipe: BaseColor x lerp(1, AO, 0.7), roughness
ORM.G, metallic ORM.B, emissive mask x (1.0, 0.22, 0.03) x `EmissiveStrength` = **4**, the middle of the note's 3-6), animations
`A_BrandHound_Walk` (V4, 1.000 s, 30 frames), `A_BrandHound_Bite` (V4, 3.467 s), `A_BrandHound_Idle` (V2, 4.000 s), all with Force
Root Lock (the game moves the hound).

Two findings during the import (fixed, documented in the script and the README):
- **Scale:** the Blender FBX files (`FBX_SCALE_ALL`) arrive in Unreal at 1/100 (the import note's "Import Uniform Scale 1.0" gave a hound
  2.14 cm long). The import uses uniform scale 100: bounds 2.14 x 0.80 x 1.25 m, walk root travel 69.32 cm per loop (= Blender 0.6932 m).
- **Material:** the emissive sampler had to be "Linear Grayscale"; with "Grayscale" the material failed to compile in the game and the
  default material showed (seen in my first look, fixed before the final captures).

## 3. In the game (task 3)

Code (`Game/Underreign/Source/Underreign`, C++ only, no Blueprint):
- `URHoundAnim.h/.cpp` (new): `UURHoundAnimInstance` with a proxy that samples up to three sequences (idle, walk, bite) at times and
  weights set by the play view and blends them (local space) on the animation thread.
- `URPlayView`: Brand-hound (creature type 0) only: one skeletal mesh per drawn hound (pooled by agent id, hidden when not drawn,
  removed when gone). All other creatures, cinderlings and intruders unchanged (greybox).
  - stands on the floor (root at floor height, the same position as the old box incl. the per-agent spread);
  - faces its movement direction; turn smoothed in game time (exponential, about 0.2 s); faces the bitten intruder while biting;
  - **walk:** while the rules move the hound, the walk loop phase advances by the on-screen distance moved divided by the walk's own
    stride at the hound's scale (69.32 cm x 0.55 = 38.1 cm per loop). The paws therefore cannot slide at any game speed; paused =
    no movement = no phase change; blend walk <-> idle 0.2 s;
  - **bite:** when the rules report the hound attacking (activity `Fighting`: goal Fight and standing) with an intruder in reach
    (same layer, within 1.5 cells), one V4 bite starts, facing that intruder, 0.12 s blend in, 0.25 s blend out to idle/walk;
    cut with a 0.15 s blend if the rules send the hound walking;
  - **standing:** V2 idle (each hound starts at its own idle time so they are not in step);
  - tooltips, hover pick, rally ball and alarm cone use the same agent position as before (marks now float over the hound's height);
  - `-URHoundScale=<0.2..1.5>` tries another size; `-URHoundStandIns` (proof only) puts a hound mesh on every cinderling's path.
- `URLayerCameraPawn::SetViewFacing` (new, used by the proof run only): pivot plus camera facing in one call.
- `URCaptureDirector`: capture mode `hound` (follows a hound through wave 3 at 1x, walking close-up, 2x and 4x, pause check, scale
  line-up, frame times; `UR_HOUND` log lines).

### Play rates (on-screen ground speed / authored walk speed at scale 0.55, 38.1 cm/s)

| Game speed | Ground speed (mean) | Walk play rate mean | max |
|---|---|---|---|
| 1x | 250 cm/s (2.5 cells/s = rules speed 25) | **6.56** | 13.1 (a frame with two ticks) |
| 2x | 494 cm/s | **12.95** | 13.1-26.2 |
| 4x | 957 cm/s | **25.1** | 26.2 |

**This is far outside 0.7-1.4.** As ordered, the walk is kept (no trot, no run). The rules move the hound at 2.5 m/s; the V4 walk
covers 0.69 m/s at full size, 0.38 m/s at the starting scale. At scale 1.0 the rate would still be 3.6 at 1x. The paws do not slide
(phase follows distance), but the legs cycle about 6.5 times per second at 1x: it reads as a fast scurry, not as the calm walk the
Human accepted. This is a decision for the Human (rules speed, hound scale, or a faster gait), not something I changed.

### Bite timing (honest)

The rules hit every 1.0 s (Brand-hound `AttackEveryTicks` 10); the V4 bite lasts 3.47 s and its snap is about 1.3-1.5 s in. One bite
covers about three rule hits; the visible snap is not synchronised with the moment of damage.

### Starting scale

**0.55** (1.18 m nose to tail tip, 0.69 m to the ear tips, about 0.55 m at the withers): a little longer than one 1 m cell, about as high
as a cinderling (0.68 m), lower than the Oath-warden placeholder (1.10 m). Still: `Game/Captures/hound/UR_Hound_Scale_Lineup.png`
(close) and `UR_Hound_Scale_GameZoom.png` (game zoom). Size is the Human's look decision; nothing beyond this starting value.

## 4. Rules unchanged (task 4)

No file in `SimulationCpp` or `Game/Underreign/Source/UnderreignSim` touched; no rule, number or map change. The capture's parity
checks against the golden replay all PASS (game layer hash = save hash at 9000-11400).

## 5. Proof (task 5)

- **Build:** `Game/Scripts/build.sh` exit 0, no warnings.
- **Automation tests** (`test_sim.sh`, unchanged): 7 of 7 Success (CommandPath, GoldenReplays, LinkPrecheck, LinkReach, PlayerOrders
  103 checks, SyncManifestGuard, TypeInfo), exit code 0 (`logs/automation_tests.txt`).
- **Gentle-mode start** (`Play Underreign (Schonmodus).bat -RenderOffscreen -URCapture=startcheck -URIntro`): RESULT PASS (0 failed),
  30.0 fps, GPU 1.64 ms, the hound model loads (`logs/gentle_start_check.txt`).
- **Hound capture** (`capture.sh hound`, golden reasonable seed 1, warped to tick 10700, 1280 x 720, 30 fps fixed step, capped):
  `UR_HOUND RESULT PASS (0 failed)`: 4 bites started in wave 3 at 1x; walking close-up 240 frames; pause check: head and paw moved
  0.0000 cm in 30 paused frames; scale line-up.
- **Frame time, many hounds** (`-URHoundNoFrames -URHoundStandIns`: 3 real hounds + a hound mesh on each of the 8 cinderlings; up to
  **11 hound meshes on screen**; offscreen, 30 fps cap, sg level 2, hardware ray tracing as project setting):
  1x: GPU 3.58 ms, game thread 2.17 ms, render thread 5.45 ms (means over 570 frames); 2x: 3.31 / 2.24 / 4.64 ms (10 meshes); 4x:
  3.27 / 2.40 / 4.34 ms (10 meshes). Smooth at 30 fps with a wide margin (`logs/hound_standins_frame_times.txt`; that run's "bites 0"
  FAIL only means its shortened 600-frame fight phase ended before wave 3 reached the hounds). Normal run, 2-3 hounds: GPU 3.0-3.3 ms.
  The game-thread figures of the frame-saving runs (about 67 ms) include the PNG writing and are not frame times.

### Videos and stills (`Game/Captures/hound/`)

| File | Content |
|---|---|
| `UR_Hound_Game_1x.mp4` | 30 s at 1x, game camera following hounds through wave 3: walking, standing, biting intruders (the camera turns so corridor walls do not hide the hound) |
| `UR_Hound_Game_1x_Bite.gif` | 5.3 s excerpt of it: a hound biting an intruder in a corridor, 30 fps |
| `UR_Hound_Walk_Closeup_1x.mp4` / `.gif` | 8 s (GIF 5 s) close-up of walking hounds in rooms, camera locked on the hound (the floor moves under it); frames only while the hound walks in an open room, so there are jump cuts |
| `UR_Hound_Game_4x.mp4` | 5 s at 4x |
| `UR_Hound_Scale_Lineup.png`, `UR_Hound_Scale_GameZoom.png` | cinderling, Brand-hound (0.55), Oath-warden placeholder side by side |

### My own look

I cannot play video; I looked at full-rate frame strips (every frame) and sheets (`close_60_71.png`: 12 consecutive close-up frames;
`bite_760_900.png`: every 8th frame of a bite). What I saw:
- the hound stands on the floor, faces its way and the intruder, the ember seams glow, idle/walk/bite switch without pops;
- walk: from frame to frame the planted paws move with the floor (no visible slide), but the floor moves about 8 cm per frame and the
  legs change a large part of the cycle per frame: at 30 fps the gait looks hurried (see play rates);
- bite: the hound is small and dark in a dark corridor at the game's zoom, and the rules put the intruder right next to or on the same
  cell (distance 0.0-1.0 cells), so the blue intruder shape covers much of the bite. The bite reads only in the close excerpt.
Overall feel at playback speed is the Human's verdict.

## 6. Open problems (reported, not solved by changing the goal)

1. **Walk play rate 6.6x / 13x / 25x** at 1x / 2x / 4x (task allows 0.7-1.4): rules speed 2.5 m/s vs walk 0.69 m/s. Needs a Human
   decision (slower hound in the rules, bigger hound, or a faster accepted gait).
2. **Bite vs hits:** one 3.47 s bite per ~3 rule hits; snap not synced to damage.
3. **Readability:** at the default zoom (32 m) the 1.2 m dark hound is small; intruders overlap it in melee (positions come from the rules).
4. **Corridor walls:** at the layer view's pitch an east-west corridor one cell wide hides anything in it unless the camera is turned (the
   game's existing behaviour; the proof camera turns, the player must press Q/E).
5. The import note's scale statement ("Import Uniform Scale 1.0") is wrong for these FBX files (StyleSample is read-only; noted here and
   in the README / script).
6. Emissive strength 4 is a start value; size 0.55 is a start value.

## 7. Changed and added files (external repository `C:/GameDev/Underreign`)

Modified: `Game/README.md`, `Game/SPIELANLEITUNG.md`, `Game/Scripts/capture.sh`,
`Game/Underreign/Source/Underreign/Private/URCaptureDirector.cpp`, `.../Private/URLayerCameraPawn.cpp`, `.../Private/URPlayView.cpp`,
`.../Public/URCaptureDirector.h`, `.../Public/URLayerCameraPawn.h`, `.../Public/URPlayView.h`.
Added: `Game/Art/Creatures/BrandHound/{export_v4_anims.py, export_v4_anims.json, A_BrandHound_Walk_V4.fbx, A_BrandHound_Bite_V4.fbx}`,
`Game/Scripts/{setup_hound.py, setup_hound.sh}`, `Game/Underreign/Source/Underreign/Private/URHoundAnim.cpp`,
`Game/Underreign/Source/Underreign/Public/URHoundAnim.h`,
`Game/Underreign/Content/Creatures/BrandHound/{SK_BrandHound, SK_BrandHound_Skeleton, M_BrandHound, A_BrandHound_Walk, A_BrandHound_Bite, A_BrandHound_Idle}.uasset`,
`Game/Underreign/Content/Creatures/BrandHound/Textures/T_BrandHound_{BaseColor, Normal, ORM, Emissive}.uasset`,
`Game/Captures/hound/` (3 MP4, 2 GIF, 2 PNG), `Evidence/UR-UNREAL-HOUND-V1/` (this file, `close_60_71.png`, `bite_760_900.png`, `logs/`).
