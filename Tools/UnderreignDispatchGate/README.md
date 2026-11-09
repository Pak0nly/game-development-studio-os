# Underreign Dispatch Gate

A cooperative, fail-closed dispatch and closure gate for Claude Code directed work on Underreign (DEC-041). It is an independent copy of the Claude-directed gate design (provenance: copied from `Tools/ClaudeDispatchGate` on 2026-11-09 and renamed); it shares no code, state or paths with its source and does not import from, modify or depend on any other tool. `Tools/AuthorityContinuity` stays the gate for the ChatGPT/Codex-directed workflows.

## Boundary and honest limits

- Cooperative procedure, not a security boundary. An agent with filesystem access can bypass it, forge files or skip it; it only makes honest mistakes and drift visible and blocks them deterministically.
- It validates declarations and live bytes (hashes, Git HEAD/branch, project identity, dirty projection). It cannot prove that a subagent really ran, which model actually served it, or that a review was genuinely independent. Task identities are recorded strings supplied by the Director.
- Model routing records the requested model only: `Requested model — not independently attested.`
- It grants no authority. Human decisions, approvals, DEC-013/DEC-014 download and installation rules and the Human checkpoint remain in force.

## Scope binding

- Every manifest and closure manifest must declare `project_scope: "Underreign"`; any other value fails with `E_PROJECT_SCOPE`. `repository.project_path` must be `Projects/Underreign`.
- Dispatch artifacts (manifest, Work Order, receipt) live under `Artifacts/Underreign/DirectorDispatch/<WO-ID>/`.
- Evidence, review record, closure manifest and closure receipt live under `Artifacts/Underreign/Evidence/<WO-ID>/`.
- Closure operational projections are `Projects/Underreign/Docs/WORK_STATE.md` and `Projects/Underreign/Docs/CURRENT_HANDOVER.md`.
- Protection only, no import or shared state: `forbidden_mutation_roots` also lists the repository-relative roots of other projects and their gates. The validator accepts only repository-relative paths, so absolute roots such as `C:/GameDev/Hearthlands*` cannot be listed. Policy: Underreign Work Orders never mutate anything under `C:/GameDev` other than `C:/GameDev/Underreign`; absolute paths are already rejected in `allowed_mutations` (`E_PATH_INVALID`).
- `allowed_mutations` may not touch `Tools/AuthorityContinuity`, the root `Docs/WORK_STATE.md` / `Docs/CURRENT_HANDOVER.md`, Crime99, or the ChatGPT-side artifact namespaces (`E_MUTATION_FORBIDDEN`).

## Claude Code provider profile

- Worker creation tool: `Agent` (Claude Code subagent), one separate Worker per mutation-capable Work Order. Codex tool names (`create_thread`, `wait_threads`, `send_input`) are rejected with `E_CODEX_TOOL_FORBIDDEN`.
- Monitoring: `mode: "agent_completion"` with `tool: "Agent"` (foreground subagent result or background completion notification). Optional `resume_tool: "SendMessage"` must also be a declared required tool.
- Requested models: `haiku`/`claude-haiku-4-5-20251001`, `sonnet`/`claude-sonnet-5-5`, `opus`/`claude-opus-5-5`, `fable`/`claude-fable-5-1`, with the Routine / Standard / Critical classes. Anything else fails (`E_ROUTING_MODEL_INVALID`).
- The Codex-specific "sol" model and its exception list were not carried over: they restrict one specific OpenAI model to named exception categories, and no equivalent Claude restriction has been decided. A future decision may add one to the schema.
- Reviewer: at most one separate Reviewer subagent per dispatch; Director, Worker and Reviewer task identities must be pairwise distinct at closure.

## Commands

All commands take `--root <repository root>` and only accept paths inside it.

```text
python Tools/UnderreignDispatchGate/validate_underreign_dispatch.py check-manifest   --root . --manifest M --work-order W --capabilities C
python Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-director  --root . --manifest M --work-order W --capabilities C --receipt R   (or --dry-run)
python Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker    --root . --manifest M --work-order W --capabilities C --receipt R
python Tools/UnderreignDispatchGate/validate_underreign_dispatch.py issue-closure    --root . --closure-manifest X --work-order W --receipt CR
python Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-closure   --root . --closure-manifest X --work-order W --receipt CR --work-state S --handover H
python Tools/UnderreignDispatchGate/validate_underreign_dispatch.py candidate-identity --root .
```

