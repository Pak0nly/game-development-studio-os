# Core Gameplay

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Prototype scope with deferred extensions
**Validation State:** Needs Prototype Validation
**Approval Status:** Pending Human Developer review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This document defines the game’s core gameplay structure.

It separates:

* moment-to-moment gameplay;
* short match loops;
* medium-length mode loops;
* long-term product progression;
* shared systems that connect all modes.

The first prototype validates only a limited part of this document.

The authoritative first-prototype boundaries remain defined in:

[`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md)

## Core Gameplay Summary

The game is built around a repeated action rhythm:

> Move, steal, arm, attack, escalate, escape, re-engage.

Players move through a reactive city on foot or in stolen vehicles.

They collect weapons, armour, health, and temporary advantages, then use them to defeat rivals through:

* direct shooting;
* melee;
* roadkills;
* vehicle impacts;
* explosions;
* chain reactions;
* environmental opportunities;
* police pressure.

The city supports and complicates player conflict.

It does not replace it.

## Core Player Actions

The player’s primary verbs are:

* move;
* aim;
* shoot;
* reload;
* sprint;
* jump;
* dodge;
* punch;
* collect;
* heal;
* enter vehicle;
* exit vehicle;
* steal vehicle;
* drive;
* brake;
* handbrake;
* ram;
* escape;
* reposition;
* exploit hazards.

Later modes may add:

* capture;
* invest;
* transport;
* defend;
* support;
* revive;
* bribe;
* reveal;
* sabotage.

These later verbs must build on the action foundation rather than replace it.

## Moment-to-Moment Loop

## Overview

The moment-to-moment loop describes what the player repeatedly does over a period of seconds.

### Primary Sequence

1. Read nearby threats and opportunities.
2. Move toward a target, pickup, vehicle, or safer position.
3. Select between foot combat and vehicle use.
4. Attack, evade, steal, or reposition.
5. React to damage, police pressure, traffic, or explosions.
6. Abandon an unsafe position or vehicle.
7. Immediately seek the next opportunity.

The loop should remain active.

The player should rarely be left without:

* a target;
* a route;
* a useful pickup;
* a nearby vehicle;
* a danger to avoid;
* a tactical decision.

## Foot Gameplay

On foot, the player manages:

* movement direction;
* aim direction;
* spacing;
* weapon choice;
* ammunition;
* stamina;
* health;
* armour;
* vehicle threats;
* nearby cover and obstacles.

Foot gameplay should feel:

* responsive;
* vulnerable;
* flexible;
* precise;
* dangerous at short range;
* capable of countering vehicles through timing and equipment.

## Vehicle Gameplay

In a vehicle, the player manages:

* speed;
* steering;
* braking;
* handbrake;
* route choice;
* collision risk;
* vehicle health;
* fire state;
* nearby targets;
* escape timing.

Vehicle gameplay should feel:

* powerful;
* temporary;
* fast;
* risky;
* distinct by vehicle class;
* easy to enter;
* easy to abandon.

## Switching Between States

Switching between foot and vehicle gameplay is a central part of the game.

The player should frequently decide:

* whether to remain in a damaged vehicle;
* whether to steal a better vehicle;
* whether to leave before an explosion;
* whether to fight on foot;
* whether to use a vehicle as a weapon;
* whether to sacrifice mobility for a better firing position.

The transition should be quick enough to support the game’s pace.

## Core Combat Loop

## Overview

The combat loop is built around readable damage, positioning, temporary equipment, and environmental opportunity.

### Combat Sequence

1. Identify a rival.
2. Select a weapon or vehicle approach.
3. Attack while managing movement and exposure.
4. React to return fire, traffic, police, or third parties.
5. Secure the kill or disengage.
6. Collect dropped equipment where useful.
7. Reposition before the next threat arrives.

## Combat Priorities

Combat should prioritise:

* clear aim;
* clear hit confirmation;
* distinct weapon roles;
* readable danger;
* strong audiovisual feedback;
* medium time to kill;
* fast recovery into the next encounter.

Combat should avoid:

* detailed hit-zone complexity;
* realistic ballistic simulation;
* long cover standoffs;
* excessive weapon inventory;
* slow military pacing;
* long healing downtime.

## Weapon Roles

### Pistol

Role:

* basic reliable weapon;
* default respawn weapon;
* medium-range pressure;
* accessible ammunition;
* fallback firearm.

Expected feeling:

* accurate enough to trust;
* not dominant;
* useful in most situations;
* clearly weaker than specialised weapons.

### Shotgun

Role:

* close-range threat;
* strong foot-combat weapon;
* useful in tight streets and plazas;
* high-risk, high-reward option.

Expected feeling:

* immediately dangerous at close range;
* limited at distance;
* readable and loud;
* capable of a one-shot kill under the right conditions.

### Rocket Launcher

Role:

* anti-vehicle weapon;
* explosion initiator;
* group-pressure tool;
* source of chain reactions.

Expected feeling:

* powerful;
* scarce;
* visually obvious;
* dangerous to use carelessly;
* not a universal answer to every encounter.

### Fists

Role:

* permanent fallback;
* last-resort combat;
* low-ammunition recovery;
* close-range interruption.

Expected feeling:

* always available;
* weaker than firearms;
* still capable of finishing a vulnerable target.

## Resource Loop

## Overview

The prototype uses temporary match resources.

These resources create movement and tactical decisions without creating long-term grinding.

## Core Resources

### Health

* determines survival;
* does not regenerate automatically;
* restored through clinics and medkits;
* low health creates visual warning;
* low health does not reduce movement or accuracy.

### Armour

* separate protection layer;
* absorbs damage before health;
* temporary;
* found in the world;
* lost through combat.

### Stamina

* used for sprint and dodge;
* regenerates quickly;
* has no regeneration delay;
* prevents endless maximum mobility;
* should not create long downtime.

### Ammunition

* limits continuous firing;
* encourages movement toward pickups;
* heavy ammunition is less common;
* should create pressure without turning the game into scarcity management.

### Weapons

* found in the world;
* held in limited slots;
* dropped on death;
* immediately reusable by others;
* create local conflict around equipment.

### Vehicles

* temporary tactical resources;
* stolen from the world;
* damaged through use;
* abandoned when unsafe;
* replaced frequently.

## Resource Philosophy

Resources should:

* create decisions;
* pull players through the map;
* reward awareness;
* change tactical options;
* remain temporary.

Resources should not:

* require inventory management;
* create long economic downtime;
* permanently lock players out of combat;
* produce complex crafting;
* create large power gaps.

## Death and Respawn Loop

## Prototype Death Loop

In the first prototype:

1. the player dies;
2. carried weapons drop;
3. score and kill attribution are resolved;
4. the player waits only a short period;
5. the player respawns at a clinic point;
6. the player receives a pistol and two magazines;
7. the player immediately returns to play.

The prototype uses unlimited respawns.

## Death Design Intent

Death should:

* matter through score;
* redistribute equipment;
* create new local opportunities;
* break dominant positions;
* return the player quickly.

Death should not:

* create long inactivity;
* remove the player from the round;
* force complex recovery;
* create permanent disadvantage in FFA.

## Later Mode Variations

Later modes may use:

* limited lives;
* purchasable lives;
* teammate revival;
* elimination;
* team tickets;
* objective-based respawns.

These rules are mode-specific and must not be assumed from the FFA prototype.

## Free-for-All Match Loop

## Overview

Free-for-All is the first complete match loop.

It is designed to validate the action foundation.

## Match Start

At the beginning of the round:

* the player and bots spawn at clinic locations;
* each combatant receives a pistol and two magazines;
* weapons, armour, medkits, and vehicles are distributed across the map;
* traffic, civilians, and police systems begin;
* the round timer starts.

## Active Match Loop

During the round, the player repeatedly:

1. searches for targets and equipment;
2. fights on foot or in vehicles;
3. creates direct or creative kills;
4. attracts police attention;
5. changes vehicles or weapons;
6. dies and respawns;
7. accumulates score.

## Match End

An FFA match ends only when the timer expires. The combatant with the highest score then wins; reaching a score limit does not end the match early. Future non-FFA modes may define different termination rules.

The results screen shows:

* placement;
* score;
* kills;
* deaths;
* selected special kill categories.

The player should be able to restart quickly.

## Free-for-All Success Conditions

A successful FFA round should:

* create regular encounters;
* support several viable tactics;
* produce movement across the map;
* create unpredictable situations;
* avoid one dominant location;
* avoid one dominant kill type;
* remain readable with twelve combatants;
* encourage immediate replay.

## Creative Scoring Loop

## Overview

Creative scoring adds motivation beyond standard kills.

It rewards the player for using the game’s combined systems.

## Initial Categories

* standard kill;
* roadkill;
* close-range shotgun kill;
* rocket kill;
* vehicle explosion kill;
* chain-reaction kill;
* environmental kill;
* police-assisted kill.

## Scoring Intent

The scoring system should:

* recognise how a kill happened;
* reward risk and creativity;
* produce memorable feedback;
* encourage experimentation;
* support statistics and post-match stories.

It should not:

* make normal kills irrelevant;
* reward passive setup more than active conflict;
* create easily farmed exploits;
* become difficult to understand.

## Attribution Requirements

The game must be able to determine:

* who initiated damage;
* who caused an explosion;
* whether a vehicle or environment completed the kill;
* whether police contributed;
* whether a chain reaction was involved;
* which player receives score.

Exact attribution rules belong partly in technical design.

The gameplay requirement is that attribution feels fair and understandable.

## Police Pressure Loop

## Prototype Loop

The prototype uses only wanted level 1.

### Sequence

1. a visible or detected crime occurs;
2. police attention is assigned to the offender;
3. limited police units pursue;
4. the player escapes, survives, or continues fighting;
5. police pressure eventually ends according to prototype rules.

## Design Intent

Police should:

* add pressure;
* reveal careless players;
* complicate ongoing fights;
* create opportunities for rivals;
* consume limited city response capacity.

Police should not:

* become the main source of kills;
* pursue every combatant constantly;
* overwhelm the round;
* create unlimited units.

## Long-Term Expansion

Later systems may add:

* multiple wanted levels;
* delayed reports;
* witnesses;
* stronger vehicles;
* roadblocks;
* bribery;
* police territory;
* military escalation;
* faction-level attention.

These are not part of the first prototype.

## City Reaction Loop

## Overview

The city responds locally to danger.

### Reaction Sequence

1. violence, impact, or explosion occurs;
2. nearby civilians flee;
3. drivers attempt escape where possible;
4. traffic routes adjust;
5. police may respond;
6. the area becomes temporarily less populated;
7. population returns after danger ends.

## Design Intent

City reaction should:

* make the world feel alive;
* provide visual consequence;
* alter nearby routes;
* create tactical opportunities;
* recover quickly enough for short rounds.

It should not:

* simulate every citizen individually;
* permanently empty the map;
* create unrecoverable traffic jams;
* consume more attention than the combat.

## Bot-Supported Loop

## Overview

Bots enable complete solo testing and solo play.

Bots participate in the same match loop as the player.

They should:

* seek targets;
* fight each other;
* collect equipment;
* use vehicles;
* create roadkills;
* leave burning vehicles;
* use rockets against vehicles;
* respawn;
* accumulate score.

## Bot Design Intent

Bots should create:

* pressure;
* motion;
* conflict;
* mistakes;
* unexpected interactions.

They do not need:

* human-level strategy;
* perfect aim;
* deep personality;
* complex planning.

Bots must not:

* permanently prioritise the human;
* use hidden advantages;
* ignore shared game rules;
* require an entirely separate version of the game.

## Map Flow Loop

## Overview

The map should repeatedly move players between different tactical spaces.

## Intended Flow

### Main Road

Supports:

* speed;
* chases;
* roadkills;
* garbage truck use;
* police pursuit;
* large vehicle chains.

### Central Junction

Supports:

* repeated encounters;
* multi-directional attacks;
* traffic interaction;
* rockets;
* police involvement.

### Side Streets

Support:

* compact vehicles;
* close-range combat;
* theft;
* escape;
* reduced vehicle dominance.

### Industrial Area

Supports:

* open vehicle combat;
* heavy vehicles;
* parked-car clusters;
* explosions;
* smoke;
* long sight lines.

### Commercial Area

Supports:

* pedestrians;
* neon identity;
* traffic;
* police visibility;
* mixed combat.

### Park or Plaza

Supports:

* foot combat;
* open sight lines;
* lower traffic;
* pistol and shotgun encounters.

## Flow Requirements

The map should:

* provide several routes;
* avoid a single dominant location;
* create reasons to move;
* maintain action frequency;
* support both foot and vehicle play;
* keep respawn points distributed;
* remain readable from the selected camera variant.

## Match Pacing

## Desired Rhythm

A short match should alternate between:

* searching;
* positioning;
* engagement;
* escalation;
* escape;
* recovery;
* re-engagement.

The rhythm should not become:

* constant maximum intensity;
* long inactivity;
* repeated instant deaths;
* permanent police pursuit;
* endless vehicle dominance.

## Pacing Controls

Pacing may be influenced through:

* map size;
* bot count;
* item density;
* vehicle density;
* traffic density;
* police cap;
* respawn delay;
* round duration;
* weapon ammunition;
* score values.

These values should remain adjustable during testing.

## Team Deathmatch Loop

## Status

**Content Classification:** `Deferred Current Hypothesis`; not prototype scope.

## Intended Structure

Team Deathmatch should reuse:

* movement;
* weapons;
* vehicles;
* damage;
* bots;
* respawns;
* scoring;
* police;
* map systems.

The main additions are:

* team identity;
* team scoring;
* friendly-fire rules;
* team spawn logic;
* ally readability.

## Design Intent

Team Deathmatch should be a low-cost extension.

It should not require a separate gameplay foundation.

## Faction War Match Loop

## Status

**Content Classification:** `Deferred Current Hypothesis`; not prototype scope.

## High-Level Loop

1. players join fixed factions;
2. factions begin from protected HQs;
3. players collect equipment and money;
4. players capture or defend buildings;
5. connected territory generates stronger benefits;
6. buildings support NPCs, income, or specialised functions;
7. players fund upgrades;
8. NPCs create local pressure and visible front lines;
9. police pressure may increase against dominant factions;
10. factions lose members through mode-specific life rules;
11. the last surviving faction wins.

## Player Role

Players remain the decisive actors.

They should:

* attack;
* defend;
* capture;
* escort;
* intercept;
* sabotage;
* fund;
* manipulate police pressure;
* support local NPC forces.

They should not:

* directly command many units;
* manage detailed production queues;
* place buildings freely;
* perform continuous economic administration.

## Faction War Rhythm

The intended rhythm is:

* short local conflicts;
* temporary travel;
* building pressure;
* equipment improvement;
* counterattacks;
* faction-wide momentum shifts;
* endgame elimination pressure.

The mode should preserve enough freedom for:

* chases;
* spontaneous violence;
* police manipulation;
* vehicle chaos;
* side opportunities.

## Cooperative Loop

## Status

**Content Classification:** `Deferred Current Hypothesis`; not prototype scope.

## Intended Structure

Cooperative modes should reuse the existing action foundation.

Players may cooperate to:

* fight bot factions;
* survive escalating waves;
* complete transport objectives;
* hold locations;
* defeat special threats;
* respond to city-wide events.

The cooperative loop should preserve:

* vehicle switching;
* creative kills;
* city reactions;
* bot use;
* short downtime.

## Long-Term Progression Loop

## Match-Based Progression

Within a match, players may gain:

* weapons;
* armour;
* money;
* vehicles;
* influence;
* access;
* lives;
* temporary tactical options.

This progression resets fully or mostly between matches, depending on mode.

## Between-Match Progression

Possible later progression includes:

* cosmetics;
* statistics;
* achievements;
* titles;
* visual unlocks;
* player profile progression;
* non-power sidegrades.

Permanent competitive power should be avoided.

## Commercial Progression Boundary

The game should not rely on:

* pay-to-win;
* paid power;
* excessive grind;
* mandatory daily systems;
* monetisation-driven imbalance.

## Gameplay Readability

All core gameplay must remain understandable from the elevated camera.

The player should quickly identify:

* own character;
* enemies;
* active weapon;
* health state;
* armour state;
* burning vehicles;
* dangerous explosions;
* police presence;
* useful pickups;
* current objective or score.

Readability must take priority over:

* visual realism;
* excessive effects;
* small animation detail;
* dense clutter.

## Difficulty and Mastery

## Entry-Level Play

A new player should be able to:

* move;
* aim;
* shoot;
* steal a vehicle;
* drive;
* score;
* respawn.

## Intermediate Mastery

An improving player learns:

* weapon ranges;
* vehicle handling;
* handbrake turns;
* route knowledge;
* pickup locations;
* police avoidance;
* safe vehicle exit timing.

## Advanced Mastery

An experienced player learns:

* predictive aiming;
* vehicle interception;
* chain-reaction setup;
* environmental kills;
* police manipulation;
* risk management;
* opponent reading;
* mode-specific strategy.

## Core Gameplay Success Conditions

The core gameplay succeeds if:

* movement feels responsive;
* aiming feels natural;
* driving is enjoyable;
* switching between foot and vehicle play is frequent;
* vehicle hits feel powerful and fair;
* weapons have distinct roles;
* bots sustain active matches;
* creative kills occur naturally;
* the city reacts without dominating;
* matches generate memorable situations;
* players want to replay immediately.

## Core Gameplay Failure Conditions

The core gameplay fails if:

* driving is only tolerable rather than fun;
* foot play becomes irrelevant;
* vehicles feel weak or disposable without value;
* the city creates more frustration than opportunity;
* bots cannot sustain action;
* one tactic dominates scoring;
* police become the main opponent;
* death creates excessive downtime;
* visual effects hide important information;
* the gameplay feels dependent on nostalgia rather than its own quality.

## Prototype Validation Mapping

The first prototype validates:

* moment-to-moment movement;
* foot combat;
* vehicle control;
* switching between states;
* three weapon roles;
* health, armour, stamina, and healing;
* death and unlimited respawn;
* FFA scoring;
* creative kill categories;
* wanted level 1;
* basic city reaction;
* combat bots;
* map flow;
* short-match pacing.

The first prototype does not validate:

* Team Deathmatch;
* Faction War;
* faction economy;
* limited lives;
* long-term progression;
* network multiplayer;
* cooperative mode structure;
* commercial retention.

## Authorisation Boundary

This document defines gameplay direction.

It does not authorise:

* implementation;
* technical architecture;
* Unity project creation;
* asset purchases;
* package selection;
* multiplayer development;
* production work.

Those actions require separate approval.
