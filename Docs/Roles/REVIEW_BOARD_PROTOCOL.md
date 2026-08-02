# Review Board Protocol

> **Status:** Adopted through LAIA-2026-07-22 on 2026-07-22; amended through
> `SOS-GOV-AAPEC-V1` on 2026-07-29 and
> `C99-STUDIO-REVIEW-IDENTITY-ART-DIRECTION-PRODUCER-STOP-GATE-V1` on
> 2026-07-30 and `C99-STUDIO-QA-TIME-AND-STOP-CONTROLS-ADOPTION-V2` on
> 2026-07-31.

## Purpose

A Review Board is a repeatable sequence of independent role assessments for one work type. It is not a meeting, standing team, approval committee, or additional authority layer.

## Required Sequence

1. **Formative Builder Pass:** implement the authorised scope and record assumptions and known limits without freezing a formal package after every edit.
2. **Definition of Ready:** identify one preserved candidate, authorised baseline and delta, current semantically suitable evidence, review questions, activated roles, hard fails, and the named stage correction allowance.
3. **Technical Validation:** run proportionate compilation, tests, scene/build, reference, integrity, and performance checks. Label results technical.
4. **Independent Specialist Reviews:** each activated mandatory stage-exit role completes a separate schema-compliant record for the same candidate. The record must identify the actual reviewer, separation from the Builder, exact candidate, evidence, and valid verdict. Run reviews in parallel where practical; they must not copy the Builder summary. A required review that cannot run is `REVIEW NOT PERFORMED`, a blocking execution state rather than a verdict.
5. **Conflict Reconciliation:** list differing findings without erasing them. Apply the authority order; escalate unresolved cross-domain or product conflicts.
6. **Stage-Local Correction Round 1:** when authorised, Work corrects clear, high-impact, in-scope defects from the valid review and regenerates affected evidence.
7. **Affected Re-reviews:** only roles whose evidence or finding can have changed review the corrected result.
8. **Stage-Local Correction Round 2:** when the Task-Delta Work Order authorises two rounds and it is necessary, perform one further bounded correction and affected re-review. No correction beyond the named stage allowance is autonomous.
9. **Producer Consolidation:** verify every required role's review execution state, actual reviewer identity, required separation, final candidate, exact evidence, and valid verdict before recording every final role verdict, resolved and
   unresolved conflicts, accepted concerns, Human decisions, weakest area,
   earliest invalid production gate, and handoff status. Technical correctness
   cannot override a visual-purpose failure; consolidation reopens or blocks at
   the earliest failed asset-qualification, spatial, composition, host,
   modular-proof, or visual-review gate.
10. **Human Review Package:** provide only after the handoff gate in the output schema is satisfied, or provide a clearly blocked package for a genuine Human decision.

Evidence validity and correction consumption follow the [Execution Modes and Stage Review Standard](../Production/EXECUTION_MODES_AND_STAGE_REVIEW_STANDARD.md). Invalid evidence prevents a formal verdict; its repair remains subject to routing attempt limits and cannot justify repeated blind retries.

## Review Envelope, Time, and Stop Controls

These controls apply only to reviews launched after their adoption on
2026-07-31. They do not invalidate or reinterpret historical reviews, weaken
reviewer independence or change domain-verdict requirements.

### Pre-launch classification and ownership

Before reviewer dispatch, the Producer or accountable Scope Controller
classifies and freezes the review envelope. The same named Producer or Scope
Controller enforces dispatch, approves or denies any permitted extension and
records the final blocking or passage state. The record names that accountable
authority, the reviewer and telemetry executor and identifies the exact
candidate, review risk class, permitted files or manifest entries, claims,
required checks, direct file count and bytes, bounded review questions, target
duration, hard stop and extension eligibility. Review-risk labels do not
replace the model classes in the AI Model Routing and Compute Efficiency
Standard.

The reviewer enforces the frozen envelope during execution and may report
unexpected scope but may not open it, silently enlarge it or truncate it into
a partial pass. The executor records the compact telemetry below. A disputed
classification is resolved or escalated before dispatch; an unresolved
dispute prevents launch.

### Default time envelope

| Review risk | Typical bounded use | Target | Initial hard stop |
|---|---|---:|---:|
| Low | Bounded documentation or package QA | 10 minutes | 20 minutes |
| Standard | Larger reversible package or defect review | 15 minutes | 25 minutes |
| High/Critical | Security, authority, novel governance or conflicting mandatory evidence | 20 minutes | 30 minutes |

Low is the default. A larger envelope requires explicit pre-launch
justification. No review may exceed 30 elapsed minutes without fresh Human
authority recorded before launch and named in the frozen extension authority.

