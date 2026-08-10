# Feature: <short name>

## Overview

<One paragraph: what this feature does and why it exists.>

## User stories

- As a <role>, I want <capability>, so that <benefit>.

## Endpoints

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET | /api/v1/things/{id} | Fetch one thing |

> The full contract — parameters, status codes, request/response schemas — lives in `openapi.yaml` in this directory. That document is canonical.

## Data model (PostgreSQL)

### table: <plural_snake_name>

| Column | Type | Constraints | Notes |
| ------ | ---- | ----------- | ----- |
| id | uuid | PK, default gen_random_uuid() | |
| created_at | timestamptz | NOT NULL, default now() | |

Relationships: <e.g. orders.customer_id → customers.id, FK cascade rules>

Indexes: <columns to index and why>

## Validation rules

| Field | Rule |
| ----- | ---- |
| <field> | <e.g. required, max length 100, pattern> |

## Error format

All error responses use the `Error` envelope defined in `openapi.yaml` (`type`, `title`, `status`, `detail`, `instance`, optional `fields` for field-level validation errors). Status codes per operation are enumerated in the OpenAPI document.

## Out of scope

- <things this feature explicitly does not do>

## Open questions

- <anything unresolved, or "None">
