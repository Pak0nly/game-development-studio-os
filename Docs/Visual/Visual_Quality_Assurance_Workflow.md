# Visual Quality Assurance Workflow

This document is the project-independent Source of Truth for visual quality assurance, camera coverage, occlusion review, and visual evidence in the Studio Operating System.

It applies whenever an assigned task creates or changes visible game content, including scenes, levels, environments, characters, vehicles, effects, lighting, materials, animation, cameras, or user interface presentation. Project standards may make this workflow more specific, but may not weaken it.

## Authority and Approval Boundary

- The Human Developer owns art direction and final visual approval.
- An AI Agent or Work session owns implementation quality and internal review within its authorised scope.
- Technical validation is necessary but never constitutes visual approval.
- Internal visual review may reject visible work without changing the approved art direction.
- A correction that changes art direction, scope, architecture, licence boundaries, external dependencies, or a protected asset requires Human Developer direction.
- Up to two editorial or visual correction rounds that stay inside the existing assignment are authorised as part of the visual task. This does not authorise unrelated implementation.

## Required Five-Phase Workflow

### Phase 1 — Builder Pass

Implement the authorised visual scope and preserve its technical, provenance, licence, and project boundaries. Record the reference target, intended gameplay camera, target resolution, comparison profiles, and review routes before producing final evidence.

### Phase 2 — Technical Validation

Verify at minimum:

- scene loading;
- missing scripts, materials, references, and broken dependencies;
- error shaders and visibly broken render states;
- build creation and Player startup when the task requires a build;
- a proportional performance baseline;
- manufacturer-source integrity;
- absence of secrets and unexpected binary files;
- evidence and build exclusion from staging unless separately authorised.

A technical result must be labelled technical. It must not claim visual identity, presentation quality, camera quality, or Human acceptance.

### Phase 3 — Blind Visual Review

Review only the final rendered result: final screenshots, the built Player, matched comparisons, the target resolution, and the actual gameplay camera. Do not use code structure, test counts, file counts, renderer counts, or frame rate to excuse a visible defect.

Answer explicitly:

1. What looks visibly broken?
2. What still looks like a graybox, test object, or placeholder?
3. What is too dark, bright, empty, dense, noisy, or visually flat?
4. Which required feature exists technically but is not readable from gameplay distance?
5. Which materials or objects look visually wrong?
6. Which light lacks a believable visible source?
7. Where does the world visibly end or expose an unfinished boundary?
8. Which areas are stylistically or historically incoherent?
9. What would an external reviewer criticise in the first ten seconds?
10. What is the weakest visible area now?

The reviewer must apply the hard-fail criteria, score the matrix below, inspect the full camera-coverage matrix, and review movement through critical occlusion transitions. A set of attractive showcase images does not replace gameplay-camera coverage.

### Phase 4 — Internal Red-Team Correction

Within the authorised scope, run no more than two autonomous correction rounds:

1. complete the Builder Pass;
2. perform a blind visual review;
3. correct the highest-impact visible failures;
4. regenerate matched evidence;
5. perform a second blind review;
6. make one further bounded correction when needed;
7. regenerate evidence and determine the internal status.

Every round must retain the same reference target, camera, position, resolution, and comparison profile unless the assignment explicitly authorises changing one of them. Stop instead of improvising when a correction needs new art direction, scope, assets, licensing, architecture, purchases, downloads, or protected-source changes.

### Phase 5 — Final Internal Status

Use exactly one of these statuses:

- `Technically Valid — Visual Review Failed`
- `Technically Valid — Visual Review Passed Internally, Human Approval Required`
- `Blocked by Human Art-Direction Decision`
- `Blocked by Scope, Asset, License or Technical Constraint`

Do not use `objectively visually complete`, `Visual Identity passed`, `near-final`, `visually complete`, or equivalent wording. Only the Human Developer may give final visual approval.

## Hard Visual Fail Criteria

Any item below blocks internal visual passage and therefore blocks a normal Human approval handoff:

- visible magenta, missing, or broken materials;
- large unreadable black or overexposed regions;
- visible replacement bodies, test geometry, or unintended placeholders;
- debug UI that dominates the target image;
- abstract effects used instead of required believable sources;
- required details that are practically invisible at gameplay distance;
- comparison profiles without a clearly visible difference;
- visible open map edges, voids, or unfinished world endings;
- a massively empty scene when the brief requires density;
- an implausible asset mixture;
- camera or occlusion states that hide the player or relevant gameplay space;
- visible style or period breaks contrary to the project direction.

When a hard fail cannot be corrected inside the authorised scope, use the appropriate blocked or failed status and provide evidence. Do not soften the result because technical validation passed.

## Reusable 0–5 Rating Scale

| Score | Meaning |
|---:|---|
| 0 | Missing, broken, or unusable; a fundamental requirement is absent. |
| 1 | Severe visible failure; the result cannot support gameplay review. |
| 2 | Clearly below the brief; major correction is required. |
| 3 | Functionally acceptable for internal review, with visible weaknesses. |
| 4 | Strong and coherent for the authorised development stage; only bounded refinement remains. |
| 5 | Exceptional for the authorised stage and reference target; no material internal defect is visible. |

