# Visual Level Review Board

> **Status:** Adopted through LAIA-2026-07-22 on 2026-07-22.

## Purpose and Activation

Use the complete board for new levels, structurally material map/environment revisions, visual style foundations, or another visual stage where every listed domain can change the decision. It applies the [Review Board Protocol](../REVIEW_BOARD_PROTOCOL.md) and links rather than repeats the [Visual Quality Assurance Workflow](../../Visual/Visual_Quality_Assurance_Workflow.md). New level areas use it at the applicable gates of the [Level Development Lifecycle](../../Level/LEVEL_DEVELOPMENT_LIFECYCLE.md).

Ordinary bounded production on an accepted baseline activates only the decision-relevant subset under the [Role Activation Matrix](../ROLE_ACTIVATION_MATRIX.md). Diagnostic and Integration modes do not activate this board unless their outcome genuinely requires its cross-domain decision surface.

When the complete board is activated, mandatory roles are Art Director, Level Designer, Technical Artist, Asset & Provenance Manager, Camera & Occlusion Reviewer, Gameplay QA Reviewer, QA Lead, and Producer / Scope Controller. Activate Unity Specialist for decision-relevant Unity work. Add Performance, Audio, UI/UX, or Narrative / Worldbuilding when their domains are present.

## Required Inputs

- approved visual and level direction;
- target scene/build, gameplay camera, resolution, comparison profiles, and reference target;
- asset/provenance records and Art Bible;
- camera coverage matrix and continuous route/occlusion evidence;
- technical validation and matched correction evidence;
- exact hard-fail and Human approval boundaries from the Task-Delta Work Order.

## Shared Questions

1. Does the place feel credible, intentional, and authored?
2. Is the required visual identity actually visible?
3. What still reads as a test scene, graybox, placeholder, demo, or unfinished boundary?
4. Do assets, period, condition, and intended use belong together?
5. Do player positions, routes, landmarks, and camera coverage work?
6. Does occlusion work continuously through entry, behind, exit, restoration, re-entry, and target change?
7. Is the scene sufficiently detailed at gameplay distance without harming readability?
8. Are streets, yards, backs, alleys, parking, loading, and service zones plausible?
9. Is the current result presentation-ready for its authorised stage?
10. What would an external viewer criticise in the first ten seconds?
11. For every gate-critical claim, does the evidence method actually execute or observe the claimed behaviour on the current candidate, or is it only a proxy?

## Role Focus

| Role | Distinct focus |
|---|---|
| Art Director | Identity, hierarchy, colour/light/material language, style/period, placeholders |
| Level Designer | Scale, routes, spatial sequence, landmarks, flow, spawns, urban/gameplay credibility |
| Technical Artist | Render/import/material/VFX/lighting/LOD/collider/occlusion result and budget |
| Asset & Provenance Manager | Package/family coverage, source/licence/integrity, multi-angle and reuse suitability |
| Camera & Occlusion Reviewer | Position matrix, foot/vehicle paths, actor/route visibility, restoration and re-entry |
| Gameplay QA Reviewer | Representative movement, driving, interaction, boundary and recovery behaviour |
| QA Lead | Evidence completeness, reproducibility, regression, final-version identity |
| Producer | Scope, mandatory verdicts, conflicts, corrections, weakest area, handoff status |

## Hard Fails and Passage

All applicable Visual QA hard fails apply. In addition, missing or semantically unsuitable mandatory evidence, an unresolved in-scope defect, or evidence from a superseded build blocks handoff. A visible hard fail cannot be deferred to a later visual phase under `PASS WITH CONCERNS` without an explicit Human exception. Passage requires no mandatory `FAIL`, no open hard fail, all applicable roles at least `PASS WITH CONCERNS`, and explicit remaining concerns.
