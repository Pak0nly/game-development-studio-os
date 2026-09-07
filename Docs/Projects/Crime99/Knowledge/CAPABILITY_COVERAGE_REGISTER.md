# Crime99 Capability Coverage Register

**Coverage date:** 2026-08-23  
**Coverage status:** `KNOWN LOCAL HOLDINGS CURRENT / ACCOUNT SNAPSHOT VERIFIED 2026-08-22`  
**Purpose:** complete classification surface for known Crime99 tools, packages,
reusable workflows and asset families.

This register answers **what exists, where it exists, what it can help with and
where its detailed guidance lives**. It does not claim that every locally
present asset compiles, runs, visually fits or is adopted. Those claims remain
separate evidence states in the linked capability records.

## Observed Universe

| Source | Scope | Current coverage |
|---|---|---|
| Live canonical project enumeration | Every top-level root below `Assets`, plus `Packages` and `ProjectSettings` | `COMPLETE AT FAMILY/PACKAGE LEVEL` on 2026-08-23, including the Human-provided Industrial Harbour local addition |
| Unity project/version and package lock | Unity `6000.3.19f1`; all 29 direct and 10 transitive locked packages; built-in Editor/engine capability clusters | `COMPLETE AT DECISION-RELEVANT CLUSTER LEVEL` in the Unity Native Capability Atlas |
| Studio `Tools/` enumeration | Every current top-level Studio tool | `COMPLETE AT TOOL LEVEL` on 2026-08-22 |
| [Asset Inventory](../ASSET_INVENTORY.md) | All 45 Assets and the UPM Packages tab in the signed-in Unity account | Frozen account snapshot verified on 2026-08-22; the later local Industrial Harbour addition has not been reconciled through another complete account enumeration |
| [Asset Provenance Register](../../../../Projects/Crime99/Docs/ASSET_PROVENANCE.md) | Imported third-party packages and their known/unknown provenance fields | `CURRENT FOR ITS SEVEN NAMED PACKAGE FAMILIES`; Road Constructor and Decalery provenance still require consolidation |
| [Static Capability Catalogue V1](../../../../Projects/Crime99/Artifacts/Reports/C99-ASSET-TOOLING-AND-PACKAGE-CAPABILITY-CATALOG-V1/FINAL_REPORT.md) | 25,514 identities across its eight declared 2026-08-10 roots | Complete for that frozen scope; it predates the local Road Constructor and Decalery roots and later `_Crime99` work |

The signed-in account was read across both Asset pages and the UPM Packages
tab. This establishes the current account list, not package compatibility,
local import state, runtime success, visual fit, adoption or licence detail.

## Live Root Reconciliation

Counts are filesystem observations, not Unity import or usability proof.

| Root | Files | Non-meta | Bytes | Coverage owner |
|---|---:|---:|---:|---|
| `Assets` root files | 11 | 1 | 3,526 | Top-level folder metadata plus imported Industrial Harbour showcase lighting; Industrial Harbour record |
| `Assets/_Crime99` | 5,004 | 2,330 | 7,830,877,938 | `C99-CAP-CRIME99-WORKFLOWS-001` |
| `Assets/Crime99RCCPIntegration` | 10 | 4 | 74,660 | `C99-CAP-RCCP-VEHICLES-001` |
| `Assets/Decalery` | 306 | 147 | 26,036,314 | `C99-CAP-DECALERY-001` |
| `Assets/Gley` | 1,524 | 684 | 290,738,467 | Gley traffic/pedestrian and urban-road records |
| `Assets/LeartesStudios` | 16,413 | 8,100 | 21,311,629,728 | NYC, Alley, Industrial Harbour, Port and Military records |
| `Assets/PampelGames` | 1,022 | 464 | 155,420,455 | Road Constructor record; Shared roots are package dependencies |
| `Assets/Settings` | 14 | 7 | 69,855 | Unity platform/rendering record |
| `Assets/TextMesh Pro` | 14 | 5 | 2,628,713 | Unity platform/rendering record |
| `Assets/ThirdParty` | 5,944 | 2,779 | 1,555,501,404 | RCCP, focused dependency copies and excluded Fuyoh records |
| `Packages` | 2 | 2 | 9,699 | Unity platform and specialist Unity package records |
| `ProjectSettings` | 25 | 25 | 58,673 | Unity platform/rendering record |
| Studio `Tools` | 117 | 117 | 5,609,544 | Authority, visual-decision and model-routing records |

