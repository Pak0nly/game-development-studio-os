# Repository Guide for AI Agents

This file is the local entry point for AI agents working in this repository. The documentation index is [`Docs/README.md`](Docs/README.md).

Before starting work, read [`Docs/WORK_STATE.md`](Docs/WORK_STATE.md). Read [`Docs/CURRENT_HANDOVER.md`](Docs/CURRENT_HANDOVER.md) when continuing work from another session or when the current task depends on recent context.

## Authority Order

When information conflicts, use this order of authority:

1. adopted Studio Operating System documents
2. approved project documents
3. verified repository state
4. [`Docs/WORK_STATE.md`](Docs/WORK_STATE.md)
5. [`Docs/CURRENT_HANDOVER.md`](Docs/CURRENT_HANDOVER.md)
6. current chat context

Proposals, assumptions, Governance Backlog items, and Parking Lot items are not adopted standards. Do not apply them as rules unless their adoption is confirmed by an authoritative document.

Report unresolved contradictions, including the conflicting sources and practical impact. Do not guess which source should prevail.

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
