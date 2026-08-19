# Constitution of <Project Name>

This document outranks every other instruction in this repository. If anything conflicts with it, fix the thing — not the constitution.

## 1. Spec-driven

- No spec, no code. Every feature starts in `specs/<feature>/`: `requirements.md` + `openapi.yaml`.
- The spec is the source of truth. If the contract changes, update the spec first, then the code.
- Design decisions belong to the user — ask, never guess.

## 2. Test-first

- No production code without a failing test. Red → green, and the suite stays green.
- Every API endpoint has an integration test (real HTTP + zonky embedded PG).

## 3. RESTful APIs

- Every endpoint is RESTful and defined by its schema in `openapi.yaml` — no endpoint without a schema.

## 4. Build-enforced quality

- Coverage gate: ≥80% line / ≥70% branch (adjustable at init).
- Flyway migrations are the only schema mechanism; `ddl-auto` is `none`.
- No Docker — tests and development run on zonky embedded PG or H2.

## 5. Layering

- Controller → service → repository. Controllers hold no business logic; entities never appear in API payloads.

## 6. Code style

- Follow the project's conventions: clean, readable, conventional naming; no dead code, no TODO leftovers.

## 7. Done

- A feature is done when it matches the spec, its review passes, and the coverage gate is green.