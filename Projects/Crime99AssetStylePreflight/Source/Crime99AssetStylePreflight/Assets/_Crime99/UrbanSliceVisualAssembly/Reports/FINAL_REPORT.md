# Crime99 Urban Slice StylePreflight — Final Report

Status: **APPROVE FOR DRESSING AND PERIOD ADAPTATION**  
Closure session: Terra #88  
Requested model: `gpt-5.6-terra` — Requested model, not independently attested.  
Scope: documentation-only closure of the immutable StylePreflight evidence package. This report does not create a Studio standard or governance rule.

## 1. Placement proposal

The approved proposal preserves the straight 9.5 m × 78 m principal road, two continuous 3.5 m sidewalks, opposing frontage lines at the road-facing X limits, a north-west landmark, and a north-east service reservation. It uses complete original prefabs with original Vendor materials and gameplay-like evaluation cameras. The street was not redesigned to force asset fit.

## 2. Used and rejected assets

Eight placements use seven unique Vendor prefabs:

| Instance | Exact prefab | Role | Scale | Road-facing rule |
| --- | --- | --- | ---: | --- |
| West_SM5 | `Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_5.prefab` | west frontage | 0.82 | local -Z, yaw -90, +X |
| West_SM24 | `Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_24.prefab` | west frontage | 0.82 | local -Z, yaw -90, +X |
| West_SM17 | `Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_17.prefab` | west frontage | 0.82 | local -Z, yaw -90, +X |
| West_Landmark_SM36 | `Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_36.prefab` | landmark | 1.00 | local -Z, yaw -90, +X |
| East_SM2 | `Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_2.prefab` | east frontage | 0.82 | local -Z, yaw +90, -X |
| East_SM17 | `Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_17.prefab` | east frontage | 0.82 | local -Z, yaw +90, -X |
| East_SM25 | `Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_25.prefab` | east frontage | 0.82 | local -Z, yaw +90, -X |
| East_Service_SM38 | `Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/SM_NYCB_38.prefab` | service/loading | 0.82 | local -Z, yaw +90, -X |

Five rejected candidate-role alternatives were recorded: SM_NYCB_8 as landmark because its 18.93 m frontage weakens the slot hierarchy; SM_NYCB_25 as service because it reads too tall and mixed-use; SM_NYCB_38 as general frontage because it is better reserved for utility/service; SM_NYCB_2 as landmark because it is broader and less distinct; and SM_NYCB_24 as landmark for the same hierarchy reason.

## 3. Required views and hashes

All paths are relative to `Assets/_Crime99/UrbanSliceVisualAssembly/Evidence/Final/`.

| View | File | SHA-256 |
| --- | --- | --- |
| gameplay-like overview | `C99_VisualAssembly_street.png` | `E2C6CE06A34703260114E21BFFAB8AC9238C01954966FE795BE1142825328CFD` |
| complementary overview | `C99_VisualAssembly_overview.png` | `051AF9B998BC2EB4DC218AF599060FDEBFF0E729D3FBFFE6F776923F64C27240` |
| west frontage | `C99_VisualAssembly_west.png` | `971B6D2FEF97D45272F6D73500F66D1B0DD59A848FC3A7A525ED608040B4BBB2` |
| east frontage | `C99_VisualAssembly_east.png` | `AE3E6E27F4B049B8B3CBA32F70EDC2E067A3554C37C8C150FC2860CA54C5D47A` |
| entrance | `C99_VisualAssembly_entrance.png` | `A974FFD4621C5E3E55CB3D14B560242F0742C1C36F47D8289EDDEE67AC18876F` |
| service | `C99_VisualAssembly_service.png` | `D5B2E618E0CAB4F6459287AD40C55437C11C0AD942AE6C700E1D2BE6A3084EDA` |
| landmark | `C99_VisualAssembly_landmark.png` | `286F30AF06416301683FEE062927AC5BEFD11EED2DB7B2FEE499628A137728EF` |
| placement map | `C99_VisualAssembly_placement_map.png` | `4BED0CA7EF83885FFBB080556C2CBEF3D0A0885BDB7643D241868F9743CB7CED` |

The immutable image aggregate remains `60E3D4A53FDAA3EF8E1584A0F6DBB8029E2841364DC1912CE44C41A648C7C68F`.

## 4. Material confirmation

The candidate contains 451 assigned original Vendor material slots with zero missing slots, zero error-shader slots, and zero magenta-like pixels in all candidate captures. Only three project-owned materials are used, for road, sidewalk, and curb. No grayscale or diagnostic replacement material remains.

## 5. Orientation and entrance confirmation

The verified public-front convention is prefab local -Z. West placements use yaw -90 and face +X; east placements use yaw +90 and face -X. Storefront glazing and prefab-native commercial doors face the road. The entrance capture confirms real-prefab entrance readability; no obsolete entrance proxy remains.

