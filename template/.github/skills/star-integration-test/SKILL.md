---
name: star-integration-test
description: Integration testing close to e2e for Spring Boot REST + PostgreSQL — @SpringBootTest with a random port, zonky embedded PostgreSQL (no Docker), REST Assured for API validation, mocking only the external boundary. Use when writing or reviewing feature integration tests.
---

# Integration tests (close to e2e)

Integration tests prove a feature through the real stack: real HTTP server, real PostgreSQL, real Flyway migrations, real controller/service/repository chain. Only the outbound boundary (other services, messaging) is mocked. Use them alongside the slice tests from `star-tdd-cycle` — slices stay fast during red → green; integration tests verify the section's contract as it will run in production.

## Stack (fixed decisions)

1. **Real HTTP server**: `@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)` — starts Tomcat on a random port; requests go through the real HTTP stack, not MockMvc.
2. **Zonky embedded PostgreSQL** — a real PG process, zero config, **no Docker**:
   - Maven: `io.zonky.test:embedded-postgres:2.0.7` (`test` scope). Gradle: `testImplementation 'io.zonky.test:embedded-postgres:2.0.7'`.
   - Binaries resolve per-OS from Maven Central on first run. Gradle gotcha: Gradle ignores Maven profiles, so Gradle projects may also need the platform binaries artifact explicitly, e.g. `testImplementation 'io.zonky.test.postgres:embedded-postgres-binaries-darwin-amd64:2.0.7'` (substitute the host platform).
   - Flyway migrations run automatically against the embedded PG at context startup — do not disable them.
3. **Mock only the external boundary**: `@MockitoBean` (Boot 3.4+) / `@MockBean` on the outbound client types — Feign interfaces, `WebClient`/`RestClient` wrappers, messaging producers. Never mock controllers, services, repositories, the datasource, or Flyway. If a feature has no external dependencies, write no mocks at all.
4. **REST Assured for API validation**: Maven/Gradle `io.rest-assured:rest-assured` (`test` scope). `given().when().then()` assertions must mirror the spec's `openapi.yaml` — status codes, headers, payload fields.

## Shape of a feature integration test

```java
package com.example.order.integration;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.zonky.test.db.AutoConfigureEmbeddedDatabase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockitoBean;
import org.springframework.boot.test.web.server.LocalServerPort;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.startsWith;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureEmbeddedDatabase(provider = AutoConfigureEmbeddedDatabase.DatabaseProvider.ZONKY)
class OrderApiIntegrationTest {

    @LocalServerPort
    private int port;

    @MockitoBean
    private PaymentGatewayClient paymentGateway; // external boundary only

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
    }

    @Test
    void createOrder_returns201_withLocationHeader() {
        given()
            .contentType(ContentType.JSON)
            .body(new CreateOrderRequest("sku-1", 2))
        .when()
            .post("/api/v1/orders")
        .then()
            .statusCode(201)
            .header("Location", startsWith("/api/v1/orders/"))
            .body("status", equalTo("CREATED"));
    }
}
```

### Wiring zonky (two equivalent options)

- **Annotation (preferred)**: `@AutoConfigureEmbeddedDatabase(provider = AutoConfigureEmbeddedDatabase.DatabaseProvider.ZONKY)` on the test class replaces the datasource with the embedded PG automatically.
- **Manual**: static `EmbeddedPostgres` + `@DynamicPropertySource`:

```java
static final EmbeddedPostgres POSTGRES = EmbeddedPostgres.builder().start();

@DynamicPropertySource
static void datasource(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
    registry.add("spring.datasource.username", () -> "postgres");
    registry.add("spring.datasource.password", () -> "postgres");
}
```

### Test state

- The embedded DB lives for the whole test class (zonky `refresh` default `NEVER`) — real HTTP requests run in separate threads, so `@Transactional` rollback does not work.
- Clean state in `@BeforeEach` via the repository (`repository.deleteAll()`) or `@Sql`/JDBC truncate statements. Seed fixtures through the service or repository layer — not raw SQL when a repository method expresses the intent.
- For stricter isolation across methods, set `refresh = AFTER_EACH_TEST_METHOD` on the annotation — it recreates the schema per test and is slower; only use when state leaks make tests flaky.

## Where they fit in the workflow

- Write them during `/implement`, one class per feature, after each spec section is green via slice tests: cover the happy path and every error path the spec enumerates.
- `/review` expects a feature to have integration tests for its contract.
- Naming `*IntegrationTest` keeps them running under the default surefire/Gradle test task — no extra build config. To keep the red→green loop fast, run them explicitly (`./mvnw test -Dtest=OrderApiIntegrationTest`) and let the full suite include them.

## Rules

- Assert what the spec's `openapi.yaml` says: exact status codes, response fields, error envelope shape (`type`, `title`, `status`, `detail`, `instance`, `fields`).
- No live PostgreSQL, no Docker requirement, no hard-coded database credentials.
- Mock scope rule: the only mocks allowed are the outbound boundary types; verify in review that no mock replaces an internal layer.
- Never assert on database internals through the HTTP layer (no leaking table names into API assertions).

## Definition of done

At least one `*IntegrationTest` per implemented feature using `RANDOM_PORT` + zonky + REST Assured; mocks limited to the external boundary; assertions match `openapi.yaml`; the class runs green in the default test task without Docker or a live PG.
