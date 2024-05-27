using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class ChangeColumnAmount : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Money",
                table: "Bills",
                newName: "Amount");

            migrationBuilder.RenameColumn(
                name: "Money",
                table: "Bill",
                newName: "Amount");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "Bills",
                newName: "Money");

            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "Bill",
                newName: "Money");
        }
    }
}
