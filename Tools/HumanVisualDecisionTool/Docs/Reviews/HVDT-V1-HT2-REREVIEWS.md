# HVDT-V1-HT2 — Formal Re-reviews

Candidate: `HVDT-V1-HT2`

Review date: `2026-07-23`

No reviewer opened or inspected Vendor imagery. Review evidence was limited to
text, code, automated non-visual tests, missing-preview placeholders, and local
browser UI state.

## UI/UX Reviewer

**Role:** UI/UX Reviewer

**Reviewed Scope:** Formal re-review limited to the seven prior UI/UX findings:
validity-based progress, actionable validation navigation, deferred/N/A state
handling, exclusive selections, structured technical entry, guided preview
registration, and responsive local-only visibility.

**Evidence Reviewed:** `Docs/TECHNICAL_VALIDATION.md`; `web/app.js`;
`web/styles.css`; `decision_tool.py`;
`Packages/crime99-surface-material-v1.json`; `README.md`;
`Docs/HUMAN_TEST_CHECKLIST.md`; `guided_preview_registration.py`;
`Register-Local-Preview.cmd`; relevant tests. Recorded result: `41 PASS`;
missing-preview browser check only.

**Strengths:**

- Progress and next-pending navigation now derive from category validity.
- Validation errors provide category-level `Open category` actions.
- Entering `DEFERRED` or `NOT_APPLICABLE` clears option decisions, ranks,
  implementation fields, and implementation notes; the server rejects lingering
  selections and values.
- Exclusive `No suitable option` behavior is enforced in UI and server.
- Material values use structured, bounded, conditional fields.
- Preview registration now has a labelled Human file-picker flow.
- The local-only indicator remained visible at 800 px and 600 px.
- The corrected browser run had zero console errors.

**Defects:**

- `notApplicableReason` is not cleared when leaving `NOT_APPLICABLE`, and server
  validation does not reject a stale N/A reason for other statuses. A final
  `COMPLETED` or `DEFERRED` category can export a hidden contradictory reason.
- Crime99 represents deferral through explicit options labelled `Defer`, selected
  with `SELECT`, while the Human checklist instructs the tester to exercise the
  disabled `DEFER` action. The mandatory step is ambiguous as written.

**Hard Fails:**

- Package-permitted N/A workflows can export a status-incompatible N/A reason.
- The Human checklist does not accurately describe the Crime99 deferral
  interaction, so the minimum Human test cannot be executed cleanly as written.

**Concerns:**

- Human visual/usability testing remains pending.
- The indicator was not checked at the declared 320 px minimum.
- The reviewer suggested WebP in the guided chooser; however, V1 intentionally
  removed WebP support, so this specific concern is not applicable to HT2.

**Required Corrections:**

- Clear `notApplicableReason` whenever a category leaves `NOT_APPLICABLE`, or
  reject a nonblank N/A reason for every non-N/A status; add transition and server
  tests.
- Rewrite the Crime99 checklist to instruct the Human to select the explicit
  `Defer` option, record its required reason/fields, and mark the category complete.
- A further correction requires new Human authority because the sole tool-stage
  correction round is consumed.

**Optional Improvements:** Explain destructive status transitions inline; focus
the first invalid field from validation navigation; test 320 px top-bar behavior.

**Open Human Decisions:** Authorise or reject an additional tool-stage correction.
The local Human visual/usability test remains pending after blockers are closed.

**Verdict:** `FAIL`

## QA Lead

**Role:** QA Lead

**Reviewed Scope:** Formal re-review after the sole tool-stage correction round,
covering text-only export, all selection modes and status paths, corrupt drafts,
completed-result reopen, preview spoofing, registration binding, full HTTP flow,
Origin/traversal protection, and Windows process shutdown.

**Evidence Reviewed:** Technical validation; core Python and browser code; package
and result schemas; launchers; tests; independent `41/41 PASS`; JavaScript syntax;
all eleven recorded hashes; HTTP finalisation/list/reopen, Host/Origin rejection,
static traversal; Windows `CTRL_BREAK_EVENT` with exit code `0` and `Stopped.`.

**Strengths:**

- The original text-only and Markdown hard fail is closed, including adversarial
  Human text.
- All four selection modes, exclusivity, ordered ranks, approve/reject,
  deferred/N/A lingering state, typed fields, corrupt-draft visibility, completed
  result reopen, signature/MIME/dimension/hash checks, registration binding, full
  HTTP flow, local network controls, locked persistence, and collision-safe output
  are covered.
- The QA Definition of Ready is met on the reviewed evidence.

**Defects:** None.

**Hard Fails:** None.

**Concerns:** Actual `Ctrl+C` remains a Human-test step although automated
`CTRL_BREAK_EVENT` passed. A corrupt draft is preserved in place and could be
overwritten after the visible warning. The tool tree is untracked by explicit
scope.

