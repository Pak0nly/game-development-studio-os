# Work Order UR-GROUND-TEXTURE-TEST-V1 — Natural ground textures per stratum (Blender sample, game camera)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.
Runs in parallel with UR-TORCHES-CLAIMED-V1 (Unreal, other folders): this order
uses Blender only and must not start Unreal or touch `Game/`.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-GROUND-TEXTURE-TEST-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-GROUND-TEXTURE-TEST-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-GROUND-TEXTURE-TEST-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-GROUND-TEXTURE-TEST-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact, 2026-11-13)

"Was wir auch schauen sollten: Du sprichst von der dunklen scan Textur, wir sollten
für normales Erdreich auch andere Texturen testen und nicht etwas nur dunkles
nutzen. Fraktionspassend soll in erster Linie ja der eigene Ausbau sein und nicht
von vorn herein alles drum herum."

On the Director's proposal (texture test for natural ground, brighter, different
per stratum; the dark faction look only through the player's own building):
"Beide starten".

## Goal

One visual sample (not yet the full game change): untouched soil and rock look
**natural, varied and at normal brightness**, each stratum clearly its own
material (soil, stone, basalt, gold vein, bedrock). The dark charred faction look
(soot, embers, dressed walls) appears only on ground the player has claimed and
built. The Human picks a direction from the images; only then does a later order
bring it into the game.

## Tasks

1. **Choose textures by eye.** Look through the read-only library
   `C:/GameDev/Underreign_Assets/Fab/VaultCache/FabLibrary` (licensed Megascans,
   DEC-025) and the kit's own procedural stand-ins in
   `ArtSource/EnvironmentKit/textures`. View the candidates yourself (UD-85:
   choose by looking, never by names alone). Per stratum pick **three variants**
   (A, B, C) that differ in a real way (colour, grain, wetness, roughness), all
   natural and not dark-charred. Gold vein must read as gold-bearing rock.
2. **Blender scene (local Blender 5.2, background, CPU by default).** Use the
   current kit meshes from `ArtSource/EnvironmentKit` (read-only) on a small
   section at 2 m cells with corridors and a room, walls 4 m. Reproduce the game
   camera (pitch 70°, horizontal FOV 65°, default distance 8.5 cells) and a
   neutral, mid-bright cave light (no torches; the torch order is separate). Use
   a triplanar or UV mapping that does not show visible tiling at game distance.
3. **Renders, checked by eye.** Sharp, 1600 x 900 or more:
   - per stratum one sheet with A, B, C side by side from the same game camera;
   - one overview sheet: all five strata, best variant each, plus today's dark
     scanned rock for comparison;
   - one **contrast image**: the same section half natural (untouched) and half
     claimed and built (dark charred, soot, ember glow), so the Human sees the
     two states next to each other;
   - one close view at about 3 m for each chosen variant.
   Look at every render yourself: tiling, colour shifts at seams, too dark, too
   uniform, strata not distinguishable. Iterate until each sheet is fair to judge.
   Label every image in German plain words (stratum and variant).
4. Write `Evidence/UR-GROUND-TEXTURE-TEST-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-GROUND-TEXTURE-TEST-V1/WORKER_RESULT.md`
   (Studio, plus the verify-worker line): chosen texture sets per variant (library
   folder names), scene and render scripts, image paths, what you saw, and a
   recommendation per stratum. Delete temporary frame folders.

## Limits

- External allowed: `ArtSource/GroundTextureTest` (scripts, .blend, own small
  files), `Evidence/UR-GROUND-TEXTURE-TEST-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-GROUND-TEXTURE-TEST-V1`. Renders and any
  copied or resized library textures go only to
  `C:/GameDev/Underreign_Assets/AnimWork/UR-GROUND-TEXTURE-TEST-V1` (outside Git;
  never copy licensed textures into the Git repository).
- Everything else read-only, in particular `ArtSource/EnvironmentKit`, `Game`,
  `SimulationCpp`, `StyleSample`, `Design`. Never touch any Hearthlands folder or
  other `C:/GameDev/*` project. Do not start Unreal.
- Blender in background mode, lowered priority; CPU by default, GPU (Cycles HIP)
  only if clearly faster for long renders, saving every frame. No window in front
  of the Human, no video playback with sound. Never launch through the Windows
  shell (no `start`, `explorer`, `Invoke-Item`, file associations).
- Licensed scans are viewed locally to choose and check (UD-85); no network, no
  uploads, no generative AI services, no training use.
- Report instead of silently changing the goal.
- Do NOT commit or push.
