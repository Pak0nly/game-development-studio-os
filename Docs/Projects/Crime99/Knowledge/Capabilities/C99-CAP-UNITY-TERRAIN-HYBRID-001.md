# Unity Terrain and Hybrid Urban Ground

**Capability ID:** `C99-CAP-UNITY-TERRAIN-HYBRID-001`  
**Type:** Engine capability plus project workflow  
**Owner:** Crime99 technical capability knowledge  
**Last verified:** 2026-08-28  
**Current disposition:** Retain Terrain for broad grade, landscape and
road-bounded functional material zoning. A supersampled partial-weight mask is
visually proven across five irregular park parcels. Do not use it as a
substitute for road-owned entries, curbs, yards or precise service topology.

## Identity and Availability

- Unity Terrain is present in the canonical Crime99 Unity project.
- Crime99 contains multiple Terrain, urban-ground, material-zoning and hybrid
  road/contact labs under project-owned `_Crime99` roots.
- TerrainData cloning and task-owned derived Terrain workflows have executed
  locally.
- This record does not authorise Terrain mutation or a Unity run.

## Intended Uses

- Problem tags: broad grade, landscape, zoning, park, garden, soil, grass,
  terrain contact, parcel support, city ground.
- Strong uses: broad continuous elevation, planned green/soil areas, large
  landscape transitions and road-bounded material zoning for parcel purpose,
  including candidate lawns, parking/service underlay, traffic wear zones,
  building-edge dirt and informal foot wear.
- Weak or rejected uses: precision curb ownership, road-surface replacement,
  narrow driveway portals, isolated rectangular yards and broad radial grades
  that overwrite native road readability.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| TerrainData can be cloned and changed in a task-owned candidate | `RUNTIME PROVEN` | [Candidate05 Correction01 terminal status](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-HYBRID-BLOCK-GROUND-PILOT-V1/Candidate05Correction01Operational/RunState/TERMINAL_STATUS.json) | Technical execution only |
| Broad grading can preserve exact source assets while producing a candidate | `RUNTIME PROVEN` | [Candidate05 Correction01 terminal status](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-HYBRID-BLOCK-GROUND-PILOT-V1/Candidate05Correction01Operational/RunState/TERMINAL_STATUS.json), protected-source hashes and candidate TerrainData | Does not prove visual fit |
| The Candidate05 broad radial grade produced acceptable city-ground continuity | `REJECTED FOR STATED USE` | [Candidate05 Correction01 terminal status](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-HYBRID-BLOCK-GROUND-PILOT-V1/Candidate05Correction01Operational/RunState/TERMINAL_STATUS.json), six native originals and independent review | Exact failed method/site; not a Terrain-wide rejection |
| Terrain alone provides precise native road, apron and yard topology | `REJECTED FOR STATED USE` | [Candidate05 Correction01 terminal status](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-HYBRID-BLOCK-GROUND-PILOT-V1/Candidate05Correction01Operational/RunState/TERMINAL_STATUS.json), road fragmentation, disconnected grey entry tongue and isolated rear patch | A different constrained hybrid method remains possible |
| Terrain-following one-metre mesh tessellation prevents broad interior Terrain breakthrough | `VISUALLY PROVEN WITH CONCERNS` | [Industrial Compound Correction01 direct review](../../../../../Projects/Crime99/Artifacts/Evidence/C99-INDUSTRIAL-COMPOUND-COMPOSITION-V1/Candidate01Correction01/DIRECTOR_VISUAL_REVIEW.md) | Interior coverage improved; visible cell-clipped boundary and road threshold failed adoption |

## Successful Applications

