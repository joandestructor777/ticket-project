namespace Helpdesk.Application.Models;

public sealed record CreatedTicketResult(Guid Id, DateTime LimitDateSla);
