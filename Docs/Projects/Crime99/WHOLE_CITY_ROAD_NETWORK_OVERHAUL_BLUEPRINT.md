# Whole-City Road Network Overhaul Blueprint

**Status:** `READ-ONLY PLANNING COMPLETE / NO UNITY CANDIDATE / NOT ADOPTED`  
**Planning basis:** current Crime99 source plus preserved whole-city evidence  
**Last verified:** 2026-08-22

## Purpose and Boundary

This blueprint turns the current technically useful but visually homogeneous
street graph into a function-led road hierarchy. It does not require every
available road feature to appear. It requires the best locally available
feature to be considered wherever its real function would improve city form,
access, traversal or later traffic integration.

No Unity process, road construction, source-scene mutation, package change,
download, adoption or Git action was performed for this blueprint.

## Verified Current Baseline

- Protected source scene:
  `Assets/_Crime99/Phase4/WholeCityUrbanSurfaceLanguageV2/Scenes/WholeCityUrbanSurfaceLanguageV2_Candidate03.unity`,
  SHA-256
  `26669D728BF8BD2195650E96CAD9E29650FD4F19F31ACFB69E04F98E9295BFC8`.
- Exact current-scene script-GUID counts show 382 `RoadObject` components and
  148 `IntersectionObject` components. Their combined 530 serialized
  road-description references use only 316 `Side Street Asphalt` and 214
  `Boulevard Asphalt` profiles.
- Direct inspection of the exact-source Candidate03 whole-city overview
  confirms a connected, legible macro network with district-scale route choice.
  It also confirms a repetitive street section, many abrupt legacy ends and
  insufficient visual distinction between public, residential, commercial,
  industrial and service movement.
- Exact-source overview evidence:
  [Candidate04 Before C06 whole-city original](../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-URBAN-SURFACE-LANGUAGE-V2/Originals/Candidate04/BEFORE/C99_USL_V2_CANDIDATE04_BEFORE_C06_CITYWIDE_OVERVIEW_3600x2400.png).
- Candidate11 remains the strongest earlier native macro-network construction
  evidence: its 249 Roads / 107 Intersections predate the current expanded
  source, 12/12 native continuation calls succeeded, and its direct audit passed
  the whole-city network with local seam, endpoint and grade concerns. It was
  [not adopted](../../../Projects/Crime99/Artifacts/Evidence/C99-WHOLE-CITY-SECONDARY-STREET-AND-BLOCK-NETWORK-V1/SECONDARY_NETWORK_CANDIDATE11_SUCCESS_NOT_ADOPTED_MANIFEST.json).
- The earlier frozen native construction blueprint remains valid semantic and
  graph evidence, but its Gate-B Unity candidate failed road continuity and
  Terrain contact. Its failed construction method is not a reason to discard
  the later 249-road source graph.
- The retained nine-district parcel/service plan supplies functional road-use
  causes. Its orange service paths are relationship evidence, not accepted
  public road geometry.

## Overhaul Principles

1. Preserve the useful connected macro graph. Reclassify and selectively
   replace road sections; do not restart the city from an empty Terrain.
2. Select road form from real use: public hierarchy, delivery, rear access,
   restricted maintenance, industrial recovery, topography and gameplay route
   choice.
3. Use Road Constructor first where a change must remain part of the connected
   native graph. Use package-native modular roads only after one direct visual
   and connector-fit proof.
4. A cul-de-sac, roundabout, ramp, one-way street or gravel/dirt surface is not
   a checklist item. It is used where it solves a visible functional problem.
5. Terrain carries broad grade and planned landscape. Roads, curbs, entries,
   yards and loading edges retain authored hard-edge ownership.
6. Prefer visual plausibility over millimetre control. Small invisible contact
   differences are concerns; visibly broken roads, impossible access and
   disconnected yards are failures.
7. Keep bridge and known non-blocking road-height defects as later TODOs unless
   a selected sector directly depends on them.

