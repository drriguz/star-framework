# star-framework

A GitHub Copilot template for delivering Spring Boot / RESTful + PostgreSQL services via **spec-driven development + TDD**.

Everything distributable lives in [`template/`](template/): Copilot agents, skills, slash commands, the spec conventions, and a browser-based spec viewer. Copy it into a consumer project (or the `~/.github/` + `~/.copilot/skills` home locations for personal reuse) and the workflow is available in Copilot Chat, VS Code, and Copilot CLI.

## The workflow

```
/specify   →  spec-writer writes specs/<feature>/ (spec.md + openapi.yaml: API contract + PG data model)
/clarify   →  targeted questions resolve design ambiguity; answers folded back into the spec
/tasks     →  implementation plan: specs/<feature>/tasks.md (top-down or bottom-up, per-layer acceptance criteria)
/implement →  implementer executes the tasks red → green, layer by layer
/review    →  reviewer diffs implementation vs spec, checks tests + plan coverage, runs suite, reports verdict
```

The spec is the contract between phases: it is written first, tests are written against its OpenAPI contract, and it is checked at the end. If a contract change is needed, update the spec before the code.

**Design decisions belong to the user.** The design phase never guesses: every design decision (endpoints, status codes, payloads, validation, data model, semantics, scope) is proposed as options and decided by the user; unresolved items stay in the spec's "Open questions". This follows the Spec Kit (spec-driven development) clarify discipline.

**Implementation is planned, then executed.** `tasks.md` orders the work with acceptance criteria per layer. Two directions: **top-down** (integration test against the contract first, then descend controller → service → repository) for API-driven features, or **bottom-up** (migration/repository first) when the data model is the complex part.

## Auto-loading in consumer projects

GitHub Copilot loads these automatically, so the constitution and specs are always in play:

- `template/AGENTS.md` — loaded by Copilot in every session; makes the constitution and `specs/` mandatory context, and lists the agents/skills/commands.
- `template/.github/copilot-instructions.md` — loaded by Copilot on github.com (PRs, code review).
- `template/.github/skills/` — auto-discovered; descriptions drive when each skill is pulled in.

Consumer projects adopt a **constitution** (`CONSTITUTION.md` — non-negotiable principles that outrank all instructions) via the `star-constitution` skill:

```
Use the star-constitution skill: init        → creates CONSTITUTION.md from the template
Use the star-constitution skill: inspect     → audits the constitution + repo compliance
```

## Template layout

| Path | What it is |
| ---- | ---------- |
| `template/AGENTS.md` | Consumer-project instructions; the auto-load mechanism (constitution + specs pinned) |
| `template/.github/copilot-instructions.md` | Same purpose for Copilot on github.com |
| `template/.github/agents/star-spec-writer.agent.md` | Owns the specify phase; never writes code |
| `template/.github/agents/star-implementer.agent.md` | TDD implementer; red → green per spec section |
| `template/.github/agents/star-reviewer.agent.md` | Compliance reviewer; verdict only, never fixes |
| `template/.github/skills/star-write-spec/` | Spec-writing procedure + quality checklist + `spec-template.md` + `openapi-template.yaml` |
| `template/.github/skills/star-clarify/` | Design ambiguity → targeted questions to the user; answers folded into the spec |
| `template/.github/skills/star-task-split/` | Implementation plan: `tasks.md`, top-down vs bottom-up, per-layer acceptance criteria |
| `template/.github/skills/star-tdd-cycle/` | Red-green procedure, test slices, test commands |
| `template/.github/skills/star-integration-test/` | Close-to-e2e tests: `@SpringBootTest` random port, zonky embedded PG, REST Assured, boundary-only mocks |
| `template/.github/skills/star-coverage/` | Coverage gate mechanics (JaCoCo, ≥80% line / ≥70% branch default) |
| `template/.github/skills/star-endpoint-scaffold/` | Controller/service/repository/DTO layering, validation, errors |
| `template/.github/skills/star-flyway-migration/` | Migration naming, immutability rules, `ddl-auto` off |
| `template/.github/skills/star-pg-schema/` | PG type/key/constraint/index conventions |
| `template/.github/skills/star-constitution/` | Initializes/audits `CONSTITUTION.md` + `constitution-template.md` |
| `template/.github/commands/specify.md` | `/specify` — new feature spec |
| `template/.github/commands/clarify.md` | `/clarify` — resolve design ambiguity in a spec |
| `template/.github/commands/tasks.md` | `/tasks` — implementation plan for a feature |
| `template/.github/commands/implement.md` | `/implement <feature>` — TDD implementation |
| `template/.github/commands/review.md` | `/review <feature>` — spec-compliance review |
| `template/specs/` | Feature specs, one directory per feature |
| `template/tools/serve.js` | Zero-dependency Node server for the spec viewer |
| `template/tools/api-viewer.html` | Swagger UI page that renders each feature's `openapi.yaml` |

## Viewing specs in the browser

```bash
node tools/serve.js      # from the consumer project root
# open http://localhost:8741/
```

Pick a feature from the dropdown — its OpenAPI contract renders as Swagger UI. `GET /api/specs` returns the machine-readable spec list.

## Install into a consumer project

```bash
cp -r template/. /path/to/consumer-project/        # then run "Use the star-constitution skill: init"
```

Personal reuse (all projects, current user):

```bash
cp -r template/.github/agents ~/.github/agents          # VS Code / Copilot Chat
cp -r template/.github/skills ~/.copilot/skills         # Copilot CLI skills
cp -r template/.github/commands ~/.github/commands      # VS Code / Copilot Chat
```

See [GitHub docs on custom agents](https://docs.github.com/en/copilot/reference/custom-agents-configuration), [skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills), and custom commands for the mechanics.

## Defaults enforced by the template

- Test-first, per spec section: red → green, feature by feature.
- Test slices: `@WebMvcTest` for REST, `@DataJpaTest` for persistence, `@SpringBootTest` + zonky embedded PG for integration; tests never require a live PG instance or Docker.
- Integration tests are close to e2e: random-port real HTTP, zonky embedded PostgreSQL, REST Assured for API validation, mocks only at the external boundary.
- The build enforces a coverage gate (JaCoCo, default ≥80% line / ≥70% branch), codified in the constitution template and `star-coverage`.
- Flyway migrations are the only schema mechanism (`spring.jpa.hibernate.ddl-auto: none`).
- Errors follow the RFC 7807-style envelope defined in each spec's OpenAPI document.
