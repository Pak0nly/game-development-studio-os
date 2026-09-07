# Task-Delta Work Order Template

> **Status:** Adopted through LAIA-2026-07-22 on 2026-07-22; amended through
> `SOS-GOV-AAPEC-V1` on 2026-07-29 and
> `C99-STUDIO-REVIEW-IDENTITY-ART-DIRECTION-PRODUCER-STOP-GATE-V1` on
> 2026-07-30 and
> `SOS-GOV-OPERATIONAL-RECOVERY-AND-CANDIDATE-ATTEMPT-ACCOUNTING-V1` on
> 2026-08-22 and `SOS-GOV-TACKB-V1` on 2026-08-22. Use only within a separately
> Human-authorised Task-Delta Work Order; this template does not create
> execution authority.

Use this template after loading the applicable Studio OS Core, project Production Profile, and on-demand playbooks. A Task-Delta Work Order records only the assignment-specific delta; it references unchanged authority, permissions, routing, evidence, role, review, asset, visual, Git, and correction rules.

## Default Authoring Contract

Use a compact Task-Delta Work Order by default when the executor can read the
current canonical repository sources. Use a full standalone Work Order only
when the executor cannot access those sources or the assignment requires a
genuinely external, self-contained contract. Present chat-routing guidance to
the Human outside the copied Work Order.

Before issuing a Work Order, select the shortest valid form and flag any
avoidable duplication of rules already owned by canonical sources. The copied
compact transport envelope contains only:

```text
ID:
Base / profile references:
Human authority:
Objective:
Inputs:
Allowed mutations:
Task-specific controls:
Required output:
Success:
Stop:
```

Under `Allowed mutations`, state: `Only explicitly listed mutations are
authorised; everything else is out of scope.` Time envelopes, task-specific
exceptions, activated-review references, correction allowance, rollback
trigger, and Human checkpoint belong under `Task-specific controls`, `Success`,
or `Stop` only when they apply. Reference bootstrap, authority, reviewer
activation, verdict, correction, rollback, model-routing, and general evidence
rules from their canonical owners; do not recopy them.

For a task that materially selects, replaces, adapts or rejects a tool, asset,
package, workflow or bespoke implementation, include this compact block under
`Task-specific controls`:

```text
Capability Knowledge Base query or NOT APPLICABLE:
Relevant capability record IDs:
Strongest existing options considered:
Prior success/failure evidence that changes this task:
Selected option and why:
Rejected existing options and bounded reason:
Decision-critical UNKNOWN / refresh action:
Expected technical debt or avoided technical debt:
```

Use `NOT APPLICABLE` only when the task has no meaningful capability choice.
The block is a bounded shortlist, not an exhaustive package audit.

For any task that launches a process, runtime, engine, build, capture or
external tool before a candidate can exist, `Task-specific controls` must
separate:

```text
Planned setup / warm-up operations:
Candidate-attempt start condition:
Candidate-attempt allowance:
Operational-recovery allowance:
Formal stage-correction allowance:
Task-owned process-log namespace or NOT APPLICABLE:
Task-owned run-state namespace or NOT APPLICABLE:
Task-owned quarantine namespace or NOT APPLICABLE:
Task-owned candidate-output namespace or NOT APPLICABLE:
Task-owned retained-evidence namespace or NOT APPLICABLE:
Task-owned failed-attempt archive namespace or NOT APPLICABLE:
Cleanup authority for each applicable namespace:
```

Do not use one undifferentiated process or retry cap for these classes. The
default operational-recovery allowance is the Core default; a narrower
allowance must be an intentional Human-authorised task constraint, not an
accidental consequence of counting setup as candidate work.

## Director Orchestration and Closure Expansion

For every new mutation-capable dispatch, the originating Director remains
orchestration-only and completes the prospective manifest/receipt procedure in
`Tools/AuthorityContinuity`. Human authorisation of this Work Order authorises
its dispatch, not direct Director implementation. If a separate Worker task or
cursor-based monitoring is unavailable, stop.

Record this compact orchestration block under `Task-specific controls`:

```text
Director mode: orchestration_only
Director mutation allowed: no
Separate Worker task required: yes; create with create_thread
Worker requested model:
Worker reasoning effort:
Worker routing reason:
Monitoring: required; cursor_based; wait_threads
Independent review required: yes / no with task-specific reason
Independent review activation: after_reviewable_evidence
Separate Reviewer task required when applicable: yes
Builder self-review counts as independent: no
Maximum decision-relevant Reviewer tasks: 1
```

The requested model and routing reason must match one declared model-routing
record. The reasoning effort must be explicit. The Director validates the
dispatch, creates one separate Worker task with that exact Work Order and
receipt, and monitors it cursor-based. Monitoring or reading the result does
not permit the Director to mutate the candidate.

When reviewable evidence exists, freeze under `Required output`:

