# Work Order UR-SIM-TRAP-REWORK-V1 — Traps as a defence boost: self-triggering, two special triggers, turret, control effects

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.
Base: rules 24 (external HEAD ab94a8e). Other orders may edit `Game`; never touch it.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-SIM-TRAP-REWORK-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-SIM-TRAP-REWORK-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-SIM-TRAP-REWORK-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-SIM-TRAP-REWORK-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (2026-11-11, exact)

- Triggers: "Fallen lösen standardmäßig selbst aus, ja. Spezialauslöser: Gewichtsplatte für gezielte Angriffe auf große, meist tankige Gegner ist gut. Zahlenauslöser ebenfalls. Hebel wäre nur ein anderweitiges Anklicken einer Falle um diese auszulösen, also unnötig. Kette: Was soll es bewirken, wenn irgendwo anders im Dungeon etwas passiert außer dadurch Kosten zu verursachen? Zu unkontrolliert und abstrakt."
- "Meine Favoriten "Falle" in DK2 war immer die simple Kanone. Davor eine große Höhle, evtl. mit Wasser oder Lava dazwischen, chokepoint Brücke und Beschuss ahoi."
- "Für mich gilt weiterhin: Fokus auf unterschiedliche Kreaturen anlocken für unterschiedliche Taktikrn, geschickt einsetzen um gegnerische Taktiken zu vereiteln und Herzen zu zerstören. Fallen dienen als Verteidigungsboost um eben mit Taktik dagegen anzugehen anstatt brute force prügeleien. Auch wenn nichts gegen gelegentliche, einfache Prügeleien sprechen sollte."

Originality: genre mechanics are fine (a turret is a genre staple), but no
names, look or numbers from Dungeon Keeper or any other game.

## Tasks

1. **Self-triggering effects**: every effect part fires on its own when an
   intruder enters its area (per part: its own cell or its range), with its
   existing cooldown/re-arm. Plain triggers (Pressure Plate, Tripwire) and the
   chain/wiring system are removed (chains: "zu unkontrolliert und abstrakt");
   keep save/load compatibility only where cheap, otherwise bump the save
   version and say so.
2. **Two special triggers** that can be attached to one adjacent effect (or a
   small group of effects next to each other — no remote wiring):
   - *Weight plate*: fires only for heavy intruders (Brute, Pavisier, and any
     intruder with a heavy flag; define the flag in data);
   - *Count trigger*: fires on the Nth intruder to pass (N settable 2–6 by the
     player, resets after a quiet time).
   An effect with a special trigger does not self-trigger.
3. **Turret** (new effect part, Forge): a stationary ranged shooter on claimed
   floor, fires at intruders in range with a clear straight line (same line
   rule as the Crossbowman), modest damage, limited ammunition re-filled by
   cinderlings; hidden until it first fires (rules 24). Designed for
   chokepoints such as a bridge over lava or water. If the map format has no
   bridge, add a simple buildable bridge tile over lava (claimed-ground rule,
   cost, removal) — report what you chose.
4. **Traps as a defence boost**: shift the existing effects toward control so
   creatures win the fight: Flame Vent adds panic (intruders flee briefly),
   Chain Snare holds, Drop Hatch drops to the layer below where there is one
   (else stuns), Cinder Charge knocks back and stuns; reduce raw damage so that
   in the bot batches the share of intruder damage from traps falls clearly
   below the creatures' share. State each change; values are proposals.
5. Bots: update to the new parts (place self-triggering effects at
   chokepoints, a turret where a long straight approach exists, special
   triggers where they fit). Deterministic, tests for every rule, existing
   tests changed only where intended (list), new golden replays (legacy moved),
   1000-seed tables of the maps as in rules 24 with the damage split
   (creatures / traps / heat). Cinder Hollow waves unchanged (UD-53).
6. Studio `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`: rows for the
   trigger decisions and the direction statement (quote exactly; the DK2
   cannon remark recorded as a remark that led to the turret).
7. `SimulationCpp/README.md`, `Evidence/UR-SIM-TRAP-REWORK-V1/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-SIM-TRAP-REWORK-V1/WORKER_RESULT.md`,
   including a list of what the Unreal game must show.

## Limits

- External allowed: `SimulationCpp`, `Evidence/UR-SIM-TRAP-REWORK-V1`. Studio
  allowed: `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`,
  `Artifacts/Underreign/Evidence/UR-SIM-TRAP-REWORK-V1`.
- Do NOT commit or push. Compiler parallelism at most 8. No Unreal.
