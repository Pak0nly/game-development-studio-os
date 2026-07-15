# Game Design Document Index

## Status

**Document Maturity:** In Review
**Prototype Disposition:** GDD navigation and status index
**Validation State:** Not applicable
**Approval Status:** Pending Human Developer review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This file is the central navigation and status overview for the modular Game Design Document.

The GDD is split into focused modules so that:

* individual systems can be reviewed independently;
* confirmed and deferred content remain separated;
* AI agents can load only relevant context;
* Git changes remain readable;
* prototype scope remains protected from later ideas;
* contradictions can be identified more easily.

The GDD must still be treated as one connected design.

## Project Summary

The project is an original elevated-camera urban action game focused on:

* short chaotic matches;
* vehicle theft;
* arcade driving;
* foot combat;
* roadkills;
* explosions;
* reactive city systems;
* combat bots;
* later multiplayer and faction-based modes.

The first prototype is a solo-testable Free-for-All match against up to eleven combat bots.

The current visual direction is:

> Neon over Dirt.

The city should combine:

* simplified readable geometry;
* wet roads;
* neon lighting;
* smoke and steam;
* grime and soot;
* industrial decay;
* old vehicles;
* strong audiovisual impact.

## GDD Module Status

| ID | Document                           | Current Status                   | Primary Purpose                                                                     |
| -- | ---------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| 01 | [`01_PRODUCT_VISION.md`](01_PRODUCT_VISION.md)             | In Review | Product identity, audience, tone, market direction, and long-term vision |
| 02 | [`02_DESIGN_PILLARS.md`](02_DESIGN_PILLARS.md)             | In Review | Design pillars and decision principles |
| 03 | [`03_CORE_GAMEPLAY.md`](03_CORE_GAMEPLAY.md)               | In Review | Core gameplay loops, match rhythm, player motivation, and shared systems |
| 04 | [`04_PLAYER_MOVEMENT_AND_COMBAT.md`](04_PLAYER_MOVEMENT_AND_COMBAT.md) | In Review | Movement, aiming, stamina, health, armour, weapons, melee, and healing |
| 05 | [`05_VEHICLES.md`](05_VEHICLES.md)                         | In Review | Vehicle classes, handling, theft, impacts, damage, burning, and explosions |
| 06 | [`06_WORLD_AND_CITY.md`](06_WORLD_AND_CITY.md)             | In Review | Map structure, city behaviour, environment, buildings, and world interactions |
| 07 | [`07_AI_NPCS_AND_TRAFFIC.md`](07_AI_NPCS_AND_TRAFFIC.md)   | In Review | Combat bots, civilians, drivers, traffic, role logic, and deferred faction NPCs |
| 08 | [`08_POLICE_AND_ESCALATION.md`](08_POLICE_AND_ESCALATION.md) | In Review | Wanted systems, prototype police response, and deferred escalation |
| 09 | [`09_GAME_MODES.md`](09_GAME_MODES.md)                     | In Review | Prototype FFA and deferred mode concepts |
| 10 | [`10_FACTION_WAR.md`](10_FACTION_WAR.md)                   | In Review; Deferred | Unconfirmed long-term faction-mode hypotheses |
| 11 | [`11_ECONOMY_AND_PROGRESSION.md`](11_ECONOMY_AND_PROGRESSION.md) | In Review; Deferred | Unconfirmed economy and progression hypotheses |
| 12 | [`12_ART_DIRECTION.md`](12_ART_DIRECTION.md)                | In Review; Needs Validation | `Neon over Dirt`, asset cohesion, and visual validation |
| 13 | [`13_CAMERA_AND_UI.md`](13_CAMERA_AND_UI.md)                | In Review; Needs Prototype Validation | Camera variants, occlusion, accessibility, HUD, and minimap |
| 14 | [`14_AUDIO.md`](14_AUDIO.md)                                | In Review; Needs Validation | Music, weapons, vehicles, environment, police, and impact feedback |
| 15 | [`15_MULTIPLAYER.md`](15_MULTIPLAYER.md)                    | In Review; Deferred | Unconfirmed future networking and multiplayer outcomes |
| 16 | [`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md)            | In Review; Needs Prototype Validation | Canonical prototype design rules and boundaries |
| 17 | [`17_PARKING_LOT.md`](17_PARKING_LOT.md)                    | Active Idea Register; Excluded | Ideas that are not current commitments |

## Status Meaning

### In Review

The file is populated and under review. It does not authorise architecture or implementation.

### Needs Validation

The intended direction is sufficiently clear to test, but the correct solution must be determined through gameplay, technical, or visual validation.

### Deferred

The content belongs to the long-term project vision but is outside the first prototype.

Deferred content must not expand prototype scope.

## Authoritative Prototype Documents

The following documents currently define the prototype:

1. confirmed [`../PROJECT_BRIEF.md`](../PROJECT_BRIEF.md);
2. in-review [`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md) for exact prototype design rules;
3. in-review [`../PROTOTYPE_ROADMAP.md`](../PROTOTYPE_ROADMAP.md) as the sole canonical gate sequence and completion-check source;
4. [`../OPEN_DECISIONS.md`](../OPEN_DECISIONS.md) and [`../RISK_REGISTER.md`](../RISK_REGISTER.md) for state and evidence;
5. other modules for supporting context.

