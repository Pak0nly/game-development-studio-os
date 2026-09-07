# Exact Worker Diff

The diff is relative to the byte-preserved pre-edit snapshots in this evidence directory.

```diff
diff --git a/Artifacts/Reports/C99-DIRECTOR-QUALITY-ACCOUNTABILITY-V1/Worker/PRE_EDIT_ROLE_OPERATING_MODEL.md b/Docs/Roles/ROLE_OPERATING_MODEL.md
index 78bbddb..e2b3b26 100644
--- a/Artifacts/Reports/C99-DIRECTOR-QUALITY-ACCOUNTABILITY-V1/Worker/PRE_EDIT_ROLE_OPERATING_MODEL.md
+++ b/Docs/Roles/ROLE_OPERATING_MODEL.md
@@ -46,6 +46,24 @@ must bind the exact Work Order, task identities, candidate, reviewed evidence
 and verdict before `PASS` wording enters operational state. Missing, stale or
 mismatched closure evidence is a blocking execution state, not a review result.
 
+## Director Accountability and Applied Context
+
+The Director owns per-task completeness without taking over implementation.
+For each routed task, it connects the project objective to its exact
+authoritative source, states the practical consequence of relevant rules,
+names the accountable Worker, justifies model and reasoning routing for each
+bounded subtask, supplies the minimum sufficient context, defines meaningful
+output and evidence, records the escalation boundary, and remains responsible
+for cursor-based monitoring and final consolidation. Listing or reading sources
+is not evidence that their consequences were applied.
+
+The Director reads every decision-relevant source far enough to support the
+claim it makes and retrieves any relevant portion lost to truncation or an
+incomplete read before declaring readiness. After a task pivot, it revalidates
+the sources, assumptions, and risks affected by that pivot. Routine questions
+and simple local changes do not require a repeated full bootstrap or unrelated
+review when the relevant authority and risk surface have not changed.
+
 ## Role Types
 
 ### Core Governance Roles
diff --git a/Artifacts/Reports/C99-DIRECTOR-QUALITY-ACCOUNTABILITY-V1/Worker/PRE_EDIT_VISUAL_PRODUCTION.md b/Docs/Playbooks/VISUAL_PRODUCTION.md
index 69e0178..7f62375 100644
--- a/Artifacts/Reports/C99-DIRECTOR-QUALITY-ACCOUNTABILITY-V1/Worker/PRE_EDIT_VISUAL_PRODUCTION.md
+++ b/Docs/Playbooks/VISUAL_PRODUCTION.md
@@ -33,9 +33,10 @@ combinations **MUST** be considered before new visible placeholder geometry.
 ## Workflow
 
 1. Verify the baseline, protected sources, and allowed visible delta.
-2. Define the location function, usage story, circulation, access, spatial
-   hierarchy, and primary player-facing claim before editing. Supporting
-   beauty or detail views cannot replace it.
+2. Define the location function, usage story, public and service access,
+   circulation, spatial hierarchy, intended scale and orientation, approved
+   visual-fit target, and primary representative gameplay-camera claim before
+   editing. Supporting beauty or detail views cannot replace it.
 3. Inspect and qualify the relevant asset vocabulary before creating visible
    replacements. Reuse and coherent non-destructive composition **MUST** be
    considered before bespoke visible invention.
@@ -43,15 +44,18 @@ combinations **MUST** be considered before new visible placeholder geometry.
    before props. Every retained or new visible element **MUST** have a
    defensible gameplay, world, art-direction, or composition purpose and a
    credible host.
-5. Place props from actual use, with orientation and clearance that preserve
-   pedestrian, vehicle, entrance, loading, maintenance, accessibility, and
-   camera needs. Hostless or space-filling distribution **MUST NOT** proceed.
+5. Place props from actual use, with purposeful scale, orientation, and
+   clearance that preserve pedestrian, vehicle, entrance, loading,
+   maintenance, accessibility, and camera needs. Hostless or space-filling
+   distribution **MUST NOT** proceed.
 6. Resolve materials and surface transitions only after composition and
    functional placement pass. Decals, wear, dirt, ageing, lighting, and
    atmosphere **MUST NOT** conceal structural or compositional defects.
-7. Work formatively without freezing a final evidence package after each small
-   edit. Use representative materials, lighting, distance, and camera before
-   rejecting visible content or an asset family.
+7. Develop and autonomously inspect one coherent result formatively. Use a
+   small number of risk-relevant checks before costly replication and at stage
+   exit, not formal review after each edit. Use representative materials,
+   lighting, distance, and camera before rejecting visible content or an asset
+   family.
 8. Preflight the evidence path non-mutatively when a prior capture, renderer,
    shader, or pipeline failure is relevant.
 9. Prepare one exact candidate that satisfies the
@@ -61,6 +65,22 @@ combinations **MUST** be considered before new visible placeholder geometry.
 11. Apply only the declared stage-local formal corrections, regenerate
     affected evidence, and rerun affected reviewers.
 
+## Quality Priority and Reuse
+
+Visible acceptance is controlled first by direct visual and spatial
+plausibility: purpose, access, circulation, hosts, scale, orientation,
+composition, approved visual fit, and the representative gameplay camera.
+Counts and numerical detail may support that judgment but cannot replace it.
+Protective preflight and required functional and technical checks remain
+mandatory.
+
+Establish one strong connected result before extracting or reusing its
+principles. Reuse adapts those principles to the purpose and constraints of
+each distinct place; it does not mechanically clone a layout. An early failure
+must change the reasoning, hypothesis, or concrete execution condition before
+continuation. Preserve viable work instead of blindly retrying or discarding a
+coherent result wholesale when only a bounded element failed.
+
 ## Review Selection
 
 Activate only roles whose distinct visual, spatial, technical-art, provenance, camera, gameplay-readability, evidence, or scope finding can change the stage decision. Use the full Visual Level Review Board only when the work is genuinely cross-domain, structurally material, or its risk makes every board domain decision-relevant.
```

