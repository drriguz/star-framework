# Feature: <short name>

## Overview

<One paragraph: what this feature does and why it exists.>

## User stories

- **US-1** (P1) As a <role>, I want <capability>, so that <benefit>.
- **US-2** (P2) As a <role>, I want <capability>, so that <benefit>.

Prioritize P1 = most critical. Each story is independently implementable and testable.

## Acceptance criteria

### US-1 — <title>

- **AC-001** Given <state>, When <action>, Then <expected outcome>.
- **AC-002** Given <state>, When <action>, Then <expected outcome>.

### US-2 — <title>

- **AC-003** Given <state>, When <action>, Then <expected outcome>.

Every AC maps to at least one operation in `openapi.yaml`, and every operation maps to at least one AC.

## Functional requirements

- **FR-001** The system SHALL <behavior>.
- **FR-002** The system SHALL <behavior>.

## Non-functional requirements

- **NFR-001** <requirement>.

## Endpoints

| Method | Path | Purpose |
| ------ | ---- | ------- |
| POST | /api/v1/<resource> | <purpose> |

> The full contract — parameters, status codes, request/response schemas — lives in `openapi.yaml` in this directory. That document is canonical.

## Data model (PostgreSQL)

### table: <plural_snake_name>

| Column | Type | Constraints | Notes |
| ------ | ---- | ----------- | ----- |
| id | uuid | PK, default gen_random_uuid() | |
| created_at | timestamptz | NOT NULL, default now() | |

Relationships: <e.g. children.order_id → orders.id, FK cascade rules>

Indexes: <columns to index and why>

## Validation rules

| Field | Rule |
| ----- | ---- |
| <field> | <e.g. required, max length, pattern> |

## Error format

All error responses use the `Error` envelope defined in `openapi.yaml`. Status codes per operation are enumerated in the OpenAPI document.

## Out of scope

- <things this feature explicitly does not do>

## Open questions

- <anything unresolved, or "None">