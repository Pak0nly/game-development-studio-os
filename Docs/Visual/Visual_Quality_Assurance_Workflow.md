# Visual Quality Assurance Workflow

> **Status:** Adopted through LAIA-2026-07-22 on 2026-07-22.

This document is the project-independent Source of Truth for visual quality assurance, camera coverage, occlusion review, and visual evidence in the Studio Operating System.

It applies to the visible claims and risks of any task that creates or changes visible game content, including scenes, levels, environments, characters, vehicles, effects, lighting, materials, animation, cameras, or user interface presentation. The [Execution Modes and Stage Review Standard](../Production/EXECUTION_MODES_AND_STAGE_REVIEW_STANDARD.md) determines whether that task is new or structurally material lifecycle work, bounded production on an accepted baseline, diagnosis, or integration. Project standards may make the applicable visual checks more specific, but may not weaken representative evidence, hard fails, or Human approval.

## Authority and Approval Boundary

- The Human Developer owns art direction and final visual approval.
- An AI Agent or Work session owns implementation quality and internal review within its authorised scope.
- Technical validation is necessary but never constitutes visual approval.
- Internal visual review may reject visible work without changing the approved art direction.
- A correction that changes art direction, scope, architecture, licence boundaries, external dependencies, or a protected asset requires Human Developer direction.
- Formal correction authorisation and accounting are defined by the [Execution Modes and Stage Review Standard](../Production/EXECUTION_MODES_AND_STAGE_REVIEW_STANDARD.md). This workflow applies the Task-Delta Work Order's declared visual-stage allowance and does not authorise unrelated implementation.
- Larger visual or level assignments activate only the specialist roles whose distinct findings can change the current decision. Use the complete [Visual Level Review Board](../Roles/Boards/VISUAL_LEVEL_REVIEW_BOARD.md) only when the work is structurally material or every board domain is decision-relevant. Role outputs remain independent evidence inputs and do not replace this workflow or Human approval.

## Formative Work and Formal Review Readiness

Builder previews, look development, diagnostic captures, evidence-path checks, and ordinary in-scope iterations are formative. They do not require an immutable final package, formal verdict, or correction count after every change.

