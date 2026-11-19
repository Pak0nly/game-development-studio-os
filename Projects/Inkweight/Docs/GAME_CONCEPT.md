# Inkweight Game Concept

Working title. Concept approved by the Human in chat on 2026-11-19 (ID-01 to
ID-04). Details of the ink system: [`INK_RULES_V1.md`](INK_RULES_V1.md).

## 1. Idea

A fast, uncomplicated game in which the players draw all graphics themselves.
No generated images or sounds ship with the game: every picture on screen was
drawn by a human, the player. The drawing is not decoration; the game derives
the figure's weight, armour, damage and element from measurable properties of
the drawing, without any image recognition.

One sentence for the player: amount is weight, filled areas are armour, thin
lines are blades, colour is the element.

## 2. Why this can work

- Scribbles are enough. A tiny canvas, four colours and a time limit make every
  drawing equally rough, and the game's frame (paper look, wobbling outline,
  code-driven squash and hop) makes rough drawings charming.
- Every stroke is a decision because ink is the currency.
- Solo and local play need no server and no moderation; drawings stay on the
  player's device and are never used for training (DEC-025).

## 3. One game, two modes

Both modes share the canvas, the ink rules, the physics and the look.

### Mode A: Solo Arena

A short arena run (10 to 15 minutes). The player draws a hero and a thrown
weapon, then also draws the enemies of each wave and chooses how much ink the
wave is worth: more ink means more danger and more reward. A final boss is
assembled from the run's own enemy drawings. The solo mode carries the sale on
Steam.

### Mode B: Ink Games (party, 2 to 4 players)

A discipline is announced, everyone draws for a short time, then the drawings
compete. Version 1 has one discipline, the Ring: push the others out of a
shrinking ring or wear their armour down. Later disciplines (rolling race,
tower, long throw) reward different shapes so no single drawing is always best.
Losers get more ink next round. The party mode is the possible hidden gem.

Naming note: the chat used the German nickname "Tinten-Olympiade"; "Olympic"
names are legally protected in many countries and must not be used in the
product (OD-02).

## 4. Shared core

- Canvas: 32 x 32 cells, black plus three colours, ink meter, time limit.
- The drawing is the figure: outline is the hitbox, ink amount is the mass.
- Live stat display while drawing.
- Frame: paper look, wobbling outline, squash and hop by code.
- Sounds: recorded by the players themselves or made by classic synthesizer
  code; no generated audio (OD-06).

## 5. Platforms and engine

Steam (PC) first. Unity is the target engine so mobile and web builds stay
possible if needed (ID-04). A browser prototype exists only as a design tool to
test the fun quickly; it is not the product.

## 6. Honest positioning

The game can truthfully say that it contains no generated images or sounds. It
cannot say "made without AI": the code is written with AI assistance. Store
wording and the Steam AI disclosure are checked before any release (OD-05).

## 7. Biggest risks

- Optimal shape: if one shape always wins, all drawings look the same. The
  prototype measures this with a balance simulation.
- Input device: drawing works well with a mouse, best with touch, badly with a
  gamepad. A phone as a drawing pad on the local network is the ideal party
  setup but clearly more technology (OD-07).
- Sharing drawings online would need moderation; start local only (OD-08).

## 8. Originality

Only general genre mechanics are used (drawing games, arena survival, ring-out
party fights). No names, characters, art, music, levels or look of any existing
game are copied, and no existing game is recreated.
