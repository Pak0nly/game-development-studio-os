# Crime99 Unity Asset Purchase Candidates

## Status and Boundary

**Research date:** 2026-07-14
**Store currency:** EUR from the signed-in Unity Asset Store
**Project phase:** Definition
**Authority:** Research and decision support only

The entries below are research findings, not purchase recommendations or purchase, download, import, installation, architecture, implementation, or main-prototype-use approvals. None of the non-owned assets in this document has been technically validated. No checkout, coupon, key redemption, cart, download, or import action was performed.

## Evidence Rules

- Product name, publisher, live price, discount, official page, version, release date, original Unity version, pipeline table and licence label come from official Unity Asset Store pages accessed on 2026-07-14.
- Publisher documentation is used for feature, dependency and Unity 6 statements when the store page does not expose enough detail.
- Work saved and integration effort are rough Crime99-specific planning estimates with low-to-medium confidence. They have not been validated through practical integration and are not suitable as budget or schedule commitments. Lock-in and prototype/release value are also Crime99-specific assessments, not publisher claims.
- User reviews and marketing claims are weaker evidence and are not used as proof of compatibility.
- The store advertised the final week of the Summer Sale, but the examined pages did not expose a reliable exact end timestamp. Sale end is therefore recorded as `Not published on product page`.

## Decision Stages and Required Order

The following stages are distinct and must not be collapsed:

1. **Research shortlist:** evidence-based research interest only; it does not recommend or authorise a purchase.
2. **Candidate for a limited preflight purchase decision:** may be proposed only after the separately authorised preflight of owned assets confirms the gap, provisional test render pipeline, and technical requirements. A separate Human Developer decision is required for any purchase and download.
3. **Technically validated:** requires a separately authorised purchase/download where necessary, isolated import, and bounded technical preflight against defined acceptance criteria. Purchase and download alone do not establish this status and do not authorise permanent use in the main prototype.
4. **Recommended for the main prototype:** may be considered only after technical validation and a separate adoption decision. A validated tool may instead be replaced, deferred, or rejected.

An official demo, trial, or other legal advance evaluation may precede purchase only when a reliable official source confirms that option. No such option is claimed for any candidate below under the evidence reviewed.

## Prioritised Research Shortlist

| Priority | Candidate | Gap | Live price on 2026-07-14 | Current research status |
|---:|---|---|---|---|
| 1 | Complete City Traffic & Pedestrian System | Traffic, intersections, vehicle AI, pedestrians, crossings, pooling | €89.70 / €179.41 (-50%) | **Research shortlist — leading potential future candidate after owned-asset preflight** |
| 2 | A* Pathfinding Project Pro | Combat-bot and general pedestrian navigation, local avoidance | €64.40 / €128.81 (-50%) | **Research shortlist — potential future candidate after owned-asset preflight** |
| 3 | Realistic Car Controller Pro | Arcade-capable vehicle controller for four classes | €46.00; no current discount shown | **Research shortlist — potential future primary candidate after owned-asset preflight** |
| 4 | See-through Shader | Building/camera occlusion | €45.99; no current discount shown | **Research shortlist — potential candidate after the provisional test pipeline is known** |
| 5 | GPU Instancer Pro | LOD/culling/instancing if stress test proves a rendering bottleneck | €58.88 / €117.77 (-50%) | **Deferred research lead — no purchase case without a measured bottleneck** |
| 6 | NWH Vehicle Physics 2 | Alternative vehicle controller | €27.60 / €55.20 (-50%) | **Fallback research lead — redundant unless the primary controller fails technical preflight** |
| 7 | Mobile Traffic System v3 | Standalone traffic | €110.41; no current discount shown | **Deferred as redundant** while the combined system is cheaper and also covers pedestrians |
| 8 | Mobile Pedestrian System | Standalone pedestrian population/navigation | €91.08; no current discount shown | **Deferred as redundant** while the combined system is cheaper and also covers traffic |
| 9 | RayFire for Unity — Obsolete | Runtime fracture/destruction | €174.81; no current discount shown | **Not recommended for a preflight purchase decision** |

