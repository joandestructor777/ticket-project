namespace Helpdesk.Application.Models;

public sealed record CreateTechnicianCommand(
    string FullName,
    int MaxOpenTickets,
    IReadOnlyList<string>? Specialties);