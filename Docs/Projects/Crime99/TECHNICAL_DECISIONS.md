# Crime99 Technical Decision Register

## Status and Policy

**Document Maturity:** Confirmed Planning Baseline
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-16

This register records the Human Developer-confirmed technical planning baseline for the first playable prototype. `Accepted for Planning` means only that a decision belongs to this confirmed plan and should guide a later separately authorised implementation. It is not an implementation status and does not authorise project creation, implementation, purchase, download, package installation, asset import, commit, or push. `Preflight Candidate` requires a separately authorised isolated evaluation before adoption. `Deferred` is deliberately outside the first-prototype architecture.

No abstraction is authorised merely because a later replacement is conceivable. Implement an interface, adapter, service, event system, second implementation, plugin framework, or extension point only when the current gate or work package concretely needs it.

Design decisions remain in [`OPEN_DECISIONS.md`](OPEN_DECISIONS.md) and the GDD. Technical tuning remains subject to the canonical gates in [`PROTOTYPE_ROADMAP.md`](PROTOTYPE_ROADMAP.md).

## Decision Summary

| ID | Decision | Status |
|---|---|---|
| TD-001 | Unity `6000.3.19f1`, Windows Standalone, URP | Accepted for Planning |
| TD-002 | Small project-owned modular monolith | Accepted for Planning |
| TD-003 | Variant A baseline with need-driven abstractions only | Accepted for Planning |
| TD-004 | Separate project directory and Git repository | Accepted for Planning; exact path open |
| TD-005 | Unity Input System with intent adapters | Accepted for Planning |
| TD-006 | Small custom fixed camera; rotatable policy later | Accepted for Planning |
| TD-007 | Hitscan pistol/shotgun and projectile rocket | Accepted for Planning |
| TD-008 | Unified typed damage and project-owned vehicle damage state | Accepted for Planning |
| TD-009 | Small custom arcade vehicle controller first | Accepted for Planning |
| TD-010 | Hybrid navigation: Unity NavMesh plus custom lane graph | Accepted for Planning |
| TD-011 | Compact inspectable AI state/utility logic | Accepted for Planning |
| TD-012 | Project-owned population and spawn authority | Accepted for Planning |
| TD-013 | Unity pooling primitives plus domain-specific pools | Accepted for Planning |
| TD-014 | ScriptableObject tuning; settings-only persistence | Accepted for Planning |
| TD-015 | Custom simple minimap | Accepted for Planning |
| TD-016 | Particle System first; VFX Graph deferred | Accepted for Planning |
| TD-017 | Project-owned occlusion first | Accepted for Planning |
| TD-018 | Complete City Traffic & Pedestrian System | Retain for Controlled Prototype Trial (`Adopt with Conditions`) |
| TD-019 | A* Pathfinding Project Pro | Conditional Preflight Candidate |
| TD-020 | Realistic Car Controller Pro | Conditional Candidate; successful F3 parity preflight |
| TD-021 | See-through Shader | Conditional Preflight Candidate |
| TD-022 | No network architecture in prototype | Accepted for Planning |
| TD-023 | Automated evidence plus mandatory human feel gates | Accepted for Planning |
| TD-024 | Third-party originals remain untouched | Accepted for Planning |

## Decisions

### TD-001 — Engine, Platform, and Render Pipeline

**Status:** Accepted for Planning

Use Unity `6000.3.19f1`, Windows Standalone, and URP. URP is not an equally open pipeline alternative. A change requires a demonstrated blocker and a new Human Developer decision.

**Evidence:** the isolated preflight compiled and rendered the three required bounded selections with Unity `6000.3.19f1` and resolved URP `17.3.0`; this is direct project evidence, not proof for every future package or shader.

### TD-002 — Architecture Shape

**Status:** Accepted for Planning

