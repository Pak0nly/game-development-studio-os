# Level Design Review Standard

## Purpose

This standard defines the reusable spatial and gameplay review for authored levels, maps, modular blocks, and environment slices. Project documents provide genre-specific values and direction.

## Required Review Areas

- **Reference and place:** intended location type, real/reference research, period, use, and environmental story.
- **Scale:** actor, vehicle, door, floor, building, street, prop, and traversal dimensions agree.
- **Routes and orientation:** primary, secondary, service, escape, optional, and dead-end routes; landmarks and sightlines; understandable entry/exit.
- **Spatial sequence:** approach, threshold, activity, rest, escalation, reveal, and recovery spaces suit the approved experience.
- **Gameplay:** combat/interaction spaces, cover/hazards, vehicle flow, foot flow, chaos/escape opportunity, spawn/respawn plausibility, and dominant-position control.
- **Urban/function logic:** street profiles, parking, loading, deliveries, waste, utilities, yards, backs, crossings, and pedestrian/traffic behaviour.
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

Document edge ownership, compatible technical sockets, grade and width, building/prop slots, variant rules, navigation/camera preservation, seam treatment, and repetition limits. Modules are authoring constraints, not permission for random runtime assembly. A visually obvious kit seam or arbitrary prefab row fails authored-place quality.

## Evidence and Review

Use annotated plans, scale references, sightline/landmark captures, spawn maps, continuous foot/vehicle routes, camera/occlusion evidence, and representative gameplay. Activate the [Visual Level Review Board](../Roles/Boards/VISUAL_LEVEL_REVIEW_BOARD.md) for visible level work.
