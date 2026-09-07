# Tool and Asset Capability Knowledge Base Standard

**Status:** Adopted through explicit Human Developer direction on 2026-08-22.
**Amendment ID:** `SOS-GOV-TACKB-V1`.

## Purpose

The Tool and Asset Capability Knowledge Base prevents useful engine/editor
capabilities, installed tools, owned assets, proven workflows and prior lessons
from being forgotten when a new problem is planned. It turns holdings and task
evidence into a searchable decision aid so Work can prefer the best locally supported option over
unnecessary bespoke construction, repeated failed methods or avoidable
technical debt.

The Knowledge Base is operational documentation. It is not an AI training,
fine-tuning, embedding, evaluation or cross-user reference corpus and does not
weaken the no-training boundary.

## Authority and Ownership

- This standard owns the project-independent record schema, evidence states,
  consultation rule and maintenance rule.
- Each project owns its project-specific capability index and capability
  records.
- Asset inventories remain the Source of Truth for ownership, acquisition,
  provenance and high-level holdings.
- Package manifests, source files, evidence artifacts and accepted project
  documents remain the Source of Truth for exact technical and visual claims.
- A capability record links those owners. It does not copy large evidence
  payloads or overrule them.
- A record never grants purchase, download, installation, mutation, Unity,
  network, licence, adoption or Git authority.

## Evidence States

Every material capability claim uses one of these states:

- `DOCUMENTED`: stated by official documentation or a trusted Vendor source;
  not yet confirmed locally.
- `LOCALLY PRESENT`: files or configuration are present in the verified local
  project.
- `STATICALLY VERIFIED`: local source, configuration or serialized data
  directly supports the claim without executing it.
- `RUNTIME PROVEN`: the exact capability executed successfully in a named
  local candidate or fixture.
- `VISUALLY PROVEN`: representative original evidence passed direct visual
  review for the stated use and context.
- `ADOPTED`: the Human or an authoritative project decision accepted the
  capability for the stated production scope.
- `REJECTED FOR STATED USE`: representative evidence rejected the exact use;
  this is not a package-wide rejection unless that wider scope was proven.
- `UNKNOWN / REFRESH REQUIRED`: evidence is absent, stale, contradictory or
  too narrow for the current decision.

Technical construction, compilation or API reachability must not be promoted
to visual proof or adoption. A failed candidate must not be promoted to a
tool-wide failure when another profile, workflow, configuration or use remains
untested.

## Required Project Structure

A project that has material tools or assets maintains:

```text
Docs/Knowledge/
├── README.md
├── CAPABILITY_INDEX.md
├── CAPABILITY_COVERAGE_REGISTER.md
└── Capabilities/
    └── <STABLE-CAPABILITY-ID>.md
```

Equivalent paths are allowed when the project documentation structure is
already established. The project README links the index.

The index is the fast decision surface. The coverage register is the complete
classification surface: every known decision-relevant native engine/editor
capability cluster, installed tool, package, reusable workflow, imported asset
family and owned inventory entry must appear there or
be covered by an explicitly named aggregate row. Detailed records are required
for every material capability and may remain shorter for low-value, unavailable
or explicitly irrelevant holdings. Completeness may not be claimed while a
known holding is absent, unclassified, represented only by a future placeholder
or hidden inside an uncited raw inventory.

## Coverage Contract

The project coverage register must:

1. declare the exact engine/version, manifests, roots, inventories and account
   snapshots that define its observed universe;
2. classify every observed item as locally present, owned but not local,
   project-owned, dependency, duplicate/subset, excluded, irrelevant or
   `UNKNOWN / REFRESH REQUIRED`;
3. link each material capability to a decision-ready record;
4. retain irrelevant and excluded holdings as concise rows so they are not
   rediscovered or accidentally proposed;
5. distinguish a complete local filesystem inventory from an incomplete or
   stale external account inventory;
6. expose outstanding refresh blockers and never describe partial coverage as
   complete; and
7. record the last verified date and the trigger that makes the coverage stale.

The coverage unit is a native capability cluster, product, package, asset
family, reusable workflow or other decision-relevant aggregate. It is not
every API method, menu command, prefab, texture or source file. A native
capability atlas may aggregate related built-in engine APIs, Editor windows,
official packages, modules and diagnostics while still exposing them through
problem-oriented routing. Exact API and file-level catalogues remain evidence
sources and are linked rather than duplicated.

