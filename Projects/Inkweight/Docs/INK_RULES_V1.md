# Inkweight Ink Rules, Version 1 (Prototype Proposal)

Status: Director proposal for the first prototype, written on 2026-11-19 from
the concept the Human approved in chat (ID-02, ID-03). Every number here is a
prototype tuning value and a proposal, not a Human decision. The machine-readable
values live in `Source/Shared/ink_tuning.json`; when the two differ, the JSON
file is what the game runs and this document must be corrected by a Work Order.

The rules exist to make every stroke a game decision while staying readable in
one sentence: **amount is weight, filled areas are armour, thin lines are
blades, colour is the element.**

## 1. Canvas

- Grid of 32 x 32 cells. Cell value 0 is empty; 1 Black (neutral), 2 Red
  ("Ember"), 3 Blue ("Tide"), 4 Green ("Moss").
- Every filled cell costs exactly 1 ink, whatever its colour. Erasing refunds.
- A drawing has an ink budget (default 220 for a figure, 60 for a thrown
  weapon). The game shows the remaining ink while drawing.
- The top of the canvas is the front of the figure.

## 2. From drawing to body

1. The body is the largest 4-connected group of filled cells. Ties are broken
   by the group that contains the lowest cell index (`y * 32 + x`). All other
   filled cells "drip off": they are removed and do not count.
2. A body needs at least 12 cells to be valid.
3. The body is rigid. Its collision shape is derived from its cells, so the
   drawn outline is the hitbox. Its centre is the centroid of its cells.

## 3. Stats

Let `N` be the number of body cells. For each body cell count its 8
neighbours; neighbours outside the canvas count as empty.

- **Core cell:** all 8 neighbours are body cells. `C` = number of core cells.
- **Sharp cell:** at least 5 of the 8 neighbours are empty. `S` = number of
  sharp cells. Lines, tips and thin spikes are sharp; the flat side of a filled
  area is not.

| Stat | Meaning | Starting formula |
|---|---|---|
| Weight | Pushes harder, accelerates slower | `N` |
| Armour (hit points) | How much damage the figure survives | `20 + 2 * C + 0.25 * N` |
| Sharpness (damage) | Damage when a sharp cell touches an opponent | `3 + 0.12 * S` |
| Top speed | Movement | `9 / (1 + N / 160)` cells per second |
| Size | Hit area, reach, leverage | radius of the cells around the centroid |
| Element | Rock-paper-scissors bonus | see below |

A touch that is not made by a sharp cell does blunt damage of 1. The same pair
of figures can damage each other at most once per 0.4 seconds per direction.

## 4. Element

- Count the body cells per colour. If the coloured (non-black) cells are at
  least 30 % of `N`, the element is the colour with the strict plurality among
  them; otherwise the figure is neutral. A tie between colours is neutral.
- Ember beats Moss, Moss beats Tide, Tide beats Ember.
- Damage against the element you beat is multiplied by 1.5; against the element
  that beats you by 0.75. Neutral gives and takes 1.0.

## 5. Movement

- Top-down arena, no gravity. The player steers with one stick or four keys and
  has one dash button (short burst, cooldown).
- The figure turns its front (canvas top) toward the steering direction, so a
  blade drawn at the top points at the enemy.
- Collisions push by weight. The collision method must be identical in the web
  prototype and the Unity core and is documented by the implementing Work Order.

## 6. Mode B: Ink Games, discipline "Ring" (2 to 4 figures)

- Everyone draws a figure with the same budget and time limit (default 30 s),
  then fights in a round ring that shrinks over time.
- A figure is out when its centre leaves the ring or its armour reaches 0.
  Last figure standing wins the round; first to 3 round wins takes the match.
- Catch-up: every lost round gives +15 % ink budget for the next drawing.
- Seats can be human (keyboard, gamepad, touch) or a simple bot.

Later disciplines (rolling race, tower, long throw) need side-view gravity and
are not part of version 1.

## 7. Mode A: Solo Arena

- Before the run the player draws a hero (220 ink) and a thrown weapon (60
  ink). The hero throws the weapon automatically at the nearest enemy; weapon
  weight gives knockback and a slower throw rate, weapon sharpness gives damage.
- Before each wave the player draws one enemy design. The wave has an ink
  budget; the game spawns as many copies as the budget pays for (budget divided
  by the design's `N`, at least 1). Small drawings swarm, big drawings are
  brutes.
- The player picks the wave's stake: x1, x1.5 or x2 budget. Defeated enemies
  drop their ink; collected ink is the score and pays for one upgrade between
  waves (more hero ink with a redraw, more weapon ink with a redraw, heal, an
  extra colour).
- A run is 5 waves and a final boss assembled by the game from the enemy
  drawings of the run.

## 8. Design risk the prototype must answer

If one shape always wins, everyone draws the same blob and the game is dead.
The prototype therefore ships a headless balance simulation that plays a field
of archetype drawings against each other. Target for version 1: no archetype
above 60 % average win rate across the field and at least three clearly
different shapes that can win.
