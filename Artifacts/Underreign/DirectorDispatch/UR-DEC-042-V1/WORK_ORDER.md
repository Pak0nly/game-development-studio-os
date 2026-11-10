# Work Order UR-DEC-042-V1 — Underreign-only narrowing of the no-training boundary; asset generation direction

Project: Underreign (DEC-041). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-DEC-042-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-DEC-042-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-DEC-042-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-DEC-042-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (Underreign chat, 2026-11-10, exact)

1. "Wenn wir später an Asset Generierung kommen, können wir auch Meshy ai nutzen um den Hauptteil zu modellieren und Blender dann für Anpassungen und alles weitere im Bezug auf rigging und Animationen."
2. After the Director said that DEC-025 must hold for Meshy and that Steam requires an AI disclosure: "Die Lernsperre gilt für third party assets. Eigen erstelle Assets sind in Eigenverantwortung. Das auf Steam Angaben gemacht werden müssen ist klar."
3. The Director reported the conflict with DEC-025 (which covers all content regardless of ownership) and asked: "Soll ich das so eintragen? A: Ja, nur für Underreign (meine Empfehlung). B: Ja, für das ganze Studio. C: Nein, die Regel bleibt, wie sie ist." The recommendation text was: "die Ausnahme nur für Underreign festlegen. Eigene Underreign-Inhalte dürfen dann auf deine Verantwortung an Dienste wie Meshy gehen. Fremdassets bleiben unter der Sperre. Für Hearthlands und die anderen Projekte bleibt alles, wie es ist." Human: "Ja." (= option A, the recommendation as written).

## Tasks

1. Append to `Docs/CONFIRMED_DECISIONS.md` (additively, at the very end, after DEC-041; do not change any other text in that file, which also holds other sessions' uncommitted work) a new entry **DEC-042 — Underreign No-Training Scope for Own Content** in the same format as DEC-041:
   - Status Confirmed; Scope: Project Underreign only.
   - Decision: for Underreign, content created by or for the project itself (own models, textures, sculpts, animations, concept images and other project-owned material, including Claude- or tool-generated content made for Underreign) may be submitted to generation and processing services such as Meshy at the Human Developer's own responsibility, even if the service's training practice cannot be verified. Third-party assets (Asset Store, Fab, marketplace or other licensed or vendor material) stay fully under DEC-025 and its licence restrictions. All other projects and all Studio OS content remain under DEC-025 unchanged.
   - Implications: Steam's AI-content disclosure is required for AI-generated content; provider choice and accounts follow DEC-013/DEC-014; record which service and which asset in a provenance note per asset.
   - Human confirmation source: quote statement 2 and the "Ja." to option A, Underreign chat, 2026-11-10.
   - Supersedes: only DEC-025's application to Underreign's own content; DEC-025's text is not changed.
2. `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`: new section "Asset generation — 2026-11-10", UD-49 (asset generation direction: Meshy for the main modelling, Blender for adjustments, rigging and animation — statement 1, recorded as direction), UD-50 (no-training scope for own content per DEC-042; Steam AI disclosure required — statement 2 and 3).
3. `Projects/Underreign/Docs/OPEN_DECISIONS.md`: OD-06 (asset pipeline and generative-AI content policy) → "DIRECTION DECIDED (UD-49, UD-50, DEC-042)"; remaining open: concrete Meshy plan/account and the provenance-note format.
4. Write `Artifacts/Underreign/Evidence/UR-DEC-042-V1/WORKER_RESULT.md`.

## Limits

Allowed: `Docs/CONFIRMED_DECISIONS.md` (append only), the two project files above, the evidence folder. Nothing else. No commit, no Unity, nothing under `C:\GameDev`.