## Capability Palette for This Overhaul

| Option | Best current use | Evidence level | Current decision |
|---|---|---|---|
| Road Constructor 1.9.3 | Connected public roads, branches, width transitions, intersections, roundabouts, cul-de-sacs, ramps and road ends | Static plus local runtime proof; later whole-city native success | Primary construction system |
| Road Constructor profiles | Main Street, Boulevard, Local, One-Way, Dirt and Gravel functional sections | Locally catalogued; only Asphalt Boulevard/Side Street dominate the current source | Use by district function, not uniformly |
| Gley Traffic/Pedestrian | Lanes, waypoints, connections, crossings, routes and diagnostics over accepted visible geometry | Statically verified; Road Constructor adapter source present; current whole-city integration unproven | Apply only after visible road geometry passes |
| Gley Urban road modules | Curve, 3/4-road junctions, 2/4-lane lines, crossings, narrowing, overpass and roundabout | Ten local prefabs plus vendor example references; Crime99 visual/connector fit unknown | Targeted visual alternative, not current graph replacement |
| NYC1950s road modules | 3/6/12/24 m boxes, entries, L/T/crossings and 12/24 m transitions | Seventeen local prefabs plus vendor scenes; current scale/material/connector fit unknown | Strong candidate for authored entrances and visually richer urban modules after one proof |
| Unity Terrain | Broad grade, landscape, parks, commons and block-interior support | Runtime proven; broad road-covering grade failed visually | Supporting layer only |
| Unity Splines + ProBuilder | Missing hard-edge connector, curb, drainage or foundation geometry | Packages present; previous broad custom-road consumers failed visually | Last-resort bounded adapter, never a parallel street system |

## Keep, Change and Add

| Treatment | Network element | Reason |
|---|---|---|
| Keep | A1/A2 cross-city arterial intent, C1/C2/C3 collector intent, connected secondary fabric and named map-edge continuations | These provide the useful macro morphology and route choice already paid for |
| Keep with local repair later | Existing ordinary asphalt local streets that already frame plausible blocks | Variation should not destroy working topology merely to increase catalogue coverage |
| Change | Uniform Boulevard/Side Street Asphalt assignment across nearly every district | It hides hierarchy and makes industrial, residential, waterfront and service areas read alike |
| Change | Abrupt legacy terminals that have neither gateway, parcel host nor deliberate road-end treatment | They read as unfinished geometry rather than city form |
| Change | Diagrammatic service lines crossing public streets or ending in detached yards | Service access must become one continuous road-apron-yard relationship |
| Add | One-way service/loading operation where a narrow rear route cannot safely support two-way flow | Gives rear access a clear operational reason and avoids unnecessary road widening |
| Add | Dirt or Gravel only for restricted maintenance, yard, slope or industrial tracks | Creates functional and visual separation without turning public streets into decorative dirt |
| Add | Cul-de-sac or deliberate road end for hosted terminals, controlled yards and topographic dead ends | Converts arbitrary fragments into intentional places and turning/recovery spaces |
| Add | A roundabout only at a spacious decision-heavy junction where it improves flow, orientation and landmark readability | Avoids decorative mini-roundabouts and creates one meaningful city node |
| Add | A ramp only for a real grade-separated highway, rail, quay or yard interface | Do not use ramps to hide ordinary Terrain mismatch |

## District Application Map

