# World and City

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Prototype scope with deferred extensions
**Validation State:** Needs Prototype Validation
**Approval Status:** Pending Human Developer review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This document defines the game world, prototype map structure, city behaviour, environmental interactions, district roles, natural boundaries, respawn locations, pickups, vehicle distribution, destructible objects, and long-term city expansion.

The authoritative first-prototype scope remains defined in:

[`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md)

## World Design Goals

The city should feel:

- compact;
- reactive;
- readable;
- dirty;
- active;
- dangerous;
- suitable for both foot and vehicle play;
- visually coherent;
- easy to understand with the first-prototype `Fixed Camera` and not structurally hostile to a later rotatable comparison.

The world is not intended to be a large seamless open world.

It should function as a dense gameplay space that creates:

- frequent encounters;
- vehicle opportunities;
- escape routes;
- environmental kills;
- police pressure;
- traffic situations;
- distinct tactical areas;
- memorable visual landmarks.

## Core World Principle

The city is not only a background.

It is a gameplay system that reacts to:

- gunfire;
- vehicle theft;
- collisions;
- roadkills;
- explosions;
- police pursuit;
- player concentration;
- local danger.

The world should support player-created chaos without becoming a full city simulation.

## Prototype Map Scale

The first prototype uses one compact multi-block city map.

The map must be:

- larger than one city block;
- small enough for the selected timed-round duration;
- large enough for up to twelve combatants;
- suitable for vehicles and foot combat;
- dense enough to avoid long inactive travel;
- open enough for the first-prototype fixed camera while preserving a later rotatable comparison path.

Exact physical dimensions require greybox testing.

## Prototype Map Orientation

The confirmed main road structure remains primarily top to bottom.

This supports:

- rapid orientation and recognisable map structure;
- forward visibility with the first-prototype fixed camera;
- high-speed driving;
- clearer anticipation of traffic;
- landmark-based navigation.

Secondary streets may run in other directions. Roads and landmarks must keep the map readable and playable with the first-prototype `Fixed Camera`. The layout should avoid unnecessary structural blockers for a later same-map `Rotatable Camera` comparison, but the later comparison is not part of first-prototype implementation.

## Required Prototype Areas

The map includes several connected functional areas.

Each area should support a different form of play while remaining part of the same city.

## 1. Main Road

## Purpose

The main road is the primary high-speed vehicle route.

It supports:

- sustained acceleration;
- police pursuit;
- vehicle interception;
- roadkills;
- heavy vehicle use;
- large collisions;
- chain reactions;
- rapid north-south relocation.

## Design Characteristics

The main road should include:

- long readable sight lines;
- multiple entry and exit points;
- moderate traffic;
- wider lanes;
- limited sharp turns;
- visible intersections;
- enough space for the refuse truck;
- safe opportunities to leave the road.

## Gameplay Role

The main road should make high speed enjoyable.

It should not become:

- the only useful route;
- permanently blocked by traffic;
- an unavoidable death zone for pedestrians;
- too narrow for heavy vehicles;
- visually empty.

## Risk Controls

- traffic density must remain adjustable;
- spawn points should avoid immediate exposure;
- important pickups should not force pedestrians into unavoidable roadkill situations;
- visibility must exceed normal braking requirements where practical.

## 2. Central Junction

## Purpose

The central junction is a recurring conflict point.

It connects major routes and supports:

- multi-directional attacks;
- traffic interaction;
- rockets;
- police arrival;
- vehicle theft;
- roadkills;
- chain reactions;
- sudden third-party involvement.

## Design Characteristics

The junction should include:

- several approach routes;
- good overall readability;
- enough space for turning;
- destructible street objects;
- traffic signals;
- nearby pedestrian routes;
- visible exits.

## Gameplay Role

The area should naturally attract action without functioning as a mandatory objective.

It should create recurring conflict because of location and traffic flow.

## Failure Signs

The junction is failing if:

- it remains permanently congested;
- one position dominates all approaches;
- the camera hides incoming threats;
- traffic blocks every fight;
- all players remain there for the entire round.

## 3. Side-Street Network

## Purpose

Side streets provide tighter vehicle and foot gameplay.

They support:

- compact cars;
- vehicle theft;
- close-range fights;
- shotgun use;
- ambush;
- escape;
- reduced heavy-vehicle dominance.

## Design Characteristics

Side streets may include:

- narrower roads;
- tighter turns;
- parked vehicles;
- alleys or short passages;
- small intersections;
- partial cover;
- multiple exits.

## Gameplay Role

The side streets create contrast with the main road.

They should reward:

- route knowledge;
- compact vehicle agility;
- short-range weapons;
- quick vehicle switching;
- pedestrian movement.

## Constraints

The streets should not become so narrow that:

- the camera loses readability;
- traffic constantly deadlocks;
- bots cannot navigate;
- vehicles become unusable.

## 4. Industrial or Scrapyard Area

## Purpose

The industrial area is an open vehicle-combat and destruction space.

It supports:

- refuse truck use;
- parked vehicle clusters;
- rockets;
- heavy collisions;
- smoke and industrial lighting;
- chain-reaction testing;
- open movement.

## Design Characteristics

The area should be relatively open.

It may include:

- multiple entrances;
- containers;
- fences;
- industrial buildings;
- scrap piles;
- parked vehicles;
- smoke stacks;
- loading areas;
- service roads.

## Access

The industrial area should have several access routes.

It should not be a closed arena with one entrance.

## Gameplay Role

This area is a primary location for:

- vehicle combat;
- explosion chains;
- heavy vehicle encounters;
- visual style testing;
- open pursuit.

## Vehicle Distribution

The refuse truck should appear more frequently here than elsewhere.

Van vehicles may also be common.

## 5. Neon Commercial Area

## Purpose

The commercial area expresses the main visual identity.

It supports:

- pedestrians;
- civilian traffic;
- police visibility;
- mixed foot and vehicle combat;
- environmental signage;
- neon reflections;
- strong nighttime atmosphere.

## Design Characteristics

The area may include:

- shops;
- bars;
- service businesses;
- fictional signs;
- old commercial façades;
- narrow and medium-width streets;
- parked vehicles;
- steam vents;
- wet pavement.

## Visual Role

This area should demonstrate:

- Neon over Dirt;
- selective bright signage;
- old infrastructure;
- grime;
- reflections;
- readable player silhouettes.

## Gameplay Constraint

Visual density must not reduce combat readability.

Signs and lights should support navigation rather than create constant noise.

## 6. Park or Plaza

## Purpose

The park or plaza creates a foot-focused contrast.

It supports:

- pistol combat;
- shotgun combat;
- open sight lines;
- pedestrian reactions;
- reduced traffic;
- short repositioning routes.

## Design Characteristics

The area may include:

- paths;
- low walls;
- benches;
- trees;
- small structures;
- limited vehicle access;
- open central space;
- multiple pedestrian exits.

## Vehicle Role

Vehicles may access selected edges or paths, but the space should reduce vehicle dominance.

Possible controls include:

- bollards;
- narrow entrances;
- raised curbs;
- low barriers;
- landscaping.

These controls should remain visually clear.

## 7. Bridge, Elevated Road, or Underpass

## Purpose

The prototype includes at least one vertical road element.

It validates:

- camera behaviour;
- occlusion;
- vehicle routing;
- AI navigation;
- lighting and shadow;
- multi-level traffic;
- jumps or drops where appropriate.

## Scope

Only one limited vertical structure is required.

It may be:

- a bridge;
- an elevated road;
- an underpass;
- a short combination.

## Design Constraint

The structure should not become the technical centre of the prototype.

It exists to test a meaningful risk without creating a full multi-level city.

## Required Validation

The prototype must determine:

- whether actors remain visible;
- whether AI can route correctly;
- whether traffic understands level separation;
- whether shadows and roofs hide gameplay;
- whether the fixed camera remains useful and the map preserves a later rotatable comparison path.

## Map Connectivity

## General Rule

The map should support multiple routes between major areas.

Players should not be forced through one connection.

## Route Types

The map may include:

- main roads;
- side roads;
- alleys;
- shortcuts;
- ramps;
- pedestrian routes;
- underpass connections;
- industrial service roads.

## Choke Points

A few choke points are useful for testing.

They should be:

- visible;
- avoidable where possible;
- large enough for combat;
- not permanently blocked by traffic.

## Shortcuts

A limited number of shortcuts may support:

- compact vehicles;
- pedestrians;
- escape;
- route mastery.

Shortcuts should not make normal roads irrelevant.

## Natural Map Boundaries

The map should use visible natural boundaries.

Possible boundary types include:

- continuous building blocks;
- walls;
- rail lines;
- water;
- construction zones;
- industrial structures;
- blocked roads;
- collapsed infrastructure;
- fenced service areas.

Invisible walls may support these boundaries but should not be the only explanation.

## Boundary Principles

Boundaries should:

- look intentional;
- fit the city;
- remain readable at speed;
- prevent the player from expecting inaccessible space;
- avoid feeling like an artificial arena wall.

## Buildings

## Prototype Buildings

Buildings are not enterable in the first prototype.

They serve as:

- visual structure;
- map boundaries;
- landmarks;
- occlusion challenges;
- lighting surfaces;
- district identity.

## Building Types

The prototype may include:

- generic urban blocks;
- industrial halls;
- shops;
- bars;
- service buildings;
- clinic buildings;
- parking structures;
- warehouses.

## Building Design Goals

Buildings should be:

- modular;
- visually consistent;
- simple enough to produce efficiently;
- suitable for neon and dirt treatment;
- readable with the first-prototype fixed camera;
- easy to use as natural boundaries.

## Landmark Buildings

A few visually distinct buildings should support orientation.

Possible landmarks include:

- clinic;
- large warehouse;
- neon bar;
- industrial tower;
- elevated road structure;
- large junction building.

Landmarks should improve navigation without requiring unique gameplay systems.

## Building Occlusion

## Problem

The elevated tilted camera may place buildings between the player and the camera.

## Prototype Direction

Use the simplest reliable solution.

Possible methods include:

- prepared fade zones;
- roof fading;
- wall fading;
- local transparency;
- player silhouette;
- hybrid solution.

## Design Requirement

The local player must remain readable.

Enemies should not gain unfair hidden positions because of foreground geometry.

## Map Support

Map layout should reduce the problem through:

- a clear road hierarchy readable with the first-prototype fixed camera;
- controlled building height;
- open combat spaces;
- limited foreground clutter;
- careful placement of tall structures.

## Clinics

## Role

Clinics serve as:

- respawn locations;
- healing locations;
- map landmarks.

## Prototype Quantity

The number of clinic points is `Needs Prototype Validation`; no count is confirmed.

The final number depends on:

- map size;
- bot count;
- combat density;
- spawn safety;
- route distribution.

## Respawn Rules

A respawn system should prefer clinics that:

- are not inside active combat;
- are not immediately exposed to high-speed traffic;
- do not place the player directly beside enemies;
- distribute combatants across the map.

Perfect safety is not required.

Immediate repeated death should be avoided.

## Healing Role

Clinics may heal players over a short period.

Healing should not make the clinic completely safe.

Clinic use should create some exposure.

## Item Spawns

## General Direction

The map uses flexible spawn slots.

A spawn slot may produce an appropriate item rather than always containing one fixed object.

## Prototype Item Categories

- pistol ammunition;
- shotgun;
- shotgun ammunition;
- rocket launcher;
- rocket ammunition;
- armour;
- medkit.

## Spawn Philosophy

Item placement should:

- create movement;
- support different map areas;
- avoid one dominant route;
- preserve weapon scarcity differences;
- remain easy to tune.

## Heavy Equipment

Rocket launchers and heavy ammunition should be rarer.

They may appear in:

- industrial areas;
- exposed locations;
- contested central spaces;
- limited high-value spawn points.

## Randomisation

Randomisation may be used within controlled categories.

The system should avoid:

- impossible rounds without useful equipment;
- excessive rocket availability;
- all valuable items appearing in one area;
- unpredictable imbalance that overrides skill.

## Vehicle Distribution

## Common Vehicles

- compact car;
- saloon.

These should appear frequently in traffic and parked locations.

## Moderate Frequency

- van.

These may appear in traffic, commercial, and industrial areas.

## Rare Vehicle

- refuse truck.

This should appear mainly near:

- industrial areas;
- service routes;
- waste or loading facilities.

## Distribution Goal

The map should support frequent vehicle switching without becoming permanently congested.

## Traffic Network

## Road Hierarchy

The map should distinguish road types.

### Main Road

- highest capacity;
- highest speed;
- moderate traffic;
- strongest long-distance connection.

### Secondary Roads

- medium capacity;
- mixed speed;
- district connections;
- regular traffic.

### Side Streets

- lower capacity;
- slower traffic;
- tighter turns;
- parked vehicles;
- stronger pedestrian presence.

### Industrial Roads

- wider service routes;
- heavier vehicles;
- open turning spaces;
- lower pedestrian density.

## Traffic Behaviour

Traffic should:

- follow plausible routes;
- respond to blockages;
- reverse when needed;
- reroute where possible;
- avoid permanent accumulation;
- replenish outside the player’s direct focus.

The detailed AI rules are defined in:

[`07_AI_NPCS_AND_TRAFFIC.md`](07_AI_NPCS_AND_TRAFFIC.md)

## Pedestrian Distribution

Pedestrian density should vary by area.

## Higher Density

- commercial area;
- plaza;
- clinic surroundings;
- selected sidewalks.

## Lower Density

- industrial area;
- high-speed main road;
- service routes;
- construction boundaries.

## Design Goal

Pedestrians should make the city feel alive without becoming constant collision clutter.

## Police Presence

Police may appear through:

- patrol vehicles;
- foot patrols;
- response from nearby routes.

Prototype police presence should be limited.

The map should support:

- pursuit routes;
- arrival from multiple directions;
- escape opportunities;
- visible police approach;
- temporary pressure.

The detailed wanted system is defined in:

[`08_POLICE_AND_ESCALATION.md`](08_POLICE_AND_ESCALATION.md)

## Environmental Interaction

## Prototype Interactions

The prototype includes a limited set of destructible city objects.

Examples:

- streetlights;
- traffic lights;
- mailboxes.

## Required Behaviour

Objects should:

- react to vehicle impact or explosion;
- fall over or be thrown aside;
- remain destroyed until round end.

## Not Required

The prototype does not require:

- detailed fracture;
- repair;
- persistent destruction;
- complex debris;
- building damage;
- full street-furniture simulation.

## Purpose

Environmental interaction supports:

- impact feedback;
- city reactivity;
- creative kills;
- route disruption;
- visual chaos.

## Destruction Persistence

Within a prototype round:

- destroyed street objects remain destroyed;
- exploded vehicles remain as wrecks or are removed according to performance rules;
- local damage does not reset immediately.

Between rounds:

- the map resets;
- destroyed objects return;
- vehicles and pickups are restored.

The prototype does not require persistent destruction across sessions.

## Environmental Hazards

The first prototype may use simple hazards created by:

- burning vehicles;
- exploding vehicles;
- traffic;
- road obstacles;
- destructible objects;
- police pursuit.

Dedicated hazards such as:

- fire zones;
- electrical hazards;
- collapsing structures;
- toxic areas

are deferred.

## World Reactivity

## Local Danger Response

When violence occurs:

- pedestrians flee;
- drivers attempt escape;
- traffic may reroute;
- police may respond;
- the local area becomes less populated.

## Recovery

After danger ends:

- traffic resumes;
- pedestrians return;
- population is replenished outside direct view.

The city should recover quickly enough for short rounds.

## Design Rule

World reaction should remain local where practical.

One explosion should not empty the entire map.

## Navigation and Orientation

The player should understand the map quickly.

## Orientation Tools

- landmark buildings;
- distinct districts;
- a recognisable main road;
- minimap;
- clinic markers;
- lighting differences;
- road hierarchy;
- industrial silhouettes;
- neon commercial signage.

## Visual Distinction

Areas should differ through:

- geometry;
- lighting;
- traffic density;
- pedestrian density;
- props;
- road width;
- vehicle types.

They should still share one coherent art direction.

## Prototype Test Area

A separate rudimentary test area exists outside the main map.

## Purpose

It supports fast isolated testing of:

- movement;
- aiming;
- weapon damage;
- vehicle acceleration;
- braking;
- steering;
- handbrake drift;
- roadkills;
- vehicle damage;
- burning;
- explosions;
- chain reactions;
- fixed-camera readability at fixed distance and preservation of the later camera-policy seam.

## Visual Requirement

The test area does not require final-quality art.

It should use:

- clear measurement references;
- repeatable layouts;
- simple obstacles;
- flat test roads;
- parked vehicle rows;
- target actors;
- configurable test conditions.

## Production Role

The test area should remain available throughout development.

It should not be replaced by the final map.

## Visual Environment Direction

The environment follows:

> Neon over Dirt.

## Required Qualities

- wet asphalt;
- grime;
- soot;
- smoke;
- steam;
- old infrastructure;
- industrial decay;
- selective neon;
- strong headlights;
- police lights;
- readable darkness;
- simplified intentional geometry.

## Road Materials

Roads should communicate:

- wetness;
- wear;
- patching;
- oil;
- dirt;
- lane use;
- damage.

Reflections should remain controlled.

## Sidewalks and Surfaces

Surfaces may include:

- cracked pavement;
- old concrete;
- metal service areas;
- dirty tiles;
- industrial ground;
- park paths.

## Lighting

Lighting should support:

- navigation;
- district identity;
- danger readability;
- vehicle visibility;
- player highlighting.

Lighting should not exist only for spectacle.

## Map Performance Principles

The map must support:

- one human player;
- eleven combat bots;
- civilians;
- traffic;
- police;
- vehicle damage;
- smoke;
- explosions;
- wet-road lighting;
- UI and minimap.

## Performance Controls

Possible controls include:

- modular buildings;
- LODs;
- limited dynamic lights;
- pooled props;
- controlled shadow casting;
- distance-based simulation;
- simplified distant pedestrians;
- capped effect duration;
- traffic density controls.

Exact architecture belongs in technical planning.

## Prototype Map Validation Questions

The prototype must answer:

- Is the map large enough for twelve combatants?
- Is it small enough to maintain frequent action?
- Does the main road support high speed?
- Does the fixed camera remain readable and playable, without creating an avoidable blocker for the later rotatable comparison?
- Are foot and vehicle areas meaningfully different?
- Does the park reduce vehicle dominance?
- Does the industrial area support destruction?
- Does the commercial area express the visual identity?
- Does the central junction create conflict without permanent congestion?
- Can bots navigate all major routes?
- Can traffic recover from blockages?
- Are clinic locations fair?
- Do pickups create movement?
- Are natural boundaries understandable?
- Does the vertical road element work?
- Does the map feel like a city rather than an arena?

## Success Criteria

The prototype world succeeds when:

- players can orient quickly;
- different areas support different tactics;
- high-speed driving is enjoyable;
- foot combat remains viable;
- multiple routes prevent one dominant corridor;
- clinics distribute respawns reasonably;
- pickups encourage movement;
- traffic supports gameplay;
- civilians create atmosphere and reaction;
- police can reach incidents;
- map boundaries feel natural;
- visual areas remain coherent;
- the fixed camera remains readable, and the map does not create an avoidable blocker for the later rotatable comparison;
- the map supports the stress scenario.

## Failure Conditions

The map direction requires revision if:

- players spend too long finding action;
- twelve combatants feel overcrowded;
- high-speed driving is unreadable;
- the main road is constantly blocked;
- the central junction dominates every match;
- side streets are unusable for AI;
- the park is still dominated by vehicles;
- clinics create repeated instant deaths;
- natural boundaries feel arbitrary;
- building occlusion remains unsolved;
- the vertical element breaks navigation;
- visual density hides gameplay;
- the city feels like disconnected asset packs.

## Long-Term City Expansion

Possible later expansion includes:

- additional maps;
- larger districts;
- faction-controlled buildings;
- HQ locations;
- police territory;
- connected influence networks;
- capturable services;
- income-producing locations;
- transport routes;
- temporary construction;
- road closures;
- changing traffic patterns;
- more destructible environment;
- selected enterable buildings;
- dynamic city events.

These systems are deferred from the first prototype.

## Faction War World Direction

In later Faction War modes, the city may include:

- faction HQs;
- individual capturable buildings;
- equal influence radii;
- connected building networks;
- isolated buildings;
- choke points;
- specialised functions;
- NPC support routes;
- reduced income across unsafe territory;
- neutralised buildings after faction elimination.

This design remains Draft and requires later validation.

It must not shape the first prototype map beyond preserving general extensibility where inexpensive.

## Deferred World Features

The first prototype excludes:

- enterable buildings;
- full building destruction;
- persistent world damage;
- freely placed structures;
- dynamic day and night;
- weather simulation;
- complex civilian schedules;
- realistic emergency services;
- detailed witness systems;
- faction territory;
- economy buildings;
- construction progression;
- large open-world streaming;
- interior combat;
- underground networks;
- procedural city generation.

## Live-Tuning Variables

The following world values should remain adjustable:

- map size;
- road width;
- traffic density;
- pedestrian density;
- parked vehicle density;
- item spawn rate;
- rocket spawn rate;
- armour spawn rate;
- medkit spawn rate;
- clinic count;
- respawn weighting;
- police spawn routes;
- destructible object density;
- population recovery time;
- traffic recovery time;
- smoke density;
- lighting intensity;
- reflection intensity;
- camera occlusion thresholds.

## Authorisation Boundary

This document defines world and city design direction.

It does not authorise:

- map implementation;
- Unity scene creation;
- asset purchases;
- city-package integration;
- traffic implementation;
- navigation implementation;
- environmental asset production;
- lighting setup;
- production work.

Those actions require separate approval.
