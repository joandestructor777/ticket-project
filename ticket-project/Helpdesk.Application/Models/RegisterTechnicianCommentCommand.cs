namespace Helpdesk.Application.Models;

public sealed record RegisterTechnicianCommentCommand(
    Guid TechnicianId,
    string Content,
    string RowVersion);