# Industrial Harbour Environment Family

**Capability ID:** `C99-ASSET-INDUSTRIAL-HARBOUR-001`  
**Type:** Installed environment asset family  
**Owner:** Crime99 environment capability knowledge  
**Last verified:** 2026-08-23  
**Current disposition:** Strong neutral harbour/industrial raw material is
source-present and qualified as curated source material. A complete
`BP_BrickHouse_1` and `BP_BrickHouse_2` hierarchies can render and persist
together in the Crime99 city when each is placed below a stable normal
Transform parent. Their two-host functional composition reads, but all three
tested compound-ground methods failed adoption: a monolithic slab, a sawtooth
raster surface and a spatial crop of Vendor-authored ground/road/floor
prefabs. The Vendor subset renders, but the crop ignored the complete
surrounding street/block context and produced another jagged parcel island.
Nothing is adopted.

## Identity and Availability

- Product: Industrial Harbour, Leartes Studios, Unity Asset Store ID `283325`,
  vendor version `1.0`.
- Verified local root: `Assets/LeartesStudios/IndustrialHarbour/`.
- Vendor URP main scene:
  `Assets/LeartesStudios/IndustrialHarbour/Scene/URP_Industrial_Harbour.unity`,
  SHA-256
  `180B4623417FFC8685B7B0955654DA95A0B21F27923C9E19DAD8E56898F5870D`.
- Immutable URP carrier:
  `Assets/LeartesStudios/IndustrialHarbour/URP/URP_Industrial_Harbour.unitypackage`,
  SHA-256 `625A6B6E435B70F2BB53F30DA809B43DC8A87E5482A3D99EF477BE5E47BFB21C`.
- Vendor claim: Built-in, URP and HDRP variants for Unity `2021.3.6f1`.
  This is not a vendor claim for Crime99's Unity `6000.3.19f1` / URP `17.3.0`.
- Local breadth before the URP overlay: `137` prefabs, `131` FBX meshes,
  `202` materials and two HDRP scenes. The URP carrier declares `718` asset
  identities, including `138` prefabs, `131` FBX meshes, `203` materials and
  two scenes.
- Provenance: [Asset Provenance Register](../../../../../Projects/Crime99/Docs/ASSET_PROVENANCE.md).
- Authority boundary: source presence and import do not authorise production
  placement, material repair, scene adoption or Git inclusion.

## Intended Uses

- Problem tags: `industrial harbour`, `factory`, `warehouse`, `service yard`,
  `loading`, `quay`, `seawall`, `silo`, `tank`, `pipe`, `rail`, `fence`.
- Strong uses: modular industrial buildings and yards, waterfront/service
  infrastructure, factory silhouettes, loading/service vocabulary and bounded
  industrial props.
- Newly identified ground-system uses: authored `SM_Ground` tiling,
  `SM_ModulFloor`, Vendor road composition and native ground stripes as one
  Vendor-designed industrial surface grammar rather than project-generated
  broad horizontal slabs.
- Unsuitable or unproven uses: wholesale demo-scene adoption, generic use in
  every district, period fit without curation, or assuming that vendor URP
  support proves Unity 6 rendering.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Exact local URP source is preserved | `STATICALLY VERIFIED` | [Import evidence](../../../../../Projects/Crime99/Artifacts/Evidence/C99-INDUSTRIAL-HARBOUR-URP-IMPORT-V1/POST_IMPORT_AUDIT.json) | Source identity only |
