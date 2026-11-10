# Work Order UR-DECISIONS-R5-V1 — Record catalogue round 5 (after night shift 1)

Project: Underreign (DEC-041). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Routine.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R5-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R5-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R5-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-DECISIONS-R5-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human answers (2026-11-10, exact copy)

"ja" / "Ja, Empfehlung" = the recommendation exactly as written in brackets.

- N-1 "Ist der Plan für den Prototyp so freigegeben?": Ja, Empfehlung [Ja, freigegeben.]
- N-2 "Darf ich für den Unity-Start einmalig alles Nötige einrichten?" (card text: three Unity add-ons — graphics, mouse and keyboard input, automatic tests; install Unity 6.6 if missing; after every night fetch its reviewed results onto the PC; after every finished and reviewed Unity job commit in the Unity folder, without asking each time): Ja, Empfehlung [Ja, als dauerhafte Erlaubnis für Underreign.]
- N-3 "Welches Grafiksystem in Unity?": C: Leicht jetzt, nach der ersten Bildprobe neu prüfen | Notiz: "Bevor wir starten zur Diskussion: Was wäre, wenn wir Unreal Engine nutzen würden? Grafisch würde da viel mehr drin sein."
- N-4 "Was passiert, wenn der Spieler sein Herz komplett einmauert?" (recommendation A: Brutes dig through the softest wall or down through the floor; the last stair to the Heart cannot be removed during a wave): A: Abenteurer graben sich durch (Empfehlung) | Notiz: "Seitenwände sind wie bei Dungeon Keeper immer einreißbar, haben nur unterschiedlich viel HP/Rüstung. Decke und Boden sind es jedoch nicht. Erklärung für Spieler: Ebenen sind nicht direkt aneinander liegend, es ist jeweils eine gewisse Dicke zwischen ihnen. Evtl sind sie nur via vorgegebenen Positionen verbindbar? Steht zur Diskussion."
- N-5 "Glück: Soll so viel davon abhängen, welche Kreaturen zuerst kommen?": Anders | Notiz: "Balanceing später. Es ist ja noch nichtmal klar wie viele Kreaturen es geben wird, was diese können und welche taktischen Möglichkeiten zur Verfügung stehen werden."
- N-6 "Wie viele Kreaturen sollen ein Spiel überleben?": A: So lassen, in den Testrunden beurteilen (Empfehlung) [A: Die Regeln so lassen, Kreaturen dürfen sterben. Das Ziel für den Prototyp auf etwa die Hälfte senken und in deinen Testrunden beurteilen.] | Notiz: "Ich verstehe nicht ganz 'Spiel überleben'. Es werden keine Kreaturen in ein nächstes Spiel/Runde übertragen?"
- N-7 "Wie wichtig soll steigende Hitze im Prototyp sein?": A: Hitzekamine testen (Empfehlung) [the "heat chimneys" variant is played next to the default map]
- N-8 "Wie schwer soll der Prototyp sein?": A: So lassen (Empfehlung)
- N-9 "Wie viel der Verteidigung sollen Fallen tragen?": B: Kreaturen bleiben die Hauptsache | Notiz: "Nur Verteidigen gewinnt nicht."
- N-10 "„Der Schläfer“ für die Gefahr von unten?": A: Kein Eigenname (Empfehlung) [no proper name on screen; "what sleeps below" and each people's own word for it]
- N-11 "Die Kreatur „Oathkeeper“ heißt jetzt „Oath-warden“ (Eidwächter). Einverstanden?": Ja, Empfehlung [Ja, Oath-warden behalten.]
- N-12 "Die Arbeiter des Myzelchors hießen „Sporelings“. Umbenennen?": Anders | Notiz: "Sporelings als Kreaturen/Einheiten Name ist passendste. Eine Knospe wird nicht mit Pilzen assoziiert."
- N-13 (full-game direction) was not answered: stays open.

## Tasks

1. `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`: new section "Night shift 1 questions — 2026-11-10" with UD-34 onward, one row per answer above, quoting question, recommendation (where given) and answer/note. Record as decisions only what is explicit:
   - plan approved (N-1); standing Unity-start approvals as listed (N-2); light pipeline (URP) now, re-check after the first look sample (N-3; the Unreal question is a discussion, see OD-11 below, not a decision);
   - layer rules (N-4): side walls can always be broken down and differ only in hit points/armour; ceilings and floors between layers cannot be broken; layers are separated by a thickness of rock; recommendation A otherwise accepted; whether layers connect only at predefined positions is open (OD-12). Note that this supersedes the night's "Brutes dig down through the floor" part of recommendation A, which is therefore NOT adopted;
   - balancing of the creature mix postponed until creatures and tactics are clearer (N-5);
   - creature survival: rules unchanged, prototype target about half, judged in test plays (N-6) — plus the Human's question as a note;
   - heat chimneys variant played next to the default (N-7); difficulty unchanged (N-8);
   - creatures stay the main defence, traps support (N-9) with the remark "Nur Verteidigen gewinnt nicht." recorded as a remark (direction for later, see OD-13);
   - no proper name for what sleeps below (N-10); Oath-warden kept (N-11); "Sporelings" kept as the name of the Mycelid Choir's creatures/units, the rename is rejected (N-12), with the outside-use risk noted for the title and name check (OD-02).
2. `Projects/Underreign/Docs/OPEN_DECISIONS.md`: OD-04 (render pipeline) → "DECIDED for now: URP; re-check after the first look sample (UD-…)"; add OD-11 "Engine: Unity or Unreal Engine" (OPEN, Human discussion 2026-11-10; DEC-041 currently fixes Unity), OD-12 "Do layers connect only at predefined positions?" (OPEN), OD-13 "Winning needs more than defending (\"Nur Verteidigen gewinnt nicht.\")" (OPEN, direction for the full game and possibly the prototype goal), OD-14 "Full-game direction questions from night shift 1 (eight questions)" (OPEN, unanswered).
3. `Projects/Underreign/README.md`: next step = engine discussion (OD-11) before the Unity start; risks add the engine question.
4. Write `Artifacts/Underreign/Evidence/UR-DECISIONS-R5-V1/WORKER_RESULT.md`.

## Limits

Allowed: the three project files above and the evidence folder. Do not edit `WORK_STATE.md`, `CURRENT_HANDOVER.md`, `GAME_CONCEPT.md` or anything else. No commit, no Unity, nothing under `C:\GameDev`. Report instead of changing the goal.
