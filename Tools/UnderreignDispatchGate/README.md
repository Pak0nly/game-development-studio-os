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
python Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-night-return --root . --manifest M --work-order W --receipt R --return-receipt NR   (cloud_night orders only)
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

## External project root (optional)

Added by `UR-GATE-EXTERNAL-NIGHT-V1` (UD-26: the Unity project lives in `C:\GameDev\Underreign`, its own Git repository, outside the Studio repository). The logic is an independent copy of the proven external-root design of the Studio's other Claude-directed gate; it imports nothing from it and shares no state or paths with it. A manifest may carry an optional `external_project` section. Manifests without it behave exactly as before and their receipts gain no new keys.

```text
"external_project": {
  "root": "C:/GameDev/Underreign",                   // must equal the schema allowed root
  "git": { "branch": "main", "head": "<40-hex>" },   // or the string "uninitialised"
  "allowed_mutations": ["Assets/Game", "Evidence"],  // relative to the external root
  "protected_paths": ["ProjectSettings", "Packages"],
  "dirty_state": { "mode": "bounded_projection", "paths": ["Assets", "ProjectSettings"],
                   "sha256": "<see below>" },
  "declaration": "VERIFIED"
}
```

- Allowed roots live in the schema (`external_project.allowed_roots`): exactly `C:/GameDev/Underreign`, nothing else. The root is normalised (backslashes to `/`, trailing slash removed, drive letter upper-cased; the rest is case-sensitive). `..`, relative or UNC roots fail with `E_EXTERNAL_ROOT_INVALID`; any other root, including near misses (`C:/GameDev/Underreign2`, `C:/GameDev/underreign`, subfolders, other drives) and every Hearthlands root, fails with `E_EXTERNAL_ROOT_NOT_ALLOWED` before the filesystem is touched. The gate never creates the root.
- `git` initialised: `verify-director` / `verify-worker` check that the root is the Git top level and that branch and HEAD match (`E_EXTERNAL_BRANCH`, `E_EXTERNAL_HEAD`). `dirty_state.sha256` is the SHA-256 of `git status --porcelain=v1 -z --untracked-files=all -- <paths>` run in the external repository.
- `git: "uninitialised"`: the root must be absent or an empty directory (`E_EXTERNAL_NOT_UNINITIALISED`). `dirty_state.sha256` is then the digest of the sorted file listing (`path<TAB>sha256<TAB>size` per file) under the given paths (use `["."]`).
- Allowed and protected path lists are validated like the Studio ones (non-empty, unique, no overlap: `E_EXTERNAL_MUTATION_PROTECTED_OVERLAP`).
- The director receipt binds the normalised section under `external_project` (with its own `state_sha256`) and `execution_location`; `verify-worker` recomputes it live and any difference fails (`E_EXTERNAL_DIRTY_DRIFT`, `E_RECEIPT_STALE_EXTERNAL`, ...).
- Closure: candidate files may be written `ext:<relative path>`. They are hashed from the external root, must lie inside the external `allowed_mutations` and outside its `protected_paths`, and enter the aggregate candidate identity under the `ext:` name. `ext:` is only valid in `candidate.files` and only when the dispatch declared `external_project` (`E_CLOSURE_EXTERNAL_UNDECLARED`). Operational PASS markers stay in the Underreign `WORK_STATE` / `CURRENT_HANDOVER`.

## Night-shift mode (optional)