| District | Retain | Overhaul opportunity | Preferred first options |
|---|---|---|---|
| D01 North Gate Works | Regional gateway and heavy-infrastructure separation | Distinguish through movement from controlled plant access | Main Street/Boulevard backbone; Gravel or paved one-way service loop; deliberate industrial road end |
| D02 River Wharves | Public landward address and restricted quay edge | Make wharf loading access continuous without turning the quay into a public grid | Side Street Pave or narrow authored entry; one-way quay service; Gravel only for restricted working apron |
| D03 Foundry Quarter | Unequal workshop blocks and F1-facing feeder | Give workshops usable rear/loading circulation | Side Street Pave; one-way loading loop; hosted cul-de-sac where a return route is not credible |
| D04 Market Crossroads | Strongest public street wall and civic-commercial anchor | Create one recognisable traffic decision point and protect the rear court | Boulevard/Main Street hierarchy; evaluate one properly sized roundabout; separate one-way rear access |
| D05 Old Landing | Irregular wedges and local permeability | Replace generic grid character with short, irregular connected locals | Side Street Pave/Asphalt; compact L/T/entry modules; deliberate landing road end |
| D06 Brick Row | Fine fronts and linked rear courts | Keep public frontage calm while making rear service legible | Local two-way fronts; narrow one-way rear spine; 3/6 m NYC entry module as a visual candidate |
| D07 West Slope | Stepped parcels and sparse cross-slope access | Let topography terminate or curve roads intentionally | Curved Local or Gravel access; contour-following cul-de-sac; no universal alley grid |
| D08 South Service Yards | Largest yards and recovery operation | Establish heavy access, staging, turning and departure | Boulevard/Main Street approach; Gravel yard links; one-way service loop; ramp only for proven grade separation |
| D09 Riverside Commons | Public-open core and restricted maintenance edge | Keep the core road-free while making maintenance access intentional | Deliberate public road end; restricted Gravel edge; no through-road across the commons |

## Technical-Debt Decision

The lowest-debt path is not a citywide prefab swap. It is to retain one native
Road Constructor graph, use its existing profiles and construction APIs for
most hierarchy changes, and postpone Gley route generation until geometry is
accepted. NYC1950s and Gley visible road modules are valuable targeted
alternatives, but using either as a second full road system before connector,
material and runtime proof would create duplicate topology, collision and
maintenance ownership.

A small project-owned Road Constructor profile or hard-edge adapter is allowed
only where the installed profiles cannot produce a visually credible access.
That bounded debt is preferable to repeated detached apron meshes, buried
roads or a second citywide road framework.

## Staged Implementation Blueprint

### Stage 1 — Representative connected urban sector

Create one task-owned candidate from the current source and overhaul the
connected D03 Foundry / D04 Market / D06 Brick Row sector. This sector must
show, in one screenshot-worthy result:

- retained arterial/collector continuity;
- visibly distinct public main, local frontage and rear/service movement;
- one functional one-way rear/loading route;
- one deliberate terminal treatment or cul-de-sac;
- one properly sized roundabout comparison at Market Crossroads only if the
  existing space supports it without forcing the blocks apart; and
- continuous road-entry-yard and constrained Terrain support in player-relevant
  views.

Use Road Constructor as the graph owner. A NYC1950s 3/6 m entry module may be
included as one same-site visual alternative, not combined into the selected
graph before it proves scale, contact and material fit. Gley traffic and
pedestrian generation remains outside Stage 1.

### Later rollout, only after Stage 1 visual selection

- North/industrial and south/service sectors: heavy hierarchy, Gravel/Dirt,
  controlled terminals, ramps only where grade separation is real.
- Waterfront and commons: public/restricted separation and deliberate road
  ends.
- West slope and old landing: curved, irregular local form and topographic
  terminations.
- Gley traffic/pedestrian extraction and runtime checks after the visible
  network is stable.

## Required Evidence for the First Candidate

- Clean same-camera Before/After originals at native resolution.
- One whole-sector elevated view plus player-relevant views of the public
  junction, rear/service connection and terminal treatment.
- Direct visual review before any citywide rollout.
- Separate technical, road/ground continuity, access, visual and overall
  dispositions.
- No rejection based only on a harmless small measurement deviation; no pass
  for a visibly disconnected or implausible result.

## Exact Next Proposal

Authorise one Unity Work Order for the Stage-1 D03/D04/D06 representative
connected-sector candidate above. It is a meaningful road-network overhaul
slice, not another isolated driveway experiment, and it stops at a Human
visual checkpoint before any whole-city rollout.
