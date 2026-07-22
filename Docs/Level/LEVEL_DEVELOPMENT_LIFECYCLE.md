# Level Development Lifecycle

> **Status:** Adopted through LAIA-2026-07-22 on 2026-07-22.

## Purpose and Applicability

This Studio OS lifecycle governs AI-assisted creation of new playable level areas and structurally material revisions of accepted areas. It is project-independent and applies from first intent through Human review when the assignment changes layout structure, routes, gameplay-space relationships, functional zoning, boundaries, camera architecture, or another dependency that later production could conceal. Project standards may make an applicable gate stricter but may not remove it, weaken a hard fail, or permit later polish to conceal an earlier structural defect.

Ordinary bounded production on an accepted baseline does not restart this ten-phase lifecycle. It follows the applicable mode and playbook under the [Execution Modes and Stage Review Standard](../Production/EXECUTION_MODES_AND_STAGE_REVIEW_STANDARD.md). Diagnostic work stops after causal disposition; Integration work uses technical integrity checks. If either exposes a structural defect or requires a structural change, stop and reopen the earliest affected lifecycle gate under explicit scope.

Use this lifecycle with the [Role Operating Model](../Roles/ROLE_OPERATING_MODEL.md), [Review Board Protocol](../Roles/REVIEW_BOARD_PROTOCOL.md), [Level Design Review Standard](LEVEL_DESIGN_REVIEW_STANDARD.md), [Environment Realism Reference Standard](ENVIRONMENT_REALISM_REFERENCE_STANDARD.md), [Visual Quality Assurance Workflow](../Visual/Visual_Quality_Assurance_Workflow.md), and [Asset Candidate and Integration Standard](../Assets/ASSET_CANDIDATE_AND_INTEGRATION_STANDARD.md).

## Core Rules

1. **Sequence is mandatory.** A phase may start only after the prior phase gate passes.
2. **Structure before finish.** Asset integration, dressing, materials, and lighting cannot be used to rescue unresolved intent, function, gameplay, scale, route, camera, or boundary failures.
3. **Gameplay may override literal realism.** A deliberate adaptation for readability, navigation, action, accessibility, camera, performance, or fun is valid when its benefit and side effects are recorded.
4. **Causality before decoration.** Zones, services, props, wear, repair, access, and boundaries require a functional or gameplay cause.
5. **Independent review is mandatory.** The accountable builder cannot be the only reviewer. Every activated role uses the [Role Review Output Schema](../Roles/ROLE_REVIEW_OUTPUT_SCHEMA.md).
6. **FAIL blocks progression.** The Producer may block for scope, process, evidence, or unresolved dependencies but may not soften or overrule a specialist `FAIL`.
7. **Reopen the source gate.** If later evidence exposes an earlier structural defect, stop later work, reopen the earliest affected phase, invalidate dependent evidence, and repeat only the affected gates.
8. **Human attention stays selective.** Escalate product direction, taste, equivalent design alternatives, scope expansion, budget, purchases, licence risk, or final approval. Do not escalate a clear in-scope defect.
9. **Correction is bounded and stage-local.** Correction authorisation and consumption follow the [Execution Modes and Stage Review Standard](../Production/EXECUTION_MODES_AND_STAGE_REVIEW_STANDARD.md). Each independent lifecycle gate records and applies its own declared allowance.
10. **Evidence must prove its claim.** Each evidence item names its claim and candidate. Its method must execute or observe the claimed behaviour; a proxy, count, label, or static artifact cannot substitute for required semantic or continuous evidence.

## Gate Mechanics

At every phase, the Producer records the exact reviewed version, active roles, separate verdicts, evidence references, open concerns, and transition decision. Transition is permitted only when:

- every mandatory applicable role has reviewed the current version;
- no mandatory role reports `FAIL`;
- no hard fail or stop condition remains open;
- remaining concerns do not invalidate the next phase;
- any required Human decision is resolved; and
- the next phase is still inside the authorised Task-Delta Work Order.

`PASS WITH CONCERNS` permits transition only when each concern has an owner, a later validation point, and no risk of being concealed by later work. `BLOCKED BY HUMAN DECISION` creates a blocked handoff, not a transition.

Before passage, the accountable owner and QA Lead answer for every gate-critical claim: What is the exact claim? Does the method execute or observe it? Does the result prove passage rather than a proxy? Does it belong to the current candidate and was it regenerated after relevant changes? Is a continuous sequence required? Do visible or technical artifacts contradict the claim? A complete file list or large evidence volume cannot answer these questions by itself.

