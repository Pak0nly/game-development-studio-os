# Unity Native Capability Atlas

**Capability ID:** `C99-CAP-UNITY-NATIVE-ATLAS-001`  
**Type:** Installed Unity engine, official packages, built-in modules and Editor tooling  
**Owner:** Crime99 technical capability knowledge  
**Last verified:** 2026-08-22  
**Current disposition:** `DECISION ROUTING BASELINE / EXACT USE STILL EVIDENCE-GATED`

## Purpose and Completeness Boundary

This atlas prevents Unity-native capabilities from being overlooked in favour
of unnecessary custom code or third-party dependencies. It is complete at the
decision-relevant capability-cluster level for the current Unity `6000.3.19f1`
project. It is not a copy of every Unity API member, menu item or Inspector
property.

Before bespoke implementation or a new asset/package is proposed, search the
problem-routing matrix below. Open the narrower specialist record where one is
linked. A listed capability is an available option, not automatic evidence of
runtime success, visual fit or adoption.

## Identity and Availability

- Unity Editor: `6000.3.19f1` (`7689f4515d75`).
- Render pipeline: URP and Shader Graph `17.3.0`.
- Package closure: 39 locked packages: 29 direct and 10 transitive.
- Direct official registry/built-in packages: Burst `1.8.29`, Collections
  `2.6.6`, Editor Coroutines `1.1.0`, Visual Studio integration `2.0.26`, Input
  System `1.19.0`, ProBuilder `6.1.2`, URP/Shader Graph `17.3.0`, Splines `2.9.0`,
  Test Framework `1.6.0` and uGUI `2.0.0`.
- Direct built-in modules: 18, individually classified below.
- Exact sources: `Packages/manifest.json`, `Packages/packages-lock.json`,
  `ProjectSettings/ProjectVersion.txt`, `Assets/Settings/` and local source use.
