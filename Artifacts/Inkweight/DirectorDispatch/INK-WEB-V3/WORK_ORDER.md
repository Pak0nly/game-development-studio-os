# Work Order INK-WEB-V3 — Browser prototype on core version 2, second review fixes

Project: Inkweight (DEC-044). Director: Claude (orchestration only). Worker: one
separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python3 -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py verify-worker --root . --manifest Artifacts/Inkweight/DirectorDispatch/INK-WEB-V3/DISPATCH_MANIFEST.json --work-order Artifacts/Inkweight/DirectorDispatch/INK-WEB-V3/WORK_ORDER.md --capabilities Artifacts/Inkweight/DirectorDispatch/INK-WEB-V3/CAPABILITIES.json --receipt Artifacts/Inkweight/DirectorDispatch/INK-WEB-V3/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human authority (exact, 2026-11-19)

"Ja. Du hast bis 9 Uhr Zeit daran zu arbeiten. Gerne mit Unity3D als
Zielplattform um es auch mobile und Webtauglich zu bekommen wenn nötig.
Hauptziel bleibt Steam. Nutze die Zeit bis 9 Uhr voll aus und suche dir selbst
passende Aufgaben. Ziel ist ein spielbarer Prototyp, oder zumindest die
Vorbereitung dessen."

## Read first

`Projects/Inkweight/Docs/INK_RULES_V2.md`,
`Projects/Inkweight/Source/Shared/CHANGES_V2.md` (the app checklist),
`RULES_AS_BUILT.md`, the core `README.md`,
`Artifacts/Inkweight/Evidence/INK-WEB-V2/WORKER_RESULT.md` and `REVIEW.md`
(findings N-1 to N-8), and the page rules in
`Artifacts/Inkweight/DirectorDispatch/INK-WEB-V1/WORK_ORDER.md`, which still apply.

## Objective

Move the browser prototype to core version 2 (already in `core/` and
`Source/Shared`), so the Human judges the corrected rules: a blade on a body
now raises sharpness, diagonal lines are blades, filled areas are armour,
hollow shells push harder, solo stakes are dangerous. Fix the second review's
findings. The app at HEAD still expects version 1 and may not build or run
correctly until you adapt it.

## Tasks

1. Adopt core version 2 following the app checklist of `CHANGES_V2.md`: stat
   panel with the real ranges (armour, sharpness, push weight, top speed),
   blade marks from the new 2 x 2 rule (`isSharpCell`), core cells, pocket
   cells shown in a subtle way, the new `ram` event with its own feedback,
   `ringCheckFigure` before a round, new solo stake effects shown honestly
   (more enemies, harder hits, faster), drops and purse, bot styles (mix the
   two styles among Ring bots).
2. The drawing screen must make the four halves of the rule sentence visible
   while drawing: each stat row has a short, true explanation for version 2
   (German, plain), including that a blade also bites a share of the victim's
   armour and that a closed shell pushes harder. Remove the version 1
   sharpness wording.
3. Second review: N-1 ("Ende" on the Ring drawing screen and the solo enemy
   screen asks whether to end the game or the run and says so; "Verwerfen?"
   stays for free draw, hero, weapon and redraw), N-3 to N-8 (N-8: a stroke
   ends on a width or orientation change only).
4. Put the two build scripts safely into Git: add
   `Projects/Inkweight/Source/WebPrototype/.gitignore` that re-includes the
   `build` folder (the root `.gitignore` ignores `[Bb]uild/`; the files are
   force-added at present).
5. A small "Regeln" panel reachable from the start screen and the drawing
   screen: the rule sentence, the four stats in one line each, the element
   circle, and one honest line that these are test numbers (German).
6. Rebuild both dist files; run the full automated check (phone, sideways,
   desktop, artifact frame, two humans, single checks); extend it so a drawn
   block with a blade must show a higher sharpness than the block alone and a
   diagonal blade must show blade marks. Play one Ring match and one solo run
   at normal speed yourself through Playwright with intent, and say how the
   new rules feel: are fights decided too fast or too slowly, is solo fair at
   x1 for a first-time player?
7. Evidence `Artifacts/Inkweight/Evidence/INK-WEB-V3/`: `WORKER_RESULT.md`
   (verify-worker line, what changed, commands and real output, what you saw,
   how it feels, anything not done) and about 10 screenshots.

## Allowed mutations

Only explicitly listed mutations are authorised; everything else is out of
scope: `Projects/Inkweight/Source/WebPrototype/app`,
`Projects/Inkweight/Source/WebPrototype/dist`,
`Projects/Inkweight/Source/WebPrototype/build`,
`Projects/Inkweight/Source/WebPrototype/.gitignore`,
`Artifacts/Inkweight/Evidence/INK-WEB-V3`.

## Task-specific controls

- Capability Knowledge Base query: NOT APPLICABLE (browser design tool, plain
  web platform features).
- Planned setup: none. Candidate-attempt start condition: first build that
  passes the automated check on core version 2. Candidate-attempt allowance:
  one candidate. Operational-recovery allowance: Core default. Formal
  stage-correction allowance: 2 rounds. Task-owned namespaces: the allowed paths.
- Core, shared files and tuning are read-only. If the core has a bug or a
  number feels wrong in play, report it exactly; do not edit it. A Reviewer is
  re-checking the core now; a small core correction may follow, after which
  you only rebuild.
- Pre-installed Playwright only; no downloads, installs, npm packages or
  network use. Original work only. German player text.
- The container has restarted twice tonight: keep long runs in the foreground,
  and write your result file as you go.
- Time: check `date -u`; aim to return within about 70 minutes and at the
  latest after 90 minutes, with an honest list of what is unfinished.
- Do NOT commit or push.

## Success

The app runs on core version 2 with truthful stat explanations; the second
review's findings are fixed; the automated check passes for all setups with
real output shown; both dist files are current and follow the page rules.

## Stop

Stop and report on verify-worker failure, any need outside the allowed paths,
or a protected change.
