# Work Order INK-WEB-V1 — Playable browser design prototype on the ink core

Project: Inkweight (DEC-044). Director: Claude (orchestration only). Worker: one
separate Claude Code subagent. Execution mode: Production. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python3 -B Tools/InkweightDispatchGate/validate_inkweight_dispatch.py verify-worker --root . --manifest Artifacts/Inkweight/DirectorDispatch/INK-WEB-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Inkweight/DirectorDispatch/INK-WEB-V1/WORK_ORDER.md --capabilities Artifacts/Inkweight/DirectorDispatch/INK-WEB-V1/CAPABILITIES.json --receipt Artifacts/Inkweight/DirectorDispatch/INK-WEB-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human authority (exact, 2026-11-19)

"Ja. Du hast bis 9 Uhr Zeit daran zu arbeiten. [...] Nutze die Zeit bis 9 Uhr
voll aus und suche dir selbst passende Aufgaben. Ziel ist ein spielbarer
Prototyp, oder zumindest die Vorbereitung dessen."

## Read first

`Projects/Inkweight/Docs/GAME_CONCEPT.md`, `INK_RULES_V1.md`,
`Projects/Inkweight/Source/Shared/RULES_AS_BUILT.md`,
`Projects/Inkweight/Source/WebPrototype/core/README.md` and the core itself.

## Objective

A playable browser prototype the Human can open on a phone or a PC tomorrow
morning to judge one question: is drawing with ink fun? It is a design tool,
not the product (the product is built in Unity). It must feel good enough that
the answer is about the game idea, not about a clumsy test page.

## Tasks

1. **Drawing screen** (the heart): 32 x 32 canvas, finger and mouse drawing
   with smooth strokes between samples, black plus three colours, eraser, undo,
   clear, ink meter, time limit where the mode asks for it, and a **live stat
   display** that changes with every stroke (weight, armour, sharpness, speed,
   element) with a one-line plain explanation of each. Show which cells are
   sharp and which are core in a subtle way, and show drips falling off. The
   figure preview wobbles and hops already while drawing.
2. **Mode B, the Ring**: 2 to 4 seats, each human or bot. On one PC: drawing in
   turns (pass the device or mouse), then playing with keyboard zones and
   gamepads where the browser offers them. On a phone: one human with touch
   steering (drag anywhere to steer, a dash button) against bots. Bots use
   drawings from the local gallery and a small set of built-in test scribbles
   that are visibly marked as placeholders. Rounds, first to 3, catch-up ink,
   a short result screen that says why someone lost (ring-out or armour).
3. **Mode A, Solo Arena**: draw hero and weapon, then per wave draw one enemy
   design and pick the stake, fight, collect ink, pick an upgrade, 5 waves and
   the boss, a result screen with the score. Touch and keyboard.
4. **Look and feel** (all by code, no image or audio files, nothing generated
   by a model): paper background, drawings rendered from their cells with a
   wobbling outline, squash and hop, ink splashes on hits, screen shake kept
   mild, simple synthesizer sounds through Web Audio started by a button, a
   mute switch. Respect `prefers-reduced-motion`.
5. **Gallery**: drawings are kept in the browser only (`localStorage`, every
   access in try/catch; the game must work without it). A line on the start
   screen says that drawings stay on this device.
6. **Start screen and language**: all player-facing text in German, plain and
   short. One sentence states the rule: amount is weight, filled areas are
   armour, thin lines are blades, colour is the element. A first-run hint, no
   long tutorial.
7. **Build**: sources as ES modules under
   `Projects/Inkweight/Source/WebPrototype/app/`; a dependency-free Node build
   script writes two single files into `Projects/Inkweight/Source/WebPrototype/dist/`:
   `inkweight.html` (complete standalone page) and `inkweight.artifact.html`
   (the same page as an Artifact fragment, see the page rules below). The core
   is used unchanged from `core/`; the tuning JSON is inlined at build time.
8. **Verification with the pre-installed Playwright** (`require('playwright')`,
   `chromium.launch()` with no options; never install Playwright or a browser;
   pass no tracing): automated runs at phone width (about 400 px, touch) and at
   desktop width that draw a figure, play a Ring round against bots to its end
   and play the solo arena through at least one wave, with no console errors
   and no horizontal page scroll. Save about 8 screenshots (device scale factor
   2) of the main screens into the evidence folder and look at them yourself;
   fix what looks broken or unreadable.
9. **Evidence** `Artifacts/Inkweight/Evidence/INK-WEB-V1/`: `WORKER_RESULT.md`
   (verify-worker line, what was built, commands and real output, what you saw
   in the screenshots, known weaknesses, anything not done) and the screenshots.

## Page rules for `inkweight.artifact.html` (the hosting frame enforces them)

- No `<!DOCTYPE>`, `<html>`, `<head>` or `<body>` tags: the file starts with
  `<title>Inkweight</title>`, then
  `<meta name="claude:viewport-fit-sides" content="cover">`, then `<style>`.
- No network requests at all: no external scripts, fonts, images or fetches.
  System font stacks only.
- One outer wrapper carries `padding-left: max(16px, env(safe-area-inset-left, 0px))`
  and `padding-right: max(16px, env(safe-area-inset-right, 0px))`; vertical
  padding with `padding-block`. The page body never scrolls sideways at 400 px.
  Size the one-screen game with `height: 100%` on `html` and `body`, not `100vh`.
- The paper look is one committed visual world: define every colour as a token
  on `:root`, set an explicit `body` background and text colour, use no literal
  colours in component rules. No separate dark theme is needed.
- `alert`, `confirm` and `prompt` do nothing: build confirmations into the page.
  Downloads, printing, microphone and camera are unavailable. Sound only after
  a tap. Fullscreen may be refused: treat it as optional.
- Toggle visibility with `el.hidden`. Give every form control a stable `id`.
  Keyboard focus must be visible.

## Allowed mutations

Only explicitly listed mutations are authorised; everything else is out of
scope: `Projects/Inkweight/Source/WebPrototype/app`,
`Projects/Inkweight/Source/WebPrototype/dist`,
`Projects/Inkweight/Source/WebPrototype/build`,
`Artifacts/Inkweight/Evidence/INK-WEB-V1`.

## Task-specific controls

- Capability Knowledge Base query: NOT APPLICABLE for the Unity knowledge base
  (browser design tool, plain web platform features, no package or asset).
- Planned setup: none. Candidate-attempt start condition: first build that
  loads without console errors. Candidate-attempt allowance: one candidate.
  Operational-recovery allowance: Core default. Formal stage-correction
  allowance: 2 rounds. Task-owned namespaces: the allowed paths.
- The core (`core/`), the shared files and the tuning numbers are read-only
  for you. If the core has a bug or lacks something you need, work around it in
  the app where that is clean, and report it exactly; do not edit the core.
- No downloads, no installs, no npm packages, no network use.
- Original work only; do not imitate the look, names or content of any existing
  game. Built-in test scribbles are hand-written cell data by you.
- You may use subagents in parallel for independent files.
- Time: check `date -u`; aim to return within about 120 minutes and at the
  latest after 150 minutes, with an honest list of what is unfinished. Order of
  priority: drawing screen, Ring, solo arena, polish.
- Do NOT commit or push.

## Success

Both dist files exist and are current; the automated runs pass with real
output shown; screenshots were looked at; a person can draw, fight in the Ring
and play a solo run on a phone and on a PC without instructions.

## Stop

Stop and report on verify-worker failure, any need outside the allowed paths,
or a protected change.
