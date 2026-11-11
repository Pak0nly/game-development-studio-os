# Worker result — UR-SIM-ROUND7-V1

Status: done, not committed (Work Order: no commit, no push); awaiting independent review.
Work Order: `Artifacts/Underreign/DirectorDispatch/UR-SIM-ROUND7-V1/WORK_ORDER.md`; `verify-worker` printed
`PASS worker receipt afa0a61c7a4fa691cd5f1798802ce21c9c882f017f1af9f2a5059a7fd7b58297` before any change.
External repository `C:/GameDev/Underreign`, base `d8a890a` (rules 22); `Game` not touched; no Unreal.
Full evidence: `C:/GameDev/Underreign/Evidence/UR-SIM-ROUND7-V1/WORKER_RESULT.md` and its `raw/` folder.

## Changed paths

- External `SimulationCpp`: rules (`Private/Jobs/WorkerSystem.cpp`, `JobBoard.cpp`, `TrapServiceJobHandler.cpp`,
  `Worker.cpp`, `Private/Intruders/IntruderSystem.cpp`, `Private/Combat/CombatSystem.cpp`,
  `Private/Creatures/CreatureBrain.cpp`, `CreatureSystem.cpp`, `Private/Data/TuningParser.cpp` and the matching headers,
  `SaveWriter.h` rules version 23), tunings (`Data/Maps/prototype.tuning.txt`, four variant tunings,
  `Data/Replays/golden.tuning.txt`), golden replays (`Data/Replays`, old ones in `Data/ReplaysLegacy/rules22`), tests
  (`Tests/Round7Tests.cpp` new; `Rules15Tests`, `StyleBotTests`, `LivenessTests`, `HeadlessTests`,
  `OpeningVariationTests` changed), `README.md`, `Data/ReplaysLegacy/README.md`.
- External `Evidence/UR-SIM-ROUND7-V1` (result and raw batch summaries).
- Studio `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`, `Projects/Underreign/Docs/OPEN_DECISIONS.md`, this file.

## Rule changes (rules 23; numbers are proposals)

| Decision | Change |
|---|---|
| N2-A21 | Special crossbow flight removed (rules 15-17): flee only within the normal radius 3; jobs and trap repairs within crossbow reach go ahead; hiding spots need not be out of crossbow reach. |
| N2-A2 C | New key `worker.FleeDelayTicks`, 4 in the prototype tuning: the flight starts after a threat has been near for 0.4 s in a row. Cinderling deaths per game 0.02 -> 0.11 (Cinder Hollow), 0.20 -> 0.48 (Crownkiln), 0.08 -> 0.38 (Ashthread Drift); 5 ticks would jump to 4-6. |
| N2-A17 C | Prototype tuning: carry 75, gather radius 2, haul priority 5 (code defaults unchanged). |
| N2-A15 A | Heat inside a Flame Vent's column is halved by a Pavisier's shield; other heat stays full. |
| N2-A14 A | The Ember-witch needs the Crossbowman's clear straight line. |

## Verification

`build.bat` (MSVC release) clean; 897 of 897 tests pass (was 891: 6 new); all 8 golden replays and `ur_headless replay`
match; two 200-seed batches deterministic (200 of 200 equal final hashes).

## Balance (200 seeds, reasonable bot, rules 22 -> 23)

Cinder Hollow 40 % -> 46 %, New Intruders 44 % -> 47 %, Crownkiln 66 % -> 67 %, Bellows Gallery 37 % -> 32 %, Inkdrip
Shelf 56 % -> 58 %, **Ashthread Drift 45 % -> 23 %**. The Ashthread Drift drop comes from haul priority 5 in the
batches: one wave-1 Scout now escapes in every game and reports the traps.

## Decision rows

UD-56 to UD-74 (N2-A1 to N2-A22; N2-A3, A8, A19 as remark rows without an ID), UD-75 hidden traps, UD-76 lockable
doors, UD-77 combat roles, banner stance, larger armies, UD-78 order of work; OD-19 to OD-22 "decided in principle,
rules pending".

## Open points

Ashthread Drift balance under batches; the Unreal copy of the rules (`Game/.../UnderreignSim/Lib`) must be re-synced to
rules 23 and its "gold batches" menu entry is now redundant; the trapper bot lost its trap lead under batches (style
tests pin single trips); the flee-delay cliff between 4 and 5 ticks; plain answers owed for the notes on N2-A6 and
N2-A8; no POSIX or sanitizer build was run.
