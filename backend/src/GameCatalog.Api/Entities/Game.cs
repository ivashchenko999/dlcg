namespace GameCatalog.Api.Entities;

public class Game
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public required string Developer { get; set; }

    public DateOnly ReleaseDate { get; set; }

    public decimal Price { get; set; }

    public int GenreId { get; set; }

    public Genre? Genre { get; set; }
}
