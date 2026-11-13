# Work Order UR-MELEE-PACKS-RESEARCH-V1 — Shortlist melee animation packs on Fab (research only)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Routine.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-MELEE-PACKS-RESEARCH-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-MELEE-PACKS-RESEARCH-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-MELEE-PACKS-RESEARCH-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-MELEE-PACKS-RESEARCH-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statement (exact, 2026-11-13, question page answer)

"2 Pakete mit Nahkampf-Animationen kaufen?: A: Raussuchen, ich entscheide dann (Empfehlung)"

The recommendation shown was: "A: Ich suche beide Pakete mit Preis und kurzer
Vorschau auf Fab heraus, du entscheidest und kaufst selbst." Context: the free
animations in the project only fight unarmed; for sword and shield and for
two-handed weapons, packs for the Unreal 5 standard mannequin were proposed.

## Tasks

1. Search public web pages (Fab, the publishers' own pages, public preview
   videos' descriptions; read text only, do not play videos) for melee animation
   packs that work on the **UE5 mannequin skeleton** (or retarget cleanly to it):
   - one category **sword and shield**,
   - one category **two-handed weapons** (great sword, great axe or hammer).
   Shortlist 2 to 3 per category. Prefer packs with: idle, walk/run in combat
   stance, several attacks, blocks, hit reactions, deaths, root motion and
   in-place versions, a recent Unreal 5 version, good reviews.
2. Per pack record: exact name, publisher, public page URL, price as shown
   (currency; note sales), number of animations, skeleton (UE5 mannequin / UE4 /
   other), root motion yes/no, engine versions, licence shown on the page
   (Fab Standard Licence or other), a 2 to 3 sentence plain description of what
   is in it, and anything that limits use for creatures that are not humans.
   Mark facts you could not confirm as "not confirmed".
3. Give one recommendation per category with the reason, in plain words.
4. Write `Artifacts/Underreign/Evidence/UR-MELEE-PACKS-RESEARCH-V1/WORKER_RESULT.md`
   (Studio, plus the verify-worker line) and a short copy at
   `Evidence/UR-MELEE-PACKS-RESEARCH-V1/WORKER_RESULT.md` (external).

## Limits

- Research only. Never sign in, create an account, add to cart, buy, download
  or accept anything. Purchases are the Human's alone.
- Do not send any project files, names of local files, or personal data to any
  website or service. Search terms are generic (pack type, engine).
- Studio allowed: `Artifacts/Underreign/Evidence/UR-MELEE-PACKS-RESEARCH-V1`.
  External allowed: `Evidence/UR-MELEE-PACKS-RESEARCH-V1`. Everything else
  read-only. No engine runs.
- Do not reproduce long text from the pages; summarise.
- Do NOT commit or push.
