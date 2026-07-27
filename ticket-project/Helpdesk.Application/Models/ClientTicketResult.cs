namespace Helpdesk.Application.Models;

public sealed record ClientTicketResult(
    Guid Id,
    string Title,
    string Description,
    string Category,
    string Priority,
    string State,
    DateTime CreationDate,
    DateTime LimitDateSla);
