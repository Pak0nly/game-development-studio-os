# Repository Guide for AI Agents

This file is the local entry point for AI agents working in this repository. The documentation index is [`Docs/README.md`](Docs/README.md).

Before starting work, read [`Docs/WORK_STATE.md`](Docs/WORK_STATE.md) and [`Docs/CONFIRMED_DECISIONS.md`](Docs/CONFIRMED_DECISIONS.md). Read [`Docs/CURRENT_HANDOVER.md`](Docs/CURRENT_HANDOVER.md) when continuing work from another session or when the current task depends on recent context.

A Director or Work session must check the confirmed decisions relevant to its assigned task before planning or execution.

For a larger or cross-domain work order, the Director or Work session must also apply the adopted [`Role Operating Model`](Docs/Roles/ROLE_OPERATING_MODEL.md), select only the roles justified by the work, and include the [`Work Order Role and Review Block`](Docs/Templates/WORK_ORDER_ROLE_AND_REVIEW_BLOCK.md). Specialist findings are advisory inputs until the accountable builder or Producer consolidates them under the authority order below.

## Tool and Asset Capability Awareness

Before selecting, replacing, adapting or rejecting a material engine/editor
capability, tool, package, asset family, workflow or bespoke implementation,
consult the adopted
[`Tool and Asset Capability Knowledge Base Standard`](Docs/Knowledge/TOOL_AND_ASSET_CAPABILITY_KNOWLEDGE_BASE_STANDARD.md),
the current project's capability index, capability coverage register and its
asset inventory. Search by the problem and intended use, not only by a
remembered product name.

For Unity work, this query includes the project's Unity Native Capability
Atlas or equivalent. Built-in Editor windows, engine APIs, official packages,
installed modules and diagnostic tools must be considered before concluding
that custom code, an Asset Store product or a new dependency is necessary.

Use the smallest decision-relevant shortlist. Compare local proof, scoped
successes, scoped failures, untested variants, non-destructive adaptation and
likely technical debt. Do not generalise one failed preset, candidate or method
into a tool-wide rejection. When one missing fact controls the decision,
refresh that fact through the smallest safe check instead of treating ordinary
uncertainty or a banal tool hurdle as a terminal blocker.

At task closure, consolidate only durable capability learning into the
project Knowledge Base and link its exact evidence. The Knowledge Base is
operational documentation, not execution authority or an AI training,
embedding, evaluation or cross-user reference corpus.

## Director Non-Execution Gate

Before the first mutation and after every task pivot, classify whether the
current task is acting as Director or Work. A Director is orchestration-only.
Human authorisation, including `go`, authorises the exact scope for dispatch;
it never authorises the Director to implement that scope directly.

In Director mode, only read-only inspection, scope and routing preparation,
dispatch validation, creation of a separate Worker task, cursor-based task
monitoring, result consolidation, and already authorised operational-state
maintenance are permitted. Every implementation, test-producing mutation and
candidate-affecting correction must occur in the separately created Worker
task. If separate-task tooling is unavailable, stop and report the missing
capability; never fall back to Director self-execution.

For each new mutation-capable dispatch, use the prospective orchestration
manifest and immutable receipt procedure in `Tools/AuthorityContinuity`. The
manifest must prove Director non-execution, one separate Worker task, justified
model and reasoning routing, cursor-based monitoring, and the applicable
independent-review requirement. A Builder self-review is not independent.

After reviewable Worker evidence exists, activate at most one
decision-relevant independent Reviewer task. An independently reviewed `PASS`
must not enter `Docs/WORK_STATE.md` or `Docs/CURRENT_HANDOVER.md` until the
closure validator binds the exact Work Order, Director/Worker/Reviewer task
identities, candidate, evidence and verdict in an immutable closure receipt.
Missing, stale, self-authored or mismatched closure evidence fails closed.

## Director Task Monitoring

When a Director creates a separate task and retains responsibility to analyse or report its result, the Director keeps the current planning turn active and uses task waiting or status tools until the task completes or needs Human attention. Relay only material progress, blockers, and completion; avoid noisy unchanged polling. On completion, inspect the result and report it in the planning chat. If monitoring cannot continue, state that explicitly; starting a task alone is not active monitoring.

## Director Dispatch Gate

A Director must not send a raw separate project-task dispatch that can mutate
repository or project state. Before dispatch, the Director must validate one
compact Work Order manifest with
`Tools/AuthorityContinuity/validate_director_dispatch.py verify-director` and
attach the resulting receipt to that exact Work Order. The manifest references
and hashes current canonical sources; it does not copy their unchanged prose.

Before any task mutation, the receiving Worker must run `verify-worker` against
the exact manifest, receipt, Work Order bytes, live capabilities, repository
and project identity, source hashes, and technical baseline proofs. Missing,
stale, mismatched, or reused-for-another-task receipts fail closed. The gate
does not extend permissions, replace Human
authority, or claim security against a malicious danger-full-access agent. An
exact Human waiver for one named dispatch must be explicit and creates no
standing exception.

## Operational Recovery Before Terminal Stop

Do not treat a raw process, tool, launch or capture count as a candidate
attempt or terminal domain failure when the task never reached its declared
attempt-start condition. Future Task-Delta Work Orders and Workers must apply
the separate setup, operational-recovery, candidate-attempt and formal-
correction accounting defined by the adopted
[`Execution Modes and Stage Review Standard`](Docs/Production/EXECUTION_MODES_AND_STAGE_REVIEW_STANDARD.md).

Within the exact existing authority and recovery allowance, Work repairs a
proven pre-candidate compile, import, launch, wrapper, tool, output-guard or
evidence-path error automatically when protected state remains exact, no
candidate-affecting mutation occurred or it was exactly restored, output
ownership is unambiguous, and one concrete execution condition changes.
Operational recovery never permits a blind retry, guard weakening, uncertain
cleanup, scope or method change, protected-source mutation, or authority
expansion. A repaired operational error is not an asset, gameplay, visual or
candidate failure.

## Cross-Chat Bootstrap and Task Closure

This contract links existing owners; it does not replace or restate their substantive rules.

### New-Chat Bootstrap

Before planning or mutation:

1. Identify the exact repository/project and Work Order.
2. Read `AGENTS.md`, [`Docs/WORK_STATE.md`](Docs/WORK_STATE.md), and [`Docs/CURRENT_HANDOVER.md`](Docs/CURRENT_HANDOVER.md).
3. Read the exact confirmed decisions in [`Docs/CONFIRMED_DECISIONS.md`](Docs/CONFIRMED_DECISIONS.md), adopted standards indexed by [`Docs/README.md`](Docs/README.md), project profile, and evidence named by the task or operational state. For a material engine/editor capability, tool, asset, workflow or implementation choice, also query the project capability index, capability coverage register, native-capability atlas where applicable, and asset inventory.
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