The evidence manifest must be current before transition: candidate identity is confirmed; current, superseded, and missing evidence are explicit; and separate schema-compliant role verdicts are linked. A later manifest edit cannot retroactively heal an invalid gate passage.

A visible hard fail blocks the gate where it is present and cannot be carried into a later visual phase under `PASS WITH CONCERNS`. Only an explicit Human exception may permit the documented deviation; expected later repair is not an exception.

## Responsibility Model

The accountable phase owner owns the phase decision, not every implementation action. The Producer owns scope and consolidation only. The Human Developer owns product, taste, budget, scope expansion, purchase, and final approval.

| Role or responsibility | Lifecycle responsibility | Blocking authority |
|---|---|---|
| Art Director | Visual intent, composition, identity, material and lighting direction | May fail applicable visual or art-direction criteria |
| Level Designer | Use logic, scale, routes, gameplay layout, spatial sequence, boundaries | May fail applicable spatial or gameplay-layout criteria |
| Environmental Storytelling / World Design responsibility | Intent, users, occupation, visible causality, environmental story | The existing Narrative / Worldbuilding Reviewer may fail applicable coherence criteria; a project may name a builder function without creating a new governance role |
| Technical Artist | Technical feasibility of visual composition, materials, lighting, LOD, occlusion, and budgets | May fail applicable technical-art criteria |
| Asset & Provenance Manager | Asset suitability, coverage, licence/provenance, integrity, and reproducibility | May fail applicable asset or provenance criteria |
| Camera & Occlusion Reviewer | Gameplay-camera coverage, continuous transitions, and restoration | May fail applicable camera or occlusion criteria |
| Gameplay QA Reviewer | Representative traversal, interaction, recovery, and gameplay readability | May fail applicable gameplay evidence |
| Unity Specialist | Unity-specific scene, serialization, package, import, and build correctness when Unity is used | May fail applicable Unity criteria |
| QA Lead | Acceptance coverage, evidence quality, version identity, regression, and final gate integrity | May fail missing or invalid validation evidence |
| Producer / Scope Controller | Scope, dependencies, activation, correction limits, consolidation, and handoff readiness | May block scope/process/evidence; cannot overrule another role |

## Lifecycle Phases

### 1. Environmental Intent

| Field | Requirement |
|---|---|
| Objective | Establish why the place exists, who uses it, what gameplay it serves, and what visual experience it should communicate. |
| Allowed work | Reference gathering; intent drafting; zone hypotheses; gameplay-purpose definition; realism adaptations; risk and unknown identification. |
| Not allowed | Layout production, grayboxing, asset selection, dressing, material work, or lighting implementation. |
| Decision owner | Level Designer owns the phase gate. Environmental Storytelling / World Design owns place logic and Art Director owns visual intent; no domain owner may waive another domain's fail. |
| Reviewers | Level Designer, Art Director, Game Design Reviewer when mechanics are affected, Narrative / Worldbuilding Reviewer when world or story claims are present, Producer. |
| Blocking verdict holders | Level Designer, Art Director, each activated Game Design or Narrative / Worldbuilding Reviewer for its domain, and Producer for scope/process/evidence. |
| Required decisions | Primary and secondary use; users and time pattern; gameplay function; mood and visual story; intended realism adaptations; zone boundaries and unknowns. |
| Human decisions | New or changed product premise, art direction, world/lore claim, taste target, or scope. None when the record applies already approved direction. |
| Evidence | Completed [Environmental Intent record](ENVIRONMENTAL_INTENT_STANDARD.md), bounded references, assumptions/inferences labels, initial risk list. |
| Pass criteria | Every required intent question is answered; gameplay purpose and realism adaptations are explicit; no incompatible product assumption is hidden. |
| Fail criteria | Place exists only as decoration; use or player purpose is undefined; mood contradicts approved direction; realism is treated as an absolute requirement. |
| Stop conditions | New product direction, lore, art direction, external research/download, purchase, or unresolved authoritative contradiction is required. |
| Allowed transition | Producer records passage to Phase 2 after separate intent, gameplay, and visual reviews pass. |

### 2. Urban and Functional Planning