**Required Corrections:** None for Human-test entry from the QA domain.

**Optional Improvements:** Add a separate `CTRL_C_EVENT` test; preserve corrupt
drafts under a distinct recovery name; add a visible hash-invalid reopen test.

**Open Human Decisions:** Local Human UI and real-preview testing remain pending;
this does not authorise Crime99 Surface correction.

**Verdict:** `PASS WITH CONCERNS`

## Software Engineer / Technical Director

**Role:** Software Engineer / Technical Director

**Reviewed Scope:** Formal read-only re-review of architecture, executable
validators, schemas, persistence, preview registration/serving, text-only
enforcement, Windows operation, browser state, Crime99 package, tests, and
technical validation.

**Evidence Reviewed:** Current source/docs/schemas; independent `41/41 PASS`;
eleven exact candidate hashes; `git diff --check`; targeted non-visual probes for
relative preview hash mismatch, structured-field type, malformed draft, and
scheme-relative external URLs.

**Strengths:**

- Most HT1 findings are closed: registered preview binding, WebP claim removal,
  ordinary URL/data/Markdown/HTML rejection, escaped Markdown, collision-safe and
  rollback-aware writes, process locking, frontend revision handling, exclusivity,
  safe identifiers, structured Crime99 fields, completed-result reopen, expanded
  endpoint/security/process tests, loopback/CSP, and dependency-free operation.

**Defects:**

- Package-relative preview files declare `expectedSha256` but are not compared
  against it before serving; a mismatch was independently served.
- Scheme-relative external image references such as
  `//external.invalid/private-preview.png` and CSS `url(//...)` pass the text-only
  guard.
- A dictionary supplied to a required textarea field can be finalised and accepted
  although the result schema permits scalar implementation-field values.
- Malformed draft status types can raise an unhandled `TypeError` instead of a
  Human-readable validation error.
- Published and executable validation-rule/count schemas are not fully equivalent.
- Completed-result reopen checks the decision-set ID but not the active source
  package hash.

**Hard Fails:**

- Deterministic package-relative preview hash binding is incomplete.
- Strict executable/type/error validation is incomplete.
- The external-image boundary is bypassable through scheme-relative URLs.

**Concerns:** Crime99 currently uses guided registrations, but the reusable generic
contract remains affected. The `data:` substring guard can produce false
positives. Locks are process-local. Output-directory segments are not checked for
all Windows aliases.

**Required Corrections:** Compare package-relative file hashes; reject
scheme-relative/CSS external image references; enforce field types and total draft
validation; align schemas and executable rules; bind reopened results to the active
package hash or label them historical. All require new correction authority.

**Optional Improvements:** Validate full registration objects; disable controls
during active requests; harden output-directory segment rules; replace broad
`data:` substring matching with syntax-aware URI checks.

**Open Human Decisions:** None on the technical merits. A new correction round
requires Human authority because the existing allowance is exhausted.

**Verdict:** `FAIL — HVDT-V1-HT2 IS NOT READY FOR STAGE EXIT`

## Asset & Provenance Manager

**Role:** Asset & Provenance Manager

**Reviewed Scope:** Dependency/licence inventory, local-only and Vendor isolation,
preview-registration provenance, result provenance fields, protected-source
non-mutation, and Vendor-content embedding or redistribution.

**Evidence Reviewed:** Dependency inventory, architecture, preview workflow,
README, tool `.gitignore`, text-only Crime99 package, core/registration/server code,
tests, technical validation, independent `41/41 PASS`, protected-path Git check,
Python import inventory, and web-runtime external-reference check.

**Strengths:**

- No third-party Python/JavaScript package, CDN, analytics, telemetry, or external
  runtime asset is present.
- Registered previews are local-only and recorded as text metadata bound to the
  active package and decision set.
- Crime99 provenance hashes and Human-only boundaries remain text-only.
- Results contain source/result provenance and omit preview paths/bytes.
- Runtime data is ignored; the tool does not copy Vendor packages, mutate Unity,
  or perform visual interpretation.
- The inventory explicitly avoids legal conclusions.

**Defects:** None in the provenance review scope.

**Hard Fails:** None in the provenance review scope.

**Concerns:** A packaged redistribution would need explicit Python/Tcl/Tk/browser
inventory. Absolute paths in ignored registrations could expose local path
information if RuntimeData were manually shared. The broad untracked repository
state limits historical attribution from Git status alone.

**Required Corrections:** None from the provenance domain.

**Optional Improvements:** Expand a future redistribution inventory; warn against
sharing RuntimeData; create a later text-only integration scope manifest.

**Open Human Decisions:** Vendor licence entitlement and visual selection remain
Human-owned. Redistribution would require a new concrete inventory.

**Verdict:** `PASS WITH CONCERNS`
