# Crime99 Park Element Reference

**Reference ID:** `C99-REF-PARK-ELEMENTS-001`  
**Type:** Curated, problem-oriented park capability reference  
**Owner:** Crime99 environment capability knowledge  
**Last verified:** 2026-08-27  
**Current disposition:** `URP-FIRST DECISION ROUTING / ONE BOUNDED NYC ASSET SUBSET PROVEN / SITE-FIT METHOD REJECTED / NO PARK BASELINE ADOPTED`

## Purpose

Use this reference when planning, building, dressing or reviewing a park,
plaza, garden, green buffer, waterfront open space or stormwater landscape in
Crime99. It identifies the functions a credible park needs and routes each
function only to tools or assets that are relevant to that use.

This is not a filename dump. Completeness means that the functional park
categories and the available decision routes are covered. It does not mean
that every local prefab whose name contains words such as `wall`, `light`,
`tower`, `grass` or `water` is a park candidate.

This reference supplements the [Capability Index](CAPABILITY_INDEX.md),
[Capability Coverage Register](CAPABILITY_COVERAGE_REGISTER.md),
[Asset Inventory](../ASSET_INVENTORY.md) and the linked capability records.
Those owners remain authoritative for availability, provenance and evidence.

## Current Project Boundary

- Canonical project: `Projects/Crime99/Source/Crime99`.
- Unity Editor: `6000.3.19f1`.
- Active render pipeline: URP `17.3.0`.
- Installed native authoring packages relevant here: Splines `2.9.0` and
  ProBuilder `6.1.2`.
- A read-only scan on 2026-08-27 found no park prefab below an explicit `URP`
  directory and no project-owned `_Crime99` park prefab. The eight current
  `_Crime99` prefabs are vehicle prefabs.
- The locally interesting NYC benches, vegetation, fountain, park fence,
  lamps and bins are stored below the Vendor family's `HDRP` working root.
  One exact seven-prefab subset now has a bounded, task-owned URP adaptation
  proof; the broader family remains unqualified.

Therefore, Crime99 has useful native park-construction capabilities and one
proven example subset, but no adopted general-purpose URP park family. The
bounded proof must not be generalized to unrelated NYC prefabs or sites.

## Mandatory Selection Gate

An element enters a park shortlist only when all of the following are true:

1. It serves a named function at the exact site.
2. Its theme fits a public or intentionally private green space in the
   Crime99 1990s setting.
3. It is proven usable in the current URP project, or is clearly marked as a
   qualification candidate rather than a current option.
4. It connects logically to paths, entrances, boundaries, activity or a view.
5. Its scale, orientation, material state and player-view appearance can be
   checked directly before adoption.

Do not select an object merely because its filename matches a broad search
term. Do not use an industrial or military object in a normal park unless the
Human explicitly defines a special redevelopment or memorial use case first.

## Park Function Grammar

| Function | Suitable elements | Placement logic | Current route |
|---|---|---|---|
| Broad ground and grade | Lawn, soil, meadow, planted basin, gentle slopes | Continuous support owned by the site, not detached patches | Unity Terrain |
| Street interface | Sidewalk continuity, curb, crossing, real entrance, vehicle exclusion | Every entrance must make sense from the adjoining street | Existing street system; Road Constructor only where the road graph must change |
| Primary paths | Direct routes between actual entrances and activities | Follow desire lines and remain visually legible | Unity Splines; bounded authored surface geometry |
| Secondary paths | Short loop, overlook spur, garden connection | Add choice without decorative dead ends | Unity Splines; bounded authored surface geometry |
| Precise hard edges | Steps, ramps, low retaining edges, drainage edges, plinths | Use only where Terrain cannot own a clean transition | Existing modules first; ProBuilder or Mesh APIs for one bounded gap |
| Canopy planting | Trees in purposeful groups or edge rows | Shade, frame views and protect camera readability | `SM_MapleTree2` bounded URP adaptation visually proven; broader family unqualified |
| Understory planting | Shrubs, flowers, grasses, hedges | Define edges and screen only where sight lines remain safe | `SM_Bush_02` bounded URP adaptation visually proven; broader family unqualified |
| Open activity area | Lawn, small hard court, play or informal recreation area | Give the park a real use and preserve open tactical contrast | Site design first; no dedicated recreation asset family proven |
| Seating | Benches, picnic tables, low seat walls | Face a path, activity, view or social counterpart | `SM_Bench_04` bounded URP adaptation visually proven |
| Lighting | Street-edge lamps, path lights, restrained landmark lighting | Support entrances, junctions and night readability | `SM_Lamps01` plus restrained native point light proven in daytime only; night result unknown |
| Waste and maintenance | Bin, small service cabinet, discreet maintenance access | Near entrances or activity, outside circulation | `SM_Dustbin_03` bounded URP adaptation visually proven |
| Wayfinding | Small sign, notice board, map or clock | Only at decisions, entrances or meeting points | No current URP-ready park-prop family proven |
| Boundary | Low wall, hedge, railing or context-appropriate fence | Follow real ownership; retain multiple credible entrances | Existing neutral urban modules if qualified; otherwise one bounded adapter |
| Water or drainage | Dry swale, rain garden, fountain or bounded pond | Must follow site grade, safety and a believable water source | Dry treatment first; water remains optional and visually evidence-gated |
| Landmark | One fountain, statue, pavilion or context-specific civic object | Visible from an approach and useful for orientation | `SM_FountainBase` plus `SM_FountainStatue` bounded URP adaptation visually proven |
| Atmosphere | Sparse wear, leaves, dirt, puddles, particles and audio | Only after layout, access, ground and main assets pass | Decalery, built-in particles and audio where appropriate |
| Runtime support | Colliders, NavMesh, LODGroups, occlusion and probes | Validate after representative geometry exists | Unity native systems |

