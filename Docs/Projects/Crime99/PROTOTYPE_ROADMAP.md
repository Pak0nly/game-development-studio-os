# Prototype Roadmap

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Canonical prototype sequence
**Validation State:** Needs Prototype Validation
**Approval Status:** Pending Human Developer review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This roadmap defines the recommended implementation order for the first playable prototype.

The roadmap exists to prevent expensive systems from being built before the underlying gameplay has proven that it is fun.

The prototype must validate:

* player movement and aiming;
* vehicle handling;
* foot combat versus vehicles;
* weapon and collision impact;
* vehicle destruction and chain reactions;
* bot-supported Free-for-All gameplay;
* basic traffic, civilians, and police;
* camera readability;
* the visual direction Neon over Dirt;
* asset usability and visual cohesion;
* technical stability under the intended prototype load.

Each milestone has a clear validation purpose.

A milestone should not expand before its core questions have been answered.

## Roadmap Principles

### Validate Fun Before Complexity

Movement, shooting, and driving must work before city simulation, police systems, or visual expansion are prioritised.

### Build for Solo Testing First

The full prototype must be testable by one human player against bots.

Network multiplayer is deferred until the solo prototype passes all major gates.

### Use Gates, Not Assumptions

A completed feature is not automatically successful.

Each milestone must be reviewed against gameplay, visual, and technical criteria.

### Keep Values Adjustable

Movement, weapons, vehicles, AI, traffic, police, camera, and scoring must remain easy to tune.

### Reduce Secondary Scope First

If effort becomes excessive, visual variety, UI polish, audio variety, and secondary environment content should be reduced before core feel is compromised.

## Asset Pre-Production and Asset and Style Preflight — Before Prototype Production

The production principle through completion of the first prototype is `Buy, reuse, adapt lightly.` The planned primary source is the Humble Bundle `Cosmos Eclipse Game Dev Assets & Tools Bundle — Unreal, Unity, Godot`; purchase and download remain subject to separate Human Developer approval.

Before download, import, or Unity test work, the following documentation and selection steps may be performed only under their applicable authorisation:

1. **Bundle catalogue:** inventory the bundle contents and preserve source and licence references.
2. **Licence and metadata review:** document the licence and all available metadata for Unity support, render-pipeline compatibility, shaders, materials, scale, textures, LODs, colliders, pivots, modularity, expected performance, and likely adaptation effort without downloading or importing assets.
3. **Relevant-package prioritisation:** assess `1950s NYC`, `Cyberpunk Port City`, and `Fuyoh Cyberpunk Diner` first.
4. **Bounded test-selection decision:** identify the smallest representative asset selection that could answer the technical, camera-readability, and visual-cohesion questions. This decision does not authorise acquisition, download, import, or testing.

A separately authorised Asset and Style Preflight may then perform:

5. **Bounded test download and import:** download and import only the explicitly approved representative test selection into an isolated, minimal Unity test environment.
6. **Preflight evaluation:** test technical usability, camera readability with both confirmed camera variants, and visual cohesion under `Neon over Dirt`, including deliberately cleaner and dirtier areas. Assets are raw material and may receive a light shared style pass where needed.
7. **Asset-gap analysis:** identify unique or missing project-specific needs after the bounded test rather than assuming new production is required.
8. **Main-prototype asset decision:** decide which packages or individual assets, if any, may later be proposed for the actual prototype. The final main-prototype selection occurs only after the Preflight and does not itself authorise a later import.

The Asset and Style Preflight requires a minimal, separately authorised Unity test environment and a provisional render-pipeline selection used only for this isolated test. That provisional choice is not the complete technical architecture or final render-pipeline decision for the main project. A Style Slice cannot occur without the bounded test import in step 5.

No generative derivation, training, or use of bundle assets as generative references is allowed without a separate licence review. Original AI-assisted 3D production with Claude and Blender is deferred until after the first prototype and remains a later option for unique or missing project-specific assets. The separate Cyberpunk Gigapack is not a current purchase; the Gumroad coupon is reviewed only after inventory and overlap analysis.

Purchase, download, import, creation of the test environment, and execution of the Asset and Style Preflight or Style Slice each require the applicable explicit assignment. The current documentation task authorises none of those actions and does not authorise installation, technical integration, main-project architecture, or prototype production.

## Milestone 0 — Technical and Visual Preflight

### Goal

Compare both confirmed camera variants and confirm that the visual direction and preflighted asset strategy can support the intended prototype without selecting the main-project technical architecture.

