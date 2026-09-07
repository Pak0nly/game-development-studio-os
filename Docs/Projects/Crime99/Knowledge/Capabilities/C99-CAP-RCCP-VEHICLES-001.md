# Realistic Car Controller Pro and Crime99 Vehicle Integration

**Capability ID:** `C99-CAP-RCCP-VEHICLES-001`  
**Type:** Installed Unity vehicle package plus project-owned integration  
**Owner:** Crime99 vehicle and integration capability knowledge  
**Last verified:** 2026-08-22  
**Current disposition:** Accepted vehicle-physics package basis; use only through
project-owned variants and the established integration boundary.

## Identity and Availability

- Product: Realistic Car Controller Pro `2.57.0`, BoneCracker Games.
- Protected vendor root: `Assets/ThirdParty/BoneCracker Games/Realistic Car Controller Pro/`.
- Local breadth: 98 prefabs, 12 scenes, 399 materials, 96 audio files and 310 C# files.
- Project-owned integration: `Assets/Crime99RCCPIntegration/` and eight Gate B/C
  prefabs under `Assets/_Crime99/Prefabs/`.
- Provenance and restore owner: [Asset Provenance Register](../../../../../Projects/Crime99/Docs/ASSET_PROVENANCE.md).

## Intended Uses

- Problem tags: `vehicle physics`, `driving`, `damage`, `AI vehicle`, `camera`,
  `audio`, `skidmarks`, `lights`, `customization`, `recording`, `waypoints`.
- Strong uses: Crime99 driving basis, vehicle setup, body colliders/lights,
  damage, wheels/ground settings, AI courses, cameras, audio, VFX and project variants.
- Unsuitable uses: editing vendor originals, assuming Gley converter parity, or
  treating demo-city content as adopted Crime99 world content.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| RCCP is the accepted vehicle-physics basis | `ADOPTED` for package basis | [Asset Provenance Register](../../../../../Projects/Crime99/Docs/ASSET_PROVENANCE.md) | Does not adopt every RCCP subsystem or demo asset |
| Gate B/C variants and Gate D integration exist | `RUNTIME PROVEN` | Provenance register and `Assets/Crime99RCCPIntegration/Editor/GateDSetup.cs` | Historical accepted gates; current task execution still needs authority |
| Setup, collider/light, damage, AI, camera, audio, VFX, recording and customization surfaces are locally present | `STATICALLY VERIFIED` | [Static tools catalogue](../../../../../Projects/Crime99/Artifacts/Reports/C99-ASSET-TOOLING-AND-PACKAGE-CAPABILITY-CATALOG-V1/TOOLS_AND_WORKFLOWS.md) | Individual workflows not all executed in Crime99 |
| Compile, tests, build and 180-second player run passed in the integrated basis | `RUNTIME PROVEN` | Provenance register | Exact accepted Gate state only |

## Successful Applications

| Use and candidate | Result | Reusable conclusion | Transfer limit |
|---|---|---|---|
| Gates B-C vehicle basis | Accepted | Preserve RCCP ownership behind project variants | Do not mutate vendor payload |
| Gate D RCCP/Gley integration | 76/76 EditMode, 30/30 PlayMode, build, visible run and 180-second player run passed | Existing integration is stronger than rebuilding vehicle ownership | New road graph or vehicle classes still require focused validation |

## Failed Applications

No package-wide vehicle failure is established. Static converter lists and demo
scenes are not proof that every RCCP/Gley combination works. Vendor reimport or
pipeline conversion tools are high-mutation operations and have not been
authorised by this record.

## Decision Guidance

- Prefer the current project-owned RCCP variants before creating another vehicle controller.
- Combine with Gley only for accepted population/routing responsibilities.
- Avoid vendor edits, wholesale demo reuse and duplicate controller architecture.
- Technical debt avoided: a second vehicle stack. Debt introduced: package
  version coupling and restore/provenance requirements.

## Unknowns and Refresh Triggers

- `UNKNOWN`: current performance and behavior for any newly selected vehicle,
  damage profile, AI route or camera variant.
- Refresh after RCCP, Input System, Unity physics or accepted vehicle-baseline change.
- Smallest proof: one project-owned variant in the exact gameplay use.

## Search Tags

`RCCP`, `vehicle`, `driving`, `damage`, `car AI`, `waypoints`, `camera`, `skidmarks`, `vehicle audio`

