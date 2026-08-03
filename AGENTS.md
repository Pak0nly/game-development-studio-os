# Repository Guide for AI Agents

This file is the local entry point for AI agents working in this repository. The documentation index is [`Docs/README.md`](Docs/README.md).

Before starting work, read [`Docs/WORK_STATE.md`](Docs/WORK_STATE.md) and [`Docs/CONFIRMED_DECISIONS.md`](Docs/CONFIRMED_DECISIONS.md). Read [`Docs/CURRENT_HANDOVER.md`](Docs/CURRENT_HANDOVER.md) when continuing work from another session or when the current task depends on recent context.

A Director or Work session must check the confirmed decisions relevant to its assigned task before planning or execution.

For a larger or cross-domain work order, the Director or Work session must also apply the adopted [`Role Operating Model`](Docs/Roles/ROLE_OPERATING_MODEL.md), select only the roles justified by the work, and include the [`Work Order Role and Review Block`](Docs/Templates/WORK_ORDER_ROLE_AND_REVIEW_BLOCK.md). Specialist findings are advisory inputs until the accountable builder or Producer consolidates them under the authority order below.

## Cross-Chat Bootstrap and Task Closure

This contract links existing owners; it does not replace or restate their substantive rules.

### New-Chat Bootstrap

Before planning or mutation:

1. Identify the exact repository/project and Work Order.
2. Read `AGENTS.md`, [`Docs/WORK_STATE.md`](Docs/WORK_STATE.md), and [`Docs/CURRENT_HANDOVER.md`](Docs/CURRENT_HANDOVER.md).
3. Read the exact confirmed decisions in [`Docs/CONFIRMED_DECISIONS.md`](Docs/CONFIRMED_DECISIONS.md), adopted standards indexed by [`Docs/README.md`](Docs/README.md), project profile, and evidence named by the task or operational state.
4. Verify the repository/project, branch, HEAD, active task, status, stop boundary, protected paths, and allowed mutation paths.
5. Compare operational projections with their cited canonical sources and verified repository state.
6. If scope is cross-domain, relevance is uncertain, a source is missing, or live sources conflict, expand to the complete relevant authority set and stop mutation until the contradiction is recorded and resolved.

### Task-Pivot Revalidation

When a chat pivots from bootstrap or audit into architecture, render-pipeline,
repository, asset, purchase, or production advice, reclassify the task before
giving that advice or mutating files. Re-freeze the authority scope, applicable
canonical sources and evidence, current data status, and required reviewers.
A recommendation may not contradict the confirmed bootstrap without a new
authoritative decision. If the sources conflict or the new scope is unclear,
stop and report the conflict instead of interpreting it away.

### Task Closure

Before final handoff:

1. Classify durable findings and place them only in their authorised canonical owner identified through [`Docs/README.md`](Docs/README.md).
2. Freeze exact task evidence, reviewer evidence, conflicts, correction trace, and Human checkpoint.
3. Replace [`Docs/WORK_STATE.md`](Docs/WORK_STATE.md) with one compact present state rather than appending chronology.
4. Replace [`Docs/CURRENT_HANDOVER.md`](Docs/CURRENT_HANDOVER.md) with the smallest restart-critical context and one next action.
5. Perform the applicable consistency checks.
6. Stop at the named checkpoint without inferring authority for later work.

## Authority Order

When information conflicts, use this order of authority:

1. adopted Studio Operating System documents
2. approved project documents within their defined project scope
3. [`Docs/CONFIRMED_DECISIONS.md`](Docs/CONFIRMED_DECISIONS.md)
4. verified repository state
5. [`Docs/WORK_STATE.md`](Docs/WORK_STATE.md)
6. [`Docs/CURRENT_HANDOVER.md`](Docs/CURRENT_HANDOVER.md)
7. historical session files
8. current chat context

Proposals, assumptions, Governance Backlog items, and Parking Lot items are not adopted standards. Do not apply them as rules unless their adoption is confirmed by an authoritative document.

Report unresolved contradictions, including the conflicting sources and practical impact. Do not guess which source should prevail.

A Director Sync Report is incomplete if confirmed decisions relevant to the next phase are missing, ambiguous, or represented only in chat, historical session files, or the Governance Backlog.

Conversation about this repository should be in German unless the Human Developer requests otherwise. Repository content, including documentation, Markdown, code comments, and project files, should be in English unless a specific project requires otherwise.

## Standing Maintenance Permission

AI agents may autonomously update only:

- `Docs/WORK_STATE.md`
- `Docs/CURRENT_HANDOVER.md`

This maintenance is permitted when:

- a relevant task starts or ends
- the active task, next step, blocker, risk, permission scope, or repository state materially changes
- a session handover is being prepared
- a new session has verified and resumed the previous state

Maintenance must remain within the decision, documentation, permission, and risk boundaries defined by [`Docs/AI_DEVELOPMENT_RULES.md`](Docs/AI_DEVELOPMENT_RULES.md). These operational files record state and context; they do not adopt governance rules or override higher-authority sources.

This standing permission does not authorize modifications to any other file. Changes to all other files remain task-specific and require explicit task scope or approval.
