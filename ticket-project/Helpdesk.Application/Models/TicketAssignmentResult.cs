namespace Helpdesk.Application.Models;

public sealed record TicketAssignmentResult(
    Guid TicketId,
    Guid TechnicianId,
    string State);