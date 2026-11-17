# STUDIO-BRAND-MARKET-RESEARCH-V1 — Independent Review

Reviewer: separate Claude Code subagent (did not author the report). Date: 2026-11-17.
Reviewed: `WORKER_RESULT.md`, `SOURCES.md` (committed in `d64e301`) against
`Artifacts/DirectorDispatch/STUDIO-BRAND-MARKET-RESEARCH-V1/WORK_ORDER.md`.
Method: full read; local decision files checked (HD-57, OD-02, OD-10/UD-32, DEC-041);
independent re-search via WebSearch (public sources only; no account, registration,
contact, download or post). Direct database fetches were not attempted, so EUIPO, DPMA,
USPTO and RDAP stay unverified here too.

## Verdict: PASS WITH NOTES

## 1. Coverage

- Objectives 1-7 are all covered: studio name (3), titles (4, 5), domains (6),
  "New Retro" (7), market (8), order (9), publisher (10). The German summary is at the top.
  There are exactly 8 Human questions, each with a recommendation.
- Task controls are covered: the AI and "Six Fingers" framing has options A-C; "New Retro"
  covers NewRetroWave, neo-retro, boomer shooter, retro-modern and Steam tags, plus curator,
  event and tagline options with effort and risk; each game has 9-10 candidates with the top 3
  in a matrix; estimates are marked **E**; Capability KB is marked NOT APPLICABLE.
- Check marking is honest. EUIPO, DPMA, official USPTO and all domains are NR, with the
  proxy 403 / ENOTFOUND evidence logged. Social handles are ND with a reason. DONE-I
  (indirect, via search index) is clearly defined and is not passed off as a database query.

## 2. Sourcing spot-checks (12 re-searched)

| # | Claim | Result |
|---|---|---|
| 1 | No studio/game/mark "Sixth Finger" | Confirmed (no hit; nearest SIXFINGERS DESIGN 77151231, paper goods) |
| 2 | Steam "SIX FINGERS", WALEED, 2024-11-26, horror | Confirmed (app 3249760) |
| 3 | "Torchwrights": no game/mark; nearest Torchlight | Confirmed. Only hit: a "Torch-Wright"/"Torch-Wight" typo in an itch jam comment (negligible) |
| 4 | "Strataheart": no game/mark | Confirmed (only unrelated "Strata Health", "Strata" album) |
| 5 | "Underreign": no game; nearby Reigns / Underlords | Confirmed |
| 6 | UNDERDEEP, dungeon idle RPG, Steam app 4065440 | Game confirmed. **Release date "2026-10-29" not corroborated** (see F-2) |
| 7 | Next Fest Feb 2027: 02-22 to 03-01, deadline 2027-01-10; June 2027: 06-14 to 06-21, deadline 2027-04-25; Oct 2027 without dates; one participation per game | Confirmed on the Steamworks pages |
| 8 | Wishlist conversion median 0.15x (>25k wishlists, 2024-25), 0.10x above $10 | Confirmed (GameDiscoverCo). The figure counts all first-week purchases, not only purchases by wishlisters |
| 9 | 49.9 % of Oct 2026 releases disclosed AI (u/ploz tally, not Valve); 40.1 % for 2026 YTD | Confirmed |
| 10 | Game Oracle: about 53 % fewer reviews for disclosed games | Confirmed. **The 77 % vs 83 % rating gap is misattributed** (see F-1) |
| 11 | Hooded Horse bans gen-AI assets in contracts (Jan 2026) | Confirmed. The ban also covers placeholders, audio and writing; studios that use gen-AI are not signed |
| 12 | NewRetroWave website from Nov 2011 by "Ten", later a label; Retrovibe (2021, GOG) "New Retro twist" | Confirmed |

No obvious collisions were missed for Sixth Finger Games, Torchwrights or Strataheart.

## 3. Originality and consistency

- DEC-041: the recommended titles are not names of existing games or marks found by search.
  Torchwrights sits close to the well-known TORCHLIGHT marks (cl. 41). The report states this
  and it remains a residual risk until official checks are run.
- UD-32 / OD-10: the Underreign candidates avoid dwarf, hearth and fire words. The report
  itself flags the internal vocabulary overlaps (Oathbraid vs Oath-warden, Brandholm vs
  Brand-hound). No conflict found.
- HD-57: the report uses the EUR 60k/year figure as the HD-57 goal (HD-57 calls it the
  "dream goal"; the meaning is the same). It orders Hearthlands first for revenue.
  F-REL-001 stays open. OD-02: "Underreign" is kept only as a recommendation, gated on step 0
  (official checks before public use). No contradiction found.

## 4. Forbidden actions and writes

- I found no sign of any account, registration, filing, purchase, contact or post.
  The failed RDAP/TMview attempts were read-only lookups.
- `git status --porcelain` is clean in all three repositories. The only new commit,
  `d64e301`, adds just `WORKER_RESULT.md` and `SOURCES.md` in this folder. It was made after
  the Worker finished, apparently by the Director; the Worker reports that it ran no git
  operations. Nothing changed in `hearthlands` or `underreign`.

## Findings

| ID | Severity | Finding | Evidence |
|---|---|---|---|
| F-1 | Medium (mis-sourcing, decision-relevant numbers) | Section 8.5 row "Review effect (2025 releases)" and section 3.3 credit "77 % vs 83 % positive (>=50 reviews)" to the Game Oracle study [S-18]. That gap comes from the separate u/ploz dataset [S-19]. Game Oracle reports 84.6 % vs 88.3 % for games with >=100 reviews (and an average of 4 vs 7 first-month reviews). The sample is also given as "Jan-Oct 2025", but coverage describes it as about 10,000 2025 releases. | PC Gamer / Digital Citizen coverage of Game Oracle; Outlook Respawn / Mezha coverage of u/ploz |
| F-2 | Low | UNDERDEEP is listed as "Steam, 2026-10-29". Store-page snippets show "Planned 2026 / not yet available"; IGDB/Discord gives 2026-10-30; gg.deals gives no date. Lantern Hollow "released 2026-10-29" [S-29] could not be corroborated either; the identical date suggests a possible copy error. The screening verdicts do not depend on these dates. | Steam app 4065440 snippets; RPG Site; gg.deals |
| F-3 | Low | Most "Steam developer names: DONE-I: none" cells have no source ID. The Six-Fingered Dwarf secondary USPTO check is "ND (not searched separately)", which gives no reason why it could not be done. | WORKER_RESULT 3.2, 4.2, 5.2 |
| F-4 | Low (completeness) | The Next Fest table leaves out the required-items review deadlines (2027-02-08 for Feb, 2027-05-31 for June). These matter for the June 2027 plan in section 9. | Steamworks Next Fest pages |
| F-5 | Info | "Others (EA, Ubisoft) promote AI tools [S-20]" was not re-verified. It is not decision-critical. | S-20 |

## Corrections recommended (not required for PASS)

1. F-1: credit 53 % fewer reviews and 84.6 % vs 88.3 % (>=100 reviews) to Game Oracle [S-18],
   and 77 % vs 83 % (>=50 reviews) to u/ploz [S-19]. Correct the sample period.
2. F-2: change the UNDERDEEP and Lantern Hollow dates to "planned 2026 (Steam) / 2026-10-30
   (IGDB)", or mark them unverified.
3. F-3, F-4: add source IDs or reasons to the cells; add the review deadlines to section 8.4.
