# Candidate Assignment Coverage

This document maps the candidate assignment to the delivered application and separates the
requested scope from the additional engineering included in the submission.

## Requested Scope

The assignment requested a simple two-page video-game catalogue, with one page for browsing and
one for editing an entry. Its purpose was to demonstrate code clarity and effective use of the
selected languages and frameworks rather than elaborate visual design.

The requested stack was ASP.NET Core, Entity Framework Core with SQL Server and Code First,
Angular, Angular Router, and Bootstrap/ng-bootstrap. Unit testing was identified as a bonus.

## Requirement Coverage

| Assignment requirement | Delivered implementation |
| --- | --- |
| Catalogue browsing page | Responsive games table at `/games` |
| Entry editing page | Typed reactive form at `/games/:id/edit` |
| ASP.NET Core | Typed REST API with thin controllers and a service layer |
| EF Core with SQL Server | Code First entity configuration, migrations, indexes, and Azure SQL |
| Angular | Standalone components, signals, typed reactive forms, and strict templates |
| Angular Router | Lazy feature routes, edit navigation, 404 handling, and URL-backed list state |
| Bootstrap / ng-bootstrap | Responsive layout, form controls, modal confirmation, and toasts |
| Unit testing (bonus) | Backend service/contract tests and frontend component/service tests |
| Repository submission | Complete source, setup instructions, CI history, and versioned releases |

Authentication was intentionally not added because it was outside the requested scope. HTTPS is
provided by the Azure-hosted demo.

## Engineering Focus

Because the target position has a strong backend focus, I intentionally used the small catalogue
domain to demonstrate backend engineering depth rather than expanding it with unrelated product
features. Filtering, sorting, and pagination execute server-side through EF Core; deterministic
ordering and database indexes support reliable paging; validation, Problem Details, cache
invalidation, health checks, and relational tests make API behaviour explicit and maintainable.

The Angular application complements that backend focus: URL-backed search, filtering, sorting, and
pagination drive the same typed API contract while preserving browser navigation. This demonstrates
how frontend state and backend query design can work together cleanly without moving business or
data-access responsibilities into the UI.

## Full-Stack Capability and Scope Discipline

Swagger, Azure hosting, CI/CD, versioned releases, and automated deployment were not required by
the assignment. I included them in this take-home deliberately so the submission could demonstrate
more than isolated code: I can work across frontend, backend, data, testing, delivery, and production
verification, while taking ownership of the path from a requirement to a running application.

This take-home is an intentional exception to how I treat scope in day-to-day product development.
In a team environment, I implement the agreed requirements and acceptance criteria rather than
silently expanding a task with unrequested engineering or product work. I am comfortable proposing
improvements and explaining their value and trade-offs, but I expect them to be discussed with the
team and business stakeholders and, when accepted, captured as explicit follow-up work before
implementation.

The additional work here is therefore evidence of capability, not a preference for scope creep. My
goal was to make my backend depth and full-stack range visible in a self-contained evaluation, and
to show that I can be trusted to deliver carefully, communicate engineering choices, and respect
the boundaries agreed with the team.

## Engineering Added Beyond the Minimum

### Complete Catalogue Workflow

Creation and deletion complement the requested browse/edit flow. The UI includes typed validation,
delete confirmation, success/error notifications, loading states, retry behaviour, and intentional
handling for invalid or missing edit routes.

### Server-Side Catalogue Operations

Search, genre filtering, deterministic sorting, and pagination execute in the database rather
than over a client-side copy. Sortable columns are indexed, and every paginated ordering ends with
a unique `Id` tie-breaker so page boundaries remain stable.

### Predictable Navigation and Request Handling

Catalogue state is stored in URL query parameters, making filtered and sorted views bookmarkable
and compatible with browser Back and Forward navigation. Debouncing and request cancellation stop
slower, stale searches from replacing newer results.

### Explicit Validation and API Contracts

Bounded query parameters and game payloads are validated before database work begins. DTOs keep
entities behind the API boundary, known domain failures use Problem Details responses, and the
frontend validates the paginated response envelope before exposing it to components.

### Cache Correctness

Short-lived client and server caches reduce duplicate catalogue reads. Server cache entries vary
only by supported query parameters, while successful create, update, and delete operations evict
the tagged catalogue entries so writes cannot leave stale data behind.

### Operational Visibility

`/health` reports process liveness without depending on SQL Server. `/health/ready` verifies
database connectivity, distinguishing a running web process from an application that cannot serve
database-backed requests.

### Automated Quality and Delivery

GitHub Actions verifies .NET formatting and backend tests, then runs frontend linting, a production
build, and frontend tests. Release Please derives Semantic Versions from Conventional Commits.
Merging a reviewed release pull request creates a Git tag and GitHub Release, deploys that exact
version to Azure, and finishes with a production smoke check.

### Reviewable Architecture

The root README explains the complete system and local setup. The focused
[frontend README](../frontend/README.md) and [backend README](../backend/README.md) document layer
boundaries, data flow, trade-offs, testing strategy, and extension points.

## Why These Additions Were Included

The additional work is not required merely to make the two pages function. It was selected to make
the qualities that matter in a maintained application visible during review:

- correctness at API and database boundaries;
- deterministic behaviour under filtering, sorting, paging, and navigation;
- explicit failure and recovery paths;
- repeatable local setup and automated verification;
- traceable, versioned production releases.

The result remains a deliberately small catalogue rather than a larger product with speculative
features. The extra scope is concentrated on reliability, clarity, and operability.

## Reviewer Entry Points

- [Live application](https://gamecatalog-ivashchenko.azurewebsites.net)
- [Swagger UI](https://gamecatalog-ivashchenko.azurewebsites.net/swagger)
- [Main project documentation](../README.md)
- [Frontend architecture](../frontend/README.md)
- [Backend architecture](../backend/README.md)
- [CI workflow](../.github/workflows/ci.yml)
- [Release automation](../.github/workflows/release.yml)
- [Deployment workflow](../.github/workflows/deploy.yml)
