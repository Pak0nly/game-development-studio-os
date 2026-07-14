# AI, NPCs, and Traffic

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Prototype scope with deferred extensions
**Validation State:** Needs Prototype Validation
**Approval Status:** Pending Human Developer review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This document defines the design direction for:

- combat bots;
- civilians;
- civilian drivers;
- police actors;
- traffic;
- simple role logic;
- navigation behaviour;
- local danger reactions;
- later faction NPCs.

The authoritative first-prototype scope remains defined in:

[`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md)

## Core Principle

AI exists to support player action.

It should create:

- pressure;
- movement;
- opportunity;
- unpredictability;
- visible city reaction.

It should not replace players as the main source of conflict.

## Prototype AI Roles

The first prototype uses four clear roles:

1. combat bot;
2. pedestrian civilian;
3. civilian driver;
4. police officer.

Complex personalities, schedules, relationships, and social simulation are excluded.

## Combat Bots

## Purpose

Combat bots make the full Free-for-All loop testable and playable by one human.

Bots are a core product feature, not only a development fallback.

## Shared Rules

Bots should use the same core systems as players where practical:

- movement;
- health;
- armour;
- weapons;
- ammunition;
- pickups;
- vehicles;
- damage;
- death;
- respawn;
- scoring.

Bots should not receive hidden immunity, unlimited ammunition, or different damage rules.

## Required Prototype Behaviour

Bots must be able to:

- identify combat targets;
- fight other bots;
- fight the human player;
- move toward useful positions;
- aim and shoot;
- use pistol, shotgun, and rocket launcher;
- collect weapons;
- collect ammunition;
- collect armour;
- collect medkits when useful;
- enter vehicles;
- steal empty or available vehicles;
- drive toward targets;
- ram opponents;
- leave burning vehicles;
- use rockets against vehicles;
- respawn under the same rules as players.

Bots may rarely attempt to pull a driver from a stationary or slow vehicle.

## Target Selection

Bots should not permanently prioritise the human player.

Target choice may consider:

- distance;
- visibility;
- threat;
- recent damage;
- score opportunity;
- current weapon;
- vehicle state;
- accessibility.

The system should produce a healthy amount of bot-versus-bot conflict.

## Combat Skill

Bot difficulty may vary through:

- reaction time;
- aim error;
- target-switch delay;
- movement quality;
- risk tolerance;
- pickup awareness;
- driving competence;
- willingness to disengage.

Difficulty should not rely mainly on higher health or damage.

## Bot Imperfection

Bots should make believable mistakes.

Examples:

- missing shots;
- choosing a poor route;
- staying too long in a damaged vehicle;
- failing to claim a pickup;
- overcommitting to a target.

Bots should not appear broken or purposeless.

## Bot Vehicle Use

Bots should:

- recognise nearby usable vehicles;
- enter them;
- drive with acceptable competence;
- avoid obvious walls and permanent loops;
- ram visible targets;
- abandon burning vehicles;
- leave unusable vehicles;
- use road routes rather than free-form driving where practical.

Advanced drifting and racing-line behaviour are not required.

## Bot Failure Signs

The bot system is failing if:

- bots mainly attack the human;
- bots rarely fight one another;
- bots require special weapons or damage rules;
- bots constantly crash;
- bots ignore burning vehicles;
- bots wander without seeking points;
- matches become predictable;
- bot logic dominates the development cost.

## Civilian Pedestrians

## Purpose

Pedestrians make the city feel populated and reactive.

They should provide:

- visual life;
- local danger response;
- traffic-side movement;
- opportunities for chaos;
- readable evacuation of dangerous areas.

## Prototype Behaviour

Pedestrians should:

- move through valid pedestrian spaces;
- avoid obvious obstacles;
- react to nearby gunfire, impacts, and explosions;
- flee quickly from danger;
- leave the immediate danger area;
- remain absent briefly;
- return or be replenished after danger ends.

## Excluded Behaviour

Pedestrians do not require:

- daily schedules;
- conversations;
- persistent identities;
- shops or homes;
- complex emotional states;
- detailed memory;
- realistic crowd simulation.

## Density

Pedestrian density should vary by location.

Higher density:

- commercial area;
- plaza;
- clinic surroundings.

Lower density:

- industrial area;
- high-speed main road;
- service routes.

Density must remain adjustable.

## Civilian Drivers

## Purpose

Civilian drivers populate traffic and provide stealable vehicles.

## Prototype Behaviour

Drivers should:

- follow traffic routes;
- respond to congestion;
- react to danger;
- prefer vehicle escape where plausible;
- leave or flee on foot when blocked or forced out;
- be removable by vehicle theft interactions.

## Driver Response to Theft

When a player steals a vehicle, the driver may:

- be pulled out;
- flee;
- briefly resist;
- attempt to escape.

For the first prototype, the former owner exits and flees and does not chase or attack the combatant. Owner retaliation or pursuit is a deferred optional concept outside the prototype. The canonical rule is maintained in [`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md#5-vehicles).

## Traffic

## Purpose

Traffic should create atmosphere, moving resources, temporary obstacles, pursuit opportunities, and explosion potential.

It must not turn the map into a permanent traffic jam.

## Road Network

Traffic should use a clear road network with:

- main roads;
- secondary roads;
- side streets;
- industrial routes;
- intersections;
- bridge or underpass support.

## Required Prototype Behaviour

Traffic should support:

- dynamic route choice;
- periodic route reassessment;
- simple local avoidance;
- braking for obstacles;
- reversing when blocked;
- rerouting where possible;
- removal of permanently stuck vehicles outside direct view;
- controlled replenishment.

## Incident Management

The prototype only requires a simple incident system.

A blocked vehicle should:

1. wait briefly;
2. attempt local correction;
3. reverse if necessary;
4. select another route where possible;
5. be removed outside direct player view if permanently stuck.

## Traffic Density

Traffic density should be adjustable by:

- road type;
- session setting;
- current incident load;
- performance state.

The main road should remain usable for high-speed play.

## Traffic Recovery

After major incidents:

- traffic may temporarily reduce;
- routes may change;
- vehicles should gradually return;
- the city should not stay empty for the rest of a short round.

## Police AI

Police design is detailed in:

[`08_POLICE_AND_ESCALATION.md`](08_POLICE_AND_ESCALATION.md)

From an AI perspective, prototype police should:

- detect simplified crimes;
- select offenders;
- pursue on foot or by vehicle;
- respect a global unit cap;
- compete for limited response capacity;
- disengage according to simple rules.

Police should not require advanced investigation or witness logic in the first prototype.

## Perception

## Prototype Direction

AI perception should remain simple and readable.

Possible inputs include:

- line of sight;
- distance;
- recent damage;
- nearby sound event;
- danger area;
- known target position.

The system should avoid simulating more information than gameplay requires.

## Shared Events

Useful shared gameplay events may include:

- gunshot;
- explosion;
- vehicle impact;
- target death;
- burning vehicle;
- police alert;
- dangerous area.

The detailed implementation belongs in technical architecture.

## Navigation

## Foot Navigation Outcomes

No navigation system or framework is selected. Foot actors need reliable traversal, local collision recovery, and fallback behaviour across:

- roadsides;
- sidewalks;
- park;
- industrial spaces;
- clinics;
- bridges or underpasses where applicable.

## Vehicle Navigation Outcomes

No road representation or pathfinding solution is selected. Vehicle movement must remain road-oriented, respect lane and level structure, recover from common blockages, and avoid behaving like unrestricted pedestrian navigation.

## Multi-Level Navigation

The bridge, elevated road, or underpass must validate:

- level separation;
- correct route selection;
- no cross-level targeting errors;
- stable path recovery.

## Danger Areas

The city may mark temporary local danger around:

- gunfire;
- explosions;
- burning vehicles;
- active police pursuit;
- dense combat.

Civilians should avoid or leave these areas.

Bots may use danger information for:

- avoiding explosions;
- leaving burning vehicles;
- selecting another route;
- deciding whether to engage.

Danger areas should expire quickly enough for short rounds.

## Population Recovery

## Principle

The city should recover after violence.

## Prototype Direction

After danger ends:

- pedestrians may re-enter from outside view;
- traffic may resume;
- new civilian vehicles may spawn;
- local density may return toward its target.

The system should avoid visible popping where practical.

## AI Performance Principles

The final stress scenario includes:

- eleven combat bots;
- civilians;
- civilian drivers;
- foot police;
- police vehicles.

AI must remain scalable.

Possible controls include:

- update budgets;
- reduced distant awareness;
- simplified distant navigation;
- pooled actors;
- limited perception frequency;
- role-specific logic;
- global caps;
- controlled spawn density.

Exact technical solutions require architecture review.

## Debugging Requirements

AI should be easy to inspect.

Useful debug information may include:

- current role;
- current state;
- target;
- destination;
- selected route;
- reason for target change;
- vehicle intention;
- stuck status;
- danger awareness.

Debugging visibility is important for AI-agent implementation and human review.

## Long-Term Faction NPCs

## Status

**Content Classification:** `Deferred Current Hypothesis`; not prototype scope.

## Purpose

Faction NPCs may later:

- defend controlled buildings;
- patrol adjacent areas;
- move between connected locations;
- support player attacks;
- expand slowly into neutral weak buildings;
- pressure enemy positions;
- create visible front lines.

## Core Boundary

Faction NPCs must not turn the game into an RTS.

Players should not directly command large groups.

NPC activity should:

- support player conflict;
- create movement;
- make territory visible;
- leave decisive actions to players.

## Expansion Behaviour

Possible later rules:

- slow or moderate autonomous expansion;
- preference for nearby weak targets;
- stronger defence near connected buildings;
- physical support routes;
- isolated buildings receive weaker support;
- NPC quality and quantity linked to upgrades.

These rules remain Draft.

## AI Success Criteria

The prototype AI succeeds when:

- bots sustain a complete FFA round for the selected test duration;
- bots fight each other regularly;
- bots use weapons and vehicles;
- bots leave burning vehicles;
- civilians flee danger;
- traffic recovers from common blockages;
- police add pressure without dominating;
- population recovers after incidents;
- the stress scenario avoids systematic AI collapse.

## AI Failure Conditions

The direction requires revision if:

- bots mainly target the human;
- vehicle AI constantly deadlocks;
- traffic must be nearly disabled for fun;
- civilians ignore danger;
- police become the main opponent;
- the bridge or underpass breaks navigation;
- AI consumes disproportionate performance;
- bots require a separate simplified game.

## Live-Tuning Variables

- bot reaction time;
- bot accuracy;
- bot target-switch delay;
- bot aggression;
- bot risk tolerance;
- bot pickup awareness;
- bot driving skill;
- pedestrian density;
- pedestrian flee distance;
- pedestrian recovery time;
- traffic density;
- traffic speed;
- reroute delay;
- stuck timeout;
- police unit maximum;
- police response delay;
- danger-area size;
- danger-area duration;
- population replenishment rate.

## Deferred AI Features

The first prototype excludes:

- personalities;
- schedules;
- relationships;
- dialogue AI;
- persistent memory;
- advanced squad tactics;
- stealth detection;
- realistic witness reporting;
- detailed crowd simulation;
- faction command UI;
- complex strategy AI;
- procedural social behaviour.

## Authorisation Boundary

This document defines AI, NPC, and traffic design direction.

It does not authorise:

- AI implementation;
- navigation setup;
- traffic package integration;
- Unity scene changes;
- package purchases;
- production work.

Those actions require separate approval.
