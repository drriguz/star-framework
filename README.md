# star-framework

A GitHub Copilot template for delivering Spring Boot / RESTful + PostgreSQL services via **spec-driven development + TDD**.

Everything distributable lives in `template/.github/`: agents, skills, slash commands, instructions, and the spec viewer. Copy that one folder into a consumer project (or the `~/.github/` + `~/.copilot/skills` home locations for personal reuse) and the workflow is available in Copilot Chat, VS Code, and Copilot CLI.

## How the workflow works

```
/specify   →  spec-writer writes specs/<feature>/ (requirements.md + openapi.yaml: stories, ACs, API contract, PG data model)
/clarify   →  targeted questions resolve design ambiguity + acceptance criteria; answers folded back into the spec
/design    →  designer writes specs/<feature>/design.md (architecture, layering, key decisions)
/tasks     →  implementation plan: specs/<feature>/tasks.md (top-down or bottom-up, per-layer acceptance criteria)
/implement →  implementer executes the tasks red → green, layer by layer
/review    →  reviewer diffs implementation vs spec + design, checks tests + plan coverage, runs suite, reports verdict
```

- **Spec is the contract between phases.** Tests are written against `openapi.yaml`; the review checks against it; acceptance criteria live in `requirements.md`. If the contract changes, update the spec first — never the code first.
- **Design decisions belong to the user.** The spec and design phases never guess: every design decision is proposed as options and decided by you; unresolved items stay in the spec's "Open questions" / design's "Open design decisions".
- **Phases are gated.** Hard-gate failures abort with the next command (missing constitution → `star-constitution init`; missing spec → `/specify`; missing design → `/design`; pending design questions → `/clarify`; red baseline → fix first). Soft gates pause for your confirmation (e.g. the `tasks.md` plan).
- **SDD + TDD on every feature.** The spec (SDD) pins *what* to build; `design.md` pins *how*; `tasks.md` pins *how the work is ordered* with acceptance criteria (test cases) per layer; implementation is strictly red → green.

## Usage scenarios

### 1. New project

```bash
cp -r template/. my-service/            # one folder: .github/, specs/
cd my-service
```

1. **Init the constitution** — "Use the star-constitution skill: init" (creates `CONSTITUTION.md`, the non-negotiable principles).
2. The framework is active: `.github/` is auto-discovered by Copilot and the instructions are auto-loaded in every session.
3. Scaffold the Spring Boot project (any starter — the framework assumes standard Maven/Gradle layout).
4. Add test dependencies (zonky embedded PG, REST Assured) when the first feature needs them — the implementer adds them via `star-integration-test`.
5. From here, every feature follows scenario 3.

### 2. Existing project (adopt the framework)

```bash
cp -r template/.github/ my-service/.github/    # everything in one folder
mkdir -p my-service/specs
```

1. **Init the constitution** — "Use the star-constitution skill: init".
2. **Audit the current state** — "Use the star-constitution skill: inspect". It checks completeness plus compliance spot-checks (`ddl-auto` off, migrations dir, coverage gate present, no live-DB tests). Fix the violations it reports.
3. Existing code stays untouched otherwise; the workflow applies to new work.
4. From here, new features follow scenario 3; changes to existing features follow scenario 4.

### 3. New feature (the full SDD + TDD loop)

