namespace Helpdesk.Application.Models;

public sealed record OpenTicketForAssignmentResult(
    Guid Id,
    string Title,
    string Category,
    string Priority,
    DateTime CreationDate,
    DateTime LimitDateSla);