---
name: star-pg-schema
description: PostgreSQL schema conventions — naming, column types, keys, constraints, and indexes — for Spring Boot + Flyway projects. Use when a spec defines a data model or when implementing or reviewing schema changes.
---

# PostgreSQL schema conventions

Translate the spec's data model into PG DDL with these conventions. Every rule exists because the wrong choice causes real problems in PG (serialization, drift from H2, index misses).

## Naming

- Tables and columns: `snake_case`, plural table names (`orders`, `order_items`).
- Primary key column: `id`.
- Foreign key column: `<singular_table>_id` (`customer_id`).
- Index names: `idx_<table>_<column>`; unique constraints: `uq_<table>_<column>`.

## Column types

| Use case | Type | Notes |
| -------- | ---- | ----- |
| Primary key | `uuid` | `DEFAULT gen_random_uuid()` (PG 13+); never `serial` for new work |
| Timestamps | `timestamptz` | Never `timestamp`/`datetime` — store absolute instants |
| Audit timestamps | `timestamptz NOT NULL DEFAULT now()` | `created_at`, `updated_at` |
| Money | `numeric(19,4)` | Never `float`/`double` for money |
| JSON | `jsonb` | Not `json`; `jsonb` allows indexes (`GIN`) and containment queries |
| Text | `text` | Use `varchar(n)` only when the spec defines a max length |
| Counts/quantities | `integer` or `bigint` | `bigint` when values can exceed 2^31 |
| Booleans | `boolean` | Never `int`/`char(1)` |

## Keys and constraints

- PK: `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`.
- Every FK is `REFERENCES <table>(id)` with explicit `ON DELETE` behavior matching the spec (default `NO ACTION`; `CASCADE` only when the spec says children die with the parent).
- Enforce `NOT NULL` at the DB level even when the API also validates.
- Enums: prefer `CHECK (col IN ('a','b'))` for small fixed sets; use a lookup table when values are extensible or carry data. Avoid PG `CREATE TYPE ... AS ENUM` — altering the set requires `ALTER TYPE`, which is awkward in migrations.
- Natural keys (email, sku, slug): unique constraint, e.g. `CONSTRAINT uq_customers_email UNIQUE (email)`.

## Indexes

- Index every FK column (`idx_orders_customer_id`) — PG does not auto-index FKs.
- Index columns used in `WHERE`/`ORDER BY` per the spec's query expectations; don't over-index speculative queries.
- `jsonb` fields used in filters: `GIN` index.
- Use partial indexes sparingly and document why.

## Everything else

- Defaults belong in the DDL (see `star-flyway-migration`) — never compute `created_at` in application code.
- Soft delete: a nullable `deleted_at timestamptz` when the spec requires it; queries must filter it consistently.
- Schema and code must agree: when reviewing, diff the migration DDL against the spec's data model tables, not against the entities.
