# Studio Operating System Documentation

This folder contains the project-independent documentation for the Studio Operating System.

The Studio Operating System defines how the Human Developer and AI Agents collaborate across AI-assisted solo game development projects.

## Source of Truth Documents

### PROJECT_PRINCIPLES.md

Defines the long-term principles for the AI-assisted development environment.

Use this document to understand the overall direction, values, and non-negotiable principles of the Studio Operating System.

### AI_DEVELOPMENT_RULES.md

Defines how AI Agents are expected to participate in development.

Use this document to understand AI responsibilities, limits, communication behavior, code generation expectations, testing, debugging, documentation, and security rules.

### PROJECT_TEMPLATE.md

Defines the standard high-level structure for game projects created under the Studio Operating System.

Use this document when creating or reviewing the structure of a game project. `Builds/` directories contain local playable or distributable artifacts and are intentionally excluded from normal Git tracking.

### Governance/STUDIO_DICTIONARY.md

Defines the shared terminology used throughout the Studio Operating System.

Use this document when a term needs one authoritative definition.

### Governance/GOVERNANCE_LIFECYCLE.md

Defines how governance ideas move from initial discussion to official adoption, validation, audit, and continuous improvement.

Use this document when a new rule, process, role, or standard may need to become part of the Studio Operating System.

### Visual/Visual_Quality_Assurance_Workflow.md

Defines the project-independent workflow for blind visual review, the reusable 0–5 quality matrix, camera coverage, runtime occlusion review, stage-local formal corrections, matched Before/After evidence, and the Human visual-approval boundary.

Use this document for the visible claims and risks of every assignment that creates or changes visible game content. Mode and stage determine the proportional scope; technical validation never substitutes for a required visual review.

### Roles/ROLE_OPERATING_MODEL.md

Defines the adopted lightweight specialist-role model, authority boundaries, independent review outputs, consolidation, anti-loop rules, and decision-relevant activation discipline.

Use it with the [Role Catalog](Roles/ROLE_CATALOG.md), [Role Activation Matrix](Roles/ROLE_ACTIVATION_MATRIX.md), [Role Review Output Schema](Roles/ROLE_REVIEW_OUTPUT_SCHEMA.md), and [Review Board Protocol](Roles/REVIEW_BOARD_PROTOCOL.md). The reusable Task-Delta Work Order role/review block is in [Templates/WORK_ORDER_ROLE_AND_REVIEW_BLOCK.md](Templates/WORK_ORDER_ROLE_AND_REVIEW_BLOCK.md).

### Visual/ART_BIBLE_STANDARD.md

Defines the minimum structure, ownership, evidence, and approval boundary for project art bibles without replacing project-specific art direction.

### Assets/ASSET_CANDIDATE_AND_INTEGRATION_STANDARD.md

Defines candidate classification, provenance, adaptation, package coverage, integration evidence, reimport safety, and release-readiness gates for external and internal assets.

### Level/LEVEL_DESIGN_REVIEW_STANDARD.md

Defines project-independent level-design review criteria for routes, scale, gameplay space, camera interaction, occlusion, boundaries, and evidence.

### Level/ENVIRONMENT_REALISM_REFERENCE_STANDARD.md

Defines a reference method for believable environment use, layering, wear, density, period coherence, and visible causality without imposing a universal style.

### Level/LEVEL_DEVELOPMENT_LIFECYCLE.md

Defines the mandatory ten-phase process and stop gates for new or structurally material AI-assisted level areas from Environmental Intent through Human Review. It keeps structural decisions ahead of asset integration and prevents later polish from hiding earlier failures. Ordinary production on an accepted baseline uses an applicable playbook and stage-exit review instead of restarting all ten phases.

Use it with [the Environmental Intent Standard](Level/ENVIRONMENTAL_INTENT_STANDARD.md), [the Urban and Functional Reasoning Standard](Level/URBAN_AND_FUNCTIONAL_REASONING_STANDARD.md), [the Level Decision Record](Templates/LEVEL_DECISION_RECORD_TEMPLATE.md), and [the New Map Slice process-validation template](Templates/NEW_MAP_SLICE_PROCESS_VALIDATION_WORK_ORDER_TEMPLATE.md). The initial separate-role assessment is recorded in the [Lifecycle Review Record](Level/LEVEL_DEVELOPMENT_LIFECYCLE_REVIEW.md).

### AI/AI_MODEL_ROUTING_AND_COMPUTE_EFFICIENCY_STANDARD.md