## Required Capability Record

Each record contains, as applicable:

1. stable ID, type, owner and last verification date;
2. exact product/package/version and verified local paths;
3. intended uses, problem tags and unsuitable uses;
4. capability claims with evidence state and exact evidence link;
5. prerequisites, dependencies, licence or authority boundaries;
6. successful applications, including context and transfer limits;
7. failed applications, including failure class, root cause and what the
   failure does not prove;
8. known limitations, risks and technical-debt consequences;
9. current decision guidance: when this is likely the best option and when it
   is not;
10. alternatives and combinations worth considering;
11. unresolved questions and explicit refresh triggers; and
12. search tags.

Use qualitative effort and risk where exact numbers would create false
precision. Exact versions, hashes, paths, permissions and evidence identities
remain exact when they control reproducibility or safety.

## Capability-Awareness Gate

Before selecting an engine/editor capability, tool, asset, package, workflow
or bespoke implementation for a material problem, the Director or accountable
Worker must:

1. search the project capability index, coverage register, native-capability
   atlas where applicable and relevant asset inventory by the problem and
   intended use, not only by a remembered product name;
2. open only the materially relevant capability records and current evidence;
3. identify the strongest locally supported options, relevant prior successes,
   relevant scoped failures and important `UNKNOWN`s;
4. compare reuse, configuration, non-destructive adaptation, combination and
   bespoke implementation, including likely technical debt;
5. select the best proportionate option or record why a stronger-looking
   existing option does not fit; and
6. refresh one missing decision-critical fact through the smallest safe check
   instead of treating ordinary uncertainty or a banal tool hurdle as an
   insurmountable blocker.

This gate is a short shortlist, not an exhaustive audit. Stop expanding the
search when the available evidence is sufficient to make the current bounded
decision. Do not test every feature, package or variation without a
decision-changing reason.

## Work-Order Declaration

A Task-Delta Work Order that materially selects, replaces, adapts or rejects a
tool or asset records:

```text
Capability Knowledge Base query or NOT APPLICABLE:
Coverage register query:
Native engine/editor options considered:
Relevant capability record IDs:
Strongest existing options considered:
Prior success/failure evidence that changes this task:
Selected option and why:
Rejected existing options and bounded reason:
Decision-critical UNKNOWN / refresh action:
Expected technical debt or avoided technical debt:
```

`NOT APPLICABLE` is valid for work with no meaningful tool, asset or workflow
choice. It must not be used to bypass an obvious existing capability.

## Maintenance

Update the Knowledge Base when a task produces a durable, reusable change in
capability understanding. Examples include a newly installed version, a
representative success, a representative failure, a corrected root cause, a
new limitation, an adoption decision or a materially better alternative.

Update the coverage register whenever a tool, package, asset family or owned
inventory entry is added, removed, reclassified, excluded, adopted or found to
have been missing. A changed local package root or refreshed ownership snapshot
makes the affected coverage rows stale until reconciled.

Do not append raw chronology. Consolidate the current conclusion and link the
exact evidence. Task-specific coordinates, hashes and one-off details remain
in task evidence unless they define a reusable limit.

An incomplete or stale record is not automatically a blocker. Mark the stale
claim, verify the smallest decision-critical fact when authorised, and keep
unrelated work moving. A record must be refreshed after a relevant package,
engine, pipeline, project architecture or accepted-baseline change.

## Proportionality and Failure Scoping

- Prefer a visually adequate, robust existing option over unnecessary custom
  precision or reinvention.
- Prefer root-cause repair over hiding symptoms with another asset or layer.
- Operational setup failures remain separate from candidate, asset-family and
  visual failures.
- One failed preset, scene, topology or integration method does not reject
  untested variants.
- A visually failed method may remain technically useful for a different
  bounded purpose.
- Knowledge capture must save more future work than it costs. Short tasks need
  a short query and, at most, one concise record update.

## Validation

This standard enters live validation with the Crime99 Capability Knowledge
Base. Validation asks whether future planning surfaces a materially stronger
existing option before bespoke work begins and whether the added consultation
and maintenance cost remains proportionate.
