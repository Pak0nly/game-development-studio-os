# Current Handover

This file preserves only the context needed to continue current work. It is an operational record, not an adopted governance standard.

## Purpose of the Current Work

Implement and validate continuity version 2 by adding the authoritative confirmed-decision layer missing from version 1.

## Why Version 1 Failed

Version 1 preserved immediate task context but did not reliably preserve all Human Developer-confirmed durable decisions. Those decisions had no dedicated authoritative record and could remain only in chat, historical session material, ambiguous operational summaries, or a non-adopted Governance Backlog item.

Immediate task continuity therefore passed, durable decision continuity failed, and continuity version 1 remains incomplete and not validated.

## Current Status

`Docs/CONFIRMED_DECISIONS.md` is being added as the authoritative confirmed-decision layer. Future restarts must read it and reconcile the assigned task against relevant Decision IDs before planning or execution.

The next Director Sync Report must reconcile all confirmed decisions relevant to the next phase and identify anything missing, ambiguous, contradictory, or represented only in a lower-authority source.

A completely new Director chat will be used for the next validation test.

## Restart Procedure

1. Read `AGENTS.md`.
2. Read `Docs/WORK_STATE.md`.
3. Read `Docs/CURRENT_HANDOVER.md`.
4. Read `Docs/CONFIRMED_DECISIONS.md`.
5. Read task-relevant authoritative documents.
6. Verify Git state.
7. Reconcile the next task against relevant confirmed decisions.
8. Report gaps or contradictions before continuing.

## Governance Boundary

- The Session Handover Protocol remains proposed and non-adopted during validation.
- DEC-020 confirms only the later evaluation and integration direction of the AI-orchestrated 3D asset pipeline.
- The pipeline's detailed architecture, workflow, permissions, quality gates, and governance status remain proposed and unresolved in the Governance Backlog.

## Exact Next Task

Review and commit continuity version 2, then generate a Director Sync Report that includes decision-continuity reconciliation for a completely new Director chat.

## Known Uncertainties

- DEC-023 remains open: select the private Git remote and backup model.
- Continuity version 2 has not passed the fresh-Director validation test yet.
- No maintenance cadence or completion criteria for the continuity experiment has been approved.
