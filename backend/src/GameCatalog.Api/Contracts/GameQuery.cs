using System.ComponentModel.DataAnnotations;

namespace GameCatalog.Api.Contracts;

public enum GameSortField
{
    Title,
    Genre,
    Developer,
    ReleaseDate,
    Price,
}

public enum SortDirection
{
    Asc,
    Desc,
}

public sealed class GameQuery
{
    [StringLength(200)]
    public string? Search { get; init; }

    [StringLength(100)]
    public string? Genre { get; init; }

    public GameSortField Sort { get; init; } = GameSortField.Title;

    public SortDirection Order { get; init; } = SortDirection.Asc;

    [Range(1, 10_000)]
    public int Page { get; init; } = 1;

    [Range(1, 100)]
    public int PageSize { get; init; } = 10;
}
