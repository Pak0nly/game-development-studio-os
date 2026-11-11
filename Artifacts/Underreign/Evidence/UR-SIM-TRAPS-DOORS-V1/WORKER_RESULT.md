# Worker result — UR-SIM-TRAPS-DOORS-V1 (hidden traps and lockable doors, rules version 24)

Status: done, **not committed** (the Work Order forbids commits); awaiting independent review. Base: `e54c061`
(rules 23). Work Order: Studio `Artifacts/Underreign/DirectorDispatch/UR-SIM-TRAPS-DOORS-V1/WORK_ORDER.md`
(verify-worker printed PASS, receipt `3a0a3248...a89c`). Changed here: `SimulationCpp`, this folder; in the Studio
`Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`, `OPEN_DECISIONS.md` and the copy of this file. `Game` and
`StyleSample` were not touched. The run was cut once by a network error (operational recovery: state checked with
`git status` / build, then continued; no work lost).

## Kurzfassung (Deutsch)

- **Versteckte Fallen:** Jedes Fallenteil ist für Eindringlinge unsichtbar, bis es in ihrer Sicht auslöst (5 Felder,
  freie Linie), ein Späher es entdeckt (Wirkteile jetzt auch, 40 % pro Sekunde) oder die Laterne es zeigt, oder bis
  Überlebende einer früheren Welle es gesehen haben (nur die gesehenen Teile einer bekannten Maschine). Brutes zerschlagen
  nur enthüllte Teile auf ihrem eigenen Feld oder dem nächsten Schritt; nur der Sapper (Fallenbrecher) zerlegt enthüllte
  Teile neben sich. Der Frettchenmann ist aus Crownkiln raus; jede Karte hat höchstens einen Fallenbrecher-Typ, nie in
  Welle 1.
- **Abschließbare Türen:** Holztür (30 Gold, 300 Lebenspunkte) und Eisentür (100 Gold, 1200), in der Schmiede gemacht,
  von einem Cinderling eingesetzt, nur in einem 1 Feld breiten Gang auf eigenem Boden. Der Spieler schließt auf und zu
  (neuer Befehl). Verschlossen hält sie Eindringlinge auf: Brutes und Sapper brechen sie auf, andere warten oder nehmen
  einen günstigeren Umweg. Eigene Kreaturen und Cinderlings gehen durch jede Tür. Kaputte Türen werden für den halben
  Preis repariert, Abriss gibt die Hälfte zurück. Das automatische Fernhalten vom Eingang ist weg.
- **Balance (1000 Spiele):** Fünf Karten werden viel leichter (Cinder Hollow 42 % → 96 % gewonnen), Crownkiln viel
  schwerer (66 % → 14 %). Anteil des Fallenschadens am Schaden gegen Eindringlinge: Cinder Hollow 47 % → 56 %,
  Crownkiln 35 % → 38 %, Bellows Gallery 12 % → 23 %. Die Karten müssen neu ausbalanciert werden (offener Punkt 1).
- 906 Tests grün (vorher 897), neun neue Golden Replays, zwei Durchläufe von 200 Spielen mit identischen Hashes.

## 1. Rules (rules 23 -> 24; `SaveWriter::RulesVersion` = 24; new numbers are proposals)

### Hidden traps (task 1, UD-75)

| Rule | Now | Code |
|---|---|---|
| What is hidden | Every trap part (plate, tripwire, vent, charge, snare, hatch); doors never | `TrapSpotting::IsHiddenKind` |
| Revealed by firing | A trigger that fires and an effect that fires (before its hits) are revealed to the wave of every active intruder on that layer within `spot.SightRadius` **5** of a covered cell with a clear line (`CombatSystem::ClearLine`; its own cell counts). Ferrets and guards see nothing. Event `TrapRevealed` (A part, B wave, C intruder, D cell) | `TrapSpotting::RevealInSight`, called in `TrapSystem::FireTrigger` and `TrapEffects::Fire` |
| Scouts | Roll as before for plates (40 %), tripwires (70 %), closed hatches (40 %); now also effects, `spot.EffectChance` **40 %**; +15 % for a known kind | `TrapSpotting::ChanceFor` |
| Lamplighter | Lantern reveals every hidden part within 4 cells (now effects too) | unchanged code, more kinds |
| Survivors' report | Unchanged choice of the reported machine; the known machine keeps only the parts its wave saw (`KnownMachine::SeenIds`, hashed). Later waves see only those; only a seen trigger gets the avoid cost; the known-damage reduction is unchanged | `TrapMemory::Learn(..., onlySeen)`, `OnWaveEnded`, `IsKnownSeen`, `IntruderFieldSet::RebuildExtra` |
| Avoid cost | On spotted / revealed triggers and hatches only (not on effects) | `RebuildExtra` |
| Brute bashing | Only a revealed part on its own cell or next step toward its goal | `IntruderBrain::FindBashTarget` |
| Sapper | Trap breaker (`IntruderDef::Disarmer`): revealed parts next to it; `intruder.BashOnRouteOnly = 1` limits it to its route too | same |
| Trap breakers on maps | Crownkiln: Ferreter replaced by the Scout in waves 2 and 3 (its rules-14 waves). Breakers now: Ashthread Drift Sapper (w2, w3), CH New Intruders Sapper (w2), Crownkiln Sapper (w3), Inkdrip Shelf and its lava variant Sapper (w3); none elsewhere. The Ferreter stays in the rules for a later map | `Data/Maps/test/crownkiln.map.txt` |

