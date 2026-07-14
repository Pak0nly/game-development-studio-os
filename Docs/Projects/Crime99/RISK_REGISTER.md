# Risk Register

## Status

**Document Maturity:** Active Register
**Prototype Disposition:** Project risk oversight
**Validation State:** Mixed by entry
**Approval Status:** Pending Human Developer review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This register tracks risks that could prevent the project from achieving its intended gameplay, visual, technical, production, or commercial goals.

A risk is not proof that a failure will occur.

It identifies:

* what may go wrong;
* why it matters;
* how likely it currently appears;
* how severe the effect would be;
* how the risk should be reduced;
* what evidence is needed.

## Risk Scales

### Probability

* **Low:** Unlikely based on current evidence.
* **Medium:** Plausible and requires attention.
* **High:** Likely unless actively controlled.

### Impact

* **Low:** Local inconvenience or limited rework.
* **Medium:** Meaningful delay, quality loss, or scope reduction.
* **High:** Threatens a major pillar, prototype viability, or project continuation.
* **Critical:** Could invalidate the project concept or production model.

### Risk State

* **Open:** Risk exists and is being monitored.
* **Mitigating:** Active measures are being applied.
* **Accepted:** Risk is understood and tolerated.
* **Reduced:** Evidence shows that risk has decreased.
* **Triggered:** The risk has become an actual problem.
* **Closed:** Risk is no longer relevant.

## Product and Scope Risks

## R-001 — Prototype Scope Is Too Large

**State:** Open
**Probability:** High
**Impact:** High

### Description

The first prototype includes:

* on-foot movement;
* three weapons;
* four vehicle classes;
* vehicle destruction;
* chain reactions;
* combat bots;
* civilians;
* traffic;
* police;
* a multi-block map;
* visual-style validation;
* audio feedback;
* stress testing.

This is large for a first prototype.

### Consequences

* development may take too long;
* too many systems may remain shallow;
* tuning may become unfocused;
* the project may consume excessive AI-agent capacity;
* visual work may begin before the core is fun.

### Mitigation

* follow the roadmap in strict order;
* enforce milestone gates;
* stop expansion when a gate fails;
* keep NPC roles simple;
* reduce secondary content first;
* use the separate test area;
* avoid networking, factions, story, and economy;
* record actual agent usage by milestone.

### Trigger Indicators

* multiple milestones progress simultaneously;
* city systems begin before vehicle feel passes;
* repeated additions enter the prototype scope;
* major systems remain unfinished while new systems are started;
* agent usage exceeds planning assumptions.

### Review Point

After every prototype milestone.

## R-002 — Scope Creep From Faction War

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Faction War is an important long-term mode with many attractive systems.

There is a risk that:

* territory;
* HQs;
* economy;
* lives;
* faction NPCs;
* building capture;
* police manipulation

enter prototype planning too early.

### Consequences

* the first prototype loses focus;
* architecture becomes speculative;
* core action receives insufficient iteration;
* implementation cost increases sharply.

### Mitigation

* keep Faction War in separate GDD modules;
* treat all Faction War content as deferred;
* prohibit faction implementation in the first prototype;
* require prototype success before Faction War scope review.

### Trigger Indicators

* faction requirements influence Milestone 1–6 implementation directly;
* economy or building capture appears in prototype tasks;
* networking is justified mainly through future Faction War needs.

## R-003 — The Prototype Tests Too Many Assumptions at Once

**State:** Open
**Probability:** High
**Impact:** Medium

### Description

Movement, shooting, driving, AI, city simulation, art, and performance are all being tested within one prototype.

### Consequences

* failures may be difficult to diagnose;
* attractive visuals may hide weak gameplay;
* AI problems may be mistaken for map problems;
* map problems may be mistaken for weapon problems.

### Mitigation

* use isolated milestone tests;
* keep the rudimentary test area;
* validate mechanics independently;
* document each gate result;
* avoid final-map testing until the FFA loop works.

## Gameplay Risks

## R-004 — On-Foot Movement Is Not Fun

**State:** Open
**Probability:** Medium
**Impact:** Critical

### Description

The entire project depends on responsive movement, aiming, sprinting, jumping, and dodging.

### Consequences

* foot combat becomes frustrating;
* vehicle exits feel undesirable;
* weapon combat lacks precision;
* every later mode suffers.

### Mitigation

