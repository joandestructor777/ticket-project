namespace Helpdesk.Application.Models;

public sealed record CreateClientTicketCommand(string Title, string Description, string Category, string Priority);
