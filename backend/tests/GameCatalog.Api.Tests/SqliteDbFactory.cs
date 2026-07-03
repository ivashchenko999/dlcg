using GameCatalog.Api.Data;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace GameCatalog.Api.Tests;

/// <summary>
/// Provides DbContexts backed by a shared in-memory SQLite database, which
/// exercises real SQL (unlike the EF InMemory provider). The database lives
/// for as long as the connection is open, i.e. for one test.
/// </summary>
public sealed class SqliteDbFactory : IDisposable
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");

    public SqliteDbFactory()
    {
        _connection.Open();
        using var context = CreateContext();
        context.Database.EnsureCreated(); // also applies the genre seed data
    }

    public GameCatalogDbContext CreateContext() => new(
        new DbContextOptionsBuilder<GameCatalogDbContext>()
            .UseSqlite(_connection)
            .Options);

    public void Dispose() => _connection.Dispose();
}
