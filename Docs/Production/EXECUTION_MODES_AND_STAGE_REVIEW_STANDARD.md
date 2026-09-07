# Execution Modes and Stage Review Standard

**Status:** Adopted through LAIA-2026-07-22 on 2026-07-22; amended through
`SOS-GOV-AAPEC-V1` on 2026-07-29 and
`SOS-GOV-OPERATIONAL-RECOVERY-AND-CANDIDATE-ATTEMPT-ACCOUNTING-V1` on
2026-08-22.

The mode, readiness, activation, correction, template, profile, and playbook amendments linked from this document form one adopted package. Adoption does not itself grant task, production, Unity, or Git authority.

## Purpose and Authority

This document is the Studio OS consolidation point for selecting an execution mode, deciding whether the Level Development Lifecycle applies, preparing a candidate for formal review, selecting only decision-relevant reviewers, and accounting for stage-local corrections.

It does not redefine the authority order, permissions, model routing, evidence semantics, specialist authority, visual quality thresholds, asset protection, or Git boundaries. Those remain authoritative in `AGENTS.md`, the [AI Development Rules](../AI_DEVELOPMENT_RULES.md), the [AI Model Routing and Compute Efficiency Standard](../AI/AI_MODEL_ROUTING_AND_COMPUTE_EFFICIENCY_STANDARD.md), the [Role Operating Model](../Roles/ROLE_OPERATING_MODEL.md), the [Visual Quality Assurance Workflow](../Visual/Visual_Quality_Assurance_Workflow.md), and the [Asset Candidate and Integration Standard](../Assets/ASSET_CANDIDATE_AND_INTEGRATION_STANDARD.md).

## Layered Agent Instruction Architecture

1. **Studio OS Core:** stable project-independent authority, permissions, routing, Git, evidence, review, diagnosis, and correction semantics.
2. **Project Production Profile:** accepted project baselines, canonical working environments, frozen systems, project asset boundaries, accepted concerns, and current context.
3. **On-Demand Playbooks:** reusable instructions loaded only when their task type applies.
4. **Task-Delta Work Order:** the assignment-specific objective, baseline, allowed delta, current findings, completion criteria, applicable playbooks and context records, final reviews, correction allowance, and Human checkpoint.

A Task-Delta Work Order references the upper layers. It does not copy their unchanged rules.

The repository currently defines playbooks, not a repository-local Skills runtime. A Task-Delta Work Order may name a skill only when an available mechanism is separately documented and usable in the active environment.

## AI-Agent Applicability Boundary

The Layered Agent Instruction Architecture governs AI-agent work and is not an implementation of Lean Management or the Toyota Production System. Context is selectively curated, not blindly minimised; work duration may be measured but is not hard-capped; controlled independent verification remains valid when it covers a distinct failure class; and redundancy is removed only when it contributes no distinct risk reduction. Agent reasoning must not be replaced by mechanical checklist compliance. A production-mutation stop blocks candidate changes, bounded technical recovery repairs evidence or tool state within existing authority, and a terminal assignment stop ends further task action except factual handback. Parallel agent execution is encouraged when tasks are independent and the integration boundary is clear.

## Proportionality and Nonterminal Scope

Before expanding process, roles, documents, tooling, or validation, perform a relevance and proportionality check. A simple local documentation clarification remains a simple change with targeted deterministic checks unless it materially changes authority, permissions, architecture, or enforcement. Activate only reviewers whose distinct finding can change the decision; governance subject matter alone does not require a review board.

A task stop, Human checkpoint, exhausted candidate or stage corrections, report completion, or filename does not establish terminal closure of the subject. Negative findings apply only to the exact candidate, configuration, and claim unless representative family-wide coverage was predeclared and proven; unknown or untested variants remain open. Use `INTERIM_REPORT.md`, `STAGE_REPORT.md`, or `TASK_CLOSURE_REPORT.md` for nonterminal scopes. Generic `FINAL_REPORT.md` is not permitted for continuing or open subject evaluation.

## Execution-Mode Selection

The Producer / Scope Controller selects one primary mode before work begins. A bounded task may contain subordinate tasks in another mode, but each one keeps its own outcome and stop condition.

| Mode | Use | Required outcome | Review boundary |
|---|---|---|---|
| `Discovery` | Research, inventory, comparison, reference gathering, and option framing without production mutation | Traceable findings, unknowns, and decision surface | Proportionate factual verification; no creative stage-exit verdict unless the Task-Delta Work Order explicitly creates a review candidate |
| `Production` | A bounded content or implementation delta on an accepted baseline, or a separately Human-authorised correction of one preserved failed-stage candidate | One candidate satisfying the named stage Definition of Ready | One meaningful stage-exit review using only roles whose distinct finding can change the decision |
| `Diagnostic` | Reproduce, isolate, classify, and verify a causal failure | A causal diagnosis, evidence validity disposition, and safe next decision | Technical and causal review only; stop without unrelated creative review or implementation unless separately authorised |
| `Integration` | Combine an accepted baseline with approved changes or dependencies and verify closure, serialization, provenance, regression, and publication readiness | An integrity result and exact candidate/diff identity | Technical integrity checks only; no unrelated art, gameplay, or full-board review |

