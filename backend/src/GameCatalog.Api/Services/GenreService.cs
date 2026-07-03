using GameCatalog.Api.Contracts;
using GameCatalog.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace GameCatalog.Api.Services;

public class GenreService(GameCatalogDbContext db) : IGenreService
{
    public async Task<IReadOnlyList<GenreDto>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await db.Genres.AsNoTracking()
            .OrderBy(g => g.Name)
            .Select(g => new GenreDto(g.Id, g.Name))
            .ToListAsync(cancellationToken);
}
