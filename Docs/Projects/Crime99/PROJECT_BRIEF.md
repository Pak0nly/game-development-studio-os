# Project Brief

## Project Status

**Document Maturity:** Confirmed
**Prototype Disposition:** Core prototype direction
**Validation State:** Needs Prototype Validation
**Approval Status:** Confirmed by Human Developer
**Approval Source:** Crime99 Documentation Correction Assignment, 2026-07-14
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

`Crime99` is an internal working title, not a confirmed public or commercial name.

This is an original elevated-camera urban action game built around a solo-testable Free-for-All experience, vehicle and on-foot combat, a reactive city, short-form chaotic action, and the stylised `Neon over Dirt` visual identity.

## One-Sentence Vision

A fast, accessible urban action game in which players steal vehicles, fight rivals, exploit a reactive city, and create spectacular chaos in short solo or multiplayer matches.

## Product Identity

The game is primarily a chaotic action experience for small groups of friends that must also remain fully enjoyable when played alone against bots.

The city is not only a visual backdrop. Traffic, civilians, police, vehicles, hazards, and later faction systems create opportunities, pressure, and unpredictable situations.

Players remain the central actors. NPC systems support the action but must never turn the game into an RTS or a management simulation.

## Player Fantasy

The player should feel like an opportunistic urban outlaw who can:

* move quickly through the city;
* steal and abandon vehicles;
* switch freely between driving and fighting on foot;
* improvise with weapons, traffic, police, and environmental hazards;
* create memorable kills and chain reactions;
* turn dangerous situations against rival players;
* survive escalating chaos through skill and quick decisions.

## Target Experience

A successful session should feel:

* immediate;
* chaotic;
* readable;
* physical;
* replayable;
* humorous in a dark and exaggerated way;
* easy to enter but difficult to master.

The game should create stories naturally through player actions rather than relying only on scripted content.

## Target Audience

Primary audience:

* players who enjoy readable elevated-camera urban action;
* players who enjoy short competitive or cooperative sessions;
* small friend groups;
* players who value vehicle chaos, emergent situations, and arcade-style action.

Secondary audience:

* solo players who prefer bots over public matchmaking;
* players who enjoy reactive sandbox systems;
* players looking for an accessible premium multiplayer game.

## Tone

The tone is adult, criminal, exaggerated, and darkly humorous.

The game may include:

* violence;
* vehicle impacts;
* explosions;
* police chases;
* gang conflict;
* cynical humour;
* stylised blood and destruction.

The presentation should not be family-friendly, but it should remain stylised rather than realistic or disturbing.

## Design Pillars

### 1. Steal, Escalate, Escape

Players should be able to quickly obtain a vehicle or weapon, create trouble, attract attention, and escape or turn the situation to their advantage.

### 2. Vehicles Are Temporary Tools

Vehicles are powerful but disposable.

Players steal them, use them, damage them, weaponise them, and abandon them before moving on to the next opportunity.

### 3. Players Are the Main Threat

Other players or combat bots are the primary danger.

Police, civilians, traffic, and environmental systems complicate the conflict but must not replace player-versus-player interaction.

### 4. The City Fights Back

The world reacts to visible violence and disruption.

Traffic changes, civilians flee, police respond, and dangerous areas temporarily empty before returning to normal.

### 5. Creative Chaos Is Rewarded

Roadkills, explosions, chain reactions, environmental kills, and police-assisted kills should be encouraged through scoring and strong audiovisual feedback.

### 6. Neon over Dirt

The visual identity combines simplified, readable geometry with high-quality lighting, wet roads, smoke, grime, soot, industrial decay, and selective neon colour.

Neon enhances the city. It does not replace its dirt, age, or criminal atmosphere.

### 7. Solo-Testable by Default

Core modes must remain playable with bots.

Human players should improve the experience but must not be required for basic testing or enjoyment.

## Core Gameplay Loop

1. Spawn in the city with basic equipment.
2. Search for weapons, armour, health, or a useful vehicle.
3. Engage rival players or bots.
4. Create kills through shooting, ramming, explosions, or environmental opportunities.
5. Attract police attention and additional city disruption.
6. Escape, reposition, upgrade equipment, or steal another vehicle.
7. Accumulate score until the round ends.
8. Review results and immediately start another round.