Defines provider-independent Routine, Standard, and Critical routing based on task risk, reversibility, ambiguity, context, and failed attempts. It also defines context envelopes, token-efficiency rules, review levels, and the current model-routing role gap.

### Research/CLAUDE_CODE_GAME_STUDIOS_ADOPTION_MATRIX.md

Records the source-based adoption, adaptation, and rejection decisions that informed this role and review framework. It is research evidence, not an independent authority over adopted Studio OS documents.

### Governance/GOVERNANCE_BACKLOG.md

Stores governance ideas, engineering principles, roles, processes, risks, and open questions that may be useful but are not yet adopted standards.

Use this document to track proposals and Parking Lot items without treating them as official rules.

## Layered Agent Instruction Architecture

### Production/EXECUTION_MODES_AND_STAGE_REVIEW_STANDARD.md

Defines the Layered Agent Instruction Architecture, Discovery / Production / Diagnostic / Integration mode selection, formal-review Definition of Ready, decision-relevant role activation, formative work, stage-local correction accounting, invalid-evidence treatment, and Task-Delta Work Order boundary. Adopted through LAIA-2026-07-22 on 2026-07-22.

Use it with the [Task-Delta Work Order Template](Templates/WORK_ORDER_ROLE_AND_REVIEW_BLOCK.md), a project Production Profile, and only the applicable playbook listed below.

The proposal reviews, bounded corrections, validation results, context proxies, and Human disposition are preserved in the [Layered Agent Instruction Architecture Review and Adoption Record](Production/LAYERED_AGENT_INSTRUCTION_ARCHITECTURE_REVIEW_AND_ADOPTION_RECORD.md).

### Playbooks/

Defines the adopted on-demand, provider-independent instructions for [Visual Production](Playbooks/VISUAL_PRODUCTION.md), [Unity Asset Assembly and Diagnostic Safety](Playbooks/UNITY_ASSET_ASSEMBLY_AND_DIAGNOSTIC_SAFETY.md), and [Baseline Integration and Commit Preparation](Playbooks/BASELINE_INTEGRATION_AND_COMMIT_PREPARATION.md). They are repository playbooks, not an unsupported Skills runtime, and do not grant task execution authority by themselves.

## Confirmed Decision Register

### CONFIRMED_DECISIONS.md

Records Human Developer-confirmed durable decisions that are not necessarily adopted governance standards.

Adopted Studio Operating System documents remain the highest project-independent authority. Approved project documentation may override a general confirmed decision within its explicitly defined project scope. The confirmed-decision register is authoritative for confirmed decisions within their stated scope and takes precedence over operational state, handover context, historical session material, and chat context.

## Operational Continuity Documents

### WORK_STATE.md

Records the concise current repository focus, active work, operational projections of relevant confirmed decisions, open decisions, risks, permissions, and next concrete step.

This is an operational state record, not an adopted governance standard.

### CURRENT_HANDOVER.md

Preserves concise transition context, restart instructions, unresolved items, and the exact next task for a new Director or Work session. The repository entry procedure is defined by `AGENTS.md`; this file supplements that procedure rather than replacing it.

This is an operational handover record, not an adopted governance standard.

## Repository Entry Point

The repository-root [`AGENTS.md`](../AGENTS.md) is the entry point for local AI agents. It identifies this documentation index, defines the authority order, and directs agents to read `WORK_STATE.md` before starting work.

## Session Archive

Historical handover material is stored under the repository-root `Sessions/` directory:

- `Sessions/SESSION_001.md`
- `Sessions/SESSION_002_START_PROMPT.txt`

These files preserve historical context. They are not official governance documents and should not override current Sources of Truth or operational state files.

## Information Classes

- Adopted governance defines official Studio Operating System standards.
- Confirmed decisions record durable Human Developer decisions within their stated scope.
- Operational state records current facts, active work, risks, permissions, and next actions.
- Handover context preserves the minimum transition information needed between sessions.
- Historical session material preserves prior context but is not authoritative.

## Working Rules

Conversation with the Human Developer should happen in German unless requested otherwise.

Repository documentation, Markdown files, code comments, and project files should use English unless a specific project requires otherwise.

Do not redefine authoritative terms outside the Studio Dictionary.

Do not treat backlog or Parking Lot items as adopted standards.

When a governance-related idea appears, either add it to the Governance Backlog, add it to the Parking Lot, or explicitly discard it.

When uncertain about a decision that affects architecture, security, governance, maintainability, scope, or long-term direction, ask before assuming.
