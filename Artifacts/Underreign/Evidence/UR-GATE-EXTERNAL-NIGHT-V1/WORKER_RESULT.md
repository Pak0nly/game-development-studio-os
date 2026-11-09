# Worker Result — UR-GATE-EXTERNAL-NIGHT-V1

Project: Underreign (DEC-041). Role: Worker (separate Claude Code subagent). No commit, no Unity, nothing under `C:\GameDev` touched.

## Gate entry

```text
PASS worker receipt 9b3a1f82c19a9945a721cb0f1feea9bf306ade4d774000d0f598a7befb972ffc
```

Run before any mutation, from the repository root, with the exact command in the Work Order. (After this task the technical baseline `Tools/UnderreignDispatchGate/validate_underreign_dispatch.py` has changed by design, so that receipt no longer verifies.)

## Files changed

| File | Change (git numstat +/-) |
| --- | --- |
| `Tools/UnderreignDispatchGate/validate_underreign_dispatch.py` | +709 / -37: external-root section, `cloud_night` mode, `verify-night-return` subcommand, `ext:` closure candidates, closure `night_return`, `Night return receipt:` marker; budget removed |
| `Tools/UnderreignDispatchGate/underreign-dispatch-schema-v1.json` | +31: `execution_locations`, `external_project` (allowed root `C:/GameDev/Underreign` only, no budget cap), `required_night_return_receipt_fields` |
| `Tools/UnderreignDispatchGate/tests/test_validate_underreign_dispatch.py` | +577: new `ExternalAndNightTests` class (34 tests) |
| `Tools/UnderreignDispatchGate/README.md` | +63 / -1: command list, "External project root", "Night-shift mode", "Evening and morning steps", "Honest limits", test note |
| `Artifacts/Underreign/Evidence/UR-GATE-EXTERNAL-NIGHT-V1/WORKER_RESULT.md` | new (this file) |

Candidate identity after the change (`candidate-identity --root .`): `3c5f4850bd0cd679eb3e996c42182c4f94f6ac0f5c97fd19a048f9d748364a20`.

## Method

The source gate (`Tools/HearthlandsDispatchGate`, read-only) was diffed against the Underreign gate with project names masked: the Underreign validator was exactly the source minus the two features. The source validator was copied, renamed case-preserving (Hearthlands -> Underreign, HL-GATE-EXTERNAL-NIGHT-V1 -> UR-GATE-EXTERNAL-NIGHT-V1), the original Underreign module header restored, and the budget removed. A diff of the result against the previous Underreign file showed only the feature hunks (no other Underreign line changed). The source test section was ported the same way; the Hearthlands-only second/third-root worktree tests were not ported (Underreign has one root and its own repository).

Adaptations as ordered:

1. Allowed external roots: exactly `C:/GameDev/Underreign`. Test proves near misses fail with `E_EXTERNAL_ROOT_NOT_ALLOWED` against the production schema: `C:/GameDev/Underreign2`, `C:/GameDev/Underreig`, `D:/GameDev/Underreign`, `C:/GameDev`, `C:/GameDev/Underreign/sub`, `C:/GameDev/underreign`, `C:/Underreign`, `C:/GameDev/Underreign-Zwerge`, `C:/GameDev/Hearthlands`, `C:/GameDev/Hearthlands-Zwerge`, `C:/GameDev/Hearthlands-Wege`. The allow-list check runs before any filesystem access.
2. No budget (see below).
3. Night branch `night/<YYYY-MM-DD>` with real-date check, evidence dir inside external allowed mutations, return-receipt rules, merge-base, no merge commits, protected paths (case-insensitive, deletions included), symlink/submodule rejection and closure markers in `Projects/Underreign/Docs/WORK_STATE.md` / `CURRENT_HANDOVER.md`: unchanged from the source. Return receipt kind: `underreign_night_return_receipt`.
4. Independent copy (grep proof below). Existing protection-only forbidden roots unchanged.
5. Existing behaviour: manifests without the new sections take none of the new paths, receipts gain no new keys (test `test_old_manifest_receipt_has_no_external_keys`); all 41 existing tests pass unchanged.

