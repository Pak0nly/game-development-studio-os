# Large Unity Package Import Standard

**Status:** Adopted through `SOS-GOV-WCM-NTB-V1` on 2026-07-25 by explicit
Human Developer governance authority.

This standard does not grant purchase, download, authentication, Unity
launch, package import, working-copy mutation, production, staging, commit, or
push authority. A Task-Delta Work Order must grant the applicable scope.

## Purpose

Provide a proportional workflow for large Unity Asset Store or
`.unitypackage` environments with Demo/Overview scenes, render-pipeline
variants, nested packages, or overlapping publisher roots. The workflow
protects original sources and recovery while allowing expected technical
mutation of imported working copies.

## Required Identity Classes

- **Original Vendor source:** downloaded archives, `.unitypackage` files,
  verified source folders outside the active working project, and verified
  rollback sources. Immutable, hash-protected, and never overwritten.
- **Imported Vendor working copy:** package files inside the active Unity
  working project. Unity may technically adapt them only within the authorised
  version, dependency, package, or pipeline task.
- **Project-owned variant or override:** deliberate creative, gameplay-facing,
  compatibility, or reusable adaptation stored in a traceable project-owned
  path.

## Package Status

Use one current status per package:

- `MISSING`
- `SOURCE PRESENT — COMPLETENESS UNVERIFIED`
- `SOURCE PRESENT — IMPORT COMPLETE`
- `IMPORTED AND TECHNICALLY EXECUTABLE`

Only `IMPORTED AND TECHNICALLY EXECUTABLE` supports technical package
capability claims. It does not imply visual, production, licence, performance,
or release acceptance.

## Proportional Import Sequence

### 1. Required Source Presence

Before lengthy downstream work:

1. list required primary packages by exact product name;
2. resolve each original archive path and record size, hash, available version
   evidence, expected Vendor root, and acquisition owner where known;
3. identify missing primary packages immediately; and
4. stop whole-set claims when a primary source is missing. A declared subset
   may proceed only under a separately named subset scope.

### 2. Full Package or Pipeline Subset Declaration

For every candidate:

1. inventory outer content, nested packages, Demo/Overview scenes, readmes,
   pipeline assets, and dependencies proportionally;
2. declare the Unity version, render pipeline, package version evidence, and
   whether the candidate is the full package or one pipeline subset;
3. follow applicable Vendor setup instructions; and
4. treat Built-in, URP, HDRP, and nested variants as potentially
   identity-colliding even when their paths differ.

Do not infer that a nested `.unitypackage` is installed merely because the
archive file exists under `Assets`.

### 3. Human Authentication and Interactive Gates

Authenticated Asset Store acquisition/import, licence acceptance, and
unautomatable overwrite/import choices remain Human actions. The Human records
the selected package/variant and confirms import completion when Work cannot
observe the state reliably.

Missing Human authentication is a precondition stop, not permission to bypass
the official import path.

### 4. Import Completion and Stability

1. import the declared package/variant into the authorised project;
2. record import order, method, start/end state, and interactive choices;
3. wait for package resolution, script compilation, Asset Database refresh,
   and relevant shader work to complete;
4. confirm the required project and scenes can reach a stable state; and
5. perform a bounded second open only when it reduces a real stability risk.

`Library` may support diagnosis but is not source-completeness evidence.
Expected working-copy reserialization or a substantial first import is not a
Hard Fail by itself.

### 5. Working-Copy Diff and Conflict Audit

Use proportional evidence to answer:

- Were original sources and verified rollback sources preserved?
- Can rollback restore the prior source state?
- Were working-copy files added, removed, reserialized, or materially changed?
- Did GUIDs remain stable and unambiguous at current paths?
- Did material, prefab, and scene references remain valid?
- Are required materials and shader assignments functional?
- Do package roots, counts, variant declaration, and import order remain
  understandable?
- Did a later import change a previously validated shared identity?
- Are changes expected Unity adaptation or unexplained destructive change?

