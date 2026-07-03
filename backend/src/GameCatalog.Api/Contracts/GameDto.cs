namespace GameCatalog.Api.Contracts;

public record GameDto(
    int Id,
    string Title,
    string Developer,
    DateOnly ReleaseDate,
    decimal Price,
    int GenreId,
    string GenreName);
