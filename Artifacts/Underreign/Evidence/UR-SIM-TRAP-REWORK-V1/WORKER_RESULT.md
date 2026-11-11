# Worker result — UR-SIM-TRAP-REWORK-V1 (traps as a defence boost, rules version 25)

Copy of `C:/GameDev/Underreign/Evidence/UR-SIM-TRAP-REWORK-V1/WORKER_RESULT.md`; the `raw/` files named below are in that external folder.

Status: done, **not committed** (the Work Order forbids commits); awaiting independent review. Base: `ab94a8e` (rules
24). Work Order: Studio `Artifacts/Underreign/DirectorDispatch/UR-SIM-TRAP-REWORK-V1/WORK_ORDER.md` (verify-worker
printed PASS, receipt `cf7cb5fe...07ce3`). Changed here: `SimulationCpp`, this folder; in the Studio
`Projects/Underreign/Docs/DISCOVERY_DECISIONS.md` and the copy of this file. `Game` was not touched. No Unreal.
MSVC release only (`build.bat` and `Tools/build.py`, at most 8 compilers); the POSIX/cloud build was not run.

## Kurzfassung (Deutsch)

- **Fallen lösen selbst aus:** Jede Wirkung (Flammendüse, Glutladung, Kettenschlinge, Falltür, neu der Geschützturm)
  löst aus, sobald ein Eindringling in ihren Bereich kommt (Düse: ihr Strahl; Ladung: ihr Feld und die vier daneben;
  Schlinge und Falltür: ihr Feld). Druckplatte, Stolperdraht und alle Ketten sind weg.
- **Zwei Spezialauslöser:** Gewichtsplatte (nur für schwere Eindringlinge: Brute und Pavisier, "schwer" steht in den
  Daten) und Zahlenauslöser (löst beim 2. bis 6. Eindringling aus, Zahl vom Spieler einstellbar, zählt nach 10 s Ruhe
  neu). Ein Auslöser steuert die Falle auf seinem eigenen Feld und die auf dem Feld, in das er blickt; so gesteuerte
  Fallen lösen nicht mehr selbst aus. Kein Hebel.
- **Geschützturm:** in der Schmiede gemacht (150 Gold), schießt auf den nächsten Eindringling bis 5 Felder mit freier
  gerader Linie (wie der Armbrustschütze), 6 Schaden alle 1,5 s, 10 Schuss, dann füllt ein Cinderling nach (20 Gold).
  Versteckt, bis er zum ersten Mal schießt. Neu: **Brücke über Lava** (25 Gold, sofort, nur neben eigenem Boden,
  Abriss gibt die Hälfte zurück).
- **Kontrolle statt Schaden:** Düse 3 → 1 Schaden pro 0,2 s, Hitze nur noch bis "heiß", Getroffene fliehen 3 s in
  Panik; Schlinge hält 6 s statt 4 s; Ladung 60 → 20 Schaden, stößt 2 Felder weg und betäubt 2 s; Falltür 10 → 5,
  und wo keine Ebene darunter erreichbar ist, wird sie zur Grube, die 3 s betäubt.
- **1000 Spiele je Karte:** Die Kreaturen machen jetzt auf jeder Karte den größten Teil des Schadens (54-74 %), die
  Fallen direkt 8-31 %, Hitze 12-27 %. Gewonnen: Cinder Hollow 96 → 97 %, Crownkiln 14 → 32 %, Bellows Gallery aber
  54 → 15 % (dort fehlt der frühere Fallenschaden). Bots bauen Spezialauslöser und einen Geschützturm.
- 862 Tests grün, neun neue Golden Replays, Crownkiln 200 Spiele zweimal mit gleichen Hashes.

## 1. Rules (rules 24 -> 25; `SaveWriter::RulesVersion` = 25; every new number is a proposal)

### Triggers (tasks 1 and 2; UD-80 to UD-83)

