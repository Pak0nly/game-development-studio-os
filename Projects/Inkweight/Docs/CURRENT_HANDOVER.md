# Inkweight Current Handover

State 2026-11-20 night. Talk to the Human in German, plain words, no codes.

- Read `README.md`, `Docs/GAME_CONCEPT.md`, `Docs/INK_RULES_V2.md` (rules as
  built), `Docs/DISCOVERY_DECISIONS.md` (ID-01..ID-07), `Docs/OPEN_DECISIONS.md`,
  DEC-044, and `Docs/WORK_STATE.md`.
- Work lives on the cloud session branch `ccr-808d4c02-yt93ed` of the Studio
  repository; nothing is on `main`.
- Dispatches go through `Tools/InkweightDispatchGate`. Do not touch other projects.
- ID-05 (gate copy), ID-06 (cloud tooling: Node and the .NET SDK inside the
  cloud container) and ID-07 (working title) are Director readings or proposals
  the Human has not yet confirmed.
- Prototype page (private): https://claude.ai/artifact/RHKkswGYg1aRR3szCTNSq1,
  published from `Source/WebPrototype/dist/inkweight.artifact.html`.
- The Unity layer was never compiled against Unity (stubs only); the Human
  opens it first, guide in `Source/Unity/README.md`. The Unity version is the
  Human's choice (OD-03).
- Open design question for the Human: "filled areas are armour" and "light
  shapes not hopeless in a crowd" pull against each other; bots cannot settle
  the balance, human play must.

Closed (markers):

INK-CORE-V1
Independent review verdict: PASS
Worker task: a49bc6f77dd99ff7d
Reviewer task: a1f80370da7e859da
Candidate identity: 96e1ed3753243700978ade41a4aad5d691044344e90f039b2cc52501ff3e9352
Closure receipt: d5f182ca846753b80e3b714055e8a13ea39673c9205fe73f88e9aba2cb0e0d73

INK-UNITY-V1
Independent review verdict: PASS
Worker task: a72806bdd69b8c7ae
Reviewer task: ac672cd011c46a137
Candidate identity: 0421bd209dd886824dcdf3ea8f769a2f2d3a4765bfe2a79e6f4f7ff60a334c3f
Closure receipt: 47cec3eb698ed0930bcf1f8a4d34c5396e5c2315ef6934090b72dcbea9ddb4df

INK-WEB-V1
Independent review verdict: PASS
Worker task: a923e74900180ad99
Reviewer task: a19c37393c145c4bc
Candidate identity: 24ee02a11c55d0ef25e0a0e209c0708641f09c146dcbb96f05d074539282036c
Closure receipt: deac742f5c94eee78860b1826331f9ad64281db045a5d92cbba3c4cd354d4011

INK-WEB-V2
Independent review verdict: PASS
Worker task: ad5840fd8095f43c7
Reviewer task: a4db7dbe644f6a0b7
Candidate identity: 18a5de95757574e5a93187acb063b0a1c3e082e564289b75e3690469955b99c7
Closure receipt: dbebc8a1dba845fe32c550b0e37aab0503593d9d44e19ee3b4d5c64b8632089b

INK-CORE-V2
Independent review verdict: PASS
Worker task: ac2ef5b778358368c
Reviewer task: aa432e08ec4bfc077
Candidate identity: 23f30cc065753a33973a65d378e3c008b8d98642614cee3171c72c4d8bc96e93
Closure receipt: dbaf113e10bb659983453bbe7b57763cd65a405fb0bb05047f6658d9394f3a66

INK-UNITY-V2
Independent review verdict: PASS
Worker task: ad78e651563b1191e
Reviewer task: aa3a8b100fa210ae1
Candidate identity: 628e7349c664d4a5695f24ef4bc27490e0e2b1e0171731599626a61b49ced3c6
Closure receipt: cbd417b8bb9c677076e26ebe426ae9a16b8e4c79ea4702b40b2fbb3e357e5599

INK-WEB-V3
Independent review verdict: PASS
Worker task: a135759b7a3a6087b
Reviewer task: aecf0113bdae5b738
Candidate identity: a8793db0b70170f042cc3a27622d72596d5ef774264247d88622fbec7ccce7cf
Closure receipt: 64fe388d816ee8b53b1b1b7e51208a184bade29dddbadc0636ca90077409518b

INK-CORE-V3
Independent review verdict: PASS
Worker task: a4f119a8ce7fbbb21
Reviewer task: a58afcfc8249cc44e
Candidate identity: 258f450f709942aec0e5c474ca96fd558813ab13972119b5bdfbc43f99d13a8d
Closure receipt: b4cf5f9b457aa49eeea5d0d15daaa7d005e10521680685017c11ea499a5af679

INK-UNITY-V3
Independent review verdict: PASS
Worker task: abf22b5c28d3f4a1d
Reviewer task: a00e917ba43eef5ea
Candidate identity: b299b6b963db9180a87590215851df144763fb1922a16c4c4e1302ed6067b77d
Closure receipt: 2433ce39a86728f4f8bbe990b6bc5442b264828af58301f15fadbb7fb3c9e4f8

INK-WEB-V4
Independent review verdict: PASS
Worker task: a7cfafae2d45ff931
Reviewer task: a55c395b5dc8fe484
Candidate identity: c6867db8938079ea7c90e530e55cdeb84c95dc61ad65022cbe5805f1e0667e87
Closure receipt: ad9d9674a3f34429b141db67b96b58f31e60443c80168a84227508d2a7bb532f

INK-WEB-V5
Independent review verdict: PASS
Worker task: ae58c01a423425f64
Reviewer task: a61577cec63b26e0a
Candidate identity: b9e366676964f7709ffb8386eddf31136496fbc3dfac6f3c1361152776b6e875
Closure receipt: fc76444df866d9651d51d53467a4b4b04f7caf46b52b0b386663947a53bc95e2

Nothing is running. The night's authority (ID-04) ended at 09:00 on
2026-11-20; every further order needs the Human's go.

Known open points to carry into the next order, none of them started:
- Core: no golden trace pins the crowd condition with a dead third body, the
  crush multiplication order or the throw-speed operation order (Unity review
  m-3); the middle solo stake is nearly free against heavy slow enemies and a
  fast hero can kite a single heavy enemy; the boss is a wall for a hero that
  runs in; Ring balance target unmet (see `Docs/WORK_STATE.md`).
- Browser page: minor findings m-6 to m-9 of the INK-WEB-V5 review.
- Unity: minor finding m-5 of the INK-UNITY-V3 re-review; text fit at 4:3 is
  an estimate; nothing was ever run in the Editor.
- The .NET SDK was installed only inside the cloud container (ID-06). Blender
  was not needed and not installed.
- Work copies of the two isolated core Workers lie under `.claude/worktrees/`
  in the cloud container only (local branches, merged, not pushed).

Next action: ask the Human how the prototype felt on the phone and what
happened when opening the Unity project.