Formal visual review begins only after the candidate meets the [Definition of Ready](../Production/EXECUTION_MODES_AND_STAGE_REVIEW_STANDARD.md#definition-of-ready-for-formal-review). The formal evidence package identifies one exact candidate, the authorised baseline and delta, representative capture conditions, the primary player-facing claims, applicable hard fails, and the activated reviewers.

## Formal Review Scope Selection

Before evidence freeze, the Task-Delta Work Order and Producer / Scope Controller declare one of these review scopes. A narrower scope limits the passage claim; it does not weaken evidence validity, an observed hard fail, or Human approval.

### Bounded Stage-Exit Review

Use this scope for a bounded visible delta on an accepted baseline or a separately Human-authorised failed-stage candidate when the assignment does not claim complete visual passage.

The review must:

- assess every changed, newly claimed, or contradicted visual category;
- inspect the primary view and direct regression surface affected by the delta;
- apply applicable hard fails to the reviewed evidence and stop on any newly observed hard fail;
- run proportional technical and visual regression checks for dependencies the delta can affect; and
- cite unchanged valid baseline evidence by candidate/evidence ID and capture conditions instead of regenerating it, together with a current documented no-regression check.

Current candidate evidence must prove every current stage claim. Reused evidence is labelled `baseline reference — not current candidate evidence`; it proves only the unchanged control it originally validated and never proves a new claim or Full Visual Passage.

Full matrix scoring, complete camera matrices, full foot/vehicle routes, and complete occlusion sequences are not automatically required. They become required when the delta changes them, the Task-Delta Work Order claims them, current evidence contradicts the baseline, the baseline evidence is stale or semantically unsuitable, the work is structurally material, or the assignment requests Full Visual Passage.

A Bounded Stage-Exit Review may pass only the named stage and claims. It cannot claim that the complete scene or product has passed visual QA.

### Full Visual Passage

Use this scope for a whole-candidate visual passage claim, final internal visual handoff, new or structurally material visible work, changed camera/path/occlusion architecture, invalidated baseline coverage, or an explicit Task-Delta Work Order requirement.

Full Visual Passage requires the complete applicable quality matrix, all applicable camera position classes, required continuous foot/vehicle paths, required occlusion transitions, current candidate evidence, and every activated role needed by the complete decision surface.

## Required Five-Phase Formal Workflow

### Phase 1 — Builder Pass

Implement the authorised visual scope formatively and preserve its technical, provenance, licence, and project boundaries. Record the reference target, intended gameplay camera, target resolution, comparison profiles, and review routes before producing final evidence.

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

Review only the final rendered result within the declared review scope: final screenshots, the built Player when required, matched comparisons, the target resolution, and the actual gameplay camera. Do not use code structure, test counts, file counts, renderer counts, or frame rate to excuse a visible defect.

For Full Visual Passage, answer every question explicitly. For a Bounded Stage-Exit Review, answer every question that can change the named stage decision and mark the rest outside the passage claim rather than inventing evidence:

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

The reviewer must apply the hard-fail criteria and evidence scope defined above. Full Visual Passage scores the complete matrix and inspects full applicable camera/path/occlusion coverage. A Bounded Stage-Exit Review scores only changed, claimed, contradicted, or regression-relevant categories and cites still-valid baseline evidence for unchanged categories. A set of attractive showcase images does not replace gameplay-camera evidence when the passage claim requires it.

### Phase 4 — Internal Red-Team Correction

Within the authorised scope and declared visual stage, apply only the formal correction allowance declared under the Core standard:

1. complete the formative Builder Pass and satisfy Definition of Ready;
2. perform a valid blind visual review of the exact candidate;
3. correct the highest-impact in-scope visible failures;
4. regenerate matched affected evidence;
5. rerun only affected reviews;
6. make one further bounded correction when the stage allowance permits it; and
7. regenerate affected evidence and determine the internal status.

Evidence validity and correction consumption follow the Core standard. Diagnose and repair an invalid visual evidence path within the applicable attempt limit, preserve candidate identity, and do not issue a formal visual verdict until valid evidence exists.

Every formal correction comparison must retain the same reference target, camera, position, resolution, and comparison profile unless the assignment explicitly authorises changing one of them. Stop instead of improvising when a correction needs new art direction, scope, assets, licensing, architecture, purchases, downloads, or protected-source changes.

### Phase 5 — Final Internal Status

For Full Visual Passage, use exactly one of these statuses:

- `Technically Valid — Visual Review Failed`
- `Technically Valid — Visual Review Passed Internally, Human Approval Required`
- `Blocked by Human Art-Direction Decision`
- `Blocked by Scope, Asset, License or Technical Constraint`

Do not use `objectively visually complete`, `Visual Identity passed`, `near-final`, `visually complete`, or equivalent wording. Only the Human Developer may give final visual approval.

For a Bounded Stage-Exit Review, use exactly one of these statuses:

- `Bounded Stage Exit — Failed`
- `Bounded Stage Exit — Passed Internally, Full Visual Passage Not Claimed, Human Approval Required`
- `Bounded Stage Exit — Blocked by Human Art-Direction Decision`
- `Bounded Stage Exit — Blocked by Scope, Asset, License or Technical Constraint`

The status names only the reviewed stage and must identify which categories and evidence were reviewed or referenced.

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

A visible hard fail is blocking in the phase where it is observed. It cannot be carried to a later visual phase under `PASS WITH CONCERNS` on the assumption that polish will fix it. This includes Error Pink or other broken materials, unintended primitives or placeholders, open voids or unfinished endings, badly erroneous signage, and comparable visible failures. Only an explicit Human decision may authorise a documented exception.

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

Full Visual Passage requires:

- no hard fail;
- no category below `3`;
- Material response, Light and shadow readability, Stylistic coherence, Placeholder freedom, Camera coverage, and Occlusion at least `4`;
- current matched evidence for every scored category.

Bounded Stage-Exit passage requires:

- no applicable hard fail in the changed or affected evidence and no unresolved contradiction with referenced baseline evidence;
- every changed, claimed, contradicted, or regression-relevant category to meet the threshold applicable to the authorised stage;
- no material regression in directly affected unchanged categories; and
- current evidence for reviewed categories plus exact references to still-valid baseline evidence for unchanged categories.

Bounded passage does not establish complete-scene Visual QA passage.

## Camera, Path, and Occlusion Evidence Scope

Full Visual Passage requires complete applicable current coverage under the sections below.

A Bounded Stage-Exit Review regenerates or extends camera, path, or occlusion evidence only when that domain is changed, claimed, contradicted, structurally affected, invalidated by candidate drift, or explicitly required by the Task-Delta Work Order. Otherwise it may reference unchanged valid baseline rows, routes, and sequences by candidate ID, evidence ID, capture conditions, continued applicability, and a current documented no-regression check. Label every citation `baseline reference — not current candidate evidence`. A proportional regression view is still required wherever the visible delta could obstruct or devalue a previously passed route, actor, or camera relationship.

## Camera Coverage Standard

### Required Position Classes

For Full Visual Passage, include every applicable class. For a Bounded Stage-Exit Review, include every class triggered by the evidence-scope rule above:

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

Full Visual Passage maintains a current matrix with these fields. A Bounded Stage-Exit Review updates affected rows and references unchanged valid baseline rows:

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

When path evidence is required by the declared review scope, still images are insufficient. For Full Visual Passage, test at minimum one defined foot route and one defined driving route when those modes exist. For a Bounded Stage-Exit Review, rerun only the routes the delta can affect or whose baseline evidence is invalidated. Observe continuously:

1. approach to a critical occluder;
2. entry into occlusion;
3. state while behind the occluder;
4. exit from occlusion;
5. correct restoration and renewed visibility.

If reliable video is unavailable, capture a tightly spaced timestamped or numbered sequence with unchanged camera settings. A planning or free-camera image may supplement but never replace the gameplay-camera evidence.

## Occlusion Review Standard

For Full Visual Passage, test every applicable case. For a Bounded Stage-Exit Review, test every case triggered by the evidence-scope rule and reference unchanged valid baseline cases:

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

Every formal visual correction round must provide:

- the approved reference target;
- a Before image;
- an After image;
- identical camera and world position;
- identical resolution and comparison profile;
- a short visible explanation of the improvement;
- the weakest remaining visible area.

Implementation quantities such as added light, prop, renderer, or file counts are not evidence of visual improvement.

## Visual Task-Delta

Use the [Task-Delta Work Order Template](../Templates/WORK_ORDER_ROLE_AND_REVIEW_BLOCK.md) with the [Visual Production Playbook](../Playbooks/VISUAL_PRODUCTION.md). Keep only task-specific visual controls in the Task-Delta Work Order:

- under `Authoritative baseline`: reference target, exact scene/build, gameplay camera, and comparison conditions;
- under `Known current findings`: the visible symptoms and accepted concerns that actually affect this stage;
- under `Done when`: primary visual claims, relevant camera/route/occlusion coverage, applicable hard fails, evidence IDs and location, and allowed internal status;
- under `Required stage-exit reviews`: only decision-relevant roles and their distinct questions; and
- under `Correction allowance` and `Human checkpoint`: the named stage-local allowance and applicable stop/approval boundary.

Omitting a relevant control does not waive this workflow. It must be resolved before Definition of Ready or internal visual passage.
