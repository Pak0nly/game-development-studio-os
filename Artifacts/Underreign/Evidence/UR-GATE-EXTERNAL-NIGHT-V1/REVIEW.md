# Independent review — UR-GATE-EXTERNAL-NIGHT-V1

Reviewer task: a71ee8999657bf6b9 (separate read-only Claude Code subagent, requested model sonnet — not independently attested).
Verdict: PASS (no high or medium findings).

- 75/75 tests pass (41 existing unchanged, 34 new), `python -B`.
- External root allow-list is exactly `C:/GameDev/Underreign`; near misses and Hearthlands roots are rejected before filesystem access.
- Night-return, merge-base, commit-path, protected-path, symlink/submodule, evidence and write-once receipt logic is identical to the proven source apart from names; budget removed, a supplied `budget` is rejected (`E_NIGHT_FIELDS_UNEXPECTED`), no hidden cap.
- Behaviour without the new sections unchanged; schema diff additive.
- Independence: standard library only; other projects appear only as protection-only forbidden roots and negative test inputs.
- Scope: only the four gate files and the evidence folder changed.
- Info: lower-case root rejected (case-sensitive by design); LF/CRLF warnings cosmetic.
