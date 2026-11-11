# Independent review — UR-STYLE-SAMPLE-V2

Reviewer task: separate read-only Claude Code subagent, requested model sonnet — not independently attested.
Verdict: PASS (no high or medium findings).

1. Repository scope (C:/GameDev/Underreign `git status`): 21 entries, all under StyleSample/ or Evidence/UR-STYLE-SAMPLE-V2/. Modified: StyleSample .gitignore, README, capture.py/.sh, DefaultEngine.ini, three step-1 materials (M_Glass/M_Glow/M_Surface). New: v2 Blender scripts, jobs, Scripts/v2, Source/MeshesV2 (14 MB), L_StyleSample_V2.umap, Style/FX/EngineFX, Content/StyleV2 (435 MB: 13 scan meshes, 117 textures, 74 materials, 12 own meshes, 10 FX), Captures/V2 (57 MB). Only scene-used scan assets imported (13 meshes, 117 textures), not the 6 GB library. Size reasonable for the content.
2. Prepared sources: Source/ScansV2/ and Source/EngineFX/ are git-ignored (derived from the read-only library/engine). Binaries in LFS: StyleSample/.gitattributes covers *.uasset, *.umap, *.webp; root .gitattributes covers png/gif/fbx/blend. Covered.
3. C:/GameDev/Underreign_Assets: no file newer than the Work Order (find -newer returned nothing). Untouched.
4. Frame cap: per-tick pacing logs show stills avg 28.0 fps, max 30 frames in any 1 s; camera move avg 13.5 fps, max 30 in any 1 s. perf_stats.txt: FrameTime avg 33.33 ms (q2 and q3), max 34.07 ms, i.e. at 30 fps. Held at or below 30 fps. (Info: perf runs end via the CSV profiler, so no per-tick pacing log; frame time confirms the cap.)
5. Stills: Captures/V2/Stills has 01-05 PNGs, plus 06 move webp/gif and two side-by-side PNGs. Viewed 01_game_camera (grid floor slabs, 3 braziers with fire, lanterns, lava channel, blood decals) and 02_close_forge (brick forge with glowing mouth, anvil, chains, brazier flames, scanned rock walls). Both match the claims in WORKER_RESULT. Visual quality judgement left to the Human.
6. Info: nothing committed or pushed (as stated); CRLF warnings on three text files are cosmetic.
