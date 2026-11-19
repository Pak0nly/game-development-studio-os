# Inkweight Dispatch Gate

A cooperative, fail-closed dispatch and closure gate for Claude Code directed
work on Inkweight (DEC-044, ID-05). It is an independent copy of
`Tools/UnderreignDispatchGate` (copied and renamed on 2026-11-19); it shares no
code, state or paths with its source and does not import from, modify or depend
on any other tool. `Tools/AuthorityContinuity` stays the gate for the
ChatGPT/Codex-directed workflows.

Differences from the source copy:

- Scope strings and paths are `Inkweight` (`project_scope`,
  `Projects/Inkweight`, `Artifacts/Inkweight/DirectorDispatch`,
  `Artifacts/Inkweight/Evidence`, the two Inkweight operational state files).
- `forbidden_mutation_roots` additionally protects `Projects/Underreign`,
  `Artifacts/Underreign` and `Tools/UnderreignDispatchGate`.
- `claude_models` additionally accepts `claude-fable-5-2`.

Everything else (commands, manifest fields, error codes, closure procedure,
night-shift mode, honest limits) is identical to the source; read
[`Tools/UnderreignDispatchGate/README.md`](../UnderreignDispatchGate/README.md)
and replace the names. The optional `external_project` root is
`C:/GameDev/Inkweight` and is unused while the sources live in this repository.

## Boundary and honest limits

- Cooperative procedure, not a security boundary. It makes honest mistakes and
  drift visible; it cannot prove that a subagent really ran, which model served
  it, or that a review was genuinely independent.
- Model routing records the requested model only:
  `Requested model — not independently attested.`
- It grants no authority. Human decisions and DEC-013/DEC-014 remain in force.

## Commands

```text
python -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py check-manifest  --root . --manifest M --work-order W --capabilities C
python -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py verify-director --root . --manifest M --work-order W --capabilities C --receipt R
python -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py verify-worker   --root . --manifest M --work-order W --capabilities C --receipt R
python -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py issue-closure   --root . --closure-manifest X --work-order W --receipt CR
python -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py verify-closure  --root . --closure-manifest X --work-order W --receipt CR --work-state S --handover H
python -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py candidate-identity --root .
```

## Tests

```text
python -B -m pytest -q Tools/InkweightDispatchGate/tests
```

75 tests passed on 2026-11-19 in the cloud session that created the copy.