| Rule | Now | Code |
|---|---|---|
| Self-triggering | Every armed effect that no trigger controls fires when an active intruder (ferrets count, camp guards not) is in its area: Flame Vent its 3 jet cells, Cinder Charge its cell and the 4 next to it, Chain Snare its cell (somebody not yet held), Drop Hatch its cell, Turret: range and line. Its Active/Cooldown/Spent cycle is unchanged; while an intruder stays, it fires again when ready | `TrapSystem::FireFreeEffects`, `InArea`, `AnyIntruderInArea` |
| Phase 7 order | timers (and Count Trigger quiet reset) -> arrivals (special triggers, holes) -> free effects in ascending id -> again while landings or knock-backs added arrivals -> burning jets | `TrapSystem::Update` |
| Removed | Pressure Plate, Tripwire, chains (`TrapLink`, `PendingFiring`, delays), `LinkCommand`, `UnlinkCommand`, `SetLinkDelayCommand`, keys `trap.Chain*`, `spot.TripwireChance`, `spot.TripwireAdjacentChance`, the machine catalogue (`Traps/Machines`) | files deleted |
| Weight Plate (kind 0) | 40 gold, Forge 100, 3 s cooldown; fires for an intruder whose definition is heavy (`IntruderDef::Heavy`, key `intruder.<Name>.Heavy` 0/1; Brute, Pavisier) | `TrapSystem::HandleArrival` |
| Count Trigger (kind 1) | 40 gold, Forge 100, 3 s cooldown; counts each intruder once (`Counted`), fires on the Nth (`CountN`, start 3); `SetTriggerCountCommand <id> <N>` N 2..6 (`trap.CountMin/Max`; `InvalidTarget`, `NothingToDo`); resets after 10 s without one (`trap.CountTrigger.QuietTicks`); counts nothing while cooling | `CountIntruder`, `SetTriggerCount` |
| What a trigger controls | the free effect on its own cell and the one on the cell it faces (same layer), at most 2; not the Turret, not doors. A new trigger takes them; a new effect is taken by a trigger on its cell or by a neighbour facing it (lower id). Controlled effects never fire on their own. Removing a trigger frees them (another covering trigger takes them); a broken trigger keeps them | `Attach`, `AttachAround`, `AttachToTrigger`, `TrapPart::Controls/ControlledBy` |
| Trap memory | a machine is a free effect alone (its own id is the "trigger id") or a trigger with its effects; known-damage, snare and fall halving unchanged; a free effect taken over by a trigger is "rewired" (forgotten) | `TrapPart::IsMachineHead`, `TrapMemory::CurrentEffects`, `Learn` |
| Avoid cost | spotted or known-and-seen special triggers, hatches, snares and charges (rules 24: triggers and hatches) | `IntruderFieldSet::AvoidedKind` |
| Spotting | special triggers 40 % (plate chance), effects and Turret 40 % (effect chance), pit hatches too; only Scouts roll | `TrapSpotting::ChanceFor` |
| Footnote | waits two steps from a special trigger or a free snare, charge or hatch | `CreatureAbilities::AmbushSpot` |
| Save | version 25; rules-24 saves are refused (their part names and LinkCommands do not exist) | `SaveWriter`, `CommandFactory` |

### Turret and bridge (task 3)

| Rule | Now |
|---|---|
| Turret (kind 8) | Forge, 150 gold, 250 forge ticks, claimed walkable floor. Armed: shoots the nearest active intruder within 5 (same layer, Manhattan) with a clear straight line (`CombatSystem::ClearLine`, ties lower id): 6 damage (shield halves it), then 15 ticks cooldown. 10 shots (`trap.Turret.Ammo`), then Spent; a cinderling refills it with the Rearm job (`trap.RearmCost` 20). Hidden until it fires in sight or a Scout spots it. Never controlled. `TurretShot` event. Code: `TrapEffects::TurretShot`, `TurretTarget` |
| Bridge | The map format had none, so: `BuildBridgeCommand L X Y` on a lava cell with claimed walkable floor next to it, 25 gold (`bridge.Cost`), at once; it becomes claimed open floor for everybody (lava flag kept: it still heats its neighbours). `RemoveBridgeCommand` back to lava, half refund; refused while anybody, a part, a room, a job, gold, a stair or the banner is on it (`Occupied`) or when it is the last route during a wave (`LastStairRoute`). Code: `Commands/BridgeRules`, `Grid::CloseCell`, `Grid::IsBridge`. The bots build none (no data map has a lava chokepoint on its route) |

