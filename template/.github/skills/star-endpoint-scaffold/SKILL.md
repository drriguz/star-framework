---
name: star-endpoint-scaffold
description: Standard layering and naming for REST endpoints in Spring Boot — controller, service, repository, entity, DTOs, validation, and error handling. Use when implementing or reviewing endpoints.
---

# REST endpoint scaffold (Spring Boot)

Standard package layout (under the project's base package):

```
controller/   XxxController       — HTTP mapping only, thin
service/      XxxService          — business rules, @Transactional boundaries
repository/   XxxRepository       — Spring Data JPA interface
model/entity/ XxxEntity           — JPA entity
model/dto/    XxxRequest, XxxResponse — Java records
exception/    GlobalExceptionHandler — @RestControllerAdvice
```

## Layering rules

- **Controller**: maps HTTP to service calls, translates exceptions if needed, never contains business logic or SQL. Returns response DTOs; `ResponseEntity` only when the status code is not derivable from the return type.
- **Service**: business rules, validation beyond annotations, transaction boundaries (`@Transactional` on mutating operations). Throws domain exceptions (e.g. `OrderNotFoundException`), never leaks JPA exceptions.
- **Repository**: Spring Data JPA interface extending `JpaRepository<Entity, Id>`. Add `@Query` only when derived queries can't express the need; keep JPQL/`nativeQuery` PG-compatible.
- **Entity**: JPA mappings, `@Table` with the explicit snake_case table name, `@Column` with explicit names. Use `@Version` for optimistic locking where the spec implies concurrent updates.

## DTO conventions

- Requests and responses are **Java records** (`record XxxRequest(...)`) with `jakarta.validation` constraints mirroring the spec's validation rules.
- Never expose entities directly as response payloads — map to records.
- Response payload fields must match the spec exactly, including nullability and names (camelCase JSON by default).

## Validation

- Annotate request records: `@NotBlank`, `@NotNull`, `@Size`, `@Email`, `@Pattern`, etc.
- `@Valid` on controller method parameters.
- Field errors surface as the `fields` map in the global error envelope (see below).

## Error handling

One `@RestControllerAdvice` per service with `@ExceptionHandler` methods:

- `NotFoundException` → 404
- validation `MethodArgumentNotValidException` / `ConstraintViolationException` → 400 (or 422 per spec)
- optimistic lock / unique-violation → 409
- unexpected → 500, with a stable generic message

Errors use the RFC 7807-style envelope from the spec's Error format section (`type`, `title`, `status`, `detail`, `instance`, optional `fields`).

## Collection endpoints

- List endpoints accept Spring Data `Pageable` (`page`, `size`, `sort`) unless the spec says otherwise.
- Response shape: the spec's defined envelope (e.g. `{ "content": [...], "page": {...} }`) — check the spec; do not invent one.

## Naming summary

| Thing | Convention | Example |
| ----- | ---------- | ------- |
| Controller | `<Resource>Controller` | `OrderController` |
| Service | `<Resource>Service` | `OrderService` |
| Repository | `<Resource>Repository` | `OrderRepository` |
| Request DTO | `<Resource><Action>Request` | `CreateOrderRequest` |
| Response DTO | `<Resource><Detail>Response` | `OrderResponse` |
