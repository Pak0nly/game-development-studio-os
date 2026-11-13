# Studio copy of the Worker result (UR-GROUND-TEXTURE-TEST-V1)

verify-worker (Studio root, before any change): `PASS worker receipt 3e65223c9548ba190ae7ab1b0dcbe45727da3761d207776c4cc18a4341b6e06b`

External evidence: `C:/GameDev/Underreign/Evidence/UR-GROUND-TEXTURE-TEST-V1/`; images under `C:/GameDev/Underreign_Assets/AnimWork/UR-GROUND-TEXTURE-TEST-V1/` (outside Git). Text below is the external WORKER_RESULT.md unchanged.

# Worker result UR-GROUND-TEXTURE-TEST-V1 - natural ground textures per stratum (Blender sample, game camera)

Project Underreign (DEC-043), Worker of the Claude-directed order, Production mode, Standard class. Not committed, not pushed.
Gate: `verify-worker` printed `PASS worker receipt 3e65223c9548ba190ae7ab1b0dcbe45727da3761d207776c4cc18a4341b6e06b` before any change.
Local Blender 5.2.3 only (background, below-normal priority, no window, CPU, 14 threads); Unreal was not started, `Game/` not touched.
External repository `C:/GameDev/Underreign` (main, HEAD b5e1886); paths relative to it unless absolute.

## Summary

One visual sample, not a game change. Untouched rock is now natural, varied and at normal brightness, each stratum its own
material; the dark charred look appears only on claimed and built ground (contrast image). Fifteen variants (five strata x A, B, C)
were chosen by eye from the licensed library, put on the current kit (UR-KIT-WALL-CONTINUOUS-V1 meshes, read-only) and rendered from
the game camera and at about 3 m. Every render and sheet was looked at before this report.

## Chosen texture sets (library folder names, `C:/GameDev/Underreign_Assets/Fab/VaultCache/FabLibrary`)

| Stratum | Variant | Library folder | Label on the sheet |
|---|---|---|---|
| Soil | A | `Wet_Soil-1364e60e` | Erde A: feuchter Humus, oliv-braun |
| Soil | B | `Cave_African_Ground_Rocky_Dirt_Medium-4935be69` | Erde B: rotbrauner Lehm, trocken |
| Soil | C | `Desert_Outback_Ground_Mud_Rocky__01-83242895` | Erde C: ockerfarbener Kies-Lehm |
| Stone | A | `Mine_Rock_Wall-ed7707c2` | Stein A: warmgrauer Schichtstein |
| Stone | B | `Icelandic_Cracked_Rock-5689cbf1` | Stein B: kühler, rissiger Blaugrau-Stein |
| Stone | C | `Gouged_Rock_Cliff-b2138d6c` | Stein C: grau-brauner Bänderstein |
| Basalt | A | `Layered_Rock_Cliff-c2efdd46` | Basalt A: graue Säulen, hell verwittert |
| Basalt | B | `Layered_Rock_Cliff-1e714f96` | Basalt B: feinrissiger Säulenbasalt |
| Basalt | C | `Layered_Rock_Cliff-468fe939` | Basalt C: blockiger Basalt, feucht glänzend |
| Gold vein | A | `Layered_Rock_Cliff-735138b2` + procedural gold veins + kit ore inserts | Goldader A: ockerbraun gebänderter Fels |
| Gold vein | B | `Layered_Rock_Cliff-b670c2b4` + veins + ore | Goldader B: dunkler Fels mit Rostbändern |
| Gold vein | C | `Gouged_Rock_Cliff-8b1aa744` + stronger veins + ore | Goldader C: grauer Fels mit Quarz-Gold-Adern |
| Bedrock | A | `Rippled_Lava_Rock-2038403b` | Urgestein A: glatter, geflossener Grauschiefer |
| Bedrock | B | `Layered_Rock_Cliff-a1d10e7b` | Urgestein B: gefalteter Gneis, rostig |
| Bedrock | C | `Coal_Mine_Wall-62ac840f` | Urgestein C: dunkelbraun-violetter Altfels |
| Floor of all rock strata | - | `Icelandic_Cracked_Rock-5689cbf1`, colour-matched to each wall variant | - |
| Reference (today) | - | `Volcanic_Stone_Wall-2cea7724` with the Stone numbers of `Game/Scripts/setup_kit.py` | Heute im Spiel: dunkler Scan (Vulkanstein) |

