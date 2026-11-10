# Underreign Current Handover

- Read `README.md`, `Docs/GAME_CONCEPT.md`, `Docs/DISCOVERY_DECISIONS.md`
  (UD-01 to UD-33), `Docs/OPEN_DECISIONS.md` and DEC-041.
- Night shift 1 results live in `C:/GameDev/Underreign` (`main` = `f94ca38`,
  fast-forwarded and pushed to `Pak0nly/underreign`): `Design/Planning`, `Design/Bible`,
  `Design/Art`, `Simulation`, `Evidence/UR-NIGHT-01-V1`. The Studio repository
  holds only the gate artifacts and review for the night.
- Catalogue round 5 (German): https://claude.ai/artifact/TfyGXsaWnvENLpK3cY5dxq
  ("ja" = recommendation as written; localStorage key `underreign-nacht1-v5`).
  Source questions: `Design/Planning/QUESTIONS_FOR_HUMAN.md`.
- Dispatches go through `Tools/UnderreignDispatchGate`.
- Do not touch Hearthlands files, other `C:/GameDev/*` folders, MobileArc or
  Crime99.

## Closed: UR-UNREAL-03-V1

UR-UNREAL-03-V1 (C++ rules as Unreal module synced from 2179b10, 10-tick game clock with pause and speeds, commands, greybox following the rules, dig and room tools, HUD from the state; parity with the headless runner at ticks 600-2400; external commit 75b3254)
Independent review verdict: PASS
Worker task: a552cffbfc5af9f95
Reviewer task: ae1596f7e166e7b6c
Candidate identity: bf451c25db4134f0234226cdc98cc8f1d18447ab195a9203d4189837c64690cf
Closure receipt: 2a953d7ad9e4a804cb98f7c4b68aea30333d95f8644425daae39d0e7f8af1617

## Closed: UR-SIM-CPP-PORT-V1

UR-SIM-CPP-PORT-V1 (simulation ported to C++20 in SimulationCpp/; 684 tests; parity with C# in golden replays and 200 seeds; external commit 2179b10; from now on SimulationCpp is the rules' source of truth, the C# Simulation folder is frozen as reference)
Independent review verdict: PASS
Worker task: a942e1a25ee9ab239
Reviewer task: a460a22eb4053ad8c
Candidate identity: 7e3591f57c72a190a757ceaa8b3c20a03cc081fbcc60dd19e598f2901ce4b53a
Closure receipt: a6bbe31bb5dbb7ccef5a4f90cac631f717fe40d10d9baa4f359264c42aeda370

## Closed: UR-UNREAL-SETUP-V1

UR-UNREAL-SETUP-V1 (Unreal 5.8 C++ project in Game/, greybox layers from the map file, layer camera, Slate HUD; about 217 fps; external commit 394af1d)
Independent review verdict: PASS
Worker task: a8cb32d8de387dbd9
Reviewer task: a84f293c91735180d
Candidate identity: d102067f59922f4cafc1c991c8ef17cb0495fe2cca084d5baa0c12d76af53d89
Closure receipt: 7c05866415245a61706616475b0cc0878c932e3216f9a281fb133e5839540683

## Closed: engine comparison (UD-46)

UR-ENGINE-UNREAL-V1 (same scene in Unreal 5.8 with Lumen; about 94 fps at 1080p; external commit 96ad7fe)
Independent review verdict: PASS
Worker task: a7a31ded36c7f07aa
Reviewer task: a49dc15139384a9ae
Candidate identity: 4e45d184fee51ba71462bc1090ee102fc7d32a37cbf8e669dae82ec89ea659c9
Closure receipt: b48d66fb2220cf1a9dbe6ffcc54e4ceb47418f770782073e53aa5e0d41f04bec

UR-ENGINE-UNITY-V1 (same scene in Unity URP and HDRP; about 321 / 68 fps; external commit e4c8e31)
Independent review verdict: PASS
Worker task: a5ae2c20e16df9201
Reviewer task: a49dc15139384a9ae
Candidate identity: 6d62aed1cc9b95407b3192a7adfb70bb053ff1ff046cd94fcfedcd2e73514d13
Closure receipt: 679479528af8bcacf0e6b8e2e91d9352754488a649a6083d265c215396e7ce34

Kit: UR-ENGINE-KIT-V1 (Blender kit, external commit 0c633a2; Director visual check, no review required).
Both engine sides applied two kit corrections (local lights x 4 pi; rock two-sided).
A broken Unity build-cache entry from the 12:00 power loss remains under
`%LOCALAPPDATA%\Unity\Caches\bee` (deletion awaits the Human's yes).

## Closed: UR-NIGHT-01-V1

UR-NIGHT-01-V1
Independent review verdict: PASS
Worker task: cloud-task_6230facb-underreign-night-1
Reviewer task: a81772f980de7621c
Candidate identity: f98d497babee7b394ffe4e75907eaa17ad22f47f810364c5ce9a5b406be2d2b7
Closure receipt: d0aba6ce02136b682a7863690ad918f5451f7233b3e277b124702e964f58719a
Night return receipt: d9fc8767bccf9936492a119aaa3dc659465cdac1703a2cce7a8a28ce9f57d4da

Recorded: DEC-042 (Underreign-only no-training scope for own content), UD-49 (Meshy for main modelling, Blender for adjustments, rigging, animation), UD-50; OD-06 direction decided.

Human 2026-11-10, "Ja, beides": (1) the standing commit approval (UD-35) also
covers finished and reviewed Unreal jobs (record as UD in the next decision
order; resolves OD-16); (2) the broken Unity cache entry
`%LOCALAPPDATA%/Unity/Caches/bee/9f90563c...0006` was deleted by the Director
(no Unity was running).

Next action: on the Human's go, start the C++ port of the simulation (cloud)
and the Unreal project setup with a rewritten Unreal work breakdown (local).
