# Economy and Progression

## Status

**Document Maturity:** In Review
**Prototype Disposition:** Deferred
**Validation State:** Needs Validation
**Approval Status:** Not approved
**Project Phase:** Definition
**Implementation Status:** Not authorised
**Last Reviewed:** 2026-07-14

## Purpose

This document defines the current direction for:

**Content Classification:** `Deferred Current Hypothesis`. All economy, progression, price, monetisation, life, and tuning statements below are unconfirmed proposals, not requirements. They must not influence the first prototype, architecture, or implementation unless separately reviewed and confirmed.

- match resources;
- faction income;
- upkeep;
- upgrade funding;
- bonus transports;
- personal lives;
- temporary progression;
- between-match progression;
- monetisation boundaries.

Most economy systems are deferred from the first prototype.

## Economy Philosophy

The game should use economy to create tactical choices.

It should not become:

- an inventory-management game;
- a business simulator;
- a grind-based progression game;
- a pay-to-win system;
- a spreadsheet.

## Prototype Resources

The first prototype uses temporary resources only:

- health;
- armour;
- stamina;
- ammunition;
- weapons;
- vehicles;
- score.

There is no money economy in the first prototype.

## Match-Based Progression

Within later modes, players may gain:

- money;
- better weapons;
- armour;
- vehicles;
- access to services;
- influence;
- personal lives;
- tactical options.

Most or all advantages reset between matches.

## Personal Money

## Direction

Money should belong to individual players.

There is no default shared faction pot.

Players decide how to spend their own money.

## Possible Uses

- equipment;
- armour;
- lives;
- bribery;
- snitching;
- upgrades;
- transports;
- specialised services.

## General Income

## Sources

Possible faction-mode income:

- HQ base income;
- controlled buildings;
- specialised buildings;
- optional transport rewards.

## Distribution

Preferred direction:

- income is calculated;
- upkeep is deducted;
- remaining income is distributed fairly among connected active faction players.

## Active Player Definition

A player should not receive full income while inactive.

Current direction:

- inactivity detection remains a deferred question with no confirmed duration;
- simple repeated input should not bypass inactivity detection.

Exact rules require technical review.

## Connected and Isolated Buildings

## Connected

Connected buildings provide:

- full income;
- full logistics;
- better NPC support;
- specialised functions.

## Isolated

Isolated buildings remain owned but provide:

- reduced income;
- weaker or delayed support;
- limited specialised functionality.

Preferred direction is reduced income rather than zero.

This reflects unsafe transport across hostile territory.

## Upkeep

## Purpose

Upkeep prevents unlimited expansion and creates meaningful trade-offs.

## Possible Upkeep Sources

- buildings;
- NPC forces;
- upgraded services;
- special defences.

## Payment Order

Upkeep is paid before income distribution.

## Negative Income

If the faction cannot cover upkeep:

1. NPC forces are reduced;
2. highest-upkeep buildings shut down;
3. services remain unavailable until affordable.

## Feedback

Players should see:

- total faction income;
- current local income where useful;
- upkeep warning;
- disabled buildings.

Detailed data may be available at HQ.

## Upgrade Funding

## Direction

Players fund upgrades proportionally through a shared progress bar.

This avoids one player blocking an upgrade by withholding the full cost.

## Rules

- investment occurs at the relevant location;
- multiple players may contribute;
- progress remains visible;
- upgrade begins when fully funded;
- upgrade time may be short.

## Design Goal

Funding should create cooperation without requiring a shared wallet.

## Bonus Income Transports

## Purpose

Transports create optional high-risk, high-reward events.

## Trigger

Players may choose to start a transport.

Longer preparation may produce:

- larger reward;
- greater exposure;
- more valuable target.

## Enemy Interaction

Enemies may:

- attack;
- intercept;
- destroy;
- capture;
- drive the transport to their HQ.

## Destruction

If destroyed, part of the value may drop into the world.

## Boundary

Transport income is a bonus.

It should not be mandatory for basic faction survival.

## Personal Lives

## Status

**Content Classification:** `Deferred Current Hypothesis`; no life or economy rule is confirmed.

## Purpose

Personal lives create mode-specific elimination pressure.

## Current Direction

- each player begins with one life;
- additional lives are purchased;
- purchases should happen before death;
- lives are personal;
- one player cannot buy for another;
- maximum lives are limited;
- price increases by tier.

## Design Risk

Limited lives may reduce the intended chaos.

This system must be tested separately from unlimited-respawn FFA.

## Possible Teammate Revival

One player may possibly sacrifice one own life to revive a teammate.

Not confirmed.

## Death Costs

Earlier concepts included:

- money loss;
- hospital fees;
- equipment loss.

The current stronger direction is to use mode-specific lives rather than stacking many death penalties.

Additional death costs should be avoided unless testing proves necessary.

## Equipment Progression

Within a match, equipment should create temporary power growth.

Players may progress from:

- basic pistol;
- stronger weapons;
- armour;
- better vehicles;
- specialised access.

This progression should remain recoverable after death through map play.

## Permanent Progression

## Direction

Permanent progression should focus on:

- cosmetics;
- statistics;
- achievements;
- titles;
- profile levels;
- visual unlocks;
- sidegrades where fair.

## Boundary

Permanent competitive power should be avoided.

The game should not sell or require stronger combat stats.

## Monetisation

## Current Direction

- premium purchase;
- price is `Deferred` with no confirmed numeric assumption;
- no pay-to-win;
- possible cosmetic expansion later.

## Cosmetic Possibilities

- character outfits;
- vehicle colours;
- decals;
- faction-style visuals;
- profile elements;
- kill-callout presentation.

Cosmetics must preserve readability.

## Economy Success Criteria

The long-term economy succeeds when:

- players understand income;
- upkeep creates choices;
- upgrades encourage cooperation;
- isolated buildings remain useful but weaker;
- transports create optional conflict;
- money does not require constant administration;
- personal lives create tension without destroying chaos;
- no permanent power gap develops.

## Economy Failure Conditions

The direction requires revision if:

- players spend more time managing than fighting;
- income distribution feels unfair;
- one player can block faction upgrades;
- upkeep causes sudden unexplained collapse;
- transports become mandatory;
- lives make players avoid action;
- permanent progression creates power imbalance;
- monetisation affects competitive strength.

## Deferred Decisions

- income rate;
- building values;
- upkeep formula;
- active-player detection;
- distribution frequency;
- upgrade costs;
- transport size;
- dropped transport value;
- life count;
- life prices;
- maximum lives;
- teammate sacrifice;
- between-match cosmetics;
- final commercial pricing.

## Authorisation Boundary

This document defines deferred economy and progression direction.

It does not authorise:

- money implementation;
- monetisation;
- purchases;
- life systems;
- progression systems;
- production work.

Those actions require separate approval.
