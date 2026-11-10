# Work Order UR-NIGHT-02-V1 — Underreign night shift 2: creatures, intruders, maps, gold carrying

Project: Underreign (DEC-041, DEC-043), an original dungeon-management game.
Director: Claude (orchestration only). Worker: the cloud night session.
Execution location: cloud night. Execution mode: Production. Class: Standard.

## 0. Rules you must follow all night

- **Clock gate (hard rule).** The night ends at **08:00 UTC** (09:00 local).
  Before writing `NIGHT_RESULT.md` and before ending ANY turn, run `date -u`.
  If it is earlier than **07:30 UTC**, you are NOT done: take the next open
  item from the backlog (section 3); when the numbered items are done, continue
  with the open-ended list (section 4). `NIGHT_RESULT.md` is written only
  between 07:30 and 08:00 UTC. Ending early wastes the Human's night.
- **Branch.** Work only on branch `night/2026-11-10`, cut from the base commit
  you start on (`main`). Commit and push after every finished item (small,
  clear commits; never a merge commit; never force-push; never touch `main`).
- **Paths.** Write only inside: `SimulationCpp`, `Design/Planning`,
  `Design/Bible`, `Evidence/UR-NIGHT-02-V1`. Never change `Game`,
  `Simulation` (frozen C#), `Design/Snapshot`, `Night`, `EngineComparison`,
  `README.md`, `.gitignore`, `.gitattributes`. No symlinks, no submodules.
- **No Unreal, no GPU.** The cloud has no Unreal. The Unreal game in `Game`
  picks up your rules the next day (a local Worker resyncs it), so keep the
  rules library free of Unreal types and keep `ISimView` additions read-only.
- **C++ build in the cloud.** `SimulationCpp` is C++20 built with MSVC on the
  Human's PC. In the cloud build it with clang or gcc (install only inside this
  disposable container). Fix only genuine portability problems in the code (no
  MSVC-only constructs); keep MSVC builds working. If a test depends on
  platform behaviour, say so. Every commit must compile and all tests must pass.
- **Determinism.** Integer rules, fixed tie-breaks, everything in the state
  hash. When rules change: new golden replays, previous ones moved to
  `Data/ReplaysLegacy/rules<N>`, rules version bumped, each changed test listed
  with the reason.
- **Language.** Repository content in English. Plain, readable words in every
  document meant for the Human (no unexplained codes; when you use an ID, give
  its title too).
- **Originality (hard rule).** Underreign is an original game. Genre mechanics
  are fine. Never use or imitate names, creatures, characters, room names,
  levels, art, music, UI look or text from any existing game (for example
  Dungeon Keeper, Dungeons, War for the Overworld, Evil Genius, Dwarf Fortress,
  Minecraft, Warcraft). Invent your own names and check them.
- **Decisions.** Everything in `Design/Snapshot/DISCOVERY_DECISIONS.md`
  (refreshed tonight, includes UD-53 to UD-55) is decided by the Human and must
  be followed. Wave 3 of Cinder Hollow stays exactly as it is (UD-53). Anything
  new you design is a **proposal**: mark it so. Collect real choices for the
  Human in `Design/Planning/QUESTIONS_FOR_HUMAN_NIGHT2.md` (each with a
  recommendation and 2–4 options). No micromanagement questions.
- **Parallel work.** You may use subagents in parallel for independent items
  (different files only; never two writers on one file; only one writer in
  `SimulationCpp` rule code at a time).

## 1. Read first

`Design/Snapshot/*` (concept, decisions, open questions), `Design/Planning/`
(prototype plan, Unreal work breakdown, earlier questions), `Design/Bible/`,
`SimulationCpp/README.md` (rules 7: breakthrough points, attack goal, nearest
work, rising summon price, rally banner and alarm), the latest evidence
`Evidence/UR-COMMANDS-V1/WORKER_RESULT.md`, `Evidence/UR-SIM-WORKER-JOBS-V1/`,
`Evidence/UR-UNREAL-STATS-V1/stats_sample_golden_seed1_lost.md`.

