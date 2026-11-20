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

## Running

- INK-CORE-V2: core corrections and second balance pass, in a separate work
  copy (Worker running; interrupted once by a container restart and resumed).

## Exact Next Step

Wait for INK-CORE-V2, merge its branch, review and close it; then dispatch the
update orders for the browser prototype (new core plus review findings) and the
C# port (change list), and republish the prototype page.
