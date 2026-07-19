# Example — Visual Level Work Order

This complete abstract example is based on the type of work represented by the Crime99 Playable Presentation Block. It does not authorise or change Unity files.

## Work Order

**Assignment:** Improve the readability and presentation foundation of one bounded elevated-camera urban block without expanding it into a full map.

**Authoritative sources:** approved project art direction; project Visual QA, Camera Coverage, and Occlusion standards; Studio OS Visual QA workflow; asset/provenance policy.

**Authorised scope:** project-owned vehicle materials, practical visibility lighting, road/sidewalk material response, believable installed light sources, two distinguishable lighting profiles, one bounded runtime-occlusion slice, twenty registered gameplay positions, one continuous foot route, one vehicle route, and evidence regeneration.

**Explicit exclusions:** broader dressing, figures, combat VFX, traffic, bots, new assets, purchases, downloads, manufacturer edits, full-map work, new camera policy, and release claims.

**Builder Role:** Unity Visual Integration Builder.

**Mandatory roles:** Producer / Scope Controller; Art Director; Level Designer; Technical Artist; Asset & Provenance Manager; Unity Specialist; Camera & Occlusion Reviewer; Gameplay QA Reviewer; QA Lead.

**Optional roles:** Performance Analyst if frame/memory cost changes materially; UI/UX Reviewer if the evaluation overlay changes; Narrative / Worldbuilding Reviewer if environmental storytelling is added.

**Review Board:** [Visual Level Review Board](../../Roles/Boards/VISUAL_LEVEL_REVIEW_BOARD.md).

## Review Questions and Evidence

- Art Director: Is the approved identity visible, with believable sources, coherent materials, and no test-scene look?
- Level Designer: Are routes, scale, courtyard, service alley, boundary, and vehicle flow credible and readable?
- Technical Artist: Do URP materials, imports, lights, LODs, colliders, occlusion, and visible results pass together?
- Asset & Provenance Manager: Are originals intact, derivatives traceable, package families understood, and camera/period suitability recorded?
- Camera & Occlusion Reviewer: Do all registered positions and continuous routes pass Entry/Behind/Exit/Restored/Re-entry and target switching?
- Gameplay QA Reviewer: Can a player walk, enter, drive, exit, reset, switch profiles, and traverse critical routes without stuck or unreadable states?
- QA Lead: Does all evidence identify the same final build and cover regression and negative cases?
- Producer: Is the result still inside the bounded block and ready under the weakest mandatory verdict?

Required evidence includes exact scene/build identity; matched gameplay captures for all positions/profiles; foot and vehicle sequences; occlusion transitions; material/import/reference validation; tests/build/start/log and proportional performance evidence; original/override integrity; matched Before/After evidence; and separate role outputs.

## Hard Fails and Correction Loop

Hard fails: magenta/missing/wrong required material; active target lost behind tested geometry; abstract emission where an installed source is required; indistinguishable profiles; unfinished boundary or placeholder; missing position/path/occlusion evidence; manufacturer edit; or mandatory role `FAIL`.

Round 1 corrects the highest-impact hard fails, regenerates evidence, and reruns affected roles. Round 2 may correct remaining in-scope failures once. A third round, new asset, camera-policy change, or broader dressing stops for a new assignment.

## Illustrative Separate Role Verdicts

### Art Director

- **Reviewed Scope:** Final gameplay captures for both profiles.
- **Evidence Reviewed:** Position register, matched captures, and approved reference direction.
- **Strengths:** Practical-source hierarchy and vehicle material are coherent.
- **Defects:** Service yard lacks sufficient use history.
- **Hard Fails:** None.
- **Concerns:** First-ten-second presentation remains only adequate.
- **Required Corrections:** None inside the authorised foundation scope.
- **Optional Improvements:** Add bounded use-history dressing later.
- **Open Human Decisions:** Profile preference.
- **Verdict:** `PASS WITH CONCERNS`.

### Level Designer

