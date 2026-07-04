using GameCatalog.Api.Infrastructure;
using GameCatalog.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GameCatalog.Api.Tests;

public class GlobalExceptionHandlerTests
{
    [Fact]
    public async Task TryHandleAsync_UnknownGenreException_WritesBadRequestProblemDetails()
    {
        var problemDetailsService = new RecordingProblemDetailsService();
        var handler = new GlobalExceptionHandler(problemDetailsService);
        var httpContext = new DefaultHttpContext();

        var handled = await handler.TryHandleAsync(
            httpContext, new UnknownGenreException(999), CancellationToken.None);

        Assert.True(handled);
        Assert.Equal(StatusCodes.Status400BadRequest, httpContext.Response.StatusCode);
        Assert.NotNull(problemDetailsService.WrittenProblemDetails);
        Assert.Equal(StatusCodes.Status400BadRequest, problemDetailsService.WrittenProblemDetails.Status);
        Assert.Contains("999", problemDetailsService.WrittenProblemDetails.Detail);
    }

    [Fact]
    public async Task TryHandleAsync_OtherExceptions_FallThroughToFrameworkDefault()
    {
        var problemDetailsService = new RecordingProblemDetailsService();
        var handler = new GlobalExceptionHandler(problemDetailsService);
        var httpContext = new DefaultHttpContext();

        var handled = await handler.TryHandleAsync(
            httpContext, new InvalidOperationException("boom"), CancellationToken.None);

        Assert.False(handled);
        Assert.Null(problemDetailsService.WrittenProblemDetails);
        Assert.Equal(StatusCodes.Status200OK, httpContext.Response.StatusCode);
    }

    private sealed class RecordingProblemDetailsService : IProblemDetailsService
    {
        public ProblemDetails? WrittenProblemDetails { get; private set; }

        public ValueTask WriteAsync(ProblemDetailsContext context)
        {
            WrittenProblemDetails = context.ProblemDetails;
            return ValueTask.CompletedTask;
        }

        public ValueTask<bool> TryWriteAsync(ProblemDetailsContext context)
        {
            WrittenProblemDetails = context.ProblemDetails;
            return ValueTask.FromResult(true);
        }
    }
}
