# Current Handover

This file preserves only the context needed to continue current work. It is an operational record, not an adopted governance standard.

## Handover Summary

The Human Developer accepted Crime99 Gate C — Impact and Destruction. Commit `97bba7e8ea8c544f5a4d2dc3a7e2b707c6724f8f` (`Implement Crime99 Gate C impact and destruction`) is pushed to `origin/main` without force after clean Git-boundary and full RCCP manufacturer-integrity checks. Gate D — Replayable FFA is authorised. Its mandatory first technical item is correcting the Compact Car and Saloon weapon/projectile hitbox defect with four-class, three-weapon regression coverage. The failed custom Gate B implementation remains only on local archive branch `archive/gate-b-custom-controller-failed`. RCCP `2.57.0` remains ignored and unchanged. Complete City Traffic & Pedestrian System remains conditional and restricted to the controlled Gate D slice; Gate E remains blocked.

Gate A implements normalized keyboard movement, independent mouse aiming, a fixed elevated camera, sprint/stamina, jump, ground-only dodge, a hitscan pistol with magazine/reserve/reload rules, central health damage, six targets, primitive feedback, a test arena, and minimal HUD. Human review confirmed the requested movement, combat, resource, collision, and simple traversal behavior, then identified airborne dodge start as the only defect. The correction blocks jump/fall dodge before stamina or cooldown changes while allowing a grounded dodge to finish normally. Targeted `16/16` EditMode and `3/3` PlayMode tests, full `20/20` EditMode and `3/3` PlayMode suites, compilation, scene loading, visible Play Mode, Development Build, and built-player start passed.

RCCP Gate B provides project-owned Compact Car, Saloon, Van, and Refuse Truck variants backed by unchanged manufacturer assets; player/script/null/disabled control boundaries; safe entry/exit; fixed camera profiles; controlled collisions; damage/disable; minimal HUD; and a bounded technical arena. Compact is now `1600 kg / 330 Nm / 190 km/h / 44°`; Saloon is `2000 kg / 320 Nm / 230 km/h / 34°`; Van and Refuse Truck are unchanged. The arena is `100 m × 360 m` with four safety walls, speed checks through `250 m`, brake markings, and runoff. Camera profiles blend between foot `(0,14,-12)` and vehicle `(0,18,-22)`. Full `31/31` EditMode and `11/11` PlayMode suites including Gate A regression, scene loading, visible Editor Play Mode, Development Build, and built-player start passed. SHA-256 verification confirmed all 3,804 manufacturer files match with no mismatches or extras. Vendor files and generated outputs remain ignored; the amended commit contains 58 project-owned text files.

The Human Developer purchased Realistic Car Controller Pro and Complete City Traffic & Pedestrian System and authorised two sequential isolated technical Preflights plus a later isolated combined integration Preflight. Neither package has been integrated into or finally adopted for Crime99. Both isolated technical Preflights pass and both corrected repeat Human Reviews returned `Conditional Pass`. The combined project technically passes its interface suite, but Human Review exposed poor RCCP feel, vehicle entrapment, pedestrian circling, inadequate detours, crossing blockage, and traffic queues stopped by small obstacles. RCCP parity was later restored; Complete City Traffic & Pedestrian System is now conditionally retained for a controlled prototype trial despite its unchanged recovery limitation.

A bounded RCCP parity/diagnosis pass subsequently isolated the handling comparison defect. The existing combined build did not use the manufacturer configuration: the RCCP Coupe was changed from 1750 kg, 300 Nm, and 40-degree steering to a 1150 kg, 250 Nm, 38-degree project derivative with recomputed steering-axle ownership, and the manufacturer RCCP camera was replaced by a vehicle-local project follow camera. Fixed timestep and global 3D physics settings match the isolated RCCP project. A separated F1 original-faithful / F2 current integration / F3 corrected integration configuration is implemented under `Assets/Crime99RccpParity/`. Its build and smoke pass, and the Human Developer confirmed F3 sufficiently close to F1. Initial code-198 licence failures were caused by isolated-process Hub IPC visibility, not by an inactive licence.

