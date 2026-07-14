# Player Movement and Combat

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Prototype scope with deferred extensions
**Validation State:** Needs Prototype Validation
**Approval Status:** Pending Human Developer review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This document defines the intended player movement, aiming, health, armour, healing, weapon, melee, death, and combat-feedback systems.

It describes both:

* the confirmed direction for the first prototype;
* later options that remain deferred or require validation.

The authoritative prototype boundaries remain defined in:

[`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md)

## Design Goals

Player movement and combat should feel:

* immediate;
* responsive;
* readable;
* physical;
* arcade-oriented;
* easy to understand;
* difficult to master;
* compatible with keyboard and mouse; optional controller support may be evaluated only if negligible in effort;
* clear with both confirmed camera variants at fixed elevation and distance.

The system should support frequent switching between:

* movement;
* shooting;
* dodging;
* sprinting;
* jumping;
* melee;
* vehicle entry;
* vehicle escape.

Controls must feel reliable before animation quality or visual complexity is prioritised.

## Control Scheme

## Keyboard and Mouse

Current intended input:

* movement: WASD or arrow keys;
* aim: mouse;
* shoot: mouse button;
* reload: dedicated key;
* sprint: dedicated key;
* jump: dedicated key;
* dodge roll: dedicated key;
* melee: dedicated key;
* interact or enter vehicle: dedicated key;
* use medkit: dedicated key;
* weapon selection: number keys or equivalent;
* pause and menu: standard menu input.

Exact bindings remain open.

Future remapping is intended.

## Optional Controller

Current intended input:

* movement: left stick;
* aim: right stick;
* shoot: trigger;
* reload: face button or shoulder input;
* sprint: stick click or shoulder input;
* jump: face button;
* dodge roll: face button or shoulder input;
* melee: face button;
* interact or enter vehicle: face button;
* use medkit: directional input or assigned action;
* weapon selection: fixed cycling or later weapon wheel.

Exact bindings require testing.

## Input Principles

The input system should:

* treat movement and aiming independently;
* avoid noticeable input delay;
* support keyboard and mouse; controller parity applies only if optional controller support is included;
* support later rebinding;
* allow AI and player control to use the same gameplay actions where practical;
* avoid hard dependencies on one local player.

## Controller Aim Assistance

Controller aim assistance is `Needs Prototype Validation` only if optional controller support is included.

Possible support may include:

* light aim slowdown;
* slight target magnetism;
* small projectile tolerance;
* no assistance.

Aim assistance must not make aiming automatic.

It should only compensate for the lower precision of a stick.

## Movement Model

## General Movement

Movement should feel direct and arcade-like.

The player should:

* respond immediately to input;
* change direction quickly;
* stop predictably;
* avoid excessive acceleration delay;
* avoid heavy inertia;
* remain readable during combat.

The movement model should prioritise control over physical realism.

## Movement Speed States

The prototype includes:

* normal movement;
* sprinting;
* jumping;
* dodge rolling.

Walking or normal running is the default state.

Exact speed values remain live-tuning variables.

## Movement Direction

The player should be able to:

* move independently from aim direction;
* retreat while firing;
* strafe around threats;
* move diagonally;
* reposition without changing aim target.

This independence is a core control requirement.

## Sprint

## Purpose

Sprint allows:

* rapid repositioning;
* escaping vehicles;
* crossing dangerous spaces;
* chasing injured targets;
* reaching cover or pickups;
* creating distance.

## Rules

Sprint:

* consumes stamina;
* interrupts shooting;
* cannot continue indefinitely;
* should feel meaningfully faster than normal movement;
* should not create excessive animation delay;
* should stop quickly when input ends.

## Design Intent

Sprint should be useful but not mandatory at all times.

The player should make short decisions about when to spend stamina.

## Failure Signs

Sprint is failing if:

* normal movement feels too slow without it;
* players sprint constantly;
* stamina becomes irrelevant;
* sprint prevents precise control;
* sprint makes vehicle avoidance trivial;
* sprint creates long recovery downtime.

## Jump

## Purpose

Jump supports:

* intuitive movement;
* crossing low obstacles;
* navigating map variation;
* avoiding selected hazards;
* creating a familiar action-game control set.

## Rules

Jump:

* does not consume stamina;
* may be used repeatedly;
* interrupts shooting;
* has no complex parkour system;
* should remain predictable;
* should not become the strongest defensive option.

## Design Intent

Jump should feel natural and useful without dominating combat.

It should not create:

* bunny-hopping as the optimal strategy;
* unclear hit detection;
* excessive vertical movement;
* animation-driven loss of control.

## Prototype Assumption

Jump frequency and movement influence require testing.

A cooldown may be introduced only if repeated jumping harms combat readability.

## Dodge Roll

## Purpose

The dodge roll is a short repositioning action.

It supports:

* avoiding vehicle paths;
* escaping close-range attacks;
* crossing small dangerous areas;
* breaking predictable movement;
* creating skill-based survival moments.

## Rules

The dodge roll:

* consumes stamina;
* interrupts shooting;
* has no invulnerability frames;
* protects only through actual movement;
* should move the player a clear short distance;
* should have a readable start and end;
* should not be endlessly repeated.

## Direction

The roll should follow:

* current movement direction;
* or a deliberate directional input.

The exact behaviour requires testing.

## Design Intent

Success should depend on timing and positioning.

The player is not protected if the vehicle or projectile still connects.

## Failure Signs

The roll is failing if:

* it functions like temporary invulnerability;
* it is too slow to avoid vehicles;
* it is used continuously;
* it causes frequent loss of control;
* the ending leaves the player helpless for too long;
* animation timing determines success more than player timing.

## Stamina

## Purpose

Stamina limits repeated high-mobility actions without creating long downtime.

## Prototype Rules

Stamina is used by:

* sprint;
* dodge roll.

Jump does not consume stamina.

Stamina:

* regenerates quickly;
* begins regenerating immediately;
* has no regeneration delay;
* should be clearly visible;
* should recover fast enough to maintain the game’s pace.

## Design Intent

Stamina should create short tactical constraints.

It should not behave like a survival-game resource.

The player should occasionally be forced to choose between:

* sprinting;
* dodging;
* preserving mobility for the next threat.

## Tuning Variables

* maximum stamina;
* sprint drain;
* dodge cost;
* regeneration rate;
* minimum stamina required for dodge;
* sprint interruption threshold.

## Shooting and Movement Interaction

## Core Rule

Shooting is interrupted by:

* sprinting;
* jumping;
* dodge rolling.

Normal movement still allows shooting.

## Movement Accuracy

Walking or moving increases weapon spread.

Standing still should provide better accuracy.

The difference should be:

* noticeable;
* readable;
* not so extreme that firing while moving becomes useless.

## Design Intent

This creates a choice between:

* mobility;
* accuracy;
* survival;
* pressure.

The player may fire while moving, but controlled positioning should be rewarded.

## Aiming

## Independent Aim

Aim direction is independent from movement direction.

The player should be able to:

* fire while retreating;
* strafe around targets;
* aim across vehicle routes;
* keep a target tracked while repositioning.

## Aim Presentation

The prototype may use:

* visible weapon orientation;
* aim indicator;
* cursor;
* target line;
* subtle ground marker.

The simplest readable solution should be used.

## Aiming Requirements

Aiming must remain clear:

* near the player;
* at screen edges;
* with both camera variants at their fixed distance;
* during vehicle movement;
* under neon lighting;
* during explosions and smoke.

## Health

## Health Model

The player has a simple health bar.

Health:

* does not regenerate automatically;
* is reduced after armour is depleted;
* can be restored through medkits or clinics;
* reaches zero at death.

No detailed body-part health is used.

## Low-Health State

Low health produces visual and audio feedback.

Possible feedback includes:

* screen-edge effect;
* heartbeat;
* colour reduction;
* character damage state;
* stronger health-bar warning.

Low health does not reduce:

* movement speed;
* accuracy;
* stamina;
* vehicle control.

## Design Intent

Low health should create urgency without creating a death spiral.

## Armour

## Armour Model

Armour is a separate bar.

Armour:

* absorbs damage before health;
* breaks when depleted;
* is collected as a world pickup;
* is temporary;
* is lost through combat.

## Armour Scope

The prototype does not require:

* armour body locations;
* armour classes;
* directional armour;
* armour repair;
* visible equipment pieces;
* movement penalties.

## Vehicle Impact Rule

A clean full vehicle hit kills regardless of armour.

Armour does not protect against a complete direct roadkill.

A side scrape or partial impact may still be survivable.

## Healing

## Clinics

Clinics serve as:

* respawn locations;
* world landmarks;
* healing locations.

Healing at a clinic should take a short amount of time.

The exact duration requires testing.

The player should remain exposed enough that clinic use is not completely safe.

## Medkits

Prototype medkit behaviour:

* restores approximately fifty percent health;
* can be used while walking;
* cannot be used while sprinting;
* uses a short animation or activation time;
* is consumed on use.

## Open Decision — Damage Interruption

It remains open whether incoming damage interrupts medkit use.

This should be tested.

### Option A — Damage Interrupts

Advantages:

* rewards safe positioning;
* prevents healing through direct fire;
* creates tension.

Risks:

* medkits may become unreliable;
* chaotic fights may make healing nearly impossible.

### Option B — Damage Does Not Interrupt

Advantages:

* predictable;
* useful under pressure;
* simpler.

Risks:

* may allow healing through obvious danger;
* may reduce tactical positioning.

## Damage Model

## General Principles

Damage should be:

* readable;
* consistent;
* easy to balance;
* shared across players and bots;
* compatible with vehicles and explosions;
* capable of fair score attribution.

## Damage Sources

Prototype damage sources include:

* pistol;
* shotgun;
* rocket launcher;
* fists;
* vehicle impact;
* explosion;
* burning;
* environmental interactions;
* police weapons.

## Damage Resolution

General intended order:

1. damage event occurs;
2. armour absorbs eligible damage;
3. remaining damage reduces health;
4. hit feedback is triggered;
5. source and attacker are recorded;
6. death is resolved if health reaches zero;
7. score attribution is calculated.

Exact technical implementation belongs in architecture documents.

## Hit Detection

## Prototype Direction

The game uses simple hit detection.

The prototype does not require:

* headshots;
* limbs;
* critical body zones;
* detailed armour zones;
* realistic bullet penetration.

## Design Intent

Players should clearly understand:

* whether a shot hit;
* how much danger they are in;
* whether armour absorbed the hit;
* whether the target died.

The elevated camera makes detailed hit zones unnecessary and potentially unreadable.

## Time to Kill

## General Target

The intended time to kill is medium.

Combat should allow:

* reaction;
* repositioning;
* escape;
* third-party interruption.

It should still feel dangerous.

## Initial Pistol Target

An unarmoured player should die after approximately:

* six to eight pistol hits.

This is a prototype assumption and tuning target.

## Shotgun Target

The shotgun may kill in one shot at very close range.

The effectiveness should fall clearly with distance.

## Rocket Target

The rocket launcher should:

* strongly threaten vehicles;
* punish grouped targets;
* initiate explosions;
* not function as a universally easy player-kill weapon.

Exact damage and radius require testing.

## Weapon Inventory

## Prototype Slots

The prototype includes exactly three weapon slots.

The slot model should remain simple and visible.

## Active Weapon

The active weapon should be visibly represented.

Other carried weapons do not require full character-body display.

## Weapon Selection

Initial selection may use:

* fixed number keys;
* direct controller cycling;
* fixed UI slots.

A weapon wheel is deferred.

## Inventory Philosophy

The inventory should avoid:

* grids;
* weight;
* attachment management;
* ammunition types per weapon family beyond what is needed;
* complex looting interfaces.

The focus remains on action.

## Weapons

## Pistol

### Role

* respawn weapon;
* common weapon;
* reliable fallback;
* medium-range pressure.

### Prototype Rules

* player respawns with pistol;
* two magazines are provided;
* ammunition is relatively common;
* moving fire remains possible;
* stationary fire is more accurate.

### Intended Strength

* reliable;
* flexible;
* not dominant;
* weak against healthy vehicles.

## Shotgun

### Role

* close-range combat;
* side streets;
* park or plaza fights;
* punishing slow vehicle entry or exit;
* strong ambush weapon.

### Prototype Rules

* can kill at very close range;
* becomes less effective quickly with distance;
* ammunition less common than pistol ammunition;
* high impact feedback.

### Intended Weakness

* limited range;
* slower follow-up;
* poor anti-vehicle capability compared with rockets.

## Rocket Launcher

### Role

* anti-vehicle;
* explosion creation;
* chain-reaction initiation;
* crowd pressure.

### Prototype Rules

* heavy ammunition is rare;
* bots use it against vehicles;
* direct vehicle hits may cause rapid destruction;
* nearby explosions may create chains.

### Intended Weakness

* scarce ammunition;
* visible attack;
* risk to user at close range;
* slower handling;
* not ideal for every duel.

## Fist Combat

## Purpose

Fist combat ensures that the player is never completely unable to attack.

## Prototype Direction

Fists:

* are always available;
* deal low damage;
* require very short range;
* may interrupt or pressure vulnerable targets;
* can finish injured enemies.

## Not Required

The prototype does not require:

* melee weapons;
* complex combos;
* grappling;
* throws;
* execution animations;
* blocking;
* parrying.

## Long-Term Possibility

Melee weapons may be considered later if they support the action without increasing animation and balance complexity excessively.

## Reloading

## General Rules

Reloading should:

* be readable;
* create vulnerability;
* remain faster than tactical military reload systems;
* support the arcade pace.

## Interruption

Reloading is interrupted by:

* shooting;
* weapon switching;
* melee attacks;
* dodging;
* entering a vehicle.

Reloading is not interrupted by normal movement, sprinting, or receiving damage. The canonical prototype rule is maintained in [`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md#4-weapons-and-inventory).

## Partial Magazines

Detailed magazine retention is not required.

A simpler ammunition model is acceptable.

## Weapon Pickups and Drops

## World Pickups

Weapons appear at world spawn slots.

Spawn slots may select from appropriate random contents.

The same location does not always need to contain the same weapon.

## Death Drops

On death:

* all carried firearms drop;
* dropped weapons can be collected immediately;
* ammunition behaviour should remain simple and consistent.

The player respawns with:

* pistol;
* two magazines.

## Design Intent

Death redistributes resources and creates new local conflict.

## Combat Feedback

## Hit Feedback

Hits should communicate through a combination of:

* blood;
* sound;
* target reaction;
* screen feedback;
* armour effect;
* UI response.

## Armour Feedback

Armour hits should feel distinct from health damage.

Possible signals include:

* different colour;
* sharper effect;
* shield-like sound;
* visible armour-bar loss;
* armour-break event.

## Death Feedback

Death should clearly show:

* cause;
* attacker;
* kill type;
* score result where relevant.

The transition to respawn should remain quick.

## Impact Philosophy

Weapon hits, vehicle impacts, and explosions require strong physical feedback.

The desired feeling is:

* heavy;
* bass-driven;
* immediate;
* arcade-like.

Audio variety may be limited in the prototype.

Impact quality may not be reduced.

## Blood and Violence Presentation

## Direction

Violence is stylised and adult.

The prototype may use:

* clear blood effects;
* visible hit splashes;
* simple ground decals;
* strong death feedback.

The game should avoid:

* realistic gore detail;
* disturbing injury simulation;
* body-part destruction;
* prolonged suffering.

Blood serves readability and tone.

## Death

## Death Conditions

The player dies when:

* health reaches zero;
* the canonical vehicle-impact rule in [`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md#3-health-armour-and-healing) produces a lethal outcome;
* a sufficiently strong explosion kills them;
* another valid lethal damage source resolves.

## Death Effects

On death:

* carried firearms drop;
* score attribution occurs;
* the body or visual representation resolves clearly;
* the player enters a short respawn period.

## Prototype Respawn

The prototype uses:

* unlimited respawns;
* clinic selection through weighted randomness;
* strong deprioritisation near active combat, enemies, or severe traffic danger;
* pistol and two magazines;
* quick return to play.

## Friendly Fire

Friendly fire is not relevant to prototype FFA.

For later team modes, friendly fire should be configurable per session.

Possible options:

* off;
* reduced;
* full.

The default remains open.

## Downed and Revival Systems

## Prototype Status

Not included.

Players die directly and respawn.

## Long-Term Possibility

Later modes may include:

* downed state;
* teammate revival;
* medic role;
* expensive revival item;
* life sacrifice to return a teammate.

These systems are mode-specific and require separate review.

They must not slow the prototype FFA.

## Player Highlighting

The local player should be clearly distinguishable.

Possible methods include:

* outline;
* ground marker;
* colour treatment;
* light accent;
* subtle glow.

Other combatants should be readable but less strongly highlighted.

Highlighting must remain visible during:

* neon reflections;
* smoke;
* explosions;
* vehicle entry;
* dark streets.

## Combat Readability

The player should be able to identify:

* own position;
* aim direction;
* active weapon;
* ammunition;
* health;
* armour;
* stamina;
* nearby enemies;
* incoming vehicle threat;
* burning vehicle threat;
* explosion danger;
* police presence.

Effects and animation must not obscure these signals.

## Bot Compatibility

Combat bots should use the same core systems as the player where practical.

Shared systems include:

* movement capabilities;
* health;
* armour;
* weapons;
* ammunition;
* pickups;
* damage;
* death;
* respawn;
* scoring.

Bots may have simplified decision-making.

They should not require hidden combat advantages.

Difficulty should be created through parameters such as:

* accuracy;
* reaction time;
* risk tolerance;
* movement choices;
* pickup awareness.

## Prototype Validation Questions

The prototype must answer:

* Does movement feel responsive?
* Does independent aiming feel natural?
* Are keyboard and mouse viable, and is optional controller support viable if included?
* Are sprint, jump, and dodge distinct?
* Is dodge useful without invulnerability?
* Does stamina limit mobility without slowing the game too much?
* Is firing while moving useful but less accurate?
* Does the pistol feel reliable?
* Does the shotgun feel dangerous at close range?
* Does the rocket launcher create anti-vehicle pressure?
* Is fist combat a useful fallback?
* Is medium time to kill appropriate?
* Is armour understandable?
* Is healing useful without creating downtime?
* Are hits and deaths clearly communicated?
* Does the player remain readable under full visual effects?

## Success Criteria

Movement and combat succeed when:

* input feels immediate;
* movement and aiming remain independent;
* controls work with keyboard and mouse; optional controller controls work if included;
* sprint, jump, and dodge have different uses;
* stamina creates decisions without long waiting;
* weapon roles are distinct;
* pistol combat remains readable;
* shotgun range is clear;
* rockets threaten vehicles;
* foot players can respond to vehicle danger;
* healing and armour are understandable;
* hit feedback has sufficient power;
* death returns the player quickly to action.

## Failure Conditions

The system requires redesign if repeated tuning cannot resolve:

* noticeable input delay;
* uncontrolled movement inertia;
* unreadable aiming;
* controller aiming that remains significantly inferior;
* dodge functioning as mandatory invulnerability;
* sprint becoming permanently required;
* jump dominating combat;
* weak weapon impact;
* unclear armour and health damage;
* unavoidable vehicle deaths;
* excessive healing downtime;
* combat that is only satisfying inside vehicles.

## Live-Tuning Variables

The following values should remain adjustable:

* movement speed;
* acceleration;
* deceleration;
* sprint speed;
* sprint stamina drain;
* stamina maximum;
* stamina regeneration;
* dodge cost;
* dodge distance;
* dodge duration;
* jump height;
* jump duration;
* movement spread penalty;
* pistol damage;
* pistol fire rate;
* pistol spread;
* pistol reload;
* shotgun damage;
* shotgun spread;
* shotgun range;
* shotgun reload;
* rocket damage;
* explosion radius;
* rocket speed;
* fist damage;
* fist range;
* health maximum;
* armour maximum;
* medkit healing;
* medkit use time;
* clinic healing time;
* respawn delay.

## Deferred Features

The following are not part of the first prototype:

* melee weapons;
* headshots;
* body-part damage;
* advanced cover;
* crouching;
* prone movement;
* stealth;
* executions;
* weapon attachments;
* weapon upgrades;
* inventory grids;
* advanced ammo management;
* downed state;
* revival;
* character classes;
* permanent combat progression;
* complex status effects.

## Authorisation Boundary

This document defines player movement and combat design.

It does not authorise:

* implementation;
* technical architecture;
* Unity project creation;
* package selection;
* animation purchases;
* controller configuration;
* asset production;
* production work.

Those actions require separate approval.
