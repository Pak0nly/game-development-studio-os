# Unity Asset Assembly and Diagnostic Safety Playbook

> **Status:** Adopted through LAIA-2026-07-22 on 2026-07-22. This playbook does not itself grant Unity, setup, asset, or mutation permission.

## Use

Load this playbook for Unity asset selection, representative assembly, asset-fit diagnosis, dependency-closure diagnosis, capture-path diagnosis, and protected-source safety. It does not authorise Unity launch, project creation, asset copying, download, purchase, package installation, or Vendor mutation.

## Environment and Evidence Boundary

- Prefer a verified canonical working environment named by the project Production Profile and Task-Delta Work Order.
- Do not create another complete Unity project, reconstruct `Library` or `PackageCache`, or copy a complete Vendor package without explicit setup authority.
- Keep logs, screenshots, videos, manifests, and review packages outside Unity `Assets/` unless Unity import is genuinely required for the task.
- Preserve Vendor originals. Put authorised adaptations in project-owned paths and hash protected areas before and after a Unity run when automatic serialization is a risk.

## Causal Diagnostic Classes

Classify each finding before disposition:

- source-asset defect;
- asset-selection mismatch;
- assembly or placement defect;
- orientation or public-front defect;
- stale or unremoved proxy;
- material or shader defect;
- dependency-closure or pipeline defect;
- composition defect;
- camera or evidence defect;
- blockout-stage limitation; or
- accepted concern outside the current decision.

A visible symptom is not an asset-family verdict. `FAIL` requires representative evidence and a verified causal defect. Use an evidence-invalid or evidence-incomplete disposition when the method cannot support a final verdict.

## Assembly and Diagnostic Workflow

1. Verify project path, Unity version, process exclusivity, arguments, package/dependency closure, and protected-file ledger before mutation.
2. Inventory the relevant package family and inspect representative original materials, not only diagnostic replacements.
3. Verify scale, rendered bounds, ground contact, public frontage, entrance, backs, roofs, pivots, rotation, and representative gameplay distance.
4. When a real asset replaces a proxy, inventory and remove or explicitly retain the superseded proxy before evidence freeze.
5. Separate diagnostic evidence from formal suitability evidence. Geometry-only or untextured output cannot prove material, lighting, period, or final visual fit.
6. In `Diagnostic` mode, reproduce, isolate, capture the causal result, record scope and falsifying evidence, then stop. Do not drift into selection, assembly correction, polish, or broad creative review.
7. In `Production` mode, prepare one Definition-of-Ready candidate and use the applicable stage-exit review.

## Stop

Stop mutation on unexpected Vendor, Package, ProjectSettings, or outside-scope drift; unresolved closure; invalid canonical environment; nonrepresentative render state; an absent Human-owned selection or licence decision; exhausted diagnostic attempts; or a required structural change. Preserve logs, hashes, candidate identity, and the factual record without silently accepting or reverting unknown drift.
