# Confirmed Decisions

## Purpose and Authority

This document stores Human Developer-confirmed durable decisions that are not necessarily adopted Studio Operating System governance standards. It is the authoritative source for confirmed Studio OS, environment, workflow, and project decisions within each entry's stated scope.

Adopted Studio Operating System documents override this record. Approved project documentation may override a general decision within its explicitly defined project scope.

For confirmed decisions, this record overrides `WORK_STATE.md`, `CURRENT_HANDOVER.md`, historical session files, and chat context.

Confirmed entries cannot be changed, removed, or marked superseded without Human Developer confirmation or an applicable adopted governance process. AI agents may update references and operational projections, but may not silently change the substance or status of confirmed decisions.

Proposals, assumptions, open decisions, operational status, and governance standards must remain distinguishable from confirmed decisions.

## Confirmed Decisions

### DEC-001 â€” Reference Operating System

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** Windows 11 is the reference operating system.
**Implications:** Environment setup, validation, and automation should target Windows 11 unless a narrower approved scope states otherwise.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-002 â€” Primary Unity Baseline

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** Unity 6.3 LTS is the primary engine baseline.
**Implications:** Unity setup, tooling, automation, and validation should use this baseline by default.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-003 â€” Unity Baseline Replacement

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** Newer Unity releases may be evaluated separately, but replacing the primary baseline requires explicit Human Developer approval.
**Implications:** Evaluation does not silently change the baseline recorded in DEC-002.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-004 â€” AI-Assisted Solo Studio

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** The environment is optimized for an AI-assisted solo studio.
**Implications:** Workflows should prioritize effective collaboration between the Human Developer and AI agents.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-005 â€” Human Collaboration Plan

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** Additional human collaborators are not currently planned.
**Implications:** Current processes do not need to optimize for a multi-person human team, without prohibiting a future confirmed change.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-006 â€” Specialized AI Agents

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** Specialized AI agents may be introduced when justified by concrete value, scope, or capability needs.
**Implications:** New agent roles require a specific justification and are not introduced by default.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-007 â€” Director Instance

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** ChatGPT is intended to act primarily as the Director instance.
**Implications:** ChatGPT should coordinate direction and continuity while other execution roles may be delegated when justified.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-008 â€” Initial Autonomy Level

**Status:** Confirmed
**Scope:** Workflow
**Confirmed decision:** The initial autonomy level is B.
**Implications:** Work begins at level B. Its adopted operating rules are defined in `Docs/AI_DEVELOPMENT_RULES.md`.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-009 â€” Autonomy Progression Target

**Status:** Confirmed
**Scope:** Workflow
**Confirmed decision:** The target progression is autonomy level C and then level D after validation.
**Implications:** Progression is sequential and evidence-based; this decision does not itself define validation criteria or authorize promotion.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-010 â€” Local-First Git Work

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** Git work is local-first.
**Implications:** Local repository work remains the default while the private remote and backup model is unresolved.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-011 â€” Least-Privilege Workspace Access

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** Agents receive least-privilege access only to required workspaces.
**Implications:** Access should be limited to the minimum workspaces and permissions needed for the assigned task.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-012 â€” Paid API Approval

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** Paid API calls require explicit Human Developer approval.
**Implications:** No agent may initiate a paid API call based only on task convenience or implied permission.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-013 â€” External Download Approval

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** External downloads require explicit Human Developer approval.
**Implications:** Agents must obtain approval before downloading external files, packages, repositories, or other artifacts.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-014 â€” New Tool Installation Approval

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** Installation of new tools requires explicit Human Developer approval.
**Implications:** Tool installation must not be inferred from permission to perform a task.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-015 â€” Unity Automation Requirement

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** Unity automation is a core long-term requirement.
**Implications:** Development-environment decisions should preserve a path toward substantial Unity automation.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-016 â€” First Workflow Validation Project

**Status:** Confirmed
**Scope:** Project
**Confirmed decision:** The first workflow validation project is a simple Match-3 game.
**Implications:** The first project should remain simple enough to isolate and validate the workflow.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-017 â€” Second Workflow Validation Project

**Status:** Confirmed
**Scope:** Project
**Confirmed decision:** A simple jump-and-run follows as the second, more complex workflow test.
**Implications:** The second test should extend the validated workflow with greater implementation complexity.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-018 â€” Primary First-Test Success Criterion