### Included

* empty prototype project;
* separate rudimentary test area;
* `Fixed Camera` with fixed orientation, fixed elevation angle, and fixed distance;
* `Rotatable Camera` with fixed elevation angle and fixed distance, free rotation around the player, no panning, and no independent translation;
* one placeholder character;
* one placeholder vehicle;
* simple road and sidewalk;
* final-leaning wet asphalt material;
* basic neon lighting;
* smoke or steam;
* initial performance measurement;
* a bounded representative selection approved through the Asset Pre-Production Sequence.

### Questions to Answer

* How do `Fixed Camera` and `Rotatable Camera` compare during walking, aiming, combat, and driving?
* Does each variant provide enough road visibility at its fixed distance?
* Does free rotation improve orientation without requiring panning or independent translation?
* Does each camera variant remain readable while walking and driving?
* Can simple geometry already communicate Neon over Dirt?
* Can wet asphalt, neon, smoke, and grime create the intended atmosphere?
* Can assets from different sources be visually unified?
* Is there any obvious technical blocker?

### Completion Criteria

* both confirmed camera variants have been compared against the same representative scene and activities;
* fixed elevation and distance remain readable during walking and driving;
* at least one variant is provisionally acceptable without closing the final camera decision;
* the scene communicates the intended visual direction;
* no major technical blocker prevents further prototyping;
* the selected asset route appears usable and visually cohesive;
* the prototype project runs reliably enough to continue.

### Explicitly Not Included

* bots;
* combat;
* traffic;
* police;
* complete map;
* full vehicle damage;
* final UI.

## Milestone 1 — Player Movement and Pistol Combat

### Goal

Make the on-foot player immediately responsive, understandable, and enjoyable to control.

### Included

* keyboard and mouse controls;
* optional controller controls only if negligible in effort;
* independent movement and aiming;
* sprint;
* jump;
* dodge roll;
* stamina use;
* fast stamina regeneration;
* no stamina regeneration delay;
* shooting interruption during sprint, jump, and dodge;
* increased spread while moving;
* pistol;
* reloading;
* basic health;
* basic hit feedback;
* death;
* simple respawn;
* fist combat as fallback.

### Questions to Answer

* Does movement feel direct?
* Does aiming independently from movement feel natural?
* Is the character readable from the selected camera?
* Do sprint, jump, and dodge have distinct uses?
* Is the dodge useful without invulnerability?
* Does stamina create useful limits without slowing the game too much?
* Does the pistol already communicate enough impact?
* Is respawning fast enough for the intended pace?

### Completion Criteria

* keyboard and mouse feel usable; controller support is optional only if negligible in effort;
* movement has no major delay or unwanted inertia;
* aiming remains stable while moving;
* sprint, jump, and dodge are clearly different;
* the pistol works against simple targets;
* an unarmoured target dies after approximately six to eight pistol hits;
* hit feedback is clear;
* death and respawn work reliably.

## Gate A — Basic Control Quality

Milestone 2 may begin only if:

* movement feels responsive;
* aiming feels natural;
* sprinting, jumping, and dodging support the intended pace;
* at least one camera variant remains readable and both planned variants remain testable;
* pistol combat is understandable;
* testing can continue without basic control frustration.

If this gate fails, movement and camera tuning continue before vehicles are expanded.

## Milestone 2 — Vehicle Handling

### Goal

Prove that driving is enjoyable enough to become one of the project’s main gameplay foundations.

### Included

* vehicle entry;
* vehicle exit;
* keyboard driving;
* controller driving only if negligible in effort;
* separate handbrake;
* slower reverse speed;
* fixed camera distance during vehicle driving;
* long straight road in the test area;
* compact car;
* saloon;
* van;
* refuse truck;
* basic vehicle health;
* basic collision behaviour;
* damage when leaving at speed;
* simple theft of stationary or slow vehicles.

Physical vehicle doors are not required.

### Questions to Answer

* Is driving fun without combat?
* Does acceleration feel satisfying?
* Is high-speed travel readable?
* Is the handbrake useful for controlled drifting?
* Can handbrake turns be learned and repeated?
* Do the vehicle classes feel different?
* Does the refuse truck feel heavy and powerful?
* Are collisions forceful without becoming random?
* Does the camera provide enough forward visibility?

### Completion Criteria

