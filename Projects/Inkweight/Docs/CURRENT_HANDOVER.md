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

Closed: INK-WEB-V1
Independent review verdict: PASS
Worker task: a923e74900180ad99
Reviewer task: a19c37393c145c4bc
Candidate identity: 24ee02a11c55d0ef25e0a0e209c0708641f09c146dcbb96f05d074539282036c
Closure receipt: deac742f5c94eee78860b1826331f9ad64281db045a5d92cbba3c4cd354d4011

Closed: INK-WEB-V2
Independent review verdict: PASS
Worker task: ad5840fd8095f43c7
Reviewer task: a4db7dbe644f6a0b7
Candidate identity: 18a5de95757574e5a93187acb063b0a1c3e082e564289b75e3690469955b99c7
Closure receipt: dbebc8a1dba845fe32c550b0e37aab0503593d9d44e19ee3b4d5c64b8632089b

Prototype page (private): https://claude.ai/artifact/RHKkswGYg1aRR3szCTNSq1,
published from `Source/WebPrototype/dist/inkweight.artifact.html`.

Running: INK-CORE-V2 in the work copy
`.claude/worktrees/agent-ac2ef5b778358368c` (branch
`worktree-agent-ac2ef5b778358368c`, not pushed; lost if the container is
replaced).

Next action: wait for INK-CORE-V2, merge, review and close it; then update
orders for the browser prototype and the C# port.
