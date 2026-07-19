# Example — Asset Package Integration Work Order

## Work Order

**Assignment:** Evaluate and integrate a licensed modular urban environment package for a prototype candidate without editing manufacturer originals.

**Builder Role:** Asset Integration Builder.

**Mandatory roles:** Producer / Scope Controller; Art Director; Technical Artist; Asset & Provenance Manager; engine specialist; QA Lead. Activate Level Designer and Camera & Occlusion Reviewer for environment geometry; activate Performance Analyst if representative package load is imported.

**Review Board:** [Asset Integration Review Board](../../Roles/Boards/ASSET_INTEGRATION_REVIEW_BOARD.md).

## Required Package Coverage

- package name, publisher, store/package ID, version, acquisition source/date, licence reference, and archive hash where available;
- complete relevant directory and asset-family inventory, including demo scenes and dependencies;
- buildings, fronts/backs, roofs, interiors, roads, props, materials, textures, shaders, LODs, colliders, animations, VFX, and variants;
- original path, manufacturer-integrity method, intended project role, and every project-owned override/variant path.

No scene construction begins until relevant families are inventoried and gaps are known.

## Separate Reviews and Evidence

- **Art Director:** style, period, shape, material, palette, use-history, identity, and `Use / Avoid` fit.
- **Technical Artist:** pipeline, imports, materials/shaders, scale, pivots, LODs, colliders, VFX, lighting, and performance.
- **Asset & Provenance Manager:** licence/source/version, completeness, original integrity, derivative traceability, repetition, release state, and reimport.
- **Level Designer:** entrances, backs, services, footprints, seams, routes, and landmark suitability.
- **Camera & Occlusion Reviewer:** street/side/rear/roof angles, gameplay distance, hard occluders, and rotation risks.
- **QA Lead:** evidence completeness, demo-versus-production distinction, reproducibility, and final import identity.

Evidence includes illustrated multi-angle catalogs; neutral/target-light and gameplay-distance captures; demo-scene and raw-family review; import/material/shader/LOD/collider report; camera/occlusion sequences; performance baseline; original/override manifest; integrity comparison; and a clean reimport test.

## Candidate Status

Use exactly one: `Rejected`, `Evaluation Only`, `Prototype Candidate`, or `Potential Release Asset`. Import success alone cannot produce a release-candidate state.

## Hard Fails and Stop Boundaries

Hard fails: unknown licence/source, missing material/error shader, unexamined relevant family, edited original, incompatible focal style/period, no safe override strategy, no reproducible reimport, or unsupported release claim.

Stop for Human direction before purchase, download, licence-risk acceptance, new dependency, package-version change, broad adaptation, or release classification. Work corrects clear in-scope import/documentation defects within at most two rounds.
