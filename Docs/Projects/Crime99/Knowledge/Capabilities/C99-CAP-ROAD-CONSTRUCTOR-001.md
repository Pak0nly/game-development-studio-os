# Road Constructor 1.9.3

**Capability ID:** `C99-CAP-ROAD-CONSTRUCTOR-001`  
**Type:** Installed Unity tool/package  
**Owner:** Crime99 technical capability knowledge  
**Last verified:** 2026-08-28  
**Current disposition:** Strong native-first option for connected roads and
access branches. Native settings do not expose arbitrary one-sided crossfall,
but a persisted project-owned deformation of the already generated Road
Constructor meshes is proven for one local park entrance.

## Identity and Availability

- Product: Pampel Games Road Constructor, locally identified as version
  `1.9.3`, package/product ID `287445`.
- Installed root:
  `Projects/Crime99/Source/Crime99/Assets/PampelGames/RoadConstructor/`.
- Road set:
  `Assets/PampelGames/RoadConstructor/Demo/Scriptables/DemoRoads.asset`.
- Local catalog: 17 roads, 6 lane presets, 14 spawn-object presets and 7
  traffic-lane presets.
- No purchase, download, package, licence or integration authority is implied
  by this record.

## Intended Uses

- Problem tags: roads, local street, driveway, entrance, service access,
  intersection, T-junction, branch, cul-de-sac, roundabout, ramp, traffic
  lanes, waypoints, road ends.
- Strong uses: native road construction, connected branches, intersections,
  road-width transitions, road ends, curved local roads and road-system
  serialization.
- Unproven uses: a Vendor-named driveway workflow, exact narrow paved access
  at `FACE_006`, and automatic AI traffic support for the 4 m rural profiles.
- Unsuitable conclusion: one failed custom mesh reconstruction must not be
  treated as rejection of Road Constructor construction APIs or other road
  profiles.

## Relevant Local Road Profiles

| Profile family | Names | Serialized width | Decision note |
|---|---|---:|---|
| Rural | `Dirt`, `Gravel` | 4 m | Closest installed footprint to a driveway/service track; no traffic lanes recorded in the deep evaluation catalog |
| Local two-way | `Side Street Asphalt`, `Side Street Pave`, `Side Street Grass` | 10 m | Proven local-street and intersection basis; may be too broad for a private driveway |
| One-way | `One-Way Asphalt`, `One-Way Pave`, `One-Way Grass` | 10 m | Directional operation does not reduce the installed profile width |
| Larger roads | Boulevard, Main Street and Highway families | 20–30 m | City hierarchy and width-transition options, not driveway candidates |

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| The package can preview and construct named roads | `STATICALLY VERIFIED` and `RUNTIME PROVEN` | [RoadConstructor.cs](../../../../../Projects/Crime99/Source/Crime99/Assets/PampelGames/RoadConstructor/Scripts/Components/RoadConstructor.cs); [Run09 result](../../../../../Projects/Crime99/Artifacts/Evidence/C99-ROAD-CONSTRUCTOR-DEEP-CAPABILITY-AND-VISUAL-EVALUATION-V1/Unity/Run09/Records/UNITY_RUN09_RESULT.json) | Technical construction is not current-site visual acceptance |
| Native branches can replace/create road and intersection objects | `RUNTIME PROVEN` | [Run09 result](../../../../../Projects/Crime99/Artifacts/Evidence/C99-ROAD-CONSTRUCTOR-DEEP-CAPABILITY-AND-VISUAL-EVALUATION-V1/Unity/Run09/Records/UNITY_RUN09_RESULT.json), constructions `C_X_SOUTH`, `C_X_NORTH`, `C_T_NORTH` | Isolated evaluation fixture |
| Different-width native roads can connect | `RUNTIME PROVEN` | [Run09 result](../../../../../Projects/Crime99/Artifacts/Evidence/C99-ROAD-CONSTRUCTOR-DEEP-CAPABILITY-AND-VISUAL-EVALUATION-V1/Unity/Run09/Records/UNITY_RUN09_RESULT.json), `C_WIDTH_MAIN` and `C_WIDTH_LOCAL` | Does not prove every category pairing or current Terrain contact |
| Roundabouts and cul-de-sacs can be constructed | `RUNTIME PROVEN` | [Run09 result](../../../../../Projects/Crime99/Artifacts/Evidence/C99-ROAD-CONSTRUCTOR-DEEP-CAPABILITY-AND-VISUAL-EVALUATION-V1/Unity/Run09/Records/UNITY_RUN09_RESULT.json), `C_ROUNDABOUT` and `C_CULDESAC` | Not required for the current driveway problem |
| The current whole-city scene uses the complete catalog | `REJECTED FOR STATED USE` | [Current source scene](../../../../../Projects/Crime99/Source/Crime99/Assets/_Crime99/Phase4/WholeCityUrbanSurfaceLanguageV2/Scenes/WholeCityUrbanSurfaceLanguageV2_Candidate03.unity) serialized only `Side Street Asphalt` and `Boulevard Asphalt` road descriptions | Inspection is of the current source scene, not every historical scene |
| A dedicated named driveway preset exists | `UNKNOWN / REFRESH REQUIRED` | No `driveway`, `entrance` or `access road` feature name found in the local package search | A short road branch or project-owned native profile may still provide the function |

