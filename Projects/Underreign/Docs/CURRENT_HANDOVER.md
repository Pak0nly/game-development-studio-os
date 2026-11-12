# Underreign Current Handover

State 2026-11-12 ~13:00 local. Talk to the Human in German, plain words, no codes.

- Read `README.md`, `Docs/GAME_CONCEPT.md`, `Docs/DISCOVERY_DECISIONS.md` (UD-01..UD-85),
  `Docs/OPEN_DECISIONS.md`, DEC-041..DEC-043, and the Claude memory index.
- External repo `C:/GameDev/Underreign` (`Pak0nly/underreign`), `main` = `a8a91d9`, pushed.
  Rules version 36 (night 3: rival Heart and keeper bot, creature roles, banner stance,
  Nests 8/12/16). The Unreal game is still on rules 25; resync only by its own order
  (`Design/Planning/UNREAL_NEXT_FROM_NIGHT3.md`), after the Human's answers.
- Question page night 3 (14 questions, unanswered): https://claude.ai/artifact/TfyGXsaWnvENLpK3cY5dxq
  (localStorage key `underreign-n3-v1`).
- Image prompts: 22 phone packages https://claude.ai/artifact/2tSKc7sfaBcX8JZ22FhXVe;
  batch for Codex `C:/GameDev/Underreign_Assets/Prompts/IMAGE_BATCH_NIGHT3.jsonl` + README
  (the 49 images are made: named copies in `Concepts/Batch_Night3`, names checked against the content; the JSONL still says todo; 8.1 rival heart on hold until question 12). Human's concept images so far:
  `C:/GameDev/Underreign_Assets/Concepts/Aschenbund_Runde1` (19), `Myzelchor_Runde1` (8).
  Meshy advice given: separate shield/hammer/hook, flame as VFX, moth wings as planes;
  Meshy prep file done (UR-MESHY-PREP-V1, below). Human's Meshy models so far: Healer, Scout, Ferret (too much strand fur: advised smooth body with painted fur), Brute (shield on the back, no hammer); Spore-matron in progress (veil of threads: advised Blender cards later).
- Dispatches go through `Tools/UnderreignDispatchGate`. Do not touch Hearthlands, other
  `C:/GameDev/*` projects, MobileArc or Crime99. GPU: frame caps; training may use the GPU
  only at partial load (AMD card).

Running: UR-UNREAL-HOUND-V1 (hound with the accepted walk, development bite and idle into the Unreal game; Worker started 2026-11-12).

## Hound animations: Human verdict on UR-CREATURE-VIDEO-V4 (2026-11-12, exact)

"Gehen ist jetzt gut. Würde ich so im finalen Spiel sehen. Angriff kann auch für die Entwicklung ins Spiel rein, später nochmal angepasst werden um es energischer, gefährlicher zu gestalten. Jetzt wirkt es etwas "lustlos. Vom Ablauf her aber flüßig und nachvollziehbar."

So: V4 walk accepted (final quality); V4 bite accepted for development, to be made more energetic and dangerous later. Method of record for quadrupeds: two-camera Seedance video, two-view fit with silhouette check, rig rules, paw roll over the toe ball at contacts. Not yet in the Unreal game (needs its own order).

### Earlier request (V3 verdict, done by V4)

Human, exact: "Gehen: Nicht viel Unterschied zur Vergleichsanimation von vorher. Beide haben
ein Zucken an Oberarm(sobald der jeweilige Fuß den Boden verlässt) und Oberschenkel.(Sobald
der jeweilige Fuß den Boden berührt und Initialen Druck aufbaut.) Dies müsste
nachbearbeitet/behoben werden. Das neue läuft dabei leicht ruhiger und allgemein passend von
Form und Muskelspiel. Beißen: Besser als vorher. Hier geht er allerdings aktuell vorne etwas
zu tief runter und die Hinterpfosten kleben wieder am Boden fest. Was mich interessieren
würde ist, die gesamte Animation wie im Video, nur das das Schütteln selbst rausgeschnitten
wird. Also beißend nach vorne schnellen, absetzen und zurück setzen."

Proposed order (no new Seedance video): walk V3 = base, remove the upper-arm twitch at
lift-off and the thigh twitch at touch-down (likely the forced-lift / foot-lock blend
switching; smooth IK-FK and contact transitions); bite = full V1 bite video motion with
only the shake cut out (lunge, land, step back), hind paws allowed to move with the body,
less front drop. Workspace `C:/GameDev/Underreign_Assets/AnimWork/UR-CREATURE-VIDEO-V3`
holds the trained two-view finder (reusable). Stray folder `C:/inputs` for the Human to delete.

