using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class FixReportRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_Employees_EmployeeId1",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_EmployeeId1",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "EmployeeId1",
                table: "Reports");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EmployeeId1",
                table: "Reports",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Reports_EmployeeId1",
                table: "Reports",
                column: "EmployeeId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_Employees_EmployeeId1",
                table: "Reports",
                column: "EmployeeId1",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
