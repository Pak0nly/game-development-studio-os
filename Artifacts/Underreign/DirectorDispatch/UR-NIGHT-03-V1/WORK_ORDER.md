# Work Order UR-NIGHT-03-V1 — Underreign night shift 3: realm against realm, combat roles, army size, balance

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
- **Branch.** Work only on branch `night/2026-11-11`, cut from `main` at the
  commit you start on. Commit and push after every finished item. Never a
  merge commit, never force-push, never touch `main`.
- **Paths.** Write only inside `SimulationCpp`, `Design/Planning`, `Design/Art`,
  `Design/Bible`, `Evidence/UR-NIGHT-03-V1`. Never change `Game`, `StyleSample`,
  `Simulation`, `Design/Snapshot`, `Night`, `EngineComparison`, `README.md`,
  `.gitignore`, `.gitattributes`. No symlinks, no submodules.
- **No Unreal, no GPU.** Build `SimulationCpp` with clang or gcc (install only
  in this container); keep MSVC compatibility (no MSVC-only or GCC-only
  constructs). Every commit compiles and all tests pass. Deterministic integer
  rules, fixed tie-breaks, all state in the hash; when rules change: new golden
  replays, previous ones moved to `Data/ReplaysLegacy/rules<N>`, rules version
  bumped, each changed test listed with the reason. Keep `ISimView` additions
  read-only and free of engine types.
- **Originality (hard).** Underreign is original. Genre mechanics are fine;
  never use or imitate names, characters, creatures, rooms, levels, art or text
  of any existing game (Dungeon Keeper, Dungeons, War for the Overworld, Evil
  Genius, Orcs Must Die, Diablo, …).
- **Decisions.** `Design/Snapshot/DISCOVERY_DECISIONS.md` (as of night 2) plus
  the newer Human decisions listed in section 1 are binding. Anything you
  design is a **proposal**; collect real choices for the Human in
  `Design/Planning/QUESTIONS_FOR_HUMAN_NIGHT3.md` (recommendation and 2–4
  options each, plain language, no micromanagement).
- **Parallel subagents** for independent items are fine (never two writers on
  one file; only one writer in `SimulationCpp` rule code at a time).

## 1. Newer Human decisions (2026-11-11, not yet in the snapshot)

- Rules now at version 25 (`SimulationCpp/README.md` has every change): cinderlings flee after 0.4 s; Crossbowmen may hunt workers; gold batches default; hidden traps (revealed only when fired in sight, spotted or reported); Brutes bash only revealed parts on their route; Sapper is the only trap breaker, at most one breaker type per map and never in wave 1; lockable wood/iron doors; entrance keep-out removed; traps fire on their own; Weight Plate (heavy intruders) and Count Trigger (Nth intruder); plain triggers, chains and lever removed; Turret; bridge over lava; control effects (panic, hold, knock-back, stun, drop/pit) with reduced damage.
- Wave 3 of Cinder Hollow stays exactly as it is (UD-53).
- **Direction (UD-79, Human quote):** "Großer Teil wird sein, dass gegen andere Herzen gekämpft wird und nicht gegen Wellen von Eindringlingen. Eindringlinge könnrn hierbei nur eine temporäre externe Gefahr sein, ein Event welches die Balance des Spiel beeinflussen kann."
- **Direction (UD-84, Human quote):** "Fokus auf unterschiedliche Kreaturen anlocken für unterschiedliche Taktikrn, geschickt einsetzen um gegnerische Taktiken zu vereiteln und Herzen zu zerstören. Fallen dienen als Verteidigungsboost um eben mit Taktik dagegen anzugehen anstatt brute force prügeleien. Auch wenn nichts gegen gelegentliche, einfache Prügeleien sprechen sollte."
- **Combat (UD-77):** creature roles, a stance at the rally banner (attack / hold / fall back), larger armies.
- Pick up and drop creatures: later (OD-18). Direct control / soul takeover: open (OD-23), not tonight.

## 2. Goal

Make realm against realm real in the rules: a rival Heart with its own
computer-run realm on test maps, creature roles and banner stance so fights
have tactics, larger armies, and a balance pass after rules 25 — so the
Human's next rounds can be played against another keeper, with intruder waves
only as an occasional event.

## 3. Backlog (in order; commit after each)

