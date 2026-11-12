# Work Order UR-CREATURE-VIDEO-V4 — Hound correction: walk without twitch, full bite without the shake

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V4/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V4/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V4/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-CREATURE-VIDEO-V4/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human verdict on V3 (2026-11-12, exact)

"Gehen: Nicht viel Unterschied zur Vergleichsanimation von vorher. Beide haben ein Zucken an Oberarm(sobald der jeweilige Fuß den Boden verlässt) und Oberschenkel.(Sobald der jeweilige Fuß den Boden berührt und Initialen Druck aufbaut.) Dies müsste nachbearbeitet/behoben werden. Das neue läuft dabei leicht ruhiger und allgemein passend von Form und Muskelspiel.
Beißen: Besser als vorher. Hier geht er allerdings aktuell vorne etwas zu tief runter und die Hinterpfosten kleben wieder am Boden fest.
Was mich interessieren würde ist, die gesamte Animation wie im Video, nur das das Schütteln selbst rausgeschnitten wird. Also beißend nach vorne schnellen, absetzen und zurück setzen."

Then: "Hier starten".

## Background

Read `Evidence/UR-CREATURE-VIDEO-V3/WORKER_RESULT.md` and
`Evidence/UR-CREATURE-VIDEO-V2/WORKER_RESULT.md` (external). The V3 work folder
`C:/GameDev/Underreign_Assets/AnimWork/UR-CREATURE-VIDEO-V3` holds the trained
two-view finder and fits; reuse them (read-only; copy what you need into a V4
work folder). No new Seedance video in this order (no network).

## Tasks

1. **Walk (base: V3 walk).** Find the cause of the twitch at the upper arm
   when a paw lifts off and at the thigh when a paw touches down and takes
   weight (likely a hard switch between locked-paw and swing, an IK/FK or
   pole flip, or a per-frame cap hitting). Measure it (per-frame angular
   velocity of upper arm and thigh around lift-off and touch-down, before and
   after) and remove it with smooth contact transitions, keeping the V3 shape,
   muscle play, calm pace, stance width and no foot sliding.
2. **Bite (source: the V1 bite video, full motion).** The whole motion as in
   the video with only the head-shake part cut out: snap forward biting, land,
   step back to the start pose. Hind paws move with the body where the video
   shows it (no glued hind paws; no sliding either: lift and plant). Less
   front drop than V3 (front of the body not so low). Keep the reach limited
   so it cannot pass through an enemy model (head-tip reach in the 20-35 cm
   range; report it). Clean loop back to idle stance at the end.
3. **Proof.** Sharp moving previews (MP4 and GIF, side and game camera) of
   walk and bite; side by side Seedance source | V4 | V3; a close-up of one
   front leg and one hind leg over a few steps (side view) where the twitch
   was; the joint-velocity numbers before and after; paw slide, stance width,
   reach. Look at the moving result yourself (frame sequences at full rate
   around contacts), not only still sheets.
4. `Evidence/UR-CREATURE-VIDEO-V4/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-CREATURE-VIDEO-V4/WORKER_RESULT.md`.

## Limits

- External allowed: `StyleSample/Creatures/BrandHoundVideo`,
  `Evidence/UR-CREATURE-VIDEO-V4`. Studio allowed:
  `Artifacts/Underreign/Evidence/UR-CREATURE-VIDEO-V4`. Work files only under
  `C:/GameDev/Underreign_Assets/AnimWork/UR-CREATURE-VIDEO-V4` (absolute paths
  only; never create anything directly under `C:/`). The V3 work folder,
  `StyleSample/Creatures/BrandHound` and `C:/GameDev/AnimTools` are
  read-only. Never touch any Hearthlands folder.
- No network, no Seedance calls, no Unreal. Blender in the background, no
  window in front of the Human, no video playback with sound.
- GPU only at partial load (AMD RX 6800 XT): only if a ready backend exists,
  small batches, watch Windows GPU counters, fall back to CPU if it nears full
  load; no driver or power changes. CPU is fine.
- Do NOT commit or push.
