# Specialist Role Catalog

## Purpose

This catalog defines task-activated review perspectives used by the [Role Operating Model](ROLE_OPERATING_MODEL.md). A role is a responsibility and review lens, not a persistent person, independent authority, or permission to expand scope. Every active role uses the [Role Review Output Schema](ROLE_REVIEW_OUTPUT_SCHEMA.md).

## Core Governance Roles

### Human Developer

- **Mission:** Own product vision, taste, budget, priorities, purchases, scope expansion, and final approval.
- **Responsibility:** Decide genuine product questions and accept or reject the consolidated result.
- **Excluded decisions:** None inside Human authority; technical facts and licence constraints may not be wished away.
- **Inputs:** Director recommendation, role verdicts, evidence, conflicts, costs, and alternatives.
- **Mandatory checks:** Confirm that the requested decision is genuinely Human-owned and that material dissent is visible.
- **Evidence:** Recorded decision or approval boundary.
- **Typical hard errors:** Being asked to repair a clear in-scope defect; receiving a softened or incomplete FAIL.
- **Verdict:** Human decision, not a specialist verdict.
- **Escalation:** May narrow, stop, redirect, or authorise new scope.
- **Activation:** Final approval and every true product, taste, budget, or scope decision.

### ChatGPT Director

- **Mission:** Orchestrate scope, work orders, role activation, conflicts, and consolidated recommendations.
- **Responsibility:** Translate Human direction into bounded assignments and ensure the required review system is used.
- **Excluded decisions:** Final taste, product, budget, purchase, or release approval; unilateral specialist overrides.
- **Inputs:** Authoritative documents, confirmed decisions, repository state, Producer consolidation, and Human direction.
- **Mandatory checks:** Authority order, permissions, scope, mandatory roles, unresolved contradictions, and handoff readiness.
- **Evidence:** Work order, role activation record, and consolidated recommendation.
- **Typical hard errors:** Missing mandatory role; hidden conflict; invented authority; ignored FAIL.
- **Verdict:** Uses the handoff status produced under the Review Board Protocol.
- **Escalation:** Escalates only genuine Human decisions or unresolved authoritative contradictions.
- **Activation:** Every Director-led assignment.

### Producer / Scope Controller

- **Mission:** Keep the assignment bounded, reviewable, dependency-aware, and ready for handoff.
- **Responsibility:** Define active scope, mandatory roles, evidence, hard fails, dependencies, correction limits, stop boundaries, and final consolidation.
- **Excluded decisions:** Product strategy, art direction, architecture, budget approval, or changing another role's verdict.
- **Inputs:** Work order, authority sources, role matrix, current state, risks, and all separate role outputs.
- **Mandatory checks:** Scope breadth; complete role activation; dependencies; hidden expansion; correction-round count; unresolved hard fails; final-version evidence.
- **Evidence:** Scope record, dependency/role list, correction trace, and Producer consolidation.
- **Typical hard errors:** Scope growth without authority; omitted role; third autonomous correction round; presenting incomplete work as ready.
- **Verdict:** `PASS`, `PASS WITH CONCERNS`, `FAIL`, `BLOCKED BY HUMAN DECISION`, or `NOT APPLICABLE`.
- **Escalation:** Director for scope conflicts; Human only for real priority, budget, or expansion decisions.
- **Activation:** Mandatory for every larger work order and every Review Board.

### Technical Director

- **Mission:** Protect architecture, system boundaries, maintainability, reliability, and technical risk.
- **Responsibility:** Review architecture conformance, dependencies, data flow, failure modes, testability, and cross-system effects.
- **Excluded decisions:** Gameplay rules, art direction, Human priorities, or engine/package changes without authority.
- **Inputs:** Approved architecture, technical decisions, code/change map, tests, profiler evidence, and known constraints.
- **Mandatory checks:** Confirmed architecture; no speculative framework; interface ownership; error handling; regression risk; security and performance implications.
- **Evidence:** Design/code references, test results, diagrams where useful, and risk findings.
- **Typical hard errors:** Contradiction of an adopted architecture; hidden dependency; unbounded state ownership; unsafe irreversible migration.
- **Verdict:** Standard role verdicts.
- **Escalation:** Director for architecture contradiction; Human for a required architecture change.
- **Activation:** Architecture, systems, performance, releases, and material cross-system changes.

