# Model Routing Record Validator

**Capability ID:** `STUDIO-CAP-MODEL-ROUTING-001`  
**Type:** Studio-owned local validation utility  
**Owner:** Studio AI model-routing governance  
**Last verified:** 2026-08-22  
**Current disposition:** Available static validator for model-routing records;
it validates record shape and policy consistency, not actual model attestation.

## Identity and Availability

- Script: `Tools/ModelRouting/Validate-ModelRoutingRecord.ps1`.
- Policy owner: [AI Model Routing and Compute Efficiency Standard](../../../../AI/AI_MODEL_ROUTING_AND_COMPUTE_EFFICIENCY_STANDARD.md).
- Uses local PowerShell; no installation or network dependency.

## Intended Uses

- Problem tags: `model routing`, `Terra`, `Sol`, `Critical`, `sol_exception`,
  `record validation`, `compute efficiency`.
- Strong uses: validate a prepared routing record against the adopted schema and
  required exception fields.
- Unsuitable uses: proving which backend model actually executed, assigning Sol
  role-wide or replacing the Human/Director risk classification.

## Capability Evidence

| Claim | Evidence state | Exact evidence | Scope limit |
|---|---|---|---|
| Static routing-record validator is locally present | `STATICALLY VERIFIED` | `Tools/ModelRouting/Validate-ModelRoutingRecord.ps1` | Actual model resolution remains independently unattested |
| Terra is routine/default and Sol needs a Critical exception | `ADOPTED` policy | Model-routing standard | Exact task still needs correct classification |

## Successful Applications

The validator provides a reusable deterministic check instead of manually
reinterpreting the routing record each time.

## Failed Applications

A requested model name or valid record is not independent evidence that the
requested model was actually used. Do not promote metadata to attestation.

## Decision Guidance

- Use when a Work Order contains a material model-routing decision or Sol exception.
- Keep routine work on the least expensive reliable class.
- Technical debt avoided: inconsistent hand-written routing declarations.

## Unknowns and Refresh Triggers

- Refresh after routing-standard or validator schema changes.

## Search Tags

`model routing`, `Terra`, `Sol`, `Critical`, `sol_exception`, `validator`, `compute`