### Lockable doors (task 2, UD-76)

| Rule | Now | Code |
|---|---|---|
| Parts | `TrapPartKind::WoodDoor` 6 (30 gold, forge 50 ticks, 300 hp, path cost 180), `IronDoor` 7 (100 gold, forge 200 ticks, 1200 hp, path cost 720); keys `trap.<Door>.Cost/.ForgeTicks/.Hp/.PathCost` | `PrototypeContent`, `TrapPartDef::DoorHp/DoorPathCost` |
| Building | `PlaceTrapPartCommand` (facing ignored): Forge needed, paid at once, forged, fitted by a cinderling (PlacePart job) | the part pipeline |
| Placement | Claimed, walkable, a 1-wide corridor cell (two open opposite neighbours, the other two closed; else `NotACorridor` 21); no Heart/Call-stone/entrance/room, no stair/shaft/hatch on it or from above, no trap part on it; afterwards no trigger on it, a Tripwire line stops at it, it cannot be chained | `TrapSystem::CheckPlacement`, `IsCorridorCell`, `Link` |
| Lock | `SetDoorLockCommand <id> <1/0>`; refusals `InvalidTarget`, `NothingToDo`; new doors locked; event `DoorLockChanged` | `Commands/SetDoorLockCommand`, `TrapSystem::SetDoorLock` |
| Blocking | Locked + fitted + unbroken (`TrapPart::Bars`) -> `Grid::Barred`; `PathProfile::Intruder` (movement, intruder A*) cannot enter; Walker and Flyer pass | `WalkGraph::TryStep`, `PathFinder::Search`, `Grid::SetBarred` |
| Path costs | Shared intruder fields use `PathProfile::IntruderPlan` (no block) and add the door's path cost on its cell while it bars: a cheaper way round wins | `IntruderFieldSet` |
| At the door | Next step a barring door: Brute or Sapper breaks it (Bash action on the door, `Attack x DoorDamagePercent / 100` every `AttackEveryTicks`; Brute 100 %, Sapper **300 %**; `DoorHit`); others wait (stuck timer: flee after 60 s) | `IntruderBrain::ChooseAction`, `IntruderSystem::BashTick`, `TrapSystem::HitDoor` |
| Broken | At 0 hp: Broken, no bar, `DoorBroken` (D = breaker type), Repair job at half price; repaired: full hp, bars again if locked, `DoorRepaired` | `HitDoor`, `CompleteService` |
| Removal | `RemoveTrapPartCommand`, half refund, bar removed | `TrapSystem::Remove` |
| Last route | A locked door does not cut the last route (it can be broken) | `LastRouteRule` uses `IntruderPlan` |
| Keep-out removed | `worker.EntranceKeepOut`, the job-board test, the walk home (`FleeTarget` 4), `WaveSystem::NearLiveEntrance`, `WorkerSystem::PathHome` deleted; the key is gone from every tuning file and is refused if set | `JobBoard`, `WorkerSystem`, tunings |