* all four vehicle classes are functional;
* at least three feel clearly different;
* compact car feels agile and fragile;
* saloon feels balanced;
* van feels heavier and more durable;
* refuse truck feels slow, heavy, and powerful;
* handbrake turns are controllable;
* straight-line driving feels satisfying;
* collisions do not regularly destroy control;
* entering and leaving vehicles supports a fast gameplay rhythm.

## Gate B — Vehicle Feel

Vehicle combat may begin only if:

* driving is enjoyable by itself;
* the camera supports high speed;
* different vehicles create different choices;
* drifting and braking are controllable;
* vehicle handling can be tuned without obvious structural problems.

If this gate fails after several tuning rounds, the vehicle approach must be reconsidered before further expansion.

## Milestone 3 — Vehicle Combat and Destruction

### Goal

Validate the interaction between players on foot, vehicles, weapons, impacts, burning, and explosions.

### Included

* vehicle impacts against characters;
* survivable side contact;
* vehicle impact outcomes as defined canonically in [`GDD/16_PROTOTYPE_SCOPE.md`](GDD/16_PROTOTYPE_SCOPE.md);
* shotgun;
* rocket launcher;
* armour;
* three weapon slots;
* weapon pickups;
* ammunition pickups;
* medkits;
* dropped weapons after death;
* vehicle damage states;
* intact state;
* damaged state;
* heavily damaged state;
* burning state;
* exploded state;
* burning damage over time;
* escape opportunity from normally burning vehicles;
* rocket hits causing rapid destruction;
* nearby explosion damage;
* unrestricted chain reactions;
* simple destructible city objects.

### Questions to Answer

* Can a foot player avoid vehicles through skill?
* Does a roadkill feel powerful but readable?
* Is the difference between a scrape and a full impact clear?
* Can players on foot threaten vehicles?
* Is the shotgun only dominant at close range?
* Is the rocket launcher useful without becoming the only relevant weapon?
* Are burning vehicles readable as a tactical threat?
* Are chain reactions satisfying and understandable?
* Can ten nearby vehicles explode naturally in sequence?

### Completion Criteria

* lethal and non-lethal vehicle contacts follow the canonical scope rule and are clearly distinguishable;
* the shotgun can kill at very close range;
* rockets reliably threaten normal vehicles;
* armour works as a separate protective layer;
* vehicle damage states are readable;
* normally burning vehicles allow a short escape window;
* large chain reactions work;
* explosion behaviour does not regularly destabilise the simulation;
* streetlights, traffic lights, or mailboxes can be knocked over or thrown aside.

## Gate C — Impact and Destruction

The full FFA loop may begin only if:

* vehicle impacts feel fair and powerful;
* weapon roles are distinct;
* explosions have strong audiovisual impact;
* burning vehicles create useful tactical pressure;
* chain reactions are reliable;
* foot combat remains relevant;
* vehicle combat does not feel random or unavoidable.

## Milestone 4 — Complete Free-for-All Loop

### Goal

Turn the mechanics into a complete timed Free-for-All round.

### Included

* Free-for-All rules;
* round timer;
* highest score at timer expiry determines victory;
* no early FFA termination through a score limit;
* configurable round duration;
* unlimited respawns;
* clinic respawn points;
* pistol and two magazines after respawn;
* world item spawn slots;
* weapon spawns;
* armour spawns;
* medkit spawns;
* creative kill categories;
* score bonuses;
* kill announcements;
* simple HUD;
* rudimentary minimap;
* results screen;
* immediate round restart.

### Initial Kill Categories

* standard kill;
* roadkill;
* close-range shotgun kill;
* rocket kill;
* vehicle explosion kill;
* chain-reaction kill;
* environmental kill;
* police-assisted kill.

Exact values remain tuning variables.

### Questions to Answer

* Does a round create continuous action?
* Do pickups create movement through the map?
* Does death return the player quickly to play?
* Do dropped weapons create new opportunities?
* Do creative kill bonuses change player behaviour?
* Does the round remain interesting for the selected test duration?
* Does the player want to restart immediately?

### Completion Criteria

* a round starts, runs, ends, and restarts reliably;
* score feedback is understandable;
* respawns avoid immediate combat where practical;
* players return with the intended basic equipment;
* dropped weapons can be recovered by others;
* creative kill categories trigger correctly;
* the results screen shows placement, score, kills, and deaths;
* the round produces multiple viable ways to earn points.

## Milestone 5 — Combat Bots

### Goal

Make the complete Free-for-All loop testable by one player.

### Included

