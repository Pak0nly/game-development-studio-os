# Decalery 1.2

**Capability ID:** `C99-CAP-DECALERY-001`  
**Type:** Installed Unity tool/package  
**Owner:** Crime99 technical-art capability knowledge  
**Last verified:** 2026-08-22  
**Current disposition:** Selective authored road-mesh detail tool; not a
structural ground, contact, grade or global-wetness solution.

## Identity and Availability

- Product: Decalery, Asset Store product `293468`, package version `1.2`.
- Local root: `Assets/Decalery/`; 306 files / 147 non-meta files.
- Manual: `Assets/Decalery/Manual/decalery_manual.pdf`.
- The Human-approved local URP payload is present. No URP Decal Renderer Feature
  is required by the proven mesh-fitting workflow.
- Vendor root remains protected; task output belongs under project-owned roots.

## Intended Uses

- Problem tags: `road wear`, `repair`, `markings`, `tyre trail`, `mesh decal`,
  `surface storytelling`, `sparse grime`.
- Strong uses: restrained fitted road repairs/wear, sparse markings and bounded
  editor/runtime decals after structural geometry already passes.
- Unsuitable uses: hiding floating/sunken buildings, bad grade, Terrain seams,
  broken curbs, road overlap, drainage or large rectangular ground slabs.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Decalery 1.2 compiles in Unity 6000.3.19f1 / URP 17.3.0 with the local URP payload | `RUNTIME PROVEN` | [Deep capability report](../../../../../Projects/Crime99/Artifacts/Reports/C99-DECALERY-TERRAIN-DEEP-CAPABILITY-AND-URBAN-GROUND-INTEGRATION-LAB-V1/INTERIM_REPORT.md) | Exact project configuration only |
| Static fitted decals work on a readable road mesh and Unity Terrain | `RUNTIME PROVEN` | Same report and `CAPABILITY_LEDGER.json` | Generation success is not broad visual fitness |
| Restrained road repair/wear is the strongest observed use | `VISUALLY PROVEN` for the bounded comparison | Same report, direct original review | Selective pass only; not production adoption |
| Receiver-copy change and regeneration works | `RUNTIME PROVEN` | Same report | Task-owned receiver copy; live Road Constructor regeneration untested |
| Runtime/editor-domain CPUBurst tyre trails are available | `RUNTIME PROVEN` | Same report | Frozen trail was visually too broad/muddy |

## Successful Applications

| Use and candidate | Result | Reusable conclusion | Transfer limit |
|---|---|---|---|
| Deep capability urban-ground lab | `PASS WITH MATERIAL LIMITS`; restrained road repair/wear selectively passed | Use Decalery after geometry for sparse surface detail | Does not own broad ground or structural contact |

## Failed Applications

| Use and candidate | Failure class/root cause | Reusable shield | What it does not prove |
|---|---|---|---|
| Terrain/curb seam, building contact and service/loading transition treatments | Negligible or no decision-useful visual improvement | Fix topology, grade and geometry first | Does not reject sparse road-detail use |
| Frozen tyre-trail example | Too broad and muddy | Reduce density/width/intensity only in a later bounded visual task | Does not reject runtime trails generally |

## Decision Guidance

- Prefer after road, curb, sidewalk, foundation and grade geometry visibly pass.
- Avoid as a cosmetic cover for structural defects or as a global wetness tool.
- Combine with Road Constructor meshes, TerrainLayers and correct authored
  hardscape; regenerate fitted decals after receiver changes.
- Technical debt: low when sparse and recipe-driven; high when layered heavily
  to conceal geometry or when generated meshes lose ownership.

## Unknowns and Refresh Triggers

- `UNKNOWN`: representative runtime performance, overdraw and non-Windows/API
  behavior for production density.
- Refresh after Decalery, URP, receiver-mesh or accepted surface-language change.
- Smallest useful proof: one accepted road receiver with restrained day/night
  same-camera evidence and measured triangle/overdraw cost.

## Search Tags

`decal`, `Decalery`, `road repair`, `road wear`, `tyre trail`, `grime`, `marking`, `surface detail`

