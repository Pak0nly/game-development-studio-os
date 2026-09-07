# Role Operating Model

> **Status:** Adopted through LAIA-2026-07-22 on 2026-07-22; amended through
> `SOS-GOV-AAPEC-V1` on 2026-07-29 and
> `C99-STUDIO-REVIEW-IDENTITY-ART-DIRECTION-PRODUCER-STOP-GATE-V1` on 2026-07-30.

## Purpose

This adopted model adds task-activated professional responsibility and review perspectives to the Studio Operating System. It supplements rather than replaces existing governance. Roles are not persistent autonomous people, a second management hierarchy, or permission to expand scope.

## Authority

- **Human Developer:** final product, taste, budget, purchase, scope-expansion, and approval authority.
- **ChatGPT Director:** orchestrates work, confirms scope, formulates assignments, activates appropriate review roles, and provides the consolidated recommendation.
- **Work:** implements the authorised scope, gathers evidence, performs the required independent role reviews, and corrects clear in-scope defects before handoff.
- **Specialist roles:** provide independent assessments within their disciplines. They may fail work but may not invent product direction, approve their own building work alone, or overrule higher authority.

The authority order in `AGENTS.md`, confirmed decisions, project standards, permission boundaries, and the Human approval boundary remain unchanged.

## Director / Work Execution Boundary

Director and Work are separate execution identities, not two labels that one
task may switch between for convenience. Before the first mutation and after
every task pivot, the active task must reclassify itself against the Director
Non-Execution Gate in `AGENTS.md`.

A Director may inspect read-only state, freeze scope, classify and route work,
prepare and validate a dispatch, create a separate Worker task, monitor it
cursor-based, activate the applicable separate Reviewer after reviewable
evidence exists, and consolidate results. A Director may not implement,
produce candidate-affecting test evidence, or correct the dispatched work.
Human authorisation or `go` authorises the exact dispatched scope; it does not
waive this boundary or authorise direct Director implementation. If separate
task creation or cursor-based monitoring is unavailable, the Director stops.

One separately created Worker owns implementation and freezes the exact
candidate and evidence. When independent review is required, at most one
decision-relevant Reviewer task is activated after that freeze. Its task
identity must differ from both Director and Worker. Builder self-review,
Director review of its own implementation, or a simulated role perspective is
not independent evidence.

For an independently reviewed passage, Producer consolidation requires the
prospective closure receipt defined by `Tools/AuthorityContinuity`. The receipt
must bind the exact Work Order, task identities, candidate, reviewed evidence
and verdict before `PASS` wording enters operational state. Missing, stale or
mismatched closure evidence is a blocking execution state, not a review result.

## Director Accountability and Applied Context

The Director owns per-task completeness without taking over implementation.
For each routed task, it connects the project objective to its exact
authoritative source, states the practical consequence of relevant rules,
names the accountable Worker, justifies model and reasoning routing for each
bounded subtask, supplies the minimum sufficient context, defines meaningful
output and evidence, records the escalation boundary, and remains responsible
for cursor-based monitoring and final consolidation. Listing or reading sources
is not evidence that their consequences were applied.

The Director reads every decision-relevant source far enough to support the
claim it makes and retrieves any relevant portion lost to truncation or an
incomplete read before declaring readiness. After a task pivot, it revalidates
the sources, assumptions, and risks affected by that pivot. Routine questions
and simple local changes do not require a repeated full bootstrap or unrelated
review when the relevant authority and risk surface have not changed.

## Role Types

### Core Governance Roles

- Human Developer
- ChatGPT Director
- Producer / Scope Controller
- Technical Director
- QA Lead

### Specialist Roles

- Art Director
- Game Design Reviewer
- Level Designer
- Technical Artist
- Asset & Provenance Manager
- Unity Specialist
- Camera & Occlusion Reviewer
- Gameplay QA Reviewer
- Performance Analyst
- UI/UX Reviewer
- Audio Reviewer
- Narrative / Worldbuilding Reviewer
- Release Reviewer

