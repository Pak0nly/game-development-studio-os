# 1950s NYC Package-Native Road Family

**Capability ID:** `C99-ASSET-NYC1950S-ROADS-001`  
**Type:** Installed asset family  
**Owner:** Crime99 technical capability knowledge  
**Last verified:** 2026-08-22  
**Current disposition:** Strong candidate for visually authored narrow entries,
urban L/T junctions and width transitions; current Crime99 fit remains unproven.

## Identity and Availability

- The NYC1950s primary working copy is locally present under
  `Assets/LeartesStudios/NYC1950s`; provenance records version `2.1`.
- Seventeen primary road prefabs are present under `HDRP/Prefabs`, covering
  manufacturer-named 3 m, 6 m, 12 m and 24 m boxes, entries, L/T/crossing
  forms and 12/24 m transitions.
- The vendor level scenes also depend on one focused-copy `SM_Road_12m_L` and
  the shared focused-copy asphalt material. Do not deduplicate or move those
  roots without separate authority.

## Intended Uses

- Problem tags: narrow road, entrance, driveway, alley entry, L-junction,
  T-junction, crossroad, width transition, urban road module.
- Strong uses: visual alternative for 3/6 m hosted access, authored urban
  junctions and richer street/curb presentation.
- Unsuitable or unproven uses: direct citywide Road Constructor replacement,
  automatic spline connection, current URP material parity, AI lane topology
  or exact real-world dimensions based only on filenames.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Seventeen primary forms are locally present with collider serialization | `LOCALLY PRESENT` and `STATICALLY VERIFIED` | [Asset family catalogue](../../../../../Projects/Crime99/Artifacts/Reports/C99-ASSET-TOOLING-AND-PACKAGE-CAPABILITY-CATALOG-V1/ASSET_FAMILY_AND_DEMO_CATALOG.md) | Names are not imported-size measurements |
| Entry, L, T, crossing and width-transition forms exist | `STATICALLY VERIFIED` | Exact prefab list and hashes in the asset family catalogue | Visual/connector fit unknown |
| The road family is accepted for the current Crime99 city | `UNKNOWN / REFRESH REQUIRED` | No current same-site original evidence | Package ownership is not adoption |

## Successful Applications

No current Crime99 visual success is claimed for this exact road family.
Vendor scenes prove intended package assembly only.

## Failed Applications

- Historical material and custom-road experiments do not establish a
  package-wide rejection.
- NYCAlley `SM_sidewalk` is Human-excluded; it is a separate asset and must not
  be used to fill this road family's sidewalk gaps.

## Decision Guidance

- Prefer as one bounded alternative where a 3/6 m entry or authored urban
  junction can solve a visible access problem better than a 10 m native local
  profile.
- Avoid wholesale modular replacement before one real connector and material
  proof.
- Combine with Road Constructor only through a deliberately owned transition;
  combine with Gley topology after selection.
- Used sparingly, it may avoid bespoke mesh debt. Used citywide without a
  connector grammar, it creates a second road-system debt.

## Unknowns and Refresh Triggers

- `UNKNOWN`: imported scale, pivot, ground contact, current URP material,
  collision behavior and Road Constructor transition quality.
- Refresh after package, focused dependency or pipeline changes.
- Smallest useful next proof: compare `SM_Road_3m_enter` and
  `SM_Road_6m_enter` against the strongest native Road Constructor access at
  one hosted Stage-1 entry.

## Search Tags

`nyc1950s`, `road-module`, `3m-road`, `6m-road`, `entrance`, `driveway`,
`t-junction`, `width-transition`

