# Independent review — UR-STYLE-SAMPLE-V5

Reviewer task: separate read-only Claude Code subagent, requested model sonnet — not independently attested.
Verdict: PASS (no high or medium findings).

1. Scope and LFS. External git status shows only two modified files (`StyleSample/README.md`, `UnderreignStyle/Config/DefaultEngine.ini`) plus new V5 paths (`Captures/V5`, `Scripts/v5`, `Scripts/jobs/v5_*.json`, `Maps/L_StyleSample_V5.umap`, `Evidence/UR-STYLE-SAMPLE-V5`); all inside the allowed list. No step 2-4 asset modified; `StyleSample/Creatures` not touched. `.gitattributes` covers `*.mp4` (and png, gif) with LFS; `git check-attr` confirms the V5 .mp4 and the .umap resolve to filter lfs. Captures/V5 holds 30 png + 1 mp4. Studio side: REVIEW and WORKER_RESULT paths only.
2. Diagnosis evidence. `streaming_evidence.txt` (ListTextures excerpts) backs the main cause: layout map 4096 px resident at 128 px, floor scans 128 px, forge bricks 64 px after 300 frames, 155 MB in memory; after full load 551 MB with all at full size. The cvar log lines show the ini settings applied in the step-5 capture. Viewed `crops_100pct.png` and `sidebyside_game_camera.png`: step 5 shows visibly more floor/brick/rock detail than step 4 at 100 %, consistent with the claim; the neutral grade is visible (grey floor). The observations the worker lists as weak points (grey ash patch, paler flames) are visible. Visual judgement remains the Human's.
3. Caps. Command lines show `t.MaxFPS 30`, `-RenderOffscreen`, no benchmark. Frame stamps: 1080p run frame 2 to 308 in about 10.2 s (about 30 fps); 4K run frame 2 to 125 in about 12.3 s (10 fps). Matches the result's per-tick claim; the per-tick check itself lives in `capture_v5.py` (not re-executed).
4. Disclosure. The ini comment says "for the whole sample"; WORKER_RESULT section 6 states the full-load fix is a sample-wide project setting that does not scale to a real game.

Findings (Low/Info only):
- Info: `.umap` is not LFS-tracked by `.gitattributes` for the Studio's rule set, but `git check-attr` reports lfs for it (likely via a nested/other attribute rule); no action.
- Low: README step-5 section does not itself say the full-load setting is sample-only (it is disclosed in WORKER_RESULT section 6 and the ini comment).
- Low: the WORKER_RESULT per-tick claim relies on the capture script; only log frame stamps were re-derived here.
