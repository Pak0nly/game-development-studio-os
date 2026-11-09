# Work Order UR-NIGHT-01-V1 — Underreign night shift 1: prototype plan, simulation core, game bible

Project: Underreign (DEC-041), an original dungeon-management game. Director:
Claude (orchestration only). Worker: the cloud night session. Execution
location: cloud night. Execution mode: Discovery. Class: Standard.

## 0. Rules you must follow all night

- **Clock gate (hard rule).** The night ends at **07:00 UTC** (08:00 local).
  Before writing `NIGHT_RESULT.md` and before ending ANY turn, run `date -u`.
  If it is earlier than **06:30 UTC**, you are NOT done: take the next open
  item from the backlog (section 4); when the numbered items are done, continue
  with the open-ended list (section 5). `NIGHT_RESULT.md` is written only
  between 06:30 and 07:00 UTC. Ending early wastes the Human's night.
- **Branch.** Work only on branch `night/2026-11-09`, cut from the base commit
  you start on (`main`). Commit and push after every finished item (small,
  clear commits; never a merge commit; never force-push; never touch `main`).
- **Paths.** Write only inside: `Design/Planning`, `Design/Bible`,
  `Design/Art`, `Simulation`, `Evidence/UR-NIGHT-01-V1`. Never change
  `Design/Snapshot`, `Night`, `README.md`, `.gitignore`, `.gitattributes`. No
  symlinks, no submodules.
- **No Unity.** There is no Unity in the cloud. All code is engine-free C#.
- **Language.** Repository content in English. Plain, readable words in every
  document meant for the Human (no unexplained codes; when you use an ID, give
  its title too).
- **Originality (hard rule).** Underreign is an original game. Genre mechanics
  are fine. Never use or imitate names, creatures, characters, room names,
  levels, art, music, UI look or text from any existing game (for example
  Dungeon Keeper, Dungeons, War for the Overworld, Evil Genius, Dwarf Fortress,
  Minecraft, Warcraft). Invent your own names and check them.
- **Decisions.** Everything in `Design/Snapshot/DISCOVERY_DECISIONS.md` is
  decided by the Human and must be followed. Anything new you design is a
  **proposal**: mark it so. Collect real choices for the Human in
  `Design/Planning/QUESTIONS_FOR_HUMAN.md` (each with a recommendation and
  2–4 options, plain German-friendly wording is not required, English is fine).
  Do not ask about small details; the Human dislikes micromanagement.
- **Parallel work.** You may use subagents in parallel for independent items
  (different files only; never two writers on one file).
- **Tooling.** Use the .NET SDK if present. If it is missing, you may install
  it only inside this disposable cloud container (never anything else, never
  on the Human's machine). If .NET cannot be installed, still write the code
  and the tests carefully and say so in the result.

## 1. Read first

- `Design/Snapshot/GAME_CONCEPT.md`, `DISCOVERY_DECISIONS.md`,
  `OPEN_DECISIONS.md`, `PRODUCTION_PROFILE.md`, `README.md` (project README).
- `Design/Snapshot/ArtDirection/` (image prompts and the Human's first rough
  reference images: orientation only, not approved art).

Key decisions: PC/Steam first; Unity 6000.6.4f1 later; stylised 3D; tone dark
with cheeky humour; five peoples at release (Ashen Pact, Mycelid Choir,
Drowned Court as eerie deep-sea people, Gearbound Kin as kobold tinkerers, Deep
Dwarves), Crystal Brood later; 3–5 stacked layers per map, one layer in focus;
gravity rules (water, gas, heat, collapse) in the full game; trap wiring
(trigger, link, effect) as the core trap system plus ready-made traps;
intruders learn from traps; lures and decoys in the full game; breach-proofing
from above and below; threats from above and from below; no direct creature
control for now; campaigns per people plus free play.

**Prototype (decided):** Ashen Pact; one map, three layers, about 20 minutes;
rooms Nest, Pantry, Drill Hall, Forge, Hoard plus one Call-stone; four
creatures with pay, food, sleep and mood; six trap parts (two triggers, three
effects, one trapdoor) with simple wiring; one gravity rule: **heat rises**;
three intruder types (scout, brute, healer) in three waves, they remember one
trap; win by surviving the waves, lose when the Heart is destroyed; greybox
placeholders; threats from above only.

## 2. Deliverables overview

- `Design/Planning/`: prototype plan, technical design, local Unity work
  breakdown, questions for the Human.
- `Simulation/`: engine-free C# simulation core with NUnit tests and a
  headless runner.
- `Design/Bible/`: the game bible draft for the full game.
- `Design/Art/`: art direction brief.
- `Evidence/UR-NIGHT-01-V1/`: progress log, test output, simulation reports,
  `NIGHT_RESULT.md`.

## 3. Code rules for `Simulation/`

- Plain C# compatible with Unity 6 (C# 9, .NET Standard 2.1 API surface; no
  `System.Text.Json` source generators, no `Span` tricks that Unity lacks, no
  external packages except NUnit for tests). It must later drop into
  `Assets/Underreign/Simulation` with an assembly definition unchanged.
