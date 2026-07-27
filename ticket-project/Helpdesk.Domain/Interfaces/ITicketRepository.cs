using Helpdesk.Domain.Entities;

namespace Helpdesk.Domain.Interfaces;

public interface ITicketRepository
{
    Task AddAsync(Ticket ticket, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Ticket>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Ticket>> GetByClientIdAsync(string clientId, CancellationToken cancellationToken = default);
    Task<Ticket?> GetByIdAsync(Guid ticketId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Ticket>> GetOpenTicketsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Ticket>> GetByTechnicianIdAsync(Guid technicianId, CancellationToken cancellationToken = default);
    Task<int> CountActiveTicketsByTechnicianIdAsync(Guid technicianId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Ticket>> GetActiveTicketsWithExpiredSlaAsync(DateTime actualTime);
    Task<IEnumerable<Ticket>> GetResolvedTicketsPastGracePeriodAsync(DateTime limitTime);
    Task UpdateAsync(
        Ticket ticket,
        CancellationToken cancellationToken = default);
}
