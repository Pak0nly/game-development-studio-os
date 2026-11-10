# Independent review — UR-NIGHT-01-V1 (night shift 1)

Reviewer task: a81772f980de7621c (separate read-only Claude Code subagent, requested model sonnet — not independently attested).
Night branch: `night/2026-11-09` (base d653a16, head f94ca38, 205 commits, 980 new files, no base file changed).
Night return receipt: d9fc8767bccf9936492a119aaa3dc659465cdac1703a2cce7a8a28ce9f57d4da.
Verdict: PASS (no high or medium findings).

1. Tests: `dotnet test Underreign.Simulation.Tests -c Release` on an exported tree: 684 passed, 0 failed. A 20-seed
   batch of the reasonable scripted player: 14 won (70 %), no wave-1 losses, wins end 18:08–20:06; outcomes match
   `balance_round_4.csv` row by row (hash column differs by the documented rules-version-3 change).
2. Unity 6 compatibility: simulation library targets netstandard2.1, no package references, C# 9, asmdef with
   `noEngineReferences`; NUnit classic asserts. Mono/NUnit 3.5 run documented, not re-run; nothing ran in Unity.
3. Decisions respected: Ashen Pact, 40×40×3, heat rises (water, gas, collapse present but switched off), five rooms
   plus Call-stone, four creatures, six trap parts, Scout/Brute/Healer in three waves, trap memory; new design marked
   as proposal.
4. Originality: no hard clash found in samples and a grep for verbatim well-known monster names; risks (the
   Sleeper, sporelings, Oath-warden, Drowned Court, Deep Dwarves, Gearbound, Mycelid, the Brood, the Hush) are
   flagged openly in `NAME_REGISTRY.md`.
5. Planning documents coherent and actionable; low: very long, many codes (explained in glossaries).
6. Night result honest: test count, file count and open problems match; low: commit 1a07035 has a misleading title
   (disclosed in the night result).
