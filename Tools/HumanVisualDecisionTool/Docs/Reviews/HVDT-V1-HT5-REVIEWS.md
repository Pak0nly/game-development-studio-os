# HVDT-V1-HT5 — Mandatory Role Reviews

Candidate: `HVDT-V1-HT5`

Candidate aggregate SHA-256:

`D836B39996F5BD116D4C1B8497876068A2CD981A498DE27E0E7668FD05018762`

All reviewers worked from the exact 21-file frozen identity. No reviewer edited
the candidate or opened a preview, screenshot, texture, or other Vendor visual
content.

## UI/UX Reviewer

**Verdict:** `FAIL`

**Verified evidence:**

- `21/21` candidate hashes and the aggregate matched.
- Crime99 opens in German Guided Human Mode at decision 1 of 8.
- Technical inputs remain inside closed advanced details.
- The normal category input is an optional plain-language comment.
- The summary exposes eight change actions and text-only export controls.

**Hard fails:**

1. The multiple-choice repairs category requires only one selection. Remaining
   ordinary candidates may stay unresolved and the result can still validate,
   so rejected and not-reviewed are not distinguished.
2. The Human checklist says `Entscheidung speichern und weiter`, while the
   interface exposes separate `Auswahl speichern` and `Weiter` controls.
3. Some guided accessibility, alternative, recovery, result, and validation
   strings remain English.
4. Decision and comparison toggles do not expose `aria-pressed`; active
   navigation does not expose `aria-current`.
5. Dialog labelling and programmatic progress semantics are incomplete.

**Required correction:** Explicitly resolve every ordinary repair option; align
the checklist and primary continuation label; complete German guided-mode
strings; and expose selection, navigation, dialog, and progress states
programmatically.

## Software Engineer / Technical Director

**Verdict:** `FAIL`

**Verified evidence:**

- `21/21` candidate hashes and the aggregate matched before and after review.
- `80/80` tests passed independently.
- Package, manifest, registration, hashes, sizes, dimensions, and approved roots
  matched for all 21 previews.
- The Unity generator uses fixed empty scenes and contains no production-scene
  open or save call.
- Local-only security, package binding, deterministic result hashing, and
  text-only export remain intact.

**Hard fail:**

`guidedImplementationStatus()` is assigned when the Human uses the guided
continuation action. If an already completed category is reopened and its
selection changes, the category can be saved or left without recomputing the
implementation note. The authoritative result may therefore retain a stale
defer/no-suitable note for a material decision, or retain
`TECHNICAL MAPPING PENDING` for a newly deferred decision.

**Required correction:** Recompute the guided implementation status after every
selection change or mark the category unresolved until guided continuation is
completed. Add regression coverage for every supported edit/save/navigation
path.

**Concern:** Drafts remain keyed by decision-set ID rather than exact source
package hash.

## QA Lead

**Verdict:** `PASS`

**Verified evidence:**

- `21/21` candidate hashes and the aggregate matched before and after review.
- Python `5/5`, JavaScript syntax, whitespace, and `80/80` regression tests
  passed.
- Additional focused/adversarial QA: `29/29 PASS`.
- Package, manifest, and registration contain exactly 21 matching IDs.
- Tampered package/content hashes are rejected.
- Launcher registration precedes server start.
- Prepared repairs have four pairwise-distinct hashes.
- Text-only JSON and Markdown contain no image payload, preview path, base64,
  embedded media, or external image reference.
- Local socket binding and the five protected Crime99 hashes matched.
- No temporary generator or QA directory remained.

QA found no separate defect within its executed test scope. Its `PASS` does not
override the mandatory UI/UX and Software/TD failures.

## Asset & Provenance Manager

**Verdict:** `PASS`

**Verified evidence:**

- `21/21` candidate hashes and the aggregate matched.
- Package, prepared manifest, registration, and registered copies matched
  `21/21`, with no ID, hash, or dimension mismatch.
- All `9/9` audited Vendor material paths exist, their `.meta` GUIDs match the
  package, and the generator covers the exact same unique material set.
- Vendor materials are loaded read only; transient repair materials use
  `HideAndDontSave`.
- The temporary Unity helper and `.meta` are absent.
- RuntimeData is Git-ignored and exports exclude its local absolute paths.
- The five protected Crime99 records reproduced their known hashes.
- No remote dependency, telemetry, CDN, or runtime download was introduced.

**Concerns:** Historical licence retrieval remains pending; direct unsupported
Unity-helper invocation trusts its output environment variable; two
geometry-state identities intentionally reuse equal content hashes.

No Asset & Provenance hard fail was found. This `PASS` does not override another
mandatory role's lower verdict.