## Candidate Assessments

### 1. Complete City Traffic & Pedestrian System

- **Publisher:** Gley
- **Official page:** [Complete City Traffic & Pedestrian System](https://assetstore.unity.com/packages/tools/behavior-ai/complete-city-traffic-pedestrian-system-285687)
- **Price:** €89.70 current; €179.41 regular; 50% discount; exact end not published on the product page.
- **Version activity:** 1.5.9, released 2026-07-09; very recent.
- **Official/store baseline:** original Unity 2022.3.62. Publisher documentation states Unity 2021.3 LTS or later and Unity 6 support; the store page does not expose a pipeline table.
- **Licence:** Standard Unity Asset Store EULA; Extension Asset.
- **Core functions:** integrated traffic and pedestrians, waypoint navigation, traffic lights, crossings, priority intersections, vehicle/pedestrian types, overtaking, grid-based population, pooling around the player, Burst/job-based processing, event/API overrides and complete source according to publisher documentation.
- **Dependencies:** Burst Compiler; publisher workflow uses its own waypoint/editor configuration. Exact package-version dependencies require preflight.
- **Documented limitations/risks:** waypoint-network authoring is a structural commitment; default pooling/spawn rules may conflict with Crime99 visibility, danger and class-target rules; default pedestrian behaviour does not equal Crime99 flee/return logic; traffic vehicles are not the player's four driveable vehicle controllers.
- **Owned overlap:** no owned traffic/crowd system. It overlaps only with possible A* use for pedestrian navigation and with separate Gley products.
- **Rough planning estimate — work saved:** approximately 4–8 weeks for traffic lanes, intersections, crossings, vehicle population, pedestrian circulation and baseline pooling, before Crime99-specific reactions.
- **Rough planning estimate — integration effort:** 1–3 weeks for a representative map plus custom Crime99 adapters; potentially more if the map geometry or vehicle controller conflicts.
- **Vendor/architecture dependence:** **High**. Road/pedestrian waypoints, pooling and APIs influence city architecture.
- **Prototype value:** **Very high** because it closes two major required gaps and includes the interaction between them.
- **Release value:** **High** if scalability and source quality pass; otherwise replacement cost is significant.
- **Research status:** **Leading research-shortlist entry.** After the owned-asset preflight confirms this gap and the technical requirements, it may be proposed for a separately authorised, limited preflight purchase. Only a subsequent isolated technical preflight could establish Unity 6.3 compatibility, map-authoring cost, fixed/rotatable camera behaviour, custom vehicle-controller integration, emergency/police routing, blocked-road recovery, visibility-based spawn control, and extensibility of flee/return behaviour. It is not technically validated or recommended for main-prototype use.

### 2. A* Pathfinding Project Pro

- **Publisher:** Aron Granberg
- **Official page:** [A* Pathfinding Project Pro](https://assetstore.unity.com/packages/tools/behavior-ai/a-pathfinding-project-pro-87744)
- **Price:** €64.40 current; €128.81 regular; 50% discount; exact end not published.
- **Version activity:** 5.4.6, released 2026-01-22; active.
- **Official/store baseline:** original Unity 2021.3.45. The store page does not provide an explicit Unity 6000 compatibility row or render-pipeline table.
- **Licence:** Standard Unity Asset Store EULA; Extension Asset.
- **Core functions:** grid/recast/navmesh-style graphs, pathfinding, movement helpers, local avoidance/RVO and steering-oriented navigation according to the official page keywords and publisher product scope.
- **Dependencies:** internal graph/navigation stack; exact package dependencies and Unity 6 requirements require publisher-document and preflight confirmation.
- **Documented limitations/risks:** it solves navigation, not Crime99 decision-making, combat, traffic rules, vehicle physics, police allocation or respawn logic.
- **Owned overlap:** no owned navigation library. It may overlap the combined Gley system for civilian pedestrians, but remains useful for combat bots and foot police.
- **Rough planning estimate — work saved:** 3–6 weeks for robust graph building, paths, agents, avoidance and debugging tools.
- **Rough planning estimate — integration effort:** 1–3 weeks for basic combat bots and foot police; substantially more for complete FFA behaviour.
- **Vendor/architecture dependence:** **High** because AI movement code and graph authoring will depend on its API.
- **Prototype value:** **High** for solo-testable bots and foot police.
- **Release value:** **High** if adopted behind a project-owned navigation abstraction.
- **Research status:** **Research-shortlist entry.** If the owned-asset preflight confirms the navigation gap, it may be proposed for a separately authorised, limited preflight purchase. A subsequent isolated technical preflight should use a small multi-block scene and evaluate a project-owned adapter boundary. It is not the vehicle-traffic solution, technically validated, or recommended for main-prototype use.

### 3. Realistic Car Controller Pro

- **Publisher:** BoneCracker Games
- **Official page:** [Realistic Car Controller Pro](https://assetstore.unity.com/packages/tools/physics/realistic-car-controller-pro-178967)
- **Price:** €46.00 on the live signed-in page; no active product-level discount shown. A public cached page showed older €23/-50% data and an older version, so it is not used as current price evidence.
- **Version activity:** 2.57.0.LTS, released 2026-07-10; extremely recent.
- **Official/store baseline:** original Unity 6000.0.49; official table lists Built-in, URP and HDRP compatible for that Unity version.
- **Licence:** Standard Unity Asset Store EULA; Extension Asset.
- **Core functions:** modular engine, clutch, gearbox, differential, axles, wheels and configurable vehicle physics; publisher positions it for both arcade and realistic tuning.
- **Dependencies:** controller-specific components and project settings; exact Input System, Cinemachine, demo-asset and package dependencies require preflight.
- **Documented limitations/risks:** Crime99 needs disposable arcade vehicles, not a driving simulator. Theft, exit-at-speed damage, bot interfaces, burning/explosion state and chain reactions remain project code.
- **Owned overlap:** no owned road-vehicle controller.
- **Rough planning estimate — work saved:** 3–6 weeks of wheel, suspension, drivetrain, surface, setup and tuning infrastructure.
- **Rough planning estimate — integration effort:** 1–3 weeks for the four prototype classes and project adapter, excluding theft/damage/AI.
- **Vendor/architecture dependence:** **High** because vehicle state and bot driving will interface with its components.
- **Prototype value:** **Very high** if responsive arcade tuning is achievable.
- **Release value:** **High** if stable under many simultaneous traffic/player/bot vehicles.
- **Research status:** **Potential primary research-shortlist entry for the vehicle-controller gap.** If the owned-asset preflight confirms requirements and a separate limited purchase is approved, a subsequent isolated technical preflight should evaluate compact/saloon/van/refuse-truck differentiation, fast arcade response, stable collisions/roadkills, fixed-camera readability, an AI input interface, traffic-system coexistence, and ten-vehicle chain-reaction stability. It is not technically validated or recommended for main-prototype use.

### 4. See-through Shader

- **Publisher:** Shadercrew
- **Official page:** [See-through Shader](https://assetstore.unity.com/packages/tools/particles-effects/see-through-shader-193955)
- **Price:** €45.99; no discount shown.
- **Version activity:** 1.9.1, released 2026-04-27; active.
- **Official/store baseline:** original Unity 2021.3.45; Built-in/URP/HDRP compatible for 2021.3.45. Publisher site describes Built-in and URP support; explicit Unity 6.3 proof is absent.
- **Licence:** Standard Unity Asset Store EULA; Extension Asset.
- **Core functions:** see-through/fade/dissolve treatment for walls, buildings and obstacles so the player remains visible; directly matches top-down/elevated-camera occlusion.
- **Dependencies:** material/shader integration; MicroSplat requires a separate integration add-on. Exact SRP and custom-shader constraints require preflight.
- **Documented limitations/risks:** replacing or modifying many third-party materials may increase style and maintenance cost; HDRP support evidence should be reconciled between store and publisher documentation; transparent rendering can affect sorting/performance.
- **Owned overlap:** none.
- **Rough planning estimate — work saved:** 1–3 weeks for a polished, configurable multi-obstacle solution and editor tooling.
- **Rough planning estimate — integration effort:** 2–5 days for a representative building set, more if bundle shaders are unusual.
- **Vendor/architecture dependence:** **Medium-low** if wrapped behind a simple occlusion interface and applied only to selected materials.
- **Prototype value:** **High**, because the fixed first-prototype camera explicitly requires occlusion validation and the solution should preserve a later rotatable comparison.
- **Release value:** **High** if material compatibility and performance pass.
- **Research status:** **Research-shortlist entry.** After the owned-asset preflight establishes the provisional test render pipeline and representative environment materials, this may be proposed for a separately authorised, limited preflight purchase. Only a subsequent isolated technical preflight could establish material compatibility, visual suitability, and performance. It is not technically validated or recommended for main-prototype use.

### 5. GPU Instancer Pro

- **Publisher:** GurBu Technologies
- **Official page:** [GPU Instancer Pro](https://assetstore.unity.com/packages/tools/utilities/gpu-instancer-pro-290293)
- **Price:** €58.88 current; €117.77 regular; 50% discount; exact end not published.
- **Version activity:** 0.12.16, released 2026-05-24; active.
- **Official/store baseline:** original Unity 2022.3.32; store lists Built-in/URP/HDRP compatible for that version. Publisher technical information explicitly lists Unity 6000.3 LTS support.
- **Licence:** Standard Unity Asset Store EULA; Extension Asset.
- **Core functions:** GPU instancing, distance/frustum/occlusion culling, GPU LOD calculation, terrain/detail/tree/prefab modules, runtime add/remove and statistics.
- **Dependencies:** Burst, Collections and Mathematics packages; compute shaders and compatible target GPU.
- **Documented limitations:** no lightmaps for instances, no HDRP ray tracing, no WebGL, no negative scaling, transparency sorting limits, and other GPU-instancing constraints listed on the official page.
- **Owned overlap:** environment packages may include their own LODs; no owned general instancing tool.
- **Rough planning estimate — work saved:** 2–5 weeks if large repeated-prop rendering is a demonstrated bottleneck.
- **Rough planning estimate — integration effort:** 3–10 days for selected prefab classes plus shader/material validation.
- **Vendor/architecture dependence:** **Medium**; rendering and runtime spawn paths become coupled to its managers/API.
- **Prototype value:** **Conditional**. It does not improve gameplay and may be unnecessary for a small map.
- **Release value:** **High** if measurements show repeated-object draw-call or culling limits.
- **Research status:** **Deferred research lead.** It should not be proposed for a limited preflight purchase unless the owned-asset preflight or a later authorised stress test measures a relevant Gate F bottleneck. It is not technically validated or recommended for main-prototype use; the sale alone is not justification.

### 6. NWH Vehicle Physics 2

- **Publisher:** NWH Coding
- **Official page:** [NWH Vehicle Physics 2](https://assetstore.unity.com/packages/tools/physics/nwh-vehicle-physics-2-166252)
- **Price:** €27.60 current; €55.20 regular; 50% discount; exact end not published.
- **Version activity:** 13.6, released 2025-06-05.
- **Official/store baseline:** original Unity 2022.3.20; Built-in/URP/HDRP compatible for that version. Current publisher import guide requires Unity 6000.0.40 or later and URP.
- **Licence:** Standard Unity Asset Store EULA; Extension Asset.
- **Core functions:** detailed modular vehicle simulation, setup wizard, powertrain, wheel controller, runtime tuning and modules.
- **Dependencies:** current guide lists URP, Input System, Burst, `com.nwh.common`, `com.nwh.wheelcontroller` and 64-bit targets.
- **Documented limitations/risks:** current dependency stack is larger and URP-specific; the product is simulation-oriented; potential mismatch with pipeline neutrality and Crime99's arcade focus.
- **Owned overlap:** fully overlaps the RCCP role; only one vehicle foundation should be selected.
- **Rough planning estimate — work saved:** similar 3–6 weeks if selected.
- **Rough planning estimate — integration effort:** 1–3 weeks plus dependency/pipeline setup.
- **Vendor/architecture dependence:** **High**.
- **Prototype value:** **High** in isolation, but not additive to RCCP.
- **Release value:** **High** for physics depth, uncertain for the intended arcade tone.
- **Research status:** **Fallback research lead.** It remains redundant unless a separately purchased primary controller fails technical preflight. Only then could NWH be considered for its own separately authorised limited preflight purchase; do not buy both together because they solve the same foundation. It is not technically validated or recommended for main-prototype use.

### 7. Mobile Traffic System v3

- **Publisher:** Gley
- **Official page:** [Mobile Traffic System v3](https://assetstore.unity.com/packages/tools/behavior-ai/mobile-traffic-system-v3-305800)
- **Price:** €110.41; no current discount shown.
- **Version activity:** 3.6.3, released 2026-07-09.
- **Official/store baseline:** original Unity 2022.3.62; publisher documentation requires Burst and states Unity 6 support.
- **Licence:** Standard Unity Asset Store EULA; Extension Asset.
- **Functions:** waypoint traffic, traffic lights/intersections, vehicle population, pooling, player interaction and Burst-backed processing.
- **Dependencies/risk:** Burst and Gley waypoint/traffic architecture; same traffic subsystem included in the combined candidate.
- **Rough planning estimates — work saved / integration:** approximately 3–6 weeks saved; 1–3 weeks integration.
- **Prototype/release value:** high only if a separate pedestrian approach is deliberately chosen.
- **Research status:** **Deferred as redundant** while the combined City Traffic & Pedestrian product costs less and closes both gaps. Reconsider as a research lead only after price changes or if a later decision intentionally rejects pedestrian integration. It is not technically validated or recommended for main-prototype use.

### 8. Mobile Pedestrian System

- **Publisher:** Gley
- **Official page:** [Mobile Pedestrian System](https://assetstore.unity.com/packages/tools/behavior-ai/mobile-pedestrian-system-203706)
- **Price:** €91.08; no current discount shown.
- **Version activity:** 1.5.8, released 2026-07-09.
- **Official/store baseline:** original Unity 2022.3.62; publisher documentation states waypoint navigation, grid processing, pooling, root-motion humanoids, crossings, traffic-light support, obstacle avoidance and custom behaviours.
- **Licence:** Standard Unity Asset Store EULA; Extension Asset.
- **Dependencies/risk:** animator/root motion, Gley waypoint architecture and custom adaptation for flee/return behaviour.
- **Rough planning estimates — work saved / integration:** approximately 2–4 weeks saved; 1–2 weeks integration before Crime99 behaviour work.
- **Prototype/release value:** high in isolation, but it is included in the combined system.
- **Research status:** **Deferred as redundant** while the combined system costs less. It becomes a research lead only if a later decision deliberately uses a different traffic solution. It is not technically validated or recommended for main-prototype use.

### 9. RayFire for Unity — Obsolete

- **Publisher:** RayFire Studios
- **Official page:** [RayFire for Unity — Obsolete](https://assetstore.unity.com/packages/tools/game-toolkits/rayfire-for-unity-obsolete-148690)
- **Price:** €174.81; no current discount shown.
- **Version activity:** 1.89, released 2025-10-14.
- **Official/store baseline:** original Unity 2021.3.45; Built-in/URP/HDRP compatible for 2021.3.45. Publisher site claims Unity 6 support, but the store product is explicitly titled `Obsolete`.
- **Licence:** Standard Unity Asset Store EULA; Extension Asset.
- **Functions:** runtime/editor fragmentation, demolition, clusters, debris and destruction simulation.
- **Dependencies/risks:** major physics, fragment, debris, pooling and performance complexity; expensive; obsolete listing; far beyond the limited prototype requirement.
- **Owned overlap:** environment packs supply street-object meshes; no destruction system, but one is not needed at this scale.
- **Rough planning estimate — work saved:** potentially high for full destruction, but only days for the limited breakable-prop scope actually required.
- **Rough planning estimate — integration effort:** high, including fracture preparation and stress testing.
- **Vendor/architecture dependence:** **High**.
- **Prototype value:** **Low** because building and persistent destruction are excluded.
- **Release value:** deferred and unproven.
- **Research status:** **Not recommended for a limited preflight purchase decision.** The obsolete listing, excessive scope, cost, and physics risk outweigh the prototype value. A simple break-state/mesh-swap/prefab-debris approach remains a research direction, not an implementation or architecture approval.

## Candidates Explicitly Rejected or Deferred

| Area / candidate type | Decision | Reason |
|---|---|---|
| Generic object-pooling assets | **Not Recommended** | Unity built-in pooling plus Crime99-specific population/visibility rules is smaller and less coupled. |
| Feature-heavy minimap frameworks | **Not Recommended** | Prototype minimap is rudimentary; broad frameworks add UI/render-camera cost and architecture. |
| New general fire/explosion VFX packs | **Redundant** | Owned POLYGON Particle FX Pack must be preflighted first. |
| Vehicle deformation/damage frameworks | **Useful but Not Needed Yet** | Required damage is state-based; validate the vehicle-controller direction first. A small project-owned state layer remains a research direction, not an architecture or implementation approval. |
| Broad NPC/combat frameworks | **Too Risky** | Crime99 bots have unusual FFA, vehicle, pickup, police and respawn rules; a full framework would dictate architecture without removing custom behaviour. |
| Cyberpunk Gigapack or another city megapack | **Redundant** | Existing environment inventory is already broad; current gaps are systems, vehicles, characters, weapons and audio. |

## Required Decision Sequence

1. Perform the separately authorised bounded preflight of owned assets first. This must establish actual coverage gaps, the provisional test render pipeline, representative materials, and technical requirements.
2. Reassess the research shortlist against those findings. Selected non-owned tools may then be proposed as candidates for a limited, separately authorised preflight purchase decision; this document does not itself authorise that purchase.
3. If a limited purchase and download are authorised, use the acquired tool only in a separately authorised isolated technical preflight. Purchase and download do not authorise permanent main-prototype use.
4. Evaluate **Complete City Traffic & Pedestrian System** only after such approval, using a tiny representative road/intersection/pedestrian layout.
5. Evaluate **A* Pathfinding Project Pro** only after such approval, using one combat bot and one foot-police route behind a project-owned adapter boundary.
6. Evaluate **Realistic Car Controller Pro** only after such approval as the primary controller candidate. Consider a separate NWH preflight-purchase proposal only if RCCP fails defined gates.
7. Evaluate **See-through Shader** only after such approval and after the provisional test pipeline and representative materials are known.
8. Keep GPU Instancer Pro deferred until an authorised stress test measures a relevant bottleneck. Do not propose RayFire, the standalone Gley sub-products, a generic pool, a broad minimap, or new general VFX for purchase under the current evidence.
9. After each technical preflight, make a separate decision to recommend the tool for the main prototype, replace it, defer it, or reject it. No candidate in this document has reached the technically validated or main-prototype-recommended stage.

## Source Register

Official sources accessed 2026-07-14:

- Every official product page linked above.
- [Gley Urban System](https://gleygames.com/urban-system/).
- [Gley Mobile Traffic System documentation](https://gley.gitbook.io/mobile-traffic-system/quick-start).
- [Gley Mobile Pedestrian System documentation](https://gley.gitbook.io/mobile-pedestrian-system/setup-guide/overview).
- [NWH Vehicle Physics 2 documentation](https://nwhcoding.com/VehiclePhysics/).
- [NWH current import requirements](https://nwhcoding.com/VehiclePhysics/manual/Importing.html).
- [Shadercrew](https://www.shadercrew.com/).
- [RayFire Studios](https://rayfirestudios.com/products/rayfire-for-unity/).
- [`ASSET_INVENTORY.md`](ASSET_INVENTORY.md) and [`ASSET_GAP_ANALYSIS.md`](ASSET_GAP_ANALYSIS.md).

No purchase, download, import, installation, project creation, architecture choice, implementation, staging, commit, or push is authorised by this document.
