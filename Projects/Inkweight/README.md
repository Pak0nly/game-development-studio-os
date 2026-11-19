# Inkweight

Working title. The final title follows a store and trademark check (OD-02).

## Status

Concept approved and project set up on 2026-11-19 (DEC-044). First prototype
work started the same night; see [`Docs/WORK_STATE.md`](Docs/WORK_STATE.md).

## Concept

A fast game in which the players draw all graphics themselves. The game derives
weight, armour, damage and element from the drawing: amount is weight, filled
areas are armour, thin lines are blades, colour is the element. One shared core,
two modes: a solo arena run and a local party mode for 2 to 4 players. Only
general genre mechanics are used; no existing game is copied or recreated.
Details: [`Docs/GAME_CONCEPT.md`](Docs/GAME_CONCEPT.md) and
[`Docs/INK_RULES_V1.md`](Docs/INK_RULES_V1.md).

## Target Platform

PC (Windows, Steam) first; mobile and web possible later (ID-04).

## Engine

Unity (ID-04). Version: the Studio baseline Unity 6.3 LTS (DEC-002) until the
Human chooses otherwise (OD-03). A browser prototype is used as a design tool
only.

## Project Location

Inside this repository under `Projects/Inkweight/Source` for now (OD-04):

- `Source/Shared`: tuning values and test vectors shared by both implementations
- `Source/WebPrototype`: browser design prototype (JavaScript)
- `Source/Unity`: Unity project and the engine-free C# core with its tests

## Phase

Prototype: prove that ink carries the game before scope grows.

## Direction Model

Claude directs Inkweight under the `AGENTS.md` rules (Director non-execution,
separate Worker, independent review, closure). Inkweight keeps its own
operational state files. The dispatch gate is `Tools/InkweightDispatchGate`, an
independent copy (ID-05); nothing in Inkweight overlaps with or is connected to
any other project.

## Structure

- `Docs/`: project documents and operational state
- `Source/`: prototype and Unity sources
- `Assets/`: source assets outside the Unity import tree
- `Builds/`: local builds (excluded from Git by the root `[Bb]uilds/` rule)
- `References/`: reference material (no third-party game material)
- `Tools/`: project-specific tooling

## Constraints

- Original content only (DEC-044). No generated images or sounds in the game.
- Player drawings stay local and are never used for training (DEC-025).
- All other projects and their files and tools are out of scope.
- Downloads, installations, purchases and Steam fees need their own Human
  approval (DEC-013, DEC-014); see ID-06 for the cloud-container tooling.

## Authoritative Documents

- Repository `AGENTS.md`, `Docs/CONFIRMED_DECISIONS.md` (DEC-044), `Docs/PROJECT_TEMPLATE.md`
- [`Docs/GAME_CONCEPT.md`](Docs/GAME_CONCEPT.md)
- [`Docs/INK_RULES_V1.md`](Docs/INK_RULES_V1.md)
- [`Docs/DISCOVERY_DECISIONS.md`](Docs/DISCOVERY_DECISIONS.md)
- [`Docs/OPEN_DECISIONS.md`](Docs/OPEN_DECISIONS.md)
- [`Docs/PRODUCTION_PROFILE.md`](Docs/PRODUCTION_PROFILE.md)
- [`Docs/WORK_STATE.md`](Docs/WORK_STATE.md) and [`Docs/CURRENT_HANDOVER.md`](Docs/CURRENT_HANDOVER.md)
- Studio OS [Visual Quality Assurance Workflow](../../Docs/Visual/Visual_Quality_Assurance_Workflow.md)

## Risks

- Title not checked.
- Optimal-shape risk (see concept section 7); measured by simulation, not yet
  by Human play.
- The Unity project cannot be opened in the cloud container; Unity-side code is
  compiled and tested only as far as the engine-free core goes until the Human
  opens it locally.
- Gate and project folder are new.

## Next Step

See [`Docs/WORK_STATE.md`](Docs/WORK_STATE.md).
