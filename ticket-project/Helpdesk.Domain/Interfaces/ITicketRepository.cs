using Helpdesk.Domain.Entities;

namespace Helpdesk.Domain.Interfaces;

public interface ITicketRepository
{
    Task<IEnumerable<Ticket>> GetActiveTicketsWithExpiredSlaAsync(DateTime actualTime);
    Task UpdateAsync(Ticket ticket);
}