* implement movement first;
* expose all important values;
* test keyboard and mouse; test controller separately only if optional controller support is included;
* keep animation secondary to responsiveness;
* run repeated short feel reviews;
* do not proceed past `Gate A — Basic Control Quality` while control remains weak.

### Trigger Indicators

* noticeable input delay;
* unwanted inertia;
* jump or dodge has no tactical purpose;
* if included, controller aiming feels significantly worse;
* movement becomes difficult to read from the camera.

### Failure Boundary

If repeated tuning cannot produce responsive movement, the current movement architecture must be replaced.

## R-005 — Driving Is Not Enjoyable

**State:** Open
**Probability:** Medium
**Impact:** Critical

### Description

Vehicles are a central product pillar.

Driving must be enjoyable even before combat is added.

### Consequences

* the primary fantasy fails;
* vehicle theft loses meaning;
* the city becomes unnecessary space;
* roadkills and chases cannot carry the experience.

### Mitigation

* validate driving in isolation;
* begin with a long test road;
* tune one vehicle before expanding all four;
* compare internal, asset-based, and hybrid approaches;
* prioritise arcade control over physical realism;
* delay city simulation until driving passes.

### Trigger Indicators

* turning feels inconsistent;
* handbrake drift cannot be repeated;
* high speed is unreadable;
* vehicles frequently spin or flip without clear cause;
* all vehicle classes feel similar;
* driving is only fun when explosions occur.

### Failure Boundary

If several tuning rounds cannot produce enjoyable driving, reconsider the vehicle system before continuing.

## R-006 — Foot Players Cannot Fairly Counter Vehicles

**State:** Open
**Probability:** High
**Impact:** High

### Description

A clean vehicle hit is intended to kill instantly.

This creates a risk that vehicles dominate foot combat or feel unfair.

### Consequences

* players avoid fighting on foot;
* rockets become mandatory;
* respawns near roads become frustrating;
* vehicle gameplay loses counterplay.

### Mitigation

* make lethal impacts visually clear;
* distinguish scrapes from direct hits;
* preserve responsive dodge and movement;
* use readable vehicle approach angles;
* provide rockets and environmental hazards;
* tune acceleration, steering, and braking;
* avoid unavoidable clinic spawns.

### Trigger Indicators

* most kills are roadkills;
* foot players cannot cross roads safely;
* bots repeatedly kill freshly spawned players;
* rocket launcher becomes the only viable defence;
* deaths feel unrelated to player decisions.

## R-007 — Weapons Lack Impact

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Pistol, shotgun, and rocket launcher must feel powerful despite the elevated camera and simplified geometry.

### Consequences

* combat feels weak;
* creative kills lose excitement;
* vehicles overshadow weapons;
* the arcade tone is lost.

### Mitigation

* use clear recoil and hit reactions;
* prioritise strong sound;
* use readable blood and armour feedback;
* tune camera and screen response carefully;
* give each weapon a distinct role;
* test impact before adding weapon variety.

### Trigger Indicators

* players cannot tell whether shots hit;
* shotgun does not feel dangerous at close range;
* rocket explosions feel visually or audibly small;
* pistol combat feels repetitive before a short test ends.

## R-008 — Explosion Chains Become Unreadable

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Unlimited natural chain reactions are a desired feature.

Large explosions may obscure threats, produce unfair deaths, or destabilise physics.

### Consequences

* visual chaos becomes confusion;
* players cannot understand score attribution;
* physics objects create unpredictable damage;
* frame rate collapses;
* chain reactions must be artificially limited.

### Mitigation

* communicate burning states clearly;
* stage explosion timing;
* control debris count;
* preserve consistent damage rules;
* separate visual effect intensity from gameplay radius;
* stress-test clusters of ten vehicles early;
* attribute kills through a central damage system.

### Trigger Indicators

* players cannot identify why they died;
* explosions trigger through excessive distances;
* chain reactions regularly cause physics failure;
* score attribution becomes incorrect;
* frame time spikes become severe.

## R-009 — Creative Scoring Encourages Exploits

**State:** Open
**Probability:** Medium
**Impact:** Medium

### Description

Higher rewards for roadkills, chain reactions, police-assisted kills, and environmental kills may create repetitive optimal strategies.

### Consequences

* players farm one kill category;
* standard combat becomes irrelevant;
* bots are exploited;
* matches become predictable.

### Mitigation

