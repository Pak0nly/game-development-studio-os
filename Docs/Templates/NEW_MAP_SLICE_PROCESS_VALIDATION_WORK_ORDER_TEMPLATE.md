# Task-Delta Work Order Template — New Map Slice — Process Validation

> **Status:** Adopted through LAIA-2026-07-22 on 2026-07-22; amended through
> `SOS-GOV-AAPEC-V1` on 2026-07-29.

This reusable template prepares a bounded future map-slice pilot that validates the [Level Development Lifecycle](../Level/LEVEL_DEVELOPMENT_LIFECYCLE.md). It does not authorise Crime99 work, Unity work, asset integration, downloads, purchases, or production by itself.

## Task-Delta Assignment

```text
Assignment: New Map Slice — Process Validation
Execution mode: Production — new or structurally material level work; complete Level Development Lifecycle applies
Objective:
Authoritative baseline:
Allowed changes:
Frozen / out of scope:
Known current findings:
Applicable playbooks or skills:
Done when:
Required stage-exit reviews:
Correction allowance: record 0, 1, or 2 separately for each formal lifecycle gate
Human checkpoint:
Environment composition applicability: required
Asset Awareness declaration:
Spatial Purpose declaration:
Host Validation ledger:
Modular Proof declaration:
Placeholder Control declaration:
Visual-purpose hard fails:
Earliest gate to reopen if a declaration fails:
```

This structural pilot uses the complete Lifecycle and the full Visual Level Review Board at the final cross-domain QA gate. Earlier gates activate only the roles listed by the Lifecycle phase whose distinct findings can change passage. Add Unity Specialist when Unity is decision-relevant. Add Game Design Reviewer and Narrative / Worldbuilding Reviewer when their domains are material. The Builder may not be the sole reviewer.

## Pilot Inputs

```text
Approved project and art direction:
Approved gameplay mechanics and camera policy:
Target area and boundaries:
Target scene/build:
Target resolution and gameplay camera:
Required comparison profiles:
Required camera position classes and route coverage:
Required occlusion cases:
Approved asset/provenance boundary:
Reference source policy:
Performance and platform constraints:
Evidence manifest location:
Manifest candidate, supersession, and missing-evidence rule:
Decision record location:
Role review output location:
Before/After evidence location:
```

## Environment Composition Gate

Complete the full declaration formats in the
[Task-Delta Work Order Template](WORK_ORDER_ROLE_AND_REVIEW_BLOCK.md) before
the applicable phase begins.

| Declaration | Required before | Passage condition |
|---|---|---|
| Asset Awareness | Phase 5 composition | Relevant families and candidates are inspected as a functional vocabulary; Vendor/project-owned boundaries and limitations are explicit |
| Spatial Purpose | Phase 2 planning | Location function, users, circulation, entrances, services, maintenance, gameplay, camera and accessibility constraints are coherent |
| Host Validation | Phase 6 dressing | Every retained or new prop has an exact host, purpose, orientation, clearance and user/gameplay rationale; otherwise remove or do not place |
| Modular Proof | Broad Phase 5 or 6 family use | Applicable corners, endings, entrances, interruptions, transitions, closures, contact, colliders, snapping and repetition are proven |
| Placeholder Control | Before any visible placeholder is created | Existing assets and modular composition are insufficient; bounded purpose, expiry, owner/gate and visual consequence are recorded |

Any failed declaration reopens or blocks the earliest affected lifecycle gate.
Props, materials, decals, wear and lighting cannot compensate for passage.

## Phase Plan and Stop Gates

Fill each row before its phase starts. A passed earlier phase is an input; later work cannot compensate for its failure.

