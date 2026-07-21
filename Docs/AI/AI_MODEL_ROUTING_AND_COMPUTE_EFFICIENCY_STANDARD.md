# AI Model Routing and Compute Efficiency Standard

## Purpose

This adopted standard routes AI work by task properties and risk while minimizing unnecessary compute, context, and repetition. It is provider-independent and assumes no particular model name or availability.

The governing rule is:

> As inexpensive as reliably possible; as capable as the risk requires.

Cost reduction never authorises an unsuitable model to make a risky design, architecture, governance, security, licence, product, or quality decision.

## Routing Inputs

Route each bounded task, not an entire role or work order, using the highest applicable signal:

- consequence of an incorrect result;
- reversibility and cost of correction;
- novelty and ambiguity;
- number and authority of interacting sources;
- need for spatial, visual, causal, or cross-domain judgment;
- evidence volume and context coupling;
- prior failed attempts; and
- required independent review.

Role title alone is not a routing rule. The same role may use Routine classification for evidence indexing, Standard for a bounded review, and Critical for a new standard or irreversible design choice.

## Model Classes

| Class | Typical tasks | Reasoning depth | Maximum context need | Autonomous attempts | Escalation triggers | Required review |
|---|---|---|---|---:|---|---|
| Routine | File presence and format checks; evidence sorting; manifests; checklists; logs; deterministic tests; link checks; mechanical extraction or transformation with an exact expected result | Low; direct and verifiable | Small relevant slice: task instruction, target files, exact standard/check, and manifest references | 2 total attempts, including one corrected retry | Ambiguous output; conflicting source; non-deterministic failure; result would change design/governance; second failure; missing evidence | Deterministic verification or builder self-check; QA Lead validates it when the result supports a gate |
| Standard | Bounded implementation or documentation; known-pattern analysis; phase review against explicit criteria; reversible layout alternatives; ordinary defect diagnosis; evidence synthesis | Moderate to high; compare constraints and explain trade-offs | Bounded working set: authoritative excerpts/links, affected files, evidence manifest, relevant decisions and findings | 2 total attempts before reclassification or stop | Unresolved contradiction; architectural/product/taste decision; high-cost rework; broad hidden dependencies; repeated failure; mandatory reviewer disagreement | Independent applicable specialist for material output; QA Lead for evidence sufficiency; Producer for scope and consolidation |
| Critical | New or materially changed standards; irreversible architecture or layout; Art Direction; complex root-cause analysis; security/licence/high-impact decisions; reconciliation of contradictory mandatory verdicts; failed lower-class work | Deep; explicit assumptions, alternatives, failure modes, and authority reconciliation | Broad but curated set: all relevant authoritative sources, decision history, dependency/evidence manifest, conflicting verdicts, and exact candidate state | 1 planned attempt followed by required review; corrections follow the authorised board limit, not repeated blind retries | Any unresolved authoritative contradiction; missing Human-owned decision; insufficient evidence; unsafe or irreversible action; failure after escalation | Applicable independent specialists, QA Lead, and Producer/Director consolidation; Human Developer decides product, taste, governance adoption, scope, budget, purchase, licence-risk acceptance, and final approval |

`Autonomous attempts` count materially distinct solution attempts for the routed task. Repeating the same tool and method without a changed hypothesis or execution condition is not a new learning attempt. Failed captures, invocations, or other tool executions are recorded as execution errors even when they do not change the candidate. Attempt limits do not expand the maximum of two correction rounds defined by an applicable Review Board or Visual QA work order.

## Mandatory Critical Routing

Start at Critical, or escalate to it before deciding, for:

- new Studio OS standards or material governance changes;
- irreversible architecture, migration, or layout decisions;
- Art Direction or a change to approved visual identity;
- complex causal analysis with multiple plausible roots;
- contradictory mandatory role verdicts;
- high-impact security, provenance, licence, release, or data risk; and
- work that has failed the allowed lower-class attempts.

Critical routing does not grant authority. It still stops for a Human-owned decision or permission boundary.

## Routing Procedure