* keep values live-tunable;
* monitor score distribution;
* use diminishing bonuses where needed;
* reward variety;
* avoid bonuses large enough to invalidate direct combat;
* test with different bot counts and map areas.

### Trigger Indicators

* one kill type dominates winning scores;
* players ignore rivals to prepare environmental kills;
* police-assisted kills are farmed intentionally;
* parked vehicle clusters become the only relevant objective.

## Camera and Readability Risks

## R-010 — Camera Variants Fail at High Speed

**State:** Open
**Probability:** Medium
**Impact:** Critical

### Description

The prototype compares `Fixed Camera` and `Rotatable Camera`. Both use fixed elevation and fixed distance; only the rotatable variant may rotate around the player. One or both variants may become unreadable during fast driving, building occlusion, or chaotic combat.

### Consequences

* collisions feel unavoidable;
* traffic appears too late;
* aiming and driving conflict;
* the main road becomes frustrating;
* neither camera variant may remain viable without map or readability revision.

### Mitigation

* compare both variants directly on the same representative map;
* validate map and landmark readability without optimising the test unfairly for one variant;
* test building occlusion and chaotic combat with both variants;
* validate both variants in Milestone 0 and at the later visual gate;
* keep road obstacles readable;
* avoid dense foreground buildings;
* tune vehicle top speed against visibility.

### Trigger Indicators

* players repeatedly hit unseen traffic;
* braking distance exceeds visibility;
* high speed feels unsafe rather than exciting;
* one variant repeatedly loses the player or incoming threats;
* buildings or effects make either variant consistently unreadable.

### Failure Boundary

If neither variant remains readable after repeated testing, reconsider the exact fixed angle and distance values, map readability, occlusion treatment, vehicle speed, or the project camera direction through explicit Human Developer review.

## R-011 — Buildings Obscure Gameplay

**State:** Open
**Probability:** High
**Impact:** Medium

### Description

The elevated tilted camera can place buildings between the player and the camera.

### Consequences

* players disappear;
* combat becomes unfair;
* vehicles enter hidden areas;
* the map requires excessive open space.

### Mitigation

* use prepared fade zones if simplest;
* fade roofs or walls;
* show player silhouette;
* design map blocks around camera direction;
* avoid unnecessary tall foreground structures.

### Trigger Indicators

* the player frequently disappears;
* enemies attack from hidden positions;
* occlusion fixes create visual flicker;
* too much geometry becomes transparent at once.

## R-012 — Neon and Wet Roads Reduce Readability

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Reflections, strong lights, smoke, and effects may hide characters, pickups, hazards, or vehicle states.

### Consequences

* final visual identity conflicts with gameplay;
* effects must be reduced heavily;
* player highlights become intrusive;
* screenshots look better than active play.

### Mitigation

* test materials under gameplay conditions;
* limit uncontrolled reflections;
* use clear silhouettes;
* reserve strong colours for important signals;
* separate decorative and gameplay lighting;
* test motion rather than still images;
* expose effect intensity for tuning.

### Trigger Indicators

* pickups disappear into reflections;
* burning vehicles are not immediately visible;
* player outlines must be excessively bright;
* police lights overwhelm weapon and damage feedback.

## AI and Simulation Risks

## R-013 — Combat Bots Become the Largest Cost

**State:** Open
**Probability:** High
**Impact:** High

### Description

Bots must:

* navigate;
* fight;
* aim;
* collect items;
* use weapons;
* enter vehicles;
* drive;
* ram;
* escape burning vehicles;
* use rockets;
* fight each other.

### Consequences

* implementation consumes disproportionate capacity;
* FFA quality remains low;
* later city systems are delayed;
* complex AI frameworks are introduced prematurely.

### Mitigation

* add behaviours in stages;
* use simple roles and modular states;
* prioritise believable behaviour over human realism;
* reuse player gameplay interfaces;
* separate driving competence from tactical intelligence;
* reduce rare behaviours first.

### Trigger Indicators

* AI work dominates several milestones;
* bots require special rules unavailable to players;
* debugging becomes opaque;
* bots cannot complete a match without scripting shortcuts;
* driving AI repeatedly blocks progress.

## R-014 — Bots Focus the Human Player

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Poor target selection may make the human feel unfairly targeted.

### Consequences

* solo matches feel like survival rather than FFA;
* bot conflict becomes invisible;
* difficulty scales badly with bot count.

### Mitigation

