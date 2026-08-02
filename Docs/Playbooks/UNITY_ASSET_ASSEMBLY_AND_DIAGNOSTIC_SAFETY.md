# Unity Asset Assembly and Diagnostic Safety Playbook

> **Status:** Adopted through LAIA-2026-07-22 on 2026-07-22; amended through
> `SOS-GOV-WCM-NTB-V1` on 2026-07-25 and
> `C99-STUDIO-UNITY-MCP-VISUAL-EVIDENCE-PLAYBOOK-AMENDMENT-ADOPTION-V1` on
> 2026-07-31. This playbook does not itself grant
> Unity, setup, asset, or mutation permission.

## Use

Load this playbook for Unity asset selection, representative assembly,
asset-fit diagnosis, dependency-closure diagnosis, capture-path diagnosis,
and protected-source safety. It does not authorise Unity launch, project
creation, asset copying, download, purchase, package installation, original
Vendor-source mutation, or intentional working-copy edits. A Task-Delta Work
Order may separately authorise Unity's expected technical adaptation of
imported working copies.

## Environment and Evidence Boundary

- Prefer a verified canonical working environment named by the project Production Profile and Task-Delta Work Order.
- Do not create another complete Unity project, reconstruct `Library` or `PackageCache`, or copy a complete Vendor package without explicit setup authority.
- Keep logs, screenshots, videos, manifests, and review packages outside Unity `Assets/` unless Unity import is genuinely required for the task.
- Preserve original Vendor archives, protected source folders, and verified
  rollback sources. Imported files inside the active Unity project are working
  copies when the Task-Delta Work Order says so.
- Put deliberate creative, gameplay-facing, or reusable adaptations in
  project-owned paths. Hash protected original/rollback sources before and
  after a Unity run; classify working-copy changes by technical meaning rather
  than hash drift alone.

## Bounded Integrated-Scene PNG Evidence Transaction

When a Task-Delta Work Order separately authorises integrated-scene PNG
capture, treat each capture as one fail-closed transaction. Before starting,
declare the approved decoder, supported decoded pixel format, requested
dimensions, capture settings, task-local output root, quarantine path,
retained path, manifest target, and cleanup authority.

The transaction must execute in this exact order:

1. Enumerate available Unity instances, pin and verify the exact complete
   `Name@hash`, and verify the canonical project root, Unity version, idle
   Editor state, exact target scene, exact existing unambiguous camera,
   requested capture parameters, task-local output root, and the complete
   original restorable scene, camera, view, selection, tool, exposed UI, dirty,
   and other task-relevant state. Refuse a missing, duplicate, substituted, or
   unverifiable identity.
2. Capture only to a unique task-local quarantine path. The quarantine must be
   inside the authorised output root, on the same filesystem as the retained
   destination, outside Unity `Assets/`, excluded from evidence discovery and
   manifest enumeration, and visibly named so it cannot be mistaken for
   retained evidence. Refuse overwrite and pre-existing output.
3. Complete encoding, flush all writes, close and release the temporary file
   and capture resources, and verify that no writer retains the file before
   validation begins.
4. Reopen the completed temporary file with the approved decoder and fully
   decode the complete PNG. Header inspection, signature inspection, file
   existence, or partial decode is insufficient.
5. Validate the completed temporary artifact as one technical unit: valid and
   complete PNG structure; no truncation or decode failure; exact requested
   dimensions; the declared supported decoded pixel format; a complete,
   non-empty pixel buffer of the decoder-required size; completed-file byte
   size; and SHA-256 calculated from the closed temporary file. Preserve these
   qualified temporary values for the later retained-file comparison. A
   decoder conversion must not be presented as proof of the encoded format.
6. While the target state is still active, reverify without silent re-pinning
   the same complete `Name@hash`, canonical project root, Unity version, exact
   target scene, exact target camera, capture parameters, and task-relevant
   target state required by the capture claim.
7. Restore the complete original state, including the original active scene,
   camera, view, selection, tool, exposed UI, applicable serialized or semantic
   content, dirty states, and every state change caused by preparation,
   orchestration, capture, or validation. Do not silently save.
8. Independently verify the restored state against the Step-1 record. Dirty
   flags are not restoration proof and may be restored only after the relevant
   serialized or semantic content is proven identical; they must never conceal
   drift.
9. Only after Steps 4–8 pass, atomically promote the qualified temporary PNG by
   a same-filesystem, no-overwrite rename into the authorised retained path. If
   atomic promotion cannot be guaranteed, fail before retention. Promotion
   changes storage state only; it does not yet make the file accepted evidence.
10. Reopen the retained file from its final path with the same approved decoder
    and fully decode it again.
11. Verify the retained file byte-for-byte against the qualified temporary
    artifact, including completed-file byte size and SHA-256, and verify that
    decoded dimensions, supported pixel format, complete non-empty pixel
    buffer, and PNG integrity match the qualified Step-5 values.
