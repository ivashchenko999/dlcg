using GameCatalog.Api.Contracts;
using GameCatalog.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;

namespace GameCatalog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController(IGameService gameService, IOutputCacheStore outputCache) : ControllerBase
{
    [HttpGet]
    [OutputCache(PolicyName = "Games")]
    public async Task<PagedResult<GameDto>> GetAll([FromQuery] GameQuery query, CancellationToken cancellationToken) =>
        await gameService.GetAllAsync(query, cancellationToken);

    [HttpGet("{id:int}")]
    [OutputCache(PolicyName = "Games")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GameDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var game = await gameService.GetByIdAsync(id, cancellationToken);
        return game is null ? NotFound() : game;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<GameDto>> Create(SaveGameRequest request, CancellationToken cancellationToken)
    {
        var created = await gameService.CreateAsync(request, cancellationToken);
        await outputCache.EvictByTagAsync("games", cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GameDto>> Update(int id, SaveGameRequest request, CancellationToken cancellationToken)
    {
        var updated = await gameService.UpdateAsync(id, request, cancellationToken);
        if (updated is not null)
        {
            await outputCache.EvictByTagAsync("games", cancellationToken);
        }
        return updated is null ? NotFound() : updated;
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        if (!await gameService.DeleteAsync(id, cancellationToken))
        {
            return NotFound();
        }

        await outputCache.EvictByTagAsync("games", cancellationToken);
        return NoContent();
    }
}
