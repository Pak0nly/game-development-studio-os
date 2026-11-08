# HL-ANIM-EXAM-STAGE1-V1 Worker result

Mode: Discovery. Gate: `verify-worker` PASS (receipt 275cc284dc5658d65ca828874e22a16d4be0147b82c7b7f603cd28d667824107), exit 0.
Status: complete; stopped at the Human checkpoint. Plain-German result: `RESULT.md`; all numbers: `exam_tables.md`;
run log: `logs/exam_log.txt` (final run 4) and `logs/unity_run1.log` .. `unity_run4.log`.

## Per point

1. Known motion: made-up motion on the heavy dwarf's rig (`heavy_r2_320`, the combat sample's data): all 28 parts'
   three angles swing about the middle of their limits at 85 % of the half range, each at its own rate, pelvis
   shifting and lifted 13.9 voxels so no boot touches the ground, war axe in the right hand; plus today's accepted
   run (walk-speed round 7: `DwsStyle.ForSizeR7`, heavy, size 1, 1x). Exact per-frame turns stored as ground truth
   (`Data/gt_erfunden.txt`, `Data/gt_gehen.txt`, `AeTrack` format). 5 s at 24 frames per second.
2. Two views: Unity batch mode with an own CPU renderer (`AeRender`; no graphics device, no window, no render
   pipeline needed), front and side in one picture, 360 x 640 per view (2.7 pixels per voxel), clean and degraded
   (4 sub-frames over half a frame for motion blur, light direction and colour gains drifting, half resolution,
   noise, every ninth frame doubled).
3. Landmarks from the render: per part the joint and three own surface points, the axe's grip, knob, eye and edge,
   projected ground truth; degraded: blurred mean rounded to the half-resolution grid, doubled with the doubled
   frames; optional pixel noise 1.5 px (4.5 px where hidden behind another part in that view; about 56-60 % of
   landmark views are hidden). Doubled frames found again from the pictures alone: 13 of 13, no false finds.
4. Back onto the rig (`AeFit`): weighted triangulation; fit from the pelvis outwards (Horn best turn per part with
   its child joints, nearest turn inside the joint limits; thighs, shins and boots held by their joints because the
   rig's own leg solve does not keep their declared limits); tool bound to the right hand (its landmarks turn the
   wrist); Savitzky-Golay smoothing (7 frames); feet locked while carrying with the rig's own `DwsAnim.PlantLeg`
   (heel while rolling down, toe while lifting); travel from the pelvis. Written as a per-frame track
   (`Data/res_*.txt`), read back and played (worst 0.000 deg). Into `DwsAnim`: as a table motion like the game's
   walk table, or reduced to key poses (`AeTrack.Keys`: 60 of 120 frames within 1 deg for the made-up motion; every
   frame for the run).
5. Exam (`AeChecks`): angle error per part (own joint and world), joint position error, foot sliding, hand to grip
   and tool direction, skirt pokes and apron cut, speed against the ground. Results (mean angle / worst part mean /
   parts >= 5 deg):
   - made-up clean 0.01 / 0.11 / 0 PASS; degraded 0.75 / 1.26 / 0 PASS; clean + noise 3.29 / 5.33 (head) / 1 FAIL
     (narrow); degraded + noise 3.54 / 5.48 (head) / 2 FAIL (narrow).
   - run clean without smoothing 0.19 / 0.75 / 0 PASS; with smoothing 2.15 / 8.92 (skirt panel) / 2 FAIL; degraded
     without smoothing 1.75 / 6.37 / 1 FAIL (narrow); clean + noise 4.55 / 9.28 / 10 FAIL; degraded + noise
     4.96 / 10.43 / 12 FAIL.
   - Foot sliding 0.00 voxels in all smoothed results (0.30-0.40 without smoothing), speed error 0.00 to -0.03 %,
     skirt poke frames result 2-4 vs ground truth 1, grip mean <= 0.82 voxels and tool direction <= 1.31 deg (max
     gap before binding 4.69 voxels).
   - Proposed pass limits: see `RESULT.md` (5 deg mean per part, joint mean < 1 voxel, slide < 0.5 voxel, no frame
     with >= 5 leg cells out of the skirt, apron cut <= 0.5 voxel beyond rest, grip < 1 voxel and < 3 deg, speed
     +-2 %, limits +3 deg (legs apart), no part jump > 30 deg in 1/48 s).
   - The exam's checks on today's code motions (48 poses per second; heavy and female run round 7, heavy game walk
     1f, idles, 9 combat motions each; stagger home left out because its root turn is applied outside the pose):
     heavy run: side-front skirt panels jump up to 54 deg between poses (2603 deg/s), 1 clear poke frame, apron 1.9
     voxels; heavy game walk 1f: apron 4.4 voxels, travels 0.27 tiles/s against the game's 0.82; heavy combat:
     shield arm 22-32 deg beyond its declared limit in nearly all motions, slides shout 1.9, hit 1.5, strikes
     0.6/0.7 voxels; leader sinks (both bodies): knees through the skirt in 80/120 frames, back foot slides 41/36
     voxels (to be looked at moving); female run: 77 of 192 frames with >= 5 leg cells out of the skirt, left
     forearm up to 7.6 deg beyond its limit in every frame; female combat: skirt pokes in block 31, tired 80, shout
     11 frames. Stills: `clips/pruefung/` (props not drawn there).
