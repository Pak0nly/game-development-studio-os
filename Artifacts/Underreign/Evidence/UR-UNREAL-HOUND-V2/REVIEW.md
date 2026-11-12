# Independent review UR-UNREAL-HOUND-V2 (QA Lead)

Verdict: PASS

Candidate identity 8474a7f7fba60e77ff23a072bed0387978c0f7c9d877992f0803bf3d8848d5fc. All 73 listed file hashes were re-computed and match. No Unreal or Blender was started.

## Scope
- Changed paths are only the allowed ones (Game/Art/Creatures/BrandHound, Content/Creatures, Source/Underreign, Scripts, Captures, README, SPIELANLEITUNG, Evidence). git diff for SimulationCpp, UnderreignSim, StyleSample/Creatures and Design is empty.
- No rule, number or map change. HoundAttackEveryTicks = 10 in URPlayView.cpp matches BrandHound AttackEveryTicks = 10 in PrototypeContent.cpp (a game-layer copy, documented in the code).

## Code
- DrawHound is only used for the Brand-hound; new run/short-bite layers (NumLayers 3 -> 5) are additive.
- The run phase is driven by distance moved / stride (no slide); walk/run blend by smoothed speed; the first attack plays the full bite and following hits play short bites; the clip follows the hit clock by a clamped rate (max 60 %), so there are no jumps in clip time. Everything uses DtGame, which is 0 when paused (pause check 0.0000 cm).
- Safe fallback: if any of the five assets is missing, HoundMesh is cleared and the hound stays a box with a warning.
- Capture-only code (URCaptureDirector options and log lines, stats) does not affect normal play.

## Evidence
- Build Succeeded; automation 7/7 Success; gentle start PASS; hound captures PASS (3 logs, 7/7 hit ticks seen, 10/11 in the longer run).
- Frame strips: in run_legf_contacts.jpg the repaired row (H2) shows paws planted and rolling over the toes where the old row (V2) skids and over-stretches. In biteshort_loop_and_snap.jpg frames 24-5 show the pose closing smoothly into the start pose, with no pop at the loop point. The joint_velocity_table.md numbers are consistent with the report.

## Honest reporting
The report states the open problems: bites hard to see (intruder shape covers the hound), hit sync relies on seen HP drops and a copied constant, the full bite cut short twice by steps, remaining contact jolts at about 2-2.5x median (one value rose, 14.0 -> 17.2), and modest reach (12.8 cm). The "h2" Windows dialog incident is reported, with the fix.

## Informational only
- Gait feel at playback speed and visibility of bites are the Human's verdict.
- 4x run play-rate ratio is 0.79, marginally under the 0.8 aim at game speed. This is reported.
