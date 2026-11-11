# Independent review — UR-STYLE-SAMPLE-V1

Reviewer task: separate read-only Claude Code subagent, requested model sonnet — not independently attested.
Verdict: PASS (no high or medium findings).

1. Repository scope: `git status` in C:/GameDev/Underreign shows this order's changes only as untracked `StyleSample/` and `Evidence/UR-STYLE-SAMPLE-V1/` (plus `Evidence/UR-SIM-TRAPS-DOORS-V1/`, which belongs to another order); the 91 SimulationCpp entries belong to another order. `StyleSample/.gitignore` excludes UnderreignStyle Binaries/Intermediate/Saved/DerivedDataCache/Build, Logs, PerfRuns, Captures/raw; no ignored-type files appear as untracked. `check-attr` confirms `.uasset`, `.png` and `.webp` resolve to the LFS filter (StyleSample/.gitattributes plus root attributes).
2. No downloaded/Fab content: Blender scripts and README state assets are generated from seeded noise; grep for fab/megascans/quixel finds only "no ... downloaded" disclaimers.
3. Numbers and frame cap: frame_cap_check.txt shows perf runs at 30.1 and 30.0 fps; perf_stats.txt FrameTime avg 33.33 ms for both, matching WORKER_RESULT (High 10.6 ms, Epic 17.2 ms GPU). The early `-benchmark -fps=30` runs (30-53 fps, discarded and redone) are disclosed honestly.
   - Info: cap_stills measured 28.3 fps and cap_move 35.8 fps; the result explains the move average includes fast shutdown frames after capture and rendering ran about 9 fps. Plausible, not a cap breach for rendering.
4. Stills viewed (01, 04, 05): all match the claims — game camera over a slab floor with ember-lit seams, braziers, lava river at right, blood; 04 shows horned creature (glowing horns/chest), pale intruder with lantern, and a nearly invisible trap plate; 05 shows the same with stencil outlines (amber/blue), ground rings and units-only fill. Weaknesses listed in the result (clay-like rock, tiling lava crust, mostly orange light) are visible and honestly stated.
5. Originality: nothing in the stills or description is evidently copied from Diablo; scene is own composition (lava chasm, ring pillars, glass-horn Heart, brass contract rings). Visual quality judgement is left to the Human.
