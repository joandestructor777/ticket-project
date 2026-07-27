namespace Helpdesk.Application.Models;

public sealed record TechnicianAvailabilityResult(
    Guid Id,
    string FullName,
    int MaxOpenTickets,
    int ActiveTickets,
    int AvailableCapacity);