# Studio OS Human Visual Decision Tool V1

> **Status:** the prepared-preview and Guided Human Mode correction is under
> local technical validation for the second bounded Human usability test. It is
> restricted to localhost and one trusted Human. Do not begin the Crime99
> Surface correction.

This local tool lets the Human inspect locally prepared visual options, record explicit decisions, save progress, validate completeness, and export deterministic text-only results. It performs no visual analysis and has no AI, cloud, analytics, telemetry, upload, or external runtime dependency.

The first included package is:

`Crime99 — Surface Material Human Selection`

## Start on Windows

1. Double-click `Start-HumanVisualDecisionTool.cmd`.
2. Your default browser opens:

   `http://127.0.0.1:8765/`

3. Keep the launcher window open while reviewing.

If the browser does not open automatically, enter the address above manually.

## Stop

Return to the launcher window and press `Ctrl+C`. Wait until `Stopped.` appears, then close the window.

## Human Review Flow

1. The Crime99 package opens directly at decision 1 of 8 in German Guided Human
   Mode.
2. Inspect the prepared local previews and choose the intended option with the
   plain-language controls.
3. In `Reparaturen und Abnutzung`, give every one of the four candidates an
   explicit `Verwenden`, `Nicht verwenden`, or `Später entscheiden`
   disposition. A deferred candidate requires a Human reason; no material is
   forced.
4. Add an optional category note only when useful.
5. Select `Auswahl speichern und weiter`.
6. Repeat until the readable summary shows all eight decisions.
7. Use `Auswahl speichern` at any time. Closing the browser never finalises a draft.
   If a malformed saved draft is detected, the tool preserves a recovery copy and
   requires explicit Human confirmation before replacing it.
8. Editing any completed category immediately returns it to `Noch offen` and
   clears its derived technical status. Only guided continuation completes it
   again and regenerates that status; this state persists through save, back,
   summary, reload, and final validation.
9. On the summary, provide the Human identifier and both confirmations. The local
   decision time is filled automatically.
10. Check completion and finalise the deterministic text-only export.

Technical renderer, object, slot, GUID, and numeric fields remain available only
inside the collapsed advanced section. They do not block a visual decision. When
they are absent, the result records `TECHNICAL MAPPING PENDING`; later mutation
still requires a separately authorised deterministic mapping pass.

## Local Paths

- Tool: `Tools/HumanVisualDecisionTool`
- Crime99 package: `Tools/HumanVisualDecisionTool/Packages/crime99-surface-material-v1.json`
- Runtime data: `Tools/HumanVisualDecisionTool/RuntimeData`
- Draft: `RuntimeData/drafts/crime99-surface-material-human-selection-v1.json`
- Preview registrations: `RuntimeData/preview-registrations/`
- Package previews: package-declared files below `RuntimeData/previews/`
- Registered previews: verified copies below
  `RuntimeData/previews/registered/<decisionSetId>/`
- Final Crime99 results: `RuntimeData/results/crime99-surface-material/`

`RuntimeData/` is Git-ignored except for its placeholder file.

## Prepared Crime99 Previews

The normal launcher automatically verifies and registers the fixed prepared
Crime99 set before starting the server. The package pins all 21 preview hashes.
The browser receives only approved package-specific copies.

Generating the set is an advanced maintenance task:

`Prepare-Crime99-Previews.cmd`

It launches Unity in batch mode against a transient empty scene, uses fixed
camera, lighting, geometry, resolution, and output names, writes only to ignored
`RuntimeData/`, and removes its temporary Editor helper. It does not open or save
the production scene and does not alter Vendor materials.

Manual labelled registration remains available only for other packages or
maintenance:

`Register-Local-Preview.cmd`

For deterministic batch maintenance, the text-manifest command remains available:

`Register-Previews.cmd "C:\path\to\preview-registration-input.json"`

Registration checks only:

- exact preview ID;
- exact active decision-set and source-package hash;
- file existence and current SHA-256;
- extension, signature, and MIME type;
- byte length;
- pixel dimensions;
- supported V1 limits.

After these checks, the registrar copies the source into the package-specific
approved local preview root. The browser server never loads the original selected
path. Pre-allowlist registrations must be registered again.

It performs no visual assessment, scoring, captioning, tagging, or recommendation. The registration record is text only.

## Supported Package Features

- single choice;
- multiple choice;
- ordered preference;
- approve/reject per option;
- explicit `SELECT`, `REJECT`, and package-permitted `DEFER`;
- package-permitted `NOT APPLICABLE` with a Human reason;
- isolated material, contextual scene, side-by-side, before/after, static image, and externally prepared local-image preview concepts;
- option comments, category comments, implementation notes, exceptions/concerns, and typed implementation fields.

To load another conforming package without code changes:

`py -3 server.py --package "C:\path with spaces\decision-package.json" --runtime-data "C:\local runtime data" --open`

## Deterministic Export

JSON is authoritative. The result includes:

- result and package schema versions;
- decision-set ID;
- source package SHA-256;
- Human identifier and decision time;
- final category and option states;
- selected option IDs;
- exact technical and implementation metadata;
- Human comments, instructions, mappings, and numeric fields;
- deterministic SHA-256 result hash.

The hash is computed over canonical UTF-8 JSON before the `resultHash` field is added. Repeating finalisation with identical package bytes and identical Human input produces the same result and hash.

Human decision timestamps use an ISO local date/time with seconds and an explicit
UTC offset, for example `2026-07-23T12:30:00+02:00`. Reopened JSON must match the
exact active package's identity and semantic contract; a recalculated result hash
alone is insufficient.

Preview paths, preview bytes, screenshots, thumbnails, textures, base64 content, embeddings, image vectors, and external image URLs are excluded from the export.

## Known V1 Limitations

- Prepared previews are comparison aids, not proof of final technical
  compatibility or production-scene appearance.
- The tool does not apply final decisions to Unity.
- Missing renderer/object mappings and exact values are exported as
  `TECHNICAL MAPPING PENDING` and must be resolved before any separately
  authorised Crime99 mutation.
- One package is active per server launch.
- There are no accounts, remote access, collaboration, cloud sync, or multi-user approval chains.
- Localhost-only operation protects against network exposure; it is not a security boundary against other software already running under the same Windows user.
- The Human must test the interface locally. Automated tests are non-visual.
- A completed result from another package revision is historical/incompatible and
  cannot be reopened as the current package result.

## Accepted Local-Only V1 Risks

The Human has accepted that V1 does not provide exhaustive public-web URL
hardening, hostile hand-edited local-package protection, LAN/public deployment,
authentication, multi-user permissions, universal CSS sanitisation, or
nonessential RFC-3339 edge-case coverage. These are deferred limitations, not
resolved claims. The approved workflow remains localhost-only, single-Human, and
allowlist-based for preview files.

## Maintenance and Tests

Architecture and security decisions are recorded in `Docs/ARCHITECTURE.md`. Package and result schemas are in `Schemas/`.

Run all non-visual tests:

`py -3 -m unittest discover -s tests -v`

The application uses only the Python standard library and browser-native features. No installation or dependency download is required for the current Windows environment.

## Absolute Boundary

Do not attach, paste, upload, or return Vendor-containing previews, screenshots, renders, textures, or thumbnails to an AI system. Only the final text metadata may enter later Work tasks.

This tool does not authorise the Crime99 Surface correction. That remains a separate task after a complete Human decision record and separate mutation authority.