### Control effects and damage (task 4)

| Part | Change (rules 24 -> 25) | Key |
|---|---|---|
| Flame Vent | damage 3 -> 1 per 2 ticks; heat 300 -> 150 per tick, cap 1000 -> 550; **panic**: an intruder hit flees for 3 s (`Intruder::PanicUntilTick`, flee reason Panic 5), then decides again | `trap.FlameVent.Damage`, `.HeatPerTick`, `.HeatCap`, `.PanicTicks` 30 |
| Cinder Charge | blast 60 -> 20; **knock-back** up to 2 cells straight away (stops at rock, holes, locked doors; only on its layer) and **stun** 2 s | `.Damage`, `.PushCells` 2, `.StunTicks` 20 |
| Chain Snare | hold 40 -> 60 ticks (Active 40 -> 60), cooldown 110 -> 100 | `.HoldTicks`, `.ActiveTicks`, `.CooldownTicks` |
| Drop Hatch | fall damage 10 -> 5; drops only on a breakthrough point with an open cell below (UD-47 kept), **elsewhere a pit**: no fall, 5 damage, **stun** 3 s (no longer refused there) | `.Damage`, `.StunTicks` 30 |

Event `IntruderControlled` (C 1 panic, 2 knock-back, 3 stun). Values are proposals.

## 2. Tests (862 pass with `build.bat`, MSVC release, no warnings; was 906)

New: `Tests/Rules25Tests.cpp` (16: Turret range/line/hidden/ammo/refill/claimed floor/shield, no shot through rock;
bridge build, refusals, removal, last route, heat, ASCII; heavy flag; ferrets and the special triggers; knock-back at a
locked door; Footnote anchors; bot turret and the no-turret bot; every data map without plain triggers). In
`TrapTests.cpp` (rewritten, 50 tests): self-triggering, creatures and cinderlings ignored, control by own and faced
cell, Weight Plate only for heavy, Count Trigger Nth/once/quiet reset, `SetTriggerCountCommand`, controlled fizzle,
vent panic, charge knock-back and stun, knock-back stops at rock, pit hatch, landing sets off an effect below.

Removed, because the rule they tested is gone (chains, plain triggers, the chain-built machine catalogue):
- `Tests/Machines/*` (55 tests: AllMachines, DownPayment, ExitInterview, FloorExit, HotCorridor, KindlingBelow,
  LongFall, MachinePlanner, WaitingRoom, WarmWelcome).
- `TrapTests`: `Trap_Link_CostsFiveGoldAndAppearsInView`, `Trap_LinkRules_Rejections`, `Trap_FiveEffectsOnOneTrigger_Rejected`,
  `Trap_ChainTooLong_Rejected_LayerStepCountsThree`, `Trap_AllEffectsSameTick_WhenDelayZero`, `Trap_LinkDelay_FiresAfterDelay` (3),
  `Trap_SetLinkDelayAndUnlink`, `Trap_CrossLayerChain_FiresEffectOnOtherLayer`, `Trap_TripwireCoversLine_StoppedByRock`,
  `Trap_TriggerResetsAfterTwoSeconds` (2), `Trap_FlameVent_FizzlesWhileCooling_ReadyAfterEightSeconds` (replaced by
  `Trap_ControlledEffectFizzles_WhileItIsNotArmed`), `Trap_PlannedPart_...(PressurePlate|Tripwire)`.
- `TrapEdgeTests.Chain_PartRemovedWhileDelayedFiringPending_...` (2).

