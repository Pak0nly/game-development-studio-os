# Art Direction

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Prototype scope with deferred extensions
**Validation State:** Needs Prototype Validation
**Approval Status:** Pending Human Developer review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This document defines the visual identity, asset priorities, style-validation process, asset-source strategy, and production boundaries.

## Core Art Statement

> Neon over Dirt.

The city should combine:

- selective neon;
- wet roads;
- grime;
- soot;
- smoke;
- steam;
- industrial decay;
- old infrastructure;
- strong headlights;
- police lights;
- readable silhouettes.

Neon enhances the city.

It does not replace dirt, age, or criminal atmosphere.

## Visual Identity

The intended style is:

- simplified 3D geometry;
- slightly exaggerated proportions;
- adult tone;
- strong material and lighting quality;
- readable action from an elevated camera;
- cohesive rather than asset-pack-like.

The game should feel like nostalgia in a new form.

## Stylisation Level

Vehicles and characters should be only lightly exaggerated.

They should not become:

- toy-like;
- chibi;
- heavily cartooned;
- photorealistic.

Exaggeration should improve:

- silhouette;
- readability;
- vehicle class distinction;
- animation clarity.

## Geometry

Geometry may remain relatively simple.

Quality should come from:

- proportion;
- silhouette;
- material consistency;
- lighting;
- controlled detail;
- animation;
- atmosphere;
- effects.

Simple geometry must look intentional rather than unfinished.

## Materials

## Required Direction

- wet asphalt;
- worn concrete;
- dirty metal;
- aged paint;
- industrial surfaces;
- controlled emissive signs;
- consistent roughness;
- limited metallic response;
- shared dirt treatment.

## Final-Leaning Prototype Materials

The Style Slice should use final-leaning materials even if geometry remains simplified.

This validates the real visual direction early.

## Colour

The city should use a restrained base palette.

Base environment:

- dark asphalt;
- dirty concrete;
- rust;
- muted paint;
- industrial greys and browns.

Accents:

- neon signs;
- vehicle lights;
- police lights;
- gameplay highlights;
- fire and explosions.

Bright colours should remain selective.

## Lighting

Lighting should support:

- navigation;
- player readability;
- district identity;
- vehicle presence;
- danger communication.

Important sources include:

- streetlights;
- signs;
- headlights;
- brake lights;
- police lights;
- fire;
- industrial light;
- shop lighting.

The scene should not become uniformly dark.

## Wet Roads

Wet roads are a core style feature.

They should provide:

- reflection;
- visual depth;
- neon response;
- vehicle-light response.

They must not hide:

- pickups;
- characters;
- burning vehicles;
- road hazards;
- aim direction.

Reflection intensity must remain tunable.

## Smoke and Steam

Smoke and steam support:

- industry;
- dirt;
- depth;
- damage;
- vehicle state;
- city atmosphere.

They should remain local and controlled.

Excessive overdraw or visual obstruction should be avoided.

## Vehicles

Vehicles receive the highest asset priority.

Required prototype vehicles:

- compact car;
- saloon;
- van;
- refuse truck.

Vehicle art should emphasise:

- silhouette;
- class difference;
- wheels;
- mass;
- front and rear readability;
- headlights;
- exhaust;
- smoke;
- damage state;
- burning;
- exploded state.

Detailed interiors are not required.

## Characters

Required categories:

- player or combatant;
- FFA bot;
- civilian;
- police officer.

A shared technical base is preferred where efficient.

Variation may use:

- colour;
- clothing;
- accessories;
- silhouette;
- limited body variation.

Not required:

- unique faces;
- cloth simulation;
- facial animation;
- dialogue animation.

## Buildings

Prototype buildings are non-enterable.

They should be:

- modular;
- easy to combine;
- camera-friendly;
- suitable for signs and lighting;
- visually consistent;
- distinct enough for navigation.

Types may include:

- urban blocks;
- shops;
- bars;
- clinics;
- warehouses;
- industrial halls.

## Environment Objects

Prototype examples:

- streetlights;
- traffic lights;
- mailboxes;
- fences;
- containers;
- signs;
- benches;
- barriers.

Only a small consistent set is required.

## Signage

The simplest consistent language solution should be used.

Possible options:

- English;
- fictional brands;
- symbols;
- minimal readable text.

Consistency is more important than the specific language.

## VFX Priorities

## High Priority

- vehicle fire;
- vehicle explosion;
- chain reactions;
- smoke;
- steam;
- headlights;
- police lights;
- wet-road response.

## Functional Priority

- muzzle flash;
- projectile impact;
- blood;
- armour break;
- medkit;
- score callouts.

## Asset Sources

Store assets and AI-produced assets are evaluated equally during the prototype.

The preferred source is determined by:

- efficiency;
- consistency;
- technical quality;
- game readiness;
- scalability;
- correction effort;
- licence;
- performance.

## Later Asset Evaluation Scope

No package, source, purchase, download, subscription, or installation is authorised or preferred by this document. A separately authorised evaluation may compare complete and specialised options for:

- modular city packages;
- vehicle foundations;
- humanoid animations;
- traffic systems;
- VFX;
- wet-road materials;
- lighting systems;
- UI foundations.

## Deferred AI-Assisted Production Evaluation

The confirmed Studio OS direction supports a later project-specific Claude/Blender evaluation. Its acceptance evidence, provenance requirements, correction cost, and Human Developer review points remain to be defined before any setup or use. Other possible production categories include:

- ChatGPT or image generation for 2D;
- procedural variation;
- automated material setup;
- AI-assisted cleanup.

Possible 3D categories:

- vehicles;
- buildings;
- city objects;
- variants;
- collision models;
- LODs;
- UV preparation.

Possible 2D categories:

- signs;
- decals;
- logos;
- UI;
- icons;
- posters;
- graffiti;
- material concepts.

## Human Production Boundary

Routine asset production should not require continuous manual human work.

Human responsibilities remain:

- direction;
- review;
- feedback;
- approval;
- prioritisation.

If an asset category repeatedly requires manual repair, the production method should change.

## Style Unification

All sources must pass through a shared visual layer.

Requirements include:

- consistent scale;
- consistent proportions;
- common material rules;
- shared roughness;
- shared dirt treatment;
- limited palette;
- similar detail density;
- compatible animation style;
- coherent edge and silhouette language.

## Style Slice

## Stage 1

Create a small scene containing:

- one street;
- one building;
- one vehicle;
- one character;
- wet asphalt;
- neon;
- smoke or steam.

## Goals

Validate:

- camera;
- scale;
- material response;
- lighting;
- atmosphere;
- visual cohesion.

## Stage 2

Add:

- more buildings;
- several vehicle types;
- civilian;
- police;
- more city objects.

Validate reproducibility.

## Stage 3

Test during active gameplay with:

- bots;
- traffic;
- police;
- explosions;
- smoke;
- speed.

Validate readability and performance.

## Visual Go Criteria

Proceed when:

- assets look like one game;
- the style works in motion;
- vehicles remain readable;
- simple geometry looks intentional;
- wet roads do not hide gameplay;
- asset production is repeatable;
- human manual correction remains exceptional.

## Visual Failure Conditions

Revise direction when:

- the style only works in screenshots;
- asset sources remain visibly separate;
- neon creates visual noise;
- reflections hide hazards;
- vehicles and characters use incompatible proportions;
- AI assets require routine manual fixes;
- the camera cannot show the intended detail.

## Scope Reduction Order

Reduce first:

1. building variation;
2. civilian variation;
3. number of prop types;
4. UI styling;
5. secondary VFX.

Do not reduce before visual validation:

- vehicle readability;
- wet asphalt;
- neon-night identity;
- smoke and atmosphere;
- material cohesion;
- player visibility;
- asset consistency.

## Authorisation Boundary

This document defines art direction.

It does not authorise:

- asset purchases;
- asset generation;
- Blender integration;
- Style Slice production;
- package downloads;
- production work.

Those actions require separate approval.
