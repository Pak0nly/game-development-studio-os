# Unity Splines and ProBuilder Road-Support Workflow

**Capability ID:** `C99-CAP-UNITY-SPLINES-PROBUILDER-001`  
**Type:** Installed packages and project workflow  
**Owner:** Crime99 technical capability knowledge  
**Last verified:** 2026-08-22  
**Current disposition:** Bounded last-resort hard-edge support; rejected as a
parallel custom citywide road system.

## Identity and Availability

- Unity Splines `2.9.0` and ProBuilder `6.1.2` are direct current project
  dependencies.
- Project-owned historical spline/mesh road experiments remain available as
  negative evidence; their presence does not make them a baseline.

## Intended Uses

- Problem tags: custom curb, apron, foundation edge, drainage, connector,
  spline mesh, hard-edge geometry.
- Strong uses: one missing hard-edge adapter that neither Road Constructor nor
  a proven package-native module supplies.
- Unsuitable uses: another whole-city road graph, broad procedural road
  replacement, detached entry tongues or cosmetic seam concealment.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Splines and ProBuilder are current dependencies | `LOCALLY PRESENT` | `Projects/Crime99/Source/Crime99/Packages/manifest.json` | Presence is not workflow adoption |
| Prior broad custom-road consumers were visually acceptable | `REJECTED FOR STATED USE` | [Capability catalogue final report](../../../../../Projects/Crime99/Artifacts/Reports/C99-ASSET-TOOLING-AND-PACKAGE-CAPABILITY-CATALOG-V1/FINAL_REPORT.md) | Rejects those consumers, not every bounded mesh adapter |
| Full road-render mesh ring reconstruction is generally safe | `REJECTED FOR STATED USE` | Candidate04 Correction01 topology-precondition failure | Does not reject simple project-owned hard-edge geometry |

## Successful Applications

No citywide custom-road baseline is accepted. Project-owned mesh creation has
executed technically in several labs, but technical output alone is not a
visual success.

## Failed Applications

| Use and candidate | Failure class/root cause | Reusable shield | What it does not prove |
|---|---|---|---|
| Hybrid V2 and Visual Street Network B04 | Broad custom-road visual failure / Human rejection | Do not revive as baseline | Does not prohibit one bounded adapter |
| Candidate04 full-ring road reconstruction | Incompatible ring-order precondition | Prove topology before complex mesh reuse | Does not require lengthy topology work for a simpler solution |
| Candidate05 detached entry/yard meshes | Disconnected visual topology | Never solve access with unrelated islands | Does not reject a connected hard-edge transition |

## Decision Guidance

- Prefer only after native Road Constructor profiles and one relevant
  package-native module have been considered.
- Keep the adapter task-owned, minimal and owned by one road/parcel interface.
- Combine with Terrain for broad support and Road Constructor for graph
  ownership.
- The debt is acceptable only when it removes a persistent gap without
  creating another road topology, material system or generator.

## Unknowns and Refresh Triggers

- `UNKNOWN`: the exact smallest adapter needed after Stage-1 native/module
  comparison.
- Refresh after accepted road-section or curb/foundation architecture changes.
- Smallest useful next proof: none until native and package-module options fail
  visibly at the exact interface.

## Search Tags

`unity-splines`, `probuilder`, `custom-mesh`, `curb`, `apron`, `drainage`,
`adapter`, `technical-debt`