Rewritten under a new name (the old assertion was about the removed rule; the new one asserts the rules-25 rule):
`TrapTests.Trap_PressurePlateFiresLinkedEffects_OnlyForIntruders` -> `Trap_EffectFiresOnItsOwn_WhenAnIntruderEntersItsCell`;
`Trap_TriggersIgnoreOwnCreaturesAndWorkers` -> `Trap_EffectsIgnoreOwnCreaturesAndWorkers`; `Trap_RemoveRefundsHalfAndRemovesChains`
-> `Trap_RemoveRefundsHalf_ARemovedTriggerFreesItsEffects`; `Trap_DropHatchNeedsOpenBelow` -> `Trap_DropHatch_DropsOnlyWhereALayerBelowIsOpen_ElseIsAPit`;
`Trap_CinderChargeRadiusTwoAndSpent` -> `Trap_CinderCharge_SetsOffNextToIt_RadiusTwo_KnocksBackAndStuns_Spent`;
`Trap_DropHatch_LandingOnPlateFiresSameTick` -> `Trap_DropHatch_LandingInAnEffectsAreaSetsItOffTheSameTick`;
`Repair_BrokenTriggerDoesNothing_BrokenHatchCloses` -> `Repair_BrokenTriggerSetsNothingOff_BrokenHatchCloses`;
`TrapEdgeTests.Chain_EffectBashedWhileFiringPending_Fizzles_RepairQueued` -> `Rules25_ControlledEffectBroken_FizzlesWhenItsTriggerFires_TheOtherEffectWorks`;
`Rules24_Brute_WalksPastTheHiddenVent_...` -> `Rules25_Brute_PanicsInTheHiddenVentsJet_BashesItOnHisWay_ThePlateDropsHimThroughTheHatch`;
`DropHatch_TwoFallOntoAThird_OnlyTheFirstLandingFiresThePlateBelow` -> `..._TheLandingsAreArrivalsInIdOrder`;
`IntruderTests.Drop_LandingOnPlateFiresSameTick` -> `Drop_LandingInASnareFiresSameTick`; `ScenarioTests.Scenario_WiredMultiLayerTrap`
-> `Scenario_SelfTriggeringMultiLayerTrap`; `BreakthroughTests.DropHatch_OnlyOnABreakthroughPoint` -> `DropHatch_DropsOnlyOnABreakthroughPoint`;
`BotHintTests.BotPlan_UnchainedEffect_IsPlacedWithoutAChain` -> `BotPlan_PartHints_AnyKind_ACountTriggerTakesItsN`;
`ReasonableBot_M3HeatWindow_HatchShutAndUnchained_SnareAndVentChained` -> `ReasonableBot_M3CrossHeat_BuildsTheSnareTheHatchAndTheVentBelow`;
`HeadlessTests.Bot_ReasonableFinishesSeed1_BuildsOnAllLayersAndWiresMachines` -> `..._SpecialTriggersAndATurret`;
bad-hint cases ("a trigger cannot be unchained" -> PressurePlate refused, N only for a Count Trigger, `reuse`, `alt` refused).

Changed in place, and why:
- Generic hidden parts: every test that used a Pressure Plate or Tripwire only as "some hidden part" uses a Weight
  Plate / Count Trigger (Lamplighter, Rules12/13/15/16 Footnote and ferret tests, ViewAdditions, Round7, Rules24
  door placement, HardeningTests save line `PlaceTrapPartCommand CountTrigger ...`).
- Chains replaced by control or by free effects: `MemoryTests` (machine helper = plate + vent on its cell; signature
  test with own and faced cell plus a free-effect machine; snare and hatch memory on free parts with the new hold 60/30/15
  and fall 5/2; "rewired" = a free vent taken over by a new plate; RealTrapDamage on a free vent),
  `Rules24Tests` (reveal by a free vent, known machine with plate and faced vent, a door is never controlled),
  `DeterminismEdgeTests.Busy`, `TrappedIntruderTests` (hatch over the pit free; burn test: snare in the first jet cell,
  15 = 15 pulses of 1), `HeadlessTests.Metrics_CountsTrapKills...` (a Count Trigger N 2 on a charge), `SaveTests`
  (command list: no chain commands, `SetTriggerCountCommand`, `BuildBridgeCommand`, `RemoveBridgeCommand`; played game
  with control and a count change; LinkCommand and Tripwire text refused), `HardeningTests` (extreme arguments for the
  new commands), `StarvingAndBrokeTests.Broke_...` (four paid commands; the paid LinkCommand is gone),
  `BotHintTests.ReasonableBot_WinHoard_StaysAbove...` (no chain spending).
