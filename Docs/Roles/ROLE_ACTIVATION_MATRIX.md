# Role Activation Matrix

## Use

`M` means mandatory, `O` optional when risk or content warrants it, and `—` normally not applicable. Producer / Scope Controller and QA Lead are mandatory for every larger work order. A small isolated fix may combine their records, but it may not waive applicable specialist review.

| Assignment type | Prod | TD | QA | Design | Art | Level | Tech Art | Asset | Unity | Cam/Occl | Gameplay QA | Perf | UI/UX | Audio | Narr/World | Release |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Gameplay feature | M | M | M | M | O | O | O | O | M* | O | M | O | O | O | O | — |
| Vehicle feature | M | M | M | M | O | O | M | M | M* | M | M | M | O | O | — | — |
| AI / bots | M | M | M | M | — | O | — | O | M* | O | M | M | — | — | O | — |
| Level / map build | M | O | M | M | M | M | M | M | M* | M | M | O | O | O | O | — |
| Visual Style Slice | M | O | M | O | M | M | M | M | M* | M | M | O | O | O | O | — |
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

## Mandatory Visual-Level Set

Every larger level or visual assignment activates at minimum:

- Producer / Scope Controller;
- Art Director;
- Level Designer;
- Technical Artist;
- Asset & Provenance Manager;
- Camera & Occlusion Reviewer;
- Gameplay QA Reviewer;
- QA Lead.

Performance Analyst, Audio Reviewer, UI/UX Reviewer, Narrative / Worldbuilding Reviewer, Technical Director, and Unity Specialist are added where their content or risk is present. The [Visual Level Review Board](Boards/VISUAL_LEVEL_REVIEW_BOARD.md) defines the shared board.

## Activation Rules

1. The Producer records mandatory and optional roles before implementation.
2. Optional roles become mandatory when the assignment changes their owned domain or when a known risk is present.
3. A mandatory role may return `NOT APPLICABLE` only with a scope-specific reason.
4. New roles may be added without changing authority; recurring additions should be evaluated through the Governance Lifecycle.
