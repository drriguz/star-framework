---
name: star-constitution
description: Initializes or inspects a project's constitution (CONSTITUTION.md) — the non-negotiable principles of the spec-driven + TDD workflow for Spring Boot + PostgreSQL projects. Use when a project needs its constitution created, checked, or audited.
---

# Constitution: init and inspect

A constitution is the project's foundation document: a short list of non-negotiable principles that outrank every other instruction. It is a single file, `CONSTITUTION.md`, at the project root.

## Init

Purpose: create `CONSTITUTION.md` in a project that does not have one (or refresh one that is missing clauses).

1. Check whether `CONSTITUTION.md` exists at the project root.
2. If it does **not** exist:
   - Copy `constitution-template.md` from this skill's directory.
   - Replace `<Project Name>` with the actual project name (from the build file or the user).
   - Keep only clauses that apply if the user asks for a trimmed version; by default keep all.
   - Write it to `CONSTITUTION.md`.
3. If it **does** exist:
   - Diff it against the template.
   - Report missing clauses and contradictions — do **not** overwrite the file or edit it without the user's explicit approval. The user may have amended it deliberately.

## Inspect

Purpose: verify the constitution exists, is complete, and is being followed.

1. If `CONSTITUTION.md` does not exist, report: **NO CONSTITUTION** and offer to run the init procedure.
2. Read the file. For each clause of the template (in this skill's directory), determine whether the project's constitution covers it (same principle, exact wording not required). Report missing clauses and any clauses that contradict the template's principles — flag them as drift; the project may have amended them deliberately, so report, don't edit.
3. Compliance spot-check (cheap, read-only):
   - `spring.jpa.hibernate.ddl-auto` is `none` or absent in all config files (never `update`/`create`).
   - Migrations exist under `src/main/resources/db/migration/` if the project has persisted data.
   - `specs/` exists and each implemented feature has a spec directory.
   - No entity is serialized directly in controller return types (scan controllers + DTO usage).
   - Test files don't hard-code a connection to a live database.
   - Coverage gate is enforced in the build (JaCoCo or equivalent, minimum at or above the constitution's threshold — see `star-coverage`).
4. Produce a report:

```
CONSTITUTION: PRESENT | MISSING
Completeness: <clauses covered> / <template clauses>; missing: <list>
Drift: <clauses that contradict the template, or "none">
Compliance spot-checks:
- [ok|violation] <check> — <file:line when violated>
```

## Rules

- Never modify `CONSTITUTION.md` during inspect; during init, only create it when absent or after explicit user approval to rewrite.
- The constitution may contain project-specific amendments — distinguish "missing from template" from "wrong".
- One feature of the constitution: any agent working in the project must follow it. If the inspect finds a clause being violated in the codebase, list it as a compliance violation, not a constitution defect.

## Definition of done

Init: `CONSTITUTION.md` exists, is based on the template, and no other file was touched. Inspect: a report with presence, completeness, drift, and compliance checks was produced and no file was modified.
