# Shared

`shared` contains reusable building blocks that are independent of a specific routed feature.
Code belongs here only when its reuse or cross-feature role is clear.

## Contents

```text
shared/
├── components/   Reusable presentation and interaction primitives
├── constants/    Application constants shared across layers
├── models/       API and cross-feature TypeScript contracts
└── utils/        Framework adapters and focused utilities
```

## Components

| Component | Responsibility |
| --- | --- |
| `ConfirmModal` | Reusable confirmation dialog opened through `NgbModal` |
| `ErrorAlert` | Consistent Bootstrap error presentation |
| `LoadingSpinner` | Consistent loading state |
| `ToastContainer` | Root-level rendering of notifications from `ToastService` |

Shared components should expose small, typed inputs or a narrow integration contract. They
must not know about games routes or games-specific workflows.

## Models

The models describe the JSON boundary shared by features and the API client:

- `Game` and `SaveGameRequest` describe catalogue data and mutations.
- `Genre` describes reference data.
- `GameQuery`, sort types, and `PagedGames` describe catalogue querying.

These interfaces provide compile-time safety. Runtime validation remains appropriate at
external boundaries where TypeScript types cannot guarantee the received JSON shape.

## Utilities

`IsoStringDateAdapter` translates between ng-bootstrap date structures and the ISO
`yyyy-MM-dd` strings used by the API. Keeping this conversion in an adapter prevents date
format logic from leaking into the form component.

## Rules

- Shared code must not import from a feature.
- Avoid catch-all utility files and unrelated barrel exports.
- Prefer focused files with explicit public types.
- Keep domain decisions inside features or the backend.
- Add tests for reusable behaviour because defects here affect multiple consumers.