`--capabilities` is a JSON file `{"available": ["Agent", "SendMessage", ...]}` that the Director writes from the tools actually available in the session. Receipts are written once, as a sibling of the manifest, and never overwritten. Exit code 2 means a gate block (`E_*: detail` on stderr); exit code 3 means an internal or configuration error.

## Writing a manifest

A compact, annotated excerpt of a real, receipt-validated manifest (`Artifacts/Underreign/DirectorDispatch/UR-SETUP-INFRA-V1/DISPATCH_MANIFEST.json`); `...` marks omitted fields (see `underreign-dispatch-schema-v1.json` for the full required list).

```text
{
  "schema_version": 1,
  "kind": "claude_dispatch_manifest",
  "project_scope": "Underreign",                      // must be exactly "Underreign"
  "work_order_id": "UR-SETUP-INFRA-V1",
  "work_order": { "path": "Artifacts/Underreign/DirectorDispatch/<WO-ID>/WORK_ORDER.md",
                  "sha256": "<file sha256>", "declaration": "VERIFIED" },
  "repository": { "root": ".", "project_path": "Projects/Underreign", "project_id": "Underreign",
                  "branch": "main", "head": "<git rev-parse HEAD>", ... },
  "dirty_state": { "mode": "bounded_projection",
                   "paths": ["<allowed mutation paths>"],
                   "sha256": "<see below>", "declaration": "VERIFIED" },
  "authority_sources": [ { "path": "AGENTS.md", "sha256": "...", "declaration": "VERIFIED" } ],
  "baselines": { "technical": [ { "id": "...", "path": "...", "method": "file_sha256",
                                  "expected_sha256": "...", "declaration": "VERIFIED" } ], ... },
  "allowed_mutations": ["<paths the Worker may change>"],
  "protected_paths": ["<paths that must not change>"],
  "model_routing": [ { "class": "Standard", "requested_model": "sonnet",
                       "attestation": "Requested model — not independently attested.", ... } ],
  "orchestration": {
    "director_mode": "orchestration_only", "director_mutation_allowed": false,
    "separate_worker_task": { "required": true, "creation_tool": "Agent", "resume_tool": "SendMessage", ... },
    "worker_route": { "requested_model": "sonnet", "reasoning_effort": "medium", "reason": "..." },
    "monitoring": { "required": true, "mode": "agent_completion", "tool": "Agent" },
    "independent_review": { "required": true, "activation": "after_reviewable_evidence", ... },
    "maximum_independent_reviewer_tasks": 1
  },
  ...
}
```

`reasoning_effort` must be one of the Claude Code effort levels `low`, `medium`, `high`, `xhigh`, `max`.

`dirty_state.sha256` is the SHA-256 of the raw output of `git status --porcelain=v1 -z --untracked-files=all -- <dirty_state.paths>`, computed from the repository root.

Tip: run `check-manifest` first; it reports each mismatch (hash, HEAD, dirty projection, baseline) as an `E_*` code with the expected and actual value, so you can correct the manifest before issuing a receipt.

## Checks (all fail closed)

Manifest: required fields and schema; Work Order path, bytes, hash and id; Git branch and HEAD; project identity proof; bounded dirty projection hash; authority and project source hashes; technical baselines; allowed/protected path overlap and forbidden mutations; model routing and attestation; orchestration (Director non-execution, separate `Agent` Worker, `agent_completion` monitoring, independent review contract, one Reviewer); roles; declared tools present in the capability evidence.

Worker: receipt identity (`receipt_id` over canonical content), binding to the exact manifest and Work Order bytes, and every live-state digest again (repository, project identity, dirty state, sources, baselines, tools).

Closure: dispatch manifest and receipt hashes and binding; distinct task identities; candidate identity and file hashes inside the dispatch allowlist; evidence files inside the evidence namespace; the review record bound to Work Order id, task ids, candidate identity and evidence ids with verdict `PASS`; then, at `verify-closure`, the exact markers in both Underreign operational files: Work Order id, `Independent review verdict: PASS`, `Worker task: <id>`, `Reviewer task: <id>`, `Candidate identity: <sha256>`, `Closure receipt: <receipt id>`.

## Tests

```text
python -B -m unittest discover -s Tools/UnderreignDispatchGate/tests -v
```

The tests build temporary Git repositories and do not read the live repository state.