- **Reviewed Scope:** Main street, junction, courtyard, alley, boundaries, and routes.
- **Evidence Reviewed:** Plan, route sequences, and position matrix.
- **Strengths:** Multiple usable routes and credible service access.
- **Defects:** One boundary connection is visually weak but functionally resolved.
- **Hard Fails:** None.
- **Concerns:** Later full-map continuation needs a stronger landmark relationship.
- **Required Corrections:** None in this bounded block.
- **Optional Improvements:** Review connected-block sightlines later.
- **Open Human Decisions:** None.
- **Verdict:** `PASS WITH CONCERNS`.

### Technical Artist

- **Reviewed Scope:** URP materials, lighting, LOD/renderers, occlusion, and performance.
- **Evidence Reviewed:** Validation output, gameplay captures, and profiler baseline.
- **Strengths:** No error shaders; project-owned overrides restore correctly.
- **Defects:** Monolithic publisher LOD limits selective fade granularity.
- **Hard Fails:** None under the documented bounded exception.
- **Concerns:** Full-map cost is not proven.
- **Required Corrections:** None.
- **Optional Improvements:** Test representative multi-building load later.
- **Open Human Decisions:** Accept or reject the visual fade character.
- **Verdict:** `PASS WITH CONCERNS`.

### Asset & Provenance Manager

- **Reviewed Scope:** Vehicle/building source integrity and project-owned overrides.
- **Evidence Reviewed:** Version/path records, integrity report, override list, and multi-angle captures.
- **Strengths:** Originals unchanged and derivatives traceable.
- **Defects:** No asset is yet a release candidate.
- **Hard Fails:** None.
- **Concerns:** Package-wide release suitability remains unproven.
- **Required Corrections:** None for prototype evaluation.
- **Optional Improvements:** Complete release audit before release planning.
- **Open Human Decisions:** None.
- **Verdict:** `PASS WITH CONCERNS`.

### Camera & Occlusion Reviewer

- **Reviewed Scope:** Twenty positions, routes, switching, re-entry, and reset.
- **Evidence Reviewed:** Matrix and transition sequences.
- **Strengths:** Active target remains readable and restoration is deterministic.
- **Defects:** Opponent/death cases are absent from this evaluation scene.
- **Hard Fails:** None; those cases are `NOT APPLICABLE` with a reason.
- **Concerns:** Broader map coverage is not implied.
- **Required Corrections:** None.
- **Optional Improvements:** Repeat with combatants later.
- **Open Human Decisions:** None.
- **Verdict:** `PASS WITH CONCERNS`.

### Gameplay QA Reviewer

- **Reviewed Scope:** Walking, driving, enter/exit, reset, profiles, and routes.
- **Evidence Reviewed:** Final build walkthrough and tests.
- **Strengths:** All required interactions recover correctly.
- **Defects:** Ambient pressure is excluded.
- **Hard Fails:** None.
- **Concerns:** Evaluation does not prove FFA readability.
- **Required Corrections:** None.
- **Optional Improvements:** Later representative combat/population test.
- **Open Human Decisions:** None.
- **Verdict:** `PASS WITH CONCERNS`.

### Producer Consolidation

- **Mandatory verdicts:** All at least `PASS WITH CONCERNS`; no `FAIL`.
- **Resolved defects:** Material error, abstract-source problem, incomplete coverage, and active-target occlusion.
- **Open hard fails:** None in the authorised foundation scope.
- **Conflicts:** Technical fade passes; final visual character remains Human-owned.
- **Weakest area:** Environmental use history and presentation depth.
- **Correction rounds used:** Two.
- **Human decisions:** Preferred profile and whether this foundation is accepted as the base for later dressing.
- **Handoff status:** Ready for bounded Human review; not final visual or full-map approval.

## Human Boundary

The Human Developer decides taste, profile preference, acceptance of the fade character, later-dressing priority, and any scope expansion. The Human is not asked to diagnose or repair a known in-scope hard fail.
