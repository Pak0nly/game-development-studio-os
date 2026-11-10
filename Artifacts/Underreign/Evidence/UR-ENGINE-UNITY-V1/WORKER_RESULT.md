# UR-ENGINE-UNITY-V1 — Worker result

Engine comparison, stage 2 (UD-46): the shared scene in Unity 6000.6.4f1, once
with URP (Forward+) and once with HDRP. Worker: separate Claude Code subagent.
Mode: Discovery. Date: 2026-11-10. Nothing committed or pushed.

## Gate

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker ... (Studio root)
PASS worker receipt 97f74d5c8a05f87282225634e9c00ae32b2c2b965ad8b7a777585bd7dc8f4db4
```

Run once before the first change. After the power loss the Director said not to
re-run it (it would report drift from this order's own partial work).

## Result in short

- Two projects, `EngineComparison/Unity/URP` and `.../HDRP`, Unity registry
  packages only, `.gitignore` for Library, Temp, Logs, UserSettings, obj,
  Builds and Work.
- Kit copied unchanged into each `Assets/Kit`, axis marker checked, scene built
  by `UrBuilder.BuildAll` from `SCENE_LAYOUT.json` (180 instances, 12 lights,
  2 cameras, dig event, flicker, lava scroll).
- Captures in `EngineComparison/Unity/Captures/URP` and `.../HDRP`: four stills
  1920 x 1080 and two 300-frame clips 1280 x 720 each, from development
  players (game cameras, full post-processing). I looked at every still and
  checked the dig on frames 0119/0120.
- Performance (development build, RX 6800 XT, D3D12, 1920 x 1080 off-screen,
  window minimised, 20 s): URP average 3.11 ms, worst 3.56 ms; HDRP average
  14.70 ms, worst 15.63 ms.
- Full description, settings per pipeline, strengths and shortfalls:
  `EngineComparison/Unity/RESULT.md`. Comparison sheets with the Blender
  reference: `compare_overview.png`, `compare_close.png` in this folder; raw
  performance: `perf_URP.json`, `perf_HDRP.json`; build reports:
  `build_all_URP.txt`, `build_all_HDRP.txt`.

## Kit corrections applied (Director instruction, same as the Unreal side)

1. Every point and spot light = layout candela x 4 pi (URP: / 683 as its one
   global factor); the fill keeps its lux value. Ratios between local lights
   unchanged.
2. Only `UR_Rock_Fill` has a two-sided material. HDRP flips back-face normals;
   URP Lit cannot, so URP shows those faces dark instead of as holes.

## Decisions taken inside the order (for the Director to check)

1. **Axis mapping.** The marker proves the FBX importer gives neutral
   (x, y, z) -> Unity (x, z, y), yaw -yaw. The layout's pre-converted `unity`
   values use (-x, z, -y) (180 deg about up), which no import setting
   produces. The builder uses the neutral layout values with the verified
   mapping; the layout file is unchanged.
2. **Exposure and factors.** Both pipelines use ACES, -0.5 EV against the
   Blender-unit mapping and a global emissive factor of 1.6 (URP: emissive x
   1.6, post exposure -0.5; HDRP: 1.6 x 683/pi nits, EV100 8.0), chosen by
   comparing stills with the Blender reference.
3. **No baked GI.** APV with before/after-dig lighting scenarios was built and
   tested in URP; it lit the tunnel before the dig (probe leak over the wall)
   and over-reddened the chamber, so it was dropped. HDRP uses real-time SSGI
   instead.
4. **No volumetric light in HDRP**: SCENE_SPEC section 8 forbids fog and
   volumetrics for the comparison; the Work Order's "if they help" was read as
   subordinate to "within SCENE_SPEC.md".
5. **Captures via the player, not the editor**: game cameras render into an
   exact-size off-screen target, time stepped per frame, so TAA and SSGI have
   real history.

## Operational recovery (power loss at about 12:00)

- URP opened cleanly in batch mode and was rebuilt.
- HDRP failed to compile (`BadImageFormatException` on `UnityEngine.UI.ref.dll`
  from a cache hit). Deleting `HDRP/Library` (allowed) did not help because the
  broken artefact sat in the user-wide Unity build cache
  (`%LOCALAPPDATA%\Unity\Caches\bee`), outside the allowed paths; a request to
  delete those cache entries was refused by the permission system and not
  retried. Fix inside the allowed paths: a scripting define `UR_HDRP_PROJECT`
  in `HDRP/ProjectSettings` changes every compile key, so the broken entry is
  not used. The broken cache entry still exists and could affect another
  project with an identical compile setup; deleting
  `...\Caches\bee\9f90563cfd34238565a824032dd4d12e...0006` (or clearing that
  cache) is the Human's call.
- The first APV bake used the integrated GPU (22 min); the process was stopped
  and the bake re-run on the RX 6800 XT (`-OpenCL-PlatformAndDeviceIndices 0 1`).
- Unreal folders were never touched. Only one Unity process ran at a time after
  the restart; no window was shown (editor batch mode, players minimised).

## Changed paths

External (`C:/GameDev/Underreign`, untracked, not committed):
`EngineComparison/Unity/` (`.gitignore`, `RESULT.md`, `URP/`, `HDRP/`,
`Captures/`; ignored: `Builds/`, `Work/`, `Library/` etc.) and
`Evidence/UR-ENGINE-UNITY-V1/`. Studio:
`Artifacts/Underreign/Evidence/UR-ENGINE-UNITY-V1/WORKER_RESULT.md`.
Committable size about 1.74 GB, of which 1.42 GB are capture PNGs (LFS).
