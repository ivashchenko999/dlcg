# Video Game Catalogue

[![CI](https://github.com/ivashchenko999/dlcg/actions/workflows/ci.yml/badge.svg)](https://github.com/ivashchenko999/dlcg/actions/workflows/ci.yml)
[![Deploy](https://github.com/ivashchenko999/dlcg/actions/workflows/deploy.yml/badge.svg)](https://github.com/ivashchenko999/dlcg/actions/workflows/deploy.yml)

**Live demo:** https://gamecatalog-ivashchenko.azurewebsites.net
(Azure App Service + Azure SQL Database; deployed automatically from `main` by GitHub Actions.
Hosted on free tiers — the first request after a period of inactivity may take a few seconds
while the serverless database resumes.)

A full-stack catalogue application for browsing and maintaining video game data. The project
combines a modern Angular frontend with a typed ASP.NET Core API, server-side filtering,
deterministic sorting, pagination, validation, and automated tests.

## Naming

The repository contains a single product with names appropriate to each technical context:

| Name | Meaning |
| --- | --- |
| `dlcg` | Git repository name |
| **Video Game Catalogue** | User-facing product name |
| `GameCatalog.Api` | .NET project and assembly name |
| `game-catalog` | npm package and Angular workspace project name |

These are not separate applications; they are identifiers for the same system at different
layers.

## Highlights

- Search games by title with debounced, cancellable requests.
- Filter the catalogue by genre.
- Sort by title, genre, developer, release date, or price, with the active column highlighted.
- Perform filtering, sorting, and pagination on the server against indexed columns.
- Cache catalogue responses server-side and invalidate the cache on every write.
- Preserve catalogue state in shareable URL query parameters.
- Create, edit, and delete games with client- and server-side validation.
- Restore state correctly with browser Back and Forward navigation.
- Display reusable confirmation dialogs, toast notifications, loading states, and errors.
- Handle invalid routes with a dedicated lazy-loaded 404 page.
- Validate API responses at the frontend boundary.
- Run backend and frontend checks through GitHub Actions.
- Deploy continuously to Azure with a post-deployment smoke check.

## Technology

| Area | Technology |
| --- | --- |
| Frontend | Angular 22, TypeScript 6, RxJS 7.8 |
| UI | Bootstrap 5.3, ng-bootstrap 21, Bootstrap Icons |
| Backend | ASP.NET Core Web API on .NET 10 |
| Data | Entity Framework Core 10, SQL Server, Code First migrations |
| Backend tests | xUnit with relational in-memory SQLite |
| Frontend tests | Vitest through the Angular test builder |
| CI | GitHub Actions on Ubuntu, Node.js 22, and .NET 10 |

## Frontend Design

The Angular application uses standalone components and a feature-oriented structure:

- **Signals** hold local view state such as loading, errors, filters, and API results.
- **Reactive Forms** provide typed create/edit form state and validation.
- **Angular Router** lazy-loads feature routes and synchronizes catalogue state with the URL.
- **RxJS `switchMap`** cancels stale catalogue requests when filters change rapidly.
- **Strict TypeScript and Angular templates** are enabled in `tsconfig.json`.
- **Path aliases** keep cross-layer imports readable (`@core` and `@shared`).
- **Shared components** centralize confirmation, toast, error, and loading behaviour.

A catalogue URL can be bookmarked or shared without losing its state:

```text
/games?q=witcher&genre=RPG&sort=price&order=desc&page=2
```

## Backend Design

The API is separated into controllers, contracts, services, entities, and data access:

- Controllers own HTTP routing and model binding.
- Contracts define typed request and response boundaries.
- Services contain query composition and catalogue operations.
- EF Core translates filters, sorting, projection, and pagination to SQL.
- Every sortable column is covered by a database index.
- Every paginated sort uses a unique `Id` tie-breaker for deterministic results.
- Data annotations reject invalid paging, oversized filters, and invalid game payloads
  before service execution.
- Output caching stores catalogue reads for 60 seconds and genres for 10 minutes; every
  create, update, and delete evicts the affected cache entries by tag.
- Domain errors are returned as standardized Problem Details responses.
- Cancellation tokens flow from HTTP requests into EF Core operations.

In Development, the backend applies migrations and seeds sample catalogue data automatically.

## Repository Structure

```text
dlcg/
├── backend/
│   ├── src/GameCatalog.Api/
│   │   ├── Contracts/          API requests, responses, and query models
│   │   ├── Controllers/        HTTP endpoints
│   │   ├── Data/               DbContext, migrations, and seed data
│   │   ├── Entities/           EF Core entities
│   │   ├── Infrastructure/     Global exception handling
│   │   └── Services/           Application and query logic
│   └── tests/GameCatalog.Api.Tests/
├── frontend/
│   └── src/app/
│       ├── core/               API clients and application-wide services
│       ├── features/           Lazy-loaded application features
│       └── shared/             Reusable components, models, constants, and utilities
└── .github/workflows/     CI and Azure deployment pipelines
```

### Architecture Knowledge Map

- [Backend domain](backend/README.md)
- [Frontend domain](frontend/README.md)
- [Frontend core](frontend/src/app/core/README.md)
- [Frontend features](frontend/src/app/features/README.md)
- [Games feature](frontend/src/app/features/games/README.md)
- [Frontend shared layer](frontend/src/app/shared/README.md)

## Installation

The application requires the .NET 10 SDK, Node.js 22, npm, and SQL Server. The setup differs
slightly between macOS and Windows.

### macOS on Apple Silicon

The following instructions are intended for M-series Macs (`arm64`).

1. Install [Homebrew](https://brew.sh/) if it is not already available:

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

   Follow the **Next steps** printed by the installer to add Homebrew to the shell environment.

2. Install the development tools:

   ```bash
   brew install node@22
   brew install --cask dotnet-sdk
   brew install --cask docker
   npm install --global npm@11
   ```

   Start Docker Desktop once the installation completes.

3. Verify the toolchain:

   ```bash
   dotnet --version
   node --version
   npm --version
   docker --version
   ```

4. Clone the repository and restore frontend dependencies:

   ```bash
   git clone https://github.com/ivashchenko999/dlcg.git
   cd dlcg
   npm ci --prefix frontend
   ```

5. Start SQL Server. The SQL Server 2022 image is an `amd64` image, so Apple Silicon uses
   Docker's architecture emulation explicitly:

   ```bash
   docker run -d --name gamecatalog-sql \
     --platform linux/amd64 \
     -e ACCEPT_EULA=Y \
     -e MSSQL_SA_PASSWORD=DevPassword_123 \
     -p 1433:1433 \
     mcr.microsoft.com/mssql/server:2022-latest
   ```

6. Create the ignored file `backend/src/GameCatalog.Api/appsettings.Local.json`:

   ```json
   {
     "ConnectionStrings": {
       "GameCatalog": "Server=localhost,1433;Database=GameCatalog;User Id=sa;Password=DevPassword_123;TrustServerCertificate=True"
     }
   }
   ```

7. Start the backend from the repository root:

   ```bash
   dotnet run --project backend/src/GameCatalog.Api
   ```

8. Start the frontend in a second terminal:

   ```bash
   cd dlcg
   npm start --prefix frontend
   ```

### Windows

1. Install the following tools:

   - [.NET 10 SDK](https://dotnet.microsoft.com/download)
   - [Node.js 22](https://nodejs.org/)
   - [Git for Windows](https://git-scm.com/download/win)
   - [SQL Server 2022 Express](https://www.microsoft.com/sql-server/sql-server-downloads)

   SQL Server Management Studio is optional but useful for inspecting the local database.

2. Open PowerShell and verify the toolchain:

   ```powershell
   dotnet --version
   node --version
   npm --version
   git --version
   ```

3. Clone the repository and restore frontend dependencies:

   ```powershell
   git clone https://github.com/ivashchenko999/dlcg.git
   cd dlcg
   npm ci --prefix frontend
   ```

4. Confirm that the `SQLEXPRESS` service is running. The tracked configuration already uses
   the default Windows instance:

   ```text
   Server=.\SQLEXPRESS;Database=GameCatalog;Trusted_Connection=True
   ```

   If SQL Server uses another instance, create
   `backend\src\GameCatalog.Api\appsettings.Local.json` with the appropriate connection string.

5. Start the backend from the repository root:

   ```powershell
   dotnet run --project .\backend\src\GameCatalog.Api
   ```

6. Start the frontend in a second PowerShell window:

   ```powershell
   cd path\to\dlcg
   npm start --prefix frontend
   ```

### Verify the Installation

The backend applies EF Core migrations and inserts sample data automatically when it starts in
Development. No manual database initialization is required.

| Service | URL |
| --- | --- |
| Angular application | `http://localhost:4200` |
| ASP.NET Core API | `http://localhost:5161` |
| Swagger UI | `http://localhost:5161/swagger` |

The Angular development server proxies `/api` requests to the backend through
`frontend/proxy.conf.json`.

To stop the macOS SQL Server container later, run `docker stop gamecatalog-sql`. Start it again
with `docker start gamecatalog-sql`.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/games` | Search, filter, sort, and paginate games |
| `GET` | `/api/games/{id}` | Retrieve one game |
| `POST` | `/api/games` | Create a game |
| `PUT` | `/api/games/{id}` | Update a game |
| `DELETE` | `/api/games/{id}` | Delete a game |
| `GET` | `/api/genres` | Retrieve the genre reference data |

### Catalogue Query

`GET /api/games` accepts the following query parameters:

| Parameter | Description | Default |
| --- | --- | --- |
| `search` | Case-insensitive title search, up to 200 characters | Empty |
| `genre` | Exact, case-insensitive genre name, up to 100 characters | Empty |
| `sort` | `title`, `genre`, `developer`, `releaseDate`, or `price` | `title` |
| `order` | `asc` or `desc` | `asc` |
| `page` | One-based page number, from 1 to 10 000 | `1` |
| `pageSize` | Number of records, from 1 to 100 | `10` |

Example:

```http
GET /api/games?search=witcher&genre=RPG&sort=price&order=desc&page=1&pageSize=10
```

Paginated response:

```json
{
  "items": [],
  "totalCount": 0,
  "page": 1,
  "pageSize": 10
}
```

## Validation and Error Handling

- Title, developer, release date, and genre are required.
- Title and developer are limited to 200 characters and cannot contain only whitespace.
- Price must be between `0` and `10000`.
- Page and page-size values are bounded before query execution.
- Search and genre filters are rejected when they exceed the stored column lengths.
- Invalid requests use ASP.NET Core validation Problem Details.
- Unknown genre references return HTTP `400`.
- Missing games return HTTP `404`.

## Tests

Run backend tests:

```bash
cd backend
dotnet test
```

The service tests use in-memory SQLite rather than the EF Core InMemory provider, so query
translation and relational behaviour are exercised without requiring SQL Server.

Run frontend tests once:

```bash
cd frontend
npm run test:ci
```

Run the complete frontend quality gate:

```bash
cd frontend
npm run check
```

## Continuous Integration

The CI workflow verifies .NET formatting and backend tests, then runs strict Angular ESLint,
the frontend production build, and frontend tests. It runs on every pull request update and every
push to `main`.

## Deployment

Every push to `main` also triggers the deploy workflow, which:

1. Re-runs the frontend quality gate and backend tests.
2. Publishes the API and bundles the Angular production build into its `wwwroot`.
3. Deploys the combined package to Azure App Service.
4. Verifies the live application with an HTTP smoke check.

The demo runs on Azure App Service with a serverless Azure SQL database, both on free tiers.
The API serves the Angular application itself, so one site hosts the whole product:

| Resource | URL |
| --- | --- |
| Application | https://gamecatalog-ivashchenko.azurewebsites.net |
| Swagger UI | https://gamecatalog-ivashchenko.azurewebsites.net/swagger |
| Health probe | https://gamecatalog-ivashchenko.azurewebsites.net/health |

Swagger UI stays enabled in production intentionally: the demo API is public, unauthenticated
sample data, and interactive documentation makes the assignment easier to review.