The recovery/local-avoidance build technically passes, but Human review failed F1/F3/F4/F5; F2 and corrected F6 pass. Source inspection confirms useful Gley primitives but no general reciprocal pedestrian avoidance, runtime obstacle-aware rerouting, or coordinated blocked-road recovery. The failed bounded adapter PoC and technical `Package Limitation` remain authoritative. The Human Developer nevertheless formally closed the integration preflight at **Retain for Controlled Prototype Trial** (`Adopt with Conditions` as a status equivalent). This conditionally retains Complete City Traffic & Pedestrian System for a later, separately authorised Crime99 prototype using documented Inspector controls, controlled ambient scenarios, and a new representative Human review. No Crime99 integration or final adoption has occurred.

## Continuation Boundary

Gates A, B, and C are accepted and pushed. Gate D is the active authorised task and must follow the mandated sequence: hitbox correction; match/death/score/respawn; on-foot combat bots; bot vehicles; controlled traffic/pedestrians; Wanted Level 1; police; combined FFA validation. Traffic and police must not begin before the match and combat-bot loop is stable. Gate D ends with one fully validated local commit and no push. Gate E, purchases, downloads, manufacturer-original changes, and broader systems remain outside scope.

At Gate C authorisation, Studio OS root `main` and `origin/main` pointed to `b556a2c214765f9c98b3912af55bc1b5b49b75ac` (`Record Crime99 preflight closure decisions`). The Gate B completion status is recorded by the subsequent `Record Crime99 Gate B completion` commit. Crime99 and all Preflight project workspaces remain untracked from Studio OS and must not be staged there.

## Evidence and Review Files

Canonical tracked package decisions and condensed troubleshooting knowledge:

- `Docs/Projects/Crime99/TECHNICAL_DECISIONS.md`
- `Docs/Projects/Crime99/TECHNICAL_RISK_REVIEW.md`

The following project paths are local untracked supporting evidence and are deliberately excluded from the proposed repository closure staging set:

- Project entry point: `Projects/Crime99/README.md`
- Setup instructions: `Projects/Crime99/Docs/PROJECT_SETUP.md`
- Asset provenance: `Projects/Crime99/Docs/ASSET_PROVENANCE.md`
- Third-party policy: `Projects/Crime99/Docs/THIRD_PARTY_ASSET_POLICY.md`
- Validation report: `Projects/Crime99/Docs/VALIDATION_REPORT.md`
- Exact committed-file manifest: `Projects/Crime99/Docs/COMMITTED_FILES.txt`
- Gate A scene: `Projects/Crime99/Source/Crime99/Assets/_Crime99/Scenes/TestAreas/GateAControls.unity`
- Gate B scene: `Projects/Crime99/Source/Crime99/Assets/_Crime99/Scenes/TestAreas/GateBVehicleFeel.unity`
- Gate B Development Build: `Projects/Crime99/Builds/GateB/Crime99.exe` (ignored)
- RCCP Gate B Human review guide: `Projects/Crime99/Docs/GATE_B_HUMAN_REVIEW.md`
- RCCP Gate B Editor screenshot: `Projects/Crime99/Artifacts/gate-b-rccp-visible.png` (ignored)
- RCCP Gate B build: `Projects/Crime99/Builds/GateB/Crime99.exe` (ignored)
- RCCP Gate B logs, test XML, runtime evidence, and review ZIP: `Projects/Crime99/Artifacts/` (ignored), including `Crime99-GateB-RCCP-Review-Evidence.zip`
- Gate C scene: `Projects/Crime99/Source/Crime99/Assets/_Crime99/Scenes/TestAreas/GateCImpactDestruction.unity`
- Gate C Human review guide: `Projects/Crime99/Docs/GATE_C_HUMAN_REVIEW.md`
- Gate C tuning: `Projects/Crime99/Docs/GATE_C_TUNING.md`
- Gate C Development Build: `Projects/Crime99/Builds/GateC/Crime99.exe` (ignored)
- Gate C screenshot, logs, XML, and Review ZIP: `Projects/Crime99/Artifacts/`, including `gate-c-visible.png` and `Crime99-GateC-Review-Evidence.zip` (ignored)
- RCCP report: `Projects/Crime99RCCPPreflight/RCCP_PREFLIGHT_REPORT.md`
- RCCP Human Review guide: `Projects/Crime99RCCPPreflight/HUMAN_REVIEW.md`
- RCCP Development Build: `Projects/Crime99RCCPPreflight/Builds/Windows/Crime99RCCPPreflight.exe`
- RCCP automated evidence: `Projects/Crime99RCCPPreflight/Evidence/automated-test-report.json`
- RCCP Review ZIP: `Projects/Crime99RCCPPreflight/Artifacts/Crime99RCCPPreflight-Review.zip`
- Traffic & Pedestrian report: `Projects/Crime99TrafficPedestrianPreflight/TRAFFIC_PEDESTRIAN_PREFLIGHT_REPORT.md`
- Traffic & Pedestrian Human Review guide: `Projects/Crime99TrafficPedestrianPreflight/HUMAN_REVIEW.md`
- Traffic & Pedestrian Development Build: `Projects/Crime99TrafficPedestrianPreflight/Build/Crime99TrafficPedestrianPreflight.exe`
- Traffic & Pedestrian automated Editor evidence: `Projects/Crime99TrafficPedestrianPreflight/Evidence/technical-preflight-result.json`
- Traffic & Pedestrian built-player evidence: `Projects/Crime99TrafficPedestrianPreflight/Evidence/player-runtime-result.json`
- Traffic & Pedestrian Review ZIP: `Projects/Crime99TrafficPedestrianPreflight/Artifacts/Crime99TrafficPedestrianPreflight-Review.zip`
- Combined isolated-Preflight handover: `Projects/Crime99TrafficPedestrianPreflight/COMBINED_HANDOVER.md`
- Combined integration report: `Projects/Crime99RCCPTrafficIntegrationPreflight/INTEGRATION_PREFLIGHT_REPORT.md`
- Combined integration Human Review: `Projects/Crime99RCCPTrafficIntegrationPreflight/HUMAN_REVIEW.md`
- Combined integration build: `Projects/Crime99RCCPTrafficIntegrationPreflight/Build/Crime99RCCPTrafficIntegrationPreflight.exe`
- Combined integration automated evidence: `Projects/Crime99RCCPTrafficIntegrationPreflight/Evidence/integration-preflight-result.json`
- Recovery diagnosis/report: `Projects/Crime99RCCPTrafficIntegrationPreflight/RECOVERY_LOCAL_AVOIDANCE_REPORT.md`
- Recovery Human Review: `Projects/Crime99RCCPTrafficIntegrationPreflight/HUMAN_REVIEW_RECOVERY.md`
- Recovery Human Review result: `Projects/Crime99RCCPTrafficIntegrationPreflight/HUMAN_REVIEW_RECOVERY_RESULT.md`
- Recovery Windows Build: `Projects/Crime99RCCPTrafficIntegrationPreflight/Build/RecoveryLocalAvoidanceReview/RecoveryLocalAvoidanceReview.exe`
- Recovery final player log: `Projects/Crime99RCCPTrafficIntegrationPreflight/Source/Crime99RCCPTrafficIntegrationPreflight/RecoveryEvidence/player-final-smoke.log`
- Final reviewability smoke log: `Projects/Crime99RCCPTrafficIntegrationPreflight/Source/Crime99RCCPTrafficIntegrationPreflight/RecoveryEvidence/reviewability-smoke-final.log`
- Final visible review capture/log: `Projects/Crime99RCCPTrafficIntegrationPreflight/Source/Crime99RCCPTrafficIntegrationPreflight/RecoveryEvidence/reviewability-visible-final.png` and `.log`
- Verified fix register: `Projects/Crime99RCCPTrafficIntegrationPreflight/TECHNICAL_FIXES_AND_TROUBLESHOOTING.md`
- Documentation/reviewability changed-file inventory: `Projects/Crime99RCCPTrafficIntegrationPreflight/DOCUMENTATION_REVIEWABILITY_CHANGED_FILES.md`
- Recovery feasibility decision: `Projects/Crime99RCCPTrafficIntegrationPreflight/RECOVERY_FEASIBILITY_AND_EFFORT_ASSESSMENT.md`
- Recovery feasibility changed-file inventory: `Projects/Crime99RCCPTrafficIntegrationPreflight/RECOVERY_FEASIBILITY_CHANGED_FILES.md`

