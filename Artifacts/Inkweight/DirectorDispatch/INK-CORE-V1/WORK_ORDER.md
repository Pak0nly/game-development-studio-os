# Work Order INK-CORE-V1 — Engine-free ink core, shared tuning, test vectors and balance simulation

Project: Inkweight (DEC-044). Director: Claude (orchestration only). Worker: one
separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python3 -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py verify-worker --root . --manifest Artifacts/Inkweight/DirectorDispatch/INK-CORE-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Inkweight/DirectorDispatch/INK-CORE-V1/WORK_ORDER.md --capabilities Artifacts/Inkweight/DirectorDispatch/INK-CORE-V1/CAPABILITIES.json --receipt Artifacts/Inkweight/DirectorDispatch/INK-CORE-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human authority (exact, 2026-11-19)

"Ja. Du hast bis 9 Uhr Zeit daran zu arbeiten. Gerne mit Unity3D als
Zielplattform um es auch mobile und Webtauglich zu bekommen wenn nötig.
Hauptziel bleibt Steam. Nutze die Zeit bis 9 Uhr voll aus und suche dir selbst
passende Aufgaben. Ziel ist ein spielbarer Prototyp, oder zumindest die
Vorbereitung dessen."

## Read first

`Projects/Inkweight/Docs/GAME_CONCEPT.md`, `INK_RULES_V1.md`,
`DISCOVERY_DECISIONS.md`, `OPEN_DECISIONS.md`, `README.md`.

## Objective

Build the engine-free game core of Inkweight in plain JavaScript (ES modules,
no dependencies, runs unchanged in Node 22 and in a browser), together with the
shared tuning file, golden test vectors and a headless balance simulation. Two
later orders depend on it: a browser prototype UI and a C# port for Unity that
must reproduce your vectors. Design the core so it is easy to port line by line.

## Tasks

1. **Tuning file** `Projects/Inkweight/Source/Shared/ink_tuning.json`: every
   rule number of `INK_RULES_V1.md` and every further number the core needs
   (physics, ring, bots, solo arena). The core reads all numbers from it.
2. **Core** under `Projects/Inkweight/Source/WebPrototype/core/`:
   - drawing grid, body extraction (largest 4-connected group, drips removed),
     stats (N, C, S, armour, sharpness, speed, size, element), validity;
   - collision shape derived from the body cells and a small deterministic
     top-down rigid-body step (position, rotation, weight-based pushing, the
     figure turns its front toward the steering direction, dash, sharp-cell
     contact damage with the per-pair cooldown, element multipliers);
   - mode B "Ring": 2 to 4 figures, shrinking ring, elimination by ring-out or
     armour 0, rounds, first to 3, catch-up ink;
   - mode A "Solo Arena": hero plus thrown weapon, enemy design per wave with
     copies paid from the wave budget, stake x1 / x1.5 / x2, ink drops, upgrades
     between waves, 5 waves and a boss assembled from the run's enemy drawings;
   - simple bots for both modes (steer, avoid the edge, dash) and a fixed
     timestep with an explicit seeded integer random generator.
   - **Determinism:** fixed timestep; all randomness from your own seeded
     generator; use only `+ - * /` and `Math.sqrt` on doubles in the simulation
     (represent rotation as a unit vector, no `sin`/`cos`/`atan2`) so that the
     C# port can match your traces bit for bit. If you must use another math
     function, say where and why, and the traces then compare with a tolerance.
   - Input is data (per-tick steering vector and dash flag per seat), so UI,
     bots and replays all drive the same step function.
3. **Golden vectors** under `Projects/Inkweight/Source/Shared/golden/`:
   - `stat_vectors.json`: at least 30 drawings (32 text rows of 32 characters,
     `.` empty, `1`-`4` colours) with every derived value, including edge cases
     (too small, ties, drips, element thresholds, canvas border);
   - `sim_traces.json`: at least 6 deterministic matches (Ring 1v1 and 4
     figures, solo waves) with seed, drawings, inputs or bot seats, checkpoint
     states every N ticks and the final outcome. Keep the files reasonably small.
4. **Tests** with the built-in Node test runner (`node --test`), no npm
   installs: unit tests for the rules, property-style checks, and a test that
   regenerating the golden files gives byte-identical output.
5. **Balance simulation** `Projects/Inkweight/Source/WebPrototype/sim/`:
   a field of at least 10 clearly different archetype drawings (for example
   filled disc, block, ring, thin cross, star with a core, lance at the front
   of a core, long line, comb, front shield, small fast dot), some in different
   elements. Play bot-driven Ring matches, 1v1 round robin and 4-figure
   free-for-all, over many seeds. Report win rates per archetype and per stat
   profile. Then tune the numbers in the tuning file toward the target of
   `INK_RULES_V1.md` section 8 (no archetype above 60 % average win rate across
   the field, at least three clearly different shapes that can win). Also run a
   solo smoke simulation (bot hero against several enemy designs and stakes) and
   report how hard the waves are. Say plainly what bots can and cannot tell us.
6. **As-built record** `Projects/Inkweight/Source/Shared/RULES_AS_BUILT.md`:
   the exact algorithms (collision shape, contact, turning, bots), every number
   that differs from `INK_RULES_V1.md` with the reason, and open design
   questions for the Human (each with a recommendation, plain words).
7. **Core API note** `Projects/Inkweight/Source/WebPrototype/core/README.md`
   for the UI and the Unity port: modules, functions, state shape, how to drive
   a match and how to read the golden files.
8. **Evidence** `Artifacts/Inkweight/Evidence/INK-CORE-V1/`: `WORKER_RESULT.md`
   (the verify-worker line, what was built, test command and its real output,
   balance summary, known weaknesses, anything not done) plus the balance
   report as Markdown and JSON.

## Allowed mutations

Only explicitly listed mutations are authorised; everything else is out of
scope: `Projects/Inkweight/Source`, `Artifacts/Inkweight/Evidence/INK-CORE-V1`.

## Task-specific controls

- Capability Knowledge Base query: NOT APPLICABLE (no tool, package or asset
  choice; plain language features only, Node 22 is already present).
- Planned setup: none. Candidate-attempt start condition: first complete core
  with passing tests. Candidate-attempt allowance: one candidate.
  Operational-recovery allowance: Core default. Formal stage-correction
  allowance: 2 rounds. Task-owned namespaces: the two allowed paths; no cleanup
  outside them.
- No downloads, no installs, no network use, no npm packages.
- Original work only: no code, names or content copied from existing games.
- Everything you design beyond the rules document is a proposal: mark it so.
- You may use subagents in parallel for independent files (never two writers on
  one file).
- Time: this is the first of three orders in one night. Check `date -u` now and
  then; aim to return within about 75 minutes and return at the latest 100
  minutes after your start, with an honest list of what is unfinished.
- Do NOT commit or push. Do not edit anything under `Projects/Inkweight/Docs`.

## Success

Tests pass with real output shown; golden files regenerate byte-identically;
the balance report exists with the tuned numbers and an honest verdict on the
optimal-shape risk; the as-built record and the API note are complete enough
for a C# port without reading your mind.

## Stop

Stop and report on verify-worker failure, any need outside the allowed paths, a
protected change, or a rules contradiction you cannot resolve as a marked
proposal.
