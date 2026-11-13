# Work Order UR-TORCHES-CLAIMED-V1 — Wall torches along claimed ground (presentation only)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.
Runs in parallel with UR-GROUND-TEXTURE-TEST-V1 (Blender only, other folders):
this order is the only one that runs Unreal now.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-TORCHES-CLAIMED-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-TORCHES-CLAIMED-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-TORCHES-CLAIMED-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-TORCHES-CLAIMED-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact, 2026-11-13)

"Für die Helligkeit: sobald Arbeiter Bodenflächen annektieren, können auch in noch
natürliche / frisch gegrabenen Höhlen alle X Felder Fackeln an den Wänden
platziert werden. So sieht man allgemein mehr und auch schneller, welches Gebiet
bereits eingenommen wurde. Ausarbeitung/Verbesserung der Wände kommt dann als
nächster Schritt der Arbeiter, wenn alles weitere erledigt ist."

On the Director's proposal (torches as presentation only first, one torch about
every 3 cells, adjustable): "Beide starten".

## Goal

In the game, walls next to claimed floor carry torches, also in natural and
freshly dug caves, so the player sees more and sees at once which ground is
theirs. **Presentation only**: the rules, the simulation, costs and worker jobs
do not change (golden hashes unchanged). Wall dressing is not part of this order.

## Tasks

1. **Placement rule (presentation layer, `Game/Underreign/Source/Underreign`).**
   Read the claimed flag from the simulation (read-only). Along every wall face
   that borders a claimed open cell, place a wall torch about **every 3 cells**
   (spacing a single constant plus a command-line override `-URTorchSpacing=N`;
   also accept 2 and 4). Spacing should look even along a corridor and around
   rooms, never two torches facing each other at the same spot, none on doors,
   stairs or in the Heart room if it looks crowded. Torches appear when a cell
   becomes claimed and go when it is lost or the wall is dug away; rebuild cost
   stays small (measure it).
2. **Torch look.** A simple own torch (Blender or Unreal-made mesh: iron bracket
   and wooden or iron head, mounted about 2.2 m above the floor), flame as an effect (Niagara or flipbook sprite, existing style-sample
   fire materials may be reused), warm flicker. Light: a warm point light per
   torch with a hard budget (for example only the nearest N lights cast shadows,
   the rest no shadows or emissive only); keep GPU frame time close to today's
   (UR-UNREAL-WALLSAMPLE-V1: kit 4.93 ms at 30 fps gentle).
3. **Captures, checked by eye.** Build and capture (frame-capped, offscreen):
   the wall-sample views before and after (layer 2 full walls, close corridor,
   6 s 360° turn), plus one view where claimed and unclaimed ground meet, at
   spacing 2, 3 and 4. Look at every capture yourself (they show the licensed
   scanned rock: viewing to check is fine, never send them to any generative or
   training service): brightness, readability of claimed ground, flicker,
   crowding, torches floating or inside rock.
4. **Function check only:** build passes, existing automation tests green,
   golden hashes unchanged, GPU time before/after.
5. Update `Game/README.md` (option) and write
   `Evidence/UR-TORCHES-CLAIMED-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-TORCHES-CLAIMED-V1/WORKER_RESULT.md` (Studio,
   plus the verify-worker line): changed files, capture paths, GPU numbers, what
   you saw, open points. Delete temporary frame folders.

## Limits

- External allowed: `Game/Underreign/Source/Underreign`,
  `Game/Underreign/Content/Environment/Torch` (new folder, own content only),
  `Game/Scripts`, `Game/Captures`, `Game/README.md`, `ArtSource/Torch`,
  `Evidence/UR-TORCHES-CLAIMED-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-TORCHES-CLAIMED-V1`. Work files only under
  `C:/GameDev/Underreign_Assets/AnimWork/UR-TORCHES-CLAIMED-V1`.
- Read-only: `SimulationCpp`, `Game/Underreign/Source/UnderreignSim`,
  `StyleSample`, `ArtSource/EnvironmentKit`, `ArtSource/GroundTextureTest`,
  `Design`. `Game/Underreign/Content/Greybox/M_UR_Greybox.uasset` is already
  modified in the working tree (stray re-save by setup_kit, Human not yet asked
  to discard): do not revert, commit or change it on purpose; if a script re-saves
  it again, report that. The scanned textures stay git-ignored. Never touch any
  Hearthlands folder or other `C:/GameDev/*` project.
- Unreal: every run frame-capped (30 fps), offscreen or minimised, gentle quality,
  short, no benchmark mode, no path tracing, below-normal priority, limited
  shader compile workers. Blender (if used) in background mode, lowered priority.
  Never launch through the Windows shell (no `start`, `explorer`, `Invoke-Item`,
  file associations). No window in front of the Human, no video playback with
  sound.
- Own content plus the style sample's licensed content locally only; no network,
  no uploads, no generative AI services.
- Report instead of silently changing the goal.
- Do NOT commit or push.
