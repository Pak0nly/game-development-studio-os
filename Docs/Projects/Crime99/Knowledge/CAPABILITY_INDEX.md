# Crime99 Capability Index

**Last consolidated:** 2026-08-26  
**Known-holdings coverage:** [`LOCAL CURRENT / ACCOUNT SNAPSHOT 2026-08-22`](CAPABILITY_COVERAGE_REGISTER.md)

Read this decision index and the coverage register before selecting a method.
The index routes important choices to decision-ready records; the register
ensures that low-relevance, supporting and currently uninstalled holdings are
not forgotten.

## Decision-Ready Records

| Capability ID | Capability | Availability | Useful for | Current disposition |
|---|---|---|---|---|
| `C99-CAP-ROAD-CONSTRUCTOR-001` | [Road Constructor 1.9.3](Capabilities/C99-CAP-ROAD-CONSTRUCTOR-001.md) | Installed | Connected roads, profiles, intersections, branches, ends, ramps, roundabouts and cul-de-sacs | Primary native-first road option; exact use-case fit still requires visual proof |
| `C99-CAP-GLEY-TRAFFIC-PEDESTRIAN-001` | [Gley Traffic and Pedestrian Systems](Capabilities/C99-CAP-GLEY-TRAFFIC-PEDESTRIAN-001.md) | Installed | Traffic/pedestrian topology, waypoints, routes, crossings, pools and diagnostics | Strong after visible geometry is credible; not a road-surface generator |
| `C99-ASSET-GLEY-URBAN-ROADS-001` | [Gley Urban Visible Road Modules](Capabilities/C99-ASSET-GLEY-URBAN-ROADS-001.md) | Installed | Curves, junctions, crossings, narrowing, overpass and roundabout alternatives | Static module option; Crime99 connector and visual fit unproven |
| `C99-ASSET-NYC1950S-ROADS-001` | [1950s NYC Package-Native Roads](Capabilities/C99-ASSET-NYC1950S-ROADS-001.md) | Installed | 3/6/12/24 m entries, L/T/crossings and width transitions | Strong targeted visual option; current use-case fit unproven |
| `C99-CAP-UNITY-TERRAIN-HYBRID-001` | [Unity Terrain and Hybrid Urban Ground](Capabilities/C99-CAP-UNITY-TERRAIN-HYBRID-001.md) | Installed | Broad grade, landscape, zoning and ground transitions | Broad support; not a precise road-entry/yard substitute |
| `C99-CAP-UNITY-SPLINES-PROBUILDER-001` | [Unity Splines and ProBuilder](Capabilities/C99-CAP-UNITY-SPLINES-PROBUILDER-001.md) | Installed | Bounded curb, apron, drainage and hard-edge adapters | Last bounded option after native assets are exhausted |
| `C99-CAP-DECALERY-001` | [Decalery 1.2](Capabilities/C99-CAP-DECALERY-001.md) | Installed | Sparse fitted wear, repair, markings and mesh decals | Use after structural visual acceptance; never as concealment |
| `C99-CAP-RCCP-VEHICLES-001` | [RCCP Vehicles](Capabilities/C99-CAP-RCCP-VEHICLES-001.md) | Installed; accepted local 2.57.0 basis | Vehicle physics, setup, damage, AI, cameras, audio, VFX and variants | Accepted vehicle basis; store 3.1.0.LTS does not imply upgrade |
| `C99-ASSET-NYC1950S-ENVIRONMENT-001` | [1950s NYC Environment Family](Capabilities/C99-ASSET-NYC1950S-ENVIRONMENT-001.md) | Installed | Buildings, interiors, props, vegetation, vehicles, characters and street support | Broad city raw material; individual selections still need fit proof |
| `C99-ASSET-NYC-ALLEY-001` | [1970 s New York City Alley](Capabilities/C99-ASSET-NYC-ALLEY-001.md) | Installed local 1.0; store 2.0 | Alley facades, fire escapes, pipes, doors, waste and service dressing | Service/rear-yard raw material; preserve version difference |
| `C99-ASSET-INDUSTRIAL-HARBOUR-001` | [Industrial Harbour](Capabilities/C99-ASSET-INDUSTRIAL-HARBOUR-001.md) | Qualified building source; two complete BrickHouse hosts proven; generated compound grounds and one spatial Vendor tile crop rejected; individual Vendor ground/road/floor materials render | Factories, warehouses, semantic authored yard candidates, loading/service yards, quay edges, silos, tanks, pipes and industrial infrastructure | Do not select by asset proximity. First model all surrounding roads/intersections, block and parcel edges, frontage/service access and a true player-height view; only then evaluate a semantic Vendor yard owner if one exists |
| `C99-ASSET-CYBERPUNK-PORT-001` | [Cyberpunk Port City](Capabilities/C99-ASSET-CYBERPUNK-PORT-001.md) | Installed | Harbour, industrial, warehouse, utility and container raw material | Useful with strong style restraint and local material validation |
| `C99-ASSET-MILITARY-BASE-001` | [Military Base](Capabilities/C99-ASSET-MILITARY-BASE-001.md) | Installed | Industrial perimeter, fences, gates, towers, storage and security | Bounded infrastructure source; avoid military thematic escalation |
| `C99-ASSET-FUYOH-DINER-001` | [Fuyoh Cyberpunk Diner](Capabilities/C99-ASSET-FUYOH-DINER-001.md) | Installed | Exclusion/discovery checks only | `TEMPORARILY EXCLUDED / DO NOT USE` |
| `C99-CAP-UNITY-PLATFORM-001` | [Unity Platform, URP, Input and Validation](Capabilities/C99-CAP-UNITY-PLATFORM-001.md) | Installed | Rendering, Shader Graph, input, UI, physics/vehicles, Burst data and tests | Common substrate; package presence is not consumer proof |
| `C99-CAP-UNITY-NATIVE-ATLAS-001` | [Unity Native Capability Atlas](Capabilities/C99-CAP-UNITY-NATIVE-ATLAS-001.md) | Installed Unity engine, official packages, modules and Editor tools | Problem routing across native authoring, runtime, diagnostics, performance, build and automation capabilities | Mandatory Unity-native shortlist before bespoke code, new dependency or Asset Store solution |
| `C99-CAP-CRIME99-WORKFLOWS-001` | [Crime99 Production, Test and Evidence Workflows](Capabilities/C99-CAP-CRIME99-WORKFLOWS-001.md) | Local project-owned | Reusable accepted code/tests, diagnostics, variants and negative evidence | Reuse only with matching input/output and authority contracts |
| `STUDIO-CAP-AUTHORITY-CONTINUITY-001` | [Authority Continuity and Director Dispatch](Capabilities/STUDIO-CAP-AUTHORITY-CONTINUITY-001.md) | Local Studio tool | Authority drift checks and receipt-bound mutation dispatch | Mandatory where its owner requires it; grants no extra authority |
| `STUDIO-CAP-HUMAN-VISUAL-DECISION-001` | [Human Visual Decision Tool](Capabilities/STUDIO-CAP-HUMAN-VISUAL-DECISION-001.md) | Local Studio tool | Prepared-preview Human decisions and deterministic text export | Use only after decision-relevant original visual evidence exists |
| `STUDIO-CAP-MODEL-ROUTING-001` | [Model Routing Validator](Capabilities/STUDIO-CAP-MODEL-ROUTING-001.md) | Local Studio tool | Static validation of routing records | Validation support; not an independent review |
| `C99-OWNED-SEE-THROUGH-SHADER-001` | [See-through Shader](Capabilities/C99-OWNED-SEE-THROUGH-SHADER-001.md) | Owned; not local | Camera-obstruction transparency/visibility | Preflight only for a proven obstruction need |
| `C99-OWNED-ETHEREAL-URP-001` | [Ethereal URP 2024](Capabilities/C99-OWNED-ETHEREAL-URP-001.md) | Owned; not local | Volumetric lighting, fog and atmosphere | Preflight only after a named atmosphere gap |
| `C99-OWNED-ARCADE-RACING-CAR-001` | [ARCADE: FREE Racing Car](Capabilities/C99-OWNED-ARCADE-RACING-CAR-001.md) | Owned; not local | Lightweight arcade vehicle comparison | Low priority; do not create a second vehicle stack casually |

