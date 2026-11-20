# Work Order INK-WEB-V2 — Browser prototype: fixes from the independent review

Project: Inkweight (DEC-044). Director: Claude (orchestration only). Worker: one
separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python3 -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py verify-worker --root . --manifest Artifacts/Inkweight/DirectorDispatch/INK-WEB-V2/DISPATCH_MANIFEST.json --work-order Artifacts/Inkweight/DirectorDispatch/INK-WEB-V2/WORK_ORDER.md --capabilities Artifacts/Inkweight/DirectorDispatch/INK-WEB-V2/CAPABILITIES.json --receipt Artifacts/Inkweight/DirectorDispatch/INK-WEB-V2/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human authority (exact, 2026-11-19)

"Ja. Du hast bis 9 Uhr Zeit daran zu arbeiten. [...] Nutze die Zeit bis 9 Uhr
voll aus und suche dir selbst passende Aufgaben. Ziel ist ein spielbarer
Prototyp, oder zumindest die Vorbereitung dessen."

## Read first

`Artifacts/Inkweight/DirectorDispatch/INK-WEB-V1/WORK_ORDER.md` (its page rules
and limits still apply), `Artifacts/Inkweight/Evidence/INK-WEB-V1/WORKER_RESULT.md`
and `REVIEW.md`, and the app sources.

## Objective

Fix what the independent review found in the browser prototype so that the
Human's first five minutes on a phone are not spoiled by interface problems.
The core stays version 1 in this order; a later order moves the app to core
version 2.

## Tasks

1. Important finding 1: rename undo to "Rückgängig"; leaving a drawing screen
   with unsaved strokes (free draw, hero, weapon, enemy, Ring drawing) asks
   once before discarding.
2. Important finding 2: the drawing screen works on a phone held sideways
   (780 x 400): canvas beside tools and stats, the main button reachable
   without scrolling. Fights also work sideways.
3. Important finding 3: taps are ignored for a short moment after every screen
   change, so a double tap never acts on the next screen and never starts the
   drawing clock.
4. All ten minor findings of the review: German decimal comma; a clear signal
   when the ink runs out; a finger leaving the canvas stops painting; no long
   line after a rotation mid-stroke; damage numbers that stay readable in big
   fights; win dots updated after the deciding round; stakes that never look
   identical and a use or an honest label for leftover ink; start-screen
   scribbles marked as placeholders or replaced by gallery drawings;
   `verify.cjs` writes screenshots outside the evidence folder unless told
   otherwise; one name for black ink everywhere.
5. Worker-reported weaknesses of the first order: run the three non-healing
   shop choices and both solo loss paths in the automated check; a bot never
   picks a drawing identical to the human's; ink stains survive a resize.
6. Until the new core arrives, do not promise more than the rules deliver on
   screen: keep the one-sentence rule, but the sharpness explanation line says
   what version 1 really does.
7. Rebuild both dist files; run the full automated check for phone, phone
   sideways, desktop, artifact frame and two humans; look at fresh screenshots
   of every changed screen and fix what looks wrong.
8. Evidence `Artifacts/Inkweight/Evidence/INK-WEB-V2/`: `WORKER_RESULT.md`
   (verify-worker line, each finding and what was done, commands and real
   output, what you saw, anything not done) and about 10 screenshots.

## Allowed mutations

Only explicitly listed mutations are authorised; everything else is out of
scope: `Projects/Inkweight/Source/WebPrototype/app`,
`Projects/Inkweight/Source/WebPrototype/dist`,
`Projects/Inkweight/Source/WebPrototype/build`,
`Artifacts/Inkweight/Evidence/INK-WEB-V2`.

## Task-specific controls

- Capability Knowledge Base query: NOT APPLICABLE (browser design tool, plain
  web platform features).
- Planned setup: none. Candidate-attempt start condition: first build that
  passes the automated check. Candidate-attempt allowance: one candidate.
  Operational-recovery allowance: Core default. Formal stage-correction
  allowance: 2 rounds. Task-owned namespaces: the allowed paths.
- Core, shared files and tuning are read-only. Another Worker is changing the
  core in a separate work copy under `.claude/worktrees/`: ignore that folder.
- Pre-installed Playwright only; no downloads, installs, npm packages or
  network use. Original work only. German player text.
- Time: check `date -u`; aim to return within about 60 minutes and at the
  latest after 80 minutes, with an honest list of what is unfinished.
- Do NOT commit or push.

## Success

Every review finding is fixed or its remaining state is named; the automated
check passes for all five setups with real output shown; both dist files are
current and follow the page rules.

## Stop

Stop and report on verify-worker failure, any need outside the allowed paths,
or a protected change.
