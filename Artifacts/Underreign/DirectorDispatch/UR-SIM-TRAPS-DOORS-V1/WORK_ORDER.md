# Work Order UR-SIM-TRAPS-DOORS-V1 — Hidden traps and lockable doors (rules)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.
Runs after UR-SIM-ROUND7-V1 is committed (rules 23). Other orders may edit
`Game` and `StyleSample` in parallel; never touch them.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-SIM-TRAPS-DOORS-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-SIM-TRAPS-DOORS-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-SIM-TRAPS-DOORS-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-SIM-TRAPS-DOORS-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (2026-11-11, exact)

- A3: "Als ich das erste Mal gesehen habe wie alle meine Fallen nacheinander zerstört wurden, dachte ich mir: "Warum überhaupt Fallen aufstellen, wenn sie eh nicht auslösen oder kaputt gemacht werden?""
- A19: "Spielergedanken: Warum Fallen bauen, wenn "alles" darauf ausgelegt ist diese zu umgehen / unschädlich zu machen oder frühzeitig auszulösen? Auch wenn mir die Idee, das jemand mit Frettchen "kämpft" sehr gefällt."
- A22: "Wir brauchen Türen."
- A21: "Wenn das Spiel alles vor allem Schützt und eine automatische Lösung für jedes Problem oder Hindernis bietet lohnt es sich nicht es zu spielen. Dann ist es nur zum zuschauen gebaut und nicht als Skillcheck."
- Chosen: traps "Versteckt (Empfehlung)" — traps are invisible until they fire once or a scout spots them; Brutes bash only revealed parts directly on their route; trap breakers like Sapper or Ferreter are rare and only on later maps. Doors "Abschließbar (Empfehlung)" — wooden or iron doors built in the Forge; a locked door holds intruders until they break it; own creatures and cinderlings pass; the automatic entrance keep-out goes away.
- Direction: "Großer Teil wird sein, dass gegen andere Herzen gekämpft wird und nicht gegen Wellen von Eindringlingen. Eindringlinge könnrn hierbei nur eine temporäre externe Gefahr sein, ein Event welches die Balance des Spiel beeinflussen kann."

## Tasks

1. **Hidden traps**: a trap part is hidden to intruders until it fires in their
   sight, a Scout or Lamplighter spots it, or a survivor reports it (existing
   memory/report rules stay, but only for parts actually seen). Brutes (and all
   non-specialists) bash only revealed parts on their own cell or next step.
   Sapper: bashes revealed parts near it (its job). Ferreter: only on later
   maps — remove it from Crownkiln's waves or replace it, and note which maps
   keep trap breakers (at most one breaker type per map, not before wave 2).
2. **Lockable doors**: new buildable door (wood: cheap, low hit points; iron:
   Forge, more hit points), placed in a 1-wide corridor cell on claimed
   ground; locked/unlocked by the player (command); a locked door blocks
   intruders' paths until broken (Brutes and Sappers break doors; others wait
   or re-route); own creatures and cinderlings pass any door; doors show up in
   path costs; doors can be removed (half refund). Remove the entrance
   keep-out rule of rules 19–22.
3. Deterministic, proposals marked, tests for every rule, existing tests changed
   only where intended (list), new golden replays, 1000-seed tables of the
   maps as the night did (Cinder Hollow waves unchanged, UD-53; the bot may
   place one or two doors at sensible chokepoints — add a door-using bot as
   opt-in if the default bot cannot), short balance note including trap damage
   share before/after.
4. Studio `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`: row for the
   direction statement ("Reich gegen Reich" core, intruders as an event; quote
   exactly). `OPEN_DECISIONS.md`: OD-19 and OD-20 → DECIDED with the rules
   version.
5. `SimulationCpp/README.md`, `Evidence/UR-SIM-TRAPS-DOORS-V1/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-SIM-TRAPS-DOORS-V1/WORKER_RESULT.md`,
   with a short list of what the Unreal game needs to show doors and hidden
   traps.

## Limits

- External allowed: `SimulationCpp`, `Evidence/UR-SIM-TRAPS-DOORS-V1`. Studio
  allowed: `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`,
  `Projects/Underreign/Docs/OPEN_DECISIONS.md`,
  `Artifacts/Underreign/Evidence/UR-SIM-TRAPS-DOORS-V1`.
- Do NOT commit or push. Compiler parallelism at most 8. No Unreal.
