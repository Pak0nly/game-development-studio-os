# Work Order UR-ANIM-RETARGET-TEST-V1 — Free humanoid animations on the Human's Meshy Brute (test)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-ANIM-RETARGET-TEST-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-ANIM-RETARGET-TEST-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-ANIM-RETARGET-TEST-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-ANIM-RETARGET-TEST-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (exact, 2026-11-12)

Question: "Wir haben viele Humanoide Wesen in unserem Spiel. Würde es sich da lohnen ein größeres Animationspaket zu nutzen/kaufen und die rigs darauf anzupassen? Als Alternative zu dem Aufwand und Kosten mit den Videos von Seedance."

After the Director proposed a free test first: "Einen Worker der die kostenfreien Animationen testet wäre gut."

## Parent decision and evidence threshold

Parent decision (the Human's): use a humanoid animation library with
retargeting for Underreign's humanoids instead of Seedance videos, and
whether to buy combat packs. This test shows whether the free, already
installed Unreal mannequin animations look good on one of the Human's Meshy
humanoids in the game camera, and how much work rigging and retargeting a
Meshy model takes. It is scoped evidence for one body type; it decides no
purchase.

## Inputs (read-only)

- The Human's Meshy Brute: `C:/GameDev/Underreign_Assets/Meshy/Brute_Meshy_AI_The_Iron_Bulwark_20261112_texture_fbx.zip`
  (extract a copy into the work folder; the zip stays unchanged). Own content.
- Free animations already installed with Unreal 5.8 (no download):
  `C:/Program Files/Epic Games/UE_5.8/Templates/TemplateResources/High/Characters/Content/Mannequins/`
  (mannequin skeleton and meshes; Anims: Unarmed idle / walk / jog / jump /
  attack, Death) and `Templates/TP_ThirdPerson/Content/Variant_Combat/Anims`.
  These are third-party (Epic) content: use only inside Unreal; never send them
  or renders that contain them to any AI service (DEC-025).
- Inventory only (do not download anything): list which animation content
  already exists in `C:/GameDev/Underreign_Assets/Fab/VaultCache/FabLibrary`.

## Tasks

1. Prepare the Brute in Blender (background mode, CPU): reduce to a game
   budget (report triangles before/after; aim 30-60k), keep the textures
   (downscale to 2K if needed), fix the scale and orientation, keep the shield
   on the back as part of the mesh.
2. Rig it to the Unreal mannequin skeleton (same bone names and hierarchy, so
   the mannequin animations play directly or through Unreal's IK Retargeter):
   fit the bones to the Brute's proportions, skin weights (the shield on the
   back follows the upper spine rigidly), fingers if feasible. Record the
   steps as a script so the method can be repeated for the other humanoids.
3. In the separate StyleSample Unreal project (`StyleSample/UnderreignStyle`,
   NOT the game project, which another Worker is using now): import the
   rigged Brute and the needed mannequin content, set up retargeting if bone
   proportions require it, and play idle, walk, jog, an unarmed attack, a
   death. Fix only what the retarget needs (foot sliding, sinking feet,
   arm/shield intersection, hand poses); report what you had to fix and what
   remains.
4. Proof: short sharp MP4 and GIF per animation, from the game-camera angle
   (high, about 55 degrees down, as in the game) and from the side, Brute on a
   plain floor, frame-capped; one still next to the mannequin for proportions.
   Judge it yourself at full frame rate (foot contact, twitches, arms through
   the body, shield clipping). Also report the effort in steps and how much of
   it is reusable for the next humanoid (Scout, Healer).
5. Write `Evidence/UR-ANIM-RETARGET-TEST-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-ANIM-RETARGET-TEST-V1/WORKER_RESULT.md`
   (Studio, plus the verify-worker line): results, problems, the Fab
   inventory, and a plain recommendation (free library enough for base moves?
   which kinds of combat animations are missing for our humanoids?). Delete
   your temporary frame folders when done.

## Limits

- External allowed: `StyleSample/Characters/BruteRetarget`,
  `StyleSample/UnderreignStyle/Content/Characters`,
  `StyleSample/UnderreignStyle/Content/Maps/AnimTest`,
  `StyleSample/Scripts/animtest`, `StyleSample/Captures/animtest`,
  `Evidence/UR-ANIM-RETARGET-TEST-V1`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-ANIM-RETARGET-TEST-V1`. Work files only under
  `C:/GameDev/Underreign_Assets/AnimWork/UR-ANIM-RETARGET-TEST-V1`. The game
  folder `Game/` is protected (another Worker is changing it). Never touch any
  Hearthlands folder or other `C:/GameDev/*` project; the Unreal install
  folder is read-only.
- GPU: the Human's PC switches off under full GPU load. Before every Unreal
  start check that no other UnrealEditor process is running; if one is, wait
  and check again later (never two Unreal runs at once). Every Unreal run
  frame-capped (30 fps), offscreen or minimised, short, no benchmark mode, no
  path tracing, limited shader compile workers. Blender in background mode,
  CPU renders. Lower process priority through the process API; never launch
  anything through the Windows shell (no `start`, `explorer`, `Invoke-Item`
  or file associations). No window in front of the Human, no video playback
  with sound.
- No network, no downloads, no purchases, no uploads, no AI services.
- Report instead of silently changing the goal if something cannot be solved.
- Do NOT commit or push.
