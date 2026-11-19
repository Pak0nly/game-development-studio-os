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

## Running

- INK-WEB-V1: playable browser prototype on the core (Worker running).

## Exact Next Step

Wait for the browser prototype Worker, review and close it, then dispatch a core correction
and balance order (I1, I3, golden coverage, balance toward the target) followed
by small update orders for the browser prototype and the C# port.
