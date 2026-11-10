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

## Closed: UR-COMMANDS-V1

UR-COMMANDS-V1 (rules 7: rally banner (G place/move, L lift; free, proposal) and alarm (creatures with nothing to do attack intruders on claimed ground within 20 steps); game resynced to rules 7 with parity; summon button shows the rising price; UD-54, UD-55, OD-18 recorded; reasonable bot 41 % (alarm), wave 3 unchanged; external commits f304732 and 2ddc6f0)
Independent review verdict: PASS
Worker task: a99625ac9ecd1301b
Reviewer task: a5a27cad2165772b8
Candidate identity: b15cb060cec2bb73525ff7a4196fec459e41b1a3d1d5525cc925a8bcb5a14213
Closure receipt: 78eafceeaa69d4c1421d49e4a9a04a4dcdf911a5a12a2a8f603112957ba4bc80

Next: night shift 2 (UR-NIGHT-02-V1, cloud, until 08:00 UTC: creatures, intruders, maps, gold carrying, fleeing, question catalogue); PC off during the night. The Human can play the current version before.

## Closed: UR-SIM-SUMMON-COST-V1

UR-SIM-SUMMON-COST-V1 (rules 6: summon price 75 + 25 per living cinderling above 4, floor 75, proposal values; ISimView exposes the price; bots check it; 750 tests; new golden replays; reasonable bot 26 %, wave 3 unchanged; external commit 6427850)
Independent review verdict: PASS
Worker task: a26850be3a33ddc75
Reviewer task: ae87bb9c8879ce51b
Candidate identity: 92a88c8060394402413048b24c763c327150376ac2473ae4b3dc4f259e43c3d1
Closure receipt: e5a252a420cd6a0cded7c971ab8837a5cd4cc600bc0bdc90663666bb1e7b072c

## Closed: UR-UNREAL-STATS-V1

