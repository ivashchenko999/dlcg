using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameCatalog.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddGameSortIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Games_Developer",
                table: "Games",
                column: "Developer");

            migrationBuilder.CreateIndex(
                name: "IX_Games_Price",
                table: "Games",
                column: "Price");

            migrationBuilder.CreateIndex(
                name: "IX_Games_ReleaseDate",
                table: "Games",
                column: "ReleaseDate");

            migrationBuilder.CreateIndex(
                name: "IX_Games_Title",
                table: "Games",
                column: "Title");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Games_Developer",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_Games_Price",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_Games_ReleaseDate",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_Games_Title",
                table: "Games");
        }
    }
}
