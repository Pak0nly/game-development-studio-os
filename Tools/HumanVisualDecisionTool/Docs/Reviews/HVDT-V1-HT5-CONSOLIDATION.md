# HVDT-V1-HT5 — Producer Consolidation

**Final reviewed candidate:** `HVDT-V1-HT5`

**Candidate aggregate SHA-256:**

`D836B39996F5BD116D4C1B8497876068A2CD981A498DE27E0E7668FD05018762`

## Scope

This consolidation covers only the frozen HVDT candidate and its entry into the
second local Human usability test. It does not authorise candidate mutation,
Crime99 Surface correction, visual judgement, Vendor inspection, production
implementation, staging, commit, push, or broader deployment.

## Evidence

- Automated validation: `80/80 PASS`.
- Independent focused QA: `29/29 PASS`.
- Candidate aggregate independently reproduced and unchanged.
- Prepared preview and provenance identity: `21/21/21`.
- Protected Crime99 hashes unchanged.
- No image, screenshot, texture, preview, or Vendor visual content inspected.
- Authorised post-freeze correction rounds remaining: `0`.

## Verdict Matrix

| Mandatory role | Verdict | Controlling finding |
|---|---|---|
| UI/UX Reviewer | `FAIL` | Incomplete repairs disposition, checklist/control mismatch, and accessibility/German gaps |
| Software Engineer / Technical Director | `FAIL` | Completed decisions can retain stale mapping status after editing |
| QA Lead | `PASS` | Regression and focused non-visual checks passed |
| Asset & Provenance Manager | `PASS` | Identity, provenance, approved roots, cleanup, and protected boundaries passed |
| Producer / Scope Controller | `FAIL` | Lowest-verdict authority adopts the mandatory failures |

## Hard Fails

- The repairs workflow does not require a complete, unambiguous disposition for
  every ordinary candidate.
- The formal Human checklist and implemented continuation controls do not agree.
- Required accessibility and German-language gaps remain in the Human flow.
- Editing an already completed decision can leave stale technical-mapping status
  in the authoritative result.

These affect the Human usability requirement directly. Passing automated tests
and provenance checks cannot outweigh them.

## Correction Accounting

- HT4-to-HT5 authorised correction pass: `consumed`.
- Authorised post-freeze HT5 correction rounds: `0`.
- Crime99 Surface formal corrections consumed: `0 of 1`.
- Candidate and production mutation are not permitted under the exhausted
  authority.

## Required Next Authority

The Human Developer must explicitly authorise a new bounded correction candidate
covering at minimum:

1. complete repairs disposition semantics;
2. checklist/control alignment;
3. identified accessibility and German-language corrections; and
4. deterministic clearing or regeneration of mapping status whenever a
   completed decision changes.

A corrected candidate requires a new exact identity, full regression, focused
negative checks, browser QA, and all mandatory reviews. The second local Human
usability test must not begin on HT5.

## Consolidated Verdict

`FAIL — HVDT-V1-HT5 does not pass Stage Exit or qualify for the second local Human usability-test entry.`

**BLOCKED — HUMAN USABILITY REQUIREMENT REMAINS**
