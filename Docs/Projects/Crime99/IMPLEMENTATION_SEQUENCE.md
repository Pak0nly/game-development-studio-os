# Crime99 Technical Implementation Sequence

## Status and Boundary

**Document Maturity:** Confirmed Planning Baseline
**Canonical Gate Source:** [`PROTOTYPE_ROADMAP.md`](PROTOTYPE_ROADMAP.md)
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-15

This document translates the confirmed Gate A through Gate F order into planned technical work packages. Confirmation approves this sequence as a planning baseline only. It does not authorise project creation, implementation, purchase, download, installation, import, staging beyond a separately authorised documentation scope, commit, or push. All estimates are rough, non-binding planning ranges and assume one experienced developer supported by AI.

## Execution Rules

* One package has one primary objective, explicit file/system scope, tests, and restart point.
* Do not combine a large asset import with complex gameplay coding or subjective Play Mode review.
* Build each core rule in a small test scene before integrating it into the FFA map.
* Keep compilation and automated tests green before visible review.
* Stop at every Human Review checkpoint; automated evidence cannot accept feel or art.
* A failed gate leads to bounded revision of systems already in that gate, not silent scope growth.
* Record assumptions, configuration, evidence paths, changed files, known failures, and next exact step at every handover.
* Implement an interface, adapter, service, event system, second implementation, plugin framework, or extension point only when the current gate or work package concretely needs it. Do not build replacement infrastructure in anticipation of a later Store candidate or camera comparison.

## Pre-Gate Setup — Separately Authorised Foundation

### Technical goals

* confirm exact project path and create the separate repository/project only after approval;
* create one Unity `6000.3.19f1` URP root;
* establish folder/assembly/test structure, Unity `.gitignore`, provenance register, validation entry point, and clean baseline;
* resolve exact built-in package versions without adding optional packages;
* create synthetic `SystemsTest` and `IntegrationBlock` scenes.

### Dependencies

OD-004 project path, OD-006 implementation approval, repository scope, and any large-asset Git decision required for the first approved import.

### Tests and evidence

Compile, empty EditMode/PlayMode runner, batch scene open, missing-reference scan, resolved package/Unity/URP manifest, Git scope, restore snapshot or bundle, and clean baseline capture.

### Human review

Confirm the sole Unity root, repository boundary, URP baseline, and first Gate A package.

### Stop criteria

Stop on path ambiguity, second Unity root, unexpected package installation, unresolved licence/import boundary, compiler errors, or a need to change URP.

### Allowed simplifications

Primitive geometry, placeholder actor, no licensed environment assets, no audio polish.

### Excluded

Gameplay feature work, package purchases, full FFA map, traffic, police, destruction, final assets.

**Rough estimate:** 1–3 focused work packages.

## Gate A — Basic Control Quality

### Package A1 — Input, intent, and fixed camera

Build Input System maps/wrapper, `HumanIntentSource`, world-aim mapping, small `Fixed Camera`, and a synthetic movement scene. Lock no tuning values prematurely.

### Package A2 — On-foot locomotion

Implement walk, sprint, jump, dodge, stamina, facing/aim separation, and action locks. Use one actor motor shared later by human and bot intent.

### Package A3 — Basic combat slice

Implement actor state, health/armour, pistol hitscan, melee, damage feedback, death, and simple respawn in the technical scene. Add shotgun only after pistol correctness is stable.

### Technical goals

Direct keyboard/mouse response, readable independent aim, correct stamina/action restrictions, fixed camera constraints, and repeatable actor rules.

### Dependencies

Foundation setup only. No external assets or packages are required.

### Tests

* EditMode: stamina, health/armour, action-lock and damage rules.
* PlayMode: input-to-intent mapping, camera-relative movement, pointer-to-world aim, sprint/jump/dodge shooting interruption, pistol hit, death/respawn.
* Batch: scene validation, compilation, tests, missing references.

### Human review criteria

Movement and aim feel immediate; camera is fixed at constant elevation/distance; no zoom/pan/independent translation; horizontal and vertical street-direction motion remains understandable; dodge and jump are readable; basic shots feel responsive.

### Stop criteria

Input latency, camera-induced disorientation, aim ambiguity, motor instability, or the need for a camera/package change. Revise within Gate A before proceeding.

### Allowed simplifications

Capsule/primitive actor, no full animation set, greybox ground, pistol plus melee only, temporary UI bars, one clinic marker.

### Explicitly excluded

Vehicles, traffic, pedestrians, police, rocket/explosions, full bots, final map/art, rotatable camera comparison, networking.

**Rough estimate:** 3–6 focused work packages.

