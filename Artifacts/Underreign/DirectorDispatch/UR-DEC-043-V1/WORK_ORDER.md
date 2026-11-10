# Work Order UR-DEC-043-V1 — Record Unreal Engine as Underreign's engine

Project: Underreign (DEC-041). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-DEC-043-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-DEC-043-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-DEC-043-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-DEC-043-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (Underreign chat, 2026-11-10, exact)

1. After the comparison: "Für mein Verständnis: Es wurde jetzt nur die Blender Scene in beide Engines eingebaut und Standard Einstellungen verwendet richtig? Also keine Grafik Optimierungen in irgend einer Form? Ich gehe gerade davon aus, dass wir eine weit höhere Grafikqualität in Unreal erreichen als in Unity und das bei gleicher, wenn nicht besserer Performance. Das wäre für mich ausschlaggebend."
2. The Director answered that both engines were tuned to a fair middle level, that Unreal has the higher ceiling and ran faster than Unity HDRP in the test (about 94 vs 68 fps, measured differently), that Unreal is the right choice if visual quality at good performance is decisive, and listed the costs (simulation port from C# to C++ with its tests, text-based C++/Python work preferred over binary Blueprints, Visual Studio 2022 is installed).
3. Asked "Which engine do you want?" the Human answered: "Unreal".
4. Earlier: "Wenn ich es schaffen sollte, damit über 1m $ zu verdienen bin ich glücklich. 5% ist dann ok."

## Tasks

1. Append to `Docs/CONFIRMED_DECISIONS.md` (pure append at the very end, after DEC-042; the file holds other sessions' uncommitted work — change no other line) **DEC-043 — Underreign Engine: Unreal Engine 5** in the DEC-041 format:
   - Status Confirmed; Scope: Project Underreign only.
   - Decision: Underreign uses Unreal Engine 5 (installed 5.8.3 at `C:\Program Files\Epic Games\UE_5.8`), chosen after the side-by-side comparison (UR-ENGINE-KIT-V1, UR-ENGINE-UNITY-V1, UR-ENGINE-UNREAL-V1) for its higher visual ceiling (Lumen dynamic global illumination, Nanite, virtual shadow maps) at equal or better performance. Epic's royalty (5 % above USD 1 million gross per product) is accepted by the Human. Project code is C++ and Python editor scripting where possible; binary Blueprint assets are kept to a minimum so AI Workers can read, write and review the work as text. The engine-free simulation is ported from C# to C++ with its tests. The Unity project location rule (UD-26) applies to the Unreal project: `C:\GameDev\Underreign`, own Git repository with Git LFS, remote `Pak0nly/underreign`.
   - Implications: DEC-002/DEC-003 (Unity studio default) do not apply to Underreign; other projects are unaffected. Engine upgrades during production need a Human decision. Downloads, installations, Fab content and accounts still follow DEC-013/DEC-014 and DEC-042.
   - Human confirmation source: quote statements 1 and 3 (and 4 for the royalty).
   - Supersedes: only DEC-041's engine clause ("Engine: Unity 6000.6.4f1 …") and UD-04/UD-36 for Underreign; DEC-041's text is not changed.
2. `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`: new section "Engine — 2026-11-10" with UD-51 (Unreal Engine 5 per DEC-043, quoting statements 1 and 3). Note in the row that UD-04 (Unity like Hearthlands), UD-36 (URP for now) and the Unity-specific parts of UD-35 (Unity add-ons, Unity 6.6 install) are superseded; whether UD-35's standing commit approval also covers Unreal jobs is still to be asked.
3. `Projects/Underreign/Docs/OPEN_DECISIONS.md`: OD-11 → DECIDED (UD-51, DEC-043); OD-04 (render pipeline) → "SUPERSEDED: Unreal with Lumen (DEC-043)"; add OD-16 "Does the standing commit approval of UD-35 also cover Unreal jobs?" (OPEN) and OD-17 "Simulation port from C# to C++ and the Unreal project setup" (OPEN, next work).
4. `Projects/Underreign/README.md` and `Projects/Underreign/Docs/PRODUCTION_PROFILE.md`: engine lines → Unreal Engine 5.8 (DEC-043); keep `project_id: Underreign` exactly as the first line after the title in the profile.
5. Write `Artifacts/Underreign/Evidence/UR-DEC-043-V1/WORKER_RESULT.md`.

## Limits

Allowed: `Docs/CONFIRMED_DECISIONS.md` (append only), the four project files above, the evidence folder. Nothing else. No commit, no engine, nothing under `C:\GameDev`.
