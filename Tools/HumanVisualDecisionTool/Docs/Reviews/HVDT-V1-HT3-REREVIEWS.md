# HVDT-V1-HT3 — Formal Re-reviews

Candidate: `HVDT-V1-HT3`

Review date: `2026-07-23`

All reviewers assessed the exact eleven-file identity recorded in
`Docs/TECHNICAL_VALIDATION.md`. Each independently reproduced the recorded hashes,
including Crime99 package SHA-256:

`2EFBF44D8C6193F7A2EC263C374C992564B7B2884E8FA22A5A01806C4D74E245`

No reviewer opened or inspected Vendor imagery. Evidence was limited to text,
source, schemas, hashes, automated non-visual tests, adversarial probes, and the
recorded text-only local browser run.

## UI/UX Reviewer

**Role:** UI/UX Reviewer

**Reviewed Scope:** Formal non-visual re-review focused on closure of the HT2 stale
N/A-reason defect, the actual Crime99 explicit-Defer workflow, and any new
code- or text-evident UI hard fail.

**Evidence Reviewed:** Technical validation; README; Human checklist; browser
application; Crime99 package; affected draft/result behavior; HT2 UI/UX findings;
all eleven candidate hashes.

**Strengths:**

- N/A reasons are cleared on browser transitions, including entry into Deferred,
  rejected for every other status, sanitised on draft load with preservation, and
  rejected in incompatible reopened results.
- Crime99 presents no package-disallowed category or option `DEFER` action. Its
  geometry categories expose an ordinary option labelled `Defer`, selected with
  `SELECT`.
- Package text, card instruction, README, checklist, and the recorded browser flow
  now describe the same interaction.
- The explicit Defer option was completed with required Human input and correctly
  counted by validity-based progress.
- Existing navigation, exclusive selection, structured inputs, local-only state,
  recovery messaging, and deterministic export UI remain present.

**Defects:** No stage-exit UI defect. A bounded copy inconsistency remains: the
phrase “reason or fields” may imply an alternative although Crime99 completion
requires both the category reason and listed implementation fields. Validation
still prevents incomplete export.

**Hard Fails:** None.

**Concerns:** Formal Human visual/usability testing remains pending. Text/code-only
review cannot establish comparison comfort, wording comprehension, keyboard flow,
or extended-session usability. Conditionally required fields are not visually
distinguished from optional fields.

**Required Corrections:** None from the UI/UX domain before local Human-test entry.

**Optional Improvements:** Say “category reason and required implementation
fields”; highlight the required deferral-reason field; mark conditional required
fields; focus the first invalid field.

**Open Human Decisions:** Human usability and visual approval remain Human-owned
after technical stage-exit blockers are closed.

**Verdict:** `PASS WITH CONCERNS`

## Software Engineer / Technical Director

**Role:** Software Engineer / Technical Director

**Reviewed Scope:** Formal read-only re-review of the eight named HT2 blockers:
N/A state, Defer contract, package-relative preview hashing, scheme-relative/CSS
visual references, strict field types, malformed-draft recovery,
schema/executable consistency, and reopened-result binding.

**Evidence Reviewed:** Current technical validation; exact Python and browser
source; schemas; Crime99 package; tests; all eleven hashes; independent
`63/63 PASS`; `git diff --check`; targeted adversarial probes.

**Strengths:**

- N/A handling, explicit Crime99 Defer workflow, package-relative hash checks,
  ordinary domain-based scheme-relative/CSS rejection, draft/finalisation field
  types, malformed-draft recovery, primary rule shapes, and result identity/hash
  checks are materially improved.
- A package-relative hash mismatch, object in a text field, and array-valued status
  all fail safely.
- Exact malformed bytes are recoverable, and overwrite requires explicit Human
  confirmation.
- Reopened results require active decision-set and package hashes.

**Defects:**

- Scheme-relative matching does not cover all URI authorities. IPv4, `localhost`,
  single-label hosts, and likely bracketed IPv6 can pass directly or through CSS
  `url(...)`.
- `validate_result()` accepts an empty category `options` array although the
  result schema requires at least one option.
- Result validation does not reapply active-package selection-mode semantics or
  compare category, option, mode, and field identities against the bound package.
- Browser `datetime-local` values lack an offset, while the published result schema
  uses RFC 3339 `date-time`.
- Smaller executable/schema differences remain, including nonblank descriptions.

**Hard Fails:**

- External visual-reference exclusion remains bypassable through uncovered URI
  authority forms.
- Executable completed-result validation is not equivalent to the published result
  schema; a schema-invalid, semantically empty completed category can be rehashed
  and accepted.

**Concerns:** A recomputable result hash proves deterministic integrity, not
authorship or package-semantic compatibility. The technical-validation alignment
claim is broader than the executable evidence supports.

**Required Corrections:** Reject all scheme-relative authority forms; require
non-empty result options and package selection semantics; validate result
categories, options, modes, fields, and types against the active package; align
timestamp semantics; add focused tests. A new candidate requires separate Human
authority.

**Optional Improvements:** Add a dedicated
`validate_result_against_package(result, package)` boundary; table-test executable
and schema nonblank constraints; explicitly document timestamp meaning.