## Gate B — Vehicle Feel

### Package B1 — Small controller spike

Build one concrete custom arcade controller and compact-car profile in a closed handling course. Capture acceleration, braking, steering, reverse, handbrake, collision stability, and camera readability. Do not create a Store-controller adapter.

### Package B2 — Interaction and ownership

Add `VehicleActor`, driver seat only, enter/exit transactions, stationary/slow occupied theft, former-owner flee handoff, and exit-at-speed damage.

### Package B3 — Four classes

Create compact, saloon, van, and refuse-truck data profiles. Validate distinct acceleration, top speed, steering, braking, mass, durability, and handbrake response.

### Package B4 — Bot drive interface

Drive the same controller through `VehicleBrain` intent on a simple lane/target course; no full traffic or combat bot logic yet.

### Technical goals

Prove an arcade controller can deliver all four readable classes, stable collisions, theft, and a controllable AI seam.

### Dependencies

Gate A accepted. Representative placeholder vehicle colliders. No Store controller by default.

### Tests

Enter/exit rejection, ownership transfer, speed-exit damage, reverse cap, class configuration validation, bot intent path, repeated collision stability, and scene reset.

### Human review criteria

All four classes feel meaningfully different; handbrake is useful; compact and heavy vehicles remain readable; entering/exiting is fast; foot movement remains relevant; fixed camera remains usable while driving.

### Stop criteria

If the small controller cannot provide stable, tunable arcade feel within the approved Gate B budget, stop custom expansion and propose a separately authorised RCCP isolated preflight. Do not purchase or install automatically. Stop also if vehicle-camera requirements contradict the fixed-distance rule.

### Allowed simplifications

Primitive vehicle meshes, driver seat only, no physical doors, no passengers, no traffic, one bot course, no detailed engine simulation.

### Explicitly excluded

Vehicle damage states, burning/explosion, roadkill scoring, civilian traffic, police vehicles, final audio/art, network vehicle replication.

**Rough estimate:** 4–8 focused work packages; Store preflight adds a separate rough 1–3 weeks if authorised.

## Gate C — Impact and Destruction

### Package C1 — Complete weapon set

Add shotgun aggregation, rocket projectile, explosion service, ammunition, three slots, weapon pickups, drops, and exact reload-cancellation behavior.

### Package C2 — Actor/vehicle impacts

Implement contact telemetry, direct high-speed lethal rule, glancing/low-speed damage, knockdown, impulse feedback, and attribution.

### Package C3 — Vehicle lifecycle

Implement intact/damaged/heavily damaged/burning/exploded states, unavoidable burn damage, evacuation signal, rocket skip-to-destruction, wreck lifetime, and one-time explosion guard.

### Package C4 — Chain reactions and limited props

Validate ten closely parked vehicles with no artificial chain cap. Add tagged street-prop intact/broken swaps and pooled debris.

### Technical goals

Strong, correct, diagnosable impacts; fair foot/vehicle counterplay; stable unrestricted vehicle chain propagation; bounded destruction.

### Dependencies

Gate B accepted. Project-owned damage and vehicle lifecycle remain independent of the drive model.

### Tests

Reload interruption matrix; hitscan/projectile collision; radial deduplication; direct versus glancing impact thresholds; armour exception for lethal direct vehicle hit; one-time vehicle explosion; ten-vehicle chain; score attribution; debris lifetime and reset.

### Human review criteria

Pistol, shotgun, rockets, melee, roadkills, vehicle fire, and explosions have distinct readable impact. Foot players can evade and counter vehicles. Knockdown is not frustrating. Chain reactions are spectacular but understandable.

### Stop criteria

Unstable physics, duplicate damage/score, uncontrolled rigidbody/debris cost, unreadable chain reactions, vehicle dominance, or requirement for full deformation/fracture tooling. Reduce effects/props or revise state rules; do not add destruction middleware.

### Allowed simplifications

State/material/VFX damage, no mesh deformation, short controlled knockdown, simple broken prefab swaps, placeholder effects/audio.

### Explicitly excluded

Building destruction, persistent world damage, repair, passenger injury, advanced ragdoll, higher wanted levels.

**Rough estimate:** 4–8 focused work packages.

## Gate D — Replayable FFA

### Package D1 — Match, timer, scoring, restart

Implement match state, configurable timer, score/creative categories, results, and immediate restart. Score never ends the FFA early.

### Package D2 — Respawn, inventory, and pickups

Implement weighted clinic respawn, pistol/two-magazine reset, all-weapon death drops, medkits, armour, ammunition, spawn tables, and item respawn.

### Package D3 — Combat bots