## 6. Service and landmark confirmation

SM_NYCB_38 reads as a low, road-facing garage/service facade in the preserved east service position. SM_NYCB_36 retains a narrow 9.48 m frontage and 20.60 m height in the north-west landmark slot. Its long-distance emphasis is a later dressing concern, not a current spatial blocker.

## 7. Repetition assessment

SM_NYCB_17 is the only repeated prefab, mirrored across the two sides: eight placements, seven unique prefabs. The repetition is acceptable for formative assembly. Later substitution or dressing should reduce the repeated dark-brick and fire-escape language.

## 8. Period risk

Blue awnings, red storefront bands/signage, bright rooftop details, repeated fire escapes, and parts of the untouched Vendor material language require later period adaptation. These are allowed carry-forward concerns and do not invalidate the source assets or current composition.

## 9. Provenance

All eight building instances reference original prefabs under `Assets/LeartesStudios/NYC1950s/HDRP/Prefabs/`. The evidence package traces eight placements, seven source prefabs, 451 Vendor material slots, three project-owned ground materials, and three byte-identical Recovery-B documentary references. Vendor content was not intentionally modified or duplicated.

## 10. Seven-role review matrix

All mandatory roles reviewed the same immutable evidence package. Blind Visual, Art Director, Camera/Occlusion, and Level Designer returned PASS WITH CONCERNS and recommended approval. Technical Artist, Asset/Provenance Manager, and Producer/Scope Controller found no blocker and were normalized to APPROVE. Full findings are in `ReviewMatrix.json`.

## 11. Sol #10 synthesis

Sol #10 concludes **APPROVE FOR DRESSING AND PERIOD ADAPTATION**, with no current revision. Carry forward: dress the empty asphalt and horizon; period-adapt signage and materials; differentiate mirrored SM_NYCB_17/fire escapes; strengthen landmark readability at distance; dress service logistics; test runtime/gameplay occlusion later; investigate the nonfatal material-postprocessor null-reference exceptions before production workflow use; keep Vendor immutable and adaptations project-owned; preserve the frozen hashes.

Requested model for Sol #10: `gpt-5.6-sol` — Requested model, not independently attested.

## 12. Diagnostic lessons

These are project-specific diagnostic findings only. They do not amend the Studio Operating System or adopt new governance.

### 12.1 Reduced closure is not the source asset

- Trigger: A reduced or transferred environment failed to render or compile representative content.
- Cause: Required dependency closure was absent even though the original source package remained viable.
- Corrected conclusion: Failure of the reduced closure does not prove a defect in the source asset family.
- Safeguard: Separate source-asset validation from reconstructed-environment validation and preserve causal evidence.
- Future integration location: Project work-order preflight and asset-integration evidence notes.

### 12.2 Diagnostic or untextured materials are invalid for final suitability

- Trigger: Grayscale or diagnostic assemblies were considered for visual suitability judgment.
- Cause: Replacement materials removed the authored material language needed for a representative assessment.
- Corrected conclusion: Such captures can diagnose geometry or placement but cannot support final asset/style suitability.
- Safeguard: Require representative original materials before formal visual review.
- Future integration location: Project evidence-validity checklist for visual assembly.

### 12.3 Verify orientation and public frontage before judgment

- Trigger: Building identity or entrance readability appeared weak from the street.
- Cause: Prefab pivots and local axes do not reliably communicate the authored public front.
- Corrected conclusion: Front orientation must be verified from geometry and entrances before judging suitability.
- Safeguard: Record the public-front convention, yaw, road face, and an entrance capture for every selected family.
- Future integration location: Placement proposal and formative validation record.

### 12.4 Remove replaced proxies

- Trigger: Real prefab entrances or service functions replaced blockout reservations.
- Cause: Obsolete proxies could remain and falsely imply duplicate or unresolved functions.
- Corrected conclusion: A replacement is incomplete until superseded proxies are inventoried and removed.
- Safeguard: Run a named proxy inventory before evidence freeze.
- Future integration location: Project scene-cleanup checklist.

### 12.5 Camera evidence limits are separate from spatial invalidity

- Trigger: A review camera did not prove runtime occlusion or showed weak distant emphasis.
- Cause: Documentary cameras answer bounded composition questions and do not simulate all gameplay conditions.
- Corrected conclusion: Limited camera evidence is a carry-forward evidence concern unless it demonstrates an actual spatial defect.
- Safeguard: State each camera's question and defer runtime-only claims to gameplay integration.
- Future integration location: Evidence package camera ledger and later gameplay validation plan.

### 12.6 Do not judge a blockout by final-art detail

