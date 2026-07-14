# Police and Escalation

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Prototype scope with deferred extensions
**Validation State:** Needs Prototype Validation
**Approval Status:** Pending Human Developer review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This document defines:

- personal wanted pressure;
- prototype police behaviour;
- police as a limited city resource;
- long-term escalation;
- witnesses and alarms;
- bribery and snitching;
- police territory;
- faction-level attention;
- military escalation.

Only wanted level 1 and simplified crime detection are included in the first prototype.

## Core Principle

Police should complicate player conflict.

They should create:

- pressure;
- pursuit;
- location exposure;
- route disruption;
- tactical opportunities.

They should not become the main opponent for most of a match.

## Personal Wanted Pressure

## Purpose

Personal wanted pressure reacts to an individual player’s visible or detected crimes.

It is temporary and should be escapable.

## Prototype Scope

The first prototype includes only wanted level 1.

Wanted level 1 should provide:

- limited foot police;
- limited patrol-car pursuit;
- visible wanted status;
- manageable pressure;
- a clear escape opportunity.

## Simplified Crime Detection

The prototype does not require a full witness system.

Wanted pressure may begin when:

- a crime occurs near police;
- a police actor directly detects violence;
- a simple crime event is raised in police range.

This is intentionally simplified.

## Prototype Crime Examples

Potential wanted triggers include:

- attacking a civilian;
- stealing an occupied vehicle near police;
- attacking police;
- firing near police;
- causing a visible roadkill;
- causing an explosion near police.

Exact trigger values remain tunable.

## Police Resource Limit

## Global Cap

The city has a global maximum number of active police units.

This creates a finite response resource.

If several combatants create trouble:

- units are distributed;
- not every offender receives maximum pressure;
- players may indirectly bind police resources;
- police presence becomes tactically relevant.

## Design Intent

The global cap prevents:

- unlimited spawning;
- police replacing FFA opponents;
- performance escalation;
- permanent city-wide pursuit.

## Police Pursuit

## Foot Police

Foot officers may:

- move toward nearby offenders;
- use simple ranged attacks;
- follow through pedestrian-accessible areas;
- disengage after losing contact according to prototype rules.

## Patrol Cars

Police vehicles may:

- approach through road routes;
- pursue offenders;
- create road pressure;
- transport police presence;
- disengage or reroute when blocked.

## Pursuit Priority

Police may prioritise:

- directly observed offenders;
- recent severe crime;
- nearest reachable offender;
- active threat.

The prototype does not require advanced investigation.

## Losing Wanted Pressure

## Long-Term Direction

The intended long-term rule is:

- break line of sight;
- remain unseen for a period;
- use route changes and vehicle switching to shorten escape;
- wanted status targets the player, not the vehicle.

## Prototype Simplification

The first prototype may use a simpler escape rule.

Examples:

- no direct police contact for a set time;
- sufficient distance from pursuing units;
- line of sight broken for a set time.

Death clears personal wanted pressure completely.

## Police Damage and Threat

Police should be dangerous enough to matter.

They should not:

- kill most combatants;
- remain permanently attached;
- overwhelm normal weapon fights;
- make crime avoidance the dominant strategy.

Police lethality, accuracy, persistence, and quantity must remain tunable.

## Police and Bots

Bots should be subject to the same wanted rules as the human player.

Police should pursue bot offenders.

This supports:

- visible city chaos;
- finite police competition;
- bot-versus-police incidents;
- tactical third-party opportunities.

Bots should not be exempt from police pressure.

## Prototype UI

The prototype should show:

- wanted level;
- current police pressure;
- clear entry into wanted state;
- clear end of pursuit.

The exact presentation belongs in:

[`13_CAMERA_AND_UI.md`](13_CAMERA_AND_UI.md)

## Long-Term Wanted Levels

## Status

**Content Classification:** `Deferred Current Hypothesis`; only wanted level 1 is prototype scope.

## Witness and Alarm System

## Status

**Content Classification:** `Deferred Current Hypothesis`; not prototype scope.

## Long-Term Direction

Crime may be reported through:

- direct police observation;
- civilian witnesses;
- alarms;
- delayed reports.

General intended logic:

- directly witnessed by police: immediate wanted pressure;
- reported by witnesses or alarms: delayed response;
- unseen and unreported crime: no escalation.

## Design Goal

The system should reward:

- awareness;
- planning;
- route choice;
- quick escape;
- preventing obvious detection.

It should not require realistic forensic simulation.