Record direct-path, GUID-relocated, missing, ambiguous, and shared identities
where relevant. Zero current duplicate GUIDs does not prove that import order
caused no replacement.

Do not require exhaustive byte-by-byte identity for imported working copies
when functional, semantic, provenance, and recovery evidence explains the
technical change.

### 6. Demo/Overview Scene Execution

Open the relevant Demo/Overview scenes in the declared compatible project.
Record, as applicable:

- open and Play Mode result;
- missing scripts and components;
- null or missing material slots;
- error/unsupported shaders;
- unresolved dependencies;
- material and shader functionality;
- stable nonblank rendering; and
- scene-specific warnings or prompts.

Binary scenes require Unity execution when serialized inspection cannot prove
the claim. A failed required scene prevents technical-executable
classification.

### 7. Package and Combination Summary

Before combination, summarise each package's source, declared variant, import
result, working-copy mutation classes, scene results, shared identities,
remaining concerns, and blockers.

Combine packages only under explicit scope and recorded import order. Recheck
conflicts and rerun previously affected scenes when a later package can change
their dependencies or shared identities. Repeating every test after every
package is not required when the Producer records why a prior result remains
unaffected.

### 8. Source and Recovery Closure

At stage exit:

- original Vendor archives and verified rollback sources remain exact and
  readable;
- rollback method and boundary are clear;
- imported working-copy mutations are classified;
- unexplained deletion, corruption, or reference loss is absent; and
- evidence and Human-only/licence boundaries remain intact.

### 9. Review and Handoff

For large or cross-package work, activate only decision-relevant roles.
Technical Director / Unity Specialist, Asset & Provenance Manager, QA Lead,
and Producer / Scope Controller are the normal minimum. Add creative roles
only when the work actually claims visual or production acceptance.

The handoff distinguishes technical executability, visual review, production
approval, licence acceptance, and release suitability.

## Hard Fails

Stop when any applicable condition occurs:

- original Vendor source changed, was lost, or was overwritten;
- verified rollback is unreadable or cannot restore the declared prior state;
- imported files are deleted unexpectedly or content is lost;
- GUIDs or required references break materially;
- required materials or shaders become unusable;
- a required scene no longer opens or renders;
- required package dependencies remain unresolved;
- the import state becomes unstable or irrecoverable;
- an unexplained destructive overwrite cannot be restored;
- a no-training boundary is violated;
- project content is submitted to a service that may use it for training or
  model improvement;
- production proceeds without required Human authority; or
- staging, commit, or push occurs without authority.

## Concerns, Not Hard Fails by Themselves

- automatic Unity reserialization;
- imported-working-copy hash or file-size drift;
- expected serialized format changes;
- cache regeneration;
- metadata timestamp changes;
- project-owned configuration generation;
- documented material-property reordering without semantic loss;
- warning-level shader/import diagnostics with working required renders; and
- bounded second-open import activity that is explained and reaches stability.

A Concern becomes a Hard Fail only when it causes or reveals a functional,
visual, provenance, dependency, recovery, authority, licence, or no-training
failure.

## AI and Screenshot Boundary

Project content may be processed only under the
[Absolute No-Training and AI Service Boundary](../AI_DEVELOPMENT_RULES.md#absolute-no-training-and-ai-service-boundary).
Integrated scene screenshots may be used for explicitly authorised one-time
current-project quality analysis when the provider/configuration boundary is
verified. Raw or isolated Vendor assets remain subject to stricter
licence-specific restrictions.

## Proportionality

This standard is intended for a local single-Human studio. Do not impose
enterprise-grade certification, exhaustive testing, or redundant package
microreviews. Reduce checks for a small isolated asset without scenes,
scripts, pipeline variants, or shared roots. Use the full relevant sequence
for large environments, nested variants, multiple Demo scenes, or known
cross-package identities. The Producer records why a check is not applicable;
it may not be silently skipped.