- Trigger: Open ends, empty asphalt, horizon, lighting, or missing dressing reduced visual finish.
- Cause: A bounded assembly was being compared with final-art expectations.
- Corrected conclusion: Blockout and formative assembly should be judged on their authorized spatial and asset-selection questions.
- Safeguard: Separate current pass criteria from downstream dressing and polish concerns.
- Future integration location: Project review brief and review matrix.

### 12.7 Keep defect classes separate

- Trigger: Failures across package, pipeline, assembly, material, composition, and source content were conflated.
- Cause: A visible symptom was treated as a single undifferentiated asset-family failure.
- Corrected conclusion: Each defect must be assigned to the verified causal class before disposition.
- Safeguard: Record symptom, verified cause, evidence validity, intrinsic/contextual status, scope, and falsifying evidence.
- Future integration location: Project diagnostic report template.

### 12.8 FAIL requires causal representative evidence

- Trigger: A negative verdict was proposed from incomplete or nonrepresentative evidence.
- Cause: Diagnostic output was mistaken for proof of an intrinsic source defect.
- Corrected conclusion: FAIL is valid only when representative evidence establishes a verified causal defect.
- Safeguard: Use `EVIDENCE INVALID — CORRECT AND REASSESS` or `EVIDENCE INCOMPLETE — FINAL VERDICT PENDING` when appropriate.
- Future integration location: Project review disposition section.

### 12.9 Broader inventory remains eligible

- Trigger: Initial named candidates risked becoming an artificial hard boundary.
- Cause: Proposal examples were mistaken for an exhaustive approved family list.
- Corrected conclusion: Other already available inventory remains eligible when it fits the frozen role and spatial constraints better.
- Safeguard: Record both chosen and rejected candidate-role alternatives with exact paths and reasons.
- Future integration location: Asset proposal and provenance record.

### 12.10 Human interventions and superseded verdicts remain traceable

- Trigger: Human direction corrected an earlier environment or evidence interpretation.
- Cause: Later conclusions could otherwise obscure why a verdict changed.
- Corrected conclusion: Superseded verdicts remain diagnostic history and must not silently disappear.
- Safeguard: Record the intervention, prior conclusion, corrected conclusion, and evidence basis.
- Future integration location: Project execution record and handover history.

### 12.11 Establish dependency closure before compile

- Trigger: Compilation was attempted after copying source assets without their complete dependency closure.
- Cause: Asset payload presence was mistaken for an executable Unity environment.
- Corrected conclusion: Dependency closure must be verified before compile results can classify an asset or pipeline.
- Safeguard: Preflight packages, shader dependencies, manifests, and cache assumptions before launching Unity.
- Future integration location: Project environment pre-mutation gate.

### 12.12 Preflight launcher paths and argument vectors

- Trigger: A Unity launch targeted an unintended path or received a malformed argument vector.
- Cause: Launcher and shell assumptions were not independently verified.
- Corrected conclusion: Launch success is not meaningful until executable, project path, method, and argument vector are confirmed.
- Safeguard: Log the resolved executable, project path, exact arguments, process exclusivity, and success marker.
- Future integration location: Project Unity execution record.

### 12.13 Open/compile success is insufficient with incomplete PackageCache

- Trigger: A project opened or compiled despite incomplete PackageCache reconstruction.
- Cause: Partial cache state allowed startup while leaving import and shader behavior unrepresentative.
- Corrected conclusion: Open/compile success alone does not validate a transferred environment.
- Safeguard: Validate representative render output and dependency integrity, not merely editor startup.
- Future integration location: Project environment-validity gate.

### 12.14 Unity may automatically reserialize Vendor content

- Trigger: Batch import or capture caused unexpected serialized changes.
- Cause: Unity import/version behavior can write materials or configuration without an intentional edit.
- Corrected conclusion: Automatic reserialization is environment mutation that must be detected and disclosed.
- Safeguard: Hash protected content before and after every Unity run; stop on outside-scope drift and never silently accept or revert it.
- Future integration location: Project protected-file ledger and execution record.

### 12.15 Prefer an authorized working source environment to invalid cache repair

- Trigger: Repeated effort was spent repairing a copied environment with invalid transferred cache state.
- Cause: Environment reconstruction was pursued after a known working source project became available.
- Corrected conclusion: When expressly authorized, bounded work in the working source environment is more reliable than repairing invalid copied caches.
- Safeguard: Require Human authorization, isolate all project-owned outputs, and retain the failed environment only as diagnostic evidence.
- Future integration location: Project recovery strategy and pre-mutation gate.

### 12.16 Use bounds-based placement, not prefab-pivot assumptions

