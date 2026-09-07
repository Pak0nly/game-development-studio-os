# HVDT-V1-HT6 — Producer Consolidation

**Final reviewed candidate:** `HVDT-V1-HT6`

**Candidate aggregate SHA-256:**

`96DF6C1C2AA8AB15638298C5E053B5FF20E42C9530E3461DD0FD369F32A8FCB6`

## Scope and Evidence

- Regression: `85/85 PASS`.
- Additional QA: `51/54 PASS`.
- Preview identity: `21/21/21`.
- Package SHA-256:
  `FB1CE9475BC428037BD104954F5BEEB84F6834CEB879D875AE0BCEB9925E9168`.
- Candidate identity, protected hashes, provenance, and cleanup were verified.
- No image was inspected and no candidate or production mutation occurred after
  freeze.

## Verdict Matrix

| Mandatory role | Verdict | Controlling finding |
|---|---|---|
| UI/UX Reviewer | `FAIL` | Final-category and summary control labels are not documented exactly |
| Software Engineer / Technical Director | `FAIL` | Category-level `DEFERRED` bypasses all four repair dispositions |
| QA Lead | `FAIL` | Exact documentation contracts passed only `11/14` |
| Asset & Provenance Manager | `PASS` | Identity, provenance, protection, and cleanup passed |
| Producer / Scope Controller | `FAIL` | Lowest-verdict authority adopts the mandatory failures |

## Hard Fails

1. The formal checklist/help does not name the actual controls exactly:
   `Auswahl speichern und Entscheidungen prüfen`, `Entscheidungen prüfen`, and
   `Entscheidungen exportieren`.
2. A direct or recovered draft may set the repairs category to `DEFERRED`.
   Server validation then exits before `approveReject`, per-option reason, and
   derived-status checks, allowing all four repair candidates to remain
   `UNRESOLVED` in a final hash-bound result.

## Correction Accounting

- HT5-to-HT6 authorised correction pass: `consumed`.
- Authorised post-freeze HT6 correction rounds: `0`.
- Formal Crime99 Surface corrections consumed: `0 of 1`.
- Candidate and production mutation are not permitted under the exhausted
  authority.

## Required Next Authority

The Human Developer must explicitly authorise a new bounded successor covering:

1. exact documentation of the three actual UI control labels;
2. prohibition or complete repair-specific validation of category-level
   deferral;
3. API, finalisation, reload, reopen, and negative tests for that bypass; and
4. a new exact candidate identity, full validation, and all five reviews.

## Consolidated Verdict

`FAIL — HVDT-V1-HT6 does not pass Stage Exit or qualify for the second local Human usability-test entry.`

**BLOCKED — HUMAN USABILITY REQUIREMENT REMAINS**
