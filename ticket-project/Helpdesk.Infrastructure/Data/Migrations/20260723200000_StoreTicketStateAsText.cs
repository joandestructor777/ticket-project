using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Helpdesk.Infrastructure.Data.Migrations;

public partial class StoreTicketStateAsText : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AlterColumn<string>(
            name: "State",
            table: "Tickets",
            type: "nvarchar(20)",
            maxLength: 20,
            nullable: false,
            oldClrType: typeof(int),
            oldType: "int");

        migrationBuilder.Sql("""
            UPDATE [Tickets]
            SET [State] = CASE [State]
                WHEN '1' THEN 'Opened'
                WHEN '2' THEN 'Assigned'
                WHEN '3' THEN 'OnProcess'
                WHEN '4' THEN 'Resolved'
                WHEN '5' THEN 'Closed'
                WHEN '6' THEN 'Expired'
                WHEN '7' THEN 'Reopened'
                ELSE [State]
            END;
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("""
            UPDATE [Tickets]
            SET [State] = CASE [State]
                WHEN 'Opened' THEN '1'
                WHEN 'Assigned' THEN '2'
                WHEN 'OnProcess' THEN '3'
                WHEN 'Resolved' THEN '4'
                WHEN 'Closed' THEN '5'
                WHEN 'Expired' THEN '6'
                WHEN 'Reopened' THEN '7'
                ELSE [State]
            END;
            """);

        migrationBuilder.AlterColumn<int>(
            name: "State",
            table: "Tickets",
            type: "int",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(20)",
            oldMaxLength: 20);
    }
}
