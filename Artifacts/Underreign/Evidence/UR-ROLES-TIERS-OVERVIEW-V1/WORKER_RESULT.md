# UR-ROLES-TIERS-OVERVIEW-V1: Worker result (Studio)

verify-worker: `PASS worker receipt e49c6f9917bbedb56ce5df6ec70a7c196d5c860c3f3a6f2414edfe77aa57550e`
(first run before the regeneration failed closed: `E_REPOSITORY_HEAD: HEAD mismatch: 351bbde1...`; no mutation then).

Studio HEAD at verify: `351bbde1`. External HEAD at start: `231d0aa`. No commit, no push.

## Files written

- External: `C:/GameDev/Underreign/Design/Planning/CREATURE_ROLES_AND_TIERS.md`
- External: `C:/GameDev/Underreign/Evidence/UR-ROLES-TIERS-OVERVIEW-V1/WORKER_RESULT.md`
- Studio: `Artifacts/Underreign/Evidence/UR-ROLES-TIERS-OVERVIEW-V1/WORKER_RESULT.md` (this file)

## Summary

- Reference: few tactical specialisations (blocker, blitzer, flanker, support, scout, digger); specialists were
  economic (research, manufacture); no siege, anti-magic or fodder role; levels 1-10; 15 creatures from the first
  portal + 5 per further portal; maps at most 128 x 128 tiles, at most 4 players. Sources cited in the overview,
  unconfirmed points marked.
- Underreign gaps: cheap fodder, sapper (siege digging and hidden trap breaking on attack), shown ram job (Kiln-ox
  already breaks doors 3x), thief, answer to the cannon ring at a bottleneck (OD-26).
- Proposal: 12 Ashen Pact roles in 3 tiers; tiers via existing levels plus promotion at contract renewal; three siege
  options and three tier options with pros and cons.
- Map scale: 128 cells = 256 m; Kiln-ox needs about 3.7 minutes across with a real path (> one payday); 6-8 players need
  about 160 x 160 x 4-5 or players spread over the layers; bench at 5 x 128 x 128 with 38 creatures is 0.11 ms mean per
  tick, 8 realms unmeasured.

## Questions for the Human (recommendation in brackets)

1. Cheap fodder creature? (A: yes)
2. How the attacker digs through? (A: sapper creature; promoted Kiln-ox later)
3. Kiln-ox door breaking as its shown job? (A: yes)
4. Tier path? (A: levels plus promotion at renewal)
5. Limit on promoted creatures? (A: no hard cap)
6. Map size for 6-8 players? (A: "huge" 160 x 160 after an 8-realm bench)
7. Walking time on large maps? (C: decide after a 128 test map)
