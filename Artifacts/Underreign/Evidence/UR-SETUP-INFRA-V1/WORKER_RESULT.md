# UR-SETUP-INFRA-V1 Worker Result

Bootstrap: no Underreign dispatch gate existed, so this order ran without a gate receipt (same bootstrap as HL-DISPATCH-GATE-V1 and MA-PROJECT-SETUP-V1).

## Done
- `Tools/UnderreignDispatchGate/` created as an independent copy of `Tools/ClaudeDispatchGate` (smaller, already Claude-provider-specific; the Hearthlands gate is larger and carries Hearthlands-specific logic). Renamed validator, schema, tests and README; scoped to Projects/Underreign, Artifacts/Underreign/{DirectorDispatch,Evidence}, the Underreign state files. Tests: 40 run, OK. Source tools untouched.
- `C:\GameDev\Underreign` created: git init (main), git lfs install --local, .gitignore, .gitattributes (LFS), README.md. No remote, no commit, no Unity project.
- Docs: UD-24..UD-27 added; OD-01/03/08 decided, OD-09 remark noted; GAME_CONCEPT sections 5 and 8; project README; Docs/README.md pointer.
- No commits made anywhere.

## Correction 01
- OPEN_DECISIONS.md: stale open-tense sentences in OD-01, OD-03, OD-08 rewritten in past tense.
- DISCOVERY_DECISIONS.md UD-12: added "prototype part superseded by UD-24 (heat rises)".
- Gate schema: forbidden_mutation_roots now also lists Projects/Hearthlands, Projects/MobileArc, Artifacts/Hearthlands, Artifacts/MobileArc, Tools/HearthlandsDispatchGate, Tools/ClaudeDispatchGate (protection only). The validator only supports repository-relative roots, so absolute C:/GameDev/Hearthlands* entries are not possible; stated as a policy line in the gate README instead.
- Added one test (other project roots forbidden). Test count and result: see Director report.

## Correction 02
- DISCOVERY_DECISIONS.md: round 3 section, UD-28..UD-31.
- GAME_CONCEPT.md section 2: Ashen Pact glass horns, Gearbound Kin kobolds, Drowned Court deep-sea look, Dwarves (role open) note.
- OPEN_DECISIONS.md: OD-09 DECIDED for the three peoples; OD-10 (role of the dwarves) OPEN.
- README.md: risk and next step updated.
- References/ArtDirection/IMAGE_PROMPTS.md copied unchanged from the side-session notes file.
