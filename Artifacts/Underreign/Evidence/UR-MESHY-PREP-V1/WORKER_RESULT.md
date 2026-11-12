# UR-MESHY-PREP-V1 Worker result

verify-worker line: `PASS worker receipt a48185f5d85f0aafc6938e47ef4b2ed80ef73a2c59e13d5e68cbb58448113acc`

## Scope update received during the task (Human, via coordinator, recorded verbatim in substance)
"Healer, Scout, Ferret body jobs: keep them in the file but with status done and a note 'Meshy model already made by the Human from the original image'; add no new jobs for them except a separate item job where the original shows a held item (Scout's staff, Healer's staff) - priority 2. Brute: body job status done with the same note (shield stays on the back as modelled); keep a separate job for the hammer alone (priority 1). In the German README add one short rule: fur is painted on a smooth body (no strand geometry); thin hanging threads/veils are made later as separate transparent cards in Blender, not by Meshy - write the prompts so the body surface is smooth and threads/veils are removed or kept as a closed, compact shape."
Applied: M03 Brute body, M06 Scout body, M09 Healer body, M32 Ferret are `done` with the note; no back views for them; the Brute door job was dropped (door stays on the back); staff jobs M07, M10 and hammer M04 exist. The German README holds the fur/thread rule. Fur-surface clause is added to the prompts of Soot-moth, Kiln-ox, Ember-witch (body and back) and Ferret; Ember-witch rags/hair and the Lien-hook kilt are asked as compact closed shapes.

## Jobs: 70 total
Priority 1: 5 todo (Oath-warden body, Oath-warden shield, Brute hammer, Turret, Iron door) + 1 done (Brute body). Priority 2: 48 todo + 3 done (Scout, Healer, Ferret bodies). Priority 3: 13 todo (10 back views, brazier seal pendant, Ashen Heart sphere, drill hall chain).
By kind: 22 object, 21 item, 17 body, 10 body_back.

- M01 | p1 | todo | body | Oath-warden body (without shield)
- M02 | p1 | todo | item | Oath-warden shield (alone)
- M03 | p1 | done | body | Brute body (door on back stays, hammer removed)
- M04 | p1 | todo | item | Brute hammer (alone)
- M06 | p2 | done | body | Scout body
- M07 | p2 | todo | item | Scout prodding stick (alone)
- M09 | p2 | done | body | Healer body
- M10 | p2 | todo | item | Healer staff (alone)
- M12 | p2 | todo | body | Looter body (without sack)
- M13 | p2 | todo | item | Looter sack (alone)
- M15 | p2 | todo | body | Sapper body
- M16 | p2 | todo | item | Sapper survey pole (alone)
- M17 | p2 | todo | item | Sapper shovel (alone)
- M18 | p2 | todo | item | Sapper pickaxe (alone)
- M20 | p2 | todo | body | Pavisier body
- M21 | p2 | todo | item | Pavisier pavise shield (alone)
- M23 | p2 | todo | body | Crossbowman body
- M24 | p2 | todo | item | Crossbowman crossbow (alone)
- M26 | p2 | todo | body | Lamplighter body
- M27 | p2 | todo | item | Lamplighter lantern pole (alone, unlit)
- M29 | p2 | todo | body | Ferreter body (without cage)
- M30 | p2 | todo | item | Ferreter cage with ferrets (alone)
- M32 | p2 | done | body | Ferret
- M33 | p2 | todo | object | Flame Vent
- M34 | p2 | todo | object | Cinder Charge
- M35 | p2 | todo | object | Chain Snare base plate
- M36 | p2 | todo | item | Chain Snare chain with cuff
- M37 | p2 | todo | object | Drop Hatch closed
- M38 | p2 | todo | item | Drop Hatch single leaf
- M39 | p1 | todo | object | Turret
- M40 | p2 | todo | object | Weight Plate
- M41 | p2 | todo | object | Count Trigger
- M42 | p2 | todo | object | Brazier
- M43 | p3 | todo | item | Brazier seal pendant
- M44 | p2 | todo | object | Pillar
- M45 | p2 | todo | object | Wood door
- M46 | p1 | todo | object | Iron door
- M47 | p2 | todo | object | Bridge span (without lava)
- M48 | p2 | todo | body | Soot-moth
- M49 | p2 | todo | body | Kiln-ox
- M50 | p2 | todo | body | Ember-witch body
- M52 | p2 | todo | body | Footnote
- M53 | p2 | todo | body | Lien-hook body (without chain and hook)
- M54 | p2 | todo | item | Lien-hook chain and hook (alone)
- M56 | p2 | todo | body | Wax-surgeon body
- M58 | p2 | todo | object | Forge furnace pit
- M59 | p2 | todo | item | Forge bellows
- M60 | p2 | todo | item | Forge anvil with base
- M61 | p2 | todo | object | Forge gantry with hoist
- M62 | p2 | todo | object | Call-stone
- M63 | p2 | todo | object | Ashen Heart on plinth
- M64 | p3 | todo | object | Ashen Heart sphere (alone)
- M65 | p2 | todo | object | Nest
- M66 | p2 | todo | object | Hoard
- M67 | p2 | todo | object | Drill hall dummy
- M68 | p2 | todo | object | Drill hall weapon rack (empty)
- M69 | p2 | todo | item | Drill hall sword
- M70 | p2 | todo | item | Drill hall broad blade
- M71 | p3 | todo | item | Drill hall chain
- M72 | p2 | todo | object | Pantry coal bed
- B01 | p3 | todo | body_back | Oath-warden body, back view
- B02 | p3 | todo | body_back | Looter body, back view
- B03 | p3 | todo | body_back | Sapper body, back view
- B04 | p3 | todo | body_back | Pavisier body, back view
- B05 | p3 | todo | body_back | Crossbowman body, back view
- B06 | p3 | todo | body_back | Lamplighter body, back view
- B07 | p3 | todo | body_back | Ferreter body, back view
- B08 | p3 | todo | body_back | Ember-witch body, back view
- B09 | p3 | todo | body_back | Lien-hook body, back view
- B10 | p3 | todo | body_back | Wax-surgeon body, back view

