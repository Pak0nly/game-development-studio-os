# UR-DECISIONS-R8-V1 Review

Reviewer: independent (did not do the work).

## Checks

1. Scope: PASS. Studio changes for this order are only `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md` (39 insertions), `Projects/Underreign/Docs/OPEN_DECISIONS.md` (7 rows modified, 4 added) and `Artifacts/Underreign/Evidence/UR-DECISIONS-R8-V1/`. Other changed or untracked Underreign paths (UR-CAMERA-STUDY-V1-EXT01, UR-GREYBOX-RESAVE-FIX-V1 dispatch) belong to other orders. External: only the three NIGHT2/3/4 files (pure insertions, 27 lines in total) and `Evidence/UR-DECISIONS-R8-V1`; `Game/Scripts/setup_kit.py` ignored as instructed.
2. Faithfulness: PASS. A script check confirmed that every Human answer line and every note (cards 1 to 31, 35 to 37) appears verbatim in the two files (allowed formatting only: "with Notiz:", "[paragraph]"). Decision texts were compared against the page's recommendation and option text and add nothing decision-relevant. Notes are labelled "note for later, not a decision". Card 11 (UD-96) records only the exclusion of option B, quoted from the page, and puts the open question in OD-24. Card 18 (UD-103) records option B, not the recommendation. Card 21 is an OPEN row (OD-25) and is not a decision. Cards 30 and 31 are a note row plus OD-27, and cards 32 to 34 are listed as unanswered. OD-02, OD-05 and OD-23 stay OPEN with the dated answer "later". Card 29 splits into UD-113 (option A) and OD-26 (anti-bottleneck design, with the Human's discussion options listed, UD-47 expressly unchanged).
3. Existing rows: PASS. Only OD-02, 05, 14, 20, 21, 22, 23 changed. In each case the old text is kept and extended (status or note updates only). UD-47 is untouched (not in the diff). Column counts are consistent: the new rows in DISCOVERY_DECISIONS have 5 pipes; every row in OPEN_DECISIONS has 5 pipes. The three rows with 6 pipes (UD-46 to UD-48) already existed and are unchanged.
4. Night-file lines: PASS. N2-B1 to B8 map to UD-107 to UD-113, with B8 also pointing at OD-26; N2-C1 and C2 point at OD-27; N3-1 to N3-14 map to UD-94, 95, 96 (plus OD-24), 97, 98, 102 (N3-6), 99, 100, 101, 104, 105, OD-25, 106, 103; N4-4 to N4-7 map to UD-90 to UD-93. Each line sits directly under its own question heading. These match the mapping table in the worker result.

## Findings

- INFO: OD-21 and OD-22 still contain the old sentences "What the roles and stances are comes in the next night shift" and "the number ... is open". These are now historical, but each row carries the dated 2026-11-13 update, so the meaning is clear.
- INFO: UD-103 adds "(measured before: careful strongest, furious weakest)" and UD-113 adds "side walls can always be broken". Both come from the page's context text, not from the recommendation. They are harmless.
- INFO: N2-C3 to C5 (cards 32 to 34) have no "Still open: see OD-27" line in NIGHT2. The work order only required lines for questions answered here, and OD-27 covers them.

Verdict: PASS
