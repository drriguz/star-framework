# Feature: Orders

## Overview

Customers create and fetch orders. Each order has a status and a total.

## User stories

- **US-1** (P1) As a customer, I want to create an order, so that I can submit a purchase.
- **US-2** (P2) As a customer, I want to fetch an order, so that I can see its status.

## Acceptance criteria

### US-1 — Create order

- **AC-001** Given a valid request, When `POST /api/v1/orders`, Then the response is `201` with a `Location` header and the order has status `PENDING`.
- **AC-002** Given a missing `customerName`, When `POST /api/v1/orders`, Then the response is `400` with the error envelope.

### US-2 — Fetch order

- **AC-003** Given an existing order, When `GET /api/v1/orders/{id}`, Then the response is `200` with the stored order.
- **AC-004** Given an unknown id, When `GET /api/v1/orders/{id}`, Then the response is `404` with the error envelope.

## Functional requirements

- **FR-001** The system SHALL create orders with status `PENDING`.
- **FR-002** The system SHALL return a `404` for unknown order ids.

## Endpoints

| Method | Path | Purpose |
| ------ | ---- | ------- |
| POST | /api/v1/orders | Create an order (US-1) |
| GET | /api/v1/orders/{id} | Fetch an order (US-2) |

> Full contract in `openapi.yaml` in this directory — canonical.

## Data model (PostgreSQL)

### table: orders

| Column | Type | Constraints | Notes |
| ------ | ---- | ----------- | ----- |
| id | uuid | PK, default gen_random_uuid() | |
| customer_name | varchar(120) | NOT NULL | |
| status | varchar(20) | NOT NULL, default 'PENDING' | PENDING \| CANCELLED |
| total | numeric(19,4) | NOT NULL, default 0 | |
| created_at | timestamptz | NOT NULL, default now() | |

## Validation rules

| Field | Rule |
| ----- | ---- |
| customer_name | required, max 120 |

## Error format

All errors use the `Error` envelope defined in `openapi.yaml`.

## Out of scope

- Authentication, order updates, cancel, and listing.

## Open questions

- None.