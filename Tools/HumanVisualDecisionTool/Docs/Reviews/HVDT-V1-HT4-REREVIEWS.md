# HVDT-V1-HT4 — Formal Re-reviews

Candidate: `HVDT-V1-HT4`

Review date: `2026-07-23`

Crime99 package SHA-256:
`2EFBF44D8C6193F7A2EC263C374C992564B7B2884E8FA22A5A01806C4D74E245`

Review model: independent read-only reviews of the exact frozen hashes recorded in
`../TECHNICAL_VALIDATION.md`. The Human-accepted local-only V1 risks were treated
as deferred and were not used as failures by themselves. No reviewer edited the
candidate or opened Vendor imagery.

## Role Activation

- Software Engineer / Technical Director: `ACTIVATED`
- QA Lead: `ACTIVATED`
- Asset & Provenance Manager: `ACTIVATED`
- Producer / Scope Controller: `PENDING FINAL CONSOLIDATION`
- UI/UX Reviewer: `NOT ACTIVATED`
- Art Director, Technical Artist, visual QA, screenshot reviewer, multimodal
  reviewer: `NOT ACTIVATED`

UI/UX was not activated because HT4 did not materially change the visible
interaction or layout. No visual role was authorised because Vendor visual
inspection and final visual judgement remain Human-only.

## Software Engineer / Technical Director

**Reviewed Scope:** The four authorised Must-Fix areas: active-package binding,
complete and meaningful decisions, approved-local-preview allowlisting, and
stable deterministic JSON export/reload.

**Evidence Reviewed:**

- All eleven recorded HT4 SHA-256 hashes independently reproduced exactly.
- The Crime99 package hash remained unchanged.
- The complete suite independently passed: `76/76`.
- Loopback binding, Host/Origin rejection, CSP, same-origin resource policy,
  shutdown, preview containment, semantic-result rejection, and HTTP reload tests
  passed.
- `git diff --check -- Tools/HumanVisualDecisionTool` passed.
- The tool directory remained untracked and the Git index was not changed.

**Strengths:**

- Completed results are bound to the complete active-package identity and ordered
  semantic contract.
- Package-aware reload reapplies selection, completion, field, reason, comment,
  N/A, and explicit `Defer` rules.
- Preview registration copies verified bytes into the package-specific approved
  root; original selected paths are never served.
- Canonical JSON, deterministic hashing, atomic persistence, and package-aware
  validation preserve the authoritative result across export and reload.
- Rehashed but package-incompatible files are rejected without changing their
  source bytes.

**Defects:** None within the authorised Must-Fix scope.

**Hard Fails:** None.

**Concerns:**

- Operation must remain within the documented localhost-only, single-Human model.
- Approved RuntimeData preview copies require ordinary local storage management.
- Operational state files must be updated after Producer consolidation.

**Required Corrections:** None before local Human usability-test entry.

**Optional Improvements:**

- Later document cleanup of obsolete approved copies and historical results.
- A future remote/shared design must replace the accepted local-only risk model.

**Open Human Decisions:**

- The Human still decides usability and all visual selections.
- This tool verdict does not authorise the Crime99 Surface correction.

**Verdict:** `PASS — HVDT-V1-HT4 IS READY FOR LOCAL HUMAN USABILITY-TEST ENTRY`,
subject to final Producer consolidation.

## QA Lead

**Reviewed Scope:** Independent regression and bounded adversarial verification of
all four authorised Must-Fix areas.

**Evidence Reviewed:**

- All eleven frozen-candidate hashes independently matched.
- Complete automated suite: `76/76 PASS` in `4.735` seconds.
- JavaScript syntax validation: `PASS`.
- Additional isolated adversarial QA: `11/11 PASS`.
- Temporary QA data was removed; no repository file or Vendor imagery was
  touched.

The additional checks proved:

- rehashed whitespace-only required data and active-package stage mismatches are
  rejected without changing the source result;
- a Human-selected source is copied beneath the approved package root, the
  original source is not served, and outside-root registrations are rejected;