**Status:** Confirmed
**Scope:** Workflow
**Confirmed decision:** Workflow autonomy is the primary success criterion of the first workflow validation test.
**Implications:** Evaluation of the Match-3 test should prioritize how independently and reliably the governed workflow operates.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-019 â€” Secondary First-Test Output Criterion

**Status:** Confirmed
**Scope:** Workflow
**Confirmed decision:** Output quality is secondary during the first workflow validation test.
**Implications:** Output quality remains relevant but must not displace workflow-autonomy validation as the primary objective.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-020 â€” Later 3D Pipeline Integration

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** The AI-orchestrated 3D asset pipeline is intended for later evaluation and integration during development-environment setup.
**Implications:** This confirms the direction and timing only. Its detailed architecture, workflow, permissions, quality gates, and governance status remain proposed and unresolved. The existing Governance Backlog item remains valid and is not contradicted.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-021 â€” Initial Blender Execution Agent

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** Claude is the preferred initial Blender execution agent.
**Implications:** Initial pipeline evaluation should prefer Claude for Blender execution without making it a permanent dependency.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-022 â€” Provider Independence

**Status:** Confirmed
**Scope:** Studio OS
**Confirmed decision:** The architecture should avoid unnecessary provider lock-in.
**Implications:** Interfaces, briefs, validation rules, artifacts, and workflows should remain provider-independent where practical.
**Human confirmation source:** Director Session 002, persisted during continuity repair
**Supersedes:** None

### DEC-023 â€” Private Git Remote and Backup Model

**Status:** Confirmed
**Scope:** Environment
**Confirmed decision:** The Studio Operating System repository and future studio repositories use GitHub private repositories as their primary managed Git remote.

Local-first Git remains the standard working model. The local repository is the active development workspace. The remote provides an external Git replica, recovery capability, and a controlled integration point for future workflows.

Each active repository must additionally have an independent encrypted backup stored on a separate physical storage device that is not permanently connected to the development machine.

The minimum operating model is:

- approved commits are pushed to the private remote at the end of each completed work session or coherent approved change set;
- an encrypted offline backup is created at least weekly and after significant milestones;
- backup copies must include the complete Git history;
- recovery must be tested after initial setup and periodically thereafter;
- a Git remote alone is not treated as a complete backup;
- generated files, caches, temporary files, and reproducible builds remain excluded unless a separate decision explicitly includes them;
- large binary assets, Git LFS, build archives, and non-Git asset storage require a separate evaluation when an actual project creates that need.

AI Agents receive no standing access to the remote by default.

Remote creation, credential creation, remote configuration, pushes, permission changes, and any future AI Agent remote access require explicit Human Developer authorization unless a narrower standing permission is adopted later.

Any future AI Agent remote access must follow least privilege and should be task-specific, time-limited, and restricted to the minimum required repository and permission level.

The GitHub account used for studio repositories must use strong multi-factor authentication or passkeys. Recovery credentials must be stored separately from the primary development machine.

**Implications:** This decision does not authorize paid services, new tool installation, external downloads, account creation, credential creation, remote configuration, or the initial push. Those remain separate implementation actions requiring explicit Human Developer approval.
**Human confirmation source:** Human Developer confirmation after Continuity Version 2 validation
**Supersedes:** None

### DEC-024 — Imported Vendor Working-Copy Mutability

**Status:** Confirmed

**Scope:** Studio OS and all projects

**Confirmed decision:** Original Vendor source archives, original downloaded
package archives, verified source folders outside an active working project,
and verified rollback sources remain immutable, hash-protected, and
restorable. Vendor files imported into an active Unity working project are
working copies. Within an explicitly authorised Unity import, version,
dependency, or render-pipeline task, Unity may reserialize, upgrade, reimport,
regenerate metadata for, or otherwise technically adapt those working copies.
A byte-level difference in an imported working copy is not by itself a Hard
Fail.

Intentional aesthetic edits, manual value changes, destructive conversion,
deletion, silent reference loss, source-archive overwrite, and irreversible
corruption are not authorised by technical working-copy mutability.
Project-owned variants or overrides remain the preferred location for
deliberate creative, gameplay-facing, or reusable adaptations.