Use a small modular monolith with project-owned rules and no enterprise framework. Concrete components may depend directly on each other when that is the smallest current solution. Add a narrow interface or event only for a concrete current-gate test, caller, or integration need. Avoid service locators hidden throughout gameplay, one-assembly-per-feature fragmentation, generic ability systems, ECS migration, and speculative networking layers.

### TD-003 — Recommended Variant

**Status:** Accepted for Planning

Variant A is the planning baseline. Navigation, traffic, vehicle drive physics, and camera occlusion are possible later replacement areas, but no seam, adapter, or second implementation is built in advance. Variant B components may enter only after an isolated, separately authorised preflight demonstrates lower total cost against an explicit gap; extract only the integration boundary then concretely required.

### TD-004 — Project and Repository Boundary

**Status:** Accepted for Planning; exact path open

Create the game later in a separate project directory and Git repository, with one Unity root at `Source/Crime99/`. The exact filesystem path remains OD-004 and must be confirmed before creation.

### TD-005 — Input

**Status:** Accepted for Planning

Use Unity Input System, a single project action asset, generated wrapper, and `OnFoot`, `Vehicle`, and `UI` maps. Actors consume project intent structures, not device input. Keyboard/mouse is required. Controller bindings are included only if they remain negligible and require no aim-assist or remapping expansion.

**Package evidence:** exact package version must be resolved by the Unity `6000.3.19f1` project template or package manager during authorised setup; it is not invented here.

### TD-006 — Camera

**Status:** Accepted for Planning

Build one concrete small project-owned `Fixed Camera` rig first. It follows the player at fixed elevation and distance with no zoom, panning, or independent translation. Do not implement `ICameraRig`, a second camera policy, or orbit input in prototype 1. Keep fixed-orientation assumptions out of player control and world aiming; extract only the boundary required if the later comparison is separately authorised.

Cinemachine is **Defer**: it offers mature camera composition, damping, and extension hooks, but the first rig is too constrained to justify package/editor coupling. Reconsider only if custom damping, target transitions, or collision handling becomes a measured maintenance problem.

### TD-007 — Weapon Resolution

**Status:** Accepted for Planning

Use hitscan for pistol and shotgun, aggregating shotgun pellets per target, and a pooled swept physical projectile for rockets. Use a timed cast for melee. This matches readability and reduces projectile simulation cost while preserving rockets and explosions as physical threats.

### TD-008 — Damage and Vehicle Lifecycle

**Status:** Accepted for Planning

Use one typed `DamageEvent` path for actors, vehicles, and breakable props, with receiver-specific rules. Keep health damage separate from physical impulse. Vehicle lifecycle is project-owned and state-based: intact, damaged, heavily damaged, burning, exploded. Do not adopt deformation or fracture middleware for the prototype.

### TD-009 — Vehicle Controller Baseline

**Status:** Accepted for Planning

Start with a bounded concrete Rigidbody/WheelCollider arcade controller and four data profiles. The project owns interaction, seats, theft, bot intent, damage, burning, explosion, score, and replenishment. Do not add a Store-controller adapter in advance. Stop custom-controller work and evaluate TD-020 if Gate B stability/feel criteria cannot be reached within the approved package budget.

### TD-010 — Navigation and Traffic Geometry

**Status:** Accepted for Planning

Use Unity NavMesh as the baseline for combat bots, pedestrians, and foot police. Use a small authored lane-spline/connection graph for civilian and police vehicles. Traffic lanes are not a general foot-navigation solution; NavMesh does not decide traffic rules.

Unity NavMesh is **Use Built-In**. Exact AI Navigation package/version and runtime baking capabilities must be verified during authorised setup rather than assumed.

### TD-011 — AI Decision Logic

**Status:** Accepted for Planning

Use small state machines with utility-scored high-level choices. Share perception, target scoring, danger data, and navigation contracts, not one universal behaviour graph. Maintain separate policies for combat bots, pedestrians, civilian drivers, foot police, and police vehicles.

### TD-012 — Population Authority

**Status:** Accepted for Planning

