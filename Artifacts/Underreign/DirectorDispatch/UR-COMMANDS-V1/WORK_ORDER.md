# Work Order UR-COMMANDS-V1 — Rally banner and alarm for creatures (rules and game)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.
Runs after UR-SIM-SUMMON-COST-V1 and UR-UNREAL-STATS-V1 are committed; build on
that state.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-COMMANDS-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-COMMANDS-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-COMMANDS-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-COMMANDS-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (2026-11-10, exact)

- After the second own round: "Was mir auch aufgefallen ist, ist dass ich einen
  Sammelbefehl vermisse um meine Kreaturen zu befehligen. (allgemein Befehle
  fehlen.) Gegner sind einfach durchmarschiert, weil sie keine meiner Kreaturen
  kreuzten und erst als sie das Herz angriffen, rannten meine dort hin."
- Question "Welche Befehle und welches Verhalten sollen sie für die nächste
  Testfassung bekommen?" with options rally banner, alarm, pick up and drop,
  select individually. Human chose: "Sammelbanner (Empfehlung),Alarm (Empfehlung)".
  Then: "Aufnehmen und absetzen für später." (pick up and drop: later, not now).
- Also: "Es sollte mit jedem Kauf bzw. jedem beim Kauf existierenden Cinderling
  teurer werden welche zu kaufen, damit man sich das besser überlegt."
  (implemented in UR-SIM-SUMMON-COST-V1).
- Observation: "Dieses Mal sind auch ein paar Cinderlings dabei drauf gegangen,
  weil sie zu langsam waren im weglaufen." (observation only, no change asked).

## Tasks

1. **Rules (SimulationCpp)**:
   - *Rally banner*: a player command places one banner on own walkable ground
     (any layer); all creatures that can reach it go there (through stairs) and
     fight intruders they meet on the way and around it; a second command or
     "lift banner" ends it and they return to normal life. Hunger, pay and
     sleep needs behave plainly while rallied (state the rule). Optional
     proposal: a small gold cost per placement (tuning, may be 0).
   - *Alarm*: when an intruder stands on claimed ground, idle or wandering
     creatures within a proposal radius (same layer, or reachable within N
     steps) go and fight it; they return afterwards. Alarm must not pull
     creatures away from a rally banner.
   - Deterministic integer rules; new tuning values marked as proposals; tests
     for both; existing tests changed only where intended (list each); new
     golden replays (legacy replays moved); 200-seed batch with a short balance
     note against the previous rules (wave 3 unchanged, UD-53). Bots may use
     the banner if sensible; report.
2. **Game**: resync the module to the committed rules; wrapper for the new
   commands; a banner tool (key and tool-bar button, click to place, again to
   move, key to lift), the banner drawn clearly, creatures that are rallied or
   on alarm marked; tooltips; the summon button shows the current (rising)
   price from the rules; the stats block (UR-UNREAL-STATS-V1) includes banner
   and alarm counts if cheap; start panel, F1 help, `SPIELANLEITUNG.md`.
3. **Proof** (rules changed, so full rule tests): all SimulationCpp tests,
   Unreal Automation tests, game-layer parity at four ticks, a tool test for
   banner place/move/lift and alarm, one start check of the gentle bat. Every
   own Unreal run frame-capped (60 fps or lower), short, offscreen, one editor
   process at a time. Also record a new playround for the current rules if the
   old one no longer reaches the camp (open point of UR-UNREAL-SUMMON-V1), or
   state why not.
4. Studio `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`: section "Second
   own test round — 2026-11-10" with rows UD-54 (summon price rises with each
   living cinderling; quote) and UD-55 (rally banner and alarm; quote the
   question and answer), observations marked as observations. Studio
   `Projects/Underreign/Docs/OPEN_DECISIONS.md`: a new OPEN row "Pick up and
   drop creatures" (Human: "Aufnehmen und absetzen für später."); selecting
   creatures individually was not chosen (note it there too).
5. `SimulationCpp/README.md`, `Game/README.md`,
   `Evidence/UR-COMMANDS-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-COMMANDS-V1/WORKER_RESULT.md` (Studio).

## Limits

- External allowed: `SimulationCpp`, `Game`, `Evidence/UR-COMMANDS-V1`. Studio
  allowed: `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`,
  `Projects/Underreign/Docs/OPEN_DECISIONS.md`,
  `Artifacts/Underreign/Evidence/UR-COMMANDS-V1`. `Simulation` (C#) and
  everything else read-only.
- Do NOT commit or push. Compiler parallelism at most 8. Never a window in front
  of the Human. No downloads.