**Implications:** Future Unity work must distinguish immutable source,
mutable imported working copy, and project-owned variant. Large technical
mutations use proportional semantic and provenance checks rather than
requiring exhaustive working-copy byte identity. Historical evidence remains
historical; future stop logic may not treat explained working-copy hash drift
alone as source corruption.

**Human confirmation source:** Human Developer governance decision,
2026-07-25, `Studio OS — Vendor Working Copy Mutability and Absolute
No-Training Boundary`

**Supersedes:** Every conflicting rule that required imported Vendor
working-copy files to remain byte-identical, including the future-use
interpretation of the `C99-HDRP-WAREHOUSE-MIGRATION-V1` Vendor hash-drift Hard
Fail. It does not supersede protection of original sources or verified
rollback sources.

### DEC-025 — Absolute No-Training Boundary

**Status:** Confirmed

**Scope:** Studio OS, Crime99, all projects, all content, and all processing
systems

**Confirmed decision:** No Studio OS or project content may be used for model
training, fine-tuning, reinforcement learning, model improvement, dataset or
benchmark construction, evaluation- or embedding-corpus construction,
persistent reference-library creation, style learning, imitation learning,
reconstruction learning, or any comparable persistent AI-learning purpose.
This applies regardless of source, ownership, format, confidentiality, or
whether the content is Human-created, AI-generated, licensed, public, private,
derived, or project-owned.

Authorised one-time inference, analysis, implementation, or review is
permitted only when the current task explicitly authorises the content and
purpose, processing is transient and task-bounded, the applicable provider
plan/configuration and terms do not use submitted content for training or
model improvement, no persistent training/reference/learning corpus is
created, and the content is not reused for unrelated users, projects, or
models. If that boundary cannot be supported or verified, the content must not
be submitted.

Integrated Crime99-scene screenshots may be used for explicitly authorised
one-time visual quality analysis under this boundary. They may not be used for
training, style learning, imitation, reconstruction, dataset creation, or as
generation references. Raw or isolated Vendor assets remain subject to any
stricter licence-specific restriction. Derived textual findings may be stored
as project feedback.

**Implications:** A no-training violation, or submission to a service that may
train on or improve models from the content, is a Hard Fail. Governance may
not claim to override a provider's actual data practices. Uncertain provider
behaviour must be recorded, protected content withheld, and Human approval
obtained before submission.

**Human confirmation source:** Human Developer governance decision,
2026-07-25, `Studio OS — Vendor Working Copy Mutability and Absolute
No-Training Boundary`

**Supersedes:** Any narrower or inconsistent project rule that prohibited all
one-time integrated-scene screenshot analysis, while retaining and
strengthening Vendor-licence restrictions and Human authority.

### DEC-026 — Crime99 Alley District and Master City Planning Baselines

**Status:** Confirmed

**Scope:** Crime99 Master City production planning

**Confirmed decision:** The Alley District production-planning baseline is
`560 × 450 metres`, approximately `0.252 km²`, with a target structure of
`16` macro blocks. The Master City production-planning envelope is
`1.70 × 1.70 kilometres`.

These values are approved planning baselines, not immutable final dimensions.
Later gameplay, traversal, density, performance, and visual tests may justify
bounded adjustments only with Human approval.

The revised
`C99-ALLEY-DISTRICT-SCALE-REASSESSMENT-V1/ALLEY_DISTRICT_REBUILD_WORK_ORDER.md`
is authorised for Gate 1 only. Gate 1 may establish the complete district
envelope and coarse full-district road plan, then build one coherent
representative sector of `3–4` connected blocks using project-owned road,
sidewalk, curb, parcel, access, and building-massing geometry.

Execution must stop after the Gate-1 Human Review Package. Full-district
construction, Vendor building replacement, detailed props, dressing, gameplay
integration, and later lifecycle stages remain unauthorised.

Current in-engine screenshots must be directly opened by an eligible visual
reviewer. Capture generation, file existence, hashes, or nonblank telemetry do
not constitute inspection. Without verified direct inspection, the visual
result is `NOT REVIEWED` and Gate 1 stops.

**Implications:** Project-owned road proxies are the only scope-compatible
Gate-1 road choice. Movement presets, population bands, gameplay acceptance,
and detailed external-district contracts remain unconfirmed unless separately
approved. No stage, commit, or push is authorised.

