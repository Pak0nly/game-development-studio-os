# Work Order UR-CREATURE-VIDEO-V2 — Better transfer of the Seedance hound videos (time-boxed: walk and bite)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.
Parallel order: UR-STYLE-SAMPLE-V6 runs Unreal in `StyleSample`; no Unreal
here, keep GPU use light (CPU preferred).

**Time box (hard):** the PC switches off around 22:00 local (2026-11-11). Do
walk first, then bite; write the result files by about 21:45 whatever is done.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V2/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V2/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V2/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V2/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human verdict on V1 (2026-11-11, exact)

"Noch zu den Seedance Videos alleine: Der angriff ist sehr Weitreichend und könnte durch Gegnerische Modelle durchspringen. Da muss drauf geachtet werden. Außerdem ist ein teil der Animation wie dieser sich schüttelt. Das kann für was anderes verwendet werden.
Zu den Übertragungen auf das Model: Keine der Animationen ist zu 100% passend. Oft liegt es womöglich an den in Seedance verdrehten Pfoten. Teilweise wurden Pfoten eher hinterhergeschleift als bewegt. Teils weil die Tiefe der Videos nicht klar waren und keine frontal Ansicht Videos erstellt wurden. Besonders im letzten Video von schräg oben sieht man gut, dass die Pfoten zu weit auseinanderstehen.
Der Schwanz bekommt zu wenig Bewegung im allgemeinen. Die Sterbeanimation clipt zum Ende hin stark hin und her, da wurden potentiell die falschen bones durcheinandergeworfen aufgrund fehlendem Tiefenverständnis, als der Hund auf der Seite landet und einige bones direkt hintereinander liegen.
Aber es ist viel potential drin. Die Vides selbst sind gut und es geht jetzt eher um passende Übertragung als um neue Videos."
Then: "Würde er denn 1-2 Animationen noch schaffen? Müssen ja nicht direkt alle am Stück sein. So sehen wir auch wie der Progress läuft und können davon evtl. lernen."

No new Seedance videos in this order.

## Tasks (walk first, then bite)

1. **Walk** (side video plus the three-quarter video as a second view where
   it helps): contact detection with forced lift (no dragged paws), anatomical
   stance width and joint limits from the rig (paws not too far apart, legs
   never cross), depth taken from the rig prior where the video is ambiguous,
   tail with more motion (at least secondary follow-through), collar calm.
2. **Bite**: limit the forward lunge (or keep it in place with a small reach)
   so it cannot pass through an enemy model; cut the head-shake part out as its
   own animation (e.g. tug/shake), keep the rest as the bite.
3. If time remains: death with left/right disambiguation (temporal continuity
   and joint limits so legs cannot swap sides when lying) — only if walk and
   bite are done.
4. Proof: side and game-camera previews, side-by-side vs the V1 fit and the
   hand-built V2, footfall chart, foot slide numbers, stance width measured.
5. `Evidence/UR-CREATURE-VIDEO-V2/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-CREATURE-VIDEO-V2/WORKER_RESULT.md`, with
   what was learned for the next round.

## Limits

- External allowed: `StyleSample/Creatures/BrandHoundVideo`,
  `Evidence/UR-CREATURE-VIDEO-V2`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-CREATURE-VIDEO-V2`. Work files only under
  `C:/GameDev/Underreign_Assets/AnimWork/`. `C:/GameDev/AnimTools` read-only. No
  network, no Seedance calls.
- GPU light; Blender in the background; no window in front of the Human.
- Do NOT commit or push.