## Closed: UR-MESHY-PREP-V1

UR-MESHY-PREP-V1 (ChatGPT instruction file for Meshy-ready images: `C:/GameDev/Underreign_Assets/Prompts/MESHY_PREP_BATCH.jsonl` (70 image-edit jobs: remove effects and shadows, held weapons/tools/shields as separate items, Forge and Drill hall split into single objects, optional back views) and `MESHY_PREP_README.md` (German overview); Healer, Scout, Ferret and Brute bodies already modelled by the Human in Meshy (Brute keeps the shield on its back); priority 1 = Oath-warden body + shield, Brute hammer, Turret, Iron door; fur painted on smooth bodies, thin threads/veils later as Blender cards; output folder `Concepts/Meshy_Prep`; outside both Git repositories)
Independent review verdict: PASS
Worker task: a10e18d483c2723b6
Reviewer task: reviewer-UR-MESHY-PREP-V1
Candidate identity: 79ae962a086e65f0709f1daac664ecbc75acaf30d549a3cf70694f5a84f15b1b
Closure receipt: f27ac4f113f95ec62749913685df21c46b35d2e399e3e62f2814096c9a3d4979

## Closed: UR-CREATURE-VIDEO-V4

UR-CREATURE-VIDEO-V4 (hound correction after the Human's V3 verdict: walk twitch cause found (paw snapped flat/bent in one frame at lift-off and touch-down), fixed by rolling over the toe ball over 2-3 frames (upper arm jolt 18-20 -> 5-6, thigh 18 -> 1-4 deg/frame change); full V1 bite without the shake, all paws step, chest drop 29.5 -> 19 cm, reach 27.9 cm; no new video; Human verdict pending; external commit a8a91d9)
Independent review verdict: PASS
Worker task: aaa40c4dcb1b43263
Reviewer task: a1ad80c02395525ec
Candidate identity: d9a7ae08521ee0d374cffafeb269c3ec9c1923fba81c0c76ffd02f35ee7bbd67
Closure receipt: d2831bb5eea6f0f3b701a9862c72b427c61223ef613e38d228a127e8e8b94420

## Closed: UR-CREATURE-VIDEO-V3

UR-CREATURE-VIDEO-V3 (one 4 s two-camera Seedance walk video (side + front, 87,300 tokens); two-view keypoint fit plus silhouette check (IoU side 0.920, front 0.907); walk keeps the rig's anatomical stance width per the Human (front 36.9 / hind 38.7 cm vs video 43.9 / 58.8), body sway, collar change <= 3 deg/frame; bite re-transferred with a real lunge (head reach 24.9 cm, V2 8.2 cm); CPU only; Human verdict on the motion pending; external commit cedc3aa)
Independent review verdict: PASS
Worker task: a0108ffc41969b6d8
Reviewer task: af96485ba058c7c34
Candidate identity: 56be9ccd3e3d3359f416b4336ae75b972c829e7fda90a73f9fc79cf8a4dc814e
Closure receipt: 8a203f825ac6f59366d239fb5f61dace953f5c2ff9c9d597827d6c0accff259c

## Closed: UR-NIGHT-03-V1 (night shift 3)

UR-NIGHT-03-V1 (cloud night 2026-11-11/12 on night/2026-11-11, fast-forwarded into main at 4a061d2: rules 25 -> 36; rival Heart and rival keeper bot (easy/normal/hard, careful/furious) on three new maps Twin Hollows, Deep Split, Forked Commons; intruder waves become events that hit the richer realm; creature roles and rally-banner stance (attack/hold/fall back); second and third Nest raise the cap 8 -> 12 -> 16; balance proposals incl. traps at half strength against creatures; Cinder Hollow wave 3 unchanged (UD-53); 76 image prompts; 14 questions; 920 tests, MSVC build and 12 golden replays checked locally; night idle about 6.4 h after 01:08 UTC)
Independent review verdict: PASS
Worker task: cloud-task_9ed0c007-underreign-night-3
Reviewer task: ac70ecebd0128fcde
Candidate identity: e8b2d48b9972e2e30fe1485e0796f39151594d21963f06a222ca37c70453e286
Closure receipt: 20e42893fba64679a3d81ef22e1050becda6a67a6541a3a13aefe5f17be51c86
Night return receipt: f3b8c2601949cce734b0fe2b79b8d9fcc1d374e27b1a627dbe43b1f8ebc84ffc

## Closed: UR-CREATURE-CINDERLING-V1

UR-CREATURE-CINDERLING-V1 (cinderling from the Human's concept and Meshy model: 22k triangles, 2K baked maps, ember and eye glow, 22-bone rig, idle = the Human's crouch pose, walk loop; egg-round head conflicts with the bible's "never round" (sculpt later); Human verdict pending; external commit 27669b8)
Independent review verdict: PASS
Worker task: a9ebb0b4216c89825
Reviewer task: aed2a1412672d613d
Candidate identity: c7c61b3c979109e37401c31849065ebb03016a277e37959c6c793678e12bd868
Closure receipt: e007e799df3293b98ec80ecc93cb2120afc15d9a569c2ded7abaf36a892dfe4c

Next (2026-11-12): one Seedance test video with two cameras in one picture (front and side) of the fixed hound, approved by the Human ("Für morgen mit einem Video erstmal testen, ja."), fitted with keypoints plus silhouette in both views (approach from the Can It Code? videos); then decide more videos. Open for the Human: verdicts on style sample 6 (wants to see it live in motion; a viewer starter was offered), hound, cinderling. Stray folders C:/inputs, C:/frames and C:/Source/SurveyV3 for the Human to delete.

## Closed: UR-CREATURE-VIDEO-V2

UR-CREATURE-VIDEO-V2 (Seedance transfer v2: timing/body/head/tail from the video, leg placement and depth from rig rules; walk paw slide 1.19 -> 0.07 cm, parallel legs, all paws lift; bite in place (8 cm reach); shake split out (weak sideways); death not started (needs body roll in the fit); stray folders C:/inputs and C:/frames for the Human to delete; Human verdict pending; external commit 817147a)
Independent review verdict: PASS
Worker task: a9cd12fd7176467fe
Reviewer task: a0fab0dc990389f96
Candidate identity: 264b538cb5f6bcabfb5387d6fdcb5e8e94c2d75006cfe89630640cea711172f9
Closure receipt: 0c7511e146a1c657455fd2f9b3de5400f71e53fc055c1a18b0ad2a3d103e60c6

## Closed: UR-STYLE-SAMPLE-V6

UR-STYLE-SAMPLE-V6 (volumetric scattering of fire and lava light, chasm bounce and rim lights, practical lights, wetter floor and smoother metals with stronger Lumen reflections, denser sparks, dust/ash/haze/smoke, lava shimmer; light shafts mostly halos from above, dust barely visible at 1080p; GPU 10.8 ms High / 18.8 ms Epic at 30 fps; Meshy props later; Human verdict pending; external commit 94041ca)
Independent review verdict: PASS
Worker task: ae5fec310fe197966
Reviewer task: a01b538a53d46a3b0
Candidate identity: f66bbb5d0793dd752a67bc8ea7b9437ceb399f284795f509629249806c531701
Closure receipt: 8244dbd99eb9f6453cc00db41a22b728bc0834da337057ba59ba7778f18d39a3

Night shift 3 (UR-NIGHT-03-V1) was requested without the Human's explicit start and stopped by the Human ("Wieso denn schon starten? Davon hat niemand was gesagt."); the night branch has no commits; the order can be reused, extended by prompt writing (creatures, a second people, props, traps) per the Human.

## Closed: UR-CREATURE-VIDEO-V1

UR-CREATURE-VIDEO-V1 (Seedance trial: 7 videos, 762,300 tokens (~4.90 USD; pack left ~3.1 M tokens); pose finder trained on own rig renders (1.44 px mean); fit baked onto the fixed V2 rig; bite clearly better than hand-built, walk good timing but leg issues, trot noisy, gallop and death fail on the rig; recommendation hybrid; found the hand-built V2 rings jump 84-120 deg per frame (the collar spin); lesson: shorter Seedance clips to save budget; stray folder C:/inputs for the Human to delete; Human verdict pending; external commit 6a47e6e)
Independent review verdict: PASS
Worker task: aa5c3afda989d817d
Reviewer task: a2a974b047890c6db
Candidate identity: 9a0bc70001306125d949ddf50ecfeda96f52b055540cd18631cdea084437eb4f
Closure receipt: e019875f841b418429091b4f4a3316a046abdbc04ad045fbc4ea08354cb91e23

## Closed: UR-STYLE-SAMPLE-V5

UR-STYLE-SAMPLE-V5 (blur cause: world-space materials never streamed beyond 64-128 px; plus chromatic aberration and grain; fixed with full texture load (sample-only), no aberration, little grain, 16x anisotropy; neutral grade per the Human ("neutralerer Ton ist besser"); lossless stills, 1080p MP4; GPU 10.3 ms High / 17.2 ms Epic at 30 fps; Human verdict pending; external commit 569edc4)
Independent review verdict: PASS
Worker task: a1fa36864f20845c7
Reviewer task: a8323bfb2b913e83a
Candidate identity: da351d254ba61958d6142d3ff6e9c6fa1861f15bd397770d4a13b205ac5aba45
Closure receipt: 9c4d7acf71ccf4931caee17bc555c5d5f2e223af8429ace7b0a09e40b2a2b41b

## Closed: UR-STYLE-SAMPLE-V4

UR-STYLE-SAMPLE-V4 (dark charred scans chosen by measured albedo; floor of 183 irregular set-in slabs with sooty joints, broken and missing slabs; dark blood pools; braided lava streams; warm light only from fire and lava; overall still too red-orange vs the target's neutral grey-brown; GPU 10.5 ms High / 16.7 ms Epic at 30 fps; Human verdict pending; external commit d19406d)
Independent review verdict: PASS
Worker task: acb3e9999611c2655
Reviewer task: aa7a3f8df7ae1bdc2
Candidate identity: 08286de591723a35e349662db358f08610d1246eb03e436c180fc485427f28ce
Closure receipt: dbba93b06fa5e817caee63ce6918c6968fb524cd9c7cf70ebe1401b53065ca06

## Closed: UR-CREATURE-SAMPLE-V2

UR-CREATURE-SAMPLE-V2 (Brand-hound correction: paws were twisted by a control-bone roll mismatch, fixed; mouth cavity with tongue and 28 teeth, bite 47 deg; walk/trot (new)/gallop rebuilt from canine gait data; new death and bite; emissive mask limited to seams, seal, tail tip; limits: scripted, gallop choppy at 30 fps, joint pinching; Human verdict pending; external commit 683c522)
Independent review verdict: PASS
Worker task: ad0ddeacd09fd669a
Reviewer task: a68e09ae312e53752
Candidate identity: f0dbbc11e905a13c98d838118cdcddeb32bf9245b06748a681822f5aa9371ead
Closure receipt: f14558ba4ab8fcda9a032d8054477c22d8c97988073a6956f556f7e57af8a242

## Closed: UR-CREATURE-SAMPLE-V1

UR-CREATURE-SAMPLE-V1 (Brand-hound benchmark from the Human's ChatGPT concept and Meshy model: game mesh 52k triangles with baked 4K maps and emissive mask, 41-bone rig incl. collar and four ring bones with baked swing, idle/walk/run/bite/hit/death at 30 fps, previews; weak points: shallow bite (no mouth cavity), emissive mask too wide, scripted motion, legs dip in death; Unreal import pending; external commit 51fc690)
Independent review verdict: PASS
Worker task: a80fd6541ac67dcad
Reviewer task: acc5b2c1548b60ad0
Candidate identity: f358265402cbeea4ab93748ff224172a4f8883a5105969f4dc40a86faa0b2017
Closure receipt: 7106801de041a6704e9064851c60fedceefa6b404b9de31e593bb7c1d2c5099e

Next: Human verdict on the hound and on style sample step 3; then the hound into the style scene (and/or a step 4 for lava, slab colour, blood).

## Closed: UR-STYLE-SAMPLE-V3

UR-STYLE-SAMPLE-V3 (visual survey of all 89 scans (158 previews) before choosing; floor now clean wet slabs, cooler light, forge and anvil rebuilt; lava too regular, slabs too light/reddish, blood a stain; UD-85: third-party assets and renders may and must be viewed locally to choose and review (DEC-025 unchanged); Human verdict pending; external commit c57a221)
Independent review verdict: PASS
Worker task: a6e0410188b051134
Reviewer task: af711f71db916f2b0
Candidate identity: a3a3776333a8fe8565a1cdcfdedebcba05b01d130b9745e5df24e398831893d4
Closure receipt: 4409454ccadb28e2544d1c144820eb402fcc4c5b84c7f4cde7a127e31881d7d4

## Closed: UR-STYLE-SAMPLE-V2

UR-STYLE-SAMPLE-V2 (style sample step 2 with the Human's Megascans: scanned rock and floors, scan decals, Niagara fire/smoke/embers working, props rebuilt; clearly better than step 1 but not the target yet (floor reads blotchy, lava blobby, too orange and dark); GPU 11.9 ms High / 19.3 ms Epic at 30 fps; open: Human verdict, step 3, and whether renders containing third-party assets may be viewed for review; external commit db5c897)
Independent review verdict: PASS
Worker task: a0bd87eaaf477445b
Reviewer task: a47b4963e2776e905
Candidate identity: e0ec1826a5ffb408cab6f208800c27885ae8060d29408d3af958e966af4d74dc
Closure receipt: 11b8a4e622ee3f988179fd3bc6e7a0a210e72cab7436116c2e2085de3e9114e0

## Closed: UR-UNREAL-RULES25-V1

UR-UNREAL-RULES25-V1 (game on rules 25: build menu with Flame Vent, Cinder Charge, Chain Snare, Drop Hatch, Turret, Weight Plate, Count Trigger, wood and iron doors, bridge on lava; door states and lock toggle, revealed-trap eye, control marks, heavy marker; capture runs now capped at 30 fps (fixed-step captures had ignored the cap in earlier orders); style target images archived; OD-23 unit control / soul takeover OPEN; external commit 5ebdccb)
Independent review verdict: PASS
Worker task: a42738bb2d7156d25
Reviewer task: a5927f2c857bb0601
Candidate identity: b7ccb484b6d24f4fd394693bc169cc21e1c7a24afb33da14d95dddeb1e5e7668
Closure receipt: 6b0b9bc2f671e6f1a0aad2cb116f724b3c4c357a069f01ce2b73cdffbcb941f9

Next: the Human plays the rules-25 version (gentle bat); balance after his rounds; style sample step 2 waits for the Human's Fab login.

## Closed: UR-SIM-TRAP-REWORK-V1

UR-SIM-TRAP-REWORK-V1 (rules 25: traps fire on their own; Weight Plate (heavy intruders) and Count Trigger (Nth, 2-6); plain triggers, chains and lever removed; Turret (range 5, clear line, 10 shots, refill); bridge over lava; control effects (vent panic, longer snare hold, charge knock-back and stun, hatch drop or pit) with less damage; creatures now deal the largest damage share on every map; UD-80..UD-84; 862 tests; balance off both ways (Bellows Gallery 15 %, Inkdrip Shelf 99.7 %), waits for the Human; external commit 46653a6)
Independent review verdict: PASS
Worker task: a35a94c913ae5794d
Reviewer task: a09146411a1692231
Candidate identity: 949f6a6261018157f12203fd5fa680d9bd331f99e56d46eefd44ed41f06471ef
Closure receipt: cf5a682c530ad01a91afe3f423342276b043fa4f70155afb2e189956b01b7908

## Closed: UR-STYLE-SAMPLE-V1

UR-STYLE-SAMPLE-V1 (dark realistic style sample, environment only, separate Unreal project StyleSample with own Blender assets, no scans: mood right, surfaces look soft; readability needs outline, ground ring and unit light; GPU 10.6 ms High / 17.2 ms Epic at 30 fps; Megascans list for step 2; Human verdict pending; external commit ab94a8e)
Independent review verdict: PASS
Worker task: ac728463e59026ef3
Reviewer task: ae43f3a810ac71ccf
Candidate identity: 0a9986566e3711caca1967798ceb340c7f8e14069a1abf9f93e9daddd0287906
Closure receipt: da45c2ad5abba1b493199872a09357db5ce5abaccf913bed3e2d8f20b4b3ea6f

## Closed: UR-SIM-TRAPS-DOORS-V1

UR-SIM-TRAPS-DOORS-V1 (rules 24: trap parts hidden until fired in sight, spotted or reported; Brutes bash only revealed parts on their route, Sapper is the breaker, at most one breaker type per map and none in wave 1; lockable wood/iron doors; entrance keep-out removed; UD-79 realm vs realm; 906 tests; bot: Cinder Hollow 42 % -> 96 %, Crownkiln 66 % -> 14 % (balance after the trap rework and the Human's rounds); external commit bd397f6)
Independent review verdict: PASS
Worker task: afe4c46464f0ca683
Reviewer task: ac9b57bb643275cf2
Candidate identity: f944427406e5b90d5ca2e0015174fe9941746aeaffd996c833909f2a60975a1a
Closure receipt: 2d39c7ba73bdb8b5eb0161692d40e228b6725b40f89d4f3d631b7be67a9869e0

## Closed: UR-UNREAL-NIGHT2-V1

UR-UNREAL-NIGHT2-V1 (game on rules 22 (d8a890a): placeholders and plain tooltips for the four new creatures, six new intruder types and ferrets, lava, map choice with "Random map" first, no banner hint; parity on four maps; external commit 1b5c82a)
Independent review verdict: PASS
Worker task: a4dc452c2c40c8ddf
Reviewer task: a57df841e223a1991
Candidate identity: 8ee8afac918e92488efba3c9ddb00d0b6f134079376381eb95c15348c5f342bd
Closure receipt: 4be66706c2e22223f62a75492e2ca0891daf35f1cd0e8a1e384616d3a7d61867

## Closed: UR-SIM-ROUND7-V1

UR-SIM-ROUND7-V1 (rules 23: cinderlings flee after 0.4 s (deaths 0.29 per game), crossbow special flee rule removed, gold batches default, Flame Vent heat halved by the Pavisier's shield, Ember-witch needs a clear line; UD-56..UD-78 and OD-19..OD-22 recorded; Ashthread Drift 45 % -> 23 % under batches (an escaping scout reports traps; expected to change with hidden traps); external commit e54c061)
Independent review verdict: PASS
Worker task: a0ca9f329d80045b2
Reviewer task: aaf5cdc281d934056
Candidate identity: acdee902ee58bc391ff62d8237973dc81dd3c778ac4511030aa556b3c965920d
Closure receipt: 02d07d912c13cd0f742582f757b6eef50b42788f2509b9f8fb6ec1ed822543a2



## Closed: UR-NIGHT-02-V1 (night shift 2)

UR-NIGHT-02-V1 (cloud night 2026-11-10/11 on night/2026-11-10, fast-forwarded into main at d8a890a: rules 7 -> 22; four new Ashen Pact creatures (Kiln-ox, Lien-hook, Wax-surgeon, Footnote), five new intruders (Sapper, Pavisier, Crossbowman, Lamplighter, Ferreter) only on new maps, safe flight for cinderlings (deaths 6.9 -> 0.03 per game), cinderlings keep away from live entrances, lava, four new test maps; Cinder Hollow waves unchanged (UD-53); 891 tests, MSVC build and all golden replays checked locally; 35 questions for the Human)
Independent review verdict: PASS
Worker task: cloud-task_10252486-underreign-night-2
Reviewer task: a2aaaf00c665f6e22
Candidate identity: 1638528cca04bb5974f81911b3b99f892929ef9278dfb597a12d91ce6ea7ac65
Closure receipt: dda0a5628a3c055124dcf90590c4d7eb5eb46ee1e9a5cc18ad58c68285bce0aa
Night return receipt: d1301dc1ee5cbddf0839e5c4a21f91da75319e62caa5e9702cb27e32ca3d3b5d

## Closed: UR-NIGHT-PREP-02-V1

UR-NIGHT-PREP-02-V1 (design snapshot refreshed from Studio b301593; night order placed at Night/UR-NIGHT-02-V1; external commit 498a303)
Independent review verdict: PASS
Worker task: a545fb32dceca6e3d
Reviewer task: ab4689424c27a8f6f
Candidate identity: 27fd14a01895fb1202afe385ea37134681e48339b61554829993eae7dff09788
Closure receipt: 3ddfc765feaa4fdf6fb49dfb295df6a44e55e40a6f2ee1be6f950b4baf645ced

## Closed: UR-COMMANDS-V1

UR-COMMANDS-V1 (rules 7: rally banner (G place/move, L lift; free, proposal) and alarm (creatures with nothing to do attack intruders on claimed ground within 20 steps); game resynced to rules 7 with parity; summon button shows the rising price; UD-54, UD-55, OD-18 recorded; reasonable bot 41 % (alarm), wave 3 unchanged; external commits f304732 and 2ddc6f0)
Independent review verdict: PASS
Worker task: a99625ac9ecd1301b
Reviewer task: a5a27cad2165772b8
Candidate identity: b15cb060cec2bb73525ff7a4196fec459e41b1a3d1d5525cc925a8bcb5a14213
Closure receipt: 78eafceeaa69d4c1421d49e4a9a04a4dcdf911a5a12a2a8f603112957ba4bc80

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
