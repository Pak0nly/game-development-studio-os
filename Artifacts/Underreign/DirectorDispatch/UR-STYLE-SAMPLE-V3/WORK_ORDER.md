# Work Order UR-STYLE-SAMPLE-V3 — Style sample step 3: choose scans by visual fit, then polish

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V3/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V3/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V3/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-STYLE-SAMPLE-V3/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (2026-11-11, exact)

- Asked whether renders and assets with third-party content may be viewed for review: "Ich hätte erwartet, dass die Assets erst gesichtet werden um die bestmöglich passendsten zu wählen. Also ja, es ist sogar notwendig so zu arbeiten."
- On step 2: "Mein Eindruck ist: Auf jeden Fall besser als Vorher, mit noch viel Luft nach Oben. Wenn hier lediglich nach Namen und evtl. Zahlen gewählt wurde und nicht nach best visual fit, sehe ich da eindeutig noch eine weitere Testschleifen."

## Tasks

1. **Visual survey first**: for every item in
   `C:/GameDev/Underreign_Assets/Fab/VaultCache/FabLibrary` (read-only, 89
   items) make a look preview (surfaces: a lit sphere and a flat tile with the
   material; meshes: a lit turntable still), frame-capped, and put them on
   labelled contact sheets per category (walls/cliffs, floors, lava/volcanic,
   wet/water, debris, decals, metal). Look at every sheet next to the target
   images (`Projects/Underreign/References/ArtDirection/style_target_*.png`,
   Studio repo) and choose per scene role the best visual fit, with a short
   reason per choice (and why the step-2 choice was or was not kept).
2. **Polish the scene** (`L_StyleSample_V3`) with the chosen scans, aiming at
   the target's look:
   - floor: clean worn slabs with real joints and visible wetness/specular in
     the game camera, not blotchy;
   - lava: flowing glow with crust plates and bright seams as in the target,
     not uniform blobs; crust moves slowly;
   - light: cooler fill and higher contrast; warm light only from fire and
     lava; wet highlights readable from above;
   - walls: a strong boulder frame around the room as in the target;
   - forge: real brick and iron detail (hood plates with rivets, anvil with
     proper shape), ornament on braziers;
   - Heart view: less red wash, readable shapes.
3. Proof as in step 2 (same cameras, units still, camera move, side-by-side
   step 2 | step 3 | target for game camera and forge close-up, GPU table
   capped) plus the survey contact sheets.
4. Studio `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`: one row quoting
   the Human's first statement: third-party assets and renders containing them
   may and must be viewed (locally, by the Workers and the Director) to choose
   and review them; they still never go to AI training or to outside AI
   services (DEC-025 unchanged).
5. `StyleSample/README.md`, `Evidence/UR-STYLE-SAMPLE-V3/WORKER_RESULT.md`
   (external) and `Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V3/WORKER_RESULT.md`.

## Limits

- External allowed: `StyleSample`, `Evidence/UR-STYLE-SAMPLE-V3`. Studio
  allowed: `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`,
  `Artifacts/Underreign/Evidence/UR-STYLE-SAMPLE-V3`. Asset library read-only;
  import only what the scene uses.
- **Power safety (hard)**: every Unreal run capped at 30 fps and verified per
  tick, offscreen, short; never `-benchmark`, no Movie Render Queue, no path
  tracing; never run while another UnrealEditor process runs; never a window in
  front of the Human. Build parallelism at most 8.
- Do NOT commit or push.
