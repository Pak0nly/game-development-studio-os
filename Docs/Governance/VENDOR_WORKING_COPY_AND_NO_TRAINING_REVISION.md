# Vendor Working-Copy and Absolute No-Training Governance Revision

- **Governance candidate:** `SOS-GOV-WCM-NTB-V1`
- **Execution mode:** `Production — Governance Revision and Retry Preparation`
- **Adopted:** 2026-07-25 by explicit Human Developer authority
- **Status:** `ADOPTED — RETRY PREPARED, NOT EXECUTED`

## Decision

Studio OS now distinguishes three asset identities:

1. original Vendor sources and verified rollback sources are immutable,
   hash-protected, and restorable;
2. imported Vendor files inside an authorised Unity working project are
   technical working copies that Unity may reserialize or otherwise adapt for
   the declared version, package, dependency, and render pipeline; and
3. deliberate creative, gameplay-facing, compatibility, or reusable
   adaptations normally use traceable project-owned variants or overrides.

Working-copy hash drift is evidence to classify, not a Hard Fail by itself.
The absolute no-training boundary applies to all Studio OS and project
content, metadata, conversations, evidence, and AI outputs.

## Authority Relationship

- Confirmed decisions `DEC-024` and `DEC-025` record the Human decisions.
- `AI_DEVELOPMENT_RULES.md` is the project-wide no-training and AI-service
  authority.
- `ASSET_CANDIDATE_AND_INTEGRATION_STANDARD.md` is the asset-identity,
  source-protection, working-copy-mutability, and diff-audit authority.
- `LARGE_UNITY_PACKAGE_IMPORT_STANDARD.md` is the proportional package-import
  authority.
- The Unity and Visual Production playbooks apply those rules to task work.
- The Crime99 Production Profile applies the rules to Crime99.

Historical work orders and reports remain evidence of what was authorised and
decided at their execution time. Their future-use rules do not override this
adopted revision.

## Authoritative Files Changed

- `Docs/CONFIRMED_DECISIONS.md`
- `Docs/AI_DEVELOPMENT_RULES.md`
- `Docs/Assets/ASSET_CANDIDATE_AND_INTEGRATION_STANDARD.md`
- `Docs/Assets/LARGE_UNITY_PACKAGE_IMPORT_STANDARD.md`
- `Docs/Playbooks/UNITY_ASSET_ASSEMBLY_AND_DIAGNOSTIC_SAFETY.md`
- `Docs/Playbooks/VISUAL_PRODUCTION.md`
- `Docs/Projects/Crime99/PRODUCTION_PROFILE.md`
- `Projects/Crime99MasterCityDiscovery/Docs/STUDIO_OS_LARGE_UNITY_PACKAGE_IMPORT_STANDARD_DRAFT.md`

Operational state and handover records are updated separately under standing
maintenance permission.

## Supersession Ledger

| Prior rule or interpretation | Source | Superseding rule | Historical effect |
|---|---|---|---|
| All manufacturer/Vendor content was described as immutable without distinguishing imported project copies | Crime99 Production Profile; broad readings of the Asset Standard | Only original archives, protected external sources, and verified rollbacks are immutable. Imported Unity files are working copies. | Historical evidence remains unchanged. |
| Any unexpected Vendor drift stopped Unity mutation | Unity Asset Assembly and Diagnostic Safety Playbook | Stop on source loss, deletion, broken references/materials/scenes, unresolved dependencies, irrecoverability, or unexplained destructive drift. Explained technical reserialization is a Concern. | Future tasks use semantic/provenance checks. |
| Imported Vendor working copies had to remain byte-identical | `C99-HDRP-WAREHOUSE-MIGRATION-V1` Work Order and completion records | Working-copy hash drift alone is not a Hard Fail; classify it through the proportional diff audit. | Outcome C remains the recorded 2026-07-24 outcome, but its byte-drift stop rule is not reused. |
| Future HDRP work had to prevent Unity from writing imported Vendor originals | 2026-07-24 Work State and Warehouse handover | Future work must protect true source archives and rollback while allowing authorised Unity adaptation of imported working copies. | Current operational records are corrected by this revision. |
| Vendor imagery was categorically Human-only for all future AI review | Earlier Crime99 work orders and handovers | Integrated Crime99-scene screenshots may be used for explicitly authorised one-time current-project analysis when the no-training/provider boundary passes. Raw or isolated Vendor assets retain stricter licence limits. | Earlier no-inspection claims remain true for those runs. |
| Large package draft stopped on protected Vendor mutation without identity-class distinction | Historical Large Unity Package Import Standard draft | Adopted proportional package standard separates source, working copy, and project-owned variant and stops only on meaningful blockers. | Draft remains as a superseded location notice. |