Added by `UR-GATE-EXTERNAL-NIGHT-V1` (Human, 2026-11-09: night shift for Underreign; in this Studio a night shift is always a cloud run while the Human's PC is off: evening push, overnight cloud work without Unity on a pre-approved night Work Order, morning pull and local check). Manifest flag `"execution_location": "cloud_night"` (the default and only other value is `"local"`).

```text
"execution_location": "cloud_night",
"external_project": { ... "git": { "branch": "main", "head": "<evening base>" } ... },
"night_branch": "night/2026-11-10",                      // night/<YYYY-MM-DD>, a real date
"night_evidence_dir": "Evidence/UR-EXAMPLE-WO-V1"        // relative to the external root,
                                                          // inside external allowed_mutations
```

- Requires `external_project` with an initialised `git` (the evening base): `E_NIGHT_EXTERNAL_REQUIRED`, `E_NIGHT_GIT_REQUIRED`, `E_NIGHT_FIELD_MISSING`, `E_NIGHT_BRANCH`, `E_NIGHT_EVIDENCE_DIR`. The night fields are rejected on a `local` manifest (`E_NIGHT_FIELDS_UNEXPECTED`). The receipt additionally binds `night_shift` (branch and evidence dir).
- No budget. There is no cost cap for night shifts (Human, 2026-10-24), so this gate has no `budget` field, no cap in the schema and no `E_NIGHT_BUDGET` check. Choice: a supplied `budget` field is rejected on every manifest, night or local, with `E_NIGHT_FIELDS_UNEXPECTED`, rather than silently ignored, so that nobody mistakes a declared number for a limit the gate enforces.
- The cloud Worker cannot run `verify-worker` (no Studio repository there). All existing manifest checks still apply to the manifest itself.
- `verify-night-return` runs locally the next morning, after the night branch has been fetched or pulled into the external repository:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-night-return --root . --manifest M --work-order W --receipt R --return-receipt NR
```

  It validates the manifest statically (all structural, Work Order and external-section checks, but not the live Studio HEAD, dirty projection, sources or baselines, which legitimately change overnight), checks the director receipt integrity and its binding to the exact manifest, Work Order and external/night state, then inspects the Git objects of the external repository only (the working tree and the checked-out branch are irrelevant). The night branch must exist (local `refs/heads/<branch>` and/or `refs/remotes/origin/<branch>`; if both exist they must agree), the declared base commit must exist and be the merge-base, there must be at least one commit and no merge commit, every commit may touch only paths inside the external `allowed_mutations` and none inside `protected_paths` (deletions included; the protected comparison is case-insensitive), no commit may add or change a symlink or submodule, and the evidence directory must exist and be non-empty on the branch head. Only then it writes `NR` (a sibling of the manifest) once and never overwrites it (`E_RECEIPT_EXISTS`). `NR` (kind `underreign_night_return_receipt`) records work order, manifest, dispatch receipt id, base head, branch head and the commit list, signed by `receipt_id`.
- Closure for a night order additionally requires `"night_return": {"receipt_path", "receipt_sha256", "receipt_id", "declaration": "VERIFIED"}` in the closure manifest (`E_CLOSURE_NIGHT_RETURN_MISSING`). The receipt is re-verified for integrity and binding to this order (`E_NIGHT_RETURN_TAMPERED`, `E_NIGHT_RETURN_REUSE`) and its branch head must be a commit in the external repository. The Underreign operational files must also contain `Night return receipt: <id>`. A non-night closure that supplies `night_return` fails (`E_CLOSURE_NIGHT_UNEXPECTED`). The normal independent review is still required.

### Evening and morning steps

1. Evening (PC on): `C:\GameDev\Underreign` clean on the base branch; write the night manifest and Work Order; run `verify-director` (writes the receipt); push the base branch and the Studio repository so the cloud session can see both.
2. Overnight (cloud, no Unity): the cloud Worker commits only to `night/<date>` inside the external allowed paths and writes its evidence under `night_evidence_dir`; it never merges.
3. Morning (PC on): fetch or pull the night branch into `C:\GameDev\Underreign`; run `verify-night-return`; check out the night branch there if `ext:` candidates are to be hashed; do the local Unity check; build the closure manifest with `night_return`; run the independent review, then `issue-closure` / `verify-closure`.

### Honest limits of both features

- Still a cooperative gate. It cannot attest what ran in the cloud, which model served it, or that the night branch was produced by the declared Worker; it only checks the resulting Git history and the recorded declarations. It records no spend.
- `verify-night-return` trusts the local Git object store. Commits are judged by their diffs against their parents; a rewritten history that still matches the declared base is indistinguishable from an honest one.
- Evidence content is not validated beyond existence on the branch; the independent review remains the content check.
- `ext:` candidate hashing binds working-tree bytes, not their Git provenance; for a night order, check out the verified branch head first.
- The external root allow-list is changed in the schema only by a gate-maintenance Work Order.

## Checks (all fail closed)

Manifest: required fields and schema; Work Order path, bytes, hash and id; Git branch and HEAD; project identity proof; bounded dirty projection hash; authority and project source hashes; technical baselines; allowed/protected path overlap and forbidden mutations; model routing and attestation; orchestration (Director non-execution, separate `Agent` Worker, `agent_completion` monitoring, independent review contract, one Reviewer); roles; declared tools present in the capability evidence.

Worker: receipt identity (`receipt_id` over canonical content), binding to the exact manifest and Work Order bytes, and every live-state digest again (repository, project identity, dirty state, sources, baselines, tools).

Closure: dispatch manifest and receipt hashes and binding; distinct task identities; candidate identity and file hashes inside the dispatch allowlist; evidence files inside the evidence namespace; the review record bound to Work Order id, task ids, candidate identity and evidence ids with verdict `PASS`; then, at `verify-closure`, the exact markers in both Underreign operational files: Work Order id, `Independent review verdict: PASS`, `Worker task: <id>`, `Reviewer task: <id>`, `Candidate identity: <sha256>`, `Closure receipt: <receipt id>`.

## Tests

```text
python -B -m unittest discover -s Tools/UnderreignDispatchGate/tests -v
```

The tests build temporary Git repositories and do not read the live repository state. The external-root and night tests use a temporary external repository and a temporary schema copy; they never create, read or write the live `C:/GameDev/Underreign`.
