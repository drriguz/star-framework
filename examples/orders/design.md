# Design: Orders

## Overview

Architecture for implementing `specs/orders/`. The requirements (`requirements.md` + `openapi.yaml`) are the contract; this records the few choices beyond framework defaults.

## Architecture

```
Client ──> OrderController ──> OrderService ──> OrderRepository ──> orders
```

Single module, standard layering (controller/service/repository). Migration: `V1__orders.sql`, `ddl-auto=none`.

## Key decisions

- **D-1** Money as `BigDecimal` end-to-end, `numeric(19,4)` column — no floating point in totals.
- **D-2** Create is a simple insert; no idempotency key (spec defines none — duplicate submit is the client's concern).

## Traceability

| Decision | Spec anchor |
| -------- | ----------- |
| D-1 | Data model (`numeric(19,4)`) |
| D-2 | AC-001, out of scope |

Tasks in `tasks.md` are planned from this design plus the spec's ACs and `openapi.yaml`.