* use score and threat-based target selection;
* include target-switching rules;
* avoid permanent player bias;
* record bot-versus-bot kill ratios;
* test spectator or debug views.

### Trigger Indicators

* most bots converge on the human;
* bots ignore nearby bot threats;
* human deaths rise disproportionately with bot count;
* bot-versus-bot kills remain rare.

## R-015 — Driving Bots Cause Constant Collisions

**State:** Open
**Probability:** High
**Impact:** High

### Description

Combat driving, normal traffic, police, and player vehicles share roads.

### Consequences

* streets deadlock;
* bots appear incompetent;
* vehicles become piles of physics objects;
* chain reactions occur accidentally too often.

### Mitigation

* use road-based routing;
* keep driving decisions simple;
* support reversing and rerouting;
* allow stuck cleanup outside view;
* separate civilian and combat driving tolerances;
* adjust traffic density dynamically.

### Trigger Indicators

* intersections remain blocked;
* bots repeatedly hit walls;
* most bot vehicles are destroyed without combat;
* traffic cleanup becomes visibly frequent;
* police cannot reach offenders.

## R-016 — Traffic Simulation Overwhelms Gameplay

**State:** Open
**Probability:** Medium
**Impact:** Medium

### Description

Dynamic traffic can create atmosphere, but may obstruct fights and driving.

### Consequences

* the city feels crowded;
* high-speed driving becomes impossible;
* random collisions dominate;
* police and bots cannot navigate.

### Mitigation

* use road-class density;
* expose session multipliers;
* maintain open main-road capacity;
* temporarily reduce spawning around incidents;
* keep civilian behaviour simple.

### Trigger Indicators

* players spend more time blocked than fighting;
* traffic density must be nearly zero for fun;
* central junction becomes permanently congested;
* vehicle chases end due to ordinary traffic too often.

## R-017 — Police Become the Main Opponent

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Police should complicate player conflict, not replace it.

### Consequences

* players fight police instead of rivals;
* FFA scoring becomes secondary;
* constant pursuit reduces tactical variety;
* city reaction becomes annoying.

### Mitigation

* wanted level 1 only;
* global police cap;
* simple crime detection;
* moderate response strength;
* prioritise visible recent offenders;
* tune police persistence and disengagement.

### Trigger Indicators

* most damage comes from police;
* players avoid combat to avoid wanted status;
* police remain attached for most of the round;
* bot matches become police-versus-everyone.

## R-018 — AI Systems Collapse Under Stress

**State:** Open
**Probability:** Medium
**Impact:** Critical

### Description

The final stress scenario combines:

* eleven combat bots;
* civilians;
* traffic;
* police;
* vehicles;
* pickups;
* explosions.

### Consequences

* behaviour updates stall;
* agents stop navigating;
* physics and AI desynchronise;
* prototype cannot support intended player counts.

### Mitigation

* profile each actor category separately;
* use update budgets;
* reduce distant simulation detail;
* pool actors and vehicles;
* limit police globally;
* use simple perception;
* stress-test before final visual polish.

### Trigger Indicators

* actors freeze;
* update spikes occur regularly;
* traffic rerouting stops;
* bot reaction time rises sharply;
* frame time scales unpredictably with population.

## Technical Risks

## R-019 — Vehicle Physics Becomes Unstable

**State:** Open
**Probability:** Medium
**Impact:** Critical

### Description

High speed, heavy vehicles, collisions, ramps, explosions, and large chain reactions can destabilise physics.

### Consequences

* vehicles launch unrealistically;
* collisions become unpredictable;
* players lose control;
* network migration becomes harder later.

### Mitigation

* use controlled arcade physics;
* limit unnecessary rigidbodies;
* tune mass ratios;
* define collision layers carefully;
* cap extreme forces where they do not add gameplay value;
* use the test area for repeatable collision tests.

### Trigger Indicators

* vehicles frequently flip from normal contact;
* garbage truck launches smaller cars excessively;
* collision results vary widely between repeated tests;
* explosion forces cause tunnelling or instability.

## R-020 — Architecture Requires Full Rewrite for Multiplayer

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Networking is deferred, but the final game is strongly multiplayer-oriented.

### Consequences

* core gameplay must be rebuilt;
* simulation ownership is unclear;
* scoring and damage cannot be synchronised cleanly;
* prototype code becomes disposable.

### Mitigation

* separate input from gameplay intent;
* centralise damage and score attribution;
* use clear spawn and state boundaries;
* avoid direct dependencies on a single local player;
* do not implement actual networking prematurely;
* review architecture for multiplayer compatibility.

