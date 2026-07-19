# Performance Review Board

## Purpose and Roles

Use for performance-focused work and whenever a change materially affects rendering, simulation, population, memory, loading, or target hardware. Mandatory roles: Technical Director, Technical Artist when visible/rendering content is involved, Performance Analyst, QA Lead, and Producer / Scope Controller. Add engine specialist, Gameplay QA, or Release Reviewer as applicable.

## Required Review

- explicit target hardware, build/configuration, budget, scenario, and comparison baseline;
- representative and worst-reasonable workloads;
- CPU/GPU frame time, percentiles/spikes, allocations, memory, loading, and relevant subsystem captures;
- before/after evidence under equivalent visual and gameplay conditions;
- regression and long-duration checks proportional to risk;
- visible/gameplay equivalence review after optimisation.

A numerical pass cannot overrule a visual or gameplay FAIL. If the only way to meet budget changes quality, behaviour, architecture, or scope, report `BLOCKED BY HUMAN DECISION` with concrete options. Do not invent a budget or silently lower quality.
