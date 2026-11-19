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

## Running

- INK-WEB-V1: playable browser prototype on the core (Worker running).
- INK-UNITY-V1: Unity project with a C# port of the core (Worker running).

## Exact Next Step

Wait for both Workers, review and close them, then dispatch a core correction
and balance order (I1, I3, golden coverage, balance toward the target) followed
by small update orders for the browser prototype and the C# port.
