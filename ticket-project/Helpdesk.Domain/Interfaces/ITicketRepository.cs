using Helpdesk.Domain.Entities;

namespace Helpdesk.Domain.Interfaces;

public interface ITicketRepository
{
    Task<Ticket?> GetByIdAsync(Guid id);
    Task<IEnumerable<Ticket>> GetAllAsync();
    Task<IEnumerable<Ticket>> GetActiveTicketsWithExpiredSlaAsync(DateTime actualTime);
    Task<IEnumerable<Ticket>> GetResolvedTicketsPastGracePeriodAsync(DateTime limitTime);
    Task<string?> GetSystemSettingAsync(string key);
    Task UpdateAsync(Ticket ticket);
}