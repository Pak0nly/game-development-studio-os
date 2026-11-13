# Independent review UR-NIGHT-04-V1 (QA Lead)

Candidate: branch night/2026-11-12 (HEAD 60425821), external repo C:/GameDev/Underreign. Read-only review.

## Verdict: PASS

## Checks
1. Paths: `git diff --name-only main night/2026-11-12` = 277 files in ArtSource/EnvironmentKit, 1 in Design/Art, 5 in Design/Planning, 13 in Evidence/UR-NIGHT-04-V1. SimulationCpp and Game: 0 files changed. OK.
2. Deliverables 1-10 all present (standard, wall kit scripts/blend/fbx/textures, strata/states/fracture with films per material, floors, proof scene with renders + pan film + 1 m greybox, size table, speed table, motion list, Unreal plan, question catalogue). Triangle ranges in NIGHT_RESULT match stats/SUMMARY.md, all rows "within budget"; budgets in SUMMARY are the ones in ENVIRONMENT_KIT_2M.md section 4. Blender 5.3.0 bpy wheel and install command recorded (ITEM_02, NIGHT_RESULT). Binary files are LFS (blend verified as LFS pointer; png attr filter=lfs).
   Viewed: proof_recommended_look, proof_greybox_1m_close, proof_low_cut, walls_seamrow_Stone, fracture_Stone_end, floors_sheet, props_sheet. All exist and match the documents (human 1.8 m and hound in a corridor, 1 m greybox where the human fills the corridor, low cut shows more floor, angular stone chunks, floor trio, props incl. doors/stair/brazier/rubble).
3. Own content: scripts contain no URLs, downloads, fonts, HDRIs or external textures; no .ttf/.hdr/.exr in ArtSource; no names of other games in the new documents. OK.
4. Speeds (SimulationCpp PrototypeContent.cpp, 10 ticks/s, 2 m cells): Brand-hound Speed 25 = 2.5 cells/s = 5.0 m/s (table 5.0); Kiln-ox 8 = 1.6 m/s (table 1.6); Cinderling/worker 20 = 4.0 m/s (table 4.0, Tuning.h WorkerSpeed 20); Scout 25 = 5.0; Brute 10 = 2.0. All correct.
5. Questions N4-1..N4-7: plain language, recommendation plus 2-4 options each; topics (cut height, hound size, corridor roughness, crumbling, stairs, grid, fight distance) do not duplicate N3-1..N3-14.
6. Honest open points: setup_kit_proposal.py is headed "PROPOSAL, UNTESTED" and NIGHT_RESULT line 71 states it is untested in Unreal.

## Informational findings (no defect)
- The recommended-look render is warm orange-brown; the order asked for neutral grey-brown (style sample). The textures are declared stand-ins replaced by the scanned rock in Unreal; colour is the Human's call.
- Proof renders are small-view corridors on a very dark background; walls are readable mainly in the close/low-cut views.
- Evidence folder holds three internal REVIEW_PASS files by the night session (self-review, not independent); this review is the independent one.

Correction: the first candidate identity was aggregated with a case-sensitive sort; recomputed independently over the 296 files (working-tree bytes, sorted by path.casefold()) = 101279fd70a35e46812e49aa7b37f4510cfb2b89aadd9f79f248a6bafe3196a6, now in review.json. Verdict unchanged: PASS.
