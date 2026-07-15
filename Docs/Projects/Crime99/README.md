# Crime99 — Project Documentation

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Project documentation entry point
**Validation State:** Not applicable
**Approval Status:** Mixed; technical planning baseline confirmed, broader project documentation remains in review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-15

This directory contains the current project definition and design documentation for an original elevated-camera urban action game. `Crime99` is an internal working title only; no final public or commercial name is confirmed.

The product is framed through its own identity: a solo-testable Free-for-All experience, a vehicle and on-foot combat sandbox, a reactive city with civilians, traffic, police, and destruction, short-form chaotic action, and the stylised `Neon over Dirt` visual direction.

Distinct original identity anchors still need development for the city premise and world logic; scoring language and rewards; and the visual, audio, UI, faction, character, and branding identity. No final lore, brands, factions, characters, or narrative content is established by this documentation pass.

## Current Project Goal

The immediate goal is to define and validate a solo-testable Free-for-All prototype.

The prototype should determine whether the following combination is enjoyable and technically viable:

* responsive movement;
* independent aiming;
* vehicle theft;
* arcade driving;
* handbrake drifting;
* foot combat;
* roadkills;
* vehicle damage and destruction;
* explosions and chain reactions;
* combat bots;
* civilians and traffic;
* limited police pressure;
* creative scoring;
* `Fixed Camera` for the first prototype with an architectural path to a later `Rotatable Camera` comparison;
* Neon over Dirt visual identity.

Network multiplayer, factions, economy, story, and long-term progression are not part of the first prototype.

## Authoritative Reading Order

Read the project documents in this order:

1. [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md)
2. [`GDD/GDD_INDEX.md`](GDD/GDD_INDEX.md)
3. [`GDD/16_PROTOTYPE_SCOPE.md`](GDD/16_PROTOTYPE_SCOPE.md)
4. [`PROTOTYPE_ROADMAP.md`](PROTOTYPE_ROADMAP.md)
5. [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md)
6. [`TECHNICAL_DECISIONS.md`](TECHNICAL_DECISIONS.md)
7. [`IMPLEMENTATION_SEQUENCE.md`](IMPLEMENTATION_SEQUENCE.md)
8. [`TECHNICAL_RISK_REVIEW.md`](TECHNICAL_RISK_REVIEW.md)
9. [`ASSET_STYLE_PREFLIGHT_PLAN.md`](ASSET_STYLE_PREFLIGHT_PLAN.md) when reviewing the completed first Asset and Style Preflight plan
10. [`OPEN_DECISIONS.md`](OPEN_DECISIONS.md)
11. [`RISK_REGISTER.md`](RISK_REGISTER.md)
12. the remaining GDD modules as required

## Document Roles

### Historical Pre-Correction Archive

`Crime99.zip` is an unchanged snapshot from before the 2026-07-14 correction pass. Its contents are historical evidence only, are not part of the then-current 24-file Markdown correction set or the later asset-planning documents, must not be used as current authority or scope, and are excluded from the documentation baseline.

### [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md)

The concise project definition.

It contains:

* product identity;
* target experience;
* player fantasy;
* design pillars;
* main game modes;
* visual direction;
* production model;
* platform direction;
* business-model tendency;
* non-goals;
* current priorities.

This is the primary project entry point.

### `GDD/`

The modular Game Design Document.

It contains detailed design information for:

* product vision;
* design pillars;
* core gameplay;
* movement and combat;
* vehicles;
* world and city;
* AI, NPCs, and traffic;
* police and escalation;
* game modes;
* Faction War;
* economy and progression;
* art direction;
* camera and UI;
* audio;
* multiplayer;
* prototype scope;
* deferred ideas.

### [`GDD/GDD_INDEX.md`](GDD/GDD_INDEX.md)

The central navigation and status overview for the modular GDD.

Use it to determine:

* which modules exist;
* which modules are confirmed;
* which modules remain `In Review`, `Deferred`, or `Needs Validation`;
* which modules require prototype validation;
* which topics are intentionally deferred.

### [`GDD/16_PROTOTYPE_SCOPE.md`](GDD/16_PROTOTYPE_SCOPE.md)

The authoritative design scope for the first prototype.

It defines:

* required systems;
* explicit exclusions;
* success criteria;
* design-level prototype rules;
* stress-test expectations;
* scope-reduction rules.

### [`PROTOTYPE_ROADMAP.md`](PROTOTYPE_ROADMAP.md)

The recommended implementation and validation order.

It defines:

* milestone sequence;
* milestone goals;
* included work;
* questions to answer;
* completion criteria;
* prototype gates;
* final review outcomes.

The roadmap does not authorise implementation.

### [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md)

The confirmed first-prototype planning baseline for runtime, project, test, asset, data, and dependencies. It selects a small project-owned modular monolith and Variant A while prohibiting precautionary abstractions.

### [`TECHNICAL_DECISIONS.md`](TECHNICAL_DECISIONS.md)

The technical decision register and package/tool evaluation. It separates accepted planning decisions, conditional preflight candidates, deferred systems, and rejected excess scope.

### [`IMPLEMENTATION_SEQUENCE.md`](IMPLEMENTATION_SEQUENCE.md)

The gate-aligned technical work-package plan, including dependencies, tests, Human Review criteria, stop criteria, simplifications, exclusions, and rough non-binding effort ranges.

