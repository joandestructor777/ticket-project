namespace Helpdesk.Application.Models;

public sealed record TicketCommentResult(
    Guid Id,
    Guid TechnicianId,
    string Content,
    bool IsResolution,
    DateTime CreatedAt);