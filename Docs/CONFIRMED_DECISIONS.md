# Confirmed Decisions

## Purpose and Authority

This document stores Human Developer-confirmed durable decisions that are not necessarily adopted Studio Operating System governance standards. It is the authoritative source for confirmed Studio OS, environment, workflow, and project decisions within each entry's stated scope.

Adopted Studio Operating System documents override this record. Approved project documentation may override a general decision within its explicitly defined project scope.

For confirmed decisions, this record overrides `WORK_STATE.md`, `CURRENT_HANDOVER.md`, historical session files, and chat context.

Confirmed entries cannot be changed, removed, or marked superseded without Human Developer confirmation or an applicable adopted governance process. AI agents may update references and operational projections, but may not silently change the substance or status of confirmed decisions.

Proposals, assumptions, open decisions, operational status, and governance standards must remain distinguishable from confirmed decisions.

## Confirmed Decisions

### DEC-001 â€” Reference Operating System

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** Windows 11 is the reference operating system.
**Implications:** Environment setup, validation, and automation should target Windows 11 unless a narrower approved scope states otherwise.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-002 â€” Primary Unity Baseline

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** Unity 6.3 LTS is the primary engine baseline.
**Implications:** Unity setup, tooling, automation, and validation should use this baseline by default.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-003 â€” Unity Baseline Replacement

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** Newer Unity releases may be evaluated separately, but replacing the primary baseline requires explicit Human Developer approval.
**Implications:** Evaluation does not silently change the baseline recorded in DEC-002.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-004 â€” AI-Assisted Solo Studio

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** The environment is optimized for an AI-assisted solo studio.
**Implications:** Workflows should prioritize effective collaboration between the Human Developer and AI agents.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-005 â€” Human Collaboration Plan

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** Additional human collaborators are not currently planned.
**Implications:** Current processes do not need to optimize for a multi-person human team, without prohibiting a future confirmed change.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-006 â€” Specialized AI Agents

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** Specialized AI agents may be introduced when justified by concrete value, scope, or capability needs.
**Implications:** New agent roles require a specific justification and are not introduced by default.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-007 â€” Director Instance

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** ChatGPT is intended to act primarily as the Director instance.
**Implications:** ChatGPT should coordinate direction and continuity while other execution roles may be delegated when justified.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-008 â€” Initial Autonomy Level

**Status:** Confirmed
**Scope:** Workflow
**Confirmed decision:** The initial autonomy level is B.
**Implications:** Work begins at level B; the detailed meaning and operating rules of the level must come from applicable authoritative definitions when established.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-009 â€” Autonomy Progression Target

**Status:** Confirmed
**Scope:** Workflow
**Confirmed decision:** The target progression is autonomy level C and then level D after validation.
**Implications:** Progression is sequential and evidence-based; this decision does not itself define validation criteria or authorize promotion.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-010 â€” Local-First Git Work

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** Git work is local-first.
**Implications:** Local repository work remains the default while the private remote and backup model is unresolved.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-011 â€” Least-Privilege Workspace Access

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** Agents receive least-privilege access only to required workspaces.
**Implications:** Access should be limited to the minimum workspaces and permissions needed for the assigned task.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-012 â€” Paid API Approval

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** Paid API calls require explicit Human Developer approval.
**Implications:** No agent may initiate a paid API call based only on task convenience or implied permission.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-013 â€” External Download Approval

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** External downloads require explicit Human Developer approval.
**Implications:** Agents must obtain approval before downloading external files, packages, repositories, or other artifacts.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-014 â€” New Tool Installation Approval

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** Installation of new tools requires explicit Human Developer approval.
**Implications:** Tool installation must not be inferred from permission to perform a task.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-015 â€” Unity Automation Requirement

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** Unity automation is a core long-term requirement.
**Implications:** Development-environment decisions should preserve a path toward substantial Unity automation.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-016 â€” First Workflow Validation Project

**Status:** Confirmed
**Scope:** Project
**Confirmed decision:** The first workflow validation project is a simple Match-3 game.
**Implications:** The first project should remain simple enough to isolate and validate the workflow.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-017 â€” Second Workflow Validation Project

**Status:** Confirmed
**Scope:** Project
**Confirmed decision:** A simple jump-and-run follows as the second, more complex workflow test.
**Implications:** The second test should extend the validated workflow with greater implementation complexity.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-018 â€” Primary First-Test Success Criterion

**Status:** Confirmed
**Scope:** Workflow
**Confirmed decision:** Workflow autonomy is the primary success criterion of the first workflow validation test.
**Implications:** Evaluation of the Match-3 test should prioritize how independently and reliably the governed workflow operates.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-019 â€” Secondary First-Test Output Criterion

**Status:** Confirmed
**Scope:** Workflow
**Confirmed decision:** Output quality is secondary during the first workflow validation test.
**Implications:** Output quality remains relevant but must not displace workflow-autonomy validation as the primary objective.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-020 â€” Later 3D Pipeline Integration

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** The AI-orchestrated 3D asset pipeline is intended for later evaluation and integration during development-environment setup.
**Implications:** This confirms the direction and timing only. Its detailed architecture, workflow, permissions, quality gates, and governance status remain proposed and unresolved. The existing Governance Backlog item remains valid and is not contradicted.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-021 â€” Initial Blender Execution Agent

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** Claude is the preferred initial Blender execution agent.
**Implications:** Initial pipeline evaluation should prefer Claude for Blender execution without making it a permanent dependency.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-022 â€” Provider Independence

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** The architecture should avoid unnecessary provider lock-in.
**Implications:** Interfaces, briefs, validation rules, artifacts, and workflows should remain provider-independent where practical.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-023 â€” Private Git Remote and Backup Model

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** The Studio Operating System repository and future studio repositories use GitHub private repositories as their primary managed Git remote.

Local-first Git remains the standard working model. The local repository is the active development workspace. The remote provides an external Git replica, recovery capability, and a controlled integration point for future workflows.

Each active repository must additionally have an independent encrypted backup stored on a separate physical storage device that is not permanently connected to the development machine.

The minimum operating model is:

- approved commits are pushed to the private remote at the end of each completed work session or coherent approved change set;
- an encrypted offline backup is created at least weekly and after significant milestones;
- backup copies must include the complete Git history;
- recovery must be tested after initial setup and periodically thereafter;
- a Git remote alone is not treated as a complete backup;
- generated files, caches, temporary files, and reproducible builds remain excluded unless a separate decision explicitly includes them;
- large binary assets, Git LFS, build archives, and non-Git asset storage require a separate evaluation when an actual project creates that need.

AI Agents receive no standing access to the remote by default.

Remote creation, credential creation, remote configuration, pushes, permission changes, and any future AI Agent remote access require explicit Human Developer authorization unless a narrower standing permission is adopted later.

Any future AI Agent remote access must follow least privilege and should be task-specific, time-limited, and restricted to the minimum required repository and permission level.

The GitHub account used for studio repositories must use strong multi-factor authentication or passkeys. Recovery credentials must be stored separately from the primary development machine.

**Implications:** This decision does not authorize paid services, new tool installation, external downloads, account creation, credential creation, remote configuration, or the initial push. Those remain separate implementation actions requiring explicit Human Developer approval.
**Human confirmation source:** Human Developer confirmation after Continuity Version 2 validation
**Supersedes:** None
