# Crime99-Owned Production, Test and Evidence Workflows

**Capability ID:** `C99-CAP-CRIME99-WORKFLOWS-001`  
**Type:** Project-owned code, utilities, variants and task-specific builders  
**Owner:** Crime99 project source and evidence owners  
**Last verified:** 2026-08-22  
**Current disposition:** Reuse accepted components and durable diagnostic
lessons; task-specific builders and rejected candidates are not general tools.

## Identity and Availability

- Root: `Assets/_Crime99/`; 5,004 files / 2,330 non-meta files.
- Includes runtime/editor code, EditMode/PlayMode tests, material/prefab variants,
  accepted Gate scenes, road/Terrain labs, Phase 4/5 builders and evidence assets.
- Project integration root `Assets/Crime99RCCPIntegration/` is owned by the RCCP record.
- Exact active/canonical state remains governed by the Production Profile,
  Work State, Handover and task evidence.

## Intended Uses

- Problem tags: `Crime99 runtime`, `tests`, `builder`, `diagnostic`, `candidate`,
  `material variant`, `prefab variant`, `negative evidence`, `reproducibility`.
- Strong uses: reuse accepted gameplay/integration components, inspect prior
  failures before selecting a method, and adapt an exact compatible project-owned utility.
- Unsuitable uses: treating every Editor builder as reusable, using rejected
  scene output as a baseline or running a task-specific menu outside its Work Order.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Project contains modular runtime/editor/test surfaces | `STATICALLY VERIFIED` | `Assets/_Crime99/Code/` and [Static catalogue](../../../../../Projects/Crime99/Artifacts/Reports/C99-ASSET-TOOLING-AND-PACKAGE-CAPABILITY-CATALOG-V1/FINAL_REPORT.md) | Current behavior varies by component |
| Gate B/C/D project variants have accepted evidence | `ADOPTED` within their gate boundaries | [Production Profile](../../PRODUCTION_PROFILE.md) and provenance register | No automatic authority for city work |
| Historical road prototypes include explicit visual failures | `REJECTED FOR STATED USE` | Static catalogue negative-evidence section and exact task reports | Failure does not reject unrelated Unity packages |

## Successful Applications

- Accepted gameplay and integration Gates provide reusable project-owned code,
  variants, tests and restoration knowledge.
- Numerous city tasks created exact diagnostics, surveys and evidence writers;
  their durable conclusions belong in capability records, not in blind code reuse.

## Failed Applications

- City Surface, Continuous Road, Hybrid V1/V2 and Visual Street Network families
  are historical negative evidence and not accepted tools/baselines.
- The latest proxy-massing structure integration is `FAIL_NOT_ADOPTED`; moving
  those proxies is not a reusable urban-building method.

## Decision Guidance

- Search exact evidence and source before rebuilding a diagnostic or integration.
- Reuse only when inputs, ownership, accepted baseline and output contract match.
- Prefer package-native capabilities before reviving rejected bespoke road/ground builders.
- Technical debt avoided: duplicated probes and lost lessons. Debt introduced:
  accidental coupling to one task's coordinates, hashes or scene assumptions.

## Unknowns and Refresh Triggers

- `UNKNOWN`: whether any historical builder remains compatible with the current accepted source.
- Refresh after accepted baseline changes or before reusing a task-specific builder.
- Smallest proof: static input/output contract comparison before any Unity run.

## Search Tags

`Crime99 code`, `builder`, `test`, `diagnostic`, `candidate`, `negative evidence`, `prefab variant`, `material variant`
