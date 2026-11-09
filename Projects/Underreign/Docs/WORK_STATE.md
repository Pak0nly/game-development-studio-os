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

## Closed: UR-GATE-EXTERNAL-NIGHT-V1

UR-GATE-EXTERNAL-NIGHT-V1 (gate gains external root `C:/GameDev/Underreign`
and cloud night mode; no budget field; 75/75 tests).
Independent review verdict: PASS
Worker task: a577e0a890a4cb7e9
Reviewer task: a71ee8999657bf6b9
Candidate identity: 3c5f4850bd0cd679eb3e996c42182c4f94f6ac0f5c97fd19a048f9d748364a20
Closure receipt: 4a7487c363271a1a9952c8ff2d9351b8a8a1e3702a6395b0bd2ae726645bb235

## Human checkpoint

Night shift 1 in preparation (Human, 2026-11-09): private GitHub repository
`Pak0nly/underreign` created and set as `origin` of `C:/GameDev/Underreign`;
night order UR-NIGHT-01-V1 (prototype plan, simulation core, game bible) runs in
the cloud on `night/2026-11-09` until 07:00 UTC; snapshot order
UR-NIGHT-PREP-V1 prepared. Morning: fetch, `verify-night-return`, review,
sync results into the Studio repository.
