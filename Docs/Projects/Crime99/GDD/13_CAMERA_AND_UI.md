# Camera and UI

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Prototype scope with deferred extensions
**Validation State:** Needs Prototype Validation
**Approval Status:** Pending Human Developer review
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This document defines the camera, occlusion, player highlighting, HUD, minimap, feedback, and round-end presentation.

## Camera Direction

Final camera behaviour is `Needs Prototype Validation`. Test the `Fixed Camera` and `Rotatable Camera` variants exactly as defined in [`16_PROTOTYPE_SCOPE.md`](16_PROTOTYPE_SCOPE.md#12-camera). Do not add stepped 90-degree rotation, panning, or independent camera translation.

## Camera Goals

The camera should support:

- readable foot combat;
- independent aiming;
- high-speed driving;
- map orientation;
- player visibility;
- traffic anticipation;
- explosion readability;
- nostalgic genre recognition;
- modern 3D presentation.

## Fixed Orientation

Players cannot manually rotate the camera.

Benefits:

- stable orientation;
- easier map learning;
- clearer art composition;
- simpler control expectations;
- stronger camera-aligned road design.

Risks:

- foreground occlusion;
- poor visibility on horizontal roads;
- reduced driving anticipation;
- constrained building design.

## Map Alignment

The main road runs primarily from top to bottom.

This supports the selected camera variant.

Secondary roads may vary, but the map should avoid excessive horizontal high-speed routes.

## Automatic Zoom

## On Foot

Camera is closer to support:

- aim readability;
- character visibility;
- nearby combat;
- pickup recognition.

## In Vehicle

Camera moves farther out.

## At Speed

Higher speed increases distance to improve forward visibility.

## Requirements

Zoom should:

- be smooth;
- avoid sudden changes;
- preserve aim readability;
- avoid motion sickness;
- recover quickly after exiting a vehicle.

## Look-Ahead

A slight speed-based look-ahead may be tested.

It should show more space in the direction of travel.

It must not:

- push the player too close to the screen edge;
- make aiming difficult;
- create unstable camera motion.

## Camera Shake

Camera feedback may support:

- heavy collisions;
- explosions;
- strong weapon fire.

Shake must remain restrained.

It should not reduce control or readability.

## Occlusion

## Problem

Buildings may block the player or enemies.

## Prototype Solutions

Use the simplest reliable method:

- prepared fade zones;
- roof fade;
- wall fade;
- player silhouette;
- hybrid approach.

## Requirements

- local player remains visible;
- enemies do not gain unfair hidden positions;
- transparency does not flicker;
- too much geometry does not disappear at once.

## Player Highlighting

The local player should receive the strongest highlight.

Possible methods:

- outline;
- ground ring;
- subtle glow;
- colour accent;
- directional marker.

Other combatants may receive weaker highlights.

Highlighting must remain visible under:

- neon;
- smoke;
- wet reflections;
- police lights;
- explosions.

## HUD Principles

The HUD should be:

- compact;
- readable;
- persistent;
- low-distraction;
- suitable for keyboard and mouse; optional controller use only if included at negligible effort;
- visually aligned with the neon-industrial style.

Function is more important than polish in the prototype.

## Required Prototype HUD

Always visible:

- health;
- armour;
- stamina;
- current weapon;
- ammunition;
- three weapon slots;
- score;
- wanted status;
- remaining time;
- rudimentary minimap.

## Health, Armour, and Stamina

These should be visually distinct.

The player should understand:

- current health;
- current armour;
- stamina use;
- armour break;
- low-health warning.

## Weapon UI

The UI should show:

- active weapon;
- ammunition;
- three fixed slots;
- empty slots;
- heavy-ammo scarcity.

Initial selection may use direct keys or cycling.

A controller weapon wheel is deferred.

## Score UI

The player should see:

- current score;
- recent score gain;
- creative bonus;
- placement where useful;
- remaining time.

## Wanted UI

The wanted display should show:

- current level;
- entry into pursuit;
- active pressure;
- end of pursuit.

Only wanted level 1 is required in the prototype.

## Creative Kill Feedback

Creative kills should receive:

- clear category name;
- point value;
- strong sound;
- temporary visual emphasis.

Examples:

- Roadkill;
- Chain Reaction;
- Police Assist;
- Close-Range Shotgun;
- Vehicle Explosion.

The presentation should feel arcade-like without obscuring play.

## Minimap

## Prototype Scope

The minimap is rudimentary.

It should show:

- player;
- basic roads;
- map boundary;
- clinics;
- major area orientation;
- important threats or markers where needed.

## Long-Term Expansion

Later modes may show:

- faction buildings;
- influence;
- objectives;
- allies;
- transports;
- police territory;
- active capture.

The prototype should avoid information overload.

## Pickup Feedback

Pickups should be easy to identify.

Possible signals:

- icon;
- ground marker;
- colour language;
- short label;
- pickup sound.

The UI should confirm collection.

## Vehicle UI

Possible prototype information:

- vehicle health;
- burning warning;
- vehicle type;
- speed where useful.

Only essential information should be displayed.

## Damage Feedback

The player should understand:

- health damage;
- armour damage;
- armour break;
- vehicle impact;
- explosion danger;
- low health.

Possible methods:

- screen edge;
- sound;
- flash;
- directional indicator;
- UI bar response.

## Death UI

Death feedback should show:

- attacker;
- cause;
- kill category;
- short respawn status.

The transition should remain fast.

## Results Screen

Prototype results should include:

- placement;
- score;
- kills;
- deaths;
- roadkills;
- explosion kills;
- chain-reaction kills;
- other selected special categories.

The screen should support immediate restart.

## Menus

The first prototype only requires simple controls for:

- start round;
- bot count;
- round duration;
- basic options;
- restart;
- quit.

Full frontend design is deferred.

## Accessibility Considerations

The UI should support:

- scalable text;
- clear contrast;
- icons plus text where practical;
- optional controller navigation only if controller support is included;
- readable colour distinctions;
- reduced reliance on colour alone.

Detailed accessibility scope remains open.

## Camera and UI Validation Questions

- Is the player always visible?
- Is aiming clear?
- Is enough road visible at speed?
- Does zoom remain comfortable?
- Does look-ahead help?
- Do buildings hide combat?
- Is the HUD readable during chaos?
- Are creative callouts exciting but not obstructive?
- Is the minimap useful without becoming dominant?
- Are health, armour, and stamina immediately distinct?

## Success Criteria

Camera and UI succeed when:

- high-speed driving remains readable;
- foot combat remains precise;
- the player is easy to locate;
- zoom feels natural;
- occlusion is controlled;
- HUD information is understandable;
- kill feedback feels strong;
- the minimap improves orientation;
- visual feedback survives neon, smoke, and explosions.

## Failure Conditions

Revise if:

- traffic appears too late;
- camera zoom disorients;
- horizontal routes become unusable;
- buildings regularly hide combat;
- outlines become excessively bright;
- UI blocks the action;
- the minimap becomes mandatory for basic navigation;
- effects hide critical information.

## Live-Tuning Variables

- camera height;
- camera tilt;
- camera distance;
- foot zoom;
- vehicle zoom;
- speed zoom;
- zoom smoothing;
- look-ahead distance;
- camera shake;
- occlusion threshold;
- highlight intensity;
- UI scale;
- callout duration;
- minimap size;
- damage feedback intensity.

## Deferred Features

- camera rotation;
- cinematic camera;
- replay camera;
- photo mode;
- advanced spectator camera;
- full weapon wheel;
- detailed front-end;
- advanced accessibility menu;
- faction-war map layers.

## Authorisation Boundary

This document defines camera and UI direction.

It does not authorise:

- camera implementation;
- UI implementation;
- package selection;
- production work.

Those actions require separate approval.
