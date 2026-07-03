using GameCatalog.Api.Contracts;

namespace GameCatalog.Api.Services;

public interface IGenreService
{
    Task<IReadOnlyList<GenreDto>> GetAllAsync(CancellationToken cancellationToken = default);
}
