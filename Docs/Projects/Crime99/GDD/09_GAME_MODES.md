# Game Modes

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Prototype scope with deferred extensions
**Validation State:** Needs Prototype Validation
**Approval Status:** Pending Human Developer review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This document defines the current game-mode direction, priorities, shared rules, and deferred concepts.

Only Free-for-All Deathmatch is included in the first prototype.

## Mode Philosophy

Modes should:

- reuse the same movement, combat, vehicle, city, and AI foundations;
- remain understandable;
- support bots where practical;
- create a distinct match rhythm;
- avoid requiring a separate game architecture;
- preserve short downtime;
- reward direct and creative action.

## Mode Priority

## Prototype Foundation

1. Free-for-All Deathmatch

## Near-Term Extensions After Prototype Success

2. networked Free-for-All;
3. Team Deathmatch;
4. reduced Faction War;
5. scaled Faction War;
6. cooperative modes.

## Later Candidates

- Zombie Outbreak;
- Golden Car;
- Most Value Collected;
- King of the Road.

## Free-for-All Deathmatch

## Status

**Content Classification:** `In Review`; prototype FFA rules defer to [`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md).

## Purpose

Free-for-All validates the core game without requiring teams, economy, objectives, or networking.

## Prototype Rules

- one human player;
- zero to eleven bots;
- maximum twelve combatants;
- configurable timed rounds with duration `Needs Prototype Validation`;
- unlimited respawns;
- highest score at timer expiry determines victory, with no early score-limit ending;
- clinic respawns;
- pistol and two magazines after respawn;
- creative kill bonuses;
- simple results screen.

## Core Scoring Categories

- standard kill;
- roadkill;
- close-range shotgun kill;
- rocket kill;
- vehicle explosion kill;
- chain-reaction kill;
- environmental kill;
- police-assisted kill.

## Success Criteria

FFA succeeds when:

- action remains frequent;
- several tactics are viable;
- bots fight one another;
- creative kills occur regularly;
- respawns return players quickly;
- the map supports movement;
- the player wants another round.

## Networked Free-for-All

## Status

**Content Classification:** `Deferred Current Hypothesis`; networking is not prototype scope.

## Purpose

Networked FFA should validate human multiplayer using the already proven rule set.

## Additional Requirements

- lobby or session creation;
- player joining;
- player spawning;
- score synchronisation;
- damage synchronisation;
- vehicle ownership;
- bot coexistence;
- disconnect handling;
- match restart.

The first multiplayer test should not expand gameplay scope.

## Team Deathmatch

## Status

**Content Classification:** `Deferred Current Hypothesis`; not prototype scope.

## Purpose

Team Deathmatch is the lowest-cost team extension of FFA.

## Shared Systems

TDM should reuse:

- weapons;
- vehicles;
- bots;
- scoring;
- respawns;
- police;
- map;
- pickups;
- damage;
- UI.

## Additional Rules

- team assignment;
- team score;
- ally markers;
- team-aware spawn logic;
- friendly-fire setting;
- team bot behaviour.

## Friendly Fire

Friendly fire should be configurable:

- off;
- reduced;
- full.

The default remains open.

## Design Goal

TDM should be easy to enter and useful for small friend groups.

It should not require strategic territory systems.

## Faction War

## Status

**Content Classification:** `Deferred Current Hypothesis`; not prototype scope.

## Purpose

Faction War combines direct urban action with light strategic structure.

Players join fixed factions and fight over buildings and connected influence.

## Intended Match Size

Flexible formats may include:

- 4v4v4;
- larger three-faction formats;
- player counts above twelve if later performance allows.

No final player count is confirmed.

## Intended Duration

Duration is `Deferred` and has no confirmed numeric range.

Exact duration requires testing.

## Core Elements

- fixed factions;
- faction HQs;
- capturable buildings;
- influence radii;
- connected territory;
- isolated buildings;
- faction NPC support;
- income;
- upkeep;
- upgrades;
- transport bonuses;
- police pressure;
- mode-specific lives;
- faction elimination.

## Design Boundary

Faction War remains an action mode.

It must not become:

- an RTS;
- a management game;
- a base-building game;
- a spreadsheet economy;
- a direct unit-command game.

The detailed design is maintained in:

[`10_FACTION_WAR.md`](10_FACTION_WAR.md)

## Cooperative Play Against Bots

## Status

**Content Classification:** `Deferred Current Hypothesis`; not prototype scope.

## Purpose

Cooperative modes serve players who prefer collaboration.

## Possible Structures

- players versus combat-bot factions;
- survival against escalating pressure;
- objective defence;
- transport escort;
- district holding;
- special city events.

## Design Requirements

Coop should reuse:

- combat;
- vehicles;
- destruction;
- bots;
- police;
- map systems.

It should not require an entirely separate progression system.

## Zombie Outbreak

## Status

**Content Classification:** `Proposal`; Parking Lot content, not scope.

## Concept

Players face a spreading city-wide outbreak.

Possible identity:

- infected spread through civilians;
- players manage mobility and firepower;
- vehicles become rescue and crowd-control tools;
- city zones become unsafe;
- cooperative and competitive variants may exist.

## Open Questions

- infection rules;
- player infection;
- round structure;
- bot compatibility;
- distinction from existing zombie games;
- how much new AI is required.

Not a production commitment.

## Golden Car

## Status

**Content Classification:** `Proposal`; Parking Lot content, not scope.

## Concept

One valuable vehicle becomes the central moving objective.

Possible rules:

- players score while controlling it;
- the vehicle is visible to everyone;
- it may be damaged but not easily destroyed;
- ownership changes through theft or elimination;
- bots can pursue and use it.

## Design Goal

Create a focused vehicle-control mode with constant movement.

## Most Value Collected

## Status

**Content Classification:** `Proposal`; Parking Lot content, not scope.

## Concept

Players collect value through:

- money;
- loot;
- valuable vehicles;
- pickups;
- risky city events.

The winner holds or banks the highest value.

## Design Goal

Create tension between greed, survival, and extraction.

## King of the Road

## Status

**Content Classification:** `Proposal`; Parking Lot content, not scope.

## Concept

Players or teams control a moving or road-based objective.

Possible forms:

- hold a designated vehicle;
- remain on a marked route;
- control selected road segments;
- score through high-speed movement.

## Design Goal

Emphasise driving and route control.

## Bot Support

Bots should be available in all relevant modes where practical.

Bot roles may include:

- filling empty player slots;
- solo opponents;
- cooperative enemies;
- faction members;
- late-join replacements.

Bots should respect mode rules.

## Session Rules

Possible configurable session rules include:

- bot count;
- bot difficulty;
- round duration;
- optional score display or tracking thresholds that do not terminate FFA early;
- traffic density;
- pedestrian density;
- police cap;
- friendly fire;
- heavy weapon frequency;
- wanted-level cap;
- respawn rules;
- mode-specific lives.

Not all settings are required initially.

## Match End Conditions

Possible end conditions include:

- timer;
- score threshold;
- last faction standing;
- objective completion;
- survival;
- value banked;
- control duration.

Each mode should communicate its end condition clearly.

## Mode Reuse Rule

A new mode should be approved only if it:

- reuses validated systems;
- creates a distinct player decision;
- supports the product pillars;
- does not require disproportionate unique content;
- remains testable with bots where practical.

## Mode Failure Signs

A mode concept should be rejected or redesigned if:

- it plays like another mode with only renamed score;
- it requires a separate game architecture;
- bots cannot participate;
- it weakens vehicle and city interaction;
- it creates long inactivity;
- it depends on large player populations;
- it shifts the game into management rather than action.

## Authorisation Boundary

This document defines game-mode direction.

It does not authorise:

- mode implementation;
- networking;
- matchmaking;
- faction systems;
- production work.

Those actions require separate approval.
