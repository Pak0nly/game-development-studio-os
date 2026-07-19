# Project Template

This document defines the standard high-level structure for game projects created under the Studio Operating System.

It is project-independent and should be used as the starting point for new game projects.

The purpose of this template is to create consistency, improve maintainability, support AI-assisted workflows, and reduce setup decisions that would otherwise be repeated for every project.

## Standard Project Structure

```text
Projects/
└── <ProjectName>/
    ├── README.md
    ├── Docs/
    ├── Source/
    ├── Assets/
    ├── Builds/
    ├── References/
    └── Tools/
```

The exact internal structure of these folders may vary depending on the engine, platform, genre, and project scope.

Engine-specific structures should be defined separately and should not replace this high-level project structure.

## README.md

The project README is the primary entry point for the project.

It should provide enough context for a Human Developer or AI Agent to understand the project without relying on previous conversations.

It should include:

* project name
* current project status
* short concept summary
* target platform
* selected engine and version
* current development phase
* important constraints
* authoritative project documents
* current known risks
* current next step

The README should remain concise and should link to detailed documents instead of duplicating their content.

## Docs

The `Docs/` folder contains project-specific documentation.

Typical contents may include:

* game vision
* game design documentation
* technical architecture
* feature specifications
* art direction
* asset requirements
* production planning
* testing documentation
* release documentation
* decision records
* project backlog
* project-specific visual QA, camera coverage, and occlusion standards
* project role profile and applicable review boards
* project art bible and level-design review standard
* asset candidate, provenance, and integration standards

Project documentation must not redefine project-independent Studio Operating System standards.

Projects with visible game content must link to the Studio OS [Visual Quality Assurance Workflow](Visual/Visual_Quality_Assurance_Workflow.md) from their README and may define stricter project-specific visual, camera, and occlusion rules in `Docs/`.

Projects must link their project role profile from the README when specialist review is used. The profile selects project-relevant roles and boards from the Studio OS [Role Operating Model](Roles/ROLE_OPERATING_MODEL.md); it must not redefine project-independent role authority or create implicit implementation permission.

When a project reveals a potentially reusable governance need, it should be added to the Governance Backlog instead of being silently treated as a new Studio Operating System rule.

## Source

The `Source/` folder contains the active game project and its implementation files.

Depending on the selected engine, this may contain:

* the engine project
* source code
* configuration files
* packages
* automated tests
* project-local scripts
* technical integration files

The internal structure of `Source/` should follow the standards and conventions of the selected engine and project architecture.

Generated files, caches, temporary files, and local machine-specific files should not be treated as authoritative source content.

## Assets

The `Assets/` folder contains source assets that are created, generated, purchased, licensed, or prepared for the project.

It may contain:

* visual source files
* audio source files
* models
* textures
* animations
* fonts
* user interface sources
* generated asset variants
* asset preparation files

The folder should distinguish between source assets and engine-imported or generated runtime files where practical.

Asset origin, licensing, approval status, and technical readiness should remain traceable when relevant.

## Builds

The `Builds/` folder contains playable or distributable project builds.

Builds should be separated from active source files.

Where useful, builds should be organized by:

* platform
* version
* development stage
* date
* release channel

Temporary test builds may be removed when they no longer provide value.

Important milestone and release builds should remain identifiable and reproducible where reasonably possible.

## References

The `References/` folder contains external material used for research, inspiration, comparison, or project direction.

It may contain:

* visual references
* gameplay references
* market references
* technical references
* competitor notes
* research material
* external documentation links

Reference material does not automatically define project requirements or approved direction.

External material should be understood and adapted rather than copied blindly.

## Tools

The `Tools/` folder contains project-specific utilities that support development but are not part of the game runtime itself.

It may contain:

* import tools
* conversion tools
* validation scripts
* build tools
* asset-processing tools
* local automation
* project-specific AI workflow support

Reusable tools that provide value across multiple projects should be evaluated for extraction into a shared Studio Operating System tool location.

## Project Creation Rules

A new project should only be created when its purpose, scope, and relationship to existing projects are sufficiently clear.

The initial project structure should remain minimal.

Folders, documents, systems, and tools should only be added when they solve a current or foreseeable project need.

A project should not inherit unnecessary complexity from previous projects.

Reusable standards should be shared through the Studio Operating System, while project-specific decisions should remain inside the project.

## Visual Work Assignment Template

Every project template or work-order pattern for visible content must include the required work-assignment block from the [Visual Quality Assurance Workflow](Visual/Visual_Quality_Assurance_Workflow.md). It must require blind visual review, a camera-coverage matrix, continuous occlusion-path review, hard-fail checks, up to two bounded internal correction rounds, matched Before/After evidence, and an explicit Human approval boundary.

The project README must identify the applicable project-local standards and the current internal visual status. A technical pass must never be presented as visual acceptance.

## Role and Review Work Assignment Template

Every larger, higher-risk, or cross-domain work order must include the [Work Order Role and Review Block](Templates/WORK_ORDER_ROLE_AND_REVIEW_BLOCK.md). It must name the accountable builder, activate only necessary roles, state role-specific review questions and evidence, identify the applicable board, limit correction rounds, and preserve the Human decision boundary.

Project-local examples may specialize the block but may not weaken the [Role Operating Model](Roles/ROLE_OPERATING_MODEL.md), [Role Review Output Schema](Roles/ROLE_REVIEW_OUTPUT_SCHEMA.md), [Review Board Protocol](Roles/REVIEW_BOARD_PROTOCOL.md), or any domain Source of Truth.

## Project Independence

Each project should be understandable and maintainable without depending on undocumented context from another project.

Projects may reuse approved systems, workflows, tools, and standards, but should not rely on hidden cross-project dependencies.

Changes made for one project should not automatically alter shared Studio Operating System standards.

Reusable improvements should pass through the Governance Lifecycle before becoming project-independent standards.
