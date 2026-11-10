# Independent review — UR-UNREAL-STAIRREACH-V1

Reviewer task: separate read-only Claude Code subagent, requested model sonnet — not independently attested.
Verdict: PASS (no high or medium findings).

1. Scope. This order's changes are only under `Game/` (README, SPIELANLEITUNG, capture.sh, URCaptureDirector, URHUD, URPlayView, URPlayerController, URSimSubsystem, URSimGame, new `Tests/URLinkReachTests.cpp`) plus `Evidence/UR-UNREAL-STAIRREACH-V1/` in the external repo. The Studio side holds only the Worker result and this review. The `SimulationCpp/Headless/*` changes belong to the parallel order and were ignored. `python Game/Scripts/sync_sim.py check` printed `check PASS: 356 files of commit 69a1beade74d, 0 problem(s)`, so the synced Lib is unchanged. No scope violation.
2. Reachability method. `IsLinkReachable` and `RefreshUnreachable` in `URSimGame.cpp` only read the game state: `Workers->All()`, `Connectivity->RegionOf` (the rules' walker region, stairs included), `Handler->GetWorkSpots` and `IsValid`. This is the region test of the job board's nearest-worker search. No rule or tuning code was changed. The limits (topology only, busy or scared workers, the last-route rule, long paths, state as of the last tick, dig marks inside rock not listed) are documented honestly in the code comments, README and the Worker result.
3. Tasks 2 and 3.
   - The tooltip, the violet preview and the centre message before ordering are implemented.
   - After ordering there is a violet ring with a pause mark and the label "waiting: nobody can reach it". The mark leaves when the job is no longer Open or Blocked, because the list is rebuilt every tick; the LinkReach test checks reachable then built.
   - There is one event line per stair, shaft or trap install, and one summing line for dig marks.
   - Dig marks and trap installs are covered as claimed. Haul, claim, re-arm and repair are honestly listed as not covered.
4. Task 4. A pre-check refusal, orders without a success text, two orders in one frame and the paused text "order sent: waits until the game runs" are implemented as specified and tested.
5. Correction round 1: what was fixed.
   - M1 (flapping event lines) is fixed by hysteresis in `UpdateWaitingFeed`. `WaitingSeen` holds the last tick each stair, shaft or trap install was seen, and `DigSeenTick` holds the same for dig marks. An item or the dig summary is listed again only after it was absent for more than 100 ticks (10 s of game time). The new `capture_playround.log` has 4 `UR_WAIT` lines (was 11, with 7 inside one game minute). The four lines are at 18.30.56.562, .569, .599 and .614 in warp time; by the code each one needs at least 100 absent ticks, so each is at least 10 s of game time after the last sighting. New stairreach steps cover dig, unmark and dig again within 10 s, with still one summing line and one stair line. I did not recompute the exact tick gaps, because the log shows warp-time stamps only.
   - Low (refusal reasons dropped): `SetPlainToolMessage` now marks pending orders `bSilent`. Their success text stays hidden and a refusal reason still shows (`ResolveOrderMessage`). The "order sent ..." text is shown only while a non-silent order is pending. A new step covers a trap order without a Forge followed by a plain message in the same frame.
   - Low (bar text): the tool bar now reads "click a cyan or violet breakthrough ring" (seen in the new still).
   - Tooltip contradiction: an ordered ring nobody can reach now reads "already ordered, but it waits: no cinderling can reach it yet - dig a path to it first" (code at `CellValidForTool`). The regenerated `reach_ring_waiting.png` shows this text, the violet ring with the label, the single event line, the centre message and the tool bar.
   - No new stale-message case found: silent pending orders are removed when answered, and a refusal replaces the tool bar text as intended.
6. Logs after the rerun. All Automation tests are `Success`: CommandPath, GoldenReplays, LinkPrecheck (34 checks), LinkReach (19 checks, 0 failed), PlayerOrders and SyncManifestGuard. Capture runs: stairreach 0 of 18 failed, stairfix 0 of 13, tooltest 0 of 29, playround 0 of 32 steps failed with 19 `UR_PARITY ... PASS` lines. `grep -c FAIL` returns 0 in every log. All capture runs show `t.MaxFPS 60, r.VSync 1`. The earlier stairfix expectation changes remain justified.
7. Performance. `RefreshUnreachable` runs once per tick with a few region lookups per open job. The view scans the cached list per visible ring. The hysteresis map adds a few entries at most. No cost risk on large maps.
8. SPIELANLEITUNG. The stair line is plain German and correct (violet ring, all four cinderlings in the Herz-Kammer, the order waits, how to dig a path).

## Remaining findings

- Low: the 10 s hysteresis is verified by code reading and the 4-versus-11 line count, not by explicit tick gaps in the log.
- Low: the pre-order hint for the shaft tool and for the trap tool is not covered by a test; only the stair tool path is.
- Info: the Worker's open points (the exact state of the Human's failed attempt is unknown; the wording and violet colour are proposals) are stated honestly.