1. **`/specify <feature>`** — describes what you want; the spec-writer asks design questions (endpoints, status codes, payloads, acceptance criteria, data model) and writes `specs/<feature>/requirements.md` + `openapi.yaml`. If ambiguity remains, run **`/clarify`** (or reply to the questions inline).
2. **Review the spec** — `node .github/tools/serve.js`, open `http://localhost:8741/`: the OpenAPI contract renders as Swagger UI. This is your approval checkpoint — the spec is now the source of truth.
3. **`/design <feature>`** — the designer proposes the architecture (components, layering, key decisions) and writes `design.md`; you confirm the key decisions.
4. **`/tasks <feature>`** — the implementer produces `tasks.md` (dependency-ordered, acceptance criteria per layer derived from the spec's ACs, top-down or bottom-up). Confirm the direction.
5. **`/implement <feature>`** — executes the tasks: AC tests first (red), minimal code (green), layer by layer; integration tests are close-to-e2e (real HTTP + zonky PG + REST Assured, mocks only at the external boundary); ends with the coverage gate (`./mvnw verify`).
6. **`/review <feature>`** — the reviewer diffs implementation vs spec and design, checks tests and plan coverage, runs the suite, reports **PASS/FAIL**.
7. **Done** when review passes and the coverage gate is green.

### 4. Working on an existing feature

1. **Contract or behavior change?** (new field, new status code, changed AC, changed behavior) — run **`/specify <feature>`** to update the spec **first**. Run **`/clarify`** if the change raises design questions. Re-run **`/design`** if architecture must change. The spec is updated before any code.
2. **No contract change** (bug fix, refactor) — run **`/implement <feature>`** directly with a description of the fix; the implementer re-plans (`/tasks` if the plan is stale), writes the failing test, fixes red → green.
3. Re-run **`/review <feature>`** when done. Gates apply throughout: if the baseline suite is red, the implementer aborts and asks you to fix it first.

## Auto-loading in consumer projects

- `.github/copilot-instructions.md` — the single instructions file, loaded in every session and on github.com (PRs, code review); pins the constitution + specs as mandatory context.
- `.github/skills/` — auto-discovered; descriptions drive when each skill is pulled in.
- `.github/agents/` + `.github/commands/` — the personas and the `/specify /clarify /design /tasks /implement /review` entry points.

Consumer projects adopt a **constitution** (`CONSTITUTION.md` — non-negotiable principles that outrank all instructions) via the `star-constitution` skill:

```
Use the star-constitution skill: init        → creates CONSTITUTION.md from the template
Use the star-constitution skill: inspect     → audits the constitution + repo compliance
```

## Template layout

| Path | What it is |
| ---- | ---------- |
| `template/.github/copilot-instructions.md` | Single consumer instructions file; the auto-load mechanism |
| `template/.github/agents/star-spec-writer.agent.md` | Owns the specify phase; writes requirements + acceptance criteria + contract; never writes code |
| `template/.github/agents/star-designer.agent.md` | Owns the design phase; writes `design.md`; never writes code |
| `template/.github/agents/star-implementer.agent.md` | TDD implementer; red → green per task, per layer |
| `template/.github/agents/star-reviewer.agent.md` | Compliance reviewer; verdict only, never fixes |
| `template/.github/skills/star-write-spec/` | Spec-writing procedure + quality checklist + `requirements-template.md` + `openapi-template.yaml` |
| `template/.github/skills/star-clarify/` | Design ambiguity + acceptance criteria → targeted questions to the user; answers folded into the spec |
| `template/.github/skills/star-write-design/` | Technical design procedure + `design-template.md` |
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
| `template/.github/commands/design.md` | `/design` — technical design for a feature |
| `template/.github/commands/tasks.md` | `/tasks` — implementation plan for a feature |
| `template/.github/commands/implement.md` | `/implement <feature>` — TDD implementation |
| `template/.github/commands/review.md` | `/review <feature>` — spec-compliance review |
| `template/.github/tools/serve.js` | Zero-dependency Node server for the spec viewer |
| `template/.github/tools/api-viewer.html` | Swagger UI page that renders each feature's `openapi.yaml` |
| `template/specs/` | Feature specs home (copied as the seed directory) |

## Viewing specs in the browser

```bash
node .github/tools/serve.js      # from the consumer project root
# open http://localhost:8741/
```

Pick a feature from the dropdown — its OpenAPI contract renders as Swagger UI. `GET /api/specs` returns the machine-readable spec list.

## Install into a consumer project

```bash
cp -r template/.github/ /path/to/consumer-project/.github/    # everything in one folder
cp -r template/specs /path/to/consumer-project/               # spec home
# then: "Use the star-constitution skill: init"
```

Personal reuse (all projects, current user):

```bash
cp -r template/.github/agents ~/.github/agents          # VS Code / Copilot Chat
cp -r template/.github/skills ~/.copilot/skills         # Copilot CLI skills
cp -r template/.github/commands ~/.github/commands      # VS Code / Copilot Chat
cp -r template/.github/tools ~/.github/tools            # spec viewer
```

See [GitHub docs on custom agents](https://docs.github.com/en/copilot/reference/custom-agents-configuration), [skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills), and custom commands for the mechanics.

## Defaults enforced by the template

- Test-first, per spec section: red → green, feature by feature.
- Test slices: `@WebMvcTest` for REST, `@DataJpaTest` for persistence, `@SpringBootTest` + zonky embedded PG for integration; tests never require a live PG instance or Docker.
- Integration tests are close to e2e: random-port real HTTP, zonky embedded PostgreSQL, REST Assured for API validation, mocks only at the external boundary.
- The build enforces a coverage gate (JaCoCo, default ≥80% line / ≥70% branch), codified in the constitution template and `star-coverage`.
- Flyway migrations are the only schema mechanism (`spring.jpa.hibernate.ddl-auto: none`).
- Errors follow the RFC 7807-style envelope defined in each spec's OpenAPI document.