**Human confirmation source:** Human Developer instruction, 2026-07-26,
`Human scale decision approved`

**Supersedes:** The `PREPARED — NOT AUTHORISED FOR EXECUTION` Gate-1 state in
the scale-reassessment package. It does not supersede the rejected-baseline
exclusion, the visual-inspection gate, or the absolute no-training boundary.

### DEC-027 — Gate-1 Human Visual Baseline and Bounded Correction

**Status:** Confirmed

**Scope:** Crime99 Alley District Gate 1

**Confirmed decision:** The Human directly reviewed the exact current
`C99-ALLEY-DISTRICT-REBUILD-GATE1-V2` Gate-1 result and assigned:

`PASS WITH CONCERNS — Coherent Blockout Confirmed by Human Review`

The connected street structure, four urban blocks, building massing, spatial
allocation, and representative-sector relationship to the larger district are
approved as the correction baseline. Their absence of final Vendor assets and
visual dressing is acceptable at this structural blockout gate. The approved
four-block structure and building-massing concept may not be rebuilt without
demonstrated structural necessity and new Human authority.

The existing technical findings for road and sidewalk widths, curbs, access
openings, and connection geometry remain valid. One bounded Gate-1 correction
pass is authorised for those findings. Before correction, the Human-applied
HDRP Wizard fixes for Linear Color Space and High Quality Lightmap Encoding
must be recorded, Unity reloaded as necessary, the exact Wizard checks
confirmed resolved, and relevant technical validation rerun.

After correction, current elevated, top-down, street/diagnostic captures must
be regenerated and directly reviewed. Vendor replacement, detailed dressing,
gameplay integration, Gate 2, stage, commit, and push remain unauthorised.
Execution stops after the corrected Gate-1 Human Review Package.

**Implications:** The V2 Human visual verdict does not erase its technical
findings. A corrected candidate may receive a technical pass independently,
but remains `NOT REVIEWED` until the exact corrected images receive a new
eligible direct review. The absolute no-training boundary remains controlling.

**Human confirmation source:** Human Developer instruction, 2026-07-26,
`Human visual review completed`

**Supersedes:** The V2 visual classification
`NOT REVIEWED — NO ELIGIBLE DIRECT VISUAL INSPECTION`. It does not supersede
the V2 technical findings, `DEC-025`, or the Gate-1-only scope.

### DEC-028 — Corrected Gate-1 Acceptance and Unity Bridge Prerequisite

**Status:** Confirmed

**Scope:** Crime99 Alley District Gate 1 and its immediate production
transition

**Confirmed decision:** The Human directly reviewed the corrected
`C99-ALLEY-DISTRICT-REBUILD-GATE1-V3` result and assigned:

`PASS WITH CONCERNS — Gate 1 approved for continuation`

The connected street structure remains coherent, the four-block sector remains
credible, roads and paths are wider and more readable, curved transitions are
indicated, access points and likely delivery/service entrances are visibly
marked, and the correction did not harm the approved block structure.

Access and delivery/service entrance positions remain approximate. Their exact
width, placement, and alignment require later validation against real Vendor
buildings, entrances, vehicle clearance, and gameplay use. The current access
markers are preserved as provisional planning elements and may not be treated
as final geometry. No further Gate-1 tuning is required.

The next production step may be prepared. Before substantial Vendor
replacement or visual iteration, one separately bounded Unity MCP/interactive
bridge pilot must be performed successfully.

**Implications:** Gate 1 is accepted. Its final technical result remains
`PASS — BOUNDED GATE-1 CORRECTION TECHNICAL VALIDATION`. Gate-1 acceptance
does not itself authorise substantial Vendor replacement, detailed dressing,
gameplay integration, Gate 2, tool installation, package changes, external
content submission, stage, commit, or push. If no Unity MCP/interactive bridge
is connected, the pilot remains `NOT EXECUTED` rather than being replaced by
batch-mode or file-only evidence.

**Human confirmation source:** Human Developer instruction, 2026-07-26,
`Final corrected Gate-1 verdict`

**Supersedes:** The V3 visual classification
`NOT REVIEWED — CORRECTED CAPTURES REQUIRE DIRECT HUMAN INSPECTION`. It does
not supersede `DEC-025`, the provisional nature of access geometry, or the
requirement for separate authority for later production stages.

