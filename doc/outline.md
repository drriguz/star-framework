# 15-Minute Presentation: Star Framework

**Title:** Spec-Driven Development + TDD for Spring Boot + PostgreSQL — delivered by GitHub Copilot

**Format:** 15 min total. Idea first (~6.5 min), then a **5-minute pre-recorded demo** (no live coding), then key design decisions and wrap-up (~3.5 min). Leave ~1 min buffer at the end.

## Agenda & timing

| # | Segment | Time | Slides |
| - | ------- | ---- | ------ |
| 1 | The problem: AI coding without a process | 2.0 min | 2 |
| 2 | The idea: spec → clarify → tasks → implement → review | 3.0 min | 3 |
| 3 | Framework anatomy (spec, clarify, TDD plan, guards, template) | 3.5 min | 4–8 |
| 4 | **Demo — pre-recorded, 5 minutes** | 5.0 min | 9–10 |
| 5 | Design decisions worth stealing | 1.5 min | 11 |
| 6 | Key takeaways + close | 1.0 min | 12–13 |

## Segment 1 — The problem (2 min)

Message: "AI writes code; it doesn't run a process."

- Every prompt is a lottery — "write me a REST API" produces a different result every time.
- Contract drift — code says X, docs say Y, and nobody notices until integration.
- No plan, no test-first discipline, no review — "it compiles" passes for done.
- The gap isn't model capability; it's the missing *engineering process* around the AI.

Close with the thesis: *"We don't need a better autocomplete — we need a disciplined engineering process the AI is forced to follow."*

## Segment 2 — The idea (3 min)

The pipeline, from left to right:

1. **Spec** — the single source of truth: `spec.md` (user stories, PG data model, validation) + `openapi.yaml` (canonical API contract).
2. **Clarify** — design decisions belong to the user. Targeted questions (≤5 per round, options + recommendation). Ambiguity is never guessed.
3. **Tasks** — dependency-ordered implementation plan with acceptance criteria (test cases) per layer; top-down or bottom-up direction.
4. **Implement** — TDD: AC tests first, red → green, layer by layer, suite always green.
5. **Review** — spec-compliance verdict: PASS/FAIL with findings.

Key phrase: "The spec is the contract between phases; the user is the design authority; the build is the enforcement."

## Segment 3 — Framework anatomy (3.5 min)

Four slides, one idea each:

- **Spec is the source of truth** — one directory per feature, viewable in the browser (Swagger UI via a zero-dependency Node server). Contract changes update the spec first, never the code first.
- **TDD with a plan** — `tasks.md`: Setup → Foundational → layers → Polish. Top-down (API first, integration-test anchored) vs bottom-up (persistence first). Every layer carries ACs.
- **Three-layer guard** — Constitution (policy, outranks everything) / Build (mechanical: JaCoCo coverage gate ≥80/70, Flyway-only schema) / Agents (workflow gates: hard gates abort with the next command, soft gates ask).
- **It's a template** — 3 agents, 10 skills, 5 commands, copied into any project. Auto-loaded every session via the instructions file, so the constitution and specs are always in play. Tests run without Docker (zonky embedded PG).

## Segment 4 — Demo recording (5 min)

### What the recording shows (record before the talk; no live coding)

1. **Install** (0:30) — copy `template/` into a scratch consumer project; init the constitution with `star-constitution`.
2. **`/specify`** (1:00) — describe a feature (e.g. "orders with items and cancellation"); spec-writer asks 2–3 design questions; watch `specs/orders/openapi.yaml` + `spec.md` appear.
3. **Viewer** (0:30) — `node .github/tools/serve.js`, open the browser: Swagger UI renders the contract; pick the endpoint, show the schemas.
4. **`/tasks`** (0:30) — the implementation plan appears with per-layer ACs.
5. **`/implement`** (1:30) — the money shot: integration test first (red) → controller → service → repository + migration → green. Emphasize: zonky embedded PG (no Docker), REST Assured assertions matching the spec, suite green at every step.
6. **`/review`** (0:30) — verdict PASS with findings list; coverage gate output visible.
7. **`/clarify`** (0:30) — if time allows: change one design decision, watch the spec (not the code) update first.

### Recording tips

- Record at 2× and keep the final cut at 5:00 max; real-time recording will be ~8–10 min.
- Use a large terminal font and a clean theme; zoom into the chat panel for command invocations.
- Pre-create the scaffolded project and the constitution; do the interesting parts live.
- Never let a failed red step linger — narrate it ("fails for the right reason") and move on.

## Segment 5 — Design decisions worth stealing (1.5 min)

- **Gates** — every phase fails fast and tells you the next command (missing constitution → init; pending decisions → clarify).
- **Close-to-e2e tests** — `@SpringBootTest` random port + zonky embedded PG + REST Assured; mocks only at the external boundary.
- **Coverage is enforced, not requested** — JaCoCo gate in the build; policy in the constitution; a feature isn't done until the gate passes.
- **Human-in-the-loop design** — the AI is the executor, the user is the design authority.

## Segment 6 — Wrap-up (1 min)

- AI delivery needs a process, not more prompting.
- The whole workflow is one copy-paste away (`cp -r template/. <project>`).
- Point to the repo + `doc/slides.md` for details. Q&A.

## Running the slides

```bash
cd doc
npm install
npm run dev      # http://localhost:3030
npm run build    # static export
```

The demo recording goes to `doc/public/demo/feature-demo.mp4` (Slidev serves `public/` at `/`).