- New numbers: `HeatTests.Heat_VentUnderShaft...` and `..._VentUnderClosedHatch...` give the vent the rules-24 heat in
  the test (they test heat rising), the closed hatch is held shut by a Weight Plate (a free hatch would open);
  `HeatEdgeTests.Heat_TwoVentsCrossingJets...` the same; `TrapEdgeTests.CinderCharge_OnStairTop...` (20 damage, the
  knock-back positions; no Step before the manual fire, the intruder on it would set it off), `Snare_RemovedWhileHolding...`.
- Self-triggering side effects: `Rules13Tests.BashRoute...` (the side vent faces rock, else it sets itself off and the
  Sapper panics), `FerreterTests.Ferret_SetsOffAPlate...` (a free snare), `LavaTests.AmbushVariant...` (the ambush
  machine is a snare now), `LivenessTests.BellowsGallery_...LienHookPulls` (up to 12 seeds instead of 6: Bellows Gallery
  is lost more often, the Lien-hook arrives later), `HeadlessTests.BotPlan_ReadsCinderHollowHints...` (first part a vent;
  Count Trigger N 2; Weight Plate).
- Golden names and `OpeningVariationTests` hash `1e90d79f1f144be0`.

Golden replays re-recorded (rules-24 files in `SimulationCpp/Data/ReplaysLegacy/rules24`); all 9 pass `ur_headless
replay`: `golden_reasonable_seed1_won` (`1e90d79f1f144be0`, covers a Turret and `SetTriggerCountCommand`),
`golden_reasonable_seed12_lost` (`c93dd97e0daee4d5`), `golden_banner_seed4_won` (`89acda19d5372052`),
`golden_idle_seed1_lost` (`cd052f1d3209fb89`), `golden_doors_seed1_won` (`1d60929da14c21e4`),
`golden_newintruders_seed1_won` (`9a34e0e7c76a16ee`), `golden_crownkiln_seed1_lost` (`eafd44ab1599bde1`),
`golden_ashthread_seed1_won` (`f6b2c1561b91778b`), `golden_inkdrip_seed3_won` (`98ec80e889ebfd11`). No golden replay
covers a bridge (unit and round-trip tests do).

## 3. Bots (task 5)

- Map hints are groups of parts now (`part NAME KIND L X Y FACING [N]`); all 15 data maps converted by
  `raw/conv_maps.py`: plain triggers dropped (the effects fire on their own); a trigger on a Cinder Charge's cell became
  a **Weight Plate** (Down Payment, Crownkiln, Inkdrip Shelf and Bellows Gallery charges: saved for Brutes and
  Pavisiers); a trigger on a Drop Hatch's cell a **Count Trigger N 2** (Long Fall: the second intruder drops, the group
  is split); `reuse`, `alt` and delays dropped; m3's unchained hatch is an ordinary hatch now.
- Every reasonable bot places **one Turret** after the Forge and wave 1's machines (or from 6:00) beside the plan route
  where it sees the most route cells within range with a clear line (at least 5). Seed 1: Cinder Hollow and CH New
  Intruders (1, 21, 12), Ashthread Drift (1, 32, 7), Bellows Gallery (1, 26, 15), Crownkiln (1, 33, 22), Inkdrip Shelf
  (1, 19, 19). Measuring bot `reasonable-noturret`.
- Known machines are no longer moved (no trigger to move); `MachineRefreshes` is 0.

## 4. Balance (1000 seeds per row, `prototype.tuning.txt`, reasonable bot; rules 24 = build of `ab94a8e`)

Damage split of all damage to intruders: creatures / traps (direct hits, Turret included) / heat (all heat). Last
column: the rules-24 "trap share" (direct hits + vent-column heat).