### DEC-029 — Crime99 Project Responsibility Split and Gate-2 Authority Resolution

**Status:** Confirmed

**Scope:** Crime99 project responsibility, city production environment, and
Gate-2 authority

**Confirmed decision:**

1. `Projects/Crime99MasterCityDiscovery` is the canonical Unity working
   environment for Crime99 city, world, and level production.
2. `Projects/Crime99` remains the canonical technical gameplay repository
   until a separately authorised architecture or integration decision changes
   this responsibility split.
3. `C99-ALLEY-DISTRICT-REBUILD-GATE1-V3` remains the last formally authorised
   city production baseline.
4. Later Gate-2/B11 work is not retroactively authorised. It remains protected
   historical technical, proof, and learning evidence.
5. Individual Gate-2/B11 findings or assets may be reused only after explicit
   selection and fresh validation under a separately authorised task.
6. A new Gate-2 production work order requires separate Human authorisation
   after stabilization.
7. This decision does not authorise production, Unity execution, cleanup,
   deletion, integration, staging, commit, or push.

The responsibility split identifies canonical homes; it does not claim that
the city and gameplay projects are already integrated. Changing either
project's responsibility, integrating their architectures or content, or
replacing the split requires a separately authorised Human architecture or
integration decision.

**Implications:** Project documentation and operational state must distinguish
the canonical city/world/level environment from the canonical technical
gameplay repository. Historical Gate-2/B11 artifacts remain protected evidence,
not accepted production baselines or current execution authority.

**Human confirmation source:** Human Developer confirmation in Director chat,
2026-07-30, following Gate-0 option D resolution.

**Supersedes:** Obsolete project-role statements that describe
`Projects/Crime99MasterCityDiscovery` only as a future-canonical,
non-production discovery environment, and any operational implication that
later Gate-2/B11 execution was authorised or accepted. It does not supersede
DEC-026, DEC-027, or DEC-028.

### DEC-030 — Bounded CO2 Unity Capture Procedure Acceptance

**Status:** Confirmed

**Scope:** Crime99 Gate-1-V3/CO2 technical capture procedure only

**Confirmed decision:** The Human accepted the bounded technical capture
procedure demonstrated by
`C99-UNITY-MCP-VISUAL-VERIFICATION-CO2-ROUTING-TAB-NEUTRAL-CAPTURE-PROOF`.
That acceptance is limited to the exact CO2 procedure: explicit pinning of the
complete Unity instance identity, verification of the named project, Unity
version, Editor state, scene and existing camera, direct sequential Unity-MCP
operations, use of the separately authorised and validated CO2 endpoint,
external PNG output, and recorded state comparison and restoration.

This acceptance does not accept the visual quality of the images; does not
create Gate-1 or B11 visual or production acceptance; and does not accept or
authorise production, Gate 2, or general Unity-MCP or capture capability. It
does not adopt a playbook amendment or authorise Unity execution, scene or
camera mutation, production work, staging, commit, or push.

**Implications:** The concrete
`c99_capture_camera_to_absolute_png` handler remains restricted to its proven
Gate-1-V3/CO2 conditions. The stdio `custom-tools=0` discovery result remains
an unresolved limitation; direct successful handler execution proves only
that the exact handler was reachable after explicit pinning. Any broader reuse,
playbook adoption, or implementation requires separate Human authority and
validation.

**Human confirmation source:** Human Option A persisted by
`C99-STUDIO-UNITY-MCP-VISUAL-EVIDENCE-PLAYBOOK-AMENDMENT-DESIGN-V1`,
2026-07-31

**Supersedes:** None

### DEC-031 — Crime99 Master City Static Learning-Evidence Reclassification

**Status:** Confirmed

**Scope:** Crime99 Master City project role, historical evidence authority, and
future city-environment selection

**Confirmed decision:**

1. `Projects/Crime99MasterCityDiscovery` is a static protected
   learning-evidence project. It preserves attempted workflows, failure
   evidence, technical proofs, and reusable lessons.
2. The project is not an accepted visual result, a current production
   baseline, an active production environment, or a future-assumed production
   environment.
3. `C99-ALLEY-DISTRICT-REBUILD-GATE1-V3` remains the last formally authorised
   historical city-stage result. That historical status does not make it an
   automatic future restart baseline or a quality endorsement.