Not every role is active for every assignment. [The activation matrix](ROLE_ACTIVATION_MATRIX.md) defines the default minimum; the Producer records any task-specific addition or justified `NOT APPLICABLE` result before implementation.

## Operating Rules

1. A Builder may contribute implementation evidence but may not be the sole reviewer of that implementation.
2. Each activated mandatory stage-exit specialist produces a separate completed review using the [Role Review Output Schema](ROLE_REVIEW_OUTPUT_SCHEMA.md). Its record identifies the actual reviewer, whether that reviewer is separate from the Builder, the exact reviewed candidate, examined evidence, and one valid verdict. A role heading, Builder self-summary, Producer summary, or simulated perspective is not an independent review.
3. A technical test cannot override a visual, gameplay, accessibility, audio, provenance, or Human-review failure.
4. Roles evaluate against confirmed direction. They do not invent mechanics, art direction, architecture, budget, purchases, or release policy.
5. Cross-domain conflict is made visible and escalated to the Director; only a genuine product, taste, scope, budget, purchase, or equivalent Human decision is escalated to the Human Developer.
6. Roles do not create questions when one clear compliant solution exists inside the authorised scope.
7. All mandatory reviews occur before Producer consolidation and final handoff.
8. If a mandatory role identifies a defect that Work can clearly correct inside scope, Work corrects it and reruns affected reviews instead of handing the defect to the Human Developer.
9. Correction authorisation, stage locality, and consumption are defined by the [Execution Modes and Stage Review Standard](../Production/EXECUTION_MODES_AND_STAGE_REVIEW_STANDARD.md). This role model applies that declared allowance; a correction beyond it or an expanded solution requires a new assignment or Human direction.
10. Activate a role only when its distinct finding can change the current decision. Assignment labels and standing board membership are activation prompts, not reasons to request a redundant review.
11. A separate execution identity and context is mandatory for an activated stage-exit specialist when the Human requests independent reviewers, Art Direction or visual acceptance is active, the task is Critical, the verdict can change passage, or Builder assumptions could materially bias it. If this is technically unavailable, record `REVIEW NOT PERFORMED` as a blocking execution state; do not simulate independence. Routine deterministic Builder self-checks remain permitted when no independent specialist verdict is required.
12. Technical correctness, scene validity, test passage, object counts, or
    prefab instantiation cannot override a visual-purpose failure. Hostless or
    obstructive props, random dressing, unjustified visible placeholders,
    unproven broad modular use, unsupported modular-completeness claims, and
    visible overlap or z-fighting remain blocking visual findings.

## Stop and Escalation Boundary

Stop and escalate when correction requires a new product or taste decision, material scope expansion, budget or purchase, external download, new licence interpretation, protected-source change, architectural reversal, unsafe/destructive action, or a contradiction between authoritative sources. A role finding alone does not broaden permissions.

## Prospective Evidence Interpretation

This amendment applies only to new or materially revised Work Orders after its adoption. Historical evidence proves only that its documented attempt, observation, result, or decision record existed under its documented conditions; classification alone does not prove correctness, acceptance, authorisation, currency, reusability, production readiness, or a valid baseline. Reuse requires applicable current authority, explicit selection, and fresh validation. Historical packages are retained and are not rewritten to apply this model.

## Relationship to Existing Standards

- Visible work remains governed by [Visual Quality Assurance Workflow](../Visual/Visual_Quality_Assurance_Workflow.md).
- Role review sequence and correction behaviour are governed by [Review Board Protocol](REVIEW_BOARD_PROTOCOL.md).
- Role outputs use [Role Review Output Schema](ROLE_REVIEW_OUTPUT_SCHEMA.md).
- Task-Delta Work Orders use the [Task-Delta Work Order Role and Review Block](../Templates/WORK_ORDER_ROLE_AND_REVIEW_BLOCK.md).
