# Multiplayer

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Deferred
**Validation State:** Needs Validation
**Approval Status:** Not approved
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This document defines the intended multiplayer direction and architectural boundaries.

**Content Classification:** `Deferred Current Hypothesis`. Networking, matchmaking, hosting, crossplay, spectator rules, authority models, and all associated values are unconfirmed and outside the first prototype. This module records desired outcomes, constraints, risks, and open architecture questions only.

Network multiplayer is not part of the first prototype.

## Multiplayer Principle

The game is multiplayer-focused but not multiplayer-dependent.

Core modes should remain playable with bots.

Human players should add:

- unpredictability;
- rivalry;
- deception;
- humour;
- social stories.

They should not be required for basic functionality.

## Development Sequence

Current directional sequence:

1. solo-testable FFA prototype;
2. networked version of the same FFA;
3. Team Deathmatch;
4. reduced Faction War;
5. scaled Faction War;
6. cooperative and alternative modes.

This sequence is not yet implementation authorisation.

## First Multiplayer Test

The first networked test should reuse the validated FFA.

It should avoid adding:

- factions;
- economy;
- new weapons;
- new vehicles;
- new map systems;
- long-term progression.

The goal is to validate networking, not expand game design.

## Session Types

Possible long-term session types:

- private lobby;
- public lobby;
- Quick Play;
- LAN-style access;
- friends-only session;
- bot-filled session.

Exact launch scope remains open.

## Bots in Multiplayer

Bots may:

- fill empty slots;
- support solo sessions;
- replace disconnected players;
- keep low-population matches active;
- provide cooperative enemies.

Bot use should be configurable where practical.

## Joining and Leaving

Long-term multiplayer should consider:

- late join;
- reconnect;
- bot replacement;
- host departure;
- match state synchronisation;
- spawn fairness.

Exact rules remain open.

## Hosting Model

Possible approaches include:

- player-hosted;
- dedicated server;
- relay-assisted host;
- hybrid.

No model is selected.

The decision depends on:

- cost;
- player count;
- simulation complexity;
- anti-cheat;
- reliability;
- platform;
- Faction War requirements.

## Authority and Simulation

Any later architecture review must evaluate clear responsibility boundaries among:

- input;
- gameplay intent;
- simulation;
- presentation;
- damage;
- scoring;
- spawning.

No networking model, code structure, or implementation strategy is selected here. Actual networking remains deferred until after prototype success and separate authorisation.

## Match Sizes

Prototype stress target:

- twelve combatants total.

Long-term Faction War may require more.

No commercial player count is confirmed.

## LAN

LAN-style access remains desirable for nostalgic and social reasons.

Possible interpretations:

- true local network discovery;
- direct private session;
- simple invite flow;
- local host.

This remains deferred.

## Split Screen

Split screen was mentioned as a possible nostalgic direction.

It is not currently committed.

Risks include:

- performance;
- UI complexity;
- camera conflict;
- controller handling;
- visibility.

It should be evaluated only after the core multiplayer model is clear.

## Crossplay

Crossplay is deferred.

It depends on:

- final platforms;
- networking provider;
- account system;
- certification;
- input balance.

## Matchmaking

Possible long-term features:

- Quick Play;
- region selection;
- party queue;
- bot backfill;
- skill consideration;
- mode preference.

No matchmaking design is confirmed.

## Private Sessions

Private sessions should allow friend groups to:

- choose mode;
- adjust bots;
- adjust round rules;
- set traffic and police limits;
- configure friendly fire;
- start quickly.

## Public Sessions

Public sessions require later decisions on:

- moderation;
- anti-cheat;
- reporting;
- matchmaking;
- server authority;
- host migration;
- persistence.

## Competitive Integrity

The game should avoid:

- pay-to-win;
- hidden bot advantages;
- severe mouse-controller imbalance;
- host-only gameplay advantage;
- unclear damage attribution.

Controller aim assistance may require mode-specific limits.

## Networking Risks

Major risks include:

- vehicle physics synchronisation;
- collision fairness;
- explosion chains;
- many AI actors;
- traffic;
- police;
- late join;
- large Faction War matches.

These risks support the decision to validate solo gameplay first.

## Multiplayer Success Criteria

Proceed beyond initial network testing when:

- movement feels consistent;
- vehicle ownership is reliable;
- collisions remain fair;
- damage and score synchronise;
- bots coexist with players;
- reconnect and join rules are understandable;
- the match remains playable under normal latency.

## Multiplayer Failure Conditions

Revise direction if:

- vehicle physics cannot remain fair;
- FFA requires major gameplay changes online;
- traffic and police create unacceptable bandwidth cost;
- host advantage dominates;
- networking requires a full rewrite of validated gameplay;
- bot and player rules diverge.

## Deferred Multiplayer Features

- public matchmaking;
- ranking;
- dedicated servers;
- crossplay;
- console networking;
- split screen;
- spectator system;
- tournaments;
- clans;
- persistent accounts;
- social systems;
- voice chat.

## Authorisation Boundary

This document defines multiplayer direction.

It does not authorise:

- networking implementation;
- provider selection;
- server spending;
- account systems;
- public lobbies;
- production work.

Those actions require separate approval.
