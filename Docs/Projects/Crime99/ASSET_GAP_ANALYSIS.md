# Crime99 Asset Coverage and Gap Analysis

## Status and Boundary

**Research date:** 2026-07-14
**Inventory basis:** 37 visible owned Unity assets documented in [`ASSET_INVENTORY.md`](ASSET_INVENTORY.md)
**Project phase:** Definition
**Authority:** Research and decision support only

This analysis estimates likely prototype coverage without downloading or importing any package. `Covered` never means approved for use. All technical usability remains subject to a separately authorised Asset and Style Preflight.

## Classification

- `Covered`: the owned inventory clearly contains the required asset or system type, although technical acceptance may still be required.
- `Probably Covered`: official descriptions strongly suggest sufficient raw material, but package contents or project fit remain unverified.
- `Partially Covered`: some visual or technical ingredients exist, but a material part of the requirement is missing.
- `Not Covered`: no owned asset visibly supplies the requirement.
- `Unknown Until Preflight`: the category exists, but technical or quantitative sufficiency cannot be established without import/testing.

## Coverage Matrix

| Prototype requirement | Coverage | Owned evidence | Missing or uncertain element | Consequence |
|---|---|---|---|---|
| City architecture | **Probably Covered** | 1950s NYC, Cyberpunk Port City, Mid-Century Data Centre, Victorian Market, Military Base and several secondary environment packs | Unity 6 behaviour, modularity, consistent scale, elevated-camera readability, LODs, collisions and visual cohesion | Do not buy another city megapack before bounded preflight |
| Roads and sidewalks | **Partially Covered** | 1950s NYC, Cyberpunk Port City and Medieval Village officially include or imply streets/roads | Correct lane widths, sidewalks, top-to-bottom main-road layout, intersections, traffic paths, wet-asphalt material and vertical-road element are unverified | Likely reuse geometry, but expect project-specific layout/material work |
| Harbour, industry and storage yards | **Probably Covered** | Cyberpunk Port City, Victorian Market/Factory, Military Base, Mid-Century Data Centre | Exact harbour props, warehouses, containers, scrapyard openness, access routes and performance need preflight | High-value bundle strength; no new industrial pack justified yet |
| Interiors and landmark commercial locations | **Probably Covered** | 1950s NYC interiors, Fuyoh Diner, Yellow Parrot Restaurant, Boxing Club, Victorian Market | First prototype buildings are non-enterable; exterior readability and landmark value matter more than interior completeness | Select one diner/restaurant source; avoid duplicate imports |
| Vehicles | **Not Covered** | No owned package is a clear compact car, saloon, van and refuse-truck art set | Four readable classes, wheels, damage/burning/exploded states and police vehicle are missing | Major visual acquisition/production gap after preflight |
| Characters and animations | **Partially Covered** | 1950s NYC claims characters; Starter Assets provides a current character-controller sample; Banana Man, Mr. Mo and legacy samples exist | Cohesive player/bot/civilian/police cast, independent aiming, required locomotion/combat/vehicle animations and shared rig remain unproven | Character-source decision required; owned placeholders may support isolated tests only |
| Weapons | **Not Covered** | No visible pistol, shotgun and rocket-launcher art/system package | Models, animations, muzzle/impact setup and pickup/drop presentation | Small targeted asset or original production need; no current candidate recommended without style review |
| Pedestrians and crowd population | **Not Covered** | Character raw material does not provide population logic | Density control, flee/return behaviour, traffic interaction, visibility-based spawning and simplification | High-value system gap |
| Combat bots | **Partially Covered** | Starter Assets can supply controller reference; character raw material exists | FFA target selection, weapons, pickups, vehicles, burning-vehicle exit, police interaction, respawn and fair human/bot rules | Navigation/tooling may help, but Crime99-specific combat logic remains custom |
| Pedestrian navigation | **Not Covered** | No owned civilian waypoint/nav/crowd system | Sidewalk routing, crossings, obstacle avoidance, flee paths, recovery and scale | High-priority tooling gap |
| Vehicle navigation and traffic | **Not Covered** | No owned traffic, lane, intersection or vehicle-steering system | Traffic lights, crossings, intersections, rerouting, blockage recovery, despawn/replacement and multi-level roads | Highest system gap alongside vehicle controller |
| Police | **Not Covered** | Military/environment props are not a police system | Foot police, patrol cars, finite global cap, crime events, wanted pressure, pursuit of players and bots | Crime99-specific behaviour remains necessary even if a navigation tool is later technically validated and adopted |
| Vehicle controller | **Not Covered** | No owned drivable road-vehicle controller | Arcade handling, four mass classes, theft/exit/entry, bot driving interface and fixed-camera compatibility | Major research area; after owned-asset preflight, a tool may become a candidate for a separately authorised limited preflight purchase decision |
| Vehicle damage and explosion logic | **Partially Covered** | POLYGON FX likely supplies visible fire/explosion effects | Damage states, burn timer, chain propagation, attribution, wreck lifecycle and ten-vehicle stability are absent | Prefer a small project-owned state model unless controller preflight reveals a compatible damage module |
| Destructible street objects | **Partially Covered** | Multiple environment packs likely contain traffic lights, signs, barriers and props | Impact response, break states, debris lifetime, pooling and performance are absent | A bounded simple break/swap system is likely cheaper than a full destruction framework |
| Fire, smoke, sparks and explosion VFX | **Probably Covered** | POLYGON Particle FX Pack is current, owned, and explicitly a particle FX collection; account notes mention smoke fixes and recent shader-graph update | Exact fire/vehicle explosion/sparks catalogue, Unity 6, pipeline, overdraw, colour and elevated-camera readability need preflight | Do not buy another general VFX pack yet |
| Building visibility and camera occlusion | **Not Covered** | None of the owned tools is an occlusion/fade solution | Fixed/rotatable camera compatibility, multi-building handling, shader/material compatibility and performance | Focused research area; a tool may become a limited preflight-purchase candidate only after the owned-asset render-pipeline preflight |
| Minimap and HUD | **Not Covered** | Legacy text animation does not provide a minimap or required HUD | Roads, player/threat icons, wanted state, score, weapon slots, health/armour/stamina and vehicle state | Prototype scope is rudimentary; custom implementation likely lower risk than a framework purchase |
| Spawn, pooling and respawn support | **Not Covered** | No owned general-purpose runtime population/spawn system | Weighted safe clinic respawn, item slots, vehicle population targets, off-screen replacement and object pools | Use Unity built-in pooling plus Crime99-specific managers unless another selected system already supplies bounded pooling |
| Audio | **Not Covered** | No visible owned audio package | Engines for four classes, weapons, impacts, explosions, burning, police, ambience and one music track | Major content gap but lower than core feel; research separately after visual/system preflight |
| Material and style harmonisation | **Partially Covered** | Strong visual raw material plus Outdoor Ground Textures and AllSky Free | Shared scale, roughness, wet asphalt, dirt treatment, palette, emissive rules, shader conversion and detail density | This is a Style Slice task, not solved by another asset purchase |
| LODs and performance tools | **Unknown Until Preflight** | Some environments may include LODs; MapMagic is active but not relevant to city rendering | Per-package LOD coverage, batching, instancing, culling, texture cost, shader variants, overdraw and CPU cost are unknown | Measure first; performance-tool purchase is premature |

