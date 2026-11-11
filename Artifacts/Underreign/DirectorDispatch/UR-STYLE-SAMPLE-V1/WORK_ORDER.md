# Work Order UR-STYLE-SAMPLE-V1 — Dark realistic style sample (environment) at game level

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.
Parallel orders: UR-SIM-ROUND7-V1 (`SimulationCpp`) and UR-UNREAL-NIGHT2-V1
(`Game`); never touch their paths.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (2026-11-11, exact)

- "Wenn wir allgemeine einen dunklen, realistischen, angsteinflößenden, blutigen, ernsten Stil anstreben würden. Wäre das realistisch umsetzbar? (Hier sehe ich die Stärken der Unreal Engine)"
- To the proposal (realistic light, material and mood; creatures slightly exaggerated in form and motion for readability; one sample first): "Gerne testen. Gerne mit allen Tricks die Unreal bietet um das Maximum rauszuholen. Ich habe aktuell die Höllenkampf cinematic von Diablo 4 im Kopf. (Nur eben auf Spielniveau.)"

The named cinematic is a **mood reference only** (dark, infernal, brutal, serious,
heavy atmosphere). Originality is a hard rule: copy no design, character,
creature, architecture, symbol, composition or colour script from Diablo or any
other existing game. Underreign's Ashen Pact look comes from
`C:/GameDev/Underreign/Design/Art/` and `Design/Snapshot/ArtDirection/`
(glass horns with contract rings, ash, ember, heat).

## Tasks

1. **Separate Unreal 5.8 project** `C:/GameDev/Underreign/StyleSample/` (own
   `.gitignore`, LFS for binary assets via the repository's attributes), so it
   never collides with the `Game` project.
2. **One scene: a corner of an Ashen Pact realm**, two layers visible, at the
   real game camera (oblique top-down as in `Game`) and in a close view:
   rough-hewn rock walls and floor, a claimed floor area (worked stone with
   ember-lit seams), a corridor into fresh rock, a lava channel, a Forge-like
   room corner, torches/braziers, ash and ember particles, smoke and volumetric
   fog, heat haze over lava, blood decals and drag marks at a fight spot, chains
   and contract-ring motifs as set dressing, the Heart's glow in the distance.
3. **Use what Unreal 5.8 offers for maximum quality at game level**: Lumen
   (hardware ray tracing), Nanite geometry with real displacement or tessellated
   detail, virtual shadow maps, Substrate or layered materials (wet rock, soot,
   cooled lava crust), Niagara (embers, sparks, smoke, dripping), volumetric fog
   and light shafts, local exposure, colour grading and film-style post (grain,
   vignette, subtle chromatic aberration), decals, emissive lava driving light.
   Assets: engine content, procedural materials and your own Blender-made
   meshes; no downloads and no Fab/Megascans content in this order (list which
   Megascans surfaces would lift quality most, for a later step with the
   Human's account).
4. **Readability check**: the same view with three placeholder units (own
   creature, intruder, trap part) to judge whether things stay readable in the
   dark style; note what lighting or outline aids are needed.
5. **Proof**: stills 1920×1080 from the game camera and two close views; a
   short sharp camera move (about 6 s) as an animated WebP or GIF (Pillow, no
   ffmpeg); a scalability table (High vs Epic: GPU ms, frame-capped).
6. `StyleSample/README.md` (how to open and capture),
   `Evidence/UR-STYLE-SAMPLE-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V1/WORKER_RESULT.md` (Studio),
   including an honest list of what still looks fake and what a creature sample
   from Meshy plus Blender would need.

## Limits

- External allowed: `StyleSample`, `Evidence/UR-STYLE-SAMPLE-V1`. Studio
  allowed: `Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V1`. Everything else
  read-only. No downloads, no Fab content.
- **Power safety (hard)**: the Human's PC switches off under full GPU load.
  Every Unreal run frame-capped (`t.MaxFPS` 30 for captures, 60 at most),
  offscreen, short; no Movie Render Queue, no path tracing, no uncapped
  benchmarks. Never run your Unreal process while another UnrealEditor process
  is running (another Worker uses `Game`): wait and check again. Never a window
  in front of the Human. Build parallelism at most 8.
- Do NOT commit or push.
