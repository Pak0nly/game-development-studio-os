# Work Order UR-NIGHT-PREP-V1 — Design snapshot and night order into the Underreign repository

Project: Underreign (DEC-041). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Routine.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-NIGHT-PREP-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-NIGHT-PREP-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-NIGHT-PREP-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-NIGHT-PREP-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human authority

- 2026-11-09: "Kannst du die Planung und auch gerne weiteres in einer
  Nachtschicht umsetzen?"; private GitHub repository `Pak0nly/underreign`
  approved and created ("Ja, leg du es an"); night ends 08:00 local.
- The Human's six rough reference images of the peoples (ChatGPT, 2026-11-09):
  "Hier die ersten Ideen visuell für die Völker. Finde sie allgemein sehr
  gelungen." and "Es war nur ein erstes Bild als Anhaltspunkt." They are
  orientation only, not approved art.

## Tasks

1. **Reference images in the Studio repository.** Copy the six images from
   `C:\Users\jarid\AppData\Local\Temp\claude\4e92a571ad15f660\cc340d82-47d3-46c9-8b8c-d61ca88c10be\images\`
   (`1.webp` … `6.webp`) to `Projects/Underreign/References/ArtDirection/`
   with descriptive names: `peoples_gearbound_kin_v1.webp` (1),
   `peoples_crystal_brood_v1.webp` (2), `peoples_deep_dwarves_v1.webp` (3),
   `peoples_drowned_court_v1.webp` (4), `peoples_mycelid_choir_v1.webp` (5),
   `peoples_ashen_pact_v1.webp` (6). Open each image to confirm the mapping
   before naming. Write `Projects/Underreign/References/ArtDirection/PROVENANCE.md`:
   tool ChatGPT image generation, made by the Human Developer on 2026-11-09
   from `IMAGE_PROMPTS.md`, status rough orientation only (not approved art,
   not for shipping), DEC-025 note (no use as training data).
2. **Snapshot into `C:/GameDev/Underreign`** (Git repository, branch `main`):
   - `Design/Snapshot/`: byte copies of `Projects/Underreign/README.md` and
     `Projects/Underreign/Docs/{GAME_CONCEPT,DISCOVERY_DECISIONS,OPEN_DECISIONS,PRODUCTION_PROFILE}.md`;
     `Design/Snapshot/ArtDirection/`: `IMAGE_PROMPTS.md`, `PROVENANCE.md` and the
     six images.
   - `Design/Snapshot/SNAPSHOT.md`: Studio commit hash the copy was taken from
     and the rule "read-only copy; the Studio repository is authoritative".
   - `Night/UR-NIGHT-01-V1/WORK_ORDER.md`: byte copy of
     `Artifacts/Underreign/DirectorDispatch/UR-NIGHT-01-V1/WORK_ORDER.md` (check
     the SHA-256 is identical).
   - `Evidence/UR-NIGHT-PREP-V1/WORKER_RESULT.md`: files copied with SHA-256.
   - Commit on `main` with message
     `Underreign UR-NIGHT-PREP-V1: design snapshot and night order 1` and the
     line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Do NOT push
     (the Director pushes after the night manifest is validated).
3. Write `Artifacts/Underreign/Evidence/UR-NIGHT-PREP-V1/WORKER_RESULT.md` in
   the Studio repository: files, hashes, the external commit hash.

## Limits

- Studio allowed mutations: `Projects/Underreign/References/ArtDirection` and
  `Artifacts/Underreign/Evidence/UR-NIGHT-PREP-V1`. External allowed mutations:
  `Design/Snapshot`, `Night`, `Evidence/UR-NIGHT-PREP-V1`. Nothing else.
- No commit in the Studio repository, no push anywhere, no Unity, nothing else
  under `C:\GameDev`.
- If something cannot be done, report it; do not change the goal.
