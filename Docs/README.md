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

Defines the adopted project-independent workflow for blind visual review, the reusable 0–5 quality matrix, camera coverage, runtime occlusion review, two bounded internal correction rounds, matched Before/After evidence, and the Human visual-approval boundary.

Use this document for every assignment that creates or changes visible game content. Technical validation never substitutes for this workflow.

### Roles/ROLE_OPERATING_MODEL.md

Defines the adopted lightweight specialist-role model, authority boundaries, independent review outputs, consolidation, anti-loop rules, and activation discipline for larger or cross-domain work.

Use it with the [Role Catalog](Roles/ROLE_CATALOG.md), [Role Activation Matrix](Roles/ROLE_ACTIVATION_MATRIX.md), [Role Review Output Schema](Roles/ROLE_REVIEW_OUTPUT_SCHEMA.md), and [Review Board Protocol](Roles/REVIEW_BOARD_PROTOCOL.md). The reusable work-order block is in [Templates/WORK_ORDER_ROLE_AND_REVIEW_BLOCK.md](Templates/WORK_ORDER_ROLE_AND_REVIEW_BLOCK.md).

### Visual/ART_BIBLE_STANDARD.md

Defines the minimum structure, ownership, evidence, and approval boundary for project art bibles without replacing project-specific art direction.

### Assets/ASSET_CANDIDATE_AND_INTEGRATION_STANDARD.md

Defines candidate classification, provenance, adaptation, package coverage, integration evidence, reimport safety, and release-readiness gates for external and internal assets.

### Level/LEVEL_DESIGN_REVIEW_STANDARD.md

Defines project-independent level-design review criteria for routes, scale, gameplay space, camera interaction, occlusion, boundaries, and evidence.

### Level/ENVIRONMENT_REALISM_REFERENCE_STANDARD.md

Defines a reference method for believable environment use, layering, wear, density, period coherence, and visible causality without imposing a universal style.

### Research/CLAUDE_CODE_GAME_STUDIOS_ADOPTION_MATRIX.md

Records the source-based adoption, adaptation, and rejection decisions that informed this role and review framework. It is research evidence, not an independent authority over adopted Studio OS documents.

### Governance/GOVERNANCE_BACKLOG.md

Stores governance ideas, engineering principles, roles, processes, risks, and open questions that may be useful but are not yet adopted standards.

Use this document to track proposals and Parking Lot items without treating them as official rules.

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
