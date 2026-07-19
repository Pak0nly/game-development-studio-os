# Work Order Role and Review Block

Every larger Work assignment must include this block. Small isolated tasks may shorten explanations but may not omit an applicable mandatory role, hard fail, permission boundary, or Human decision.

```text
Assignment:
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
Hard-fail criteria:

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

For visible work, append the assignment block required by the [Visual Quality Assurance Workflow](../Visual/Visual_Quality_Assurance_Workflow.md). Linking that block is preferred to copying its full rules.