## Successful Applications

| Use and candidate | Result | Reusable conclusion | Transfer limit |
|---|---|---|---|
| Deep native X/T, curve, width transition, roundabout and cul-de-sac fixture, Run09 | Technical constructions valid with no recorded construction failures; traffic components and waypoints created | Native construction and connection machinery is locally functional | Isolated fixture; visual production adoption remains separate |
| Whole-city secondary street and block network, [Candidate11](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-SECONDARY-STREET-AND-BLOCK-NETWORK-V1/SECONDARY_NETWORK_CANDIDATE11_SUCCESS_NOT_ADOPTED_MANIFEST.json) | Native `Side Street Asphalt` continuation produced a saved success-not-adopted macro candidate | Road Constructor can extend a larger city network through native calls | Does not qualify driveway scale, parcel entry or final adoption |
| Same-scene park Gravel native-minimum junction, [Candidate01 Correction02](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-ROAD-TERRAIN-GRADING-V1/Candidate01Correction02NarrowJunction/PostSaveCandidateEvaluation01/DIRECT_VISUAL_INSPECTION.md) | A perpendicular `4 m Gravel -> 10 m Side Street Asphalt` branch reduced the opening from `9.02 m` to `7.09 m`; focused originals show a closed road seam, while Terrain stayed byte-exact | For this width pairing, package knot-spacing validation sets a native opening floor near `7.1 m`; non-seamless branch demolition can merge the old frontage before reconstruction, and the smaller junction legitimately exposes two short host connectors | Local visual pass with concerns only: not an exact 4 m curb cut, signals were regenerated away while markings remain, and broader Gravel/Terrain support is unresolved |
| Same-scene one-sided park transition, [Correction08 persisted visual review](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-ROAD-TERRAIN-GRADING-V1/C08AsymmetricExistingRoadMeshAppliedValidation01/DIRECT_VISUAL_REVIEW.md) | Eight existing intersection, host-road and Gravel LOD meshes persisted after reopening; the park edge drops about `0.07 m`, the far edge remains effectively unchanged, the integrated Gravel submesh is hidden inside the carriageway, and four direct originals pass the target visual checks | When native shared-datum settings cannot express a local asymmetric transition, post-generation vertex deformation of the existing Road Constructor meshes can do so without a plane or replacement road | Local project-owned exception; Road Constructor regeneration can overwrite it, Human acceptance and gameplay/collision qualification remain separate |
| Existing zebra crossings on the asymmetric park transition, [Correction09 persisted visual review](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-ROAD-TERRAIN-GRADING-V1/C09CrossingsConformedToAsymmetricRoadCorrection03Validation01/DIRECT_VISUAL_REVIEW.md) | The two existing crossing meshes were surface-conformed across the underlying intersection and host-road asphalt; focused high and low originals show complete stripes without a visible floating gap | Marking meshes must be conformed after a nonlinear road deformation; sampling every affected asphalt host avoids the clipping produced by a single flat four-vertex marking | Local project-owned exception; direction arrows, collision and later Road Constructor regeneration are outside this proof |

