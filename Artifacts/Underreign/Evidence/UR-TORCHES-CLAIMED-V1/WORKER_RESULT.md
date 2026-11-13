<!-- Studio copy of the external Worker result C:/GameDev/Underreign/Evidence/UR-TORCHES-CLAIMED-V1/WORKER_RESULT.md -->

verify-worker (run from the Studio root before any change): `PASS worker receipt cb983d3a0ef7fba3eea28697ca9f1ebae032c112b82b96e5b04f90492797e241`

# Worker result UR-TORCHES-CLAIMED-V1 - wall torches along claimed ground (presentation only)

Project Underreign (DEC-043), Worker of the Claude-directed order, Production mode, Standard class. Not committed, not pushed.
Gate: `verify-worker` printed `PASS worker receipt cb983d3a0ef7fba3eea28697ca9f1ebae032c112b82b96e5b04f90492797e241` before any change.
Unreal 5.8 (headless or offscreen, 30 fps cap, gentle quality 2 + VSync, below-normal priority, started directly without the
Windows shell, one engine at a time), Blender 5.2 (background, below-normal priority, two short runs). External repository
`C:/GameDev/Underreign` (main, base b5e1886); paths below relative to it.

## What was built

- **Placement rule** (`AURGreyboxMap::AddTorchLayer`, presentation layer; reads the claimed flag the greybox already mirrors
  from the rules, writes nothing back). Candidates: every wall face (in-bounds rock cell beside an open cell) whose open cell is
  claimed - natural, freshly dug and built caves alike. First choice every `TorchSpacing` cells along the wall (default 3,
  `-URTorchSpacing=N`, 1..8; 2 and 4 checked), the opposite wall shifted by half a spacing (`IsTorchSlot`), so two torches never
  face each other across a corridor; a slot closer than half a spacing to a placed torch is skipped (inner corners). Cover pass:
  a claimed wall cell with no torch within 3/4 of a spacing gets one (short walls, dead ends). No torch beside stairs, shafts,
  doors (planned or built), the entrance, the Heart or the Call-stone. A layer's torches are placed again whenever that layer is
  rebuilt (claim gained or lost, wall dug away, option changes).
- **Torch** (own Blender mesh, `ArtSource/Torch/scripts/build_torch.py`, 866 triangles): square iron arm running 40 cm back
  into the rock (so it always enters the rock relief, which lies 0.05..0.33 m behind the cell edge - the torch never floats,
  and the head stays at least 8 cm in front of the edge, so never inside rock), ring and brace holding a wooden handle tilted
  15 degrees, iron basket with straps and rim, glowing coal. Flame base 2.2 m above the floor (with the low-walls option
  1.25 m, below the 1.5 m wall top).
- **Flame**: camera-facing card from the material (`M_UR_TorchFlame`, additive, procedural noise in the shader, own phase and
  size per instance via PerInstanceRandom; up axis halfway between world up and the view's up so it reads from the steep
  camera). Coal and flame flicker in the material; no texture, no Niagara (no style-sample asset reused).
- **Light budget**: warm point lights (10 cd, reach 8 m, flicker 75-105 %) only for the 16 torches nearest the view centre on
  the focused layer, of these only the nearest 4 with shadows; all other torches flame and coal only. Re-ranked only when the
  view centre moves more than 40 cm or the torches change. `-URTorchLights=`, `-URTorchShadows=`, `-URTorchCd=`,
  `-URTorchRadius=`, `-URTorches=0`.
- **Proof run**: `wallsample` now logs `UR_TORCH` lines, checks the slot rule and that Layer 2 has torches (UR_WALL_TEST),
  and ends (game paused) with stills of a place where claimed meets unclaimed ground at spacing 2, 3, 4
  (auto place, or `-URWallBX= -URWallBY= -URWallBL=`), plus the layer grids in the log.

## Numbers

- Torches (golden replay reasonable_seed1_won, tick 10700): 75 at spacing 3 (43 on Layer 2); spacing 2: 128 (70); spacing 4: 57 (31).
- **Placement cost**: mean 0.058-0.068 ms, max 0.09-0.27 ms per layer placement on the game thread (59 placements in the
  after run); full rebuilds of all layers stay at 3.8-6.1 ms as before (before: 3.6-5.9 ms).
- **GPU** (UR_WALL PERF, 150 frames, game running, Layer 2 default view, 1920x1080, quality 2, 30 fps cap). Note: the other
  Worker's Blender ran at the same time, so the numbers scatter by +-1.5 ms between identical runs:
  - first clean pair: before 4.97 ms (torches off), after 6.47 ms (16 lights, 4 shadowed) -> +1.5 ms;
  - back-to-back series (film off): off 7.10 / 6.26 ms; 4 shadows 10.00 / 6.57 ms; 2 shadows 6.16 ms; 0 shadows 5.54 ms;
  - 6 s turn: before 5.37-6.63 ms, after 6.90-7.18 ms (one run 9.71 under the parallel load).
  - Reading: the torches cost roughly 0.3-1.5 ms, most of it the 4 shadowed lights; 0-2 shadowed lights stay within about
    0.5 ms of before. Game thread and render thread unchanged (2.2-2.8 / 6.1-6.9 ms).
- Reference UR-UNREAL-WALLSAMPLE-V1 kit: 4.93 ms.

## Tests

