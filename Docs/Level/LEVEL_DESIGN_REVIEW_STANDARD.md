# Level Design Review Standard

> **Status:** Adopted through LAIA-2026-07-22 on 2026-07-22; amended through
> `SOS-GOV-AAPEC-V1` on 2026-07-29.

## Purpose

This standard defines the reusable spatial and gameplay review for authored levels, maps, modular blocks, and environment slices. Project documents provide genre-specific values and direction.

New level areas and material structural revisions pass through the [Level Development Lifecycle](LEVEL_DEVELOPMENT_LIFECYCLE.md). This review standard supplies criteria and evidence; it does not replace lifecycle phase gates.

## Review Scope

A Full Level Review for new or structurally material work evaluates every applicable area and behavioural contract below.

A bounded Production stage on an accepted baseline evaluates only level-design claims that are changed, newly claimed, contradicted, or plausibly regressed by the delta. Unchanged valid baseline evidence may be referenced by candidate/evidence ID and continued applicability. A bounded Dressing task does not silently reactivate full route, spawn, vehicle, camera, or occlusion evidence unless the dressing changes or obstructs it, claims it, contradicts the baseline, invalidates prior evidence, or the Task-Delta Work Order explicitly requires it.

## Required Review Areas

- **Reference and place:** intended location type, real/reference research, period, use, and environmental story.
- **Scale:** actor, vehicle, door, floor, building, street, prop, and traversal dimensions agree.
- **Routes and orientation:** primary, secondary, service, escape, optional, and dead-end routes; landmarks and sightlines; understandable entry/exit.
- **Spatial sequence:** approach, threshold, activity, rest, escalation, reveal, and recovery spaces suit the approved experience.
- **Gameplay:** combat/interaction spaces, cover/hazards, vehicle flow, foot flow, chaos/escape opportunity, spawn/respawn plausibility, and dominant-position control.
- **Urban/function logic:** street profiles, parking, loading, deliveries, waste, utilities, yards, backs, crossings, and pedestrian/traffic behaviour.
- **Purpose and hosts:** every retained or new visible prop has an exact
  credible host, defensible purpose, suitable orientation, required clearance,
  and plausible user or gameplay rationale; hostless elements are removed.
- **Asset vocabulary and modular proof:** relevant families are qualified for
  function, scale, orientation, neighbours, transitions, entrances, endings,
  closure, colliders, camera use and repetition before broad production use.
- **Camera and occlusion:** every applicable position class and continuous transition required by the Visual QA workflow.
- **Boundaries:** finished map edges, authored connections, return routes, and no accidental void or trap.
- **Environmental storytelling:** details have a cause, use, maintenance state, and relationship to gameplay rather than random decoration.

## Sandbox / FFA Additions

- more than one useful route through major conflict areas;
- vehicle circulation, interception, turning, recovery, and escape;
- foot routes that are not uniformly dominated by vehicles;
- controlled opportunities for chaos and third-party encounters;
- no accidental choke monopoly or unavoidable spawn exposure;
- credible urban density with readable gameplay space;
- modular transitions that preserve navigation, camera, and route choice.

## Modular Map Contracts

Document edge ownership, compatible technical sockets, grade and width,
building/prop slots, variant rules, navigation/camera preservation, seam
treatment, repetition limits, corners, endings, entrances, interruptions,
transitions, volume or roof closure, ground/wall contact, colliders and
snapping. Modules are authoring constraints, not permission for random runtime
assembly. Broad use is prohibited while an applicable contract remains
unproven. A visually obvious kit seam, unsupported completeness claim, or
arbitrary prefab row fails authored-place quality.

## Evidence and Review

For a Full Level Review, use the applicable annotated plans, scale references, sightline/landmark captures, spawn maps, continuous foot/vehicle routes, camera/occlusion evidence, and representative gameplay. For a bounded stage exit, use only evidence needed by the changed claims and proportional regression surface, plus exact references to unchanged valid baseline evidence. Activate the complete [Visual Level Review Board](../Roles/Boards/VISUAL_LEVEL_REVIEW_BOARD.md) for new or structurally material visible level work. Bounded production on an accepted baseline uses only the decision-relevant stage-exit roles.

## Behavioural Evidence Contracts

These contracts define evidence quality when the corresponding behaviour is part of the review scope. They do not require every bounded visual task to regenerate every behaviour.

- **Vehicle traversal:** enter the identified runtime vehicle from a known start; move through its own physics; continuously drive the required route with steering, braking, turns, recovery/end or return; and record candidate/runtime identity. Teleporting the actor or camera is not vehicle evidence.
- **Foot traversal:** continuously traverse the required route, or provide linked runtime data that proves the same sequence, including chokepoints, transitions, and recovery. A short displacement or NavMesh path alone is insufficient.
- **Occlusion:** use one continuous runtime session through Entry, Behind, Exit, Restored, Re-entry, and applicable target switches. The evidence must expose flicker, permanent hiding, and any treatment that devalues critical play space through whole-building transparency or artifacts.
- **Reset, respawn, and target switch:** trigger the named state change and verify the expected resulting state. An allowable value, object count, or absence of an exception is not proof.
