# Work Order UR-NIGHT-04-V1 — Underreign night shift 4: rock wall kit and 2 m cells in Blender, size, speed and motion plans

Project: Underreign (DEC-041, DEC-043), an original dungeon-management game.
Director: Claude (orchestration only). Worker: the cloud night session.
Execution location: cloud night. Execution mode: Production. Class: Standard.

## 0. Rules you must follow all night

- **Clock gate (hard rule).** The night ends at **08:00 UTC** (09:00 local).
  Before writing `NIGHT_RESULT.md` and before ending ANY turn, run `date -u`.
  If it is earlier than **07:30 UTC**, you are NOT done: take the next open
  item (section 3), then the open-ended list (section 4). `NIGHT_RESULT.md`
  only between 07:30 and 08:00 UTC, with a plain German summary of 10–15 lines
  for the Human at the top.
- **Commit rhythm.** Commit and push at least every 45 minutes, and after
  every finished item.
- **Branch.** Work only on branch `night/2026-11-12`, cut from `main` at the
  commit you start on. Never a merge commit, never force-push, never touch
  `main`.
- **Paths.** Write only inside `ArtSource`, `Design/Planning`, `Design/Art`,
  `Evidence/UR-NIGHT-04-V1`. Everything else is read-only tonight, including
  `SimulationCpp` (read its maps and rules data, do not change rules),
  `Game`, `StyleSample`, `Simulation`, `Design/Snapshot`, `Design/Bible`,
  `Night`, `EngineComparison`, `README.md`, `.gitignore`, `.gitattributes`.
  No symlinks, no submodules.
- **Binary files.** `.blend`, `.fbx`, `.png`, `.jpg`, `.gif`, `.mp4` go
  through Git LFS (already configured in `.gitattributes`; install git-lfs in
  the container if missing and verify a pushed file is an LFS pointer). Keep
  textures at 2K or less, previews about 1280 px; no frame sequences in Git
  (only final stills, GIF/MP4).
- **Blender in the cloud.** Install Blender 4.x or newer in this container
  (official Linux tarball from blender.org or the `bpy` wheel), run it in
  background mode, render with Cycles or Eevee on the CPU. Record the exact
  version and install command in the evidence. If the install fails after
  honest attempts, report it and continue with the non-Blender items, then
  write the Blender items as ready-to-run scripts.
- **Own content only.** Only procedural or hand-built own meshes and
  textures. No downloaded models, textures, scans, HDRIs, fonts or asset
  packs; no AI services.
- **Originality (hard).** Underreign is original. Genre mechanics and common
  measures (such as a 2 m cell) are fine; never use or imitate names,
  characters, creatures, rooms, levels, art or text of any existing game
  (Dungeon Keeper, Dungeons, War for the Overworld, Evil Genius, Orcs Must
  Die, Diablo, …).
- **Decisions.** `Design/Snapshot/DISCOVERY_DECISIONS.md` plus section 1 are
  binding. Everything you design is a **proposal**; collect real choices for
  the Human in `Design/Planning/QUESTIONS_FOR_HUMAN_NIGHT4.md`
  (recommendation and 2–4 options each, plain language, no micromanagement,
  no question that the night-3 catalogue already asks).
- **Parallel subagents** for independent items are fine (never two writers on
  one file).

## 1. Newer Human statements (2026-11-12)

- Graphic walls first: "Größter Effekt wäre, wenn wir die Wände grafisch
  anlegen würden. Zumindest schonmal die Standard Wände."
- Cell size: "Ich überlege auch gerade, ob es Sinn macht, die Blöcke in ihrer
  Größe zu vergrößern. Also so, dass die Gänge nicht zu eng sind und auch
  breitere Kreaturen später hineinpassen." Then: "Ich glaube 2m wird es sein
  müssen". Direction: **2 m x 2 m cells** (today 1 m). Director proposal:
  walls about **4 m** high, drawn cut at about 0.75 of the height in the layer
  view (about 3 m), with the knife-line cap (`Design/Art/ART_DIRECTION_BRIEF.md`
  section 8.2). Rules stay in cells, so on-screen speeds double.
- Look: dark, charred, grim rock as in the style sample
  (`StyleSample/README.md`, steps 4–6: neutral grey-brown, sooty, not orange);
  the day Worker will later put the style sample's scanned rock material onto
  your meshes in Unreal. Your own procedural textures are stand-ins that must
  already read well.
- Night 3's 14 questions are still unanswered: do not build on any of them.
- Blender in the cloud (Human): "Wenn blender in der Cloude installiert werden
  kann bringt uns das eine große Menge weiter und gibt viel viel zu tun."

## 2. Goal

A complete first environment kit for 2 m cells built in Blender, proven in a
rendered section of a real map, plus the plans the day Workers need to switch
the Unreal game to 2 m cells and to real models.

## 3. Backlog (in order; commit after each)

1. **Kit standard** (`Design/Art/ENVIRONMENT_KIT_2M.md`): grid and pivot
   rules (cell 2 m, wall 4 m, cut height, floor thickness, rock between
   layers per UD-37/README), piece list, naming, triangle budgets per piece
   (with Nanite in mind but also a non-Nanite LOD), UV/texel density,
   material slots (rock face, cut cap, floor), vertex-colour masks, export
   settings for Unreal (FBX, cm, axis), collision. Plain summary first.