One project-owned `PopulationDirector` enforces category/global caps, off-screen spawn rules, danger avoidance, replenishment, despawn, and update budgets. If a vendor population system is later authorised for integration, introduce only the concrete boundary required to keep this authority project-owned.

### TD-013 — Pooling

**Status:** Accepted for Planning

Use Unity `ObjectPool<T>` or small project pools for rockets, common VFX, debris, dropped pickups, and frequently replenished objects. Pooling is an optimization, not ownership of game rules. A generic pooling asset is **Reject**.

### TD-014 — Data and Save

**Status:** Accepted for Planning

Use ScriptableObjects for authoring/tuning data and plain runtime state for the match. Persist only settings useful for repeated tests. No long-term progression, account, inventory persistence, cloud save, or migration framework.

### TD-015 — Minimap

**Status:** Accepted for Planning

Build a small project minimap showing player, roads/boundary, clinics, and selected threats. Choose a static/pre-authored background or an orthographic render texture after a cheap comparison. A feature-heavy Store minimap is **Reject** for the prototype.

### TD-016 — VFX Technology

**Status:** Accepted for Planning

Use built-in Particle System and already approved/available VFX assets first. They are sufficient for impacts, smoke, fire, sparks, and explosions and are easier to pool and inspect. VFX Graph is **Defer** until a specific effect or measured CPU bottleneck justifies GPU-driven effects. Do not install it by default.

### TD-017 — Occlusion Baseline

**Status:** Accepted for Planning

Build one small concrete URP-compatible occluder fade/material-swap component with project-owned material variants and reference-counted restoration for the fixed camera. Do not prebuild a Store adapter or rotatable-camera implementation. Do not alter publisher materials in place.

### TD-018 — Complete City Traffic & Pedestrian System

**Status:** Retain for Controlled Prototype Trial (`Adopt with Conditions`)

**Decision category:** `Adopt with Conditions`; this is conditional retention for a later prototype trial, not current integration or final adoption.

**Benefit and coverage:** traffic lanes, intersections, lights, crossings, pedestrian routes, population, and pooling cover the largest combined systems gap.

**Integration:** high. Its waypoint/editor model and population rules would influence the map; Crime99 flee/return, danger, wanted response, theft, driveable controllers, police, and global caps remain adapters/project code.

**Binding and maintenance risk:** high vendor and authoring lock-in. Source availability reduces but does not remove risk.

**Direct preflight evidence:** isolated and combined testing ran under Unity `6000.3.19f1` and URP `17.3.0` with Traffic `3.6.3`, Pedestrian `1.5.8`, and Urban Example `1.5.9`. Technical integration and the six-scenario review harness ran successfully, but Human recovery review failed F1 pedestrian-to-pedestrian interaction, F3 representative pedestrian-versus-player-vehicle avoidance, F4 traffic-versus-small-obstacle recovery, and F5 multi-vehicle deadlock recovery. F2 and corrected F6 passed.

**Technical finding:** `Package Limitation`. The supplied behaviours provide waypoint, lane-link, population, and optional static-graph pathfinding primitives, but no universal reciprocal crowd avoidance or runtime blocked-road recovery. The bounded recovery adapter PoC did not solve F1/F3/F4/F5. This finding is retained in full and is not converted into a technical Pass by the product decision.

**Controlled prototype-trial conditions:** any later Crime99 trial requires separate authority and Inspector-accessible, documented settings for traffic/pedestrian density, spawn/despawn areas, obstacle detection, wait/blockage timing, waypoint/lane-change behaviour, pedestrian avoidance distance, stuck/recovery thresholds, and dead or prone road objects. The trial may deliberately use controlled waypoint networks, sufficient road width, bounded agent counts, selected ambient situations, and optional cleanup of persistent blockers. It must not assume universal local avoidance and must receive a new Human review under representative Crime99 map, camera, and gameplay conditions.

