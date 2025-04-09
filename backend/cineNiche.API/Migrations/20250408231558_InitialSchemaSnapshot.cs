using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cineNiche.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialSchemaSnapshot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // No-op: database schema already exists
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // No-op: don’t drop anything
        }

    }
}
