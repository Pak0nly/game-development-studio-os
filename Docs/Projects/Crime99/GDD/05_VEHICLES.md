# Vehicles

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Prototype scope with deferred extensions
**Validation State:** Needs Prototype Validation
**Approval Status:** Pending Human Developer review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This document defines the vehicle-related gameplay direction.

It covers:

* vehicle roles;
* vehicle classes;
* driving behaviour;
* vehicle theft;
* entry and exit;
* player and bot use;
* collisions;
* pedestrian impacts;
* vehicle damage;
* burning;
* explosions;
* chain reactions;
* vehicle presentation;
* prototype boundaries;
* long-term expansion.

The authoritative first-prototype scope remains defined in:

[`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md)

## Vehicle Design Goals

Vehicles should feel:

* powerful;
* readable;
* disposable;
* distinct;
* immediately useful;
* easy to steal;
* satisfying to drive;
* dangerous when damaged;
* integrated into combat;
* suitable for both players and bots.

Vehicles are not only transportation.

They are also:

* temporary protection;
* weapons;
* escape tools;
* hazards;
* sources of explosions;
* tactical resources;
* moving obstacles;
* opportunities for theft.

The intended rhythm is:

> Steal, use, damage, weaponise, abandon, replace.

## Vehicle Role in the Game

Vehicles are one of the game’s central identity systems.

They connect:

* movement;
* combat;
* map flow;
* police escalation;
* civilian traffic;
* creative scoring;
* destruction;
* bot behaviour.

A vehicle should frequently change the immediate situation.

Examples include:

* escaping a gunfight;
* crossing the map quickly;
* running down a rival;
* blocking a route;
* starting a chain reaction;
* drawing police attention;
* abandoning a burning vehicle near enemies;
* stealing an opponent’s vehicle;
* switching to a heavier vehicle for a direct attack.

## Vehicle Power

Vehicles should feel strong.

They may provide:

* speed;
* mass;
* temporary protection;
* lethal impact;
* route control;
* explosive potential.

This strength must be balanced by:

* limited durability;
* anti-vehicle weapons;
* steering limitations;
* braking distance;
* collision risk;
* fire;
* predictable destruction;
* vulnerability during entry and exit.

## Temporary Ownership

Vehicles are not permanently owned during a match.

Players should expect to:

* take vehicles from the environment;
* steal occupied vehicles;
* lose vehicles;
* abandon damaged vehicles;
* replace vehicles frequently.

The prototype does not include:

* personal garages;
* permanent vehicle ownership;
* vehicle upgrades;
* repair stations;
* vehicle insurance;
* persistent damage.

## Prototype Vehicle Classes

The first prototype includes four vehicle classes.

Each class should be recognisable through:

* silhouette;
* size;
* weight;
* acceleration;
* steering;
* durability;
* top speed;
* impact behaviour;
* engine sound.

Exact values remain live-tuning variables.

## 1. Compact Car

## Role

The compact car is the most agile prototype vehicle.

It supports:

* quick direction changes;
* narrow streets;
* escape;
* handbrake turns;
* short-distance pursuit;
* avoiding heavy traffic.

## Intended Characteristics

* fast initial response;
* strong steering;
* low mass;
* low durability;
* moderate or lower top speed;
* easy to control;
* vulnerable to heavy vehicles;
* less effective in direct collisions.

## Strengths

* agility;
* recovery after mistakes;
* tight-space navigation;
* quick theft and escape;
* useful for inexperienced drivers.

## Weaknesses

* fragile;
* weak pushing power;
* vulnerable to rockets;
* easily displaced by larger vehicles;
* less effective on long straight roads.

## Intended Feeling

The compact car should feel:

* light;
* responsive;
* nervous;
* disposable;
* fun in tight spaces.

## 2. Saloon

## Role

The saloon is the balanced general-purpose vehicle.

It supports:

* regular city travel;
* pursuit;
* roadkills;
* mixed combat;
* controlled drifting;
* moderate durability.

## Intended Characteristics

* balanced acceleration;
* balanced steering;
* moderate durability;
* moderate mass;
* useful top speed;
* predictable braking;
* versatile handling.

## Strengths

* reliable;
* easy to understand;
* useful in most map areas;
* capable of both escape and attack;
* baseline for vehicle comparison.

## Weaknesses

* not the fastest;
* not the toughest;
* not the most agile;
* lacks an extreme specialised advantage.

## Intended Feeling

The saloon should feel:

* stable;
* familiar;
* dependable;
* versatile.

## 3. Van

## Role

The van is the heavier general-purpose vehicle.

The van is the confirmed fourth vehicle class for the first prototype.

A pickup may be considered only as a deferred later vehicle option and is not part of the first prototype.

It supports:

* stronger collisions;
* improved durability;
* longer straight-line travel;
* pushing lighter vehicles;
* surviving moderate combat.

## Intended Characteristics

* slower steering;
* slower acceleration than the saloon;
* higher durability;
* increased mass;
* stronger pushing power;
* good straight-line speed;
* wider turning behaviour.

## Strengths

* robust;
* useful in direct collisions;
* stable at speed;
* stronger against small vehicles;
* more forgiving under weapon damage.

## Weaknesses

* sluggish in narrow streets;
* slower direction changes;
* easier target for rockets;
* greater braking distance;
* less effective in parks or tight spaces.

## Intended Feeling

The van should feel:

* heavy;
* reliable;
* forceful;
* less agile;
* safer until heavily damaged.

## 4. Refuse Truck

## Role

The refuse truck is the heaviest prototype vehicle.

It acts as a pre-tank vehicle without becoming a military vehicle.

It supports:

* direct road control;
* heavy ramming;
* pushing normal vehicles;
* breaking through congestion;
* spectacular impacts;
* large visual presence.

## Intended Characteristics

* slow acceleration;
* low agility;
* very high mass;
* high durability;
* strong pushing force;
* low or moderate manoeuvrability;
* strong collision damage;
* long braking distance.

The refuse truck may have a strong final top speed on long roads, but it should take time to reach it.

## Strengths

* powerful against light vehicles;
* strong roadkill potential;
* difficult to stop through ordinary collisions;
* effective on the main road;
* creates visible threat.

## Weaknesses

* slow acceleration;
* large turning radius;
* poor narrow-street performance;
* highly visible;
* vulnerable to rockets;
* difficult to escape with once heavily damaged.

## Intended Feeling

The refuse truck should feel:

* massive;
* threatening;
* slow to react;
* satisfying in direct collisions;
* dangerous but not universally superior.

## Vehicle Class Balance

The vehicle classes should create meaningful choices.

The design should avoid a simple ranking where one vehicle is always better.

## Intended Comparison

| Vehicle       |       Agility |  Acceleration |      Top Speed | Durability |      Mass | Main Strength                 |
| ------------- | ------------: | ------------: | -------------: | ---------: | --------: | ----------------------------- |
| Compact Car   |          High |          High |         Medium |        Low |       Low | Escape and tight routes       |
| Saloon        |        Medium |        Medium | Medium to High |     Medium |    Medium | General-purpose use           |
| Van | Low to Medium | Low to Medium |           High |       High |      High | Durability and pushing        |
| Refuse Truck  |           Low |           Low |         Medium |  Very High | Very High | Heavy impact and road control |

This table describes intended relationships, not final values.

## Balance Requirement

Each vehicle should have at least one situation where it is clearly useful.

No vehicle should dominate:

* every map area;
* every speed range;
* every combat situation;
* every skill level.

## Driving Model

## General Direction

Driving should be arcade-oriented rather than realistic.

The handling model should prioritise:

* control;
* readability;
* repeatability;
* strong class differences;
* predictable collisions;
* fun at moderate and high speed.

The game is not a vehicle simulator.

## Driving Inputs

Prototype driving includes:

* acceleration;
* braking;
* steering;
* reverse;
* handbrake;
* exit vehicle.

Reverse speed should be clearly lower than forward speed.

## Acceleration

Acceleration should communicate vehicle mass.

* compact cars respond quickly;
* saloons feel balanced;
* vans require more commitment;
* refuse trucks build speed slowly.

Acceleration should remain fast enough to preserve the game’s pace.

## Steering

Steering should:

* remain predictable;
* scale with speed where useful;
* avoid sudden uncontrolled rotation;
* preserve class differences;
* support keyboard; controller support is optional only if negligible in effort.

Exact steering curves require testing.

## Braking

Braking should:

* remain readable;
* reflect vehicle mass;
* support tactical stopping;
* create risk at high speed;
* avoid excessively realistic stopping distances.

The player should be able to learn how each vehicle behaves.

## Reverse

Reverse is intentionally slower.

This prevents:

* effortless escape from poor positioning;
* reverse driving becoming equivalent to forward driving;
* heavy vehicles correcting mistakes too easily.

Reverse should still be useful for:

* leaving a collision;
* escaping a blocked route;
* repositioning;
* preparing a turn.

## Handbrake and Drifting

## Purpose

The handbrake supports:

* sharp turns;
* route correction;
* controlled drifting;
* fast direction changes;
* expressive driving.

## Design Direction

Drifting should be:

* learnable;
* repeatable;
* useful;
* visually clear;
* different between vehicle classes.

The system should not require realistic drift simulation.

## Vehicle Differences

### Compact Car

* quick rotation;
* easy correction;
* short drift;
* strong recovery.

### Saloon

* balanced drift;
* predictable handbrake turns;
* baseline handling.

### Van

* wider drift;
* slower recovery;
* greater momentum.

### Refuse Truck

* limited drift;
* large turning commitment;
* heavy slide if speed is high.

## Failure Signs

Handbrake behaviour is failing if:

* all vehicles rotate identically;
* drifting is random;
* handbrake is never useful;
* handbrake causes constant spins;
* if controller support is included, either input path is materially disadvantaged;
* the player cannot repeat a successful turn.

## Camera Interaction

Vehicle handling and camera behaviour are directly connected.

The prototype compares `Fixed Camera` and `Rotatable Camera` while driving.

Both variants use a fixed elevation and fixed distance. Neither variant uses zoom, panning, independent camera translation, automatic distance changes, or speed-dependent distance changes. Only the `Rotatable Camera` may rotate freely around the player.

Fast vehicles must remain readable and controllable with both variants. The final choice between them remains `Needs Prototype Validation`.

## Main Road Alignment

The prototype’s main road runs primarily from top to bottom.

This supports testing:

* better forward visibility;
* high-speed testing;
* fewer horizontal screen-edge limitations;
* clearer anticipation of traffic.

Both camera variants must be compared on the same map. Road alignment must not bias the test so strongly toward either variant that the comparison becomes invalid.

## Vehicle Entry

## Empty Vehicle Entry

The player should be able to enter an empty vehicle quickly.

The prototype may use a simplified entry sequence.

Physical doors are not required.

## Design Goal

Entry should be:

* readable;
* fast;
* interruptible where necessary;
* compatible with the action pace.

A long realistic animation is not desirable.

## Entry Conditions

The player must be:

* close enough;
* near a valid entry point;
* not performing an incompatible action;
* interacting with an available vehicle.

Exact entry-point logic belongs in technical architecture.

## Vehicle Exit

## Stationary and Low-Speed Exit

The player should exit quickly and safely.

## High-Speed Exit

The player may exit at any speed.

Exiting at speed causes damage.

The damage may depend on:

* vehicle speed;
* vehicle class;
* collision after exit;
* nearby obstacles.

## Design Intent

High-speed exit creates tactical choice.

The player may choose between:

* staying in a dangerous vehicle;
* accepting exit damage;
* waiting for lower speed;
* steering toward a safer exit area.

## Failure Signs

Vehicle exit is failing if:

* exiting is always safe;
* high-speed exit always kills;
* exit animations are too slow;
* the player is repeatedly placed inside obstacles;
* exiting creates unpredictable physics reactions.

## Vehicle Theft

Vehicle theft is a core player action.

## Empty Vehicles

Empty vehicles can be entered normally.

## Occupied Civilian Vehicles

The player may remove the driver from a stationary or slow-moving vehicle.

The prototype can simplify this interaction.

## Prototype Rules

Theft should be possible when:

* the target vehicle is stationary;
* or below a defined speed threshold.

Above the threshold:

* the action fails;
* or is cancelled.

The exact threshold requires testing.

## Theft Duration

Removing an occupied driver should take slightly longer than entering an empty vehicle.

It should still remain compatible with fast gameplay.

## Civilian Reaction

The driver may:

* flee;
* briefly resist;
* attempt to escape;
* react according to role.

The prototype only requires simple clear behaviour.

## Player Vehicle Theft

Other players may be pulled from a slow or stationary vehicle.

This creates strong risk around:

* congestion;
* failed turns;
* low-speed fights;
* damaged vehicles.

## Bot Vehicle Theft

Bots may:

* enter empty vehicles;
* steal available vehicles;
* rarely pull drivers from slow vehicles.

The behaviour should remain rare enough to avoid constant forced removal.

## Vehicle Owner Reaction

For the first prototype, the former owner exits and flees and does not chase or attack the combatant. Owner retaliation or pursuit is a deferred optional concept outside the prototype.

This is optional for the prototype and should be removed if it adds excessive complexity.

## Physical Doors

## Prototype Status

Physical doors are excluded from the required first prototype.

The prototype does not require:

* door opening;
* door closing;
* missing doors;
* door collisions;
* door protection;
* doors being torn off.

## Long-Term Possibility

Later versions may include:

* visible door opening;
* driving with an open door;
* automatic closing while moving;
* doors being torn off;
* faster entry through missing doors;
* reduced occupant protection.

This feature should only be added if it provides enough visible and gameplay value.

## Occupant Protection

## Prototype Direction

Vehicles provide temporary practical protection through:

* mobility;
* vehicle body;
* reduced exposure.

Detailed directional occupant protection is not required.

## Collision Damage

Normal vehicle collisions damage the vehicle, not the occupants directly.

This keeps driving readable and prevents minor traffic impacts from creating excessive player damage.

## Exceptions

Occupants may still be harmed through:

* vehicle explosion;
* burning;
* rockets;
* leaving at speed;
* direct combat rules where later required.

## Vehicle Versus Pedestrian Interaction

## Vehicle-Impact Rule Reference

Lethal and non-lethal contacts follow the canonical design-level rule in [`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md#3-health-armour-and-healing). Feedback must be:

* visually clear;
* directionally understandable;
* supported by strong sound;
* attributable to the driver.

## Non-Lethal Contact Feedback

Possible results for contacts that are not automatically lethal include:

* health damage;
* knockback;
* short loss of control;
* no lethal outcome.

Exact thresholds and behaviour are `Needs Prototype Validation`.

## Fairness Requirements

A lethal vehicle hit should feel fair when:

* the vehicle approach was visible;
* the player had a possible reaction;
* collision direction was clear;
* the impact was not caused by unstable physics;
* respawn placement did not force the situation.

## Foot Counterplay

Players on foot can respond through:

* sprinting;
* dodge rolling;
* route choice;
* obstacles;
* shotgun pressure at close entry points;
* rockets;
* explosions;
* burning vehicles;
* baiting collisions.

## Vehicle Versus Vehicle Interaction

## General Direction

Vehicle collisions should communicate:

* mass;
* speed;
* class difference;
* direction.

## Light Versus Heavy

Heavier vehicles should:

* push lighter vehicles;
* retain more momentum;
* receive less relative displacement;
* cause stronger damage.

Lighter vehicles should:

* avoid direct collisions;
* recover more quickly;
* exploit tighter routes;
* use agility instead of mass.

## Refuse Truck Interaction

The refuse truck should be able to:

* push normal cars;
* disrupt traffic;
* damage lighter vehicles strongly;
* break through weaker congestion.

It should not:

* launch vehicles unrealistically in normal contact;
* ignore all collisions;
* become immune to rockets or explosions;
* turn quickly despite its mass.

## Vehicle Damage

## General Damage Philosophy

Vehicle damage should be:

* simple;
* readable;
* staged;
* shared across vehicle classes;
* easy to tune;
* strongly communicated.

The first prototype does not require realistic deformation.

## Required States

### Intact

The vehicle:

* drives normally;
* has no major visible damage;
* produces normal engine and exhaust feedback.

### Damaged

The vehicle shows:

* visible wear;
* light smoke or effects;
* reduced confidence for the player;
* optional minor handling changes.

### Heavily Damaged

The vehicle shows:

* strong smoke;
* clear visual danger;
* worsening condition;
* possible stronger handling impact;
* high risk of entering the burning state.

### Burning

The vehicle:

* receives continuous unavoidable damage;
* clearly communicates imminent destruction;
* creates tactical danger;
* allows a short normal escape window;
* will explode if not destroyed earlier.

### Exploded

The vehicle:

* can no longer be used;
* causes explosion damage;
* may trigger nearby vehicles;
* becomes a wreck or is later removed according to prototype rules.

## Damage Sources

Vehicles may be damaged by:

* collisions;
* pistol fire;
* shotgun fire;
* rockets;
* explosions;
* burning;
* environmental hazards;
* police attacks;
* other vehicles.

Damage values should reflect weapon role.

## Weapon Relationships

### Pistol

* low vehicle damage;
* useful only over time;
* not a primary anti-vehicle weapon.

### Shotgun

* moderate close-range vehicle damage;
* useful against already damaged vehicles;
* not a reliable heavy-vehicle solution.

### Rocket Launcher

* primary anti-vehicle weapon;
* may skip normal damage stages;
* can cause immediate explosion;
* initiates chain reactions.

## Burning Vehicles

## Role

Burning vehicles are both warnings and tactical tools.

They should create:

* urgency;
* area denial;
* escape decisions;
* explosion opportunities;
* chain reactions.

## Burning Rules

Once burning:

* damage continues automatically;
* the vehicle will eventually explode;
* the state cannot be repaired in the prototype;
* the player has a short escape opportunity;
* nearby actors should recognise the danger.

## Tactical Use

Players may:

* abandon a burning vehicle near opponents;
* steer it toward parked cars;
* block a route;
* trigger it with additional damage;
* use it as temporary area pressure.

## Bot Behaviour

Bots should leave burning vehicles.

Bots may still fail occasionally if:

* trapped;
* reacting too slowly;
* under attack.

Believable mistakes are acceptable.

## Vehicle Explosions

## Design Goal

Vehicle explosions should feel:

* powerful;
* bass-heavy;
* readable;
* dangerous;
* satisfying;
* capable of creating chains.

## Gameplay Effects

An explosion may:

* damage players;
* kill players;
* damage vehicles;
* ignite or destroy nearby vehicles;
* knock over city objects;
* create smoke and temporary visual obstruction;
* award creative kill score.

## Gameplay Radius and Visual Radius

The visible effect may be larger than the actual lethal gameplay radius.

This allows spectacle without unfair damage.

The relationship must remain understandable.

## Score Attribution

The system should identify:

* the player who caused the vehicle damage;
* the player who initiated the explosion;
* secondary chain reactions;
* victims;
* kill category;
* police or environmental contribution.

Exact attribution logic belongs in technical design.

## Chain Reactions

## Core Requirement

Chain reactions must occur naturally.

There should be no fixed artificial limit on the number of vehicles that can participate.

## Prototype Test

Ten closely parked vehicles should be able to explode in one chain reaction.

## Chain Conditions

A chain may be accelerated by:

* explosion damage;
* burning;
* nearby rockets;
* already damaged vehicles;
* vehicle spacing.

## Design Goals

Chain reactions should be:

* spectacular;
* understandable;
* attributable;
* tactically useful;
* technically stable.

## Performance and Clarity

The later architecture must evaluate how to keep debris, smoke, audio, and physical aftermath readable and performant. This design document does not select pooling, lifetime, physics, or rendering implementations.

It should not artificially prevent the gameplay chain itself.

## Failure Signs

Chain reactions are failing if:

* vehicles do not reliably affect each other;
* the player cannot understand the source;
* score attribution breaks;
* physics becomes unstable;
* effects hide all gameplay;
* frame rate collapses repeatedly.

## Vehicle Spawning and Availability

## Dynamic Traffic

Civilian traffic supplies moving vehicles.

## Parked Vehicles

Parked vehicles provide predictable theft opportunities.

## Prototype Distribution

Expected availability:

* compact cars: common;
* saloons: common;
* vans: moderate;
* refuse trucks: rare and associated with industrial areas.

## Respawning

Dynamic traffic replenishes through the traffic system.

Parked vehicles may respawn after:

* a longer delay;
* being outside direct player view;
* the previous vehicle being removed.

Exact rules remain open.

## Design Goal

Vehicles should be available often enough to support frequent switching.

They should not be so dense that:

* roads are permanently blocked;
* every fight becomes an explosion cluster;
* foot gameplay disappears.

## Vehicle AI

Bots should use the same vehicle systems as players where practical.

## Required Bot Capabilities

Bots should be able to:

* recognise an available vehicle;
* enter it;
* drive toward a target;
* avoid obvious obstacles;
* ram opponents;
* leave burning vehicles;
* abandon unusable vehicles;
* use rockets against enemy vehicles;
* steal vehicles when useful.

## Driving Competence

Bots should appear relatively competent.

They do not need:

* perfect racing lines;
* advanced drifting;
* human-level tactical driving;
* complex prediction.

They must avoid:

* constant wall collisions;
* permanent route blocking;
* random spinning;
* driving without purpose.

## Bot Vehicle Choice

Bots may prefer vehicles based on:

* distance;
* current health;
* current threat;
* vehicle condition;
* target distance;
* route.

Complex preference systems are not required initially.

## Police Vehicles

Police vehicles use the same general vehicle foundation where practical.

They may differ through:

* appearance;
* lights;
* siren;
* pursuit behaviour;
* durability;
* acceleration.

The first prototype uses only wanted level 1.

Police vehicles should create pressure without dominating the road network.

## Vehicle Audio

Each prototype vehicle class should have at least one distinct engine sound.

Required audio categories include:

* engine idle;
* acceleration;
* braking;
* collision;
* heavy impact;
* damage;
* burning;
* explosion.

Audio variety may be limited.

Class distinction and impact quality are more important.

## Sound Identity

### Compact Car

* light;
* higher-pitched;
* responsive.

### Saloon

* balanced;
* familiar;
* controlled.

### Van

* heavier;
* lower;
* slower response.

### Refuse Truck

* deep;
* industrial;
* heavy;
* mechanically stressed.

## Vehicle Visual Presentation

Vehicles receive higher visual priority than many other prototype assets.

They should include:

* distinct silhouettes;
* consistent proportions;
* headlights;
* brake lights where useful;
* exhaust;
* smoke;
* damage feedback;
* burning effects;
* exploded state;
* readable colour treatment.

## Detail Priority

Vehicle detail should focus on:

* silhouette;
* wheels;
* mass;
* front and rear readability;
* damage state;
* lighting;
* movement;
* material consistency.

It should not depend on:

* detailed interiors;
* complex dashboards;
* realistic small mechanical parts;
* full deformation.

## Vehicle Asset Requirements

Vehicle assets should support:

* consistent scale;
* standard wheel setup;
* clear pivots;
* collision volumes;
* AI driving;
* damage materials;
* smoke attachment points;
* burning effects;
* destroyed presentation;
* LODs where required later.

## Asset Source

Vehicles may come from:

* Asset Store packages;
* AI-assisted creation;
* AI-assisted Blender workflow;
* modular shared bases;
* hybrid adaptation.

The more efficient reliable route should be used.

## Acceptance Requirement

A vehicle source is unsuitable if it repeatedly requires routine manual human repair.

## Map Requirements for Vehicles

The prototype map should support different vehicle behaviours.

## Main Road

Supports:

* sustained acceleration;
* high speed;
* police pursuit;
* refuse truck;
* long-distance vehicle combat.

## Side Streets

Support:

* compact cars;
* sharp turns;
* theft;
* ambush;
* escape.

## Industrial Area

Supports:

* heavy vehicles;
* parked-car clusters;
* open collisions;
* chain reactions.

## Central Junction

Supports:

* mixed traffic;
* multi-directional impact;
* roadkills;
* rockets;
* congestion risk.

## Park or Plaza

Should reduce vehicle dominance.

It may include:

* barriers;
* narrow access;
* foot-focused space;
* limited drivable edges.

## Vehicle Gameplay Feedback

The player should understand:

* current speed;
* vehicle condition;
* burning danger;
* nearby collision threat;
* whether a hit was glancing or direct;
* whether the vehicle is still controllable;
* when an explosion is imminent.

Possible feedback includes:

* smoke;
* fire;
* engine sound;
* vibration;
* camera response;
* UI indicator;
* handling change.

## Vehicle HUD

The prototype may display:

* vehicle health;
* speed;
* burning warning;
* current vehicle type.

Only essential information should be shown.

The exact HUD presentation belongs in [`13_CAMERA_AND_UI.md`](13_CAMERA_AND_UI.md).

## Live-Tuning Variables

The following values should remain adjustable:

* acceleration;
* top speed;
* reverse speed;
* steering sensitivity;
* steering by speed;
* brake force;
* handbrake force;
* traction;
* drift strength;
* mass;
* collision damage;
* vehicle health;
* weapon damage against vehicles;
* burning threshold;
* burning duration;
* explosion damage;
* explosion radius;
* explosion force;
* entry duration;
* theft duration;
* high-speed exit damage;
* theft speed threshold;
* parked vehicle frequency;
* traffic vehicle frequency;
* respawn delay;
* bot driving skill.

## Prototype Validation Questions

The prototype must answer:

* Is driving enjoyable without combat?
* Are the four vehicle classes meaningfully different?
* Is high-speed driving readable?
* Does the handbrake create controllable drifting?
* Can players learn braking distances?
* Does vehicle theft fit the pace?
* Is occupied-vehicle theft understandable?
* Is high-speed exit a meaningful choice?
* Are full roadkills powerful and fair?
* Are side scrapes clearly different?
* Can foot players counter vehicles?
* Are vehicle damage states readable?
* Do burning vehicles create useful tactical pressure?
* Are explosions satisfying?
* Can ten vehicles create a stable natural chain reaction?
* Can bots drive with acceptable competence?
* Does vehicle density support frequent switching without blocking the map?

## Success Criteria

The vehicle system succeeds when:

* driving is fun by itself;
* controls are predictable;
* handbrake turns are repeatable;
* vehicle classes feel distinct;
* heavy vehicles feel heavy;
* light vehicles remain useful;
* stealing vehicles is fast and clear;
* foot players retain counterplay;
* roadkills feel powerful and attributable;
* damage states are immediately readable;
* burning creates urgency;
* explosions have strong impact;
* chain reactions remain stable;
* bots can use vehicles;
* players frequently switch vehicles naturally.

## Failure Conditions

The vehicle direction requires redesign if repeated tuning cannot resolve:

* driving that feels dull;
* unstable collisions;
* uncontrollable handbrake behaviour;
* unreadable high speed;
* all classes feeling similar;
* refuse truck dominating every situation;
* vehicles making foot combat irrelevant;
* roadkills feeling unavoidable;
* damage states being unclear;
* burning providing no escape opportunity;
* explosions destabilising physics;
* bot driving causing constant deadlocks;
* vehicle assets requiring routine manual correction.

## Deferred Vehicle Features

The first prototype excludes:

* motorcycles;
* vehicle repair;
* vehicle upgrades;
* personal vehicle ownership;
* detailed interiors;
* physical doors;
* removable doors;
* directional occupant protection;
* seat-capacity differences;
* passenger gameplay;
* vehicle-mounted weapons;
* tanks;
* military vehicles;
* detailed vehicle deformation;
* realistic fuel;
* tyre damage;
* vehicle customisation;
* persistent vehicle progression.

These may be reviewed after the vehicle foundation succeeds.

## Long-Term Vehicle Expansion

Possible later expansion includes:

* motorcycles;
* taxis;
* police variants;
* emergency vehicles;
* faction vehicles;
* rare high-value vehicles;
* military escalation vehicles;
* cosmetic variants;
* additional heavy vehicles;
* vehicles with specialised tactical roles.

Each new class should create a meaningful gameplay difference.

Vehicle count alone is not a design goal.

## Authorisation Boundary

This document defines vehicle design direction.

It does not authorise:

* vehicle-system implementation;
* physics architecture;
* asset purchases;
* package integration;
* AI driving implementation;
* Unity project creation;
* asset production;
* production work.

Those actions require separate approval.
