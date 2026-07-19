# Review Board Protocol

## Purpose

A Review Board is a repeatable sequence of independent role assessments for one work type. It is not a meeting, standing team, approval committee, or additional authority layer.

## Required Sequence

1. **Builder Pass:** implement the authorised scope and record evidence, assumptions, and known limits.
2. **Technical Validation:** run proportionate compilation, tests, scene/build, reference, integrity, and performance checks. Label results technical.
3. **Independent Specialist Reviews:** each mandatory role reviews the actual result and writes a separate schema-compliant verdict. Reviews may run in the same Work assignment but must not copy the Builder summary.
4. **Conflict Reconciliation:** list differing findings without erasing them. Apply the authority order; escalate unresolved cross-domain or product conflicts.
5. **Autonomous Correction Round 1:** Work corrects every clear, high-impact, in-scope defect and regenerates affected evidence.
6. **Affected Re-reviews:** every role whose evidence or finding changed reviews the corrected result.
7. **Autonomous Correction Round 2:** if necessary, perform one further bounded correction round and re-review. No third autonomous round is allowed.
8. **Producer Consolidation:** record every final role verdict, resolved and unresolved conflicts, concerns, Human decisions, weakest area, and handoff status.
9. **Human Review Package:** provide only after the handoff gate in the output schema is satisfied, or provide a clearly blocked package for a genuine Human decision.

## Independence Requirements

- Reviews are written before consolidation and retained separately.
- A role review must cite evidence it examined and add its own domain judgment.
- Builder statements, test counts, or implementation quantities are not a role verdict.
- Technical validation cannot replace visual, gameplay, audio, accessibility, provenance, or Human review.
- The Producer cannot average verdicts, hide dissent, or turn `FAIL` into passage.

## Anti-Loop Rule

Handoff is prohibited while an active role reports a defect that Work can clearly fix within authorised scope. Work fixes and re-reviews it. Human review is reserved for taste, priority, equivalent alternatives, scope, budget, new assets, or real product decisions.

## Stop Conditions

Stop before correction when it requires new authority, a third correction round, a protected-source change, new asset/download/purchase, licence interpretation, architecture reversal, or materially expanded scope. Preserve the role verdict and state the exact Human or Director decision needed.

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
Handoff status:
```
