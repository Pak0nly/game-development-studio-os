# Independent review — UR-CREATURE-SAMPLE-V1

Reviewer task: separate read-only Claude Code subagent, requested model sonnet — not independently attested.
Verdict: PASS (no high or medium findings).

1. Git scope (external): `git status` in C:/GameDev/Underreign shows only untracked `StyleSample/Creatures/` and `Evidence/UR-CREATURE-SAMPLE-V1/`; nothing else changed. `.gitattributes` covers png, gif, fbx, blend with LFS; `git check-attr` confirms the LFS filter for the fbx, blend and webp files checked.
2. Git scope (Studio): for this order only `Projects/Underreign/References/ArtDirection/brand_hound_concept_v1.png` (new), one added line in `PROVENANCE.md`, and the evidence folder. The concept PNG SHA-256 (a1eba94d...1c86) equals the Meshy-folder original "Basalthund mit glühendem Brandmal.png". The PROVENANCE line is accurate (DEC-042, byte-identical, hash stated).
3. Outputs exist: SK_BrandHound.fbx (SHA-256 matches the result), six animation FBX (Idle, Walk, Run, Bite, HitReact, Death), four textures (BaseColor, Normal, ORM, Emissive; BaseColor hash matches), Source/BrandHound.blend, IMPORT_NOTE.md, Scripts, and webp + gif previews for all six animations in side and game views, plus three stills.
4. Stills: the head/collar close-up shows high-poly vs game mesh with consistent detail, collar and rings, emissive seams; claims in the result are plausible. Animation playback not judged (Human's call); preview files are non-trivial in size (0.3-11 MB each).
5. Collar and rings: collar/ring strings are present in the skeleton FBX; the result lists collar plus four ring bones among 41 bones and states pendulum motion is baked into all six animations (Human addition).

Info/Low notes (no action needed for PASS): the result honestly lists weak points (no mouth cavity, auto UVs, emissive on eyes/mouth, procedural motion, rings fused to chest mesh). Extra file Source/T_BrandHound_Normal_OpenGL.png (LFS-covered png) is inside the allowed folder.
