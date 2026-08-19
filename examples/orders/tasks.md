# Tasks: Orders

**Direction:** bottom-up (persistence first) — each layer is completed, reviewed, and green before the next; the integration test verifies the whole stack last.

**Inputs:** `requirements.md` (stories + ACs), `openapi.yaml`, `design.md`.

**Layer checkpoints:** after each layer's tasks are green, the implementer summarizes (tests added, spec ACs proven) and waits for approval before the next layer.

## Phase 1: Setup

- [ ] #1 Test infra (zonky + REST Assured)
  AC: a `@SpringBootTest` context boots — refs: `star-integration-test`

## Phase 2: Foundational — migration

- [ ] #2 Flyway `V1__orders.sql`
  AC: `@DataJpaTest` boots with the migrated schema matching `requirements.md` — refs: Data model

## Phase 3: Repository + entity layer

**Layer checkpoint — after green, approve before Phase 4.**

- [ ] #3 [P] Entity + repository (`@DataJpaTest`)
  AC: `OrderRepository.findById` returns a persisted order with generated UUID; missing → empty — refs: AC-003, Data model
- [ ] #4 [P] Create + fetch persistence paths
  AC: insert and read round-trip; columns/types match `requirements.md` — refs: AC-001, AC-003

## Phase 4: Service layer

**Layer checkpoint — after green, approve before Phase 5.**

- [ ] #5 Service unit — `createOrder` builds `PENDING` order
  AC: status PENDING (FR-001); `total` default set — refs: AC-001, FR-001
- [ ] #6 Service unit — `getOrder` throws `OrderNotFoundException` for unknown id
  AC: unknown id → typed exception (mapped to 404 in the controller) — refs: AC-004

## Phase 5: Controller layer

**Layer checkpoint — after green, approve before Phase 6.**

- [ ] #7 [P] `@WebMvcTest` — `POST /orders` maps 201 + `Location`
  AC: 201 with Location header per `openapi.yaml`; missing `customerName` → 400 with `fields` — refs: AC-001, AC-002, `post /orders`
- [ ] #8 [P] `@WebMvcTest` — `GET /orders/{orderId}` maps 200/404; path id UUID-validated
  AC: 200 with stored order (AC-003); unknown id → 404 envelope; non-UUID → 400 — refs: AC-003, AC-004, `get /orders/{orderId}`

## Phase 6: Integration test (acceptance anchor)

**Layer checkpoint — after green, approve before Phase 7.**

- [ ] #9 `OrderCreateIntegrationTest` — real HTTP + zonky + REST Assured
  AC: valid POST → 201 + `Location` + `PENDING` (AC-001); missing `customerName` → 400 (AC-002) — refs: AC-001…002
- [ ] #10 `OrderGetIntegrationTest`
  AC: existing id → 200 with stored order (AC-003); unknown id → 404 (AC-004) — refs: AC-003…004

## Phase 7: Polish

- [ ] #11 Full suite + coverage gate (`./mvnw verify`) green

## Dependency summary

- #2 blocks every later phase (schema must exist first).
- Within each layer, `[P]` tasks run in parallel; layers are strictly sequential (checkpoint between each).