**Current boundary:** no Crime99 import or integration has occurred, and no final adoption is approved. Crime99 continues to own population policy, gameplay reactions, cleanup rules, and acceptance criteria.

### TD-019 — A* Pathfinding Project Pro

**Status:** Conditional Preflight Candidate

**Decision category:** `Preflight Candidate`

**Benefit and coverage:** mature pathfinding graphs, recast/grid choices, local avoidance, and debugging for combat bots and foot police.

**Integration:** medium-high; project AI remains custom, but movement/navigation code and graph authoring bind to vendor APIs.

**Unity 6/URP evidence:** local research records version `5.4.6`, original Unity `2021.3.45`, and no explicit Unity 6000 compatibility row or render-pipeline table. Navigation is mostly pipeline-independent, but compatibility is unproven for the confirmed baseline.

**Adoption gate:** only if Unity NavMesh fails a recorded multi-block navigation, avoidance, dynamic-obstacle, or debugability requirement. Preflight with one bot and one foot-police route; introduce a project-specific boundary only if later integration is authorised.

### TD-020 — Realistic Car Controller Pro

**Status:** Conditional Candidate; successful F3 parity preflight

**Decision category:** `Preflight Candidate`

**Benefit and coverage:** mature wheel, suspension, drivetrain, setup, and arcade/realistic tuning may save the most expensive vehicle-foundation work.

**Integration:** high. Crime99 must still own theft, bot input, damage, burning, explosion, roadkill, score, and traffic coexistence.

**Direct preflight evidence:** RCCP `2.57.0` ran under Unity `6000.3.19f1`/URP. The combined F2 comparison was invalid because it changed the manufacturer Coupe from `1750 kg`, `300 Nm`, and `40 degrees` steering to `1150 kg`, `250 Nm`, and `38 degrees`, recomputed steering-axle ownership, changed presentation, and replaced the RCCP camera. F3 restored the exact manufacturer Coupe and RCCP camera while retaining only required integration layers and the obstacle proxy. Human review accepted F3 as sufficiently close to the manufacturer-faithful F1 reference.

**Current boundary and remaining conditions:** RCCP remains a conditional candidate, not integrated or finally adopted. A later Crime99 trial must still prove the required vehicle classes, bot intent, project-owned theft/damage/lifecycle, roadkills/collisions, population load, Crime99 camera conditions, and acceptable per-class feel. Manufacturer vehicle and camera configuration must remain the parity baseline; derived tuning must be labelled and reviewed separately.

### TD-021 — See-through Shader

**Status:** Conditional Preflight Candidate

**Decision category:** `Preflight Candidate`

**Benefit and coverage:** purpose-built multi-obstacle see-through/fade behavior directly addresses elevated-camera occlusion.

**Integration:** medium-low in principle, but material/shader coverage across multiple asset packages may be costly. Do not create an adapter before an authorised integration package.

**Unity 6/URP evidence:** local research records version `1.9.1`, original Unity `2021.3.45`, Built-in/URP/HDRP compatibility for that version, and publisher Built-in/URP statements. Explicit Unity `6000.3.19f1` evidence is absent.

**Adoption gate:** only if the project-owned fade fails representative NYC/Diner/Port materials or maintenance/performance thresholds. Test multiple simultaneous occluders, opaque/transparent materials, restoration, both cameras, and frame cost.

### TD-022 — Networking Boundary

**Status:** Accepted for Planning

Do not implement networking. Preserve intents, stable IDs, project-owned rule state, and presentation separation. Do not add transport, replication, prediction, rollback, lobbies, accounts, matchmaking, or network-specific abstraction without later authority.

### TD-023 — Test and Review Evidence

**Status:** Accepted for Planning

Every gate requires automated correctness/stability evidence and a Human Developer review for subjective feel/visual criteria. Batch success cannot substitute for visible Play Mode review.

### TD-024 — Third-Party Asset Integrity

**Status:** Accepted for Planning

