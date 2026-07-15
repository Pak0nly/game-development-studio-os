# Prototype Scope

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Canonical prototype design scope
**Validation State:** Needs Prototype Validation
**Approval Status:** Pending Human Developer review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14
**Target Platform:** Windows Standalone
**Reference System:** Human Developer PC with Radeon RX 6800 XT; weaker minimum test profile still to be defined

## Purpose

The first prototype must determine whether the project’s core experience is strong enough to justify further development.

It must validate:

* responsive on-foot movement;
* independent aiming;
* driving and handbrake drifting;
* switching between foot combat and vehicles;
* roadkills and vehicle counterplay;
* weapon impact;
* vehicle damage, fire, and explosions;
* unrestricted chain reactions;
* bot-driven Free-for-All gameplay;
* basic city population and police reaction;
* camera readability;
* the visual identity “Neon over Dirt”;
* asset usability and visual cohesion;
* stability under the intended prototype load.

The prototype is not intended to validate the full game, multiplayer infrastructure, factions, economy, story, or long-term progression.

## Central Prototype Question

> Can a solo-testable Free-for-All experience built around movement, vehicle theft, driving, shooting, roadkills, explosions, bots, police pressure, and a reactive city create a distinctive, readable, and replayable elevated-camera urban action experience?

## Core Experience

The player should be able to:

1. Spawn with basic equipment.
2. Move through the city on foot.
3. Find weapons, armour, health, or vehicles.
4. Steal and abandon vehicles.
5. Fight bots using firearms, melee, vehicles, and the environment.
6. Cause police attention and local city disruption.
7. Create direct and creative kills.
8. Respawn quickly after death.
9. Accumulate score during a short round.
10. Immediately restart another round.

## Required Prototype Scope

## 1. Game Mode

The prototype includes one game mode:

### Free-for-All Deathmatch

* one human player;
* zero to eleven configurable combat bots;
* maximum of twelve active combatants;
* round duration is a tuning value marked `Needs Prototype Validation`;
* unlimited respawns;
* the match ends only when the timer expires;
* the combatant with the highest score at timer expiry wins;
* reaching a score limit never ends an FFA match early;
* respawn at a suitable clinic selected through weighted randomness;
* clinics close to active combat, nearby enemies, or severe traffic danger are strongly deprioritised;
* exact clinic weighting and exclusion thresholds are `Needs Prototype Validation`;
* creative kill bonuses;
* simple results screen;
* immediate round restart.

Bots must fight each other and must not permanently prioritise the human player.

## 2. Player Movement

The prototype must include:

* keyboard and mouse input;
* controller support and remappable controls are optional only if they create negligible additional effort;
* movement and independent aiming;
* sprint;
* jump;
* dodge roll;
* stamina use for sprint and dodge;
* fast stamina regeneration;
* no regeneration delay;
* shooting interruption during sprint, jump, and dodge;
* increased weapon spread while moving;
* no invulnerability during dodge;
* fist combat as a permanent fallback.

Movement must feel direct, responsive, and readable with the first-prototype `Fixed Camera`. Player control and aiming must not prevent a later `Rotatable Camera` comparison.

## 3. Health, Armour, and Healing

The prototype must include:

* health bar;
* separate armour bar;
* armour absorbing damage before health;
* no automatic health regeneration;
* clinic healing;
* medkits;
* medkits restoring approximately fifty percent health;
* medkits usable while walking;
* medkits unavailable while sprinting;
* visual low-health feedback;
* no low-health movement penalty;
* no low-health accuracy penalty.

A clean, direct vehicle impact at high speed is lethal, regardless of armour. Low-speed impacts, glancing contacts, and pushing cause damage and may knock the combatant down, but are not automatically lethal. Exact speed, angle, and contact thresholds are `Needs Prototype Validation`.

## 4. Weapons and Inventory

The prototype includes exactly three weapon slots.

Required weapons:

* pistol;
* shotgun;
* rocket launcher.

Required rules:

* player respawns with a pistol and two magazines;
* weapons can be found as world pickups;
* ammunition can be found separately;
* armour and medkits can spawn in the world;
* all carried weapons drop on death;
* dropped weapons can be collected immediately;
* bots use the same weapon and pickup rules as the player;
* heavy ammunition must be less common than pistol ammunition.

Reloading is interrupted by shooting, weapon switching, melee attacks, dodging, and entering a vehicle. It is not interrupted by normal movement, sprinting, or receiving damage.

Initial weapon expectations:

* pistol defeats an unarmoured target in approximately six to eight hits;
* shotgun can kill at very close range;
* rocket launcher is primarily effective against vehicles and grouped targets.

Exact values remain tuning variables.

## 5. Vehicles

The prototype must include four vehicle classes:

* compact car;
* saloon;
* van;
* refuse truck.

Each vehicle must differ clearly in:

* acceleration;
* top speed;
* steering;
* durability;
* mass;
* collision behaviour;
* braking;
* handbrake response.

Required vehicle features:

* enter vehicle;
* leave vehicle;
* drive with keyboard; controller input is optional only if negligible in effort;
* separate handbrake;
* slower reverse speed;
* fixed camera distance during vehicle driving;
* steal stationary vehicles;
* steal slow-moving occupied vehicles;
* take damage when leaving at speed;
* bots can enter and steal vehicles;
* bots can drive vehicles;
* bots can ram opponents;
* bots leave burning vehicles;
* bots can use the rocket launcher against vehicles.

When a vehicle is taken, its former owner exits and flees. The former owner does not chase or attack the combatant. Retaliation or pursuit is a deferred optional concept outside the prototype.

Physical vehicle doors are not required.

Seat capacity differences are not required.

Vehicle repair is not included.

Motorcycles are not included.

## 6. Vehicle Damage and Destruction

Required vehicle states:

* intact;
* damaged;
* heavily damaged;
* burning;
* exploded.

Required behaviour:

* damaged vehicles show clear visual feedback;
* heavily damaged vehicles become visibly unsafe;
* burning vehicles receive unavoidable damage over time;
* normal burning provides a short escape opportunity;
* rocket hits may skip directly to destruction;
* nearby explosions damage other vehicles;
* burning and exploding vehicles can trigger further vehicles;
* chain reactions must not have a fixed artificial limit;
* ten closely parked vehicles must be able to explode as one natural chain reaction.

Vehicle collision damage affects the vehicle, not the occupants directly.

Passenger injury from normal collisions is not required.

## 7. Foot Player Versus Vehicle

The prototype must validate fair and readable interaction between players on foot and vehicles.