## Vehicle Change

Changing vehicles should not automatically erase wanted status.

Wanted pressure belongs to the player.

However, changing vehicles while unseen may:

- reduce search efficiency;
- shorten escape time;
- create a tactical benefit.

This remains a long-term design assumption.

## Police Territory

## Status

**Content Classification:** `Deferred Current Hypothesis`; not prototype scope.

## Concept

Each map may contain a small non-capturable police area.

It functions as a neutral city-service location.

Players may spend money there to:

- bribe away wanted levels;
- reduce teammate wanted pressure;
- reveal or harass rivals;
- interact with police information systems.

## Design Boundary

Police territory is not a faction base.

It remains neutral and non-capturable.

## Snitching

## Status

**Content Classification:** `Deferred Current Hypothesis`; not prototype scope.

## Concept

Players may spend money to draw police attention toward rivals.

Possible tiers:

### Low Tier

- patrol follows or watches a target;
- creates annoyance and visibility;
- low direct danger.

### Higher Tier

- immediate wanted pressure;
- stronger response;
- higher cost;
- longer cooldown.

## Session Control

A session may cap the maximum purchasable pressure.

The cap may remain below military escalation.

## Balance Requirements

Snitching should:

- be expensive enough to prevent spam;
- have cooldowns;
- create visible counterplay;
- not replace direct combat;
- avoid permanent targeting.

## Bribery

## Status

**Content Classification:** `Deferred Current Hypothesis`; not prototype scope.

## Faction-Level Attention

## Status

**Content Classification:** `Deferred Current Hypothesis`; not prototype scope.

## Purpose

Faction attention provides long-term soft balancing pressure against dominant factions.

It may increase:

- police surveillance;
- patrol presence;
- response sensitivity;
- visibility of dominant territory.

## Design Intent

Faction attention should work like mild balancing pressure.

It should not become aggressive rubber-banding.

Dominant factions remain rewarded for success but face more city resistance.

## Military Escalation

## Status

**Content Classification:** `Deferred Current Hypothesis`; not prototype scope.

## Purpose

Military response represents the highest escalation.

Possible triggers include:

- maximum wanted level;
- use of extreme military assets;
- driving a tank;
- very severe sustained disruption.

## Design Role

Military should be rare, dangerous, and temporary.

It may:

- establish roadblocks;
- deploy heavy units;
- attack all active factions;
- create a temporary city-wide crisis.

The first prototype excludes military entirely.

## Police as Tactical Tool

Police can create indirect strategy.

Players may:

- lead police toward rivals;
- start conflict near enemy positions;
- bind limited police resources;
- exploit pursuit routes;
- use police fire as pressure;
- score police-assisted kills.

This should emerge through shared rules.

Police should not act as directly commanded units.

## Police-Assisted Kills

The scoring system may recognise a police-assisted kill.

The game should attribute such kills fairly.

Possible cases:

- player causes the victim to enter police fire;
- player damages a target shortly before police finish them;
- player redirects pursuit into a rival.

Exact attribution belongs in technical design.

## Police Success Criteria

The prototype police system succeeds when:

- wanted level 1 is understandable;
- police react to visible trouble;
- multiple offenders compete for limited response;
- police pursue bots and players;
- pressure is escapable;
- police create opportunities without dominating;
- police-assisted kills can occur naturally.

## Police Failure Conditions

The direction requires revision if:

- police cause most deaths;
- wanted status is unclear;
- pursuit never ends;
- police spawn without limit;
- bots are ignored;
- players avoid normal combat to avoid police;
- police vehicles create permanent congestion;
- city pressure feels arbitrary.

## Live-Tuning Variables

- police unit cap;
- foot-to-vehicle ratio;
- response delay;
- detection distance;
- crime severity;
- pursuit duration;
- disengage time;
- police accuracy;
- police damage;
- police vehicle speed;
- wanted cooldown;
- spawn distance;
- police-assisted kill window.

## Deferred Police Features

The first prototype excludes:

- witness simulation;
- delayed civilian reports;
- alarms;
- multiple wanted levels;
- bribery;
- police territory;
- snitching;
- roadblocks;
- specialised police units;
- faction attention;
- military;
- investigation;
- arrest systems;
- prison;
- persistent criminal records.

## Authorisation Boundary

This document defines police and escalation design direction.

It does not authorise:

- police implementation;
- AI architecture;
- package integration;
- economy implementation;
- military content;
- production work.

Those actions require separate approval.
