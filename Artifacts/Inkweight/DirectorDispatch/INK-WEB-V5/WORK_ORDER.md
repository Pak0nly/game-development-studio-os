# Work Order INK-WEB-V5 — Browser prototype: first-impression fixes from the last review

Project: Inkweight (DEC-044). Director: Claude (orchestration only). Worker: one
separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python3 -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py verify-worker --root . --manifest Artifacts/Inkweight/DirectorDispatch/INK-WEB-V5/DISPATCH_MANIFEST.json --work-order Artifacts/Inkweight/DirectorDispatch/INK-WEB-V5/WORK_ORDER.md --capabilities Artifacts/Inkweight/DirectorDispatch/INK-WEB-V5/CAPABILITIES.json --receipt Artifacts/Inkweight/DirectorDispatch/INK-WEB-V5/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human authority (exact, 2026-11-19)

"Ja. Du hast bis 9 Uhr Zeit daran zu arbeiten. Gerne mit Unity3D als
Zielplattform um es auch mobile und Webtauglich zu bekommen wenn nötig.
Hauptziel bleibt Steam. Nutze die Zeit bis 9 Uhr voll aus und suche dir selbst
passende Aufgaben. Ziel ist ein spielbarer Prototyp, oder zumindest die
Vorbereitung dessen."

## Read first
## Read first

`Artifacts/Inkweight/Evidence/INK-WEB-V4/REVIEW.md` (findings I-1 to I-4 and
m-1 to m-5, each with steps and a fix proposal) and `WORKER_RESULT.md`,
`Projects/Inkweight/Docs/INK_RULES_V2.md`, and the page rules in
`Artifacts/Inkweight/DirectorDispatch/INK-WEB-V1/WORK_ORDER.md`.

## Objective

Remove the four things the last review says a first-time player will trip
over, without changing the core. This is the last change before the Human
plays in the morning: small, safe and well checked beats ambitious.

## Tasks

1. I-1: the first-run hint never swallows a stroke. It does not cover the
   sheet (a slim band above or below the sheet, or a compact line), and the
   first stroke anywhere draws normally and closes it. Check at 400 x 780,
   400 x 660 and sideways that the canvas rectangle does not change when the
   hint closes.
2. I-2: a fairer first Ring match. For the first matches with an empty
   gallery choose the placeholder bots so that a plain round blob, a block
   with a sword and a stick figure each have a real chance (for example the
   push-type heavy bot of moderate weight rather than the heaviest, and no
   small pure-blade bot against a newcomer). Measure with
   `build/ring_fairness.cjs` on the final build, at least 6 matches per
   drawing, and report the table; the aim is roughly one win in two overall
   and no drawing without a win. Add a short result line after a lost round
   that says in plain German what happened and one thing to try (for example
   pushed out: draw heavier or use the extra ink; armour broken: fill more
   area).
3. I-3: the boss panel shows what is coming (boss armour and number of
   escorts from the core) and one true tip in plain German (keeping distance
   lets the weapon work; armour does not heal in the fight). The solo intro
   gets the same tip in one short sentence. No core or tuning change; say in
   your report how hard the boss is for a hero that runs in and for one that
   keeps away, on the final build.
4. I-4: on the enemy screen the enemy's real values as a wave copy are never
   cut off: the stake note gets a fixed two-line height from the start, the
   drip warning does not push them out, and the stat rows above are labelled
   so that nobody reads the drawing's figure values as the enemy's (or show
   the copy's values in those rows for the picked stake). The canvas must
   still not change size; extend the `stable` scenario if the layout changes.
5. m-1 (a second or sticky "Schließen" in the rules panel), m-2 ("vor dem
   Element"), m-4 and m-5 if cheap.
6. Rebuild; run the full automated check with `--shots` outside the
   repository; look at fresh screenshots of every changed screen at 400 x 780
   and 400 x 660.
7. Evidence `Artifacts/Inkweight/Evidence/INK-WEB-V5/`: `WORKER_RESULT.md`
   (verify-worker line, each finding and what was done, commands and real
   output, the fairness table, what you saw, anything not done) and a few
   screenshots.

## Allowed mutations

Only explicitly listed mutations are authorised; everything else is out of
scope: `Projects/Inkweight/Source/WebPrototype/app`,
`Projects/Inkweight/Source/WebPrototype/dist`,
`Projects/Inkweight/Source/WebPrototype/build`,
`Artifacts/Inkweight/Evidence/INK-WEB-V5`.

## Task-specific controls

- Capability Knowledge Base query: NOT APPLICABLE (browser design tool, plain
  web platform features).
- Planned setup: none. Candidate-attempt start condition: first build that
  passes the automated check. Candidate-attempt allowance: one candidate.
  Operational-recovery allowance: Core default. Formal stage-correction
  allowance: 2 rounds. Task-owned namespaces: the allowed paths.
- Core, shared files and tuning are read-only.
- Every new or changed sentence about the rules is checked against the rules
  document and the tuning file; nothing false, nothing promised that the
  rules do not do.
- Pre-installed Playwright only; no downloads, installs, npm packages or
  network use. Original work only. German player text.
- Keep runs in the foreground and write your result file as you go.
- Time: check `date -u`; return within about 40 minutes and at the latest
  after 50 minutes, even if task 5 is unfinished.
- Do NOT commit or push.

## Success

The four important findings are fixed and checked on the final build; the
automated check passes for all setups with real output shown; both dist files
are current and follow the page rules.

## Stop

Stop and report on verify-worker failure, any need outside the allowed paths,
or a protected change.
