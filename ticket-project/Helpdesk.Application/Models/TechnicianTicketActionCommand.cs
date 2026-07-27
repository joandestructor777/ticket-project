namespace Helpdesk.Application.Models;

public sealed record TechnicianTicketActionCommand(
    Guid TechnicianId,
    string RowVersion);