| Phase | Accountable owner | Required outputs/evidence | Mandatory reviewers for this pilot | Model class by task/risk | Stop gate and passage record |
|---|---|---|---|---|---|
| 1. Environmental Intent | Environmental Storytelling / World Design responsibility; Level Designer for gameplay; Art Director for visual intent | Completed intent record, references, adaptations, risks | Level, Art, Producer; Design and Narr/World when applicable | Critical for new direction; Standard for bounded synthesis; Routine for reference indexing | No planning until use, gameplay, mood, and adaptations pass |
| 2. Urban and Functional Planning | Level Designer | Functional plan, access/services/infrastructure, causal notes, boundaries | Level, Art, Producer; Asset and Cam/Occl for early constraints | Standard; Critical for irreversible structural trade-off | No gameplay layout until major zones have causes and access |
| 3. Gameplay Layout | Level Designer | Routes, encounters, spawns, sightlines, camera envelopes, decision records | Level, Design, Gameplay QA, Cam/Occl, Art, Producer | Standard; Critical for irreversible layout/product choice | No graybox until required play and camera logic pass |
| 4. Spatial Graybox | Level Designer | Playable graybox, scale, continuous foot/vehicle behaviour, boundaries, camera/occlusion sequence, reset/respawn/target-switch outcomes | Level, Gameplay QA, Cam/Occl, QA, engine specialist, Producer | Standard; Routine for deterministic generation only; independent semantic review remains mandatory | No assets/composition until the evidence method proves every required behaviour on the current candidate |
| 5. Visual Composition Blockout | Art Director | Massing, hierarchy, density/value studies, qualified asset vocabulary, modular proof matrix, controlled placeholder declarations | Art, Level, Tech Art, Asset, Cam/Occl, Gameplay QA, QA, Producer | Critical for Art Direction; Standard for approved-direction blockout | No dressing until composition, asset qualification, modular proof and placeholder controls pass |
| 6. Functional Dressing | Level Designer | Use-to-prop map, per-prop host ledger, infrastructure, manifest, traversal/camera regression | Level, Art, Tech Art, Asset, Cam/Occl, Gameplay QA, Producer | Standard; Routine for manifests/checklists | No storytelling pass while purpose, host, circulation, clearance, provenance or repetition fails |
| 7. Environmental Storytelling | Environmental Storytelling / World Design responsibility | Zone story map, cause-to-trace notes, gameplay captures | Narr/World when applicable, Art, Level, Gameplay QA, Asset, Producer | Standard; Critical for new lore/tone | No material/light reinforcement of an incoherent story |
| 8. Materials and Lighting | Art Director and Technical Artist in their domains | Material/source map, profiles, captures, performance and integrity evidence | Art, Tech Art, Level, Asset, Cam/Occl, Gameplay QA, QA, engine specialist, Producer | Critical for direction/trade-off; Standard for implementation; Routine for checks | Freeze one candidate only after visual and technical criteria pass |
| 9. Technical and Visual QA | QA Lead; specialists own verdicts; Producer consolidates | Full final evidence, Visual QA matrix, routes, camera/occlusion, tests, separate verdicts | Full activated Visual Level Review Board plus engine/conditional roles | Routine for deterministic tests; Standard for bounded reviews; Critical for conflicts/root cause | Any mandatory FAIL, hard fail, stale evidence, or third-round need blocks Human handoff |
| 10. Human Review | Human Developer | Compact package, verdicts, weakest area, risks, explicit decisions, next proposal | Producer prepares; accountable owners and QA support | Critical synthesis; no autonomous Human-owned decision | No continuation without recorded decision and new/continued authority |

## Routing and Visual Evidence

Use the [AI Model Routing and Compute Efficiency Standard](../AI/AI_MODEL_ROUTING_AND_COMPUTE_EFFICIENCY_STANDARD.md) for the task records; do not duplicate its classification policy here. Use the [Visual Quality Assurance Workflow](../Visual/Visual_Quality_Assurance_Workflow.md) and record only the pilot-specific reference target, candidate, cameras, routes, occlusion cases, hard fails, evidence IDs, and internal status under `Done when` and in the phase manifest.

## Phase Gate Record

```text
Phase and candidate ID:
Accountable owner:
Active roles and NOT APPLICABLE reasons:
Evidence manifest:
Exact claims and method-to-artifact checks:
Current, superseded, and missing evidence:
Separate role verdicts:
Hard fails:
Concerns carried forward, owner, and validation phase:
Correction stage allowance and rounds used:
Invalid-evidence incidents and disposition:
Human decisions:
Gate result: passed / failed / blocked
Next permitted phase or exact stop reason:
```

Before recording passage, answer: What is each exact claim? Does the method execute or observe it? Does the result prove passage rather than a proxy? Is it the current candidate and regenerated after relevant changes? Is a continuous sequence required? Does any visible or technical artifact contradict it? Update the manifest and separate verdicts before transition; a later manifest edit cannot retroactively validate a prior passage. A visible hard fail blocks immediately unless the Human Developer records an explicit exception.

## Final Pilot Evaluation

```text
Lifecycle phases completed:
Earliest failed or reopened gate:
Defects caught before asset integration:
Defects caught before final dressing/materials/lighting:
Correction rounds used:
Routine / Standard / Critical routing summary:
Avoided retries or duplicated context:
Mandatory final role verdicts:
Open hard fails:
Weakest remaining area:
Human decisions required:
Process friction and proposed governance follow-up:
Slice / production result:
Pilot execution / process-validation result:
Visual quality result:
Technical quality result:
Compute and review efficiency result:
Slice reusability result:
Lifecycle core-mechanism result:
Reliable end-to-end practical validation result:
Recommended next assignment:
```

The pilot result evaluates the process, not final project or visual approval. Any proposed lifecycle change returns through the Governance Lifecycle.

A follow-up Pilot 2 must use a genuinely new slice and must not repair or reuse the failed Pilot-1 layout. Freeze an immutable Studio OS source package before Phase 1; define semantic evidence contracts before Phase 4; complete the current manifest and separate verdicts before every passage; block visible hard fails immediately; and judge continuous runtime behaviour rather than image volume. Assess process execution separately from visual quality. This template prepares that assignment but does not authorise or start it.