UR-UNREAL-STATS-V1 (copyable round report: F9 or the end-screen button puts a Markdown block on the clipboard and writes Saved/Stats/<date-time>.md; built from the rules' metrics plus game-layer extras; function check only per the Human; external commit 76296ce)
Independent review verdict: PASS
Worker task: a8610637435667600
Reviewer task: a7b49f2a5939e666a
Candidate identity: 7ab1e9ec838bb91e28f564e048179ab075ff33a206578a477b1826fca89c32aa
Closure receipt: cb2f1d9ef2d477fa371009ac870f70e1318cd7270fefc2fabf5b5a66ac2f6ea9

## Closed: UR-UNREAL-SUMMON-V1

UR-UNREAL-SUMMON-V1 (summon cinderling: key B and green tool-bar button with cost and count, refusals in plain words, HUD "Cinderlings n / 10", cinderling tooltip shows its job; game resynced to rules 5 (951f937) with parity at ticks 600-2400; proof trimmed per the Human: "Wenn keine major changes sind braucht es nur eine Funktionsprüfung, dass es läuft."; the old playround recording no longer reaches the camp under rules 5 (follow-up); external commit 23aae72)
Independent review verdict: PASS
Worker task: aeb45d886648caa23
Reviewer task: a936a2d9629b90134
Candidate identity: 6d218a882068a6ecfc2a26368f96a73bf7ec4a7d24e5b6f581eb807ca1605365
Closure receipt: ac80d5ae60e62cf0b3c38e6bf383877a80d22edc735ccfdc5e4b813368809f44

Next: the Human plays the new version (summon, nearby-work rules). Open: a new playround recording for rules 5; gold carry walking (proposal).

## Closed: UR-SIM-WORKER-JOBS-V1

UR-SIM-WORKER-JOBS-V1 (rules 5: within a priority the nearest idle cinderling/job pair is matched first, claiming spreads outward, work area kept; dig opening: cells walked per job 7.98 -> 2.58, far-job cases 48 -> 0; 739 tests; new golden replays; reasonable bot 23 %, wave 3 unchanged per UD-53; remaining walking is the gold carry loop; external commit 951f937)
Independent review verdict: PASS
Worker task: aff436bb274b5b1bc
Reviewer task: a510eda045a9bc49a
Candidate identity: 25d842dcee3db0d3d9e62a77266aae2b8a4b916e70af187f642941a59d43754e
Closure receipt: 324897dbb4171db4a989f9cff629fbfcf5de997c0283e2b8f3cbdabc387a591f

## Closed: UR-DECISIONS-R7-V1

UR-DECISIONS-R7-V1 (UD-53: wave 3 stays unchanged, Human: "Welle 3 bleibt auf jeden Fall so wie sie ist."; first own round feedback recorded as observations)
Independent review verdict: PASS
Worker task: a10f13aac702db64d
Reviewer task: acaa0689bf76b0f1d
Candidate identity: efc0269b5f952761a49d796f14e38c104eb3a46df69e82fad11ce95c44f32e82
Closure receipt: ab456a7aea21100046f2754dc8cd7b97c50125e74c8b3139ebebea9b0144a0f7

## Closed: UR-UNREAL-STAIRREACH-V1

UR-UNREAL-STAIRREACH-V1 (game layer shows when no cinderling can reach a ring, stair, shaft, trap install or dig mark, before and after ordering, with one event line per wait; tool-bar message attribution fixed; cause of the Human's stair report confirmed: cinderlings start sealed in the Heart pocket; independent review FAIL then PASS after correction round 1; external commit 2e32dd6)
Independent review verdict: PASS
Worker task: a064356d44e95db69
Reviewer task: a0498e18dfd1ecb56
Candidate identity: aafcf8eebacc000e8b733ae84533786e393ad4ddff23ea9501a0d3a6532c3dbd
Closure receipt: 543ddeb3c9f22675fe17bb9ab7cf6d9f78baf583ffec403cd04ac9c6a22beb11

Human's first own round (2026-11-10): won 18:49 without traps; wants more cinderlings (the rules have summoning, 75 gold, cap 10, but the game has no button yet) and cinderlings that take nearby work.

## Closed: UR-UNREAL-STAIRFIX-V1

UR-UNREAL-STAIRFIX-V1 (stair/shaft pre-check mirrors the rules with plain reasons; rings the rules would refuse drawn amber; success text for all tools only after the rules accept; likely cause of the Human's report found: ring 0 20 7 is accepted at start but cinderlings cannot reach it; external commit 4a7ca3a)
Independent review verdict: PASS
Worker task: a0fb491b897cdaad7
Reviewer task: a88093f0f5e450339
Candidate identity: 6106ecc7c40478a204436f67151e0069e65d38107d6699c63383397b0f22076c
Closure receipt: 42a0d156601256906692eddf36f87edcd1995965baa00b16e4650dc6d2bc7fc7

## Closed: UR-UNREAL-SAFESTART-V1

UR-UNREAL-SAFESTART-V1 (the Human's PC switches off under full GPU load: every game start now capped at 60 fps with VSync and High instead of Epic; `Game/Play Underreign (Schonmodus).bat` with 30 fps, Medium, no hardware ray tracing, 1600 x 900; fewer shader compile workers, below-normal priority; layer buttons named; external commit 1ec2cb7)
Independent review verdict: PASS
Worker task: a4b5ee081b16d9d99
Reviewer task: ac9a80ddfe74e7ff6
Candidate identity: e08e5b492671c432fed9c227420881236ffa75f32d432c1101774ac431584cf4
Closure receipt: d0d677278671bf38a286a365ebadbb422c9b011423fbb842b1fc08bd525e29cf

## Closed: UR-UNREAL-PLAYABLE-V1

UR-UNREAL-PLAYABLE-V1 (first playable version for the Human: Unreal rules module resynced to rules 4 (69a1bea) with parity at ticks 600-2400; stair/shaft tool at fixed breakthrough points, six trap parts, chain wiring across layers, show machines, remove; attack order and call back, camp and guards drawn, win/lose screen with play again; hover labels, key help, heat overlay; `Game/Play Underreign.bat` and German `Game/SPIELANLEITUNG.md`; rules and tuning unchanged; external commit 07f2f66)
Independent review verdict: PASS
Worker task: ad8e06eb4e45c1d5e
Reviewer task: a241ec2f917dc80e1
Candidate identity: 0e0f4175e8f09fd89ff0faa8f3ce826493bfaa2f29841e5846e506c27945310c
Closure receipt: 2b836531998138f14bb74d223b09c7f4bbde90eb59f58ef5e8142edfcb9aad8d

Next: the Human plays (answer to the wave-3 question was "Erst selbst spielen");
then the balance decision. Low review notes: layer buttons show map characters
"@" and "(H)" instead of names; in-game text English.

## Closed: UR-SIM-RULES-V1

UR-SIM-RULES-V1 (rules 4 in SimulationCpp: layers connect only at fixed breakthrough points, floors/ceilings unbreakable, walls breakable, attack goal after wave 3; 728 tests; new golden replays; reasonable bot win rate fell from 69 % to 23 % (Brutes now arrive bunched at the open hatch) - balance decision with the Human; external commit 69a1bea; the Unreal module still runs rules 3 and needs a resync)
Independent review verdict: PASS
Worker task: aaf7b1362bcc19483
Reviewer task: ae9c3b68fc529dabb
Candidate identity: 5e27fb39a4a03a53e3c30a9a2a07de59f92b6905313b8f76b3df1cba84703305
Closure receipt: d7bbd40411ec4481b5ecfa3da56fdde2d7c5746d417c1bcfc441645cc042d09f

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
The broken Unity build-cache entry from the 12:00 power loss was deleted on the
Human's yes (no Unity was running).

## Earlier closures

UR-GATE-EXTERNAL-NIGHT-V1 closed 2026-11-09 (closure receipt
`4a7487c3…`); evidence in `Artifacts/Underreign/Evidence/UR-GATE-EXTERNAL-NIGHT-V1/`.

## Human checkpoint

Engine decided: Unreal Engine 5.8 (DEC-043, UD-51; recorded by UR-DEC-043-V1,
receipt `9b3616c2…`). Human approved commits for reviewed Unreal jobs (OD-16, to be recorded) and the
deletion of the broken Unity cache entry (done).
Next work: simulation port C# to C++ (night) and the Unreal project setup (OD-17).
