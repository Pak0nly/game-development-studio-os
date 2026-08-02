# Role Review Output Schema

**Status:** Adopted; amended through `SOS-GOV-AAPEC-V1` on 2026-07-29 and `C99-STUDIO-REVIEW-IDENTITY-ART-DIRECTION-PRODUCER-STOP-GATE-V1` on 2026-07-30.

## Required Output

Every active role records the following fields independently:

```text
Role:
Reviewed Scope:
Review Execution State: completed / REVIEW NOT PERFORMED
Actual Reviewer Identity:
Separate from Builder: yes / no
Reviewed Candidate Identity:
Evidence Reviewed:
Strengths:
Defects:
Hard Fails:
Concerns:
Required Corrections:
Optional Improvements:
Open Human Decisions:
Earliest Invalid Production Gate or None:
Verdict:
```

Use exact candidate and evidence references. `None` is permitted only after an actual completed review; a blank field is incomplete. `REVIEW NOT PERFORMED` is a blocking execution state, not a verdict: identify the intended role and candidate and state why it could not run. Strengths do not cancel defects. Optional improvements must not be disguised scope additions.

## Verdicts

- `PASS`: all role-critical requirements pass; no material concern remains.
- `PASS WITH CONCERNS`: minimum bar passes and no hard fail remains, but bounded concerns are documented.
- `FAIL`: a mandatory requirement or hard-fail criterion is unmet.
- `BLOCKED BY HUMAN DECISION`: the role cannot determine passage without a genuine Human-owned product, taste, budget, scope, purchase, or equivalent decision.
- `NOT APPLICABLE`: the Producer documented why the role or a specific check does not apply to this scope.

`BLOCKED BY HUMAN DECISION` must not be used for missing effort, evidence, or an in-scope correction. `NOT APPLICABLE` must not waive a mandatory role silently.

`PASS`, `PASS WITH CONCERNS`, `FAIL`, `BLOCKED BY HUMAN DECISION`, and `NOT APPLICABLE` are the only formal role verdicts. Invented variations, `PENDING`, `REVIEW NOT PERFORMED`, missing evidence, and blank fields are invalid blocking execution states, not verdicts.

## Handoff Gate

A normal consolidated handoff is allowed only when:

- no mandatory role reports `FAIL`;
- no hard fail remains open;
- every mandatory applicable role reports at least `PASS WITH CONCERNS`;
- every mandatory record is completed by an actual reviewer with the required separation, exact final candidate, and exact evidence;
- all remaining concerns, evidence gaps, and Human decisions are explicit;
- affected roles have reviewed the final corrected result, not an earlier build.

The Producer reports the lowest verdict without averaging. A `FAIL` cannot be rewritten as a pass. A blocked Human decision produces a blocked handoff package, not an approval package.

## Correction Trace

For each correction round, append:

```text
Correction Round: 1 or 2
Triggering Role Findings:
Corrections Performed:
Evidence Replaced or Added:
Roles Re-reviewed:
Remaining Findings:
```

The final package preserves earlier divergent findings and labels which ones were resolved.
