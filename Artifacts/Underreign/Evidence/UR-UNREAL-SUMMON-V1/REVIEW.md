# Independent review — UR-UNREAL-SUMMON-V1

Reviewer task: separate read-only Claude Code subagent, requested model sonnet — not independently attested.
Verdict: PASS (no high or medium findings).

1. Scope: `git status` in C:/GameDev/Underreign shows changes only under `Game/` plus the untracked `Evidence/UR-UNREAL-SUMMON-V1/`; no SimulationCpp path touched; Studio side holds only its evidence folder (WORKER_RESULT.md). `python Game/Scripts/sync_sim.py check` → "check PASS: 356 files of commit 951f93741e60, 0 problem(s)".
2. Logs: test_sim.log exit code 0, orders 45 checks 0 failed, sync guard 356 files PASS; parity reasonable seed 1 at ticks 600/1200/1800/2400 PASS (hash 93d5bd03f8c4204a), 4 of 4 hashes matched; summon 0 of 10 steps failed; summonpoor 0 of 4 failed; start check RESULT PASS, 30.0 fps average, `-URMaxFPS=30` (frame-capped).
3. Stills: summon_button_start.png shows the green button "B Cinderling +1 (75 gold) 4/10" clearly readable in the tool bar and "Cinderlings 4 / 10" in the top panel; summon_accepted.png shows 5/10, gold 426, feed "A new cinderling.", tool bar "(cinderling summoned (75 gold))".
4. Build.cs: only change is `CppCompileWarningSettings.ShadowVariableWarningLevel = WarningLevel.Off;` inside UnderreignSim.Build.cs (that module only), with a comment; it only silences a shadowed-variable warning for the unedited library copy. Harmless.

- Info: no playround rerun (disclosed; old recording invalid under rules 5, new recording is a follow-up).
- Info: the summon tool test calls PressSummon directly rather than clicking the Slate button (disclosed).
- Info: earlier tooltest/stairfix/stairreach passes have no kept logs (disclosed, not relied on).
