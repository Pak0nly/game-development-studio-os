# UR-MESHY-PREP-V1 independent review (QA Lead)

Verdict: PASS

## Checks
1. SHA-256 of MESHY_PREP_BATCH.jsonl (725ee2e6...810a) and MESHY_PREP_README.md (08a327be...92f5) match the Worker report. JSONL parses: 70 entries, 70 unique ids, 70 unique output_file names, all source_image files exist, all outputs under C:/GameDev/Underreign_Assets/Concepts/Meshy_Prep/ with lower-case names.
2. Opened the source image and compared the prompt for 10 entries: M01 Oath-warden body, M02 shield, M03 Brute body, M04 hammer, M39 Turret, M46 Iron door, M26 Lamplighter, M15 Sapper, M50 Ember-witch, M58 Forge furnace. Each prompt names what is really in the picture (shield and hand on the viewer's right for Oath-warden; hammer and fist on the viewer's left for Brute; door stays on the Brute's back; lantern pole on the left for Lamplighter; survey pole left plus shovel and pickaxe on the back for Sapper; flame in the raised left hand of the Ember-witch; Forge parts), removes effects and held items correctly, keeps the design explicitly, and carries the Meshy framing rules (A-pose/open hands, eye-level front view, grey background, no shadow or glow, no text, 2:3 or 1:1). No redesign risk or misdescription found.
3. Scope update applied: M03, M06, M09, M32 are status done; staff jobs (M07, M10) and hammer M04 exist; smooth-surface/compact-thread clause present in the Ember-witch prompt (and per Worker in moth, ox, ferret); out-of-scope items have no jobs. No file under Batch_Night3 or Aschenbund_Runde1 has a modification time after 2026-11-12 14:30.
4. README has the German section ("Fuer den Human (Deutsch)") and the German per-image overview table.

## Informational only
- Turret prompt says "row of ten iron bolts"; the image shows about nine. Harmless.
- Quadrupeds use 3:2 landscape; this is a declared deviation.
- The Iron door prompt says "turn about 25 degrees", which the source already shows; harmless.