* configurable bot count from zero to eleven;
* maximum of twelve combatants;
* bots fight each other;
* bots do not permanently prioritise the human player;
* bots move and aim;
* bots use pistol, shotgun, and rocket launcher;
* bots collect weapons;
* bots collect armour;
* bots collect medkits where useful;
* bots enter vehicles;
* bots steal available vehicles;
* bots drive with acceptable competence;
* bots ram opponents;
* bots leave burning vehicles;
* bots use rockets against vehicles;
* bots rarely pull drivers from slow vehicles;
* bots respawn under the same rules as the player.

### Questions to Answer

* Do bots create believable FFA pressure?
* Do they actively seek points?
* Do they fight each other often enough?
* Can they use vehicles without constant collisions?
* Do they create varied situations?
* Do they use available equipment?
* Does bot count change difficulty naturally?
* Is the player challenged without feeling specifically targeted?

### Completion Criteria

* one player can complete a full FFA match against bots;
* bots use weapons and pickups;
* bots use vehicles;
* bots fight each other;
* bots leave burning vehicles;
* bots can create roadkills and explosions;
* bots remain imperfect and readable;
* bot count can be changed without redesigning the game.

## Gate D — Replayable FFA

Population and police may begin only if:

* bots sustain a complete match;
* the FFA loop remains interesting for the selected test duration;
* creative kills occur regularly;
* bots create pressure without overwhelming the player;
* the match produces an immediate desire to replay.

If this gate fails, revise:

* bot priorities;
* map flow;
* respawning;
* weapon balance;
* scoring;
* vehicle frequency;
* item placement.

## Milestone 6 — Civilians, Traffic, and Police

### Goal

Make the city feel alive and reactive without building a complete simulation.

### Included

* pedestrian civilians;
* civilian drivers;
* simple civilian fleeing;
* drivers attempting vehicle escape;
* temporary evacuation of dangerous areas;
* quick repopulation after danger ends;
* dynamic traffic routes;
* periodic route recalculation;
* simple local avoidance;
* reversing when blocked;
* simple rerouting;
* controlled removal of permanently stuck vehicles outside view;
* foot police;
* police vehicles;
* wanted level 1;
* simple crime detection;
* personal pursuit;
* global police-unit maximum;
* multiple offenders competing for limited police attention.

### Questions to Answer

* Does the city feel alive?
* Does traffic support rather than block gameplay?
* Do civilians react clearly?
* Do dangerous areas empty temporarily?
* Does the city recover after violence?
* Do common traffic blockages resolve?
* Does police pressure add excitement?
* Does police remain secondary to combatants?
* Does the global police limit work during multi-bot chaos?

### Completion Criteria

* civilians flee nearby danger;
* traffic follows plausible routes;
* common blockages recover;
* permanently stuck vehicles do not accumulate indefinitely;
* dangerous areas repopulate;
* police pursue offenders;
* the police-unit maximum is respected;
* police do not become the dominant opponent;
* city behaviour remains understandable.

## Milestone 7 — Main Prototype Map

### Goal

Combine the core systems in a proper multi-block city environment.

### Included

* several connected city blocks;
* long main road running primarily from top to bottom;
* secondary streets;
* central junction;
* open industrial or scrapyard area;
* neon commercial area;
* small park or plaza;
* bridge, elevated road, or underpass;
* natural map boundaries;
* limited choke points;
* limited jumps or shortcuts;
* multiple clinic spawn points;
* parked vehicles;
* traffic routes;
* weapon and item spawn slots;
* vehicle spawn slots;
* non-enterable buildings;
* simple destructible city objects.

### Functional Areas

#### Main Road

Used for:

* high-speed driving;
* long pursuits;
* refuse truck gameplay;
* police chases;
* vehicle collisions;
* large chain reactions.

#### Central Junction

Used for:

* recurring conflicts;
* traffic interaction;
* rocket launcher opportunities;
* multi-directional attacks;
* police involvement.

#### Side-Street Network

Used for:

* compact vehicles;
* foot combat;
* shotgun encounters;
* vehicle theft;
* short escape routes.

#### Industrial or Scrapyard Area

Used for:

* open vehicle combat;
* refuse truck access;
* parked vehicle clusters;
* smoke and industrial lighting;
* explosion and chain-reaction tests.

#### Neon Commercial Area

Used for:

* strong visual identity;
* pedestrian density;
* traffic;
* police presence;
* readable storefront and lighting tests.

#### Park or Plaza

Used for:

* foot combat;
* clear sight lines;
* reduced traffic;
* pistol and shotgun encounters;
* pedestrian reactions.

### Questions to Answer

* Does the map support different forms of play?
* Is the main road long enough?
* Does the selected camera variant remain readable everywhere?
* Do the areas feel distinct but connected?
* Is the map large enough for twelve combatants?
* Is it still compact enough for the selected timed-round duration?
* Do pickups and clinics create useful movement?
* Does the map feel like a city instead of a combat arena?

### Completion Criteria

* driving routes are understandable;
* combat spaces support different weapons and vehicles;
* players can relocate quickly;
* the main road supports sustained high-speed travel;
* clinic placement avoids repeated immediate deaths;
* natural boundaries explain the map edge;
* navigation remains readable;
* no area becomes the only optimal place to fight.

## Milestone 8 — Visual and Audio Integration

### Goal

Prove that the intended final identity works during active gameplay.

### Included

* simplified intentional geometry;
* final-leaning materials;
* wet asphalt;
* neon lighting;
* strong contrast;
* smoke;
* steam;
* dirt;
* soot;
* headlights;
* police lights;
* old vehicle presentation;
* coherent material treatment;
* consistent asset scale;
* player highlighting;
* enemy highlighting;
* simple building occlusion;
* one music track;
* weapon sounds;
* engine sounds;
* hit sounds;
* vehicle impact sounds;
* explosion sounds;
* basic city ambience;
* basic police audio.

### Questions to Answer

* Does the game clearly communicate Neon over Dirt?
* Is action readable on wet reflective surfaces?
* Does neon improve atmosphere without hiding gameplay?
* Does the player remain visible?
* Are enemies readable?
* Do the selected raw-material assets appear usable and coherent after only a light shared style pass?
* Does simple geometry appear intentional?
* Do impacts and explosions have enough audiovisual power?
* Does the style work during fast driving and chaos?

### Completion Criteria

* the city appears visually coherent;
* asset sources do not create obvious seams;
* the player remains readable;
* explosions remain understandable;
* wet-road reflections do not hide hazards;
* the visual direction works during movement;
* audio gives roadkills, weapon hits, and explosions sufficient weight;
* the limited asset adaptation workflow appears reproducible.

## Gate E — Visual Identity

Stress testing may begin only if:

* the style works in motion;
* the `Fixed Camera` and `Rotatable Camera` variants have been compared against the scope criteria and at least one supports fast play;
* assets appear consistent;
* the intended final quality is visible;
* the visual approach appears scalable;
* routine asset adaptation does not require continuous manual human work.

If this gate fails, revise:

* camera;
* materials;
* lighting;
* asset sources;
* proportions;
* environmental density;
* effect intensity.

## Milestone 9 — Live Tuning and Stress Testing

### Goal

Determine whether the complete prototype remains playable and technically viable under maximum intended load.

### Required Live-Tuning Variables

* walking speed;
* sprint speed;
* stamina cost;
* stamina regeneration;
* dodge distance;
* weapon damage;
* weapon spread;
* reload time;
* ammunition amounts;
* vehicle acceleration;
* top speed;
* steering;
* braking;
* handbrake strength;
* reverse speed;
* vehicle health;
* burning duration;
* explosion radius;
* explosion force;
* bot count;
* bot accuracy;
* traffic density;
* pedestrian density;
* police maximum;
* respawn delay;
* score values;
* camera distance;
* rotation sensitivity for the `Rotatable Camera`.

### Maximum Stress Scenario

* one human player;
* eleven combat bots;
* civilian pedestrians;
* civilian traffic;
* foot police;
* police vehicles;
* multiple damaged vehicles;
* multiple burning vehicles;
* simultaneous explosions;
* unrestricted chain reactions;
* smoke;
* wet-road lighting;
* active HUD;
* active minimap.

### Questions to Answer

* Does input remain responsive?
* Does vehicle physics remain stable?
* Do bots continue functioning?
* Does traffic recover from blockages?
* Does police behaviour remain understandable?
* Is the action visually readable?
* Can large chain reactions occur without breaking the game?
* Are major performance costs manageable?
* Can the prototype continue toward multiplayer without obvious full rewrites?

### Completion Criteria

* no frequent runtime errors;
* no systematic AI collapse;
* no permanent city-wide traffic deadlock;
* input remains responsive;
* vehicle collisions remain stable;
* explosions do not regularly break the simulation;
* visual feedback remains understandable;
* the main performance bottlenecks are identified;
* the prototype is stable enough for a formal review.

