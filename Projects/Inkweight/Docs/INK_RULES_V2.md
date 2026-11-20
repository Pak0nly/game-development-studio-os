# Inkweight Ink Rules, Version 2 (Prototype Proposal, As Built)

Status: Worker proposal from Work Order INK-CORE-V2 (2026-11-20). It describes
the rules as the engine-free core now runs them, after the independent review
of version 1 and a second balance pass. Every number and every rule that is
new against `INK_RULES_V1.md` is a prototype proposal, not a Human decision;
new rules are marked **(new)**. The machine-readable values live in
`Source/Shared/ink_tuning.json` (`ink-tuning-2`); when the two differ, the JSON
file is what the game runs. The exact algorithms are in
`Source/Shared/RULES_AS_BUILT.md`, the differences to the first core in
`Source/Shared/CHANGES_V2.md`. `INK_RULES_V1.md` is unchanged.

The one sentence still holds: **amount is weight, filled areas are armour,
thin lines are blades, colour is the element.** Version 2 adds one half
sentence: **and a closed shell holds a little armour inside.**

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
| Weight | Pushes harder, accelerates slower | `N` |
| Armour (hit points) | How much damage the figure survives | `170 + 0.7 * C + 0.8 * min(P, N - S)` |
| Sharpness (damage) | Damage when a blade cell touches an opponent | `1 + 1.2 * S^2 / (S^2 + 25) + 1.2 * (S / N)^2 / (1 + N / 60)` |
| Top speed | Movement | `38 / (1 + N / 70)` cells per second |
| Size | Hit area, reach, leverage | radius of the cells around the centroid |
| Element | Rock-paper-scissors bonus | see section 4 |

How to read the two changed stats:

- **Armour.** Every figure has 170. Filling adds up to about 110 more (a full
  solid has about 275). A closed shell with walls at least two cells thick
  gets 0.8 per pocket cell, at most one pocket cell per wall cell that is not
  a blade cell; a loop drawn with a one-cell line holds nothing.
- **Sharpness.** The first part counts blade cells and has a ceiling: 5 blade
  cells give half of it, 12 cells give 1.0 of the possible 1.2. So a sword
  drawn on a solid body moves the stat from 1.0 to about 2.0, and more spikes
  add little. The second part rewards a drawing that is nothing but blade,
  the more the lighter it is: a 12-cell line reaches 3.0, a 32-cell line 2.95,
  a thin cross 2.8, a heavy snake of 209 blade cells 2.5. The highest possible
  value is below 3.4.

A touch that is not made by a blade cell does blunt damage of 1.2. A touch
with a blade cell does the sharpness, and never less than blunt **(new)**.
The same pair of figures can damage each other at most once per 0.4 seconds
per direction. One contact hurts both sides, each with what it touched with.
A hit also pushes the victim back by `damage * 39 / weight` cells per second.

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
  fast (no figure moves more than 0.4 cells between two checks), so figures
  can no longer pass through each other.

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
- **(new)** Enemy copies have armour `30 + 1.2 * (armour of the design -
  170)`: thin designs make fragile swarms, filled designs make tough brutes.
  They move at 55 % of the design's speed and hit with 60 % of its damage.
- **(new)** The stake matters for danger and for reward: besides more copies
  the enemies hit 1.25 or 1.5 times harder and are 1.1 or 1.2 times faster at
  x1.5 and x2, and the drops of a wave together pay out the whole staked
  budget (so a higher stake pays more even when the number of copies is at its
  limit).
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
hopeless in four-figure rounds.

Measured with `node sim/balance.js --seeds 60 --ffa 1200 --soloseeds 6`
(18 archetypes: the 14 of version 1 plus four "player optimiser" drawings; two
bot styles and a mixed configuration; 9180 duel rounds and 1200 four-figure
rounds per configuration). Full tables:
`Artifacts/Inkweight/Evidence/INK-CORE-V2/BALANCE_REPORT.md`.

| Measure | Version 1 (14 archetypes, rusher bot only) | Version 2 |
|---|---|---|
| Highest average duel win rate, all three bot configurations | not measured | shield 61.4 % |
| Highest, mean of rusher-only and circler-only | not measured | shield 65.2 % |
| Highest, rusher bot only | wedge 71.3 % | splinter 79.0 % (needle 77.9 %, block 71.6 %) |
| Highest, circler bot only | not measured | hoop 83.5 % |
| Shape families with an archetype at or above 50 % | solid, core+blades, blades | solid, hollow, blades, core+blades, small |
| Highest four-figure win rate (25 % = even) | wedge 65.5 % | shield 39.3 % (rusher only: block 52.7 %) |
| Light shapes in four-figure rounds | line 4.4 %, cross 4.2 %, needle 4.7 %, dot 0.9 % | pooled: needle 19.1 %, cross 13.4 %, line 9.4 %, dot 10.7 %, 12-cell line 25.3 %; rusher only: line 2.5 %, cross 3.1 % |
| Hollow shapes, duel | ring 30.6 %, frame 26.3 % | ring 52.8 %, frame 41.4 % |
| Smallest blob (dot), duel | 0.8 % | 15.7 % |

Verdict:

- **"No archetype above 60 %": not met.** The pooled number (61.4 %) is close,
  but it is flattered by the mixed configuration, in which the bot style and
  not the drawing decides (a rusher beats a circler in 91.7 % of duels). Under
  one bot style alone single drawings still reach 79 to 84 %. Against version
  1 the winners under the rusher bot changed from heavy solids to light pure
  blades; the highest rusher-only rate did not go down.
- **"At least three clearly different shapes can win": met**, with five shape
  families at or above 50 %.
- **"Light shapes not hopeless in four-figure rounds": partly.** The highest
  four-figure win rate fell from 65.5 % to 39.3 %, and three of five light
  drawings are at or above half of an even share. The plain line and the thin
  cross remain weak when every bot rushes into the middle.
- The four optimiser drawings (one-cell loop, all-blade snake, nested loops,
  12-cell line) end between 52 and 55 % pooled; none breaks the field, but
  the 12-cell line wins 79 % of duels as a rusher.

Solo smoke run (bot hero, four hero drawings, six enemy designs, 432 runs):
59.7 % of runs won including the boss, with 29.9 % armour left on average;
by stake x1 / x1.5 / x2: 80.6 % / 62.5 % / 36.1 % won, average score 1484 /
1791 / 1807. Version 1: 86 % of 180 runs won, mostly with more than 75 % armour
left. Swarms of needles are beaten at x1 by three of the four bot heroes and
are deadly at x1.5 and x2.

What the numbers cannot tell is unchanged: bots do not dodge, bait or redraw,
two bot styles are still two styles, and the field is hand-made. The rules
should now be judged by playing.
