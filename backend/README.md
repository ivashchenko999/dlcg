# Backend Domain

The backend is an ASP.NET Core Web API on .NET 10. It owns catalogue business validation,
persistence, query semantics, and the public HTTP contract.

For installation and platform-specific setup, see the [repository README](../README.md).

## Request Flow

```text
HTTP request
    ↓
Controller and model binding
    ↓
Output cache (GET requests)
    ↓ on cache miss
Typed contract validation
    ↓
Application service
    ↓
EF Core query / SQL Server
    ↓
DTO or Problem Details response
```

## Source Structure

```text
src/GameCatalog.Api/
├── Contracts/        Public API requests, responses, enums, and paging models
├── Controllers/      HTTP routes and status-code mapping
├── Data/             DbContext, migrations, and development seed data
├── Entities/         Persistence entities and relationships
├── Infrastructure/   Cross-cutting HTTP infrastructure
└── Services/         Application operations and query composition
```

## Layer Responsibilities

### Controllers

Controllers translate HTTP concerns into typed service calls. They should remain thin: model
binding, cancellation, status codes, and response selection belong here; EF Core queries do not.

### Contracts

Contracts are the public API boundary. Data annotations validate payloads before service
execution. `GameQuery` uses enums and bounded page values so only supported operations reach the
database. `PagedResult<T>` provides a consistent pagination envelope.

### Services

Services contain catalogue workflows and database query composition. Read queries use
`AsNoTracking`, project directly to DTOs, propagate cancellation tokens, and apply filtering
before counting and paging.

All paginated sorts finish with the unique game `Id`, ensuring deterministic page boundaries
when user-visible sort values are equal.

### Output Caching

ASP.NET Core Output Cache stores game responses for 60 seconds and genre responses for 10
minutes. Game cache keys vary by every query-string parameter, keeping search, filtering,
sorting, and paging results isolated. Successful create, update, and delete operations evict the
`games` cache tag before returning. The cache is in-process, requires no Redis service, and is
also used by requests made through Swagger UI.

### Data and Entities

`GameCatalogDbContext` configures SQL precision, lengths, indexes, and relationships. EF Core
migrations define the production schema. `DbSeeder` inserts development sample data only when
the catalogue is empty.

### Infrastructure

`GlobalExceptionHandler` converts known domain errors into RFC-compatible Problem Details. The
framework handles model-validation failures and unhandled server errors consistently.

## Local Configuration

ASP.NET Core loads the standard `appsettings` files, environment variables, and command-line
configuration. This project then adds the ignored `appsettings.Local.json` as an optional final
developer override in `Program.cs`.

Keep credentials and machine-specific connection strings in `appsettings.Local.json` or in the
deployment environment, never in tracked configuration. Production deployments should provide
their own configuration and should not contain a local override file.

## Testing Strategy

The tests instantiate services against in-memory SQLite. Unlike EF Core's non-relational
InMemory provider, SQLite exercises SQL translation, ordering, constraints, and relational
behaviour without requiring a SQL Server test instance.

Current tests cover CRUD behaviour, validation contracts, filtering, paging, sorting, stable
tie-breakers, and unknown references.

```bash
dotnet test
```

## Review Checklist

When adding backend code, verify that:

- public inputs are bounded and validated;
- controllers remain transport-focused;
- queries are asynchronous and accept cancellation tokens;
- read-only queries use `AsNoTracking`;
- paging happens after filtering and deterministic ordering;
- entities are not returned directly from controllers;
- expected domain failures map to intentional HTTP responses;
- schema changes include an EF Core migration;
- query behaviour is tested with a relational provider.
