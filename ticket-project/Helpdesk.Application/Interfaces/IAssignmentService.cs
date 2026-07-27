using Helpdesk.Application.Models;

namespace Helpdesk.Application.Interfaces;

public interface IAssignmentService
{
    Task<IReadOnlyList<OpenTicketForAssignmentResult>> GetOpenTicketsAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TechnicianAvailabilityResult>> GetAvailableTechniciansAsync(
        string category,
        bool includeAtCapacityTechnicians = false,
        CancellationToken cancellationToken = default);

    Task<TicketAssignmentResult> AssignAsync(
        Guid ticketId,
        AssignTicketCommand command,
        CancellationToken cancellationToken = default);
}