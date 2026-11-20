# Inkweight Work State

Updated: 2026-11-20 (night, cloud session)

## Present State

Project set up on the Human's approval (DEC-044). The Human gave the Director
the night until 09:00 on 2026-11-20 to reach a playable prototype or its
preparation, choosing tasks himself (ID-04).

- **Core** (`Source/WebPrototype/core`, `Source/Shared`): engine-free,
  deterministic, version 3 merged; rules as built in `Docs/INK_RULES_V2.md`
  (`INK_RULES_V1.md` is the first proposal and no longer what runs). 71 tests
  pass. The four halves of the rule sentence hold in the numbers. The Ring
  balance target is NOT met: the strongest drawing wins 76.8 % of bot duels
  with rushing bots and 76.1 % with circling bots (target: at most 60 %);
  light shapes win about 2.6 % of four-figure rounds. Five balance levers were
  measured in version 3 and none adopted. Open in solo: the middle stake is
  nearly free against heavy slow enemy designs, and a fast hero can kite a
  single heavy enemy at any stake.
- **Browser prototype** (`Source/WebPrototype/app`, `dist`): playable, reviewed
  on core version 2; every number and rule sentence shown was checked against
  the rules. Published privately: https://claude.ai/artifact/RHKkswGYg1aRR3szCTNSq1
  Not yet rebuilt on core version 3; the first Ring match is too hard with the
  current placeholder bots. Never played on a real phone.
- **Unity project** (`Source/Unity`): C# core bit-exact on core version 2
  (16527 checks); not yet on version 3. The Unity layer was only compiled
  against hand-written stubs and has never been opened in the Unity Editor:
  that is the Human's first check (`Source/Unity/README.md`).
- The folder `Source/WebPrototype/build` is re-included by a local
  `.gitignore`; the root `.gitignore` ignores `[Bb]uild/`.

## Closed orders

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

Requested model — not independently attested.

## Running

- INK-WEB-V4: browser prototype on core version 3, fair first Ring match,
  small first-run hint.
- INK-UNITY-V3: C# port on core version 3, minor review findings, truthful
  texts.

## Exact Next Step

Wait for both Workers, review and close them, republish the prototype page,
then write the morning report for the Human.
