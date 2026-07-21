# Work Order Role and Review Block

Every larger Work assignment must include this block. Small isolated tasks may shorten explanations but may not omit an applicable mandatory role, hard fail, permission boundary, or Human decision.

```text
Assignment:
Primary success condition:
Accepted baseline / must not rebuild:
Explicit out-of-scope temptations:
Authoritative sources:
Authorised scope:
Explicit exclusions:

Builder Role:
Mandatory Review Roles:
Optional Review Roles and activation triggers:
Review Board:

Required role evidence:
Technical validation evidence:
Visual/gameplay/audio evidence as applicable:
Gate-critical claims and evidence methods:
Semantic or behavioural evidence contracts:
Hard-fail criteria:

Model routing standard:
Bounded task ID and output:
Task-level Routine / Standard / Critical classification and reason:
Requested execution model:
Context-fork scope:
Sol exception (only when requested execution model is gpt-5.6-sol):
Escalation conditions:
Escalation occurred and reason:
Result:
Attestation limitation: Requested model — not independently attested.
Final requested-model usage summary:
Shared evidence manifest and context envelope:
Manifest candidate, supersession, and missing-evidence rule:

Autonomous correction rounds: 0, 1, or 2 (maximum 2)
Correction priority rule:
Evidence to regenerate after correction:

Human Approval Boundary:
Stop conditions:
Allowed role verdicts: PASS / PASS WITH CONCERNS / FAIL / BLOCKED BY HUMAN DECISION / NOT APPLICABLE
Allowed consolidated handoff status:
```

## Required Behaviour

Before implementation, the Producer / Scope Controller confirms scope, roles, evidence, hard fails, correction count, and stop conditions. After implementation, every mandatory role produces a separate [role output](../Roles/ROLE_REVIEW_OUTPUT_SCHEMA.md). Work corrects every clear in-scope defect before handoff and reruns affected reviews. The Producer cannot override a `FAIL`.

Model routing follows the [AI Model Routing and Compute Efficiency Standard](../AI/AI_MODEL_ROUTING_AND_COMPUTE_EFFICIENCY_STANDARD.md). Work orders record task-level routing and link shared evidence instead of assigning one model class to an entire role or copying unchanged context.

The requested execution model is explicit for every subagent. `gpt-5.6-terra` is the current Codex-profile default for Routine and Standard work. `gpt-5.6-sol` requires one allowed explicit `sol_exception`; named-model unavailability or failure is recorded and escalated without silent fallback. The final requested-model usage summary is a request audit and does not attest to the model actually resolved by the execution environment.

For visible work, append the assignment block required by the [Visual Quality Assurance Workflow](../Visual/Visual_Quality_Assurance_Workflow.md). Linking that block is preferred to copying its full rules.
