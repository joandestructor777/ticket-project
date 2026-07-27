namespace Helpdesk.Application.Models;

public sealed record AssignTicketCommand(
    Guid TechnicianId,
    bool ForceAssignment = false);