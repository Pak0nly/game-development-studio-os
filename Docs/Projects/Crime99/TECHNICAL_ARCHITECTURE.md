# Crime99 Technical Architecture

## Status and Boundary

**Document Maturity:** Confirmed Planning Baseline
**Architecture Baseline:** Variant A — Minimal Custom Prototype
**Target:** First playable prototype
**Engine:** Unity `6000.3.19f1`
**Platform:** Windows Standalone
**Render Pipeline:** Universal Render Pipeline (URP)
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-15

This document is the Human Developer-confirmed planning baseline for the first prototype. Confirmation fixes the planning direction only. It does not authorise project creation, implementation, package installation, asset import, purchase, download, staging beyond a separately authorised documentation scope, commit, or push. Design rules remain authoritative in [`GDD/16_PROTOTYPE_SCOPE.md`](GDD/16_PROTOTYPE_SCOPE.md); the canonical gate order remains in [`PROTOTYPE_ROADMAP.md`](PROTOTYPE_ROADMAP.md).

The first prototype uses `Fixed Camera`: fixed elevation, fixed distance, no zoom, no panning, and no independent translation. A later comparison may replace only the camera policy with `Rotatable Camera`: free rotation around the player while retaining fixed elevation and distance.

## Architecture Outcome

Use a small modular monolith owned by Crime99. Runtime systems may communicate directly through concrete project-owned components where that is sufficient. Introduce an interface, adapter, service, typed event system, or other abstraction only when the current gate or work package has a concrete need for it. Scene objects are presentation and composition roots; authoritative match, damage, score, spawn, and population rules live in testable project-owned code.

The baseline is **Variant A — Minimal Custom Prototype**. Navigation, traffic, vehicle physics, and occlusion are possible later replacement pressure points, but this planning observation does not require prebuilt seams. For each area:

1. implement the smallest concrete solution required by the current gate;
2. retain project ownership of gameplay rules and data;
3. introduce a boundary only when an authorised second implementation or integration creates a demonstrated need;
4. keep that boundary specific to the demonstrated integration.

Do not build precautionary adapters, second implementations, generic plugin infrastructure, speculative extension points, or abstraction layers for possible future packages. A later preflight may justify extracting one project-specific boundary at that time; it does not justify building that boundary now.

## Quality Attributes

Priority order:

1. playable feel and readable feedback;
2. deterministic-enough rules for repeatable tests;
3. fast isolated iteration;
4. diagnosable state and bounded dependencies;
5. acceptable combined-load performance;
6. replacement of individual systems without a project rewrite;
7. avoidance of obvious future multiplayer dead ends without networking work now.

Out of scope are a service container, entity-component framework, distributed architecture, generic ability framework, full event-sourcing, rollback, prediction, account model, progression database, or network transport.

## Repository and Project Structure

The later game project should use a separate Git repository and the Studio OS project envelope:

```text
Projects/Crime99/
├── README.md
├── Docs/
├── Assets/                 # source assets outside Unity when required
├── Builds/                 # ignored local builds
├── References/
├── Tools/
└── Source/Crime99/         # sole Unity project root
    ├── Assets/
    │   ├── _Crime99/
    │   │   ├── Art/
    │   │   │   ├── Materials/
    │   │   │   ├── MaterialVariants/
    │   │   │   └── PrefabVariants/
    │   │   ├── Audio/
    │   │   ├── Code/
    │   │   │   ├── Runtime/
    │   │   │   ├── Editor/
    │   │   │   └── Tests/
    │   │   ├── Config/
    │   │   ├── Prefabs/
    │   │   ├── Scenes/
    │   │   │   ├── Bootstrap/
    │   │   │   ├── TestAreas/
    │   │   │   └── Prototype/
    │   │   ├── UI/
    │   │   └── VFX/
    │   └── ThirdParty/
    │       └── <Publisher>/<Package>/
    ├── Packages/
    └── ProjectSettings/
```

Rules:

* `_Crime99` is the only project-owned runtime root.
* `ThirdParty` preserves publisher files unchanged and groups them by provenance.
* Adapted materials and prefab variants live under `_Crime99`; never edit purchased originals in place.
* Runtime and Editor code use separate assembly definitions. Tests use separate EditMode and PlayMode assemblies.
* Each feature folder may contain code, prefabs, and tests only when that reduces navigation cost; avoid one assembly per feature.
* Test areas are technical fixtures. The FFA map is never used as the only system test scene.

