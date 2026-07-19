# Asset Integration Review Board

## Purpose and Roles

Use this board before a significant package or asset family becomes a scene dependency or release candidate. Mandatory roles: Art Director, Technical Artist, Asset & Provenance Manager, engine specialist, QA Lead, and Producer / Scope Controller. Add Level Designer, Camera & Occlusion Reviewer, Performance Analyst, Audio Reviewer, or Release Reviewer when applicable.

## Required Review

- complete relevant package and asset-family inventory, including demo scenes;
- licence, source, package ID/version, original path, hashes or integrity method;
- manufacturer-original versus project-owned override map;
- style, period, intended-role, and Art Bible fit;
- multi-angle and gameplay-distance evidence under the actual camera;
- material/shader/render-pipeline, scale, pivot, import, collider, LOD, animation, and performance state;
- camera and occlusion suitability;
- repetition and missing-family risk;
- update/reimport recipe and reproducibility test;
- explicit `Rejected`, `Evaluation Only`, `Prototype Candidate`, or `Potential Release Asset` state.

## Hard Fails

Unknown licence/source, edited protected original, incomplete package coverage presented as complete, broken/error material, missing critical family, no reproducible reimport path, or unsupported release claim requires `FAIL` or `BLOCKED BY HUMAN DECISION` as appropriate.

## Passage

The Producer may consolidate only the independent role outputs. Technical import success does not override art, provenance, camera, gameplay, or release failure. Purchase, download, licence-risk acceptance, and release classification remain Human decisions.
