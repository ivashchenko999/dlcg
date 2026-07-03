using GameCatalog.Api.Contracts;
using GameCatalog.Api.Entities;
using GameCatalog.Api.Services;

namespace GameCatalog.Api.Tests;

public class GameServiceTests : IDisposable
{
    private const int ActionGenreId = 1;
    private const int RpgGenreId = 3;

    private readonly SqliteDbFactory _dbFactory = new();

    public void Dispose() => _dbFactory.Dispose();

    [Fact]
    public async Task GetAllAsync_ReturnsGamesOrderedByTitle()
    {
        await AddGamesAsync(
            new Game { Title = "Zelda", Developer = "Nintendo", GenreId = ActionGenreId },
            new Game { Title = "Anno 1800", Developer = "Ubisoft", GenreId = ActionGenreId });
        var service = CreateService();

        var games = await service.GetAllAsync();

        Assert.Equal(["Anno 1800", "Zelda"], games.Select(g => g.Title));
    }

    [Fact]
    public async Task GetAllAsync_WithSearch_FiltersByTitle()
    {
        await AddGamesAsync(
            new Game { Title = "The Witcher 3", Developer = "CDPR", GenreId = RpgGenreId },
            new Game { Title = "Hades", Developer = "Supergiant", GenreId = ActionGenreId });
        var service = CreateService();

        var games = await service.GetAllAsync(search: "witch");

        var game = Assert.Single(games);
        Assert.Equal("The Witcher 3", game.Title);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsGameWithGenreName()
    {
        var seeded = await AddGamesAsync(
            new Game { Title = "Hades", Developer = "Supergiant", ReleaseDate = new DateOnly(2020, 9, 17), Price = 24.99m, GenreId = ActionGenreId });
        var service = CreateService();

        var game = await service.GetByIdAsync(seeded[0].Id);

        Assert.NotNull(game);
        Assert.Equal("Hades", game.Title);
        Assert.Equal("Action", game.GenreName);
        Assert.Equal(24.99m, game.Price);
    }

    [Fact]
    public async Task GetByIdAsync_UnknownId_ReturnsNull()
    {
        var service = CreateService();

        Assert.Null(await service.GetByIdAsync(12345));
    }

    [Fact]
    public async Task CreateAsync_PersistsGame_AndReturnsDto()
    {
        var service = CreateService();
        var request = new SaveGameRequest
        {
            Title = "  Baldur's Gate 3  ",
            Developer = "Larian Studios",
            ReleaseDate = new DateOnly(2023, 8, 3),
            Price = 59.99m,
            GenreId = RpgGenreId,
        };

        var created = await service.CreateAsync(request);

        Assert.True(created.Id > 0);
        Assert.Equal("Baldur's Gate 3", created.Title); // input is trimmed
        Assert.Equal("RPG", created.GenreName);

        using var db = _dbFactory.CreateContext();
        Assert.Equal(1, db.Games.Count());
    }

    [Fact]
    public async Task CreateAsync_UnknownGenre_Throws()
    {
        var service = CreateService();
        var request = ValidRequest();
        request.GenreId = 999;

        await Assert.ThrowsAsync<UnknownGenreException>(() => service.CreateAsync(request));
    }

    [Fact]
    public async Task UpdateAsync_ChangesAllEditableFields()
    {
        var seeded = await AddGamesAsync(
            new Game { Title = "Old Title", Developer = "Old Dev", Price = 10m, GenreId = ActionGenreId });
        var service = CreateService();
        var request = new SaveGameRequest
        {
            Title = "New Title",
            Developer = "New Dev",
            ReleaseDate = new DateOnly(2024, 1, 1),
            Price = 19.99m,
            GenreId = RpgGenreId,
        };

        var updated = await service.UpdateAsync(seeded[0].Id, request);

        Assert.NotNull(updated);
        Assert.Equal("New Title", updated.Title);
        Assert.Equal("New Dev", updated.Developer);
        Assert.Equal(new DateOnly(2024, 1, 1), updated.ReleaseDate);
        Assert.Equal(19.99m, updated.Price);
        Assert.Equal("RPG", updated.GenreName);
    }

    [Fact]
    public async Task UpdateAsync_UnknownId_ReturnsNull()
    {
        var service = CreateService();

        Assert.Null(await service.UpdateAsync(12345, ValidRequest()));
    }

    [Fact]
    public async Task DeleteAsync_RemovesGame()
    {
        var seeded = await AddGamesAsync(
            new Game { Title = "Hades", Developer = "Supergiant", GenreId = ActionGenreId });
        var service = CreateService();

        var deleted = await service.DeleteAsync(seeded[0].Id);

        Assert.True(deleted);
        using var db = _dbFactory.CreateContext();
        Assert.Empty(db.Games);
    }

    [Fact]
    public async Task DeleteAsync_UnknownId_ReturnsFalse()
    {
        var service = CreateService();

        Assert.False(await service.DeleteAsync(12345));
    }

    private GameService CreateService() => new(_dbFactory.CreateContext());

    private async Task<List<Game>> AddGamesAsync(params Game[] games)
    {
        using var db = _dbFactory.CreateContext();
        db.Games.AddRange(games);
        await db.SaveChangesAsync();
        return [.. games];
    }

    private static SaveGameRequest ValidRequest() => new()
    {
        Title = "Some Game",
        Developer = "Some Developer",
        ReleaseDate = new DateOnly(2024, 1, 1),
        Price = 9.99m,
        GenreId = ActionGenreId,
    };
}
