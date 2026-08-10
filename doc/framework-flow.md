# Star Framework — Flow

## End-to-end pipeline

```mermaid
flowchart LR
    CONST["CONSTITUTION.md<br/>policy · outranks everything"]

    SPECIFY["/specify<br/>spec-writer agent"]
    CLARIFY["/clarify<br/>design decisions → user decides"]
    TASKS["/tasks<br/>task plan"]
    IMPLEMENT["/implement<br/>implementer agent"]
    REVIEW["/review<br/>reviewer agent"]

    SPEC["specs/&lt;feature&gt;/<br/>spec.md + openapi.yaml<br/>(contract: source of truth)"]
    TASKSMD["tasks.md<br/>dependency-ordered ACs<br/>per layer"]
    VERDICT["PASS / FAIL<br/>+ coverage gate"]

    CONST -.->|hard gate| SPECIFY

    SPECIFY -->|writes| SPEC
    SPECIFY --> CLARIFY
    CLARIFY -.->|answers folded in| SPEC
    CLARIFY --> TASKS
    TASKS -->|produces| TASKSMD
    TASKS --> IMPLEMENT
    IMPLEMENT -->|executes, red → green| TASKSMD
    IMPLEMENT --> REVIEW
    REVIEW -.->|diffs implementation against| SPEC
    REVIEW --> VERDICT

    SPEC -.->|hard gate: read before coding| IMPLEMENT
    SPEC -.->|rendered as Swagger UI| VIEWER["tools/serve.js<br/>http://localhost:8741"]
```

## Three-layer guard

```mermaid
flowchart TB
    subgraph Constitution["Policy — CONSTITUTION.md"]
        P1["design decisions belong to the user"]
        P2["coverage ≥80% line / ≥70% branch"]
        P3["Flyway-only schema · ddl-auto=none"]
    end

    subgraph Build["Mechanical enforcement"]
        B1["JaCoCo gate — build fails below threshold"]
        B2["Flyway migrations immutable"]
        B3["tests run without Docker (zonky)"]
    end

    subgraph Agents["Workflow gates"]
        A1["hard gate → abort + next command"]
        A2["soft gate → explicit user confirmation"]
    end

    Constitution -.-> Build
    Constitution -.-> Agents
```

## The flow in words

1. **`/specify`** — the spec-writer agent turns the idea into `specs/<feature>/spec.md` (user stories, PG data model, validation) + `openapi.yaml` (canonical API contract). Design areas it can't resolve are asked, never guessed.
2. **`/clarify`** — targeted questions (≤5, options + recommendation) resolve remaining design ambiguity; answers are folded back into the spec. Unresolved items stay in "Open questions".
3. **`/tasks`** — the plan: dependency-ordered tasks with acceptance criteria (test cases) per layer, top-down (API first) or bottom-up (persistence first).
4. **`/implement`** — executes the tasks: AC tests first (red), minimal code (green), layer by layer; integration tests are close-to-e2e (`@SpringBootTest` random port + zonky embedded PG + REST Assured, mocks only at the external boundary); ends with the coverage gate (`./mvnw verify`).
5. **`/review`** — diffs the implementation against the spec (contract drift, schema drift, test quality, plan coverage), runs the gate, reports **PASS/FAIL** with findings.

Every phase is gated: hard-gate failures abort with the next suggested command (missing constitution → `star-constitution: init`); soft gates pause for explicit confirmation. The constitution outranks everything; the build enforces mechanically; the agents execute.