| Field | Requirement |
|---|---|
| Objective | Convert intent into causally related zones, access, circulation, services, infrastructure, and credible boundaries. |
| Allowed work | Annotated functional plan; front/back/service logic; access and desire lines; parking/loading/waste/utilities; maintenance states; boundary causes; scale ranges. |
| Not allowed | Detailed encounter tuning, production graybox, asset placement, decorative prop plans without causes, materials, or lighting. |
| Decision owner | Level Designer. |
| Reviewers | Environmental Storytelling / World Design responsibility, Art Director, Asset & Provenance Manager for likely family constraints, Camera & Occlusion Reviewer for early hazards, Producer. |
| Blocking verdict holders | Level Designer; Art Director, Asset & Provenance Manager, and Camera & Occlusion Reviewer for applicable domain failures; Producer for scope/process/evidence. |
| Required decisions | Zone function; adjacency; public/service access; foot and vehicle logic; infrastructure; active/closed/abandoned state; boundary rationale; simplifications for gameplay. |
| Human decisions | Only an intentional product, world, taste, or gameplay trade-off not resolved by approved direction, or material scope expansion. |
| Evidence | Annotated functional plan, causal placement notes using the [Urban and Functional Reasoning Standard](URBAN_AND_FUNCTIONAL_REASONING_STANDARD.md), scale references, unresolved constraint list. |
| Pass criteria | Every major zone and infrastructure element has a use or gameplay cause; access and boundaries are credible; simplifications remain playable and readable. |
| Fail criteria | Decorative zoning; unreachable service/loading area; parking or waste without users/access; contradictory building function; unexplained map edge. |
| Stop conditions | Required function conflicts with approved gameplay, camera, scope, legal/cultural claim, or available asset strategy and no bounded adaptation exists. |
| Allowed transition | Phase 3 may start only from the approved functional plan; later layout changes that alter function reopen this gate. |

### 3. Gameplay Layout

| Field | Requirement |
|---|---|
| Objective | Turn the functional plan into playable routes, choices, encounters, pacing, landmarks, spawns, and recovery space. |
| Allowed work | 2D/3D schematic layout; route hierarchy; encounter and objective zones; cover/hazard intent; sightlines; spawn/respawn logic; camera envelopes; gameplay-driven realism adaptations. |
| Not allowed | Production geometry, final asset selection, detailed composition, dressing, materials, or lighting polish. |
| Decision owner | Level Designer. |
| Reviewers | Game Design Reviewer, Gameplay QA Reviewer, Camera & Occlusion Reviewer, Art Director for landmark/hierarchy intent, Producer. |
| Blocking verdict holders | Level Designer and every activated reviewer for its applicable domain; Producer for scope/process/evidence. |
| Required decisions | Primary/secondary/service/escape routes; critical choices and chokepoints; vehicle/foot relations; spawns; landmarks; camera constraints; intended pacing. |
| Human decisions | Competing player-experience, product, camera-policy, or scope alternatives that approved direction does not resolve. |
| Evidence | Annotated layout, route and sightline maps, spawn analysis, representative player scenarios, decision records for structural trade-offs. |
| Pass criteria | Required play supports viable routes and recovery; critical spaces are legible; no accidental dominant choke or camera-hostile requirement remains. |
| Fail criteria | Critical route unusable; required mode trapped; unavoidable spawn exposure; unclear navigation; realism removes needed play; layout ignores camera or occlusion. |
| Stop conditions | Passage requires a new mechanic, camera policy, product choice, material scope increase, or unsupported performance assumption. |
| Allowed transition | Only the passed layout envelope may be grayboxed; material layout changes reopen this gate. |

### 4. Spatial Graybox

| Field | Requirement |
|---|---|
| Objective | Prove scale, traversal, route choice, sightlines, boundaries, camera behaviour, and representative gameplay before asset integration. |
| Allowed work | Simple project-owned geometry; collision; navigation aids; spawn markers; camera tests; representative foot/vehicle traversal; temporary diagnostic labels. |
| Not allowed | Store/package art, production props, final materials, mood lighting, visual effects, or dressing used to disguise spatial weakness. |
| Decision owner | Level Designer. |
| Reviewers | Gameplay QA Reviewer, Camera & Occlusion Reviewer, Unity Specialist or engine equivalent, QA Lead, Producer; Game Design Reviewer when encounter rules are tested. |
| Blocking verdict holders | Level Designer and every activated reviewer for its applicable domain; Producer for scope/process/evidence. |
| Required decisions | Final graybox scale and footprint; route widths/grades; entrances/exits; sightlines; gameplay-space dimensions; boundary geometry; camera/occlusion response. |
| Human decisions | Only a required layout/product trade-off, camera architecture change, engine-baseline change, or scope expansion. |
| Evidence | Playable graybox identity; scale captures; annotated plan; continuous foot and vehicle routes where applicable; spawn/boundary tests; initial camera coverage matrix. |
| Pass criteria | Representative play succeeds from gameplay cameras; scale and routes meet intent; boundaries are closed; camera/occlusion risks have a feasible bounded treatment. |
| Fail criteria | Traversal or collision failure; scale mismatch; dead route; accidental void/trap; critical actor or route unreadable; graybox needs art to explain navigation. |
| Stop conditions | Fix requires layout expansion, camera architecture change, new system, engine baseline change, or a correction beyond the declared stage allowance. |
| Allowed transition | Asset or composition work is forbidden until the graybox gate passes on the current layout. |

