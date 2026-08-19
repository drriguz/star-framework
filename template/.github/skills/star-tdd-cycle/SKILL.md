---
name: star-tdd-cycle
description: The red-green TDD procedure for Spring Boot projects — failing tests first, minimal implementation, per spec section. Use whenever implementing or reviewing a feature spec test-first.
---

# TDD cycle for Spring Boot

Deliver spec sections one at a time, each as a full red → green cycle. Never batch tests and implementation for multiple sections.

## Plan before you code

Before the first test, produce the implementation plan with the `star-task-split` skill (`specs/<feature>/tasks.md`): dependency-ordered tasks, each with acceptance criteria (test cases) per layer. Default direction is **bottom-up** (migration + entity → repository → service → controller → integration test last), one completed task before the next; top-down (integration test first) is available if the user prefers. The direction is recorded in `tasks.md`.

## Test strategy per layer

| What you're testing | Slice | Notes |
| ------------------- | ----- | ----- |
| REST endpoint behavior (status codes, payloads, validation) | `@WebMvcTest` + MockMvc | Mock service layer with `@MockitoBean` (Boot 3.4+) / `@MockBean` |
| Repository / query behavior | `@DataJpaTest` | Embedded PG via zonky: `@AutoConfigureEmbeddedDatabase(provider = ZONKY)` |
| Cross-layer flows | `@SpringBootTest` + zonky embedded PG | See `star-integration-test` for the close-to-e2e variant |
| Pure business logic | plain JUnit 5 | No Spring context |

## Red

1. Write a test that asserts the spec's contract for the current section (exact status code, exact payload fields, error cases).
2. Verify **by inspection** that it compiles (valid syntax, correct imports/types) so the red is a missing-behavior failure, not a typo. **Never run the build yourself.**
3. Stop immediately. Hand the user the exact command; the user runs it manually and confirms it **fails for the right reason** — the endpoint/class doesn't exist or behavior is missing. Wait for explicit approval before implementing.

```bash
./mvnw test -Dtest=OrderControllerTest   # Maven: single test class
./gradlew test --tests OrderControllerTest  # Gradle: single test class
```

4. After the task is green and approved, tick its checkbox in `tasks.md` (`- [x] #<n>`) and stop; the next task starts only on explicit "continue". On a restart, resume from the first unchecked task.

## Green

1. Implement the **minimal** code that passes — no speculative extras.
2. For schema changes: write the Flyway migration (see `star-flyway-migration`) **before** the code that reads/writes the new column or table.
3. Do **not** run the build. Hand the same single-test command back and ask the user to run it and confirm green; then hand the full gate command:

```bash
./mvnw test -Dtest=OrderControllerTest   # confirm this task's test
./mvnw verify                           # Maven: full suite + jacoco coverage gate
./gradlew check                         # Gradle: full suite + jacocoTestCoverageVerification
```

4. If the user reports the gate failing, read the coverage report, add tests for the uncovered branches — never weaken code, never widen exclusions (see `star-coverage`).

## Rules

- No production code before its failing test. If you catch yourself implementing first, stop.
- Never run the build yourself — the user runs all test commands manually; you hand the exact command and wait for the result.
- Assert behavior, not implementation: check status codes, response bodies, and side effects — not which method names were called.
- Tests must run without a live PostgreSQL instance: zonky embedded PostgreSQL (no Docker) for anything touching PG, H2 for pure unit logic. Never hard-code a connection to a real database.
- Don't weaken a test to make it pass; the contract in the spec wins.
- Keep each test focused on one behavior; use descriptive `@DisplayName`s or test method names that read like the assertion.

## Reviewing tests (for the reviewer agent)

- Coverage: every spec section has at least one test, including error paths.
- Fidelity: tests assert the spec's status codes and payload fields.
- Independence: no test depends on another test's state; use fresh fixtures per test.
- Integration: features with a contract have `*IntegrationTest` coverage per `star-integration-test` (random-port HTTP + zonky + REST Assured, mocks only at the external boundary).
- Plan coverage: every task in `specs/<feature>/tasks.md` (if present) has its ACs covered by passing tests.