Required rules reference the canonical vehicle-impact statement in [Health, Armour, and Healing](#3-health-armour-and-healing):

* lethal and non-lethal contact outcomes follow that statement;
* foot players can evade vehicles through movement and timing;
* vehicles can be threatened by rockets, explosions, and environmental hazards;
* vehicles must be powerful without making foot combat irrelevant;
* vehicle impact feedback must be visually and audibly strong.

## 8. Combat Bots

Bots must support complete solo testing.

Required bot behaviour:

* seek and engage other combatants;
* use pistol, shotgun, and rocket launcher;
* collect visible weapons;
* collect armour;
* collect medkits where useful;
* enter vehicles;
* steal available vehicles;
* drive with acceptable competence;
* ram opponents;
* avoid remaining inside burning vehicles;
* use rockets against vehicles;
* rarely attempt to pull drivers from slow vehicles;
* respawn using the same rules as the player.

Bots do not require:

* advanced long-term planning;
* human-like deception;
* coordinated squad tactics;
* persistent memory;
* complex personalities.

Believable action is more important than advanced intelligence.

## 9. Civilians and Traffic

Required civilian roles:

* pedestrian;
* civilian driver.

Required civilian behaviour:

* flee from nearby danger;
* drivers prefer vehicle escape where plausible;
* pedestrians flee on foot;
* areas around violence temporarily empty;
* civilians return after the area becomes safe;
* civilians do not require individual schedules or personalities.

Required traffic behaviour:

* dynamic route selection;
* periodic route recalculation;
* simple local avoidance;
* reversing when blocked;
* simple rerouting;
* controlled removal of permanently stuck vehicles outside direct player view;
* traffic density adjustable during testing.

Destroyed or long-abandoned vehicles are replaced after a delay to maintain an approximate target population for each vehicle class. Replacements must not appear inside the player's current visible area, and spawn points close to active combat should be avoided. Exact delays, target counts, abandonment rules, and visibility checks are `Needs Prototype Validation`.

The prototype does not require a complete traffic simulation.

## 10. Police

The prototype includes only wanted level 1.

Required police behaviour:

* simple crime detection;
* personal pursuit of offenders;
* foot officers;
* police vehicles;
* global maximum of active police units;
* multiple offenders compete for limited police attention;
* police create additional pressure but are not the main opponent.

The prototype does not include:

* witness simulation;
* civilian reporting;
* delayed alarms;
* multiple wanted levels;
* bribery;
* police territory;
* military escalation;
* faction attention.

## 11. Scoring and Creative Kills

The prototype must reward more than standard weapon kills.

Initial scoring categories:

* standard kill;
* roadkill;
* close-range shotgun kill;
* rocket kill;
* vehicle explosion kill;
* chain-reaction kill;
* environmental kill;
* police-assisted kill.

Required feedback:

* clear score increase;
* readable kill category;
* strong arcade-style callout;
* prominent feedback for rare or spectacular kills.

Exact score values remain live-tuning variables.

## 12. Camera

The first prototype uses `Fixed Camera`: fixed orientation, fixed elevation angle, and fixed distance. It permits no panning, independent translation, automatic zoom, speed-based zoom, or variable camera distance.

A later comparison version is explicitly required but is outside first-prototype implementation scope. Its `Rotatable Camera` may add only free rotation around the player while retaining the same fixed elevation and fixed distance. It may not add panning, independent translation, automatic or speed-based zoom, variable distance, automatic rotation, or stepped 90-degree rotation.

Evaluate the fixed camera for orientation while moving on foot, aiming and combat readability, driving feel, building occlusion, readability during chaotic situations, and fit with the intended visual identity. The architecture must separate camera policy from player control and world aiming so the later comparison does not require a gameplay rewrite.

The fixed camera requires a simple building-occlusion solution. The later rotatable comparison must be able to reuse or replace that solution behind the same boundary. This scope defines the desired readable outcome, not its technical implementation.

The building-occlusion solution may use:

* prepared fade zones;
* roof fading;
* wall fading;
* player silhouette.

The simplest reliable solution should be used.

## 13. Prototype Map

The main prototype map must be larger than one city block.

Required structure:

* several connected city blocks;
* long main road running primarily from top to bottom;
* secondary roads;
* central junction;
* open industrial or scrapyard area;
* neon commercial area;
* small park or plaza;
* bridge, elevated road, or underpass;
* predominantly open layout;
* limited choke points;
* limited jumps or shortcuts;
* natural map boundaries;
* several clinic respawn points;
* parked vehicles;
* dynamic traffic;
* item spawn slots;
* vehicle spawn slots.

Natural map boundaries may include:

* buildings;
* walls;
* rail lines;
* water;
* construction zones;
* blocked roads;
* industrial structures.

Invisible walls should only support these visible boundaries.

## 14. Separate Test Area

A small internal test area must exist in addition to the main map.

It is used for:

* movement testing;
* aiming testing;
* weapon damage testing;
* acceleration testing;
* braking distance;
* handbrake drift testing;
* vehicle comparison;
* vehicle impact testing;
* burning duration;
* explosion radius;
* chain-reaction testing;
* live tuning.

The test area does not require final-quality art.

## 15. Visual Direction

The prototype must already test the intended visual identity.

Required visual elements:

* simplified 3D geometry;
* slightly exaggerated proportions;
* clear silhouettes;
* final-leaning materials;
* wet asphalt;
* neon lighting;
* strong light contrast;
* smoke;
* steam;
* dirt;
* soot;
* old vehicles;
* headlights;
* police lights;
* non-enterable buildings;
* coherent material treatment;
* consistent asset scale.

The guiding art principle is:

> Neon over Dirt.

Neon must enhance an old, dirty, industrial city rather than replace it.

The prototype must deliberately support both cleaner and more heavily worn or dirty areas while keeping them within one coherent city identity.

The production principle through completion of the first prototype is `Buy, reuse, adapt lightly.` The planned primary source is the Humble Bundle `Cosmos Eclipse Game Dev Assets & Tools Bundle — Unreal, Unity, Godot`, subject to separate purchase and download approval.

`1950s NYC`, `Cyberpunk Port City`, and `Fuyoh Cyberpunk Diner` are the first-priority packages for suitability review. Selected assets are treated as raw material and may receive a light shared style pass. The Style Slice and prototype must explicitly prove asset usability and visual cohesion.

Before import, the licence, Unity support, render-pipeline compatibility, shaders, materials, scale, textures, LODs, colliders, pivots, modularity, performance, and adaptation effort must be documented. No generative derivation, training, or use as a generative reference is permitted without a separate licence review.

Original AI-assisted 3D production with Claude and Blender is deferred until after the first prototype, while remaining a later option for unique or missing project-specific assets. The separate Cyberpunk Gigapack is not a current purchase; the Gumroad coupon is assessed only after bundle inventory and overlap review.

## 16. Characters and Asset Variety

Required character categories:

* player/combatant;
* FFA bot;
* civilian;
* police officer.

A shared technical base model may be used.

Variation may be created through:

* colours;
* simple clothing changes;
* silhouette changes;
* limited accessories.

The prototype does not require:

* unique faces;
* advanced facial animation;
* cloth simulation;
* extensive body-type variety;
* dialogue animation.

## 17. Environment Objects

Required destructible city objects may include:

* streetlights;
* traffic lights;
* mailboxes.

Required behaviour:

* react to impact;
* fall over or be thrown aside;
* remain destroyed until round end.

The prototype does not require:

* detailed fracture simulation;
* repair;
* persistent destruction;
* complex debris systems.

## 18. User Interface

The prototype HUD must permanently display:

* health;
* armour;
* stamina;
* current weapon;
* ammunition;
* three weapon slots;
* score;
* wanted status;
* remaining round time;
* rudimentary minimap.

Additional required UI:

* kill feedback;
* creative kill category;
* score bonus;
* round-end placement;
* kills;
* deaths;
* basic results information limited to placement, kills, and deaths.

Initial UI may use fixed slots.

A controller weapon wheel is deferred.

Prototype accessibility minimum:

* separate volume controls;
* important UI information must not rely exclusively on colour;
* basic HUD and text readability.

Remappable controls and controller support are not required and may be included only if negligible in effort. There is no prototype voice-over, so subtitles are not a prototype requirement.

## 19. Audio

Required audio scope:

* one music track;
* pistol sound;
* shotgun sound;
* rocket launcher sound;
* hit sounds;
* vehicle impact sounds;
* explosion sounds;
* one engine sound per vehicle class;
* basic city ambience;
* basic police audio.

Audio variety is low priority.

Impact quality is not low priority.

Roadkills, weapon hits, and explosions must have strong, bass-heavy feedback.

## 20. Live-Tuning Variables

The following values must remain easy to adjust during testing:

* walking speed;
* sprint speed;
* stamina cost;
* stamina regeneration;
* dodge distance;
* weapon damage;
* weapon spread;
* reload time;
* ammunition amount;
* vehicle acceleration;
* vehicle top speed;
* steering;
* braking;
* handbrake strength;
* reverse speed;
* vehicle durability;
* burning duration;
* explosion radius;
* explosion force;
* bot count;
* bot accuracy;
* traffic density;
* civilian density;
* police maximum;
* respawn delay;
* score values;
* camera distance;

## 21. Stress Test

The final prototype stress scenario includes:

* one human player;
* eleven combat bots;
* civilian pedestrians;
* civilian traffic;
* foot police;
* police vehicles;
* several damaged vehicles;
* several burning vehicles;
* simultaneous explosions;
* unrestricted chain reactions;
* smoke;
* wet-road lighting;
* active HUD;
* active minimap.

The prototype must remain:

* controllable;
* readable;
* stable enough for continued development;
* free from systematic AI collapse;
* free from permanent city-wide traffic deadlock;
* free from frequent runtime errors.

Exact frame-rate targets depend on the provisional platform and reference hardware decision.

## Canonical Prototype Gates

The single canonical gate sequence and all gate completion checks are maintained in [`PROTOTYPE_ROADMAP.md`](../PROTOTYPE_ROADMAP.md). This scope does not redefine them.

The sequence is: `Gate A — Basic Control Quality`, `Gate B — Vehicle Feel`, `Gate C — Impact and Destruction`, `Gate D — Replayable FFA`, `Gate E — Visual Identity`, and `Gate F — Technical Viability`.

## Explicitly Excluded From the First Prototype

The first prototype does not include:

* network multiplayer;
* public matchmaking;
* private online lobbies;
* LAN multiplayer;
* Team Deathmatch;
* Faction War;
* factions;
* HQs;
* territory control;
* building capture;
* influence networks;
* faction economy;
* upkeep;
* faction NPC expansion;
* income transport;
* purchasable lives;
* teammate revival;
* higher wanted levels;
* police bribery;
* witness systems;
* military;
* enterable buildings;
* building destruction;
* persistent world destruction;
* vehicle repair;
* motorcycles;
* vehicle seat simulation;
* physical vehicle doors;
* character classes;
* specialised loadouts;
* story campaign;
* dialogue systems;
* radio stations;
* dynamic music;
* day-and-night cycle;
* Zombie Outbreak;
* Golden Car;
* Most Value Collected;
* King of the Road;
* full spectator systems;
* crossplay;
* console support.

## Scope Reduction Order

If implementation effort becomes excessive, reduce in this order:

1. UI styling;
2. results-screen detail;
3. audio variety;
4. civilian visual variety;
5. police visual variety;
6. number of destructible object types;
7. building variation;
8. secondary VFX;
9. map size;
10. bot tactical sophistication.

Do not reduce before the prototype decision:

* player-control quality;
* aiming quality;
* vehicle feel;
* handbrake behaviour;
* foot-versus-vehicle interaction;
* collision impact;
* weapon impact;
* vehicle fire and explosions;
* chain reactions;
* complete FFA loop;
* bot support;
* camera readability;
* wet-road and neon identity;
* asset consistency.

## Blocking Decisions Before Implementation Authorisation

The prototype platform, internal working title, future repository separation, Unity 6.3 LTS baseline, and primary reference system are closed decisions. Exact CPU, memory, resolution, frame-rate, weaker minimum profile, camera tuning, vehicle tuning, AI behaviour, navigation outcomes, traffic behaviour, damage thresholds, and performance targets remain `Needs Prototype Validation` or require later definition.

Technical architecture, exact package and import selection, networking, asset acquisition, and pipeline implementation are later separately authorised work, not decisions that this design-scope document may resolve.

These decisions are not part of this GDD document.

They must be resolved during prototype planning and technical architecture review.

## Final Scope Assessment

The first prototype is intentionally substantial.

It includes several interacting systems:

* on-foot movement;
* weapons;
* vehicles;
* destruction;
* bots;
* traffic;
* civilians;
* police;
* a multi-block map;
* visual style validation;
* stress testing.

This scope is acceptable only if development follows strict milestone gates.

Population, police, and full visual integration must not expand before movement, driving, combat, and destruction already demonstrate fun.

The prototype succeeds when it proves that the core action loop is enjoyable, readable, reproducible, and technically viable.

It fails when repeated tuning cannot produce satisfying movement, vehicle control, combat impact, fair vehicle interaction, a coherent camera, or usable and visually cohesive assets through the bounded sourcing and light-adaptation model.