- Trigger: Root positions did not correspond to visible facade or ground-contact positions.
- Cause: Prefab pivots vary and are not reliable placement anchors.
- Corrected conclusion: Fit, road face, spacing, and ground contact must be derived from rendered bounds.
- Safeguard: Validate bounds center/size, frontage plane, overlap, sidewalk intrusion, and minimum Y after placement.
- Future integration location: Project assembly builder validation.

### 12.17 Headless `-nographics` is invalid for raster evidence

- Trigger: A graphics-disabled Unity run was considered for screenshot production.
- Cause: `-nographics` removes the graphics context required for representative raster capture.
- Corrected conclusion: It can support nonvisual automation but not formal visual evidence.
- Safeguard: Use a verified graphics API and validate the resulting pixels and material state.
- Future integration location: Project capture protocol.

## 13. Duration and parallelization

Recorded production Unity runtime: 53.82 seconds total — Terra #78 34.83 s, #79 11.05 s, and #80 7.94 s. A defensible broader wall-clock duration is unavailable because the retained timestamps do not establish all session start/end boundaries. Review wave 1 (#81–#83) ran in parallel; wave 2 (#84–#86) ran in parallel; Producer #87 and Sol #10 ran sequentially.

## 14. Model counts

Actual routed session counts are Terra 88 and Sol 10. Requested models were `gpt-5.6-terra` and `gpt-5.6-sol`; neither requested model identity was independently attested.

## 15. Exact changed files

This closure changes only:

- `Assets/_Crime99/UrbanSliceVisualAssembly/Reports.meta`
- `Assets/_Crime99/UrbanSliceVisualAssembly/Reports/FINAL_REPORT.md`
- `Assets/_Crime99/UrbanSliceVisualAssembly/Reports/FINAL_REPORT.md.meta`
- `Assets/_Crime99/UrbanSliceVisualAssembly/Reports/ReviewMatrix.json`
- `Assets/_Crime99/UrbanSliceVisualAssembly/Reports/ReviewMatrix.json.meta`
- `Assets/_Crime99/UrbanSliceVisualAssembly/Reports/ExecutionRecord.json`
- `Assets/_Crime99/UrbanSliceVisualAssembly/Reports/ExecutionRecord.json.meta`

The complete isolated inventory, sizes, and SHA-256 values are recorded in `ExecutionRecord.json`. Its own final SHA-256 is necessarily verified externally after serialization to avoid a self-referential checksum.

## 16. Storage

Before report creation, the isolated folder contained 9,842,054 bytes and the full Unity project contained 13,206,409,601 bytes. Current post-closure values and report deltas are in `ExecutionRecord.json`. Baseline #77 free space was 994,594,758,656 bytes; applying the known #80 freeze delta of -7,675,904 bytes yields 994,587,082,752 bytes expected at freeze. The pre-report current observation was 1,000,292,683,776 bytes, 5,705,601,024 bytes more free than that derived value; this reflects intervening disk-wide activity and is not attributed to the isolated folder.

## 17. Automatic Unity mutations

Only isolated project-owned scene/material/content serialization is recorded. No protected outside-scope drift was detected. Nonfatal URP/ShaderGraph `MaterialPostprocessor` null-reference exceptions occurred and remain a production-workflow investigation item.

## 18. Vendor and protected-area integrity

Vendor, Packages, ProjectSettings, and Catalog protection hashes remain consistent with the immutable EvidenceManifest. No intentional Vendor mutation occurred. The immutable Evidence/Final package, candidate scene, placement manifest, and protected sources were not modified by this closure.

## 19. Git status

The StylePreflight project remains an untracked project subtree in the enclosing repository; pre-existing repository changes outside this closure remain untouched. The scoped post-closure status is recorded verbatim in `ExecutionRecord.json`. Nothing was staged, committed, or pushed.

## 20. Final recommendation and binding carry-forward constraints

**APPROVE FOR DRESSING AND PERIOD ADAPTATION**

Binding carry-forward constraints:

- Preserve the immutable candidate, evidence package, scene, manifests, and hashes.
- Keep Vendor content immutable; place adaptations in project-owned scope.
- Do not revive or repair Assembly-B; retain it as diagnostic evidence only.
- Preserve the straight road, both sidewalks, frontage relationships, entrance relationships, east service position, north-west landmark position, and gameplay-like framing unless a later authorized spatial revision explicitly supersedes them.
- Treat horizon/asphalt dressing, period signage/material adaptation, mirrored SM_NYCB_17/fire-escape differentiation, landmark-distance emphasis, and service logistics as later art-direction work.
- Validate runtime actors, gameplay occlusion, navigation, traffic, combat, and integration only in their later authorized phases.
- Investigate the nonfatal material-postprocessor exceptions before relying on the workflow for production automation.
- No stage, commit, push, broad dressing, final lighting, or gameplay integration is authorized by this report.
