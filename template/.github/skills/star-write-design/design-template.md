# Design: <Feature>

## Overview

Architecture for implementing `specs/<feature>/`. The spec (`requirements.md` + `openapi.yaml`) is the contract; this records the few choices beyond framework defaults.

## Architecture

```
<ASCII component diagram: Client → Controller → Service → Repository → DB>
```

<One or two lines on structure: modules, main components, how they connect.>

## Data flow

<For each main flow, a short numbered sequence. Reference the spec's acceptance criteria.>

## Key decisions

- **D-1** <Decision> — <why in one line> — refs: <spec anchor>
- **D-2** <Decision> — <why in one line> — refs: <spec anchor>

## Non-functional concerns

<Performance, observability, security choices beyond framework defaults — or "None.">

## Open design decisions

- <Anything the user deferred, or "None">

## Traceability

| Decision | Spec anchor |
| -------- | ----------- |
| D-1 | <AC / NFR / data-model section> |
| D-2 | <AC / NFR / data-model section> |

Tasks in `tasks.md` are planned from this design plus the spec's ACs and `openapi.yaml`.