6. Clips (ground truth top, way back bottom, same cameras front / side / game camera):
   `clips/erfunden_echt_gegen_rueckweg_schlecht_rauschen.gif`, `clips/erfunden_echt_gegen_rueckweg_sauber.gif`,
   `clips/gehen_echt_gegen_rueckweg_schlecht_rauschen.gif`, `clips/gehen_echt_gegen_rueckweg_sauber.gif`; inputs
   clean beside degraded: `clips/erfunden_eingabe_sauber_und_verschlechtert.gif`,
   `clips/gehen_eingabe_sauber_und_verschlechtert.gif`; stills `clips/*_bild.png`, `clips/*_eingabe_bild.png`.
7. Housekeeping: 2836 files, 1030683566 bytes (about 983 MB) deleted (the `f*.png` frames in the subfolders of
   `work/proof1..3` and the folders `work/clips1..3`); kept `proof_table.tsv`, `proof_log.txt`, `view_full.png`,
   crops, `work/views`, `window_test.png`. No safety check refused. List: `logs/housekeeping_deleted_files.tsv`.

## Launches

Four Unity launches, all `-batchmode -nographics`, hidden (`Start-Process -WindowStyle Hidden`, launcher
`tools/run_exam.ps1`), project `C:/GameDev/Hearthlands-Zwerge/Unity`, one at a time, each exit 0 (run 1 candidate
attempt; runs 2-4 the three self-directed iterations). No other Unity process on this folder; the Wege folder was
not touched. No API updater prompt (none accepted). Python (installed PIL only) used read-only to look at the
pictures. No downloads, installs or new packages.

## Commits

- Zwerge `zwerge`: `4fd524b` on `59681f9`, local, not pushed. Unrelated changes (`ProjectSettings.asset`, `Source`
  folders, `FogSample` metas) neither committed nor reverted.
