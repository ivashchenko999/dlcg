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

        // 100 games (10 pages) so pagination, its ellipses, and sorting are
        // exercised with realistic data out of the box.
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
            new Game { Title = "Portal 2", Developer = "Valve", ReleaseDate = new DateOnly(2011, 4, 19), Price = 9.99m, GenreId = Adventure },
            new Game { Title = "The Elder Scrolls V: Skyrim", Developer = "Bethesda Game Studios", ReleaseDate = new DateOnly(2011, 11, 11), Price = 19.99m, GenreId = Rpg },
            new Game { Title = "Dark Souls III", Developer = "FromSoftware", ReleaseDate = new DateOnly(2016, 4, 12), Price = 59.99m, GenreId = Rpg },
            new Game { Title = "Mass Effect 2", Developer = "BioWare", ReleaseDate = new DateOnly(2010, 1, 26), Price = 19.99m, GenreId = Rpg },
            new Game { Title = "Dragon Age: Inquisition", Developer = "BioWare", ReleaseDate = new DateOnly(2014, 11, 18), Price = 39.99m, GenreId = Rpg },
            new Game { Title = "Persona 5 Royal", Developer = "Atlus", ReleaseDate = new DateOnly(2020, 3, 31), Price = 59.99m, GenreId = Rpg },
            new Game { Title = "Final Fantasy VII Remake Intergrade", Developer = "Square Enix", ReleaseDate = new DateOnly(2021, 6, 10), Price = 69.99m, GenreId = Rpg },
            new Game { Title = "Divinity: Original Sin 2", Developer = "Larian Studios", ReleaseDate = new DateOnly(2017, 9, 14), Price = 44.99m, GenreId = Rpg },
            new Game { Title = "Fallout: New Vegas", Developer = "Obsidian Entertainment", ReleaseDate = new DateOnly(2010, 10, 19), Price = 9.99m, GenreId = Rpg },
            new Game { Title = "Diablo IV", Developer = "Blizzard Entertainment", ReleaseDate = new DateOnly(2023, 6, 5), Price = 69.99m, GenreId = Rpg },
            new Game { Title = "Disco Elysium", Developer = "ZA/UM", ReleaseDate = new DateOnly(2019, 10, 15), Price = 39.99m, GenreId = Rpg },
            new Game { Title = "Monster Hunter: World", Developer = "Capcom", ReleaseDate = new DateOnly(2018, 1, 26), Price = 29.99m, GenreId = Rpg },
            new Game { Title = "NieR: Automata", Developer = "PlatinumGames", ReleaseDate = new DateOnly(2017, 3, 17), Price = 39.99m, GenreId = Rpg },
            new Game { Title = "Octopath Traveler", Developer = "Square Enix", ReleaseDate = new DateOnly(2018, 7, 13), Price = 59.99m, GenreId = Rpg },
            new Game { Title = "Undertale", Developer = "Toby Fox", ReleaseDate = new DateOnly(2015, 9, 15), Price = 9.99m, GenreId = Rpg },
            new Game { Title = "Grand Theft Auto V", Developer = "Rockstar North", ReleaseDate = new DateOnly(2013, 9, 17), Price = 29.99m, GenreId = Action },
            new Game { Title = "Devil May Cry 5", Developer = "Capcom", ReleaseDate = new DateOnly(2019, 3, 8), Price = 29.99m, GenreId = Action },
            new Game { Title = "Sekiro: Shadows Die Twice", Developer = "FromSoftware", ReleaseDate = new DateOnly(2019, 3, 22), Price = 59.99m, GenreId = Action },
            new Game { Title = "Ghost of Tsushima", Developer = "Sucker Punch Productions", ReleaseDate = new DateOnly(2020, 7, 17), Price = 59.99m, GenreId = Action },
            new Game { Title = "Marvel's Spider-Man Remastered", Developer = "Insomniac Games", ReleaseDate = new DateOnly(2022, 8, 12), Price = 49.99m, GenreId = Action },
            new Game { Title = "Batman: Arkham City", Developer = "Rocksteady Studios", ReleaseDate = new DateOnly(2011, 10, 18), Price = 19.99m, GenreId = Action },
            new Game { Title = "Dead Cells", Developer = "Motion Twin", ReleaseDate = new DateOnly(2018, 8, 7), Price = 24.99m, GenreId = Action },
            new Game { Title = "Cuphead", Developer = "Studio MDHR", ReleaseDate = new DateOnly(2017, 9, 29), Price = 19.99m, GenreId = Action },
            new Game { Title = "Katana ZERO", Developer = "Askiisoft", ReleaseDate = new DateOnly(2019, 4, 18), Price = 14.99m, GenreId = Action },
            new Game { Title = "Metal Gear Rising: Revengeance", Developer = "PlatinumGames", ReleaseDate = new DateOnly(2013, 2, 19), Price = 29.99m, GenreId = Action },
            new Game { Title = "Middle-earth: Shadow of Mordor", Developer = "Monolith Productions", ReleaseDate = new DateOnly(2014, 9, 30), Price = 19.99m, GenreId = Action },
            new Game { Title = "Assassin's Creed Odyssey", Developer = "Ubisoft Quebec", ReleaseDate = new DateOnly(2018, 10, 5), Price = 59.99m, GenreId = Action },
            new Game { Title = "Horizon Zero Dawn", Developer = "Guerrilla Games", ReleaseDate = new DateOnly(2017, 2, 28), Price = 49.99m, GenreId = Action },
            new Game { Title = "Bayonetta", Developer = "PlatinumGames", ReleaseDate = new DateOnly(2010, 1, 5), Price = 19.99m, GenreId = Action },
            new Game { Title = "Celeste", Developer = "Extremely OK Games", ReleaseDate = new DateOnly(2018, 1, 25), Price = 19.99m, GenreId = Adventure },
            new Game { Title = "Firewatch", Developer = "Campo Santo", ReleaseDate = new DateOnly(2016, 2, 9), Price = 19.99m, GenreId = Adventure },
            new Game { Title = "Ori and the Blind Forest", Developer = "Moon Studios", ReleaseDate = new DateOnly(2015, 3, 11), Price = 19.99m, GenreId = Adventure },
            new Game { Title = "Ori and the Will of the Wisps", Developer = "Moon Studios", ReleaseDate = new DateOnly(2020, 3, 11), Price = 29.99m, GenreId = Adventure },
            new Game { Title = "Inside", Developer = "Playdead", ReleaseDate = new DateOnly(2016, 6, 29), Price = 19.99m, GenreId = Adventure },
            new Game { Title = "Limbo", Developer = "Playdead", ReleaseDate = new DateOnly(2010, 7, 21), Price = 9.99m, GenreId = Adventure },
            new Game { Title = "Journey", Developer = "Thatgamecompany", ReleaseDate = new DateOnly(2012, 3, 13), Price = 14.99m, GenreId = Adventure },
            new Game { Title = "It Takes Two", Developer = "Hazelight Studios", ReleaseDate = new DateOnly(2021, 3, 26), Price = 39.99m, GenreId = Adventure },
            new Game { Title = "Uncharted 4: A Thief's End", Developer = "Naughty Dog", ReleaseDate = new DateOnly(2016, 5, 10), Price = 39.99m, GenreId = Adventure },
            new Game { Title = "Life is Strange", Developer = "Dontnod Entertainment", ReleaseDate = new DateOnly(2015, 1, 30), Price = 19.99m, GenreId = Adventure },
            new Game { Title = "What Remains of Edith Finch", Developer = "Giant Sparrow", ReleaseDate = new DateOnly(2017, 4, 25), Price = 19.99m, GenreId = Adventure },
            new Game { Title = "Return of the Obra Dinn", Developer = "Lucas Pope", ReleaseDate = new DateOnly(2018, 10, 18), Price = 19.99m, GenreId = Adventure },
            new Game { Title = "Outer Wilds", Developer = "Mobius Digital", ReleaseDate = new DateOnly(2019, 5, 28), Price = 24.99m, GenreId = Adventure },
            new Game { Title = "Subnautica", Developer = "Unknown Worlds Entertainment", ReleaseDate = new DateOnly(2018, 1, 23), Price = 29.99m, GenreId = Adventure },
            new Game { Title = "Psychonauts 2", Developer = "Double Fine Productions", ReleaseDate = new DateOnly(2021, 8, 25), Price = 59.99m, GenreId = Adventure },
            new Game { Title = "Half-Life 2", Developer = "Valve", ReleaseDate = new DateOnly(2004, 11, 16), Price = 9.99m, GenreId = Shooter },
            new Game { Title = "Titanfall 2", Developer = "Respawn Entertainment", ReleaseDate = new DateOnly(2016, 10, 28), Price = 29.99m, GenreId = Shooter },
            new Game { Title = "Overwatch", Developer = "Blizzard Entertainment", ReleaseDate = new DateOnly(2016, 5, 24), Price = 39.99m, GenreId = Shooter },
            new Game { Title = "BioShock Infinite", Developer = "Irrational Games", ReleaseDate = new DateOnly(2013, 3, 26), Price = 29.99m, GenreId = Shooter },
            new Game { Title = "Metro Exodus", Developer = "4A Games", ReleaseDate = new DateOnly(2019, 2, 15), Price = 39.99m, GenreId = Shooter },
            new Game { Title = "Borderlands 2", Developer = "Gearbox Software", ReleaseDate = new DateOnly(2012, 9, 18), Price = 19.99m, GenreId = Shooter },
            new Game { Title = "Wolfenstein: The New Order", Developer = "MachineGames", ReleaseDate = new DateOnly(2014, 5, 20), Price = 19.99m, GenreId = Shooter },
            new Game { Title = "Far Cry 3", Developer = "Ubisoft Montreal", ReleaseDate = new DateOnly(2012, 11, 29), Price = 19.99m, GenreId = Shooter },
            new Game { Title = "Halo Infinite", Developer = "343 Industries", ReleaseDate = new DateOnly(2021, 12, 8), Price = 59.99m, GenreId = Shooter },
            new Game { Title = "Call of Duty 4: Modern Warfare", Developer = "Infinity Ward", ReleaseDate = new DateOnly(2007, 11, 7), Price = 19.99m, GenreId = Shooter },
            new Game { Title = "DOOM", Developer = "id Software", ReleaseDate = new DateOnly(2016, 5, 13), Price = 29.99m, GenreId = Shooter },
            new Game { Title = "Prey", Developer = "Arkane Studios", ReleaseDate = new DateOnly(2017, 5, 5), Price = 29.99m, GenreId = Shooter },
            new Game { Title = "Superhot", Developer = "Superhot Team", ReleaseDate = new DateOnly(2016, 2, 25), Price = 24.99m, GenreId = Shooter },
            new Game { Title = "Deep Rock Galactic", Developer = "Ghost Ship Games", ReleaseDate = new DateOnly(2020, 5, 13), Price = 29.99m, GenreId = Shooter },
            new Game { Title = "The Sims 4", Developer = "Maxis", ReleaseDate = new DateOnly(2014, 9, 2), Price = 39.99m, GenreId = Simulation },
            new Game { Title = "Cities: Skylines", Developer = "Colossal Order", ReleaseDate = new DateOnly(2015, 3, 10), Price = 29.99m, GenreId = Simulation },
            new Game { Title = "Planet Coaster", Developer = "Frontier Developments", ReleaseDate = new DateOnly(2016, 11, 17), Price = 44.99m, GenreId = Simulation },
            new Game { Title = "Two Point Hospital", Developer = "Two Point Studios", ReleaseDate = new DateOnly(2018, 8, 30), Price = 34.99m, GenreId = Simulation },
            new Game { Title = "Farming Simulator 22", Developer = "GIANTS Software", ReleaseDate = new DateOnly(2021, 11, 22), Price = 39.99m, GenreId = Simulation },
            new Game { Title = "Euro Truck Simulator 2", Developer = "SCS Software", ReleaseDate = new DateOnly(2012, 10, 18), Price = 19.99m, GenreId = Simulation },
            new Game { Title = "Kerbal Space Program", Developer = "Squad", ReleaseDate = new DateOnly(2015, 4, 27), Price = 39.99m, GenreId = Simulation },
            new Game { Title = "Factorio", Developer = "Wube Software", ReleaseDate = new DateOnly(2020, 8, 14), Price = 35.00m, GenreId = Simulation },
            new Game { Title = "Satisfactory", Developer = "Coffee Stain Studios", ReleaseDate = new DateOnly(2024, 9, 10), Price = 39.99m, GenreId = Simulation },
            new Game { Title = "RimWorld", Developer = "Ludeon Studios", ReleaseDate = new DateOnly(2018, 10, 17), Price = 34.99m, GenreId = Simulation },
            new Game { Title = "Oxygen Not Included", Developer = "Klei Entertainment", ReleaseDate = new DateOnly(2019, 7, 30), Price = 24.99m, GenreId = Simulation },
            new Game { Title = "PowerWash Simulator", Developer = "FuturLab", ReleaseDate = new DateOnly(2022, 7, 14), Price = 24.99m, GenreId = Simulation },
            new Game { Title = "Planet Zoo", Developer = "Frontier Developments", ReleaseDate = new DateOnly(2019, 11, 5), Price = 44.99m, GenreId = Simulation },
            new Game { Title = "Football Manager 2024", Developer = "Sports Interactive", ReleaseDate = new DateOnly(2023, 11, 6), Price = 59.99m, GenreId = Simulation },
            new Game { Title = "Age of Empires II: Definitive Edition", Developer = "Forgotten Empires", ReleaseDate = new DateOnly(2019, 11, 14), Price = 19.99m, GenreId = Strategy },
            new Game { Title = "Age of Empires IV", Developer = "Relic Entertainment", ReleaseDate = new DateOnly(2021, 10, 28), Price = 59.99m, GenreId = Strategy },
            new Game { Title = "Total War: WARHAMMER III", Developer = "Creative Assembly", ReleaseDate = new DateOnly(2022, 2, 17), Price = 59.99m, GenreId = Strategy },
            new Game { Title = "XCOM 2", Developer = "Firaxis Games", ReleaseDate = new DateOnly(2016, 2, 5), Price = 59.99m, GenreId = Strategy },
            new Game { Title = "Into the Breach", Developer = "Subset Games", ReleaseDate = new DateOnly(2018, 2, 27), Price = 14.99m, GenreId = Strategy },
            new Game { Title = "FTL: Faster Than Light", Developer = "Subset Games", ReleaseDate = new DateOnly(2012, 9, 14), Price = 9.99m, GenreId = Strategy },
            new Game { Title = "Slay the Spire", Developer = "Mega Crit", ReleaseDate = new DateOnly(2019, 1, 23), Price = 24.99m, GenreId = Strategy },
            new Game { Title = "Crusader Kings III", Developer = "Paradox Development Studio", ReleaseDate = new DateOnly(2020, 9, 1), Price = 49.99m, GenreId = Strategy },
            new Game { Title = "Stellaris", Developer = "Paradox Development Studio", ReleaseDate = new DateOnly(2016, 5, 9), Price = 39.99m, GenreId = Strategy },
            new Game { Title = "Sid Meier's Civilization V", Developer = "Firaxis Games", ReleaseDate = new DateOnly(2010, 9, 21), Price = 29.99m, GenreId = Strategy },
            new Game { Title = "Warcraft III: Reign of Chaos", Developer = "Blizzard Entertainment", ReleaseDate = new DateOnly(2002, 7, 3), Price = 29.99m, GenreId = Strategy },
            new Game { Title = "Anno 1800", Developer = "Ubisoft Mainz", ReleaseDate = new DateOnly(2019, 4, 16), Price = 59.99m, GenreId = Strategy },
            new Game { Title = "Northgard", Developer = "Shiro Games", ReleaseDate = new DateOnly(2018, 3, 7), Price = 29.99m, GenreId = Strategy },
            new Game { Title = "Frostpunk", Developer = "11 bit studios", ReleaseDate = new DateOnly(2018, 4, 24), Price = 29.99m, GenreId = Strategy });

        await db.SaveChangesAsync();
    }
}