## Failed or Misapplied Applications

| Use and candidate | Failure class/root cause | Reusable shield | What it does not prove |
|---|---|---|---|
| Hybrid block ground [Candidate04 Correction01](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-HYBRID-BLOCK-GROUND-PILOT-V1/Candidate04Correction01/TERMINAL_STATUS.json) | Pre-mesh topology-precondition failure: baseline mesh rings were not strictly longitudinal | Do not force a road-object render mesh through an incompatible full-ring reconstruction method without proving ring order | Does not reject `DisplayRoad`, `ConstructRoad`, snapping, intersections or alternate profiles |
| Hybrid block ground [Candidate05 Correction01](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-HYBRID-BLOCK-GROUND-PILOT-V1/Candidate05Correction01Operational/RunState/TERMINAL_STATUS.json) | Road Constructor was deliberately excluded; broad Terrain and detached owned meshes failed visually | Do not cite this candidate as a Road Constructor attempt | Does not say whether a native branch would fit or connect |
| Secondary network Candidates used a single fixed profile | Method-selection limitation | Do not infer catalog-wide comparison from repeated `Side Street Asphalt` candidates | Other local, one-way and rural profiles remain contextually untested |
| Current-Terrain park Gravel access [Candidate01](../../../../../Projects/Crime99/Artifacts/Evidence/C99-PARK-GRAVEL-ACCESS-CURRENT-TERRAIN-V1/Candidate01/DIRECT_VISUAL_REVIEW.md) | The single registered Gravel access rebuilt and saved with native Terrain fitting, but Human grazing-angle review showed the entire rendered Gravel path still visibly elevated above Terrain | Spline-to-Terrain distance is not a rendered-contact metric; inspect the visible mesh underside/contact edge and use narrow local underfill where native fitting leaves a continuous gap | Rejects this same-site fitting result, not the Gravel profile or Road Constructor generally |
| Current-Terrain Gravel Base Height corrections [Correction01](../../../../../Projects/Crime99/Artifacts/Evidence/C99-PARK-GRAVEL-ACCESS-CURRENT-TERRAIN-V1/Candidate01Correction01/DIRECT_VISUAL_REVIEW.md) and [Correction02](../../../../../Projects/Crime99/Artifacts/Evidence/C99-PARK-GRAVEL-ACCESS-CURRENT-TERRAIN-V1/Candidate01Correction02/HUMAN_VISUAL_REVIEW_01.md) | The Gravel lane itself has zero height while Road Constructor adds the global `Base Height` to rendered road and intersection/end geometry but fits Terrain to the logical spline. `0.10 m` visibly floated; `0.00 m` produced coplanar Terrain occlusion. Correction02 rebuilt only the middle road mesh at `0.01 m`; Human review found both unchanged `0.10 m` endpoints elevated and parts of the middle occluded | Treat a Road Constructor road and its connected intersection/end objects as one height-coherent family. Regenerating only the road mesh creates a mixed-height visual failure. A small positive clearance remains plausible but is not yet visually proven | Same-site Gravel result only; the frontage intersection is shared by three roads, so lowering it affects more than the Gravel branch |
| Current-Terrain Gravel transient height A/B [Correction03](../../../../../Projects/Crime99/Artifacts/Evidence/C99-PARK-GRAVEL-ACCESS-CURRENT-TERRAIN-V1/Candidate01Correction03_ABHeightOptions/DIRECT_VISUAL_REVIEW.md) | Four matched views compared `(A)` Gravel plus free park end at `0.03 m`, leaving frontage/street at `0.10 m`, against `(B)` Gravel, free end, shared frontage intersection and its three connected roads at `0.03 m`. Both kept the full path visibly present and removed the conspicuous floating free end; lowering the street family added no meaningful visual benefit | Prefer the smaller local family first. A broader connected-street rebuild is not justified when focused originals show no corresponding visual gain. The curb opening and pedestrian-signal interface remain a separate coordinated visual correction | Transient visual test only; neither variant was saved or adopted, and it does not prove every Terrain grade or road profile |
| Same-site native Gravel Ramp [Candidate01 Correction06](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-ROAD-TERRAIN-GRADING-V1/Candidate01Correction06NativeGravelRamp/DIRECT_VISUAL_INSPECTION.md) | Road Constructor produced a valid native `RampObject`, preserved the 4 m Gravel road and isolated the connection to one host-road side, but the near-perpendicular connection left a large open road underside, Terrain voids, asymmetric slivers and no credible curb opening | Do not use the native Ramp construction as a perpendicular driveway substitute at this width pairing; its one-sided merge behavior remains relevant for oblique road merges | Site-specific visual failure; it does not reject Ramp for conventional angled on/off-ramp or merge geometry |
| Same-site matched Gravel endpoint [Correction07](../../../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-ROAD-TERRAIN-GRADING-V1/C07ApplyGravelEndpointSmooth/DIRECT_VISUAL_REVIEW.md) | Raising only the Gravel frontage endpoint and short host connectors by `0.07 m` was technically measurable but remained practically indistinguishable from the rejected reference; the requested visibly normal opposite side was not achieved | Do not treat endpoint equality or saved-byte differences as visual progress. The shared T-intersection datum and mirrored profile require a structurally different profile/topology method for a true one-sided transition | Rejects this parameter/endpoint method at this site, not all project-owned Road Constructor profiles |

