namespace Helpdesk.Application.Models;

public sealed record TechnicianResult(
    Guid Id,
    string FullName,
    int MaxOpenTickets,
    bool IsActive,
    IReadOnlyList<string> Specialties);