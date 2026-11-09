# Underreign Current Handover

- Read `README.md`, `Docs/GAME_CONCEPT.md`, `Docs/DISCOVERY_DECISIONS.md`
  (UD-01 to UD-33), `Docs/OPEN_DECISIONS.md` and DEC-041.
- Catalogue artifact (German, rounds 1 to 4 answered):
  https://claude.ai/artifact/TfyGXsaWnvENLpK3cY5dxq ("ja" = recommendation as
  written; localStorage key `underreign-konzept-v4`).
- Dispatches go through `Tools/UnderreignDispatchGate`.
- Unity project folder `C:\GameDev\Underreign` (no Unity project yet).
- Do not touch Hearthlands files, other `C:/GameDev/*` folders, MobileArc or
  Crime99.

## Closed: UR-GATE-EXTERNAL-NIGHT-V1

UR-GATE-EXTERNAL-NIGHT-V1 (gate gains external root `C:/GameDev/Underreign`
and cloud night mode; no budget field; 75/75 tests).
Independent review verdict: PASS
Worker task: a577e0a890a4cb7e9
Reviewer task: a71ee8999657bf6b9
Candidate identity: 3c5f4850bd0cd679eb3e996c42182c4f94f6ac0f5c97fd19a048f9d748364a20
Closure receipt: 4a7487c363271a1a9952c8ff2d9351b8a8a1e3702a6395b0bd2ae726645bb235

Next action: run UR-NIGHT-PREP-V1, validate the night manifest for
UR-NIGHT-01-V1, push `C:/GameDev/Underreign` main, start the cloud night;
in the morning fetch `night/2026-11-09` and run `verify-night-return`.