### Trigger Indicators

* gameplay code directly reads local input everywhere;
* bots and players use different core systems;
* damage is applied through uncontrolled object references;
* global state assumes one player;
* time and physics behaviour cannot be reproduced deterministically enough.

## R-021 — Rendering Costs Exceed Prototype Budget

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Wet roads, dynamic lights, neon, smoke, headlights, police lights, and explosions may be expensive.

### Consequences

* visual identity must be reduced;
* population targets cannot be reached;
* browser option becomes unrealistic;
* lower-end hardware is excluded.

### Mitigation

* select pipeline deliberately;
* use controlled light counts;
* bake static lighting where useful;
* limit shadow-casting lights;
* pool effects;
* use LODs;
* profile the Style Slice;
* define reference hardware.

### Trigger Indicators

* Style Slice already performs poorly;
* police lights create large frame spikes;
* smoke overdraw dominates rendering;
* adding bots reduces performance mainly through rendering, not AI.

## R-022 — No Clear Reference Hardware

**State:** Open
**Probability:** High
**Impact:** Medium

### Description

Without a defined hardware target, performance success cannot be measured consistently.

### Consequences

* visual and simulation budgets remain arbitrary;
* stress-test results are unclear;
* optimisation may target the wrong system.

### Mitigation

* select primary reference hardware before implementation;
* define resolution and frame-rate targets;
* later introduce a weaker secondary profile.

### Trigger Indicators

* performance discussions rely only on subjective impressions;
* settings change between tests;
* no stable benchmark scene exists.

## R-023 — External Asset or Package Creates Lock-In

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

A vehicle, traffic, AI, VFX, or city package may become deeply embedded.

### Consequences

* upgrades break the project;
* unused complexity remains;
* licences restrict use;
* package architecture blocks multiplayer or AI needs;
* removal becomes expensive.

### Mitigation

* catalogue and assess the planned bundle before any import;
* document licence, Unity support, render-pipeline compatibility, shaders, materials, scale, textures, LODs, colliders, pivots, modularity, performance, and adaptation effort;
* prefer modular packages;
* isolate third-party dependencies;
* validate only a bounded representative selection in the separately authorised Asset and Style Preflight;
* document package ownership and version;
* avoid modifying vendor code unless necessary.

### Trigger Indicators

* core game code depends directly on many package classes;
* package updates are required to continue;
* vendor code must be heavily rewritten;
* package brings large unnecessary subsystems.

## Asset and Production Risks

## R-024 — Bundle Assets Do Not Form a Coherent Visual Library

**State:** Open
**Probability:** High
**Impact:** High

### Description

Assets within the planned primary bundle may be usable individually but differ in:

* scale;
* proportions;
* materials;
* texture density;
* topology;
* animation style;
* visual detail.

### Consequences

* the game looks assembled from unrelated packs;
* extensive correction is required;
* the visual identity fails;
* production slows.

### Mitigation

* establish common scale;
* use shared material rules;
* limit colour palette;
* use consistent roughness and metallic values;
* apply unified dirt and wear;
* treat the bundle as raw material and apply only a light shared style pass where needed;
* preserve deliberately cleaner and dirtier areas within the `Neon over Dirt` direction;
* validate usability and cohesion through the bounded, separately authorised Asset and Style Preflight;
* reject sources requiring excessive repair.

### Trigger Indicators

* assets only match under extreme lighting;
* characters and vehicles have incompatible proportions;
* every new asset needs manual reworking;
* source differences remain obvious in motion.

## R-025 — AI Asset Pipeline Requires Human Production

**State:** Open
**Probability:** High
**Impact:** Critical

### Description

Original AI-assisted 3D production with Claude and Blender is deferred until after the first prototype. If later activated for unique or missing project-specific assets, it may still require substantial human production.

Generated assets may still require:

* topology repair;
* UV correction;
* rigging;
* material cleanup;
* collision setup;
* LOD creation;
* scale adjustment.

### Consequences

* the production model fails;
* asset output cannot scale;
* human workload becomes the bottleneck;
* visual quality becomes inconsistent.

### Mitigation

* do not activate this pipeline during the first prototype;
* validate the pipeline before any later large production;
* define game-ready acceptance criteria;
* assign AI correction passes;
* prefer modular reusable assets;
* use suitable purchased assets where more efficient;
* measure correction effort per asset;
* stop using sources that repeatedly fail.