New level areas and structurally material revisions use `Production` mode with the complete [Level Development Lifecycle](../Level/LEVEL_DEVELOPMENT_LIFECYCLE.md). Ordinary bounded production on an accepted baseline does not restart that lifecycle. If a bounded change exposes or requires structural work, stop, reopen the earliest affected lifecycle gate, and obtain any missing authority.

## Definition of Ready for Formal Review

Formal review begins only when all applicable conditions are satisfied:

- one exact, preserved candidate is identified;
- the authorised baseline and allowed delta are verified;
- relevant formative work is complete;
- required technical checks pass or are explicitly classified as a blocker;
- evidence is current, belongs to the candidate, and is semantically suitable for each review claim;
- the review questions, activated roles, hard fails, and correction allowance are recorded; and
- for visible environment work, location function, usage story, circulation,
  access, qualified asset vocabulary, modular proof state, prop hosts, and any
  controlled visible placeholders are recorded in the Task-Delta Work Order;
  and
- no unresolved authority, scope, protected-source, or candidate-identity conflict prevents a verdict.

Before this point, work is formative. Formative edits, previews, capture-health checks, and evidence repairs do not create immutable final packages, formal verdicts, or correction counts after every small change.

## Review Selection and Independence

A role is activated only when its distinct finding can change the current decision. Producer / Scope Controller and QA Lead remain mandatory for larger or Critical work as defined by the [Role Activation Matrix](../Roles/ROLE_ACTIVATION_MATRIX.md). Specialists are added for the material risks and claims of the current stage.

After Definition of Ready, independent specialist reviews should run in parallel where practical against the same candidate ID and evidence manifest. Reviews remain separate and use the [Role Review Output Schema](../Roles/ROLE_REVIEW_OUTPUT_SCHEMA.md). A `FAIL` is not averaged or overruled.

Sol synthesis is requested only under the documented routing exception for an authority conflict, material design judgment, complex causal conflict, contradictory valid evidence, or final accountable synthesis. It is not an automatic stage-exit reviewer.

## Stage-Local Correction Accounting

Each Task-Delta Work Order names `0`, `1`, or `2` formal correction rounds for one exact review stage. The allowance is local to that stage and does not create a global project budget or silently consume the allowance of an independent stage.

A formal correction round is consumed only when:

1. a Definition-of-Ready candidate receives a valid formal review;
2. the review identifies a clear in-scope defect; and
3. Work mutates the candidate in response to that finding.

The following are recorded but do not consume a creative correction round:

- formative iteration before formal review;
- a failed tool invocation;
- an invalid, blank, duplicated, stale, mismatched, or semantically unsuitable capture;
- repair or regeneration of evidence that did not establish a valid verdict; and
- a no-candidate diagnostic precondition failure.

Evidence failure does not authorise repeated blind retries. Diagnose it, apply the applicable attempt limit and stop rule, and restore or revalidate candidate identity before further mutation.

After correction, regenerate only affected evidence and rerun only roles whose evidence or finding can have changed. A further correction beyond the declared stage allowance, or one requiring new scope, architecture, product direction, assets, licence interpretation, protected-source change, purchase, download, or Git authority, stops for Human direction.

## Operational Recovery and Candidate-Attempt Accounting

Operational setup, operational recovery, candidate attempts, and formal
creative corrections are separate accounting classes. A raw process, tool or
launch count must not by itself convert a pre-candidate operational failure
into a terminal candidate result.

A candidate attempt begins only after the task records an unambiguous
attempt-start event and all task-declared authority, identity, process,
protected-source, output-ownership and pre-mutation guards have passed. The
attempt-start event occurs immediately before the first domain-relevant action
that can create, mutate or evaluate the candidate. For a read-only evaluation,
it occurs immediately before the evaluated operation begins. A process that
only imports, compiles, warms a runtime, discovers tools or exits before that
event is operational setup or an operational error, not a candidate attempt.

Examples of pre-attempt operational errors include:

- compile or import completion without entry-point dispatch;
- launcher, quoting, argument, wrapper, IPC or tool-discovery failure;
- a task-owned log, status, quarantine or manifest file falsely triggering an
  output-collision guard;