## Material Local Capabilities

Every material locally present capability has a decision-ready record.

| Capability | Availability | Main uses | Detailed record |
|---|---|---|---|
| Road Constructor 1.9.3 | Installed | Connected road graph, profiles, intersections, branches, ends, ramps, roundabouts, cul-de-sacs | [`C99-CAP-ROAD-CONSTRUCTOR-001`](Capabilities/C99-CAP-ROAD-CONSTRUCTOR-001.md) |
| Decalery 1.2 | Installed | Sparse fitted road wear, repair, markings and runtime/editor mesh decals | [`C99-CAP-DECALERY-001`](Capabilities/C99-CAP-DECALERY-001.md) |
| Gley Traffic and Pedestrian | Installed | Vehicle/pedestrian topology, waypoints, crossings, routes, pools and diagnostics | [`C99-CAP-GLEY-TRAFFIC-PEDESTRIAN-001`](Capabilities/C99-CAP-GLEY-TRAFFIC-PEDESTRIAN-001.md) |
| Gley Urban visible roads | Installed | Ten modular road forms including curves, intersections, crossings, narrowing, overpass and roundabout | [`C99-ASSET-GLEY-URBAN-ROADS-001`](Capabilities/C99-ASSET-GLEY-URBAN-ROADS-001.md) |
| NYC1950s road family | Installed | 3/6/12/24 m entries, L/T/crossings and width transitions | [`C99-ASSET-NYC1950S-ROADS-001`](Capabilities/C99-ASSET-NYC1950S-ROADS-001.md) |
| NYC1950s environment family | Installed | Urban buildings, interiors, props, vegetation, vehicles, characters and street-support assets | [`C99-ASSET-NYC1950S-ENVIRONMENT-001`](Capabilities/C99-ASSET-NYC1950S-ENVIRONMENT-001.md) |
| NYC Alley | Installed | Alley facades, fire escapes, pipes, doors, waste and utility/service dressing | [`C99-ASSET-NYC-ALLEY-001`](Capabilities/C99-ASSET-NYC-ALLEY-001.md) |
| Industrial Harbour | Source present; URP overlay imported | Modular factories, warehouses, loading/service yards, quay edges, silos, tanks, pipes and industrial infrastructure | [`C99-ASSET-INDUSTRIAL-HARBOUR-001`](Capabilities/C99-ASSET-INDUSTRIAL-HARBOUR-001.md) |
| Cyberpunk Port City | Installed | Harbour, industrial, warehouse, utility, container and restrained neon raw material | [`C99-ASSET-CYBERPUNK-PORT-001`](Capabilities/C99-ASSET-CYBERPUNK-PORT-001.md) |
| Military Base | Installed | Industrial perimeter, fencing, gates, towers, storage and security infrastructure | [`C99-ASSET-MILITARY-BASE-001`](Capabilities/C99-ASSET-MILITARY-BASE-001.md) |
| Fuyoh Cyberpunk Diner | Installed but Human-excluded | Discovery only; no current use | [`C99-ASSET-FUYOH-DINER-001`](Capabilities/C99-ASSET-FUYOH-DINER-001.md) |
| RCCP 2.57.0 and Crime99 integration | Installed and accepted package basis | Vehicle physics, setup, damage, AI, camera, audio, VFX, customization and project variants | [`C99-CAP-RCCP-VEHICLES-001`](Capabilities/C99-CAP-RCCP-VEHICLES-001.md) |
| Unity Terrain and hybrid ground | Installed engine capability | Broad grade, landscape, zoning and transition support | [`C99-CAP-UNITY-TERRAIN-HYBRID-001`](Capabilities/C99-CAP-UNITY-TERRAIN-HYBRID-001.md) |
| Unity Splines and ProBuilder | Installed | Bounded custom hard-edge adapter after native options are exhausted | [`C99-CAP-UNITY-SPLINES-PROBUILDER-001`](Capabilities/C99-CAP-UNITY-SPLINES-PROBUILDER-001.md) |
| Unity platform, URP, input and validation substrate | Installed | Rendering, Shader Graph, input, UI, physics/vehicles, Burst data work and tests | [`C99-CAP-UNITY-PLATFORM-001`](Capabilities/C99-CAP-UNITY-PLATFORM-001.md) |
| Unity native engine and Editor capability atlas | Installed engine/editor capability | Problem routing across official packages, 18 built-in modules, core authoring APIs, lighting, diagnostics, performance, build and automation | [`C99-CAP-UNITY-NATIVE-ATLAS-001`](Capabilities/C99-CAP-UNITY-NATIVE-ATLAS-001.md) |
| Crime99-owned production/evidence workflows | Local project-owned | Gameplay code, tests, builders, candidates, material/prefab variants and forensic negative evidence | [`C99-CAP-CRIME99-WORKFLOWS-001`](Capabilities/C99-CAP-CRIME99-WORKFLOWS-001.md) |
| Authority Continuity and Director Dispatch validators | Local Studio tool | Authority drift checks and receipt-bound mutation dispatch | [`STUDIO-CAP-AUTHORITY-CONTINUITY-001`](Capabilities/STUDIO-CAP-AUTHORITY-CONTINUITY-001.md) |
| Human Visual Decision Tool | Local Studio tool | Local prepared-preview Human decisions and deterministic text export | [`STUDIO-CAP-HUMAN-VISUAL-DECISION-001`](Capabilities/STUDIO-CAP-HUMAN-VISUAL-DECISION-001.md) |
| Model Routing validator | Local Studio tool | Static validation of model-routing records | [`STUDIO-CAP-MODEL-ROUTING-001`](Capabilities/STUDIO-CAP-MODEL-ROUTING-001.md) |

