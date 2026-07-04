using System.ComponentModel.DataAnnotations;
using GameCatalog.Api.Contracts;

namespace GameCatalog.Api.Tests;

public class ContractValidationTests
{
    [Fact]
    public void SaveGameRequest_RejectsWhitespaceAndMissingReleaseDate()
    {
        var request = new SaveGameRequest
        {
            Title = "   ",
            Developer = "\t",
            GenreId = 1,
            Price = 10m,
        };

        var errors = Validate(request);

        Assert.Contains(errors, error => error.MemberNames.Contains(nameof(request.Title)));
        Assert.Contains(errors, error => error.MemberNames.Contains(nameof(request.Developer)));
        Assert.Contains(errors, error => error.MemberNames.Contains(nameof(request.ReleaseDate)));
    }

    [Fact]
    public void GameQuery_RejectsPageThatCouldOverflowOffset()
    {
        var query = new GameQuery { Page = int.MaxValue, PageSize = 100 };

        Assert.Contains(Validate(query), error => error.MemberNames.Contains(nameof(query.Page)));
    }

    [Fact]
    public void GameQuery_RejectsSearchLongerThanTitleLimit()
    {
        var query = new GameQuery { Search = new string('a', 201) };

        Assert.Contains(Validate(query), error => error.MemberNames.Contains(nameof(query.Search)));
    }

    [Fact]
    public void GameQuery_RejectsGenreLongerThanNameLimit()
    {
        var query = new GameQuery { Genre = new string('a', 101) };

        Assert.Contains(Validate(query), error => error.MemberNames.Contains(nameof(query.Genre)));
    }

    [Fact]
    public void GameQuery_RejectsPageSizeAboveLimit()
    {
        var query = new GameQuery { PageSize = 101 };

        Assert.Contains(Validate(query), error => error.MemberNames.Contains(nameof(query.PageSize)));
    }

    private static List<ValidationResult> Validate(object model)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(model, new ValidationContext(model), results, validateAllProperties: true);
        return results;
    }
}
