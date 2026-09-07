# Human Visual Decision Tool V1

**Capability ID:** `STUDIO-CAP-HUMAN-VISUAL-DECISION-001`  
**Type:** Studio-owned local review utility  
**Owner:** Human Visual Decision Tool documentation  
**Last verified:** 2026-08-22  
**Current disposition:** Local prepared-preview decision and deterministic
text-export tool under bounded Human usability validation.

## Identity and Availability

- Root: `Tools/HumanVisualDecisionTool/`.
- Python standard library plus browser-native UI; localhost `127.0.0.1:8765`.
- Supports package/result schemas, preview registration, draft recovery,
  completeness validation and deterministic JSON/text results.
- One Crime99 surface-material package currently exists.

## Intended Uses

- Problem tags: `Human visual review`, `comparison`, `selection`, `approval`,
  `prepared preview`, `decision export`, `before after`.
- Strong uses: guided local Human choices across fixed approved previews while
  keeping visual decisions separate from later technical mapping/mutation.
- Unsuitable uses: AI visual assessment, remote collaboration, automatic Unity
  application, final compatibility proof or Vendor-preview upload to AI.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Single/multiple/order/approve-reject decision modes are implemented | `STATICALLY VERIFIED` | [Tool README](../../../../../Tools/HumanVisualDecisionTool/README.md) and schemas | One package per launch |
| Local deterministic save/finalisation/export exists | `RUNTIME PROVEN` in technical tests | Tool README and `Docs/TECHNICAL_VALIDATION.md` | Human usability validation remains bounded |
| Tool performs no visual analysis or cloud upload | `STATICALLY VERIFIED` | Tool architecture and README | Localhost is not protection from other local software |

## Successful Applications

Bounded Human tests established the local guided review, recovery and
deterministic export workflow documented under `Tools/HumanVisualDecisionTool/Docs/Reviews/`.

## Failed Applications

- Technical fields or missing mappings must not block the Human visual choice;
  they remain `TECHNICAL MAPPING PENDING`.
- Prepared previews are comparison aids, not proof of final production-scene fit.

## Decision Guidance

- Prefer when several prepared visual options need explicit Human decisions.
- Use direct full-resolution originals when a simple review does not need the tool.
- Never attach Vendor-containing previews to an AI system.
- Technical debt avoided: ambiguous chat-only visual decisions.

## Unknowns and Refresh Triggers

- Refresh after schema/package/UI behavior changes or before a new decision-package type.

## Search Tags

`visual review`, `Human decision`, `preview`, `selection`, `approval`, `deterministic export`, `localhost`