## Hard Fail Versus Concern Matrix

| Finding | Classification | Required response |
|---|---|---|
| Original Vendor archive/source changed, lost, or overwritten | Hard Fail | Stop; preserve evidence; restore or escalate |
| Verified rollback unreadable or unable to restore declared state | Hard Fail | Stop before further mutation |
| Unexpected working-copy deletion or content loss | Hard Fail | Stop and diagnose/restore |
| Material GUID/reference breakage | Hard Fail | Stop; affected candidate cannot pass |
| Required material/shader unusable | Hard Fail | Stop or use an explicitly authorised project-owned correction |
| Required scene no longer opens or renders | Hard Fail | Stop affected stage |
| Required dependency unresolved or import irrecoverably unstable | Hard Fail | Stop and hand back evidence |
| Unexplained destructive overwrite that cannot be restored | Hard Fail | Stop and restore/escalate |
| No-training boundary violation | Hard Fail | Stop processing and report |
| Submission to a service that may train or improve models from content | Hard Fail | Do not submit; if already submitted, stop and report |
| Production, source change, or Git action without authority | Hard Fail | Stop |
| Expected Unity reserialization | Concern | Record affected files and technical class |
| Imported-working-copy hash or file-size drift | Concern | Compare additions/removals, GUIDs, references, usability, and scenes |
| Expected serialization-format or material-property ordering change | Concern | Document; verify semantic function |
| Cache regeneration or metadata timestamp change | Concern | Record only when decision-relevant |
| Project-owned configuration generation | Concern | Verify scope and provenance |
| Warning-level shader/import diagnostics with working required renders | Concern | Retain log and define later validation point |

A Concern becomes a Hard Fail when it causes or reveals functional, visual,
provenance, dependency, recovery, authority, licence, or no-training failure.

## Absolute No-Training Rule

No content may be used for training, fine-tuning, reinforcement learning,
model improvement, dataset/benchmark/evaluation/embedding corpus creation,
persistent reference libraries, style learning, imitation, reconstruction, or
comparable persistent AI learning.

One-time inference is permitted only for the explicitly authorised current
task, through a provider plan/configuration/terms boundary that does not train
on or improve models from submitted content, without persistent learning
corpora or unrelated reuse. Uncertainty stops submission for Human direction.

## Screenshot-Analysis Rule

Integrated Crime99-scene screenshots may be used for authorised one-time
current-project analysis of lighting, readability, visible defects, and
art-direction cohesion when the no-training boundary is verified. They may
not be used for training, style learning, imitation, reconstruction, dataset
creation, or generation reference. Raw or isolated Vendor assets remain
subject to stricter licence-specific restrictions. Derived textual findings
may be stored as project feedback.

## Human-Readable Summary

The earlier process was too strict because it used byte identity of imported
Unity working copies as a proxy for source preservation and functionality.
Unity can legitimately reserialize materials and metadata during a version or
pipeline change. That technical adaptation is now allowed and audited for
meaning.

What remains protected:

- original downloaded archives and `.unitypackage` files;
- verified external source folders;
- verified rollback sources;
- licence and provenance evidence;
- Human authority, production scope, and Git boundaries; and
- every piece of project content under the absolute no-training rule.

What is now allowed:

- expected Unity reserialization and technical adaptation of imported working
  copies inside an authorised task;
- proportional diff auditing instead of exhaustive working-copy byte
  perfection; and
- authorised one-time analysis of integrated Crime99 screenshots when the
  no-training and licence boundaries pass.

Immediate stops remain source loss, failed recovery, deletion or material
content loss, broken GUIDs/references, unusable required shaders/materials,
unopenable/unrenderable scenes, unresolved dependencies, irrecoverability,
unauthorised production/Git action, and any no-training violation.

## Task Closure

This governance task changed documentation only. It did not open Unity,
restart HDRP migration, mutate the Warehouse, access or alter Vendor source
archives, alter the rollback, inspect or submit Vendor imagery, begin
production, stage, commit, or push.
