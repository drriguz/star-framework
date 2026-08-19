---
description: Produce the implementation task plan (tasks.md) for a feature
agent: star-implementer
---

Split the feature named in the user's message into an implementation task plan. Load the `star-task-split` skill, read `specs/<feature>/requirements.md`, `openapi.yaml`, and `design.md`, choose the direction (top-down or bottom-up) with a one-line rationale, and write `specs/<feature>/tasks.md` with per-layer acceptance criteria derived from the spec's acceptance criteria. Present the direction choice to the user. Do not implement anything.