### Trigger Indicators

* the human developer must open Blender for routine fixes;
* more time is spent repairing than generating;
* repeated prompts cannot reproduce the style;
* assets arrive without usable topology or materials.

### Failure Boundary

If regular manual human correction remains necessary, the pipeline must change or the asset category must use another source.

## R-026 — Vehicle Assets Cannot Support Damage States

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Purchased or generated vehicle models may not support:

* damaged materials;
* smoke attachment points;
* burning;
* destroyed states;
* collision setup;
* consistent wheel structure.

### Consequences

* gameplay and visuals diverge;
* each vehicle requires custom repair;
* vehicle production becomes expensive.

### Mitigation

* include damage requirements in asset evaluation;
* use shared vehicle construction standards;
* accept material-based damage for prototype;
* avoid detailed deformation;
* validate one vehicle fully before producing four.

### Trigger Indicators

* wheels or pivots are inconsistent;
* vehicle models cannot share setup;
* destroyed states require rebuilding every model;
* collision volumes are difficult to standardise.

## R-027 — Character Animation Becomes a Bottleneck

**State:** Open
**Probability:** Medium
**Impact:** Medium

### Description

Movement, aiming, weapons, melee, vehicle entry, and dodge require animation coverage.

### Consequences

* controls feel disconnected;
* characters slide;
* new variants multiply animation work;
* bots and players behave inconsistently.

### Mitigation

* use a shared rig;
* reuse one animation set;
* prioritise readability over animation detail;
* simplify vehicle entry;
* defer physical doors;
* evaluate animation packages early.

### Trigger Indicators

* animation prevents rapid tuning;
* weapon aiming breaks across characters;
* each visual variant requires separate setup;
* entry animations are too slow for gameplay.

## R-028 — Asset Costs Exceed Value

**State:** Open
**Probability:** Medium
**Impact:** Medium

### Description

Multiple packages may be purchased before their usefulness is proven.

### Consequences

* unnecessary spending;
* overlapping packages;
* sunk-cost pressure encourages unsuitable assets;
* subscriptions increase ongoing costs.

### Mitigation

* define purchase limits;
* require separate approval before purchasing or downloading the planned Humble Bundle;
* complete bundle inventory, overlap review, and gap analysis before considering additions;
* do not currently purchase the separate Cyberpunk Gigapack;
* evaluate the Gumroad coupon only after inventory and overlap review;
* purchase only against a specific prototype need.

### Trigger Indicators

* packages are bought “for later”;
* several packages solve the same problem;
* assets remain unused;
* recurring costs appear without clear value.

## Workflow and Governance Risks

## R-029 — Documentation and Status Drift

**State:** Triggered
**Probability:** High
**Impact:** High

### Description

The modular GDD contains many documents and previously held contradictory status, gate, and rule statements. This risk remains `Triggered` until this correction pass and Human Developer follow-up review succeed.

### Consequences

* files contradict each other;
* agents read outdated sections;
* decisions become difficult to trace;
* updates are skipped.

### Mitigation

* maintain [`GDD_INDEX.md`](GDD/GDD_INDEX.md);
* use document status clearly;
* keep Project Brief concise;
* store open decisions separately;
* review cross-document consistency;
* avoid duplicating detailed rules unnecessarily.

### Trigger Indicators

* the same rule has different values in several files;
* agents use Parking Lot ideas as current scope;
* confirmed and draft content are mixed;
* updates require editing many files.

## R-030 — Implementation Begins Without Explicit Approval

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Detailed briefs and roadmaps may be mistaken for implementation authorisation.

### Consequences

* Unity projects or packages are created prematurely;
* governance rules are bypassed;
* unwanted costs or changes occur.

### Mitigation

* keep authorisation boundary in major documents;
* record implementation state as not authorised;
* require explicit approval;
* define the exact implementation task before work starts.

### Trigger Indicators

* source folders appear before approval;
* assets are downloaded automatically;
* architecture decisions are made during implementation without review.

## R-031 — AI-Agent Usage Limits Disrupt Milestones

**State:** Open
**Probability:** High
**Impact:** Medium

### Description

Previous Unity workflow tests consumed meaningful portions of available Codex or Work usage windows.

### Consequences

* milestones stop mid-task;
* continuity becomes harder;
* tasks are fragmented;
* expensive work is repeated.