```text
Director task identity:
Worker task identity:
Candidate identity and exact file hashes:
Evidence identities and exact hashes:
Independent Reviewer task identity or NOT REQUIRED:
Reviewer role:
Reviewed candidate identity:
Reviewed evidence identities:
Applicable verdict or blocking execution state:
```

When independent review is required, the Reviewer task identity must differ
from Director and Worker. After a matching `PASS`, issue an immutable Director
closure receipt with the closure manifest procedure. Only then may the
Director project the result into `Docs/WORK_STATE.md` and
`Docs/CURRENT_HANDOVER.md`; both files must name the exact Work Order, Worker
and Reviewer task identities, candidate identity, `Independent review verdict:
PASS`, and closure receipt ID. Run the operational closure verification after
that projection. A missing, stale, self-authored or mismatched receipt blocks
the `PASS` wording.

This expansion is prospective. Historical v1 dispatch artifacts remain
historical evidence and are not rewritten. They may be reverified for their
original Worker handshake, but they cannot issue a new mutation-capable
Director receipt.

## Non-Executed Compact Example — Critical Governance Adoption

This example demonstrates format only. It is not an executable assignment and
grants no mutation authority.

```text
ID:
EXAMPLE-CRITICAL-GOVERNANCE-ADOPTION

Base / profile references:
AGENTS.md; Docs/README.md; Role Activation Matrix; Role Operating Model;
Review Board Protocol; Execution Modes and Stage Review Standard; AI Model
Routing and Compute Efficiency Standard.

Human authority:
Non-executed illustration only; no repository mutation is authorised.

Objective:
Demonstrate a compact Critical governance-adoption delta without copying its
governing standards.

Inputs:
Current canonical template, exact proposed amendment, and its cited authority.

Allowed mutations:
Only the exact template path named by a future Human-authorised assignment.
Only explicitly listed mutations are authorised; everything else is out of
scope.

Task-specific controls:
Critical governance task. Target 20 minutes; hard stop 30 minutes. Determine
mandatory reviewers from the current Activation Matrix and use separate
identities where required. Freeze one exact candidate before review.

Required output:
Candidate identity, concise validation evidence, separate mandatory-review
records, and Producer consolidation.

Success:
Every mandatory reviewer returns PASS on the same frozen candidate and the
exact mutation allowlist is preserved.

Stop:
On missing authority, overlap, timeout, missing review, or FAIL, restore the
exact pre-task bytes, verify rollback, and stop.
```

## Conditional Expansions

The compact headings remain the outer copied contract. Use the retained fields
and detailed schemas below only as conditional expansions under the matching
compact heading. Complete the Required-Review Evidence Map whenever its
adopted reviewer-activation conditions apply, and complete the Environment
Composition declarations whenever their adopted applicability conditions
apply. Do not include either expansion in an unrelated Work Order, and do not
omit it when mandatory. The New Map Slice process-validation template is a
domain-specific conditional expansion of this compact base.

The ten outer headings group rather than replace the adopted twelve-field
Task-Delta authoring schema named by the Execution Modes and Stage Review
Standard. Map every applicable retained field as follows:

| Retained authoring field | Compact outer heading |
|---|---|
| `Assignment` | `ID` and `Objective` |
| `Execution mode` | `Task-specific controls` |
| `Objective` | `Objective` |
| `Authoritative baseline` | `Base / profile references` |
| `Allowed changes` | `Allowed mutations` |
| `Frozen / out of scope` | `Allowed mutations` and `Stop` |
| `Known current findings` | `Inputs` |
| `Applicable playbooks or skills` | `Base / profile references` and `Inputs` |
| `Done when` | `Required output` and `Success` |
| `Required stage-exit reviews` | `Task-specific controls` and `Required output` |
| `Correction allowance` | `Task-specific controls` and `Stop` |
| `Human checkpoint` | `Success` and `Stop` |

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
Required-review evidence map:
Correction allowance:
Human checkpoint:
Environment composition applicability:
Asset Awareness declaration:
Spatial Purpose declaration:
Host Validation ledger:
Modular Proof declaration:
Placeholder Control declaration:
Visual-purpose hard fails:
Earliest gate to reopen if a declaration fails:
```

## Required-Review Evidence Map

For each required or applicable stage-exit role, record:

```text
Role:
Required / applicable:
Actual reviewer identity:
Separate from Builder: yes / no
Reviewed candidate:
Evidence path or section:
Verdict or blocking execution state:
```

Apply this map only to new or materially revised Work Orders after adoption; do not retrofit historical packages. A justified `NOT APPLICABLE` remains permitted, but does not waive a mandatory role silently. The [Role Review Output Schema](../Roles/ROLE_REVIEW_OUTPUT_SCHEMA.md) defines valid verdicts and blocking execution states.

## Mandatory Environment Composition Declarations

Every work order that creates, retains, removes, relocates, reorients, rehosts,
or reviews visible environment content **MUST** complete the declarations
below. `NOT APPLICABLE` requires a reason tied to the exact scope; it cannot be
used to bypass a changed or newly claimed visible element.

### Asset Awareness

```text
Relevant asset families:
Existing candidates inspected:
Function, scale, pivot/orientation, host and camera suitability:
Modular compatibility and limitations:
Vendor source / imported working copy / project-owned variant boundaries:
Why any required family remains unavailable or unsuitable:
```

### Spatial Purpose

```text
Location function:
Usage story and users:
Public, private, service and maintenance zones:
Pedestrian and vehicle circulation:
Entrances, exits, loading and required access:
Gameplay, camera and accessibility constraints:
```

### Host Validation

Record every retained or newly placed prop. If a defensible entry cannot be
completed, the default disposition is `REMOVE` or `DO NOT PLACE`.

```text
Prop ID:
Disposition: retain / place / reposition / reorient / rehost / remove / do not place
Exact host:
Purpose: gameplay / world / art direction / composition
Orientation:
Required clearance:
Why a resident, customer, worker, service operator or gameplay actor would place or use it there:
Evidence:
```

### Modular Proof

```text
Family and intended broad use:
Straight:
Corner / return:
Ending:
Entrance / interruption:
Transition / seam:
Volume or roof closure:
Ground and wall contact:
Collider and snapping:
Repetition and elevated-camera result:
Unproven cases and resulting use restriction:
```

Broad use **MUST NOT** proceed while an applicable corner, entrance,
interruption, ending, closure, transition, collider, snapping, or repetition
case is unknown.

### Placeholder Control

```text
Placeholder ID and visibility:
Why no suitable existing asset exists:
Why modular composition is insufficient:
Bounded proof purpose:
Permitted lifetime or expiry:
Replacement condition and owner or future gate:
Visual-review consequence:
```

An unjustified visible placeholder is a Hard Fail.

## Completion Rules

- Select the mode through the [Execution Modes and Stage Review Standard](../Production/EXECUTION_MODES_AND_STAGE_REVIEW_STANDARD.md).
- Record model routing in the bounded task record defined by the [AI Model Routing and Compute Efficiency Standard](../AI/AI_MODEL_ROUTING_AND_COMPUTE_EFFICIENCY_STANDARD.md); do not copy its routing table into the Task-Delta Work Order.
- Name one accountable builder when implementation is authorised.
- When a Director originates mutation-capable work, keep the Director
  orchestration-only, use a prospective validated dispatch, create one separate
  Worker task, and monitor it cursor-based. Never convert Human `go` into direct
  Director implementation.
- Activate only roles whose distinct finding can change the stage decision. Larger or Critical work retains Producer / Scope Controller and QA Lead oversight.
- For each activated mandatory stage-exit specialist, complete the Required-Review Evidence Map before Producer consolidation. Routine deterministic Builder self-checks do not require specialist activation where no independent specialist verdict is required.
- Link task-specific claims, candidate identity, evidence IDs, and hard fails under `Done when`; do not copy full domain standards.
- For visible environment work, Definition of Ready requires complete Asset
  Awareness, Spatial Purpose, Host Validation, Modular Proof and Placeholder
  Control declarations. Technical completeness, object counts or prefab
  instantiation cannot substitute for them.
- Include the applicable visual-purpose hard fails: hostless or obstructive
  props, random dressing, unjustified visible placeholders, broad unproven
  modular use, unsupported modular-completeness claims, visible overlap or
  z-fighting, and technical PASS presented as visual PASS.
- State the formal correction allowance as `0`, `1`, or `2` for the named stage. Formative work and invalid evidence follow the Core accounting rule and do not consume a creative correction.
- For process- or tool-driven tasks, state planned setup, the exact
  candidate-attempt start condition, candidate-attempt allowance,
  operational-recovery allowance, and separated task-owned output namespaces.
  A raw process cap must not silently replace these fields.
- A missing permission, applicable hard fail, Human-owned decision, or stop condition is not waived because the field is concise.
- Do not project an independently reviewed `PASS` into operational state until
  the closure receipt binds the exact task, candidate, evidence and verdict
  identities and the operational closure verification passes.

For new or structurally material level work, use this delta with the [Level Development Lifecycle](../Level/LEVEL_DEVELOPMENT_LIFECYCLE.md) and its phase records. For bounded visible production, use the [Visual Production Playbook](../Playbooks/VISUAL_PRODUCTION.md). For Unity asset work or diagnosis, use the [Unity Asset Assembly and Diagnostic Safety Playbook](../Playbooks/UNITY_ASSET_ASSEMBLY_AND_DIAGNOSTIC_SAFETY.md). For integration and commit preparation, use the [Baseline Integration and Commit Preparation Playbook](../Playbooks/BASELINE_INTEGRATION_AND_COMMIT_PREPARATION.md).
