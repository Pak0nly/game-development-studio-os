# HL-ANIM-VIDEO-STAGE2-V1 progress

- 19:49 verify-worker PASS (receipt b2636c5c...), exit 0. Read AGENTS.md, Work Order, study, stage 1 result and code.
- 19:52 Setup started. Tools folder `C:/GameDev/AnimTools` created. Wan model files (3) downloaded 19:52-19:56, sizes match Hugging Face.
- 19:53 comfyui-rocm tag 101026 cloned; own venv from the existing Python 3.10.11 (system Python untouched).
  Minimal install instead of the build's `install.bat`: `install.bat` would also fetch Python 3.12 from python.org, get-pip,
  ComfyUI-Manager, five custom node repos, diffusers, triton-windows, sage-attention, bitsandbytes and flash-attention from
  third-party GitHub releases. Those are not on the approved list and not needed for one Wan generation, so they are left out.
- 19:54 AMD PyTorch 2.14.0+rocm10.1.0 for gfx1030 (cp310) downloaded from AMD's index.
- 19:57 DINOv2 code (Apache 2.0) cloned and ViT-S/14 weights downloaded (88 MB).
- 20:00 All downloads verified: the three Wan files' sha256 equal Hugging Face's published LFS hashes. Licences read: ComfyUI GPL-3.0,
  Wan files Apache 2.0 (model cards), DINOv2 code and weights Apache 2.0 (LICENSE in the repository).
- 20:02 PyTorch sees the RX 6800 XT only with `HIP_VISIBLE_DEVICES=1` (device 0 is the processor's own graphics and fails with
  "invalid kernel file"). ComfyUI needed `pydantic` (listed in its requirements file, added). ComfyUI runs hidden as server on
  127.0.0.1:8188, no browser.
- 20:03 Tiny test generation (320 x 192, 9 frames, 6 steps): 45 s, success. Setup time 19:52 to 20:03, about 11 minutes plus reading.
- 20:10 Candidate attempt started (first file in the Zwerge folder). Smooth body: the heavy dwarf's own Meshy source (Ironbraid
  Forgewarden, as the rig was made from it, arms lowered and +20 %), 1.97 million triangles, bound to the rig: mean 0.69 voxels from
  the nearest rest cell. Note: the Work Order names `LookTest/DwarfMeshy`; that folder holds the woodcutter's Meshy model (Ironbeard
  Axewarden), not the heavy dwarf's. The heavy dwarf's model lies read-only in `LookTest/DwarfClean/Source` and is used.
- 20:14 Start picture done (front and side, 1280 x 704). **GPU busy from 20:14: three video tries (Wan 2.2 TI2V 5B, 1280 x 704,
  121 frames, 20 steps), about 30 minutes each.** At the same time the CPU renders the finder's 3000 training pictures in Unity.
- 20:31 Director instruction from the Human (2026-11-08), exact words: "Solange keine unserer Daten nach außen gesendet werden oder
  für etwas anderes genutzt werden also unser Spiel geht das. Halte ein Auge drauf."
  Applied: ComfyUI listens on 127.0.0.1:8188 only, no browser, no ComfyUI-Manager or other node packs; its next start and every
  Python run set HF_HUB_OFFLINE, TRANSFORMERS_OFFLINE, HF_HUB_DISABLE_TELEMETRY, DO_NOT_TRACK. No uploads, no online services,
  no further downloads. Check at 20:31 (`Get-NetTCPConnection` by process): ComfyUI (pid 13212) has only loopback connections
  (127.0.0.1). The Unity batch editor (the existing tool, as in every earlier Unity run) holds HTTPS connections to
  34.111.113.40, 34.107.172.168 and 2.22.242.120 (state CloseWait): Unity's own licence and services check at start
  ("Licensing::Client ... resolved entitlement" in its log). These carry no renders or project files from this order; their
  content is encrypted and cannot be inspected here. Reported to the Director for a decision on Unity's own start-up traffic.