### Over-envelope and timeout behaviour

If required files, manifest entries, claims, risk or checks exceed the frozen
envelope, the review must not begin or continue. `RESCOPE REQUIRED` is the
blocking envelope execution state, not a role verdict. The reviewer returns a
compact scope delta identifying the frozen envelope, what exceeded it, the
inspected-file count, whether evidence was opened and the smallest identified
reduction or split without performing it. The Producer may issue a smaller
package within existing authority or seek authority for a larger envelope.
Silent truncation, partial PASS and automatic scope expansion are prohibited.

When the review is mandatory, an over-envelope stop or timeout that prevents a
complete schema-valid record leaves the role review `REVIEW NOT PERFORMED`.
The mandatory review remains unsatisfied and blocks passage. At the target
time, the reviewer reports progress and narrows only within the already frozen
envelope. At the current hard stop, the reviewer stops inspection and returns
the candidate identity, evidence examined, supported findings or hard fails,
unchecked questions, unavailable evidence, latency telemetry and whether a
complete valid verdict is supported. A completed `FAIL` remains `FAIL`;
timeout or partial findings never become PASS. Producer consolidation cannot
present an incomplete mandatory review as passage-capable.

### Single extension path

An extension is available only when the frozen pre-launch envelope permits it
and changes time only. Before the current hard stop, the reviewer may submit
one request recording the reason, remaining work, evidence already examined
and exact additional time. Only the named Producer or accountable Scope
Controller may approve or deny it; the reviewer cannot approve its own
extension. Approval creates one new explicit hard stop and leaves every scope
field unchanged. Scope expansion requires `RESCOPE REQUIRED`, not extension.
Tool failure, repeated rereading, reviewer delay or elapsed time grants no
automatic extension.

If an extension is late, denied, unavailable or not permitted, the reviewer
returns the available partial findings and blocking execution state. A
mandatory review remains unsatisfied. No second extension or replacement
reviewer starts automatically. A replacement requires the first execution to
be confirmed stopped and a new dispatch decision against a frozen envelope.

### Minimum latency telemetry

Record only task and reviewer identity, review class, start time, target
duration, current hard stop, end time, elapsed duration, inspected-file count,
whether deterministic checks were repeated, extension status, and completion
or blocking execution state. Unavailable telemetry is recorded as
`UNAVAILABLE`, not estimated.

## Independence Requirements

- Reviews are written before consolidation and retained separately.
- A role review must cite evidence it examined and add its own domain judgment.
- Builder statements, test counts, or implementation quantities are not a role verdict.
- Technical validation cannot replace visual, gameplay, audio, accessibility, provenance, or Human review.
- The Producer cannot average verdicts, hide dissent, or turn `FAIL` into passage.
- When Art Direction is activated for visual acceptance, direct appropriate Art Director inspection and a completed valid Art Director verdict are prerequisites. `PENDING`, missing inspection, clarification, technical validation, or Producer opinion cannot replace it. Without that record, the visual candidate is not accepted, the Producer may record only a blocked state, and no approval option may be recommended.
- The Producer may not recommend passage while any applicable mandatory review is missing, pending, invalid, `REVIEW NOT PERFORMED`, or attached to an earlier candidate. `BLOCKED BY HUMAN DECISION` produces only a blocked package and only for a genuine Human-owned decision.

## Anti-Loop Rule

Handoff is prohibited while an active role reports a defect that Work can clearly fix within authorised scope and the named stage still has correction allowance. Work fixes and reruns affected reviews. An accepted concern does not become implementation scope unless the Task-Delta Work Order includes it. Human review is reserved for taste, priority, equivalent alternatives, scope, budget, new assets, exhausted correction allowance, or real product decisions.

## Stop Conditions

Stop before correction when it requires new authority, a correction beyond the named stage allowance, a protected-source change, new asset/download/purchase, licence interpretation, architecture reversal, or materially expanded scope. Preserve the role verdict and state the exact Human or Director decision needed. The stop prevents mutation, not completion of the factual record.

## Consolidation Record

The Producer must include:

```text
Board:
Assignment and final reviewed version:
Mandatory roles and verdicts:
Review execution state, actual reviewer, separation, candidate, and evidence for each required role:
Optional roles and verdicts:
Resolved defects:
Unresolved concerns:
Hard fails remaining:
Conflicts and authority resolution:
Open Human decisions:
Weakest remaining area:
Earliest invalid production gate or None:
Correction rounds used:
Correction stage and allowance:
Invalid-evidence incidents and disposition:
Handoff status:
```
