# Worker result UR-RVT-BLEND-TEST-V1 (Studio copy)

verify-worker: `PASS worker receipt 5be484a0d283a0fe6056d6cddd787daacb8d681e672cd7924c714fccd5227efd` (run before any mutation).

External repository: `C:/GameDev/Underreign` (uncommitted). Full result: `Evidence/UR-RVT-BLEND-TEST-V1/WORKER_RESULT.md` there; copied below.


Project Underreign (DEC-043), Worker of the Claude-directed order, Production mode, Standard class. Not committed, not pushed.
Gate: `verify-worker` printed `PASS worker receipt 5be484a0d283a0fe6056d6cddd787daacb8d681e672cd7924c714fccd5227efd` before any change.
Unreal 5.8 (offscreen `-RenderOffscreen`, 30 fps cap, gentle quality 2 + VSync, below-normal priority incl. shader workers,
started directly without the Windows shell, one engine at a time, each run about 1 minute); Blender 5.2 background only.
The other Worker's Blender render ran during all GPU measurements. Paths relative to `C:/GameDev/Underreign`.

## What was built (presentation only, off by default)

- **Project setting**: `Game/Underreign/Config/DefaultEngine.ini` `r.VirtualTextures=True` (the only change that is always on).
- **`-URRVTBlend=1`** (`AURGreyboxMap::SetupBlend / AddBlendWritersLayer / UpdateBlendView / BlendTwin`):
  - two RVTs `RVT_UR_FloorColor` (base colour, normal, roughness) and `RVT_UR_FloorHeight` (world height), 32 x 32 tiles of
    256 texels = 8192 texels over the 80 m map (about 1 cm per texel); two RVT volume components spanning the map, 2 m below to
    2 m above the focused floor, moved on a layer change and invalidated on every rebuild / view change.
  - **Deviation from the video, by necessity**: our floors are per-cell greybox boxes, translucent on the focused layer (the faint
    layer below shows through), and they end at the cell edge while the kit wall's rock relief lies 5..33 cm behind it. Letting
    the floor itself write would leave the RVT empty under the wall foot. So the visible floors stay unchanged and invisible
    1 cm "writer" plates (`M_UR_RVTFloorWriter`, Runtime Virtual Texture Output: colour, roughness, normal up, world Z; "Draw in
    Main Pass" Never) cover every floor cell plus every rock cell next to floor (colour of the first open neighbour). Writer
    colour = the colour the translucent floor shows (floor colour x 0.7 over the faint fog x 0.3) x `-URBlendTint=` (default 0.35,
    chosen by eye from 0.8 / 0.5 / 0.3: 0.8 and 0.5 gave a red band brighter than the floor).
  - `M_UR_KitRockBlend` = copy of `M_UR_KitRock` (same rock code, made by `setup_blend.py` via duplicate + rewire, so
    `setup_kit.py` and the Kit folder are untouched) + RVT samples: alpha = saturate((Z - floor height - Crevice x Foot x (1-AO)) /
    Foot); side remover by vertex/pixel normal Z keeps `SideKeep` (0.6) of the blend on steep faces; `BlendOn` scalar. At run time
    one dynamic instance per kit material instance (parameters copied); walls `-URBlendFootCm=40`, rubble `-URRubbleFootCm=12`
    (no side remover on rubble). Torches and faint copies are not touched.
- **`-URRubble=1`** (`AURGreyboxMap::AddRubbleLayer`): five own Blender pieces (`ArtSource/Rubble/scripts/build_rubble.py`:
  StoneA 320 tris, StoneB 480, StoneC 122, Scree heap 2358, broken Slab 660; seated 3..9 cm below the floor), kit rock look
  (`MI_UR_RubbleRock`), Nanite. Seeded per wall side: 3 in 10 a stone/clump, 8 in 100 a slab; scree heaps in inner corners
  (15 in 100, always the two lowest hashes per layer). Not in rooms, not on trap parts, not beside stairs/doors/entrance/Heart/
  Call-stone. 149-155 pieces on the golden replay at tick 10760 (70 from the map file).
- **Proof run**: `wallsample` adds `kit_close_wall_foot.png`, `kit_close_rubble_corner_{1,2}.png` (Layer 2 corners at cells
  (27.7, 13.3) and (12.7, 3.3); the same views with the switches off), `UR_BLEND` log lines, texture memory and
  `r.VT.ListPhysicalPools` during PERF.

## Numbers (UR_WALL PERF, 150 frames, game running, Layer 2 default view, 1920x1080, quality 2, 30 fps cap)

| run | GPU ms | game / render thread ms | RHI texture memory | VT physical pools |
|---|---|---|---|---|
| A: before this order (VT off), 2 runs | 6.47 / 6.46 | 2.6-2.8 / 6.7-7.0 | - | - |
| B: VT support on, blend off, 2 runs | 6.48 / 6.50 | 2.2-2.7 / 6.7 | 1021 MB | 0 |
| C: blend + rubble on, 3 runs | 6.58 / 6.60 / 6.58 | 2.4-3.2 / 6.6-7.9 | 1145 MB | 121 MB reserved (64 MB default per pool: DXT1/DXT5 62 MB, G16 59 MB), 16 MB used |
| rubble without blend | 6.51 | 1.9 / 5.9 | 1021 MB | 0 |

- GPU cost of blend + rubble about +0.1 ms; VT support alone about 0. Noise of the parallel Blender load about +-0.1 ms here.
- Memory: +124 MB texture memory, almost all the two default-size VT pools; only ~16 MB of pages used at the default view. Can be
  cut with `[/Script/Engine.VirtualTexturePoolConfig] DefaultSizeInMegabyte` (not changed).
- Start-up: map built 10.0-10.6 s after process start in every warm run with or without VT/blend (10.5-10.6 s before);
  the first run after enabling VT was not measurably slower (67 s whole run vs 60-70 s), the setup script 7 s.

## Tests

- `build.sh`: Succeeded. `setup_blend.sh`: `UR_BLEND RESULT PASS`. Blender: `UR_RUBBLE RESULT PASS`.
- `test_sim.sh Underreign`: 8 of 8 Success, exit 0; golden hashes unchanged (reasonable_seed1_won 1e90d79f1f144be0,
  reasonable_seed12_lost c93dd97e0daee4d5, banner_seed4_won 89acda19d5372052, idle_seed1_lost cd052f1d3209fb89,
  doors_seed1_won 1d60929da14c21e4, newintruders_seed1_won 9a34e0e7c76a16ee, crownkiln_seed1_lost eafd44ab1599bde1,
  ashthread_seed1_won f6b2c1561b91778b, inkdrip_seed3_won 98ec80e889ebfd11).
- `wallsample` before / after / rubble without blend: `UR_WALL RESULT PASS (0 failed)` each.

## Captures (all looked at; licensed scanned rock: local only)

`Game/Captures/rvt_blend/`: `before/` (switches off), `after/` (`-URRVTBlend=1 -URRubble=1`), `rubble_noblend/` (`-URRubble=1`):
`kit_l2_full.png`, `kit_l2_low.png`, `kit_l2_overview.png`, `kit_close_corridor.png`, `kit_close_long_wall_{full,low}.png`,
`kit_close_outer_corner_{full,low}.png`, `kit_close_wall_foot.png`, `kit_close_rubble_corner_{1,2}.png`,
`kit_boundary_s{2,3,4}.png`, `kit_l2_full_after.png`; torches on. `sheets/`: side-by-side crops (brightened 1.8-2.5x for
reading): `corridor_before_after.png`, `corridor_wall_foot_zoom.png`, `outer_corner_before_after.png`,
`rubble_corner{1,2}_before_noblend_after.png`, `l2_game_camera_before_after.png`, `rubble_pieces_blender.png`.
Logs: `Evidence/UR-RVT-BLEND-TEST-V1/logs/`.

## What I saw

- **Wall foot**: before, a near-black contact band with a straight seam where floor meets rock; after, the lowest ~40 cm of the
  rock takes the floor's colour, so the rock rises out of the floor instead of standing on it. With the flat greybox floor the
  effect is real but subtle: at the default game camera (`kit_l2_full`) it is barely visible; it shows in the close corridor and
  corner views. Tint matters: too bright gives a red stripe along every wall.
- **No smears, no stretching, no RVT blur** seen at the game camera or close views (the floor is one flat colour, so
  resolution and projection stretching can hardly show; a textured floor would be the real test of both).
- **Rubble**: without blend the scree heap is a hard-edged disc of rock lying on the floor; with blend the mound takes the
  floor colour and only the stones read as rock - the heap sits in the ground. The mound's outline stays visible as a lighting
  edge (opaque mound vs translucent floor). Small stones and clumps along the walls read well; the broken slab is large and
  dark (one was beside a trap part; rubble on trap cells is now excluded).
- The writer squares follow the floor's per-cell colours (claimed vs unclaimed); at such boundaries the wall foot shows the
  same cell step as the floor - no extra artefact.

## Recommendation

Worth keeping as the technique, not yet worth switching on by default: cost is small (+0.1 ms, ~124 MB that can be cut to
about 30-60 MB), but with flat greybox floors the visual gain is subtle. Adopt it together with real ground textures (the
Blender ground texture order): then the floor writers should write the textured ground (the visible floor would need to become
opaque or the writer to match it) and the blend, crevice fill and rubble become clearly visible. Rubble with blend is the
clearer win already now.

## Changed files

External (uncommitted): `Game/Underreign/Config/DefaultEngine.ini` (`r.VirtualTextures=True`),
`Game/Underreign/Source/Underreign/Public/URGreyboxMap.h`, `Private/URGreyboxMap.cpp`, `Public/URCaptureDirector.h`,
`Private/URCaptureDirector.cpp`, `Game/Scripts/setup_blend.py`, `Game/Scripts/setup_blend.sh` (new), `Game/README.md`
(intro line, section "Floor blend and rubble test"), `ArtSource/Rubble/` (new: script, 5 FBX, `blend/rubble.blend`),
`Game/Underreign/Content/Environment/Blend/` (new: 2 RVTs, `M_UR_RVTFloorWriter`, `M_UR_KitRockBlend`, `MI_UR_RubbleRock`,
5 rubble meshes), `Game/Captures/rvt_blend/` (new), `Evidence/UR-RVT-BLEND-TEST-V1/` (new).
Not touched: `setup_kit.py`, `Content/Environment/Kit`, `Content/Greybox`, `ArtSource/GroundTextureTest`, read-only folders.
Work files: `C:/GameDev/Underreign_Assets/AnimWork/UR-RVT-BLEND-TEST-V1` (run tools, logs, comparison crops; temporary still
folders deleted; no film frames were made).

## Open points

1. Floors are flat greybox colour: the decisive look test needs ground textures; then decide opaque floor vs matching writer.
2. VT pool size (default 64 MB per pool, ~16 MB used): set a smaller pool if adopted.
3. Scree mound outline visible as a lighting edge on the translucent floor; tune or flatten the mound if rubble is adopted.
4. Rubble is presentation only: units walk through it; it is placed again on every layer rebuild (stable by hash).
5. Video's object-bounds falloff not used: the height alpha already limits the blend to the foot.
6. GPU numbers measured with the other Worker's Blender running; a quiet re-measurement would firm up the +0.1 ms.
