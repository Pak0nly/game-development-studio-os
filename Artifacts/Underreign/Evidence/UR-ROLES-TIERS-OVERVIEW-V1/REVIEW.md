# UR-ROLES-TIERS-OVERVIEW-V1: independent review

## Checks

1. Scope: PASS. In C:/GameDev/Underreign the untracked items from this order are only Design/Planning/CREATURE_ROLES_AND_TIERS.md and Evidence/UR-ROLES-TIERS-OVERVIEW-V1 (the other untracked items belong to other orders). No tracked file shows as modified, so no rule, data or code changed (SimulationCpp and Game untouched).
2. Underreign facts: PASS. Checked against PrototypeContent.cpp: hound 110 hp, speed 25, wage 20, food 3; warden 260, speed 10, wage 70, food 1; witch 70, speed 15, wage 50; moth 40, speed 30, wage 10; Kiln-ox 300, speed 8, wage 30, food 4; Lien-hook 120, speed 14, wage 45, food 2; surgeon 80, wage 40; Footnote 90, speed 18, wage 35, food 2, first strike 45, ambusher. Tuning.h: CreatureCap 8, CapPerExtraNest 4, CapMax 16 (gives 8/12/16). cpp_bench.txt: 5x128x128 = 81920 cells, 38 creatures, up to 30 intruders, mean 0.113 ms, p99 0.874 ms, max 10.657 ms, all as cited. Intruder roles (Brute, Sapper, Healer and others) exist in the code. Walking-time arithmetic is consistent (128 cells at speed 8 gives 160 s).
3. Genre facts: PASS. Editor manual [S8] fetched: size at most 128, at most 4 players, first portal 15 creatures and 5 per further portal, pool of 30 as a suggested value, hero party up to 16, too-large and too-small advice, all confirmed. Wikipedia [S4] fetched: max level 10, Training Room up to level 4, levels 9 and 10 not reachable via Training Room or Combat Pit, elite creatures from specific tile arrangements, all confirmed. The Wikipedia page does not give a player count; the document takes 4 from the manual and the Gamicus snippet and marks the snippet-only sources (S7, S9) as such. Unconfirmed points are explicitly marked "not confirmed".
4. Originality: PASS. Reference creatures are described by generic type only; no long text copied; proposals use Underreign's own creatures and plain working labels (fodder, sapper) with a name-check note.
5. Completeness: PASS. Role table (role, reference, today, gap), 12-role set with fodder and sapper/siege, three siege options and three tier options with pros and cons, map scale with risks, 7 questions each with a recommendation. UD-47 explicitly kept (the sapper never creates a layer link).

## Findings

- INFO: DoorsBarCreatures defaults to 0 in Tuning.h; the document says it is on per UD-97. Plausibly set in data or scenario files; not verified here.
- INFO: S7 and S9 are search-snippet only; the document says so, and the key claims rest on S8 and S4.
- INFO: The 6 to 8 player map sizes (160 to 192) are an extrapolation, labelled as a proposal and marked unmeasured.

Verdict: PASS
