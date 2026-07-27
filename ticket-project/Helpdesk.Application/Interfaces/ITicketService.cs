using Helpdesk.Domain.Entities;

namespace Helpdesk.Application.Interfaces;

public interface ITicketService
{
    Task<IReadOnlyList<Ticket>> GetAllTicketsAsync(
        CancellationToken cancellationToken = default);

    Task<Ticket> ReopenTicketAsync(
        Guid ticketId,
        string justification,
        CancellationToken cancellationToken = default);
}