### Git and Large Assets

The project repository tracks project-owned code, configuration, scenes, prefabs, metadata, documentation, and approved lightweight runtime assets. Before the first large import, classify every package file as tracked, reconstructible licensed payload, or external source asset.

Initial `.gitignore` must use the current Unity template and exclude at least `Library/`, `Temp/`, `Obj/`, `Logs/`, `UserSettings/`, local builds, IDE caches, crash dumps, memory captures, and machine-local credentials. Keep `.meta` files with every tracked Unity asset.

Do not introduce Git LFS automatically. Perform a separately reviewed repository-size and licence assessment after representative imports. If licensed raw payload cannot be redistributed in Git, keep a manifest containing package ID, version, licence reference, archive hash, selected paths, import recipe, and local restore location. Git LFS, release archives, and non-Git asset storage require explicit decisions before use.

### Provenance and Licence Register

Maintain one machine-readable or Markdown register with:

* asset/package name, publisher, store/package ID, version, acquisition source, and acquisition date;
* licence and seat/entity scope;
* original archive SHA-256 when available;
* imported path and selected subset;
* modifications and derived project-owned variants;
* prototype/release approval state;
* render-pipeline and Unity evidence;
* restore instructions.

The current architecture input classifies `1950s NYC` and `Fuyoh Cyberpunk Diner` as `Suitable with Light Adaptation`, and `Cyberpunk Port City` as `Needs Further Testing`. No package is a `Potential Release Asset`.

### Backup and Reset

Use four layers:

1. small, coherent Git commits after separate approval;
2. synchronized private remote after separate push approval;
3. independent encrypted offline full-history backup under DEC-023;
4. pre-import Git tag or bundle plus recorded package manifest for large, stateful imports.

Never rely on `Library/` as recovery state. Validate restore from Git plus manifests in an empty workspace. Large imports, package changes, and pipeline changes occur in isolated work packages and never during a complex gameplay-code task.

## Runtime Composition

### Bootstrap

One bootstrap scene creates the project composition root, loads configuration, initializes only the concrete components required by the current gate/scene, and then loads either a technical test scene or the prototype map additively. Avoid global scene searches and order-dependent `Awake` chains.

Planned runtime owners, each introduced only in the gate that first needs it:

* `GameClock` and pause/time-scale policy;
* `MatchService`;
* `ScoreService`;
* `SpawnService`;
* `PopulationDirector`;
* `AudioService`;
* `PoolRegistry`;
* configuration registry;
* diagnostics/evidence recorder.

This list is not a foundation-phase creation checklist. Start with serialized references for scene-local components. Add a minimal context or factory only when the current work package has enough concrete dependencies to require one. Do not add a third-party dependency-injection container.

### Match Loop and State

`MatchService` owns a small explicit state machine:

```text
Boot -> Warmup -> Playing -> Results -> Restarting -> Playing
```

Only `Playing` advances the authoritative round timer and accepts score-changing combat events. Timer expiry transitions once to `Results`; highest score wins; a score limit never ends the match. Match configuration supplies duration, bot count from zero through eleven, and population caps.

`ScoreService` consumes validated death/kill attribution and emits score changes and presentation events. It does not inspect scene objects. Kill attribution uses stable runtime actor IDs, last-damage records with expiry, direct/vehicle/explosion/environment source tags, and explicit suicide/unattributed outcomes.

### Actor State

Each combatant has a project-owned `ActorRoot` with:

* stable runtime ID and team-free FFA affiliation;
* life state (`Alive`, `Downed`, `Dead`, `Respawning` as applicable);
* health, armour, stamina, inventory, wanted contribution, and current vehicle reference;
* input/intent source selected as human or bot;
* the concrete animation, audio, UI, and VFX presentation components required by the current gate.

Player and combat bots use the same movement, weapon, damage, pickup, inventory, and vehicle-interaction commands. They differ at the intent source, not in rule implementation.

### Damage, Health, Armour, and Death

All damage enters `IDamageReceiver.Apply(DamageEvent)`. `DamageEvent` records amount, type, impulse, instigator, source object, hit position, and tags. The receiver applies invulnerability/state checks, armour-before-health rules, special direct vehicle-impact rules, and then emits one immutable result.

Keep physical impulse separate from health damage. This permits low-speed knockdown without automatic death and high-speed direct impact death regardless of armour. Exact thresholds remain tuning data.

Death flow:

1. atomically mark dead;
2. disable action and vehicle ownership;
3. capture attribution and scoring;
4. drop all carried weapons through the pickup factory;
5. return transient objects to pools after their presentation window;
6. request a weighted clinic respawn;
7. restore pistol plus two magazines and default actor state.

### Weapons and Combat

Use a common `WeaponDefinition` ScriptableObject and a runtime `WeaponInstance`. Definitions hold tuning data; runtime instances hold ammunition, reload state, cooldown, and owner.

* Pistol: hitscan.
* Shotgun: multi-ray hitscan with one aggregated damage result per target per shot.
* Rocket launcher: pooled physical projectile with sweep/raycast collision and radial explosion.
* Melee: short timed overlap or cast from the actor, not animation-event-only logic.

Reload is a cancellable state. Shooting, weapon switching, melee, dodge, and vehicle entry cancel it; movement, sprint, and received damage do not. Sprint, jump, and dodge block shooting. Spread reads movement state but weapon logic does not own locomotion.

`ExplosionService` performs one overlap query, sorts or deduplicates receivers, applies falloff and impulses, and records source attribution. Vehicle chain reactions have no artificial chain cap; each vehicle may explode only once. Pool effects and debris independently from damage resolution.

Knockdown is a short actor state with controlled recovery. Do not introduce full active ragdoll for the first prototype unless a later feel test proves it necessary.

### Pickups and Object Respawn

World spawn points reference `SpawnTable` data. `PickupSpawner` owns availability and cooldown; pickups do not schedule their own replacement. Dropped weapons use the same pickup interaction but a separate lifetime policy.

`SpawnService` supplies deterministic seed support for tests, weighted clinic selection, visibility checks, enemy/combat danger scoring, and safe fallback. Every respawn decision can emit a reason record for evidence.

### Vehicles

Separate four concerns:

* `VehicleActor`: identity, occupancy, interaction, damage, and lifecycle;
* `VehicleDriveModel`: the concrete custom Gate-B component for throttle, brake, steering, handbrake, reverse, and physical telemetry;
* `VehicleSeat`: the one driver slot required by prototype rules;
* `VehicleBrain`: human or bot driving intent.

The default prototype controller is a small Rigidbody/WheelCollider-based arcade model only if Gate B can be reached quickly and stably. Four data definitions tune acceleration, top speed, steering, braking, handbrake, mass, durability, and collision response.

Entering and exiting are explicit transactions. Validate range, speed, occupancy, actor state, and exit position before changing ownership. A slow occupied vehicle theft transfers the driver seat and sends the former civilian owner to a flee state. Exit at speed applies data-driven actor damage. No physical doors or passenger seats are required.

Vehicle damage state is project-owned: `Intact -> Damaged -> HeavilyDamaged -> Burning -> Exploded`. The drive model reports collision telemetry but never decides score, damage state, burning, or explosion. This keeps a Store controller replaceable. Burning applies unavoidable damage over time and signals bot evacuation; rocket damage may transition directly to explosion.

Vehicle replenishment is owned by `PopulationDirector`: target counts by class, delayed replacement, outside-camera-frustum and distance checks, combat-danger avoidance, abandonment policy, and pooled or factory-created spawn. Spawn logic is independent of the drive model.

### Input, Aim, and Camera

Use Unity Input System with one project-owned action asset and generated C# wrapper. Required maps are `OnFoot`, `Vehicle`, and `UI`. Actions express intent, not key codes. Keyboard and mouse are required. A gamepad binding set may be retained only if it adds no separate aim-assist or UI burden.

`HumanIntentSource` converts actions into:

* movement vector;
* world aim point/direction;
* fire/reload/melee/dodge/sprint/jump/interact intent;
* vehicle throttle/brake/steer/handbrake/exit intent.

Aim maps the pointer ray to an explicit gameplay plane or valid aim surface, with a maximum range and fallback direction. The weapon consumes world aim, never screen coordinates. Camera orientation maps movement input into camera-relative horizontal world movement, while actor facing follows aim where allowed.

The first implementation is one concrete small custom fixed rig using damping only where it does not harm responsiveness. Player control and world aiming must not embed fixed-orientation assumptions, but no camera interface or rotatable implementation is required in prototype 1. If the later comparison is separately authorised, extract only the boundary then required to add orbit yaw while retaining fixed elevation and distance. Neither controller nor aim logic moves the camera directly.