### 5. Visual Composition Blockout

| Field | Requirement |
|---|---|
| Objective | Prove massing, silhouette, landmark hierarchy, negative space, density bands, gameplay-distance readability, and asset strategy without final dressing. |
| Allowed work | Simple composition masses; approved prototype candidates or project-owned proxies; palette/value blocks; landmark and focal tests; representative camera captures. |
| Not allowed | Broad final asset integration, micro-props, weathering, decal passes, final materials, final lighting, or hiding graybox defects. |
| Decision owner | Art Director. |
| Reviewers | Level Designer, Technical Artist, Asset & Provenance Manager, Camera & Occlusion Reviewer, Gameplay QA Reviewer, QA Lead, Producer. |
| Blocking verdict holders | Art Director and every activated reviewer for its applicable domain; Producer for scope/process/evidence. |
| Required decisions | Visual hierarchy; dominant/supporting masses; landmark treatment; density zones; negative space; candidate asset families; camera-safe silhouettes. |
| Human decisions | New or changed Art Direction, taste choice between equivalent compositions, purchase/download, licence-risk acceptance, or scope expansion. |
| Evidence | Matched gameplay-camera blockout captures, composition annotations, value/palette study, asset-family coverage and provenance state, updated camera matrix. |
| Pass criteria | Approved intent is visible at gameplay distance; spatial readability survives the composition; asset strategy is suitable and traceable; no unresolved structural defect is being covered. |
| Fail criteria | Test-scene or arbitrary-kit appearance; focal hierarchy absent; required routes obscured; incompatible asset family; package use begins before required inventory. |
| Stop conditions | New purchase/download, art-direction choice, protected-source edit, unknown provenance, or structural rework is required. |
| Allowed transition | Only passed composition zones and asset families may enter functional dressing. |

### 6. Functional Dressing

| Field | Requirement |
|---|---|
| Objective | Add infrastructure, fixtures, large props, and occupancy evidence required by actual use and gameplay. |
| Allowed work | Service/loading/waste/parking elements; utilities; barriers; signage structures; gameplay cover/hazards; circulation-supporting props; project-owned variants. |
| Not allowed | Random clutter; narrative micro-detail; final wear/decal pass; final materials/lighting; props that block passed routes or conceal empty structure. |
| Decision owner | Level Designer for function and gameplay; Art Director owns visual exceptions. |
| Reviewers | Environmental Storytelling / World Design responsibility, Technical Artist, Asset & Provenance Manager, Camera & Occlusion Reviewer, Gameplay QA Reviewer, Producer. |
| Blocking verdict holders | Level Designer, Art Director for an applicable visual exception, and every activated reviewer for its domain; Producer for scope/process/evidence. |
| Required decisions | Each major prop family purpose; density limits; access clearances; repetition limits; interaction/collision state; active/closed/abandoned signals. |
| Human decisions | New asset direction, purchase/download, licence-risk acceptance, protected-source exception, taste choice, or material scope expansion. |
| Evidence | Annotated use-to-prop map, asset/provenance manifest, gameplay captures, updated routes and camera/occlusion evidence, performance spot check when risk changes. |
| Pass criteria | Major placements follow function or gameplay; traversal and readability remain intact; required infrastructure is present; repetition is controlled. |
| Fail criteria | Decorative scatter; implausible access; route/camera obstruction; unknown asset source; edited protected original; density used to hide weak composition. |
| Stop conditions | Required family is unavailable, purchase/download or licence decision is needed, or dressing exposes an earlier gate failure. |
| Allowed transition | Environmental storytelling may refine only the passed functional layer; missing functional causes cannot be invented through decals or clutter. |

### 7. Environmental Storytelling