### Mitigation

* keep tasks tightly scoped;
* finish planning before implementation;
* separate milestones into reviewable units;
* preserve current state in handover documents;
* estimate usage after each milestone;
* avoid exploratory discussion inside implementation sessions.

### Trigger Indicators

* usage drops sharply during a single feature;
* tasks span multiple quota windows;
* repeated context rebuilding is necessary;
* tests and documentation are skipped due to limits.

## R-032 — Work Produces Technically Correct but Unreviewable Changes

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Large autonomous changes may work but be difficult to inspect.

### Consequences

* hidden complexity;
* weak maintainability;
* unclear regressions;
* governance review becomes superficial.

### Mitigation

* use milestone-sized commits;
* require validation reports;
* keep systems modular;
* authorise narrow file scopes;
* inspect diffs;
* require tests and clean working tree.

### Trigger Indicators

* very large commits;
* unrelated files change;
* code is generated without documentation;
* validation depends only on “it runs.”

## Commercial and Identity Risks

## R-033 — Working-Title, Originality, and Provenance Exposure

**State:** Open
**Probability:** High
**Impact:** High

### Description

An unchecked internal working title could be used externally, familiar genre conventions could combine into insufficiently distinct framing, original identity anchors may remain weak, or asset, branding, music, signage, logo, and generated-content provenance may be incomplete.

### Consequences

* weak original identity or public confusion;
* avoidable branding and reputational exposure;
* inability to evidence asset or generated-content provenance;
* commercial commitments made before professional review.

### Mitigation

* keep `Crime99` explicitly internal until checked;
* develop original city, scoring, visual, audio, UI, faction, character, and branding anchors;
* record licence and provenance evidence for assets, music, signage, logos, and generated content;
* require professional legal and trademark review before public branding or commercial commitments.

### Trigger Indicators

* the internal title appears in external material;
* product framing depends on named existing works;
* identity anchors cannot be stated without comparison;
* provenance evidence is missing or ambiguous.

## R-034 — Premium Price Does Not Match Scope

**State:** Open
**Probability:** Medium
**Impact:** Medium

### Description

Any future price may not match final content, quality, market expectations, or release positioning. Price is currently `Deferred`; no numeric assumption is confirmed.

### Consequences

* poor conversion;
* weak value perception;
* pressure to add unnecessary content;
* monetisation changes late.

### Mitigation

* treat price as provisional;
* validate replayability;
* review competing games later;
* assess Early Access content honestly;
* avoid promising a price before scope is known.

## R-035 — Solo Bot Experience Is Not Enough for Commercial Retention

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Bots enable solo play and testing, but commercial success may still depend on satisfying human multiplayer.

### Consequences

* prototype success may overstate product viability;
* public matchmaking may remain necessary;
* multiplayer costs appear later.

### Mitigation

* treat bot success as a core-gameplay gate, not final market validation;
* test real multiplayer after prototype success;
* preserve modes that work solo;
* avoid assuming that bots replace all social value.

## R-036 — Unversioned Authority Baseline

**State:** Triggered
**Probability:** High
**Impact:** High

### Description

The Crime99 Markdown baseline is versioned, but the current asset-strategy and camera correction is staged as an exact 13-file Markdown review set and remains uncommitted. There is no reviewed versioned authority baseline for this correction until a separately authorised commit succeeds.

### Mitigation

* complete Human Developer review;
* keep the correction limited to the authorised documentation scope;
* review the complete staged diff and consistency evidence;
* verify the exact staged file scope and keep the working tree free of additional changes;
* request separate commit authorisation.

### Trigger Indicators

* the staged correction remains unreviewed;
* the staged scope changes without review;
* unstaged changes or unrelated files enter the review set;
* later sessions cannot distinguish reviewed content from local drafts.

### Review Point

After Human Developer review of this staged correction and again after any separately authorised commit. This risk is fully resolved for the correction only after that commit succeeds and its exact contents are verified.

## R-037 — Decision and Status Drift

**State:** Triggered
**Probability:** High
**Impact:** High

### Description

Decision state, document maturity, prototype disposition, validation state, and approval state can diverge across modules and registers.

### Mitigation

* keep those fields separate;
* use the Decision Register as the central decision-state record;
* prohibit autonomous status promotion;
* run cross-document checks after material changes.

### Trigger Indicators