## Primary Game Modes

### Free-for-All Deathmatch

The first prototype mode and the initial gameplay foundation.

Players and bots compete individually for score through direct and creative kills.

### Team Deathmatch

A later extension of the validated Free-for-All foundation.

### Faction War — Deferred Current Hypothesis

A possible larger strategic match mode for later evaluation.

Players join fixed factions, capture buildings, expand connected territory, generate income, support NPC forces, and attempt to eliminate rival factions.

Faction War is deferred, unconfirmed long-term content and is not part of the first prototype.

### Cooperative Play Against Bots

Players cooperate against AI-controlled opponents using systems developed for the competitive modes.

## Additional Mode Candidates

Deferred mode concepts include:

* Zombie Outbreak;
* Golden Car;
* Most Value Collected;
* King of the Road.

These are not current production commitments.

## Prototype Direction

The first prototype is a solo-testable Free-for-All match against zero to eleven combat bots.

It focuses on:

* responsive movement;
* independent aiming;
* pistol, shotgun, and rocket launcher combat;
* stealing and driving four vehicle classes;
* roadkills;
* vehicle damage, fire, and explosions;
* unrestricted chain reactions;
* combat bots;
* civilians and traffic;
* wanted level 1 police pressure;
* creative scoring;
* validation of `Fixed Camera` and `Rotatable Camera` variants;
* a small multi-block city map;
* the visual direction Neon over Dirt.

Network multiplayer, factions, economy, higher police escalation, story, and enterable buildings are explicitly excluded from the first prototype.

## Visual Direction

The final camera behaviour is `Needs Prototype Validation`. Two variants must be compared: `Fixed Camera` and `Rotatable Camera`. Both use a fixed elevation angle and fixed distance; the rotatable variant rotates freely around the player without panning or independent translation.

The art direction uses:

* simplified but intentional geometry;
* slightly exaggerated proportions;
* clear silhouettes;
* wet asphalt;
* neon reflections;
* smoke and steam;
* dirt and soot;
* old vehicles;
* strong headlights and police lights;
* readable action at speed.

Vehicles receive more visual and audio detail than most other prototype assets because they are central to the gameplay identity.

## Production Model

The project is intended to use the applicable Studio OS AI-production governance. This brief adds no architecture, tool, purchase, download, installation, or external-call authority.

Human involvement remains responsible for:

* creative direction;
* review;
* feedback;
* prioritisation;
* approval;
* final design decisions.

Any later asset-source or AI-assisted pipeline evaluation must preserve traceable code and asset provenance, project-specific acceptance evidence, and Human Developer review at defined acceptance points. Purchases, subscriptions, downloads, installations, and paid external calls require separate approval.

## Platform Direction

The final platform is not yet confirmed.

The first prototype target is Windows Standalone. Browser support is not a prototype requirement and may be evaluated later without influencing the initial prototype plan. The final commercial platform is `Deferred`.

## Business Model

Price and monetisation are `Deferred`. No price, purchase model, or monetisation structure is confirmed by this brief.

## Non-Goals

The project is not intended to be:

* a realistic crime simulator;
* a large open-world story game;
* a city-management game;
* an RTS;
* a vehicle simulator;
* a persistent MMO;
* dependent on large public player populations;
* dependent on extensive manual asset production;
* graphically realistic at the expense of clarity or production feasibility.

## Current Priorities

1. Validate the core movement and combat feel.
2. Validate driving, drifting, and vehicle switching.
3. Validate fair interaction between foot players and vehicles.
4. Validate explosions, destruction, and creative kills.
5. Validate a complete Free-for-All round against bots.
6. Compare the two camera variants and validate the visual identity.
7. Validate the asset-production approach.
8. Validate technical stability under the intended prototype load.
9. Only then evaluate real multiplayer development.
10. Expand toward Team Deathmatch and Faction War after the foundation succeeds.

## Current Decision Boundary

This document defines the intended project direction.

It does not authorise:

* Unity project creation;
* technical architecture;
* asset purchases;
* external tool integration;
* production implementation;
* network development.

Those actions require separate review and approval through the Studio Operating System.
