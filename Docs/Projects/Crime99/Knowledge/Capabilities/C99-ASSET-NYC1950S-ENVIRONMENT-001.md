# 1950s NYC Environment Family

**Capability ID:** `C99-ASSET-NYC1950S-ENVIRONMENT-001`  
**Type:** Installed licensed environment asset family  
**Owner:** Crime99 environment capability knowledge  
**Last verified:** 2026-08-27  
**Current disposition:** Broadest installed urban construction source; mine
selectively by function and period adaptation, never import or place wholesale.

## Identity and Availability

- Product: 1950s NYC Environment Megapack, Leartes Studios, Store ID `236123`.
- Imported working copy: version `2.1`; historical store snapshot listed `2.2`.
- Primary root: `Assets/LeartesStudios/NYC1950s/`; focused referenced subset:
  `Assets/ThirdParty/1950sNYC/`.
- Primary breadth: 649 prefabs, 6 scenes, 912 materials, 812 mesh sources, 879
  textures, 459 serialized LODGroups and 841 colliders.
- Provenance: [Asset Provenance Register](../../../../../Projects/Crime99/Docs/ASSET_PROVENANCE.md).

## Intended Uses

- Problem tags: `urban buildings`, `facades`, `interiors`, `props`, `vegetation`,
  `vehicles`, `characters`, `street support`, `1990s adaptation`.
- Strong uses: modular street walls, block-edge buildings, commercial/residential
  facades, rooftop/utility props and selective urban landmarks.
- Unsuitable uses: treating the 1950s example layout as Crime99's 1990s city
  plan, using all interiors in the first prototype, or assuming material parity.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Broad urban family and exact counts are local | `STATICALLY VERIFIED` | [Asset family catalogue](../../../../../Projects/Crime99/Artifacts/Reports/C99-ASSET-TOOLING-AND-PACKAGE-CAPABILITY-CATALOG-V1/ASSET_FAMILY_AND_DEMO_CATALOG.md) | Static YAML/file coverage only |
| Package contains a substantial LOD/collider basis | `STATICALLY VERIFIED` | Same catalogue | Runtime performance and collider fitness remain unproven |
| NYC1950s/NYCAlley are a plausible near-term URP urban core | `DOCUMENTED` project evaluation | [Technical and pipeline evaluation](../../../../../Projects/Crime99/Artifacts/Reports/C99-CURRENT-ASSET-AND-PIPELINE-EVALUATION-V1/TECHNICAL_AND_PIPELINE_EVALUATION.md) | Recommendation input, not adoption |

## Successful Applications

The package has been statically and visually evaluated in bounded research, and
its road subset has separate records. No broad building family has been adopted
as the current city baseline.

- `C99-EXAMPLE-PARK-COMPOSITION-V1` visually proved one exact park subset in
  the current URP project: `SM_MapleTree2`, `SM_Bush_02`, `SM_Bench_04`,
  `SM_Lamps01`, `SM_Dustbin_03`, `SM_FountainBase` and `SM_FountainStatue`.
  Nine task-owned URP material variants were created without Vendor mutation.
  The corrected candidate passed as a bounded example composition; Human
  acceptance and adoption remain pending. Evidence:
  [closure](../../../../../Projects/Crime99/Artifacts/Evidence/C99-EXAMPLE-PARK-COMPOSITION-V1/TASK_CLOSURE_REPORT.md)
  and [visual review](../../../../../Projects/Crime99/Artifacts/Evidence/C99-EXAMPLE-PARK-COMPOSITION-V1/DIRECT_VISUAL_REVIEW.md).

## Failed Applications

- Some complete buildings have very high material-slot counts; selective shells
  and project-owned variants are safer than wholesale placement.
- Prior isolated building/road boards did not establish a coherent city. This
  rejects those compositions, not the underlying family.
- The first example-park conversion produced pale/white materials because the
  Shader Graph sources exposed their semantic base textures through custom
  property names; a semantic texture selection plus restrained task-owned
  palette corrected the exact seven-prefab subset. This does not reject or
  qualify the rest of the family.
- The package period is 1950s; using its example plan or signage unchanged would
  conflict with the confirmed 1990s target.

## Decision Guidance

- Prefer when a 1990s-adaptable urban shell, facade run or prop family is needed.
- Compare footprint, frontage, entrances, camera readability, material slots
  and repetition before selection.
- Combine with Road Constructor/accepted roads, NYC Alley service details and
  project-owned material/prefab variants.
- Technical debt: low for curated modular reuse; high for wholesale scenes,
  duplicated focused roots or uncontrolled material proliferation.

## Unknowns and Refresh Triggers

- `UNKNOWN`: current same-site visual fit, exact building entrance grammar,
  performance and best 1990s subset.
- Refresh after package/reimport/pipeline change or before a building-family selection.
- Smallest proof: one complete road-frontage-yard relationship using a curated
  building row, not isolated proxy boxes.

## Search Tags

`NYC1950s`, `building`, `facade`, `urban block`, `street wall`, `prop`, `interior`, `1990s city`
