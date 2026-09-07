# Gley Traffic and Pedestrian Systems

**Capability ID:** `C99-CAP-GLEY-TRAFFIC-PEDESTRIAN-001`  
**Type:** Installed Unity packages and editor workflows  
**Owner:** Crime99 technical capability knowledge  
**Last verified:** 2026-08-22  
**Current disposition:** Strong post-geometry topology and population option;
not a visible road or sidewalk generator.

## Identity and Availability

- Gley Traffic System `3.6.3`, Pedestrian System `1.5.8`, Urban Assets
  `2.0.7` and Urban Example `1.5.9` are locally present under
  `Assets/Gley/`.
- Current package/version declarations and editor version sources agree except
  for a stale Traffic System runtime `Version.txt` value `3.3.7`; use the
  package/editor `3.6.3` identity and preserve the mismatch as a caution.
- Local Road Constructor traffic and pedestrian adapter source is present
  behind `GLEY_ROADCONSTRUCTOR_TRAFFIC`.
- Enabling support, generating data or changing defines requires separate
  mutation authority.

## Intended Uses

- Problem tags: traffic lanes, waypoints, intersections, crossings, routes,
  pedestrian paths, population, diagnostics, Road Constructor adapter.
- Strong uses: generate/edit/connect traffic topology over accepted roads;
  pedestrian paths/crossings over accepted sidewalks; route and waypoint
  diagnostics; extract Road Constructor waypoints through the local adapters.
- Unsuitable uses: visible road mesh, curb, sidewalk, markings, Terrain contact
  or proof that a vehicle can traverse a visually plausible route.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Create/Edit/Connect Road creates lane and waypoint topology | `STATICALLY VERIFIED` | [Tools catalogue](../../../../../Projects/Crime99/Artifacts/Reports/C99-ASSET-TOOLING-AND-PACKAGE-CAPABILITY-CATALOG-V1/TOOLS_AND_WORKFLOWS.md) and local `CreateRoadWindow.cs`, `EditRoadWindow.cs`, `ConnectRoadsWindow.cs` | Does not create visible surfaces |
| Road Constructor traffic extraction source is local | `STATICALLY VERIFIED` | `Assets/Gley/TrafficSystem/Editor/ExternalTools/RoadConstructor/RoadConstructorMethods.cs` | Define state, compilation and current-scene extraction are unproven here |
| Road Constructor pedestrian extraction source is local | `STATICALLY VERIFIED` | `Assets/Gley/PedestrianSystem/Editor/ExternalTools/RoadConstructorMethods.cs` | Sidewalk clearance and runtime traversal remain separate |
| Current whole-city roads have accepted Gley traffic/pedestrian topology | `UNKNOWN / REFRESH REQUIRED` | No current whole-city integration run in this consolidation | Do not infer from adapter presence |

## Successful Applications

| Use and candidate | Result | Reusable conclusion | Transfer limit |
|---|---|---|---|
| Historical Road Constructor–Gley integration labs | Technical traffic/pedestrian route evidence exists | The packages can participate in a staged integration workflow | Exact current road graph and vehicle classes require refresh |

## Failed Applications

| Use and candidate | Failure class/root cause | Reusable shield | What it does not prove |
|---|---|---|---|
| Historical truck/pedestrian integration cases | Route completion did not guarantee turning or sidewalk usability | Require direct vehicle-class and pedestrian-space evidence | Does not reject the topology tools or adapters generally |

## Decision Guidance

- Prefer after the visible road/sidewalk geometry passes.
- Avoid generating topology during rapid visual road iteration; it creates
  rework whenever geometry changes.
- Combine with Road Constructor as graph/surface owner and RCCP/Gley actors in
  later runtime validation.
- This sequencing avoids duplicate lane authoring and stale waypoint debt.

## Unknowns and Refresh Triggers

- `UNKNOWN`: current define state, clean compilation and extraction result for
  the current whole-city candidate.
- Refresh after accepted road geometry, Road Constructor, Gley or traffic-class
  changes.
- Smallest useful next proof: extract only the selected Stage-1 sector after
  its visible geometry is accepted.

## Search Tags

`gley`, `traffic`, `pedestrian`, `waypoint`, `lane`, `crossing`,
`road-constructor-adapter`, `routing`

