---
name: star-task-split
description: Produces an implementation task plan (specs/<feature>/tasks.md) for a feature — dependency-ordered tasks with per-layer acceptance criteria (test cases), top-down (API-first) or bottom-up (persistence-first), derived from the requirements and the technical design. Use before implementing a feature.
---

# Task splitting for a feature

Turn the spec and design into an executable plan before any code. The plan is `specs/<feature>/tasks.md` — a working artifact (not part of the contract) that records the order of work and, for every task, the acceptance criteria: the test cases that prove the task done.

## Inputs

- `requirements.md` + `openapi.yaml` — the contract and the behavioral acceptance criteria (AC-00x).
- `design.md` — the architecture the tasks must realize (component/layer structure, decisions).

## Choose the direction

- **Top-down (default)** — start at the API boundary: write the feature's integration test against `openapi.yaml` first (the outer loop), then descend layer by layer — controller → service → repository/migration — each layer with its own red → green slice tests (inner loops). The integration test stays red until the last layer lands; it is the acceptance anchor.
  Use when the API shape and its flows are the risky part — most contract-first features.
- **Bottom-up** — start with migration + entity, then repository → service → controller, and write the integration test last as final verification.
  Use when the complexity lives in the data model (rich constraints, tricky queries) and the API is thin CRUD.

Record the choice with a one-line rationale in `tasks.md` and call it out in your reply so the user can override it.

## Task phases (both directions)

1. **Setup** — test infrastructure that must exist first: zonky + REST Assured dependencies, integration-test conventions. No ACs beyond "context boots".
2. **Foundational** — the Flyway migration for the feature's tables.
   AC: a `@DataJpaTest` against zonky boots with the migrated schema; columns, types, and constraints match the tables in `requirements.md`.
3. **Layer phases** — one phase per layer in the chosen direction. Every task carries ACs (table below).
4. **Polish** — full suite green, spec renders in the viewer, no TODO left in code.

## Acceptance criteria per layer

ACs are the test cases that prove a task done. There are two levels:

- **Spec ACs** (behavioral, user-decided) live in `requirements.md` — Given/When/Then outcomes.
- **Task ACs** (per-layer test cases) are derived from them: every spec AC must appear in at least one API/integration task AC; every table in `requirements.md` in a persistence task AC. Each task AC states the test class and what it asserts, and references the spec AC(s) and `openapi.yaml` operation it proves.

Tests are written before the implementation of the task they belong to.

| Layer | Test slice | AC example |
| ----- | ---------- | ---------- |
| API (integration anchor) | `@SpringBootTest(RANDOM_PORT)` + REST Assured + zonky | `POST /api/v1/orders` → 201 + `Location` header; unknown id → 404 with Error envelope; invalid body → 400 with `fields` |
| Controller | `@WebMvcTest` + MockMvc (service mocked) | GET returns status codes and payloads per `openapi.yaml`; validation annotations produce 400 |
| Service | plain JUnit (repository mocked) | `cancelOrder` flips status to CANCELLED; unknown id → `OrderNotFoundException` |
| Repository / entity | `@DataJpaTest` + zonky | derived query returns rows in spec order; unique constraint violation surfaces as the spec requires |

## Task entry format

```
### <Phase>: <layer>

- [ ] #<n> <verb phrase>
  AC: <test class + what it asserts> — refs: <spec AC / openapi.yaml operation / requirements.md section / design decision>
```

Order tasks by dependency; mark parallelizable entries with `[parallel]`.

## Rules

- Every AC traces to a spec or design statement; the spec never bends to the plan.
- One task per layer per endpoint group — not per file.
- If a task needs a design decision the spec doesn't answer, do not plan around it: the spec must be clarified first (`star-clarify`).
- If a task needs an architecture decision the design doesn't answer, do not plan around it: the design must be updated first (`/design`).
- Top-down tasks must not mock internal layers in the integration test — the outer loop is real end-to-end; mocks only at the external boundary.
- Keep `tasks.md` in the feature directory so reviewer and implementer share it.

## Definition of done

`specs/<feature>/tasks.md` exists: direction recorded with rationale, phases in dependency order, every task has ACs, every spec AC, every `openapi.yaml` operation, and every `requirements.md` table is covered by at least one task AC, and no undeclared design or architecture decision is hidden in the plan.