Occlusion begins as one concrete project-owned component fed by camera-to-focus casts. It fades or swaps project-owned material variants on tagged occluders and restores them through reference counting. Never mutate shared publisher materials at runtime. See-through Shader remains a preflight candidate if representative URP materials make the small solution fragile or expensive; introduce an integration boundary only if that preflight is separately authorised and reaches integration work.

### AI, Navigation, Traffic, and Police

Keep decision-making separate by population type while sharing perception and movement contracts.

#### Shared Gate-D systems

* `PerceptionService`: bounded distance, field-of-view, line-of-sight, hearing/noise events, and update staggering.
* `TargetSelector`: scored candidates with hysteresis; combat bots must not permanently prefer the human.
* concrete Unity NavMesh-based foot navigation required by the current AI package; extract a navigation boundary only if an authorised alternative is actually integrated.
* `PopulationDirector`: global and category caps, spawn/despawn, distance/visibility/combat safety, update budgets.
* `DangerMap`: short-lived spatial danger samples from gunfire, explosions, burning vehicles, and police activity.

#### Combat bots

Use a compact hierarchical state machine: `Acquire`, `MoveToTacticalRange`, `Attack`, `SeekPickup`, `EnterVehicle`, `DriveAttack`, `EvacuateVehicle`, `Recover`, `Dead`. Utility scores choose the high-level state; each state remains inspectable. Avoid a generic behaviour-tree product.

#### Pedestrians

Use `Wander/Route`, `React`, `Flee`, `HideOrWait`, and `Return`. Pedestrians do not use combat logic. Their updates are aggressively staggered, and distant pedestrians use reduced simulation.

#### Civilian drivers

Use authored lane splines and connection nodes, intersection reservations or simple signal phases, forward obstacle probes, speed targets, stuck detection, recovery, and despawn/replenishment. Civilian traffic does not pathfind freely across the road surface.

#### Police on foot

Reuse the concrete navigation and perception data already required by Gate D, but use a small `Respond`, `Approach`, `Engage`, `Search`, `Return` policy. Wanted level 1 only. Global allocation prevents unbounded unit creation.

#### Police vehicles

Reuse lane navigation where possible, allow limited pursuit steering offsets, and fall back to foot response when blocked. Do not build emergency-route optimisation, roadblocks, or higher wanted levels.

#### Navigation alternatives

| Option | Strength | Main limitation | Architecture decision |
|---|---|---|---|
| Small project-specific solution | Lowest coupling; sufficient lane traffic and simple policies | Foot pathfinding/avoidance becomes expensive | Use custom lane graph; do not build custom general pathfinding |
| Unity NavMesh | Built-in, familiar, adequate for foot agents | Local avoidance and dynamic urban edge cases require validation | Baseline foot navigation |
| Complete City Traffic & Pedestrian System | Broad traffic, intersection, pedestrian, pooling coverage | High authoring/API lock-in; Crime99 reactions remain custom | Preflight candidate only |
| A* Pathfinding Project Pro | Strong graphs, pathfinding, local avoidance, debugging | Paid dependency; does not solve behaviour or traffic | Preflight only if NavMesh fails measured bot/police needs |
| Hybrid | Uses each tool only where valuable | Multiple spatial representations can raise integration cost | Recommended shape: NavMesh for foot agents plus project-owned lane graph; add an integration boundary only for a proven and authorised replacement |

### Population Budgets

All counts are configuration, not constants. Use one global active-object budget and category caps for combatants, pedestrians, civilian vehicles, foot police, police vehicles, projectiles, debris, and VFX. The director applies hysteresis and time-sliced spawn/despawn work. Never spawn inside the active view or directly into severe danger unless a test-only override is enabled.

### World and Asset Integration

Build the prototype map from authored city blocks and district prefabs around a road/lane skeleton. Separate:

* `SystemsTest` scenes for one system and synthetic geometry;
* `IntegrationBlock` for one intersection, clinic, traffic, bots, and representative buildings;
* `PrototypeFFA` for the final multi-block match.

Use `1950s NYC` as the preferred base-city source with light project-owned material and prefab adaptation. Use the complete `Fuyoh Cyberpunk Diner` once as a landmark; reusable subassets may recur only where repetition is not visually obvious. Use `Cyberpunk Port City` only in bounded selected subsets after further testing. Do not duplicate the complete diner.

World rules:

* one landmark registry prevents duplicate unique prefabs;
* district palettes point to adapted material variants rather than editing originals;
* static geometry uses baked occlusion culling after layout stabilizes;
* dynamic actors use distance and frustum policies, not baked occlusion as authority;
* verify package LODs, then add project-owned LODGroups only to measured offenders;
* destruction is limited to tagged street props using intact/broken prefab swap plus pooled debris;
* no building destruction, persistent deformation, or runtime fracturing;
* pool rockets, impacts, common VFX, pickup drops, debris, and frequently replenished population objects after profiling confirms value.

### Rendering and Performance Budgets

URP is fixed unless a concrete blocker is demonstrated. Begin with one forward renderer configuration, restrained additional lights, baked/static lighting where practical, and a short controlled shader-variant set. Do not introduce a second render pipeline.

Provisional budgets are test hypotheses, not product commitments:

* gameplay target: stable 60 fps on the Human Developer reference PC at the agreed test resolution;
* CPU main-thread and render-thread spikes: separately recorded at p95/p99 during the maximum scenario;
* no per-frame managed allocations in steady-state combat/population loops;
* bounded physics query counts through non-allocating queries and staggered sensors;
* explicit caps for real-time lights, active rigidbodies, pooled VFX, visible pedestrians, and vehicles;
* memory, draw calls, triangles, overdraw, and shader variants recorded per representative scene.

Final thresholds and the weaker minimum profile remain Human Developer decisions after evidence exists.

### Audio and UI

`AudioService` receives semantic cues (`WeaponFired`, `ActorHit`, `VehicleImpact`, `Explosion`, `WantedChanged`) and selects clips through data. Use AudioMixer groups for Master, Music, SFX, and optional Ambience; expose separate volume settings. One music track and basic SFX are sufficient.

UI observes read-only match/actor view models. HUD includes health, armour, stamina, ammunition, weapon slots, score, wanted status, timer, vehicle state, and kill feedback. The simple minimap uses an orthographic render texture or pre-authored road background with pooled icons; choose the cheaper measured option. It is not a navigation authority and does not justify a Store framework.

### Data and Save

Use ScriptableObjects for immutable authoring data:

* match configuration;
* weapon, vehicle, bot, population, pickup, spawn, and audio definitions;
* camera and difficulty tuning profiles.

Runtime state is plain serializable C# state owned by services/components. Save only local settings required to improve repeated testing: volumes, display mode/resolution, sensitivity, and optional key bindings if remapping is included. Use versioned JSON or PlayerPrefs for the small settings payload; never store tuning assets or match progression as player save data. No account, cloud, progression, inventory persistence, or migration framework.

## Testing and Evidence Architecture

### EditMode

Test pure rules without scenes:

* timer and match transitions;
* score and attribution;
* health/armour and damage types;
* reload cancellation matrix;
* vehicle damage transitions and one-time explosion;
* spawn weighting and visibility rejection;
* population cap/hysteresis rules;
* configuration validation and duplicate IDs.

### PlayMode

Use purpose-built scenes for:

* on-foot input, aim, sprint, jump, dodge, and camera mapping;
* weapon hitscan/projectile/explosion behaviour;
* vehicle enter/exit/theft and all four handling profiles;
* ten-vehicle chain reaction;
* bot target fairness and bot-versus-bot combat;
* pedestrian flee/return;
* traffic intersection, deadlock detection, and recovery;
* clinic respawn safety;
* fixed-camera occlusion;
* full timed FFA restart;
* maximum-load smoke test.

### Batch and Scene Validation

An Editor validation entry point must open every build/test scene, compile, verify required layers/tags/input actions, detect missing scripts/materials/references, validate unique landmark constraints, validate configuration IDs/ranges, and run EditMode plus eligible PlayMode tests in batch mode. Return non-zero on failure and write JUnit/XML plus a concise Markdown/JSON evidence summary.

### Performance Evidence

Use stable visible Play Mode or development-build captures for representative gates; do not accept partial or crashed run sets. Record Unity/URP version, graphics API, hardware, resolution, quality, VSync, scene/config hash, warmup, sample duration, p50/p95/p99 frame times, memory, GC, actor counts, draw statistics, and known anomalies. Profiler captures remain local artifacts unless explicitly approved for Git.

### Human Review Gates

Human review is mandatory for feel or visual judgments:

