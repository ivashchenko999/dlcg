namespace GameCatalog.Api.Services;

/// <summary>Thrown when a game refers to a genre that does not exist.</summary>
public class UnknownGenreException(int genreId)
    : Exception($"Genre with id {genreId} does not exist.");