### QA Lead

- **Mission:** Ensure acceptance criteria, risk-based tests, evidence quality, and regression coverage are sufficient.
- **Responsibility:** Define test strategy, verify evidence provenance and recency, triage defects, and guard the quality gate.
- **Excluded decisions:** Replacing specialist judgment, accepting known hard fails, or declaring Human visual/feel approval.
- **Inputs:** Work order, acceptance criteria, build/version identity, test results, specialist outputs, and defect history.
- **Mandatory checks:** Requirement coverage; correct evidence type; reproducibility; regression; negative/edge cases; unresolved defects; final-version alignment.
- **Evidence:** Test matrix, logs/results, reproduction records, and evidence manifest.
- **Typical hard errors:** Missing required evidence; tests against the wrong version; untested regression surface; technical pass presented as visual/gameplay acceptance.
- **Verdict:** Standard role verdicts.
- **Escalation:** Producer for missing work; Director/Human only when acceptance depends on an authorised decision.
- **Activation:** Mandatory for larger work orders; always for build/release and defect closure.

## Specialist Roles

### Art Director

- **Mission:** Judge whether visible work expresses the approved visual identity coherently and intentionally.
- **Responsibility:** Review visual identity, mood, shape language, colour and light systems, material language, period/style coherence, hierarchy, references, visible placeholders, the Art Bible, and `Use / Avoid` rules.
- **Excluded decisions:** Technical architecture, gameplay rules, budget, purchases, or replacing Human taste.
- **Inputs:** Approved Art Bible and references; final gameplay-camera evidence; comparison profiles; asset/period records; visual QA result.
- **Mandatory checks:** Identity is visible rather than merely documented; warm/cool and colour roles are controlled; forms and materials belong together; lighting guides attention; reference intent is honoured without copying; no visible placeholder or prohibited style element remains.
- **Evidence:** Matched gameplay images/video, reference mapping, palette/lighting comparison, and exact defect locations.
- **Typical hard errors:** Magenta/broken surfaces; visible placeholder; style or period break; required identity absent; indiscriminate effects; unreadable hierarchy.
- **Verdict:** Standard role verdicts; any applicable Visual QA hard fail requires `FAIL`.
- **Escalation:** Human for taste or a change to approved direction; Producer for in-scope correction.
- **Activation:** Art Bible, visible assets, environments, characters, vehicles, UI, VFX, lighting, and presentation.

### Game Design Reviewer

- **Mission:** Verify that a feature serves approved player goals, rules, balance intent, and understandable choices.
- **Responsibility:** Review mechanics, feedback, states, incentives, failure/recovery, exploits, pacing, and interaction with existing systems.
- **Excluded decisions:** Inventing new product pillars, monetisation, narrative direction, or technical architecture.
- **Inputs:** Approved design documents, tuning data, playable evidence, telemetry where available, and edge-case tests.
- **Mandatory checks:** Intended player decision exists; rules are legible; dominant/exploit paths are controlled; failure and recovery are fair; feature fits scope and pillars.
- **Evidence:** Scenario results, tuning comparisons, interaction traces, and playtest observations.
- **Typical hard errors:** Requirement absent; unavoidable failure; trivial dominant strategy; contradictory rule; broken recovery loop.
- **Verdict:** Standard role verdicts.
- **Escalation:** Human for competing design alternatives; Producer for resolvable defects.
- **Activation:** Gameplay, vehicles, AI, maps, UI flows, audio feedback, and balance changes.

### Level Designer

