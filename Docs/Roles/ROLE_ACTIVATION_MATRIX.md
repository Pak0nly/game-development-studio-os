# Role Activation Matrix

> **Status:** Adopted through LAIA-2026-07-22 on 2026-07-22.

## Use

`M` marks a default mandatory role when the current stage changes, depends on, or makes a gate-critical claim in that role's domain and the role's distinct finding can change the decision. `O` marks a role activated when a concrete risk, claim, or changed dependency makes its finding decision-relevant. `—` is normally not applicable. The table is an activation prompt, not an instruction to run a full board for every task carrying a broad assignment label.

Producer / Scope Controller and QA Lead are mandatory for every larger or Critical Task-Delta Work Order. A small isolated fix may combine their records, but it may not waive an applicable specialist review.

| Assignment type | Prod | TD | QA | Design | Art | Level | Tech Art | Asset | Unity | Cam/Occl | Gameplay QA | Perf | UI/UX | Audio | Narr/World | Release |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Gameplay feature | M | M | M | M | O | O | O | O | M* | O | M | O | O | O | O | — |
| Vehicle feature | M | M | M | M | O | O | M | M | M* | M | M | M | O | O | — | — |
| AI / bots | M | M | M | M | — | O | — | O | M* | O | M | M | — | — | O | — |
| Level / map build | M | O | M | M | M | M | M | M | M* | M | M | O | O | O | O | — |
| Structural visual-style foundation | M | O | M | O | M | M | M | M | M* | M | M | O | O | O | O | — |
| Bounded visual production | M | O | M | O | O | O | O | O | O | O | O | O | O | O | O | — |
| Asset import | M | O | M | — | M | O | M | M | M* | O | O | O | — | O | O | — |
| Asset purchase decision | M | O | M | O | M | O | M | M | O | O | O | O | O | O | O | O |
| UI | M | M | M | M | M | — | M | M | M* | O | M | O | M | O | O | — |
| Audio | M | O | M | M | O | O | O | M | M* | — | M | O | O | M | O | — |
| Performance | M | M | M | — | O | O | M | O | M* | O | M | M | O | O | — | O |
| Build / release | M | M | M | — | O | — | M | M | M* | O | M | M | M | M | O | M |
| Bugfix | M | O | M | O | O | O | O | O | M* | O | M | O | O | O | O | — |
| Technical architecture | M | M | M | O | — | — | O | O | M* | O | O | M | O | O | — | O |
| Documentation / governance | M | O | M | — | — | — | — | O | — | — | — | — | O | — | — | O |

`M*` applies when the project or work uses Unity. For another engine, activate its equivalent specialist.

## Structural Visual-Level Set

New level areas, structurally material revisions, and genuinely cross-domain visual stages activate at minimum:

- Producer / Scope Controller;
- Art Director;
- Level Designer;
- Technical Artist;
- Asset & Provenance Manager;
- Camera & Occlusion Reviewer;
- Gameplay QA Reviewer;
- QA Lead.

Performance Analyst, Audio Reviewer, UI/UX Reviewer, Narrative / Worldbuilding Reviewer, Technical Director, and Unity Specialist are added where their content or risk is present. The [Visual Level Review Board](Boards/VISUAL_LEVEL_REVIEW_BOARD.md) defines the shared full board.

Ordinary production on an accepted baseline uses only the roles whose distinct stage-exit findings can change the current decision. Diagnostic work uses causal and evidence reviewers; Integration work uses technical integrity reviewers. Neither mode activates the structural set merely because the subject is a scene, level, or asset.

## Activation Rules

1. The Producer records the execution mode, candidate stage, mandatory and optional roles, and the decision each activated role can change before formal review.
2. A role becomes mandatory when the stage changes or depends on its owned domain, a known risk is present, and its distinct finding can change passage or the next action.
3. A mandatory role may return `NOT APPLICABLE` only with a scope-specific reason.
4. Reviews run against one Definition-of-Ready candidate and in parallel where practical.
5. New roles may be added without changing authority; recurring additions should be evaluated through the Governance Lifecycle.
