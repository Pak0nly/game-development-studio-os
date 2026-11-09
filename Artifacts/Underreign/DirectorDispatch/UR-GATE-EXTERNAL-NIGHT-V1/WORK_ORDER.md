# Work Order UR-GATE-EXTERNAL-NIGHT-V1 — External Unity root and cloud night mode for the Underreign gate

Project: Underreign (DEC-041). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the repository root run:

```text
python Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-GATE-EXTERNAL-NIGHT-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-GATE-EXTERNAL-NIGHT-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-GATE-EXTERNAL-NIGHT-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-GATE-EXTERNAL-NIGHT-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human authority

- 2026-11-09: "Kannst du die Planung und auch gerne weiteres in einer
  Nachtschicht umsetzen?" A night shift in this Studio is always a cloud run
  (the Human's PC is off): evening push, overnight cloud work without Unity,
  morning pull and local check.
- UD-25: own dispatch gate; "Nichts soll mit Hearthlands überlappen oder
  verbunden werden. Wenn eine Kopie hilfreich ist, soll kopiert werden."
- UD-26: the Unity project lives in `C:\GameDev\Underreign` (own Git repo).
- There is no cost cap for night shifts (Human, 2026-10-24: "Es gibt keine
  Kostengrenze mehr.").

## Task

Add two optional features to `Tools/UnderreignDispatchGate` by copying the
equivalent, proven logic from `Tools/HearthlandsDispatchGate` (read-only
source; never modify it): the optional `external_project` section and the
`execution_location: "cloud_night"` night-shift mode with
`verify-night-return`, including the closure support (`ext:` candidates,
`night_return`). Read `Tools/HearthlandsDispatchGate/README.md` sections
"External project root" and "Night-shift mode" and the matching code and tests.

Adaptations:

1. Allowed external roots: exactly `C:/GameDev/Underreign`. Nothing else
   (near misses like `C:/GameDev/Underreign2` or any Hearthlands root fail with
   `E_EXTERNAL_ROOT_NOT_ALLOWED`).
2. No budget: drop the `budget` field and its cap checks entirely (no
   `E_NIGHT_BUDGET`); a supplied `budget` field is simply not required and,
   if present, rejected as unexpected or ignored — choose the cleaner option and
   document it.
3. Everything else (night branch `night/<YYYY-MM-DD>`, evidence dir inside
   external allowed mutations, return receipt rules, merge-base, no merge
   commits, protected paths, symlink/submodule rejection, closure markers in
   the Underreign operational files) as in the source.
4. The result must stay an independent copy: no import of, path to or shared
   state with any Hearthlands or MobileArc tool. The existing protection-only
   forbidden roots stay.
5. Existing behaviour without the new sections stays identical; all existing
   41 tests must still pass. Port the relevant source tests (external root,
   uninitialised root, night manifest, night return, closure with `ext:` and
   `night_return`), adapted to the Underreign root and without budget.
6. Update `Tools/UnderreignDispatchGate/README.md` with both sections and the
   evening/morning steps.
7. Write `Artifacts/Underreign/Evidence/UR-GATE-EXTERNAL-NIGHT-V1/WORKER_RESULT.md`
   with files changed, test counts before/after, the budget choice, a grep proof
   of independence, and anything left open.

## Limits

- Allowed mutations: `Tools/UnderreignDispatchGate` and the evidence folder
  above. No other file. No commit. No Unity. Do not touch `C:\GameDev`.
- Tests must build temporary repositories only; they must not read or write
  the live `C:/GameDev/Underreign`.
- If a part cannot be done, report it; do not change the goal.

## Human checkpoint

Independent review, then the Director commits and prepares the first night
order.