- **Mission:** Judge spatial play, navigation, pacing, encounter opportunities, and believable use of place.
- **Responsibility:** Review scale, routes, orientation, sightlines, landmarks, spatial sequences, traffic/pedestrian logic, gameplay spaces, spawn/respawn plausibility, environmental storytelling, camera, and occlusion effects.
- **Excluded decisions:** Game-wide rules, final art taste, architecture, or unauthorised world/lore changes.
- **Inputs:** Level brief, approved mechanics, map/plan, gameplay-camera evidence, route/path tests, reference research, and applicable level standards.
- **Mandatory checks:** Clear scale and hierarchy; multiple useful routes where required; comprehensible entries/exits; landmark orientation; plausible vehicle and foot flow; useful combat/escape spaces; safe spawn logic; readable camera/occlusion; credible fronts, backs, services, and boundaries.
- **Sandbox/FFA checks:** Multiple viable routes; vehicle circulation; chaos and escape opportunities; no accidental choke monopoly; urban credibility; resolved map edges and module transitions.
- **Evidence:** Plan with route annotations, continuous foot/vehicle traces, sightline/landmark views, spawn analysis, and gameplay observations.
- **Typical hard errors:** Unusable critical route; accidental single choke; scale mismatch; hidden spawn; dead-end vehicle trap; unresolved map edge; camera-hostile space.
- **Verdict:** Standard role verdicts.
- **Escalation:** Human for intentional route/experience trade-offs; Producer for in-scope layout corrections.
- **Activation:** Level/map work, visual slices, spawn changes, camera-affecting environments, and modular kits.

### Technical Artist

- **Mission:** Ensure the intended visible result is produced reliably within the rendering and performance constraints.
- **Responsibility:** Review materials, shaders, render pipeline, VFX, lighting technique, imports, LODs, colliders, occlusion, budgets, and measured versus visible outcome.
- **Excluded decisions:** Product rules, final art direction, system architecture beyond the art pipeline, or editing protected originals.
- **Inputs:** Art Bible, final renders, import settings, material/shader state, renderer/LOD/collider data, profiler evidence, and asset ownership.
- **Mandatory checks:** No error shader; correct pipeline/material behaviour; intended result readable at gameplay distance; valid import/scale; LOD transition; collision suitability; occlusion implementation/restoration; VFX/lighting cost; no mismatch between metrics and appearance.
- **Evidence:** Gameplay captures, material/import inspection, LOD/collider views, shader/pipeline validation, and profiler measurements.
- **Typical hard errors:** A technically valid shader that renders magenta or wrong; missing material; broken LOD; destructive original edit; severe overdraw; non-restoring occlusion.
- **Verdict:** Standard role verdicts. Visible failure cannot be passed because a shader compiles.
- **Escalation:** Art Director for intended appearance; Technical Director for pipeline architecture; Producer for correction.
- **Activation:** Asset integration, visible work, VFX, materials, lighting, occlusion, and performance.

### Asset & Provenance Manager

- **Mission:** Ensure each asset is known, lawful, complete, reproducible, suitable, and release-assessable.
- **Responsibility:** Review package coverage, asset families, licence/provenance, version, original path, manufacturer integrity, original/override separation, style/period fit, camera/occlusion suitability, multi-angle evidence, usage/repetition risk, release state, and reimport.
- **Excluded decisions:** Buying/downloading assets, legal conclusions beyond documented licence evidence, art-direction changes, or editing originals.
- **Inputs:** Package inventory, licence/source record, hashes/version, demo scenes, asset-family catalog, multi-angle/gameplay captures, import settings, and derivative map.
- **Mandatory checks:** Complete relevant package inventory before scene construction; provenance fields; original integrity; intended family coverage; style/period filter; multiple angles and gameplay distance; camera/occlusion behaviour; duplication risk; reimport recipe; explicit release-candidate status.
- **Evidence:** Inventory and candidate record, hashes/version, source paths, image/contact sheet references, use map, override list, and restore/reimport test.
- **Typical hard errors:** Unknown licence/source; edited manufacturer original; incomplete package inspection presented as complete; missing family; untraceable override; unsupported release claim.
- **Verdict:** Standard role verdicts.
- **Escalation:** Human for purchase, budget, licence risk acceptance, or new asset direction; Producer for missing records.
- **Activation:** Purchase research, import, integration, package updates, map/asset selection, and release.

### Unity Specialist

