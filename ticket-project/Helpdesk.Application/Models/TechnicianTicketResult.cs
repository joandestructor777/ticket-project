namespace Helpdesk.Application.Models;

public sealed record TechnicianTicketResult(
    Guid Id,
    string Title,
    string Description,
    string Category,
    string Priority,
    string State,
    DateTime CreationDate,
    DateTime LimitDateSLA,
    DateTime? ResolutionDate,
    string RowVersion,
    IReadOnlyList<TicketCommentResult> Comments);