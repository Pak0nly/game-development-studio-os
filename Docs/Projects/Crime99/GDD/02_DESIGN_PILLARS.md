# Design Pillars

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Prototype scope with deferred extensions
**Validation State:** Needs Prototype Validation
**Approval Status:** Pending Human Developer review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This document defines the project’s primary design pillars.

The pillars are not feature lists.

They are decision rules used to:

* evaluate new ideas;
* resolve conflicts between systems;
* prioritise scope;
* protect the project identity;
* guide prototype validation;
* reject features that do not support the intended experience.

A feature should normally support at least one pillar and must not significantly damage another without explicit justification.

## Pillar Priority

The pillars are ordered by practical design importance.

1. Steal, Escalate, Escape
2. Vehicles Are Temporary Tools
3. Players Are the Main Threat
4. Creative Chaos Is Rewarded
5. The City Fights Back
6. Neon over Dirt
7. Solo-Testable by Default

The order does not mean that lower pillars are optional.

It indicates which principles should dominate when trade-offs cannot be avoided.

## Pillar 1 — Steal, Escalate, Escape

## Statement

> Players should be able to obtain useful tools quickly, create trouble, attract pressure, and escape or exploit the consequences.

## Intent

The game should move rapidly from opportunity to action.

Players should not spend long periods preparing before meaningful gameplay begins.

A typical sequence may be:

1. find or steal a vehicle;
2. obtain a weapon or armour;
3. attack a rival;
4. attract police or additional enemies;
5. escape, change vehicles, or turn the situation against others;
6. repeat at a higher level of chaos.

The player should frequently feel that one decision creates the next problem or opportunity.

## Supported Design

This pillar supports:

* fast vehicle theft;
* frequent weapon access;
* short respawn times;
* visible police escalation;
* vehicle switching;
* temporary advantages;
* quick repositioning;
* improvised escape routes;
* environmental opportunities;
* short and medium-length matches.

## Design Implications

### Low Downtime

The game should minimise:

* long travel without interaction;
* slow inventory management;
* extended recovery periods;
* lengthy preparation phases;
* excessive waiting after death.

### Immediate Opportunity

Useful vehicles, equipment, and conflicts should be available quickly.

The player should not need to grind before the core loop becomes available.

### Escalation Must Be Readable

The player should understand:

* what caused attention;
* how dangerous the current situation is;
* which forces are responding;
* whether escape is still possible.

### Escape Must Remain Possible

Escalation should create pressure, not automatic failure.

Players should usually have a meaningful chance to:

* flee;
* hide;
* change vehicles;
* exploit another conflict;
* use the environment;
* redirect police attention.

## What This Pillar Does Not Mean

It does not require:

* constant maximum chaos;
* immediate access to every weapon;
* no tactical preparation;
* automatic escape;
* no consequences;
* permanent police pursuit;
* linear escalation in every mode.

## Failure Signs

This pillar is failing if:

* players spend too long searching for action;
* vehicle theft feels slow or ceremonial;
* police appear without clear cause;
* escape is impossible once attention begins;
* the safest strategy is to avoid interaction;
* matches contain long inactive periods;
* death creates excessive downtime.

## Pillar 2 — Vehicles Are Temporary Tools

## Statement

> Vehicles are powerful, useful, disposable, and frequently replaced.

## Intent

Vehicles are central to the game, but players should not become permanently attached to one vehicle.

A vehicle may serve as:

* transport;
* temporary protection;
* a weapon;
* an escape tool;
* a mobile explosive;
* a way to reposition;
* a resource to deny an opponent.

The expected rhythm is:

1. steal;
2. use;
3. damage;
4. weaponise;
5. abandon;
6. replace.

## Supported Design

This pillar supports:

* frequent vehicle availability;
* quick entry and exit;
* vehicle theft;
* distinct vehicle classes;
* meaningful damage states;
* burning vehicles;
* explosions;
* chain reactions;
* no prototype repair system;
* disposable civilian traffic;
* tactical abandonment.

## Design Implications

### Vehicle Power Must Be Temporary

Vehicles may provide strong advantages, but:

* damage accumulates;
* fire creates urgency;
* rockets threaten them;
* collisions have consequences;
* keeping a damaged vehicle becomes risky.

### Switching Should Be Normal

Changing vehicles should not feel like failure.

It should be a regular tactical action.

### Vehicle Classes Must Matter

Different vehicles should support different choices:

* compact cars favour agility;
* saloons favour balance;
* vans favour durability;
* refuse trucks favour mass and impact.