2. **Rock wall kit** (`ArtSource/EnvironmentKit/`): Python scripts that build
   everything repeatably, plus the `.blend` and FBX exports. Pieces: straight
   wall face, outer corner, inner corner, wall end, single pillar, and the
   solid rock block top; each 3–4 variants; rough natural rock faces that
   join seamlessly at cell borders and corners (no visible repetition in a
   row of 6 cells); full height and cut version with a flat cap face as its
   own material slot. Own tileable procedural rock textures (albedo, normal,
   roughness, AO) at 2K. CPU preview renders of every piece.
3. **Strata and states:** variants by material/vertex colour for soil, stone,
   basalt, gold vein (ore inserts in the face), bedrock edge; wall damage
   stages for breakable walls (intact, cracked, about to break) and a
   freshly dug face; rubble pile for a broken wall.
   **Crumbling by material** (Human, 2026-11-12: "Können wir die Wände
   physics based zusammenbröseln lassen abhängig von ihrem Material? Das wäre
   nochmal ein grafischer push."): for each stratum, pre-fractured versions of
   the wall pieces for Unreal's Chaos physics (Geometry Collection from
   pre-cut pieces), with a different break character per material: soil
   crumbles into soft clumps and dust, stone breaks into angular chunks,
   basalt splits into columnar shards, gold vein drops ore pieces, bedrock
   does not break. Keep piece counts low (game budget, many walls), add the
   cut cap and inner break faces as their own material slot, and render a
   short CPU physics preview per material in Blender (rigid-body collapse,
   MP4/GIF). Write the Unreal setup (fracture levels, damage thresholds,
   debris lifetime, performance limits, which hits trigger it) into
   `ENVIRONMENT_KIT_2M.md`.
4. **Floor kit:** unclaimed rough floor, claimed floor slabs (2 m cell, 2–4
   variants), dug-out rubble floor, edges where floor meets wall.
5. **Proof scene:** read `SimulationCpp/Data/Maps/cinder_hollow.map.txt` and
   build one layer section (corridors, a room, corners, a gold vein, a stair
   point) from the kit at 2 m cells in Blender by script; place simple
   stand-ins for a human intruder (1.8 m) and the Brand-hound (about 1.2 m
   long) in a corridor. Render from the game camera (about 55° down, as in
   the game) and from a lower angle, plus the same section as plain 1 m grey
   boxes for comparison, plus a short turntable or camera-pan MP4/GIF. CPU,
   sharp, about 1280 px.
6. **Size table** (`Design/Planning/SIZES_2M_CELLS.md`): every creature,
   intruder, worker, trap, door and prop in the rules (read `SimulationCpp`
   and the bible) with a proposed size in metres at 2 m cells, footprint in
   cells, whether it fits a 1-cell corridor, and notes.
7. **On-screen speed table** (`Design/Planning/SPEEDS_2M_CELLS.md`): each
   unit's rules speed converted to m/s at 2 m cells, which gait fits (walk,
   trot, run), and proposals where it would look wrong (proposals only, no
   rule change).
8. **Motion list for humanoids** (`Design/Planning/HUMANOID_MOTION_LIST.md`):
   per intruder and humanoid creature, the motions the rules actually need
   (idle, move, each attack kind, hit, death, special actions such as
   digging, carrying, casting, crossbow, shield), each marked: free Unreal
   mannequin set / likely in a sword-and-shield or two-handed pack / needs
   Seedance or hand work. Background:
   `Evidence/UR-ANIM-RETARGET-TEST-V1/WORKER_RESULT.md`.
9. **Unreal changeover plan** (`Design/Planning/UNREAL_2M_AND_KIT_PLAN.md`):
   what the game layer must change for 2 m cells and the kit (cell size,
   wall height, camera zoom and limits, markers and frames, doors, traps,
   stairs, hound scale and play rates, instancing and performance), in order,
   as ready Work Order items for day Workers.
10. **Question catalogue** `Design/Planning/QUESTIONS_FOR_HUMAN_NIGHT4.md`.

## 4. Open-ended (after section 3, until 07:30 UTC)

- More variants and polish of the kit (wall bases, overhangs, cracks, soot
  streaks, roots in soil); a stair spiral through rock at 2 m cells; shaft
  rim; door frames for wood and iron doors in a 2 m wall opening.
- Simple own props for the proof scene (rubble, pillar, brazier stand-in).
- A second proof render: another map section or the layer below seen faintly.
- Review passes on your own work (fresh subagent reviews of the scripts,
  seams, budgets, claims in the documents); fix real findings.

## 5. Evidence and result

`Evidence/UR-NIGHT-04-V1/`: a short note per item (what, numbers, paths).
`Evidence/UR-NIGHT-04-V1/NIGHT_RESULT.md` (07:30–08:00 UTC): what was done,
commits, file list, Blender version, triangle counts, render paths, open
points, German summary at the top.
