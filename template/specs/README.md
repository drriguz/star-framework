# specs/

One directory per feature, named `specs/<feature>/` (kebab-case). A spec is the single source of truth for its feature:

```
specs/<feature>/
├── spec.md        — prose: overview, user stories, endpoints overview, PG data model, validation rules, error format, out of scope, open questions
└── openapi.yaml   — the API contract (canonical): paths, status codes, request/response schemas — OpenAPI 3.1
```

The implementer writes failing tests against `openapi.yaml`; the reviewer verifies compliance against both files. `/tasks` produces `tasks.md` in the same directory — the implementation plan with per-layer acceptance criteria (a working artifact, not part of the contract).

## Workflow

- `/specify` creates a new spec (uses the `star-spec-writer` agent and the `star-write-spec` skill, whose directory contains `spec-template.md` and `openapi-template.yaml`).
- `/clarify` resolves design ambiguity: targeted questions to the user, answers folded back into the spec (see the `star-clarify` skill).
- Design decisions belong to the user — the "Open questions" section holds only what the user explicitly deferred.

## Viewing a spec

```bash
node tools/serve.js      # from the project root, then open http://localhost:8741/
```

The viewer renders each feature's `openapi.yaml` with Swagger UI, with a dropdown to switch features.

## Rules

- `openapi.yaml` is the source of truth for the API contract — implementation must not drift from it; update the spec before code if the contract changes.
- Write about behavior, not implementation: no Spring annotations, no class names, no framework details.
- Status codes and schemas must be complete and exact — the spec must be directly testable.