* compound labels return;
* `Deferred` or `Needs Prototype Validation` content is described as confirmed;
* Scope or Roadmap is promoted without Human Developer approval.

### Review Point

At every documentation review and status change.

## R-038 — Asset Licence and Provenance Failure

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Assets, music, signs, logos, generated content, or source files may lack adequate licence and provenance evidence, or bundle content may be used for generative derivation, training, or as a generative reference without confirming that the licence permits it.

### Mitigation

* require traceable source, licence, transformation, and acceptance records;
* document the full pre-import asset checklist;
* prohibit generative derivation, training, and generative-reference use until a separate licence review permits the exact use;
* reject ambiguous material;
* preserve separate approval for acquisition and external operations.

### Trigger Indicators

* a source or licence cannot be verified;
* generated or modified material lacks an audit trail;
* an asset is proposed for training, derivation, or generative-reference use without specific licence evidence.

### Review Point

Before any asset enters a reviewed build or public material.

## R-039 — Human Developer Review Bottleneck

**State:** Open
**Probability:** Medium
**Impact:** Medium

### Description

Large undifferentiated review packages could overload the Human Developer and delay reliable acceptance.

### Mitigation

* present coherent review gates and concise change reports;
* automate consistency evidence;
* reserve Human review for direction, quality, and final acceptance.

### Trigger Indicators

* acceptance depends on manual file-by-file comparison;
* review queues accumulate across gates.

### Review Point

At each planned Human acceptance gate.

## R-040 — Insufficient Automated Acceptance Evidence

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Changes may appear plausible without repeatable evidence for links, terminology, rules, gates, or later prototype behaviour.

### Mitigation

* define evidence requirements before authorised work;
* automate link and consistency checks where practical;
* retain targeted Human review at acceptance points.

### Trigger Indicators

* validation relies only on informal observation;
* repeated values or rules cannot be checked systematically.

### Review Point

Before each gate or documentation baseline is accepted.

## R-041 — Accessibility and Input-Parity Failure

**State:** Open
**Probability:** Medium
**Impact:** Medium

### Description

Required readability, non-colour-only information, and separate volume controls may be missed, or optional input support may create an unfair or disproportionate burden.

### Mitigation

* validate the confirmed accessibility minimum explicitly;
* treat controller and remapping as optional only when negligible in effort;
* evaluate input parity if optional controller support is included.

### Trigger Indicators

* important state is conveyed only through colour;
* HUD or text is unreadable;
* optional inputs materially expand scope or reduce fairness.

### Review Point

At `Gate A — Basic Control Quality` and `Gate E — Visual Identity`.

## R-042 — Separated-Repository Governance Drift

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

The future game repository may drift from applicable Studio OS governance, approval boundaries, decision authority, or evidence requirements.

### Mitigation

* reference applicable higher-authority Studio OS rules instead of duplicating them;
* record project-specific review points only;
* verify authority links during setup and handover.

### Trigger Indicators

* project rules conflict with Studio OS;
* copied governance text becomes stale;
* approval boundaries differ between repositories.

### Review Point

During separately authorised repository setup and each governance review.

## R-043 — Content-Rating and Platform-Policy Exposure

**State:** Open
**Probability:** Medium
**Impact:** High

### Description

Violence, criminal framing, stylised blood, destruction, user-facing branding, or future online features may create rating or platform-policy constraints.

### Mitigation

* assess representative content against the later chosen platform and rating context;
* record uncertainties without legal conclusions;
* seek professional advice where appropriate before release commitments.

### Trigger Indicators

* representative mature content is produced;
* a commercial platform or public release is selected;
* online or user-generated features enter scope.

### Review Point

Before platform submission, public marketing, or commercial release commitments.

## Overall Risk Assessment

The project has a coherent identity and a testable core loop.

The highest current risks are:

1. prototype scope;
2. vehicle feel;
3. camera-variant compatibility;
4. foot-versus-vehicle fairness;
5. combat-bot complexity;
6. bundle-asset usability and visual cohesion;
7. technical stability under combined simulation load.

The roadmap mitigates these risks only if milestone gates are enforced.

The project should not proceed directly into complete prototype production.

The next risk-reduction steps are:

1. complete Human Developer review of the correction pass;
2. close the documentation-drift and authority-baseline risks through a separately authorised baseline change set;
3. resolve active product decisions;
4. authorise any later architecture, research, acquisition, or implementation work separately;
5. collect evidence against the named canonical gates before continuation decisions.
