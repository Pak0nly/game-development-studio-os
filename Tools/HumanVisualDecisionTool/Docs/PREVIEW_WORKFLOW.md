# Deterministic Local Preview Workflow

## Purpose

This workflow prepares and registers fixed local images for Human-only
inspection. It does not authorise AI visual analysis or production mutation.

The preview environment is a selection aid. It is not production evidence and does not prove technical compatibility or final visual acceptance.

## Prepared Crime99 Set

The authorised Crime99 maintenance command is:

`Prepare-Crime99-Previews.cmd`

It creates 21 package-bound previews for the eight categories with a fixed
960×540 resolution, fixed camera, lights, transient geometry, and stable output
names. Every record includes path-free identity metadata, dimensions, byte size,
SHA-256, colour-count sanity data, and error-shader pixel count.

The generator uses a new empty scene and never opens or saves the Crime99
production scene. Vendor source materials are read only. HDRP repair decals are
represented through a transient URP adapter that copies only their audited base
texture, colour, roughness, and metallic values. Outputs remain below ignored
`RuntimeData/prepared-previews/`.

The normal launcher runs `prepare_crime99_previews.py --register-existing`.
This verifies the manifest and all package-pinned hashes, then registers approved
copies automatically. No file picker or JSON editing is part of ordinary Human
use.

## Registration Contract

For non-Crime99 packages or advanced maintenance, the manual labelled
`Register-Local-Preview.cmd` flow remains available.

For batch maintenance, prepare a text manifest based on
`preview-registration-input.example.json`.

Each entry contains:

- exact package `previewId`;
- absolute local file path;
- optional expected SHA-256.

Run:

`Register-Previews.cmd "C:\path\to\preview-registration-input.json"`

The deterministic registrar verifies:

- preview ID exists in the package;
- file exists;
- file extension and MIME type are supported;
- width and height can be read from the file structure;
- byte length;
- SHA-256;
- optional expected hash.

After verification, it copies the bytes without visual interpretation into the
approved package-specific local root:

`RuntimeData/previews/registered/<decisionSetId>/<previewId>.<extension>`

The registration records this approved copy. The server does not serve the
original selected path. Existing pre-allowlist registrations outside this root are
ignored and must be registered again.

The resulting text record is written to:

`RuntimeData/preview-registrations/<decisionSetId>.json`

## Supported Local Image Types

- PNG
- JPEG
- GIF
- BMP

The application serves only:

- an exact package-declared relative file below `RuntimeData/previews/`; or
- an exact registered copy below
  `RuntimeData/previews/registered/<decisionSetId>/`.

Anything outside these approved local roots, any traversal, and explicit remote or
scheme-relative references are blocked. If a registered or package-declared hash
changes, the preview is blocked until the Human registers or restores it.

## Absolute Prohibitions

Do not:

- return previews, screenshots, textures, thumbnails, or renders to an AI system;
- ask an AI to frame, score, compare, caption, tag, classify, or recommend the Vendor-containing images;
- create new assets from Vendor visual references;
- mutate Vendor originals;
- overwrite the historical Surface candidate;
- begin the formal Surface correction;
- include image bytes, base64 data, embeddings, visual features, or external image URLs in text records.

If the deterministic generator cannot produce a valid package-bound preview,
stop and report the text-only validation failure. Do not substitute AI visual
judgement.
