# Work Order INK-WEB-V4 — Browser prototype on core version 3

Project: Inkweight (DEC-044). Director: Claude (orchestration only). Worker: one
separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python3 -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py verify-worker --root . --manifest Artifacts/Inkweight/DirectorDispatch/INK-WEB-V4/DISPATCH_MANIFEST.json --work-order Artifacts/Inkweight/DirectorDispatch/INK-WEB-V4/WORK_ORDER.md --capabilities Artifacts/Inkweight/DirectorDispatch/INK-WEB-V4/CAPABILITIES.json --receipt Artifacts/Inkweight/DirectorDispatch/INK-WEB-V4/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human authority (exact, 2026-11-19)

"Ja. Du hast bis 9 Uhr Zeit daran zu arbeiten. Gerne mit Unity3D als
Zielplattform um es auch mobile und Webtauglich zu bekommen wenn nötig.
Hauptziel bleibt Steam. Nutze die Zeit bis 9 Uhr voll aus und suche dir selbst
passende Aufgaben. Ziel ist ein spielbarer Prototyp, oder zumindest die
Vorbereitung dessen."

## Read first

`Projects/Inkweight/Source/Shared/CHANGES_V3.md` (the app checklist),
`Projects/Inkweight/Docs/INK_RULES_V2.md` (rules as built, now version 3),
`Artifacts/Inkweight/Evidence/INK-WEB-V3/WORKER_RESULT.md` and `REVIEW.md`
(both sections), and the page rules in
`Artifacts/Inkweight/DirectorDispatch/INK-WEB-V1/WORK_ORDER.md`.

## Objective

Move the browser prototype to core version 3 (already in `core/` and
`Source/Shared`): solo enemies got a speed floor and heavy copies hit harder
with the stake ("crush"), crowds separate better; no stat and no Ring balance
number changed. This is the version the Human sees in the morning.

## Tasks

1. Rebuild on core version 3 and follow the app checklist of `CHANGES_V3.md`.
   Every sentence about solo stakes and enemies on the page must be true for
   version 3 (heavy enemies hit harder at a higher stake; the boss and its
   escorts do not crush; what a stake really changes for the drawn design).
2. Anything the re-review of INK-WEB-V3 left open (read its top section).
3. First-run help, kept small: the first time a person opens the drawing
   screen, the three things worth knowing in one compact, dismissible hint
   (thin strokes are blades, filled areas are armour, loose bits drip off),
   and never again after that. If a hint of this kind already exists, make
   sure it is true for version 3 and not in the way.
4. Run the full automated check (all setups) with `--shots` outside the
   repository; play one solo run at x1 and one at x2 with a heavy block enemy
   yourself through Playwright and say whether the stake and the boss feel
   fair; look at fresh screenshots of every changed screen.
5. Evidence `Artifacts/Inkweight/Evidence/INK-WEB-V4/`: `WORKER_RESULT.md`
   (verify-worker line, what changed, commands and real output, what you saw,
   anything not done) and a few screenshots.

## Allowed mutations

Only explicitly listed mutations are authorised; everything else is out of
scope: `Projects/Inkweight/Source/WebPrototype/app`,
`Projects/Inkweight/Source/WebPrototype/dist`,
`Projects/Inkweight/Source/WebPrototype/build`,
`Artifacts/Inkweight/Evidence/INK-WEB-V4`.

## Task-specific controls

- Capability Knowledge Base query: NOT APPLICABLE (browser design tool, plain
  web platform features).
- Planned setup: none. Candidate-attempt start condition: first build on core
  version 3 that passes the automated check. Candidate-attempt allowance: one
  candidate. Operational-recovery allowance: Core default. Formal
  stage-correction allowance: 2 rounds. Task-owned namespaces: the allowed paths.
- Core, shared files and tuning are read-only. Report anything that feels
  wrong in play; do not edit it.
- Pre-installed Playwright only; no downloads, installs, npm packages or
  network use. Original work only. German player text, every statement about
  the rules checked against the rules document and the tuning file.
- The container has restarted twice tonight: keep runs in the foreground and
  write your result file as you go.
- Time: check `date -u`; aim to return within about 35 minutes and at the
  latest after 50 minutes.
- Do NOT commit or push.

## Success

The page runs on core version 3 with no false statement about the rules; the
automated check passes for all setups with real output shown; both dist files
are current and follow the page rules.

## Stop

Stop and report on verify-worker failure, any need outside the allowed paths,
or a protected change.
