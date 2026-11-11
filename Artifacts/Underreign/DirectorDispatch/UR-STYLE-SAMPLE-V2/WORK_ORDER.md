# Work Order UR-STYLE-SAMPLE-V2 — Style sample step 2 with Megascans

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V2/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V2/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V2/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V2/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (2026-11-11, exact)

- On step 1: "Stilprobe: Leider durch die fehlenden realistischen Texturen wenig wert. Aus Entfernung sieht es ok aus, die Nahaufnahme sind nicht schön. Insbesondere die mit dem Amboss erinnert sogar eher an die Grafikqualität der original DK2 cinematics. Also sehr veraltet mit etwas besserer Auflösung."
- Target look: the Human's own edited images `Projects/Underreign/References/ArtDirection/style_target_game_camera_v1.png` and `style_target_forge_closeup_v1.png` (Studio repository), prompt "Wie würde die Unreal Engine dies darstellen. Ziel ist Grafikqualität und Realismus." They are orientation for quality and mood, not a layout to copy pixel by pixel.
- "Nahansicht kann nötig sein, wenn wir die Option einbauen Einheiten selbst zu steuern." (so the close view matters).
- Assets: "C:\GameDev\Underreign_Assets\Fab\VaultCache — So, einiges eingefügt. Mehr geworden als erwartet. So haben wir aber schon Auswahl / Optionen." (89 Quixel Megascans items, about 6 GB: cliffs, volcanic/basalt-like rock, stone floors, wet ground, debris, blood spatter, mud, rusty metal, leakage, lava rock.)

## Tasks

1. Rebuild the same Ashen Pact corner in `StyleSample` (keep step 1 in the
   history; a new level `L_StyleSample_V2` is fine) to match the target
   images' quality: real scanned rock for walls and cliffs, worn wet stone
   floor with specular wetness, rubble and debris, blood spatter and drag
   marks, soot/leakage/mud decals, rusty metal for forge, braziers and chains,
   lava with crust from the lava-rock scans plus emissive cracks.
2. Import from `C:/GameDev/Underreign_Assets/Fab/VaultCache/FabLibrary`
   (read-only source) only what the scene uses, at 2K–4K, Nanite on for meshes.
   Do not copy the whole library into the repository.
3. Better props where step 1 looked dated: forge (brick and iron), anvil,
   braziers, chains, pillars — build them properly in Blender with the scanned
   materials, or kit-bash from the scanned meshes.
4. Fire, smoke, embers, sparks: make them look real at game level. Try Niagara
   again (engine Niagara templates or systems built by script with your own
   materials; engine-shipped fire/smoke content is fine); if one route fails,
   diagnose that concrete failure and try the next before falling back.
5. Keep the readability aids (outline, ground ring, unit light) and test them
   in the new look.
6. Proof: the same three cameras as step 1 (game camera, forge close-up, chasm
   and Heart) plus a game-camera still with units, and a ~6 s camera move
   (WebP/GIF); side-by-side sheet step 1 vs step 2 vs target image for the game
   camera and the forge close-up; GPU table High vs Epic (capped).
7. `StyleSample/README.md` update, `Evidence/UR-STYLE-SAMPLE-V2/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V2/WORKER_RESULT.md`
   (Studio), with honest weak points and which scans were used (list).

## Limits

- External allowed: `StyleSample`, `Evidence/UR-STYLE-SAMPLE-V2`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V2`. `C:/GameDev/Underreign_Assets`
  read-only. Third-party assets: never upload them, screenshots of them or
  their textures to any AI service (Meshy etc.); local use in Unreal and
  Blender only (DEC-025: no training).
- **Power safety (hard)**: every Unreal run frame-capped at 30 fps (never
  `-benchmark`; check that fixed-step capture modes respect the cap), offscreen,
  short; no Movie Render Queue, no path tracing. Never run while another
  UnrealEditor process runs. Never a window in front of the Human. Build
  parallelism at most 8.
- Do NOT commit or push.
