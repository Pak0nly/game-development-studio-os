# Work Order INK-CORE-V3 — Core: re-review leftovers and a restrained third balance pass

Project: Inkweight (DEC-044). Director: Claude (orchestration only). Worker: one
separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python3 -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py verify-worker --root . --manifest Artifacts/Inkweight/DirectorDispatch/INK-CORE-V3/DISPATCH_MANIFEST.json --work-order Artifacts/Inkweight/DirectorDispatch/INK-CORE-V3/WORK_ORDER.md --capabilities Artifacts/Inkweight/DirectorDispatch/INK-CORE-V3/CAPABILITIES.json --receipt Artifacts/Inkweight/DirectorDispatch/INK-CORE-V3/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human authority (exact, 2026-11-19)

"Ja. Du hast bis 9 Uhr Zeit daran zu arbeiten. [...] Nutze die Zeit bis 9 Uhr
voll aus und suche dir selbst passende Aufgaben. Ziel ist ein spielbarer
Prototyp, oder zumindest die Vorbereitung dessen."

## Read first

## Read first

`Projects/Inkweight/Docs/INK_RULES_V2.md`, `GAME_CONCEPT.md`,
`Projects/Inkweight/Source/Shared/RULES_AS_BUILT.md` and `CHANGES_V2.md`, the
core and its tests, and in `Artifacts/Inkweight/Evidence/INK-CORE-V2/`:
`WORKER_RESULT.md` (section "Correction round 1"), `BALANCE_REPORT.md`,
`readability.md` and `REVIEW.md` (section "Re-review after correction round 1":
findings R1 to R4 and the suggestions).

## Objective

Close the re-review's leftovers and make one restrained, principled attempt at
the two balance problems that remain, without giving up what version 2 gained:
the four halves of the rule sentence hold visibly (amount is weight, filled
areas are armour, thin lines are blades, colour is the element), nothing
tunnels or wedges, no hollow shell out-armours a filled drawing. The browser
app and the C# port are being moved to version 2 right now and will get one
more small update from your change list.

## Tasks

1. **R1**: in solo, a heavy blunt enemy design (block, disc, ring, hoop) buys
   one copy, crawls, and makes the stake free. When the stake cannot buy
   another copy it must add danger a kiting hero feels, or the reward must
   follow how hard the kill is. Add these designs to the solo smoke field and
   show before and after.
2. **R2**: reduce or honestly bound the meshing-teeth overlap (comb against
   comb 1.14 % of ticks above 0.5, crowds 0.35 %); add comb against comb and a
   four-figure crowd to the probe and the test; correct the wording.
3. **R3**: unit test for the simultaneous knock-out by armour. **R4**: remove
   the unused turn fields if that is free of risk, otherwise leave them.
4. **Balance pass 3, restrained.** Test, each on its own and measured under
   both bot styles separately, a small number of principled levers:
   - a cost for size, so big shells and wide drawings are not strong through
     reach and weight alone (for example slower turning or acceleration with
     radius);
   - a job for light shapes in a crowd (for example blades that hit a figure
     already in contact with a third one, an evasion or speed advantage that
     the bots can actually use, or less knock-back taken at high speed);
   - element effects that matter (version 2 did not touch them);
   - anything else you can justify in one plain sentence a player would accept.
   **Adoption rule:** adopt a lever only if it lowers the highest duel win
   rate under BOTH bot styles, does not push any shape family below what it
   has now by more than a few points, and leaves the readability table intact.
   If nothing passes, change no balance number and say so: a clear "tried,
   measured, not adopted" is a good result. Do not chase the number with
   field-specific tuning.
5. **Records**: update `RULES_AS_BUILT.md`, the core `README.md` and
   `INK_RULES_V2.md` (still the rules as built; add a short "what changed
   since the first version 2" note); write
   `Projects/Inkweight/Source/Shared/CHANGES_V3.md`, the exact list from the
   merged version 2 to your result (same form as `CHANGES_V2.md`, with an app
   checklist and a C# checklist), and leave `CHANGES_V2.md` unchanged.
6. Regenerate the golden files, run all tests, re-run the balance and solo
   simulations (in pieces that write to files as they go).
7. **Evidence** `Artifacts/Inkweight/Evidence/INK-CORE-V3/`: `WORKER_RESULT.md`
   (verify-worker line, each finding, each lever with its measured effect and
   the adoption decision, test command and real output, before and after
   tables per bot style, the readability table, anything not done) plus the
   reports.

## Allowed mutations

Only explicitly listed mutations are authorised; everything else is out of
scope: `Projects/Inkweight/Source/Shared`,
`Projects/Inkweight/Source/WebPrototype/core`,
`Projects/Inkweight/Source/WebPrototype/sim`,
`Projects/Inkweight/Source/WebPrototype/tools`,
`Projects/Inkweight/Source/WebPrototype/tests`,
`Projects/Inkweight/Docs/INK_RULES_V2.md`,
`Artifacts/Inkweight/Evidence/INK-CORE-V3`.

## Task-specific controls

- Capability Knowledge Base query: NOT APPLICABLE (no tool, package or asset
  choice).
- Planned setup: none. Candidate-attempt start condition: all tests pass after
  the fixes. Candidate-attempt allowance: one candidate. Operational-recovery
  allowance: Core default. Formal stage-correction allowance: 2 rounds.
  Task-owned namespaces: the allowed paths.
- Keep the determinism rules (only `+ - * /`, `Math.sqrt`, `Math.floor`,
  `Math.imul`; own generator; fixed loop orders) and keep the public API
  stable; the fewer logic changes outside solo and the adopted levers, the
  smaller the next port update.
- No downloads, installs, network use or npm packages. Original work only.
  New rules are proposals: mark them so.
- Isolated work copy: two other Workers are changing the browser app and the
  C# port in the main checkout, so you work in your own Git worktree. Run the
  verify-worker command against the main checkout
  `/home/user/game-development-studio-os` (read-only there; use absolute paths
  if a change of directory is refused). If your worktree branch is not at the
  dispatch HEAD named in the manifest, fast-forward it to that commit before
  any change. Change files only inside your worktree. Commit locally on your
  worktree branch whenever a step is done (the container has restarted twice
  tonight), finish with one commit "Inkweight: INK-CORE-V3 Worker result",
  report branch, commits and worktree path, and never push, merge or touch the
  main checkout. The Director merges.
- Time: check `date -u`; aim to return within about 75 minutes and at the
  latest after 100 minutes, with an honest list of what is unfinished. R1 to
  R3 come before the balance levers.

## Success

R1 to R3 are fixed or honestly bounded with tests; every tested lever has a
measured, per-bot-style result and a stated decision; tests pass with real
output; golden files regenerate byte-identically; the change list is exact
enough to update the ports without reading the JavaScript diff.

## Stop

Stop and report on verify-worker failure, any need outside the allowed paths,
or a protected change.
