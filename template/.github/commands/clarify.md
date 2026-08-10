---
description: Resolve design ambiguity in a feature spec with targeted questions
agent: star-spec-writer
---

Run the clarify procedure on the feature named in the user's message (or the spec that was just written). Load the `star-clarify` skill, scan `specs/<feature>/spec.md` and `openapi.yaml` for underspecified or contradictory design areas, and ask the user at most 5 targeted questions with concrete options and recommendations. Fold every answer back into the spec. Do not write any code.