| Field | Requirement |
|---|---|
| Objective | Communicate users, events, maintenance, change, and occupation through readable cause-and-effect detail. |
| Allowed work | Use traces; localized wear, repair, neglect, security, temporary occupation, residue, signage content within approved direction, and small narrative clusters. |
| Not allowed | New major lore, random grime, universal damage, decorative storytelling that contradicts function, route obstruction, or final lighting compensation. |
| Decision owner | Environmental Storytelling / World Design responsibility. |
| Reviewers | Narrative / Worldbuilding Reviewer when applicable, Art Director, Level Designer, Gameplay QA Reviewer, Asset & Provenance Manager, Producer. |
| Blocking verdict holders | The accountable Environmental Storytelling / World Design builder function plus every activated reviewer for its applicable domain; Producer for scope/process/evidence. A builder finding still requires independent review. |
| Required decisions | Story beats by zone; cause, actor, timing, and visibility of each major cluster; what remains intentionally quiet; gameplay relevance or non-interference. |
| Human decisions | New lore, tone, cultural claim, focal narrative direction, taste choice, or scope/asset expansion. |
| Evidence | Zone story map, cause-to-trace annotations, gameplay-distance captures, decision records for focal narrative/style choices. |
| Pass criteria | Major traces have plausible causes and are distinguishable where required; story supports intent and remains readable without harming gameplay. |
| Fail criteria | Random detail; contradictory era/use; active/closed/abandoned states indistinguishable; focal story depends on invisible detail; unapproved lore claim. |
| Stop conditions | New lore/tone decision, culturally or legally material claim, new asset scope, or earlier functional contradiction is required. |
| Allowed transition | Materials and lighting may reinforce passed causes but may not create a substitute story or hide incoherence. |

### 8. Materials and Lighting

| Field | Requirement |
|---|---|
| Objective | Deliver the approved material language, believable sources, mood, hierarchy, profile distinction, and gameplay readability within technical budgets. |
| Allowed work | Project-owned material variants; textures and decals within provenance; practical/source lighting; exposure and profile tuning; measured optimization that preserves intent. |
| Not allowed | Structural geometry changes hidden as polish; abstract emission instead of required sources; protected-original edits; unapproved style change; crushing gameplay readability for mood. |
| Decision owner | Art Director owns the phase gate and appearance. Technical Artist owns implementation method and constraint compliance; neither may waive the other's applicable fail. |
| Reviewers | Level Designer, Camera & Occlusion Reviewer, Gameplay QA Reviewer, Asset & Provenance Manager, Unity Specialist or engine equivalent, QA Lead, Producer. |
| Blocking verdict holders | Art Director, Technical Artist, and every activated reviewer for its applicable domain; Producer for scope/process/evidence. |
| Required decisions | Material families and response; source hierarchy; mood/readability balance; comparison profiles; adaptation/override paths; performance treatment. |
| Human decisions | New or changed Art Direction, taste choice, quality/performance trade-off, new asset/purchase/download, protected-source exception, architecture change, or scope expansion. |
| Evidence | Matched gameplay captures, material/import inspection, visible-source mapping, comparison profiles, performance baseline, integrity/override record, updated camera/occlusion sequences. |
| Pass criteria | Materials and light read correctly at gameplay distance; required sources are visible; routes/actors remain readable; profiles differ; technical and provenance constraints pass. |
| Fail criteria | Error/missing material; crushed/overexposed critical area; invisible required detail; implausible source; indistinguishable profile; style break; unacceptable regression. |
| Stop conditions | Meeting appearance requires new art direction, architecture, asset/download/purchase, protected-source change, or performance/quality trade-off owned by the Human. |
| Allowed transition | Phase 9 receives a frozen QA candidate; any later visible change invalidates affected evidence. |

### 9. Technical and Visual QA

