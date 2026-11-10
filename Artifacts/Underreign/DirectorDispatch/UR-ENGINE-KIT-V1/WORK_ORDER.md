# Work Order UR-ENGINE-KIT-V1 — Engine comparison, stage 1: Blender kit and shared scene

Project: Underreign (DEC-041). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-ENGINE-KIT-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-ENGINE-KIT-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-ENGINE-KIT-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-ENGINE-KIT-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Why

UD-46: before the engine is chosen, the Human wants a fair comparison sample:
the same scene in Unity and in Unreal Engine, same camera, side by side. Graphics
may be free, owned or made by Claude in Blender. This stage makes ONE shared,
original asset kit and ONE shared scene description, so that stage 2 can build
the identical scene in both engines. Human go: "Ja starten" (2026-11-10).

## Read first

- `C:/GameDev/Underreign/Design/Snapshot/GAME_CONCEPT.md` (Ashen Pact look, section 2)
- `C:/GameDev/Underreign/Design/Snapshot/DISCOVERY_DECISIONS.md` (UD-19 stylised 3D; UD-28 glass horns with contract rings; UD-37 and UD-47 layers separated by thick rock and connected only at fixed breakthrough points)
- `C:/GameDev/Underreign/Design/Art/ART_DIRECTION_BRIEF.md`
- `C:/GameDev/Underreign/Design/Snapshot/ArtDirection/peoples_ashen_pact_v1.webp` (the Human's rough mood image: orientation only, do not copy it)

## Tool

Blender 5.2 at `C:\Program Files\Blender Foundation\Blender 5.2\blender.exe`,
run headless (`--background --python <script>`), never as a visible window.
Everything is built by Python scripts kept in the kit folder, so it can be
rebuilt. No downloads, no external assets: everything is original.

## The scene (one Ashen Pact chamber over two layers)

Scale: 1 m = 1 unit; one grid cell = 2 m; wall height 3 m; the rock slab between
the two layers is 2 m thick (UD-37: layers are not directly adjacent).

- **Upper layer:** a dark corridor with a fixed breakthrough point (UD-47): a
  stone stair shaft going down through the thick slab, with a heavy brass-bound
  hatch frame.
- **Lower layer:** a chamber about 10 × 8 cells: basalt walls in chunky,
  bevelled, slightly irregular blocks; a floor of large cracked flagstones with
  warm glowing seams; a lava channel across one side; a contract door (black
  wood, brass bands, big red wax seal); wall panels with carved contract script
  that glows faintly; two torch sconces; a brass brazier; scattered scrolls.
- **One figure:** a stylised Ashen Pact contract-keeper (lean, tall, cracked
  black crust with glowing seams, horns of black glass with brass contract
  rings; UD-28), a clean low-to-mid-poly sculpt-like blockout good enough to judge
  light on a character. No rig needed; one A-pose or standing pose.
- **A fresh tunnel:** one wall segment between the chamber and a raw,
  freshly dug tunnel (rough rock, rubble) is a separate object that stage 2
  removes during the clip ("dig moment"), so the lava light floods the tunnel.

Look: stylised 3D with clear, readable shapes and colours (UD-19), hand-painted
feel through baked colour variation, not photo textures. Black, ember orange,
brass, wax red (concept palette).

## Deliverables (all in `C:/GameDev/Underreign/EngineComparison/Kit/`)

1. `scripts/`: the Blender Python scripts (build kit, assemble scene, bake,
   export, preview render).
2. `export/`: one FBX per kit piece (or one FBX for static pieces plus separate
   FBX files for the figure, the removable wall and the lava), meters, a clear
   axis convention documented for Unity and Unreal; baked PNG textures per
   material (base colour, normal, roughness/metallic, emissive) at 2048 or
   1024; no Blender-only shader tricks that engines cannot reproduce.
3. `SCENE_LAYOUT.json`: every object instance (file, name, position, rotation,
   scale in meters, engine-neutral right-handed Z-up with the conversion for
   Unity and Unreal documented), every light (type, position, direction,
   colour, intensity in physical units: lumens or candela, attenuation radius,
   flicker yes/no), the lava and seam emissive strengths, and two cameras:
   `cam_overview` (oblique top-down about 50°, the game view, showing both
   layers through a cut-away of the upper layer) and `cam_close` (closer, the
   figure, door and lava). Also the clip spec: a 10 s camera move for each
   camera and the dig moment (wall object removed at t = 4 s).
4. `SCENE_SPEC.md`: plain description of the scene, art intent, what the
   engines must match exactly and what each engine may tune (exposure, light
   bounce settings), so the comparison is fair.
5. `preview/`: Blender Eevee renders from both cameras (before and after the
   dig moment), 1920 × 1080, so the Director can check the kit.
6. `Evidence/UR-ENGINE-KIT-V1/WORKER_RESULT.md` in the external repository and
   `Artifacts/Underreign/Evidence/UR-ENGINE-KIT-V1/WORKER_RESULT.md` in the
   Studio repository: files with sizes, triangle counts per object, texture
   list, build commands, preview list, anything open.
7. Commit in `C:/GameDev/Underreign` on `main`: message
   `Underreign UR-ENGINE-KIT-V1: Blender kit, scene layout and previews for the engine comparison`
   plus `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. No push.

## Limits

- External allowed: `EngineComparison/Kit`, `Evidence/UR-ENGINE-KIT-V1`. Studio
  allowed: `Artifacts/Underreign/Evidence/UR-ENGINE-KIT-V1`. Nothing else.
- No Unity, no Unreal, no downloads, no windows over the Human's screen.
- Quality bar: the kit must be good enough to judge lighting and material
  quality, not a grey box. If a part cannot reach that bar, say so in the result
  instead of hiding it.