When prototype-related documents appear to conflict, use this order:

1. explicit Studio OS authority;
2. approved project-level decisions;
3. [`PROJECT_BRIEF.md`](../PROJECT_BRIEF.md);
4. [`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md) for exact rules;
5. [`PROTOTYPE_ROADMAP.md`](../PROTOTYPE_ROADMAP.md) for gate sequence and completion checks;
6. detailed GDD modules;
7. Open Decisions;
8. Parking Lot.

Open Decisions do not override confirmed design. They identify unresolved areas.

## Prototype Summary

### Mode

* Free-for-All Deathmatch;
* one human player;
* zero to eleven bots;
* maximum twelve combatants;
* configurable timed rounds whose duration is `Needs Prototype Validation`;
* unlimited respawns;
* highest score at timer expiry determines victory; no early score-limit ending.

### Core Player Systems

* keyboard and mouse;
* optional controller support only if negligible in effort;
* independent aiming;
* sprint;
* jump;
* dodge roll;
* stamina;
* health;
* armour;
* medkits;
* fist combat.

### Prototype Weapons

* pistol;
* shotgun;
* rocket launcher;
* exactly three weapon slots.

### Prototype Vehicles

* compact car;
* saloon;
* van;
* refuse truck.

### Prototype World Systems

* civilians;
* civilian drivers;
* dynamic traffic;
* wanted level 1;
* foot police;
* police vehicles;
* limited destructible city objects;
* clinic respawns;
* item and vehicle spawn slots.

### Prototype Visual Systems

* `Fixed Camera` for the first prototype;
* a later `Rotatable Camera` comparison path;
* fixed elevation and fixed distance for both policies;
* free rotation around the player only for the later `Rotatable Camera`;
* no zoom, panning, or independent camera translation;
* wet asphalt;
* neon lighting;
* smoke and steam;
* dirt and soot;
* headlights;
* police lights;
* simplified geometry;
* slightly exaggerated proportions.

## Explicit Prototype Exclusions

The first prototype excludes:

* network multiplayer;
* LAN multiplayer;
* Team Deathmatch;
* Faction War;
* factions;
* HQs;
* territory control;
* economy;
* upkeep;
* purchasable lives;
* higher wanted levels;
* military;
* witness systems;
* enterable buildings;
* building destruction;
* vehicle repair;
* motorcycles;
* physical vehicle doors;
* story campaign;
* dialogue systems;
* radio stations;
* day-and-night cycle;
* later game modes;
* crossplay;
* console support.

The full exclusion list remains authoritative in [`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md).

## Main Design Pillar Candidates

The following pillars are currently established in the Project Brief and must be expanded in [`02_DESIGN_PILLARS.md`](02_DESIGN_PILLARS.md):

### Steal, Escalate, Escape

Players quickly obtain tools, cause trouble, attract pressure, and escape or exploit the consequences.

### Vehicles Are Temporary Tools

Vehicles are stolen, used, damaged, weaponised, and abandoned.

### Players Are the Main Threat

Players and combat bots remain the main danger.

The city complicates conflict but does not replace it.

### The City Fights Back

Traffic, civilians, police, and local population react to visible disruption.

### Creative Chaos Is Rewarded

Creative kills receive score and strong feedback.

### Neon over Dirt

Neon supports a dirty, industrial, criminal city rather than replacing it.

### Solo-Testable by Default

Bots support both development testing and solo enjoyment.

These pillars remain subject to final wording review in the dedicated module.

## Major Prototype Assumptions