4. Later Gate-2/B11 material remains protected historical learning evidence
   only. It is not retroactively authorised or accepted.
5. Historical evidence proves only that its documented attempt, observation,
   result, or decision record existed under its documented conditions. It does
   not by itself prove correctness, acceptance, currency, reusability,
   production readiness, or future suitability.
6. No current canonical Crime99 city/world/level Unity production environment
   is designated.
7. Future city production must separately select or create its working
   environment and must explicitly select its pipeline, baseline, and
   repository ownership before implementation.
8. `Projects/Crime99` remains the canonical technical gameplay repository.
   This decision does not claim that gameplay and city content are integrated.
9. The proposal for a dedicated Master City Git repository is deferred and is
   not adopted.
10. This decision does not authorise production, Unity or Unity-MCP execution,
    reuse, cleanup, deletion, movement, archival, repository creation or
    migration, ignore changes, integration, staging, commit, push, or remote
    contact.

**Implications:** Current project documentation and operational state must
classify `Projects/Crime99MasterCityDiscovery` only as static protected
learning evidence. No future task may infer a production environment,
pipeline, baseline, quality verdict, Git owner, or restart authority from its
historical contents. Reuse of an individual finding or asset still requires
explicit selection, current authority, and fresh validation.

**Human confirmation source:** Human Developer Work Order
`C99-STUDIO-MASTERCITY-STATIC-LEARNING-EVIDENCE-RECLASSIFICATION-V1`,
2026-08-02.

**Supersedes:** Only DEC-029's designation of
`Projects/Crime99MasterCityDiscovery` as the canonical active
city/world/level Unity working environment and the corresponding implication
that it is the assumed home for future city production. DEC-029 remains the
historical responsibility record. Its gameplay ownership, Gate-1 V3 historical
authority, Gate-2/B11 protection, explicit-reuse validation requirement, and
no-production/no-Git-authority boundaries remain in force. This decision does
not supersede DEC-026, DEC-027, DEC-028, or DEC-030.

### DEC-032 — Operational Recovery Before Candidate Attempt

**Status:** Confirmed

**Scope:** Studio Operating System; all projects and future AI-agent tasks

**Confirmed decision:** The Human directs the Studio OS to apply the
following adopted rule. A pre-candidate operational failure must not be
treated as a candidate, asset, gameplay or visual failure merely because a
process, tool, launch or capture was consumed. Work Orders must separately
account for planned setup, bounded operational recovery, candidate attempts
and formal creative corrections.

Within existing authority, Work automatically repairs a proven compile,
import, launch, wrapper, tool, output-guard or evidence-path fault when
protected state remains exact, no candidate-affecting mutation occurred or it
was exactly restored, output ownership is unambiguous, and the repair changes
one concrete execution condition. This does not authorise blind retries,
guard weakening, uncertain cleanup, scope or method changes, protected-source
mutation, dependency changes, Git, network access, purchase, download,
adoption or any other authority expansion.

**Implications:** A candidate attempt begins only at the declared attempt-
start condition after applicable preconditions pass. Planned compile/import
warm-up is setup. Qualifying operational errors use a separate bounded
recovery allowance and do not consume candidate-attempt or creative-
correction budgets. Future Task-Delta Work Orders must declare the separate
allowances and task-owned output namespaces. Stops remain mandatory for
protected drift, uncertain ownership, failed restoration, repeated unchanged
failure, scope/method change or exhausted operational recovery.

**Human confirmation source:** Human Developer direction to make the rule
generally valid and part of the Studio OS for future chats, 2026-08-22.

**Supersedes:** None. This decision clarifies and strengthens the existing
formative-work, failed-tool, invalid-evidence and no-candidate accounting
rules.

### DEC-033 — Crime99 Integrated Production Environment Selection

**Status:** Confirmed

**Scope:** Crime99 gameplay, city/world production environment, pipeline, and
repository ownership

**Confirmed decision:**

1. `Projects/Crime99/Source/Crime99` is the canonical integrated Crime99 Unity
   working environment for gameplay and city/world/level production.
2. `Projects/Crime99` remains the canonical repository owner. No additional
   repository, project migration, or Vendor working copy is selected.