## Material Owned Capabilities Not Installed

These products are current account holdings but are not distinct local
canonical project roots. They remain available options for a later authorised
preflight; ownership does not authorise download or import.

| Capability | Account version | Main possible uses | Detailed record |
|---|---:|---|---|
| See-through Shader | 1.9.2 | Camera-obstruction transparency and visibility handling | [`C99-OWNED-SEE-THROUGH-SHADER-001`](Capabilities/C99-OWNED-SEE-THROUGH-SHADER-001.md) |
| Ethereal URP 2024 - Volumetric Lighting & Fog | 2.8.4 | URP volumetric light, fog and atmosphere | [`C99-OWNED-ETHEREAL-URP-001`](Capabilities/C99-OWNED-ETHEREAL-URP-001.md) |
| ARCADE: FREE Racing Car | 3.0 | Lightweight arcade-vehicle reference or disposable comparison | [`C99-OWNED-ARCADE-RACING-CAR-001`](Capabilities/C99-OWNED-ARCADE-RACING-CAR-001.md) |

## Supporting and Dependency Holdings

These are fully classified but do not need separate primary records.

| Holding | Classification | Use / boundary | Parent record |
|---|---|---|---|
| `Assets/PampelGames/Shared` and `Shared.Construction` | Installed vendor dependency | Road Constructor editor/runtime construction support; do not select as an independent road solution | Road Constructor |
| `Assets/Gley/About`, `Common`, `UrbanExample` | Installed vendor support/example | Version/support code and manufacturer example hierarchy; examples are not Crime99 visual proof | Gley records |
| `Assets/ThirdParty/1950sNYC` | Required focused working subset | Cross-root NYC materials/prefabs still referenced; not a second product and not safe cleanup material | NYC environment and roads |
| `Assets/ThirdParty/CyberpunkPortCity` | Focused older working subset | Diagnostic/reference dependency with prior material concerns; not a second product | Cyberpunk Port |
| `Assets/TextMesh Pro` and `com.unity.ugui` | Installed Unity UI dependency | Text and conventional UI; no independent visual-language adoption | Unity platform |
| Unity direct built-in modules | 18 installed engine dependencies | Accessibility, AI, animation, audio, cloth, director, image conversion, IMGUI, JSON, particles, physics, screenshot, Terrain, Terrain physics, UI, UI Elements, vehicles and video | Unity Native Capability Atlas; each module is individually classified there |
| Unity direct official packages | 11 installed packages | Burst, Collections, Editor Coroutines, Visual Studio integration, Input System, ProBuilder, URP, Shader Graph, Splines, Test Framework and uGUI | Unity Native Capability Atlas and narrower specialist records |
| Unity transitive package closure | 10 locked supporting packages | NUnit, Mathematics, hierarchy core, UnityWebRequest, Mono Cecil, Render Pipeline Core/config, Searcher, Settings Manager and Performance Test Framework | Unity Native Capability Atlas; dependencies are not selected independently unless a need makes them material |
| Unity core Editor/engine tools not represented by separate manifest rows | Installed with Unity Editor/core | Scene/prefab/asset authoring, Editor scripting, Undo/Handles/Gizmos, mesh/material APIs, lighting/probes, LOD/occlusion, profiling/render debugging, physics diagnostics, build and capture | Unity Native Capability Atlas |
| `_Crime99` historical prototype families | Project-owned negative/forensic evidence | Prevent repetition; rejected candidates are not reusable baselines | Crime99 workflows |
| `_Crime99` Phase 4/5 builders and evidence assets | Project-owned task-specific workflows | Current/historical candidate construction only under exact Work Order authority | Crime99 workflows |

