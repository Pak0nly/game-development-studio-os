# Independent review — UR-UNREAL-SAFESTART-V1

Reviewer task: separate read-only Claude Code subagent, requested model sonnet — not independently attested.
Verdict: PASS (no high or medium findings).

1. Scope: `git status` in C:/GameDev/Underreign shows changes only under `Game/` (bat x2, README, SPIELANLEITUNG, perf.sh, DefaultEngine.ini, new DefaultGameUserSettings.ini, URGameMode/URHUD/URCaptureDirector, Build.cs) plus `Evidence/UR-UNREAL-SAFESTART-V1/`. SimulationCpp has no diff; no rule or tuning code touched. Studio side: only `Artifacts/Underreign/Evidence/UR-UNREAL-SAFESTART-V1/` (besides the dispatch folders) is new.
2. Cap: `ApplySafeStart()` runs in `AURGameMode::InitGame`; `DefaultEngine.ini` sets `GlobalDefaultGameMode=/Script/Underreign.URGameMode`, so every `-game` start of the project uses it. `t.MaxFPS` is clamped to 10..60 (cannot be raised above 60 via `-URMaxFPS`), `r.VSync 1`, default level High (`sg.*` = 2, never Epic). Logs: default.log `UR_SAFESTART quality=high ... t.MaxFPS 60, r.VSync 1`, PERF 60.0 fps, SETTINGS sg all 2; gentle.log `quality=medium ... t.MaxFPS 30`, PERF 30.0 fps, sg all 1, res 75, `r.Lumen.HardwareRayTracing 0`, `IsRayTracingEnabled 0`, viewport 1600 x 900. Matches the claims.
3. Bats: use `%~dp0`, so they work from any directory; no offscreen/test flags; nothing destructive. `start "Underreign" /belownormal "%UE%" ...` is correct cmd syntax (title first, then switch). Gentle bat: 1600x900, 30 fps, Medium, `-URNoRT -norayTracing`, 75 percent scale.
4. Layer buttons: URHUD.cpp now builds "1 Upper - Entrance", "2 Middle - Call-stone", "3 Deep - Heart"; button width 150 to 270. The gentle still shows them fully readable and unclipped.
5. Start load: `PercentageUnusedShaderCompilingThreads=75` applied (log: "Using 6 local workers" on 24 logical cores, so it takes effect) and below-normal priority via `start /belownormal`. Documented honestly: cache was warm, cold-start effect untested, stated in WORKER_RESULT and README.
6. Docs: README.md and SPIELANLEITUNG.md (plain German) name both scripts and when to use Schonmodus. perf.sh carries an explicit WARNING header and README says never to run it on the Human's PC; capture.sh keeps `r.VSync 0` ExecCmds but no `t.MaxFPS 0` (it still gets the game-mode cap or the ExecCmds Epic levels; see Info).
7. Regressions: changed code is additive (cvar setting, logging, label text, start-check size comparison made relative to the requested size). RHI/RenderCore modules added in Build.cs; `RHIGetGPUFrameCycles`/`IsRayTracingEnabled` includes present. No simulation or rule path touched; no obvious compile or behaviour risk found (build not run by design).

- Info: the cap is applied in `InitGame`, so engine startup and map loading before that point are not capped (short, and VSync/ini defaults apply in the ini). A user passing `-ExecCmds="t.MaxFPS 0"` on the command line could still override; the bats forward `%*`, but this is intentional user action.
- Info: `Scripts/perf.sh` still runs uncapped Epic by design; warned in the script and README, not in SPIELANLEITUNG (not needed for the player).
- Info: normal bat keeps hardware ray tracing on (reported openly in WORKER_RESULT); GPU ms values are indicative only.
- Info: real focused window / real VSync and mouse clicks on layer buttons were not exercised (stated by the Worker).