- identical input produces the same output path and byte-identical JSON;
- reload preserves the exact authoritative result object; and
- exports contain neither preview bytes nor preview paths.

**Strengths:**

- Result acceptance is bound to the complete active package.
- Finalisation and reopening apply meaningful completion rules consistently.
- Preview serving is confined to package-local or approved copied assets.
- Authoritative JSON is canonical, deterministic, hash-bound, and reloadable
  without semantic loss.

**Defects:** None within the authorised HT4 scope.

**Hard Fails:** None.

**Concerns:** None blocking local Human usability-test entry. Accepted local-only
risks remain deferred.

**Required Corrections:** None.

**Optional Improvements:** Reconsider deferred hardening after V1 usability
evidence, if separately authorised.

**Open Human Decisions:** None required for test entry; the next decision belongs
to the Human usability session.

**Verdict:** `PASS — HVDT-V1-HT4 IS APPROVED FOR ENTRY INTO THE BOUNDED LOCAL
HUMAN USABILITY TEST`.

## Asset & Provenance Manager

**Reviewed Scope:** Approved copied-preview roots, source/package/result
provenance, unchanged Crime99 identity, deterministic text-only exports,
dependency inventory, and protected-source isolation.

**Evidence Reviewed:**

- All eleven HT4 hashes independently matched.
- The unchanged Crime99 package independently matched SHA-256
  `2EFBF44D8C6193F7A2EC263C374C992564B7B2884E8FA22A5A01806C4D74E245`.
- The recorded `76 PASS` suite and its coverage were inspected. This reviewer
  could not independently rerun it because the Windows Python launcher was not
  available in that reviewer runtime; Software/TD and QA did independently rerun
  the same suite.
- Architecture, preview workflow, dependency inventory, schemas, package, source,
  and relevant tests were reviewed.
- No Vendor image was opened, inspected, copied, registered, attached, or
  transmitted.

**Strengths:**

- Only exact package-relative previews or verified package-specific approved
  copies can be served.
- Original selected paths are neither served nor retained in completed results.
- Traversal, outside-root registration, identity, type, signature, dimension,
  size, and hash boundaries are enforced.
- Results carry package identity, source context, Human identity/time, and a
  deterministic result hash; package-aware reopening preserves incompatible
  source files unchanged.
- Exports exclude preview assets, paths, bytes, thumbnails, base64, embeddings,
  and external image references.
- RuntimeData remains local and Git-ignored; no Unity or Vendor package is
  duplicated or mutated.
- No third-party package, CDN, analytics, telemetry, external API, or runtime
  download was added.

**Defects:** None within the authorised Asset & Provenance scope.

**Hard Fails:** None.

**Concerns:**

- RuntimeData contains absolute paths to approved local copies and must not be
  manually shared.
- Hashes prove integrity and identity, not Human authorship or licence
  entitlement.
- A later packaged distribution requires a concrete redistributed-runtime
  inventory.

**Required Corrections:** None before local Human usability-test entry. Update
operational state after Producer consolidation.

**Optional Improvements:** Add a prominent RuntimeData sharing warning and
separately inventory redistributed components if packaging is later authorised.

**Open Human Decisions:**

- Human usability, Vendor licence entitlement, visual selection, and final visual
  approval remain Human-owned.
- The Crime99 Surface correction remains `0 of 1`.

**Verdict:** `PASS — ASSET & PROVENANCE PERMITS LOCAL HUMAN USABILITY-TEST ENTRY
FOR HVDT-V1-HT4 WITHIN THE DOCUMENTED LOCALHOST-ONLY V1 MODEL`.

## Pre-Producer Board State

- Software Engineer / Technical Director: `PASS`
- QA Lead: `PASS`
- Asset & Provenance Manager: `PASS`
- UI/UX Reviewer: `NOT ACTIVATED — NO MATERIAL VISIBLE INTERACTION CHANGE`
- Producer / Scope Controller: `PENDING`

No candidate mutation occurred after freeze. The exact Human-required readiness
statement may be issued only after Producer consolidation.
