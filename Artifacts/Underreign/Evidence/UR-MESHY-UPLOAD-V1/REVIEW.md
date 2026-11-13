# UR-MESHY-UPLOAD-V1 Review

Checks (commit df81d87):
- Paths: only ArtSource/Meshy/** and Evidence/UR-MESHY-UPLOAD-V1/WORKER_RESULT.md; .gitattributes unchanged. 41 files = 37 zips + 2 concept PNGs + README + evidence. OK.
- 37 zips in ArtSource/Meshy/Raw = all source zips except the Mycelia queen (38 sources minus 1). OK.
- Zips are LFS pointers; `git lfs ls-files` lists 37 under Raw. OK.
- sha256 spot-check (Emberfang, Victorian Street Lamp, Iron Bulwark): pointer oids equal source hashes. OK.
- README table: plausible, matches the files.

Findings:
- INFO: README category column is keyword-matched and wrong in places: Frettchenführer-Körper (M29) and Frettchenkäfig (M30) are "room" (should be creature/people); Plünderer-Sack (M13) is "people / intruder / creature" (should be prop/weapon); Heilerin-Stab, shields and similar are "weapon" (acceptable). Category column should not be relied on.
- INFO: Combined category label "people / intruder / creature" is vague.

Verdict: PASS