### Vehicles Must Not Replace Foot Gameplay

Players should still need to:

* collect equipment;
* fight indoors or in tight areas later;
* cross spaces vehicles cannot dominate;
* leave damaged vehicles;
* respond to anti-vehicle threats.

## What This Pillar Does Not Mean

It does not require:

* every vehicle to explode quickly;
* no valuable or rare vehicles;
* no emotional attachment to cosmetics;
* unrealistic handling;
* identical entry rules;
* constant vehicle switching every few seconds.

## Failure Signs

This pillar is failing if:

* one vehicle remains optimal for the whole match;
* players refuse to leave damaged vehicles;
* replacement vehicles are too rare;
* repair becomes mandatory;
* vehicle loss feels like a major punishment;
* players spend most of the match on foot because vehicles are too weak;
* players spend most of the match in vehicles because foot play is irrelevant.

## Pillar 3 — Players Are the Main Threat

## Statement

> Other players or combat bots should remain the most important danger and opportunity.

## Intent

The city contains many active systems, but the central conflict must remain between combatants.

Police, civilians, traffic, hazards, and later faction NPCs should:

* complicate;
* amplify;
* redirect;
* contextualise

player conflict.

They should not replace it.

## Supported Design

This pillar supports:

* FFA and team-based modes;
* combat bots using the same rules as players;
* limited police resources;
* moderate civilian density;
* traffic that creates opportunities;
* faction NPCs as support rather than commanders;
* score focused on defeating combatants.

## Design Implications

### AI Must Serve Player Conflict

Bots should:

* fight each other;
* contest equipment;
* use vehicles;
* create pressure;
* produce opportunities.

They should not exist only to attack the human player.

### Police Must Stay Secondary

Police may:

* interrupt fights;
* punish visible crime;
* create pursuit;
* reveal locations;
* pressure dominant actors.

They should not become the primary enemy for most of a match.

### Traffic Must Create Situations

Traffic may:

* block a route briefly;
* create collision opportunities;
* provide vehicles;
* amplify explosions;
* complicate chases.

It should not create permanent obstruction.

### Later Faction NPCs Must Not Win Alone

Faction NPCs may:

* defend;
* support;
* expand slowly;
* create front lines.

Decisive success should still depend mainly on players.

## What This Pillar Does Not Mean

It does not require:

* weak police;
* passive civilians;
* irrelevant NPCs;
* no PvE modes;
* no environmental danger;
* no autonomous faction activity.

## Failure Signs

This pillar is failing if:

* most player deaths come from police;
* bots rarely fight each other;
* traffic causes more disruption than rivals;
* NPC factions capture the map without players;
* players avoid rivals because city systems are more dangerous;
* score optimisation focuses on NPC farming.

## Pillar 4 — Creative Chaos Is Rewarded

## Statement

> The game should recognise and celebrate inventive, spectacular, and multi-stage actions.

## Intent

Players should be encouraged to do more than select the most efficient weapon and repeat the same tactic.

The game should reward actions such as:

* roadkills;
* close-range shotgun kills;
* rocket kills;
* vehicle explosions;
* chain reactions;
* environmental kills;
* police-assisted kills;
* unusual combinations of vehicles, weapons, and hazards.

The reward is not only score.

It also includes:

* strong sound;
* readable callouts;
* memorable statistics;
* visual emphasis;
* social recognition.

## Supported Design

This pillar supports:

* differentiated kill categories;
* creative score bonuses;
* chain reactions;
* burning vehicles as tactical tools;
* police manipulation;
* destructible city objects;
* emergent environmental opportunities;
* arcade-style kill announcements.

## Design Implications

### Creativity Must Be Legible

The game must identify:

* who caused the action;
* what type of kill occurred;
* whether a chain reaction was involved;
* how many actors were affected;
* how the score was awarded.

### Rewards Must Influence Behaviour

Creative bonuses should be large enough to matter.

They should not be so large that standard combat becomes irrelevant.

### Systems Should Combine

Weapons, vehicles, police, traffic, and environment should interact through common rules.

The game should avoid isolated systems that cannot create unexpected combinations.

### Spectacle Must Remain Understandable

Large explosions and chain reactions should be dramatic without becoming visual noise.

## What This Pillar Does Not Mean

It does not require:

* random physics replacing player skill;
* every kill receiving a special label;
* extreme score inflation;
* constant explosions;
* scripted set pieces;
* unfair deaths for the sake of spectacle.

## Failure Signs

This pillar is failing if:

* one kill type dominates scoring;
* creative kills feel accidental and unearned;
* players cannot understand why they received points;
* chain reactions are visually confusing;
* environmental kills are too rare to matter;
* spectacular actions produce weak feedback;
* direct combat becomes strategically pointless.

## Pillar 5 — The City Fights Back

## Statement

> The city should visibly react to player behaviour and create consequences without becoming a full simulation.

## Intent

The world should not feel like a static arena populated only for appearance.

The city reacts through:

* civilians fleeing;
* drivers escaping;
* traffic rerouting;
* police responding;
* local areas emptying;
* damaged objects remaining destroyed;
* later faction pressure and city control.

These reactions should create additional gameplay rather than background decoration alone.

## Supported Design

This pillar supports:

* simple crime detection;
* wanted levels;
* finite police response;
* civilian fleeing;
* traffic incident management;
* temporary local evacuation;
* quick repopulation;
* persistent destruction within a round;
* later faction-controlled buildings.

## Design Implications

### Reactions Must Be Understandable

Players should see a logical relationship between:

* violence and civilian flight;
* crime and police response;
* explosions and traffic disruption;
* danger ending and population returning.

### Simulation Must Be Selective

Only reactions that improve gameplay should be simulated.

The game does not need:

* individual civilian schedules;
* realistic city economics;
* permanent traffic histories;
* detailed witness memories;
* full emergency-service simulation.

### Recovery Is Important

The city should not remain permanently empty or blocked after one incident.

Short rounds require the environment to recover.

### Response Must Be Limited

Police, traffic, and civilians require caps, simplifications, and cleanup rules.

## What This Pillar Does Not Mean

It does not require:

* realism;
* permanent world change;
* every action being witnessed;
* unlimited police response;
* complex social simulation;
* city systems operating independently of gameplay needs.

## Failure Signs

This pillar is failing if:

* civilians ignore explosions;
* police response appears arbitrary;
* traffic never recovers;
* the city remains empty after early combat;
* simulation consumes performance without changing gameplay;
* city reactions become the main obstacle;
* players cannot use reactions tactically.

## Pillar 6 — Neon over Dirt

## Statement

> The visual identity combines selective neon and strong lighting with an old, dirty, industrial city.

## Intent

The city should feel:

* aged;
* wet;
* polluted;
* functional;
* criminal;
* visually striking.

Neon provides contrast and identity.

It should not transform the world into a clean futuristic cyberpunk city.

The visual balance is:

> Neon over dirt, not neon instead of dirt.

## Supported Design

This pillar supports:

* wet asphalt;
* reflective roads;
* old vehicles;
* grime;
* soot;
* smoke;
* steam;
* industrial structures;
* selective bright signage;
* headlights;
* police lights;
* strong contrast;
* simplified but intentional geometry.

## Design Implications

### Readability Comes First

Neon, reflections, and smoke must not hide:

* players;
* vehicles;
* pickups;
* burning states;
* hazards;
* police presence.

### Geometry Can Be Simple

Visual quality should come primarily from:

* silhouette;
* material consistency;
* lighting;
* atmosphere;
* controlled colour;
* motion;
* effects.

### Asset Sources Must Be Unified

Store and AI-produced assets should share:

* scale;
* proportions;
* material response;
* colour language;
* dirt treatment;
* detail density.

### Vehicles Receive Extra Attention

Vehicles are major visual and gameplay carriers.

They should receive more detail than many buildings or civilian variants.

## What This Pillar Does Not Mean

It does not require:

* constant neon everywhere;
* cyberpunk architecture;
* photorealism;
* extreme darkness;
* heavy reflections on every surface;
* excessive visual effects;
* complex geometry.

## Failure Signs

This pillar is failing if:

* the city looks clean or futuristic;
* assets look like unrelated packages;
* reflections hide gameplay;
* the player requires an excessive outline;
* neon colours lose their impact through overuse;
* screenshots look good but gameplay is unreadable;
* simple geometry appears unfinished rather than intentional.

## Pillar 7 — Solo-Testable by Default

## Statement

> Core gameplay should remain playable, testable, and enjoyable without requiring human multiplayer participants.

## Intent

Bots are a core foundation for:

* autonomous development;
* balancing;
* stress testing;
* solo play;
* accessibility;
* low-population resilience.

Human multiplayer remains important to the product vision, but the project should not depend on a large active population for basic value.

## Supported Design

This pillar supports:

* configurable bot counts;
* bots using player rules;
* FFA against bots;
* bots using vehicles and pickups;
* bot replacement in later modes;
* cooperative play against AI;
* repeatable automated test scenarios;
* solo-accessible sessions.

