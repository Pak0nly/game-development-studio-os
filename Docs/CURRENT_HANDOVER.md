# Current Handover

This file preserves only the context needed to continue current work. It is an operational record, not an adopted governance standard.

## Handover Summary

The Human Developer confirmed the complete Crime99 first-prototype technical architecture as the planning baseline on 2026-07-15. It selects Variant A, Unity `6000.3.19f1`, Windows Standalone, URP, Unity Input System, Unity NavMesh for foot navigation, a small project lane graph, a small custom arcade vehicle controller, project-owned core rules, built-in/small pools, Particle System before VFX Graph, project-owned occlusion, and a simple minimap. Prototype 1 uses `Fixed Camera`; the later `Rotatable Camera` comparison remains separately authorised future work and is not preimplemented. Abstractions are added only for concrete current-gate needs. No commit, push, purchase, download, installation, main-project creation, asset transfer, or gameplay implementation is authorised.

## Confirmed Studio OS State

- Continuity Version 2 passed, including validation in a new Director chat.
- Autonomy Level B is binding and active under `Docs/AI_DEVELOPMENT_RULES.md` and DEC-008.
- The active environment is Windows 11, Unity 6000.3.19f1, Visual Studio Community 2022 with Unity support, and Windows Desktop.
- The private GitHub remote is configured and synchronized.
- DEC-023 remains only partially implemented: the independent encrypted offline backup on a separate physical device is still open.

## Passed Workflow Tests

- `Projects/Match3WorkflowTest/`: fully passed automated, compilation, batch-mode, and Human Developer Play Mode validation.
- `Projects/SideScrollerWorkflowTest/` Phase 1: fully passed gameplay, structure, compilation, batch-mode, and Human Developer Play Mode validation.
- `Projects/SideScrollerWorkflowTest/` Phase 2: fully passed texture/material integration, regression, compilation, batch-mode, and Human Developer visual validation.

Approximate work-consumption measurements supplied by the Human Developer:

- SideScroller Phase 1: approximately 30-35% of the five-hour work allowance.
- SideScroller Phase 2: approximately 23 percentage points.

These values are operational observations, not adopted targets or governance rules.

## Crime99 Documentation State

The Project Brief is `Confirmed`. Prototype Scope and Prototype Roadmap are `In Review`. The Roadmap is the sole canonical source for `Gate A — Basic Control Quality` through `Gate F — Technical Viability`; Prototype Scope contains the canonical design-level rules and references the Roadmap instead of redefining gates.

The confirmed first-prototype asset strategy uses the Humble Bundle `Cosmos Eclipse Game Dev Assets & Tools Bundle — Unreal, Unity, Godot` as the planned primary source and follows `Buy, reuse, adapt lightly`. `1950s NYC`, `Cyberpunk Port City`, and `Fuyoh Cyberpunk Diner` are the exact required first-Preflight packages; `POLYGON Particle FX` is optional only when included in the comprehensive start approval. `ASSET_STYLE_PREFLIGHT_PLAN.md` defines the minimal representative categories, isolated project proposal, import/reset sequence, untouched-original boundary, both-camera protocol, technical matrix, provisional test-only performance and adaptation thresholds, one `Initial Execution Approval`, exception-only stops, evidence outputs, and one `Final Human Review`. No generative derivation, training, or generative-reference use is permitted.

Prototype 1 uses `Fixed Camera` at fixed elevation and distance with no zoom, panning, or independent translation. A later separately authorised comparison may add only free rotation around the player while retaining fixed elevation and distance; no rotatable rig or camera abstraction is required in prototype 1. Unity `6000.3.19f1`, Windows Standalone, and URP are confirmed for the technical planning baseline. Store systems remain unadopted candidates until a demonstrated gap and separately authorised preflight.

This remains a Definition-phase documentation state. The architecture is confirmed for planning but does not authorise project creation or implementation. `Crime99` is an internal working title only.

## Open Items

- Select suitable separate physical storage, configure the encrypted offline backup, and test recovery.
- Continue evaluating continuity and handover practices without treating proposed protocols as adopted.
- Human Developer reviews the exact staged 18-file Crime99 architecture documentation set and either requests revisions or separately approves a later commit.
- Any project setup, Gate A implementation, Store candidate preflight, asset transfer, alternate graphics API, development build, or gameplay work requires a new explicit scope.
- Use the final dated review ZIP created by this execution; do not rely on earlier missing or obsolete archives.
- Any later commit or push requires separate exact-scope approval.

## Restart Procedure

1. Read `AGENTS.md`.
2. Read `Docs/WORK_STATE.md`.
3. Read this file.
4. Read `Docs/CONFIRMED_DECISIONS.md` and task-relevant authoritative documents.
5. Verify branch, HEAD, working tree, and `origin/main` synchronization without changing Git state.
6. Read `Docs/Projects/Crime99/README.md`, its confirmed Project Brief, in-review Prototype Scope and Roadmap, Decision Register, Risk Register, and validation report.
7. Read the four technical planning documents, then `OPEN_DECISIONS.md` and the technical package evidence in `ASSET_PURCHASE_CANDIDATES.md`.
8. Verify the dated architecture ZIP and current Git state. Do not stage, commit, push, add unapproved assets/tools, create or transfer into a main project, or implement gameplay.

## Exact Next Task

Human Developer reviews the staged documentation set and either requests revisions or separately approves a commit. Stop before commit, push, purchase, download, installation, project creation, asset transfer, or gameplay implementation.
