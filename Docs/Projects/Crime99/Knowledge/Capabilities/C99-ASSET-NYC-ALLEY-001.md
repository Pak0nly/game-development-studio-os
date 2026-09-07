# NYC Alley Environment Family

**Capability ID:** `C99-ASSET-NYC-ALLEY-001`  
**Type:** Installed licensed environment asset family  
**Owner:** Crime99 environment capability knowledge  
**Last verified:** 2026-08-22  
**Current disposition:** Strong service-alley, facade and utility-detail source;
the exact `SM_sidewalk` asset is Human-excluded.

## Identity and Availability

- Product: 1970s New York City Alley, Leartes Studios, imported version `1.0`.
- Root: `Assets/LeartesStudios/NYCAlley/`.
- Local breadth: 207 prefabs, 1 scene, 267 materials, 118 meshes, 377 textures,
  196 colliders and 26 serialized LODGroups.
- Store ID remains `UNKNOWN`; provenance is Human-confirmed Unity Asset Store.

## Intended Uses

- Problem tags: `alley`, `service yard`, `fire escape`, `pipes`, `doors`,
  `waste`, `utility`, `rear facade`, `loading`.
- Strong uses: adding functional rear/service language after access, grade,
  drainage and vehicle/foot clearance are structurally correct.
- Unsuitable uses: the excluded sidewalk, whole-city road replacement or
  cosmetic concealment of missing service access.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Service/facade/utility family is locally present | `STATICALLY VERIFIED` | [Asset family catalogue](../../../../../Projects/Crime99/Artifacts/Reports/C99-ASSET-TOOLING-AND-PACKAGE-CAPABILITY-CATALOG-V1/ASSET_FAMILY_AND_DEMO_CATALOG.md) | Static presence only |
| `SM_sidewalk.prefab` is excluded | `REJECTED FOR STATED USE` | Same catalogue, explicit exclusions | Does not reject other Alley assets |
| Earlier archive import failed on an invalid pathname | `REJECTED FOR THAT IMPORT METHOD` | [Import attempt](../../../../../Projects/Crime99/Artifacts/Reports/C99-1970S-NYC-ALLEY-EVALUATION-SUBSET-LOCAL-DEPLOYMENT-V1/IMPORT_ATTEMPT_RECORD.md) | Local working copy now exists; not a package-wide failure |

## Successful Applications

No current production baseline is adopted. Static family breadth and a complete
vendor example scene provide bounded reference value.

## Failed Applications

- The exact `SM_sidewalk.prefab` is forbidden.
- One archived subset import failed because a pathname contained invalid
  trailing bytes; do not repeat that carrier method.
- Prior facade/sidewalk boards were not a coherent alley/access proof.

## Decision Guidance

- Prefer for rear/service detail after a real entrance and yard topology exists.
- Avoid building the alley from decorative clutter before access and drainage.
- Combine with NYC1950s shells, accepted road/service entries and project-owned
  hardscape.
- Technical debt avoided: bespoke utility prop creation. Debt introduced:
  material/pipeline harmonisation and period adaptation.

## Unknowns and Refresh Triggers

- `UNKNOWN`: strongest 1990s subset, same-site entrance fit and runtime cost.
- Refresh after package or pipeline change and before any Alley asset selection.
- Smallest proof: one accepted rear/service relationship excluding `SM_sidewalk`.

## Search Tags

`NYC Alley`, `service alley`, `yard`, `loading`, `fire escape`, `pipe`, `waste`, `rear facade`

