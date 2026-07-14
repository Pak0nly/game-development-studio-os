# Faction War

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Deferred
**Validation State:** Needs Validation
**Approval Status:** Not approved
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This document captures the current long-term design direction for Faction War.

**Content Classification:** `Deferred Current Hypothesis`. All behaviours and values below are unconfirmed proposals, not requirements. They must not influence the first prototype, architecture, or implementation unless separately reviewed and confirmed.

Faction War is important to the intended product identity and likely Early Access value, but it is outside the first prototype.

The design must be reviewed again after the core prototype validates:

- movement;
- combat;
- vehicles;
- bots;
- city systems;
- map scale;
- technical stability.

## High-Level Fantasy

Players join fixed rival factions and fight for control of an active city.

They:

- steal vehicles;
- fight directly;
- capture buildings;
- protect connected territory;
- fund upgrades;
- support faction NPCs;
- manipulate police pressure;
- eliminate rival factions.

The mode should feel like a larger urban war built from the same action foundation as FFA.

## Design Boundary

Faction War must remain an action game mode.

It must not become:

- an RTS;
- a traditional base builder;
- a city-management game;
- a direct unit-command game;
- a spreadsheet economy;
- a slow strategic simulation.

Players influence the larger conflict mainly through direct action.

## Match Structure

## Factions

Players join fixed factions at match start.

No faction switching during the match.

Possible team structures include:

- three factions;
- 4v4v4;
- larger asymmetric or symmetric formats.

Exact player count remains open.

## Duration

Target direction:

- duration remains `Deferred` and requires later validation; no numeric range is confirmed.

The mode should not become much longer without strong evidence.

## End Condition

The match ends immediately when only one faction remains able to continue.

No final NPC cleanup is required.

## Headquarters

## Role

Each faction has one central HQ.

The HQ provides:

- base presence;
- initial income;
- core respawn or return functions;
- strategic upgrade slots;
- faction identity.

## Protection

The HQ should be heavily protected early.

It should not necessarily be mechanically invulnerable forever.

Later attack should be possible.

## Core Functions

Core HQ functions cannot be fully disabled.

The HQ may have:

- upgrade levels;
- limited slots;
- meaningful choices;
- stronger early defences.

The HQ cannot install every possible function.

## Buildings

## Capture Model

The city uses existing capturable buildings.

Players do not freely place structures.

Each building has an equal influence radius.

Connected overlapping radii form a faction network.

## Building Types

Possible functions include:

- income;
- clinic;
- NPC support;
- armour;
- weapons;
- vehicle access;
- specialised utility.

Exact types remain open.

## Building Levels

Buildings may have linear upgrades.

City buildings may reach higher levels than HQ slot functions.

Upgrade duration is a deferred tuning question with no confirmed numeric range.

## Capture

A simple capture rule may use:

- attackers outnumber defenders in the radius;
- ties stop progress;
- multiple attackers accelerate capture with diminishing returns;
- defender presence regenerates control faster;
- no separate interaction button.

This remains Draft.

## Immediate Recapture

No automatic protection is required after capture.

If attackers fail to secure the area, immediate recapture should remain possible.

## Influence Network

## Connected Buildings

A building is connected when its influence radius links back to the HQ through friendly buildings.

Connected buildings may receive:

- full income;
- better NPC support;
- specialised functions;
- reliable logistics.

## Isolated Buildings

An isolated building remains controlled but receives reduced benefits.

Preferred direction:

- reduced income rather than zero;
- limited or delayed support;
- some specialised functions unavailable;
- physical support routes become dangerous.

## Choke Points

Asymmetric maps may contain valuable connection points.

These create:

- strategic pressure;
- ambush locations;
- meaningful road control;
- high-value local battles.

## Building Disablement

Buildings may be temporarily disabled through energy points or equivalent infrastructure.

## Intended Rules

- disabling should not take longer than capturing;
- disable duration is `Deferred` with no confirmed numeric value;
- building remains disabled while capture is active;
- defenders can reactivate relatively quickly.

## Destruction Boundary

Full building destruction is not part of the initial Faction War direction.

Disablement provides disruption without permanent map loss.

## NPC Forces

## Role

Faction NPCs make territory visible and active.

They may:

- defend buildings;
- patrol locally;
- attack adjacent positions;
- move between connected locations;
- support player pressure;
- expand slowly into weak neutral buildings.

## Player Priority

NPCs support players.

They should not win the map without player influence.

Decisive captures should usually require player involvement.

## NPC Strength

Preferred direction:

- more weak NPCs rather than a few very strong units;
- ordinary NPC defence should remain contestable by a skilled player; exact counts are deferred;
- maximum defence should be difficult but not mechanically unbeatable.

## NPC Equipment

NPC gear and stage should be visibly different.

Buildings and upgrades may improve:

- count;
- equipment;
- durability;
- response speed.

## No Direct Command

Players do not directly order NPC groups.