- **Mission:** Review Unity-specific correctness and maintainable use of the confirmed engine baseline.
- **Responsibility:** Inspect Unity APIs, serialization, scenes/prefabs, packages, URP, project settings, build configuration, import behaviour, tests, and platform output.
- **Excluded decisions:** Replacing confirmed architecture, changing engine/package baselines, or approving gameplay/visual quality.
- **Inputs:** Confirmed Unity decisions, project state, changed paths, console/build logs, tests, and package/import records.
- **Mandatory checks:** Missing references/scripts; serialization integrity; scene/prefab ownership; API/package compatibility; settings changes; build/profile correctness; Editor/Player parity; no unintended generated or vendor files.
- **Evidence:** Unity validation, test/build results, scene/reference inspection, and changed-file audit.
- **Typical hard errors:** Broken scene/prefab; missing script; incompatible package; unintended ProjectSettings change; vendor payload staged; build failure.
- **Verdict:** Standard role verdicts.
- **Escalation:** Technical Director for architecture; Human for baseline/package change.
- **Activation:** Any Unity-specific implementation or integration.

### Camera & Occlusion Reviewer

- **Mission:** Ensure relevant actors, vehicles, routes, and spaces remain readable across gameplay-camera movement and occlusion transitions.
- **Responsibility:** Review the Camera Coverage Matrix, foot/vehicle positions, continuous paths, player/opponent/vehicle visibility, Entry/Behind/Exit/Restored/Re-entry, camera switches, and restoration failures.
- **Excluded decisions:** Changing camera policy, art direction, or occlusion architecture without authority.
- **Inputs:** Applicable camera/occlusion standards, exact camera profiles, position matrix, continuous route evidence, transition sequences, and runtime reset/target-change results.
- **Mandatory checks:** All applicable position classes; continuous foot/vehicle routes; every critical hard occluder; actor visibility; target switches; repeated re-entry; correct renderer restoration; no flicker, stale state, or neighbouring-object error.
- **Evidence:** Exact matrix rows, videos or tightly sampled sequences, camera/actor positions, and runtime results.
- **Typical hard errors:** Active actor fully lost; missing required matrix class; endpoint-only evidence; non-restoring occluder; flicker; wrong neighbouring renderer affected.
- **Verdict:** Standard role verdicts; an applicable camera/occlusion hard fail requires `FAIL`.
- **Escalation:** Human only for a camera/readability trade-off or approved visual exception.
- **Activation:** Levels, cameras, large geometry, vehicles, presentation, and occlusion changes.

### Gameplay QA Reviewer

- **Mission:** Validate the result through representative player actions and adversarial gameplay scenarios.
- **Responsibility:** Review controls, state transitions, interaction, feel/readability, movement routes, combat/vehicle/AI edge cases, reset/respawn, and regressions.
- **Excluded decisions:** Final design taste, architecture, or treating automated success as subjective acceptance.
- **Inputs:** Work order, playable build/scene, controls, expected behaviours, test results, and known risks.
- **Mandatory checks:** Happy path; invalid/rapid input; boundary states; recovery/reset; representative play route; affected regressions; actual gameplay-camera readability.
- **Evidence:** Reproduction steps, observed results, video/sequences where relevant, and build identity.
- **Typical hard errors:** Core loop unavailable; stuck state; input/state exploit; failed recovery; required action unreadable or unreachable.
- **Verdict:** Standard role verdicts.
- **Escalation:** Game Design Reviewer for intended behaviour; Producer for repair; Human for feel trade-offs.
- **Activation:** Gameplay, levels, vehicles, AI, UI interaction, defects, and release.

### Performance Analyst

- **Mission:** Determine whether representative workloads meet explicit budgets without hiding quality failures.
- **Responsibility:** Establish measurement conditions, profile CPU/GPU/memory/loading, identify bottlenecks, compare before/after, and assess scalability.
- **Excluded decisions:** Reducing visible/gameplay quality without authority, inventing budgets, or approving other domains.
- **Inputs:** Target hardware/budgets, representative build/scenario, profiler captures, counts, and comparison baseline.
- **Mandatory checks:** Reproducible conditions; representative worst case; frame time rather than averages alone; allocations/memory; spikes; visual equivalence after optimisation.
- **Evidence:** Profiler captures, percentile/frame/memory tables, scenario identity, and before/after comparison.
- **Typical hard errors:** Budget breach; non-representative benchmark; regression hidden by averages; optimisation changes required behaviour.
- **Verdict:** Standard role verdicts.
- **Escalation:** Human/Director when meeting budget requires a quality or scope trade-off.
- **Activation:** Performance work, population, VFX, maps, platforms, and releases.

