# Underreign

Working title. The final title follows a store and trademark check (OD-02).

## Status

Concept approved (2026-11-09). Project skeleton and docs created on Human
approval (DEC-041). No Unity project, no build, no assets yet.

## Concept

An original game in the dungeon-management genre: dig, build rooms, attract and
keep creatures, defend against intruders. Extended by wired trap systems, play
on several stacked layers (vertical as well as horizontal) and five playable
peoples at release (Ashen Pact, Mycelid Choir, Drowned Court, Gearbound Kin, Deep
Dwarves; Crystal Brood later) instead of only demons. Only genre mechanics are used; no names,
creatures, characters, room names, levels, art, music, UI look or text of any
existing game are copied. Details: [`Docs/GAME_CONCEPT.md`](Docs/GAME_CONCEPT.md).

## Target Platform

PC (Windows, Steam) first (UD-03). Other platforms later.

## Engine

Unity 6000.6.4f1, the same version as Hearthlands (UD-04). Render pipeline open
(OD-04).

## Unity Project Location

`C:\GameDev\Underreign`, own local Git repository with Git LFS, no remote
(UD-26). Created empty (README, .gitignore, .gitattributes); the Unity project
is created by a later Work Order.

## Phase

Concept approved; next is planning the first playable prototype (greybox, Ashen
Pact, three layers).

## Direction Model

Claude directs Underreign under the `AGENTS.md` rules (Director non-execution,
separate Worker, independent review, closure). Underreign keeps its own
operational state files. The dispatch gate is
`Tools/UnderreignDispatchGate`, an independent copy (UD-25, OD-01); nothing
in Underreign overlaps with or is connected to Hearthlands.

## Structure

- `Docs/`: project documents and operational state
- `Source/`: reserved (the Unity project lives outside this repository, UD-26)
- `Assets/`: source assets outside the Unity import tree
- `Builds/`: local builds (excluded from Git by the root `[Bb]uilds/` rule)
- `References/`: reference material (no third-party game material)
- `Tools/`: project-specific tooling

## Constraints

- Original content only (DEC-041).
- Hearthlands, MobileArc, Crime99 and their files and tools are out of scope.
- Downloads, installations, purchases, Git operations and Steam fees need their
  own Human approval (DEC-013, DEC-014, DEC-023).
- Look work: one sample first, then the Human decides.

## Authoritative Documents

- Repository `AGENTS.md`, `Docs/CONFIRMED_DECISIONS.md` (DEC-041), `Docs/PROJECT_TEMPLATE.md`
- [`Docs/GAME_CONCEPT.md`](Docs/GAME_CONCEPT.md)
- [`Docs/DISCOVERY_DECISIONS.md`](Docs/DISCOVERY_DECISIONS.md)
- [`Docs/OPEN_DECISIONS.md`](Docs/OPEN_DECISIONS.md)
- [`Docs/PRODUCTION_PROFILE.md`](Docs/PRODUCTION_PROFILE.md)
- [`Docs/WORK_STATE.md`](Docs/WORK_STATE.md) and [`Docs/CURRENT_HANDOVER.md`](Docs/CURRENT_HANDOVER.md)
- Studio OS [Visual Quality Assurance Workflow](../../Docs/Visual/Visual_Quality_Assurance_Workflow.md)

## Risks

- Title not yet checked.
- Large feature set (five peoples, layers, wiring, physics); the prototype must
  prove the fun of layers plus wiring before scope grows.
- The Deep Dwarves (UD-32) must stay clearly different from, and unconnected to,
  the surface dwarves of Hearthlands.
- Gate and Unity project folder are new and untested on a real Work Order.

## Next Step

A prototype planning Work Order (heat rises, Ashen Pact, three layers).
