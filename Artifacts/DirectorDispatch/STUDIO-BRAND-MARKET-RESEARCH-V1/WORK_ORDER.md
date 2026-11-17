# STUDIO-BRAND-MARKET-RESEARCH-V1

ID: STUDIO-BRAND-MARKET-RESEARCH-V1

Base / profile references: `AGENTS.md`; `Docs/CONFIRMED_DECISIONS.md` (DEC-013,
DEC-014, DEC-025, DEC-041, DEC-042, DEC-043); Hearthlands repository
`Pak0nly/hearthlands` Wiki (`Wiki/Bereiche/Spielidee-und-USPs.md`,
`Wiki/Bereiche/Release.md`, OD-07, HD-57); Underreign repository
`Pak0nly/underreign` (`Design/Snapshot/OPEN_DECISIONS.md` OD-02,
`Game/SPIELANLEITUNG.md`), Studio `Projects/Underreign/Docs/GAME_CONCEPT.md`.

Human authority: Human Developer, marketing chat 2026-11-17: asked for a
research order covering game titles and trademark check for both games, market
situation, release/store-page order, plus studio name and domains. Studio
keywords given by the Human: "Six Fingers" (allusion to the AI six-finger
problem), dwarves, dwarf beards, classic games, "new retro games" (idea: open up
a movement/label in the way "new retro wave" did for music, even though the
games' genres do not match that music).

Objective: give the Human a decision-ready shortlist, with evidence, for:
1. Studio name (candidates built from the Human's keywords and free variants).
2. Final titles for Hearthlands (working title) and Underreign (working title).
3. Domain availability for the best candidates.
4. The "New Retro Games" label: prior use, collision risk, positioning options.
5. Market situation of both genres on Steam and the visibility levers.
6. A proposed order of store pages, demos, Next Fest and releases for both games.
7. Publisher versus self-publishing, as facts and trade-offs only.

Inputs: the references above; public web sources only.

Allowed mutations: Only explicitly listed mutations are authorised; everything
else is out of scope. Create `Artifacts/Reports/STUDIO-BRAND-MARKET-RESEARCH-V1/`
with `WORKER_RESULT.md` and `SOURCES.md`. Nothing in either game repository.

Task-specific controls:
- Research only. No account creation, no domain registration or reservation,
  no trademark filing, no purchase, no download or installation (DEC-013,
  DEC-014), no contact with publishers, press or other people, no public post.
- Do not send private Human data or unpublished game details to external
  services beyond the search terms needed (candidate names, genre words).
- Name checks per candidate: Steam store and Steam developer names, itch.io,
  existing game/studio names, EUIPO (EU), DPMA (DE) and USPTO (US) public
  databases in classes 9, 28, 41 where reachable; common social handles;
  domain availability (.com, .de, .games, .studio) via public lookup only.
  Mark every check as DONE, NOT REACHABLE or NOT DONE. Result is a risk
  screening, not legal advice.
- "Six Fingers": also evaluate the brand risk that both games use disclosed
  generative AI (DEC-042 for Underreign, Hearthlands HD-48/OD-05): does the
  name read as self-irony, as anti-AI, or as hypocrisy? Give framing options.
- "New Retro Games": check prior use (including the music brand
  "NewRetroWave" and terms such as neo-retro, boomer shooter, retro-modern),
  collision risk, and how such labels spread in games (community, curators,
  festivals, Steam tags). Propose concrete options (curator page, own themed
  festival or event, tagline) with effort and risk.
- Titles: originality per DEC-041 (no names of existing games or trademarks);
  for Underreign keep the Deep Dwarves distinct from Hearthlands (UD-32).
  5-8 candidates per game, top 3 checked fully.
- Market: genre size and recent comparable releases (settlement/logistics
  builders; dungeon management), wishlist and first-week benchmarks, Steam Next
  Fest 2027 dates, AI-disclosure reception. Every number gets a source and
  date; mark estimates as estimates.
- Order proposal must respect the Hearthlands business goal (HD-57) and the
  open release-form question (F-REL-001); it is a proposal, not a decision.
- Capability Knowledge Base query: NOT APPLICABLE (no tool, asset or workflow
  selection).

Required output: `WORKER_RESULT.md` in English with a short German summary for
the Human at the top: shortlist tables (studio names, titles per game, domains),
a check matrix, the "New Retro" analysis, market facts, the order proposal,
publisher trade-offs, and at most 8 decision questions for the Human, each
with a recommendation. `SOURCES.md` lists every URL with access date.

Success: every candidate in the shortlist has a complete check row or an
explicit NOT REACHABLE reason; no unsourced number; no forbidden action taken.

Stop: when the report exists, or when a needed source requires an account,
payment or contact; then report what is missing. Human checkpoint: the Human
chooses names, order and publisher stance; nothing is registered or published
by this order.

Routing (proposal): one Worker, research role (Producer-led, with Asset and
Licence Steward for the trademark screening); one independent Reviewer checks
sources and that no forbidden action occurred. Model and reasoning level per
`Docs/Roles/ROLE_OPERATING_MODEL.md`; to be fixed in the dispatch manifest.

## Dispatch record

Human go: "Go" (marketing chat, 2026-11-17).

Exact Human waiver for this one named dispatch (AGENTS.md Director Dispatch
Gate): DEC-007 names ChatGPT as Studio Director and the Studio gate
`Tools/AuthorityContinuity` supports only Codex task tools; DEC-041 makes
Claude Director only for MobileArc, Hearthlands and Underreign. Asked how to
run this Studio-level order, the Human chose "Einmalige Ausnahme
(Empfehlung)": Claude directs only STUDIO-BRAND-MARKET-RESEARCH-V1, with one
separate Claude Worker and one separate independent Reviewer; no Director
receipt is issued; DEC-007 stays in force; no standing exception.

Director: Claude Code session_01Kh4ZKGDMGTC1NtamnarPKT (orchestration only).
Worker: separate Claude Code subagent (Agent tool), requested model opus,
Standard class (multi-source research with legal-risk screening).
Requested model — not independently attested.
Reviewer: one separate Claude Code subagent after WORKER_RESULT.md exists.