## Cross-Capability References

| Reference ID | Reference | Use |
|---|---|---|
| `C99-REF-PARK-ELEMENTS-001` | [Park Element Reference](PARK_ELEMENT_REFERENCE.md) | Curated URP-first park-function grammar, currently usable native/tool routes, explicitly unqualified relevant assets, exclusions, evidence limits and minimum assembly recipes |

## Current Problem Routing

| Problem | Consult first | Decision principle |
|---|---|---|
| Road-connected driveway, service entrance or yard access | Road Constructor, NYC roads, Gley Urban roads, then Terrain/Splines | Compare existing native connections before custom geometry; judge the result visually |
| Whole-city road hierarchy or street-network overhaul | [Whole-City Road Network Overhaul Blueprint](../WHOLE_CITY_ROAD_NETWORK_OVERHAUL_BLUEPRINT.md), Road Constructor, Gley/NYC roads | Use road types by urban function and retain a coherent connected graph |
| AI traffic or pedestrians | Gley Traffic/Pedestrian plus the chosen visible-road record | Geometry and runtime routing are separate claims |
| Vehicle behavior, setup or variants | RCCP record; ARCADE only for a proven framework gap | Maintain one accepted vehicle basis unless comparison evidence justifies change |
| Urban block shell or frontage | NYC environment, then coverage register | Select existing modular holdings before new construction |
| Rear yard, alley or service space | NYC Alley, NYC environment, Road Constructor | Access topology comes before service dressing |
| Harbour, warehouse or industrial district | Industrial Harbour, then Cyberpunk Port, Military Base and NYC environment | Start with neutral purpose-built industrial grammar; reuse bounded raw material and control theme/style drift |
| Broad grade, landscape or planned green area | Terrain/Hybrid Ground | Terrain carries broad form; authored geometry carries precise edges and access |
| Park, plaza, garden, green buffer, waterfront open space or stormwater landscape | [Park Element Reference](PARK_ELEMENT_REFERENCE.md), then its linked capability records | Query the functional grammar and URP-qualified routes first; exclude irrelevant filename matches and keep unqualified Vendor assets out of the production shortlist |
| Missing curb, apron, drainage or hard-edge adapter | Road Constructor and package-native roads, then Splines/ProBuilder | Custom mesh is a bounded fallback, not a parallel road system |
| Wear, repair, markings or grime | Decalery only after structural acceptance | Never use surface storytelling to hide topology or grade defects |
| Camera obstruction | Existing camera/layout handling, then See-through Shader | Add shader dependency only for a real unresolved obstruction case |
| Volumetric fog or light shafts | Base URP record, then Ethereal URP | Prove the atmosphere gap and bound frame-cost/readability risk |
| Rendering, input, UI, tests or package compatibility | Unity Platform record | Verify the exact consumer; installed dependency is not runtime/visual proof |
| NPC/police navigation or walkability | Unity Native Atlas NavMesh routing, then Gley | Reuse native/runtime patterns or existing pedestrian tooling before adding another navigation stack |
| Rendering artifact, draw-call or shader diagnosis | Unity Native Atlas Frame/Rendering Debugger routing, then Unity Platform | Find the render-pass or configuration root cause before material replacement |
| Performance, memory, physics or UI bottleneck | Unity Native Atlas Profiler/diagnostic routing | Measure a representative workload before optimisation code or another package |
| Lighting, probes, reflections, LOD or visibility | Unity Native Atlas, then the current rendering/camera records | Use built-in lighting and visibility systems before buying or building substitutes |
| Repetitive scene, prefab or asset work | Unity Native Atlas Editor automation routing, then Crime99 Workflows | Prefer Undo-capable, deterministic native automation over manual repetition or an unnecessary framework |
| Animation, audio, VFX, UI or input need | Unity Native Atlas package/module map | Check what is already installed and what optional Unity packages are actually absent |
| Human visual selection | Human Visual Decision Tool after native-resolution evidence | Visual fit is decision evidence, not an afterthought to technical checks |
| New mutating task or separate worker | Authority Continuity/Dispatch record and canonical owners | Validate scope and authority without expanding them |
| Reusing a historical builder or candidate | Crime99 Workflows record and exact task evidence | Match contracts; negative evidence prevents repetition but is not a reusable baseline |
| Any need not listed here | [Coverage Register](CAPABILITY_COVERAGE_REGISTER.md) and [Asset Inventory](../ASSET_INVENTORY.md) | Search the complete known holdings before concluding that a capability is absent |