**Open Human Decisions:** None on technical merit. Any further mutation requires
new Human authority.

**Verdict:** `FAIL — HVDT-V1-HT3 IS NOT READY FOR STAGE EXIT`

## QA Lead

**Role:** QA Lead

**Reviewed Scope:** Formal read-only regression and fail-safe review of all eight
authorised corrections.

**Evidence Reviewed:** Technical validation; HT2 findings; core source; schemas;
Crime99 package; complete tests; all eleven hashes; independent `63/63 PASS`;
JavaScript and JSON checks; focused adversarial probes.

**Strengths:**

- The retained 41-test baseline remains green with no observed regression in
  deterministic export, persistence, selection modes, loopback controls,
  traversal protection, shutdown, Markdown safety, or normal preview registration.
- N/A consistency, explicit Crime99 Defer, package-relative hashes,
  malformed-draft recovery, result identity/package-hash binding, controlled HTTP
  errors, preview integrity, and live-draft type validation pass their covered
  cases.
- Scheme-relative domain and CSS forms are rejected, and benign ordinary text
  containing “data” is retained.

**Defects:**

- Path-rootless external URI forms such as
  `https:external.invalid/vendor.png` and
  `url(https:external.invalid/vendor.png)` return no validation error.
- Reopened-result validation is not package-aware. A package-declared numeric field
  changed to string `"2.5"` was accepted after recomputing the valid result hash
  while retaining the active package hash.
- The result schema’s generic string-or-number field contract cannot alone enforce
  the bound package’s declared type.

**Hard Fails:**

- The external-image/text-only boundary remains bypassable.
- Strict result/reopen type validation and package/schema consistency remain
  incomplete.

**Concerns:** The 63 tests do not cover these reproduced failures. A result hash is
not authenticity evidence. Other package identity structures may also need
package-aware validation.

**Required Corrections:** Reject all external scheme forms, including path-rootless
and CSS forms; add adversarial URI tests; validate reopened category, option, mode,
field, type, and constrained values against the exact active package; add
rehashed-mutation tests. A further correction requires separate Human authority.

**Optional Improvements:** Share a table-driven adversarial URI corpus; mutation-
test all package-bound result identities; document integrity versus authenticity.

**Open Human Decisions:** Decide whether to grant another bounded tool-stage
correction. Human usability testing remains blocked.

**Verdict:** `FAIL — HVDT-V1-HT3 IS NOT READY FOR STAGE EXIT OR HUMAN TEST`

## Asset & Provenance Manager

**Role:** Asset & Provenance Manager

**Reviewed Scope:** Formal read-only review of dependency/licence inventory,
local-only and Vendor isolation, preview and result provenance, protected-source
integrity, and consequences of the newly reproduced hard fails.

**Evidence Reviewed:** Technical validation; architecture; third-party inventory;
preview workflow; README; `.gitignore`; text-only Crime99 package; registration,
serving, export, and reopen code; tests; independent identity and `63/63 PASS`;
QA adversarial evidence; imports, web runtime, and Git boundaries.

**Strengths:**

- The tool remains loopback-only, project-independent, dependency-free at runtime,
  and outside Unity projects.
- No third-party package, CDN, analytics, telemetry, or external runtime target was
  added.
- Registered and package-relative previews have deterministic identity, hash,
  signature, MIME, dimension, and size checks without image interpretation.
- Crime99 source provenance remains text-only and strongly traceable.
- Normal results record package, source, Human, and result hashes without preview
  bytes or paths.
- Runtime data remains Git-ignored. No Vendor visual file or protected Crime99
  production asset was opened or mutated.

**Defects:**

- The text-only export boundary misses valid external URI forms.
- Result reopen checks identity and hashes but not the implementation-field
  contract of the bound package.
- The generic result schema is insufficient as a complete cross-file provenance
  guarantee.
- The technical validation’s complete-closure claim is contradicted by adversarial
  evidence.

**Hard Fails:**

- The tool contract cannot guarantee exclusion of all external image references.
- Result provenance is not sufficiently bound to active-package semantics; type-
  incompatible rehashed implementation metadata can be treated as current.

**Concerns:** SHA-256 is integrity, not authenticity. Runtime registrations contain
absolute local paths and should not be shared. A future distribution needs
concrete Python/Tcl/Tk/browser inventory. Broad pre-existing untracked state limits
historical attribution from Git status alone.

**Required Corrections:** Close all external URI variants; add adversarial tests;
perform package-aware result semantic validation; update technical validation and
candidate identity after separately authorised correction; repeat provenance
review.

**Optional Improvements:** Warn against sharing RuntimeData; inventory packaged
runtime components; share one package-aware validator across generation, reopen,
and downstream handoff; distinguish hash, identity, and semantic validity in UI.

**Open Human Decisions:** Any new tool-stage correction needs new authority.
Vendor licensing, visual selection, and Art Direction remain Human-owned.

**Verdict:** `FAIL — HVDT-V1-HT3 IS NOT READY FOR ASSET/PROVENANCE STAGE EXIT OR HUMAN TEST`