## Findings per in-scope image
See the German overview table in MESHY_PREP_README.md (what is removed, what becomes a separate item); the exact image-specific wording is in each prompt.

## Excluded / judged out (reason)
- Floors, walls, gold vein, bedrock, lava tile, stair, shaft opening, wall trim, rally banner, Deep Dwarves, Mycelid Choir, rival heart: order scope.
- Cinderling, Brand-hound: Meshy models exist.
- Sealwright, Char-beetle, Pyre-notary, Footnote attack image: not in the order's list (Footnote attack explicitly excluded).
- Drop Hatch open pit as a whole: the pit is negative space, not a Meshy model; only the single leaf is extracted (M38).
- Forge, Drill hall as whole scenes: too many objects; split into single objects (M58-M61, M67-M71).
- Pantry beetles: removed only; no beetle job (a Char-beetle concept exists separately).
- Bridge: lava field becomes a tiling material; the chain swag under the span is removed (re-add in Blender).

## Deviations to note
- Quadrupeds Kiln-ox, Footnote and the Ferret use landscape 3:2, the moth and long items square (the order says portrait for characters, square for items). Long items (staffs, poles, pavise) stand upright in a square frame.
- Ashen Heart on plinth (M63) is a hard model (thick chain cradle); sphere alone given as M64.

## Created files (SHA-256)
- C:/GameDev/Underreign_Assets/Prompts/MESHY_PREP_BATCH.jsonl : 725ee2e61e04acbd920a33e1344de196e8b3f7c2f1f0a4a801b09d8dce35810a
- C:/GameDev/Underreign_Assets/Prompts/MESHY_PREP_README.md : 08a327be8116be52753062fbda2fa655db57951b4b222a58bbaa5eb3662492f5
- empty folder C:/GameDev/Underreign_Assets/Concepts/Meshy_Prep/ (no images created)
- Temp work files only under C:/GameDev/Underreign_Assets/AnimWork/UR-MESHY-PREP-V1 (empty) and the session scratchpad. No source image changed, nothing committed.
