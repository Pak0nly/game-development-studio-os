# Asset Candidate and Integration Standard

## Purpose

This standard governs Store, AI-generated, internally created, and other relevant assets from candidate discovery through prototype integration and release assessment. It complements project-specific third-party policies and does not grant purchase, download, licence, generation, or integration authority.

## Required Candidate Record

Record at minimum:

- asset/package name, category, intended role, and source;
- publisher/creator, licence evidence, acquisition date, package ID and exact version;
- archive hash where available, original path, manufacturer-integrity method, and dependency list;
- full relevant package-family coverage and demo-scene review state;
- style and period fit against the Art Bible;
- front/side/rear/top or otherwise relevant multi-angle images;
- appearance at actual gameplay distance and target lighting;
- camera suitability, occlusion behaviour, and multi-angle/rotation risks;
- material, shader, render-pipeline, import, scale, pivot, collider, LOD, animation/VFX, and performance state;
- repetition risk, permitted use, missing families, and required adaptation;
- original versus project-owned override/variant paths;
- candidate state: `Rejected`, `Evaluation Only`, `Prototype Candidate`, or `Potential Release Asset`;
- exact reimport order, path, settings, override recreation, and verification method.

Do not store secrets, account identifiers, private download URLs, licence keys, or redistributable payloads where the licence prohibits it.

## Package-First Rule

No scene may be built substantially from a large package until the relevant asset families are inventoried and reviewed. A demo scene is evidence of intended presentation, not proof of family completeness, project fit, performance, or release suitability.

## Integration Rules

1. Preserve manufacturer originals in the approved protected path.
2. Put project-owned materials, prefab variants, configuration, and adaptations in project-owned paths with traceable provenance.
3. Review assets from multiple reachable angles and the real gameplay camera before selection.
4. Test materials and shaders by visible result, not compilation alone.
5. Validate scale, entrances, backs, roofs, colliders, LODs, and occlusion in representative context.
6. Measure representative performance before broad adoption.
7. Prove reimportability without relying on undocumented local state.
8. Classify release suitability explicitly; prototype use never implies release acceptance.

## Review and Hard Fails

Use the [Asset Integration Review Board](../Roles/Boards/ASSET_INTEGRATION_REVIEW_BOARD.md). Unknown licence/source, protected-original edits, incomplete coverage presented as complete, broken required materials, untraceable derivatives, no reimport path, or unsupported release claims are hard fails.
