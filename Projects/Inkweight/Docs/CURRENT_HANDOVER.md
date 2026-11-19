# Inkweight Current Handover

State 2026-11-19 night. Talk to the Human in German, plain words, no codes.

- Read `README.md`, `Docs/GAME_CONCEPT.md`, `Docs/INK_RULES_V1.md`,
  `Docs/DISCOVERY_DECISIONS.md` (ID-01..ID-07), `Docs/OPEN_DECISIONS.md`, DEC-044
  and `Source/Shared/RULES_AS_BUILT.md` (the rules as actually built; the
  numbers and the sharpness formula differ from `INK_RULES_V1.md`).
- Work lives on the cloud session branch `ccr-808d4c02-yt93ed` of the Studio
  repository; nothing is on `main`.
- Dispatches go through `Tools/InkweightDispatchGate`. Do not touch other projects.
- ID-05 (gate copy), ID-06 (cloud tooling) and ID-07 (working title) are Director
  readings or proposals the Human has not yet confirmed.

Closed: INK-CORE-V1
Independent review verdict: PASS
Worker task: a49bc6f77dd99ff7d
Reviewer task: a1f80370da7e859da
Candidate identity: 96e1ed3753243700978ade41a4aad5d691044344e90f039b2cc52501ff3e9352
Closure receipt: d5f182ca846753b80e3b714055e8a13ea39673c9205fe73f88e9aba2cb0e0d73

Closed: INK-UNITY-V1
Independent review verdict: PASS
Worker task: a72806bdd69b8c7ae
Reviewer task: ac672cd011c46a137
Candidate identity: 0421bd209dd886824dcdf3ea8f769a2f2d3a4765bfe2a79e6f4f7ff60a334c3f
Closure receipt: 47cec3eb698ed0930bcf1f8a4d34c5396e5c2315ef6934090b72dcbea9ddb4df

The Unity layer was never compiled against Unity (stubs only); the Human opens
it first, guide in `Source/Unity/README.md`.

Running: INK-WEB-V1 (dispatched, Worker not yet returned).

Next action: wait for the browser prototype Worker, review and close it; then the core
correction and balance order.
