# Work Order UR-GROUND-TEXTURE-SHARP-V1 — Bring back the sharpness of the natural rock (Blender test, levers 1 to 4)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.
Follows UR-GROUND-TEXTURE-TEST-V1 (closed, scripts in `ArtSource/GroundTextureTest/scripts`).

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-GROUND-TEXTURE-SHARP-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-GROUND-TEXTURE-SHARP-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-GROUND-TEXTURE-SHARP-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-GROUND-TEXTURE-SHARP-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact, 2026-11-13)

"Was mir dort allgemein aufgefallen ist, ist dass bei allen, außer vielleicht beim
Basalt, die 3D Oberfläche abgerundet und geschliffen ist und so den Texturen die
\"Schärfe\" nimmt. Also Kanten, Ritzen, Löscher und Risse die in solchen Wänden
natürlicherweise drin wären. Aus Sicht der Modellierung zur Reduzierung von triangles
und vor Allem zu besseren Darstellung von Licht etc. verständlich, aber dennoch wäre
es gut, wenn wir da noch was dran drehen könnten. Wie sehen die normal maps der
Texturen aus? Kann man die tweaken? Sonstige Tricks?"

"Die dunkle Schnittkappe dient auch zur Identifikation von Goldvorkommen. Sie kann
ruhig etwas heller sein."

"Gerne einen kurzen Test mit den Punkten 1-4 zu den Wandtexturen."

The four points the Director proposed: (1) the scans' real normal maps at full
strength, adjustable; (2) cavity / ambient-occlusion maps that darken cracks and
joints; (3) side light from wall torches to judge the relief; (4) real
displacement of the surface from the scan's height map.

Visual checking is mandatory (the Human, again on 2026-11-13: "Visuelle Prüfung
ist mandatory, prüfen via daten reicht nicht aus. Es muss passen und gut
aussehen."). The images are shown to the Human; that is not training use.

## Diagnosis to fix

The previous test used no normal maps: only a Bump node from the 2K height map
(distance 0.03 m, strength 0.5 to 0.8) under soft, nearly shadowless light. See
`ArtSource/GroundTextureTest/scripts/scene.py` (around the Bump node) and `sets.py`.

## Tasks

1. **Variants:** one per stratum, the Director's recommendation (the Human has
   not picked yet): Soil A, Stone A, Basalt A, Gold vein A, Bedrock C (folders as
   in the previous WORKER_RESULT). Same section, same game camera (pitch 70°,
   horizontal FOV 65°, 8.5 cells), same 3 m close view.
2. **Lever 1, normal maps:** use each scan's own normal map (check whether it is
   OpenGL or DirectX convention and flip green if needed; check by eye that
   cracks read as cracks, not bumps). Keep it at full strength by default; keep
   texture resolution at least 4K for the close view if the library has it
   (copies only under the work folder). Triplanar must transform the normals
   correctly per axis (no lighting seams at the blend zones).
3. **Lever 2, cavity:** use the scan's AO / cavity map (or derive cavity from
   the height map if none) to darken cracks and joints in base colour and
   roughness, moderately.
4. **Lever 3, light:** render every state twice: the previous neutral light and
   a torch light (warm point lights on the walls about every 3 cells, 2.2 m high,
   like the game's torches, plus a low ambient).
5. **Lever 4, displacement:** real geometry displacement from the scan's height
   map on the wall faces (for example adaptive subdivision or a Subdivision +
   Displace stack, Cycles true displacement), scaled so edges, holes and cracks
   become real geometry without the walls swelling into the corridors. Note the
   triangle counts this would need (relevant for Unreal later).
6. **Cut cap:** a bit lighter and slightly tinted to each stratum, still clearly
   darker than the floor; in the gold stratum the gold must stay clearly visible
   in the cap (it marks gold deposits from above).
7. **Renders, checked by eye** (1600 x 900 or more, German labels): per stratum
   one sheet comparing "vorher" (old test), "1+2" (normal map + cavity),
   "1+2+4" (plus displacement), each under neutral and torch light, game camera
   and 3 m close view. One overview sheet of all five strata in the best state
   under torch light. One sheet of the cut cap old vs new including gold. Look at
   every render: sharp edges, cracks reading as cracks, no shimmer, no stretching
   or seams, walls not too busy from the game camera. Iterate until fair.
8. Write `Evidence/UR-GROUND-TEXTURE-SHARP-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-GROUND-TEXTURE-SHARP-V1/WORKER_RESULT.md`
   (Studio, plus the verify-worker line): what each lever does visually, the
   settings, displacement cost, image paths, recommendation for the in-game
   order (which levers, which strengths). Delete temporary frame folders.

## Limits

- External allowed: `ArtSource/GroundTextureTest` (scripts, own small files),
  `Evidence/UR-GROUND-TEXTURE-SHARP-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-GROUND-TEXTURE-SHARP-V1`. Renders and copied
  library textures only under
  `C:/GameDev/Underreign_Assets/AnimWork/UR-GROUND-TEXTURE-SHARP-V1` (outside
  Git; never copy licensed textures into the repository).
- Read-only: everything else, in particular `ArtSource/EnvironmentKit`, `Game`,
  `SimulationCpp`, `StyleSample`, `Design`. Do not start Unreal.
- Blender 5.2 background mode, lowered priority; CPU by default, GPU only if
  clearly faster for long renders, saving every frame. Never launch through the
  Windows shell. No window in front of the Human, no video playback.
- Licensed scans: view locally to choose and check (mandatory); never send them
  to generative AI services or use them for training. No network.
- Report instead of silently changing the goal. Do NOT commit or push.