| Field | Requirement |
|---|---|
| Objective | Validate the exact candidate technically, visually, spatially, through gameplay, and against provenance and evidence requirements. |
| Allowed work | Required technical validation; blind visual review; role reviews; gameplay routes; camera/occlusion matrix; regression tests; and only the declared Core correction allowance after a valid review. |
| Not allowed | New content direction, feature expansion, evidence from superseded versions, averaging verdicts, or treating technical passage as visual passage. |
| Decision owner | QA Lead owns evidence adequacy; each mandatory specialist owns its domain verdict; Producer consolidates without overrule. |
| Reviewers | Full [Visual Level Review Board](../Roles/Boards/VISUAL_LEVEL_REVIEW_BOARD.md); Unity Specialist when Unity is used; other conditional roles when their domains changed. |
| Blocking verdict holders | Every mandatory applicable specialist, QA Lead, and Producer within their defined authorities. No verdict may be averaged or overruled. |
| Required decisions | Exact candidate identity; hard-fail state; matrix scores; regression scope; final role verdicts; correction need; weakest remaining area; Human-review readiness. |
| Human decisions | Only an unresolved product/taste trade-off, exception, architecture/scope/budget/purchase/licence decision, or authority conflict. In-scope defects and missing evidence remain Work responsibilities. |
| Evidence | Technical results; final gameplay-camera evidence; coverage matrix and continuous routes; provenance/integrity record; Visual QA matrix; correction trace; separate role outputs. |
| Pass criteria | No hard fail; Visual QA thresholds pass; all mandatory applicable roles are at least `PASS WITH CONCERNS`; evidence matches the final candidate. |
| Fail criteria | Any mandatory `FAIL`; missing or stale evidence; open hard fail; failed required route/camera/occlusion state; unresolved in-scope defect; correction beyond the declared stage allowance needed. |
| Stop conditions | Correction needs new authority or exceeds the declared stage allowance; role verdicts conflict on a product/taste trade-off; protected source, licence, purchase, or architecture change is needed. |
| Allowed transition | Human review is allowed only with the Visual QA internal-passage status or a clearly labelled blocked Human-decision package. |

### 10. Human Review

| Field | Requirement |
|---|---|
| Objective | Obtain the Human Developer's product, taste, priority, exception, and final visual acceptance decisions on a reviewable candidate. |
| Allowed work | Present concise final evidence, weakest area, role verdicts, trade-offs, explicit decisions, and recommended next step. |
| Not allowed | Silent implementation changes, softened failures, technical claims presented as taste approval, or asking the Human to diagnose a clear in-scope defect. |
| Decision owner | Human Developer. |
| Reviewers | Producer prepares the package; accountable phase owners and QA Lead supply findings. |
| Blocking verdict holders | Human Developer may accept, reject, narrow, or redirect. Existing specialist `FAIL` verdicts remain visible and cannot be waived by the Producer. |
| Required decisions | Accept/reject the candidate for its stated stage; choose among genuine taste/product alternatives; approve/deny exceptions or next scope. |
| Human decisions | Final visual acceptance for the stated stage, product/taste choices, exceptions, priorities, and authorisation of any subsequent work. |
| Evidence | Exact candidate identity, compact evidence manifest, separate final verdicts, unresolved risks, weakest area, decision records, and proposed next Task-Delta Work Order. |
| Pass criteria | Human decision is recorded with its scope; no specialist `FAIL` is hidden; any conditional acceptance has explicit conditions and next owner. |
| Fail criteria | Human rejects the result; package is incomplete or misleading; final candidate differs from the reviewed candidate. |
| Stop conditions | Decision is withheld, scope is redirected, or a new Task-Delta Work Order is required. |
| Allowed transition | No production continuation is implied. Subsequent work requires the recorded Human decision and an authorised Task-Delta Work Order. |

## Phase Evidence Manifest

Use one manifest rather than copying evidence into every review:

| Field | Requirement |
|---|---|
| Phase and candidate ID | Stable phase, version, scene/build, branch, or document revision identity |
| Authoritative inputs | Links to approved project and Studio OS sources |
| Decisions | Links to material [Level Decision Records](../Templates/LEVEL_DECISION_RECORD_TEMPLATE.md) |
| Evidence | Paths/IDs, capture conditions, author, date, and what each item proves |
| Active roles | Builder, mandatory reviewers, optional reviewers, and justified `NOT APPLICABLE` entries |
| Verdicts | Separate role outputs and consolidation result |
| Corrections | Round number, changed findings/files, replaced evidence, and re-reviews |
| Transition | Passed, failed, or blocked; next permitted phase or exact stop reason |

## Minimum Task-Delta Work Order Requirement

Every lifecycle assignment uses the [Task-Delta Work Order Template](../Templates/WORK_ORDER_ROLE_AND_REVIEW_BLOCK.md) and records phase-specific claims, roles, evidence, hard fails, and corrections in the phase manifest. Visible implementation also applies the [Visual Quality Assurance Workflow](../Visual/Visual_Quality_Assurance_Workflow.md). The reusable structural pilot form is [New Map Slice — Process Validation](../Templates/NEW_MAP_SLICE_PROCESS_VALIDATION_WORK_ORDER_TEMPLATE.md).
