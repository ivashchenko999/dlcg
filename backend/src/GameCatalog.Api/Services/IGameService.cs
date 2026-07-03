using GameCatalog.Api.Contracts;

namespace GameCatalog.Api.Services;

public interface IGameService
{
    Task<PagedResult<GameDto>> GetAllAsync(GameQuery query, CancellationToken cancellationToken = default);

    Task<GameDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <exception cref="UnknownGenreException">The requested genre does not exist.</exception>
    Task<GameDto> CreateAsync(SaveGameRequest request, CancellationToken cancellationToken = default);

    /// <returns>The updated game, or <c>null</c> when no game with the given id exists.</returns>
    /// <exception cref="UnknownGenreException">The requested genre does not exist.</exception>
    Task<GameDto?> UpdateAsync(int id, SaveGameRequest request, CancellationToken cancellationToken = default);

    /// <returns><c>true</c> when a game was deleted, <c>false</c> when it did not exist.</returns>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}
