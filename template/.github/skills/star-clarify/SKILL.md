---
name: star-clarify
description: Procedure for resolving design ambiguity in feature specs — ask the user targeted questions, let them decide every design decision, and fold the answers back into the spec. Use when a spec has uncertain design areas or before implementing an ambiguous spec.
---

# Clarify design decisions

Every design decision belongs to the user, never to an agent. This procedure resolves ambiguity before the design is finalized, so no one plans, tests, or codes on top of an assumption.

## What is a design decision (user decides)

Anything that changes observable behavior or the data contract:

- Endpoint shape: which resources/operations exist, method + path, whether something is a separate endpoint or a query parameter
- Status codes and their semantics (which error → 4xx vs 409 vs 422)
- Payload fields: names, types, requiredness, nested structure
- Validation rules: formats, bounds, patterns, case sensitivity
- Data model: tables, columns, types, constraints, relationships, cascade behavior, indexes
- Semantics: e.g. what "deactivate" means, what happens to children, uniqueness rules, soft vs hard delete
- Scope: what this feature includes or explicitly excludes

## What is an implementation detail (agent decides — never ask)

Class names, package layout, which Spring annotation, repository method names, code formatting. If the spec does not constrain it, the implementer chooses; asking wastes the user's time.

## Procedure

1. Scan the spec (`spec.md` + `openapi.yaml`) for design areas that are absent, contradictory, or ambiguous. List them.
2. Group into topics; tackle at most **5 questions per round** (one topic per question).
3. Ask each question with **concrete options and a recommended default**, so the user can answer quickly:

   ```
   Q: When an order is cancelled, what happens to its items?
   a) Keep items, mark order cancelled (recommended)
   b) Delete items with the order
   c) Keep items, mark them cancelled too
   ```

4. Encode every answer into the spec **immediately** — update `openapi.yaml` (contract) and `spec.md` (data model, validation, scope). Cross out nothing; overwrite the ambiguous text with the decided text.
5. Move resolved decisions out of "Open questions"; leave only what the user explicitly deferred.
6. Re-scan: if answers introduced new uncertainties (e.g. "cancelled" now needs a status field with its own values), run another round.

## Rules

- Never guess a design decision. If the user cannot answer right now, record the question in the spec's "Open questions" — do not invent a default in the spec.
- Never ask about implementation details, and never fold implementation detail into the spec.
- If the user's answer contradicts an existing spec statement, update the spec to match the answer (the spec always yields).
- When the user answers with "you decide", make the call, write it into the spec, and state the decision + rationale in your reply — it is then a recorded decision, not a guess.

## Definition of done

Either the spec's "Open questions" section contains only explicitly deferred items, or the spec is decision-complete — every design area is written down and traceable to a user answer.
