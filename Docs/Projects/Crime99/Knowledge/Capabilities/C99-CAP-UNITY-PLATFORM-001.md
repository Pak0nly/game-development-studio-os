# Unity Platform, Rendering, Input and Validation Substrate

**Capability ID:** `C99-CAP-UNITY-PLATFORM-001`  
**Type:** Installed engine and package substrate  
**Owner:** Crime99 technical capability knowledge  
**Last verified:** 2026-08-22  
**Current disposition:** Current common platform substrate; problem-oriented
selection starts in the [Unity Native Capability Atlas](C99-CAP-UNITY-NATIVE-ATLAS-001.md)
and continues into narrower Terrain, Splines/ProBuilder and package records.

## Identity and Availability

- Unity editor identity: `6000.3.19f1`, revision `7689f4515d75`.
- Direct packages: URP/Shader Graph `17.3.0`, Input System `1.19.0`, Burst
  `1.8.29`, Collections `2.6.6`, Editor Coroutines `1.1.0`, Test Framework
  `1.6.0`, uGUI `2.0.0`, Visual Studio integration `2.0.26`, Splines `2.9.0`
  and ProBuilder `6.1.2`.
- Dependency closure: 39 package records, including Mathematics `1.3.3` and
  Performance Test Framework `3.5.0`.
- Project settings: Linear color space; PC URP uses HDR, depth/opaque textures,
  SRP Batcher and SSAO. No serialized PC Decal Renderer Feature.

## Intended Uses

- Problem tags: `URP`, `Shader Graph`, `input`, `UI`, `physics`, `vehicle`,
  `tests`, `Burst`, `Collections`, `rendering`, `screenshots`.
- Strong uses: current rendering path, input actions, UI/text, physics/vehicles,
  deterministic data processing, EditMode/PlayMode/performance tests and capture support.
- Unsuitable uses: inferring that every imported shader, package or vendor
  renderer is compatible merely because the dependency exists.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Exact direct/transitive package set is present | `STATICALLY VERIFIED` | `Packages/manifest.json` and `Packages/packages-lock.json` | Presence is not consumer runtime proof |
| Current PC/Mobile URP settings are serialized | `STATICALLY VERIFIED` | `Assets/Settings/` and [Static tools catalogue](../../../../../Projects/Crime99/Artifacts/Reports/C99-ASSET-TOOLING-AND-PACKAGE-CAPABILITY-CATALOG-V1/TOOLS_AND_WORKFLOWS.md) | Rendered output may differ |
| URP gameplay and package integration have historical passing evidence | `RUNTIME PROVEN` for named Gates/slices | [Production Profile](../../PRODUCTION_PROFILE.md) and exact Gate evidence | Does not validate every later city candidate |

## Successful Applications

- Accepted Gate gameplay/integration work used Unity 6000.3.19f1 and URP 17.3.0.
- RCCP/Gley integration passed EditMode, PlayMode, build and player-run checks in
  its accepted boundary.
- Burst/Collections support Decalery's proven bounded CPUBurst workflow.

## Failed Applications

- Package presence did not make prior custom-road or material candidates
  visually acceptable.
- Vendor HDRP/Built-in carriers do not become active URP solutions automatically.
- Null-graphics or malformed capture evidence cannot prove rendered quality.

## Decision Guidance

- Prefer existing packages/modules before adding dependencies or bespoke equivalents.
- Consult the Unity Native Capability Atlas for built-in Editor tools, core
  APIs, diagnostics and optional-package absence before selecting a method.
- Use specialist records for road, Terrain, custom mesh, decal and vehicle decisions.
- Technical debt avoided: duplicate input/render/test stacks. Debt introduced:
  coupling to exact Unity/package versions and vendor shader conversion.

## Unknowns and Refresh Triggers

- Refresh after Unity, render pipeline, Input System, package manifest or project-setting change.
- Smallest proof: the exact consumer's compile/runtime/visual evidence, not a platform-wide rerun.

## Search Tags

`Unity 6`, `URP`, `Shader Graph`, `Input System`, `Burst`, `Collections`, `Test Framework`, `uGUI`, `physics`, `vehicles`
