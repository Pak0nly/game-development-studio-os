# Underreign Open Decisions

| ID | Topic | Status | Notes |
|---|---|---|---|
| OD-01 | Dispatch and closure gate for Claude-directed Underreign work | DECIDED / BUILT (UD-25) | Own independent copy `Tools/UnderreignDispatchGate`, no connection to other projects. Earlier note: `Tools/ClaudeDispatchGate` is MobileArc-scoped (DEC-037) and `Tools/HearthlandsDispatchGate` is Hearthlands-scoped. Hearthlands OD-01 noted that a multi-project extension may be reconsidered when a third Claude project appears; Underreign is that case. Before this decision no mutation-capable Underreign dispatch was issued. |
| OD-02 | Final title and trademark check | OPEN | "Underreign" is a working title (UD-01). Store and trademark check before any public use. |
| OD-03 | Unity project location and own Git repository | DECIDED (UD-26) | `C:\GameDev\Underreign` with own local Git and Git LFS, no remote; the Unity project itself is created by a later Work Order. Earlier note: Hearthlands keeps its Unity project outside the Studio repository with its own Git repository (Hearthlands OD-08). The same pattern was proposed and the Human chose it. |
| OD-04 | Render pipeline | OPEN | Unity 6000.6.4f1 decided (UD-04). URP vs HDRP open; stylised 3D (UD-19) suggests URP. |
| OD-05 | Business model | OPEN | Not yet asked. |
| OD-06 | Asset pipeline and generative-AI content policy | OPEN | Must respect DEC-025. Not needed for the greybox prototype (UD-22). |
| OD-07 | Production profile, role profile and capability index | OPEN | Required by `Docs/PROJECT_TEMPLATE.md` once specialist review, tools or assets are used. Created with the first prototype planning order. |
| OD-08 | Prototype gravity rule | DECIDED (UD-24) | Heat rises instead of water in the prototype. Earlier note: UD-12 fixes water for the prototype; UD-08 picks the Ashen Pact, whose own vertical strength is heat rising. The question was whether to keep water or test heat rising instead; the Human chose heat rising. |
| OD-09 | Visual descriptions of the peoples | DECIDED for Ashen Pact, Gearbound Kin and Drowned Court (UD-28..30); Mycelid Choir unchanged | Added to `GAME_CONCEPT.md` section 2 after the UD-07 note; Human reaction: see UD-28..30. Note: the Human remarked "Also Dämonen (die doch eigentlich ihre Hörner brauchen), Meerfolk mit Beinen und Zwerge." This is a remark, not a decision; the peoples and their descriptions are unchanged. |
| OD-10 | Role of the dwarves | DECIDED (UD-32) | Deep Dwarves are a fifth playable people at release and also dig in from the side as rivals in campaign and free play. Earlier note: the Human required dwarves (UD-31). Must not overlap with or be connected to Hearthlands. |
