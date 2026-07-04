using GameCatalog.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace GameCatalog.Api.Data;

/// <summary>
/// Inserts sample games on first run so the catalogue is browsable out of the box.
/// Genres are seeded separately via migrations (see <see cref="GameCatalogDbContext"/>).
/// </summary>
public static class DbSeeder
{
    private const int Action = 1;
    private const int Adventure = 2;
    private const int Rpg = 3;
    private const int Shooter = 4;
    private const int Simulation = 5;
    private const int Strategy = 6;

    public static async Task SeedAsync(GameCatalogDbContext db)
    {
        if (await db.Games.AnyAsync())
        {
            return;
        }

        // 15 games so the default page size of 10 produces a second page out of the box.
        db.Games.AddRange(
            new Game { Title = "Baldur's Gate 3", Developer = "Larian Studios", ReleaseDate = new DateOnly(2023, 8, 3), Price = 59.99m, GenreId = Rpg },
            new Game { Title = "DOOM Eternal", Developer = "id Software", ReleaseDate = new DateOnly(2020, 3, 20), Price = 59.99m, GenreId = Shooter },
            new Game { Title = "Stardew Valley", Developer = "ConcernedApe", ReleaseDate = new DateOnly(2016, 2, 26), Price = 14.99m, GenreId = Simulation },
            new Game { Title = "Sid Meier's Civilization VI", Developer = "Firaxis Games", ReleaseDate = new DateOnly(2016, 10, 21), Price = 59.99m, GenreId = Strategy },
            new Game { Title = "God of War", Developer = "Santa Monica Studio", ReleaseDate = new DateOnly(2018, 4, 20), Price = 49.99m, GenreId = Action },
            new Game { Title = "Hades", Developer = "Supergiant Games", ReleaseDate = new DateOnly(2020, 9, 17), Price = 24.99m, GenreId = Action },
            new Game { Title = "The Legend of Zelda: Breath of the Wild", Developer = "Nintendo", ReleaseDate = new DateOnly(2017, 3, 3), Price = 59.99m, GenreId = Adventure },
            new Game { Title = "Elden Ring", Developer = "FromSoftware", ReleaseDate = new DateOnly(2022, 2, 25), Price = 59.99m, GenreId = Rpg },
            new Game { Title = "Cyberpunk 2077", Developer = "CD Projekt Red", ReleaseDate = new DateOnly(2020, 12, 10), Price = 49.99m, GenreId = Rpg },
            new Game { Title = "Half-Life: Alyx", Developer = "Valve", ReleaseDate = new DateOnly(2020, 3, 23), Price = 59.99m, GenreId = Shooter },
            new Game { Title = "Hollow Knight", Developer = "Team Cherry", ReleaseDate = new DateOnly(2017, 2, 24), Price = 14.99m, GenreId = Adventure },
            new Game { Title = "Red Dead Redemption 2", Developer = "Rockstar Games", ReleaseDate = new DateOnly(2018, 10, 26), Price = 59.99m, GenreId = Action },
            new Game { Title = "StarCraft II: Wings of Liberty", Developer = "Blizzard Entertainment", ReleaseDate = new DateOnly(2010, 7, 27), Price = 19.99m, GenreId = Strategy },
            new Game { Title = "Microsoft Flight Simulator", Developer = "Asobo Studio", ReleaseDate = new DateOnly(2020, 8, 18), Price = 59.99m, GenreId = Simulation },
            new Game { Title = "Portal 2", Developer = "Valve", ReleaseDate = new DateOnly(2011, 4, 19), Price = 9.99m, GenreId = Adventure });

        await db.SaveChangesAsync();
    }
}