- an invalid capture or evidence transaction that establishes no verdict;
- failure to reach a declared candidate precondition; and
- another invocation failure that produces no candidate-affecting mutation.

Work automatically repairs an operational error within the existing Work
Order when all of the following remain true:

1. authority, repository, project, baseline and protected-source identities
   remain exact;
2. no candidate-affecting mutation occurred, or the exact task-owned mutation
   was transactionally restored and reverified;
3. output ownership is unambiguous and cleanup affects only task-owned
   disposable state;
4. the cause is identified and the repair changes one concrete execution
   condition;
5. the repair does not change product intent, method, architecture, scope,
   permissions, dependencies or acceptance criteria; and
6. process, lock and tool state are clean before continuation.

Unless a Human-authorised Work Order declares a different bound, at most two
operational recovery actions are available for one bounded task. Planned
setup operations do not consume that allowance. The same unchanged failure
may not be repeated, and operational recovery never weakens a guard, invents
authority, overwrites uncertain output or expands a candidate/correction
budget.

A Work Order must state separately:

- planned setup or warm-up operations;
- the exact candidate-attempt start condition;
- candidate-attempt allowance;
- operational-recovery allowance;
- formal stage-correction allowance; and
- task-owned log, run-state, quarantine, candidate, retained-evidence and
  archive namespaces plus their cleanup authority.

Stop operational recovery on protected or unexplained drift, uncertain output
ownership, inability to restore pre-attempt state, a required scope or method
change, repetition without a changed condition, or exhaustion of the
operational-recovery allowance. These are real execution blockers. A repaired
pre-attempt operational error is not reported as a domain, candidate, visual
or asset-family failure.

## Concerns, Decisions, and Stop Semantics

`PASS WITH CONCERNS` records a bounded accepted concern, its owner, applicable scope, and later validation point. It does not turn the concern into implementation work in the current Task-Delta Work Order.

Contextual rejections and later superseded decisions remain traceable through the [Contextual Decision and Lesson Record](../Templates/CONTEXTUAL_DECISION_AND_LESSON_RECORD_TEMPLATE.md). They do not become universal permanent prohibitions.

A stop condition prevents further mutation. It does not prevent factual record completion, preservation of valid evidence, exact status reporting, or preparation of the blocked Human decision surface.

## Instruction Consolidation Map

| Repeated instruction | Current locations | Single authority after refactor | References retained | Content kept in a Task-Delta Work Order |
|---|---|---|---|---|
| Human authority; permission; stage/commit/push; download/purchase | `AGENTS.md`, AI rules, project orders and reports | `AGENTS.md` and AI rules | Project profile and playbooks link them | Only a narrower grant, task stop, or Human checkpoint |
| Terra default; Sol exception; context envelope | Routing standard, templates, project orders | AI model-routing standard | Core, profile, and template link it | Task classification, reason, and any specific Sol exception |
| Role authority, independence, no-overrule | Role model, board protocol, lifecycle, project boards | Role model, output schema, board protocol | Applicable playbook links them | Activated roles and stage-specific questions |
| Semantic evidence and candidate identity | AI rules, lifecycle, Visual QA, templates | AI rules universally; lifecycle and Visual QA for their domains | Playbooks link the applicable evidence contract | Exact claim, candidate, evidence ID, and pass condition |
| Lifecycle gates | Lifecycle, map templates, long Task-Delta Work Orders | Level Development Lifecycle | Core selects when it applies | Applicability, baseline, and affected gate only |
| Visual review, camera, and capture rules | Visual QA, level review, project orders | Visual QA and Level Design Review standards | Visual playbook | Only relevant reference, primary camera, routes, and evidence |
| Vendor/provenance/integration protection | AI rules, asset standard, project policies, long Task-Delta Work Orders | Asset standard plus project profile | Unity/integration playbooks | Only task-specific asset/path delta |
| Corrections, operational recovery, attempt accounting and invalid evidence | Visual QA, board protocol, lifecycle, routing, long Task-Delta Work Orders | This standard; domain standards reference it | Task-Delta Work Order template and playbooks | Setup, attempt-start condition, separate allowances, output namespaces and stage name |
| Project baselines, canonical environments, accepted concerns | Work state, handover, project reports and long orders | Project Production Profile, linked to operational state and evidence | Task-Delta Work Order references exact profile sections and records | Exact baseline ID and current delta |
| Diagnostic lessons | Historical reports and orders | Contextual project lesson register | Applicable playbook selects by tags/IDs | Only relevant lesson IDs |

The duplicated text to stop copying is the unchanged authority, routing tables, full role lists, full board sequence, complete Visual QA block, general asset/licence rules, broad project history, and global correction language. The task-specific delta remains the twelve-field Task-Delta Work Order template.
