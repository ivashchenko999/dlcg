using System.ComponentModel.DataAnnotations;

namespace GameCatalog.Api.Contracts;

/// <summary>Payload for creating or updating a game.</summary>
public class SaveGameRequest
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Developer { get; set; } = string.Empty;

    [Required]
    public DateOnly ReleaseDate { get; set; }

    [Range(0, 10000)]
    public decimal Price { get; set; }

    [Range(1, int.MaxValue)]
    public int GenreId { get; set; }
}