- Studio: this evidence folder only (commit made after this file; its hash is in the Worker's report).

## Candidate files

`4fd524b` on `59681f9`. Candidate files (= `git diff --name-only 59681f9 4fd524b`):
- `ext:Unity/Assets/_Project/LookTest/AnimExam.meta` sha256 `e2cdaa5216732a1fc901aa624d49e48332082335bb75e4a38cdd29eb9dd32aea` 172 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data.meta` sha256 `7243d435ded518613c509ce4636332c4c628ad577b2c446b1ec1b95a121db067` 172 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/gt_erfunden.txt` sha256 `23885ffc3399f5bd1cffc83a83ce3d2abc2fd94a5cd39f3c1993686d389620b4` 144110 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/gt_erfunden.txt.meta` sha256 `b417d86d57efc3533138c2409ae63c8d03c0f000d26b7a32bbc1ec689d2fbe3b` 158 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/gt_gehen.txt` sha256 `5a58c4c455e67c84eb7aade3f3a0f7de0d38be89c1addaa076d400f3c31dfdb5` 158916 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/gt_gehen.txt.meta` sha256 `b1903f1ed6b399f54b96edeecc32c1e840ae17edce76c7fb367f8742af833ac5` 158 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_erfunden_sauber.txt` sha256 `a1520a18ae93b05551bd153c221b69c64f3b3ac7ff77e5b6b278187051a8dbbd` 150153 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_erfunden_sauber.txt.meta` sha256 `68019dfdb600600ef4c8adc4c18dc6116ac6f9d8424f7afc298d3de3e777991e` 158 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_erfunden_sauber_rauschen.txt` sha256 `e6b8cb02cd2ea196334db846e6495e975b3969709f758dcd25705281713ce9d4` 169230 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_erfunden_sauber_rauschen.txt.meta` sha256 `f1fd0af9e7f3c41a858e102834c183f6edef8785518382e16a59c58a80c1b4df` 158 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_erfunden_schlecht.txt` sha256 `860b9352d42b256f4837c9877c525d927687d5cd84653193dd94258bb926417f` 169130 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_erfunden_schlecht.txt.meta` sha256 `3fbf0bfc3af6b57d7c292c7dc8821b32ab442ae31a54a281e1062105f0835ac3` 158 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_erfunden_schlecht_rauschen.txt` sha256 `843559a53d0ea538df680e9565ec843e1acaca6530feb2916af59885d7dd6488` 169104 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_erfunden_schlecht_rauschen.txt.meta` sha256 `718059f8a20af0f06af0b95c154dc18babfd3268fcf61e33394394f3dab8b6df` 158 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_gehen_sauber.txt` sha256 `077a7cc45a85898edb6faa43b2dfa604e02d73ff3f68f45e7fc616e4db388e70` 168807 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_gehen_sauber.txt.meta` sha256 `497e495dfd20daacc557c7bedc27415148dc5e1f70407227a673e8bbb86d1577` 158 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_gehen_sauber_rauschen.txt` sha256 `4142317158d8fa3bfb974171c8167c5e28cf2109b020c37d947a9dde5a99e7cc` 169127 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_gehen_sauber_rauschen.txt.meta` sha256 `36ad8ee237c4d2ac7fccd1c9914b0e9f79dccaa6476f1dcb400f6270bdf4518e` 158 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_gehen_schlecht.txt` sha256 `48469a0cbd8e2a58e473ac205c575ec95cf6ca032ee4ceccbc0edb73b50e3194` 169210 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_gehen_schlecht.txt.meta` sha256 `f3c710dabb6a2e532c13c5fbabae9564ff32d59e3cb99574df13a90e9305a9cf` 158 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_gehen_schlecht_rauschen.txt` sha256 `678f7eb26679081dba7d931cbece04b6034e981b33f1daccb862413df51fd1b6` 169398 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Data/res_gehen_schlecht_rauschen.txt.meta` sha256 `60aadf26fd3dd28f3bf89b9aa9f56029275988beabf511670c951b36cd3e90d2` 158 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Editor.meta` sha256 `39e3fc4946ebb9a127dfb6278250ed6eb178e7573ec32d7d02b6fd8a7d42d97b` 172 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Editor/AeExam.cs` sha256 `6223d3e14492517216706d18136fbe54c5ed3f3f57fda888622ca2c9d13d1981` 44647 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Editor/AeExam.cs.meta` sha256 `01badc8364c8440c241e1630d3ced59029180a2cc71228b449e6f5c7675ff539` 59 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Editor/Hearthlands.LookTest.AnimExam.Editor.asmdef` sha256 `956116e7cdee1b8ffdcb5e88316b8004bac25d065c3aa086de9fb11697ade63c` 770 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Editor/Hearthlands.LookTest.AnimExam.Editor.asmdef.meta` sha256 `9892d688e0098506270e2f612b00a01d625ccd03995e272778692ee821cf46a8` 166 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Runtime.meta` sha256 `912c3ecf632fa98dead3310ef85c7f9f37e791a8982673bd7cb2ca33d1ecc7a0` 172 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Runtime/AeChecks.cs` sha256 `9df8fb1aadcc6405d71cec38cb12db479ad1e18e432a82eb549c13ad887f002e` 12261 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Runtime/AeChecks.cs.meta` sha256 `7b9e25188defadcca6f2e44bef4c40b986d30a584ceb75953ba8f412912c025e` 59 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Runtime/AeFit.cs` sha256 `361ba62d95de231fbcef83a809ab7089c9e9f8fa1f09fbcc0f21a5d3d7c4e0ee` 14983 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Runtime/AeFit.cs.meta` sha256 `a374bc626695d25d4770ea7ad1b2903dbafe9832e2706dffc2ef252c8c80ffe8` 59 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Runtime/AeRender.cs` sha256 `630d780d563409f1495ecd4b821c1ca54dc0a1d56015c5c9a71d42b6a3927282` 10544 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Runtime/AeRender.cs.meta` sha256 `0605d6124d9680c645eba45e8333aabab94866827e42b6b2a790919833131e06` 59 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Runtime/AeRig.cs` sha256 `c0a3a345539175df49a150252873bc5a1feb95edc157ab2c6ea48724e5c62130` 12937 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Runtime/AeRig.cs.meta` sha256 `154272cd6e0a1ed1a5572767844ab2fcb575c67ad7960bb52b61278d78c35fba` 59 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Runtime/AeTrack.cs` sha256 `18b2a7ba0ddd2c183540ddde300ce294bac30292658d40eb94e9278832bd07d9` 7269 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Runtime/AeTrack.cs.meta` sha256 `aafa86a2a194ae1ada768d52a10e9214f5b01fa2afee57c5c3f9d8e1f4ee401b` 59 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Runtime/Hearthlands.LookTest.AnimExam.asmdef` sha256 `5c4d0915a3633b414be3df0bb7578eea4072552f619313ca93e167c363cbe34a` 874 bytes
- `ext:Unity/Assets/_Project/LookTest/AnimExam/Runtime/Hearthlands.LookTest.AnimExam.asmdef.meta` sha256 `cc6217df2d048aad47b9a2744629d010e850ed256b7640af917ef06cb33df888` 166 bytes