- 21:12 Director instruction from the Human (2026-11-08, about 21:10), exact words: "Bis Mitternacht habe ich keine Zeit. Belasse
  es erstmal bei den ersten Video." Applied: the loop that would start tries 2 and 3 (seeds 202, 303) is stopped; they were never
  queued in ComfyUI (queue: 1 running, 0 pending). Try 1 (seed 101) runs to its end. The rest of the order continues with this one
  video; the verdict is judged as "one try only" (the 1-of-3 condition is not claimed).
- Timing: try 1 runs at about 230 s per sampling step on the RX 6800 XT (20 steps, about 77 minutes plus decoding); the first two
  steps were faster (82 s and 96 s) while Unity rendered on the processor, so the slow steps are the GPU itself, not the processor load.
- 20:44 Training set rendered: 3000 pictures (both views) in 26 minutes on the processor; exam renders of three known motions
  (made-up, run round 7, the game's calm walk), clean and degraded, 6 x 120 frames. Labels checked on the picture (they sit on the body).
- 21:25 Try 1 failed after all 20 sampling steps (about 78 minutes): the full VAE decode stopped with "CUDA error: unspecified launch
  failure" (HIP launch failure); ComfyUI hung with the job still "running". GPU memory at that time was over full (a later reading
  showed 15.4 GB dedicated plus 3.3 GB shared system memory during sampling). This is a tool failure, not a video result: no frame
  was written.
