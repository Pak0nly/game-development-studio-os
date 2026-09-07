# HVDT-V1-HT1 — Initial Formal Reviews

Candidate: `HVDT-V1-HT1`

Review date: `2026-07-23`

These independent reviews triggered the sole authorised tool-stage correction
round. No reviewer opened or inspected Vendor imagery.

## UI/UX Reviewer

**Role:** UI/UX Reviewer

**Reviewed Scope:** Non-programmer comprehension of categories, comparison,
decision entry, incomplete-work visibility, save/resume, and export.

**Evidence Reviewed:** HT1 browser UI, core validation, Crime99 package, README,
Human checklist, technical validation, and 22-test suite.

**Strengths:** Clear eight-category navigation; overview, progress, save state and
next-pending action; separated Human/technical option content; labelled A/B
comparison; comments, implementation inputs, save/reload, completion check,
confirmation and export; actionable missing-preview state; unsaved-change guard;
prominent desktop local-only notice.

**Defects:** Progress relied on manually marked status; errors were a flat
non-actionable list; multiple competing deferral models could preserve
contradictory state; no-suitable and materials were not exclusive; technical
mapping/numeric values were compound free text; primary preview registration
required JSON editing; the local-only indicator disappeared at narrow widths.

**Hard Fails:** Incomplete work could appear complete; contradictory deferred or
no-suitable results could finalise; mandatory privacy state disappeared on
supported responsive widths.

**Concerns:** Human visual testing, practical readability, keyboard flow,
comparison comfort, and extended-session fatigue remained pending.

**Required Corrections:** Validity-based progress; actionable navigation; one
unambiguous deferral model; mutual exclusion; structured/validated technical
fields; visible local-only state at all widths; guided preview registration; all
mode/conflict coverage.

**Optional Improvements:** Per-category validation counts; previous/next controls;
cross-category comparison labels; neutral technical examples.

**Open Human Decisions:** Local Human visual/usability testing after technical
correction.

**Verdict:** `FAIL`

## QA Lead

**Role:** QA Lead

**Reviewed Scope:** Functional coverage, local-only behavior, deterministic
exports, persistence, validation, previews, traversal, Windows paths, completed
result reload, graceful shutdown, and Human-test readiness.

**Evidence Reviewed:** HT1 code/docs/schemas/package; independent syntax check and
`22/22 PASS`; candidate hashes; targeted negative export test.

**Strengths:** Fixed loopback binding; restrictive policies; no runtime external
targets; draft/hash/deterministic result basics; incomplete-finalisation blocking;
missing-preview and basic traversal handling; Windows paths; ignored runtime data;
no external dependency.

**Defects:** Human text could embed Markdown/external/data images; coverage omitted
several modes/states/endpoints/security/registration cases; corrupt drafts silently
reset; completed results were not Human-reopenable; allowed extensions could spoof
content; registration identity/package hash was not enforced.

**Hard Fails:** The text-only/privacy boundary was bypassable, so the Definition of
Ready was not met.

**Concerns:** Schemas were shallow and not runtime authoritative; launcher Ctrl+C
was not exercised; Git evidence was limited by the untracked tool; Human browser
validation remained pending.

**Required Corrections:** Harden and escape export text; add adversarial tests;
expand all-mode/status/endpoint/security/registration coverage; preserve and
report corrupt drafts; re-review a new exact candidate.

**Optional Improvements:** Surface completed results; strengthen result validation;
test launcher shutdown; show registration/package mismatch clearly.

**Open Human Decisions:** None for the technical correction.

**Verdict:** `FAIL`

## Software Engineer / Technical Director

**Role:** Software Engineer / Technical Director

**Reviewed Scope:** HT1 source, schemas, package, launchers, documentation, tests,
architecture, persistence, preview serving, and local security.

**Evidence Reviewed:** All HT1 tool files; independent `22/22 PASS`; candidate
hashes; Git whitespace/status checks.

**Strengths:** Appropriate dependency-free architecture; repository/runtime
separation; loopback/CSP/Host/Origin controls; root-relative writes; canonical
result hashing; intended preview omission; actionable missing previews; Windows
paths; Human-only boundary.

**Defects:** Published schemas were not executable authorities; malformed packages
could escape controlled errors; registration package/hash fields were ignored and
hashes optional; preview serving relied on extension and lacked limits; WebP
support was incomplete; text-only scanning was bypassable; results could overwrite
on date/ID collision; JSON/Markdown/draft persistence could partially fail; browser
save races could clear dirty state; no-suitable could conflict with materials;
storage identifiers were unsafe; evidence omitted key endpoint/adversarial tests.

**Hard Fails:** Schema/invalid-package handling, deterministic preview binding,
text-only enforcement, and unambiguous repairs results were not ready.

**Concerns:** Loopback is not a same-user process boundary; technical textareas were
opaque; temporary filenames and writes could race; completed results were not
reopenable in the interface.

**Required Corrections:** Complete executable validation; bind registration and
preview hashes; remove or complete WebP; harden exports; make output
collision-safe; protect dirty state; add exclusivity and safe identifiers; expand
tests and result reopen.

**Optional Improvements:** Preview limits/streaming; structured implementation
fields; locking/versioning; result-open action; clearer startup diagnostics.

**Open Human Decisions:** HT1 originally raised overwrite policy, structured-field,
and WebP choices; HT2 resolved these choices within the authorised correction.

**Verdict:** `FAIL — NOT READY FOR HUMAN TEST`

## Correction Trace

**Correction Round:** 1

**Triggering Role Findings:** UI/UX, QA, and Software Engineering each returned
`FAIL`, with hard fails in progress/state clarity, text-only/privacy, schema/error
handling, deterministic preview binding, and contradictory result semantics.

**Corrections Performed:** Export hardening and Markdown escaping; package-bound
preview registration and content checks; exclusive and deferred-state rules;
validity-based progress and actionable navigation; persistent privacy indicator;
structured/conditional technical fields; guided registration; stricter schemas and
runtime validators; corrupt-draft visibility; completed-result reopen;
collision-safe/locked persistence; save-race protection; expanded tests.

**Evidence Replaced or Added:** Candidate `HVDT-V1-HT2`; 41-test suite; exact
candidate hashes; corrected browser evidence; updated architecture, workflows,
schemas, package, and Human checklist.

**Roles Re-reviewed:** UI/UX Reviewer, QA Lead, Software Engineer / Technical
Director. Asset & Provenance Manager was added for the final candidate.

**Remaining Findings:** UI/UX and Software Engineering still report hard fails on
HT2. No second correction round is authorised.
