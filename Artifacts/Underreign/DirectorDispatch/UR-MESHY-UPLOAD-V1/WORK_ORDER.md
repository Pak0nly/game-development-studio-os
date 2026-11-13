# Work Order UR-MESHY-UPLOAD-V1 — Put the Ashen Pact and intruder Meshy models into the repository for the cloud night

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Routine.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-MESHY-UPLOAD-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-MESHY-UPLOAD-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-MESHY-UPLOAD-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-MESHY-UPLOAD-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statement (exact, 2026-11-13)

"Lad alles was mit der Aschenbrut zu tun hat hoch was wir haben. Und gerne auch die
Eindringlinge. Solange Platz ist. Solange der Upload nicht gecapped ist sollte es
Recht schnell gehen."

Context: the cloud night shift shall make the Meshy models game ready in Blender;
the cloud only sees what is in the repository. The Human's Meshy models are the
Human's own content (UD-49, DEC-042).

## Tasks

1. Copy every zip from `C:/GameDev/Underreign_Assets/Meshy/` into
   `ArtSource/Meshy/Raw/` unchanged (same file names), **except**
   `Meshy_AI_Mycelia_Veiled_Queen_of_the_Hollow_20261112_texture_fbx.zip`
   (Mycelid Choir, not Ashen Pact or intruders). Also copy the two concept PNGs
   (`Basalthund mit glühendem Brandmal.png`, `Kleiner Aschengeist mit
   Glutherz.png`) to `ArtSource/Meshy/Concepts/`. The `_Overview` folder is not
   copied. Do not extract.
2. Make sure `.gitattributes` tracks `ArtSource/Meshy/**/*.zip` and
   `ArtSource/Meshy/**/*.png` with Git LFS (add one rule line if missing; change
   nothing else in the file).
3. Write `ArtSource/Meshy/README.md`: table zip → what it is (German title) →
   people / intruder / room / trap / weapon, copied from the identification
   table in `C:/Users/jarid/Desktop/Game Development/Artifacts/Underreign/Evidence/UR-MESHY-ID-V1/WORKER_RESULT.md`
   (with the triangle count and size columns), plus a note that these are raw
   Meshy exports (dense, triangulated, 4K textures) and not game ready.
4. Verify every copied zip byte-for-byte (sha256 equal to the source) and that
   `git lfs ls-files` lists them after staging. Commit only `ArtSource/Meshy`,
   `.gitattributes` and `Evidence/UR-MESHY-UPLOAD-V1` with message
   "UR-MESHY-UPLOAD-V1: raw Meshy models of the Ashen Pact and the intruders (LFS) for the cloud night".
   This order's commit is allowed (Director instruction); do NOT push.
5. Write `Evidence/UR-MESHY-UPLOAD-V1/WORKER_RESULT.md` (external, include the
   file list with sha256 and sizes and the total) and
   `Artifacts/Underreign/Evidence/UR-MESHY-UPLOAD-V1/WORKER_RESULT.md` (Studio,
   plus the verify-worker line and the commit hash).

## Limits

- External allowed: `ArtSource/Meshy`, `.gitattributes`,
  `Evidence/UR-MESHY-UPLOAD-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-MESHY-UPLOAD-V1`. The source folder
  `C:/GameDev/Underreign_Assets/Meshy` is read-only.
- Do not touch `ArtSource/GroundTextureTest` (another order is writing there),
  `Game`, `SimulationCpp`, `StyleSample`, `Design`. No engine runs, no network,
  no push.
