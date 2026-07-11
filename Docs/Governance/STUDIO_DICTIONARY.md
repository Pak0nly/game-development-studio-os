# Studio Dictionary

This document defines the shared terminology used throughout the Studio Operating System.

Every defined term must have exactly one authoritative definition. All other documents should reference these definitions instead of redefining them.

The goal is to establish a consistent language for humans and AI agents, reducing ambiguity and improving communication across all projects.

## Studio Operating System (Studio OS)

A reusable governance framework that defines how humans and AI collaborate to design, develop, maintain, and improve games.

It establishes shared principles, decision-making processes, engineering standards, quality expectations, communication models, and governance rules that remain independent of any individual project.

## Human Developer

The person who owns the creative vision, design direction, product direction, business decisions, and final responsibility for the project.

The Human Developer may delegate implementation, analysis, documentation, testing, asset production, and review tasks to AI agents, but remains accountable for final decisions.

## AI Agent

An AI system that assists with analysis, implementation, documentation, testing, asset production, review, planning, or decision support within the Studio Operating System.

An AI Agent may recommend, challenge, implement, or review work according to the rules of the Studio Operating System, but does not own the creative vision, product direction, or business responsibility of a project.

## Governed Autonomy

The principle that AI agents may work autonomously only within clear, accountable, and risk-aware rules.

Autonomy is not granted through trust alone. It is earned through defined responsibilities, boundaries, review expectations, escalation rules, and documentation standards.

## Source of Truth

The authoritative location for a specific type of information.

When a document is the Source of Truth for a topic, other documents should reference it instead of redefining the same information elsewhere.

## Governance Lifecycle

The process by which governance ideas move from initial discussion to official adoption, validation, audit, and continuous improvement within the Studio Operating System.

The Governance Lifecycle exists to prevent premature rules, reduce governance debt, avoid conflicting standards, and ensure that adopted standards provide long-term value.

## Governance Idea

A proposal that may have long-term impact on how the Studio Operating System works.

A Governance Idea is not an adopted rule. It is an early-stage concept that must be clarified, discussed, and evaluated before it can become part of the Studio Operating System.

Governance Ideas should be project-independent and should usually affect recurring workflows, AI behavior, decision-making, risk management, quality standards, collaboration, security, maintainability, or operational efficiency.

## Governance Backlog

The holding area for governance ideas, engineering principles, roles, processes, and open questions that may be valuable but are not yet adopted standards.

Items in the Governance Backlog are proposals, not active rules.

## Governance Backlog Item

A recorded proposal in the Governance Backlog.

A Governance Backlog Item should contain enough context to be understood later without relying on memory from the original discussion.

## Adopted Standard

A rule, principle, definition, process, workflow, or expectation that has passed through the Governance Lifecycle and has become an official part of the Studio Operating System.

Adopted Standards should be followed unless they are later changed through the Governance Lifecycle.

## Governance Rule

A durable rule that governs behavior, decisions, responsibilities, or processes within the Studio Operating System.

A Governance Rule should be project-independent and clear enough to guide future decisions consistently.

## Project Principle

A long-term principle that guides how the AI-assisted development environment should operate across projects.

Project Principles define broad direction and expectations, but should not contain detailed process rules unless necessary.

## AI Development Rule

A rule that defines how AI agents are expected to participate in the development process.

AI Development Rules may cover responsibilities, limitations, communication style, code generation, testing, debugging, documentation, security, and continuous improvement.

## Engineering Principle

A durable development principle that describes how software, tools, pipelines, assets, or technical systems should be designed, implemented, maintained, or reviewed.

Engineering Principles should support maintainability, clarity, security, performance, reliability, and long-term reuse.

## Project Preference

A preference that belongs to a specific game, prototype, feature, art direction, genre, or product context.

Project Preferences should not become part of the Studio Operating System unless they provide reusable value across projects.

## Governance Debt

A missing, incomplete, outdated, unclear, or insufficient governance element that creates risk for the Studio Operating System.

Governance Debt may include missing rules, unclear ownership, unresolved recurring problems, undocumented exceptions, security gaps, or incomplete standards.

## Governance Conflict

A situation where two or more rules, principles, definitions, standards, or expectations contradict each other.

Governance Conflicts should be resolved to preserve clarity and prevent inconsistent decisions.

## Governance Redundancy

A situation where the same rule, definition, or expectation exists in multiple places unnecessarily.

Governance Redundancy increases the risk of future inconsistency and should be avoided by keeping each authoritative definition in its correct Source of Truth.

## Governance Drift

A situation where documented governance and actual practice diverge over time.

Governance Drift may occur when rules are ignored, outdated, bypassed, inconsistently applied, or no longer reflect how work is actually performed.

## Governance Audit

A structured review of the Studio Operating System to identify governance debt, governance drift, conflicts, redundancies, outdated standards, missing rules, security gaps, maintainability risks, or unnecessary operational cost.

A Governance Audit should identify issues. It should not automatically create new rules without passing findings through the Governance Lifecycle.

## Operational Cost

The effort, time, token usage, compute, review burden, maintenance overhead, cognitive load, or process complexity created by a rule, workflow, tool, role, or AI behavior.

Operational Cost must be justified by the value it provides.

## Long-term Value

The durable benefit a rule, process, tool, workflow, or decision provides across time and potentially across multiple projects.

Long-term Value may come from improved clarity, maintainability, quality, security, collaboration, reusability, efficiency, or risk reduction.

## Security by Design

The principle that security must be considered from the beginning of a system, workflow, feature, architecture, or process.

Security should not be treated as a final development step or a cosmetic review after implementation.

## Root Cause

The underlying cause of a problem, rather than only its visible symptom.

Solving root causes is preferred over temporary workarounds when reasonably practical.

## Workaround

A temporary or limited solution that addresses a symptom without fully solving the underlying root cause.

Workarounds are acceptable only when clearly documented, justified, and tracked for later review or proper resolution.

## No Hidden Magic

The principle that systems should behave predictably and remain understandable.

Implicit behavior, unnecessary abstractions, unexplained automation, and hidden dependencies should be avoided.

## Evidence-based Engineering

The principle that technical and process decisions should prefer established best practices, mature ecosystems, community-proven solutions, maintainability, security, and clear reasoning.

Innovation is acceptable when it provides a justified advantage. Unjustified experimentation should not become the default.

## Clarify Before Codify

The principle that ideas should be understood, discussed, and evaluated before they become permanent rules, standards, or processes.

Clarify Before Codify helps prevent premature rules, governance debt, unnecessary complexity, and poorly understood standards.
