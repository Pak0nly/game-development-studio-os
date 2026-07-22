# Task-Delta Work Order Template

> **Status:** Adopted through LAIA-2026-07-22 on 2026-07-22. Use only within a separately Human-authorised Task-Delta Work Order; this template does not create execution authority.

Use this template after loading the applicable Studio OS Core, project Production Profile, and on-demand playbooks. A Task-Delta Work Order records only the assignment-specific delta; it references unchanged authority, permissions, routing, evidence, role, review, asset, visual, Git, and correction rules.

```text
Assignment:
Execution mode:
Objective:
Authoritative baseline:
Allowed changes:
Frozen / out of scope:
Known current findings:
Applicable playbooks or skills:
Done when:
Required stage-exit reviews:
Correction allowance:
Human checkpoint:
```

## Completion Rules

- Select the mode through the [Execution Modes and Stage Review Standard](../Production/EXECUTION_MODES_AND_STAGE_REVIEW_STANDARD.md).
- Record model routing in the bounded task record defined by the [AI Model Routing and Compute Efficiency Standard](../AI/AI_MODEL_ROUTING_AND_COMPUTE_EFFICIENCY_STANDARD.md); do not copy its routing table into the Task-Delta Work Order.
- Name one accountable builder when implementation is authorised.
- Activate only roles whose distinct finding can change the stage decision. Larger or Critical work retains Producer / Scope Controller and QA Lead oversight.
- Link task-specific claims, candidate identity, evidence IDs, and hard fails under `Done when`; do not copy full domain standards.
- State the formal correction allowance as `0`, `1`, or `2` for the named stage. Formative work and invalid evidence follow the Core accounting rule and do not consume a creative correction.
- A missing permission, applicable hard fail, Human-owned decision, or stop condition is not waived because the field is concise.

For new or structurally material level work, use this delta with the [Level Development Lifecycle](../Level/LEVEL_DEVELOPMENT_LIFECYCLE.md) and its phase records. For bounded visible production, use the [Visual Production Playbook](../Playbooks/VISUAL_PRODUCTION.md). For Unity asset work or diagnosis, use the [Unity Asset Assembly and Diagnostic Safety Playbook](../Playbooks/UNITY_ASSET_ASSEMBLY_AND_DIAGNOSTIC_SAFETY.md). For integration and commit preparation, use the [Baseline Integration and Commit Preparation Playbook](../Playbooks/BASELINE_INTEGRATION_AND_COMMIT_PREPARATION.md).
