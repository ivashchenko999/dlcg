# Video Game Catalogue

A simple two-page catalogue for video games: a browsing page and an editing page.

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Backend  | ASP.NET Core Web API (.NET 10), EF Core (SQL Server, Code First) |
| Frontend | Angular (latest), Angular Router, ng-bootstrap |
| Tests    | xUnit |

## Repository Layout

```
backend/    ASP.NET Core Web API + unit tests
frontend/   Angular application
```

## Getting Started

> Detailed setup instructions will be completed as the project takes shape.

### Backend

```bash
cd backend
dotnet run --project src/GameCatalog.Api
```

The API applies EF Core migrations and seeds sample data on startup.

### Frontend

```bash
cd frontend
npm install
npm start
```

### Tests

```bash
cd backend
dotnet test
```
