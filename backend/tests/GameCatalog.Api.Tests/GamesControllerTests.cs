using GameCatalog.Api.Contracts;
using GameCatalog.Api.Controllers;
using GameCatalog.Api.Services;
using Microsoft.AspNetCore.OutputCaching;

namespace GameCatalog.Api.Tests;

public class GamesControllerTests
{
    [Fact]
    public async Task Create_UsesServerOwnedTokenForPostCommitCacheEviction()
    {
        var cache = new RecordingOutputCacheStore();
        var controller = new GamesController(new SuccessfulGameService(), cache);
        using var requestCancellation = new CancellationTokenSource();
        requestCancellation.Cancel();

        await controller.Create(new SaveGameRequest(), requestCancellation.Token);

        Assert.Equal("games", cache.EvictedTag);
        Assert.False(cache.EvictionToken.CanBeCanceled);
    }

    private sealed class RecordingOutputCacheStore : IOutputCacheStore
    {
        public string? EvictedTag { get; private set; }
        public CancellationToken EvictionToken { get; private set; }

        public ValueTask EvictByTagAsync(string tag, CancellationToken cancellationToken)
        {
            EvictedTag = tag;
            EvictionToken = cancellationToken;
            return ValueTask.CompletedTask;
        }

        public ValueTask<byte[]?> GetAsync(string key, CancellationToken cancellationToken) =>
            ValueTask.FromResult<byte[]?>(null);

        public ValueTask SetAsync(
            string key,
            byte[] value,
            string[]? tags,
            TimeSpan validFor,
            CancellationToken cancellationToken) => ValueTask.CompletedTask;
    }

    private sealed class SuccessfulGameService : IGameService
    {
        private static readonly GameDto Game = new(
            1, "Game", "Developer", new DateOnly(2024, 1, 1), 10m, 1, "Action");

        public Task<GameDto> CreateAsync(
            SaveGameRequest request,
            CancellationToken cancellationToken = default) => Task.FromResult(Game);

        public Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default) =>
            Task.FromResult(true);

        public Task<PagedResult<GameDto>> GetAllAsync(
            GameQuery query,
            CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();

        public Task<GameDto?> GetByIdAsync(
            int id,
            CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();

        public Task<GameDto?> UpdateAsync(
            int id,
            SaveGameRequest request,
            CancellationToken cancellationToken = default) =>
            throw new NotSupportedException();
    }
}
