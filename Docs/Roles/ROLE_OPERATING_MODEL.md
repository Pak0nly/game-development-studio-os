# Role Operating Model

## Purpose

This adopted model adds task-activated professional responsibility and review perspectives to the Studio Operating System. It supplements rather than replaces existing governance. Roles are not persistent autonomous people, a second management hierarchy, or permission to expand scope.

## Authority

- **Human Developer:** final product, taste, budget, purchase, scope-expansion, and approval authority.
- **ChatGPT Director:** orchestrates work, confirms scope, formulates assignments, activates appropriate review roles, and provides the consolidated recommendation.
- **Work:** implements the authorised scope, gathers evidence, performs the required independent role reviews, and corrects clear in-scope defects before handoff.
- **Specialist roles:** provide independent assessments within their disciplines. They may fail work but may not invent product direction, approve their own building work alone, or overrule higher authority.

The authority order in `AGENTS.md`, confirmed decisions, project standards, permission boundaries, and the Human approval boundary remain unchanged.

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
2. Each mandatory role produces a separate review using the [Role Review Output Schema](ROLE_REVIEW_OUTPUT_SCHEMA.md). A combined summary is not a substitute.
3. A technical test cannot override a visual, gameplay, accessibility, audio, provenance, or Human-review failure.
4. Roles evaluate against confirmed direction. They do not invent mechanics, art direction, architecture, budget, purchases, or release policy.
5. Cross-domain conflict is made visible and escalated to the Director; only a genuine product, taste, scope, budget, purchase, or equivalent Human decision is escalated to the Human Developer.
6. Roles do not create questions when one clear compliant solution exists inside the authorised scope.
7. All mandatory reviews occur before Producer consolidation and final handoff.
8. If a mandatory role identifies a defect that Work can clearly correct inside scope, Work corrects it and reruns affected reviews instead of handing the defect to the Human Developer.
9. Work may conduct at most two autonomous correction rounds. A third round or expanded solution requires a new assignment or Human direction.
10. A role may be performed in the same Work run as implementation, but the review must be a distinct evidence-based assessment. When practical, use a separate context or reviewer; when not practical, explicitly separate Builder assumptions from reviewer findings.

## Stop and Escalation Boundary

Stop and escalate when correction requires a new product or taste decision, material scope expansion, budget or purchase, external download, new licence interpretation, protected-source change, architectural reversal, unsafe/destructive action, or a contradiction between authoritative sources. A role finding alone does not broaden permissions.

## Relationship to Existing Standards

- Visible work remains governed by [Visual Quality Assurance Workflow](../Visual/Visual_Quality_Assurance_Workflow.md).
- Role review sequence and correction behaviour are governed by [Review Board Protocol](REVIEW_BOARD_PROTOCOL.md).
- Role outputs use [Role Review Output Schema](ROLE_REVIEW_OUTPUT_SCHEMA.md).
- Work orders use [Work Order Role and Review Block](../Templates/WORK_ORDER_ROLE_AND_REVIEW_BLOCK.md).
