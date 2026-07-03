using System.Linq.Expressions;
using GameCatalog.Api.Contracts;
using GameCatalog.Api.Data;
using GameCatalog.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace GameCatalog.Api.Services;

public class GameService(GameCatalogDbContext db) : IGameService
{
    /// <summary>Projection shared by all read queries; translated to SQL by EF Core.</summary>
    private static readonly Expression<Func<Game, GameDto>> AsGameDto =
        g => new GameDto(g.Id, g.Title, g.Developer, g.ReleaseDate, g.Price, g.GenreId, g.Genre!.Name);

    public async Task<PagedResult<GameDto>> GetAllAsync(
        GameQuery request,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Game> query = db.Games.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            // ToLower makes the search case-insensitive regardless of database collation.
            var pattern = request.Search.Trim().ToLower();
            query = query.Where(g => g.Title.ToLower().Contains(pattern));
        }

        if (!string.IsNullOrWhiteSpace(request.Genre))
        {
            var genre = request.Genre.Trim().ToLower();
            query = query.Where(g => g.Genre!.Name.ToLower() == genre);
        }

        var totalCount = await query.CountAsync(cancellationToken);
        query = ApplySorting(query, request.Sort, request.Order);

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(AsGameDto)
            .ToListAsync(cancellationToken);

        return new PagedResult<GameDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<GameDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        await db.Games.AsNoTracking()
            .Where(g => g.Id == id)
            .Select(AsGameDto)
            .SingleOrDefaultAsync(cancellationToken);

    public async Task<GameDto> CreateAsync(SaveGameRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureGenreExistsAsync(request.GenreId, cancellationToken);

        var game = new Game
        {
            Title = request.Title.Trim(),
            Developer = request.Developer.Trim(),
            ReleaseDate = request.ReleaseDate!.Value,
            Price = request.Price,
            GenreId = request.GenreId,
        };

        db.Games.Add(game);
        await db.SaveChangesAsync(cancellationToken);

        return (await GetByIdAsync(game.Id, cancellationToken))!;
    }

    public async Task<GameDto?> UpdateAsync(int id, SaveGameRequest request, CancellationToken cancellationToken = default)
    {
        var game = await db.Games.FindAsync([id], cancellationToken);
        if (game is null)
        {
            return null;
        }

        await EnsureGenreExistsAsync(request.GenreId, cancellationToken);

        game.Title = request.Title.Trim();
        game.Developer = request.Developer.Trim();
        game.ReleaseDate = request.ReleaseDate!.Value;
        game.Price = request.Price;
        game.GenreId = request.GenreId;

        await db.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(id, cancellationToken);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default) =>
        await db.Games.Where(g => g.Id == id).ExecuteDeleteAsync(cancellationToken) > 0;

    private async Task EnsureGenreExistsAsync(int genreId, CancellationToken cancellationToken)
    {
        if (!await db.Genres.AnyAsync(g => g.Id == genreId, cancellationToken))
        {
            throw new UnknownGenreException(genreId);
        }
    }

    private static IOrderedQueryable<Game> ApplySorting(
        IQueryable<Game> query,
        GameSortField sort,
        SortDirection direction) =>
        (sort, direction) switch
        {
            (GameSortField.Genre, SortDirection.Asc) => query.OrderBy(g => g.Genre!.Name).ThenBy(g => g.Title).ThenBy(g => g.Id),
            (GameSortField.Genre, SortDirection.Desc) => query.OrderByDescending(g => g.Genre!.Name).ThenBy(g => g.Title).ThenBy(g => g.Id),
            (GameSortField.Developer, SortDirection.Asc) => query.OrderBy(g => g.Developer).ThenBy(g => g.Title).ThenBy(g => g.Id),
            (GameSortField.Developer, SortDirection.Desc) => query.OrderByDescending(g => g.Developer).ThenBy(g => g.Title).ThenBy(g => g.Id),
            (GameSortField.ReleaseDate, SortDirection.Asc) => query.OrderBy(g => g.ReleaseDate).ThenBy(g => g.Title).ThenBy(g => g.Id),
            (GameSortField.ReleaseDate, SortDirection.Desc) => query.OrderByDescending(g => g.ReleaseDate).ThenBy(g => g.Title).ThenBy(g => g.Id),
            (GameSortField.Price, SortDirection.Asc) => query.OrderBy(g => g.Price).ThenBy(g => g.Title).ThenBy(g => g.Id),
            (GameSortField.Price, SortDirection.Desc) => query.OrderByDescending(g => g.Price).ThenBy(g => g.Title).ThenBy(g => g.Id),
            (GameSortField.Title, SortDirection.Desc) => query.OrderByDescending(g => g.Title).ThenBy(g => g.Id),
            _ => query.OrderBy(g => g.Title).ThenBy(g => g.Id),
        };
}
