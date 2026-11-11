# Work Order UR-CREATURE-SAMPLE-V1 — Brand-hound benchmark creature (Blender part)

Project: Underreign (DEC-043). Director: Claude (orchestration only). Worker:
one separate Claude Code subagent. Execution mode: Discovery. Class: Standard.
Parallel order: UR-STYLE-SAMPLE-V3 works in the Unreal project
`StyleSample/UnderreignStyle`; do not touch it and do not start Unreal. The
Unreal import of the hound is a later order.

## Before any mutation

From the Studio repository root run:

```text
python -B Tools/UnderreignDispatchGate/validate_underreign_dispatch.py verify-worker --root . --manifest Artifacts/Underreign/DirectorDispatch/UR-CREATURE-SAMPLE-V1/DISPATCH_MANIFEST.json --work-order Artifacts/Underreign/DirectorDispatch/UR-CREATURE-SAMPLE-V1/WORK_ORDER.md --capabilities Artifacts/Underreign/DirectorDispatch/UR-CREATURE-SAMPLE-V1/CAPABILITIES.json --receipt Artifacts/Underreign/DirectorDispatch/UR-CREATURE-SAMPLE-V1/DISPATCH_RECEIPT.json
```

Stop and report if it does not print PASS.

## Human statements (2026-11-11, exact)

- "Wärst du in der Lage gleichzeitig ein passendes, eher ultrarealistisches Monster zu kreieren als Benchmark für den Einheiten Stil?"
- On the ChatGPT concept image: "Sieht so auf jeden Fall toll aus."
- "C:\GameDev\Underreign_Assets\Meshy — Bild und Zipdatei sind hier eingefügt. In Meshy sieht es ebenfalls sehr gut aus. Ist aber natürlich noch ultra high poli."

The concept image and the Meshy model are the Human's own Underreign content
(DEC-042). Brand-hound look (bible): a lean, long-legged hound of cracked black
crust with glowing ember seams, a glowing brand seal on its flank, a tail that
smokes like a lit fuse, contract rings on an iron collar.

## Tasks

1. Inputs (read-only): `C:/GameDev/Underreign_Assets/Meshy/Basalthund mit glühendem Brandmal.png`
   (concept) and `Meshy_AI_Emberfang_20261111_texture_fbx.zip` (high-poly FBX,
   base colour, normal, metallic, roughness).
2. Blender 5.2 (by script where sensible, results checked by renders):
   - clean the Meshy mesh (holes, floaters, scale, orientation, origin at feet);
   - game mesh: retopology or careful decimation to about 40–60k triangles
     with clean UVs; bake normal (and if useful AO and cavity) from the
     high-poly onto it; keep the Meshy colour; add an emissive mask for the
     ember seams, the brand seal and the tail tip;
   - skeleton for a quadruped (spine, neck, head, jaw, four legs with toes,
     tail chain, collar rings as bones or physics later), weights painted and
     checked at extreme poses;
   - animations at standard speed (24/30 fps): idle (breathing, head and tail
     motion), walk loop, run loop, bite attack, hit reaction, death; natural
     motion, slightly exaggerated for readability; clipping secondary.
3. Export for Unreal: skeletal mesh FBX plus animations and textures into
   `StyleSample/Creatures/BrandHound/` (source folder, not inside the Unreal
   project content), with a short import note for the later Unreal order.
4. Proof: turntable stills (high-poly vs game mesh), close-up of the head and
   collar, wireframe sheet, and moving previews (sharp GIF/WebP) of each
   animation from the side and from the game camera angle (oblique top-down).
5. Studio: copy the concept image byte-identical to
   `Projects/Underreign/References/ArtDirection/brand_hound_concept_v1.png`
   and add a PROVENANCE line (the Human's own ChatGPT image from the Director's
   prompt; used for the Meshy model).
6. `Evidence/UR-CREATURE-SAMPLE-V1/WORKER_RESULT.md` (external) and
   `Artifacts/Underreign/Evidence/UR-CREATURE-SAMPLE-V1/WORKER_RESULT.md`,
   with triangle counts, texture sizes and honest weak points.

## Limits

- External allowed: `StyleSample/Creatures`, `Evidence/UR-CREATURE-SAMPLE-V1`.
  Studio allowed: `Projects/Underreign/References/ArtDirection`,
  `Artifacts/Underreign/Evidence/UR-CREATURE-SAMPLE-V1`. The asset folder is
  read-only. No Unreal. Blender renders in the background (no window in front
  of the Human); keep GPU renders short (Eevee or Cycles with low samples).
- Do NOT commit or push.
