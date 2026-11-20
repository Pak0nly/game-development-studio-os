# Work Order INK-UNITY-V2 — Unity project: C# core port to core version 2

Project: Inkweight (DEC-044). Director: Claude (orchestration only). Worker: one
separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python3 -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py verify-worker --root . --manifest Artifacts/Inkweight/DirectorDispatch/INK-UNITY-V2/DISPATCH_MANIFEST.json --work-order Artifacts/Inkweight/DirectorDispatch/INK-UNITY-V2/WORK_ORDER.md --capabilities Artifacts/Inkweight/DirectorDispatch/INK-UNITY-V2/CAPABILITIES.json --receipt Artifacts/Inkweight/DirectorDispatch/INK-UNITY-V2/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human authority (exact, 2026-11-19)

"Ja. Du hast bis 9 Uhr Zeit daran zu arbeiten. Gerne mit Unity3D als
Zielplattform um es auch mobile und Webtauglich zu bekommen wenn nötig.
Hauptziel bleibt Steam. Nutze die Zeit bis 9 Uhr voll aus und suche dir selbst
passende Aufgaben. Ziel ist ein spielbarer Prototyp, oder zumindest die
Vorbereitung dessen."

## Read first

`Projects/Inkweight/Source/Shared/CHANGES_V2.md` (the C# port checklist),
`RULES_AS_BUILT.md`, the JavaScript core and its `README.md`, the golden files,
`Projects/Inkweight/Source/Unity/README.md`,
`Artifacts/Inkweight/Evidence/INK-UNITY-V1/WORKER_RESULT.md` and `REVIEW.md`.

## Objective

Bring the C# core port and the Unity presentation layer to core version 2,
proven bit for bit against the regenerated golden files, so that the Unity
project the Human opens plays the same rules as the browser prototype.

## Tasks

1. Port every change of `CHANGES_V2.md` into
   `Projects/Inkweight/Source/Unity/Inkweight/Assets/Inkweight/Core` (new blade
   rule, sharpness and armour formulas, pocket cells and push weight, sub-steps
   with the turn inside, deepest-contact normal and extra separation passes,
   dash rams, blade armour cut, Ring figure check, solo stake effects, enemy
   armour and drops, bot styles, hash layout 2, new state fields, new thrown
   errors) and into the replay driver (bot styles, tuning overrides, upgrade
   strings, per-item checkpoint interval). Same loop orders, `double` only, no
   fused multiply-add.
2. Regenerate the embedded tuning and self-check data
   (`dotnet run --project CoreTests -- --generate`) and make
   `dotnet run --project CoreTests` pass: all stat vectors exact and all traces
   bit for bit, both Debug and Release. The .NET 8 SDK is installed in this
   container; install nothing else.
3. Unity presentation layer: follow the new core API and state (stat panel
   with the real ranges and the four German one-line explanations of rules
   version 2, blade marks from the new rule, ram event, figure check before a
   round, stake effects shown, bot styles mixed). Add two small things the
   first version lacked: the 30 second drawing clock in the Ring, and asking
   once before a drawing is discarded. Keep it conservative: only engine
   members already used and reviewed, unless you name each new one.
4. Rerun `./check_runtime_against_stubs.sh` (four input variants) and keep the
   stubs honest. Fix the first review's leftover R1 (engine API list names the
   six-argument `Sprite.Create` and `SpriteMeshType.FullRect`).
5. Update `Projects/Inkweight/Source/Unity/README.md` (what the Human should
   see on Play with rules version 2, the self-check line in the menu, steps
   after any later re-tuning).
6. Evidence `Artifacts/Inkweight/Evidence/INK-UNITY-V2/`: `WORKER_RESULT.md`
   (verify-worker line, what changed, test commands and real output, the table
   "verified here / not verifiable here", every engine member newly used,
   anything not done) and the test output files.

## Allowed mutations

Only explicitly listed mutations are authorised; everything else is out of
scope: `Projects/Inkweight/Source/Unity`,
`Artifacts/Inkweight/Evidence/INK-UNITY-V2`.

## Task-specific controls

- Capability Knowledge Base query: unchanged from INK-UNITY-V1 (Unity built-in
  features only, engine-free core; no Asset Store product, no new dependency;
  Inkweight has no capability index yet, OD-09).
- Planned setup: none (.NET SDK present). Candidate-attempt start condition:
  core tests run against the new golden files. Candidate-attempt allowance:
  one candidate. Operational-recovery allowance: Core default. Formal
  stage-correction allowance: 2 rounds. Task-owned namespaces: the allowed paths.
- The JavaScript core, shared files and golden files are read-only. If the
  change list is wrong or incomplete compared with the JavaScript, follow the
  JavaScript and report the gap exactly. A Reviewer is re-checking the core
  now; a small core correction with regenerated golden files may follow, so
  keep the port driven by the tuning and golden files.
- No Unity Editor, no downloads or installs.
- The container has restarted twice tonight: keep long runs in the foreground,
  and write your result file as you go. Delete `bin`/`obj` at the end.
- Time: check `date -u`; aim to return within about 70 minutes and at the
  latest after 90 minutes, with an honest list of what is unfinished. The core
  port with passing golden tests comes first.
- Do NOT commit or push.

## Success

`dotnet run --project CoreTests` passes bit for bit against the version 2
golden files with real output shown; the Unity layer compiles against the
stubs in all four variants; every unverified part is named.

## Stop

Stop and report on verify-worker failure, any need outside the allowed paths,
or a protected change.