- `setup_torch.sh`: `UR_TORCH RESULT PASS` (bounds y -40.0..35.2 cm, z -31.0..35.8 cm, 3 slots).
- `build.sh`: exit 0.
- `test_sim.sh Underreign`: 8 of 8 Success (WallRules, CommandPath, GoldenReplays, LinkPrecheck, LinkReach, PlayerOrders 103
  checks, SyncManifestGuard, TypeInfo). Golden hashes unchanged: reasonable_seed1_won 1e90d79f1f144be0, reasonable_seed12_lost
  c93dd97e0daee4d5, banner_seed4_won 89acda19d5372052, idle_seed1_lost cd052f1d3209fb89, doors_seed1_won 1d60929da14c21e4,
  newintruders_seed1_won 9a34e0e7c76a16ee, crownkiln_seed1_lost eafd44ab1599bde1, ashthread_seed1_won f6b2c1561b91778b,
  inkdrip_seed3_won 98ec80e889ebfd11.
- `capture.sh wallsample` (after and before): `UR_WALL RESULT PASS (0 failed)`, parity PASS at tick 10800 (needs `-URTuning=`
  golden.tuning.txt; without it the warp diverges from the save - a first run without it was discarded).

## Captures (all looked at; the game images show the licensed scanned rock: local only)

`Game/Captures/torches/`:
- `before/` (torches off) and `after/` (spacing 3): `kit_l2_full.png`, `kit_l2_low.png`, `kit_l2_overview.png`,
  `kit_close_corridor.png`, `kit_close_long_wall_{full,low}.png`, `kit_close_outer_corner_{full,low}.png`,
  `kit_l2_full_after.png`, `UR_Torches_Turn360_6s_{before,after}.{mp4,gif}` (1920x1080, 6 s, no sound),
  `UR_Torches_Turn360_frames_0_30_60_90_120_150_{before,after}.jpg`; `after/kit_boundary_s{2,3,4}.png` and
  `before/kit_boundary_off.png` (Layer 2, the only unclaimed cell left at tick 10847).
- `early_t2400/kit_boundary_s{2,3,4}.png`, `early_t2400_off/kit_boundary_off.png`: the Layer 1 tunnel at tick 2400, natural
  unclaimed tunnel to the north, claimed tunnel to the south and east - the real claimed/unclaimed view.
- This folder: `images/boundary_L1_t2400_off_s2_s3_s4.png` (2x2 sheet), `images/game_torch_closeup_*.png`,
  `images/game_flame_frames_0_7.png`, `images/blender_torch_workbench_*.png`; `logs/`.

## What I saw

- **Brightness / readability**: the claimed corridors and rooms get warm pools of light on the walls every few metres; in the
  close corridor the walls go from nearly black to clearly lit rock. In the overview the torches read as a chain of small
  flames that traces exactly the claimed ground; at the Layer 1 boundary the torches stop where the natural (grey) tunnel
  begins - spacing 2 shows four torches in view, 3 two, 4 one. Spacing 3 reads as "taken ground" without crowding; 2 is
  denser and brighter but busy in narrow corridors; 4 leaves stretches dark.
- **Flicker**: flame shape changes gently from frame to frame (no strobing); light flicker is subtle.
- **Crowding**: none seen at spacing 3 or 4; no two torches face each other; inner corners carry one torch, not two.
- **Floating / inside rock**: none seen; the arm and brace visibly enter the rock, the basket stands clear of it.
- **Heart room**: excluded only on the Heart cell itself (no crowding seen in the stills; the Heart layer was not framed close).
- First version: the point light sat 10 cm above the basket and burnt the rim white; moved 40 cm above the flame base, and the
  coal glow halved. Coal still reads as a bright disk under the flame at close range (looks like embers, acceptable).

## Changed files

External (uncommitted): `Game/Underreign/Source/Underreign/Public/URGreyboxMap.h`, `Private/URGreyboxMap.cpp` (torch placement,
light pool, flicker, command line), `Public/URCaptureDirector.h`, `Private/URCaptureDirector.cpp` (UR_TORCH lines, slot check,
boundary stills, grids), `Game/Scripts/setup_torch.py`, `Game/Scripts/setup_torch.sh` (new), `Game/README.md` (intro line,
section "Wall torches"), `ArtSource/Torch/` (new: `scripts/build_torch.py`, `fbx/SM_UR_Torch.fbx`, `fbx/SM_UR_TorchFlameCard.fbx`,
`blend/torch.blend`), `Game/Underreign/Content/Environment/Torch/` (new: SM_UR_Torch, SM_UR_TorchFlameCard, M_UR_TorchSurface,
M_UR_TorchFlame, MI_UR_TorchIron/Wood/Coal), `Game/Captures/torches/` (new), `Evidence/UR-TORCHES-CLAIMED-V1/` (new).
`Game/Underreign/Content/Greybox/M_UR_Greybox.uasset`: still modified from before this order (last write 17:03, before this
Worker started); not re-saved, not reverted, not touched. `ArtSource/GroundTextureTest/` (the other Worker's) untouched.
Work files: `C:/GameDev/Underreign_Assets/AnimWork/UR-TORCHES-CLAIMED-V1` (run scripts, logs, previews; frame folders deleted).

## Open points

1. **GPU cost** with 4 shadowed lights is about +1.5 ms in the one clean pair (6.47 vs 4.97 ms), measured while another Worker's
   Blender ran; 2 shadowed lights looked about free. Decide 4 or 2 (`TorchShadowBudget`), ideally after a quiet re-measurement.
2. **Intermittent render glitch** (not from the torches): the very first before-run (torches off) showed every still with a flat
   rock plane over the view (the layer above drawn); an identical rerun was correct. Same family as the previous Worker's
   "first run" effect; worth watching.
3. The automatic boundary pick prefers places the steep camera can see; late in the golden replay nearly all ground is claimed,
   so the meaningful boundary view needs an early tick (the evidence used tick 2400, Layer 1, given explicitly).
4. Low-walls option: torches sit at 1.25 m with the flame reaching above the 1.5 m wall top; looks fine from above.
5. The Heart room is not framed close in any capture; if it looks crowded in play, widen the exclusion around the Heart.
6. The coal disk under the flame is bright at close range.