Add target selection without permanent human bias, foot combat, pickups, health use, weapon choice, and bot-versus-bot validation. Then add vehicle entry, driving attack, ramming, rocket-versus-vehicle, and burning-vehicle evacuation.

### Package D4 — Civil population and traffic vertical slice

Build one intersection with custom lane graph, signals/reservations, drivers, pedestrians, danger reaction, stuck detection, and recovery. Measure authoring and runtime cost before scaling.

### Package D5 — Wanted Level 1

Add incident contribution, one wanted level, bounded foot police and police vehicles, approach/engage/search/return, and global police cap.

### Package D6 — Population and full greybox map

Integrate `PopulationDirector`, class targets, off-screen vehicle replenishment, visibility/danger checks, despawn, clinics, multi-block FFA map, HUD, minimap, scoring feedback, and one complete timed round.

### Technical goals

A complete solo FFA with one human and zero to eleven bots, civilians, traffic, wanted level 1, police, pickups, vehicles, score, timer, respawn, results, and restart.

### Dependencies

Gate C accepted. Unity NavMesh baseline. Store traffic/A* adoption is not implied.

### Tests

Timer-only termination; tie/results handling; bot target fairness; bot-versus-bot kills; pickup/drop parity; clinic danger weighting; off-screen replenishment; population caps; pedestrian flee/return; intersection deadlock/recovery; wanted allocation; full-round restart without stale state; batch smoke with eleven bots.

### Human review criteria

Rounds are replayable and readable; bots fight each other credibly; pacing does not collapse; traffic and pedestrians create opportunities without dominating; wanted level adds pressure; score and respawn are understandable; the human is not unfairly focused.

### Stop criteria

If custom traffic/intersection/pedestrian authoring or recovery threatens the gate budget, stop scaling and propose the Complete City Traffic & Pedestrian isolated preflight. If NavMesh shows recorded navigation/avoidance failure, propose A* Pro preflight. Stop on systematic bot collapse, city-wide deadlock, unsafe respawn, unbounded populations, or stale-state restart failures.

### Allowed simplifications

One compact route network, simple signals/reservations, low civilian behavior variety, one wanted level, no police tactics beyond basic pursuit/engagement, rudimentary minimap/HUD.

### Explicitly excluded

Networking, teams, factions, economy, higher wanted levels, roadblocks, advanced traffic law, passenger systems, story, progression.

**Rough estimate:** 8–16 focused work packages; this is the largest gameplay block.

## Gate E — Visual Identity

### Package E1 — Controlled asset import

In a dedicated import work package, register provenance and import only approved subsets. Preserve originals; create project-owned material/prefab variants. Do not mix import with core gameplay coding.

### Package E2 — World composition

Replace greybox selectively: NYC as preferred base, Diner once as landmark, bounded Port subset only after further testing. Establish district palettes, unique-landmark registry, LOD/collider review, lighting, wet asphalt, dirt, soot, smoke, steam, and restrained neon.

### Package E3 — Occlusion and camera extensibility

Validate the concrete project-owned fixed-camera occlusion component with representative materials. Do not implement a camera-policy interface, test double, Store adapter, or rotatable rig in the first prototype. If custom occlusion fails its stop criteria, propose a separately authorised See-through Shader preflight.

### Package E4 — Audio, VFX, UI polish

Integrate one music track, basic SFX, Particle System effects or approved existing assets, player/enemy readability, HUD and minimap polish, and volume controls.

### Technical goals

Deliver Neon over Dirt in motion while retaining readability, light adaptation, unique landmark rules, performance visibility, and later camera-policy replacement capability.

### Dependencies

Gate D accepted; separately approved asset import/download scope; package licences/provenance; current classifications: NYC and Diner `Suitable with Light Adaptation`, Port `Needs Further Testing`, none `Potential Release Asset`.

### Tests

Missing scripts/materials; duplicate full Diner detection; provenance completeness; LOD/collider checks; fixed-camera constraints; absence of fixed-orientation assumptions in player control and world aiming; occlusion restoration; screenshot/capture matrix; scene load/restart; no regression in Gate A–D automated tests.

### Human review criteria

Style works during movement and chaos; NYC/Diner coexist with light adaptation; Port subset is accepted or excluded based on evidence; no conspicuous asset duplication; the full Diner appears once; action remains readable with the fixed camera; camera/control/aim boundaries preserve the later rotatable comparison.

### Stop criteria

Cross-package cohesion requires heavy asset production; representative materials break occlusion; either camera regularly hides combat; visual effects hide hazards; a package needs unapproved shader/pipeline/tool changes; Port remains incoherent; routine adaptation becomes continuous manual work.

