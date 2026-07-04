# Core

`core` contains application-wide infrastructure with one logical instance for the running
frontend. It is not a location for generic helpers or feature-specific business logic.

## Contents

```text
core/
├── api/
│   └── game-api.ts
└── services/
    └── toast.service.ts
```

### API Client

`GameApi` is the typed HTTP boundary for the frontend. It is responsible for:

- constructing `/api` endpoints and query parameters;
- mapping frontend query state to the backend contract;
- returning typed RxJS observables;
- validating the paginated response envelope at runtime.

Catalogue queries are cached for 60 seconds by a normalized key containing search, genre,
sorting, direction, page, and page size. The cache uses `shareReplay` to coalesce concurrent
requests and is limited to 50 least-recently-used entries. Genre lookups use a separate
10-minute cache. Successful create, update, and delete requests invalidate all cached game
queries immediately.

Components should call `GameApi` rather than inject `HttpClient` directly. This keeps transport
details centralized and makes components straightforward to test with a mock API.

### Toast Service

`ToastService` stores transient success and error notifications in a signal. The root
application renders those notifications through the shared toast container, which keeps feature
components independent from notification markup.

## Rules

- Services in this area use `providedIn: 'root'` when they represent application singletons.
- Core code may use shared contracts and utilities.
- Core code must not import from `features`.
- Domain workflows and page state belong to the owning feature.
- New API methods should expose typed request and response models and have HTTP tests.
