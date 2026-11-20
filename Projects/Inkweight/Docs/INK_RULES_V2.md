# Inkweight Ink Rules, Version 2 (Prototype Proposal, As Built)

Status: Worker proposal from Work Order INK-CORE-V2 (2026-11-20), state after
correction round 1. It describes the rules as the engine-free core now runs
them, after the independent reviews of version 1 and of the first version 2
candidate and a second balance pass. Every number and every rule that is
new against `INK_RULES_V1.md` is a prototype proposal, not a Human decision;
new rules are marked **(new)**. The machine-readable values live in
`Source/Shared/ink_tuning.json` (`ink-tuning-3`); when the two differ, the JSON
file is what the game runs. The exact algorithms are in
`Source/Shared/RULES_AS_BUILT.md`, the differences to the first core in
`Source/Shared/CHANGES_V2.md`. `INK_RULES_V1.md` is unchanged.

**What changed since the first version 2** (Work Order INK-CORE-V3,
2026-11-20, core version 3, exact list in `Source/Shared/CHANGES_V3.md`):

- Solo: enemy copies of heavy drawings no longer crawl (speed is 3 cells per
  second plus 45 % of the design's speed, was 55 %), and the weight of an
  enemy copy now hits: its blunt touch gains a **crush** of 0.004 per ink,
  times the share of staked ink the copy carries, times the stake. Before, a
  heavy blunt enemy design (block, disc, ring, hoop) was harmless and made
  the stake free. **(new)**
- Movement: figures in a crowd and figures with one-cell teeth sit inside
  each other far less often (more separation passes, a relaxation round for
  three or more figures). No rule a player sees changed.
- No number of the Ring changed. A third balance pass measured five levers
  under both bot styles and adopted none (section 8).

The one sentence still holds: **amount is weight, filled areas are armour,
thin lines are blades, colour is the element.** Version 2 adds one small
thing for hollow drawings: a closed shell with thick walls is a little harder
to push and holds a little armour, always less than filling the same ink
would give.

## 1. Canvas

- Grid of 32 x 32 cells. Cell value 0 is empty; 1 Black (neutral), 2 Red
  ("Ember"), 3 Blue ("Tide"), 4 Green ("Moss").
- Every filled cell costs exactly 1 ink, whatever its colour. Erasing refunds.
- A drawing has an ink budget (220 for a figure, 60 for a thrown weapon).
- The top of the canvas is the front of the figure.

## 2. From drawing to body

1. The body is the largest 4-connected group of filled cells. Ties go to the
   group that contains the lowest cell index (`y * 32 + x`). All other filled
   cells "drip off": they cost ink and count for nothing.
2. A body needs at least 12 cells to be valid (figures and weapons). The game
   refuses a drawing that is too small or over its budget in both modes
   **(new for the Ring)**.
3. The body is rigid. Every cell is a small circle; the drawn outline is the
   hitbox. Its centre is the centroid of its cells.

## 3. Stats

Let `N` be the number of body cells.

- **Core cell:** all 8 neighbours are body cells. `C` = number of core cells.
- **Blade cell (new rule):** a body cell where the ink is only one cell
  thick, exactly: a cell that is part of no completely filled 2 x 2 square.
  `S` = number of blade cells. Straight lines, diagonal strokes, thin crosses
  and single-cell tips are blades. The flat side, the corners and the slanted
  side of a filled area are not, and a line two cells wide is not.
- **Pocket cell (new):** an empty cell that is shut in by the body (it cannot
  reach the canvas edge through empty cells, moving in 8 directions) and does
  not touch ink. `P` = number of pocket cells. Wide bubbles count, one-cell
  gaps do not.

| Stat | Meaning | Formula (proposal) |
|---|---|---|
| Weight | Accelerates slower, costs speed | `N` |
| Push weight **(new)** | Pushes harder, is pushed less | `N + 0.1 * min(P, N - S)` |
| Armour (hit points) | How much damage the figure survives | `60 + 1 * C + 0.3 * N + 0.3 * min(P, N - S)` |
| Sharpness (damage) | Damage when a blade cell touches an opponent | `1 + 1.2 * S^2 / (S^2 + 25) + 3 * (S / N)^2 / (1 + N / 60)` |
| Top speed | Movement | `38 / (1 + N / 70)` cells per second |
| Size | Hit area, reach, leverage | radius of the cells around the centroid |
| Element | Rock-paper-scissors bonus | see section 4 |

How to read the changed stats:

- **Armour: filled areas are armour.** Every figure has 60, every cell adds
  0.3 and every core cell 1 more. A filled disc of 208 cells has 270, a
  32-cell line 70, a 13-cell dot 65: filled against thin is about 4 to 1. A
  closed shell with walls at least two cells thick gets 0.3 per pocket cell,
  at most one pocket cell per wall cell that is not a blade cell; that is
  always less than filling the same ink (a 2-cell-wide box near the canvas
  border with 216 ink: 190; a hollow ring of 172 cells: 179). A loop drawn
  with a one-cell line holds nothing.
- **Push weight.** The same counted pocket cells make a closed thick shell up
  to 10 % harder to push than its ink alone. This is the job of hollow
  drawings; it is small on purpose.
- **Sharpness.** The first part counts blade cells and has a ceiling: 5 blade
  cells give half of it, 12 cells give 1.0 of the possible 1.2. So a sword
  drawn on a solid body, straight or diagonal, moves the stat from 1.0 to
  about 2.0, and more spikes add little. The second part rewards a drawing
  that is nothing but blade, the more the lighter it is: a 12-cell line
  reaches 4.5, a 32-cell line 4.1, a thin cross 3.7, a heavy snake of 209
  blade cells 2.9. The highest value a valid drawing reaches is 4.52.

| Drawing | N | Armour | Sharpness | Push weight | Top speed |
|---|---|---|---|---|---|
| 10 x 10 block | 100 | 154.0 | 1.00 | 100 | 15.6 |
| same + 12-cell straight blade | 112 | 157.6 | 2.03 | 112 | 14.6 |
| same + 12-cell diagonal blade | 112 | 157.6 | 2.03 | 112 | 14.6 |
| stick figure (hollow head, body, arms, diagonal legs) | 65 | 79.5 | 3.63 | 65 | 19.7 |
| 13-cell dot | 13 | 64.9 | 1.70 | 13 | 32.0 |
| filled disc | 208 | 270.4 | 1.00 | 208 | 9.6 |
| hollow ring | 172 | 179.2 | 1.00 | 189.2 | 11.0 |
| 2-cell-wide border hoop | 216 | 189.6 | 1.00 | 237.6 | 9.3 |
| hedgehog | 197 | 196.1 | 2.31 | 197 | 10.0 |
| line of 32 cells | 32 | 69.6 | 4.13 | 32 | 26.1 |
| line of 12 cells | 12 | 63.6 | 4.52 | 12 | 32.4 |

A touch that is not made by a blade cell does blunt damage of 1.2. A touch
with a blade cell does the sharpness, never less than blunt **(new)**, plus
0.4 % of the victim's full armour **(new: blades cut through thick armour)**.
The same pair of figures can damage each other at most once per 0.4 seconds
per direction. One contact hurts both sides, each with what it touched with.
A hit also pushes the victim back by `damage * 39 / push weight` cells per
second.

## 4. Element

Unchanged from version 1.

- Count the body cells per colour. If the coloured (non-black) cells are at
  least 30 % of `N`, the element is the colour with the strict plurality among
  them; otherwise the figure is neutral. A tie between colours is neutral.
- Ember beats Moss, Moss beats Tide, Tide beats Ember.
- Damage against the element you beat is multiplied by 1.5; against the element
  that beats you by 0.75. Neutral gives and takes 1.0.

## 5. Movement

- Top-down arena, no gravity. One stick or four keys and one dash button.
- The figure turns its front (canvas top) toward the steering direction; long
  and heavy drawings turn slower.
- Collisions push by weight: both figures are moved apart and exchange
  momentum; the lighter one moves more.
- **Dash:** 0.2 seconds at 3.8 times top speed, 2 seconds cooldown.
  **(new)** A dash ends the moment the figure touches anything. That touch is
  a ram: the dash's momentum goes into the other figure, and the pair bounces
  less than in a normal collision (bounce factor 0.3 instead of 0.79).
- **(new)** The game checks contacts several times per tick when figures are
  fast or turn (no cell moves more than 0.4 cells between two checks), so
  figures can no longer pass through each other or turn into each other.
  Known limit: two drawings with one-cell teeth and one-cell gaps can mesh
  for a moment.

## 6. Mode B: Ink Games, discipline "Ring" (2 to 4 figures)

- Everyone draws a figure with the same budget, then fights in a round ring
  (radius 44, 50 or 56 cells for 2, 3 or 4 figures) that shrinks from second 5
  to second 45 down to radius 16; from second 60 it closes completely.
- A figure is out when its armour reaches 0 or its centre leaves the ring.
  Last figure standing wins the round; first to 3 round wins takes the match.
  If the last figures go out in the same tick, the one closest to the centre
  wins.
- Catch-up: every lost round gives +15 % ink budget for the next drawing, at
  most four times.
- Seats can be human or a bot. **(new)** There are two bot styles: the rusher
  runs at the nearest opponent; the circler picks an opponent outside the
  crowd, circles it and rams when its dash is ready.

## 7. Mode A: Solo Arena

- Before the run the player draws a hero (220 ink) and a thrown weapon (60
  ink) with Black and one chosen colour. The hero throws the weapon
  automatically at the nearest enemy; weapon weight gives knockback and a
  slower throw rate, weapon sharpness gives damage.
- Before each wave the player draws one enemy design and picks the stake x1,
  x1.5 or x2.
- **(new)** Copies: the wave budget (120, 170, 230, 300, 380) times the stake
  pays for copies; every copy costs its ink plus a fee of 40. At least 1, at
  most 10 copies.
- **(new)** Enemy copies have armour `0.6 * N + 0.2 * armour of the design`:
  it follows size, so a swarm of thin copies is fragile and a big drawing is
  tough, with or without filled areas. Ink of the staked budget that buys no
  further copy makes the copies up to twice as tough; a budget too small for
  one copy makes it weaker (down to half). Enemies move at 3 cells per
  second plus 45 % of the design's speed and hit with 40 % of its damage.
- **(new, version 3)** Crush: an enemy copy's blunt touch gains 0.004 per
  ink of the design, times the share of staked ink the copy carries (the same
  0.5 to 2 as for its armour), times the stake. In the walled arena weight
  cannot push anybody out, so it hits harder instead. A 210-cell block in
  wave 3 touches for 0.8 at x1 and for 2.6 at x2 (before: 0.5 and 0.7); a
  13-cell dot gains almost nothing. Boss and escorts crush with their own
  ink.
- **(new)** The stake matters for danger and for reward: besides more or
  tougher copies the enemies hit 1.25 or 1.5 times harder and are 1.1 or 1.2
  times faster at x1.5 and x2. The drops of a wave together pay the staked
  budget and never more.
- Collected ink is the score and pays for one upgrade between waves (cost 60,
  90, 120, 150, 180): 40 more hero ink with a redraw, 15 more weapon ink with
  a redraw, a heal of 35 % of full armour (was 50 %), or one more colour.
- A fight that lasts longer than 180 seconds ends the run. If the hero falls
  in the same tick as the last enemy, the run is lost.
- A run is 5 waves and a boss: the union of the five enemy drawings with 1.2
  times its armour, escorted by one copy of each design.

## 8. Design risk and the measured result

Target (Work Order INK-CORE-V2): no archetype above 60 % average duel win
rate, at least three clearly different shapes that can win, light shapes not
hopeless in four-figure rounds. **The target is not met.**

Measured with `node sim/balance.js --seeds 30 --ffa 800 --soloseeds 4` after
correction round 1 (20 archetypes: the 14 of version 1 plus six "player
optimiser" drawings; rusher bots, circler bots and a mixed configuration; 5700
duel rounds and 800 four-figure rounds per configuration). Full tables:
`Artifacts/Inkweight/Evidence/INK-CORE-V2/BALANCE_REPORT.md`. The numbers of
the first version 2 candidate (flat armour) are in
`.../before_correction_1/`.

Read the per-style lines first. The mixed configuration says little about
drawings (a rusher beats a circler in 79.3 % of duels whatever is drawn), so
the pooled number is the weakest of the four.

| Measure | Version 1 (14 archetypes, rusher bot only) | Version 2, first candidate (flat armour) | Version 2 after correction round 1 |
|---|---|---|---|
| Highest duel win rate, rusher bots only | wedge 71.3 % | splinter 79.0 % | grille 76.8 % (hoop2 76.1 %, hedgehog 75.3 %) |
| Highest, circler bots only | not measured | hoop 83.5 % | hoop 76.1 % (shield 73.7 %) |
| Highest, mean of rusher-only and circler-only | not measured | shield 65.2 % | hoop2 73.6 % |
| Highest, pooled over three configurations | not measured | shield 61.4 % | spiral 68.1 % |
| Highest four-figure win rate (25 % = even) | wedge 65.5 % | block 52.7 % rusher, shield 39.3 % pooled | hedgehog 63.4 % rusher, 48.6 % pooled |
| Light shapes in four-figure rounds, pooled | line 4.4 %, cross 4.2 %, needle 4.7 %, dot 0.9 % | needle 19.1 %, cross 13.4 %, line 9.4 %, dot 10.7 % | needle 1.5 %, cross 5.2 %, line 2.2 %, dot 0.2 %, 12-cell line 2.7 % |
| Filled solids, duel (pooled) | disc 64.6 %, block 60.3 % | disc 44.6 %, block 50.8 % | disc 37.3 %, block 41.5 % |
| Hollow shapes, duel (pooled) | ring 30.6 %, frame 26.3 % | ring 52.8 %, frame 41.4 % | ring 47.1 %, frame 34.0 %, 2-wide hoop 64.1 %, 3-wide hoop 52.4 % |
| Smallest blob (dot), duel | 0.8 % | 15.7 % | 3.0 % |
| Armour, disc against line | 351 : 55 | 274 : 170 | 270 : 70 |

Verdict:

- **"No archetype above 60 %": not met**, under every reading: 76.8 % with
  rusher bots, 76.1 % with circler bots, 73.6 % as the mean of the two, 68.1 %
  pooled. Five drawings are above 60 % pooled: the all-blade snake, the nested
  loops, the hedgehog, the 2-cell-wide border hoop and the comb.
- **"At least three clearly different shapes can win": met** (blades,
  core+blades, hollow, solid and small each have an archetype at or above
  50 % pooled), but filled solids without a blade are weak in duels.
- **"Light shapes not hopeless in four-figure rounds": not met.** Light
  drawings win 2.4 % of their four-figure rounds on average. The first
  candidate reached 15.6 % with flat armour; making "filled areas are armour"
  true again took that away. This conflict is open design question 1 in
  `RULES_AS_BUILT.md`.
- The thick empty shell the review found (80 % of duels under both bot styles
  with 343 armour) now has 190 armour, less than the disc, and wins 64.1 %
  pooled (76.1 % rusher, 71.0 % circler): no longer the best drawing by
  armour, still too strong through its size.

Solo smoke run (bot hero, four hero drawings, seven enemy designs including
the heavy all-blade snake, 336 runs): 49.1 % of runs won including the boss,
with 22.9 % armour left on average; by stake x1 / x1.5 / x2: 79.5 % / 40.2 % /
27.7 % won, average score 1497 / 1718 / 1685. The snake enemy, which the
review beat in every run at every stake for the highest score, is now won in
7 of 48 runs. Swarms of needles: 13 of 48 runs won.

### Version 3 (Work Order INK-CORE-V3): measured again, no Ring number changed

Same command and sizes (`node sim/balance.js --seeds 30 --ffa 800
--soloseeds 4`), core version 3. Full tables:
`Artifacts/Inkweight/Evidence/INK-CORE-V3/BALANCE_REPORT.md` and
`before_after_ring.md`.

| Measure | Version 2 after correction round 1 | Version 3 |
|---|---|---|
| Highest duel win rate, rusher bots only | grille 76.8 % | grille 76.8 % |
| Highest, circler bots only | hoop 76.1 % | hoop 76.1 % |
| Highest, mean of rusher-only and circler-only | hoop2 73.6 % | hoop2 73.6 % |
| Highest, pooled over three configurations | spiral 68.1 % | spiral 68.1 % |
| Highest four-figure win rate, pooled | hedgehog 48.6 % | hedgehog 49.2 % |
| Light shapes in four-figure rounds, average | 2.4 % | 2.6 % |

**The target is still not met**, on the same three counts as above. The
duel numbers are the same because nothing a duel uses changed except the
number of separation passes; the four-figure numbers moved by at most a few
points per drawing (crowd relaxation, and the usual scatter of 800 rounds).

The third balance pass tested five levers, each alone, each under rusher
bots and under circler bots (20 seeds per pair and 1200 four-figure rounds
per style), with the rule "adopt only what lowers the highest duel win rate
under both styles, pushes no shape family down by more than a few points and
leaves the rule sentence visibly true". **None passed; no number was
changed.**

| Lever (plain sentence) | Highest duel %, rusher: 77.1 before | circler: 76.3 before | Light shapes in four-figure rounds %, rusher 0.9 / circler 3.3 before | Decision |
|---|---|---|---|---|
| Wide, heavy drawings are slow to get going (acceleration divided by 1 + inertia / 10000) | hedgehog 87.1 | hedgehog 78.7 | 0.8 / 3.6 | not adopted: raises the top under both styles |
| The same, gentler (inertia / 40000) | hedgehog 87.1 | shield 78.2 | 0.9 / 2.9 | not adopted |
| A blade hit on a figure that is already fighting a third one counts double | grille 77.1 | hoop 76.3 | 2.1 / 4.4 | not adopted: duels untouched by design, light shapes gain 1 point |
| The same, triple | grille 77.1 | hoop 76.3 | 3.2 / 5.0 | not adopted |
| Stronger elements (2 and 0.5 instead of 1.5 and 0.75) | grille 77.1 | spiral 74.2 | 1.9 / 3.5 | not adopted: lowers the top under one style only |
| Light figures get their dash back sooner (40 ticks at no ink up to 120 at full ink) | grille 76.6 | hoop 92.1 | 1.3 / 1.5 | not adopted: the one-cell hoop becomes dominant as a circler |
| Big drawings are out sooner (out when the centre is closer to the edge than a quarter of the size radius) | hoop2 80.0 | hoop 82.1 | 1.6 / 2.5 | not adopted: raises the top under both styles |

Solo smoke run, version 3 (four hero drawings, ten enemy designs: the seven
of version 2 plus disc, hollow ring and the 2-wide hoop; 480 runs): by stake
x1 / x1.5 / x2: 66.9 % / 38.1 % / 17.5 % won, average score 1576 / 1897 /
1737. The heavy blunt enemy designs (block, disc, ring, 2-wide hoop), which
before were won in 64 of 64 runs at every stake with scores of 1944 / 2420 /
2930, are now won in 34 / 30 / 13 of 64 runs with scores of 1777 / 2293 /
2195; at x2, 27 of 64 runs end before the boss. At x1.5 every run still
reaches the boss.

What the numbers cannot tell is unchanged: bots do not dodge, bait or redraw,
two bot styles are still two styles, and the field is hand-made. The rules
should now be judged by playing.
