# HL-ANIM-EXAM-STAGE1-V1 progress

- verify-worker: PASS (receipt 275cc284...), exit 0.
- Read: study (sections 4 and 5), rig (DwtModel, DwsAnim, DwsFigure, DcMotion, DcProps), work state on the accepted motions.
- Point 7 housekeeping: done. 2836 files, 1030683566 bytes (about 983 MB) deleted: the f*.png frames in the
  subfolders of work/proof1..3 and the folders work/clips1..3. Kept: proof_table.tsv, proof_log.txt, view_full.png,
  the crops, work/views, window_test.png. List: logs/housekeeping_deleted_files.tsv.
- Code written in the Zwerge folder `Unity/Assets/_Project/LookTest/AnimExam` (Runtime: AeTrack, AeRig, AeRender,
  AeFit, AeChecks; Editor: AeExam). Candidate attempt started (first file written in the Zwerge folder).
- Run 1 (candidate attempt): complete end to end; inputs at 1 px per voxel, Gaussian smoothing, Euler clamp.
- Run 2 (iteration 1): video-sized inputs (360 x 640 per view), limits by nearest allowed turn, legs held by their
  joints, child joints and confidence weights in the fit, gate stills.
- Run 3 (iteration 2): peak-keeping smoothing (the run cycle is 12 frames), apron measured beyond rest, clear pokes
  (>= 5 cells); diagnostic without smoothing showed the way back itself exact.
- Run 4 (iteration 3, last): every input also scored without smoothing. Results identical to run 3 otherwise.
- All clips and stills looked at. Zwerge commit 4fd524b (40 files, AnimExam only), not pushed.
- RESULT.md, WORKER_RESULT.md written. Status: complete, stopped at the Human checkpoint.
