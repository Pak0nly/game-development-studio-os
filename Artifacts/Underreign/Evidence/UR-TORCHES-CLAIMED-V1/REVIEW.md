# Independent review UR-TORCHES-CLAIMED-V1 - wall torches along claimed ground

Reviewer: independent Claude subagent (did not build). Read-only, nothing committed.
External repository `C:/GameDev/Underreign` (main b5e1886, uncommitted Worker changes).

## What I looked at

- Work order and dispatch manifest; both Worker results (external and Studio).
- `git status --porcelain` and `git diff` of `URGreyboxMap.{h,cpp}` and `URCaptureDirector.{h,cpp}`.
- Images: `Evidence/UR-TORCHES-CLAIMED-V1/images/boundary_L1_t2400_off_s2_s3_s4.png`,
  `game_torch_closeup_corridor.png`; `Game/Captures/torches/after` vs `before`: `kit_l2_overview.png`,
  `kit_close_corridor.png`, `kit_l2_full.png` (after). Viewed locally only.
- Logs in `Evidence/UR-TORCHES-CLAIMED-V1/logs/` (build, test_sim, capture_wallsample_after). Tests not re-run.

## Findings

1. **Scope: OK.** Changes from this order: `Game/README.md`, four source files under `Game/Underreign/Source/Underreign`,
   new `ArtSource/Torch/`, `Game/Underreign/Content/Environment/Torch/`, `Game/Scripts/setup_torch.{py,sh}`,
   `Game/Captures/torches/`, `Evidence/UR-TORCHES-CLAIMED-V1/` - all inside the allowed paths. Nothing in `SimulationCpp`
   or `Game/Underreign/Source/UnderreignSim` changed. `M_UR_Greybox.uasset` mtime 17:03:37 (before this order's runs,
   which start ~17:48), not referenced by `setup_torch.py`: pre-existing, not part of this order.
   `ArtSource/GroundTextureTest` belongs to the parallel order and was ignored.
2. **Presentation only: OK.** `AddTorchLayer` reads `IsClaimedCell`/`CellChar`/`LiveTraps` (greybox mirror) and writes
   only its own instance lists, `TorchSpots` and point lights. Capture code reads sim flags (`GetFlags`, `GetMaterial`)
   and only pauses the game for stills in the proof run. Single spacing constant `TorchSpacing = 3` with
   `-URTorchSpacing=N` (clamped 1..8). Shadow budget: 16 lights, 4 shadowed, nearest the view centre, re-ranked on move.
   Exclusions: stairs, shafts, entrance, Heart, Call-stone cells, planned/built doors. Torches rebuilt with each layer
   fill (claim gained/lost, wall dug). Placement cost 0.06 ms mean per layer.
3. **Images: OK.**
   - Boundary sheet (Layer 1, tick 2400): torches stop where the natural unclaimed tunnel starts; spacing 2 shows 4
     torches, 3 shows 2, 4 shows 1 - spacing differs as claimed. The sheet itself shows the claimed ground being lit and
     the unclaimed part dark, which makes claimed ground readable.
   - Close corridor before/after: walls go from near black to clearly lit rock; the two torches are on opposite walls but
     staggered along the corridor (not facing each other).
   - Overview after vs before: a chain of small flames traces the claimed rooms and corridors; nothing else changed.
   - Close-up: the bracket arm goes into the rock, basket clear of it; no floating or buried torch seen in any viewed image.
4. **Function check: OK (from logs).** Build `Result: Succeeded`; test_sim 8 of 8 Success, `EXIT CODE: 0`; all nine
   golden hashes equal expected (match the Worker's list); wallsample `UR_WALL RESULT PASS (0 failed)` including the
   slot rule and "torches on claimed ground of Layer 2 (43)".
5. **Info (no defect):** GPU +~1.5 ms with 4 shadowed lights in the one clean pair (measured under parallel Blender load);
   choosing 2 vs 4 shadows is a Human/Director choice the Worker reported openly. With spacing 1 (outside the asked
   2/3/4) the half-spacing shift is 0, so facing torches could occur; not required by the order. Heart room not framed
   close; coal disk bright at close range; intermittent "layer above drawn" render glitch on a first run (pre-existing
   family, not from the torches). Studio Worker result path exists as required.

Verdict: PASS