## Coverage Summary

The account is strongest in **environment art**. It probably covers enough raw material for the small urban map, harbour/industrial area, warehouses, landmarks, and neon-commercial dressing. It also likely covers the first-pass **fire/smoke/explosion visual layer** through the owned POLYGON Particle FX Pack.

The account is weak in **gameplay systems and core moving assets**. No owned item visibly covers the four required vehicle classes, traffic, intersections, pedestrian population, bot navigation, arcade vehicle handling, police logic, minimap, Crime99-specific spawning, or audio.

The practical distinction is important:

- Existing environment packs may save large amounts of art production.
- They do not reduce the central architecture and gameplay risks of navigation, traffic, vehicle handling, damage, bots, police and population lifecycle.
- Buying another broad city pack would add overlap, not solve the main prototype gaps.

## Priority Gap Register

| Priority | Gap | Why it matters now | Recommended research posture |
|---:|---|---|---|
| 1 | Traffic, intersections and vehicle navigation | Required for the reactive city, civilian traffic, blockage recovery and police approach; substantial custom work is likely | Research one bounded traffic/population system, not multiple overlapping frameworks; propose a limited preflight purchase only after the owned-asset preflight confirms the gap |
| 2 | Vehicle controller | Central design pillar; must support arcade feel, four mass classes, stealing, bot driving and collisions | After owned-asset preflight, consider one primary controller for a separately authorised limited preflight purchase; consider a fallback only if the primary fails technical preflight |
| 3 | Pedestrian navigation/population | Required for civilians, flee/return behaviour, density and city life | Prefer a system that integrates with the selected traffic approach or a common navigation layer |
| 4 | Combat-bot navigation | Required for complete solo testing | A reusable navigation library may save time, but FFA behaviour remains custom |
| 5 | Vehicle art and damage states | Four distinct classes and readable damage/burning/exploded states are absent | Research targeted vehicle art after environment/style preflight establishes proportions |
| 6 | Camera occlusion | Both confirmed camera variants may be blocked by buildings | A small render-pipeline-compatible fade/see-through tool is a focused candidate |
| 7 | Audio | Required for impact and readability | Separate later content search; do not let broad audio bundles distract from core systems |
| 8 | Performance/LOD | Stress test includes bots, pedestrians, traffic, police, fire, explosions and minimap | Measure the bounded prototype first; only then consider proposing a separately authorised limited preflight purchase against a demonstrated bottleneck |

