# Work Order UR-RVT-BLEND-TEST-V1 — Soft floor-to-wall transitions and rubble with Runtime Virtual Texture (Unreal test)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.
Runs in parallel with UR-GROUND-TEXTURE-SHARP-V1 (Blender only, other folders):
this order is the only one that runs Unreal now.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-RVT-BLEND-TEST-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-RVT-BLEND-TEST-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-RVT-BLEND-TEST-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-RVT-BLEND-TEST-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact, 2026-11-13)

"Separat, weil ich die Übergänge zwischen Boden und Rand und auch den Boden generell
mit Schutt etc. natürlicher gestalten möchte, hier ein interessantes Video zu
texture / object blending, welches uns evtl. helfen könnte. Bitte prüfen:
https://www.youtube.com/watch?v=GSJFuoerkaw"

After the Director's summary: "Auf jeden Fall wert es zu testen."

## The technique (from the video's transcript, read by the Director)

"Blending Objects into Landscapes in UE5: A Guide to Runtime Virtual Texture"
(Mohammad Solei). Steps: enable Virtual Texture support in the project settings;
create two Runtime Virtual Textures (one for the ground material: base colour,
specular, roughness, world-space normal; one with content "World Height"),
size 10 or higher; place a Runtime Virtual Texture Volume per RVT with bounds
over the ground; the ground material writes to them (Runtime Virtual Texture
Output; normal converted tangent to world space, world position Z as height);
the ground's components "Draw in Virtual Textures" for both. Object materials
(rocks) sample both RVTs and blend their own material with the sampled ground
material by an alpha: (object world position Z minus sampled world height)
divided by a hardness parameter, saturated; a falloff from the object's bounds
height; a "side remover" that masks steep faces with the vertex normal Z to
avoid stretching; wrapped in a material function with an on/off switch.

## Goal

A sample that shows whether this makes Underreign's caves look natural where
floor meets wall, and lets rubble lie in the ground instead of on it. Our
ground is not a Landscape: the floors are meshes built at play time by
`URGreyboxMap`, so the floor meshes themselves must draw into the RVT.

## Tasks

1. **Setup (presentation layer only).** Enable virtual texture support (project
   setting; note any shader recompile cost). Create the two RVTs and volumes for
   the play area (sized from the map at run time if needed). Let the floor
   material(s) write base colour, roughness, normal and height. Let the kit wall
   material blend its foot (the lowest 20 to 60 cm, parameter) into the floor
   material; the side remover keeps steep wall faces clean. Behind a command-line
   switch `-URRVTBlend=0/1` so before/after is one flag.
2. **Rubble.** Make a few own rubble pieces (Blender: small stones, a scree
   heap, a broken slab; own content, about 5 pieces) that use the same blend,
   scattered along wall feet and in two corners of the wall-sample map
   (presentation only, deterministic placement, a switch `-URRubble=0/1`).
3. **Captures, checked by eye** (frame-capped, offscreen, gentle quality):
   the wall-sample views from UR-UNREAL-WALLSAMPLE-V1 and UR-TORCHES-CLAIMED-V1
   (game camera, close corridor, a corner with rubble), each before and after,
   with torches on. Look at every capture yourself (they show licensed scanned
   rock: viewing is mandatory): does the foot of the wall melt into the floor,
   no smears, no stretching, no visible RVT resolution blur at the game camera,
   rubble sitting in the ground.
4. **Cost.** GPU time before/after at 30 fps gentle (as in the torch order),
   RVT memory, and any change to start-up time.
5. **Function check only:** build passes, existing automation tests green,
   golden hashes unchanged.
6. Write `Evidence/UR-RVT-BLEND-TEST-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-RVT-BLEND-TEST-V1/WORKER_RESULT.md`
   (Studio, plus the verify-worker line): changed files, settings, capture
   paths, GPU and memory numbers, what you saw, whether it is worth adopting,
   open points. Delete temporary frame folders.

## Limits

- External allowed: `Game/Underreign/Source/Underreign`,
  `Game/Underreign/Content/Environment/Blend` (new folder, own content),
  `Game/Underreign/Content/Environment/Kit/Materials` (only the materials the
  blend needs), `Game/Underreign/Content/Greybox` (floor materials, only if the
  floors need to write to the RVT),
  `Game/Underreign/Config`, `Game/Scripts`, `Game/Captures`, `Game/README.md`,
  `ArtSource/Rubble`, `Evidence/UR-RVT-BLEND-TEST-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-RVT-BLEND-TEST-V1`. Work files only under
  `C:/GameDev/Underreign_Assets/AnimWork/UR-RVT-BLEND-TEST-V1`.
- If the kit wall material (made by `Game/Scripts/setup_kit.py`) needs the
  blend, change it through `setup_kit.py` (allowed) and restore any rebuilt kit
  files that are not part of the change, exactly as UR-GREYBOX-RESAVE-FIX-V1 did.
- Read-only: `SimulationCpp`, `Game/Underreign/Source/UnderreignSim`,
  `StyleSample`, `ArtSource/EnvironmentKit`, `ArtSource/GroundTextureTest`
  (another order is writing there), `Design`. Never touch any Hearthlands folder
  or other `C:/GameDev/*` project. Scanned textures stay git-ignored.
- Unreal: every run frame-capped (30 fps), offscreen or minimised, gentle
  quality, short, below-normal priority where possible, limited shader compile
  workers. Blender in background mode. Never launch through the Windows shell.
  No window in front of the Human, no video playback.
- No network, no uploads, no generative AI services. Report instead of silently
  changing the goal. Do NOT commit or push.
