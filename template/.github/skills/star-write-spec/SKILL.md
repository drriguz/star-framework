---
name: star-write-spec
description: Procedure for writing feature specs for spec-driven development of Spring Boot REST + PostgreSQL projects — prose in specs/<feature>/spec.md and the API contract as OpenAPI 3.1 in specs/<feature>/openapi.yaml. Use when creating or revising a feature specification.
---

# Writing a feature spec

A feature spec is the single source of truth for one feature. The implementer writes failing tests against it; the reviewer checks compliance against it. Its quality determines the quality of both.

## Output structure

One directory per feature:

```
specs/<feature>/
├── spec.md        — prose: overview, user stories, endpoints overview, data model, validation rules, error format, out of scope, open questions
└── openapi.yaml   — the API contract: paths, status codes, request/response schemas (canonical)
```

If `specs/` does not exist in the project, create it. Feature names are kebab-case.

## Templates (in this skill's directory)

- `spec-template.md` — copy to `specs/<feature>/spec.md`, fill every section.
- `openapi-template.yaml` — copy to `specs/<feature>/openapi.yaml`, fill every operation and schema. Must stay valid OpenAPI 3.1.

## Division of labor between the two files

- **`openapi.yaml` is the API contract** — methods, paths, parameters, status codes, request/response schemas. The implementer writes failing tests against it; the viewer (`.github/tools/api-viewer.html`) renders it in a browser.
- **`spec.md` holds the prose** — motivation, user stories, a short endpoints overview table (method, path, purpose — for human scanning only, detail lives in OpenAPI), the PG data model, validation rules, error format, out of scope, open questions.
- Do not duplicate contract detail (schemas, status codes) in `spec.md` — the OpenAPI document is the canonical source and duplication drifts.

## Rules

- **Design decisions belong to the user.** Every design decision — endpoint shape, status codes, payload fields, validation rules, data model, semantics, scope — must be decided by the user, never guessed by the writer. Use the `star-clarify` skill to ask; unresolved items stay in "Open questions".
- **Precise and testable.** Every operation in `openapi.yaml` must enumerate every status code it can return and give each a `description`. Payload schemas must name every field with its type and requiredness. No "or similar", no `TBD`.
- **What and why, not implementation.** No Spring, JPA, or framework concepts; no class names; no "controller", "repository", or "DTO". Say what the API does, not how it's built.
- **PG types when relevant.** In the data model, use PostgreSQL type names (`uuid`, `timestamptz`, `numeric(19,4)`, `jsonb`, `text`), not generic ones.
- **Contract completeness.** If an operation is not in `openapi.yaml`, it doesn't exist. Include the happy path and every error path you can foresee.
- **Explicit pagination.** List endpoints that return collections must define paging (`page`/`size` query parameters and a page envelope schema) in the OpenAPI document.
- **Versioned paths.** Prefer `/api/v1/...` unless the consumer project has a different established convention.
- **Reuse the error envelope.** Reference the shared `Error` component for all error responses instead of inventing per-endpoint shapes.

## Spec quality checklist (run before finishing)

Think of this as "unit tests for your requirements" — it checks the spec, not code. If any item fails, resolve it (via `star-clarify` when it needs a user decision) before the spec is considered done.

- Every user story maps to at least one operation in `openapi.yaml`, and every operation maps to a user story.
- Every operation states all status codes it can return, including every error path.
- Every payload field has a type, requiredness, and — where it matters — constraints; no `anyOf: [...]` placeholders.
- Lifecycle semantics are defined: what happens on delete, update conflicts, duplicate creation (409 vs 422), and references to deleted entities.
- Pagination, sorting, and filtering are defined for every collection endpoint (or explicitly out of scope).
- Auth is stated per operation (none / required / roles).
- The data model in `spec.md` is consistent with the payloads in `openapi.yaml` (same fields, same semantics).
- "Out of scope" says what the feature does **not** do.
- "Open questions" contains only items the user explicitly deferred — never silent assumptions.

## Validation

After writing, validate `openapi.yaml`:

- Opens cleanly in the spec viewer (start `node .github/tools/serve.js`, open the viewer, select the spec).
- No operation is missing `responses`; every non-2xx response references a component or has a concrete schema.
- Every `$ref` target exists in `components`.

## Definition of done

Both files exist and follow their templates, `openapi.yaml` is valid OpenAPI 3.1 and renders in the viewer, no placeholder `...` or `TBD` remains, the spec quality checklist passes, every design decision is traceable to a user answer (or an explicit "you decide"), and no implementation details leaked in.
