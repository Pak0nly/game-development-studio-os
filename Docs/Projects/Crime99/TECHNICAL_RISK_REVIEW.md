# Crime99 Technical Risk Review

## Status and Boundary

**Document Maturity:** Confirmed Planning Baseline
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-15

This review is part of the Human Developer-confirmed planning baseline and covers architecture and delivery risk for the first playable prototype. It supplements, but does not replace, [`RISK_REGISTER.md`](RISK_REGISTER.md). Ratings are planning judgments, not measured facts. No mitigation in this document authorises purchase, download, installation, import, project creation, implementation, commit, or push.

## Overall Judgment

The prototype is technically feasible, but its combined scope is large for a first playable slice. The main risk is not any single system; it is interaction among arcade vehicle physics, eleven combat bots, civilian traffic, pedestrians, police, unrestricted vehicle chain reactions, URP environment assets, camera occlusion, HUD/minimap, and visual effects.

The safest plan is Variant A through Gate A, then evidence-triggered selective preflights at Gate B and Gate D. Store systems remain unadopted until separately authorised and must never become the authority for match, score, damage, wanted, population, or spawn rules. No integration boundary is built before a concrete authorised need.

## Risk Matrix

| ID | Risk | Probability | Impact | Primary gate | Response |
|---|---|---|---|---|---|
| TR-001 | Full scope exceeds practical prototype capacity | High | Critical | All | Gate strictly; reduce fidelity/variety before required systems |
| TR-002 | Vehicle feel or physics stability fails | High | Critical | B/C/F | Small spike; candidate preflight stop rule; isolate drive model |
| TR-003 | Traffic/pedestrian implementation dominates schedule | High | High | D/F | One-intersection vertical slice; preflight combined system only on evidence |
| TR-004 | Bot vehicle use becomes brittle | High | High | D | Shared intents; staged foot then vehicle behavior; inspectable states |
| TR-005 | Camera/building occlusion harms readability | High | High | A/E | Fixed rig early; representative occlusion test; shader candidate seam |
| TR-006 | Asset packages lack cohesion under light adaptation | High | High | E | NYC base, Diner once, bounded Port, explicit visual stop criteria |
| TR-007 | Combined performance collapses | Medium-high | Critical | F | Budgets, caps, staggering, profiling, complete stable runs |
| TR-008 | Chain reactions create duplicate damage/score or physics spikes | Medium-high | High | C/F | One-time explosion guard, deduplication, pooled presentation |
| TR-009 | Store tool captures project architecture | Medium | High | B/D/E | Project-owned rules/adapters; isolated preflight; rejection criteria |
| TR-010 | Exact Unity 6.3/package compatibility differs from claims | Medium | High | Setup/B/D/E | Do not invent compatibility; resolve versions; isolated preflight |
| TR-011 | Large asset imports make rollback and Git impractical | High | High | Setup/E | Separate import packages, manifests, hashes, pre-import bundle/tag |
| TR-012 | Third-party licence/provenance becomes incomplete | Medium | Critical | Setup/E | Mandatory register and untouched originals; block unregistered import |
| TR-013 | NavMesh/traffic spatial models diverge | Medium | High | D | Explicit foot/nav versus lane boundaries; shared world anchors/diagnostics |
| TR-014 | Population spawn/despawn is visible or unsafe | Medium-high | High | D/F | Central director, view/danger checks, hysteresis, evidence records |
| TR-015 | AI targets the human unfairly | Medium | High | D | Scored target selection, hysteresis, telemetry, bot-versus-bot tests |
| TR-016 | Reload/action state interactions regress | Medium | Medium | A/C | Explicit state matrix and EditMode tests |
| TR-017 | Tuning or future replacement concerns create precautionary abstractions | Medium | High | All | Build only concrete current-gate code; add boundaries only for demonstrated need |
| TR-018 | Minimap or VFX introduces unnecessary systems | Medium | Medium | D/E | Custom simple minimap; Particle System first; VFX Graph deferred |
| TR-019 | Future multiplayer concerns cause speculative overarchitecture | Medium | High | All | Preserve IDs/intents/rule separation only; no network features |
| TR-020 | Automated success is mistaken for feel/visual acceptance | Medium | High | Every gate | Mandatory visible Human Developer review |
| TR-021 | Partial/crashed performance runs are accepted | Medium | High | F | Reject incomplete sets; record environment/config and repeat |
| TR-022 | Work packages consume too much state/context | High | High | All | Small packages, explicit restart state, separate import/code/review |
| TR-023 | Dirty parent repository obscures document scope | Medium | Medium | Planning | Record baseline; never stage; compare exact path list |
| TR-024 | No independent encrypted offline backup | Existing | High | Setup | Resolve DEC-023 operational gap before relying on remote alone |

## Critical Risk Responses

### TR-001 — Scope Capacity

The design requires all major systems, but not production depth. Preserve required breadth and reduce fidelity in this order:

