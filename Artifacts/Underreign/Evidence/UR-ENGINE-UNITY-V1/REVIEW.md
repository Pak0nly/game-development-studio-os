# Independent review — Underreign engine comparison (UR-ENGINE-UNITY-V1 and UR-ENGINE-UNREAL-V1)

Reviewer task: a49dc15139384a9ae (separate read-only Claude Code subagent, requested model sonnet — not independently attested).
Verdict: PASS (no high findings; one medium caveat for the Human, not an error).

1. Same scene and camera in Blender, URP, HDRP and Unreal: identical framing, placements and lens values (32/35 mm on 36 x 20.25 mm). The Director's impression of a wider Unity overview was not reproduced.
2. Kit corrections: lights x 4 pi on both sides; two-sided rock — low: Unreal made the whole rock texture set two-sided (fill and tunnel), Unity only the rock fill; no visible artefact.
3. Dig moment at t = 4.0 s (frame 0120) in all three.
4. Medium caveat: performance only roughly comparable (Unity minimised development player, frame time only; Unreal editor -game offscreen, render-thread bound). Order of magnitude and URP/HDRP ratio are comparable; the HDRP vs Unreal ranking is not reliable at this precision.
5. Different global illumination per pipeline by design (none / SSGI / Lumen), exposure calibrated per engine, all fixed; no visible exposure bias. Lava turns yellow in URP and Unreal, stays orange in HDRP (engine difference).
6. Scope: only EngineComparison/Unity, EngineComparison/Unreal and the two evidence folders changed.