## Remaining Risks and Open Items

- Human review accepted Gate A. Air Dodge remains blocked by the corrected grounded-only rule, with no stamina or cooldown cost for blocked airborne input.
- RCCP Gate B has complete objective evidence and Human acceptance, including Compact/Saloon differentiation, the extended bounded course, and the perceptible smooth camera transition.
- Realistic Car Controller Pro is the accepted physics basis for Gate B and remains locally ignored and unchanged. This does not authorise manufacturer-file modification or unrelated package use.
- Complete City Traffic & Pedestrian System passes its isolated technical checks and corrected Repeat Human Review returned `Conditional Pass`. General obstacle reaction is present but not optimal. Adoption conditions include obstacle-response tuning, refreshing incomplete local editor-only URP/Collections package-cache resources and validating without the fallback, resolving remaining visual defects, a longer deadlock soak, blank-scene road-network authoring proof, and a separately authorised RCCP integration test.
- The combined preflight is formally closed at `Retain for Controlled Prototype Trial`; it is not a current import or final adoption. Its recovery Human Fail and `Package Limitation` remain unchanged. A later trial must constrain waypoint networks, street width, agent count, and scenario selection; expose and document relevant Inspector settings; optionally clean up persistent blockers; and repeat Human review under representative Crime99 conditions.
- NWH Vehicle Physics 2 has a stronger explicit axle/input/source architecture but a higher complexity and dependency burden. Edy's Vehicle Physics has the smallest footprint of the three but an unresolved Unity 6 compatibility risk. Store claims are research evidence, not technical validation or adoption approval.
- The hidden built-player start produces a black screenshot; Direct3D/PhysX startup, runtime evidence, player log, and clean exit pass. Use the visible Editor screenshot for visual evidence.
- Unity Test Runner logs benign missing-dependency messages for unused URP terrain Shader Graph preview templates; the active pipeline, Crime99 scene, compile, and all tests pass.
- The visible Editor review logged a Unity Search indexing exception and shutdown-only temporary-allocation diagnostics; neither occurred in the built-player run or affected tests, scene loading, rendering, or build completion.
- The legacy Input Manager is used behind one project-owned intent component because no new Input System package download was authorised; Unity marks that manager as deprecated.
- Licensed third-party assets still require separate acquisition/import authority, provenance entries, import recipes, and technical preflight before any main-project use.
- The Crime99 private remote contains accepted Gate B commit `b1faed2bff92ac4a151eb63a5758c02654b31210`. Failed custom Gate B commit `840c05694e0d7e3c16ac8e5a2d62c2a99b47f7de` remains preserved only on its local archive branch.
- DEC-023's independent encrypted offline backup remains open.

## Restart Procedure

1. Read `AGENTS.md`, `Docs/WORK_STATE.md`, `Docs/CONFIRMED_DECISIONS.md`, and this file.
2. Verify Studio OS root `main` and `origin/main` include `Record Crime99 Gate B completion`, with the known project workspaces still untracked.
3. Enter `Projects/Crime99/` and verify clean local `main` and `origin/main` at accepted Gate C commit `97bba7e8ea8c544f5a4d2dc3a7e2b707c6724f8f`; verify the failed implementation remains at `archive/gate-b-custom-controller-failed`.
4. Correct Compact Car and Saloon hit detection first and run four-class pistol, shotgun, rocket-direct-hit, explosion, collider, layer, and forwarding regression tests.
5. Continue Gate D only in the authorised order, keeping traffic/pedestrians to the documented controlled package slice and avoiding general recovery or coordination systems.
6. Fully validate one replayable FFA round, restart, stability, performance, builds, logs, all Gate A/B/C regressions, vendor integrity, and Git boundaries.
7. Create only the authorised local Gate D commit. Do not push Gate D or begin Gate E.

## Exact Next Task

Implement and fully validate Crime99 Gate D — Replayable FFA. Begin with the vehicle hitbox correction, create the authorised local commit `Implement Crime99 Gate D replayable FFA`, and stop before Gate D push, Gate E, purchases, downloads, or further implementation.
