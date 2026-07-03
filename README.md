# Video Game Catalogue

A simple two-page catalogue for video games: a browsing page (search, pagination, delete) and a create/edit page.

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Backend  | ASP.NET Core Web API (.NET 10), EF Core (SQL Server, Code First) |
| Frontend | Angular 22, Angular Router, ng-bootstrap / Bootstrap 5 |
| Tests    | xUnit + EF Core on in-memory SQLite |

## Repository Layout

```
backend/
  src/GameCatalog.Api/          ASP.NET Core Web API
  tests/GameCatalog.Api.Tests/  unit tests
frontend/                       Angular application
```

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org) 20+
- SQL Server — any edition:
  - **Windows:** SQL Server Express (the default connection string targets `.\SQLEXPRESS`)
  - **macOS/Linux:** run it in Docker:

    ```bash
    docker run -d --name gamecatalog-sql \
      -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD=DevPassword_123 \
      -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest
    ```

## Running the Backend

```bash
cd backend
dotnet run --project src/GameCatalog.Api
```

On startup (Development environment) the API applies EF Core migrations and seeds sample data, so no manual database setup is needed.

- API base URL: `http://localhost:5161`
- Swagger UI: `http://localhost:5161/swagger`

### Connection string

The default connection string (in `appsettings.json`) targets `.\SQLEXPRESS` with Windows authentication. To point elsewhere without touching tracked files, create `src/GameCatalog.Api/appsettings.Local.json` (gitignored):

```json
{
  "ConnectionStrings": {
    "GameCatalog": "Server=localhost,1433;Database=GameCatalog;User Id=sa;Password=DevPassword_123;TrustServerCertificate=True"
  }
}
```

## Running the Frontend

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200`. The dev server proxies `/api` requests to the backend (see `proxy.conf.json`), so no CORS or environment configuration is needed.

## Running the Tests

Backend (xUnit — service layer against an in-memory SQLite database, so real SQL runs without a SQL Server instance):

```bash
cd backend
dotnet test
```

Frontend (Vitest — API service, toast service and date adapter):

```bash
cd frontend
npm test
```

Both suites also run in CI on every push (see `.github/workflows/ci.yml`).

## API Overview

| Method | Route                  | Description |
|--------|------------------------|-------------|
| GET    | `/api/games`           | Search, filter, sort and paginate games  |
| GET    | `/api/games/{id}`      | Get a single game |
| POST   | `/api/games`           | Create a game |
| PUT    | `/api/games/{id}`      | Update a game |
| DELETE | `/api/games/{id}`      | Delete a game |
| GET    | `/api/genres`          | List genres (for the edit form dropdown) |

The games endpoint accepts `search`, `genre`, `sort`, `order`, `page`, and
`pageSize` query parameters. For example:

```text
GET /api/games?genre=RPG&sort=price&order=desc&page=1&pageSize=10
```

Supported sort fields are `title`, `genre`, `developer`, `releaseDate`, and
`price`. The response includes `items`, `totalCount`, `page`, and `pageSize`.