3. The selected environment currently uses Unity `6000.3.19f1` and URP
   `17.3.0`; a later pipeline or version change requires separate authority.
4. This environment selection does not adopt any scene, city candidate,
   Industrial Harbour assembly, asset placement, visual result, or production
   baseline. Each remains governed by its own evidence and Human checkpoint.
5. `Projects/Crime99MasterCityDiscovery` remains static protected learning
   evidence under DEC-031 and is not restored as a production environment.
6. The failed absolute-position proxy/slab composition remains
   `FAIL_NOT_ADOPTED`. Primitive proxy blocks or isolated hardscape islands
   must not be reintroduced as city-production substitutes.
7. This decision does not authorise Git, packages, downloads, purchases,
   cleanup, deletion, migration, or candidate adoption.

**Implications:** New authorised Crime99 gameplay and city work may use the
same canonical Unity project without repeating environment selection. A Task-
Delta Work Order must still name its exact scene source, protected paths,
allowed mutation paths, evidence, attempt boundary, and Human checkpoint.

**Human confirmation source:** Human Developer direction `wir bleiben in
Crime99`, followed by authority to proceed with the next real industrial-
parcel production task, 2026-08-23.

**Supersedes:** DEC-031 clauses 6-8 only insofar as no current environment was
then selected and gameplay/city integration was not yet claimed. All static-
learning-evidence, protection, historical-authority, no-Git, and no-automatic-
reuse boundaries in DEC-031 remain in force.

### DEC-034 — Director Orchestration-Only Execution and Independent Closure

**Status:** Confirmed

**Scope:** Studio Operating System; all future Director-originated mutation-
capable work

**Confirmed decision:** A Director is orchestration-only. Human authorisation,
including `go`, authorises the exact scope for validated dispatch and does not
authorise direct Director implementation. Before the first mutation and after
every task pivot, Director and Work remain separate execution identities.

Every new mutation-capable Director dispatch requires one separately created
Worker task, an explicit requested model, reasoning effort and specific routing
reason, live separate-task and cursor-monitoring capabilities, and cursor-based
monitoring by the Director. If separate task creation or monitoring is
unavailable, the Director stops rather than executing the work itself.

When independent review is required, at most one decision-relevant separate
Reviewer task activates after the Worker freezes reviewable evidence. Builder
self-review is not independent. An independently reviewed `PASS` may enter
operational state only after an immutable closure receipt binds the exact Work
Order, distinct Director/Worker/Reviewer task identities, candidate, evidence,
review record and applicable verdict. Missing, stale, self-authored or
mismatched closure evidence fails closed.

The rule is prospective. Historical version-1 dispatch artifacts remain
historical evidence and are not rewritten or retrofitted. This decision does
not grant project, Unity, package, download, network, Git or follow-on
authority.

The exact adopted enforcement implementation is:

Independent review verdict: PASS

Worker task: 01a04cf1-ae5e-70d1-94fe-5d125d1bf0f4

Reviewer task: 01a04d0c-9935-7441-a1e5-93c2ef82e5f3

Candidate identity: e5e40b3cb7642e6de064b703c9704bd4fa7032cdad04e92c888478ce13973cb1

Closure receipt: 2170c153b8a95c1d5f7a66536efeadfcd6f637da24f1608c7f91d8d28aa1292a

**Implications:** Future Director chats must apply the Director Non-Execution
Gate in `AGENTS.md`, the Role Operating Model, AI Development Rules, the
prospective dispatch procedure and the operational closure gate. Technical or
Builder evidence alone cannot produce an independently reviewed PASS claim.

**Human confirmation source:** Human-authorised Work Order
`C99-STUDIO-DIRECTOR-ORCHESTRATION-ENFORCEMENT-V1`, independently reviewed by
task `01a04d0c-9935-7441-a1e5-93c2ef82e5f3` and closed through receipt
`2170c153b8a95c1d5f7a66536efeadfcd6f637da24f1608c7f91d8d28aa1292a`,
2026-08-29.

**Supersedes:** Any workflow interpretation that allowed a Director to perform
the implementation it dispatched, treated Human `go` as a self-execution
waiver, treated Builder self-review as independent, or projected an
independently reviewed PASS without exact closure evidence. It does not
supersede narrower permission, Human checkpoint, correction, safety or
authority boundaries.
