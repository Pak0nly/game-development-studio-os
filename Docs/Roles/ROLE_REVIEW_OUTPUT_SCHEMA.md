# Role Review Output Schema

## Required Output

Every active role records the following fields independently:

```text
Role:
Reviewed Scope:
Evidence Reviewed:
Strengths:
Defects:
Hard Fails:
Concerns:
Required Corrections:
Optional Improvements:
Open Human Decisions:
Verdict:
```

Use exact evidence references. `None` is permitted only after an actual review; a blank field is incomplete. Strengths do not cancel defects. Optional improvements must not be disguised scope additions.

## Verdicts

- `PASS`: all role-critical requirements pass; no material concern remains.
- `PASS WITH CONCERNS`: minimum bar passes and no hard fail remains, but bounded concerns are documented.
- `FAIL`: a mandatory requirement or hard-fail criterion is unmet.
- `BLOCKED BY HUMAN DECISION`: the role cannot determine passage without a genuine Human-owned product, taste, budget, scope, purchase, or equivalent decision.
- `NOT APPLICABLE`: the Producer documented why the role or a specific check does not apply to this scope.

`BLOCKED BY HUMAN DECISION` must not be used for missing effort, evidence, or an in-scope correction. `NOT APPLICABLE` must not waive a mandatory role silently.

## Handoff Gate

A normal consolidated handoff is allowed only when:

- no mandatory role reports `FAIL`;
- no hard fail remains open;
- every mandatory applicable role reports at least `PASS WITH CONCERNS`;
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