Human feedback after two own test rounds (2026-11-10): won the first round
easily without traps with 4 cinderlings; wanted more cinderlings (now
summonable at a rising price), cinderlings that take nearby work (done), a
rally command and alarm (done; pick up and drop later). Some cinderlings died
fleeing too slowly. "Es läuft komplexer wenn man mit Fallen arbeitet und die
Räume nicht direkt um die Treppen baut."

## 2. Goal

Balancing waits until creatures and tactics are clear (UD-38). Tonight makes
creatures, intruders and maps concrete and playable in the rules, so the
Human's next rounds have real tactical choices.

## 3. Backlog (in order; commit after each)

1. **Ashen Pact creature roster (design).** `Design/Bible/CREATURES_ASHEN_PACT.md`:
   8–10 creatures for the prototype people: role, abilities, room they need,
   strengths and weaknesses, how they use heat, traps, banner and alarm, how
   they arrive (Call-stone conditions), upkeep. Plain summary table first.
2. **Intruder roster (design).** `Design/Bible/INTRUDERS.md`: 6–8 intruder
   types with distinct roles so traps and creatures need different answers
   (e.g. scouts that spot traps, sappers that dig sideways, healers, armoured
   walkers that ignore pressure plates).
3. **Rules: first new creatures.** Implement the 3–4 most important new
   creatures from item 1 in `SimulationCpp` (data-driven where the code allows),
   with tests and a 200-seed note.
4. **Rules: first new intruders.** Implement 2–3 new intruder types from item 2,
   with tests; use them in new waves only on new maps, not on Cinder Hollow's
   existing waves (UD-53).
5. **Maps.** Two or three new test maps in the map format
   (`SimulationCpp/Data/Maps`), each with fixed breakthrough points, lava,
   camp/attack goal, different shapes (e.g. long and narrow, a wide middle
   layer, a map where the Heart is high). Bot tests: 200 seeds each, note.
6. **Gold carrying.** Measure the remaining walk loop (dig, carry to the Hoard,
   back) and try 2–3 options (more gold per trip, a carry chain, a small
   cache room near veins); recommend one with numbers; implement it only if it
   is clearly better and simple, otherwise leave it as a proposal.
7. **Cinderlings fleeing.** Analyse deaths while fleeing (the stats sample shows
   most die 1–2 cells from the Heart); propose and, if clearly better, implement
   a fix (earlier flee, flee away from the intruder instead of to the Heart,
   hiding spots).
8. **Question catalogue.** `Design/Planning/QUESTIONS_FOR_HUMAN_NIGHT2.md`:
   everything the Human must decide from tonight's work, plus the eight
   unanswered full-game direction questions from night 1 (rewritten plainly),
   each with a recommendation.
9. **Unreal follow-up list.** `Design/Planning/UNREAL_NEXT_FROM_NIGHT2.md`:
   what the game layer must add to show tonight's rules (new creature and
   intruder placeholders, map selection, tooltips), as small jobs.

## 4. Open-ended (after section 3, until 07:30 UTC)

- Implement further creatures/intruders from items 1–2, each with tests.
- More maps and map variants; deeper bot tests per map.
- Bot strategies that use banner, traps and new creatures sensibly; compare.
- Campaign outline in `Design/Bible/CAMPAIGN_OUTLINE.md` (story beats, map
  order, special objectives), proposal only.
- Review passes on your own night work: re-read, fix inconsistencies, more
  tests.

## 5. Evidence and result

`Evidence/UR-NIGHT-02-V1/`: per item a short note (what, numbers, tests).
`Evidence/UR-NIGHT-02-V1/NIGHT_RESULT.md` (between 07:30 and 08:00 UTC): what
was done, commits, test counts, rules version, balance notes, open points, and
a plain German summary of 10–15 lines for the Human at the top.
