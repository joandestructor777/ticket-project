using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Enums;

namespace Helpdesk.Application.Interfaces;

public interface ITicketService
{
    Task<IReadOnlyList<Ticket>> GetAllTicketsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Ticket>> GetTicketsByTechnicianAsync(Guid technicianId, CancellationToken cancellationToken = default);
    Task<Ticket> ReopenTicketAsync(Guid ticketId, string justification, CancellationToken cancellationToken = default);
    Task<Ticket> UpdateTicketStatusAsync(Guid ticketId, TicketState newState, string? resolutionComment, CancellationToken cancellationToken = default);
}