### [`TECHNICAL_RISK_REVIEW.md`](TECHNICAL_RISK_REVIEW.md)

The focused technical risk, contingency, Store-candidate rejection, work-consumption, and gate-stop plan.

### [`ASSET_STYLE_PREFLIGHT_PLAN.md`](ASSET_STYLE_PREFLIGHT_PLAN.md)

The bounded execution plan for the first Crime99 Asset and Style Preflight.

It defines the proposed isolated Unity test environment, exact package categories, provisional test-only URP choice, import and reset gates, technical and visual evaluation matrix, both-camera protocol, pass/fail and exception-only stop criteria, evidence requirements, one comprehensive `Initial Execution Approval`, and one `Final Human Review`. The plan does not itself authorise purchase, download, import, installation, Unity project creation, Preflight execution, main-project transfer, architecture, staging, commit, or push.

### [`OPEN_DECISIONS.md`](OPEN_DECISIONS.md)

The central register for unresolved and recently resolved decisions.

It records `Active`, `Deferred`, `Needs Prototype Validation`, and `Closed` entries that require or preserve:

* research;
* technical review;
* prototype validation;
* explicit approval;
* deliberate deferral.

Closed entries remain as decision evidence. Ideas and feature concepts do not belong there unless an actual decision is required.

### [`RISK_REGISTER.md`](RISK_REGISTER.md)

The active register of product, gameplay, technical, production, governance, and commercial risks.

It documents:

* probability;
* impact;
* consequences;
* mitigation;
* trigger indicators;
* review points;
* failure boundaries.

## Document Status Values

The following values may be used across the project documentation:

* **Draft:** Content is incomplete or still being developed.
* **In Review:** Content is currently being evaluated.
* **Confirmed:** Content has been accepted as the current design direction.
* **Needs Validation:** A prototype, test, or research result is required before confirmation.
* **Deferred:** Content is intentionally postponed.
* **Rejected:** Content was evaluated and is not part of the current direction.
* **Retired:** Content was previously relevant but is no longer active.

## Decision Classification

Design statements should be classified where useful.

### Confirmed

The current intended design direction.

### Prototype Assumption

A design direction accepted for testing but not yet proven.

Example:

> A fixed elevated camera with moderate tilt can support high-speed driving.

### Open

A decision has not yet been made.

### Deferred

The decision is intentionally postponed.

### Rejected

The option was considered and excluded.

## Current Authoritative Documents

All GDD modules are populated. Most remain `In Review`, `Deferred`, or `Needs Validation`; populated content is not the same as approved scope.

The current authority chain is:

1. applicable adopted Studio OS documents;
2. the confirmed [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md);
3. confirmed project decisions recorded by the Human Developer;
4. the in-review [`GDD/16_PROTOTYPE_SCOPE.md`](GDD/16_PROTOTYPE_SCOPE.md) for exact prototype design rules;
5. the in-review [`PROTOTYPE_ROADMAP.md`](PROTOTYPE_ROADMAP.md) for the canonical gate sequence and completion checks;
6. the current technical planning set for implementation architecture, technical decisions, execution detail, and technical risks;
7. the project decision and risk registers;
8. other GDD modules for supporting context.

## Current Implementation Boundary

Technical architecture planning is confirmed as the planning baseline. No implementation is currently authorised. `Accepted for Planning` in the technical decision register is not an implementation status or permission.

The existing documentation does not authorise:

* Unity project creation;
* source-code generation;
* Asset Store purchases;
* asset downloads;
* external tool integration;
* Blender automation;
* package installation;
* gameplay implementation;
* build creation;
* multiplayer development.

Implementation requires a separate explicit approval through the Studio Operating System.

## Current Blocking Topics

The current activity is final consistency validation and exact-scope staging of the confirmed technical planning baseline. Genuine unresolved, deferred, and validation-dependent items remain in [`OPEN_DECISIONS.md`](OPEN_DECISIONS.md). The main blockers before implementation are exact project path, implementation authorisation, any candidate preflight/purchase authority, final fixed-camera tuning, Store-tool adoption after evidence, and binding performance targets.

## Current Recommended Next Steps

1. Review the exact staged 18-file architecture documentation set and either approve or revise a later commit.
2. Keep [`GDD/16_PROTOTYPE_SCOPE.md`](GDD/16_PROTOTYPE_SCOPE.md) and [`PROTOTYPE_ROADMAP.md`](PROTOTYPE_ROADMAP.md) `In Review` unless the Human Developer explicitly confirms them.
3. Confirm the exact project path and a bounded first setup/Gate A work package only through a later explicit implementation approval.
4. Treat every purchase, download, installation, import, Store preflight, commit, push, and implementation step as separately permissioned.

## Maintenance Rules

* Keep the Project Brief concise.
* Keep detailed rules inside the appropriate GDD module.
* Avoid duplicating exact values across several documents.
* Use [`OPEN_DECISIONS.md`](OPEN_DECISIONS.md) for unresolved decisions.
* Use [`RISK_REGISTER.md`](RISK_REGISTER.md) for risks.
* Use [`17_PARKING_LOT.md`](GDD/17_PARKING_LOT.md) for uncommitted ideas.
* Update [`GDD_INDEX.md`](GDD/GDD_INDEX.md) whenever a GDD module changes status.
* Do not treat deferred or parking-lot content as approved scope.
* Do not infer implementation authorisation from detailed planning documents.
