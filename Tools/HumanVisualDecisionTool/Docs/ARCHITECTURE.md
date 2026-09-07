# Human Visual Decision Tool V1 Architecture

## Decision

Place the reusable application at:

`Tools/HumanVisualDecisionTool`

This location is repository-owned, project-independent, and consistent with the existing `Tools/` surface for reusable Studio OS utilities. The application is intentionally outside every Unity project. Runtime state is stored below the tool in the Git-ignored `RuntimeData/` directory. Vendor packages and Unity projects are neither copied nor modified.

## Selected Implementation

V1 uses:

- Python 3 standard library for a loopback-only HTTP server, validation, hashing, local persistence, and export;
- plain HTML, CSS, and browser JavaScript for the Human review interface;
- versioned JSON files for decision packages, drafts, preview registrations, and authoritative results;
- generated Markdown as a non-authoritative readable companion;
- no database, package manager, remote service, CDN, framework, analytics, telemetry, or runtime dependency download.

The server is started with one package path. Loading another conforming package requires only a different `--package` argument; no application code changes.

## Three-Layer Boundary

### 1. Decision Package

A package contains Human-facing descriptions, local preview identifiers, deterministic implementation metadata, required input fields, validation rules, and output configuration. Packages contain no decision state.

### 2. Local Human Review Interface

The interface requests the active package from the loopback server, displays registered local previews, and records Human input. It performs no scoring, ranking, recommendation, image processing, captioning, similarity analysis, or AI call.

### 3. Text-Only Decision Export

The server validates the final Human input and writes canonical JSON. The deterministic result hash is SHA-256 over the UTF-8 canonical JSON payload before the `resultHash` field is added. Markdown is derived from the same validated result. Preview bytes and image-derived features are never embedded.

## Security and Privacy

- Bind address is fixed to `127.0.0.1`; command-line input cannot expose the server to the LAN.
- Host and Origin checks reject non-local browser requests.
- The browser receives a restrictive Content Security Policy with `default-src 'self'`, no remote connections, and no inline executable script.
- Static and preview path resolution rejects traversal.
- Package-declared preview paths must be relative paths below
  `RuntimeData/previews/`.
- Human-selected registration sources are verified and copied into
  `RuntimeData/previews/registered/<decisionSetId>/`; the server never serves the
  original external source path.
- Preview serving requires a registration bound to the exact decision-set ID and source-package SHA-256, or a package-relative file with an explicit expected SHA-256.
- Package-relative preview bytes are hashed before serving and must match their declared `expectedSha256`.
- Registered bytes are checked against their SHA-256, signature, MIME type, dimensions, size limit, and supported file type before serving.
- Supported preview types are PNG, JPEG, GIF, and BMP. Unsupported or spoofed content is rejected.
- Drafts and results are written only below the selected runtime-data root.
- Draft structure is validated before use. Malformed original bytes are preserved under a deterministic recovery name, and save or finalisation cannot replace them without explicit Human confirmation.
- Reopened results are treated as current only when both the decision-set ID and exact source-package SHA-256 match the active package.
- Reopened results are also validated against the active package's schema version,
  exact categories, option identities and metadata, selection modes, required
  comments/reasons, implementation-field identities and types, and completion
  rules. Reopen never changes the original result file.
- Syntax-aware visual-reference checks reject external and scheme-relative media references in accepted package and Human text while retaining valid local references.
- Normal operation performs no external network request.
- No authentication is included because the service is loopback-only and single-user; this is not a remote-access security model.

## Accepted V1 Local-Only Risk Model

V1 is approved only for one trusted Human on one local Windows machine through
localhost. It is not approved for public hosting, LAN access, cloud sync,
untrusted collaborators, or adversarial multi-user use.

The Human explicitly accepts these bounded V1 concerns:

- external-URL spellings outside the approved package/preview workflow may not be
  exhaustively classified;
- deliberately malicious hand-edited local package files are outside the normal
  operating model;
- exhaustive IPv6, single-label-host, arbitrary-CSS, and public-server hardening
  is deferred;
- RFC-3339 edge cases beyond the documented offset-bearing local timestamp are
  deferred.

These are accepted risks, not resolved security claims. The decisive preview rule
is an allowlist: if the requested preview ID does not resolve to the exact
package-declared file below `RuntimeData/previews/` or a verified package-specific
registered copy, the server does not load it.

## Deferred Beyond V1

- public or LAN deployment;
- user authentication and multi-user permissions;
- hostile local-file and collaborator threat models;
- universal external-URL and arbitrary-CSS sanitisation;
- strict timestamp edge cases not needed for reliable local round trip.

The published JSON schemas document the portable file contracts and are aligned
with executable type, selection, status, count, conditional-field, and
required-field rules. The Python validators are the executable authority at load,
save, finalisation, registration, and completed-result reopen boundaries. They are
intentionally stricter only where JSON Schema cannot verify storage-safe
identifiers, local filesystem state, file hashes, or image bytes. No runtime schema
package or downloaded dependency is required.

## Vendor Isolation

The tool may serve local preview bytes to the Human's local browser. Work interacts only with paths, hashes, sizes, dimensions, MIME types, and text metadata. Preview registration is deterministic and does not interpret image content.

The Crime99 package pins 21 prepared preview IDs and SHA-256 values. A bounded
Unity batch helper creates them in a transient empty scene and writes only below
ignored RuntimeData. Startup verifies and registers approved copies before the
browser opens. The helper never opens or saves the production scene and is
removed from the Unity project after every run. Work handles only paths, hashes,
dimensions, sizes, and other non-visual validation data.

## Windows Operation

`Start-HumanVisualDecisionTool.cmd` verifies and automatically registers the
prepared Crime99 set, launches the fixed package through the installed Python 3
launcher, and opens the loopback URL. `Ctrl+C` in the launcher window performs
graceful shutdown.

Paths containing spaces are handled as full arguments rather than shell-concatenated fragments.

## Extension Boundary

Future package types can add categories, fields, modes, and local preview registrations without changing the server. Packaging as a desktop executable, direct Unity preview automation, multi-user approval, remote access, and automatic decision application remain separate future tasks.