## Complete Account-Snapshot Classification and Later Local Additions

The last complete signed-in account snapshot contains 45 items: the 37
historical rows below plus the eight additions listed first. `Not local` means
the product was not found as a distinct current canonical project root; it does
not mean the licence has disappeared. Industrial Harbour was provided locally
after that snapshot and is classified below without claiming a refreshed
account total.

### Local addition after the account snapshot

| Asset | Local integration date | Vendor version | Current local state | Knowledge disposition |
|---|---|---:|---|---|
| Industrial Harbour | 2026-08-23 | 1.0 | Source present; URP overlay imported | Detailed Industrial Harbour record; direct visual/shader qualification required before selection |

### Additions after the 2026-07-14 snapshot

| Asset | Purchase date | Current account version | Current local state | Knowledge disposition |
|---|---|---:|---|---|
| See-through Shader | 2026-08-13 | 1.9.2 | Not local | Detailed owned-capability record; consider only for a proven camera-occlusion need |
| Ethereal URP 2024 - Volumetric Lighting & Fog | 2026-08-13 | 2.8.4 | Not local | Detailed owned-capability record; atmosphere option with render/performance preflight |
| Decalery | 2026-08-11 | 1.2 | Installed | Detailed Decalery record |
| Road Constructor | 2026-08-11 | 1.9.3 | Installed | Detailed Road Constructor record |
| 1970 s New York City Alley | 2026-07-24 | 2.0 | Installed local package reports 1.0 | Detailed Alley record; store/local version difference preserved |
| Complete City Traffic & Pedestrian System | 2026-07-15 | 1.5.9 | Installed Gley components | Detailed Gley record; store bundle and local component versions remain distinct |
| Realistic Car Controller Pro | 2026-07-15 | 3.1.0.LTS | Installed accepted basis 2.57.0 | Detailed RCCP record; no upgrade implied |
| ARCADE: FREE Racing Car | 2026-07-15 | 3.0 | Not local | Detailed owned-capability record; RCCP remains the stronger accepted basis |

### Rows already present in the 2026-07-14 snapshot

