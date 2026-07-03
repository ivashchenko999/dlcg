# Games Feature

The games feature is the primary business capability of the frontend. It owns catalogue
browsing and game maintenance routes.

## Routes

| Route | Component | Purpose |
| --- | --- | --- |
| `/games` | `GamesList` | Browse and manage the catalogue |
| `/games/new` | `GameForm` | Create a game |
| `/games/:id/edit` | `GameForm` | Edit an existing game |

## Catalogue Flow

```text
URL query parameters
        ↓
ActivatedRoute → typed GameQuery → GameApi
        ↓                            ↓
Angular view ← PagedGames ← ASP.NET Core API
```

The URL is the source of truth for catalogue state:

| URL parameter | Frontend meaning |
| --- | --- |
| `q` | Search text |
| `genre` | Selected genre |
| `sort` | Active sort field |
| `order` | Ascending or descending order |
| `page` | Current one-based page |

Default values are omitted to keep URLs concise. Search navigation uses `replaceUrl` so each
keystroke does not create a browser-history entry. Genre, sorting, and page changes remain
navigable with Back and Forward.

`switchMap` cancels stale catalogue requests. If a page becomes invalid after deletion or a
direct URL requests a page beyond the result set, the component navigates to the last valid
page.

## Form Flow

`GameForm` serves both create and edit routes. The route-bound `id` determines the mode. The
Reactive Form mirrors backend constraints for required fields, whitespace, length, price, date,
and genre. Save remains disabled while the form is invalid or a request is in progress.

The backend remains authoritative: frontend validation improves UX but does not replace API
validation.

## Failure Handling

- Catalogue request failures display an error and stop the loading state.
- Genre lookup failures disable the filter and expose a retry action.
- Save failures preserve form values and allow another attempt.
- Delete failures produce an error toast.
- Unexpected paginated response shapes are rejected by the API client.

## Extension Points

When extending this feature:

- add server-supported filters to `GameQuery` and URL parsing together;
- keep sort fields synchronized with the backend enum;
- reset the page when a filter changes;
- preserve deterministic server ordering for pagination;
- add Router tests for new query-string behaviour.
