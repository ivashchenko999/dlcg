using GameCatalog.Api.Contracts;
using GameCatalog.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace GameCatalog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController(IGameService gameService) : ControllerBase
{
    [HttpGet]
    public async Task<PagedResult<GameDto>> GetAll([FromQuery] GameQuery query, CancellationToken cancellationToken) =>
        await gameService.GetAllAsync(query, cancellationToken);

    [HttpGet("{id:int}")]
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
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GameDto>> Update(int id, SaveGameRequest request, CancellationToken cancellationToken)
    {
        var updated = await gameService.UpdateAsync(id, request, cancellationToken);
        return updated is null ? NotFound() : updated;
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken) =>
        await gameService.DeleteAsync(id, cancellationToken) ? NoContent() : NotFound();
}
