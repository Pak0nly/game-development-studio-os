# Inkweight Work State

Updated: 2026-11-19 (night, cloud session)

## Present State

Project set up on the Human's approval (DEC-044). The Human gave the Director
the night until 09:00 on 2026-11-20 to reach a playable prototype or its
preparation, choosing tasks himself (ID-04).

The engine-free ink core exists in JavaScript with shared tuning, golden test
vectors and a balance simulation; 39 tests pass. The balance target of the
rules proposal is not met: the strongest shape wins 71.3 % of bot duels
(target: at most 60 %); with the first numbers it was 92.3 %. Bots only show a
ranking under one simple play style.

INK-CORE-V1
Independent review verdict: PASS
Worker task: a49bc6f77dd99ff7d
Reviewer task: a1f80370da7e859da
Candidate identity: 96e1ed3753243700978ade41a4aad5d691044344e90f039b2cc52501ff3e9352
Closure receipt: d5f182ca846753b80e3b714055e8a13ea39673c9205fe73f88e9aba2cb0e0d73
Requested model — not independently attested.

Review findings to fix in the next core order (details in
`Artifacts/Inkweight/Evidence/INK-CORE-V1/REVIEW.md`): light figures pass
through each other while dashing (I1); golden traces miss some branches (I2);
a sharp touch by a heavy figure does less damage than a blunt one (I3); eight
minor points.

The Unity project exists under `Source/Unity`: the C# core port matches the
JavaScript core bit for bit on .NET 8 (10694 checks against the golden files).
The Unity presentation layer was compiled only against hand-written engine
stubs, never against Unity; the first review failed on a name clash with the
Input System package, which correction round 1 fixed. Nothing has been opened
in the Unity Editor yet: that is the Human's first check
(`Source/Unity/README.md`).

INK-UNITY-V1
Independent review verdict: PASS
Worker task: a72806bdd69b8c7ae
Reviewer task: ac672cd011c46a137
Candidate identity: 0421bd209dd886824dcdf3ea8f769a2f2d3a4765bfe2a79e6f4f7ff60a334c3f
Closure receipt: 47cec3eb698ed0930bcf1f8a4d34c5396e5c2315ef6934090b72dcbea9ddb4df
Requested model — not independently attested.

A playable browser design prototype exists (`Source/WebPrototype/dist`,
published privately as https://claude.ai/artifact/RHKkswGYg1aRR3szCTNSq1):
drawing with live stats, the Ring against bots or a second human, the solo
arena. Automated play-throughs pass on phone and desktop size; it has not been
played on a real phone. Review findings to fix in the update order: the top
"Zurück" silently discards a drawing and undo has the same label; the drawing
screen does not fit a phone held sideways; a double tap acts on the next
screen; ten minor points (`Artifacts/Inkweight/Evidence/INK-WEB-V1/REVIEW.md`).
With rules version 1 a normal figure with a sword shows almost no sharpness.

INK-WEB-V1
Independent review verdict: PASS
Worker task: a923e74900180ad99
Reviewer task: a19c37393c145c4bc
Candidate identity: 24ee02a11c55d0ef25e0a0e209c0708641f09c146dcbb96f05d074539282036c
Closure receipt: deac742f5c94eee78860b1826331f9ad64281db045a5d92cbba3c4cd354d4011
Requested model — not independently attested.

The interface findings of the first browser review are fixed (undo label,
question before discarding, sideways layout, double taps, ten minor points);
the page was republished. New review findings for the next update order: on
the Ring drawing and solo enemy screens "Ende" asks "Verwerfen?" but ends the
whole match or run (N-1); six minor points
(`Artifacts/Inkweight/Evidence/INK-WEB-V2/REVIEW.md`). The folder
`Source/WebPrototype/build` is ignored by the root `.gitignore`; its two files
were force-added by the Director so they are in Git.

INK-WEB-V2
Independent review verdict: PASS
Worker task: ad5840fd8095f43c7
Reviewer task: a4db7dbe644f6a0b7
Candidate identity: 18a5de95757574e5a93187acb063b0a1c3e082e564289b75e3690469955b99c7
Closure receipt: dbebc8a1dba845fe32c550b0e37aab0503593d9d44e19ee3b4d5c64b8632089b
Requested model — not independently attested.

Core version 2 is merged (rules as built: `Docs/INK_RULES_V2.md`): figures no
longer pass through or wedge into each other, a blade on a body raises
sharpness, diagonal lines are blades, filled areas are armour again (a filled
disc has about 3.9 times the armour of a line; no hollow shell beats a filled
drawing of the same ink), solo stakes raise danger; 65 tests pass. The balance
target is not met under any reading and got worse in duels: the strongest
drawing wins 76.8 % of bot duels with rushing bots and 76.1 % with circling
bots (target: at most 60 %); light shapes win 2.4 % of four-figure rounds.
"Filled areas are armour" and "light shapes not hopeless in a crowd" pull
against each other: open design question for the Human. Open from the
re-review: heavy blunt solo enemies make the stake free (R1), meshing teeth can
overlap briefly (R2), one branch without a test (R3).

INK-CORE-V2
Independent review verdict: PASS
Worker task: ac2ef5b778358368c
Reviewer task: aa432e08ec4bfc077
Candidate identity: 23f30cc065753a33973a65d378e3c008b8d98642614cee3171c72c4d8bc96e93
Closure receipt: dbaf113e10bb659983453bbe7b57763cd65a405fb0bb05047f6658d9394f3a66
Requested model — not independently attested.

The Unity project is on core version 2: the C# core matches the golden files
bit for bit (16527 checks, Debug and Release, .NET 8); the Unity layer gained
the stat panel for rules version 2, a 30 second drawing clock and a question
before discarding, still checked against stubs only and never opened in Unity.
Eight minor review findings
(`Artifacts/Inkweight/Evidence/INK-UNITY-V2/REVIEW.md`).

INK-UNITY-V2
Independent review verdict: PASS
Worker task: ad78e651563b1191e
Reviewer task: aa3a8b100fa210ae1
Candidate identity: 628e7349c664d4a5695f24ef4bc27490e0e2b1e0171731599626a61b49ced3c6
Closure receipt: cbd417b8bb9c677076e26ebe426ae9a16b8e4c79ea4702b40b2fbb3e357e5599
Requested model — not independently attested.

## Running

- INK-WEB-V3: browser prototype on core version 2 plus second review fixes
  (Worker running).
- INK-CORE-V3: re-review leftovers R1 to R3 and a restrained third balance
  pass, in a separate work copy (Worker running).

## Exact Next Step

Wait for both Workers, review and close them, republish the prototype page;
if INK-CORE-V3 changes the core, merge it and dispatch one small update order
each for the browser prototype and the C# port.