1. **Decompose:** split the work order into independently verifiable tasks.
2. **Classify:** record class and one-line reason from the routing inputs.
3. **Curate context:** provide only authoritative and task-relevant sources plus manifest pointers.
4. **Execute and verify:** use the class's attempt limit and evidence requirement.
5. **Escalate or stop:** after the class attempt limit, move upward when permitted and justified; otherwise stop. Do not repeatedly retry the same approach at the same class.
6. **Review and consolidate:** retain separate role verdicts and the exact class used for material decisions. Gate-critical evidence receives independent semantic review even when its generation was Routine or Standard.

A Critical work order may still route its deterministic subchecks to Routine. A Routine result that changes the decision surface must be re-evaluated at Standard or Critical before adoption.

## Token and Context Rules

1. Give each role only the documents, decision records, files, and evidence needed for its named review questions.
2. Produce shared facts once in a versioned evidence manifest and reference them from reviews.
3. Do not repeat unchanged project history; provide the authoritative link and only the delta that affects the task.
4. Frame reviews around concrete questions, pass/fail criteria, and exact evidence rather than broad requests to inspect everything.
5. Give correction rounds only the triggering findings, affected files, relevant standards, replaced evidence, and regression surface.
6. Expose large evidence sets through structured manifests with IDs, paths, version, conditions, and claims proved.
7. Repeat a test only when a change can affect it, its prior evidence was incomplete/invalid, or a required regression gate says to repeat it.
8. Read existing standards from the repository; work orders link them and add only project-specific constraints.
9. Avoid parallel role reviews that ask the same question. Activate a role only when it contributes a distinct risk-reducing check.
10. Use summaries as navigation, not authority. A material decision must remain traceable to the underlying source and evidence.
11. Preserve exact final-version identity so reviewers do not reload superseded context.
12. Token savings must never route a risk-bearing decision to a class unable to evaluate it reliably.

## Context Envelope

Every routed task should receive this compact envelope:

```text
Task and expected output:
Model class and routing reason:
Authority and permission boundary:
Authoritative sources:
Affected files or evidence IDs:
Concrete review / verification questions:
Pass, fail, and escalation criteria:
Prior attempts and unresolved findings:
```

Missing information is retrieved by reference when needed. It is not preloaded merely because it exists.

## Current Codex Execution Profile (Availability-Bound)

This is a current Codex execution profile, not a provider dependency or a replacement for the provider-independent model classes above. It applies only while the named models are available in the active Codex environment. If availability changes, retain the task classification, evidence, and review rules, record the unavailable named model, and escalate; do not silently substitute another named model.

- `gpt-5.6-terra` is the requested default for Routine and Standard tasks, including bounded execution.
- `gpt-5.6-sol` is requested only for an explicit `sol_exception`: architecture, authority conflict, novel governance, complex root cause, contradictory evidence, high-level design, or final accountable synthesis.
- Every subagent record names its requested execution model, has a narrow bounded task and output, receives the minimum relevant context, and returns a structured result. Do not duplicate an already assigned execution.
- A named-model request does not prove the model actually resolved by the execution environment. Every record and final summary must state exactly: `Requested model — not independently attested.`
- Every task record includes its classification and reason, requested execution model, context-fork scope, escalation conditions and outcome, result, and final requested-model usage counts. A Sol request includes its allowed explicit `sol_exception`.

The final requested-model usage summary counts requested models for every execution recorded in the bounded task. It is a request audit, not evidence of actual model resolution.

## Oversight and Current Role Gap

The Producer / Scope Controller records routing and prevents wasteful retry loops. The QA Lead verifies that model-produced evidence and conclusions are sufficient for the applicable gate. Applicable specialists judge domain quality. The Director reconciles cross-domain or authority conflicts.

The current [Specialist Role Catalog](../Roles/ROLE_CATALOG.md) contains no dedicated AI Workflow or Model-Routing Reviewer. This standard does not invent one. Until a recurring distinct review need is validated and adopted through the Governance Lifecycle, routing compliance is covered by Producer scope/efficiency checks and QA evidence checks. This is a documented capability gap, not an implied new role.

## Human Boundary

The Human Developer is involved when routing reaches a genuine product, taste, governance-adoption, architecture-change, scope, budget, purchase, licence-risk, or final-approval decision. The Human is not asked to choose a model class for routine execution when the rules determine it clearly.