## Current URP-Usable Capability Shortlist

| Capability | Evidence state | Appropriate park use | Boundary |
|---|---|---|---|
| Unity Terrain and TerrainData | `LOCALLY PRESENT`; bounded technical use proven | Broad grade, lawn/soil zoning, planted areas and rain gardens | Not a curb, stair, wall or precise path-edge substitute |
| Unity Terrain tree/detail systems | `LOCALLY PRESENT` | Efficient placement after compatible vegetation assets exist | A placement system does not supply compatible trees or grass |
| Unity Splines `2.9.0` | `LOCALLY PRESENT` | Path guides, curved edges and bounded route-driven geometry | Do not create a competing city road graph |
| ProBuilder `6.1.2` and Mesh APIs | `LOCALLY PRESENT` | One missing step, ramp, low wall, plinth or hard-edge adapter | Bounded fallback, not a bespoke park-kit programme |
| Road Constructor `1.9.3` | `LOCALLY PRESENT`; connected-road construction proven | Park-side road branch, crossing, road end or changed street interface | Not for benches, planting, internal footpaths or decorative ground |
| Decalery `1.2` | `RUNTIME PROVEN` in current URP | Sparse fitted wear or markings after structure passes | Never conceal bad grade, seams or geometry |
| URP and Shader Graph `17.3.0` | `LOCALLY PRESENT` | Project-owned material variants and restrained effects | Does not make an HDRP Vendor prefab compatible automatically |
| Built-in lighting and probes | `LOCALLY PRESENT` | Readable park lighting and landmark emphasis | Must pass night visual review and performance checks |
| NavMesh runtime APIs | `LOCALLY PRESENT`; bounded project patterns exist | Walkability and path costs after geometry exists | The separate AI Navigation package workflow is not established |
| LODGroup, occlusion and Profiler tools | `LOCALLY PRESENT` | Validate representative vegetation and prop density | Optimization evidence, not design acceptance |

Detailed owners: [Unity Native Capability Atlas](Capabilities/C99-CAP-UNITY-NATIVE-ATLAS-001.md),
[Terrain and Hybrid Urban Ground](Capabilities/C99-CAP-UNITY-TERRAIN-HYBRID-001.md),
[Splines and ProBuilder](Capabilities/C99-CAP-UNITY-SPLINES-PROBUILDER-001.md),
[Road Constructor](Capabilities/C99-CAP-ROAD-CONSTRUCTOR-001.md) and
[Decalery](Capabilities/C99-CAP-DECALERY-001.md).

## Bounded URP-Qualified NYC Example Subset

`C99-EXAMPLE-PARK-COMPOSITION-V1` directly proved the following exact source
prefabs in one task-owned candidate: `SM_MapleTree2`, `SM_Bush_02`,
`SM_Bench_04`, `SM_Lamps01`, `SM_Dustbin_03`, `SM_FountainBase` and
`SM_FountainStatue`. Nine project-owned URP material variants preserved the
Vendor sources. The later site-fit candidate was Human-rejected because its
surface crossed roads and attached sidewalks on three sides. No site-fit method
or park baseline is adopted.

