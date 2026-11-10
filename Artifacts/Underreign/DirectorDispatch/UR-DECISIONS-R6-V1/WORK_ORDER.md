# Work Order UR-DECISIONS-R6-V1 — Record catalogue round 6 (engine, layer connections, win goals)

Project: Underreign (DEC-041). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Routine.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R6-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R6-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R6-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R6-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human answers (2026-11-10, exact copy)

Before the catalogue: "Wenn ich es schaffen sollte, damit über 1m $ zu verdienen bin ich glücklich. 5% ist dann ok." (about Unreal's 5 % royalty above USD 1 million).

- D-1 "Unity oder Unreal?" Recommendation: "A: Erst eine faire Vergleichsprobe, dann entscheiden. Dieselbe Szene (ein Raum des Aschenbunds über zwei Ebenen, Lavaglühen, Fackeln, ein frisch gegrabener Gang) in Unity und in Unreal, gleiche Kamera, nebeneinander. Du entscheidest beim Ansehen. Bis dahin baue ich nichts in einer Engine, die Nacht kann an Regeln und Bibel weiterarbeiten." Human: "A: Erst Vergleichsprobe (Empfehlung)" | Notiz: "Das bedeutet aber auch wir benötigen Grafiken. Free assets oder Dinge die bereits in meinen Accounts hinterlegt sind wären nutzbar. Auch die Verwendung von Blender zur eigenen Herstellung durch dich ist denkbar."
- D-2 "Wie verbinden sich die Ebenen?" Recommendation A was fixed breakthrough points with the Deep Dwarves drilling new ones. Human: "B: Feste Stellen für alle, ohne Ausnahme" | Notiz: "Tiefenzwerge als Ausnahme wäre zu stark."
- D-3 "„Nur Verteidigen gewinnt nicht.“ Wie gewinnt man dann?" Recommendation: "A: Im fertigen Spiel gewinnt man eine Karte durch ein Ziel, das man aktiv erreichen muss, zum Beispiel ein feindliches Herz zerstören, ein Ziel in der Tiefe erobern oder den Anführer der Oberwelt besiegen. Kreaturen ziehen dafür auch los. Der Prototyp bekommt am Ende ein kleines Angriffsziel: Nach der dritten Welle schickt man seine Kreaturen in das Lager der Abenteurer." Human: "A: Aktive Siegziele, im Prototyp ein kleines Angriffsziel (Empfehlung)" | Notiz: "Wie auch in Dungeon Keeper gillt das Zerstören des gegnerischen Herzens als Siegbedingung. Alternative Objektives, gerade in einer Kampagne, sind gut möglich und bieten auch Story relevante Möglichkeiten."

## Tasks

1. `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`: new section "Concept round 6 — 2026-11-10", UD-46 onward:
   - engine comparison sample before the engine decision; graphics for it may come from free assets, assets already in the Human's accounts, or be made by Claude in Blender; Unreal's 5 % royalty above USD 1 million is acceptable to the Human (D-1 and the remark);
   - layers connect only at fixed breakthrough points on each map, for all peoples without exception; the Deep Dwarves get no exception (D-2); this resolves OD-12;
   - active win goals: destroying the enemy Heart is a win condition (a genre mechanic); alternative objectives, especially in campaigns, are welcome and can carry story; the prototype gets a small attack goal at the end (after the third wave the player sends creatures into the intruders' camp) (D-3); this resolves OD-13.
   Note in the D-2 row that the Deep Dwarves' bible proposal of drilling new breakthroughs is therefore not adopted, and in the D-3 row that the prototype plan (UD-21/UD-34) gains this attack goal as a change.
2. `Projects/Underreign/Docs/OPEN_DECISIONS.md`: OD-11 → "COMPARISON FIRST (UD-…)", with the royalty remark; OD-12 and OD-13 → DECIDED with the new UD numbers; add OD-15 "Assets and Blender for the engine comparison sample" (OPEN: which free or owned assets, Blender availability).
3. `Projects/Underreign/README.md`: next step = engine comparison sample (OD-11).
4. Write `Artifacts/Underreign/Evidence/UR-DECISIONS-R6-V1/WORKER_RESULT.md`.

## Limits

Allowed: the three project files above and the evidence folder. Do not edit `WORK_STATE.md`, `CURRENT_HANDOVER.md`, `GAME_CONCEPT.md` or anything else. No commit, no Unity, nothing under `C:\GameDev`. Report instead of changing the goal.
