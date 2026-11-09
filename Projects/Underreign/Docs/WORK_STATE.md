# Underreign Work State

project_id: Underreign

## Present state - 2026-11-09

Project Underreign (working title) is set up (commit aff7610). Concept v1
approved (UD-23); catalogue rounds 2 to 4 recorded (UD-24 to UD-33). DEC-041
records the project.

- UR-DECISIONS-R4-V1: first dispatch through the Underreign gate (receipt
  `0d7b1b88…`, verify-worker PASS; no independent review required for this
  routine recording). Recorded UD-32 (Deep Dwarves: fifth playable people, also
  rivals digging in from the side) and UD-33 (Crystal Brood later); created
  `Docs/PRODUCTION_PROFILE.md`. Evidence:
  `Artifacts/Underreign/Evidence/UR-DECISIONS-R4-V1/WORKER_RESULT.md`.
  Committed.

- Dispatch gate: `Tools/UnderreignDispatchGate`, an independent copy of
  `Tools/ClaudeDispatchGate`; forbids mutation of other projects' roots; 41/41
  tests pass. Built by UR-SETUP-INFRA-V1 under bootstrap (no gate existed);
  independent review PASS, low findings corrected (Correction 01). Correction 02
  recorded round 3. Evidence:
  `Artifacts/Underreign/Evidence/UR-SETUP-INFRA-V1/WORKER_RESULT.md`. This
  bootstrap creates no standing exception; every later mutation-capable
  Underreign dispatch needs a gate receipt.
- Unity project folder: `C:\GameDev\Underreign`, own local Git with Git LFS,
  no remote, no Unity project yet.
- Prototype direction: Ashen Pact, three layers, heat rises (UD-24), greybox.
- Peoples: Ashen Pact with glass horns (UD-28), Mycelid Choir, Drowned Court as
  an eerie deep-sea people (UD-30), Gearbound Kin as kobold tinkerers (UD-29),
  Deep Dwarves (UD-32); Crystal Brood later (UD-33).
- Image prompts for rough looks:
  `Projects/Underreign/References/ArtDirection/IMAGE_PROMPTS.md`.

Nothing in Hearthlands, MobileArc or Crime99 was changed.

## Human checkpoint

Waiting for the Human's own
rough images. Then a prototype planning Work Order (Ashen Pact, three layers,
heat rises, greybox).
