# Constitution of <Project Name>

This document is the foundation of how this project is built. It outranks
every other instruction in this repository. If anything in the repository
conflicts with it, the conflict is a violation — fix the thing, not the
constitution.

## 1. Spec-driven development

- Every feature begins with a spec in `specs/<feature>/`. No spec, no code.
- The spec is the single source of truth: `openapi.yaml` defines the API
  contract; `spec.md` defines the data model, validation rules, and scope.
- If the contract must change, update the spec first, then the code. Never
  the other way around.
- Design decisions belong to the user: when the spec is ambiguous or a
  design decision is needed, ask the user — never guess. Unresolved
  questions stay in the spec's "Open questions", not in assumptions.

## 2. Test-first (TDD)

- No production code without a failing test that expresses the spec.
- Work red → green, spec section by spec section. The suite stays green at
  every step.

## 3. PostgreSQL fidelity

- Tests never require a live PostgreSQL instance or Docker (zonky embedded PostgreSQL or H2).
- Tests exercise the migrated schema, not a hand-rolled one.

## 4. Schema via migrations only

- Flyway migrations are the only schema mechanism. `ddl-auto` is `none` in
  every environment.
- Applied migrations are immutable: a schema change ships as a new
  migration, never as an edit to an applied one.

## 5. Layering

- Controller → service → repository. Controllers hold no business logic;
  entities never appear in API payloads; payloads are DTO records that
  mirror the spec's schemas.

## 6. API quality

- All error responses use the RFC 7807-style envelope defined in the spec.
- Methods, paths, status codes, and payloads match `openapi.yaml` exactly.

## 7. Verification before done

- A feature is done when its spec sections are implemented and a review
  against the spec passes.

## 8. No framework leakage into specs

- Specs describe behavior, not implementation: no Spring, no JPA, no class
  names, no annotations.
