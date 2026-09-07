# Task-Delta Work Order — HVDT V1 Final Guided-Flow Correction

Assignment: Correct only the four consolidated HT5 Human-usability defects and
produce one exact successor candidate.

Execution mode: `Production — Final Guided-Flow Correction`

Objective: Produce one post-HT5 candidate in which repairs require complete
Human disposition, edited decisions cannot retain stale derived mapping status,
the formal checklist matches the visible controls, and German Guided Mode has
the required programmatic accessibility semantics.

## Authoritative Baseline

- Repository authority order in `AGENTS.md`.
- `Docs/CONFIRMED_DECISIONS.md`, `Docs/WORK_STATE.md`, and
  `Docs/CURRENT_HANDOVER.md`.
- Adopted Execution Modes and Stage Review Standard, AI Development Rules, Role
  Operating Model, Review Board Protocol, and Role Review Output Schema.
- Human Authority — HVDT V1 Final Guided-Flow Correction.
- Frozen reviewed tool candidate `HVDT-V1-HT5`.
- HT5 aggregate SHA-256
  `D836B39996F5BD116D4C1B8497876068A2CD981A498DE27E0E7668FD05018762`.
- Crime99 package SHA-256
  `0D89E6EB7C521142B94917A0ABA3B9F4F5B003671C6270A218C8F0ABD7EEA31E`.
- Prepared preview identity `21/21/21`.
- Current Human-only Vendor workflow records and preserved historical candidate
  `C99-SMP1-P1-V1`.

Accountable builder: Work, limited to deterministic non-visual changes in the
authorised reusable tool/package/frontend/tests/docs and operational-state
maintenance.

## Allowed Changes

- `Tools/HumanVisualDecisionTool/**`;
- `Docs/WORK_STATE.md`; and
- `Docs/CURRENT_HANDOVER.md`.

Prepared previews may be verified and re-registered from ignored RuntimeData,
but must not be regenerated, opened, viewed, or changed.

## Authorised Defect Classes

1. Complete repair-option disposition:
   - every ordinary repair candidate receives exactly one of `SELECT`, `REJECT`,
     or `DEFER`;
   - unresolved ordinary candidates block completion;
   - deferred candidates require a Human reason;
   - no repair material is forced merely to complete the category;
   - dispositions survive draft, summary, export, and reload.
2. Guided mapping-status refresh:
   - any changed completed decision immediately clears its derived note and
     becomes unresolved;
   - guided continuation recomputes the note from current state;
   - save, Back/Next, summary return, reload, and result preparation cannot
     preserve stale notes.
3. Checklist/control alignment:
   - one primary action is labelled `Auswahl speichern und weiter`;
   - the final category uses an exact, documented summary action;
   - checklist, help, recovery, and validation instructions use actual labels.
4. German Guided accessibility completion:
   - normal-flow strings are German;
   - decision/comparison toggles expose pressed state;
   - active navigation exposes current state;
   - dialogs have accessible names and descriptions;
   - progress is programmatic;
   - keyboard and visible-focus behavior remain intact.

## Frozen / Out of Scope

- Regenerating or visually inspecting prepared previews.
- Preview framing, material, content, category count, or general decision-mode
  changes beyond repair dispositions.
- Preserved and production Crime99 scenes, materials, prefabs, geometry,
  placements, captures, Vendor originals, Unity `Packages`, and
  `ProjectSettings`.
- Human visual judgement, option ranking, AI visual review, screenshots,
  multimodal evidence, or applying decisions to Unity.
- Architecture redesign, accounts, cloud, remote access, collaboration,
  notifications, analytics, telemetry, downloads, installation, staging,
  commit, and push.

Formal Crime99 Surface corrections consumed remain `0 of 1`.

## Regression and Browser Evidence

- Preserve and pass all `80` existing tests.
- Add focused tests for all four authorised defect classes without weakening or
  deleting existing assertions.
- Re-run applicable focused QA checks.
- Verify the unchanged 21-preview ID and content-hash set. If package metadata
  changes only for dispositions, record and use its new exact hash for
  registration.
- Use the Browser skill for localhost DOM, interaction, request, accessibility,
  and console checks without screenshots or visual judgement.
- Exercise unresolved repair blocking, complete dispositions, edit-to-unresolved
  status clearing, guided recomputation, checklist/control agreement, toggle and
  navigation states, dialog naming, progress semantics, and zero console
  warnings/errors.

## Required Stage-Exit Reviews

- UI/UX Reviewer: German guided labels, complete repair workflow, control
  agreement, navigation, summary, keyboard-accessible semantics, dialogs, and
  progress without judging image content.
- Software Engineer / Technical Director: disposition validation, derived-state
  lifecycle, package/result/draft compatibility, maintainability, and
  deterministic export.
- QA Lead: 80-test regression plus focused transition, reload, negative, browser,
  preview-identity, and image-free export evidence.
- Asset & Provenance Manager: unchanged preview bytes/IDs, approved local roots,
  Vendor isolation, dependencies, and protected-source preservation.
- Producer / Scope Controller: scope, lowest-verdict consolidation, correction
  accounting, Human-only visual boundary, and second-test handoff.

Art Direction, Technical Artist visual review, screenshot review, and multimodal
review are prohibited and `NOT APPLICABLE`.

## Correction Accounting

The one Human-authorised HT5-to-successor correction allowance was consumed by
the first mutation of this work order. There are `0` post-freeze correction
rounds. Formative corrections may continue only inside these four defect classes
until the successor candidate is frozen. A failed mandatory review then stops
without further candidate mutation.

## Done When

- Every ordinary repair candidate has an explicit disposition and unresolved
  candidates cannot be silently finalised.
- Edited completed categories cannot retain stale derived mapping state.
- Checklist and actual visible controls agree exactly.
- Normal Guided Mode is coherently German and exposes required programmatic
  accessibility states.
- All existing and new tests, focused QA, browser QA, preview-identity,
  deterministic text-only export/reload, and protected-scope checks pass.
- One exact new candidate and package hash are recorded.
- All five mandatory reviews pass on the same frozen candidate.

Human checkpoint: After all required reviews pass, the Human may run the exact
successor package for the second local usability test. Neither the tool nor its
result authorises Crime99 Surface mutation.
