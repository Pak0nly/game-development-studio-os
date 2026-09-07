# Authority Continuity and Director Dispatch Validators

**Capability ID:** `STUDIO-CAP-AUTHORITY-CONTINUITY-001`  
**Type:** Studio-owned local governance utility  
**Owner:** Studio Authority Continuity tooling  
**Last verified:** 2026-08-22  
**Current disposition:** Active read-only authority/drift checks plus adopted
receipt-bound Director dispatch gate; never grants continuation by itself.

## Identity and Availability

- Root: `Tools/AuthorityContinuity/`.
- Main surfaces: `validate_authority.py`, `authority-core.json`,
  `validate_director_dispatch.py`, dispatch schema and regression tests.
- Requires local Python only; no daemon, network, package, secret or installation.

## Intended Uses

- Problem tags: `authority`, `continuity`, `stale source`, `dispatch receipt`,
  `worker verification`, `dirty state`, `fail closed`.
- Strong uses: scoped authority snapshots and exact manifest/receipt verification
  before a separate mutation-capable task dispatch.
- Unsuitable uses: replacing canonical Markdown, granting Human authority,
  proving visual quality or defending against a malicious local agent.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Scoped authority validation is implemented | `STATICALLY VERIFIED` | [Tool README](../../../../../Tools/AuthorityContinuity/README.md) and tests | A valid snapshot still grants no continuation |
| Director/Worker receipt gate is adopted active | `ADOPTED` | `AGENTS.md` and tool README | Applies only to exact mutation-capable dispatches |
| Regression suite and deterministic identities exist | `RUNTIME PROVEN` in named adoption evidence | Tool README and report owner | Must be rerun after tool/source drift |

## Successful Applications

The dispatch gate has produced exact Director/Worker checks for bounded Crime99
tasks and prevents stale or mismatched Work Orders from silently mutating state.

## Failed Applications

An `E_*` or blocked scope is evidence of a stale/missing contract, not a reason
to weaken hashes or edit the authority core until it passes.

## Decision Guidance

- Use for every separate mutation-capable Director dispatch.
- Use the smallest applicable scope for read-only authority diagnostics.
- Technical debt avoided: repeated copied governance prose and stale handoffs.

## Unknowns and Refresh Triggers

- Refresh and independently review after canonical-source, schema or validator changes.

## Search Tags

`authority`, `dispatch`, `receipt`, `verify-director`, `verify-worker`, `stale`, `continuity`

