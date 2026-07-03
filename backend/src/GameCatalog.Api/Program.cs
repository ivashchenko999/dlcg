using GameCatalog.Api.Data;
using GameCatalog.Api.Infrastructure;
using GameCatalog.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Optional machine-specific overrides (gitignored), e.g. a local connection string.
builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);

builder.Services.AddDbContext<GameCatalogDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("GameCatalog")));

builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IGenreService, GenreService>();

builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddOpenApi();

var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy =>
    policy.WithOrigins(corsOrigins).AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "Game Catalog API"));

    // Create/upgrade the database and load sample data so the app runs out of the box.
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<GameCatalogDbContext>();
    await db.Database.MigrateAsync();
    await DbSeeder.SeedAsync(db);
}

app.UseCors("Frontend");

app.MapControllers();

app.Run();
