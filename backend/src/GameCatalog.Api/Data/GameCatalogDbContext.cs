using GameCatalog.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace GameCatalog.Api.Data;

public class GameCatalogDbContext(DbContextOptions<GameCatalogDbContext> options) : DbContext(options)
{
    public DbSet<Game> Games => Set<Game>();

    public DbSet<Genre> Genres => Set<Genre>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Genre>(genre =>
        {
            genre.Property(g => g.Name).HasMaxLength(100);
            genre.HasIndex(g => g.Name).IsUnique();

            // Genres are reference data, so they are seeded through migrations.
            genre.HasData(
                new Genre { Id = 1, Name = "Action" },
                new Genre { Id = 2, Name = "Adventure" },
                new Genre { Id = 3, Name = "RPG" },
                new Genre { Id = 4, Name = "Shooter" },
                new Genre { Id = 5, Name = "Simulation" },
                new Genre { Id = 6, Name = "Strategy" });
        });

        modelBuilder.Entity<Game>(game =>
        {
            game.Property(g => g.Title).HasMaxLength(200);
            game.Property(g => g.Developer).HasMaxLength(200);
            game.Property(g => g.Price).HasPrecision(10, 2);

            // Sortable catalogue columns; the GenreId foreign key is indexed by convention.
            game.HasIndex(g => g.Title);
            game.HasIndex(g => g.Developer);
            game.HasIndex(g => g.ReleaseDate);
            game.HasIndex(g => g.Price);

            game.HasOne(g => g.Genre)
                .WithMany(g => g.Games)
                .HasForeignKey(g => g.GenreId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