| Store ID | Asset | Snapshot relevance | Current local state | Knowledge disposition |
|---:|---|---|---|---|
| 244394 | Medieval Village Environment / Camelot | Low | Not local | Owned snapshot; high period/style adaptation; do not import before stronger urban holdings |
| 267026 | Soulslike Throne Room | Not relevant | Not local | Classified irrelevant to first prototype |
| 372260 | Mid-Century Brutalist Data Centre | Medium | Not local | Owned snapshot; possible industrial landmark; preflight required |
| 365638 | Yellow Parrot Restaurant | High | Not local | Owned snapshot; commercial landmark alternative; compare against current exclusions and overlap before import |
| 259095 | Victorian Market in Abandoned Factory | High | Not local | Owned snapshot; industrial/commercial hall candidate; preflight required |
| 272218 | Stylized Azure Hillside | Medium | Not local | Owned snapshot; secondary urban forms with style-harmonisation risk |
| 260586 | Futuristic Rooftop City | Medium | Not local | Owned snapshot; rooftop/neon parts only with strong style restraint |
| 283742 | Cyberpunk Port City | High | Installed | Detailed Port record |
| 381000 | Stylized Desert House | Low | Not local | Owned snapshot; high thematic mismatch |
| 290713 | Bandit Valley Village | Low | Not local | Owned snapshot; generic worn props only if a later gap remains |
| 376856 | Fuyoh Cyberpunk Diner | High historically | Installed, excluded | Detailed Fuyoh exclusion record; do not use |
| 381896 | Stylized Chinese Lost Temple | Not relevant | Not local | Classified irrelevant to first prototype |
| 272232 | Witch Village Environment | Not relevant | Not local | Classified irrelevant except isolated props; no current need |
| 223953 | Stylized Boxing Club | Medium | Not local | Owned snapshot; possible landmark, but prototype interiors are out of scope |
| 290716 | Roman Street Environment | Low | Not local | Owned snapshot; modular reference only, weaker fit than current road holdings |
| 236123 | 1950s NYC Environment Megapack | High | Installed | Detailed environment and road records |
| 217312 | King Arthur Castle Interior | Not relevant | Not local | Classified irrelevant to first prototype |
| 216124 | Military Base Megapack | Medium | Installed | Detailed Military record |
| 223066 | The Blue Metro 2029 | Low | Not local | Owned snapshot; underground/enterable scope excluded |
| 45505 | Wolf Animated | Not relevant | Not local | Classified irrelevant |
| 165180 | MapMagic 2 | Low | Not local | Owned snapshot; large procedural-terrain dependency, use only for a later proven terrain need |
| 52974 | Generic Terrain Brushes | Not relevant | Not local | Legacy/unavailable listing; classified irrelevant |
| 146014 | AllSky Free | Medium | Not local | Owned snapshot; sky/lighting alternative, preflight required |
| 130876 | Photoscanned Mountains/Rocks PBR | Low | Not local | Owned snapshot; boundary rocks only with style/LOD preflight |
| 138810 | Grass Flowers Pack Free | Low | Not local | Owned snapshot; later park/plaza dressing only |
| 12555 | Outdoor Ground Textures | Medium | Not local as distinct root | Owned snapshot; prototype ground/asphalt source, not structural ground solution |
| 6947 | Rock and Boulders 2 | Low | Not local | Owned snapshot; map-boundary props only |
| 57859 | Mr. Mo Character | Low | Not local | Owned snapshot; disposable placeholder at most |
| 196526 | Starter Assets ThirdPerson URP | Technical preflight | Not local | Owned snapshot; bounded reference only, not Crime99 controller architecture |
| 196830 | Banana Man | Not relevant | Not local | Classified irrelevant except disposable rig testing |
| 158707 | Text Animator for Unity Legacy | Low | Not local | Legacy dependency; do not use without modern-version review |
| 168372 | POLYGON Particle FX Pack | High | Not local | Owned snapshot; strong combat VFX candidate; pipeline/style/performance preflight required |
| 174358 | Simple Bundle Complete Collection | Medium | Not local | Owned snapshot; broad placeholder source, never import wholesale |
| 14900 | 2D Art Pack | Not relevant | Not local | Classified irrelevant to 3D prototype |
| 27944 | 2D Isometric Tile Starter Pack | Low | Not local | Layout reference only; no direct 3D production role |
| 7006 | Robot Lab Unity 4x | Not relevant | Not local | Obsolete tutorial; do not import |
| 7677 | Stealth Unity 4x | Not relevant | Not local | Obsolete tutorial; do not import |

## Completeness and Staleness Rules

- A new top-level Asset root, direct Unity dependency, decision-relevant native
  engine/editor capability cluster, Studio tool or ownership row must be added
  here before the Knowledge Base can again claim complete known-holdings coverage.
- Package/version changes stale the affected detailed record, not unrelated
  rows.
- A later signed-in Unity Asset Store refresh stales only the ownership portion
  until additions/removals are reconciled here.
- `UNKNOWN` is valid for runtime or visual fitness. Omission is not.
- No row grants Unity, purchase, download, import, mutation, adoption, licence
  or Git authority.
