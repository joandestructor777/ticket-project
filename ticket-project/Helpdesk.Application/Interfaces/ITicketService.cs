using Helpdesk.Domain.Entities;

namespace Helpdesk.Application.Interfaces;

public interface ITicketService
{
    Task<IEnumerable<Ticket>> GetAllTicketsAsync();
    Task<Ticket> ReopenTicketAsync(Guid ticketId, string justification);
}