Per-variant numbers (brightness gain, colour, saturation, roughness, bump) are in `ArtSource/GroundTextureTest/scripts/sets.py`.
How they were chosen: a contact sheet of all 49 library surface sets with mean brightness, then side-by-side detail sheets (whole
2 x 2 m tile, 2 x 2 tiled to judge repetition, 0.5 m crop) of 21 shortlisted sets (`survey/` below). Rejected by eye: decals and
mesh atlases (corner debris, road debris, rock models), sets with a visible grid inside the tile for the walls (Gouged 8b1aa744 kept
only for gold C), moss/lichen-green sets (Sulphur, Icelandic Mossy Rock), and the very dark ones (Jagged Shale, Layered 859dbbe6 - the
style sample's chasm rock, Coal Debris, Wet Stone Ground, Lava Sand).

## Scene and scripts (`ArtSource/GroundTextureTest/scripts/`)

- `survey.py`, `survey_detail.py`, `survey_common.py` - contact and detail sheets (Pillow).
- `prep_textures.py` - 2K copies (base colour, roughness, displacement) of the chosen sets and their mean colours, written only to
  `C:/GameDev/Underreign_Assets/AnimWork/UR-GROUND-TEXTURE-TEST-V1/tex/` (outside Git).
- `sets.py` - the chosen sets and numbers. `scene.py` - the Blender scene. `make_sheets.py` - labelled sheets.
- `run_blender.py` + `shim.py` - launcher: Blender in background, below-normal priority, no window, log in `%TEMP%`.
- Run: `python run_blender.py scene.py --mode variants --stratum Stone`, `--mode reference`, `--mode contrast --stratum Stone --variant A`,
  then `python make_sheets.py --best Soil=A,Stone=A,Basalt=A,Gold=A,Bedrock=C`.

Scene: the UR-KIT-WALL-CONTINUOUS-V1 test layout (2 m cells, a 1-cell corridor, a corridor bend, a room 11 x 5 cells, a pillar,
a diagonal joint), placed by the kit's own placement code (`build_proof_scene.build_kit_section`, imported read-only) with the 4 m
wall pieces cut at 3 m as the game shows them (`WallCutRatio 0.75`); the kit's dark slate cap on the cut stays (as in the game).
Camera: pitch 70 deg, horizontal FOV 65 deg, distance 17 m (8.5 cells); close view about 3 m from the room's north wall.
Light: neutral grey ambient plus one soft high key light and a weak cool fill, no torches, AgX, exposure +0.6.
Material: triplanar (weights |n|^6) at the scan's real 2 x 2 m size with texture bombing - each projection is offset by a random
amount per 2.7 m Voronoi patch; a second layer (3.5 m patches) covers the patch edges with a 0.35 m soft band and 3 m noise patches;
a 6-9 m brightness variation of +-15 %. Walls keep the scan upright (strata stay horizontal); soil floors also turn each patch.
Rock floors use the calm floor scan colour-matched to the wall variant (the cliff scans laid flat read as planks - see below).
Gold veins: thin warped Voronoi-edge lines, metallic gold with a faint quartz halo, broken up by noise, plus the kit's ore inserts.
Claimed half (contrast): world x >= 14 m; walls charred and sooted (strongest at the top), ember glow in low cracks near the floor,
the kit's claimed basalt slabs with ember inlays, worked pillars, an iron door, a brazier.

## Images (all checked by eye)

Sheets (`C:/GameDev/Underreign_Assets/AnimWork/UR-GROUND-TEXTURE-TEST-V1/sheets/`), each tile 1600 x 900:

- `sheet_Soil.jpg`, `sheet_Stone.jpg`, `sheet_Basalt.jpg`, `sheet_Gold.jpg`, `sheet_Bedrock.jpg` - top row A, B, C from the game
  camera; bottom row the same variants at about 3 m.
- `sheet_overview.jpg` - best variant of every stratum plus today's dark scan, game camera; `sheet_overview_close.jpg` - the same at 3 m.
- `sheet_contrast_Stone_A.jpg` - the same section, left untouched natural rock, right claimed and built.
Single renders (PNG, 1600 x 900): `.../renders/<Stratum>_<A|B|C>_<game|close>.png`, `Reference_<game|close>.png`,
`Contrast_Stone_A_game.png`. Survey sheets: `.../survey/survey_sheet.jpg`, `detail_soil.jpg`, `detail_stone.jpg`, `detail_hard.jpg`,
`detail_gold.jpg`.

## What I saw (and what was corrected on the way)

- First render: with full 4 m walls the rock tops at 4 m had the same rock texture as the floor and could not be told apart from
  the floor from the game camera; switched to the game's 3 m cut with the dark cap. A hard low key light threw long shadows over
  half the room; softened to a mostly ambient light.
- Plain triplanar showed the 2 m tile as a regular grid of stripes on the floor; fixed by texture bombing (no repeat visible now).
- The cliff scans laid flat on the floor read as wooden planks (basalt) or a woven parquet when each patch was turned; the rock
  floors now use one calm cracked-rock scan, colour-matched to the wall. Effect: in a stratum the three floor variants look alike;
  the walls carry the difference.
- Basalt B and C first came out too dark; raised. Bedrock looked wet and smeared with strong highlights; made less glossy.
  The first gold veins had wide whitish halos that looked painted; thinned.
- The first contrast image charred the walls only half; strengthened until the claimed walls read as black charred rock.
- Final state: no visible tiling at game distance, no colour jumps at the wall seams, all strata at a normal mid brightness; the
  reference (today's scan) is clearly darker than every new variant. The five chosen strata are told apart at a glance in the
  overview: olive-brown earth, warm grey stone, grey column basalt, ochre rock with gold flecks, dark brown-violet bedrock.

## Recommendation per stratum

- **Soil: A** (olive-brown humus) - the most natural earth, lively at game distance. C is a good drier alternative; B is red clay
  and very even (reads flat from the game camera).
- **Stone: A** (warm grey layered stone) - clearly stone, clearly different from soil and basalt. B (cool blue-grey) is a good
  alternative if stone should be cooler; C is close to A and less distinct.
- **Basalt: A** (grey columns) - the column grain fits the kit's basalt shape and stays readable; B and C are darker and busier.
- **Gold vein: A** (ochre banded rock) - reads as gold-bearing from the game camera thanks to the warm colour and the ore inserts.
  B is the better choice if gold veins should sit inside darker rock; C is grey and the least gold-like.
- **Bedrock: C** (dark brown-violet old rock) - darkest of the natural set, reads as "hard, old, do not dig", still not charred.
  B (folded gneiss) is the alternative; A (smooth grey) is pleasant but looks furry up close.

## Open points

- Close views of bedrock (all three) look soft and smeared on the large smooth bedrock faces (the triplanar blend on slanted planes);
  fine at game distance, worth a look if the camera may zoom in.
- The cut cap is the kit's dark slate, as in the game; it covers a large part of the image. Whether the top of untouched rock
  should be lighter too is a separate question for the Human.
- The claimed look here is charring plus the kit's slabs and a few props; real dressed faction walls do not exist in the kit yet.
- The brightness and colour numbers are Blender numbers under a neutral test light; Unreal's material instances and the game's
  torch light will need their own tuning when a later order brings the chosen direction into the game.
- Renders use 48 samples (64 for the contrast) with denoising; some faint denoiser softness in dark corners.
- `Game/Underreign/Content/Greybox/M_UR_Greybox.uasset` shows as modified in the game repository; that is not from this order
  (the parallel Unreal order); I did not touch it.

## Files

Written: `ArtSource/GroundTextureTest/scripts/*` (9 scripts), this file. Outside Git: renders, sheets, survey sheets and 2K texture
copies under `C:/GameDev/Underreign_Assets/AnimWork/UR-GROUND-TEXTURE-TEST-V1/` (the temporary survey tile cache was deleted; no
frame folders were made). No licensed texture is in the repository. Nothing committed or pushed.