Exact frame-rate targets, resolution, CPU, memory, and weaker minimum test profile remain to be defined. Windows Standalone is the prototype target, and the Human Developer PC with Radeon RX 6800 XT is the primary reference system.

## Gate F — Technical Viability

The final prototype review may begin only if:

* the full combined stress test is complete;
* stability and performance evidence is recorded;
* input remains responsive;
* vehicle behaviour, bots, traffic, destruction, HUD, and visual presentation remain usable together;
* the evidence is sufficient to support a later continuation decision.

Failure of this gate does not authorise architecture changes. It identifies constraints and open architecture questions for a separately authorised phase.

## Milestone 10 — Final Prototype Review

### Goal

Decide whether the project should proceed beyond the first prototype.

### Review Areas

#### Core Feel

* movement;
* aiming;
* sprint;
* jump;
* dodge;
* pistol;
* shotgun;
* rocket launcher;
* hit feedback.

#### Vehicle Feel

* acceleration;
* steering;
* braking;
* handbrake;
* vehicle differences;
* impact;
* entry and exit;
* theft.

#### Combat Interaction

* foot player versus vehicle;
* roadkill fairness;
* vehicle counterplay;
* burning vehicles;
* explosions;
* chain reactions.

#### Match Quality

* FFA pacing;
* bot behaviour;
* creative scoring;
* respawns;
* pickup placement;
* replayability.

#### City Quality

* traffic;
* civilians;
* police;
* readability;
* map flow;
* density.

#### Visual Identity

* camera;
* Neon over Dirt;
* wet roads;
* lighting;
* asset consistency;
* readability in motion.

#### Technical Viability

* stability;
* AI;
* physics;
* traffic;
* performance;
* scalability.

## Final Prototype Decision

### Go

Proceed to multiplayer planning if:

* movement and driving are enjoyable;
* foot-versus-vehicle interaction is fair;
* impacts and explosions are satisfying;
* bots sustain replayable FFA rounds;
* the visual identity works in motion;
* assets can be sourced, reused, and lightly adapted consistently;
* the stress scenario is technically manageable.

### Iterate

Continue prototype work if:

* the foundation is promising;
* specific systems require tuning;
* the main concept remains valid;
* problems appear solvable without structural redesign.

### Pivot

Change a major direction if:

* camera and driving remain incompatible;
* vehicle combat cannot be made fair;
* the style is not scalable;
* bots cannot support the required gameplay;
* the prototype is only enjoyable after removing a core pillar.

### No-Go

Stop or replace the concept if repeated iteration cannot produce:

* satisfying movement;
* enjoyable driving;
* strong impact;
* fair vehicle interaction;
* replayable bot-supported FFA;
* a coherent visual identity;
* a feasible production model.

## Recommended Implementation Order

1. Complete pre-download documentation and selection steps 1 through 4
2. Obtain the applicable authorisations and complete Asset and Style Preflight steps 5 through 8
3. Technical and visual preflight
4. Player movement and pistol combat
5. Vehicle handling
6. Vehicle combat and destruction
7. Complete FFA loop
8. Combat bots
9. Civilians, traffic, and police
10. Main prototype map
11. Visual and audio integration
12. Live tuning and stress testing
13. Final prototype review
14. Decision on multiplayer planning

## Scope Reduction Order

If effort becomes excessive, reduce first:

1. UI styling;
2. results-screen detail;
3. audio variety;
4. civilian visual variety;
5. police visual variety;
6. number of destructible object types;
7. building variation;
8. secondary visual effects;
9. map size;
10. bot tactical sophistication.

Do not reduce before the prototype decision:

* player-control quality;
* aiming quality;
* driving quality;
* handbrake behaviour;
* foot-versus-vehicle interaction;
* collision impact;
* weapon impact;
* vehicle damage;
* burning;
* explosions;
* chain reactions;
* complete FFA loop;
* bot support;
* camera readability;
* Neon over Dirt;
* asset consistency.

## Authorisation Boundary

This roadmap defines implementation order and validation gates.

It does not authorise:

* Unity project creation;
* technical architecture;
* asset purchases;
* asset downloads or imports;
* creation of the minimal Unity test environment;
* provisional render-pipeline selection for the test environment;
* Asset and Style Preflight or Style Slice execution;
* asset production or technical integration;
* external tool integration;
* Blender workflow setup;
* implementation;
* multiplayer development.

Those actions require separate approval through the Studio Operating System.