View, events, metrics, bots: `TrapPartView` appended `SeenByWaves`, `KnownSeen`, `Locked`, `Hp`, `MaxHp`, `Bars`; events
appended `TrapRevealed`, `DoorLockChanged`, `DoorHit`, `DoorBroken`, `DoorRepaired`; CSV/metrics appended
`traps_revealed_by_firing`, `doors_placed`, `door_lock_changes`, `door_hits`, `door_damage`, `doors_broken`,
`doors_repaired` (doors excluded from the trap-part counts and per-kind arrays); ASCII `|` locked, `/` open or broken;
opt-in bots `reasonable-doors`, `reasonable-varied-doors` (up to two locked iron doors at route chokepoints, never
unlocked; the standard bots fit none).

## 2. Tests (906 pass with `build.bat`, MSVC release, no warnings; was 897)

New: `Tests/Rules24Tests.cpp`, 18 tests (hidden kinds and keys; hidden vent not bashed; reveal in sight, radius and
layer; Scout effect chance and Lamplighter; known machine keeps only seen parts; unseen known trigger not avoided; door
placement rules; Forge pipeline, price and half refund; lock command; Scout held, unlocked passes; Brute breaks
(12 hits), walks on, repair; Sapper 300 %; walkers pass, intruder paths do not; door path cost and the way round; last
route; keep-out gone; one breaker type per map, none in wave 1, Crownkiln without Ferreter; door bot vs standard bot).
New golden case `golden_doors_seed1_won`.

Removed: `Tests/Rules19Tests.cpp` (10 tests of the removed keep-out; one of its situations is kept, inverted, in
`Rules24Tests.TheEntranceKeepOut_IsGone_...`).

Changed, and why (each because the decided rule changed what the test asserted):
- `IntruderTests.Intruder_BruteBashesAdjacentPart_RepairJobRestoresIt`, `NewIntruderTests.Sapper_DisarmsAnAdjacentPart_FasterThanABrute`,
  `Rules15Tests.TrapBroken_CarriesTheBreakersType`: the vent is hidden now; it is marked revealed first (the tests are
  about bashing, repair and the breaker type).
- `IntruderTests.Intruder_BruteBashesHiddenPlateOnlyWhenSpotted`: first half now asserts that the plate is bashed only
  after it fired and was revealed (stepping on it reveals it).
- `Machines/MachineMaps::BruteBreaks` (used by DownPayment, HotCorridor, KindlingBelow, LongFall tests): the breaker is
  a Sapper on a revealed part (a Brute no longer bashes parts beside its route); the tests are about a broken part and
  its repair.
- `WaitingRoomTests` -> `Rules24_WaitingRoom_BruteWalksPastTheHiddenCharge_TheBlastCatchesHim`, `WarmWelcomeTests` ->
  `Rules24_WarmWelcome_Brute_DoesNotSeeTheSnare_IsHeld_TheDelayedBlastLands`, `TrapEdgeTests` ->
  `Rules24_Brute_WalksPastTheHiddenVent_BurnsOnThePlate_BashesIt_FallsThroughTheHiddenHatch`, `BashRouteTests` ->
  `Rules24_ABruteLeavesARevealedSidePartAlone_ASapperBreaksIt_UnlessTheKeyIsOn`: the old tests asserted the old
  visibility and side bashing; the new ones assert the new rules.
- `Rules16Tests.Ferrets_SpotNothing_...`: the Healer is held too (a wire firing in its sight would now be revealed to
  it; the test is about ferrets).
- `LivenessTests.Crownkiln_FerreterReleasesFerrets`: plays Crownkiln with its rules-23 wave 2 put back in the text
  (the Ferreter left the map; the built Ferreter numbers are still checked in a bot play).
- `BotHintTests.ReasonableBot_WinHoard_KeepsTheGoldFromTheLastWavesWarning`: seeds 1-40 instead of 1-10 (fewer parts
  are broken before they work, so fewer late repairs).
- `SaveTests.AllCommands`: `SetDoorLockCommand` added (round trip of every command).
- `HeadlessTests` golden names (`newintruders_seed1_won`, `inkdrip_seed3_won`, new `doors_seed1_won`),
  `OpeningVariationTests` hash `47233054b422c9cf`.

Golden replays re-recorded (rules-23 files and tuning in `SimulationCpp/Data/ReplaysLegacy/rules23`); every one passes
`ur_headless replay`: `golden_reasonable_seed1_lost` (`47233054b422c9cf`), `golden_reasonable_seed5_won`
(`8e05d1a6b4a933cc`), `golden_banner_seed4_lost` (`d8f653d578a6df63`), `golden_idle_seed1_lost` (`bddf75effaeaacfa`,
unchanged), `golden_doors_seed1_won` (`30070e99ce6479bc`, new), `golden_newintruders_seed1_won` (`2a7cf42d6161a056`),
`golden_crownkiln_seed1_lost` (`018e5ac479261820`), `golden_ashthread_seed1_lost` (`436db527fdf002ae`),
`golden_inkdrip_seed3_won` (`eb022700d56e6f66`). Determinism: two batches of 200 seeds (Crownkiln, door bot) gave 200 of
200 equal final hashes.