Third-party originals remain under `Assets/ThirdParty/<Publisher>/<Package>` and are not edited in place. Materials, prefab variants, configuration, and adaptations are project-owned derivatives with provenance. The full Fuyoh Diner appears once per map; subassets may repeat only without conspicuous duplication. No current package is a `Potential Release Asset`.

## Tool and Package Decision Matrix

| Candidate | Concrete use | Coverage | Integration / binding | Maintenance risk | Unity 6 / URP evidence | Decision |
|---|---|---|---|---|---|---|
| Unity Input System | Device actions and control maps | Input | Low-medium; one project wrapper | Low | Exact baseline version unresolved until project setup | `Use Built-In` |
| Cinemachine | Camera rigs and damping | More than required | Medium Editor/package coupling | Low-medium | Not locally verified for exact baseline | `Defer` |
| Simple custom camera | Exact fixed/rotatable policies | Full prototype camera | Low | Low | Plain Unity/URP code; exact behavior still needs tests | `Build Small Custom` |
| Unity NavMesh / AI Navigation | Foot paths and obstacles | Bots, pedestrians, foot police | Low-medium; use concrete baseline first | Low-medium | Exact package/version unresolved | `Use Built-In` |
| A* Pathfinding Project Pro | Paths, graphs, local avoidance | Foot navigation, not behavior/traffic | High vendor API binding | Medium | No exact Unity 6.3 proof | `Preflight Candidate` |
| Complete City Traffic & Pedestrian | Controlled ambient traffic and pedestrians | Broad population primitives; recovery limitation | High authoring/runtime binding | High | Direct Unity `6000.3.19f1`/URP preflight; F1/F3/F4/F5 recovery failed | `Retain for Controlled Prototype Trial` / `Adopt with Conditions` |
| Realistic Car Controller Pro | Vehicle physics/setup | Drive model only | High component binding | Medium-high | Direct Unity `6000.3.19f1`/URP preflight; F3 parity accepted | `Conditional Candidate` |
| Simple custom vehicle | Arcade four-class drive model | Minimum Gate B | Medium physics/tuning work | Medium | Unity built-in physics | `Build Small Custom` |
| See-through Shader | Building occlusion | Camera readability | Medium material binding | Medium | URP evidence for older Unity; exact baseline unproven | `Preflight Candidate` |
| Unity Object Pooling | Allocation control | Common transient objects | Low | Low | Unity built-in API | `Use Built-In` |
| Project-specific pooling | Domain lifecycle/caps | Population and special objects | Low | Low-medium | Plain Unity code | `Build Small Custom` |
| Custom minimap | Required simple orientation | Full prototype scope | Low | Low | URP/built-in rendering path | `Build Small Custom` |
| Store minimap | Broad mapping features | Excess scope | High UI/render binding | Medium-high | No candidate/evidence established | `Reject` |
| Particle System | Impacts, fire, smoke, explosions | Prototype VFX | Low | Low | Built-in; representative assets still require test | `Use Built-In` |
| VFX Graph | GPU-heavy advanced effects | Optional excess for prototype | Medium-high package/shader binding | Medium | Exact baseline/package unverified | `Defer` |
| Existing VFX assets | Content acceleration | Likely broad | Asset-specific | Medium | POLYGON pack remains unvalidated for exact use | `Preflight Candidate` |

## Human Developer Decisions Still Required

Architecture planning does not resolve:

* OD-004 exact project path and repository creation approval;
* OD-006 implementation authorisation and exact first work package;
* any new purchase/download/installation or Store candidate preflight;
* final camera values and later camera-variant comparison result;
* final performance target and weaker hardware profile;
* execution and final adoption outcome of the separately authorised controlled Traffic/Pedestrian and RCCP prototype trials;
* any Git LFS or external large-asset storage model;
* release-asset classifications.

## Supersession Rule

A later decision may supersede a TD entry only by recording the reason, evidence, scope, and replacement ID. Never reuse or duplicate an ID.
