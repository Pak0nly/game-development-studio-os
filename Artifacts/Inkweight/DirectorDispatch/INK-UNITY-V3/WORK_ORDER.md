# Work Order INK-UNITY-V3 — Unity project: C# core port to core version 3, truthful texts

Project: Inkweight (DEC-044). Director: Claude (orchestration only). Worker: one
separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python3 -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py verify-worker --root . --manifest Artifacts/Inkweight/DirectorDispatch/INK-UNITY-V3/DISPATCH_MANIFEST.json --work-order Artifacts/Inkweight/DirectorDispatch/INK-UNITY-V3/WORK_ORDER.md --capabilities Artifacts/Inkweight/DirectorDispatch/INK-UNITY-V3/CAPABILITIES.json --receipt Artifacts/Inkweight/DirectorDispatch/INK-UNITY-V3/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human authority (exact, 2026-11-19)

"Ja. Du hast bis 9 Uhr Zeit daran zu arbeiten. Gerne mit Unity3D als
Zielplattform um es auch mobile und Webtauglich zu bekommen wenn nötig.
Hauptziel bleibt Steam. Nutze die Zeit bis 9 Uhr voll aus und suche dir selbst
passende Aufgaben. Ziel ist ein spielbarer Prototyp, oder zumindest die
Vorbereitung dessen."

## Read first

`Projects/Inkweight/Source/Shared/CHANGES_V3.md` (the C# checklist),
`Projects/Inkweight/Docs/INK_RULES_V2.md` (rules as built, now version 3), the
JavaScript core, the golden files,
`Artifacts/Inkweight/Evidence/INK-UNITY-V2/WORKER_RESULT.md` and `REVIEW.md`
(eight minor findings), and `Artifacts/Inkweight/Evidence/INK-WEB-V3/REVIEW.md`
(findings F-1, F-2, m-3, m-4, m-6: false or loose rule statements found in the
browser prototype; the same mistakes may exist in the Unity texts).

## Objective

Bring the C# core port to core version 3, proven bit for bit against the
regenerated golden files, fix the minor findings of the last review, and make
sure every rule statement the Unity prototype shows is true.

## Tasks

1. Port every change of `CHANGES_V3.md` (separation passes from the tuning,
   crowd relaxation for more than two bodies with dead bodies counted, body
   field `bluntBonus` in blunt damage, solo enemy speed and crush, boss crush
   factor, removal of the unused `TurnCos`/`TurnSin`, tuning version 3) with
   the same loop orders, `double` only.
2. Regenerate the embedded data (`dotnet run --project CoreTests -- --generate`)
   and make `dotnet run --project CoreTests` pass bit for bit in Debug and
   Release. Check the traces in the order the change list recommends. Add own
   tests for the three branches the last review found unreached (throw target
   skipping an enemy at 0 armour, upper limit of the wave armour scale, the
   old normal fallback) where the golden files still do not reach them.
3. The eight minor findings of the INK-UNITY-V2 review (clock stops while a
   question is open; time step capped after focus loss; "Menü" while a
   question is open; README wording for the rushing bot; stale refusal
   message; clock on its own line; leftover fight note at round start).
4. Truthfulness: check every German sentence and number the Unity prototype
   shows about the rules against `INK_RULES_V2.md` and the tuning file, in
   particular the element rule (30 % coloured ink in total, then the most
   common colour, a tie is neutral), armour including counted pocket cells, a
   cut doing at least the blunt damage, what a solo stake changes in version 3
   (more or tougher enemies, heavy copies hit harder, boss and escorts do not
   crush), singular grammar. List what you corrected.
5. Rerun `./check_runtime_against_stubs.sh` (four variants); update
   `README.md` (what to expect on Play with rules version 3).
6. Evidence `Artifacts/Inkweight/Evidence/INK-UNITY-V3/`: `WORKER_RESULT.md`
   (verify-worker line, what changed, test commands and real output, the table
   "verified here / not verifiable here", every engine member newly used, the
   list of corrected statements, anything not done) and the output files.

## Allowed mutations

Only explicitly listed mutations are authorised; everything else is out of
scope: `Projects/Inkweight/Source/Unity`,
`Artifacts/Inkweight/Evidence/INK-UNITY-V3`.

## Task-specific controls

- Capability Knowledge Base query: unchanged from INK-UNITY-V1 (Unity built-in
  features only, engine-free core; no Asset Store product, no new dependency;
  Inkweight has no capability index yet, OD-09).
- Planned setup: none (.NET SDK present). Candidate-attempt start condition:
  core tests run against the new golden files. Candidate-attempt allowance:
  one candidate. Operational-recovery allowance: Core default. Formal
  stage-correction allowance: 2 rounds. Task-owned namespaces: the allowed paths.
- The JavaScript core, shared files and golden files are read-only. Where the
  change list and the JavaScript disagree, follow the JavaScript and report it.
- No Unity Editor, no downloads or installs. Only engine members already used
  and reviewed, unless you name each new one.
- The container has restarted twice tonight: keep runs in the foreground and
  write your result file as you go. Delete `bin`/`obj` at the end.
- Time: check `date -u`; aim to return within about 40 minutes and at the
  latest after 60 minutes. The core port with passing golden tests comes first.
- Do NOT commit or push.

## Success

`dotnet run --project CoreTests` passes bit for bit against the version 3
golden files with real output shown; the Unity layer compiles against the
stubs in all four variants; no rule statement shown to the player is false;
every unverified part is named.

## Stop

Stop and report on verify-worker failure, any need outside the allowed paths,
or a protected change.