| Map | Won 24 -> 25 | Creatures | Traps | Heat | Traps + vent heat | Parts broken | Cinderling deaths |
|---|---|---|---|---|---|---|---|
| Cinder Hollow | 96.4 % -> 97.2 % | 42.2 % -> **53.6 %** | 35.0 % -> 31.4 % | 22.8 % -> 15.0 % | 56.2 % -> 46.4 % | 18.7 -> 9.9 | 0.05 -> 0.12 |
| Cinder Hollow (varied) | 89.5 % -> 91.5 % | 43.5 % -> **53.8 %** | 34.4 % -> 31.4 % | 22.2 % -> 14.8 % | 54.9 % -> 46.2 % | 17.9 -> 9.6 | 0.11 -> 0.28 |
| CH New Intruders | 87.0 % -> 98.9 % | 47.1 % -> **57.1 %** | 33.2 % -> 30.4 % | 19.7 % -> 12.5 % | 51.3 % -> 42.8 % | 13.4 -> 8.2 | 0.59 -> 0.42 |
| Ashthread Drift | 67.9 % -> 74.9 % | 50.9 % -> **54.2 %** | 25.5 % -> 26.7 % | 23.6 % -> 19.1 % | 37.1 % -> 34.9 % | 19.4 -> 12.2 | 0.70 -> 0.65 |
| Bellows Gallery | 53.8 % -> **14.6 %** | 72.8 % -> **73.6 %** | 16.8 % -> 14.9 % | 10.4 % -> 11.5 % | 22.7 % -> 15.7 % | 14.7 -> 10.8 | 0.37 -> 0.14 |
| Crownkiln | 13.7 % -> 31.8 % | 49.0 % -> **61.3 %** | 28.3 % -> 22.2 % | 22.7 % -> 16.4 % | 37.6 % -> 25.9 % | 17.9 -> 11.2 | 0.58 -> 0.99 |
| Inkdrip Shelf | 77.9 % -> 99.7 % | 63.4 % -> **64.7 %** | 15.9 % -> 8.2 % | 20.7 % -> 27.1 % | 18.3 % -> 12.0 % | 7.1 -> 3.1 | 0.35 -> 0.23 |

Per play (rules 25, Cinder Hollow): 62.6 panics, 3.0 knock-backs and stuns, 8.9 Turret shots (53 damage), 5.4
intruders counted by Count Triggers.

Cause checks (1000 seeds each):

| Experiment | Won |
|---|---|
| Cinder Hollow without the vent's panic (`trap.FlameVent.PanicTicks 0`) | 29.7 % (creatures 77 %, traps 18 %, heat 5 %) |
| Cinder Hollow without the Turret (`reasonable-noturret`) | 93.9 % |
| Bellows Gallery with the rules-24 charge and vent damage (60, 3) | 37.1 % |
| Bellows Gallery without the panic | 23.6 % |
| Bellows Gallery without the Turret | 14.1 % |

Reading:
- The task's goal is met: on every map the creatures deal clearly more than the traps' direct hits (Cinder Hollow
  54 % vs 31 %) and, on every map, more than traps plus vent heat (46 %).
- The vent's panic is now the strongest trap effect: on Cinder Hollow it decides between 97 % and 30 % won. Fleeing
  intruders run back through the jets and away from the Heart while the creatures catch up.
- Bellows Gallery drops (54 % -> 15 %): its two side entrances had Tripwire welcomes that covered whole corridors and
  60-damage charges; with less raw damage its waves reach the Heart (lost in wave 2: 15 % -> 23 %). Not balanced here
  (UD-38: balancing waits for the Human); levers measured above.
- About one wave-1 intruder now escapes per game (0.98 per play on Cinder Hollow, was 0.47; Bellows Gallery 0.99, was
  0.03): charge victims survive the 20 blast. A machine is then known after wave 1 in 87 % (Cinder Hollow) and 99.5 %
  (Bellows Gallery) of games (was 45 % and 0 %), and the next waves take half damage from it.
- Determinism: Crownkiln seeds 1-200 played twice, 200 of 200 equal final hashes.

## 5. Decision records (Studio `Projects/Underreign/Docs/DISCOVERY_DECISIONS.md`, new section "Traps as a defence boost — 2026-11-11")

UD-80 self-triggering; UD-81 the two special triggers; UD-82 no lever; UD-83 chains removed; a remark row for the DK2
cannon ("led to the Turret and the bridge", no names, look or numbers taken); UD-84 the direction statement (creatures
and tactics first, traps as a defence boost). All quoted exactly, spelling kept.

## 6. What the Unreal game must show

