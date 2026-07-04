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

        var result = await service.GetAllAsync(new GameQuery());

        Assert.Equal(["Anno 1800", "Zelda"], result.Items.Select(g => g.Title));
        Assert.Equal(2, result.TotalCount);
    }

    [Fact]
    public async Task GetAllAsync_WithSearch_FiltersByTitle()
    {
        await AddGamesAsync(
            new Game { Title = "The Witcher 3", Developer = "CDPR", GenreId = RpgGenreId },
            new Game { Title = "Hades", Developer = "Supergiant", GenreId = ActionGenreId });
        var service = CreateService();

        var result = await service.GetAllAsync(new GameQuery { Search = "witch" });

        var game = Assert.Single(result.Items);
        Assert.Equal("The Witcher 3", game.Title);
    }

    [Fact]
    public async Task GetAllAsync_FiltersByGenreBeforePaging()
    {
        await AddGamesAsync(
            new Game { Title = "Hades", Developer = "Supergiant", GenreId = ActionGenreId },
            new Game { Title = "The Witcher 3", Developer = "CDPR", GenreId = RpgGenreId });
        var service = CreateService();

        var result = await service.GetAllAsync(new GameQuery { Genre = "rpg", PageSize = 1 });

        var game = Assert.Single(result.Items);
        Assert.Equal("The Witcher 3", game.Title);
        Assert.Equal(1, result.TotalCount);
    }

    [Fact]
    public async Task GetAllAsync_SortsByPriceDescendingAndReturnsRequestedPage()
    {
        await AddGamesAsync(
            new Game { Title = "Budget", Developer = "A", Price = 10m, GenreId = ActionGenreId },
            new Game { Title = "Premium", Developer = "B", Price = 60m, GenreId = ActionGenreId },
            new Game { Title = "Standard", Developer = "C", Price = 30m, GenreId = ActionGenreId });
        var service = CreateService();

        var result = await service.GetAllAsync(new GameQuery
        {
            Sort = GameSortField.Price,
            Order = SortDirection.Desc,
            Page = 2,
            PageSize = 1,
        });

        var game = Assert.Single(result.Items);
        Assert.Equal("Standard", game.Title);
        Assert.Equal(3, result.TotalCount);
        Assert.Equal(2, result.Page);
    }

    [Theory]
    [InlineData(GameSortField.Title, SortDirection.Asc, new[] { "Alpha", "Beta", "Gamma" })]
    [InlineData(GameSortField.Title, SortDirection.Desc, new[] { "Gamma", "Beta", "Alpha" })]
    [InlineData(GameSortField.Developer, SortDirection.Asc, new[] { "Gamma", "Alpha", "Beta" })]
    [InlineData(GameSortField.Developer, SortDirection.Desc, new[] { "Beta", "Alpha", "Gamma" })]
    [InlineData(GameSortField.ReleaseDate, SortDirection.Asc, new[] { "Beta", "Gamma", "Alpha" })]
    [InlineData(GameSortField.ReleaseDate, SortDirection.Desc, new[] { "Alpha", "Gamma", "Beta" })]
    [InlineData(GameSortField.Price, SortDirection.Asc, new[] { "Gamma", "Alpha", "Beta" })]
    [InlineData(GameSortField.Price, SortDirection.Desc, new[] { "Beta", "Alpha", "Gamma" })]
    [InlineData(GameSortField.Genre, SortDirection.Asc, new[] { "Beta", "Gamma", "Alpha" })]
    [InlineData(GameSortField.Genre, SortDirection.Desc, new[] { "Alpha", "Gamma", "Beta" })]
    public async Task GetAllAsync_SortsByEveryFieldInBothDirections(
        GameSortField sort,
        SortDirection order,
        string[] expectedTitles)
    {
        // "Aardvark" sorts before "Action" while its id sorts after every seeded
        // genre id, so the Genre cases fail if sorting regresses to GenreId.
        await AddGenreAsync(7, "Aardvark");
        await AddGamesAsync(
            new Game { Title = "Alpha", Developer = "M Dev", ReleaseDate = new DateOnly(2023, 1, 1), Price = 20m, GenreId = RpgGenreId },
            new Game { Title = "Beta", Developer = "Z Dev", ReleaseDate = new DateOnly(2021, 1, 1), Price = 30m, GenreId = 7 },
            new Game { Title = "Gamma", Developer = "A Dev", ReleaseDate = new DateOnly(2022, 1, 1), Price = 10m, GenreId = ActionGenreId });
        var service = CreateService();

        var result = await service.GetAllAsync(new GameQuery { Sort = sort, Order = order });

        Assert.Equal(expectedTitles, result.Items.Select(g => g.Title));
    }

    [Fact]
    public async Task GetAllAsync_UsesIdAsStableSortTieBreaker()
    {
        var seeded = await AddGamesAsync(
            new Game { Title = "Same", Developer = "Studio", Price = 20m, GenreId = ActionGenreId },
            new Game { Title = "Same", Developer = "Studio", Price = 20m, GenreId = ActionGenreId });
        var service = CreateService();

        var result = await service.GetAllAsync(new GameQuery
        {
            Sort = GameSortField.Price,
            PageSize = 10,
        });

        Assert.Equal(seeded.Select(game => game.Id), result.Items.Select(game => game.Id));
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
    public async Task UpdateAsync_UnknownGenre_ThrowsAndLeavesGameUnchanged()
    {
        var seeded = await AddGamesAsync(
            new Game { Title = "Hades", Developer = "Supergiant", GenreId = ActionGenreId });
        var service = CreateService();
        var request = ValidRequest();
        request.GenreId = 999;

        await Assert.ThrowsAsync<UnknownGenreException>(() => service.UpdateAsync(seeded[0].Id, request));

        using var db = _dbFactory.CreateContext();
        var game = db.Games.Single();
        Assert.Equal("Hades", game.Title);
        Assert.Equal(ActionGenreId, game.GenreId);
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

    private async Task AddGenreAsync(int id, string name)
    {
        using var db = _dbFactory.CreateContext();
        db.Genres.Add(new Genre { Id = id, Name = name });
        await db.SaveChangesAsync();
    }

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
