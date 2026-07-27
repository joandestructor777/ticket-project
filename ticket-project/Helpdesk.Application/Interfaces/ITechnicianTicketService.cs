using Helpdesk.Application.Models;

namespace Helpdesk.Application.Interfaces;

public interface ITechnicianTicketService
{
    Task<IReadOnlyList<TechnicianTicketResult>> GetAssignedTicketsAsync(
        Guid technicianId,
        CancellationToken cancellationToken = default);

    Task<TechnicianTicketResult> StartProcessAsync(
        Guid ticketId,
        TechnicianTicketActionCommand command,
        CancellationToken cancellationToken = default);

    Task<TechnicianTicketResult> AddProgressCommentAsync(
        Guid ticketId,
        RegisterTechnicianCommentCommand command,
        CancellationToken cancellationToken = default);

    Task<TechnicianTicketResult> ResolveAsync(
        Guid ticketId,
        RegisterTechnicianCommentCommand command,
        CancellationToken cancellationToken = default);

    Task<TechnicianTicketResult> CloseAsync(
        Guid ticketId,
        TechnicianTicketActionCommand command,
        CancellationToken cancellationToken = default);
}