# Repository instructions

This project is built with the **star-framework** workflow: spec-driven development + TDD for Spring Boot / RESTful + PostgreSQL. Every agent working in this repository must follow this file and the documents it references. This is the single instructions file — loaded by Copilot in every session and on github.com (PRs, code review).

## Constitution (outranks everything)

`CONSTITUTION.md` at the project root defines the non-negotiable principles of this project.

- If it exists: read it at the start of every task and follow it. If anything in this file or any other instruction conflicts with it, the constitution wins.
- If it does not exist: tell the user and use the `star-constitution` skill to initialize it before starting feature work.

## Specs (read before touching any feature)

Feature specs live in `specs/<feature>/`:

- `spec.md` — prose: overview, user stories, PG data model, validation rules, error format, scope
- `openapi.yaml` — the **canonical API contract** (OpenAPI 3.1)

Rules:

- Before implementing, changing, or reviewing any feature, first read its spec directory. No spec → no code; ask the user to run `/specify` first.
- `openapi.yaml` is the source of truth for the API contract. Implementation must never drift from it; if the contract must change, update the spec first, then the code.
- Specs are viewable in the browser: run `node .github/tools/serve.js` and open `http://localhost:8741/`.

## Workflow

- `/specify` — turn a feature idea into `specs/<feature>/spec.md` + `openapi.yaml` (spec-writer agent)
- `/clarify` — resolve design ambiguity in a spec with targeted questions (spec-writer agent)
- `/tasks <feature>` — produce the implementation plan `specs/<feature>/tasks.md` (implementer agent)
- `/implement <feature>` — TDD implementation following tasks.md, red → green per task (implementer agent)
- `/review <feature>` — spec-compliance review, PASS/FAIL verdict (reviewer agent)

## Agents, skills, and commands available

- Agents: `star-spec-writer`, `star-implementer`, `star-reviewer` (in `.github/agents/`)
- Skills: `star-write-spec`, `star-clarify`, `star-task-split`, `star-tdd-cycle`, `star-integration-test`, `star-coverage`, `star-endpoint-scaffold`, `star-flyway-migration`, `star-pg-schema`, `star-constitution` (in `.github/skills/`)
- Commands: `/specify`, `/clarify`, `/tasks`, `/implement`, `/review` (in `.github/commands/`)

## Non-negotiables (detailed rules live in the skills)

- Test-first: no production code without a failing test; suite stays green.
- Implementation is planned before it starts: `specs/<feature>/tasks.md` (top-down or bottom-up, per-layer acceptance criteria).
- Design decisions belong to the user: when a spec is ambiguous, ask — never guess. Unresolved questions stay in the spec's "Open questions".
- The build enforces a coverage gate (default ≥80% line / ≥70% branch, JaCoCo); a feature is done only when the gate passes.
- Tests never require a live PostgreSQL instance or Docker (zonky embedded PostgreSQL or H2).
- Integration tests are close to e2e: `@SpringBootTest` random port + zonky + REST Assured; only the external boundary is mocked.
- Flyway migrations are the only schema mechanism; `ddl-auto` is `none`; applied migrations are immutable.
- Errors follow the RFC 7807-style envelope defined in each spec.
- Phases are gated: agents abort on hard-gate failures and suggest the next command (e.g. missing constitution → `star-constitution init`); soft gates require explicit user confirmation before proceeding.
