# Review Board Protocol

> **Status:** Adopted through LAIA-2026-07-22 on 2026-07-22.

## Purpose

A Review Board is a repeatable sequence of independent role assessments for one work type. It is not a meeting, standing team, approval committee, or additional authority layer.

## Required Sequence

1. **Formative Builder Pass:** implement the authorised scope and record assumptions and known limits without freezing a formal package after every edit.
2. **Definition of Ready:** identify one preserved candidate, authorised baseline and delta, current semantically suitable evidence, review questions, activated roles, hard fails, and the named stage correction allowance.
3. **Technical Validation:** run proportionate compilation, tests, scene/build, reference, integrity, and performance checks. Label results technical.
4. **Independent Specialist Reviews:** each activated role reviews the same candidate and writes a separate schema-compliant verdict. Run reviews in parallel where practical; they must not copy the Builder summary.
5. **Conflict Reconciliation:** list differing findings without erasing them. Apply the authority order; escalate unresolved cross-domain or product conflicts.
6. **Stage-Local Correction Round 1:** when authorised, Work corrects clear, high-impact, in-scope defects from the valid review and regenerates affected evidence.
7. **Affected Re-reviews:** only roles whose evidence or finding can have changed review the corrected result.
8. **Stage-Local Correction Round 2:** when the Task-Delta Work Order authorises two rounds and it is necessary, perform one further bounded correction and affected re-review. No correction beyond the named stage allowance is autonomous.
9. **Producer Consolidation:** record every final role verdict, resolved and unresolved conflicts, accepted concerns, Human decisions, weakest area, and handoff status.
10. **Human Review Package:** provide only after the handoff gate in the output schema is satisfied, or provide a clearly blocked package for a genuine Human decision.

Evidence validity and correction consumption follow the [Execution Modes and Stage Review Standard](../Production/EXECUTION_MODES_AND_STAGE_REVIEW_STANDARD.md). Invalid evidence prevents a formal verdict; its repair remains subject to routing attempt limits and cannot justify repeated blind retries.

## Independence Requirements

- Reviews are written before consolidation and retained separately.
- A role review must cite evidence it examined and add its own domain judgment.
- Builder statements, test counts, or implementation quantities are not a role verdict.
- Technical validation cannot replace visual, gameplay, audio, accessibility, provenance, or Human review.
- The Producer cannot average verdicts, hide dissent, or turn `FAIL` into passage.

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
Optional roles and verdicts:
Resolved defects:
Unresolved concerns:
Hard fails remaining:
Conflicts and authority resolution:
Open Human decisions:
Weakest remaining area:
Correction rounds used:
Correction stage and allowance:
Invalid-evidence incidents and disposition:
Handoff status:
```
