# Crime99 Asset and Style Preflight Plan

## Status and Authority Boundary

**Document Maturity:** In Review

**Plan Type:** Execution plan for a separately authorised isolated test

**Project Phase:** Definition

**Execution Status:** Not authorised

**Last Reviewed:** 2026-07-14

This document plans the first Crime99 Asset and Style Preflight. It does not authorise purchase, download, import, installation, Unity project creation, project execution, asset modification, technical integration, staging, commit, push, or a main-project architecture decision.

Execution may start only after one comprehensive `Initial Execution Approval` confirms the full bounded Preflight scope defined below. That approval may cover download, isolated project creation, import, all regular Preflight gates, the optional VFX pass when explicitly included, and use of the confirmed contingency. It does not authorise main-prototype transfer, release use, work outside the Preflight, staging, commit, push, archival, deletion, or architecture adoption.

The Preflight is a small evidence-gathering test. It is not a level, gameplay prototype, Style Slice, production asset pipeline, or final art-direction approval.

## Authority and Evidence Basis

This plan follows:

* the confirmed first-prototype strategy `Buy, reuse, adapt lightly`;
* the two-phase Asset Pre-Production and Asset and Style Preflight sequence in [`PROTOTYPE_ROADMAP.md`](PROTOTYPE_ROADMAP.md#asset-pre-production-and-asset-and-style-preflight--before-prototype-production);
* the bounded selection in [`ASSET_GAP_ANALYSIS.md`](ASSET_GAP_ANALYSIS.md#minimum-bounded-asset-and-style-preflight-selection);
* the official-store evidence recorded in [`ASSET_INVENTORY.md`](ASSET_INVENTORY.md);
* the camera rules in [`GDD/16_PROTOTYPE_SCOPE.md`](GDD/16_PROTOTYPE_SCOPE.md#12-camera);
* OD-018, OD-037, OD-058, OD-061, OD-062, and OD-063 in [`OPEN_DECISIONS.md`](OPEN_DECISIONS.md);
* the external-download, installation, architecture, and Git approval boundaries in [`../../AI_DEVELOPMENT_RULES.md`](../../AI_DEVELOPMENT_RULES.md).

Recorded official store evidence supports only the package/version rows stated in the inventory. It does not prove Unity 6.3 compatibility, correct shaders after import, mesh quality, scale, pivots, colliders, LODs, performance, camera readability, or release suitability. Those are Preflight questions, not assumptions.

## Goal

Determine whether a bounded representative selection from the three first-priority environment packages can:

1. import into an isolated Unity 6.3 test project without blocking errors;
2. work under one provisional render pipeline with only light, reversible adaptation;
3. form one compact `Neon over Dirt` street composition rather than three visibly disconnected asset packs;
4. remain readable from both confirmed Crime99 camera variants;
5. stay within a reasonable test-only performance and memory envelope;
6. retain traceable licence, source, version, and modification evidence; and
7. justify later package-level statuses and a Human Developer decision about any main-prototype proposal.

The Preflight does not decide the final camera, main-project render pipeline, main-project Unity package set, final asset selection, final art direction, release licence conclusion, or future Crime99 project path.

## Exact First-Preflight Selection

### Required Packages

| Order | Package | Package ID | Bounded representative selection | Purpose |
|---:|---|---:|---|---|
| 1 | `1950s NYC Environment Megapack (Modular with Interiors and Characters)` | `236123` | One dependency-complete building facade/module, one street plus sidewalk/kerb segment, one small street-prop or refuse set, and one second visually distinct facade/module | Base street, scale, modularity, period-neutral urban material, clean/dirty comparison |
| 2 | `Cyberpunk Port City Environment` | `283742` | One dependency-complete warehouse or industrial facade/module, one road or service-yard segment, and one small industrial/neon prop set | Harbour/backyard language, industrial contrast, selective neon, performance stress |
| 3 | `Fuyoh Cyberpunk Diner Environment` | `376856` | Exterior shell or facade only, sign and exterior-lighting elements, and a small exterior prop subset | Commercial landmark, colour control, neon integration, camera landmark readability |

Exact prefab and dependency filenames are intentionally not invented. Within the packages and asset categories confirmed by the `Initial Execution Approval`, Work selects and documents the smallest dependency-complete file set satisfying each row. Interiors, demo maps, characters, unrelated props, and duplicate material variants remain excluded unless a required dependency makes one unavoidable, remains inside the confirmed package/category boundary, and is recorded.

### Optional VFX Gate

`POLYGON Particle FX Pack` is excluded from the environmental pass by default. It may enter only after the combined environment scene passes import, scale, material, camera, and baseline performance review.

If the `Initial Execution Approval` includes the optional VFX pass, import exactly one dependency-complete fire effect, one smoke effect, one spark or impact effect, and one explosion effect after the environment gate passes. No additional intermediate approval is required. Test them in a duplicated scene so their overdraw, lighting, and performance cannot contaminate the environment baseline.

### Explicitly Excluded from the First Preflight

* Yellow Parrot or any other comparison package; adding one requires a new Human Developer approval outside the first Preflight;
* all other environment packs;
* complete demo scenes;
* complete interiors;
* character, vehicle, weapon, audio, gameplay, traffic, AI, destruction, or minimap work;
* additional Asset Store purchases or packages;
* main-project import or asset transfer;
* generated derivatives, generative-reference use, or training use;
* extensive mesh, UV, texture, shader, or model production.

## Proposed Test Environment

### Project Identity and Path

**Proposed project name:** `Crime99AssetStylePreflight`

**Proposed isolated root:** `Projects/Crime99AssetStylePreflight/Source/Crime99AssetStylePreflight/`

**Resolved local path:** `C:\Users\jarid\Desktop\Game Development\Projects\Crime99AssetStylePreflight\Source\Crime99AssetStylePreflight\`

This path deliberately follows the existing workflow-test pattern while remaining separate from any future Crime99 game directory or repository. Only the innermost `Source/Crime99AssetStylePreflight/` path may become a Unity project root. The outer template path must not become a second Unity project root.

Creating this path or project requires the `Initial Execution Approval`. When expressly included there, it does not require another approval during execution. Its use would not close OD-005 or select the future main-project path.

### Unity Version

Use the already installed and confirmed `Unity 6000.3.19f1` for the proposed test. This follows the confirmed Unity 6.3 LTS baseline and avoids installing a second Editor version merely for the Preflight.

This is a compatibility test, not a compatibility claim. The recorded official package rows refer to Unity 2020.3.28 or 2021.3.6 variants, not Unity 6000.3. A package that fails on `6000.3.19f1` must not be silently retested on another Editor version; any fallback-version test requires a new Human Developer decision.

### Provisional Render Pipeline

Use **Universal Render Pipeline (URP)** for this isolated test, provisionally and reversibly.

Rationale based on the recorded official store evidence:

* `1950s NYC` lists Built-in, URP, and HDRP compatibility for a 2021.3.6 package variant;
* `Cyberpunk Port City` lists URP and HDRP as compatible and Built-in as not compatible for 2021.3.6;
* `Fuyoh Cyberpunk Diner` lists Built-in, URP, and HDRP compatibility for 2021.3.6;
* therefore the documented common intersection is URP or HDRP, not Built-in;
* URP is the smaller provisional fit for a compact performance/readability test and controlled neon pass; HDRP would add test complexity not required to answer the first Preflight questions.

This reasoning does not prove that the packages work in Unity 6.3 URP. It defines the hypothesis to test. It does not select the main-project pipeline, lighting architecture, shader strategy, or quality targets.

### Unity Packages

Keep the test package set minimal:

* `com.unity.render-pipelines.universal`, at the version resolved by the approved Unity `6000.3.19f1` Universal 3D project template;
* Unity built-in Profiler, Frame Debugger, Statistics, Lighting, and Memory Profiler window capabilities where available without adding a package;
* no Cinemachine, ProBuilder, Input System, post-processing add-on, terrain system, third-party tool, or extra measurement package by default.

Do not invent or pin a URP package version in advance. Record the exact resolved manifest and lock-file versions after the authorised project is created. A missing capability that would require an additional unapproved package or tool is an exception-only stop.

## Planned Folder Structure

```text
Projects/Crime99AssetStylePreflight/
├── README.md                         # test boundary and restart instructions
├── Docs/
│   ├── PRECHECK.md                   # approvals, machine facts, disk budget
│   ├── IMPORT_LOG.md                 # ordered errors and warnings
│   ├── PACKAGE_RESULTS.md            # package matrix and status
│   ├── PERFORMANCE_RESULTS.md        # fixed test routes and measurements
│   ├── HUMAN_REVIEW.md               # screenshots and review decisions
│   ├── LICENSE_PROVENANCE.md         # evidence references, no secrets
│   └── TEST_MANIFEST.md              # exact approved assets and hashes where available
├── Snapshots/                        # local reset archives; excluded from Git
└── Source/
    └── Crime99AssetStylePreflight/   # only Unity project root
        ├── Assets/
        │   ├── _Preflight/
        │   │   ├── Adaptations/      # duplicated materials and test-only variants
        │   │   ├── Lighting/
        │   │   ├── Measurement/
        │   │   ├── Scenes/
        │   │   └── TestRigs/
        │   └── ThirdParty/           # untouched imported publisher trees
        │       ├── 1950sNYC/
        │       ├── CyberpunkPortCity/
        │       ├── FuyohCyberpunkDiner/
        │       └── PolygonParticleFX/ # optional only
        ├── Packages/
        └── ProjectSettings/
```

The actual publisher folder names must be preserved when importers require them. If a package cannot be safely relocated to `Assets/ThirdParty/`, retain its original folder unchanged and record the exception. Never reorganise original assets merely for visual tidiness.

## Git, Raw Assets, and Provenance

The test should default to documentation-first tracking. Raw licensed assets, package caches, snapshots, generated Unity folders, captures containing redistributable source material, and local logs are excluded from Git unless their licence and size are explicitly reviewed.

Proposed Git-trackable content, only after a separate Git-scope decision:

* project settings and package manifests that contain no licensed payload;
* `_Preflight` scenes, scripts, duplicated test materials, and measurement configuration when they do not embed restricted source data;
* Markdown results, licence/provenance references, and textual measurements;
* small screenshots only after licence and redistribution review.

Always exclude at minimum:

* `Library/`, `Temp/`, `Logs/`, `Obj/`, `UserSettings/`, and local build output;
* downloaded `.unitypackage` files and package caches;
* untouched raw publisher assets and their archives unless an explicit licence-and-size decision authorises them;
* `Snapshots/` and any local credential, order, invoice, key, or account data.

For every selected item, record publisher, product name, package ID, package/account version, official source URL, acquisition evidence reference, licence label, imported relative path, original file name, file size, and a cryptographic hash where practical. Do not store credentials, licence keys, invoices, or personal payment data in the repository.

## Original-Asset Protection and Adaptation Rules

Treat all imported publisher content as read-only raw material.

* Never edit original meshes, materials, textures, prefabs, shaders, or package metadata in place.
* Duplicate any material requiring adjustment into `Assets/_Preflight/Adaptations/<Package>/`.
* Use prefab variants or scene overrides for scale, material assignment, collider experiments, and composition.
* Record the original-to-test mapping in `TEST_MANIFEST.md`.
* Prefix test-only variants with `PF_` and retain the source package name in metadata.
* If an original asset would require irreversible conversion or in-place modification, stop under the exception model and preserve the original state.
* Do not use source assets for generative derivation, model training, or generative reference.

Allowed later adaptations are limited to root-scale alignment, material assignment, roughness/smoothness and metallic adjustment, bounded colour correction, controlled neon colour/intensity, light dirt variation, lighting, composition, and detail-density balancing.

Disallowed work includes new UVs, retopology, extensive modelling, texture recreation, large shader rewrites, generative derivatives, a new 3D pipeline, and final level production.

## Backup and Reset Strategy

The Preflight must be disposable and reproducible.

1. Record free disk space and the temporary storage ceiling confirmed by the `Initial Execution Approval` before any download.
2. Create the authorised empty Unity project and validate one empty URP scene.
3. Close Unity and create a local `BaselineClean` snapshot excluding `Library/`, `Temp/`, `Logs/`, and caches.
4. Before each package import, close Unity and create or verify the prior named snapshot.
5. Import one package selection at a time and preserve its console/import log before continuing.
6. If an import blocks compilation, corrupts project settings, rewrites another package, or cannot be cleanly removed, close Unity and restore the last clean snapshot; do not repair the baseline ad hoc.
7. After all individual imports pass, create `CombinedBeforeStyle` and then perform the combined scene/style pass.
8. Keep the clean baseline, individual-import result manifests, and final combined result until the Human Developer completes the final review. Archival and deletion remain separate later actions.

Snapshots are local reset artifacts, not the independent encrypted backup required by DEC-023. Their existence does not satisfy repository backup policy.

## Import Sequence and Gates

### Gate 0 — Initial Execution Approval and Precheck

Required before project creation or download:

* confirm project path and project name;
* confirm Unity `6000.3.19f1`;
* confirm URP solely as a test-related hypothesis;
* confirm the exact required packages, whether the optional VFX pass is included, and the bounded asset categories;
* authorise download, isolated project creation, import, and complete execution of all regular Preflight gates within the confirmed scope;
* review licence/provenance evidence and permitted test use;
* record full CPU, RAM, GPU, storage, display resolution, and free-space facts without guessing;
* confirm download, package, storage, time, adaptation, performance, and stop limits, including any bounded reserve;
* confirm snapshot and reset strategy;
* confirm raw-asset, provenance, and Git boundaries;
* confirm the allowed light adaptations.

Do not begin if the `Initial Execution Approval`, required licence facts, machine facts, or operating limits are incomplete. Once they are complete, Work may execute Gates 1 through 6 autonomously and stops only for an exception defined below.

### Gate 1 — Empty Baseline

Create only the isolated Universal 3D project. Record Editor and URP versions, package manifest, project settings, empty-scene console state, initial disk usage, Editor memory, frame timing, draw calls, triangles, and a reproducible camera path.

Pass when the empty baseline has no compile/import errors, no unexplained warnings, and can be restored from `BaselineClean`.

### Gate 2 — Individual Package Imports

Import in this order:

1. `1950s NYC` bounded selection;
2. `Cyberpunk Port City` bounded selection;
3. `Fuyoh Cyberpunk Diner` bounded selection;
4. optional `POLYGON Particle FX` selection only when included in the `Initial Execution Approval` and after the environment gate passes.

For each package, capture the complete initial import console state before making changes. Validate representative prefabs in a neutral package-only scene. Do not start style adaptation until the package-level technical matrix is complete.

Within the confirmed package and category boundaries, Work determines and records the exact dependency-complete import list. Normal documented warnings, reversible material conversions, known import notices, and expected technical observations do not require an intermediate approval when they remain within the confirmed limits.

### Gate 3 — Combined Neutral Scene

Build the exact compact scene below using original materials first. Use neutral fixed night lighting and no colour grading beyond what the selected URP template provides. This separates technical compatibility from later style intervention.

Pass only when all three packages coexist without new compile errors, missing dependencies, material corruption, or cross-package setting conflicts.

After this gate passes, Work proceeds directly to the allowed light style pass without another approval.

### Gate 4 — Light Style Pass

Duplicate only the materials that require adjustment. Apply the smallest shared changes needed to test `Neon over Dirt`. Time every intervention by category and package.

No individual mesh receives bespoke production work. If cohesion depends on extensive one-off repairs, record failure rather than hiding the cost.

### Gate 5 — Camera and Performance Pass

Run both camera variants through the same marked positions, orientations, lighting, visible-object set, and quality settings. Use no zoom, panning, or independent translation. Record screenshots and measurements before and after the light style pass.

### Gate 6 — Optional VFX Pass

When included in the `Initial Execution Approval`, duplicate the accepted environment scene, add only the four bounded VFX representatives, and repeat the camera/performance route without another intermediate approval. Do not change environment acceptance based on VFX results; report VFX separately.

### Gate 7 — Final Human Review and Classification

Present neutral and adapted comparisons, camera pairs, package matrix, performance results, adaptation time, provenance status, unresolved risks, and the proposed status for each package. The Human Developer accepts, changes, or rejects each proposed classification.

No asset moves to a main project as part of this gate.

## Exact Preflight Scene

Create one compact L-shaped or shallow T-shaped test block, not a playable map. The composition must contain:

* one short `1950s NYC` street segment with sidewalk and kerb;
* two visually distinct facades, at least one from `1950s NYC` and one from either `Cyberpunk Port City` or a second NYC module;
* the Fuyoh exterior or facade as a small commercial landmark;
* one Cyberpunk Port warehouse, service-yard, loading, harbour, or backyard module;
* one bounded group of bins, refuse, barriers, crates, street furniture, or industrial props;
* one deliberately cleaner zone around the commercial element and one dirtier industrial/backyard zone;
* controlled neon from the diner/sign plus no more than two supporting neon or emissive accents;
* one fixed night-lighting setup, with no day/night cycle;
* an open central measurement lane and marked one-metre, two-metre, vehicle-width, door-height, kerb-height, and human-scale references;
* enough clearance for identical camera orbits and fixed-camera viewpoints without adding gameplay.

Do not optimise the layout around one camera orientation. Place at least one tall occluder, one narrow street edge, one open industrial area, and one landmark that must be recognised from multiple azimuths.

## Camera Test Protocol

### Shared Rules

Both variants use the same fixed elevation angle, fixed distance, target point, test markers, scene state, resolution, and lighting during a comparison run. Exact angle and distance remain test parameters confirmed in the `Initial Execution Approval` and do not require another approval during execution.

Neither variant may use:

* zoom or variable distance;
* speed-based or automatic distance changes;
* panning;
* independent translation;
* stepped 90-degree rotation.

### Fixed Camera

Use one fixed world orientation, fixed elevation, and fixed distance. Capture the same marked target positions facing along the street, across the street, beside the diner, near the tall occluder, and in the industrial area.

### Rotatable Camera

Keep elevation and distance identical to the Fixed Camera run. Rotate only around the target. Capture at least four evenly spaced azimuths at every marked position, plus the worst observed occlusion angle.

### Readability Checks

For each capture, rate:

* street, kerb, and walkable-edge separation;
* facade and landmark recognition;
* clean-versus-dirty zone distinction;
* neon legibility without colour clipping or overwhelming the scene;
* prop silhouette and clutter density;
* material separation under night lighting;
* occlusion of the human-scale marker and central measurement lane;
* package seams and obvious style mismatch;
* detail survival at the fixed camera distance.

Use the same five-point rubric for both variants: `1 Unreadable`, `2 Weak`, `3 Usable`, `4 Clear`, `5 Strong`. A package/scene passes camera readability only if every mandatory category scores at least `3` in both variants and no variant-specific layout workaround is required.

## Package Evaluation Matrix

Complete one row set per required package and a separate optional set for VFX.

| Area | Evidence to capture | Pass condition | Fail or escalation condition |
|---|---|---|---|
| Unity compatibility | Import log, console, compilation, package version | Opens and recompiles in `6000.3.19f1` without package-caused errors | Compile/import exception, corrupted project, or unsupported API requiring source repair |
| Render pipeline | Original material appearance, shader names, conversion needs | Representative assets render in URP with original or officially supplied URP materials | Required Built-in/HDRP-only dependency or broad custom conversion |
| Import warnings | Full first-import log with attribution | No errors; warnings are finite, attributable, and do not affect output | Repeating, unexplained, data-loss, serialization, or shader warnings |
| Shaders/materials | Pink/missing check, shader inventory, duplicated fixes | No missing materials; light parameter/assignment fixes only | Shader rewrite, mass conversion, or repeated per-asset repair |
| Textures | Format, dimensions, compression, alpha, memory | Formats load correctly; outliers are documented and reducible by import settings | Corrupt textures, unusable alpha, or required texture recreation |
| Scale/proportion | One-metre grid, human/door/kerb/vehicle-width markers | Package aligns through one documented root/import scale and remains proportionally credible | Frequent object-by-object scale correction or incompatible proportions |
| Pivots | Placement, rotation, snapping tests | Representative modular pieces place predictably with documented offsets | Widespread pivot repair or inability to assemble without mesh editing |
| Colliders | Presence, fit, complexity, trigger state | Required surfaces have usable or easily added simple test colliders | Dense mesh colliders, missing collision across the set, or manual repair per object |
| Prefabs | Dependencies, nesting, overrides, missing scripts | Representative prefabs instantiate without missing links/scripts | Broken references, hidden scene dependencies, or unsafe global settings |
| Modularity | Repetition, seams, snapping, corner transitions | Selected modules form the required compact block without mesh edits | Demo-scene-only composition or insufficient modular connection |
| LODs | LODGroup presence, transitions, renderer coverage | Existing LODs behave acceptably, or missing LODs are a bounded documented prototype risk | Broken transitions, severe popping, or manual LOD production needed for the representative set |
| Polygon counts | Vertices/triangles per representative and visible total | Counts are recorded and scene stays inside the performance gate | Unexplained extreme outliers or optimisation work beyond light adaptation |
| Lighting | Direct, ambient, emissive, reflection response | Materials remain readable under neutral and adapted night lighting | Only extreme lighting hides defects or makes sources appear cohesive |
| Shadows | Artifacts, bias, distance, cost | No severe acne, detachment, clipping, or disproportionate cost | Asset-specific shadow repair or disabling shadows broadly is required |
| Transparency | Sorting, alpha clipping, glass/sign response | Stable in both cameras and overlapping views | Persistent sorting artifacts or shader replacement beyond light work |
| Performance | Baseline and camera-route frame/memory data | Meets the provisional test-only performance gate below | Exceeds stop thresholds or needs package-wide optimisation |
| Memory/disk | Import size, project delta, runtime/editor memory delta | Fits approved temporary ceiling and produces no unexplained spikes | Exceeds ceiling, threatens system stability, or requires whole-pack duplication |
| Camera readability | Paired rubric for both variants | All mandatory categories score at least `3` in both variants | Any mandatory score below `3` after light adaptation or variant-biased layout needed |
| Adaptation effort | Timed change log by category | Only allowed light adaptations and within time gate | Mesh/UV/texture production, shader rewrite, or repeated bespoke repair |
| Licence/provenance | Official URL, ID, version, licence label, ownership evidence reference | Intended local prototype test use is documented; evidence chain is complete | Ambiguous source, licence, ownership, redistribution, or modification rights |
| Prototype suitability | Technical, visual, camera, effort synthesis | Clear reusable role in the first prototype | No bounded role or costs outweigh reuse value |
| Release potential | Evidence gaps and restrictions | May be labelled only `Potential Release Asset`, pending later release review | Never claim final release approval from this Preflight alone |

## Provisional Test-Only Performance Gate

Because OD-037 and final performance targets remain open, these values are proposed only for consistent Preflight triage on the reference PC. The Human Developer confirms or replaces them in the `Initial Execution Approval`; they do not become Crime99 requirements.

Test at a fixed `1920 × 1080` Game view, identical URP quality settings, VSync disabled for measurement, no unrelated applications intentionally added during runs, and the same camera route. Record the complete CPU, RAM, and GPU facts first.

* warm up for 60 seconds;
* capture at least three 60-second runs per camera variant;
* report median frame time, 95th-percentile frame time, worst repeatable spike, batches, SetPass calls, visible triangles/vertices, Editor process memory, and project disk size;
* environment pass: median frame time at or below `16.7 ms` and 95th percentile at or below `22.2 ms` in both camera variants;
* no repeatable frame-time spike above `50 ms` attributable to an asset while the camera route is otherwise static;
* combined imported raw selection plus snapshots must remain within the pre-approved disk ceiling;
* Editor process memory must remain below `80%` of physical RAM and must not grow by more than `25%` across three identical completed routes without returning near baseline;
* optional VFX pass: the approved representative effect set must not increase median frame time by more than `25%` or create repeatable spikes above `50 ms`.

If Editor measurements are too noisy to classify the result, use `Needs Further Testing`; a standalone development build may be proposed only under a new explicit execution scope. Do not silently weaken thresholds or treat RX 6800 XT results as a commercial minimum specification.

## Pass, Fail, and Status Rules

### Core Preflight Pass

The combined environment Preflight passes only if:

* all three required packages import without package-caused errors;
* the bounded representative assets render in URP without broad shader reconstruction;
* consistent scale is achieved through package-level or root-level adjustment rather than per-object repair;
* both camera variants meet the same readability rubric;
* the neutral and light-adapted scene shows recognisable visual cohesion without extreme lighting hiding mismatches;
* the provisional performance gate is met or a clearly bounded measurement limitation yields `Needs Further Testing` rather than a false pass;
* total hands-on adaptation stays within the time gate below;
* licence and provenance evidence is complete for local prototype testing;
* every result, warning, adaptation, and Human decision is recorded.

### Adaptation Time Gate

Exclude download/import waiting time but record it separately.

* target: no more than `90 minutes` of hands-on adaptation per required package;
* combined shared style pass: no more than `3 hours`;
* any single representative asset needing more than `30 minutes` of bespoke repair triggers review;
* more than `6 hours` total hands-on adaptation before Human review is a hard stop.

These are planning controls, not productivity standards. The Human Developer may revise them in the `Initial Execution Approval`, but overruns must not be normalised after the fact.

### Package Status Vocabulary

Assign exactly one primary status per package, with evidence notes:

* `Suitable for Prototype` — passes technical, camera, performance, provenance, and cohesion checks with no material adaptation beyond normal assignment/composition.
* `Suitable with Light Adaptation` — passes after only allowed, repeatable light adaptation within the time gate.
* `Needs Further Testing` — evidence is incomplete or measurement is inconclusive; no positive suitability claim is made.
* `Prototype Only` — usable for internal prototype evidence, but quality, performance, licence, provenance, or maintainability prevents a release-direction claim.
* `Potential Release Asset` — passes the Preflight and appears worth later release-specific legal, quality, optimisation, and integration review; this is not final release approval.
* `Reject` — fails a blocking criterion, has no bounded useful role, or requires disproportionate repair.

`Potential Release Asset` must never be inferred solely from Asset Store ownership or successful import.

## Hard Stop Criteria

Work may execute the regular gates autonomously after the `Initial Execution Approval`. Stop the affected package or the entire Preflight, preserve evidence, restore the last clean snapshot when necessary, and ask for direction only when at least one of these exceptions occurs:

* licence, ownership, source, permitted modification, redistribution, or provenance is unclear;
* a new paid action or an additional unapproved asset, package, dependency, or tool becomes necessary;
* another Unity version or render pipeline appears necessary;
* irreversible conversion or modification of an original asset would be required;
* custom shader development, broad material repair, extensive modelling, new UVs, retopology, or texture recreation would be required;
* a confirmed time, reserve, storage, memory, download, package, category, adaptation, or performance limit would be exceeded;
* project stability, system stability, recoverability, or data integrity is at risk;
* a genuine architecture, design, scope, security, legal, or governance decision becomes necessary.

Normal documented warnings, reversible material conversions, known import notices, isolated correctable reference issues, expected shader-compilation time, and technical observations inside the confirmed limits are not mandatory stops. Work records and handles them through the defined matrices and reset strategy.

A package may fail an evaluation criterion without forcing the entire Preflight to stop. When safe and within scope, preserve the failure evidence, assign or propose the appropriate status, and continue with independent approved tests. Do not expand scope to rescue a failing package.

## Execution Estimate

The following is rough, non-binding planning only. Download size, import duration, shader compilation, and package structure are unknown until authorised execution.

| Phase | Estimated hands-on work | Expected waiting/compute | Contingency |
|---|---:|---:|---:|
| Precheck, manifest, licence evidence | 1–2 h | none | 0.5 h |
| Empty URP baseline and reset proof | 1–1.5 h | 0.5–1.5 h | 0.5 h |
| 1950s NYC bounded import and matrix | 1.5–2.5 h | 1–3 h | 1 h |
| Cyberpunk Port bounded import and matrix | 1.5–2.5 h | 1–3 h | 1 h |
| Fuyoh bounded import and matrix | 1–2 h | 0.5–2 h | 0.5 h |
| Combined scene and light style pass | 3–5 h | 0.5–1 h | 1.5 h |
| Both camera routes and performance capture | 2–3 h | 0.5–1 h | 1 h |
| Optional VFX pass | 1–2 h | 0.5–1 h | 0.5 h |
| Report, classifications, Human review pack | 1.5–2.5 h | none | 0.5 h |
| **Required environment total** | **12.5–21 h** | **4–11.5 h** | **6.5 h held, not automatic** |

Suggested execution split: three to five bounded Work sessions, each ending at a snapshot and evidence gate. A bounded reserve confirmed in the `Initial Execution Approval` may be used autonomously within its stated time, storage, download, and adaptation limits. It is not permission to expand package, tool, architecture, design, or project scope.

## Human Approval and Review Model

### 1. Initial Execution Approval

Before execution, the Human Developer confirms once:

* project path and project name;
* Unity `6000.3.19f1`;
* URP solely as a test-related hypothesis;
* the exact required packages, optional VFX boundary, and allowed asset categories;
* download, isolated project creation, import, and complete Preflight execution;
* storage, time, download, adaptation, performance, and stop limits, including any bounded reserve;
* snapshot and reset strategy;
* raw-asset, provenance, licence, and Git boundaries;
* allowed light adaptations.

This one approval may cover all regular gates. Download, project creation, import, exact dependency selection within the approved categories, the light style pass, included optional VFX, and use of the confirmed reserve do not require repeated approval.

### 2. Exception-Only Stop

Work continues autonomously through the regular gates and stops only for an exception listed under [Hard Stop Criteria](#hard-stop-criteria). Normal documented warnings and reversible corrections inside the confirmed limits are handled and recorded without an approval round.

### 3. Final Human Review

After execution, Work presents one combined review package containing:

* package matrices and import/compatibility results;
* neutral and lightly adapted comparison images;
* both camera variants;
* performance and memory measurements;
* adaptation effort;
* provenance and licence status;
* remaining risks;
* one proposed status per package;
* a recommendation for possible later prototype use.

Only the Human Developer confirms final package classifications, any `Potential Release Asset` label, later transfer into the main project, and any continuation outside the Preflight.

Staging, commit, push, archival, and deletion of results remain separate actions after the final review.

The Human review pack should show identical-angle before/after image pairs, both camera variants, worst-case occlusion, clean/dirty transition, material outliers, performance tables, adaptation-time totals, package provenance, and explicit unresolved questions.

## Required Deliverables After Later Execution

The later execution handoff must contain:

* exact Unity Editor and resolved package versions;
* exact imported file/dependency list for each package;
* complete import-error and warning summary;
* package evaluation matrices;
* neutral and adapted paired captures from both camera variants;
* scale, pivot, collider, prefab, modularity, LOD, polygon, lighting, shadow, transparency, memory, disk, and performance evidence;
* adaptation log with original-to-variant mapping and hands-on time;
* licence/provenance register;
* one proposed primary status per package;
* optional VFX result kept separate;
* gaps and any later comparison recommendation;
* Human Developer review decisions;
* exact changed-file and Git state;
* no main-project transfer or architecture claim.

## Planning Self-Check

* **Confirmed asset strategy:** aligned with `Buy, reuse, adapt lightly`.
* **Two-phase sequence:** this document completes planning only; download/import execution requires the later `Initial Execution Approval` and is not authorised by this plan.
* **Bounded selection:** three required packages; VFX optional behind a gate; all other packages excluded.
* **Camera consistency:** both confirmed variants use fixed elevation and distance; only the rotatable variant rotates around the target; no zoom, panning, or independent translation.
* **Test/main separation:** isolated test name and path; no future Crime99 project path or architecture is selected.
* **Pipeline boundary:** URP is a provisional test hypothesis based on the recorded common official compatibility intersection; Unity 6.3 remains unproven until test execution.
* **Original protection:** originals remain untouched; adaptations use duplicates or variants.
* **Licence boundary:** local test provenance is required; generative use and release approval are excluded.
* **Scope control:** no level, gameplay, Style Slice, broad asset import, or production pipeline.
* **Approval control:** no purchase, download, import, installation, project creation, execution, staging, commit, push, or external access is authorised by this plan.

## Related Documents

* [`README.md`](README.md)
* [`ASSET_INVENTORY.md`](ASSET_INVENTORY.md)
* [`ASSET_GAP_ANALYSIS.md`](ASSET_GAP_ANALYSIS.md)
* [`ASSET_PURCHASE_CANDIDATES.md`](ASSET_PURCHASE_CANDIDATES.md)
* [`PROTOTYPE_ROADMAP.md`](PROTOTYPE_ROADMAP.md)
* [`OPEN_DECISIONS.md`](OPEN_DECISIONS.md)
* [`RISK_REGISTER.md`](RISK_REGISTER.md)
* [`GDD/12_ART_DIRECTION.md`](GDD/12_ART_DIRECTION.md)
* [`GDD/13_CAMERA_AND_UI.md`](GDD/13_CAMERA_AND_UI.md)
* [`GDD/16_PROTOTYPE_SCOPE.md`](GDD/16_PROTOTYPE_SCOPE.md)