- 21:35 Operational recovery 1 of 3 (one condition changed: the decode): the sampled latent is now saved before decoding, and the
  decode runs in tiles (512 px, 32 frames at a time). ComfyUI restarted (hidden, 127.0.0.1 only, offline variables). Try 1 runs
  again with the same seed 101 and the same prompt. Its steps take about 82 s now (the first run slowed to 230 s per step while the
  processor and memory were busy with Unity's training renders): about 28 minutes of sampling.
- 21:40 Exam render crops cached (CPU). GPU still busy with try 1; finder training starts when the video is done.
- 21:56 Second run of try 1: sampling done in 26.5 minutes (20 steps, about 80 s each), latent saved; the tiled decode (512 px)
  failed again with the same HIP launch failure. Operational recovery 2 of 3 (one condition changed: tile size): ComfyUI
  restarted, the saved latent decoded alone in small tiles (256 px, 12 frames at a time): 241 s, success, 121 frames.
- 22:02 **The video exists**: `clips/video_versuch1_wan_gehen.mp4` (1280 x 704, 121 frames, 5.04 s at 24 frames per second).
  Frame check: 121 different frames, no doubled frame, no jump; true motion rate 24 per second. The figure keeps its size
  (407-427 px high in front, 401-423 px at the side) and its feet stay on the floor line.
  Looked at the frames myself: **the two views do not stay two fixed cameras.** The dwarf does not walk forward; he steps on the
  spot and turns: in the left (front) panel he is seen in profile around frames 40, 80 and 120 and from the front again at 60;
  in the right (side) panel he turns towards and away from the camera (three-quarter view at 20, nearly from behind at 40).
  So the figure is the same dwarf, but the "front" and "side" panels show changing angles, not one motion from two fixed sides.
- 22:04 ComfyUI stopped (no more generations; the Human asked for the first video only). GPU free.
- 22:05 **GPU busy from 22:05: joint finder training** (DINOv2 ViT-S/14, 2700 poses x 2 views, 300 poses held out, 30 epochs).
- 22:19 Operational recovery 3 of 3: the first training start finished no epoch in 15 minutes (MIOpen's exhaustive kernel search
  with `cudnn.benchmark`); stopped by its own process id, benchmark search switched off (a step then takes 0.31 s). Restarted 22:20.
- Held-out pixel error of the joint finder (300 poses, both views, panel pixels at 3.0 pixels per voxel): epoch 5 visible mean
  5.92 px (median 4.07), epoch 10 visible mean 4.39 px (median 2.95, 90 % within 9.19), hidden landmarks 8.76 px. Target from
  stage 1: under about 1 px. Not reached at epoch 10; the training was planned for 30 epochs.

## STOPPED 22:31: the Human shuts the PC down (Director instruction)

State at the stop:
- Every process this Worker started is ended: finder training stopped right after epoch 10 (its checkpoint was written at
  22:30 and is kept as `C:/GameDev/AnimTools/work/finder/finder_v1_epoch10.pt`, also `finder_v1.pt`); ComfyUI stopped at 22:04;
  both Unity batch runs had ended (exit 0). No Unity, ComfyUI or Python process of this order is running.
- Nothing is committed. Uncommitted in the Zwerge folder (allowed path only): `LookTest/AnimExam/Runtime/AeSmooth.cs`,
  `Editor/AeStage2.cs`, `Editor/AeStage2Fit.cs` (written, **not yet compiled or run**), the Editor asmdef (two references added:
  DwarfClean and DwarfClean.Editor), `Data/Stage2/gt_gehen_spiel.txt`, their metas. Studio: this evidence folder (PROGRESS.md,
  DOWNLOADS.md, `clips/video_versuch1_wan_gehen.mp4`).
- Data in `C:/GameDev/AnimTools/work`: `unity/train` (3000 training pictures, labels.tsv, cache.npz), `unity/exam/*` (six exam
  render sets with labels and cache.npz), `unity/start` (start picture), `unity/markers.tsv`, `comfy_out/v1_s101_*.png` and
  `comfy_out/latents/v1_s101_00001_.latent` (the video), `video/` (MP4, frame check, frames), `finder/` (checkpoint, log).
  Scripts in `C:/GameDev/AnimTools/scripts` (`env.sh` sets the environment: RX 6800 XT only, offline).

How a successor resumes (same Work Order, same Worker objective):
1. Optional: continue or restart the finder training (`. scripts/env.sh; $PY scripts/finder.py train --set work/unity/train
   --out work/finder/finder_v1.pt --epochs 30`; about 65 s per epoch, 30 epochs about 35 minutes; the script starts from the
   DINOv2 weights, not from the checkpoint). Or use `finder_v1_epoch10.pt` as it is (4.39 px).
2. `sh scripts/after_train.sh` (set `M=` to the checkpoint used): finder error on the six exam render sets, landmarks for them and
   for the video, the pick rules on the one video, and `work/finder/fit_jobs.tsv`.
3. One Unity batch run (it compiles `AeStage2Fit.cs` first): `pwsh -File scripts/run_unity.ps1 -Name r3_fit -Mode fit -Extra
   "-jobs C:/GameDev/AnimTools/work/finder/fit_jobs.tsv"`: way back onto the rig, own skirt rule, exam tables
   (`work/unity/fit/stage2_tables.md`), tracks in `AnimExam/Data/Stage2`, clips `exam_*.gif` and `vergleich_video_v1_s101.gif`.
4. Look at every clip, copy the Human's clips into `clips/`, copy final scripts into `LookTest/AnimExam/Pipeline`, write RESULT.md
   (plain German, verdict as "one try only") and WORKER_RESULT.md, network check of the started processes, commit the allowed
   paths locally (no push).

## Successor R2 (HL-ANIM-VIDEO-STAGE2-V1-R2)

- 2026-11-09 verify-worker PASS (receipt f28d348f...), exit 0. Read AGENTS.md, the R2 Work Order, this PROGRESS, DOWNLOADS, the
  predecessor Work Order and stage 1's RESULT. No Unity, ComfyUI or Python process running at start. Zwerge folder: branch zwerge,
  HEAD 4fd524b, the predecessor's uncommitted AnimExam files present.
- **GPU busy from now: joint finder full training** (30 epochs from the DINOv2 weights, about 35 minutes), output
  `work/finder/finder_v2.pt`. At the same time (processor): the start pictures for the three video variants with the treadmill floor.
- 11:10 Finder full training done (finder_v2, 30 epochs, 32 min). Held-out (300 poses, both views, panel pixels): visible landmarks
  mean 2.82 px (median 1.68, 90 % within 6.17), hidden landmarks mean 6.74 px. Curve: epoch 5 5.76, 10 4.32, 15 3.77, 20 3.25,
  25 2.91, 30 2.82; still falling slowly at the end, training loss (2.18 crop px) now just below the held-out error. Target (about 1 px)
  not reached: about three times too large.
- Start pictures for try 2 made from try 1's start picture (same dwarf, cameras, scale; nothing re-rendered): treadmill belt with dark
  slats in the floor band (side view vertical slats, front view horizontal), a: two panels with a 24 px dark divider, b: side only,
  c: front only, all 1280 x 704. Looked at all three. Prompts `work/prompts/walk_r2_a/b/c.txt`, negative `neg_r2.txt`.
- **GPU busy from about 11:11: video try 2, variants a, b, c one after the other** (Wan 2.2 TI2V 5B, 1280 x 704, 121 frames,
  20 steps, seed 101; sampling with the latent saved, then decoded alone in small tiles as in recovery 2). ComfyUI hidden on
  127.0.0.1:8188 with the offline variables.
- Unity compile check of the extended `AeStage2Fit.cs` (one view only: side view with sideways depth from the rest pose; front view
  with depth from bone lengths): batch run r2_compile, exit 0, 54 s.
- 11:37 **Video 2a exists** (two panels): `clips/video_versuch2a_zwei_ansichten.mp4` (sampling 23.2 min at 69 s per step, tiled
  decode 3.7 min, no crash). 121 frames, no doubled frame, no jump. Looked at 20 frames: clearly better than try 1. The right panel
  stays in profile facing left the whole clip and shows real steps (feet lift and land, wide steps at 30, 78, 90); the left panel
  stays mostly frontal, with slight three-quarter turns of the upper body (around 66 and 102). Same dwarf in both panels. Hands are
  gloved fists, mostly intact, smeared in motion. Faults: thin line artefacts by the feet (a "stick" on the floor at 30, 54, 90, 114),
  feet smear at a few frames. The finder-based rule numbers follow after the three videos.
- 12:04 **Video 2b exists** (side only): `clips/video_versuch2b_seite.mp4` (sampling 23.1 min, decode 3.7 min). Looked at 16 frames
  (every 8th): the best so far. He stays in profile facing left over the whole clip, never turns; a clear, regular walk on the spot
  (feet lift, swing forward, heel lands; wide steps at 16, 40, 64, 88, 112: a step about every 24 frames, so a full cycle about 2 s);
  same figure and size throughout. Arms swing only a little; the near hand is a gloved fist by the belt, intact. Faults: the feet smear
  where they meet the floor in several frames (24, 56, 96, 104); the belt's slats flicker a little rather than clearly sliding.
- 12:20 Director message with Human feedback on try 2 (2026-11-09, exact words): "In 2a links geht er seitwärts und noch zur Kamera
  hin. In 2b geht er rückwärts. Füße verschmieren stark wie du selbst sagst." Applied: two rules added to judging every video:
  (1) the walk direction matches the way the figure faces (no walking backwards); (2) no sideways drift and no drift towards the
  camera. Measured with `scripts/walkdir_r2.py` (optical flow in the feet band: the swing foot is the fastest moving part there, the
  planted foot the part just above the floor; forwards = swing foot travels towards the face and the planted foot slides away from it;
  drift = straight-line trend of the figure's box centre and height over the 5 s; front view: sideways travel of the swing foot):
  | Video / view | swing foot (px per frame, + = towards the face) | planted foot (+ = towards the face) | walks forwards? | sideways drift over 5 s | height change |
  |---|---|---|---|---|---|
  | 2a side panel | +2.11 | -2.35 | yes | +7 px | +2.3 % |
  | 2a front panel | sideways foot travel 11.7 px per frame (try 1's front panel: 4.9) | | sideways steps | -3 px | +0.4 % |
  | 2b side | -2.29 | +2.55 | **no: backwards** | -19 px | -0.1 % |
  | try 1 side panel | -2.67 | -0.2 | no | +33 px | -1.3 % |
  | try 1 front panel | sideways foot travel 4.9 px per frame | | | -17 px | +0.3 % |
  Looked at the feet frame by frame (frames 4 to 26): 2b's swing foot moves from the front back towards the heel side while the
  planted foot slides forwards: he walks backwards, as the Human saw (my earlier "best so far" for 2b missed this). In 2a's front
  panel the feet cross over (12, 14) and step wide apart sideways (16, 18): sideways steps, as the Human saw; the box measure shows no
  drift towards the camera in size (+0.4 %), the impression of coming closer comes from the turned upper body and the sideways steps.
  2a's side panel is the only view so far that walks forwards; but its front panel does not show the same walk.
- 12:31 **Video 2c exists** (front only): `clips/video_versuch2c_vorn.mp4` (sampling 23.1 min, decode 3.7 min). Looked at 16 frames
  and the feet frame by frame: he stays frontal, same size, no drift (sideways 3 px over 5 s), hands intact; but **he does not walk**:
  the feet never leave the floor (ankle height range 5 to 6 px against 13 to 39 px in the other videos); he only sways.
  ComfyUI stopped 12:32 (by its process id); no Python process left.
- Rule table (measured; hands judged by eye): all three try-2 videos keep the figure, its size (height spread 2 to 5 %) and the
  camera angle per view (shoulder width 75 to 105 % in front views, 0 to 21 % in side views; try 1: 38 to 100 % and up to 57 %:
  turning), no doubled frames; legs not swapped in the front views. Direction and drift: 2a side panel forwards, 2a front panel
  sideways steps, 2b backwards, 2c no walk. **No video passes every rule.** For the pipeline the only view that walks forwards is
  used: **2a's side panel alone** (side-only way: sideways depth from the rest pose). Try 1's left panel turns (78 frames turned) and
  is not better.
- 12:35 Finder v2 on the exam's known motion renders (visible / hidden mean px): made-up motion clean 4.16 / 9.13, degraded 4.07 /
  9.12; run round 7 clean 1.14 / 1.85, degraded 1.09 / 1.78; game's calm walk clean 1.03 / 1.63, degraded 0.98 / 1.53. So on walks
  the finder is at the target of about 1 px; on the wild made-up poses it is not.
- **GPU busy from 12:36: finder change (one try within the cap): higher resolution**, crop 378 x 672 instead of 252 x 448 (48 x 27
  DINOv2 patches, heat maps 192 x 108), 20 epochs, `finder_v3_r48.pt`. Reason: training loss and held-out error were close (the
  finder is limited by how finely it sees, not by too few poses).
- 12:38 Unity batch run r2_fit_v2 (91 s, exit 0): exam on finder v2 landmarks and the video 2a side panel onto the rig; numbers
  in RESULT.md. Looked at the comparison clip sheet.
- 13:00 The higher-resolution training ran 6 s per step (first epoch 23 minutes; 20 epochs would take almost 8 hours). Stopped by its
  process id. Operational recovery 1 of 3 (R2), one condition changed: the batch size. Measured (`work/finder/bench_r48.py`): batch
  24 needs 21.2 GB (more than the card's 16 GB, so it spilled into system memory: 5.5 s per step); batch 12 needs 10.9 GB, 0.53 s per
  step. **GPU busy from 13:03: finder_v3_r48 restarted with batch 12, 15 epochs (about 60 minutes).**
- 13:10 Director message with the Human's verdict on 2c (2026-11-09, exact words): "Zu Video 2c: Ich finde schon, dass er geht. Man
  sieht es nur wenig weil es eben von vorne ist. Grundlegendes Problem von KI und Tiefenverständnis." Applied: 2c counts as a real,
  slight walk; my note above ("he does not walk") is corrected by the Human's verdict (the measured ankle lift of 5 to 6 px in the
  front view stays as a number: from the front the lift is small to see). 2c is not combined with a side video into two views: the
  videos are separate generations, their steps are not at the same moments, so one frame of 2c and one of 2a/2b do not show the same
  pose. Instead 2c also goes through the front-only way (depth from bone lengths) in the final Unity run, as a second result next to
  2a's side panel.
- 13:15 Director message with the Human on the views (2026-11-09, exact words): "Vorderansicht ist dazu da, dass z.b. die Beine nicht
  auf einen zentralen Punkt vor dem Körper zielen sondern ihren eigenen Pfad verfolgen. Die Schrittlänge sieht man dafür überwiegend
  in er Seitenansicht." Applied in the fit (`AeStage2Fit.cs`): for a side-only video the feet's sideways lanes come from a front view
  (2c's front view, the median ankle place from the pelvis: left +45.9 px, right -62.2 px, i.e. 15.3 and 20.8 voxels); each leg's
  shin and foot points are put on their own lane; stride length and step timing come from the side view. New check in the exam and
  the video gate: the feet's sideways spacing over the clip (min / mean / max) and how far each foot's lane wanders.
- 13:16 Unity batch run r2_fit_v2b (79 s, exit 0, with finder v2): spacing in the exam matches the truth (calm walk truth 27.6 / 27.6
  / 27.6 vox, result 27.1 / 27.6 / 28.1). Video 2a side panel with 2c's lanes: 30.9 / 36.1 / 44.9 vox (wider than today's walk at
  27.6: 2c's dwarf walks with his standing width); feet never converge. 2c front-only: 36.0 / 37.5 / 38.8 vox, steady lanes, but no
  travel can be read from the front (speed 0), small steps in place. Looked at both comparison sheets.
- 14:05 Finder v3 (higher resolution, batch 12, 15 epochs, 62 min) done: held-out visible 2.99 px (median 1.79), hidden 7.17; exam
  renders: made-up 4.40, run 1.21 to 1.22, calm walk 1.06 to 1.07. Faster per epoch (3.56 at epoch 10 against v2's 4.32) but not
  better than v2 within the time; **finder v2 stays in use**.
- 14:07 Unity batch run r2_meta (33 s, exit 0): imports the copied scripts in `AnimExam/Pipeline` (their metas). That empty run
  overwrote `work/unity/fit/stage2_tables.md`; so the fit was run once more unchanged: r2_fit_final (67 s, exit 0, same numbers).
  Final tables copied to `r2/stage2_tables.md`.
- Clips for the Human (MP4, game-camera side-by-side, scaled 2x): `clips/vergleich_heute_gegen_video2a_seite.mp4`,
  `clips/vergleich_heute_gegen_video2c_vorn.mp4`, `clips/pruefung_ruhiges_gehen_echt_gegen_finder.mp4`.
- Network check: during r2_meta (14:07) the Unity editor held only loopback connections (127.0.0.1); its licensing client
  (`Unity.Licensing.Client.exe`, Unity's own, as already reported 2026-11-08) held two HTTPS connections (35.195.230.199 and
  34.107.172.168, port 443): Unity's licence check, no project data of this order. ComfyUI listened on 127.0.0.1:8188 only, its logs
  show no outbound address; the finder and the scripts run offline (HF_HUB_OFFLINE, TRANSFORMERS_OFFLINE, no downloads). At 14:10 no
  Python, Unity or ComfyUI process of this order is running, port 8188 is closed.
- Launches (R2): Python finder training 3x (v2 30 epochs; v3 batch 24 stopped after 1 epoch; v3 batch 12), finder inference and
  evaluation 2x (v2, v3), one benchmark; ComfyUI 1x (11:10 to 12:32, hidden, 127.0.0.1); Wan generation 3x and tiled decode 3x through
  ComfyUI; Python checks (start pictures, video checks, rule measures) on the processor; Unity batch 5x (r2_compile, r2_fit_v2,
  r2_fit_v2b, r2_meta, r2_fit_final), all `-batchmode -nographics`, hidden, one at a time on the Zwerge folder; nothing touched in
  `C:/GameDev/Hearthlands-Wege`. No window on the Human's screen.
- 14:12 Commit `2649e1d` on `zwerge` (84 files, AnimExam only, not pushed): the predecessor's files (compiled and used now) and this
  run's. RESULT.md and WORKER_RESULT.md written. **Stop: Human checkpoint.**