1. lower civilian/traffic variety while keeping behavior categories;
2. simplify police tactics while retaining wanted level 1 and both unit types;
3. reduce environmental destruction variety while retaining representative props;
4. reduce visual/audio content variety while retaining readable feedback and one music track;
5. reduce map size only while it remains multi-block and supports foot/vehicle play.

Do not remove one human plus up to eleven bots, required weapons/vehicles, vehicle theft/damage/explosions, traffic, pedestrians, wanted level 1, police, HUD/minimap, timer/score/respawn, or both-camera architectural capability without a product-scope decision.

### TR-002 — Vehicle Foundation

Run a compact Gate B spike before vehicle content. Keep the lifecycle project-owned. Add an AI input boundary only when the bot-driving work package actually begins. If stable arcade feel is not reached within the approved custom budget, stop; do not deepen custom suspension/drivetrain complexity or prebuild a Store adapter. A separately authorised RCCP preflight must compare total integration cost, not demo-scene appearance.

The completed RCCP comparison confirms why parity must be configuration-based: the first combined F2 variant changed mass, torque, steering, axle ownership, presentation, and camera. F3 restored the manufacturer Coupe and camera and passed Human parity review. RCCP remains conditional; preserve F3 as the baseline and do not treat derived tuning as manufacturer parity.

### TR-003 — Traffic and Pedestrian Cost

Build exactly one representative intersection with lanes, one signal/reservation mode, pedestrian crossing, flee/return, stuck detection, recovery, and visibility-safe population. Measure authoring time and failure rate. Scale only if the approach is maintainable. A combined Store system is justified for preflight only if it closes this demonstrated gap and accepts `PopulationDirector` authority.

The completed combined preflight establishes `Package Limitation`: the bounded recovery PoC failed F1 pedestrian-to-pedestrian recovery, F3 representative pedestrian avoidance around the player vehicle, F4 small-road-obstacle recovery, and F5 multi-vehicle deadlock recovery. Complete City Traffic & Pedestrian System is retained only for a controlled ambient prototype trial that constrains route networks, road width, agent count, and scenario selection and may remove persistent blockers. Universal local avoidance is not an acceptance assumption.

### TR-005 — Camera and Occlusion

Validate the fixed rig in a synthetic block at Gate A and with NYC/Diner/Port representatives at Gate E. Occlusion must restore reliably with multiple overlapping buildings and both camera policies. If material diversity makes project-owned fading fragile, preflight See-through Shader; do not replace URP or globally modify publisher shaders.

### TR-006 — Asset Cohesion

Use NYC as structural base and Diner as the single complete landmark. Reuse Diner subassets sparingly. Keep Port in a bounded optional district/prop role until further evidence. Record before/after material variants and reject adaptations that become full custom asset production. No package is assumed release-ready.

### TR-007 — Combined Performance

Establish budgets before the final map is visually complete. Instrument population counts, AI sensor rates, navigation requests, physics contacts/queries, explosion fan-out, pooled object counts, real-time lights, draw calls, triangles, VFX, GC, and frame-time percentiles. Optimize measured bottlenecks only. A performance tool cannot be justified by sale price or intuition.

### TR-009 — Third-Party Lock-in

Reject or defer a candidate if:

* it must own match, score, damage, wanted, spawn, or population policy;
* its data cannot be rebuilt or exported predictably;
* its Editor authoring cannot be validated or repeated autonomously;
* it requires broad publisher-material edits or uncontrolled project settings;
* batch validation is impossible;
* updates force invasive project-rule changes;
* its runtime state cannot be observed well enough to debug gate failures.

### TR-010 — Compatibility Evidence

Evidence tiers:

1. **Direct local proof:** clean import/compile/run under exact Unity, URP, target, graphics API, and representative configuration.
2. **Official exact-version evidence:** publisher/Unity table for the exact baseline.
3. **Official nearby-version claim:** useful for shortlist only.
4. **Marketing/community claim:** insufficient for adoption.

Current direct evidence exists for the bounded NYC, Diner, and Port selections under Unity `6000.3.19f1`/URP, with visual/cohesion limitations. It does not transfer to the tool candidates. RCCP has nearby Unity 6000/URP store evidence; the traffic system has a publisher Unity 6 claim; A* Pro and See-through Shader lack exact Unity 6.3 proof in the local research record.

### TR-011 and TR-012 — Asset Recovery and Provenance

Before each large import, record archive/subset hashes, source, version, licence, selected paths, dependencies, expected tracked/untracked state, and reset procedure. Create a rollback point. Never intermingle unrelated coding. Block promotion to the FFA map until provenance and licence entries are complete.

### TR-019 — Multiplayer Dead Ends

The correct first-prototype response is limited: stable actor IDs, input intents, rule/presentation separation, data-driven configuration, and no input reads inside simulation actors. Deterministic physics, authoritative-server logic, network serialization, prediction, rollback, lobbies, and account state are explicitly premature. Future networking may still require substantial work; this architecture only avoids needless coupling.

## Candidate Preflight Stop Criteria

### Complete City Traffic & Pedestrian System

Stop/reject if the tiny test cannot demonstrate:

* deterministic-enough route/intersection authoring and recovery;
* external control of spawn/despawn and global caps;
* project-owned flee/return and danger reaction;
* coexistence with Crime99 driveable vehicles and theft;
* police routing extension without forking core vendor code;
* clean batch compile/run on Unity `6000.3.19f1` URP;
* acceptable authoring and debugging evidence.

### A* Pathfinding Project Pro

Stop/reject if the adapter leaks vendor types into actor/AI rules, graph generation is unstable for the representative block, local avoidance cost exceeds the measured benefit, or Unity NavMesh already satisfies the recorded need.

### Realistic Car Controller Pro

Stop/reject if arcade tuning remains simulation-heavy, bot intent requires demo/input coupling, theft/damage lifecycle cannot stay project-owned, collisions/roadkills are unstable, ten simultaneous vehicle failures are costly, or the package conflicts with traffic vehicles.

## Verified Preflight Troubleshooting Knowledge

These recurring findings are retained here because they affect later Crime99 package trials. Detailed raw reports remain local in the untracked preflight workspaces.

- **URP and legacy materials:** Built-in `Standard`/legacy materials and vendor property-block emission can render objects black or magenta under URP. Use project-owned runtime material clones or separately approved converted derivatives, copy only compatible properties, clear conflicting property blocks, and never edit publisher originals.
- **Scene lighting:** material compatibility alone did not make the review scene reliable. Establish explicit bounded ambient light and a review-only directional light, then validate a visible Windows render. Review lighting is not approved production art.
- **Unity Hub IPC licensing:** Unity Hub was signed in and the Personal licence active. Unity started inside an isolated process could not see Hub's IPC licensing channel and exited with code `198`. The verified path starts Unity from the normal host process context with `-useHub -hubIPC` and, for unattended runs, `-acceptSoftwareTermsForThisRunOnly`; a login or licence reactivation request is not the first remedy.
- **RCCP parity:** compare exact manufacturer vehicle, Rigidbody, wheel/axle, input, and camera configuration before diagnosing integration physics. The F2 derivative invalidated parity; F3 restored the manufacturer Coupe and camera and passed Human comparison.
- **Review particles:** legacy RCCP exhaust and braking particles became oversized, opaque, and red after review rendering conversion. The review-only fix stops, clears, and disables all RCCP particle emission/renderers without changing physics, wheels, input, camera, or F3 handling. Production particle migration remains separate.

Later trials must verify these fixes in a visible player and record Unity/package versions, cause, solution, validation result, remaining limitation, and date. This summary does not authorise vendor-file edits or production migration.

### See-through Shader

Stop/reject if representative materials require destructive source edits, multiple occluders restore incorrectly, visual treatment conflicts with Neon over Dirt, transparent sorting breaks, or frame cost is disproportionate.

## Gate Stop Criteria

| Gate | Mandatory stop |
|---|---|
| A | Unresolved input latency, aim ambiguity, camera-rule violation, or motor instability |
| B | No distinct/stable four-class feel, unsafe interaction, or no clean AI drive seam |
| C | Duplicate damage/score, unstable chain physics, unreadable impact, or vehicle dominance |
| D | Systematic AI collapse, human targeting bias, permanent traffic deadlock, unsafe spawn, stale restart state |
| E | Heavy adaptation required, camera combat occlusion, package/shader blocker, conspicuous duplication |
| F | Frequent errors, incomplete evidence, input/physics collapse, memory growth, repeatable device failure, or scope change needed |

## Contingency and Work Consumption

Prior workflow observations indicate that even bounded Unity phases can consume material portions of a five-hour allowance. Those observations are not targets or forecasts. Plan Crime99 work in smaller units than the earlier SideScroller phases because imports, vehicle physics, AI, traffic, and visual review carry more state and interaction.

Recommended contingency:

* reserve roughly 25–35% of each high-risk gate budget for integration, regression, and evidence;
* limit a large import to one package/subset and one reset boundary per work package;
* stop before starting a second high-risk subsystem when less than one complete validation/handover cycle remains;
* prefer a clean, tested restart state over partially integrating the next system;
* run visible Play Mode as a separate handoff after automated checks, not at the end of an oversized coding task.

All percentages and time ranges are rough and non-binding.

## Human Decisions and Escalations

Human Developer action is required before:

* exact project path/repository creation and implementation start;
* any paid candidate purchase, download, installation, or preflight;
* Git LFS or external asset storage adoption;
* URP replacement or optional package addition;
* a binding performance target or weaker hardware profile;
* scope reduction that removes a confirmed prototype requirement;
* release-asset classification;
* networking work;
* staging, commit, or push.

## Review Checklist

Before any gate advances, confirm:

* canonical scope and gate order are unchanged;
* fixed camera constraints are honored for prototype 1;
* later rotatable camera remains possible without contaminating player/aim logic;
* URP remains the pipeline;
* third-party originals and provenance remain intact;
* Store candidates remain behind explicit project authority;
* test and human-review evidence are complete;
* no purchase/download/install or Git authority was inferred;
* restart state and next exact package are documented.
