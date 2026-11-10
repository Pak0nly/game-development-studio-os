# Work Order UR-DECISIONS-R7-V1 — Record the first own test round and the wave-3 decision

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Routine.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R7-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R7-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R7-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R7-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (2026-11-10, exact)

- Asked whether to weaken wave 3 after the bot's win rate fell to 23 %: "Erst selbst spielen".
- After the first own round (victory 18:49, Heart 1000/1000, 8 creatures, 0 lost, 19 intruders killed, 0 traps): "Was ich vermisse, ist es mehr Cinderlings herbei zu holen. Mit konstant 4 geht das Ganze recht schleppend voran. Auch sollte diese sich mal entscheiden wo sie arbeiten wollen und nicht elendig lange hin und her rennen. Wenn man Boden übernimmt, kann man auch einfach die Kachel nehmen die direkt neben einem ist und muss nicht quer durch den Dungeon laufen nur um am anderen Ende dann eine zu übernehmen. Ansonsten konnte ich souverän gewinnen und es fühlte sich recht nostalgisch bekannt an vom Spielverlauf. Fallen habe ich keine genutzt. (zu wenig Arbeiter -> zu wenig Gold --> zu wenig tiles erobert um sinnvoll Fallen aufzustellen.)"
- "Performance war kein Problem. Grafikkarte blieb ruhig." (gentle start, 60 fps cap)
- Asked "Soll die dritte Welle so bleiben, wie sie ist?" (recommendation: yes): "Welle 3 bleibt auf jeden Fall so wie sie ist. Wenn ich so schon ohne Verluste gewinne und es mit mehr Arbeitern nur einfacher wird darfs nicht noch einfacher werden durch Abschwächung der Welle."

## Tasks

1. Studio `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`: new section
   "First own test round — 2026-11-10" with row UD-53 in the existing table
   format: wave 3 stays unchanged (no weakening); the bot's 23 % is not a reason
   to weaken it; quote the statements above exactly. Under the row's outcome
   note the Human's test feedback as observations, not decisions (wants to
   summon more cinderlings - summoning exists in the rules but had no button;
   cinderlings should take nearby work; traps unused because of too little gold
   and ground; graphics load fine with the frame cap).
2. Studio `Projects/Underreign/Docs/OPEN_DECISIONS.md`: no new row unless a
   question is really open; if you add one, mark it OPEN with a plain note.
3. `Artifacts/Underreign/Evidence/UR-DECISIONS-R7-V1/WORKER_RESULT.md` (Studio)
   and `Evidence/UR-DECISIONS-R7-V1/WORKER_RESULT.md` (external, a short copy).

## Limits

Studio allowed: the two project files above and
`Artifacts/Underreign/Evidence/UR-DECISIONS-R7-V1`. External allowed:
`Evidence/UR-DECISIONS-R7-V1`. Do not commit. No engine runs.
