# Worker result: UR-SIM-CPP-PORT-V1 (simulation ported from C# to C++)

Status: Worker result, not independently reviewed, nothing committed. Date: 2026-11-10.

Gate: `PASS worker receipt 2c72090249f7d2d4c6978da58d7cc525b982b9608d1dc0747b9910d4623fdaf4` (verify-worker, run
before any change).

## Result in one paragraph

The whole C# simulation (211 library files, the headless runner, 684 tests) is ported to standard C++20 in
`C:/GameDev/Underreign/SimulationCpp`. It builds with MSVC 14.44 through a build script (`build.bat` or
`Tools/build.py`), without Unreal, third-party code or downloads. Parity with the C# simulation is complete in
every check that was asked for: the three golden replays reach the recorded final state hashes, and the 200-seed
batch gives the same outcome, end tick, lost wave and final state hash for every seed. All 684 tests have a C++
counterpart with the same name and pass.

## Test counts

| | C# (`dotnet test`, Release, run today from a temp copy) | C++ (`Build/release/ur_tests.exe`) |
|---|---|---|
| Total | 684 | 684 |
| Passed | 684 | 684 |
| Failed | 0 | 0 |
| Skipped | 0 | 0 |
| Duration | 8 s | 3 s |

The 684 C++ test names equal the 684 C# names (`SimulationCpp/Tests/expected_tests.txt`, extracted from the C#
sources, compared with `ur_tests.exe --list`). Run log: `cpp_tests_run.txt`.

Not ported: no test. One single assertion inside one test was replaced
(`HardeningTests.Save_UnderSwedishCulture_WritesInvariantDigitsAndReadsBack`: the C# line that proves .NET itself
prints a minus sign as U+2212 under the Swedish culture has no C++ counterpart; the test instead runs under the
Swedish C locale and keeps every other statement). C# type checks in tests (`cmd is DigCommand`) are compared by
command name because the port uses no run-time type information.

## Parity table

Golden replays (`ur_headless.exe replay`, log `cpp_golden_replays.txt`):

