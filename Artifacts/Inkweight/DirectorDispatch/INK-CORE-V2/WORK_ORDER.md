# Work Order INK-CORE-V2 — Core corrections from the independent review and a second balance pass

Project: Inkweight (DEC-044). Director: Claude (orchestration only). Worker: one
separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python3 -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py verify-worker --root . --manifest Artifacts/Inkweight/DirectorDispatch/INK-CORE-V2/DISPATCH_MANIFEST.json --work-order Artifacts/Inkweight/DirectorDispatch/INK-CORE-V2/WORK_ORDER.md --capabilities Artifacts/Inkweight/DirectorDispatch/INK-CORE-V2/CAPABILITIES.json --receipt Artifacts/Inkweight/DirectorDispatch/INK-CORE-V2/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human authority (exact, 2026-11-19)

"Ja. Du hast bis 9 Uhr Zeit daran zu arbeiten. [...] Nutze die Zeit bis 9 Uhr
voll aus und suche dir selbst passende Aufgaben. Ziel ist ein spielbarer
Prototyp, oder zumindest die Vorbereitung dessen."

## Read first

`Projects/Inkweight/Docs/INK_RULES_V1.md`, `GAME_CONCEPT.md`,
`Projects/Inkweight/Source/Shared/RULES_AS_BUILT.md`, the core and its tests,
`Artifacts/Inkweight/Evidence/INK-CORE-V1/WORKER_RESULT.md`,
`BALANCE_REPORT.md` and `REVIEW.md` (findings I1 to I3 and M1 to M8, and the
Reviewer's untested balance suggestions).

## Objective

Correct the review findings in the JavaScript core and bring the Ring balance
as close to the target as honest work allows (no archetype above 60 % average
duel win rate, at least three clearly different shapes that can win, light
shapes not hopeless in four-figure rounds), while keeping the one-sentence rule
readable: amount is weight, filled areas are armour, thin lines are blades,
colour is the element. A browser prototype and a C# port already build on this
core; both get a small update order right after you, so every behaviour change
must be written down exactly.

## Tasks

1. **Fix I1** (figures pass through each other while dashing) so that a
   detected contact always separates the figures and a dash transfers its push;
   add tests with the Reviewer's scenario (two 20-cell lines dashing broadside
   from gaps of 6 to 14 cells) and a fast small figure against a one-cell line.
2. **Fix I3**: a sharp touch never does less than a blunt touch.
3. **Fix or decide the minor findings** M1 to M8; where you keep the behaviour,
   document it. The Ring and solo setup must reject or safely handle invalid
   and over-budget drawings (M3). Extend the state hash (M5).
4. **Golden coverage (I2)**: add traces that reach sudden death, a
   simultaneous knock-out, solo hero death, the solo time limit and the
   hero-ink and weapon-ink upgrades. Keep the files reasonably small.
5. **Balance pass 2.** Try the Reviewer's suggestions and your own, measure
   each, keep what helps: for example hit and dash knockback that depends on
   the attacker's speed or sharpness, a flatter armour curve, a job for hollow
   shapes and for size, element effects that matter. Add a second bot style
   (for example one that circles, aims its front and avoids the pile-up) and
   report results per bot style and mixed, so the numbers are less an artefact
   of one bot. Widen the archetype field with a few plausible "player
   optimiser" drawings (what would a clever player draw to break the rules?).
   Do not tune only against the field: say which changes are principled.
6. **Solo arena**: make the stake matter for danger as well as reward, bring
   the smoke-run win rate of the bot hero into a believable range (not 86 %
   won with nearly full armour), and keep needle swarms beatable.
7. **Records**: update `RULES_AS_BUILT.md` and the core `README.md`; write
   `Projects/Inkweight/Source/Shared/CHANGES_V2.md`, an exact change list for
   the two porting orders (file, function, old behaviour, new behaviour, new or
   renamed tuning keys, changed state fields, changed hash layout); write
   `Projects/Inkweight/Docs/INK_RULES_V2.md`, the rules as now built in the
   plain style of `INK_RULES_V1.md` (formulas, numbers as proposals, section 8
   with the measured result). Do not change `INK_RULES_V1.md`.
8. **Regenerate** the golden files, run all tests, re-run the full balance and
   solo simulations.
9. **Evidence** `Artifacts/Inkweight/Evidence/INK-CORE-V2/`: `WORKER_RESULT.md`
   (verify-worker line, each finding and what was done, test command and real
   output, before and after balance tables, honest verdict, anything not done)
   plus the balance report as Markdown and JSON.

## Allowed mutations

Only explicitly listed mutations are authorised; everything else is out of
scope: `Projects/Inkweight/Source/Shared`,
`Projects/Inkweight/Source/WebPrototype/core`,
`Projects/Inkweight/Source/WebPrototype/sim`,
`Projects/Inkweight/Source/WebPrototype/tools`,
`Projects/Inkweight/Source/WebPrototype/tests`,
`Projects/Inkweight/Docs/INK_RULES_V2.md`,
`Artifacts/Inkweight/Evidence/INK-CORE-V2`.

## Task-specific controls

- Capability Knowledge Base query: NOT APPLICABLE (no tool, package or asset
  choice).
- Planned setup: none. Candidate-attempt start condition: all tests pass after
  the fixes. Candidate-attempt allowance: one candidate. Operational-recovery
  allowance: Core default. Formal stage-correction allowance: 2 rounds.
  Task-owned namespaces: the allowed paths.
- Keep the determinism rules of the first order (only `+ - * /`, `Math.sqrt`,
  `Math.floor`, `Math.imul`; own generator; fixed loop orders) and keep the
  public API stable wherever possible: the browser app in
  `WebPrototype/app` and the C# port in `Source/Unity` call it. Read how they
  use it before renaming anything; both are read-only for you.
- No downloads, installs, network use or npm packages. Original work only.
- New rules are proposals: mark them so.
- You may use subagents in parallel for independent files.
- Time: check `date -u`; aim to return within about 75 minutes and at the
  latest after 100 minutes, with an honest list of what is unfinished. Fixes
  and golden coverage come before balance; a clear measured verdict comes
  before a perfect number.
- Do NOT commit or push.

## Success

All review findings are fixed or decided and documented; tests pass with real
output; golden files regenerate byte-identically and cover the named branches;
the balance report shows before and after with an honest verdict; the change
list is exact enough to update the C# port without reading the JavaScript diff.

## Stop

Stop and report on verify-worker failure, any need outside the allowed paths,
or a protected change.
