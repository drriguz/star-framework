---
name: star-write-design
description: Procedure for writing the technical design (specs/<feature>/design.md) of a feature — architecture, layering, data flow, key decisions, NFRs — for Spring Boot REST + PostgreSQL projects. Use when a feature spec exists and the architecture needs to be decided before task planning.
---

# Writing a technical design

The design sits between the spec (what) and the tasks (when/where). It records the *how*: the architecture decisions that the spec leaves open. The spec is the contract — the design must not change it.

## Output

`specs/<feature>/design.md` — written from `design-template.md` in this skill's directory.

## Division of labor

- **The spec (`requirements.md` + `openapi.yaml`) is the contract** — API contract, data model, validation, acceptance criteria. The design never changes it.
- **`design.md` holds the architecture** — component breakdown, data flow, layering, key decisions, non-functional concerns.
- **`tasks.md` is planned from the spec + design** — implementation order with per-layer test-case ACs.

## What belongs in design vs spec

| Spec (user-decided, via `star-clarify`) | Design (architecture) |
| --------------------------------------- | --------------------- |
| API contract: endpoints, status codes, payloads | Component breakdown, layering, modules |
| Data model: entities, relationships, constraints | Transaction boundaries, concurrency, caching, idempotency, error mapping |
| Acceptance criteria (behavioral) | Data flow / sequences, physical schema choices, NFRs |

## Procedure

1. Read `specs/<feature>/requirements.md` and `openapi.yaml`.
2. List the architectural areas the spec leaves open. For each, decide: does it change observable behavior or the data contract? If yes → it belongs in the spec, ask via `star-clarify`; if no → design decision, propose options with a recommendation and ask the user (same question format as `star-clarify`, at most 5 per round).
3. Framework defaults (controller/service/repository layering, Flyway-only schema, zonky test slices, RFC 7807 errors) need a one-line note, not a decision.
4. Write `design.md` from the template. Encode every answer; keep deferred items in "Open design decisions".

## Quality checklist (run before finishing)

- The design is consistent with the spec — no contract or data-model drift introduced.
- Every architectural decision is traceable to a user answer or an explicit framework default.
- No implementation written: no code, no file lists, no framework APIs beyond naming layers.
- No `TBD` or `...` placeholders.

## Definition of done

`specs/<feature>/design.md` exists and follows the template, is consistent with the spec, and every decision is traceable. No code or spec file was touched.