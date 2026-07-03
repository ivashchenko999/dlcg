using GameCatalog.Api.Contracts;
using GameCatalog.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GameCatalog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenresController(IGenreService genreService) : ControllerBase
{
    [HttpGet]
    public async Task<IReadOnlyList<GenreDto>> GetAll(CancellationToken cancellationToken) =>
        await genreService.GetAllAsync(cancellationToken);
}