Score every category with one short visible justification and an evidence reference:

| Category | Review question | Core category |
|---|---|---:|
| Spatial readability | Are routes, zones, scale, and hierarchy immediately understandable? | No |
| Material response | Do surfaces read correctly at gameplay distance and under target lighting? | Yes |
| Light and shadow readability | Are important spaces readable without crushed blacks or blown highlights? | Yes |
| Believable light sources | Does emitted and reflected light have plausible visible sources? | No |
| Visible usage history | Does wear, repair, dirt, and occupation show coherent causes? | No |
| Prop and detail density | Is detail purposeful, balanced, and readable rather than empty or noisy? | No |
| Stylistic coherence | Do assets, period, colour, and shape language belong together? | Yes |
| Placeholder freedom | Is unintended graybox, test, and replacement content absent? | Yes |
| Camera coverage | Do gameplay cameras cover all required positions and paths? | Yes |
| Occlusion | Are relevant actors and routes readable through entry, hidden, and restoration states? | Yes |
| UI readability | Is required UI legible and subordinate to gameplay presentation? | No |
| Presentation value | Does the result communicate the intended experience in the first ten seconds? | No |

Internal passage requires:

- no hard fail;
- no category below `3`;
- Material response, Light and shadow readability, Stylistic coherence, Placeholder freedom, Camera coverage, and Occlusion at least `4`;
- current matched evidence for every scored category.

## Camera Coverage Standard

### Required Position Classes

Include every applicable class:

- player on foot;
- player in a vehicle;
- spawn positions;
- primary routes;
- intersections;
- interiors or courtyards;
- alleys;
- bottlenecks;
- map boundaries;
- elevation changes;
- entrances and exits;
- landmark views;
- critical combat spaces.

### Coverage Matrix

Every reviewed scene must maintain a matrix with these fields:

| Field | Requirement |
|---|---|
| Position ID | Stable identifier used by evidence and retests. |
| World position | Exact actor or camera-target position in project units. |
| Movement mode | Foot, vehicle, scripted, spectator, or other approved mode. |
| Look/movement direction | World direction and intended route direction. |
| Visible primary route | Main route that must remain readable. |
| Visible secondary route | Escape, service, combat, or navigation alternative. |
| Relevant targets/actors | Player, opponents, vehicles, objectives, or landmarks. |
| Hard occluders | Buildings or opaque geometry that can fully block visibility. |
| Soft occluders | Foliage, effects, props, transparency, or partial screens. |
| Largest occluder screen share | Measured or consistently estimated fraction of the gameplay viewport. |
| Player visibility | Visible, correctly treated by occlusion, or failed. |
| Opponent/vehicle visibility | Visible, correctly treated, not applicable, or failed. |
| Result | Pass, fail, blocked, not run, or not applicable with reason. |
| Evidence | Screenshot, sequence, or video reference for the exact row. |

### Path Coverage

Still images are insufficient. Test at minimum one defined foot route and one defined driving route when those modes exist. Observe continuously:

1. approach to a critical occluder;
2. entry into occlusion;
3. state while behind the occluder;
4. exit from occlusion;
5. correct restoration and renewed visibility.

If reliable video is unavailable, capture a tightly spaced timestamped or numbered sequence with unchanged camera settings. A planning or free-camera image may supplement but never replace the gameplay-camera evidence.

## Occlusion Review Standard

Test every applicable case:

- player behind a building;
- opponent behind a building;
- vehicle behind a building;
- player close to a tall facade;
- foot-to-vehicle and vehicle-to-foot camera change;
- alley;
- courtyard or interior yard;
- intersection;
- building corner;
- multiple overlapping occluders;
- entry, fully occluded state, exit, and restored state;
- death/respawn or target change during occlusion.

Success requires:

- the player remains readable;
- relevant opponents and vehicles remain readable;
- only necessary render parts are hidden or made transparent;
- a complete building does not disappear without a documented exception;
- state restores correctly after exit or target change;
- no flicker or oscillation;
- no permanently hidden object;
- no incorrect hiding of neighbouring buildings;
- no avoidable hard pop boundary.

The review must cover continuous transitions, not only endpoints. If the project has no runtime occlusion treatment and the gameplay camera can lose the player behind scene geometry, Occlusion is a hard fail.

## Before/After Evidence Contract

Every visual correction round must provide:

- the approved reference target;
- a Before image;
- an After image;
- identical camera and world position;
- identical resolution and comparison profile;
- a short visible explanation of the improvement;
- the weakest remaining visible area.

Implementation quantities such as added light, prop, renderer, or file counts are not evidence of visual improvement.

## Required Visual Work Assignment Block

Every future visual work assignment or project-local equivalent must specify:

```text
Reference target:
Target scene/build:
Target resolution and gameplay camera:
Required comparison profiles:
Required camera position classes and route coverage:
Required occlusion cases:
Hard-fail criteria:
Blind Visual Review required: yes
Autonomous correction rounds: up to two within assigned scope
Before/After evidence location:
Human approval boundary:
Scope, asset, licence, architecture, purchase, and download stop conditions:
Allowed final internal status:
```

Omitting a field does not waive this workflow. The assignment must resolve the omission before claiming internal visual passage.
