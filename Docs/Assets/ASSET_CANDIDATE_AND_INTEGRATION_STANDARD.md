# Asset Candidate and Integration Standard

**Status:** Adopted; amended through `SOS-GOV-WCM-NTB-V1` on 2026-07-25 and
`SOS-GOV-AAPEC-V1` on 2026-07-29.

## Purpose

This standard governs Store, AI-generated, internally created, and other relevant assets from candidate discovery through prototype integration and release assessment. It complements project-specific third-party policies and does not grant purchase, download, licence, generation, or integration authority.

## Asset Identity Classes

### Original Vendor Source

Original `.unitypackage` or downloaded archives, verified source folders
outside the active working project, and verified rollback snapshots are
immutable, hash-protected provenance and recovery sources. They must not be
edited, overwritten, or silently replaced.

### Imported Vendor Working Copy

Vendor files imported into an active Unity project are working copies. An
explicitly authorised Unity import, version, dependency, or render-pipeline
task may allow Unity to reserialize, upgrade, reimport, regenerate metadata
for, or otherwise technically adapt those files. Expected and explained
working-copy byte drift is not source corruption and is not a Hard Fail by
itself.

Working-copy mutability does not authorise intentional aesthetic edits, manual
value changes, destructive conversion, deletion, silent reference loss,
source-archive overwrite, or irreversible corruption.

### Project-Owned Variant or Override

Use project-owned paths for deliberate creative or gameplay-facing changes,
project tuning, compatibility layers, reusable adaptations, material
variants, and production-specific prefabs. Every derivative must retain
traceable source and recreation information.

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
- original-source, imported-working-copy, and project-owned-variant
  classification for every affected root;
- expected automatic technical mutation and the proportional diff-audit
  method;
- candidate state: `Rejected`, `Evaluation Only`, `Prototype Candidate`, or `Potential Release Asset`;
- exact reimport order, path, settings, override recreation, and verification method.

Do not store secrets, account identifiers, private download URLs, licence keys, or redistributable payloads where the licence prohibits it.

## Package-First Rule

No scene may be built substantially from a large package until the relevant asset families are inventoried and reviewed. A demo scene is evidence of intended presentation, not proof of family completeness, project fit, performance, or release suitability.

## Discover Before Create and Asset Vocabulary

Before creating or placing visible replacement content, Work **MUST** inspect
and qualify the relevant content already available in the authorised project.
The inspection covers applicable prefabs, modular building systems, roads,
pavements, curbs, walls, fences, gates, facade modules, props, surfaces,
materials, decals, VFX, animation, audio, UI, project-owned wrappers, editor
tools, code, and utilities. A filename inventory alone is insufficient.

For each materially relevant asset family, qualification **MUST** establish as
applicable:

- real or intended function and valid or invalid use;
- dimensions, proportions, pivot, orientation, rendered bounds, and ground or
  wall contact;
- modular increment, compatible neighbours, snapping, corners, endings,
  entrances, interruptions, transitions, and closure support;
- host, access, clearance, collider, LOD, material, camera, occlusion, and
  gameplay suitability;
- repetition risk, known limitations, and representative proof state.

Work **MUST NOT** claim a modular family production-ready from one isolated
straight section. Unknown corners, entrances, interruptions, endings, volume
or roof closure, road/pavement transitions, collider behaviour, snapping, or
repetition **MUST** be proven in an isolated, bounded representative assembly
before broad use.

## Compose Before Invent

Before authoring a new visible asset or bespoke construction, Work **MUST**
evaluate whether qualified existing content can be reused, combined,
reoriented, rehosted, materially adapted, wrapped non-destructively, or
assembled into a coherent project-owned composition. Compatible cross-package
composition **MAY** be used when provenance, technical compatibility,
art-direction coherence, host logic, and repetition remain controlled.

Original Vendor sources **MUST NOT** be destructively modified. Deliberate
adaptation belongs in a traceable project-owned variant, wrapper, or override
unless a Task-Delta Work Order explicitly authorises another reversible
method.

## Visible Placeholder Control

A visible placeholder, helper mesh, wrapper, boundary, prop, building piece,
or surface replacement **MAY** be created only when:

- no suitable qualified existing asset exists;
- no credible modular composition satisfies the requirement;
- it is necessary for an explicitly bounded technical or spatial proof;
- its temporary status and visual-review consequence are declared; and
- its expiry or replacement condition and owner or future gate are recorded.

Invisible diagnostic helpers **MAY** be used when they cannot contaminate
player-facing evidence and are removed or explicitly retained before evidence
freeze. A visible placeholder without the qualification and control record is
a Hard Fail, not an accepted shortcut.

## Integration Rules

1. Preserve original Vendor sources and verified rollback sources in approved
   protected paths.
2. Put project-owned materials, prefab variants, configuration, and adaptations in project-owned paths with traceable provenance.
3. Review assets from multiple reachable angles and the real gameplay camera before selection.
4. Test materials and shaders by visible result, not compilation alone.
5. Validate scale, entrances, backs, roofs, colliders, LODs, and occlusion in representative context.
6. Measure representative performance before broad adoption.
7. Prove reimportability without relying on undocumented local state.
8. Classify release suitability explicitly; prototype use never implies release acceptance.
9. For large Unity mutations, record whether working-copy files were added,
   removed, reserialized, or materially changed; verify GUID stability,
   references, material and shader usability, relevant scene execution,
   package roots/counts, source preservation, and rollback readability.
10. Do not require exhaustive imported-working-copy byte identity when
    functional, semantic, provenance, and recovery evidence explains the
    technical mutation.
11. Qualify modular compatibility and closure before broad placement; record
    each proof and unresolved family limit.
12. Prefer qualified reuse and composition over new visible replacement
    geometry, while preserving spatial purpose, project art direction, and
    gameplay readability.

## Review and Hard Fails

Use the [Asset Integration Review Board](../Roles/Boards/ASSET_INTEGRATION_REVIEW_BOARD.md)
and the [Large Unity Package Import Standard](LARGE_UNITY_PACKAGE_IMPORT_STANDARD.md)
when applicable.

Hard Fails include unknown licence/source, changed or lost original Vendor
source, unreadable or ineffective rollback, unexpected deletion, material
GUID/reference breakage, unusable required materials or shaders, scenes that
no longer open or render, unresolved required dependencies, unexpected
content loss, untraceable derivatives, no reproducible reimport path,
unsupported release claims, visible replacement content created without the
required asset-vocabulary qualification and placeholder control, broad use of
an unproven modular family, an unsupported modular-completeness claim, and any
no-training boundary violation.

Concerns, not Hard Fails by themselves, include expected Unity
reserialization, working-copy byte or file-size drift, expected serialized
format changes, cache regeneration, metadata timestamp changes, documented
property reordering without semantic loss, project-owned configuration
generation, and warning-level diagnostics when required content remains
functional.