| All 718 archive asset identities resolve | `STATICALLY VERIFIED` | [GUID relocation audit](../../../../../Projects/Crime99/Artifacts/Evidence/C99-INDUSTRIAL-HARBOUR-URP-IMPORT-V1/GUID_RELOCATION_AUDIT.json) | `621` identities reuse an existing GUID owner path |
| Unity import process completed | `PROCESS PASS` | [Unity import log](../../../../../Projects/Crime99/Artifacts/Evidence/C99-INDUSTRIAL-HARBOUR-URP-IMPORT-V1/RunLogs/UNITY_IMPORT.log) | Exit `0`; not a scene/run or visual pass |
| URP Overview scene has no unresolved non-built-in GUID | `STATICALLY VERIFIED` | [Post-import audit](../../../../../Projects/Crime99/Artifacts/Evidence/C99-INDUSTRIAL-HARBOUR-URP-IMPORT-V1/POST_IMPORT_AUDIT.json) | Shader/material rendering remains unproven |
| Main demo scene is reference-clean | `CONCERN` | Same audit: one absent material GUID at 21 renderer references and one absent occlusion-data GUID | Same references exist in the pre-existing HDRP scene; not evidence of import loss |
| Major Overview asset families render in Crime99 | `PASS WITH CONCERNS` | [Direct native visual review](../../../../../Projects/Crime99/Artifacts/Evidence/C99-INDUSTRIAL-HARBOUR-URP-VISUAL-QUALIFICATION-V1/VISUAL_REVIEW.md) | One dark asset-lineup overview; not every material |
| Close-range material readability | `PASS WITH CONCERNS` | Same review: native brick-wall/module close view | Editor module view, not an in-game façade or player route |
| Complete BrickHouse hierarchy placement | `PASS WITH CONCERNS` | [Industrial Parcel Pilot direct review](../../../../../Projects/Crime99/Artifacts/Evidence/C99-INDUSTRIAL-PARCEL-PILOT-V1/DIRECTOR_VISUAL_REVIEW.md) | Stable normal parent is required; one building is not a complete compound |
| Player frontage, yard and parcel fit | `FAIL FOR PILOT METHOD` | Same Industrial Parcel Pilot review | Building and connected road are useful; the monolithic hardscape method failed and does not reject the asset family |
| Two complete building hosts in one functional compound | `PASS WITH CONCERNS` | [Industrial Compound Correction01 direct review](../../../../../Projects/Crime99/Artifacts/Evidence/C99-INDUSTRIAL-COMPOUND-COMPOSITION-V1/Candidate01Correction01/DIRECTOR_VISUAL_REVIEW.md) | Building composition reads; compound ground and road threshold still fail adoption |
| Cloned cracked-concrete materials on a large compound ground | `FAIL FOR STATED USE` | Same Correction01 review and native overview original | Close texture is useful, but the distant view shows severe coloured/magenta pattern artefacts; no material-wide rejection |
| Vendor URP main scene contains an authored modular ground grammar | `STATICALLY VERIFIED / VISUAL FIT UNKNOWN` | Main-scene YAML: `1,192` `SM_Ground` prefab instances, `4` `SM_ModulFloor` prefab instances and `184` named ground-stripe objects | Presence and authored assembly only; Crime99 scale, seams, road connection, Terrain contact and player-view quality remain unproven |
| Spatial Vendor surface crop around SM_ModulFloor2 | `TECHNICAL PASS / VISUAL FAIL` | [Candidate01 direct review](../../../../../Projects/Crime99/Artifacts/Evidence/C99-INDUSTRIAL-HARBOUR-VENDOR-NATIVE-GROUND-QUALIFICATION-V1/Candidate01/DIRECT_VISUAL_REVIEW.md) | 560 prefab roots persist and render, but zero stripe roots were carried; spatial proximity is not a semantic yard and did not account for surrounding roads, intersections or block edges |
| Import is isolated from other Leartes assets | `FAIL / SHARED-GUID COUPLING` | GUID relocation audit and import log | Seven identities resolve through Cyberpunk Port City; existing Industrial Harbour working copies were overlaid |

## Successful Applications

| Use and candidate | Result | Reusable conclusion | Transfer limit |
|---|---|---|---|
| Exact local URP carrier import, 2026-08-23 | Unity process exit `0`; `718/718` archive identities resolve | Use the vendor-native URP overlay rather than converting HDRP content manually | Import completion is not rendering, visual, performance or production acceptance |
| Live URP Overview rendering, 2026-08-23 | Factories, warehouses, silos, pipes, loading doors and service props render without a broad magenta failure | Treat the family as useful curated industrial source material | Dark asset lineup only; no district, gameplay, period or production acceptance |
| Complete `BP_BrickHouse_1` placement in River Wharves pilot, 2026-08-23 | `338` renderers persist after save/reload and the brick factory/loading doors read in all three native views | Clone the complete Overview group below a normal stable placement parent; do not directly reposition its RectTransform root | The parcel failed overall because of ground composition; no adoption or family-wide visual acceptance |
| Complete `BP_BrickHouse_1` plus `BP_BrickHouse_2` compound, 2026-08-23 | `338 + 200` renderers persist without overlapping and both loading roles read in three native views | Plan complete building assemblies together with parking, turning/service and loading functions | The ground perimeter, distance material behaviour and road entrance failed; no compound adoption |

