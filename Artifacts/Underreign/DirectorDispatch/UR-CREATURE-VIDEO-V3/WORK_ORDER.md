# Work Order UR-CREATURE-VIDEO-V3 — One Seedance test video with two cameras in one picture (front and side), silhouette-checked transfer

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V3/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V3/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V3/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V3/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (2026-11-11/12, exact)

- On the V2 transfer: "Weiterhin ähnliche Probleme bei den Animationen. Der Angriff ist sogar noch schlechter geworden weil er sich jetzt so gut wie gar nicht mehr bewegt."
- On the plan (two cameras in one picture, start picture from the fixed hound, fit with keypoints plus silhouette in both views): "Für morgen mit einem Video erstmal testen, ja."
- Earlier: "Worauf wir später achten können ist, dass Animationen nicht alle 5 Sekunden benötigen und wir bei Seedance budget sparen."
- Today: "Der Seadance Test kann auch starten"

## Background (read first)

- `Evidence/UR-CREATURE-VIDEO-V1/WORKER_RESULT.md` and
  `Evidence/UR-CREATURE-VIDEO-V2/WORKER_RESULT.md` (external): the pipeline
  (image-to-video, DINOv2 keypoint finder trained on the rig's own renders,
  2D fit, rig rules, bake), what worked and the lessons. V2 lesson 3: a front
  view is what is missing for depth (stance width, left/right, yaw).
- Reference method (a public video series, summarised by the Director): the
  video shows the creature from the front and from the side at the same time
  as a split picture with locked cameras; the start picture is the own model
  rendered exactly from those cameras; the fit poses the rig, renders its
  silhouette in both views, compares with the video silhouettes and adjusts
  bones until both match, in addition to keypoints; a single view gives a
  right outline but a wrong 3D pose.
- Rig: the fixed V2 hound in `StyleSample/Creatures/BrandHound/Source/BrandHound.blend`
  (paws corrected) and the video work file
  `StyleSample/Creatures/BrandHoundVideo/Source/BrandHoundVideo.blend`.

## Tasks

1. **Start picture.** Render the fixed V2 hound (neutral standing pose) as one
   picture split in two halves: left a pure side view, right a pure front view,
   both orthographic or long-lens, same scale, same ground line, plain neutral
   dark-grey background, even light, the whole body visible in both halves with
   margin for movement. Note the exact camera setup; the fit uses the same.
2. **One Seedance video (hard: one paid generation).** Image-to-video from that
   picture: a calm walk cycle of the hound in place (treadmill style, it stays
   centred), both cameras locked and never moving, the split line fixed, no
   cuts, no zoom, no other creatures. Use the shortest duration the API allows
   that still gives at least two full strides. Log tokens. A job that the API
   rejects before generation (no tokens charged) may be retried after fixing
   the request; a generated video counts as the one generation even if it is
   poor. Report the result honestly in that case and stop the video part.
3. **Two-view fit.** Train or adapt the keypoint finder on rig renders from
   both cameras (CPU preferred). Fit each frame using keypoints from both
   views plus a silhouette comparison in both views (render the rig's mask from
   the two cameras, compare with the video masks, adjust until both match).
   Keep the V2 rules that worked (video timing for stance, locked paws while
   down, forced lift, joint limits, calm collar; smooth the ring seam
   cyclically before the per-frame cap). Loop the walk.
4. **Bite re-transfer from the existing V1 bite video (no new video).** A real
   forward lunge with limited reach: the body and head go forward clearly,
   head-tip reach about 20-30 cm (V2 had 8 cm and barely moved; V1/hand-built
   about 37 cm passed through enemies), front paws may step, then recover.
5. **Proof.** Sharp moving previews (MP4 and GIF, side and game camera) of the
   new walk and bite; a side-by-side video: Seedance source | new fit | V2 fit;
   a front-view comparison of the walk (stance width, legs parallel);
   silhouette overlap scores per view (mean and worst frame); paw slide and
   stance width numbers as in V2; honest verdict whether the two-view method
   beats V2.
6. `Evidence/UR-CREATURE-VIDEO-V3/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-CREATURE-VIDEO-V3/WORKER_RESULT.md`, with
   tokens used and lessons for the next round (also: whether shorter clips or
   several motions per clip look feasible).

## Limits

- External allowed: `StyleSample/Creatures/BrandHoundVideo`,
  `Evidence/UR-CREATURE-VIDEO-V3`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-CREATURE-VIDEO-V3`. Work files outside the
  repositories only under `C:/GameDev/Underreign_Assets/AnimWork/` (always
  absolute paths; never create folders directly under `C:/`).
  `C:/GameDev/AnimTools` read-only (use its venv and tools, write nothing
  there). `StyleSample/Creatures/BrandHound` read-only. Never touch any
  Hearthlands folder.
- The API key in `C:/GameDev/AnimTools/secrets/byteplus_key.txt` is read at
  run time only; never print, log, copy or commit it. Network only to the
  BytePlus Seedance API; no other downloads.
- **GPU safety (hard):** the PC switches off under full GPU load. CPU for
  training and solving, or small GPU work only; check first that no
  UnrealEditor or other heavy GPU process runs. No Unreal. Blender in the
  background, no window in front of the Human, no video playback with sound.
- Do NOT commit or push.