## 3. Balance (1000 seeds per row, `prototype.tuning.txt`, reasonable bot; rules 23 binary of `e54c061` vs rules 24)

Trap damage share = trap hits plus vent-column heat credited to a machine, of all damage to intruders.

| Map | Won 23 -> 24 | Trap damage share | Creature share | Parts broken / play | Cinderling deaths / play | Door bot (opt-in) won | Door hits / broken per play |
|---|---|---|---|---|---|---|---|
| Cinder Hollow | 42.4 % -> **96.4 %** | 46.7 % -> 56.2 % | 51 % -> 42 % | 16.1 -> 18.7 | 0.07 -> 0.05 | 98.9 % | 28 / 0.21 |
| Cinder Hollow (varied) | 33.3 % -> 89.5 % | 46.5 % -> 54.9 % | 51 % -> 44 % | 15.3 -> 17.9 | 0.09 -> 0.11 | - | - |
| CH New Intruders | 40.5 % -> 87.0 % | 48.5 % -> 51.3 % | 49 % -> 47 % | 8.7 -> 13.4 | 0.52 -> 0.59 | 100 % | 26 / 0.18 |
| Ashthread Drift | 19.5 % -> 67.9 % | 38.9 % -> 37.1 % | 50 % -> 51 % | 11.9 -> 19.4 | 0.33 -> 0.70 | 90.2 % | 66 / 1.08 |
| Bellows Gallery | 35.8 % -> 53.8 % | 12.0 % -> 22.7 % | 82 % -> 73 % | 13.0 -> 14.7 | 0.15 -> 0.37 | 48.6 % | 132 / 2.57 |
| Crownkiln | 66.0 % -> **13.7 %** | 35.0 % -> 37.6 % | 50 % -> 49 % | 15.3 -> 17.9 | 0.49 -> 0.58 | 31.3 % | 141 / 2.81 |
| Inkdrip Shelf | 54.7 % -> 77.9 % | 14.6 % -> 18.3 % | 66 % -> 63 % | 8.1 -> 7.1 | 0.02 -> 0.35 | 71.7 % | 57 / 1.05 |

Cause checks (1000 seeds each, raw in `raw/`):

| Experiment | Won |
|---|---|
| Rules 23 + `intruder.BashOnRouteOnly = 1` (route rule alone): Cinder Hollow / Crownkiln | 95.3 % / 99.8 % |
| Rules 23 without the keep-out (`worker.EntranceKeepOut = 0`): Cinder Hollow / Crownkiln | 42.3 % / 75.7 % |
| Rules 24 on Crownkiln with the Ferreter kept (rules-23 waves) | 41.7 % |
| Rules 24 Crownkiln, `intruder.TriggerAvoidCost = 0` / `spot.EffectChance = 0` | 13.7 % / 13.8 % |

