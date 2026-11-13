# Work Order UR-ROLES-TIERS-OVERVIEW-V1 — Creature roles, tiers and map scale: overview with a genre comparison

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-ROLES-TIERS-OVERVIEW-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-ROLES-TIERS-OVERVIEW-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-ROLES-TIERS-OVERVIEW-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-ROLES-TIERS-OVERVIEW-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact, 2026-11-13)

Card 14 note: "Vergleiche mit Dungeon Keeper 2, welche Spezialisierungen gab es dort
und wozu wurden sie eingesetzt. (Wenn überhaupt.) Es spricht nichts dagegen
Kreaturen Tiers zu haben und später stärkere Versionen einer Rolle zu bekommen.
Dafür halt weniger und potentiell taktischer, vorsichtiger einzusetzen. Es braucht
aber natürlich auch Kanonenfutter."

Card 12 note: "Laufende Rammböcke als spezialisiertere Einheit zu haben ist eine gute
Sache. Das gibt Purpose. Sowas braucht wenn möglich jede Kreatur. Eine Rolle."

Card 15 note (army composition is the player's choice: many cheap, few expensive,
balanced, or all-in near bankruptcy) and card 29 / follow-up: digging through
yourself "könnte so eine große und kostspielige Aufgabe werden und will gut
überlegt sein. Es muss sich lohnen zuerst einen anderen Weg zu suchen."

Follow-up 2026-11-13: "Zu Frage 21: Es wird große Karten geben müssen. DK 2 als
Beispiel heranziehen. Zu Frage 14: Gerne."

## Goal

A design overview the Human can discuss: which combat and utility roles a
dungeon-keeper-like game needs, what the genre reference used them for, which
roles Underreign has today, which are missing, and how tiers could work; plus a
reference for map size and player count. Underreign stays original: compare
functions and numbers, never copy names, characters, art or text of the
reference game.

## Tasks

1. **Underreign today** (read-only): from `Design/` (game concept, bible,
   planning files, rules notes) and `SimulationCpp` data, list every creature
   with its current role, cost, upkeep, combat job, special ability and the
   people it belongs to (Ashen Pact first, others as far as designed). Also the
   Studio decisions `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`
   (UD-77, UD-84, UD-86..113) and `OPEN_DECISIONS.md` (OD-21, OD-22, OD-24..27).
2. **Genre reference** (public web pages, text only, no video playback):
   Dungeon Keeper 2: which creature specialisations existed (tank, melee damage,
   ranged, caster/healer, scout, digger/worker, trap/door specialist, siege,
   anti-magic, research/manufacture, fodder), what each was actually used for in
   play, which were considered useful or useless, how creature levels worked,
   and how many creatures a player typically ran. Also its map sizes (in tiles)
   and player counts per map, and what made large maps play well or badly. Cite
   the pages (URLs). Mark anything not confirmed.
3. **Gap analysis and proposal:** a table role → reference use → Underreign
   today → gap. Propose for the Ashen Pact a role set where every creature has a
   clear purpose (for example the ram-like door breaker), including cheap fodder,
   and a tier idea (a stronger later version of a role: fewer, costlier, more
   careful use; how a player gets it: research, level-up, upgrade building,
   evolution). Include siege / sapper roles that tie into the Human's
   anti-bottleneck thoughts (digging through is big and costly). Two or three
   alternatives where real choices exist, each with pros and cons, in plain words.
4. **Map scale:** reference map sizes and player counts, what 6 to 8 players
   (Human's idea, OD-25) would mean for map size in Underreign's 2 m cells and
   layers, and the risks (walking times, simulation load, readability).
5. Write `Design/Planning/CREATURE_ROLES_AND_TIERS.md` (external, English) and
   `Evidence/UR-ROLES-TIERS-OVERVIEW-V1/WORKER_RESULT.md` (external) plus
   `Artifacts/Underreign/Evidence/UR-ROLES-TIERS-OVERVIEW-V1/WORKER_RESULT.md`
   (Studio, plus the verify-worker line) with a short summary and a list of
   questions for the Human (each with a recommendation).

## Limits

- External allowed: `Design/Planning/CREATURE_ROLES_AND_TIERS.md`,
  `Evidence/UR-ROLES-TIERS-OVERVIEW-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-ROLES-TIERS-OVERVIEW-V1`. Everything else
  read-only. No engine runs. No rule or data changes: this is a proposal only.
- Public web research only: never sign in, buy or download; generic search
  terms; no project files or personal data sent anywhere. Summarise, do not copy
  long text.
- Report instead of silently changing the goal. Do NOT commit or push.
