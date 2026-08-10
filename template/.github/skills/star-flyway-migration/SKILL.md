---
name: star-flyway-migration
description: Rules for PostgreSQL schema changes via Flyway in Spring Boot — migration naming, when to write one, and what never to do. Use when a spec changes the data model or when implementing/reviewing schema changes.
---

# Flyway migrations (Spring Boot + PostgreSQL)

Flyway is the **only** schema mechanism. `spring.jpa.hibernate.ddl-auto` must be `none` in all environments — schema never comes from entities.

## Where migrations live

`src/main/resources/db/migration/` (default Flyway location; verify in `application.yml` if the project overrides it).

## Naming

`V<timestamp>__<description>.sql` — timestamp-based versions (e.g. `V20260811090000__create_orders.sql`) so parallel work in teams does not collide. Never reuse a version; once applied, a version is immutable.

Rules:

- Suffix must be `.sql`.
- `<description>` is snake_case and states the change: `create_orders`, `add_status_to_orders`, `drop_legacy_inventory`.
- One logical change per migration; if a feature needs 3 tables, that's fine in one migration when they belong to the same feature.

## Writing a migration

- Match the spec's data model exactly — column types, constraints, defaults (see `star-pg-schema` for type choices).
- Use only PostgreSQL SQL. No conditional logic unless the migration must be idempotent.
- Include the obvious indexes and constraints in the same migration as the table.
- Add `IF NOT EXISTS` / `IF EXISTS` guards when the migration could run on a database with partial state — otherwise keep migrations plain and deterministic.

## Never

- **Never edit an applied migration** — on a fresh checkout `flyway migrate` validates checksums and will fail. Fix forward with a new migration.
- Never use `ddl-auto: update/create` in any environment, including tests.
- Never drop columns/tables that are still referenced by code — write the code change and schema change in the order the feature needs (prefer additive migrations; drop in a later migration if required).
- Never generate schema by hand-editing `application.yml` or running ad-hoc SQL outside Flyway.

## Running

```bash
./mvnw flyway:migrate            # or via Spring Boot startup
./gradlew flywayMigrate
```

In tests, migrations run automatically when the application context starts (zonky embedded PostgreSQL or H2) — do not disable them.
