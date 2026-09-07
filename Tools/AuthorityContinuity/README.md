# Authority Continuity Validator MVP V3

Project identity: AuthorityContinuity

## Boundary

This directory contains the adoption-readiness candidate for
`C99-STUDIO-AUTHORITY-VALIDATOR-ADOPTION-READINESS-PREPARATION-V3`.

The authority core indexes canonical source paths, reviewed source hashes,
selectors, task applicability, and fail-closed invariants. It does not replace
canonical Markdown, adopt a governance rule, activate bootstrap enforcement,
or grant production authority. `continuation_authority_granted` is always
`false`, including for a technically valid snapshot.

The existing V1-named report path remains the single configured output to
avoid creating a parallel report or second source of truth.

## Explicit Task Scope

Every invocation requires at least one explicit `--scope`. Configured scopes
are:

- `studio`: Studio-wide continuity and task-pivot authority only;
- `crime99-city`: Crime99 city-pipeline and related evidence boundaries;
- `crime99-assets`: Crime99 asset-currentness and asset-use boundaries;
- `crime99-production`: the combined Crime99 production authority surface.

Findings outside the requested scope remain visible with
`applicable_to_request: false`. Their status is never promoted to confirmed,
but they do not block an unrelated task. An applicable `UNKNOWN / REFRESH
REQUIRED`, open Human decision, missing source, stale source, contradiction,
invalid encoding, unavailable Git identity, invalid regression contract, or
stale operational projection blocks the requested snapshot.

## Local Use

From the Studio repository root, a Studio-only continuity check is:

```powershell
python -B Tools/AuthorityContinuity/validate_authority.py `
  --root . `
  --scope studio `
  --output Artifacts/Reports/C99-STUDIO-AUTHORITY-CORE-AND-FAIL-CLOSED-VALIDATOR-MVP-V1/repository-authority-snapshot.json
```

A combined Crime99 production check uses `--scope crime99-production` and is
expected to remain `BLOCKED` while the city pipeline is open or complete
current asset holdings remain unknown. Repeat `--scope` to request more than
one configured scope. A missing or unknown scope returns exit `3` without
writing output.

Exit `0` means the requested scope was reproduced without validator errors.
Exit `2` is an expected fail-closed snapshot. Exit `3` is a configuration or
validator failure. No exit code grants continuation, adoption, or production
authority.

Run the deterministic regression suite with:

```powershell
python -B -m unittest discover -s Tools/AuthorityContinuity/tests -v
```

The authority core binds the expected number of discovered `test_` methods.
The validator inspects the bundled suite and emits `E_REGRESSION_CONTRACT` on
count drift, unreadable source, invalid encoding, or invalid Python syntax.

## Filesystem Safety Boundary

Absolute paths, traversal, repository escape, duplicate source identity,
Windows alternate-data-stream syntax, symlinks, reparse components, and
source/config/tooling output aliases fail before an output write. Snapshot
writes use a same-directory temporary file, flush, file `fsync`, atomic
replacement, and cleanup.

This local MVP assumes a cooperative single-process invocation. It does not
claim protection against an adversarial process that replaces a checked parent
directory between preflight and the final filesystem operation. Such
concurrent mutation invalidates the run and requires a fresh invocation.

## Refresh Boundary

The configured hashes bind one reviewed source identity. Do not edit hashes to
silence `E_SOURCE_STALE`. Refresh requires reading the changed canonical
sources, reconciling authority, running the complete regression suite,
generating a new snapshot identity, and obtaining the applicable review and
Human decision.

## Exact V3 Rollback

The exact V3 rollback target is local commit
`66e0e8cda53fc88776088dad559e56fe486c2fcd`. With an empty index, restore only:

```powershell
git -c core.autocrlf=false restore `
  --source=66e0e8cda53fc88776088dad559e56fe486c2fcd `
  --worktree -- `
  Docs/WORK_STATE.md `
  Docs/CURRENT_HANDOVER.md `
  Tools/AuthorityContinuity/README.md `
  Tools/AuthorityContinuity/authority-core.json `
  Tools/AuthorityContinuity/validate_authority.py `
  Tools/AuthorityContinuity/tests/test_validate_authority.py `
  Artifacts/Reports/C99-STUDIO-AUTHORITY-CORE-AND-FAIL-CLOSED-VALIDATOR-MVP-V1/repository-authority-snapshot.json
```

Then verify all seven paths against commit `66e0e8c`, confirm the index is
empty, and stop. Do not use a broad reset or checkout: the Studio worktree
contains unrelated tracked and untracked work that must remain untouched.

## Director Dispatch and Closure Gates

`validate_director_dispatch.py` and `director-dispatch-schema-v1.json` are the
adopted active Dispatch Gate for `C99-STUDIO-DIRECTOR-DISPATCH-GATE-V1` under
`AGENTS.md`. They do not modify or depend on `authority-core.json` or
`validate_authority.py`, and do not grant project, Unity, Git, network, or
follow-on authority outside an individually valid receipt and Work Order.

Historical dispatch manifest/receipt version 1 remains verifiable evidence for
its original Worker handshake. It is not rewritten and cannot issue a new
Director receipt. Every new mutation-capable dispatch uses prospective
dispatch manifest version 2 and its required `orchestration` block.

The candidate implements a cooperative two-sided handshake:

1. The Director prepares one compact version-2 manifest that references and hashes the
   exact Work Order, current authority sources, applicable project sources,
   repository state, bounded dirty projection, permissions, routing, roles,
   plan, stop, monitoring, and Human checkpoint.
   The declared project ID is live evidence only when an identified UTF-8
   identity file inside the declared project root has the expected SHA-256 and
   exactly one declared-indentation `key: value` line. Horizontal spaces or
   tabs around the key/value delimiter are allowed, but physical line breaks
   are forbidden. Duplicate, nested, or differently indented key occurrences
   fail closed. Technical baselines are separate `file_sha256` proofs;
   status-only Human decisions are recorded separately and never count as byte
   identity.
2. The version-2 `orchestration` block must declare
   `director_mode: orchestration_only`, prohibit Director mutation, require one
   `create_thread` Worker separate from the Director, state requested model,
   reasoning effort and the exact matching routing reason, require
   `cursor_based` monitoring with `wait_threads`, activate any independent
   review only after reviewable evidence, reject Builder self-review as
   independent, and cap the decision-relevant Reviewer tasks at one.
3. `verify-director` revalidates live state and emits a new manifest-sibling
   receipt only when every deterministic check passes. It rejects version 1
   for new receipt issuance.
4. `verify-worker` revalidates the exact Work Order, manifest, receipt,
   capability evidence, repository projection, HEAD, and source hashes before
   task mutation. Missing, mismatched, reused-for-another-Work-Order, or stale
   receipts exit nonzero with an `E_*` code. The Worker also requires the
   receipt `gate_state` to exactly equal the bundled schema state, including
   when a modified receipt has a self-consistent recomputed ID.

The Director then creates the separate Worker task with the exact Work Order
and receipt and monitors it cursor-based. Human `go` authorises that dispatched
scope, not direct Director implementation. If task creation or monitoring is
unavailable, stop.

Example commands from the Studio repository root:

```powershell
python -B Tools/AuthorityContinuity/validate_director_dispatch.py `
  verify-director --root . --manifest <manifest.json> `
  --work-order <work-order.txt> --capabilities <capabilities.json> `
  --receipt <receipt.json>

python -B Tools/AuthorityContinuity/validate_director_dispatch.py `
  verify-worker --root . --manifest <manifest.json> `
  --work-order <work-order.txt> --capabilities <capabilities.json> `
  --receipt <receipt.json>
```

`check-manifest` and `verify-director --dry-run` perform no write. A successful
receipt is bound to one exact manifest and Work Order and cannot validate a
different assignment. Repeating read-only worker verification for the same
unchanged Work Order is intentional; the candidate does not claim an
unforgeable single-use token.

### Independent-review closure

After the Worker freezes reviewable evidence, the Director may activate at
most one applicable independent Reviewer task. For a required independent
`PASS`, prepare a closure manifest containing:

- the exact Work Order path, SHA-256 and ID;
- the exact prospective dispatch manifest and immutable dispatch receipt;
- distinct Director, Worker and Reviewer task identities;
- one aggregate candidate identity with every candidate file path, SHA-256 and
  byte count;
- evidence IDs with exact paths, SHA-256 values and byte counts;
- one independently authored review JSON file whose task identities, role,
  candidate identity, evidence IDs and `PASS` verdict match the manifest; and
- the exact `Docs/WORK_STATE.md` and `Docs/CURRENT_HANDOVER.md` projection
  paths.

`issue-closure` revalidates those live bytes and writes a new immutable receipt
next to the closure manifest. It fails if the Reviewer identity equals the
Worker or Director, the review is not `PASS`, or any candidate, evidence,
dispatch or review identity is stale or mismatched:

```powershell
python -B Tools/AuthorityContinuity/validate_director_dispatch.py `
  issue-closure --root . --closure-manifest <closure-manifest.json> `
  --work-order <work-order.md> --receipt <closure-receipt.json>
```

Only after that receipt exists may the Director write an independently
reviewed `PASS` into operational state. Both operational files must contain
these exact plain-text markers:

```text
<work-order-id>
Independent review verdict: PASS
Worker task: <worker-task-id>
Reviewer task: <reviewer-task-id>
Candidate identity: <aggregate-sha256>
Closure receipt: <closure-receipt-id>
```

Then run the final projection gate:

```powershell
python -B Tools/AuthorityContinuity/validate_director_dispatch.py `
  verify-closure --root . --closure-manifest <closure-manifest.json> `
  --work-order <work-order.md> --receipt <closure-receipt.json> `
  --work-state Docs/WORK_STATE.md --handover Docs/CURRENT_HANDOVER.md
```

A missing closure receipt or any missing/mismatched marker exits nonzero and
blocks the operational `PASS`. Closure validation is cooperative deterministic
identity enforcement, not authorship attestation or a security boundary
against a malicious filesystem writer.

The checked-in aggregate identity is reproduced from the exact schema-declared
implementation-file set with:

```powershell
python -B Tools/AuthorityContinuity/validate_director_dispatch.py `
  candidate-identity --root .
```

The command writes nothing. It prints one `CANDIDATE_IDENTITY` line followed
by the path, SHA-256, and byte count used for each path, with no recursive
identity artifact in its input set.

The proportional runtime acceptance budget for an ordinary local run is a
median below 3,000 ms for `verify-director --dry-run` and below 4,000 ms for
`verify-worker`, measured over at least nine repeated no-mutation runs on the
same unchanged manifest. Exceeding either threshold blocks adoption readiness
until the cause is understood or the Human accepts a revised budget.

SHA-256 provides deterministic identity and drift detection, not authenticity
against a malicious danger-full-access agent. Such an agent can alter the
script, schema, manifest, receipt, or repository. The candidate requires no
daemon, service, database, network, package, secret, plugin, or installation.
It is `ADOPTED_ACTIVE` following the required independent reviews and Human
governance adoption. The active gate remains cooperative and requires a valid
receipt for each separate mutation-capable project-task dispatch.