1. Re-sync `Game/Underreign/Source/UnderreignSim/Lib` from `SimulationCpp` (rules 25): files removed
   (`Traps/TrapLink`, `Traps/PendingFiring`, `Traps/Machines/*`, `Commands/LinkCommand`, `UnlinkCommand`,
   `SetLinkDelayCommand`), files added (`Commands/SetTriggerCountCommand`, `BuildBridgeCommand`, `RemoveBridgeCommand`,
   `BridgeRules`), the converted maps and the new golden names; `SYNC_MANIFEST.txt`.
2. Build menu: remove Pressure Plate, Tripwire and every chain/link tool (drag lines, delay buttons). Add **Weight
   Plate** and **Count Trigger** (`PlaceTrapPartCommand WeightPlate|CountTrigger L X Y FACING`): the placement preview
   must show the facing and which two cells it will control (own cell + faced cell), and a short line from the trigger
   to each controlled effect (`GetTrapLinks()`, `TrapPartView.ControlledBy`). Add the **Turret** (`Turret`).
3. Count Trigger: a number on the part (`CountN`) and a counter (`Counted` / `CountN`), plus a control to set N 2-6
   (`SetTriggerCountCommand <id> <N>`); flash on `TriggerCounted`.
4. Trap areas: when placing or selecting a free effect, show its trigger area (vent jet, charge cell + 4 neighbours,
   snare and hatch cell, turret range 5 with line of sight); a controlled effect shows "fires through its trigger".
5. Turret: a model with an aim/shot animation toward `TurretShot` B, ammo bar (`Ammo` / `MaxAmmo`), a "needs refill"
   state (Spent) and the cinderling's refill (Rearm job).
6. Drop Hatch: two looks: a real hatch over a breakthrough point, and a **pit** (`TrapPartView.Pit`): no opening, a stun
   effect on the intruders.
7. Control feedback from `IntruderControlled`: panic (intruder runs away, a fear icon for D ticks; flee reason Panic),
   knock-back (a short push animation over D cells), stun (dizzy icon for D ticks).
8. **Bridge**: a build command on lava cells next to claimed ground (`BuildBridgeCommand`, refusal reasons), a bridge
   tile model over lava (`Grid` cell open + Lava flag; ASCII `"`), removal (`RemoveBridgeCommand`, half refund, refusals
   `Occupied` / `LastStairRoute`).
9. Tooltips and texts: the new numbers (vent less damage plus panic; snare 6 s; charge knock-back and stun; hatch pit
   stun; Turret 6 / 1.5 s / 5 cells / 10 shots; bridge 25 gold) and the heavy marker on Brute and Pavisier (Weight Plate).

## 7. Open points

1. **Balancing** (UD-38, for the Human): Bellows Gallery 15 % and Crownkiln 32 % won, Inkdrip Shelf and CH New
   Intruders 99 %; the P8 band (50-85 %) is met only by Ashthread Drift. Levers: vent panic (very strong), charge
   damage, Count Trigger use on Bellows Gallery's two entrances, the Turret count.
2. About one wave-1 intruder escapes per game (a charge victim at 20 damage survives) and reports the machine; whether
   the charge should kill a Scout (40 hp) is a balancing question.
3. The special trigger's reach (own cell + faced cell, at most two effects) is my choice for "one adjacent effect or a
   small group"; the Human may prefer a different reach.
4. The bridge is instant (no cinderling job) and stays hot between lava cells; no data map has a lava chokepoint on the
   intruders' route, so the bots never build one and no golden replay covers it. A bridge map for the Turret ("cave,
   lava, bridge, fire") would be the next test map.
5. Panic flights end at the exit when an intruder is close to it: such an intruder escapes as a survivor.
6. `Design/Bible/TRAP_WIRING_CATALOGUE.md` (outside this order's paths) still describes chain machines; it needs the
   rules-25 text (or retirement).
7. POSIX/cloud build and sanitizer not run; MSVC release only.
8. `build.bat` now deletes its old object files first (objects of deleted sources were linked again).

Raw: `raw/SUMMARY_1000_SEEDS.txt` (every batch in one line), batch summaries `raw/*.md` (`before_*` rules 24,
`after_*` rules 25, `exp_*` experiments, `determinism_*`), `raw/summ25.py`, `raw/conv_maps.py`, the experiment tunings.