## Failed Applications

| Use and candidate | Failure class/root cause | Reusable shield | What it does not prove |
|---|---|---|---|
| Treating the URP carrier as an isolated new tree | Shared vendor GUID ownership | Inventory GUID owners before cleanup, migration or reimport; do not delete Cyberpunk/Industrial roots independently | It does not make the imported source unusable |
| Clean technical acceptance from the import log alone | Unsupported shader warnings and bounded vendor-reference omissions | Require one direct visual qualification before selection | It does not prove all meshes or materials fail |
| Direct world placement of the complete Overview `BP_BrickHouse_1` RectTransform root | X/Y placement did not persist visually after candidate save/reload | Preserve the failed candidate; place the untouched group under a normal task-owned Transform parent and move/rotate/scale that parent | It does not reject the building assembly or require unpacking/rebuilding its 338-renderer hierarchy |
| One building plus one monolithic connected hardscape for a large parcel | Player views still read the ground as an oversized dark slab | Plan visibly differentiated driveway, apron, parking, service edge and Terrain/landscape transitions around multiple functional hosts before dressing | It does not invalidate the native road, the building, or continuous-ground requirement |
| Two hosts plus cell-centre raster-clipped textured ground | Functional zoning and Terrain coverage improved technically, but the Human rejected the entire visible surface result: sawtooth perimeter, coloured/magenta distance patterns and no credible sidewalk threshold | Abandon project-generated broad compound surfaces; evaluate the complete Vendor-authored ground/floor/road cluster before any new surface construction | It does not reject the two-host building layout, the untested Vendor ground system or native road tooling |
| Radius-selected Vendor ground/road/floor neighborhood | The subset rendered, but selection was inward-looking: it ignored all adjacent roads, intersections, frontage/service hierarchy, block edges and parcel limits; the result was another pale jagged island with no credible entrance threshold | Never select an industrial surface from asset proximity alone. First model the full parcel-and-street context and identify which road owns frontage and service access | It does not reject individual Vendor materials/prefabs or prove that no semantic Vendor yard hierarchy exists |

## Decision Guidance

- Prefer when a real harbour, warehouse, factory, service/loading or industrial
  infrastructure gap is named.
- Evaluate complete building/yard combinations, not just individual props.
- Compare against Cyberpunk Port, Military Base, NYC environment and NYC Alley;
  this family is the strongest neutral industrial-first option, not an automatic
  winner for every district.
- Combine with the chosen road/service topology and continuous parcel ground.
  Entrances, loading aprons, parking and yards should be planned with the
  building module rather than patched afterward.
- Do not repeat a spatial Vendor tile crop. If this family is revisited, first
  identify a semantic Vendor yard owner including markings and entrance logic,
  and evaluate it against every surrounding road/intersection, block edge,
  parcel limit, frontage and service route. Freeze real player-height evidence
  before integration.
- Avoid wholesale demo-scene adoption and uncontrolled cross-package material
  editing. Create project-owned variants only after the selected subset passes.
- Technical debt avoided: vendor-native URP payload and existing modular meshes.
  Technical debt introduced: shared GUID ownership across Leartes packages and
  possible material/shader repair if the visual qualification fails.

## Unknowns and Refresh Triggers

- `UNKNOWN`: broader player-relevant and period fit, complete material
  coverage beyond the failed large-ground use, three-to-five-building modular
  closure, collisions, LOD quality, performance and best Crime99 subset.
- Refresh after any material repair, pipeline change, package reimport or
  Cyberpunk Port cleanup/migration.
- The Vendor-native qualification is closed as a visual failure for the
  spatial-crop method. The remaining decision-critical `UNKNOWN` is whether an
  explicit semantic Vendor yard hierarchy exists. Do not infer one from nearby
  prefab positions, and do not run another integrated candidate until the
  complete surrounding street/block context and a true player-height view are
  frozen read-only.

## Search Tags

`industrial harbour`, `harbor`, `warehouse`, `factory`, `service yard`, `loading`, `quay`, `seawall`, `silo`, `tank`, `pipe`, `rail`, `industrial district`