Durable learning: an outer road envelope is not the buildable parcel. A
Terrain-native test proved that a flood fill bounded by actual road and
intersection mesh footprints can identify the complete irregular parcel. A
follow-up freehand-style correction replaced binary cell-centre paint with four
sub-cell samples, partial TerrainLayer weights and a small underlap beneath the
road/sidewalk meshes. Direct overhead and oblique review found no materially
visible sawtooth edge on straight, diagonal or curved sides and no visible road
coverage. The Human accepted the clean result and requested it as the model for
other comparable fields.

A later five-site cross-validation visually passed the same mask on four
genuinely free parcels with long/curved, sloped trapezoidal, wedge and broad
trapezoidal proportions. The fifth mapped park site was initially occupied by
an existing industrial parcel. After Human-authorised replacement, the isolated
P1 successor removed the exact industrial composition and concrete cover,
restored 1,367 pre-existing Terrain-hole samples in its task-owned TerrainData
copy and visually passed as a continuous grass field. Future park-site selection
must still check retained non-road ground, buildings, functional content and
Terrain holes in addition to road enclosure.

Retain the mask method and current `T_Grass2` matte URP treatment as the
preferred starting point for confirmed-free comparable Terrain fields. Path
terminals and wall openings must reference the accepted parcel boundary. Lamps
should remain on named entrance or node hardstands beside circulation.

The proof is deliberately narrow. It establishes usable scale, material
appearance and host roles for these seven prefabs in this scene. It does not
qualify the park fence, other trees, grass, bicycles, clock, wider furniture
catalogue, nighttime lighting, performance or another site. Exact evidence:
[Task Closure Report](../../../../Projects/Crime99/Artifacts/Evidence/C99-EXAMPLE-PARK-COMPOSITION-V1/TASK_CLOSURE_REPORT.md)
and [Direct Visual Review](../../../../Projects/Crime99/Artifacts/Evidence/C99-EXAMPLE-PARK-COMPOSITION-V1/DIRECT_VISUAL_REVIEW.md).
Cross-site evidence:
[Cross-Site Closure](../../../../Projects/Crime99/Artifacts/Evidence/C99-EXAMPLE-PARK-COMPOSITION-V1/CrossSiteValidationV1/TASK_CLOSURE_REPORT.md)
and [Cross-Site Direct Visual Review](../../../../Projects/Crime99/Artifacts/Evidence/C99-EXAMPLE-PARK-COMPOSITION-V1/CrossSiteValidationV1/DIRECT_VISUAL_REVIEW.md).
P1 replacement evidence:
[Correction03 Closure](../../../../Projects/Crime99/Artifacts/Evidence/C99-EXAMPLE-PARK-COMPOSITION-V1/CrossSiteValidationV1/Candidate01Correction03/TASK_CLOSURE_REPORT.md)
and [Correction03 Direct Visual Review](../../../../Projects/Crime99/Artifacts/Evidence/C99-EXAMPLE-PARK-COMPOSITION-V1/CrossSiteValidationV1/Candidate01Correction03/DIRECT_VISUAL_REVIEW.md).

## Relevant but Not Currently URP-Qualified

The installed 1950s NYC family contains semantically relevant source models:

- benches;
- maple trees, other trees, bushes and grass;
- a park fence;
- a fountain base and fountain statue;
- bins;
- street and building lamps;
- a street clock and bicycles.

Except for the seven-prefab subset named above, these are not current
ready-to-use park assets. The discovered prefabs live below
`Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/`; their URP material, scale,
period fit and same-site visual result remain `UNKNOWN`. They may enter a future
shortlist only after one small dependency/material check and, when authorised,
a bounded URP visual preflight. Qualification must use a controlled
project-owned route and must not mutate the protected Vendor source.

The family is also a 1950s source for a 1990s game. Even technically compatible
items require period and style selection rather than wholesale use. See
[1950s NYC Environment](Capabilities/C99-ASSET-NYC1950S-ENVIRONMENT-001.md).

## Deliberately Excluded from the Default Park Pool

The following content is not a normal park candidate and must not appear in a
park shortlist just because a filename resembles a park term:

| Excluded source or class | Reason |
|---|---|
| Military Base watchtowers, checkpoints, guard buildings, climbing structures and security compounds | Military function and visual language do not belong in an ordinary civic park |
| Industrial Harbour factories, silos, tanks, pipes, cranes, loading equipment and compound structures | Industrial production infrastructure is not park furniture, planting or a civic landmark by default |
| Cyberpunk Port industrial, neon and port infrastructure | Wrong default function and strong style drift for a 1990s civic park |
| Containers, pallets, loading props and yard equipment | Create an industrial service yard rather than a park |
| Complete buildings, building walls, roofs, interiors and unrelated architectural modules | A generic filename match does not establish a park function |
| Traffic lights, vehicle props, demo roads and road-lab output | Street-system or diagnostic content, not park elements |
| Water tanks, water containers and files named `water` without a park-water role | Name does not prove a fountain, pond or drainage use |
| Historical task output and generated lab meshes | Presence is not reuse authority, adoption or general-purpose asset status |

If a future task explicitly calls for an industrial-redevelopment park,
memorial, retained rail structure or harbour promenade, that is a separate
site-specific query. Only then may one neutral relic be evaluated for that
named role; the excluded families do not become a general park library.

## Owned but Not Locally Usable

| Holding | Potential role | Current state |
|---|---|---|
| Grass Flowers Pack Free | Grass and flower dressing | Owned but not local; render-pipeline and performance state unknown |
| Rock and Boulders 2 | Natural slope or boundary accents | Owned but not local; old material and LOD state unknown |

Ownership does not authorise download or import. Neither holding belongs in a
current production shortlist until it is local and qualified for this URP
project.

## Park-Type Minimum Recipes

| Park type | Minimum credible composition | Optional addition | Avoid |
|---|---|---|---|
| Pocket park or small plaza | Two credible approaches where the site permits, direct path, small open core, seating, bin, light and boundary logic | One fountain, clock, statue or shade tree group | Random prop scatter, opaque perimeter or oversized landmark |
| Neighbourhood park | Connected loop and shortcut, open lawn/activity, edge planting, seating, lighting and maintenance logic | One play/sport area or civic landmark | One shared funnel entrance, unexplained leftover land or dense uniform trees |
| Linear park | Continuous path spine, frequent exits, planted pockets, seating and safe road crossings | Viewpoint or retained neutral urban feature | Repeated pinch points, disconnected ends or service-yard clutter |
| Hillside park | Accessible graded route, optional stair shortcut, terraces, retaining/drainage logic and overlooks | Small shelter or framed view landmark | Flat pasted ground, unsafe pond or vegetation blocking the gameplay camera |
| Waterfront park | Promenade, railing/seawall safety, landward exits, seating facing water and flood-aware planting | Viewing deck, beacon or one civic feature | Decorative water disconnected from the actual waterfront datum |
| Green or stormwater buffer | Through-route, planted edge, dry swale or retention area, visible exits and limited seating | Small interpretation sign or overlook | Presenting an inaccessible drainage strip as a full civic park |

## Evidence and Review Rules

- Site function and urban logic come before prop choice.
- Technical compatibility is a gate, not a substitute for visual suitability.
- Direct visual inspection from player-relevant height has priority for
  acceptance. Use focused views of entrances, paths, activity, boundaries and
  the landmark, not overview-only evidence.
- A visually plausible overlap hidden below an existing road, sidewalk or
  building can be acceptable when it creates no visible or collision defect.
- If one element fails, preserve the viable composition and replace or correct
  that element. Do not reset the entire park by default.
- One failed prefab, material or placement does not reject its complete family.
- Record `UNKNOWN` when compatibility or fit has not been inspected; do not
  convert uncertainty into either acceptance or rejection.

## Current Gaps and Best Next Capability Check

Current gaps are:

- no verified broad URP-ready vegetation family beyond one tree and one shrub;
- no verified broad URP-ready park-furniture family beyond one bench, lamp and bin;
- no dedicated recreation/play family;
- no accepted park-water visual baseline;
- no park composition has been adopted.

When a concrete park site is selected, first map its full parcel polygon,
sidewalk hosts, entrances, path structure and open-space use with native
capabilities. The supersampled road-mesh-bounded Terrain mask is now a scoped
successful boundary method for this parcel. The old procedural dark green and
glossy variant are rejected; the Human accepted the current matte `T_Grass2`
result as the preferred starting treatment for comparable fields. The proven
seven-prefab subset is the first dressing shortlist after ground acceptance. Do
not replace the successful mask when correcting another layer, and do not place
the broader HDRP, military or industrial catalog without a named missing
function.

## Search Tags

`park`, `plaza`, `garden`, `green buffer`, `stormwater`, `public space`,
`URP`, `Terrain`, `Splines`, `path`, `vegetation`, `bench`, `lighting`,
`fountain`, `landmark`, `boundary`, `park capability gap`