## Decision Guidance

- Prefer when a road, service route, entrance or yard access must connect to the
  native road graph and benefit from native intersection, lane, road-end,
  serialization or waypoint support.
- For the current `FACE_006` problem, compare a short native `Gravel` branch,
  a local `Side Street Pave` branch and, only if needed, one project-owned
  narrow paved Road Constructor profile before authoring another detached
  apron mesh.
- Avoid using a 10 m one-way profile merely because it sounds narrower; the
  installed one-way profiles are still 10 m wide.
- Combine with Terrain for broad grade/landscape support. `Base Height` is a
  shared construction setting, not a per-road `RoadSettings` override. A local
  temporary value must regenerate every affected road/intersection/end mesh and
  all relevant LODs before the shared setting is restored.
- A native T-intersection uses one shared vertical datum; `smoothSlope`, mesh
  resolution, detail resolution and smart reduction do not create a one-sided
  crossfall. For a shallow branch mismatch, first test matching only the branch
  endpoint to the unchanged street and grading along the branch.
- If the native shared datum remains visually inadequate, Unity's Mesh API can
  deform the already generated intersection/road LOD meshes asymmetrically.
  Treat this as a post-generation local exception: preserve all affected LODs,
  isolate material submeshes such as the integrated Gravel connector, capture
  matched views, and reapply or replace the deformation after regeneration.
- After such a deformation, conform existing surface markings to every
  underlying asphalt mesh they cross. A single flat marking quad can clip or
  float where an intersection and its host roads no longer share one plane.
- Native construction can avoid technical debt in road connections, road ends,
  later traffic/waypoint integration and serialization. A bespoke narrow
  profile adds configuration/reimport responsibility but may still create less
  debt than an unrelated custom road tongue.

## Unknowns and Refresh Triggers

- `UNKNOWN`: visual and collision fit of each credible access profile at the
  exact current site.
- `UNKNOWN`: whether the rural profiles can support the intended player and AI
  vehicle classes without separate traffic configuration.
- `UNKNOWN`: the smallest safe project-owned paved profile compatible with the
  existing road set.
- Refresh after Road Constructor, Unity, road-set, source-scene or accepted
  city-baseline changes.
- Smallest useful next proof: one bounded same-site native access comparison
  with same-camera original screenshots; no whole-city rollout.

## Search Tags

`road-constructor`, `road`, `driveway`, `entrance`, `service-access`,
`intersection`, `branch`, `t-junction`, `cul-de-sac`, `road-end`, `traffic`
