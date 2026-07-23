using Helpdesk.Domain.Entities;

namespace Helpdesk.Domain.Interfaces;

public interface ITicketRepository
{
    Task AddAsync(Ticket ticket, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Ticket>> GetByClientIdAsync(string clientId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Ticket>> GetActiveTicketsWithExpiredSlaAsync(DateTime actualTime);
    Task UpdateAsync(Ticket ticket);
}