| Replay | Recorded (C#) | C++ | Stored check hashes on the way | Equal |
|---|---|---|---|---|
| `golden_idle_seed1_lost` | Lost, tick 5870, `b54a7763601a8b4a` | Lost, tick 5870, `b54a7763601a8b4a` | all matched | yes |
| `golden_reasonable_seed4_lost` | Lost, tick 8678, `5ffa1c52ce023b23` | Lost, tick 8678, `5ffa1c52ce023b23` | all matched | yes |
| `golden_reasonable_seed1_won` | Won, tick 11521, `c8f32184fc745dc0` | Won, tick 11521, `c8f32184fc745dc0` | all matched | yes |

200-seed batch (reasonable bot, `Maps/cinder_hollow.map.txt`, `Maps/prototype.tuning.txt`, seeds 1 to 200; C#
headless runner built with `dotnet` into a temp folder):

| Compared per seed | Seeds equal |
|---|---|
| Outcome | 200 of 200 |
| End tick | 200 of 200 |
| Lost in wave | 200 of 200 |
| Final state hash | 200 of 200 |
| All 113 non-timing columns of the batch CSV | byte-identical |
| Flow CSV (gold mined and spent per minute) | byte-identical |

Both sides: 138 won, 62 lost (16 in wave 2, 46 in wave 3). Per-seed table: `parity_200_seeds.csv`; raw files:
`cs_batch200.csv`, `cpp_batch200.csv`, `*_flow.csv`. The only differing CSV columns are the two time measurements
(`mean_tick_us`, `p99_tick_us`). The batch was repeated after the last library change of the test port.

The parity was reached on the first complete build; no rule divergence had to be debugged.

## Bench timings (same PC, another Worker was building Unreal at the same time, so treat as rough)

| Measure | C# (.NET 8, Release) | C++ (MSVC /O2) |
|---|---|---|
| `bench --layers 5 --size 128 --ticks 1000`: mean per tick | 0.307 ms | 0.113 ms |
| median per tick | 0.169 ms | 0.055 ms |
| 99th percentile | 2.218 ms | 0.874 ms |
| maximum | 13.8 ms | 10.7 ms |
| map build time | 67 ms | 17 ms |
| 200-seed batch, process wall time (best of 3) | 12.4 s | 10.1 s |
| mean tick time inside the batch (Cinder Hollow) | 3.4 us | 3.9 us |
| Golden replay seed 1, process wall time | 0.34 s | 0.06 s |

Full bench tables: `cs_bench.txt`, `cpp_bench.txt`.

## Files

- `SimulationCpp/Public/UnderreignSim/`: 219 headers (one per C# file, plus `Base/`, `Fwd.h`, `UnderreignSim.h`, `SimApi.h`).
- `SimulationCpp/Private/`: 124 sources. Library total about 24 700 lines.
- `SimulationCpp/Headless/`: 22 files (about 1 850 lines), `ur_headless.exe` with `run`, `batch`, `replay`, `bench`.
- `SimulationCpp/Tests/`: `UrTest.h` (the runner), `TestMain.cpp`, 54 ported test and helper sources, 9 helper headers, `expected_tests.txt` (about 15 200 lines).
- `SimulationCpp/Tools/build.py`, `SimulationCpp/build.bat`, `SimulationCpp/README.md`, `SimulationCpp/PORTING.md`.
- `Evidence/UR-SIM-CPP-PORT-V1/`: this file and the logs named above.
- `SimulationCpp/Build/` is build output (ignored by the repository's `.gitignore`).
- The C# `Simulation` folder is unchanged (`git status` shows only `SimulationCpp/` and `Evidence/UR-SIM-CPP-PORT-V1/` as new). The C# reference builds ran in a temp copy.

## How the work was done

The lead Worker wrote the base layer (object model, collections, text, Core, Events, `SimGame`), the porting rules,
the build script and the test runner; eight helper subagents ported the library folders and the headless runner in
parallel, seven more ported the tests. All compiler calls went through a shared eight-slot limit.

## Open issues

1. Exceptions: the library throws C++ exceptions inside where the C# throws (bad map, tuning, save text). They stay
   inside if the engine uses `SimApi.h`, but the Unreal module must be compiled with exceptions enabled. A version
   without any exceptions would be a redesign of the parsers' error handling, not a port.
2. Speed on the small prototype map is only on the level of .NET (3.9 us against 3.4 us per tick inside the
   batch); the large bench map is about 2.7 times faster. The port keeps C# semantics everywhere (checked list and
   array indices, null checks, reference counts); nothing was tuned.
3. Small known differences from C#, none touching rules or hashes: a null string is the empty string
   (`SaveReader::Load` cannot tell them apart); an unnamed enum value prints as `?` in general text (command
   arguments print the number, fixed during the test port in `PlaceTrapPartCommand` and `BuildRoomCommand`);
   `HeatField::CopyLayer` throws a different exception type for a too short destination; the headless runner turns
   crashes into `error: ...` with exit code 2 and measures "allocated bytes" differently.
4. The number formatting helper of the headless reports (`NetText::Fixed`) follows the .NET rule as the helper
   understood it; the `.md` summaries of the 200-seed batch were equal to the C# ones except for paths and
   timings, but not every rounding case was checked against .NET.
5. The Gravity modules (water, gas, collapse; switched off in the game) are covered only by their 82 tests, which
   all pass; there is no hash comparison for them because the game does not run them.
6. Other maps (campaign, variants), the other bots (`trapper`, `greedy`, `reasonable-varied`) and `run --ascii`
   output were exercised by the ported tests only, not compared file by file with the C# runner.
7. Not done on purpose: no Unreal wrapper (`.Build.cs`, UObject layer), no commit.