### Allowed simplifications

Limited districts, selected exterior subsets, baked/static lighting where suitable, Particle System instead of VFX Graph, project-owned material variants, no interiors.

### Explicitly excluded

Release-asset promotion, broad package import, second full Diner, custom Blender pipeline, building interiors, final branding, pipeline replacement.

**Rough estimate:** 6–12 focused work packages plus human visual review.

## Gate F — Technical Viability

### Package F1 — Instrumentation and budgets

Lock the representative configuration; record build/scene/config hashes; add diagnostics for frame time, GC, population, physics, navigation, traffic recovery, VFX, and render statistics.

### Package F2 — Maximum-load run

Run one human, eleven bots, civilians, traffic, foot/police vehicles, damaged/burning vehicles, simultaneous explosions, chain reactions, smoke, wet-road lighting, HUD, and minimap. Use stable visible Play Mode or development build; reject incomplete/crashed sets.

### Package F3 — Bottleneck correction

Correct only measured bottlenecks: update staggering, caps, pooling, physics/query frequency, LOD/culling, shader/light cost, traffic recovery, or data hot paths. Do not introduce an optimization package without a measured case and separate approval.

### Package F4 — Regression and final evidence

Run all EditMode, PlayMode, batch scene validation, full-round regression, camera checks, and repeated performance captures. Prepare a continuation report; do not begin multiplayer.

### Technical goals

Demonstrate combined stability, responsive input, stable vehicle physics, functioning AI/traffic/police, readable destruction/UI, identified bottlenecks, reproducible evidence, and no obvious mandatory rewrite before a later continuation decision.

### Dependencies

Gate E accepted; Human Developer defines the binding reference resolution/target and later the weaker profile when evidence supports it.

### Tests and evidence

Full automated suite; multiple complete warm/run sets; p50/p95/p99 CPU/GPU frame times; memory/GC; draw/triangle/overdraw observations; actor/population counts; traffic deadlock/recovery; error logs; scene/config/package hashes; visible capture; restart/second-match stability.

### Human review criteria

Input remains responsive; full action remains readable; performance/stability is acceptable for continuation; bottlenecks and tradeoffs are understood; no selected Store system controls core rules; continuation, revision, or stop is a deliberate decision.

### Stop criteria

Frequent runtime errors, simulation/physics collapse, persistent traffic deadlock, unusable input latency, repeatable device failure, memory growth, unreadable combined effects, missing complete evidence, requirement for scope expansion, or need for networking/full rewrite to proceed.

### Allowed simplifications

Reduce population densities within still-valid scope, lower non-critical VFX/lighting, shorten debris lifetimes, stagger AI sensors, and use proven LOD/pooling. Preserve one human plus up to eleven bots and required systems.

### Explicitly excluded

Multiplayer implementation, accounts, matchmaking, commercial platform work, progression, higher wanted levels, production release optimization, unmeasured optimization middleware.

**Rough estimate:** 3–8 focused work packages depending on measured bottlenecks.

## Human Review and Approval Map

| Point | Human decision | Required evidence |
|---|---|---|
| Foundation | Approve path/repository/project baseline | Git/project/package/URP baseline and restore plan |
| Gate A | Accept basic control quality | Visible control review plus passing rule/input tests |
| Gate B | Accept vehicle feel or authorise candidate preflight | Four profiles, collision evidence, bot-input seam |
| Gate C | Accept impact/destruction | Weapon, roadkill, ten-vehicle chain evidence |
| Gate D | Accept replayable FFA or authorise traffic/navigation preflight | Complete rounds, bot fairness, population/recovery tests |
| Gate E | Accept visual identity and fixed-camera readability | Paired captures, cohesion/occlusion/provenance evidence |
| Gate F | Continue, revise, or stop | Complete combined-load and regression report |

## Robust Handover Template

Every work package ends with:

1. objective and gate;
2. authoritative inputs and explicit permissions;
3. files/scenes/configuration changed;
4. exact package/Unity/URP state;
5. tests run and results;
6. human evidence still required;
7. blockers, risks, and assumptions;
8. exact clean restart command/path or Editor scene;
9. next single work package;
10. explicit prohibited next actions.

## High-Cost Blocks

Rough and non-binding:

* traffic, intersections, pedestrian reaction, and recovery;
* bot vehicle use and fair target/weapon behavior;
* four-class arcade vehicle feel and collision stability;
* cross-package world composition and occlusion;
* maximum-load performance diagnosis;
* repeated visible Human Developer feel/visual review.

These should be split more finely than low-risk data/UI work and should never share a work package with a major package import.