### UI/UX Reviewer

- **Mission:** Ensure interactions and information are clear, accessible, consistent, and subordinate to gameplay.
- **Responsibility:** Review flows, hierarchy, readability, input feedback, states, accessibility, resolution/layout, and error/recovery messaging.
- **Excluded decisions:** Product rules, final visual taste, or technical architecture.
- **Inputs:** Approved UX/UI direction, interaction map, target resolutions, gameplay captures, accessibility requirements, and input modes.
- **Mandatory checks:** Task completion; state visibility; focus/navigation; readable scale/contrast; localisation resilience where applicable; gameplay obstruction; error recovery.
- **Evidence:** Flow walkthrough, annotated captures, interaction tests, and target-resolution matrix.
- **Typical hard errors:** Required action unavailable; unreadable critical information; trapped flow; inaccessible control; UI blocks gameplay.
- **Verdict:** Standard role verdicts.
- **Escalation:** Human for equivalent interaction/style options.
- **Activation:** UI, HUD, menus, prompts, settings, onboarding, and releases.

### Audio Reviewer

- **Mission:** Ensure audio communicates state, supports mood, remains coherent, and behaves correctly in context.
- **Responsibility:** Review event coverage, priority, mix, spatialisation, repetition, transitions, accessibility cues, and technical playback.
- **Excluded decisions:** Narrative/product direction or final music taste without Human input.
- **Inputs:** Audio direction, event list, playable build, mix targets, implementation map, and performance evidence.
- **Mandatory checks:** Required action/state cues; no missing or stuck events; mix hierarchy; spatial correctness; repetition fatigue; profile/platform behaviour.
- **Evidence:** Event matrix, recordings, meter/profiler results, and gameplay observations.
- **Typical hard errors:** Missing critical cue; persistent/stuck sound; clipping; misleading spatial/state feedback; unusable mix.
- **Verdict:** Standard role verdicts.
- **Escalation:** Human for musical/taste choices; Producer for missing implementation.
- **Activation:** Audio work, gameplay feedback, levels, UI, and release.

### Narrative / Worldbuilding Reviewer

- **Mission:** Ensure story, place, period, culture, and environmental details remain internally coherent and serve approved direction.
- **Responsibility:** Review narrative continuity, world rules, naming, environmental storytelling, period/usage logic, and contradiction with approved lore.
- **Excluded decisions:** Inventing major lore, plot, factions, or tone without authority.
- **Inputs:** Approved narrative/world documents, Art Bible, level/asset evidence, dialogue/text, and reference research.
- **Mandatory checks:** Continuity; causal use of spaces/props; period coherence; readable environmental story; no accidental unsupported claim.
- **Evidence:** Source-to-result mapping, contradiction list, and annotated environmental/text examples.
- **Typical hard errors:** Direct lore contradiction; period-breaking focal element; critical narrative beat absent or misleading.
- **Verdict:** Standard role verdicts.
- **Escalation:** Human for new lore or competing interpretations.
- **Activation:** Narrative content, environments, naming/text, period-sensitive assets, and releases.

### Release Reviewer

- **Mission:** Determine whether the exact candidate is distributable, reproducible, documented, and free of known blocking risks.
- **Responsibility:** Review candidate identity, build/test/role verdicts, licences, provenance, configuration, secrets, packaging, rollback, known issues, and approval status.
- **Excluded decisions:** Waiving a specialist FAIL, accepting legal/business risk, or authorising release.
- **Inputs:** Final candidate, all mandatory verdicts, QA report, asset/provenance records, release checklist, and Human boundary.
- **Mandatory checks:** No open hard fail; exact final-version evidence; clean package; licences; secrets; reproducibility; versioning; rollback; Human approval required.
- **Evidence:** Candidate manifest/hash, checklist, build and smoke results, licence/provenance register, and consolidated verdicts.
- **Typical hard errors:** Wrong/unreproducible candidate; missing licence; secret or vendor payload; open mandatory FAIL; untested last-minute change.
- **Verdict:** Standard role verdicts; never final release approval.
- **Escalation:** Human for release approval and accepted business risk.
- **Activation:** Build/release candidates, patches, and public distribution.
