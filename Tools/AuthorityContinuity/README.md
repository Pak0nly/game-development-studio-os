# Authority Continuity Validator MVP

## Boundary

This directory contains the local, Git-based MVP candidate for
`C99-STUDIO-AUTHORITY-CORE-AND-FAIL-CLOSED-VALIDATOR-MVP-V1`.

The authority core is an index of canonical source paths, candidate source
hashes, selectors, and fail-closed invariants. It is not an adopted standard,
does not copy canonical decision prose as a replacement authority, and grants
no production, Unity, asset, network, staging, commit, push, adoption, or
bootstrap-activation authority. Canonical Markdown remains authoritative.

Any missing source, byte drift, failed selector, contradiction, stale or
inconsistent operational projection, invalid UTF-8 input, unavailable Git
identity, or `UNKNOWN / REFRESH REQUIRED` result blocks the snapshot.

## Local Use

From the Studio repository root:

```powershell
python Tools/AuthorityContinuity/validate_authority.py `
  --root . `
  --output Artifacts/Reports/C99-STUDIO-AUTHORITY-CORE-AND-FAIL-CLOSED-VALIDATOR-MVP-V1/repository-authority-snapshot.json
```

The process exits `0` only when the validator can reproduce every configured
classification from exact current source bytes and the operational continuity
pair is current and consistent. Exit `2` is an expected fail-closed block.
Exit `3` is a validator/configuration failure. A `PASS` validates the snapshot
only; `continuation_authority_granted` remains `false`.

Run the deterministic regression suite with:

```powershell
python -m unittest discover -s Tools/AuthorityContinuity/tests -v
```

The tests create disposable local fixtures at runtime. They do not use RAG,
embeddings, an external database, an external service, Unity, MCP, or network
access.

## Refresh Boundary

The checked-in candidate hashes deliberately bind this MVP to one reviewed
source identity. Do not edit hashes merely to silence `E_SOURCE_STALE`.
Refresh requires reading the changed canonical sources, reconciling authority,
rerunning the regression suite, generating a new snapshot identity, and
obtaining the applicable review and Human activation decision.

## Exact Rollback

Before adoption or bootstrap activation, rollback consists only of:

1. remove `Tools/AuthorityContinuity/`;
2. remove
   `Artifacts/Reports/C99-STUDIO-AUTHORITY-CORE-AND-FAIL-CLOSED-VALIDATOR-MVP-V1/`;
3. restore `Docs/WORK_STATE.md` and `Docs/CURRENT_HANDOVER.md` to the exact
   pre-task bytes preserved in the MVP validation report; and
4. verify that no other path changed and both Git indices remain empty.

Do not use a broad reset or checkout for rollback. The Studio worktree already
contains unrelated pre-existing tracked and untracked work that must remain
untouched.