12. Only after Step 11 passes, add the retained artifact to the evidence
    manifest. Bind the entry to the exact candidate, project root, Unity
    version, complete `Name@hash`, scene, camera, endpoint command and
    implementation identity, capture parameters, retained path, bytes,
    SHA-256, dimensions, pixel format, decoder identity, relevant before/target/
    restored state records, and the claim the artifact may support.

The quarantine and retained locations are separate namespaces. Quarantined,
temporary, partially written, partially promoted, undecodable, mismatched, or
unverified output must be excluded from manifest discovery and must never be
described as evidence.

### Fail-Closed Invalidation and Cleanup

Any failure in instance or target identity, capture, encode, flush, close,
resource release, temporary-file decode, PNG integrity, dimensions, format,
pixel buffer, temporary SHA-256, target-state verification, restoration,
restoration verification, atomic promotion, retained-file reopen or decode,
retained-to-temporary comparison, or manifest binding invalidates the complete
attempt.

On any such failure:

- do not classify the output as retained evidence and do not create or keep a
  manifest entry for it;
- remove the quarantine file and any safely identifiable partially promoted
  or retained output created by that attempt where the authorised cleanup can
  do so safely;
- if a manifest write began, remove or invalidate that exact entry
  transactionally;
- preserve or restore the original Unity state, or report restoration failure
  as a blocking result;
- record cleanup failure, uncertain output ownership, residual output, or
  manifest ambiguity as contamination and a blocking result; and
- stop the transaction. File existence or a prior intermediate pass must not
  permit a later reviewer to treat the attempt as evidence.

Cleanup must never delete a pre-existing file or an output whose ownership
cannot be proven. Uncertain ownership is contamination and blocks passage.

The concrete Crime99 `c99_capture_camera_to_absolute_png` handler remains
restricted to its accepted Gate-1-V3/CO2 conditions. Direct successful handler
execution after explicit pinning proves only that exact bounded path. It does
not resolve the stdio `custom-tools=0` discovery limitation, establish
tab-neutrality for `manage_camera(action="screenshot")`, or prove general MCP,
capture, visual, gameplay, runtime, performance, build, or production safety.
DEC-025 remains mandatory before any protected screenshot is submitted to or
processed by an AI or external service.

## Working-Copy Diff Audit

For large technical Unity mutations, proportionally answer:

- Were original sources and rollback sources preserved and readable?
- Can the rollback restore the prior state?
- Were working-copy files added, removed, reserialized, or materially changed?
- Did GUIDs and material/prefab/scene references remain stable?
- Are material and shader assignments functional?
- Do relevant scenes open and render?
- Do package roots, counts, and import order remain understandable?
- Are changes expected Unity adaptation or unexplained destructive change?

Automatic reserialization, cache regeneration, timestamp drift, documented
property reordering, and non-blocking warnings are Concerns unless they cause
functional, visual, provenance, or recovery failure.

## Causal Diagnostic Classes

Classify each finding before disposition:

- source-asset defect;
- asset-selection mismatch;
- assembly or placement defect;
- orientation or public-front defect;
- stale or unremoved proxy;
- material or shader defect;
- dependency-closure or pipeline defect;
- composition defect;
- camera or evidence defect;
- blockout-stage limitation; or
- accepted concern outside the current decision.

A visible symptom is not an asset-family verdict. `FAIL` requires representative evidence and a verified causal defect. Use an evidence-invalid or evidence-incomplete disposition when the method cannot support a final verdict.

## Assembly and Diagnostic Workflow

1. Verify project path, Unity version, process exclusivity, arguments,
   package/dependency closure, protected original/rollback ledger, and
   working-copy boundary before mutation.
2. Inventory the relevant package family and inspect representative original materials, not only diagnostic replacements.
3. Verify scale, rendered bounds, ground contact, public frontage, entrance, backs, roofs, pivots, rotation, and representative gameplay distance.
4. When a real asset replaces a proxy, inventory and remove or explicitly retain the superseded proxy before evidence freeze.
5. Separate diagnostic evidence from formal suitability evidence. Geometry-only or untextured output cannot prove material, lighting, period, or final visual fit.
6. In `Diagnostic` mode, reproduce, isolate, capture the causal result, record scope and falsifying evidence, then stop. Do not drift into selection, assembly correction, polish, or broad creative review.
7. In `Production` mode, prepare one Definition-of-Ready candidate and use the applicable stage-exit review.

## Stop

Stop mutation on changed or lost original Vendor source; unreadable or
ineffective rollback; unexpected working-copy deletion or content loss;
material GUID/reference breakage; unusable required materials or shaders;
scenes that no longer open or render; unresolved required dependencies;
irrecoverable or unexplained destructive change; no-training boundary
violation; unexpected `Packages`, `ProjectSettings`, or outside-scope drift;
invalid canonical environment; nonrepresentative render state; an absent
Human-owned selection or licence decision; exhausted diagnostic attempts; or
a required structural change.

Do not stop solely because an authorised imported working copy was
reserialized or changed hash. Record and classify the diff. Preserve logs,
hashes, candidate identity, and the factual record without silently accepting
or reverting unexplained drift.
