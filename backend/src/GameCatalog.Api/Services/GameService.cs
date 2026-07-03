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

    public async Task<IReadOnlyList<GameDto>> GetAllAsync(string? search = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Game> query = db.Games.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(g => g.Title.Contains(search));
        }

        return await query
            .OrderBy(g => g.Title)
            .Select(AsGameDto)
            .ToListAsync(cancellationToken);
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
            ReleaseDate = request.ReleaseDate,
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
        game.ReleaseDate = request.ReleaseDate;
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
}
