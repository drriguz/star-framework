# AGENTS.md

This repo is the **star-framework**: a GitHub Copilot template for delivering Spring Boot / RESTful + PostgreSQL projects via **spec-driven development + TDD**. It is framework-only — no application code, no build system. Everything distributable lives in `template/`; consumers copy it into their projects (or the `~/.github/` + `~/.copilot/skills` home locations).

This file governs agents working **on this repo** (authoring/maintaining the framework). It is NOT part of the template — the template ships its own `AGENTS.md` for consumer projects.

## Layout

- `template/` — the distributable unit. Copy its contents into a consumer project root.
  - `template/.github/copilot-instructions.md` — the **single consumer instructions file**; **the auto-load mechanism**: loaded by Copilot in every session and on github.com (PRs, code review), it pins the constitution + specs as mandatory context. Never ship repo-relative paths from it.
  - `template/.github/agents/*.agent.md` — Copilot agents. Frontmatter: `description` (required), `tools` (aliases only: `read`, `edit`, `search`, `execute`, `agent`, `web`, `skill` — always include `skill` or agents lose access to skills). Agent name = filename minus `.agent.md`; commands reference it via `agent:` frontmatter.
  - `template/.github/skills/<name>/SKILL.md` — skills as **directories** (never loose files): lowercase-hyphen dir name, frontmatter `name` + `description` (description drives auto-triggering), optional `allowed-tools`. Files in the dir (templates, scripts) are discovered alongside the skill. `star-constitution` also ships `constitution-template.md` — the baseline the init/inspect procedures work from. `star-clarify` codifies the "design decisions belong to the user" discipline (Spec Kit pattern).
  - `template/.github/commands/*.md` — slash commands; frontmatter `description` + `agent`; filename = command name (`specify.md` → `/specify`).
  - `template/.github/tools/` — spec viewer: `serve.js` (zero-dependency Node static server, run from the consumer project root) + `api-viewer.html` (Swagger UI page).
  - `template/specs/` — feature-spec home for consumer projects: `spec.md` (prose) + `openapi.yaml` (canonical API contract, OpenAPI 3.1), one directory per feature.
- `CONSTITUTION.md` — never exists in this repo; consumers adopt it via the `star-constitution` skill (init creates it, inspect audits it). The template in `template/.github/skills/star-constitution/` is the single source of truth — do not duplicate it.

## Key invariants

- All agent/skill/command/template files must work after being copied into a consumer project or `~/.github/` — no repo-relative paths, no assumptions beyond standard Maven/Gradle Spring Boot conventions. The `star-` prefix prevents collisions in shared `~/.github/`.
- When editing any agent/skill/command, keep frontmatter minimal (omit defaults) and the body actionable: procedure, rules, definition of done.
- Any change to the workflow must stay consistent across the layers that teach it: `template/.github/copilot-instructions.md`, the agents, and the skills.
- Specs must be viewable: from a consumer project root, `node .github/tools/serve.js` then `http://localhost:8741/`.

## Core workflow the template delivers (spec-driven + TDD)

1. `/specify` → spec-writer writes `specs/<feature>/spec.md` + `openapi.yaml` (API contract: paths, status codes, schemas; PG data model in `spec.md`). Design decisions are never guessed — `/clarify` resolves ambiguity with the user (Spec Kit pattern).
2. `/tasks` → implementer produces `specs/<feature>/tasks.md`: dependency-ordered tasks with per-layer acceptance criteria, top-down (integration test first) or bottom-up (persistence first).
3. `/implement <feature>` → implementer executes tasks in order, red → green per task (`@WebMvcTest` for REST, `@DataJpaTest` for persistence, `@SpringBootTest` + zonky integration).
4. `/review <feature>` → reviewer diffs implementation vs spec (contract drift, schema drift, test quality, plan coverage), runs the suite, reports PASS/FAIL.
5. Target stack defaults: Spring Boot (controllers, service/repository layering), PostgreSQL, Flyway migrations for schema.

## Conventions

- Never skip the test-first step: red → green, feature by feature, spec section by section.
- Design decisions belong to the user: when a spec is ambiguous, agents must ask (via `star-clarify`), never guess.
- Coverage is a build-enforced gate (JaCoCo, default ≥80% line / ≥70% branch): policy lives in the constitution template (clause 3), mechanics in `star-coverage`.
- Phases are gated in every agent prompt: hard gates abort with the next suggested command (missing constitution/spec, pending design decisions, red baseline), soft gates require explicit user confirmation.
- `openapi.yaml` is the source of truth for the API contract — implementation must not drift from it; update spec before code if the contract changes.
- Tests must not require a live PG instance or Docker (zonky embedded PostgreSQL or H2 in tests); migrations via Flyway are the only schema mechanism.
- Integration tests are close to e2e: `@SpringBootTest` random port, zonky embedded PG, REST Assured, mocks only at the external boundary — as codified in `star-integration-test`.
