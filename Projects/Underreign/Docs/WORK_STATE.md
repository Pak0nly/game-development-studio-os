# Underreign Work State

project_id: Underreign

## Present state - 2026-11-10

Project Underreign (working title, DEC-041). Concept approved (UD-23); catalogue
rounds 1 to 4 recorded (UD-01 to UD-33). Peoples: Ashen Pact, Mycelid Choir,
Drowned Court (eerie deep-sea people), Gearbound Kin (kobold tinkerers), Deep
Dwarves; Crystal Brood later. Prototype direction: Ashen Pact, three layers,
heat rises, greybox.

- Dispatch gate `Tools/UnderreignDispatchGate` (independent copy; external root
  `C:/GameDev/Underreign`; cloud night mode; 75 tests).
- Unity project folder `C:/GameDev/Underreign`, remote `Pak0nly/underreign`
  (private). `main` fast-forwarded to the night result `f94ca38` and pushed.
- Reference images of the peoples (rough, orientation only) in
  `Projects/Underreign/References/ArtDirection/`.

## Closed: UR-NIGHT-01-V1 (night shift 1)

UR-NIGHT-01-V1: prototype plan, technical design, Unity work breakdown,
engine-free simulation (684 tests, .NET and Mono/NUnit 3.5), 200-seed balance,
18-file game bible, art brief, questions for the Human; 980 new files on
`night/2026-11-09` in `C:/GameDev/Underreign`.
Independent review verdict: PASS
Worker task: cloud-task_6230facb-underreign-night-1
Reviewer task: a81772f980de7621c
Candidate identity: f98d497babee7b394ffe4e75907eaa17ad22f47f810364c5ce9a5b406be2d2b7
Closure receipt: d0aba6ce02136b682a7863690ad918f5451f7233b3e277b124702e964f58719a
Night return receipt: d9fc8767bccf9936492a119aaa3dc659465cdac1703a2cce7a8a28ce9f57d4da

Open from the night: balance depends on opening luck (fix proposed), creature
survival 49 % (target 70 %), heat from below about 3 % of damage, trap-first play
loses; ready variants exist for heat and traps.

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

## Earlier closures

UR-GATE-EXTERNAL-NIGHT-V1 closed 2026-11-09 (closure receipt
`4a7487c3…`); evidence in `Artifacts/Underreign/Evidence/UR-GATE-EXTERNAL-NIGHT-V1/`.

## Human checkpoint

Engine choice after the comparison (OD-11): Director recommends Unity HDRP
(nearly Unreal's look here, keeps the C# simulation and text-based tooling);
Unreal is the alternative. Waiting for the Human's choice.
