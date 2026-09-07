# Gley Urban Visible Road Modules

**Capability ID:** `C99-ASSET-GLEY-URBAN-ROADS-001`  
**Type:** Installed asset family  
**Owner:** Crime99 technical capability knowledge  
**Last verified:** 2026-08-22  
**Current disposition:** Useful targeted modular-road comparison set; direct
Crime99 scale, connector, material and visual fit remain unproven.

## Identity and Availability

- Gley Urban Assets `2.0.7` is locally present under `Assets/Gley/UrbanAssets`.
- Ten current visible-road prefabs are under
  `Runtime/Graphics/Environment/Prefabs/Roads`: `Curve90`,
  `Intersection3Roads`, `Intersection4Roads`, `Line2`, `Line4`,
  `Line4Crossing`, `Narrow4-2`, `Narrow6-4`, `Overpass` and `Roundabout`.
- Both local Urban Example scenes reference all ten forms.

## Intended Uses

- Problem tags: modular road, curve, T-junction, crossroad, crossing,
  narrowing, overpass, roundabout, package example.
- Strong uses: bounded visual comparison for a roundabout, overpass,
  lane-count transition or modular intersection.
- Unsuitable or unproven uses: automatic connection to the current Road
  Constructor graph, current citywide replacement, accepted material/curb
  quality or runtime traffic compatibility.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Ten named road forms and colliders are locally present | `LOCALLY PRESENT` and `STATICALLY VERIFIED` | [Asset family catalogue](../../../../../Projects/Crime99/Artifacts/Reports/C99-ASSET-TOOLING-AND-PACKAGE-CAPABILITY-CATALOG-V1/ASSET_FAMILY_AND_DEMO_CATALOG.md) | Static prefab blueprint evidence only |
| Vendor examples use all ten forms | `DOCUMENTED` | `Assets/Gley/UrbanExample/Samples/UrbanExample-NewInput.unity` and `UrbanExample-OldInput.unity` | Manufacturer example, not Crime99 fit |
| The modules connect cleanly to the current native graph | `UNKNOWN / REFRESH REQUIRED` | No same-site Crime99 proof | Do not infer connector grammar from names |

## Successful Applications

No current Crime99 visual success is claimed. Vendor example presence is not a
project success.

## Failed Applications

No scoped Crime99 failure is claimed. Earlier custom road failures did not use
this exact module family and must not reject it by association.

## Decision Guidance

- Prefer for one bounded same-site alternative when Road Constructor's native
  visual profile cannot express a needed roundabout, overpass, crossing or
  narrowing convincingly.
- Avoid mixing it into the entire city before scale, pivot, edge, collider,
  material and connection fit are proven.
- Combine with Gley topology only after visible geometry is selected.
- A second citywide visible-road system would add duplicate topology,
  collision, materials and maintenance debt.

## Unknowns and Refresh Triggers

- `UNKNOWN`: exact imported bounds, pivot grammar, URP appearance and current
  Road Constructor transition strategy.
- Refresh after package or render-pipeline change.
- Smallest useful next proof: one same-camera Roundabout or Narrow4-2 module
  comparison at a real Stage-1 junction.

## Search Tags

`gley-urban-assets`, `modular-road`, `roundabout`, `overpass`, `narrowing`,
`intersection`, `crossing`