| Use and candidate | Result | Reusable conclusion | Transfer limit |
|---|---|---|---|
| Broad Terrain ownership, cloning and guarded source preservation in Candidate05 | Technical pass | Terrain is usable as a protected, derived broad-grade layer | Visual topology failed |
| Earlier Terrain/material labs | Multiple formative technical and zoning results | Terrain is useful for broad grade and material zones | No single lab is a whole-city urban-ground baseline |
| Terrain-following compound interior in Industrial Compound Correction01 | Broad Terrain-colored holes from corner-only quads disappeared in all three native originals | Sample the interior densely enough to follow Terrain height rather than spanning variable Terrain from four corners | Cell-grid clipping is not acceptable for the visible parcel boundary |
| Five mapped park parcels in Example Park CrossSiteValidationV1 | Direct review passes the same four-sample partial-weight road-bounded mask on curved, sloped, wedge and trapezoidal proportions; P1 additionally required removal of an obsolete cover and restoration of its task-owned Terrain holes | Reuse the boundary/mask method for confirmed functional parcels; select a purpose-specific TerrainLayer rather than creating a new plane | Grass is proven; parking, heavy-traffic and wear materials still require their own visual qualification |
| Selective whole-city road/Terrain grading in `C99-WHOLE-CITY-ROAD-TERRAIN-GRADING-V1 / Candidate01` | One copied TerrainData was selectively conformed only at bounded non-elevated road-footprint mismatches; 254 roads / 111 intersections and their geometry signature stayed exact. Two sampled city-road edges showed no obvious regression, but the park Gravel road retained elevated connection/end objects around a lower middle | `REJECTED FOR CONTROLLING USE`: Terrain-only support cannot repair a mixed-height Road Constructor road plus endpoint/intersection family. Establish one coherent native vertical profile first; reconcile Terrain second | Exact method/use-case failure, not a rejection of selective Terrain grading elsewhere. Evidence: [Candidate01 terminal status](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-ROAD-TERRAIN-GRADING-V1/Candidate01/TERMINAL_STATUS.json) and [corrected direct visual inspection](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-ROAD-TERRAIN-GRADING-V1/Candidate01/DIRECT_VISUAL_INSPECTION.md) |
| Road-first Gravel correction in `Candidate01Correction01RoadProfile` | The old Gravel road and its obsolete Gravel-only free-end intersection were replaced together. Road Constructor then created the street connection, road and new free end on one coherent profile; four direct originals pass visually. A later Terrain-support scan found zero qualifying raise samples | Remove stale road-owned endpoint anchors when replacing a whole access profile. Visually inspect the coherent native road family before changing Terrain; zero required Terrain samples is a valid no-op, not a reason to force a grade | Proven for this bounded park access, not a general instruction to delete shared intersections. Evidence: [profile manifest](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-ROAD-TERRAIN-GRADING-V1/Candidate01Correction01RoadProfile/PROFILE_MANIFEST.json) and [direct visual inspection](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-ROAD-TERRAIN-GRADING-V1/Candidate01Correction01RoadProfile/DIRECT_VISUAL_INSPECTION.md) |

## Failed Applications

| Use and candidate | Failure class/root cause | Reusable shield | What it does not prove |
|---|---|---|---|
| Candidate05 radial grade plus local entry/yard meshes | Material visual failure: grade occluded and fragmented native roads; patches did not form one continuous usable topology | Constrain Terrain to the block interior and preserve road-owned hard edges | Does not reject bounded interior grading or a road-native entry |
| Cell-centre polygon inclusion for a visible compound perimeter | One-metre stair steps remain obvious in player-relevant views | Build the visible edge from smooth shared vector boundaries, then tessellate only the interior against Terrain | Does not reject dense Terrain sampling inside the boundary |

## Decision Guidance

- Prefer Terrain for broad grades and deliberate landscape or zoning areas
  where smooth large-scale continuity matters more than authored hard edges.
- Reuse the road-bounded supersampled mask to assign broad parcel purpose before
  dressing. The same geometry can support lawn, soil, parking/service colour,
  traffic wear or building-edge wear, but each material language must be
  visually qualified for its stated use.
- Prefer Road Constructor for connected road branches and intersections.
- When replacing an entire road access, include a terminal intersection only if
  it is exclusively owned by that road. Leaving such an obsolete free end in
  place can make the replacement snap back to the old height. Never generalise
  this to shared junctions.
- For an existing city network, do not infer that every visible contact issue
  requires lowering the complete road family. First scan the full network, then
  modify only bounded local Terrain support while leaving road geometry and
  shared road datum unchanged.
- Prefer authored mesh geometry for curbs, foundations, drainage, loading
  edges and other hard transitions that Terrain cannot own cleanly.
- For the current block, Terrain should remain inside the parcel/block support
  region and meet one genuinely connected road-apron-yard topology; it should
  not cover or replace the native road surface.
- This division avoids later debt from buried roads, disconnected hardscape
  islands and cosmetic seam concealment.

## Unknowns and Refresh Triggers

- `UNKNOWN`: the final visual materials and blend strengths for parking,
  heavily trafficked ground, building-edge dirt and informal foot wear. Their
  use cases are plausible; only the grass treatment is visually proven.
- Check Terrain holes before removing an authored cover. A task-owned hole
  restoration may be required when a former parcel deliberately cut the Terrain;
  never infer this from an object name or mutate protected TerrainData.
- `UNKNOWN`: final relationship to buildings, foundations and the eventual
  player camera.
- Refresh after accepted city Terrain, road topology, building massing or
  material-pipeline changes.
- Smallest useful next proof is one purpose-specific material zoning candidate
  on a confirmed parcel, using the proven mask without adding geometry.

## Search Tags

`unity-terrain`, `hybrid-ground`, `grade`, `landscape`, `zoning`,
`road-contact`, `parcel`, `yard`, `terrain-seam`