* Gate A: movement, aim, fixed-camera readability;
* Gate B: four-class vehicle feel and foot/vehicle fairness;
* Gate C: impact, knockdown, destruction, chain-reaction readability;
* Gate D: replayable FFA pacing, bot fairness, score clarity;
* Gate E: fixed-camera readability, asset cohesion, occlusion, visual/audio identity, and camera-policy seam;
* Gate F: complete-load responsiveness and continuation decision.

Automated evidence may establish correctness and stability, never subjective feel or final acceptance.

## Variant Comparison

| Dimension | Variant A — Minimal Custom | Variant B — Selective Store Integration |
|---|---|---|
| Development effort | Higher for traffic and vehicle foundations; lowest setup elsewhere | Potentially lower after successful preflight; integration remains material |
| Integration risk | Low and incremental | Medium-high, especially traffic/map authoring and vehicle APIs |
| Maintenance | Project-owned and narrow | Vendor updates, package compatibility, and licence tracking required |
| AI autonomy | High; small code and tests are easy to inspect | Lower where undocumented Editor workflows or opaque conventions dominate |
| Debuggability | High | Variable; source availability helps but vendor stacks add state |
| Performance | Must be engineered and measured | May provide mature optimizations, but defaults may not fit the scenario |
| Future multiplayer | No networking, but rules separated from presentation | Vendor runtime state may be difficult to replicate or serialize |
| Third-party dependence | Low | High in the selected expensive domains |

**Recommendation:** implement Variant A through Gate A. At Gate B, compare the small controller against a separately authorised RCCP preflight only if custom feel/stability work exceeds the stop criteria. Before Gate D population work, preflight Complete City Traffic & Pedestrian System only if the lane/pedestrian vertical slice demonstrates that custom traffic cost threatens the gate. Keep Unity NavMesh as baseline and preflight A* Pro only against a recorded navigation failure. This is a hybrid acquisition strategy, not early adoption of Variant B.

## Multiplayer-Safe Boundaries Without Multiplayer Work

Avoid obvious dead ends by:

* using stable runtime IDs instead of scene references in scoring/damage records;
* expressing human and AI control as intent commands;
* separating authoritative rule results from VFX/UI;
* keeping simulation configuration data-driven;
* avoiding direct input reads inside actors/weapons/vehicles;
* avoiding `Time.time` hidden inside rules by using an injected clock where tests need control;
* avoiding static singleton state as the only authority.

Do not add serialization for every event, network ownership, prediction, rollback, deterministic physics, lobbies, or transport. These would be speculative work.

## Work-Package and Handover Model

Each executable package should fit one coherent objective and end with:

* changed-file list;
* build/compile state;
* automated test result;
* scene or capture evidence where applicable;
* known limitations and next exact step;
* clean restart instructions;
* explicit statement of what was not authorised.

Separate package categories:

1. package/asset import and provenance;
2. code production and automated validation;
3. visible Play Mode feel/visual review;
4. performance capture;
5. documentation and gate decision.

Approximate high-cost blocks are traffic/intersections/pedestrians, combat-bot vehicle use, four-class vehicle feel, combined performance, and cross-package visual integration. All time estimates in related documents are rough, non-binding planning estimates.

## Architecture Stop Conditions

Stop and request a new Human Developer decision if:

* URP has a demonstrated blocker requiring pipeline replacement;
* a paid candidate is necessary to continue;
* a package requires an unapproved dependency, download, licence change, or broad project setting change;
* the separate repository path or large-asset storage model must be selected;
* an authorised vendor preflight demonstrates that integration would require rewriting project rules or premature generic infrastructure;
* prototype scope must change to meet a gate;
* networking work becomes necessary before Gate F;
* performance targets or the weaker hardware profile must become binding acceptance criteria.

## Related Documents

* [`TECHNICAL_DECISIONS.md`](TECHNICAL_DECISIONS.md)
* [`IMPLEMENTATION_SEQUENCE.md`](IMPLEMENTATION_SEQUENCE.md)
* [`TECHNICAL_RISK_REVIEW.md`](TECHNICAL_RISK_REVIEW.md)
* [`GDD/16_PROTOTYPE_SCOPE.md`](GDD/16_PROTOTYPE_SCOPE.md)
* [`PROTOTYPE_ROADMAP.md`](PROTOTYPE_ROADMAP.md)
* [`ASSET_PURCHASE_CANDIDATES.md`](ASSET_PURCHASE_CANDIDATES.md)
* [`ASSET_STYLE_PREFLIGHT_PLAN.md`](ASSET_STYLE_PREFLIGHT_PLAN.md)
