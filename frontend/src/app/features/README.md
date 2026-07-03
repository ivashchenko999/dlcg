# Features

`features` contains user-facing product capabilities. A feature owns its routes, page
components, local state, and feature-specific orchestration.

## Current Features

| Feature | Responsibility |
| --- | --- |
| `games` | Browse, search, filter, sort, create, edit, and delete games |
| `not-found` | Present a recoverable page for unknown application routes |

## Routing

The root router lazy-loads the games route collection. Individual games pages are also loaded
on demand. The wildcard route loads the 404 component rather than silently redirecting users.

Feature route files belong inside the feature. Root routing should only compose top-level
capabilities and application-wide fallbacks.

## Rules

- A feature may import from `core` and `shared`.
- One feature must not reach into another feature's internal folders.
- Feature-specific models and helpers should remain local until a real second consumer exists.
- Route state should be serializable when users benefit from bookmarking or sharing it.
- Page components coordinate work; reusable visual primitives belong in `shared/components`.
- Tests should cover URL restoration, user-visible state transitions, and failure paths.
