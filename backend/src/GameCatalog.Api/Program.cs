using GameCatalog.Api.Data;
using GameCatalog.Api.Infrastructure;
using GameCatalog.Api.Services;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var applicationRoot = AppContext.BaseDirectory;
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = applicationRoot,
    WebRootPath = Path.Combine(applicationRoot, "wwwroot")
});

// Optional machine-specific overrides (gitignored), e.g. a local connection string.
builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);

builder.Services.AddDbContext<GameCatalogDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("GameCatalog"),
        sqlServerOptions => sqlServerOptions.EnableRetryOnFailure(
            maxRetryCount: 10,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null)));

builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IGenreService, GenreService>();

builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddOpenApi();
builder.Services.AddHealthChecks()
    .AddDbContextCheck<GameCatalogDbContext>(tags: ["ready"]);
builder.Services.AddOutputCache(options =>
{
    options.AddPolicy("GameList", policy => policy
        .Expire(TimeSpan.FromSeconds(60))
        .SetVaryByQuery("search", "genre", "sort", "order", "page", "pageSize")
        .Tag("games"));
    options.AddPolicy("GameItem", policy => policy
        .Expire(TimeSpan.FromSeconds(60))
        .SetVaryByQuery(Array.Empty<string>())
        .Tag("games"));
    options.AddPolicy("Genres", policy => policy
        .Expire(TimeSpan.FromMinutes(10))
        .Tag("genres"));
});

var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy =>
    policy.WithOrigins(corsOrigins).AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler();

// Create/upgrade the database and load sample data so the app runs out of the box.
// In production this is opt-in via the Database:MigrateOnStartup setting.
if (app.Environment.IsDevelopment() || app.Configuration.GetValue<bool>("Database:MigrateOnStartup"))
{
    try
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<GameCatalogDbContext>();
        await db.Database.MigrateAsync();
        await DbSeeder.SeedAsync(db);
    }
    catch (Exception exception)
    {
        // A transient database outage must not prevent the web process from starting.
        // Database requests will keep using the SQL retry policy configured above.
        app.Logger.LogError(
            exception,
            "Database migration or seeding failed during startup. Continuing in degraded mode.");
    }
}

// Static files must run before endpoint routing selects the SPA fallback.
var frontendFiles = new PhysicalFileProvider(Path.Combine(applicationRoot, "wwwroot"));
app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = frontendFiles });
app.UseStaticFiles(new StaticFileOptions { FileProvider = frontendFiles });

app.UseRouting();
app.UseCors("Frontend");
app.UseOutputCache();

// Swagger stays available in production as well: the demo API is public and
// unauthenticated, and interactive docs make the assignment easier to review.
// Registered after UseCors so CORS headers are applied to /swagger/* responses.
app.MapOpenApi();
app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "Game Catalog API"));

// Liveness deliberately excludes external dependencies. Azure can distinguish a
// running application from a database outage without restarting a healthy process.
// Readiness includes the database, so a deployment whose startup migration failed
// (see the degraded-mode catch above) is visibly unhealthy instead of silently broken.
app.MapHealthChecks("/health", new HealthCheckOptions { Predicate = _ => false });
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
});
app.MapControllers();
// Restrict fallback to non-API paths so unrecognised /api/* routes return 404.
app.MapFallbackToFile(
    "{*path:regex(^(?!api/).*$)}",
    "index.html",
    new StaticFileOptions { FileProvider = frontendFiles });

app.Run();
