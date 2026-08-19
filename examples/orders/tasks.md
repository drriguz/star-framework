# Tasks: Orders

**Direction:** top-down (API-first) — the API flow is the risky part.

**Inputs:** `requirements.md` (stories + ACs), `openapi.yaml`, `design.md`.

## Phase 1: Setup

- [ ] #1 Test infra (zonky + REST Assured)
  AC: a `@SpringBootTest` context boots — refs: `star-integration-test`

## Phase 2: Foundational — migration

- [ ] #2 Flyway `V1__orders.sql`
  AC: `@DataJpaTest` boots with the migrated schema matching `requirements.md` — refs: Data model

## Phase 3: US-1 Create order (P1)

- [ ] #3 Integration test (outer loop, red until layers land)
  AC: valid POST → 201 + `Location` + `PENDING` (AC-001); missing `customerName` → 400 (AC-002) — refs: AC-001…002, `post /orders`
- [ ] #4 [P] Controller slice (`@WebMvcTest`, service mocked) — 201/400 mapping
  AC: validation annotation produces 400 with `fields` — refs: AC-002
- [ ] #5 [P] Service unit — builds `PENDING` order, computes total
  AC: status and total set per FR-001 — refs: FR-001
- [ ] #6 Repository + entity (`@DataJpaTest`) — cascade insert
  AC: order persists with generated UUID — refs: Data model

## Phase 4: US-2 Fetch order (P2)

- [ ] #7 [P] Integration test
  AC: existing id → 200 with stored order (AC-003); unknown id → 404 (AC-004) — refs: AC-003…004, `get /orders/{orderId}`
- [ ] #8 Controller slice — 200/404 mapping; path id is UUID-validated
  AC: non-UUID id → 400 — refs: AC-004
- [ ] #9 Service + repository — `findById`, missing → `OrderNotFoundException` → 404
  AC: unknown id throws typed exception mapped to 404 — refs: AC-004

## Phase 5: Polish

- [ ] #10 Full suite + coverage gate (`./mvnw verify`) green

## Dependency summary

- #3 blocked by #1, #2; stays red until #4/#5/#6 land.
- #7 blocked by #2; `[P]` tasks run in parallel.