## Design Implications

### Bots Must Use Shared Systems

Where practical, bots and players should share:

* weapons;
* health;
* armour;
* vehicles;
* pickups;
* damage;
* scoring;
* respawning.

### Bots Must Fight Each Other

FFA bots should not exist only as enemies for the human player.

### Bot Quality Is Product Quality

Bots do not need to imitate humans perfectly.

They must create:

* pressure;
* conflict;
* unpredictability;
* believable mistakes;
* varied situations.

### Multiplayer Must Add Value

Human players should add:

* deception;
* rivalry;
* humour;
* social stories;
* greater unpredictability.

They should not be required to make the basic systems function.

## What This Pillar Does Not Mean

It does not require:

* bots in every future mode;
* perfect AI;
* replacing real multiplayer;
* identical behaviour between humans and bots;
* building advanced AI before core gameplay works.

## Failure Signs

This pillar is failing if:

* bots only attack the human;
* bots require separate simplified rules;
* bots cannot use vehicles;
* solo matches feel empty;
* balancing requires human groups for every test;
* the game loses most of its value without public matchmaking.

## Cross-Pillar Trade-Off Rules

## Rule 1 — Fun Before Simulation

When city simulation conflicts with movement, driving, combat, or readability:

* simplify the simulation.

## Rule 2 — Player Conflict Before NPC Activity

When police, civilians, traffic, or faction NPCs dominate the match:

* reduce their strength, density, or persistence.

## Rule 3 — Vehicle Power Requires Counterplay

When vehicle fantasy conflicts with foot gameplay:

* preserve strong vehicles;
* add readable counterplay;
* avoid simply making vehicles weak.

## Rule 4 — Spectacle Must Remain Legible

When explosions, neon, smoke, or callouts reduce clarity:

* preserve the gameplay effect;
* reduce visual noise.

## Rule 5 — Reuse Before Expansion

New modes should reuse validated systems before introducing separate architectures.

## Rule 6 — Prototype Evidence Overrides Preference

A preferred design direction may be changed if repeated prototype testing shows that it does not work.

## Rule 7 — Production Feasibility Is a Design Constraint

A feature that requires routine manual human implementation or repair must be:

* simplified;
* automated;
* sourced differently;
* deferred;
* or removed.

## Feature Evaluation Checklist

A proposed feature should be evaluated through the following questions:

1. Which pillar does it support?
2. Does it weaken another pillar?
3. Does it improve player action or only add simulation?
4. Does it create new decisions?
5. Does it create excessive downtime?
6. Does it preserve player conflict as the main focus?
7. Is it readable from the selected camera variant?
8. Can bots use or understand it?
9. Can it be implemented and maintained through the intended production model?
10. Does it belong in the current prototype, a later milestone, or the Parking Lot?

## Prototype Pillar Validation

The first prototype must provide evidence for all pillars.

## Steal, Escalate, Escape

Validated through:

* vehicle theft;
* rapid conflict;
* wanted level 1;
* escape and repositioning;
* short respawns.

## Vehicles Are Temporary Tools

Validated through:

* four vehicle classes;
* damage states;
* burning;
* explosions;
* no repair;
* frequent replacement.

## Players Are the Main Threat

Validated through:

* FFA bots;
* bot-versus-bot fighting;
* global police cap;
* limited civilian and traffic impact.

## Creative Chaos Is Rewarded

Validated through:

* kill categories;
* score bonuses;
* chain reactions;
* strong feedback.

## The City Fights Back

Validated through:

* fleeing civilians;
* dynamic traffic;
* police response;
* temporary local evacuation;
* destroyed city objects.

## Neon over Dirt

Validated through:

* Style Slice;
* wet asphalt;
* neon;
* smoke;
* grime;
* final-leaning materials;
* gameplay readability.

## Solo-Testable by Default

Validated through:

* zero to eleven bots;
* complete FFA rounds;
* shared gameplay rules;
* stress testing.

## Current Pillar Assessment

The pillar set is coherent and supports the current product direction.

The greatest potential conflicts are:

* vehicle power versus foot-player fairness;
* city reaction versus player conflict;
* visual spectacle versus readability;
* bot quality versus prototype scope;
* production ambition versus AI-pipeline reliability.

These conflicts must be resolved through the milestone gates defined in the Prototype Roadmap.

## Authorisation Boundary

This document defines design principles.

It does not authorise:

* implementation;
* technical architecture;
* asset purchases;
* Unity project creation;
* external integrations;
* production work.

Implementation remains subject to separate approval.
