# See-through Shader

**Capability ID:** `C99-OWNED-SEE-THROUGH-SHADER-001`  
**Type:** Owned Unity Asset Store tool; not installed  
**Owner:** Crime99 rendering and camera capability knowledge  
**Last verified:** 2026-08-22  
**Current disposition:** `OWNED / NOT LOCAL / PREFLIGHT ONLY`

## Identity and Availability

- Product: See-through Shader by Shadercrew.
- Signed-in account: purchased 2026-08-13; version `1.9.2`; updated 2026-08-13.
- No distinct current canonical project root was found.
- Store ID, local compatibility and exact licence details remain `UNKNOWN`.

## Intended Uses

- Possible use: fade or reveal geometry that obstructs the elevated gameplay camera.
- Possible use: bounded visibility treatment for roofs, walls or foreground objects.
- Unsuitable use: concealing poor camera composition, broken geometry or city-layout defects.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Product is currently owned | `ACCOUNT VERIFIED` | Signed-in Unity Asset Store Assets list, 2026-08-22 | Ownership is not installation authority |
| Product can solve Crime99 camera obstruction | `UNVERIFIED CANDIDATE` | Product identity and category inference | Exact URP, camera and material behavior untested |

## Decision Guidance

- Consider only when an actual obstruction case survives camera/layout correction.
- Compare against existing project-native visibility handling before adding a dependency.
- If selected, use a separate authorised import preflight and one representative camera case.

## Unknowns and Refresh Triggers

- `UNKNOWN`: Unity 6000.3/URP 17.3 compatibility, shader integration, batching,
  performance, material migration, source access and visual fit.
- Refresh after account version change or before download/import evaluation.

## Search Tags

`see-through`, `occlusion`, `camera obstruction`, `wall fade`, `roof fade`, `visibility shader`