Reading:
- On five maps the route rule for Brutes decides (as the night measured): Brutes no longer break side vents before they
  fire. Traps now do more of the work (trap share up on Cinder Hollow and Bellows Gallery, creatures' share down).
- **Crownkiln goes the other way.** With every part hidden the Brutes no longer stand in the kill zone breaking a whole
  machine part by part (seed 2, rules 23 with the route key: one Brute broke plate, snare and charge in turn, 7839-7909;
  rules 24: it breaks only the revealed plate and walks on). Wave 2 now reaches the Heart (lost in wave 2: 0 % -> 18 %,
  wave-2 Heart damage 1 -> 362 per play). The Scout back in place of the Ferreter costs another 28 points (42 % -> 14 %);
  neither the avoid cost nor effect spotting explains it. Removing the keep-out is not the cause (it helps here).
- Parts broken per play rise on most maps: a part that fired is revealed, and the next basher standing on it breaks it;
  most breaks now come after the part has done its work.
- Opt-in door bot: helps where the route has one chokepoint (Ashthread Drift +22, Crownkiln +18 points), costs a little
  on Bellows Gallery (two entrances, -5) and Inkdrip Shelf (-6). The standard bot fits no doors; Cinder Hollow waves
  unchanged (UD-53).

## 4. Decision records (Studio)

- `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`: new section "Direction — 2026-11-11", row **UD-79** "Core of the
  game: realm against realm; intruders as an event", the Human's statement quoted exactly (spelling kept); recorded as a
  direction, no rule changed by it.
- `Projects/Underreign/Docs/OPEN_DECISIONS.md`: **OD-19** and **OD-20** -> "DECIDED (UD-75 / UD-76), RULES BUILT IN RULES
  VERSION 24 (UR-SIM-TRAPS-DOORS-V1, not committed, awaiting independent review)", with the built rules and the measured
  effect.

## 5. What the Unreal game needs to show doors and hidden traps

1. Re-sync `Game/Underreign/Source/UnderreignSim/Lib` from `SimulationCpp` (rules 24): new files
   `Commands/SetDoorLockCommand.h/.cpp`; the tuning files lost `worker.EntranceKeepOut` (a synced tuning that still sets
   it is refused); Crownkiln's waves changed; golden names changed (`newintruders_seed1_won`, `inkdrip_seed3_won`, new
   `doors_seed1_won`); `SYNC_MANIFEST.txt`.
2. Build menu: "Wooden door" and "Iron door" (`PlaceTrapPartCommand WoodDoor|IronDoor L X Y`), placeable only on a
   claimed 1-wide corridor cell; show the refusal `NotACorridor` (21) in the placement preview; Forge required.
3. A door model per kind with states from `TrapPartView`: planned / being fitted (`State` Planned, `ForgeLeft`),
   locked (`Locked`, `Bars`), unlocked (open), broken (`State` Broken); an HP bar (`Hp` / `MaxHp`); a click or key that
   sends `SetDoorLockCommand <id> <1|0>`; removal as for trap parts (half refund).
4. Door feedback from events: `DoorHit` (hit effect, sound), `DoorBroken`, `DoorRepaired`, `DoorLockChanged`; an
   intruder breaking a door has `Action` Bash with the door as target (play the bash animation at the door).
5. Hidden traps: the player always sees all own parts; add a marker "seen by the intruders" when `SeenByWaves > 0` or
   `KnownSeen` (and none otherwise), and a short flash on `TrapRevealed`; the known-machine ring (`KnownMachineView`)
   stays.
6. Remove any UI or text about the entrance keep-out (cinderlings walking home at a warning).
7. Optional: a menu entry for the opt-in door bot is not needed; it is a measuring bot.

## 6. Open points

1. **Balancing**: under rules 24 Cinder Hollow is nearly always won (96 %) and Crownkiln mostly lost (14 %); the P8
   band (50-85 %) is missed on both. Levers measured or at hand: stronger waves (Brute health, one more Brute), the
   reveal radius (`spot.SightRadius`), the Scout's effect chance, door prices/hit points; for Crownkiln wave 2. Not
   changed here (balancing waits for the Human, UD-38; Cinder Hollow waves fixed by UD-53).
2. Intruders locked in between doors without a breaker wait and, after 60 s without progress, flee; a fleeing intruder
   that cannot reach the exit vanishes after another 60 s as "lost" (not a survivor, so no report). Whether sealing
   intruders in should be possible is a design question.
3. Doors do not stop water, gas or heat; a door stays when digging later widens its corridor; a collapse on a door cell
   is not handled specially.
4. A part that fired is revealed to the whole wave, and the shared fields then route the rest of the wave round a fired
   trigger where a way exists; on single-route maps this changes nothing (Crownkiln test with avoid cost 0).
5. The door bot never unlocks, so `SetDoorLockCommand` is covered by unit and round-trip tests, not by a golden replay.
6. `Design/Bible/INTRUDERS.md` (outside this order's paths) still describes visible effects and the Ferreter in
   Crownkiln; it needs the rules-24 text.
7. The cloud (POSIX) build and a sanitizer run were not repeated; MSVC release only.
8. `UD-79` (realm against realm) is a direction; nothing in the simulation was changed for it.

Raw: `raw/SUMMARY_1000_SEEDS.txt` (every batch in one line), the batch summaries `raw/*.md` (`before_*` rules 23,
`after_*` rules 24, `doors_*` door bot, `r23_*` and `ck_*` experiments), the experiment tunings and map, `raw/summ24.py`
(the CSVs were not kept).
