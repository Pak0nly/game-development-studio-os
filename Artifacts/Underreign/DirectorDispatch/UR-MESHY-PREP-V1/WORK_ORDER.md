# Work Order UR-MESHY-PREP-V1 — ChatGPT instruction file: Meshy-ready images from the concept images

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-MESHY-PREP-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-MESHY-PREP-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-MESHY-PREP-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-MESHY-PREP-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statement (exact, 2026-11-12)

"Dazu müsste dann ChatGPT die Entsprechenden Bilder nehmen und neu erstellen, nur ohne die unpassenden Elemente. Schaue dir bitte die Bilder genau an und erstelle eine Anweisungsdatei für ChatGPT, welches sich das jeweilige Vorlagenbild nimmt und daraus die für Meshy passsenden Bilder herausarbeitet."

Context given to the Human by the Director just before: Meshy (image to 3D)
cannot separate a held weapon or tool from the hand; weapons, shields and tools
are made as separate models; fire, embers in the air, smoke and lava are VFX,
not mesh; floors, walls and lava surfaces become tiling materials (not Meshy);
stair, shaft opening and wall trim are built to grid in Blender; the rally
banner cloth is a cloth plane. The Human's earlier proposal for a first Meshy
test: Oath-warden without shield plus the shield alone. The Director's
proposed first test trio: Brute without hammer + hammer alone, Turret, Iron door.

## Source images (read-only; look at every one at full resolution)

Batch `C:/GameDev/Underreign_Assets/Concepts/Batch_Night3/` (titles and the
original prompts in `C:/GameDev/Underreign_Assets/Prompts/IMAGE_BATCH_NIGHT3.jsonl`):

- intruders: Scout, Brute, Healer, Looter, Sapper, Pavisier, Crossbowman,
  Lamplighter, Ferreter, Ferret;
- traps: Flame Vent, Cinder Charge, Chain Snare, Drop Hatch closed, Drop Hatch
  open (pit), Turret, Weight Plate, Count Trigger;
- props: Brazier, Pillar, Wood door, Iron door, Bridge over lava.

Human's own concepts `C:/GameDev/Underreign_Assets/Concepts/Aschenbund_Runde1/`:
the creatures that are in the game: Oath-warden, Soot-moth, Kiln-ox,
Ember-witch, Footnote (not the attack image), Lien-hook, Wax-surgeon; plus
Forge, Call-stone, Ashen Heart, Nest, Hoard, Drill hall, Pantry only if the
image shows a single object Meshy can model (judge each; a whole room scene is
out: say so in the list). Cinderling and Brand-hound already have Meshy
models (`C:/GameDev/Underreign_Assets/Meshy/`): skip them.

Out of scope: floors, walls, gold vein, bedrock, lava tile, stair, shaft
opening, wall trim, rally banner, Deep Dwarves, Mycelid Choir, rival heart.

## Tasks

1. Look at each in-scope image closely. For each, list what must change for a
   clean Meshy input: held or attached weapons, shields, tools, staffs,
   lanterns, bags or loose items that should be separate models; fire,
   flames, smoke, sparks, glow halos, lava pools, chains hanging free, thin
   loose cloth; cut-off body parts, perspective tilt, ground shadows,
   background props, strong rim light or baked coloured light. Keep the
   design itself exactly (shape, proportions, materials, colours, ember seams
   and emissive markings painted on the surface): only remove or isolate.
   Decide per item what becomes a separate model (each separate item gets its
   own image job), and what is simply removed (effects).
2. Write the instruction file for ChatGPT (image editing with the source
   image attached), in English, in the same style as the night-3 batch:
   - `C:/GameDev/Underreign_Assets/Prompts/MESHY_PREP_BATCH.jsonl`: one JSON
     object per output image: `id`, `title`, `source_image` (absolute path),
     `output_file` (absolute, under
     `C:/GameDev/Underreign_Assets/Concepts/Meshy_Prep/`, lower-case,
     readable names like `ur_meshy_intruder_brute_body_v1.png`,
     `ur_meshy_intruder_brute_hammer_v1.png`), `kind` (body / item / object),
     `priority` (1 = the test trio plus Oath-warden body and shield; 2 = the
     rest of the in-game set), `status: "todo"`, and `prompt`;
   - each prompt: "edit the attached image", what to remove or isolate (named
     concretely for this image), what must stay identical, and the Meshy
     rules: one subject, whole subject in frame with margin, characters in a
     neutral A-pose with open empty hands, front view at eye level with very
     little perspective, items laid out flat-on or upright in a clear 3/4 or
     side view whose shape is fully visible, plain light-grey background,
     soft even light without coloured rim light or hard shadows, no floor
     shadow, no glow halos or effects in the air (surface ember seams stay as
     painted colour), no text; portrait 2:3 for characters, square for items
     and objects;
   - optional extra job per character: a back view of the same body
     (`kind: body_back`, priority 3), for Meshy multi-view, with a note that it
     must match the front view exactly;
   - `C:/GameDev/Underreign_Assets/Prompts/MESHY_PREP_README.md`: how ChatGPT
     runs it (one image per entry, attach the source image, save under the
     exact `output_file` name, skip existing files, log failures, do not
     change prompts), and for the Human a short German section: which files go
     to Meshy together (body + its items), the test trio first.
   - a German overview table in the README: per source image, what is removed
     and what becomes a separate item, in plain words.
3. Write `Artifacts/Underreign/Evidence/UR-MESHY-PREP-V1/WORKER_RESULT.md`
   (Studio) with the verify-worker line, the list of in-scope images with your
   per-image findings, the objects you excluded and why, the number of jobs,
   and the created file paths with SHA-256.

## Limits

- Studio allowed: `Artifacts/Underreign/Evidence/UR-MESHY-PREP-V1`. Outside
  the Studio repository you may only create the two files named above under
  `C:/GameDev/Underreign_Assets/Prompts/` and the empty folder
  `C:/GameDev/Underreign_Assets/Concepts/Meshy_Prep/`. Do not change, move or
  rename any existing image or prompt file. Never touch Hearthlands or other
  `C:/GameDev/*` projects, and do not touch `C:/GameDev/Underreign`.
- No network, no image generation, no uploads. These are Underreign's own designs.
- Report instead of silently changing the goal if something cannot be solved.
- Do NOT commit or push.
