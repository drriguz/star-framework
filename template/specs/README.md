# specs/

One directory per feature, named `specs/<feature>/` (kebab-case). A spec is the single source of truth for its feature:

```
specs/<feature>/
├── requirements.md  — prose: overview, user stories, acceptance criteria, PG data model, validation rules, error format, out of scope, open questions
├── openapi.yaml     — the API contract (canonical): paths, status codes, request/response schemas — OpenAPI 3.1
├── design.md        — the architecture: components, layering, data flow, key decisions, NFRs
└── tasks.md         — the implementation plan with per-layer acceptance criteria (working artifact, not part of the contract)
```

The implementer writes failing tests against `openapi.yaml`; the reviewer verifies compliance against `requirements.md` + `openapi.yaml` + `design.md`.

## Workflow

- `/specify` creates a new spec (uses the `star-spec-writer` agent and the `star-write-spec` skill, whose directory contains `requirements-template.md` and `openapi-template.yaml`).
- `/clarify` resolves design ambiguity and acceptance criteria: targeted questions to the user, answers folded back into the spec (see the `star-clarify` skill).
- `/design` produces `design.md` (uses the `star-designer` agent and the `star-write-design` skill).
- `/tasks` produces `tasks.md` — the dependency-ordered plan with per-layer acceptance criteria (see the `star-task-split` skill).
- Design decisions belong to the user — the "Open questions" section holds only what the user explicitly deferred.

## Viewing a spec

```bash
node .github/tools/serve.js      # from the project root, then open http://localhost:8741/
```

The viewer renders each feature's `openapi.yaml` with Swagger UI, with a dropdown to switch features.

## Rules

- `openapi.yaml` is the source of truth for the API contract — implementation must not drift from it; update the spec before code if the contract changes.
- Write about behavior, not implementation: no Spring annotations, no class names, no framework details.
- Status codes and schemas must be complete and exact — the spec must be directly testable.
- Every user story has numbered acceptance criteria (Given/When/Then) that map to operations in `openapi.yaml`.