## No-Purchase-by-Default Areas

### Object Pooling

Unity provides built-in object-pool primitives, while Crime99 requires project-specific rules for safe respawn, visibility-aware replacement, clinic weighting, vehicle-class targets and attribution. A generic paid pool would not remove that domain logic. No standalone pooling purchase is recommended now.

### Minimap

The prototype minimap is intentionally rudimentary: player, basic roads, boundary, clinics and selected threats. A lightweight project-owned implementation is likely cheaper and less coupled than a feature-heavy minimap framework. Reassess only if map baking or large-world requirements expand.

### Vehicle Damage

The required first-prototype damage model is state-driven rather than deformation-driven: damaged, heavily damaged, burning and exploded, with chain propagation. A small project-owned state model is likely safer than a specialist deformation/damage framework. Reassess only after the vehicle-controller choice exposes a proven compatible module.

### Destruction

Building destruction and persistent destruction are explicitly excluded. The prototype needs only a limited set of street objects. Mesh swapping, rigidbody activation and pooled debris are likely sufficient; a full runtime-fracture framework would add cost and physics risk.

### General VFX

The owned POLYGON Particle FX Pack must be preflighted before any fire/explosion purchase. A new pack without disproven coverage would be redundant.

## Minimum Bounded Asset and Style Preflight Selection

This is a research recommendation only and does not authorise download, import, project creation or testing.

1. 1950s NYC: one building module, one street/sidewalk segment, one prop set, one character if present.
2. Cyberpunk Port City: one warehouse/industrial module, one road/service-area segment, one neon/industrial prop set.
3. Fuyoh Cyberpunk Diner: exterior shell, sign/lighting elements, and a small prop subset.
4. POLYGON Particle FX: one fire, one smoke, one spark/impact and one explosion effect.
5. Optional comparison only if needed: Yellow Parrot exterior versus Fuyoh exterior.

This smallest representative selection can answer pipeline, shader, scale, camera, cohesion, LOD, collision and performance questions without importing entire multi-gigabyte packs.

## Sources

Accessed 2026-07-14:

- [`ASSET_INVENTORY.md`](ASSET_INVENTORY.md) and its linked official Unity Asset Store pages.
- [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md).
- [`PROTOTYPE_ROADMAP.md`](PROTOTYPE_ROADMAP.md).
- [`GDD/04_PLAYER_MOVEMENT_AND_COMBAT.md`](GDD/04_PLAYER_MOVEMENT_AND_COMBAT.md).
- [`GDD/05_VEHICLES.md`](GDD/05_VEHICLES.md).
- [`GDD/06_WORLD_AND_CITY.md`](GDD/06_WORLD_AND_CITY.md).
- [`GDD/07_AI_NPCS_AND_TRAFFIC.md`](GDD/07_AI_NPCS_AND_TRAFFIC.md).
- [`GDD/08_POLICE_AND_ESCALATION.md`](GDD/08_POLICE_AND_ESCALATION.md).
- [`GDD/12_ART_DIRECTION.md`](GDD/12_ART_DIRECTION.md).
- [`GDD/13_CAMERA_AND_UI.md`](GDD/13_CAMERA_AND_UI.md).
- [`GDD/14_AUDIO.md`](GDD/14_AUDIO.md).
- [`GDD/16_PROTOTYPE_SCOPE.md`](GDD/16_PROTOTYPE_SCOPE.md).
