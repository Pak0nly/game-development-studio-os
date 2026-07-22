# Baseline Integration and Commit Preparation Playbook

> **Status:** Adopted through LAIA-2026-07-22 on 2026-07-22. This playbook does not itself grant stage, commit, push, merge, rebase, or publication permission.

## Use

Load this playbook for technical integration of an approved delta into an accepted baseline and for preparing an exact reviewable Git change set. It does not grant permission to stage, commit, push, merge, rebase, configure a remote, or publish.

## Inputs

- exact repository, branch, HEAD, accepted baseline, and authorised file scope;
- project Production Profile and applicable context records;
- source candidate and its validation/evidence identity;
- protected and excluded paths, Vendor and licence boundaries; and
- required technical integrity and regression checks.

## Workflow

1. Verify repository, branch, worktree, HEAD, index, dirty state, ignored dependencies, and intended source/target identities.
2. Preserve unrelated tracked and untracked work. Do not clean, reset, stash, discard, or semantically merge it without authority.
3. Integrate only the authorised delta. Keep generated evidence and builds out of Git unless explicitly included.
4. Verify dependency closure, references, serialization, provenance, protected-source integrity, local Markdown links when documentation changes, and proportionate regressions.
5. Record the exact diff, changed files, validation, unresolved concerns, and candidate identity.
6. Run only decision-relevant technical reviewers. Do not activate unrelated art, gameplay, audio, or visual boards for a technical integration stage.
7. Stop at a commit-ready handoff unless the Human Developer separately authorises the next Git action.

## Stop

Stop for an unresolved source conflict, unexpected outside-scope change, missing dependency or licence evidence, protected-source drift, non-reproducible candidate, destructive cleanup need, or any required stage/commit/push/merge/rebase/remote authority. A stop still permits completion of the factual integration record and review package.