At most, the HQ may offer a broad strategic stance such as:

- closest expansion;
- defend;
- profit;
- pressure.

This remains optional.

## Expansion

## Autonomous Expansion

NPCs may expand slowly or moderately.

Expansion speed should scale with map size.

## Target Preference

Possible default behaviour:

- nearby weak neutral buildings;
- adjacent enemy pressure;
- reinforcement of threatened locations.

## Player Influence

Players accelerate success through:

- clearing defenders;
- holding the capture area;
- protecting support routes;
- funding upgrades;
- attacking enemy connections.

## Economy

Detailed rules are maintained in:

[`11_ECONOMY_AND_PROGRESSION.md`](11_ECONOMY_AND_PROGRESSION.md)

High-level direction:

- HQ base income;
- building income;
- automatic personal distribution;
- upkeep paid before distribution;
- active players receive fair shares;
- isolated buildings provide reduced income;
- upgrades funded proportionally by players.

## Upkeep

Upkeep may apply to:

- buildings;
- NPC forces;
- upgraded services.

If income becomes negative:

1. NPCs disappear first;
2. high-upkeep buildings shut down;
3. services remain unavailable until affordable.

The player should see clear warnings.

## Bonus Transports

Players may trigger optional income transports.

Longer preparation creates:

- larger reward;
- greater risk;
- longer exposure.

Enemy players may:

- intercept;
- destroy;
- capture;
- drive the transport to their HQ.

If destroyed, part of the value may drop.

Transports are bonuses, not mandatory base income.

## Personal Lives

## Status

**Content Classification:** `Deferred Current Hypothesis`; no life count or acquisition rule is confirmed.

## Current Direction

Faction War may use purchasable personal lives.

Possible rules:

- initial and additional life rules are `Deferred`;
- no life count or acquisition rule is confirmed;
- lives are the only return option;
- life purchases are personal;
- players cannot buy lives for teammates;
- prices increase by tier;
- maximum lives are limited.

## Open Test Case

Forgetting to buy a life is an intentional risk to test.

## Possible Teammate Sacrifice

A player may possibly spend one own life to revive a teammate.

Not confirmed.

## Elimination

A faction is eliminated when no player can return.

After elimination:

- faction buildings become neutral;
- faction NPCs stop belonging to the eliminated faction;
- players remain associated with the faction for statistics;
- the match ends immediately when only one faction remains.

## Spectating

Possible spectator rules:

- eliminated players may spectate;
- spectator vehicles are visible only to spectators;
- no collision or blocking;
- competitive sessions may disable spectators.

This remains deferred.

## Police Interaction

Faction War may include:

- personal wanted levels;
- police territory;
- bribery;
- snitching;
- faction-level attention;
- pressure against dominant factions.

The police remain a neutral city force.

## Victory and Momentum

The mode should create visible momentum without making recovery impossible.

Possible momentum sources:

- connected buildings;
- stronger NPC support;
- better income;
- map access;
- vehicle and equipment availability.

Soft balancing pressure may come from:

- higher police attention;
- exposed supply routes;
- increased upkeep;
- vulnerability at choke points.

Aggressive rubber-banding should be avoided.

## Information and UI

The minimap should show a unified readable layer.

Possible information:

- faction buildings;
- connected territory;
- isolated buildings;
- active capture;
- threatened routes;
- HQs;
- major events.

The game should avoid information overload.

Detailed statistics may be available at HQ.

## Tasks and Events

Faction War may provide:

- standard front tasks;
- defence alerts;
- attack opportunities;
- transport events;
- occasional high-reward objectives.

Tasks should emerge from the war state.

They should not become a quest-log-heavy system.

## Faction War Success Criteria

The mode succeeds when:

- direct action remains central;
- territory provides structure;
- NPCs make the city feel active;
- players understand connection and isolation;
- economy creates choices without administration;
- faction momentum is visible;
- losing factions retain comeback paths;
- matches end clearly;
- players still have time for spontaneous chaos.

## Faction War Failure Conditions

The direction requires redesign if:

- NPCs win without players;
- direct combat becomes secondary;
- economic management dominates;
- one disconnected loss ends a faction immediately;
- HQ attacks happen too early;
- dominant factions cannot be challenged;
- map information becomes unreadable;
- matches regularly exceed the intended duration;
- life rules reduce chaos too strongly.

## Deferred Decisions

- exact faction count;
- exact player count;
- exact map size;
- exact building count;
- exact influence radius;
- capture speed;
- HQ attack timing;
- building types;
- income values;
- upkeep values;
- NPC count;
- NPC equipment stages;
- lives and prices;
- spectator rules;
- police investment limits;
- victory scoring alternatives.

## Authorisation Boundary

This document captures deferred Faction War design.

It does not authorise:

- faction implementation;
- economy implementation;
- networking;
- NPC expansion;
- HQ or building production;
- production work.

Those actions require separate approval after prototype validation.
