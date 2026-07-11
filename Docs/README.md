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

### Governance/GOVERNANCE_BACKLOG.md

Stores governance ideas, engineering principles, roles, processes, risks, and open questions that may be useful but are not yet adopted standards.

Use this document to track proposals and Parking Lot items without treating them as official rules.

## Operational Continuity Documents

### WORK_STATE.md

Records the concise current repository focus, active work, confirmed decisions, open decisions, risks, permissions, and next concrete step.

This is an operational state record, not an adopted governance standard.

### CURRENT_HANDOVER.md

Provides the minimum context and exact restart procedure required for a new ChatGPT or Work session to continue without reading the old chat.

This is an operational handover record, not an adopted governance standard.

## Repository Entry Point

The repository-root [`AGENTS.md`](../AGENTS.md) is the entry point for local AI agents. It identifies this documentation index, defines the authority order, and directs agents to read `WORK_STATE.md` before starting work.

## Session Archive

Historical handover material is stored under the repository-root `Sessions/` directory:

- `Sessions/SESSION_001.md`
- `Sessions/SESSION_002_START_PROMPT.txt`

These files preserve historical context. They are not official governance documents and should not override current Sources of Truth or operational state files.

## Working Rules

Conversation with the Human Developer should happen in German unless requested otherwise.

Repository documentation, Markdown files, code comments, and project files should use English unless a specific project requires otherwise.

Do not redefine authoritative terms outside the Studio Dictionary.

Do not treat backlog or Parking Lot items as adopted standards.

When a governance-related idea appears, either add it to the Governance Backlog, add it to the Parking Lot, or explicitly discard it.

When uncertain about a decision that affects architecture, security, governance, maintainability, scope, or long-term direction, ask before assuming.