## Budget choice

Rejected, not ignored. `budget` is no longer a night field and the schema has no `budget_cap_eur_max`; there is no `E_NIGHT_BUDGET`. A supplied `budget` field is rejected on every manifest (local, external or `cloud_night`) with `E_NIGHT_FIELDS_UNEXPECTED` ("fields not supported by the Underreign gate (no night budget)"). Reason: fail-closed and honest; a silently ignored budget would look like an enforced cap that does not exist. No existing Underreign manifest carries a `budget` field (grep over `Artifacts/Underreign/DirectorDispatch/*/*.json` empty), so no current behaviour changes. Documented in the README "Night-shift mode" section. Test: `test_night_needs_no_budget_and_rejects_a_supplied_one` (night manifest without budget passes and the receipt's `night_shift` holds only `branch` and `evidence_dir`; budgets `{...}`, `{}`, `null`, `0` on night, and a budget on an external-local and a plain manifest, all fail).

## Test counts

```text
before: python -B -m unittest discover -s Tools/UnderreignDispatchGate/tests  ->  Ran 41 tests ... OK
after:  python -B -m unittest discover -s Tools/UnderreignDispatchGate/tests  ->  Ran 75 tests ... OK  (41 existing + 34 new)
```

New tests: external section (10: old manifest unchanged, valid external, uninitialised absent/empty/non-empty, production allow-list and near misses, dirty drift, untracked drift, HEAD/branch drift, allowed/protected overlap, stale receipt, stripped receipt), `ext:` closure (5), night manifest (3, incl. the budget rejection), night return (12), night closure (4). Tests use a temporary Studio repository, a temporary external repository and a temporary schema copy; the live `C:/GameDev/Underreign` is never named as a used root (the production-schema test rejects roots before any filesystem access). No `__pycache__` left behind (`python -B` throughout; `find` empty).

## Independence grep proof

```text
$ grep -n "^import \|^from \|^    import \|sys.path" validate_underreign_dispatch.py tests/test_validate_underreign_dispatch.py
validator: only stdlib (argparse, datetime, hashlib, json, os, re, stat, subprocess, sys, tempfile, pathlib, typing)
tests:     stdlib + sys.path.insert(0, TOOL_ROOT) + validate_underreign_dispatch (own module) + unittest.mock

$ grep -n -i "hearthlands\|mobilearc\|ClaudeDispatchGate\|AuthorityContinuity" validate_underreign_dispatch.py
5:not import from or depend on ``Tools/AuthorityContinuity``.     (docstring only, pre-existing)

$ grep -n -i "hearthlands\|mobilearc\|ClaudeDispatchGate\|AuthorityContinuity" underreign-dispatch-schema-v1.json
14-23: forbidden_mutation_roots entries (pre-existing, protection only)

$ grep -n -i "hearthlands\|mobilearc\|ClaudeDispatchGate\|AuthorityContinuity" tests/test_validate_underreign_dispatch.py
186, 399: pre-existing protection tests
877-882: new hostile-root string literals that must be REJECTED

$ grep -n "GameDev" validate_underreign_dispatch.py underreign-dispatch-schema-v1.json
schema:74: "C:/GameDev/Underreign"     (the only allowed external root)
```

No import of, path to or shared state with any Hearthlands or MobileArc tool. Source files unchanged: `Tools/HearthlandsDispatchGate/README.md` sha256 `87e596e4...2371` equals the manifest's declared hash; all source file timestamps predate this task.

## Open points

- The dispatch receipt for this order no longer verifies after the change (its technical baseline is the old validator), as expected for gate maintenance; the Director needs fresh manifests for later orders.
- Not ported: the Hearthlands-only extra-root worktree tests. The gate code still works on a worktree root, but no Underreign test covers that case because Underreign has one root in its own repository.
- The README commands for evening and morning steps are documentation; no live night run has been done. The first night order will be the first real use.
- Review: an independent Reviewer is still required. This Worker's own checks do not count as one.
