# Human Visual Decision Tool V1 — Maintenance Guide

## Component Map

- `decision_tool.py`: schema checks, draft normalisation, completion rules, safe paths, hashing, text-only export, and Markdown generation.
- `server.py`: fixed loopback HTTP service, security headers, local API, static files, preview serving, persistence, and shutdown.
- `register_previews.py`: deterministic local preview metadata registration.
- `prepare_crime99_previews.py`: prepared-manifest verification, automatic
  registration, and bounded Unity batch orchestration.
- `UnityAutomation/HvdtPreparedPreviewGenerator.cs`: fixed, transient Crime99
  comparison rendering without production-scene saves.
- `guided_preview_registration.py`: dependency-free Windows file-picker flow for non-programmers.
- `web/`: dependency-free Human interface.
- `Schemas/`: package and result contracts.
- `Packages/`: tracked text-only decision packages.
- `RuntimeData/`: ignored local drafts, previews, registrations, and results.
- `tests/`: non-visual unit and loopback integration tests.

## Adding a Decision Package

1. Copy the current package structure.
2. Assign a stable, unique `decisionSetId`.
3. Keep Human-facing description, local preview references, technical metadata, implementation metadata, and validation rules distinct.
4. Use only local relative paths in `previewAssets`.
5. Keep every option neutral. Do not add automated recommendations or rankings.
6. Define required fields that make downstream implementation deterministic.
7. Validate by launching with the new `--package` path and running the test suite.

Changing a package changes its source package hash. Existing draft data is keyed by `decisionSetId`; use a new ID when the decision contract changes incompatibly.

## Schema Changes

V1 package and result schema versions are `1.0`.

For an incompatible change:

- introduce a new schema version;
- retain the old reader only when there is a real migration need;
- add positive and negative tests;
- document result-hash implications;
- do not silently reinterpret an existing final result.

## Result Determinism

Never add server-generated current time, random IDs, environment-dependent order, preview metadata, or filesystem timestamps to the authoritative result. The Human supplies the decision date/time. Dictionaries are canonicalised with sorted keys and compact JSON before hashing.

If result fields change, add tests proving:

- repeated identical input yields byte-equivalent logical output and the same hash;
- `verify_result_hash` passes;
- output remains text only;
- old results are not silently treated as the new schema.

## Security Invariants

Preserve:

- fixed `127.0.0.1` binding;
- local Host and Origin enforcement;
- same-origin CSP and resource policy;
- no remote assets or external requests;
- maximum JSON body size;
- safe relative-path resolution;
- exact registered and package-relative preview hash checking;
- package-declared previews restricted to `RuntimeData/previews/`;
- registered source images copied into the package-specific approved preview root;
- supported image-type allowlist;
- atomic draft writes;
- malformed-draft recovery preservation and explicit replacement confirmation;
- reopened-result binding to the active decision-set ID and package hash;
- package-aware reopened-result validation for categories, options, modes,
  required values, field identities, and declared field types;
- exact derived Guided implementation status validation, including explicit
  use/reject/defer disposition for every repair candidate and a Human reason for
  each deferred repair candidate;
- strict declared implementation-field types;
- syntax-aware rejection of external and scheme-relative visual references;
- no executable package content;
- no HTML insertion of unescaped package or Human text.

The V1 security claim is deliberately local-only. Do not reuse the server for LAN
or public hosting, untrusted package exchange, or multi-user access without a new
threat model and separate hardening work.

Do not add remote access, accounts, uploads, cloud storage, external notifications, AI calls, or direct Unity mutation as incidental features.

## Validation Before Handoff

Run:

`py -3 -m py_compile decision_tool.py server.py register_previews.py prepare_crime99_previews.py`

`py -3 -m unittest discover -s tests -v`

`git diff --check -- Tools/HumanVisualDecisionTool`

Then perform local browser structure and interaction checks without screenshots
or visual interpretation. Verify Guided Human Mode, all 21 preview requests,
choice persistence, collapsed advanced inputs, summary/export controls, and an
empty warning/error console. Human visual assessment of Vendor-containing
previews remains outside AI observation.