- Projects: `Simulation/Underreign.Simulation` (class library),
  `Simulation/Underreign.Simulation.Tests` (NUnit 3), `Simulation/Underreign.Headless`
  (console runner). Asserts must be Unity-NUnit compatible (classic
  `Assert.AreEqual`, `Assert.That(x, Is.EqualTo(y))`; no `Does.Contain` on
  arrays).
- Deterministic: fixed tick, seeded random, no wall-clock time, no
  floating-point order dependence across platforms where avoidable (prefer
  integers or fixed-point for heat and timers).
- Data-driven: rooms, creatures, traps, intruders and the map as plain data
  (C# definitions or JSON files read by a tiny parser you write).

## 4. Backlog (in order; each item ends with a commit and a push)

1. **Design snapshot check and progress log.** Create
   `Evidence/UR-NIGHT-01-V1/PROGRESS.md`; log start time (`date -u`), base
   commit and each item with start/end times.
2. **Prototype plan** `Design/Planning/PROTOTYPE_PLAN.md`: goal and what it
   must prove; feature list with acceptance criteria per feature; the 20-minute
   map flow minute by minute; controls (mouse and keyboard) and layer view
   (one layer sharp, above cut away, below faintly visible, one key up/down,
   side view for shafts); greybox colour code; milestones M0–M4 with exit
   criteria; risks; what is explicitly out of scope.
3. **Technical design** `Design/Planning/PROTOTYPE_TECH_DESIGN.md`:
   simulation core vs Unity presentation split; grid model (layers × width ×
   depth, cell materials and states, claimed ground); tick and job system;
   digging and claiming; rooms (placement rules, size effects); heat model
   (sources, rising, spreading, damage, effect on creatures and intruders);
   trap graph (triggers, links, effects, re-arming, cross-layer links);
   creature needs and mood; intruder AI (goals, greed/fear/courage,
   pathfinding across layers, trapdoor drops, trap memory shared via
   survivors); waves; win/lose; save format; performance targets; how Unity
   reads the simulation each frame.
4. **Simulation core, part A:** grid and layers, materials, dig and claim
   jobs, workers, stairs and shafts between layers, pathfinding across
   layers. Tests for each.
5. **Simulation core, part B:** rooms and Call-stone, four creatures with pay,
   food, sleep and mood (leaving when unhappy), Hoard gold, Pantry food. Tests.
6. **Simulation core, part C:** heat rises (the prototype's gravity rule),
   trap wiring graph with the six prototype trap parts (two triggers, three
   effects, one trapdoor dropping intruders one layer down), re-arming by
   workers. Tests including a wired multi-layer example.
7. **Simulation core, part D:** intruders (scout, brute, healer), three
   waves from the surface, greed/fear/courage, trap memory (a survivor's known
   trap is weaker for the next wave), Heart health, win/lose. Tests.
8. **Prototype map and headless runner:** the three-layer prototype map as
   data, wave definitions, a scripted "reasonable player" bot, ASCII render
   per layer at chosen ticks, metrics (time to first room, creatures kept, gold
   flow, trap kills, Heart damage, outcome). Run at least 50 seeds; write
   `Evidence/UR-NIGHT-01-V1/SIM_REPORT.md` with tables and first tuning.
9. **Local Unity work breakdown** `Design/Planning/UNITY_WORK_BREAKDOWN.md`:
   the Work Orders the Director should run locally after the night (Unity
   project creation in `C:\GameDev\Underreign`, render pipeline proposal,
   importing `Simulation/` with an assembly definition, greybox renderer per
   layer, layer view camera, input, HUD, trap wiring UI, intruder and creature
   placeholders, build), each with scope, acceptance criteria and which can run
   in parallel.
10. **Game bible draft** `Design/Bible/` (one file per topic): world and strata;
    the five peoples plus the Crystal Brood in depth (Heart, workers, eight
    creatures each with role and needs, room looks, trap family with at least
    six trap parts each, vertical strength, play style, strengths and
    weaknesses); intruders from above (at least ten classes, expedition types,
    leaders) and threats from below (the Sleeper and its servants); rival
    peoples digging in from the side; economy (gold, food, research, upkeep);
    research tree; trap wiring catalogue (at least 30 named trap machines across
    layers); breach-proofing system (reinforced floors and ceilings, sealed
    shafts, listening posts, counter-tunnels); campaign outline per people (at
    least eight missions each, one line each) and free play; UI and HUD concept;
    controls; difficulty. Everything new is a proposal.
11. **Art direction brief** `Design/Art/ART_DIRECTION_BRIEF.md`: stylised 3D
    rules, readability from an oblique top-down camera, silhouette rules per
    people, palettes, material language per stratum, layer-view readability
    (cut-away, faint lower layer), greybox-to-art path, and the plan "one sample
    first, then the Human decides".
12. **Questions for the Human** `Design/Planning/QUESTIONS_FOR_HUMAN.md`:
    only real decisions found during the night, each with a recommendation.

## 5. Open-ended work after the backlog (until 06:30 UTC)

Repeat in this order, logging each pass in `PROGRESS.md`:

a. **Critic pass:** a fresh subagent reviews one bible file at a time for
   completeness, originality (names!), consistency with the decisions and fun;
   you fix the findings. At least one pass per bible file.
b. **Simulation depth:** more tests (aim for 150+), edge cases (collapsing
   paths, trapped intruders, workers starving), performance run on a large map
   (5 layers, 128 × 128) with timings in `SIM_REPORT.md`.
c. **Balancing rounds:** at least three tuning rounds of the prototype map
   over 200 seeds each, with before/after tables.
d. **Mission data:** the first three campaign missions for the Ashen Pact as
   map data plus ASCII previews.
e. **Trap machines:** implement five of the catalogue's cross-layer trap
   machines in the simulation with tests.
f. **Second gravity rule prepared:** water flowing down as a disabled,
   tested module for later.

## 6. Night result (06:30–07:00 UTC only)

`Evidence/UR-NIGHT-01-V1/NIGHT_RESULT.md`: what was done per item, test counts
and the exact test command output summary, simulation highlights, open
problems, files created, and the first lines of `QUESTIONS_FOR_HUMAN.md`. Then
a final commit and push on `night/2026-11-09`.

## 7. Stop conditions

Stop early only if pushing is impossible after three attempts or the base is
missing. Report the reason in `PROGRESS.md` (committed if at all possible).
Unsolvable problems are reported, never silently worked around by changing the
goal.