1. **Rival realm design** (`Design/Bible/RIVAL_REALM.md`): how a computer-run
   rival Heart works (start, economy, digging toward the player, building,
   summoning, traps and doors, attacking, retreating), how the player wins
   (destroy its Heart) and loses, how intruder waves become events that hit the
   nearer or richer realm, difficulty levels. Plain summary first.
2. **Rules: rival Heart.** Implement a second Heart and a rival keeper bot
   that plays inside the rules (same commands as the player, own gold,
   cinderlings, creatures, traps, doors); win/lose conditions; intruder events
   that choose a target realm. Two or three new test maps with both realms
   (different distances and routes, breakthrough points between them). Tests.
3. **Rules: creature roles and banner stance.** Give each creature a clear
   role (hold, ranged, heal, ambush, pull, heavy) used by its brain; add a
   stance to the rally banner (attack, hold, fall back when hurt) as a player
   command. Tests.
4. **Rules: larger armies.** Raise the creature cap (proposal, e.g. 12–16)
   with a second Nest or Nest size rule; check performance. Tests.
5. **Balance pass** (proposals only, tuning values): with rules 25+ bring the
   test maps into a sensible band for the reasonable bot (Cinder Hollow wave 3
   unchanged); report 1000-seed tables; the rival maps measured with the rival
   bot at two difficulty settings.
6. **Image prompts** (Human, 2026-11-11: "Was die Nacht ebenfalls machen kann, ist basierend auf dem ersten Kreaturen-prompt, auch Prompts für alles mögliche andere zu erstellen. U.a. weitere Kreaturen, mindestens eine zweite Fraktion, props, Fallen .... was wir eben brauchen können in unserem Stil."):
   `Design/Art/PROMPTS_NIGHT3.md` with ChatGPT image prompts in the style of
   the accepted Brand-hound and cinderling prompts (below), each with a short
   German line saying what it is and a style-reference sentence to attach the
   hound image: all remaining Ashen Pact creatures, the intruder types, at
   least one second people (pick from the bible: Mycelid Choir, Drowned Court,
   Gearbound Kin or Deep Dwarves) with its creatures and workers, props
   (Forge, Heart, Call-stone, Nest, Pantry, braziers, pillars, doors, bridge),
   every trap part (Flame Vent, Cinder Charge, Chain Snare, Drop Hatch,
   Turret, Weight Plate, Count Trigger), floor and wall modules. Full body,
   neutral pose, plain dark-grey studio background, original designs only.
   Accepted hound prompt: "Concept art for a game creature, ultra-realistic,
   dark grim fantasy. A "Brand-hound": a lean, long-legged hound-like beast the
   size of a large wolf, its body covered in cracked black volcanic crust like
   cooled lava rock, with thin glowing orange-red ember seams inside the
   cracks. A glowing brand seal (an original geometric sigil) is burnt into its
   flank. Its long tail smokes like a lit fuse with a faint ember tip. It wears
   a heavy collar of dark iron with several brass contract rings hanging from
   it. … Full body visible, standing in a neutral side-on three-quarter pose …
   Plain neutral dark-grey studio background, even soft lighting plus a subtle
   warm rim light, no environment, no other characters, no text, no frame.
   Photorealistic materials, high detail, sharp focus." (The cinderling prompt
   followed the same pattern: front view, relaxed A-pose.) This item may write
   `Design/Art`.
7. **Question catalogue** `Design/Planning/QUESTIONS_FOR_HUMAN_NIGHT3.md`.
8. **Unreal follow-up list** `Design/Planning/UNREAL_NEXT_FROM_NIGHT3.md`
   (what the game layer needs: rival realm view, stance UI, role tooltips).

## 4. Open-ended (after section 3, until 07:30 UTC)

- Better rival keeper strategies; compare.
- More rival maps; deeper bot tests.
- Review passes on your own work (fresh subagent reviews of rule code,
  determinism, claims in documents); fix real findings.

## 5. Evidence and result

`Evidence/UR-NIGHT-03-V1/`: a short note per item (what, numbers, tests).
`Evidence/UR-NIGHT-03-V1/NIGHT_RESULT.md` (07:30–08:00 UTC): what was done,
commits, test counts, rules version, balance tables, open points, German
summary at the top.