- Official reference boundary: [Unity 6 Manual](https://docs.unity3d.com/6000.0/Documentation/Manual/index.html)
  and [Unity 6 Scripting API](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/index.html).

## Installed Official Package Map

| Package or package group | Local state | Main native uses | Selection boundary |
|---|---|---|---|
| `com.unity.render-pipelines.universal` `17.3.0` and Render Pipeline Core | `LOCALLY PRESENT` | Forward rendering, renderer assets/features, lights, shadows, post-processing, decals where configured, render passes and Render Graph diagnostics | The current PC renderer has no serialized Decal Renderer Feature; do not assume every URP feature is configured |
| `com.unity.shadergraph` `17.3.0` and Searcher | `LOCALLY PRESENT` | Project-owned URP shaders, layered materials and visual shader authoring | Shader availability does not repair geometry, UVs or topology |
| `com.unity.inputsystem` `1.19.0` | `LOCALLY PRESENT` | Actions, action maps, devices, rebinding, control schemes and input testing | Confirm the current project action assets and architecture before creating another input layer |
| `com.unity.probuilder` `6.1.2` | `LOCALLY PRESENT` | In-editor blockout, mesh editing, UVs, faces, collision shells and bounded hard-edge adapters | Not a substitute for a coherent native road or production building kit |
| `com.unity.splines` `2.9.0` | `LOCALLY PRESENT` | Paths, curves, interpolation, extrusion drivers and placement along routes | Prefer for bounded path-driven geometry; do not create a competing city graph casually |
| `com.unity.burst` `1.8.29`, `com.unity.collections` `2.6.6`, Mathematics `1.3.3` | `LOCALLY PRESENT` | Data-oriented calculations, native containers, jobs and high-throughput geometry/data work | Use only where workload and lifetime ownership justify added complexity |
| `com.unity.editorcoroutines` `1.1.0` | `LOCALLY PRESENT` | Multi-frame Editor automation without blocking the Editor | Do not use to disguise uncontrolled retries or ambiguous task state |
| `com.unity.test-framework` `1.6.0`, Performance Test Framework `3.5.0`, NUnit extension | `LOCALLY PRESENT` | EditMode, PlayMode and performance tests | Tests prove their assertions, not overall visual quality |
| `com.unity.ugui` `2.0.0`, UI Toolkit core modules and TextMesh Pro assets | `LOCALLY PRESENT` | Runtime HUD/menus, Editor UI, retained-mode UXML/USS, conventional Canvas UI and text | Select one UI approach per surface; avoid duplicate UI architectures |
| `com.unity.ide.visualstudio` `2.0.26` | `LOCALLY PRESENT` | IDE project generation and debugging integration | Development support only; not a runtime capability |

## Direct Built-In Module Map

| Built-in module | Main native capability | Current Crime99 evidence / boundary |
|---|---|---|
| `com.unity.modules.accessibility` | Accessibility settings and assistive runtime hooks | Present; exact Crime99 accessibility design remains `UNKNOWN` |
| `com.unity.modules.ai` | `NavMesh`, `NavMeshAgent`, path queries and area masks | Locally used by Gate-D bot/police code and PlayMode tests; the separate AI Navigation package and `NavMeshSurface` workflow are not installed/proven |
| `com.unity.modules.animation` | Animation clips, Animator/animation playback and rig runtime | Present; no material project-owned Animator use found in the current C# scan |
| `com.unity.modules.audio` | Audio clips, sources, listeners, mixers and spatial audio basics | Local `AudioSource` use exists; final audio architecture remains unproven |
| `com.unity.modules.cloth` | Cloth simulation components | Present; no current Crime99 need or use established |
| `com.unity.modules.director` | Playables and `PlayableDirector` runtime substrate | Present; the separate Timeline package is not a direct dependency and no current C# use was found |
| `com.unity.modules.imageconversion` | Texture/image encoding and decoding APIs | Present; useful for deterministic evidence/export tooling |
| `com.unity.modules.imgui` | Immediate-mode Editor/debug UI | Present; useful for small diagnostic inspectors/windows, not preferred for substantial new runtime UI |
| `com.unity.modules.jsonserialize` | `JsonUtility` serialization | Present; suitable for simple deterministic records, not arbitrary schema-rich persistence |
| `com.unity.modules.particlesystem` | Built-in Particle System authoring and runtime | Project-owned Gate-C feedback/damage code and vendor pooling use it locally |
| `com.unity.modules.physics` | 3D colliders, rigidbodies, joints, ray/shape queries and transform synchronization | Extensively used by project diagnostics and candidate validation; technical contact is not visual fit |
| `com.unity.modules.screencapture` | Screenshot capture API | Locally used by evidence builders; capture creation is not direct visual inspection |
| `com.unity.modules.terrain` | TerrainData, TerrainLayers, height/texture/detail/tree systems | Detailed [Terrain/Hybrid record](C99-CAP-UNITY-TERRAIN-HYBRID-001.md) |
| `com.unity.modules.terrainphysics` | Terrain colliders and physical terrain contact | Present; exact consumer collision still requires representative proof |
| `com.unity.modules.ui` | Core runtime UI/EventSystem support | Present; pair with uGUI or UI Toolkit intentionally |
| `com.unity.modules.uielements` | UI Toolkit runtime and Editor UI substrate | Widely referenced locally by Editor tooling; use UXML/USS or C# deliberately |
| `com.unity.modules.vehicles` | WheelCollider-based vehicle physics substrate | Present; RCCP is the accepted higher-level vehicle basis, so do not build a second stack without a proven gap |
| `com.unity.modules.video` | VideoPlayer and video playback | Present; no current Crime99 production need established |

## Core Engine and Editor Capability Map

These capabilities are part of the Unity Editor/core engine and are not all
represented by separate manifest rows.

| Capability cluster | Useful native tools and APIs | Use before building or buying | Important boundary |
|---|---|---|---|
| Scene and hierarchy authoring | GameObjects, Components, transforms, layers, tags, additive scenes, `SceneManager`, `EditorSceneManager` | Scene assembly, district loading, hierarchy generation and deterministic setup | Scene mutation requires exact task authority and save-path ownership |
| Prefabs and assets | Prefab Mode, variants, `PrefabUtility`, `AssetDatabase`, importers, `ScriptableObject`, Presets | Reusable variants, non-destructive vendor adaptation, generated assets and metadata queries | Prefer project-owned variants; avoid editing protected source or overwriting unknown assets |
| Editor automation | `MenuItem`, custom inspectors, `EditorWindow`, SerializedObject, Editor Coroutines, batch entry points | Repetitive setup, validators, evidence writers and reproducible builders | Add automation only when reuse/reliability outweighs maintenance debt |
| Safe interactive authoring | `Undo`, Selection, Handles, Gizmos, SceneView overlays | Human-correctable placement, visual handles and bounded editing tools | Do not omit Undo for interactive destructive tools; Gizmos are diagnostic, not player evidence |
| Mesh and geometry | Mesh API, MeshData, CombineMeshes, normals/tangents/bounds, colliders, ProBuilder, Splines | Procedural or bounded custom geometry after native/package options are checked | Validate topology and collision; generated mesh existence is not visual acceptance |
| Materials and textures | Material/Shader APIs, Shader Graph, `MaterialPropertyBlock`, texture arrays, RenderTextures and image conversion | Variants, batching-friendly overrides, surface layers and capture processing | Material changes cannot conceal structural defects; preserve SRP compatibility |
| Lighting and probes | Lighting window/settings, baked/mixed/realtime lights, lightmaps, Light Probes, Reflection Probes, Light Explorer | Establish readable city lighting and reflections before buying another lighting system | Baking changes data and can be expensive; visual and performance proof remain required |
| Visibility and scale | Camera culling masks, frustum culling, Occlusion Culling, occlusion areas/portals, `LODGroup` | Dense-city visibility, camera readability and performance | Do not use culling/LOD to hide layout errors; validate popping and player-view continuity |
| Rendering diagnostics | Game/Scene Stats, Frame Debugger, Rendering Debugger, Render Graph Viewer and shader compilation logs | Find draw-call, pass, shader, render-target and renderer-feature causes | Diagnostic tools inspect rendering; they do not replace original-image visual review |
| Performance diagnostics | Profiler, Profile Analyzer where installed, `ProfilerMarker`, `ProfilerRecorder`, Development Player profiling | CPU/GPU/rendering/memory/audio/physics/UI bottlenecks and regression evidence | Measure a representative workload; do not optimize from unsupported assumptions |
| Physics diagnostics | Physics Debugger, collider visualization, layer collision matrix, ray/shape queries and `Physics.SyncTransforms` | Missing ground, overlaps, bad colliders, vehicle contact and access validation | A collider pass does not prove spatial or visual plausibility |
| Navigation and pathfinding | NavMesh runtime APIs, agents, obstacles, links and area costs | Character/police movement after walkable geometry exists | `NavMeshSurface`/AI Navigation package workflow is not currently established; Gley pedestrian routing is a separate option |
| Animation and sequencing | Animation clips, Animator substrate, Playables/Director and Animation window | Reactions, doors, props, cutscene-like sequencing and authored motion | Timeline package is not currently installed; do not infer a full cinematic stack |
| Audio | AudioSource, AudioListener, AudioMixer and spatial settings | Feedback, ambience, vehicles and world emitters | Avoid parallel vendor/project audio stacks without ownership and mixing decisions |
| VFX | Built-in Particle System, trails, line renderers, Shader Graph effects and pooling | Impacts, smoke, fire, sparks and lightweight feedback | VFX Graph is not installed; owned POLYGON FX remains a later import option |
| UI and tooling UI | UI Toolkit/UI Builder/Debugger, uGUI Canvas/EventSystem and TextMesh Pro | HUD, menus, diagnostics and custom Editor tools | Choose by surface and retained/immediate needs; accessibility still needs explicit design |
| Input | Input Actions, action maps, device/control schemes, rebinding and input testing | Player controls and tool interactions | Reuse the current action architecture before adding direct polling or another input layer |
| Object lifecycle | Instantiate/Destroy, `UnityEngine.Pool.ObjectPool`, lifecycle events and scene ownership | Repeated effects, projectiles, traffic/support objects | Pool only demonstrated churn; lifetime bugs can exceed allocation savings |
| Testing and validation | EditMode, PlayMode, performance tests, assertions and test fixtures | Deterministic logic, integration, regressions and performance thresholds | Technical tests remain separate from Human visual judgement |
| Build and evidence | BuildPipeline, BuildReport, PlayerSettings, command-line methods, ScreenCapture and image encoding | Reproducible builds, smoke tests and evidence production | Builder success, hashes and readable files do not establish visual acceptance |
| Serialization and data | Serialized fields/assets, `ScriptableObject`, `JsonUtility`, asset GUIDs and package/project settings | Stable configuration, manifests and reproducible records | Schema/version ownership and migration must be explicit for durable save data |

## Current Problem Routing

| Problem or intended use | Check these native capabilities first | Then compare |
|---|---|---|
| Pedestrian, police or NPC pathfinding | NavMesh runtime APIs and existing Gate-D patterns | Gley pedestrian system; add AI Navigation only if its missing authoring/runtime capability is proven necessary |
| Vehicle motion or wheel contact | Physics/vehicle modules and Physics Debugger | Accepted RCCP record; do not create a parallel WheelCollider stack by default |
| Camera blocked by buildings | Camera/layer design, raycasts, occlusion strategy and LOD/visibility rules | Owned See-through Shader only for a surviving obstruction gap |
| Too many objects or slow frames | Profiler/ProfilerRecorder, Stats, LODGroup, Occlusion Culling, batching/instancing | Third-party optimisation only after a measured native-tool gap |
| Pink, missing or expensive rendering | Console/shader logs, Frame Debugger, Rendering Debugger, URP asset/features and Shader Graph | Vendor shader adaptation or a new rendering package after root cause |
| Flat or inconsistent city lighting | Lighting Settings, Light Explorer, lightmaps, Light/Reflection Probes | Ethereal URP only for a named volumetric gap |
| Repetitive scene/prefab work | Prefab variants, AssetDatabase, PrefabUtility, EditorSceneManager, Undo-capable Editor tooling | New plugin or bespoke framework only when native automation cannot meet the bounded workflow |
| Custom curb, foundation, apron or path mesh | Existing package geometry, Splines, ProBuilder and Mesh APIs | Small project-owned adapter after native/package fit is visibly disproven |
| Impact, smoke, fire or sparks | Built-in Particle System, pooling and Shader Graph | Owned POLYGON Particle FX if the native first pass lacks needed coverage |
| HUD, menu or diagnostic panel | UI Toolkit for new Editor/tooling surfaces; uGUI/TMP where current runtime architecture fits | Third-party UI only for a proven feature/style gap |
| Runtime or editor regression | Test Framework, PlayMode/EditMode tests, performance tests and deterministic fixtures | External testing tools only for a missing capability |
| Capture or build evidence | ScreenCapture/image conversion, BuildPipeline/BuildReport and explicit original inspection | Custom evidence tooling only for missing metadata or repeatability |
| Data-heavy geometry or analysis | Jobs-compatible design, Burst, Collections and Mathematics | Conventional managed code when the workload does not justify native-container debt |

## Optional Unity Packages Not Currently Established

Absence here prevents accidental assumptions; it is not a recommendation to install.

| Optional Unity capability | Current state | Consequence |
|---|---|---|
| AI Navigation package / `NavMeshSurface` workflow | Not a direct locked dependency | Runtime NavMesh APIs exist, but modern component-based baking/runtime surface workflow must be verified or separately added with authority |
| Cinemachine | Not a direct locked dependency | Use current project camera architecture and built-in Camera APIs unless a concrete camera gap justifies evaluation |
| Timeline package | Not a direct locked dependency | Director/Playables substrate is present; do not assume Timeline authoring tools |
| Addressables | Not a direct locked dependency | Built-in scene/asset loading exists; scalable addressable content management is not established |
| Recorder | Not a direct locked dependency | ScreenCapture and project evidence builders exist; advanced recorder workflows are not established |
| VFX Graph | Not a direct locked dependency | Built-in Particle System remains the native VFX baseline |
| Memory Profiler package | Not a direct locked dependency | Built-in Profiler memory data exists; snapshot/package workflows are not established |
| Visual Scripting, Entities/DOTS and Localization | Not direct locked dependencies | Do not design around these systems without a separately proven need and installation authority |

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Exact package/module set is available | `STATICALLY VERIFIED` | `Packages/manifest.json`, `Packages/packages-lock.json`, `ProjectSettings/ProjectVersion.txt` | Availability is not consumer success |
| Native Editor automation is a real current project capability | `STATICALLY VERIFIED` | Extensive local use of `AssetDatabase`, `PrefabUtility`, `EditorSceneManager`, UI Toolkit, Undo, Handles and Gizmos under `Assets/_Crime99` | Individual historical builders may be task-specific or rejected |
| NavMesh runtime patterns exist locally | `STATICALLY VERIFIED`; historically runtime-tested in named Gate scope | Gate-D runtime/setup/tests using `NavMeshAgent` and `NavMesh.SamplePosition` | Does not prove current city NavMesh baking or all-agent behavior |
| Built-in Particle System supports current project feedback code | `STATICALLY VERIFIED`; historically runtime-tested in named Gate scope | Gate-C feedback and vehicle-damage code | Final VFX quality and performance remain separate |
| Native performance metrics are usable | `STATICALLY VERIFIED` | `ProfilerRecorder` use in City Surface tooling and Pampel Games utilities | No current representative citywide performance baseline |
| LOD/probe/capture/build APIs are accessible locally | `STATICALLY VERIFIED` | Local `LODGroup`, Reflection Probe baking, `ScreenCapture` and `BuildPipeline` consumers | Exact outputs still need runtime/visual evidence |

## Successful Applications

- Project-owned Gate-D code uses Unity NavMesh agents and path sampling instead
  of inventing a separate character pathfinding core.
- Gate-C feedback uses the built-in Particle System for bounded effects.
- Crime99 builders repeatedly use native prefab, asset, scene, build, capture,
  UI Toolkit and physics APIs to create reproducible technical/evidence work.
- Existing tools have used ProfilerRecorder, LODGroup and Reflection Probe APIs,
  proving these are practical local options rather than hypothetical features.

## Failed Applications and Reusable Shields

- Native API reachability, generated objects and successful serialization did
  not make rejected road, ground or proxy candidates visually acceptable.
- Null-graphics, malformed or merely readable captures did not prove rendered
  quality or direct visual inspection.
- Physics overlap/contact checks did not prove credible city planning,
  frontage, access or player readability.
- Historical custom builders show that automation can amplify a weak method;
  prefer the right native capability and a small visual proof before scaling it.

These are method/evidence limits, not reasons to reject Unity-native tools.

## Decision Guidance

- Search this atlas before recommending new code, a package import or a store purchase.
- Prefer a native tool when it solves the actual problem with lower integration
  and maintenance debt and can be verified through a bounded proof.
- Prefer an installed specialist asset when it carries important domain logic
  Unity does not provide, such as Road Constructor's road graph or RCCP's
  higher-level vehicle stack.
- Do not force native tools where an installed package has the stronger proven
  workflow; compare them explicitly.
- Resolve one decision-critical unknown instead of auditing every Unity option.
- Keep visual, technical, runtime, performance and adoption conclusions separate.

## Technical-Debt Guidance

Native-first reuse usually avoids duplicate dependencies, update paths and
parallel architectures. It can still create debt when low-level APIs require a
large custom framework, when editor scripts omit Undo/idempotency, when
generated assets lack ownership, or when an optional package is silently
assumed present. Choose the smallest solution that is visually adequate and
operationally maintainable.

## Unknowns and Refresh Triggers

- `UNKNOWN`: current citywide NavMesh bake/runtime suitability, representative
  performance, occlusion data, final lighting/probe setup and production UI architecture.
- Refresh this atlas after Unity version, package lock, render pipeline,
  ProjectSettings or accepted architecture changes.
- Add a narrower record when a native capability becomes repeatedly
  decision-relevant or gains reusable success/failure evidence.

## Search Tags

`Unity native`, `built-in`, `editor tools`, `NavMesh`, `physics`, `WheelCollider`,
`Particle System`, `animation`, `audio`, `Playables`, `UI Toolkit`, `uGUI`,
`PrefabUtility`, `AssetDatabase`, `EditorSceneManager`, `Undo`, `Handles`,
`Gizmos`, `Profiler`, `Frame Debugger`, `Render Graph Viewer`, `lighting`,
`lightmapping`, `Reflection Probe`, `LODGroup`, `Occlusion Culling`, `BuildPipeline`,
`ScreenCapture`, `Input System`, `Burst`, `Collections`, `Test Framework`