The following assumptions require practical validation:

* `Fixed Camera` supports high-speed driving in the first prototype;
* its fixed distance provides enough forward visibility;
* movement remains precise while control and aim stay compatible with a later rotatable comparison;
* vehicle handling is fun without combat;
* instant lethal roadkills can remain fair;
* foot players can counter vehicles;
* three weapons provide enough prototype variety;
* bots can sustain an engaging FFA round;
* traffic and police improve rather than obstruct the match;
* chain reactions remain readable and stable;
* selected bundle assets can be used and lightly adapted into one coherent visual style;
* Neon over Dirt remains readable in motion;
* the two-phase Asset Pre-Production and Asset and Style Preflight sequence can identify a usable main-prototype asset selection;
* the complete stress scenario is technically manageable.

## Long-Term Mode Direction

### Primary Foundation

* Free-for-All Deathmatch
* Team Deathmatch

### Major Long-Term Identity Mode

* Faction War

### Cooperative Direction

* cooperative play against bots

### Later Mode Candidates

* Zombie Outbreak
* Golden Car
* Most Value Collected
* King of the Road

None of the later modes are production commitments.

## Long-Term Faction War Status

Faction War is strategically important but remains deferred.

Current design areas include:

* fixed factions;
* HQs;
* capturable buildings;
* influence networks;
* connected and isolated buildings;
* NPC defence and expansion;
* personal income;
* upkeep;
* upgrade funding;
* bonus transports;
* personal lives;
* faction elimination;
* police pressure against dominant factions.

These systems require a dedicated later review after the first prototype validates:

* player movement;
* combat;
* vehicles;
* AI;
* city systems;
* map scale;
* technical stability.

## Open Decision Overview

All unresolved, deferred, validation-dependent, and recently closed project decisions are maintained in [`../OPEN_DECISIONS.md`](../OPEN_DECISIONS.md).

The most important current unresolved areas are:

* public or commercial title and original identity anchors;
* final project path;
* later technical-architecture questions without selected solutions;
* asset and pipeline evaluation scope without acquisition authority;
* weaker minimum test profile;
* camera, vehicle, AI, traffic, damage, and performance evidence;
* deferred commercial, multiplayer, Faction War, and economy decisions.

## Highest Current Risks

The full risk register is maintained in [`RISK_REGISTER.md`](../RISK_REGISTER.md).

The highest current risks are:

1. prototype scope is too large;
2. on-foot movement is not fun;
3. driving is not fun;
4. the fixed camera fails at high speed;
5. foot players cannot fairly counter vehicles;
6. combat bots become the largest cost;
7. AI systems collapse under stress;
8. Store and AI assets do not match;
9. AI asset production requires routine human correction;
10. architecture requires substantial multiplayer rework.

## Current Documentation Activity

All modules are populated. The current activity is documentation correction and Human Developer decision confirmation. Most modules remain `In Review`, `Deferred`, or `Needs Validation`; none authorises technical architecture or implementation.

## Review Requirements

Each GDD module should be checked for:

* contradiction with the Project Brief;
* contradiction with Prototype Scope;
* accidental prototype-scope expansion;
* duplication of exact values;
* unclear status;
* unmarked assumptions;
* deferred content presented as confirmed;
* insufficient original identity or provenance controls;
* dependency on routine human production;
* technical claims that belong in architecture documents instead.

## Maintenance Rules

* Update this index whenever a module status changes.
* Do not mark a module Confirmed before dedicated review.
* Keep exact prototype rules primarily in [`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md).
* Keep implementation order in [`PROTOTYPE_ROADMAP.md`](../PROTOTYPE_ROADMAP.md).
* Keep unresolved decisions in [`OPEN_DECISIONS.md`](../OPEN_DECISIONS.md).
* Keep risks in [`RISK_REGISTER.md`](../RISK_REGISTER.md).
* Keep uncommitted ideas in [`17_PARKING_LOT.md`](17_PARKING_LOT.md).
* Do not use populated GDD files as evidence that a design area is confirmed.
* Do not infer implementation approval from documentation status.

## Next Review

The Human Developer should review the corrected [`../PROJECT_BRIEF.md`](../PROJECT_BRIEF.md), [`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md), [`../PROTOTYPE_ROADMAP.md`](../PROTOTYPE_ROADMAP.md), decision register, and risk register. Scope and Roadmap must not be promoted from `In Review` autonomously.
