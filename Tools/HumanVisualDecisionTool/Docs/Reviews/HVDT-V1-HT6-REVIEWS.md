# HVDT-V1-HT6 — Mandatory Role Reviews

Candidate: `HVDT-V1-HT6`

Candidate aggregate SHA-256:

`96DF6C1C2AA8AB15638298C5E053B5FF20E42C9530E3461DD0FD369F32A8FCB6`

All reviewers used the exact frozen 21-file identity. No reviewer edited the
candidate or opened, viewed, or interpreted a preview, screenshot, texture, or
other Vendor visual content.

## UI/UX Reviewer

**Verdict:** `FAIL`

**Verified evidence:**

- `21/21` file hashes and the aggregate matched before and after review.
- The four ordinary repair candidates expose explicit use, reject, and defer
  dispositions; defer shows and requires a Human reason; rejecting every
  candidate is allowed.
- A completed category is invalidated on subsequent edits, its derived note is
  cleared, and only guided continuation completes it again.
- Decision/comparison pressed states, current navigation, dialog labelling,
  progress semantics, skip navigation, and visible focus are present.

**Hard fail:**

- Decisions 1–7 expose `Auswahl speichern und weiter`, but decision 8 exposes
  `Auswahl speichern und Entscheidungen prüfen`. The checklist and README name
  only the first label.
- The exact summary actions `Entscheidungen prüfen` and `Entscheidungen
  exportieren` are not stated as exact control labels in the checklist.

The authorised checklist/help/control alignment class is therefore incomplete.

**Concerns:**

- The footer retains the English word `package`.
- The progressbar has value semantics but no dedicated accessible name.
- The focused source test checks only that one continuation label occurs
  somewhere; it does not compare every exact control label with the checklist.

## Software Engineer / Technical Director

**Verdict:** `FAIL`

**Verified evidence:**

- `21/21` candidate files and aggregate matched before review.
- Normal Guided selection edits invalidate completion and keep frontend/server
  derived-status semantics aligned.
- Package binding, deterministic result hashing, local-only service, text-only
  export, and protected boundaries remain intact.

**Hard fail:**

The package uses `allowDeferred: true` for individual repair-option deferral.
That same flag also permits the entire repair category to use status
`DEFERRED`. Both client and server return early for a deferred category before
the `approveReject`, per-option reason, and derived-note rules execute.

An independent final-validation probe passed with:

- repairs category status `DEFERRED`;
- a valid category comment;
- all four repair-option decisions `UNRESOLVED`; and
- an empty implementation note.

The result was created and hash-bound without a single explicit repair
disposition. This violates the central four-candidate completeness requirement.

**Required correction:**

- Separate category-level deferral from option-level deferral, or prohibit
  category-level deferral for repairs.
- Require `repairs-wear` to be `COMPLETED` with four explicit option
  dispositions at final validation and reopen.
- Add draft, API, finalisation, and reload negative coverage.

## QA Lead

**Verdict:** `FAIL`

**Verified evidence:**

- Candidate identity: `21/21`, exact aggregate.
- Full regression: `85/85 PASS`.
- Python compilation, JavaScript syntax, whitespace, index, cleanup, preview
  identity, and five protected hashes passed.
- Additional adversarial checks: `51/54 PASS`.
- Functional repair and derived-state checks: `40/40 PASS`.
- UI/accessibility/documentation contract checks: `11/14 PASS`.

**Hard fail:**

The same three exact-label checks failed:

1. `Auswahl speichern und Entscheidungen prüfen`;
2. `Entscheidungen prüfen`; and
3. `Entscheidungen exportieren`.

Passing functional tests cannot override the formal Human-usability contract.

## Asset & Provenance Manager

**Verdict:** `PASS`

**Verified evidence:**

- Candidate hashes and aggregate matched before and after review.
- Package/manifest/registration identity was `21/21/21`, with zero ID, hash,
  dimension, or approved-root mismatch.
- Registration binds to package hash
  `FB1CE9475BC428037BD104954F5BEEB84F6834CEB879D875AE0BCEB9925E9168`.
- The nine Vendor material paths and GUIDs match the package and generator.
- Vendor sources are read only; repair adapters are transient
  `HideAndDontSave`; no production scene is opened or saved.
- Temporary helper, draft, QA result, recovery, and other QA residue are absent.
- The five protected Crime99 records retain their exact hashes.
- Text-only export safeguards and local-only dependency boundaries remain.

**Concerns:**

- Historical licence retrieval remains pending and historical AI exposure
  remains authoritative.
- Runtime registration contains ignored local absolute paths.
- Unsupported direct Unity-helper invocation still trusts its output variable.

No Asset & Provenance hard fail was found. This scoped `PASS` does not override
another mandatory role's lower verdict.
